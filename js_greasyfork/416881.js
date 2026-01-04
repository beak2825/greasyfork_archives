// ==UserScript==
// @name         sumowanie wojska w podgladzie wioski
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php*screen=info_village*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416881/sumowanie%20wojska%20w%20podgladzie%20wioski.user.js
// @updateURL https://update.greasyfork.org/scripts/416881/sumowanie%20wojska%20w%20podgladzie%20wioski.meta.js
// ==/UserScript==

jednostki = {}
game_data.units.forEach((value,index)=>jednostki[value]=0)
rows = $("table:contains('Pochodzenie')").last().find('tr').not('first')
$.each(rows,(index,row)=>{
    columns = $(row).find('td')
    for(i=0;i<columns.length-2;i++) {
        jednostki[game_data.units[i]] = jednostki[game_data.units[i]] + parseInt($(columns[i+1]).text())
    }
})
total_row = `<tr><th><b>TOTAL</b></th>`
$.each(jednostki,(index,jednostka)=>{
    total_row += `<th style="text-align:center">${jednostka}</th>`
})
total_row += `<th></th></tr>`
$(rows[0]).closest('tbody').append(total_row)