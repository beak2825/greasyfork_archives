// ==UserScript==
// @name Tinychat Spam Filter
// @namespace tinychat-spam-blocker
// @description Automatically blocks and hides spam messages in the chatbox on tinychat.com
// @version 1.1
// @license CC0-1.0
// @author meth0dZ
// @grant none
// @run-at document-idle
// @match https://tinychat.com/room/*
// @downloadURL https://update.greasyfork.org/scripts/465742/Tinychat%20Spam%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/465742/Tinychat%20Spam%20Filter.meta.js
// ==/UserScript==
(function () {
	'use strict';
	// Maximum allowed messages per user during the specified interval
	const MAX_MESSAGES_PER_INTERVAL = 4;
	// Time interval in milliseconds for counting messages
	const INTERVAL_MS = 10000;
	// Maximum allowed repetitions of the same message per user
	const MAX_REPETITIONS = 2;
	// Map to store message counts for each user
	const messageCounts = new Map();
	// Map to store message history for each user
	const messageHistory = new Map();
	// Updates the message history for the specified user and message
	function updateMessageHistory(username, message) {
		const userMessageHistory = messageHistory.get(username) || new Map();
		const repetitions = (userMessageHistory.get(message) || 0) + 1;
		userMessageHistory.set(message, repetitions);
		messageHistory.set(username, userMessageHistory);
	}
	// Determines if the message is considered spam based on count and repetitions
	function isSpam(username, message) {
		const count = (messageCounts.get(username) || 0) + 1;
		if (count > MAX_MESSAGES_PER_INTERVAL) {
			return true;
		}
		messageCounts.set(username, count);
		setTimeout(() => messageCounts.set(username, count - 1), INTERVAL_MS);
		updateMessageHistory(username, message);
		const repetitions = messageHistory.get(username).get(message);
		if (repetitions > MAX_REPETITIONS) {
			return true;
		}
		setTimeout(() => {
			const userMessageHistory = messageHistory.get(username);
			userMessageHistory.set(message, repetitions - 1);
		}, INTERVAL_MS * 2);
		return false;
	}
	// Handles mutation events in the chat and hides messages considered spam
	function handleMutation(mutation) {
		if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
			return;
		}
		for (const addedNode of mutation.addedNodes) {
			if (addedNode.className === 'chat-message') {
				const username = addedNode.querySelector('.chat-username').textContent;
				const message = addedNode.querySelector('.chat-message-text').textContent;
				if (isSpam(username, message)) {
					addedNode.style.display = 'none';
				}
			}
		}
	}
	// Initializes the MutationObserver to watch for new chat messages
	function initializeObserver() {
		const observer = new MutationObserver(mutations => mutations.forEach(handleMutation));
		const chatWrapper = document.querySelector('#chat-wrapper');
		if (chatWrapper) {
			observer.observe(chatWrapper, {
				childList: true
			});
		} else {
			setTimeout(initializeObserver, 500);
		}
	}
	initializeObserver();
})();