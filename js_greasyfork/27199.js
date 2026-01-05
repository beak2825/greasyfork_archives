// ==UserScript==
// @name         Remove Youtube Ads(Works)
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Removes all ads including video ads
// @author       Wrekt/Ethan
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27199/Remove%20Youtube%20Ads%28Works%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27199/Remove%20Youtube%20Ads%28Works%29.meta.js
// ==/UserScript==

var advideo = false;

setTimeout(function() {
    console.log("Removing All Youtbe Ad's!!");
}, 4000);

function removead() {
    $(".video-stream").attr("src", "");
}

(function(){
    if ($(".videoAdUiRedesign")[0]){
    advideo = true;
} else {
    advideo = false;
}
    $("#player-ads").remove();
    $("#masthead-ad").remove();
    $("#offer-module").remove();
    $(".video-ads").remove();
    $("#pyv-watch-related-dest-url").remove();

    if (advideo == true) {
        removead();
    }
    setTimeout(arguments.callee, 1000);
})(1000);
