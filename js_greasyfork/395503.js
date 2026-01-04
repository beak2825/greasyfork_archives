// ==UserScript==
// @name         We Heart It GIF Autoplay
// @version      1.0
// @description  Autoplays gifs on We Heart It!
// @author       Tsukani
// @match        https://weheartit.com/*
// @grant        none
// @namespace https://greasyfork.org/users/305208
// @downloadURL https://update.greasyfork.org/scripts/395503/We%20Heart%20It%20GIF%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/395503/We%20Heart%20It%20GIF%20Autoplay.meta.js
// ==/UserScript==

//Terrible code lol:
var oldURL = "";
var currentURL = window.location.href;
function updateGifs() {
    var l = Number($("img.entry-thumbnail").length);
    for (i=0;i<l;i++) {
        try {
            $("span.badge-gif:eq(" + i + ")").parent().parent().find(".entry-thumbnail").attr("src", "https://data.whicdn.com/images/" + $("span.badge-gif:eq(" + i + ")").parent().parent().find(".entry-thumbnail").attr("src").split("/")[4] + "/original.gif").css("height", "100%");
        } catch(e){}
    }
}
function checkURLchange(currentURL){
    if(currentURL != oldURL){
        updateGifs();
        oldURL = currentURL;
    }
    oldURL = window.location.href;
    setInterval(function() {
        checkURLchange(window.location.href);
    }, 500);
}
checkURLchange();