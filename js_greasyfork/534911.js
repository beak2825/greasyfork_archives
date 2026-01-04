// ==UserScript==
// @name         YouTube 首页视频排列数量调整+自动继续播放
// @namespace    https://www.acy.moe
// @supportURL   https://www.acy.moe
// @version      1.1.0
// @description  自定义 YouTube 首页视频排列数量，同时支持自动忽略“视频已暂停”提示继续播放，所有功能都有开关控制。
// @author       NEET姬
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/534911/YouTube%20%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E6%8E%92%E5%88%97%E6%95%B0%E9%87%8F%E8%B0%83%E6%95%B4%2B%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/534911/YouTube%20%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E6%8E%92%E5%88%97%E6%95%B0%E9%87%8F%E8%B0%83%E6%95%B4%2B%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY_COLUMNS = 'yt_grid_columns';
    const STORAGE_KEY_ENABLED = 'yt_grid_enabled';
    const STORAGE_KEY_AUTOPLAY = 'yt_continue_enabled';
    const DEFAULT_COLUMNS = 6;

    function getColumns() {
        return parseInt(localStorage.getItem(STORAGE_KEY_COLUMNS)) || DEFAULT_COLUMNS;
    }

    function setColumns(n) {
        localStorage.setItem(STORAGE_KEY_COLUMNS, n);
        applyGridStyle(n);
    }

    function isEnabled() {
        return localStorage.getItem(STORAGE_KEY_ENABLED) !== 'false';
    }

    function setEnabled(state) {
        localStorage.setItem(STORAGE_KEY_ENABLED, state);
        if (state) {
            applyGridStyle(getColumns());
        } else {
            removeGridStyle();
        }
    }

    function isAutoplayEnabled() {
        return localStorage.getItem(STORAGE_KEY_AUTOPLAY) !== 'false';
    }

    function setAutoplayEnabled(state) {
        localStorage.setItem(STORAGE_KEY_AUTOPLAY, state);
        alert(`自动播放功能已${state ? "启用" : "禁用"}，页面将刷新`);
        location.reload();
    }

    function applyGridStyle(columns) {
        if (!isEnabled()) return;

        const styleId = 'yt-grid-style';
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        styleTag.textContent = `
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${columns} !important;
            }
            ytd-rich-grid-video-renderer {
                max-width: ${Math.floor(1200 / columns)}px !important;
                zoom: 0.9 !important;
            }
            ytd-app {
                overflow-x: hidden !important;
            }
        `;
    }

    function removeGridStyle() {
        const styleTag = document.getElementById('yt-grid-style');
        if (styleTag) styleTag.remove();
    }

    function createMenu() {
        GM_registerMenuCommand("设置每行视频数量", () => {
            const input = prompt("请输入每行视频数量（4~8）", getColumns());
            const value = parseInt(input);
            if (value >= 4 && value <= 8) {
                setColumns(value);
                alert(`已设置为每行显示 ${value} 个视频`);
                location.reload();
            } else {
                alert("请输入有效的数字（4 到 8）！");
            }
        });

        GM_registerMenuCommand(isEnabled() ? "🔴 禁用视频排列调整" : "🟢 启用视频排列调整", () => {
            const newState = !isEnabled();
            setEnabled(newState);
            alert(`视频排列调整已${newState ? "启用" : "禁用"}，页面将刷新以更新菜单`);
            location.reload();
        });

        GM_registerMenuCommand(isAutoplayEnabled() ? "🔴 禁用自动播放" : "🟢 启用自动播放", () => {
            const newState = !isAutoplayEnabled();
            setAutoplayEnabled(newState);
        });
    }

    function init() {
        if (isEnabled()) applyGridStyle(getColumns());
        createMenu();
    }

    // 页面加载完成后初始化
    const observer = new MutationObserver(() => {
        if (document.querySelector('ytd-rich-grid-renderer')) {
            init();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 自动继续播放功能（带开关）
    if (isAutoplayEnabled()) {
        (function autoplayContinueWatcher() {
            function searchDialog(videoPlayer) {
                if (videoPlayer.currentTime < videoPlayer.duration) {
                    let dialog = document.querySelector('yt-confirm-dialog-renderer') ||
                                 document.querySelector('ytmusic-confirm-dialog-renderer') ||
                                 document.querySelector('dialog');

                    if (dialog && (dialog.parentElement.style.display !== 'none' || document.hidden)) {
                        console.debug('自动继续播放');
                        videoPlayer.play();
                    } else if (videoPlayer.paused && videoPlayer.src) {
                        setTimeout(() => searchDialog(videoPlayer), 1000);
                    }
                }
            }

            function pausedFun({ target: videoPlayer }) {
                setTimeout(() => searchDialog(videoPlayer), 500);
            }

            function setPauseListener(player) {
                if (!player.dataset.pauseWatcher) {
                    player.dataset.pauseWatcher = true;
                    player.addEventListener('pause', pausedFun);
                }
            }

            function observerPlayerRoot(root) {
                const player = root.querySelector('video');
                if (player) setPauseListener(player);

                const ycpObserver = new MutationObserver(mutations => {
                    mutations.flatMap(m => [...m.addedNodes]).forEach(node => {
                        if (node.tagName && node.tagName === 'VIDEO') {
                            setPauseListener(node);
                        } else if (node.querySelector) {
                            const video = node.querySelector('video');
                            if (video) setPauseListener(video);
                        }
                    });
                });

                ycpObserver.observe(root, { childList: true, subtree: true });
            }

            const playerRoot = document.querySelector('#player');
            if (playerRoot) {
                observerPlayerRoot(playerRoot);
            } else {
                const rootObserver = new MutationObserver(mutations => {
                    mutations.flatMap(m => [...m.addedNodes]).forEach(node => {
                        if (node.querySelector) {
                            const pr = node.querySelector('#player');
                            if (pr) {
                                observerPlayerRoot(pr);
                                rootObserver.disconnect();
                            }
                        }
                    });
                });
                rootObserver.observe(document, { childList: true, subtree: true });
            }
        })();
    }
})();
