// ==UserScript==
// @name         Replika Chatbox History
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Remembers and scroll through the last 10 entered in the chatbox using the up and down arrow keys
// @author       Nixsy
// @match        *://*/*
// @grant        none
// @license GPL 3
// @downloadURL https://update.greasyfork.org/scripts/484917/Replika%20Chatbox%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/484917/Replika%20Chatbox%20History.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const test = false;
    if (test) {
        console.log("Script started");
    }

    const maxEntries = 10;
    let chatHistory = [];
    let currentEntryIndex = 0; 

    function handleKeyPress(event) {
        if (event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'Enter') {
            console.log('key event :' + event.key);

            var chatbox = document.querySelector('#send-message-textarea');

            if (event.key == 'ArrowUp') {
                // Scroll up through history
                if (currentEntryIndex > 0) {
                    currentEntryIndex--;
                    chatbox.value = chatHistory[currentEntryIndex];
					chatbox.click()
					var e = new KeyboardEvent('keydown',{'keyCode':32,'which':32});
                    if (test) {
                        console.log('arrow up and current entry: ' + chatHistory[currentEntryIndex]);
                    }
                }
            } else if (event.key == 'ArrowDown') {
                // Scroll down through history
                if (currentEntryIndex < chatHistory.length - 1) {
                    currentEntryIndex++;
                    chatbox.value = chatHistory[currentEntryIndex];
					chatbox.click()
					var e = new KeyboardEvent('keydown',{'keyCode':32,'which':32});
                    if (test) {
                        console.log('arrow down and current entry: ' + chatHistory[currentEntryIndex]);
                    }
                } else {
                    // If at the latest message, clear the chatbox
                    currentEntryIndex = chatHistory.length;
                    chatbox.value = '';
                }
            } else if (event.key == 'Enter') {
                if (chatbox.value) {
                    console.log("chatbox isnt null")
                } else {
                    var chatbox = document.querySelector('#send-message-textarea');
					console.log('tried to refil chatbox content with: ' + chatbox.value)
                }
                if (test) {
                    console.log('enter pressed and this added to object :' + chatbox.value);
                }
                // Remember the current entry when Enter is pressed

                const currentEntry = chatbox.value;
                if (currentEntry !== '') {
                    if (chatHistory.length == maxEntries) {
                        chatHistory.shift(); // Remove the oldest entry if the history is full
                    }
                    chatHistory.push(currentEntry);
                    currentEntryIndex = chatHistory.length;
                    if (test) {
                        console.log('current entry : ' + currentEntry + ' current length:' + chatHistory.length);
                    }
                }
            }
        }
    }

    setTimeout(function () {
        const chatbox2 = document.querySelector('#send-message-textarea');
        if (chatbox2) {
            chatbox2.addEventListener('keydown', handleKeyPress);
            if (test) {
                console.log('Chatbox key event added');
            }

        } else {
            if (test) {
                console.log('Chatbox not found');
            }
        }
    }, 1000);
})();