// ==UserScript==
// @name         Highlight Yandex Ads
// @namespace    https://github.com/1-Mysty-1/hya
// @version      24m02p01
// @description  Highlight Ads in Yandex Search
// @description:ru Подсветка рекламы при выдаче результатов
// @license      MIT
// @author       Mysty
// @match        https://yandex.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487630/Highlight%20Yandex%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/487630/Highlight%20Yandex%20Ads.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var spans = document.getElementsByTagName("span");

    for (var i = 0; i < spans.length; i++) {
    if (spans[i].innerText.trim() === "Реклама") {
        spans[i].style.fontWeight = 'bold';
        var fontSize = parseInt(window.getComputedStyle(spans[i], null).getPropertyValue('font-size'));
        spans[i].style.color = 'red';
        spans[i].style.textAlign = 'right';
        var layer1 = spans[i].parentElement;
        var layer2 = layer1.parentElement;
        var container = layer2.parentElement;
        container.style.border = '2pt groove red';
        }
    }
})();