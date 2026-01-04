// ==UserScript==
// @name         UONET
// @version      0.1.4
// @namespace    UONET
// @description  Taki fajny 
// @author       Glowczynski
// @include      https://uonetplus-opiekun.vulcan.net.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41016/UONET.user.js
// @updateURL https://update.greasyfork.org/scripts/41016/UONET.meta.js
// ==/UserScript==




(function() {
    'use strict';

    function makeNewColumn() {
        var Column = $(".ocenyZwykle-table").find("thead").eq(0).find("tr").eq(0).append("<th>Srednia wazona</th>");
        var rows = $(".ocenyZwykle-table").find("tbody").eq(0).find("tr");
        rows.each(function(e) {
           $(this).append("<td></td>"); 
        });
    }
    
    function calculateAVG() {
        var rows = $(".ocenyZwykle-table").find("tbody").eq(0).find("tr");
        rows.each(function(e) {
            var obj = $(this);
            var rates = [];
            var avg = 0;
            var rate = $(this).find("td").eq(1);
            rate.each(function(event) {
               //$(this).find("span").each(function() {console.log($(this).html())})
                $(this).find("span").each(function() {
                    var alt = $(this).attr("alt");
                    let waga = ""+alt[alt.indexOf("Waga:") + 6]+alt[alt.indexOf("Waga:") + 7]+alt[alt.indexOf("Waga:") + 8]+alt[alt.indexOf("Waga:") + 9];
                    rates.push([$(this).html(), parseFloat(waga)]);
                });
            });
            
            var iloscOcen = 0;
            for(var x = 0; x < rates.length; x++) {
                var ocena = "";
                if(isNaN(parseInt(rates[x][0])) == false) {
                    if(rates[x][0][rates[x][0].length - 1] == "+") {
                        ocena = parseFloat(rates[x][0].slice(0, rates[x][0].length - 1) + ".25");
                    }
                    else if(rates[x][0][rates[x][0].length - 1] == "-") {
                        let b = parseFloat(rates[x][0].slice(0, rates[x][0].length - 1));
                        ocena = b-0.25;
                    }
                    else {
                        ocena = parseInt(rates[x][0]);
                    }
                    avg = avg + (ocena * rates[x][1]);
                    iloscOcen = iloscOcen+rates[x][1];
                }
            }
            avg = avg / iloscOcen;
            if(isNaN(avg) == false) {
                obj.find("td").eq(4).html(avg.toFixed(2));
            }
        })
        
    }
    
    makeNewColumn();
    calculateAVG();
})();