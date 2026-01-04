// ==UserScript==
// @name         Gartic.io Çerçeve Renk
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Sadece kendi avatarına kırmızı ışık saçan bir çerçeve ekler
// @author       Ryzex
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529076/Garticio%20%C3%87er%C3%A7eve%20Renk.user.js
// @updateURL https://update.greasyfork.org/scripts/529076/Garticio%20%C3%87er%C3%A7eve%20Renk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlowingBorder() {
        let myAvatar = document.querySelector('.you .avatar');
        if (myAvatar) {
            myAvatar.style.border = "2px solid red"; 
            myAvatar.style.animation = "glowEffect 1.5s infinite alternate"; 

            // CSS Animasyonunu oluştur
            let style = document.createElement('style');
            style.innerHTML = `
                @keyframes glowEffect {
                    0% { box-shadow: 0 0 5px red; }
                    100% { box-shadow: 0 0 15px red; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setInterval(addGlowingBorder, 1000); 
})();