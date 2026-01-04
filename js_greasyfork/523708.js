// ==UserScript==
// @name        (Beta) AO3 swiper
// @match       https://archiveofourown.org/works/*
// @grant       none
// @version     1.3.6
// @author      mazeeca
// @description Add left and right swipe gestures to AO3 works pages.
// @namespace   https://greasyfork.org/
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523708/%28Beta%29%20AO3%20swiper.user.js
// @updateURL https://update.greasyfork.org/scripts/523708/%28Beta%29%20AO3%20swiper.meta.js
// ==/UserScript==
 
// === Adapted from https://greasyfork.org/en/scripts/459497-mega-nz-swipe-gestures === //

(function() {
    'use strict';
    
    // Calculate user's window height
    var scrollsize = window.innerHeight;

    // Add touch event listeners to the document
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
 
    // Variable to keep track of horizontal touch event
    var xDown = null;
 
    function handleTouchStart(evt) {
        xDown = evt.touches[0].clientX;
    }
 
    function handleTouchMove(evt) {
        if (!xDown) {
            return;
    }
 
    var xUp = evt.touches[0].clientX;
    var xDiff = xDown - xUp;
 
    // Check if the user has made a horizontal swipe more than 50px
    if (Math.abs(xDiff) > 50) {    
        
        // Check if the user has swiped right
        if (xDiff > 0) {
            window.scrollBy({ top: scrollsize-10, left: 0, behavior: "instant",}); //swiping right will scroll down page by scrollsize minus 10px
        }
        
        // Check if the user has swiped left
        else {
            window.scrollBy({ top: -scrollsize+10, left: 0, behavior: "instant",}); //swiping left will scroll up page by scrollsize plus 10px
        }
        
    } 
    else {
        return;
    } 
 
    // Reset values
    xDown = null;
    }
    
    handleTouchStart(evt);
    handleTouchMove(evt);
    
})();