// ==UserScript==
// @name         Clarify Extension Box Unbegrenzer (Optimiert)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Entfernt Höhenbegrenzung und Scrollbars von der Clarify Extension Textbox (optimiert)
// @author       Du
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535503/Clarify%20Extension%20Box%20Unbegrenzer%20%28Optimiert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535503/Clarify%20Extension%20Box%20Unbegrenzer%20%28Optimiert%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Debounce-Funktion zur Leistungsverbesserung
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Optimierte Funktion zum Entfernen der Scrollbars
    function entferneScrollbars() {
        const summaryApp = document.getElementById('summaryApp');
        if (!summaryApp) return;
        
        // Alle relevanten Container im summaryApp finden
        const containers = summaryApp.querySelectorAll('div[style*="overflow"], div[style*="max-height"]');
        containers.forEach(container => {
            container.style.maxHeight = 'none';
            container.style.overflow = 'visible';
        });
        
        // Speziell nach der Textbox suchen
        const textBox = summaryApp.querySelector('.svelte-1usadaz.box-border.pr-2');
        if (textBox) {
            textBox.style.maxHeight = 'none';
            textBox.style.overflow = 'visible';
        }
    }
    
    // Debounced-Version der Funktion
    const debouncedEntferneScrollbars = debounce(entferneScrollbars, 200);
    
    // Funktion zum Starten der Beobachtung
    function startBeobachtung() {
        const summaryApp = document.getElementById('summaryApp');
        if (!summaryApp) {
            // Wenn summaryApp noch nicht existiert, auf DOM-Änderungen warten
            const bodyObserver = new MutationObserver((mutations) => {
                if (document.getElementById('summaryApp')) {
                    bodyObserver.disconnect();
                    startBeobachtung();
                }
            });
            bodyObserver.observe(document.body, { childList: true, subtree: true });
            return;
        }
        
        // Nur den summaryApp beobachten, nicht das gesamte Dokument
        const observer = new MutationObserver(debouncedEntferneScrollbars);
        observer.observe(summaryApp, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        // Initial ausführen
        entferneScrollbars();
    }
    
    // Skript starten
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startBeobachtung);
    } else {
        startBeobachtung();
    }
})();
