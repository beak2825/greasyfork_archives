// ==UserScript==
// @name         Backloggd ➜ Botones: Gameplay YouTube + HowLongToBeat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Añade botones de gameplay en YouTube y duración en HowLongToBeat en el sidebar de Backloggd
// @match        https://backloggd.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543193/Backloggd%20%E2%9E%9C%20Botones%3A%20Gameplay%20YouTube%20%2B%20HowLongToBeat.user.js
// @updateURL https://update.greasyfork.org/scripts/543193/Backloggd%20%E2%9E%9C%20Botones%3A%20Gameplay%20YouTube%20%2B%20HowLongToBeat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const insertButtons = () => {
        const titleEl = document.querySelector('h1');
        const sidebar = document.querySelector('.side-section');

        if (!titleEl || !sidebar) return;

        const gameTitle = titleEl.textContent.trim();
        const ytId = 'yt-gameplay-button';
        const hltbId = 'hltb-button';

        // Evitar insertar duplicados
        if (!document.getElementById(ytId)) {
            const ytButton = document.createElement('a');
            ytButton.id = ytId;
            ytButton.href = `https://www.youtube.com/results?search_query=gameplay+${encodeURIComponent(gameTitle)}`;
            ytButton.textContent = 'Gameplay';
            ytButton.target = '_self';
            ytButton.className = 'btn btn-main mx-auto mt-2';
            ytButton.style.display = 'block';
            ytButton.style.width = '100%';
            sidebar.appendChild(ytButton);
        }

        if (!document.getElementById(hltbId)) {
            const hltbButton = document.createElement('a');
            hltbButton.id = hltbId;
            hltbButton.href = `https://howlongtobeat.com/?q=${encodeURIComponent(gameTitle)}`;
            hltbButton.textContent = 'Duración';
            hltbButton.target = '_self';
            hltbButton.className = 'btn btn-main mx-auto mt-2';
            hltbButton.style.display = 'block';
            hltbButton.style.width = '100%';
            sidebar.appendChild(hltbButton);
        }
    };

    // Insertar botones cada medio segundo (solo si no existen aún)
    setInterval(insertButtons, 500);
})();
