// ==UserScript==
// @name         ManagerZone Player Weight and Height Grouper
// @namespace    http://tampermonkey.net/
// @author       kostrzak16
// @version      0.5.2
// @description  Group and highlight players by weight and height ranges on ManagerZone, with filtering on double-click
// @match        *://*.managerzone.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498751/ManagerZone%20Player%20Weight%20and%20Height%20Grouper.user.js
// @updateURL https://update.greasyfork.org/scripts/498751/ManagerZone%20Player%20Weight%20and%20Height%20Grouper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.hostname.includes('www.managerzone.com')) return;

    const groups = {
        height: [
            { min: 160, max: 173, color: 'lightgreen', name: 'lower' },
            { min: 174, max: 186, color: '#ffffa0', name: 'mid' }, // Light yellow
            { min: 187, max: 199, color: 'lightpink', name: 'upper' }
        ],
        weight: [
            { min: 55, max: 72, color: 'lightgreen', name: 'lower' },
            { min: 73, max: 89, color: '#ffffa0', name: 'mid' }, // Light yellow
            { min: 90, max: 107, color: 'lightpink', name: 'upper' }
        ]
    };

    function getGroup(value, type) {
        return groups[type].find(group => value >= group.min && value <= group.max) || null;
    }

    function highlightPlayers() {
        const playersContainer = document.getElementById('players_container');
        if (!playersContainer) {
            console.log('No players_container found. Exiting function.');
            return;
        }

        const playerContainers = playersContainer.querySelectorAll('.playerContainer');

        playerContainers.forEach(container => {
            const statElements = container.querySelectorAll('td strong');

            statElements.forEach(element => {
                const text = element.textContent.trim();
                let value, type, group;

                if (text.endsWith(' cm')) {
                    value = parseFloat(text);
                    type = 'height';
                } else if (text.endsWith(' kg')) {
                    value = parseFloat(text);
                    type = 'weight';
                } else {
                    return;
                }

                group = getGroup(value, type);
                if (group) {
                    const td = element.closest('td');
                    td.style.backgroundColor = group.color;
                    td.dataset.group = group.name;
                    td.dataset.type = type;

                    // Add double-click event listener
                    td.addEventListener('dblclick', filterPlayers);
                }
            });
        });
    }

    function filterPlayers(event) {
        const clickedGroup = event.target.closest('td').dataset.group;
        const clickedType = event.target.closest('td').dataset.type;
        const playerContainers = document.querySelectorAll('.playerContainer');

        playerContainers.forEach(container => {
            const relevantStat = container.querySelector(`td[data-group][data-type="${clickedType}"]`);
            if (relevantStat && relevantStat.dataset.group === clickedGroup) {
                container.style.display = '';
            } else {
                container.style.display = 'none';
            }
        });
    }

    // Run the function initially
    highlightPlayers();

    // Intercept XMLHttpRequest
    const originalXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        const url = arguments[1];
        if (url.includes('ajax.php?p=transfer')) {
            this.addEventListener('load', function() {
                if (this.status === 200) {
                    console.log('Detected relevant AJAX call completion');
                    highlightPlayers();
                }
            });
        }
        return originalXHR.apply(this, arguments);
    };
})();