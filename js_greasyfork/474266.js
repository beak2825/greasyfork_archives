// ==UserScript==
// @name         Unfuck Reddit
// @namespace    tiau
// @version      1.1
// @description  Removes annoying gallery and media links in Reddit
// @author       tiau
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/474266/Unfuck%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/474266/Unfuck%20Reddit.meta.js
// ==/UserScript==

const url = window.location.href;

if (url.match(/reddit.com\/media/)) {
    unfuckImageViewer()
} else {
    unfuckGalleryLinks()
}

/**
 * Redirect annoying gallery links to normal posts
 */
function unfuckGalleryLinks() {

    const gallery_regex = /https:\/\/www\.reddit.com\/gallery\/([A-z0-9]+)/

    const potentialMatch = url.match(gallery_regex);
    if (potentialMatch) {

        history.replaceState(window.history.state, '', document.referrer);

        window.open(`https://reddit.com/${potentialMatch[1]}`, '_self', 'noopener, noreferrer');
    }
}

/**
 * Load images as blobs instead of fucking ridiculous page with html border and tracking bullshit
 */
function unfuckImageViewer() {
    const image_url_regex = /https:\/\/(?:preview|i).redd.it\/([A-z0-9]+)\.([a-z]{2,4})(?:\?.+)?/;

    const zoomableImageList = [...document.getElementsByTagName('zoomable-img')];

    const imageChildSource = zoomableImageList[0].children[0].src;

    console.log('Source:', imageChildSource);

    // Remove media URL from history so back button returns to post
    history.replaceState(window.history.state, '', document.referrer);

    const potentialMatch = imageChildSource.match(image_url_regex);
    if (potentialMatch) {
        let id = potentialMatch[1];
        let filetype = potentialMatch[2];
        let url = `https://i.redd.it/${id}.${filetype}`;

        console.log('Fetching blob for:', url);

        fetch(url, { cache: 'no-cache' })
          .then(function(response) {
            return response.blob()
          })
          .then(function(blob) {
            let file = window.URL.createObjectURL(blob);
            window.open(file, '_self', 'noopener, noreferrer');
          });
    }
}