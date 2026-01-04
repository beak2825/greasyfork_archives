// ==UserScript==
// @name         虎牙直播最高画质
// @icon         https://www.huya.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  虎牙直播自动选择最高画质(跳过HDR选项)、自动剧场模式。
// @author       hsux
// @match        *://*.huya.com/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/504954/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/504954/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function () {
    // Function to choose the best video quality
    function chooseBestQuality() {
        const qualityList = document.querySelectorAll('.player-videotype-list li');
        if (qualityList.length > 0) {
            const firstOptionText = qualityList[0].innerText;
            if (firstOptionText.includes('HDR')) {
                // If the first option is HDR, select the second one
                qualityList[1].click();
            } else {
                // Otherwise, select the first one
                qualityList[0].click();
            }
        }
    }

    // Function to enable theater mode
    function enableTheaterMode() {
        const theaterButton = document.getElementById('player-fullpage-btn');
        if (theaterButton) {
            theaterButton.click();
        }
    }

    // Function to play the video
    function playVideo() {
        const playButton = document.querySelector('.player-play-btn');
        if (playButton) {
            playButton.click();
        }
    }

    // Execute the functions with a delay to ensure elements are loaded
    setTimeout(() => {
        chooseBestQuality();
        enableTheaterMode();
        playVideo();
    }, 2000); // Adjust this delay time as needed
})();
