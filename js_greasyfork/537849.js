// ==UserScript==
// @name         gooboo互动钓鱼自动
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测光标位置并点击钓鱼按钮
// @author       YourName
// @match        https://gooboo.0nz.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537849/gooboo%E4%BA%92%E5%8A%A8%E9%92%93%E9%B1%BC%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537849/gooboo%E4%BA%92%E5%8A%A8%E9%92%93%E9%B1%BC%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CHECK_INTERVAL = 50; // 检测间隔（毫秒）
    const TARGET_TOLERANCE = 0; // 允许的误差范围（百分比）

    // 获取元素函数
    const getElement = (className) => document.querySelector(`.${className}`);

    // 解析百分比数值
    const parsePercentage = (value) => parseFloat(value.replace('%', ''));

    // 自动钓鱼逻辑
    function autoFishing() {
        const target = getElement('fishing-game-target');
        const cursor = getElement('fishing-game-cursor');
        const button = getElement('fishing-game-button')?.querySelector('button');

        if (!target || !cursor || !button) return;

        // 获取目标区域范围
        const targetLeft = parsePercentage(target.style.left);
        const targetWidth = parsePercentage(target.style.width);
        const targetRight = targetLeft + targetWidth;

        // 获取光标位置
        const cursorLeft = parsePercentage(cursor.style.left);

        // 判断是否在目标区域内（含误差范围）
        if (cursorLeft >= targetLeft - TARGET_TOLERANCE && cursorLeft <= targetRight + TARGET_TOLERANCE) {
            button.click();
            console.log('检测到有效位置，已自动点击！');
        }
    }

    // 启动检测
    setTimeout(() => {
        setInterval(autoFishing, CHECK_INTERVAL);
        console.log('自动钓鱼脚本已启动');
    }, 2000); // 延迟2秒确保元素加载完成

})();