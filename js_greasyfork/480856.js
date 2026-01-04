// ==UserScript==
// @name        Youtube Anti-Adblock Bypasser
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.0
// @license MIT
// @author      mr.akz
// @description Removes the youtube anti-adblock popup.
// @downloadURL https://update.greasyfork.org/scripts/480856/Youtube%20Anti-Adblock%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/480856/Youtube%20Anti-Adblock%20Bypasser.meta.js
// ==/UserScript==

setInterval(function() {
    let checkElement = document.getElementsByClassName('style-scope ytd-popup-container');
    if(checkElement.length > 0){
        let elements = document.getElementsByClassName('opened');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
        let elements2 = document.getElementsByClassName('style-scope ytd-popup-container');
        while(elements2.length > 0){
            elements2[0].parentNode.removeChild(elements2[0]);
        }
    }
}, 1000); // checks every 1000 milliseconds (1 second)
