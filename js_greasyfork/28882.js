// ==UserScript==
// @name         New autoswap using page scroll test
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  right click to fire secondary once
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28882/New%20autoswap%20using%20page%20scroll%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/28882/New%20autoswap%20using%20page%20scroll%20test.meta.js
// ==/UserScript==

setInterval(function(){ 
    function pageScroll() {
    window.scrollBy(0,1);
    scrolldelay = setTimeout(pageScroll,10);
}
}, 10);