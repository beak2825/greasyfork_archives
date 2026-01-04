// ==UserScript==
// @name         Maru Click
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play a sound when clicking on Maru.
// @author       Matskye
// @match        https://marumori.io/adventure/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511526/Maru%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/511526/Maru%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Maru Click Audio Script initialized and running.');

    // GitHub audio URLs - Squee sound from https://freesound.org/people/Reitanna/sounds/344007/ - omae sound from Fist of the North Star anime.
    const maruClickAudioUrl = 'https://raw.githubusercontent.com/matskye/maru-anatomy/main/squee.mp3';
    const maruSpecialAudioUrl = 'https://raw.githubusercontent.com/matskye/maru-anatomy/main/omae.mp3';

    let clickCount = 0;
    let lastClickTime = 0;
    const clickResetTimeout = 30000; // Time (ms) to reset the click counter if no clicks occur

    function playAudio(url) {
        console.log('Attempting to play audio:', url);
        const audio = new Audio(url);
        audio.play().then(() => {
            console.log('Audio played successfully:', url);
        }).catch(error => {
            console.error('Error playing audio:', url, error);
        });
    }

    // Function to handle click event on Maru
    function onMaruClick(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const clickY = event.clientY - rect.top;
        const height = rect.height;

        // Ignore clicks in the bottom 20%
        if (clickY > height * 0.8) {
            console.log('Click ignored on bottom 20% of Maru.');
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        console.log('Maru click detected!');

        const now = Date.now();
        console.log('Current click count:', clickCount);

        if (now - lastClickTime > clickResetTimeout) {
            console.log('Click timeout passed. Resetting click count.');
            clickCount = 0;
        }

        clickCount += 1;
        lastClickTime = now;

        // Check if the user has clicked 10 times in a row
        if (clickCount === 10) {
            console.log('10 clicks reached! Playing special audio.');
            playAudio(maruSpecialAudioUrl);
            clickCount = 0; // Reset the click counter
        } else {
            // Play the regular click sound for all other clicks
            playAudio(maruClickAudioUrl);
        }
    }

    // Create a transparent wrapper for Maru
    function createMaruWrapper(maruElement) {
        const rect = maruElement.getBoundingClientRect();
        const wrapper = document.createElement('div');

        wrapper.style.position = 'absolute';
        wrapper.style.left = `${rect.left}px`;
        wrapper.style.top = `${rect.top}px`;
        wrapper.style.width = `${rect.width}px`;
        wrapper.style.height = `${rect.height * 0.8}px`; // Only the top 80% is clickable
        wrapper.style.pointerEvents = 'auto';
        wrapper.style.zIndex = '9999'; // Ensure it's above everything else

        // Add the click event to the wrapper
        wrapper.addEventListener('click', onMaruClick, true);

        document.body.appendChild(wrapper);
        console.log('Maru wrapper created.');
    }

    // Add event listener to the Maru image with logging
    function addMaruClickListener() {
        const maruElement = document.querySelector('.maru.svelte-1lxsrs3');
        if (maruElement) {
            console.log('Maru element found! Adding click listener.');

            // Create a wrapper to handle clicks on the top 80%
            createMaruWrapper(maruElement);
        } else {
            console.error('Maru element not found. Retrying...');
        }
    }

    // Check every second for the Maru element to appear, if not yet found
    const checkInterval = setInterval(function() {
        const maruElement = document.querySelector('.maru.svelte-1lxsrs3');
        if (maruElement) {
            clearInterval(checkInterval);
            console.log('Maru element found! Adding click listener.');
            addMaruClickListener();
        } else {
            console.log('Still waiting for Maru element to load...');
        }
    }, 1000);
})();