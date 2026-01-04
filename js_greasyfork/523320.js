// ==UserScript==
// @name         MyDealz Kommentar-Editor Speichern/Laden
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Speichert und lädt Kommentartexte im MyDealz-Editor mit Strg+S und Strg+L
// @author       Claude 3.5 Opus
// @match        https://www.mydealz.de/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523320/MyDealz%20Kommentar-Editor%20SpeichernLaden.user.js
// @updateURL https://update.greasyfork.org/scripts/523320/MyDealz%20Kommentar-Editor%20SpeichernLaden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Speichern des Kommentartextes
    function saveComment(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            const articleId = getArticleId();
            const commentText = document.querySelector('.redactor-editor').innerHTML;
            localStorage.setItem(`comment_${articleId}`, commentText);
        }
    }

    // Funktion zum Laden des Kommentartextes
    function loadComment(event) {
        if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            const articleId = getArticleId();
            const commentText = localStorage.getItem(`comment_${articleId}`);
            if (commentText) {
                document.querySelector('.redactor-editor').innerHTML = commentText;
            }
        }
    }

    // Funktion zum Extrahieren der Artikel-ID aus der URL
    function getArticleId() {
        const url = window.location.href;
        const match = url.match(/-(\d+)/);
        return match ? match[1] : null;
    }

    // Event-Listener für Tastatureingaben hinzufügen
    document.addEventListener('keydown', saveComment);
    document.addEventListener('keydown', loadComment);
})();