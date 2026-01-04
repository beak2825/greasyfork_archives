// ==UserScript==
// @name         eBay Hide Listings
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hide individual eBay listings from search results
// @description:en Hide individual eBay listings from search results
// @description:de Einzelne eBay-Listings aus Suchergebnissen ausblenden
// @author       https://github.com/anga83
// @match        https://www.ebay.com/sch/*
// @match        https://www.ebay.de/sch/*
// @match        https://www.ebay.co.uk/sch/*
// @match        https://www.ebay.fr/sch/*
// @match        https://www.ebay.it/sch/*
// @match        https://www.ebay.es/sch/*
// @match        https://www.ebay.ca/sch/*
// @match        https://www.ebay.com.au/sch/*
// @match        https://www.ebay.at/sch/*
// @match        https://www.ebay.ch/sch/*
// @match        https://www.ebay.be/sch/*
// @match        https://www.ebay.nl/sch/*
// @match        https://www.ebay.pl/sch/*
// @match        https://www.ebay.ie/sch/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/538826/eBay%20Hide%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/538826/eBay%20Hide%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lokalisierung basierend auf Browser-Sprache
    const browserLang = navigator.language.split('-')[0];

    const translations = {
        en: {
            hideTitle: 'Hide this listing',
            resetButton: 'Reset Hidden Items',
            resetConfirm: 'Show all hidden items again?',
            exportMenu: 'Export Hidden Items',
            importMenu: 'Import Hidden Items',
            exportSuccess: 'Hidden items exported successfully!',
            importSuccess: 'Hidden items imported and merged successfully!',
            importError: 'Error importing file. Please check the file format.',
            noFileSelected: 'No file selected.',
            invalidJson: 'Invalid JSON file format.'
        },
        de: {
            hideTitle: 'Dieses Listing ausblenden',
            resetButton: 'Versteckte Items zurücksetzen',
            resetConfirm: 'Alle versteckten Items wieder anzeigen?',
            exportMenu: 'Versteckte Items exportieren',
            importMenu: 'Versteckte Items importieren',
            exportSuccess: 'Versteckte Items erfolgreich exportiert!',
            importSuccess: 'Versteckte Items erfolgreich importiert und zusammengeführt!',
            importError: 'Fehler beim Importieren der Datei. Bitte prüfen Sie das Dateiformat.',
            noFileSelected: 'Keine Datei ausgewählt.',
            invalidJson: 'Ungültiges JSON-Dateiformat.'
        }
    };

    // Fallback auf Englisch wenn Sprache nicht unterstützt
    const t = translations[browserLang] || translations.en;

    // CSS für das Hide-Symbol
    const style = document.createElement('style');
    style.textContent = `
        .ebay-hide-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 3px 6px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
            transition: background-color 0.2s;
        }
        .ebay-hide-btn:hover {
            background: rgba(255, 0, 0, 0.1);
            border-color: #ff0000;
        }
        .ebay-listing-hidden {
            display: none !important;
        }
        .s-item {
            position: relative;
        }
        .ebay-file-input {
            position: absolute;
            left: -9999px;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // LocalStorage-Schlüssel für versteckte Items (domain-spezifisch)
    const domain = window.location.hostname;
    const HIDDEN_ITEMS_KEY = `ebay_hidden_items_${domain}`;

    // Versteckte Items aus LocalStorage laden
    function getHiddenItems() {
        const stored = localStorage.getItem(HIDDEN_ITEMS_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // Items in LocalStorage speichern
    function saveHiddenItems(hiddenItems) {
        localStorage.setItem(HIDDEN_ITEMS_KEY, JSON.stringify(hiddenItems));
    }

    // Alle eBay-bezogenen LocalStorage-Keys sammeln
    function getAllEbayData() {
        const ebayData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('ebay_hidden_items_')) {
                ebayData[key] = JSON.parse(localStorage.getItem(key));
            }
        }
        return ebayData;
    }

    // Export-Funktion
    function exportHiddenItems() {
        const data = getAllEbayData();
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ebay-hidden-items-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (typeof GM_notification !== 'undefined') {
            GM_notification(t.exportSuccess, 'eBay Hide Listings');
        } else {
            alert(t.exportSuccess);
        }
    }

    // Import-Funktion
    function importHiddenItems() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.className = 'ebay-file-input';

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) {
                alert(t.noFileSelected);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // Validierung der Datenstruktur
                    if (typeof importedData !== 'object' || importedData === null) {
                        throw new Error('Invalid data structure');
                    }

                    // Merge mit existierenden Daten
                    for (const [key, items] of Object.entries(importedData)) {
                        if (key.startsWith('ebay_hidden_items_') && Array.isArray(items)) {
                            const existingItems = localStorage.getItem(key) ?
                                JSON.parse(localStorage.getItem(key)) : [];
                            const mergedItems = [...new Set([...existingItems, ...items])];
                            localStorage.setItem(key, JSON.stringify(mergedItems));
                        }
                    }

                    if (typeof GM_notification !== 'undefined') {
                        GM_notification(t.importSuccess, 'eBay Hide Listings');
                    } else {
                        alert(t.importSuccess);
                    }

                    // Seite neu laden um Änderungen anzuwenden
                    location.reload();

                } catch (error) {
                    console.error('Import error:', error);
                    alert(t.importError);
                }
            };

            reader.onerror = function() {
                alert(t.importError);
            };

            reader.readAsText(file);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    // TamperMonkey-Menü registrieren
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand(t.exportMenu, exportHiddenItems);
        GM_registerMenuCommand(t.importMenu, importHiddenItems);
    }

    // Item-ID aus einem Listing-Element extrahieren
    function getItemId(listingElement) {
        // Versuche verschiedene Attribute für die eindeutige ID
        const id = listingElement.id ||
                   listingElement.getAttribute('data-marko-key') ||
                   listingElement.querySelector('[data-marko-key]')?.getAttribute('data-marko-key') ||
                   listingElement.getAttribute('data-viewport');

        return id;
    }

    // Hide-Button erstellen
    function createHideButton(listingElement, itemId) {
        const hideBtn = document.createElement('button');
        hideBtn.className = 'ebay-hide-btn';
        hideBtn.innerHTML = '✕';
        hideBtn.title = t.hideTitle;

        hideBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Item zur Liste der versteckten Items hinzufügen
            const hiddenItems = getHiddenItems();
            if (!hiddenItems.includes(itemId)) {
                hiddenItems.push(itemId);
                saveHiddenItems(hiddenItems);
            }

            // Listing sofort ausblenden
            listingElement.classList.add('ebay-listing-hidden');
        });

        return hideBtn;
    }

    // Alle Listings verarbeiten
    function processListings() {
        const listings = document.querySelectorAll('.s-item');
        const hiddenItems = getHiddenItems();

        listings.forEach(listing => {
            const itemId = getItemId(listing);

            if (!itemId) return;

            // Prüfen, ob das Item bereits versteckt werden soll
            if (hiddenItems.includes(itemId)) {
                listing.classList.add('ebay-listing-hidden');
                return;
            }

            // Prüfen, ob bereits ein Hide-Button vorhanden ist
            if (listing.querySelector('.ebay-hide-btn')) return;

            // Hide-Button hinzufügen
            const hideButton = createHideButton(listing, itemId);
            listing.appendChild(hideButton);
        });
    }

    // Button zum Zurücksetzen aller versteckten Items (optional)
    function addResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = t.resetButton;
        resetBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            padding: 5px 10px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
        `;

        resetBtn.addEventListener('click', function() {
            if (confirm(t.resetConfirm)) {
                localStorage.removeItem(HIDDEN_ITEMS_KEY);
                location.reload();
            }
        });

        document.body.appendChild(resetBtn);
    }

    // Initiale Verarbeitung
    processListings();
    addResetButton();

    // Observer für dynamisch geladene Inhalte
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                processListings();
            }
        });
    });

    // Observer starten
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
