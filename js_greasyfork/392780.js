// ==UserScript==
// @name         Avenoel Music
// @version      1.0
// @description  Display the title of the current music in the Avenoel profile
// @author       Aiko
// @include      https://avenoel.org/profil/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/400325
// @downloadURL https://update.greasyfork.org/scripts/392780/Avenoel%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/392780/Avenoel%20Music.meta.js
// ==/UserScript==
// jshint esversion: 6

(function() {
    "use strict"

    const url = $("meta[property='og:music']").attr("content");
    if (!url) return;
    $.getJSON("https://noembed.com/embed",
    { format: "json", url }, (data) => {
        $(".profile-section.profile-title")
            .append(`<a href="${data.url}">${data.title}</a>`);
    });
})()
