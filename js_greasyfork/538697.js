// ==UserScript==
// @name         AWBW Live League Opponent Name Hider
// @namespace    https://awbw.amarriner.com/
// @version      1.14
// @description  Hides opponents' names and elo. Primarily designed for Live League games, but works in any mode.
// @icon         https://awbw.amarriner.com/favicon.ico
// @author       lol
// @match        https://awbw.amarriner.com/game.php?games_id=*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/538697/AWBW%20Live%20League%20Opponent%20Name%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/538697/AWBW%20Live%20League%20Opponent%20Name%20Hider.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const profile = document.querySelector('#profile-menu > span[title]');
    if (!profile) return;

    const myName = profile.getAttribute('title').trim();
    if (!myName) return;

    document.querySelectorAll('.player-username a[title]').forEach(link => {
        const playerName = link.getAttribute('title').trim();
        if (!playerName || playerName === myName) return;

        const originalLink = link.cloneNode(true);
        const container = document.createElement('span');
        container.textContent = '[Reveal Name]';
        container.style.cursor = 'pointer';
        container.style.fontWeight = 'bold';
        container.style.textDecoration = 'underline';

        container.addEventListener('mouseenter', () => {
            container.style.color = '#ccc';
        });
        container.addEventListener('mouseleave', () => {
            container.style.color = '#fff';
        });
        container.addEventListener('click', () => {
            container.replaceWith(originalLink);
        });

        link.replaceWith(container);
    });

    function hideEventName() {
        const eventText = document.querySelector('.event-screen .event-text.bold');
        if (!eventText) return;

        const text = eventText.textContent.trim();
        const prefix = "It's now ";
        const suffix = "'s turn";

        if (text.startsWith(prefix) && text.endsWith(suffix)) {
            const name = text.slice(prefix.length, text.length - suffix.length).trim();
            if (name !== myName) {
                eventText.textContent = `${prefix}???${suffix}`;
            }
        }
    }

    const eventScreen = document.querySelector('.event-screen');
    if (eventScreen) {
        const observer = new MutationObserver(() => {
            const isVisible = getComputedStyle(eventScreen).display !== 'none';
            if (isVisible) {
                hideEventName();
            }
        });

        observer.observe(eventScreen, { attributes: true, attributeFilter: ['style'] });
    }
})();