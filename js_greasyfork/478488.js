// ==UserScript==
// @name         Copy F-List Channels
// @namespace    http://f-list.net/c/Dik
// @version      1.0
// @description  Take the list of saved channels from one character and paste them on another
// @author       Futah AKA Dik
// @match        https://www.f-list.net/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f-list.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478488/Copy%20F-List%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/478488/Copy%20F-List%20Channels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {

        // Badges Element that will contain the buttons
        const badges = document.querySelector('#charabadges');

        // Create new buttons
        for (let btnName of ['Copy', 'Paste']) {
            let button = document.createElement('span');
            button.className = 'Character_StatusCoder';
            button.textContent = btnName + ' Channels';

            // Hover Style
            button.addEventListener('mouseenter', () => {
                button.style.textDecoration = 'underline';
                button.style.cursor = 'pointer';
            });
            button.addEventListener('mouseleave', () => {
                button.style.textDecoration = '';
                button.style.cursor = '';
            });

            // Click Handling
            button.addEventListener('click', () => {
                const name = document.querySelector('span.charname').innerText;

                const charChannels = localStorage.getItem(name + '.settings.recentChannels');
                const charPins = localStorage.getItem(name + '.settings.pinned');

                const clipboardChannels = localStorage.getItem('ccClipboard.channels');
                const clipboardPins = localStorage.getItem('ccClipboard.pins');

                if (btnName == 'Copy') {
                    if (charChannels == null) {
                        alert('This character does not have any channels saved,\nor does not belong to you.');
                    }
                    else {
                        localStorage.setItem('ccClipboard.channels', charChannels);
                        localStorage.setItem('ccClipboard.pins', charPins);
                        alert('Channel settings copied!');
                    }
                }
                if (btnName == 'Paste') {
                    localStorage.setItem(name + '.settings.recentChannels', clipboardChannels);

                    let charPinsParsed = JSON.parse(charPins);
                    let clipboardPinsParsed = JSON.parse(clipboardPins);

                    charPinsParsed.channels = clipboardPinsParsed.channels;
                    localStorage.setItem(name + '.settings.pinned', JSON.stringify(charPinsParsed));

                    alert('Channel settings imported!\nYou might need to refresh the chat page to see the changes.');
                }
            });

            // Add Button
            badges.appendChild(button);
        }

    });
})();