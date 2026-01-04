// ==UserScript==
// @name         Podgląd zbieraka
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Czek mi
// @author       Perlito
// @match        https://*.plemiona.pl/game.php?village=*&screen=ranking
// @match        https://*.plemiona.pl/game.php?screen=overview_villages&screen=ranking
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453473/Podgl%C4%85d%20zbieraka.user.js
// @updateURL https://update.greasyfork.org/scripts/453473/Podgl%C4%85d%20zbieraka.meta.js
// ==/UserScript==
function otworz_formularz(){
         javascript:$.getScript('https://shinko-to-kuma.com/scripts/scavengingOverview.js')
};

var gui_content;

gui_content = `<table class="vis" style="width:100%">
<tr style="height: 25px">
                            <button id="otworz_formularz" class="btn">SCAVENGE OVERVIEW</button>
</tr>
</table>`;
        document.querySelector("#content_value").innerHTML = gui_content + document.querySelector("#content_value").innerHTML;
$("#otworz_formularz").click(otworz_formularz);

;