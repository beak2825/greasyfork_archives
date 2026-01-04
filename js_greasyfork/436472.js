// ==UserScript==
// @name         AO3 Bookmark Back Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Add a back button to the bookmark page on AO3
// @author       sunkitten_shash
// @match        http://archiveofourown.org/bookmarks/*
// @match        https://archiveofourown.org/bookmarks/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436472/AO3%20Bookmark%20Back%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/436472/AO3%20Bookmark%20Back%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // add back button which redirects to the previous page
    function addButton() {
        $(".bookmarks-show > .navigation").prepend(`<li><a href="${document.referrer}" id="backButton">← Go Back</a></li>`);
    }

    // when the bookmark page loads, add the button
    $(document).ready(addButton);
})();