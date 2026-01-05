// ==UserScript==
// @name         Combos Faciles de Sacar
// @namespace    http://esteban22x.com
// @version      1.0.3
// @description  Conseguir los combos mas rapido que nunca
// @author       Esteban22x
// @match        https://guitarflash.net/*
// @match        http://guitarflash.com/* 
// @match        http://guitarflash.me/* 
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// @grant        GM_xmlhttpRequest
// @resource     recarga http://k46.kn3.net/8/A/9/5/C/9/C2D.png
// @downloadURL https://update.greasyfork.org/scripts/16012/Combos%20Faciles%20de%20Sacar.user.js
// @updateURL https://update.greasyfork.org/scripts/16012/Combos%20Faciles%20de%20Sacar.meta.js
// ==/UserScript==


var banderazo = true;
var MutationObserver = window.MutationObserver;
var myObserver       = new MutationObserver (mutationHandler);
var obsConfig        = {
    childList: true, attributes: true,
    subtree: true,   attributeFilter: ['src']
};
myObserver.observe (document.querySelector("#gf-root"), obsConfig);
function mutationHandler (mutationRecords) {

    mutationRecords.forEach ( function (mutation) {

        if (    mutation.type               == "childList"
            &&  typeof mutation.addedNodes  == "object"
            &&  mutation.addedNodes.length
        ) {
            for (var J = 0, L = mutation.addedNodes.length;  J < L;  ++J) {
                
                buscoScript(mutation.addedNodes[J]);
            }
        }
        else if (mutation.type == "attributes") {
            
            buscoScript(mutation.target);
        }
    } );
}
function buscoScript(node){
    if (node.nodeType==1 && 'null' != node.getAttribute("src")){
        if (node.getAttribute("src").substr(0,52) == "//www.guitar-flash.com/facebook/asp/musica.asp?func=" || node.getAttribute("src").substr(0,52) == "http://www.guitar-flash.com/site/asp/musica.asp?func"){
            
            var link = node.getAttribute("src");
            cancion =  link.split("=")[3].split("&")[0];
            dificultad = link.split("=")[5].split("&")[0];
            switch(dificultad){
                case 'a':
                    dificultad = 1;
                    break;
                case 'b':
                    dificultad = 2;
                    break;
                case 'c':
                    dificultad = 3;
                    break;
                case 'd':
                    dificultad = 4;
                    break;
            }
            pedidoRe(cancion,dificultad);
            
        }
    }
}
function pedidoRe(cancion,difi){
    
    pasar = "http://www.esteban22x.com/pc/api/verCombo/"+cancion+"/"+difi;
    GM_xmlhttpRequest({
        method: "GET",
        url: pasar,
        onload: function(response) {
            $("#jogoRodape li:nth-child(1)").show();
            $("#jogoRodapeBts1").hide();
            $("#jogoRodapeBts2").hide();
            $("#jogoRodapeBts2 img").remove();
            $("#jogoRodapeBts2").prepend("<img style='cursor:pointer' onclick='normalidad()' src='http://k46.kn3.net/8/A/9/5/C/9/C2D.png' border='0'>");
            if (banderazo){
                $("#jogoRodape ul").prepend("<li>"+response.responseText+"<img style='cursor:pointer' onclick='normalidad()' src='http://k46.kn3.net/8/A/9/5/C/9/C2D.png' border='0'></li>");
                
                banderazo = false;
            }else{
                $("#jogoRodape li:nth-child(1)").html(response.responseText+"<img style='cursor:pointer' onclick='normalidad()' src='http://k46.kn3.net/8/A/9/5/C/9/C2D.png' border='0'>");
            }
            $("#jogoRodapeBts2").css({"width":"550px"});
            $("#jogoRodapeBts2 .b").css({"margin-left":"0"});
            $("#jogoRodape").css("height","70px");
            $("#jogoRodape li:nth-child(1)").css({"color":"#E00000","font-weight":"bold","font-size":"21px","padding-top":"20px","line-height":"0"});
           
        }
});
}
unsafeWindow.normalidad = function(){

    $("#jogoRodapeBts2").toggle();
    $("#jogoRodape li:nth-child(1)").toggle();
}