// ==UserScript==
// @name         Gelbooru Visited and Type Highlighter
// @namespace    http://tampermonkey.net/
// @version      14.13.2
// @description  Marks previously visited images on Gelbooru, marks gifs as well similar to the built-in webm highlighting, and makes webm highlighting work in more places.
// @author       Xerodusk
// @homepage     https://greasyfork.org/en/users/460331-xerodusk
// @license      GPL-3.0-or-later
// @match        https://gelbooru.com/index.php*page=post*s=list*
// @match        https://gelbooru.com/index.php*page=post*s=view*
// @match        https://gelbooru.com/index.php*page=pool*s=show*
// @match        https://gelbooru.com/index.php*page=favorites*s=view*
// @match        https://gelbooru.com/index.php*page=tags*s=saved_search*
// @match        https://gelbooru.com/index.php*page=wiki*s=view*
// @match        https://gelbooru.com/index.php*page=account*s=profile*
// @match        https://gelbooru.com/index.php*page=comment*s=list*
// @grant        none
// @icon         https://gelbooru.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/398042/Gelbooru%20Visited%20and%20Type%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/398042/Gelbooru%20Visited%20and%20Type%20Highlighter.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

/*   configuration   */

// You can modify these from the "Highlighter Settings" item on the right side of the header on any page this runs on.

// Highlight colors
// Values can be hexadecimal, rgb, hsl, color name, or whatever CSS color definitions your browser supports
// However, you cannot use alpha channels (rgba, hsla) unless they are the same for both the unvisited and visited colors of each type
// That is an intentional browser limitation
const imgUnvisitedColor = localStorage.getItem('imgUnvisitedColor') || '#E1F5FE'; // Color for unvisted images
const imgVisitedColor = localStorage.getItem('imgVisitedColor') || '#2E7D32'; // Color for visited images
const webmUnvisitedColor = localStorage.getItem('webmUnvisitedColor') || '#1565C0'; // Color for unvisted WebMs
const webmVisitedColor = localStorage.getItem('webmVisitedColor') || '#C62828'; // Color for visited WebMs
const gifUnvisitedColor = localStorage.getItem('gifUnvisitedColor') || '#FFD600'; // Color for unvisited animated gifs/pngs
const gifVisitedColor = localStorage.getItem('gifVisitedColor') || '#6A1B9A'; // Color for visited animated gifs/pngs

// Whether to display visited/unvisited highlighting for your own favorites
// If false: Will only show visited/unvisited on other users' favorites pages
//           Animated GIF/WebM type highlighting will always be shown on all favorites
// If true:  Will also show visited/unvisited on your own favorites page
const displayCurrentUserFavoritesVisited = JSON.parse(localStorage.getItem('displayCurrentUserFavoritesVisited') || 'false');

// Whether to use the experimental workaround to display gif/webm highlighting on "More Like This" links on image pages
// If false: Will only show visited/unvisited highlighting on MLT links
//           Animated GIF/WebM type highlighting is disabled for MLT links underneath the image on image pages
// If true:  More Like This links will also show type highlighting for GIF/WebM
//           Although it may not always show up immediately, visited/univisted highlighting will always kick in right away
// NOTICE:   This is experimental and is not guaranteed to be perfect
const displayMoreLikeThisAnimatedTypes = JSON.parse(localStorage.getItem('displayMoreLikeThisAnimatedTypes') || 'true');

/*-------------------*/

// Tests whether value is in items
function inSortedList(items, value) {
    'use strict';

    function binarySearch(array, value, first, last) {
        if (first > last) {
            return false;
        }
        const middle = (last + first) >> 1;
        if (array[middle] === value) {
            return true;
        }
        if (array[middle] > value) {
            return binarySearch(array, value, first, middle - 1);
        } else {
            return binarySearch(array, value, middle + 1, last);
        }
    }
    return binarySearch(items, value, 0, items.length - 1);
}

// Inserts value in items if not already present, returns whether insertion took place
function insertIntoSortedList(items, value) {
    'use strict';

    let first = 0,
        last = items.length - 1,
        middle;
    while (first <= last) {
        middle = (last + first) >> 1;
        if (items[middle] > value) {
            last = middle - 1;
            continue;
        }
        first = middle + 1;
        if (items[middle] === value) {
            return false;
        }
    }
    items.splice(first, 0, value);
    return true;
}

// Check if link is in visited list
function markIfVisited(galleryLink, visitedIDs) {
    'use strict';

    const linkURL = new URL(galleryLink.getAttribute('href'), window.location.href);
    const linkSearchParams = new URLSearchParams(linkURL.search);
    const id = parseInt(linkSearchParams.get('id'));

    if (inSortedList(visitedIDs, id)) {
        galleryLink.classList.add('visited');
    }
}

// Checks all provided links and marks visited if in list
function markVisitedLinks(galleryLinks) {
    'use strict';

    let links = galleryLinks && Array.from(galleryLinks) || [];

    function applyVisitedToAllLinksInList() {
        const visitedIDs = JSON.parse(localStorage.getItem('visitedIDs')) || [];
        links.forEach(link => markIfVisited(link, visitedIDs));

        links = links.filter(link => !link.classList.contains('visited'));
        if (!links.length) {
            window.removeEventListener('storage', applyVisitedToAllLinksInList);
        }
    }

    // Also mark visited images opened in new tab/windows from this page, or by any other means while this page is open
    window.addEventListener('storage', applyVisitedToAllLinksInList);
    applyVisitedToAllLinksInList();
}

// Messy workaround for finding the type of "More Like This" links on image pages
function getAnimatedType(galleryLinks) {
    const event = new Event('tagsretrieve');

    let retrieved = galleryLinks.length;

    function checkImage(link) {
        const linkURL = new URL(link.href, window.location.href).href;

        fetch(linkURL).then(response => response.text()).then((responseText) => {
            const parser = new DOMParser();

            const htmlDoc = parser.parseFromString(responseText, 'text/html');

            const sideLinks = htmlDoc.querySelectorAll('ul#tag-list > li:not([class^="tag-type"]) > a');

            // Get tags for possible later use
            const tagsEditField = htmlDoc.querySelector('textarea#tags.tagBox[name="tags"]');
            const tags = tagsEditField.value;
            // Get rating for possible later use
            const ratingEditField = htmlDoc.querySelector('input[name="rating"][checked]');
            const ratingAbbrv = ratingEditField.value;
            let rating = '';
            switch (ratingAbbrv) {
                case 'e': rating = 'explicit'; break;
                case 'q': rating = 'questionable'; break;
                case 's': rating = 'sensitive'; break;
                case 'g': rating = 'general'; break;
                default: break;
            }
            // Get score for possible later use
            const linkSearchParams = new URLSearchParams(new URL(linkURL).search);
            const linkID = linkSearchParams.get('id');
            const score = htmlDoc.getElementById('psc' + linkID).textContent;

            const image = link.querySelector('img');

            image.dataset.tags = tags + '  score:' + score + ' rating:' + rating;

            retrieved--;
            if (retrieved === 0) {
                window.dispatchEvent(event);
            }

            for (let i = 0, len = sideLinks.length; i < len; i++) {
                if (sideLinks[i].textContent === 'Original image') {
                    const imageURL = sideLinks[i].href;

                    if (imageURL.endsWith('.webm')) {
                        if (image) {
                            image.classList.add('webm');
                        }
                    } else if (imageURL.endsWith('.gif') || tags.split(' ').includes('animated')) {
                        if (image) {
                            image.classList.add('gif');
                        }
                    }

                    break;
                }
            }
        });
    }

    galleryLinks.forEach(galleryLink => checkImage(galleryLink));
}

// Get current user's user ID, if exists
function getUserID() {
    'use strict';

    // Get user ID from cookie
    const userID = window.Cookie.get('user_id');

    return userID ? parseInt(userID) : -1;
}

// Create interface for history backups
function createBackupInterface() {
    'use strict';

    // Get header
    const header = document.getElementById('myTopnav') || document.querySelector('#navbar ul') || document.querySelector('.header .center .flat-list');
    if (!header) {
        return;
    }

    // Create button
    const openDialogButtonContainer = document.createElement('li');
    openDialogButtonContainer.classList.add('open-highlighter-dialog');
    const openDialogButton = document.createElement('a');
    openDialogButton.appendChild(document.createTextNode('Visited History Backups'));
    openDialogButton.setAttribute('role', 'button');
    openDialogButton.href = 'javascript:void(0)';
    openDialogButton.onclick = () => {
        let visitedIDs = localStorage.getItem('visitedIDs') || '[]';
        visitedIDs = visitedIDs.slice(0, visitedIDs.length - 1).slice(1);
        const textArea = dialogDataField;
        textArea.value = visitedIDs;
        textArea.select();
        dialog.classList.add('open');
    };
    openDialogButtonContainer.appendChild(openDialogButton);

    // Create dialog
    const dialog = document.createElement('div');
    dialog.id = 'backup-dialog';
    dialog.classList.add('highlighter-dialog');
    const dialogHeader = document.createElement('h2');
    dialogHeader.classList.add('highlighter-dialog-header');
    dialogHeader.appendChild(document.createTextNode('Back Up Visited Image History'));
    const dialogText = document.createElement('label');
    dialogText.classList.add('highlighter-dialog-text');
    dialogText.setAttribute('for', 'backup-dialog-data-field');
    dialogText.appendChild(document.createTextNode('Copy the content of the text field and save it somewhere. To import a backup, paste in the text field and click "Import" to overwrite the current history or "Merge" to combine them.'));
    const dialogDataField = document.createElement('textarea');
    dialogDataField.id = 'backup-dialog-data-field';
    dialogDataField.setAttribute('autocomplete', 'off');
    dialogDataField.setAttribute('name', 'backup-dialog-data-field');
    dialogDataField.setAttribute('rows', '3');

    // Create the buttons
    const dialogButtons = document.createElement('div');
    dialogButtons.classList.add('highlighter-dialog-buttons');
    const copyButton = document.createElement('button');
    const importButton = document.createElement('button');
    const mergeButton = document.createElement('button');
    const closeButton = document.createElement('button');
    copyButton.id = 'dialog-copy-button';
    copyButton.appendChild(document.createTextNode('Copy to Clipboard'));
    copyButton.onclick = async () => {
        const backupText = dialogDataField.value;
        try {
            await navigator.clipboard.writeText(backupText);
        } catch (e) {
            console.error('Failed to copy ', e);
        }
    };
    importButton.id = 'dialog-import-button';
    importButton.appendChild(document.createTextNode('Import'));
    importButton.onclick = () => {
        const textareaContents = dialogDataField.value.trim();
        if (!(/(^$)|(^[0-9]+(,[0-9]+)*$)/.test(textareaContents))) {
            alert('Invalid input');
            return false;
        }
        const importedIDs = JSON.parse('[' + textareaContents + ']');
        importedIDs.sort((a, b) => a - b);
        localStorage.setItem('visitedIDs', JSON.stringify(importedIDs));
        dialog.classList.remove('open');
    };
    mergeButton.id = 'highlighter-dialog-merge-button';
    mergeButton.appendChild(document.createTextNode('Merge'));
    mergeButton.onclick = () => {
        const textareaContents = dialogDataField.value.trim();
        if (!(/(^$)|(^[0-9]+(,[0-9]+)*$)/.test(textareaContents))) {
            alert('Invalid input');
            return false;
        }
        const importedIDs = JSON.parse('[' + textareaContents + ']');
        const visitedIDs = JSON.parse(localStorage.getItem('visitedIDs')) || [];
        const combinedIDs = [...importedIDs, ...visitedIDs];
        const mergedIDs = [...new Set(combinedIDs)];
        mergedIDs.sort((a, b) => a - b);
        localStorage.setItem('visitedIDs', JSON.stringify(mergedIDs));
        dialog.classList.remove('open');
    };
    closeButton.id = 'dialog-close-button';
    closeButton.appendChild(document.createTextNode('Close'));
    closeButton.onclick = () => dialog.classList.remove('open');
    if (navigator.clipboard) {
        dialogButtons.appendChild(copyButton);
    }
    dialogButtons.appendChild(importButton);
    dialogButtons.appendChild(mergeButton);
    dialogButtons.appendChild(closeButton);

    dialog.appendChild(dialogHeader);
    dialog.appendChild(dialogText);
    dialog.appendChild(dialogDataField);
    dialog.appendChild(dialogButtons);

    // Attach button to header
    header.appendChild(openDialogButtonContainer);
    // Attach dialog to page
    document.body.appendChild(dialog);
}

// Create interface for settings
function createSettingsInterface() {
    'use strict';

    // Get subheader
    const header = document.getElementById('myTopnav') || document.querySelector('#navbar ul') || document.querySelector('.header .center .flat-list');
    if (!header) {
        return;
    }

    // Create button
    const openSettingsButtonContainer = document.createElement('li');
    openSettingsButtonContainer.classList.add('open-highlighter-dialog');
    const openSettingsButton = document.createElement('a');
    openSettingsButton.appendChild(document.createTextNode('Highlighter Settings'));
    openSettingsButton.setAttribute('role', 'button');
    openSettingsButton.href = 'javascript:void(0)';
    openSettingsButton.onclick = () => dialog.classList.add('open');
    openSettingsButtonContainer.appendChild(openSettingsButton);

    // Create dialog
    const dialog = document.createElement('div');
    dialog.id = 'settings-dialog';
    dialog.classList.add('highlighter-dialog');
    const dialogHeader = document.createElement('h3');
    dialogHeader.classList.add('highlighter-dialog-header');
    dialogHeader.appendChild(document.createTextNode('Visited and Type Highlighter Settings'));
    dialog.appendChild(dialogHeader);

    const imgUnvisitedColorSetting = document.createElement('div');
    imgUnvisitedColorSetting.classList.add('highlighter-setting-single');
    const imgUnvisitedColorInput = document.createElement('input');
    imgUnvisitedColorInput.id = 'img-unvisited-input';
    imgUnvisitedColorInput.setAttribute('name', 'img-unvisited-input');
    imgUnvisitedColorInput.setAttribute('type', 'color');
    imgUnvisitedColorInput.value = imgUnvisitedColor;
    const imgUnvisitedColorLabel = document.createElement('label');
    imgUnvisitedColorLabel.classList.add('highlighter-dialog-text');
    imgUnvisitedColorLabel.setAttribute('for', 'img-unvisited-input');
    imgUnvisitedColorLabel.appendChild(document.createTextNode('Unvisited Color'));
    imgUnvisitedColorSetting.appendChild(imgUnvisitedColorInput);
    imgUnvisitedColorSetting.appendChild(imgUnvisitedColorLabel);

    const imgVisitedColorSetting = document.createElement('div');
    imgVisitedColorSetting.classList.add('highlighter-setting-single');
    const imgVisitedColorInput = document.createElement('input');
    imgVisitedColorInput.id = 'img-visited-input';
    imgVisitedColorInput.setAttribute('name', 'img-visited-input');
    imgVisitedColorInput.setAttribute('type', 'color');
    imgVisitedColorInput.value = imgVisitedColor;
    const imgVisitedColorLabel = document.createElement('label');
    imgVisitedColorLabel.classList.add('highlighter-dialog-text');
    imgVisitedColorLabel.setAttribute('for', 'img-visited-input');
    imgVisitedColorLabel.appendChild(document.createTextNode('Visited Color'));
    imgVisitedColorSetting.appendChild(imgVisitedColorInput);
    imgVisitedColorSetting.appendChild(imgVisitedColorLabel);

    const webmUnvisitedColorSetting = document.createElement('div');
    webmUnvisitedColorSetting.classList.add('highlighter-setting-single');
    const webmUnvisitedColorInput = document.createElement('input');
    webmUnvisitedColorInput.id = 'webm-unvisited-input';
    webmUnvisitedColorInput.setAttribute('name', 'webm-unvisited-input');
    webmUnvisitedColorInput.setAttribute('type', 'color');
    webmUnvisitedColorInput.value = webmUnvisitedColor;
    const webmUnvisitedColorLabel = document.createElement('label');
    webmUnvisitedColorLabel.classList.add('highlighter-dialog-text');
    webmUnvisitedColorLabel.setAttribute('for', 'webm-unvisited-input');
    webmUnvisitedColorLabel.appendChild(document.createTextNode('WebM Unvisited Color'));
    webmUnvisitedColorSetting.appendChild(webmUnvisitedColorInput);
    webmUnvisitedColorSetting.appendChild(webmUnvisitedColorLabel);

    const webmVisitedColorSetting = document.createElement('div');
    webmVisitedColorSetting.classList.add('highlighter-setting-single');
    const webmVisitedColorInput = document.createElement('input');
    webmVisitedColorInput.id = 'webm-visited-input';
    webmVisitedColorInput.setAttribute('name', 'webm-visited-input');
    webmVisitedColorInput.setAttribute('type', 'color');
    webmVisitedColorInput.value = webmVisitedColor;
    const webmVisitedColorLabel = document.createElement('label');
    webmVisitedColorLabel.classList.add('highlighter-dialog-text');
    webmVisitedColorLabel.setAttribute('for', 'webm-visited-input');
    webmVisitedColorLabel.appendChild(document.createTextNode('WebM Visited Color'));
    webmVisitedColorSetting.appendChild(webmVisitedColorInput);
    webmVisitedColorSetting.appendChild(webmVisitedColorLabel);

    const gifUnvisitedColorSetting = document.createElement('div');
    gifUnvisitedColorSetting.classList.add('highlighter-setting-single');
    const gifUnvisitedColorInput = document.createElement('input');
    gifUnvisitedColorInput.id = 'gif-unvisited-input';
    gifUnvisitedColorInput.setAttribute('name', 'gif-unvisited-input');
    gifUnvisitedColorInput.setAttribute('type', 'color');
    gifUnvisitedColorInput.value = gifUnvisitedColor;
    const gifUnvisitedColorLabel = document.createElement('label');
    gifUnvisitedColorLabel.classList.add('highlighter-dialog-text');
    gifUnvisitedColorLabel.setAttribute('for', 'gif-unvisited-input');
    gifUnvisitedColorLabel.appendChild(document.createTextNode('GIF Unvisited Color'));
    gifUnvisitedColorSetting.appendChild(gifUnvisitedColorInput);
    gifUnvisitedColorSetting.appendChild(gifUnvisitedColorLabel);

    const gifVisitedColorSetting = document.createElement('div');
    gifVisitedColorSetting.classList.add('highlighter-setting-single');
    const gifVisitedColorInput = document.createElement('input');
    gifVisitedColorInput.id = 'gif-visited-input';
    gifVisitedColorInput.setAttribute('name', 'gif-visited-input');
    gifVisitedColorInput.setAttribute('type', 'color');
    gifVisitedColorInput.value = gifVisitedColor;
    const gifVisitedColorLabel = document.createElement('label');
    gifVisitedColorLabel.classList.add('highlighter-dialog-text');
    gifVisitedColorLabel.setAttribute('for', 'gif-visited-input');
    gifVisitedColorLabel.appendChild(document.createTextNode('GIF Visited Color'));
    gifVisitedColorSetting.appendChild(gifVisitedColorInput);
    gifVisitedColorSetting.appendChild(gifVisitedColorLabel);

    const currentUserFavoritesSetting = document.createElement('div');
    currentUserFavoritesSetting.classList.add('highlighter-setting-single');
    currentUserFavoritesSetting.classList.add('highlighter-setting-boolean');
    const currentUserFavoritesInput = document.createElement('input');
    currentUserFavoritesInput.id = 'current-favorites-input';
    currentUserFavoritesInput.setAttribute('name', 'current-favorites-input');
    currentUserFavoritesInput.setAttribute('type', 'checkbox');
    currentUserFavoritesInput.checked = displayCurrentUserFavoritesVisited;
    const currentUserFavoritesLabel = document.createElement('label');
    currentUserFavoritesLabel.classList.add('highlighter-dialog-text');
    currentUserFavoritesLabel.setAttribute('for', 'current-favorites-input');
    currentUserFavoritesLabel.appendChild(document.createTextNode('Highlight Visited on Own Profile and Favorites'));
    const currentUserFavoritesInfo = document.createElement('abbr');
    currentUserFavoritesInfo.title = `Whether visited images should be highlighted on your own favorites page.
If disabled, only animation types will be highlighted on your favorites page.
Either way visited images will be highlighted on the favorites pages of other users.`;
    currentUserFavoritesSetting.appendChild(currentUserFavoritesInput);
    currentUserFavoritesSetting.appendChild(currentUserFavoritesLabel);
    currentUserFavoritesSetting.appendChild(currentUserFavoritesInfo);

    // Create the buttons
    const dialogButtons = document.createElement('div');
    dialogButtons.classList.add('highlighter-dialog-buttons');
    const applyButton = document.createElement('button');
    const defaultButton = document.createElement('button');
    const closeButton = document.createElement('button');
    applyButton.appendChild(document.createTextNode('Save'));
    applyButton.onclick = () => {
        localStorage.setItem('imgUnvisitedColor', imgUnvisitedColorInput.value);
        localStorage.setItem('imgVisitedColor', imgVisitedColorInput.value);
        localStorage.setItem('webmUnvisitedColor', webmUnvisitedColorInput.value);
        localStorage.setItem('webmVisitedColor', webmVisitedColorInput.value);
        localStorage.setItem('gifUnvisitedColor', gifUnvisitedColorInput.value);
        localStorage.setItem('gifVisitedColor', gifVisitedColorInput.value);
        localStorage.setItem('displayCurrentUserFavoritesVisited', currentUserFavoritesInput.checked);
        if (confirm('The page must be reloaded for changes to take effect.\n\nReload now?')) {
            location.reload();
        }
        dialog.classList.remove('open');
    };
    defaultButton.appendChild(document.createTextNode('Restore Defaults'));
    defaultButton.onclick = () => {
        localStorage.removeItem('imgUnvisitedColor');
        localStorage.removeItem('imgVisitedColor');
        localStorage.removeItem('webmUnvisitedColor');
        localStorage.removeItem('webmVisitedColor');
        localStorage.removeItem('gifUnvisitedColor');
        localStorage.removeItem('gifVisitedColor');
        localStorage.removeItem('displayCurrentUserFavoritesVisited');
        if (confirm('The page must be reloaded for changes to take effect.\n\nReload now?')) {
            location.reload();
        }
        dialog.classList.remove('open');
    };
    closeButton.appendChild(document.createTextNode('Cancel'));
    closeButton.onclick = () => dialog.classList.remove('open');
    dialogButtons.appendChild(applyButton);
    dialogButtons.appendChild(defaultButton);
    dialogButtons.appendChild(closeButton);

    dialog.appendChild(dialogHeader);
    dialog.appendChild(imgUnvisitedColorSetting);
    dialog.appendChild(imgVisitedColorSetting);
    dialog.appendChild(webmUnvisitedColorSetting);
    dialog.appendChild(webmVisitedColorSetting);
    dialog.appendChild(gifUnvisitedColorSetting);
    dialog.appendChild(gifVisitedColorSetting);
    dialog.appendChild(currentUserFavoritesSetting);
    dialog.appendChild(dialogButtons);

    // Attach button to header
    header.appendChild(openSettingsButtonContainer);
    // Attach dialog to page
    document.body.appendChild(dialog);
}

// Create user interface for settings and backups
function createUserInterface() {
    'use strict';

    createBackupInterface();
    createSettingsInterface();

    // Style everything
    const css = document.createElement('style');
    css.appendChild(document.createTextNode(`
        div.center {
            padding: 0 3em;
            margin: 0;
        }
        .header .center {
            box-sizing: border-box;
            width: 100%;
        }
        h2.siteName {
            height: 48px;
            width: 100px;
            display: inline-flex;
            align-items: center;
        }
        ul.flat-list {
            width: calc(100% - 117px);
        }
        #navbar ul.navbar-nav {
            width: calc(100% - 75px);
        }
        .open-highlighter-dialog {
            display: block;
        }
        @media (min-width: 1225px) {
            .open-highlighter-dialog {
                float: right !important;
            }
        }
        .highlighter-dialog {
            position: fixed;
            top: 0;
            right: -400px;
            z-index: 1003;
            background-color: white;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
            width: 400px;
            max-width: 90vw;
            max-height: 90vh;
            padding: 12px;
            font-size: 12px;
            line-height: 1.42857143;
            box-sizing: border-box;
            transition: right 0.2s cubic-bezier(0,0,0.3,1);
        }
        .highlighter-dialog.open {
            right: 0;
            transition: right 0.25s cubic-bezier(0,0,0.3,1);
        }
        .highlighter-dialog * {
            box-sizing: border-box;
            font-family: verdana, sans-serif;
            line-height: inherit;
        }
        .highlighter-dialog-header {
            all: revert;
        }
        .highlighter-setting-single * {
            cursor: pointer;
        }
        .highlighter-setting-single input {
            padding: revert;
            margin: revert;
        }
        .highlighter-setting-single .highlighter-dialog-text {
            padding-left: 6px;
        }
        .highlighter-setting-single abbr {
            border: none;
            cursor: help;
            color: white;
            font-size: 14px;
        }
        .highlighter-setting-single abbr:after {
            content: '?';
            display: inline-block;
            font-family: sans-serif;
            font-weight: bold;
            text-align: center;
            font-size: 0.8em;
            line-height: 0.8em;
            border-radius: 50%;
            margin-left: 6px;
            padding: 0.13em 0.2em 0.09em 0.2em;
            color: inherit;
            border: 1px solid;
            text-decoration: none;
            background-color: rgb(33, 131, 252);
        }
        .highlighter-setting-single abbr sup {
            cursor: help;
        }
        .highlighter-setting-boolean {
            margin: 8px;
        }
        .highlighter-setting-boolean input[type='checkbox'] {
            appearance: revert;
        }
        .highlighter-dialog-text {
            display: inline-block;
            max-width: 100%;
            margin-bottom: 5px;
            white-space: unset;
        }
        #backup-dialog-data-field {
            width: 100%;
            resize: vertical;
            font-size: inherit;
            padding: revert;
            display: revert;
        }
        #backup-dialog-data-field:focus {
            background-color: unset;
        }
        .highlighter-dialog-buttons {
            padding-top: 6px;
        }
        .highlighter-dialog-buttons button {
            margin-right: 6px;
            cursor: pointer;
            font-size: inherit;
            padding: revert;
            appearance: revert;
        }
    `));
    document.head.appendChild(css);
}

(function() {
    'use strict';

    // Find out what kind of page we're on
    const searchParams = new URLSearchParams(window.location.search);

    if (!(searchParams.has('page') && searchParams.has('s'))) {
        return false;
    }

    const page = searchParams.get('page');
    const s = searchParams.get('s');

    if (page === 'post') {
        if (s === 'view') { // Image page

            window.typeHighlighterInstalled = true;

            // Get id of current image
            const url = new URL(window.location);
            const currentURLSearchParams = new URLSearchParams(url.search);
            const id = parseInt(currentURLSearchParams.get('id'));

            // Add to list of visited images
            function updateVisitedIDs(event) {
                const visitedIDs = JSON.parse(localStorage.getItem('visitedIDs')) || [];
                if (insertIntoSortedList(visitedIDs, id)) {
                    localStorage.setItem('visitedIDs', JSON.stringify(visitedIDs));
                }
            }
            window.addEventListener('storage', updateVisitedIDs); // Update changes if another image being loaded in a different window changes the list before this one
            updateVisitedIDs();

            // "More Like This" results, currently in beta, could break, but this code should hypothetically never break the page from this end
            const mltLinks = document.querySelectorAll('.mainBodyPadding > div > a[href*="page=post&s=view"]');
            if (mltLinks) {
                markVisitedLinks(mltLinks);
                if (displayMoreLikeThisAnimatedTypes) {
                    getAnimatedType(mltLinks);
                }
            }

            const css = document.createElement('style');
            css.appendChild(document.createTextNode(`
                a[href*="page=post&s=view"] img {
                    padding: 3px;
                    border: 3px solid ` + imgUnvisitedColor + `;
                    background-color: #FFFFFF;
                }
                a[href*="page=post&s=view"]:visited img,
                a[href*="page=post&s=view"].visited img {
                    border-color: ` + imgVisitedColor + `;
                }
                a[href*="page=post&s=view"] img.webm:not(.gif) {
                    border: 5px solid ` + webmUnvisitedColor + ` !important;
                }
                a[href*="page=post&s=view"]:visited img.webm:not(.gif),
                a[href*="page=post&s=view"].visited img.webm:not(.gif) {
                    border-color: ` + webmVisitedColor + ` !important;
                }
                a[href*="page=post&s=view"] img.gif {
                    border-color: ` + gifUnvisitedColor + `;
                }
                a[href*="page=post&s=view"]:visited img.gif,
                a[href*="page=post&s=view"].visited img.gif {
                    border-color: ` + gifVisitedColor + `;
                }
                a[href*="page=post&s=view"]:not(.visited):visited img {
                    background-color: #9E9E9E;
                }
            `));
            document.head.appendChild(css);
        } else if (s === 'list') { // Search page
            // Get search results area
            const galleryContainer = document.querySelector('.thumbnail-container');
            // Get all image thumbnail links
            const galleryLinks = galleryContainer && galleryContainer.querySelectorAll('article.thumbnail-preview a[href*="page=post&s=view"]');
            if (galleryLinks) {
                markVisitedLinks(galleryLinks);
            }

            // Apply borders
            const css = document.createElement('style');
            css.appendChild(document.createTextNode(`
                article.thumbnail-preview {
                    background-color: transparent;
                    width: auto;
                    margin: 20px 10px 0 10px;
                }
                article.thumbnail-preview a img {
                    box-sizing: content-box;
                    background-color: #FFFFFF;
                    padding: 3px;
                }
                article.thumbnail-preview a:not(.visited):visited img {
                    background-color: #9E9E9E;
                }
                article.thumbnail-preview a img:not(.webm) {
                    outline: 3px solid ` + imgUnvisitedColor + `;
                }
                article.thumbnail-preview a:visited img,
                article.thumbnail-preview a.visited img {
                    outline-color: ` + imgVisitedColor + `;
                }
                article.thumbnail-preview a img.webm {
                    border: 5px solid ` + webmUnvisitedColor + ` !important;
                }
                article.thumbnail-preview a:visited img.webm,
                article.thumbnail-preview a.visited img.webm {
                    border-color: ` + webmVisitedColor + ` !important;
                }
                article.thumbnail-preview a img[title*="animated_gif"],
                article.thumbnail-preview a img[title*="animated_png"],
                article.thumbnail-preview a img[title*="animated "]:not(.webm) {
                    outline-color: ` + gifUnvisitedColor + `;
                }
                article.thumbnail-preview a:visited img[title*="animated_gif"],
                article.thumbnail-preview a:visited img[title*="animated_png"],
                article.thumbnail-preview a:visited img[title*="animated "]:not(.webm),
                article.thumbnail-preview a.visited img[title*="animated_gif"],
                article.thumbnail-preview a.visited img[title*="animated_png"],
                article.thumbnail-preview a.visited img[title*="animated "]:not(.webm) {
                    outline-color: ` + gifVisitedColor + `;
                }
                /*article.thumbnail-preview a:focus img:not(.webm) {
                    outline-color: #FFA726 !important;
                }
                article.thumbnail-preview a:focus img.webm {
                    border-color: #FFA726 !important;
                }*/
            `));
            document.head.appendChild(css);
        }
    } else if (page === 'pool' && s === 'show') { // Pool page
        // Get image thumbnails area
        const galleryContainer = document.querySelector('.thumbnail-container');
        // Get all image thumbnail links
        const galleryLinks = galleryContainer && galleryContainer.querySelectorAll('span a[href*="page=post&s=view"]');
        if (galleryLinks) {
            markVisitedLinks(galleryLinks);
        }
        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            .thumbnail-preview {
                padding: 3px;
            }
            div.thumbnail-container a img {
                outline: 3px solid ` + imgUnvisitedColor + `;
                background-color: #FFFFFF;
            }
            div.thumbnail-container a:visited img,
            div.thumbnail-container a.visited img {
                outline-color: ` + imgVisitedColor + `;
            }
            div.thumbnail-container a:not(.visited):visited img {
                background-color: #9E9E9E;
            }
            div.thumbnail-container a img[title*=" video "] {
                outline: 5px solid ` + webmUnvisitedColor + ` !important;
            }
            div.thumbnail-container a:visited img[title*=" video "],
            div.thumbnail-container a.visited img[title*=" video "] {
                outline-color: ` + webmVisitedColor + ` !important;
            }
            div.thumbnail-container a img[title*="animated_gif"],
            div.thumbnail-container a img[title*="animated_png"],
            div.thumbnail-container a img[title*="animated "]:not([title*=" video "]) {
                outline-color: ` + gifUnvisitedColor + `;
            }
            div.thumbnail-container a:visited img[title*="animated_gif"],
            div.thumbnail-container a:visited img[title*="animated_png"],
            div.thumbnail-container a:visited img[title*="animated "]:not([title*=" video "]),
            div.thumbnail-container a.visited img[title*="animated_gif"],
            div.thumbnail-container a.visited img[title*="animated_png"],
            div.thumbnail-container a.visited img[title*="animated "]:not([title*=" video "]) {
                outline-color: ` + gifVisitedColor + `;
            }
            div.thumbnail-container a:focus img {
                outline-color: #FFA726 !important;
            }
        `));
        document.head.appendChild(css);
    } else if (page === 'favorites' && s === 'view') { // Favorites page
        // Apply type borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            .thumb {
                margin: 5px;
            }
            .thumb a img {
                padding: 3px;
                margin: 5px 0 3px 0;
            }
            .thumb a img[title*="animated_gif"],
            .thumb a img[title*="animated_png"],
            .thumb a img[title*="animated "] {
                outline: 3px solid ` + gifUnvisitedColor + `;
            }
            .thumb a img[title*=" video "],
            .thumb a img[title$=" video"] {
                outline: 5px solid ` + webmUnvisitedColor + `;
            }
        `));

        // Apply visited as well if requested
        const userID = displayCurrentUserFavoritesVisited ? -1 : getUserID();
        if (searchParams.has('id') && parseInt(searchParams.get('id')) != userID) {
            const galleryLinks = document.querySelectorAll('.thumb a[href*="page=post&s=view"]');
            markVisitedLinks(galleryLinks);

            // Apply borders
            css.appendChild(document.createTextNode(`
                .thumb a img {
                    outline: 3px solid ` + imgUnvisitedColor + `;
                    background-color: #FFFFFF;
                }
                .thumb a:visited img,
                .thumb a.visited img {
                    outline-color: ` + imgVisitedColor + `;
                }
                .thumb a:not(.visited):visited img {
                    background-color: #9E9E9E;
                }
                .thumb a:visited img[title*="animated_gif"],
                .thumb a:visited img[title*="animated_png"],
                .thumb a:visited img[title*="animated "],
                .thumb a.visited img[title*="animated_gif"],
                .thumb a.visited img[title*="animated_png"],
                .thumb a.visited img[title*="animated "] {
                    outline-color: ` + gifVisitedColor + `;
                }
                .thumb a:visited img[title*=" video "],
                .thumb a.visited img[title*=" video "],
                .thumb a:visited img[title$=" video"],
                .thumb a.visited img[title$=" video"] {
                    outline-color: ` + webmVisitedColor + `;
                }
            `));
        }
        document.head.appendChild(css);
    } else if (page === 'tags' && s === 'saved_search') { // Saved Searches page
        /// Mark visited links
        const galleryLinks = document.querySelectorAll('.thumbnail-container > .thumbnail-preview a[href*="page=post&s=view"]');
        markVisitedLinks(galleryLinks);

        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            .thumbnail-container > .thumbnail-preview a img {
                padding: 3px;
                outline: 3px solid ` + imgUnvisitedColor + `;
                background-color: #FFFFFF;
            }
            .thumbnail-container > .thumbnail-preview a:visited img,
            .thumbnail-container > .thumbnail-preview a.visited img {
                outline-color: ` + imgVisitedColor + `;
            }
            .thumbnail-container > .thumbnail-preview a:not(.visited):visited img {
                background-color: #9E9E9E;
            }
            .thumbnail-container > .thumbnail-preview a img[alt*="animated_gif"],
            .thumbnail-container > .thumbnail-preview a img[alt*="animated_png"],
            .thumbnail-container > .thumbnail-preview a img[alt*="animated "] {
                outline: 3px solid ` + gifUnvisitedColor + `;
            }
            .thumbnail-container > .thumbnail-preview a img[alt*=" video "],
            .thumbnail-container > .thumbnail-preview a img[alt$=" video"] {
                outline: 5px solid ` + webmUnvisitedColor + `;
            }
            .thumbnail-container > .thumbnail-preview a:visited img[alt*="animated_gif"],
            .thumbnail-container > .thumbnail-preview a:visited img[alt*="animated_png"],
            .thumbnail-container > .thumbnail-preview a:visited img[alt*="animated "],
            .thumbnail-container > .thumbnail-preview a.visited img[alt*="animated_gif"],
            .thumbnail-container > .thumbnail-preview a.visited img[alt*="animated_png"],
            .thumbnail-container > .thumbnail-preview a.visited img[alt*="animated "] {
                outline-color: ` + gifVisitedColor + `;
            }
            .thumbnail-container > .thumbnail-preview a:visited img[alt*=" video "],
            .thumbnail-container > .thumbnail-preview a.visited img[alt*=" video "],
            .thumbnail-container > .thumbnail-preview a:visited img[alt$=" video"],
            .thumbnail-container > .thumbnail-preview a.visited img[alt$=" video"] {
                outline-color: ` + webmVisitedColor + `;
            }
        `));
        document.head.appendChild(css);
    } else if (page === 'wiki' && !(s === 'list')) { // Wiki entry page
        // Mark visited links
        const galleryLinks = document.querySelectorAll('tr > td:nth-child(2) a[href*="page=post&s=view"]');
        markVisitedLinks(galleryLinks);

        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            a .thumbnail-preview img {
                padding: 3px;
                outline: 3px solid ` + imgUnvisitedColor + `;
                background-color: #FFFFFF;
            }
            a:visited .thumbnail-preview img,
            a.visited .thumbnail-preview img {
                outline-color: ` + imgVisitedColor + `;
            }
            a:not(.visited):visited .thumbnail-preview img {
                background-color: #9E9E9E;
            }
            a .thumbnail-preview img[alt*="animated_gif"],
            a .thumbnail-preview img[alt*="animated_png"],
            a .thumbnail-preview img[alt*="animated "] {
                outline: 3px solid ` + gifUnvisitedColor + `;
            }
            a .thumbnail-preview img[alt*=" video "],
            a .thumbnail-preview img[alt$=" video"] {
                outline: 5px solid ` + webmUnvisitedColor + `;
                margin: 5px 7px;
            }
            a:visited .thumbnail-preview img[alt*="animated_gif"],
            a:visited .thumbnail-preview img[alt*="animated_png"],
            a:visited .thumbnail-preview img[alt*="animated "],
            a.visited .thumbnail-preview img[alt*="animated_gif"],
            a.visited .thumbnail-preview img[alt*="animated_png"],
            a.visited .thumbnail-preview img[alt*="animated "] {
                outline-color: ` + gifVisitedColor + `;
            }
            a:visited .thumbnail-preview img[alt*=" video "],
            a.visited .thumbnail-preview img[alt*=" video "],
            a:visited .thumbnail-preview img[alt$=" video"],
            a.visited .thumbnail-preview img[alt$=" video"] {
                outline-color: ` + webmVisitedColor + `;
            }
        `));
        document.head.appendChild(css);
    } else if (page === 'account' && s === 'profile') { // Profile page
        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            .profileThumbnailPadding {
                max-width: none !important;
            }
            .profileStatisticsBoxContainer {
                z-index: auto;
            }
            a[href*="s=view"] img {
                padding: 3px;
                max-height: 190px;
                width: auto !important;
                max-width: 150px;
                object-fit: scale-down;
            }
            a[href*="s=view"] img[alt*="animated_gif"],
            a[href*="s=view"] img[alt*="animated_png"],
            a[href*="s=view"] img[alt*="animated "] {
                outline: 3px solid ` + gifUnvisitedColor + `;
            }
            a[href*="s=view"] img[alt*=" video "] {
                outline: 5px solid ` + webmUnvisitedColor + `;
                margin: 0px 2px;
            }
        `));
        document.head.appendChild(css);

        // Apply visited as well if requested
        const userID = displayCurrentUserFavoritesVisited ? -1 : getUserID();
        if (searchParams.has('id') && parseInt(searchParams.get('id')) != userID) {
            const galleryLinks = document.querySelectorAll('a[href*="page=post&s=view"]');
            markVisitedLinks(galleryLinks);

            // Apply borders
            css.appendChild(document.createTextNode(`
                a[href*="s=view"] img {
                    outline: 3px solid ` + imgUnvisitedColor + `;
                    background-color: #FFFFFF;
                }
                a[href*="s=view"]:visited img,
                a[href*="s=view"].visited img {
                    outline-color: ` + imgVisitedColor + `;
                }
                a[href*="s=view"]:not(.visited):visited img {
                    background-color: #9E9E9E;
                }
                a[href*="s=view"]:visited img[alt*="animated_gif"],
                a[href*="s=view"]:visited img[alt*="animated_png"],
                a[href*="s=view"]:visited img[alt*="animated "],
                a[href*="s=view"].visited img[alt*="animated_gif"],
                a[href*="s=view"].visited img[alt*="animated_png"],
                a[href*="s=view"].visited img[alt*="animated "] {
                    outline-color: ` + gifVisitedColor + `;
                }
                a[href*="s=view"]:visited img[alt*=" video "],
                a[href*="s=view"].visited img[alt*=" video "] {
                    outline-color: ` + webmVisitedColor + `;
                }
            `));
        }
    } else if (page === 'comment' && s === 'list') { // Comments page
        // Mark visited links
        const galleryLinks = document.querySelectorAll('.commentThumbnail a[href*="page=post&s=view"]');
        markVisitedLinks(galleryLinks);

        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            a[href*="s=view"] img {
                position: relative;
                top: -2px;
                left: -2px;
                padding: 3px;
                outline: 3px solid ` + imgUnvisitedColor + `;
                background-color: #FFFFFF;
            }
            a[href*="s=view"]:visited img,
            a[href*="s=view"].visited img {
                outline-color: ` + imgVisitedColor + `;
            }
            a[href*="s=view"]:not(.visited):visited img {
                background-color: #9E9E9E;
            }
            a[href*="s=view"] img.flagged {
                background-color: #FF0000 !important;
                border: none !important;
            }
            a[href*="s=view"] img[title*="animated_gif"],
            a[href*="s=view"] img[title*="animated_png"],
            a[href*="s=view"] img[title*="animated "] {
                outline: 3px solid ` + gifUnvisitedColor + `;
            }
            a[href*="s=view"] img[title*=" video "],
            a[href*="s=view"] img[title$=" video"] {
                outline: 5px solid ` + webmUnvisitedColor + `;
            }
            a[href*="s=view"]:visited img[title*="animated_gif"],
            a[href*="s=view"]:visited img[title*="animated_png"],
            a[href*="s=view"]:visited img[title*="animated "],
            a[href*="s=view"].visited img[title*="animated_gif"],
            a[href*="s=view"].visited img[title*="animated_png"],
            a[href*="s=view"].visited img[title*="animated "] {
                outline-color: ` + gifVisitedColor + `;
            }
            a[href*="s=view"]:visited img[title*=" video "],
            a[href*="s=view"].visited img[title*=" video "],
            a[href*="s=view"]:visited img[title$=" video"],
            a[href*="s=view"].visited img[title$=" video"] {
                outline-color: ` + webmVisitedColor + `;
            }
        `));
        document.head.appendChild(css);
    }

    createUserInterface();
})();