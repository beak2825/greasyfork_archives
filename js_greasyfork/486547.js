// ==UserScript==
// @name         4399云游戏自动进入游戏脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  它可以防止某个游戏排队人数太多，不想守着。当你装上脚本后，不管在哪个网页标签，只要打开着y.4399.com网站它可以在排队结束后自动进入游戏，非常方便！
// @author       飔梦
// @match        https://y.4399.com/*
// @exclude      https://y.4399.com/game/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         https://y.4399.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/486547/4399%E4%BA%91%E6%B8%B8%E6%88%8F%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E6%B8%B8%E6%88%8F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/486547/4399%E4%BA%91%E6%B8%B8%E6%88%8F%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E6%B8%B8%E6%88%8F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 插入开关按钮和提示信息
    function insertSwitchButtonAndHintMessage() {
        const switchButton = document.createElement('button');
        switchButton.id = 'switchButton';
        switchButton.style.cssText = 'position: fixed; bottom: 20px; left: 20px; background-color: #007bff; color: #fff; padding: 10px; border: none; cursor: pointer; font-size: 14px; border-radius: 5px; opacity: 0.8; transition: opacity 0.5s;';
        document.body.appendChild(switchButton);

        const hintMessage = document.createElement('div');
        hintMessage.id = 'hintMessage';
        hintMessage.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; background-color: #f8d7da; color: #721c24; text-align: center; padding: 10px; font-size: 16px; font-weight: bold; z-index: 9999; transition: top 0.5s;';
        hintMessage.innerHTML = '温馨提示：可能由于浏览器原因，在自动进入游戏时会被拦截，请将本站的权限“弹出式窗口和重定向”改为允许。如果不改为允许，无法跳转到游戏页面，需要你再点击一下你云玩的游戏。';

        document.body.appendChild(hintMessage);

        switchButton.addEventListener('click', function() {
            toggleHintMessage(switchButton);
        });

        switchButton.addEventListener('mouseenter', function() {
            switchButton.style.opacity = '1';
        });

        switchButton.addEventListener('mouseleave', function() {
            switchButton.style.opacity = '0.8';
        });

        updateSwitchButtonText(switchButton);
    }

    // 当前是否显示提示信息
    function isShowHintMessage() {
        return GM_getValue('showHintMessage', true);
    }

    // 显示或隐藏提示信息
    function toggleHintMessage(switchButton) {
        const show = !isShowHintMessage();
        GM_setValue('showHintMessage', show);

        const hintMessage = document.getElementById('hintMessage');
        if (hintMessage) {
            hintMessage.style.top = show ? '0' : '-100px';
        }

        if (switchButton) {
            updateSwitchButtonText(switchButton);
        }
    }

    // 更新按钮文本
    function updateSwitchButtonText(switchButton) {
        const show = isShowHintMessage();
        switchButton.innerHTML = show ? '隐藏提示信息' : '显示提示信息';
    }

    // 定时器间隔，单位毫秒
    const interval = 1000;

    // 当前排队人数小于5时发送通知
    function notifyIfQueueIsSmall() {
        const queueNumElement = document.querySelector('.wait-nums .d2 span');
        if (queueNumElement) {
            const queueNum = parseInt(queueNumElement.innerText);
            const hasNotified = GM_getValue('hasNotified', false);

            if (queueNum < 5 && !hasNotified) {
                GM_notification({
                    text: `当前排队人数为${queueNum}人，即将为你自动进入游戏。`,
                    title: '4399云游戏',
                    timeout: 10,
                });

                GM_setValue('hasNotified', true);
            }
        }
    }

    // 检测排队结束并点击立即进入
    function checkAndEnterGame() {
        const teamingPopup = document.querySelector('.pop.teaming');
        if (teamingPopup) {
            const enterButton = teamingPopup.querySelector('.i2');
            if (enterButton) {
                enterButton.click();
            }
        }
    }

    // 主循环
    function mainLoop() {
        const waitingPopup = document.querySelector('.pop.waiting');
        if (waitingPopup) {
            // 在排队页面
            notifyIfQueueIsSmall();
        } else {
            // 不在排队页面
            GM_setValue('hasNotified', false); // 重置已通知标志
            checkAndEnterGame();
        }
    }

    // 启动脚本
    insertSwitchButtonAndHintMessage();
    setInterval(mainLoop, interval);

    // 初始时根据设置显示或隐藏提示信息
    const hintMessage = document.getElementById('hintMessage');
    if (hintMessage) {
        hintMessage.style.top = isShowHintMessage() ? '0' : '-100px';
    }

    // 脚本菜单
    GM_registerMenuCommand('作者个人主页', function() {
        window.open('https://home.syyxin.eu.org', '_blank');
    });

})();