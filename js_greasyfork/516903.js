// ==UserScript==
// @name         Filter News Articles by Keywords (Deutschlandfunk.de)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hides articles, paragraphs, and images containing keywords, with optional word replacement
// @match        *://www.deutschlandfunk.de/*
// @grant        none
// @license CC-ZERO
// @downloadURL https://update.greasyfork.org/scripts/516903/Filter%20News%20Articles%20by%20Keywords%20%28Deutschlandfunkde%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516903/Filter%20News%20Articles%20by%20Keywords%20%28Deutschlandfunkde%29.meta.js
// ==/UserScript==

// Einstellungen
const settings = {
    keywords: ['Trump', 'USA', 'US-Wahl'],  // Stichwörter zum Filtern
    replaceWords: { 'Trump': 'Drumpf' }     // Wortersetzung https://en.wikipedia.org/wiki/Drumpf
};

(function() {
    'use strict';

    // Funktion: Entferne Elemente mit bestimmten Stichwörtern
    function filterElements(rootElement = document) {
        // Relevante Container sammeln
        const containers = rootElement.querySelectorAll(`
            div.thema-teaser-info, 
            div.navigation-teaser-info, 
            article.b-news-item, 
            article.news-carousel-teaser-wrapper, 
            article.b-article-teaser.is-horizontal, 
            header.b-article-header, 
            div.article-details-text, 
            figcaption, 
            div.teaser-program-content-area, 
            div.b-image.article-teaser-image.is-over-container-small,
            div.article-teaser-info,
            p,
            article.b-two-column-teaser.b-teaser-audiotech, 
            section.two-column-teaser-column,
            div.b-thema,
            div.thema-teaser-info,
            div.audio-info-details-item
        `);

        // Container ausblenden, die Stichwörter enthalten
        containers.forEach(container => {
            const textContent = container.innerText || container.textContent;
            if (settings.keywords.some(keyword => textContent.toLowerCase().includes(keyword.toLowerCase()))) {
                container.style.display = 'none';
            }
        });

        // Bilder prüfen und ausblenden, wenn URL, alt oder title Attribute Stichwörter enthalten
        const images = rootElement.querySelectorAll('img');
        images.forEach(img => {
            const imageSrc = img.src.toLowerCase();
            const altText = img.alt ? img.alt.toLowerCase() : '';
            const titleText = img.title ? img.title.toLowerCase() : '';

            if (settings.keywords.some(keyword =>
                imageSrc.includes(keyword.toLowerCase()) ||
                altText.includes(keyword.toLowerCase()) ||
                titleText.includes(keyword.toLowerCase())
            )) {
                img.style.display = 'none';
            }
        });
    }

    // Funktion: Wörter ersetzen (ohne URLs zu ändern)
    function replaceWords(rootElement = document) {
        const elements = rootElement.querySelectorAll('*:not(script):not(style):not(a)');

        elements.forEach(element => {
            if (element.children.length === 0) { // Nur Textknoten bearbeiten
                let text = element.textContent;

                for (const [original, replacement] of Object.entries(settings.replaceWords)) {
                    const regex = new RegExp(`\\b${original}(s|'s)?\\b`, 'gi');
                    text = text.replace(regex, replacement);
                }

                element.textContent = text;
            }
        });
    }

    // Funktion: Hauptlogik ausführen
    function runFilters(rootElement = document) {
        filterElements(rootElement);
        replaceWords(rootElement);
    }

    // Skript beim Laden der Seite ausführen
    runFilters();

    // MutationObserver hinzufügen, um auf Änderungen im DOM zu reagieren
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    runFilters(node);
                }
            });
        });
    });

    // Starten des Beobachters für das gesamte Dokument
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
