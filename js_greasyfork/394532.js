// ==UserScript==
// @name        PimpGoogleBookmarks
// @namespace   https://www.google.com/bookmarks
// @description Pimp Google Bookmarks
// @include     https://www.google.com/bookmarks/*
// @version     1
// @grant       none
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/394532/PimpGoogleBookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/394532/PimpGoogleBookmarks.meta.js
// ==/UserScript==

$(function() {
    try {
        $("div.kd-content-sidebar").css("height","80vh");
        $("div.kd-content-sidebar").css("overflow","scroll");
        $('a').bind('click', function(event){

            if(event.altKey) {
                var arr = event.target.innerText.split(" ");
                var href = window.location.href.replace("&hl=","+label:"+arr[0]+"&hl=");
                window.location.href = href;
            }
        });

    }
        catch(e){console.log(e)}
    });

