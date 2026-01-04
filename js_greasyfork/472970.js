// ==UserScript==
// @name        FOODPANDA AUTO REFRESH
// @namespace   Violentmonkey Scripts
// @match       https://foodpanda.portal.restaurant/helpcenter/ordersList
// @grant       none
// @version     1.0
// @author      xero
// @description 7/10/2023, 8:40:48 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472970/FOODPANDA%20AUTO%20REFRESH.user.js
// @updateURL https://update.greasyfork.org/scripts/472970/FOODPANDA%20AUTO%20REFRESH.meta.js
// ==/UserScript==

(function() {
    var countdown = 80;
    var originalTitle = document.title;
    var countdownInterval;
    var isPaused = false;

    // Create countdown element
    var countdownElement = document.createElement('div');
    countdownElement.style.position = 'fixed';
    countdownElement.style.left = '20px';
    countdownElement.style.top = '20px';
    countdownElement.style.fontSize = '20px';
    countdownElement.style.backgroundColor = '#ffffff';
    countdownElement.style.padding = '10px';
    countdownElement.style.border = '1px solid #000000';
    countdownElement.style.zIndex = 9999;
    countdownElement.innerText = 'Refresh in: ' + countdown + 's';
    document.body.appendChild(countdownElement);

    // Create pause/resume button
    var pauseButton = document.createElement('div');
    pauseButton.style.position = 'fixed';
    pauseButton.style.left = '20px';
    pauseButton.style.top = '67px'; // Adjust this value as needed
    pauseButton.innerText = 'Pause';
    pauseButton.style.fontSize = '20px';
    pauseButton.style.backgroundColor = '#ffffff';
    pauseButton.style.padding = '10px';
    pauseButton.style.border = '1px solid #000000';
    pauseButton.style.zIndex = 9999;
    document.body.appendChild(pauseButton);

    // Update countdown every second
    countdownInterval = setInterval(function() {
        if (!isPaused) {
            countdown -= 1;
            countdownElement.innerText = 'Refresh in: ' + countdown + 's';
            document.title = '(' + countdown + ') ' +  originalTitle ;
        }
    }, 1000);

    // Add event listener to pause/resume button
    pauseButton.addEventListener('click', function() {
        isPaused = !isPaused;
        pauseButton.innerText = isPaused ? 'Resume' : 'Pause';
    });

    // Refresh the page when countdown reaches 0
    setTimeout(function() {
        if (countdown <= 0) {
            window.location.reload();
        }
    }, countdown * 1000);
})();
