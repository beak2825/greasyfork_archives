// ==UserScript==
// @name         去灰色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  网站去除灰色
// @author       BigOrange
// @match        *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456092/%E5%8E%BB%E7%81%B0%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/456092/%E5%8E%BB%E7%81%B0%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var htmlDom = document.getElementsByTagName('html')[0];
      function demo(dom) {
        dom.style.filter = 'none';
        if (dom.children && dom.children.length > 0) {
          for (var index = 0; index < dom.children.length; index++) {
            const element = dom.children[index];
            demo(element);
          }
        }
      }
      demo(htmlDom);
})();