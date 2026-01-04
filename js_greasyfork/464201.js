// ==UserScript==
// @name         Slack Claude Highlight For New Bing
// @name:zh-CN   Slack Claude 代码高亮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Slack Claude chat highlight
// @description:zh-CN  Slack Claude 聊天文本的代码高亮
// @license      MIT
// @author       Gaubee
// @match        https://app.slack.com/client/T053FR25ER2/D053GETDZHQ
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @resource     HL_THEME https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css
// @downloadURL https://update.greasyfork.org/scripts/464201/Slack%20Claude%20Highlight%20For%20New%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/464201/Slack%20Claude%20Highlight%20For%20New%20Bing.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(GM_getResourceText("HL_THEME"));
  Object.assign(unsafeWindow, { hljs });

  const effectedEles = new WeakSet();
  function fix() {
    const scrollView = document.querySelector(
      `.p-workspace__primary_view_body .c-virtual_list__scroll_container`
    );
    const eles = [].slice.call(
      scrollView.querySelectorAll("pre.c-mrkdwn__pre")
    );
    const langMap = {
      js: "javascript",
      objc: "objectivec",
      ts: "typescript",
    };
    const loop = (eles) => {
      for (const ele of eles) {
        /// 还在输入中
        if (ele.textContent.endsWith("...")) {
          break;
        }
        /// 已经处理过了
        if (effectedEles.has(ele)) {
          break;
        }
        effectedEles.add(ele);

        if (ele.children.length > 0) {
          continue;
        }
        /// 检测语法
        let code = ele.textContent;
        let lang = code.split("\n", 1)[0].trim();
        code = code.slice(lang.length + 1);
        lang = langMap[lang] || lang;
        let hlres;
        try {
          hlres = hljs.highlight(code, { language: lang });
        } catch {
          hlres = hljs.highlightAuto(code);
        }
        ele.innerHTML = `<code>${hlres.value}</code>`;
        ele.dataset.language = hlres.language;
        ele.dataset.relevance = hlres.relevance;
      }
    };
    loop(eles);
    loop(eles.reverse());
  }
  setInterval(() => {
    try {
      fix();
    } catch (e) {
      // console.warn(e);
    }
  }, 1000);
})();
