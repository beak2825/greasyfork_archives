// ==UserScript==
// @name         知乎专栏 Markdown 扩展支持
// @namespace    https://github.com/discountry/zhihumarkdown
// @require      https://cdn.bootcss.com/marked/0.3.6/marked.min.js
// @require      https://cdn.bootcss.com/to-markdown/3.0.4/to-markdown.min.js
// @version      0.7
// @description  Add Markdown Support for Zhihu Zhuanlan Editor
// @author       Discountry
// @match        https://zhuanlan.zhihu.com/write
// @match        https://zhuanlan.zhihu.com/p/*/edit
// @grant        unsafeWindow
// @copyright    2017+, @余博伦
// @downloadURL https://update.greasyfork.org/scripts/30040/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%20Markdown%20%E6%89%A9%E5%B1%95%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/30040/%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%20Markdown%20%E6%89%A9%E5%B1%95%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var initWatcher = setInterval(function() {
    console.log('watch');
    if (unsafeWindow.angular) {
      clearInterval(initWatcher);
      init();
    }
  }, 100);

  function init() {
    console.log('angular', unsafeWindow.angular);
    console.log("Makrdown Included!");

    var toHTML = function() {
      var plainContent = unsafeWindow.document.querySelector("#js-entry-content");
      console.log(plainContent.innerHTML);
      plainContent.innerText = toMarkdown(plainContent.innerHTML, { gfm: true });

    };
    unsafeWindow.toHTML = toHTML;
    var toMD = function() {
      var plainContent = unsafeWindow.document.querySelector("#js-entry-content");
      console.log(plainContent.innerText);
      plainContent.innerHTML = marked(plainContent.innerText);
      plainContent.addEventListener('click', function autoMD() {
          plainContent.removeEventListener('click', autoMD);
          unsafeWindow.toHTML();
      });
    };
    unsafeWindow.toMD = toMD;
  }

  function createButton() {
    var toolBar = unsafeWindow.document.querySelector(".goog-toolbar");
    var toMarkdownButton = '<div class="goog-inline-block goog-toolbar-button" title="转为markdown" role="button" id="markdown" style="user-select: none;" onclick="window.toMD()"><div class="goog-inline-block goog-toolbar-button-outer-box" style="user-select: none;"><div class="goog-inline-block goog-toolbar-button-inner-box" style="user-select: none;"><div class="tr-icon tr-code" style="user-select: none;"></div></div></div></div>';
    toolBar.insertAdjacentHTML('beforeend', toMarkdownButton);
    console.log("Button Added!");
    var plainContent = unsafeWindow.document.querySelector("#js-entry-content");
    plainContent.addEventListener('click', function autoMD() {
        plainContent.removeEventListener('click', autoMD);
        unsafeWindow.toHTML();
    });
  }

  setTimeout(createButton, 1000);

})();