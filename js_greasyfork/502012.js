// ==UserScript==
// @name         Microphone Double-Click Toggle
// @author       Bort
// @version      0.1
// @description  Toggle the microphone on double-click in Tinychat
// @match        https://tinychat.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/502012/Microphone%20Double-Click%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/502012/Microphone%20Double-Click%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let micOpen = false;
    const mainElement = document.querySelector("tinychat-webrtc-app").shadowRoot;
    const videoListElement = mainElement.querySelector("tc-videolist").shadowRoot;
    const micButton = videoListElement.querySelector("#videos-footer-push-to-talk");

    if (micButton) {
        micButton.addEventListener('dblclick', function() {
            micOpen = !micOpen;
            micButton.classList.toggle('mic-open', micOpen);
            micButton.classList.toggle('mic-closed', !micOpen);

            // Emulate a click event to toggle microphone state
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            micButton.dispatchEvent(event);

            if (micOpen) {
                console.log("Microphone opened.");
            } else {
                console.log("Microphone closed.");
            }
        });

        // Initial styles for feedback
        const style = document.createElement('style');
        style.innerHTML = `
            #videos-footer-push-to-talk.mic-open {
                background-color: red !important;
            }
            #videos-footer-push-to-talk.mic-closed {
                background-color: green !important;
            }
        `;
        document.head.appendChild(style);

        console.log("Microphone double-click toggle script initialized.");
    } else {
        console.error("Microphone button not found.");
    }
})();
