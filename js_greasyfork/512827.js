// ==UserScript==
// @name         Avatar Progress Border (Beta)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Modify avatar border to show progress
// @author       卡洛驰
// @match        *blog.csdn.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512827/Avatar%20Progress%20Border%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512827/Avatar%20Progress%20Border%20%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标值
    const targetValues = [10, 100, 1000, 10000, 100000, 10000000];
    // 颜色数组，每两个目标值使用一个颜色
    const colors = ['#badc58', '#22a6b3', '#eb4d4b', '#f9ca24', '#7e4df3', '#262626'];


    // 获取粉丝数
    const fanCountElement = document.querySelectorAll('.user-profile-head-info-r-c .user-profile-statistics-num')[3];

    if (fanCountElement) {
        const currentValue = parseInt(fanCountElement.textContent.replace(/,/g, ''), 10);

        // 找到最接近的目标值
        let targetValue = targetValues[0];
        for (let i = 0; i < targetValues.length; i++) {
            if (currentValue < targetValues[i]) {
                targetValue = targetValues[i];
                break;
            }
        }

        console.log(currentValue, targetValue);
        const progressPercentage = Math.min((currentValue / targetValue) * 100, 100); // 计算进度百分比，最大为100%

        // 获取对应的颜色
        const colorIndex = targetValues.indexOf(targetValue);
        const progressColor = colors[colorIndex];
        console.log(colorIndex, progressColor);

        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            .user-profile-head .user-profile-head-info .user-profile-head-info-l .user-profile-head-info-ll .user-profile-avatar[data-v-d1dbb6f8] {
                position: absolute;
                top: -12px;
                width: 102px;
                height: 102px;
                border-radius: 50%;
                background: #fff;
                border: 4px solid transparent !important; /* 边框颜色设置为透明 */
                background-image: conic-gradient(
                    ${progressColor} 0% ${progressPercentage}%, /* 进度 */
                    #f0f0f2 ${progressPercentage}% 100% /* 灰色部分表示剩余 */
                );
                background-origin: border-box;
                background-clip: border-box;
            }

            .user-profile-avatar img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
                display: block;
            }

            .user-profile-head-info-ll .data-display {
                position: absolute;
                top: -40px; /* 悬浮于头像上面10px */
                left: 50%; /* 水平居中 */
                transform: translateX(-50%); /* 使其真正居中 */
                background-color: #33333380; /* 背景色，半透明 */
                color: white; /* 字体颜色 */
                padding: 5px 10px; /* 内边距 */
                border-radius: 5px; /* 圆角边框 */
                font-size: 14px; /* 字体大小 */
                text-align: center; /* 文本居中 */
            }
        `;

        // 将样式添加到文档头部
        document.head.appendChild(style);

        // 创建数据展示模块
        const dataDisplay = document.createElement('div');
        dataDisplay.className = 'data-display';
        dataDisplay.textContent = `${currentValue}/${targetValue}`; // 格式为“23/100”

        // 将数据展示模块添加到头像上方
        const avatarElement = document.querySelector('.user-profile-head .user-profile-head-info .user-profile-head-info-l .user-profile-head-info-ll .user-profile-avatar[data-v-d1dbb6f8]');
        avatarElement.appendChild(dataDisplay);
    }
})();
