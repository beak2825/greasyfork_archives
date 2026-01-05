// ==UserScript==
// @name         Quien comenta shouts taringa
// @namespace    http://taringa.net/
// @version      6.6.6
// @description  Tener mas a mano quien comenta los chuts
// @author       @AndrewLedger con MUCHA ayuda de @mauri934
// @match        http://www.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17210/Quien%20comenta%20shouts%20taringa.user.js
// @updateURL https://update.greasyfork.org/scripts/17210/Quien%20comenta%20shouts%20taringa.meta.js
// ==/UserScript==





$("div.my-shout-footer.mi.clearfix")
    .append("<input type='radio' name='seleccion' id='todos'>&nbsp Todos pueden comentar<br><input type='radio' name='seleccion' id='seguidos'>&nbsp Solo los que sigo pueden comentar<br><input type='radio' name='seleccion' id='nadie'>&nbsp Nadie puede comentar");

$("#nadie").click(function(){
       $(".privacy-shout-2 a").click();
});

$("#seguidos").click(function(){
        $(".privacy-shout-1 a").click();
    });

$("#todos").click(function(){
        $(".privacy-shout-0 a").click();
    });


$("div.privacy-shout.floatR.hastipsy").hide();
