// ==UserScript==
// @name          TheTechgame move trash cans
// @namespace     none
// @description   → move trash cans
// @author        Tattoo
// @include       *://www.thetechgame.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @version       3.0
// @grant         GM_info
// @downloadURL https://update.greasyfork.org/scripts/4779/TheTechgame%20move%20trash%20cans.user.js
// @updateURL https://update.greasyfork.org/scripts/4779/TheTechgame%20move%20trash%20cans.meta.js
// ==/UserScript==

$('body').on('DOMNodeInserted', '#chatwindow', function(e) {
    $('#chatwindow').find(".fa-trash").css('float','right');

});