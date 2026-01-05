// ==UserScript==
// @name         Twitch Bandaid
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Fixes the Twitch player by replacing it with the embeddable version. Kind of a bandaid solution.
// @author       Tantusar
// @match        www.twitch.tv/*
// @match        twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17221/Twitch%20Bandaid.user.js
// @updateURL https://update.greasyfork.org/scripts/17221/Twitch%20Bandaid.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.addEventListener("load", function() {
var pathArray = window.location.pathname.split( '/' );
    if (pathArray.length == 2) {
var channel = pathArray[1];
var src = "<iframe src='http://player.twitch.tv/?playertype=site&channel=".concat(channel);
var final = src.concat("' style='height:inherit; width:inherit'>");
var list = document.getElementsByClassName("dynamic-player");
for (var i = 0; i < list.length; i++) {
    list[i].innerHTML = final;
}
var listb = document.getElementsByClassName(" dynamic-player");
for (var j = 0; j < listb.length; j++) {
    listb[j].innerHTML = final;
}
}
}, false); 