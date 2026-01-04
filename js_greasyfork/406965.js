// ==UserScript==
// @name         Bots for Spinz.io.
// @namespace    !
// @version      null
// @description  null
// @author       null
// @match        spinz.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406965/Bots%20for%20Spinzio.user.js
// @updateURL https://update.greasyfork.org/scripts/406965/Bots%20for%20Spinzio.meta.js
// ==/UserScript==

let switcher = 0.00000;
let game = window.game;
window.allSockets = [];
window.sendWs = () => {
    let r2 = true;
    let isOnControl = true;
    let ws = new WebSocket(game.network.socket.url);
    if (!window.allSockets[window.allSockets.length]) {
        ws.cloneId = window.allSockets.length + 1;
        window.allSockets[window.allSockets.length] = ws;
    }
    ws.binaryType = "arraybuffer";
    ws.onclose = () => {
        ws.isclosed = true;
    }
    ws.onopen = () => {
        ws.network = new game.networkType();
        ws.network.sendEnterWorldAndDisplayName = (t) => { ws.network.sendPacket(4, {displayName: t}); };
        ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
        ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
        ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
        ws.network.sendEnterWorldAndDisplayName("greasyfork.org/scripts/406965");
    }
    ws.onEnterWorld = () => {
        // useless.
    }
    ws.onmessage = msg => {
        ws.data = ws.network.codec.decode(msg.data);
        if (ws.data.uid) {
            ws.uid = ws.data.uid;
            ws.network.sendRpc({name: "SetTexture", textureId: 0});
        }
        if (ws.data.name == "Dead") {
            ws.network.sendInput({respawn: 1});
        }
        if (ws.data.entities) {
            if (ws.data.entities[ws.uid].position) {
                ws.position = ws.data.entities[ws.uid].position;
            }
        }
        if (!ws.f) {
            ws.f = true;
            setTimeout(() => {
                ws.f = false;
            }, 1300);
            if (ws.position) {
                ws.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-ws.position.x + -192)*100, (-ws.position.y + -192)*100)});
            }
        }
        switch(ws.data.opcode) {
            case 4:
                ws.onEnterWorld(ws.data);
                break;
        }
    }
    setTimeout(() => {
        if (window.allSockets.length < 50) { // set "50" to "100" if you want to lag the server.
            window.sendWs();
        }
    }, 300);
}
game.network.addEnterWorldHandler(window.sendWs);