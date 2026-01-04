// ==UserScript==
// @name         B站直播自动表情弹幕 & 点赞
// @namespace    https://bilibili.com/
// @license      MIT
// @version      1.0
// @description  在 Bilibili 直播间定期自动发送表情弹幕 + 点赞
// @author       彷徨の流萤
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535804/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E8%A1%A8%E6%83%85%E5%BC%B9%E5%B9%95%20%20%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/535804/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E8%A1%A8%E6%83%85%E5%BC%B9%E5%B9%95%20%20%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDanmuRunning = false; // 是否自动发送表情包
    let isLikeRunning = false;  // 是否自动点赞
    let danmuIntervalId = null; // 表情包计时器
    let likeIntervalId = null;  // 点赞计时器
    let danmuIntervalTime = 5000; // 表情包默认间隔（毫秒）
    let likeIntervalTime = 500;  // 点赞默认间隔（毫秒）
    let selectedEmoji = "打CALL"; // 默认表情

    // **创建 UI 面板**
    function createUI() {
        let panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.top = "100px";
        panel.style.right = "20px";
        panel.style.width = "220px";
        panel.style.background = "rgba(0, 0, 0, 0.8)";
        panel.style.color = "white";
        panel.style.padding = "10px";
        panel.style.borderRadius = "10px";
        panel.style.zIndex = "9999";
        panel.style.fontSize = "14px";

        panel.innerHTML = `
            <div style="text-align: center; font-size: 16px; margin-bottom: 10px;"><b>B站自动助手</b></div>

            <label><b>表情包功能</b></label>
            <button id="toggleDanmuBtn" style="width: 100%; margin-bottom: 5px;color: black;">开始发送表情</button>
            <label>间隔时间(ms):</label>
            <input id="danmuIntervalInput" type="number" value="${danmuIntervalTime}" style="width: 100%; color: black; margin-bottom: 5px;">
            <label>输入表情:</label>
            <input id="emojiInput" type="text" value="${selectedEmoji}" style="width: 100%; color: black; margin-bottom: 10px;">

            <hr style="border: 1px solid white; margin: 10px 0;">

            <label><b>点赞功能</b></label>
            <button id="toggleLikeBtn" style="width: 100%; margin-bottom: 5px;color: black;">开始点赞</button>
            <label>间隔时间(ms):</label>
            <input id="likeIntervalInput" type="number" value="${likeIntervalTime}" style="width: 100%; color: black; margin-bottom: 5px;">
        `;

        document.body.appendChild(panel);

        // **事件绑定**
        document.getElementById("toggleDanmuBtn").addEventListener("click", toggleDanmu);
        document.getElementById("toggleLikeBtn").addEventListener("click", toggleLike);
        document.getElementById("danmuIntervalInput").addEventListener("change", function () {
            danmuIntervalTime = parseInt(this.value);
        });
        document.getElementById("emojiInput").addEventListener("change", function () {
            selectedEmoji = this.value.trim();
        });
        document.getElementById("likeIntervalInput").addEventListener("change", function () {
            likeIntervalTime = parseInt(this.value);
        });
    }

    // **启动/停止 自动发送表情包**
    function toggleDanmu() {
        if (isDanmuRunning) {
            clearInterval(danmuIntervalId);
            isDanmuRunning = false;
            document.getElementById("toggleDanmuBtn").innerText = "开始发送表情";
            sendHaoting();
            console.log("[油猴] ❌ 已停止自动表情弹幕");
        } else {
            danmuIntervalId = setInterval(sendDanmu, danmuIntervalTime);
            isDanmuRunning = true;
            document.getElementById("toggleDanmuBtn").innerText = "停止发送表情";
            console.log("[油猴] 🚀 自动表情弹幕已启动！");
        }
    }

    // **启动/停止 自动点赞**
    function toggleLike() {
        if (isLikeRunning) {
            clearInterval(likeIntervalId);
            isLikeRunning = false;
            document.getElementById("toggleLikeBtn").innerText = "开始点赞";
            console.log("[油猴] ❌ 已停止自动点赞");
        } else {
            likeIntervalId = setInterval(sendLike, likeIntervalTime);
            isLikeRunning = true;
            document.getElementById("toggleLikeBtn").innerText = "停止点赞";
            console.log("[油猴] 🚀 自动点赞已启动！");
        }
    }

    // **发送表情弹幕**
    function sendDanmu() {
        let danmuInput = document.querySelector('.chat-input'); // 获取弹幕输入框
        let sendButton = document.querySelector('.bl-button.live-skin-highlight-button-bg'); // 获取发送按钮
        let emojiButton = document.querySelector('.emoticons-panel'); // 获取表情包按钮

        if (!danmuInput || !sendButton || !emojiButton) {
            console.log("[油猴] ❌ 未找到输入框、发送按钮或表情按钮，等待页面加载...");
            return;
        }

        console.log("[油猴] 🎭 正在尝试打开表情面板...");
        emojiButton.click(); // 点击打开表情包面板

        setTimeout(() => {
            let targetEmoji = document.querySelector(`.emoticon-item[title="${selectedEmoji}"] img`);

            if (targetEmoji) {
                console.log(`[油猴] ✅ 找到 '${selectedEmoji}' 表情，准备点击...`);
                targetEmoji.click(); // 选择表情
            } else {
                console.log(`[油猴] ❌ 未找到 '${selectedEmoji}' 表情，请手动检查表情面板！`);
            }
        }, 1000);
    }

    function sendHaoting(){
        let danmuInput = document.querySelector('.chat-input');
        let sendButton = document.querySelector('.bl-button.live-skin-highlight-button-bg');

        if (!danmuInput || !sendButton) {
            console.log("[油猴] ❌ 未找到输入框或发送按钮，等待页面加载...");
            return;
        }

        // **1. Simulate real user typing**
        let inputEvent = new InputEvent('input', { bubbles: true });
        danmuInput.value = '豪庭豪庭豪庭豪庭豪庭豪庭豪庭豪庭豪庭豪庭';
        danmuInput.dispatchEvent(inputEvent);

        // **2. Simulate an "Enter" key press to trigger the event**
        let enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        danmuInput.dispatchEvent(enterEvent);

        // **3. Delay clicking send button (if Enter doesn't work)**
        setTimeout(() => sendButton.click(), 300);
    }

    // **点赞功能**
    function sendLike() {
        let likeButton = document.querySelector('.like-btn');
        if (likeButton) {
            console.log("[油猴] ❤️ 正在点击点赞按钮...");
            likeButton.click();
        } else {
            console.log("[油猴] ❌ 未找到点赞按钮！");
        }
    }

    // **初始化 UI**
    createUI();
})();
