// ==UserScript==
// @name         Automated call resources in marketplace
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       pts
// @match        https://*.plemiona.pl/game.php?*screen=market*mode=call*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414645/Automated%20call%20resources%20in%20marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/414645/Automated%20call%20resources%20in%20marketplace.meta.js
// ==/UserScript==

timer = getCookie("timerCallSources");
if (timer) {
    refresh_time = parseInt(timer)
} else {
    refresh_time = 5
}

coin_price_handler = getCookie("coin_price_handler");
console.log('CPH: '+coin_price_handler)
if (coin_price_handler) {

} else {
    coin_price_handler = "0"
}

coin_prices = getCookie("coin_price");
if (coin_prices) {
    coin_prices = JSON.parse(coin_prices);
} else {
    coin_prices = [28000,30000,25000];
}

console.log(coin_prices)

counter = refresh_time * 60

cookie = getCookie("autoCallSources");
if (cookie == "auto") {
    btn_text = "Deaktywuj";
    next_refresh_row = `<td>Nastepny refresh za</td><td><span id="counter">${counter}</span> sekund</td>`
    setTimeout(() => {
        $("input[name='select-all']").click()
        if (coin_price_handler == '1') {
            $.each($(".supply_location"),function(index,row) {
                columns = $(row).find('td')
                row_supplies = [parseInt($(columns[2]).find('input').val().replace(".","")),parseInt($(columns[3]).find('input').val().replace(".","")),parseInt($(columns[4]).find('input').val().replace(".","")),parseInt($(columns[6]).text().split("/")[0])]
                quantity = []
                for (i=0;i<3;i++) {
                    quantity.push(Math.floor(row_supplies[i]/coin_prices[i]))
                }
                min = Math.min(...quantity)
                $(columns[2]).find('input').val(min * coin_prices[0])
                $(columns[3]).find('input').val(min * coin_prices[1])
                $(columns[4]).find('input').val(min * coin_prices[2])
            })
        }

        setTimeout(() => {$("input[value='Poproś o surowce']").click()},1000)
    },200)
    setInterval(() => {
        counter -= 1
        $("#counter").text(counter)
        if (counter == 0) {
            location.reload()
        }
    },1000)
} else {
    btn_text = "Aktywuj";
    next_refresh_row = ''
}

$("#content_value").prepend(`<div class="bordered-box">
<h3>Ściąganie surowców</h3>
<br>
<table style="width:300px;">
<tr><td>Co ile minut refresh?</td><td><input id="refresh_interval" value="${refresh_time}" type="num" min="0" step="1"></td></tr>
<tr>${next_refresh_row}</tr>
<tr><td colspan="2"><button id="toogle" style="width:100%;" class="btn btn-block">${btn_text}</button></td></tr>
</table>
<h4>Cena monety</h4>
<table>
<tr><th style="width:100px"><span class="icon header wood"></span></th><th style="width:100px"><span class="icon header stone"></span></th><th style="width:100px"><span class="icon header iron"></span></th><th><input id="price_handler" type="checkbox"> Uwzględnij ceny monet</th></tr>
<tr><th><input id="wood_price" value="${coin_prices[0]}"></th><th><input id="stone_price" value="${coin_prices[1]}"></th><th><input id="iron_price" value="${coin_prices[2]}"></th></tr>
</table>
</div>`)

if (coin_price_handler == "1") $("#price_handler")[0].checked = true

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


$(document.body).on('click','#toogle',() => {
    if (cookie == "auto") {
        setCookie('autoCallSources','no_auto',9999);
        location.reload();
    } else {
        if ($("#price_handler")[0].checked) {handler = "1"} else {handler = "0"}
        prices = [parseInt($("#wood_price").val()),parseInt($("#stone_price").val()),parseInt($("#iron_price").val())]
        prices = JSON.stringify(prices)
        console.log(handler)
        setCookie('timerCallSources',$("#refresh_interval").val(),9999)
        setCookie('autoCallSources','auto',9999);
        setCookie('coin_price_handler',handler,9999)
        setCookie('coin_price',prices,9999)
        location.reload();
    }
})