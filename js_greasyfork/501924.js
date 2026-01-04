// ==UserScript==
// @name         Youtube Short2Watch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Open youtube short as regular video in new tab.
// @author       You
// @match        *://www.youtube.com/shorts/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/501924/Youtube%20Short2Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/501924/Youtube%20Short2Watch.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let buttonAdded = false;

    function redirectYouTube() {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.replace('/shorts/', '/watch?v='); // Corrected replacement string
        GM_openInTab(newUrl, { active: true, insert: true });
    }

    function addButton() {
        const existingContainer = document.getElementById('like-button');
        if (existingContainer && !buttonAdded) {
            const button = document.createElement('button');
            button.textContent = 'Watch';
            button.style.padding = '2px 3px';
            button.style.fontSize = '12px';
            button.style.fontWeight = 'bold';
            button.style.backgroundColor = '#606060'; // Red background color (you can change this)
            button.style.color = '#ffffff'; // White text color
            button.style.border = 'none';
            button.style.borderRadius = '1px';
            button.style.cursor = 'pointer';
            button.addEventListener('click', redirectYouTube);
            existingContainer.appendChild(button);
            buttonAdded = true;
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            addButton();
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });
})();