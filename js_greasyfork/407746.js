// ==UserScript==
// @name        Cunhar LoGam
// @namespace    https://www.facebook.com/Silas.GuimaraeS2
// @version      0.1
// @description  Cunhar Moeda Rodar Tamper
// @author       Ayrton Silas
// @include      https://br*screen=snob*
// @match        https://br*screen=snob*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/407746/Cunhar%20LoGam.user.js
// @updateURL https://update.greasyfork.org/scripts/407746/Cunhar%20LoGam.meta.js
// ==/UserScript==
$(function(){
    var tempoSegundo = 100;
    $('#coin_mint_count').val($("#coin_mint_fill_max").text().replace(')','').replace('(',''));
    $(".btn-default").click();
    setInterval(function () {
        window.location.reload();
    }, tempoSegundo*1000);
});