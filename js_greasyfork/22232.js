// ==UserScript==
// @name         Pokemap Addition Patch (skiplagged)
// @namespace    pokemap addition patch
// @version      0.2
// @description  Adding coordinate and a link for trigger pokesniper2 to catch selected pokemon
// @author       BewbsMastery
// @match        https://skiplagged.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22232/Pokemap%20Addition%20Patch%20%28skiplagged%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22232/Pokemap%20Addition%20Patch%20%28skiplagged%29.meta.js
// ==/UserScript==
$(function(){
    window.setInterval(function(){
        var container = $(".gm-style-iw").find(".right");
        var coordinates = container.find("p:eq(2)").find(">:first-child").attr("href").split("/")[6];
        var pokemonName = container.find(">:first-child").find(">:first-child").text();
        var url = "pokesniper2://"+ pokemonName +"/"+ coordinates;
        if(container.find(".pokelink").length > 0)
            container.find(".pokelink").attr("href" , url);
        else
            container.append("<p>"+ coordinates +"</p><p><a class=\"pokelink\" href=\""+ url +"\">Snipe me!</a></p>");
    },500);
});