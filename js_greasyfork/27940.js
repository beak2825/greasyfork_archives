// ==UserScript==
// @name        Portraitify - Youtube
// @namespace   lazi3b0y
// @description Youtube portait resolution and playlist fix
// @include     *www.youtube.com/watch*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27940/Portraitify%20-%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/27940/Portraitify%20-%20Youtube.meta.js
// ==/UserScript==

var target = document.getElementById('player');

console.log('Portait script: Creating observer.');
var observer = new MutationObserver(function () {
    console.log('Portait script: Mutation observed.');
    portaitify();
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(target, config);
console.log('Portait script: Observer initialized.');

window.onresize = function () {
    console.log('Portait script: Window resize occurred.');
    portaitify();
}
console.log('Portait script: Listening for window resize events.');

console.log('Portait script: Checking for objects to modify.');
portaitify();

function portaitify() {
    if (window.outerWidth < window.outerHeight) {
        var playerPlaylist = document.getElementById("player-playlist");
        var playlist = document.getElementById("watch-appbar-playlist");
        var player = document.getElementById("player-api");

        console.log('Portait script: Portrait mode.');

        if (playerPlaylist !== undefined && playerPlaylist !== null) {
            if (player.style.height === "680px") {
                console.log('Portait script: Fixing the playlist.');
                playerPlaylist.style.marginTop = "0";
                playlist.style.top = "10px";
            }
        }
    } else {
        landscapify();
    }
}

function landscapify() {
    console.log('Portait script: Landscape mode.');
    var playerPlaylist = document.getElementById("player-playlist");
    var playlist = document.getElementById("watch-appbar-playlist");
    var player = document.getElementById("player-api");
    
    if (playerPlaylist !== undefined && playerPlaylist !== null) {
        if (player.style.height === "680px") {
            console.log('Portait script: Fixing the playlist.');
            playerPlaylist.style.marginTop = "0";
            playlist.style.top = "10px";
        }
    }
}