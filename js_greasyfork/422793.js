// ==UserScript==
// @name         SS Arrow Key Next/Prev Chapter
// @namespace    ultrabenosaurus.Shinsori
// @version      0.2
// @description  Enable next / previous chapter on right / left arrow keys on Shinsori.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.shinsori.com/*
// @icon         https://www.google.com/s2/favicons?domain=shinsori.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422793/SS%20Arrow%20Key%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/422793/SS%20Arrow%20Key%20NextPrev%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //console.log(e.keyCode);
        if( e.keyCode == '37' ) {
            // left arrow
            e.preventDefault();
            var pLink = document.querySelectorAll('p a.shortc-button.small.black');
            if( pLink.length == 0 ) {
                console.error("No links found for query selctor: 'p a.shortc-button.small.black'");
                return null;
            }
            if( pLink[0].textContent.search("Previous") >= 0 ) {
                console.info("Navigating to previous chapter:", pLink[0].href);
                pLink[0].click();
            } else {
                console.error("Link in position 0 did not contain text: 'Previous");
            }
            pLink = null;
        } else if( e.keyCode == '39' ) {
            // right arrow
            e.preventDefault();
            var nLink = document.querySelectorAll('p a.shortc-button.small.black');
            if( nLink.length == 0 ) {
                console.error("No links found for query selctor: 'p a.shortc-button.small.black'");
                return null;
            }
            if( nLink[1].textContent.search("Next") >= 0 ) {
                console.info("Navigating to next chapter:", nLink[1].href);
                nLink[1].click();
            } else {
                console.error("Link in position 1 did not contain text: 'Next");
            }
            nLink = null;
        }

    };
})();