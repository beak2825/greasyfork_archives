// ==UserScript==
// @name         AhNegao Image Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Põe números nas imagens das coletâneas do site Ah Negão!
// @author       Magnatrom
// @match        https://www.ahnegao.com.br/*/coletanea-de-imagens-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377970/AhNegao%20Image%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/377970/AhNegao%20Image%20Counter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function copyText(number){
    }
    var numberOfImage = 0;
    jQuery(".entry-content").append("<textarea id='toClipboard'></textarea>");
    jQuery(".entry-content p:has(img)").each(function(){
        jQuery(this).css("position","relative");
        numberOfImage++;
        jQuery(this).prepend("<span class='floatingNumber' title='Clique para copiar o link desta imagem para a área de transferência' style='position:absolute;top:10px;right:20px;display:block;width:30px;height:30px;line-height:30px;text-align:center;background:#fbeefb;border:1px solid #c172c3;border-radius:50%;color:#484848;cursor:pointer' id='imagem-"+numberOfImage+"'>"+numberOfImage+"</span>");
    });
    jQuery(".floatingNumber").click(function(){
        var number = jQuery(this).html();
        var link = document.location.href;
        link = link.split("#")[0] + "#imagem-" + number;
        jQuery("#toClipboard").val(link);
        jQuery("#toClipboard").select();
        document.execCommand('copy');
        alert("Link copiado para a área de transferência. Sinta-se livre para colocar nos comentários :]");
    });
    jQuery(document).ready(function(){
        setTimeout(function(){
            var hash = window.location.hash;
            console.log("Console 1: "+hash);
            if(hash.indexOf("imagem-") > -1) {
                console.log("Console 2: Entrou no IF");
                var distance = jQuery(hash).offset().top;
                distance = distance - 58;
                console.log("Console 3: "+distance);
                jQuery(window).scrollTop(distance);
            }
        },1000);
    });
})();