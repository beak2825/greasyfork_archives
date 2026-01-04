// ==UserScript==
// @name         ZbieractwoMasowe_button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php?village=*&screen=place&mode=scavenge_mass
// @match        https://*.plemiona.pl/game.php?screen=overview_villages&screen=place&mode=scavenge_mass
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453377/ZbieractwoMasowe_button.user.js
// @updateURL https://update.greasyfork.org/scripts/453377/ZbieractwoMasowe_button.meta.js
// ==/UserScript==
function otworz_formularz1(){
         javascript:var premiumBtnEnabled=false;$.getScript('https://shinko-to-kuma.com/scripts/massScavenge.js')
};


var gui_content;

gui_content = `<table class="vis" style="width:100%">
<tr style="height: 25px">
<button id="otworz_formularz1" class="btn">Zbierak Masowy</button>
</tr>
</table>`;
        document.querySelector("#content_value").innerHTML = gui_content + document.querySelector("#content_value").innerHTML;
$("#otworz_formularz1").click(otworz_formularz1);

;