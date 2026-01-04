// ==UserScript==
// @name         Wywal grube
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://pl142.plemiona.pl/game.php*screen=place*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399775/Wywal%20grube.user.js
// @updateURL https://update.greasyfork.org/scripts/399775/Wywal%20grube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();


var available_units = {}
var input_units = [0,0,0,0,0,0,0,0,0,0]
$(document).ready(function() {
    var group_villages = $($("#group_table tbody")[1]).find('tr').length
    available_units = {
        spear:parseInt($(".units-entry-all[data-unit='spear']").text().trim().replace(')','').replace('(','')),
        sword:parseInt($(".units-entry-all[data-unit='sword']").text().trim().replace(')','').replace('(','')),
        axe:parseInt($(".units-entry-all[data-unit='axe']").text().trim().replace(')','').replace('(','')),
        spy:parseInt($(".units-entry-all[data-unit='spy']").text().trim().replace(')','').replace('(','')),
        light:parseInt($(".units-entry-all[data-unit='light']").text().trim().replace(')','').replace('(','')),
        heavy:parseInt($(".units-entry-all[data-unit='heavy']").text().trim().replace(')','').replace('(','')),
        ram:parseInt($(".units-entry-all[data-unit='ram']").text().trim().replace(')','').replace('(','')),
        catapult:parseInt($(".units-entry-all[data-unit='catapult']").text().trim().replace(')','').replace('(','')),
        snob:parseInt($(".units-entry-all[data-unit='snob']").text().trim().replace(')','').replace('(','')),
    }
    console.log(available_units)

    $("#content_value").prepend(`<div><input type="button" class="btn" style="width:100%" id="wywal_grube" value="Wywal grube (${group_villages})"></div>`)

})

$(document.body).on('click','#wywal_grube',function() {

    if ($("#troop_confirm_go").length > 0) {
        $("#troop_confirm_go").click()
    } else {

    fake_limit = Math.ceil(game_data.village.points/100)
    url = `https://${game_data.world}.plemiona.pl/${game_data.link_base_pure}place&mode=neighbor&group=0`
    $.ajax({
        method:'POST',
        url:url,
        success: function(response) {
            link = $(response).find('a[href*="screen=overview&target"]').first().text().trim()
            coords = link.substring(link.length-12,link.length-5)
            $(".target-input-field").val(coords)
            fake_limit = fake_limit - available_units.snob * 100
            input_units[9] = available_units.snob
            if (fake_limit > 0) {
                if (fake_limit > available_units.spy * 2) {
                   input_units[3] = available_units.spy
                   fake_limit -= available_units.spy * 2
                } else {
                   input_units[3] = Math.ceil(fake_limit/2)
                   fake_limit = 0
                }
            }
            if (fake_limit > 0) {
                if (fake_limit > available_units.spear) {
                   input_units[0] = available_units.spear
                   fake_limit -= available_units.spear
                } else {
                   input_units[0] = fake_limit
                   fake_limit = 0
                }
            }
            if (fake_limit > 0) {
                if (fake_limit > available_units.sword) {
                   input_units[1] = available_units.sword
                   fake_limit -= available_units.sword
                } else {
                   input_units[1] = fake_limit
                   fake_limit = 0
                }
            }
            $.each(input_units,function(index,input) {
                $($(".unitsInput")[index]).val(input)
            })
            $("#group_id").val("4017")
            $("#group_id").trigger('change')
            setTimeout(function() {$("#target_attack").trigger('click')},600)
        }
    })

    }





})

$(document).on('keydown', function (e) {
        if(e.which == 119){
            //console.log(test)
            if (available_units.snob > 0) {$("#wywal_grube").click()}
            else {$("#village_switch_right")[0].click()}

        }
});