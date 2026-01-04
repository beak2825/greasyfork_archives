// ==UserScript==
// @name         Remove Live Chat from DingDingDing
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove chat iframe and chat widget div on dingdingding.com
// @author       Naesala
// @match        *://dingdingding.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523872/Remove%20Live%20Chat%20from%20DingDingDing.user.js
// @updateURL https://update.greasyfork.org/scripts/523872/Remove%20Live%20Chat%20from%20DingDingDing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the chat iframe and chat widget div
    function removeChatElements() {
        const iframe = document.getElementById('chat-widget-minimized');
        const chatWidgetDiv = document.getElementById('chat-widget-container');

        if (iframe) {
            console.log('Found iframe, removing...');
            iframe.remove(); // Remove the iframe
        }

        if (chatWidgetDiv) {
            console.log('Found chat widget container, removing...');
            chatWidgetDiv.remove(); // Remove the chat widget div
        }
    }

    // Create a MutationObserver to watch for new elements added to the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if the chat iframe or div with specific IDs are added to the DOM
                removeChatElements();
            }
        }
    });

    // Observe changes in the body of the page
    observer.observe(document.body, { childList: true, subtree: true });

    // Attempt to remove any iframe or div initially in case they're already loaded
    removeChatElements();
})();
