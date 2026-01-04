// ==UserScript==
// @name         Steam profile DIY
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自用DIY
// @author       You
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499986/Steam%20profile%20DIY.user.js
// @updateURL https://update.greasyfork.org/scripts/499986/Steam%20profile%20DIY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observerConfig = {
        childList: true,
        subtree: true
    };

    const observeInterval = 10000; // 10秒钟检测一次
    let lastExecutionTime = 0;

    const getElement = (selector) => document.querySelector(selector);

    const modifyDiv1 = (element) => {
        if (element) {
            element.innerHTML = `
                <style>
                    .profile_ban_status {
                        margin-bottom: 32px;
                        color: #a94847;
                        line-height: 22px;
                    }
                </style>
                <div class="profile_in_game persona in-game">
                    <div class="profile_in_game_header">当前正在游戏</div>
                    <div class="profile_in_game_name">Counter-Strike 2</div>
                    <div class="profile_in_game_joingame"></div>
                </div>
                <div class="profile_ban_status">
                    <div class="profile_ban">
                        891 个记录在案的 VAC 封禁
                        <span class="profile_ban_info">| <a class="whiteLink" href="https://support.steampowered.com/kb_article.php?ref=7849-Radz-6869&amp;l=schinese" target="_blank" rel="">信息</a></span>
                    </div>
                    <div class="profile_ban">
                        1649 个记录在案的游戏封禁
                        <span class="profile_ban_info">| <a class="whiteLink" href="https://support.steampowered.com/kb_article.php?ref=6899-IOSK-9514&amp;l=schinese" target="_blank" rel="">信息</a></span>
                    </div>
                    当前已禁止交易<br>
                    上次封禁于 61 天前
                </div>
            `;
            console.log('修改了div1的内容');
        }
    };

    const modifyDiv2 = (element) => {
        if (element) {
            const currentUrl = window.location.href;
            const modifiedUrl = currentUrl.replace('steamcommunity.cn', 'steamcommunity.com');
            element.innerHTML = `
                <a class="btn_profile_action btn_medium" href="${modifiedUrl}">
                    <span>添加我为好友（需要加速器）</span>
                </a>
            `;
            console.log('修改了div2的内容');
        }
    };

    const modifyGreenEnvelope = (element) => {
        if (element) {
            // 背景变红
            element.style.backgroundColor = 'rgb(255 0 0 / 73%)';

            // 查找 SVG 并修改颜色为白色
            const svgIcon = element.querySelector('svg');
            if (svgIcon) {
                svgIcon.style.color = 'white';
            }

            element.addEventListener('click', (e) => {
                e.preventDefault();
                const width = 750;
                const height = 510;
                const left = (window.screen.width / 2) - (width / 2);
                const top = (window.screen.height / 2) - (height / 2);
                window.open('https://steamcommunity.cn/ValveAntiCheat/VAC.html', 'newwindow', `height=${height},width=${width},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no`);
            });
            console.log('修改了绿色信封菜单的内容');
        }
    };

    const modifyWalletBalance = (element) => {
        if (element) {
            element.textContent = '¥ 875,523.41';
            console.log('修改了钱包余额的内容');
        }
    };

    const insertScript = () => {
        const head = document.head;
        if (head) {
            const script = document.createElement('script');
            script.src = 'https://steamcommunity.cn/analytics.js';
            head.insertBefore(script, head.firstChild);
            console.log('在<head>下插入了<script>标签');
        }
    };

    const observer = new MutationObserver(function(mutations) {
        const now = Date.now();
        if (now - lastExecutionTime < observeInterval) {
            return;
        }
        lastExecutionTime = now;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                console.log('检测到节点添加'); 

                const div1 = getElement('.responsive_status_info');
                const div2 = getElement('.profile_header_actions');
                const greenEnvelope = document.getElementById('green_envelope_menu_root');
                const walletBalance = document.getElementById('header_wallet_balance');

                // 简单的防抖检查，如果都没找到则跳过
                if (!div1 && !div2 && !greenEnvelope && !walletBalance) {
                    return;
                }

                modifyDiv1(div1);
                modifyDiv2(div2);
                modifyGreenEnvelope(greenEnvelope);
                modifyWalletBalance(walletBalance);

                if (div1 && div2 && greenEnvelope && walletBalance) {
                    observer.disconnect();
                    console.log('所有元素都找到了并修改了，停止观察');
                }
            }
        });
    });

    observer.observe(document.body, observerConfig);
    console.log('开始观察body元素的子节点变化');

    // 插入<script>标签
    insertScript();
})();