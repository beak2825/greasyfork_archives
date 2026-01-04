    // ==UserScript==
    // @name         AO3 Bookmarks Default to Private (Etiquette helper)
    // @namespace    Ellililunch AO3 USERSCIPTS
    // @description  Set AO3 bookmarks to default to private. This makes ao3 bookmarking etiquette a little easier. (Note, this is included in my AO3 Re-reread Savior userscript)
    // @version      0.1
    // @author       Ellililunch
    // @match        *archiveofourown.org/works/*
    // @match        *archiveofourown.org/series/*
    // @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/471533/AO3%20Bookmarks%20Default%20to%20Private%20%28Etiquette%20helper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471533/AO3%20Bookmarks%20Default%20to%20Private%20%28Etiquette%20helper%29.meta.js
    // ==/UserScript==
     
    // new users - scroll right to the bottom
     
    (function() {
     
        // automatically checks the Private Bookmark checkbox. Set to false if you don't want this.
        document.getElementById("bookmark_private").checked = true;

    })();