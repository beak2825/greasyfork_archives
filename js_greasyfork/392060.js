// ==UserScript==
// @name         Case Clicker Money Hack
// @namespace    https://kingofkfcjamal.github.io/CaseClicker/
// @version      0.1
// @description  Csgo Clicker Money hack pretty basic script but it works.
// @author       Lukas D
// @match        https://www.tampermonkey.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392060/Case%20Clicker%20Money%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/392060/Case%20Clicker%20Money%20Hack.meta.js
// ==/UserScript==

(function() {
    var json = {
"money":999999999999999999999999999999999999999999999999999999999999999999999999.5,
"inventory":{
},
"itemCounter":0,
"currentCase":"case1",
"stackingUpgradesPurchased":{
"upgrade1":0,
"upgrade2":0,
"upgrade3":0
},
"popup":true,
"unboxsound":true,
"menusound":true,
"acceptedsound":true,
"lostsound":true,
"wonsound":true,
"botsound":true,
"coinflip":false
}
    window.localStorage.setItem("savegame", JSON.stringify(json));
})();