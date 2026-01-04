// ==UserScript==
// @name         Maxtri Blocking
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Have the abilty to block people in Maxtri. Type "??help" in chat for a list of commands.
// @author       Sopur
// @match        http://maxtri.glitch.me/
// @match        http://maxtri.ml/
// @match        http://maxtri-beta-server.glitch.me/
// @match        https://maxtri.netlify.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417894/Maxtri%20Blocking.user.js
// @updateURL https://update.greasyfork.org/scripts/417894/Maxtri%20Blocking.meta.js
// ==/UserScript==




// # Text
const prefix = "??";
const text = document.createElement("div"); document.body.appendChild(text);
function updateText(input) {
    const HTML = `<style>
    .main {
        pointer-events: none; position: fixed; top: 10px; left: 100px;
        font-family: Ubuntu, "times new roman", times, roman, serif;
        color: #FFFFFF; font-style: normal; font-variant: normal;
        font-weight: 10;
    }
    </style>
    <div class="main" id="all">
    <p id="guia">${input}</p></div>`;
    text.innerHTML = HTML;
};
updateText(`Use ${prefix}help for commands.`);




// # Actual script
function convert(message) {
    let msg = "";
    for (let i = 0; i < message.length; i++) msg += String.fromCharCode(message[i]);
    return msg;
};
function show(message) {
    window.global.chat_message.push({ content: `${message}`, time: message.length * 10, color: 14, alphasize: 0 });
};
function remove(arr, value) {
    return arr.filter(ele => { return ele != value });
};

var blocked = [];
var realSend = WebSocket.prototype.send;
var globalWebSocket;
WebSocket.prototype.send = function (data) {
    let ws = this;
    let message = new Uint8Array(data);
    let chat = window.global.chat_message;
    let output = [];
    for (const index in chat) {
        if (!blocked.some(m => chat[index].content.startsWith(`<${m}>`))) output.push(chat[index]);
    };
    window.global.chat_message = output;
    if (message[0] === 1) {
        let msg = convert(message.slice(3));
        if (msg.startsWith(prefix)) {
            updateText("");
            const args = msg.slice(2).split(" ");
            switch (args[0]) {
                case "help": {
                    show(`${prefix}block <username>: Blocks the user givin | ${prefix}unblock <username>: Unblocks the user givin | ${prefix}list: Lists all the blocked users.`);
                    return;
                }
                case "block": {
                    if (!args[1]) return show(`ERROR: Please give a username. Use "${prefix}help" for a list of commands.`);
                    if (blocked.some(m => m === args[1])) return show(`ERROR: User already blocked.`);
                    blocked.push(`${args[1]}`);
                    show(`Blocked "${args[1]}".`);
                    return;
                }
                case "unblock": {
                    if (!args[1]) return show(`ERROR: Please give a username. Use "${prefix}help" for a list of commands.`);
                    if (!blocked.includes(args[1])) return show(`ERROR: No user found to unblock.`);
                    blocked = remove(blocked, args[1]);
                    show(`Unblocked "${args[1]}".`);
                    return;
                }
                case "list": {
                    show("Blocked users:");
                    blocked.forEach(m => { show(m) });
                    return;
                }
            };
            show(`Your command "${args[0]}" was not found. Use "${prefix}help" for a list of commands.`);
            return;
        };
    };
    return realSend.call(this, data);
};