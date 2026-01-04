// ==UserScript==
// @name         Save & Submit keyboard shortcut for ChatGPT
// @description  Press Alt + Enter to auto-click the Save & Submit button for Superpower ChatGPT and OpenAI
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      0.6
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487834/Save%20%20Submit%20keyboard%20shortcut%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/487834/Save%20%20Submit%20keyboard%20shortcut%20for%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        // Check if Alt key is pressed along with Enter key
        if (event.altKey && event.keyCode == 13) {
            event.preventDefault();
            const save_submit_openAIButton = document.querySelector("div > button.btn.relative.btn-primary");
            const save_submit_superpowerChatGPTButton = document.querySelector("div > button.btn.flex.justify-center.gap-2.btn-primary");
            (save_submit_openAIButton || save_submit_superpowerChatGPTButton).click();
            event.stopPropagation();
        }
    }, true);
})();


/*

TODO: to make it easy to find for which operating mode the save_and_submit_button has become obsolete
detect if Superpower ChatGPT is enabled for Chrome and Firefox.

This only works for Chrome within a userscript:

const extensionId = 'amhmeenmapldpjdedekalnfifgnpfnkc';
const resourcePath = 'icons/info.png'; // This works
//const resourcePath = 'manifest.json'; // This doesn't work due to restrictions
const imgUrl = `chrome-extension://${extensionId}/${resourcePath}`;

fetch(imgUrl)
    .then(response => {
        if(response.ok) console.log('Extension installed:', true);
        else throw new Error('Resource not accessible');
    })
    .catch(error => console.log('Extension installed:', false));

Since Firefox doesn't have a similar method that I know of, it's better to
check for an element that has been injected by Superpower ChatGPT (Auto Sync ON/ OFF)
for both Chrome and Firefox.

*/
