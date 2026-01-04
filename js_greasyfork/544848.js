// ==UserScript==
// @name         Twitch Ad Blocker & Stream Helper
// @namespace    DomopremoScripts
// @version      1.0.0
// @description  Automatically blocks Twitch video ads by replacing the player with an embedded version, and notifies user when ads are skipped. Built and optimized by Domopremo.
// @author       Domopremo
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544848/Twitch%20Ad%20Blocker%20%20Stream%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/544848/Twitch%20Ad%20Blocker%20%20Stream%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showPopup(msg) {
        const box = document.createElement('div');
        box.textContent = msg;
        box.style = 'position:fixed;top:10px;right:10px;background:#000;color:#0f0;padding:8px;font-family:monospace;z-index:99999;border:1px solid #0f0;box-shadow:0 0 10px #0f0;';
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 3000);
    }

    function replacePlayerWithEmbed() {
        const videoPlayer = document.querySelector('div.video-player__container');
        if (!videoPlayer) return;

        const channel = window.location.pathname.split('/')[1];
        if (!channel) return;

        const iframe = document.createElement('iframe');
        iframe.src = `https://player.twitch.tv/?channel=${channel}&parent=twitch.tv&autoplay=true`;
        iframe.height = "100%";
        iframe.width = "100%";
        iframe.allowFullscreen = true;
        iframe.style = "border:none; position:absolute; top:0; left:0; height:100%; width:100%; z-index:9999;";

        iframe.onerror = () => {
            console.warn("Twitch embed iframe failed. Reloading...");
            location.reload();
        };

        // Clear original player
        videoPlayer.innerHTML = '';
        videoPlayer.appendChild(iframe);

        showPopup("Twitch Ad Blocked and Replaced with Embed");
    }

    function monitorForAds() {
        const observer = new MutationObserver(() => {
            const adBanner = document.querySelector('[data-a-target="video-ad-label"]');
            if (adBanner) {
                console.log("Ad detected. Replacing player...");
                replacePlayerWithEmbed();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            monitorForAds();
            console.log("Twitch Ad Blocker Loaded by DomopremoScripts");
        }, 3000);
    });
})();
