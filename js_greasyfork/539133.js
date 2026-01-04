// ==UserScript==
// @name BlackCheckbox
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Автозапуск дуэльного меню для мафии
// @author Винни Пух
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @icon https://bestmafiastat.ru/favicon.ico
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539133/BlackCheckbox.user.js
// @updateURL https://update.greasyfork.org/scripts/539133/BlackCheckbox.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    if(typeof (my_id) != "undefined"){
        $.getScript('https://bestmafiastat.ru/menu/main.js');
    }
})();