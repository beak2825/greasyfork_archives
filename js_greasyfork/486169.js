// ==UserScript==
// @name         flowr.fun cursed backgrounds???
// @namespace    http://tampermonkey.net/
// @version      2024-01-31
// @description  :>
// @author       Ly
// @match        https://flowr.fun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowr.fun
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486169/flowrfun%20cursed%20backgrounds.user.js
// @updateURL https://update.greasyfork.org/scripts/486169/flowrfun%20cursed%20backgrounds.meta.js
// ==/UserScript==

setInterval(() => {
    spawnMenuEnemy()
 }, "50");
Colors.biomes = {
    "garden": {
        "background": "#1ea76121",
        "grid": "#1ea76151"
    },
    "desert": {
        "background": "#dece7b21",
        "grid": "#dece7b51"
    },
    "ocean": {
        "background": "#547db321",
        "grid": "#547db351"
    },
    "Diep": {
        "background": "#d8d8d821",
        "grid": "#d8d8d851"
    },
    "Ladybug Biome": {
        "background": "#41a47121",
        "grid": "#41a47151"
    },
    "Soul Lands": {
        "background": "#36363621",
        "grid": "#36363651"
    },
    "Rainforest": {
        "background": "#5b880721",
        "grid": "#5b880751"
    },
    "Fruit": {
        "background": "#31b47121",
        "grid": "#31b47151"
    },
    "Vegetable": {
        "background": "#da4d1021",
        "grid": "#da4d1051"
    },
    "Mansion": {
        "background": "#1f251821",
        "grid": "#1f251851"
    },
    "Sewer": {
        "background": "#752f0821",
        "grid": "#752f0851"
    },
    "Winter": {
        "background": "#fafafa21",
        "grid": "#fafafa51"
    },
    "Soccer!": {
        "background": "#39a74c21",
        "grid": "#39a74c51"
    }
}