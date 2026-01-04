// ==UserScript==
// @name         Youtube Playlist Video Link Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tries to extract Youtube Video links from playlists page to be able to copy links to external music players like Daum PotPlayer
// @author       Yooness Rostamy
// @match        https://www.youtube.com/playlist?list=*
// @grant        none
// @resource     http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/393355/Youtube%20Playlist%20Video%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/393355/Youtube%20Playlist%20Video%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var opt = {
        title: 'Youtube Playlist Links'
    };

    if ($('#unique-selector').length === 0) {
        // code to run if it isn't there
        $("head").append('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" type="text/css">');
        $("body").append ( '                                                                                   \
            <div id="dialog" title="Basic dialog" style="z-index:9999999 !important;">                         \
            <textarea rows="20" cols="50" id="vlinks" spellcheck="false"></textarea>                           \
            <strong id="vcount"><strong>                                                                       \
            </div>                                                                                             \
        ' );
    }


    var ar=[];
    $("ytd-playlist-video-renderer > #content > a").each(function(index){var item = $(this).attr("href").replace(/&list.*/g,'');ar[index]=item;});//console.log(index+1 + " :" + $(this).attr("href").replace(/&list.*/g,''));});
    $("#vlinks").val(ar.map(x=> "https://www.youtube.com"+x).join("\n"));
    $("#vcount").text("count: " + ar.length);
    try{
        if(ypdialog.dialog('isOpen') == true)
            ypdialog.dialog('close');
    }
    catch(e){
    }
    window.ypdialog = $("#dialog").dialog(opt);
    ypdialog.dialog('open');
})();