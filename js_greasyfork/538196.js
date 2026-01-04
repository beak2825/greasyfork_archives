// ==UserScript==
// @name         VideoControl
// @namespace    https://greasyfork.org/zh-CN/users/1478188-kagenokeiyou
// @license      MIT
// @version      1.0.2
// @description  Control video playback with keyboard shortcuts
// @author       kagenokeiyou
// @match        https://www.youtube.com/*
// @match        https://player.cycanime.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538196/VideoControl.user.js
// @updateURL https://update.greasyfork.org/scripts/538196/VideoControl.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let video = document.querySelector('video');
    if (!video) {
        console.error('No video element found on the page.');
        return;
    }
    let tip = document.createElement('div');
    Object.assign(tip.style, {
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'rgb(222, 222, 222)',
        padding: '8px 16px',
        borderRadius: '10px',
        fontSize: '18px',
        zIndex: '9999',
        visibility: 'hidden',
    });
    if (video.parentElement) {
        if (getComputedStyle(video.parentElement).position === 'static') {
            video.parentElement.style.position = 'relative';
        }
        video.parentElement.style.width = '100%';
        video.parentElement.style.height = '100%';
        video.parentElement.appendChild(tip);
    }
    let tipTimeout = 0;
    function showTip(text, repeat = false) {
        tip.textContent = text;
        tip.style.visibility = 'visible';
        if (!repeat) {
            clearTimeout(tipTimeout);
            tipTimeout = setTimeout(() => {
                tip.style.visibility = 'hidden';
            }, 500);
        }
    }
    let isSpeedup = false;
    let speedupTimeout = 0;
    window.addEventListener('keydown', event => {
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            if (event.repeat)
                return;
            speedupTimeout = setTimeout(() => {
                video.playbackRate = 2.0;
                isSpeedup = true;
                showTip('2倍速播放', true);
            }, 500);
        }
        else if (event.code === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);
    window.addEventListener('keyup', event => {
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            if (isSpeedup) {
                video.playbackRate = 1.0;
                isSpeedup = false;
                tip.style.visibility = 'hidden';
            }
            else {
                clearTimeout(speedupTimeout);
                video.currentTime += 5;
                showTip('快进5秒');
            }
        }
        else if (event.code === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation();
            video.currentTime += 5;
            showTip('后退5秒');
        }
    }, true);
})();
