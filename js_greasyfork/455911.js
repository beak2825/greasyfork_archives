// ==UserScript==
// @name         我要黑白
// @namespace    https://greasyfork.org/users/900031
// @version      0.1
// @description  让网页变成黑白
// @author       开心的阿诺
// @match        http*://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455911/%E6%88%91%E8%A6%81%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455911/%E6%88%91%E8%A6%81%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("html {-webkit-filter:grayscale(100%)! important;-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);}");
})();