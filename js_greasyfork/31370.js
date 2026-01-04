// ==UserScript==
// @name          TheTechgame mentionTitle
// @namespace     none
// @description   Change the page title when someone mentions you
// @author        Made by speed, updated by tattoo
// @include       *://www.thetechgame.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @version       2.0
// @grant         GM_info
// @downloadURL https://update.greasyfork.org/scripts/31370/TheTechgame%20mentionTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/31370/TheTechgame%20mentionTitle.meta.js
// ==/UserScript==

var title = $(document).find("title").text();
var timer;

$('body').on('DOMNodeInserted', '*[class*="atyou"]', function(e) {
    if($(e.target).hasClass("new"))
    {
        clearTimeout(timer);
        var uname = $(e.target).find(".at-shout").attr('data-at-uname');
        document.title = uname+' mentioned you!';
    }
});

$(window).on( "click", function() {
    timer = setTimeout(function(){document.title = title;}, 5000);
});