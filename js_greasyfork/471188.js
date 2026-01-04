// ==UserScript==
// @name         微信读书 备份html
// @namespace    https://github.com/Sec-ant/weread-scraper
// @version      1.1.0
// @author       懒人找资源（改）
// @description  备份微信读书为html，在原作者Sec-ant的基础上进行汉化和增加页面按钮
// @license      MIT
// @icon         https://weread.qq.com/favicon.ico
// @homepage     https://lazybook.netlify.app/#/
// @homepageURL  https://lazybook.netlify.app/#/
// @match        https://weread.qq.com/web/reader/*
// @match        https://weread.qq.com/web/book/read*
// @match        https://weread.qq.com/web/book/chapter/e_*
// @require      https://fastly.jsdelivr.net/npm/zustand@4.3.9/umd/vanilla.production.js
// @require      https://fastly.jsdelivr.net/npm/zustand@4.3.9/umd/middleware.production.js
// @require      https://fastly.jsdelivr.net/npm/html-minifier-terser@7.2.0/dist/htmlminifier.umd.bundle.min.js
// @require      https://fastly.jsdelivr.net/npm/@trim21/gm-fetch@0.1.15/dist/gm_fetch.min.js
// @connect      weread.qq.com
// @connect      tencent-cloud.com
// @connect      *
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_webRequest
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471188/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20%E5%A4%87%E4%BB%BDhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/471188/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20%E5%A4%87%E4%BB%BDhtml.meta.js
// ==/UserScript==

(function (GM_fetch, vanilla, middleware, htmlMinifierTerser) {
  'use strict';

  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
  var concatenateTemplateLiteralTag = function concatenateTemplateLiteralTag2(raw) {
    return String.raw.apply(String, [{
      raw
    }].concat([].slice.call(arguments, 1)));
  };
  var any = concatenateTemplateLiteralTag;
  const stylePreset = any`
  @font-face {
    font-family: "汉仪旗黑50S";
    src: url("https://fastly.jsdelivr.net/gh/Sec-ant/weread-scraper/public/fonts/HYQiHei_50S.woff2")
      format("woff2");
  }
  @font-face {
    font-family: "汉仪旗黑65S";
    src: url("https://fastly.jsdelivr.net/gh/Sec-ant/weread-scraper/public/fonts/HYQiHei_65S.woff2")
      format("woff2");
  }
  @font-face {
    font-family: "汉仪楷体";
    src: url("https://fastly.jsdelivr.net/gh/Sec-ant/weread-scraper/public/fonts/HYKaiTiS.woff2")
      format("woff2");
  }
  @font-face {
    font-family: "方正仿宋";
    src: url("https://fastly.jsdelivr.net/gh/Sec-ant/weread-scraper/public/fonts/FZFSJW.woff2")
      format("woff2");
  }
  @font-face {
    font-family: "PingFang SC";
    src: url("https://fastly.jsdelivr.net/gh/Sec-ant/weread-scraper/public/fonts/PingFang-SC-Regular.woff2")
      format("woff2");
  }
  .readerChapterContent {
    break-after: page;
    /* 支持旧版本浏览器 */
    page-break-after: always;
  }
`;
  const htmlElement = document.createElement("html");
  const headElement = document.createElement("head");
  const styleElement = document.createElement("style");
  const bodyElement = document.createElement("body");
  headElement.insertAdjacentHTML("beforeend", any`<meta charset="utf-8" />`);
  headElement.append(styleElement);
  htmlElement.append(headElement, bodyElement);
  const preRenderContainerObserver = new MutationObserver(async () => {
    const preRenderContainer = document.querySelector(
      ".preRenderContainer:not([style])"
    );
    if (!preRenderContainer) {
      return;
    }
    const preRenderContent = preRenderContainer.querySelector("#preRenderContent");
    if (!preRenderContent) {
      return;
    }
    scraperPageStore.setState({
      preRenderContainer: preRenderContainer.cloneNode(
        true
      )
    });
  });
  const scraperSessionInitialState = {
    scraping: false
  };
  const scraperSessionStore = vanilla.createStore()(
    middleware.subscribeWithSelector(
      middleware.persist(() => scraperSessionInitialState, {
        name: "scraper-session-storage",
        storage: middleware.createJSONStorage(() => sessionStorage)
      })
    )
  );
  const GMStorage = {
    getItem: (name) => {
      return _GM_getValue(name);
    },
    setItem: (name, value) => {
      _GM_setValue(name, value);
    },
    removeItem: (name) => {
      _GM_deleteValue(name);
    }
  };
  const scraperGMInitialState = {
    clickInterval: 0,
    booleanOptions: [
      {
        name: "Inline Images",
        value: false
      }
    ]
  };
  const scraperGMStore = vanilla.createStore()(
    middleware.subscribeWithSelector(
      middleware.persist(() => scraperGMInitialState, {
        name: "scraper-gm-storage",
        storage: middleware.createJSONStorage(() => GMStorage)
      })
    )
  );
  const scraperPageInitialState = {
    preRenderContainer: null,
    pageContentLoaded: false,
    isNewChapter: false,
    timeout: 0,
    pageContentLoadedCleanUp: () => {
    }
  };
  const scraperPageStore = vanilla.createStore()(
    middleware.subscribeWithSelector(() => scraperPageInitialState)
  );
  function scrapingOn() {
    _GM_webRequest(
      [
        // 阻截微信读书的阅读进度请求，避免抓取过程中的翻页信息被记录为阅读进度
        // 发出这个请求表示此时页面已经加载完毕
        {
          selector: "https://weread.qq.com/web/book/read*",
          action: "cancel"
        },
        // 订阅微信读书的章节内容获取请求
        // 发出这个请求表示内容为新章节，否则为接续页
        {
          selector: "https://weread.qq.com/web/book/chapter/e_*",
          action: {
            redirect: {
              from: "(.*)",
              to: "$1"
            }
          }
        }
      ],
      (info) => {
        switch (info) {
          case "cancel":
            scraperPageStore.setState({
              pageContentLoaded: true
            });
            break;
          case "redirect":
            scraperPageStore.setState({
              isNewChapter: true
            });
            break;
        }
      }
    );
    preRenderContainerObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    const unsub = subscribePageContentLoaded();
    scraperPageStore.setState({
      pageContentLoadedCleanUp: getPageContentLoadedCleanUpFunction(unsub)
    });
  }
  function scrapingOff() {
    scraperPageStore.getState().pageContentLoadedCleanUp();
    preRenderContainerObserver.disconnect();
    _GM_webRequest([], () => {
    });
  }
  scraperSessionStore.subscribe(
    (state) => state.scraping,
    (scraping) => {
      if (scraping) {
        scrapingOn();
      } else {
        scrapingOff();
      }
    },
    {
      fireImmediately: true
    }
  );
  function subscribePageContentLoaded() {
    return scraperPageStore.subscribe(
      (state) => state.pageContentLoaded,
      async (pageContentLoaded) => {
        if (!pageContentLoaded) {
          return;
        }
        const { preRenderContainer } = scraperPageStore.getState();
        if (preRenderContainer) {
          await feed(preRenderContainer);
        } else {
          console.warn("Failed to find .preRenderContainer element.");
        }
        let nextPageButton = document.querySelector(".readerFooter_button");
        if (!nextPageButton) {
          const ending = document.querySelector(".readerFooter_ending");
          if (ending) {
            stopScrapingAndSave();
          }
          return;
        }
        await new Promise((resolve) => {
          scraperPageStore.setState({
            timeout: setTimeout(() => {
              resolve();
            }, scraperGMStore.getState().clickInterval)
          });
        });
        scraperPageStore.setState(scraperPageInitialState);
        nextPageButton = document.querySelector(".readerFooter_button");
        nextPageButton == null ? void 0 : nextPageButton.dispatchEvent(
          new MouseEvent("click", {
            clientX: 1,
            clientY: 1
          })
        );
      }
    );
  }
  function getPageContentLoadedCleanUpFunction(unsub) {
    return () => {
      unsub();
      clearTimeout(scraperPageStore.getState().timeout);
      scraperPageStore.setState(scraperPageInitialState);
    };
  }
  async function feed(preRenderContainer) {
    var _a, _b;
    if (styleElement.childNodes.length === 0) {
      const preRenderStyleElement = preRenderContainer.querySelector("style");
      if (preRenderStyleElement == null ? void 0 : preRenderStyleElement.childNodes.length) {
        styleElement.append(stylePreset, preRenderStyleElement.innerHTML);
        styleElement.outerHTML = await htmlMinifierTerser.minify(styleElement.outerHTML, {
          minifyCSS: true
        });
      }
    }
    const preRenderContent = preRenderContainer.querySelector(
      "#preRenderContent"
    );
    if (scraperGMStore.getState().booleanOptions[0].value) {
      const fetchImagePromises = [];
      const backgroundImageRegExp = new RegExp("(?<=background-image:url\\().+?(?=\\))");
      for (const image of preRenderContainer.querySelectorAll("img")) {
        const url = image.getAttribute("data-src") ?? image.src;
        if (!url) {
          continue;
        }
        fetchImagePromises.push(
          (async () => {
            try {
              const resp = await GM_fetch(url);
              if (resp.ok) {
                const imageBlob = await resp.blob();
                const imageDataUrl = await blobToBase64(imageBlob);
                image.src = imageDataUrl;
              }
            } catch (e) {
              console.warn(`Failed to fetch image (${url}): ${e}`);
            }
          })()
        );
      }
      for (const element of preRenderContainer.querySelectorAll(
        '[style*="background-image:url("]'
      )) {
        const styleAttribute = element.getAttribute("style");
        if (!styleAttribute) {
          continue;
        }
        const url = (_a = styleAttribute == null ? void 0 : styleAttribute.match(backgroundImageRegExp)) == null ? void 0 : _a[0];
        if (!url) {
          continue;
        }
        fetchImagePromises.push(
          (async () => {
            try {
              const resp = await GM_fetch(url);
              if (resp.ok) {
                const imageBlob = await resp.blob();
                const imageDataUrl = await blobToBase64(imageBlob);
                element.setAttribute(
                  "style",
                  styleAttribute.replace(backgroundImageRegExp, imageDataUrl)
                );
              }
            } catch (e) {
              console.warn(`Failed to fetch background image (${url}): ${e}`);
            }
          })()
        );
      }
      await Promise.all(fetchImagePromises);
    } else {
      for (const image of preRenderContainer.querySelectorAll("img")) {
        image.src = image.getAttribute("data-src") ?? image.src;
      }
    }
    recursivelyRemoveDataAttr(preRenderContent);
    collapseSpans(preRenderContent);
    if (scraperPageStore.getState().isNewChapter) {
      preRenderContent.removeAttribute("id");
      preRenderContent.classList.add("readerChapterContent");
      bodyElement.insertAdjacentHTML(
        "beforeend",
        await htmlMinifierTerser.minify(preRenderContent.outerHTML, {
          collapseWhitespace: true,
          removeComments: true
        })
      );
    } else {
      (_b = bodyElement.lastElementChild) == null ? void 0 : _b.insertAdjacentHTML(
        "beforeend",
        await htmlMinifierTerser.minify(preRenderContent.innerHTML, {
          collapseWhitespace: true,
          removeComments: true
        })
      );
    }
  }
      // 添加功能按钮的函数
      function addFunctionButtons() {
        const buttonContainer = document.createElement("div");
        buttonContainer.style.position = "fixed";
        buttonContainer.style.top = "50px";
        buttonContainer.style.right = "50px";
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.border = "1px solid #ccc";
        buttonContainer.style.background = "#f9f9f9";
        buttonContainer.style.padding = "5px";

        addButton(buttonContainer, "开始爬取", startScraping);
        addButton(buttonContainer, "取消爬取", cancelScraping);
        addButton(buttonContainer, "停止爬取 并 保存", stopScrapingAndSave);
        addButton(buttonContainer, "设置点击间隔", setClickInterval);
        addButton(buttonContainer, "查看使用教程", goToLazyBook);
        

        document.body.appendChild(buttonContainer);
    }

    // 添加单个按钮
    function addButton(container, buttonText, clickHandler) {
        const button = document.createElement("button");
        button.textContent = buttonText;
        button.style.marginRight = "10px";
        button.addEventListener("click", clickHandler);
        container.appendChild(button);
    }
  _GM_registerMenuCommand("开始爬取", startScraping);
  function startScraping() {
    scraperSessionStore.setState({ scraping: true });
    window.location.reload();
  }
  _GM_registerMenuCommand("取消爬取", cancelScraping);
  function cancelScraping() {
    scraperSessionStore.setState({ scraping: false });
    styleElement.innerHTML = "";
    bodyElement.innerHTML = "";
  }
  _GM_registerMenuCommand("停止爬取 并 保存", stopScrapingAndSave);
  async function stopScrapingAndSave() {
    var _a, _b;
    scraperSessionStore.setState({
      scraping: false
    });
    saveContent(
      any`<!DOCTYPE html>` + htmlElement.outerHTML,
      (_b = (_a = document.querySelector(".readerCatalog_bookInfo_title_txt")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()
    );
    styleElement.innerHTML = "";
    bodyElement.innerHTML = "";
  }
  _GM_registerMenuCommand("设置翻页时间间隔", setClickInterval);
  function setClickInterval() {
    const prevClickInterval = scraperGMStore.getState().clickInterval;
    let newClickInterval = parseFloat(
      window.prompt("Click interval (ms): ", prevClickInterval.toString()) || ""
    );
    if (!Number.isFinite(newClickInterval) || newClickInterval < 0) {
      newClickInterval = prevClickInterval;
    }
    scraperGMStore.setState({
      clickInterval: newClickInterval
    });
  }
  // 跳转到教程
  function goToLazyBook() {
    window.open("https://lazybook.fun/#/article/weread", "_blank");
}
  addFunctionButtons();
  scraperGMStore.subscribe(
    (state) => state.booleanOptions,
    (() => {
      const menuIds = [];
      return (booleanOptions) => {
        for (let i = 0; i < booleanOptions.length; ++i) {
          if (typeof menuIds[i] !== "undefined") {
            _GM_unregisterMenuCommand(menuIds[0]);
          }
          menuIds[i] = _GM_registerMenuCommand(
            `${booleanOptions[i].name} ${booleanOptions[i].value ? "✔" : "✘"}`,
            () => {
              toggleBooleanOptions(i);
            }
          );
        }
      };
    })(),
    {
      fireImmediately: true
    }
  );
  function toggleBooleanOptions(index) {
    const nextBooleanOptions = [...scraperGMStore.getState().booleanOptions];
    nextBooleanOptions[index].value = !nextBooleanOptions[index].value;
    scraperGMStore.setState({
      booleanOptions: nextBooleanOptions
    });
  }
  function recursivelyRemoveDataAttr(element) {
    const attributes = element.attributes;
    for (let i = attributes.length - 1; i >= 0; --i) {
      const attributeName = attributes[i].name;
      if (["data-wr-id", "data-wr-co"].includes(attributeName)) {
        element.removeAttribute(attributeName);
      }
    }
    for (const child of element.children) {
      recursivelyRemoveDataAttr(child);
    }
  }
  function isSimpleSpan(element) {
    return (element == null ? void 0 : element.tagName) === "SPAN" && (element == null ? void 0 : element.attributes.length) === 0 && element.innerHTML.length <= 1;
  }
  function collapseSpans(element) {
    for (const span of element.querySelectorAll("span")) {
      if (!isSimpleSpan(span)) {
        continue;
      }
      let nextElementSibling = span.nextElementSibling;
      while (isSimpleSpan(nextElementSibling)) {
        span.append(nextElementSibling.textContent ?? "");
        nextElementSibling.remove();
        nextElementSibling = span.nextElementSibling;
      }
    }
  }
  function saveContent(content, fileName = "微信读书") {
    const contentBlob = new Blob([content], {
      type: "text/html;charset=utf-8"
    });
    const dummyLink = document.createElement("a");
    dummyLink.href = URL.createObjectURL(contentBlob);
    dummyLink.download = `${fileName}.html`;
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
    URL.revokeObjectURL(dummyLink.href);
  }
  async function blobToBase64(blob) {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

})(GM_fetch, zustandVanilla, zustandMiddleware, HTMLMinifier);