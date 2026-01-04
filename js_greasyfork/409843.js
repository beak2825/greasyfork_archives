// ==UserScript==
// @name         Thunderkick Fake Games
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       meaqese
// @match        https://tk-game-sg1.thunderkick.com/gamelauncher/desktopLauncher/default/tk*
// @match        https://joycasino.com/ru/game/demo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409843/Thunderkick%20Fake%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/409843/Thunderkick%20Fake%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function (evt) {
        if (evt.which === 70) {
            var iframe = document.getElementById('game_container');
            var start_balance = window.prompt('Начальный баланс: ', '5000');
            var url = new URL(iframe.src);

            url.searchParams.set('freeAccountBalance', start_balance);
            url.searchParams.set('freeAccountCurrencyIso', 'RUB');
            url.search = url.searchParams.toString();

            window.location.href = url.toString();
        } else if (evt.key === 'Shift') {
            var free_game = document.querySelector('.infoBarLabelPlayMode');
            free_game.innerHTML = 'РЕАЛЬНАЯ ИГРА';
        }
    });
})();