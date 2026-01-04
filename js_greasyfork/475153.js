// ==UserScript==
// @name         FPS Booster [Sploop.io, Moomoo.io and other]
// @description  Improve Sites Performances by Blocking ads, disabling animations, limiting media size and boosting FPS
// @author       _VcrazY_
// @match        https://*.discord.com/app
// @match        https://*.discord.com/channels/*
// @match        https://*.discord.com/login
// @match        https://*.discord.com/*
// @match        https://facebook.com/*
// @match        https://*.facebook.com/*
// @match        *://starve.io/*
// @match        *://classroom.google.com/*
// @match        *://classroom.google.com/*
// @match        *://*.io/*
// @match        *://sploop.io/*
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @match       *://dev.moomoo.io/*
// @match       *://*.moomoo.io/*
// @match       *://starve.io/*
// @match       *://surviv.io/*
// @match       *://agar.io/*
// @match       *://slither.io/*
// @match       *://diep.io/*
// @match       *://deeeep.io/*
// @match       *://evowars.io/*
// @match       *://zombs.io/*
// @match       *://paper-io.com/*
// @match       *://skribbl.io/*
// @match        *://*.github.io/*
// @match        *://*.glitch.me/*
// @match        *://www.google.com/recaptcha/api2/*
// @match        *://www.google.com/*
// @match        *://diep.io/*
// @match        *://www.baidu.com/*
// @match        *://baidu.com/*
// @match        *://m.baidu.com/*
// @match        *://*.baidu.com/*
// @match        *://*.com/*
// @icon         https://tinyurl.com/ycxz2v37
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @version      2.1
// @namespace    https://greasyfork.org/en/users/1064285-vcrazy-gaming
// @downloadURL https://update.greasyfork.org/scripts/475153/FPS%20Booster%20%5BSploopio%2C%20Moomooio%20and%20other%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/475153/FPS%20Booster%20%5BSploopio%2C%20Moomooio%20and%20other%5D.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Apply global style to disable animations and transitions
    const style = document.createElement("style");
    style.textContent = `
        * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    // Force lower devicePixelRatio & clear console periodically
    const TARGET_PIXEL_RATIO = 0.9;
    const CLEAR_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

    setInterval(() => {
        if (unsafeWindow.devicePixelRatio !== TARGET_PIXEL_RATIO) {
            unsafeWindow.devicePixelRatio = TARGET_PIXEL_RATIO;
        }
        console.clear();
    }, CLEAR_INTERVAL_MS);

    // Helper to run code on DOM ready
    function onDOMReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    // Apply media optimization and ad-blocking
    onDOMReady(() => {
        // Lazy-load media
        document.querySelectorAll("img, video").forEach(media => {
            media.loading = "lazy";
        });

        // Limit video size
        document.querySelectorAll("video").forEach(video => {
            video.addEventListener("loadedmetadata", () => {
                if (video.videoHeight > 90) {
                    video.height = 90;
                }
            });
        });

        // Limit image dimensions
        document.querySelectorAll("img").forEach(img => {
            img.onload = () => {
                if (img.naturalHeight > 720) {
                    img.height = 720;
                }
                if (img.naturalWidth > 1280) {
                    img.width = 1280;
                }
            };
        });

        // Ad video blocker
        // Thanks to https://greasyfork.org/en/users/983322-lrw
        // Original script: https://greasyfork.org/en/scripts/468084-lift-web-restrictions-modified
        const blockAdVideos = () => {
            const videoElements = document.querySelectorAll("video");
            for (let i = 0; i < videoElements.length; i++) {
                const videoElement = videoElements[i];
                if (videoElement.duration < 10) {
                    // Assuming ads are usually shorter than 10 seconds
                    videoElement.pause();
                    videoElement.src = "";
                    videoElement.remove();
                }
            }
        };
        blockAdVideos();

        // Remove ad elements, I will add more ads soon...
        const adDomains = ["googleads.g.doubleclick.net", "adsbygoogle.js", "pagead2.googlesyndication.com"];
        const removeAds = () => {
            document.querySelectorAll("iframe, ins, script, link, meta").forEach(el => {
                const src = el.src || el.href || "";
                const content = el.content || "";
                if (adDomains.some(domain => src.includes(domain)) || content.toLowerCase().includes("advertisement")) {
                    el.remove();
                }
            });
        };
        removeAds();
        new MutationObserver(removeAds).observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // Disable all animation scheduling
    window.requestAnimationFrame = () => {};
    window.setTimeout = fn => fn();
    window.setInterval = fn => fn();
})();