// ==UserScript==
// @name         FishTank chat filter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes duplicate messages, messages that have too many repetitious strings, and item usages.
// @author       Stan
// @match        https://www.fishtank.live/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515791/FishTank%20chat%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/515791/FishTank%20chat%20filter.meta.js
// ==/UserScript==

function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    callback(element);
                    break
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function cleanupMessage(message) {
    return message.toLowerCase().trim().replace(/[^a-zA-Z0-9\s]/g, '');
}

// Returns true if any word is repeated more than `maxRepeats` times.
function containsRepetitiousWords(message, maxRepeats = 4) {
    const words = message.split(' ');
    const wordCounts = {};
    // Check for repeated words
    for (const word of words) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
        if (wordCounts[word] > maxRepeats)
            return true;
    }
    return false;
}

// Returns true if any sub-string is repeated more than `maxRepeats` times.
function containsRepetitiousStrings(message, maxRepeats = 10) {
    for (let i = 0; i < message.length - 1; i++) {
        for (let j = i + 1; j < message.length; j++) {
            const substring = message.substring(i, j + 1);
            if (message.split(substring).length - 1 > maxRepeats)
                return true;
        }
    }
    return false;
}

const previousMessageByUserMap = {}; // Stores last message per user

// Returns true if the previous message and current message's unique words overlap more than `maxSimilarity`.
function isTooSimilarToPreviousMessage(message, user, maxSimilarity = 80) {
    const previousMessage = previousMessageByUserMap[user];
    if (!previousMessage)
        return false;
    const currentWords = new Set(message.split());
    const previousWords = new Set(previousMessage.split());
    const intersection = new Set([...currentWords].filter(word => previousWords.has(word)));
    const similarity = (intersection.size / Math.max(currentWords.size, previousWords.size)) * 100;
    return similarity > maxSimilarity;
}

// Hides the message
function remove(messageDiv) {
    messageDiv.style.display = "none";
}

function messageFilter(mutations) {
    const myUserId = document
        .querySelector(".top-bar-user_display-name__bzlpw")
        .getAttribute('data-user-id')

    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const messageDiv = node.querySelector('.chat-message-default_message__milmT');
                if (messageDiv) {
                    const userId = node.getAttribute('data-user-id');
                    if (userId !== myUserId) {
                        const messageText = cleanupMessage(messageDiv.textContent);
                        const wordSpam = containsRepetitiousWords(messageText)
                        const gibberish = containsRepetitiousStrings(messageText)
                        const repeat = isTooSimilarToPreviousMessage(messageText, userId);
                        if (wordSpam || gibberish || repeat) {
                            remove(node);
                            console.log(`Filtered message(spam="${wordSpam}", gibberish="${gibberish}", repeat="${repeat}"): "${messageText}" from ${userId || 'Unknown User'}`);
                        } else {
                            console.log('Setting previous message for "${userId}" to "${messageText}');
                            previousMessageByUserMap[userId] = messageText; // Update last message for user
                        }
                    }
                } else {
                    if (node.classList.contains("chat-message-happening_chat-message-happening__tYeDU")) {
                        remove(node)
                        console.log("Filtered out item usage spam")
                    }
                }
            }
        });
    });
}

(function () {
    'use strict';
    waitForElement("#chat-messages", chatContainer => {
        console.log("Detected chat-container, registering message filter.")
        let observer = new MutationObserver(messageFilter);
        observer.observe(chatContainer, { childList: true});
    })
})();