// ==UserScript==
// @name        TF2R Chat Width
// @namespace   no
// @description I was bored. Changes the chat width to a value set by you.
// @include     http://tf2r.com/chat.html
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10428/TF2R%20Chat%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/10428/TF2R%20Chat%20Width.meta.js
// ==/UserScript==

$(document).ready(function(){
    resChat = 1150;
    $("#wrapper").css('width', resChat);
    $("#nav_holder").css('width', resChat);
    $("#content").css('width', resChat - 10);
    $("#feedtext").css('width', resChat - 130);
    // This one is not really necessary, but the chatbox cuts a bit of my text
    $("#feedtext").css('height', 16);
    $(".indent table").css('width', resChat - 35);    
})


		