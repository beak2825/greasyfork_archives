// ==UserScript==
// @name         The Fart Effect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  this piece of fine software makes a fart sound when you click a link or button LMAO
// @author       xbin18
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436075/The%20Fart%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/436075/The%20Fart%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = ()=>{
        let stuff = document.querySelectorAll("a","button");
        stuff.forEach(x=>{
            x.onclick = ()=>{
                let fart = new Audio("https://www.soundjay.com/human/fart-01.mp3");
                fart.play();
        }
    })
}})();