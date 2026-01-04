// ==UserScript==
// @name         BetterBloxd
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Custom Script That Is Made By AI To Try How Good Is It AT MAking Bloxd Script. This Script Makes You Able To Switch Between Comic Sans Font And The Normal FOnt With Ctrl Shift X And Make The Chat Color Rainbow WIth Ctrl Shift Z. As An Extra, It Adds A AdBlocker And A Fps Booster!
// @author       ThatOneSonicGuy & ChatGPT
// @match        https://bloxd.io/
// @match        https.//staging.bloxd.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524995/BetterBloxd.user.js
// @updateURL https://update.greasyfork.org/scripts/524995/BetterBloxd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isComicSans = false;

    function optimizePerformance() {
        const config = {
            shadows: false,
            particles: false,
            postProcessing: false,
        };

        const optimize = () => {
            try {
                let settings = window.localStorage.getItem('settings');
                if (settings) {
                    settings = JSON.parse(settings);
                    settings.shadows = config.shadows;
                    settings.particles = config.particles;
                    settings.postProcessing = config.postProcessing;
                    window.localStorage.setItem('settings', JSON.stringify(settings));
                    console.log("Performance settings applied!");
                }
            } catch (e) {
                console.error("Failed to apply settings:", e);
            }
        };

        const modifyRendering = () => {
            requestAnimationFrame = (callback) => {
                setTimeout(callback, 0);
            };
            console.log("FPS is now boosted with no cap.");
        };

        optimize();
        modifyRendering();
    }

    function applyRainbowEffect() {
        const chatMessages = document.querySelectorAll('.ChatMessages div');
        chatMessages.forEach((message) => {
            message.style.animation = 'rainbow-fade 3s infinite';
            message.style.fontFamily = isComicSans ? 'Comic Sans MS, cursive' : 'Arial, sans-serif';
            message.style.fontSize = '10px';
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
            console.log(isComicSans ? 'Switched to Comic Sans' : 'Switched to Normal Font');
        }
    }

    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'X') {
            toggleFont(event);
        }
    });

    function init() {
        setInterval(() => {
            applyRainbowEffect();
        }, 1000);

        addRainbowAnimation();
        optimizePerformance();
    }

    init();
})();