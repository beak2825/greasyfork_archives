// ==UserScript==
// @name         vidBgone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove videos from 9gag
// @author       Entropy0
// @match        https://9gag.com/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371345/vidBgone.user.js
// @updateURL https://update.greasyfork.org/scripts/371345/vidBgone.meta.js
// ==/UserScript==
// For some reason, disabling videos upon page load keeps the whole page blank. But endless scroll means we'd have to reapply at scrolling anyway.
(function() {
    'use strict';
//    $(".gif-post").parents('article').css("display", "none");
    $(window).scroll(function(){$(".gif-post").parents('article').css("display", "none");});
//    $(".video-post").parents('article').css("display", "none");
    $(window).scroll(function(){$(".video-post").parents('article').css("display", "none");});
//    $(".youtube-post").parents('article').css("display", "none");
    $(window).scroll(function(){$(".youtube-post").parents('article').css("display", "none");});
//    $(".outstream-ad-outer-wrapper").css("display", "none");
    $(window).scroll(function(){$(".outstream-ad-outer-wrapper").css("display", "none");});
//    $(".post-page").css("display", "block");
    $(window).scroll(function(){$(".post-page").css("display", "block");});
})();

