// ==UserScript==
// @name         Gelbooru Animation Highlighter
// @namespace    http://tampermonkey.net/
// @version      14.13.2
// @description  Make webm highlighting work in many more places and mark animated gif as well.
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
// @downloadURL https://update.greasyfork.org/scripts/419590/Gelbooru%20Animation%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/419590/Gelbooru%20Animation%20Highlighter.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

/*   configuration   */

// You can modify these from the "Highlighter Settings" item on the right side of the header on any page this runs on.

// Highlight colors
// Values can be hexadecimal, rgb, hsl, color name, or whatever CSS color definitions your browser supports
const webmColor = localStorage.getItem('webmUnvisitedColor') || '#1565C0'; // Color for WebMs
const gifColor = localStorage.getItem('gifUnvisitedColor') || '#FFD600'; // Color for animated gifs/pngs

// Whether to use the experimental workaround to display gif/webm highlighting on "More Like This" links on image pages
// NOTICE:   This is experimental and is not guaranteed to be perfect
const displayMoreLikeThisAnimatedTypes = JSON.parse(localStorage.getItem('displayMoreLikeThisAnimatedTypes') || 'true');

/*-------------------*/

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
    dialogHeader.appendChild(document.createTextNode('Type Highlighter Settings'));
    dialog.appendChild(dialogHeader);

    const webmColorSetting = document.createElement('div');
    webmColorSetting.classList.add('highlighter-setting-single');
    const webmColorInput = document.createElement('input');
    webmColorInput.id = 'webm-input';
    webmColorInput.setAttribute('name', 'webm-input');
    webmColorInput.setAttribute('type', 'color');
    webmColorInput.value = webmColor;
    const webmColorLabel = document.createElement('label');
    webmColorLabel.classList.add('highlighter-dialog-text');
    webmColorLabel.setAttribute('for', 'webm-input');
    webmColorLabel.appendChild(document.createTextNode('WebM Color'));
    webmColorSetting.appendChild(webmColorInput);
    webmColorSetting.appendChild(webmColorLabel);

    const gifColorSetting = document.createElement('div');
    gifColorSetting.classList.add('highlighter-setting-single');
    const gifColorInput = document.createElement('input');
    gifColorInput.id = 'gif-input';
    gifColorInput.setAttribute('name', 'gif-input');
    gifColorInput.setAttribute('type', 'color');
    gifColorInput.value = gifColor;
    const gifColorLabel = document.createElement('label');
    gifColorLabel.classList.add('highlighter-dialog-text');
    gifColorLabel.setAttribute('for', 'gif-input');
    gifColorLabel.appendChild(document.createTextNode('GIF Color'));
    gifColorSetting.appendChild(gifColorInput);
    gifColorSetting.appendChild(gifColorLabel);

    // Create the buttons
    const dialogButtons = document.createElement('div');
    dialogButtons.classList.add('highlighter-dialog-buttons');
    const applyButton = document.createElement('button');
    const defaultButton = document.createElement('button');
    const closeButton = document.createElement('button');
    applyButton.appendChild(document.createTextNode('Save'));
    applyButton.onclick = () => {
        localStorage.setItem('webmUnvisitedColor', webmColorInput.value);
        localStorage.setItem('gifUnvisitedColor', gifColorInput.value);
        if (confirm('The page must be reloaded for changes to take effect.\n\nReload now?')) {
            location.reload();
        }
        dialog.classList.remove('open');
    };
    defaultButton.appendChild(document.createTextNode('Restore Defaults'));
    defaultButton.onclick = () => {
        localStorage.removeItem('webmUnvisitedColor');
        localStorage.removeItem('gifUnvisitedColor');
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
    dialog.appendChild(webmColorSetting);
    dialog.appendChild(gifColorSetting);
    dialog.appendChild(dialogButtons);

    // Attach button to header
    header.appendChild(openSettingsButtonContainer);
    // Attach dialog to page
    document.body.appendChild(dialog);

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

            // "More Like This" results, currently in beta, could break, but this code should hypothetically never break the page from this end
            const mltLinks = document.querySelectorAll('.mainBodyPadding > div > a[href*="page=post&s=view"]');
            if (mltLinks) {
                if (displayMoreLikeThisAnimatedTypes) {
                    getAnimatedType(mltLinks);
                }
            }

            const css = document.createElement('style');
            css.appendChild(document.createTextNode(`
                a[href*="page=post&s=view"] img.webm:not(.gif) {
                    padding: 3px;
                    border: 3px solid ` + webmColor + ` !important;
                }
                a[href*="page=post&s=view"] img.gif {
                    padding: 3px;
                    border: 3px solid ` + gifColor + `;
                }
            `));
            document.head.appendChild(css);
        } else if (s === 'list') { // Search page
            // Apply borders
            const css = document.createElement('style');
            css.appendChild(document.createTextNode(`
                article.thumbnail-preview {
                    background-color: transparent;
                    width: auto;
                    margin: 20px 10px 0 10px;
                }
                article.thumbnail-preview a img.webm {
                    box-sizing: content-box;
                    padding: 3px;
                    border: 3px solid ` + webmColor + ` !important;
                }
                article.thumbnail-preview a img[title*="animated_gif"],
                article.thumbnail-preview a img[title*="animated_png"],
                article.thumbnail-preview a img[title*="animated "]:not(.webm) {
                    box-sizing: content-box;
                    padding: 3px;
                    outline: 3px solid ` + gifColor + `;
                }
            `));
            document.head.appendChild(css);
        }
    } else if (page === 'pool' && s === 'show') { // Pool page
        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            .thumbnail-preview {
                padding: 3px;
            }
            div.thumbnail-container a img[title*=" video "] {
                outline: 3px solid ` + webmColor + ` !important;
            }
            div.thumbnail-container a img[title*="animated_gif"],
            div.thumbnail-container a img[title*="animated_png"],
            div.thumbnail-container a img[title*="animated "]:not([title*=" video "]) {
                outline: 3px solid ` + gifColor + `;
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
            .thumb a img[title*="animated_gif"],
            .thumb a img[title*="animated_png"],
            .thumb a img[title*="animated "] {
                padding: 3px;
                margin: 5px 0 3px 0;
                outline: 3px solid ` + gifColor + `;
            }
            .thumb a img[title*=" video "],
            .thumb a img[title$=" video"] {
                padding: 3px;
                margin: 5px 0 3px 0;
                outline: 3px solid ` + webmColor + `;
            }
        `));
        document.head.appendChild(css);
    } else if (page === 'tags' && s === 'saved_search') { // Saved Searches page
        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            .thumbnail-container > .thumbnail-preview a img {
                padding: 3px;
            }
            .thumbnail-container > .thumbnail-preview a img[alt*="animated_gif"],
            .thumbnail-container > .thumbnail-preview a img[alt*="animated_png"],
            .thumbnail-container > .thumbnail-preview a img[alt*="animated "] {
                outline: 3px solid ` + gifColor + `;
            }
            .thumbnail-container > .thumbnail-preview a img[alt*=" video "],
            .thumbnail-container > .thumbnail-preview a img[alt$=" video"] {
                outline: 3px solid ` + webmColor + `;
            }
        `));
        document.head.appendChild(css);
    } else if (page === 'wiki' && !(s === 'list')) { // Wiki entry page
        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            a .thumbnail-preview img[alt*="animated_gif"],
            a .thumbnail-preview img[alt*="animated_png"],
            a .thumbnail-preview img[alt*="animated "] {
                padding: 3px;
                outline: 3px solid ` + gifColor + `;
            }
            a .thumbnail-preview img[alt*=" video "],
            a .thumbnail-preview img[alt$=" video"] {
                padding: 3px;
                outline: 3px solid ` + webmColor + `;
                margin: 5px 7px;
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
                outline: 3px solid ` + gifColor + `;
            }
            a[href*="s=view"] img[alt*=" video "] {
                outline: 3px solid ` + webmColor + `;
            }
        `));
        document.head.appendChild(css);
    } else if (page === 'comment' && s === 'list') { // Comments page
        // Apply borders
        const css = document.createElement('style');
        css.appendChild(document.createTextNode(`
            a[href*="s=view"] img {
                position: relative;
                top: -3px;
                left: -3px;
                padding: 3px;
            }
            a[href*="s=view"] img.flagged {
                background-color: #FF0000 !important;
                border: none !important;
            }
            a[href*="s=view"] img[title*="animated_gif"],
            a[href*="s=view"] img[title*="animated_png"],
            a[href*="s=view"] img[title*="animated "] {
                outline: 3px solid ` + gifColor + `;
            }
            a[href*="s=view"] img[title*=" video "],
            a[href*="s=view"] img[title$=" video"] {
                outline: 3px solid ` + webmColor + `;
            }
        `));
        document.head.appendChild(css);
    }

    createSettingsInterface();
})();