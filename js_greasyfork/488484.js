// ==UserScript==
// @name          Steam button for Keymailer
// @name:ru       Кнопка Steam для Keymailer
// @namespace     https://www.keymailer.co/g/games
// @version       2.0
// @description   Add a link to Steam search for games on Keymailer.co
// @description:ru Добавляет ссылку на поиск игр в Steam на Keymailer.co
// @author        Fan4eG
// @match         https://www.keymailer.co/g/games/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/488484/Steam%20button%20for%20Keymailer.user.js
// @updateURL https://update.greasyfork.org/scripts/488484/Steam%20button%20for%20Keymailer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSpecialCharacters(string) {
        return string.replace(/™/g, '').replace(/®/g, '').replace(/©/g, '').replace(/℠/g, '').replace(/℗/g, '').replace(/™️/g, '').replace(/©️/g, '');
    }

    function addSteamLinkButton() {
        const pathArray = window.location.pathname.split('/');
        const gameId = pathArray[pathArray.length - 1];

        const gameTitleElement = document.querySelector('h1');
        const gameTitle = removeSpecialCharacters(gameTitleElement.textContent.trim());

        const button = document.createElement('button');
        button.innerHTML = 'STEAM';
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.right = '0';
        button.style.padding = '5px';
        button.style.background = 'rgb(17, 99, 231)';
        button.style.color = 'white';
        button.style.zIndex = '9999';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'inherit';
        button.style.border = '2px solid black';

        button.addEventListener('click', function() {
            window.open('https://store.steampowered.com/search/?term=' + encodeURI(gameTitle), '_blank');
        });

        gameTitleElement.style.position = 'relative';
        gameTitleElement.appendChild(button);
    }

    addSteamLinkButton();
})();
