// ==UserScript==
// @name         Disable title blinking
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Раздражает мигание названия вкладки? Отвлекает? Теперь моргать не будет. Пока только для mail.ru, но можно скопировать и применять его на любом другом сайте
// @author       Skiftcha
// @match        https://mail.ru/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/397118/Disable%20title%20blinking.user.js
// @updateURL https://update.greasyfork.org/scripts/397118/Disable%20title%20blinking.meta.js
// ==/UserScript==

window.originalTitle = document.title
Object.defineProperty(document, 'title', {
    get: function() { return window.originalTitle },
    set: function() {}
});