// ==UserScript==
// @name         MeowMeow.io
// @namespace    This script does nothing just settings the menu of MooMoo.io game. A legendary no hack
// @author       Kūhaku
// @version      0.1
// @description  Subcriber to Kūhaku on link https://www.youtube.com/channel/UCGhRFZ_hnCB4Rmkm2aUyz2g
// @author       Kūhaku
// @match        *://*.moomoo.io/*
// @grant        None.
// @icon        http://u.cubeupload.com/Kuuhaku6596/cat.png
// @downloadURL https://update.greasyfork.org/scripts/376082/MeowMeowio.user.js
// @updateURL https://update.greasyfork.org/scripts/376082/MeowMeowio.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementById("gameName").innerHTML = "Nyaa~.io";
document.getElementById("leaderboard").append('Subscribe To KūhakuGats.io!');
document.getElementById("diedText").innerHTML = "Aww, you was unlucky?!"

document.title="Meow Meow";var a=["Meow Meow","Moo Moo"]

document.getElementById("scoreDisplay").style.color = "#ffdd00";
document.getElementById("woodDisplay").style.color = "#3dff00";
document.getElementById("stoneDisplay").style.color = "#919191";
document.getElementById("killCounter").style.color = "#ac2727";
document.getElementById("foodDisplay").style.color = "#ff0000";
document.getElementById("allianceButton").style.color = "#00f4ff";
document.getElementById("chatButton").style.color = "#ffffff";
document.getElementById("storeButton").style.color = "#ff7300";
document.getElementById("ageText").style.color = "#050000";
})();