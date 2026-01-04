// ==UserScript==
// @name         LZT no info rozigrush naxuy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Данное расширение удаляет информацию об розыгрыше
// @author       ChatGPT , aff
// @match        *https://zelenka.guru/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467803/LZT%20no%20info%20rozigrush%20naxuy.user.js
// @updateURL https://update.greasyfork.org/scripts/467803/LZT%20no%20info%20rozigrush%20naxuy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetElement = document.querySelector('div.messageInfo > div.messageContent > article > div > div.new-raffle-info.mn-15-0-0');
    if (targetElement) {
        targetElement.parentNode.removeChild(targetElement);
    }
})();
