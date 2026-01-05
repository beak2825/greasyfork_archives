// ==UserScript==
// @name         Easier Target VRS
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1.1
// @description  remove zero cartons from target vrs
// @match        http://vrs.partnersonline.com/vrs/multiShipment/MultipleShipmentEntry.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13850/Easier%20Target%20VRS.user.js
// @updateURL https://update.greasyfork.org/scripts/13850/Easier%20Target%20VRS.meta.js
// ==/UserScript==

function clearTargetZeroCartons(){
    //alert(1);
    a = listMultipleShip.tBodies[0];
    for (b=(a.children.length-1);b>-1;b--){
        if (a.children[b].children[3].innerText=="0"){
            //f = new Function("deleteR("+b+");document.querySelectorAll('button')[0].click();");
            f = new Function("listMultipleShip.tBodies[0].children["+b+"].children[23].children[0].click();document.querySelectorAll('button')[0].click();");
            setTimeout(f,500);
        }
    }
}
window.clearTargetZeroCartons = clearTargetZeroCartons;
//window.unsafeWindow.clearTargetZeroCartons = clearTargetZeroCartons;
title = document.querySelectorAll(".app_badge")[1];
ctzc = document.createElement("span");
ctzc.innerHTML = '&nbsp;<span onclick="clearTargetZeroCartons()">(Zero)</span>';
title.appendChild(ctzc);