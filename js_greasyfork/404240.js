// ==UserScript==
// @name         POMOCNIK WYSTAWIANIA OFERT
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Pomaga w obsludze rynku - wybiera ilosc paczek tak, aby wyrownac ilosc wszystkich surowcow
// @author       PTS
// @match        https://*.plemiona.pl/game.php?*screen=market&mode=own_offer*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404240/POMOCNIK%20WYSTAWIANIA%20OFERT.user.js
// @updateURL https://update.greasyfork.org/scripts/404240/POMOCNIK%20WYSTAWIANIA%20OFERT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    calculate_resources()
    })();

var surowce

function calculate_resources() {
    
    surowce = {
        drewno:{
            ilosc:parseInt($("#wood").text()),
            typ:'',
            delta:''
        },
        glina:{
            ilosc:parseInt($("#stone").text()),
            typ:'',
            delta:''
        },
        zelazo:{
            ilosc:parseInt($("#iron").text()),
            typ:'',
            delta:''
        },
    }

    let przybywajace_elem = $(document.body).find('th:contains("Przybywające:")').find('span.nowrap')
    console.log(przybywajace_elem.length)
    przybywajace_elem.each(function() {

        let typ_surowca = $(this).find('.icon').first().attr('title')
        console.log(parseInt(($(this).text()).replace('.','')))
        if (typ_surowca=='Drewno') {surowce.drewno.ilosc += parseInt(($(this).text()).replace('.',''))}
        if (typ_surowca=='Glina') {surowce.glina.ilosc += parseInt(($(this).text()).replace('.',''))}
        if (typ_surowca=='Żelazo') {surowce.zelazo.ilosc += parseInt(($(this).text()).replace('.',''))}
    })

    $.each($("#own_offers_table").find("tr.offer_container"),function(index,element) {

        let multipier = parseInt($(element).find('td').eq(3).text())

        let szukana = $(element).find('td').eq(2).find('span').eq(1)
        if (szukana.attr('class').includes('wood')) {console.log('znalazlem drewno ' + parseInt((szukana.closest('td').text()).replace('.','')));surowce.drewno.ilosc += parseInt((szukana.closest('td').text()).replace('.','')) * multipier}
        if (szukana.attr('class').includes('stone')) {console.log('znalazlem gline ' + parseInt((szukana.closest('td').text()).replace('.','')));surowce.glina.ilosc += parseInt((szukana.closest('td').text()).replace('.','')) * multipier}
        if (szukana.attr('class').includes('iron')) {console.log('znalazlem zelazo ' + parseInt((szukana.closest('td').text()).replace('.','')));surowce.zelazo.ilosc += parseInt((szukana.closest('td').text()).replace('.','')) * multipier}


    })

    let total = surowce.drewno.ilosc + surowce.glina.ilosc + surowce.zelazo.ilosc
    let ilosc_paczek = parseInt(total/1000)
    let srednia_ilosc_paczek = parseInt(ilosc_paczek/3)
    let kupcy = Market.Data.Trader.amount
    surowce.drewno.delta = parseInt(surowce.drewno.ilosc / 1000) - srednia_ilosc_paczek
    surowce.glina.delta =  parseInt(surowce.glina.ilosc / 1000) - srednia_ilosc_paczek
    surowce.zelazo.delta = parseInt(surowce.zelazo.ilosc / 1000) - srednia_ilosc_paczek

    $.each(surowce,function(k,v) {
        if (v.delta < 0) {surowce[k]["typ"] = 'biorca'}
        if (v.delta > 0) {surowce[k]['typ'] = 'dawca'}
        if (v.delta == 0) {surowce[k]['typ'] = 'gotowe'}
    })

    console.log(surowce)
    $("#content_value").prepend(`Suma sury: ${total}<br>
Drewno: ${surowce.drewno.ilosc}<br>
Glina: ${surowce.glina.ilosc}<br>
Zelazo: ${surowce.zelazo.ilosc}<br>
Ilosc paczek: ${ilosc_paczek}<br>
Srednia ilosc paczek: ${srednia_ilosc_paczek}<br>
Delta paczek drewno: ${surowce.drewno.delta}<br>
Delta paczek glina: ${surowce.glina.delta}<br>
Delta paczek żelazo: ${surowce.zelazo.delta}<br>
<br>
<br><button id="act" style="font-size:25px">ACTION</button>
<br>`);

}

$(document.body).on('click','#act',function() {
    if (Market.Data.Trader.amount > 0) {
        ile = 0
        dawcy = 0
        dawca_ilosc = 0
        dawca_rodzaj = ''
        if (surowce.drewno.typ == 'dawca' && surowce.drewno.delta > dawca_ilosc) {dawcy += 1; dawca_rodzaj = 'wood'; dawca_ilosc = surowce.drewno.delta}
        if (surowce.glina.typ == 'dawca' && surowce.glina.delta > dawca_ilosc) {dawcy += 1; dawca_rodzaj = 'stone'; dawca_ilosc = surowce.glina.delta}
        if (surowce.zelazo.typ == 'dawca' && surowce.zelazo.delta > dawca_ilosc) {dawcy += 1; dawca_rodzaj = 'iron'; dawca_ilosc = surowce.zelazo.delta}


        biorcy = 0
        biorca_ilosc = 0
        biorca_rodzaj = ''
        if (surowce.drewno.typ == 'biorca' && surowce.drewno.delta < dawca_ilosc) {biorcy += 1; biorca_rodzaj = 'wood'; biorca_ilosc = surowce.drewno.delta}
        if (surowce.glina.typ == 'biorca' && surowce.glina.delta < dawca_ilosc) {biorcy += 1; biorca_rodzaj = 'stone'; biorca_ilosc = surowce.glina.delta}
        if (surowce.zelazo.typ == 'biorca' && surowce.zelazo.delta < dawca_ilosc) {biorcy += 1; biorca_rodzaj = 'iron'; biorca_ilosc = surowce.zelazo.delta}

        console.log(dawca_rodzaj)
        console.log(dawcy)
        console.log(dawca_ilosc)
        console.log(biorca_rodzaj)
        console.log(biorcy)
        console.log(biorca_ilosc)



        if (biorcy > 0 && dawcy > 0) {
            $("#res_sell_"+dawca_rodzaj).click()
            $("#res_buy_"+biorca_rodzaj).click()
            if (Math.abs(biorca_ilosc) < dawca_ilosc) {ile = Math.abs(biorca_ilosc)} else {ile = dawca_ilosc}
            if (ile > Math.floor(game_data.village[dawca_rodzaj]/1000)) {ile = Math.floor(game_data.village[dawca_rodzaj]/1000)}
            if (ile > Market.Data.Trader.amount) {ile = Market.Data.Trader.amount}
            $('input[name="multi"]').val(ile)
            $('input[name="multi"]').focus()
            console.log("ile: "+ile)
            if (ile > 0) {
                setTimeout(function() {$('input[type="submit"]').first().click()},300)
            } else {
                $(".arrowRight").click()
            }

        } else {
            $(".arrowRight").click()
        }

    } else {
        $(".arrowRight").click()
    }
})

document.addEventListener("keydown", function(event) {
  if (event.which == 118) {$("#act").click();};
 // if (event.which == 119) {$("#safb").click();};
});