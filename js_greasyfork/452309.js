// ==UserScript==
// @name         Auto Slow Download Nexus Mods
// @name:ru   Авто "Slow" скачивание с Nexus Mods
// @namespace    https://mjkey.ru/#donate
// @version      0.1
// @description  Auto click download button (slow) and close page.
// @description:ru  Автоматичеcки нажимает на кнопку "Скачать медленно", после чего закрывает страницу!
// @author       MjKey
// @match        *://*.nexusmods.com/*
// @match        *://nexusmods.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @copyright    2022, MjKey (https://mjkey.ru/#donate)
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452309/Auto%20Slow%20Download%20Nexus%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/452309/Auto%20Slow%20Download%20Nexus%20Mods.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var slowButton = document.getElementById('slowDownloadButton');
    var chek = function(button) {
        var PosT = {
                top: window.pageYOffset + button.getBoundingClientRect().top,
                left: window.pageXOffset + button.getBoundingClientRect().left,
                right: window.pageXOffset + button.getBoundingClientRect().right,
                bottom: window.pageYOffset + button.getBoundingClientRect().bottom
            },
            PosW = {
                top: window.pageYOffset,
                left: window.pageXOffset,
                right: window.pageXOffset + document.documentElement.clientWidth,
                bottom: window.pageYOffset + document.documentElement.clientHeight
            };
        if (PosT.bottom > PosW.top &&
            PosT.top < PosW.bottom &&
            PosT.right > PosW.left &&
            PosT.left < PosW.right) {
            console.clear();
            console.log('Найдена кнопка :)');

            slowButton.click();

            setTimeout(function() {
                window.close();
            }, 2000);
        }
    };

    window.addEventListener('scroll', function() {
        chek(slowButton);
    });
    chek(slowButton);
})();