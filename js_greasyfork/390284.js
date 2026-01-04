// ==UserScript==
// @name         Bandcamp downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds "download" next to songs @ bandcamp site
// @author       You
// @match        https://*.bandcamp.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/390284/Bandcamp%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/390284/Bandcamp%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var table = $('#track_table tbody tr')
    , tdata = table ? table.each(function(){}) : []
    , adata = window.TralbumData || false;
    if (table.length > 1 && adata) {
        for(var i = 0; adata.trackinfo[i]; i++) {
            var p = $($('tr td .dl_link')[i]), link = document.createElement("a"), track = adata.trackinfo[i];
            link.href = track.file["mp3-128"];
            link.title = link.download = track.track_num + " - " + track.title + ".mp3";
            link.alt = 'If left clicking opens song, right click to download.';
            link.innerHTML = 'Download!';
            p.html(link);
        }
    } else {
        $('.inline_player').append('<br /><strong><a href="#" class="font-size: 18px;" onclick="location.href=TralbumData.trackinfo[0].file["mp3-128"]">Download Now! (128kb MP3)</a></strong><br />');
    }
    alert("jestem");

})();