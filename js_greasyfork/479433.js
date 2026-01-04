// ==UserScript==
// @name         Continious Simulate Click on Horizontal Arrow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simulate clicks on div elements with specific class and style
// @author       max5555
// @match        https://cab.meest.cn/dashboard/buyout
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479433/Continious%20Simulate%20Click%20on%20Horizontal%20Arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/479433/Continious%20Simulate%20Click%20on%20Horizontal%20Arrow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject the radial button
    const radialBtn = document.createElement('button');
    radialBtn.textContent = "Toggle Continuous Clicks";
    radialBtn.style.position = "fixed";
    radialBtn.style.bottom = "10px";
    radialBtn.style.right = "10px";
    radialBtn.style.zIndex = "10000";
    radialBtn.style.borderRadius = "50%";
    radialBtn.style.background = "red";
    radialBtn.style.color = "white";
    radialBtn.style.border = "none";
    radialBtn.style.padding = "10px 20px";
    document.body.appendChild(radialBtn);

    let clicking = false;
    let clickInterval;

    // Function to simulate clicks
    function simulateClicks() {
        const divs = document.querySelectorAll('div.horizontal-arrow:not(.clicked)'); // Select divs that have not been clicked
        divs.forEach(div => {
            if (div.style.transform === "rotate(0deg)") {
                div.click();
                div.classList.add('clicked'); // Mark the div as clicked
            }
        });
    }

    // Add event listener for the radial button
    radialBtn.addEventListener('click', function() {
        clicking = !clicking;
        if (clicking) {
            clickInterval = setInterval(simulateClicks, 1000); // Simulate click every 1 second
            radialBtn.style.background = "green";
        } else {
            clearInterval(clickInterval);
            radialBtn.style.background = "red";
            // Optional: Remove the 'clicked' class from all divs if you want to reset the state when stopping
            document.querySelectorAll('div.horizontal-arrow.clicked').forEach(div => {
                div.classList.remove('clicked');
            });
        }
    });

})();
