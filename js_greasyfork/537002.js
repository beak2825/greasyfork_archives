// ==UserScript==
// @name        MusicBrainz: Add Spotify and Deezer ISRC link to release pages
// @namespace   https://musicbrainz.org/user/chaban
// @version     1.3
// @tag         ai-created
// @description Adds an "import ISRCs" link to MusicBrainz release pages with a Spotify or Deezer URL
// @author      atj, chaban
// @license     MIT
// @match       *://*.musicbrainz.org/release/*
// @icon        https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/537002/MusicBrainz%3A%20Add%20Spotify%20and%20Deezer%20ISRC%20link%20to%20release%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/537002/MusicBrainz%3A%20Add%20Spotify%20and%20Deezer%20ISRC%20link%20to%20release%20pages.meta.js
// ==/UserScript==

const SpotifyLinkRegexp = /^https?:\/\/open\.spotify\.com\/album\//i;
const DeezerLinkRegexp = /^https?:\/\/www\.deezer\.com\/album\//i;

/**
 * Adds an "import ISRCs" link next to the given link element.
 * @param {HTMLElement} linkElement - The link element to add the "import ISRCs" link after.
 * @param {string} type - The type of service ("spotify" or "deezer").
 * @param {string} id - The ID of the album.
 */
function addImportLink(linkElement, type, id) {
    const isrcHuntUrl = `https://isrchunt.com/${type}/importisrc?releaseId=${id}`;
    let curElem = linkElement.nextElementSibling.nextSibling;
    let elem = document.createTextNode(' [');
    curElem = insertAfter(elem, curElem);
    elem = document.createElement('a');
    elem.href = isrcHuntUrl;
    elem.innerText = 'import ISRCs';
    curElem = insertAfter(elem, curElem);
    elem = document.createTextNode(']');
    insertAfter(elem, curElem);
}

function insertAfter(elem, after) {
    if (after.parentNode) {
        after.parentNode.insertBefore(elem, after.nextSibling);
    }
    return elem;
}

function addImportIsrcsLink() {
    const releaseRels = document.getElementById('release-relationships');

    if (!releaseRels) {
        return;
    }

    for (const bdi of releaseRels.getElementsByTagName('bdi')) {
        let matches = bdi.innerText.match(SpotifyLinkRegexp);
        if (matches) {
            const spotifyId = bdi.innerText.split('/').pop();
            const spotifyLink = bdi.parentElement;
            addImportLink(spotifyLink, 'spotify', spotifyId);
        }

        matches = bdi.innerText.match(DeezerLinkRegexp);
        if (matches) {
            const deezerId = bdi.innerText.split('/').pop();
            const deezerLink = bdi.parentElement;
            addImportLink(deezerLink, 'deezer', deezerId);
        }
    }
}

window.setTimeout(addImportIsrcsLink, 250);
