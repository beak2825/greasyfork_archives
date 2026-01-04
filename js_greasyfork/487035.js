// ==UserScript==
// @name         Liiga URL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Modify live URLs on Liiga website
// @author       Michal
// @match        https://liiga.fi/en/game/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487035/Liiga%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/487035/Liiga%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParts = window.location.href.split('/');
    const year = urlParts[urlParts.indexOf("game") + 1];
    const gameId = urlParts[urlParts.indexOf("game") + 2];
    const baseUrl = urlParts.slice(0, urlParts.indexOf("game")).join('/');

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.left = '0';
    buttonContainer.style.width = '100%';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'flex-start';
    buttonContainer.style.zIndex = '10000000';
    document.body.appendChild(buttonContainer);

    function createButton(text, action) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style.marginBottom = '10px';
        button.addEventListener('click', function() {
            const newUrl = `${baseUrl}/game/${year}/${gameId}/${action}`;
            history.pushState({}, '', newUrl);
        });
        buttonContainer.appendChild(button);
    }

    createButton('Events', 'events');
    createButton('Stats', 'stats');
    createButton('Rink Maps', 'rinkmaps');

    setTimeout(checkScript, 5000);

    function checkScript() {

        const exampleElement = document.querySelector('.example-class');

        if (!exampleElement) {
            console.log('Skript přestal fungovat.');
        }
    }
})();
