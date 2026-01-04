// ==UserScript==
// @name         Read Messages Quietly
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      1.0
// @description  reads message quietly
// @author       kloob
// @match        https://www.gaiaonline.com/profile/privmsg.php
// @match        https://www.gaiaonline.com/profile/privmsg.php?folder=inbox&start=*
// @grant        GM_xmlhttpRequest
// @connect      www.gaiaonline.com
// @connect      modbook.gaiaonline.com
// @downloadURL https://update.greasyfork.org/scripts/491661/Read%20Messages%20Quietly.user.js
// @updateURL https://update.greasyfork.org/scripts/491661/Read%20Messages%20Quietly.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';
    fontAwesomeLink.rel = 'stylesheet';
    document.head.appendChild(fontAwesomeLink);

    // Function to modify the URL and add a custom parameter
    function modifyUrl(id) {
        return `https://www.gaiaonline.com/profile/privmsg.php?folder=inbox&mode=quote&id=${id}&autoClick=true`;
    }

    // Function to automatically click the target button on the new page
    function autoClickTargetButton() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('autoClick') === 'true') {
            const targetButton = document.querySelector('#btn_preview');
            if (targetButton) targetButton.click();
        }
    }

    // Function to insert and vertically center buttons in the last cell of table rows for unread messages
    function insertButtonForUnreadMessages(unreadMessageIds) {
        const tableRows = document.querySelectorAll('tr');
        tableRows.forEach((row) => {
            const link = row.querySelector('a.topictitle');
            if (!link) return;

            const messageIdMatch = link.href.match(/id=(\d+\.\d+)/);
            const messageId = messageIdMatch ? messageIdMatch[1] : null;

            if (!messageId || unreadMessageIds.indexOf(messageId) === -1) return;

            // Create a new cell for the button
            const buttonCell = document.createElement('td');
            buttonCell.style.width = '40px'; // Adjust the width as needed to fit the button

            const button = document.createElement('button');
            button.style.padding = '5px 10px';

            // Add Font Awesome Icon
            const icon = document.createElement('i');
            icon.className = "fa-solid fa-eye-slash";
            button.appendChild(icon);

            button.addEventListener('click', function(event) {
                event.preventDefault();
                const newTab = window.open(modifyUrl(messageId), '_blank');
                newTab.focus();
            });

            buttonCell.appendChild(button);
            row.appendChild(buttonCell);
        });
    }

    // Function to fetch unread messages from the external JSON source
    function fetchUnreadMessages() {
        const url = 'https://www.gaiaonline.com/chat/gsi/index.php?v=json&m=[[19006,[]]]';

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const jsonData = JSON.parse(response.responseText);
                let unreadMessages = jsonData[0][2].Inbox;
                let unreadMessageIds = Object.keys(unreadMessages).filter(id => {
                    return unreadMessages[id].status === '1'; // Only consider messages with status '1'
                });

                insertButtonForUnreadMessages(unreadMessageIds);
            },
            onerror: function(error) {
                console.error('Error fetching JSON data:', error);
            }
        });
    }

    // Initialize the script
    fetchUnreadMessages();
    autoClickTargetButton();
})();
