// ==UserScript==
// @name         Hosp timer
// @namespace    namespace
// @version      1.3
// @description  show hosp timer
// @author       mingho
// @match        https://www.torn.com/loader.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468120/Hosp%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/468120/Hosp%20timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let api = '' //enter your API
    let countdownElement; // New element for the countdown

    let url = window.location.href;
    let id = url.slice(url.indexOf("ID=") + 3);

    let apiUrl = `https://api.torn.com/user/${id}?selections=profile&key=${api}`;
    let countdownInterval;

    async function getData() {
        try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            let hospTime = data.states.hospital_timestamp;

            let currentTime = new Date().getTime();
            let adjustedHospTime = (hospTime * 1000);

            let timeLeft = (adjustedHospTime - currentTime);
            console.log(timeLeft);

            startCountdown(timeLeft);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    function createCountdownElement() {
        const countdownDiv = document.createElement('div');
        countdownDiv.id = 'countdown-element'; // Set an ID for the countdown element

        // Find the div element with the specific class name
        const targetDiv = document.querySelector('.titleContainer___QrlWP');



        // Insert the h4 element and countdown div into the target div

        targetDiv.appendChild(countdownDiv);

        return countdownDiv;
    }

    function updateCountdownElement(content) {
        if (!countdownElement) {
            countdownElement = createCountdownElement();
        }

        countdownElement.textContent = content;
    }

    function startCountdown(timeLeft) {
        countdownInterval = setInterval(() => {
            if (timeLeft > 0) {
                let hours = Math.floor(timeLeft / (1000 * 60 * 60));
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                const countdownText = `Out in: ${hours}h ${minutes}m ${seconds}s`;

                updateCountdownElement(countdownText);

                timeLeft -= 1000;
            } else {
                clearInterval(countdownInterval);
                updateCountdownElement('Attack!');
            }
        }, 1000);
    }

    getData();
})();
