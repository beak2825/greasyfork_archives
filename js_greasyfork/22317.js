// ==UserScript==
// @name         Temas Moderadores-t para @DarthVader_
// @namespace    http://taringa.net/needrom
// @version      0.1
// @description  creador de temas predeterminado para denuncias (Taringa!)
// @match        *://www.taringa.net/comunidades/moderadores-t/agregar/*
//@icon          http://k33.kn3.net/taringa/1/2/3/2/9/6/48/_serialkiller_/58E.gif
// @copyright    2016, Needrom
// @downloadURL https://update.greasyfork.org/scripts/22317/Temas%20Moderadores-t%20para%20%40DarthVader_.user.js
// @updateURL https://update.greasyfork.org/scripts/22317/Temas%20Moderadores-t%20para%20%40DarthVader_.meta.js
// ==/UserScript==

(function() {
    var textyboton = $('<div class="title clearfix" font-size:12px><h2>Creador de temas</h2>Titulo del tema<select id="titulos" font-size:12px"><option>No Disponible</option><option>Link Prohibidos</option><option>Para Mi Taringa!</option><option>Para Taringa! Comunidades</option><option>No Apto</option><option>Contiene información personal mia o de terceros</option><option>Crap/No aporta</option><option>La fuente es incorrecta o no está presente</option><option>Re-post</option><option>Categoría incorrecta</option><option>Título en mayúsculas o llamativo</option><option>Copyright</option><option>Variado</option><option>Para Denunciar</option><option>Varios</option></select>Razón de la denuncia<select id="razon" font-size:12px"><option>Contenido no disponible (Imagenes o links rotos)</option><option>Contenido discriminatorio u ofensivo</option><option>Contenido para Mi Taringa!</option><option>Contenido para Taringa! Comunidades</option><option>Contiene imágenes de menores con contenido sexual</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.)</option><option>Contiene información personal mia o de terceros</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.)</option><option>Contiene virus, código malicioso o intento de fraude</option><option>Discusión agresiva o no apta en comentarios</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original)</option><option>Post duplicado (Aclarar post original)</option><option>Publicado en Categoría incorrecta</option><option>Título en mayúsculas o llamativo</option><option>Viola derechos de propiedad intelectual/copyright</option><option>Otros motivos (Aclarar)</option></select>  <textarea id="ID1" class="user-text" tabindex="700" placeholder="id (1)" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC1" class="user-text" tabindex="700" placeholder="Aclaración (1)" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> </select>Razón de la denuncia 2<select id="razon2" font-size:12px"><option> </option><option>Contenido no disponible (Imagenes o links rotos)</option><option>Contenido discriminatorio u ofensivo</option><option>Contenido para Mi Taringa!</option><option>Contenido para Taringa! Comunidades</option><option>Contiene imágenes de menores con contenido sexual</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.)</option><option>Contiene información personal mia o de terceros</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.)</option><option>Contiene virus, código malicioso o intento de fraude</option><option>Discusión agresiva o no apta en comentarios</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original)</option><option>Post duplicado (Aclarar post original)</option><option>Publicado en Categoría incorrecta</option><option>Título en mayúsculas o llamativo</option><option>Viola derechos de propiedad intelectual/copyright</option><option>Otros motivos (Aclarar)</option></select>  <textarea id="ID2" class="user-text" tabindex="700" placeholder="id (2)" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC2" class="user-text" tabindex="700" placeholder="Aclaración (2)" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> </select>Razón de la denuncia 3<select id="razon3" font-size:12px"><option> </option><option>Contenido no disponible (Imagenes o links rotos)</option><option>Contenido discriminatorio u ofensivo</option><option>Contenido para Mi Taringa!</option><option>Contenido para Taringa! Comunidades</option><option>Contiene imágenes de menores con contenido sexual</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.)</option><option>Contiene información personal mia o de terceros</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.)</option><option>Contiene virus, código malicioso o intento de fraude</option><option>Discusión agresiva o no apta en comentarios</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original)</option><option>Post duplicado (Aclarar post original)</option><option>Publicado en Categoría incorrecta</option><option>Título en mayúsculas o llamativo</option><option>Viola derechos de propiedad intelectual/copyright</option><option>Otros motivos (Aclarar)</option></select>  <textarea id="ID3" class="emo-text" tabindex="700" placeholder="id (3)" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC3" class="user-text" tabindex="700" placeholder="Aclaración (3)" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <input type="button" id="Creartema" value="Crear Tema" style="height: 45px; background:#4cadfc; color: white; "/></div>');
    $('#sidebar').prepend(textyboton)
    
    
    
    function reload() {
        var titulo = $('#titulo-input');
        var tit = $('#titulos').val ();
        var raz = $('#razon').val ();
        var raz2 = $('#razon2').val ();
        var raz3 = $('#razon3').val ();
        var com = $('#markItUp');
        com.val("").click().focus();
        var ext = $('#ID1').val ();
        var esc = $('#ID2').val ();
        var emt = $('#ID3').val ();
        var ext1 = $('#AC1').val ();
        var esc2 = $('#AC2').val ();
        var emt3 = $('#AC3').val ();
        var lol = '';
        var err = "Error, Faltan Datos."; 
        
        if ((ext == "") || (esc == "") || (emt == "")) titulo.val(err).click().focus();
        else {
        lol += '[align=center][img]https://k60.kn3.net/taringa/4/E/0/C/9/2/DarthVader_/9D0.jpg[/img][/align]' + '\n';
		lol += '[align=center][img]https://k60.kn3.net/taringa/1/6/4/9/C/4/DarthVader_/2F4.jpg[/img][/align]' + '\n';
		lol += '[align=center][img]https://k60.kn3.net/taringa/E/8/8/D/4/B/DarthVader_/B81.png[/img][/align]' + '\n';
        lol += '[align=center][b]Razón de la denuncia: [color=green]' + raz + '[/b][/color][/align]'+ '\n';
		lol += '[align=center][img]http://k02.kn3.net/36CB0B165.png[/img][/align]' + '\n';
        lol += '[b][align=center][url=http://www.taringa.net/index.php?postid=' + ext + ']Post a denunciar[/url][/align][/b]' +'\n';
        lol += '[align=center]id: ' + ext + '[/align]' +'\n';
        if (ext1 != "" )  lol += '[align=center][b]Aclaración: [color=green]' + ext1 + '[/b][/color][/align]'+ '\n';
        lol += '[align=center][img]https://k60.kn3.net/taringa/D/5/4/4/2/7/DarthVader_/097.png[/img][/align]' + '\n';
        lol += '[align=center][b][color=green]' + raz2 + '[/b][/color][/align]'+ '\n';
        lol += '[b][align=center][url=http://www.taringa.net/index.php?postid=' + esc + ']post a denunciar[/url][/align][/b]' +'\n';
        lol += '[align=center]id: ' + esc + '[/align]' +'\n';
        if (esc2 != "" )  lol += '[align=center][b]Aclaración: [color=green]' + esc2 + '[/b][/color][/align]'+ '\n';
        lol += '[align=center][img]https://k60.kn3.net/taringa/D/5/4/4/2/7/DarthVader_/097.png[/img][/align]' + '\n';
        lol += '[align=center][b][color=green]' + raz3 + '[/b][/color][/align]'+ '\n';
        lol += '[b][align=center][url=http://www.taringa.net/index.php?postid=' + emt + ']post a denunciar[/url][/align][/b]' +'\n';
        lol += '[align=center]id: ' + emt + '[/align]' +'\n';
        if (emt3 != "" )  lol += '[align=center][b]Aclaración: [color=green]' + emt3 + '[/b][/color][/align]'+ '\n';
        lol += '[align=center][img]https://k60.kn3.net/taringa/4/A/4/6/5/8/DarthVader_/FA8.gif[/img][/align]' + '\n';
		lol += '\n';
       
        com.val(lol).click().focus();
        titulo.val(tit).click().focus();
        }
    } Creartema.onclick=reload;
    

})();