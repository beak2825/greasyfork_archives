// ==UserScript==
// @name         黑白色网站
// @version      0.1
// @description  让你所浏览的网站变为黑白色！
// @author       袁煜914
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/474333
// @downloadURL https://update.greasyfork.org/scripts/399522/%E9%BB%91%E7%99%BD%E8%89%B2%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/399522/%E9%BB%91%E7%99%BD%E8%89%B2%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==


(function() {
    GM_addStyle("* {filter: grayscale(100%);}");
    //GM_addStyle("* html { -webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);-ms-filter: grayscale(100%);-o-filter: grayscale(100%);filter: grayscale(100%);}");
})();


