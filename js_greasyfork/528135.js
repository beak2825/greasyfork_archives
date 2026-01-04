// ==UserScript==
// @name         Cartel Empire: Add Attack Button to Player Page
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds an attack button that's always clickable and leads to an attack right away.
// @author       You
// @match        *://cartelempire.online/user/*
// @icon         https://i.imgur.com/PR2kala.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528135/Cartel%20Empire%3A%20Add%20Attack%20Button%20to%20Player%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/528135/Cartel%20Empire%3A%20Add%20Attack%20Button%20to%20Player%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract user ID from URL
    const userIdMatch = window.location.pathname.match(/\/user\/(\d+)/);
    if (!userIdMatch) return;
    const userId = userIdMatch[1];

    // Find the <th> with textContent "Status:"
    document.querySelectorAll('th').forEach(th => {
        if (th.textContent.trim() === "Status:") {
            // Create form element
            const form = document.createElement('form');
            form.className = 'modalDismissBtn';
            form.action = `/User/AttackPlayer/${userId}`;
            form.method = 'post';

            // Create button element
            const button = document.createElement('button');
            button.className = 'btn btn-success btn-sm';
            button.id = 'actionBtn';
            button.type = 'submit';
            button.textContent = 'Attack';

            // Replace <th> content
            form.appendChild(document.createTextNode('Status: '));
            form.appendChild(button);
            th.textContent = '';
            th.appendChild(form);
        }
    });
})();
