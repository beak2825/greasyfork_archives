// ==UserScript==
// @name        Invidiously
// @namespace   Backend
// @description Redirect all Youtube links to an Invidious instance, for Palemoon-browser
// @match *://*.youtube.com/*
// @match *://*.youtu.be.com/*
// @version     1.0
// @grant       none
// @license     GPL v3.0
// @downloadURL https://update.greasyfork.org/scripts/430457/Invidiously.user.js
// @updateURL https://update.greasyfork.org/scripts/430457/Invidiously.meta.js
// ==/UserScript==

/* 
N O T E 
First disable javascript on the youtube site, I personally use ublock to disable all javascript and rubbish, 
This will improve performance on goanna based browsers, that aren't really supported for the new polymer ui...
*/
const instances = [
  "https://vid.puffyan.us",
  "https://invidious.snopyta.org",
  "https://yewtu.be"
];

(() => { //IIFE arrow function
    if (window.location.pathname == "/") {
        'use strict';
        document.location.replace(instances[0] + "/feed/popular");
    } else if (window.location.href == "/watch") {
        'use strict';
        var id = window.location.href.match('\/watch.*');
        document.location.replace(instances[0] + id[0]);
    }
})();