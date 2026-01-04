// ==UserScript==
// @name         AtCoder to Luogu Redirect Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a button to redirect from AtCoder problems to Luogu
// @author       ChatGPT (prompted by PsychoPinkQ)
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        GM_xmlhttpRequest
// @connect      luogu.com.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517108/AtCoder%20to%20Luogu%20Redirect%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/517108/AtCoder%20to%20Luogu%20Redirect%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 取得目前 AtCoder 題目 URL 的最後部分 (例如 abc328_g)
    const path = window.location.pathname;
    const match = path.match(/contests\/(.*?)\/tasks\/(.*)/);
    if (!match) return;

    const contest = match[1];
    const task = match[2];
    const luoguURL = `https://www.luogu.com.cn/problem/AT_${task}`;

    // 創建按鈕樣式
    const button = document.createElement("button");
    button.style.position = "fixed";
    button.style.bottom = "60px"; // 將按鈕位置向上調整
    button.style.left = "20px";
    button.style.padding = "5px 10px"; // 調整按鈕大小
    button.style.backgroundColor = "rgba(173, 216, 230, 0.7)"; // 淺藍色
    button.style.color = "black";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.fontSize = "12px"; // 縮小字體
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";
    button.textContent = "查看对应 Luogu 题目";

    // 檢查 Luogu 題目是否存在
    GM_xmlhttpRequest({
        method: "GET",
        url: luoguURL,
        onload: function(response) {
            // 判斷頁面標題是否包含「錯誤」
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const title = doc.querySelector("title").innerText;

            if (title.includes("错")) {
                // 題目不存在，將按鈕變為淺紅色
                button.style.backgroundColor = "rgba(240, 128, 128, 0.7)"; // 淺紅色
                button.textContent = "Luogu 似乎尚未有此题目";
                button.disabled = true;
            } else {
                // 題目存在，設置點擊事件
                button.onclick = function() {
                    window.open(luoguURL, "_blank");
                };
            }
        },
        onerror: function() {
            button.style.backgroundColor = "rgba(240, 128, 128, 0.7)"; // 請求錯誤也設置為淺紅色
            button.textContent = "发生异常";
            button.disabled = true;
        }
    });

    // 將按鈕加入頁面
    document.body.appendChild(button);
})();
