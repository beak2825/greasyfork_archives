// ==UserScript==
// @name         hanime1.me 宽屏模式（网页全屏）
// @version      1.0
// @namespace    https://github.com/ojdev/Tampermonkey
// @description  hanime1.me 宽屏模式
// @author       ojdev
// @match        *://hanime1.me/*
// @icon         https://vdownload.hembed.com/image/icon/nav_logo.png?secure=HxkFdqiVxMMXXjau9riwGg==,4855471889
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502975/hanime1me%20%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F%EF%BC%88%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502975/hanime1me%20%E5%AE%BD%E5%B1%8F%E6%A8%A1%E5%BC%8F%EF%BC%88%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function addWidescreenButton() {
        const controls = document.querySelector('.plyr__controls');

        if (controls && !document.querySelector('.plyr__controls__item[data-plyr="widescreen"]')) {
            // 获取现有控制按钮的宽高
            const sampleButton = controls.querySelector('.plyr__controls__item.plyr__control');
            const buttonStyles = window.getComputedStyle(sampleButton);
            const buttonWidth = buttonStyles.width;
            const buttonHeight = buttonStyles.height;
            const buttonMargin = buttonStyles.margin;

            // 创建宽屏按钮
            const widescreenButton = document.createElement('button');
            widescreenButton.classList.add('plyr__controls__item', 'plyr__control');
            widescreenButton.setAttribute('type', 'button');
            widescreenButton.setAttribute('aria-label', 'Widescreen');
            widescreenButton.setAttribute('data-plyr', 'widescreen');

            // 设置宽高等于现有按钮
            widescreenButton.style.width = buttonWidth;
            widescreenButton.style.height = buttonHeight;
            widescreenButton.style.margin = buttonMargin;

            // 添加宽屏图标并居中
            widescreenButton.innerHTML = `
                <span class="material-icons-outlined" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                    width_full
                </span>
                <span class="plyr__sr-only">Widescreen</span>
            `;

            // 点击切换宽屏模式
            widescreenButton.addEventListener('click', function() {
                const playerWrapper = document.querySelector('.plyr');
                const videoWrapper = document.querySelector('.plyr__video-wrapper');
                if (playerWrapper && videoWrapper) {
                    playerWrapper.classList.toggle('widescreen-mode');
                    videoWrapper.classList.toggle('widescreen-mode-video');
                    document.body.classList.toggle('widescreen-mode-body');
                }
            });

            // 将按钮插入到控制条中
            controls.appendChild(widescreenButton);

            // 添加宽屏模式的 CSS 样式
            const style = document.createElement('style');
            style.innerHTML = `
                /* 宽屏模式的样式 */
                .widescreen-mode {
                    width: 100% !important;
                    height: 100vh !important;
                    max-width: none !important;
                    max-height: none !important;
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    background-color: #000;
                    z-index: 99999 !important; /* 确保播放器在最顶层 */
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .widescreen-mode-video {
                    width: 100% !important;
                    height: calc(100vh - 60px) !important; /* 调整高度以保持控制条可见 */
                }

                .widescreen-mode-body {
                    overflow: hidden;
                }

                .plyr__controls {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    z-index: 100000 !important; /* 确保控制条在播放器上方 */
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 轮询检查 .plyr__controls 是否加载完成
    function checkForControls() {
        if (document.querySelector('.plyr__controls')) {
            addWidescreenButton();
        } else {
            setTimeout(checkForControls, 500); // 每 500 毫秒检查一次
        }
    }

    // 启动检查
    checkForControls();
})();