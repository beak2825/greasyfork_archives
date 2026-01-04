// ==UserScript== 
// @name         Add Plex Link to Letterboxd
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      3.5
// @description  Adds a Plex link to Letterboxd watch section
// @match        https://letterboxd.com/film/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/511707/Add%20Plex%20Link%20to%20Letterboxd.user.js
// @updateURL https://update.greasyfork.org/scripts/511707/Add%20Plex%20Link%20to%20Letterboxd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const plexServerIp = GM_getValue('plexServerIp') || prompt("Please enter your Plex server IP:");
    const plexToken = GM_getValue('plexToken') || prompt("Please enter your Plex token:");
    const plexServerId = GM_getValue('plexServerId') || prompt("Please enter your Plex server ID:");
    const plexLibrarySectionId = GM_getValue('plexLibrarySectionId') || prompt("Please enter your Plex library section ID:");

    // Store the IP, token, server ID, and library section ID if they were just provided
    if (!GM_getValue('plexServerIp')) {
        GM_setValue('plexServerIp', plexServerIp);
    }
    if (!GM_getValue('plexToken')) {
        GM_setValue('plexToken', plexToken);
    }
    if (!GM_getValue('plexServerId')) {
        GM_setValue('plexServerId', plexServerId);
    }
    if (!GM_getValue('plexLibrarySectionId')) {
        GM_setValue('plexLibrarySectionId', plexLibrarySectionId);
    }

    const plexBaseUrl = `http://${plexServerIp}:32400`; // Ensure HTTP

    // Function to get the rating_key from Plex for a specific movie title and year
    function getRatingKey(movieTitle, movieYear) {
        const sanitizedTitle = movieTitle
            .trim()
            .toLowerCase()
            .replace(/\u00A0/g, ' ')
            .replace(/\s+/g, ' ');

        const url = `${plexBaseUrl}/library/sections/${plexLibrarySectionId}/all?X-Plex-Token=${plexToken}&title=${encodeURIComponent(sanitizedTitle)}&year=${encodeURIComponent(movieYear)}`;

        console.log(`Fetching URL: ${url}`); // Log the URL used for fetching the title

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response.responseText, "application/xml");
                        const metadata = xmlDoc.getElementsByTagName("Video");
                        if (metadata.length > 0) {
                            const ratingKey = metadata[0].getAttribute("ratingKey");
                            console.log(`Found ratingKey: ${ratingKey}`); // Log found ratingKey
                            resolve(ratingKey);
                        } else {
                            console.log("No metadata found for the title.");
                            resolve(null);
                        }
                    } else {
                        reject(`Error fetching from Plex: ${response.statusText}`);
                    }
                },
                onerror: function(error) {
                    reject(`Request failed: ${error}`);
                }
            });
        });
    }

    // Function to add the Plex link if the rating_key is found
    async function addPlexLink() {
        const titleElement = document.querySelector('h1[class*="headline"]');
        const yearElement = document.querySelector('div.releaseyear');
        const movieTitle = titleElement ? titleElement.innerText : '';
        const movieYear = yearElement ? yearElement.innerText.trim() : '';

        if (!movieTitle) {
            console.log("No movie title found.");
            return;
        }

        console.log(`Searching for movie title: ${movieTitle} (${movieYear})`); // Log movie title

        try {
            const ratingKey = await getRatingKey(movieTitle, movieYear);
            if (ratingKey) {
                const plexLinkHTML = `
                    <p id="service-plex" class="service -plex">
                        <a href="https://app.plex.tv/desktop/#!/server/${plexServerId}/details?key=%2Flibrary%2Fmetadata%2F${ratingKey}" class="label track-event tooltip" target="_blank" rel="nofollow noopener noreferrer" data-original-title="View on Plex">
                            <span class="brand">
                                <img src="https://user-images.githubusercontent.com/58919902/70870444-48efc180-1f48-11ea-9994-dff2df2d9484.png" width="24" height="24" alt="Plex">
                            </span>
                            <span class="title">Plex</span>
                        </a>
                    </p>
                `;
                const servicesSection = document.querySelector('section.services');
                if (servicesSection) {
                    const existingLink = document.getElementById('service-plex');
                    if (!existingLink) {
                        servicesSection.insertAdjacentHTML('afterbegin', plexLinkHTML);
                        console.log("Plex link added as the first item in services section.");
                    } else {
                        console.log("Plex link already exists.");
                    }
                } else {
                    console.log("Services section not found. Attempting to replace 'Not streaming' message.");
                    replaceNotStreamingMessage(ratingKey);
                }
            } else {
                console.log(`No rating key found for: ${movieTitle}`);
                replaceNotStreamingMessage();
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Function to replace the "Not streaming" message with the Plex link
    function replaceNotStreamingMessage(ratingKey) {
        const notStreamingDiv = document.querySelector('section.watch-panel.js-watch-panel div.other.-message.js-not-streaming');
        if (notStreamingDiv) {
            const plexLinkHTML = `
                <section class="services">
                    <p id="service-plex" class="service -plex">
                        <a href="https://app.plex.tv/desktop/#!/server/${plexServerId}/details?key=%2Flibrary%2Fmetadata%2F${ratingKey}" class="label track-event tooltip" target="_blank" rel="nofollow noopener noreferrer" data-original-title="View on Plex">
                            <span class="brand">
                                <img src="https://user-images.githubusercontent.com/58919902/70870444-48efc180-1f48-11ea-9994-dff2df2d9484.png" width="24" height="24" alt="Plex">
                            </span>
                            <span class="title">Plex</span>
                        </a>
                    </p>
                </section>
            `;
            notStreamingDiv.outerHTML = plexLinkHTML;
            console.log("Replaced 'Not streaming' message with Plex link.");
        } else {
            console.log("No 'Not streaming' message found.");
        }
    }

    // Wait for the page to load the necessary elements before adding the Plex link
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (document.querySelector('section.services') || document.querySelector('section.watch-panel.js-watch-panel div.other.-message.js-not-streaming')) {
                addPlexLink();
                observer.disconnect();  // Stop observing after the Plex link is added
            }
        });
    });

    // Start observing changes in the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
