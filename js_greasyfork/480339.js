// ==UserScript==
// @name         Скрыть иконку чата by stealyourbrain
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Скрывает иконку чата на форуме Zelenka.guru
// @author       stealyourbrain
// @match        https://zelenka.guru/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480339/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%20%D1%87%D0%B0%D1%82%D0%B0%20by%20stealyourbrain.user.js
// @updateURL https://update.greasyfork.org/scripts/480339/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%20%D1%87%D0%B0%D1%82%D0%B0%20by%20stealyourbrain.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Находим иконку чата и скрываем её
    var chatIcon = document.querySelector('.chat2-button.chat2-button-open.lztng-1a57w7i');

    if (chatIcon) {
        chatIcon.style.display = 'none';
    }
})();