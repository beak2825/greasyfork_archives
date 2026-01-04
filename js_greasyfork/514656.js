// ==UserScript==
// @name         深圳中小幼继续教育
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  深圳市中小学幼儿园教师继续教育平台视频自动播放脚本，支持倍速播放及自动切换下一个视频
// @match        https://study.szjspx.com.cn/activityTask/student/getActivityTaskInfo.do*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514656/%E6%B7%B1%E5%9C%B3%E4%B8%AD%E5%B0%8F%E5%B9%BC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/514656/%E6%B7%B1%E5%9C%B3%E4%B8%AD%E5%B0%8F%E5%B9%BC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentSpeed = 2; // 默认播放速度为2倍速
    let currentVideoIndex = -1;
    let videoRows = [];

    // 弹出免责声明对话框
    function showDisclaimer() {
        let userResponse = prompt("使用这个脚本出现的任何法律责任和后果由使用者本人完全承担，作者不对任何由于使用或误用该脚本而引起的直接或间接损害负责。本脚本仅供学习和研究使用，不得用于任何商业或非法用途。使用该脚本即表示您同意以上所有条款并承担相应的责任。若同意，请输入\"同意\"。", "");
        if (userResponse !== "同意") {
            alert("您未同意免责声明，脚本将关闭。");
            return false;
        }
        return true;
    }

    // 主要功能函数
    function autoPlayVideos() {
        let video = document.querySelector('video');
        if (!video) return;

        if (video.paused) {
            video.play().then(() => {
                console.log('视频开始播放');
            }).catch((error) => {
                console.error('无法自动播放视频:', error);
            });
        }

        video.playbackRate = currentSpeed;

        video.onended = function() {
            setTimeout(playNextVideo, 2000); // 给页面一些时间加载新视频
        };
    }

    function playNextVideo() {
        currentVideoIndex++;
        videoRows = document.querySelectorAll('tr.data:not(.cur), .course_title'); // 更新视频行
        if (currentVideoIndex < videoRows.length) {
            let nextRow = videoRows[currentVideoIndex];
            let nextTitleElement = nextRow.querySelector('p.title');
            if (nextTitleElement) {
                nextTitleElement.scrollIntoView(); // 确保元素在视图内
                simulateClick(nextTitleElement);
                console.log('切换到下一个视频：' + nextTitleElement.textContent);
                setTimeout(() => {
                    autoPlayVideos();
                }, 3000); // 给页面一些时间加载新视频
            }
        } else {
            console.log('所有视频已播放完毕');
        }
    }

    // 模拟点击函数，确保兼容性
    function simulateClick(element) {
        var event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    // 改变播放速度
    function changeSpeed(speed) {
        currentSpeed = speed;
        let video = document.querySelector('video');
        if (video) {
            video.playbackRate = speed;
        }
        console.log('播放速度已更改为 ' + speed + 'x');
    }

    // 静音/取消静音视频
    function toggleMute() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = !video.muted;
            console.log('静音状态已切换，当前状态：' + (video.muted ? '静音' : '非静音'));
        }
    }

    // 添加控制面板
    function addControlPanel() {
        var panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '9999';
        panel.style.background = 'white';
        panel.style.padding = '10px';
        panel.style.border = '1px solid black';

        var speedLabel = document.createElement('div');
        speedLabel.textContent = '选择播放速度：';
        panel.appendChild(speedLabel);

        var speeds = [1, 2, 4, 8, 16];
        speeds.forEach(function(speed) {
            var speedButton = document.createElement('button');
            speedButton.textContent = speed + 'x';
            speedButton.style.marginRight = '5px';
            speedButton.onclick = function() { changeSpeed(speed); };
            panel.appendChild(speedButton);
        });

        var muteButton = document.createElement('button');
        muteButton.textContent = '静音/取消静音';
        muteButton.style.marginTop = '10px';
        muteButton.onclick = toggleMute;
        panel.appendChild(muteButton);

        document.body.appendChild(panel);
    }

    // 等待页面加载完成后执行
    window.addEventListener('load', function() {
        if (showDisclaimer()) {
            videoRows = document.querySelectorAll('tr.data:not(.cur), .course_title');
            addControlPanel();
            setTimeout(playNextVideo, 2000); // 页面加载完成后自动开始播放
        }
    });

    // 监听视频元素的添加
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeName === 'VIDEO') {
                        autoPlayVideos();
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
