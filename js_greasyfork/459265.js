// ==UserScript==
// @name         DRRR Music Playlist helper
// @namespace    com.drrr.music.playlist
// @version      0.3.0
// @description  Queue your music
// @author       Shukudai
// @match        https://drrr.com/room/*
// @match        http://drrr.local/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrr.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      YOU MAY ONLY USE IT, REVIEW IT, NOTHING ELSE
// @grant        unsafeWindow
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459265/DRRR%20Music%20Playlist%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/459265/DRRR%20Music%20Playlist%20helper.meta.js
// ==/UserScript==

//unsafeWindow.Swal = Swal;
const Swal = Sweetalert2;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const session_name = 'plugin-playlist';
let playlist = [];

function removeUser(str){
    let url = new URL(str);
    url.searchParams.delete('user');
    url.searchParams.delete('uid');
    // 163
    url.searchParams.delete('userid');
    return url.toString();
}
function formListText() {
    return playlist.join('\n');
}

function displayCount() {
    $('#playlist-count').text(playlist.length)
}
function save() {
    let value = formListText();
    sessionStorage[session_name] = value;
}
function load() {
    let value = sessionStorage[session_name];
    if (value) {
        editList(value);
    }
}

function list_changed(){
    displayCount();
    save();
}

function updateList(text) {
    for (let song of text.split('\n').map(e => e.trim())) {
        let url = removeUser(song);
        if (!playlist.includes(url)) {
            playlist.push(url);
        }
    }
    list_changed();
    return playlist;
}

function updateListFront(text) {
    for (let song of text.split('\n').map(e => e.trim())) {
        let url = removeUser(song);
        if (!playlist.includes(url)) {
            playlist.unshift(url);
        }
    }
    list_changed();
    return playlist;
}

function editList(text) {
    playlist = text.split('\n').map(e => removeUser(e));
    list_changed();
    return playlist;
}

async function clickDialog(header, callback, inputValueFunc = null) {
    if (inputValueFunc && typeof inputValueFunc === 'function'){
        inputValueFunc = inputValueFunc();
    }
    const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: header,
        inputValue: inputValueFunc,
        inputPlaceholder: 'http://...',
        inputAttributes: {
            'aria-label': 'http://...'
        },
        showCancelButton: true
    })

    if (text) {
        callback(text);
    }
}

let $add_playlist = $('<div id="playlist-add" style="float: left; line-height: 40px; width:20px; margin-left: 10px;" ><i class="icon icon-additem"></i></div>');
$("#musicBox").append($add_playlist);
$add_playlist.click(clickDialog.bind(this, 'Add to Playlist', updateList));

let $edit_playlist = $('<div id="playlist-edit" style="float: left; line-height: 40px; width:20px; margin-left: 10px;" ><i class="icon icon-pencil"></div>');
$("#musicBox").append($edit_playlist);
$edit_playlist.click(clickDialog.bind(this, 'Edit Playlist', editList, formListText));

let $addF_playlist = $('<div id="playlist-add" style="float: left; line-height: 40px; width:20px; margin-left: 10px;" ><span><i class="icon icon-top-up-balance"></i></span></div>');
$("#musicBox").append($addF_playlist);
$addF_playlist.click(clickDialog.bind(this, 'Add to top of Playlist', updateListFront));

let $random_playlist = $('<div id="playlist-randomize" style="float: left; line-height: 40px; width:20px; margin-left: 10px;" ><i class="icon icon-shuffle-1"></div>');
$("#musicBox").append($random_playlist);
$random_playlist.click(function () {
    playlist.sort(() => Math.random() - 0.5);
    Swal.fire('Done', 'Playlist randomized', 'success');
});

let $show_playlist = $('<div style="float: left; line-height: 40px; width:30px; margin-left: 10px; margin-right: 10px;" ><i class="icon icon-list"><span id="playlist-count"></span></div>');
$("#musicBox").append($show_playlist);
$show_playlist.click(async function () {
    Swal.fire('', formListText());
});

let Standby = '<i class="icon icon-play"></i>';
let Casting = '<i class="icon icon-pause"></i>';

let should_cast = false;
let $should_cast = $(`<div style="float: left; line-height: 40px; width:30px; margin-left: 10px;" >${Standby}</div>`);
$("#musicBox").append($should_cast);
$should_cast.click(function () {
    if (should_cast) {
        $should_cast.html(Standby);
        should_cast = false;
    } else {
        $should_cast.html(Casting);
        should_cast = true;
        wait_or_cast_next();
    }
});

async function wait_or_cast_next() {
    let np = box.np();
    let is_playing = false;
    if (np) {
        let howl = box.np().howl;
        let time = howl.seek();
        await sleep(30);
        is_playing = howl.seek() != time;
    }
    if (is_playing && event_attached == false) {
        np.howl.once('end', castNext);
    } else {
        castNext();
    }
}

const HTMLRecent = '<i class="icon icon-recent"></i>';
function castNext() {
    let next = playlist.shift();
    if (next) {
        list_changed();
        let was = $should_cast.text();
        $should_cast.html(HTMLRecent);
        $.post('', {
            music: "music",
            name: "",
            url: next,
        }).done(function() {
            if ($should_cast.html() == HTMLRecent){
                $should_cast.html(was + '<i class="icon icon-check-circle"></i>');
            }
          })
          .fail(function() {
            if ($should_cast.text() == HTMLRecent){
                $should_cast.html(was + "🔴");
            }
          });
    }
}

function music_end(id) {
    let music = this;
    console.log('end', music);
    if(should_cast){
        wait_or_cast_next();
    }
}
function music_start(music) {
    console.log('start', music);
}

function share_failed() {
    if (should_cast) {
        wait_or_cast_next();
    }
}

load();

let event_attached = false;
let playing = null;
$(document).on("play-music.client.drrr", function (e, music, attributes) {
    event_attached = true;
    music_start(music);
    playing = music;
})
$(document).on("music-end", function (e, music_item) {
    if(playing != music_item.music_object){
        console.warn("diff music start and end", playing, music_item.music_object);
    }
    music_end(music_item.music_object)
})

$(window).on('room.chat.async-response', function (e, r) {
    if (r && r.message && r.message.startsWith("Sharing failed")) {
        share_failed();
    }
});

