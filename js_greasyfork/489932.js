// ==UserScript==
// @name         YouTube 自動最高畫質
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動將YouTube影片設置為最高畫質播放。
// @author       LI-KAI, HSIEH
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/489932/YouTube%20%E8%87%AA%E5%8B%95%E6%9C%80%E9%AB%98%E7%95%AB%E8%B3%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/489932/YouTube%20%E8%87%AA%E5%8B%95%E6%9C%80%E9%AB%98%E7%95%AB%E8%B3%AA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const qualityLevels = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small']; // 從高到低排列

    function setHighestQuality() {
        const player = document.getElementById('movie_player');
        if (player && typeof player.getAvailableQualityLevels === 'function') {
            // 延遲確保畫質選項已加載
            setTimeout(() => {
                const availableQualities = player.getAvailableQualityLevels();
                if (availableQualities && availableQualities.length > 0) {
                    // 找到可用畫質中最高的一個
                    for (let desiredQuality of qualityLevels) {
                        if (availableQualities.includes(desiredQuality)) {
                            player.setPlaybackQualityRange(desiredQuality, desiredQuality);
                            console.log(`已將畫質設置為 ${desiredQuality}`);
                            break;
                        }
                    }
                }
            }, 2000); // 延遲2秒，給YouTube更多時間來加載所有可用畫質
        }
    }

    // 當文檔載入完成時嘗試設置最高畫質
    window.addEventListener('load', setHighestQuality);
})();