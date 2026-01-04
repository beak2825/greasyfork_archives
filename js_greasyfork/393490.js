// ==UserScript==
// @name         eBonus.gg Video
// @namespace    Pk
// @version      1.0
// @description  Auto clique no próximo vídeo, clique automático na bolha e recarrega a página automaticamente com vídeos quebrados.
// @author       Pedro (Pecraft)
// @match        *://ebonus.gg/earn-coins/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393490/eBonusgg%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/393490/eBonusgg%20Video.meta.js
// ==/UserScript==

setInterval(function() {
                  window.location.reload();
                }, 170000); 

$(document).ready(function(){
    var coinsclicker = setInterval(function() {
        ClickNext();
        ClickOnBubble();
    }, 1000);

    window.ClickNext = function(){
        if ($(".coins_popup").length > 0) {
            console.log("clicked");
            $(".coins_popup").click();
        }
    };
    window.ClickOnBubble = function(){
        if ($(".sweet-alert.showSweetAlert.visible").length > 0) {
            console.log("clicked");
            $(".confirm").click();
        }
    };
});