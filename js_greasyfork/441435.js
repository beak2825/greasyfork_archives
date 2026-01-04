// ==UserScript==
// @name         Xyxy mod
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  If you have this script dm me on disc ill give you link so it will work ƓㄥIƬᑕǶ ヅ#6168
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @author       ƓㄥIƬᑕǶ ヅ
// @match        http://*/*
// @icon         https://th.bing.com/th/id/R.5cd6618415080fdbd991228e34f87e3e?rik=xBPsLZYBsyjj2A&pid=ImgRaw&r=0
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441435/Xyxy%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/441435/Xyxy%20mod.meta.js
// ==/UserScript==
//Main CSS
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");
document.querySelectorAll('.ad-unit,.hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());
document.getElementsByClassName("hud-intro-left")[0].innerHTML = `
`;
(function() {
    'use strict';
         document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = `<br style="height:20px;" /><Custom><b><font size="36">Xyxy mode made by Ƭℏɇ  Ƭᵲơɬɬɇrᵴヅ</font></b></Custom>`;
            var css = '.hud-intro::before{background: url(\'https://th.bing.com/th/id/R.8756baff55b384a7c5dbed9b874a2649?rik=DK9ZJZKsLdY6Wg&pid=ImgRaw&r=0\');background-size:cover; z-index: 0; .hud-menu-icons .hud-menu-icon::before{filter: drop-shadow(2px 2px 0px #1d8dee) drop-shadow(-2px 2px 0px #1d8dee) drop-shadow(2px -2px 0px #1d8dee) drop-shadow(-2px -2px 0px #1d8dee)} .hud-intro-main{padding-left: 110px} .hud-debug{color: Blue !important; text-shadow: 0px 0px 5px #fff} .hud-intro-footer{color: #fff !important; font-size: 20px !important} .hud-intro-footer a {color:#fff !important} .hud-intro h2{font-size: 20px !important; color:rgb(25 45 59) !important} .hud-intro h1{text-shadow: 0px 0px 5px #fff; font-size: 50px !important} .hud-intro h1 small::after{content: " "} .hud-intro h1 small {color: rgb(104 179 237) !important; text-shadow: 4px 4px rgb(25 44 56) } .hud-intro-corner-top-left{color: #eee} .ad-unit-medrec-respawn{display: none !important} .hud-settings-grid{margin:0 !important} .hud-menu-shop h3{font-size: 23px !important; text-shadow: 1px 1px 15px #fff } .hud-menu-party h3{text-shadow: 1px 1px 15px #fff } .hud-menu-settings h3{text-shadow: 1px 1px 15px #fff}  .hud-menu-shop .hud-shop-grid .hud-shop-item strong{text-shadow: 1px 1px 15px #fff} .hud-shop-grid{width: 880px} .ad-unit-medrec-shop{display:none} .hud-menu{background: url(\'https://cdnb.artstation.com/p/assets/images/images/005/778/331/original/herimamitiana-randriamasinoro-starfall-by-rkuma-dazyigr.gif?1493712254\'); opacity:0.85; background-size: cover} .ad-unit-leaderboard{display: none !important}  .hud-respawn-corner-bottom-left{display: none !important} ::-webkit-scrollbar {width: 10px} ::-webkit-scrollbar-thumb {background-image: linear-gradient(to bottom, #5239d0, #3e4dd8, #285ddd, #0f6bdf, #0078e0, #0087e5, #0095e8, #00a2ea, #00b5ec, #00c5df, #00d3c6, #0edda4); box-shadow: 0px 0px 3px #fff; border-radius: 20px;} .hud-intro .hud-intro-guide{width: 400px !important; padding: 0px !important} #myKey {border-radius: 20px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) } .btn-green{ background-color:#1d8dee !important};';
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(css));

            const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
                    let data = JSON.parse(request.responseText);
                    entirePop.innerHTML = `CURRENT NUMBER OF PEOPLE: ${data.players} / ${(data.players / data.capacity * 100).toFixed(2)}%`;
                    let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
                    for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Population: ${data.regions[servers[i]].players}`);
        }
    }
            };
            request.open("GET", "http://zombs.io/capacity", true);
            request.send();

            document.head.appendChild(style);
            })();
// Buy item ezier
game.renderer.ground.setVisible(false) //(true) for ground
game.renderer.projectiles.setVisible(false) //(true) for projectiles

document.getElementsByClassName("hud-top-center")[0].innerHTML = `
<a id="shopshortcut1"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pickaxe-t7.svg"></a>
<a id="shopshortcut2"><img src="http://zombs.io/asset/image/ui/inventory/inventory-spear-t7.svg"></a>
<a id="shopshortcut3"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bow-t7.svg"></a>
<a id="shopshortcut4"><img src="http://zombs.io/asset/image/ui/inventory/inventory-bomb-t7.svg"></a>
<a id="shopshortcut5"><img src="http://zombs.io/asset/image/ui/inventory/inventory-health-potion.svg"></a>
<a id="shopshortcut6"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-health-potion.svg"></a>
<a id="shopshortcut7"><img src="http://zombs.io/asset/image/ui/inventory/inventory-shield-t10.svg"></a>
<a id="shopshortcut8"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-ghost-t1.svg"></a>
<a id="shopshortcut9"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-miner-t8.svg"></a>
<a id="shopshortcut10"><img src="http://zombs.io/asset/image/ui/inventory/inventory-pet-carl-t8.svg"></a>
`;

document.getElementById('shopshortcut1').addEventListener('click', buyPickaxe);
document.getElementById('shopshortcut2').addEventListener('click', buySpear);
document.getElementById('shopshortcut3').addEventListener('click', buyBow);
document.getElementById('shopshortcut4').addEventListener('click', buyBomb);
document.getElementById('shopshortcut5').addEventListener('click', () => {shopShortcut("HealthPotion", 1)});
document.getElementById('shopshortcut6').addEventListener('click', () => {shopShortcut("PetHealthPotion", 1)});
document.getElementById('shopshortcut7').addEventListener('click', buyZombieShield);
document.getElementById('shopshortcut8').addEventListener('click', () => {Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()})});
document.getElementById('shopshortcut9').addEventListener('click', () => {buyPet("PetMiner", getPetTier(6))});
document.getElementById('shopshortcut10').addEventListener('click', () => {buyPet("PetCARL", getPetTier(5))});

function buyPet(item, tier) {
    if (game.ui.getPlayerPetName() == item) {
        shopShortcut("PetRevive", 1)
    } else {
        let i = 0
        let j = setInterval(function() {
            shopShortcut(item, tier)
            i++
            if (i >= 25 || game.ui.getPlayerPetName() == item) {
                i = 0
                clearInterval(j)
            }
        },250);
    }
}

function getPetTier(num) {
    if (document.querySelectorAll(".hud-shop-item-tier")[5].childNodes[0].textContent.match(/\d+/) != null) {
        let petLevel = document.querySelectorAll(".hud-shop-item-tier")[num].childNodes[0].textContent.match(/\d+/)[0]
        if (petLevel <= 8) return 1
        if (petLevel <= 16) return 2
        if (petLevel <= 24) return 3
        if (petLevel <= 32) return 4
        if (petLevel <= 48) return 5
        if (petLevel <= 64) return 6
        if (petLevel <= 96) return 7
        if (petLevel > 96) return 8
    } else return 8
}

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

function buyZombieShield() {
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


// REMOVE ADS
document.querySelectorAll('.ad-unit').forEach(function(a) {
 a.remove();
  });
game.ui.components.Intro.submitElem.addEventListener('click', () => {
    localStorage.setItem('themeClass', document.getElementById('introBackground').value);
})

/* random character gen */
var availableCharacters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890~!@#$%^&*()_+`-=[]{};':,./<>?\|";
var textLength = 29;
var text = "";
for (let i = 0; i < textLength; i++) text += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];


/* name stuffs here */
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);

let guide = document.getElementsByClassName("hud-intro-guide")[0];
guide.innerHTML = `
<center>
<h1 style="text-transform: none;">Usernames</h1>
<hr />
</center>
<br />
<button class="btn btn-blue hud-intro-invisible" style = 'margin-bottom: 10px;'>Invisible username</button>
<button class="btn btn-blue hud-intro-random" style = 'margin-bottom: 10px;'>Random-generated username</button>
<div class="hud-intro-name-save">
</div>
`;
guide.style.height = "260px";

function invisiblename() { document.getElementsByClassName('hud-intro-name')[0].value = "ㅤ"; };
function randomname() { document.getElementsByClassName('hud-intro-name')[0].value = `${text}`; };

document.querySelector('.hud-intro-invisible').addEventListener('click', invisiblename);
document.querySelector('.hud-intro-random').addEventListener('click', randomname);
window.addName = name => {
    let id = `username${Math.floor(Math.random() * 9999)}`;
    localStorage.usernames = `${localStorage.usernames || ""}<div id="${id}"><button onclick="document.querySelector('.hud-intro-name').value = \`${name.replaceAll('`', '\`')}\`" class="btn btn-theme">${name}</button>`;
};
(window.refreshNS = () => {
    let guide2 = document.getElementsByClassName("hud-intro-name-save")[0];
    guide2.innerHTML = `
<div>
${localStorage.usernames || "<h2>No saved names... sad.<h2>"}
<br />
</div>
<hr />
<input type="text" class="search-bar" style="width:135px;" id="inpn" /><button class="btn-fixed btn-theme" onclick="window.addName(document.getElementById('inpn').value); window.refreshNS();">Add name</button>
`;
})();
/* server scanner from ignition */
var widget = `
<h1 style="text-transform: none;">Server Scanner</h1>
<p><i class="fa fa-info-circle"></i> Click on the <strong>Scan</strong> button to show the data of the selected server here.</p>
<div id="ssrs">
</div>
`;
let hil = document.getElementsByClassName("hud-intro-left")[0];
hil.innerHTML = widget;
hil.style.marginTop = "30px";

document.getElementsByClassName("hud-intro-form")[0].insertAdjacentHTML("beforeend", `<button class="btn btn-blue hud-intro-play" style="border: 3px solid #009dff;" onclick="window.ssfi();">Scan</button>`);

window.ssfi = () => {
    let ssrs = document.getElementById("ssrs");
    ssrs.innerHTML = `<strong>Loading...</strong>`;
    let selected = document.getElementsByClassName("hud-intro-server")[0].value;
    let server = game.options.servers[selected];
    let hostname = server.hostname;
    let url = `ws://${hostname}:80/`;
    game.network.connectionOptions = { hostname: hostname };
    game.network.connected = true;
    let ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";
    const loadLbPacket = () => {
        for (let i = 0; i < 30; i++) ws.send(new Uint8Array([3, 17, 123, 34, 117, 112, 34, 58, 49, 44, 34, 100, 111, 119, 110, 34, 58, 48, 125]));
        ws.send(new Uint8Array([7, 0]));
        ws.send(new Uint8Array([9,6,0,0,0,126,8,0,0,108,27,0,0,146,23,0,0,82,23,0,0,8,91,11,0,8,91,11,0,0,0,0,0,32,78,0,0,76,79,0,0,172,38,0,0,120,155,0,0,166,39,0,0,140,35,0,0,36,44,0,0,213,37,0,0,100,0,0,0,120,55,0,0,0,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,134,6,0,0]));
    };
    ws.onopen = (data) => {
        ws.network = new game.networkType();
        ws.network.sendPacket = (e, t) => {
            ws.send(ws.network.codec.encode(e, t));
        };
        ws.onRpc = (data) => {
            if(data.name === "SetPartyList") {
                ws.parties = data.response;
            };
            if(data.name === "Leaderboard") {
                if(ws.b4) { window.appSsrs({ population: ws.pop, leaderboard: data.response, parties: ws.parties }); ws.close(); return; };
                loadLbPacket();
                ws.b4 = true;
            };
        };
        ws.onmessage = msg => {
            let data = ws.network.codec.decode(msg.data);
            switch(data.opcode) {
                case 5:
                    ws.network.sendPacket(4, { displayName: `LB-${Math.floor(Math.random() * 99999)}`, extra: data.extra });
                    break;
                case 4:
                    ws.network.sendPacket(3, { left: 1, up: 1 });
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
//Better player info by Diamondking

let CSS = `
:root{
--spectatemenu-buttons-width:90%;
--spectatemenu-buttons-height:24%;
--spectatemenu-buttons-icon-width:10%;
--spectatemenu-buttons-icon-height:100%;
--spectatemenu-buttons-name-top:10%;
--spectatemenu-buttons-name-left:12%;
--spectatemenu-buttons-name-fontSize:17px;
--spectatemenu-buttons-rank-bottom:2%;
--spectatemenu-buttons-rank-left:12%;
--spectatemenu-buttons-rank-fontSize:15px;
}
.mainMenu{
    width: 360px;
    height: 180px;
    position: absolute;
    transform: scale(0) rotate(0deg);
    pointer-events: all;
    z-index: 5;
    transition: left 0.3s, transform 0.3s, top 0.3s;
}
.menu {
    width: 100%;
    height: 110%;
    position: absolute;
    left: -50%;
    top: 50%;
    z-index: 1;
    color: rgba(255, 255, 255, 0.8);
    opacity: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    transform: translate(-50%, -45%);
    transition: all 0.3s;
    pointer-events: none;
    overflow: hidden;
}
.activateMenuButtonsContainer {
    width: 30px;
    height: auto;
    position: absolute;
    left: 100%;
    top: 98%;
    padding: 20px;
    transform: translateY(-50%);
    padding-top: 2px;
    padding-bottom: 7px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    transition: all 0.2s;
    overflow: hidden;
}
.activateMenuButtonsContainer button {
    width: inherit;
    height: 30px;
    position: relative;
    left: 50%;
    background: rgba(0, 0, 0, 0.2);
    transform: translate(-50%, 6%);
    border-radius: inherit;
    border: none;
    outline: none;
    cursor: pointer;
    pointer-events: all;
    margin-top: 2px;
    transition: all 0.3s;
}
.activateMenuButtonsContainer button span {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -22%;
    left: 24%;
    background-size: 27px;
    background-repeat: no-repeat;
    transform: rotate(
    -130deg);
    opacity: 0.6;
    transition: all 0.3s;
    pointer-events: none;
}
.activateMenuButtonsContainer button:hover {
    background: rgba(255,255,255,0.05);
   }
.switchButton {
    width: 60px;
    height: 40px;
    position: absolute;
    top: 89%;
    left: 87.5%;
    z-index: 1;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
    font-family: Hammersmith One;
    font-size: 20px;
    background-color: transparent;
    border: none;
    outline: none;
    overflow: hidden;
    transition: all 0.5s;
}
.switchButton p:hover {
    color: rgba(255, 255, 255, 1);
}
.switchButton p {
    width: 60%;
    position: absolute;
    top: 0%;
    left: 50%;
    cursor: pointer;
    transition: all 0.5s;
    transform: translate(-50%, -50%) rotateY(0deg);
}

.petNotFound {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
}
.spinner {
    animation: spin 0.4s infinite ease-in-out;
}
.healthbars-container {
    height: 130px;
    position: absolute;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
    transition: all 0.2s;
  }
.playerHealth {
    position: absolute;
    top: 18%;
    left: 41%;
    display: none;
    color: #eee;
    font-size: 12px;
    font-family: "Hammersmith One", sans-serif;
    line-height: 27px;
    text-shadow: 0 0 1px rgb(0 0 0 / 80%);
    transform: translate(-50%, -50%);
}
.spectatemenu-button{
    width: var(--spectatemenu-buttons-width);
    height: var(--spectatemenu-buttons-height);
    position: relative;
    left: 5%;
    background: rgba(255,255,255,0.08);
    border-radius: 6px;
    border: none;
    outline: none;
    overflow: hidden;
    margin-bottom: 9px;
    transition: opacity 0.3s, left 0.15s, background 0.1s, width 0.3s, height 0.3s;
    pointer-events: all;
    cursor: pointer;
    z-index: 2;
}
.spectatemenu-button:hover{
    background: rgba(255,255,255,0.16);
}
.spectatemenu-icon{
    width: var(--spectatemenu-buttons-icon-width);
    height: var(--spectatemenu-buttons-icon-height);
    background: rgba(255,255,255,0.07);
    position: absolute;
    left: 0%;
    top: 0%;
    transition: all 0.2s;
}
.spectatemenu-name{
    position: absolute;
    top: var(--spectatemenu-buttons-name-top);
    left: var(--spectatemenu-buttons-name-left);
    font-size: var(--spectatemenu-buttons-name-fontSize);
    font-family: 'Hammersmith One';
    color: rgba(255,255,255,0.8);
    border-bottom: 0px solid rgba(255,255,255,0.4);
    width: 89%;
    text-align: left;
    transition: all 0.2s;
}
.spectatemenu-rank{
    position: absolute;
    bottom: var(--spectatemenu-buttons-rank-bottom)%;
    left: var(--spectatemenu-buttons-rank-left);
    font-size: var(--spectatemenu-buttons-rank-fontSize);
    font-family: 'Hammersmith One';
    color: rgba(255,255,255,0.6);
    transition: all 0.2s;
}
.spectatemenu-background{
    width: 94.5%;
    height: 80%;
    position: absolute;
    top: 5%;
    background: rgba(0,0,0,0.2);
    border-radius: 5px;
    z-index: 1;
}
.spectatemenu-spectating{
    position: absolute;
    top: 95%;
    left: 71%;
    color: rgba(255,255,255,0.7);
    font-weight: bold;
    font-family: 'Hammersmith One';
    z-index: -1;
    opacity: 0;
}
.hud-building-overlay .shield-bar::after {
    content: "SHIELD";
}
.hud-building-overlay .hud-tooltip-health {
    display: block;
    position: relative;
    width: 100px;
    height: 34px;
    padding: 4px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    margin-top: 1px;
}
.hud-building-overlay .hud-building-stats .hud-stats-values:first-child::after {
    display: none;
}
.hud-tooltip-top::after {
    display: none;
}
/* .hud-building-overlay .hud-tooltip-health::after {} */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
`;
let style = document.createElement("style");
document.head.appendChild(style);
style.appendChild(document.createTextNode(CSS));
var main = {
  properties: {
    showNotifications: true,
    activePlayerUid: 0,
    displayMainMenu: false,
    allowMouseMove: false,
    allowRetrack: true,
    isSpectating: false,
    playerTracker: {
      mainPlayer: {},
      targetedPlayer: {},
    },
    updater: {
      calculationProcesses: {
        lastFrameTime: 0,
        timeSinceLastFrame: 0,
        FPSstored: 0,
        storedFPStime: new Date(),
      },
      clientProcesses: {
        FPSlimit: 24,
        currentFPS: 0,
      },
    },
    iconHandler: {
      FPS: 2,
      lastFrameTime: 0,
      timeSinceLastFrame: 0,
      mainFunction: function (timeStamp) {
        this.timeSinceLastFrame = timeStamp - this.lastFrameTime;
        if (this.timeSinceLastFrame >= 1000 / this.FPS) {
          this.lastFrameTime = timeStamp;
          if (main.properties.activePlayerUid !== 0 && game.network.connected && game.world.inWorld) {
            if (
              game.world.entities[main.properties.activePlayerUid] !==
                undefined &&
              game.world.entities[
                game.world.entities[main.properties.activePlayerUid].targetTick
                  .petUid
              ]
            ) {
              if (
                game.world.entities[
                  game.world.entities[main.properties.activePlayerUid]
                    .targetTick.petUid
                ]?.isInViewport()
              ) {
                main.properties.global.pet =
                  game.world.entities[
                    game.world.entities[
                      main.properties.activePlayerUid
                    ].targetTick.petUid
                  ];
              }
            } else main.properties.global.pet = null;
          }
          let icons = main.icons;
          icons.forEach((icon) => {
            let id = icon.for;
            let element;
            main.accessableElements.menuButtonsContainer
              .querySelectorAll("button")
              .forEach((button) => {
                button.className.toUpperCase().includes(id.toUpperCase())
                  ? (element = button)
                  : null;
              });
            if (icon.check()) {
              element.style.transform = "translate(-50%, 6%) scale(1)";
              element.style.position = "relative";
              element.getElementsByTagName(
                "span"
              )[0].style.backgroundImage = `url(${icon.check()})`;
            } else {
              element.style.transform = "translate(-50%, 6%) scale(0)";
              setTimeout(() => {
                element.style.position = "absolute";
              }, 150);
            }
          });
            main.accessableElements.menuButtonsContainer.style.top = `${
            96 - (main.accessableElements.menuButtonsContainer.info.properties.getVisibleButtons() - 1) * 10
          }%`;
        }
      },
    },
    global: {
      pet: undefined,
    },
    retargetAfter: 100,
  },
  accessableElements: {
    hud: document.getElementsByClassName("hud")[0],
  },
  modularFunctions: {
    arrayToHTML: (array) => {
      let elementsArray = array
          ? array
          : [
              {
                name: "undefined",
                type: "p",
                attributes: {
                  innerHTML: `nope`,
                },
                parent: document.body,
              },
            ],
        scannedElements = [];
      elementsArray.forEach((element) => {
        let ele = document.createElement(element.type);
        ele.name = element.name;
        ele.parent = element.parent;
        if (element["attributes"]) {
          let value = element["attributes"];
          Object.keys(value).forEach((property) => {
            let propertyValue = value[property];
            if (ele[property] !== undefined) {
              ele[property] = propertyValue;
            }
          });
        }
        element.element = ele;
        ele.info = element;
        main.accessableElements[element.name] = ele;
        scannedElements.push(ele);
      });
      scannedElements.forEach((sElement) => {
        if (typeof sElement.parent == "string") {
          if (
            scannedElements.find((element) => element.name == sElement.parent)
          ) {
            scannedElements
              .find((element) => element.name == sElement.parent)
              .append(sElement);
          } else {
            throw new SyntaxError(
              `Append on unknown parent ${sElement.parent}`
            );
          }
        } else if (typeof sElement.parent == "function") {
          sElement.parent().append(sElement);
        } else {
          sElement.parent.append(sElement);
        }
      });
    },
    numberToSI: (number) => {
      var symbols = ["", "k", "M", "G", "T", "P", "E"],
        tier = (Math.log10(Math.abs(number)) / 3) | 0;
      if (tier == 0) return number;
      var suffix = symbols[tier],
        scale = Math.pow(10, tier * 3),
        scaled = number / scale;
      return scaled.toFixed(1) + suffix;
    },
    onEnteringGame: () => {
      function main() {
        if (game.network.connected && game.world.inWorld)
          betterPlayerInfo.accessableElements.notification.info.properties.show(
            5000,
            1000
          );
        else
          setTimeout(() => {
            main();
          }, 100);
      }
      main();
    },
    inChat: () => {
      if (
        document
          .getElementsByClassName("hud")[0]
          .getElementsByClassName("hud-chat")[0]
          .className.includes("is-focused")
      ) {
        return true;
      } else {
        return false;
      }
    },
    handleSingleUseFunctions: function (object) {
      if (!"singleUseFunctions" in object) return;
      Object.keys(object["singleUseFunctions"]).forEach((Function) => {
        object["singleUseFunctions"][Function]?.();
      });
      delete object["singleUseFunctions"];
    },
  },
  elements: [
    {
      name: "mainMenu",
      type: "div",
      attributes: {
        className: "mainMenu",
        innerHTML: `
           <link
  rel="stylesheet"
  href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
  integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
  crossorigin="anonymous"
/>
<div
  id="hud-building-overlay"
  class="hud-building-overlay hud-tooltip hud-tooltip-top info-container"
  style="display: block; left: 0px; top: 0px; transition: all 0.4s; z-index: 1; overflow-y: hidden;"
>
  <div class="hud-tooltip-building">
    <h2 class="player-Name" style="overflow-y: hidden;">undefined</h2>
    <h3 style="position: relative; left: 0px">
      Uid: <span class="hud-building-tier player-Uid">1</span>
    </h3>
    <ul class="healthbars-container" style="left: 60%; top: -24%">
      <li class="hud-tooltip-health">
        <span
          class="hud-tooltip-health-bar"
          style="
            width: 100%;
            transition: all 0.2s;
            background: #64a10a;
          "
        ></span>
      </li>
      <li class="hud-tooltip-health shield-bar">
        <span
          class="hud-tooltip-health-bar"
          style="
            width: 100%;
            transition: all 0.2s;
            background: #3da1d9;
            display: none;
          "
        ></span>
      </li>
    </ul>
    <div class="hud-tooltip-body">
      <div class="hud-building-stats">
        <div class="hud-stats-current hud-stats-values">
          <p>
            Wood:
            <strong class="hud-stats-current player-Wood">undefined</strong>
          </p>
          <p>
            Stone:
            <strong class="hud-stats-current player-Stone">undefined</strong>
          </p>
          <p>
            Gold:
            <strong class="hud-stats-current player-Gold">undefined</strong>
          </p>
        </div>
        <div class="hud-stats-next hud-stats-values">
          <p>
            Tokens:
            <strong class="hud-stats-next player-Tokens">undefined</strong>
          </p>
          <p>
            Score:
            <strong class="hud-stats-next player-Score">undefined</strong>
          </p>
          <p style="display: block">
            Health:
            <strong class="hud-stats-next player-Health">undefined</strong>
          </p>
        </div>
      </div>
      <p class="hud-building-actions" style="display: block">
        <span class="hud-building-dual-btn" style="display: none"> </span>
      </p>
    </div>
  </div>
</div>
`,
      },
      parent: document.getElementsByClassName("hud")[0],
      properties: {
        closedThrough: function (inputType) {
          function callback() {
            if (main.properties.isSpectating) {
              let spectateMenu = main.availableMenus.find((menu) =>
                menu.id.toUpperCase().includes("SPECTATE")
              );
              spectateMenu.deactivated();
            }
            main.accessableElements.mainMenu.style.transform = "scale(0)";
            main.accessableElements.mainMenu.style.pointerEvents = "none";
            main.accessableElements.transitionMenuDiv.info.properties.state =
              "default";
            main.accessableElements.transitionMenuDiv.style.opacity = "0";
            main.accessableElements.transitionMenuDiv.style.left = "-50%";
            main.accessableElements.transitionMenuDiv.style.pointerEvents =
              main.accessableElements.menuButtonsContainer.info.properties.deactivated();
            ("none");
            main.accessableElements.switchButton.style.left = "87.5%";
            main.accessableElements.switchButton.getElementsByTagName(
              "p"
            )[0].style.transform = "translate(-50%,-50%) rotateY(0deg)";
            main.properties.displayMainMenu = false;
          }
          if (inputType.toUpperCase() == "CLICKED") {
            if (
              !main.accessableElements.mainMenu.contains(
                main.cursor.client.target
              )
            ) {
              callback();
            }
          }
          if (inputType.toUpperCase() == "SHIFTKEY") {
            if (main.modularFunctions.inChat() == false) {
              callback();
            }
          }
        },
        scale: function () {
          let menuMaxWidth = main.accessableElements.mainMenu.offsetWidth,
            menuMaxHeight = main.accessableElements.mainMenu.offsetHeight;
          return {
            x:
              (((menuMaxWidth -
                (menuMaxWidth -
                  main.accessableElements.mainMenu.getBoundingClientRect()
                    .width)) /
                menuMaxWidth) *
                100) /
              100,
            y:
              (((menuMaxHeight -
                (menuMaxHeight -
                  main.accessableElements.mainMenu.getBoundingClientRect()
                    .height)) /
                menuMaxHeight) *
                100) /
              100,
          };
        },
      },
      helperFunctions: {
        handleZ_Index: () => {
          main.modularFunctions.inChat() == true
            ? (main.accessableElements.mainMenu.style.zIndex = "5")
            : (main.accessableElements.mainMenu.style.zIndex = "14");
        },
        stopUpgradeMenu: () => {
          if (main.accessableElements.mainMenu.info.properties.scale().x > 0) {
            document.getElementsByClassName(
              "hud-building-overlay hud-tooltip hud-tooltip-top"
            )[0].style.display = "none";
          }
        },
      },
    },
    {
      name: "transitionMenuDiv",
      type: "div",
      attributes: {
        className: "menu hud-building-overlay hud-tooltip hud-tooltip-top",
      },
      parent: "mainMenu",
      properties: { state: "default" },
    },
    {
      name: "menuButtonsContainer",
      type: "div",
      attributes: {
        innerHTML: `
        <button class="activateSpectateMenu"><span></span></button>
              <button class="activatePetMenu"><span></span></button>`,
        className: "activateMenuButtonsContainer",
      },
      parent: "mainMenu",
      properties: {
        active: false,
        activated: function (changeActiveState) {
          main.accessableElements.menuButtonsContainer.style.left = "100%";
          main.accessableElements.menuButtonsContainer.style.opacity = "1";
          main.accessableElements.menuButtonsContainer.style.pointerEvents =
            "all";
          main.accessableElements.menuButtonsContainer.style.zIndex = "2";
          if (!changeActiveState) {
            this.active = true;
          }
        },
        deactivated: function (changeActiveState) {
          main.accessableElements.menuButtonsContainer.style.opacity = "0";
          var containerClient =
              main.accessableElements.menuButtonsContainer.getBoundingClientRect(),
            mainMenuClient =
              main.accessableElements.mainMenu.getBoundingClientRect();
          main.accessableElements.menuButtonsContainer.style.left = `${(
            100 -
            ((mainMenuClient.width -
              (mainMenuClient.width - containerClient.width)) /
              mainMenuClient.width) *
              100
          ).toFixed(2)}%`;
          main.accessableElements.menuButtonsContainer.style.pointerEvents =
            "none";
          main.accessableElements.menuButtonsContainer.style.zIndex = "-1";
          if (!changeActiveState) {
            this.active = false;
          }
        },
          getVisibleButtons: () => {
           let visibleChildren = 0;
          main.accessableElements.menuButtonsContainer
            .querySelectorAll("button")
            .forEach((button) => {
              button.getBoundingClientRect().width > 0
                ? visibleChildren++
                : null;
            });
         return visibleChildren
          }
      },
    },
    {
      name: "tooltipPlayerHealthP",
      type: "p",
      attributes: {
        className: "playerHealth",
      },
      parent: function () {
        return document
          .getElementsByClassName("mainMenu")[0]
          .getElementsByClassName("hud-tooltip-health")[0];
      },
    },
    {
      name: "switchButton",
      type: "button",
      attributes: {
        className: "switchButton",
        innerHTML: `
          <p>></p>
          `,
      },
      parent: "mainMenu",
      properties: {
        activated: () => {
          if (
            main.accessableElements.transitionMenuDiv.info.properties.state ==
            "default"
          ) {
            main.accessableElements.menuButtonsContainer.info.properties.activated();
            main.accessableElements.switchButton.getElementsByTagName(
              "p"
            )[0].style.transform = "translate(-50%,-50%) rotateY(180deg)";
          }
        },
        deactivated: () => {
          if (
            main.accessableElements.transitionMenuDiv.info.properties.state ==
            "default"
          ) {
            main.accessableElements.menuButtonsContainer.info.properties.deactivated();
            main.accessableElements.switchButton.getElementsByTagName(
              "p"
            )[0].style.transform = "translate(-50%,-50%) rotateX(0deg)";
          } else {
            main.accessableElements.switchButton.getElementsByTagName(
              "p"
            )[0].style.transform = "translate(-50%,-50%) rotateX(0deg)";
            main.accessableElements.switchButton.style.left = "87.5%";
            main.accessableElements.mainMenu.getElementsByClassName(
              "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
            )[0].style.opacity = "1";
            main.accessableElements.mainMenu.getElementsByClassName(
              "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
            )[0].style.pointerEvents = "all";
            main.accessableElements.transitionMenuDiv.style.pointerEvents =
              "none";
            main.accessableElements.transitionMenuDiv.style.left = "-50%";
            main.accessableElements.transitionMenuDiv.style.opacity = "0";
            main.accessableElements.transitionMenuDiv.info.properties.state =
              "default";
            main.accessableElements.menuButtonsContainer.info.properties.deactivated();
          }
        },
      },
    },
    {
      name: "spectatingText",
      type: "span",
      attributes: {
        className: "spectatemenu-spectating",
        innerText: "Spectating...",
      },
      parent: "mainMenu",
    },
    {
      name: "notification",
      type: "div",
      attributes: {
        className: "notification",
        style: `
         width: 300px;
height: 50px;
background: rgba(0,0,0,0.4);
border-top-right-radius: 5px;
border-bottom-right-radius: 5px;
position: absolute;
overflow: hidden;
top: 0%;
left: -300px;
transition: all 0.4s;
z-index: 14;
       `,
        innerHTML: `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
<style>
.label {
  color: #EAFAF1;
  position: absolute;
  top: -40%;
  left: 3.5%;
  font-weight: normal;
}
.coloured-div {
  width: 290px;
  height: 30px;
  left: 3.5%;
  top: 40%;
  background: rgba(71, 149, 13, 1);
  position: absolute;
  border-top-left-radius: 5px;
  transition: all 0.3s;
}
.text-div {
  background: transparent;
  width: 95%;
  heigth: 80%;
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 4px;
  text-align: justify;
}
.text-div p {
  font-size: 13px;
  color: #EAFAF1;
  font-family: "Hammersmith One";
  position: absolute;
  top: -50%;
  left: -1%;
}
.text-div i {
  color: rgba(234, 250, 241, 0.8);
  position: relative;
  left: 95%;
  transform: translateY(-5%);
  cursor: pointer;
  transition: color 0.2s;
}
.text-div i:hover{
  color: rgba(234, 250, 241, 1);
}
.errors {
  position: absolute;
  font-size: 64%;
  left: 48%;
  top: -18%;
  color: #EAFAF1;
  opacity: 0;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 3px;
  padding-left: 1.2%;
  padding-right: 1.2%;
  padding-top: 0.4%;
  padding-bottom: 0.4%;
  transition: all 0.2s;
}
</style>
<p class="errors">0</p>
<h4 class="label">Better player info</h4>
<div class="coloured-div">
<div class="text-div">
<p>Everything looks good!</p>
<i class="fas fa-check"></i>
</div>
</div>`,
      },
      parent: document.getElementsByClassName("hud")[0],
      properties: {
        singleUseFunctions: {
          getColor: function () {
            if (!main.accessableElements.notification.info.properties.color) {
              main.accessableElements.notification.info.properties.color =
                getComputedStyle(
                  main.accessableElements.notification.getElementsByClassName(
                    "coloured-div"
                  )[0]
                )["background-color"];
            }
          },
          getLabelText: function () {
            if (
              !main.accessableElements.notification.info.properties.labelText
            ) {
              main.accessableElements.notification.info.properties.labelText =
                main.accessableElements.notification.getElementsByClassName(
                  "label"
                )[0].innerText;
            }
          },
          getMessage: function () {
            if (!main.accessableElements.notification.info.properties.message) {
              main.accessableElements.notification.info.properties.message =
                main.accessableElements.notification
                  .getElementsByClassName("text-div")[0]
                  .getElementsByTagName("p")[0].innerText;
            }
          },
        },
        status: 200,
        icon: () => {
          return main.accessableElements.notification
            .getElementsByClassName("coloured-div")[0]
            .getElementsByTagName("i")[0];
        },
        error: () => {
          return main.accessableElements.notification.getElementsByClassName(
            "errors"
          )[0];
        },
        allowReshow: true,
        queuedTime: 0,
        lastShowCalled: { time: 0, revealAfter: 0 },
        show: function (time, revealAfter) {
          if (main.properties.showNotifications) {
            this.lastShowCalled.time = time;
            this.lastShowCalled.revealAfter = revealAfter;
            if (this.queuedTime + time > 60000) time = 60000;
            else this.queuedTime += time;
            setTimeout(
              () => {
                if (this.allowReshow)
                  main.accessableElements.notification.style.left = "0px";
                this.allowReshow = false;
                if (!handlerAvailable) setHandler();
              },
              revealAfter ? revealAfter : 100
            );
          }
        },
        errors: 0,
        updateErrors: function (number) {
          if (number && number > 0) {
            this.error().style.opacity = 1;
            this.error().innerText = main.modularFunctions.numberToSI(number);
          } else if (!number && this.errors > 0) {
            this.error().style.opacity = 1;
            this.error().innerText = main.modularFunctions.numberToSI(
              this.errors
            );
          }
        },
        errorOccurred: function (showFor, revealAfter) {
          this.status = 500;
          this.show(showFor ?? 5000, revealAfter ?? 500);
          this.errors++;
          this.updateErrors();
        },
      },
      helperFunctions: {
        getCSSproperty: (propertyName) => {
          return getComputedStyle(main.accessableElements.notification)[
            propertyName
          ];
        },
        setCSSproperty: (propertyName, value) => {
          return (main.accessableElements.notification.style[propertyName] =
            value);
        },
      },
    },
  ],
  cursor: {
    client: {
      x: 0,
      y: 0,
      target: document.body,
    },
  },
  accessableMenus: {},
  availableMenus: [
    {
      id: "petMenu",
      HTML: `
      <div class="hud-tooltip-building" style="transition: transform 0.3s">
    <h2 class="pet-Name">Undefined</h2>
    <h3 style="position: relative; left: 0px">
      Uid: <span class="hud-building-tier pet-Uid">000000000</span>
    </h3>
    <ul class="healthbars-container" style="left: 60%; top: -38%">
      <li class="hud-tooltip-health">
        <span
          class="hud-tooltip-health-bar"
          style="
            width: 100%;
            transition: all 0.2s;
            background: rgb(71, 149, 13);
          "
        ></span>
      </li>
    </ul>
    <div class="hud-tooltip-body">
      <div class="hud-building-stats">
        <button class="partyBtn" style="display: none">Join</button>
        <div class="hud-stats-current hud-stats-values">
          <p>
            Health: <strong class="hud-stats-current pet-Health">Null</strong>
          </p>
          <p>
            Level/Tier:
            <strong class="hud-stats-current pet-Level/Tier">Null</strong>
          </p>
          <p>
            Experience: <strong class="hud-stats-current pet-Exp">Null</strong>
          </p>
        </div>
        <div class="hud-stats-next hud-stats-values">
          <p style="display: none">
            Party: <strong class="hud-stats-next party-Name">Null</strong>
          </p>
        </div>
      </div>
      <p class="hud-building-actions" style="display: block">
        <span class="hud-building-dual-btn" style="display: none" <="" span="">
        </span>
      </p>
    </div>
  </div>
  <div class="petNotFound">
    <h2 align="center" style="margin-top: 15%; color: #b3353c">
      Pet not found!
    </h2>
    <p
      class="reasons"
      style="
        position: relative;
        color: #b3353c;
        font-weight: bold;
        margin-top: 0%;
        transition: all 0.3s;
      "
      align="center"
    >
      Reasons:
    </p>
    <h3
      align="center"
      style="
        position: relative;
        color: #b3353c;
        font-weight: bold;
        margin-top: -2%;
        transition: all 0.3s;
      "
    >
      Waiting for the pet... <i class="fas fa-circle-notch spinner"></i>
    </h3>
  </div>

    `,
      activatedOnce: false,
      whenActive: () => {
        let petNotFound =
            main.accessableElements.transitionMenuDiv.getElementsByClassName(
              "petNotFound"
            )[0],
          transitionMenuDiv = main.accessableElements.transitionMenuDiv;
        if (!main.availableMenus[0].activatedOnce) {
          let i = 0,
            reasonsArray = [
              "Pet is dead,",
              "He is out of your screen,",
              "Or the player doesn't have one yet.",
            ];
          setInterval(() => {
            let reasons =
              main.accessableElements.transitionMenuDiv.getElementsByClassName(
                "reasons"
              )[0];
            if (reasons) {
              i < reasonsArray.length == false ? (i = 0) : (i = i);
              if (i < reasonsArray.length) {
                reasons.style.opacity = "0";
                setTimeout(() => {
                  reasons.style.opacity = "1";
                  reasons.innerText = "Reasons: " + reasonsArray[i];
                  i++;
                }, 300);
              }
            }
          }, 3000);
          main.availableMenus[0].activatedOnce = true;
        }
        if (
          game.world.entities[main.properties.activePlayerUid] !== undefined &&
          main.properties.activePlayerUid !== undefined
        ) {
          if (
            game.world.entities[
              game.world.entities[main.properties.activePlayerUid].targetTick
                .petUid
            ] !== undefined
          ) {
            if (
              game.world.entities[
                game.world.entities[main.properties.activePlayerUid].targetTick
                  .petUid
              ].isInViewport() == true
            ) {
              var pet =
                game.world.entities[
                  game.world.entities[main.properties.activePlayerUid]
                    .targetTick.petUid
                ];
              petNotFound.style.opacity = "0";
              petNotFound.style.pointerEvents = "none";
              transitionMenuDiv.getElementsByClassName(
                "hud-tooltip-building"
              )[0].style.transform = "scale(1,1)";
              transitionMenuDiv.getElementsByClassName(
                "pet-Name"
              )[0].innerText = pet.targetTick.model;
              transitionMenuDiv.getElementsByClassName("pet-Uid")[0].innerText =
                pet.targetTick.uid;
              transitionMenuDiv.getElementsByClassName(
                "pet-Health"
              )[0].innerText = pet.targetTick.health.toFixed(1);
              transitionMenuDiv.getElementsByClassName(
                "pet-Level/Tier"
              )[0].innerText =
                pet.currentModel.experienceBar.level +
                "/" +
                pet.targetTick.tier;
              transitionMenuDiv.getElementsByClassName("pet-Exp")[0].innerText =
                pet.targetTick.experience;
              transitionMenuDiv.getElementsByClassName(
                "hud-tooltip-health-bar"
              )[0].style.width =
                100 -
                ((pet.targetTick.maxHealth - pet.targetTick.health) /
                  pet.targetTick.maxHealth) *
                  100 +
                "%";
            }
          } else {
            if (main.properties.activePlayerUid !== undefined) {
              if (
                game.world.entities[
                  game.world.entities[main.properties.activePlayerUid]
                    .targetTick.petUid
                ] == undefined
              ) {
                transitionMenuDiv.getElementsByClassName(
                  "hud-tooltip-building"
                )[0].style.transform = "scale(0,0)";
                petNotFound.style.pointerEvents = "all";
                petNotFound.style.opacity = "1";
              }
            }
          }
        }
      },
    },
    {
      id: "SpectateMenu",
      HTML: `<button class="spectatemenu-button" style="margin-top: 5px;"><span class="spectatemenu-icon"></span><span class="spectatemenu-name">Unset</span><span class="spectatemenu-rank">Leader</span></button><button class="spectatemenu-button"><span class="spectatemenu-icon"></span><span class="spectatemenu-name">Unset</span><span class="spectatemenu-rank">Leader</span></button><button class="spectatemenu-button"><span class="spectatemenu-icon"></span><span class="spectatemenu-name">Unset</span><span class="spectatemenu-rank">Leader</span></button><button class="spectatemenu-button"><span class="spectatemenu-icon"></span><span class="spectatemenu-name">Unset</span><span class="spectatemenu-rank">Leader</span></button><div class="spectatemenu-background"></div>`,
      whenActive: function () {
        let allMembers = game.ui.playerPartyMembers,
          activeIndex = 0;
        Object.keys(main.accessableElements.transitionMenuDiv.children).forEach(
          (element, index) => {
            let currentElement =
              main.accessableElements.transitionMenuDiv.children[element];
            currentElement.onmousedown = (event) => {
              let id = event.target.id || event.target.parentNode.id,
                allMembers = game.ui.playerPartyMembers;
              if (id) {
                let currentPlayer = allMembers.find(
                  (member) => member.playerUid == id
                );
                if (currentPlayer) {
                  main.accessableElements.mainMenu.getElementsByClassName(
                    "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
                  )[0].style.opacity = "1";
                  main.accessableElements.mainMenu.getElementsByClassName(
                    "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
                  )[0].style.pointerEvents = "all";
                  main.accessableElements.transitionMenuDiv.style.pointerEvents =
                    "none";
                  main.accessableElements.transitionMenuDiv.style.left = "-50%";
                  main.accessableElements.transitionMenuDiv.style.opacity = "0";
                  main.accessableElements.transitionMenuDiv.info.properties.state =
                    "default";
                  main.properties.activePlayerUid = currentPlayer.playerUid;
                  main.properties.isSpectating = true;
                }
              }
            };
            if (currentElement.nodeName.toUpperCase() == "BUTTON") {
              if (
                index < allMembers.length &&
                allMembers[index].playerUid !==
                  main.properties.activePlayerUid &&
                allMembers[index].playerUid !== game.ui.playerTick.uid
              ) {
                currentElement.id = allMembers[index].playerUid;
                currentElement.getElementsByClassName(
                  "spectatemenu-name"
                )[0].innerText = allMembers[index].displayName;
                activeIndex++;
                if (activeIndex == 1) {
                  currentElement.style.display = "block";
                  setTimeout(() => {
                    currentElement.style.left = "5%";
                  }, 200);
                  currentElement.style.marginTop = "6px";
                } else {
                  currentElement.style.display = "block";
                  setTimeout(() => {
                    currentElement.style.left = "5%";
                  }, 200);
                  currentElement.style.left = "5%";
                  currentElement.style.marginTop = "0px";
                }
              } else {
                currentElement.getElementsByClassName(
                  "spectatemenu-name"
                )[0].innerText = "Unknown";
                setTimeout(() => {
                  currentElement.style.display = "none";
                }, 100);
                currentElement.style.left = "-100%";
              }
            }
          }
        );
      },
      deactivated: function () {
        let spectateMenu = main.availableMenus.find((menu) =>
          menu.id.toUpperCase().includes("SPECTATE")
        );
        main.properties.activePlayerUid = game.ui.playerTick.uid;
        main.accessableElements.mainMenu.getElementsByClassName(
          "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
        )[0].style.opacity = "0";
        main.accessableElements.mainMenu.getElementsByClassName(
          "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
        )[0].style.pointerEvents = "all";
        main.accessableElements.transitionMenuDiv.style.left = "50%";
        main.accessableElements.transitionMenuDiv.info.properties.state =
          spectateMenu.id;
        main.accessableElements.transitionMenuDiv.innerHTML = spectateMenu.HTML;
        main.accessableElements.transitionMenuDiv.style.opacity = "1";
        main.accessableElements.switchButton.style.left = "-4%";
        main.accessableElements.menuButtonsContainer.info.properties.deactivated(
          true
        );
        main.properties.isSpectating = false;
      },
      getAllMembers: function () {
          if(game.network.connected && game.world.inWorld && game.ui?.playerTick){
        let members = game.ui.playerPartyMembers,
          countedMembers = 0;
        members.forEach((member) => {
          if (
            member.playerUid !== main.properties.activePlayerUid &&
            member.playerUid !== game.ui.playerTick.uid
          ) {
            countedMembers++;
          }
        });
        return countedMembers;
          }
      },
    },
  ],
  icons: [
    {
      for: "petMenu",
      check: function () {
        if (!main.properties.global.pet) return false;
        else if (
          main.properties.global.pet &&
          main.properties.global.pet.targetTick.model
            .toUpperCase()
            .includes("CARL")
        )
          return "https://cdn.discordapp.com/attachments/853498284484460574/940110415755608084/Carl-Weapon.png";
        else if (
          main.properties.global.pet &&
          main.properties.global.pet.targetTick.model
            .toUpperCase()
            .includes("MINER")
        )
          return "https://cdn.discordapp.com/attachments/853498284484460574/940114196291539024/pet-miner-t3-weapon.png";
      },
    },
    {
      for: "spectateMenu",
      check: function () {
        if (main.accessableMenus.SpectateMenu.getAllMembers()) return true;
        else return false;
      },
    },
  ],
};
main.modularFunctions.arrayToHTML(main.elements);
window.betterPlayerInfo = main;
main.modularFunctions.handleSingleUseFunctions(
  main.accessableElements.notification.info.properties
);
window.addEventListener("mousedown", (client) => {
  main.cursor.client = client;
});
main.availableMenus.forEach((menu) => {
  main.accessableMenus[menu.id] = menu;
});
main.accessableElements.menuButtonsContainer.style.top = `${
  98 - (main.accessableElements.menuButtonsContainer.childElementCount - 1) * 10
}%`;
function handleMenuActivation() {
  main.accessableElements.menuButtonsContainer.addEventListener(
    "mousedown",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.target.nodeName == "BUTTON") {
        main.availableMenus.forEach((menu) => {
          if (
            event.target.className.toUpperCase().includes(menu.id.toUpperCase())
          ) {
            main.accessableElements.mainMenu.getElementsByClassName(
              "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
            )[0].style.opacity = "0";
            main.accessableElements.mainMenu.getElementsByClassName(
              "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
            )[0].style.pointerEvents = "all";
            main.accessableElements.transitionMenuDiv.info.properties.state =
              menu.id;
            main.accessableElements.transitionMenuDiv.innerHTML = menu.HTML;
            main.accessableElements.transitionMenuDiv.style.opacity = "1";
            main.accessableElements.switchButton.style.left = "-4%";
            main.accessableElements.menuButtonsContainer.info.properties.deactivated(
              true
            );
            main.accessableElements.transitionMenuDiv.style.left = "50%";
          }
        });
      }
    }
  );
}
handleMenuActivation();
function handleSpectateButtonStyle() {
  let root = document.querySelector(":root");
  if (main.accessableMenus.SpectateMenu.getAllMembers() == 1) {
    root.style.setProperty("--spectatemenu-buttons-height", "81%");
    root.style.setProperty("--spectatemenu-buttons-icon-width", "100%");
    root.style.setProperty("--spectatemenu-buttons-icon-height", "40%");
    root.style.setProperty("--spectatemenu-buttons-name-fontSize", "41px");
    root.style.setProperty("--spectatemenu-buttons-name-top", "45%");
    main.accessableElements.transitionMenuDiv
      .querySelectorAll(".spectatemenu-name")
      .forEach((name) => {
        name.style.left = "50%";
        name.style.transform = "translateX(-50%)";
      });
    main.accessableElements.transitionMenuDiv
      .querySelectorAll(".spectatemenu-rank")
      .forEach((rank) => {
        rank.style.left = "50%";
        rank.style.transform = "translateX(-50%)";
        rank.style.bottom = "1%";
      });
    root.style.setProperty("--spectatemenu-buttons-rank-fontSize", "25px");
  } else if (main.accessableMenus.SpectateMenu.getAllMembers() == 2) {
    root.style.setProperty("--spectatemenu-buttons-height", "38.5%");
    root.style.setProperty("--spectatemenu-buttons-icon-width", "15%");
    root.style.setProperty("--spectatemenu-buttons-icon-height", "100%");
    root.style.setProperty("--spectatemenu-buttons-name-fontSize", "25px");
    root.style.setProperty("--spectatemenu-buttons-name-top", "10%");
    root.style.setProperty("--spectatemenu-buttons-name-left", "17%");
    main.accessableElements.transitionMenuDiv
      .querySelectorAll(".spectatemenu-name")
      .forEach((name) => {
        name.style.left = "15%";
        name.style.transform = "translateX(0)";
      });
    main.accessableElements.transitionMenuDiv
      .querySelectorAll(".spectatemenu-rank")
      .forEach((rank) => {
        rank.style.left = "18%";
        rank.style.bottom = "1%";
        rank.style.transform = "translateX(0)";
      });
    root.style.setProperty("--spectatemenu-buttons-rank-fontSize", "23px");
  } else if (main.accessableMenus.SpectateMenu.getAllMembers() == 3) {
    root.style.setProperty("--spectatemenu-buttons-height", "24%");
    root.style.setProperty("--spectatemenu-buttons-icon-width", "10%");
    root.style.setProperty("--spectatemenu-buttons-icon-height", "100%");
    root.style.setProperty("--spectatemenu-buttons-name-fontSize", "17px");
    root.style.setProperty("--spectatemenu-buttons-name-top", "10%");
    main.accessableElements.transitionMenuDiv
      .querySelectorAll(".spectatemenu-name")
      .forEach((name) => {
        name.style.transform = "translateX(0)";
        name.style.left = "12%";
      });
    main.accessableElements.transitionMenuDiv
      .querySelectorAll(".spectatemenu-rank")
      .forEach((rank) => {
        rank.style.left = "12%";
        rank.style.bottom = "2%";
        rank.style.transform = "translateX(0)";
      });
    root.style.setProperty("--spectatemenu-buttons-rank-fontSize", "15px");
  }
}
function handlePlayerTracking(e) {
  try {
    if (game.network.connected && game.world.inWorld && main.properties.allowRetrack) {
      main.properties.allowRetrack = false;
      if (
        main.accessableElements.transitionMenuDiv.info.properties.state ==
        "default"
      ) {
        document.getElementsByClassName(
          "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
        )[0].style.opacity = "1";
        main.accessableElements.mainMenu.getElementsByClassName(
          "hud-building-overlay hud-tooltip hud-tooltip-top info-container"
        )[0].style.pointerEvents = "all";
      }
      main.properties.playerTracker.mainPlayer.mousePosition =
        game.ui.mousePosition;
      main.properties.playerTracker.mainPlayer.mousePositionX =
        main.properties.playerTracker.mainPlayer.mousePosition.x;
      main.properties.playerTracker.mainPlayer.mousePositionY =
        main.properties.playerTracker.mainPlayer.mousePosition.y;
      main.properties.playerTracker.mainPlayer.convertedMousePositionX =
        game.renderer.screenToWorld(
          main.properties.playerTracker.mainPlayer.mousePositionX,
          main.properties.playerTracker.mainPlayer.mousePositionY
        ).x;
      main.properties.playerTracker.mainPlayer.convertedMousePositionY =
        game.renderer.screenToWorld(
          main.properties.playerTracker.mainPlayer.mousePositionX,
          main.properties.playerTracker.mainPlayer.mousePositionY
        ).y;
      Object.entries(game.world.entities).forEach((player) => {
        if (player[1].entityClass == "PlayerEntity") {
          main.properties.playerTracker.mainPlayer.calculatedX =
            player[1].targetTick.position.x -
            main.properties.playerTracker.mainPlayer.convertedMousePositionX;
          main.properties.playerTracker.mainPlayer.calculatedY =
            player[1].targetTick.position.y -
            main.properties.playerTracker.mainPlayer.convertedMousePositionY;
          main.properties.playerTracker.mainPlayer.distance = Math.sqrt(
            main.properties.playerTracker.mainPlayer.calculatedX *
              main.properties.playerTracker.mainPlayer.calculatedX +
              main.properties.playerTracker.mainPlayer.calculatedY *
                main.properties.playerTracker.mainPlayer.calculatedY
          );
          main.properties.playerTracker.mainPlayer.mouseDistanceFromPlayer =
            main.properties.playerTracker.mainPlayer.distance +
            player[1].currentModel.base.node.width;
          if (
            main.properties.playerTracker.mainPlayer.mouseDistanceFromPlayer <
              99 &&
            !main.properties.isSpectating
          ) {
            main.properties.activePlayerUid = player[1].targetTick.uid;
          }
        }
      });
      if (
        game.world.entities[main.properties.activePlayerUid] ||
        main.properties.activePlayerUid !== game.ui.playerTick.uid
      ) {
        if (game.world.entities[main.properties.activePlayerUid]) {
          main.properties.playerTracker.targetedPlayer.mousePosition =
            game.ui.mousePosition;
          main.properties.playerTracker.targetedPlayer.mousePositionX =
            main.properties.playerTracker.targetedPlayer.mousePosition.x;
          main.properties.playerTracker.targetedPlayer.mousePositionY =
            main.properties.playerTracker.targetedPlayer.mousePosition.y;
          main.properties.playerTracker.targetedPlayer.convertedMousePositionX =
            game.renderer.screenToWorld(
              main.properties.playerTracker.targetedPlayer.mousePositionX,
              main.properties.playerTracker.targetedPlayer.mousePositionY
            ).x;
          main.properties.playerTracker.targetedPlayer.convertedMousePositionY =
            game.renderer.screenToWorld(
              main.properties.playerTracker.targetedPlayer.mousePositionX,
              main.properties.playerTracker.targetedPlayer.mousePositionY
            ).y;
          main.properties.playerTracker.targetedPlayer.calculatedX =
            game.world.entities[main.properties.activePlayerUid].targetTick
              .position.x -
            main.properties.playerTracker.targetedPlayer
              .convertedMousePositionX;
          main.properties.playerTracker.targetedPlayer.calculatedY =
            game.world.entities[main.properties.activePlayerUid].targetTick
              .position.y -
            main.properties.playerTracker.targetedPlayer
              .convertedMousePositionY;
          main.properties.playerTracker.targetedPlayer.distance = Math.sqrt(
            main.properties.playerTracker.targetedPlayer.calculatedX *
              main.properties.playerTracker.targetedPlayer.calculatedX +
              main.properties.playerTracker.targetedPlayer.calculatedY *
                main.properties.playerTracker.targetedPlayer.calculatedY
          );
          main.properties.playerTracker.targetedPlayer.mouseDistanceFromPlayer =
            main.properties.playerTracker.targetedPlayer.distance + 80;
        }
        if (
          game.world.entities[main.properties.activePlayerUid] &&
          main.properties.playerTracker.targetedPlayer.mouseDistanceFromPlayer
        ) {
          main.properties.displayMainMenu = true;
          if (
            game.world.entities[main.properties.activePlayerUid] !== undefined
          ) {
            window.mainMenuX =
              game.renderer.worldToScreen(
                game.world.entities[main.properties.activePlayerUid].targetTick
                  .position.x,
                game.world.entities[main.properties.activePlayerUid].targetTick
                  .position.y
              ).x -
              200 +
              "px";
            window.mainMenuY =
              game.renderer.worldToScreen(
                game.world.entities[main.properties.activePlayerUid].targetTick
                  .position.x,
                game.world.entities[main.properties.activePlayerUid].targetTick
                  .position.y
              ).y -
              290 +
              "px";
            if (main.properties.isSpectating) {
              window.mainMenuX =
                game.renderer.worldToScreen(
                  game.world.entities[game.ui.playerTick.uid].targetTick
                    .position.x,
                  game.world.entities[game.ui.playerTick.uid].targetTick
                    .position.y
                ).x -
                200 +
                "px";
              window.mainMenuY =
                game.renderer.worldToScreen(
                  game.world.entities[game.ui.playerTick.uid].targetTick
                    .position.x,
                  game.world.entities[game.ui.playerTick.uid].targetTick
                    .position.y
                ).y -
                290 +
                "px";
            }
          }
          if (parseInt(mainMenuX) < 0) {
            main.accessableElements.mainMenu.style.left = "0px";
          } else {
            if (parseInt(mainMenuX) > window.innerWidth - 360) {
              main.accessableElements.mainMenu.style.left =
                window.innerWidth - 360 + "px";
            } else {
              main.accessableElements.mainMenu.style.left = mainMenuX;
            }
          }
          if (parseInt(mainMenuY) < 0) {
            main.accessableElements.mainMenu.style.top = "0px";
          } else {
            if (
              parseInt(mainMenuY) >
              window.innerHeight -
                main.accessableElements.mainMenu
                  .getElementsByClassName("hud-building-overlay")[0]
                  .getBoundingClientRect().height
            ) {
              main.accessableElements.mainMenu.style.top =
                window.innerHeight -
                main.accessableElements.mainMenu
                  .getElementsByClassName("hud-building-overlay")[0]
                  .getBoundingClientRect().height +
                "px";
            } else {
              main.accessableElements.mainMenu.style.top = mainMenuY;
            }
          }
        }
        if (main.properties.displayMainMenu == true) {
          document.getElementsByClassName(
            "hud-building-overlay hud-tooltip hud-tooltip-top"
          )[0].style.display = "none";
          if (
            main.accessableElements.transitionMenuDiv.info.properties.state ==
            "default"
          ) {
            main.accessableElements.mainMenu.style.transform =
              "scale(1) rotate(0deg)";
          }
          main.accessableElements.mainMenu.style.pointerEvents = "all";
        } else if (main.properties.displayMainMenu == false) {
          if (
            main.accessableElements.transitionMenuDiv.info.properties.state ==
            "default"
          ) {
            main.accessableElements.mainMenu.style.transform =
              "scale(0) rotate(0deg)";
            main.accessableElements.mainMenu.style.pointerEvents = "none";
          }
        }
      }
      setTimeout(() => {
        main.properties.allowRetrack = true;
      }, main.properties.retargetAfter);
    }
  } catch (err) {
    main.accessableElements.notification.info.properties.errorOccurred();
    console.error(
      `Better player info: Error! From: "mouseMovedFunction()"\n${err}`
    );
  }
}
main.accessableElements.switchButton.addEventListener("mousedown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (main.properties.isSpectating) {
    let spectateMenu = main.availableMenus.find((menu) =>
      menu.id.toUpperCase().includes("SPECTATE")
    );
    spectateMenu.deactivated();
  } else if (
    main.accessableElements.menuButtonsContainer.info.properties.active ==
      false &&
    main.accessableElements.transitionMenuDiv.info.properties.state == "default"
  ) {
    main.accessableElements.menuButtonsContainer.info.properties.activated();
    main.accessableElements.switchButton.info.properties.activated();
  } else if (
    main.accessableElements.menuButtonsContainer.info.properties.active == true
  ) {
    main.accessableElements.switchButton.info.properties.deactivated();
  }
});
main.accessableElements.switchButton.addEventListener("dblclick", (e) => {
  e.preventDefault();
  e.stopPropagation();
});
function allowMouseMove(e) {
  var key = e.keyCode || e.whichKey;
  if (key == 18 && main.properties.allowMouseMove == false) {
    e.preventDefault();
    main.properties.allowMouseMove = true;
    document.addEventListener("mousemove", handlePlayerTracking);
  } else if (key == 16) {
    if (main.modularFunctions.inChat() == false) {
      main.accessableElements.mainMenu.style.transform = "scale(0)";
      main.accessableElements.mainMenu.style.pointerEvents = "none";
    }
  }
}
function rejectMouseMove(e) {
  var key = e.keyCode || e.whichKey;
  if (key == 18 && main.properties.allowMouseMove == true) {
    e.preventDefault();
    main.properties.allowMouseMove = false;
    document.removeEventListener("mousemove", handlePlayerTracking);
  } else if (key == 16) {
    main.accessableElements.mainMenu.info.properties.closedThrough("shiftkey");
  }
}
document.addEventListener("keydown", allowMouseMove);
document.addEventListener("keyup", rejectMouseMove);
main.accessableElements.mainMenu.style.transform = "scale(0) rotate(0deg)";
(window.shieldBar =
  main.accessableElements.mainMenu.getElementsByClassName("shield-bar")[0]),
  (window.menuButtonsContainer =
    main.accessableElements.mainMenu.getElementsByClassName(
      "activateMenuButtonsContainer"
    )[0]);
window.notification = main.accessableElements.notification;
let handlerAvailable = false;
function setHandler() {
  if (!handlerAvailable) {
    handlerAvailable = true;
    let handleNotificationVisibility = setInterval(() => {
      if (main.accessableElements.notification.info.properties.queuedTime < 1) {
        handlerAvailable = false;
        clearInterval(handleNotificationVisibility);
        setTimeout(() => {
          main.accessableElements.notification.info.properties.allowReshow = true;
        }, main.accessableElements.notification.info.properties.lastShowCalled.revealAfter);
        main.accessableElements.notification.style.left =
          -main.accessableElements.notification.offsetWidth + "px";
      } else {
        main.accessableElements.notification.info.properties.queuedTime -= 100;
      }
    }, 100);
  }
}
function updateNotificationProperties() {
  main.accessableElements.notification.getElementsByClassName(
    "coloured-div"
  )[0].style.background =
    main.accessableElements.notification.info.properties.color;
  main.accessableElements.notification.getElementsByClassName(
    "label"
  )[0].innerText =
    main.accessableElements.notification.info.properties.labelText;
  main.accessableElements.notification
    .getElementsByClassName("text-div")[0]
    .getElementsByTagName("p")[0].innerText =
    main.accessableElements.notification.info.properties.message;
}
function checkNotificationStatus() {
  if (main.accessableElements.notification.info.properties.status == 200) {
    main.accessableElements.notification.info.properties.color =
      "rgba(71, 149, 13, 1)";
    main.accessableElements.notification.info.properties.icon().className =
      "fas fa-check";
    main.accessableElements.notification.info.properties.message =
      "Everything looks good!";
  } else if (
    main.accessableElements.notification.info.properties.status == 500
  ) {
    main.accessableElements.notification.info.properties.color =
      "rgba(179, 53, 60, 1)";
    main.accessableElements.notification.info.properties.icon().className =
      "fas fa-times";
    main.accessableElements.notification.info.properties.message =
      "There's an Error! Try reloading.";
  } else if (
    (main.accessableElements.notification.info.properties.status = 201)
  ) {
    main.accessableElements.notification.info.properties.color =
      "rgba(241, 196, 15, 1)";
    main.accessableElements.notification.info.properties.icon().className =
      "fas fa-times";
    main.accessableElements.notification.info.properties.message =
      "Alt + Hover to Activate!";
  }
}
main.accessableElements.notification.info.properties.icon().onmousedown = () =>
  (main.accessableElements.notification.info.properties.queuedTime = 100);
window.addEventListener("mousedown", (e) => {
  main.accessableElements.mainMenu.info.properties.closedThrough("clicked");
});
function updateInfo(timeStamp) {
  window.requestAnimationFrame(updateInfo);
  main.properties.updater.calculationProcesses.timeSinceLastFrame =
    timeStamp - main.properties.updater.calculationProcesses.lastFrameTime;
  main.properties.iconHandler.mainFunction(timeStamp);
  if (
    main.properties.updater.calculationProcesses.timeSinceLastFrame >=
    1000 / main.properties.updater.clientProcesses.FPSlimit
  ) {
    if (main.properties.displayMainMenu) {
      document.getElementById("hud-popup-overlay").style.zIndex = "15";
    } else {
      document.getElementById("hud-popup-overlay").style.zIndex = "0";
    }
    if (main.properties.isSpectating) {
      main.accessableElements.spectatingText.style.opacity = "1";
      main.accessableElements.spectatingText.style.zIndex = "1";
    } else {
      main.accessableElements.spectatingText.style.opacity = "0";
      main.accessableElements.spectatingText.style.zIndex = "-1";
    }
    main.properties.updater.calculationProcesses.lastFrameTime = timeStamp;
    if (
      new Date() - main.properties.updater.calculationProcesses.storedFPStime >=
      1000
    ) {
      main.properties.updater.calculationProcesses.storedFPStime = new Date();
      main.properties.updater.clientProcesses.currentFPS =
        main.properties.updater.calculationProcesses.FPSstored = 0;
    } else {
      main.properties.updater.calculationProcesses.FPSstored++;
    }
    if (
      main.accessableElements.transitionMenuDiv.info.properties.state ==
      "SpectateMenu"
    ) {
      handleSpectateButtonStyle();
    }
    if (game.network.connected && game.world.inWorld) {
      Object.entries(game.world.entities).forEach((player) => {
        let current = player[1];
        if (
          main.properties.activePlayerUid !== undefined &&
          main.properties.displayMainMenu == true
        ) {
            if(main.accessableElements.menuButtonsContainer.info.properties.getVisibleButtons() == 0){
          if(main.accessableElements.menuButtonsContainer.info.properties.active){
  main.accessableElements.menuButtonsContainer.info.properties.deactivated();
}
  main.accessableElements.switchButton.style.pointerEvents = "none";
  main.accessableElements.switchButton.style.opacity = "0";
  main.accessableElements.switchButton.info.properties.deactivated();
  main.accessableElements.transitionMenuDiv.info.properties.state = "default";
            }
            else{
  main.accessableElements.switchButton.style.pointerEvents = "all";
  main.accessableElements.switchButton.style.opacity = "1";

}
          if (current.targetTick.uid == main.properties.activePlayerUid) {
            try {
              if (
                main.accessableElements.mainMenu.info.properties.scale().x > 0
              ) {
                var playerName =
                  main.accessableElements.mainMenu.getElementsByClassName(
                    "player-Name"
                  )[0];
                let maxLength = 11,
                  mainMenu = main.accessableElements.mainMenu;
                playerName.innerText = player[1].targetTick.name;
                playerName.innerText.length > maxLength
                  ? (playerName.innerText =
                      playerName.innerText.substr(0, maxLength) + "...")
                  : (playerName.innerText = current.targetTick.name);
                playerName.style.height = "31px";
                mainMenu.getElementsByClassName("player-Uid")[0].innerText =
                  current.targetTick.uid;
                mainMenu.getElementsByClassName("player-Wood")[0].innerText =
                  current.targetTick.wood;
                mainMenu.getElementsByClassName("player-Stone")[0].innerText =
                  current.targetTick.stone;
                mainMenu.getElementsByClassName("player-Gold")[0].innerText =
                  current.targetTick.gold;
                mainMenu.getElementsByClassName("player-Score")[0].innerText =
                  current.targetTick.score;
                mainMenu.getElementsByClassName("player-Tokens")[0].innerText =
                  current.targetTick.token;
                mainMenu.getElementsByClassName("player-Health")[0].innerText =
                  current.targetTick.health;
                mainMenu.getElementsByClassName(
                  "hud-tooltip-health-bar"
                )[0].style.width = `${
                  100 -
                  ((current.targetTick.maxHealth - current.targetTick.health) /
                    current.targetTick.maxHealth) *
                    100
                }%`;
                if (current.targetTick.zombieShieldMaxHealth > 0) {
                  mainMenu.getElementsByClassName(
                    "healthbars-container"
                  )[0].style.top = "-26%";
                  mainMenu.getElementsByClassName(
                    "shield-bar"
                  )[0].style.display = "block";
                  mainMenu
                    .getElementsByClassName("shield-bar")[0]
                    .getElementsByTagName("span")[0].style.width = `${
                    100 -
                    ((current.targetTick.zombieShieldMaxHealth -
                      current.targetTick.zombieShieldHealth) /
                      current.targetTick.zombieShieldMaxHealth) *
                      100
                  }%`;
                  mainMenu
                    .getElementsByClassName("shield-bar")[0]
                    .getElementsByTagName("span")[0].style.display = "block";
                } else {
                  mainMenu.getElementsByClassName(
                    "healthbars-container"
                  )[0].style.top = "-24%";
                  mainMenu.getElementsByClassName(
                    "shield-bar"
                  )[0].style.display = "none";
                }
              }
            } catch (err) {
              main.accessableElements.notification.info.properties.errorOccurred();
              console.error(
                `Better player info: Error! From: "Live updating()"\n${err}`
              );
            }
          }
        }
      });
    }
    main.availableMenus.forEach((menu) => {
      if (
        menu.id.toUpperCase() ==
        main.accessableElements.transitionMenuDiv.info.properties.state.toUpperCase()
      ) {
        menu.whenActive?.();
      }
    });
    updateNotificationProperties();
    checkNotificationStatus();
    main.accessableElements.mainMenu.info.helperFunctions.stopUpgradeMenu();
    main.accessableElements.mainMenu.info.helperFunctions.handleZ_Index();
  }
}
updateInfo(0);
main.modularFunctions.onEnteringGame();

//Ca menu shit hope you don't really care
if (window.location !== window.parent.location) {
    onIframe = true;
    game.renderer.ground.setVisible(false);
} else {
    onIframe = false;
}
let CAMenucss = `
.hud-CAMenu-grid3::-webkit-scrollbar-track {
	box-shadow: inset 0 0 5px white;
	border-radius: 10px;
  border: white solid 1px;
  background-color: rgba(0,0,0,0.8);
}
.hud-CAMenu-grid3::-webkit-scrollbar {
   background-color: black;
    border-radius: 10px;
	width: 10px;
  }

.hud-CAMenu-grid3::-webkit-scrollbar-thumb {
   background: rgba(217, 217, 217, 1);
  border-radius: 10px;
  width: 3px;}

.hud-CAMenu-grid3::-webkit-scrollbar-thumb:hover {
    background: rgba(177, 177, 177, 1);
  border-radius: 10px;
   }
.hud-menu-CAMenu {
/*scroll bar*/
/**/
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 100;
}

.hud-menu-CAMenu .hud-CAMenu-grid3 {
display: block;
height: 360px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.3);
overflow: auto;
overflow-x: hidden;
}

.hud-spell-icons .hud-spell-icon[data-type="CAMenu"]::before {
background-image: url("https://th.bing.com/th/id/R.5cd6618415080fdbd991228e34f87e3e?rik=xBPsLZYBsyjj2A&pid=ImgRaw&r=0");
}

.hud-spell-icon[data-type="CAMenu"]:hover{
}

/* BTN */

.CAbtn:hover {
cursor: pointer;
}
.CAbtn1 {
background-color: rgba(0, 0, 0, 0);
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtn1:hover{
opacity: 0.4;
cursor: pointor;
transition: opacity 0.3s;
}
.CAbtn1:not(:hover){
opacity: 1;
cursor: pointor;
transition: opacity 0.7s;
}
.CAbtn1-activated {
background-color: rgba(255, 255, 255, 0.5);
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtn1-activated:hover{
opacity: 0.6;
cursor: pointor
transition: opacity 0.3s;
}
.CAbtn1-activated:not(:hover){
opacity: 1;
cursor: pointor;
transition: opacity 0.7s;
}

.hud-CAMenuClose-icon{
position: relative;
transform: scale(2);
bottom: 460px;
float: right;
z-index:100;

opacity: 0.2;
}

.hud-CAMenuClose-icon:hover{
opacity: 0.5;
cursor: pointer;
}

.hud-CAMenuTitle{
position: relative;
bottom: 480px;
font-size: 30px;
color: white;
text-align: center;
left:10px;
font-weight: bold;
font-family: "Hammersmith One", sans-serif;
}

/*emm*/

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
.codeIn, .joinOut {
height: 50px;
}

.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
}


.hud-menu-zipp3 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp3 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp3 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}

/*slide  checkbox*/
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch .sliderInput{
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0);
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
  border: 3px solid white;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 1px;
  top: 1px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%
}

.sliderInput:checked + .slider {
  background-color: rgba(255, 255, 255, 0.5);
}



.sliderInput:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
`;

let styles = document.createElement("style");
styles.appendChild(document.createTextNode(CAMenucss));
document.head.appendChild(styles);
styles.type = "text/css";

// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "CAMenu");
spell.classList.add("hud-CAMenu-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);
document.getElementsByClassName("hud-center-left")[0].style.zIndex = "11";
document.getElementsByClassName("hud-respawn")[0].style.zIndex = "10";

//tiptool hover
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("mouseover", onMenuicon);
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("mouseout", offMenuicon);

function onMenuicon() {
    var caMenuTooltip = document.createElement('div');
    caMenuTooltip.classList.add("hud-tooltip");
    caMenuTooltip.classList.add("hud-tooltip-right");
    caMenuTooltip.classList.add("CaTooltip");
    caMenuTooltip.style = "left: 76px; top: 122px; font-size:15px;font-weight:bold; font-family:Hammersmith One;";
    caMenuTooltip.innerHTML = "Xyxy";
    document.querySelector(".hud-spell-icons")
        .appendChild(caMenuTooltip);
}

function offMenuicon() {
    document.getElementsByClassName("CaTooltip")[0].remove();
}
//Menu for spell icon
let modHTML = `
<div class="hud-menu-CAMenu">
<br />
<style>
.mt{
width: 13.4%;
font-size: 12px;
background-color:rgba(0, 0, 0, 0);
border: 2px solid #fff;
border-radius: 5px;
color: white;
}
.mt:hover{
opacity: 0.4;
cursor: pointer;
transition: opacity 0.3s;
}
.mt:not(:hover){
opacity: 1;
cursor: pointor;
transition: opacity 0.7s;
}
</style>
<div style="text-align:center">
<button class="SE mt">Normal</button>
<button class="AB mt">Build</button>
<button class="PA mt">Party</button>
<button class="BS mt">Chat</button>
<button class="BO mt">Iframe</button>
<button class="WS mt">WebSocket</button>
<button class="SI mt">Special</button>
<div class="hud-CAMenu-grid3">
</div>
<p class="hud-CAMenuClose-icon">&#x2715</p>
<p class="hud-CAMenuTitle">Xyxy Menu</P>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let CaMenu = document.getElementsByClassName("hud-menu-CAMenu")[0];

//Onclick
//ca icon click
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("click", function () {
    if (CaMenu.style.display == "none" || CaMenu.style.display == "") {
        document.getElementById("hud-menu-shop")
            .style.display = "none";
        document.getElementById("hud-menu-party")
            .style.display = "none";
        document.getElementById("hud-menu-settings")
            .style.display = "none";
        CaMenu.style.display = "block";
    } else {
        CaMenu.style.display = "none";
    };
});
//close icon click
document.getElementsByClassName("hud-CAMenuClose-icon")[0].addEventListener("click", function () {
    CaMenu.style.display = "none";
});
//canvas click close
game

    .network.sendInput = (e) => {
    let i = e;
    if (!i.mouseDown && !i.mouseUp) {
        game.network.sendPacket(3, e);
    }
}
document.getElementsByClassName('hud')[0].addEventListener('mousedown', e => {
    if (!e.button) {
        game
            .network.sendPacket(3, {
                mouseDown: game.inputPacketCreator.screenToYaw(e.clientX, e.clientY)
            })
    }
    CaMenu.style.display = "none";
})
document.getElementsByClassName('hud')[0].addEventListener('mouseup', e => {
    if (!e.button) {
        game.network.sendPacket(3, {
            mouseUp: 1
        })
    }
})

let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
    _menu[0], _menu[1], _menu[2], _spell[0], _spell[1]
];

//emm
allIcon.forEach(function (elem) {
    elem.addEventListener("click", function () {
        if (CaMenu.style.display == "block") {
            CaMenu.style.display = "none";
        };
    });
});

document.getElementsByClassName("SE")[0].addEventListener("click", function () {
    displayAllToNone();
    document.getElementsByClassName("SE")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Normal";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("AB")[0].addEventListener("click", function () {
    displayAllToNone();
    document.getElementsByClassName("AB")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Build";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("PA")[0].addEventListener("click", function () {
    displayAllToNone();
    document.getElementsByClassName("PA")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Party";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "";
        }
    }
})
document.getElementsByClassName("BS")[0].addEventListener("click", function () {
    displayAllToNone();
    document.getElementsByClassName("BS")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Chat";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i4")[0]) {
            document.getElementsByClassName(i + "i4")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("BO")[0].addEventListener("click", function () {
    displayAllToNone();
    document.getElementsByClassName("BO")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Iframe";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("WS")[0].addEventListener("click", function () {
    displayAllToNone();
    document.getElementsByClassName("WS")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "WebSocket";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("SI")[0].addEventListener("click", function () {
    displayAllToNone();
    document.getElementsByClassName("SI")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Special";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "";
        }
    }
})

function displayAllToNone() {
    document.getElementsByClassName("SE")[0].innerText = "Normal";
    document.getElementsByClassName("AB")[0].innerText = "Build";
    document.getElementsByClassName("BS")[0].innerText = "Chat";
    document.getElementsByClassName("PA")[0].innerText = "Party";
    document.getElementsByClassName("BO")[0].innerText = "Iframe";
    document.getElementsByClassName("WS")[0].innerText = "WebSocket";
    document.getElementsByClassName("SI")[0].innerText = "Special";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i4")[0]) {
            document.getElementsByClassName(i + "i4")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i6")[0]) {
            document.getElementsByClassName(i + "i6")[0].style.display = "none";
        }
    }
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i7")[0]) {
            document.getElementsByClassName(i + "i7")[0].style.display = "none";
        }
    }
}
document.getElementsByClassName("hud-CAMenu-grid3")[0].style.textAlign = "center";
document.getElementsByClassName("hud-CAMenu-grid3")[0].innerHTML = `
<!----------------------------first page--------------------------->
<div class="etc.Class">
<hr />
<h2>Xyxy Menu</h2>
<h3>Hope you like it!</h3>
</div>
<hr />

<!----------------------------Normal--------------------------->
<hr class="14i">
<button class="CAbtn1 15i"id="AHRC">Enable AHRC</button>
<button class="CAbtn1-activated 16i"id="daynight">Disable Night Dark</button>
<input type="tel" id="healpetpercent" name="healpetpercent" maxlength="3" size="3" class="17i" value="75" style="text-align:center;border-radius: 5px;border: 2px solid white;background-color:rgba(0,0,0,0);color:rgba(255,255,255,0.7);">
<b class="18i"> %</b>
</input>
<button class="CAbtn1-activated 19i"id="healpet"style="width: 200px;">Disable Auto Heal Pet</button>
<button class="CAbtn1-activated 20i"id="revivepet"style="width: 200px;">Disable Auto Revive Pet</button>
<button class="CAbtn1 21i"id="autobow">Enable Auto Bow</button>
<button class="CAbtn1-activated 22i"id="autoevolvepet">Disable Auto Evolve Pet</button>
<button class="CAbtn1 23i"id="autorespawn">Enable Auto Respawn</button>
<button class="CAbtn1 24i"id="autoequiptier2Spear">Enable Auto Equip Tier 2 Spear</button>
<!--------------------------------Party------------------------------>
<label for="zombs.ioPartyKey" class="1i3">Party Code:</label>
<input type="text" id="partycodeinput" name="zombs.ioPartyKey" required maxlength="20" size="22" class="2i3" placeholder = "Party Share Key..."style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid white;">
<button class="CAbtn1 3i3"id="joinparty" style="width: 200px">Enable Auto Join Party</button>
<br class="6i3">
<label for="zombs.ioPartyId" class="7i3">Party Id:</label>
<input type="text" id="partyidinput" name="zombs.ioPartyId" required maxlength="7" class="8i3" placeholder = "Party Id..."style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid white;">
<button class="CAbtn1 9i3"id="requestjoinparty">Enable Auto Request Join Party</button>
<hr class="10i3">
<button class="CAbtn1 11i3"id="acceptrequestjoinparty">Enable Auto Accept Party Request</button>
<button class="CAbtn1 12i3"id="leaveparty">Leave Party</button>
<input type="text" value='[all]' id="kickplayerinput" class="13i3" placeholder="Player name or command..." style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid white;width: 250px;">
<button class="CAbtn1 14i3"id="playerkicker">Enable Player Kicker</button>
<!----------------------------Chat--------------------------->

<input type="text" id="spamtext" name="spamtext" required maxlength="60" size="40" placeholder="Things To Spam..."class="1i4" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;">
<button class="CAbtn1 2i4"id="spambtn" style="width: 200px;">Enable Spam Chat</button>
<button class="CAbtn1 3i4"id="clearchatbtn">Clear Chat</button>
<hr class="4i4">
<form Class="5i4">
Block
         <select class="blockchatselect"name = "blockChatSelect" style="padding: 4px; background-color: rgba(0,0,0,0);border-radius: 10px; border:2px solid white; color: white" onmouseover="this.style.opacity='0.7';"  onmouseout="this.style.opacity='1';">
         <option value = "None" style="color: black" Selected>Nothing</option>
            <option value = "All" style="color: black">All</option>
            <option value = "Party" style="color: black">Party</option>
         </select>
      </form>
<!----------------------------websockets--------------------------->
<div class="0i6">
<b><p id="sendWs">Coming soon!</p></b>
</div>
<!------------------------------Iframe------------------------------>
<div class="0i5">
<button class="CAbtn1" id="sendAlt">Send Alt</button>
<button class="CAbtn1" id="deleteAllAlt">Delete All Alts</button>
<input id="deletealtplaceholder" type="tel" placeholder="Enter Your Alt's Id -starts from 1" style="background-color:rgba(0,0,0,0);padding: 4px 5px; border-radius:8px;color:rgba(255,255,255,0.7); border:2px solid white;width:243px;">
<button class="CAbtn1" id="deleteAlt">Delete Alt</button>
<button class="CAbtn1-activated" id="altFollowPlayer">Disable Alts Follow Player</button>
<hr id="beforeIframe">
</div>
<style>
.frames{
width: 1400px;
    height: 860px;
    border: 0;
    transform: scale(0.38);

    transform-origin: 0 0;
}
</style>
`;
if (onIframe) {
    document.getElementsByClassName("0i5")[0].innerHTML = "Sorry, we don't support this!";
    document.getElementsByClassName("0i6")[0].innerHTML = "Sorry, we don't support this!";
}
displayAllToNone();
/*------------------------------variables---------------------------------*/
var onIframe;
var auto3x3 = false;
var CAshouldBuild3x3Walls = false;
var CAshouldBuild5x5Walls = false;
var CAshouldBuild7x7Walls = false;
var AHRC = false;
var nightdark = true;
var JoinParty = false;
var spamchat = false;
var joinedserver = false;
var v_autoharvestertrap = false;
var mapmousex;
var mapmousey;
var mapmovetox;
var mapmovetoy;
var shouldMapMove;
var shouldhealpet = true;
var shouldrevivepet = true;
var autobow = false;
var autosellwall = false;
var autoevolvepet = true;
var autorequestjoinparty = false;
var autoacceptrequestjoinparty = false;
var autokicker = false;
var autorespawn = false;
var autoequiptier2Spear = false;
var speartier = 0;
var numOfAlts = 0;
var altFollowPlayer = true;
var myPosx;
var myPosy;
socket = [];
let codec = new BinCodec();
var blockChatUid = [];
var rickRoll = new Audio('https://rickrollmp3.casuallyca.repl.co/Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Official%20Music%20Video).mp3');
var wsnum = 0;
/*-----------------------------------------------simple functions----------------------------------------------*/


function CAchat(msg) {
    game
        .network.sendRpc({
        name: "SendChatMessage",
        channel: "Local",
        message: msg
    })
}

function placeWall(x, y) {
    game.network.sendRpc({
        name: 'MakeBuilding',
        x: x,
        y: y,
        type: "Wall",
        yaw: 0
    });
}

function placeHarvester(x, y) {
    game.network.sendRpc({
        name: 'MakeBuilding',
        x: x,
        y: y,
        type: "Harvester",
        yaw: 0
    });
}

function placeHarvesterTrap(gridPos) {
    let x = gridPos.x
    let y = gridPos.y
    if(game.ui.playerPartyMembers.length > 2){
        //////////////////////////////1
        placeHarvester(x - 48, y + 144);
        placeHarvester(x + 48, y + 144);
        //////////////////////////////2
        placeHarvester(x - 144, y + 48);
        placeHarvester(x + 144, y + 48);
        //////////////////////////////3
        placeHarvester(x - 144, y - 48);
        placeHarvester(x + 144, y - 48);
        //////////////////////////////4
        placeHarvester(x - 48, y - 144);
        placeHarvester(x + 48, y - 144);
    }else{
        //////////////////////////////1
        placeHarvester(x, y + 96);
        //////////////////////////////2
        placeHarvester(x - 96, y);
        placeHarvester(x + 96, y);
        //////////////////////////////3
        placeHarvester(x, y - 96);
    }
}

function CAThree(gridPos) {
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y);
    placeWall(gridPos.x, gridPos.y + 48);
    placeWall(gridPos.x - 48, gridPos.y);
    placeWall(gridPos.x, gridPos.y - 48);
    placeWall(gridPos.x - 48, gridPos.y + 48);
    placeWall(gridPos.x + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48, gridPos.y + 48);
    placeWall(gridPos.x - 48, gridPos.y - 48);
}

function CAFive(gridPos) {
    //1 layer
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
    //2 layer
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48);
    placeWall(gridPos.x, gridPos.y + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
    //3 layer
    placeWall(gridPos.x - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48, gridPos.y);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48, gridPos.y);
    //4 layer
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48);
    placeWall(gridPos.x, gridPos.y - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
    //5 layer
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
}

function CASeven(gridPos) {
    //1 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48)
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
    //2 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
    //3 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
    placeWall(gridPos.x - 48, gridPos.y + 48);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
    //4 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48 - 48, gridPos.y);
    placeWall(gridPos.x - 48, gridPos.y);
    placeWall(gridPos.x, gridPos.y);
    placeWall(gridPos.x + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48, gridPos.y);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
    //5 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48);
    placeWall(gridPos.x, gridPos.y - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
    //6 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
    //7 layer
    placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
    placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
    //idk why x4, y5 ( 5 layer 4) is not working so i just make 3x3 again
    CAThree(gridPos);
}

function hint(msg) {
    game.ui.getComponent('PopupOverlay')
        .showHint(msg, 2000);
}
/*---------------------------------------------------hacks--------------------------------------------------------*/


/*long chat*/
document.querySelector(".hud-chat-messages")
    .style.width = "900px";

function joinserver() {
    joinedserver = true;
}
//position bottom left
var mapcontainer = document.createElement('div');
mapcontainer.id = "hud-mapcontainer";
document.querySelector('.hud-bottom-left')
    .append(mapcontainer);
document.querySelector("#hud-mapcontainer")
    .appendChild(document.querySelector("#hud-map"));
var mapcontainercss = document.querySelector("#hud-mapcontainer")
    .style;
mapcontainercss.position = "relative";
mapcontainercss.top = "17px";
mapcontainercss.right = "17px";
mapcontainercss.margin = "0px";
mapcontainercss.width = "140px";
mapcontainercss.zIndex = "30";

document.querySelector(".hud-map")
    .style.border = "3px solid black";

var huddaynighttickerstyle = document.querySelector(".hud-day-night-ticker")
.style;
huddaynighttickerstyle.position = "relative";
huddaynighttickerstyle.top = "17px";
huddaynighttickerstyle.right = "20px";
huddaynighttickerstyle.margin = "3px";
//xy show
var xyshow = document.createElement("p");
xyshow.style = 'position: relative; top:17px; right:17px; text-shadow: 1px 1px white; font-weight: 900; font-family:Hammersmith One;';
xyshow.innerHTML = "loading x y coordinate";
xyshow.className = "xyshowcoordinate";
document.querySelector(".hud-bottom-left")
    .appendChild(xyshow);
function F_AHRC() {
    AHRC = !AHRC;
    document.getElementById("AHRC")
        .innerHTML = AHRC ? "Disable AHRC" : "Enable AHRC";
    document.getElementById("AHRC")
        .classList.replace(AHRC ? "CAbtn1" : "CAbtn1-activated", AHRC ? "CAbtn1-activated" : "CAbtn1");
    if (AHRC) {
        CAchat('🌳 AHRC enabled 🌳');
    } else {
        CAchat('❌🌳 AHRC disabled 🌳❌');
    }
}
 //strong shield
function FixShield() {
    if (game.network.connected) {
        if (game.ui.playerTick) {
            if (game.ui.playerTick.zombieShieldHealth < 8500) {
                game.network.sendRpc({
                    name: "EquipItem",
                    itemName: "ZombieShield",
                    tier: game.ui.inventory.ZombieShield.tier
                });
            }
        }
    }
}
game.network.addRpcHandler("DayCycle", FixShield);
//daynight
function daynight() {
    nightdark = !nightdark;
    document.getElementById("daynight")
        .innerHTML = nightdark ? "Disable Night Dark" : "Enable Night Dark";
    document.getElementById("daynight")
        .classList.replace(nightdark ? "CAbtn1" : "CAbtn1-activated", nightdark ? "CAbtn1-activated" : "CAbtn1");
    if (nightdark) {
        document.getElementsByClassName("hud-day-night-overlay")[0].style.display = "block";
        CAchat("🌙 Night Dark Enabled 🌙");

    } else {
        document.getElementsByClassName("hud-day-night-overlay")[0].style.display = "none";
        CAchat("🌞 Night Dark Disabled 🌞");
    }
}

function F_spamchat() {
    spamchat = !spamchat;
    document.getElementById("spambtn")
        .innerHTML = spamchat ? "Disable Spam Chat" : "Enable Spam Chat";
    document.getElementById("spambtn")
        .classList.replace(spamchat ? "CAbtn1" : "CAbtn1-activated", spamchat ? "CAbtn1-activated" : "CAbtn1");
    if (spamchat) {
        CAchat("📢 Spam Chat Enabled 📢");
    } else {
        setTimeout(() => {
            CAchat("❌📢 Spam Chat Disabled 📢❌");
        }, 900);
    }
}

function clearchat() {
    document.querySelector('.hud-chat-messages')
        .innerHTML = ""
}
//mapmove
function mapmove(e) {
    mapmousex = e.pageX - 3;
    mapmousey = e.pageY - (document.getElementsByTagName('body')[0].clientHeight - 36 - 140);
    mapmovetox = Math.round(mapmousex / document.querySelector("#hud-mapcontainer")
        .clientWidth * 23973);
    mapmovetoy = Math.round(mapmousey / document.querySelector("#hud-mapcontainer")
        .clientHeight * 23973);
    if (!shouldMapMove) {
        game.ui.getComponent('PopupOverlay')
            .showConfirmation(`Are you sure u wanna move to X: ${mapmovetox}?, Y: ${mapmovetoy}`, 1e4, function () {

                shouldMapMove = true;
                hint(`Moving to X: ${mapmovetox}, Y: ${mapmovetoy}...`);
            }, function () {
                hint("Ok, didn't start move.");
            });
    }


}

document.addEventListener('keydown', function (e) { // when key is pressed
    if (e.key == "w" || e.key == "a" || e.key == "s" || e.key == "d" || e.keyCode == "37" || e.keyCode == "38" || e.keyCode == "39" || e.keyCode == "40") {
        if (shouldMapMove) {
            shouldMapMove = false;
            if (e.key != "a" && e.keyCode != "38") {
                game.network.sendInput({
                    left: 0
                })
            }
            if (e.key != "s" && e.keyCode != "39") {
                game.network.sendInput({
                    down: 0
                })
            }
            if (e.key != "d" && e.keyCode != "40") {
                game
                    .network.sendInput({
                        right: 0
                    })
            }
            if (e.key != "w" && e.keyCode != "37") {
                game.network.sendInput({
                    top: 0
                })
            }
            hint("Stopped moving");

        }
    }
})

function changehealpet() {
    shouldhealpet = !shouldhealpet;
    document.querySelector("#healpet")
        .innerHTML = shouldhealpet ? "Disable Auto Heal Pet" : "Enable Auto Heal Pet";
    document.querySelector("#healpet")
        .classList.replace(shouldhealpet ? "CAbtn1" : "CAbtn1-activated", shouldhealpet ? "CAbtn1-activated" : "CAbtn1");
    if (shouldhealpet) {
        CAchat('💖 Auto Heal Pet enabled 💖');
    } else {
        CAchat('❌💖 Auto Heal Pet disabled 💖❌');
    }

}

function changerevivepet() {
    shouldrevivepet = !shouldrevivepet;
    document.querySelector("#revivepet")
        .innerHTML = shouldrevivepet ? "Disable Auto Revive Pet" : "Enable Auto Revive Pet";
    document.querySelector("#revivepet")
        .classList.replace(shouldrevivepet ? "CAbtn1" : "CAbtn1-activated", shouldrevivepet ? "CAbtn1-activated" : "CAbtn1");
    if (shouldrevivepet) {
        CAchat('💖 Auto Revive Pet enabled 💖');
    } else {
        CAchat('❌💖 Auto Revive Pet disabled 💖❌');
    }
}

function F_autosellwalls() {
    autosellwall = !autosellwall;
    document.querySelector("#autosellwalls")
        .innerHTML = autosellwall ? "Disable Auto Sell Walls" : "Enable Auto Sell Walls";
    document.querySelector("#autosellwalls")
        .classList.replace(autosellwall ? "CAbtn1" : "CAbtn1-activated", autosellwall ? "CAbtn1-activated" : "CAbtn1");
    if (autosellwall) {
        CAchat('🤑 Auto Sell Walls enabled 🤑');
        var autosellwallloop = game.network.addEntityUpdateHandler(() => {
            if (autosellwall) {
                var entities = game
                    .world.entities;
                for (var uid in entities) {
                    if (!entities.hasOwnProperty(uid)) continue;
                    var obj = entities[uid];
                    if (obj.fromTick.model == "Wall") {
                        game.network.sendRpc({
                            name: "DeleteBuilding",
                            uid: obj.fromTick.uid
                        })
                    }
                }
            } else {
                clearInterval(autosellwallloop);
            }

        });
    } else {
        CAchat('❌🤑 Auto Sell Walls disabled 🤑❌');
        clearInterval(autosellwallloop);
    }

}

function F_autobow() {
    autobow = !autobow;
    document.querySelector("#autobow")
        .innerHTML = autobow ? "Disable Auto Bow" : "Enable Auto Bow";
    document.querySelector("#autobow")
        .classList.replace(autobow ? "CAbtn1" : "CAbtn1-activated", autobow ? "CAbtn1-activated" : "CAbtn1");
    if (autobow) {
        CAchat('🏹 Auto bow enabled 🏹');
    } else {
        CAchat('❌🏹 Auto bow disabled 🏹❌');
    }

}

function F_autorequestjoinparty() {
    autorequestjoinparty = !autorequestjoinparty;
    document.querySelector("#requestjoinparty")
        .innerHTML = autorequestjoinparty ? "Disable Auto Request Join Party" : "Enable Auto Request Join Party";
    document.querySelector("#requestjoinparty")
        .classList.replace(autorequestjoinparty ? "CAbtn1" : "CAbtn1-activated", autorequestjoinparty ? "CAbtn1-activated" : "CAbtn1");
}

function F_autoacceptrequestjoinparty() {
    autoacceptrequestjoinparty = !autoacceptrequestjoinparty;
    document.querySelector("#acceptrequestjoinparty")
        .innerHTML = autoacceptrequestjoinparty ? "Disable Auto Accept Party Request" : "Enable Auto Accept Party Request";
    document.querySelector("#acceptrequestjoinparty")
        .classList.replace(autoacceptrequestjoinparty ? "CAbtn1" : "CAbtn1-activated", autoacceptrequestjoinparty ? "CAbtn1-activated" : "CAbtn1");
    if (autoacceptrequestjoinparty) {
        CAchat('✅ Auto Accept Party Request enabled ✅');
    } else {
        CAchat('❎ Auto Accept Party Request disabled ❎');
    }
}

function F_autoevolvepet() {
    autoevolvepet = !autoevolvepet;
    document.querySelector("#autoevolvepet")
        .innerHTML = autoevolvepet ? "Disable Auto Evolve Pet" : "Enable Auto Evolve Pet";
    document.querySelector("#autoevolvepet")
        .classList.replace(autoevolvepet ? "CAbtn1" : "CAbtn1-activated", autoevolvepet ? "CAbtn1-activated" : "CAbtn1");
    if (autoevolvepet) {
        CAchat('🐕 Auto Evolve Pet enabled 🐕');
    } else {
        CAchat('❌🐕 Auto Evolve Pet disabled 🐕❌');
    }
}

function F_autokicker() {
    autokicker = !autokicker;
    document.querySelector("#playerkicker")
        .innerHTML = autokicker ? "Disable Player Kicker" : "Enable Player Kicker";
    document.querySelector("#playerkicker")
        .classList.replace(autokicker ? "CAbtn1" : "CAbtn1-activated", autokicker ? "CAbtn1-activated" : "CAbtn1");
    if (autokicker) {
        CAchat('🦵 Player Kicker enabled 🦵');
    } else {
        CAchat('❌🦵 Player Kicker 🦵❌');
    }
}

function F_autorespawn() {
    autorespawn = !autorespawn;
    document.querySelector("#autorespawn")
        .innerHTML = autorespawn ? "Disable Auto Respawn" : "Enable Auto Respawn";
    document.querySelector("#autorespawn")
        .classList.replace(autorespawn ? "CAbtn1" : "CAbtn1-activated", autorespawn ? "CAbtn1-activated" : "CAbtn1");
    if (autorespawn) {
        CAchat('😇 Auto Respawn enabled 😇');
    } else {
        CAchat('❌😇 Auto Respawn Disabled 😇❌');
    }
}

function F_autoequiptier2Spear() {
    autoequiptier2Spear = !autoequiptier2Spear;
    document.querySelector("#autoequiptier2Spear")
        .innerHTML = autoequiptier2Spear ? "Disable Auto Equip Tier 2 Spear" : "Enable Auto Equip Tier 2 Spear";
    document.querySelector("#autoequiptier2Spear")
        .classList.replace(autoequiptier2Spear ? "CAbtn1" : "CAbtn1-activated", autoequiptier2Spear ? "CAbtn1-activated" : "CAbtn1");
    if (autoequiptier2Spear) {
        CAchat('🔪 Auto Equip Tier 2 Spear enabled 🔪');
        speartier = 0;
    } else {
        CAchat('❌🔪 Auto Equip Tier 2 Spear Disabled 🔪❌');
    }

}

document.addEventListener('keyup', function (e) {
    if (e.key == "Enter" && game

        .ui.playerTick.dead == 1) {
        game.ui.components.Chat.startTyping();
    }
});

function F_sendAlt() {
    numOfAlts++;
    var newDiv = document.createElement('div');
    newDiv.style.width = '550px';
    newDiv.style.height = '345px';
    newDiv.style.overFlow = 'hidden';
    var newIf = document.createElement('iFrame');
    newIf.className = "frames";

    newDiv.id = "frame" + numOfAlts;
    newDiv.className = (Number(document.getElementById('beforeIframe')
        .className.split("i")[0]) + numOfAlts) + "i5"

    newIf.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}`;

    document.getElementsByClassName("hud-CAMenu-grid3")[0].insertBefore(newDiv, document.getElementsByClassName('1i6')[0]);
    newDiv.appendChild(newIf);
}

function F_deleteAllAlt() {

    for (var i = 1; i <= numOfAlts; i++) {
        document.getElementById("frame" + i)
            .remove();
    }
    numOfAlts = 0;
}

function F_deleteAlt() {
    let deletealtnum = parseInt(document.getElementById('deletealtplaceholder')
        .value);
    document.getElementById("frame" + deletealtnum)
        .remove();
    for (var i = 1; i <= (numOfAlts - deletealtnum); i++) {
        document.getElementById("frame" + (deletealtnum + i))
            .id = "frame" + (deletealtnum + i - 1);
        document.getElementById("frame" + (deletealtnum + i - 1))
            .className = (Number(document.getElementById("frame" + (deletealtnum + i - 1))
                .className.split("i")[0]) - 1) + "i5";
    }
    numOfAlts--;
}

function F_altFollowPlayer() {
    altFollowPlayer = !altFollowPlayer;
    document.querySelector("#altFollowPlayer")
        .innerHTML = altFollowPlayer ? "Disable Alts Follow Player" : "Enable Alts Follow Player";
    document.querySelector("#altFollowPlayer")
        .classList.replace(altFollowPlayer ? "CAbtn1" : "CAbtn1-activated", altFollowPlayer ? "CAbtn1-activated" : "CAbtn1");
    if (altFollowPlayer) {
        CAchat('🚶‍♂️ Alt Follow Player enabled 🚶‍');
    } else {
        CAchat('❌🚶‍ Alt Follow Player Disabled 🚶‍❌');
        for (var i = 1; i <= numOfAlts; i++) {
            let win = document.getElementById("frame" + i)
                .childNodes[0].contentWindow;
            win.game.network.sendInput({
                down: 0
            })
            win.game.network.sendInput({
                up: 0
            })
            win.game.network.sendInput({
                left: 0
            })
            win.game.network.sendInput({
                right: 0
            })
        }
    }
}

game.network.addRpcHandler("ReceiveChatMessage", (e) => {
    let lastchat = document.getElementsByClassName('hud-chat-message')[document.getElementsByClassName('hud-chat-message')
        .length - 1];
    if (blockChatUid == "All") {
        lastchat.remove();
    } else {
        blockChatUid.forEach(function (f) {
            if (e.uid == f) {
                lastchat.remove();
            }
        })
    }
});

function F_sendWs() {
    let mousePosition3;
    let thisServer = game.options.servers[game.options.serverId];
    let ws = new WebSocket(`ws://${thisServer.hostname}:${8000}`);
    let id = 0;
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        ws.network = new game.networkType();
        ws.network.sendPacket = (e, t) => {
            if (!ws.isclosed) {
                ws.send(ws.network.codec.encode(e, t));
            }
        };
        ws.onPreEnterWorld = (data) => {
            ws.network = new Game.currentGame.networkType();
            ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
            ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
            ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
            ws.network.sendPacket(4, {displayName: localStorage.name, extra: data.extra});
        }
        ws.onEnterWorld = (e) => {
            ws.inWorld = true;
            ws.network.sendRpc({
                name: "JoinPartyByShareKey",
                partyShareKey: game.ui.playerPartyShareKey
            });
            id = ++wsnum;
            hint(`You Now Have ${wsnum} Alts`);
            socket.push(ws);
        };
        let oneTime = 1;
        ws.onmessage = (msg) => {
            if (new Uint8Array(msg.data)[0] == 5) {
                let data = codec.decode(msg.data);
                ws.onPreEnterWorld(data);
                if (data.opcode === 5) {
                    ws.network.sendPacket(4, {
                        displayName: game.ui.playerTick.name,
                        extra: data.extra
                    });
                }
                return;
            }
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.opcode == 4) {
                ws.onEnterWorld(ws.data)
            };
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
                ws.ready = true;
            }
            ws.network.sendInput({up: 1});
            ws.mouseUp = 1;
            ws.mouseDown = 0;
            let wsPlayer = ws.data.entities[ws.uid];
            let myPlayer = game.ui.playerTick;
            let mouseToWorld = game.renderer.screenToWorld(game.ui.mousePosition.x,game.ui.mousePosition.y);
            //
            //
            if (ws.data.entities) {
                if (ws.data.entities[ws.uid].name) {
                    wsPlayer = ws.data.entities[ws.uid];
                }
            }
            //
            //
            if(wsPlayer){
                if(wsPlayer.position){
                    ws.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-wsPlayer.position.x + mouseToWorld.x)*100, (-wsPlayer.position.y + mouseToWorld.y)*100)})
                    if (1 == 1) {
                        console.log(wsPlayer.position);
                        if (wsPlayer.position.y - mouseToWorld.y > 15) {
                            ws.network.sendInput({
                                down: 0
                            })
                        } else {
                            ws.network.sendInput({
                                down: 1
                            })
                        }
                        if (-wsPlayer.position.y + mouseToWorld.y > 15) {
                            ws.network.sendInput({
                                up: 0
                            })
                        } else {
                            ws.network.sendInput({
                                up: 1
                            })
                        }
                        if (-wsPlayer.position.x + mouseToWorld.x > 15) {
                            ws.network.sendInput({
                                left: 0
                            })
                        } else {
                            ws.network.sendInput({
                                left: 1
                            })
                        }
                        if (wsPlayer.position.x - mouseToWorld.x > 15) {
                            ws.network.sendInput({
                                right: 0
                            })
                        } else {
                            ws.network.sendInput({
                                right: 1
                            })
                        }
                    }
                }
            }

        }


    }

    var timeCheck = setTimeout(function(){
        if(id == 0) {
            hint('Theres an error... (probably server full)');
            ws.close();
        }
    }, 3000)
    }



//zooom
var zoom = document.createElement('div');
zoom.style.position = 'relative';
zoom.style.bottom = '57px';
zoom.style.left = '60px';
zoom.style.width = "10px";
zoom.innerHTML = `
<input type="range" name="zoom" min="30" max="200" value="100" id="zoomslider"onclick="CAchat('f');">
<style>
#zoomslider:hover{
opacity: 1;
transition: opacity 0.3s;
}
#zoomslider {
  position: relative;
}

#zoomslider {
  -webkit-appearance: none;
  transform: rotate(270deg) translateY(-50%);
  margin-top: 200px; /* 50% of the width because of the transformation */
  width: 160px;
  height: 10px;
  outline: none;
  position: absolute;
  opacity: 0.5;
  border-radius: 5px;
  border: 2px solid white;
  color: rgba(0,0,0,0)
  transition: opacity 0.3s;
}

#zoomslider::-webkit-slider-thumb {
  -webkit-appearance: none;
  background-color: #474747;
  opacity: 0.75;
  width: 17px;
  height: 17px;
  transform: translateY(-1px);
  border-radius:50%;
  opacity:1;
}

</style>
`;
document.getElementsByClassName('hud-bottom-left')[0].appendChild(zoom);

let dimension = 1;

const onWindowResize = () => {
    const renderer = game.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = canvasHeight / (1080 * dimension);
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}

onWindowResize();

window.onresize = onWindowResize;

document.addEventListener('mousemove', function () {
    if (document.getElementById('zoomslider')
        .matches(':hover')) {
        dimension = document.getElementById('zoomslider')
            .value / 100;
        onWindowResize();
    }
});
/*
//this scanner part is completely from igniton(troller's code) hope you dont care
wss = null;
codec = new BinCodec();
serverObj = {};
let leaderboardLoaded;

function myWS() {
    if (!localStorage.isxyzAllowed) return;
    wss = new WebSocket(localStorage.wsEnv);
    wss.binaryType = "arraybuffer";
    wss.onopen = () => {
        if (localStorage.haspassword) thisNetwork.sendMessage(localStorage.haspassword);
    }
    wss.onmessage = (e) => {
        let data = codec.decode(e.data);
        let response = data.response;
        let parsedResponse;
        if (response.data) {
            parsedResponse = JSON.parse(response.data);
            if (parsedResponse) {
                if (parsedResponse.id) {
                    thisInfo.id = parsedResponse.id;
                }
            }
            if (parsedResponse.m) {
                serverObj = parsedResponse.m;
                if (!leaderboardLoaded) {
                    leaderboardLoaded = true;
                    game.ui.components.Leaderboard.leaderboardData = serverObj[document.getElementsByClassName("hud-intro-server")[0].value].leaderboardDataObj;
                    game.ui.components.Leaderboard.update();
                }
                for (let i = 0; i < document.getElementsByClassName("hud-intro-server")[0].length; i++) {
                    let id = document.getElementsByClassName("hud-intro-server")[0][i].value;
                    let target = serverObj[id].leaderboardDataObj.sort((a, b) => b.wave - a.wave)[0];
                    document.getElementsByClassName("hud-intro-server")[0][i].innerText = `${game.options.servers[id].name}, ppl: ${serverObj[id].population}, ${target.wave} <= ${target.name}`
                }
            }
        } else {
            if (!response.msg.includes(`{"tk":"`) && !response.msg.includes(`, [`)) {
                console.log(response);
            }
        }
    }
}
thisNetwork = {
    codec: codec,
    sendMessage(message) {
        wss.send(codec.encode(9, {name: "message", msg: message}));
    },
    getdisconnected() {
        return wss.readyState == wss.CLOSED;
    },
    disconnect() {
        wss.close();
    },
    reconnect() {
        myWS();
    }
}
thisInfo = {
    id: null,
    name: null,
    uid: null,
    host: null,
    active: false
}

game.network.addEnterWorldHandler(e => {
    thisInfo.uid = e.uid;
    thisInfo.name = e.effectiveDisplayName;
    thisInfo.host = game.network.socket.url;
    thisInfo.active = true;
})
myWS();
*/
/*----------------------------------------------------hacks that should call multiple times-------------------------------------*/
game.network.addEntityUpdateHandler(() => {
    if (game.network.connected) {
        if (AHRC) {
            var entities = game.world.entities
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
         //show xy
        myPosx = game.ui.playerTick.position.x;
        myPosy = game.ui.playerTick.position.y;
        if (game.ui.playerTick) {
            if (
                xyshow.innerHTML != `X: ${Math.round(myPosx)-13}, Y: ${Math.round(myPosy)-13}`) {
                xyshow.innerHTML = `X: ${Math.round(myPosx - 13)}, Y: ${Math.round(myPosy) - 13}`;
            }
        }
//spam chat
        if (spamchat) {
            CAchat(document.querySelector('#spamtext')
                .value);
        }

        if (shouldMapMove) {
            var moving = [0, 0, 0, 0];
            if ((Math.round(game.ui.playerTick.position.y) - 13 /*current pos y*/ ) - mapmovetoy > 100) {
                game.network.sendInput({
                    down: 0
                })
                moving[0] = 1;
            } else {
                game.network.sendInput({
                    down: 1
                })
                moving[0] = 0;
            }
            if ((-(Math.round(game.ui.playerTick.position.y) - 13) /*current pos y*/ ) + mapmovetoy > 100) {
                game.network.sendInput({
                    up: 0
                })
                moving[1] = 1;
            } else {
                game.network.sendInput({
                    up: 1
                })
                moving[1] = 0;
            }
            if ((-(Math.round(game.ui.playerTick.position.x) - 13) /*current pos x*/ ) + mapmovetox > 100) {
                game.network.sendInput({
                    left: 0
                })
                moving[2] = 1;
            } else {
                game.network.sendInput({
                    left: 1
                })
                moving[2] = 0;
            }
            if ((Math.round(game.ui.playerTick.position.x) - 13 /*current pos x*/ ) - mapmovetox > 100) {
                game.network.sendInput({
                    right: 0
                })
                moving[3] = 1;
            } else {
                game.network.sendInput({
                    right: 1
                })
                moving[3] = 0;
            }
            if ((moving[0] + moving[1] + moving[2] + moving[3]) == 0) {
                shouldMapMove = false;
                hint("Auto move done!");
            }
        }


        if (shouldhealpet) {
            if (game.ui.playerPetTick) {
                if ((game.ui.playerPetTick.health / game.ui.playerPetTick.maxHealth) * 100 <= document.querySelector("#healpetpercent")
                    .value)
                    game.network.sendRpc({
                        "name": "BuyItem",
                        "itemName": "PetHealthPotion",
                        "tier": 1
                    })
                game.network.sendRpc({
                    "name": "EquipItem",
                    "itemName": "PetHealthPotion",
                    "tier": 1
                })
            }
        }

        if (shouldrevivepet && game.ui.playerPetTick) {
            if (game.ui.playerPetTick.health == 0) {
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
            }

        }

        if (autobow) {
            var autobowing = false;
            if (game.ui.playerWeaponName === "Bow") {
                autobowing = true;
                game.network.sendInput({
                    space: 0
                });
                game.network.sendInput({
                    space: 1
                });
            }
        }


        if (autoevolvepet) {
            if (game.ui.playerPetTick && game.ui.playerTick.token >= 100) {
                game.network.sendRpc({
                    "name": "BuyItem",
                    "itemName": game.ui.playerPetTick.model,
                    "tier": game.ui.playerPetTick.tier + 1
                });
            }

        }

        if (autoacceptrequestjoinparty) {
            for (let i = 0; i < document.getElementsByClassName("hud-popup-message hud-popup-confirmation is-visible")
                .length; i++) {
                if (document.getElementsByClassName("hud-popup-message hud-popup-confirmation is-visible")[i].innerHTML.includes("wants to join your party...")) {
                    document.getElementsByClassName("btn btn-green hud-confirmation-accept")[i].click();

                }
            }
        }

        if (autokicker) {
            var kickplayerinput = document.querySelector('#kickplayerinput');
            if (game.ui.playerPartyLeader) {
                if (kickplayerinput.value == "[all]" || kickplayerinput.value == "[All]") {
                    game.network.sendRpc({
                        name: "KickParty",
                        uid: game.ui.playerPartyMembers[1].playerUid
                    });
                } else if (kickplayerinput.value == "[3]") {
                    game.network.sendRpc({
                        name: "KickParty",
                        uid: game.ui.playerPartyMembers[2].playerUid
                    });
                } else if (kickplayerinput.value == "[4]") {
                    game.network.sendRpc({
                        name: "KickParty",
                        uid: game.ui.playerPartyMembers[3].playerUid
                    });
                } else {
                    for (let i in game.ui.playerPartyMembers) {
                        if (game.ui.playerPartyMembers[i].displayName == kickplayerinput.value) {
                            game.network.sendRpc({
                                name: "KickParty",
                                uid: game.ui.playerPartyMembers[i].playerUid
                            });
                        }
                    }
                }
            }
        }
        if (autorespawn) {
            if (game.ui.playerTick.dead == 1) {
                document.getElementsByClassName("hud-respawn-btn")[0].click();
            }
        }
        if (autoequiptier2Spear) {
            speartier = document.querySelector(".hud-shop-item")
                .nextElementSibling.childNodes[3].innerHTML.split(" ")[1] - 1;
            if (game.ui.playerWeaponName != "Spear") {
                game.network.sendRpc({
                    name: "EquipItem",
                    itemName: "Spear",
                    tier: document.querySelector(".hud-shop-item")
                        .nextElementSibling.childNodes[3].innerHTML.split(" ")[1] - 1
                });
            }
            if (speartier == 0 && game.ui.playerTick.gold >= 100) {
                document.querySelector(".hud-shop-item")
                    .nextElementSibling.click();

                game.network.sendRpc({
                    name: "EquipItem",
                    itemName: "Spear",
                    tier: 1
                })
            }
            if (speartier == 1 && game.ui.playerTick.gold >= 400) {
                speartier = 2;
                document.querySelector(".hud-shop-item")
                    .nextElementSibling.click();
                game.network.sendRpc({
                    name: "EquipItem",
                    itemName: "Spear",
                    tier: 2
                });
            }
        }
        if (autorequestjoinparty) {
            game.network.sendRpc({
                name: 'JoinParty',
                partyId: parseInt(document.querySelector('#partyidinput')
                    .value)
            });
        }
        Object.entries(game.world.entities)
            .forEach((stuff => {
                if (stuff[1].targetTick.entityClass == "PlayerEntity") {
                    var newName = stuff[1].targetTick.name + `\n Wood:` +
                        game.world.entities[stuff[1].targetTick.uid].targetTick.wood + `\n Stone: ` +
                        game.world.entities[stuff[1].targetTick.uid].targetTick.stone + `\n Gold: ` +
                        game.world.entities[stuff[1].targetTick.uid].targetTick.gold + `\n Tokens:` +
                        game.world.entities[stuff[1].targetTick.uid].targetTick.token + `\n\n\n`;
                    game.world.entities[stuff[1].targetTick.uid].currentModel.nameEntity.setString(newName);
                }
            }))
        game.world.localPlayer.entity.currentModel.nameEntity.setString(game.ui.playerTick.name)

        switch (document.getElementsByClassName('blockchatselect')[0].value) {
        case "Party":
            blockChatUid = [];
            game.ui.playerPartyMembers.forEach(function (e) {
                blockChatUid.push(e.playerUid);

            });
            break;
        case "All":
            blockChatUid = "All";
            break;
        case "None":
            blockChatUid = [];
            break;
        }

        let num = 0;
        for (var i in game.ui.parties) {
            let id = document.createElement('div');
            id.innerHTML = `<strong>${i}</strong>`;
            document.getElementsByClassName('hud-party-grid')[0].childNodes[num + 5].innerHTML = `<strong>${game.ui.parties[i].partyName}</strong>  <strong>id: ${game.ui.parties[i].partyId}</strong>  <span>${game.ui.parties[i].memberCount}/4</span>`;
            num++;

        }

        if (document.location.href != `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}`) {
            history.replaceState('', '', `/#/${game.options.serverId}/${game.ui.playerPartyShareKey}`);
        }
    }

});
/*------------------------------------------------------alt iframe multiple---------------------------------------------*/
if (!onIframe) {
    game.network.addEntityUpdateHandler(() => {
        for (var i = 1; i <= numOfAlts; i++) {
            var win = document.getElementById("frame" + i)
                .childNodes[0].contentWindow;
            var posx = win.game.ui.playerTick.position.x;
            var posy = win.game.ui.playerTick.position.y;
            if (altFollowPlayer) {
                if (posy - game.ui.playerTick.position.y > 110) {
                    win.game.network.sendInput({
                        down: 0
                    })
                } else {
                    win.game.network.sendInput({
                        down: 1
                    })
                }
                if (-posy + game.ui.playerTick.position.y > 110) {
                    win.game.network.sendInput({
                        up: 0
                    })
                } else {
                    win.game.network.sendInput({
                        up: 1
                    })
                }
                if (-posx + game.ui.playerTick.position.x > 110) {
                    win.game.network.sendInput({
                        left: 0
                    })
                } else {
                    win.game.network.sendInput({
                        left: 1
                    })
                }
                if (posx - game.ui.playerTick.position.x > 110) {
                    win.game.network.sendInput({
                        right: 0
                    })
                } else {
                    win.game.network.sendInput({
                        right: 1
                    })
                }
            }
        }
    });
}
/*--------------------------------------------------events--------------------------------------------------------*/
document.querySelector('#AHRC')
    .addEventListener('click', F_AHRC);
document.querySelector('.hud-intro-horizontallongestnickbtn')
document.querySelector('#daynight')
    .addEventListener('click', daynight);
document.querySelector('#spambtn')
    .addEventListener('click', F_spamchat);
document.querySelector('#clearchatbtn')
    .addEventListener('click', clearchat);
document.querySelector('.hud-intro-play')
    .addEventListener('click', joinserver);
document.querySelector('#healpet')
    .addEventListener('click', changehealpet);
document.querySelector('#revivepet')
    .addEventListener('click', changerevivepet);
document.querySelector('#autobow')
    .addEventListener('click', F_autobow);
document.querySelector('#autoevolvepet')
    .addEventListener('click', F_autoevolvepet);
document.querySelector('#autorespawn')
    .addEventListener('click', F_autorespawn);
document.querySelector('#autoequiptier2Spear')
    .addEventListener('click', F_autoequiptier2Spear);
document.querySelector('#sendAlt')
    .addEventListener('click', F_sendAlt);
document.querySelector('#deleteAllAlt')
    .addEventListener('click', F_deleteAllAlt);
document.querySelector('#altFollowPlayer')
    .addEventListener('click', F_altFollowPlayer);
document.querySelector('#deleteAlt')
    .addEventListener('click', F_deleteAlt);
//mapclick
document.querySelector('#hud-mapcontainer')
    .addEventListener('click', function (e) {
        mapmove(e)
    });
