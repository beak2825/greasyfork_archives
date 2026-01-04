// ==UserScript==
// @name         Title Skip
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skipping credits
// @author       jNewtonik
// @match        https://tenies-online.best/load/5-1-0-6083
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495141/Title%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/495141/Title%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastSource = null;

    function skipTwentySeconds(video) {
        if (video && !isNaN(video.duration)) {
            video.currentTime = Math.min(video.duration, video.currentTime + 61);
            // Add credit text for skip
            injectCreditText("Skip Credits by jNewtonik");
        }
    }

    function fastForwardIfNecessary(video) {
        if (video && !isNaN(video.duration)) {
            const remainingTime = video.duration - video.currentTime;
            if (remainingTime <= 65 && remainingTime > 0) {
                video.currentTime = Math.min(video.duration, video.currentTime + 60);
                // Add credit text for fast forward
                injectCreditText("Skip Credits by jNewtonik");
            }
        }
    }

    function injectCreditText(text) {
        const video = document.querySelector('video');
        if (!video) return;

        const creditTextElement = document.createElement('div');
        creditTextElement.textContent = text;
        creditTextElement.style.position = 'absolute';
        creditTextElement.style.top = '40px';
        creditTextElement.style.left = '10px';
        creditTextElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        creditTextElement.style.color = '#fff';
        creditTextElement.style.padding = '10px';
        creditTextElement.style.borderRadius = '5px';
        creditTextElement.style.fontSize = '16px';
        video.parentElement.appendChild(creditTextElement);

        setTimeout(() => {
            creditTextElement.remove();
        }, 10000);
    }

    function monitorVideoSourceChange() {
        const video = document.querySelector('video');
        if (video) {
            const source = video.src;
            if (source !== lastSource) {
                video.addEventListener('loadedmetadata', function() {
                    skipTwentySeconds(video);
                    setInterval(function() {
                        fastForwardIfNecessary(video);
                    }, 1000);
                }, { once: true });
                lastSource = source;
            }
        }

        // Remove the <img> element if detected
        const imgElement = document.querySelector('img[src="/images/play_1.jpg"][title="Play"]');
        if (imgElement) {
            imgElement.remove();
        }
    }

    setInterval(monitorVideoSourceChange, 1000);
})();

