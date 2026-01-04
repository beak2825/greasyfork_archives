// ==UserScript==
// @name        Notify Destiny Message
// @namespace   Violentmonkey Scripts
// @description  Plays a sound or notifies when a div with data-username="destiny" is created
// @match       https://www.destiny.gg/*
// @grant       none
// @icon        https://cdn.destiny.gg/2.49.0/emotes/6296cf7e8ccd0.png
// @version     1.0
// @author      Walamo15
// @description 1/24/2025, 12:12:39 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525120/Notify%20Destiny%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/525120/Notify%20Destiny%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of usernames to monitor
    const usernamesToMonitor = ['destiny', 'EXAMPLEUSERNAME2','EXAMPLEUSERNAME']; // Add more usernames as needed

      // Function to handle new matching divs
    function handleNewDiv(div, username) {
        const messageText = div.querySelector(".text")?.textContent.trim() || "No message content";

        // console.log(`New message from ${username}: ${messageText}`);

        // Show browser notification
        if (Notification.permission === "granted") {
            new Notification(`New message from ${username}!`, {
                body: messageText,
                icon: "https://cdn.destiny.gg/emotes/649f7adb5746a.png" // Replace with a relevant icon URL
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(`New message from ${username}!`, {
                        body: messageText,
                        icon: "https://via.placeholder.com/150"
                    });
                }
            });
        }
    }

    // MutationObserver to detect new divs
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                      //  console.log("Node detected:", node); // Log the added node

                        // Check if the node has the expected classes
                        if (
                            node.classList.contains('msg-chat') &&
                            node.classList.contains('msg-user')
                        ) {
                            const username = node.getAttribute('data-username');
                            //console.log("Checking username:", username); // Log the username detected

                            // Convert username to lowercase for case-insensitive comparison
                            if (usernamesToMonitor.includes(username.toLowerCase())) {
                                handleNewDiv(node, username);
                            }
                        }

                        // Check if the node contains a .text element inside it
                        const textElement = node.querySelector('.text');
                        if (textElement) {
                          //  console.log("Found message text:", textElement.textContent); // Log message text content
                            const username = node.getAttribute('data-username');

                            // Convert username to lowercase for case-insensitive comparison
                            if (usernamesToMonitor.includes(username.toLowerCase())) {
                                handleNewDiv(node, username);
                            }
                        }
                    }
                });
            }
        });
    });

    // Start observing the document body or a specific container for added nodes
    const chatContainer = document.querySelector('#chat-output-frame'); // Update to the correct container ID
    if (chatContainer) {
   //     console.log("Chat container found, starting observer.");
        observer.observe(chatContainer, { childList: true, subtree: true });
    } else {
     //   console.log("Chat container not found. Make sure the selector is correct.");
    }
})();
