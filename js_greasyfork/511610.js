// ==UserScript==
// @name         flappybird.io CHEAT
// @namespace    http://tampermonkey.net/
// @version      2024-10-05
// @description  Directly post any score to the leaderboard
// @license MIT
// @author       Doesn't matter
// @match        https://flappybird.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flappybird.io
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/511610/flappybirdio%20CHEAT.user.js
// @updateURL https://update.greasyfork.org/scripts/511610/flappybirdio%20CHEAT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create container for inputs and buttons
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.right = '10px';
    container.style.transform = 'translateY(-50%)';
    container.style.zIndex = '1000';

    // Input for changing count
    const inputCount = document.createElement('input');
    inputCount.type = 'number';
    inputCount.placeholder = 'Change count';
    container.appendChild(inputCount);

    // Button to change count
    const changeCountButton = document.createElement('button');
    changeCountButton.textContent = 'CHANGE COUNT';
    container.appendChild(changeCountButton);

    document.body.appendChild(container);

    // Event listener for changing count
    changeCountButton.addEventListener('click', () => {
        const newCount = inputCount.value;

        if (!newCount) {
            alert('Please enter a count value.');
            return;
        }

        // Simulate typing the new count into the console
        const script = document.createElement('script');
        script.textContent = `counter.text = ${newCount};`;
        document.body.appendChild(script);
        document.body.removeChild(script); // Remove the script after execution

        alert(`Count changed to: ${newCount}`);
    });
})();
