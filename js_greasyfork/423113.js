// ==UserScript==
// @name         Shorten YouTube Music Share Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turns the share link dialog on YouTube music into a youtu.be share link
// @author       You
// @match        *://*.youtube.com/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423113/Shorten%20YouTube%20Music%20Share%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/423113/Shorten%20YouTube%20Music%20Share%20Link.meta.js
// ==/UserScript==

$(document).ready(function(){
    $("body").on("click", function() {
        //console.log('body click');
    });
    $("body").on("click", "#share-url", function() {
        console.log($(this).val());
        var new_link = 'https://youtu.be/'+$(this).val().split('=')[1].split('&')[0];
        $(this).val(new_link);
    });
});