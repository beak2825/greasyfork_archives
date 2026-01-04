// ==UserScript==
// @name         Deutsche Welle Out Load Reading
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Enhances DW Learn German by improving readability, removing distractions, and adding shortcuts.
// @author       Yange
// @match        https://learngerman.dw.com/de/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529303/Deutsche%20Welle%20Out%20Load%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/529303/Deutsche%20Welle%20Out%20Load%20Reading.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    let button = document.createElement('button');
    button.innerText = 'Clean';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px';
    button.style.background = 'red';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';

    // Button click event to remove the <nav>
    button.addEventListener('click', function() {
        let currentUrl = window.location.href;
        if (!currentUrl.endsWith('/lm')){
            window.location.href=currentUrl + '/lm';
        }

        let navHeader = document.querySelector('nav.sk35agp');

        if (navHeader) {
            navHeader.remove();
        }

        let navElement = document.querySelector('nav.s1got9be');

        if (navElement) {
            navElement.remove();
        }

        let footerEle = document.querySelector('footer');

        if (footerEle){
        footerEle.remove();
        }
    });

    // Add button to the page
    document.body.appendChild(button);



    // Function to toggle play/pause using the Space key
    function togglePlayPause(event) {
        if (event.code === 'Space') { // Check if Space key is pressed
            event.preventDefault(); // Prevent default scrolling behavior
            event.stopPropagation(); // Prevent interference with other key events

            let playButton = document.querySelector('button.vjs-control'); // Find the play button
            if (playButton) {
                let scrollY = window.scrollY; // Store current scroll position

                playButton.click(); // Simulate clicking the play/pause button
                console.log('Space key pressed: Toggling play/pause');

                setTimeout(() => {
                    playButton.blur();
                    document.activeElement.blur();
                    window.scrollTo(0, scrollY); // Restore scroll position
                }, 1);
            } else {
                console.log('Play button not found.');
            }
        }
    }

    // Add event listener for keydown
    document.addEventListener('keydown', togglePlayPause);


    function seekBack(event) {
        if (event.code === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation(); // Prevent interference with other key events
            let rewindButton = document.querySelector('button.vjs-seek-button.skip-back');
            if (rewindButton) {
                rewindButton.click();
                console.log('Left Arrow pressed: Seeking back 10 seconds');
            } else {
                console.log('Seek back button not found.');
            }
        }
    }

    document.addEventListener('keydown', seekBack);

    function seekForward(event) {
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation(); // Prevent interference with other key events
            let rewindForward = document.querySelector('button.vjs-seek-button.skip-forward');
            if (rewindForward) {
                rewindForward.click();
                console.log('Right Arrow pressed: Seeking frontend 10 seconds');
            } else {
                console.log('Seek forward button not found.');
            }
        }
    }

    document.addEventListener('keydown', seekForward);




})();