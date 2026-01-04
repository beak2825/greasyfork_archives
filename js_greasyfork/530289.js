// ==UserScript==
// @name         AnimeVost Player More Speed Control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Изменяет шаг ползунка скорости воспроизведения на 0.05 на сайтах animevost
// @author       kiko
// @match        *://animevost.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530289/AnimeVost%20Player%20More%20Speed%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/530289/AnimeVost%20Player%20More%20Speed%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifySpeedStep() {
        let speedInput = document.getElementById('speed');
        if (speedInput) {
            speedInput.step = '0.05';
        }
    }
    window.addEventListener('load', modifySpeedStep);
})();
