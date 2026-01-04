// ==UserScript==
// @name         Analiza czlonkow plemienia v2
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Pomaga analizowac dane dostepne dzieki prawom plemiennym
// @author       PTS86
// @match        https://*.plemiona.pl/game.php*screen=ally*mode=members*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396716/Analiza%20czlonkow%20plemienia%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/396716/Analiza%20czlonkow%20plemienia%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

// ==UserScript==
let link1 = `https://${game_data.world}.plemiona.pl${game_data.link_base_pure}ally&mode=members_troops`
let link2 = `https://${game_data.world}.plemiona.pl${game_data.link_base_pure}ally&mode=members_buildings`
let link3 = `https://${game_data.world}.plemiona.pl${game_data.link_base_pure}ally&mode=members_defense`
let promises = [];
let promises2 = [];
let players = [];
let villages = [];

(function() {
    'use strict';

    $("#content_value").prepend('<div><button id="attacks_check">Sprawdzanie ataków</button></div>')
    $("#content_value").prepend('<div id="player_data"></div>')

    let tabelka = $("table.vis")
    for (let i=1;i<tabelka[2].rows.length-1;i++) {
        players.push({player:tabelka[2].rows[i].cells[0].getElementsByTagName('a')[0].textContent,troops:null,buildings:null,defense:null,player_id:null})
    }

    promises.push(
        $.ajax({
            type:'POST',
            url:link1,
            data:'&1',
            dataType: 'html',
            success: function(data,status) {
                let members = $(data).find('select[name="player_id"]').find('option')
                members.each(function() {
                    if ($(this).text().replace('(brak dostępu)','').trim() != 'Wybierz członka') {
                        let searched_player_name = $(this).text().replace('(brak dostępu)','').trim()
                        let player = players.find(x => x.player == searched_player_name)
                        player.troops = !($(this).is(":disabled"))
                        player.player_id = $(this).val()
                    }
                })
            }
        })
    )
    promises.push(
        $.ajax({
            type:'POST',
            url:link2,
            data:'&1',
            dataType: 'html',
            success: function(data,status) {
                let members = $(data).find('select[name="player_id"]').find('option')
                members.each(function() {
                    if ($(this).text().replace('(brak dostępu)','').trim() != 'Wybierz członka') {
                        let searched_player_name = $(this).text().replace('(brak dostępu)','').trim()
                        let player = players.find(x => x.player == searched_player_name)
                        player.buildings = !($(this).is(":disabled"))
                        player.player_id = $(this).val()
                    }
                })
            }
        })
    )
    promises.push(
        $.ajax({
            type:'POST',
            url:link3,
            data:'&1',
            dataType: 'html',
            success: function(data,status) {
                let members = $(data).find('select[name="player_id"]').find('option')
                members.each(function() {
                    if ($(this).text().replace('(brak dostępu)','').trim() != 'Wybierz członka') {
                        let searched_player_name = $(this).text().replace('(brak dostępu)','').trim()
                        let player = players.find(x => x.player == searched_player_name)
                        player.defense = !($(this).is(":disabled"))
                        player.player_id = $(this).val()
                    }
                })
            }
        })
    )
    let wiersz = $("table.vis:eq(2)").find('tr').first()
    wiersz.append('<th>Wojsko</th><th>Budynki</th><th>Obrona</th><th>Pokaż statystyki</th><th>Ataki</th>')

    $.when.apply($,promises).done(function () {
        console.log('All set!')
        console.log(players)
        for (let i=1;i<tabelka[2].rows.length-1;i++) {
            let wiersz = $("table.vis:eq(2)").find('tr:eq('+i+')')
            let nick = wiersz.find("a").first().text()
            let player = players.find(x => x.player == nick)

            wiersz.append(`<td>${get_status(player.troops)}</td><td>${get_status(player.buildings)}</td><td>${get_status(player.defense)}</td><td><input type="button" class="btn player_stats" player_id="${player.player_id}" value="Pokaż">&nbsp;<input type="button" class="btn player_def" player_id="${player.player_id}" value="Obrona"></td><td></td>`)

        }
        $("#player_data_table").addClass('vis')
    })

})
();


$(document.body).on('click','.player_stats',function() {
    let player_name = $(this).closest('tr').find('td').first().find('a[href*=info_player]').text()
    villages = [];
    let player_id = $(this).attr('player_id')
    get_player_data(player_id,player_name)

})

$(document.body).on('click','.player_def',function() {
    let player_name = $(this).closest('tr').find('td').first().find('a[href*=info_player]').text()
    def = [];
    let player_id = $(this).attr('player_id')
    get_player_def(player_id,player_name)
})


function get_status(bool) {
    if (bool == true) {
        return '<b><span style="color:green">OK</span>'
    } else {
        return '<b><span style="color:red">NOK</span>'
    }
}

function get_bad_status(bool) {
    if (bool == false) {
        return '<b><span style="color:red">NOK</span>'
    } else {
        return ''
    }
}



function get_player_data(player_id,player_name) {
    $("#player_data").html('<div><input type="button" class="btn" id="clear_player_villages" value="Zamknij"></div><br><h1>'+player_name+'</h1><br><div id="player_summary"></div><table id="player_data_table" class="vis w100"><tr><td>Here display player data</td></tr></table>')
    let link1_s  = `${link1}&player_id=${player_id}`
    let link2_s  = `${link3}&player_id=${player_id}`
    let html = ''

    promises.push = ($.ajax({
        method:'POST',
        url:link2_s,
        data:'&1',
        dataType: 'html',
        success: function(data,status) {
            let table_1 = $(data).find('table.w100')
            table_1.attr('id','player_data_table')
            html += '<tr>' + `<th style="min-width: 200px">Wioska</th>
            <th></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_spear.png" alt="" class="tooltip" title="Pikinier"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_sword.png" alt="" class="tooltip" title="Miecznik"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_axe.png" alt="" class="tooltip" title="Topornik"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_spy.png" alt="" class="tooltip" title="Zwiadowca"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_light.png" alt="" class="tooltip" title="Lekki kawalerzysta"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_heavy.png" alt="" class="tooltip" title="Ciężki kawalerzysta"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_ram.png" alt="" class="tooltip" title="Taran"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_catapult.png" alt="" class="tooltip" title="Katapulta"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_knight.png" alt="" class="tooltip" title="Rycerz"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_snob.png" alt="" class="tooltip" title="Szlachcic"></th>
                                <th><img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/unit_militia.png" alt="" class="tooltip" title="Chłop"></th>
                                                    <th>
                <img src="https://dspl.innogamescdn.com/asset/f1821a7a/graphic/unit/att.png" alt="" class="tooltip" title="Nadchodzące ataki"></strong>
            </th><th>Mieszane wojska</th><th>Typ wioski</th><th>Rozmiar ofa</th><th>Duży off bez maszyn</th>` + '</tr>'
            //$("#player_data").html(table)
            promises2.push( $.ajax({
                method:'POST',
                url:link1_s,
                data:'&1',
                dataType: 'html',
                success: function(data,status) {
                    let table_2 = $(data).find('table.w100')
                    let table_processing_1 = table_1.find('tr').not(':first')
                    let table_processing_2 = table_2.find('tr').not(':first')


                    for (let i=0;i<table_processing_2.length;i++) {
                        let row_class
                        if (i % 2 == 0) {row_class = 'row_a'} else {row_class = 'row_b'}

                        let columns_html = ''
                        let pierwszy
                        let drugi

                        if (i == 0 ) { pierwszy = 0} else { pierwszy = i*2}
                        if (i == 0 ) { drugi = 1 } else { drugi = i*2+1 }

                        let pierwszy_wiersz = $(table_processing_1[pierwszy]).find('td')
                        let drugi_wiersz = $(table_processing_1[drugi]).find('td')
                        let trzeci_wiersz = $(table_processing_2[i]).find('td')

                        console.log(pierwszy_wiersz)

                        villages.push({wioska_link:$(pierwszy_wiersz[0]).html()})
                        let current_id = villages.length - 1
                        villages[current_id]['nazwa'] = $(trzeci_wiersz[0]).text().replace(/\r?\n|\r/g,'');
                        villages[current_id]['a_pik'] = parseInt($(trzeci_wiersz[1]).text().trim().replace('.',''))
                        villages[current_id]['a_miecz'] = parseInt($(trzeci_wiersz[2]).text().trim().replace('.',''))
                        villages[current_id]['a_topor'] = parseInt($(trzeci_wiersz[3]).text().trim().replace('.',''))
                        villages[current_id]['a_zwiad'] = parseInt($(trzeci_wiersz[4]).text().trim().replace('.',''))
                        villages[current_id]['a_lekka'] = parseInt($(trzeci_wiersz[5]).text().trim().replace('.',''))
                        villages[current_id]['a_ciezka'] = parseInt($(trzeci_wiersz[6]).text().trim().replace('.',''))
                        villages[current_id]['a_taran'] = parseInt($(trzeci_wiersz[7]).text().trim().replace('.',''))
                        villages[current_id]['a_katapulta'] = parseInt($(trzeci_wiersz[8]).text().trim().replace('.',''))
                        villages[current_id]['a_rycerz'] = parseInt($(trzeci_wiersz[9]).text().trim().replace('.',''))
                        villages[current_id]['a_szlachta'] = parseInt($(trzeci_wiersz[10]).text().trim().replace('.',''))

                        villages[current_id]['o_pik'] = parseInt($(pierwszy_wiersz[2]).text().trim().replace('.',''))
                        villages[current_id]['o_miecz'] = parseInt($(pierwszy_wiersz[3]).text().trim().replace('.',''))
                        villages[current_id]['o_ciezka'] = parseInt($(pierwszy_wiersz[7]).text().trim().replace('.',''))

                        villages[current_id]['p_pik'] = parseInt($(drugi_wiersz[1]).text().trim().replace('.',''))
                        villages[current_id]['p_miecz'] = parseInt($(drugi_wiersz[2]).text().trim().replace('.',''))
                        villages[current_id]['p_ciezka'] = parseInt($(drugi_wiersz[6]).text().trim().replace('.',''))


                        let def = 0
                        let off = 0

                        def = villages[current_id].a_pik + villages[current_id].a_miecz + villages[current_id].a_ciezka * 8
                        off = villages[current_id].a_topor + villages[current_id].a_lekka * 4 + villages[current_id].a_taran * 5 + villages[current_id].a_katapulta * 8
                        villages[current_id].def = def
                        villages[current_id].off = off
                        if (def > off) {villages[current_id].typ_wioski = 'DEF'} else {villages[current_id].typ_wioski = 'OFF'}
                        if (def > 1000 && off > 1000) {villages[current_id].mieszaniec = true} else {villages[current_id].mieszaniec = false}
                        if (villages[current_id].typ_wioski == 'OFF' && villages[current_id].a_taran < 300 ) {villages[current_id].brak_maszyn = true} else {villages[current_id].brak_maszyn = false}
                        if (villages[current_id].typ_wioski == 'OFF' && villages[current_id].off >= 19500 ) {villages[current_id].full_off = true} else {villages[current_id].full_off = false}

                        for (let j=0;j<14;j++) {

                            if (j == 0 || j == 13)  {columns_html += '<td rowspan="3">' + $(pierwszy_wiersz[j]).html() + '</td>'}
                            else {columns_html += '<td>' + $(pierwszy_wiersz[j]).html() + '</td>'}

                        }

                        let typ_ofa
                        let bez_maszyn = ''

                        if (villages[current_id].typ_wioski == 'OFF') {
                            if (villages[current_id].off >= 19500) {typ_ofa = 'full'}
                            if (villages[current_id].off < 14500) {typ_ofa = 'mniejszy'}
                            if (villages[current_id].off < 19500 && villages[current_id].off >= 14500) {typ_ofa = '3/4'}
                            if (villages[current_id].off >= 9500 && villages[current_id].a_taran < 150) {bez_maszyn = '<b><span style="color:red">NOK</span>'}
                        }


                        columns_html += '<td rowspan="3">' + get_bad_status(!villages[current_id].mieszaniec) + '</td>'
                        columns_html += '<td rowspan="3">' + villages[current_id].typ_wioski + '</td>'

                        if (villages[current_id].typ_wioski == 'OFF') {
                            columns_html += '<td rowspan="3">' + typ_ofa + '</td>'
                            columns_html += '<td rowspan="3">' + bez_maszyn + '</td>'

                        }
                        else {
                            columns_html += '<td rowspan="3"></td>'
                            columns_html += '<td rowspan="3"></td>'
                        }

                        html += '<tr class="'+row_class+'">' + columns_html + '</tr>';
                        columns_html = ''
                        for (let j=0;j<12;j++) {
                            columns_html += '<td>' + $(drugi_wiersz[j]).html() + '</td>'
                        }
                        html += '<tr class="'+row_class+'">' + columns_html + '</tr>'

                        columns_html = ''

                        for (let j=1;j<12;j++) {

                            columns_html += '<td><b>' + $(trzeci_wiersz[j]).html() + '</b></td>'
                        }

                        html += '<tr class="'+row_class+'"><td><b>wszystkie</b></td>' + columns_html + '</tr>'
                    }

                    $("#player_data_table").html(html)

                    let ilosc_off = 0
                    let ilosc_def = 0
                    let ilosc_mieszanych = 0
                    let ilosc_ofow_bez_maszyn = 0
                    let ilosc_full_ofow = 0
                    let ilosc_3_4_off = 0
                    $.each(villages,function(index,object) {
                         if (object.typ_wioski == 'OFF') {ilosc_off += 1}
                         if (object.typ_wioski == 'DEF') {ilosc_def += 1}
                         if (object.typ_wioski == 'OFF' && object.full_off == true) {ilosc_full_ofow += 1}
                         if (object.typ_wioski == 'OFF' && object.off < 19500 && object.off > 14500) {ilosc_3_4_off += 1}
                    })

                    let summary_html = `
                        <br>
                        Ilość wiosek off: ${ilosc_off}<br>
                        Ilość full off: ${ilosc_full_ofow}<br>
                        Ilość 3/4 off: ${ilosc_3_4_off}<br>
                        <br>
                        Ilość wiosek def: ${ilosc_def}<br>
                        <br>
                        <div><button id="export_table_for_def_analysis">Export for def analysis</button></div>
                    `

                    $("#player_summary").html(summary_html)
                    console.log(villages)
                }
            }))

        }}))



}

$(document.body).on('click','#clear_player_villages',function() {
    $("#player_data").html('')
})


$(document.body).on('click','#export_table_for_def_analysis',function() {
    html = '<table><tr><th>Wioska</th><th>Piki</th><th>Miecze</th><th>CK</th></tr>'
    $.each(villages,function(index,object) {
        html += `<tr><td>${object.nazwa}</td><td>${object.o_pik+object.p_pik}</td><td>${object.o_miecz+object.p_miecz}</td><td>${object.o_ciezka+object.p_ciezka}</td></tr>`
    })
    html += '</table>'
    $("#player_data").html(html)
})

function get_player_def(player_id,player_name) {
    $("#player_data").html('<div><input type="button" class="btn" id="clear_player_villages" value="Zamknij"></div><br><h1>'+player_name+'</h1><br><div id="player_summary"></div><table id="player_data_table" class="vis w100"><tr><td>Here display player data</td></tr></table>')
    let link1_s  = `${link1}&player_id=${player_id}`
    let link2_s  = `${link3}&player_id=${player_id}`
    let max_table_length = game_data.units.length + 3;
    let spear_index = game_data.units.indexOf('spear')
    let sword_index = game_data.units.indexOf('sword')
    let archer_index = game_data.units.indexOf('archer')
    let heavy_index = game_data.units.indexOf('heavy')
    let html = '<br><table class="table-responsive"><tr><th>Wioska</th><th>Ataki</th><th>Piki</th><th>Miecze</th>'
    if (archer_index > -1) {html += '<th>Łuki</th>'}
    html += '<th>Ciężka</th><th>Total def</th></tr>'
    console.log(link1_s)
    console.log(link2_s)
    def_villages = []
    $.ajax({
        method:'GET',
        url:link2_s,
        success: function(data) {
            def_data = $(data)
            table = def_data.find('.table-responsive tr:not(:contains("Wioska"))')
            for (i=1;i<table.length;i++) {
                row = $(table[i-1]).find('td')
                if (row.length == max_table_length) {
                    calculated_attacks = parseInt($(row[max_table_length-1]).text().replace('.',''))
                    calculated_spear = parseInt($(row[spear_index+2]).text().replace('.',''))
                    calculated_sword = parseInt($(row[sword_index+2]).text().replace('.',''))
                    calculated_heavy = parseInt($(row[heavy_index+2]).text().replace('.',''))
                    if (archer_index > -1) {calculated_archer = parseInt($(row[archer_index+2]).text().replace('.',''))} else {calculated_archer = 0}
                    def_villages.push(
                        {village:$(row[0]).html(),
                         attacks:calculated_attacks,
                         spear:calculated_spear,
                         sword:calculated_sword,
                         heavy:calculated_heavy,
                         archer:calculated_archer}
                    )
                } else {
                    calculated_spear = parseInt($(row[spear_index+1]).text().replace('.',''))
                    calculated_sword = parseInt($(row[sword_index+1]).text().replace('.',''))
                    calculated_heavy = parseInt($(row[heavy_index+1]).text().replace('.',''))
                    if (archer_index > -1) {calculated_archer = parseInt($(row[archer_index+1]).text().replace('.',''))} else {calculated_archer = 0}
                    def_villages[def_villages.length-1].spear += calculated_spear
                    def_villages[def_villages.length-1].sword += calculated_sword
                    def_villages[def_villages.length-1].heavy += calculated_heavy
                    def_villages[def_villages.length-1].archer += calculated_archer
                }
            }
            def_villages.sort(compareValues('attacks','desc'))
            $.each(def_villages,function(index,village) {
                village.total_def = village.spear + village.sword + village.archer + village.heavy*6
                html += `<tr><td>${village.village}</td><td>${village.attacks}</td><td>${village.spear}</td><td>${village.sword}</td>`
                if (archer_index > -1) {html += `<td>${village.archer}</td>`}
                html += `<td>${village.heavy}</td><td>${village.total_def}</td></tr>`
            })
            html += '</table>'
            $("#player_data_table").html(html)
        }
    })

}

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

// analiza ile kto ma ataków
$(document.body).on('click','#attacks_check',function() {

    members = $("table:contains('Ranking globalny')").find("a[href*='info_player&id=']:not([title])")
    id = 1
    $.each(members,function(index,element) {
        link = $(element).attr('href')
        player_id = link.substring(link.search("&id=")+4,link.length)

        $.ajax({
            method:'POST',
            url:`https://${game_data.world}.plemiona.pl/game.php?screen=ally&mode=members_defense&player_id=${player_id}`,
            async:false,
            success: function(response) {

                attacks = $(response).find("table.w100 th").last().text().trim().replace('(','').replace(')','')
                console.log(link + " " + player_id + " " + attacks)
                if (attacks == '0') {
                    $(element).closest('tr').find('td').last().html(attacks)
                } else {
                    $(element).closest('tr').find('td').last().html(`<b><a style="color:red;" target="_blank" href="https://${game_data.world}.plemiona.pl/game.php?screen=ally&mode=members_defense&player_id=${player_id}">${attacks}</a></b>`)
                }
            }
        })
    })
    window.Dialog.close()

    //window.Dialog.show('test','Downloading data... ')
})


async function showDialog(id,length) {
    window.Dialog.show('test',`Downloading data... ${id}/${length}`)
}