// ==UserScript==
// @name         GS Resetting Speedhack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle 8x speed with Alt+S
// @author       You
// @match        https://htmlxm.github.io/h4/getaway-shootout/
// @match        https://poki.com/en/g/getaway-shootout
// @match        https://ubg44.github.io/GetawayShootout/
// @match        https://nirogs.github.io/GetawayShootout/
// @match        https://narrow-one.github.io/n6/rooftop-snipers-2/
// @match        https://red-ball4.com/red-ball-4-volume-1.play
// @match        https://storage.y8.com/y8-studio/unity/akeemywka/getaway_shootout/?key=6565859&amp;value=158230
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535489/GS%20Resetting%20Speedhack.user.js
// @updateURL https://update.greasyfork.org/scripts/535489/GS%20Resetting%20Speedhack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalPerformanceNow = window.performance.now.bind(window.performance);
    let isSpeedBoosted = false;

    // Create indicator box
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.width = '20px';
    indicator.style.height = '20px';
    indicator.style.backgroundColor = 'green';
    indicator.style.border = '2px solid black';
    indicator.style.zIndex = '99';
    document.body.appendChild(indicator);

    function toggleSpeedBoost() {
        isSpeedBoosted = !isSpeedBoosted;
        if (isSpeedBoosted) {
            let performanceNowValue = null;
            let previousPerformanceNowValue = null;
            window.performance.now = () => {
                const originalValue = originalPerformanceNow();
                if (performanceNowValue) {
                    performanceNowValue += (originalValue - previousPerformanceNowValue) * 20;
                } else {
                    performanceNowValue = originalValue;
                }
                previousPerformanceNowValue = originalValue;
                return Math.floor(performanceNowValue);
            };
            indicator.style.backgroundColor = 'red';
        } else {
            window.performance.now = originalPerformanceNow;
            indicator.style.backgroundColor = 'green';
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key.toLowerCase() === 'a') {
            toggleSpeedBoost();
        }
    });
})();
