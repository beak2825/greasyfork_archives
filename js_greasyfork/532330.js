// ==UserScript==
// @name         infinite craft crafter
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  ...
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532330/infinite%20craft%20crafter.user.js
// @updateURL https://update.greasyfork.org/scripts/532330/infinite%20craft%20crafter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GAME_URL = 'https://infinite-craft.com/recipes/';

    // Maak knop
    const button = document.createElement('div');
    button.innerText = '📚';
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '2px',
        left: '1488px',
        zIndex: '99999',
        backgroundColor: '#111',
        color: '#fff',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        userSelect: 'none',
    });
    document.body.appendChild(button);

    // Klik → open popup
    button.addEventListener('click', () => {
        window.open(GAME_URL, '_blank', 'width=1000,height=700');
    });
})();
