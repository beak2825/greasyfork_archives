// ==UserScript==
// @name         YouTube Auto HD
// @namespace    https://blog.hgtrojan.com
// @version      1.6.1
// @description  自动选择YouTube视频的最高画质
// @author       HgTrojan
// @match        *://www.youtube.com/*
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/501162/YouTube%20Auto%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/501162/YouTube%20Auto%20HD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let highestQuality = null;

    function setHighestQuality() {
        const video = document.querySelector('video');
        if (video) {
            const player = document.querySelector('.html5-video-player');
            if (player) {
                const availableQualityLevels = player.getAvailableQualityLevels();
                if (availableQualityLevels && availableQualityLevels.length > 0) {
                    highestQuality = availableQualityLevels[0];
                    console.log("Setting quality to: " + highestQuality);
                    player.setPlaybackQualityRange(highestQuality, highestQuality);
                    player.setPlaybackQuality(highestQuality);

                    // 在标签页标题中显示提示信息
                    displayMessage("设置画质为 " + highestQuality);
                } else {
                    console.warn("Hgtrojan: 未能找到可用的清晰度级别");
                }
            } else {
                console.warn("Hgtrojan: 未能找到视频播放器");
            }
        } else {
            console.warn("Hgtrojan: 未能找到视频元素");
        }
    }

    function checkAndMaintainHighestQuality() {
        const video = document.querySelector('video');
        if (video) {
            const player = document.querySelector('.html5-video-player');
            if (player && highestQuality) {
                const currentQuality = player.getPlaybackQuality();
                if (currentQuality !== highestQuality) {
                    console.log("Maintaining quality at: " + highestQuality);
                    player.setPlaybackQuality(highestQuality);
                }
            }
        }
    }

    function checkUrlAndSetQuality() {
        if (window.location.href.includes('watch')) {
            setHighestQuality();
            // 每隔5秒检查并保持最高画质
            setInterval(checkAndMaintainHighestQuality, 5000);
        }
    }

    function displayMessage(message) {
        document.title = message;
        // 10秒后恢复原来的标题
        setTimeout(() => {
            document.title = originalTitle;
        }, 10000);
    }

    const originalTitle = document.title;

    // 创建MutationObserver实例
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeName === 'VIDEO') {
                        setTimeout(checkUrlAndSetQuality, 1000);
                    }
                });
            }
        });
    });

    // 开始观察整个文档，包括所有子节点和后代节点
    observer.observe(document, { childList: true, subtree: true });

    // 初始加载时设置最高清晰度
    window.addEventListener('yt-player-updated', checkUrlAndSetQuality);
    window.addEventListener('yt-navigate-finish', checkUrlAndSetQuality);
})();