// ==UserScript==
// @name         TTC自动刷
// @author       丸子自用
// @license      丸子自用
// @version      1.8
// @description  ttc自动学习
// @match        *://www.ttcdw.cn/p/*
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/73019
// @downloadURL https://update.greasyfork.org/scripts/540523/TTC%E8%87%AA%E5%8A%A8%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540523/TTC%E8%87%AA%E5%8A%A8%E5%88%B7.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // ===== 工具函数 =====
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function onReady(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }

    function waitForPlayerReady(callback) {
        const check = () => {
            const video = document.querySelector('video');
            if (video && video.readyState >= 1) {
                console.log("[刷课脚本] 播放器已加载");
                callback();
            } else {
                console.log("[刷课脚本] 等待播放器加载...");
                setTimeout(check, 1000);
            }
        };
        check();
    }

    function forceAutoplay() {
        const video = document.querySelector('video');
        if (video) {
            video.muted = true;
            const promise = video.play();
            if (promise !== undefined) {
                promise.then(() => {
                    console.log("[刷课脚本] 视频播放成功");
                }).catch(err => {
                    console.warn("[刷课脚本] 视频播放失败", err);
                });
            }
        } else {
            console.log("[刷课脚本] 未找到 video 元素");
        }
    }

    // 判断元素是否可见
    function isElementVisible(el) {
        return el && el.offsetParent !== null;
    }

    // ===== 页面1：课程中心页面逻辑（修复版）=====
    async function doMyClassroomAction() {
        console.log("[刷课脚本] 进入课堂列表页");
        await sleep(2000);

        const studyMid = document.querySelector("span.total:nth-of-type(2)");
        if (studyMid) {
            console.log("[刷课脚本] 点击“学习中”");
            studyMid.click();
            await sleep(2000);

            const btn = document.querySelector("tr:nth-of-type(1) a");
            if (btn) {
                console.log("[刷课脚本] 在“学习中”中找到课程，点击进入");
                btn.click();
                return;
            } else {
                console.log("[刷课脚本] “学习中”无可学课程，尝试点击“未学习”");
            }
        }

        const notLearned = document.querySelector("span.total:nth-of-type(3)");
        if (notLearned) {
            console.log("[刷课脚本] 点击“未学习”");
            notLearned.click();
            await sleep(2000);

            const btn = document.querySelector("tr:nth-of-type(1) a");
            if (btn) {
                console.log("[刷课脚本] 在“未学习”中找到课程，点击进入");
                btn.click();
            } else {
                console.log("[刷课脚本] “未学习”中也无课程");
            }
        } else {
            console.log("[刷课脚本] 未找到“未学习”按钮");
        }
    }

    // ===== 标签页焦点刷新机制 =====
    function setupRefreshOnFocus() {
        window.addEventListener('focus', () => {
            const now = Date.now();
            const last = parseInt(sessionStorage.getItem('tm_last_reload') || '0', 10);
            if (now - last > 5000) {
                console.log("[刷课脚本] 标签页获得焦点，刷新页面");
                sessionStorage.setItem('tm_last_reload', now.toString());
                location.reload();
            }
        });
    }

    // ===== 页面2：视频播放页逻辑（支持跳转后自动播放）=====
    async function processVideoSegments() {
        console.log("[刷课脚本] 开始处理视频章节");
        await sleep(1000);

        const spans = Array.from(document.querySelectorAll('span.four'));
        console.log(`[刷课脚本] 找到 ${spans.length} 个进度节点`);

        let clicked = false;

        for (let i = 0; i < spans.length; i++) {
            const txt = spans[i].textContent.trim();
            console.log(`[刷课脚本] 第 ${i + 1} 个进度：${txt}`);
            if (txt !== '100%') {
                const btn = spans[i].closest('a') || spans[i];
                console.log(`[刷课脚本] 点击未完成章节 ${i + 1}`);
                btn.click();
                clicked = true;

                await sleep(2000);
                waitForPlayerReady(() => {
                    forceAutoplay();
                });

                break;
            }
        }

        if (!clicked) {
            console.log("[刷课脚本] 所有章节已完成，关闭页面");
            window.close();
            return;
        }

        // 每10秒检查是否播放完成
        const interval = setInterval(() => {
            const replay = document.querySelector('xg-replay-txt');
            if (isElementVisible(replay)) {
                console.log("[刷课脚本] 检测到可见重播按钮，课程已完成，关闭页面");
                clearInterval(interval);
                window.close();
            } else {
                console.log("[刷课脚本] 未检测到重播按钮或其不可见，继续检测...");
            }
        }, 10000);

        // 监听章节自动跳转后的视频加载并播放
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video && video.currentTime < 1 && video.paused) {
                console.log("[刷课脚本] 检测到章节跳转，尝试自动播放新视频");
                waitForPlayerReady(() => {
                    forceAutoplay();
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // ===== 主入口逻辑 =====
    const url = window.location.href;
    if (url.includes("/p/uc/myClassroom/")) {
        setupRefreshOnFocus();
        onReady(doMyClassroomAction);
    } else if (url.includes("/p/course/v/")) {
        onReady(() => {
            waitForPlayerReady(() => {
                forceAutoplay();
                processVideoSegments();
            });
        });
    }
})();