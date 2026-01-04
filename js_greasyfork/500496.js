// ==UserScript==
// @name         Digitalcore.club - Torrent Link Modifier
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1
// @description  Adds your passkey to the torrent button in the lists, so you can add to remote torrent clients without cookies.
// @match        *://digitalcore.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digitalcore.club
// @grant        GM_setValue
// @grant        GM_getValue

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500496/Digitalcoreclub%20-%20Torrent%20Link%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/500496/Digitalcoreclub%20-%20Torrent%20Link%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to open settings page
    function openSettings() {
        const settingsWindow = window.open('', '', 'width=300,height=200');
        settingsWindow.document.write('<h1>Settings</h1>');
        settingsWindow.document.write('<label for="passkey">Enter Passkey:</label><br>');
        settingsWindow.document.write('<input type="text" id="passkey" name="passkey" value="' + GM_getValue('passkey', '') + '"><br>');
        settingsWindow.document.write('<input type="button" value="Save" id="saveButton">');
        settingsWindow.document.write('<input type="button" value="Close" id="closeButton">');
        settingsWindow.document.getElementById('saveButton').addEventListener('click', function() {
            const passkey = settingsWindow.document.getElementById('passkey').value;
            if (passkey && passkey.length === 32) {
                GM_setValue('passkey', passkey);
                alert('Passkey saved.');
            } else {
                alert('Invalid passkey. It should be a 32 character string.');
            }
        });
        settingsWindow.document.getElementById('closeButton').addEventListener('click', function() {
            settingsWindow.close();
        });
    }

    // Function to modify links
    function modifyLinks() {
        const passkey = GM_getValue('passkey', '');
        if (!passkey) return;

        const torrentsTable = document.querySelector('[torrents="vm.torrents"]');
        if (torrentsTable) {
            const links = torrentsTable.querySelectorAll('a[href^="/api/v1/torrents/download/"]');
            links.forEach(link => {
                link.href += `/${passkey}`;
            });
        }
    }

    // Create a floating button for opening settings
    const btn = document.createElement('button');
    btn.textContent = 'Settings';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '9999';
    btn.onclick = openSettings;
    document.body.appendChild(btn);

    // Create a mutation observer to handle dynamic content
    const observer = new MutationObserver(modifyLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    // Modify existing links on page load
    modifyLinks();
})();
