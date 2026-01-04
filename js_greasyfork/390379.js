// ==UserScript==
// @name         Forocoches ocultar hilos
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Oculta hilos de Forocoches en función de palabras clave o nombres de usuarios
// @author       Leg-ion
// @match        https://www.forocoches.com/foro/forumdisplay*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390379/Forocoches%20ocultar%20hilos.user.js
// @updateURL https://update.greasyfork.org/scripts/390379/Forocoches%20ocultar%20hilos.meta.js
// ==/UserScript==

$(document).ready(function() {
    var filtropalabras = [];
    var filtropalabrasdestacadas = [];
    var filtroautores = [];
    var filtroautoresdestacados = [];




    var hilosocultos = 0;
    $("#table3").after("<div id='titulohilosocultos'></div><div id='ocultos'></div>");
    var threadbits = document.querySelector('[id^="threadbits_forum_"]');
    var hilos = threadbits.getElementsByTagName("tr");
    for (var i = 0; i < hilos.length; i++)
    {
        var hiloelegido = false;

        var hilo = hilos[i].querySelector('[id^="td_threadtitle_"]'); //Hilo
        var titulo = hilo.querySelector('[id^="thread_title_"]').innerHTML; //Titulo
        var titulohover = hilo.title; //Titulo hover
        var enlacehilo = hilo.querySelector('[id^="thread_title_"]').href; //Enlace
        var spans = hilo.getElementsByTagName("div")[1].getElementsByTagName("span");

        //Quitar title del hover
        var tds = hilos[i].getElementsByTagName("td");
        for (var j = 0; j < tds.length; j++)
        {
            $(tds[j]).attr( "title", "" );
        }

        //Poner title del hover
        hilo.querySelector('[id^="thread_title_"]').title = titulohover;

        var autor;
        var pos;

        //Autor
        if (spans.length == 1)
        {
            autor = hilo.getElementsByTagName("div")[1].getElementsByTagName("span")[0];
        }
        else
        {
            autor = hilo.getElementsByTagName("div")[1].getElementsByTagName("span")[1];
        }
        var textoonclick = $(autor).attr("onclick");
        var start = textoonclick.indexOf("?u=");
        var end = textoonclick.indexOf("', '",start+1);
        var enlaceautor = "http://www.forocoches.com/foro/member.php"+textoonclick.substring(start,end); //Enlaceautor




        //Palabras
        for (var k = 0; k < filtropalabras.length; k++)
        {
            pos = titulo.toLowerCase().indexOf(filtropalabras[k].toLowerCase());
            if (pos != -1)
            {
                hilos[i].style.display = "none";
                $("#ocultos").append("<span><a href='"+enlacehilo+"'>"+
                                     titulo.substr(0,pos)+"<span class='textotachado'>"+
                                    titulo.substr(pos,filtropalabras[k].length)+"</span>"+
                                     titulo.substr(pos+filtropalabras[k].length)+"</a>"+
                                     " - <a class='autor' href='"+enlaceautor+
                                     "'><i>"+autor.innerHTML+"</i></a></span>");
                hilosocultos++;
                hiloelegido = true;
                break;
            }
        }

        //Autores
        if (!hiloelegido)
        {
            for (var l = 0; l < filtroautores.length; l++)
            {
                if (autor.innerHTML==filtroautores[l])
                {
                    hilos[i].style.display = "none";
                    $("#ocultos").append("<span><a href='"+enlacehilo+"'>"+
                                         titulo+"</a>"+
                                         " - <a class='autor' href='"+enlaceautor+
                                         "'><span class='textotachado'><i>"+autor.innerHTML+"</i></a></span>");
                    hilosocultos++;
                    hiloelegido = true;
                    break;
                }
            }
        }

        //Palabras destacadas
        if (!hiloelegido)
        {
            for (var m = 0; m < filtropalabrasdestacadas.length; m++)
            {
                pos = titulo.toLowerCase().indexOf(filtropalabrasdestacadas[m].toLowerCase());
                if (pos != -1)
                {
                    $(hilo).css({'text-align':'center','background-color':'#d5e5ee'});
                    hiloelegido = true
                    break;
                }
            }
        }

        //Autores destacados
        if (!hiloelegido)
        {
            for (var n = 0; n < filtroautoresdestacados.length; n++)
            {
                if (autor.innerHTML==filtroautoresdestacados[n])
                {
                    $(hilo).css({'text-align':'center','background-color':'#d5e5ee'});
                    hiloelegido = true
                    break;
                }
            }
        }
    }



    var visible = false;
    $("#titulohilosocultos").append("<span class='big'>"+hilosocultos+" hilos ocultos</span> <span class='small'>(Click para mostrar)</span>");
    if (hilosocultos > 0)
    {
        $("#titulohilosocultos").click(function(){
            if (!visible)
            {
                $("#ocultos").css({"display":"block"});
                $("#titulohilosocultos").children("span.small").html("(Click para ocultar)");
                visible = true;
            }
            else
            {
                $("#ocultos").css({"display":"none"});
                $("#titulohilosocultos").children("span.small").html("(Click para mostrar)");
                visible = false;
            }
        });
    }
    else
    {
        $("#titulohilosocultos").children("span.small").html("");
    }



    //CSS
    $("#titulohilosocultos").css({"padding":"10px 20px","color":"white","background-color":"#5590cc","white-space":"nowrap","font-size":"18px","font-weight":"bold"});
    $("#titulohilosocultos").hover(function(){
  		$("#titulohilosocultos").css("cursor","pointer");
  	});
    $("#titulohilosocultos").children("span.small").css({"font-size":"11px","font-weight":"normal"});
    $("#ocultos").css({"display":"none","background-color":"#F1F1F1","overflow":"hidden","padding":"10px 20px","border":"1px solid #a1a1a1"});
    $("#ocultos").children("span").css({"float":"left","display":"block","clear":"both","padding":"2px"});
    $("#ocultos").children("span").children("a").children("span.textotachado").css({"font-weight":"bold","text-decoration":"line-through","font-size":"15px"});
    $("#ocultos").children("span").children("a.autor").css({"color":"black","font-size":"11px"});

})();