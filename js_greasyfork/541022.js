// ==UserScript==
// @name          Ymyautomyr
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a
// @author       123123
// @match        https://moyu-idle.com/*
// @match        https://www.moyu-idle.com/*
// @grant        none
// @license      me
// @downloadURL https://update.greasyfork.org/scripts/541022/Ymyautomyr.user.js
// @updateURL https://update.greasyfork.org/scripts/541022/Ymyautomyr.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const clickMyRoom = () => {
        const tabs = document.querySelectorAll('div.el-tabs__item');
        const roomTab = Array.from(tabs).find(el => el.textContent.trim() === '我的房间');
        if (roomTab) {
            const isActive = roomTab.classList.contains('is-active');
            if (!isActive) {
                roomTab.style.border = '2px solid red'; // 可视化标记
                roomTab.click();
                console.log('自动点击：我的房间');
            }
        } else {
            console.log('未找到“我的房间”标签');
        }
    };

    setInterval(clickMyRoom, 5000); // 每5秒轮询一次
})();
