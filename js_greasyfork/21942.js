// ==UserScript==
// @name         MAXIMUM Search
// @namespace    http://ext.redleaves.ru
// @version      0.3
// @description  Add search links VK, Yandex Music and Last.fm to radio Maximum (RUS)
// @author       MewForest
// @license      MIT
// @match        http://maximum.ru/online/maximum
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/21942/MAXIMUM%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/21942/MAXIMUM%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function curTrackUpd() {

        $.ajax({
            type: "GET",
            url: "/currenttrack.aspx?station=maximum",
            success: function(data)
            {
                var curTrack = {
                    song : data.Current.Artist+" - "+data.Current.Song,
                    vk : "https://vk.com/search?c%5Bq%5D="+encodeURIComponent((data.Current.Artist).toLowerCase()+" "+(data.Current.Song).toLowerCase())+"&c%5Bsection%5D=audio",
                    ya : "https://music.yandex.ru/search?text="+encodeURIComponent((data.Current.Artist).toLowerCase()+" "+(data.Current.Song).toLowerCase()),
                    last : "http://www.last.fm/ru/music/"+encodeURIComponent(data.Current.Artist),
                };

                if (curTrack.song != " - " && $(".in-air span").text() != curTrack.song && curTrack.song != "Вы слушаете Радио MAXIMUM")
                {
                    $(".online-radio br").remove();
                    $(".curSearch").remove();
                    $(".online-radio").append('<a href="'+curTrack.vk+'" class="curSearch" target="_blank">Найти трек в VK</a><br>');
                    $(".online-radio").append('<a href="'+curTrack.ya+'" class="curSearch" target="_blank">Найти трек в Яндекс Музыке</a><br>');
                    $(".online-radio").append('<a href="'+curTrack.last+'" class="curSearch" target="_blank">Найти исполнителя в Last.fm</a>');
                }
            }
        });
    }
    curTrackUpd();
    window.setInterval(curTrackUpd,3000);
})();