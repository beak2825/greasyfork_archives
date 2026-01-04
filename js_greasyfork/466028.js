// ==UserScript==
// @name         24k discord.gg/GGQmaspr9N join this for ws scripts
// @version      v4.9.0
// @description  24k
// @author       Eh
// @match        zombs.io
// @icon         http://zombs.io/asset/image/entity/gold-stash/gold-stash-t8-base.svg
// @grant        none
// @namespace https://greasyfork.org/users/843799
// @downloadURL https://update.greasyfork.org/scripts/466028/24k%20discordggGGQmaspr9N%20join%20this%20for%20ws%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/466028/24k%20discordggGGQmaspr9N%20join%20this%20for%20ws%20scripts.meta.js
// ==/UserScript==

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<button id="shopshortcut1" class="btn btn-blue">Pickaxe</button>
<button id="shopshortcut2" class="btn btn-blue">Spear</button>
<button id="shopshortcut3" class="btn btn-blue">Bow</button>
<button id="shopshortcut4" class="btn btn-blue">Bomb</button>
<button id="shopshortcut5" class="btn btn-blue">Shield</button>
`;

document.getElementById('shopshortcut1').addEventListener('click', buyPickaxe);
document.getElementById('shopshortcut2').addEventListener('click', buySpear);
document.getElementById('shopshortcut3').addEventListener('click', buyBow);
document.getElementById('shopshortcut4').addEventListener('click', buyBomb);
document.getElementById('shopshortcut5').addEventListener('click', buyShield);

function equipItem(item, tier) {
    game.network.sendRpc({
        name: "EquipItem",
        itemName: item,
        tier: tier
    })
};

function buyItem(item, tier) {
    game.network.sendRpc({
        name: "BuyItem",
        itemName: item,
        tier: tier
    })
}

function shopShortcut(item, tier) {
    buyItem(item, tier)
    if (game.ui.playerWeaponName !== item) {
        equipItem(item, tier)
    }
}

function buyPickaxe() {
    let gold = game.ui.playerTick.gold
    let pickaxe = game.ui.inventory.Pickaxe
    if (pickaxe.tier == 1 && gold >= 1000) {
        shopShortcut("Pickaxe", 2)
        return
    }
    if (pickaxe.tier == 2 && gold >= 3000) {
        shopShortcut("Pickaxe", 3);
        return
    }
    if (pickaxe.tier == 3 && gold >= 5000) {
        shopShortcut("Pickaxe", 4);
        return
    }
    if (pickaxe.tier == 4 && gold >= 8000) {
        shopShortcut("Pickaxe", 5);
        return
    }
    if (pickaxe.tier == 5 && gold >= 24000) {
        shopShortcut("Pickaxe", 6);
        return
    }
    if (pickaxe.tier == 6 && gold >= 90000) {
        shopShortcut("Pickaxe", 7);
        return
    } else if (game.ui.playerWeaponName !== "Pickaxe") {
        equipItem("Pickaxe", game.ui.inventory.Pickaxe.tier)
    }
}

function buySpear() {
    let gold = game.ui.playerTick.gold
    let spear = game.ui.inventory.Spear
    if (!spear && gold >= 1400) {
        shopShortcut("Spear", 1)
        return
    }
    if (spear.tier == 1 && gold >= 2800) {
        shopShortcut("Spear", 2)
        return
    }
    if (spear.tier == 2 && gold >= 5600) {
        shopShortcut("Spear", 3)
        return
    }
    if (spear.tier == 3 && gold >= 11200) {
        shopShortcut("Spear", 4)
        return
    }
    if (spear.tier == 4 && gold >= 22500) {
        shopShortcut("Spear", 5)
        return
    }
    if (spear.tier == 5 && gold >= 45000) {
        shopShortcut("Spear", 6)
        return
    }
    if (spear.tier == 6 && gold >= 90000) {
        shopShortcut("Spear", 7)
        return
    } else if (game.ui.playerWeaponName !== "Spear"){
        equipItem("Spear", game.ui.inventory.Spear.tier)
    }
}

function buyBow() {
    let gold = game.ui.playerTick.gold
    let bow = game.ui.inventory.Bow
    if (!bow && gold >= 100) {
        shopShortcut("Bow", 1)
        return
    }
    if (bow.tier == 1 && gold >= 400) {
        shopShortcut("Bow", 2)
        return
    }
    if (bow.tier == 2 && gold >= 2000) {
        shopShortcut("Bow", 3)
        return
    }
    if (bow.tier == 3 && gold >= 7000) {
        shopShortcut("Bow", 4)
        return
    }
    if (bow.tier == 4 && gold >= 24000) {
        shopShortcut("Bow", 5)
        return
    }
    if (bow.tier == 5 && gold >= 30000) {
        shopShortcut("Bow", 6)
        return
    }
    if (bow.tier == 6 && gold >= 90000) {
        shopShortcut("Bow", 7)
        return
    } else if (game.ui.playerWeaponName !== "Bow"){
        equipItem("Bow", game.ui.inventory.Bow.tier)
    }
}

function buyBomb() {
    let gold = game.ui.playerTick.gold
    let bomb = game.ui.inventory.Bomb
    if (!bomb && gold >= 100) {
        shopShortcut("Bomb", 1)
        return
    }
    if (bomb.tier == 1 && gold >= 400) {
        shopShortcut("Bomb", 2)
        return
    }
    if (bomb.tier == 2 && gold >= 3000) {
        shopShortcut("Bomb", 3)
        return
    }
    if (bomb.tier == 3 && gold >= 5000) {
        shopShortcut("Bomb", 4)
        return
    }
    if (bomb.tier == 4 && gold >= 24000) {
        shopShortcut("Bomb", 5)
        return
    }
    if (bomb.tier == 5 && gold >= 50000) {
        shopShortcut("Bomb", 6)
        return
    }
    if (bomb.tier == 6 && gold >= 90000) {
        shopShortcut("Bomb", 7)
        return
    } else if (game.ui.playerWeaponName !== "Bomb"){
        equipItem("Bomb", game.ui.inventory.Bomb.tier)
    }
}

function buyShield() {
    let gold = game.ui.playerTick.gold
    let shield = game.ui.inventory.ZombieShield
    if (!shield && gold >= 1000) {
        buyItem("ZombieShield", 1)
        return
    }
    if (shield.tier == 1 && gold >= 3000) {
        buyItem("ZombieShield", 2)
        return
    }
    if (shield.tier == 2 && gold >= 7000) {
        buyItem("ZombieShield", 3)
        return
    }
    if (shield.tier == 3 && gold >= 14000) {
        buyItem("ZombieShield", 4)
        return
    }
    if (shield.tier == 4 && gold >= 18000) {
        buyItem("ZombieShield", 5)
        return
    }
    if (shield.tier == 5 && gold >= 22000) {
        buyItem("ZombieShield", 6)
        return
    }
    if (shield.tier == 6 && gold >= 24000) {
        buyItem("ZombieShield", 7)
        return
    }
    if (shield.tier == 7 && gold >= 30000) {
        buyItem("ZombieShield", 8)
        return
    }
    if (shield.tier == 8 && gold >= 45000) {
        buyItem("ZombieShield", 9)
        return
    }
    if (shield.tier == 9 && gold >= 70000) {
        buyItem("ZombieShield", 10)
        return
    }
}

let newYoutubers = [{
    name: "JaYT Uints",
    channel: "https://www.youtube.com/channel/UCHbSHt61542PNbY9PoEU4Tg"
}];

let youtuber = newYoutubers[Math.floor(Math.random() * newYoutubers.length)];
document.getElementsByClassName("hud-intro-youtuber")[0].innerHTML = `<h3>Featured YouTuber:</h3><a href="${youtuber.channel}" target="_blank">${youtuber.name}</a>`;

document.addEventListener("keydown", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key === "v") {
            modm();
        }
        if (e.keyCode == 189) { // key -
            activersID = !activersID;
        };
    };
});

localStorage["youTubeSubscribed"] = true;
localStorage["walkthroughCompleted"] = true;
localStorage["twitterShared"] = true;
localStorage["facebookShared"] = true;

document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
document.querySelectorAll('.ad-unit, .hud-intro-footer, .hud-intro-stone, .hud-intro-tree, hud-respawn-corner-bottom-left, .hud-intro-social, .hud-intro-more-games, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName('hud-intro-play')[0].classList.remove('btn-green');
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;"><Custom><b><font size='24'>Cipher</font></b></Custom>`;
document.getElementsByClassName("hud-intro-name")[0].placeholder = "Name"
document.getElementsByClassName("hud-intro-play")[0].innerText = "Play Game"
document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
document.getElementsByClassName("hud-intro-form")[0].setAttribute("style", "width: 310px; height: 330px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-guide")[0].setAttribute("style", "width: 420px; height: 280px; margin-top: 8px; background-color: rgb(0, 0, 0, 0.0);");
document.getElementsByClassName("hud-intro-left")[0].setAttribute("style", "width: 360px; height: 280px; margin-top: 24px; margin-left: 75px; margin-right: 0px;");

document.getElementsByClassName("hud-respawn-corner-bottom-left")[0].innerHTML = `
<button class="btn btn-blue messageBTN" onclick="window.sendChatMsg();">Send Message</button>
<input class="btn btn-blue messageINPT" placeholder="Message...">
`;

window.sendChatMsg = () => {
    let msg = document.getElementsByClassName("messageINPT")[0].value;
    game.network.sendRpc({
        name: "SendChatMessage",
        message: msg,
        channel: "Local"
    });
}

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
    <input type="text" style="width: 225px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); color: red; height: 45px; padding: 5px;" id="hostsavedtabpsk" placeholder="Tab Saver...">
    <h3>Tabs saved:</h3>
    <div id="savedTabs"></div>
    <button class='btn btn-red' style='width: 200px; height: 40px; padding: 1px;' onclick='window.goback("tabsaver");'>Exit</button>
    <br>
</div>

<div class='menufillerLayout' style='text-align: center;'>
    <h1>Menu Filler</h1>
    <p>Sends WebSocket Fillers to fill the selected server.</p>
    <br><br>
    <button class='btn btn-purple' style='width: 160px;' onclick='sendFillerToServer();'>Send Filler</button>
    &nbsp
    <button class='btn btn-violet' style='width: 160px;' onclick='deleteFillersInServer();'>Delete Fillers</button>
    <br>
    <p style='width: 160px; padding: 6px;' class='btn fillerNums'>Filler Count: 0</p>
    &nbsp
    <button class='btn btn-yellow' style='width: 160px; margin-top: 15px;' onclick='window.goback("menufiller");'>Exit</button>
</div>

<div class='scannerLayout' style='text-align: center;'>
    <h1>Server Scanner</h1>
    <p>Click on the <strong>Scan Server</strong> button to show the data of the selected server here.</p>
    <br>
    <div id="ssrs"></div>
    <br>
    <button class='btn btn-blue' style='width: 160px;' onclick='window.goback("scanner");'>Exit</button>
</div>

<div class='altsLayout' style='text-align: center;'>
    <h1>Sockets</h3>
    <p>Create WebSockets to join selected servers and bases.</p>
    <br><br>
    <input type="text" style="width: 160px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; padding: 6px;" placeholder='Server ID?' class='altsServerId' maxlength='9'>&nbsp
    <input type="text" style="width: 160px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; padding: 6px;" placeholder='Share Key?' class='altsPsk' maxlength='20'><br>
    <input type="text" style="width: 160px; border-radius: 3px; border: 2px solid rgb(0, 0, 0, 0.4); height: 40px; padding: 6px; margin-top: 10px;" placeholder='Name?' class='altsName' maxlength='29'>&nbsp
    <button class='btn btn-green' style='width: 160px; margin-top: 10px;' onclick='window.sendafkws()'>Send WebSocket</button>
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
window.refreshCount = () => document.getElementsByClassName('fillerNums')[0].innerHTML = `Filler Count: ${window.fillerCount}`;

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
                        displayName: 'Curtis',
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
                    partyShareKey: game.ui.getPlayerPartyShareKey()
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
                        displayName: `SkidTheJa¥₮`,
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

//document.getElementsByClassName('hud-chat')[0].style.width = "auto";
//document.getElementsByClassName('hud-chat')[0].style.minWidth = "500px";

const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
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
/*
let srvr = 0;

for (let i in game.options.servers) {
    srvr += 1;
    try {
        document.getElementsByClassName("hud-intro-server")[0][srvr].innerHTML = game.options.servers[i].name + ", Server ID: " + game.options.servers[i].id;
    } catch {
        console.log('listed server data');
    };
};
*/
game.network.addRpcHandler("SetPartyList", parties => {
    let serverPop = 0;

    for (let party of parties) {
        serverPop += party.memberCount;
    };

    document.getElementsByClassName("hud-party-server")[0].innerHTML = `${serverPop}/32 <small>${game.network.connectionOptions.name}</small>`;
});

//priv party show
   function checkStatus(party) {
      if (party.isOpen == 1) {
         return '<a style = "color:blue;opacity: 1.0;">[Open]<a/>';
      } else if (!party.isOpen == 1) {
         return '<a style = "color:blue;opacity: 1.0;">[Private]<a/>';
      }
   };
   let partyCheck = (all_parties) => {
      document.getElementsByClassName('hud-party-grid')[0].innerHTML = '';

      for (let i in all_parties) {
         let parties = all_parties[i];
         let tab = document.createElement('div');
         tab.classList.add('hud-party-link');
         tab.classList.add('custom-party');
         tab.id = parties.partyId;
         tab.isPublic = parties.isOpen;
         tab.name = parties.partyName;
         tab.members = parties.memberCount;
         tab.innerHTML = `
                  <strong>${parties.partyName} ${checkStatus(parties)}<strong/>
                  <small>id: ${parties.partyId}</small> <span>${parties.memberCount}/4<span/>
              `;

         if (parties.memberCount == 4) {
            tab.classList.add('is-disabled');
         } else {
            tab.style.display = 'block';
         }
         setTimeout(() => {
            if (parties.partyId == game.ui.playerPartyId) tab.classList.add('is-active');
         }, 1000);

         if (parties.isOpen !== 1) tab.classList.add('is-disabled');

         tab.addEventListener('click', function () {
            if (tab.isPublic == 1 && tab.members < 4) {
               game.network.sendRpc({
                  name: 'JoinParty',
                  partyId: Math.floor(tab.id)
               });
            } else if (!tab.isPublic == 1) {
               game.ui.getComponent('PopupOverlay').showHint("You can't request private parties!", 800);
            }
         });
         document.getElementsByClassName('hud-party-grid')[0].appendChild(tab);
      };
   };

   game.network.addRpcHandler("SetPartyList", (e) => { partyCheck(e) });

/***play spam***/
let shouldplayspam = {};
var playSpam = document.createElement('button');
playSpam.className = "btn btn-blue playspam";
playSpam.innerHTML = `<h2>Spam Playing<h2>`
playSpam.style.width ="270px";
playSpam.style.position = "relative";
playSpam.style.top = "0px";
document.getElementsByClassName('hud-intro-form')[0].insertBefore(playSpam, document.getElementsByClassName('hud-intro-error')[0]);
document.getElementsByClassName('playspam')[0].addEventListener('click', function(){
    shouldplayspam = false;
    if(document.getElementsByClassName('playspam')[0].className === "btn btn-blue playspam"){
        document.getElementsByClassName('playspam')[0].className = "btn btn-red playspam";
    } else {
       shouldplayspam = true;
        document.getElementsByClassName('playspam')[0].className = "btn btn-blue playspam";
        document.getElementsByClassName("hud-intro-play")[0].click();
        let playspaminterval = setInterval(function(){
            if(shouldplayspam && !game.world.inWorld){
                document.getElementsByClassName("hud-intro-play")[0].click();
            }
            if (game.world.inWorld) {
                clearInterval(playspaminterval);
            }
        },0)
    }
});

let css = `
 .btn:hover {
     cursor: pointer;
}
 .btn-blue {
     background-color: #144b7a;
}
 .btn-blue:hover .btn-blue:active {
     background-color: #144b7a;
}

::-webkit-scrollbar {
	width: 12px;
    height: 0px;
    border-radius: 10px;
	background-color: rgba(0, 0, 0, 0);
}
::-webkit-scrollbar-thumb {
	border-radius: 10px;
         background-image: url("https://i.pinimg.com/736x/15/16/ce/1516cef68f1e859003a73508d3dcd899.jpg")
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
    background-image: url('https://i.pinimg.com/originals/17/de/37/17de37e1547b36fda5cd2cdfa9c24689.gif');
    background-size: cover;
}

 .hud-intro .hud-intro-form .hud-intro-server {
    display: block;
    line-height: unset;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("https://i2.wp.com/www.titanui.com/wp-content/uploads/2013/09/14/Blue-Technology-Vortex-Background-Vector.jpg?fit=560%2C522&ssl=1");
}
 .hud-intro .hud-intro-form .hud-intro-name {
    display: block;
    border: 3px solid white;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("https://i2.wp.com/www.titanui.com/wp-content/uploads/2013/09/14/Blue-Technology-Vortex-Background-Vector.jpg?fit=560%2C522&ssl=1");
}
 .hud-intro .hud-intro-form .hud-intro-play {
    display: block;
    background: #eee;
    font-size: 0.9rem;
    color: black;
    padding: 1px;
    line-height: unset;
    background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("https://i2.wp.com/www.titanui.com/wp-content/uploads/2013/09/14/Blue-Technology-Vortex-Background-Vector.jpg?fit=560%2C522&ssl=1");
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
     background-image: url("https://www.colorhexa.com/144b7a.png");
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
     background-image: url("https://www.colorhexa.com/144b7a.png");
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
 .hud-chat hud-chat-message {
     white-space: unset;
     word-break: break-word;
    background-image: url("https://www.colorhexa.com/144b7a.png")
}
 .hud-chat .hud-chat-messages {
     max-height: 340px;
     min-height: 35px;
    background-image: url("https://www.colorhexa.com/144b7a.png")
}
 #hud-menu-settings {
     background-image: url("https://www.colorhexa.com/144b7a.png")
}

#hud-respawn {
    background-image: url("https://www.colorhexa.com/144b7a.png")
}

 #hud-map {
     background-image: url("https://www.colorhexa.com/144b7a.png")
}

#hud-health-bar {
    background-image: url("https://www.colorhexa.com/144b7a.png")
}

.hud-leaderboard {
      background-image: url("https://www.colorhexa.com/144b7a.png")
}
.hud-resources {
    background-image: url("https://www.colorhexa.com/144b7a.png")
}

/*
#hud-toolbar {
     background-image: url("https://static.vecteezy.com/system/resources/previews/000/693/176/non_2x/abstract-cloth-background-in-classic-blue-vector.jpg")
}
*/

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
 .hud-menu-cipher {
     display: none;
     position: fixed;
     top: 38%;
     left: 41.5%;
     width: 850px;
     height: 600px;
     margin: -270px 0 0 -300px;
     padding: 20px;
     background: rgba(0, 0, 0, 0.6);
     color: #eee;
     border-radius: 4px;
     z-index: 15;
         background-image: url("https://imgs.search.brave.com/BFlxWKN6UrK5mmDvm6reK3irFDuc3EpmLSBT1HZ0n5M/rs:fit:1200:1147:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLWFsbC5j/b20vdXBsb2Fkcy9w/b3N0cy8yMDE2LTEy/LzFfYmx1ZV9ncmFk/aWVudC5qcGc")

}
 .hud-menu-cipher h3 {
     display: block;
     margin: 0;
     line-height: 20px;
}
 .hud-menu-cipher .hud-cipher-grid {
     display: block;
     height: 500px;
     padding: 0px;
     margin-top: 6px;
}
.hud-cipher-grid {
     overflow: auto ;
}
 .hud-spell-icons .hud-spell-icon[data-type="Cipher"]::before {
        background-image: url("http://zombs.io/asset/image/entity/gold-stash/gold-stash-t8-base.svg")
}
 .hud-menu-cipher .hud-the-tab {
     position: relative;
     height: 60px;
     line-height: 40px;
     margin: 20px;
     border: 0px solid rgb(0, 0, 0, 0);
}
 .hud-menu-cipher .hud-the-tab {
     display: block;
     float: left;
     margin: 0 1px 0 0;
     font-size: 14px;
     background: rgba(0, 0, 0, 0.4);
     color: rgba(255, 255, 255, 0.4);
     transition: all 0.15s ease-in-out;
}
 .hud-menu-cipher .hud-the-tab:hover {
     background: rgba(0, 0, 0, 0.2);
     color: #eee;
     cursor: pointer;
}
.hud-cipher-menus {
     border: 3px solid #222222;
     background: linear-gradient(#100c4d, #040317);
     height: 100%;
     text-align: center;
     width: 100px;
     float: left;
}
.mbtn {
     width: 100%;
     height: 14.3%;
     border: none;
     font-size: 100%;
     color: white;
     margin: 0px;
     background-color: rgba(0, 0, 0, 0);
}
.mbtn:hover, .activeM {
     background-color: #171369;
}
.mbtn, .hud-cipher-menus {
     border-radius: 20px;
}
`;

function getElem(DOMClass) {
    return document.getElementsByClassName(DOMClass);
}

function getId(DOMId) {
    return document.getElementById(DOMId);
}

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css));
document.head.appendChild(styles);
styles.type = "text/css";

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Cipher");
spell.classList.add("hud-cipher-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

let modHTML = `
<div class="hud-menu-cipher">
<div class='hud-cipher-menus'>
<button class="btn-blue HM mbtn">Home</button>
<br />
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
<button class="btn-blue BS1 mbtn">Auto Build</button>
</div>
<div class="hud-cipher-grid"></div>
</div>
`;

//map

document.body.insertAdjacentHTML("afterbegin", modHTML);

let cipherMenu = document.getElementsByClassName("hud-menu-cipher")[0];

document.getElementsByClassName("hud-cipher-icon")[0].addEventListener("click", function() {
    if (cipherMenu.style.display == "none" || cipherMenu.style.display == "") {
        cipherMenu.style.display = "block";
    } else {
        cipherMenu.style.display = "none";
    };
});

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 220:
            /* key \ */
            if (game.world.inWorld) document.getElementsByClassName("hud-cipher-icon")[0].click();
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
        if (cipherMenu.style.display == "block") {
            cipherMenu.style.display = "none";
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

document.getElementsByClassName("BS1")[0].addEventListener("click", function() {
    displayAllToNone();

    document.getElementsByClassName("BS1")[0].classList.add("activeM");
    document.getElementsByClassName("etc.Class")[0].innerText = "Auto Build";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "";
        };
    };
});

document.getElementsByClassName("HM")[0].addEventListener("click", function() {
    displayAllToNone();

    document.getElementsByClassName("HM")[0].classList.add("activeM");
    document.getElementsByClassName("etc.Class")[0].innerText = "Home";

    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "";
        };
    };
});

// key to open and close
function modm() {
    if (cipherMenu.style.display == "none" || cipherMenu.style.display == "") {
        cipherMenu.style.display = "block";
    } else {
        cipherMenu.style.display = "none";
    };
};

function displayAllToNone() {
    document.getElementsByClassName("SE")[0].classList.remove("activeM");
    document.getElementsByClassName("SI")[0].classList.remove("activeM");
    document.getElementsByClassName("AB")[0].classList.remove("activeM");
    document.getElementsByClassName("BS")[0].classList.remove("activeM");
    document.getElementsByClassName('RE')[0].classList.remove("activeM");
    document.getElementsByClassName('BS1')[0].classList.remove("activeM");
    document.getElementsByClassName('HM')[0].classList.remove("activeM");

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
        for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "none";
        };
    };
        for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "none";
        };
    };
};

document.getElementsByClassName("hud-cipher-grid")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3 class="etc.Class">Cipher</h3>
<hr />
<button id="sellall" class="btn btn-blue 0i" style="width: 45%;">Sell All!</button>
<button id="sellwall" class="btn btn-blue 1i" style="width: 45%;">Sell Walls!</button>
<button id="selldoor" class="btn btn-blue 2i" style="width: 45%;">Sell Doors!</button>
<button id="selltrap" class="btn btn-blue 3i" style="width: 45%;">Sell Slow Traps!</button>
<button id="sellarrow" class="btn btn-blue 4i" style="width: 45%;">Sell Arrows!</button>
<button id="sellcannon" class="btn btn-blue 5i" style="width: 45%;">Sell Cannon!</button>
<button id="sellmelee" class="btn btn-blue 6i" style="width: 45%;">Sell Melee!</button>
<button id="sellbomb" class="btn btn-blue 7i" style="width: 45%;">Sell Bombs!</button>
<button id="sellmagic" class="btn btn-blue 22i" style="width: 45%;">Sell Mages!</button>
<button id="sellmines" class="btn btn-blue 15i" style="width: 45%;">Sell Gold Mines!</button>
<button id="sellharvester" class="btn btn-blue 18i" style="width: 45%;">Sell Harvesters!</button>
<button class="btn btn-blue 8i" style="width: 45%;">Activate Upgrade All!</button>
<button class="btn btn-blue 9i" style="width: 45%;">Activate AHRC!</button>
<button class="btn btn-blue 10i" style="width: 45%;">Enable AutoBow</button>
<button class="btn btn-blue 21i" style="width: 45%;">Enable AutoBomb</button>
<button class="btn btn-blue 13i" style="width: 45%;">Enable Auto Accepter</button>
<button class="btn btn-blue 14i" style="width: 45%;">Enable Auto Kicker</button>
<button class="btn btn-blue 23i" style="width: 45%;">Enable Doors 3x3</button>
<button class="btn btn-blue 24i" style="width: 45%;">Enable Doors 5x5</button>
<button class="btn btn-blue 25i" style="width: 45%;">Enable Zoom Scroll</button>
<br class="16i"><br class="17i">
<button class="btn btn-blue 0i5" style="width: 45%;">Can Members Sell!</button>
<button class="btn btn-blue 1i5" style="width: 45%;"">Kick All Members!</button>
<button class="btn btn-red 8i5" style="width: 45%;">!(Auto Health And Pet Health)</button>
<button class="btn btn-red 9i5" style="width: 45%;">!(Revive And Evolve Pets)</button>
<button class="btn btn-blue 5i5" style="width: 45%;">Enable Send Info!</button>
<button class="btn btn-blue 10i5" style="width: 45%;">Clear Messages!</button>
<button class="btn btn-blue 11i5" style="width: 45%;">Enable Screenshot Mode</button>
<button class="btn btn-blue 12i5" style="width: 45%;">Enable Debug Mode</button>
<button class="btn btn-blue 13i5" style="width: 45%;">Enable AutoAim!</button>
<select id="aimOptions" class="btn btn-blue 14i5"style="width: 45%;"><option value="pl" selected>Players</option><option value="zo">Zombies</option></select>
<button class="btn btn-blue 21i5" style="width: 45%;">Enable Auto Buy Spear</button>
<button class="btn btn-blue 20i5" style="width: 45%;">Enable Auto Buy Pickaxe</button>
<button class="btn btn-blue 19i5" style="width: 45%;">Enable Auto Buy Bomb</button>
<button class="btn btn-blue 17i5" style="width: 45%;">Enable Auto Buy Bow</button>
<button class="btn btn-blue 31i5" style="width: 45%;">Enable Auto Buy Shield</button>
<button class="btn btn-blue 18i5" style="width: 45%;">Enable Auto Respawn</button>
<button class="btn btn-blue 23i5" onclick="window.ADB();" style="width: 45%;">Enable Always Day Brightness</button>
<button class="btn btn-blue 24i5" style="width: 45%;">Enable Walls 3x3</button>
<button class="btn btn-blue 25i5" style="width: 45%;">Enable Walls 5x5</button>
<button class="btn btn-blue 26i5" style="width: 45%;">Enable Walls 7x7</button>
<button class="btn btn-blue 27i5" style="width: 45%;">Enable Walls 9x9</button>
<button class="btn btn-blue 28i5" style="width: 45%;">Enable Walls 20x20</button>
<button class="btn btn-blue 29i5" style="width: 45%;" id="togglespmch">Enable Chat Spam</button>
<input class="btn 30i5" style="width: 45%;" type="text" id="spammsg" placeholder="Spam Messages...">
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
<button class="btn btn-blue 8i2">Hide Resources!</button>
<button class="btn btn-blue 21i2">Control Alts!</button>
<button class="btn btn-blue 30i2">Lock Pos!</button>
<button class="btn btn-blue 13i2">Enable L Key!</button>
<br class="9i2"><br class="10i2">
<button class="btn btn-blue 11i2">Start Aito!</button>
<button class="btn btn-blue 12i2">Activate Base Finder!</button>
<button class="btn btn-blue 17i2">Clear Base Objects</button>
<br class="14i2"><br class="15i2">
<input type="text" value="" class="btn 16i2" placeholder="Player Rank" style="width: 25%;">
<button class="btn btn-blue 18i2">Activate Player Finder</button>
<button class="btn btn-blue 25i2">Follow Position</button>
<br class="29i2"><br class="27i2">
<button class="btn btn-blue 26i2" onclick="window.AM();">Add marker!</button>
<button class="btn btn-blue 31i2">Enable Map Tracker</button>
<button class="btn btn-blue 32i2">Active 4 Player Trick</button>
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
<button class='btn btn-blue 6i4'>Hide Grids</button>
<button class="btn btn-blue 13i4" onclick="window.healthbar();">Hide Healthbar</button>
<br class='7i4'><br class='8i4'>
<button class='btn btn-blue 9i4'>Hide Scene</button>
<button class='btn btn-blue 10i4'>Start Game</button>
<button class="btn btn-blue 14i4" onclick="window.trollge();">Hide Inventory</button>
<br class='16i4'><br class='17i4'>
<button class="btn btn-blue 15i4">Hide Map</button>
<button class="btn btn-blue 18i4">Hide Chat</button>
<button class="btn btn-blue 19i4">Hide Toolbar</button>
<br class='20i4'><br class='21i4'>
<button class="btn btn-blue 22i4" onclick="window.HL();">Hide Leaderboard!</button>
<button class="btn btn-blue 23i4" onclick="window.resource();">Hide Resources</button>
<br class='24i4'><br class='25i4'>
<button class="btn btn-blue 26i4" onclick="window.respawn();">Hide Respawn</button>
<br class='i6'>
<button class="btn btn-blue 0i6" style="width: 45%;" onclick="window.PlusBase();">Old + Base</button>
<button class="btn btn-blue 1i6" style="width: 45%;" onclick="window.ThreeEntBase();">3 Ent Base</button>
<button class="btn btn-blue 2i6" style="width: 45%;" onclick="window.XBase();">Modded 8k X Base</button>
<button class="btn btn-blue 3i6" style="width: 45%;" onclick="window.BryanSmithBase();">Bryan Smith 8k X Base</button>
<button class="btn btn-blue 4i6" style="width: 45%;" onclick="window.CornerBase1();">Corner Base</button>
<button class="btn btn-blue 5i6" style="width: 45%;" onclick="window.ScoreBase();">50M Score Base</button>
<button class="btn btn-blue 6i6" style="width: 45%;" onclick="window.UpdatedPlus();">New + Base</button>
<button class="btn btn-blue 7i6" style="width: 45%;" onclick="window.BuildArtemisBase();">15k X Base</button>
<button class="btn btn-blue 8i6" style="width: 45%;" onclick="window.WrBase();">Sirr0m X Base</button>
<button class="btn btn-blue 9i6" style="width: 45%;" onclick="window.ARTEMISXBASE();">Artemis Base</button>
<button class="btn btn-blue 10i6" style="width: 45%;" onclick="window.AxeBase();">Axe Base</button>
<button class="btn btn-blue 11i6" style="width: 45%;" onclick="window.DRC();">Deathrain's Corner Base</button>
<button class="btn btn-blue 12i6" style="width: 45%;" onclick="window.goodbase();">Bryan Smith Score Base</button>
<button class="btn btn-blue 13i6" style="width: 45%;" onclick="window.SmallCornerBase();">Small Corner Base</button>
<button class="btn btn-blue 14i6" style="width: 45%;" onclick="window.ModeddJaYTXBase();">Modedd JaYT X Base</button>
<button class="btn btn-blue 15i6" style="width: 45%;" onclick="window.SmallBase();">Small + Base</button>
<button class="btn btn-blue 16i6" style="width: 45%;" onclick="window.ARTEMISXBASE2();">ARTEMIS X Base</button>
<button class="btn btn-blue 17i6" style="width: 45%;" onclick="window.cornerbase();">Smallest Corner Base</button>
<br class='i7'>
<h2 class="0i7">My Discord: JaYT.#3569</h2>
<button id="serverCrasher" class="btn btn-blue 1i7" style="width: 45%;">My YouTube JaYT.</button>
</div>
`;

displayAllToNone();

let Main1Keys = true;
let Main2Keys = true;
let Main3Keys = true;
let lock = false;
let upgradeAll = false;
let AHRC = false;
let autobow = false;
let autobomb = false;
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

document.getElementsByClassName("1i7")[0].addEventListener('click', function() {
   window.location = "https://www.youtube.com/channel/UCHbSHt61542PNbY9PoEU4Tg";
   game.ui.onServerShuttingDown();
});

window.count = 0;

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

window.respawn = () => {
    let respawn = document.getElementsByClassName("hud-respawn")[0];
    if(respawn.style.display === "block" || respawn.style.display === "") {
        document.getElementsByClassName("26i4")[0].className = "btn btn-blue 26i4";
        document.getElementsByClassName("26i4")[0].innerText = "Show Respawn";
        respawn.style.display = "none";
    } else {
        document.getElementsByClassName("26i4")[0].className = "btn btn-blue 26i4" ;
        document.getElementsByClassName("26i4")[0].innerText = "Hide Respawn";
        respawn.style.display = "block";
    };
};

window.resource = () => {
    let times20 = document.getElementsByClassName("hud-resources")[0];
    if(times20.style.display === "block" || times20.style.display === "") {
        document.getElementsByClassName("23i4")[0].className = "btn btn-red 23i4";
        document.getElementsByClassName("23i4")[0].innerText = "Show Resources";
        times20.style.display = "none";
    } else {
        document.getElementsByClassName("23i4")[0].className = "btn btn-blue 23i4" ;
        document.getElementsByClassName("23i4")[0].innerText = "Hide Resources";
        times20.style.display = "block";
    };
};

window.HL = () => {
    let lb = document.getElementsByClassName("hud-top-right")[0];
    if(lb.style.display === "block" || lb.style.display === "") {
        document.getElementsByClassName("22i4")[0].className = "btn btn-red 22i4";
        document.getElementsByClassName("22i4")[0].innerText = "Show Leaderboard";
        lb.style.display = "none";
    } else {
        document.getElementsByClassName("22i4")[0].className = "btn btn-blue 22i4" ;
        document.getElementsByClassName("22i4")[0].innerText = "Hide LeaderBoard";
        lb.style.display = "block";
    };
};
document.getElementsByClassName("19i4")[0].addEventListener('click', function() {
    let dingdong = document.getElementsByClassName("hud-top-center")[0];
    if(dingdong.style.display === "block" || dingdong.style.display === "") {
        document.getElementsByClassName("19i4")[0].className = "btn btn-red 19i4";
        document.getElementsByClassName("19i4")[0].innerText = "Show Toolbar";
        dingdong.style.display = "none";
    } else {
        document.getElementsByClassName("19i4")[0].className = "btn btn-blue 19i4" ;
        document.getElementsByClassName("19i4")[0].innerText = "Hide Toolbar";
        dingdong.style.display = "block";
    };
});
document.getElementsByClassName("18i4")[0].addEventListener('click', function() {
    window.togglechat = !window.togglechat;
    document.getElementsByClassName("18i4")[0].className = "btn btn-blue 18i4";
    document.getElementsByClassName("18i4")[0].innerText = "Hide Chat";
    document.getElementsByClassName("hud-chat-messages")[0].style.display = "block";
    if (window.togglechat) {
        document.getElementsByClassName("18i4")[0].className = "btn btn-red 18i4";
        document.getElementsByClassName("18i4")[0].innerText = "Show Chat";
        document.getElementsByClassName("hud-chat-messages")[0].style.display = "none";
    }
})

document.getElementsByClassName("15i4")[0].addEventListener('click', function() {
    let VEGITO = document.getElementsByClassName("hud-map")[0];
    if(VEGITO.style.display === "block" || VEGITO.style.display === "") {
        document.getElementsByClassName("15i4")[0].innerText = "Show Map";
        VEGITO.style.display = "none";
    } else {
        document.getElementsByClassName("15i4")[0].innerText = "Hide Map";
        VEGITO.style.display = "block";
    };
});


document.getElementsByClassName("13i4")[0].addEventListener('click', function() {
    window.healthbar = !window.healthbar;
    document.getElementsByClassName("13i4")[0].innerText = "Hide Healthbar";
    document.getElementsByClassName("hud-health-bar")[0].style.display = "block";
    if (window.healthbar) {
        document.getElementsByClassName("13i4")[0].innerText = "Show Healthbar";
        document.getElementsByClassName("hud-health-bar")[0].style.display = "none";
    }
})

window.trollge = () => {
    let trollers = document.getElementsByClassName("hud-toolbar")[0];
    if(trollers.style.display === "block" || trollers.style.display === "") {
        document.getElementsByClassName("14i4")[0].innerText = "Hide Inventory";
        trollers.style.display = "none";
    } else {
        document.getElementsByClassName("14i4")[0].innerText = "Show Inventory";
        trollers.style.display = "block";
    };
};

document.getElementsByClassName("6i4")[0].addEventListener('click', function() {
   game.script.grouping.hide();
   game.script.grouping.show();
});

let grids = false
document.getElementsByClassName("6i4")[0].addEventListener('click', function() {
    grids = !grids;
    document.getElementsByClassName("6i4")[0].innerText = "Hide Grids!";
    if (grids) {
        document.getElementsByClassName("6i4")[0].innerText = "Show Grids!";
    }
});

document.getElementsByClassName('0i4')[0].addEventListener('click', () => {
    let on = game.renderer.ground.isVisible;
    if (on) {
        game.renderer.ground.setVisible(!on);
        document.getElementsByClassName('0i4')[0].innerText = 'Hide Ground';
    } else if (!on) {
        game.renderer.ground.setVisible(!on);
        document.getElementsByClassName('0i4')[0].innerText = 'Show Ground';
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
        document.getElementsByClassName('2i4')[0].innerText = 'Hide Npcs';
    } else if (!on) {
        game.renderer.npcs.setVisible(!on);
        document.getElementsByClassName('2i4')[0].innerText = 'Show Npcs';
    };
});

document.getElementsByClassName('5i4')[0].addEventListener('click', () => {
    let on = game.renderer.scenery.isVisible;
    if (on) {
        game.renderer.scenery.setVisible(!on);
        document.getElementsByClassName('5i4')[0].innerText = 'Hide Environment';
    } else if (!on) {
        game.renderer.scenery.setVisible(!on);
        document.getElementsByClassName('5i4')[0].innerText = 'Show Environment';
    };
});

document.getElementsByClassName('9i4')[0].addEventListener('click', () => {
    let on = game.renderer.scene.isVisible;
    if (on) {
        game.renderer.scene.setVisible(!on);
        document.getElementsByClassName('9i4')[0].innerText = 'Hide Scene';
    } else if (!on) {
        game.renderer.scene.setVisible(!on);
        document.getElementsByClassName('9i4')[0].innerText = 'Show Scene';
    };
});

document.getElementsByClassName('10i4')[0].addEventListener('click', () => {
    if (stopped) {
        game.start();
        document.getElementsByClassName('10i4')[0].innerText = 'Start Game';
    } else if (!stopped) {
        game.stop();
        document.getElementsByClassName('10i4')[0].innerText = 'Stop Game';
    };
    stopped = !stopped;
});

//Auto Build
function $(classname) {
    let element = document.getElementsByClassName(classname)
    if (element.length === 1) {
        return element[0]
    } else {
        return element
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    let value = this.getItem(key);
    return value && JSON.parse(value);
}
let sellBombs;
let Auto = {}
let Auto2 = {}
let EXTREME = {}
Auto.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
EXTREME.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
Auto2.GetGoldStash = function() {
    let entities = Game.currentGame.ui.buildings
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        let obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}
function getGoldStash() {
    var entities = Game.currentGame.world.entities
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue
        var obj = entities[uid]
        if (obj.fromTick.model == "GoldStash") {
            return obj
        }
    }
}
Auto.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
Auto.PlaceBulding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
EXTREME.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
Auto2.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
    sellBombs()
    upgradeAll()
    var buildings = Game.currentGame.ui.buildings
    Object.keys(buildings).forEach(key => {
        const building = buildings[key]
        if(["BombTower" || "Wall"].indexOf(building.type) >= 0) {
            delete buildings[key]
        }})
}
function deathrain(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
function JaYT(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}

window.cornerbase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 168, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'ArrowTower', 180);
            clearInterval(waitForGoldStash)
        }
    }, 150)
    }

window.ARTEMISXBASE2 = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -240, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -336, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -528, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -528, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -144, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 528, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -240, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -576, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -624, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 528, 'MeleeTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -240, 'MeleeTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -432, 'MeleeTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 624, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -576, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -48, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 0, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        };
    }, 50)
    }
window.SmallBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'MeleeTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'MeleeTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'MeleeTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'MeleeTower', 0);
            //Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Wall', 0);
            //Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Wall', 0);
            //Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        };
    }, 50)
    }


window.ModeddJaYTXBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -528, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -192, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -384, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -624, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 528, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'CannonTower', 0);
            uto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 528, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -384, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -480, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -48, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 48, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -624, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -576, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -528, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -336, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -240, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 0);
            clearInterval(waitForGoldStash)
        };
    }, 50)
    }

window.PlusBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 0, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 432, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + -144, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -96, 'BombTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -384, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 144, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 528, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 480, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -240, 'MagicTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -288, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -288, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -576, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -504, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -504, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -408, 'Wall', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -168, 'Wall', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -120, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            clearInterval(waitForGoldStash)
        };
    }, 100)
    }
window.UpdatedPlus = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + -144, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -144, 'GoldMine', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 96, 'GoldMine', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -144, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -96, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -480, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -528, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -528, 'CannonTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -576, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -624, stashPosition.y + 432, 'CannonTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -432, 'ArrowTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -48, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + -144, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 576, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 480, 'ArrowTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -672, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + -432, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + -528, stashPosition.y + -384, 'MagicTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -576, 'MagicTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -432, 'MagicTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -624, 'MagicTower', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 648, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 312, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 456, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -648, stashPosition.y + 264, 'Wall', 0);
            deathrain(stashPosition.x + -744, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + -696, stashPosition.y + 408, 'Wall', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + 504, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 552, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 600, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
            deathrain(stashPosition.x + -600, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + -456, 'Wall', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -288, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -480, 'BombTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -336, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -192, 'BombTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -240, 'BombTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + -384, 'BombTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 336, 'BombTower', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 120, 'Wall', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -264, 'Wall', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -360, 'Wall', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 96, 'BombTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 192, 'BombTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 288, 'BombTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 384, 'BombTower', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 360, 'Wall', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + -600, 'Wall', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -648, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -600, 'Wall', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -552, 'Wall', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -456, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -360, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -312, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -264, 'SlowTrap', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -408, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + 72, 'Door', 0);
            clearInterval(waitForGoldStash)
        };
    }, 100)
    }

window.goodbase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 240, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 336, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 240, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 336, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 144, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 240, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 144, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 192, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 0, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -96, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -240, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -144, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -240, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -336, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -432, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -336, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -144, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -240, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -336, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -240, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -432, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -336, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 432, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 432, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 0, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 0, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 0, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -264, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -264, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 264, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 264, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'Harvester', 180);
        }
    }, 0)
    }

window.SmallCornerBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'SlowTrap', 180);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 168, 'SlowTrap', 180);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 180);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 312, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 576, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 528, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 360, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 360, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 360, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 48, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -48, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -144, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'Harvester', 180);
            clearInterval(waitForGoldStash)
        }
    }, 150)
    }
window.ThreeEntBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            deathrain(stashPosition.x + -96, stashPosition.y + 0, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 0, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + 96, 'CannonTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 0, 'MagicTower', 0);
            deathrain(stashPosition.x + -336, stashPosition.y + 96, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 192, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + -384, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 384, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 432, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 192, 'ArrowTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + 336, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + 288, 'CannonTower', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 168, 'Wall', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + 144, 'GoldMine', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 240, 'GoldMine', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 240, 'GoldMine', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + 144, 'ArrowTower', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + 48, 'ArrowTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + 144, 'CannonTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 48, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 48, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 144, 'MagicTower', 0);
            deathrain(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 336, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 384, 'ArrowTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 432, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + 480, 'MagicTower', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 528, 'MagicTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + 528, 'GoldMine', 0);
            deathrain(stashPosition.x + 480, stashPosition.y + 432, 'GoldMine', 0);
            deathrain(stashPosition.x + 576, stashPosition.y + 432, 'GoldMine', 0);
            deathrain(stashPosition.x + 192, stashPosition.y + -96, 'ArrowTower', 0);
            deathrain(stashPosition.x + 240, stashPosition.y + -192, 'ArrowTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -96, 'CannonTower', 0);
            deathrain(stashPosition.x + 336, stashPosition.y + -192, 'CannonTower', 0);
            deathrain(stashPosition.x + 384, stashPosition.y + -96, 'MagicTower', 0);
            deathrain(stashPosition.x + 432, stashPosition.y + -192, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -288, 'ArrowTower', 0);
            deathrain(stashPosition.x + -288, stashPosition.y + -144, 'MagicTower', 0);
            deathrain(stashPosition.x + -240, stashPosition.y + -240, 'CannonTower', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -336, 'CannonTower', 0);
            deathrain(stashPosition.x + -144, stashPosition.y + -240, 'CannonTower', 0);
            deathrain(stashPosition.x + 0, stashPosition.y + -144, 'ArrowTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + -432, 'CannonTower', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -336, 'ArrowTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 144, stashPosition.y + -528, 'MagicTower', 0);
            deathrain(stashPosition.x + 288, stashPosition.y + -384, 'GoldMine', 0);
            deathrain(stashPosition.x + -192, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + -240, 'CannonTower', 0);
            deathrain(stashPosition.x + -96, stashPosition.y + -144, 'CannonTower', 0);
            deathrain(stashPosition.x + 48, stashPosition.y + -240, 'GoldMine', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -24, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -120, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -72, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 216, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 648, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + 552, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 648, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + 696, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + 600, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 216, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 264, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 264, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 312, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 408, 'Door', 0);
            deathrain(stashPosition.x + -552, stashPosition.y + 456, 'Door', 0);
            deathrain(stashPosition.x + -216, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -264, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            deathrain(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
            deathrain(stashPosition.x + -312, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 504, stashPosition.y + -216, 'Door', 0);
            deathrain(stashPosition.x + 456, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 408, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -312, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -360, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -264, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + -24, stashPosition.y + -600, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -552, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -504, 'Door', 0);
            deathrain(stashPosition.x + 216, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 264, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 312, stashPosition.y + -456, 'Door', 0);
            deathrain(stashPosition.x + 360, stashPosition.y + -408, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 168, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -168, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + -72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 24, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 24, 'Door', 0);
            deathrain(stashPosition.x + 120, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 72, 'Door', 0);
            deathrain(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            deathrain(stashPosition.x + 96, stashPosition.y + -48, 'Harvester', 0);
            deathrain(stashPosition.x + -48, stashPosition.y + 96, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }
window.XBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + -24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + -576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + -576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 0, stashPosition.y + -672, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -264, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + -48, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -672, stashPosition.y + 0, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + -144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -312, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 216, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -744, stashPosition.y + -24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -744, stashPosition.y + 24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 144, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 72, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 72, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 312, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 24, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 72, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -576, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -480, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -384, stashPosition.y + 144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + 264, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + 216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 624, stashPosition.y + 48, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -48, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 672, stashPosition.y + -48, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + 384, stashPosition.y + -144, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 480, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 480, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + -48, stashPosition.y + 576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 144, stashPosition.y + 576, 'ArrowTower', 0)
            Auto.PlaceBulding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0)
            Auto.PlaceBulding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0)
            Auto.PlaceBulding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 600, stashPosition.y + -216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -216, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 744, stashPosition.y + -72, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 744, stashPosition.y + -24, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -24, stashPosition.y + -744, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 24, stashPosition.y + -744, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -600, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -648, 'Wall', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + -216, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 264, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0)
            Auto.PlaceBulding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0)
        }
    }, 150)
    }
window.BryanSmithBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
        }
    }, 150)
    }

window.CornerBase1 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "Harvester", 100);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "Harvester", 100)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 96, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 144, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 336, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 192, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 288, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 432, "GoldMine", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 384, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 528, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 192, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 480, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 288, "ArrowTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 624, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 192, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 720, stashPosition.y + 192, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 288, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 480, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x, stashPosition.y + 576, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 720, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 672, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 672, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 624, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 528, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 576, "BombTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 288, "BombTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 576, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 408, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 768, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 288, "CannonTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 384, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 480, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 384, "MagicTower", 0)
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 456, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 696, "Door", 0)
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 744, "Door", 0)
        }
    }, 150)
    }
window.ScoreBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + 528, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 96, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 96, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 624, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 528, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -768, stashPosition.y + 288, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -768, stashPosition.y + 384, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 456, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 744, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 696, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -48, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -48, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -144, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -144, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 0, 'Harvester', 0);
            clearInterval(waitForGoldStash)
        }
    }, 100)
    }
window.dhrBase2 = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 288, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 192, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 288, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 384, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 264, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 216, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 168, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 168, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 312, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 264, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 576, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 528, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 624, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 672, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 528, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'Harvester', 0);
        }
    },150)
    }
window.BuildArtemisBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 0);
        }
    }, 0)
    }
window.WrBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 24, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 168, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 240, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 576, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -480, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -576, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 528, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -336, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -672, stashPosition.y + -48, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -288, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -528, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -432, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -240, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -432, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -624, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 624, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 432, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 336, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 432, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 120, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Wall', 0);
        }
    }, 0)
    }
window.ARTEMISXBASE = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = Auto.GetGoldStash();
            if (stash == undefined) return
            let stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 240, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 240, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -48, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -240, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -240, 'GoldMine', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 336, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 432, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 528, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -48, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 528, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 624, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 624, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -336, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 432, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -216, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -264, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -360, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -408, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -312, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 144, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -528, 'BombTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -528, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -552, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -624, 'MagicTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -624, 'CannonTower', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -648, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 696, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 360, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 312, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 744, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + 48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -624, stashPosition.y + -48, 'ArrowTower', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 264, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 216, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 168, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 24, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 120, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -432, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 456, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 504, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 408, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 600, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -504, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 840, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + -600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + -600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + -648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + -504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 504, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -600, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 456, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 408, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 360, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -744, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -792, stashPosition.y + 312, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -216, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -840, stashPosition.y + -264, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -504, stashPosition.y + 600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 552, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + 504, stashPosition.y + 600, 'SlowTrap', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 600, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -456, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 648, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 696, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 744, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 792, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -552, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + -552, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -432, 'Harvester', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Door', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 120, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -72, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 24, 'Wall', 0);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 72, 'Wall', 0);
        }
    }, 0)
    }
window.AxeBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -96, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -96, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -576, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -552, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -552, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -552, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -552, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 144, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 144, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 144, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 240, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 48, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 48, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 144, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 240, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 336, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 336, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 336, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 432, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 432, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 432, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 432, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 528, 'MeleeTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 528, 'MeleeTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 504, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 504, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 408, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 408, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -192, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 144, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 144, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 144, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 240, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 240, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 240, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 336, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -576, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 144, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -192, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 240, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -624, 'MeleeTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -192, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'MagicTower', 180);
            clearInterval(waitForGoldStash)
        }
    }, 150)
    }
window.DRC = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = getGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.fromTick.position.x,
                y: stash.fromTick.position.y
            }
            clearInterval(waitForGoldStash)
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 384, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 0, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 480, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 576, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 672, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 768, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 0, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 192, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 720, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 0, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 720, stashPosition.y + 96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 720, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 0, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 576, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 672, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 816, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 768, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 672, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 672, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 384, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 480, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 576, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 480, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 480, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 384, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 576, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 480, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 384, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 624, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 528, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 288, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 288, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 192, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 384, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 384, 'GoldMine', 180);
            Auto.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 192, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 384, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 480, 'BombTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 72, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 120, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 168, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 168, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 456, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 456, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 816, stashPosition.y + 288, 'MagicTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 720, stashPosition.y + 288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 288, 'ArrowTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 288, 'CannonTower', 180);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 264, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 312, 'Wall', 180);
            Auto.PlaceBuilding(stashPosition.x + 792, stashPosition.y + 120, 'SlowTrap', 180);
            Auto.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 792, 'SlowTrap', 180);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 552, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 552, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 552, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 600, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 600, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 648, 'Door', 180);
            Auto.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, 'Harvester', 180);
            Auto.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, 'Harvester', 180);
            clearInterval(waitForGoldStash)
        }
    }, 150)
    }

game.network.addPacketHandler = function(event, callback) {
    game.network.emitter.on(packets[event], callback);
};

game.network.emitter.removeListener('PACKET_ENTITY_UPDATE', game.network.emitter._events.PACKET_ENTITY_UPDATE);

game.network.addPacketHandler(0, function(e) {
    game.network.sendRpc({
        name: "BuyItem",
        itemName: "HealthPotion",
        tier: 1
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
                }, 10);
                for (let uid in entities) {
                    if (!entities.hasOwnProperty(uid)) continue;
                    let obj = entities[uid];
                    game.network.sendRpc({
                        name: "CollectHarvester",
                        uid: obj.fromTick.uid
                    },10);
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.07
                        },10);
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.11
                        },10);
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.17
                        },10);
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.22
                        },10);
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.25
                        },10);
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.28
                        },10);
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.42
                        },10);
                    }
                    if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
                        game.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.65
                        },10);
                    }
                }
            }
        }
        if (window.autobow) {
            game.network.sendInput({space: 0})
            game.network.sendInput({space: 1})
        }
      if (window.autobomb) {
            game.network.sendInput({space: 0})
            game.network.sendInput({space: 1})
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
                },50);
            };
        };
        if (revive) {
            if (!window.reviver) {
                window.reviver = true;
                setTimeout(() => {
                    window.reviver = false;
                },50);
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
                }, 500)
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
                },10);
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
                        },50)
                        healPlayer();
                    }
                }
            }
        }
        if (heal) {
            if (myPet) {
                let petHealth = (myPet.health / myPet.maxHealth) * 100;
                if (petHealth <= 50) {
                    if (!petTimeout) {
                        petTimeout = true;

                        setTimeout(() => {
                            petTimeout = false;
                        },50);

                        game.network.sendRpc({
                            name: "BuyItem",
                            itemName: "PetHealthPotion",
                            tier: 1
                        });

                        game.network.sendRpc({
                            name: "EquipItem",
                            itemName: "PetHealthPotion",
                            tier: 1
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

//spam chat
var isSpamming = 0;
function pauseChatSpam(e) {
    if (!isSpamming) {
        if (e !== "") {
            window.spammer = setInterval(() => {
                game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: e});
            }, 100);
        };
    } else if (isSpamming) {
        clearInterval(window.spammer);
    };
    isSpamming = !isSpamming;
};
document.querySelector('#togglespmch').addEventListener('click', function () {
    pauseChatSpam(document.querySelector('#spammsg').value)
    let spamtoggle = document.querySelector('#spamtoggle')
    this.innerText = isSpamming ? "Disable Spam Chat" : "Enable Spam Chat"
    if (isSpamming) {
        this.classList.add("btn-red"); this.classList.remove("btn-blue");
    } else {
        this.classList.add("btn-blue"); this.classList.remove("btn-red");
    };
});

document.getElementsByClassName("32i2")[0].addEventListener('click', function() {
    window.shouldStartScript = !window.shouldStartScript;
    document.getElementsByClassName("32i2")[0].innerText = "Active 4 Player Trick";
    if (window.shouldStartScript) {
        document.getElementsByClassName("32i2")[0].innerText = "!(Active 4 Player Trick)";
    }
})

document.getElementsByClassName("13i2")[0].addEventListener('click', function() {
    window.LKey = !window.LKey;
    //LKeyWithTimeouts();
    document.getElementsByClassName("13i2")[0].innerText = "Enable L Key!";
    if (window.LKey) {
        document.getElementsByClassName("13i2")[0].innerText = "Disable L Key!";
    }
})


let sellUid = []
function sellAllByType(type) {
    let buildings = Object.values(game.ui.buildings)
    for (let i = 0; i < buildings.length; i++){
        if (Object.values(Object.values(game.ui.buildings)[i])[2] == type){
            sellUid.push(Object.values(Object.values(game.ui.buildings)[i])[4])
        }
    }
    let sellInterval = setInterval(() => {
        if (sellUid.length > 0 && game.ui.playerPartyCanSell) {
            game.network.sendRpc({
                name: "DeleteBuilding",
                uid: parseInt(sellUid.shift())
            })
        } else {
            clearInterval(sellInterval)
        }
    },150);
}

document.getElementById("sellall").addEventListener('click', function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete all towers?", 1e4, function() {
        let buildings = Object.values(game.ui.buildings)
        for (let i = 0; i < buildings.length; i++){
            if (Object.values(Object.values(game.ui.buildings)[i])[2] != "GoldStash"){
                sellUid.push(Object.values(Object.values(game.ui.buildings)[i])[4])
            }
        }
        let sellInterval = setInterval(() => {
            if (game.ui.playerPartyCanSell === false){
                game.ui.components.PopupOverlay.showHint("You Don't Have Sell!");
            }
            if (sellUid.length > 0 && game.ui.playerPartyCanSell) {
                game.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: parseInt(sellUid.shift())
                })
            } else {
                clearInterval(sellInterval)
            }
        },150);
    })
})
document.getElementById("sellwall").addEventListener('click', () => { sellAllByType("Wall") });
document.getElementById("selldoor").addEventListener('click', () => { sellAllByType("Door") });
document.getElementById("selltrap").addEventListener('click', () => { sellAllByType("SlowTrap") });
document.getElementById("sellarrow").addEventListener('click', () => { sellAllByType("ArrowTower") });
document.getElementById("sellcannon").addEventListener('click', () => { sellAllByType("CannonTower") });
document.getElementById("sellmelee").addEventListener('click', () => { sellAllByType("MeleeTower") });
document.getElementById("sellbomb").addEventListener('click', () => { sellAllByType("BombTower") });
document.getElementById("sellmagic").addEventListener('click', () => { sellAllByType("MagicTower") });
document.getElementById("sellmines").addEventListener('click', () => { sellAllByType("GoldMine") });
document.getElementById("sellharvester").addEventListener('click', () => { sellAllByType("Harvester") });

document.getElementsByClassName("24i5")[0].addEventListener('click', function() {
   let mousePs = {};
   function placeWall(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
   }

   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Wall;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
         for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
               return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
         }
         cellAverages.x = cellAverages.x / cellIndexes.length;
         cellAverages.y = cellAverages.y / cellIndexes.length;
         var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
         }
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
      }
   });
});

document.getElementsByClassName("25i5")[0].addEventListener('click', function() {
   let mousePs = {};
   function placeWall(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
   }
   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Wall;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
         for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
               return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
         }
         cellAverages.x = cellAverages.x / cellIndexes.length;
         cellAverages.y = cellAverages.y / cellIndexes.length;
         var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
         }
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
         }
   });
});
document.getElementsByClassName("26i5")[0].addEventListener('click', function() {
   let mousePs = {};
   function placeWall(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
   }
   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Wall;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
         for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
               return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
         }
         cellAverages.x = cellAverages.x / cellIndexes.length;
         cellAverages.y = cellAverages.y / cellIndexes.length;
         var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
         }
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
         }
   });
});
document.getElementsByClassName("27i5")[0].addEventListener('click', function() {
   let mousePs = {};
   function placeWall(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
   }
   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Wall;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
         for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
               return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
         }
         cellAverages.x = cellAverages.x / cellIndexes.length;
         cellAverages.y = cellAverages.y / cellIndexes.length;
         var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
         }
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
            placeWall(gridPos.x - 48, gridPos.y + 48);
            placeWall(gridPos.x, gridPos.y + 48);
            placeWall(gridPos.x + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y + 48)
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48, gridPos.y);
            placeWall(gridPos.x - 48, gridPos.y);
            placeWall(gridPos.x, gridPos.y);
            placeWall(gridPos.x + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48, gridPos.y)
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48);
            placeWall(gridPos.x, gridPos.y - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48)
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
            placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
         }
   });
});
document.getElementsByClassName("28i5")[0].addEventListener('click', function() {
   let mousePs = {};
   function placeWall(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Wall", yaw: 0 });
   }
   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Wall;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
         for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
               return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
         }
         cellAverages.x = cellAverages.x / cellIndexes.length;
         cellAverages.y = cellAverages.y / cellIndexes.length;
         var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
         }
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48 );
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 , gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y);
        placeWall(gridPos.x + 48 + 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y - 48 - 48);
        placeWall(gridPos.x, gridPos.y + 48 + 48);
        placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
        placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y - 48);
        placeWall(gridPos.x + 48, gridPos.y + 48);
        placeWall(gridPos.x - 48, gridPos.y + 48);
        placeWall(gridPos.x + 48, gridPos.y);
        placeWall(gridPos.x - 48, gridPos.y);
        placeWall(gridPos.x, gridPos.y + 48);
         }
   });
});
window.wall3x3 = true
window.wall3x3 = false
window.wall5x5 = true
window.wall5x5 = false
window.wall7x7 = true
window.wall7x7 = false
window.wall9x9 = true
window.wall9x9 = false
window.wall20x20 = true
window.wall20x20 = false
window.door3x3 = true
window.door3x3 = false
window.door5x5 = true
window.door5x5 = false

//enable-disable is walls building
document.getElementsByClassName("24i5")[0].addEventListener('click', function() {
    window.wall3x3 = !window.wall3x3;
    document.getElementsByClassName("24i5")[0].className = "btn btn-blue 24i5";
    document.getElementsByClassName("24i5")[0].innerText = "Enable Walls 3x3";
    if (window.wall3x3) {
        document.getElementsByClassName("24i5")[0].className = "btn btn-red 24i5";
        document.getElementsByClassName("24i5")[0].innerText = "Disable Walls 3x3";
    }
});

document.getElementsByClassName("25i5")[0].addEventListener('click', function() {
    window.wall5x5 = !window.wall5x5;
    document.getElementsByClassName("25i5")[0].className = "btn btn-blue 25i5";
    document.getElementsByClassName("25i5")[0].innerText = "Enable Walls 5x5";
    if (window.wall5x5) {
        document.getElementsByClassName("25i5")[0].className = "btn btn-red 25i5";
        document.getElementsByClassName("25i5")[0].innerText = "Disable Walls 5x5";
    }
});

document.getElementsByClassName("26i5")[0].addEventListener('click', function() {
    window.wall7x7 = !window.wall7x7;
    document.getElementsByClassName("26i5")[0].className = "btn btn-blue 26i5";
    document.getElementsByClassName("26i5")[0].innerText = "Enable Walls 7x7";
    if (window.wall7x7) {
        document.getElementsByClassName("26i5")[0].className = "btn btn-red 26i5";
        document.getElementsByClassName("26i5")[0].innerText = "Disable Walls 7x7";
    }
});

document.getElementsByClassName("27i5")[0].addEventListener('click', function() {
    window.wall9x9 = !window.wall9x9;
    document.getElementsByClassName("27i5")[0].className = "btn btn-blue 27i5";
    document.getElementsByClassName("27i5")[0].innerText = "Enable Walls 9x9";
    if (window.wall9x9) {
        document.getElementsByClassName("27i5")[0].className = "btn btn-red 27i5";
        document.getElementsByClassName("27i5")[0].innerText = "Disable Walls 9x9";
    }
});

document.getElementsByClassName("28i5")[0].addEventListener('click', function() {
    window.wall20x20 = !window.wall20x20;
    document.getElementsByClassName("28i5")[0].className = "btn btn-blue 28i5";
    document.getElementsByClassName("28i5")[0].innerText = "Enable Walls 20x20";
    if (window.wall20x20) {
        document.getElementsByClassName("28i5")[0].className = "btn btn-red 28i5";
        document.getElementsByClassName("28i5")[0].innerText = "Disable Walls 20x20";
    }
});

//enable-disable is door building
document.getElementsByClassName("23i")[0].addEventListener('click', function() {
    window.door3x3 = !window.door3x3;
    document.getElementsByClassName("23i")[0].className = "btn btn-blue 23i";
    document.getElementsByClassName("23i")[0].innerText = "Enable Doors 3x3";
    if (window.door3x3) {
        document.getElementsByClassName("23i")[0].className = "btn btn-red 23i";
        document.getElementsByClassName("23i")[0].innerText = "Disable Doors 3x3";
    }
});

document.getElementsByClassName("23i")[0].addEventListener('click', function() {
   let mousePs = {};
   function placeDoor(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Door", yaw: 0 });
   }

   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Door") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Door;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
         for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
               return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
         }
         cellAverages.x = cellAverages.x / cellIndexes.length;
         cellAverages.y = cellAverages.y / cellIndexes.length;
         var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
         }
        placeDoor(gridPos.x, gridPos.y);
        placeDoor(gridPos.x + 48, gridPos.y);
        placeDoor(gridPos.x, gridPos.y + 48);
        placeDoor(gridPos.x - 48, gridPos.y);
        placeDoor(gridPos.x, gridPos.y - 48);
        placeDoor(gridPos.x - 48, gridPos.y + 48);
        placeDoor(gridPos.x + 48, gridPos.y - 48);
        placeDoor(gridPos.x + 48, gridPos.y + 48);
        placeDoor(gridPos.x - 48, gridPos.y - 48);
      }
   });
});

document.getElementsByClassName("24i")[0].addEventListener('click', function() {
    window.door5x5 = !window.door5x5;
    document.getElementsByClassName("24i")[0].className = "btn btn-blue 24i";
    document.getElementsByClassName("24i")[0].innerText = "Enable Doors 5x5";
    if (window.door5x5) {
        document.getElementsByClassName("24i")[0].className = "btn btn-red 24i";
        document.getElementsByClassName("24i")[0].innerText = "Disable Doors 5x5";
    }
});

document.getElementsByClassName("24i")[0].addEventListener('click', function() {
   let mousePs = {};
   function placeDoor(x, y) {
      game.network.sendRpc({ name: 'MakeBuilding', x: x, y: y, type: "Door", yaw: 0 });
   }

   document.addEventListener('mousemove', e => {
      mousePs = { x: e.clientX, y: e.clientY };
      if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Door") {
         var buildingSchema = game.ui.getBuildingSchema();
         var schemaData = buildingSchema.Door;
         var world = game.world;
         var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
         var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, { width: schemaData.gridWidth, height: schemaData.gridHeight });
         var cellSize = world.entityGrid.getCellSize();
         var cellAverages = { x: 0, y: 0 };
         for (var i in cellIndexes) {
            if (!cellIndexes[i]) {
               return false;
            }
            var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
         }
         cellAverages.x = cellAverages.x / cellIndexes.length;
         cellAverages.y = cellAverages.y / cellIndexes.length;
         var gridPos = {
            x: cellAverages.x * cellSize + cellSize / 2,
            y: cellAverages.y * cellSize + cellSize / 2
         }
        placeDoor(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
        placeDoor(gridPos.x - 48, gridPos.y + 48 + 48);
        placeDoor(gridPos.x, gridPos.y + 48 + 48);
        placeDoor(gridPos.x + 48, gridPos.y + 48 + 48);
        placeDoor(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
        placeDoor(gridPos.x - 48 - 48, gridPos.y + 48);
        placeDoor(gridPos.x - 48, gridPos.y + 48);
        placeDoor(gridPos.x, gridPos.y + 48);
        placeDoor(gridPos.x + 48, gridPos.y + 48);
        placeDoor(gridPos.x + 48 + 48, gridPos.y + 48);
        placeDoor(gridPos.x - 48 - 48, gridPos.y);
        placeDoor(gridPos.x - 48, gridPos.y);
        placeDoor(gridPos.x, gridPos.y);
        placeDoor(gridPos.x + 48, gridPos.y);
        placeDoor(gridPos.x + 48 + 48, gridPos.y);
        placeDoor(gridPos.x - 48 - 48, gridPos.y - 48);
        placeDoor(gridPos.x - 48, gridPos.y - 48);
        placeDoor(gridPos.x, gridPos.y - 48);
        placeDoor(gridPos.x + 48, gridPos.y - 48);
        placeDoor(gridPos.x + 48 + 48, gridPos.y - 48);
        placeDoor(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
        placeDoor(gridPos.x - 48, gridPos.y - 48 - 48);
        placeDoor(gridPos.x, gridPos.y - 48 - 48);
        placeDoor(gridPos.x + 48, gridPos.y - 48 - 48);
        placeDoor(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
      }
   });
});

window.ADB = () => {
    let hno = document.getElementsByClassName("hud-day-night-overlay")[0];
    if(hno.style.display === "block" || hno.style.display === "" ) {
        document.getElementsByClassName("23i5")[0].className = "btn btn-red 23i5";
        document.getElementsByClassName("23i5")[0].innerText = "Disable Always Day Brightness";
        hno.style.display = "none";
    } else {
        document.getElementsByClassName("23i5")[0].className = "btn btn-blue 23i5" ;
        document.getElementsByClassName("23i5")[0].innerText = "Enable Always Day Brightness";
        hno.style.display = "block";
    };
};

let map = false
let shouldtrack = false
document.getElementsByClassName("31i2")[0].addEventListener('click', function() {
    shouldtrack = !shouldtrack;
    document.getElementsByClassName("31i2")[0].className = "btn btn-blue 31i2";
    document.getElementsByClassName("31i2")[0].innerText = "Enable Map Tracker!";
    if (shouldtrack) {
        document.getElementsByClassName("31i2")[0].className = "btn btn-red 31i2";
        document.getElementsByClassName("31i2")[0].innerText = "Disable Map Tracker!";
    }
});
document.getElementsByClassName("31i2")[0].addEventListener('click', function() {
Game.currentGame.network.addEntityUpdateHandler(() => {
    var map = document.getElementById("hud-map");
    if (game.world.inWorld){
        if (shouldtrack){
        map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player'></div>`)
       }
    }
});
});
document.getElementsByClassName("26i2")[0].addEventListener('click', function() {
var map = document.getElementById("hud-map");
let markerId = 0;
window.AM = () => {
    map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player'></div>`)
    markerId++;
    game.ui.components.PopupOverlay.showHint(`Marker Founds Player The Spot Base With.`);
};
document.addEventListener('keyup', function (e) {
    if (e.key === "•") {
        window.AM();
    };
},500);
});

let V_AutoBuyShield = false;
document.getElementsByClassName("31i5")[0].addEventListener('click', function() {
    V_AutoBuyShield = !V_AutoBuyShield;
    document.getElementsByClassName("31i5")[0].className = "btn btn-blue 31i5";
    document.getElementsByClassName("31i5")[0].innerText = "Enable Auto Buy Shield";
    if (V_AutoBuyShield) {
        document.getElementsByClassName("31i5")[0].className = "btn btn-red 31i5";
        document.getElementsByClassName("31i5")[0].innerText = "Disable Auto Buy Shield";
    }
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoBuyShield){
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 1 && game.ui.playerTick.gold >= 1000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 2 && game.ui.playerTick.gold >= 3000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 3 && game.ui.playerTick.gold >= 7000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 4 && game.ui.playerTick.gold >= 14000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 5 && game.ui.playerTick.gold >= 18000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 6 && game.ui.playerTick.gold >= 22000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 7 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 8 && game.ui.playerTick.gold >= 30000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 9 && game.ui.playerTick.gold >= 45000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.ZombieShield.nextTier === 10 && game.ui.playerTick.gold >= 70000) {
            game.ui.components.MenuShop.shopItems.ZombieShield.componentElem.click();
        }
    }
})

let V_AutoBuySpear = false;
document.getElementsByClassName("21i5")[0].addEventListener('click', function() {
    V_AutoBuySpear = !V_AutoBuySpear;
    document.getElementsByClassName("21i5")[0].className = "btn btn-blue 21i5";
    document.getElementsByClassName("21i5")[0].innerText = "Enable Auto Buy Spear";
    if (V_AutoBuySpear) {
        document.getElementsByClassName("21i5")[0].className = "btn btn-red 21i5";
        document.getElementsByClassName("21i5")[0].innerText = "Disable Auto Buy Spear";
    }
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoBuySpear){
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 1 && game.ui.playerTick.gold >= 1400) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 2 && game.ui.playerTick.gold >= 2800) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 3 && game.ui.playerTick.gold >= 5600) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 4 && game.ui.playerTick.gold >= 11200) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 5 && game.ui.playerTick.gold >= 22500) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 6 && game.ui.playerTick.gold >= 45000) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (game.ui.components.MenuShop.shopItems.Spear.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
    }
})
let V_AutoBuyPickaxe = false;
document.getElementsByClassName("20i5")[0].addEventListener('click', function() {
    V_AutoBuyPickaxe = !V_AutoBuyPickaxe;
    document.getElementsByClassName("20i5")[0].className = "btn btn-blue 20i5";
    document.getElementsByClassName("20i5")[0].innerText = "Enable Auto Buy Pickaxe";
    if (V_AutoBuyPickaxe) {
        document.getElementsByClassName("20i5")[0].className = "btn btn-red 20i5";
        document.getElementsByClassName("20i5")[0].innerText = "Disable Auto Buy Pickaxe";
    }
})

game.network.addEntityUpdateHandler(() => {
    if(V_AutoBuyPickaxe){
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 1 && game.ui.playerTick.gold >= undefined) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 2 && game.ui.playerTick.gold >= 1000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 3 && game.ui.playerTick.gold >= 3000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 4 && game.ui.playerTick.gold >= 5000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 5 && game.ui.playerTick.gold >= 8000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 6 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Pickaxe.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click();
        }
    }
});
let V_AutoBuyBomb = false;
document.getElementsByClassName("19i5")[0].addEventListener('click', function() {
    V_AutoBuyBomb = !V_AutoBuyBomb;
    document.getElementsByClassName("19i5")[0].className = "btn btn-blue 19i5";
    document.getElementsByClassName("19i5")[0].innerText = "Enable Auto Buy Bomb";
    if (V_AutoBuyBomb) {
        document.getElementsByClassName("19i5")[0].className = "btn btn-red 19i5";
        document.getElementsByClassName("19i5")[0].innerText = "Disable Auto Buy Bomb";
    }
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoBuyBomb){
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 1 && game.ui.playerTick.gold >= 100) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 2 && game.ui.playerTick.gold >= 400) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 3 && game.ui.playerTick.gold >= 3000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 4 && game.ui.playerTick.gold >= 5000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 5 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 6 && game.ui.playerTick.gold >= 50000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bomb.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
    }
})
let V_AutoBuyBow = false;
document.getElementsByClassName("17i5")[0].addEventListener('click', function() {
    V_AutoBuyBow = !V_AutoBuyBow;
    document.getElementsByClassName("17i5")[0].className = "btn btn-blue 17i5";
    document.getElementsByClassName("17i5")[0].innerText = "Enable Auto Buy Bow";
    if (V_AutoBuyBow) {
        document.getElementsByClassName("17i5")[0].className = "btn btn-red 17i5";
        document.getElementsByClassName("17i5")[0].innerText = "Disable Auto Buy Bow";
    }
})
game.network.addEntityUpdateHandler(() => {
    if(V_AutoBuyBow){
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 1 && game.ui.playerTick.gold >= 100) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 2 && game.ui.playerTick.gold >= 400) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 3 && game.ui.playerTick.gold >= 2000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 4 && game.ui.playerTick.gold >= 7000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 5 && game.ui.playerTick.gold >= 24000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 6 && game.ui.playerTick.gold >= 30000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
        if (game.ui.components.MenuShop.shopItems.Bow.nextTier === 7 && game.ui.playerTick.gold >= 90000) {
            game.ui.components.MenuShop.shopItems.Bow.componentElem.click();
        }
    }
})
let V_AutoRespawn = false;
document.getElementsByClassName("18i5")[0].addEventListener('click', function() {
    V_AutoRespawn = !V_AutoRespawn;
    document.getElementsByClassName("18i5")[0].className = "btn btn-blue 18i5";
    document.getElementsByClassName("18i5")[0].innerText = "Enable Auto Respawn";
    if (V_AutoRespawn) {
        document.getElementsByClassName("18i5")[0].className = "btn btn-red 18i5";
        document.getElementsByClassName("18i5")[0].innerText = "Disable Auto Respawn";
    }
})

game.network.addEntityUpdateHandler(() => {
    if(V_AutoRespawn && game.ui.playerTick.health <= 0){
        document.getElementsByClassName("hud-respawn-btn")[0].click();
    }
})

document.getElementsByClassName("30i2")[0].addEventListener('click', function() {
    lock = !lock;
    document.getElementsByClassName("30i2")[0].className = "btn btn-blue 30i2";
    document.getElementsByClassName("30i2")[0].innerText = "Lock Pos!";
    if (lock) {
       document.getElementsByClassName("30i2")[0].className = "btn btn-red 30i2";
        document.getElementsByClassName("30i2")[0].innerText = "Unlock Pos!";
    }
})

let resources
document.getElementsByClassName("8i2")[0].addEventListener('click', function() {
    resources = !resources;

    document.getElementsByClassName("8i2")[0].className = "btn btn-blue 8i2";
    document.getElementsByClassName("8i2")[0].innerText = "Hide Resources!";

    if (resources) {
       document.getElementsByClassName("8i2")[0].className = "btn btn-red 8i2";
        document.getElementsByClassName("8i2")[0].innerText = "Show Resources!";
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
    window.autobow = !window.autobow;
    document.getElementsByClassName("10i")[0].className = "btn btn-blue 10i";
    document.getElementsByClassName("10i")[0].innerText = "Enable AutoBow";
    if (window.autobow) {
        document.getElementsByClassName("10i")[0].className = "btn btn-red 10i";
        document.getElementsByClassName("10i")[0].innerText = "Disable AutoBow";
        if (game.ui.inventory.Bow) {
            game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: game.ui.inventory.Bow.tier});
        } else {//tier 1 bow
            game.network.sendRpc({name: "BuyItem",itemName: "Bow", tier: 1});
            game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: 1});
        };
    } else {
    };
});

document.getElementsByClassName("21i")[0].addEventListener('click', function() {
    window.autobomb = !window.autobomb;
    document.getElementsByClassName("21i")[0].className = "btn btn-blue 21i";
    document.getElementsByClassName("21i")[0].innerText = "Enable AutoBomb";
    if (window.autobomb) {
        document.getElementsByClassName("21i")[0].className = "btn btn-red 21i";
        document.getElementsByClassName("21i")[0].innerText = "Disable AutoBomb";

        if (game.ui.inventory.Bomb) {
            game.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: game.ui.inventory.Bomb.tier});
        } else {//tier 1 bomb
            game.network.sendRpc({name: "BuyItem",itemName: "Bomb", tier: 1});
            game.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: 1});
        };
    } else {
    };
});

let isOnControl = false
document.getElementsByClassName("21i2")[0].addEventListener('click', function() {
    isOnControl = !isOnControl;
    document.getElementsByClassName("21i2")[0].className = "btn btn-blue 21i2";
    document.getElementsByClassName("21i2")[0].innerText = "Control Alts!!";
    if (isOnControl) {
       document.getElementsByClassName("21i2")[0].className = "btn btn-red 21i2";
               document.getElementsByClassName("21i2")[0].innerText = "Uncontrol Alts!";
    }
 });
document.getElementsByClassName("1i2")[0].addEventListener('click', function() {
    window.aim = !window.aim;
    document.getElementsByClassName("1i2")[0].className = "btn btn-blue 1i2";
    document.getElementsByClassName("1i2")[0].innerText = "Enable Aim!";
    if (window.aim) {
       document.getElementsByClassName("1i2")[0].className = "btn btn-red 1i2";
        document.getElementsByClassName("1i2")[0].innerText = "Disable Aim!";
    }
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
    document.getElementsByClassName("8i5")[0].innerText = "Auto Health And Pet Health";

    if (heal) {
        document.getElementsByClassName("8i5")[0].className = "btn btn-red 8i5";
        document.getElementsByClassName("8i5")[0].innerText = "!(Auto Health And Pet Health)";
    };
});

document.getElementsByClassName("9i5")[0].addEventListener('click', function() {
    revive = !revive;
    document.getElementsByClassName("9i5")[0].className = "btn btn-blue 9i5";
    document.getElementsByClassName("9i5")[0].innerText = "Revive And Evolve Pets";

    if (revive) {
        document.getElementsByClassName("9i5")[0].className = "btn btn-red 9i5";
        document.getElementsByClassName("9i5")[0].innerText = "!(Revive And Evolve Pets)";
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
    window.followposition = !window.followposition;
    document.getElementsByClassName("25i2")[0].className = "btn btn-blue 25i2";
    document.getElementsByClassName("25i2")[0].innerText = "Follow Position";
    if (window.followposition) {
        document.getElementsByClassName("25i2")[0].className = "btn btn-red 25i2";
        document.getElementsByClassName("25i2")[0].innerText = "UnFollow Position";
        } else {
        game.ui.components.PopupOverlay.showHint("Player not found! You can try again once it's found.");
    };
});
document.getElementsByClassName("2i2")[0].addEventListener('click', function() {
    window.playerfollower = !window.playerfollower;
    document.getElementsByClassName("2i2")[0].className = "btn btn-blue 2i2";
    document.getElementsByClassName("2i2")[0].innerText = "Enable Player Follower!";
    if (window.playerfollower) {
        document.getElementsByClassName("2i2")[0].className = "btn btn-red 2i2";
        document.getElementsByClassName("2i2")[0].innerText = "Disable Player Follower!";
    };
});

document.getElementsByClassName("3i2")[0].addEventListener('click', function() {
    let id = Math.floor(document.getElementsByClassName("4i2")[0].value);

    window.allSockets[id --- 1].close();
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

    if (cipherMenu.style.display == 'block') {
        cipherMenu.style.display = 'none';
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
        //fuck is stupid +1
  // game.ui.getComponent("PopupOverlay").hide.showConfirmation("Are you sure you want to build recorded base?", false, function() {
  //  game.ui.components.PopupOverlay.show.Hint("Successfully recorded base were built!", false);
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            clearInterval(waitForGoldStash);

            var basecode = localStorage.RecordedBase1;

            basecode = new Function(basecode);

            return basecode();
        };
   });
  //});
}


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
        };

        localStorage.RecordedBase2 = base;
    });
};

window.buildRecordedBase2 = function() {
     game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to build recorded base?", 1e4, function() {
   game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            clearInterval(waitForGoldStash);

            var basecode = localStorage.RecordedBase2;

            basecode = new Function(basecode);

            return basecode();
        };
    });
     });
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

            let yaw = 0;

            base += "Auto.PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        };

        localStorage.RecordedBase3 = base;
    });
};

window.buildRecordedBase3 = function() {
 game.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to build recorded base?", 1e4, function() {
   game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            let stash = GetGoldStash();

            if (stash == undefined) return;

            let stashPosition = {
                x: stash.x,
                y: stash.y
            };

            clearInterval(waitForGoldStash);


            var basecode = localStorage.RecordedBase3;

            basecode = new Function(basecode);

            return basecode();
        };
    });
 });
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
    });
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

        let yaw = 0;

        base += "Auto.PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");";
    };

    document.getElementsByClassName("30i3")[0].value = base;
};

window.autobuildtoggle = () => {
    autobuild = !autobuild;
    document.getElementsByClassName("21i3")[0].className = "btn btn-blue 21i3"
    document.getElementsByClassName("21i3")[0].innerText = "Enable Auto Build Saved Towers!";

    if (autobuild) {
    document.getElementsByClassName("21i3")[0].className = "btn btn-red 21i3"
        document.getElementsByClassName("21i3")[0].innerText = "Disable Auto Build Saved Towers!";
    };
};

window.upgradealltoggle = () => {
    upgradeAll2 = !upgradeAll2;
    document.getElementsByClassName("26i3")[0].className = "btn btn-blue 26i3"
    document.getElementsByClassName("26i3")[0].innerText = "Enable Upgrade All!";

    if (upgradeAll2) {
        document.getElementsByClassName("26i3")[0].className = "btn btn-red 26i3"
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

function healPlayer() {
    if (!game.ui.components.PlacementOverlay.buildingId && !game.ui.components.BuildingOverlay.buildingId) {
        game.network.sendRpc({
            name: "EquipItem",
            itemName: "HealthPotion",
            tier: 1
        })
        game.network.sendRpc({
            name: "BuyItem",
            itemName: "HealthPotion",
            tier: 1
        }, 50);
    };
};

// AITO;

window.sendAitoAlt = () => {
    if (window.startaito) {
        let iframe = document.createElement('iframe');
        iframe.src = 'http://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);

        let iframeWindow = iframe.contentWindow;

        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;

            let ws = new WebSocket(`ws://${connectionOptions.hostname}:${connectionOptions.port}`);

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
        iframe.src = 'http://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);

        let iframeWindow = iframe.contentWindow;

        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;

            let ver = false;
            let player = game.ui.components.Leaderboard.leaderboardData[document.getElementsByClassName("16i2")[0].value - 1].name;

            let ws = new WebSocket(`ws://${connectionOptions.hostname}:${connectionOptions.port}`);

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
                    displayName: 'SkidTheJa¥₮',
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
        iframe.src = 'http://zombs.io';
        iframe.style.display = 'none';
        document.body.append(iframe);

        let iframeWindow = iframe.contentWindow;

        iframe.addEventListener("load", () => {
            let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
            iframeWindow.game.network.connectionOptions = connectionOptions;
            iframeWindow.game.network.connected = true;

            let ws = new WebSocket(`ws://${connectionOptions.hostname}:${connectionOptions.port}`);
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

let activersID = false;
let allowID = true;


function counter(e = 0) {
    if (e <= -0.99949999999999999e24) {
        return Math.round(e/-1e23)/-10 + "TT";
    }
    if (e <= -0.99949999999999999e21) {
        return Math.round(e/-1e20)/-10 + "TB";
    }
    if (e <= -0.99949999999999999e18) {
        return Math.round(e/-1e17)/-10 + "TM";
    }
    if (e <= -0.99949999999999999e15) {
        return Math.round(e/-1e14)/-10 + "TK";
    }
    if (e <= -0.99949999999999999e12) {
        return Math.round(e/-1e11)/-10 + "T";
    }
    if (e <= -0.99949999999999999e9) {
        return Math.round(e/-1e8)/-10 + "B";
    }
    if (e <= -0.99949999999999999e6) {
        return Math.round(e/-1e5)/-10 + "M";
    }
    if (e <= -0.99949999999999999e3) {
        return Math.round(e/-1e2)/-10 + "K";
    }
    if (e <= 0.99949999999999999e3) {
        return Math.round(e) + "";
    }
    if (e <= 0.99949999999999999e6) {
        return Math.round(e/1e2)/10 + "K";
    }
    if (e <= 0.99949999999999999e9) {
        return Math.round(e/1e5)/10 + "M";
    }
    if (e <= 0.99949999999999999e12) {
        return Math.round(e/1e8)/10 + "B";
    }
    if (e <= 0.99949999999999999e15) {
        return Math.round(e/1e11)/10 + "T";
    }
    if (e <= 0.99949999999999999e18) {
        return Math.round(e/1e14)/10 + "TK";
    }
    if (e <= 0.99949999999999999e21) {
        return Math.round(e/1e17)/10 + "TM";
    }
    if (e <= 0.99949999999999999e24) {
        return Math.round(e/1e20)/10 + "TB";
    }
    if (e <= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
    if (e >= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
}

//rss
function msToTime(s) {

    // Pad to 2 or 3 digits, default is 2
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
}

//const WorldRecord = WorldRecord.network.worldrecord({name: "Wave", Wr: true, leader: 1, member: 3}).click();

game.network.addEntityUpdateHandler(() => {
    if (activersID) {
        !allowID && (allowID = true);
    }
    if (activersID || allowID) {
        for (let i in game.world.entities) {
            if (game.world.entities[i].fromTick.name) {
                let player = game.world.entities[i];
                let player2 = game.world.entities[i];
                let score_1 = counter(player.targetTick.score);
                let wood_1 = counter(player.targetTick.wood);
                let stone_1 = counter(player.targetTick.stone);
                let gold_1 = counter(player.targetTick.gold);
                let token_1 = counter(player.targetTick.token);
                let px_1 = counter(player.targetTick.position.x);
                let py_1 = counter(player.targetTick.position.y);
                if (activersID && !player.targetTick.oldName) {
                    player.targetTick.oldName = player.targetTick.name;
                    player.targetTick.oldScore = score_1;
                    player.targetTick.oldWood = wood_1;
                    player.targetTick.oldStone = stone_1;
                    player.targetTick.oldGold = gold_1;
                    player.targetTick.oldToken = token_1;
                    player.targetTick.oldPX = px_1;
                    player.targetTick.oldPY = py_1;
                    player.targetTick.info = (`Name: ${player.targetTick.oldName}, UID: ${player.targetTick.uid}, Wave: ${player.targetTick.wave+1}, Score: ${score_1}, Wood: ${wood_1}, Stone: ${stone_1},\nGold: ${gold_1}, Token: ${token_1}, X: ${Math.round(player.targetTick.position.x)}, Y: ${Math.round(player.targetTick.position.y)} PartyID: ${Math.round(player.targetTick.partyId)}, TimeDead: ${msToTime(player.targetTick.timeDead)}`);
                    player.targetTick.name = game.world.entities[i].targetTick.info;
                }
                if (!activersID && player.targetTick.oldName) {
                    player.targetTick.info = player.targetTick.oldName;
                    player.targetTick.name = game.world.entities[i].targetTick.info;
                    player.targetTick.oldName = null;
                }
                if (activersID) {
                    if (player.targetTick.oldGold !== gold_1 || player.targetTick.oldWood !== wood_1 || player.targetTick.oldStone !== stone_1 || player.targetTick.oldToken !== token_1 || player.targetTick.oldPX !== px_1 || player.targetTick.oldPY !== py_1) {
                        player.targetTick.oldStone = stone_1;
                        player.targetTick.oldGold = gold_1;
                        player.targetTick.oldToken = token_1;
                        player.targetTick.oldPX = px_1;
                        player.targetTick.oldPY = py_1;
                        player.targetTick.info = (`Name: ${player.targetTick.oldName}, UID: ${player.targetTick.uid}, Wave: ${player.targetTick.wave+1}, Score: ${score_1}, Wood: ${wood_1}, Stone: ${stone_1},\nGold: ${gold_1}, Token: ${token_1}, X: ${Math.round(player.targetTick.position.x)}, Y: ${Math.round(player.targetTick.position.y)}, PartyID: ${Math.round(player.targetTick.partyId)}, TimeDead: ${msToTime(player.targetTick.timeDead)}`);
                        player.targetTick.name = game.world.entities[i].targetTick.info;
                    }
                }
            }
        }
    }
    if (!activersID) {
        allowID = false;
    }
})
function counter(e = 0) {
    if (e <= -0.99949999999999999e24) {
        return Math.round(e/-1e23)/-10 + "TT";
    }
    if (e <= -0.99949999999999999e21) {
        return Math.round(e/-1e20)/-10 + "TB";
    }
    if (e <= -0.99949999999999999e18) {
        return Math.round(e/-1e17)/-10 + "TM";
    }
    if (e <= -0.99949999999999999e15) {
        return Math.round(e/-1e14)/-10 + "TK";
    }
    if (e <= -0.99949999999999999e12) {
        return Math.round(e/-1e11)/-10 + "T";
    }
    if (e <= -0.99949999999999999e9) {
        return Math.round(e/-1e8)/-10 + "B";
    }
    if (e <= -0.99949999999999999e6) {
        return Math.round(e/-1e5)/-10 + "M";
    }
    if (e <= -0.99949999999999999e3) {
        return Math.round(e/-1e2)/-10 + "K";
    }
    if (e <= 0.99949999999999999e3) {
        return Math.round(e) + "";
    }
    if (e <= 0.99949999999999999e6) {
        return Math.round(e/1e2)/10 + "K";
    }
    if (e <= 0.99949999999999999e9) {
        return Math.round(e/1e5)/10 + "M";
    }
    if (e <= 0.99949999999999999e12) {
        return Math.round(e/1e8)/10 + "B";
    }
    if (e <= 0.99949999999999999e15) {
        return Math.round(e/1e11)/10 + "T";
    }
    if (e <= 0.99949999999999999e18) {
        return Math.round(e/1e14)/10 + "TK";
    }
    if (e <= 0.99949999999999999e21) {
        return Math.round(e/1e17)/10 + "TM";
    }
    if (e <= 0.99949999999999999e24) {
        return Math.round(e/1e20)/10 + "TB";
    }
    if (e <= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
    if (e >= 0.99949999999999999e27) {
        return Math.round(e/1e+23)/10 + "TT";
    }
}

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

        // X, Y The Up, Down, Left, Right In Coming Ws!//
        let x = false;
        let y = false;
        window.x = 1 == 0 + 1 - 0 == 2 + 1 - 0 == 3 - 2 - 1 == 0;
        window.x = 0 == 1 + 0 - 1 == 1 + 2 - 1 == 2 - 1 - 1 == 0;
        window.x = `${x++}`;
        window.y = 1 == 0 + 1 - 0 == 2 + 1 - 0 == 3 - 2 - 1 == 0;
        window.y = 0 == 1 + 0 - 1 == 1 + 2 - 1 == 2 - 1 - 1 == 0;
        window.y = `${y++}`;
        window.up > 0 < 1;
        window.down > 0 < 1;
        window.left > 0 < 1;
        window.right > 0 < 1;
        //---------------------------------------------//

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

                //ws.network.sendInput({
                  //  up: 1
                //});

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
                                        game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition3.x) * 90, (-ws.myPlayer.position.y + mousePosition3.y) * 90),
                                        Math.floor(mousePosition3.x),
                                        Math.floor(mousePosition3.y),
                                        Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x) * 90, (-ws.myPlayer.position.y + mousePosition3.y) * 90))
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

                            if (KeyCode == 81 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                setTimeout(() => {
                                    var nextWeapon = 'Pickaxe';

                                    var weaponOrder = ['Pickaxe', 'Bow', 'Bow', 'Bomb'];

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
                                        name: "EquipItem",
                                        itemName: "PetCARL",
                                        tier: ws.inventory.PetCARL.tier
                                    });

                                    ws.network.sendRpc({
                                        name: "EquipItem",
                                        itemName: "PetMiner",
                                        tier: ws.inventory.PetMiner.tier
                                    });
                                };

                                if (KeyCode == 77) {
                                    ws.network.sendRpc({
                                        name: "BuyItem",
                                        itemName: "PetRevive",
                                        tier: 1
                                    });

                                    ws.network.sendRpc({
                                        name: "EquipItem",
                                        itemName: "PetRevive",
                                        tier: 1
                                    });

                                    ws.network.sendRpc({
                                        name: "BuyItem",
                                        itemName: "PetCARL",
                                        tier: ws.inventory.PetCARL.tier + 1
                                    });

                                    ws.network.sendRpc({
                                        name: "BuyItem",
                                        itemName: "PetMiner",
                                        tier: ws.inventory.PetMiner.tier + 1
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
            ws.network.addEntityUpdateHandler(() => {
            if(V_AutoBuySpear){
        if (ws.ui.components.MenuShop.shopItems.Spear.nextTier === 1 && ws.ui.playerTick.gold >= 1400) {
            ws.ui.components.MenuShop.shopItems.Spear.componentElem.click();
        }
        if (ws.ui.components.MenuShop.shopItems.Spear.nextTier === 2 && ws.ui.playerTick.gold >= 2800) {
            ws.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (ws.ui.components.MenuShop.shopItems.Spear.nextTier === 3 && ws.ui.playerTick.gold >= 5600) {
            ws.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (ws.ui.components.MenuShop.shopItems.Spear.nextTier === 4 && ws.ui.playerTick.gold >= 11200) {
            ws.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (ws.ui.components.MenuShop.shopItems.Spear.nextTier === 5 && ws.ui.playerTick.gold >= 22500) {
            ws.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (ws.ui.components.MenuShop.shopItems.Spear.nextTier === 6 && ws.ui.playerTick.gold >= 45000) {
            ws.ui.components.MenuShop.shopItems.Spear.componentElem.click();
                    }
        if (ws.ui.components.MenuShop.shopItems.Spear.nextTier === 7 && ws.ui.playerTick.gold >= 90000) {
            ws.ui.components.MenuShop.shopItems.Spear.componentElem.click();
            }
          }
       })
      ws.network.addEntityUpdateHandler(() => {
        if(V_AutoEquipSpear){
           if (ws.ui.playerWeaponName != "Spear") ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: ws.ui.components.MenuShop.shopItems.Spear.itemTier});
       }
    })
    ws.network.addEntityUpdateHandler(() => {
    if(V_AutoBuyBomb){
        if (ws.ui.components.MenuShop.shopItems.Bomb.nextTier === 1 && ws.ui.playerTick.gold >= 100) {
            ws.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (ws.ui.components.MenuShop.shopItems.Bomb.nextTier === 2 && ws.ui.playerTick.gold >= 400) {
            ws.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (ws.ui.components.MenuShop.shopItems.Bomb.nextTier === 3 && ws.ui.playerTick.gold >= 3000) {
            ws.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (ws.ui.components.MenuShop.shopItems.Bomb.nextTier === 4 && ws.ui.playerTick.gold >= 5000) {
            ws.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (ws.ui.components.MenuShop.shopItems.Bomb.nextTier === 5 && ws.ui.playerTick.gold >= 24000) {
            ws.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (ws.ui.components.MenuShop.shopItems.Bomb.nextTier === 6 && ws.ui.playerTick.gold >= 50000) {
            ws.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
        }
        if (ws.ui.components.MenuShop.shopItems.Bomb.nextTier === 7 && ws.ui.playerTick.gold >= 90000) {
            ws.ui.components.MenuShop.shopItems.Bomb.componentElem.click();
         }
       }
    })
     ws.network.addEntityUpdateHandler(() => {
      if(V_AutoEquipBomb){
         if (ws.ui.playerWeaponName != "Bomb") ws.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: ws.ui.components.MenuShop.shopItems.Bomb.itemTier});
                    }
                 })
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
                      //document.getElementsByClassName("1i2")[0].innerText = "Disable Aim!";
                    } else {
                        window.aim = false;
                      //document.getElementsByClassName("1i2")[0].innerText = "Enable Aim!";
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
                        message: `W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`
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
                        //document.getElementsByClassName("30i2")[0].innerText = 'Unlock Pos!';
                    } else if (!window.lock) {
                      //document.getElementsByClassName("30i2")[0].innerText = 'Lock Pos!';
                        ws.network.sendInput({right: 0});
                        ws.network.sendInput({left: 0});
                        ws.network.sendInput({down: 0});
                        ws.network.sendInput({up: 0});
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
                        ws.myPlayer[g] != ws.data.entities[ws.uid][g];
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
                                ws.myPet[g] != ws.data.entities[ws.myPlayer.petUid][g];
                                ws.network.sendRpc({name: "BuyItem",itemName: "PetCARL",tier: 1});
                                ws.network.sendRpc({name: "BuyItem",itemName: "PetMiner",tier: 1});
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

                if (ws.message.response.message == "move" && ws.message.response.uid == game.world.myUid) {
                    ws.mousemove = true;
                };

                if (ws.message.response.message == "unmove" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "!!unaim" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == `!psk` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });
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
                        message: `W: ${counter(ws.players[ws.message.response.uid].wood)}, S: ${counter(ws.players[ws.message.response.uid].stone)}, G: ${counter(ws.players[ws.message.response.uid].gold)}, T: ${Math.floor(ws.players[ws.message.response.uid].token)};`
                    });
                };

                if (ws.message.response.message == "!s" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: `W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`
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
                if (ws.message.response.message == `${ws.space}` && ws.message.response.uid == game.world.myUid) {
                ws.space = 0;
                };
                /* if (ws.message.response.message == "!spamrick" && ws.message.response.uid == game.world.myUid) {
                ws.spam1 = true;
                };
                if (ws.message.response.message == "!!spamrick" && ws.message.response.uid == game.world.myUid) {
                ws.spam1 = false;
                };*/
                if (ws.message.response.message == "!spamchat" && ws.message.response.uid == game.world.myUid) {
                ws.spam = true;
                };
                if (ws.message.response.message == "!!spamchat" && ws.message.response.uid == game.world.myUid) {
                ws.spam = false;
                };
                if (ws.message.response.message == "!autospear" && ws.message.response.uid == game.world.myUid) {
                ws.raid = true;
                };
                if (ws.message.response.message == "!!autospear" && ws.message.response.uid == game.world.myUid) {
                ws.raid = false;
                };
                if (ws.message.response.message == "!autopick" && ws.message.response.uid == game.world.myUid) {
                ws.raid2 = true;
                };
                if (ws.message.response.message == "!!autopick" && ws.message.response.uid == game.world.myUid) {
                ws.raid2 = false;
                };
                if (ws.message.response.message == "!autobomb" && ws.message.response.uid == game.world.myUid) {
                ws.raid1 = true;
                };
                if (ws.message.response.message == "!!autobomb" && ws.message.response.uid == game.world.myUid) {
                ws.raid1 = false;
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

               if (ws.message.response.message == "!j" && ws.message.response.uid == game.world.myUid) {
                   ws.network.sendRpc({name: "JoinPartyByShareKey",partyShareKey: game.ui.getPlayerPartyShareKey()});
                };

               if (ws.message.response.message == `!join` && ws.message.response.uid == game.world.myUid) {
                   ws.network.sendRpc({name: "JoinPartyByShareKey",partyShareKey: game.ui.getPlayerPartyShareKey()});
                };

                if (ws.message.response.message == `!join ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });
                };

                if (ws.message.response.message.startsWith(`!joinPsk ${ws.cloneId}`) && ws.message.response.uid == game.world.myUid) {
                    let args = ws.message.response.message.split(' ');

                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: args[2]
                    });
                };

                if (ws.message.response.message == "!l" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({name: "LeaveParty"});
                };

                if (ws.message.response.message == `!leave` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({name: "LeaveParty"});
                };

                if (ws.message.response.message == `!leave ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "LeaveParty"
                    });
                };

                if (ws.message.response.message == "upall" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded all(s)!"
                    });

                     let entities = game.world.entities;
                     for (let uid in entities) {
                       if (!entities.hasOwnProperty(uid)) continue;
                           ws.network.sendRpc({
                               name: "UpgradeBuilding",
                               uid: entities[uid].fromTick.uid
                       });
                    };
                };

                if (ws.message.response.message == "upstash" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded stash(s)!"
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

                if (ws.message.response.message == "up1" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up2" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up3" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up4" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up5" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up6" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded Melee(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "MeleeTower") {
                            ws.network.sendRpc({
                                name: "UpgradeBuilding",
                                uid: ws.buildings[i].uid
                            });
                        };
                    };
                };

                if (ws.message.response.message == "up7" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up8" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up9" && ws.message.response.uid == game.world.myUid) {
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

                if (ws.message.response.message == "up0" && ws.message.response.uid == game.world.myUid) {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "Successfully upgraded harvester(s)!"
                    });

                    for (let i in ws.buildings) {
                        if (ws.buildings[i].type == "Harvester") {
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
                if(ws.ahrc) {
                for(let uid in ws.buildings) {
                    let obj = ws.buildings[uid];
                        ws.network.sendRpc({
                            name: "CollectHarvester",
                            uid: obj.uid
                        }, 10);
                        if (obj.type == "Harvester" && obj.tier == 1) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.07
                            },10);
                        }
                        if (obj.type == "Harvester" && obj.tier == 2) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.11
                            },10);
                        }
                        if (obj.type == "Harvester" && obj.tier == 3) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.17
                            },10);
                        }
                        if (obj.type == "Harvester" && obj.tier == 4) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.22
                            },10);
                        }
                        if (obj.type == "Harvester" && obj.tier == 5) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.25
                            },10);
                        }
                        if (obj.type == "Harvester" && obj.tier == 6) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.28
                            },10);
                        }
                        if (obj.type == "Harvester" && obj.tier == 7) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.42
                            },10);
                        }
                        if (obj.type == "Harvester" && obj.tier == 8) {
                            ws.network.sendRpc({
                                name: "AddDepositToHarvester",
                                uid: obj.uid,
                                deposit: 0.65
                            },10);
                        }
                    };
                };
            };

                if (ws.respawn) {
                ws.network.sendInput({respawn: 1});

                if (ws.raid2) {
                    //tier 1 - pickaxe
                    ws.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click(1);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Pickaxe',tier: 1});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Pickaxe',tier: 1});
                    //tier 2 - pickaxe
                    ws.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click(2);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Pickaxe',tier: 2});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Pickaxe',tier: 2});
                    //tier 3 - pickaxe
                    ws.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click(3);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Pickaxe',tier: 3});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Pickaxe',tier: 3});
                    //tier 4 - pickaxe
                    ws.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click(4);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Pickaxe',tier: 4});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Pickaxe',tier: 4});
                    //tier 5 - pickaxe
                    ws.ui.components.MenuShop.shopItems.Pickaxe.componentElem.click(5);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Pickaxe',tier: 5});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Pickaxe',tier: 5});
                };
               };
            if (ws.respawn) {
                ws.network.sendInput({respawn: 1});
                if (ws.raid1) {
                    //tier 1 - bomb
                    game.ui.components.MenuShop.shopItems.Bomb.componentElem.click(1);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Bomb',tier: 1});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Bomb',tier: 1});
                    //tier 2 - bomb
                    game.ui.components.MenuShop.shopItems.Bomb.componentElem.click(2);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Bomb',tier: 2});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Bomb',tier: 2});
                    //tier 3 - bomb
                    game.ui.components.MenuShop.shopItems.Bomb.componentElem.click(3);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Bomb',tier: 3});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Bomb',tier: 3});
                    //tier 4 - bomb
                    game.ui.components.MenuShop.shopItems.Bomb.componentElem.click(4);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Bomb',tier: 4});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Bomb',tier: 4});
                };
            };
            if (ws.respawn) {
                ws.network.sendInput({respawn: 1});
                if (ws.raid) {
                    //tier 1 - spear
                    game.ui.components.MenuShop.shopItems.Spear.componentElem.click(1);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Spear',tier: 1});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Spear',tier: 1});
                    //tier 2 - spear
                    game.ui.components.MenuShop.shopItems.Spear.componentElem.click(2);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Spear',tier: 2});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Spear',tier: 2});
                    //tier 3 - spear
                    game.ui.components.MenuShop.shopItems.Spear.componentElem.click(3);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Spear',tier: 3});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Spear',tier: 3});
                    //tier 4 - spear
                    game.ui.components.MenuShop.shopItems.Spear.componentElem.click(4);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Spear',tier: 4});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Spear',tier: 4});
                    //tier 5 - spear
                    game.ui.components.MenuShop.shopItems.Spear.componentElem.click(5);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Spear',tier: 5});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Spear',tier: 5});
                    //tier 6 - spear
                    game.ui.components.MenuShop.shopItems.Spear.componentElem.click(6);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Spear',tier: 6});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Spear',tier: 6});
                    //tier 7 - spear
                    game.ui.components.MenuShop.shopItems.Spear.componentElem.click(7);
                    ws.network.sendRpc({name: 'BuyItem',itemName: 'Spear',tier: 7});
                    ws.network.sendRpc({name: 'EquipItem',itemName: 'Spear',tier: 7});
                };
            };

            if (ws.space) {
            ws.network.sendInput({space: 0})
            ws.network.sendInput({space: 1});
            }

            if(ws.spam){
                 setTimeout(() => {
                    ws.network.sendRpc({
                        name: "SendChatMessage",
                        message: `﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽
                                  ﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽
                                  ﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽`,
                        channel: "Local"});
                }, 150);
           }
           /*
           if(ws.spam1){
                 setTimeout(() => {
                    ws.network.sendRpc({name: "SendChatMessage", message: `Never Gonna Give You Up`, channel: "Local"});
                }, 2000);
                 setTimeout(() => {
                    ws.network.sendRpc({name: "SendChatMessage", message: `Never Gonna Let You Down`, channel: "Local"});
                }, 1000);
                 setTimeout(() => {
                    ws.network.sendRpc({name: "SendChatMessage", message: `Never Gonna Run Around And Desert You`, channel: "Local"});
                }, 2000);
                 setTimeout(() => {
                    ws.network.sendRpc({name: "SendChatMessage", message: `Never Gonna Make You Cry`, channel: "Local"});
                }, 1000);
                setTimeout(() => {
                    ws.network.sendRpc({name: "SendChatMessage", message: `Never Gonna Say GoodBye`, channel: "Local"});
                }, 2000);
                setTimeout(() => {
                    ws.network.sendRpc({name: "SendChatMessage", message: `Never Gonna Tell A Lie And Hurt You`, channel: "Local"});
                }, 1000);
            }
            */
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

        let inull1;
        if (window.shouldStartScript) {
        if (!getIsZombiesActive() && game.ui.playerPartyMembers.length !== 3 && !getactiveComingbosswaves()) {
                if (inull) {
                    inull = false;
                    //document.getElementsByClassName("0i2")[0].click();
                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.currentGame.ui.getPlayerPartyShareKey()});
                    setTimeout(() => { inull = true; }, 250);
                }
            }
            if (getbosswaves() && getIsZombiesActive() && game.ui.playerPartyMembers.length !== 1) {
                if (inull1) {
                    inull1 = false;
                    //document.getElementsByClassName("1i5")[0].click();
                    ws.network.sendRpc({name: "LeaveParty"});
                    setTimeout(() => { inull1 = true; }, 250);
                }
            }
        }
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
                            ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey()});
                        } else {
                            for (let i in window.allSockets) {
                                if (Object.values(window.allSockets[i].buildings).length > 0 && !ws.myPlayer.dead) {
                                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.allSockets[i].psk.response.partyShareKey()});
                                };
                            };
                        };
                        ws.network.sendInput({space: 0});
                        ws.network.sendInput({space: 1});
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
                            y: game.renderer.screenToWorld(Object.freeze(game.ui.mousePosition).y, 0).y
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
                            mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + x) * 80, (-ws.myPlayer.position.y + y) * 80)
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
      ws();
    });
};
let cloneTimeout = false
var LKeyWithTimeouts = function() {
    window.FKey = !window.FKey;
    cloneTimeout = false;
    window.playerIds = {
        id1: window.allSockets[window.socketId1 - 1],
        id2: window.allSockets[window.socketId2 - 1]
    }
    if (window.FKey) {
        game.network.sendRpc({name: "KickParty", uid: window.playerIds.id1.uid})
        game.network.sendRpc({name: "KickParty", uid: window.playerIds.id2.uid})
        window.FKey = setInterval(() => {
            cloneTimeout = true;
            window.playerIds.id2.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id1.psk.response.partyShareKey});
            setTimeout(() => {
                window.playerIds.id1.network.sendRpc({name: "KickParty", uid: window.playerIds.id2.uid});
                setTimeout(() => {
                    window.playerIds.id2.network.sendRpc({name: "KickParty", uid: game.world.myUid});
                }, 7925);
            }, 75);
        }, 6000);
    } else {
        clearInterval(window.FKey);
        window.FKey = null;
    }
}

document.body.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

(function() { // modified private parties tab code, except the new tab in the party menu is used differently (not private parties)
    let getElement = (Element) => {
        return document.getElementsByClassName(Element);
    }
    let getId = (Element) => {
        return document.getElementById(Element);
    }

    game.ui.components.PlacementOverlay.oldStartPlacing = game.ui.components.PlacementOverlay.startPlacing;
    game.ui.components.PlacementOverlay.startPlacing = function(e) {
        game.ui.components.PlacementOverlay.oldStartPlacing(e);
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = 2;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(180);
        }
    }

    game.ui.components.PlacementOverlay.cycleDirection = function() {
        if (game.ui.components.PlacementOverlay.placeholderEntity) {
            game.ui.components.PlacementOverlay.direction = (game.ui.components.PlacementOverlay.direction + 1) % 4;
            game.ui.components.PlacementOverlay.placeholderEntity.setRotation(game.ui.components.PlacementOverlay.direction * 90);
        }
    };


    getElement("hud-party-members")[0].style.display = "block";
    getElement("hud-party-grid")[0].style.display = "none";

    let privateTab = document.createElement("a");
    privateTab.className = "hud-party-tabs-link";
    privateTab.id = "privateTab";
    privateTab.innerHTML = "Party Tools";

    let privateHud = document.createElement("div");
    privateHud.className = "hud-private hud-party-grid";
    privateHud.id = "privateHud";
    privateHud.style = "display: none;";
    getElement("hud-party-tabs")[0].appendChild(privateTab);
    getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud, getElement("hud-party-actions")[0]);

    getId("privateTab").onclick = e => {
        getId("privateHud2").style.display = "none";
        for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
            getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
        }
        getId("privateTab").className = "hud-party-tabs-link is-active";
        getId("privateHud").setAttribute("style", "display: block;");
        if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-members")[0].setAttribute("style", "display: none;");
        }
        if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
        }
        if (getId("privateHud").getAttribute("style") == "display: none;") {
            getId("privateHud").setAttribute("style", "display: block;");
        }
    }

    getElement("hud-party-tabs-link")[0].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
    }

    getElement("hud-party-tabs-link")[1].onmouseup = e => {
        getId("privateHud").setAttribute("style", "display: none;");
        if (getId("privateTab").className == "hud-party-tabs-link is-active") {
            getId("privateTab").className = "hud-party-tabs-link"
        }
    }
    getId("privateHud").innerHTML = `
  <h1>Party Tools</h1>
  <br />
  <button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'LeaveParty' })">Leave Current Party</button>
  <br />
  <input id="psk" placeholder="Party Share Key (1)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk').value })">Join Party By Share Key (1)</button>
  <input id="psk2" placeholder="Party Share Key (2)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk2').value })">Join Party By Share Key (2)</button>
  <input id="psk3" placeholder="Party Share Key (3)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk3').value })">Join Party By Share Key (3)</button>
  <input id="psk4" placeholder="Party Share Key (4)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk4').value })">Join Party By Share Key (4)</button>
  <input id="psk5" placeholder="Party Share Key (5)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk5').value })">Join Party By Share Key (5)</button>
  <input id="psk6" placeholder="Party Share Key (6)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk6').value })">Join Party By Share Key (6)</button>
  <input id="psk7" placeholder="Party Share Key (7)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk7').value })">Join Party By Share Key (7)</button>
  <input id="psk8" placeholder="Party Share Key (8)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk8').value })">Join Party By Share Key (8)</button>
  <input id="psk9" placeholder="Party Share Key (9)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk9').value })">Join Party By Share Key (9)</button>
  <input id="psk10" placeholder="Party Share Key (10)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk10').value })">Join Party By Share Key (10)</button>
  <input id="psk11" placeholder="Party Share Key (11)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk11').value })">Join Party By Share Key (11)</button>
  <input id="psk12" placeholder="Party Share Key (12)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk12').value })">Join Party By Share Key (12)</button>
  <input id="psk13" placeholder="Party Share Key (13)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk13').value })">Join Party By Share Key (13)</button>
  <input id="psk14" placeholder="Party Share Key (14)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk14').value })">Join Party By Share Key (14)</button>
  <input id="psk15" placeholder="Party Share Key (15)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk15').value })">Join Party By Share Key (15)</button>
  <input id="psk16" placeholder="Party Share Key (16)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk16').value })">Join Party By Share Key (16)</button>
  <input id="psk17" placeholder="Party Share Key (17)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk17').value })">Join Party By Share Key (17)</button>
  <input id="psk18" placeholder="Party Share Key (18)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk18').value })">Join Party By Share Key (18)</button>
  <input id="psk19" placeholder="Party Share Key (19)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk19').value })">Join Party By Share Key (19)</button>
  <input id="psk20" placeholder="Party Share Key (20)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk20').value })">Join Party By Share Key (20)</button>
  <input id="psk21" placeholder="Party Share Key (21)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk21').value })">Join Party By Share Key (21)</button>
  <input id="psk22" placeholder="Party Share Key (22)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk22').value })">Join Party By Share Key (22)</button>
  <input id="psk23" placeholder="Party Share Key (23)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk23').value })">Join Party By Share Key (23)</button>
  <input id="psk24" placeholder="Party Share Key (24)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk24').value })">Join Party By Share Key (24)</button>
  <input id="psk25" placeholder="Party Share Key (25)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk25').value })">Join Party By Share Key (25)</button>
  <input id="psk26" placeholder="Party Share Key (26)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk26').value })">Join Party By Share Key (26)</button>
  <input id="psk27" placeholder="Party Share Key (27)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk27').value })">Join Party By Share Key (27)</button>
  <input id="psk28" placeholder="Party Share Key (28)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk28').value })">Join Party By Share Key (28)</button>
  <input id="psk29" placeholder="Party Share Key (29)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk29').value })">Join Party By Share Key (29)</button>
  <input id="psk30" placeholder="Party Share Key (30)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk30').value })">Join Party By Share Key (30)</button>
  <input id="psk31" placeholder="Party Share Key (31)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk31').value })">Join Party By Share Key (31)</button>
  <input id="psk32" placeholder="Party Share Key (32)..." value="" class="btn btn-blue" /><button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'JoinPartyByShareKey', partyShareKey: document.getElementById('psk32').value })">Join Party By Share Key (32)</button>
  <br />
  <button class="btn btn-blue" onclick="game.network.sendRpc({ name: 'LeaveParty' })">Leave Current Party</button>
  `;

    let privateTab2 = document.createElement("a");
    privateTab2.className = "hud-party-tabs-link";
    privateTab2.id = "privateTab2";
    privateTab2.innerHTML = "Share Keys";

    let privateHud2 = document.createElement("div");
    privateHud2.className = "hud-private hud-party-grid";
    privateHud2.id = "privateHud2";
    privateHud2.style = "display: none;";
    getElement("hud-party-tabs")[0].appendChild(privateTab2);
    getElement("hud-menu hud-menu-party")[0].insertBefore(privateHud2, getElement("hud-party-actions")[0]);

    getId("privateTab2").onclick = e => {
        getId("privateHud").style.display = "none";
        for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
            getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
        }
        getId("privateTab2").className = "hud-party-tabs-link is-active";
        getId("privateHud2").setAttribute("style", "display: block;");
        if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-members")[0].setAttribute("style", "display: none;");
        }
        if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
            getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
        }
        if (getId("privateHud2").getAttribute("style") == "display: none;") {
            getId("privateHud2").setAttribute("style", "display: block;");
        }
    }

    getElement("hud-party-tabs-link")[0].onmouseup = e => {
        getId("privateHud2").setAttribute("style", "display: none;");
        if (getId("privateTab2").className == "hud-party-tabs-link is-active") {
            getId("privateTab2").className = "hud-party-tabs-link"
        }
    }

    getElement("hud-party-tabs-link")[1].onmouseup = e => {
        getId("privateHud2").setAttribute("style", "display: none;");
        if (getId("privateTab2").className == "hud-party-tabs-link is-active") {
            getId("privateTab2").className = "hud-party-tabs-link"
        }
    }
    getId("privateHud2").innerHTML = `
  <h1>Share Keys</h1>
  `;
    game.network.addRpcHandler("PartyShareKey", function(e) {
        let cpKeyId = `skl${Math.floor(Math.random() * 999999)}`;
        let cpLnkId = `skl${Math.floor(Math.random() * 999999)}`;
        let psk = e.partyShareKey;
        let lnk = `http://zombs.io/#/${game.options.serverId}/${psk}/`;
        getId("privateHud2").innerHTML += `<div style="display:inline-block;margin-right:10px;"><p>${psk} <a href="${lnk}" target="_blank" color="blue">[Link]</a></p></div><button class="btn btn-blue" id="${cpKeyId}" style="display:inline-block;">Copy Key</button><button class="btn btn-blue" id="${cpLnkId}" style="display:inline-block;">Copy Link</button><br />`
            document.getElementById(cpKeyId).addEventListener('click', function(e) {
                const elem = document.createElement('textarea');
                elem.value = psk;
                document.body.appendChild(elem);
                elem.select();
                document.execCommand('copy');
                document.body.removeChild(elem);
                new Noty({
                    type: 'success',
                    text: `Copied to clipboard`,
                    timeout: 2000
                }).show();
            });
        document.getElementById(cpLnkId).addEventListener('click', function(e) {
            const elem = document.createElement('textarea');
            elem.value = lnk;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
            new Noty({
                type: 'success',
                text: `Copied to clipboard`,
                timeout: 2000
            }).show();
        });
    });

    // ^ share keys feature originally from 444x3

    document.getElementsByClassName('hud-party-tabs-link')[0].onclick = () => { getId("privateHud").style.display = "none"; getId("privateTab").classList.remove("is-active"); };
    document.getElementsByClassName('hud-party-tabs-link')[1].onclick = () => { getId("privateHud").style.display = "none"; getId("privateTab").classList.remove("is-active"); };
})()
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
    let aftercomingbosswaves = [9, 16, 24, 33, 40, 48, 56, 64, 72, 80, 88, 96, 104, 120];

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
bossAlert.style.color = "blue";
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
    iframe.src = `http://zombs.io/#/${serverId}/${psk}/`;

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


document.getElementsByClassName("25i")[0].addEventListener('click', function() {
    window.zoomonscroll = !window.zoomonscroll;
    document.getElementsByClassName("25i")[0].className = "btn btn-blue 25i";
    document.getElementsByClassName("25i")[0].innerText = "Enable Zoom Scroll";
    if (window.zoomonscroll) {
        document.getElementsByClassName("25i")[0].className = "btn btn-red 25i";
        document.getElementsByClassName("25i")[0].innerText = "Disable Zoom Scroll";
    }
})

   let ahrc = false
let upgrade = false
let zoomLevel = 1;
let dimension = 1;
let upd = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = canvasHeight / (1080 * dimension);
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
};
const onWindowResize = () => {
    if (window.zoomonscroll) {
        upd();
    }
} // Zoom by Apex, modified by eh
onWindowResize();
window.onresize = onWindowResize;
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension += 0.05;
    } else if (e.deltaY < 0) {
        dimension -= 0.05;
    }
    onWindowResize();
}

window.zoom = val => {
    dimension = val;
    upd();
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
game.network.oldSendInput = game.network.sendInput;

game.network.sendInput = m => {
    const wss2 = window.allSockets;
    for(let id in wss2) {
        const ws = wss2[id];
        ws.network.sendPacket(3, m);
    };
    game.network.oldSendInput(m);
};