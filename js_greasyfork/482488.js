// ==UserScript==
// @name        立·即·下·载！
// @namespace   Violentmonkey Scripts
// @match       https://www.gamer520.com/*
// @match       https://xxxxx528.com/*
// @grant       none
// @version     1.2
// @author      -
// @description 下载地址获取成功后自动点击“立即下载”
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482488/%E7%AB%8B%C2%B7%E5%8D%B3%C2%B7%E4%B8%8B%C2%B7%E8%BD%BD%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/482488/%E7%AB%8B%C2%B7%E5%8D%B3%C2%B7%E4%B8%8B%C2%B7%E8%BD%BD%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 找到下载按钮，假设按钮选择器是 'a.go-down.btn.btn--secondary.btn--block'
    var downloadButton = document.querySelector('a.go-down.btn.btn--secondary.btn--block');

    // 如果找到下载按钮，添加点击事件监听器
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // 定义 MutationObserver
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    // 检查是否有确认按钮 "button.swal2-confirm.swal2-styled" 出现
                    var confirmButton = document.querySelector('button.swal2-confirm.swal2-styled');
                    if (confirmButton) {
                        confirmButton.click();
                        // 停止观察变化
                        observer.disconnect();
                    }
                });
            });

            // 开始观察DOM变化
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
})();