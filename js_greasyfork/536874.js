// ==UserScript==
// @name         MusicBrainz: Hotkeys for selected entities
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.5.2
// @description  Adds hotkeys to perform actions on selected entities. "A" = Artwork, "D" = Delete, "E" = Edit, "W" = Merge, "Q" = Aliases, "R" = Relationship Editor
// @tag          ai-created
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/artist*
// @match        *://*.musicbrainz.org/area/*
// @match        *://*.musicbrainz.org/release-group/*
// @match        *://*.musicbrainz.org/label/*
// @match        *://*.musicbrainz.org/place/*
// @match        *://*.musicbrainz.org/isrc/*
// @match        *://*.musicbrainz.org/iswc/*
// @match        *://*.musicbrainz.org/report/*
// @match        *://*.musicbrainz.org/*/*/artists
// @match        *://*.musicbrainz.org/*/*/releases
// @match        *://*.musicbrainz.org/*/*/recordings
// @match        *://*.musicbrainz.org/*/*/release-groups
// @match        *://*.musicbrainz.org/*/*/events
// @match        *://*.musicbrainz.org/*/*/labels
// @match        *://*.musicbrainz.org/*/*/places
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536874/MusicBrainz%3A%20Hotkeys%20for%20selected%20entities.user.js
// @updateURL https://update.greasyfork.org/scripts/536874/MusicBrainz%3A%20Hotkeys%20for%20selected%20entities.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const entityTypes = {
        release: { actions: ['delete', 'edit', 'viewArtwork', 'aliases', 'edit-relationships'] },
        recording: { actions: ['delete', 'edit', 'aliases'] },
        work: { actions: ['edit', 'aliases'] },
        area: { actions: ['delete', 'edit', 'aliases'] },
        instrument: { actions: ['delete', 'edit', 'aliases'] },
        genre: { actions: ['delete', 'edit', 'aliases'] },
        'release-group': { actions: ['edit', 'aliases'] },
        event: { actions: ['edit', 'viewArtwork', 'aliases'] },
        place: { actions: ['edit', 'aliases'] },
        label: { actions: ['edit', 'aliases'] },
        series: { actions: ['edit', 'aliases'] }
    };

    /**
     * Extracts the entity type and MBID from the URL.
     * @param {string} url - The URL to extract from.
     * @returns {object|undefined} An object containing the entity type and MBID, or undefined if not detectable.
     */
    function extractEntityFromURL(url) {
        const entity = url.match(/([^/]+)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:$|\/|\?)/i);
        return entity ? {
            type: entity[1],
            mbid: entity[2]
        } : undefined;
    }

    /**
     * Extracts the entity type and MBID from the link. Uses extractEntityFromURL
     * @param {HTMLAnchorElement} link The link element.
     * @returns {object|null} An object containing the entity type and MBID, or null if not detectable.
     */
    function extractEntityInfoFromLink(link) {
        if (!link || !link.href) {
            return null;
        }
        const entityInfo = extractEntityFromURL(link.href);
        return entityInfo && entityTypes[entityInfo.type] ? entityInfo : null;
    }

    /**
     * Opens pages based on action.
     * @param {NodeListOf<HTMLInputElement>} checkboxes - Checkboxes of entities.
     * @param {string} action - Type of action (edit, delete, viewArtwork, aliases).
     */
    function openPages(checkboxes, action) {
        checkboxes.forEach((checkbox, index) => {
            const row = checkbox.closest('tr');
            if (row) {
                const entityLink = row.querySelector('a[href]');
                const entityInfo = extractEntityInfoFromLink(entityLink);
                if (entityInfo && entityTypes[entityInfo.type].actions.includes(action) && entityInfo.mbid) {
                    let url = `/${entityInfo.type}/${entityInfo.mbid}/${action}`;
                    if (action === 'viewArtwork') {
                        url = entityInfo.type === 'release' ? `/release/${entityInfo.mbid}/cover-art` : `/event/${entityInfo.mbid}/event-art`;
                    }
                    setTimeout(() => {
                        window.open(url, '_blank');
                    }, index * 1000);
                }
            }
        });
    }

    /**
     * Checks if an input element or editable element has focus, excluding the entity selection checkboxes.
     * @returns {boolean} True if a non-checkbox input, textarea, select, or contenteditable element has focus.
     */
    function isInputFocused() {
        const activeElement = document.activeElement;
        if (!activeElement) return false;

        const tagName = activeElement.tagName.toLowerCase();

        if (tagName === 'input' && (activeElement.name === 'add-to-merge' || activeElement.parentElement.className === 'checkbox-cell') && activeElement.type === 'checkbox') {
            return false;
        }

        return (
            tagName === 'input' ||
            tagName === 'textarea' ||
            tagName === 'select' ||
            activeElement.isContentEditable
        );
    }

    /**
     * Handles the keydown event for triggering actions.
     * @param {KeyboardEvent} event - The keydown event.
     */
    function handleKeyDown(event) {
        if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey || event.isComposing || isInputFocused()) {
            return;
        }

        const checkedSelector = 'input[name="add-to-merge"]:checked';
        const checkboxes = document.querySelectorAll(checkedSelector);

        switch (event.key) {
            case 'w':
                if (checkboxes.length > 1) {
                    const container = document.querySelector('.list-merge-buttons-row-container');
                    if (container) {
                        const buttons = container.querySelectorAll('button[formtarget="_blank"]');
                        if (buttons.length > 0) {
                            buttons[buttons.length - 1].click();
                        }
                    }
                }
                break;
            case 'd':
                if (checkboxes.length > 0) {
                    openPages(checkboxes, 'delete');
                }
                break;
            case 'e':
                if (checkboxes.length > 0) {
                    openPages(checkboxes, 'edit');
                }
                break;
            case 'a':
                if (checkboxes.length > 0) {
                    openPages(checkboxes, 'viewArtwork');
                }
                break;
            case 'q':
                if (checkboxes.length > 0) {
                    openPages(checkboxes, 'aliases');
                }
                break;
            case 'r':
                if (checkboxes.length > 0) {
                    openPages(checkboxes, 'edit-relationships');
                }
                break;
        }
    }

    document.addEventListener('keydown', handleKeyDown);
})();
