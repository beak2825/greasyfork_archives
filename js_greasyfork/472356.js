// ==UserScript==
// @name        Skip Amazon Prime Video Ads
// @description This script skips Prime Video ads in English and German – adapted from Mattealex https://greasyfork.org/en/scripts/393617-skip-amazon-prime-video-ads
// @author floriegl
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @match https://primevideo.com/region/*/detail/*
// @match https://*.primevideo.com/region/*/detail/*
// @match https://primevideo.com/detail/*
// @match https://*.primevideo.com/detail/*
// @match https://amazon.com/Episode-*/dp/*
// @match https://*.amazon.com/Episode-*/dp/*
// @match https://amazon.de/Episode-*/dp/*
// @match https://*.amazon.de/Episode-*/dp/*
// @match https://amazon.com/gp/video/detail/*
// @match https://*.amazon.com/gp/video/detail/*
// @match https://amazon.de/gp/video/detail/*
// @match https://*.amazon.de/gp/video/detail/*
// @version     1.2
// @icon        https://images-eu.ssl-images-amazon.com/images/I/411j1k1u9yL.png
// @namespace https://greasyfork.org/users/703184
// @downloadURL https://update.greasyfork.org/scripts/472356/Skip%20Amazon%20Prime%20Video%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/472356/Skip%20Amazon%20Prime%20Video%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function skipAd() {
        if (document.querySelectorAll(".atvwebplayersdk-adtimeindicator-text").length) {
            for (const a of document.querySelectorAll(".atvwebplayersdk-bottompanel-container div")) {
                if (a.textContent == "Überspringen" || a.textContent == "Skip") {
                    await new Promise(r => setTimeout(r, 500));
                    a.click();
                    while (document.querySelectorAll(".atvwebplayersdk-adtimeindicator-text").length) {
                        await new Promise(r => setTimeout(r, 1000));
                    }
                }
            }
        }
        window.setTimeout(skipAd, 100);
    }
    skipAd();
})();