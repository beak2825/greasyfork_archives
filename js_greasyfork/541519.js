// ==UserScript==
// @name         IYF.tv 网页全屏播放器（无 GM_addStyle）
// @license MIT
// @namespace    https://github.com/justfunc/
// @version      1.2
// @description  实现对 #video_player 的网页全屏支持，兼容 Safari/Edge 等环境
// @match        *://*.wyav.tv/*
// @match        *://*.iyf.tv/*
// @match        *://*.yfsp.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541519/IYFtv%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%88%E6%97%A0%20GM_addStyle%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541519/IYFtv%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E5%99%A8%EF%BC%88%E6%97%A0%20GM_addStyle%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    addStyle(`
        .tm-web-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background-color: black !important;
        }
        .tm-web-fullscreen video {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
        }
        .tm-fs-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10000;
            padding: 6px 12px;
            background: rgba(0,0,0,0.7);
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
    `);

    function addFullscreenButton(video) {
        const wrapper = video.closest('div') || video.parentElement;
        wrapper.style.position = 'relative';

        if (wrapper.querySelector('.tm-fs-btn')) return;

        const button = document.createElement('button');
        button.className = 'tm-fs-btn';
        button.textContent = '网页全屏';

        let isFull = false;

        button.onclick = () => {
            isFull = !isFull;
            if (isFull) {
                wrapper.classList.add('tm-web-fullscreen');
                button.textContent = '退出全屏';
            } else {
                wrapper.classList.remove('tm-web-fullscreen');
                button.textContent = '网页全屏';
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isFull) {
                button.click();
            }
        });

        wrapper.appendChild(button);
    }

    function waitForVideo() {
        const video = document.getElementById('video_player');
        if (video) {
            addFullscreenButton(video);
        } else {
            setTimeout(waitForVideo, 500);
        }
    }

    waitForVideo();
})();