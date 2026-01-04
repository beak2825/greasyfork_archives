// ==UserScript==
// @name         Desi Drop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.desidrop.com/tracks/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375403/Desi%20Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/375403/Desi%20Drop.meta.js
// ==/UserScript==

$( document ).ready(function() {
    file_addr = $('#player-content script').text().split('file: "')[1].split('",')[0];

    $( "#track-meta" ).wrap( '<a href="'+file_addr+'"></a>' );


});