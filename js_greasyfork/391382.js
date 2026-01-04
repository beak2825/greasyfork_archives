// ==UserScript==
// @name Guardian Garbage
// @description Removes a bunch of stuff from the Guardian that isn't my cup of tea including lifestyle, sport, and opinion.
// @author screenbeard
// @namespace https://the.geekorium.com.au
// @version 0.1.0
// @match https://www.theguardian.com/*
// @grant none
// @run-at document-idle
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/391382/Guardian%20Garbage.user.js
// @updateURL https://update.greasyfork.org/scripts/391382/Guardian%20Garbage.meta.js
// ==/UserScript==

var garbage = ['opinion', 'sport', 'lifestyle', 'comment', 'hope-is-power'];

// Find and remove all trash sections sections.
for (var j = 0; j < garbage.length; j++){
    var section = document.querySelector("section#"+garbage[j]);
    if (section !== null){
        section.remove();
    }
}

// Find all the "items" on the Guardian.
var items = document.querySelectorAll("div.fc-item");

// Loop through each and check if it's garbage
for (var ii = 0; ii < items.length; ii++) {
    var thisitem = items[ii];
    if (typeof thisitem !== typeof undefined && thisitem !== null){
         for (var jj = 0; jj < garbage.length; jj++){
            if (thisitem.dataset.linkName.indexOf(garbage[jj]) > -1) {
                thisitem.parentNode.remove();
            }
        }
    }
}

var epic = document.querySelectorAll("div.after-article");
if (epic.length > 0){
    for (var e = 0; e < epic.length; e++){
        epic[e].remove();
    }
}