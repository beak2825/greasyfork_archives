// ==UserScript==
// @name         The Pirate Bay open in new tab
// @namespace    https://greasyfork.org/users/754130
// @version      0.22
// @description  This script makes it possible to open torrents in a new tab by clicking on them with the middle mouse button.
// @author       Bl4ke
// @match        *thepiratebay.org/search.php*
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/424375/The%20Pirate%20Bay%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/424375/The%20Pirate%20Bay%20open%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var incognitoMode = GM_info.isIncognito;

    // get the addresses and add listener to each link
    function setup(){
        var list_entries = document.getElementsByClassName("item-title");
        for(var i = 0; i < list_entries.length; i++) {
            var link = "https://thepiratebay.org" + list_entries[i].firstElementChild.getAttribute("href");
            addListener(list_entries[i], link);
        }
    }

    // Adds a mouse button listener to an element
    function addListener(element, link){
        element.addEventListener("mousedown", function(event){
            // event.which value: 1:left; 2:middle; 3:right mouse button
            if(event.which == 2) {
                event.preventDefault(); //prevents enabling scrolling mode
                if(incognitoMode) {
                    GM_openInTab(link, {incognito: true});
                }
                else{
                    GM_openInTab(link);
                }
            }
        });
    }
    setup();
})();