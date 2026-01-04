// ==UserScript==
// @name         Steam Game Search & Gameplay videos RU
// @icon         https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add search links for games on Steam pages and YouTube review
// @author       Fillzest ( modified code )
// @match        https://store.steampowered.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493988/Steam%20Game%20Search%20%20Gameplay%20videos%20RU.user.js
// @updateURL https://update.greasyfork.org/scripts/493988/Steam%20Game%20Search%20%20Gameplay%20videos%20RU.meta.js
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

    const site1SearchLink = `https://online-fix.me/index.php?do=search&subaction=search&story=${formattedGameName}`;
    createButton(site1SearchLink, "Online Fix", "Поиск по Online Fix", "https://i.imgur.com/WAXRAUw.png");

    const site2SearchLink = `https://small-games.info/?go=search&search_text=${formattedGameName}&sort=2`;
    createButton(site2SearchLink, "Small-games", "Поиск по Small-Games", "https://small-games.info/logo/logo.12.27.png");

    const site3SearchLink = `https://rutracker.org/forum/tracker.php?nm=${formattedGameName}&o=10&s=2`;
    createButton(site3SearchLink, "Rutracker", "Поиск по Rutracker", "https://i.imgur.com/UnHvprS.png");

    const site4SearchLink = `https://nnmclub.to/forum/tracker.php?nm=${formattedGameName}&o=10&s=2`;
    createButton(site4SearchLink, "NnmClub", "Поиск по NnmClub", "https://i.imgur.com/s8eRrZr.png");

    const site5SearchLink = `http://rutor.info/search/1/0/000/2/${formattedGameName}`;
    createButton(site5SearchLink, "Rutor", "Поиск по Rutor", "https://i.imgur.com/MBTI3G4.png");

    const site6SearchLink = `https://thebyrut.org/index.php?do=search&subaction=search&search_start=0&full_search=0&story=${formattedGameName}`;
    createButton(site6SearchLink, "BYRUTOR", "Поиск по BYRUTOR", "https://byrutgame.org/templates/byrut_upd/images/logo.png");

    const YouTubeSearch = `https://www.youtube.com/results?search_query=${formattedGameName} + трейлер`
    createButton(YouTubeSearch, "YouTube", "Трейлер на YouTube", "https://i.ytimg.com/vi/N58Lf9XuCc0/maxresdefault.jpg");

    const YouTubeGameplay = `https://www.youtube.com/results?search_query=${formattedGameName} + геймплей без комментариев`
    createButton(YouTubeGameplay, "YouTube", "Геймплей", "https://cdn.holdtoreset.com/wp-content/uploads/2016/01/YTG.png");


})();