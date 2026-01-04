// ==UserScript==
// @name         Connected Users
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Shows the amount of connected users next to the amount of all users
// @author       guildedbird & azti
// @match        https://pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531585/Connected%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/531585/Connected%20Users.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let canvasTotal = null;
    let lastUserTotal = null;
    let lastDisplay = '';

    function update(force = false) {
        const value1 = document.querySelector('#chat .online span.value');
        const value2 = document.querySelector('span.sub-value');

        if (!value1 || !value2) return;

        const titleText = value1.title;
        const matchUserTotal = titleText.match(/^\d+/);
        const matchCanvasTotal = titleText.match(/\s\d+/);

        if (!matchUserTotal) return;

        const currentUserTotal = parseInt(matchUserTotal[0]);

        if (canvasTotal === null && matchCanvasTotal) {
            canvasTotal = parseInt(matchCanvasTotal[0].trim());
        }

        const newDisplay = (() => {
            let result = `${currentUserTotal}`;
            if (canvasTotal && canvasTotal > 0) {
                result += ` & ${canvasTotal}`;
            }
            return `(${result})`;
        })();

        if (force || currentUserTotal !== lastUserTotal || newDisplay !== lastDisplay) {
            value2.textContent = newDisplay;
            value2.style.setProperty('display', 'inline', 'important');
            value2.style.setProperty('color', '#b3b3b3', 'important');

            lastUserTotal = currentUserTotal;
            lastDisplay = newDisplay;
        }
    }

    function updateCanvasTotal() {
        const players = document.querySelectorAll('.players-list .player');
        const newTotal = players.length;

        if (newTotal !== canvasTotal) {
            canvasTotal = newTotal;
            update(true);
        }
    }

    function observeSubValue() {
        const value2 = document.querySelector('span.sub-value');
        if (value2) {
            const observer = new MutationObserver(() => {
                value2.style.setProperty('display', 'inline', 'important');
                value2.style.setProperty('color', '#b3b3b3', 'important');
            });
            observer.observe(value2, { attributes: true, attributeFilter: ['style'] });
        }
    }

    update();
    observeSubValue();

    const chatElement = document.querySelector('#chat .online');
    if (chatElement) {
        const observer = new MutationObserver(() => {
            const value1 = document.querySelector('#chat .online span.value');
            if (value1) update();
        });
        observer.observe(chatElement, { childList: true, subtree: true, attributes: true });
    }

    const playerListElement = document.querySelector('.players-list');
    if (playerListElement) {
        const observer2 = new MutationObserver(() => {
            updateCanvasTotal();
        });
        observer2.observe(playerListElement, { childList: true, subtree: true, attributes: true });
    }
})();