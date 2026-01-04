// ==UserScript==
// @name        MyDealz Navigation per Button ausblenden
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Haupt- und Subnavigation per Toggle-Button aus- und einblenden
// @author      MD928835
// @match       https://www.mydealz.de/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/533119/MyDealz%20Navigation%20per%20Button%20ausblenden.user.js
// @updateURL https://update.greasyfork.org/scripts/533119/MyDealz%20Navigation%20per%20Button%20ausblenden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Konfiguration ---
    // Liste der CSS-Selektoren für die Elemente, die ausgeblendet werden sollen
    const SELECTORS_TO_TOGGLE = [
        '.nav',                             // Hauptnavigationsleiste
        '.subNav--light',                   // Sub-Navigationsleiste unter der Hauptleiste
        '.subNavMenu',                      // Menü unter SubNav (z.B. Kategorien, Gutscheine)
        '.pagi--max-height-80',             // Seitenpager
        '.aGrid.stickyBar--on',             // "Zum Deal" / "Coupon Codes" Leiste
        '.aGrid--fixed.aGrid-item--b-menu', // Der *Container* des unteren "Zum Deal" / Coupon Buttons
        '.mobile-bar-extender',
        '.filterBar'                        // Übersichtsseiten Filterleiste

    ];
    const STICKY_ELEMENT_SELECTOR = '.aGrid--fixed.aGrid-item--b-menu'; // Separater Selektor für den MutationObserver

    const BUTTON_ID = 'mydealzGlobalNavToggle';
    const STORAGE_KEY = 'mydealzGlobalNavVisible'; // Zustandsspeicherung
    const HIDDEN_CLASS = 'mydealz-nav-hidden-by-script'; // Eigene Klasse zum Ausblenden
    const ICON_SHOW = '>'; // einblenden
    const ICON_CLOSE = '<'; // ausblenden

    // --- CSS hinzufügen ---
    GM_addStyle(`
        /* Klasse zum Ausblenden der Navigationsbereiche */
        .${HIDDEN_CLASS} {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }

        /* Styling für den Toggle-Button (fixed position) */
        #${BUTTON_ID} {
            position: fixed; /* Absolut fixiert relativ zum Viewport */
            top: 10px;       /* Abstand von oben */
            left: 10px;      /* Abstand von links */
            z-index: 10001;  /* über andere Elemente */
            background-color: rgba(240, 240, 240, 0.9);
            border: 1px solid #cccccc;
            border-radius: 5px;
            padding: 6px 12px;
            font-size: 22px; /* Größere Schrift für bessere Klickbarkeit */
            line-height: 1;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s;
            color: #333;
            font-weight: bold; /* Deutlichere Icons */
        }

        #${BUTTON_ID}:hover {
            background-color: rgba(220, 220, 220, 0.95);
        }
    `);

    // --- Prüfen, ob das Body-Element vorhanden ist (Button-Anker) ---
    if (!document.body) {
        // console.error('MyDealz Global Nav Toggle: <body> Element nicht gefunden. Button kann nicht platziert werden. Skript wird beendet.');
        return;
    }

    // --- Toggle-Button erstellen oder finden ---
    let toggleButton = document.getElementById(BUTTON_ID);
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.id = BUTTON_ID;
        toggleButton.title = "Navigation ein-/ausblenden";
        // Den Button direkt in den Body einfügen, um Abhängigkeit von anderen Elementen zu vermeiden
        document.body.appendChild(toggleButton);
        // console.log('MyDealz Global Nav Toggle: Button erstellt und in <body> eingefügt.');
    } else {
        // console.log('MyDealz Global Nav Toggle: Button existiert bereits.');
    }

    // --- Zustand initialisieren (aus Speicher oder Standard = unsichtbar) ---
    let isVisible = GM_getValue(STORAGE_KEY, false); // Standardmäßig unsichtbar

    // --- Funktion zum Aktualisieren des Navigationszustands ---
    function updateNavState(visible) {
        let foundElements = false;
        SELECTORS_TO_TOGGLE.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                foundElements = true;
                elements.forEach(element => {
                    element.classList.toggle(HIDDEN_CLASS, !visible);
                });
            } else {
                 // Optional: Warnung, wenn ein spezifischer Selektor nichts findet
                 // console.warn(`MyDealz Global Nav Toggle: Selektor '${selector}' fand keine Elemente.`);
            }
        });

        if (!foundElements && visible) {
            // Nur warnen, wenn etwas sichtbar sein sollte, aber absolut nichts gefunden wurde
            // console.warn("MyDealz Global Nav Toggle: Keines der zu toggelnden Elemente wurde gefunden.");
        }

        // Button-Icon ändern
        toggleButton.textContent = visible ? ICON_CLOSE : ICON_SHOW;

        // Zustand speichern
        GM_setValue(STORAGE_KEY, visible);
        // console.log(`MyDealz Global Nav Toggle: Zustand auf ${visible ? 'sichtbar' : 'versteckt'} gesetzt.`);
    }

    // --- Initialen Zustand beim Laden setzen ---
    updateNavState(isVisible);

    // --- MutationObserver hinzufügen, um das Sticky-Element zuverlässig auszublenden ---
    const stickyElement = document.querySelector(STICKY_ELEMENT_SELECTOR);

    if (stickyElement) {
        const observer = new MutationObserver(mutations => {
            // Prüfe den gespeicherten Zustand (sollen die Elemente aktuell versteckt sein?)
            const shouldBeHidden = !GM_getValue(STORAGE_KEY, false);

            // Prüfe, ob das beobachtete Element die Versteck-Klasse *nicht* hat, obwohl es versteckt sein SOLLTE
            if (shouldBeHidden && !stickyElement.classList.contains(HIDDEN_CLASS)) {
                  stickyElement.classList.add(HIDDEN_CLASS);
                 // console.log('Sticky element forcefully hidden again by MutationObserver.');
            }
             // Optional: Robustheit - Falls das Element die Klasse hat, obwohl es sichtbar sein sollte (unwahrscheinlicher, aber möglich)
            else if (!shouldBeHidden && stickyElement.classList.contains(HIDDEN_CLASS)) {
                stickyElement.classList.remove(HIDDEN_CLASS);
                // console.log('Sticky element forcefully shown again by MutationObserver.');
            }
        });

        observer.observe(stickyElement, {
            attributes: true,
            attributeFilter: ['class', 'style']
            // subtree: false ist Standard und ausreichend, wir beobachten nur das Element selbst.
        });

        // console.log('MyDealz Global Nav Toggle: MutationObserver für Sticky Element gestartet.');
    } else {
        //console.warn(`MyDealz Global Nav Toggle: Sticky Element ('${STICKY_ELEMENT_SELECTOR}') nicht gefunden für MutationObserver.`);
    }
    // --- Ende MutationObserver ---


    // --- Event Listener für den Klick auf den Button hinzufügen ---
    toggleButton.addEventListener('click', () => {
        isVisible = !isVisible; // Zustand umschalten
        updateNavState(isVisible); // Anzeige aktualisieren und speichern
    });

    console.log('MyDealz Global Nav Toggle: Skript initialisiert.');

})();
