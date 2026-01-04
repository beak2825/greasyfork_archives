// ==UserScript==
// @name         RYNEK PP ALERT
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Robi 'Beeep' jesli cena surowce za pp jest rowna albo nizsza od oczekiwanej, w wiosce jest przynajmniej 1 kupiec, i surowcow wiecej niz oczekiwana cena + 1000
// @author       PTS
// @match        https://*.plemiona.pl/game.php?*mode=exchange*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392777/RYNEK%20PP%20ALERT.user.js
// @updateURL https://update.greasyfork.org/scripts/392777/RYNEK%20PP%20ALERT.meta.js
// ==/UserScript==

$("#premium_exchange_form table tbody").append(`<tr><td></td><td class="diff_wood center"></td><td class="diff_stone center"></td><td class="diff_iron center"></td></tr>`)
$(".premium-exchange-input").attr("autocomplete",'off')

var test = 1
let i = 0
'use strict';
var notification_count = 0

$('#content_value').prepend('<button class="alert_init" typ="sell" id="alert_sell">Informuj o ofertach mniejszych niż...</button><input id="szukana_sell" type="number" value="350"><br><button class="alert_init" typ="buy" id="alert_buy">Informuj o ofertach większych niż...</button><input id="szukana_buy" type="number" value="350">')

//function beep() {
var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");       
$(document.body).on('click','.alert_init',function() {

    typ = $(this).attr('typ')
    $(this).prop('disabled',true)
    $("button[typ='"+typ+"']").text($("button[typ='"+typ+"']").text()+' ACTIVATED')

    alert_pp(typ)


})

//}
//beep();

function alert_pp(typ) {
    setInterval(function() {
        diff_wood = parseInt($("#premium_exchange_capacity_wood").text()) - parseInt($("#premium_exchange_stock_wood").text())
        diff_stone = parseInt($("#premium_exchange_capacity_stone").text()) - parseInt($("#premium_exchange_stock_stone").text())
        diff_iron = parseInt($("#premium_exchange_capacity_iron").text()) - parseInt($("#premium_exchange_stock_iron").text())
        $(".diff_wood").text(diff_wood)
        $(".diff_stone").text(diff_stone)
        $(".diff_iron").text(diff_iron)
        if (document.getElementsByClassName("recaptcha-checkbox-border").length > 0) {
            Click()
        }
        if (typ == "sell") {
            mnoznik = 1
            pp_mnoznik = 9999
        } else {
            mnoznik = -1
            pp_mnoznik = 0
        }
        drewno = parseInt($('#premium_exchange_rate_wood').find('.premium-exchange-sep').first().text())
        glina = parseInt($('#premium_exchange_rate_stone').find('.premium-exchange-sep').first().text())
        zelazo = parseInt($('#premium_exchange_rate_iron').find('.premium-exchange-sep').first().text())
        kupcy = parseInt($("#market_merchant_available_count").text())
        pp = parseInt($("#premium_points").text())
        check = 0
        if (typ == 'sell') {szukana = parseInt(1000)+parseInt($('#szukana_sell').val())} else {szukana = -1;kupcy = 9999}
        console.log(drewno * mnoznik)
        console.log($('#szukana_'+typ).val() * mnoznik)
        console.log(szukana)
        console.log(kupcy)
        if (drewno * mnoznik <= $('#szukana_'+typ).val() * mnoznik && kupcy > 0 && game_data.village.wood > szukana && pp + pp_mnoznik != 0) {check += 1}
        if (glina * mnoznik <= $('#szukana_'+typ).val() * mnoznik && kupcy > 0 && game_data.village.stone > szukana && pp + pp_mnoznik != 0) {check += 1}
        if (zelazo * mnoznik <= $('#szukana_'+typ).val() * mnoznik && kupcy > 0 && game_data.village.iron > szukana && pp + pp_mnoznik != 0) {check += 1}
        console.log(console.log("sprawdzam "+typ))
        if (check > 0) {
            snd.play()
            console.log("notification_count: "+notification_count)
            if (notification_count == 0) {
                notifyMe()
                notification_count += 1
            }
            if (notification_count > 0 && notification_count < 10) {
                notification_count += 1
            }
            if (notification_count == 10) {
                notification_count = 0
            }

        }
    },1000)
}

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Kurs");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Kurs");
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}


function Sleep(milliseconds) {
     return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function Click() {
     var randVal = Math.floor(Math.random() * (max - min + 1)) + min;
     await Sleep(randVal);
     document.getElementsByClassName("recaptcha-checkbox-border")[0].click()
     console.log('click after ' + randVal + ' milliseconds');
}



