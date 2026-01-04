// ==UserScript==
// @name     LastFM Want You Gone
// @description Hey LastFM, where did the "Ban Track" button go?!  
//              I *HATE* some songs, and playing them ten times in a row
//              doesn't make me like them any more!
// @include  https://www.last.fm/*
// @version  5
// @grant    none
// @noframes
// @namespace https://greasyfork.org/en/users/175405-anao9aaw
// @downloadURL https://update.greasyfork.org/scripts/39708/LastFM%20Want%20You%20Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/39708/LastFM%20Want%20You%20Gone.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/39708-lastfm-want-you-gone


// ***** THINGS YOU NEED TO CHANGE *****

// Easy sanity-check to see whether you noticed that you're supposed
// to change the settings in this file.
var username = "your_username_here";

// js list equality is frogged up, so I concatenate track and artist by "∈".
// Some symbols need to be escaped (duh), like this: \\ and \" instead of \ and ".
// Example: »My \ is 5" long« becomes »My \\ is 5\" long«
// This can go wrong if there are artists and tracks like this:
// Track "Apple∈Basket" by "Universe" (so "Apple∈Basket∈Universe")
// Track "Apple" by "Basket∈Universe" (so "Apple∈Basket∈Universe", again)
// I hope this is sufficiently unlikely.
var want_tracks_gone = new Set([
    "All of Me (feat. Logic, ROZES)∈Big Gigantic",
    "Before We Fade∈Tristam",
    // ∈
]);

var want_artists_gone = new Set([
    "An artist you hate",
    "Another artist you hate"
]);


// ***** THINGS THAT STAY LIKE THIS *****

function make_them_gone () {
    // Was the username updated?
    if (("https://www.last.fm/user/" + username) !=
            document.getElementsByClassName("auth-link")[0].href) {
        console.log("You need to change the source code for WantYouGone to work.");
    }

    // What is the current track?
    // If we crash here, it must be because the player is off.  That's fine.
    var track_name = document.getElementsByClassName("player-bar-track-name")[0].text;
    var artist_name = document.getElementsByClassName("player-bar-artist-name")[0].text;
    var current_entry = track_name + "∈" + artist_name;

    // Is the current track a bad one?
    if (want_tracks_gone.has(current_entry)) {
        console.log("Current track is \"" + current_entry + "\".  Ugh!  I **HATE** that song!");
    } else if (want_artists_gone.has(artist_name)) {
        console.log("Current track is \"" + current_entry + "\".  Ugh!  I **HATE** that artist!");
    } else {
        console.log("Current track is \"" + current_entry + "\".  That's fine.");
        return;
    }

    // The current track is bad.  Change it.
    var btnNextSong = document.getElementsByClassName("player-bar-btn--next")[0];
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    btnNextSong.dispatchEvent(clickEvent);
}

setInterval (make_them_gone, 15 * 1000); // 15 seconds
