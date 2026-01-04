// ==UserScript==
// @name        Maden işleri
// @author      ScriptAdam
// @namespace   ScriptAdam
// @version     1.1
// @description Maden dengeleyici + Katlama Yardımcısı
// @include     https://tr*.klanlar.org/game.php?*&screen=overview_villages*&mode=prod*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438587/Maden%20i%C5%9Fleri.user.js
// @updateURL https://update.greasyfork.org/scripts/438587/Maden%20i%C5%9Fleri.meta.js
// ==/UserScript==
 
const pack = `
<div class="server_info" style=" text-align: left">
  <a style="cursor: progress" onClick="$.getScript('https://shinko-to-kuma.com/scripts/WHBalancerShinkoToKuma.js')">Maden Dengeleyici</a>
  &bull;
  <a style="cursor: progress" onClick="$.getScript('https://shinko-to-kuma.com/scripts/res-senderV2.js')">Katlama Yardımcısı</a>
</div>
`;
 
document.getElementsByClassName("server_info")[0].insertAdjacentHTML("beforebegin", pack);