// ==UserScript==
// @name         Produckja Extended
// @namespace    https://plemiona.pl/
// @version      0.2
// @description  Rozbudowane przegląd produkcji
// @author       xYahiko
// @match        *.plemiona.pl/game.php?village=*&screen=overview_villages*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/371105/Produckja%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/371105/Produckja%20Extended.meta.js
// ==/UserScript==
function timecolor(czas){
    var color = "black";
    var time = czas.split(":");
    var currdate = new Date();
    var finishdate = new Date();
    finishdate.setHours(time[0]);
    finishdate.setMinutes(time[1]);
    var ONE_HOUR = 60 * 60 * 1000;
    if((finishdate - currdate ) < ONE_HOUR)
        color = "red;font-weight: bold;";
    if (ONE_HOUR < (finishdate - currdate ) && (finishdate - currdate ) < (ONE_HOUR*3))
        color = "#A67D3D;font-weight: bold;";
    
    return color;
}
(function() {
    'use strict';


    var listaWiosek =  $("tbody tr td span.quickedit-vn");
    var idWiosek = new Array();
    $.each(listaWiosek,function( key, value ) {
        //alert( key + ": " + value );
        idWiosek.push($(listaWiosek[key]).attr("data-id"));
    });
    $.each(idWiosek,function( key, value ) {
        var cos =  $("ul#unit_order_"+value+" li img");
        if(cos.length != 0){
            
            var stajnia = false;
            var stajniaczas;
            var koszary = false;
            var koszaryczas;
            var warsztat = false;
            var warsztatczas;
            var stajniakolor = "black";
            var koszarykolor = "black";
            var warsztatkolor = "black";
            var czas;
            for(var i = (cos.length - 1);i>=0;i--){
                
                var str = $(cos[i]).attr("title");
                var res = str.split("-");
                
                if(stajnia == false){
                    if(res[1] == " Zwiadowca " || res[1] == " Lekki kawalerzysta " || res[1] == " Łucznik na koniu " || res[1] == " Ciężki kawalerzysta "){
                        stajniaczas = res[2];
                        czas = stajniaczas.split(" ");
                        if(czas[1] == "dnia"){

                            stajniaczas = czas[2] + " " + czas[4];

                        }else if(czas[1] == "dzisiaj"){

                                 stajniakolor = timecolor(czas[3]);
                                 }
                        stajnia = true;
                    }
                }
                if(koszary == false){
                    if(res[1] == " Pikinier " || res[1] == " Miecznik " || res[1] == " Topornik " || res[1] == " Łucznik "){
                        koszaryczas = res[2];
                        czas = koszaryczas.split(" ");
                        if(czas[1] == "dnia"){

                            koszaryczas = czas[2] + " " + czas[4];

                        }else if(czas[1] == "dzisiaj"){

                                 koszarykolor = timecolor(czas[3]);
                                 }
                        koszary = true;
                    }
                }
                if(warsztat == false){
                    if(res[1] == " Taran " || res[1] == " Katapulta "){
                        warsztatczas = res[2];
                         czas = warsztatczas.split(" ");
                        if(czas[1] == "dnia"){

                            warsztatczas = czas[2] + " " + czas[4];

                        }else if(czas[1] == "dzisiaj"){

                                 warsztatkolor = timecolor(czas[3]);
                                 }
                        warsztat = true;
                    }
                }
            }
                if(warsztat == true)
                    $("ul#unit_order_"+value).prepend("<p style='margin:0;color:"+warsztatkolor+"'>W: "+warsztatczas+"</p>");
                if(stajnia == true)
                    $("ul#unit_order_"+value).prepend("<p style='margin:0;color:"+stajniakolor+"'>S: "+stajniaczas+"</p>");
                if(koszary == true)
                    $("ul#unit_order_"+value).prepend("<p style='margin:0;color:"+koszarykolor+"'>K: "+koszaryczas+"</p>");

        }
    });

})();