// ==UserScript==
// @name         wh balancer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Perlito
// @match        https://*.plemiona.pl/game.php?village=*&screen=overview_villages&mode=prod
// @match        https://*.plemiona.pl/game.php?screen=overview_villages&screen=overview_villages&mode=prod
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453388/wh%20balancer.user.js
// @updateURL https://update.greasyfork.org/scripts/453388/wh%20balancer.meta.js
// ==/UserScript==
function otworz_formularz(){
         javascript:  $.getScript("https://shinko-to-kuma.com/scripts/WHBalancerShinkoToKuma.js");
};

var gui_content;

gui_content = `<table class="vis" style="width:100%">
<tr style="height: 25px">
                            <button id="otworz_formularz" class="btn">BALANSER SUREK</button>
</tr>
</table>`;
        document.querySelector("#content_value").innerHTML = gui_content + document.querySelector("#content_value").innerHTML;
$("#otworz_formularz").click(otworz_formularz);

;