// ==UserScript==
// @name         Chess.com Add GM Tag
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add GM tags to all your opponents in chess.com!
// @author       Anonymous
// @include      https://www.chess.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/469540/Chesscom%20Add%20GM%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/469540/Chesscom%20Add%20GM%20Tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

function addGMTag() {
    const usernameElements = document.querySelectorAll('.user-username-component.user-username-white.user-username-link.user-tagline-username');

    // Create the element to insert
    const newElement = document.createElement('a');
    newElement.href = 'https://www.chess.com/members/titled-players';
    newElement.target = '_blank';
    newElement.className = 'user-chess-title-component';
    newElement.textContent = 'GM';

    // Insert the new element before each username element
    usernameElements.forEach(usernameElement => {
        // Check if the new element is already present
        const existingElement = usernameElement.previousElementSibling;
        if (existingElement && existingElement.classList.contains('user-chess-title-component')) {
            return; // Skip this iteration if the element is already present
        }

        // Insert the new element before the username element
        usernameElement.parentNode.insertBefore(newElement.cloneNode(true), usernameElement);
    });
}

setInterval(() => {
    addGMTag()
}, 100);

})();