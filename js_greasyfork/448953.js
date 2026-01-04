// ==UserScript==
// @name         Server Filler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  easy best script
// @author       Demon Slayer :)
// @match        http://zombs.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombs.io
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448953/Server%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/448953/Server%20Filler.meta.js
// ==/UserScript==

document.getElementsByClassName("hud-intro-guide")[0].innerHTML = `
<h3 style='text-align:center;'>< Filling /></h3>
<br>
<button class="btn btn-blue" style='width: 220px' onclick="window.sendAltServer();">Send Alt to Current Server.</button>
<br><br>
<hr />
<br>
<input class='btn servercodei' type='text' placeholder='Server Code' style='width: 220px'>
<br><br>
<button class="btn btn-blue" style='width: 220px' onclick="window.sendAltSpecificServer();">Send Alt to that Server</button>
<br>
`;

window.sendAltServer = () => {
    let selected = document.getElementsByClassName("hud-intro-server")[0].value;
    let server = game.options.servers[selected];
    let hostname = server.hostname;
    let url = `ws://${hostname}:80/`;
    game.network.connectionOptions = {
        hostname: hostname
    };
    game.network.connected = true;
    const loadLbPacket = () => {
        for (let i = 0; i < 30; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
        ws.send(new Uint8Array([7, 0]));
        ws.send(new Uint8Array([9,6,0,0,0,126,8,0,0,108,27,0,0,146,23,0,0,82,23,0,0,8,91,11,0,8,91,11,0,0,0,0,0,32,78,0,0,76,79,0,0,172,38,0,0,120,155,0,0,166,39,0,0,140,35,0,0,36,44,0,0,213,37,0,0,100,0,0,0,120,55,0,0,0,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,134,6,0,0]));
    };
    let ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    ws.onopen = (data) => {
        ws.network = new game.networkType();
        ws.network.sendPacket = (e, t) => {
            ws.send(ws.network.codec.encode(e, t));
        };
        ws.onRpc = (data) => {
            if (data.name === "SetPartyList") {
                return;
            };
            if (data.name === "Leaderboard") {
                if(data.response.length > 1) { window.appSsrs({ population: ws.pop, leaderboard: data.response, parties: ws.parties }); return; };
                loadLbPacket();
                return;
            };
        };
        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);
            switch (data.opcode) {
                case 5:
                    ws.network.sendPacket(4, {
                        displayName: `Bruh Moment Fill`,
                        extra: data.extra
                    });
                    break;
                case 4:
		    ws.network.sendPacket(6, {});
                    ws.network.sendPacket(3, {
                        left: 1,
                        up: 1
                    });
                    break;
                case 9:
                    ws.onRpc(data);
                    break;
            };
        };
    };
};

window.sendAltSpecificServer = () => {
    let selected = document.getElementsByClassName("servercodei")[0].value;
    if (selected.length < 1) return;
    let server = game.options.servers[selected];
    let hostname = server.hostname;
    let url = `ws://${hostname}:80/`;
    game.network.connectionOptions = {
        hostname: hostname
    };
    game.network.connected = true;
    let ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    ws.onopen = (data) => {
        ws.network = new game.networkType();
        ws.network.sendPacket = (e, t) => {
            ws.send(ws.network.codec.encode(e, t));
        };
        ws.onRpc = (data) => {
            if (data.name === "SetPartyList") {
                return;
            };
            if (data.name === "Leaderboard") {
                return;
            };
        };
        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);
            switch (data.opcode) {
                case 5:
                    ws.network.sendPacket(4, {
                        displayName: `BILLIONS`,
                        extra: data.extra
                    });
                    break;
                case 4:
		    ws.network.sendPacket(6, {});
                    ws.network.sendPacket(3, {
                        left: 1,
                        up: 1
                    });
                    ws.pop = data.players - 1;
                    break;
                case 9:
                    ws.onRpc(data);
                    break;
            };
        };
    };
};

window.appSsrs = res => {
game.network.connected = false;
    console.log(res);

    let ssrs = document.getElementById("ssrs");
    ssrs.style.overflow = "scroll";
    ssrs.style.height = "175px";
    ssrs.innerHTML = `
    <p>Population: ${res.population}</p>
    <h1>Leaderboard</h1>
    <hr />
    <div>
    ${res.leaderboard.map(lb => {
        return `
        <p>Rank: #${lb.rank + 1},
        Nickname: ${lb.name},
        Wave: ${lb.wave.toLocaleString("en")},
        Score: ${lb.score}</p>
        `;
    }).join("<hr />")}
    </div>
    <hr />
    <h1>Parties</h1>
    ${res.parties.map(p => {
        return `
        <p>Name: ${p.partyName},
        ID: ${p.partyId},
        Members: ${p.memberCount},
        Public: ${p.isOpen}</p>
        `;
    }).join("<hr />")}
    <div>
    </div>
    `;
};

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