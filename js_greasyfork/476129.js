// ==UserScript==
// @name         小红书弹卡按钮监测
// @namespace    http://xxxxxx.com
// @version      1.1
// @icon         https://bkimg.cdn.bcebos.com/pic/f3d3572c11dfa9ec8a13fb131a9ae003918fa0ec6bd6
// @description  在指定网页上监测弹卡按钮的存在，并点击它
// @author       tunan
// @match        https://redlive.xiaohongshu.com/live_control
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476129/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BC%B9%E5%8D%A1%E6%8C%89%E9%92%AE%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/476129/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BC%B9%E5%8D%A1%E6%8C%89%E9%92%AE%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 获取用户保存的检测时间间隔，如果没有保存则使用默认值
    let checkInterval = localStorage.getItem('checkInterval');
    if (!checkInterval) {
        checkInterval = 5; // 默认5秒
    }

    // 获取用户保存的目标商品序号，如果没有保存则使用默认值
    let targetProductIndex = localStorage.getItem('targetProductIndex');
    if (!targetProductIndex) {
        targetProductIndex = 1; // 默认第一个商品
    }

    // 创建UI
    const ui = document.createElement('div');
    ui.innerHTML = `
        <div style="position: fixed; bottom: 10px; right: 10px; background: white; padding: 10px; border: 1px solid #ccc;">
            <label for="checkInterval">检测时间（秒）：</label>
            <input type="number" id="checkInterval" value="${checkInterval}">
            <br>
            <label for="targetProductIndex">目标商品序号：</label>
            <input type="number" id="targetProductIndex" value="${targetProductIndex}" placeholder="输入商品序号">
        </div>
    `;
    document.body.appendChild(ui);

    // 获取UI元素
    const checkIntervalInput = document.getElementById('checkInterval');
    const targetProductIndexInput = document.getElementById('targetProductIndex');

    // 设置检测时间
    checkIntervalInput.addEventListener('change', function() {
        checkInterval = parseInt(checkIntervalInput.value);
        localStorage.setItem('checkInterval', checkInterval); // 保存用户设置的检测时间
    });

    // 设置目标商品序号
    targetProductIndexInput.addEventListener('change', function() {
        targetProductIndex = parseInt(targetProductIndexInput.value);
        localStorage.setItem('targetProductIndex', targetProductIndex); // 保存用户设置的目标商品序号
    });

    // 检测并点击弹卡按钮
    function checkAndClickPopCardButton() {
        console.log('开始检测弹卡按钮...');
        const popCardButtons = document.querySelectorAll('.operation-item span[data-v-d95d4d32]');

        // 点击指定序号的商品的弹卡按钮
        if (targetProductIndex >= 1 && targetProductIndex <= popCardButtons.length) {
            const targetButton = popCardButtons[targetProductIndex - 1];
            console.log(`找到目标商品序号为${targetProductIndex}的弹卡按钮，尝试点击它。`);
            simulateMouseClick(targetButton);
        } else {
            console.log(`目标商品序号${targetProductIndex}无效或超出范围。`);
        }
    }

    // 模拟鼠标点击元素
    function simulateMouseClick(element) {
        const event = document.createEvent('MouseEvent');
        event.initEvent('click', true, true);
        element.dispatchEvent(event);
    }

    // 定期检测弹卡按钮
    setInterval(checkAndClickPopCardButton, checkInterval * 1000);
})();
