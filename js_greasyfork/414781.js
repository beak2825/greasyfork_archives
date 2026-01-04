// ==UserScript==
// @name         Ilosc wsparcia i atakow w przegladzie wojsk stacjonujacych w wiosce
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php?*screen=overview_villages&mode=units&type=there*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414781/Ilosc%20wsparcia%20i%20atakow%20w%20przegladzie%20wojsk%20stacjonujacych%20w%20wiosce.user.js
// @updateURL https://update.greasyfork.org/scripts/414781/Ilosc%20wsparcia%20i%20atakow%20w%20przegladzie%20wojsk%20stacjonujacych%20w%20wiosce.meta.js
// ==/UserScript==

conso_data = [];
countHeavyAs = 4;

wiersze = $("#units_table").find('tr').not(":first");
pierwszy_wiersz = $("#units_table").find('tr').first().find('th');
pierwszy_wiersz.last().text('Ilość zagród')
$(pierwszy_wiersz[pierwszy_wiersz.length-2]).html(`<img src="https://dspl.innogamescdn.com/asset/da56823b/graphic/unit/att.png" title="Nadchodzące ataki" style="vertical-align: -2px" alt="" class="">`)

$.ajax({
    method:"POST",
    url:'game.php?screen=overview_villages&mode=incomings&type=unignored&subtype=attacks',
    success: response => {
        var incomings_data = $(response).find("#incomings_table").find('tr[class*="row"]');

        $.each(incomings_data,function(index,value) {
            cells = $(value).find('td');
            searched_village = $(cells[1]).text().trim();
            let obj = conso_data.find(village => village.village == searched_village);
            if (!obj) {
                conso_data.push({village:searched_village,count:1});
            } else {obj.count += 1;
                   }
        })
        console.log(conso_data)
        $.each(wiersze,(index,wiersz)=>{
            kolumny = $(wiersz).find('td')
            def = 0
            $.each(kolumny,(kindex,kolumna)=>{
                if (kindex == 2 || kindex == 3 || kindex == 5) def += parseInt($(kolumna).text())
                if (kindex == 9) def += parseInt($(kolumna).text()) * countHeavyAs
            })
            def_a = (def/20000).toFixed(2)
            kolumny.last().find('a').text(def+" ("+def_a+")")
            searchedConso = conso_data.find(wiersz => wiersz.village == kolumny.first().text().trim())
            previousColumn = $(kolumny[kolumny.length-2])
            if (searchedConso) {previousColumn.text(searchedConso.count);previousColumn.removeClass("hidden")}

        })
        sortTable()
    }
})


function sortTable(){
    var rows = $('#units_table tbody  tr').get();

    rows.sort(function(a, b) {

        var A = parseInt($(a).children('td').eq(14).text());
        var B = parseInt($(b).children('td').eq(14).text());

        if(A > B) {
            return -1;
        }

        if(A < B) {
            return 1;
        }

        return 0;

    });
    $('#mytable tbody').remove();
    $.each(rows, function(index, row) {
        $('#units_table').append(row);
    });
}