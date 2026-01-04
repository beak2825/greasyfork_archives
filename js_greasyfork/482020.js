// ==UserScript==
// @name         Anime1.me INAPPROPRIATE ADS BLOCKER!! BLOCK ALL THE STUPID ADS AND POSTERS
// @namespace    http://tampermonkey.net/
// @version      2023-12-12
// @description  The site keeps spamming graphic ads that pollutes your eyes! this script removes all of them so you can do your business peacefully.
// @author       You
// @match        https://anime1.me/*
// @grant        none
// @license      PRIVATE
// @downloadURL https://update.greasyfork.org/scripts/482020/Anime1me%20INAPPROPRIATE%20ADS%20BLOCKER%21%21%20BLOCK%20ALL%20THE%20STUPID%20ADS%20AND%20POSTERS.user.js
// @updateURL https://update.greasyfork.org/scripts/482020/Anime1me%20INAPPROPRIATE%20ADS%20BLOCKER%21%21%20BLOCK%20ALL%20THE%20STUPID%20ADS%20AND%20POSTERS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('div[id^="ad-"]').forEach(stupidad=>{
           stupidad.remove();
    });

    document.querySelectorAll('div[class="vjs-poster"]').forEach(stupidvideoplayer=>{

           stupidvideoplayer.style.backgroundImage = "";
           stupidvideoplayer.style.background = "linear-gradient(144deg, rgba(9,9,121,1) 25%, rgba(0,212,255,1) 75%);";
    });

    //[poster~="playerImg"]
    document.querySelectorAll('video').forEach(stupidfreakingplayer=>{

           stupidfreakingplayer.poster = "";

    });
})();