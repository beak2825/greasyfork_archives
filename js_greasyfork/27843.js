// ==UserScript==
// @name         Gigrawars Warteschlange Ressourcen
// @namespace    http://board.gigrawars.de
// @version      1.0
// @description  Zeigt die Resourcen an, die in der Warteschlage liegen
// @author       Magnum Mandel (lolofufu@bk.ru)
// @match        http://uni2.gigrawars.de/game_ship_index/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27843/Gigrawars%20Warteschlange%20Ressourcen.user.js
// @updateURL https://update.greasyfork.org/scripts/27843/Gigrawars%20Warteschlange%20Ressourcen.meta.js
// ==/UserScript==

      $(document).ready(function () {
    
    var kostenFe = new Array();
    kostenFe["Schakal"] = 250;
    kostenFe["Recycler"] = 850;
    kostenFe["Spionagesonde"] = 0;
    kostenFe["Renegade"] = 1000;
    kostenFe["Raider"] = 500;
    kostenFe["Falcon"] = 0;
    kostenFe["Kolonisationsschiff"] = 10000;
    kostenFe["Tjuger"] = 2000;
    kostenFe["Cougar"] = 4000;
    kostenFe["Longeagle V"] = 50000;
    kostenFe["Kleines Handelsschiff"] = 2000;
    kostenFe["Großes Handelsschiff"] = 8000;
    kostenFe["Noah"] = 0;
    kostenFe["Longeagle X"] = 0;
    
    var kostenLut = new Array();
    kostenLut["Schakal"] = 0;
    kostenLut["Recycler"] = 850;
    kostenLut["Spionagesonde"] = 150;
    kostenLut["Renegade"] = 0;
    kostenLut["Raider"] = 500;
    kostenLut["Falcon"] = 2000;
    kostenLut["Kolonisationsschiff"] = 15000;
    kostenLut["Tjuger"] = 2000;
    kostenLut["Cougar"] = 5000;
    kostenLut["Longeagle V"] = 5000;
    kostenLut["Kleines Handelsschiff"] = 2000;
    kostenLut["Großes Handelsschiff"] = 2000;
    kostenLut["Noah"] = 50000;
    kostenLut["Longeagle X"] = 250000;
    
    var kostenH2 = new Array();
    kostenH2["Schakal"] = 75;
    kostenH2["Recycler"] = 0;
    kostenH2["Spionagesonde"] = 0;
    kostenH2["Renegade"] = 0;
    kostenH2["Raider"] = 0;
    kostenH2["Falcon"] = 0;
    kostenH2["Kolonisationsschiff"] = 15000;
    kostenH2["Tjuger"] = 0;
    kostenH2["Cougar"] = 0;
    kostenH2["Longeagle V"] = 0;
    kostenH2["Kleines Handelsschiff"] = 0;
    kostenH2["Großes Handelsschiff"] = 5000;
    kostenH2["Noah"] = 0;
    kostenH2["Longeagle X"] = 0;
    
     var kostenH2o = new Array();
    kostenH2o["Schakal"] = 0;
    kostenH2o["Recycler"] = 100;
    kostenH2o["Spionagesonde"] = 0;
    kostenH2o["Renegade"] = 0;
    kostenH2o["Raider"] = 0;
    kostenH2o["Falcon"] = 0;
    kostenH2o["Kolonisationsschiff"] = 1000;
    kostenH2o["Tjuger"] = 0;
    kostenH2o["Cougar"] = 0;
    kostenH2o["Longeagle V"] = 0;
    kostenH2o["Kleines Handelsschiff"] = 0;
    kostenH2o["Großes Handelsschiff"] = 0;
    kostenH2o["Noah"] = 2000;
    kostenH2o["Longeagle X"] = 25000;
    
    var gesamtFe = 0;
    var gesamtLut = 0;
    var gesamtH2 = 0;
    var gesamtH2o = 0;
    
    $("table").eq(1).find("tr").each(function(index) {
        var shipName = $(this).find("td").eq(1).text();
        if (shipName != null && shipName != "") {
            var anz = $(this).find("td").eq(2).text().replace(".","");
            
            gesamtFe += parseInt(anz) * kostenFe[shipName];
            gesamtLut += parseInt(anz) * kostenLut[shipName];
            gesamtH2 += parseInt(anz) * kostenH2[shipName];
            gesamtH2o += parseInt(anz) * kostenH2o[shipName];
            
            var text = "F " + (parseInt(anz) * kostenFe[shipName]) + "<br>L " + (parseInt(anz) * kostenLut[shipName])
            + "<br>W " + (parseInt(anz) * kostenH2o[shipName]) + "<br>H2 " + (parseInt(anz) * kostenH2[shipName]); 
            //$(this).find("td").eq(0).html(text);
        }
    });
    var gesText = "<b>Gesamt</b> Eisen: " + gesamtFe + " Lutinum: " + gesamtLut + " Wasser: " + gesamtH2o + " Wasserstoff: " + gesamtH2;
    $("table").eq(1).find("tr").eq($("table").eq(1).find("tr").size()-1).find("td").eq(0).append("<p>" + gesText + "</p>");

});