// ==UserScript==
// @name         Mangairo Arrow keys navigate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use arrow keys to navigate chapters
// @author       Anonymous
// @match        https://mangairo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388266/Mangairo%20Arrow%20keys%20navigate.user.js
// @updateURL https://update.greasyfork.org/scripts/388266/Mangairo%20Arrow%20keys%20navigate.meta.js
// ==/UserScript==

(function() {
    'use strict';

   document.addEventListener("keydown", function(event) {
       if(event.which == 39) {
           var aTags = document.getElementsByTagName("a");
           var searchText = "NEXT CHAPTER";
           var found;

           for (var i = 0; i < aTags.length; i++) {
               if (aTags[i].textContent == searchText) {
                   found = aTags[i];
                   break;
               }
           }
           if(found) {
               found.click();
           }
       } else if(event.which == 37) {
           var aTags = document.getElementsByTagName("a");
           var searchText = "PREV CHAPTER";
           var found;

           for (var i = 0; i < aTags.length; i++) {
               if (aTags[i].textContent == searchText) {
                   found = aTags[i];
                   break;
               }
           }
           if(found) {
               found.click();
           }
       }
    })

})();