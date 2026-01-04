// ==UserScript==
// @name         Redirect Bing Search Videos to source video
// @namespace    https://bing.com
// @version      1.3
// @description  Redirect Bing Video search results (From Bing Search) directly to the source video
// @icon         https://www.bing.com/favicon.ico
// @match        *://*.bing.com/videos/riverview/relatedvideo*
// @match        *://*.bing.com/videos/search?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504279/Redirect%20Bing%20Search%20Videos%20to%20source%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/504279/Redirect%20Bing%20Search%20Videos%20to%20source%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToSource() {
        let source_elem = document.querySelector(".source");
        if (source_elem) {
            window.location.href = source_elem.href;
            clearInterval(checkExist); // 停止轮询
        }
    }

    // 使用轮询方法，每隔 100 毫秒检查一次
    let checkExist = setInterval(redirectToSource, 100);

    // 超时设置为 5 秒，以防止无限轮询
    setTimeout(function() {
        clearInterval(checkExist);
    }, 5000);
})();

