// ==UserScript==
// @name         Extra keyboard shortcuts for Kanka Entities.
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.4
// @description  Adds keyboard shortcuts 
// @author       Idealien
// @match        https://app.kanka.io/*/entities/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @downloadURL https://update.greasyfork.org/scripts/488640/Extra%20keyboard%20shortcuts%20for%20Kanka%20Entities.user.js
// @updateURL https://update.greasyfork.org/scripts/488640/Extra%20keyboard%20shortcuts%20for%20Kanka%20Entities.meta.js
// ==/UserScript==

/* Usage:
 * p = New Post
 * f = Edit First Post
 */
 
document.onkeyup = function(e) {
    var key = e.which || e.keyCode;
    //console.log('KEY Pressed: ' + key );

    // p = New Post
    if ( key == 80  && document.querySelector(".row-add-note-button .btn-new-post") ) {
        document.querySelector(".row-add-note-button .btn-new-post").click();
    }
    // f = Edit First Post
    if ( key == 70 ) {
        // Special case if the entry is not the first block
        if ( document.querySelector(".post-block.post-position--1") ) {
            document.querySelector('.post-block.post-position--1 .dropdown-menu a').click();
        }
        else if ( document.querySelector(".post-block.post-position-1") ) {
            document.querySelector('.post-block.post-position-1 .dropdown-menu a').click();
        }
    }
}