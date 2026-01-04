// ==UserScript==
// @name         百度搜索结果展开工具
// @namespace    http://tampermonkey.net/
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @version      1.0
// @description  百度搜索结果展开工具,将百度搜索的结果自动在系统右半边打开展示
// @author       wll
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463791/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%95%E5%BC%80%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/463791/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%95%E5%BC%80%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all the search result links
    const searchResultLinks = document.querySelectorAll('.c-container a');

    // Loop through each link and add a mouseover event listener
    searchResultLinks.forEach(link => {
        let timerId;
        link.addEventListener('mouseover', () => {
            // Get the URL of the link
            const url = link.href;
            // Start the timer for the customizable hover time
            timerId = setTimeout(() => {
                // Open the link in a new window on the right half of the screen
                window.open(url, '_blank', `width=${window.innerWidth/2},height=${window.innerHeight},left=${window.innerWidth/2}`);
            }, 0.8 * 1000);
        });

        // Clear the timer if the mouse leaves the link before the hover time is over
        link.addEventListener('mouseout', () => {
            clearTimeout(timerId);
        });
    });
})();