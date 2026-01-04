// ==UserScript==
// @name         DelugeRPG S-Battlerv2
// @match        https://www.delugerpg.com/battle/user*
// @version      1.0
// @description  automates the stellar battle the first attack and first pokemon and the last one another user's fight here everything is automated if you want to touch a button while you are fighting it will be impossible.
// @author       Monarc4YT
// @icon         https://i.dstatic.com/images/items/large/masterball.png
// @grant        none
// @namespace    https://greasyfork.org/es/users/1137520
// @downloadURL https://update.greasyfork.org/scripts/471974/DelugeRPG%20S-Battlerv2.user.js
// @updateURL https://update.greasyfork.org/scripts/471974/DelugeRPG%20S-Battlerv2.meta.js
// ==/UserScript==


setInterval(()=>{null==document.querySelector(".modal-open")&&document.querySelector("#attack > div.cardif > form > div.buttoncenter > input:nth-child(1)")?.click()},0);
setInterval(() => {document.querySelector("#battle > form > div.center > input:nth-child(1)").click();
}, 0);
setInterval(() => {
    document.querySelector("#battle > div.notify_done > a.btn.btn-default").click();
}, 0);
