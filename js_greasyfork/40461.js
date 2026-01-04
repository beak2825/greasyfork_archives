// ==UserScript==
// @name         Copy Lyrics from プチリリ, 歌詞タイム
// @namespace    https://greasyfork.org/users/179168
// @version      1.2.1
// @description  Selectable lyrics and a button for copying all the lyrics
// @author       YellowPlus
// @run-at       document-start
// @match        *://petitlyrics.com/lyrics/*
// @match        *://www.kasi-time.com/*
// @grant        none
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40461/Copy%20Lyrics%20from%20%E3%83%97%E3%83%81%E3%83%AA%E3%83%AA%2C%20%E6%AD%8C%E8%A9%9E%E3%82%BF%E3%82%A4%E3%83%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/40461/Copy%20Lyrics%20from%20%E3%83%97%E3%83%81%E3%83%AA%E3%83%AA%2C%20%E6%AD%8C%E8%A9%9E%E3%82%BF%E3%82%A4%E3%83%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.location.href.match(/.*:\/\/petitlyrics.com\/lyrics\/.*/)) {
        var lyrics;

        $(document).ready(function(){
            $("<button id='copy_button' class='pure-button'>Copy Lyrics</button>").click(()=>{
                $("<textarea id='temp_lyrics'>"+lyrics+"</textarea>").insertAfter("#copy_button");
                $("#temp_lyrics").select();
                document.execCommand("Copy");
                $("#temp_lyrics").remove();
            }).insertBefore("#favorite-status");

            $("<div id='lyrics2' style='font: 12px sans-serif'></div>").insertBefore("#lyrics");
            $("#lyrics").hide();
        });

        // Intercept the data of lyrics
        hookAjax({
            onreadystatechange:function(xhr){
                if (xhr.xhr.responseURL == "https://petitlyrics.com/com/get_lyrics.ajax" && xhr.xhr.responseText !== "") {
                    var array = eval(xhr.xhr.responseText);
                    lyrics = "";
                    array.forEach((data)=>{
                        lyrics += Base64.decode(data.lyrics);
                        lyrics += "\n";
                    });
                    $("#lyrics2").html(lyrics.replace(new RegExp("\n", "g"), "<br>"));
                }
            }
        });

    } else if (document.location.href.match(/.*:\/\/www.kasi-time.com\/.*/)) {
        $(document).ready(function(){
            $("<div class='lyrics_menu'><div class='fontsize'><ul><li style='width: auto; display: block;'>Copy Lyrics</li></ul></div></div>").click(()=>{
                var lyrics = $('#lyrics').html().replace(new RegExp("<br>", "g"), "\n");
                $("<textarea id='temp_lyrics'>"+lyrics+"</textarea>").insertAfter("#lyrics");
                $("#temp_lyrics").select();
                document.execCommand("Copy");
                $("#temp_lyrics").remove();
            }).insertBefore("#lyrics");

            $('body').css('user-select', 'text');
            $('body').css('-moz-user-select', 'text');
            $('body').css('-webkit-user-select', 'text');
            $('body').css('-ms-user-select', 'text');
            $('body').on('copy contextmenu selectstart', (e)=>{
                hi(); // Break the jQuery by an error
            });
        });
    }
})();