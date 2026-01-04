// ==UserScript==
// @name         atakowane mordy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  atakowani gracze
// @author       Perlito
// @match        https://*.plemiona.pl/game.php?village=*&screen=storage
// @match        https://*.plemiona.pl/game.php?village=*&screen=ally
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460260/atakowane%20mordy.user.js
// @updateURL https://update.greasyfork.org/scripts/460260/atakowane%20mordy.meta.js
// ==/UserScript==
function otworz_formularz3(){
         javascript:var premiumBtnEnabled=false;$.getScript('https://twscripts.dev/scripts/tribePlayersUnderAttack.js%27);')
};
 
 
var gui_content;
 
gui_content = `<table class="vis" style="width:100%">
<tr style="height: 25px">
<button id="otworz_formularz3" class="btn">atakowani koledzy</button>
</tr>
</table>`;
        document.querySelector("#content_value").innerHTML = gui_content + document.querySelector("#content_value").innerHTML;
$("#otworz_formularz3").click(otworz_formularz3);
 
;