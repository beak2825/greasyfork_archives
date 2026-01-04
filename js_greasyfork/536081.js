// ==UserScript==
// @name         mydealz Sortierung für Suche merken
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Speichert und wendet automatisch die letzte Sortierungsoption bei der Suche auf mydealz.de an
// @author       You
// @match        https://www.mydealz.de/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536081/mydealz%20Sortierung%20f%C3%BCr%20Suche%20merken.user.js
// @updateURL https://update.greasyfork.org/scripts/536081/mydealz%20Sortierung%20f%C3%BCr%20Suche%20merken.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug-Modus für bessere Fehlersuche
    const DEBUG = true;

    function log(message) {
        if (DEBUG) {
            console.log('[Mydealz Sort] ' + message);
        }
    }

    // Funktion, um URL-Parameter zu bekommen
    function getURLParameter(url, name) {
        const params = new URLSearchParams(new URL(url).search);
        return params.get(name);
    }

    // Funktion, um die aktuelle Seite zu prüfen
    function isSearchPage() {
        return window.location.pathname.includes('/search');
    }

    // Funktion, die nach dem Suchformular sucht und es modifiziert
    function setupSearchFormInterception() {
        log('Suche nach Suchformularen...');

        // Bereits verarbeitete Formulare
        const processedForms = new Set();

        // Prüfen, ob ein Formular bereits verarbeitet wurde
        function isProcessed(form) {
            return form.dataset.sortingModified === 'true';
        }

        // Funktion zur Verarbeitung der Formulare
        function processForms() {
            // Gezielter Selektor für das Suchformular
            const searchForms = document.querySelectorAll('form[action*="/search"]');

            if (searchForms.length > 0) {
                let foundNewForm = false;

                searchForms.forEach((form, index) => {
                    // Prüfen, ob dieses Formular bereits verarbeitet wurde
                    if (isProcessed(form)) return;

                    // Markieren, dass wir dieses Formular verarbeitet haben
                    form.dataset.sortingModified = 'true';
                    foundNewForm = true;

                    log(`Verarbeite Suchformular #${index + 1}`);

                    // Event-Listener für das Formular hinzufügen
                    form.addEventListener('submit', function(e) {
                        // Die gespeicherte Sortierung abrufen
                        const savedSort = localStorage.getItem('mydealz_preferred_sort');

                        if (savedSort) {
                            log(`Füge Sortierung "${savedSort}" zur Suchanfrage hinzu`);

                            // Prüfen, ob bereits ein sortBy-Feld vorhanden ist
                            let sortByInput = form.querySelector('input[name="sortBy"]');

                            // Wenn kein sortBy-Feld existiert, eines erstellen
                            if (!sortByInput) {
                                sortByInput = document.createElement('input');
                                sortByInput.type = 'hidden';
                                sortByInput.name = 'sortBy';
                                form.appendChild(sortByInput);
                            }

                            // Den Wert setzen
                            sortByInput.value = savedSort;
                        }
                    });

                    log(`Suchformular #${index + 1} wurde konfiguriert`);
                });

                // Nur wenn keine neuen Formulare gefunden wurden und der Observer noch existiert
                if (!foundNewForm && observer) {
                    // Verzögerung, um weitere Änderungen abzuwarten
                    clearTimeout(observerTimeoutId);
                    observerTimeoutId = setTimeout(() => {
                        if (observer) {
                            observer.disconnect();
                            observer = null; // Wichtig: Observer auf null setzen
                            log('Observer beendet, alle Formulare gefunden');
                        }
                    }, 2000);
                }
            }
        }

        // Variablen für Observer-Verwaltung
        let observer = null;
        let observerTimeoutId = null;
        let finalTimeoutId = null;

        // Initial nach Formularen suchen
        processForms();

        // Beobachter für dynamisch geladene Elemente
        observer = new MutationObserver(() => {
            processForms();
        });

        // Beobachten des gesamten Dokuments
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Sicherheitsabschaltung nach 10 Sekunden
        finalTimeoutId = setTimeout(() => {
            if (observer) {
                observer.disconnect();
                observer = null;
                log('Observer nach 10 Sekunden Timeout beendet');
            }

            // Auch etwaige offene Timeouts aufräumen
            if (observerTimeoutId) {
                clearTimeout(observerTimeoutId);
                observerTimeoutId = null;
            }
        }, 10000);
    }

    // Hauptfunktion zum Behandeln der aktuellen Seite
    function handlePage() {
        if (isSearchPage()) {
            // Hole die aktuelle Sortierung aus der URL
            const currentSort = getURLParameter(window.location.href, 'sortBy');

            // Wenn eine Sortierung vorhanden ist, speichere sie
            if (currentSort) {
                localStorage.setItem('mydealz_preferred_sort', currentSort);
                log('Sortierung gespeichert: ' + currentSort);
            } else {
                // Wenn keine Sortierung gesetzt ist, aber eine gespeicherte existiert
                const savedSort = localStorage.getItem('mydealz_preferred_sort');

                if (savedSort && !window.location.href.includes('sortBy=')) {
                    // Baue die neue URL mit der gespeicherten Sortierung
                    let newUrl = window.location.href;
                    const separator = newUrl.includes('?') ? '&' : '?';
                    newUrl += separator + 'sortBy=' + savedSort;

                    // Umleitung zur neuen URL
                    log('Wende Sortierung an, leite um zu: ' + newUrl);
                    // Kleine Verzögerung hinzufügen
                    setTimeout(() => {
                        window.location.href = newUrl;
                    }, 100);
                }
            }
        }
    }

    // Script starten
    log('Script gestartet');

    // Beim Laden der Seite
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupSearchFormInterception();
            handlePage();
        });
    } else {
        setupSearchFormInterception();
        handlePage();
    }

    // Überwache URL-Änderungen (für SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            log('URL hat sich geändert zu: ' + url);
            handlePage();
        }
    }).observe(document, {subtree: true, childList: true});
})();