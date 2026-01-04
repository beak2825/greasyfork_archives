// ==UserScript==
// @name         icMED - validare servicii
// @name:en      icMED - service validator
// @namespace    https://github.com/ctekse/userscripts
// @version      1.0.4
// @description  Acest script valideaza serviciile nevalidate de pe pagina Servicii din icMED
// @description:en   This script is used to validate the unvalidated services on icMED software's Servicii page.
// @author       Csaba Tekse
// @match        https://*.icmed.ro/Main/Reports/CentralizatoareRapoarteCAS/Servicii.module.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icmed.ro
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526863/icMED%20-%20validare%20servicii.user.js
// @updateURL https://update.greasyfork.org/scripts/526863/icMED%20-%20validare%20servicii.meta.js
// ==/UserScript==

/* globals jQuery */

(function() {
    var radioNevalidate = jQuery("input[name$='rblValidare'][value=2]");
    if(radioNevalidate.is(':not(:checked)'))
    {
        return;
    }

    const isAutoClickOn = GM_getValue("icMed.services.on", false);
    console.log("isAutoClickOn: " + isAutoClickOn);
    var intervalId = 0;
    var btnAutoClickOn = jQuery('<input type="button" value="Porneste clickurile automate" style="margin-left:200px;"/>');
    var btnAutoClickOff = jQuery('<input type="button" value="OPRESTE clickurile automate" style="margin-left:200px;" />');
    btnAutoClickOn.click( function() {
        console.log("Started the automatic clicker...");
        GM_setValue("icMed.services.on", true);
        btnAutoClickOn.hide();
        btnAutoClickOff.show();
        intervalId = setInterval(function () {
            var messagePopup = jQuery("#card-message");
            if(messagePopup.is(':hidden')) {
                var validationBtns = jQuery("input[name$='btnValideaza']");
                if(validationBtns.length == 0) {
                    GM_setValue("icMed.services.on", false);
                } else {
                    validationBtns.first().click();
                }
            }
        }, 5000);
     });
    btnAutoClickOff.click(function (){
        GM_setValue("icMed.services.on", false);
        clearInterval(intervalId);
        btnAutoClickOn.show();
        btnAutoClickOff.hide();
        console.log("Automatic clicker stopped.");
    });
    btnAutoClickOff.insertAfter("#ctl11_ctl00_Label8").toggle(isAutoClickOn);
    btnAutoClickOn.insertAfter("#ctl11_ctl00_Label8").toggle(!isAutoClickOn);
    if(isAutoClickOn){
        btnAutoClickOn.click();
    }
})();