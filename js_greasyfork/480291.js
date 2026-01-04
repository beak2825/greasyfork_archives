// ==UserScript==
// @name         Kick Chatbot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Kick Chat bot for those streamers who provide tokens for chatting/viewing.
// @license MIT 
// @author       R3D
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480291/Kick%20Chatbot.user.js
// @updateURL https://update.greasyfork.org/scripts/480291/Kick%20Chatbot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        startRandomMessageTimer();
    };

    function startRandomMessageTimer() {
        // Function to generate a random number between min and max values
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        // Function to send a random chat message
        function sendRandomMessage() {
            // Get the message-input div
            var messageInputDiv = document.getElementById('message-input');

            // Array of possible messages
            var messages = [
                '<img :data-emote-name="OOOO" class="gc-emote-c" data-emote-id="37229" src="https://files.kick.com/emotes/37229/fullsize">',
                '<img :data-emote-name="emojiAngel" class="gc-emote-c" data-emote-id="1730752" src="https://files.kick.com/emotes/1730752/fullsize">',
                '<img :data-emote-name="kkHuh" class="gc-emote-c" data-emote-id="39261" src="https://files.kick.com/emotes/39261/fullsize">',
                '<img :data-emote-name="catblobDan" class="gc-emote-c" data-emote-id="37242" src="https://files.kick.com/emotes/37242/fullsize">',
                '<img :data-emote-name="RareCharm" class="gc-emote-c" data-emote-id="39281" src="https://files.kick.com/emotes/39281/fullsize">',
                '<img :data-emote-name="Bwop" class="gc-emote-c" data-emote-id="37217" src="https://files.kick.com/emotes/37217/fullsize">',
                '<img :data-emote-name="peepoDJ" class="gc-emote-c" data-emote-id="37245" src="https://files.kick.com/emotes/37245/fullsize">',
                '<img :data-emote-name="modCheck" class="gc-emote-c" data-emote-id="37244" src="https://files.kick.com/emotes/37244/fullsize">',
                '<img :data-emote-name="ditto" class="gc-emote-c" data-emote-id="39248" src="https://files.kick.com/emotes/39248/fullsize">',
                '<img :data-emote-name="duckPlz" class="gc-emote-c" data-emote-id="39262" src="https://files.kick.com/emotes/39262/fullsize">',
                '<img :data-emote-name="HYPERCLAPH" class="gc-emote-c" data-emote-id="39268" src="https://files.kick.com/emotes/39268/fullsize">'
            ];

            // Get a random message from the array
            var randomMessage = messages[Math.floor(Math.random() * messages.length)];

            messageInputDiv.click();
            // Simulate typing the random message using the typeText function
            messageInputDiv.innerHTML = randomMessage;

            // Wait for 3 seconds before hitting "Enter"
            setTimeout(function() {
                    // Simulate typing a new line
                    var enterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            keyCode: 13,
                            code: 'Enter',
                            which: 13,
                            bubbles: true,
                            cancelable: true
                    });
                        // Dispatch the enter event
                    messageInputDiv.dispatchEvent(enterEvent);
                    console.log('Message sent');
                }, 1000);
        }

        function initiateTimer() {
            var interval = getRandomInt(10000, 60000);
            console.log('Current Interval:', interval);

            setTimeout(function () {
                sendRandomMessage();

                initiateTimer();
            }, interval);
        }

        initiateTimer();
    }
})();
