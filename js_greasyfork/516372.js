// ==UserScript==
// @name         农场脚本美化
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  同步时分秒输入框和毫秒输入框的值
// @match        *://gamer.qq.com/v2/game/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516372/%E5%86%9C%E5%9C%BA%E8%84%9A%E6%9C%AC%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/516372/%E5%86%9C%E5%9C%BA%E8%84%9A%E6%9C%AC%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待3秒后检测 #cycletime 是否存在
    setTimeout(function () {
        const millisecondInput = document.querySelector("#cycletime");

        // 如果找不到 #cycletime 元素，则退出
        if (!millisecondInput) {
            console.warn("#cycletime input not found!");
            return;
        }

        // 设置 #cycletime 输入框的宽度为 10 字符宽度
        millisecondInput.style.width = "10ch";

        // 创建等号符号
        const equalsSign = document.createElement("span");
        equalsSign.textContent = " = ";
        equalsSign.style.marginLeft = "5px";

        // 在 #cycletime 输入框后面插入等号符号
        millisecondInput.parentNode.insertBefore(equalsSign, millisecondInput.nextSibling);

        // 使用 HTML 字符串创建时、分、秒输入框的容器，并在每个输入框右边添加单位
        const hmsContainer = document.createElement("div");
        hmsContainer.innerHTML = `
            <div style="display: inline-flex; gap: 5px; align-items: center; margin-left: 5px;">
                <div><input type="number" id="hourInput" value="0" style="width: 2ch;"> <span>时</span></div>
                <div><input type="number" id="minuteInput" value="0" style="width: 2ch;"> <span>分</span></div>
                <div><input type="number" id="secondInput" value="0" style="width: 2ch;"> <span>秒</span></div>
            </div>
        `;

        // 在等号符号后面插入时分秒容器
        equalsSign.parentNode.insertBefore(hmsContainer, equalsSign.nextSibling);

        // 获取时、分、秒输入框
        const hourInput = document.getElementById("hourInput");
        const minuteInput = document.getElementById("minuteInput");
        const secondInput = document.getElementById("secondInput");

        // 处理空输入的情况，确保当输入框为空时显示0
        function handleEmptyInput() {
            if (!hourInput.value) {
                hourInput.value = "0";
            }
            if (!minuteInput.value) {
                minuteInput.value = "0";
            }
            if (!secondInput.value) {
                secondInput.value = "0";
            }
        }

        // 将时分秒转换为毫秒并同步到毫秒输入框
        function syncToMilliseconds() {
            handleEmptyInput(); // 确保空值处理为0

            const hours = parseInt(hourInput.value, 10) || 0;
            const minutes = parseInt(minuteInput.value, 10) || 0;
            const seconds = parseInt(secondInput.value, 10) || 0;
            const milliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
            millisecondInput.value = milliseconds;
        }

        // 将毫秒转换为时分秒并同步到时分秒输入框
        function syncToHMS() {
            const milliseconds = parseInt(millisecondInput.value, 10) || 0;
            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            hourInput.value = hours;
            minuteInput.value = minutes;
            secondInput.value = seconds;
        }

        // 监听时分秒输入框的变化并同步到毫秒输入框
        hourInput.addEventListener("input", syncToMilliseconds);
        minuteInput.addEventListener("input", syncToMilliseconds);
        secondInput.addEventListener("input", syncToMilliseconds);

        // 监听毫秒输入框的变化并同步到时分秒输入框
        millisecondInput.addEventListener("input", syncToHMS);

        // 初始化时分秒输入框
        syncToHMS();

        function beautify() {
            localStorage.setItem("num", "0");
            const element = document.querySelector("#tipsText");
            if (element) {
                element.innerHTML = "";
            }

            const log = document.querySelector("#textarea-log");
            log.style.cssText = `
                    border: 1px solid rgb(204, 204, 204);
                    height: 142px;
                    border-radius: 10px;
                    padding-left: 5px;
                    `
        }

        beautify()
    }, 1500); // 延迟1.5秒
})();
