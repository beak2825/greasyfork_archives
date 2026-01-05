// ==UserScript==
// @name         Bandcamp: Broken Heart
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Me
// @match        *.bandcamp.com/album/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27618/Bandcamp%3A%20Broken%20Heart.user.js
// @updateURL https://update.greasyfork.org/scripts/27618/Bandcamp%3A%20Broken%20Heart.meta.js
// ==/UserScript==

gplaylist.cap_playback_for_track = console.log.bind(console)

Playlist_play = gplaylist.play;
gplaylist.play = function() {
    for (var i = 0; this._playlist && i < this._playlist.length; i++) {
        var ti = this._playlist[i];
        ti["is_capped"] = false
    }
    Playlist_play.apply(this, arguments);
};

GM_addStyle(".ui-widget-overlay { display: none !important; } .ui-dialog.ui-widget.ui-widget-content.ui-corner-all.nu-dialog.no-title { display: none !important; }");
