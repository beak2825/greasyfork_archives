// ==UserScript==
// @name         斗鱼独轮车/自动弹幕机/刷弹幕
// @namespace    https://afdian.net/a/cwyuu
// @version      0.1
// @description  斗鱼独轮车！自动刷弹幕！可选择文件发！
// @author       cwyu
// @match        *://www.douyu.com/*
// @license      MIT
// @supportURL  1441577495@qq.com
// @contributionURL https://afdian.net/a/cwyuu
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @grant        GM_webRequest
// @grant        GM_info
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473848/%E6%96%97%E9%B1%BC%E7%8B%AC%E8%BD%AE%E8%BD%A6%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E6%9C%BA%E5%88%B7%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/473848/%E6%96%97%E9%B1%BC%E7%8B%AC%E8%BD%AE%E8%BD%A6%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%E6%9C%BA%E5%88%B7%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
    #my-window {
        position: fixed;
        top: 10px;
        left: 10px;
        width: 491px;
        height: 308px;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        z-index: 9999;
        overflow: hidden;
        color: #000;
    }

    #my-window .header {
        padding: 5px;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #000;
    }

    #my-window .main {
        padding: 10px;
    }

    #my-window .input-group {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    #my-window .input-group button {
        border: 1px solid #000;
    }
    `);

    let timer = null;
    let count = 0;

    // 创建窗口元素
    const myWindow = document.createElement("div");
    myWindow.id = "my-window";
    myWindow.innerHTML = `
    <div class="header">独轮车</div>
    <div class="main">
    <div class="input-group">
    <span>模式选择：</span>
    <select id="my-mode">
        <option value="0">原始模式</option>
        <option value="1">行模式</option>
        <option value="2">分节模式</option>
    </select>
</div>
<div class="input-group">
    <span>选择文件：</span>
    <input id="my-file" type="file" />
</div>
<div class="input-group">
    <span>分节大小：</span>
    <input id="my-chunk-size" type="number" />
</div>
        <div class="input-group">
            <span>发送内容：</span>
            <input id="my-message" type="text" />
        </div>
        <div class="input-group">
            <span>发送间隔：</span>
            <input id="my-interval" type="number" />
        </div>
        <div class="input-group">
            <span>免重字符：</span>
            <input id="my-char" type="text" />
        </div>
        <button id="start-btn">开始</button>
        <button id="stop-btn">停止</button>
    </div>
    `;

    // 将窗口添加到页面上
    document.body.appendChild(myWindow);


    let currentMode = 0;
    let lines = [];
    let currentLine = 0;
    let chars = '';
    let currentChar = 0;
    let chunkSize = 10;

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            reader.readAsText(file);
        });
    }

    function resetState() {
        lines = [];
        currentLine = 0;
        chars = '';
        currentChar = 0;
    }

    async function processFile(file) {
        const content = await readFile(file);
        if (currentMode == 1) {
            lines = content.split('\n');
        } else if (currentMode == 2) {
            chars = content;
        }
    }

    document.querySelector('#my-file').addEventListener('change', async function () {
        const file = this.files[0];
        await processFile(file);
    });

    document.querySelector('#my-chunk-size').addEventListener('change', function () {
        chunkSize = Number(this.value);
    });

    document.querySelector('#my-mode').addEventListener('change', async function () {
        currentMode = Number(this.value);
        resetState(); // 重置状态
        const file = document.querySelector('#my-file').files[0];
        if (file) {
            await processFile(file); // 重新处理文件
        }
    });

    function sendMessage() {
        if (currentMode === 0) {
            count += 1;
            // 从输入框获取你想要的内容
            var myMessage = document.querySelector("#my-message").value;
            var myChar = document.querySelector("#my-char").value;

            // 如果是偶数次，添加免重字符
            if (count % 2 === 0) {
                myMessage += myChar;
            }
        }

        if (currentMode === 1 && lines.length > 0) {
            myMessage = lines[currentLine];
            currentLine = (currentLine + 1) % lines.length;
        } else if (currentMode === 2 && chars.length > 0) {
            myMessage = chars.slice(currentChar, currentChar + chunkSize); // 这里改用slice
            currentChar = (currentChar + chunkSize) % chars.length;
        }

        // 定位输入框并输入你的内容
        var inputElement = document.querySelector(".ChatSend-txt");
        if (inputElement) {
            inputElement.value = myMessage;
        }

        // 定位发送按钮并点击它
        var chatSendButton = document.querySelector(".ChatSend-button");
        if (chatSendButton) {
            //chatSendButton.click();
            console.log(myMessage);
        }
    }

    // 获取开始和停止按钮
    var startButton = document.querySelector("#start-btn");
    var stopButton = document.querySelector("#stop-btn");

    // 当开始按钮被点击时，开始循环
    startButton.onclick = function () {
        var myInterval = document.querySelector("#my-interval").value;
        if (timer !== null) {
            clearInterval(timer);
        }
        timer = setInterval(sendMessage, myInterval * 1000);
    }

    // 当停止按钮被点击时，停止循环
    stopButton.onclick = function () {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }
})();
