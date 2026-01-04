// ==UserScript==
// @name         B站净化：隐藏推荐视频/首页推荐/播放结束推荐（保留选集）
// @namespace    https://greasyfork.org/users/Ghostflamez
// @version      3.1
// @description  保留选集，隐藏右侧推荐卡片、首页推荐内容和播放结束推荐，基于 Tommy Ho 脚本增强。
// @author       Ghostflamez
// @license      MIT
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @originalAuthor  Tommy Ho
// @originalScript  https://greasyfork.org/zh-CN/scripts/444480-%E9%9A%90%E8%97%8Fb%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%B8%AD%E7%9A%84%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91
// @originalAuthorPage https://greasyfork.org/zh-CN/users/670177-tommy-ho
// @downloadURL https://update.greasyfork.org/scripts/542620/B%E7%AB%99%E5%87%80%E5%8C%96%EF%BC%9A%E9%9A%90%E8%97%8F%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%92%AD%E6%94%BE%E7%BB%93%E6%9D%9F%E6%8E%A8%E8%8D%90%EF%BC%88%E4%BF%9D%E7%95%99%E9%80%89%E9%9B%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542620/B%E7%AB%99%E5%87%80%E5%8C%96%EF%BC%9A%E9%9A%90%E8%97%8F%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%92%AD%E6%94%BE%E7%BB%93%E6%9D%9F%E6%8E%A8%E8%8D%90%EF%BC%88%E4%BF%9D%E7%95%99%E9%80%89%E9%9B%86%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const currentPath = location.pathname;

    // ===== 首页处理逻辑：仅保留搜索栏 =====
    if (location.hostname === "www.bilibili.com" && currentPath === "/") {
        const InputBoxPlaceHolder = "bilibili 在此处搜索";

        const newStyle = document.createElement("style");
        newStyle.innerHTML = `
            body {
                overflow: hidden;
                background: white !important;
            }

            .left-entry , .right-entry, .trending, .bili-banner,
            .international-home, .bili-footer, .bili-header, .channel-entry, .bb-comment {
                display: none !important;
            }

            .center-search-container {
                position: fixed;
                width: 700px;
                top: 20vh;
                left: 50vw;
                transform: translate(-50%, -50%);
                z-index: 99999;
            }
        `;
        document.head.appendChild(newStyle);

        const coverDiv = document.createElement("div");
        coverDiv.style.cssText = `
            position: fixed;
            background-color: white;
            left: 0; top: 0;
            width: 100%; height: 100%;
            z-index: 998;
        `;
        document.body.appendChild(coverDiv);

        window.addEventListener('load', () => {
            const intv = setInterval(() => {
                const inputBox = document.querySelector(".nav-search-input");
                if (inputBox) {
                    clearInterval(intv);
                    inputBox.placeholder = InputBoxPlaceHolder;
                }
            }, 50);
        });

        return; // 首页处理完毕，退出脚本
    }

    // ===== 视频页播放推荐处理逻辑 =====

    // 隐藏播放结束推荐面板
    const style = document.createElement("style");
    style.innerHTML = `
        .bpx-player-ending-panel {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 禁用推荐视频自动播放设置
    localStorage.setItem("recommend_auto_play", "close");

    // 通用清理函数
    function cleanTargets() {
        document.querySelectorAll('.card-box, .rec-footer, .next-play .rec-title').forEach(el => el.remove());
    }

    // DOM 监听器
    function observeRightContainer() {
        const rightContainer = document.querySelector('.right-container');
        if (!rightContainer) return;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    if (
                        node.classList.contains('card-box') ||
                        node.classList.contains('rec-footer') ||
                        (node.matches('.rec-title') && node.parentElement?.classList.contains('next-play'))
                    ) {
                        node.remove();
                    } else {
                        node.querySelectorAll('.card-box, .rec-footer, .next-play .rec-title')
                            .forEach(el => el.remove());
                    }
                }
            }
        });

        observer.observe(rightContainer, { childList: true, subtree: true });
    }

    // 启动入口
    const bootInterval = setInterval(() => {
        const rightContainer = document.querySelector('.right-container');
        if (rightContainer) {
            clearInterval(bootInterval);
            cleanTargets();
            observeRightContainer();

            // 定时清理：防止推荐异步回弹
            setInterval(() => {
                cleanTargets();
            }, 2000);
        }
    }, 300);
})();