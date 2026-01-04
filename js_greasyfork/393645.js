// ==UserScript==
// @name         InstaKiller
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Bypass the 'required' log in for instagram.
// @author       @feedmegrizzly
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393645/InstaKiller.user.js
// @updateURL https://update.greasyfork.org/scripts/393645/InstaKiller.meta.js
// ==/UserScript==


// When browsing Instagram has got you down and won't let you keep scrolling. You don't want to have to log in!!!
// What the hell are they thinking? With this script, you don't need to worry about anything. Its all taken care of...

window.addEventListener('scroll', ()=> {
    document.body.style.overflow = "scroll"
    document.getElementsByClassName('RnEpo Yx5HN   ')[0].remove();
})

