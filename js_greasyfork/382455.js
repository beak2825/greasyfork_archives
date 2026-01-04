// ==UserScript==
// @name         Funimation Auto Full Video Player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Nathan Price
// @match        https://www.funimation.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382455/Funimation%20Auto%20Full%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/382455/Funimation%20Auto%20Full%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let player = document.querySelector('#player')
    if(typeof player !== 'undefined'){
        player.style.position = 'fixed'
        player.style.top = '0'
        player.style.left = '0'
        player.style.width = '100%'
        player.style.height = '100vh'
        player.style.zIndex = '98999999999999'
        document.querySelector('body').style.overflow = 'hidden'
    }
    // Your code here...
})();