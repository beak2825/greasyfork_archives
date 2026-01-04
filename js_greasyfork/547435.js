// ==UserScript==
// @name         B站自动点赞
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  B站自动点赞脚本，支持普通视频、视频合集、稍后再看、专栏。
// @author       redmh
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/547435/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/547435/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 是否开启DEBUG输出
    const DEBUG = false;
    // 每INTERVAL(ms)检查是否需要点赞
    const INTERVAL = 5000;
    // 尝试点赞CHECK_DELAY(ms)后检查是否需要清除定时器
    const CHECK_DELAY = 1000;
    // MAX_MISS次找不到点赞按钮和视频后清除定时器
    const MAX_MISS = 3;
    // 普通视频、视频合集 document.querySelector("#arc_toolbar_report .video-like")
    // 稍后再看 document.querySelector("#playlistToolbar .video-like")
    // 专栏 document.querySelector("#app .like")
    function getLikeButton() {
        return document.querySelector("#arc_toolbar_report > div.video-toolbar-left > div > div:nth-child(1) > div") ||
            document.querySelector("#playlistToolbar > div.video-toolbar-left > div > div:nth-child(1) > div") ||
            document.querySelector("#app > div.opus-detail > div.right-sidebar-wrap > div.side-toolbar.transition > div.side-toolbar__box > div.side-toolbar__action.like");
    }
    // 视频链接 document.querySelector("#bilibili-player video")
    function getVideoUrl() {
        return document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div > video");
    }
    // 点赞报错
    function getLikeError() {
        return document.querySelector("body > div.van-message.van-message-error");
    }
    // 视频、专栏
    function isLiked(element) {
        const liked = ["on", "is-active"];
        return liked.some(className => element.classList.contains(className));
    }
    // 视频状态 document.querySelector("#bilibili-player .bpx-player-loading-panel")
    function isVideoLoaded() {
        const videoState = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-loading-panel");
        if(videoState) return videoState.className === "bpx-player-loading-panel";
        else return false;
    }

    // 统一管理日志输出
    function log(logContent) {
        if (DEBUG) console.log(logContent);
    }
    // 弹出警告
    function showAlert(alertContent) {
        const el = document.createElement('div');
        el.textContent = alertContent;
        el.style = 'position:fixed;top:10px;left:0;right:0;z-index:9999;width:300px;margin:auto;padding:8px;text-align:center;font-size:16px;color:white;background:black;';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }
    // 初始化检查
    function initCheck() {
        const url = location.href;

        if (url.includes("/opus/")) {
            if (getLikeButton()) {
                log("专栏页面，找到点赞按钮！");
                return 1;
            }
            else {
                log("专栏页面，未找到点赞按钮！");
                return -1;
            }
        }

        if (isVideoLoaded() && getVideoUrl() && getLikeButton()) {
            return 0;
        }
        else if (!isVideoLoaded()) {
            log("视频加载未完成！");
            return -1;
        }
        else if (!getVideoUrl()) {
            log("未找到视频链接！");
            return -1;
        }
        else if (!getLikeButton()) {
            log("未找到点赞按钮！");
            return -1;
        }
    }

    // --- 新增代码开始：修复点击区域过大的问题 ---
    function fixClickArea() {
        const style = document.createElement('style');
        // 将点赞按钮内的动画容器设置为“鼠标穿透”，这样就不会点到透明区域了
        style.textContent = `
            .video-like .svga-container,
            .video-like canvas {
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    fixClickArea();
    // --- 新增代码结束 ---

    // 初始化超时计数
    let missCount = 0;
    // setInterval
    let intervalId = null;
    // MutationObserver
    let observer = null;

    function tryLike() {
        missCount = 0;

        if (intervalId) {
            log("清除旧定时！");
            clearInterval(intervalId);
            intervalId = null;
        }

        intervalId = setInterval(() => {
            let ret = initCheck();

            if (ret === -1) {
                log(`初始化超时${++missCount}次！`);

                if (missCount >= MAX_MISS) {
                    log("初始化超时，清除定时！");
                    clearInterval(intervalId);
                    intervalId = null;
                    return;
                }
                else return;
            }

            if (ret === 0 && !observer) {
                log("启动BOM监控！");
                observer = new MutationObserver(mutations => {
                    const url = mutations[mutations.length - 1]?.target.src;
                    if (url) {
                        log("发现视频变化！");
                        tryLike();
                    }
                });
                observer.observe(getVideoUrl(), { attributes: true, attributeFilter: ['src'] });
            }

            const likeButton = getLikeButton();

            if (!isLiked(likeButton)) {
                log("尝试点赞！");
                likeButton.click();
            }
            else if (isLiked(likeButton)) {
                log("已经点赞，清除定时！");
                clearInterval(intervalId);
                intervalId = null;
                return;
            }

            setTimeout(() => {
                if (isLiked(likeButton)) {
                    log("已经点赞，清除定时！");
                    clearInterval(intervalId);
                    intervalId = null;
                    return;
                }
                else if (getLikeError()) {
                    log("点赞错误，请手动点赞！清除定时！");
                    showAlert("点赞错误，请手动点赞！");
                    clearInterval(intervalId);
                    intervalId = null;
                    return;
                }
            }, CHECK_DELAY);
        }, INTERVAL);
    }

    log("B站自动点赞脚本启动！");
    tryLike();
})();