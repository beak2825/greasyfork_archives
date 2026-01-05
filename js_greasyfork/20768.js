// ==UserScript==
// @name         Listar comandos
// @namespace    Klatu
// @version      1
// @description  Agrega el comando /lc, el cual lista los comandos del chat de Kongregate.
// @author       Klatu
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20768/Listar%20comandos.user.js
// @updateURL https://update.greasyfork.org/scripts/20768/Listar%20comandos.meta.js
// ==/UserScript==

addEventListener('load', function(){
    holodeck.addChatCommand('lc', function(){
        var str='Los comandos son: ';
        for(var comando in holodeck._chat_commands) str+='/'+comando+', ';
        str=str.substring(0, str.length-2)+'.';
        holodeck._active_dialogue.kongBotMessage(str);
        return!1;
    });
});