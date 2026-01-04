// ==UserScript==
// @name         Vocafork Player
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  music player at https://vocafork.ahe.workers.dev/
// @supportURL   https://github.com/Ayassaka/Vocafork-Player/blob/master/README.md
// @author       Ayassaka
// @compatible   chrome
// @license      MIT
// @match        https://vocafork.ahe.workers.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397115/Vocafork%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/397115/Vocafork%20Player.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var folder_files = [];
var prev_track_list = [];
var current_track_index;
var next_track_index;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var nico_watch_url = 'https://www.nicovideo.jp/watch/';

var vf_logo_url = "https://static.wixstatic.com/media/8f4416_0e30fd62acff4ac5a803ef42a85c4ae1~mv2.png/v1/fill/w_120,h_120,al_c,q_85,usm_0.66_1.00_0.01/8f4416_0e30fd62acff4ac5a803ef42a85c4ae1~mv2.webp";

function getNicoId(track_index) {
    return getTrackName(track_index).split(" ")[0];
}

function getTrackName(track_index) {
    var path = getTrackPath(track_index);
    return decodeURI(path.slice(path.search("sm"), -4));
}

function getTrackPath(track_index) {
    return folder_files[track_index].slice(0, -7); ;
}

function load_track() {
    var id = getNicoId(current_track_index);
    $("#audioPlayer")[0].src = getTrackPath(current_track_index);
    $("#curr_display")[0].textContent = getTrackName(current_track_index);

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: id,
            artist: "",
            artwork: [
                { src: vf_logo_url,   sizes: '120x120',   type: 'image/webp' },
            ]
        });
    }

    $("#audioPlayer")[0].play();
  }

var random = false;
var loop = false;

function switch_random() {
    random = !random;
    if (random) {
        next_track_index = getRandomInt(folder_files.length);
        $("#rand_display").prop("style", "text-decoration: none");
    } else {
        next_track_index = (current_track_index + 1) % folder_files.length;
        $("#rand_display").prop("style", "text-decoration: line-through");
    }
    $("#next_display").text(getTrackName(next_track_index));
}

function switch_loop() {
    loop = !loop;
    if (loop) {
        $("#loop_display").prop("style", "text-decoration: none");
    } else {
        $("#loop_display").prop("style", "text-decoration: line-through");
    }
}

function next_track() {
    prev_track_list.push([current_track_index]);
    $("#prev_btn").prop('disabled', false);
    $("#prev_display").text(getTrackName(current_track_index));
    current_track_index = next_track_index;
    next_track_index = (random) ?
        getRandomInt(folder_files.length) :
    next_track_index = (current_track_index + 1) % folder_files.length;
    load_track();
    $("#next_display").text(getTrackName(next_track_index));
}

function end_track() {
    if (loop) {
        $("#audioPlayer")[0].currentTime = 0;
        $("#audioPlayer")[0].play();
    } else {
        next_track();
    }
}

function prev_track() {
    if (prev_track_list.length != 0) {
        current_track_index = prev_track_list[prev_track_list.length - 1];
        load_track();
        prev_track_list.pop();
        next_track_index = (random) ?
            getRandomInt(folder_files.length) :
        next_track_index = (current_track_index + 1) % folder_files.length;
        $("#next_display").text(getTrackName(next_track_index));
        if (prev_track_list.length != 0) {
            $("#prev_display").text(getTrackName(prev_track_list[prev_track_list.length - 1]));
        } else {
            $("#prev_btn").prop('disabled', true);
            $("#prev_display").text("None");
        }
    }
}

function track_onclick() {
    var index = $(this).prop("track_index");
    prev_track_list.push([current_track_index]);
    $("#prev_btn").prop('disabled', false);
    $("#prev_display").text(getTrackName(current_track_index));
    current_track_index = index;
    load_track();
    $("#next_display").text(getTrackName(next_track_index));
}

function player_start() {
    $("#start_btn").remove();
    $(".footer").append(`
    <button class="player-button" id="prev_btn">⏮️<l id = "prev_display">None</l>⏮️</button>
    <button class="player-button" id="curr_btn">🎵<l id = "curr_display">None</l>🎵</button>
    <button class="player-button" id="next_btn">⏭️<l id = "next_display">None</l>⏭️</button>
    <br>
    <button class="player-button" id="rand_btn"><l id = "rand_display", style="text-decoration: line-through">🔀Random🔀</l></button>
    <audio id="audioPlayer" controls preload="auto"></audio>
    <button class="player-button" id="loop_btn"><l id = "loop_display", style="text-decoration: line-through">🔂Loop🔂</l></button>
    `)

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', function() {$("#audioPlayer")[0].play()});
        navigator.mediaSession.setActionHandler('pause', function() {$("#audioPlayer")[0].pause()});
        navigator.mediaSession.setActionHandler('previoustrack', function() {back()});
        navigator.mediaSession.setActionHandler('nexttrack', function() {next_track()});
    }

    current_track_index = 0;
    folder_files = $("ul#list > li > a[gd-type='video/mp4']").map(function() {
        var href = $(this).prop("href");
        $(this).prop("href", "javascript: void(0);");
        $(this).prop("class", "file");
        $(this).prop("track_index", current_track_index);
        $(this).click(track_onclick);
        current_track_index++;
        return href;
    }).get();

    current_track_index = 0;
    next_track_index = 1;
    load_track();

    $("#next_display").text(getTrackName(next_track_index));
    $("#prev_display").text("None");
    $("#next_btn").click(next_track);
    $("#prev_btn").click(prev_track);
    $("#prev_btn").prop('disabled', true);
    $("#rand_btn").click(switch_random);
    $("#loop_btn").click(switch_loop);
    $("#audioPlayer")[0].addEventListener("ended", end_track);
}

(function() {
    'use strict';

    $("body").append ( `
        <div class="footer">
        <button class="player-button" id="start_btn">Launch Player</button>
        </div>
    ` );
    $("#start_btn").click(player_start);
    addGlobalStyle ( `
  .footer {
    background: #607d8b;
    text-align: center;
    box-shadow: 0 1px 10px 0 #000000;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 8px;
  }

  body {
    margin:0;
    padding:0;
  }

  audio {
    position: relative;
    cursor:pointer;
    vertical-align: middle;
  }

  button {
    background-color:#f1f3f4;
    display: inline-block;
    position: relative;
    cursor:pointer;
    color:#000000;
    border-radius: 500px;
    font-family:Source Han Serif;
    font-size:14px;
    text-decoration:none;
    border: 0em;
    height: 30px;
    margin-top: 8px;
    margin-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    white-space: nowrap;
  }
  button:hover {
    background-color:#e5e7e8;
  }
` );
})();