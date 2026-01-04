// ==UserScript==
// @name         YouTube "Save to Playlist" Fuzzy Search
// @author       NWP
// @description  Adds a search bar to filter YouTube playlists by name with fuzzy searching for the "Save" button dialog, namely "Save Video To...". The fuzzy search threshold is configurable, and you can toggle preserving the search input via a single Tampermonkey menu entry.
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @require      https://cdn.jsdelivr.net/npm/fuse.js@6.4.6/dist/fuse.min.js
// @downloadURL https://update.greasyfork.org/scripts/531928/YouTube%20%22Save%20to%20Playlist%22%20Fuzzy%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/531928/YouTube%20%22Save%20to%20Playlist%22%20Fuzzy%20Search.meta.js
// ==/UserScript==

// Fuse.js is licensed under the Apache License, Version 2.0
// https://www.apache.org/licenses/LICENSE-2.0
// Source: https://github.com/krisk/Fuse

(function() {
    'use strict';

    const FUZZY_MATCH_THRESHOLD = 0.5; // Looser search if closer to 1.0

    let preserveSearch = GM_getValue("preserveSearch", false);
    let menuCommandId;

    function updateMenu() {
        if (menuCommandId && GM_unregisterMenuCommand) {
            GM_unregisterMenuCommand(menuCommandId);
        }
        const label = preserveSearch ? "Disable Preserve Searching" : "Enable Preserve Searching";
        menuCommandId = GM_registerMenuCommand(label, togglePreserveSearch);
    }

    function togglePreserveSearch() {
        preserveSearch = !preserveSearch;
        GM_setValue("preserveSearch", preserveSearch);
        updateMenu();
    }

    GM_addValueChangeListener("preserveSearch", (_, __, newValue) => {
        preserveSearch = newValue;
        updateMenu();
    });

    updateMenu();

    function waitForDialogWidth(dialog, callback) {
        function checkWidth() {
            const rect = dialog.getBoundingClientRect();
            if (rect.width > 0) {
                callback(rect.width);
            } else {
                requestAnimationFrame(checkWidth);
            }
        }
        requestAnimationFrame(checkWidth);
    }

    function lockDialogWidth(dialog, initialWidth) {
        if (dialog.dataset.widthLocked) return;
        dialog.style.width = `${initialWidth}px`;
        dialog.style.minWidth = `${initialWidth}px`;
        dialog.style.maxWidth = `${initialWidth}px`;
        dialog.dataset.widthLocked = 'true';
    }

    function robustFocus(input, attempts = 10, interval = 100) {
        const tryFocus = () => {
            input.focus();
            if (document.activeElement === input || attempts <= 0) return;
            attempts--;
            setTimeout(tryFocus, interval);
        };
        tryFocus();
    }

    function addSearchBar() {
        const renderer = document.querySelector('ytd-add-to-playlist-renderer');
        if (!renderer || renderer.querySelector('#playlist-search-bar')) return;

        const searchBar = document.createElement('input');
        searchBar.id = 'playlist-search-bar';
        searchBar.type = 'text';
        searchBar.placeholder = 'Search playlists...';
        searchBar.style.width = '100%';
        searchBar.style.padding = '0.5em';
        searchBar.style.margin = '0.6em 0';
        searchBar.style.boxSizing = 'border-box';
        searchBar.style.border = '0.063em solid #ccc'; // ~1px
        searchBar.style.borderRadius = '0.25em';
        searchBar.style.fontSize = '1em';

        const playlistContainer = renderer.querySelector('#playlists');
        if (playlistContainer) {
            playlistContainer.parentNode.insertBefore(searchBar, playlistContainer);
        }

        const playlists = Array.from(document.querySelectorAll('ytd-playlist-add-to-option-renderer'));
        const playlistData = playlists.map(playlist => {
            const nameElement = playlist.querySelector('yt-formatted-string#label');
            const name = nameElement ? nameElement.textContent.trim() : '';
            return { name, element: playlist };
        });

        const fuse = new Fuse(playlistData, {
            keys: ['name'],
            threshold: FUZZY_MATCH_THRESHOLD,
        });
        searchBar.fuse = fuse;

        searchBar.addEventListener('input', filterPlaylists);

        const dialog = document.querySelector('tp-yt-paper-dialog');
        if (dialog) {
            waitForDialogWidth(dialog, (initialWidth) => {
                lockDialogWidth(dialog, initialWidth);
                if (!dialog.dataset.initialTop) {
                    dialog.dataset.initialTop = dialog.getBoundingClientRect().top;
                }
            });

            const dialogObserver = new MutationObserver((mutationsList) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'attributes' && !dialog.hasAttribute('hidden')) {
                        if (!preserveSearch) {
                            searchBar.value = '';
                            filterPlaylists({ target: searchBar });
                        } else if (dialog.dataset.initialTop) {
                            dialog.style.top = dialog.dataset.initialTop + 'px';
                        }
                        robustFocus(searchBar);
                    }
                });
            });
            dialogObserver.observe(dialog, { attributes: true });
        }

        robustFocus(searchBar);
    }

    function filterPlaylists(event) {
        const searchTerm = event.target.value.trim();
        const fuse = event.target.fuse;
        const playlists = document.querySelectorAll('ytd-playlist-add-to-option-renderer');

        if (searchTerm === '') {
            playlists.forEach(playlist => {
                playlist.style.display = '';
            });
        } else {
            const result = fuse.search(searchTerm);
            const matchingElements = new Set(result.map(item => item.item.element));
            playlists.forEach(playlist => {
                playlist.style.display = matchingElements.has(playlist) ? '' : 'none';
            });
        }
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('ytd-add-to-playlist-renderer')) {
            addSearchBar();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addSearchBar();
})();