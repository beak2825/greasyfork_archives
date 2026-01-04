// ==UserScript==
// @name:en      Set Youtube caption selectable easy to quickly translate word for Mac
// @name         Youtube字幕单词可以直接选中，方便Mac电脑快速选中翻译单词
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description:en  Set Youtube caption selectable, make it easy to quickly select and translate word in the caption for Mac
// @description  Youtube字幕单词可以直接选中，方便Mac电脑快速选中翻译单词（Mac触控板手势重按或三指轻点）
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435955/Youtube%E5%AD%97%E5%B9%95%E5%8D%95%E8%AF%8D%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E9%80%89%E4%B8%AD%EF%BC%8C%E6%96%B9%E4%BE%BFMac%E7%94%B5%E8%84%91%E5%BF%AB%E9%80%9F%E9%80%89%E4%B8%AD%E7%BF%BB%E8%AF%91%E5%8D%95%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/435955/Youtube%E5%AD%97%E5%B9%95%E5%8D%95%E8%AF%8D%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E9%80%89%E4%B8%AD%EF%BC%8C%E6%96%B9%E4%BE%BFMac%E7%94%B5%E8%84%91%E5%BF%AB%E9%80%9F%E9%80%89%E4%B8%AD%E7%BF%BB%E8%AF%91%E5%8D%95%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    /** 检测DOM变动 */
    const mutationDiv = document.body;
    const observer = new MutationObserver(callback);
    observer.observe(mutationDiv, {
        childList: true, // 观察直接子节点
        subtree: true, // 及其更低的后代节点
        attributes: true,
        characterData: true
    });

    /** DOM变动的回调函数 */
    function callback (mutationRecord) {
        const subtitle = document.querySelector('#ytp-caption-window-container');
        const spanList = subtitle.querySelectorAll('span');
        spanList.forEach(el => {
            el.style.userSelect = 'text';
        });
    };
})();