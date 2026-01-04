// ==UserScript==
// @name         Impressum-Links in PDFs umwandeln
// @namespace    http://tampermonkey.net/
// @version      2025-01-08
// @description  Dieses Skript durchsucht eine Webseite nach Links, deren Adressen die Wörter „mpressum“, „atenschutz“ oder „rivacy“ enthalten. Dann aktualisiert es diese Links so, dass sie alle zu einem bestimmten Dokument namens „example.pdf“ führen, wenn sie angeklickt werden. Im Wesentlichen leitet es diese bestimmten Weblinks auf ein neues Ziel um. Praktisch, um Klicks auf PDF-Link zu simulieren.
// @author       Vanakh Chea
// @match        http*://*/*
// @grant        none
// @run-at      context-menu
// @downloadURL https://update.greasyfork.org/scripts/523210/Impressum-Links%20in%20PDFs%20umwandeln.user.js
// @updateURL https://update.greasyfork.org/scripts/523210/Impressum-Links%20in%20PDFs%20umwandeln.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Select all elements that match the selector
    var selectedElements = document.querySelectorAll("a[href*='mpressum'], a[href*='atenschutz'], a[href*='rivacy']");

    // Loop through the NodeList using a traditional for loop
    for (var i = 0; i < selectedElements.length; i++) {
        // Set the href attribute for each element to "/example.pdf"
        selectedElements[i].href = '/example.pdf';
    }
    // Your code here...
})();