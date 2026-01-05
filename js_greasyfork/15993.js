// ==UserScript==
// @name         CrearTema
// @namespace    http://www.taringa.net/Cazador4ever
// @version      2.4
// @description  Crear temas
// @match        *://www.taringa.net/comunidades/-cazadores-/*
//@icon          
// @copyright    Cazador
// @downloadURL https://update.greasyfork.org/scripts/15993/CrearTema.user.js
// @updateURL https://update.greasyfork.org/scripts/15993/CrearTema.meta.js
// ==/UserScript==

(function() {
    var textyboton = $('<center><div class="box box-solid bg-black" style="width:100%; background-color:#AFAFAF">Título:<textarea id="tit" class="user-text" tabindex="700" placeholder="Título" autocomplete="on" style="width:100px; height: 20px; background: rgb(255, 255, 255);resize: yes; "></textarea></br> Video:<textarea id="video" class="user-text" tabindex="700" placeholder="video" autocomplete="on" style="width:100px; height: 20px; background: rgb(255, 255, 255);resize: yes; "></textarea></br><a class="btn g ctm" href="#" id="ctm"><div class="btn-text">Crear</div></a></div></div></center>');
    $('#sidebar').prepend(textyboton)
    
    function reload() {
        var use = $('.user-name').text();
        var use2 = $.trim(use);
        var titulo = $('#titulo-input');
        var tit = $('#tit').val ();
        var vid = $('#video').val ();
        var swf = $('#flash').val ();
        var com = $('#markItUp');
        com.val("").click().focus();
        var lol = '';
        var err = "Error, Faltan Datos."; 
        
        if ((vid == "") || (swf == "")) tit.val(err).click().focus();
        else {
        lol += '[align=center][img]http://k30.kn3.net/taringa/5/3/7/8/2/C/Cazador4ever/B5A.jpg[/img][/align]' + '\n';
	lol += '[font=News Gothic MT]' + '\n';
	if (vid != "" )lol += '[align=center] [video]'+ vid + '[/video][/align]'+ '\n';
	lol += '[/font]' + '\n';
        lol += '[align=center]¡Gracias por pasar![/align]' + '\n';
        lol += '[align=center][url=http://www.taringa.net/' + use2 + ']@'+ use2 +'[/url][/align]' +'\n';
        lol += '\n';
        com.val(lol).click().focus();
        titulo.val(tit).click().focus();
        }
        var use = $('.user-name').text();
        var use2 = $.trim(use);
        var ej= 'https://api.taringa.net/user/nick/view/'+ use2
        $.getJSON( ej, function(json) {
        var jj= $('#markItUp').val();
        var el= $('#markItUp');
        var gg= json.avatar.big;
        var gg2 = '[align=center][img]'+gg+ '[/img][/align]' + '\n';
        var hg = '[align=center][img]http://k46.kn3.net/taringa/8/8/6/5/C/1/Cazador4ever/A27.jpg[/img][/align]' + '\n';
        el.val(jj+gg2+hg).click().focus();});
        } ctm.onclick=reload;
   })();