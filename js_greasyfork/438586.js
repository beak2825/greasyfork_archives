// ==UserScript==
// @name        Find Villages in Range
// @author      ScriptAdam
// @namespace   ScriptAdam
// @version     0.9
// @description Destek yetiştirebelicek köyleri bulur
// @include     https://tr*.klanlar.org/game.php?*&screen=map*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438586/Find%20Villages%20in%20Range.user.js
// @updateURL https://update.greasyfork.org/scripts/438586/Find%20Villages%20in%20Range.meta.js
// ==/UserScript==

const pack = `
<div class="server_info" style=" text-align: left">
  <a style="cursor: progress" onClick="$.getScript('https://twscripts.dev/scripts/villagesInRange.js')" >Range</a>
</div>
`;

document.getElementsByClassName("server_info")[0].insertAdjacentHTML("beforebegin", pack);