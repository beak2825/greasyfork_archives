// ==UserScript==
// @name Обновление страницы
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description reload page if socket blocked
// @author panda1basic
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/439990/%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439990/%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        if (socket.readyState != 1){
            location.reload()
        }},30000);
})();