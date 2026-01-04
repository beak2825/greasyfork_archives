// ==UserScript==
// @name         Google Docs User Account Redirect
// @description  Redirect Google Docs to correct user Account
// @version      0.4
// @author       Torkelicous
// @icon         https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico
// @include      https://docs.google.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1403155
// @downloadURL https://update.greasyfork.org/scripts/547343/Google%20Docs%20User%20Account%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/547343/Google%20Docs%20User%20Account%20Redirect.meta.js
// ==/UserScript==

(function() {

    let wantedAccount = GM_getValue('wantedAccount', 1)
    let isUIVisible = GM_getValue('isUIVisible', true);
    let guiContainer;
    let toggleButton;

    // Check if we should show UI (not on document/d URLs)
    var currentUrl = window.location.href;
    var shouldShowUI = !currentUrl.includes('/document/d/');

    // Create toggle
function createToggleButton() {
    toggleButton = document.createElement('button');
    toggleButton.textContent = isUIVisible ? '➖' : '➕';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.left = '70px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.padding = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.backgroundColor = 'grey';
    toggleButton.style.border = '1px solid grey';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.fontSize = '16px';

        toggleButton.onclick = function() {
            if (isUIVisible) {
                guiContainer.style.display = 'none';
                toggleButton.textContent = '➕';
            } else {
                guiContainer.style.display = 'block';
                toggleButton.textContent = '➖';
            }
            isUIVisible = !isUIVisible;
            GM_setValue('isUIVisible', isUIVisible);
        };

        document.body.appendChild(toggleButton);
    }

    // GUI for wantedAccount
    function createGUI() {
        // Don't create UI if we're on a document/d URL
        if (!shouldShowUI) {
            return;
        }

        guiContainer = document.createElement('div');
        guiContainer.style.position = 'fixed';
        guiContainer.style.bottom = '10px';
        guiContainer.style.left = '110px';
        guiContainer.style.padding = '10px';
        guiContainer.style.backgroundColor = 'DarkGrey';
        guiContainer.style.border = '1px solid grey';
        guiContainer.style.zIndex = '1000';
        guiContainer.style.display = isUIVisible ? 'block' : 'none'; // Set initial display based on saved state

        const label = document.createElement('label');
        label.textContent = 'Account: ';
        guiContainer.appendChild(label);

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '9';
        input.style.width = '30px';
        input.value = wantedAccount;
        guiContainer.appendChild(input);

        const button = document.createElement('button');
        button.textContent = 'Save';
        button.style.marginLeft = '5px';
        button.onclick = function() {
            GM_setValue('wantedAccount', input.value);
            location.reload();
        };
        guiContainer.appendChild(button);
        document.body.appendChild(guiContainer);
        createToggleButton();
    }
    window.addEventListener('load', createGUI);

    // Redirect logic for Google Docs
    // Skip redirect if URL contains /document/d/ pattern
    if (currentUrl.includes('/document/d/')) {
        return;
    }

    var urlPattern = /^https:\/\/docs\.google\.com\/document\/u\/(\d+)\//;
    var match = currentUrl.match(urlPattern);

    if (match) {
        var currentAccount = match[1];
        if (currentAccount != wantedAccount) {
            var newUrl = currentUrl.replace(/\/u\/\d+\//, `/u/${wantedAccount}/`);
            window.location.replace(newUrl);
        }
    } else {
        // only if it's not a /document/d/ URL
        if (currentUrl.includes('docs.google.com/document/') &&
            !currentUrl.includes('/u/') &&
            !currentUrl.includes('/document/d/')) {
            var newUrl = currentUrl.replace('docs.google.com/document/', `docs.google.com/document/u/${wantedAccount}/`);
            window.location.replace(newUrl);
        }
    }

})();