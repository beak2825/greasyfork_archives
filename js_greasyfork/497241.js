// ==UserScript==
// @name         Drawaria Blue Links enabler!
// @namespace    http://tampermonkey.net/
// @version      2024-06-05
// @description  changes the text color of that message to blue, makes the text clickable!
// @author       YouTube Drawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497241/Drawaria%20Blue%20Links%20enabler%21.user.js
// @updateURL https://update.greasyfork.org/scripts/497241/Drawaria%20Blue%20Links%20enabler%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a string contains a URL
    function isUrl(string) {
        const urlRegex = /(http|https):\/\/[^\s]+/g;
        return urlRegex.test(string);
    }
// Function to handle new chat messages
function handleNewMessage(message) {
    const chatbox = document.getElementById('chatbox_messages');
    let messageText = message.innerText;

    // Eliminar el nombre del jugador del mensaje
    const playerNameElement = message.querySelector('.playerchatmessage-selfname');
    if (playerNameElement) {
        messageText = messageText.replace(playerNameElement.innerText, '').trim();
    }

    // Check if the message contains a URL
    if (isUrl(messageText)) {
        // Set the value of the chatbox to the URL
        chatbox.value = messageText;
        // Set the color to blue
        chatbox.style.color = 'blue';
        // Make the text clickable
        chatbox.style.cursor = 'pointer';
        // Add an event listener for the click event
        chatbox.addEventListener('click', function() {
            window.open(messageText, '_blank');
        });
    }
}

    // Add an event listener for new chat messages
    const chatMessages = document.getElementById('chatbox_messages');
    chatMessages.addEventListener('DOMNodeInserted', (event) => {
        if (event.target.classList.contains('chatmessage')) {
            handleNewMessage(event.target);
        }
    });
})();