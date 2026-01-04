// ==UserScript==
// @name         Google Classroom User Account Redirect
// @description  Redirect Google Classroom to correct user Account
// @version      0.3
// @author       Torkelicous
// @icon         https://www.gstatic.com/classroom/logo_square_rounded.svg
// @include      https://classroom.google.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1403155
// @downloadURL https://update.greasyfork.org/scripts/528115/Google%20Classroom%20User%20Account%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/528115/Google%20Classroom%20User%20Account%20Redirect.meta.js
// ==/UserScript==

(function() {


    let wantedAccount = GM_getValue('wantedAccount', 1)
    let isUIVisible = GM_getValue('isUIVisible', true);
    let guiContainer;
    let toggleButton;

    // Create toggle
    function createToggleButton() {
        toggleButton = document.createElement('button');
        toggleButton.textContent = isUIVisible ? '➖' : '➕';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '10px';
        toggleButton.style.right = '70px';
        toggleButton.style.zIndex = '1000';
        toggleButton.style.padding = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.backgroundColor = 'black';
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
        guiContainer = document.createElement('div');
        guiContainer.style.position = 'fixed';
        guiContainer.style.bottom = '10px';
        guiContainer.style.right = '110px';
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

    // Redirect logic
    var path0 = window.location.pathname;
    var path1 = path0.substring(0, 5);
    if (path1 != `/u/${wantedAccount}/`)
    {
        window.location.replace(`https://classroom.google.com/u/${wantedAccount}/`);
    }

})();