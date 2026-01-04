// ==UserScript==
// @name         小红书视频 自动播放&自动取消静音
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  小红书网页版：新打开视频笔记时，自动播放并取消静音。
// @author       GVAAA
// @match        *://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539830/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/539830/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 核心处理函数：对指定的 video 元素进行自动播放和取消静音操作
     * @param {HTMLVideoElement} video - 视频DOM元素
     */
    function handleVideoPlayback(video) {
        // 添加一个标记，防止重复处理同一个 video 元素
        if (video.__autoPlayAndUnmuteHandled) {
            return;
        }
        video.__autoPlayAndUnmuteHandled = true;

        // 1. 尝试直接播放视频
        // .play() 方法会返回一个 Promise
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // 播放成功后，确保取消静音
                video.muted = false;
                if (video.volume < 0.1) { // 如果音量过低，则设置为100%
                    video.volume = 1.0;
                }
                console.log('XHS Helper: 视频已自动播放并取消静音。');
            }).catch(error => {
                // 自动播放失败（通常是由于浏览器策略限制）
                // 此时，我们仍然确保一旦用户手动播放，声音是开启的
                console.error('XHS Helper: 自动播放被浏览器阻止。', error);
                video.muted = false; // 预先取消静音，等待用户交互
            });
        }

        // 2. 无论是否自动播放成功，都立即设置取消静音
        // 这样即使用户需要手动点击播放，声音也已经准备好了
        video.muted = false;

        // 3. 添加 'play' 事件监听器作为保险
        // 如果视频因任何原因（例如用户手动暂停再播放）进入播放状态，都再次确保其为非静音状态
        video.addEventListener('play', () => {
            if (video.muted) {
                video.muted = false;
            }
        });
    }

    /**
     * 扫描整个文档，寻找并处理所有的 video 元素
     */
    function scanAndProcessVideos() {
        document.querySelectorAll('video').forEach(handleVideoPlayback);
    }

    /**
     * 设置一个DOM变动观察器 (MutationObserver)
     * 这是应对小红书动态加载内容（如弹窗或无刷新跳转）的关键
     */
    function setupMutationObserver() {
        if (window.__xhsVideoObserver) return;
        window.__xhsVideoObserver = true;

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 仅处理元素节点
                        // 如果新添加的节点本身就是 video
                        if (node.tagName === 'VIDEO') {
                            handleVideoPlayback(node);
                        }
                        // 否则，在其子树中查找 video
                        else if (node.querySelectorAll) {
                            node.querySelectorAll('video').forEach(handleVideoPlayback);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true, // 观察子节点的增删
            subtree: true    // 观察所有后代节点
        });
    }

    /**
     * 等待 <body> 元素加载完毕后再执行关键操作
     * @param {Function} callback - 待执行的回调函数
     */
    function onBodyReady(callback) {
        if (document.body) {
            callback();
        } else {
            const observer = new MutationObserver(() => {
                if (document.body) {
                    observer.disconnect();
                    callback();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
    }

    // --- 脚本执行入口 ---

    // 1. 等待 body 加载后，立即扫描并设置观察器
    onBodyReady(() => {
        scanAndProcessVideos();
        setupMutationObserver();
    });

    // 2. 为确保万无一失，在 DOM 完全加载后再次扫描
    window.addEventListener('DOMContentLoaded', scanAndProcessVideos);
})();