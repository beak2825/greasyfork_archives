// ==UserScript==
// @name         XP BLOCKER
// @namespace    https://greasyfork.org/en/scripts/451341-bonk-commands
// @version      1.2
// @description  Blocks XP gain.
// @author       LEGENDBOSS123
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/468964/XP%20BLOCKER.user.js
// @updateURL https://update.greasyfork.org/scripts/468964/XP%20BLOCKER.meta.js
// ==/UserScript==
if(typeof(top.originalSend2)=='undefined'){top.originalSend2 = document.getElementById("maingameframe").contentWindow.WebSocket.prototype.send;}


document.getElementById("maingameframe").contentWindow.WebSocket.prototype.send = function(args) {
    if(this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string"){
            if(args.startsWith('42[38')){
                return;
            }
        }

    }
    return originalSend2.call(this,args);
}
