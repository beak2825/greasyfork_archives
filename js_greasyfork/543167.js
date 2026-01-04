// ==UserScript==
// @name         Drawaria Jumpscare Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A mod q depois d sair de 3 servidor minha foto aparece pra dar jumpscare
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/543167/Drawaria%20Jumpscare%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/543167/Drawaria%20Jumpscare%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let leaveCount = 0;
    const IMAGE_URL = 'https://drawaria.online/avatar/cache/67e75060-10d0-11f0-af95-072f6d4ed084.1753059184788.jpg';
    const ALARM_URL = 'https://www.myinstants.com/media/sounds/alarm-sound-effect.mp3';
    const DISPLAY_TIME = 6000; // 6 segundos
    let jumpscared = false;

    function whenHomeButtonExists(fn) {
        const interval = setInterval(() => {
            const btn = document.querySelector('a#homebutton');
            if (btn) {
                clearInterval(interval);
                fn(btn);
            }
        }, 500);
    }

    function showJumpscare() {
        // Overlay oscuro
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'black';
        overlay.style.zIndex = 999999;
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        // Imagen
        const img = document.createElement('img');
        img.src = IMAGE_URL;
        img.style.maxHeight = '80vh';
        img.style.maxWidth = '80vw';
        img.style.boxShadow = '0 0 80px red';
        overlay.appendChild(img);

        document.body.appendChild(overlay);

        setTimeout(() => {
            const audio = new Audio(ALARM_URL);
            audio.volume = 1.0;
            audio.play();
            audio.onended = () => {
                overlay.remove();
            };
            // En caso el audio no termine bien, quitar overlay a los 8s máximo
            setTimeout(() => {
                overlay.remove();
            }, 8000);
        }, DISPLAY_TIME);
    }

    whenHomeButtonExists(btn => {
        btn.addEventListener('click', () => {
            if (jumpscared) return;
            leaveCount++;
            if (leaveCount >= 3) {
                jumpscared = true;
                showJumpscare();
            }
        }, true);
    });

})();
