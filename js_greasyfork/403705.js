// ==UserScript==
// @name         GeekHub ColorInput
// @namespace    http://seamonster.me
// @version      0.1
// @description  让你在Geekhub更动感的摸鱼
// @author       SeaMonster
// @match        https://*.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403705/GeekHub%20ColorInput.user.js
// @updateURL https://update.greasyfork.org/scripts/403705/GeekHub%20ColorInput.meta.js
// ==/UserScript==

(function() {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onreadystatechange = function () {
        if (this.readyState == 'complete'){
            POWERMODE.colorful = true; // make power mode colorful
            POWERMODE.shake = false; // turn off shake
            document.body.addEventListener('input', POWERMODE);
        }
    }
    script.onload = function () {
        POWERMODE.colorful = true; // make power mode colorful
        POWERMODE.shake = false; // turn off shake
        document.body.addEventListener('input', POWERMODE);
    }
    script.src = 'https://seamonster.me/usr/themes/cactus/js/activate-power-mode.js';
    head.appendChild(script);
})();