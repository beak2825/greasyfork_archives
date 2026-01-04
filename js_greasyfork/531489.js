// ==UserScript==
// @name         forum gay titles' removal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1 апреля убрать тупые названия форумов
// @author       Something begins
// @license      hustlers university
// @match        https://www.heroeswm.ru/forum.php
// @match        https://my.lordswm.com/forum.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531489/forum%20gay%20titles%27%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/531489/forum%20gay%20titles%27%20removal.meta.js
// ==/UserScript==

(function() {
    let i = 0;
    document.querySelectorAll(".forumt").forEach(title => {if (i%2===0) title.style.display = "none"; i++})
})();