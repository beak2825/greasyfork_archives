// ==UserScript==
// @name         Stealth 316 https image fix
// @namespace    http://resesona.wordpress.com/
// @version      0.2
// @description  Fix the old site images and image links by reverting source to http
// @author       You
// @match        https://www.stealth316.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382933/Stealth%20316%20https%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/382933/Stealth%20316%20https%20image%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var imgs = document.getElementsByTagName("img");
    var ahrefs = document.getElementsByTagName("a");
    for(var ia=0, la=ahrefs.length; ia<la; ia++){
        if(ahrefs[ia].href.includes('.jpg')){
            ahrefs[ia].href = ahrefs[ia].href.replace('https://','http://');
        }
    }
    for(var i=0, l=imgs.length; i<l; i++) {
        imgs[i].src = imgs[i].src.replace('https://','http://');
    }
})();