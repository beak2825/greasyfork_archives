// ==UserScript==
// @name         Drawaria Hide All Players Button!
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Adds a "Hide All Players" button that hides and shows all players.
// @match        https://drawaria.online/*
// @author       YouTubeDrawaria
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496789/Drawaria%20Hide%20All%20Players%20Button%21.user.js
// @updateURL https://update.greasyfork.org/scripts/496789/Drawaria%20Hide%20All%20Players%20Button%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Translation map
    const translations = {
        'en': {
            'hide': 'Hide All Players',
            'show': 'Show All Players'
        },
        'ru': {
            'hide': 'Скрыть всех игроков',
            'show': 'Показать всех игроков'
        },
        'es': {
            'hide': 'Ocultar todos los jugadores',
            'show': 'Mostrar todos los jugadores'
        }
        // Add more translations as needed
    };

    // Function to get the current language
    function getCurrentLanguage() {
        const langSelector = document.querySelector('#langselector');
        return langSelector ? langSelector.value : 'en';
    }

    // Function to translate the button text
    function translateButtonText(button, language) {
        const translationsForLanguage = translations[language];
        if (translationsForLanguage) {
            button.textContent = playersHidden ? translationsForLanguage.show : translationsForLanguage.hide;
        }
    }

    // Function to hide or show all players and restore their original positions
    function togglePlayersVisibility(hide) {
        var playerListRows = Array.from(document.querySelectorAll('.playerlist-row'));
        if (hide) {
            // Hide all players and store their original positions
            playerListRows.forEach(function(row) {
                row.dataset.originalStyle = row.style.cssText; // Store original styles
                row.style.display = 'none';
            });
        } else {
            // Show all players and restore their original positions
            playerListRows.sort(function(a, b) {
                var nameA = a.querySelector('.playerlist-name a').textContent.toUpperCase();
                var nameB = b.querySelector('.playerlist-name a').textContent.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            playerListRows.forEach(function(row) {
                row.style.cssText = row.dataset.originalStyle; // Restore original styles
                row.style.display = 'table-row';
            });
        }
    }

    // Add the "Hide All Players" button below the existing button
    var existingButton = document.querySelector('#roomcontrols-menu');
    if (existingButton) {
        // Create the "Hide All Players" button
        var hideAllButton = document.createElement('button');
        hideAllButton.className = 'btn btn-outline-secondary btn-sm';
        hideAllButton.style.padding = '1px 10px';
        hideAllButton.id = 'hide-all-players-button';

        // Variable to control the visibility state
        var playersHidden = false;

        // Function to update the button text and functionality
        function updateButton() {
            const currentLanguage = getCurrentLanguage();
            translateButtonText(hideAllButton, currentLanguage);
            hideAllButton.addEventListener('click', function() {
                playersHidden = !playersHidden;
                togglePlayersVisibility(playersHidden);
                translateButtonText(hideAllButton, currentLanguage);
            });
        }

        // Initial update of the button text and functionality
        updateButton();

        // Insert the "Hide All Players" button after the existing button
        existingButton.parentNode.insertBefore(hideAllButton, existingButton.nextSibling);
    }

    // Event listener for language change
    document.querySelector('#langselector').addEventListener('change', updateButton);

      // Style the player rows to display the ID
    var playerListRows = Array.from(document.querySelectorAll('.playerlist-row'));
    playerListRows.forEach(function(row) {
        var playerId = row.getAttribute('data-playerid');
        row.style.position = 'relative'; // Ensure the position is relative to place the ID label
        row.insertAdjacentHTML('beforeend', `<span class="player-id-label">${playerId}</span>`);
    });

    // CSS to style the player ID label
    var css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML = `
        .player-id-label {
            position: absolute;
            top: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 2px 4px;
            font-size: 0.8em;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(css);
})();