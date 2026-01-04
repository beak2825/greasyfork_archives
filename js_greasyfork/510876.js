// ==UserScript==
// @name         明日方舟网页剧情阅读辅助点击
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 https://prts.wiki/ 網站上，滾輪和按鍵操作輔助點擊，並添加 M 鍵靜音切換功能，方便劇情閲讀。
// @author       kitsumiya
// @match        https://prts.wiki/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510876/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E7%BD%91%E9%A1%B5%E5%89%A7%E6%83%85%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/510876/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E7%BD%91%E9%A1%B5%E5%89%A7%E6%83%85%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isMuted = false;

    if (window.location.hostname === 'prts.wiki') {

        document.addEventListener('wheel', function(event) {
            if (event.deltaY < 0) {
                event.preventDefault();
                clickButton('button_playback');
            } else {
                event.preventDefault();
                simulateClick();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space') {
                event.preventDefault();
                simulateClick();
            } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                event.preventDefault();
                clickButton('button_auto');
            } else if (event.code === 'Enter') {
                event.preventDefault();
                clickButton('button_fullscreen');
            } else if (event.code === 'KeyM') {
                event.preventDefault();
                toggleMute();
            }
        });

        function simulateClick() {
            const targetElement = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
            if (targetElement) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                targetElement.dispatchEvent(clickEvent);
            }
        }

        function clickButton(buttonId) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.click();
            } else {
                console.warn(`未找到ID為 ${buttonId} 的按鈕`);
            }
        }

        function toggleMute() {
            const mediaElements = document.querySelectorAll('audio, video');
            isMuted = !isMuted;
            mediaElements.forEach(function(mediaElement) {
                mediaElement.muted = isMuted;
            });
            console.log(isMuted ? "音頻已靜音" : "音頻已恢復");
        }
    }
})();
