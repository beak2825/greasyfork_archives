// ==UserScript==
// @name         Analiza logu premium
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Analiza logu premium .
// @author       You
// @match        https://*.plemiona.pl/game.php*screen=premium&mode=log*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415890/Analiza%20logu%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/415890/Analiza%20logu%20premium.meta.js
// ==/UserScript==

$("#content_value").prepend(`
<div><input type="date" id="date"><button class="btn trigger">Przeszukaj log</button></div>
`)

var wiersze = []
var summary = []

function getData(searched_date) {
    wiersze = []
    summary = []
    for (i=0;i<9999;i++) {
        console.log(i)
        t = $.ajax({
            method:"POST",
            url:'https://'+game_data.world+'.plemiona.pl/game.php?&screen=premium&mode=log&page='+i,
            async:false
        })
        szukane = $(t.responseText).find("table:contains('Dalsze informacje')").last().find('tr:not(":first")')
        szukane_arr = [].slice.call(szukane);
        wiersze = wiersze.concat(szukane_arr)
        if ($(szukane.last().find('td')[0]).text().indexOf(searched_date) > -1) {break;}
    }
    $.each(wiersze,function (index,wiersz) {
        kolumny = $(wiersz).find('td')
        date = $(kolumny[0]).text().substring(0,6)
        world = $(kolumny[1]).text().slice(-3)
        zmiana = parseInt($(kolumny[3]).text().trim())
        info = $(kolumny[5]).text()
        if (info.indexOf('Premium-sprzeda') > -1) {sprzedaz = zmiana;wydane = 0} else {sprzedaz = 0;wydane = zmiana}
        if (game_data.world == 'pl'+world) {
            searched = summary.find(data => data.date == date)
            if (searched) {
                searched.sprzedaz += sprzedaz;
                searched.wydane += wydane
            } else {
                summary.push({date:date,sprzedaz:sprzedaz,wydane:wydane})
            }
        }
    })
    summary.pop()
    html = `<table class="table vis"><tr><th style="width:100px;">Dzien</th><th style="width:100px;">Zarobione</th><th style="width:100px;">Wydane</th><th style="width:100px;">Total</th></tr>`
    total_sprzedane = 0
    total_wydane = 0
    $.each(summary,function(index,day) {
        html += `<tr><td>${day.date}</td><td style="text-align:right;">${day.sprzedaz}</td><td  style="text-align:right;">${day.wydane}</td><td style="text-align:right;">${day.sprzedaz+day.wydane}</td></tr>`
        total_sprzedane += day.sprzedaz
        total_wydane += day.wydane
    })
    html += `<tr><th>TOTAL</th><th  style="text-align:right;">${total_sprzedane}</th><th  style="text-align:right;">${total_wydane}</th><th  style="text-align:right;">${total_sprzedane + total_wydane}</th></tr></table>`
    Dialog.show('okno',html)
}

function formatDate(date) {
    var d = new Date(date)
    d = new Date(d.setDate(d.getDate()-1))
    var month = '' + (d.getMonth() + 1)
    var day = '' + d.getDate()


    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day,month].join('.');
}

$(document.body).on('click','.trigger',function() {
    date = $("#date").val()
    console.log(date)
    if (date != 'undefined' && date != null && date != '') {
        getData(formatDate(date))
    }
})