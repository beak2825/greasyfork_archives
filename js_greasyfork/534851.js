// ==UserScript==
// @name         Twitchᴾˡᵘˢ Ad Skipper (🚫 No Ads • No Downloads • No Virus)
// @version      1.0
// @description Automatically skips ads on Twitch livestreams. No downloads, no viruses, just ad skipping.
// @author       TonNom
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1465338
// @downloadURL https://update.greasyfork.org/scripts/534851/Twitch%E1%B4%BE%CB%A1%E1%B5%98%CB%A2%20Ad%20Skipper%20%28%F0%9F%9A%AB%20No%20Ads%20%E2%80%A2%20No%20Downloads%20%E2%80%A2%20No%20Virus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534851/Twitch%E1%B4%BE%CB%A1%E1%B5%98%CB%A2%20Ad%20Skipper%20%28%F0%9F%9A%AB%20No%20Ads%20%E2%80%A2%20No%20Downloads%20%E2%80%A2%20No%20Virus%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        const adBanner = document.querySelector('.ad-banner, .tw-c-background-overlay');

        // Si une pub est détectée (flux noir ou overlay), on recharge le lecteur
        if (video && (video.adBanner || video.duration === 0)) {
            console.log('[Twitch Ad Skipper] Ad detected, refreshing player...');
            const refreshButton = document.querySelector('[data-a-target="player-overlay-click-handler"]');
            if (refreshButton) refreshButton.click();
        }

        // Supprimer les overlays pub éventuels
        const adOverlays = document.querySelectorAll('.ad-banner, .player-ad-overlay');
        adOverlays.forEach(el => el.remove());
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log('[Twitch Ad Skipper] Script actif');
})();
