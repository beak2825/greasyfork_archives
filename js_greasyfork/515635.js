// ==UserScript==
// @name         Steam Community - Images uses direct links
// @namespace    https://greasyfork.org/users/5097-aemony
// @version      2024-11-03
// @description  Drop thumbnail parameters to always load the original images
// @author       Aemony
// @match        *://steamcommunity.com/*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515635/Steam%20Community%20-%20Images%20uses%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/515635/Steam%20Community%20-%20Images%20uses%20direct%20links.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Strip the thumbnail parameters of the direct link and image source
    var img = jQuery('img#ActualMedia');

    if (img.length)
    {
        var directLink = img.attr('src').replace(/\?.*/, '');

        // Change the image source to the direct link
        img.attr('src', directLink);

        // Change the HREF of the anchor link (parent of the image) to the direct link
        img.parent().attr('href', directLink);
    }
})();