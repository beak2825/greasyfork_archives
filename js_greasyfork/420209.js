// ==UserScript==
// @name         Event - Atak Hordy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skrypt do automatycznego klikania w evencie 'Atak hordy'
// @author       You
// @match        https://*.plemiona.pl/game.php?*&screen=event_horde*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420209/Event%20-%20Atak%20Hordy.user.js
// @updateURL https://update.greasyfork.org/scripts/420209/Event%20-%20Atak%20Hordy.meta.js
// ==/UserScript==

// $(".btn-puzzle-new").length
// $(".btn-puzzle-attempt").length

$("#menu_row2").append('<button id="run">Run</button>')

var dane = {}
refresh_history()

function process() {

    dane.new = $(".btn-puzzle-new").length
    dane.attempt = $(".btn-puzzle-attempt").length
    dane.selectableSlotsFirst = $(document.body).find(".horde-unit-selection.selectable").filter((index,element)=>{return $(element).html().includes('unknown')})
    dane.selectableSlotsRetry = $(document.body).find(".horde-red, .horde-yellow").find('.horde-unit-selection.selectable')
    dane.energy = parseInt($("#horde_energy_display").text().split("/")[0].trim())
    dane.select_unit = $(".btn-select-unit").length
    console.table(dane)

    console.table(missing_units)

    if (dane.attempt == 1 && dane.energy > 0 && dane.select_unit == 0 && dane.selectableSlotsFirst.length > 0) {$($(document.body).find(".horde-unit-selection.selectable").filter((index,element)=>{return $(element).html().includes('unknown')})[0]).click();return false;}
    if (dane.attempt == 1 && dane.energy > 0 && dane.select_unit == 0 && dane.selectableSlotsRetry.length > 0) {$($(document.body).find(".horde-red, .horde-yellow").find('.horde-unit-selection.selectable')[0]).click();return false;}
    available_units = $(".btn-select-unit").not(".btn-disabled")
    if (dane.select_unit > 0) {

        if (dane.selectableSlotsFirst.length == 5) {
            $("a[data-unit='halberd']").click()
            return false;
        }

        if (dane.selectableSlotsFirst.length == 4) {
            $("a[data-unit='morningstar']").click()
            return false;
        }

        if (dane.selectableSlotsFirst.length == 3) {
            $("a[data-unit='bigaxe']").click()
            return false;
        }

        if (dane.selectableSlotsFirst.length == 2) {
            $("a[data-unit='crossbow']").click()
            return false;
        }

        if (dane.selectableSlotsFirst.length == 1) {
            $("a[data-unit='knives']").click()
            return false;
        }

        $.each(available_units,(index,element)=>{
            unit = $(element).attr('data-unit')
            //console.log('check')
            //console.log(missing_units.includes(unit))
            if (missing_units.includes(unit) == true) {
                missing_units = missing_units.replace(unit,'')
                $(element).click()
                return false;
            }
        })
        if ($("table:contains('Historia prób')").last().find("tr:contains('Młot')").length == 0 && hammer_selected == false) {
            $("a[data-unit='hammer']").click()
            hammer_selected = true
            return false;
        }
        if ($("table:contains('Historia prób')").last().find("tr:contains('Bułat')").length == 0 && scimitar_selected == false) {
            $("a[data-unit='scimitar']").click()
            scimitar_selected = true
            return false;
        }


        if (false == false) {
            $.each(available_units,(index,element)=>{
                unit = $(element).attr('data-unit')
                //console.log('check')
                //console.log(missing_units.includes(unit))
                if (no_other_selection.includes(unit) == true) {
                    no_other_selection = no_other_selection.replace(unit,'')
                    $(element).click()
                    return false;
                }
            })
        }

        $(".btn-select-unit").not('.btn-disabled').first().click()
        return false;

    }

    if (dane.new == 1) {
        refresh_history()
        $(".btn-puzzle-new").click()
        return false;
    }

    if (dane.selectableSlotsFirst.length == 0 && dane.selectableSlotsRetry.length == 0) {
        refresh_history()
        $(".btn-confirm-yes")[1].click()
        return false;
    }


}

$(document.body).on('click','#run',()=>{
    process()
})


function refresh_history() {
    history_row = $("table:contains(Historia prób)").last().find('tr').eq(1).find('td')
    missing_units = ''

    $.each(history_row,(index,element)=>{
        if ($(element).html().includes('miss')) {
           missing_units += ($(element).text().trim().replace('Halabarda','halberd').replace('Kiścień','morningstar').replace('Wielki topór','bigaxe').replace('Kusza','crossbow').replace('Latające noże','knives').replace('Młot','hammer').replace('Bułat','scimitar'))
        }
    })

    hammer_selected = false
    scimitar_selected = false
    no_other_selection = 'halberdmorningstarbigaxecrossbowkniveshammerscimitar'

    dane = {}

}


$(document).on('keydown', function (e) {
        if(e.which == 118){
            process()
        }
});