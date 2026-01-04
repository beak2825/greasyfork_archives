// ==UserScript==
// @name         Biggie Torn Script
// @namespace    https://www.torn.com/profiles.php?XID=2039022
// @version      0.69
// @description  Changes Color Of Background
// @author       Biggie [ 2039022]
// @match        https://torn.com/
// @match        http://www.torn.com/*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369229/Biggie%20Torn%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/369229/Biggie%20Torn%20Script.meta.js
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