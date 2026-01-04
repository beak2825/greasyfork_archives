// ==UserScript==
// @license      MIT
// @name         wbhal影视
// @namespace    wbhal影视
// @version      2.0
// @description  wbhal影视，无广告。1080P以上
// @author       all_wbhal
// @match        https://www.iqiyi.com/*
// @match        https://www.youku.com/*
// @match        https://v.youku.com/*
// @match        https://v.qq.com/*
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530638/wbhal%E5%BD%B1%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/530638/wbhal%E5%BD%B1%E8%A7%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function encodeData(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }
    function decodeData(str) {
        return decodeURIComponent(escape(atob(str)));
    }

    const encryptedUrl = 'aHR0cHM6Ly90di5oaGFoaGguZnVuL3Nzc3Avc3NzcF9zc3lzLnBocD9zcz0';

    const mainButton = document.createElement('button');
    mainButton.textContent = '免费看VIP';
    mainButton.style.position = 'fixed';
    mainButton.style.left = '10px';
    mainButton.style.top = '50%';
    mainButton.style.zIndex = '9999';
    mainButton.style.padding = '10px';
    mainButton.style.backgroundColor = '#4CAF50';
    mainButton.style.color = 'white';
    mainButton.style.border = 'none';
    mainButton.style.borderRadius = '5px';
    mainButton.style.cursor = 'pointer';

    const closeButton = document.createElement('button');
    closeButton.textContent = '本次关闭';
    closeButton.style.position = 'fixed';
    closeButton.style.left = '10px';
    closeButton.style.top = 'calc(50% - 50px)';
    closeButton.style.zIndex = '9999';
    closeButton.style.padding = '10px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'none';

    mainButton.onmouseover = function() {
        mainButton.style.backgroundColor = '#45a049';
        closeButton.style.display = 'block';
    };
    mainButton.onmouseout = function() {
        mainButton.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            if (!closeButton.matches(':hover')) {
                closeButton.style.display = 'none';
            }
        }, 200);
    };

    closeButton.onmouseover = function() {
        closeButton.style.backgroundColor = '#da190b';
    };
    closeButton.onmouseout = function() {
        closeButton.style.backgroundColor = '#f44336';
        setTimeout(() => {
            if (!mainButton.matches(':hover')) {
                closeButton.style.display = 'none';
            }
        }, 200);
    };

    mainButton.onclick = function() {
        const videos = document.getElementsByTagName('video');
        for (let video of videos) {
            if (!video.paused) {
                video.pause();
            }
        }

        let title = document.title.trim();
        const spaceIndex = title.indexOf(' ');
        const dashIndex = title.indexOf('-');
        const underscoreIndex = title.indexOf('_');
        let minIndex = -1;
        if (spaceIndex !== -1) minIndex = spaceIndex;
        if (dashIndex !== -1 && (minIndex === -1 || dashIndex < minIndex)) minIndex = dashIndex;
        if (underscoreIndex !== -1 && (minIndex === -1 || underscoreIndex < minIndex)) minIndex = underscoreIndex;
        if (minIndex !== -1) {
            title = title.substring(0, minIndex).trim();
        }
        const url = decodeData(encryptedUrl) + encodeURIComponent(title);
        window.open(url, '_blank');
    };

    closeButton.onclick = function() {
        mainButton.style.display = 'none';
        closeButton.style.display = 'none';
    };

    document.body.appendChild(mainButton);
    document.body.appendChild(closeButton);
})();