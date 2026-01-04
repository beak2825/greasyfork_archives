 // ==UserScript==
// @name         Aruble
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collect Faucet
// @author       White
// @match        https://aruble.net/page/faucet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aruble.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479259/Aruble.user.js
// @updateURL https://update.greasyfork.org/scripts/479259/Aruble.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clicked = false;

    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clickClaimButton() {
        if (!clicked) {
            const pageText = document.body.innerText;

            const isError = pageText.includes('error');
            const isWait = pageText.includes('wait');
            const isReached = pageText.includes('reached');

            if (!isError && !isWait && !isReached) {
                const claimButton = document.getElementById('claim-button');
                if (claimButton && !claimButton.disabled) {
                    clicked = true;
                    const randomDelay = getRandomDelay(2000, 8000);
                    setTimeout(function() {
                        claimButton.click();
                        checkVisibilityAndClick();
                    }, randomDelay);
                } else {
                }
            } else {
                setTimeout(function() {
                    window.location.reload();
                }, 5 * 60 * 1000);
            }
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function checkVisibilityAndClick() {
        const button = document.getElementById('anti-bot');

        const isButtonVisible = await new Promise((resolve) => {
            const observer = new IntersectionObserver(([entry], obs) => {
                if (entry.isIntersecting) {
                    obs.disconnect();
                    resolve(true);
                }
            });

            observer.observe(button);
        });

        if (isButtonVisible) {
            const buttonStyles = getComputedStyle(button);
            if (buttonStyles.style !== 'margin-top: 8px;') {
                await delay(3000);
                button.click();
            }
        } else {
            checkVisibilityAndClick();
        }
    }

    const pageText = document.body.innerText;
    const isError = pageText.includes('error');
    const isWait = pageText.includes('wait');
    const isReached = pageText.includes('reached');

    if (!isError && !isWait && !isReached) {
        setInterval(clickClaimButton, 1000);
    } else {
        setTimeout(function() {
            window.location.reload();
        }, 5 * 60 * 1000);
    }
})();
