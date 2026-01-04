// ==UserScript==
// @name         DelugeRPG S-Battler
// @match        https://www.delugerpg.com/battle/user/u/S-*
// @version      1.0
// @description  Automatically uses the first poke and the first attack.
// @author       redbrain
// @icon         https://www.google.com/s2/favicons?domain=delugerpg.com
// @grant        none
// @namespace https://greasyfork.org/users/767360
// @downloadURL https://update.greasyfork.org/scripts/425798/DelugeRPG%20S-Battler.user.js
// @updateURL https://update.greasyfork.org/scripts/425798/DelugeRPG%20S-Battler.meta.js
// ==/UserScript==


setInterval(()=>{null==document.querySelector(".modal-open")&&document.querySelector(".btn-battle-action")?.click()},0);