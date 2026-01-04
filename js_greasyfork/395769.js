// ==UserScript==
// @name         Tesla Hidden VIN finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jonathan Jenkyn
// @match        https://www.tesla.com/*/teslaaccount/product-finalize?rn=*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/395769/Tesla%20Hidden%20VIN%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/395769/Tesla%20Hidden%20VIN%20finder.meta.js
// ==/UserScript==

try {

    var VIN_found=false
    var masterString = document.head.innerHTML;
    const rn = document. getElementById("prod-final-deliver-desk-rn");
    var start = masterString.indexOf('"showDetailsInSelfInsuranceForm":false,"vin":"')+'"showDetailsInSelfInsuranceForm":false,"vin":"'.length;
    if (start >0){
        var end = masterString.indexOf('"',start);
        if (end >0){
            // inject the VIN into the DOM somewhere
            var vin= masterString.substr(start,end-start);
            rn.textContent = rn.textContent + " VIN:"+vin;
        }
    }
    else{
        rn.textContent = rn.textContent + " VIN:<I>No Hidden VIN Found</I>";
    }
}
catch (e) {
    console.log(`Failed: `, e);
    return;
}