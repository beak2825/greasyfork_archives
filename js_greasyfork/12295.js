// ==UserScript==
// @name         ShurFiltro++
// @namespace    https://greasyfork.org/es/scripts/7200-shurfiltro
// @version      0.1.3.6.9
// @description  Filtro de hilos para ForoCoches
// @author       Raticulin + kbronctjr92
// @match        https://www.forocoches.com/foro/forumdisplay.php?f=2*
// @grant        none
// @require 	 http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/12295/ShurFiltro%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/12295/ShurFiltro%2B%2B.meta.js
// ==/UserScript==
$(document).ready(function(){

    var filtropalabras = ['futbol','chupipandi','peña','penya','Vol.','Vol','plataforma','volumen','La Peñita del Tomate','Nido de cuervos']; //Introducir las palabras clave entre comillas y separadas con una coma
    //Por ejemplo: var filtropalabras = ['futbol','chupipandi','peña','penya','Vol.','Vol','plataforma','volumen','La Peñita del Tomate'];

    var filtroautores = ['Gervasio','funkalo']; //Introducir el nombre exacto del usuario entre comillas y separados con espacio. 
    //Por ejemplo: var filtroautores = ['Gervasio','funkalo'];

    var autoresResaltar = ['Highroad', 'Decaster', 'Llopito', 'Colmi Dvz']; //Introducir el nombre exacto del usuario entre comillas y separados con espacio. 
    //Por ejemplo: var autoresResaltar = ['Highroad', 'Decaster', 'Llopito', 'Colmi Dvz'];

    var palabrasResaltar = ['+18','+16','+17','+14','+15','oslafo','telafo','melafo','tefo','mefo','osfo','tds','pts','t_d_s','p_t_s','lcs','l_c_s','tema serio','+hd','+prv']; //Introducir las palabras clave entre comillas y separadas con una coma
    //Por ejemplo: var palabrasresaltar = ['+18','+16','+17','oslafo','telafo','melafo','tds','pts','t_d_s','p_t_s','lcs','l_c_s','tema serio','+hd','+prv'];

    var color = "#E6E687"; //Color de resaltado, puede ser nombre en ingles, o en formato hexadecimal
    //Por ejemplo: var color="yellow";
    //Hexadecimal: var color="#E6E687";

    var colorAutor = '#BCE9B0'; //Color de resaltado para autores, puede ser nombre en ingles, o en formato hexadecimal

    var visible = false;
    var hilos = document.getElementById("threadbits_forum_2").getElementsByTagName("tr");
    var hilosocultos = 0;

    $("#inlinemodform").children("table").eq(0).after("<div id='ocultos'></div>");

    for(var i = 0; i < hilos.length; i++)
    {
        hilos[i].querySelector('[id^="thread_title_"]').title = hilos[i].querySelector('[id^="td_threadtitle_"]').title;
        hilos[i].querySelector('[id^="td_threadtitle_"]').title = "";

        var hilo = hilos[i].querySelector('[id^="thread_title"]').innerHTML.toLowerCase();
        var hilooculto = false;

        var spanposition = 0;
        if (hilos[i].getElementsByTagName("div")[1].getElementsByTagName("span").length == 2) //Calificacion de tema
        {
            spanposition = 1;
        }

        var urlautor = String(hilos[i].getElementsByTagName("div")[1].getElementsByTagName("span")[spanposition].onclick);
        var start = urlautor.indexOf("=");
        var end = urlautor.indexOf("'", start);
        var codigoautor = urlautor.substr(start+1,end-start-1);
        var nombreautor = hilos[i].getElementsByTagName("div")[1].getElementsByTagName("span")[spanposition].innerHTML;

        //Resaltar por autor con preferencia sobre el ocultamiento y el resaltado por palabras
        for (var j = 0; j < autoresResaltar.length; j++)
        {  
            if (nombreautor==autoresResaltar[j])
            {
                for(var k = 0; k < hilos[i].childElementCount; k++)
                {
                    hilos[i].children[k].style.backgroundColor = colorAutor;
                }   
                hilooculto = true;
                break;
            }
        }

        if (!hilooculto)
        {
            //Ocultar hilos
            for (var j = 0; j < filtropalabras.length; j++)
            {           
                var pos = hilo.indexOf(filtropalabras[j].toLowerCase());
                if (pos!=-1) 
                {
                    hilos[i].style.display = "none";
                    $("#ocultos").append("<span><a href='"+hilos[i].querySelector('[id^="thread_title"]')+"'>"+
                                         hilos[i].querySelector('[id^="thread_title"]').innerHTML.substr(0,pos)+"<b><strike>"+
                                         hilos[i].querySelector('[id^="thread_title"]').innerHTML.substr(pos,filtropalabras[j].length)+"</b></strike>"+
                                         hilos[i].querySelector('[id^="thread_title"]').innerHTML.substr(pos+filtropalabras[j].length)+"</a>"+
                                         " - <a class='autor' href='http://www.forocoches.com/foro/member.php?u="+codigoautor+
                                         "'><i>"+nombreautor+"</i></a></span>");
                    hilosocultos++;
                    hilooculto = true;
                    break;
                }
            }
        }

        if (!hilooculto)
        {
            //Ocultar por autor
            for (var j = 0; j < filtroautores.length; j++)
            {
                if (nombreautor==filtroautores[j])
                {
                    hilos[i].style.display = "none";
                    $("#ocultos").append("<span><a href='"+hilos[i].querySelector('[id^="thread_title"]')+"'>"+
                                         hilos[i].querySelector('[id^="thread_title"]').innerHTML+"</a>"+
                                         " - <a class='autor' href='http://www.forocoches.com/foro/member.php?u="+codigoautor+
                                         "'><b><strike><i>"+nombreautor+"</i></strike></b></a></span>");
                    hilosocultos++;
                    hilooculto = true;
                    break;
                }
            }
        }

        if (!hilooculto)
        {
            //Resaltar hilos
            for (var j = 0; j < palabrasResaltar.length; j++)
            {           
                var palabra = hilo.indexOf(palabrasResaltar[j].toLowerCase());
                if (palabra!=-1)
                {
                    for(var k = 0; k < hilos[i].childElementCount; k++)
                    {
                        hilos[i].children[k].style.backgroundColor = color;
                    }          
                    break;
                }
            }
        }

    }

    $("#ocultos").prepend("<div id='titulohilosocultos'><span class='big'>"+hilosocultos+" hilos ocultos</span> <span class='small'>(Click para mostrar)</span></div>");

    $("#titulohilosocultos").click(function(){
        if (!visible)
        {
            //$("#ocultos").children("a").css({"float":"left","display":"block","clear":"both"});  
            $("#ocultos").children("span").css({"float":"left","display":"block","clear":"both"});  
            visible = true;
            $("#ocultos").children("div").children("span.small").html("(Click para ocultar)");
            $("#ocultos").children("div").css({"border-bottom":"thin solid black"});
        }
        else
        {
            //$("#ocultos").children("a").css({"display":"none"}); 
            $("#ocultos").children("span").css({"display":"none"}); 
            visible = false;
            $("#ocultos").children("div").children("span.small").html("(Click para mostrar)");
            $("#ocultos").children("div").css({"border-bottom":"none"});
        }
    });

    //CSS
    $("#ocultos").css({"border":"2px solid #a1a1a1","min-height":"20px","overflow":"hidden","background-color":"#d5e5ee"}); 
    $("#ocultos").children("div").children("span.big").css({"font-size":"22px","font-weight":"bold"});
    $("#ocultos").children("div").children("span.small").css({"font-size":"10px"});
    $("#ocultos").children("span").css({"display":"none","margin":"2px 10px"});
    $("#ocultos").children("span").children("a.autor").css({"text-decoration":"none","cursor":"pointer","color":"black"});
    $("#titulohilosocultos").css({"padding":"10px 20px"});

    $("#titulohilosocultos").hover(function(){
        $("#titulohilosocultos").css("cursor","pointer");
    });
});