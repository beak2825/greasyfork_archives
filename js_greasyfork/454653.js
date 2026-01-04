// ==UserScript==
// @name         Mastodon - Customization
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Used for customizing Masto CSS to my personal liking.  Nothing to see here. (do not use)
// @author       Threeskimo
// @match        *://mas.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mas.to
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454653/Mastodon%20-%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/454653/Mastodon%20-%20Customization.meta.js
// ==/UserScript==

var dostuff = function() {
    $('#mastodon > div > div > div.columns-area > div:nth-child(6)').css("width", "430px");
    $('.spoiler-button').remove();
}

setInterval(dostuff, 500); // call every 500 milliseconds

$( window ).on( "load", function() {
    $('#mastodon > div > div > div.columns-area > div.drawer > div.drawer__pager > div:nth-child(1) > div.drawer__inner__mastodon > img').attr("src","https://i.pinimg.com/originals/d3/77/b3/d377b33ccd58b085ba29faf1b78ed54a.gif")
});