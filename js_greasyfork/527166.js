// ==UserScript==
// @name         BTN Copy Media Info
// @namespace    http://tampermonkey.net/
// @version      2025-02-17
// @description  Allows users to copy a torrent's media info straight from the series page
// @author       BibliophilicOtter
// @match        https://broadcasthe.net/series.php?id=*
// @icon         https://broadcasthe.net/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527166/BTN%20Copy%20Media%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/527166/BTN%20Copy%20Media%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all [DL] links
    document.querySelectorAll('a[title="Download"]').forEach(originalLink => {
        // Find the parent <td> that contains both the [DL] link and the second torrent link
        let parentTd = originalLink.closest("td");

        // Find the second link (torrent details link, next sibling anchor tag)
        let secondLink = parentTd.querySelector("a[href*='torrents.php?id=']");

        if (!secondLink) return; // If no second link found, skip this row

        // Create the new "CMI" button
        let cmiButton = document.createElement("a");
        cmiButton.textContent = "CMI";
        cmiButton.href = "#";
        cmiButton.title = "Copy MediaInfo from torrent page";
        cmiButton.style.textDecoration = "none";

        // Add event listener to fetch and copy the Unique ID when clicked
        cmiButton.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default behavior

            let torrentPageUrl = secondLink.href;

            // Fetch the torrent page content
            GM_xmlhttpRequest({
                method: "GET",
                url: torrentPageUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(response.responseText, "text/html");

                        // Find the first <tr class="pad"> elements (ignoring "pad hide")
                        let row = doc.querySelector("tr.pad:not(.hide)");

                        if (row) {
                            let visibleblockquotes = row.querySelectorAll("blockquote");
                            // Find the blockquote containing "Unique ID" hopefully that's the right one
                            for (let blockquote of visibleblockquotes) {
                                if (blockquote && blockquote.textContent.includes("Unique ID")) {
                                    let uniqueIdText = blockquote.textContent;

                                    // Copy to clipboard
                                    GM_setClipboard(uniqueIdText);
                                    return;
                                }
                            }
                        }
                        alert("MediaInfo not found on the page. This is likely an error on my part. Sorry.");
                    } else {
                        alert("Failed to fetch torrent page.");
                    }
                },
                onerror: function() {
                    alert("Error fetching the torrent details page.");
                }
            });
        });

        // Insert a space and the CMI button next to the [DL] link
        let spacer = document.createTextNode(" ] [ ");
        originalLink.parentNode.insertBefore(spacer, originalLink.nextSibling);
        originalLink.parentNode.insertBefore(cmiButton, spacer.nextSibling);
    });
})();