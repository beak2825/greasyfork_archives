// ==UserScript==
// @name         zombs.io Dc , DC Party
// @namespace    http://tampermonkey.net/
// @version      18.1
// @description  say !dc to disconnect, say !dc party to disconnect party(you need leader)
// @author       ₮ⱤØⱠⱠɆⱤ 1
// @match        zombs.io
// @match   meadow-rocky-lan.glitch.me
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/439827/zombsio%20Dc%20%2C%20DC%20Party.user.js
// @updateURL https://update.greasyfork.org/scripts/439827/zombsio%20Dc%20%2C%20DC%20Party.meta.js
// ==/UserScript==

function disconnectPartyMembers(member = 1) {
    // Lider Olduğunuzdan Ve Onları Yönlendirecek Parti Üyelerine Sahip Olduğunuzdan Emin Olun.
    if (game.ui.playerPartyMembers[1] && game.ui.playerPartyMembers[0].playerUid == game.world.myUid) {
        let fnc1 = game.network.emitter._events.PACKET_RPC[15];
        let enabled = false;
        game.network.emitter._events.PACKET_RPC[15] = (data) => {
            if (enabled) {
                fnc1(data)
            }
        }
        let dcpacket1 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 0}));
        let dcpacket2 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 1}));
        for (let i = 0; i < 50000; i++) {
            game.network.socket.send(dcpacket1);
            game.network.socket.send(dcpacket2);
        }
        setTimeout(() => {
            enabled = true;
            game.network.socket.send([]);
        }, 15000);
    }
}

game.network.addRpcHandler("ReceiveChatMessage", e => {
   if (e.uid == game.world.myUid) {
        if (e.message.toLowerCase() == "!dc party") {
            disconnectPartyMembers()
        }
        if (e.message.toLowerCase() == "!dc") {
            game.network.socket.send([]);
        }
    }
})