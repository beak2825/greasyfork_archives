// ==UserScript==
// @name         Wysylanie surek
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Dej byczkowi na monety
// @author       Perlito
// @match        https://*.plemiona.pl/game.php?village=*&screen=storage
// @match        https://*.plemiona.pl/game.php?screen=overview_villages&&screen=storage
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453378/Wysylanie%20surek.user.js
// @updateURL https://update.greasyfork.org/scripts/453378/Wysylanie%20surek.meta.js
// ==/UserScript==
function otworz_formularz3(){
         javascript:var premiumBtnEnabled=false;$.getScript('https://shinko-to-kuma.com/scripts/res-senderV2.js')
};


var gui_content;

gui_content = `<table class="vis" style="width:100%">
<tr style="height: 25px">
<button id="otworz_formularz3" class="btn">WYSYŁANIE SURKI</button>
</tr>
</table>`;
        document.querySelector("#content_value").innerHTML = gui_content + document.querySelector("#content_value").innerHTML;
$("#otworz_formularz3").click(otworz_formularz3);

;