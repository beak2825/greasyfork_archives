// ==UserScript==
// @name         /mute y /unmute
// @namespace    Klatu
// @version      3
// @description  Agrega al chat de kongregate.com el comando /mute [-l] <nombres separados por espacio>.
// @author       Klatu
// @match        http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24148/mute%20y%20unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/24148/mute%20y%20unmute.meta.js
// ==/UserScript==

document.observe('holodeck:ready', function() {
    holodeck.addChatCommand('mute', function(a, b){
        var listar=false;
        b=b.split(' ');
        b.shift();
        b.each(function(user){
            const regex=/^[0-9a-zA-Z][\w]{3,15}$/;
            if(user==='-l'||user==='--list') listar=true;
            else if(regex.exec(user)!==null){
                holodeck.addMuting(user);
                new Ajax.Request("/accounts/"+holodeck.username()+"/muted_users?username="+user+"&from_chat=true",{
                    asynchronous: !0,
                    evalScripts: !0,
                    method: "post"
                });
                holodeck._active_dialogue.kongBotMessage(user+' muteado.');
            }
        });
        if(listar){
            var msj='Muteaste a las siguientes cuentas: ';
            for(var user in holodeck._chat_window._mutings) if(holodeck._chat_window._mutings[user]) msj+=user+', ';
            msj=msj.substring(0, msj.length-2)+'.'; //elimina el último ', ' y agrega un '.'
            holodeck._active_dialogue.kongBotMessage(msj);
        }
        return!1;
    });
    holodeck.addChatCommand('unmute', function(a, b){
        var listar=false;
        b=b.split(' ');
        b.shift();
        b.each(function(user){
            const regex=/^[0-9a-zA-Z][\w]{3,15}$/;
            if(user==='-l'||user==='--list') listar=true;
            else if(regex.exec(user)!==null){
                holodeck.removeMuting(user);
                new Ajax.Request("/accounts/"+holodeck.username()+"/muted_users/"+user+".chat",{
                    asynchronous: !0,
                    evalScripts: !0,
                    method: "delete"
                });
                holodeck._active_dialogue.kongBotMessage(user+' desmuteado.');
            }
        });
        if(listar){
            var msj='Muteaste a las siguientes cuentas: ';
            for(var user in holodeck._chat_window._mutings) if(holodeck._chat_window._mutings[user]) msj+=user+', ';
            msj=msj.substring(0, msj.length-2)+'.'; //elimina el último ', ' y agrega un '.'
            holodeck._active_dialogue.kongBotMessage(msj);
        }
        return!1;
    });
});