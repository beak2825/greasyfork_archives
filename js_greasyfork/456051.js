// ==UserScript==
// @name         灰色网页恢复彩色
// @namespace    Scripts
// @version      0.1
// @description  将绝大部分的灰色网页恢复为原来的彩色网页
// @author       Xiaomu
// @match        *://*/*
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456051/%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/456051/%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function() {'use strict';document.querySelector('html').style.cssText='-webkit-filter: none;'})();