// ==UserScript==
// @name         WhatsApp Hide Chat List
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      GNU GPLv3
// @description  Hide WhatsApp Web chat list
// @author       imxitiz
// @match        https://web.whatsapp.com/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/490814/WhatsApp%20Hide%20Chat%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/490814/WhatsApp%20Hide%20Chat%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hasInitialized = false;
    const hideThreshold = 20;
    let eventParent;

    // Update chat list visibility
    function updateChatListVisibility() {
        const chatList = document.querySelector("div._aigv:nth-child(3)");
        const headerElement = document.querySelector(".x1pl83jw");

        if (chatList) {
            if (!hasInitialized) {
                chatList.style.display = 'flex';
                chatList.style.flex = '0 0';
                chatList.style.maxWidth = '80%';
                chatList.style.width = '0%';
                chatList.style.transition = 'width .5s ease-out 0s';

                headerElement.style.paddingLeft = '0px';
                headerElement.style.transition = 'all .5s ease-out 0s';

                hasInitialized = true;
            }
            const isMouseOverElement = isMouseOver(chatList);

            if (isMouseOverElement || eventParent.clientX <= hideThreshold) {
                // Show
                chatList.style.width = '100%';
                headerElement.style.paddingLeft = '16px';
            } else {
                // Hide
                chatList.style.width = '0%';
                headerElement.style.paddingLeft = '0px';
            }
        }
    }

    // Check if mouse is over the element or its children
    function isMouseOver(element) {
        return element.contains(eventParent.target);
    }

    // Set up MutationObserver
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                // If there are added nodes, update the element visibility
                if (mutation.addedNodes.length > 0) {
                    updateChatListVisibility();
                }
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialize the script
    function init() {
        document.addEventListener('mousemove', function (event) {
            eventParent = event;
            updateChatListVisibility(event);
        });
        document.addEventListener('mouseleave', updateChatListVisibility);
    }

    init();
})();
