// ==UserScript==
// @name         Rent Bot 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  teste do teste
// @author       You
// @match        https://play.pegaxy.io/renting/listing/*
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439473/Rent%20Bot%202.user.js
// @updateURL https://update.greasyfork.org/scripts/439473/Rent%20Bot%202.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async function() {
    var naoentrou = false;
    var clicou = false;
    while(!clicou){
        if(!naoentrou && document.getElementsByClassName("button-game pinks").length != 0){
            document.getElementsByClassName("button-game pinks")[0].click();
            naoentrou = true;
        }
        var botoes = document.getElementsByClassName("button-game primary");
        if(naoentrou && botoes.length > 0)
            for(var k = 0; k < botoes.length; k++)
                if(botoes[k].innerText == "Rent"){
                    botoes[k].click();
                    clicou = true;
                }
        await sleep(200)
    }
})();