// ==UserScript==
// @name         视频倍速修改
// @version      1.11
// @description  自定义页面所有视频播放速度，默认1.5倍，按域名存储（即：不同的网站可以分别设置）
//
// @match        *://*/*
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
//
// @exclude              https://live.bilibili.com/*
// @exclude-match1   https://www.twitch.tv/*
// @match1              https://www.twitch.tv/videos/*
//
// @exclude      https://trovo.live/*
// @exclude      https://chzzk.naver.com/live/*
// @exclude      https://www.facebook.com/live/*

// @match               https://www.huya.com/video/*
// @exclude-match    https://www.huya.com/*
// @exclude             https://www.douyu.com/*
// @exclude             https://live.douyin.com/*
// @exclude             https://live.kuaishou.com/*
// @exclude             https://www.yy.com/*


// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1171320
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522002/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/522002/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSpeed = 1.5;
    let currentSpeed = defaultSpeed;

    function getSpeedForDomain(domain) {
        let savedSpeed = GM_getValue(`videoSpeed_${domain}`);
        return savedSpeed ? parseFloat(savedSpeed) : defaultSpeed;
    }

    function saveSpeedForDomain(domain, newSpeed) {
        GM_setValue(`videoSpeed_${domain}`, newSpeed);
    }

    function updateSpeed(newSpeed) {
        let videos = document.querySelectorAll('video');
        videos.forEach(video => {
            try {
                video.playbackRate = parseFloat(newSpeed);
            } catch (error) {
                console.error("Error setting playbackRate:", error, video);
            }
        });
        currentSpeed = newSpeed;
    }


    function applySpeedToAllVideos() {
        const domain = window.location.hostname; // Get the current domain
        currentSpeed = getSpeedForDomain(domain);
        updateSpeed(currentSpeed);

        let iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeVideos = iframeDoc.querySelectorAll('video');
                iframeVideos.forEach(video => {
                    try {
                        video.playbackRate = currentSpeed;
                    } catch (error) {
                        console.error("Error setting playbackRate in iframe:", error, video);
                    }
                });
            } catch (error) {
                console.error("Error accessing iframe content:", error, iframe);
            }
        });
    }


    const observer = new MutationObserver(applySpeedToAllVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    applySpeedToAllVideos();


    let control = document.createElement('div');
    control.textContent = 'speed';
    control.style.cssText = `
        position: fixed;
        right: 5px;
        top: 30px;
        padding: 4px 8px;
        background: #f5f5f5;
        color: #000;
        border: 1px solid #ccc;
        border-radius: 6px;
        cursor: pointer;
        z-index: 9999;
        font-size: 14px;
        transform: scale(0.75);
    `;

    document.body.appendChild(control);

    control.addEventListener('click', () => {
        const domain = window.location.hostname;
        let newSpeed = prompt('输入播放倍速:', currentSpeed);
        if (newSpeed) {
            saveSpeedForDomain(domain, newSpeed);
            updateSpeed(newSpeed);
        }
    });
})();