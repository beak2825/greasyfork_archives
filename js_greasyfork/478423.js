// ==UserScript==
// @name         RoundInfo
// @namespace    FeizhaiXiage.RoundInfo
// @version      0.1
// @description  add RoundInfo
// @author       FeizhaiXiage
// @match        https://hentaiverse.org/?s=Battle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaiverse.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478423/RoundInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/478423/RoundInfo.meta.js
// ==/UserScript==

(function() {
    var pane = document.getElementById("pane_log");
    var GameLog = pane.getElementsByTagName("tr");
    var RoundInfo = GameLog[GameLog.length-1].textContent;
    var RoundInfoDiv = document.createElement('div');
    RoundInfoDiv.textContent = RoundInfo;
    var battleMain = document.getElementById('battle_right');
    battleMain.appendChild(RoundInfoDiv);
})();