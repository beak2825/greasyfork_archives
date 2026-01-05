// ==UserScript==
// @name         imgur scroll to gallery images keyboard shortcuts
// @namespace    http://porath.org/
// @version      0.13
// @description  use ↑/↓ to scroll to the next/previous image within an imgur gallery
// @author       porath
// @match        http://imgur.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10420/imgur%20scroll%20to%20gallery%20images%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/10420/imgur%20scroll%20to%20gallery%20images%20keyboard%20shortcuts.meta.js
// ==/UserScript==

// thanks to moiph and CBenni and Brybry

var current = 0;
var elems = $('.album-image');
var numElems = elems.length;

$(document).on('keydown', function (key) {
    if (key.which == 40) {
        key.preventDefault();
        
        if (current + 1 == numElems) {
            if ($('#album-truncated')) {
                $('#album-truncated > a').click();
                
                window.setTimeout(function() { // wait 200 ms then update the album size
                    elems = $('.album-image');
                    numElems = elems.length;
                }, 200);
            }
            
            return;
        }
        
        elems[current + 1].scrollIntoView();
        $('body').scrollTop($('body').scrollTop() - 28);
        current = current + 1;
    }
    
    if (key.which == 38) {
        key.preventDefault();
        
        if (current == 0) {
            return;
        }
        
        elems[current - 1].scrollIntoView();
        $('body').scrollTop($('body').scrollTop() - 28);
        current = current - 1;
    }
    
    if (key.which == 36) { // "home" puts you at the top of the gallery
        current = 0;
    }
    
    if (key.which == 35) { // "end" puts you at the bottom of the gallery
        current = numElems;
    }
    
    if (key.which == 37 || key.which == 39) { // when a user presses left or right to go to the prev/next page
        current = 0;
        elems = $('.album-image');
        numElems = elems.length;
    }
});