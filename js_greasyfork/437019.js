// ==UserScript==
// @name         Site Enhance
// @namespace    https://kingfish404.cn/
// @version      0.1
// @description  Make site more user-friendly and modern.
// @author       Kingfish404
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437019/Site%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/437019/Site%20Enhance.meta.js
// ==/UserScript==

(function () {
  'use strict';
  switch (document.location.host) {
    case 'www.marxists.org':
      {
        const table = document.querySelector('table');
        table.style.margin = 'auto';
        table.style.maxWidth = '900px';
      }
      break;
    default:
      break;
  }
})();