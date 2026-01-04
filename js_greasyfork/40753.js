// ==UserScript==
// @name DOWNLOADOPENLOAD
// @description Download OpenLoad
// @namespace Violentmonkey Scripts
// @include http*
// @include https*
// @grant none
// @run-at document-end
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/40753/DOWNLOADOPENLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/40753/DOWNLOADOPENLOAD.meta.js
// ==/UserScript==

$("#videooverlay").click(function(){
    var videoBtn = $("video");
    $.each( videoBtn, function( key, value ) {
      GM_openInTab(value.src);
    });
})