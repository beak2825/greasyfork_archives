// ==UserScript==
// @name         ST Arrow Key Next/Prev Chapter
// @namespace    ultrabenosaurus.SlothTranslations
// @version      0.2
// @description  Enable next / previous chapter on right / left arrow keys on Sloth Translations Blog.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://slothtranslationsblog.com/*
// @icon         https://www.google.com/s2/favicons?domain=slothtranslationsblog.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422794/ST%20Arrow%20Key%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/422794/ST%20Arrow%20Key%20NextPrev%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //console.log(e.keyCode);
        if (e.keyCode == '37') {
            // left arrow
            var prevLink = document.querySelectorAll('div.entry-content p:last-of-type a:first-of-type')[0];
            if( prevLink.innerText == "Previous Chapter" ) {
                e.preventDefault();
                prevLink.click();
                prevLink = null;
            }
        }
        else if (e.keyCode == '39') {
            // right arrow
            var nextLink = document.querySelectorAll('div.entry-content p:last-of-type a:last-of-type')[0];
            if( nextLink.innerText == "Next Chapter" ) {
                e.preventDefault();
                nextLink.click();
                nextLink = null;
            }
        }

    };
})();