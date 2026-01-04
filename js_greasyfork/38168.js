// ==UserScript==
// @name         eBonus.gg Pro
// @namespace    Daniel Fontenelle
// @version      1.3
// @description  Auto clique no próximo vídeo, clique automático na bolha e recarrega a página automaticamente com vídeos quebrados.
// @author       Daniel Fontenelle (FACEBOOK: https://www.facebook.com/danielll.fontenelle )
// @match        https://ebonus.gg/earn-coins/watch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38168/eBonusgg%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/38168/eBonusgg%20Pro.meta.js
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