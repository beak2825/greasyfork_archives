// ==UserScript==
// @name         Less Distracting YouTube
// @namespace    http://tampermonkey.net/
// @version      2024-08-06.5
// @description  Remove video suggestions on home/watch pages
// @author       Too___Tall
// @match       *://*.youtube.com/*
// @match       *://*.youtube-nocookie.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502799/Less%20Distracting%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/502799/Less%20Distracting%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function removeDistractions () {
        if (/^.*youtube.com\/?(?:#searching)?$/.test(window.location.href)) {
            //Remove suggestions on home page
            try {document.querySelector("#app > .page-container").remove();} catch(e) {}
            try {document.querySelector("#contents").remove();} catch(e) {}
        } else if (/^.*youtube.com\/watch.*$/.test(window.location.href)) {
            //Remove related content on mobile
            try {document.querySelector("#app > div.page-container > ytm-watch > div.watch-below-the-player > ytm-single-column-watch-next-results-renderer > ytm-item-section-renderer").remove();} catch(e) {}
        }
        
        // Remove related content on desktop web
        //Had some weird issue getting this to run with a check on window location, just running it last
        try {document.querySelector("#related").remove();} catch(e){}
    }

    let distractionInterval; 
    
    //Fire it once when we load/change
    function intervalFunction () {
        try {clearInterval(distractionInterval);} catch (e) {}
        
        distractionInterval = window.setInterval(removeDistractions, 100);
    
        window.setTimeout(() => {
            try {window.clearInterval(distractionInterval);} catch (e) {}
            
            distractionInterval = window.setInterval(removeDistractions, 1000);
        
        }, 10000);
    }
    intervalFunction();
    
    //Fire it on state change events
    window.addEventListener('hashchange',fastInterval);
})();