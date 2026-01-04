// ==UserScript==
// @name         Ultragenerator
// @version      0.1
// @match        https://ultragenerator.com/random-youtube-comments/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @description  Predictable winner generation for https://ultragenerator.com/random-youtube-comments/
// @author       Kaimi
// @homepage     https://kaimi.io/2016/01/tampering-vk-contest-results/
// @namespace    https://greasyfork.org/users/228137
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/438848/Ultragenerator.user.js
// @updateURL https://update.greasyfork.org/scripts/438848/Ultragenerator.meta.js
// ==/UserScript==

// Winner data
var winner = {
    "name": "PewDiePie",
    "avatar": "https://yt3.ggpht.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s88-c-k-c0x00ffffff-no-rj",
    "link": "https://www.youtube.com/channel/UCQ4zIVlfhsmvds7WuKeL2Bw",
    "text": "Hello hello"
};


$(function() {
    var observer = new MutationObserver(function(mutations) {
        $('#results .avtr img').attr('src', winner.avatar);
        $('#results .fullname a').attr('href', winner.link);
        $('#results .fullname a').text(winner.name);
        $('#results .text').html(winner.text);
    });

    var target = document.querySelector('#results');
        observer.observe(target, {
        attributes: true
    });
});
