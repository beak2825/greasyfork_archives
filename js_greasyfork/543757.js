// ==UserScript==
// @name         inventory_blacklist
// @namespace    http://tampermonkey.net/
// @version      1000000
// @description  передачи ЧС
// @author       You
// @license none
// @match        https://my.lordswm.com/inventory.php
// @match        https://heroeswm.ru/inventory.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543757/inventory_blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/543757/inventory_blacklist.meta.js
// ==/UserScript==
setInterval(()=>{
    const blacklist = ["Philosopher", "pidoras"];
    const toRemove = [];
    for (const parcel of document.querySelectorAll(".inv_peredachka")){
        const nick = parcel.querySelector("a[href*='pl_info'] > b");
        
        if (blacklist.includes(nick.textContent)) toRemove.push(parcel);
    }
    for (const parcel of toRemove) parcel.remove();
}, 100)