// ==UserScript==
// @name        Moomoo.io - Styles
// @author      Seryo
// @description Remove unnecessary menu elements, and modify ping and shutdown warning.
// @version     0.2
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/476903/Moomooio%20-%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/476903/Moomooio%20-%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elementsToRemove = document.querySelectorAll('.menuText, .menuHeader, .menuLink');
    elementsToRemove.forEach(element => {
        element.remove();
    });

    const specificElementToRemove = document.getElementById('desktopInstructions');
    if (specificElementToRemove) {
        specificElementToRemove.remove();
    }

    const pingDisplayDiv = document.querySelector('#pingDisplay');
    if (pingDisplayDiv) {
        pingDisplayDiv.style.color = '#fff';
        pingDisplayDiv.style.textShadow = '3px 3px 3px black';
    }

    const shadowStyle = 'box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4)';

    const setupCardDiv = document.getElementById('setupCard');
    if (setupCardDiv) {
        setupCardDiv.style.cssText += shadowStyle;
    }

    const serverBrowserSelect = document.getElementById('serverBrowser');
    if (serverBrowserSelect) {
        serverBrowserSelect.style.color = '#333';
        serverBrowserSelect.style.backgroundColor = '#e5e3e4';
    }

    const enterGameButton = document.getElementById('enterGame');
    if (enterGameButton) {
        enterGameButton.style.backgroundColor = '#333';
    }

    if (pingDisplayDiv) {
        document.body.appendChild(pingDisplayDiv);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .menuLink {
            font-size: 20px;
            color: #333;
        }
        a {
            color: #333;
            text-decoration: none;
        }
    `;
    document.head.appendChild(style);

    const nameInputElement = document.getElementById('nameInput');
    if (nameInputElement) {
        nameInputElement.style.color = '#333';
    }

    const guideCardDiv = document.getElementById('guideCard');
    if (guideCardDiv) {
        guideCardDiv.style.cssText += shadowStyle;
        setupCardDiv.style.backgroundColor = '#181818';
        guideCardDiv.style.backgroundColor = '#181818';
    }

    const shutdownDisplayDiv = document.querySelector('#shutdownDisplay');
    if (shutdownDisplayDiv) {
        shutdownDisplayDiv.style.position = 'absolute';
        shutdownDisplayDiv.style.top = '15px';
        shutdownDisplayDiv.style.left = '150px';
        shutdownDisplayDiv.style.color = '#820000';
        shutdownDisplayDiv.style.fontSize = '200%';
        shutdownDisplayDiv.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)';
    }
})();