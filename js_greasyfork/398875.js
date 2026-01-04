// ==UserScript==
// @name         VK_no_audio_ads
// @namespace    http://tampermonkey.net/
// @version      0.55
// @description  VK без аудиорекламы
// @author       VSVLAD
// @match       *://vk.com/*
// @match       *://*.vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/398875/VK_no_audio_ads.user.js
// @updateURL https://update.greasyfork.org/scripts/398875/VK_no_audio_ads.meta.js
// ==/UserScript==

"use strict";

function getVK(){
    if (!!window.vk){
        window.vk.audioAdsConfig = null;
        console.log("User Script: Отключаем аудиорекламу в ВК. Выполнено!");

    } else {
        //console.log("User Script: Отключаем аудиорекламу в ВК. Ждём инициализацию объекта");
        window.setTimeout(getVK, 100);
    }
}

(function() {
    window.addEventListener('load', function() {
        console.log("User Script: Отключаем аудиорекламу в ВК. Начинаем работу")
        window.setTimeout(getVK, 100);
    });
})();