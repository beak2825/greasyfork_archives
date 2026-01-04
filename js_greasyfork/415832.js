// ==UserScript==
// @name         SH Arrow Key Next/Prev Chapter
// @namespace    ultrabenosaurus.ScribbleHub
// @version      0.4
// @description  Navigate to the next / previous chapter on right / left arrow keys on ScribbleHub.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.scribblehub.com/read/*/chapter/*
// @icon         https://www.google.com/s2/favicons?domain=scribblehub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415832/SH%20Arrow%20Key%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/415832/SH%20Arrow%20Key%20NextPrev%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var consoleTitle = "SH Arrow Key Next/Prev Chapter:";

    document.onkeyup = function(e){
        e = e || window.event;
        var prevSelector = "div.next_nav_links a.btn-wi.btn-prev";
        var prevAnchorText = "Previous";
        var nextSelector = "div.next_nav_links a.btn-wi.btn-next";
        var nextAnchorText = "Next";

        //console.log(consoleTitle, e);

        var commentBox = document.querySelectorAll('div#comment_placeholder.comment_placeholder');
        var commentEditBox = document.querySelectorAll('div.cmt_edit_chp');
        if( ( commentBox.length > 0 && e.target == commentBox[0] ) || ( commentEditBox.length > 0 && e.target == commentEditBox[0] ) ) {
            console.info(consoleTitle, "Matched a comment box, aborting chapter navigation.");

            e = prevSelector = prevAnchorText = nextSelector = nextAnchorText = commentBox = null;
            return;
        }

        if( e.keyCode == '37' ) {
            // left arrow
            e.preventDefault();
            var pLink = document.querySelectorAll(prevSelector);
            if( pLink.length == 0 ) {
                console.error(consoleTitle, "No links found for query selctor: '"+prevSelector+"'");
                return null;
            }
            if( pLink[0].textContent.search(prevAnchorText) >= 0 ) {
                console.info(consoleTitle, "Navigating to previous chapter:", pLink[0].href);
                pLink[0].click();
            } else {
                console.error(consoleTitle, "Link in position 0 did not contain text: '"+prevAnchorText+"'");
            }
            pLink = null;
        } else if( e.keyCode == '39' ) {
            // right arrow
            e.preventDefault();
            var nLink = document.querySelectorAll(nextSelector);
            if( nLink.length == 0 ) {
                console.error(consoleTitle, "No links found for query selctor: '"+nextSelector+"'");
                return null;
            }
            if( nLink[0].textContent.search(nextAnchorText) >= 0 ) {
                console.info(consoleTitle, "Navigating to next chapter:", nLink[0].href);
                nLink[0].click();
            } else {
                console.error(consoleTitle, "Link in position 0 did not contain text: '"+nextAnchorText+"'");
            }
            nLink = null;
        }

        e = prevSelector = prevAnchorText = nextSelector = nextAnchorText = commentBox = null;
    };
})();