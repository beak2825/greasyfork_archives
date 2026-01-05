// ==UserScript==
// @name         Bandcamp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *.bandcamp.com/album/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20410/Bandcamp.user.js
// @updateURL https://update.greasyfork.org/scripts/20410/Bandcamp.meta.js
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
