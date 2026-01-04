// ==UserScript==
// @name         Steam Chat Message Logger (with Load More)
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Extract and save Steam friend chat messages to a file, even when the page has "Load more" button
// @author       Snabb
// @match        https://help.steampowered.com/en/accountdata/GetFriendMessagesLog
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533863/Steam%20Chat%20Message%20Logger%20%28with%20Load%20More%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533863/Steam%20Chat%20Message%20Logger%20%28with%20Load%20More%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cache the load more button element
    const loadMoreButton = document.querySelector('.AccountDataLoadMore');

    // Cache the last message
    let lastMessage = "";

    // Function to generate a hash for a message
    function hashMessage(sender, recipient, timeSent, message) {
        const messageString = `${sender}-${recipient}-${timeSent}-${message}`;
        let hash = 0;
        for (let i = 0; i < messageString.length; i++) {
            hash = (hash << 5) - hash + messageString.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    // Function to click the "Load more" button
    function clickLoadMore() {
        if (loadMoreButton) {
            loadMoreButton.click();
            return true; // Button found and clicked
        }
        return false; // No "Load more" button
    }

    // Function to extract and save chat messages
    function extractMessages() {
        let messages = [];
        // Keep track of hashed messages
        let seenHashes = new Set();
        // Cache the rows outside the loop
        let rows = document.querySelectorAll('tbody tr');
        let newLastMessage = "";

        rows.forEach((row, index) => {
            //query only once per row
            let columns = row.querySelectorAll('td');

            if (columns.length >= 4) {
                // Extracting the Sender, Recipient, Time Sent, and Message
                let sender = columns[0].textContent.trim();
                let recipient = columns[1].textContent.trim();
                let timeSent = columns[2].textContent.trim();
                let message = columns[3].textContent.trim();
                // Generate the hash
                const messageHash = hashMessage(sender, recipient, timeSent, message);
                // check if the message has been seen.
                if (!seenHashes.has(messageHash)) {
                    // Store the message in the array
                    messages.push(`${sender} -> ${recipient} (${timeSent}): ${message}`);
                    // Keep track of this message
                    seenHashes.add(messageHash);
                } else {
                    console.log("Duplicate message found:", sender, recipient, timeSent, message);
                }
                // Update last message, in the last row.
                if(index == rows.length-1){
                    newLastMessage = `${sender} -> ${recipient} (${timeSent}): ${message}`
                }
            }
        });

        // Compare the last messages
        if (lastMessage === newLastMessage) {
            console.log("No new messages found, end of history reached.");
            return;
        } else {
            lastMessage = newLastMessage;
        }

        // Convert the messages array to a string for downloading
        const messageText = messages.join('\n');
        const blob = new Blob([messageText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // Create a downloadable link
        const link = document.createElement('a');
        link.href = url;
        link.download = `steam_chat_log_${new Date().toISOString()}.txt`;
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
    }

    // Function to repeatedly load more messages until no more "Load more" button is found
    function loadAndExtract() {
        const MAX_ATTEMPTS = 24; // Maximum number of attempts
        let attempts = 0;
        let delay = 1000; // Start with a 1-second delay
        const maxDelay = 5000; // Maximum delay of 5 seconds
        let lastMessageCount = 0;
        let sameCountCount = 0;

        function tryLoadAndExtract() {
            // Check if the maximum amount of attempts has been reached
            if (attempts >= MAX_ATTEMPTS) {
                console.log(`Reached maximum attempts (${MAX_ATTEMPTS}). Stopping.`);
                extractMessages();
                return; // Stop trying to load more
            }
            const currentMessageCount = document.querySelectorAll('tbody tr').length;
            if (clickLoadMore()) {
                attempts++;
                console.log(`Clicked "Load more", attempt: ${attempts}`);

                // If message count has not changed, increase delay
                if (currentMessageCount === lastMessageCount) {
                    sameCountCount++;
                    delay = Math.min(delay + 500, maxDelay); // Increase by 500ms, up to 5 seconds
                    // Check if there is no new messages in the last 3 attempts.
                    if(sameCountCount >= 3) {
                        console.log("No new messages for 3 attempts, assuming end of chat history.");
                       extractMessages();
                       return;
                   }
                } else {
                    sameCountCount = 0; // Reset count
                    delay = 1000; // Reset delay if new messages loaded
                }
                lastMessageCount = currentMessageCount;

                setTimeout(tryLoadAndExtract, delay); // Use dynamic delay
            } else {
                // No more "Load more" button found, extract messages
                extractMessages();
            }
        }
        tryLoadAndExtract();
    }

    // Start the process of loading and extracting messages
    loadAndExtract();
})();