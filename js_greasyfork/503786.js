// ==UserScript==
// @name         chat teufhucik
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A Mod for hitbox.io. type /help for help.
// @author       iNeonz
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/503786/chat%20teufhucik.user.js
// @updateURL https://update.greasyfork.org/scripts/503786/chat%20teufhucik.meta.js
// ==/UserScript==


const originalSend = window.WebSocket.prototype.send;
let WSS = 0;
let excludewss = [];

window.WebSocket.prototype.send = async function(args) {
    if(this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string" && !excludewss.includes(this)){
            if (!WSS){
                WSS = this;
            }
        }

        if (!this.injecteded1){
            this.injecteded1 = true;
            const originalClose = this.onclose;
            this.onclose = (...args) => {
                if (WSS == this){
                    WSS = 0;
                }
                originalClose.call(this,...args);
            }
            this.onmessage9 = this.onmessage;
            this.onmessage = function(event){
                if(!excludewss.includes(this) && typeof(event.data) == 'string'){

                }
                this.onmessage9(event);
            }
        }
    }
    return originalSend.call(this, args);
}

function send(txt){
    if (WSS){
        WSS.send('42'+JSON.stringify([1,[28,txt]]));
    }
}

function onmsg(event){
send('gpt: '+event.data);
console.log(event.data);
}

let socket = new WebSocket('ws://localhost:3000');

socket.onmessage = onmsg;

async function ask(question) {
if (socket.readyState != WebSocket.OPEN) {
    socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = onmsg;
    socket.onopen = () => {
     socket.send(question);
    }
}else{
socket.send(question);
}
}

function runCMD(command){
    if (command.startsWith('/gpt ')){
        let a = command.split('/gpt ')[1];
        send('You: '+a);
        ask(a);
        return ' ';
    }
}

let chats = document.getElementsByClassName('content');
let inputs = document.getElementsByClassName('input');

let chatI = [];

for (let c of inputs){
    if (c.parentElement.classList.contains('inGameChat') || c.parentElement.classList.contains('chatBox')){
        chatI.push(c);
        c.addEventListener('keydown',(event) => {
            if (event.keyCode == 13){
                let newMsg = runCMD(c.value);
                if (newMsg) {
                    if (newMsg.length < 2) {c.value = '';}else{c.value = newMsg;}
                }
            }
        });
    }
}
