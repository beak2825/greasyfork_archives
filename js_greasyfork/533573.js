// ==UserScript==
// @name         Random Page Button Redux
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds a draggable, transparent button with bold white text that navigates to a random page, avoiding links with "delete", "report", "profile", "account", "terms", or "about".
// @author       You (Revised by AI)
// @match        *://*/*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/533573/Random%20Page%20Button%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/533573/Random%20Page%20Button%20Redux.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let offsetX, offsetY;
    let randomButton; // Declare button outside the function

    function getRandomPage() {
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="' + window.location.origin + '"]');
        const internalLinks = Array.from(links).filter(link => {
            // Exclude links that are likely anchors on the same page
            if (link.hash !== '' && link.href.startsWith(window.location.href + '#')) {
                return false;
            }
            // Exclude links whose text content (case-insensitive) contains specified words
            const lowerCaseText = link.textContent.toLowerCase();
            const excludedWords = ['about', 'account', 'accept', 'add', 'ago', 'api', 'ban', 'block', 'buy', 'cart', 'close', 'comment', 'comments', 'config', 'contact', 'create', 'delete', 'disable', 'download', 'edit', 'e-mail', 'email', 'enable', 'erase', 'favorite', 'follow', 'get a copy', 'help', 'inbox', 'install', 'jobs', 'join', 'language', 'leave', 'like', 'log', 'mailing', 'message', 'messages', 'modify', 'mute',
                                   'open', 'options', 'pay', 'policy', 'post', 'press', 'privacy', 'profile', 'publish', 'purchase', 'rate', 'register', 'remove', 'report', 'review', 'rules', 'settings', 'share', 'sign', 'subscribe', 'support', 'switch', 'terms', 'unfollow', 'update', 'user', 'vote', 'want to read', 'withdraw'];
            return !excludedWords.some(word => lowerCaseText.includes(word));
        });

        if (internalLinks.length > 0) {
            const randomIndex = Math.floor(Math.random() * internalLinks.length);
            const randomLink = internalLinks[randomIndex];
            window.location.href = randomLink.href;
        } else {
            alert("No suitable internal links found on this page.");
        }
    }

    function handleMouseDown(e) {
        isDragging = true;
        offsetX = e.clientX - randomButton.getBoundingClientRect().right;
        offsetY = e.clientY - randomButton.getBoundingClientRect().bottom;
        randomButton.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        randomButton.style.right = e.clientX - offsetX + 'px';
        randomButton.style.bottom = e.clientY - offsetY + 'px';
    }

    function handleMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        randomButton.style.cursor = 'pointer';
    }

    function addRandomButton() {
        randomButton = document.createElement('button');
        randomButton.textContent = 'Go to Random Page';
        randomButton.style.position = 'fixed';
        randomButton.style.bottom = '45px';
        randomButton.style.right = '20px';
        randomButton.style.zIndex = '9999'; // Ensure it's on bottom of other elements
        randomButton.style.backgroundColor = 'black'; // Keep the background transparent
        randomButton.style.border = '1px solid white'; // Add a subtle, semi-transparent border
        randomButton.style.borderRadius = '5px'; // Add a slight rounded corner
        randomButton.style.padding = '8px 12px'; // Adjust padding for a button feel
        randomButton.style.cursor = 'grab'; // Indicate it's draggable
        randomButton.style.fontSize = '1em'; // Optional: Adjust font size
        randomButton.style.color = 'white'; // Set the text color to white
        randomButton.style.fontWeight = 'bold'; // Make the text bold

        randomButton.addEventListener('click', getRandomPage);
        randomButton.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        document.body.appendChild(randomButton);
    }

    // Add the button after the page has fully loaded
    window.addEventListener('load', addRandomButton);
})();