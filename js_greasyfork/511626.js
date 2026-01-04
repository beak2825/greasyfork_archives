// ==UserScript==
// @name         LG event remove easy options
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Скрыть легкие варианты в ивенте
// @author       You
// @match        https://www.heroeswm.ru/lg_event.php
// @match        https://my.lordswm.com/lg_event.php
// @match        https://lordswm.com/lg_event.php
// @license      deez nuts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511626/LG%20event%20remove%20easy%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/511626/LG%20event%20remove%20easy%20options.meta.js
// ==/UserScript==

(function() {
    const toRemove = [];
    const enemies = document.querySelectorAll(".frac_enemy_block");
    for (let i = 1; i < enemies.length; i++){
        toRemove.push(enemies[i]);
    }
    for (const enemy of toRemove) enemy.remove();
})();