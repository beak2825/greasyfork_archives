// ==UserScript==
// @name         Resaltador
// @namespace    Klatu
// @version      11
// @description  Resalta los mensajes que contengan ciertas palabras en el chat de kongregate.com.
// @author       Klatu
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20679/Resaltador.user.js
// @updateURL https://update.greasyfork.org/scripts/20679/Resaltador.meta.js
// ==/UserScript==

addEventListener('load', function(){
    //a menos que se especifique lo contrario, podés editar de acá...
    var COLOR_FONDO=localStorage.klatuColorFondo||'purple',  //el script acepta los colores que acepta CSS, es decir, colores en los siguientes formatos: 'color' siendo color el nombre de un color en inglés,
        COLOR_TEXTO=localStorage.klatuColorTexto||'white',   //'#RGB' o '#RRGGBB' siendo R, G y B números del 0 al 9 o letras de la a a la f, 'rgb(R, G, B)' siendo R, G y B números del 0 al 255 y
        COLOR_USUARIO=localStorage.klatuColorUsuario||'white', //'rgba(R, G, B, A)' siendo R, G y B números del 0 al 255 y A siendo un número del 0 al 1
        COLOR_TIMESTAMP=localStorage.klatuColorTimestamp||'white',
        COLOR_REPLY=localStorage.klatuColorReply||'white';

    window.klatu=window.klatu||{}; //no editar
    klatu.resaltador={}; //no editar
    klatu.resaltador.VACIAR_COMPLETAMENTE=false;
    //hasta acá

    klatu.style=klatu.style||document.createElement('style');
    klatu.resaltador.actualizarStyle=function(colores){
        if(colores.texto) klatu.style.innerHTML+=
            '.resaltado{'+
            '    color:'+colores.texto+' !important;'+
            '}';
        if(colores.fondo) klatu.style.innerHTML+=
            '.resaltado{'+
            '    background-color:'+colores.fondo+' !important;'+
            '}';
        if(colores.usuarios) klatu.style.innerHTML+=
            '.resaltado .chat_message_window_username{'+
            '    color:'+colores.usuarios+' !important;'+
            '    font-weight: bold;'+
            '}';
        if(colores.replyLinks) klatu.style.innerHTML+=
            '.resaltado .reply_link{'+
            '    color:'+colores.replyLinks+' !important;'+
            '}';
        if(colores.timestamps) klatu.style.innerHTML+=
            '.resaltado .timestamp {'+
            '    color:'+colores.timestamps+' !important;'+
            '}';
    };
    klatu.resaltador.actualizarStyle({texto:COLOR_TEXTO, usuarios:COLOR_USUARIO, fondo:COLOR_FONDO, replyLinks:COLOR_REPLY, timestamps:COLOR_TIMESTAMP});

    klatu.resaltador.actualizarRegExps=function(){
        klatu.resaltador.regExpAResaltar=[];
        for(var i=0; i<klatu.resaltador.palabrasAResaltar.length; i++){
            klatu.resaltador.regExpAResaltar.push(new RegExp(klatu.resaltador.palabrasAResaltar[i], 'i'));
        }
    };

    klatu.resaltador.PALABRAS_INICIALES_A_RESALTAR=active_user.username(); //separar por ', '

    klatu.resaltador.palabrasAResaltar=(localStorage.klatuPalabrasAResaltar||klatu.resaltador.PALABRAS_INICIALES_A_RESALTAR).toLowerCase().split(', ');
    klatu.resaltador.actualizarRegExps();
    document.head.appendChild(klatu.style);
    holodeck.addChatCommand('agregarapodos', function(a, b){
        var apodos=b.substring(('/agregarapodos ').length).split(', ');
        klatu.resaltador.palabrasAResaltar=Array.prototype.concat(klatu.resaltador.palabrasAResaltar, apodos);
        localStorage.klatuPalabrasAResaltar=klatu.resaltador.palabrasAResaltar.join(', ');
        klatu.resaltador.actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('quitarapodos', function(a, b){
        var i, apodos=b.substring(('/quitarapodos ').length).split(', ');
        for(i=0; i<apodos.length; i++) klatu.resaltador.palabrasAResaltar.splice(klatu.resaltador.palabrasAResaltar.indexOf(apodos[i]), 1);
        localStorage.klatuPalabrasAResaltar=klatu.resaltador.palabrasAResaltar.join(', ');
        klatu.resaltador.actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('sacarapodos', function(a, b){
        var i, apodos=b.substring(('/sacarapodos ').length).split(', ');
        for(i=0; i<apodos.length; i++) klatu.resaltador.palabrasAResaltar.splice(klatu.resaltador.palabrasAResaltar.indexOf(apodos[i]), 1);
        localStorage.klatuPalabrasAResaltar=klatu.resaltador.palabrasAResaltar.join(', ');
        klatu.resaltador.actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('vaciarapodos', function(){
        klatu.resaltador.palabrasAResaltar=klatu.resaltador.VACIAR_COMPLETAMENTE?[]:klatu.resaltador.PALABRAS_INICIALES_A_RESALTAR.split(', ');
        localStorage.klatuPalabrasAResaltar=klatu.resaltador.VACIAR_COMPLETAMENTE?undefined:klatu.PALABRAS_INICIALES_A_RESALTAR;
        klatu.resaltador.actualizarRegExps();
        return!1;
    });
    holodeck.addChatCommand('resaltarfondo', function(a, b){
        var color=b.substring(('/resaltarfondo ').length);
        localStorage.klatuColorFondo=color;
        klatu.resaltador.actualizarStyle({fondo:color});
        return!1;
    });
    holodeck.addChatCommand('resaltartexto', function(a, b){
        var color=b.substring(('/resaltartexto ').length);
        localStorage.klatuColorTexto=color;
        klatu.resaltador.actualizarStyle({texto:color});
        return!1;
    });
    holodeck.addChatCommand('resaltartimestamps', function(a, b){
        var color=b.substring(('/resaltartimestamps ').length);
        localStorage.klatuColorTimestamps=color;
        klatu.resaltador.actualizarStyle({timestamps:color});
        return!1;
    });
    holodeck.addChatCommand('resaltarusuarios', function(a, b){
        var color=b.substring(('/resaltarusuarios ').length);
        localStorage.klatuColorUsuarios=color;
        klatu.resaltador.actualizarStyle({usuarios:color});
        return!1;
    });
    holodeck.addChatCommand('resaltarreplylinks', function(a, b){
        var color=b.substring(('/resaltarreplylinks ').length);
        localStorage.klatuColorReply=color;
        klatu.resaltador.actualizarStyle({replyLinks:color});
        return!1;
    });
    holodeck.addChatCommand('listarregexp', function(a, b){
        var str='Las expresiones regulares resaltadas son: ';
        for(var i=0; i<klatu.resaltador.regExpAResaltar.length; i++) str+=klatu.resaltador.regExpAResaltar[i]+', ';
        str=str.substring(0, str.length-2)+'.';
        holodeck._active_dialogue.kongBotMessage(str);
        return!1;
    });

    ChatDialogue.prototype.displayUnsanitizedMessageAntesDeResaltador=ChatDialogue.prototype.displayUnsanitizedMessage;
    ChatDialogue.prototype.displayUnsanitizedMessage=function(a,b,c,d){
        var resaltar=false, i;
        for(i=0; i<klatu.resaltador.regExpAResaltar.length; i++){
            if(a!=active_user.username()&&!d.private&&klatu.resaltador.regExpAResaltar[i].exec(b)){
                if(c.class) c.class+=' resaltado';
                else c.class='resaltado';
                break;
            }
        }
        this.displayUnsanitizedMessageAntesDeResaltador(a,b,c,d);
    };
});