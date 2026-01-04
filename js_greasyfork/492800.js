// ==UserScript==
// @name         Hide Unreleased Albums with Auto Paging and Toggle
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Automatically load more albums until released ones are found, with a toggle to show/hide unreleased albums.
// @author       x.com/bl0w
// @license      MIT
// @match        https://rateyourmusic.com/new-music/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/492800/Hide%20Unreleased%20Albums%20with%20Auto%20Paging%20and%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/492800/Hide%20Unreleased%20Albums%20with%20Auto%20Paging%20and%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideUnreleased = true; // State to track the toggle status

    function parseDate(dateStr) {
        const months = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
        let parts = dateStr.split(' ');
        let day = 1;
        let month, year;
        if (parts.length === 2) {
            month = months.indexOf(parts[0]);
            year = parseInt(parts[1], 10);
        } else if (parts.length === 3) {
            day = parseInt(parts[0], 10);
            month = months.indexOf(parts[1]);
            year = parseInt(parts[2], 10);
        }
        return new Date(year, month, day);
    }

    function toggleUnreleasedAlbums() {
        const albums = document.querySelectorAll('.newreleases_itembox');
        const today = new Date();

        let allHidden = true; // Track if all albums are hidden

        albums.forEach(album => {
            const releaseDateText = album.querySelector('.newreleases_item_releasedate').textContent;
            const releaseDate = parseDate(releaseDateText);
            if (hideUnreleased && releaseDate > today) {
                album.style.display = 'none';
            } else {
                album.style.display = '';
                allHidden = false; // Found at least one album to display
            }
        });

        // Toggle the state for the next click
        hideUnreleased = !hideUnreleased;

        // Trigger loading more albums if all are hidden and we are hiding unreleased albums
        if (allHidden && hideUnreleased) {
            loadMoreAlbums();
        }
    }

    function loadMoreAlbums() {
        const viewMoreButton = document.getElementById('view_more_new_releases_all');
        if (viewMoreButton) {
            viewMoreButton.click();
        }
    }

    function addToggleButton() {
        const button = document.createElement('button');
        button.textContent = 'Toggle Upcoming Releases';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#007BFF'; // Set to a nice shade of blue
        button.style.color = '#FFFFFF'; // Set text color to white
        button.style.border = 'none'; // Remove any default border
        button.style.padding = '10px 15px'; // Add some padding for better appearance
        button.style.borderRadius = '5px'; // Round the corners slightly
        button.style.cursor = 'pointer'; // Change cursor on hover to indicate it's clickable

        button.onclick = toggleUnreleasedAlbums;

        document.body.appendChild(button);
    }

    window.addEventListener('load', () => {
        addToggleButton();
        toggleUnreleasedAlbums(); // Initialize with unreleased albums hidden
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length && hideUnreleased) {
                toggleUnreleasedAlbums();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();