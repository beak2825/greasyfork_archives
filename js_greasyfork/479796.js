// ==UserScript==
// @name         chatgpt全屏样式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  尝试在每次页面加载时更改特定元素的样式
// @author       bruceWang
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479796/chatgpt%E5%85%A8%E5%B1%8F%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/479796/chatgpt%E5%85%A8%E5%B1%8F%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyStyle() {
        var bodyElements = document.querySelectorAll('.flex.flex-1.gap-4.text-base.mx-auto');
        var buttonElements = document.querySelectorAll('.stretch.mx-2.flex.flex-row.gap-3');


        if (bodyElements) {
            // 修改样式
            bodyElements.forEach(item =>{
                item.style.maxWidth = 'none';
            })
        }

        if (buttonElements) {
            // 修改样式
            buttonElements.forEach(item =>{
                item.style.maxWidth = '90%';
            })
        }
    }

    var observer = new MutationObserver(function(mutations) {
        if(mutations.length > 0){
            modifyStyle();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
