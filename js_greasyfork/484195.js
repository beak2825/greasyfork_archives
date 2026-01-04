// ==UserScript==
// @name        audiostock自动连播
// @namespace   Violentmonkey Scripts
// @match       https://audiostock.jp/audio/*
// @match       https://audiostock.jp/bgm*
// @match       https://audiostock.jp/vocal*
// @grant       none
// @version     1.2
// @author      苍旻白轮
// @license     WTFPL
// @description 启动后当一曲播完后自动切换到当前页面列表的下一首。
// @downloadURL https://update.greasyfork.org/scripts/484195/audiostock%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/484195/audiostock%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测页面中class为play的元素
    const playButton = document.querySelector('.play');

    if (playButton) {
        // 监听class为pause_image的子元素样式变化
        const playImage = playButton.querySelector('.pause_image');
        const observer = new MutationObserver(function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (playImage.style.display === 'none') {
                        // 当pause_image的子元素样式变化为display: none时，自动点击class为next的元素切换到下一首曲子
                        const nextButton = document.querySelector('.next');
                        if (nextButton) {
                            nextButton.click();
                        }
                    }
                }
            }
        });

        // 配置并启动MutationObserver
        const config = { attributes: true, attributeFilter: ['style'] };
        observer.observe(playImage, config);
    }
})();
