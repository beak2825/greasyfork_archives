// ==UserScript==
// @name         Crazy games button
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  A always visible button to open crazy games it is on the bottom left.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532317/Crazy%20games%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/532317/Crazy%20games%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GAME_URL = 'https://www.crazygames.com/game/tunnel-rush';

    // Maak knop
    const button = document.createElement('div');
    button.innerText = '🎮';
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
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
