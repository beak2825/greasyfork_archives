// ==UserScript==
// @name         软通视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  免责声明：此程序只供学习和研究使用，不得用于商业或者非法用途，否则后果自负。本程序的开发者不承担任何法律责任。使用本程序造成的一切后果由使用者自行承担，与本程序的开发者无关。使用本程序即表示您已经接受了本声明。
// @author       zxpzdtom
// @match        https://*.issedu365.com/application/appcoursedetail/*
// @icon         https://eco.issedu365.com/ouselres/dashboard/static/frontend/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463794/%E8%BD%AF%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/463794/%E8%BD%AF%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const video = mutation.target.querySelector('video');
            if (video) {
                video.addEventListener('pause', () => {
                    console.log('video paused, restarting...');
                    video.play();
                    video.muted = true
                });

                document.addEventListener('fullscreenchange', () => {
                    console.log('document.fullscreenElement', document.fullscreenElement);
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                });
                observer.disconnect();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    setInterval(() => {
        const btn = document.querySelector('body > div.el-dialog__wrapper > div > div.el-dialog__footer > span > button');
        const viddeo = document.querySelector("video");
        if (btn) {
            btn.click();
        }
        const nextBtn = document.querySelector('body > div.el-message-box__wrapper > div > div.el-message-box__btns > button');
        if (nextBtn) nextBtn.click();
    }, 5000)
})();
