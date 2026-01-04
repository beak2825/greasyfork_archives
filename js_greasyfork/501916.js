// ==UserScript==
// @name        Mod Close Cam Add On For Bodega Bot
// @version     1.0.1
// @description Add-on for Bodega Bot to allow moderators to close other moderators' camera connections.
// @author      YourName
// @icon        https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif
// @match       https://tinychat.com/room/*
// @grant       none
// @require     https://greasyfork.org/scripts/501454/Bodega%20Bot.user.js
// @namespace https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/501916/Mod%20Close%20Cam%20Add%20On%20For%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/501916/Mod%20Close%20Cam%20Add%20On%20For%20Bodega%20Bot.meta.js
// ==/UserScript==

(function() {
    "use strict";

    //*********** CONFIG ***********

    var CFG = {
        ownerUsername: "thebodega", // The owner's username
    };

    //*********** HELPER FUNCTIONS ***********

    function relayCloseCommand(nickname) {
        // Function to relay the close command to the owner
        var message = `!relayclose ${nickname}`;
        // Send this message to the owner via the bot
        sendMessageToOwner(message);
    }

    function sendMessageToOwner(message) {
        // Function to send a message to the owner
        // Assumes a function sendBotMessage(username, message) is available
        // Replace the function name if the actual bot function is different
        BodegaBot.sendMessage(CFG.ownerUsername, message);
    }

    function closeCamera(nickname) {
        // Function to close the camera of the specified nickname
        // Assumes a function closeUserCamera(nickname) is available
        // Replace the function name if the actual bot function is different
        BodegaBot.closeUserCamera(nickname);
    }

    //*********** EVENT LISTENERS ***********

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            var inputField = document.querySelector('input'); // Adjust the selector as needed
            var inputValue = inputField.value.trim();

            if (inputValue.startsWith('!close ')) {
                var nickname = inputValue.split(' ')[1];
                if (nickname) {
                    relayCloseCommand(nickname);
                }
                inputField.value = ''; // Clear the input field
            } else if (inputValue.startsWith('!relayclose ')) {
                var nickname = inputValue.split(' ')[1];
                if (nickname && inputValue.includes(CFG.ownerUsername)) {
                    closeCamera(nickname);
                }
                inputField.value = ''; // Clear the input field
            }
        }
    });

    console.log('Bodega Bot Moderator Close Addon loaded.');
})();
