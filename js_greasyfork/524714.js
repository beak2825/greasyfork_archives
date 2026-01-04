// ==UserScript==
// @name         Aicnm Enhance
// @version      0.3
// @description  Generate a random token and redirect or add button with a refresh icon
// @author       You
// @match        https://chatgpt.aicnm.cc/*
// @grant        GM_addStyle
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/524714/Aicnm%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/524714/Aicnm%20Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成一个 999 到 999999 之间的随机整数
    function generateRandomNumber() {
        return Math.floor(Math.random() * (999999 - 999 + 1)) + 999;
    }

    // 判断当前页面是否为 login 页面
    if (window.location.href === 'https://chatgpt.aicnm.cc/login') {
        let randomNumber = generateRandomNumber();
        let newUrl = `https://chatgpt.aicnm.cc/?token=${randomNumber}&model=gpt-4o`;
        window.location.href = newUrl;
    } else {
        // 页面不是 login 时，添加按钮
        function createButton() {
            let button = document.createElement('div');
            button.id = 'randomTokenButton';
            button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 3V9H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 21V15H9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 9C19.3875 6.32595 16.3934 4.5 13 4.5C9.60659 4.5 6.61248 6.32595 5 9" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <path d="M3 15C4.61252 17.6741 7.6066 19.5 11 19.5C14.3934 19.5 17.3875 17.6741 19 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;

            // 添加样式
            GM_addStyle(`
                #randomTokenButton {
                    position: fixed;
                    top: 15%;
                    right: -25px; /* 默认缩进侧边栏 */
                    width: 50px;
                    height: 50px;
                    background-color: #4CAF50;
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                #randomTokenButton:hover {
                    right: 10px; /* 悬停时滑出 */
                }

                #randomTokenButton svg {
                    width: 25px;
                    height: 25px;
                    fill: white;
                }
            `);

            button.addEventListener('click', function() {
                let randomNumber = generateRandomNumber();
                let newUrl = `https://chatgpt.aicnm.cc/?token=${randomNumber}&model=gpt-4o`;
                window.location.href = newUrl;
            });

            document.body.appendChild(button);
        }

        createButton();

        // 确保按钮不会在动态更新时丢失
        const observer = new MutationObserver(() => {
            if (!document.getElementById('randomTokenButton')) {
                createButton();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
