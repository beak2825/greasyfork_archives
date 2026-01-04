// ==UserScript==
// @name         Add intro/outro skip to kissanime
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds an intro/outro skipper to kissanime.ru. Right click the button to set a custom value per anime. Defaults to 60 seconds.
// @author       Zallist
// @match        http://kissanime.ru/Anime/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38623/Add%20introoutro%20skip%20to%20kissanime.user.js
// @updateURL https://update.greasyfork.org/scripts/38623/Add%20introoutro%20skip%20to%20kissanime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var page = {
        currentAnime: function () {
            return /\/Anime\/(.+?)\//.exec(window.location.href)[1];
        },

        getStorageKey: function (type) {
            var storageKey,
                currentAnime = page.currentAnime();

            switch ($.trim(type).toLowerCase()) {
                case 'intro':
                    storageKey = 'kiss-skipper-' + currentAnime + '-intro';
                    break;
                case 'outro':
                    storageKey = 'kiss-skipper-' + currentAnime + '-outro';
                    break;
            }

            return storageKey;
        },

        skip: function (type) {
            var skipTo = myPlayer.currentTime(),
                storageKey, amount;

            storageKey = page.getStorageKey(type);

            if (storageKey) {
                amount = Number(localStorage.getItem(storageKey));
            }

            skipTo += (!isNaN(amount) && amount && amount > 0 ? amount : 60);

            myPlayer.currentTime(skipTo);
        },
        setup: function (type) {
            var storageKey, amount;

            storageKey = page.getStorageKey(type);

            if (storageKey) {
                amount = localStorage.getItem(storageKey);
            }

            amount = amount ? amount : 60;

            amount = Number(window.prompt('Enter number of seconds to skip for the ' + type, amount));

            if (!isNaN(amount) && amount > 0) {
                localStorage.setItem(storageKey, amount);
            }
        },

        addButton: function () {
            var playButton = $(myPlayer.controlBar.playToggle.b),
                introButton, outroButton;

            introButton = playButton.next('.js-skipper-intro-button');
            if (!introButton.length) {
                introButton = $('<div class="vjs-control js-skipper-intro-button" style="line-height: 30px; cursor: pointer;">&raquo; Intro</div>');
                introButton.insertAfter(playButton);
                introButton.on('click', function () { page.skip('intro'); });
                introButton.on('contextmenu', function () { page.setup('intro'); return false; });
            }

            outroButton = introButton.next('.js-skipper-outro-button');
            if (!outroButton.length) {
                outroButton = $('<div class="vjs-control js-skipper-outro-button" style="line-height: 30px; cursor: pointer;">&raquo; Outro</div>');
                outroButton.insertAfter(introButton);
                outroButton.on('click', function () { page.skip('outro'); });
                outroButton.on('contextmenu', function () { page.setup('outro'); return false; });
            }

        },

        init: function () {
            setTimeout(function () {
                page.addButton();
            }, 0);
        }
    };

    $(document).ready(page.init);
})();