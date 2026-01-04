// ==UserScript==
// @name         Speed up and skip YouTube ads
// @namespace    http://ptr.red/zeroytads
// @version      2024-01-18
// @description  Very illegal!
// @author       peterfritz
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485172/Speed%20up%20and%20skip%20YouTube%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/485172/Speed%20up%20and%20skip%20YouTube%20ads.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const isPlayingAd = () => {
        const moviePlayer = document.querySelector("#movie_player");

        if (!moviePlayer) {
            return false;
        }

        const result = [
            moviePlayer.classList.contains("ad-showing"),
            moviePlayer.classList.contains("ad-interrupting"),
        ].some((value) => !!value);

        return result;
    };

    const skipAd = (element) => {
        if (!isPlayingAd()) {
            return;
        }

        const button = element.querySelector(
            ".ytp-ad-skip-button-modern.ytp-button"
        );

        if (button) {
            button.click();
        }
    };

    const muteAndSpeedUpAd = (element) => {
        if (!isPlayingAd()) {
            return;
        }

        const video = element.querySelector("video");

        if (video) {
            video.playbackRate = 16;
            video.muted = true;
        }
    };

    const processMutation = (mutations) => {
        if (!isPlayingAd()) {
            return;
        }

        mutations.forEach((mutation) => {
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
            ) {
                muteAndSpeedUpAd(mutation.target);
            }

            if (mutation.type === "childList" && mutation.addedNodes.length) {
                skipAd(mutation.target);
            }
        });
    };

    const run = () => {
        const moviePlayer = document.querySelector("#movie_player");

        if (moviePlayer) {
            new MutationObserver(processMutation).observe(moviePlayer, {
                attributes: true,
                childList: true,
                subtree: true,
            });

            muteAndSpeedUpAd(moviePlayer);

            skipAd(moviePlayer);
        } else {
            setTimeout(run, 50);
        }
    };

    run();
})();