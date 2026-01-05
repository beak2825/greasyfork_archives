// ==UserScript==
// @name         gbeROLLChrome
// @version      0.17-testing
// @description  K P A C U B O
// @author      xxxVADIK_666xxx
// @include     https://yoba.vg:1337/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @namespace https://greasyfork.org/users/38515
// @downloadURL https://update.greasyfork.org/scripts/18790/gbeROLLChrome.user.js
// @updateURL https://update.greasyfork.org/scripts/18790/gbeROLLChrome.meta.js
// ==/UserScript==
interval = setInterval(function(){
$("span.userMessageBody:contains('gbe'),div.userMessageBody:contains('gbe')").html(function (_, html) {
     return html.replace(/gbe/g,"<img class='emoticon' src='https://i.imgur.com/QIzt6n6.gif' title='gbe' alt='gbe' />")
});
},69);