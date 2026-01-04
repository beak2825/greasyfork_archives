// ==UserScript==
// @name         Wybijanie monet
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/*screen=snob*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414220/Wybijanie%20monet.user.js
// @updateURL https://update.greasyfork.org/scripts/414220/Wybijanie%20monet.meta.js
// ==/UserScript==

///////////// USER SETTINGS ///////////

coIleOdswiezenieStala = 1000 * 120 // 1000 ms = 1 sekunda, 120 * 1000 = 2 minuty
coIleOdswiezenieZmienna =  10 * 1000 // 1000 ms = 1 senunda

//////////////////////////////////////



if (sessionStorage.getItem('auto') == '1') {
    start_disabled = 'disabled';
    stop_disabled = '';
    start();

} else {
    start_disabled = '';
    stop_disabled = 'disabled';
}

$("#content_value").prepend(`<div><button id='start' class='btn' ${start_disabled}>START</button>&nbsp;&nbsp;&nbsp;<button id='end' class='btn' ${stop_disabled}>STOP</button>&nbsp;&nbsp;&nbsp;<span id="counter"></span></div>`)

function start() {
    setTimeout(function() {
        $("#coin_mint_fill_max").click()
        setTimeout(function() {
            $("input[value='Wybić']").click()
            counter = 60
            setInterval(function() {

                counter = counter - 1
                $("#counter").text('Next refresh in '+counter+' seconds')
            },1000)
            setTimeout(function() {
                location.reload();
            },coIleOdswiezenieStala + coIleOdswiezenieZmienna * Math.random())
        },1000)
    },3000)

}


$(document.body).on('click','#start',()=>{
    sessionStorage.setItem('auto','1')
    window.location.reload()
})

$(document.body).on('click','#end',()=>{
    sessionStorage.setItem('auto','0')
    window.location.reload()
})

