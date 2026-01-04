// ==UserScript==
// @name         Spotify Desktop notifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show desktop notifications whenever the track changes
// @author       Ronald Troyer
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383044/Spotify%20Desktop%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/383044/Spotify%20Desktop%20notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.currentSong = {};
    function handleDomChanges() {
        var nowPlayingElement = document.querySelectorAll('.Root__top-container .now-playing')[0];
        if (nowPlayingElement) {
            var config = { attributes: true, childList: true, subtree: true };
            var observer = new MutationObserver(getCurrentSong);
            observer.observe(nowPlayingElement, config);
        }
    }

    function getCurrentSong(mutationsList, observer) {
        var imageUrl = document.querySelectorAll('.Root__top-container .now-playing .cover-art-image')[0].getAttribute('style').replace(/.*?http/i,'http').replace(/".*/,'');
        var songName = document.querySelectorAll('.Root__top-container .now-playing .track-info__name')[0];
        songName = songName && songName.textContent;

        if (window.currentSong.songName != songName && imageUrl) {
            window.currentSong = {
                songName: songName,
                artistName: document.querySelectorAll('.Root__top-container .now-playing .track-info__artists')[0].textContent,
                imageUrl: imageUrl
            };
            spawnNotification(window.currentSong.artistName, window.currentSong.imageUrl, window.currentSong.songName);
        }
    };

    function spawnNotification(body, icon, title) {
        var options = {
            body: body,
            icon: icon
        };
        var n = new Notification(title, options);
        setTimeout(timeoutNotification.bind(this, n), 10000);
    }

    function timeoutNotification(notification) {
        notification.close();
    }

    Notification.requestPermission().then(function(result) {
        console.log(result);
    });

    setInterval(handleDomChanges, 1000);
    handleDomChanges();
})();