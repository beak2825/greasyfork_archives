// ==UserScript==
// @name         「网页播放」模式
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  为视频直播页增加网页播放模式，左侧视频，右侧弹幕。暂时先只支持咪咕视频(其他很多平台都已经有这个模式了
// @author       https://github.com/ienone
// @match        *://*.miguvideo.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541105/%E3%80%8C%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E3%80%8D%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/541105/%E3%80%8C%E7%BD%91%E9%A1%B5%E6%92%AD%E6%94%BE%E3%80%8D%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
'use strict';

/**
 * @description 平台配置列表
 */
const platforms = [
    {
        name: 'Migu Video',
        match: (url) => /miguvideo\.com\/(p\/live|mgs\/website\/prd\/sportLive\.html)/.test(url),
        selectors: {
            parentContainer: '.playcont.cf',
            playerContainer: '.webPlay',
            chatContainer: '.episode.fr',
            chatWrapper: '.chatroom-wrapper',
            buttonTarget: '.shareBar .share-info .top',
            elementsToHide: [
                '.footer',
                '.match-info-container',
                '.tapIfame',
                '.float-btn',
            ]
        },
            getStyles: function(selectors) {
                const elementsToHideStr = selectors.elementsToHide.map(sel => sel).join(',\n');
                const expressivePurple = '#8A5CF5'; // Material 3 Expressive Purple

                return `
                    ${selectors.playerContainer}, ${selectors.chatContainer}, ${elementsToHideStr}, .episodeControl_act {
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* 使用更平滑的动画曲线 */
                    }

                    /* 网页模式激活样式 */
                    body.webpage-mode-active { overflow: hidden; }
                    body.webpage-mode-active ${selectors.parentContainer} {
                        display: flex;
                        flex-direction: row;
                        position: fixed;
                        top: 72px; /* 顶部导航栏高度 */
                        left: 0; right: 0; bottom: 0;
                        width: 100%; height: calc(100vh - 72px);
                        z-index: 999;
                        background-color: #000; /* 将背景设为黑色，修复缝隙问题 */
                    }

                    /* 播放器区域 */
                    body.webpage-mode-active ${selectors.playerContainer} {
                        order: 1;
                        flex: 1 1 auto;
                        margin-right: 0 !important;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }
                    body.webpage-mode-active ${selectors.playerContainer} .title { flex-shrink: 0; }
                    body.webpage-mode-active ${selectors.playerContainer} .play { flex-grow: 1; }
                    body.webpage-mode-active #sport-live { height: 100% !important; }

                    /*
                     * 弹幕区域
                     */
                    body.webpage-mode-active ${selectors.chatContainer} {
                        order: 2;
                        float: none !important;
                        position: static !important;
                        width: 380px;
                        height: 100%;
                        flex-shrink: 0;
                        display: flex;
                        flex-direction: column;
                        background-color: #fff;
                        /* [已修复] 移除此处的边框，解决分割线问题 */
                        /* border-left: 1px solid #333; */
                    }

                    body.webpage-mode-active ${selectors.chatContainer} .right-box {
                        display: flex; flex-direction: column;
                        height: 100%; overflow: hidden;
                    }
                    body.webpage-mode-active ${selectors.chatWrapper} { flex-grow: 1; overflow-y: auto; }
                    body.webpage-mode-active #chat .__panel { margin-right: 0 !important; }
                    body.webpage-mode-active .sendBox { flex-shrink: 0; }

                    /* 隐藏无关元素 */
                    body.webpage-mode-active ${elementsToHideStr} {
                        opacity: 0 !important;
                        visibility: hidden !important;
                        pointer-events: none !important;
                    }

                    /* 按钮样式 */
                    .webpage-mode-btn {
                        background-color: transparent;
                        border: none;
                        cursor: pointer;
                        padding: 0 5px;
                        margin-left: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        height: 28px;
                        border-radius: 4px;
                        transition: all 0.3s;
                    }
                    .webpage-mode-btn span {
                        font-size: 13px;
                        color: #fff;
                        transition: color 0.3s;
                        font-weight: normal;
                    }
                    .webpage-mode-btn svg {
                        width: 18px;
                        height: 18px;
                        fill: #fff;
                        transition: fill 0.3s;
                    }
                    .webpage-mode-btn:hover {
                         background-color: rgba(255, 255, 255, 0.1);
                    }
                    /* 同时改变SVG和span的颜色 */
                    .webpage-mode-btn.active span {
                        color: ${expressivePurple};
                    }
                    .webpage-mode-btn.active svg {
                        fill: ${expressivePurple};
                    }

                    /* 优化弹幕收折按钮 */
                    body.webpage-mode-active .episodeControl_act {
                        position: fixed;
                        top: 50%;
                        transform: translateY(-50%);
                        right: 397px; /* 380px(弹幕宽) + 17px(间距) */
                        z-index: 1000;
                    }
                `;
            }
    }
];

/**
 * @description 主函数，初始化脚本
 */
function main() {
    const currentUrl = window.location.href;
    const platform = platforms.find(p => p.match(currentUrl));

    if (!platform) {
        return;
    }

    GM_addStyle(platform.getStyles(platform.selectors));

    const observer = new MutationObserver((mutations, obs) => {
        const buttonTarget = document.querySelector(platform.selectors.buttonTarget);
        if (buttonTarget) {
            createToggleButton(buttonTarget);
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * @description 创建并注入切换按钮
 * @param {HTMLElement} targetElement - 按钮将被添加到的目标元素
 */
function createToggleButton(targetElement) {
    if (document.querySelector('.webpage-mode-btn')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'webpage-mode-btn';
    toggleBtn.title = '网页模式'; // 添加悬停提示
    toggleBtn.innerHTML = `
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M85.2 186.1c0-21.4 17.4-38.8 38.8-38.8h776c21.4 0 38.8 17.4 38.8 38.8v651.8c0 21.4-17.4 38.8-38.8 38.8H124c-21.4 0-38.8-17.4-38.8-38.8V186.1z m77.6 38.8v574.2h698.4V224.9H162.8z m73.4 302c-15.2-15.2-15.2-39.7 0-54.9l156.7-156.7 54.9 54.9-129.2 129.3 129.3 129.3-54.9 54.9-156.8-156.8zM634 315.3L790.7 472c15.1 15.2 15.1 39.7 0 54.9L634 683.6l-54.9-54.9 129.3-129.3-129.2-129.2 54.8-54.9z"></path>
        </svg>
        <span>网页模式</span>
    `;

    let isWebMode = false;
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isWebMode = !isWebMode;
        document.body.classList.toggle('webpage-mode-active');
        toggleBtn.classList.toggle('active', isWebMode); // 根据状态切换激活类
    });

    // 确保父容器是flex布局且垂直居中，以便按钮对齐
    targetElement.style.display = 'flex';
    targetElement.style.alignItems = 'center';

    targetElement.appendChild(toggleBtn);
}

// 脚本入口
main();

})();