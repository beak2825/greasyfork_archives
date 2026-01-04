// ==UserScript==
// @name         StumbleChat Room Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  Adds a button to toggle the width of the chat and the size of images on StumbleChat rooms, and a meme menu button
// @author       You
// @match        https://stumblechat.com/room/*
// @match        https://www.stumblechat.com/room/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501526/StumbleChat%20Room%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/501526/StumbleChat%20Room%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL matches the specific room
    if (window.location.href.includes('stumblechat.com/room/blocked')) {
        // Blank the page with a black background
        document.body.innerHTML = '';
        document.body.style.backgroundColor = 'black';

        // Create the BLOCKED ROOM text
        var blockedRoomText = document.createElement('div');
        blockedRoomText.innerText = 'BLOCKED ROOM';
        blockedRoomText.style.position = 'absolute';
        blockedRoomText.style.top = '50%';
        blockedRoomText.style.left = '50%';
        blockedRoomText.style.transform = 'translate(-50%, -50%)';
        blockedRoomText.style.fontFamily = 'Impact, Charcoal, sans-serif';
        blockedRoomText.style.fontSize = '10rem';
        blockedRoomText.style.color = 'red';
        blockedRoomText.style.textAlign = 'center';
        blockedRoomText.style.animation = 'flash 1s infinite';

        // Add the BLOCKED ROOM text to the document
        document.body.appendChild(blockedRoomText);

        // Add CSS for the flash animation
        var style = document.createElement('style');
        style.innerHTML = `
            @keyframes flash {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    } else {
        // Select the sc-chat element
        var chatElement = document.querySelector('sc-chat');

        // Check if the element exists
        if (chatElement) {
            // Create a button element for box size
            var boxSizeButton = document.createElement('button');
            boxSizeButton.innerText = 'Box Size';
            boxSizeButton.style.position = 'fixed';
            boxSizeButton.style.top = '10px';
            boxSizeButton.style.right = '20px';
            boxSizeButton.style.zIndex = '1000';
            boxSizeButton.style.color = 'black';
            boxSizeButton.style.background = '#33FF3380';
            boxSizeButton.style.borderRadius = '5px';

            // Add the button to the document
            document.body.appendChild(boxSizeButton);

            // Add a click event listener to the box size button
            boxSizeButton.addEventListener('click', function() {
                // Toggle the width of the chat
                if (chatElement.style.width === '2000px') {
                    chatElement.style.width = '500px';
                } else {
                    chatElement.style.width = '2000px';
                    // Set the width and height of images in the message-content class to twice their current size
                    var images = document.querySelectorAll('.message-content img');
                    images.forEach(function(image) {
                        image.width *= 2;
                        image.height *= 2;
                    });
                }
            });

            // Create a button element for font size
            var fontSizeButton = document.createElement('button');
            fontSizeButton.innerText = 'Font Size';
            fontSizeButton.style.position = 'fixed';
            fontSizeButton.style.top = '10px';
            fontSizeButton.style.right = '120px';
            fontSizeButton.style.zIndex = '1000';
            fontSizeButton.style.color = 'black';
            fontSizeButton.style.background = '#33FF3380';
            fontSizeButton.style.borderRadius = '5px';

            // Add the button to the document
            document.body.appendChild(fontSizeButton);

            // Add a click event listener to the font size button
            fontSizeButton.addEventListener('click', function() {
                // Toggle the font size in the stylesheet
                var stylesheet = document.styleSheets[0];
                var rules = stylesheet.cssRules || stylesheet.rules;
                for (var i = 0; i < rules.length; i++) {
                    if (rules[i].selectorText === '.message') {
                        if (rules[i].style.fontSize === '1.5rem') {
                            rules[i].style.fontSize = '1rem';
                        } else {
                            rules[i].style.fontSize = '1.5rem';
                        }
                        break;
                    }
                }
            });

            // Create a button element for the meme menu
            var memeButton = document.createElement('button');
            memeButton.innerHTML = '📂';
            memeButton.style.position = 'fixed';
            memeButton.style.bottom = '10px';
            memeButton.style.right = '10px';
            memeButton.style.zIndex = '1000';
            memeButton.style.background = 'none';
            memeButton.style.border = 'none';
            memeButton.style.color = 'white';
            memeButton.style.fontSize = '.6rem';
            memeButton.style.cursor = 'pointer';

            // Add the button to the document
            document.body.appendChild(memeButton);

            // Create the meme menu
            var memeMenu = document.createElement('div');
            memeMenu.style.position = 'fixed';
            memeMenu.style.bottom = '40px';
            memeMenu.style.right = '10px';
            memeMenu.style.background = '#000000cc';
            memeMenu.style.borderRadius = '1rem';
            memeMenu.style.padding = '.5rem';
            memeMenu.style.border = '2px solid orange';
            memeMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            memeMenu.style.display = 'none';
            memeMenu.style.zIndex = '1000';

            // Add meme buttons to the menu
            var memes = [
                { name: 'Thinking Man', url: 'https://i.imgur.com/ImpR5WV.png' },
                { name: 'Calculating', url: 'https://i.imgur.com/s53snJd.png' },
                { name: 'Pepe Silvia', url: 'https://i.imgur.com/OVjzRbX.png' },
                { name: 'No Dont Think', url: 'https://i.imgur.com/ycXPWsE.png' }
            ];

            memes.forEach(function(meme, index) {
                var memeButtonElement = document.createElement('button');
                memeButtonElement.innerText = meme.name;
                memeButtonElement.style.background = `linear-gradient(to bottom, hsl(${180 + index * 30}, 100%, 50%), hsl(${210 + index * 30}, 100%, 50%))`;
                memeButtonElement.style.border = 'none';
                memeButtonElement.style.color = 'white';
                memeButtonElement.style.cursor = 'pointer';
                memeButtonElement.style.padding = '.5rem';
                memeButtonElement.style.borderRadius = '.3rem';
                memeButtonElement.style.display = 'block';
                memeButtonElement.style.width = '100%';
                memeButtonElement.style.textAlign = 'left';
                memeButtonElement.style.marginBottom = '.5rem';
                memeButtonElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';

                memeButtonElement.addEventListener('click', function() {
                    var textarea = document.querySelector('#textarea');
                    textarea.value = meme.url;
                    textarea.focus();

                    // Simulate Enter key press
                    var enterEvent = new KeyboardEvent('keydown', {
                        bubbles: true,
                        cancelable: true,
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13
                    });
                    textarea.dispatchEvent(enterEvent);

                    memeMenu.style.display = 'none';
                });

                memeMenu.appendChild(memeButtonElement);
            });

            // Add the meme menu to the document
            document.body.appendChild(memeMenu);

            // Add a click event listener to the meme button
            memeButton.addEventListener('click', function() {
                if (memeMenu.style.display === 'none') {
                    memeMenu.style.display = 'block';
                } else {
                    memeMenu.style.display = 'none';
                }
            });

            // Close the meme menu when clicking outside of it
            document.addEventListener('click', function(event) {
                if (!memeMenu.contains(event.target) && !memeButton.contains(event.target)) {
                    memeMenu.style.display = 'none';
                }
            });

            // Add event listener to the textarea for Enter key press
            var textarea = document.querySelector('#textarea');
            textarea.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    // easter eggs. fuck these losers.
                    textarea.value = textarea.value.replace(/lucius/gi, 'disgusting pedo creep lucius');
                    textarea.value = textarea.value.replace(/sophia|sophie/gi, 'absolute retard sophia');
                    textarea.value = textarea.value.replace(/msa|msalpha|missalpha/gi, 'lying ass narcissist pedo apologist msa');
                    textarea.value = textarea.value.replace(/dok|d0k/gi, 'failtroll deadend job d0k');
                }
            });
        }
    }
})();
