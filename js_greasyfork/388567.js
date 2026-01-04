// ==UserScript==
// @name         TW - Cunhar moedas
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lordsthan
// @match        https://*.tribalwars.com.br/game.php?village=*&screen=snob
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388567/TW%20-%20Cunhar%20moedas.user.js
// @updateURL https://update.greasyfork.org/scripts/388567/TW%20-%20Cunhar%20moedas.meta.js
// ==/UserScript==

(function() {
    function makeMaximumAmount(){
        var maximumAmount = document.getElementById("coin_mint_fill_max").text.match(/\(([^)]+)\)/)[1];
        if(document.getElementById("coin_mint_count").value != maximumAmount){
            document.getElementById("coin_mint_count").value = maximumAmount;
        }
        document.getElementsByClassName("btn btn-default")[0].click();
    }

    if(document.getElementById("coin_mint_count") !== null){
        makeMaximumAmount();
    }

    console.log("Atualizando a página em 60 segundos");
    setInterval(function() {window.location.reload();}, 60000);
})();