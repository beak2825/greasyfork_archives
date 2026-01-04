// ==UserScript==
// @name         Kogama Logout Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a logout button for Kogama and checks for saved password
// @author       Your Name
// @match        *://www.kogama.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506405/Kogama%20Logout%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/506405/Kogama%20Logout%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a logout button
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.style.position = 'fixed';
    logoutButton.style.top = '10px';
    logoutButton.style.right = '10px';
    logoutButton.style.zIndex = '1000';
    logoutButton.style.padding = '10px';
    logoutButton.style.backgroundColor = '#ff0000';
    logoutButton.style.color = '#ffffff';
    logoutButton.style.border = 'none';
    logoutButton.style.borderRadius = '5px';
    logoutButton.style.cursor = 'pointer';

    document.body.appendChild(logoutButton);

    // Check if password is saved
    const isPasswordSaved = () => {
        const passwordField = document.querySelector('input[type="password"]');
        return passwordField && passwordField.value.length > 0;
    };

    // Logout function
    const logout = () => {
        if (isPasswordSaved()) {
            alert('You have a saved password. Logging out...');
        } else {
            alert('No saved password detected. Logging out...');
        }
        // Perform logout action
        window.location.href = 'https://www.kogama.com/logout/'; // Adjust the logout URL as necessary
    };

    // Add event listener to the button
    logoutButton.addEventListener('click', logout);
})();
