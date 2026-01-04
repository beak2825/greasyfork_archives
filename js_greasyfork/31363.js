// ==UserScript==
// @name         Spotify Playlist Sorter
// @namespace    https://gist.github.com/GamrCorps/
// @version      1.6.1
// @description  Sorts Spotify Web Player playlists by track name.
// @author       ZekNikZ
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31363/Spotify%20Playlist%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/31363/Spotify%20Playlist%20Sorter.meta.js
// ==/UserScript==
var zkz_swp_d = false;

function zkz_srt() {
    if (!zkz_swp_d) {
        var btn1 = document.createElement('BUTTON');
        btn1.appendChild(document.createTextNode('N'));
        btn1.setAttribute("style", "margin-left: .5em;");
        btn1.onclick = zkz_srt;
        document.getElementsByClassName('now-playing-bar__right')[0].appendChild(btn1);
        
        var btn3 = document.createElement('BUTTON');
        btn3.appendChild(document.createTextNode('A'));
        btn3.setAttribute("style", "margin-left: .5em;");
        btn3.onclick = zkz_srt_art;
        document.getElementsByClassName('now-playing-bar__right')[0].appendChild(btn3);
        
        var btn2 = document.createElement('BUTTON');
        btn2.appendChild(document.createTextNode('#'));
        btn2.setAttribute("style", "margin-left: .5em;");
        btn2.onclick = zkz_srt_num;
        document.getElementsByClassName('now-playing-bar__right')[0].appendChild(btn2);
        
        zkz_swp_d = true;
    }
    
    console.log('SORTING PLAYLIST BY NAME...');

    var list = document.getElementsByClassName('tracklist');

    var items = list[0].childNodes;
    var itemsArr = [];
    for (var i in items) {
        if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
            itemsArr.push(items[i]);
        }
    }

    itemsArr.sort(function(a, b) {
        var _a = a.getElementsByClassName('track-name')[0].innerHTML;
        var _b = b.getElementsByClassName('track-name')[0].innerHTML;
        return _a == _b ? 0 : (_a > _b ? 1 : -1);
    });

    for (i = 0; i < itemsArr.length; ++i) {
        list[0].appendChild(itemsArr[i]);
    }
}

function zkz_srt_num() {
    console.log('SORTING PLAYLIST BY NUMBER...');

    var list = document.getElementsByClassName('tracklist');

    var items = list[0].childNodes;
    var itemsArr = [];
    for (var i in items) {
        if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
            itemsArr.push(items[i]);
        }
    }

    itemsArr.sort(function(a, b) {
        var _a = parseFloat(a.getElementsByClassName('position top-align')[0].innerHTML);
        var _b = parseFloat(b.getElementsByClassName('position top-align')[0].innerHTML);
        return _a == _b ? 0 : (_a > _b ? 1 : -1);
    });

    for (i = 0; i < itemsArr.length; ++i) {
        list[0].appendChild(itemsArr[i]);
    }
}

function zkz_srt_art() {
    console.log('SORTING PLAYLIST BY ARTIST...');

    var list = document.getElementsByClassName('tracklist');

    var items = list[0].childNodes;
    var itemsArr = [];
    for (var i in items) {
        if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
            itemsArr.push(items[i]);
        }
    }

    itemsArr.sort(function(a, b) {
        var _a = a.getElementsByClassName('artists-album')[0].textContent;
        var _b = b.getElementsByClassName('artists-album')[0].textContent;
        return _a == _b ? 0 : (_a > _b ? 1 : -1);
    });

    for (i = 0; i < itemsArr.length; ++i) {
        list[0].appendChild(itemsArr[i]);
    }
}

(function() {
    'use strict';
    window.onload = zkz_srt;
})();