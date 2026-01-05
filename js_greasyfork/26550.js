// ==UserScript==
// @name        Youtube Material and Dark
// @version     1.0.4
// @description Makes Youtube the new hidden material and dark mode. Warning buggy! Created by @xIGBClutchIx
// @match       http*://www.youtube.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant       none
// @run-at      document-start
// @namespace   https://greasyfork.org/en/scripts/26550-youtube-material-and-dark
// @downloadURL https://update.greasyfork.org/scripts/26550/Youtube%20Material%20and%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/26550/Youtube%20Material%20and%20Dark.meta.js
// ==/UserScript==

var loaded = function() {
    // Set cookie
    document.cookie="PREF=f6=7;path=/;domain=.youtube.com";
    // Enable dark
    setTimeout(function(){
        enableDark();
    }, 200);
};

if (document.readyState == 'complete') {
    loaded();
} else {
    window.addEventListener('DOMContentLoaded', loaded);
}

function enableDark() {
    // Add debug menu temp
    $("#extra-buttons").html("<ytd-debug-menu data='[[debugData_]]'></ytd-debug-menu>" + $("#extra-buttons").html());
    // Debug menu set dark
    document.querySelector("ytd-debug-menu").fire("yt-dark-mode-toggled", {
        enabled: true
    });
    // Hack way to fix non dark header
    $(".ytd-masthead-1").css("background", "rgb(51,51,51)", "important");
    // Remove all nonsense
    setTimeout(function(){
        $("#extra-buttons").css("display", "none");
    }, 200);
}