// ==UserScript==
// @name         ceneo
// @namespace    https://www.ceneo.pl/
// @version      0.1
// @description  Ceneo sortowane po cenie
// @author       Janis Blatsios
// @match        https://www.ceneo.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32867/ceneo.user.js
// @updateURL https://update.greasyfork.org/scripts/32867/ceneo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var kategorie = new RegExp("https:\/\/www\.ceneo\.pl\/([A-Za-z_:\/]+)");
    var sort = new RegExp(".+[0-9]{4}-(0|1)\.htm$");
    var produkt = new RegExp("https:\/\/www\.ceneo\.pl\/([0-9]+)");
    var dlugiAdres = new RegExp("https:\/\/www\.ceneo\.pl\/([0-9]+)(#.+)");

    var adres = window.location.href;
    var czyKategorie = kategorie.test(adres);
    var czyPosortowane = sort.test(adres);
    var czyStrona = produkt.test(adres);
    var czyDlugiAdres = dlugiAdres.test(adres);
    if (czyKategorie){
        if(!czyPosortowane) {
            window.location.replace(adres+";0112-0.htm");
        }
    }
    if (czyStrona){
        if(czyDlugiAdres){
         adres=adres.replace(/#.+/i,"");   
        }
        if(!czyPosortowane) {
            window.location.replace(adres+";0280-0.htm");
        }
    }
})();