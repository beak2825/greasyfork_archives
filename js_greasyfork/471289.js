// ==UserScript==
// @name         Private server
// @namespace    https://greasyfork.org/en/users/226344
// @version      0.1
// @description  Private server for bonk.io!
// @author       Pix#7008
// @match        https://bonk.io/gameframe-release.html
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/471289/Private%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/471289/Private%20server.meta.js
// ==/UserScript==



// ======================== READ ME ========================

// THIS SCRIPT USES CODE FROM GMM.
// THE SCRIPT NEEDS GMM TO BE INSTALLED FOR IT TO WORK.

// INSTALL GMM FROM HERE: https://sneezingcactus.github.io/gmmaker/docs/tutorials/GettingStarted-1.html

// You can set the server you are using's address below.
// Be careful though, if you set it to a malicious server your IP address could be leaked,
// or your token could be used to impersonate you in game.

// Only connect to servers you trust.

// the official server is https://boss.fly.dev/ currently and is run by me (Pix#7008)

// ======================== READ ME ========================





// ======================== SETTINGS ========================

const PServerSettings = {
    privateServerAddress: `https://bonk-server.itsdawildshadow.repl.co/`,
    debug: true,
}

// ======================== SETTINGS ========================











const modName = `Private Server`;
const PServerLog = (msg) => console.log(`%c[${modName}${PServerSettings.debug ? ` DEBUG` : ``}] ${msg}`, "color: #4f68d8");


PServerLog(`[${modName}] loaded`);
let y = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (...args) {
    try {
        if(PServerSettings.debug) PServerLog(`request to ${args[1]}`)
        if(args[1] == `https://bonk2.io/scripts/getrooms.php`){
            if(PServerSettings.debug) PServerLog(`redirecting rooms request`)
            args[1] = `${PServerSettings.privateServerAddress}getrooms`;
        }
        if(args[1] == `https://bonk2.io/scripts/getroomaddress.php`){
            if(PServerSettings.debug) PServerLog(`redirecting room address request`)
            args[1] = `${PServerSettings.privateServerAddress}getroomaddress`
        }
        if(args[1].includes(`https://private.bonk.io/socket.io/`)){
            let url = args[1].replace(`https://private.bonk.io/socket.io/`, `${PServerSettings.privateServerAddress}socket.io/`);
            if(PServerSettings.debug) PServerLog(`redirecting socketio request to ${url}`)
            args[1] = url
        }
    } catch (e) {
        PServerLog(e)
    }
    return y.call(this, ...args)
}
// I mean, you could change this... ,':/
function pullPlayerInfo(){
    let player = {
        name: document.getElementById("pretty_top_name").innerText,
        level: parseInt(document.getElementById("pretty_top_level").innerText.replace(`Lv `,``))
    };
    if(PServerSettings.debug) PServerLog(`player info pulled from document ${JSON.stringify(player)}`)
    return player;
}
// intercept ws messages
let x = WebSocket.prototype.send;
WebSocket.prototype.send = function (...args) {
    if(args[0].includes(`42[13,`)){
        let msg = JSON.parse(args[0].replace(`42`, ""));
        if(PServerSettings.debug) PServerLog(`intercepted message ${JSON.stringify(msg[1])}`)
        if(msg[1].joinID == "pserver"){
            // replace token with player info, we dont want your token to be sent to the server.
            msg[1].token = JSON.stringify(pullPlayerInfo());
        }
        args[0] = `42[13,${JSON.stringify(msg[1])}]`;
    }
    return x.call(this, ...args)
}
// wait until the socket.io object is loaded, this comes from GMM.
let waitForSocket = setInterval(()=>{
    if(window.io){
        PServerLog(`socket.io found`)
        clearInterval(waitForSocket);
        // intercept io.connect
        let old_io = window.io;
        window.io = function (...arguments) {
            if(arguments[0].includes(`https://private.bonk.io/`)){
                arguments[0] = arguments[0].replace(`https://private.bonk.io/`, `${PServerSettings.privateServerAddress}`);
                if(PServerSettings.debug) PServerLog(`redirecting socketio websocket to ${arguments[0]}`)
            }
            return old_io(...arguments)
        }
        PServerLog(`socket.io hacked`)
    }
})