// ==UserScript==
// @name         YouTube Playlist Switcher 
// @namespace    http://tampermonkey.net/http://violentmonkey
// @version      1.3.7.2
// @description  Memutar video dari banyak playlist YouTube secara bergantian 
// @author       Ojo Ngono
// @match        *://www.youtube.com/*
// @match.       https://m.youtube.com/*
// @antifeature  ads  
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand  
// @require      https://www.youtube.com/iframe_api
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495125/YouTube%20Playlist%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/495125/YouTube%20Playlist%20Switcher.meta.js
// ==/UserScript==

// Inisialisasi konfigurasi MonkeyConfig
const cfg = new MonkeyConfig({
    YOUR_API_KEY: {
        label: "Masukkan Api Key",
        type: "text",
        default: ""
    },
    PLAYLIST_ID_1: {
        label: "PLAYLIST_ID_1",
        type: "text",
        default: ""
    },
    PLAYLIST_ID_2: {
        label: "PLAYLIST_ID_2",
        type: "text",
        default: ""
    },
    PLAYLIST_ID_3: {
        label: "PLAYLIST_ID_3",
        type: "text",
        default: ""
    },
    PLAYLIST_ID_4: {
        label: "PLAYLIST_ID_4",
        type: "text",
        default: ""
    }
});

(function() {
    'use strict';

    
    const PLAYLIST_ID_1 = cfg.get('PLAYLIST_ID_1');
    const PLAYLIST_ID_2 = cfg.get('PLAYLIST_ID_2');
    const PLAYLIST_ID_3 = cfg.get('PLAYLIST_ID_3');
    const PLAYLIST_ID_4 = cfg.get('PLAYLIST_ID_4');
    const YOUR_API_KEY = cfg.get('YOUR_API_KEY');

    console.log('Konfigurasi dimuat:', {
        PLAYLIST_ID_1,
        PLAYLIST_ID_2,
        PLAYLIST_ID_3,
        PLAYLIST_ID_4,
        YOUR_API_KEY
    });

    var player;
    var currentPlaylistIndex = 0;
    var playlistIds = [
        PLAYLIST_ID_1,
        PLAYLIST_ID_2,
        PLAYLIST_ID_3,
        PLAYLIST_ID_4
    ].filter(id => id);

    var currentIndexInPlaylist = 0;
    var videoIds = [];
    var apiKey = YOUR_API_KEY;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        loadPlaylist(playlistIds[currentPlaylistIndex]);
        showAd(); // Tampilkan iklan saat player siap
    }

    function loadPlaylist(playlistId) {
        fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                videoIds = data.items.map(item => item.snippet.resourceId.videoId);
                currentIndexInPlaylist = 0;
                playNextVideo();
            })
            .catch(error => console.error('Error loading playlist:', error));
    }

    function playNextVideo() {
        if (currentIndexInPlaylist < videoIds.length) {
            player.loadVideoById(videoIds[currentIndexInPlaylist]);
            currentIndexInPlaylist++;
        } else {
            currentPlaylistIndex = (currentPlaylistIndex + 1) % playlistIds.length;
            loadPlaylist(playlistIds[currentPlaylistIndex]);
        }
    }

    function showAd() {
        var adDiv = document.getElementById('ad');
        if (!adDiv) {
            adDiv = document.createElement('div');
            adDiv.id = 'ad';
            adDiv.style.position = 'relative';
            adDiv.style.width = '640px';
            adDiv.style.margin = '20px auto';
            adDiv.style.padding = '10px';
            adDiv.style.border = '1px solid #ccc';
            adDiv.style.backgroundColor = '#f9f9f9';
            adDiv.innerHTML = '<p><a href="https://www.highcpmgate.com/eb4z13175?key=5e5e9869283e14d8633a27de19f37968"><img src="path/to/animatedText.svg" alt="Ojo Ngono"></a></p>';
            document.body.appendChild(adDiv);
        } else {
            adDiv.innerHTML = '<p><a href="https://www.highcpmgate.com/eb4z13175?key=5e5e9869283e14d8633a27de19f37968"><img src="path/to/animatedText.svg" alt="Ojo Ngono"></a></p>';
        }
    }

    function init() {
        if (window.location.href.includes('youtube.com')) {
            addYouTubePlayer();
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    window.addEventListener('load', init, false);

    // Fungsi tambahan untuk menambahkan elemen player YouTube
    function addYouTubePlayer() {
        var playerDiv = document.createElement('div');
        playerDiv.id = 'player';
        document.body.appendChild(playerDiv);
    }

})();
