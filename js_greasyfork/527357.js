// ==UserScript==
// @name        ちょーーーはっぴー！
// @namespace   Violentmonkey Scripts
// @match       https://pictsense.com/*
// @grant       none
// @version     1.0
// @author      mahaara
// @match        https://pictsense.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pictsense.com
// @run_at       document_end
// @description 2025/2/19 0:11:13
// @downloadURL https://update.greasyfork.org/scripts/527357/%E3%81%A1%E3%82%87%E3%83%BC%E3%83%BC%E3%83%BC%E3%81%AF%E3%81%A3%E3%81%B4%E3%83%BC%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/527357/%E3%81%A1%E3%82%87%E3%83%BC%E3%83%BC%E3%83%BC%E3%81%AF%E3%81%A3%E3%81%B4%E3%83%BC%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;
    let interval;

    // ボタンを作る
    let button = document.createElement("button");
    button.innerText = "しあわせ！";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    button.style.padding = "10px";
    button.style.background = "red";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";

    button.onclick = function () {
        if (isRunning) {
            // 停止
            clearInterval(interval);
            button.innerText = "しあわせ！";
            button.style.background = "red";
        } else {
            // 連打開始
            interval = setInterval(() => {
                let chatText = document.getElementById('chatText');
                let chatButton = document.getElementById('chatSubmitButton');

                if (chatText && chatButton) {
                    chatText.value = 'しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！しあわせ！';
                    chatButton.click();
                }
            }, 165); // 0.1秒ごとに送信

            button.innerText = "しあわせをあげない";
            button.style.background = "blue";
        }
        isRunning = !isRunning;
    };

    document.body.appendChild(button);
})();
