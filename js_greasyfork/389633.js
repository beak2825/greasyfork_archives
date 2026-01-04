// ==UserScript==
// @name         YouTube 脚本手机版
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  下载视频，移除广告，自动跳过广告
// @author       sl00p
// @match        https://m.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/389633/YouTube%20%E8%84%9A%E6%9C%AC%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/389633/YouTube%20%E8%84%9A%E6%9C%AC%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        let ads = ["item GoogleActiveViewElement", "companion-ad-container"];
        let bCompacts = document.getElementsByClassName("slim_video_action_bar_renderer_button yt-spec-button-view-model");
        let isInject = false;
        // Remove ads
        for(let idx = 0; idx < ads.length; ++idx) {
            let nodes = document.getElementsByClassName(ads[idx]);
            if(nodes && nodes.length > 0) {
                nodes[0].remove();
            }
        }
        // Skip ads
        let videos = document.getElementsByTagName('video');
        let adsButtom = ['ytp-ad-skip-button-container', 'ytp-ad-preview-container', 'ytp-ad-text', 'ytp-ad-timed-pie-countdown-container'];
        for(let idx = 0; idx < adsButtom.length; ++idx) {
            let buttom = document.getElementsByClassName(adsButtom[idx]);
            if(videos && videos.length > 0 && buttom && buttom.length > 0) {
                if (videos[0].currentTime && videos[0].duration) {
                    videos[0].currentTime = videos[0].duration;
                }
            }
        }
        // Test if injected already
        for(let idx = 0; idx < bCompacts.length; ++idx) {
            console.log(bCompacts[idx].innerText.trim())
            if(bCompacts[idx].innerText.trim() === "下载") {
                isInject = true;
            }
        }
        // Directly return if match shorts
        if(window.location.href.indexOf('shorts') !== -1) {
            return 0;
        }
        if(!isInject && bCompacts.length >= 3) {
            let bReport = bCompacts[2];
            if(bReport && bReport !== undefined) {
                let bParent = bReport.parentElement;
                let bDown = bReport.cloneNode(true);
                bDown.getElementsByClassName("yt-spec-button-shape-next__button-text-content")[0].innerText = "下载";
                bDown.getElementsByTagName("svg")[0].outerHTML =
                    `<svg t="1613792186988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1434"
                    width="200" height="200"><path d="M514 114.4c-220 0-398.8 178.9-398.8 398.8S294 912 514 912s398.8-178.9 398.8-398.8S734
                    114.4 514 114.4z m0 754.9c-196.4 0-356.1-159.8-356.1-356.1S317.6 157.1 514 157.1c196.4 0 356.1 159.8 356.1 356.1S710.4
                    869.3 514 869.3z" p-id="1435"></path><path d="M540.8 614.7c-1.7 1.7-3.5 3.2-5.5 4.5V252.1h-42.7v367.2c-1.9-1.3-3.8-2.8-5.5-4.5L368.9
                    496.5l-30.2 30.2L457 644.9c15.7 15.7 36.4 23.6 57 23.6 20.7 0 41.3-7.9 57-23.6l118.3-118.3-30.2-30.2-118.3 118.3zM358.6 697.4h310.7v42.7H358.6z"
                    p-id="1436"></path></svg>`;
                bDown.onclick = function() {
                    window.open("https://yt5s.com/en50?q=" + window.location.href);
                };
                bParent.appendChild(bDown);
            }
        }
    }, 500);
})();