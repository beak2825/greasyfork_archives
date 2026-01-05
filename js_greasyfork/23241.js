// ==UserScript==
// @name     Free SMS
// @description :)
// @include  https://translate.google.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_xmlhttpRequest
// @connect  www.smsdigital.com.ve
// @version  1.1
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/23241/Free%20SMS.user.js
// @updateURL https://update.greasyfork.org/scripts/23241/Free%20SMS.meta.js
// ==/UserScript==

// Revisar Recibidos http://www.smsdigital.com.ve/newver/account/smsIn.asp
function login(user,pass,callback){
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.smsdigital.com.ve/newver/login/auth.asp?usuario="+user+"&clave="+pass,
        onload:     callback,
    } );
}

function sms() {
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.smsdigital.com.ve/newver/account/incSnd.asp?text_area_input="+mensaje.value+"&destino="+numero.value,
        onload:     function(e){
            if(e.response.indexOf('Mensaje Enviado') != -1){
                GM_xmlhttpRequest ( {
                    method:     "GET",
                    url:        "http://www.smsdigital.com.ve/newver/account/myCredits.asp",
                    onload:     function(e){
                        alert('Mensaje Enviado, Restantes: '+$(e.response).find('.auto-welcome b')[1].innerText);
                    }
                } );
            }
        }
    } );
}
document.body.innerHTML = "";
document.head.innerHTML = "";
$('body').append('<table style="width:50%; margin-left:25%">');
$('table').append('<tr style="border: 1px solid black" id="title"><th>Envio de Mensajes</th></tr>');
$('table').append('<tr style="border: 1px solid black"><td>Numero</td><td><input id="numero" type="numeric"></td></tr>');
$('table').append('<tr style="border: 1px solid black"><td>Mensaje</td><td><textarea id="mensaje"></textarea></td></tr>');
$('table').append('<tr style="border: 1px solid black"><td><button id="enviar">Enviar</button></td></tr>');
enviar.onclick = function(){
    login('ayalita1997','123qw123',sms);
};
