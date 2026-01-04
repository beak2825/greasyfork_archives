// ==UserScript==
// @name         BanKanStyle
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fuck bad emotes
// @author       N3rdsWithGame
// @match        *.twitch.tv/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35851/BanKanStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/35851/BanKanStyle.meta.js
// ==/UserScript==

var hideList = new Array("JKanStyle",
                         "LUL",
                         "popesKanStyle");

function hideEmotes() {
    var emotes = $(".chat-line__message--emote");

    emotes.each(function() {
        var emoteAlt = this.getAttribute("alt");
        var found = false;
        var length = hideList.length;
        for(var i=0; i < length; i++) {
            if(emoteAlt.includes(hideList[i])) {
                $(this).hide();
                $(this).attr('class',"JCancer");
            }
        }
    });
}

$(document).ready(function(){
    console.log("starting BanKanStyle");
    setInterval(hideEmotes,1);
});
