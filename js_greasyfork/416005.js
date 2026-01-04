// ==UserScript==
// @name         Trump card event
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/*event_trump_card*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416005/Trump%20card%20event.user.js
// @updateURL https://update.greasyfork.org/scripts/416005/Trump%20card%20event.meta.js
// ==/UserScript==

$("#content_value").prepend(`<div class="bordered-box"><h3>Trump card event, autor PTS</h3><button class='btn btn-lg' id='do_event' style='font-size:140px;'>Pojedyncze uruchomienie</button>
<br>
<br><button class='btn btn-lg' id='auto_do_event' style='font-size:140px;'>Auto klikanie start</button>&nbsp;&nbsp;&nbsp;<button class='btn btn-lg' id='auto_do_event_stop' style='font-size:140px;'>Auto klikanie stop</button>
<br><br>Zdobyte doświadczenie: <span id='exp'></span>/35
</div>`)

let interval

$(document.body).on('click','#auto_do_event',()=>{
    interval = setInterval(()=>do_event(),600)
})

$(document.body).on('click','#auto_do_event_stop',()=>{
    clearInterval(interval)
})


$(document.body).on('click','#do_event',()=>{
    do_event()
})


function do_event() {
    event_data = {}
    event_data.own = $("div.own-unit-zone .trump-unit").not(".dead").length
    event_data.enemies = $('div.enemy-unit-zone div.trump-unit').not(".dead").length
    event_data.new_fight_button_visibility = $(".button-new-battle")[0].style.display
    event_data.continue_event = $(".button-continue").length
    event_data.zdobyte_doswiadczenie = 0
    a = $('td:contains("Zdobyte")')
    if (a.length > 0) event_data.zdobyte_doswiadczenie = parseInt($("td:contains('Zdobyte doświadczenie: ')").last().text().split('(')[1].split('/')[0])

    console.log(event_data)

    if (event_data.continue_event == 1) {
        $(".button-continue").click()
        $("#exp").text(event_data.zdobyte_doswiadczenie)
        if (event_data.zdobyte_doswiadczenie == 35) clearInterval(interval)
        return false;

    }

    if (event_data.new_fight_button_visibility == '' || event_data.new_fight_button_visibility == 'inline-block') {
        $(".button-new-battle").click()
        return false;
    }

    if (event_data.own < event_data.enemies) {
        clearInterval(interval)
        $(".button-flee").click()
        setTimeout(()=>$("button:contains('Ucieczka!')").click(),1000)
        setTimeout(()=>interval = setInterval(()=>do_event(),600),2000)
        return false;
    }

    $('div.enemy-unit-zone div.trump-unit').not(".dead").last().click()
}