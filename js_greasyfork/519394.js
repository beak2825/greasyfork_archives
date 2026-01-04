// ==UserScript==
// @name         CAI Left Panel&Voice Auto Hide
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @description  Hides left panel in chats&enables voice
// @author       LuxTallis
// @match        https://character.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519394/CAI%20Left%20PanelVoice%20Auto%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/519394/CAI%20Left%20PanelVoice%20Auto%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the button with the selector button.text-sm
    function clickButtonTextSm() {
        const button = document.querySelector('button.text-sm');
        if (button) {
            button.click();
            console.log('Button with selector "button.text-sm" found and clicked.');
        } else {
            console.log('Button with selector "button.text-sm" not found yet. Trying again.');
            setTimeout(clickButtonTextSm, 1000); // Retry after 1 second
        }
    }

    // Function to click the button with the selector #chat-header > div:nth-child(2) > button:nth-child(1)
    function clickChatHeaderButton() {
        const button = document.querySelector('#chat-header > div:nth-child(2) > button:nth-child(1)');
        if (button) {
            button.click();
            console.log('Button with selector "#chat-header > div:nth-child(2) > button:nth-child(1)" found and clicked.');
        } else {
            console.log('Button with selector "#chat-header > div:nth-child(2) > button:nth-child(1)" not found yet. Trying again.');
            setTimeout(clickChatHeaderButton, 1000); // Retry after 1 second
        }
    }

    // Launch both functions in parallel
    clickButtonTextSm();
    clickChatHeaderButton();
})();