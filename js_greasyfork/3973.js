// ==UserScript==
// @author      Zachary Seeley
// @name        Email Search Script
// @namespace   http://www.jedatasolutions.com/
// @description Hotkey for searching CDE website.
// @match       http://*/*
// @match       https://*/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright   © 2014, J&E Data Solutions
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/3973/Email%20Search%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/3973/Email%20Search%20Script.meta.js
// ==/UserScript==

document.addEventListener( "keydown", elLinkyLinky, false );

function elLinkyLinky( i ) {
    if ( i.keyCode == 49 && i.ctrlKey == true ) { //F2: Open Link in Named Tab
        i.preventDefault();
        var textTemp = "";
        if (window.getSelection) {
            textTemp = window.getSelection().toString();
        }
        window.open( 'https://www.google.com/search?q=' + textTemp + '+ site:cde.ca.gov/re/', 'gsearch' );
    }
}