// ==UserScript==
// @name         我要彩色
// @version      0.1
// @description  Color back
// @author       voltachan(https://github.com/voltachan)
// @match        http*://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/users/438767
// @downloadURL https://update.greasyfork.org/scripts/399478/%E6%88%91%E8%A6%81%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/399478/%E6%88%91%E8%A6%81%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    GM_addStyle("* {filter: none !important}");
    //GM_addStyle("* {-webkit-filter:grayscale(0)! important;-moz-filter:grayscale(0) !important;-ms-filter:grayscale(0) !important;-o-filter:grayscale(0) !important;filter:grayscale(0) !important;filter:none !important;}");
})();
