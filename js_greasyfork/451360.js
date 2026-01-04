// ==UserScript==
// @name         YouTube Playlist Link Extractor Enhanced (backup)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhanced version of Youtube Playlist Video Link Extractor by Yooness Rostamy. Updates the code to work on modern versions and adds the ability to list unavailable videos.
// @author       Marvin P.
// @match        https://www.youtube.com/playlist?list=*
// @grant        none
// @resource     http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/451360/YouTube%20Playlist%20Link%20Extractor%20Enhanced%20%28backup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451360/YouTube%20Playlist%20Link%20Extractor%20Enhanced%20%28backup%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var opt = {
        title: 'YouTube Link Extractor Enhanced'
    };

    if ($('#unique-selector').length === 0) {
        // code to run if it isn't there
        $("head").append('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" type="text/css">');
        $("body").append ( '                                                                                   \
            <div id="dialog" title="Basic dialog" style="z-index:9999999 !important;">                         \
            <textarea rows="20" cols="50" id="vlinks" spellcheck="false"></textarea>                           \
            <button id="lcount">List</button> <button id="lcountdeleted">List Unavailable</button>             \                                                                    \
            </div>                                                                                             \
        ' );
    }


    $("#lcountdeleted").click(function() {
        var ar=[];
        $("ytd-playlist-video-renderer > #content > #container > #meta > h3 > a:contains('video]')").each(function(index){var item = $(this).attr("href").replace(/&list.*/g,'');ar[index]=item;}); //console.log(index+1 + " :" + $(this).attr("href").replace(/&list.*/g,''));});
        $("#vlinks").val(ar.map(x=> "https://www.youtube.com"+x).join("\n"));
    });

    $("#lcount").click(function() {
        var ar=[];
        $("ytd-playlist-video-renderer > #content > #container > #meta > h3 > a").each(function(index){var item = $(this).attr("href").replace(/&list.*/g,'');ar[index]=item;}); //console.log(index+1 + " :" + $(this).attr("href").replace(/&list.*/g,''));});
        $("#vlinks").val(ar.map(x=> "https://www.youtube.com"+x).join("\n"));
    });


    try{
        if(ypdialog.dialog('isOpen') == true)
            ypdialog.dialog('close');
    }
    catch(e){
    }
    window.ypdialog = $("#dialog").dialog(opt);
    ypdialog.dialog('open');
})();