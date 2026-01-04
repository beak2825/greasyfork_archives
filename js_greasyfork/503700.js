// ==UserScript==
// @name         SPOON 愛心點擊
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  "Click!" 文字出現,點擊愛心
// @author       洋
// @match        https://www.spooncast.net/tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503700/SPOON%20%E6%84%9B%E5%BF%83%E9%BB%9E%E6%93%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503700/SPOON%20%E6%84%9B%E5%BF%83%E9%BB%9E%E6%93%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義一個函數來查找並點擊 <g clip-path="url(#drop)">
    function clickGElement() {
        // 確保元素存在並符合條件
        var gElement = document.querySelector('g[clip-path="url(#drop)"]');

        if (gElement) {
            // 需要進行模擬點擊操作
            var svgElement = gElement.closest('svg');
            if (svgElement) {
                svgElement.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
                console.log("元素 <g clip-path=\"url(#drop)\"> 已被點擊");
            }
        } else {
            console.log("未找到指定的 <g> 元素");
        }
    }

    // 使用 MutationObserver 監聽 <p> 元素的出現
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 查找所有 <p> 元素並檢查其文本內容
                var paragraphs = document.querySelectorAll('p');

                paragraphs.forEach(function(paragraph) {
                    if (paragraph.textContent.includes("Click!")) {
                        console.log("<p> 元素包含 'Click!'，進行點擊操作");
                        clickGElement();
                    }
                });
            }
        }
    });

    // 監聽整個文檔的變化
    observer.observe(document.body, { childList: true, subtree: true });

    // 使用 setInterval 來定期檢查
    setInterval(function() {
        console.log("定期檢查 <p> 元素");
        var paragraphs = document.querySelectorAll('p');

        paragraphs.forEach(function(paragraph) {
            if (paragraph.textContent.includes("Click!")) {
                console.log("<p> 元素包含 'Click!'，進行點擊操作");
                clickGElement();
            }
        });
    }, 1000); // 每1秒檢查一次

})();
