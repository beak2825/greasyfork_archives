// ==UserScript==
// @name         Spelpaus remover Betfair SE
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes the spelpaus banner on top of the site betfair.se as well as the annoying session info popup.
// @author       You
// @match        https://*.betfair.se/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376220/Spelpaus%20remover%20Betfair%20SE.user.js
// @updateURL https://update.greasyfork.org/scripts/376220/Spelpaus%20remover%20Betfair%20SE.meta.js
// ==/UserScript==

GM_addStyle("#ssc-hbc {display: none;}");

setInterval ( function () {
    if(document.getElementById("closeRegulatoryModal")){
        document.getElementById("closeRegulatoryModal").click();
    };
}, 5000);
