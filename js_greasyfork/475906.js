// ==UserScript==
// @name         OleVod Multimedia
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  A script to allow olevod site adapt multimedia key to next or previous episode
// @author       You
// @match        *://*.olevod.me/*
// @match        *://*.olevod.com/*
// @match        *://*.olehdtv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=olevod.me
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475906/OleVod%20Multimedia.user.js
// @updateURL https://update.greasyfork.org/scripts/475906/OleVod%20Multimedia.meta.js
// ==/UserScript==
/* global $ */

(function() {
    console.log = function() {};
    console.clear = function() {};
    console.info("tzwei connected");

    'use strict';

    const toggleFullscreen = (videoElement) => {
        const methods = [
            'requestFullscreen',
            'mozRequestFullScreen',
            'webkitRequestFullscreen',
            'msRequestFullscreen'
        ];
        for (const method of methods) {
            if (videoElement[method]) {
                videoElement[method]();
                break;
            }
        }
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
            parent.focus();
        }
    };

    const seekForward = (sec) => {
        const iframeElement = document.querySelector('iframe[name="pif"]');
        const videoElement = getVideoElement();
        if (videoElement) {
            videoElement.currentTime += sec;
        }
    };

    const getVideoElement = () => {
        const iframeElement = document.querySelector('iframe[name="pif"]');
        let videoElement = iframeElement?.contentDocument?.querySelector("video");
        if (!videoElement) {
            videoElement = document.querySelector("video");
        }
        return videoElement;
    };

    const handleSkipIntro = () => {
        const skipIntroLink = $("<a href='javascript:void(0)'>跳过片头&nbsp;<i class='iconfont skip-intro'></i></a>");
        $("div.play_but.bline > ul > li").append(skipIntroLink);
        skipIntroLink.on("click", () => seekForward(70));
    };

    const handleKeyEvents = () => {
        document.addEventListener("keydown", (event) => {
            const videoElement = getVideoElement();

            if (videoElement) {
                if (event.key === 'f' || event.keyCode === 70) {
                    toggleFullscreen(videoElement);
                }
            }

            if (event.keyCode === 176 || event.keyCode === 187) {
                exitFullscreen();
                parent.$(".next-t").click();
            }

            if (event.keyCode === 177 || event.keyCode === 189) {
                exitFullscreen();
                parent.$(".pre-t").click();
            }

            if (event.keyCode === 221) {
                exitFullscreen();
                parent.$(".skip-intro").click();
            }
        });
    };

    // Call your functions to initialize the script
    handleSkipIntro();
    handleKeyEvents();
})();
