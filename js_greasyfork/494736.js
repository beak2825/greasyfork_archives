// ==UserScript==
// @name         wartab_move
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  перемещение в 1 клик со страницы Бои за территории
// @author       Something begins
// @license      none
// @match        https://www.heroeswm.ru/mapwars.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494736/wartab_move.user.js
// @updateURL https://update.greasyfork.org/scripts/494736/wartab_move.meta.js
// ==/UserScript==
const locIds = {
    "Empire Capital": 1,
    "East River": 2,
    "Tiger Lake": 3,
    "Rogues' Wood": 4,
    "Wolf Dale": 5,
    "Peaceful Camp": 6,
    "Lizard Lowland": 7,
    "Green Wood": 8,
    "Eagle Nest": 9,
    "Portal Ruins": 10,
    "Dragons' Caves": 11,
    "Shining Spring": 12,
    "Sunny City": 13,
    "Magma Mines": 14,
    "Bear Mountain": 15,
    "Fairy Trees": 16,
    "Harbour City": 17,
    "Mithril Coast": 18,
    "Great Wall": 19,
    "Titans' Valley": 20,
    "Fishing Village": 21,
    "Kingdom Castle": 22,
    "Ungovernable Steppe": 23,
    "Crystal Garden": 24,
    "East Island": 25,
    "The Wilderness": 26,
    "Sublime Arbor": 27
}

const allA = document.querySelectorAll("a");
const allMapA = Array.from(allA).filter(a => { return a.href.includes("map.php?cx=") });
console.log(allMapA);
for (const a of allMapA) {
    const font = a.querySelector("font");
    if (!font) continue;
    const areaName = font.textContent.split("-")[0].trim();
    // console.log(font.textContent);
    console.log("area id: ", locIds[areaName]);
    a.insertAdjacentHTML("afterend", `<a href = https://www.heroeswm.ru/move_sector.php?id=${locIds[areaName]}&rand=0.2654351550070957><img style = "width: 20px; height:20px" src = https://dcdn3.heroeswm.ru/i/combat/map/navigator_btn_horseman.png?ver=6></img></a>`)
        // https://dcdn3.heroeswm.ru/i/combat/map/navigator_btn_horseman.png?ver=6
}