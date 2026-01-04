// ==UserScript==
// @name         Bye Bye MathsWatch
// @author       HyperrGB
// @version      2.2
// @description  Say Bye Bye to Mathswatch as now you "no longer have access to it" as the servers are down!
// @match        https://vle.mathswatch.co.uk/*
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1080178
// @downloadURL https://update.greasyfork.org/scripts/466501/Bye%20Bye%20MathsWatch.user.js
// @updateURL https://update.greasyfork.org/scripts/466501/Bye%20Bye%20MathsWatch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to display the error message and loading countdown
    function displayError() {
        const errorContainer = document.createElement('div');
        errorContainer.style.width = '100%';
        errorContainer.style.height = '100vh';
        errorContainer.style.backgroundColor = '#bf2c15'; // Updated background color
        errorContainer.style.color = '#ffffff';
        errorContainer.style.fontSize = '24px';
        errorContainer.style.fontWeight = 'bold';
        errorContainer.style.textAlign = 'center';
        errorContainer.style.display = 'flex';
        errorContainer.style.flexDirection = 'column';
        errorContainer.style.justifyContent = 'center';
        errorContainer.style.alignItems = 'center';
        errorContainer.style.padding = '0 20%'; // Updated padding on the sides

        const errorIcon = document.createElement('img');
        errorIcon.src = 'https://www.imagehost.at/images/2023/05/17/coolpic.png'; // URL of the error icon
        errorIcon.style.width = '15%'; // Adjust the size of the icon if needed
        errorIcon.style.height = 'auto';
        errorIcon.style.marginBottom = '2%'; // Add spacing between icon and text

        const errorText = document.createElement('div');
        errorText.textContent = 'MathsWatch is currently down due to: Excess Users on Server, we are using a virtual queue to limit the amount of people on MathsWatch, please either try again later or wait in the queue.';
        errorText.style.marginTop = '2%'; // Add spacing above the error message

        const loadingContainer = document.createElement('div');
        loadingContainer.style.width = '100%';
        loadingContainer.style.textAlign = 'center';
        loadingContainer.style.position = 'absolute';
        loadingContainer.style.bottom = '4%';

        const loadingText = document.createElement('div');
        loadingText.style.fontWeight = 'bold';
        loadingText.textContent = 'You are in the queue, approx. 4 hours.';

        const loadingBar = document.createElement('div');
        loadingBar.style.width = '20%';
        loadingBar.style.height = '2%';
        loadingBar.style.backgroundColor = '#ffffff';
        loadingBar.style.margin = '2% auto';
        loadingBar.style.borderRadius = '5px';

        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.borderRadius = '5px';
        progressBar.style.transition = 'width 1s linear';

        loadingBar.appendChild(progressBar);
        loadingContainer.appendChild(loadingBar);
        loadingContainer.appendChild(loadingText);
        errorContainer.appendChild(errorIcon); // Add the error icon to the error container
        errorContainer.appendChild(errorText);
        errorContainer.appendChild(loadingContainer);
        document.body.innerHTML = '';
        document.body.appendChild(errorContainer);

        // Start the countdown timer
        const duration = 4 * 60 * 60; // 4 hours in seconds
        let remainingTime = duration;
        const interval = 1000;

        const timerInterval = setInterval(() => {
            remainingTime -= interval / 1000;

            const progress = (duration - remainingTime) / duration * 100;
            progressBar.style.width = progress + '%';

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                // Reload the page after the timer ends
                window.location.reload();
            }
        }, interval);
    }

    // Function to continuously display the error message and loading countdown
    function errorLoop() {
        displayError();
        setTimeout(errorLoop, 1000); // Adjust the delay (in milliseconds) between error messages if needed
    }

    // Start the error loop when the page finishes loading
    window.addEventListener('load', errorLoop);
})();
