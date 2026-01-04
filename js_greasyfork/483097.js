// ==UserScript==
// @name         Chat Message Sender Duhh
// @namespace    Rishi Big Brain
// @version      0.2
// @description  Patrick
// @author       Rishi Sunak
// @match        kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483097/Chat%20Message%20Sender%20Duhh.user.js
// @updateURL https://update.greasyfork.org/scripts/483097/Chat%20Message%20Sender%20Duhh.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var messageToSend = "[emote:37231:PatrickBoo]";

    function typeMessage() {
        var chatInput = document.getElementById('message-input');

        if (chatInput) {
            var index = 0;

            function typeCharacter() {
                chatInput.innerText += messageToSend[index];
                index++;

                if (index === messageToSend.length) {
                    simulateEnterKey();
                } else {
                    setTimeout(typeCharacter, 100); // Adjust the typing speed (milliseconds per character)
                }
            }

            // Start typing
            typeCharacter();
        }
    }

    function simulateEnterKey() {
        var event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
            bubbles: true
        });

        var targetElement = document.getElementById('message-input');

        if (targetElement) {
            targetElement.dispatchEvent(event);
            setTimeout(typeMessage, 4200); // Adjust the delay between messages
        }
    }
    setTimeout(typeMessage, 2000);

})();
