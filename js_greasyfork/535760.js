// ==UserScript==
// @name         Bilibili鼠标左键长按加速播放
// @namespace    https://bilibili.com/
// @version      1  
// @description  模仿 YouTube：鼠标左键长按加速播放，松开恢复正常，并防止暂停行为触发（避免点击暂停）
// @author       toc178
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535760/Bilibili%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/535760/Bilibili%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ACCELERATED_RATE = 2.0;
    let originalRate = 1.0;
    let pressTime = 0;
    let suppressNextClick = false;

    function getVideo() {
        return document.querySelector('video');
    }

    function onPointerDown(event) {
        if (event.button !== 0) return; // 只处理左键
        const video = getVideo();
        if (!video) return;
        originalRate = video.playbackRate;
        video.playbackRate = ACCELERATED_RATE;
        pressTime = Date.now();
    }

    function onPointerUp(event) {
        if (event.button !== 0) return;
        const video = getVideo();
        if (!video) return;
        video.playbackRate = originalRate;

        // 判断是否为长按，阻止下一次点击导致的暂停
        if (Date.now() - pressTime > 150) {
            suppressNextClick = true;
        }
    }

    function onClick(event) {
        if (suppressNextClick) {
            event.stopImmediatePropagation();
            event.preventDefault();
            suppressNextClick = false;
            console.log("🎯 已阻止点击以防暂停");
        }
    }

    function register() {
        const target = document.querySelector('.bpx-player-video-wrap') || document;
        target.addEventListener('pointerdown', onPointerDown, true);
        target.addEventListener('pointerup', onPointerUp, true);
        target.addEventListener('click', onClick, true);
    }

    function waitForVideo() {
        const timer = setInterval(() => {
            if (getVideo()) {
                clearInterval(timer);
                register();
                console.log('🚀 鼠标长按倍速脚本已启用（已防止点击暂停）');
            }
        }, 500);
    }

    waitForVideo();
})();

/*
MIT License

Copyright (c) 2024 toc178

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
