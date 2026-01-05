// ==UserScript==
// @name         gbeChrome
// @version      0.16-testing
// @description  K P A C U B O
// @author      xxxVADIK_666xxx
// @include     https://yoba.vg:1337/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @namespace https://greasyfork.org/users/38515
// @downloadURL https://update.greasyfork.org/scripts/18743/gbeChrome.user.js
// @updateURL https://update.greasyfork.org/scripts/18743/gbeChrome.meta.js
// ==/UserScript==
interval = setInterval(function(){
$("span.userMessageBody:contains('gbe'),div.userMessageBody:contains('gbe')").html(function (_, html) {
     return html.replace(/gbe/g,"<img class='emoticon' src='https://i.imgur.com/gjjzmyU.png' title='gbe' alt='gbe' />")
});
},69);