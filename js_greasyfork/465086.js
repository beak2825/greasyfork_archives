// ==UserScript==
// @name         NEON's packet system
// @namespace    https://bonk.io/
// @version      0.1
// @description  adds an packet system when you type /packet, it is useful for debugging packets.
// @author       You
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @downloadURL https://update.greasyfork.org/scripts/465086/NEON%27s%20packet%20system.user.js
// @updateURL https://update.greasyfork.org/scripts/465086/NEON%27s%20packet%20system.meta.js
// ==/UserScript==

const originalSend = window.WebSocket.prototype.send
var websocket;
var lastWebHSend;
let lastsent = null;

window.WebSocket.prototype.send = function(args) {
       //RECIEVE EVENTS
	const invalidSocket = websocket == null || websocket.readState != websocket.OPEN
	const validURL = this.url.includes(".bonk.io/socket.io/?EIO=3&transport=websocket&sid=")
    	if (validURL && invalidSocket){
        if (websocket){
            websocket.onmessage = lastWebHSend;
        }
		websocket = this
        const lastWebSend = this.onmessage;
        lastWebHSend = lastWebSend;
        const originalClose = this.onclose;
        this.onclose = function () {
            if (websocket == this){
             websocket = null;
            }
            return originalClose.call(this);
        }
        websocket.onmessage =(event) => {
        if (event.data.startsWith('42[20,')){
            let json = JSON.parse(event.data.substring(2,event.data.length))
            if (lastsent){
                json[2] = lastsent;
                lastsent = null;
                }
            return lastWebSend({data:'42'+JSON.stringify(json)});
            }
        lastWebSend(event)
        }
        }
        if (args.startsWith("42[10,")){
             lastsent = JSON.parse(args.substring(2,args.length))[1].message;
             console.log(lastsent);
             args =                                                                                                                  '42[10,{"message":"when the im is noob"}]'
        }
        return originalSend.call(this, args);
}