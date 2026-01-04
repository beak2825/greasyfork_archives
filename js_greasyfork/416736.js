// ==UserScript==
// @name         Gelbooru Show Original Image Dimensions on Resize Link
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  Shows the dimensions of the original image together with the prompt to show it.
// @author       Xerodusk
// @homepage     https://greasyfork.org/en/users/460331-xerodusk
// @license      GPL-3.0-or-later
// @match        https://gelbooru.com/index.php*page=post&s=view*
// @grant        none
// @icon         https://gelbooru.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/416736/Gelbooru%20Show%20Original%20Image%20Dimensions%20on%20Resize%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/416736/Gelbooru%20Show%20Original%20Image%20Dimensions%20on%20Resize%20Link.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    // Get the resized status alert if exists, otherwise nothing to do
    const resizeLink = document.getElementById('resize-link');
    if (!resizeLink) {
        return;
    }

    // Get image data
    const imageContainer = document.querySelector('.image-container');
    const width = imageContainer.getAttribute('data-width');
    const height = imageContainer.getAttribute('data-height');

    // Add dimensions after resize link
    resizeLink.getElementsByTagName('a')[0].append(document.createTextNode(' (' + width + 'x' + height + ')'));
})();