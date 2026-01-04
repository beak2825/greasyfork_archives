// ==UserScript==
// @name         VK autoplay music
// @name:ru      VK автовоспроизведение музыки
// @namespace    http://vk.com/
// @version      2024-09-07
// @description  Autoplay music on vk.com
// @description:ru Автоматическое воспроизведение музыки на vk.com при загрузке страницы
// @author       Steelman
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507492/VK%20autoplay%20music.user.js
// @updateURL https://update.greasyfork.org/scripts/507492/VK%20autoplay%20music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickElement(selector) {
        let el = document.querySelector(selector);
        if (el) {
            console.log("Autoplay music");
            el.click();
        } else {
            console.log("Couldn't find play button");
        }
    }

    window.addEventListener('load', function() {
        clickElement("button.top_audio_player_btn.top_audio_player_play._top_audio_player_play");
    }, false);

})();