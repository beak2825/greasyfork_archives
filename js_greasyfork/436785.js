// ==UserScript==
// @name         Автозапуск менюшки
// @namespace    https://www.bestmafia.com/
// @version      1.0
// @description  Автозапуск менюшки для игры bestmafia
// @author       Chappa
// @match        http://www.mafia-rules.net/*
// @match        https://www.mafia-rules.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436785/%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%20%D0%BC%D0%B5%D0%BD%D1%8E%D1%88%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/436785/%D0%90%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA%20%D0%BC%D0%B5%D0%BD%D1%8E%D1%88%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(typeof (my_id) != "undefined"){
        $.getScript('https://bestmafiastat.ru:1204/nginx/duel_helper.js');
    }
    
})();