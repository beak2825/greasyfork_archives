// ==UserScript==
// @name         VK Connect Banner Delete
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  VK Connect Удаляет надоедливый баннер для принятия соглашения
// @author       VSVLAD
// @match       *://vk.com/*
// @match       *://*.vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405619/VK%20Connect%20Banner%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/405619/VK%20Connect%20Banner%20Delete.meta.js
// ==/UserScript==

function hideBanner() {
    if (!!document.querySelectorAll('#box_layer_bg')[0]) {
        document.body.style.overflow = '';
        document.querySelectorAll('#box_layer_bg')[0].style.display = 'none';
        document.querySelectorAll('#box_layer_wrap')[0].style.display = 'none';

        window.setTimeout(hideBanner, 50);
    }
}

(function() {
    'use strict';

    console.log("User Script: Отключаем баннер в ВК. Начинаем работу")
    window.setTimeout(hideBanner, 50);
})();