// ==UserScript==
// @name         Cartel Empire: Add Attack Button to Friends Page
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add an attack button to the friends menu if they are out of hospital
// @author       echotte
// @include      https://cartelempire.online/Connections*
// @icon         https://i.imgur.com/PR2kala.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528137/Cartel%20Empire%3A%20Add%20Attack%20Button%20to%20Friends%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/528137/Cartel%20Empire%3A%20Add%20Attack%20Button%20to%20Friends%20Page.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.querySelectorAll('a.fw-bold[href^="/user/"]').forEach(aTag => {
        const userIdMatch = aTag.href.match(/\/user\/(\d+)/);
        if (userIdMatch) {
            const userId = userIdMatch[1];

            // Find the parent div
            const parentDiv = aTag.closest('div');
            if (parentDiv) {


                const nextDiv = parentDiv.nextElementSibling;

                // Create button
                const button = document.createElement('button');
                button.className = 'btn btn-sm ms-3';
                button.type = 'submit';
                button.textContent = 'Attack';

                if (nextDiv && nextDiv.textContent.trim() === "Active") {
                    button.classList.add('btn-success')
                } else {
                    button.classList.add('btn-danger')
                }

                // Create form
                const form = document.createElement('form');
                form.className = 'modalDismissBtn';
                form.action = `/User/AttackPlayer/${userId}`;
                form.method = 'post';

                // Move contents into form
                while (parentDiv.firstChild) {
                    form.appendChild(parentDiv.firstChild);
                }

                // Append button to form
                form.appendChild(button);

                // Replace parent div content with form
                parentDiv.appendChild(form);

                
            }
        }
    });
})();
