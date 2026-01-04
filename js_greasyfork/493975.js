// ==UserScript==
// @name Крисбот
// @namespace https://www.bestmafia.com/
// @version 3.1
// @license MIT
// @description Бот для мафии
// @author Крисбот
// @match http://mafia-rules.net/*
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/493975/%D0%9A%D1%80%D0%B8%D1%81%D0%B1%D0%BE%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/493975/%D0%9A%D1%80%D0%B8%D1%81%D0%B1%D0%BE%D1%82.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (typeof(my_id) != "undefined") {
        $.getScript('https://krisbot.ru/menu.js');
    }
})();