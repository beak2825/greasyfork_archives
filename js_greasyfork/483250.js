// ==UserScript==
// @name         Steam Game Search Links RU edition
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add search links for games on Steam pages
// @author       iMAboud , daswer123 ( modified code )
// @match        https://store.steampowered.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483250/Steam%20Game%20Search%20Links%20RU%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/483250/Steam%20Game%20Search%20Links%20RU%20edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(searchLink, buttonText, tooltipText, iconPath) {
        const gameNameElement = document.getElementById("appHubAppName");
        if (gameNameElement) {
            const linkButton = document.createElement("a");
            linkButton.href = searchLink;
            linkButton.setAttribute("target", "_blank");

            const img = new Image();
            img.src = iconPath;
            img.alt = buttonText;
            img.style.width = '64px';
            img.style.height = '32px';
            img.style.objectFit = 'contain';

            linkButton.appendChild(img);
            linkButton.title = tooltipText;
            linkButton.style.marginRight = '10px';
            gameNameElement.parentNode.appendChild(linkButton);
        }
    }

    const formattedGameName = document.getElementById("appHubAppName").textContent.trim().toLowerCase().replace(/'/g, '').replace(/_/g, ' ');

    const steamDBSearchLink = `https://online-fix.me/index.php?do=search&subaction=search&story=${formattedGameName}`;
    createButton(steamDBSearchLink, "Online Fix", "Search on Online Fix", "https://i.imgur.com/WAXRAUw.png");

    const site4SearchLink = `https://small-games.info/?go=search&search_text=${formattedGameName}&sort=2`;
    createButton(site4SearchLink, "Small-games", "Search on Small-Games", "https://small-games.info/logo/logo.12.27.png");

    const site1SearchLink = `https://rutracker.org/forum/tracker.php?nm=${formattedGameName}&o=10&s=2`;
    createButton(site1SearchLink, "Rutracker", "Search on Rutracker", "https://i.imgur.com/UnHvprS.png");

    const site2SearchLink = `https://nnmclub.to/forum/tracker.php?nm=${formattedGameName}&o=10&s=2`;
    createButton(site2SearchLink, "NnmClub", "Search on NnmClub", "https://i.imgur.com/s8eRrZr.png");

    const site3SearchLink = `http://rutor.info/search/1/0/000/2/${formattedGameName}`;
    createButton(site3SearchLink, "Rutor", "Search on Rutor", "https://i.imgur.com/MBTI3G4.png");

})();