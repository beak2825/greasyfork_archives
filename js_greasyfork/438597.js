// ==UserScript==
// @name        Incomings Overview
// @description Incomings helper
// @include     https://*.klanlar.org/game.php*screen=overview_villages*mode=incomings*subtype=attacks*
// @date        2021-12-23
// @version     2.5
// @author      Uyku
// @namespace   Uyku
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438597/Incomings%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/438597/Incomings%20Overview.meta.js
// ==/UserScript==
 
const pack = `
<div class="server_info" style=" text-align: left">
  <a style="cursor: progress" onClick="javascript:var NOBLE_GAP=100;var FORMAT='%unit% | %sent%';$.getScript('https://twscripts.dev/scripts/incomingsOverview.js')">Incomings</a></div>
`;

document.getElementById("contentContainer").insertAdjacentHTML("afterbegin", pack)