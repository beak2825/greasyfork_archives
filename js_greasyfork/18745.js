// ==UserScript==
// @name         сукаблядь Chrome
// @version      0.16-testing
// @description  K P A C U B O
// @author      xxxVADIK_666xxx
// @include     https://yoba.vg:1337/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @namespace https://greasyfork.org/users/38515
// @downloadURL https://update.greasyfork.org/scripts/18745/%D1%81%D1%83%D0%BA%D0%B0%D0%B1%D0%BB%D1%8F%D0%B4%D1%8C%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/18745/%D1%81%D1%83%D0%BA%D0%B0%D0%B1%D0%BB%D1%8F%D0%B4%D1%8C%20Chrome.meta.js
// ==/UserScript==
interval = setInterval(function(){
$("span.userMessageBody:contains('сукаблядь'),div.userMessageBody:contains('сукаблядь')").html(function (_, html) {
     return html.replace(/сукаблядь/g,"<img class='emoticon' src='https://i.imgur.com/yuN7sBZ.png' title='сукаблядь' alt='сукаблядь' />")
});
},69);