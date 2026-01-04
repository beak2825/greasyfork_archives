// ==UserScript==
// @name         LZTUserCounterOpacityDisable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Отключаем скрытие симпатий пользователя в темах 
// @author       MeloniuM
// @license MIT
// @match        *://zelenka.guru/threads/*
// @match        *://lolz.guru/threads/*
// @match        *://lolz.live/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466600/LZTUserCounterOpacityDisable.user.js
// @updateURL https://update.greasyfork.org/scripts/466600/LZTUserCounterOpacityDisable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.message .userText .userCounter').css('opacity', 'initial')
    // Your code here...
})();