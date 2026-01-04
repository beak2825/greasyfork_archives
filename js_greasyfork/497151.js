// ==UserScript==
// @name         Manga-Filter
// @namespace    https://proxer.me/user/614329#top
// @version      1
// @description  Entfernt Adult Mangas von der Top-Zugriffe seite
// @author       Awesome18
// @match        https://proxer.me/*
// @icon         https://img.icons8.com/?size=100&id=l24cyKyOwOjt&format=png&color=000000
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497151/Manga-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/497151/Manga-Filter.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let loading = false;
 
    // Funktion zum Überprüfen, ob ein Manga für Erwachsene ist
    function isAdultManga(mangaElement) {
        return mangaElement.textContent.includes('Adult');
    }
 
    // Funktion zum Abrufen der aktuellen Seitennummer aus der URL
    function getCurrentPage() {
        const url = window.location.href;
        const match = url.match(/\/(\d+)#top$/);
        return match ? parseInt(match[1], 10) : 1;
    }
 
    let nextPage = getCurrentPage() + 1;
 
    // Funktion zum Laden von mehr Inhalten und Anhängen
    async function loadMoreContent() {
        if (loading) return;
        loading = true;
 
        try {
            const response = await fetch(`https://proxer.me/manga/mangaseries/clicks/all/${nextPage}`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newMangas = doc.querySelectorAll('.infocell');
 
            let addedMangas = false;
 
            newMangas.forEach(manga => {
                if (!isAdultManga(manga)) {
                    document.querySelector('#main div').appendChild(manga);
                    addedMangas = true;
                }
            });
 
            nextPage++;
            loading = false;
 
            if (addedMangas) {
                filterMangas();
            }
 
        } catch (error) {
            console.error('Error loading more content:', error);
            loading = false;
        }
    }
 
 
 
    // Erstmaliges Filtern von Mangas
    function filterMangas() {
        let mangas = document.querySelectorAll('.infocell');
        let hasAdultContent = false;
 
        mangas.forEach(manga => {
            if (isAdultManga(manga)) {
                manga.style.display = 'none';
                hasAdultContent = true;
            }
        });
 
        if (hasAdultContent) {
            loadMoreContent();
        }
    }
 
    // Funktion zum Beobachten von Änderungen und erneuten Anwendung des Filters
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    filterMangas();
                }
            });
        });
 
        observer.observe(document.querySelector('#main div'), { childList: true, subtree: true });
    }
 
    // Erstmaliger Aufruf des Filters
    filterMangas();
 
    
    observeChanges();
 
    // Periodische Überprüfung zum erneuten Anwenden des Filters und Laden weiterer Inhalte
    setInterval(() => {
        nextPage = getCurrentPage() + 1;
        filterMangas();
        observeChanges();
    }, 2000); // 2 sekunden
})();