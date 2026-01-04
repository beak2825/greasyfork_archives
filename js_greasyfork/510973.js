// ==UserScript==
// @name         XP Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  blocks xp gain incase you want to preseve a level fr
// @author       CarManiac
// @run-at       document-idle
// @match        https://hitbox.io/game.html
// @match        https://hitbox.io/game2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @downloadURL https://update.greasyfork.org/scripts/510973/XP%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/510973/XP%20Blocker.meta.js
// ==/UserScript==

const originalSend = window.WebSocket.prototype.send;
let WSS;

window.WebSocket.prototype.send = async function(args) {
    if(this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string"){
            if (!WSS){
                WSS = this;
            }
            if (args.startsWith('42[')){
                let packet = JSON.parse(args.slice(2,args.length));
                if (packet[1][0] == 68) {
                    return;
                }
            }
        }
    }
    return originalSend.call(this, args);
}