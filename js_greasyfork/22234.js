// ==UserScript==
// @name         Pokemap addition patch (pokeradar.io)
// @namespace    Pokemap addition patch
// @version      0.1.1
// @description  Add coordinates and a link for trigger pokesniper2 to catch selected pokemon
// @author       BewbsMastery
// @match        https://www.pokeradar.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22234/Pokemap%20addition%20patch%20%28pokeradario%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22234/Pokemap%20addition%20patch%20%28pokeradario%29.meta.js
// ==/UserScript==
$(function(){
    window.setInterval(function(){
        var container = $(".leaflet-popup").find(".leaflet-popup-content");
        var pokename = container.find("b:eq(0)").text() == "Mr. Mime" ? "MrMime" : container.find("b:eq(0)").text(),
            pokecoor = container.find("b:eq(3)").text(),
            pokelink = "pokesniper2://"+ pokename +"/"+ pokecoor;
        if( container.find(".snipeme").length > 0 )
            container.find(".snipeme").find("a:eq(0)").attr("href" , pokelink);
        else
            container.append("<p class=\"snipeme\"><a href=\""+ pokelink +"\">Snipe me!</a></p>");
    } , 500);
});