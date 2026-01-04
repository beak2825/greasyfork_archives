// ==UserScript==
// @name         新华三大讲堂 | 完成视频 + 屏蔽检测 + 动态时长 + 自动刷新
// @namespace    zhuimang
// @version      1.5
// @description  屏蔽切标签/鼠标检测防暂停，提供手动完成按钮、秒过视频按钮
// @author       锥芒 & AI助手
// @match        *://learning.h3c.com/volbeacon/study/activity/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545758/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E5%AE%8C%E6%88%90%E8%A7%86%E9%A2%91%20%2B%20%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B%20%2B%20%E5%8A%A8%E6%80%81%E6%97%B6%E9%95%BF%20%2B%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/545758/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E5%AE%8C%E6%88%90%E8%A7%86%E9%A2%91%20%2B%20%E5%B1%8F%E8%94%BD%E6%A3%80%E6%B5%8B%20%2B%20%E5%8A%A8%E6%80%81%E6%97%B6%E9%95%BF%20%2B%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 屏蔽窗口焦点检测
    const originalHasFocus = document.hasFocus;
    document.hasFocus = function() {
        return true;
    };

    // 屏蔽鼠标点击检测
    let originalStopPlayer;
    const originalVPlayerPause = vPlayer?.pause;
    if (typeof stopPlayer === 'function') {
        originalStopPlayer = stopPlayer;
        window.stopPlayer = function() {
            console.log('【已屏蔽】stopPlayer() 调用（防止暂停）');
        };
    }
    if (originalVPlayerPause) {
        vPlayer.pause = function() {
            console.log('【已屏蔽】vPlayer.pause() 调用（防止暂停）');
        };
    }

    // 完成视频的逻辑函数
    function completeVideo() {
        const durationInput = document.getElementById('duration');
        const videoLengthInput = document.getElementById('videoLength');
        const videoPositionInput = document.getElementById('videoPosition');

        if (durationInput && videoLengthInput && videoPositionInput) {
            const actualDuration = durationInput.value;
            videoLengthInput.value = actualDuration;
            videoPositionInput.value = actualDuration;
            console.log('【已修改】videoLength 和 videoPosition =', actualDuration, '秒');

            if (typeof vPlayer !== 'undefined' && vPlayer) {
                try {
                    const sec = parseInt(actualDuration, 10);
                    vPlayer.currentTime(sec);
                    vPlayer.play();
                    console.log('【已跳转】视频到末尾：', sec, '秒');
                } catch (e) {
                    console.log('【跳转失败】', e);
                }
            }
        } else {
            console.log('【兜底】使用默认值 9999');
            if (videoLengthInput) videoLengthInput.value = '9999';
            if (videoPositionInput) videoPositionInput.value = '9999';
            if (typeof vPlayer !== 'undefined' && vPlayer) {
                try {
                    vPlayer.currentTime(9999);
                    vPlayer.play();
                } catch (e) {
                    console.log('【跳转失败】', e);
                }
            }
        }

        const submitVideo = window.submitVideo;
        if (typeof submitVideo === 'function') {
            console.log('【自动提交】视频记录');
            submitVideo('3');
        }
    }

    // 创建“完成视频”按钮
    function createVideoSkipButton() {
        if (document.getElementById('video-skip-button')) return;

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'video-skip-button';
        buttonDiv.style.cssText = `
            position: fixed; top: 15px; right: 50px; z-index: 999999;
            background: #4CAF50; color: white; padding: 10px 15px;
            border-radius: 5px; cursor: pointer; font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;

        const skipButton = document.createElement('button');
        skipButton.innerText = '✅ 完成视频';
        skipButton.style.cssText = `
            border: none; background: transparent; color: white;
            font-size: 14px; cursor: pointer; font-weight: bold;
        `;
        buttonDiv.appendChild(skipButton);
        document.body.appendChild(buttonDiv);

        skipButton.addEventListener('click', function() {
            console.log('【手动完成】点击了完成按钮');
            completeVideo();
            // 1秒后自动刷新页面
            setTimeout(() => {
                console.log('【自动刷新】页面即将刷新...');
                window.location.reload();
            }, 1000);
        });
    }

    // 创建“秒过视频”按钮
    function createBackButton() {
        if (document.getElementById('back-button')) return;

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'back-button';
        buttonDiv.style.cssText = `
            position: fixed; top: 15px; right: 180px; z-index: 999999;
            background: #2196F3; color: white; padding: 10px 15px;
            border-radius: 5px; cursor: pointer; font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;

        const backButton = document.createElement('button');
        backButton.innerText = '🚀 秒过视频';
        backButton.style.cssText = `
            border: none; background: transparent; color: white;
            font-size: 14px; cursor: pointer; font-weight: bold;
        `;
        buttonDiv.appendChild(backButton);
        document.body.appendChild(buttonDiv);

        backButton.addEventListener('click', function() {
            console.log('【秒过视频】点击了回退按钮');
            completeVideo();
            // 回退上一页并刷新
            window.history.back();
            // 由于回退后页面会重新加载，这里可根据实际情况调整刷新逻辑
            // 如果需要立即刷新当前页面（在回退前），可取消上面注释并调整逻辑
        });
    }

    // 脚本初始化
    function initScript() {
        console.log('【脚本启动】新华三大讲堂秒过工具已加载（保留退出确认弹窗）');
        createVideoSkipButton();
        createBackButton();
    }

    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();