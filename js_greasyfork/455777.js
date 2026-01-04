// ==UserScript==
// @name         网页去黑白
// @version      1.0
// @description  去除所有网页过度的filter黑白效果
// @license      MIT
// @author       暂时空名
// @match        *
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/990653
// @downloadURL https://update.greasyfork.org/scripts/455777/%E7%BD%91%E9%A1%B5%E5%8E%BB%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455777/%E7%BD%91%E9%A1%B5%E5%8E%BB%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('*{filter: none !important; -webkit-filter: none !important; -moz-filter: none !important; -ms-filter: none !important; -o-filter: none !important;}');
})();