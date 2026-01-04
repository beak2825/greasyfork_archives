// ==UserScript==
// @name         修改b站合集展示框高度
// @namespace    http://tampermonkey.net/
// @version      2025-04-17
// @description  修改b站合集展示框高度,顺带去除部分广告
// @author       freeAbrams
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533190/%E4%BF%AE%E6%94%B9b%E7%AB%99%E5%90%88%E9%9B%86%E5%B1%95%E7%A4%BA%E6%A1%86%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/533190/%E4%BF%AE%E6%94%B9b%E7%AB%99%E5%90%88%E9%9B%86%E5%B1%95%E7%A4%BA%E6%A1%86%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    waitForElement('.video-pod__body', (el) => {
        el.style.height = '800px';
    });
    waitForElement('.video-pod__body', (el) => {
        el.style.maxHeight = 'none';
    });
    waitForElement('#slide_ad', (el) => {
        el.style.display = 'none';
    });
    waitForElement('.video-card-ad-small', (el) => {
        el.style.display = 'none';
    });

})();