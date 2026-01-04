// ==UserScript==
// @name         Torn For Biggie
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.0
// @description  Script
// @author       Mike Pence
// @match        https://www.torn.com/*
// @match        http://www.torn.com/*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369227/Torn%20For%20Biggie.user.js
// @updateURL https://update.greasyfork.org/scripts/369227/Torn%20For%20Biggie.meta.js
// ==/UserScript==

// Change these
var backgroundChangeTime = 5000;
var backgroundChangeColors = ["red", "green", "blue"];

// Dont change these
var backgroundChangeIndex = 0;
$(document).ready(function(){
    $("body").css("background-image", "none");
    backgroundChange();
});
function backgroundChange() {
    $("body").animate({
        backgroundColor: backgroundChangeColors[backgroundChangeIndex]
    }, backgroundChangeTime, function() {
        backgroundChangeIndex++;
        if (backgroundChangeIndex > backgroundChangeColors.length) {
            backgroundChangeIndex = 0;
        }
        backgroundChange();
    });
}