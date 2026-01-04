// ==UserScript==
// @name         Add and Remove Songs from Library on YouTube Music
// @version      1.7
// @license MIT
// @description  Adds or removes all songs in the current playlist to/from your library with auto-scroll, counters, a tooltip, and a female TTS voice notification when completed.
// @author       Casket Pizza
// @match        https://music.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1374050
// @downloadURL https://update.greasyfork.org/scripts/510563/Add%20and%20Remove%20Songs%20from%20Library%20on%20YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/510563/Add%20and%20Remove%20Songs%20from%20Library%20on%20YouTube%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let songCounter = 0;
    let counterElement;

    // Scroll to bottom of the page to load all songs
    async function scrollToBottom() {
        return new Promise((resolve) => {
            let lastScrollHeight = 0;
            const interval = setInterval(() => {
                window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom
                let newScrollHeight = document.body.scrollHeight;

                if (newScrollHeight !== lastScrollHeight) {
                    lastScrollHeight = newScrollHeight; // Update last height
                } else {
                    clearInterval(interval); // Stop scrolling when no more new songs load
                    resolve();
                }
            }, 1000); // Check every 1 second
        });
    }

    // Function to add "+" and "-" buttons next to the search bar
    function addButtons() {
        const searchBar = document.querySelector('ytmusic-search-box');
        if (!searchBar) return; // Ensure search bar exists

        const existingPlusButton = document.getElementById('addAllToLibraryButton');
        const existingMinusButton = document.getElementById('removeAllFromLibraryButton');
        if (existingPlusButton || existingMinusButton) return; // Avoid adding multiple buttons

        // Create "+" button to add all songs
        const plusButton = document.createElement('button');
        plusButton.id = 'addAllToLibraryButton';
        plusButton.innerHTML = '+';
        plusButton.style.fontSize = '20px';
        plusButton.style.marginLeft = '10px';
        plusButton.style.cursor = 'pointer';
        plusButton.style.background = 'none';
        plusButton.style.border = 'none';
        plusButton.style.color = 'white';
        plusButton.title = 'Click to add all songs to library'; // Tooltip for Add

        // Create "-" button to remove all songs
        const minusButton = document.createElement('button');
        minusButton.id = 'removeAllFromLibraryButton';
        minusButton.innerHTML = '-';
        minusButton.style.fontSize = '20px';
        minusButton.style.marginLeft = '10px';
        minusButton.style.cursor = 'pointer';
        minusButton.style.background = 'none';
        minusButton.style.border = 'none';
        minusButton.style.color = 'white';
        minusButton.title = 'Click to remove all songs from library'; // Tooltip for Remove

        // Insert the buttons next to the search bar
        searchBar.parentNode.insertBefore(plusButton, searchBar.nextSibling);
        searchBar.parentNode.insertBefore(minusButton, plusButton.nextSibling);

        // Add counter display in bottom-right corner
        counterElement = document.createElement('div');
        counterElement.id = 'songCounter';
        counterElement.style.position = 'fixed';
        counterElement.style.bottom = '80px'; // Move it up to avoid overlap with the media player
        counterElement.style.right = '20px';
        counterElement.style.fontSize = '16px';
        counterElement.style.color = 'white';
        counterElement.style.background = '#333';
        counterElement.style.padding = '10px';
        counterElement.style.borderRadius = '5px';
        counterElement.style.display = 'none'; // Hidden initially
        document.body.appendChild(counterElement);


        // Add event listener for "+" button to add all songs to the library
        plusButton.addEventListener('click', async function() {
            await scrollToBottom(); // Scroll to the bottom to load all songs
            songCounter = 0; // Reset counter
            counterElement.innerHTML = `Songs added: ${songCounter}`;
            counterElement.style.display = 'block'; // Show counter

            var song = document.body.querySelectorAll(".dropdown-trigger.style-scope.ytmusic-menu-renderer");

            for (var i = 0; i < song.length; i++) {
                song[i].click();
                var dropdown = document.body.querySelector("ytmusic-menu-popup-renderer[slot='dropdown-content']");

                if (dropdown != undefined) {
                    var addSong = dropdown.querySelector("tp-yt-paper-listbox#items")
                        .querySelector("ytmusic-toggle-menu-service-item-renderer.style-scope.ytmusic-menu-popup-renderer");

                    if (addSong != null) {
                        var actualAddSong = addSong.querySelector('yt-formatted-string.text.style-scope.ytmusic-toggle-menu-service-item-renderer');

                        if (actualAddSong != null && actualAddSong.innerHTML == 'Save to library') {
                            addSong.click();
                            songCounter++; // Increase counter
                            counterElement.innerHTML = `Songs added: ${songCounter}`;
                            console.log(`Song ${songCounter} saved to library`);
                            await new Promise(r => setTimeout(r, 200)); // Wait for the action to complete
                        }
                    }
                }

                await new Promise(r => setTimeout(r, 100)); // Avoid overloading the system
            }

            // Play TTS notification when the process is complete
            playTTS("Songs added.");
        });

        // Add event listener for "-" button to remove all songs from the library
        minusButton.addEventListener('click', async function() {
            await scrollToBottom(); // Scroll to the bottom to load all songs
            songCounter = 0; // Reset counter
            counterElement.innerHTML = `Songs removed: ${songCounter}`;
            counterElement.style.display = 'block'; // Show counter

            var song = document.body.querySelectorAll(".dropdown-trigger.style-scope.ytmusic-menu-renderer");

            for (var i = 0; i < song.length; i++) {
                song[i].click();
                var dropdown = document.body.querySelector("ytmusic-menu-popup-renderer[slot='dropdown-content']");

                if (dropdown != undefined) {
                    var removeSong = dropdown.querySelector("tp-yt-paper-listbox#items")
                        .querySelector("ytmusic-toggle-menu-service-item-renderer.style-scope.ytmusic-menu-popup-renderer");

                    if (removeSong != null) {
                        var actualRemoveSong = removeSong.querySelector('yt-formatted-string.text.style-scope.ytmusic-toggle-menu-service-item-renderer');

                        if (actualRemoveSong != null && actualRemoveSong.innerHTML == 'Remove from library') {
                            removeSong.click();
                            songCounter++; // Increase counter
                            counterElement.innerHTML = `Songs removed: ${songCounter}`;
                            console.log(`Song ${songCounter} removed from library`);
                            await new Promise(r => setTimeout(r, 200)); // Wait for the action to complete
                        }
                    }
                }

                await new Promise(r => setTimeout(r, 100)); // Avoid overloading the system
            }

            // Play TTS notification when the process is complete
            playTTS("Songs removed.");
        });
    }

    // Function to use TTS to say custom message with a female voice
    function playTTS(message) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'en-US';
        utterance.pitch = 1;
        utterance.rate = 1;

        // Select a female voice if available
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.gender === 'female' || voice.name.includes('Samantha')); // Adjust for common female names

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        speechSynthesis.speak(utterance);
    }

    // Run the addButtons function when the page is loaded
    window.addEventListener('load', function() {
        // Wait for voices to be loaded and then add the buttons
        speechSynthesis.onvoiceschanged = addButtons;
    });

    // Reset counter and hide it after each button click
    window.addEventListener('beforeunload', function() {
        songCounter = 0;
        if (counterElement) {
            counterElement.style.display = 'none'; // Hide the counter on navigation/reload
        }
    });
})();
