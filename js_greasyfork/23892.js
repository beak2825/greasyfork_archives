// ==UserScript==
// @name         Nombres con diferentes colores (para Uli)
// @namespace    Klatu
// @version      1
// @description  Cambia los colores de los nombres de la gente que tenés agregada, de los moderadores y de la persona más guapa de Argentina.
// @author       Klatu
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23892/Nombres%20con%20diferentes%20colores%20%28para%20Uli%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23892/Nombres%20con%20diferentes%20colores%20%28para%20Uli%29.meta.js
// ==/UserScript==

// el color para los mods va a ser #9932CC

var klatu;
klatu=klatu||{};
klatu.style=klatu.style||document.createElement('style');

klatu.style.innerHTML+=
    '#kong_game_ui .chat_message_window .juli.received_whisper .chat_message_window_username{'+
    '    color: #006400;'+ //este es el color del nombre de Juli
    '}'+
    '#kong_game_ui .chat_message_window .juli .chat_message_window_username{'+
    '    color: #7FFFD4;'+ //este es el color del nombre de Juli
    '}'+
    '#kong_game_ui .chat_message_window .amigo .chat_message_window_username{'+
    '    color: #FFB6C1;'+ //este es el color de los nombres de tus amigos
    '}'+
    '#kong_game_ui .chat_message_window .juli:not(.whisper), #kong_game_ui .chat_message_window .even.juli:not(.whisper){'+
    '    background-color: #DB7093;'+ //y este el color del fondo de los mensajes de juli
    '}';

ChatDialogue.prototype.displayUnsanitizedMessageAntesDeNombresConDiferentesColores=ChatDialogue.prototype.displayUnsanitizedMessage;
ChatDialogue.prototype.displayUnsanitizedMessage=function(a, b, c, d){
    var clase=c.class;
    if(a==='casltegames') clase+=' juli';
    else if(holodeck._chat_window.isFriend(a)) clase+=' amigo';
    this.displayUnsanitizedMessageAntesDeNombresConDiferentesColores(a, b, {class:clase}, d);
};

document.head.appendChild(klatu.style);