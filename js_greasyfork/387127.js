// ==UserScript==
// @name         GoGoAnime
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       Nathan Price
// @match        *.gogoanime.movie/*
// @match        *.gogoanime.io/*
// @match        *.gogoanime.pro/*
// @match        *.gogoanime.so/*
// @match        *.gogoanime2.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387127/GoGoAnime.user.js
// @updateURL https://update.greasyfork.org/scripts/387127/GoGoAnime.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout( () => {

        let player = document.querySelector('.play-video > iframe')

        if(typeof player !== "undefined" && player !== null){
            player.style.position = 'fixed'
            player.style.top = '5%'
            player.style.left = '0'
            player.style.width = '100%'
            player.style.height = '95%'
            player.style.zIndex = '10000'
            document.querySelector('body').style.overflow = 'hidden'
            let paginationDiv = document.querySelector('.anime_video_body_episodes')
            paginationDiv.style.position = 'fixed'
            paginationDiv.style.top = '0'
            paginationDiv.style.left = '0'
            paginationDiv.style.width = '100%'
            paginationDiv.style.height = '188px'
            paginationDiv.style.zIndex = '100'
            let searchFormDiv = document.querySelector('#search-form')
            searchFormDiv.style.position = 'fixed'
            searchFormDiv.style.top = '0'
            searchFormDiv.style.left = '30%'
            searchFormDiv.style.zIndex = '10001'
        }
    }, 5000)
})();