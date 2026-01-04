// ==UserScript==
// @name         PH Bypasser VK
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  Don't watch videos - bad for you! You can watch without logging into VK (for privacy).
// @description  Не смотри видео - это плохо для тебя! Теперь ты можешь смотреть без входа в ВКонтакте (для конфиденциальности)
// @author       https://greasyfork.org/en/users/1202823-en-users-sign-up
// @match        https://*.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478083/PH%20Bypasser%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/478083/PH%20Bypasser%20VK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.isConnected) {
        document.getElementById('age-verification-wrapper').remove()
        document.getElementById('age-verification-container').remove()
    }
})();