// ==UserScript==
// @name         Surviv.io | M9+++
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @icon         https://static.wikia.nocookie.net/survivio/images/8/83/Loot-weapon-m9.png/revision/latest/scale-to-width-down/683?cb=20180713023444
// @description  Turn every gun into M9. A challenge for yourself.
// @author       sk
// @match        https://surviv.io
// @match        https://surviv2.io
// @match        https://2dbattleroyale.com
// @match        https://2dbattleroyale.org
// @match        https://piearesquared.info
// @match        https://thecircleisclosing.com
// @match        https://secantsecant.com
// @match        https://parmainitiative.com
// @match        https://ot38.club
// @match        https://drchandlertallow.com
// @match        https://rarepotato.com
// @match        https://archimedesofsyracuse.info
// @match        https://nevelskoygroup.com
// @match        https://kugahi.com
// @match        https://kugaheavyindustry.com
// @match        https://chandlertallowmd.com

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435432/Survivio%20%7C%20M9%2B%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/435432/Survivio%20%7C%20M9%2B%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
var gun = ""
var ammo = ""
var func = {
    webpack_inject: (w, e, get) => {
        gun = get("ad1c4e70")
        ammo = get("764654e6")
    },
};
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject"],
        func,
        [["webpack_inject"]]
    ]);
}
Object.keys(gun).forEach(function(key) {
    if(gun[key].type === "gun") {
        gun[key].dualWieldType = "m9_dual";
        gun[key].lootImg.sprite = "loot-weapon-m9.img";
        }
})
Object.keys(ammo).forEach(function(key) {
    if(ammo[key].type === "ammo") {
        ammo[key].lootImg.tint = 16756224;
        ammo[key].lootImg.tintDark = 12550912;
        }
})
})();