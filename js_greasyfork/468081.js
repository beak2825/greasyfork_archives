// ==UserScript==
// @name         Reddit Strike Redirect
// @description  Redirect away from Reddit if it's during the strike
// @version      1.1
// @namespace    ScriptUnge-reddit
// @license      MIT
// @author       ScriptUnge
// @match        *.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/468081/Reddit%20Strike%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/468081/Reddit%20Strike%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const memeUrl = "https://i.imgflip.com/7ofik2.jpg";
    const today = new Date();
    const strikeYear = 2023;
    const strikeMonth = 5;
    const strikeStart = 12;
    const strikeDuration = 2; // strike duration in days (48 hours); increase at your own leisure

    if(
        today.getUTCFullYear() == strikeYear &&
        today.getUTCMonth() == strikeMonth &&
        today.getUTCDate() >= strikeStart &&
        today.getUTCDate() < (strikeStart + strikeDuration)
    ) {
        window.navigation.navigate(memeUrl);
    }
})();
