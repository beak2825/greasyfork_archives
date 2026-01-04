// ==UserScript==
// @name         GrowStocks Sprites
// @namespace    https://growstocks.xyz
// @version      0.2
// @description  Displays Growtopia Wiki sprites on the GrowStocks website.
// @author       GrowStocks Development
// @include      https://growstocks.xyz/*
// @icon         https://cdn.growstocks.xyz/main/assets/img/favicon.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/425380/GrowStocks%20Sprites.user.js
// @updateURL https://update.greasyfork.org/scripts/425380/GrowStocks%20Sprites.meta.js
// ==/UserScript==

(function() {
    var ownerDocument = document.implementation.createHTMLDocument('virtual');
    $.get("https://cdn.growstocks.xyz/resources/cors-proxy", function(cors){
        cors = cors.split("|");
        $(".itemChipHead img:not(.arrowIcon)").each(function(){
            let img = $(this);
            let item = img.attr("title").replace(" icon", "");
            let isSeed = item.includes("Seed");
            if(isSeed) item = item.replace(" Seed", "");
            $.get(cors[1]+encodeURIComponent("https://growtopia.fandom.com/wiki/"+item), function(data){
                if(!isSeed){
                    var image = $(data, ownerDocument).find(".mw-headline .growsprite img").attr("src");
                }else{
                    var image = $(data, ownerDocument).find(".seedColor .seed.growsprite img").attr("src");
                }
                if(image) img.attr("src", cors[1]+encodeURIComponent(image));
            });
        });
    });
})();