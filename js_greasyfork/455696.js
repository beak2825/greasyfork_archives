// ==UserScript==
// @name         还我色彩
// @namespace    https://greasyfork.org/zh-CN/scripts/455696-%E8%BF%98%E6%88%91%E8%89%B2%E5%BD%A9
// @version      0.2
// @description  拒绝灰色页面!
// @author       Masahiro
// @match        *://*/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455696/%E8%BF%98%E6%88%91%E8%89%B2%E5%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/455696/%E8%BF%98%E6%88%91%E8%89%B2%E5%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var head = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.innerText = "* {-webkit-filter:grayscale(0)! important;-moz-filter:grayscale(0) !important;-ms-filter:grayscale(0) !important;-o-filter:grayscale(0) !important;filter:grayscale(0) !important;filter:none !important;}"
    head.appendChild(style);
})();