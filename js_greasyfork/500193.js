// ==UserScript==
// @name         Video Ad Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically skip or remove video ads
// @author       Your Name
// @match        https://www.example.com/*
// @grant        none
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/500193/Video%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/500193/Video%20Ad%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待视频元素和广告元素加载完成
    function waitForVideoAndAds() {
        const video = document.querySelector('video');
        const adElements = document.querySelectorAll('.ad, .advertisement, .video-ad'); // 根据实际情况调整选择器

        if (video) {
            removeAds(adElements);
            observeForAds(video);
        } else {
            setTimeout(waitForVideoAndAds, 500);
        }
    }

    // 移除广告元素
    function removeAds(adElements) {
        adElements.forEach(ad => {
            ad.style.display = 'none';
        });
    }

    // 观察广告出现并跳过
    function observeForAds(video) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const adElements = document.querySelectorAll('.ad, .advertisement, .video-ad'); // 根据实际情况调整选择器
                removeAds(adElements);
                if (video.currentTime < 5) { // 假设广告在前5秒内
                    video.currentTime = 5; 
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化脚本
    waitForVideoAndAds();
})();