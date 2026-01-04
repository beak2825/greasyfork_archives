// ==UserScript==
// @name         Kaperlert
// @namespace    https://fischly.dev/
// @version      0.4
// @description  forsenDiscoSnake
// @author       fischly
// @match        https://*.ikariam.gameforge.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikariam.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471614/Kaperlert.user.js
// @updateURL https://update.greasyfork.org/scripts/471614/Kaperlert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const TIMEOUT_MEAN = 4500;
    const TIMEOUT_STDDEV = 3000;

    const canKaper = () => !document.querySelector('#pirateCaptureBox .action a').classList.contains('button_disabled');
    const captchaNeeded = () => document.querySelectorAll('.captchaImage').length > 0;

    // utility to draw from normal distribution (source: https://stackoverflow.com/a/36481059)
    const gaussianRandom = (mean=0, stdev=1) => {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    };

    const calculateTimeoutDuration = () => {
        let delay = Math.abs(gaussianRandom(TIMEOUT_MEAN, TIMEOUT_STDDEV)) | 0;
        return delay < 1500 ? delay + 1500 : delay;
    };

    const timeoutCallbackRandom = (callback) => timeoutCallback(callback, calculateTimeoutDuration());
    const timeoutCallback = (callback, timeout) => {
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                callback();
                resolve();
            }, timeout);
        });
    };

    const audio = new Audio('https://files.catbox.moe/c9nwlu.mp3');
    let hasAudioPlayed = false;

    let loop = async () => {
        try {
            if (captchaNeeded()) {
                await timeoutCallback(() => loop(), 8000);
                return;
            }

            if (canKaper()) {
                hasAudioPlayed = true;
                await timeoutCallbackRandom(() => {
                    try {
                        document.querySelector('#pirateCaptureBox .action a').click();
                    } catch (exInner) { }
                });
            }
        } catch (ex) { }
        window.setTimeout(() => loop(), 1000);
    };

    window.setTimeout(() => loop(), 1000);
})();