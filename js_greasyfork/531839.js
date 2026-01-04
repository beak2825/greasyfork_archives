// ==UserScript==
// @name         Google Maps Tab für EU Benutzer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Fügt den Maps-Tab zur Google-Suche hinzu - Robuste Version
// @author       Mindworker
// @match        https://www.google.com/search*
// @match        https://www.google.de/search*
// @match        https://www.google.at/search*
// @match        https://www.google.fr/search*
// @match        https://www.google.it/search*
// @match        https://www.google.es/search*
// @match        https://www.google.nl/search*
// @match        https://www.google.be/search*
// @match        https://www.google.pl/search*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531839/Google%20Maps%20Tab%20f%C3%BCr%20EU%20Benutzer.user.js
// @updateURL https://update.greasyfork.org/scripts/531839/Google%20Maps%20Tab%20f%C3%BCr%20EU%20Benutzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findTabNavigation() {
        // Verschiedene robuste Strategien zum Finden der Tab-Navigation
        const strategies = [
            // Strategie 1: Suche nach role="list" mit mehreren Tabs
            () => {
                const lists = document.querySelectorAll('[role="list"]');
                for (let list of lists) {
                    const items = list.querySelectorAll('[role="listitem"]');
                    if (items.length >= 3) { // Mindestens 3 Tabs (Alle, Bilder, etc.)
                        return list;
                    }
                }
                return null;
            },
            
            // Strategie 2: Suche nach Container mit mehreren Links die wie Tabs aussehen
            () => {
                const containers = document.querySelectorAll('div');
                for (let container of containers) {
                    const links = container.querySelectorAll('a');
                    if (links.length >= 4 && links.length <= 12) {
                        // Prüfe ob es Tab-ähnliche Inhalte sind
                        let tabKeywords = 0;
                        for (let link of links) {
                            const text = link.textContent.toLowerCase();
                            if (text.match(/\b(alle|all|bilder|images|videos|news|bücher|books|produkte|shopping)\b/)) {
                                tabKeywords++;
                            }
                        }
                        if (tabKeywords >= 3) {
                            return container;
                        }
                    }
                }
                return null;
            },
            
            // Strategie 3: Suche nach dem "Mehr" Dropdown als Orientierungspunkt
            () => {
                const moreButtons = document.querySelectorAll('[aria-label*="Weitere"], [aria-label*="More"], [aria-expanded]');
                for (let button of moreButtons) {
                    const container = button.closest('div[role="navigation"], div').parentElement;
                    if (container && container.querySelectorAll('a').length >= 3) {
                        return container;
                    }
                }
                return null;
            }
        ];

        // Versuche alle Strategien
        for (let i = 0; i < strategies.length; i++) {
            const result = strategies[i]();
            if (result) {
                console.log(`Tab-Navigation gefunden mit Strategie ${i + 1}`);
                return result;
            }
        }
        
        console.log('Keine Tab-Navigation gefunden');
        return null;
    }

    function addMapsTab() {
        console.log('Versuche Maps-Tab hinzuzufügen...');
        
        // Prüfe ob Maps-Tab bereits existiert
        const allLinks = document.querySelectorAll('a');
        for (let link of allLinks) {
            const text = link.textContent.toLowerCase();
            const href = link.href || '';
            if ((text.includes('maps') || text.includes('karten')) && 
                (href.includes('maps') || href.includes('tbm=') || text.length < 20)) {
                console.log('Maps-Tab bereits vorhanden');
                return;
            }
        }

        const tabContainer = findTabNavigation();
        if (!tabContainer) {
            console.log('Tab-Container nicht gefunden');
            return;
        }

        // Finde alle Link-Elemente im Container
        const tabLinks = tabContainer.querySelectorAll('a');
        if (tabLinks.length === 0) {
            console.log('Keine Tab-Links gefunden');
            return;
        }

        // Finde einen geeigneten Tab zum Klonen (nicht "Alle", da der oft anders aussieht)
        let templateLink = null;
        for (let link of tabLinks) {
            const text = link.textContent.toLowerCase();
            if (text.includes('bilder') || text.includes('images') || 
                text.includes('videos') || text.includes('news')) {
                templateLink = link;
                break;
            }
        }
        
        // Fallback: nimm den zweiten Link
        if (!templateLink && tabLinks.length > 1) {
            templateLink = tabLinks[1];
        }

        if (!templateLink) {
            console.log('Keinen geeigneten Template-Link gefunden');
            return;
        }

        // Klone das parent element (listitem oder div)
        const templateParent = templateLink.closest('[role="listitem"]') || 
                              templateLink.parentElement;
        const newTabItem = templateParent.cloneNode(true);
        
        // Suchbegriff ermitteln
        const searchQuery = new URLSearchParams(window.location.search).get('q') || '';
        
        // Sprache bestimmen
        const language = document.documentElement.lang || navigator.language || 'en';
        const tabText = language.startsWith('de') ? 'Karten' : 'Maps';
        
        // Den geklonten Tab anpassen
        const newLink = newTabItem.querySelector('a');
        if (newLink) {
            // URL setzen
            newLink.href = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
            
            // Entferne aktive Zustände BEVOR wir Text ändern
            newLink.removeAttribute('aria-current');
            newLink.removeAttribute('aria-selected');
            newLink.removeAttribute('aria-disabled');
            
            // Entferne "selected" und andere aktive Attribute von allen Kindelementen
            const activeElements = newTabItem.querySelectorAll('[selected], [aria-current], [aria-selected="true"]');
            activeElements.forEach(elem => {
                elem.removeAttribute('selected');
                elem.removeAttribute('aria-current');
                elem.removeAttribute('aria-selected');
                elem.setAttribute('aria-selected', 'false');
            });
            
            // Text ändern - gezielter nach dem span mit Tab-Text suchen
            let textChanged = false;
            
            // Suche spezifisch nach dem Tab-Text span (meist hat CSS-Klasse mit "R1" oder ähnlich)
            const textSpans = newTabItem.querySelectorAll('span');
            for (let span of textSpans) {
                const text = span.textContent.trim();
                // Prüfe ob es der Haupt-Tab-Text ist (nicht Icon oder anderer Text)
                if (text.length > 2 && text.length < 20 && 
                    text.match(/^[A-Za-zÄÖÜäöüß\s]+$/)) {
                    span.textContent = tabText;
                    textChanged = true;
                    break;
                }
            }
            
            // Fallback: suche nach div-Elementen
            if (!textChanged) {
                const textDivs = newTabItem.querySelectorAll('div');
                for (let div of textDivs) {
                    const text = div.textContent.trim();
                    if (text.length > 2 && text.length < 20 && 
                        text.match(/^[A-Za-zÄÖÜäöüß\s]+$/) &&
                        !div.querySelector('*')) { // Keine Kindelemente
                        div.textContent = tabText;
                        textChanged = true;
                        break;
                    }
                }
            }
            
            // Letzter Fallback
            if (!textChanged) {
                newLink.textContent = tabText;
            }
            
            // Sicherstellen dass der Link richtige CSS-Klassen hat
            const originalClasses = templateLink.className;
            newLink.className = originalClasses;
            
            // Kopiere jsaction Attribute falls vorhanden
            if (templateLink.hasAttribute('jsaction')) {
                newLink.setAttribute('jsaction', templateLink.getAttribute('jsaction'));
            }
            if (templateLink.hasAttribute('data-ved')) {
                newLink.removeAttribute('data-ved'); // Entferne tracking, da es unique sein sollte
            }
        }

        // Position zum Einfügen finden
        let insertAfter = templateParent;
        
        // Suche nach "Bilder" Tab für bessere Positionierung
        for (let link of tabLinks) {
            const text = link.textContent.toLowerCase();
            if (text.includes('bilder') || text.includes('images')) {
                insertAfter = link.closest('[role="listitem"]') || link.parentElement;
                break;
            }
        }

        // Tab einfügen
        if (insertAfter.nextSibling) {
            tabContainer.insertBefore(newTabItem, insertAfter.nextSibling);
        } else {
            tabContainer.appendChild(newTabItem);
        }
        
        console.log('Maps-Tab erfolgreich hinzugefügt!');
    }

    // Robuste Initialisierung
    function initialize() {
        // Warte bis die Seite richtig geladen ist
        if (document.querySelector('input[name="q"]')) {
            const delays = [500, 1200, 2500];
            delays.forEach((delay, index) => {
                setTimeout(() => {
                    console.log(`Maps-Tab Versuch ${index + 1}`);
                    addMapsTab();
                }, delay);
            });
        } else {
            // Seite noch nicht fertig geladen, warte länger
            setTimeout(initialize, 1000);
        }
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    console.log('Google Maps Tab Userscript v0.6 (robust) geladen');
})();