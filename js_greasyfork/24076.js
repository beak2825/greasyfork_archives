// ==UserScript==
// @name         Cambiar los colores del chat
// @namespace    Klatu
// @version      8
// @description  Cambia los colores del chat de kongregate.com.
// @author       Klatu
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24076/Cambiar%20los%20colores%20del%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/24076/Cambiar%20los%20colores%20del%20chat.meta.js
// ==/UserScript==

const PALABRAS_INICIALES_A_RESALTAR=active_user.username(); //separar por ', '

var regExpAResaltar;
var style;
var palabrasAResaltar;
var vaciarCompletamente=window.localStorage.klatuVaciarCompletamente==='true';
    
ChatDialogue.prototype.displayUnsanitizedMessageAntesDeResaltador=ChatDialogue.prototype.displayUnsanitizedMessage;
ChatDialogue.prototype.displayUnsanitizedMessage=function(a,b,c,d){
    if(window.localStorage.klatuPalabrasAResaltar===undefined) palabrasAResaltar=PALABRAS_INICIALES_A_RESALTAR.toLowerCase().split(', ');
    else palabrasAResaltar=window.localStorage.klatuSinPalabrasAResaltar==='true'?[]:window.localStorage.klatuPalabrasAResaltar.toLowerCase().split(', ');
    actualizarRegExps();
    for(var i=0; i<regExpAResaltar.length; i++){
        if(a!=active_user.username()&&!d.private&&regExpAResaltar[i].exec(b)){
            if(c.class) c.class+=' resaltado';
            else c.class='resaltado';
            break;
        }
    }
    if(holodeck._chat_window.isFriend(a)){
        if(c.class) c.class+=' amigo';
        else c.class='amigo'
    }
    console.log(c.class);
    if(a==='Klatu'&&(!c.class||c.class.indexOf('sent_whisper')===-1)||(c.class&&c.class.indexOf('sent_whisper')!==-1&&active_user.username()==='Klatu')) b=b.replace(/&lt;3/g, '<span class=\'purple\'>❤</span>');
    if(a==='niina22'&&(!c.class||c.class.indexOf('sent_whisper')===-1)||(c.class&&c.class.indexOf('sent_whisper')!==-1&&active_user.username()==='niina22')) b=b.replace(/&lt;3/g, '<span class=\'blue\'>❤</span>');
    this.displayUnsanitizedMessageAntesDeResaltador(a,b,c,d);
};
function actualizarStyle(colores){
    style.innerHTML='.purple{color:purple;}.blue{color:blue;}'
    if(colores.texto) style.innerHTML+=
        '.resaltado{'+
        '    color:'+colores.texto+' !important;'+
        '}';
    else style.innerHTML+=
        '.resaltado{'+
        '    background-color:'+window.localStorage.klatuColorTexto+' !important;'+
        '}';
    if(colores.fondo) style.innerHTML+=
        '.resaltado{'+
        '    background-color:'+colores.fondo+' !important;'+
        '}';
    else style.innerHTML+=
        '.resaltado{'+
        '    background-color:'+window.localStorage.klatuColorFondo+' !important;'+
        '}';
    if(colores.usuarios) style.innerHTML+=
        '.resaltado .chat_message_window_username{'+
        '    color:'+colores.usuarios+' !important;'+
        '}';
    else style.innerHTML+=
        '.resaltado{'+
        '    background-color:'+window.localStorage.klatuColorUsuarios+' !important;'+
        '}';
    if(colores.replyLinks) style.innerHTML+=
        '.resaltado .reply_link{'+
        '    color:'+colores.replyLinks+' !important;'+
        '}';
    else style.innerHTML+=
        '.resaltado{'+
        '    background-color:'+window.localStorage.klatuColorReply+' !important;'+
        '}';
    if(colores.timestamps) style.innerHTML+=
        '.resaltado .timestamp {'+
        '    color:'+colores.timestamps+' !important;'+
        '}';
    else style.innerHTML+=
        '.resaltado{'+
        '    background-color:'+window.localStorage.klatuColorTimestamps+' !important;'+
        '}';
};

function actualizarRegExps(){
    regExpAResaltar=[];
    for(var i=0; i<palabrasAResaltar.length; i++){
        regExpAResaltar.push(new RegExp(palabrasAResaltar[i], 'i'));
    }
};

window.addEventListener('load', function(){
    const COLOR_FONDO=window.localStorage.klatuColorFondo||'#6495ED';
    const COLOR_TEXTO=window.localStorage.klatuColorTexto||'white';
    const COLOR_USUARIO=window.localStorage.klatuColorUsuarios||'#87CEFA';
    const COLOR_TIMESTAMP=window.localStorage.klatuColorTimestamp||'#BA55D3';
    const COLOR_REPLY=window.localStorage.klatuColorReply||'#F4A460';

    style=document.createElement('style');
    actualizarStyle({texto:COLOR_TEXTO, usuarios:COLOR_USUARIO, fondo:COLOR_FONDO, replyLinks:COLOR_REPLY, timestamps:COLOR_TIMESTAMP});
    document.head.appendChild(style);
    
    holodeck.addChatCommand('agregarapodos', function(a, b){
        var apodos=b.substring(('/agregarapodos ').length).split(', ');
        palabrasAResaltar=Array.prototype.concat(palabrasAResaltar, apodos);
        window.localStorage.klatuPalabrasAResaltar=palabrasAResaltar.join(', ');
        if(palabrasAResaltar.length) window.localStorage.klatuSinPalabrasAResaltar=undefined;
        actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('quitarapodos', function(a, b){
        var i, apodos=b.substring(('/quitarapodos ').length).split(', ');
        for(i=0; i<apodos.length; i++) palabrasAResaltar.splice(palabrasAResaltar.indexOf(apodos[i]), 1);
        window.localStorage.klatuPalabrasAResaltar=palabrasAResaltar.join(', ');
        actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('sacarapodos', function(a, b){
        var i, apodos=b.substring(('/sacarapodos ').length).split(', ');
        for(i=0; i<apodos.length; i++) palabrasAResaltar.splice(palabrasAResaltar.indexOf(apodos[i]), 1);
        window.localStorage.klatuPalabrasAResaltar=palabrasAResaltar.join(', ');
        actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('vaciarapodos', function(){
        palabrasAResaltar=vaciarCompletamente?[]:PALABRAS_INICIALES_A_RESALTAR.split(', ');
        window.localStorage.klatuPalabrasAResaltar=vaciarCompletamente?null:PALABRAS_INICIALES_A_RESALTAR;
        window.localStorage.klatuSinPalabrasAResaltar=vaciarCompletamente;
        actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('resaltarfondo', function(a, b){
        var color=b.substring(('/resaltarfondo ').length);
        window.localStorage.klatuColorFondo=color;
        actualizarStyle({fondo:color});
        return!1;
    });
    holodeck.addChatCommand('resaltartexto', function(a, b){
        var color=b.substring(('/resaltartexto ').length);
        window.localStorage.klatuColorTexto=color;
        actualizarStyle({texto:color});
        return!1;
    });
    holodeck.addChatCommand('resaltartimestamps', function(a, b){
        var color=b.substring(('/resaltartimestamps ').length);
        window.localStorage.klatuColorTimestamps=color;
        actualizarStyle({timestamps:color});
        return!1;
    });
    holodeck.addChatCommand('resaltarusuarios', function(a, b){
        var color=b.substring(('/resaltarusuarios ').length);
        window.localStorage.klatuColorUsuarios=color;
        actualizarStyle({usuarios:color});
        return!1;
    });
    holodeck.addChatCommand('resaltarreplylinks', function(a, b){
        var color=b.substring(('/resaltarreplylinks ').length);
        window.localStorage.klatuColorReply=color;
        actualizarStyle({replyLinks:color});
        return!1;
    });
    holodeck.addChatCommand('listarregexp', function(a, b){
        var str='Las expresiones regulares resaltadas son: ';
        for(var i=0; i<regExpAResaltar.length; i++) str+=regExpAResaltar[i]+', ';
        str=str.substring(0, str.length-2)+'.';
        holodeck._active_dialogue.kongBotMessage(str);
        return!1;
    });
    holodeck.addChatCommand('tvc', function(a, b){
        window.localStorage.klatuVaciarCompletamente=vaciarCompletamente=!vaciarCompletamente
        return!1;
    });
});