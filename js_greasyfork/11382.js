// ==UserScript==
// @name         JVC Miniatures PATCH
// @namespace    http://www.jeuxvideo.com/profil/perpetuel
// @version      0.3
// @description  PATCH pour détecter les miniatures utilisant la faille de redirection :hap:
// @author       Perpetuel
// @match        http://www.jeuxvideo.com/*
// @match        https://www.jeuxvideo.com/*
// @match        http://jvforum.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11382/JVC%20Miniatures%20PATCH.user.js
// @updateURL https://update.greasyfork.org/scripts/11382/JVC%20Miniatures%20PATCH.meta.js
// ==/UserScript==

var nsdomains = ["noelshack.com", "image.noelshack.com", "www.noelshack.com"];
$(".img-shack").each(function() {
    var s = $(this).parent().attr("href").split("/");
    if (-1 == $.inArray(s[2], nsdomains)) {
        $(this).css("border", "3px solid red");
        var t = $(this).attr("alt").split("#nonexist:");
        if(t.length == 2) {
            var a = t[1].search("http://");
            $(this).parent().attr("href", t[1].substring(a));
        }
        else {
            var b = $(this).attr("alt").search("http://image.noelshack.com/");
            $(this).parent().attr("href", $(this).attr("alt").substring(b));
        }
    } else $(this).css("border", "1px solid green")
});