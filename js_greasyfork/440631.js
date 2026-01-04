// ==UserScript==
// @name         Quote Marker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds color indicator when someone is speaking in novels, so it's easier to read
// @author       Mykes
// @license MIT

// @match        https:// insert site here /*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=blogspot.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440631/Quote%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/440631/Quote%20Marker.meta.js
// ==/UserScript==
window.addEventListener("load", function() {
    // Get all elements
    var elements = document.body.getElementsByTagName("*");
    //Loop the elements
    for(var i = 0; i < elements.length; i++) {
        var current = elements[i];
        // Get the element has no children and not empty
        if(current.children.length === 0 && current.textContent.replace(/ |\n/g,"") !== "") {
            // Check if the text has quotes
            if(current.textContent.includes('“') && current.textContent.includes('”')){
                // Color the text
                current.style.color = "darkred";
            }
        }
    }
}, false);
