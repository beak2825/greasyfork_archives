// ==UserScript==
// @name         Just use these sites!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents students from accessing gaming and other non-class related websites.
// @author       Olivia Wang
// @match        *://*/*
// @exclude      https://microbit.org/*
// @exclude      https://*.microbit.org/*
// @exclude      https://scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422470/Just%20use%20these%20sites%21.user.js
// @updateURL https://update.greasyfork.org/scripts/422470/Just%20use%20these%20sites%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("working");

    main_url = "https://scratch.mit.edu/";

    window.location.href = main_url;
})();