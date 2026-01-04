// ==UserScript==
// @name         Reddit old.reddit button
// @namespace    https://www.reddit.com
// @version      1.0
// @description  Add button to redirect post to old.reddit.com
// @author       Agreasyforkuser
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487248/Reddit%20oldreddit%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/487248/Reddit%20oldreddit%20button.meta.js
// ==/UserScript==

'use strict';

function changeUrl() {
    // Replace "www" or "new" with "old" in the current URL
    var oldUrl = window.location.href;
    var newUrl = oldUrl.replace(/www|new/, 'old');

    // Open the new URL in the same window
    window.location.href = newUrl;
}

function createChangeUrlButton() {
    var button = document.createElement('button');
    button.innerHTML = 'old.reddit';
    button.style.color = 'white';
    button.style.background = 'black';
    button.style.border = 'none';
    button.style.fontSize = 'inherit';
    button.style.zIndex = "9999999";
    button.style.position = "fixed";
    button.style.top = "0";
    button.onclick = changeUrl;

    // Add the button to the document body
    document.body.appendChild(button);
}

// Call the function to create the "Change URL" button
createChangeUrlButton();