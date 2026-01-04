// ==UserScript==
// @name        Perplexity Follow-Up Clicker
// @namespace   https://github.com/mefengl
// @match       https://www.perplexity.ai/search/*
// @grant       none
// @version     1.3
// @license     MIT
// @author      mefengl
// @description Automatically clicks the follow-up button for "Plexity follow up" on Perplexity.ai every 10 seconds.
// @downloadURL https://update.greasyfork.org/scripts/501820/Perplexity%20Follow-Up%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/501820/Perplexity%20Follow-Up%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let intervalId;

    function clickFollowUp() {
        const elements = document.querySelectorAll('.group.flex.cursor-pointer.items-center.justify-between.py-sm');
        if (elements.length > 1) {
            elements[1].click();
        }
    }

    function startAutoClick() {
        if (!isRunning) {
            clickFollowUp(); // Click immediately
            intervalId = setInterval(clickFollowUp, 10000); // Run every 10 seconds
            isRunning = true;
        }
    }

    function stopAutoClick() {
        if (isRunning) {
            clearInterval(intervalId);
            isRunning = false;
        }
    }

    function toggleAutoClick() {
        if (isRunning) {
            stopAutoClick();
            toggleButton.textContent = 'Start Auto Click';
            toggleButton.classList.remove('running');
        } else {
            startAutoClick();
            toggleButton.textContent = 'Stop Auto Click';
            toggleButton.classList.add('running');
        }
    }

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Start Auto Click';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = 1000;
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.backgroundColor = '#007BFF';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    toggleButton.style.transition = 'background-color 0.3s, transform 0.3s';

    // Additional styles for running state
    const style = document.createElement('style');
    style.textContent = `
        button.running {
            background-color: #28a745 !important;
        }
        button:hover {
            background-color: #0056b3;
            transform: scale(1.05);
        }
        button:active {
            background-color: #003d80;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);

    toggleButton.addEventListener('click', toggleAutoClick);

    document.body.appendChild(toggleButton);
})();
