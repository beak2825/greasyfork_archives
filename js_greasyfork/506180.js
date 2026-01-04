// ==UserScript==
// @name         Wider translate ↔️
// @name:zh-CN   更宽的翻译窗口↔️
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make the translate dialog window wider For Bing translate/ google translate/ Tencent translate。
// @description:zh-CN 更宽的翻译窗口，支持bing翻译、谷歌翻译、腾讯翻译
// @author       You
// @match        https://cn.bing.com/translator*
// @match        https://www.bing.com/translator*
// @match        https://translate.google.com/*
// @match        https://transmart.qq.com/zh-CN/index*
// @match        https://fanyi.qq.com/*
// @icon     data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkgMTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzY4RiIgZD0iTTAgMGgxOXYxOUgweiIvPjx0ZXh0IGZpbGw9IiNlZmYiIGZvbnQtc2l6ZT0iNyI+PHRzcGFuIHg9IjUiIHk9IjE2Ij5FTjwvdHNwYW4+PHRzcGFuIHg9IjYiIHk9IjkiPuaWhzwvdHNwYW4+PC90ZXh0PjxwYXRoIGZpbGw9IiMwMjUiIGQ9Im0xNC41IDEzLjUgNC00LTQtNG0tMTAgOC00LTQgNC00Ii8+PC9zdmc+
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506180/Wider%20translate%20%E2%86%94%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/506180/Wider%20translate%20%E2%86%94%EF%B8%8F.meta.js
// ==/UserScript==

(function() {

  /*
  var tt_in = document.querySelector("#tta_input_ta");
  if(tt_in != null) {
    tt_in.style.fontSize="20px";
    tt_in.onchange = function trimText() {
      tt_in = document.querySelector("#tta_input_ta");
      var output = tt_in.value.replaceAll(" * ", " ").trim();
      output = output.replace(/\n /g, "\n").replace(/\n /g, "\n");
      output = output.replace(/([^\.])\n([a-z])/g, "$1 $2");
      output = output.replace(/([^\.])\n([A-Z]{3})/g, "$1 $2");
      output = output.replaceAll("  ", " ").replaceAll("  ", " ");
      tt_in.value = output;
      console.log(output);
    }
  }
  */

  if (/bing/.test(location.href)) {
    GM_addStyle(`
      div#tta_input > textarea#tta_input_ta.tta_focusTextLarge {
        font-size: 22px;
      }
      div.tta_outtxt > textarea#tta_output_ta.tta_focusTextLarge {
        font-size: 22px;
      }
      #tt_translatorHome {
        width: calc(100% - 40px);
        min-height: 22em;
        margin: 20px auto 20px;
      }
      #rich_tta > table {
        min-height: 50em;
      }
      `);
  }

  if (/translate.google/.test(location.href)) {
    GM_addStyle(`
      html, body {
        overflow: auto;
      }

      c-wiz c-wiz[data-p] {
        width: 100%;
        max-width: calc(100% - 46px);
      }

      c-wiz div div c-wiz div c-wiz div c-wiz span div textarea {
        min-height: 18em;
      }
      `);
  }

  if (/transmart.qq.com/.test(location.href)) {
    GM_addStyle(`
      #root div[class^="src-components-CommonHeader--container"] {
        width: 100%;
        max-width: calc(100% - 50px);
      }
      #root div[class^="src-routes--container"] > div[class^="src-views-InteractiveTranslation-pages--container"] {
        width: 100%;
        max-width: calc(100% - 50px);
      }
      #root div[class^="src-routes--container"] > div[class^="src-views-InteractiveTranslation"] > div[class^="src-views-InteractiveTranslation-pages--panel-translate"] {
        justify-content: space-around;
      }
      `);
  }

  if (/fanyi.qq.com/.test(location.href)) {
    GM_addStyle(`
      nav.nav-content > div.container.nav-container,
      div.page-demo > div.demo-container {
        width: 100%;
        max-width: calc(100% - 50px);
      }
      `);
  }

})();