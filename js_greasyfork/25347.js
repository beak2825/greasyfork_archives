// ==UserScript==
// @name         Grambrl
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AutoPoint for Grambrl
// @author       Jose Enrique Ayala Villegas
// @match        http://localhost.gramblr.com:4343/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25347/Grambrl.user.js
// @updateURL https://update.greasyfork.org/scripts/25347/Grambrl.meta.js
// ==/UserScript==
main();
window.onhashchange = function(e){
    main(e);
};

function main(e){
    var url = e ? e.newURL : location.href;
    console.log(url);
    switch(url){
        case "http://localhost.gramblr.com:4343/#/ratings":
            rating();
            break;
    }
}

function rating(){
    if(location.href !== "http://localhost.gramblr.com:4343/#/ratings") return true;
    if($('div>img[src*="loader.gif"]').is(':visible')){setTimeout(rating,1000);} else {
        console.log("Cargado..!");
        if($('button[ng-click="sendLike()"]:visible').length>0 && (original_image? original_image.src : '') !== ''){
            oldUrl = original_image.src;
            $('button[ng-click="sendLike()"]:visible').click();
            waitForNext();
        } else {
            if($('button[ng-click="sendLike()"]:visible').length === 0 && $('[ng-click="gotoAddLikes()"]:visible').length>0){
                console.log("Acción 'Recargar pagina' programado para ejecutarse dentro de 60 segundos...");
                to_pr = setTimeout(function(){console.log("Recargando...");location.reload();},60000);
                window.stopReload = stopReload;
            } else {
                console.log("Error desconocido...!: ("+
                $('button[ng-click="sendLike()"]:visible').length+","+
                $('[ng-click="gotoAddLikes()"]:visible').length+
                ")");
                setTimeout(rating,1000);
            }
        }
    }
}

function waitForNext(){
    if(original_image === oldUrl){setTimeout(waitForNext,1000);} else {setTimeout(rating,1000);}
}

function stopReload(){
    clearTimeout(to_pr);
}