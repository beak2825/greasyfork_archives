// ==UserScript==
// @name         icMED - urcare rețete în SIPE
// @name:en      icMED - offline receipt uploader
// @namespace    https://github.com/ctekse/userscripts
// @version      1.0.4
// @description  Acest script ajută la urcarea rețetelor în SIPE pe pagina Rețete în icMED
// @description:en   This script is used to upload the receipts into the SIPE system from the icMED software's Retete page
// @author       Csaba Tekse
// @match        https://*.icmed.ro/Main/Reports/CentralizatoareRapoarteCAS/Retete.module.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icmed.ro
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526861/icMED%20-%20urcare%20re%C8%9Bete%20%C3%AEn%20SIPE.user.js
// @updateURL https://update.greasyfork.org/scripts/526861/icMED%20-%20urcare%20re%C8%9Bete%20%C3%AEn%20SIPE.meta.js
// ==/UserScript==
 
/* globals jQuery */
 
(function() {
    const isAutoClickOn = GM_getValue("icMed.receipt.on", false);
    console.log("isAutoClickOn: " + isAutoClickOn);
    var intervalId = 0;
    var btnAutoClickOn = jQuery('<input type="button" value="Porneste clickurile automate" style="margin-left:200px;"/>');
    var btnAutoClickOff = jQuery('<input type="button" value="Opreste clickurile automate" style="margin-left:200px;" />');
    btnAutoClickOn.click( function() {
        console.log("Started the automatic clicker...");
        GM_setValue("icMed.receipt.on", true);
        btnAutoClickOn.hide();
        btnAutoClickOff.show();
        intervalId = setInterval(function () {
            var linesWithSyncBtns = jQuery("input[name$='btnSincronizeazaOffline']").closest('tr');
            var linesWithErrors = jQuery("input[name$='imgArrow']").closest('tr');
            var syncBtns = linesWithSyncBtns.not(linesWithErrors).find("input[name$='btnSincronizeazaOffline']");
            if(syncBtns.length == 0) {
                GM_setValue("icMed.receipt.on", false);
            } else {
                syncBtns.first().click();
            }
        }, 8000);
    });
    btnAutoClickOff.click(function (){
        GM_setValue("icMed.receipt.on", false);
        clearInterval(intervalId);
        btnAutoClickOn.show();
        btnAutoClickOff.hide();
        console.log("Automatic clicker stopped.");
    });
    btnAutoClickOff.insertAfter("#ctl11_ctl00_lblTotal").toggle(isAutoClickOn);
    btnAutoClickOn.insertAfter("#ctl11_ctl00_lblTotal").toggle(!isAutoClickOn);
    if(isAutoClickOn){
        btnAutoClickOn.click();
    }
})();
