// ==UserScript==
// @name         YT永遠聚焦在播放器222
// @namespace    https://greasyfork.org/zh-TW/users/4839
// @version      2.1
// @description  YT上下鍵強制聚焦在播放器(文字輸入區除外)
// @author       Boss of this gym
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/539218/YT%E6%B0%B8%E9%81%A0%E8%81%9A%E7%84%A6%E5%9C%A8%E6%92%AD%E6%94%BE%E5%99%A8222.user.js
// @updateURL https://update.greasyfork.org/scripts/539218/YT%E6%B0%B8%E9%81%A0%E8%81%9A%E7%84%A6%E5%9C%A8%E6%92%AD%E6%94%BE%E5%99%A8222.meta.js
// ==/UserScript==

(function() {
    'use strict';



 function getVideoElement() {
        return document.querySelector('video');
    }


    function isInputElementFocused() {
        const active = document.activeElement;
        return active && (['INPUT', 'TEXTAREA'].includes(active.tagName) || active.isContentEditable);
    }



    window.addEventListener('keydown', function(event) {
        if (isInputElementFocused() || event.altKey) return;

        const video = getVideoElement();
        if (!video) return;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            //event.preventDefault();
           // event.stopImmediatePropagation();
document.querySelector('video');
            if (document.activeElement !== video) {
                video.setAttribute('tabindex', '-1');
                video.focus();
            }


        }
    }, true); // Use capture to intercept before YouTube
})();