// ==UserScript==
// @name         Redacted Bandcamp Embed
// @namespace    github.com
// @version      1.0.0
// @description  Adds Bandcamp embed players below Bandcamp links
// @author       e4xit
// @match        https://redacted.sh/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      bandcamp.com
// @downloadURL https://update.greasyfork.org/scripts/528626/Redacted%20Bandcamp%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/528626/Redacted%20Bandcamp%20Embed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS variables to the document
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --bandcamp-width: 600px;
            --bandcamp-height: 307px;
            --bandcamp-bg-color: 181a1b;
            --bandcamp-link-color: 056cc4;
        }
    `;
    document.head.appendChild(style);

    // Wait for page to fully load
    window.addEventListener('load', function() {
        // Find all links on the page
        const links = document.querySelectorAll('a[href*="bandcamp.com"]');

        links.forEach(function(link) {
            // Get the URL
            const url = link.href;

            // Skip if already processed
            if (link.dataset.processed === 'true') return;
            link.dataset.processed = 'true';

            // Extract album/track information from URL
            const match = url.match(/bandcamp\.com\/(album|track)\/([^/?#]+)/);
            if (!match) return;

            const type = match[1]; // album or track
            const slug = match[2]; // the album/track slug

            // Function to create and insert embed
            function createEmbed(albumId) {
                // Get custom colors from CSS variables
                const style = getComputedStyle(document.documentElement);
                const bgColor = style.getPropertyValue('--bandcamp-bg-color').trim() || '181a1b';
                const linkColor = style.getPropertyValue('--bandcamp-link-color').trim() || '056cc4';
                const width = style.getPropertyValue('--bandcamp-width').trim() || '400px';
                const height = style.getPropertyValue('--bandcamp-height').trim() || '307px';

                // Create iframe element
                const iframe = document.createElement('iframe');
                iframe.style.border = '0';
                iframe.style.width = width;
                iframe.style.height = height;
                iframe.style.display = 'block';
                iframe.style.margin = '10px 0';

                // Construct iframe src
                let iframeSrc;
                if (type === 'album') {
                    iframeSrc = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=${bgColor}/linkcol=${linkColor}/artwork=small/transparent=true/`;
                } else {
                    iframeSrc = `https://bandcamp.com/EmbeddedPlayer/track=${albumId}/size=large/bgcol=${bgColor}/linkcol=${linkColor}/artwork=small/transparent=true/`;
                }

                iframe.setAttribute('src', iframeSrc);
                iframe.setAttribute('seamless', '');

                // Insert iframe after the link
                if (link.nextSibling) {
                    link.parentNode.insertBefore(iframe, link.nextSibling);
                } else {
                    link.parentNode.appendChild(iframe);
                }

                // Add a note about the embed being added by the script
                const note = document.createElement('div');
                note.style.fontSize = '11px';
                note.style.marginBottom = '10px';
                note.style.color = '#888';
                note.textContent = 'Bandcamp embed added by userscript';

                link.parentNode.insertBefore(note, iframe);
            }

            // Using GM_xmlhttpRequest for cross-origin requests in Tampermonkey
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    const html = response.responseText;

                    // Look for album ID in the page content
                    const idMatch = html.match(/item_id&quot;:(\d+)/);

                    if (idMatch && idMatch[1]) {
                        // Found the album ID in the meta tags
                        createEmbed(idMatch[1]);
                    } else {
                        // Alternative methods to find the ID
                        const ogVideoMatch = html.match(/og:video" content=".*?album=(\d+)/);
                        if (ogVideoMatch && ogVideoMatch[1]) {
                            createEmbed(ogVideoMatch[1]);
                        } else {
                            // If we still can't find it, look for EmbeddedPlayer in the HTML
                            const embedMatch = html.match(/EmbeddedPlayer\/.*?album=(\d+)/);
                            if (embedMatch && embedMatch[1]) {
                                createEmbed(embedMatch[1]);
                            } else {
                                // Fallback - create embed with a generic ID
                                console.log("Couldn't find Bandcamp ID, using fallback");
                                createEmbed("0");
                            }
                        }
                    }
                },
                onerror: function(error) {
                    console.error("Error fetching Bandcamp page:", error);
                    // Fallback - create embed anyway
                    createEmbed("0");
                }
            });
        });
    });
})();