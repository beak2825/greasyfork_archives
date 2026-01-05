// ==UserScript==
// @name         Notificador de ausencias
// @namespace    Klatu
// @version      1
// @description  Te avisa cuando algún amigo tuyo se va.
// @author       Klatu
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24143/Notificador%20de%20ausencias.user.js
// @updateURL https://update.greasyfork.org/scripts/24143/Notificador%20de%20ausencias.meta.js
// ==/UserScript==

window.addEventListener('load', function(){
    ChatRoom.prototype.userLeftAntesDeNotificadorDeAusencias=ChatRoom.prototype.userLeft;
    ChatRoom.prototype.userLeft=function(a){
        this.userLeftAntesDeNotificadorDeAusencias(a);
        a = a.data.user;
        if(holodeck._chat_window.isFriend(a.username)) this._chat_dialogue.kongBotMessage('Che, '+a.username+' se las tomó.');
    };
});