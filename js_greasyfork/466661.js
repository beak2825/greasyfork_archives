// ==UserScript==
// @name Pikabu - video pause disabler
// @namespace https://pikabu.ru/
// @version 0.1
// @description Убирает эвент выхода смены видимости
// @author neo0071
// @match https://pikabu.ru/*
// @icon https://cs.pikabu.ru/assets/favicon.ico
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466661/Pikabu%20-%20video%20pause%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/466661/Pikabu%20-%20video%20pause%20disabler.meta.js
// ==/UserScript==

(function() {
    document.addEventListener("visibilitychange",(event)=>{event.stopImmediatePropagation();},true);
})();