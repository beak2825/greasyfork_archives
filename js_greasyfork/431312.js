// ==UserScript==
// @name         Pvu Water traker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tener una batalla justa contra los bots >:(
// @author       Alexander Martinerz
// @match        https://marketplace.plantvsundead.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://s2.coinmarketcap.com/static/img/coins/64x64/11130.png
// @downloadURL https://update.greasyfork.org/scripts/431312/Pvu%20Water%20traker.user.js
// @updateURL https://update.greasyfork.org/scripts/431312/Pvu%20Water%20traker.meta.js
// ==/UserScript==

var activeOnce = true;
let audio= '<audio style="display:none" class="my_audio" controls preload="none"><source src="https://vmctecnologia.cl/pvu/alert-water.wav" type="audio/wav">';
$('body').append(audio);


$('body').on('DOMSubtreeModified', '.plant-attr-number .small', function(){

    var watter = $(".plant-attr-number .small");
    let blikedPerfil = true;

    if(parseInt(watter.text())<=5){
        $(".my_audio").trigger('play');

        setInterval(function(){
            blikedPerfil = !blikedPerfil;
            $(".content-wrapper,.tw-flex.tw-flex-col").css("background-color", blikedPerfil ? "red" : "#3fff00");
        }, 200);

        if (activeOnce) {
         var elements = $(".tw-bg-orange-tools-icon").find("[src='/_nuxt/img/water@3x.f04d397.png']")
         let tiempo = Math.random() * (884 - 805) + 805;
            setTimeout(() => {
                elements[1].click()
            }, tiempo);


            activeOnce = false;
        }
    }
})
