// ==UserScript==
// @name         Zohar Sefaria English
// @namespace    http://binjomin.hu/
// @version      2024-12-22
// @description  Show links to English Baal Hasulam translation to Zohar commentaries shown in Sefaria
// @author       Binjomin Szanto-Varnagy
// @match        https://www.sefaria.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sefaria.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521489/Zohar%20Sefaria%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/521489/Zohar%20Sefaria%20English.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Mapping for chapter name replacements
    const chapterReplacements = [
        { sefaria: "Introduction", zohar: "Prologue" },
        // Add more mappings here as needed
    ];

    // Function to replace chapter names based on mapping
    function replaceChapterName(name) {
        for (const replacement of chapterReplacements) {
            if (name === replacement.sefaria) {
                return replacement.zohar;
            }
        }
        return name;
    }

    // Function to create the Zohar.com link
    function createZoharLink(referenceText) {
        const zoharRegex = /Zohar,\s+([\w\s]+)\s+(\d+):(\d+)/;
        const match = referenceText.match(zoharRegex);

        if (match) {
            let book = match[1].trim();
            const chapter = match[2];

            return `https://www.zohar.com/zohar/${book}/chapters/${chapter}`;
        }

        return null;
    }

    // Function to process Zohar references and add the links
    function enhanceZoharLinks() {
        // Select all elements that match Zohar references
        const zoharReferences = document.querySelectorAll(".contentSpan.en[lang='en']");

        zoharReferences.forEach(element => {
            if (element.textContent.includes('Zohar')) {
                const linkUrl = createZoharLink(element.textContent);
                if (linkUrl) {
                    const linkElement = document.createElement('a');
                    linkElement.href = linkUrl;
                    linkElement.target = '_blank';
                    linkElement.textContent = 'View on Zohar.com';
                    linkElement.style.marginLeft = '10px';
                    linkElement.style.color = '#007BFF';
                    linkElement.style.textDecoration = 'underline';

                    // Insert the new link after the Zohar reference
                    element.parentNode.insertBefore(linkElement, element.nextSibling);
                }
            }
        });
    }

    // Create a manual trigger button
    function createTriggerButton() {
        const headerDiv = document.querySelector('.header .headerInner');
        if (headerDiv) {
            const button = document.createElement('button');
            button.textContent = 'Add Zohar Links';
            button.style.marginLeft = '10px';
            button.style.padding = '10px';
            button.style.backgroundColor = '#007BFF';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            button.addEventListener('click', () => {
                enhanceZoharLinks();
            });

            headerDiv.appendChild(button);
        }
    }

    // Run the script when the page is fully loaded
    window.addEventListener('load', () => {
        createTriggerButton();
    });
})();

