    // ==UserScript==
    // @name         YouTube Playlist Link Extractor Enhanced
    // @namespace    http://tampermonkey.net/
    // @version      0.7
    // @description  Enhanced version of Youtube Playlist Video Link Extractor by Yooness Rostamy. Updates the code to work on modern versions and adds the ability to list unavailable videos.
    // @author       Marvin P.
    // @match        https://www.youtube.com/playlist?list=*
    // @grant        none
    // @resource     http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
    // @require      https://code.jquery.com/jquery-1.12.4.min.js
    // @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
    // @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/451324/YouTube%20Playlist%20Link%20Extractor%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/451324/YouTube%20Playlist%20Link%20Extractor%20Enhanced.meta.js
    // ==/UserScript==
     
    (function() {
    'use strict';
 
    var ytple_loaded = 0;

    function appendYTPLE(target){
        $(target).append ( '                                    \
<textarea id="ytple_links" spellcheck="false"></textarea>                                        \
<div class="ytple_spacer">                                                                       \
<div>                                                                                            \
<button id="ytple_count" class="ytple_btn ytple_btnprimary">List</button>                        \
<button id="ytple_countdeleted" class="ytple_btn">List Unavailable</button>                      \
</div>                                                                                           \
<div>                                                                                            \
<b class="ytple_counter">Count</b>                                                               \
<p id="ytple_vcount" class="ytple_counter">0</p>                                                 \
</div>                                                                                           \
</div>                                                                                           \
' );
    };

    function generateLinks(selector) {
        var ar=[];
        $(selector).each(function(index){var item = $(this).attr("href").replace(/&list.*/g,'');ar[index]=item;});
        $("#ytple_links").val(ar.map(x=> "https://www.youtube.com"+x).join("\n"));
        $("#ytple_vcount").text(ar.length);
    };
 
    $( window ).on( "load", function() {
        window.addEventListener("yt-navigate-finish", () => {
            if (ytple_loaded == 0) {
                // quick fix for new YouTube layout
                if ($("body").attr("rounded-container") === ""){
                    var target = "ytd-playlist-header-renderer";
                    appendYTPLE(target);
                } else {
                    var target = "ytd-playlist-sidebar-renderer";
                    appendYTPLE(target);
                }
            }
 
            // Append styles to body
            $( "<style>#ytple_links { box-sizing: border-box; width: 100%; height: 30vh; background-color: transparent; border: 1px solid var(--ytd-searchbox-border-color); border-radius: 2px; resize: none; font-family: Roboto, Arial, sans-serif; font-size: 14px; padding: 10px 16px; color: var(--yt-spec-text-primary); margin-bottom: 8px; }</style>" ).appendTo( "head" );
            $( "<style>.ytple_btn { border: 1px solid var(--yt-spec-call-to-action); padding: var(--yt-button-padding-minus-border); text-transform: uppercase; font-family: Roboto, Arial, sans-serif; font-size: 14px; text-align: center; border-radius: 2px; background-color: transparent; color: var(--yt-spec-call-to-action); cursor: pointer; margin-right: 4px; } }</style>" ).appendTo( "head" );
            $( "<style>.ytple_btnprimary { background-color: var(--yt-spec-call-to-action); color: var(--yt-spec-general-background-a); }</style>" ).appendTo( "head" );
            $( "<style>.ytple_spacer { display: flex; flex-direction: row; justify-content: space-between; align-items: center; }</style>" ).appendTo( "head" );
            $( "<style>.ytple_counter { color: var(--yt-spec-text-secondary); margin: 0; text-align: right; }</style>" ).appendTo( "head" );
 
            // Prevent appending aforementioned code on next playlist load
            ytple_loaded = 1;
 
            $("#ytple_countdeleted").click(function() {
                var selector="ytd-playlist-video-renderer > #content > #container > #meta > h3 > a:contains('video]')";
                generateLinks(selector);
            });
 
            $("#ytple_count").click(function() {
                var selector="ytd-playlist-video-renderer > #content > #container > #meta > h3 > a";
                generateLinks(selector);
            });
        });
    });
 
 
 
})();