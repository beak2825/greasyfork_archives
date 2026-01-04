// ==UserScript==
// @name         v3rm pride month icon fix
// @namespace    https://www.v3rmillion.net
// @version      1.0
// @description  the rainbow one is so ugly
// @author       ghop
// @match        https://v3rmillion.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445853/v3rm%20pride%20month%20icon%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/445853/v3rm%20pride%20month%20icon%20fix.meta.js
// ==/UserScript==


(function() {
    /* header logo */
    document.querySelectorAll('[title="V3rmillion"]')[0].setAttribute('src', document.getElementsByClassName(decodeURIComponent('%6c%6f%67%6f%75%74'))[0].getAttribute('href'));

    /* favicon */
    var fav = document.createElement('meta');
    fav.setAttribute('http-equiv', 'refresh');
    fav.setAttribute('content', '3;URL=https://v3rmillion.net/#favicon.ico');
    document.head.appendChild(fav);
})();