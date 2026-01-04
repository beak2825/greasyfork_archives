// ==UserScript==
// @name         RL Arrow Key Next/Prev Chapter
// @namespace    ultrabenosaurus.ReLibrary
// @version      0.7
// @description  Enable next / previous chapter on right / left arrow keys on Re:Library.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://re-library.com/translations/*
// @icon         https://www.google.com/s2/favicons?domain=re-library.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404392/RL%20Arrow%20Key%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/404392/RL%20Arrow%20Key%20NextPrev%20Chapter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e){
        e = e || window.event;
        //console.log(e.keyCode);
        if (e.keyCode == '37') {
            // left arrow
            e.preventDefault();
            var pLink = document.querySelectorAll('div.entry-content>p+hr+div[style="float: left;"]>a');
            if( pLink.length == 0 ) {
                pLink = document.querySelectorAll('div.entry-content a.prevPageLink');
            }
            if( pLink.length == 0 ) {
                pLink = document.querySelectorAll('div.entry-content div.prevPageLink a');
            }
            pLink[0].click();
            pLink = null;
        }
        else if (e.keyCode == '39') {
            // right arrow
            e.preventDefault();
            var nLink = document.querySelectorAll('div.entry-content>p+hr+div+div[style="float: right;"]>a');
            if( nLink.length == 0 ) {
                nLink = document.querySelectorAll('div.entry-content a.nextPageLink');
            }
            if( nLink.length == 0 ) {
                nLink = document.querySelectorAll('div.entry-content div.nextPageLink a');
            }
            nLink[0].click();
            nLink = null;
        }

    };
})();