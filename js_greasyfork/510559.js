// ==UserScript==
// @name         Wnacg copy button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 wnacg 網頁上新增一個按鈕來複製標籤或搜索內容
// @license MIT
// @author       scbmark
// @icon         https://wnacg.com/favicon.ico
// @match        https://wnacg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510559/Wnacg%20copy%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/510559/Wnacg%20copy%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function make_copy_title() {
        let bread = document.querySelector("div.png");
        if (bread) {
            let bread_text = (bread.innerHTML);
            if (bread_text.includes("標籤：") || bread_text.includes("搜索：")) {
                let tags_name = bread.innerHTML.split("：")[1].trim()
                var button = document.createElement("button");
                button.innerHTML = `複製${tags_name}`;
                button.addEventListener('click', () => {
                    navigator.clipboard.writeText(tags_name).then(() => {
                        button.innerHTML = '複製成功';
                        setTimeout(() => {
                            button.innerHTML = `複製${tags_name}`;
                        }, 3000);
                    }).catch(err => {
                        console.error('無法複製到剪貼簿', err);
                    });
                });
                bread.appendChild(button)
            }
        }
    }

    // 在頁面加載完成後執行函數
    window.addEventListener('load', make_copy_title);
})();
