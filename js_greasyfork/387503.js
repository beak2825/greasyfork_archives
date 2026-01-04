// ==UserScript==
// @name         John's erection
// @namespace    https://www.homestuck.com/
// @version      0.1
// @include      https://www.homestuck.com/*
// @description  John, you sly bastard...
// @author       seymour schlong
// @domain       www.homestuck.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387503/John%27s%20erection.user.js
// @updateURL https://update.greasyfork.org/scripts/387503/John%27s%20erection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let johnPhrases = [];
    let johnNames = ['john:', 'eb:', 'gt:', 'ceb:'];
    const chatLog = document.getElementsByClassName('o_chat-log')[0];
    let removedPhrase = '';

    // If there is a chat log on-screen,
    if (chatLog) {

        let chat = chatLog.getElementsByTagName('span');

        let isJohnThere = false;

        for (let msg of chat) {
            let content = msg.innerHTML;

            if (content.toLowerCase().startsWith(johnNames[0]) ||
            content.toLowerCase().startsWith(johnNames[1]) ||
            content.toLowerCase().startsWith(johnNames[2])) {
                isJohnThere = true;
                break;
            }

            isJohnThere = false;
        }

        if (!isJohnThere) return console.log('No John text found on page.');

        // For every message in the chat log,
        for (let i = 0; i < chat.length; i++) {
            // Create a variable of the message's content
            let msg = chat[i].innerHTML;

            // An array of the message's content
            let msgContent = msg.split(' ');

            // If the message starts with any of John's names
            if (johnNames.indexOf(msgContent[0].toLowerCase()) !== -1) {
                // Add it to the array of John's messages
                johnPhrases.push(msg);
            }
        }

        // Pick a random phrase to replace
        let randNum = Math.floor(Math.random() * johnPhrases.length);
        const newPhrase = johnPhrases[randNum].split(' ')[0] + ' i have an erection.';
        let index;

        for (let i = 0; i < chat.length; i++) {
            if (chat[i].innerHTML == johnPhrases[randNum]) {
                chat[i].id = 'erection';
                console.log(`Replaced line ${i} "${chat[i].innerHTML}"`);
                //chat[i].textContent = newPhrase;
                break;
            }
        }//*/

        let newStyle = document.createElement('style');
        newStyle.textContent = `#erection {\n\tword-spacing: -999px;\n\tletter-spacing: -999px;\n\tvisibility: hidden;\n}\n#erection::before {\n\tword-spacing: normal;\n\tletter-spacing: normal;\n\tvisibility: visible;\n\tcontent: "${newPhrase}";\n\ttransition: .5s;\n}\n#erection:hover::before {\n\tcontent: "${johnPhrases[randNum]}"\n}`;
        chatLog.appendChild(newStyle);
    }
})();