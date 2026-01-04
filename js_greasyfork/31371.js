// ==UserScript==
// @name          TheTechgame Staff @
// @namespace     none
// @description   @staff ats all staff members
// @author        Tattoo
// @include       *://www.thetechgame.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @version       2.0
// @grant         GM_info
// @downloadURL https://update.greasyfork.org/scripts/31371/TheTechgame%20Staff%20%40.user.js
// @updateURL https://update.greasyfork.org/scripts/31371/TheTechgame%20Staff%20%40.meta.js
// ==/UserScript==

$('body').on('DOMNodeInserted', '#chatwindow', function(e) {
    $("div.shout:contains(@staff)").addClass("new atyouorange");
    $("div.shout:contains(@Staff)").addClass("new atyouorange");
    $("div.shout:contains(@STAFF)").addClass("new atyouorange");
});

$('#chatwindow .new').each(function(){
	$(this).delay(500).removeClass('new');
});