// ==UserScript==
// @name         屏蔽B站浏览器插件提示横幅与大会员图标
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Hide elements with class "vip-wrap" and "adblock-tips"
// @author       ChatGPT
// @match        http://*.bilibili.com/*
// @match        https://*.bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468865/%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E6%A8%AA%E5%B9%85%E4%B8%8E%E5%A4%A7%E4%BC%9A%E5%91%98%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/468865/%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E6%A8%AA%E5%B9%85%E4%B8%8E%E5%A4%A7%E4%BC%9A%E5%91%98%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        let hideList = ["vip-wrap", "adblock-tips"];
        for (let i = 0; i < hideList.length; i++) {
            let elements = document.getElementsByClassName(hideList[i]);
            for (let j = 0; j < elements.length; j++) {
                if (elements[j]) {
                    elements[j].style.display = "none";
                }
            }
        }
    }

    function observeDOM() {
        const observer = new MutationObserver(function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    hideElements();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOM);
    } else {
        observeDOM();
    }
})();

