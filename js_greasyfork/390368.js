// ==UserScript==
// @name         Finofilipino ocultar articulos
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Oculta los articulos que no te interesan buscando los tags de cada articulo
// @author       Leg-ion
// @match        https://finofilipino.org/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390368/Finofilipino%20ocultar%20articulos.user.js
// @updateURL https://update.greasyfork.org/scripts/390368/Finofilipino%20ocultar%20articulos.meta.js
// ==/UserScript==

$(document).ready(function() {

    var tags = []; // Añade los tags que no te interesan ver



    var entries = document.getElementById("entries");
    if(entries === null)
    {
        enlace_video(0, false);
    }
    var articles = entries.getElementsByTagName("article");

    for (var i = 0; i < articles.length; i++)
    {
        var oculto = false;
        var entrytags = articles[i].getElementsByClassName("entry-tags");
        if (entrytags.length > 0)
        {
            var lis = entrytags[0].getElementsByTagName("li");
            if (lis.length > 0)
            {
                for (var j = 0; j < lis.length; j++)
                {
                    var as = lis[j].getElementsByTagName("a");
                    if (jQuery.inArray(as[0].innerHTML.toLowerCase(),tags) != -1)
                    {
                        oculto = true;
                        $(articles[i]).css({display: "none"});
                        break;
                    }
                }
            }
        }





/*

Hay un problema al ejecutar cualquier script en la pagina de Finofilipino, 
el cual no reproduce correctamente cierto tipo de videos. 
Como solucion temporal, debajo de cada video defectuoso aparece el enlace directo para poder verlo.

*/
        if (oculto == false)
        {
            enlace_video(i, true);
        }
    }

    function enlace_video(articulo, principal) {
        var flows;
        if (principal == false)
        {
            flows = document.getElementsByClassName("flowplayer");
        }
        else
        {
            flows = articles[articulo].getElementsByClassName("flowplayer");
        }
        if (flows.length > 0)
        {
            for (var k = 0; k < flows.length; k++)
            {
                var dataitem = $(flows[k]).attr("data-item");
                var start = dataitem.indexOf("http");
                var end = dataitem.indexOf("\",\"", start+1);
                var enlace = dataitem.substring(start, end);

                $(flows[k]).after("<a style='text-align:center; display:block; margin:20px;' href='"+enlace+"'>Enlace al vídeo</a>");
            }
        }
    }
});