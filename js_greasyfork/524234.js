// ==UserScript==
// @name         OLD REDDIT GALLERY REDIRECT
// @version      1.0
// @description  Removes /gallery/ from old.reddit.com links and redirects to valid link.
// @author       minnie
// @match        https://old.reddit.com/gallery/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1101475
// @downloadURL https://update.greasyfork.org/scripts/524234/OLD%20REDDIT%20GALLERY%20REDIRECT.user.js
// @updateURL https://update.greasyfork.org/scripts/524234/OLD%20REDDIT%20GALLERY%20REDIRECT.meta.js
// ==/UserScript==

/**
 * Updates the URL by removing "/gallery/" from the path.
 * @param {string} url - The URL to update.
 * @returns {string} - The updated URL without "/gallery/".
 */
function removeGallery(url) {
    try {
        const target = new URL(url);

        // Remove "/gallery/" from the path
        if (target.pathname.includes('/gallery/')) {
            target.pathname = target.pathname.replace('/gallery/', '/');
            return target.href;
        }
        return url;
    } catch (e) {
        console.error('Error processing URL:', e);
        return url; // Return original URL on failure
    }
}

// Immediately process and redirect if necessary
(function() {
    const currentUrl = window.location.href;
    const updatedUrl = removeGallery(currentUrl);

    // Redirect if the URL was changed
    if (updatedUrl !== currentUrl) {
        window.location.assign(updatedUrl);
    }
})();
