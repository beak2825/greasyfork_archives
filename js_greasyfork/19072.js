// ==UserScript==
// @name         Verwijder commentaar op tweakers.net
// @name:en      Remove comments on tweakers.net
// @namespace    https://github.com/HiddenKn
// @version      0.1
// @description  Verwijdert de commentaar sectie op tweakers.net
// @description:en Removes the comment section on tweakers.net
// @author       HiddenKn
// @match        http://tweakers.net/nieuws/*
// @match        https://tweakers.net/nieuws/*
// @upgrade      https://gist.github.com/HiddenKn/0e1c2ba69cb250f6e1033267cfb1e8a4/raw/remove_comments_tweakers.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19072/Verwijder%20commentaar%20op%20tweakersnet.user.js
// @updateURL https://update.greasyfork.org/scripts/19072/Verwijder%20commentaar%20op%20tweakersnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var commentColumn = document.getElementById("commentColumn");
    if(commentColumn){
        commentColumn.remove();
        console.info("Remove comments on tweakers.net userscript: Removed comments.");
    } else {
        console.error("Remove comments on tweakers.net userscript: An error occured during the removal of the comments section.");
    }
})();