// ==UserScript==
// @name        Toplu Komut Zamanlayıcı
// @description Komut zamanlarını gösterir
// @include     https://*.klanlar.org/game.php*screen=overview_villages*mode=combined*
// @date        2021-12-23
// @version     2.6
// @author      ScriptAdam
// @namespace   ScriptAdam
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/437495/Toplu%20Komut%20Zamanlay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/437495/Toplu%20Komut%20Zamanlay%C4%B1c%C4%B1.meta.js
// ==/UserScript==

const pack = `
<div class="server_info" style=" text-align: left">
  <a style="cursor: progress" onClick="$.getScript('https://twscripts.dev/scripts/massCommandTimer.js')" >Toplu Komut Zamanlayıcı</a>
</div>
`;

document.getElementsByClassName("server_info")[0].insertAdjacentHTML("beforebegin", pack);