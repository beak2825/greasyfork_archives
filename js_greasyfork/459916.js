// ==UserScript==
// @name         Shoptet Amd+ [FrameStar] - skrytí položek příplatky a příspěvky v editaci položky
// @namespace    http://framestar.cz/
// @version      1.1.2
// @description  Skryje nadbytečné nepoužívané položky, které prodlužují formulář
// @author       FrameStar s.r.o.
// @match        */admin/objednavky-detail/*
// @match        */admin/faktura-detail/*
// @match        */admin/zalohova-faktura-detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medovinarna.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459916/Shoptet%20Amd%2B%20%5BFrameStar%5D%20-%20skryt%C3%AD%20polo%C5%BEek%20p%C5%99%C3%ADplatky%20a%20p%C5%99%C3%ADsp%C4%9Bvky%20v%20editaci%20polo%C5%BEky.user.js
// @updateURL https://update.greasyfork.org/scripts/459916/Shoptet%20Amd%2B%20%5BFrameStar%5D%20-%20skryt%C3%AD%20polo%C5%BEek%20p%C5%99%C3%ADplatky%20a%20p%C5%99%C3%ADsp%C4%9Bvky%20v%20editaci%20polo%C5%BEky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var m = $("meta[name='author']");
    if (m == null || m.length !=1) return;
    if (m.attr("content")!="Shoptet.cz") return;

    $(document).ready(function(){

    // init CSS
    var cssText = "#cboxContent input[type=text].small-4 { text-align:right; }";
    var style=document.createElement('style');
    style.type='text/css';
    if(style.styleSheet){
        style.styleSheet.cssText=css;
    }else{
        style.appendChild(document.createTextNode(cssText));
    }
    document.getElementsByTagName('head')[0].appendChild(style);

    $('#cboxWrapper').on('DOMSubtreeModified', function(){
        if ($("#cboxContent h2.std-header").length==2)
        {
            var h2s = $("#cboxContent h2.std-header");
            $(h2s[0]).closest("tr").hide();
            $(h2s[0]).closest("tr").next().hide();
            $(h2s[1]).closest("tr").hide();
            $(h2s[1]).closest("tr").next().hide();

            $("#cboxContent label[for=recyclingFee]").closest("tr").hide();
            $("#cboxContent label[for=recyclingFeeCategory]").closest("tr").hide();
            $("#cboxContent label[for=recyclingFeeType]").closest("tr").hide();
        }
   });
   });
})();