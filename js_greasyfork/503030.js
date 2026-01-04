// ==UserScript==
// @name         DEPRECATED - Find your time and prize - Wheel of Monotony
// @namespace    https://greasyfork.org/users/your-user-id
// @version      1.0.3
// @description  Show your slice prize and the time remaining
// @author       @mamede
// @match        https://www.grundos.cafe/prehistoric/monotony/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503030/DEPRECATED%20-%20Find%20your%20time%20and%20prize%20-%20Wheel%20of%20Monotony.user.js
// @updateURL https://update.greasyfork.org/scripts/503030/DEPRECATED%20-%20Find%20your%20time%20and%20prize%20-%20Wheel%20of%20Monotony.meta.js
// ==/UserScript==

// Since the GC dev team changed the request with the prize and remaining time data, the script will no longer work.
// Thanks to those who have used it so far, it was fun!

/* (function() {
    'use strict';

    window.addEventListener('load', function() {
        const wheelTitle = document.querySelector('h1');


        if (wheelTitle && wheelTitle.textContent === 'Wheel of Monotony') {
            const resultHTML = `
                <div style="margin-top: 20px;">
                    <h2>Your Prize:</h2>
                    <img id="sliceImage" src="" alt="Slice Image">
                    <br>
                    <p id="timeResult"></p>
                </div>
            `;


            wheelTitle.insertAdjacentHTML('afterend', resultHTML);

            const sliceImage = document.getElementById('sliceImage');
            const timeResult = document.getElementById('timeResult');

            function calculateAndDisplayResult(fa, s) {
                const sliceNumber = Math.ceil(16 - (fa / 22.5));
                const sliceImageUrl = `https://www.grundos.cafe/static/games/monotony/assets/slices/${sliceNumber}.png`;

                sliceImage.src = sliceImageUrl;

                const totalSeconds = Math.floor(s);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                timeResult.textContent = `Time remaining: ${formattedTime}`;
            }

            const originalFetch = window.fetch;
            window.fetch = function() {
                return originalFetch.apply(this, arguments).then(function(response) {
                    if (response.url.includes('/prehistoric/monotony/spin/')) {
                        response.clone().json().then(function(data) {
                            calculateAndDisplayResult(data.fa, data.s);
                        });
                    }
                    return response;
                });
            };
        }
    });
})();
*/