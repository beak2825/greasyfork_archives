// ==UserScript==
// @name         Casually Addicting Multibox
// @namespace    http://tampermonkey.net/
// @version      1
// @description  CODE IT YOURSELF, NOOB
// @author       Casually Addicting
// @match        zombs.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombs.io
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/446339/Casually%20Addicting%20Multibox.user.js
// @updateURL https://update.greasyfork.org/scripts/446339/Casually%20Addicting%20Multibox.meta.js
// ==/UserScript==
let altsCount = 0;
function SendAlt(){
    if (altsCount > 30) return;
    altsCount ++;
    let iframe = document.createElement('iframe');
    iframe.src = 'http://zombs.io';

    iframe.width = '0px';
    iframe.height = '0px';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';

    iframe.addEventListener('load', function(e) {
        iframe.contentWindow.eval(`
        !window.Log && (Log = eval);
eval = (e) => {

    if (e.includes('typeof window')) return 0;
    if (e.includes('typeof process')) return 0;
    if (e.includes('Game.currentGame.network.connected')) return 1;
    if (e.includes('Game.currentGame.world.myUid')) return 0;
    if (e.includes('document.getElementById("hud").children.length')) return 24;

    let log = Log(e);
    return log;
}
        document.body.innerHTML = "<script src='/asset/sentry.js'></script><script src='/asset/app.js?1646574495'></script>";

        window.SendWs = () => {
        game.network.connectionOptions = parent.game.options.servers[parent.game.options.serverId];
        game.network.connected = true;

        let ws = new WebSocket(parent.game.network.socket.url + game.network.connectionOptions.port);
        ws.binaryType = 'arraybuffer';

        ws.onopen = (data) => {
            ws.network = new game.networkType();

            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            }

            ws.onmessage = msg => {
                let data = ws.network.codec.decode(msg.data);

                switch(data.opcode) {
                    case 0:
                        if (data.entities[ws.uid].position) ws.entity = data.entities[ws.uid];
                        if (!ws.entity) return;
                        ws.moveToward = (position) => {
                            let x = Math.round(position.x);
                            let y = Math.round(position.y);

                            let myX = Math.round(ws.entity.position.x);
                            let myY = Math.round(ws.entity.position.y);

                            let offset = 100;

                            if (-myX + x > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
                            if (myX - x > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });

                            if (-myY + y > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
                            if (myY - y > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
                        }

                        ws.moveToward(parent.game.renderer.screenToWorld(parent.game.inputManager.mousePosition.x, parent.game.inputManager.mousePosition.y));

                        let worldMousePos = parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y);
                        ws.network.sendInput({mouseMovedWhileDown: game.inputPacketCreator.screenToYaw((-ws.entity.position.x + worldMousePos.x)*100, (-ws.entity.position.y + worldMousePos.y)*100)});

                        ws.network.sendInput({space: 0});
                        ws.network.sendInput({space: 1});

                        break;
                    case 4:
                        ws.send(game.network.codec.encode(6, {}));
                        ws.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: parent.game.ui.playerPartyShareKey});
                        ws.uid = data.uid;
                        break;
                    case 5:
                        ws.network.sendPacket(4, { displayName: 'Username', extra: data.extra});
                        break;
                    case 6:

                        break;
                    case 9:
                        switch (data.name) {
                            case 'SetPartyList':
                                break;
                            case 'Leaderboard':
                                break;
                        }
                        break;
                }
            }
            ws.onclose = () => {
                console.log('Ws closed.');
            }
        }
    }
            window.SendWs();
        `)
    })

    document.body.append(iframe);
}
game.network.addRpcHandler('ReceiveChatMessage', (e) => {
    SendAlt();
})