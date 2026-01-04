// ==UserScript==
// @name         Musicar-Pro
// @namespace    http://tampermonkey.net/
// @version      10.2.9
// @description  Refrescar página Musicar
// @author       juancsuareza@gmail.com
// @match        https://server1.locutorvirtual.com.co/*
// @match        http://208.76.80.10/*
// @exclude      *index.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/383594/Musicar-Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/383594/Musicar-Pro.meta.js
// ==/UserScript==

//desactivar para que el audio suene sin interacción del usuario   chrome://flags/#autoplay-policy

(function() {
    'use strict';
//console.log("inicia script");


var sec = 0;
var audioElement = document.createElement('audio');
//audioElement.setAttribute('src', 'https://audio.jukehost.co.uk/3949cca25e8e6a669cc11a7408ebd7a15093322f/0eff920eb4a');
audioElement.setAttribute('src', 'http://soundbible.com/mp3/Doorbell-SoundBible.com-516741062.mp3');



function playAudio() {

 if (getCookie('audio')) {//si la cookie no ha caducado, no reproducir la alerta

     console.log("---cookie existe---");
     return;
 }
 else {
     console.log("---registrando cookie---");
   document.cookie = 'audio=1;max-age=60;path=/';
   audioElement.play();
  }
}

function getCookie(key) {
	var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

//confirmar si se está en la página de monitor
if (window.location.href.indexOf('/dev_monitorlocutor/') > 0) {

    //estilos de blinking cell
    GM_addStyle('@-webkit-keyframes blinking-cell {  from { background-color: red; }  to { background-color: inherit; }}');
    GM_addStyle('@-moz-keyframes blinking-cell {  from { background-color: red; }  to { background-color: inherit; }}');
    GM_addStyle('@-o-keyframes blinking-cell {  from { background-color: red; }  to { background-color: inherit; }}');
    GM_addStyle('@keyframes blinking-cell {  from { background-color: red; }  to { background-color: inherit; }}');
    GM_addStyle('.blinking-cell { -webkit-animation: blinking-cell 1s infinite; -moz-animation: blinking-cell 1s infinite; -o-animation: blinking-cell 1s infinite; animation: blinking-cell 1s infinite; }');

    //monitorear cambios en las celdas
    $("body").on('DOMSubtreeModified', "table tbody p", function() {
        if ($(this).text() != 0) {
            console.log ("cell changed");
            $(this).closest('td').addClass('blinking-cell')
             playAudio()
        }
        else
            $(this).closest('td').removeClass('blinking-cell');
    });

    //modificar los links para que no dirijan al login y no se cierre la sesión en monitor
    $('table a').each(function(){
        $(this).attr('href',$(this).attr('href') + 'inicio.php');
    });

    return; //no ejecutar el resto del código que no aplica para el monitor
}

//importar moment.js
var cdn = document.createElement('script');
cdn.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js";
document.getElementsByTagName('head')[0].appendChild(cdn);

//Confirmar si hay mensajes
if ( $('.Grupo_Mensajes').children().length > 1 || $('#Grupo_Mensajes').children().length > 1){
    sec = 60;
    console.log("Se encontraron mensajes");
   playAudio()
}
else  {
    sec = 15;
}

//Contador de audios
var $divcount = $('<div />').appendTo('body');
$divcount.attr('id', 'count');
var totalAudios = $( ".ui-accordion-header" ).length;
$('#count').text( totalAudios + ' audio' + (totalAudios==1?'':'s') );

//barra de herramientas
var $toolbar = $('<div> <div class="toolbar-icon pause"></div></div>').appendTo('body');
$toolbar.attr('id', 'toolbar');
$( ".toolbar-icon.pause" ).click(function() {
    $(this).toggleClass('paused');
});

//Temporizador
var $divtimer = $('<div />').appendTo('body');
$divtimer.attr('id', 'timer');

var aprobar = ($('.page-header h1:contains("Aprobar")').length>0);
if (aprobar && totalAudios>0) {
     $('#timer').html('Aprobar todos <div class="toolbar-todos"></div>');
}
else {
    var timer = setInterval(function() {
        if ($('audio').length===0 && !$(".toolbar-icon.pause").hasClass('paused') ) //Si no está cargando un audio y no está en pausa el botón, reste al tiempo
            $('#timer').text(sec--);

        //Refrescar la página al terminar el tiempo
        if (sec === 0) {
            clearInterval(timer);
            submit_form(2,1);
        }
    }, 1000);
}

//Copiar al portapapeles el texto del mensaje
$( ".ui-accordion-header" ).click(function() {
   //omitir hijos en la selección
   var texto =  $(this).clone().children().remove().end().text();
   texto = $.trim ( texto );
   copyToClipboard( texto );
});

function copyToClipboard(texto) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(texto).select();
    document.execCommand("copy");
    $temp.remove();
}


//Ajustar estilo de los textos
$('textarea[id^=texto]').attr({'readonly':false,'cols':''}).width('95%').height('200px');

//Corregir titulos
var url = window.location.href;
var urls =['olimpicaprog','mercamioprog','mercasurprog','gobsantanderprog','callesoroprog','micentroprog','musicarprog'];
var titulos = ['OLÍMPICA','MERCAMÍO','MERCASUR','GOBERNACIÓN','CC CALLES DE ORO','MI CENTRO FUNZA','MUSICAR'];
for (var i=0;i<urls.length;i++) {
    if ( url.indexOf(urls[i]) > 0 )
        $('.header').text(titulos[i]);
}


//Consultar tiempos de los audios
$( ".ui-accordion-header" ).each ( function (i,accordion) {
    var idTab = $( accordion ).attr('aria-controls');

    var idAudio = $('#'+idTab +' #'+idTab.replace('pestana','cdgo_mensaje') ).val();
    console.log (idAudio);

    $.ajax({
        url:'ventanas/ver_tiempos.php',
        data: {cdgo_mensaje: idAudio},
        dataType: 'HTML',
        cache: false,
        success: function (result){

            //encontrar celda con tiempo de asignación y traer la hora
            var asignado = $(result).find('td:contains("Asignación")').siblings(":last").text();
            console.log (asignado);

            //cambiar respuestas de fromNow
            var tiempo = moment(asignado, "hh:mm:ss").fromNow(true);
            tiempo = tiempo.replace ('minutes','min');
            tiempo = tiempo.replace ('a minute','1 min');
            tiempo = tiempo.replace ('minute','min');
            tiempo = tiempo.replace ('a few seconds','<1 min');

            var $divtiempo = $('<div />').appendTo(accordion);
            $divtiempo.attr({id: 'tiempo'+idAudio, class:'tiempo',title:asignado});
            $('#tiempo'+idAudio).text( tiempo );

        },
        error: function (result) {
            console.log ('Ajax call failed');
            //console.log (result);
        }
    });
});


//aprobar todos
$( ".toolbar-todos" ).click(function() {
    console.log ("Aprobar todos");
    var totalAudios = $( ".ui-accordion-header" ).length;
    $( ".ui-accordion-header" ).each ( function (i,accordion) {
        var idTab = $( accordion ).attr('aria-controls');
        var idAudio = $('#'+idTab +' #'+idTab.replace('pestana','cdgo_mensaje') ).val();
        console.log ("Aprobando audio " + idAudio);
        var parametros = {
            "parametro" : "31" ,
            "cdgo_mensaje": idAudio
        };
        $.ajax({
            data: parametros,
            type: 'POST',
            url: "guardar/guardar_esquema.php",
            dataType: 'html',
            success: function(data) {
                console.log ("Audio aprobado " + idAudio);
                totalAudios--;//disminuye el total de audios cada vez que uno es procesado
                if (totalAudios == 0) { //si ya no hay más por procesar, refrescar la página
                    document.getElementById("est").value=2;
                    document.getElementById("est2").value=2;
                    document.getElementById("menu").submit();
                }
            },
            error: function(e, ts, et) {
                alert("Problemas al momento de guardar los cambios esta accionn no fueron \nalamacenados en la base de datos por favor intenete de nuevo");
                alert(e.status+ts);
            }
        });
    });
});




//habilitar tooltips de jqueyUI
$(document).tooltip();

//Versión script
var $divversion = $('<div />').appendTo('body');
$divversion.attr('id', 'version');
$('#version').html('<a href="https://greasyfork.org/es/scripts/370568-musicar/versions" target="_blank">Versión script: '+ GM_info.script.version+'</a>');

//Estilos
GM_addStyle('#timer { font-size: 40px; position: fixed; bottom: 0;left: 30px;}');
GM_addStyle('#count { font-size: 40px; position: fixed; bottom: 40px;}');
GM_addStyle('#toolbar { position: fixed; bottom: 12px; left: 3px;}');
GM_addStyle('#version { font-size: 14px; position: fixed; bottom: 80px; left: 3px;}');
GM_addStyle('#version a { text-decoration: none;}');
GM_addStyle('#toolbar .toolbar-icon,.toolbar-todos { font-size: 25px; cursor:pointer; height: 24px; width: 24px;}');
GM_addStyle('h1 { font-size: 24px !important; }');
GM_addStyle('.header { padding: 5px 0 !important; }');
GM_addStyle('.tiempo { position: absolute; color: red; top: 3px; right: -67px; width: 60px; text-align: center; background: #45ff45; font-weight: bold; padding: 4px 2px; text-shadow: 0 0 10px #FFFFFF, 0px 0px 0px rgba(28,110,164,0); }');
GM_addStyle('.Grupo_Mensajes,#Grupo_Mensajes,#accordion { margin-right: 58px;}');

//Iconos src: https://www.flaticon.com/free-icon/play-sign_25306
GM_addStyle('#toolbar .toolbar-icon {background-image: url("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMCA1MTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0icGF1c2UtY2lyY2xlLWZpbGwiPgoJCTxwYXRoIGQ9Ik0yNTUsMEMxMTQuNzUsMCwwLDExNC43NSwwLDI1NXMxMTQuNzUsMjU1LDI1NSwyNTVzMjU1LTExNC43NSwyNTUtMjU1UzM5NS4yNSwwLDI1NSwweiBNMjI5LjUsMzU3aC01MVYxNTNoNTFWMzU3eiAgICAgTTMzMS41LDM1N2gtNTFWMTUzaDUxVjM1N3oiIGZpbGw9IiMwMDZERjAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"); }');
GM_addStyle('#toolbar .toolbar-icon.paused {background-image: url("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQzOC41MzMgNDM4LjUzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDM4LjUzMyA0MzguNTMzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTQwOS4xMzMsMTA5LjIwM2MtMTkuNjA4LTMzLjU5Mi00Ni4yMDUtNjAuMTg5LTc5Ljc5OC03OS43OTZDMjk1LjczNiw5LjgwMSwyNTkuMDU4LDAsMjE5LjI3MywwICAgYy0zOS43ODEsMC03Ni40NjYsOS44MDEtMTEwLjA2MywyOS40MDdjLTMzLjU5NSwxOS42MDQtNjAuMTkyLDQ2LjIwMS03OS44LDc5Ljc5NkM5LjgwMSwxNDIuOCwwLDE3OS40ODksMCwyMTkuMjY3ICAgczkuODA0LDc2LjQ2MywyOS40MDcsMTEwLjA2MmMxOS42MDcsMzMuNTg1LDQ2LjIwNCw2MC4xODksNzkuNzk5LDc5Ljc5OGMzMy41OTcsMTkuNjA1LDcwLjI4MywyOS40MDcsMTEwLjA2MywyOS40MDcgICBzNzYuNDctOS44MDIsMTEwLjA2NS0yOS40MDdjMzMuNTkzLTE5LjYwMiw2MC4xODktNDYuMjA2LDc5Ljc5NS03OS43OThjMTkuNjAzLTMzLjU5OSwyOS40MDMtNzAuMjg3LDI5LjQwMy0xMTAuMDYyICAgQzQzOC41MzMsMTc5LjQ4OSw0MjguNzMyLDE0Mi43OTUsNDA5LjEzMywxMDkuMjAzeiBNMzI4LjkwNCwyMzQuOTY2TDE3My41ODgsMzI2LjMzYy0yLjg1NiwxLjcxMS01LjkwMiwyLjU2Ny05LjEzNiwyLjU2NyAgIGMtMy4wNDUsMC02LjA5LTAuNzY0LTkuMTM1LTIuMjg2Yy02LjA5LTMuNjE0LTkuMTM2LTguOTM5LTkuMTM2LTE1Ljk4NVYxMjcuOTA3YzAtNy4wNDEsMy4wNDYtMTIuMzcxLDkuMTM2LTE1Ljk4NyAgIGM2LjI4LTMuNDI3LDEyLjM2OS0zLjMzMywxOC4yNzEsMC4yODRsMTU1LjMxNiw5MS4zNmM2LjA4OCwzLjQyNCw5LjEzNCw4LjY2Myw5LjEzNCwxNS43MDMgICBDMzM4LjAzOCwyMjYuMzA4LDMzNC45OTIsMjMxLjUzNywzMjguOTA0LDIzNC45NjZ6IiBmaWxsPSIjRDgwMDI3Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="); }');
GM_addStyle('.toolbar-todos {display: inline-block;background-image: url("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0MjYuNjY3IDQyNi42NjciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQyNi42NjcgNDI2LjY2NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8cGF0aCBzdHlsZT0iZmlsbDojNkFDMjU5OyIgZD0iTTIxMy4zMzMsMEM5NS41MTgsMCwwLDk1LjUxNCwwLDIxMy4zMzNzOTUuNTE4LDIxMy4zMzMsMjEzLjMzMywyMTMuMzMzICBjMTE3LjgyOCwwLDIxMy4zMzMtOTUuNTE0LDIxMy4zMzMtMjEzLjMzM1MzMzEuMTU3LDAsMjEzLjMzMywweiBNMTc0LjE5OSwzMjIuOTE4bC05My45MzUtOTMuOTMxbDMxLjMwOS0zMS4zMDlsNjIuNjI2LDYyLjYyMiAgbDE0MC44OTQtMTQwLjg5OGwzMS4zMDksMzEuMzA5TDE3NC4xOTksMzIyLjkxOHoiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="); }');

})();