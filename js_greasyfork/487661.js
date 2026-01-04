// ==UserScript==
// @name sgp link
// @namespace http://random.com
// @description Add a link to notes
// @include https://sgpics.net/tag/*
// @include https://sgpics.xyz/tag/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version 0.2.20200507
// @downloadURL https://update.greasyfork.org/scripts/487661/sgp%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/487661/sgp%20link.meta.js
// ==/UserScript==

$( document ).ready(function() {

  $("h1.entry-title").wrap(function() {
       var link = $('<a/>');
       link.attr('href', 'https://www.suicidegirls.com/girls/'+$("h1.entry-title").text());
       return link;
    });

});