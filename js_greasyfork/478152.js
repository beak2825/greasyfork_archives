// ==UserScript==
// @name         Yen Per GB
// @namespace    https://animebytes.tv/*
// @version      1.4
// @description  Remove low yen items, remove snatched items, and click download links with mouse wheel
// @author       Destinnyy
// @match        https://animebytes.tv/torrents*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478152/Yen%20Per%20GB.user.js
// @updateURL https://update.greasyfork.org/scripts/478152/Yen%20Per%20GB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let removedItemCount = 0; // Count of removed items
    let removedSnatchedCount = 0; // Count of removed snatched items

    // Function to remove snatched items asynchronously
    async function removeSnatchedItems() {
        let snatchedTorrents = document.querySelectorAll('.snatched-torrent');

        for (const torrent of snatchedTorrents) {
            await new Promise(resolve => {
                torrent.parentElement.parentElement.remove();
                removedSnatchedCount++;
                setTimeout(() => {
                    resolve();
                }, 0);
            });
        }

        console.log(`Removed ${removedSnatchedCount} snatched items.`);
    }

    // Function to remove items based on user-defined criteria
    function removeItemsBelowYenPerGB(limit) {
        let yenPerGBElements = document.querySelectorAll('.UserScriptToggleYenPerGB');

        yenPerGBElements.forEach((element) => {
            let innerHTML = element.innerHTML;
            let yenValue = parseInt(innerHTML.match(/\d+/));

            if (yenValue < limit) {
                let parent = element.parentElement;
                console.log(`Removed: ${parent.childNodes[1].childNodes[3].innerHTML}\nYen per GB: ${innerHTML}`);
                parent.remove();
                removedItemCount++;
            }
        });

        console.log(`Removed ${removedItemCount} items below ${limit} Yen per GB.`);
    }

    // Function to click download links with the text "DL" using mouse wheel click
    function clickDownloadLinks() {
        let downloadLinks = document.querySelectorAll('a');
        let clickedLinksCount = 0; // Count for successfully clicked links

        downloadLinks.forEach((link) => {
            if (link.textContent === 'DL' && simulateMouseWheelClick(link)) {
                clickedLinksCount++;
            }
        });

        console.log(`Clicked ${clickedLinksCount} download links.`);
    }

    // Function to simulate mouse wheel click on an element and return true for success
    function simulateMouseWheelClick(element) {
        let event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 1, // 1 for the middle mouse button (mouse wheel)
        });

        let clicked = element.dispatchEvent(event);
        return clicked;
    }

    // Add a single "DL all torrents under x" button to the page with a dynamic limit
    const browseNavRight = document.getElementById('browse_nav_right');
    if (browseNavRight) {
        const limit = 27; // Define the Yen per GB limit here

        browseNavRight.innerHTML += `<a href="#browse_nav_right" id="dltorrents">| DL all torrents under ${limit}¥/Gb</a>`;

        // Add a click event listener to the button
        const dlTorrentsButton = document.getElementById('dltorrents');

        if (dlTorrentsButton) {
            dlTorrentsButton.addEventListener('click', async () => {
                removedItemCount = 0; // Reset removed item count
                removedSnatchedCount = 0; // Reset removed snatched item count

                await removeSnatchedItems(); // Remove snatched items first asynchronously
                removeItemsBelowYenPerGB(limit);
                clickDownloadLinks();
            });
        }
    }
})();