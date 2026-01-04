// ==UserScript==
// @name         Shoptet Adm+ [FrameStar] - Vylepšení administrace cen, výpočet slev
// @namespace    http://framestar.cz/
// @version      1.1.1
// @description  Výpočet % slevy u akční ceny
// @author       FrameStar - Jiri Poucek
// @match        */admin/ceny/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medovinarna.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459895/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20Vylep%C5%A1en%C3%AD%20administrace%20cen%2C%20v%C3%BDpo%C4%8Det%20slev.user.js
// @updateURL https://update.greasyfork.org/scripts/459895/Shoptet%20Adm%2B%20%5BFrameStar%5D%20-%20Vylep%C5%A1en%C3%AD%20administrace%20cen%2C%20v%C3%BDpo%C4%8Det%20slev.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // precalc sales
    $(document).ready(function(){
            // init CSS
    var cssText = "div.fs-prices-sale-calc { position: absolute; height: 26px; line-height: 26px; margin-left: 3px; color: gray; }";
    var style=document.createElement('style');
    style.type='text/css';
    if(style.styleSheet){
        style.styleSheet.cssText=css;
    }else{
        style.appendChild(document.createTextNode(cssText));
    }
    document.getElementsByTagName('head')[0].appendChild(style);


        var items = $("form table.v2table td:nth-child(9)"); items.each(function( index ) {
            var it = $(items[index]);
            it.prepend("<div style='width:20px' class='fs-prices-sale-calc'></div>");
            showSale(it.find("input"));
        });

    $("form table.v2table td:nth-child(9) input").on('change',function(e){
        showSale($(this));
    });
    });

    function showSale(input)
    {
        var action = input.val().replace(',','.');
        var prevCell = input.closest("td").prev();
        var standard = prevCell.find("input").val().replace(',','.');
        if (action == "") return;
        if (standard == "") return;
        var sale = (100 - action / standard * 100);
        input.closest("td").find("div.fs-prices-sale-calc").text("-" + Math.round(sale) + "%");
    }

})();