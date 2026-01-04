// ==UserScript==
// @name         MAL Button at anime-loads.org Anime search
// @namespace    MAL-Button
// @version      1.0
// @description  Adds a button that leads to MyAnimeList.
// @author       Sebirate
// @match        https://www.anime-loads.org/anime*
// @match        https://www.anime-loads.org/anime-series*
// @match        https://www.anime-loads.org/all*
// @match        https://www.anime-loads.org/anime-movies*
// @match        https://www.anime-loads.org/ova*
// @match        https://www.anime-loads.org/special*
// @match        https://www.anime-loads.org/bonus*
// @match        https://www.anime-loads.org/ova*
// @match        https://www.anime-loads.org/web*
// @match        https://www.anime-loads.org/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500757/MAL%20Button%20at%20anime-loadsorg%20Anime%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/500757/MAL%20Button%20at%20anime-loadsorg%20Anime%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion, um den Button zu erstellen
    function createButton(container, animeTitle) {
        // Überprüfen, ob der Button bereits existiert
        if (container.querySelector('.mal-search-button')) {
            return; // Wenn ja, nichts weiter tun
        }

        // Button erstellen
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-sm btn-default mal-search-button';
        button.textContent = 'Search on MyAnimeList';
        button.style.marginTop = '10px';
        button.style.marginLeft = '10px';

        // Event-Listener hinzufügen
        button.addEventListener('click', function() {
            if (animeTitle) {
                const malSearchUrl = `https://myanimelist.net/search/all?cat=all&q=${encodeURIComponent(animeTitle)}`;
                window.open(malSearchUrl, '_blank');
            } else {
                alert('Anime title not found');
            }
        });

        // Button in das Container einfügen
        container.appendChild(button);
    }

    // Funktion zum Hinzufügen des Buttons zu allen relevanten Panels
    function addButtonToPanels() {
        const panels = document.querySelectorAll('.panel-body');
        panels.forEach(panel => {
            // Überprüfen, ob das Panel in der Description enthalten ist
            const isInDescription = panel.closest('#description');
            if (!isInDescription) {
                // Anime-Titel aus dem Panel extrahieren
                const animeTitleElement = panel.querySelector('.title-list a');
                const animeTitle = animeTitleElement ? animeTitleElement.textContent.trim() : null;
                createButton(panel, animeTitle);
            }
        });
    }

    // Funktion zum Hinzufügen des Buttons zur Description
    function addButtonToDescription() {
        const descriptionTab = document.querySelector('#description');
        if (descriptionTab) {
            // Anime-Titel aus dem <td> Element extrahieren
            const animeTitleElement = descriptionTab.querySelector('td');
            const animeTitle = animeTitleElement ? animeTitleElement.childNodes[0].textContent.trim() : null;
            createButton(descriptionTab, animeTitle);
        }
    }

    // Überwachung der Tab-Änderungen
    function observeTabChanges() {
        const descriptionTabLink = document.querySelector('a[href="#description"]');
        if (descriptionTabLink) {
            descriptionTabLink.addEventListener('click', () => {
                setTimeout(() => {
                    const descriptionTab = document.querySelector('#description');
                    if (descriptionTab && !descriptionTab.querySelector('.mal-search-button')) {
                        addButtonToDescription();
                    }
                }, 100); // Timeout, um sicherzustellen, dass der Tab-Inhalt geladen ist
            });
        }
    }

    // Funktionen nach dem Laden der Seite ausführen
    window.addEventListener('load', () => {
        addButtonToPanels();
        observeTabChanges();
    });
})();
