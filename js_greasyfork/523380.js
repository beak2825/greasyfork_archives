// ==UserScript==
// @name         SimTools Reticent Base Library
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provides utility functions for interacting with elements on SimCompanies pages.
// @author       Reticent
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 定义 checkForRealmElement 函数
    const checkForRealmElement = (callback) => {
        let intervalId;

        function findRealmElement() {
            // 查找 img[alt*="企业家"]
            const entrepreneurElement = document.querySelector(`div.css-inxa61.e1uuitfi4 img[alt*="企业家"]`);
            // 查找 img[alt*="商业大亨"]
            const tycoonElement = document.querySelector(`div.css-inxa61.e1uuitfi4 img[alt*="商业大亨"]`);

            if (entrepreneurElement) {
                clearInterval(intervalId);
                callback(1); // 找到 "企业家" 元素后调用回调函数并传入 1
            } else if (tycoonElement) {
                clearInterval(intervalId);
                callback(0); // 找到 "商业大亨" 元素后调用回调函数并传入 0
            } else {
                console.warn('Neither matching realm element found yet.');
            }
        }

        intervalId = setInterval(findRealmElement, 1000);
        findRealmElement(); // 立即执行一次以避免不必要的延迟
    };

    // 公开 API
    window.SimToolsAPI = {
        checkForRealmElement,
        // 如果有其他公共方法，可以在这里添加
    };
})();