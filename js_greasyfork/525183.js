// ==UserScript==
// @name         BloxdCyphrNX
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enhances Bloxd.io: toggle Comic Sans, rainbow chat, FPS boost, and ad-blocking.
// @author       CyphrNX
// @match        https://bloxd.io/
// @match        https://staging.bloxd.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525183/BloxdCyphrNX.user.js
// @updateURL https://update.greasyfork.org/scripts/525183/BloxdCyphrNX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isComicSans = false;
    let rainbowActive = false;

    function optimizePerformance() {
        try {
            let settings = JSON.parse(localStorage.getItem('settings') || '{}');
            Object.assign(settings, {
                shadows: false,
                particles: false,
                postProcessing: false
            });
            localStorage.setItem('settings', JSON.stringify(settings));
            console.log("Performance settings applied!");
        } catch (e) {
            console.error("Failed to apply performance settings:", e);
        }
    }

    function applyRainbowEffect() {
        if (!rainbowActive) return;
        document.querySelectorAll('.ChatMessages div').forEach(msg => {
            msg.style.animation = 'rainbow-fade 3s infinite';
            msg.style.fontFamily = isComicSans ? 'Comic Sans MS, cursive' : 'Arial, sans-serif';
            msg.style.fontSize = '14px';
        });
    }

    function addRainbowAnimation() {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rainbow-fade {
                0% { color: red; }
                16% { color: orange; }
                33% { color: yellow; }
                50% { color: green; }
                66% { color: blue; }
                83% { color: indigo; }
                100% { color: violet; }
            }
        `;
        document.head.appendChild(style);
    }

    function toggleFont(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'X') {
            isComicSans = !isComicSans;
            console.log(`Font switched to ${isComicSans ? 'Comic Sans' : 'Normal'}`);
            applyRainbowEffect();
        }
    }

    function toggleRainbow(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
            rainbowActive = !rainbowActive;
            console.log(`Rainbow effect ${rainbowActive ? 'activated' : 'deactivated'}`);
            applyRainbowEffect();
        }
    }

    function observeChatMessages() {
        const chatContainer = document.querySelector('.ChatMessages');
        if (!chatContainer) return;

        const observer = new MutationObserver(() => {
            if (rainbowActive) applyRainbowEffect();
        });

        observer.observe(chatContainer, { childList: true });
    }

    function blockAds() {
        const adSelectors = ['.ad-container', '#ad-banner', '[id^="google_ads"]'];
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => ad.remove());
        });
        console.log("Ads removed!");
    }

    window.addEventListener('keydown', toggleFont);
    window.addEventListener('keydown', toggleRainbow);

    function init() {
        addRainbowAnimation();
        optimizePerformance();
        observeChatMessages();
        blockAds();
    }

    init();
})();

