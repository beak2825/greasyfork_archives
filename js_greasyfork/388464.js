// ==UserScript==
// @name         Bandcamp snatcher
// @namespace    http://andrewiankidd.co.uk
// @version      0.1
// @description  Feeling good about this one
// @author       You
// @include      https://*.bandcamp.com/album/*
// @include      http://*.bandcamp.com/album/*
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/388464/Bandcamp%20snatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/388464/Bandcamp%20snatcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('----------starting bandcamp stuff: ');

    var regmatches = $('body').html().toString().match(new RegExp('\"\/\/(.*?)\"', 'g'));

    console.log('----------found ' + (regmatches.length - 1) + ' tracks' );

    i=0;
    $('#track_table > tbody  > tr').each(function() {
        if (i % 1 === 0){
            //alert('track: ' + i);
            $(this).prepend("<td><a download='Track " + i + ".mp3' href='" + regmatches[i].replace(new RegExp('"', 'g'), '') + "' style='display:inline;'><img style='height:16px;' src='http://i.imgur.com/RmhfNoM.png'></a></td>"); 
        }
        i=i+0.5;
    });
})();