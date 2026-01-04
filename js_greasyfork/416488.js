// ==UserScript==
// @name        Kijk.nl - Embedded Videos
// @namespace   Nameless
// @match       *://*.kijk.nl/*
// @grant       none
// @version     1.0
// @author      -
// @description Reload page for embedded video
// @downloadURL https://update.greasyfork.org/scripts/416488/Kijknl%20-%20Embedded%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/416488/Kijknl%20-%20Embedded%20Videos.meta.js
// ==/UserScript==

let a= location.href,
    b= 'https://embed.kijk.nl/video/';

if (a.includes('programmas'&&'afleveringen')) {
    c= a.split('/')[11];
    location= b+c;
   }