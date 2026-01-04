// ==UserScript==
// @name         Best Zombs.io Hack 2022 | Multivox Raider
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  Best Raiding Script of 2022! Destroy your Enemies and Take Over the Game!
// @author       DarkResurgence
// @match        zombs.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombs.io
// @grant        none
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448957/Best%20Zombsio%20Hack%202022%20%7C%20Multivox%20Raider.user.js
// @updateURL https://update.greasyfork.org/scripts/448957/Best%20Zombsio%20Hack%202022%20%7C%20Multivox%20Raider.meta.js
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

// ==UserScript==
// @name         OP Zombs.io Chat Blocker Pro X v2
// @namespace    -
// @version      0.1
// @description  The Best Chat Blocker Ever
// @author       Super OP Chat Blocker
// @match        zombs.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
 
let blockedNames = [];
 
window.blockPlayer = name => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
        blockedNames.push(name);
        for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if(msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "red";
                bl.onclick = () => {
                    window.unblockPlayer(name);
                };
            };
        };
    }, () => {});
};
 
window.unblockPlayer = name => {
    blockedNames.splice(blockedNames.indexOf(name), 1);
    for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
        if(msg.childNodes[2].innerText === name) {
            let bl = msg.childNodes[0];
            bl.innerHTML = "Block";
            bl.style.color = "red";
            bl.onclick = () => {
                window.blockPlayer(name);
            };
        };
    };
};
 
const getClock = () => {
    var date = new Date();
    var d = date.getDate();
    var d1 = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds()
    var session = "PM";
 
    if(h == 2){
        h = 12;
    };
 
    if(h < 13) {
        session = "AM"
    };
    if(h > 12){
        session = "PM";
        h -= 12;
    };
 
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}
 
Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replace(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replace(/<(?:.|\n)*?>/gm, '')
    if(blockedNames.includes(b) || window.chatDisabled) { return; };
    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${b}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);