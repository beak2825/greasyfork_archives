// ==UserScript==
// @name         powerline.io speed turn
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Replaces inline JS on powerline.io to creat a speed turn!
// @author     	 Xmusic
// @match        *://powerline.io/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/481796/powerlineio%20speed%20turn.user.js
// @updateURL https://update.greasyfork.org/scripts/481796/powerlineio%20speed%20turn.meta.js
// ==/UserScript==
 
var evilJSRegex = /SpaceWars/;
var replacementJSUrl = "https://drive.google.com/uc?export=view&id=13Cjc3PZ0oeSQ3DZk-aCJQhSCn4QRkEWR";
 
function removeInlineJS(e) {	
    if (evilJSRegex.test(e.target.innerText)) {
        console.log("It worked!!!")
        // Stop the default JS from running
        e.stopPropagation();
        e.preventDefault();
 
        // Create a new script tag for our custom JS
        var awesomeJS = document.createElement("script");
        awesomeJS.type = "text/javascript";
        awesomeJS.src = replacementJSUrl;
 
        // Replace the old JS with our custom shiznit
        var parentNode = e.target.parentNode;
        parentNode.removeChild(e.target);
        parentNode.appendChild(awesomeJS);
 
        // Remove the event listener
        window.removeEventListener("beforescriptexecute", removeInlineJS, true);
    }
}
 
(function() {
  	'use strict';
    window.addEventListener("beforescriptexecute", removeInlineJS, true);
})();