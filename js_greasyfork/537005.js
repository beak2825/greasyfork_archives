// ==UserScript==
// @name        Bandcamp: Show more dates
// @namespace   https://musicbrainz.org/user/chaban
// @version     2.1
// @description Shows Bandcamp releases' real "publish date" below the listed release date
// @tag         ai-created
// @author      w_biggs (~joks), chaban
// @license     MIT
// @match       https://*.bandcamp.com/track/*
// @match       https://*.bandcamp.com/album/*
// @include     /^https?://web\.archive\.org/web/\d+/https?://[^/]+/(?:album|track)/[^/]+\/?$/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/537005/Bandcamp%3A%20Show%20more%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/537005/Bandcamp%3A%20Show%20more%20dates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Formats a date string into an ISO 8601 date string (YYYY-MM-DD).
     * Includes validation to ensure the date is valid.
     * @param {string} dateString - The date string to format.
     * @returns {string|null} The formatted ISO 8601 date string, or null if input is invalid or date is unparseable.
     */
    function formatDate(dateString) {
        if (!dateString) {
            return null;
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn(`Invalid date string provided to formatDate: "${dateString}"`);
            return null;
        }
        return date.toISOString().slice(0, 10);
    }

    /**
     * Parses date information from a script element based on its type.
     * @param {HTMLScriptElement} scriptElement - The script element to parse.
     * @returns {Object} An object containing extracted raw date strings (or null if not found).
     */
    function parseScriptData(scriptElement) {
        const rawDates = {};

        if (scriptElement.type === 'application/ld+json') {
            try {
                const jsonld = JSON.parse(scriptElement.innerText);
                rawDates.ldPublished = jsonld?.datePublished;
                rawDates.ldModified = jsonld?.dateModified;
            } catch (e) {
                console.error('Error parsing JSON-LD from script element:', scriptElement, e);
            }
        } else if (scriptElement.hasAttribute('data-tralbum')) {
            try {
                const tralbumContent = scriptElement.getAttribute('data-tralbum');
                const jsonalbum = JSON.parse(tralbumContent);
                rawDates.tralbumPublish = jsonalbum.current?.publish_date;
                rawDates.tralbumModified = jsonalbum.current?.mod_date;
                rawDates.tralbumNew = jsonalbum.current?.new_date;
                rawDates.tralbumRelease = jsonalbum.current?.release_date;

                const embedContent = scriptElement.getAttribute('data-embed');
                const jsonembed = embedContent ? JSON.parse(embedContent) : null;
                if (typeof jsonembed?.embed_info?.public_embeddable === 'string' && !isNaN(new Date(jsonembed.embed_info.public_embeddable))) {
                     rawDates.embeddable = jsonembed.embed_info.public_embeddable;
                }
            } catch (e) {
                console.error('Error parsing data-tralbum or data-embed attributes from script element:', scriptElement, e);
            }
        }
        return rawDates;
    }

    /**
     * Main function to collect and display all unique date information.
     */
    function displayAllDates() {
        const creditsElement = document.querySelector('div.tralbum-credits');
        if (!creditsElement) {
            console.debug('Target div.tralbum-credits not found.');
            return;
        }

        const allRawDates = {};

        const allRelevantScripts = document.querySelectorAll('script[type="application/ld+json"], script[data-tralbum]');
        allRelevantScripts.forEach(scriptElement => {
            const currentScriptDates = parseScriptData(scriptElement);
            Object.assign(allRawDates, currentScriptDates);
        });

        // Use a Map to store unique formatted dates along with their associated labels, sources, and explanations.
        // The key will be the formatted date string, and the value will be an Array of objects {text: string, title: string}.
        const consolidatedDates = new Map(); // Map<formattedDateString, Array<{text: string, title: string}>>

        const datePriorities = [
            { key: 'tralbumRelease', label: 'released', source: 'release_date', explanation: 'The official release date set by the artist.' },
            { key: 'tralbumPublish', label: 'published', source: 'publish_date', explanation: 'The actual date the release became public on Bandcamp.' },
            { key: 'ldPublished', label: 'published', source: 'datePublished', explanation: 'The actual date the release became public on Bandcamp (Schema.org).' },
            { key: 'tralbumNew', label: 'created', source: 'new_date', explanation: 'The date the album/track entry was first saved as a draft.' },
            { key: 'tralbumModified', label: 'modified', source: 'mod_date', explanation: 'The last date any changes were saved to the release page.' },
            { key: 'ldModified', label: 'modified', source: 'dateModified', explanation: 'The last date any changes were saved to the release page (Schema.org).' },
            { key: 'embeddable', label: 'embeddable', source: 'public_embeddable', explanation: 'The date the release became publicly embeddable.' }
        ];

        datePriorities.forEach(({ key, label, source, explanation }) => {
            const rawDate = allRawDates[key];
            if (rawDate) {
                const formattedDate = formatDate(rawDate);
                if (formattedDate) {
                    if (!consolidatedDates.has(formattedDate)) {
                        consolidatedDates.set(formattedDate, []);
                    }
                    consolidatedDates.get(formattedDate).push({
                        text: `${label} (${source})`,
                        title: explanation
                    });
                }
            }
        });

        const finalDateLines = [];
        const scriptAddedParagraphs = creditsElement.querySelectorAll('p[data-userscript-added]');
        scriptAddedParagraphs.forEach(p => p.remove());

        const sortedFormattedDates = Array.from(consolidatedDates.keys()).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA.getTime() - dateB.getTime();
        });

        const outputParagraph = document.createElement('p');
        outputParagraph.setAttribute('data-userscript-added', 'true');

        sortedFormattedDates.forEach((formattedDate, dateIndex) => {
            let descriptions = consolidatedDates.get(formattedDate);

            if (descriptions.length > 0) {
                outputParagraph.appendChild(document.createTextNode(`${formattedDate}: `));

                descriptions.forEach((desc, descIndex) => {
                    const descSpan = document.createElement('span');
                    descSpan.textContent = desc.text;
                    descSpan.title = desc.title;
                    outputParagraph.appendChild(descSpan);

                    if (descIndex < descriptions.length - 1) {
                        outputParagraph.appendChild(document.createTextNode('; '));
                    }
                });

                if (dateIndex < sortedFormattedDates.length - 1) {
                    outputParagraph.appendChild(document.createElement('br'));
                }
            }
        });

        if (outputParagraph.hasChildNodes()) {
            creditsElement.appendChild(outputParagraph);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', displayAllDates);
    } else {
        displayAllDates();
    }

})();
