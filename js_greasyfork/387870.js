// ==UserScript==
// @name         Yanex Music AdsPlus Disable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ZardoZ
// @match        https://music.yandex.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387870/Yanex%20Music%20AdsPlus%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/387870/Yanex%20Music%20AdsPlus%20Disable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //хрень сверху
    document.querySelector('[data-b *= "2"]').remove();
    //попап с плюсом
    document.querySelector('[data-b *= "48"]').remove();

    //нижняя полоска с плюсом
    var element1 = document.querySelector('div.bar-below_plus');
    element1.style.display = 'none';

    //блок рекламы справа
    var element2 = document.querySelector('div.teaser-autoplaylist').parentElement;
    var class2 = element2.className;
    element2 = document.querySelector('.' + class2 + ' > *:nth-child(3)');
    if (element2){
        element2.remove();
    }
    element2 = document.querySelector('.' + class2 + ' > *:nth-child(3)');
    if (element2){
        element2.remove();
    }

    //попап с плюсом 2я попытка
    var element3 = document.querySelector('div.subscription-hint_bottom');
    if (element3){
        element3.remove();
    }

    //предупреждение о блокировке рекламы
    setTimeout(function(){
        var element4 = document.querySelector('div.notify');
        if (element4){
            element4.remove();
        }
    }, 2050);
})();