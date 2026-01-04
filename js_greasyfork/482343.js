// ==UserScript==
// @name         TesterTV_Let_It_Snow
// @namespace    https://greasyfork.org/ru/scripts/482343-testertv-let-it-snow/code
// @version      2023.12.16
// @description  Make it snow on the webpage
// @license      GPL version 3 or any later version
// @author       TesterTV
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482343/TesterTV_Let_It_Snow.user.js
// @updateURL https://update.greasyfork.org/scripts/482343/TesterTV_Let_It_Snow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a snowflake element
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄️';
        snowflake.style.position = 'fixed';
        snowflake.style.top = '0';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.fontSize = Math.random() * 10 + 5 + 'px';
        snowflake.style.opacity = Math.random();
        snowflake.style.userSelect = 'none';
        snowflake.style.pointerEvents = 'none';
        document.body.appendChild(snowflake);
        return snowflake;
    }

    // Move the snowflake down the page
    function moveSnowflake(snowflake) {
        const speed = Math.random() * 5 + 1;
        const interval = setInterval(() => {
            const currentTop = parseFloat(snowflake.style.top);
            if (currentTop < window.innerHeight) {
                snowflake.style.top = currentTop + speed + 'px';
            } else {
                snowflake.style.top = '0';
            }
        }, 50);
    }

    // Create and move snowflakes
    for (let i = 0; i < 100; i++) {
        const snowflake = createSnowflake();
        moveSnowflake(snowflake);
    }
})();