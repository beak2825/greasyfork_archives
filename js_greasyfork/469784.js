// ==UserScript==
// @name         Danbooru Download and Favorite
// @namespace    AnimeRaupe
// @version      2.3
// @description  downloads and favorites the post you open automatically
// @author       AnimeRaupe
// @match        https://danbooru.donmai.us/*
// @icon         none
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469784/Danbooru%20Download%20and%20Favorite.user.js
// @updateURL https://update.greasyfork.org/scripts/469784/Danbooru%20Download%20and%20Favorite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the var favorite
    var favorite = document.querySelector("#add-to-favorites");

    // Get the <a> element with id "post-option-download"
    var downloadLink = document.querySelector('#post-option-download a');

    // Checks if the favorite is pressed and only downloads when it's not favorited (to prevent downloading twice)
    if (favorite.style.display !== 'none') {
        // Get the href value
        var href = downloadLink.href;

        // Create a hidden anchor element to trigger the download
        var hiddenAnchor = document.createElement('a');
        hiddenAnchor.style.display = 'none';
        hiddenAnchor.href = href;
        hiddenAnchor.download = downloadLink.getAttribute('download');
        document.body.appendChild(hiddenAnchor);

        // Downloads picture
        hiddenAnchor.click();
        // Favorites the Danbooru post
        favorite.click();

        // Clean up / remove the anchor element
        document.body.removeChild(hiddenAnchor);
    } else {
        // Output a message to the user
        setTimeout(() => {
            alert("Already favorited stupid.");
        }, 1000); // Delay 1 second
    }
})();