// ==UserScript==
// @name         Get village info
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Displays information from tribe rights - buildings, units in village and belonging to it.
// @author       You
// @match        https://*.plemiona.pl/game.php*village=*screen=info_village*id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398834/Get%20village%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/398834/Get%20village%20info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
})();

$(document).ready(function() {
    $("#content_value").prepend('<div><button class="btn" id="get_info">Pokaż informacje o wiosce</button></div><div id="village_info_buildings"></div><div id="village_info_units"></div>')
})

$(document.body).on('click','#get_info',function() {
    $('#get_info').remove()
    $.ajax({
        method:"POST",
        async:false,
        url:"https://"+game_data.world+".plemiona.pl/game.php?screen=ally&mode=members_buildings&player_id="+VillageInfo.player_id,
        success: function(response) {
            buildings_data = $(response).find('a[href*="&id='+VillageInfo.village_id+'"]').closest('tr').find('td')
            buildings_data_properties = Object.keys(game_data.village.buildings)
            buildings_data_completed = []
            for (i=0;i<buildings_data_properties.length;i++) {
                buildings_data_completed.push($(buildings_data[2+i]).text().trim())
            }
            html_buildings = `<table class="table vis" width="100%"><tr><th colspan="${buildings_data_properties.length}" style="font-size:18px;">Budynki</th></tr>`
            html_buildings += `<tr>`
            $.each(buildings_data_properties,function(index,value) {
                html_buildings += `<th><img src="https://dspl.innogamescdn.com/asset/b8e610d/graphic/buildings/${value}.png"></th>`
            })
            html_buildings += `</tr>`
            html_buildings += `<tr>`
            $.each(buildings_data_completed,function(index,value) {
                html_buildings += `<td>${value}</td>`
            })
            html_buildings += `</tr>`
            html_buildings += '</table>'
        }
    })
    $.ajax({
        method:"POST",
        async:false,
        url:"https://"+game_data.world+".plemiona.pl/game.php?screen=ally&mode=members_troops&player_id="+VillageInfo.player_id,
        success: function(response) {
            troops_data = $(response).find('a[href*="&id='+VillageInfo.village_id+'"]').closest('tr').find('td')
            troops_data_completed = []
            for (i=0;i<game_data.units.length+2;i++) {
                troops_data_completed.push($(troops_data[1+i]).text().trim())
            }
        }
    })
    $.ajax({
        method:"POST",
        async:false,
        url:"https://"+game_data.world+".plemiona.pl/game.php?screen=ally&mode=members_defense&player_id="+VillageInfo.player_id,
        success: function(response) {
            def_in_data = $(response).find('a[href*="&id='+VillageInfo.village_id+'"]').closest('tr')
            def_incoming_data = def_in_data.next()
            def_in_data = def_in_data.find('td')
            def_incoming_data = def_incoming_data.find('td')
            def_in_data_completed = []
            for (i=0;i<game_data.units.length;i++) {
                def_in_data_completed.push($(def_in_data[2+i]).text().trim())
            }
            def_incoming_data_completed = []
            for (i=0;i<game_data.units.length;i++) {
                def_incoming_data_completed.push($(def_incoming_data[1+i]).text().trim())
            }
            html_units = `<table class="table vis" width="100%"><tr><th colspan="${game_data.units.length+3}" style="font-size:18px;">Wojsko</th></tr>`
            html_units += `<tr><th>Info</th>`
            $.each(game_data.units,function(index,value) {
                html_units += `<th><img src="https://dspl.innogamescdn.com/asset/b8e610d/graphic/unit/unit_${value}.png"></th>`
            })
            html_units += `<th><img src="https://dspl.innogamescdn.com/asset/b8e610d/graphic/icons/commands_outgoing.png"></th>`
            html_units += `<th><img src="https://dspl.innogamescdn.com/asset/b8e610d/graphic/unit/att.png"></th>`
            html_units += `</tr><tr><td>Należące do wioski</td>`
            $.each(troops_data_completed,function(index,value) {
                if (index == (troops_data_completed.length-1) || index == (troops_data_completed.length-2)) {rowspan = ' rowspan="3"'} else {rowspan = ''}
                html_units += `<td${rowspan}>${value}</td>`
            })
            html_units += '</tr>'
            html_units += '<tr><td>Stacjonujące</td>'
            $.each(def_in_data_completed,function(index,value) {
                html_units += `<td>${value}</td>`
            })
            html_units += '</tr>'
            html_units += '<tr><td>Przybywające</td>'
            $.each(def_incoming_data_completed,function(index,value) {
                html_units += `<td>${value}</td>`
            })
            html_units += '</tr>'
            html_units += '</table>'
        }
    })
    $("#village_info_buildings").html(html_buildings)
    $("#village_info_units").html(html_units)
})