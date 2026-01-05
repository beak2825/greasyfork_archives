// ==UserScript==
// @name         gbeFireFox
// @version      0.16-testing
// @description  K P A C U B O
// @author      xxxVADIK_666xxx
// @include     https://yoba.vg:1337/*
// @namespace https://greasyfork.org/users/38515
// @downloadURL https://update.greasyfork.org/scripts/18742/gbeFireFox.user.js
// @updateURL https://update.greasyfork.org/scripts/18742/gbeFireFox.meta.js
// ==/UserScript==
interval = setInterval(function(){
$("span.userMessageBody:contains('gbe'),div.userMessageBody:contains('gbe')").html(function (_, html) {
     return html.replace(/gbe/g,"<img class='emoticon' src='https://i.imgur.com/gjjzmyU.png' title='gbe' alt='gbe' />")
});
},69);