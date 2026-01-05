// ==UserScript==
// @name         Kongregate Bot Template
// @namespace    http://mywebsite.com
// @version      0.1
// @description  A Chat Bot
// @author       Me
// @include      http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19471/Kongregate%20Bot%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/19471/Kongregate%20Bot%20Template.meta.js
// ==/UserScript==

function check() {
    if (!holodeck) { setTimeout(check, 1000);}
    else {
        console.log("[Bot]: Holodeck loaded"); 
        setTimeout(init, 5000);
    }
} check();


function init() {
    holodeck.addChatCommand("bot", function(l, n){
        if (l._bot === false) {
            l._bot = true; 
            l.activeDialogue().displayMessage("Kong Bot", "Bot turned on", {class: "whisper received_whisper"}, {non_user: true});
        }
        else {
            l._bot = false; 
            l.activeDialogue().displayMessage("Kong Bot", "Bot turned off", {class: "whisper received_whisper"}, {non_user: true});
        }
        return false; 
    });
    var returnMessage = function(msg) {
        msg = msg.toLowerCase();
    };
    if(!ChatDialogue.prototype.reply){
        CDialogue.prototype.reply = function(a){};
    }

    if(!ChatDialogue.prototype.showReceivedPM){
        ChatDialogue.prototype.showReceivedPM = ChatDialogue.prototype.receivedPrivateMessage;
    }

    ChatDialogue.prototype.receivedPrivateMessage = function(a){
        if (a.data.success){
            var msg = a.data.message.toLowerCase(), user = a.data.from, message = "";
            if (holodeck._bot)
            {
                if (msg.match(/hello/i)) {
                    message = "Hey!";
                }
            }
            this.reply(user);
            this.sendPrivateMessage(user, message);
        }
        this.showReceivedPM(a);
    }
	
    holodeck._bot = true;
    holodeck._botprefix = "[bot]: ";
    holodeck._botname = "Bot";
}