// ==UserScript==
// @name         爱发电链接自动跳转
// @namespace    https://www.cccpserver.cf
// @version      1.0
// @description  在“你正在离开爱发电，请长按复制网址到浏览器后访问”时自动跳转至其网址
// @author       HELPMEEADICE
// @match        https://afdian.net/link?target=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476287/%E7%88%B1%E5%8F%91%E7%94%B5%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/476287/%E7%88%B1%E5%8F%91%E7%94%B5%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the target URL from the current page's URL
    const currentURL = window.location.href;
    const targetURL = new URLSearchParams(currentURL.split('?')[1]).get('target');

    if (targetURL) {
        // Redirect to the target URL
        window.location.href = decodeURIComponent(targetURL);
    }
})();
