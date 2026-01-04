// ==UserScript==
// @name         douyin-life-autopush
// @namespace    http://tampermonkey.net/
// @version      2025-03-24
// @description  抖音来客自动发布!
// @author       You
// @match        https://life.douyin.com/p/life_creation/aigc*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=life.douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530711/douyin-life-autopush.user.js
// @updateURL https://update.greasyfork.org/scripts/530711/douyin-life-autopush.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const pushConfirm = document.createElement('input');
    pushConfirm.type = 'checkbox';
    pushConfirm.style.position = 'fixed';
    pushConfirm.style.top = '20px';
    pushConfirm.style.left = '220px';
    pushConfirm.style.zIndex = '9999';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = '300';
    input.min = '5';
    input.style.textAlign = 'center';
    input.style.position = 'fixed';
    input.style.top = '8px';
    input.style.left = '240px';
    input.style.width = '80px';
    input.style.zIndex = '9999';
    input.style.padding = '5px';
    input.style.borderRadius = '5px';
    input.style.border = '1px solid #ccc';

    const runButton = document.createElement('button');
    runButton.textContent = '执行操作';
    runButton.style.position = 'fixed';
    runButton.style.top = '8px';
    runButton.style.left = '323px';
    runButton.style.zIndex = '9999';
    runButton.style.padding = '5px';
    runButton.style.backgroundColor = '#28a745';
    runButton.style.border = 'none';
    runButton.style.color = 'white';
    runButton.style.borderRadius = '5px';

    const messageBox = document.createElement('div');
    messageBox.textContent = '执行:0,选中:0,发布:0';
    messageBox.style.position = 'fixed';
    messageBox.style.top = '12px';
    messageBox.style.left = '400px';
    messageBox.style.zIndex = '9999';
    messageBox.style.padding = '0 5px';
    messageBox.style.backgroundColor = '#f8f9fa';
    messageBox.style.border = '1px solid #ccc';
    messageBox.style.borderRadius = '5px';
    messageBox.style.minWidth = '80px';

    document.body.appendChild(pushConfirm);
    document.body.appendChild(input);
    document.body.appendChild(runButton);
    document.body.appendChild(messageBox); // 添加消息框到页面
    let items;
    let itemIndex = 0, pushNum = 0, runNum = 0, finalNum = 0;
    let intervalId = null;
    const clickItem = () => {
        document.querySelector('.byted-drawer-dialog .index-module_detail-indicator__placeholder__F0ikY').click();
        items = document.querySelectorAll(".location-account-menu-scroll-container")[1]
            .querySelectorAll('div[class^="index-module_account-select-item-pc__warpper"]');
        setTimeout(() => {
            items[itemIndex].scrollIntoView();
            items[itemIndex].click();
            itemIndex++;
            runNum++;
            if (itemIndex >= items.length) {
                itemIndex = 0;
            }
            setTimeout(() => {
                const quickPush = document.querySelector(".byted-drawer-dialog .byted-content-footer button.byted-btn-type-primary");
                quickPush.click();
                console.log(pushConfirm.checked);
                setTimeout(() => {
                    let checkbox = document.querySelector(".byted-infinite-scroll span.items-center label.byted-checkbox");
                    if (checkbox) {
                        checkbox.click();
                        if (pushConfirm.checked) {
                            setTimeout(() => {
                                quickPush.click();
                                finalNum++;
                            }, 800);
                        }
                        pushNum++;
                    }
                    messageBox.textContent = `执行:${runNum},选中:${pushNum},发布:${finalNum}`;
                }, 800);
            }, 800);
        }, 800);
    }

    const start = () => {
        const pushBtn = document.querySelector('.status-bar button.byted-btn');
        if (!pushBtn) {
            console.warn('发布按钮未找到!');
            return;
        }
        pushBtn.click();
        const interval = parseInt(input.value) * 1000;
        intervalId = setInterval(clickItem, interval);
    }
    let isRunning = false;
    runButton.addEventListener('click', () => {
        if (!isRunning) {
            const drawerMask = document.querySelector('.byted-drawer-mask');
            if (drawerMask) {
                document.querySelector('.byted-drawer-dialog .byted-drawer-close-icon').click();
                setTimeout(start, 1000);
            } else {
                start();
            }
            runButton.textContent = '取消执行';
            runButton.style.backgroundColor = '#dc3545';
            isRunning = true;
        } else {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            runButton.textContent = '执行操作';
            runButton.style.backgroundColor = '#28a745';
            isRunning = false;
        }
    });
})();