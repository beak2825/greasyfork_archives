// ==UserScript==
// @name         Rankingi w tabeli członków plemienia
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ściąga i sortuje ranking RA, RO, RW
// @author       You
// @match        https://*.plemiona.pl/*screen=ally*mode=members*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390784/Rankingi%20w%20tabeli%20cz%C5%82onk%C3%B3w%20plemienia.user.js
// @updateURL https://update.greasyfork.org/scripts/390784/Rankingi%20w%20tabeli%20cz%C5%82onk%C3%B3w%20plemienia.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var player;
    var row;
    var pokonani;
    var pozycja;
    var aktualny_wiersz;
    var link;

    $("#content_value").prepend('<button id="RA" class="run">Pokaz RA</button><br><br><button id="RO" class="run">Pokaz RO</button><br><br><button id="RW" class="run">Pokaz RW</button><br><br>');


    $('.run').on('click',function() {
        var rows = $("table.vis tbody tr[class*='row']");

        if ($(".nazwa_rankingu").length == 0) {
            $("table.vis:contains('Funkcje') tbody tr").first().append("<th class='nazwa_rankingu'></th>").append("<th class=''>Pozycja globalna</th>");
            $("table.vis:contains('Funkcje')").addClass('sortable');
            $.each(rows,function(){
                $(this).append("<td class='pokonani'></td><td class='pozycja_globalna'></td>");
            });
        }

        var typ = $(this).attr('id');
        if (typ == 'RA') {link = 'att';}
        if (typ == 'RO') {link = 'def';}
        if (typ == 'RW') {link = 'support';}

        console.log(link);

        $('.nazwa_rankingu').html(typ);
        $.each(rows,function(){
            aktualny_wiersz = $(this);
            player = aktualny_wiersz.find('td').first().find('a').html();
            var ajax = $.ajax({
                type : 'POST',
                url: "https://pl142.plemiona.pl/guest.php?screen=ranking&mode=kill_player&type="+link+"&name="+player,
                dataType: "html",
                async: false
            });
            ajax.done(function(data,status) {
                row = $(data).find("table.vis tr:contains('"+player+"')");
                pokonani = row.find("td").last().html();
                pozycja = row.children(':first').html();
                aktualny_wiersz.find(".pokonani").html(pokonani);
                aktualny_wiersz.find(".pozycja_globalna").html(pozycja);
            });

        });
        var sorted = $('.sortable tbody tr').sort(function(a, b) {
            var fir = $(a).find('td:last').text(), sec = $(b).find('td:last').text();
            return fir.localeCompare(sec, false, {numeric: true})
        })

        $('.sortable tbody').html(sorted);

    });
})();