// ==UserScript==
// @name         cipher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Raiding Mod
// @author       cipher
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463153/cipher.user.js
// @updateURL https://update.greasyfork.org/scripts/463153/cipher.meta.js
// ==/UserScript==

localStorage['youTubeSubscribed'] = true;
localStorage['walkthroughCompleted'] = true;
localStorage['twitterShared'] = true;
localStorage['facebookShared'] = true;

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.querySelectorAll('.ad-unit, .hud-intro-youtuber, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, hud-respawn-corner-bottom-left, .hud-intro-social, .hud-intro-more-games, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName('hud-intro-play')[0].classList.remove('btn-green');

document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;"><Custom><b><font size='24'>gg</font></b></Custom>`;

document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 310px; height: 330px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 420px; height: 280px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-left")[0].setAttribute("style", "width: 360px; height: 280px; margin-top: 24px; margin-left: 75px; margin-right: 0px;");

// Intro

let left = document.getElementsByClassName('hud-intro-left')[0];

let defaultHTML = `
<br>
<button class='btn btn-blue tabsaver' style='width: 240px; height: 45px;'>Tab Saver</button>
<br><br>
<button class='btn btn-blue scanner' style='width: 240px; height: 45px;'>Scanner</button>
<br><br>
<button class='btn btn-blue menufiller' style='width: 240px; height: 45px;'>Menu Filler</button>
<br><br>
<button class='btn btn-blue alts' style='width: 240px; height: 45px;'>Sockets</button>
<br>
<br>
`;

left.innerHTML = defaultHTML;

let right = document.getElementsByClassName('hud-intro-guide')[0];

let layout = `
<div class='tabsaverLayout' style='text-align: center;'>
    <h1>Tab Saver</h1>
    <p>Click on the <strong>Host Saved Tab</strong> button to open a saved tab here.</p>
    <input type="text" style="width: 225px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); color: red; height: 45px; padding: 5px;" id="hostsavedtabpsk" placeholder="Party Share Key?">
    <h3>Tabs saved:</h3>
    <div id="savedTabs"></div>
    <button class='btn btn-red' style='width: 200px; height: 40px; padding: 1px;' onclick='window.goback("tabsaver");'>Exit</button>
    <br>
</div>

<div class='menufillerLayout' style='text-align: center;'>
    <h1>Menu Filler</h1>
    <p>Sends WebSocket Fillers to fill the selected server.</p>
    <br><br>
    <button class='btn btn-blue' style='width: 160px;' onclick='sendFillerToServer();'>Send Filler</button>
    &nbsp
    <button class='btn btn-blue' style='width: 160px;' onclick='deleteFillersInServer();'>Delete Fillers</button>
    <br>
    <p style='width: 160px; padding: 6px;' class='btn fillerNums'>Filler Count: 0</p>
    &nbsp
    <button class='btn btn-red' style='width: 160px; margin-top: 15px;' onclick='window.goback("menufiller");'>Exit</button>
</div>

<div class='scannerLayout' style='text-align: center;'>
    <h1>Server Scanner</h1>
    <p>Click on the <strong>Scan Server</strong> button to show the data of the selected server here.</p>
    <br>
    <div id="ssrs"></div>
    <br>
    <button class='btn btn-red' style='width: 160px;' onclick='window.goback("scanner");'>Exit</button>
</div>

<div class='altsLayout' style='text-align: center;'>
    <h1>Sockets</h3>
    <p>Create WebSockets to join selected servers and bases.</p>
    <br><br>
    <input type="text" style="width: 160px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; padding: 6px;" placeholder='Server ID?' class='altsServerId' maxlength='9'>&nbsp
    <input type="text" style="width: 160px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; padding: 6px;" placeholder='Share Key?' class='altsPsk' maxlength='20'><br>
    <input type="text" style="width: 160px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; padding: 6px; margin-top: 10px;" placeholder='Name?' class='altsName' maxlength='29'>&nbsp
    <button class='btn btn-blue' style='width: 160px; margin-top: 10px;' onclick='window.sendafkws()'>Send WebSocket</button>
</div>
`;

right.innerHTML = layout;

document.getElementsByClassName('tabsaverLayout')[0].style.display = 'none';
document.getElementsByClassName('menufillerLayout')[0].style.display = 'none';
document.getElementsByClassName('scannerLayout')[0].style.display = 'none';
document.getElementsByClassName('altsLayout')[0].style.display = 'none';

let layouts = {
    'menufiller': {
        layoutElem: 'menufillerLayout',
        name: 'menufiller'
    },
    'scanner': {
        layoutElem: 'scannerLayout',
        name: 'scanner'
    },
    'tabsaver': {
        layoutElem: 'tabsaverLayout',
        name: 'tabsaver'
    },
    'alts': {
        layoutElem: 'altsLayout',
        name: 'alts'
    }
};

window.goback = (layout) => {
    document.getElementsByClassName(layout)[0].classList.replace('btn-red', 'btn-blue');

    switch (layout) {
        case 'menufiller':
            document.getElementsByClassName(layout)[0].innerText = 'Menu Filler';
            break;
        case 'scanner':
            document.getElementsByClassName(layout)[0].innerText = 'Scanner';
            break;
        case 'tabsaver':
            document.getElementsByClassName(layout)[0].innerText = 'Tab Saver';
            break;
        case 'alts':
            document.getElementsByClassName(layout)[0].innerText = 'Sockets';
            break;
    };

    document.getElementsByClassName(layout + 'Layout')[0].style.display = 'none';
};

let resetLayoutStyles = (layoutName) => {
    for (let l in layouts) {
        if (layouts[l].name == layoutName) {
            let withoutSelectedLayout = Object.keys(layouts).filter(k => k !== layouts[l].name);

            document.getElementsByClassName(layouts[l].layoutElem)[0].style.display = 'block';

            for (let f of withoutSelectedLayout) {
                document.getElementsByClassName(layouts[f].layoutElem)[0].style.display = 'none';

                document.getElementsByClassName(layouts[f].name)[0].classList.replace('btn-red', 'btn-blue');

                switch (layouts[f].name) {
                    case 'menufiller':
                        document.getElementsByClassName(layouts[f].name)[0].innerText = 'Menu Filler';
                        break;
                    case 'scanner':
                        document.getElementsByClassName(layouts[f].name)[0].innerText = 'Scanner';
                        break;
                    case 'tabsaver':
                        document.getElementsByClassName(layouts[f].name)[0].innerText = 'Tab Saver';
                        break;
                    case 'alts':
                        document.getElementsByClassName(layouts[f].name)[0].innerText = 'Sockets';
                        break;
                };
            };

            document.getElementsByClassName(layouts[l].name)[0].classList.replace('btn-blue', 'btn-red');
            document.getElementsByClassName(layouts[l].name)[0].innerText = '---';
        };
    };
};

document.getElementsByClassName('tabsaver')[0].addEventListener('click', () => {
    resetLayoutStyles('tabsaver');
});

document.getElementsByClassName('scanner')[0].addEventListener('click', () => {
    resetLayoutStyles('scanner');
});

document.getElementsByClassName('menufiller')[0].addEventListener('click', () => {
    resetLayoutStyles('menufiller');
});

document.getElementsByClassName('alts')[0].addEventListener('click', () => {
    resetLayoutStyles('alts');
});

window.fillerAlts = {};
window.fillerCount = 0;
window.refreshCount = () => document.getElementsByClassName('fillerNums')[0].innerHTML = `Filler Count: ${window.fillerCount};`;

window.sendFillerToServer = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;

    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);
        ws.binaryType = 'arraybuffer';

        ws.onopen = (data) => {
            ws.network = new game.networkType();

            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            };

            ws.network.sendRpc = (_data) => {
                ws.network.sendPacket(9, _data);
            };

            ws.network.sendInput = (_data) => {
                ws.network.sendPacket(3, _data);
            };

            ws.playerTick = {};

            ws.onRpc = (data) => {
                switch (data.name) {
                    case 'Dead':
                        ws.network.sendInput({
                            respawn: 1
                        });
                        break;
                };
            };

            ws.gameUpdate = () => {
                ws.network.sendInput({
                    left: 1,
                    up: 1
                });
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));

                    ws.send(ws.network.codec.encode(4, {
                        displayName: 'xdxd',
                        extra: data.extra
                    }));
                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                switch (ws.data.opcode) {
                    case 0:
                        for (let entityType in ws.data.entities[ws.playerTick.uid]) {
                            if (entityType === 'uid') continue;
                            ws.playerTick[entityType] = ws.data.entities[ws.playerTick.uid][entityType];
                        }

                        ws.gameUpdate();
                        break;
                    case 4:
                        ws.send(iframeWindow.game.network.codec.encode(6, {}));
                        iframe.remove();

                        ws.playerTick.uid = ws.data.uid;

                        window.fillerCount++;
                        window.refreshCount();
                        window.fillerAlts[window.fillerCount] = ws;
                        break;
                    case 9:
                        ws.onRpc(ws.data);
                        break;
                }
            }

            ws.onclose = e => {
                iframe.remove();
            };
        };
    });
};

window.deleteFillersInServer = () => {
    for (let filler in window.fillerAlts) {
        window.fillerAlts[filler].close();
        window.fillerCount--;
        window.refreshCount();
    };
};

window.sendafkws = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;

    let serverId = document.getElementsByClassName('altsServerId')[0].value;
    let psk = document.getElementsByClassName('altsPsk')[0].value;

    iframe.addEventListener("load", () => {
        let connectionOptions = game.options.servers[serverId];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);
        ws.binaryType = 'arraybuffer';

        ws.onopen = (data) => {
            ws.network = new game.networkType();

            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            };

            ws.network.sendRpc = (_data) => {
                ws.network.sendPacket(9, _data);
            };

            ws.network.sendInput = (_data) => {
                ws.network.sendPacket(3, _data);
            };

            ws.playerTick = {};

            ws.onRpc = (data) => {
                switch (data.name) {
                    case 'Dead':
                        ws.network.sendInput({
                            respawn: 1
                        });

                        break;
                };
            };

            ws.gameUpdate = () => {
                ws.network.sendInput({
                    left: 1,
                    up: 1
                });
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));

                    ws.send(ws.network.codec.encode(4, {
                        displayName: localStorage.name,
                        extra: data.extra
                    }));
                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                switch (ws.data.opcode) {
                    case 0:
                        for (let entityType in ws.data.entities[ws.playerTick.uid]) {
                            if (entityType === 'uid') continue;
                            ws.playerTick[entityType] = ws.data.entities[ws.playerTick.uid][entityType];
                        }

                        ws.gameUpdate();
                        break;
                    case 4:
                        ws.send(iframeWindow.game.network.codec.encode(6, {}));
                        iframe.remove();

                        ws.network.sendRpc({
                            name: 'JoinPartyByShareKey',
                            partyShareKey: psk
                        });

                        ws.playerTick.uid = ws.data.uid;
                        break;
                    case 9:
                        ws.onRpc(ws.data);
                        break;
                }
            }

            ws.onclose = e => {
                iframe.remove();
            };
        };
    });
};

document.getElementsByClassName("hud-intro-form")[0].insertAdjacentHTML("beforeend", `<button class="btn hud-intro-play" onclick="window.ssfi();">Scan Server</button>`);

let scanning = false;

window.ssfi = () => {
    if (scanning == true) return;

    scanning = true;

    let ssrs = document.getElementById("ssrs");
    ssrs.innerHTML = `<strong>Loading...</strong>`;

    let selected = document.getElementsByClassName("hud-intro-server")[0].value;
    let server = game.options.servers[selected];

    let hostname = server.hostname;
    let url = `ws://${hostname}:80/`;

    game.network.connectionOptions = {
        hostname: hostname
    };
    game.network.connected = true;

    let ws = new WebSocket(url);

    ws.binaryType = "arraybuffer";

    const loadLbPacket = () => {
        for (let i = 0; i < 30; i++)
            ws.send(
                new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125])
            );

        ws.send(
            new Uint8Array([7, 0])
        );
        ws.send(
            new Uint8Array([9, 6, 0, 0, 0, 126, 8, 0, 0, 108, 27, 0, 0, 146, 23, 0, 0, 82, 23, 0, 0, 8, 91, 11, 0, 8, 91, 11, 0, 0, 0, 0, 0, 32, 78, 0, 0, 76, 79, 0, 0, 172, 38, 0, 0, 120, 155, 0, 0, 166, 39, 0, 0, 140, 35, 0, 0, 36, 44, 0, 0, 213, 37, 0, 0, 100, 0, 0, 0, 120, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 6, 0, 0])
        );
    };

    ws.onopen = (data) => {
        ws.network = new game.networkType();

        ws.network.sendPacket = (e, t) => {
            ws.send(ws.network.codec.encode(e, t));
        };

        ws.onRpc = (data) => {
            if (data.name === "SetPartyList") {
                ws.parties = data.response;
            };

            if (data.name === "Leaderboard") {
                ws.network.sendRpc({
                    name: "JoinPartyByShareKey",
                    partyShareKey: "aaaaaaaaaaaaaaaaaaaa"
                });

                if (data.response.length > 1) {
                    window.appSsrs({
                        server: server,
                        population: ws.pop,
                        leaderboard: data.response,
                        parties: ws.parties
                    });
                    return;
                };

                loadLbPacket();
            };
        };

        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);

            switch (data.opcode) {
                case 5:
                    ws.network.sendPacket(4, {
                        displayName: `ø`,
                        extra: data.extra
                    });
                    break;
                case 4:
                    ws.network.sendPacket(6, {});

                    ws.network.sendPacket(3, {
                        left: 1,
                        up: 1
                    });

                    ws.network.sendInput({
                        mouseMovedWhileDown: 0
                    });

                    ws.network.sendInput({
                        space: 0
                    });

                    ws.network.sendInput({
                        space: 1
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

let checkedServers = {};

window.appSsrs = res => {
    game.network.connected = false;

    let ssrs = document.getElementById("ssrs");
    ssrs.style.overflow = "scroll";
    ssrs.style.height = "175px";

    let check = () => {
        let flaggedPlayers = [];
        let checked = {};
        let returnStr = '';

        res.leaderboard.map(o => {
            for (let badUser of flaggedPlayers) {
                if (badUser == o.name) {
                    checked[o.name] = {
                        wave: o.wave.toLocaleString('en'),
                        name: o.name
                    };
                };
            };
        });

        for (let a in checked)
            returnStr += ` % ${checked[a].name} - Wave: ${checked[a].wave}`;

        return returnStr || ' None';
    };

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
        Public: ${p.isOpen ? 'Open' : 'Closed'}</p>
        `;
    }).join("<hr />")}
    <div>
    </div>
    `;

    let serverId = res.server.id;
    let serverElem = game.ui.components.Intro.serverElem;

    for (let optgroup in serverElem.children) {
        for (let option in serverElem.children[optgroup].children) {
            let server = serverElem.children[optgroup].children[option];
            if (server && server.value == serverId) {
                if (checkedServers[serverId]) continue;

                checkedServers[serverId] = true;

                window.checkedServers = checkedServers;

                let p = server.textContent;
                let o = p.indexOf('[') - 1;
                let u = Array.from(p);
                let y = '';

                for (let c in u) {
                    if (c >= o) delete u[c];

                    y = u.join('');
                };

                server.textContent = y + ' => Pop: ' + res.population + 'ARTEMIS, player | Flagged Players: ' + check();
            }
        };
    };
};

document.getElementsByClassName('hud-chat')[0].style.width = "auto";
document.getElementsByClassName('hud-chat')[0].style.minWidth = "520px";

const request = new XMLHttpRequest();

request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = `People in game: ${JSON.parse(request.responseText).players}/${JSON.parse(request.responseText).capacity} [${(JSON.parse(request.responseText).players / JSON.parse
        (request.responseText).capacity * 100).toFixed(2)}%]`;

        let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];

        for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Population: ${JSON.parse(request.responseText).regions[servers[i]].players} / ${JSON.parse(request.responseText).regions[servers[i]].capacity}`);
        };
    };
};

request.open("GET", "http://zombs.io/capacity", true);
request.send();

game.network.addRpcHandler("SetPartyList", parties => {
    let serverPop = 0;

    for (let party of parties) {
        serverPop += party.memberCount;
    };

    document.getElementsByClassName("hud-party-server")[0].innerHTML = `${serverPop}/32 <small>${game.network.connectionOptions.name}</small>`;
});

let css = `
 .btn:hover {
     cursor: pointer;
}
 .btn-blue {
     background-color: #144b7a;
}
 .btn-blue:hover .btn-blue:active {
     background-color: #4fa7ee;
}
 .box {
     display: block;
     width: 100%;
     height: 50px;
     line-height: 34px;
     padding: 8px 14px;
     margin: 0 0 10px;
     background: #eee;
     border: 0;
     font-size: 14px;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
     border-radius: 4px;
}
 .hud-intro::before {
     background-image: url(https://images.wallpaperscraft.com/image/single/mountains_mountain_range_peaks_149574_1920x1200.jpg);
     background-size: cover;
}
 .hud-intro .hud-intro-form .hud-intro-server {
    display: block;
    line-height: unset;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://cdn.discordapp.com/attachments/854376044522242059/925743376505118720/light2.webp);
}
 .hud-intro .hud-intro-form .hud-intro-name {
    display: block;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://cdn.discordapp.com/attachments/854376044522242059/925743376505118720/light2.webp);
}
 .hud-intro .hud-intro-form .hud-intro-play {
    display: block;
    background: #eee;
    font-size: 0.9rem;
    color: black;
    padding: 1px;
    line-height: unset;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(https://i.pinimg.com/564x/75/10/d1/7510d144335a2d2ed277c00df430f6a7.jpg);
    font-family: Arial;
}
 .longbtn {
     display: block;
     width: 100%;
     height: 50px;
     line-height: 50px;
}
 .disabledBtn {
     opacity: 0.6;
     cursor: not-allowed;
     display: inline-block;
     height: 40px;
     line-height: 40px;
     padding: 0 20px;
     background: #444;
     color: #eee;
     border: 0;
     font-size: 14px;
     vertical-align: top;
     text-align: center;
     text-decoration: none;
     text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
     border-radius: 4px;
     transition: all 0.15s ease-in-out;
}
 .btn1 {
     display: inline-block;
     height: 20px;
     line-height: 15px;
     padding: 0 20px;
     color: #eee;
    x border: 0;
     font-size: 10px;
     vertical-align: top;
     text-align: center;
     text-decoration: none;
     border-radius: 4px;
     transition: all 5s ease-in-out;
}
 .btn1:hover {
     cursor: pointer;
}
 .btn1-blue {
     background-color: #144b7a;
}
 .btn1-blue:hover .btn1-blue:active {
     background-color: #4fa7ee;
}
 a {
     text-decoration: none;
}
 .hud-menu-party .hud-party-tag {
     width: 120px;
}
 .hud-menu-party .hud-party-share {
     width: 280px;
}
 #hud-menu-party {
     top: 51%;
     width: 610px;
     height: 480px;
     background-color: rgb(61 115 157 / 55%);
     border: 5px solid white;
     background-image: url("https://images.wallpaperscraft.com/image/single/mountains_mountain_range_peaks_149574_1920x1200.jpg");
}
 .hud-menu-party .hud-party-grid .hud-party-link.is-active {
     background: lightblue !important;
}
 .hud-menu-party .hud-party-visibility {
     margin: 0 0 0 10px;
     width: 125px;
}
 .hud-popup-overlay .hud-popup-confirmation .hud-confirmation-actions .btn.btn-green {
     background: #649db0;
}
 #hud-menu-shop {
     top: 54.5%;
     left: 50.5%;
     width: 690px;
     height: 500px;
     background-color: rgb(61 115 157 / 55%);
     border: 5px solid white;
     margin: -350px 0 0 -350px;
     padding: 20px 20px 20px 20px;
     z-index: 20;
     background-image: url("https://images.wallpaperscraft.com/image/single/mountains_mountain_range_peaks_149574_1920x1200.jpg");
}
 .hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip {
     background: #649db0;
}
 .hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip:hover, .hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip:active {
     background: #1cb2c9;
}
 .hud-menu-shop .hud-shop-grid .hud-shop-item .hud-shop-item-actions .hud-shop-actions-equip.is-disabled {
     background: none;
}
 .hud-menu-shop .hud-shop-grid .hud-shop-item[data-item=HatComingSoon] .hud-shop-item-coming-soon {
     background: none;
}
 .hud-chat .hud-chat-message {
     white-space: unset;
     word-break: break-word;
}
 .hud-chat .hud-chat-messages {
     max-height: 340px;
     min-height: 35px;
}
 #hud-menu-settings {
     background-image: url("https://images.wallpaperscraft.com/image/single/mountains_mountain_range_peaks_149574_1920x1200.jpg");
}
 .hud .box {
     display: block;
     width: 100%;
     height: 50px;
     line-height: 34px;
     padding: 8px 14px;
     margin: 0 0 10px;
     background: #eee;
     border: 0;
     font-size: 14px;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
     border-radius: 4px;
}
 .codeIn, .joinOut {
     height: 50px;
}
 .hud-menu-raid{
     display: none;
     position: fixed;
     top: 48%;
     left: 50%;
     width: 650px;
     height: 560px;
     margin: -270px 0 0 -300px;
     padding: 20px;
     background: rgba(0, 0, 0, 0.6);
     color: #eee;
     border-radius: 4px;
     z-index: 15;
     background-image: url("https://images.wallpaperscraft.com/image/single/mountains_mountain_range_peaks_149574_1920x1200.jpg");
}
 .hud-menu-raid h3 {
     display: block;
     margin: 0;
     line-height: 20px;
}
 .hud-menu-raid .hud-raid-grid {
     display: block;
     height: 440px;
     padding: 0px;
     margin-top: 6px;
}
.hud-raid-grid {
     overflow: auto ;
}
 .hud-spell-icons .hud-spell-icon[data-type="raid"]::before {
     background-image: url("https://i.pinimg.com/564x/b0/d3/38/b0d338dbf286e551cc0b92fc98ab9763.jpg");
}
 .hud-menu-raid .hud-the-tab {
     position: relative;
     height: 60px;
     line-height: 40px;
     margin: 20px;
     border: 0px solid rgb(0, 0, 0, 0);
}
 .hud-menu-raid .hud-the-tab {
     display: block;
     float: left;
     margin: 0 1px 0 0;
     font-size: 14px;
     background: rgba(0, 0, 0, 0.4);
     color: rgba(255, 255, 255, 0.4);
     transition: all 0.15s ease-in-out;
}
 .hud-menu-raid .hud-the-tab:hover {
     background: rgba(0, 0, 0, 0.2);
     color: #eee;
     cursor: pointer;
}
.hud-raid-menus {
     border: 3px solid #222222;
     background: linear-gradient(#100c4d, #040317);
     height: 100%;
     text-align: center;
     width: 100px;
     float: left;
}
.mbtn {
     width: 100%;
     height: 20%;
     border: none;
     font-size: 100%;
     color: white;
     margin: 0px;
     background-color: rgba(0, 0, 0, 0);
}
.mbtn:hover, .activeM {
     background-color: #171369;
}
.mbtn, .hud-raid-menus {
     border-radius: 15px;
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);
styles.type = "text/css";

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "raid");
spell.classList.add("hud-raid-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

let modHTML = `
<div class="hud-menu-raid">
<div class='hud-raid-menus'>
<button class="btn-blue SE mbtn">Utils</button>
<br />
<button class="btn-blue SI mbtn">Utils (2)</button>
<br />
<button class="btn-blue AB mbtn">Alts</button>
<br />
<button class="btn-blue BS mbtn">Bases</button>
<br />
<button class="btn-blue RE mbtn">Renderer</button>
<br />
</div>
<div class="hud-raid-grid"></div>
</div>
`;

document.body.insertAdjacentHTML("afterbegin", modHTML);

let raidMenu = document.getElementsByClassName("hud-menu-raid")[0];

document.getElementsByClassName("hud-raid-icon")[0].addEventListener("click", function() {
    if (raidMenu.style.display == "none" || raidMenu.style.display == "") {
        raidMenu.style.display = "block";
    } else {
        raidMenu.style.display = "none";
    };
});

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 220:
            /* key \ */
            if (game.world.inWorld) document.getElementsByClassName("hud-raid-icon")[0].click();
    };
});

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");

let allIcon = [
    _menu[0],
    _menu[1],
    _menu[2],
    _spell[0],
    _spell[1]
];

allIcon.forEach(function(elem) {
    elem.addEventListener("click", function() {
        if (raidMenu.style.display == "block") {
            raidMenu.style.display = "none";
        };
    });
});

document.getElementsByClassName("SE")[0].addEventListener("click", function() {
    displayAllToNone();

    document.getElementsByClassName("SE")[0].classList.add("activeM");
    document.getElementsByClassName("etc.Class")[0].innerText = "Utils";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("SI")[0].addEventListener("click", function() {
    displayAllToNone();

    document.getElementsByClassName("SI")[0].classList.add("activeM");
    document.getElementsByClassName("etc.Class")[0].innerText = "Utils (2)";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("AB")[0].addEventListener("click", function() {
    displayAllToNone();

    document.getElementsByClassName("AB")[0].classList.add("activeM");
    document.getElementsByClassName("etc.Class")[0].innerText = "Alts";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("BS")[0].addEventListener("click", function() {
    displayAllToNone();

    document.getElementsByClassName("BS")[0].classList.add("activeM");
    document.getElementsByClassName("etc.Class")[0].innerText = "Bases";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("RE")[0].addEventListener("click", function() {
    displayAllToNone();

    document.getElementsByClassName("RE")[0].classList.add("activeM");
    document.getElementsByClassName("etc.Class")[0].innerText = "Renderer";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i4")[0]) {
            document.getElementsByClassName(i + "i4")[0].style.display = "";
        };
    };
});

// key to open and close
function modm() {
    if (raidMenu.style.display == "none" || raidMenu.style.display == "") {
        raidMenu.style.display = "block";
    } else {
        raidMenu.style.display = "none";
    };
};

function displayAllToNone() {
    document.getElementsByClassName("SE")[0].classList.remove("activeM");
    document.getElementsByClassName("SI")[0].classList.remove("activeM");
    document.getElementsByClassName("AB")[0].classList.remove("activeM");
    document.getElementsByClassName("BS")[0].classList.remove("activeM");
    document.getElementsByClassName('RE')[0].classList.remove("activeM");

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i4")[0]) {
            document.getElementsByClassName(i + "i4")[0].style.display = "none";
        };
    };

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "none";
        };
    };
};

document.getElementsByClassName("hud-raid-grid")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3 class="etc.Class">raid</h3>
<hr />
<button class="btn btn-blue 1i" style="width: 45%;">Sell All!</button>

<button class="btn btn-blue 2i" style="width: 45%;">Sell Walls!</button>

<button class="btn btn-blue 3i" style="width: 45%;">Sell Doors!</button>

<button class="btn btn-blue 4i" style="width: 45%;">Sell Traps!</button>

<button class="btn btn-blue 5i" style="width: 45%;">Sell Arrows!</button>

<button class="btn btn-blue 6i" style="width: 45%;">Sell Mages!</button>

<button class="btn btn-blue 7i" style="width: 45%;">Sell Pets!</button>

<button class="btn btn-blue 8i" style="width: 45%;">Activate Upgrade All!</button>

<button class="btn btn-blue 9i" style="width: 45%;">Activate AHRC!</button>

<button class="btn btn-blue 10i" style="width: 45%;">Enable Autobow</button>

<button class="btn btn-blue 13i" style="width: 45%;">Enable Auto Accepter</button>

<button class="btn btn-blue 14i" style="width: 45%;">Enable Auto Kicker</button>

<br class="16i"><br class="17i">

<button class="btn btn-blue 0i5" style="width: 45%;">Can Members Sell!</button>

<button class="btn btn-blue 1i5" style="width: 45%;"">Kick All Members!</button>

<button class="btn btn-red 8i5" style="width: 45%;">!(Auto heal and Pet Heal)</button>

<button class="btn btn-red 9i5" style="width: 45%;">!(Revive and Evolve Pets)</button>

<button class="btn btn-blue 5i5" style="width: 45%;">Enable Send Info!</button>

<button class="btn btn-blue 10i5" style="width: 45%;">Clear Messages!</button>

<button class="btn btn-blue 11i5" style="width: 45%;">Enable Screenshot Mode</button>

<button class="btn btn-blue 12i5" style="width: 45%;">Enable Debug</button>

<button class="btn btn-blue 13i5" style="width: 45%;">Enable AutoAim!</button>
<select id="aimOptions" class="btn btn-blue 14i5"style="width: 45%;"><option value="pl" selected>Players</option><option value="zo">Zombies</option></select>

<br class="15i5"><br class="16i5">

<button class="btn btn-blue 0i2">Send Alt!</button>

<button class="btn btn-blue 1i2">Enable Aim!</button>

<button class="btn btn-blue 2i2">Enable Player Follower!</button>

<button class="btn btn-blue 10i2 emm">Enable MouseMove!</button>

<br class="23i2"><br class="24i2">

<button class="btn btn-blue 3i2">Delete Alt!</button>

<input type="number" class="btn 4i2" style='width: 125px;' placeholder="Alt Id">

<button class="btn btn-blue 7i2">Delete All Alts!</button>

<button class="btn btn-blue 28i2">Enable Auto Raid!</button>

<br class="5i2"><br class="6i2">

<button class="btn btn-blue 8i2">Show Resources!</button>

<button class="btn btn-blue 21i2">Control Alts!</button>

<button class="btn btn-blue 30i2">Lock Pos!</button>

<br class="9i2"><br class="10i2">

<button class="btn btn-blue 11i2">Start Aito!</button>

<button class="btn btn-blue 12i2">Activate Base Finder!</button>

<button class="btn btn-blue 17i2">Clear Base Objects</button>

<br class="14i2"><br class="15i2">

<input type="text" value="1" class="btn 16i2" placeholder="Player Rank" style="width: 25%;">

<button class="btn btn-blue 18i2">Activate Player Finder</button>

<button class="btn btn-blue 25i2">Follow Position</button>

<br class="19i2"><br class="20i2">

<button class="btn btn-blue 0i3" onclick="RecordBase();">Record Base!</button>

<button class="btn btn-blue 1i3" onclick="buildRecordedBase();">Build Recorded Base!</button>

<button class="btn btn-blue 2i3" onclick="DeleteRecordedbase();">Delete Recorded Base!</button>

<br class="3i3"><br class="4i3">

<button class="btn btn-blue 5i3" onclick="RecordBase2();">Record Base (2)!</button>

<button class="btn btn-blue 6i3" onclick="buildRecordedBase2();">Build Recorded Base (2)!</button>

<button class="btn btn-blue 7i3" onclick="DeleteRecordedbase2();">Delete Recorded Base (2)!</button>

<br class="8i3"><br class="9i3">

<button class="btn btn-blue 10i3" onclick="RecordBase3();">Record Base (3)!</button>

<button class="btn btn-blue 11i3" onclick="buildRecordedBase3();">Build Recorded Base (3)!</button>

<button class="btn btn-blue 12i3" onclick="DeleteRecordedbase3();">Delete Recorded Base (3)!</button>

<br class="13i3"><br class="14i3">

<button class="btn btn-blue 15i3" onclick="saveBase();">Save Towers!</button>

<button class="btn btn-blue 16i3" onclick="buildSavedBase();">Build Saved Towers!</button>

<br class="17i3"><br class="18i3">

<button class="btn btn-blue 21i3" onclick="autobuildtoggle();">Enable Auto Build Saved Towers!</button>

<button class="btn btn-blue 26i3" onclick="upgradealltoggle();">Enable Upgrade All!</button>

<br class="28i3"><br class="29i3">

<input type="text" class="btn 30i3" placeholder='Click "Save Towers!" and build your favorite base to get their codes.' style="width: 100%" disabled="true">

<br class="31i3"><br class="32i3">

<button class='btn btn-blue 0i4'>Hide Ground</button>

<button class='btn btn-blue 1i4'>Show Projectiles</button>

<button class='btn btn-blue 2i4'>Hide Npcs</button>

<br class='3i4'><br class='4i4'>

<button class='btn btn-blue 5i4'>Hide Environment</button>

<button class='btn btn-blue 6i4'>Show Grids</button>

<br class='7i4'><br class='8i4'>

<button class='btn btn-blue 9i4'>Hide Scene</button>

<button class='btn btn-blue 10i4'>Stop Game</button>

<br class='11i4><br class='12i4>
`;

displayAllToNone();

let Main1Keys = true;
let Main2Keys = true;
let Main3Keys = true;

let upgradeAll = false;
let AHRC = false;
let autobow = false;
let accept = false;
let kick = false;
let heal = true;
let revive = true;
let clearMsgs = false;
let autobuild = false;
let upgradeAll2 = false;
let petTimeout = false;
let screenshotMode = false;
let debugMode = false;
let myPlayer;
let myPet;
let shouldHealPet;
let autorss;
let uid;
let shouldautoaim = false;
var getRss = false;
var allowed1 = true;
let entities = {};
let players = {};
let buildings = {};
let stopped = false;

let msg;

var Bowtier = 0;

let packets = {
    0: "PACKET_ENTITY_UPDATE",
    1: "PACKET_PLAYER_COUNTER_UPDATE",
    2: "PACKET_SET_WORLD_DIMENSIONS",
    3: "PACKET_INPUT",
    4: "PACKET_ENTER_WORLD",
    7: "PACKET_PING",
    9: "PACKET_RPC",
    PACKET_ENTER_WORLD: 4,
    PACKET_ENTITY_UPDATE: 0,
    PACKET_INPUT: 3,
    PACKET_PING: 7,
    PACKET_PLAYER_COUNTER_UPDATE: 1,
    PACKET_RPC: 9,
    PACKET_SET_WORLD_DIMENSIONS: 2
};

window.count = 0;

function msToTime(s) {
    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
};

document.addEventListener('keyup', function(e) {
    if (e.key === "Enter" && game.ui.playerTick.dead === 1) {
        game.ui.components.Chat.startTyping();
    };
});

function findNearestAltToStash() {
    if (window.allSockets.length < 1) return;

    let altArray = [];
    let targetGoldStash = Object.values(game.world.entities).find(building => building.fromTick.model == "GoldStash");
    if (targetGoldStash.targetTick.partyId == game.ui.playerPartyId) return;

    for (let i in window.allSockets) {
        if (!window.allSockets[i].myPlayer.dead) altArray.push(window.allSockets[i].myPlayer);
    };

    if (altArray.length < 1) return;

    altArray.sort((a, b) => measureDistance(targetGoldStash.fromTick.position, a.position) - measureDistance(targetGoldStash.fromTick.position, b.position));

    return altArray[0];
};

window.findNearestAlt = findNearestAltToStash;

// Renderer

document.getElementsByClassName('0i4')[0].addEventListener('click', () => {
    let on = game.renderer.ground.isVisible;

    if (on) {
        game.renderer.ground.setVisible(!on);

        document.getElementsByClassName('0i4')[0].innerText = 'Show Ground';
    } else if (!on) {
        game.renderer.ground.setVisible(!on);

        document.getElementsByClassName('0i4')[0].innerText = 'Hide Ground';
    };
});

document.getElementsByClassName('1i4')[0].addEventListener('click', () => {
    let on = game.renderer.projectiles.isVisible;

    if (on) {
        game.renderer.projectiles.setVisible(!on);

        document.getElementsByClassName('1i4')[0].innerText = 'Show Projectiles';
    } else if (!on) {
        game.renderer.projectiles.setVisible(!on);

        document.getElementsByClassName('1i4')[0].innerText = 'Hide Projectiles';
    };
});

document.getElementsByClassName('2i4')[0].addEventListener('click', () => {
    let on = game.renderer.npcs.isVisible;

    if (on) {
        game.renderer.npcs.setVisible(!on);

        document.getElementsByClassName('2i4')[0].innerText = 'Show Npcs';
    } else if (!on) {
        game.renderer.npcs.setVisible(!on);

        document.getElementsByClassName('2i4')[0].innerText = 'Hide Npcs';
    };
});

document.getElementsByClassName('5i4')[0].addEventListener('click', () => {
    let on = game.renderer.scenery.isVisible;

    if (on) {
        game.renderer.scenery.setVisible(!on);

        document.getElementsByClassName('5i4')[0].innerText = 'Show Environment';
    } else if (!on) {
        game.renderer.scenery.setVisible(!on);

        document.getElementsByClassName('5i4')[0].innerText = 'Hide Environment';
    };
});

document.getElementsByClassName('6i4')[0].addEventListener('click', () => {
    if (game.script.grouping.isVisible) {
        game.script.grouping.hide();

        document.getElementsByClassName('6i4')[0].innerText = 'Show Grids';
    } else if (!game.script.grouping.isVisible) {
        game.script.grouping.show();

        document.getElementsByClassName('6i4')[0].innerText = 'Hide Grids';
    };
});

document.getElementsByClassName('9i4')[0].addEventListener('click', () => {
    let on = game.renderer.scene.isVisible;

    if (on) {
        game.renderer.scene.setVisible(!on);

        document.getElementsByClassName('9i4')[0].innerText = 'Show Scene';
    } else if (!on) {
        game.renderer.scene.setVisible(!on);

        document.getElementsByClassName('9i4')[0].innerText = 'Hide Scene';
    };
});

document.getElementsByClassName('10i4')[0].addEventListener('click', () => {
    if (stopped) {
        game.start();

        document.getElementsByClassName('10i4')[0].innerText = 'Stop Game';
    } else if (!stopped) {
        game.stop();

        document.getElementsByClassName('10i4')[0].innerText = 'Start Game';
    };

    stopped = !stopped;
});

game.network.addPacketHandler = function(event, callback) {
    game.network.emitter.on(packets[event], callback);
};

game.network.emitter.removeListener('PACKET_ENTITY_UPDATE', game.network.emitter._events.PACKET_ENTITY_UPDATE);

game.network.addPacketHandler(0, function(e) {
    game.network.sendRpc({
        "name": "BuyItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
})
for (let i = 0; i < 10; i++) {
    game.network.addPacketHandler(i, function(e) {
        msg = e;
        interval();
    });
};

let interval = () => {
    if (msg.uid) {
        uid = msg.uid;
        players = {};
        entities = {};
        buildings = {};
        window.message = 0;
    }
    if (msg.entities) {
        if (window.message == 0) {
            game.world.replicator.onEntityUpdate(msg);
        }
        if (msg.entities[uid].name) {
            myPlayer = msg.entities[uid];
        }
        for (let g in myPlayer) {
            if (myPlayer[g] !== msg.entities[uid][g] && msg.entities[uid][g] !== undefined) {
                myPlayer[g] = msg.entities[uid][g];
            }
        }
        if (myPlayer.petUid) {
            if (msg.entities[myPlayer.petUid]) {
                if (msg.entities[myPlayer.petUid].model) {
                    myPet = msg.entities[myPlayer.petUid];
                    shouldHealPet = false;
                }
            }
            for (let g in myPet) {
                if (msg.entities[myPlayer.petUid]) {
                    if (myPet[g] !== msg.entities[myPlayer.petUid][g] && msg.entities[myPlayer.petUid][g] !== undefined) {
                        myPet[g] = msg.entities[myPlayer.petUid][g]
                    }
                }
            }
        }
        for (let i in msg.entities) {
            if (msg.entities[i].name) {
                players[i] = msg.entities[i];
                if (autorss) {
                    for (let i2 = 0; i2 < 8; i2++) {
                        for (let i = 0; i < 8; i++) {
                            game.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: i
                            })
                        }
                    }

                    let t = 0;
                    let rainbowBowtoggle = true;
                    interval = setInterval(() => {
                        if (rainbowBowtoggle)
                            t = (t + 1) % 8;
                        game.network.sendRpc({
                            name: "EquipItem",
                            itemName: "Bow",
                            tier: t
                        })
                    }, 50);
                }
            }
        }
        for (let i in players) {
            if (!msg.entities[i]) {
                delete players[i];
            }
            for (let g in players[i]) {
                if (players[i][g] !== msg.entities[i][g] && msg.entities[i][g] !== undefined) {
                    players[i][g] = msg.entities[i][g];
                }
            }
        }
    }
    if (game.world.inWorld) {
        let entities = game.world.entities;
        if (upgradeAll) {
            if (!window.upgradeAll1) {
                window.upgradeAll1 = true;
                setTimeout(() => {
                    window.upgradeAll1 = false;
                }, 100);
                for (let uid in entities) {
                    if (entities[uid].fromTick.tier !== 8 || entities[uid].fromTick.tier !== GetGoldStash().uid) {
                        game.network.sendRpc({
                            name: "UpgradeBuilding",
                            uid: game.world.entities[uid].fromTick.uid
                        });
                    }
                }
            }
        }
        if (AHRC) {
            if (!window.AHRC1) {
                window.AHRC1 = true;
                setTimeout(() => {
                    window.AHRC1 = false;
                }, 75);
                for (let uid in entities) {
                    if (!entities.hasOwnProperty(uid)) continue;
                    let obj = entities[uid];
                    game.network.sendRpc({
                        name: "CollectHarvester",
                        uid: obj.fromTick.uid
                    });
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.07
                        });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.11
                        });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.17
                        });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.22
                        });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.25
                        });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.28
                        });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.42
                        });
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.65
                        });
                    }
                }
            }
        }
        if (autobow) {
            game.network.sendInput({
                space: 0
            })
            game.network.sendInput({
                space: 1
            })
        }
        if (accept) {
            for (let i2 = 0; i2 < document.getElementsByClassName("btn btn-green hud-confirmation-accept").length; i2++) {
                document.getElementsByClassName("btn btn-green hud-confirmation-accept")[i2].click();
            };
        };
        if (kick) {
            for (let i in game.ui.playerPartyMembers) {
                game.network.sendRpc({
                    name: "KickParty",
                    uid: game.ui.playerPartyMembers[i].playerUid
                });
            };
        };
        if (revive) {
            if (!window.reviver) {
                window.reviver = true;
                setTimeout(() => {
                    window.reviver = false;
                }, 1000);
                let element1 = document.getElementsByClassName("hud-shop-actions-revive");
                for (let i = 0; i < element1.length; i++) {
                    element1[i].click();
                }
                let element2 = document.getElementsByClassName("hud-shop-actions-evolve");
                for (let i = 0; i < element2.length; i++) {
                    element2[i].click();
                }
            }
        }

        if (clearMsgs) {
            for (let i = 0; i < document.getElementsByClassName('hud-chat-message').length; i++) {
                document.getElementsByClassName('hud-chat-message')[i].remove();
            }
        }
        if (autobuild) {
            if (!window.autobuildtimeout) {
                window.autobuildtimeout = true;
                setTimeout(() => {
                    window.autobuildtimeout = false;
                }, 5000)
                if (GetGoldStash !== undefined) {
                    window.buildSavedBase();
                }
            }
        }
        if (upgradeAll2) {
            if (!window.upgradeAll2) {
                window.upgradeAll2 = true;
                setTimeout(() => {
                    window.upgradeAll2 = false;
                }, 50);
                for (let uid in entities) {
                    if (entities[uid].fromTick.tier !== 8 || entities[uid].fromTick.tier !== GetGoldStash().uid) {
                        game.network.sendRpc({
                            name: "UpgradeBuilding",
                            uid: game.world.entities[uid].fromTick.uid
                        });
                    }
                }
            }
        }
        if (heal) {
            if (myPlayer) {
                let playerHealth = (myPlayer.health / myPlayer.maxHealth) * 100;
                if (playerHealth <= 10) {
                    if (!window.playerTimeout_1) {
                        window.playerTimeout_1 = true;
                        setTimeout(() => {
                            window.playerTimeout_1 = false;
                        }, 300)
                        healPlayer();
                    }
                }
            }
        }
        if (heal) {
            if (myPet) {
                let petHealth = (myPet.health / myPet.maxHealth) * 100;
                if (petHealth <= 70) {
                    if (!petTimeout) {
                        petTimeout = true;

                        setTimeout(() => {
                            petTimeout = false;
                        }, 300);

                        game.network.sendRpc({
                            "name": "BuyItem",
                            "itemName": "PetHealthPotion",
                            "tier": 1
                        });

                        game.network.sendRpc({
                            "name": "EquipItem",
                            "itemName": "PetHealthPotion",
                            "tier": 1
                        });
                    };
                };
            };
        };

        if (shouldautoaim && msg.opcode == 0) {
            window.targets = [];
            let entities = game.renderer.npcs.attachments;
            for (let i in entities) {
                if (document.getElementById('aimOptions').value == 'pl' ?
                    (entities[i].fromTick.model == "GamePlayer" && entities[i].fromTick.uid !== game.ui.playerTick.uid && entities[i].targetTick.partyId !== game.ui.playerPartyId && entities[i].fromTick.dead == 0) :
                    (entities[i].fromTick.model !== "GamePlayer" && entities[i].entityClass !== "Projectile")) {
                    window.targets.push(entities[i].fromTick);
                };
            };
            if (window.targets.length > 0) {
                const myPos = game.ui.playerTick.position;

                window.targets.sort((a, b) => {
                    return measureDistance(myPos, a.position) - measureDistance(myPos, b.position);
                });

                const target = window.targets[0];

                let reversedAim = game.inputPacketCreator.screenToYaw((target.position.x - myPos.x) * 100, (target.position.y - myPos.y) * 100);

                game.inputPacketCreator.lastAnyYaw = reversedAim;

                game.network.sendPacket(3, {
                    mouseMoved: reversedAim
                });
            };
        };

        if (window.findPlayer) {
            if (myPlayer.position.y - window.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendInput({
                    down: 0
                });
            } else {
                game.network.sendInput({
                    down: 1
                });
            };

            if (-myPlayer.position.y + window.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendInput({
                    up: 0
                });
            } else {
                game.network.sendInput({
                    up: 1
                });
            };

            if (-myPlayer.position.x + window.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendInput({
                    left: 0
                });
            } else {
                game.network.sendInput({
                    left: 1
                });
            };

            if (myPlayer.position.x - window.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y - window.playerY), 2) + Math.pow((myPlayer.position.x - window.playerX), 2)) < 100) {
                game.network.sendInput({
                    right: 0
                });
            } else {
                game.network.sendInput({
                    right: 1
                });
            };
        };
    };
};

function measureDistance(obj1, obj2) {
    if (!(obj1.x && obj1.y && obj2.x && obj2.y)) return Infinity;
    let xDif = obj2.x - obj1.x;
    let yDif = obj2.y - obj1.y;
    return (xDif ** 2) + (yDif ** 2);
};

window.copyText = t => {
    const elem = document.createElement('textarea');
    elem.value = t;

    document.body.appendChild(elem);
    elem.select();

    document.execCommand('copy');
    document.body.removeChild(elem);
};

window.ssMode = () => {
    var mba = document.querySelectorAll([".hud-bottom-right", ".hud-bottom-left", ".hud-bottom-center", ".hud-center-left", ".hud-top-right"]);

    for (let mb of mba) {
        if (mb.style.display === "none") {
            mb.style.display = "block";
        } else {
            mb.style.display = "none";
        }
    };

    document.querySelector(".hud-bottom-right").appendChild(document.querySelector("#hud-health-bar"));
    document.querySelector(".hud-bottom-right").insertAdjacentElement("afterbegin", document.querySelector("#hud-party-icons"));
    document.querySelector(".hud-bottom-left").insertAdjacentElement("afterbegin", document.querySelector("#hud-day-night-ticker"));
};

window.ssModeReset = () => {
    var mba = document.querySelectorAll([".hud-bottom-right", ".hud-bottom-left", ".hud-bottom-center", ".hud-center-left", ".hud-top-right"]);

    for (let mb of mba) {
        if (mb.style.display === "none") {
            mb.style.display = "block";
        };
    };
};

game.network.addEntityUpdateHandler(() => {
    if (getRss) {
        !allowed1 && (allowed1 = true);
    }
    if (getRss || allowed1) {
        for (let i in game.renderer.npcs.attachments) {
            if (game.renderer.npcs.attachments[i].fromTick.name) {
                let player = game.renderer.npcs.attachments[i];
                let wood_1 = counter(player.targetTick.wood);
                let stone_1 = counter(player.targetTick.stone);
                let gold_1 = counter(player.targetTick.gold);
                let token_1 = counter(player.targetTick.token);
                let px_1 = counter(player.targetTick.position.x);
                let py_1 = counter(player.targetTick.position.y);
                let timeout_1 = "";
                if (getRss && !player.targetTick.oldName) {
                    player.targetTick.oldName = player.targetTick.name;
                    player.targetTick.oldWood = wood_1;
                    player.targetTick.oldStone = stone_1;
                    player.targetTick.oldGold = gold_1;
                    player.targetTick.oldToken = token_1;
                    player.targetTick.oldPX = px_1;
                    player.targetTick.oldPY = py_1;
                    player.targetTick.info = `
  ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
                    ${player.targetTick.isPaused ? "On Timeout" : ""}





`;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                }
                if (!getRss && player.targetTick.oldName) {
                    player.targetTick.info = player.targetTick.oldName;
                    player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    player.targetTick.oldName = null;
                }
                if (getRss) {
                    if (player.targetTick.oldGold !== gold_1 || player.targetTick.oldWood !== wood_1 || player.targetTick.oldStone !== stone_1 || player.targetTick.oldToken !== token_1 || player.targetTick.oldPX !== px_1 || player.targetTick.oldPY !== py_1) {
                        player.targetTick.oldWood = wood_1;
                        player.targetTick.oldStone = stone_1;
                        player.targetTick.oldGold = gold_1;
                        player.targetTick.oldToken = token_1;
                        player.targetTick.oldPX = px_1;
                        player.targetTick.oldPY = py_1;
                        player.targetTick.info = `
  ${player.targetTick.oldName}; score: ${player.targetTick.score.toLocaleString()}
  UID: ${player.targetTick.uid}
  W: ${wood_1}, S: ${stone_1}, G: ${gold_1}, T: ${token_1}
  x: ${Math.round(player.targetTick.position.x)}, y: ${Math.round(player.targetTick.position.y)}
  partyId: ${Math.round(player.targetTick.partyId)}
  timeDead: ${msToTime(player.targetTick.timeDead)}
                    ${player.targetTick.isPaused ? "On Timeout" : ""}





`;
                        player.targetTick.name = game.renderer.npcs.attachments[i].targetTick.info;
                    }
                }
            }
        }
    }
    if (!getRss) {
        allowed1 = false;
    }
});

document.getElementsByClassName("1i")[0].addEventListener('click', function() {
    for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type !== "GoldStash") {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("2i")[0].addEventListener('click', function() {
    for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "Wall") {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("3i")[0].addEventListener('click', function() {
    for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "Door") {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("4i")[0].addEventListener('click', function() {
    for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "SlowTrap") {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("5i")[0].addEventListener('click', function() {
    for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "ArrowTower") {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("6i")[0].addEventListener('click', function() {
    for (let uid in game.ui.buildings) {
        if (game.ui.buildings[uid].type == "MagicTower") {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})

document.getElementsByClassName("7i")[0].addEventListener('click', function() {
    for (let uid in game.world.entities) {
        if (game.world.entities[uid].fromTick.model == "PetCARL" || game.world.entities[uid].fromTick.model == "PetMiner") {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.world.entities[uid].fromTick.uid
            });
        }
    }
})

document.getElementsByClassName("8i")[0].addEventListener('click', function() {
    upgradeAll = !upgradeAll;

    document.getElementsByClassName("8i")[0].className = "btn btn-blue 8i";
    document.getElementsByClassName("8i")[0].innerText = "Actitivate Upgrade All!";

    if (upgradeAll) {
        document.getElementsByClassName("8i")[0].className = "btn btn-red 8i";
        document.getElementsByClassName("8i")[0].innerText = "Deactivate Upgrade All!";
    }
})
document.getElementsByClassName("9i")[0].addEventListener('click', function() {
    AHRC = !AHRC;

    document.getElementsByClassName("9i")[0].className = "btn btn-blue 9i";
    document.getElementsByClassName("9i")[0].innerText = "Activate AHRC!";

    if (AHRC) {
        document.getElementsByClassName("9i")[0].className = "btn btn-red 9i";
        document.getElementsByClassName("9i")[0].innerText = "Deactivate AHRC!";
    }
})
document.getElementsByClassName("10i")[0].addEventListener('click', function() {
    autobow = !autobow;
    let playerWeapon = game.ui.playerTick.weaponName;

    document.getElementsByClassName("10i")[0].className = "btn btn-blue 10i";
    document.getElementsByClassName("10i")[0].innerText = "Enable Autobow";

    if (autobow) {
        document.getElementsByClassName("10i")[0].className = "btn btn-red 10i";
        document.getElementsByClassName("10i")[0].innerText = "Disable Autobow";

        if (game.ui.inventory.Bow) {
            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: game.ui.inventory.Bow.tier
            });
        } else {
            game.network.sendRpc({
                name: "BuyItem",
                itemName: "Bow",
                tier: 1
            });

            game.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: 1
            });
        };
    } else {
        game.network.sendRpc({
            name: "EquipItem",
            itemName: playerWeapon,
            tier: game.ui.inventory[playerWeapon].tier
        });
    };
});

document.getElementsByClassName("11i2")[0].addEventListener('click', function() {
    window.startaito = !window.startaito;

    document.getElementsByClassName("11i2")[0].innerText = "Start Aito!";

    if (window.startaito) {
        window.sendAitoAlt();

        document.getElementsByClassName("11i2")[0].innerText = "Stop Aito!";
    };
});

document.getElementsByClassName("13i")[0].addEventListener('click', function() {
    accept = !accept;

    document.getElementsByClassName("13i")[0].className = "btn btn-blue 13i";
    document.getElementsByClassName("13i")[0].innerText = "Enable Auto Accepter";

    if (accept) {
        document.getElementsByClassName("13i")[0].className = "btn btn-red 13i";
        document.getElementsByClassName("13i")[0].innerText = "Disable Auto Accepter";
    };
});

document.getElementsByClassName("14i")[0].addEventListener('click', function() {
    kick = !kick;

    document.getElementsByClassName("14i")[0].className = "btn btn-blue 14i";
    document.getElementsByClassName("14i")[0].innerText = "Enable Auto Kicker";

    if (kick) {
        document.getElementsByClassName("14i")[0].className = "btn btn-red 14i";
        document.getElementsByClassName("14i")[0].innerText = "Disable Auto Kicker";
    };
});

document.getElementsByClassName("11i5")[0].addEventListener('click', function() {
    screenshotMode = !screenshotMode;

    document.getElementsByClassName("11i5")[0].className = "btn btn-blue 11i5";
    document.getElementsByClassName("11i5")[0].innerText = "Enable Screenshot Mode";

    window.ssModeReset();

    if (screenshotMode) {
        document.getElementsByClassName("11i5")[0].className = "btn btn-red 11i5";
        document.getElementsByClassName("11i5")[0].innerText = "Disable Screenshot Mode";

        window.ssMode();
    };
});

document.getElementsByClassName("12i5")[0].addEventListener('click', function() {
    debugMode = !debugMode;

    document.getElementsByClassName("12i5")[0].className = "btn btn-blue 12i5";
    document.getElementsByClassName("12i5")[0].innerText = "Enable Debug Mode";

    game.debug.hide();

    if (debugMode) {
        document.getElementsByClassName("12i5")[0].className = "btn btn-red 12i5";
        document.getElementsByClassName("12i5")[0].innerText = "Disable Debug Mode";

        game.debug.show();
    };
});

document.getElementsByClassName("emm")[0].addEventListener('click', function() {
    window.mousemove = !window.mousemove;

    this.innerText = window.mousemove ? "Disable MouseMove!" : "Enable MouseMove!"
});

document.getElementsByClassName("28i2")[0].addEventListener('click', function() {
    window.autoraid = !window.autoraid;

    this.innerText = window.autoraid ? "Disable Auto Raid!" : "Enable Auto Raid!"
});

document.getElementsByClassName("0i5")[0].addEventListener('click', function() {
    for (let i in game.ui.playerPartyMembers) {
        game.network.sendRpc({
            name: "SetPartyMemberCanSell",
            uid: game.ui.playerPartyMembers[i].playerUid,
            canSell: 1
        })
    }
})
document.getElementsByClassName("1i5")[0].addEventListener('click', function() {
    for (let i in game.ui.playerPartyMembers) {
        game.network.sendRpc({
            name: "KickParty",
            uid: game.ui.playerPartyMembers[i].playerUid
        })
    }
})
document.getElementsByClassName("5i5")[0].addEventListener('click', function() {
    autorss = !autorss;
    document.getElementsByClassName("5i5")[0].className = "btn btn-blue 5i5";
    document.getElementsByClassName("5i5")[0].innerText = "Enable Send Info!";

    if (autorss) {
        document.getElementsByClassName("5i5")[0].className = "btn btn-red 5i5";
        document.getElementsByClassName("5i5")[0].innerText = "Disable Send Info!";
    };
});

document.getElementsByClassName("8i5")[0].addEventListener('click', function() {
    heal = !heal;
    document.getElementsByClassName("8i5")[0].className = "btn btn-blue 8i5";
    document.getElementsByClassName("8i5")[0].innerText = "Auto heal and Pet Heal";

    if (heal) {
        document.getElementsByClassName("8i5")[0].className = "btn btn-red 8i5";
        document.getElementsByClassName("8i5")[0].innerText = "!(Auto heal and Pet Heal)";
    };
});

document.getElementsByClassName("9i5")[0].addEventListener('click', function() {
    revive = !revive;
    document.getElementsByClassName("9i5")[0].className = "btn btn-blue 9i5";
    document.getElementsByClassName("9i5")[0].innerText = "Revive and Evolve Pets";

    if (revive) {
        document.getElementsByClassName("9i5")[0].className = "btn btn-red 9i5";
        document.getElementsByClassName("9i5")[0].innerText = "!(Revive and Evolve Pets)";
    };
});

document.getElementsByClassName("10i5")[0].addEventListener('click', function() {
    clearMsgs = !clearMsgs;
    document.getElementsByClassName("10i5")[0].className = "btn btn-blue 10i5";
    document.getElementsByClassName("10i5")[0].innerText = "Clear Messages";

    if (clearMsgs) {
        document.getElementsByClassName("10i5")[0].className = "btn btn-red 10i5";
        document.getElementsByClassName("10i5")[0].innerText = "!(Clear Messages)";
    };
});

document.getElementsByClassName("13i5")[0].addEventListener('click', function() {
    shouldautoaim = !shouldautoaim;
    document.getElementsByClassName("13i5")[0].className = "btn btn-blue 13i5";
    document.getElementsByClassName("13i5")[0].innerText = "Enable AutoAim!";

    if (shouldautoaim) {
        document.getElementsByClassName("13i5")[0].className = "btn btn-red 13i5";
        document.getElementsByClassName("13i5")[0].innerText = "Disable AutoAim!";
    };
});

document.getElementsByClassName("0i2")[0].addEventListener('click', function() {
    window.sendws();
});

document.getElementsByClassName("12i2")[0].addEventListener('click', function() {
    window.basefind = !window.basefind;
    document.getElementsByClassName("12i2")[0].innerText = "Activate Base Finder";

    if (window.basefind) {
        window.baseFinder();

        document.getElementsByClassName("12i2")[0].innerText = "Deactivate Base Finder";
    } else {
        window.basefind = false;
    };
});

document.getElementsByClassName("17i2")[0].addEventListener('click', function() {
    for (let obj in document.getElementsByClassName('scanned-building')) {
        document.getElementsByClassName('scanned-building')[obj].remove();
    };
});
document.getElementsByClassName("18i2")[0].addEventListener('click', function() {
    window.startaito2 = !window.startaito2;
    document.getElementsByClassName("18i2")[0].innerText = "Activate Player Finder";

    if (window.startaito2) {
        window.sendAitoAlt2();
        document.getElementsByClassName("18i2")[0].innerText = "Deactivate Player Finder";
    };
});
document.getElementsByClassName("25i2")[0].addEventListener('click', function() {
    if (window.playerX && window.playerY) {
        window.findPlayer = !window.findPlayer;

        document.getElementsByClassName("25i2")[0].innerText = "Follow Position";

        if (window.findPlayer) {
            document.getElementsByClassName("25i2")[0].innerText = "Unfollow Position";
        };
    } else {
        game.ui.components.PopupOverlay.showHint("Player not found! You can try again once it's found.");
    };
});

document.getElementsByClassName("2i2")[0].addEventListener('click', function() {
    setTimeout(() => {
        if (window.move) {
            document.getElementsByClassName("2i2")[0].innerText = "Disable Player Follower!";
        } else {
            document.getElementsByClassName("2i2")[0].innerText = "Enable Player Follower!";
        }
    }, 100)
});

document.getElementsByClassName("3i2")[0].addEventListener('click', function() {
    let id = Math.floor(document.getElementsByClassName("4i2")[0].value);

    window.allSockets[id - 1].close();
});

game.network.sendInput = (e) => {
    let i = e;

    if (!i.mouseDown && !i.mouseUp) {
        game.network.sendPacket(3, e);
    };
};

document.getElementsByClassName('hud')[0].addEventListener('mousedown', e => {
    if (!e.button) {
        game.network.sendPacket(3, {
            mouseDown: game.inputPacketCreator.screenToYaw(e.clientX, e.clientY)
        });
    };

    if (raidMenu.style.display == 'block') {
        raidMenu.style.display = 'none';
    };
});

document.getElementsByClassName('hud')[0].addEventListener('mouseup', e => {
    if (!e.button) {
        game.network.sendPacket(3, {
            mouseUp: 1
        });
    };
});

window.RecordBase = function(baseName) {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");

        let buildings = game.ui.buildings;

        let base = "";

        let stash = GetGoldStash();

        if (stash == undefined) return;

        let stashPosition = {
            x: stash.x,
            y: stash.y
        };

        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) continue;

            let obj = buildings[uid];

            let x = game.ui.buildings[obj.uid].x - stashPosition.x;

            let y = game.ui.buildings[obj.uid].y - stashPosition.y;

            let building = game.ui.buildings[obj.uid].type;

            let yaw = 0;

            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        };

        localStorage.RecordedBase1 = base;
    });
};

window.buildRecordedBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            clearInterval(waitForGoldStash);

            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");

            var basecode = localStorage.RecordedBase1;

            basecode = new Function(basecode);

            return basecode();
        };
    }, 275);
};

window.DeleteRecordedbase = function() {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");

        localStorage.RecordedBase1 = null;
    });
};

window.RecordBase2 = function(baseName) {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");

        let buildings = game.ui.buildings;

        let base = "";

        let stash = GetGoldStash();

        if (stash == undefined) return;

        let stashPosition = {
            x: stash.x,
            y: stash.y
        };

        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) continue;

            let obj = buildings[uid];

            let x = game.ui.buildings[obj.uid].x - stashPosition.x;

            let y = game.ui.buildings[obj.uid].y - stashPosition.y;

            let building = game.ui.buildings[obj.uid].type;

            let yaw = 90;

            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        };

        localStorage.RecordedBase2 = base;
    });
};

window.buildRecordedBase2 = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            clearInterval(waitForGoldStash);

            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");

            var basecode = localStorage.RecordedBase2;

            basecode = new Function(basecode);

            return basecode();
        };
    }, 275);
};

window.DeleteRecordedbase2 = function() {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");

        localStorage.RecordedBase2 = null;
    });
};

window.RecordBase3 = function(baseName) {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");

        let buildings = game.ui.buildings;

        let base = "";

        let stash = GetGoldStash();

        if (stash == undefined) return;

        let stashPosition = {
            x: stash.x,
            y: stash.y
        };

        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) continue;

            let obj = buildings[uid];

            let x = game.ui.buildings[obj.uid].x - stashPosition.x;

            let y = game.ui.buildings[obj.uid].y - stashPosition.y;

            let building = game.ui.buildings[obj.uid].type;

            let yaw = 180;

            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        };

        localStorage.RecordedBase3 = base;
    });
};

window.buildRecordedBase3 = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            clearInterval(waitForGoldStash);

            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");

            var basecode = localStorage.RecordedBase3;

            basecode = new Function(basecode);

            return basecode();
        };
    }, 275);
};

window.DeleteRecordedbase3 = function() {
    game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");

        localStorage.RecordedBase3 = null;
    });
};

window.buildSavedBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            clearInterval(waitForGoldStash);

            var basecode = document.getElementsByClassName("30i3")[0].value;

            basecode = new Function(basecode);

            return basecode();
        };
    }, 275);
};

window.saveBase = () => {
    game.ui.components.PopupOverlay.showHint("Successfully saved!");

    let buildings = game.ui.buildings;

    let base = "";

    let stash = GetGoldStash();

    if (stash == undefined) return;

    let stashPosition = {
        x: stash.x,
        y: stash.y
    };

    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) continue;

        let obj = buildings[uid];

        let x = game.ui.buildings[obj.uid].x - stashPosition.x;

        let y = game.ui.buildings[obj.uid].y - stashPosition.y;

        let building = game.ui.buildings[obj.uid].type;

        let yaw = 270;

        base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");";
    };

    document.getElementsByClassName("30i3")[0].value = base;
};

window.autobuildtoggle = () => {
    autobuild = !autobuild;

    document.getElementsByClassName("21i3")[0].innerText = "Enable Auto Build Saved Towers!";

    if (autobuild) {
        document.getElementsByClassName("21i3")[0].classList.replace('btn-blue', 'btn-red');
        document.getElementsByClassName("21i3")[0].innerText = "Disable Auto Build Saved Towers!";
    };
};

window.upgradealltoggle = () => {
    upgradeAll2 = !upgradeAll2;

    document.getElementsByClassName("26i3")[0].innerText = "Enable Upgrade All!";

    if (upgradeAll2) {
        document.getElementsByClassName("26i3")[0].classList.replace('btn-blue', 'btn-red');
        document.getElementsByClassName("26i3")[0].innerText = "Disable Upgrade All!";
    }
}

function GetGoldStash() {
    for (let i in game.ui.buildings) {
        if (game.ui.buildings[i].type == "GoldStash") {
            return game.ui.buildings[i];
        }
    }
}
window.PlaceBuilding = function(x, y, building, yaw) {
    game.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}

function counter(e = 0) {
    if (e <= -0.99949999999999999e24) {
        return Math.round(e / -1e23) / -10 + "TT";
    }
    if (e <= -0.99949999999999999e21) {
        return Math.round(e / -1e20) / -10 + "TB";
    }
    if (e <= -0.99949999999999999e18) {
        return Math.round(e / -1e17) / -10 + "TM";
    }
    if (e <= -0.99949999999999999e15) {
        return Math.round(e / -1e14) / -10 + "TK";
    }
    if (e <= -0.99949999999999999e12) {
        return Math.round(e / -1e11) / -10 + "T";
    }
    if (e <= -0.99949999999999999e9) {
        return Math.round(e / -1e8) / -10 + "B";
    }
    if (e <= -0.99949999999999999e6) {
        return Math.round(e / -1e5) / -10 + "M";
    }
    if (e <= -0.99949999999999999e3) {
        return Math.round(e / -1e2) / -10 + "K";
    }
    if (e <= 0.99949999999999999e3) {
        return Math.round(e) + "";
    }
    if (e <= 0.99949999999999999e6) {
        return Math.round(e / 1e2) / 10 + "K";
    }
    if (e <= 0.99949999999999999e9) {
        return Math.round(e / 1e5) / 10 + "M";
    }
    if (e <= 0.99949999999999999e12) {
        return Math.round(e / 1e8) / 10 + "B";
    }
    if (e <= 0.99949999999999999e15) {
        return Math.round(e / 1e11) / 10 + "T";
    }
    if (e <= 0.99949999999999999e18) {
        return Math.round(e / 1e14) / 10 + "TK";
    }
    if (e <= 0.99949999999999999e21) {
        return Math.round(e / 1e17) / 10 + "TM";
    }
    if (e <= 0.99949999999999999e24) {
        return Math.round(e / 1e20) / 10 + "TB";
    }
    if (e <= 0.99949999999999999e27) {
        return Math.round(e / 1e+23) / 10 + "TT";
    }
    if (e >= 0.99949999999999999e27) {
        return Math.round(e / 1e+23) / 10 + "TT";
    }
}

function healPlayer() {
    if (!game.ui.components.PlacementOverlay.buildingId && !game.ui.components.BuildingOverlay.buildingId) {
        game.network.sendRpc({
            "name": "EquipItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
        game.network.sendRpc({
            "name": "BuyItem",
            "itemName": "HealthPotion",
            "tier": 1
        });
    };
};

// AITO;

window.sendAitoAlt = () => {
    if (window.startaito) {
        let iframe = document.createElement('iframe');
        iframe.src = 'https://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);

        let iframeWindow = iframe.contentWindow;

        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;

            let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);

            ws.binaryType = "arraybuffer";
            ws.onclose = () => {
                ws.isclosed = true;
            }

            ws.onPreEnterWorld = (data) => {
                let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);
                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };
                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };
                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(ws.network.codec.encode(e, t));
                    }
                };
                ws.network.sendPacket(4, {
                    displayName: game.options.nickname,
                    extra: decoded.extra
                });
            };

            ws.onEnterWorld = () => {
                ws.send(iframeWindow.game.network.codec.encode(6, {}));
                iframe.remove();
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;
                    ws.network = new game.networkType();
                    let data = game.network.codec.decode(msg.data);
                    ws.onPreEnterWorld(data);

                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                if (ws.data.uid) {
                    ws.uid = ws.data.uid;
                };

                if (ws.data.name) {
                    ws.dataType = ws.data;
                };

                if (!window.startaito && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                };

                if (ws.verified) {
                    if (!ws.isDay && !ws.isclosed) {
                        ws.isclosed = true;
                        ws.close();

                        window.sendAitoAlt();
                    };
                };

                if (ws.data.name == "DayCycle") {
                    ws.isDay = ws.data.response.isDay;

                    if (ws.isDay) {
                        ws.verified = true;
                    };
                };

                if (ws.data.name == "Dead") {
                    ws.network.sendRpc({
                        respawn: 1
                    });

                };

                if (ws.data.name == "Leaderboard") {
                    ws.lb = ws.data;

                    if (ws.psk) {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey()
                        });

                        if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Pause",
                                tier: 1
                            });
                        };
                    };
                };

                if (ws.data.name == "PartyShareKey") {
                    ws.psk = ws.data;
                };

                switch (ws.data.opcode) {
                    case 4:
                        ws.onEnterWorld(ws.data);
                        break;
                };
            };
        });
    };
};

// Player Finder

window.sendAitoAlt2 = () => {
    if (window.startaito2) {
        let iframe = document.createElement('iframe');
        iframe.src = 'https://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);

        let iframeWindow = iframe.contentWindow;

        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;

            let ver = false;
            let player = game.ui.components.Leaderboard.leaderboardData[document.getElementsByClassName("16i2")[0].value - 1].name;

            let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);

            ws.binaryType = "arraybuffer";

            ws.onclose = () => {
                ws.isclosed = true;
            };
            ws.onPreEnterWorld = (data) => {
                let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);

                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };

                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };

                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(ws.network.codec.encode(e, t));
                    };
                };

                ws.network.sendPacket(4, {
                    displayName: 'ø',
                    extra: decoded.extra
                });;
            };

            ws.onEnterWorld = (data) => {
                ws.send(iframeWindow.game.network.codec.encode(6, {}));
                iframe.remove();
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    ws.network = new game.networkType();

                    let data = game.network.codec.decode(msg.data);

                    ws.onPreEnterWorld(data);

                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                if (ws.data.uid) {
                    ws.uid = ws.data.uid;
                };

                ws.network.sendInput({
                    up: 1
                });

                if (ws.data.entities) {
                    for (let i in ws.data.entities) {
                        if (ws.data.entities[i].name == player) {
                            window.startaito2 = false;
                            window.playerX = Math.round(ws.data.entities[i].position.x);
                            window.playerY = Math.round(ws.data.entities[i].position.y);
                            document.getElementsByClassName("16i2")[0].value = "(" + window.playerX + ", " + window.playerY + ")";
                            document.getElementsByClassName("18i2")[0].innerText = "Activate Player Finder";
                            game.ui.components.PopupOverlay.showHint(`Successfully found the player, { x: ${window.playerX}, y: ${window.playerY} };`);

                            let xPos = Math.round(window.playerX / game.world.getHeight() * 100);
                            let yPos = Math.round(window.playerY / game.world.getWidth() * 100);

                            let player = document.createElement('div');
                            player.classList.add('hud-map-player');
                            player.classList.add('scanned-player');
                            player.style.left = xPos + '%';
                            player.style.top = yPos + '%';

                            document.getElementsByClassName('hud-map')[0].appendChild(player);
                        };

                        if (ws.data.entities[i].name) {
                            ver = true;
                        };
                    };
                };

                if (ws.data.name == "DayCycle") {
                    ws.isDay = ws.data.response.isDay;
                };

                if (ws.data.name == "Dead") {
                    ws.network.sendRpc({
                        respawn: 1
                    });
                };

                if (ver && !ws.isclosed) {
                    ws.isclosed = true;
                    setTimeout(() => {
                        ws.close();
                        window.sendAitoAlt2();
                    }, 15000);
                }

                if (ws.data.name == "PartyShareKey") {
                    ws.psk = ws.data;
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.playerPartyShareKey
                    });
                };

                switch (ws.data.opcode) {
                    case 4:
                        ws.onEnterWorld(ws.data);
                        break;
                };
            };
        });
    };
};

// Base Finder

window.baseFinder = () => {
    if (window.basefind) {
        let iframe = document.createElement('iframe');
        iframe.src = 'https://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);

        let iframeWindow = iframe.contentWindow;

        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;

            let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);
            ws.binaryType = "arraybuffer";
            let finder = setInterval(() => {
                setTimeout(() => {
                    ws.close();

                    window.baseFinder();
                }, 30000);

                ws.close();
            }, 30000);

            ws.onclose = () => {
                ws.isclosed = true;
            };

            ws.onPreEnterWorld = (data) => {
                let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);

                ws.network.sendInput = (t) => {
                    ws.network.sendPacket(3, t);
                };

                ws.network.sendRpc = (t) => {
                    ws.network.sendPacket(9, t);
                };

                ws.network.sendPacket = (e, t) => {
                    if (!ws.isclosed) {
                        ws.send(ws.network.codec.encode(e, t));
                    };
                };

                ws.network.sendPacket(4, {
                    displayName: 'ø',
                    extra: decoded.extra
                });;
            };

            ws.onEnterWorld = (data) => {
                ws.send(iframeWindow.game.network.codec.encode(6, {}));

                iframe.remove();
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5) {
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    ws.network = new game.networkType();

                    let data = game.network.codec.decode(msg.data);

                    ws.onPreEnterWorld(data);

                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);

                if (ws.data.uid) {
                    ws.uid = ws.data.uid;
                };

                ws.network.sendInput({
                    up: 1
                });

                if (ws.data.name == "DayCycle") {
                    ws.isDay = ws.data.response.isDay;
                };

                if (ws.data.name == "Dead") {
                    ws.network.sendInput({
                        respawn: 1
                    });
                };

                if (ws.data.name == "PartyShareKey") {
                    ws.psk = ws.data;
                };

                ws.onTowerFound = data => {
                    let res = JSON.stringify(data);
                    let res2 = JSON.parse(res);

                    let Schema = Object.keys(game.ui.buildingSchema).filter(building => building !== 'Harvester');

                    for (let i in Schema) {
                        for (let entity in ws.data.entities) {
                            if (res.includes(Schema[i])) {
                                for (let e in res2.entities) {
                                    let xPos = Math.round(res2.entities[e].position.x / game.world.getHeight() * 100);
                                    let yPos = Math.round(res2.entities[e].position.y / game.world.getWidth() * 100);

                                    let building = document.createElement('div');
                                    building.classList.add('hud-map-building');
                                    building.classList.add('scanned-building');
                                    building.style.left = xPos + '%';
                                    building.style.top = yPos + '%';

                                    document.getElementsByClassName('hud-map')[0].appendChild(building);

                                    ws.close();
                                };
                            };
                        };
                    };
                };

                switch (ws.data.opcode) {
                    case 4:
                        ws.onEnterWorld();

                        ws.network.sendPacket(9, {
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey()
                        });

                        break;
                    case 0:
                        ws.onTowerFound(ws.data);

                        break;
                };
            };
        });
    };
};

window.allSockets = [];

window.sendws = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let mousePosition3;
        let isOnControl = false;
        let isTrue = true;
        let altElem = document.createElement('div');

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:${connectionOptions.port}`);

        if (!window.allSockets[window.allSockets.length]) {
            ws.cloneId = window.allSockets.length + 1;
            window.allSockets[window.allSockets.length] = ws;
        };

        ws.binaryType = "arraybuffer";
        ws.aimingYaw = 1;

        ws.onclose = () => {
            ws.isclosed = true;

            altElem.remove();
        };

        ws.onPreEnterWorld = (data) => {
            let decoded = iframeWindow.game.network.codec.decodePreEnterWorldResponse(data);

            ws.network.sendInput = (t) => {
                ws.network.sendPacket(3, t);
            };

            ws.network.sendRpc = (t) => {
                ws.network.sendPacket(9, t);
            };

            ws.network.sendPacket = (e, t) => {
                if (!ws.isclosed) {
                    ws.send(ws.network.codec.encode(e, t));
                }
            };

            ws.network.sendPacket(4, {
                displayName: game.options.nickname,
                extra: decoded.extra
            });
        };

        ws.onmessage = msg => {
            if (new Uint8Array(msg.data)[0] == 5) {
                ws.network = new game.networkType();
                game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                let data = game.network.codec.decode(msg.data);
                ws.onPreEnterWorld(data);
                return;
            };

            ws.data = ws.network.codec.decode(msg.data);

            if (isTrue) {
                isTrue = !isTrue;

                var timeCheck = setTimeout(function() {
                    if (ws.cloneId === 0) {
                        ws.close();
                    }
                }, 3000);

                ws.network.sendInput({
                    up: 1
                });
                ws.mouseUp = 1;
                ws.mouseDown = 0;
                ws.f = false;

                function mouseMoved(e, x, y, d) {
                    ws.aimingYaw = e;

                    if (ws.mouseDown && !ws.mouseUp) {
                        ws.network.sendInput({
                            mouseMovedWhileDown: e,
                            worldX: x,
                            worldY: y,
                            distance: d
                        });
                    };

                    if (!ws.mouseDown && ws.mouseUp) {
                        ws.network.sendInput({
                            mouseMoved: e,
                            worldX: x,
                            worldY: y,
                            distance: d
                        });
                    };
                };

                document.addEventListener('mousemove', mousemove => {
                    if (isOnControl) {
                        if (!ws.isclosed) {
                            mousePosition3 = game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY);

                            if (ws.myPlayer) {
                                if (ws.myPlayer.position) {
                                    mouseMoved(
                                        game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100),
                                        Math.floor(mousePosition3.x),
                                        Math.floor(mousePosition3.y),
                                        Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100) / 100)
                                    );
                                };
                            };
                        };
                    };
                });

                let SendRpc = ws.network.sendRpc;
                let SendInput = ws.network.sendInput;

                document.addEventListener('keydown', e => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            let KeyCode = e.keyCode;

                            if(e.key === '.') {
                                console.log(ws.inventory);
                                ws.network.sendRpc({ name: 'BuyItem', itemName: 'Spear', tier: ws.inventory.Spear ? (ws.inventory.Spear.tier + 1) : 1});
                            }
                            if (KeyCode == 81 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                setTimeout(() => {
                                    var nextWeapon = 'Pickaxe';

                                    var weaponOrder = ['Pickaxe', 'Spear', 'Bow', 'Bomb'];

                                    var foundCurrent = false;

                                    for (let i in weaponOrder) {
                                        if (foundCurrent) {
                                            if (ws.inventory[weaponOrder[i]]) {
                                                nextWeapon = weaponOrder[i];
                                                break;
                                            };
                                        } else if (weaponOrder[i] == ws.myPlayer.weaponName) {
                                            foundCurrent = true;
                                        };
                                    };

                                    ws.network.sendRpc({
                                        name: 'EquipItem',
                                        itemName: nextWeapon,
                                        tier: ws.inventory[nextWeapon].tier
                                    });
                                }, 100);
                            };

                            if (KeyCode == 72 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                ws.network.sendRpc({
                                    name: 'LeaveParty'
                                });
                            };

                            if (KeyCode == 74 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                ws.network.sendRpc({
                                    name: 'JoinPartyByShareKey',
                                    partyShareKey: game.ui.playerPartyShareKey
                                });
                            };

                            if (KeyCode == 32 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                setTimeout(() => {
                                    ws.network.sendInput({
                                        space: 0
                                    });

                                    ws.network.sendInput({
                                        space: 1
                                    });
                                }, 100);
                            };

                            if (KeyCode == 82) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    for (let i in game.ui.buildings) {
                                        if (game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier) {
                                            ws.network.sendRpc({
                                                name: "UpgradeBuilding",
                                                uid: game.ui.buildings[i].uid
                                            });
                                        };
                                    };
                                };
                            };

                            if (KeyCode == 46) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (ws.myPet) {
                                        ws.network.sendInput({
                                            name: "DeleteBuilding",
                                            uid: ws.myPet.uid
                                        });
                                    };
                                };
                            };

                            if (KeyCode == 82) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingUid) {
                                        ws.network.sendRpc({
                                            name: "UpgradeBuilding",
                                            uid: game.ui.components.BuildingOverlay.buildingUid
                                        });
                                    };
                                };
                            };

                            if (KeyCode == 89) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    for (let i in game.ui.buildings) {
                                        if (game.ui.components.BuildingOverlay.buildingUid && game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier && game.ui.components.BuildingOverlay.buildingId !== "GoldStash") {
                                            ws.network.sendRpc({
                                                name: "DeleteBuilding",
                                                uid: game.ui.buildings[i].uid
                                            });
                                        };
                                    };
                                };
                            };

                            if (KeyCode == 84) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    for (var i in game.ui.buildings) {
                                        if (game.ui.components.BuildingOverlay.buildingUid && game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier && game.ui.components.BuildingOverlay.buildingId !== "GoldStash") {
                                            game.network.sendRpc({
                                                name: "DeleteBuilding",
                                                uid: game.ui.buildings[i].uid
                                            });
                                        };
                                    };
                                };
                            };

                            if (KeyCode == 89) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingId !== "GoldStash" && game.ui.components.BuildingOverlay.buildingUid) {
                                        ws.network.sendRpc({
                                            name: "DeleteBuilding",
                                            uid: game.ui.components.BuildingOverlay.buildingUid
                                        });
                                    };
                                };
                            };

                            if (KeyCode == 89) {
                                if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                    if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingId !== "GoldStash" && game.ui.components.BuildingOverlay.buildingUid) {
                                        ws.network.sendRpc({
                                            name: "DeleteBuilding",
                                            uid: game.ui.components.BuildingOverlay.buildingUid
                                        });
                                    };
                                };
                            };

                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!ws.automove) {
                                    if (KeyCode == 76) {
                                        ws.network.sendInput({
                                            up: 1,
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 191) {
                                        ws.network.sendInput({
                                            right: 1,
                                            left: 0
                                        });
                                    };

                                    if (KeyCode == 190) {
                                        ws.network.sendInput({
                                            down: 1,
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 188) {
                                        ws.network.sendInput({
                                            left: 1,
                                            right: 0
                                        });
                                    };

                                    if (KeyCode == 87) {
                                        ws.network.sendInput({
                                            up: 1,
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 68) {
                                        ws.network.sendInput({
                                            right: 1,
                                            left: 0
                                        });
                                    };

                                    if (KeyCode == 83) {
                                        ws.network.sendInput({
                                            down: 1,
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 65) {
                                        ws.network.sendInput({
                                            left: 1,
                                            right: 0
                                        });
                                    };
                                };

                                if (KeyCode == 82) {
                                    ws.network.sendRpc({
                                        name: "BuyItem",
                                        itemName: "HealthPotion",
                                        tier: 1
                                    });

                                    ws.network.sendRpc({
                                        name: "EquipItem",
                                        itemName: "HealthPotion",
                                        tier: 1
                                    });
                                };

                                if (KeyCode == 78) {
                                    ws.network.sendRpc({
                                        "name": "EquipItem",
                                        "itemName": "PetCARL",
                                        "tier": ws.inventory.PetCARL.tier
                                    });

                                    ws.network.sendRpc({
                                        "name": "EquipItem",
                                        "itemName": "PetMiner",
                                        "tier": ws.inventory.PetMiner.tier
                                    });
                                };

                                if (KeyCode == 77) {
                                    ws.network.sendRpc({
                                        "name": "BuyItem",
                                        "itemName": "PetRevive",
                                        "tier": 1
                                    });

                                    ws.network.sendRpc({
                                        "name": "EquipItem",
                                        "itemName": "PetRevive",
                                        "tier": 1
                                    });

                                    ws.network.sendRpc({
                                        "name": "BuyItem",
                                        "itemName": "PetCARL",
                                        "tier": ws.inventory.PetCARL.tier + 1
                                    });

                                    ws.network.sendRpc({
                                        "name": "BuyItem",
                                        "itemName": "PetMiner",
                                        "tier": ws.inventory.PetMiner.tier + 1
                                    });
                                };

                                if (KeyCode == 221) {
                                    game.network.sendRpc({
                                        name: "JoinPartyByShareKey",
                                        partyShareKey: ws.psk.response.partyShareKey
                                    });
                                };
                            };
                        };
                    };
                });

                document.addEventListener('keyup', e => {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            let KeyCode = e.keyCode;

                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!ws.automove) {
                                    if (KeyCode == 76) {
                                        ws.network.sendInput({
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 191) {
                                        ws.network.sendInput({
                                            right: 0
                                        });
                                    };

                                    if (KeyCode == 190) {
                                        ws.network.sendInput({
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 188) {
                                        ws.network.sendInput({
                                            left: 0
                                        });
                                    };

                                    if (KeyCode == 87) {
                                        ws.network.sendInput({
                                            up: 0
                                        });
                                    };

                                    if (KeyCode == 68) {
                                        ws.network.sendInput({
                                            right: 0
                                        });
                                    };

                                    if (KeyCode == 83) {
                                        ws.network.sendInput({
                                            down: 0
                                        });
                                    };

                                    if (KeyCode == 65) {
                                        ws.network.sendInput({
                                            left: 0
                                        });
                                    };
                                };
                            };
                        };
                    };
                });

                document.getElementsByClassName("hud")[0].addEventListener("mousedown", function(e) {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (!e.button) {
                                ws.mouseDown = 1;
                                ws.mouseUp = 0;

                                ws.network.sendInput({
                                    mouseDown: ws.aimingYaw,
                                    worldX: Math.floor(mousePosition3.x),
                                    worldY: Math.floor(mousePosition3.y),
                                    distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100) / 100)
                                });
                            };
                        };
                    };
                });

                document.getElementsByClassName("hud")[0].addEventListener("mouseup", function(e) {
                    if (!ws.isclosed) {
                        if (isOnControl) {
                            if (!e.button) {
                                ws.mouseUp = 1;
                                ws.mouseDown = 0;
                                ws.network.sendInput({
                                    mouseUp: 1,
                                    worldX: Math.floor(mousePosition3.x),
                                    worldY: Math.floor(mousePosition3.y),
                                    distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x) * 100, (-ws.myPlayer.position.y + mousePosition3.y) * 100) / 100)
                                });
                            };
                        };
                    };
                });

                if (isOnControl) {
                    let t1 = 0;

                    document.getElementsByClassName("hud-shop-item")[t1 + 0].addEventListener('click', function() {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pickaxe",
                            tier: ws.inventory.Pickaxe.tier + 1
                        });
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 1].addEventListener('click', function() {
                        if (!ws.inventory.Bow) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: 1
                            });
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier + 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 2].addEventListener('click', function() {
                        if (!ws.inventory.Bow) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: 1
                            });
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier + 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 3].addEventListener('click', function() {
                        if (!ws.inventory.Bomb) {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bomb",
                                tier: 1
                            });
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bomb",
                                tier: ws.inventory.Bomb.tier + 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-shop-item")[t1 + 4].addEventListener('click', function() {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "ZombieShield",
                            tier: ws.inventory.ZombieShield ? (ws.inventory.ZombieShield.tier + 1) : 1
                        });
                    });

                    document.getElementsByClassName("hud-respawn-btn")[0].addEventListener('click', function() {
                        ws.network.sendRpc({
                            respawn: 1
                        });
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 0].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Pickaxe",
                                tier: ws.inventory.Pickaxe.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 1].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 2].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 3].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bomb",
                                tier: ws.inventory.Bomb.tier
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 4].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "HealthPotion",
                                tier: 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 5].addEventListener('mouseup', function(e) {
                        if (!e.button) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "PetHealthPotion",
                                tier: 1
                            });
                        };
                    });

                    document.getElementsByClassName("hud-toolbar-item")[t1 + 6].addEventListener("mouseup", function(e) {
                        if (!e.button) {
                            if (isOnControl) {
                                ws.network.sendRpc({
                                    name: "RecallPet"
                                });
                                ws.network.sendInput({
                                    respawn: 1
                                });
                                ws.automove = !ws.automove;
                                if (ws.automove) {
                                    window.move = true;
                                } else {
                                    window.move = false;
                                };
                            };
                        };
                    });
                };

                ws.respawn = true;

                document.getElementsByClassName("10i")[0].addEventListener('click', () => {
                    ws.activebow = !ws.activebow;
                    ws.playerWeapon = ws.myPlayer.weaponName;

                    if (ws.activebow) {
                        if (ws.inventory.Bow) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: ws.inventory.Bow.tier
                            })
                        } else {
                            ws.network.sendRpc({
                                name: "BuyItem",
                                itemName: "Bow",
                                tier: 1
                            })
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "Bow",
                                tier: 1
                            });
                        };
                    } else {
                        ws.network.sendRpc({
                            name: "EquipItem",
                            itemName: ws.playerWeapon,
                            tier: ws.inventory[ws.playerWeapon].tier
                        });
                    };
                });

                if (window.aim) {
                    ws.autoaim = true;
                };

                if (window.move) {
                    ws.automove = true;
                };

                if (window.autohiBot) {
                    ws.autohi = true;
                };

                document.getElementsByClassName("1i2")[0].addEventListener('click', () => {
                    ws.autoaim = !ws.autoaim;

                    if (ws.autoaim) {
                        window.aim = true;

                        document.getElementsByClassName("1i2")[0].innerText = "Disable Aim!";
                    } else {
                        window.aim = false;

                        document.getElementsByClassName("1i2")[0].innerText = "Enable Aim!";
                    };
                });

                document.getElementsByClassName("2i2")[0].addEventListener('click', () => {
                    ws.automove = !ws.automove;

                    if (ws.automove) {
                        window.move = true;
                    } else {
                        window.move = false;
                    };
                });

                document.getElementsByClassName("7i2")[0].addEventListener('click', () => {
                    ws.close();

                    altElem.remove();
                });

                document.getElementsByClassName("8i2")[0].addEventListener('click', () => {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.players[ws.uid].name}, W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`
                    });
                });

                document.getElementsByClassName("21i2")[0].addEventListener('click', () => {
                    isOnControl = !isOnControl;

                    document.getElementsByClassName("21i2")[0].innerText = isOnControl ? 'Uncontrol Alts!' : 'Control Alts!';
                });

                document.getElementsByClassName("30i2")[0].addEventListener('click', () => {
                    window.lock = !window.lock;

                    if (window.lock) {
                        window.count = 0;
                        delete window.lockPos;

                        document.getElementsByClassName("30i2")[0].innerText = 'Unlock Pos!';
                    } else if (!window.lock) {
                        document.getElementsByClassName("30i2")[0].innerText = 'Lock Pos!';

                        ws.network.sendInput({
                            up: 0,
                            right: 0,
                            left: 0,
                            right: 0
                        });
                    };
                });
            };

            if (window.testing) {
                ws.network.sendRpc({
                    name: "SetOpenParty",
                    isOpen: 0
                });

                ws.network.sendRpc({
                    name: "SetPartyName",
                    partyName: ws.cloneId + ''
                });
            };

            if (ws.data.uid) {
                ws.uid = ws.data.uid;
                ws.dataInfo = ws.data;
                ws.players = {};
                ws.inventory = {};
                ws.buildings = {};
                ws.parties = {};
                ws.lb = {};
                ws.playerUid = game.world.myUid;

                if (window.allSockets[ws.cloneId - 1]) {
                    window.allSockets[ws.cloneId - 1] = ws;
                };

                ws.network.sendInput({
                    space: 1
                });

                ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "PetCARL",
                    tier: 1
                });

                ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "PetMiner",
                    tier: 1
                });
            };

            if (ws.data.entities) {
                if (window.message == ws.cloneId) {
                    game.world.replicator.onEntityUpdate(ws.data);
                };

                if (ws.data.entities[ws.uid].name) {
                    ws.myPlayer = ws.data.entities[ws.uid];
                };

                for (let g in ws.myPlayer) {
                    if (ws.myPlayer[g] !== ws.data.entities[ws.uid][g] && ws.data.entities[ws.uid][g] !== undefined) {
                        ws.myPlayer[g] = ws.data.entities[ws.uid][g];
                    };
                };

                if (ws.myPlayer.petUid) {
                    if (ws.data.entities[ws.myPlayer.petUid]) {
                        if (ws.data.entities[ws.myPlayer.petUid].model) {
                            ws.myPet = ws.data.entities[ws.myPlayer.petUid];
                            ws.shouldHealPet = false;
                        };
                    };
                    for (let g in ws.myPet) {
                        if (ws.data.entities[ws.myPlayer.petUid]) {
                            if (ws.myPet[g] !== ws.data.entities[ws.myPlayer.petUid][g] && ws.data.entities[ws.myPlayer.petUid][g] !== undefined) {
                                ws.myPet[g] = ws.data.entities[ws.myPlayer.petUid][g]
                            };
                        };
                    };
                };

                for (let i in ws.data.entities) {
                    if (ws.data.entities[i].name) {
                        ws.players[i] = ws.data.entities[i];
                    };
                };

                for (let i in ws.players) {
                    if (!ws.data.entities[i]) {
                        delete ws.players[i];
                    };

                    for (let g in ws.players[i]) {
                        if (ws.players[i][g] !== ws.data.entities[i][g] && ws.data.entities[i][g] !== undefined) {
                            ws.players[i][g] = ws.data.entities[i][g];
                        };
                    };

                    ws.playerTick = ws.players[ws.playerUid];
                };

                altElem.style.left = (Math.round(ws.myPlayer.position.x) / game.world.getHeight() * 100) + '%';
                altElem.style.top = (Math.round(ws.myPlayer.position.y) / game.world.getWidth() * 100) + '%';
            };

            if (ws.data.name == "DayCycle") {
                ws.tickData = ws.data.response;
                ws.isDay = ws.data.response.isDay;
            };

            if (ws.data.tick) {
                var currentTick = ws.data.tick;
                var msPerTick = 50;
                var dayRatio = 0;
                var nightRatio = 0;
                var barWidth = 130;

                if (ws.tickData) {
                    if (ws.tickData.dayEndTick) {
                        if (ws.tickData.dayEndTick > 0) {
                            var dayLength = ws.tickData.dayEndTick - ws.tickData.cycleStartTick;
                            var dayTicksRemaining = ws.tickData.dayEndTick - currentTick;

                            dayRatio = 1 - dayTicksRemaining / dayLength;
                        }
                    } else if (ws.tickData.nightEndTick > 0) {
                        var nightLength = ws.tickData.nightEndTick - ws.tickData.cycleStartTick;
                        var nightTicksRemaining = ws.tickData.nightEndTick - currentTick;

                        dayRatio = 1;
                        nightRatio = 1 - nightTicksRemaining / nightLength;
                    };

                    var currentPosition = (dayRatio * 1 / 2 + nightRatio * 1 / 2) * -barWidth;
                    var offsetPosition = currentPosition + barWidth / 2;

                    if (offsetPosition) {
                        ws.dayTicker = Math.round(offsetPosition);
                    };
                };
            };

            if (ws.data.name == "PartyInfo") {
                ws.partyInfo = ws.data.response;
                setTimeout(() => {
                    for (let i in ws.partyInfo) {
                        if (ws.partyInfo[i].playerUid == ws.uid && ws.partyInfo[i].isLeader) {
                            ws.network.sendRpc({
                                name: "SetPartyMemberCanSell",
                                uid: game.world.myUid,
                                canSell: 1
                            });
                            ws.network.sendRpc({
                                name: "SetOpenParty",
                                isOpen: 1
                            });
                            setTimeout(() => {
                                ws.network.sendRpc({
                                    name: "SetPartyName",
                                    partyName: ws.cloneId + ''
                                });
                            }, 1000);
                        };
                    };
                }, 1750);
            };

            if (ws.data.name == "SetItem") {
                ws.inventory[ws.data.response.itemName] = ws.data.response;

                if (!ws.inventory[ws.data.response.itemName].stacks) {
                    delete ws.inventory[ws.data.response.itemName];
                };

                if (ws.data.response.itemName == "ZombieShield" && ws.data.response.stacks) {
                    ws.network.sendRpc({
                        name: "EquipItem",
                        itemName: "ZombieShield",
                        tier: data.response.tier
                    });
                };
            };

            if (ws.data.name == "PartyApplicant") {
                ws.partyApplicant = ws.data.response;
                if (ws.partyApplicant.applicantUid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "PartyApplicantDecide",
                        applicantUid: game.world.myUid,
                        accepted: 1
                    });
                };
            };

            if ((game.world.entities[ws.uid] && game.world.getEntityByUid(ws.uid))) {
                for (let socket in window.allSockets) {
                    let wss = window.allSockets[socket];

                    if (wss) {
                        let {
                            uid,
                            cloneId
                        } = wss;

                        if (((game.world.entities[uid] && game.world.getEntityByUid(uid))) && (game.world.getEntityByUid(uid)).targetTick)
                            (game.world.getEntityByUid(uid)).targetTick.name = (cloneId).toString();
                    };
                };
            };

            if (ws.data.name == "ReceiveChatMessage") {
                ws.message = ws.data;

                if (ws.message.response.message == "!move" && ws.message.response.uid == game.world.myUid) {
                    ws.mousemove = true;
                };

                if (ws.message.response.message == "!unmove" && ws.message.response.uid == game.world.myUid) {
                    ws.mousemove = false;
                };

                if (ws.message.response.message == `#` && ws.message.response.uid == game.world.myUid) {
                    let word = ws.message.response.message;
                    let uid = '';

                    for (let i = 0; i < 30; i++) {
                        if (Math.round(word[i] == 0 || word[i] == 1 || word[i] == 2 || word[i] == 3 || word[i] == 4 || word[i] == 5 || word[i] == 6 || word[i] == 7 || word[i] == 8 || word[i] == 9)) {
                            uid += word[i]
                        };

                        uid = Math.round(uid);
                        ws.playerUid = uid;
                    };
                };

                if (ws.message.response.message == "!aim" && ws.message.response.uid == game.world.myUid) {
                    window.move = true;
                };

                if (ws.message.response.message == "!unaim" && ws.message.response.uid == game.world.myUid) {
                    window.move = false;
                };

                if (ws.message.response.message == "!c" && ws.message.response.uid == game.world.myUid) {
                    isOnControl = true;
                };

                if (ws.message.response.message == `!c ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    isOnControl = true;
                };

                if (ws.message.response.message == "!!c" && ws.message.response.uid == game.world.myUid) {
                    isOnControl = false;
                };

                if (ws.message.response.message == `!!c ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    isOnControl = false;
                };

                if (ws.message.response.message == `!psk ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.cloneId}: ${ws.psk.response.partyShareKey}`
                    });
                };

                if (ws.message.response.message == "!stats") {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.players[ws.message.response.uid].name}, W: ${counter(ws.players[ws.message.response.uid].wood)}, S: ${counter(ws.players[ws.message.response.uid].stone)}, G: ${counter(ws.players[ws.message.response.uid].gold)}, T: ${Math.floor(ws.players[ws.message.response.uid].token)};`
                    });
                };

                if (ws.message.response.message == "!s" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `${ws.players[ws.uid].name}, W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`
                    });
                };

                if (ws.message.response.message == "!h" && ws.message.response.uid == game.world.myUid) {
                    ws.autohi = !ws.autohi;

                    if (ws.autohi) {
                        window.autohiBot = true;
                    } else {
                        window.autohiBot = false;
                    };
                };

                if (ws.message.response.message == "!ahrc" && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = true;
                };

                if (ws.message.response.message == `!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = true;
                };

                if (ws.message.response.message == "!!ahrc" && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = false;
                };

                if (ws.message.response.message == `!!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.ahrc = false;
                };

                if (ws.message.response.message == "!space" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        space: 0
                    })
                    ws.network.sendInput({
                        space: 1
                    });
                };

                if (ws.message.response.message == `${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        space: 0
                    })
                    ws.network.sendInput({
                        space: 1
                    });

                    ws.network.sendRpc({
                        name: 'JoinPartyByShareKey',
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });
                };

                if (ws.message.response.message == `!dc` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendPacket({}, {});
                };

                if (ws.message.response.message == `!dc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendPacket({}, {});
                };

                if (ws.message.response.message == "!upgrade" && ws.message.response.uid == game.world.myUid) {
                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "GoldMine") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            })
                        }
                        setTimeout(() => {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            })
                        }, 100);
                    };
                };

                if (ws.message.response.message == "!autobomb" && ws.message.response.uid == game.world.myUid) {
                    ws.raid = true;
                };

                if (ws.message.response.message == "!!autobomb" && ws.message.response.uid == game.world.myUid) {
                    ws.raid = false;
                };

                if (ws.message.response.message == `!respawn` && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = true;
                };

                if (ws.message.response.message == `!respawn ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = true;
                };

                if (ws.message.response.message == "!!respawn" && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = false;
                };

                if (ws.message.response.message == `!!respawn ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.respawn = false;
                };

                if (ws.message.response.message == `!join ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                    });
                };

                if (ws.message.response.message.startsWith(`!joinPsk ${ws.cloneId}`) && ws.message.response.uid == game.world.myUid) {
                    let args = ws.message.response.message.split(' ');

                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: args[2]
                    });
                };

                if (ws.message.response.message == `!leave` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "LeaveParty"
                    });
                };

                if (ws.message.response.message == `!leave ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "LeaveParty"
                    });
                };

                if (ws.message.response.message == "!up" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded all!"
                    });

                    for (let i in ws.buildings) {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: ws.buildings[i].uid
                        });
                    };
                };

                if (ws.message.response.message == "!upStash" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded stash!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "GoldStash") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up1" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded wall(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "Wall") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up2" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded door(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "Door") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up3" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded slowtrap(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "SlowTrap") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up4" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded arrow(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "ArrowTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up5" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded cannon(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "CannonTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up6" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded Melee(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "MeeleTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up7" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded bomb(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "BombTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up8" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded mage(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "MagicTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up9" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded gold mine(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "GoldMine") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "!up0" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded harvester(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "ResourceHarvester") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "a" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        left: 1
                    });
                    ws.network.sendInput({
                        right: 0
                    });
                }
                if (ws.message.response.message == "d" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        right: 1
                    });
                    ws.network.sendInput({
                        left: 0
                    });
                }
                if (ws.message.response.message == "w" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        up: 1
                    });
                    ws.network.sendInput({
                        down: 0
                    });
                }
                if (ws.message.response.message == "s" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        down: 1
                    });
                    ws.network.sendInput({
                        up: 0
                    });
                }
                if (ws.message.response.message == "f" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendInput({
                        left: 0
                    });
                    ws.network.sendInput({
                        right: 0
                    });
                    ws.network.sendInput({
                        down: 0
                    });
                    ws.network.sendInput({
                        up: 0
                    });
                }
            }
            if (ws.autohi) {
                if (ws.data.entities) {
                    let sus = setInterval(() => {
                        let msg = "";
                        let msg2 = "";
                        for (let i = 0; i < 15; i++) {
                            msg += `&#${Math.random() * 2500 + 100 | 0};`;
                        }
                        for (let i = 0; i < 15; i++) {
                            msg2 += `&#${Math.random() * 2500 + 100 | 0};`;
                        }
                        ws.network.sendRpc({
                            name: "SendChatMessage",
                            message: `${msg}${msg2}`,
                            channel: "Local"
                        });
                    });
                };
            };

            if (ws.data.name == "Leaderboard") {
                for (let i in ws.data.response) {
                    ws.lb[ws.data.response[i].rank + 1] = ws.data.response[i];
                }
                if (ws.ahrc) {
                    for (let uid in ws.buildings) {
                        let obj = ws.buildings[uid];
                        ws.network.sendRpc({
                            name: "CollectHarvester",
                            uid: obj.uid
                        });
                        if (obj.type == "Harvester" && obj.tier == 1) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 20 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 2) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 30 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 3) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 35 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 4) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 50 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 5) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 60 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 6) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 70 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 7) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 120 / 2
                            });
                        }
                        if (obj.type == "Harvester" && obj.tier == 8) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 150 / 2
                            });
                        }
                    };
                };
            };

            if (ws.respawn) {
                ws.network.sendInput({
                    respawn: 1
                });

                if (ws.raid) {
                    ws.space = true;

                    ws.network.sendRpc({
                        name: 'BuyItem',
                        itemName: 'Bomb',
                        tier: 1
                    });

                    ws.network.sendRpc({
                        name: 'EquipItem',
                        itemName: 'Bomb',
                        tier: 1
                    });
                };
            };

            if (ws.space) {
                ws.network.sendInput({
                    space: 0
                })
                ws.network.sendInput({
                    space: 1
                });
            };

            if (ws.data.name == "LocalBuilding") {
                for (let i in ws.data.response) {
                    ws.buildings[ws.data.response[i].uid] = ws.data.response[i];
                    if (ws.buildings[ws.data.response[i].uid].dead) {
                        delete ws.buildings[ws.data.response[i].uid];
                    };
                };
            };

            if (ws.data.name == "AddParty") {
                if (ws.addparties) {
                    ws.parties[ws.data.response.partyId] = ws.data.response;
                };
            };

            if (ws.data.name == "RemoveParty") {
                if (ws.addparties) {
                    if (ws.parties[ws.data.response.partyId].partyId) {
                        delete ws.parties[ws.data.response.partyId];
                    };
                };
            };

            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;

                altElem.style.display = (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) ? "none" : "block";
            };

            if (window.mousemove) {
                let myPlayer = game.ui.playerTick;
                let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);

                if (ws.myPlayer) {
                    if (ws.myPlayer.position) {
                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100)
                        })

                        if (1 == 1) {
                            if (ws.myPlayer.position.y - mouseToWorld.y > 10) {
                                ws.network.sendInput({
                                    down: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    down: 1
                                });
                            };

                            if (-ws.myPlayer.position.y + mouseToWorld.y > 10) {
                                ws.network.sendInput({
                                    up: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    up: 1
                                });
                            };

                            if (-ws.myPlayer.position.x + mouseToWorld.x > 10) {
                                ws.network.sendInput({
                                    left: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    left: 1
                                });
                            };

                            if (ws.myPlayer.position.x - mouseToWorld.x > 10) {
                                ws.network.sendInput({
                                    right: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    right: 1
                                });
                            };
                        };
                    };
                };
            };

            if (window.autoraid) {
                if (ws.myPlayer) {
                    if (findNearestAltToStash().uid == ws.uid) {
                        if (Object.values(game.ui.buildings).length > 0 && !ws.myPlayer.dead) {
                            ws.network.sendRpc({
                                name: "JoinPartyByShareKey",
                                partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                            });
                        } else {
                            for (let i in window.allSockets) {
                                if (Object.values(window.allSockets[i].buildings).length > 0 && !ws.myPlayer.dead) {
                                    ws.network.sendRpc({
                                        name: "JoinPartyByShareKey",
                                        partyShareKey: window.allSockets[i].psk.response.partyShareKey + ""
                                    });
                                };
                            };
                        };

                        ws.network.sendInput({
                            space: 0
                        });
                        ws.network.sendInput({
                            space: 1
                        });
                    };
                };
            };

            if (ws.data.entities) {
                if (ws.letbotsjoin) {
                    if (ws.myPlayer.gold > 100) {
                        ws.network.sendRpc({
                            name: 'LeaveParty'
                        });
                    } else {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                        });
                    };
                };

                if (ws.letbotsjoin2) {
                    if (ws.myPlayer.gold > 500) {
                        ws.network.sendRpc({
                            name: 'LeaveParty'
                        });
                    } else {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                        });
                    };
                };

                if (ws.letbotsjoin3) {
                    if (ws.myPlayer.gold > 8500) {
                        ws.network.sendRpc({
                            name: 'LeaveParty'
                        });
                    } else {
                        ws.network.sendRpc({
                            name: "JoinPartyByShareKey",
                            partyShareKey: game.ui.getPlayerPartyShareKey() + ""
                        });
                    };
                };
            };

            if (window.lock) {
                addEventListener('mousedown', () => {
                    window.count++;

                    window.count == 1 && (
                        window.lockPos = {
                            x: game.renderer.screenToWorld(Object.freeze(game.ui.mousePosition).x, 0).x,
                            y: game.renderer.screenToWorld(0, Object.freeze(game.ui.mousePosition).y).y
                        }
                    );
                });

                let pos = window.lockPos;

                if (!pos) return;

                if (ws.myPlayer) {
                    ((position) => {
                        let x = Math.round(position.x);
                        let y = Math.round(position.y);

                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + x) * 100, (-ws.myPlayer.position.y + y) * 100)
                        });

                        let myX = Math.round(ws.myPlayer.position.x);
                        let myY = Math.round(ws.myPlayer.position.y);

                        let offset = 6;

                        if (-myX + x > offset) {
                            ws.network.sendInput({
                                left: 0
                            });
                        } else {
                            ws.network.sendInput({
                                left: 1
                            });
                        };

                        if (myX - x > offset) {
                            ws.network.sendInput({
                                right: 0
                            });
                        } else {
                            ws.network.sendInput({
                                right: 1
                            });
                        }

                        if (-myY + y > offset) {
                            ws.network.sendInput({
                                up: 0
                            });
                        } else {
                            ws.network.sendInput({
                                up: 1
                            });
                        };

                        if (myY - y > offset) {
                            ws.network.sendInput({
                                down: 0
                            });
                        } else {
                            ws.network.sendInput({
                                down: 1
                            });
                        };
                    })(pos);
                };
            };

            if (ws.automove) {
                let playerPos = game.world.entities[game.world.myUid].targetTick.position;

                let x = Math.round(playerPos.x);
                let y = Math.round(playerPos.y);

                let pos = {
                    x: x,
                    y: y
                };

                if (ws.myPlayer) {
                    ((position) => {
                        let x = Math.round(position.x);
                        let y = Math.round(position.y);

                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + x) * 100, (-ws.myPlayer.position.y + y) * 100)
                        })

                        let myX = Math.round(ws.myPlayer.position.x);
                        let myY = Math.round(ws.myPlayer.position.y);

                        let offset = 6;

                        if (-myX + x > offset) {
                            ws.network.sendInput({
                                left: 0
                            });
                        } else {
                            ws.network.sendInput({
                                left: 1
                            });
                        };

                        if (myX - x > offset) {
                            ws.network.sendInput({
                                right: 0
                            });
                        } else {
                            ws.network.sendInput({
                                right: 1
                            });
                        };

                        if (-myY + y > offset) {
                            ws.network.sendInput({
                                up: 0
                            });
                        } else {
                            ws.network.sendInput({
                                up: 1
                            });
                        };

                        if (myY - y > offset) {
                            ws.network.sendInput({
                                down: 0
                            });
                        } else {
                            ws.network.sendInput({
                                down: 1
                            });
                        };
                    })(pos);
                };
            };

            if (ws.autoaim) {
                let myPlayer = game.ui.playerTick;
                let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);

                if (ws.myPlayer) {
                    if (ws.myPlayer.position) {
                        ws.network.sendInput({
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mouseToWorld.x) * 100, (-ws.myPlayer.position.y + mouseToWorld.y) * 100)
                        });

                        let offset = 6;

                        if (1 == 1) {
                            if (ws.myPlayer.position.y - mouseToWorld.y > offset) {
                                ws.network.sendInput({
                                    down: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    down: 0
                                });
                            };
                            if (-ws.myPlayer.position.y + mouseToWorld.y > offset) {
                                ws.network.sendInput({
                                    up: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    up: 0
                                });
                            };
                            if (-ws.myPlayer.position.x + mouseToWorld.x > offset) {
                                ws.network.sendInput({
                                    left: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    left: 0
                                });
                            };
                            if (ws.myPlayer.position.x - mouseToWorld.x > offset) {
                                ws.network.sendInput({
                                    right: 0
                                });
                            } else {
                                ws.network.sendInput({
                                    right: 0
                                });
                            };
                        };
                    };
                };
            };

            if (ws.data.opcode == 0) {
                if (heal) {
                    if (ws.myPlayer) {
                        let playerHealth = (ws.myPlayer.health / ws.myPlayer.maxHealth) * 100;

                        if (playerHealth <= 10) {
                            ws.network.sendRpc({
                                name: "EquipItem",
                                itemName: "HealthPotion",
                                tier: 1
                            });
                        };
                    };

                    if (ws.myPet) {
                        let petHealth = (ws.myPet.health / ws.myPet.maxHealth) * 100;

                        if (petHealth <= 10) {
                            if (!ws.shouldHealPet) {
                                ws.shouldHealPet = true;

                                setTimeout(() => {
                                    ws.shouldHealPet = false;
                                }, 300);

                                ws.network.sendRpc({
                                    name: "BuyItem",
                                    itemName: "PetHealthPotion",
                                    tier: 1
                                });

                                ws.network.sendRpc({
                                    name: "EquipItem",
                                    itemName: "PetHealthPotion",
                                    tier: 1
                                });
                            };
                        };
                    };
                };

                ws.network.sendRpc({
                    name: "BuyItem",
                    itemName: "HealthPotion",
                    tier: 1
                });
            };

            if (ws.activebow) {
                ws.network.sendInput({
                    space: 0
                });

                ws.network.sendInput({
                    space: 1
                });
            };

            switch (ws.data.opcode) {
                case 4:
                    ws.send(iframeWindow.game.network.codec.encode(6, {}));

                    iframe.remove();

                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.playerPartyShareKey
                    });

                    break;
            };
        };
    });
};

(function() {
    document.getElementsByClassName("hud-party-actions")[0].insertAdjacentHTML("afterend", `
      <button class="btn btn-blue" style="width: 120px; margin: 10px 0 0 0;box-shadow: none;" onclick="game.network.sendRpc({ name: 'LeaveParty' });"> Leave </button>
      <input style="margin: 10px 10px -5px 15px; width: 281px;" placeholder="Party Share Key" value="" class="btn partyShareKey" />
      <button class="btn btn-blue" style="width: 125px; margin: 10px 0 -1px 0;" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementsByClassName('partyShareKey')[0].value })"> Join </button>
    `);
})();

let getElement = (Element) => {
    return document.getElementsByClassName(Element);
};

let getId = (Element) => {
    return document.getElementById(Element);
};

getElement("hud-party-members")[0].style.display = "block";
getElement("hud-party-grid")[0].style.display = "none";

game.script.parties = {};

// Closed Parties

let privateTab = document.createElement("a");

privateTab.className = "hud-party-tabs-link";
privateTab.id = "privateTab";
privateTab.innerHTML = "Closed Parties";

let privateHud = document.createElement("div");

privateHud.className = "hud-private hud-party-grid";
privateHud.id = "privateHud";
privateHud.style = "display: none;";
getElement("hud-party-tabs")[0].appendChild(privateTab);
getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);

// Keys

let keyTab = document.createElement("a");

keyTab.className = "hud-party-tabs-link";
keyTab.id = "keyTab";
keyTab.innerHTML = "Party Keys";
getElement("hud-party-tabs")[0].appendChild(keyTab);

let keyHud = document.createElement("div");

keyHud.className = "hud-keys hud-party-grid";
keyHud.id = "keyHud";
keyHud.style = "display: none;";
getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, getElement("hud-party-actions")[0]);

getId("privateTab").onclick = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    };

    getId("privateTab").className = "hud-party-tabs-link is-active";
    getId("privateHud").setAttribute("style", "display: block;");

    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    };

    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    };

    if (getId("privateHud").getAttribute("style") == "display: none;") {
        getId("privateHud").setAttribute("style", "display: block;");
    };

    if (getId("keyHud").getAttribute("style") == "display: block;") {
        getId("keyHud").setAttribute("style", "display: none;");
    };
};

getElement("hud-party-tabs-link")[0].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");

    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    };

    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    };
};

getElement("hud-party-tabs-link")[1].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");

    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    };

    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    };
};

getId("keyTab").onmouseup = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    };

    getId("keyTab").className = "hud-party-tabs-link is-active";
    getId("keyHud").setAttribute("style", "display: block;");

    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    };

    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    };

    if (getId("privateHud").getAttribute("style") == "display: block;") {
        getId("privateHud").setAttribute("style", "display: none;");
    };

    if (getId("keyHud").getAttribute("style") == "display: none;") {
        getId("keyHud").setAttribute("style", "display: block;");
    };
};

getElement('hud-keys hud-party-grid')[0].innerHTML += "<br><h3>Party Keys</h3><br>"

game.network.addRpcHandler("PartyShareKey", e => {
    let cpKeyId = `skl${Math.floor(Math.random() * 999999)}`;
    let cpLnkId = `skl${Math.floor(Math.random() * 999999)}`;

    let psk = e.partyShareKey;

    let lnk = `http://zombs.io/#/${game.options.serverId}/${psk}/`;

    getId("keyHud").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p>${psk}</p></div><button class="btn btn-red" id="${cpKeyId}" style="display:inline-block;" onclick="window.copyText('${psk}');">Copy Key</button>&nbsp<button class="btn btn-red" id="${cpLnkId}" style="display:inline-block;" onclick="window.copyText('${lnk}');">Copy Link</button><br />`;
});

let parties = "";

game.network.addRpcHandler("SetPartyList", e => {
    parties = "";

    for (let i in e) {
        if (e[i].isOpen == 0) {
            parties += "<div style=\"width: relative; height: relative;\" class=\"hud-party-link is-disabled\"><strong>" + e[i].partyName + "</strong><span>" + e[i].memberCount + "/4<span></div>";
        };
    };


    getId("privateHud").innerHTML = parties;
});

let getIsZombiesActive = function() {
    let isZombiesActive = false;
    for (let i in game.world.entities) {
        if (game.world.entities[i].fromTick.model !== "NeutralTier1") {
            if (game.world.entities[i].fromTick.entityClass == "Npc") {
                isZombiesActive = true;
            };
        };
    };

    return isZombiesActive;
};

let getactiveComingbosswaves = function() {
    let activeComingbosswave = false;
    let aftercomingbosswaves = [48, 56, 64, 72, 80, 88, 96, 104, 120];

    for (let i = 0; i < aftercomingbosswaves.length; i++) {
        if (game.ui.playerTick.wave == aftercomingbosswaves[i]) {
            activeComingbosswave = true;
        };
    };

    return activeComingbosswave;
};

let getbosswaves = function() {
    let activebosswave = false;
    let allbosswaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121];

    for (let i = 0; i < allbosswaves.length; i++) {
        if (game.ui.playerTick.wave == allbosswaves[i]) {
            activebosswave = true;
        };
    };

    return activebosswave;
};

let bossAlert = document.createElement('p');

bossAlert.innerHTML = `<i class="fa fa-exclamation-triangle"></i> Boss wave incoming`;
bossAlert.style.display = "none";
bossAlert.style.color = "white";
bossAlert.style.opacity = '0.5';
document.getElementsByClassName('hud-top-center')[0].appendChild(bossAlert);

game.network.addRpcHandler("DayCycle", function(e) {
    if (game.ui.playerTick && e.isDay)
        getactiveComingbosswaves() ? bossAlert.style.display = "block" : bossAlert.style.display = "none";
});

let inull = true;
let i1 = true;
let i2 = true;
let i3 = true;

document.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName.toLowerCase() == "input" || document.activeElement.tagName.toLowerCase() == "textarea") {
        Main1Keys = false;
        Main2Keys = false;
        Main3Keys = false;
    } else {
        Main1Keys = true;
        Main2Keys = true;
        Main3Keys = true;
    }
    if (Main1Keys) {
        switch (e.code) {
            case "Insert":
                document.getElementsByClassName("1i")[0].click();
                break;
            case "KeyX":
                document.getElementsByClassName("8i")[0].click();
                break;
            case "KeyZ":
                document.getElementsByClassName("10i")[0].click();
                break;
            case "KeyR":
                healPlayer();
                break;
            case "KeyG":
                document.getElementsByClassName("7i")[0].click();
                break;

        }
    }
    if (Main2Keys) {
        switch (e.code) {
            case "KeyK":
                document.getElementsByClassName("10i5")[0].click();
                break;
            case "Key/":
                document.getElementsByClassName("6i5")[0].click();
                break;
            case "KeyM":
                game.network.sendRpc({
                    "name": "BuyItem",
                    "itemName": "PetRevive",
                    "tier": 1
                })
                game.network.sendRpc({
                    "name": "EquipItem",
                    "itemName": "PetRevive",
                    "tier": 1
                })
                break;
        }
    }
    if (Main3Keys) {
        switch (e.code) {
            case "KeyL":
                document.getElementsByClassName("0i2")[0].click();
                break;
            case "KeyI":
                game.network.sendRpc({
                    name: "LeaveParty"
                })
                break;
        }
    }
});

document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.keyCode == 189) {
            getRss = !getRss;
        };
    };
});

let savedTabs = [];

let gameServers = game.options.servers;

document.getElementsByClassName('hud-intro-form')[0].insertAdjacentHTML('beforeend', '<button class="btn hud-intro-play" id="hstb">Host Saved Tab</button>');

let stElem = document.getElementById('savedTabs');

let newPlayButton = document.getElementsByClassName("hud-intro-play")[0].cloneNode();

newPlayButton.classList.replace('hud-intro-play', 'longbtn');
newPlayButton.style.display = "none";
newPlayButton.style.marginTop = "10px";
newPlayButton.innerText = "Enter Saved Tab";

newPlayButton.addEventListener('click', function() {
    game.ui.components.Intro.componentElem.style.display = "none";
});

document.getElementsByClassName('hud-intro-play')[0].insertAdjacentElement("beforebegin", newPlayButton)

let realPlayButton = true

const switchPlayButtons = () => {
    realPlayButton = !realPlayButton;
    if (realPlayButton) {
        newPlayButton.style.display = "none";
        document.getElementsByClassName("hud-intro-play")[0].style.display = "block";
    } else {
        document.getElementsByClassName("hud-intro-play")[0].style.display = "none";
        newPlayButton.style.display = "block";
    };
};

const updateSavedTabs = () => {
    stElem.innerHTML = `<br>`;

    let oneEnabled = false;

    for (let tabi in savedTabs) {
        let tab = savedTabs[tabi];

        let tabBtn = document.createElement('button');

        if (tab.enabled) {
            oneEnabled = true;
        };

        tabBtn.classList.add('btn', tab.enabled ? "btn-green" : "btn-red");
        tabBtn.innerText = savedTabs[tabi].id;
        stElem.appendChild(tabBtn);

        stElem.append('    ');

        let xBtn = document.createElement('button');
        xBtn.classList.add('btn');
        xBtn.classList.add('btn-red');
        xBtn.innerHTML = "❌";
        xBtn.style.display = "inline-block";
        stElem.appendChild(xBtn);

        stElem.append('    ');

        let writeBtn = document.createElement('button');
        writeBtn.classList.add('btn');
        writeBtn.classList.add('btn-blue');
        writeBtn.innerHTML = "✍️";
        writeBtn.style.display = "inline-block"
        stElem.appendChild(writeBtn);

        stElem.appendChild(document.createElement('br'));
        stElem.appendChild(document.createElement('br'));

        let enterBtn = document.createElement('button');
        enterBtn.classList.add('btn');
        enterBtn.classList.add('btn-blue');
        enterBtn.innerHTML = "☑️";
        enterBtn.style.width = '130px';
        enterBtn.style.display = "none";
        stElem.appendChild(enterBtn);

        stElem.append('        ');

        let resetBtn = document.createElement('button');
        resetBtn.classList.add('btn');
        resetBtn.classList.add('btn-red');
        resetBtn.innerHTML = "🔙";
        resetBtn.style.width = '130px';
        resetBtn.style.display = "none";
        stElem.appendChild(resetBtn);

        let oldId;

        writeBtn.addEventListener('click', function() {
            if (this.dataset.editing) {
                updateSavedTabs();
            } else {
                resetBtn.style.display = "inline-block";
                resetBtn.classList.replace('btn', 'disabledBtn');
                enterBtn.style.display = "inline-block";
                enterBtn.classList.replace('btn', 'disabledBtn');
                oldId = savedTabs[tabi].id;
                tabBtn.innerHTML = `<input style="width:110px; height: 35px; margin-top: 2px;" type="text" class='btn btn-red' />`
                tabBtn.children[0].addEventListener('input', function() {
                    this.value = this.value.replaceAll(' ', '_');
                    if (this.value == oldId || this.value == "") {
                        if (this.value !== "") {
                            resetBtn.classList.replace('btn', 'disabledBtn');
                        };
                        if (this.value == "") {
                            enterBtn.classList.replace('btn', 'disabledBtn');
                        }
                    } else {
                        resetBtn.classList.replace('disabledBtn', 'btn');
                        enterBtn.classList.replace('disabledBtn', 'btn');
                    };
                    if (savedTabs.find(i => i.id == this.value)) {
                        enterBtn.classList.replace('btn', 'disabledBtn');
                    };
                })
                tabBtn.children[0].focus();
                tabBtn.children[0].value = savedTabs[tabi].id;

                tabBtn.setAttribute('disabled', true);
                this.innerHTML = "Back"
                xBtn.setAttribute('disabled', true)
                this.dataset.editing = true;
                xBtn.classList.replace('btn', 'disabledBtn');
            };
        });

        resetBtn.addEventListener('click', function() {
            tabBtn.children[0].value = oldId;
        });

        enterBtn.addEventListener('click', function() {
            savedTabs[tabi].id = tabBtn.children[0].value;
            updateSavedTabs();
        });
        xBtn.addEventListener('click', function() {
            let c = confirm('Are you sure you want to close this tab?');
            if (c) {
                tab.iframe.remove();
                savedTabs.splice(tabi, tabi + 1);
                updateSavedTabs();
            };
        })

        savedTabs[tabi].btn = tabBtn;
        tabBtn.addEventListener('click', function() {
            savedTabs[tabi].enabled = !savedTabs[tabi].enabled;
            tab.iframe.style.display = "block";
            document.getElementsByTagName('canvas')[0].style.display = "none";
            for (let component in game.ui.components) {
                if (component !== "Intro") {
                    game.ui.components[component].componentElem.style.display = "none";
                };
            };
            for (let tbi in savedTabs) {
                let tb = savedTabs[tbi];
                if ((tb.serverId !== tab.serverId) || (tb.serverId == tab.serverId && tb.no !== tab.no)) {
                    tb.iframe.style.display = "none";
                    savedTabs[tbi].enabled = false;
                };
            };
            updateSavedTabs();
        })
        stElem.insertAdjacentHTML('beforeend', '<br />')
    };
    if (oneEnabled) {
        document.getElementsByTagName('canvas')[0].style.display = "none";
        for (let component in game.ui.components) {
            if (component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "none";
            };
        };
        if (realPlayButton) {
            switchPlayButtons();
        };
    } else {
        document.getElementsByTagName('canvas')[0].style.display = "block";
        if (!realPlayButton) {
            switchPlayButtons();
        };
        for (let tb of savedTabs) {
            tb.iframe.style.display = "none"
        };
        for (let component in game.ui.components) {
            if (component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "block";
            };
        };
        for (let component in game.ui.components) {
            if (component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "block";
            };
        };
    };
};

window.stOpt = {
    ust: updateSavedTabs,
    gst: () => savedTabs,
    spb: switchPlayButtons
}

window.ostb = () => {
    game.ui.components.Intro.componentElem.style.display = "block";
};

window.joinST = id => {
    let tab = savedTabs.find(i => i.id == id);
    if (tab) {
        for (let tb of savedTabs) {
            tb.iframe.style.display = "none"
        };
        tab.iframe.style.display = "block";
    };
};

updateSavedTabs();

const hostSavedTab = (serverId, psk = 'tabsession') => {
    let iframe = document.createElement('iframe');
    iframe.src = `https://zombs.io/#/${serverId}/${psk}/`;

    iframe.style.diplay = "none";
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.position = 'absolute';
    iframe.style.display = "none";

    document.getElementsByClassName('hud')[0].append(iframe);

    iframe.onload = () => {
        if (iframe.dataset.loaded) {
            return;
        };

        iframe.dataset.loaded = true;

        if (gameServers[serverId].hostno) {
            gameServers[serverId].hostno++;
        } else {
            gameServers[serverId].hostno = 1;
        };

        let tabi = savedTabs.length;

        savedTabs.push({
            serverId: serverId,
            psk: psk,
            serverName: game.options.servers[serverId].name,
            no: gameServers[serverId].hostno,
            iframe: iframe,
            id: `${game.options.servers[serverId].name.replaceAll(' ', '-')}_#${gameServers[serverId].hostno}`
        })
        updateSavedTabs();
        iframe.contentWindow.eval(`
            document.getElementsByClassName("hud-intro-play")[0].click()
            let hasJoined = false
            game.network.addEnterWorldHandler(() => {
                if(hasJoined) { return; }
                hasJoined = true;
            });
        `);
        setTimeout(() => {
            if (!iframe.contentWindow.game.world.inWorld) {
                iframe.remove();
                savedTabs.splice(tabi, tabi + 1);
                game.ui.components.Intro.componentElem.style.display = "block";
                updateSavedTabs();
            };
        }, 10000);
    };
};

document.getElementById('hstb').addEventListener('click', function() {
    if (document.getElementById('hostsavedtabpsk').value.length > 1 && document.getElementById('hostsavedtabpsk').value.length < 21) {
        hostSavedTab(document.getElementsByClassName('hud-intro-server')[0].value, document.getElementById('hostsavedtabpsk').value);
    } else {
        hostSavedTab(document.getElementsByClassName('hud-intro-server')[0].value);
    };
})

game.ui.components.Chat.sendMessage2 = game.ui.components.Chat.sendMessage;

game.ui.components.Chat.sendMessage = (msg) => {
    switch (msg) {
        case "!back":
            if (window.parent !== window) {
                window.parent.ostb();
            };

            break;
        default:
            if (msg.toLowerCase().startsWith('!jointab')) {
                let id = msg.split(" ")[1];

                if (window.parent !== window) {
                    window.parent.joinST(id);
                };

                return;
            };

            game.ui.components.Chat.sendMessage2(msg);

            break;
    };
};

// Zoom with mouse

let dimension = 1;
const onWindowResize = () => {
    const renderer = game.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 4 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 4 * renderer.viewportPadding;
};

onWindowResize();

window.onresize = onWindowResize;

window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension += 0.08;
    } else if (e.deltaY < 0) {
        dimension -= 0.08;
    }
    onWindowResize();
};

window.zoom = val => {
    dimension = val;
    onWindowResize();
};

game.network.addEnterWorldHandler(() => {
    game.renderer.projectiles.setVisible(0);

    document.getElementsByClassName('hud-menu-shop')[0].style.display = 'none';
    document.getElementsByClassName('hud-menu-settings')[0].style.display = 'none';
    document.getElementsByClassName('hud-menu-party')[0].style.display = 'none';
});

game.network.oldSendRpc = game.network.sendRpc;

game.network.sendRpc = m => {
    const webSockets = window.allSockets;
    if(m.name == "EquipItem") {
        for(let id in webSockets) {
            const ws = webSockets[id];
            ws.network.sendPacket(9, { name: "BuyItem", itemName: m.itemName, tier: m.tier });
            ws.network.sendPacket(9, m);
        };
    };
    game.network.oldSendRpc(m);
};