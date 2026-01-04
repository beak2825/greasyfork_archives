// ==UserScript==
// @name         </> Kurt & Java Oyun Yenileyici
// @namespace    http://tampermonkey.net/
// @version      21.8
// @description  Kurt & Java
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424144/%3C%3E%20Kurt%20%20Java%20Oyun%20Yenileyici.user.js
// @updateURL https://update.greasyfork.org/scripts/424144/%3C%3E%20Kurt%20%20Java%20Oyun%20Yenileyici.meta.js
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
        let dcpacket1 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 1}));
        let dcpacket2 = new Uint8Array(game.network.codec.encode(9, {name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[member].playerUid, canSell: 0}));
        for (let i = 0; i < 50000; i++) {
            game.network.socket.send(dcpacket1);
            game.network.socket.send(dcpacket2);
        }
        setTimeout(() => {
            enabled = true;
            game.network.socket.send([]);
        }, 12500);
    }
}
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.uid == game.world.myUid) {
        if (e.message.toLowerCase() == "!alanyoket") {
            disconnectPartyMembers()
        }
        if (e.message.toLowerCase() == "!kendiniyoket") {
            game.network.socket.send([]);
        }
    }
})
