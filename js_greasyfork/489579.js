// ==UserScript==
// @name         Free PXP Moderator
// @namespace    Hidden
// @version      1.0.1
// @description  Allows for all the moderator tools to be accessed with the use of the PixelPlace API.
// @author       Realwdpcker/Lunath
// @match        https://pixelplace.io/*
// @icon         https://pixelplace.io/img/badges/moderator.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @license      BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/489579/Free%20PXP%20Moderator.user.js
// @updateURL https://update.greasyfork.org/scripts/489579/Free%20PXP%20Moderator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and append the Accounts button
    function createAccountsButton() {
        // Create Accounts button element
        var accountsButton = $('<button/>', {
            text: 'ACCOUNTS',
            class: 'inline btn-accounts-user',
            style: 'background-color: #2bbb11; color: white; margin-right: 10px;',
            click: function() {
                openAccountsWindow();
            }
        });

        // Append Accounts button to the specified element
        $('#profile .box-x .box-content-x div #form-friends.text-center').append(accountsButton);
    }

    // Function to create and append the Chat Ban button
    function createChatBanButton() {
        // Create Chat Ban button element
        var chatBanButton = $('<button/>', {
            text: 'MUTE',
            class: 'inline btn-chat-ban-button',
            style: 'background-color: #2bbb11; color: white; margin-right: 10px;',
            click: function() {
                // Implement the behavior for the Chat Ban button if needed
                const input = prompt('Enter mute reason');
                if (input !== null) {
        prompt('Enter mute duration');
                    if (input !== null) {
                        alert('Error');
    }}
            }
        });

        // Append Chat Ban button to the specified element
        $('#profile .box-x .box-content-x div #form-friends.text-center').append(chatBanButton);
    }

    // Function to create and append the Chat Ban button
    function createAlertButton() {
        // Create Chat Ban button element
        var alertButton = $('<button/>', {
            text: 'ALERT',
            class: 'inline btn-alert-button',
            style: 'background-color: #2bbb11; color: white; margin-right: 10px;',
            click: function() {
                // Implement the behavior for the Chat Ban button if needed
                const input = prompt('Enter alert message');
                if (input !== null) {
        alert('Error');
    }
            }
        });

        // Append Chat Ban button to the specified element
        $('#profile .box-x .box-content-x div #form-friends.text-center').append(alertButton);
    }

    // Function to create and append the Chat Ban button
    function createDisableButton() {
        // Create Chat Ban button element
        var disableButton = $('<button/>', {
            text: 'DISABLE',
            class: 'inline btn-disable-button',
            style: 'background-color: #2bbb11; color: white; margin-right: 10px;',
            click: function() {
                // Implement the behavior for the Chat Ban button if needed
                const input = prompt('Enter disable reason');
                if (input !== null) {
        alert('Error');
                }
            }
        });

        // Append Chat Ban button to the specified element
        $('#profile .box-x .box-content-x div #form-friends.text-center').append(disableButton);
    }

    function createCoinsButton() {
        // Create Chat Ban button element
        var coinsButton = $('<button/>', {
            text: 'COINS',
            class: 'inline btn-coins-button',
            style: 'background-color: #2bbb11; color: white;',
            click: function() {
                // Implement the behavior for the Chat Ban button if needed
                const input = prompt('Enter amount of coins');
                if (input !== null) {
        alert('Error');
                }
            }
        });

        // Append Chat Ban button to the specified element
        $('#profile .box-x .box-content-x div #form-friends.text-center').append(coinsButton);
    }
    // Function to open a new window with a CSS grid layout for accounts
    function openAccountsWindow() {
        // Example CSS grid layout
        var gridLayout = `
            <div style="display: grid; grid-template-columns: grid-template-rows:120px; gap: 10px;">
                <div style="padding: 10px;">0 account(s) found</div>
            </div>
        `;

        // Open a new window with the CSS grid layout
        var newWindow = window.open('', 'Accounts Layout', 'width=600,height=400');
        newWindow.document.body.innerHTML = gridLayout;
    }

    // Wait for the specified element to be available then create the buttons
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if ($(mutation.target).find('#profile .box-x .box-content-x div #form-friends.text-center').length > 0) {
                observer.disconnect();
                createAccountsButton();
                createChatBanButton();
                createAlertButton();
                createDisableButton();
                createCoinsButton();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();