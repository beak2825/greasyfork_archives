// ==UserScript==
// @name         Twitch Game Store Search
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds Steam and Epic buttons next to the Twitch game name.
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508896/Twitch%20Game%20Store%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/508896/Twitch%20Game%20Store%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STEAM_ICON = 'https://store.steampowered.com/favicon.ico';


    const EPIC_ICON = 'https://i.imgur.com/cJi4fQd.png';

    function createIconButton(imgUrl, title, onClick) {
        const btn = document.createElement('img');
        btn.src = imgUrl;
        btn.title = title;
        btn.style.width = '18px';
        btn.style.height = '18px';
        btn.style.marginLeft = '5px';
        btn.style.cursor = 'pointer';
        btn.style.verticalAlign = 'middle';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });

        return btn;
    }

    function addButtonsIfNeeded() {
        const linkEl = document.querySelector('[data-a-target="stream-game-link"]');
        if (!linkEl || linkEl.dataset.hasButtons) return;

        const parent = linkEl.parentElement;
        if (!parent) return;

        const gameName = linkEl.innerText.trim();
        if (!gameName) return;

        const iconContainer = document.createElement('span');
        iconContainer.style.display = 'inline-flex';
        iconContainer.style.alignItems = 'center';
        iconContainer.style.marginLeft = '6px';

        const steamBtn = createIconButton(STEAM_ICON, 'Search on Steam', () => {
            const url = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
            window.open(url, '_blank');
        });

        const epicBtn = createIconButton(EPIC_ICON, 'Search on Epic Games Store', () => {
            const url = `https://store.epicgames.com/en-US/browse?q=${encodeURIComponent(gameName)}`;
            window.open(url, '_blank');
        });

        iconContainer.appendChild(steamBtn);
        iconContainer.appendChild(epicBtn);

        parent.appendChild(iconContainer);
        linkEl.dataset.hasButtons = "true";
    }

    setInterval(addButtonsIfNeeded, 1500);
})();
