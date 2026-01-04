// ==UserScript==
// @name         Youtube Tracks Info: Key, BPM & RMS
// @namespace    http://dsbankov.net/
// @version      1.04
// @description  Displays the key, BPM & RMS of a track on youtube.
// @author       dsbankov
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/39489/Youtube%20Tracks%20Info%3A%20Key%2C%20BPM%20%20RMS.user.js
// @updateURL https://update.greasyfork.org/scripts/39489/Youtube%20Tracks%20Info%3A%20Key%2C%20BPM%20%20RMS.meta.js
// ==/UserScript==

$(document).ready(function() { log("Calling ready event handler"); load_track_info(); }); // first time load
window.addEventListener('spfdone', function() { log("Calling spfdone event handler"); load_track_info(); }); // page jump - old youtube design
window.addEventListener('yt-navigate-finish', function() { log("Calling yt-navigate-finish event handler"); load_track_info(); }); // page jump - new youtube design
document.addEventListener('DOMContentLoaded', function() { log("Calling DOMContentLoaded event handler"); load_track_info(); }); // one-time early processing

function load_track_info() {
    log("Youtube Tracks Info @ " + location.pathname);
    if (location.pathname === "/watch") {
        log("Loading track info...");
        $('.track_info').remove();
        setTimeout(function() {
            var video_title_container = $("#container > h1");
            $(video_title_container).ready(function() {
                if (video_title_container && video_title_container.length > 0 && video_title_container[0].innerText) {
                    var video_title = video_title_container[0].innerText;
                    var parsed_video_title = remove_non_word_characters(video_title);
                    log("Searching for track by video title: " + parsed_video_title);
                    $.ajax({
                        url: 'https://sleepy-beach-89012.herokuapp.com/trackAnalysis?q=' + parsed_video_title
                    }).done(function (response) {
                        log("Track found: " + JSON.stringify(response));
                        var key = response.key;
                        var loudness = response.loudness;
                        var tempo = response.tempo;
                        $('.track_info').remove();
                        $('#info-contents > ytd-video-primary-info-renderer').append('<h2 class="track_info" style="color: green; text-decoration: none; font-weight: normal; text-align: left; font-style: italic;">Key of ' +
                                                                        key + ', ' + tempo + ' BPM, ' + loudness + ' RMS' + '</h2>');
                    }).fail(function(response) {
                        log("Track not found: " + JSON.stringify(response));
                    });
                }
            });
        }, 1000);
    }
}

function remove_non_word_characters(video_title) {
    return video_title.replace(/(&|\?|=|\$|\+|\.|:|;|\/|,|@|>|<|#|%)/gi, ""); // remove special characters
}

function log(msg) {
    console.log("YTTI: " + msg);
}