// ==UserScript==
// @name         Gigrawars Mehr Infos
// @namespace    http://board.gigrawars.de
// @version      1.1
// @description  Zeigt den Namen neben den Koordinaten
// @author       Magnum Mandel (lolofufu@bk.ru)
// @match        http://uni2.gigrawars.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27844/Gigrawars%20Mehr%20Infos.user.js
// @updateURL https://update.greasyfork.org/scripts/27844/Gigrawars%20Mehr%20Infos.meta.js
// ==/UserScript==

    $(document).ready(function () {

    $(".itemOwnFleet > td:contains('Spionage')").each(function(index) {
        $(this).css( "color", "orange" );
    });

    $(".itemOwnFleet > td:contains('Stationierung')").each(function(index) {
        $(this).css( "color", "deepskyblue" );
    });


    $("a[href*=\"/game_player_index\"]").each(function(index) {
        var orig = $(this).attr("original-title");
        if (typeof orig != 'undefined') {
            $(this).append(" (" + orig + ")");
        }
    });

    $(".itemOwnFleet > td > span, .itemComebackFleet > td > span").each(function(index) {
        var orig = $(this).attr("original-title");
        var text = $(this).text();
        if (typeof orig != 'undefined') {
            if (orig.indexOf("Rohstoffe")>-1 && text.indexOf("Stationierung")==-1 && text.indexOf("Transport")==-1) {
                orig = orig.replace('<b>Schiffe</b><br />','<b>').replace('<b>Rohstoffe</b><br />','</b>');
                var pos = orig.indexOf("Eisen") + 5;
                var fe = orig.substring(pos);
                pos = fe.indexOf("<br");
                fe = fe.substring(0,pos);
                fe = fe.replace(".","");
                if(parseInt(fe)>3000) {
                    $(this).css( "color", "yellowgreen" );
                }
            } else {
                orig = orig.replace('<b>Schiffe</b><br />','');
            }

            $(this).html(orig);
        }
    });


});