// ==UserScript==
// @name         TEST GODMODE
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces inline JS on powerline.io
// @author     	 SHED_MODZ
// @match        *://powerline.io/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/419727/TEST%20GODMODE.user.js
// @updateURL https://update.greasyfork.org/scripts/419727/TEST%20GODMODE.meta.js
// ==/UserScript==
 
var evilJSRegex = /SpaceWars/;
var replacementJSUrl = "http://otherstuffjs.atwebpages.com/replace.js";
 
function removeInlineJS(e) {
  	
    if (evilJSRegex.test(e.target.innerText)) {
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