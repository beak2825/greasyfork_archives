// ==UserScript==
// @name         Убрать чат
// @namespace    Timka251
// @version      1.0
// @description  Скрипт убирает кнопку чата
// @author       Timka251
// @match        *://zelenka.guru/*
// @icon         https://i.imgur.com/RUIDkQg.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483336/%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%87%D0%B0%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/483336/%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%87%D0%B0%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeElementByClass(className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }
    removeElementByClass('chat2-button chat2-button-open lztng-1a57w7i');
})();