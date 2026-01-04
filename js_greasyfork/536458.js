// ==UserScript==
// @name            issues copy
// @namespace       https://github.com/zhzLuke96/github-issues-copy-user-js
// @version         1.0.2
// @description:cn     为issues页面添加markdown复制按钮
// @description:en     add markdown copy to issues page
// @author          zhzluke96
// @match           https://*.github.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant           none
// @license         MIT
// @supportURL      https://github.com/zhzLuke96/github-issues-copy-user-js/issues
// @description add markdown copy to issues page
// @downloadURL https://update.greasyfork.org/scripts/536458/issues%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/536458/issues%20copy.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const _historyWrap = function (type) {
    const orig = history[type];
    const e = new Event(type);
    return function () {
      const rv = orig.apply(this, arguments);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _historyWrap("pushState");
  history.replaceState = _historyWrap("replaceState");

  const html_tpls = {
    btn: (callback) => {
      const btn = renderHtml(
        `<button id="issues_copy_btn" data-component="IconButton" type="button" class="prc-Button-ButtonBase-c50BI prc-Button-IconButton-szpyj" data-loading="false" data-no-visuals="true" data-size="medium" data-variant="invisible" aria-describedby=":r59:-loading-announcement" aria-labelledby=":r57:">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <text x="1" y="11" font-size="10" font-family="Arial, sans-serif" fill="currentColor">MD</text>
</svg>
</button>`
      );
      btn.addEventListener("click", callback);
      btn.title = "copy this page to markdown";
      btn.dataset.check_id = "issues_copy";
      return btn;
    },
  };

  function is_injected() {
    return (
      document.querySelectorAll(`[data-check_id="issues_copy"]`).length > 0
    );
  }

  function get_issues_markdown_content() {
    const issues_elements = [
      `[data-component="PH_Title"]`,
      `[data-testid="issue-viewer-issue-container"]`,
      `[data-testid="issue-timeline-container"]`,
    ];
    return issues_elements
      .map((selector) => document.querySelector(selector))
      .map((element) => htmlElementToMarkdown(element))
      .join("\n\n");
  }

  function is_issues_page() {
    return (
      document.querySelectorAll(`[data-testid="issue-viewer-issue-container"]`)
        .length > 0
    );
  }

  async function wait_for_page_render(timeout_ms = 1000) {
    return new Promise((resolve) => {
      let timer = null;
      const observer = new MutationObserver(() => {
        clearTimeout(timer);
        refresh();
      });
      function refresh() {
        timer = setTimeout(() => {
          observer.disconnect();
          resolve();
        }, timeout_ms);
      }

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
      refresh();
    });
  }

  async function do_inject() {
    await wait_for_page_render();
    if (is_injected()) return;
    if (!is_issues_page()) return;
    const anchor_span = document.querySelector(
      `[data-component="PH_Actions"] [class*="CopyToClipboardButton"]`
    );
    anchor_span.after(
      html_tpls.btn(() => {
        const markdown_content = get_issues_markdown_content();
        const textarea = document.createElement("textarea");
        textarea.value = markdown_content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("[issues_copy]copy success");
        console.log("[issues_copy]copy success");
        console.log(markdown_content);
      })
    );
  }

  do_inject();

  window.addEventListener("pushState", () => {
    do_inject();
  });
  window.addEventListener("replaceState", () => {
    do_inject();
  });

  // ----------------------------
  // 拓展区域
  // ----------------------------
  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function is_hide_element(element) {
    // 判断是否为隐藏
    return (
      element.hasAttribute("hidden") ||
      element.classList.contains("hidden") ||
      element.style.display === "none" ||
      getComputedStyle(element).display === "none" ||
      getComputedStyle(element).visibility === "hidden" ||
      getComputedStyle(element).opacity === "0"
    );
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {string}
   */
  function htmlElementToMarkdown(element) {
    /**
     *
     * @param {HTMLElement} node
     * @returns string
     */
    function process(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
      }
      if (is_hide_element(node)) {
        return "";
      }

      const tag = node.tagName.toLowerCase();
      let content = Array.from(node.childNodes).map(process).join("");

      if (content.trim() === "") {
        return "";
      }

      if (node.classList.contains("markdown-body")) {
        content = "\n" + content;
      }

      switch (tag) {
        case "h1":
          return `# ${content}\n\n`;
        case "h2":
          return `## ${content}\n\n`;
        case "h3":
          return `### ${content}\n\n`;
        case "h4":
          return `#### ${content}\n\n`;
        case "h5":
          return `##### ${content}\n\n`;
        case "h6":
          return `###### ${content}\n\n`;
        case "p":
          return `${content}\n\n`;
        case "strong":
        case "b":
          return `**${content}**`;
        case "em":
        case "i":
          return `*${content}*`;
        case "a":
          return `[${content}](${node.getAttribute("href")})`;
        case "code": {
          const code_content = node.innerText;
          return `\`${code_content}\``;
        }
        case "pre": {
          // 尝试查找代码块的语言 父元素上的 `highlight-source-xxx` 就是语言
          const lang =
            Array.from(node.parentElement.classList)
              .find((className) => className.startsWith("highlight-source-"))
              ?.replace("highlight-source-", "") ?? "";
          const code_content = node.innerText;
          return `\n\`\`\`${lang}\n${code_content}\n\`\`\`\n`;
        }
        case "ul":
          return (
            "\n" +
            Array.from(node.children)
              .map((li) => `- ${process(li)}`)
              .join("\n") +
            "\n\n"
          );
        case "ol":
          return (
            "\n" +
            Array.from(node.children)
              .map((li, i) => `${i + 1}. ${process(li)}`)
              .join("\n") +
            "\n\n"
          );
        case "br":
          return "  \n";
        case "blockquote":
          return "> " + content.replace(/\n/g, "\n> ") + "\n\n";
        case "img":
          const alt = node.getAttribute("alt") || "";
          const src = node.getAttribute("src") || "";
          return `![${alt}](${src})`;
        default:
          return content;
      }
    }

    return process(element).trim();
  }

  /**
   *
   * @param {string} html_content
   * @returns {HTMLElement}
   */
  function renderHtml(html_content) {
    const container = document.createElement("div");
    container.innerHTML = html_content;
    return container.children[0];
  }
})();
