// ==UserScript==
// @name         Track Total Steam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show total time of all tracks on a Soundtrack for Steam
// @author       Heraktone
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396842/Track%20Total%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/396842/Track%20Total%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var total = new Date(Array.from(document.querySelectorAll(".music_album_track_duration")).map(function(el) { var time = el.innerHTML.replace(/\s/g, '').split(':'); return (+time[0])*60 + (+time[1]);}).reduce(function(a,b){ return a + b;}, 0) * 1000).toISOString().substr(11, 8);
    var el = document.getElementById('music_album_area_description');
    el.innerHTML = el.innerHTML + '<div class="music_album_track_list_contents"><div class="music_album_track_listing_ctn active" data-discnumber="1"><div class="music_album_track_listing_table"><div class="music_album_track_ctn"><div class="music_album_track_number">-</div><div class="music_album_track_name_ctn"><div class="music_album_track_name">Total</div></div><div class="music_album_track_duration">' + total + '</div></div></div>';
})();