// ==UserScript==
// @name Jutsu helper
// @description Скрипт для автоматического пропуска опенингов и эндингов
// @author Murka
// @version 0.3
// @icon https://gen.jut.su/safari_152.png
// @match *://jut.su/*
// @run-at document-end
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/516293/Jutsu%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/516293/Jutsu%20helper.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {

    function isVisible(elem) {
        return elem && elem.offsetParent !== null;
    }

    (function loop() {
        const opening = document.querySelector("div[title='Нажмите, если лень смотреть опенинг']");
        const ending = document.querySelector("div[title='Перейти к следующему эпизоду']");
        const playButton = document.querySelector("button[title='Воспроизвести видео']");
        const fullButton = document.getElementById("my-player_html5_api");

        if (isVisible(opening)) opening.click();
        if (isVisible(ending)) ending.click();
        if (isVisible(playButton)) {
            playButton.click();
            //fullButton.style='    width: 1960px;    position: fixed;    height: 1080px;    z-index: 9999;    top: -150px;    left: 0px;';
        }
        setTimeout(loop, isVisible(opening) || isVisible(ending) ? 5000 : 250);
    })();

})();