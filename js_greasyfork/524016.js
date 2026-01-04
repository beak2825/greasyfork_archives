// ==UserScript==
// @name         csgo2.wiki出品 Buff自动检视
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击Buff市场中的检视按钮
// @author       csgo2.wiki
// @match        https://buff.163.com/market/steam_inventory*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      All Rights Reserved - 保留所有权利
// @downloadURL https://update.greasyfork.org/scripts/524016/csgo2wiki%E5%87%BA%E5%93%81%20Buff%E8%87%AA%E5%8A%A8%E6%A3%80%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/524016/csgo2wiki%E5%87%BA%E5%93%81%20Buff%E8%87%AA%E5%8A%A8%E6%A3%80%E8%A7%86.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2025 csgo2.wiki
 * 本代码受版权法保护。
 * 未经明确授权，禁止：
 * 1. 复制、分发本代码
 * 2. 修改、创建衍生作品
 * 3. 用于商业用途
 * 违者必究。
 */

(function() {
    'use strict';

    let currentIndex = 0;
    let intervalId = null;
    let isPaused = GM_getValue('isPaused', true);

    function createPauseButton() {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        updateButtonState(button);
        
        button.addEventListener('click', function() {
            isPaused = !isPaused;
            GM_setValue('isPaused', isPaused);
            updateButtonState(button);
            
            if (isPaused) {
                clearInterval(intervalId);
                intervalId = null;
            } else {
                startClicking();
            }
        });
        
        document.body.appendChild(button);
    }

    function updateButtonState(button) {
        button.textContent = isPaused ? '开始检视' : '暂停检视';
        button.style.backgroundColor = isPaused ? '#4CAF50' : '#f44336';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
    }

    function clickNextInspectButton() {
        const inspectButtons = document.querySelectorAll('i[class*="icon_inspect"]');

        if (currentIndex < inspectButtons.length) {
            inspectButtons[currentIndex].click();
            console.log(`点击了第 ${currentIndex + 1} 个检视按钮`);
            currentIndex++;
        } else {
            clearInterval(intervalId);
            intervalId = null;
            isPaused = true;
            GM_setValue('isPaused', true);
            const button = document.querySelector('button');
            if (button) updateButtonState(button);
            console.log('所有检视按钮已点击完成');
        }
    }

    function startClicking() {
        if (!intervalId) {
            currentIndex = 0;
            intervalId = setInterval(clickNextInspectButton, 1000);
        }
    }

    window.addEventListener('load', function() {
        createPauseButton();
        if (!isPaused) {
            startClicking();
        }
    });
})();