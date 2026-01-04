// ==UserScript==
// @name         Удаление темы
// @namespace    https://zelenka.guru/
// @version      1.0
// @description  Удаляет тему на Ctrl+X
// @author       Mayni1337
// @match        https://zelenka.guru/threads/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/472850/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/472850/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'x' && event.ctrlKey) {
            var deleteButton = document.querySelector('.OverlayTrigger[href$="/delete"]');
            if (deleteButton) {
                deleteButton.click();
                setTimeout(function() {
                    var confirmButton = document.querySelector('input[value="Удалить тему"]');
                    if (confirmButton) {
                        confirmButton.click();
                    }
                }, 1000);
            }
        }
    });
})();