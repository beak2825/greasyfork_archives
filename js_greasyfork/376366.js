// ==UserScript==
// @name         eBonus.gg (colete moedas mais facilmente e bem mais rapido).
// @namespace    YTGustavinho
// @version      1.1
// @description  Auto clique no próximo vídeo, clique automático na bolha e recarrega a página automaticamente com vídeos quebrados.
// @author       YTGustavinho
// @match        https://ebonus.gg/earn-coins/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376366/eBonusgg%20%28colete%20moedas%20mais%20facilmente%20e%20bem%20mais%20rapido%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376366/eBonusgg%20%28colete%20moedas%20mais%20facilmente%20e%20bem%20mais%20rapido%29.meta.js
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