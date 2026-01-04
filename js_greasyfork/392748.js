// ==UserScript==
// @name         POMOCNIK RYNKU
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Pomaga w obsludze rynku - wybiera ilosc paczek tak, aby wyrownac ilosc wszystkich surowcow
// @author       PTS
// @match        https://*.plemiona.pl/*game.php*screen=market*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392748/POMOCNIK%20RYNKU.user.js
// @updateURL https://update.greasyfork.org/scripts/392748/POMOCNIK%20RYNKU.meta.js
// ==/UserScript==


if (game_data.mode == null || game_data.mode == 'other_offer') {
    var surowce

    (function() {

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
        var a = $('#market_status_bar th:contains("Przybywające:") span.nowrap')
        var przybywajace = [0,0,0]
        $.each(a,(index,span) => {

            span = $(span)
            if (span.html().indexOf('icon header wood') > -1) {przybywajace[0] = parseInt(span.text().trim().split('.').join(""))}
            if (span.html().indexOf('icon header stone') >-1) {przybywajace[1] = parseInt(span.text().trim().split('.').join(""))}
            if (span.html().indexOf('icon header iron') >-1) {przybywajace[2] = parseInt(span.text().trim().split('.').join(""))}
            console.log(przybywajace)
        })

        total_wood = przybywajace[0]+game_data.village.wood
        total_stone = przybywajace[1]+game_data.village.stone
        total_iron = przybywajace[2]+game_data.village.iron
        total_sura = total_wood+total_stone+total_iron
        roznica_wood = parseInt(total_wood-(total_sura/83*28))
        roznica_stone = parseInt(total_stone-(total_sura/83*30))
        roznica_iron = parseInt(total_iron-(total_sura/83*25))


        $("#content_value").prepend(`Suma sury: ${total}<br>
Drewno: ${surowce.drewno.ilosc}<br>
Glina: ${surowce.glina.ilosc}<br>
Zelazo: ${surowce.zelazo.ilosc}<br>
Ilosc paczek: ${ilosc_paczek}<br>
Srednia ilosc paczek: ${srednia_ilosc_paczek}<br>
Delta paczek drewno: ${surowce.drewno.delta}<br>
Delta paczek glina: ${surowce.glina.delta}<br>
Delta paczek żelazo: ${surowce.zelazo.delta}<br>
Monety - drewno: ${roznica_wood}<br>
Monety - glina: ${roznica_stone}<br>
Monety - żelazo: ${roznica_iron}<br>
<br>
<br><button id="act" style="font-size:25px">ACTION</button>
<br>`);

    console.log(surowce)

    $(document.body).on('click','#act',function() {
        if ( !( surowce.drewno.typ == 'biorca' || surowce.glina.typ == 'biorca' || surowce.zelazo.typ == 'biorca' ) || !( surowce.drewno.typ == 'dawca' || surowce.glina.typ == 'dawca' || surowce.zelazo.typ == 'dawca' ) ) { console.log ('Gotowe! nie trzeba wymieniac.'); $("#village_switch_right")[0].click();return false;}
        if (kupcy == 0) {console.log ('Brak kupców.'); $("#village_switch_right")[0].click();return false;}

        // jedziemy z koksem
        let zmiana = 0

        let potrzebuje_drewno = $('input[name="res_sell"][value="wood"]');
        let potrzebuje_gline = $('input[name="res_sell"][value="stone"]');
        let potrzebuje_zelazo = $('input[name="res_sell"][value="iron"]');

        let sprzedaje_drewno = $('input[name="res_buy"][value="wood"]');
        let sprzedaje_gline = $('input[name="res_buy"][value="stone"]');
        let sprzedaje_zelazo = $('input[name="res_buy"][value="iron"]');

        let dawca
        let biorca

        //sessionStorage.get

        //return false;

        if (surowce.drewno.typ == 'biorca') { biorca='drewno'; if (!potrzebuje_drewno.is(':checked')) {potrzebuje_drewno.attr('checked', 'checked'); zmiana += 1 }} else {
            if (surowce.glina.typ == 'biorca') { biorca='glina'; if (!potrzebuje_gline.is(':checked')) { potrzebuje_gline.attr('checked', 'checked'); zmiana += 1 }} else {
                if (surowce.zelazo.typ == 'biorca') { biorca='zelazo'; if (!potrzebuje_zelazo.is(':checked')) { potrzebuje_zelazo.attr('checked', 'checked'); zmiana += 1 }}
            }
        }


        if (surowce.drewno.typ == 'dawca') { dawca = 'drewno'; if (!sprzedaje_drewno.is(':checked')) { sprzedaje_drewno.attr('checked', 'checked'); zmiana += 1 }} else {
            if (surowce.glina.typ == 'dawca') { dawca = 'glina'; if (!sprzedaje_gline.is(':checked')) { sprzedaje_gline.attr('checked', 'checked'); zmiana += 1 }} else {
                if (surowce.zelazo.typ == 'dawca') { dawca = 'zelazo'; if (!sprzedaje_zelazo.is(':checked')) { sprzedaje_zelazo.attr('checked', 'checked'); zmiana += 1 }}
            }
        }

        if (zmiana > 0 && dawca == 'drewno') {sprzedaje_drewno.trigger('click');return false;}
        if (zmiana > 0 && dawca == 'glina') {sprzedaje_gline.trigger('click');return false;}
        if (zmiana > 0 && dawca == 'zelazo') {sprzedaje_zelazo.trigger('click');return false;}

        let ile

        let input_sura = $('input[name="count"]').first()
        let input_sura_max = parseInt($('input[name="count"]').first().closest('span').find('a').text())

        let surowce_dawca = Math.abs(surowce[dawca]['delta'])
        let surowce_biorca = Math.abs(surowce[biorca]['delta'])

        if (surowce_dawca < surowce_biorca) {ile = surowce_dawca} else {ile = surowce_biorca}
        if (ile > input_sura_max) {ile = input_sura_max}
        if (ile > kupcy) {ile = kupcy}

        input_sura.val(ile);
        let guzik = $('input.btn.float_right');
        console.log(guzik.first())
        guzik.first().click()
        if (guzik.length == 0) {$("#village_switch_right")[0].click();return false;}

    })

    $(document).on('keydown', function (e) {
        if(e.which == 118){
            $('#act').click();
        }
    });




})();


}