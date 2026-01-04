// ==UserScript==
// @name         哔哩哔哩直播去除马赛克遮罩
// @description  去掉直播间各种烦人的马赛克遮罩，还你一个干净的直播间，增强观看体验，去他的昵称马赛克。
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @version      1.1
// @license      MIT
// @namespace https://greasyfork.org/users/1390050
// @downloadURL https://update.greasyfork.org/scripts/516800/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/516800/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //清除等待的遮罩时间，单位为毫秒
    const clear_time = 5000

    //弹幕同屏发送次数，默认为1
    const exp = 1

    //提示的弹幕颜色，支持英文和16进制颜色编码
    const color = "#90EE90"

    //此处调整弹幕滚动速度
    const speed = 0.10

    // 默认固定从左侧开始滚动的位置
    const dm_left = '0%'

    //弹幕距离顶部的位置，如果想要随机可以替换为：`${Math.random() * 100}%`
    const dm_top = '50%'

    //弹幕字号
    const dm_fontSize = '36px'

    //弹幕内容
    const msg = '直播间遮罩删除完毕!'

    function showFloatingMessage(message, color) {
        const div = document.createElement('div');
        div.textContent = message;
        div.style.position = 'fixed';
        div.style.top = dm_top;
        div.style.left = dm_left;
        div.style.color = color;
        div.style.fontSize = dm_fontSize;
        div.style.zIndex = '9999';
        div.style.whiteSpace = 'nowrap';
        document.body.appendChild(div);

        function animate() {
            let left = parseFloat(div.style.left);
            if (left > 100) {
                div.remove();
                return;
            }
            div.style.left = `${left + speed}%`;
            requestAnimationFrame(animate);
        }
        animate();

        setTimeout(() => {
            div.remove();
        }, 10000);
    }

    function removeElementsByClassName(className) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].remove();
        }
        for(let i = 0; i< exp; i++){
            showFloatingMessage(msg, color);
        }
    }

    setTimeout(function() {
        removeElementsByClassName("web-player-module-area-mask");
    }, clear_time);
})();