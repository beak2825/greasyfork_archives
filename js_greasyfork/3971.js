// ==UserScript==
// @author      Zachary Seeley
// @name        Email Search Sticky Tabs
// @namespace   http://www.jedatasolutions.com/
// @description Makes a dedicated tab for opening links.
// @match      https://docs.google.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright   © 2014, J&E Data Solutions
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/3971/Email%20Search%20Sticky%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/3971/Email%20Search%20Sticky%20Tabs.meta.js
// ==/UserScript==

document.addEventListener( "keydown", elLinkyLinky, false );

function elLinkyLinky( i ) {
    if ( i.keyCode == 49 && i.ctrlKey == true ) { //F2: Open Link in Named Tab
        i.preventDefault();
        window.open( $( 'div.cell-input' ).text(), 'highschools' );
    }
}