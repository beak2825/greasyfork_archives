// ==UserScript==
// @name         Simpcity Ads
// @namespace    http://yu.net/
// @version      1.0
// @description  t
// @author       You
// @match        https://simpcity.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simpcity.su
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483369/Simpcity%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/483369/Simpcity%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bypass() {
        const element = document.getElementById("papihatesblocks")
        if(element) element.remove()
        
        const element2 = document.querySelector("iframe")
        if(element2) element2.remove()
    }

    bypass()
    setTimeout(bypass, 200)
})();