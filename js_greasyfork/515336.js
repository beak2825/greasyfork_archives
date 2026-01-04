// ==UserScript==
// @name        Chat Fullscreen For fishtank.live
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Chat Fullscreen
// @author       Blungs
// @match        https://*.fishtank.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @license MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/515336/Chat%20Fullscreen%20For%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/515336/Chat%20Fullscreen%20For%20fishtanklive.meta.js
// ==/UserScript==

    //
    //
    //USE SHIFT + COMMAND + SPACE TO TOGGLE FULLSCREEN
    //
    //

(function() {
    'use strict';

// Function to toggle fullscreen for the chat element
function toggleFullscreen() {
    const chatElement = document.querySelector('.chat_chat__2rdNg');

    if (!chatElement) {
        console.log('Chat element not found');
        return;
    }

    if (!document.fullscreenElement) {
        // Enter fullscreen for the chat element
        chatElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen();
    }
}

// Event listener for keydown events
window.addEventListener('keydown', (event) => {
     if (event.shiftKey && event.code === 'Space' && event.metaKey) {
        event.preventDefault(); // Prevent default action
        toggleFullscreen();
    }
});

// Check for the chat element periodically
const checkInterval = setInterval(() => {
    const chatElement = document.querySelector('.chat_chat__2rdNg');
    if (chatElement) {
        clearInterval(checkInterval); // Stop checking once the element is found
        console.log('Chat element found');
    }
}, 500);

})();