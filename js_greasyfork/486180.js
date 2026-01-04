// ==UserScript==
// @name         LZT Summarize
// @namespace    lztup-summarize
// @version      1.1.0
// @description  Summarize a large topic to find out if you need it
// @author       Toil
// @license      MIT
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*
// @icon         https://cdn.lztup.net/brand/logo-mini.png
// @supportURL   https://lolz.live/threads/6149539
// @homepageURL  https://github.com/lzt-upgrade/lzt-summarize
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      summarize.toil.cc
// @downloadURL https://update.greasyfork.org/scripts/486180/LZT%20Summarize.user.js
// @updateURL https://update.greasyfork.org/scripts/486180/LZT%20Summarize.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
.LZTUpSummarizeThreadBar {
  background: rgb(39, 39, 39);
  padding: 15px 20px;
  margin-top: 15px;
  border-radius: 10px;
  height: auto;
}

.LZTUpSummarizeThreadBarTitle {
  font-weight: bold;
  font-size: 18px;
  padding: 0;
  margin: 0 0 2px;
  line-height: 33px;
  overflow: hidden;
}

.LZTUpSummarizeThreadBarContent {
  font-size: 14px;
}

.LZTUpSummarizeThesises {
  margin-left: 16px;
}

.LZTUpSummarizeThesises li {
  list-style: decimal;
  margin: 2px 0;
  line-height: 20px;
}`);

  const SUMMARIZE_URL = "https://summarize.toil.cc/v2/summarize/text";
  const SUMMARIZE_TITLE = "<i class='fas fa-sparkles'></i> Суммаризатор тем";
  const yandexStatus = {
    StatusInProgress: 1,
    StatusSuccess: 2,
    StatusError: 3,
  };

  class SummarizeStatus {
    static Waiting = new SummarizeStatus("waiting").name;
    static Error = new SummarizeStatus("error").name;
    static Success = new SummarizeStatus("success").name;

    constructor(name) {
      this.name = name;
    }
  }

  async function GM_fetch(url, opts = {}) {
    const {
      timeout = 15000, ...fetchOptions
    } = opts;

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: fetchOptions.method || "GET",
        url,
        data: fetchOptions.body,
        timeout,
        headers: fetchOptions.headers || {},
        onload: (resp) => {
          const headers = resp.responseHeaders
            .split(/\r?\n/)
            .reduce((acc, line) => {
              const [, key, value] = line.match(/^([\w-]+): (.+)$/) || [];
              if (key) {
                acc[key] = value;
              }
              return acc;
            }, {});

          const response = new Response(resp.response, {
            status: resp.status,
            headers: headers,
          });
          // Response have empty url by default
          // this need to get same response url as in classic fetch
          Object.defineProperty(response, "url", {
            value: resp.finalUrl ?? "",
          });

          resolve(response);
        },
        ontimeout: () => reject(new Error("Timeout")),
        onerror: (error) => reject(new Error(error)),
        onabort: () => reject(new Error("AbortError")),
      });
    });
  }

  function checkSummarizeCode(res) {
    switch (res.statusCode) {
      case yandexStatus.StatusInProgress:
        return {
          status: SummarizeStatus.Waiting,
            title: "Суммаризация...",
            thesis: res.thesis.length ?
            res.thesis : [{
              id: 0,
              content: `Ожидание окончания суммаризации текста`,
            }],
        };
      case yandexStatus.StatusError:
        return {
          status: SummarizeStatus.Error,
            title: "Ошибка YandexGPT",
            thesis: [{
              id: 0,
              content: "Возникла ошибка при суммаризации текста",
            }],
        };
      case yandexStatus.StatusSuccess:
        return {
          status: SummarizeStatus.Success,
            title: "Успех",
            thesis: res.thesis,
        };
      default:
        return {
          status: SummarizeStatus.Error,
            title: "Неизвестная ошибка",
            thesis: [{
              id: 0,
              content: "Во время выполнения что-то пошло не так и из-за этого не удалось определить результат суммаризации",
            }],
        };
    }
  }

  async function genSummarize(text, sessionId) {
    try {
      const res = await GM_fetch(SUMMARIZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return await res.json();
    } catch (err) {
      console.error(
        "[LZT Summarize] Failed to generate a summarize of the text",
        err,
      );
      return false;
    }
  }

  function getThreadContent() {
    return document
      .querySelector(".message.firstPost > .messageInfo article .messageText")
      ?.textContent?.trim();
  }

  async function getThreadContentByAjax(threadId) {
    try {
      const res = await XenForo.ajax(`/threads/${threadId}`);
      const resHTML = res.templateHtml;

      const parser = new DOMParser();
      const parsedHTML = parser.parseFromString(resHTML, "text/html");
      const text = parsedHTML.querySelector(
        ".message.firstPost > .messageInfo article .messageText",
      )?.innerText;

      return text;
    } catch {
      return undefined;
    }
  }

  function clearSummarizeContent(text) {
    // replace \n, \t, \r to basic spaces
    // replace ip to void (many ips in text = server error)
    return text
      .replaceAll(/\s/g, " ")
      .replaceAll(/((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}/g, "");
  }

  function createThreadBar(title, content) {
    const container = document.createElement("div");
    container.classList.add("LZTUpSummarizeThreadBar");

    const titleEl = document.createElement("h2");
    titleEl.classList.add("LZTUpSummarizeThreadBarTitle");
    titleEl.innerHTML = title;

    const contentEl = document.createElement("p");
    contentEl.classList.add("LZTUpSummarizeThreadBarContent", "muted");
    contentEl.innerHTML = content;

    container.append(titleEl, contentEl);

    return {
      container,
      title: titleEl,
      content: contentEl,
    };
  }

  async function summarize(
    summarizeBlock,
    threadContent,
    sessionId,
    timer = null,
  ) {
    clearTimeout(timer);
    const generatedInfo = await genSummarize(threadContent, sessionId);
    // console.debug("[LZT Summarize] Summarize Generated Info", generatedInfo);
    if (!generatedInfo) {
      console.error("[LZT Summarize] Clear summarize interval (ext error)");
      summarizeBlock.title.innerHTML = `${SUMMARIZE_TITLE} (Внутренняя ошибка)`;
      summarizeBlock.content.innerText =
        "Не удалось выполнить суммаризацию темы. Произошла внутренняя ошибка при запросе к Summarize API. Для детальной информации смотри консоль.";
      return false;
    }

    sessionId = generatedInfo.sessionId;
    const result = checkSummarizeCode(generatedInfo);
    const contentEl = document.createElement("ul");
    if (result.thesis.length > 1) {
      contentEl.classList.add("LZTUpSummarizeThesises");
    }

    for (const thesis of result.thesis) {
      const thesisEl = document.createElement("li");
      thesisEl.innerText = thesis.content;
      contentEl.appendChild(thesisEl);
    }

    summarizeBlock.title.innerHTML = `${SUMMARIZE_TITLE} (${result.title})`;
    summarizeBlock.content.innerHTML = contentEl.outerHTML;
    if (result.status !== SummarizeStatus.Waiting) {
      return true;
    }

    return new Promise((resolve) => {
      timer = setTimeout(async () => {
        resolve(
          await summarize(summarizeBlock, threadContent, sessionId, timer),
        );
      }, generatedInfo.pollIntervalMs);
    });
  }

  async function summarizeThreadBlock() {
    let threadContent = getThreadContent();

    const summarizeBlock = createThreadBar(
      SUMMARIZE_TITLE,
      "Получение данных...",
    );
    const pageNavLinkGroup = document.querySelector(".pageNavLinkGroup");
    pageNavLinkGroup.before(summarizeBlock.container);

    if (threadContent === undefined) {
      // getting content about a topic if current page isn't 1st page
      const threadId =
        Number(window.location.pathname.match(/^\/threads\/([^d]+)\//)?. [1]) ||
        undefined;
      threadContent = await getThreadContentByAjax(threadId);
    }

    if (!(threadContent?.length >= 300)) {
      summarizeBlock.title.innerHTML = `${SUMMARIZE_TITLE} (Ошибка валидации)`;
      summarizeBlock.content.innerText =
        "Не удалось выполнить суммаризацию темы. Содержимое темы не найдено или содержит менее 300 символов.";
      return false;
    }

    threadContent = clearSummarizeContent(threadContent);
    return await summarize(summarizeBlock, threadContent);
  }

  summarizeThreadBlock();
})();