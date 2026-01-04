// ==UserScript==
// @name         Play GamePigeon Checkers Theme On Chess Websites
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Plays the GamePigeon Checkers Theme On chess.com and lichess.org
// @author       You
// @match        *://*.chess.com/*
// @match        *://*.lichess.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418662/Play%20GamePigeon%20Checkers%20Theme%20On%20Chess%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/418662/Play%20GamePigeon%20Checkers%20Theme%20On%20Chess%20Websites.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    $( document ).ready(()=>{
        var player = document.createElement('audio');
        player.src = "https://dayoshiguy.github.io/tools-for-school/extra/a/Gamepigeon%20checkers%20theme.mp3";
        player.play();
        player.loop=true;
        player.autoplay=true;
        player.preload = 'auto';
        document.body.appendChild(player);

    });
})();