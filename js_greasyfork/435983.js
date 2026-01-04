// ==UserScript==
// @name         AdBlock Yandex.Music
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AdBlock for Yandex.Music
// @author       Roman Sapetin
// @match        https://music.yandex.ru/*
// @icon         https://www.google.com/s2/favicons?domain=yandex.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435983/AdBlock%20YandexMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/435983/AdBlock%20YandexMusic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() =>  {
        const a  = document.getElementsByClassName('crackdown-popup popup_compact local-theme-white local-icon-theme-white popup deco-pane-popup popup_modal');
        if (a.length && !$(a).hasClass('popup_hidden')) {
            document.getElementsByClassName('d-button deco-button deco-button-flat d-button_type_flat d-button_w-icon d-button_w-icon-centered crackdown-popup__close')[0].click();
            document.getElementsByClassName('player-controls__btn deco-player-controls__button player-controls__btn_play')[0].click()

        }

    }, 1000)
})();