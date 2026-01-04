// ==UserScript==
// @name         Taequila CropMonitor
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  WW Crop alert
// @author       You
// @include      http://www.travianwonder.com/lapecorellasmarrita
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389436/Taequila%20CropMonitor.user.js
// @updateURL https://update.greasyfork.org/scripts/389436/Taequila%20CropMonitor.meta.js
// ==/UserScript==

$('document').ready(function(){
    var timeLeft = $("#granaryEmpty")[0].innerText;
    console.log(timeLeft);
    var split = timeLeft.split(':');
    if(parseInt(split[0]) < 1 ){
        var text = "Il granaio sarà vuoto tra " + timeLeft;
        $.get("https://api.telegram.org/bot952162385:AAGVAUMzFOLbhVHUXoI1ioJT3R_USXBUQno/sendMessage?chat_id=-1001293573060&text="+text)
    }
    //$.get("https://api.telegram.org/bot952162385:AAGVAUMzFOLbhVHUXoI1ioJT3R_USXBUQno/sendMessage?chat_id=-1001293573060&text=debug")
    setTimeout( function(){ location.reload(true)}, 300000);
});

