// ==UserScript==
// @name         增强思否 (SegmentFault) 前端体验
// @namespace    https://segmentfault.com/u/jamesfancy
// @version      1.0.11
// @description  对思否社区的样式进行细节上的改善，支持 Chrome 77 及以上版本的浏览器。这是整合了问答和博客以及样式调整的脚本。
// @author       James Fan
// @license      MulanPSL-2.0
// @match        https://segmentfault.com/*
// @icon         https://cdn.segmentfault.com/r-e5cb5889/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447334/%E5%A2%9E%E5%BC%BA%E6%80%9D%E5%90%A6%20%28SegmentFault%29%20%E5%89%8D%E7%AB%AF%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/447334/%E5%A2%9E%E5%BC%BA%E6%80%9D%E5%90%A6%20%28SegmentFault%29%20%E5%89%8D%E7%AB%AF%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(() => {
  // src/util/functions.js
  function warn(...args) {
    var _a;
    ((_a = console.warn) != null ? _a : console.log)(...args);
  }

  // src/util/wait.js
  async function waitObject(getter, timeoutSeconds = 0, interval = 200) {
    const timeout = (timeoutSeconds || 0) * 1e3;
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let errorCount = 0;
      const timer = setInterval(async () => {
        const result = await (async () => getter())().catch(() => (errorCount++, void 0));
        if (result != null ? result : false) {
          clearInterval(timer);
          resolve(result);
          return;
        }
        if (errorCount > 100) {
          clearInterval(timer);
          reject({ type: "too more error" });
        } else if (timeout && Date.now() - startTime > timeout) {
          clearInterval(timer);
          reject({ type: "timeout", seconds: timeoutSeconds });
        }
      }, interval);
    });
  }
  function warnWaitError(message) {
    return (err) => {
      warn(`[${err.type}]`, message);
      warn(err);
    };
  }

  // src/answer/paste-link.js
  /*!
   * 粘贴带标题的 URL 时，处理成 Markdown 的 URL 格式
   */
  async function injectToPasteLink() {
    var _a;
    if (!navigator.clipboard) {
      ((_a = console.warn) != null ? _a : console.log)("Clipboard API is not supported.");
    }
    const editor = await waitObject(() => {
      var _a2;
      return (_a2 = document.querySelector(".CodeMirror")) == null ? void 0 : _a2.CodeMirror;
    });
    editor.on("paste", async (cm, e) => {
      const md = getLinkMarkdown(e);
      if (md) {
        e.preventDefault();
        const doc = cm.getDoc();
        doc.replaceSelection(md);
      }
    });
    function getLinkMarkdown(e) {
      const data = e.clipboardData;
      const html = data.getData("text/html");
      const div = document.createElement("div");
      div.innerHTML = html;
      if (div.childElementCount !== 1) {
        return;
      }
      const a = div.children[0];
      if (a.tagName !== "A") {
        return;
      }
      return `[${a.innerText}](${a.href})`;
    }
  }

  // src/answer/reply-button.js
  /*!
   * 把回复按钮放到预览区上面
   */
  async function moveReplyButtonUp() {
    const [replyArea, preview, buttons] = await waitObject(
      () => {
        const preview2 = document.getElementById("editor-preview-wrap");
        if (!preview2) {
          return;
        }
        const buttons2 = preview2.nextElementSibling;
        if (!buttons2) {
          return;
        }
        const replyArea2 = preview2.parentElement;
        return [replyArea2, preview2, buttons2];
      }
    );
    replyArea.insertBefore(buttons, preview);
    buttons.classList.remove("mt-3");
    buttons.classList.add("mb-3");
  }

  // src/answer/tags.js
  async function moveTagsUp() {
    const [context, info, tags] = await waitObject(() => {
      const context2 = document.querySelector(".introduction-wrap .card-body");
      if (!context2) {
        return;
      }
      const article = context2.querySelector("article");
      const info2 = article == null ? void 0 : article.previousElementSibling;
      if (!(info2 == null ? void 0 : info2.classList.contains("information"))) {
        return;
      }
      if (context2.children[1] !== info2) {
        return;
      }
      const tags2 = context2.querySelector("article").nextElementSibling;
      if (!(tags2 == null ? void 0 : tags2.querySelector("a.badge-tag"))) {
        return;
      }
      return [context2, info2, tags2];
    }, 5);
    context.insertBefore(tags, info.nextElementSibling);
  }

  // src/answer/index.js
  function answer_default() {
    moveTagsUp().catch(warnWaitError("wait tags elements failed"));
    moveReplyButtonUp().catch(warnWaitError("wait reply button failed"));
    injectToPasteLink().catch(warnWaitError("wait editor failed"));
  }

  // src/styles/styles.json
  var styles_default = {
    ".fmt": {
      h6: {
        "font-weight": "bold",
        "&::before": {
          content: '"\u{1F4D1}"'
        }
      }
    },
    kbd: {
      "margin-left": "0.2rem",
      "margin-right": "0.2rem",
      background: "#e5f4ef",
      color: "#333333",
      border: "1px solid #00965e",
      "border-bottom": "2px solid #008050",
      "border-right": "2px solid #008050"
    },
    "#questionMain": {
      ".introduction-wrap": {
        "> .card-body": {
          "h1+div+div": {
            "margin-left": "-1rem",
            "margin-right": "-1rem",
            padding: "0.5rem 1rem",
            background: "rgba(0,150,94,.1)",
            "a.badge-tag": {
              background: "transparent"
            }
          }
        }
      }
    }
  };

  // src/styles/stringify.js
  function toStyleList(styles, selector) {
    const entries = Object.entries(styles);
    const attrEntries = entries.filter(([, value]) => typeof value !== "object");
    const currentStyle = attrEntries.length ? `${selector} { ${attrEntries.map(([key, value]) => `${key}: ${value}`).join("; ")} }` : null;
    const subEntries = entries.filter(([, value]) => typeof value === "object").flatMap(([key, value]) => toStyleList(value, mergeKey(selector, key)));
    if (currentStyle) {
      subEntries.unshift(currentStyle);
    }
    return subEntries;
  }
  function mergeKey(parent, key) {
    if (!parent) {
      return key;
    }
    if (key.startsWith("&")) {
      return `${parent}${key.substring(1)}`;
    }
    return `${parent} ${key}`;
  }
  function toStyleString(styles) {
    return toStyleList(styles).join("\n");
  }

  // src/styles/index.js
  function styles_default2() {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("type", "text/css");
    styleEl.innerText = toStyleString(styles_default);
    document.head.appendChild(styleEl);
  }

  // src/customize-sifou.js
  // @license      MulanPSL-2.0
  var policies = [
    ["/q/", answer_default, "segmentfault.com/q/: improve answer"],
    [, styles_default2, "global: improve styles"]
  ].map(([rule, ...rest]) => {
    switch (typeof rule) {
      case "function":
        return [rule, ...rest];
      case "string":
        return [
          () => window.location.pathname.startsWith(rule),
          ...rest
        ];
      case "boolean":
        return [() => !!rule, ...rest];
      case "undefined":
        return [() => true, ...rest];
    }
  });
  policies.filter(([rule]) => rule()).forEach(([, fn, info]) => {
    var _a;
    ((_a = console.info) != null ? _a : console.log)("[SF-MONKEY]", info);
    return fn();
  });
})();
