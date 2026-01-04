// ==UserScript==
// @name         /coins
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  type "/coins" in the chat and it will show your coins without showing your profile! if you're a hacker or something you can hide your profile like this very good! :) BTW please subscribe to my YouTube channel! I worked 20 minutes for this!
// @author       youtube.com/@gamerluka1451
// @match        https://cellcraft.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cellcraft.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512852/coins.user.js
// @updateURL https://update.greasyfork.org/scripts/512852/coins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check coins and send them to the chat
function checkAndSendCoins() {
    const coinsElement = document.getElementById('coinsDash'); // Get the coins element
    const coins = coinsElement ? parseInt(coinsElement.innerText) : 0; // Get the coin count from the element

    const chatBox = document.getElementById('chtbox');

    if (chatBox) {
        // Check for the /coins command in the chat
        if (chatBox.value.trim() === '/coins') {
            // Prepare the message with the coin count
            const message = `You have ${coins} coins.`;
            chatBox.value = message; // Set the chat box to the message
            chatBox.dispatchEvent(new Event('input')); // Dispatch input event for chat to recognize it
            chatBox.form.dispatchEvent(new Event('submit')); // Trigger submit event to send the message

            // Clear the chat box after sending
            setTimeout(() => {
                chatBox.value = ''; // Clear chat input
            }, 100); // Delay to ensure the message is sent
        }
    }
}

// Function to check Recombine Pellets and send them to the chat
function checkAndSendRecs() {
    const recsElement = document.getElementById('invRecombine'); // Get the recombine pellets element
    const recs = recsElement ? parseInt(recsElement.querySelector('p').innerText) : 0; // Get the recs count from the element

    const chatBox = document.getElementById('chtbox');

    if (chatBox) {
        // Check for the /recs command in the chat
        if (chatBox.value.trim() === '/recs') {
            // Prepare the message with the recs count
            const message = `You have ${recs} Recombine Pellets.`;
            chatBox.value = message; // Set the chat box to the message
            chatBox.dispatchEvent(new Event('input')); // Dispatch input event for chat to recognize it
            chatBox.form.dispatchEvent(new Event('submit')); // Trigger submit event to send the message

            // Clear the chat box after sending
            setTimeout(() => {
                chatBox.value = ''; // Clear chat input
            }, 100); // Delay to ensure the message is sent
        }
    }
}

// Listen for input in the chat box
const chatBox = document.getElementById('chtbox');
if (chatBox) {
    chatBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            checkAndSendCoins(); // Check and send coins when Enter is pressed
            checkAndSendRecs(); // Check and send recs when Enter is pressed
        }
    });
}

})();