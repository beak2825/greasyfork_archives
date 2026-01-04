// ==UserScript==
// @name         Drrrkari 在席・退席ボタン6
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  ドラッグ＆リサイズ可能な在席・退席ボタン（二重送信防止機能付き）
// @author       AoiRabbit
// @match        *://drrrkari.com/room*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://unpkg.com/axios/dist/axios.min.js
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @downloadURL https://update.greasyfork.org/scripts/500839/Drrrkari%20%E5%9C%A8%E5%B8%AD%E3%83%BB%E9%80%80%E5%B8%AD%E3%83%9C%E3%82%BF%E3%83%B36.user.js
// @updateURL https://update.greasyfork.org/scripts/500839/Drrrkari%20%E5%9C%A8%E5%B8%AD%E3%83%BB%E9%80%80%E5%B8%AD%E3%83%9C%E3%82%BF%E3%83%B36.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const roomKeeperInterval = 5 * 60 * 1000; // 5分
    const colorChangeInterval = 3000; // 3秒
    const absentMessageInterval = 5 * 60 * 1000; // 5分
    const menu = document.querySelector(".menu");
    const input = document.querySelector("#message .inputarea textarea");
    const submit = document.querySelector("#message .submit input");

    let isRoomKeeperOn = true;
    let lastAwayTime = 0;
    let lastSentMessage = ""; // 最後に送信したメッセージを記録
    let dragOffsetX = 0, dragOffsetY = 0; // ドラッグ操作のオフセット

    const savedData = GM_getValue('buttonData', { x: 0, y: 0, width: 100, height: 40 });
    let buttonPosX = savedData.x;
    let buttonPosY = savedData.y;
    let buttonWidth = savedData.width;
    let buttonHeight = savedData.height;

    const drrrHelperTools = document.createElement("li");
    drrrHelperTools.setAttribute("class", "drrrHelperTools");

    const childTools = document.createElement("button");
    childTools.setAttribute("class", "helperTools");
    childTools.style.position = 'absolute';
    childTools.style.backgroundColor = "green";
    childTools.style.color = "white";
    childTools.style.borderRadius = "5px";
    childTools.style.left = `${buttonPosX}px`;
    childTools.style.top = `${buttonPosY}px`;
    childTools.style.width = `${buttonWidth}px`;
    childTools.style.height = `${buttonHeight}px`;
    childTools.innerText = "在席";

    const resizeHandle = document.createElement("div");
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.right = '0';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.cursor = 'se-resize';
    resizeHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    childTools.appendChild(resizeHandle);

    drrrHelperTools.appendChild(childTools);
    menu.insertBefore(drrrHelperTools, menu.firstChild);

    // ドラッグ開始
    childTools.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (e.target === resizeHandle) return; // リサイズ中はドラッグしない
        dragOffsetX = e.clientX - childTools.offsetLeft;
        dragOffsetY = e.clientY - childTools.offsetTop;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    });

    function onDrag(e) {
        e.preventDefault();
        buttonPosX = e.clientX - dragOffsetX;
        buttonPosY = e.clientY - dragOffsetY;
        childTools.style.left = `${buttonPosX}px`;
        childTools.style.top = `${buttonPosY}px`;
    }

    function stopDrag() {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        saveButtonData();
    }

    function saveButtonData() {
        GM_setValue('buttonData', { x: buttonPosX, y: buttonPosY, width: buttonWidth, height: buttonHeight });
    }

    childTools.onclick = (e) => {
        if (e.target !== childTools) return;
        isRoomKeeperOn = !isRoomKeeperOn;
        if (isRoomKeeperOn) {
            childTools.innerText = "在席";
            childTools.style.backgroundColor = "green";
            sendChatMessage(createMessage("戻りました"));
        } else {
            childTools.innerText = "退席";
            childTools.style.backgroundColor = "red";
            lastAwayTime = Date.now();
            sendChatMessage(createMessage("退席中"));
        }
    };

    function sendChatMessage(text) {
        if (!text || text === lastSentMessage) return;
        input.value = text;
        submit.click();
        lastSentMessage = text;
        console.log("Sent: ", text);
    }

    function createMessage(status) {
        const time = getCurrentTime();
        return `${status} ${time}`;
    }

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    setInterval(() => {
        if (!isRoomKeeperOn) {
            sendChatMessage(createMessage("退席中"));
        }
    }, roomKeeperInterval);

    setInterval(() => {
        childTools.style.backgroundColor = isRoomKeeperOn ? "green" : "red";
    }, colorChangeInterval);

    setInterval(() => {
        if (!isRoomKeeperOn && Date.now() - lastAwayTime > absentMessageInterval) {
            sendChatMessage(createMessage("退席中"));
            lastAwayTime = Date.now();
        }
    }, absentMessageInterval);
})();
