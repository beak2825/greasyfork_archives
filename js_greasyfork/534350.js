// ==UserScript==
// @name         HWMDaily battle instant links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  поиск боев -> ссылки сразу ведут на бой
// @author       Something begins
// @license      yo momma
// @match        https://daily.heroeswm.ru/gt/battle*
// @match        https://daily.heroeswm.ru/mt*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534350/HWMDaily%20battle%20instant%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/534350/HWMDaily%20battle%20instant%20links.meta.js
// ==/UserScript==

(function() {
    // https://daily.heroeswm.ru/gt/war/id/1553763489
    const battle_As = Array.from(document.querySelectorAll("a")).filter(a => {return a.href && a.href.includes("/war/id/")});
    for (const a of battle_As){

        a.href = a.href.replace(/https:\/\/daily.heroeswm.ru\/.+?\/war\/id\//, "https://www.heroeswm.ru/war.php?lt=-1&warid=");
    }
})();