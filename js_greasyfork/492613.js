// ==UserScript==
// @name         EvoWorld.io Boss Timer
// @namespace    evoworld_boss_timer
// @version      0.1
// @description  Adds a boss timer to EvoWorld.io
// @author       @LCDAngel99
// @match        https://evoworld.io/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492613/EvoWorldio%20Boss%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/492613/EvoWorldio%20Boss%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the boss status and timer
    let bossContainer = document.createElement('div');
    bossContainer.style.position = 'absolute';
    bossContainer.style.top = '50px'; // Adjust the position as needed
    bossContainer.style.right = '10px'; // Adjust the position to align with the leaderboard
    bossContainer.style.zIndex = '9999';
    bossContainer.style.display = 'flex';
    bossContainer.style.alignItems = 'center';

    // Add the picture of the demonic angel
    let bossImage = document.createElement('img');
    bossImage.src = 'https://cdn1.na.evoworld.io/sprites/bosses/boss1/flying/1.png';
    bossImage.style.width = '50px'; // Adjust size as needed
    bossImage.style.marginRight = '10px'; // Adjust margin as needed
    bossContainer.appendChild(bossImage);

    // Add the boss status text
    let bossStatusText = document.createElement('div');
    bossStatusText.style.fontSize = '16px';
    bossStatusText.style.color = '#000000'; // Adjust color as needed
    bossContainer.appendChild(bossStatusText);

    // Add the boss timer
    let bossTimerText = document.createElement('div');
    bossTimerText.style.fontSize = '16px';
    bossTimerText.style.color = '#ffffff'; // Adjust color as needed
    bossContainer.appendChild(bossTimerText);

    // Function to update the boss status and timer
    function updateBossStatusAndTimer() {
        // Check if the boss is alive on the current server
        let bossIndicator = document.querySelector('.bC'); // Assuming this element indicates the boss's presence
        if (bossIndicator) {
            bossStatusText.innerText = "THE BOSS IS ALIVE";
            bossTimerText.innerText = "";
        } else {
            // Calculate and display the boss timer
            let currentTime = new Date();
            let nextBossTime = new Date(currentTime);
            nextBossTime.setHours(currentTime.getHours() + 1);
            nextBossTime.setMinutes(0);
            nextBossTime.setSeconds(0);

            let timeDifference = nextBossTime - currentTime;
            let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            // Format the time nicely
            let formattedTime = (minutes < 10 ? '0' : '') + minutes + ':' +
                                (seconds < 10 ? '0' : '') + seconds;

            bossStatusText.innerText = "";
            bossTimerText.innerText = 'Boss Timer: ' + formattedTime;
        }
    }

    // Call updateBossStatusAndTimer function every second
    setInterval(updateBossStatusAndTimer, 1000);

    // Append the container to the body
    document.body.appendChild(bossContainer);
})();
