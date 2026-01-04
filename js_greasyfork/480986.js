// ==UserScript==
// @name         FocusNinja:Bilibili, YouTube, and Zhihu Homepage Content Blocker B站油管知乎首页内容屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide specific elements on Bilibili, YouTube, and Zhihu homepages
// @author       Siyuan
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480986/FocusNinja%3ABilibili%2C%20YouTube%2C%20and%20Zhihu%20Homepage%20Content%20Blocker%20B%E7%AB%99%E6%B2%B9%E7%AE%A1%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/480986/FocusNinja%3ABilibili%2C%20YouTube%2C%20and%20Zhihu%20Homepage%20Content%20Blocker%20B%E7%AB%99%E6%B2%B9%E7%AE%A1%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements by class name
    function hideElementsByClassName(className) {
        const elements = document.getElementsByClassName(className);
        for (let element of elements) {
            element.style.display = 'none'; // Hide the element
        }
    }

    // Function to continuously hide elements for dynamic content
    function continuouslyHide(className) {
        new MutationObserver(() => {
            hideElementsByClassName(className);
        }).observe(document.body, {childList: true, subtree: true});
    }

    // Check if it's Bilibili, YouTube, or Zhihu and act accordingly
    // Check if it's Bilibili, YouTube, or Zhihu and act accordingly
if (window.location.hostname.includes('bilibili.com')) {
    window.addEventListener('load', function() {
        hideElementsByClassName('recommend-list-v1');
        hideElementsByClassName('container is-version8');
    });
} else if (window.location.hostname.includes('youtube.com')) {
    continuouslyHide('style-scope ytd-rich-grid-renderer');
} else if (window.location.hostname.includes('zhihu.com')) {
    continuouslyHide('Card TopstoryItem TopstoryItem-isRecommend');
};

})();



