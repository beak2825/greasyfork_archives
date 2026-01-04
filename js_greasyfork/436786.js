// ==UserScript==
// @name         Автопереброс
// @namespace    https://www.bestmafia.com/
// @version      1.3
// @description  Помогает избавиться от зависания вечки
// @author       Chappa
// @match        http://*.mafia-rules.net/vkontakte/*
// @match        https://*.mafia-rules.net/vkontakte/*
// @match        http://*.mafia-rules.net/odnoklassniki/*
// @match        https://*.mafia-rules.net/odnoklassniki/*
// @match        http://*.mafia-rules.net/moymir/*
// @match        https://*.mafia-rules.net/moymir/*


// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436786/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B1%D1%80%D0%BE%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/436786/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D0%B1%D1%80%D0%BE%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.location.replace('http://www.bestmafia.com/standalone/' + PAGE_goto.toString().match(/\d*\w*\/"/)[0].replace('"', ''));
})();