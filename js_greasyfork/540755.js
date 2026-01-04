// ==UserScript==
// @name         Mobile YouTube - Force Safari AirPlay handshake
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force YouTube (desktop + mobile) to always play in 1080p
// @author       Seth@WiiPlaza
// @match        *://*.youtube.com/*
// @match        *://m.youtube.com/*
// @grant        none
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/85aa6584-7ebf-439b-b994-59802e194f0b/djm0ls4-ac1eba6a-6058-4454-9ce9-6eba6ad26b23.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg1YWE2NTg0LTdlYmYtNDM5Yi1iOTk0LTU5ODAyZTE5NGYwYlwvZGptMGxzNC1hYzFlYmE2YS02MDU4LTQ0NTQtOWNlOS02ZWJhNmFkMjZiMjMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ei28OmVYY6hrSLNsa61AIocsIhsN2VKBCRUv2N6lTc4
// @downloadURL https://update.greasyfork.org/scripts/540755/Mobile%20YouTube%20-%20Force%20Safari%20AirPlay%20handshake.user.js
// @updateURL https://update.greasyfork.org/scripts/540755/Mobile%20YouTube%20-%20Force%20Safari%20AirPlay%20handshake.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const quality = 'hd1080';

    function setQuality() {
        let player = document.querySelector('video');
        if (player && player.getAvailableQualityLevels) {
            player.setPlaybackQualityRange(quality);
            player.setPlaybackQuality(quality);
        }

        if (typeof window.ytplayer !== 'undefined' && ytplayer.config) {
            try {
                const playerConfig = ytplayer.config;
                if (playerConfig.args && playerConfig.args.adaptive_fmts) {
                    console.log('Adaptive streaming in use');
                }
            } catch (e) {
                console.warn('Error accessing ytplayer config:', e);
            }
        }

        if (typeof player?.setPlaybackQualityRange === 'function') {
            player.setPlaybackQualityRange(quality);
        }

        if (typeof player?.setPlaybackQuality === 'function') {
            player.setPlaybackQuality(quality);
        }
    }

    const interval = setInterval(() => {
        setQuality();
    }, 2000);

    window.addEventListener('beforeunload', () => clearInterval(interval));
})();