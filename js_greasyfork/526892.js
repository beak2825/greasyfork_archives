// ==UserScript==
// @name         Video Controls for Instagram
// @namespace    https://github.com/appel/userscripts
// @version      1.1
// @description  Instagram video controls with keyboard shortcuts and persistent unmute, originally by FXZFun (fxzfun.com).
// @author       Ap
// @match        https://www.instagram.com/
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526892/Video%20Controls%20for%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/526892/Video%20Controls%20for%20Instagram.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!document.head.innerHTML.includes("::-webkit-media-controls")) {
        GM_addStyle(`
            ::-webkit-media-controls {
                z-index: 999999;
                position: relative;
            }
            video::-webkit-media-controls {
                opacity: 1;
            }
            video:hover::-webkit-media-controls {
                opacity: 1;
            }
        `);
    }

    function attachPersistentUnmute(video) {
        if (video.dataset.stickyUnmuteListenerAdded === "true") return;
        video.addEventListener('volumechange', () => {
            if (!video.muted) {
                video.dataset.stickyUnmute = "true";
            }
            if (video.muted && video.dataset.stickyUnmute === "true") {
                setTimeout(() => { video.muted = false; }, 0);
            }
        });
        video.dataset.stickyUnmuteListenerAdded = "true";
    }

    function updateVideo(video) {
        video.controls = "controls";
        attachPersistentUnmute(video);
        if (video.closest('article') !== null) {
            video.setAttribute("loop", "true");
        } else {
            video.removeAttribute("loop");
        }
    }

    document.querySelectorAll("video").forEach(updateVideo);

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === "VIDEO") {
                            updateVideo(node);
                        } else {
                            node.querySelectorAll("video").forEach(updateVideo);
                        }
                    }
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function getClosestVideo() {
        let closestVideo = null;
        let closestDistance = Infinity;
        document.querySelectorAll("video").forEach(video => {
            const rect = video.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.hypot(window.innerWidth / 2 - centerX, window.innerHeight / 2 - centerY);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestVideo = video;
            }
        });
        return closestVideo;
    }

    document.addEventListener("keydown", function (event) {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) {
            return;
        }
        const video = getClosestVideo();
        if (!video) return;
        switch (event.key) {
            case "f":
                document.fullscreenElement ? document.exitFullscreen() : video.requestFullscreen();
                break;
            case "m":
                if (video.muted) {
                    video.muted = false;
                    video.dataset.stickyUnmute = "true";
                } else {
                    video.muted = true;
                    video.dataset.stickyUnmute = "";
                }
                break;
            case "k":
                video.paused ? video.play() : video.pause();
                setTimeout(() => {
                    video.muted = false;
                    video.dataset.stickyUnmute = "true";
                }, 100);
                break;
            case "j":
                video.currentTime = Math.max(0, video.currentTime - 10);
                break;
            case "l":
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
                break;
            case ",":
                video.pause();
                video.currentTime = Math.max(0, video.currentTime - (1 / 30));
                break;
            case ".":
                video.pause();
                video.currentTime = Math.min(video.duration, video.currentTime + (1 / 30));
                break;
        }
    });
})();
