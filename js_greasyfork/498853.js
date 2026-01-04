// ==UserScript==
// @name         Wimbledon Custom Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Přidá tlačítko k ID
// @author       Michal
// @match        https://www.wimbledon.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498853/Wimbledon%20Custom%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/498853/Wimbledon%20Custom%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGenerateButtonWithDelay() {
        const addGenerateButton = () => {
            const button = document.createElement('button');
            button.textContent = 'Matches';
            button.style.backgroundColor = 'yellow';
            button.style.padding = '5px';
            button.style.margin = '5px 0';
            button.style.fontWeight = 'bold';
            button.style.border = '1px solid black';
            button.style.cursor = 'pointer';

            button.addEventListener('click', function() {
                highlightDataMatches();
            });

            const scheduleInfo = document.querySelector('.schedule-info');

            if (scheduleInfo) {
                scheduleInfo.appendChild(button);
            } else {
                console.error('Schedule info container not found.');
            }
        };

        setTimeout(addGenerateButton, 3000);
    }

    function highlightDataMatches() {
        const matches = document.querySelectorAll('[data-match]');

        matches.forEach(match => {
            const matchId = match.getAttribute('data-match');

            const matchIdDiv = document.createElement('div');
            matchIdDiv.textContent = `Match ID: ${matchId}`;
            matchIdDiv.style.backgroundColor = 'yellow';
            matchIdDiv.style.padding = '5px';
            matchIdDiv.style.margin = '5px 0';
            matchIdDiv.style.fontWeight = 'bold';
            matchIdDiv.style.border = '1px solid black';

            const copyFunctionButton = document.createElement('button');
            copyFunctionButton.textContent = 'REGEX';
            copyFunctionButton.style.marginLeft = '10px';
            copyFunctionButton.style.cursor = 'pointer';

            copyFunctionButton.addEventListener('click', function() {
                const functionText = `/([\\s\\S]+)/(function(){let name = document.querySelector('[data-match="${matchId}"]'); let tracker = name.querySelector('.match-box-buttons > div > button').click(); let stats = document.querySelectorAll('.content-main')[1].querySelectorAll('a[class]')[2].click()})`;
                copyToClipboard(functionText);
            });

            matchIdDiv.appendChild(copyFunctionButton);
            match.appendChild(matchIdDiv);
        });
    }

    function copyToClipboard(text) {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
    }

    window.addEventListener('load', function() {
        addGenerateButtonWithDelay();
    });

})();