// ==UserScript==
// @name         Youtube Inoreader Subscribe
// @name:en      Youtube Inoreader Subscribe
// @version      1.0
// @description  Adds inoreader subscribe links for youtube channels
// @match        *://*.youtube.com/*
// @run-at       document-end
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @namespace https://greasyfork.org/users/44041
// @downloadURL https://update.greasyfork.org/scripts/396368/Youtube%20Inoreader%20Subscribe.user.js
// @updateURL https://update.greasyfork.org/scripts/396368/Youtube%20Inoreader%20Subscribe.meta.js
// ==/UserScript==

$('ytd-video-meta-block a').each(function(){
    console.log($(this).attr('href'));
    $(this).parent().append(' &nbsp; <a target="_blank" href="https://www.inoreader.com/?add_feed=https://www.youtube.com'+$(this).attr('href')+'">RSS</a>');
});

$('#avatar-endpoint').each(function(){
    console.log($(this).attr('href'));
    $(this).parent().append(' &nbsp; <a target="_blank" href="https://www.inoreader.com/?add_feed=https://www.youtube.com'+$(this).attr('href')+'">RSS</a>');
});
