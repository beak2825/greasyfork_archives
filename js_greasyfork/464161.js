// ==UserScript==
// @name         Skype Code Highlight For New Bing
// @name:zh-CN   Skype New Bing 代码高亮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Skype chat escaped, highlight, indented code
// @description:zh-CN  Skype 聊天文本的代码转义、高亮与缩进
// @author       Gaubee
// @match        https://web.skype.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skype.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js

// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/standalone.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-angular.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-babel.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-espree.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-flow.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-glimmer.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-graphql.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-html.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-markdown.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-meriyah.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-postcss.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-typescript.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.7/parser-yaml.min.js

// @resource   HL_THEME https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css

// @downloadURL https://update.greasyfork.org/scripts/464161/Skype%20Code%20Highlight%20For%20New%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/464161/Skype%20Code%20Highlight%20For%20New%20Bing.meta.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(GM_getResourceText("HL_THEME"));
  Object.assign(unsafeWindow, { hljs, prettier });

  const effectedEles = new WeakSet();
  function fix() {
    const scrollView = document.querySelector(
      `body > div.app-container > div > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > div > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div > div > div.scrollViewport.scrollViewportV`
    );
    const eles = [].slice.call(
      scrollView.querySelectorAll('[style*="user-select: text;"]')
    );
    const loop = (eles) => {
      for (const ele of eles) {
        /// 还在输入中
        if(ele.textContent.endsWith('...')) {
          break;
        }
        /// 已经处理过了
        if (effectedEles.has(ele)) {
          break;
        }
        effectedEles.add(ele);

        if (ele.children.lenght > 0) {
          continue;
        }
        /// 消除转移符号
        ele.innerHTML = ele.textContent;
        /// 检测语法
        let code = ele.textContent;
        let hlres = hljs.highlightAuto(code);
        if (hlres.relevance < 2) {
          continue;
        }

        /// 强制格式化后再次高亮
        try {
          code = prettier.format(code, {
            parser: hljs.language,
            plugins: prettierPlugins,
          });
          hlres = hljs.highlightAuto(code);
        } catch {}
        ele.innerHTML = hlres.value;
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
  // Your code here...
})();
