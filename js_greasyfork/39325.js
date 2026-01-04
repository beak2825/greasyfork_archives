// ==UserScript==
// @name         Revisor de Express
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-Alerta Pasaporte Express
// @author       Jose Ayala
// @match        https://tramites.saime.gob.ve/*
// @grant        GM_xmlhttpRequest
// @connect      generacionenlinea.com.ve
// @downloadURL https://update.greasyfork.org/scripts/39325/Revisor%20de%20Express.user.js
// @updateURL https://update.greasyfork.org/scripts/39325/Revisor%20de%20Express.meta.js
// ==/UserScript==

///////////DATOS DEL USUARIO /////////////
var email = 'joseeayalav@gmail.com'; //Correo para acceder al sistema
var clave = 'jl5qhyt5'; //Clave para acceder al sistema
var numero = '04146494015'; //Numero donde recibira una notificación cuando el express este activo
/////////////////////////////////////////
GMX = GM_xmlhttpRequest;
url = location.href;
error = document.title.indexOf(50) >= 0;
if(error) setTimeout(function(){location.reload();},5000);
else inicio();

function inicio(){
    switch(url){
        case 'https://tramites.saime.gob.ve/index.php?r=inicio/inicio/agilizacion':
            setTimeout(function(){
                try{
                    $('input[title*="Pagar"]')[0].click();
                }catch(e){
                    setTimeout(5000,function(){
                        location.reload();
                    });
                }
            },5000);
            break;
        case 'https://tramites.saime.gob.ve/index.php':
            location.href = 'https://tramites.saime.gob.ve/index.php?r=site/login';
            break;
        case 'https://tramites.saime.gob.ve/index.php?r=site/login':
            setTimeout(function(){
                LoginForm_username.autocomplete = 'off';
                LoginForm_password.autocomplete = 'off';
                LoginForm_username.value = email;
                LoginForm_password.value = clave;
                $('form[id="login-form"]').submit();
            },5000);
            break;
        case 'https://tramites.saime.gob.ve/index.php?r=tramite/tramite/':
            location.href = 'https://tramites.saime.gob.ve/index.php?r=inicio/inicio/agilizacion';
            break;
        case 'https://tramites.saime.gob.ve/index.php?r=/pago/pago/formpago':
            if(localStorage['usmss'] === undefined) localStorage['usms'] = new Date().getTime();
            diff = new Date(new Date().getTime() - localStorage['usms']).getMinutes();
            if(diff > 5) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://generacionenlinea.com.ve/sms/',
                    headers:    {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: 'number='+numero+'&text=Pasaporte Express Abierto a las '+getCT()
                });
                localStorage['usms'] = undefined;
            }
            $('<div id="alerta" style="width: 50vw; height: 50vh; position: fixed; top: 25%; left: 25%; background: white;border: 5px solid black;z-index: 9999"></div>').appendTo('body')
            .append('<h1 style="text-align: center; ">!!Alerta de Express!!</h1></br>')
            .append('<h1 style="text-align: center; color: yellow">'+getCT()+'</h1>')
            .append('</br></br></br><h1 id="cerrarAlerta">Cerrar Alerta</h1>')
            .append('<style>#cerrarAlerta { text-align:center; padding: 2px; border: 1px solid black; background: lightyellow; margin: 5px; transition: 300ms; } #cerrarAlerta:hover{ background: yellow; cursor: pointer; }</style>');
            ;
            var mp3 = document.createElement('audio');
            mp3.src = 'http://www.sonidosmp3gratis.com/sounds/SD_ALERT_36';
            mp3.loop = true;
            mp3.play();
            ic = setInterval(function(){
                if($('#alerta').length>0){
                    if( $('#alerta>h1:first')[0].style.color !== 'red') $('#alerta>h1:first')[0].style.color = 'red';
                    else $('#alerta>h1:first')[0].style.color = 'black';
                }
            },1000);
            cerrarAlerta.onclick = function(){
                clearInterval(ic);
                mp3.pause();
                mp3.src = '';
                alerta.remove();
            };
            break;
    }
}

function getCT(){
    var d = new Date();
    dd = d.getDay();
    dd = dd<10 ? (0+''+dd): dd;
    mm = d.getMonth();
    mm = mm<10 ? (0+''+mm): mm;
    yy = d.getFullYear();
    min = d.getMinutes();
    min = min<10 ? (0+''+min): min;
    hor = d.getHours();
    ampm = hor >= 12 ? 'PM' : 'AM';
    hor = hor>12 ? (hor-12) : hor;
    final = `${dd}/${mm}/${yy}, ${hor}:${min}${ampm}`;
    return final;
}