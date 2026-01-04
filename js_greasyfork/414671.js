// ==UserScript==
// @name         Cofanie wsparcia od danego gracza
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php?*mode=units&type=support_detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414671/Cofanie%20wsparcia%20od%20danego%20gracza.user.js
// @updateURL https://update.greasyfork.org/scripts/414671/Cofanie%20wsparcia%20od%20danego%20gracza.meta.js
// ==/UserScript==

$("#content_value").prepend(`<div class="bordered-box"><h3>Cofanie wsparcia od gracza</h3>Podaj nick albo jego część - UWAGA, jeśli dwóch lub więcej graczy ma ten sam ciąg znaków w nicku będą brani pod uwage! <input type="text" id="searched"><button class="btn trigger">Zaznacz</button></div>`)

function find_row(searched) {
   var wiersze = $("#units_table").find("tr")
   $.each(wiersze,(index,wiersz)=>{
       if ($(wiersz).text().toUpperCase().indexOf(searched.toUpperCase()) > -1) $(wiersz).find('input.village_checkbox').click()
   })
}

$(document.body).on('click','.trigger',()=>{
    searched = $("#searched").val()
    find_row(searched)
})

