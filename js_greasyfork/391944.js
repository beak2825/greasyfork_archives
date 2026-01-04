// ==UserScript==
// @name         Udemy Bookmark Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes bookmarks in video seekbars
// @author       PepperedJerky
// @include      https://www.udemy.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391944/Udemy%20Bookmark%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/391944/Udemy%20Bookmark%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clearBookmarks = (bms) => {
    	for(let bookmark of bms) {
    		bookmark.remove();
    	}
    }

    const checkLoaded = setInterval(() => {
    	const bms = document.querySelectorAll('.video-bookmark--label--social--1Q6CV');

    	if(bms.length > 0) {
    		clearBookmarks(bms);
            console.log("[Udemy Bookmark Remover] - Cleared all bookmarks!");
    		clearInterval(checkLoaded);
    	}
    }, 10);
})();