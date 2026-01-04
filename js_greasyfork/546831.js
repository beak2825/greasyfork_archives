// ==UserScript==
// @name         115浏览器连续播放跳过倒计时-最终版
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  立即跳过115浏览器连续播放时的倒计时，直接播放下一集
// @author       YourName
// @match        *://v.anxia.com/*
// @match        *://*.115.com/*
// @match        *://115vod.com/*
// @match        *://*.115vod.com/*
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/546831/115%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E8%B7%B3%E8%BF%87%E5%80%92%E8%AE%A1%E6%97%B6-%E6%9C%80%E7%BB%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546831/115%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E8%B7%B3%E8%BF%87%E5%80%92%E8%AE%A1%E6%97%B6-%E6%9C%80%E7%BB%88%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enabled = true;

    // 判断当前页面是否为播放器页面
    function isPlayerPage() {
        return window.location.hostname.includes('115vod.com') ||
               window.location.search.includes('pickcode=');
    }

    // 添加自定义样式隐藏倒计时
    GM_addStyle(`
        div.video-prompt[rel="next_tips"] {
            display: none !important;
        }
    `);

    // 立即跳转到下一集
    function skipToNextImmediately() {
        if (!enabled) return;

        console.log("尝试立即跳转到下一集");

        // 方法1: 直接查找并点击下一个文件链接
        const nextLinks = document.querySelectorAll('a[target="_self"]');
        for (let link of nextLinks) {
            if (link.textContent.includes('下一个文件') || link.href.includes('pickcode')) {
                console.log("找到下一个文件链接，立即点击");
                link.click();
                return true;
            }
        }

        // 方法2: 尝试查找并点击下一集按钮
        const nextButtons = document.querySelectorAll('button, div[onclick]');
        for (let btn of nextButtons) {
            if (btn.textContent.includes('下一集') || btn.textContent.includes('下一个') ||
                (btn.onclick && btn.onclick.toString().includes('next'))) {
                console.log("找到下一集按钮，立即点击");
                btn.click();
                return true;
            }
        }

        // 方法3: 尝试调用播放器的next方法
        try {
            const videos = document.querySelectorAll('video');
            for (let video of videos) {
                if (typeof video.next === 'function') {
                    console.log("调用播放器的next方法");
                    video.next();
                    return true;
                }
            }
        } catch (e) {
            console.error("调用播放器方法失败:", e);
        }

        console.log("未找到跳转方法，等待倒计时元素出现");
        return false;
    }

    // 监听视频结束事件
    function setupVideoEndListener() {
        const videos = document.querySelectorAll('video');

        if (videos.length === 0) {
            console.log("未找到video元素，稍后重试");
            setTimeout(setupVideoEndListener, 3000);
            return;
        }

        videos.forEach(video => {
            // 移除可能已存在的事件监听器
            video.removeEventListener('ended', handleVideoEnded);
            // 添加新的事件监听器
            video.addEventListener('ended', handleVideoEnded);
        });

        console.log("已设置视频结束监听器");
    }

    // 处理视频结束事件
    function handleVideoEnded() {
        console.log("检测到视频播放结束");
        if (enabled) {
            // 立即尝试跳转
            if (!skipToNextImmediately()) {
                // 如果直接跳转失败，设置备用方案
                console.log("直接跳转失败，启用备用方案");
                startBackupSkipTimer();
            }
        }
    }

    // 备用方案：定期检查并跳过
    let backupTimer = null;
    function startBackupSkipTimer() {
        if (backupTimer) clearInterval(backupTimer);

        backupTimer = setInterval(() => {
            const countdownElements = document.querySelectorAll('div.video-prompt[rel="next_tips"]');

            if (countdownElements.length > 0) {
                console.log("备份方案: 检测到倒计时元素");

                countdownElements.forEach(el => {
                    // 隐藏倒计时UI
                    el.style.display = 'none';

                    // 查找并点击下一个文件链接
                    const nextLink = el.querySelector('a[target="_self"]');
                    if (nextLink) {
                        console.log("备份方案: 找到下一个文件链接");
                        nextLink.click();
                        clearInterval(backupTimer);
                    }
                });
            }
        }, 500);
    }

    // 添加控制按钮到页面
    function addControlButton() {
        // 只在播放器页面显示按钮
        if (!isPlayerPage()) {
            console.log("非播放器页面，不添加控制按钮");
            return;
        }

        // 如果已经添加过按钮，则不再添加
        if (document.getElementById('skipCountdownButton')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'skipCountdownButton';
        button.innerHTML = '跳过倒计时: ON';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        button.addEventListener('click', function() {
            enabled = !enabled;
            button.innerHTML = '跳过倒计时: ' + (enabled ? 'ON' : 'OFF');
            button.style.background = enabled ? '#4CAF50' : '#f44336';

            // 发送通知
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    text: `跳过倒计时功能已${enabled ? '启用' : '禁用'}`,
                    title: "115跳过倒计时",
                    timeout: 2000
                });
            }
        });

        document.body.appendChild(button);
        console.log("控制按钮已添加到页面");
    }

    // 初始化函数
    function init() {
        console.log("115跳过倒计时脚本(最终版)已加载");

        // 添加控制按钮
        addControlButton();

        // 设置视频结束监听器
        setupVideoEndListener();

        // 对于已经加载完成的视频，也设置监听器
        if (document.readyState === 'complete') {
            setTimeout(setupVideoEndListener, 1000);
        }

        // 监听动态加载的内容
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // 检查是否有新的video元素添加
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.tagName === 'VIDEO') {
                            console.log("检测到新video元素");
                            setupVideoEndListener();
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();