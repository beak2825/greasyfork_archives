// ==UserScript==
// @name         Spotify AdBlocker
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Comprehensive Spotify AdBlocker (audio, banners, premium prompts).
// @author       Plancy
// @match        https://open.spotify.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522592/Spotify%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/522592/Spotify%20AdBlocker.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const queryAsync = (query, interval = 250) => new Promise(resolve => {
        const checkInterval = setInterval(() => {
            const element = document.querySelector(query);
            if (element) {
                clearInterval(checkInterval);
                resolve(element);
            }
        }, interval);
    });

    const removeElements = selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    };

    const handleAudioAds = () => {
        const audioAd = document.querySelector('audio[src*="spotify.com/ad"]');
        if (audioAd) {
            audioAd.src = "";
            audioAd.pause();
        }
    };

    const inject = ({ ctx, fn, transform }) => {
        const original = ctx[fn];
        ctx[fn] = function () {
            const result = original.apply(this, arguments);
            return transform ? transform.call(this, result, ...arguments) : result;
        };
    };

    const observer = new MutationObserver(() => {
        removeElements('[data-testid="ad-slot-container"], [class*="ad-"]');
        handleAudioAds();
        removeElements('.ButtonInner-sc-14ud5tc-0.fcsOIN');
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    const adRemovalInterval = setInterval(() => {
        removeElements('[data-testid="ad-slot-container"], [class*="ad-"]');
        handleAudioAds();
        removeElements('.ButtonInner-sc-14ud5tc-0.fcsOIN');
    }, 1000);

    const nowPlayingBar = await queryAsync(".now-playing-bar");
    const playButton = await queryAsync("button[title=Play], button[title=Pause]");
    let audio;

    inject({
        ctx: document,
        fn: "createElement",
        transform(result, type) {
            if (type === "audio") {
                audio = result;
            }
            return result;
        },
    });

    new MutationObserver(() => {
        if (audio && playButton && document.querySelector(".now-playing > a")) {
            audio.src = "";
            playButton.click();
        }
    }).observe(nowPlayingBar, {
        childList: true,
        subtree: true,
    });

    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        clearInterval(adRemovalInterval);
    });

    console.log("Spotify AdBlocker Ultimate is active");
})();
