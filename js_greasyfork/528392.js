// ==UserScript==
// @name        youtube redirect to sub feed
// @namespace   Violentmonkey Scripts
//  @match       https://www.youtube.com/*
//  @match       https://www.youtube.com/
// @grant       none
// @version     1.1
// @license MIT
// @author      -
// @description Redirects youtube.com base site to the subscription feed
// @downloadURL https://update.greasyfork.org/scripts/528392/youtube%20redirect%20to%20sub%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/528392/youtube%20redirect%20to%20sub%20feed.meta.js
// ==/UserScript==

//changing this because youtube is stupid and doesnt do a full refresh when you change pages

setInterval(function(){

    if (window.location.href == "https://www.youtube.com/") {
        window.location = "https://www.youtube.com/feed/subscriptions";
    }

}, 250);