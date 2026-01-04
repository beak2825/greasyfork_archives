// ==UserScript==
// @name         TheRock RepeatSong Checker
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      0.9
// @description  Searches for songs that have been repeated during the day
// @author       Bunta
// @match        https://www.therock.net.nz/home/player.html
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400906/TheRock%20RepeatSong%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/400906/TheRock%20RepeatSong%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var testMode = false;

    /**
     * @return start time, today at 9am
     */
    function getStartDate() {
        var startDate = new Date();
        startDate.setHours(9,0,0,0); // Start time is today's 9AM
        return startDate.getTime();
    }

    /**
     * @return end time, today at 5pm
     */
    function getEndDate() {
        var endDate = new Date();
        endDate.setHours(17,0,0,0);
        return endDate.getTime();
    }

    /**
     * @return the playlist variation
     */
    function getPlaylistVariation() {
        if (window.PLAYLIST_VARIATION) {
            return window.PLAYLIST_VARIATION;
        } else {
            return "therock";
        }

    }

    /**
     * @return the url at which the json endpoint lives that gets our playlist information
     */
    function getPlaylistJsonEndpoint() {
        return (
             "https://radio-api.mediaworks.nz/radio-api/v2/station/" +
             getPlaylistVariation() +
             "/playedList?unique=true&fromUTC=" + getStartDate() + "&toUTC=" + getEndDate()
        );
    }

    /**
     * Format time at which song was played
     */
    function getPlayedTime(timeString) {
        var hourEnd = timeString.indexOf(":");
        var H = +timeString.substr(0, hourEnd);
        var h = H % 12 || 12;
        var ampm = H < 12 ? "a.m." : "p.m.";
        var padStr = h<10?'0':'';
        return padStr + h + timeString.substr(hourEnd, 3) + ampm;
    }

    /**
     * @return the current playing song name
     */
    function getCurrentSong() {
        if (testMode)
            return $("div.LivePlayer__Playlist div[data-playlist-widget*='justPlayed'] .Playlist__Title:eq(2)").text();
        else
            return $("div.LivePlayer__Playlist div[data-playlist-widget*='nowPlaying'] .Playlist__Title").text();
    }

    /**
     * @return the current playing song artist
     */
    function getCurrentArtist() {
        if (testMode)
            return $("div.LivePlayer__Playlist div[data-playlist-widget*='justPlayed'] .Playlist__Author:eq(2)").text();
        else
            return $("div.LivePlayer__Playlist div[data-playlist-widget*='nowPlaying'] .Playlist__Author").text();
    }

    // Stop radio player on first load
    var playerStop = setInterval(function(){ $("video").get(0).pause(); }, 500);
    setTimeout(function(){ clearInterval(playerStop); }, 10000);

    // Set timer to check current song regularly
    var lastSong = "";
    var lastArtist = "";
    var songCheck = setInterval(checkSongChange, 10000);

    function checkSongChange() {
        // Cancel check if it is not during the weekday
        var d = new Date();
        if (d.getTime() < getStartDate() || d.getTime() > getEndDate() || d.getDay() == 0 || d.getDay() == 6) {
            return;
        }

        // Cancel check if song hasn't changed
        if (lastSong==getCurrentSong() && lastArtist==getCurrentArtist()) {
            return;
        }
        lastSong = getCurrentSong();
        lastArtist = getCurrentArtist();
        console.log(d.toLocaleTimeString()+": Song updated to "+lastSong+" by "+lastArtist);
        verifySong(lastSong,lastArtist);
    }

    function verifySong(song, artist) {
        var SONG_ENDPOINT = getPlaylistJsonEndpoint();
        $.getJSON(SONG_ENDPOINT).then(function (playlist) {
            $.each(playlist, function (i, item) {
                if (i === 0) {
                    // skip the first title
                    return true;
                }
                if (item.title == song && item.artist == artist) {
                    var d = new Date();
                    // Found a match!!!
                    console.log(d.toLocaleTimeString()+": Found "+item.title+" by "+item.artist+" at "+getPlayedTime(item.played_time));
                    //playAudio();
                    window.open('tel:0800762574');
                    return false;
                }
            });
        });
    }

    function playAudio() {
        // Sound Page:  https://notificationsounds.com/wake-up-tones/loving-you-509
        var alertSound = new Audio ('https://proxy.notificationsounds.com/wake-up-tones/loving-you-509/download/file-44_loving_you.mp3');
        alertSound.play();
        //https://notificationsounds.com/soundfiles/e2230b853516e7b05d79744fbd4c9c13/file-44_loving_you.mp3
        //https://d9olupt5igjta.cloudfront.net/samples/sample_files/6915/85474faa862f8ba1f537e52ff5e3252cdf6948c4/mp3/_Trumpet_1.mp3
        //https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3
    }

})();