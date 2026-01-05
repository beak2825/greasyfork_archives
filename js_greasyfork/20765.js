// ==UserScript==
// @name         Notificador de mensajes
// @namespace    Klatu
// @version      2
// @description  Te notifica cuando alguien habla en una sala privada
// @author       You
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20765/Notificador%20de%20mensajes.user.js
// @updateURL https://update.greasyfork.org/scripts/20765/Notificador%20de%20mensajes.meta.js
// ==/UserScript==

var CANT_MENSAJES_PARA_NOTIFICAR=8,
    URL_DEL_SONIDO_DE_NOTIFICACION='https://notificationsounds.com/soundfiles/68ce199ec2c5517597ce0a4d89620f55/file-sounds-954-all-eyes-on-me.mp3'; //tiene que ir entre comillas (") o apóstrofes (')

window.klatu=window.klatu||{};

klatu.beep=document.createElement('audio');
klatu.beep.src=URL_DEL_SONIDO_DE_NOTIFICACION;
klatu.beep.id='beep';
document.body.appendChild(klatu.beep);

ChatRoom.prototype.notificar=function(username){
    if(this.shortName().substring(0, 8)=='room_kpr'&&holodeck._active_dialogue.mensajesNormalesDesdeNotificacion>=CANT_MENSAJES_PARA_NOTIFICAR){
        holodeck._active_dialogue.kongBotMessage('Che, '+username+' está hablando en el room privado.');
        klatu.beep.play();
        holodeck._active_dialogue.mensajesNormalesDesdeNotificacion=0;
    }
    return true;
};
ChatRoom.prototype.receivedMessageAntesDeNotificador=ChatRoom.prototype.receivedMessage;
ChatRoom.prototype.receivedMessage=function(a) {
    if(!this.isActive()) this.notificar(a.data.user.username);
    this.receivedMessageAntesDeNotificador(a);
};
ChatWindow.prototype.setActiveRoomAntesDeNotificador=ChatWindow.prototype.setActiveRoom;
ChatWindow.prototype.setActiveRoom=function(a){
    this.setActiveRoomAntesDeNotificador(a);
    this._holodeck._active_dialogue.mensajesNormalesDesdeNotificacion=CANT_MENSAJES_PARA_NOTIFICAR;
};
ChatDialogue.prototype.displayUnsanitizedMessageAntesDeNotificador=ChatDialogue.prototype.displayUnsanitizedMessage;
ChatDialogue.prototype.displayUnsanitizedMessage=function(a, b, c, d){
    this.displayUnsanitizedMessageAntesDeNotificador(a, b, c, d);
    this.mensajesNormalesDesdeNotificacion++;
};