// ==UserScript==
// @name         Chess.com Agrega Titulo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Agrega Titulos de liga y enlaces a perfiles de jugadores en chess.com!
// @author Alexander Martínez González
// @include      https://www.chess.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/472818/Chesscom%20Agrega%20Titulo.user.js
// @updateURL https://update.greasyfork.org/scripts/472818/Chesscom%20Agrega%20Titulo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUsernames = ["Username", "Username", "Username"];

    function addGMTagToUser(usernameElement) {
        // Create the element to insert
        const newElement = document.createElement('a');
        newElement.href = 'https://www.chess.com/members/titled-players';
        newElement.target = '_blank';
        newElement.className = 'user-chess-title-component';
        newElement.textContent = 'CM';

        // Check if the new element is already present
        const existingElement = usernameElement.previousElementSibling;
        if (existingElement && existingElement.classList.contains('user-chess-title-component')) {
            return; // Skip this iteration if the element is already present
        }

        // Insert the new element before the username element
        usernameElement.parentNode.insertBefore(newElement.cloneNode(true), usernameElement);

        // Modify the profile card h1 element
        const profileH1 = usernameElement.closest('.profile-card-username');
        if (profileH1) {
            profileH1.innerHTML = `
                <a href="https://www.chess.com/members/titled-players" class="profile-card-chesstitle " v-tooltip="Candidate Master">
                    CM
                </a>
                ${usernameElement.textContent.trim()}
            `;
        }
    }

    function addGMTag() {
        const usernameElements = document.querySelectorAll('.user-username-component.user-username-white.user-username-link.user-tagline-username');

        usernameElements.forEach(usernameElement => {
            const username = usernameElement.textContent.trim();
            if (targetUsernames.includes(username)) {
                addGMTagToUser(usernameElement);
            }
        });
    }

    setInterval(() => {
        addGMTag();
    }, 100);

})();
