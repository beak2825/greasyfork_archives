// ==UserScript==
// @name         ppv.land chat idiot hider
// @namespace    https://ppv.land/ft
// @version      1.3
// @description  Hide messages users with an editable block list
// @match        https://ppv.land/ft*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516081/ppvland%20chat%20idiot%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/516081/ppvland%20chat%20idiot%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initial array of usernames to hide
    let blockedUsers = ['BURTHURTS', 'Use comma separated names', 'like this']; // Default blocked usernames

    // Create and style the cogwheel icon
    const cogIcon = document.createElement('span');
    cogIcon.innerHTML = '⚙️';
    cogIcon.style.cursor = 'pointer';
    cogIcon.style.fontSize = '1.5em';
    cogIcon.style.position = 'absolute';
    cogIcon.style.right = '40px'; // Move the icon a bit to the left to avoid covering the send button
    cogIcon.style.top = '5px';

    // Add the cogwheel icon next to the message input area
    const messageInput = document.getElementById('message-input');
    messageInput.parentNode.style.position = 'relative';
    messageInput.parentNode.appendChild(cogIcon);

    // Create the popup form for editing blocked usernames
    const popupForm = document.createElement('div');
    popupForm.style.position = 'fixed';
    popupForm.style.top = '50%';
    popupForm.style.left = '50%';
    popupForm.style.transform = 'translate(-50%, -50%)';
    popupForm.style.backgroundColor = '#fff';
    popupForm.style.padding = '20px';
    popupForm.style.borderRadius = '8px';
    popupForm.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
    popupForm.style.zIndex = '1000';
    popupForm.style.display = 'none';

    // Add elements to the popup form
    popupForm.innerHTML = `
        <h3>Edit Blocked Users</h3>
        <textarea id="blockedUsersInput" rows="5" style="width: 100%;"></textarea>
        <button id="saveBlockedUsers" style="margin-top: 10px;">Save</button>
        <button id="cancelEdit" style="margin-left: 10px;">Cancel</button>
    `;

    document.body.appendChild(popupForm);

    // Show the popup form when the cog icon is clicked
    cogIcon.addEventListener('click', () => {
        document.getElementById('blockedUsersInput').value = blockedUsers.join(', ');
        popupForm.style.display = 'block';
    });

    // Hide the popup form and save changes when "Save" is clicked
    document.getElementById('saveBlockedUsers').addEventListener('click', () => {
        const input = document.getElementById('blockedUsersInput').value;
        blockedUsers = input.split(',').map(user => user.trim()); // Update blockedUsers array
        popupForm.style.display = 'none';
    });

    // Hide the popup form without saving when "Cancel" is clicked
    document.getElementById('cancelEdit').addEventListener('click', () => {
        popupForm.style.display = 'none';
    });

    // Function to hide messages from blocked users
    setInterval(() => {
        const messages = document.querySelectorAll('#message-list .message');

        messages.forEach(message => {
            blockedUsers.forEach(user => {
                if (message.innerHTML.includes(user)) {
                    message.style.display = 'none'; // Hide the message
                }
            });
        });
    }, 1000); // Check every second

})();
