// ==UserScript==
// @name         Dodatkowe skrypty do praw plemiennych
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php?*&mode=members_troops*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411763/Dodatkowe%20skrypty%20do%20praw%20plemiennych.user.js
// @updateURL https://update.greasyfork.org/scripts/411763/Dodatkowe%20skrypty%20do%20praw%20plemiennych.meta.js
// ==/UserScript==

$("#content_value").prepend("<div><button class='btn' id='rozkazy'>Pokaz tabelkę z rozkazami</button></div><br><div id='additional_content'>")
// <br><div><button class='btn' id='wojsko_w_wiosce'>Ilości wojska w wioskach</button></div><br><br><div><button class='btn' id='mozliwa_kareta'>Mozliwa kareta</button></div></div><hr>
var list_of_allies = [];
var list_of_villages = [];

$(document.body).on("click","#rozkazy",function() {
    table_rows = '';
    list_of_allies_select = $("select[name='player_id']").find("option").not(":first")
    $.each(list_of_allies_select,function(index,element) {
        id = $(element).val()
        name = $(element).text().trim()
        no_rights = $(element).prop('disabled')
        sent_attacks = 0
        if (!no_rights) {
            $.ajax({
                method:'POST',
                url:'game.php?screen=ally&mode=members_troops&player_id='+id,
                async:false,
                success:function(response) {
                    console.log(name)
                    response = $(response).find('table:contains("Wioska")').last().find('tr').not(':first')
                    $.each(response,function(row_index,row) {
                        cells = $(row).find('td')
                        console.log(cells)
                        if ($(cells[cells.length-2]).text().trim() != "?") {
                            sent_attacks += parseInt($(cells[cells.length-2]).text())
                        }
                    })
                }
            })
        }
        list_of_allies.push({id:id,name:name,no_rights:no_rights,sent_attacks:sent_attacks})
        table_rows += `<tr><td>${id}</td><td>${name}</td><td>${sent_attacks}</td></tr>`
    })
    console.log(list_of_allies)

    $("#additional_content").html(`
<table class="table">
<tr><th>ID gracza</th><th>Gracz</th><th>Ilosc wyslanych atakow</th></tr>
${table_rows}
</table>
`)

})

$(document.body).on("click","#wojsko_w_wiosce",function() {
    table_rows = '';
    list_of_allies_select = $("select[name='player_id']").find("option").not(":first")
    $.each(list_of_allies_select,function(index,element) {
        id = $(element).val()
        name = $(element).text().trim()
        no_rights = $(element).prop('disabled')
        sent_attacks = 0
        if (!no_rights) {
            $.ajax({
                method:'POST',
                url:'game.php?screen=ally&mode=members_troops&player_id='+id,
                async:false,
                success:function(response) {
                    //console.log(name)
                    //console.log(response)
                    wszystkie_wojska = $(response).find('table:contains("Wioska")').last().find('tr').not(':first')
                    $.each(wszystkie_wojska,function(index,row) {
                        wiersz = $(row).find('td')
                        list_of_villages.push({id:id,name:name,village:$(wiersz[0]).html()})
                        $.each(game_data.units,function(index,unit) {
                            if (index != game_data.length-1) {
                                n_index = index + 1
                                list_of_villages[list_of_villages.length-1][unit+"_all"] = $(wiersz[n_index]).text()
                            }
                        })
                    })
                    $.ajax({
                        method:'POST',
                        url:'game.php?screen=ally&mode=members_defense&player_id='+id,
                        async:false,
                        success:function(response) {
                            stacjonujace_wojska = $(response).find('table:contains("Wioska")').last().find('tr').not(':first')
                            $.each(wszystkie_wojska,function(index,row) {
                                if (index == 0 ) {n_index = 0} else {n_index = index*2}
                                wiersz_2 = $(stacjonujace_wojska[n_index]).find('td')
                                obj = list_of_villages.find(obj => obj.village == $(wiersz_2[0]).html());
                                $.each(game_data.units,function(index,unit) {
                                    if (index != game_data.length-1) {
                                        n_index = index + 2
                                        obj[unit+"_available"] = $(wiersz_2[n_index]).text()
                                    }
                                })

                            })
                        }
                    })
                }
            })
        }
    })
    units_columns = '';
    $.each(game_data.units,function(index,unit) {
        if (index != game_data.length-1) {
            units_columns += `<th><img src="https://dspl.innogamescdn.com/asset/edd53558/graphic/unit/unit_${unit}.png" class=""></th>`
        }
    })

    $.each(list_of_villages,function(index,village) {
        table_rows += `<tr><td>${village.id}</td><td><a href="https://${game_data.world}.plemiona.pl/game.php?screen=mail&mode=new&player=${village.id}&name=${village.name}" target="_blank">${village.name}</a></td><td>${village.village}</td>`
        $.each(game_data.units,function(index,unit) {
            if (index != game_data.length-1) {
                table_rows += `<td>${village[unit+"_available"]}/${village[unit+"_all"]}</td>`
            }
        })
        table_rows += `</tr>`
    })

    $("#additional_content").html(`
<table class="table vis ">
<tr><th>ID gracza</th><th>Gracz</th><th>Wioska</th>${units_columns}</tr>
${table_rows}
</table>
`)

})

$(document.body).on("click","#mozliwa_kareta",function() {


})
