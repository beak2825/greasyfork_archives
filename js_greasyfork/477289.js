// ==UserScript==
// @name         SatoshiHero
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically click specific buttons in a sequence with delays and reload the page after a certain time.
// @author       White
// @match        https://satoshihero.com/main
// @match        https://satoshihero.com/pt/main
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477289/SatoshiHero.user.js
// @updateURL https://update.greasyfork.org/scripts/477289/SatoshiHero.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickButtonAfterDelay = (selector, delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const button = document.querySelector(selector);
                if (button) {
                    button.click();
                    resolve();
                } else {
                    reject(new Error('Button not found.'));
                }
            }, delay);
        });
    };

    const reloadPageAfterDelay = (delay) => {
        setTimeout(() => {
            window.location.reload();
        }, delay);
    };

    const runAutomation = async () => {
    try {
        await clickButtonAfterDelay('button.base-button.button.primary span.button-content', 5000);

        await clickButtonAfterDelay('button[data-v-52051ad6].base-button.button.small.primary span.button-content', 5000);

        const reloadDelay = Math.floor(Math.random() * 190000) + 220000;
        setTimeout(() => {
            window.location.reload();
        }, reloadDelay);
    } catch (error) {
        console.error('Error:', error.message);
    }
};


    window.addEventListener('load', () => {
        setInterval(runAutomation, 30000);
        const reloadDelay = Math.floor(Math.random() * 190000) + 220000;
       reloadPageAfterDelay(reloadDelay);
    });
})();
