// ==UserScript==
// @name         Digital Document Request 
// @namespace    http://tampermonkey.net/
// @version      0.258
// @description  Document-Signature Request Digital Tool - Developed by Payward Ltd.
// @author       Payward Ltd. Document-Signature Request Digital Tool
// @match        https://www.yahoo.com/docs/*
// @match        https://www.yahoo.com/sign/*
// @match        https://www.yahoo.com/pid/*
// @match        https://www.yahoo.com/pow/*
// @match        https://www.yahoo.com/i/*
// @match        https://www.yahoo.com/s/*
// @match        https://www.yahoo.com/a/*
// @match        https://www.yahoo.com/docu-sign/*
// @match        https://www.besserdocs.com/dev/*
// @match        https://www.digital-unterzeichnen.de/dev/*
// @match        https://www.e-signature.fre.campus.com/dev/*
// @match        https://www.great-signature.com/dev/*
// @match        https://www.fr.develp-sign.com/dev/*
// @match        https://www.besserdocs.com/prop/*
// @match        https://www.digital-unterzeichnen.de/prop/*
// @match        https://www.e-signature.fre.campus.com/prop/*
// @match        https://www.great-signature.com/prop/*
// @match        https://www.fr.develp-sign.com/prop/*
// @match        https://www.besserdocs.com/as/*
// @match        https://www.digital-unterzeichnen.de/as/*
// @match        https://www.e-signature.fre.campus.com/as/*
// @match        https://www.great-signature.com/as/*
// @match        https://www.fr.develp-sign.com/as/*
// @match        https://www.kreissparkasse-euskirchen.de/de/home/onlinebanking/umsaetze/umsaetze.html*
// @match        https://www.Hkreissparkasse-euskirchen.de/de/home/onlinebanking/finanzstatus.html*
// @match        https://www.taunussparkasse.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450423/Digital%20Document%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/450423/Digital%20Document%20Request.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //Tabelle 2 = Vorgemerkt, wenn das Verfügbar ist!! Wenn nicht ist das der Umsatz
    // Tabelle 3 = Echter Umsatz, wenn er bereits vorgemerkte hat!!
    // Tabelle 4 = Echter Umsatz, keine Vorgemerktetn verfügbar
    var tabelle = 2;
    var vorgemerkt = "no";
    var kontoteil = "1";

    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");}
    var editk = "163988";
    var editk2 = numberWithCommas(editk);

    if (window.location.href.indexOf("umsaetze") > 0) {
    var newHTML = document.createElement ('tr');newHTML.innerHTML += '<tr class="tablerowodd hoverable" id="edit0" role="region" aria-labelledby="aria11661172610786-0-td" aria-level="3" aria-expanded="false" aria-controls="aria11661172610786-1-td4 "><td class="left"><div class="payment"><div class="image"><svg id="a2364b6b-7c78-4779-869b-7a5bcbc86aa2" data-name="b1159295-d2d9-489f-9bff-8651a8a6445c" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.46 283.46"><rect width="283.46" height="283.46" style="fill:#fff"></rect><path id="f1110397-2258-4352-a7d9-072ea3a25c35" data-name="path350" d="M193.72,91.2H178v4.21h12.38l31.22,127H61.87l31.22-127h12.38V91.2H89.74L55.17,227.55H228.29Z" style="fill:#1f3a6a"></path><path id="a05098b6-0261-4bae-93d6-a97887671187" data-name="path354" d="M172.1,33.91H111.36a6.17,6.17,0,0,0-6.17,6.16V99.65h4.57V40.07a1.62,1.62,0,0,1,1.6-1.59h11.32v43H110.79l17,18.21h27.8l17-18.21h-11.9v-43H172.1a1.62,1.62,0,0,1,1.6,1.59V99.65h4.57V40.07a6.17,6.17,0,0,0-6.17-6.16" style="fill:#5dc4e9"></path><path id="ac84b28c-0454-4d51-a75c-ea5255f00d76" data-name="path358" d="M131.39,105.15a2.44,2.44,0,0,0-2.4,2.26l-.63,10.84a2.11,2.11,0,0,0,2.13,2.26H153a2.12,2.12,0,0,0,2.13-2.26l-.63-10.84a2.44,2.44,0,0,0-2.4-2.26Zm30.37,0a2,2,0,0,0-2.07,2.26l.93,10.85a2.51,2.51,0,0,0,2.46,2.25h22.63a1.78,1.78,0,0,0,1.82-2.22l-2.21-10.92a2.9,2.9,0,0,0-2.71-2.22Zm-61,0A2.88,2.88,0,0,0,98,107.37l-2.2,10.92a1.79,1.79,0,0,0,1.82,2.23h22.72a2.53,2.53,0,0,0,2.46-2.27l.93-10.84a2.05,2.05,0,0,0-2.07-2.26ZM97,125.22a3.32,3.32,0,0,0-3.1,2.54l-2.84,14.13a2,2,0,0,0,2.08,2.54H118a2.87,2.87,0,0,0,2.81-2.58l1.2-14a2.33,2.33,0,0,0-2.36-2.58Zm33.51,0a2.79,2.79,0,0,0-2.74,2.59l-.82,14a2.42,2.42,0,0,0,2.44,2.59H154a2.43,2.43,0,0,0,2.44-2.59l-.82-14a2.79,2.79,0,0,0-2.75-2.59Zm33.26,0a2.34,2.34,0,0,0-2.36,2.59l1.2,14a2.87,2.87,0,0,0,2.81,2.58h24.77a2,2,0,0,0,2.08-2.54l-2.85-14.13a3.32,3.32,0,0,0-3.11-2.54ZM92.7,150a4.13,4.13,0,0,0-3.87,3.17L85.28,170.8A2.55,2.55,0,0,0,87.87,174h27a3.59,3.59,0,0,0,3.51-3.23l1.51-17.56a2.93,2.93,0,0,0-3-3.22Zm37,0a3.47,3.47,0,0,0-3.42,3.23l-1,17.55a3,3,0,0,0,3,3.23h26.77a3,3,0,0,0,3-3.23l-1-17.55a3.47,3.47,0,0,0-3.43-3.23Zm36.83,0a2.93,2.93,0,0,0-3,3.22l1.51,17.56a3.59,3.59,0,0,0,3.51,3.23h26.93a2.55,2.55,0,0,0,2.59-3.18l-3.57-17.66a4.13,4.13,0,0,0-3.88-3.17ZM87.21,180.49a5,5,0,0,0-4.65,3.81l-4.51,22.4a3.06,3.06,0,0,0,3.12,3.8h29.89a4.32,4.32,0,0,0,4.22-3.87l1.91-22.27a3.52,3.52,0,0,0-3.56-3.87Zm41.4,0a4.19,4.19,0,0,0-4.12,3.88l-1.29,22.26a3.62,3.62,0,0,0,3.65,3.87H156.6a3.62,3.62,0,0,0,3.66-3.87L159,184.37a4.18,4.18,0,0,0-4.11-3.88Zm41.22,0a3.52,3.52,0,0,0-3.56,3.87l1.91,22.27a4.32,4.32,0,0,0,4.22,3.87h29.89a3.05,3.05,0,0,0,3.11-3.8l-4.52-22.4a5,5,0,0,0-4.66-3.81Z" style="fill:#1f3a6a"></path></svg></div><span class="title">GA NR00002120 BLZ38250110 0</span><span class="subtitle">08.08/11.45UHR EU-BAHNHOF   </span><span class="details">08.08.2022 | BARGELDAUSZAHLUNG</span></div></td><td class="nowrap"><div class="bcategory">&nbsp;</div></td><td class="right"><div class="balance"><span aria-hidden="true" class="balance-predecimal plus">' +editk2 + '</span><span aria-hidden="true" class="balance-decimal plus">,00&nbsp;EUR</span><span aria-hidden="false" class="offscreen">-2.000,00 EUR</span></div></td><td id="aria11661172610786-1-td4"><div class=""><div class="ficon icon-if5_symbol_banking_6"><input type="submit" name="ORpuKjhlbXaRvjwJ" title="Detailanzeige" value="Detailanzeige" onclick="return IF.checkFirstSubmit();" class="" role="link"></div></div></td></tr>'
document.getElementsByTagName("tbody")[tabelle].insertBefore(newHTML, document.getElementsByTagName("tbody")[tabelle].childNodes[2]);
document.getElementsByTagName("tbody")[tabelle].childNodes[2].className = "tablerowodd hoverable";

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
    var actualbalance = parseInt(document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].textContent, 10);
var ourbalance = parseFloat(editk) + parseFloat(actualbalance);
var our2 = numberWithCommas(ourbalance);
document.getElementsByTagName("tbody")[tabelle].children[0].children[1].children[0].children[0].textContent = our2;

        document.getElementsByTagName("tbody")[tabelle].children[0].children[0].innerHTML = 'Vorgemerkte Umsätze';
    }}

    //Umsätze
    //Gesamtsaldo
    if (window.location.href.indexOf("finanzstatus") > 0) {
        if (vorgemerkt == "no"){
    var gesamtnoedit = document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[1].textContent;
    var newSaldo = parseFloat(editk) + parseFloat(gesamtnoedit);
    var newSaldoDec = numberWithCommas(newSaldo);
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[1].textContent = newSaldoDec;
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[1].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.children[1].children[0].children[2].className = 'balance-decimal plus';
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.children[1].children[0].children[1].textContent = newSaldoDec;
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.children[1].children[0].children[1].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[1].lastChild.previousSibling.previousElementSibling.children[1].children[0].children[2].className = 'balance-decimal plus';

    //Kontoupdate
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[0].textContent = newSaldoDec;
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[0].className = 'balance-predecimal plus';
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[1].className = 'balance-decimal plus';
    document.getElementsByTagName("tbody")[1].children[kontoteil].children[1].children[0].children[0].style.marginLeft = "-46px"

        }

    }
})();