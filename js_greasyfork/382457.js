// ==UserScript==
// @name         VRV
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Nathan Price
// @match        https://vrv.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382457/VRV.user.js
// @updateURL https://update.greasyfork.org/scripts/382457/VRV.meta.js
// ==/UserScript==


(function() {
    'use strict';

    setTimeout(() => {
        let player = document.querySelector('.video-player')
        if(typeof player !== "undefined" && player !== null){
            player.style.position = 'fixed'
            player.style.top = '0'
            player.style.left = '0'
            player.style.width = '100%'
            player.style.height = '100vh'
            player.style.zIndex = '98999999999999'
            document.querySelector('body').style.overflow = 'hidden'
        }
      },5000)
})();