// ==UserScript==
// @name         NYT Floating Audio Player
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.4
// @description  Makes the audio player on NYT articles float on scroll in the bottom center.
// @author       Bao
// @match        https://www.nytimes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546014/NYT%20Floating%20Audio%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/546014/NYT%20Floating%20Audio%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This is the CSS that will be applied to the audio player when it floats.
    // We use GM_addStyle to inject it into the page.
    GM_addStyle(`
        .floating-audio-player {
            position: fixed !important;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%); /* This horizontally centers the element */
            width: 600px;
            max-width: 90vw; /* Ensures it fits on smaller screens */
            background-color: white;
            z-index: 10000; /* A high z-index to ensure it's on top */
            padding: 15px;
            border-radius: 8px; /* Added rounded corners */
            border: 1px solid #e2e2e2;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Enhanced shadow for better visibility */
            transition: all 0.3s ease-in-out; /* Smooth transition */
        }
    `);

    // We store the original position of the player here.
    let playerOriginalOffsetTop = 0;

    // This selector targets the specific div that contains the audio player controls
    // and the share buttons, ensuring the entire bar floats.
    const audioPlayer = document.querySelector('.css-qznc1j');

    // If there's no audio player on the page, we don't need to do anything else.
    if (!audioPlayer) {
        console.log("NYT Floating Audio Player: No audio player found on this page.");
        return;
    }

    // A small delay to ensure the page has fully loaded and we get the correct original position.
    setTimeout(() => {
        if (audioPlayer) {
            playerOriginalOffsetTop = audioPlayer.offsetTop;
        }
    }, 500);


    // This function runs every time the user scrolls.
    function handleScroll() {
        // If we haven't found the player or its position yet, do nothing.
        if (!audioPlayer || playerOriginalOffsetTop === 0) {
            return;
        }

        // Check if the user's scroll position is past the player's original position.
        if (window.scrollY > playerOriginalOffsetTop) {
            // If so, add the floating class.
            audioPlayer.classList.add('floating-audio-player');
        } else {
            // Otherwise, remove it.
            audioPlayer.classList.remove('floating-audio-player');
        }
    }

    // Listen for the 'scroll' event on the window.
    window.addEventListener('scroll', handleScroll);

})();
