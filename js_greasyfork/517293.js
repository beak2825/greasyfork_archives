// ==UserScript==
// @name         Invite Button ft
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Adds a green invite button below the user's message, inviting them to a clan by making an API call directly (without showing profile card).
// @author       You
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517293/Invite%20Button%20ft.user.js
// @updateURL https://update.greasyfork.org/scripts/517293/Invite%20Button%20ft.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let authToken = null;

    // Create an XMLHttpRequest to intercept the API call to /v1/auth before the page loads
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();

        // Intercept the request before the page loads
        const originalOpen = xhr.open;
        xhr.open = function(method, url, async, user, password) {
            // Check if the request is to the /v1/auth endpoint
            if (url.includes('/v1/auth')) {
                const originalOnreadystatechange = xhr.onreadystatechange;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        // Check if the response contains the access token
                        if (response && response.session && response.session.access_token) {
                            authToken = response.session.access_token;
                            console.log('I FOUND THE TOKEN AHHHHHHHHHHH');
                            console.log('Captured authToken:', authToken);  // Log the token for verification
                        }
                    }
                    // Call the original onreadystatechange handler (if it exists)
                    if (originalOnreadystatechange) {
                        originalOnreadystatechange.apply(xhr);
                    }
                };
            }
            // Continue with the original open method
            originalOpen.apply(xhr, arguments);
        };

        return xhr;
    };

    // Function to create the invite button below the user's message
    function addInviteButtonToChat(chatMessage) {
        // Ensure the button is only added once per message
        if (chatMessage.querySelector('.chat-invite-button')) {
            return; // Exit if the button already exists
        }

        console.log('Adding button to message:', chatMessage);  // Debugging log for messages

        // Find the user's name and avatar
        const userNameElement = chatMessage.querySelector('.chat-message-default_user__uVNvH');
        const avatarElement = chatMessage.querySelector('.chat-message-default_avatar__eVmdi');
        const clanTagElement = chatMessage.querySelector('.chat-message-default_clan__t_Ggo');  // Selector for clan tag (if it exists)

        // If there is no user name or avatar, exit
        if (!userNameElement || !avatarElement) {
            return;
        }

        // Only add the invite button if there is NO clan tag
        if (clanTagElement) {
            return; // Exit if a clan tag exists
        }

        // Create the invite button
        const inviteButton = document.createElement('button');
        inviteButton.textContent = 'Invite';
        inviteButton.classList.add('chat-invite-button');
        inviteButton.style.backgroundColor = 'green';
        inviteButton.style.color = 'white';
        inviteButton.style.border = 'none';
        inviteButton.style.padding = '6px 12px';
        inviteButton.style.borderRadius = '5px';
        inviteButton.style.cursor = 'pointer';
        inviteButton.style.marginTop = '10px'; //Adjust to place the button below the message

        // Insert the invite button below the message (after the chat message body)
        const messageBody = chatMessage.querySelector('.chat-message-default_body__iFlH4');
        if (messageBody) {
            messageBody.appendChild(inviteButton);
        }

        // Bind click event to send API request to invite the user to the clan
        inviteButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the default action (which might be showing the profile card)

            try {
                // Get the user ID from the chat message's data-user-id attribute
                const userId = chatMessage.getAttribute('data-user-id');
                if (!userId) {
                    console.log('User ID not found!');
                    return;
                }

                // Check if authToken is available
                if (!authToken) {
                    console.log('Authorization token is missing!');
                    return;
                }

                // Construct the API URL with the user ID
                const apiUrl = `https://api.fishtank.live/v1/clans/MDE/members/${userId}`;

                // Send a POST request to invite the user to the clan
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`, // Add Authorization header with the token
                    },
                    body: JSON.stringify({
                        // Include any necessary data in the body of the request
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(`Successfully invited ${userId} to the clan!`);
                    } else {
                        console.log('Failed to invite the user:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error inviting user:', error);
                });
            } catch (error) {
                console.error('Error sending invite:', error);
            }
        });
    }

    // Check if the page has already loaded and if authToken is available
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Page loaded, checking for authToken...');

        // If the token is already available, proceed
        if (authToken) {
            console.log('authToken already available, starting button addition...');
            startAddingInviteButtons();
        } else {
            console.log('Waiting for authToken...');
            // If the token is not available, wait for the network request to finish
            const interval = setInterval(() => {
                if (authToken) {
                    clearInterval(interval);
                    console.log('authToken captured, starting button addition...');
                    startAddingInviteButtons();
                }
            }, 100); // Check every 100ms
        }
    });

    // Function to start adding invite buttons to chat messages
    function startAddingInviteButtons() {
        // MutationObserver to handle new chat messages
        const observer = new MutationObserver(() => {
            const chatMessages = document.querySelectorAll('.chat-message-default_chat-message-default__JtJQL');
            chatMessages.forEach(chatMessage => {
                addInviteButtonToChat(chatMessage);
            });
        });

        // Start observing for new chat messages
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial check for existing chat messages
        const initialChatMessages = document.querySelectorAll('.chat-message-default_chat-message-default__JtJQL');
        initialChatMessages.forEach(chatMessage => {
            addInviteButtonToChat(chatMessage);
        });
    }
})();
