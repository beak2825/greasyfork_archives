// ==UserScript==
// @name         Replace Button Functionality with New Window (Using MutationObserver)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Completely replace button functionality on YouTube with a new window
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505597/Replace%20Button%20Functionality%20with%20New%20Window%20%28Using%20MutationObserver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505597/Replace%20Button%20Functionality%20with%20New%20Window%20%28Using%20MutationObserver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonReplaced = false; // 設定旗標，防止重複替換

    // 監視 DOM 變化
    const observer = new MutationObserver(function(mutations) {
        if (buttonReplaced) return; // 如果已經替換過，直接返回

        const button = document.getElementsByTagName('ytd-download-button-renderer')[0]?.childNodes[2]?.childNodes[1]?.childNodes[0];

        if (button) {
            buttonReplaced = true; // 標記按鈕已經被替換過
            observer.disconnect(); // 找到按鈕後停止監視

            button.addEventListener('click', function(event) {
                event.preventDefault(); // 阻止默認點擊行為
                event.stopPropagation(); // 阻止事件冒泡

                // 獲取當前的網址並轉換成新的網址
                const currentUrl = window.location.href;
                const newUrl = currentUrl.replace("youtube", "sosyoutube");

                // 在新窗口中打開新的網址，設定窗口大小
                window.open(newUrl, "_blank", "width=800,height=600");
            }, true);
        }
    });

    // 開始監視文件根節點的子節點和後代節點的變化
    observer.observe(document.body, { childList: true, subtree: true });
})();
