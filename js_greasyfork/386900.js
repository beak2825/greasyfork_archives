// ==UserScript==
// @name         Crunchyroll
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Nathan Price
// @match        https://*.crunchyroll.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386900/Crunchyroll.user.js
// @updateURL https://update.greasyfork.org/scripts/386900/Crunchyroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout( () => {

        var player = document.querySelector('.video-player')

        if(typeof player !== "undefined" && player !== null){
            player.style.position = 'fixed'
            player.style.top = '0'
            player.style.left = '0'
            player.style.width = '100%'
            player.style.height = '100vh'
            player.style.zIndex = '98999999999999'
            document.querySelector('body').style.overflow = 'hidden'
        }
    }, 10000)
    // Your code here...
})();