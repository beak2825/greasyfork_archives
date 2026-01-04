// ==UserScript==
// @name         Gelbooru Show Tags on Hover Everywhere
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  Makes tags display on hover for more like this, saved searches, and wiki pages, like on the rest of the site.
// @author       Xerodusk
// @homepage     https://greasyfork.org/en/users/460331-xerodusk
// @license      GPL-3.0-or-later
// @match        https://gelbooru.com/index.php*page=post*s=view*
// @match        https://gelbooru.com/index.php*s=saved_search*
// @match        https://gelbooru.com/index.php*page=wiki*s=view*
// @grant        none
// @icon         https://gelbooru.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/406555/Gelbooru%20Show%20Tags%20on%20Hover%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/406555/Gelbooru%20Show%20Tags%20on%20Hover%20Everywhere.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Decode encoded characters in tags for proper processing
function HtmlDecode(input) {
    'use strict';

    const tempElem = document.createElement('div');
    tempElem.innerHTML = input;
    return tempElem.childNodes.length === 0 ? "" : tempElem.childNodes[0].nodeValue;
}

// Copy tags from alt attribute to title attribute for image thumbnails
function TagsToTitle(imageThumbs) {
    'use strict';

    imageThumbs.forEach(imageThumb => {
        imageThumb.title = HtmlDecode(imageThumb.alt);
    });
}

// Fetch tags for More Like This
function FetchTags(imageThumbs) {
    'use strict';

    imageThumbs.forEach(imageThumb => {
        // Check if Highlighter already fetched
        const imageData = imageThumb.dataset.tags;
        if (imageData) {
            imageThumb.title = HtmlDecode(imageData);
        } else {
            const linkURL = imageThumb.parentNode.href;

            fetch(linkURL).then(response => response.text()).then((responseText) => {
                const parser = new DOMParser();

                const htmlDoc = parser.parseFromString(responseText, 'text/html');

                // Get tags
                const tagsEditField = htmlDoc.querySelector('textarea#tags.tagBox[name="tags"]');
                const tags = tagsEditField.value;
                // Get rating
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
                // Get score
                const linkSearchParams = new URLSearchParams(new URL(linkURL).search);
                const linkID = linkSearchParams.get('id');
                const score = htmlDoc.getElementById('psc' + linkID).textContent;

                // Construct string
                const titleString = tags + '  score:' + score + ' rating:' + rating;

                imageThumb.title = HtmlDecode(titleString);
            });
        }
    });
}

(function() {
    'use strict';

    // Get all image thumbnails on page
    let imageSelector; // selector for all image thumbnails
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('s') === 'saved_search') {
        imageSelector = '.thumbnail-container > .thumbnail-preview a img';
    } else if (searchParams.get('page') === 'wiki') {
        imageSelector = '.thumb img';
    } else if (searchParams.get('page') === 'post') {
        imageSelector = '.mainBodyPadding > div > a[href*="page=post&s=view"] img';
    }

    const imageThumbs = [...document.querySelectorAll(imageSelector)];

    if (searchParams.get('page') === 'post') {
        // Highlighter script may already be doing the heavy lifting
        if (window.typeHighlighterInstalled) {
            // Wait for highlighter to finish fetching
            window.addEventListener('tagsretrieve', () => {
                FetchTags(imageThumbs);
            });
        } else {
            FetchTags(imageThumbs);
        }
    } else {
        TagsToTitle(imageThumbs);
    }
})();