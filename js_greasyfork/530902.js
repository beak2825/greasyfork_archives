// ==UserScript==
// @name         Keine automatische App-Weiterleitung
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Versucht, in iOS Safari die automatische Weiterleitung zu Apps (z.B. Amazon-App) zu unterbinden.
// @author       Dein Name
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530902/Keine%20automatische%20App-Weiterleitung.user.js
// @updateURL https://update.greasyfork.org/scripts/530902/Keine%20automatische%20App-Weiterleitung.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // WICHTIG: Dieses Script kann nicht alle Universal Links abfangen. 
    // Manche Weiterleitungen passieren systembedingt sehr früh.
    // Trotzdem kann man einiges mit dem Entfernen bestimmter Metadaten erreichen.

    // 1. Entfernt Meta-Tags, die App-Banner und App-Öffnung forcieren
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                // Falls Knoten ein Element ist
                if (node.nodeType === 1) {
                    // meta[name="apple-itunes-app"] entfernen (Smart App Banner)
                    if (
                        node.tagName === 'META' &&
                        node.getAttribute('name') === 'apple-itunes-app'
                    ) {
                        node.remove();
                    }
                    // Link-Elemente mit rel="alternate" entfernen, die oft App-Links enthalten
                    if (
                        node.tagName === 'LINK' &&
                        node.getAttribute('rel') === 'alternate'
                    ) {
                        node.remove();
                    }
                }
            }
        }
    });

    // Observer startet auf documentElement-Ebene
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 2. Auch schon vorhandene Elemente entfernen (falls vor dem MutationObserver geladen)
    window.addEventListener('DOMContentLoaded', () => {
        // meta[name="apple-itunes-app"]
        document.querySelectorAll('meta[name="apple-itunes-app"]').forEach(meta => meta.remove());
        // link[rel="alternate"]
        document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());
    });

    // 3. (Optional) Klick-Event abfangen, um Weiterleitungen über spezielle URL-Schemata zu verhindern
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a');
        if (!target) return;
        
        // Beispiel: Wenn du speziell amazon-Links blockieren oder modifizieren möchtest.
        // Du könntest hier auch target.setAttribute('href', 'https://www.amazon.de/...') anpassen etc.
        // oder die Default-Action verhindern.
        if (/amazon\./i.test(target.href)) {
            event.preventDefault();
            // Öffnet stattdessen die HTTP-Variante
            window.location.href = target.href.replace(/^.*?:\/\//, 'https://');
        }
    }, true);
})();