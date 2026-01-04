// ==UserScript==
// @name         main x
// @namespace    -
// @version      v4
// @description  z ye basınca klonlar kılıç alır
// @author       :)
// @match        zombs.io
// @grant        none
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAMFBMVEX///8AAADw8PCamprp6emysrJNTU18fHzHx8doaGjZ2dnQ0NC9vb3h4eGnp6eMjIzCSNxaAAAErElEQVR4nO2c6baqMAyFKTKIOLz/214v6lF2SidaYK+V77dD04xNA1WlKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKFmp26Heew0ZqFtjTLv3KlYzifGk2Xsh6/iIYcxp76Ws4SvGk9veq0lmJoYx/d7rSaU2wGXvFaVyB0GGvReUilDJOe13RtO3ZR2sPrljaguCdGlZ8aXZx7lYAG+9MbUDSdKy4vC3EfexQIEwdn4HPqNxpaxjbqFDmzdmNH2QA/cgSEpWHAvGjPobkK7OD15QJQl2jsHP/Y9RXMOt5QGrSMiK6GjZAthlmP2u21oaVEm0heMvdMkLn1PjHnuWdoJPR1s4Box78tIB9F/P0oRKYrMi7kQ2y7rhyjxLw4XEmka37usOMIp4/F2oZIz6N9y3bJb19BIMI54fR5XEBS4sc+K2wQ1mKI/drivnB/jyuqUDwt/dm4ybGqMSNMy8B2Zh9m5/FyqJSO9X+GpOy6rkHnv8HT8esa2YtdauHJD+7izQhQaDVYLKzN6Kkf7uXBsGruAYimk9/7E/zt9FERx6LoEdyJgNP8j87twslDv0qJiqyQjQWtwlV+JRES24RAtCxFR3CMboEFY6wm6V6SdhhHf3SERDJeQvcLMyng1/iQrBST0uNMhC/SARipyGn1LNQzYs1qkUIdiVrhLOvPiVxEalHxmCXbpHsf2lI3phuds7EYIfjg9DKH34yz+o4AveFMkq2GUvP8GhuwbsLv56yT62qIJd9vJnKaewigmO1AXKky9RWfH14eEcaOobJZE3Mis6Pvx0qVO4fWASKXxRL7KiY+OaUGVMbOfqE/JgkmnnMN0Wv4AUWTHTiEP5kwggC5UsFdG2rj4hVJKl0YGBfYOZHFCJ5340FAgiJY6Ggl9r7jOl340K+DnfUmLIFlpAIRsN5LxV0uUrs8t3gay8VJJzsgwUstk4zrO8a3OGFcyyxU5UiG+UIxaI6OWTYSEwx26QDMuAKZZ1QBU9hHY+FU8GrArBKotVIeL0zKoQvMVnVYjoMLEqJPVG6GiIFgCpQnIN2O7O6uGugyAaGaRD6GIMwdXcPzJiEIz02RlhWKShV3b2SUNvmUbf9ggHIfX0yHGjwyJvIzkP6jWOYLI+WSbuuUkNS8rBaVhy1JPTsMRQGmkqtMhBWfTKyRxOB7HIQZnSZUJPfepyXyz+Qfm0uE0OxppXTOQYzraJzOeUAau2yUH4XohG1LuccljCrjGEL4GRZSKlHPIp2f/0dHLcxPggp39YzYpPjpstWhHKYVcHnRwL6mDL5/WCOtjqxLM1WD3TB1fdfhE96jdc6aOxpsD/bDI+motavpPgA9PxY9HHudzDIYa587hHYzs9feCJuk4xeKLVuBRwJ1iSedMupD8uLx8X0waTOprlrPHiwXAb1VwXCtw/OoI7A78UmWfoi3Br/VKY/vBWNTqD1MeqCCor+cYXSjEq680Tm3O8sd0REIpRydcV/ZD5OZnCLLoJlxiV7WHXyajYxKgsM3BcvvEFVUIScC3M/H2gFWM2BxfxToQj8nnYNeRtIYdmUkng20KOzanjjFOKoiiKoiiKwss/2hcaejBPt/YAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/434729/main%20x.user.js
// @updateURL https://update.greasyfork.org/scripts/434729/main%20x.meta.js
// ==/UserScript==
/*v2 added auto fix shield
v3 added auto heal (R for heal spam)
*/
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);
 
let css2 = `
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
.codeIn, .joinOut {
height: 50px;
}
.hud-menu-zipp3 {
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
z-index: 15;
}
.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
}
.hud-menu-zipp3 .hud-zipp-grid3 {
display: block;
height: 380px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity3"]::before {
background-image: url("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/au-kddi/190/sparkles_2728.png");
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
`;
 
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);
styles.type = "text/css";
 
// class changing
document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-Bc hud-intro-play");
 
// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);
 
//Menu for spell icon
let modHTML = `
<div class="hud-menu-zipp3">
<br />
<div style="text-align:center">
<button class="SE" style="width: 20%">Main (1)</button>
<button class="AB" style="width: 20%">Auto Build</button>
<button class="BS" style="width: 20%">Base Saver</button>
<button class="SI" style="width: 20%">Main (2)</button>
<div class="hud-zipp-grid3">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp3")[0];
 
//Onclick
document.getElementsByClassName("hud-zipp3-icon")[0].addEventListener("click", function() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        zipz123.style.display = "block";
    } else {
        zipz123.style.display = "none";
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
        if(zipz123.style.display == "block") {
            zipz123.style.display = "none";
        };
    });
});
 
document.getElementsByClassName("SE")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SE")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "";
        }
    }
})
 
document.getElementsByClassName("AB")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("AB")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main 3";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "";
        }
    }
})
 
document.getElementsByClassName("BS")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("BS")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Base Saver (1.69)";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "";
        }
    }
})
 
document.getElementsByClassName("SI")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SI")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main 2";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "";
        }
    }
})
// key to open and close
function modm() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        zipz123.style.display = "block";
    } else {
        zipz123.style.display = "none";
    };
};
function displayAllToNone() {
    document.getElementsByClassName("SE")[0].innerText = "Main (1)";
    document.getElementsByClassName("AB")[0].innerText = "Main (3)";
    document.getElementsByClassName("BS")[0].innerText = "Base Saver";
    document.getElementsByClassName("SI")[0].innerText = "Main (2)";
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
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "none";
        }
    }
}
 
document.getElementsByClassName("hud-zipp-grid3")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3 class="etc.Class">Main!</h3>
<hr />
<button class="btn btn-green 0i" style="width: 45%;">Sell Stash!</button>
 
<button class="btn btn-green 1i" style="width: 45%;">Sell All!</button>
 
<button class="btn btn-green 2i" style="width: 45%;">Sell Walls!</button>
 
<button class="btn btn-green 4i" style="width: 45%;">Sell Cannons!</button>
 
<button class="btn btn-green 3i" style="width: 45%;">Sell Melees!</button>
 
<button class="btn btn-green 5i" style="width: 45%;">Sell Bombs!</button>
 
<button class="btn btn-green 6i" style="width: 45%;">Sell Doors!</button>
 
<button class="btn btn-green 7i" style="width: 45%;">Sell Traps!</button>
 
<button class="btn btn-green 21i" style="width: 45%;">Sell Arrows!</button>
 
<button class="btn btn-green 20i" style="width: 45%;">Sell Mages!</button>
 
<button class="btn btn-green 22i" style="width: 45%;">Sell Pets!</button>
 
<button class="btn btn-blue 8i" style="width: 45%;">Active Upgrade All!</button>
 
<button class="btn btn-blue 9i" style="width: 45%;">Active AHRC!</button>
 
<button class="btn btn-blue 10i" style="width: 45%;">Enable Autobow</button>
 
<button class="btn btn-blue 13i" style="width: 45%;">Enable Auto Accepter</button>
 
<button class="btn btn-blue 14i" style="width: 45%;">Enable Auto Kicker</button>
 
<br class="15i"><br class="Main 2!">
 
<button class="btn btn-green 0i5" style="width: 45%;">Can Members Sell!</button>
 
<button class="btn btn-green 1i5" style="width: 45%;"">Kick All Members!</button>
 
<button class="btn btn-blue 3i5" style="width: 45%;">Enable hi Script!</button>
 
<button class="btn btn-blue 5i5" style="width: 45%;">Enable Send Info!</button>
 
<button class="btn btn-red 8i5" style="width: 45%;">!(Auto heal and Pet Heal)</button>
 
<button class="btn btn-red 9i5" style="width: 45%;">!(Revive and Evolve Pets)</button>
 
<button class="btn btn-blue 6i5" style="width: 45%;">Enable Speed Run</button>
 
<button class="btn btn-blue 10i5" style="width: 45%;">Clear Messages!</button>
 
<input style="width: 45%; type="text" class="btn btn-white 12i5" placeholder="Player Party Name">
 
<button class="btn btn-white 13i5" style="width: 45%;">Active Player Kicker</button>
 
<br class="14i5"><br class="Main 3!">
 
<button class="0i2">Send Alt!</button>
 
<button class="1i2">Enable Aim!</button>
 
<button class="2i2">Enable Player Follower!</button>
<button class="emm">Enable MouseMove!</button>
 
<br class="23i2"><br class="24i2">
 
<button class="3i2">Delete Alt!</button>
 
<input type="number" class="4i2" placeholder="Alt Id">
 
<button class="7i2">Delete All Alts!</button>
 
<br class="5i2"><br class="Main 3">
 
<button class="8i2">Show Resources!</button>
 
<button class="21i2">Control Alts!</button>
 
<button class="22i2">Uncontrol Alts!</button>
 
<br class="9i2"><br class="Main 2">
 
<button class="11i2">Start Aito!</button>
 
<button class="12i2">Active 4 Player Trick</button>
 
<button class="13i2">Enable L Key!</button>
 
<br class="14i2"><br class="Main 3!">
 
<input type="text" value="1" class="16i2" placeholder="Player Rank" style="width: 25%;">
 
<button class="18i2">Active Player Finder</button>
 
<button class="25i2">Follow Position</button> &nbsp;
 
<br class="19i2"><br class="Normal Scripts!">
 
<button class="0i3" onclick="RecordBase();">Record Base!</button>
<button class="1i3" onclick="buildRecordedBase();">Build Recorded Base!</button>
<button class="2i3" onclick="DeleteRecordedbase();">Delete Recorded Base!</button>
<br class="3i3"><br class="4i3">
<button class="5i3" onclick="RecordBase2();">Record Base (2)!</button>
<button class="6i3" onclick="buildRecordedBase2();">Build Recorded Base (2)!</button>
<button class="7i3" onclick="DeleteRecordedbase2();">Delete Recorded Base (2)!</button>
<br class="8i3"><br class="9i3">
<button class="10i3" onclick="RecordBase3();">Record Base (3)!</button>
<button class="11i3" onclick="buildRecordedBase3();">Build Recorded Base (3)!</button>
<button class="12i3" onclick="DeleteRecordedbase3();">Delete Recorded Base (3)!</button>
<br class="13i3"><br class="14i3">
<button class="15i3" onclick="saveBase();">Save Towers!</button>
<button class="16i3" onclick="buildSavedBase();">Build Saved Towers!</button>
<br class="17i3"><br class="18i3">
<button class="21i3" onclick="autobuildtoggle();">Enable Auto Build Saved Towers!</button>
<button class="26i3" onclick="upgradealltoggle();">Enable Upgrade All!</button>
<br class="28i3"><br class="29i3">
<input type="text" class="30i3" placeholder='Click "Save Towers!" and build your favorite base to get their codes.' style="width: 100%" disabled="true">
<br class="31i3"><br class="32i3">
 
`;
 
let Main1Keys = true;
let Main2Keys = true;
let Main3Keys = true;
 
displayAllToNone();
 
let upgradeAll = false;
let AHRC = false;
let autobow = false;
let accept = false;
let kick = false;
let run = false;
let heal = true;
let revive = true;
let clearMsgs = false;
let kick1p = false;
let autobuild = false;
let upgradeAll2 = false;
let petTimeout = false;
let myPlayer;
let myPet;
let shouldHealPet;
let autohi;
let autorss;
let uid;
let entities = {};
let players = {};
let buildings = {};
let msg;
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
}
 
game.network.addPacketHandler = function (event, callback) {
    console.log(packets[event], callback);
    game.network.emitter.on(packets[event], callback);
}
 
game.network.emitter.removeListener('PACKET_ENTITY_UPDATE', game.network.emitter._events.PACKET_ENTITY_UPDATE);
 
game.network.addPacketHandler(0, function(e) {
    msg = e;
    interval();
})
for (let i = 0; i < 10; i++) {
    game.network.addPacketHandler(i, function(e) {
        msg = e;
        interval();
    })
}
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
                if (autohi) {
                    game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: "Hello there, " + msg.entities[i].name})
                }
                if (autorss) {
                    game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: msg.entities[i].name + ", W: " + counter(msg.entities[i].wood) + ", S: " + counter(msg.entities[i].stone) + ", G: " + counter(msg.entities[i].gold) + ", T: " + Math.floor(msg.entities[i].token) + ";"})
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
        let entities = Game.currentGame.world.entities;
        if (upgradeAll) {
            if (!window.upgradeAll1) {
                window.upgradeAll1 = true;
                setTimeout(() => { window.upgradeAll1 = false; }, 100);
                for(let uid in entities) {
                    if(entities[uid].fromTick.tier !== 8 || entities[uid].fromTick.tier !== GetGoldStash().uid) {
                        Game.currentGame.network.sendRpc({
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
                setTimeout(() => { window.AHRC1 = false; }, 75);
                for(let uid in entities) {
                    if(!entities.hasOwnProperty(uid)) continue;
                    let obj = entities[uid];
                    Game.currentGame.network.sendRpc({
                        name: "CollectHarvester",
                        uid: obj.fromTick.uid
                    });
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.07
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.11
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.17
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.22
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.25
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.28
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.42
                        });
                    }
                    if(obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
                        Game.currentGame.network.sendRpc({
                            name: "AddDepositToHarvester",
                            uid: obj.fromTick.uid,
                            deposit: 0.65
                        });
                    }
                }
            }
        }
        if (autobow) {
            game.network.sendInput({space: 0})
            game.network.sendInput({space: 1})
        }
        if (accept) {
            for (let i2 = 0; i2 < document.getElementsByClassName("btn btn-green hud-confirmation-accept").length; i2++) {
                document.getElementsByClassName("btn btn-green hud-confirmation-accept")[i2].click();
            }
        }
        if (kick) {
            for (let i in Game.currentGame.ui.playerPartyMembers) {
                Game.currentGame.network.sendRpc({
                    name: "KickParty",
                    uid: Game.currentGame.ui.playerPartyMembers[i].playerUid
                })
            }
        }
        if (run) {
            for (let i = 0; i < document.getElementsByClassName("hud-shop-actions-equip").length; i++) {
                document.getElementsByClassName("hud-shop-actions-equip")[i].click();
            }
        }
        if (revive) {
            if (!window.reviver) {
                window.reviver = true;
                setTimeout(() => { window.reviver = false; }, 1000);
                let element1 = document.getElementsByClassName("hud-shop-actions-revive");
                for (let i=0;i<element1.length;i++) {
                    element1[i].click();
                }
                let element2 = document.getElementsByClassName("hud-shop-actions-evolve");
                for (let i=0;i<element2.length;i++) {
                    element2[i].click();
                }
            }
        }
        if (clearMsgs) {
            for (let i = 0; i < document.getElementsByClassName('hud-chat-message').length; i++) {
                document.getElementsByClassName('hud-chat-message')[i].remove();
            }
        }
        if (kick1p) {
            let player = document.getElementsByClassName("12i5")[0].value;
            for (let i in Game.currentGame.ui.playerPartyMembers) {
                if (Game.currentGame.ui.playerPartyMembers[i].displayName == player) {
                    Game.currentGame.network.sendRpc({
                        name: "KickParty",
                        uid: Game.currentGame.ui.playerPartyMembers[i].playerUid
                    })
                }
            }
        }
        if (autobuild) {
            if (!window.autobuildtimeout) {
                window.autobuildtimeout = true;
                setTimeout(() => { window.autobuildtimeout = false; }, 1250)
                if (GetGoldStash !== undefined) {
                    window.buildSavedBase();
                }
            }
        }
        if (upgradeAll2) {
            if (!window.upgradeAll2) {
                window.upgradeAll2 = true;
                setTimeout(() => { window.upgradeAll2 = false; }, 500);
                for(let uid in entities) {
                    if(entities[uid].fromTick.tier !== 8 || entities[uid].fromTick.tier !== GetGoldStash().uid) {
                        Game.currentGame.network.sendRpc({
                            name: "UpgradeBuilding",
                            uid: game.world.entities[uid].fromTick.uid
                        });
                    }
                }
            }
        }
        if (heal) {
            if (myPlayer) {
                let playerHealth = (myPlayer.health/myPlayer.maxHealth) * 100;
                if (playerHealth <= 70) {
                    healPlayer();
                }
            }
        }
        if (heal) {
            if (myPet) {
                let petHealth = (myPet.health/myPet.maxHealth) * 100;
                if (petHealth <= 70) {
                    if (!petTimeout) {
                        petTimeout = true;
                        setTimeout(() => { petTimeout = false; }, 300);
                        game.network.sendRpc({"name": "BuyItem", "itemName": "PetHealthPotion", "tier": 1})
                        game.network.sendRpc({"name": "EquipItem", "itemName": "PetHealthPotion", "tier": 1})
                    }
                }
            }
        }
        if (window.findPlayer) {
            if (myPlayer.position.y-window.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y-window.playerY), 2) + Math.pow((myPlayer.position.x-window.playerX), 2)) < 100) {
                game.network.sendInput({down: 0})
            } else {
                game.network.sendInput({down: 1})
            }
            if (-myPlayer.position.y+window.playerY > 100 || Math.sqrt(Math.pow((myPlayer.position.y-window.playerY), 2) + Math.pow((myPlayer.position.x-window.playerX), 2)) < 100) {
                game.network.sendInput({up: 0})
            } else {
                game.network.sendInput({up: 1})
            }
            if (-myPlayer.position.x+window.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y-window.playerY), 2) + Math.pow((myPlayer.position.x-window.playerX), 2)) < 100) {
                game.network.sendInput({left: 0})
            } else {
                game.network.sendInput({left: 1})
            }
            if (myPlayer.position.x-window.playerX > 100 || Math.sqrt(Math.pow((myPlayer.position.y-window.playerY), 2) + Math.pow((myPlayer.position.x-window.playerX), 2)) < 100) {
                game.network.sendInput({right: 0})
            } else {
                game.network.sendInput({right: 1})
            }
        }
    }
}
 
document.getElementsByClassName("emm")[0].addEventListener('click', function() {
    window.mousemove = !window.mousemove;
    this.innerText = window.mousemove ? "Disable MouseMove!" : "Enable MouseMove!"
})
 
document.getElementsByClassName("0i")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
 
document.getElementsByClassName("1i")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
 
document.getElementsByClassName("2i")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
 
document.getElementsByClassName("3i")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
 
document.getElementsByClassName("4i")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
 
document.getElementsByClassName("5i")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
 
document.getElementsByClassName("6i")[0].addEventListener('click', function() {
    for(let uid in game.ui.buildings) {
        if(game.ui.buildings[uid].type == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.ui.buildings[uid].uid
            });
        }
    }
})
 
document.getElementsByClassName("7i")[0].addEventListener('click', function() {
    for(let uid in game.world.entities) {
        if(game.world.entities[uid].fromTick.model == "PetCARL" || game.world.entities[uid].fromTick.model == "PetMiner") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: game.world.entities[uid].fromTick.uid
            });
        }
    }
})
 
document.getElementsByClassName("8i")[0].addEventListener('click', function() {
    upgradeAll = !upgradeAll;
    document.getElementsByClassName("8i")[0].className = "btn btn-blue 8i";
    document.getElementsByClassName("8i")[0].innerText = "Active Upgrade All!";
    if (upgradeAll) {
        document.getElementsByClassName("8i")[0].className = "btn btn-red 8i";
        document.getElementsByClassName("8i")[0].innerText = "Inactive Upgrade All!";
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
        if (game.ui.inventory.Spear) {
            game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: game.ui.inventory.Bow.tier})
        } else {
            game.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1})
            game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: 1})
        }
    } else {
        game.network.sendRpc({name: "EquipItem", itemName: playerWeapon, tier: game.ui.inventory[playerWeapon].tier})
    }
})
document.getElementsByClassName("13i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("13i")[0].className = "btn btn-blue 13i";
    document.getElementsByClassName("13i")[0].innerText = "Enable Auto Accepter";
    if (accept) {
        document.getElementsByClassName("13i")[0].className = "btn btn-red 13i";
        document.getElementsByClassName("13i")[0].innerText = "Disable Auto Accepter";
    }
})
document.getElementsByClassName("14i")[0].addEventListener('click', function() {
    kick = !kick;
    document.getElementsByClassName("14i")[0].className = "btn btn-blue 14i";
    document.getElementsByClassName("14i")[0].innerText = "Enable Auto Kicker";
    if (kick) {
        document.getElementsByClassName("14i")[0].className = "btn btn-red 14i";
        document.getElementsByClassName("14i")[0].innerText = "Disable Auto Kicker";
    }
})
document.getElementsByClassName("0i5")[0].addEventListener('click', function() {
    for (let i in game.ui.playerPartyMembers) {
        game.network.sendRpc({name: "SetPartyMemberCanSell", uid: game.ui.playerPartyMembers[i].playerUid, canSell: 1})
    }
})
document.getElementsByClassName("1i5")[0].addEventListener('click', function() {
    for (let i in game.ui.playerPartyMembers) {
        game.network.sendRpc({name: "KickParty", uid: game.ui.playerPartyMembers[i].playerUid})
    }
})
document.getElementsByClassName("6i5")[0].addEventListener('click', function() {
    run = !run;
    document.getElementsByClassName("6i5")[0].className = "btn btn-blue 6i5";
    document.getElementsByClassName("6i5")[0].innerText = "Enable Speed Run";
    if (run) {
        document.getElementsByClassName("6i5")[0].className = "btn btn-red 6i5";
        document.getElementsByClassName("6i5")[0].innerText = "Disable Speed Run";
    }
})
document.getElementsByClassName("8i5")[0].addEventListener('click', function() {
    heal = !heal;
    document.getElementsByClassName("8i5")[0].className = "btn btn-green 8i5";
    document.getElementsByClassName("8i5")[0].innerText = "Auto heal and Pet Heal";
    if (heal) {
        document.getElementsByClassName("8i5")[0].className = "btn btn-red 8i5";
        document.getElementsByClassName("8i5")[0].innerText = "!(Auto heal and Pet Heal)";
    }
})
document.getElementsByClassName("9i5")[0].addEventListener('click', function() {
    revive = !revive;
    document.getElementsByClassName("9i5")[0].className = "btn btn-green 9i5";
    document.getElementsByClassName("9i5")[0].innerText = "Revive and Evolve Pets";
    if (revive) {
        document.getElementsByClassName("9i5")[0].className = "btn btn-red 9i5";
        document.getElementsByClassName("9i5")[0].innerText = "!(Revive and Evolve Pets)";
    }
})
document.getElementsByClassName("10i5")[0].addEventListener('click', function() {
    clearMsgs = !clearMsgs;
    document.getElementsByClassName("10i5")[0].className = "btn btn-blue 10i5";
    document.getElementsByClassName("10i5")[0].innerText = "Clear Messages";
    if (clearMsgs) {
        document.getElementsByClassName("10i5")[0].className = "btn btn-red 10i5";
        document.getElementsByClassName("10i5")[0].innerText = "!(Clear Messages)";
    }
})
document.getElementsByClassName("13i5")[0].addEventListener('click', function() {
    kick1p = !kick1p;
    document.getElementsByClassName("13i5")[0].className = "btn btn-white 13i5";
    document.getElementsByClassName("13i5")[0].innerText = "Active Player Kicker";
    if (kick1p) {
        document.getElementsByClassName("13i5")[0].className = "btn btn-red 13i5";
        document.getElementsByClassName("13i5")[0].innerText = "!(Active Player Kicker)";
    }
})
document.getElementsByClassName("12i2")[0].addEventListener('click', function() {
    window.shouldStartScript = !window.shouldStartScript;
    document.getElementsByClassName("12i2")[0].innerText = "Active 4 Player Trick";
    if (window.shouldStartScript) {
        document.getElementsByClassName("12i2")[0].innerText = "!(Active 4 Player Trick)";
    }
})
document.getElementsByClassName("13i2")[0].addEventListener('click', function() {
    window.startaito7 = !window.startaito7;
    LKeyWithTimeouts();
    document.getElementsByClassName("13i2")[0].innerText = "Enable L Key!";
    if (window.startaito7) {
        document.getElementsByClassName("13i2")[0].innerText = "Disable L Key!";
    }
})
 
document.getElementsByClassName("0i2")[0].addEventListener('click', function() {
    window.sendWs();
})
document.getElementsByClassName("1i2")[0].addEventListener('click', function() {
    setTimeout(() => {
        if (window.aim) {
            document.getElementsByClassName("1i2")[0].innerText = "Disable Aim!";
        } else {
            document.getElementsByClassName("1i2")[0].innerText = "Enable Aim!";
        }
    }, 100)
})
document.getElementsByClassName("2i2")[0].addEventListener('click', function() {
    setTimeout(() => {
        if (window.move) {
            document.getElementsByClassName("2i2")[0].innerText = "Disable Player Follower!";
        } else {
            document.getElementsByClassName("2i2")[0].innerText = "Enable Player Follower!";
        }
    }, 100)
})
document.getElementsByClassName("11i2")[0].addEventListener('click', function() {
    window.startaito = !window.startaito;
    window.sendAitoAlt();
    if (window.startaito) {
        document.getElementsByClassName("11i2")[0].innerText = "Stop Aito!";
    } else {
        document.getElementsByClassName("11i2")[0].innerText = "Start Aito!";
    }
});
document.getElementsByClassName("3i2")[0].addEventListener('click', function() {
    let id = Math.floor(document.getElementsByClassName("4i2")[0].value);
    window.allSockets[id-1].close();
})
game.network.sendInput = (e) => {
    let i = e;
    if (!i.mouseDown && !i.mouseUp) {
        game.network.sendPacket(3, e);
    }
}
document.getElementsByClassName('hud')[0].addEventListener('mousedown', e => {
    if (!e.button) {
        game.network.sendPacket(3, {mouseDown: game.inputPacketCreator.screenToYaw(e.clientX, e.clientY)})
    }
})
document.getElementsByClassName('hud')[0].addEventListener('mouseup', e => {
    if (!e.button) {
        game.network.sendPacket(3, {mouseUp: 1})
    }
})
 
window.RecordBase = function(baseName) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");
        let buildings = Game.currentGame.ui.buildings;
        let base = "";
        let stash = GetGoldStash();
        if (stash == undefined) {
            return
        }
        let stashPosition = {
            x: stash.x,
            y: stash.y
        }
        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) {
                continue
            }
 
            let obj = buildings[uid]
            let x = Game.currentGame.ui.buildings[obj.uid].x - stashPosition.x
            let y = Game.currentGame.ui.buildings[obj.uid].y - stashPosition.y
            let building = Game.currentGame.ui.buildings[obj.uid].type
            let yaw = 180;
            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        }
        localStorage.RecordedBase1 = base
    })
}
window.buildRecordedBase = function() {
    let waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
            var basecode = localStorage.RecordedBase1
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.DeleteRecordedbase = function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");
        localStorage.RecordedBase1 = null;
    })
}
window.RecordBase2 = function(baseName) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");
        let buildings = Game.currentGame.ui.buildings;
        let base = "";
        let stash = GetGoldStash();
        if (stash == undefined) {
            return
        }
        let stashPosition = {
            x: stash.x,
            y: stash.y
        }
        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) {
                continue
            }
 
            let obj = buildings[uid]
            let x = Game.currentGame.ui.buildings[obj.uid].x - stashPosition.x
            let y = Game.currentGame.ui.buildings[obj.uid].y - stashPosition.y
            let building = Game.currentGame.ui.buildings[obj.uid].type
            let yaw = 180;
            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        }
        localStorage.RecordedBase2 = base
    })
}
window.buildRecordedBase2 = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
            var basecode = localStorage.RecordedBase2
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.DeleteRecordedbase2 = function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");
        localStorage.RecordedBase2 = null;
    })
}
window.RecordBase3 = function(baseName) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base? If you recorded it twice, the first recorded base will be deleted.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded!");
        let buildings = Game.currentGame.ui.buildings;
        let base = "";
        let stash = GetGoldStash();
        if (stash == undefined) {
            return
        }
        let stashPosition = {
            x: stash.x,
            y: stash.y
        }
        for (var uid in buildings) {
            if (!buildings.hasOwnProperty(uid)) {
                continue
            }
 
            let obj = buildings[uid]
            let x = Game.currentGame.ui.buildings[obj.uid].x - stashPosition.x
            let y = Game.currentGame.ui.buildings[obj.uid].y - stashPosition.y
            let building = Game.currentGame.ui.buildings[obj.uid].type
            let yaw = 180;
            base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");"
        }
        localStorage.RecordedBase3 = base
    })
}
window.buildRecordedBase3 = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully recorded base were built!");
            var basecode = localStorage.RecordedBase3
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.DeleteRecordedbase3 = function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete recorded base?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Successfully recorded base has been deleted!");
        localStorage.RecordedBase3 = null;
    })
}
window.buildSavedBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            game.ui.components.PopupOverlay.showHint("Successfully saved base were built!");
            var basecode = document.getElementsByClassName("30i3")[0].value;
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.saveBase = () => {
    game.ui.components.PopupOverlay.showHint("Successfully saved!");
    let buildings = Game.currentGame.ui.buildings;
    let base = "";
    let stash = GetGoldStash();
    if (stash == undefined) {
        return
    }
    let stashPosition = {
        x: stash.x,
        y: stash.y
    }
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }
        let obj = buildings[uid]
        let x = Game.currentGame.ui.buildings[obj.uid].x - stashPosition.x
        let y = Game.currentGame.ui.buildings[obj.uid].y - stashPosition.y
        let building = Game.currentGame.ui.buildings[obj.uid].type
        let yaw = 180;
        base += "PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + building + "', " + yaw + ");";
    }
    document.getElementsByClassName("30i3")[0].value = base;
}
window.upgradealltoggle = () => {
    upgradeAll2 = !upgradeAll2;
    document.getElementsByClassName("26i3")[0].innerText = "Enable Upgrade All!";
    if (upgradeAll2) {
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
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
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
 
function healPlayer() {
    if (!game.ui.components.PlacementOverlay.buildingId && !game.ui.components.BuildingOverlay.buildingId) {
        Game.currentGame.network.sendRpc({
            "name": "BuyItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
 
        Game.currentGame.network.sendRpc({
            "name": "EquipItem",
            "itemName": "HealthPotion",
            "tier": 1
        })
    }
}
window.allSockets = [];
window.FKey = false;
window.FKeyOn = null;
window.socketId1 = 1;
window.socketId2 = 2;
var cloneTimeout = false;
window.sendWs = () => {
    let mousePosition3;
    let isOnControl = true;
    let isTrue = true;
    let ws = new WebSocket(`ws://${game.options.servers[game.options.serverId].hostname}:8000`);
    if (!window.allSockets[window.allSockets.length]) {
        ws.cloneId = window.allSockets.length + 1;
        window.allSockets[window.allSockets.length] = ws;
    }
    ws.binaryType = "arraybuffer";
    ws.aimingYaw = 1;
    ws.onclose = () => {
        ws.isclosed = true;
    }
    ws.onopen = () => {
        ws.network = new Game.currentGame.networkType();
        ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
        ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
        ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
    }
    ws.onEnterWorld = () => {
        // useless
    }
    ws.onmessage = msg => {
        ws.data = ws.network.codec.decode(msg.data);
        switch (ws.data.opcode) {
            case 5:
                ws.send(ws.network.codec.encode(4, { displayName: game.options.nickname, extra: ws.data.extra }));
                break;
        }
        if (isTrue) {
            isTrue = !isTrue;
            if (ws.psk) {
                ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
            } else {
                setTimeout(() => {
                    if (ws.psk) {
                        ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                    }
                }, 250)
            }
            ws.network.sendInput({up: 1});
            ws.mouseUp = 1;
            ws.mouseDown = 0;
            ws.f = false;
            function mouseMoved(e, x, y, d) {
                ws.aimingYaw = e;
                if (ws.mouseDown && !ws.mouseUp) {
                    ws.network.sendInput({mouseMovedWhileDown: e, worldX: x, worldY: y, distance: d});
                }
                if (!ws.mouseDown && ws.mouseUp) {
                    ws.network.sendInput({mouseMoved: e, worldX: x, worldY: y, distance: d});
                }
            }
            document.addEventListener('mousemove', mousemove => {
                if (isOnControl) {
                    if (!ws.isclosed) {
                        mousePosition3 = game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY);
                        if (ws.myPlayer) {
                            if (ws.myPlayer.position) {
                                mouseMoved(game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + mousePosition3.x)*100, (-ws.myPlayer.position.y + mousePosition3.y)*100), Math.floor(mousePosition3.x), Math.floor(mousePosition3.y), Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x)*100, (-ws.myPlayer.position.y + mousePosition3.y)*100)/100));
                            }
                        }
                    }
                }
            })
            let SendRpc = ws.network.sendRpc;
            let SendInput = ws.network.sendInput;
            document.addEventListener('keydown', e => {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (e.keyCode == 81 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            setTimeout(() => {
                                var nextWeapon = 'Pickaxe';
                                var weaponOrder = ['Pickaxe', 'Spear', 'Bow', 'Bomb'];
                                var foundCurrent = false;
                                for (let i in weaponOrder) {
                                    if (foundCurrent) {
                                        if (ws.inventory[weaponOrder[i]]) {
                                            nextWeapon = weaponOrder[i];
                                            break;
                                        }
                                    }
                                    else if (weaponOrder[i] == ws.myPlayer.weaponName) {
                                        foundCurrent = true;
                                    }
                                }
                                ws.network.sendRpc({name: 'EquipItem', itemName: nextWeapon, tier: ws.inventory[nextWeapon].tier});
                            }, 100);
                        }
                        if (e.keyCode == 72 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            ws.network.sendRpc({name: 'LeaveParty'});
                        }
                        if (e.keyCode == 74 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            ws.network.sendRpc({name: 'JoinPartyByShareKey', partyShareKey: game.ui.playerPartyShareKey});
                        }
 
                        if (e.keyCode == 32 && document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            setTimeout(() => {
                                ws.network.sendInput({space: 0});
                                ws.network.sendInput({space: 1});
                            }, 100);
                        }
                        if (e.keyCode == 82) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                for (let i in game.ui.buildings) {
                                    if (game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier) {
                                        ws.network.sendRpc({name: "UpgradeBuilding", uid: game.ui.buildings[i].uid});
                                    }
                                }
                            }
                        }
                        if (e.keyCode == 46) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (ws.myPet) {
                                    ws.network.sendRpc({name: "DeleteBuilding", uid: ws.myPet.uid});
                                }
                            }
                        }
                        if (e.keyCode == 82) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingUid) {
                                    ws.network.sendRpc({name: "UpgradeBuilding", uid: game.ui.components.BuildingOverlay.buildingUid});
                                }
                            }
                        }
                        if (e.keyCode == 89) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                for (let i in game.ui.buildings) {
                                    if (game.ui.components.BuildingOverlay.buildingUid && game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier && game.ui.components.BuildingOverlay.buildingId !== "GoldStash") {
                                        ws.network.sendRpc({name: "DeleteBuilding", uid: game.ui.buildings[i].uid})
                                    }
                                }
                            }
                        }
                        if (e.keyCode == 84) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                for (var i in game.ui.buildings) {
                                    if (game.ui.components.BuildingOverlay.buildingUid && game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.buildings[i].type == game.ui.components.BuildingOverlay.buildingId && game.ui.buildings[i].tier == game.ui.components.BuildingOverlay.buildingTier && game.ui.components.BuildingOverlay.buildingId !== "GoldStash") {
                                        game.network.sendRpc({name: "DeleteBuilding", uid: game.ui.buildings[i].uid});
                                    }
                                }
                            }
                        }
                        if (e.keyCode == 89) {
                            if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                                if (!game.ui.components.BuildingOverlay.shouldUpgradeAll && game.ui.components.BuildingOverlay.buildingId !== "GoldStash" && game.ui.components.BuildingOverlay.buildingUid) {
                                    ws.network.sendRpc({name: "DeleteBuilding", uid: game.ui.components.BuildingOverlay.buildingUid})
                                }
                            }
                        }
                        let KeyCode = e.keyCode;
                        if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            if (!ws.automove) {
                                if (KeyCode == 76) {
                                    ws.network.sendInput({up: 1, down: 0});
                                }
                                if (KeyCode == 191) {
                                    ws.network.sendInput({right: 1, left: 0});
                                }
                                if (KeyCode == 190) {
                                    ws.network.sendInput({down: 1, up: 0});
                                }
                                if (KeyCode == 188) {
                                    ws.network.sendInput({left: 1, right: 0});
                                }
                                if (KeyCode == 87) {
                                    ws.network.sendInput({up: 1, down: 0});
                                }
                                if (KeyCode == 68) {
                                    SendInput({right: 1, left: 0});
                                }
                                if (KeyCode == 83) {
                                    ws.network.sendInput({down: 1, up: 0});
                                }
                                if (KeyCode == 65) {
                                    ws.network.sendInput({left: 1, right: 0});
                                }
                            }
                            if (e.keyCode == 82) {
                                ws.network.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1})
                                ws.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1})
                            }
                            if (KeyCode == 78) {
                                ws.network.sendRpc({
                                    "name": "EquipItem",
                                    "itemName": "HatHorns",
                                    "tier": 1
                                })
                                ws.network.sendRpc({
                                    "name": "EquipItem",
                                    "itemName": "PetCARL",
                                    "tier": ws.inventory.PetCARL.tier
                                })
                                ws.network.sendRpc({
                                    "name": "EquipItem",
                                    "itemName": "PetMiner",
                                    "tier": ws.inventory.PetMiner.tier
                                })
                            }
                            if (KeyCode == 77) {
                                ws.network.sendRpc({
                                    "name": "BuyItem",
                                    "itemName": "PetRevive",
                                    "tier": 1
                                })
                                ws.network.sendRpc({
                                    "name": "EquipItem",
                                    "itemName": "PetRevive",
                                    "tier": 1
                                })
                                ws.network.sendRpc({
                                    "name": "BuyItem",
                                    "itemName": "PetCARL",
                                    "tier": ws.inventory.PetCARL.tier + 1
                                })
                                ws.network.sendRpc({
                                    "name": "BuyItem",
                                    "itemName": "PetMiner",
                                    "tier": ws.inventory.PetMiner.tier + 1
                                })
                            }
                            if (KeyCode == 221) {
                                game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: ws.psk.response.partyShareKey})
                            }
                        }
                    }
                }
            })
            document.addEventListener('keyup', e => {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        let KeyCode = e.keyCode;
                        if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
                            if (!ws.automove) {
                                if (KeyCode == 76) {
                                    ws.network.sendInput({up: 0});
                                }
                                if (KeyCode == 191) {
                                    ws.network.sendInput({right: 0});
                                }
                                if (KeyCode == 190) {
                                    ws.network.sendInput({down: 0});
                                }
                                if (KeyCode == 188) {
                                    ws.network.sendInput({left: 0});
                                }
                                if (KeyCode == 87) {
                                    ws.network.sendInput({up: 0});
                                }
                                if (KeyCode == 68) {
                                    ws.network.sendInput({right: 0});
                                }
                                if (KeyCode == 83) {
                                    ws.network.sendInput({down: 0});
                                }
                                if (KeyCode == 65) {
                                    ws.network.sendInput({left: 0});
                                }
                            }
                        }
                    }
                }
            })
            document.getElementsByClassName("hud")[0].addEventListener("mousedown", function(e) {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (!e.button) {
                            ws.mouseDown = 1;
                            ws.mouseUp = 0;
                            ws.network.sendInput({mouseDown: ws.aimingYaw, worldX: Math.floor(mousePosition3.x), worldY: Math.floor(mousePosition3.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x)*100, (-ws.myPlayer.position.y + mousePosition3.y)*100)/100)});
                        }
                    }
                }
            });
            document.getElementsByClassName("hud")[0].addEventListener("mouseup", function(e) {
                if (!ws.isclosed) {
                    if (isOnControl) {
                        if (!e.button) {
                            ws.mouseUp = 1;
                            ws.mouseDown = 0;
                            ws.network.sendInput({mouseUp: 1, worldX: Math.floor(mousePosition3.x), worldY: Math.floor(mousePosition3.y), distance: Math.floor(game.inputPacketCreator.distanceToCenter((-ws.myPlayer.position.x + mousePosition3.x)*100, (-ws.myPlayer.position.y + mousePosition3.y)*100)/100)});
                        }
                    }
                }
            });
            document.getElementsByClassName("hud-shop-item")[0].addEventListener('click', function() {
                ws.network.sendRpc({name: "BuyItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier+1});
            });
            document.getElementsByClassName("hud-shop-item")[1].addEventListener('click', function() {
                if (!ws.inventory.Spear) {
                    ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: 1});
                } else {
                    ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: ws.inventory.Spear.tier+1});
                }
            });
            document.getElementsByClassName("hud-shop-item")[2].addEventListener('click', function() {
                if (!ws.inventory.Bow) {
                    ws.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1});
                } else {
                    ws.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: ws.inventory.Bow.tier+1});
                }
            });
            document.getElementsByClassName("hud-shop-item")[3].addEventListener('click', function() {
                if (!ws.inventory.Bomb) {
                    ws.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: 1});
                } else {
                    ws.network.sendRpc({name: "BuyItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier+1});
                }
            });
            document.getElementsByClassName("hud-shop-item")[4].addEventListener('click', function() {
                ws.network.sendRpc({name: "BuyItem", itemName: "ZombieShield", tier: 1});
            });
            document.getElementsByClassName("hud-toolbar-item")[0].addEventListener('mouseup', function(e) {
                if (!e.button) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Pickaxe", tier: ws.inventory.Pickaxe.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[1].addEventListener('mouseup', function(e) {
                if (!e.button) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[2].addEventListener('mouseup', function(e) {
                if (!e.button) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[3].addEventListener('mouseup', function(e) {
                if (!e.button) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "Bomb", tier: ws.inventory.Bomb.tier});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[4].addEventListener('mouseup', function(e) {
                if (!e.button) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[5].addEventListener('mouseup', function(e) {
                if (!e.button) {
                    ws.network.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1});
                }
            });
            document.getElementsByClassName("hud-toolbar-item")[6].addEventListener("mouseup", function(e) {
                if (!e.button) {
                    ws.network.sendRpc({name: "RecallPet"});
                    ws.network.sendInput({respawn: 1});
                    ws.automove = !ws.automove;
                    if (ws.automove) {
                        window.move = true;
                    } else {
                        window.move = false;
                    }
                }
            });
            document.getElementsByClassName("10i")[0].addEventListener('click', () => {
                ws.activebow = !ws.activebow;
                ws.playerWeapon = ws.myPlayer.weaponName;
                if (ws.activebow) {
                    if (ws.inventory.Spear) {
                        ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: ws.inventory.Spear.tier})
                    } else {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Spear", tier: 1})
                        ws.network.sendRpc({name: "EquipItem", itemName: "Spear", tier: 1})
                    }
                } else {
                    ws.network.sendRpc({name: "EquipItem", itemName: ws.playerWeapon, tier: ws.inventory[ws.playerWeapon].tier})
                }
            })
            if (window.aim) {
                ws.autoaim = true;
            }
            if (window.move) {
                ws.automove = true;
            }
            if (window.autohiBot) {
                ws.autohi = true;
            }
            document.getElementsByClassName("1i2")[0].addEventListener('click', () => {
                ws.autoaim = !ws.autoaim;
                if (ws.autoaim) {
                    window.aim = true;
                } else {
                    window.aim = false;
                }
            })
            document.getElementsByClassName("2i2")[0].addEventListener('click', () => {
                ws.automove = !ws.automove;
                if (ws.automove) {
                    window.move = true;
                } else {
                    window.move = false;
                }
            })
            document.getElementsByClassName("7i2")[0].addEventListener('click', () => {
                ws.close();
            })
            document.getElementsByClassName("8i2")[0].addEventListener('click', () => {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `${ws.players[ws.uid].name}, W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`})
            })
            document.getElementsByClassName("21i2")[0].addEventListener('click', () => {
                isOnControl = true;
            })
            document.getElementsByClassName("22i2")[0].addEventListener('click', () => {
                isOnControl = false;
            })
            window.playerIds = {
                id1: allSockets[window.socketId1 - 1],
                id2: allSockets[window.socketId2 - 1]
            }
        }
        if (window.testing) {
            ws.network.sendRpc({name: "SetOpenParty", isOpen: 0})
            ws.network.sendRpc({name: "SetPartyName", partyName: ws.cloneId + ''})
        }
        if (ws.data.uid) {
            ws.uid = ws.data.uid;
            ws.dataInfo = ws.data;
            ws.players = {};
            ws.inventory = {};
            ws.buildings = {};
            ws.parties = {};
            ws.lb = {}
            ws.playerUid = game.world.myUid;
            ws.network.sendInput({space: 1});
            ws.network.sendRpc({name: "BuyItem", itemName: "HatHorns", tier: 1})
            ws.network.sendRpc({name: "BuyItem", itemName: "PetCARL", tier: 1})
            ws.network.sendRpc({name: "BuyItem", itemName: "PetMiner", tier: 1})
        }
        if (ws.data.entities) {
            if (window.message == ws.cloneId) {
                game.world.replicator.onEntityUpdate(ws.data);
            }
            if (ws.data.entities[ws.uid].name) {
                ws.myPlayer = ws.data.entities[ws.uid];
            }
            for (let g in ws.myPlayer) {
                if (ws.myPlayer[g] !== ws.data.entities[ws.uid][g] && ws.data.entities[ws.uid][g] !== undefined) {
                    ws.myPlayer[g] = ws.data.entities[ws.uid][g];
                }
            }
            if (ws.myPlayer.petUid) {
                if (ws.data.entities[ws.myPlayer.petUid]) {
                    if (ws.data.entities[ws.myPlayer.petUid].model) {
                        ws.myPet = ws.data.entities[ws.myPlayer.petUid];
                        ws.shouldHealPet = false;
                    }
                }
                for (let g in ws.myPet) {
                    if (ws.data.entities[ws.myPlayer.petUid]) {
                        if (ws.myPet[g] !== ws.data.entities[ws.myPlayer.petUid][g] && ws.data.entities[ws.myPlayer.petUid][g] !== undefined) {
                            ws.myPet[g] = ws.data.entities[ws.myPlayer.petUid][g]
                        }
                    }
                }
            }
            for (let i in ws.data.entities) {
                if (ws.data.entities[i].name) {
                    ws.players[i] = ws.data.entities[i];
                }
            }
            for (let i in ws.players) {
                if (!ws.data.entities[i]) {
                    delete ws.players[i];
                }
                for (let g in ws.players[i]) {
                    if (ws.players[i][g] !== ws.data.entities[i][g] && ws.data.entities[i][g] !== undefined) {
                        ws.players[i][g] = ws.data.entities[i][g];
                    }
                }
                ws.playerTick = ws.players[ws.playerUid];
            }
        }
        if (ws.data.name == "DayCycle") {
            ws.tickData = ws.data.response;
            ws.isDay = ws.data.response.isDay;
        }
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
                }
                else if (ws.tickData.nightEndTick > 0) {
                    var nightLength = ws.tickData.nightEndTick - ws.tickData.cycleStartTick;
                    var nightTicksRemaining = ws.tickData.nightEndTick - currentTick;
                    dayRatio = 1;
                    nightRatio = 1 - nightTicksRemaining / nightLength;
                }
                var currentPosition = (dayRatio * 1 / 2 + nightRatio * 1 / 2) * -barWidth;
                var offsetPosition = currentPosition + barWidth / 2;
                if (offsetPosition) {
                    ws.dayTicker = Math.round(offsetPosition);
                }
            }
        }
        if (ws.data.name == "PartyInfo") {
            ws.partyInfo = ws.data.response;
            setTimeout(() => {
                for (let i in ws.partyInfo) {
                    if (ws.partyInfo[i].playerUid == ws.uid && ws.partyInfo[i].isLeader) {
                        ws.network.sendRpc({name: "SetPartyMemberCanSell", uid: game.world.myUid, canSell: 1});
                        ws.network.sendRpc({name: "SetOpenParty", isOpen: 1});
                        setTimeout(() => {
                            ws.network.sendRpc({name: "SetPartyName", partyName: ws.id + ""});
                        }, 1000);
                    }
                }
            }, 1750);
        }
        if (ws.data.name == "PartyApplicant") {
            ws.partyApplicant = ws.data.response;
            if (ws.partyApplicant.applicantUid == game.world.myUid) {
                ws.network.sendRpc({name: "PartyApplicantDecide", applicantUid: game.world.myUid, accepted: 1})
            }
        }
        if (ws.data.name == "PartyShareKey") {
            ws.psk = ws.data.response.partyShareKey;
            if (window.FKey && cloneTimeout) {
                if (allSockets[1].psk !== allSockets[0].psk) {
                    game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id2.psk});
                }
            }
        }
        if (ws.data.name == "ReceiveChatMessage") {
            ws.message = ws.data;
            if (ws.message.response.message == "!move" && ws.message.response.uid == game.world.myUid) {
                ws.automove = true;
            }
            if (ws.message.response.message == "!unmove" && ws.message.response.uid == game.world.myUid) {
                ws.automove = false;
            }
            if (ws.message.response.message[0] == `#` && ws.message.response.uid == game.world.myUid) {
                let word = ws.message.response.message;
                let uid = '';
                for (let i = 0; i < 30; i++) {
                    if (Math.round(word[i] == 0 || word[i] == 1 || word[i] == 2 || word[i] == 3 || word[i] == 4 || word[i] == 5 || word[i] == 6 || word[i] == 7 || word[i] == 8 || word[i] == 9)) {
                        uid += word[i]
                    }
                    uid = Math.round(uid);
                    ws.playerUid = uid;
                }
            }
            if (ws.message.response.message == "!aim" && ws.message.response.uid == game.world.myUid) {
                ws.autoaim = true;
            }
            if (ws.message.response.message == "!unaim" && ws.message.response.uid == game.world.myUid) {
                ws.autoaim = false;
            }
            if (ws.message.response.message == "!control" && ws.message.response.uid == game.world.myUid) {
                isOnControl = true;
            }
            if (ws.message.response.message == "!uncontrol" && ws.message.response.uid == game.world.myUid) {
                isOnControl = false;
            }
            if (window.allSockets[ws.cloneId-1]) {
                window.allSockets[ws.cloneId-1] = ws;
            }
            if (ws.message.response.message == `!psk ${ws.uid}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `${ws.psk.response.partyShareKey}`})
            }
            if (ws.message.response.message == `!crash ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `Successfully crashed ${ws.uid}!`})
            }
            if (ws.message.response.message == "hi") {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: ` hi `})
            }
            if (ws.message.response.message == "!space") {
                ws.network.sendInput({space: 0})
                ws.network.sendInput({space: 1})
            }
            if (ws.message.response.message == "!stats") {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `${ws.players[ws.message.response.uid].name}, W: ${counter(ws.players[ws.message.response.uid].wood)}, S: ${counter(ws.players[ws.message.response.uid].stone)}, G: ${counter(ws.players[ws.message.response.uid].gold)}, T: ${Math.floor(ws.players[ws.message.response.uid].token)};`})
            }
            if (ws.message.response.message == "!s" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `${ws.players[ws.uid].name}, W: ${counter(ws.players[ws.uid].wood)}, S: ${counter(ws.players[ws.uid].stone)}, G: ${counter(ws.players[ws.uid].gold)}, ID: ${ws.cloneId};`})
            }
            if (ws.message.response.message == "!h" && ws.message.response.uid == game.world.myUid) {
                ws.autohi = !ws.autohi;
                if (ws.autohi) {
                    window.autohiBot = true;
                } else {
                    window.autohiBot = false;
                }
            }
            if (ws.message.response.message == "!ahrc" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `ahrc is active!`})
                ws.ahrc = true;
            }
            if (ws.message.response.message == `!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `ahrc is active!`})
                ws.ahrc = true;
            }
            if (ws.message.response.message == "!!ahrc" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `ahrc is inactive!`})
                ws.ahrc = false;
            }
            if (ws.message.response.message == `!!ahrc ${ws.cloneId}` && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `ahrc is inactive!`})
                ws.ahrc = false;
            }
            if (ws.message.response.message == "!upgrade" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: "successfully upgraded the base!"});
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "GoldMine") {
                        ws.network.sendRpc({name: "UpgradeBuilding", uid: ws.buildings[i].uid})
                    }
                    setTimeout(() => {
                        ws.network.sendRpc({name: "UpgradeBuilding", uid: ws.buildings[i].uid})
                    }, 100);
                }
            }
            if (ws.message.response.message == "!up" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "BuyItem", itemName: ws.buildings[i].uid})
            }
            if (ws.message.response.message == "!upgradeStash" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: "successfully upgraded the stash!"});
                for (let i in ws.buildings) {
                    if (ws.buildings[i].type == "GoldStash") {
                        ws.network.sendRpc({name: "UpgradeBuilding", uid: ws.buildings[i].uid})
                    }
                }
            }
            if (ws.message.response.message == "a" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendInput({left: 1});
                ws.network.sendInput({right: 0});
            }
            if (ws.message.response.message == "d" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendInput({right: 1});
                ws.network.sendInput({left: 0});
            }
            if (ws.message.response.message == "w" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendInput({up: 1});
                ws.network.sendInput({down: 0});
            }
            if (ws.message.response.message == "s" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendInput({down: 1});
                ws.network.sendInput({up: 0});
            }
            if (ws.message.response.message == "f" && ws.message.response.uid == game.world.myUid) {
                ws.network.sendInput({left: 0});
                ws.network.sendInput({right: 0});
                ws.network.sendInput({down: 0});
                ws.network.sendInput({up: 0});
            }
        }
        if (ws.autohi) {
            if (ws.data.entities) {
                for (let i in ws.data.entities) {
                    if (ws.data.entities[i].name) {
                        ws.network.sendRpc({name: "SendChatMessage", channel: "Local", message: `hi ${ws.data.entities[i].name}`});
                    }
                }
            }
        }
        if (ws.data.name == "Leaderboard") {
            for (let i in ws.data.response) {
                ws.lb[ws.data.response[i].rank + 1] = ws.data.response[i];
            }
            if (ws.ahrc) {
                for(let uid in ws.buildings) {
                    let obj = ws.buildings[uid];
                    ws.network.sendRpc({name: "CollectHarvester",uid: obj.uid});
                    if(obj.type == "Harvester" && obj.tier == 1) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 20/2});
                    }
                    if(obj.type == "Harvester" && obj.tier == 2) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 30/2});
                    }
                    if(obj.type == "Harvester" && obj.tier == 3) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 35/2});
                    }
                    if(obj.type == "Harvester" && obj.tier == 4) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 50/2});
                    }
                    if(obj.type == "Harvester" && obj.tier == 5) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 60/2});
                    }
                    if(obj.type == "Harvester" && obj.tier == 6) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 70/2});
                    }
                    if(obj.type == "Harvester" && obj.tier == 7) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 120/2});
                    }
                    if(obj.type == "Harvester" && obj.tier == 8) {
                        ws.network.sendRpc({name: "AddDepositToHarvester",uid: obj.uid,deposit: 150/2});
                    }
                }
            }
        }
        if (ws.data.name == "LocalBuilding") {
            for (let i in ws.data.response) {
                ws.buildings[ws.data.response[i].uid] = ws.data.response[i];
                if (ws.buildings[ws.data.response[i].uid].dead) {
                    delete ws.buildings[ws.data.response[i].uid];
                }
            }
        }
        if (ws.data.name == "AddParty") {
            if (ws.addparties) {
                ws.parties[ws.data.response.partyId] = ws.data.response;
            }
        }
        if (ws.data.name == "RemoveParty") {
            if (ws.addparties) {
                if (ws.parties[ws.data.response.partyId].partyId) {
                    delete ws.parties[ws.data.response.partyId];
                }
            }
        }
        if (ws.data.name == "PartyShareKey") {
            ws.psk = ws.data;
            if (window.FKey && cloneTimeout) {
                if (window.playerIds.id2.psk.response.partyShareKey !== window.playerIds.id1.psk.response.partyShareKey) {
                    game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id2.psk.response.partyShareKey});
                    setTimeout(() => {
                        game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id2.psk.response.partyShareKey});
                    }, 500);
                    setTimeout(() => {
                        game.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id2.psk.response.partyShareKey});
                    }, 1000);
                }
            }
        }
        if (ws.data.name == "Dead") {
            ws.network.sendRpc({name: "BuyItem", itemName: "HatHorns", tier: 1});
            if (cloneTimeout) {
                game.network.sendInput({respawn: 1});
            }
        }
        if(window.mousemove) {
            let mousePos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
            if (ws.myPlayer.position.y-mousePos.y > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-mousePos.y), 2) + Math.pow((ws.myPlayer.position.x-mousePos.x), 2)) < 100) {
                ws.network.sendInput({down: 0})
            } else {
                ws.network.sendInput({down: 1})
            }
            if (-ws.myPlayer.position.y+mousePos.y > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-mousePos.y), 2) + Math.pow((ws.myPlayer.position.x-mousePos.x), 2)) < 100) {
                ws.network.sendInput({up: 0})
            } else {
                ws.network.sendInput({up: 1})
            }
            if (-ws.myPlayer.position.x+mousePos.x > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-mousePos.y), 2) + Math.pow((ws.myPlayer.position.x-mousePos.x), 2)) < 100) {
                ws.network.sendInput({left: 0})
            } else {
                ws.network.sendInput({left: 1})
            }
            if (ws.myPlayer.position.x-mousePos.x > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-mousePos.y), 2) + Math.pow((ws.myPlayer.position.x-mousePos.x), 2)) < 100) {
                ws.network.sendInput({right: 0})
            } else {
                ws.network.sendInput({right: 1})
            }
        };
        if (ws.autoaim) {
            if (ws.playerTick) {
                ws.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-ws.myPlayer.position.x + ws.playerTick.position.x)*100, (-ws.myPlayer.position.y + ws.playerTick.position.y)*100)})
            }
        }
        if (window.shouldStartScript) {
            if (getbosswaves() && getIsZombiesActive() && game.ui.playerPartyMembers.length !== 1) {
                if (inull) {
                    inull = false;
                    document.getElementsByClassName("1i5")[0].click();
                    ws.network.sendRpc({name: "LeaveParty"});
                    setTimeout(() => { inull = true; }, 250);
                }
            }
            if (ws.dayTicker < -18 && ws.dayTicker >= -23 && !ws.isDay && getIsZombiesActive() && game.ui.playerPartyMembers.length !== 1) {
                if (i1) {
                    i1 = false;
                    document.getElementsByClassName("1i5")[0].click();
                    ws.network.sendRpc({name: "LeaveParty"});
                    setTimeout(() => { i1 = true; }, 250);
                }
            }
            if (!getIsZombiesActive() && game.ui.playerPartyMembers.length !== 4 && !getactiveCommingbosswaves()) {
                if (i2) {
                    i2 = false;
                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: Game.currentGame.ui.getPlayerPartyShareKey() + ""});
                    setTimeout(() => { i2 = true; }, 250);
                }
            }
            if (ws.dayTicker > 18 && ws.dayTicker <= 23 && getIsZombiesActive() && ws.isDay && game.ui.playerPartyMembers.length !== 4) {
                if (i3) {
                    i3 = false;
                    document.getElementsByClassName("1i5")[0].click();
                    ws.network.sendRpc({name: "LeaveParty"});
                    setTimeout(() => { i3 = true; }, 250)
                }
            }
        }
        if (heal) {
            if (ws.myPlayer) {
                let playerHealth = (ws.myPlayer.health/ws.myPlayer.maxHealth) * 100;
                if (playerHealth <= 70) {
                    ws.network.sendRpc({name: "BuyItem", itemName: "HealthPotion", tier: 1})
                    ws.network.sendRpc({name: "EquipItem", itemName: "HealthPotion", tier: 1})
                }
            }
            if (ws.myPet) {
                let petHealth = (ws.myPet.health/ws.myPet.maxHealth) * 100;
                if (petHealth <= 70) {
                    if (!ws.shouldHealPet) {
                        ws.shouldHealPet = true;
                        setTimeout(() => {ws.shouldHealPet = false;}, 300)
                        ws.network.sendRpc({name: "BuyItem", itemName: "PetHealthPotion", tier: 1})
                        ws.network.sendRpc({name: "EquipItem", itemName: "PetHealthPotion", tier: 1})
                    }
                }
            }
        }
        if (ws.activebow) {
            ws.network.sendInput({space: 0})
            ws.network.sendInput({space: 1})
        }
        switch(ws.data.opcode) {
            case 4:
                ws.onEnterWorld(ws.data);
                break;
        }
    }
}
 
window.sendAitoAlt = () => {
    if (window.startaito) {
        let ws = new WebSocket(`ws://${Game.currentGame.options.servers[Game.currentGame.options.serverId].hostname}:8000`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => {
            ws.isclosed = true;
        }
        ws.onopen = () => {
            ws.network = new Game.currentGame.networkType();
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
        }
        ws.onEnterWorld = () => {
            // useless
        }
        ws.onmessage = msg => {
            ws.data = ws.network.codec.decode(msg.data);
            if(ws.data.opcode === 5) {
                ws.network.sendPacket(4, { displayName: localStorage.name, extra: ws.data.extra });
            };
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            }
            if (ws.data.name) {
                ws.dataType = ws.data;
            }
            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;
                ws.close();
            }
            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                    window.sendAitoAlt();
                }
            }
            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
                if (ws.isDay) {
                    ws.verified = true;
                }
            }
            if (ws.data.name == "Dead") {
                ws.network.sendInput({
                    respawn: 1
                });
            }
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
                    }
                }
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            }
            switch (ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
        }
    }
}
 
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!aito" && e.uid == game.world.myUid) {
        window.startaito = !window.startaito;
        window.sendAitoAlt();
    }
})
var LKeyWithTimeouts = function() {
    window.FKey = !window.FKey;
    cloneTimeout = false;
    window.playerIds = {
        id1: allSockets[window.socketId1 - 1],
        id2: allSockets[window.socketId2 - 1]
    }
    if (window.FKey) {
        game.network.sendRpc({name: "KickParty", uid: window.playerIds.id1.uid})
        game.network.sendRpc({name: "KickParty", uid: window.playerIds.id2.uid})
        window.FKeyOn = setInterval(() => {
            cloneTimeout = true;
            window.playerIds.id2.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: window.playerIds.id1.psk.response.partyShareKey});
            setTimeout(() => {
                window.playerIds.id1.network.sendRpc({name: "KickParty", uid: window.playerIds.id2.uid});
                setTimeout(() => {
                    window.playerIds.id2.network.sendRpc({name: "KickParty", uid: game.world.myUid});
                }, 7400);
            }, 350);
        }, 15500);
    } else {
        clearInterval(window.FKeyOn);
        window.FKeyOn = null;
    }
}
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if (e.message == "!L" && e.uid == game.world.myUid) {
        LKeyWithTimeouts()
    }
})
var getIsZombiesActive = function () {
    let isZombiesActive = false;
    for (let i in game.world.entities) {
        if (game.world.entities[i].fromTick.model !== "NeutralTier1") {
            if (game.world.entities[i].fromTick.entityClass == "Npc") {
                isZombiesActive = true;
            }
        }
    }
    return isZombiesActive;
};
 
var getactiveCommingbosswaves = function () {
    let activeCommingbosswave = false;
    let aftercommingbosswaves = [48, 56, 64, 72, 80, 88, 96, 104, 120];
    for (let i = 0; i < aftercommingbosswaves.length; i++) {
        if (game.ui.playerTick.wave == aftercommingbosswaves[i]) {
            activeCommingbosswave = true;
        }
    }
    return activeCommingbosswave;
};
 
var getbosswaves = function () {
    let activebosswave = false;
    let allbosswaves = [9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 121];
    for (let i = 0; i < allbosswaves.length; i++) {
        if (game.ui.playerTick.wave == allbosswaves[i]) {
            activebosswave = true;
        }
    }
    return activebosswave;
};
 
let server = -1;
for (let i in game.options.servers) {
    server += 1;
    document.getElementsByClassName("hud-intro-server")[0][server].innerHTML = game.options.servers[i].name + ", Players: [" + Math.round(game.options.servers[i].population/3.125) + "/32]";
}
 
var inull = true;
var i1 = true;
var i2 = true;
var i3 = true;
 
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
            case "KeyU":
                document.getElementsByClassName("13i")[0].click();
                break;
            case "KeyR":
                healPlayer();
                break;
            case "Delete":
                document.getElementsByClassName("7i")[0].click();
                break;
        }
    }
    if (Main2Keys) {
        switch (e.code) {
            case "KeyK":
                document.getElementsByClassName("10i5")[0].click();
                break;
            case "KeyN":
                document.getElementsByClassName("6i5")[0].click();
                break;
            case "Minus":
                game.ui.components.PlacementOverlay.startPlacing("GoldStash");
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
            case "Backslash":
                LKeyWithTimeouts();
                break;
            case "BracketLeft":
                game.network.sendRpc({name: "LeaveParty"})
                break;
        }
    }
});
// ==UserScript==
// @name         background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes the ZOMBS.io ui look better!
// @author       tw | tw@1039
// @match        zombs.io
// @grant        none
// ==/UserScript==
// addEventListener('load', function(e){
 
// })
 
// $("body")
// .css('cursor', 'url(https://ani.cursors-4u.net/cursors/cur-13/cur1163.png), default');
// ==UserScript==
// @name         background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A background for the ZoGUI menus, and some other stuff.
// @author       :)
// @match        http://zombs.io/
// @grant        none
// ==/UserScript==
var css;
var style;
if (localStorage.loadReminder == undefined) {
    localStorage.loadReminder = true;
    alert(
        'enjoy my hack :)'
    )
} else if (Math.floor(Math.random() * 3) === 2) {
    alert(
        'enjoy my hack :)'
    )
}
 
setTimeout(() => {
 
    document.querySelector("#hud-intro > div.hud-intro-wrapper > h2")
        .innerHTML = ":)"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > h1 > small")
        .remove()
    document.querySelector("#hud-intro > div.hud-intro-wrapper > h1")
        .innerHTML = "🔮★シ𝔐𝙤໓✔🔮<small>.</small>"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > h1")
        .style.color = "rgba(128, 0, 128, 0.75)"
    css =
        '.hud-intro::after { background: url(\'https://cutewallpaper.org/21/wallpaper-gif-1920x1080/Gif-Background-Space-1920x1080-Backgrounds-For-Html-Gif-.gif\'); background-size: cover; }';
    style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    css =
        '.hud-intro-footer { background: url(\'https://cutewallpaper.org/21/wallpaper-gif-1920x1080/Gif-Background-Space-1920x1080-Backgrounds-For-Html-Gif-.gif\'); background-size: cover; }';
    style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
 
    document.querySelector("#hud-intro > div.hud-intro-corner-bottom-right > div")
        .remove()
    document.querySelector("#hud-intro > div.hud-intro-corner-top-left > div > a")
        .remove()
    document.querySelector("#hud-intro > div.hud-intro-corner-top-left > div > h3")
        .innerText = "by :)"
    document.querySelector("#hud-intro > div.hud-intro-corner-top-right > div")
        .style.opacity = "0.55"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > input")
        .style.backgroundColor = "rgba(255, 255, 255, 0.80)"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select")
        .style.backgroundColor = "rgba(255, 255, 255, 0.80)"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > input")
        .style.border = "2px solid grey"
    document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select")
        .style.border = "2px solid grey"
}, 100)
 
let serverCapacity;
let capacity = new XMLHttpRequest();
capacity.open("GET", "http://zombs.io/capacity", true);
capacity.onreadystatechange = () => {
    if(capacity.readyState === 4) {
        if(capacity.status === 200) {
            serverCapacity = JSON.parse(capacity.responseText);
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(1)").label = `US East [${serverCapacity.regions["US East"].players} / ${serverCapacity.regions["US East"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(2)").label = `US West [${serverCapacity.regions["US West"].players} / ${serverCapacity.regions["US West"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(3)").label = `Europe [${serverCapacity.regions["Europe"].players} / ${serverCapacity.regions["Europe"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(4)").label = `Asia [${serverCapacity.regions["Asia"].players} / ${serverCapacity.regions["Asia"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(5)").label = `Australia [${serverCapacity.regions["Australia"].players} / ${serverCapacity.regions["Australia"].capacity}]`;
            document.querySelector("#hud-intro > div.hud-intro-wrapper > div.hud-intro-main > div.hud-intro-form > select > optgroup:nth-child(6)").label = `South America [${serverCapacity.regions["South America"].players} / ${serverCapacity.regions["South America"].capacity}]`;
        };
    };
};
capacity.send();
 
const lololololol = `ッ hax`
 
let mapTimeouts = [];
 
function createCoordinates() {
    let x = document.createElement('div')
    x.innerHTML = `<p id="coords" style="color:black;"X: 0, Y: 0</p>
`
    x.style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-left").append(x)
}
let mapMouseX;
let mapMouseY;
let hasBeenInWorld = false;
const uAgent = navigator.userAgent;
const isChromeOS = uAgent.includes('CrOS');
const isMac = uAgent.includes('Macintosh');
const isWindows = uAgent.includes('Windows');
 
function blurText(path) {
    document.querySelector(path)
        .style.color = "transparent";
    document.querySelector(path)
        .style.textShadow = "0 0 5px rgba(0,0,0,0.5)";
}
 
function focusText(path, originalColor) {
    document.querySelector(path)
        .style.color = originalColor;
    document.querySelector(path)
        .style.textShadow = "none";
}
setInterval(() => {
    try {
        if (window.isInMenu) {
            blurText('#scorelog')
            blurCanvas()
        } else {
            focusText('#scorelog', 'black')
            focusCanvas()
        }
    } catch (err) {
        // console.log('Cannot blur or focus canvas. This is most likely because the score logger has not been loaded yet. Error: ' + err);
    }
    _isInChatbox = document.querySelector('.hud-chat')
        .classList.contains('is-focused')
    if (botMode) {
        if (parseInt((getEntitiesByModel('Tree')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Tree @ Angle (in radians): " + getNearestTreeAngle()
            })
            danceRandom = false;
        } else {
            danceRandom = true;
        }
        if (parseInt((getEntitiesByModel('Stone')[0][1].targetTick.position.x - game.world.getEntityByUid(game.world.getMyUid())
                      .targetTick.position.x)
                     .toString()
                     .replaceAll('-', '')) < 250) {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: "Stone @ Angle (in radians): " + getNearestStoneAngle()
            })
        }
    }
}, 2.5)
 
function blurCanvas() {
    document.querySelector('canvas')
        .style.filter = "blur(8px)";
}
 
function focusCanvas() {
    document.querySelector('canvas')
        .style.filter = "none";
}
const version = "2.4.6";
 
const authors = ":)";
 
document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
console.log('%ceHaxx', 'color: green; background: yellow; font-size: 30px');
game.network.addEnterWorldHandler(function () {
    setTimeout(() => {
        game.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: "ッ hax v" + version + " (âœ“) made by " + authors
        })
    }, 500)
 
 
    document.querySelector("#hud > div.hud-bottom-center").style.textAlign = "center"
    document.querySelector("#hud > div.hud-bottom-center").style.color = "rgba(192, 192, 192, 0.75)"
    document.querySelector("#hud > div.hud-bottom-center").style.fontSize = "30px"
    setInterval(() => {
        document.querySelector("#hud > div.hud-top-right")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud > div.hud-top-right")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-spell-icons")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-menu-icons")
            .style.border = "5px solid rgba(0, 0, 0, 0.30)";
        document.querySelector("#hud-menu-icons")
            .childNodes.forEach((item) => (item.innerHTML = ""));
        document.querySelectorAll(".hud-toolbar-building")
            .forEach((item) => {
            (item.style.border = "5px solid rgba(0, 0, 0, 0.30)"), (item.style.babsdsd = "25%");
        });
        document.querySelector("#hud-debug")
            .style.color = "grey";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(1)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(2)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(3)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(4)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.45)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(6)")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(1)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(2)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(3)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(4)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(5)")
            .style.border = "3px solid lightBlue";
        document.querySelector("#hud-toolbar > div.hud-toolbar-inventory > a:nth-child(6)")
            .style.border = "3px solid lightBlue";
        if (isChromeOS) {
            document.querySelector("#hud-menu-icons")
                .style.marginBottom = "120px";
        }
        document.querySelector("#hud-map")
            .style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.querySelector("#hud-map")
            .style.border = "5px solid rgba(0, 0, 0, 0.40)";
    }, 250);
    setTimeout(() => {
        if (!hasBeenInWorld) {
            var scoreLogged = 0;
            if(!hasBeenInWorld) {
                hasBeenInWorld = true
                setInterval(() => {
                    document.querySelector('#scorelog')
                        .innerText = `Score in Last Wave: ${scoreLogged}`
                    document.querySelector("#coords")
                        .innerText = `X: ${game.world.localPlayer.entity.targetTick.position.x}, Y: ${game.world.localPlayer.entity.targetTick.position.y}`
                }, 100)
                createCoordinates()
            }
            hasBeenInWorld = true;
            document.querySelector("#hud > div.hud-bottom-center").append('ッ hax ')
            var oldScore = Game.currentGame.ui.playerTick.score,
                newScore = 0;
            Game.currentGame.network.addRpcHandler("DayCycle", () => {
                newScore = Game.currentGame.ui.playerTick.score;
                scoreLogged = ((newScore - oldScore)
                               .toLocaleString("en"));
                oldScore = Game.currentGame.ui.playerTick.score;
            });
            const topCenter = document.querySelector("#hud > div.hud-top-center");
            let logElem;
            logElem = document.createElement('div');
            logElem.innerHTML = `<h1 id="scorelog" style="color:white;">Score in Last Wave: 0</h1>`;
            topCenter.append(logElem);
        }
    }, 500)
 
})
let dimension = 1;
 
const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}
 
onWindowResize();
 
window.onresize = onWindowResize;
 
window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension = Math.min(1.35, dimension + 0.01);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.1, dimension - 0.01);
        onWindowResize();
    }
}
addEventListener('keydown', function (e) {
    if (!_isInChatbox && e.key == "/") {
        document.querySelector("#hud-menu-settings")
            .style.display = document.querySelector("#hud-menu-settings")
            .style.display == "none" ? "block" : "none"
        document.querySelector("#hud-menu-shop")
            .style.display = "none"
        document.querySelector("#hud-menu-party")
            .style.display = "none"
    }
    if (!_isInChatbox && e.key == "]") {
        Game.currentGame.network.sendRpc({
            name: "BuyItem",
            itemName: "Crossbow",
            tier: 1
        });
        Game.currentGame.network.sendRpc({
            name: "EquipItem",
            itemName: "Crossbow",
            tier: 1
        });
    }
addEventListener('keydown', function(e){
    if(e.key == "]"){
Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1});
Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1});
console.log('invisable')
    }
})
    if (e.key == "u" && !_isInChatbox) {
        transparentMenu = !transparentMenu
        console.log('done')
    } else if (e.key == "=" && !_isInChatbox) {
        game.ui.getComponent("PopupOverlay").showHint(
            'Press ] for invisible bow,press = for instructions,R for heal spam.There is a button under timeout is hacks.',
            1.5e4
        )
    }
})
var changeChat = true;
var hoverOver;
var mousemove;
addEventListener('mousemove', (e) => {
    mousemove = e;
})
 
function roundTenThousands(x) {
    if (x > 10000) {
        return x.toString()
            .slice(0, 3) + "00"
    } else {
        return x.toString()
    }
}
 
function roundMyPosition(e) {
    return {
        x: roundTenThousands(e.getPositionX()),
        y: roundTenThousands(e.getPositionY())
    }
}
 
var mouseOverInterval = setInterval(() => {
	if (game.world.inWorld) {
		Object.entries(game.world.entities)
			.forEach((item => {
				if (roundMyPosition(item[1])
					.x == parseInt(roundTenThousands(game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY)
						.x)) && roundMyPosition(item[1])
					.y == parseInt(roundTenThousands(game.renderer.screenToWorld(mousemove.clientX, mousemove.clientY)
						.y))) {
					hoverOver = 'Hovering over entity: ' + JSON.stringify(item[1].targetTick)
				} else {
					hoverOver = 'Hovering over no entities.'
				}
			}))
		document.querySelector('#hoverOver')
			.innerText = hoverOver;
	}
}, 100)
 
var isSpamming = 0;
 
function pauseChatSpam(e) {
    if (!isSpamming) {
        if (e == "") {
            //:) hax
            e = lololololol
        }
        window.spammer = setInterval(() => {
            game.network.sendRpc({
                name: "SendChatMessage",
                channel: "Local",
                message: e
            })
        }, 100)
    } else if (isSpamming) {
        clearInterval(window.spammer)
    }
    isSpamming = !isSpamming
}
window.rainbowwww = false;
 
function degreesToYaw(deg) {
    let ans;
    if ((deg - 90) < 90) {
        ans = deg - 90
    } else if (deg == 90) {
        ans = deg + 90
    } else if (deg > 90) {
        ans = deg + 90
    }
    if (ans < 0) {
        ans = Math.abs(ans)
    }
}
if (localStorage.timesEhacked == undefined) {
    localStorage.timesEhacked = 1;
} else {
    localStorage.timesEhacked++;
}
document.title = "ッ hax | Times Played: " + localStorage.timesEhacked
var autoRespawn = false
let hue = 10
var settingsRainbow = document.querySelector("#hud-menu-settings")
 
function changeHue() {
    if (window.rainbowwww) {
        hue -= 20
    }
}
 
function getEntitiesByModel(type) {
    let entities = []
    Object.entries(game.world.entities)
        .forEach((item => {
        if (item[1].targetTick.model == type) {
            entities.push(item)
        }
    }))
    return entities;
}
 
function moveUp() {
    game.inputPacketScheduler.scheduleInput({
        down: 0,
        up: 1
    })
}
 
function moveDown() {
    game.inputPacketScheduler.scheduleInput({
        up: 0,
        down: 1
    })
}
 
function moveLeft() {
    game.inputPacketScheduler.scheduleInput({
        right: 0,
        left: 1
    })
}
 
function moveRight() {
    game.inputPacketScheduler.scheduleInput({
        left: 0,
        right: 1
    })
}
var danceCounter = 0
var danceRandom = true
var botMode = false
var danceInterval = setInterval(() => {
    if (botMode) {
        if (danceCounter < moves.length) {
            moves[danceCounter]()
            if (danceRandom) {
                danceCounter = Math.floor(Math.random() * moves.length)
            } else {
                danceCounter++
            }
        } else {
            danceCounter = 0;
        }
    }
}, 500)
var respawnInterval = setInterval(() => {
    if (document.querySelector('.hud-respawn')
        .style.display == "block" && autoRespawn) {
        game.inputPacketScheduler.scheduleInput({
            respawn: 1
        })
        document.querySelector('.hud-respawn')
            .style.display = "none"
    }
}, 10)
var moves = [moveUp, moveRight, moveDown, moveLeft]
 
function getNearestStoneAngle() {
    let stoneEntities = getEntitiesByModel('Stone');
    let firstStone = stoneEntities[0][1].targetTick;
    let player = game.world.localPlayer.entity.targetTick
 
    return Math.atan2(player.position.y - firstStone.position.y / 2,
                      player.position.x - firstStone.position.x)
}
 
function getNearestTreeAngle() {
    return Math.atan2(game.world.entities[game.world.getMyUid()].targetTick.position.y - getEntitiesByModel('Tree')[0][1].targetTick.position.y / 2, game.world
                      .entities[game.world.getMyUid()].targetTick.position.x - getEntitiesByModel('Tree')[0][1].targetTick.position.x)
}
 
function scanServer() {
    var current = []
    Object.entries(game.ui.getComponent('Leaderboard')
                   .playerNames)
        .forEach((item => {
        current.push(item)
    }))
    return JSON.stringify(current)
}
var leaveChats = ['POP', 'BING', 'TONG', 'RIIING', 'POOF']
 
function leaveChat() {
    let counter = 0;
    window.leaveChatInterval = setInterval(() => {
        if (counter < leaveChats.length) {
            doNewSend(['ch', [leaveChats[counter]]]);
            counter++;
        } else {
            counter = 0;
            clearInterval(window.leaveChatInterval);
            Game.currentGame.network.disconnect();
        };
    }, 1500);
};
window.startaito = false;
window.useSamePI = false
addEventListener('keyup', function (e) {
    if (e.key == "`" && !_isInChatbox) {
        game.inputManager.onKeyRelease({
            keyCode: 117
        })
    }
}) // debug info
var bw1 = "ðŸ˜ˆ Boss Waves [1/2]: 9, 17, 25, 33, 41, 49, 57, 65, 73, 81 ðŸ˜ˆ"
var bw2 = "ðŸ˜ˆ Boss Waves [2/2]: 89, 97, 105, 121 ðŸ˜ˆ"
window.ajsd = Math.random()
    .toString()
    .slice(0, 6)
console.log(window.ajsd)
var users = [
    {
        "name": "â˜¬ ð‘’ð’½ âœ¨ ãƒ„ âœ“",
        "roles": ['Owner', 'Admin']
    }
 
 
 
 
 
 
    , {
        "name": "u7ðŸ¤—ãƒ„âœ”",
        "roles": ['Co-Owner', 'Admin']
    }
 
 
 
 
 
 
    , {
        "name": "â˜¢â‚¦É„â‚µâ± É†â‚³â±¤â˜£âœ”",
        "roles": ['Co-Owner', 'Admin']
    }
 
 
 
 
 
 
    , {
        "name": "â¦•NRâ¦–â˜¬ð‘’ð’½âœ¨ãƒ„âœ“",
        "roles": ['Owner', 'Admin']
    }
 
 
 
 
 
 
    , {
        "name": "Potato Bot",
        "roles": ['Admin', 'Leaker']
    }
 
 
 
 
 
 
    , {
        "name": "â¦•NRâ¦– F3AR ãƒ„",
        "roles": ['Admin', 'Official']
    }
 
 
 
 
 
 
    , {
        "name": "Yazeet",
        "roles": ['Stealer']
    }
]
var q = [
    {
        word: "is",
        answers: ['Naw', 'Yup.'],
        random: true
    }
 
 
 
 
 
 
    , {
        word: "will",
        answers: ['Outlook good.', 'Perhaps.', 'Yup.', 'Naw'],
        random: true
    }
 
 
 
 
 
 
    , {
        word: "when",
        answers: ['Soon.', 'Never.'],
        random: true
    }
 
 
 
 
 
 
    , {
        word: "are",
        answers: ['Yup.', 'Naw', 'Perhaps.'],
        random: true
    }]
let ppInterval = setInterval(() => { // show private parties
    if (document.querySelector('#showpp')
        .checked) {
        document.querySelectorAll('.hud-party-link')
            .forEach((elem => {
            if (elem.style.display == "none") {
                elem.style.display = "block"
                elem.childNodes[0].innerText = elem.childNodes[0].innerText + "[PRIVATE]"
                elem.addEventListener('click', function () {
                    game.ui.getComponent('PopupOverlay')
                        .showHint('Cannot join this party as it is private', 1e4)
                })
            }
        }))
    }
}, 3000) // show private parties
 
window.lpSave = []
 
const altSpace = "â€€" // alternate space character
 
String.prototype.multiChatSpaces = function () {
    return this.replaceAll(' ', altSpace)
}
var chatAnims = {
    makeRect: [
        "________________________"
 
 
 
 
 
 
        , "| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |"
 
 
 
 
 
 
        , "________________________"
    ],
    makeCircle: [
        "   â•±â€¾â€¾â€¾â€¾â€¾â•²"
 
 
 
 
 
 
        , "  /         \\"
 
 
 
 
 
 
        , " |            |"
 
 
 
 
 
 
        , "  \\          /"
 
 
 
 
 
 
        , "   â•²_____â•±"
    ]
} // :D
window.use_di = true;
window.isInMenu = false;
 
function doorWall() {
    var stashPosition = getGoldStash()
    PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 180);
    PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + -96, stashPosition.y + -288, 'GoldMine', 180);
    PlaceBuilding(stashPosition.x + -24, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -72, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -120, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -168, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -216, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -264, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -312, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -360, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -408, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -456, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -504, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -552, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 24, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 72, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 120, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 168, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 216, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 264, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -600, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -648, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -696, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -744, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -792, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -792, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -744, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -696, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -648, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -600, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -552, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -504, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -456, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -408, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -360, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -312, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -264, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -216, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -168, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -120, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -72, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + -24, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 24, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 72, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 120, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 168, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 216, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 264, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 312, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 360, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 408, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 456, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 504, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 552, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 600, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 648, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 696, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 744, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 792, 'Door', 180);
    PlaceBuilding(stashPosition.x + -840, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -792, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -744, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -696, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -648, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -600, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -552, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -504, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -456, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -408, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -360, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -216, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -168, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -72, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 24, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -312, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -264, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -120, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + -24, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 72, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 120, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 168, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 216, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 264, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 312, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 360, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 456, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 408, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 504, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 552, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 600, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 648, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 696, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 744, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 792, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 792, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 744, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 696, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 648, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 600, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 552, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 504, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 456, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 408, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 360, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 312, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 264, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 216, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 168, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 120, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 72, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + 24, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -24, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -72, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -168, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -264, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -312, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -360, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -408, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -456, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -504, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -552, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -600, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -648, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -216, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -120, 'Door', 180);
    PlaceBuilding(stashPosition.x + 312, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 360, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 408, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 456, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 504, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 552, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 600, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 648, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 696, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 744, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 792, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -840, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -792, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -744, 'Door', 180);
    PlaceBuilding(stashPosition.x + 840, stashPosition.y + -696, 'Door', 180);
}
var animChat = {
    makeRect: function () {
        let counter = 0;
        let rectInterval = setInterval(() => {
            if (counter < chatAnims.makeRect.length) {
                doNewSend(['ch', [chatAnims.makeRect[counter].multiChatSpaces()]])
                counter++
            } else {
                counter = 0
                clearInterval(rectInterval)
            }
        }, 3000)
        },
    makeCircle: function () {
        let counter = 0;
        let circleInterval = setInterval(() => {
            if (counter < chatAnims.makeCircle.length) {
                doNewSend(['ch', [chatAnims.makeCircle[counter].multiChatSpaces()]])
                counter++
            } else {
                counter = 0
                clearInterval(circleInterval)
            }
        }, 3000)
        }
}
 
function btnChatCircle() {
    animChat.makeCircle()
}
 
function btnChatRect() {
    animChat.makeRect()
}
 
function upgradeall() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "UpgradeBuilding",
            uid: obj.fromTick.uid
        })
    }
    doNewSend(['ch', ['â™¦ï¸ Upgraded All! â™¦ï¸']])
}
 
function movePlayer(e) {
    if (!_isInChatbox) {
        switch (e.toLowerCase()
                .replaceAll(' ', '')) {
            case "a":
                Game.currentGame.network.sendInput({
                    left: 1
                })
                break;
            case "d":
                Game.currentGame.network.sendInput({
                    right: 1
                })
                break;
            case "w":
                Game.currentGame.network.sendInput({
                    up: 1
                })
                break;
            case "s":
                Game.currentGame.network.sendInput({
                    down: 1
                })
                break;
        }
    }
}
var emojis = [
    {
        text: ":happy:",
        char: "ðŸ˜„"
    }
 
 
 
 
 
 
    , {
        text: ":sad:",
        char: "ðŸ˜¥"
    }
 
 
 
 
 
 
    , {
        text: ":angry:",
        char: "ðŸ˜ "
    }
 
 
 
 
 
 
    , {
        text: ":laughing:",
        char: "ðŸ˜‚"
    }
 
 
 
 
 
 
    , {
        text: ":stop:",
        char: "ðŸ›‘"
    }
 
 
 
 
 
 
    , {
        text: ":revenge:",
        char: "ðŸ˜ˆ"
    }
 
 
 
 
 
 
    , {
        text: ":smiley:",
        char: "ãƒ…"
    }
 
 
 
 
 
 
    , {
        text: ":pog:",
        char: "ÌŠ<ÌŠ"
    }]
 
function Heal() {
    Game.currentGame.network.sendRpc({
        "name": "BuyItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "EquipItem",
        "itemName": "HealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "BuyItem",
        "itemName": "PetHealthPotion",
        "tier": 1
    })
    Game.currentGame.network.sendRpc({
        "name": "EquipItem",
        "itemName": "PetHealthPotion",
        "tier": 1
    })
}
 
function getGoldStash() {
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
 
function PlaceBuilding(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}
var isBowing = false;
var slotChars = [
    {
        char: "7ï¸âƒ£",
        value: 33
    }
 
 
 
 
 
 
    , {
        char: "ðŸŽ",
        value: 10
    }
 
 
 
 
 
 
    , {
        char: "ðŸ”",
        value: 25
    }
 
 
 
 
 
 
    , {
        char: "ðŸ¥“",
        value: 15
    }
 
 
 
 
 
 
    , {
        char: "âš½",
        value: 12
    }
 
 
 
 
 
 
    , {
        char: "ðŸ¾",
        value: 10
    }
 
 
 
 
 
 
    , {
        char: "1ï¸âƒ£",
        value: 27
    }
 
 
 
 
 
 
    , {
        char: "ðŸ’¡",
        value: 30
    }]
console.log(slotChars)
window.generateSlots = function () { // fp is the returned array, fs is the joined | fp string, pp is the score
    let fp = [];
    let fs = "";
    let pp = 0;
    var f1 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f1.char)
    pp += f1.value
    var f2 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f2.char)
    pp += f2.value
    var f3 = slotChars[Math.floor(Math.random() * slotChars.length)]
    fp.push(f3.char)
    pp += f3.value
    fs = [fp.join('|'), pp + " / 99"]
    return fs;
}
 
function ahrc1() { // 1 ahrc (collect and refuel), used in lpinterval
    var entities = Game.currentGame.world.entities
    for (let uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        let obj = entities[uid];
        Game.currentGame.network.sendRpc({
            name: "CollectHarvester",
            uid: obj.fromTick.uid
        });
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.07
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.11
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.17
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.22
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.25
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.28
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.42
            });
        }
        if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
            Game.currentGame.network.sendRpc({
                name: "AddDepositToHarvester",
                uid: obj.fromTick.uid,
                deposit: 0.65
            });
        }
    }
}
var lpinterval = setInterval(function () { // loaded player info, ahrc, isInMenu, noob = chatbot
    document.querySelector('#lpi')
        .innerText = "Loaded Player Info: " + JSON.stringify(window.loadedIDS())
    if (window.ahrc) {
        ahrc1()
    }
    window.isInMenu = document.querySelector('#hud-menu-settings')
        .style.display == "block" ? true : false
    if ((window.lpSave[window.lpSave.length - 1] !== loadedPlayers()[loadedPlayers()
                                                                     .length - 1]) && document.querySelector('#noobchat')
        .checked) {
        doNewSend(['ch', ['NOOB = ' + loadedPlayers()[Math.floor(Math.random() * loadedPlayers()
                                                                 .length)]]])
        window.lpSave = loadedPlayers()
    }
    document.querySelector("#hud-menu-party > div.hud-party-grid > div.hud-party-joining")
        .style.display = "none"
}, 250)
// enable/disable chat
// ðŸŸ© ðŸŸ¥
function enDisAbleEmj(bool, txt) {
    return bool ? "ðŸŸ© " + txt + " Enabled ðŸŸ©" : "ðŸŸ¥ " + txt + " Disabled ðŸŸ¥"
}
// disable enable in chat
window.cmdsEnabled = true
// these are all button event listeners --->
function toggleCmds() {
    window.cmdsEnabled = !window.cmdsEnabled
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(window.cmdsEnabled, "Commands")]])
    }
    document.querySelector('#togglecmd')
        .innerText = window.cmdsEnabled ? "Disable Commands" : "Enable Commands"
}
 
function sellAll() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model !== "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold All ðŸ’°']])
}
 
function sellWalls() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Wall") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Walls ðŸ’°']])
}
 
function sellBombTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "BombTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Bomb Towers ðŸ’°']])
}
 
function sellGoldMines() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "GoldMine") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Gold Mines ðŸ’°']])
}
 
function sellArrowTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "ArrowTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Arrow Towers ðŸ’°']])
}
 
function sellSlowTraps() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "SlowTrap") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Slow Traps ðŸ’°']])
}
 
function sellCannonTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "CannonTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Cannon Towers ðŸ’°']])
}
 
function sellMageTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MagicTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Mage Towers ðŸ’°']])
}
 
function sellMeleeTowers() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "MeleeTower") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Melee Towers ðŸ’°']])
}
 
function sellHarvesters() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Harvester") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Harvesters ðŸ’°']])
}
 
function sellDoors() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;
        var obj = entities[uid];
        if (obj.fromTick.model == "Door") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            });
        }
    }
    doNewSend(['ch', ['ðŸ’° Sold Doors ðŸ’°']])
}
// <--- end of button event listeners
//
document.querySelector('.hud-chat-input')
    .addEventListener('keypress', function (e) {
    emojis.forEach((item => {
        this.value = this.value.replaceAll(item.text, item.char)
    }))
    if (e.keyCode == 13) { // exclude commands and html entities
        this.value = this.value.replaceAll('fuck', 'fucâ€Œk')
            .replaceAll('FUCK', 'FUCâ€ŒK')
            .replaceAll('shit', 'shiâ€Œt')
            .replaceAll('SHIT', 'SHIâ€ŒT')
            .replaceAll('bitch', 'bitâ€Œch')
            .replaceAll('BITCH', 'BITâ€ŒCH')
            .replaceAll('ass', 'asâ€Œs')
            .replaceAll('ASS', 'ASâ€ŒS')
            .replaceAll('dick', 'dicâ€Œk')
            .replaceAll('DICK', "DICâ€ŒK")
            .slice(0, 63) // anti censor C:
        if (this.value.toLowerCase()
            .includes('nigg') || this.value.toLowerCase()
            .includes('niga') || this.value.toLowerCase()
            .includes('nig ') || this.value.toLowerCase()
            .includes('nige')) {
            this.value = "I am a building, don't be racist"
        }
    }
})
var insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana"
 
 
 
 
 
               , "you're orange juice toothpaste flavored"] // just an array of insults
// menu stuff (defining & appending) --->
var settingsHTML = `
<h3>ð“®ð“—ð“ªð”ð”</h3>
<hr>
<input type="text" id="spamchat" placeholder="Message" class="menu-textbox">
<br>
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="spamchatbtn">Split Chat</button>
<br>
<input type="text" id="spmchinput" placeholder="Message" class="menu-textbox">
<br>
<button class="btn btn-purple ehack-btn" style="border-radius:25%" id="togglespmch">Enable Chat Spam</button>
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="clearchatbtn">Clear Chat</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="upgradeallbtn">Upgrade All</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="mainxaito">Enable Aito</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="walldoor">Wall of Doors</button>
<hr>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn33">Chat Leave Sounds</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn22">Chat Rectangle</button>
<button class="btn btn-blue ehack-btn" style="border-radius:25%" id="idkbtn11">Chat Circle</button>
<hr>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="resetinsultsbtn">Reset Insults</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="togglecmd">Disable Commands</button>
<button class="btn btn-red ehack-btn ehack-btn" style="border-radius:25%" id="toggleahrc">Enable AHRC</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleab">Enable AutoBow</button>
<hr>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="togglebot">Enable Bot Mode</button>
<button class="btn btn-red ehack-btn" style="border-radius:25%" id="toggleresp">Enable Auto Respawn</button>
<hr>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellall">Sell All</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellwalls">Sell Walls</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="selldoors">Sell Doors</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="selltraps">Sell Traps</button>
<hr>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmines">Sell Gold Mines</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellarrows">Sell Arrows</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellcannons">Sell Cannons</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmelees">Sell Melees</button>
<hr>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellbombs">Sell Bombs</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellmages">Sell Mages</button>
<button class="btn btn-green ehack-btn" style="border-radius:25%" id="sellharvesters">Sell Harvesters</button>
<hr>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-leaveparty-btn">Leave Party</button>
<br>
<input type="text" class="menu-textbox" id="menu-jpbsk-input" placeholder="Party share key">
<br>
<button class="btn btn-gold ehack-btn" style="border-radius:25%" id="menu-jpbsk-btn" onclick='Game.currentGame.network.sendRpc({name:"JoinPartyByShareKey", partyShareKey: document.querySelector("#menu-jpbsk-input").value})'>Join Party By Share Key</button>
<hr>
<button class="btn btn-white ehack-btn" style="border-radius:25%" onclick="Game.currentGame.network.disconnect()">Disconnect</button>
<hr>
<p style="font-size:10px;">Use default insults?</p><input type="checkbox" id="use-di" checked>
<br>
<p style="font-size:10px;">Show private parties?</p><input type="checkbox" id="showpp" checked>
<br>
<p style="font-size:10px;">Noob chat?</p><input type="checkbox" id="noobchat">
<br>
<p style="font-size:10px;">Advanced Player Info?</p><input type="checkbox" id="advancedlpi">
<br>
<p style="font-size:10px;">Zoom On Scroll?</p><input type="checkbox" id="zos">
<br>
<p style="font-size:10px;">CopyCat?</p><input type="checkbox" id="copycat">
<br>
<p style="font-size:10px;">Death Chat?</p><input type="checkbox" id="deadchat">
<br>
<p style="font-size:10px;">Enable/Disable Chat?</p><input type="checkbox" id="apexmode" checked>
<hr>
<p id="lpi">Loaded Player Info: </p>
<style>
.menu-textbox{
    border-radius:25%;
    background-color: rgba(171, 183, 183, 0.25);
    border: 2px solid black;
    color:white;
}
.ehack-btn:hover{
border: 3px solid grey;
}
</style>
` // aka mod menu
settingsHTML.id = "modmenu"
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;
document.querySelector('#clearchatbtn')
    .addEventListener('click', function () {
    document.querySelector('.hud-chat-messages')
        .innerHTML = ""
    console.clear()
    Game.currentGame.network.sendRpc({
        name: "SendChatMessage",
        channel: "Local",
        message: "âœ¨ Cleared Chat âœ¨"
    })
})
document.querySelector('#sellbombs')
    .addEventListener('click', sellBombTowers)
document.querySelector('#sellarrows')
    .addEventListener('click', sellArrowTowers)
document.querySelector('#sellcannons')
    .addEventListener('click', sellCannonTowers)
document.querySelector('#sellmages')
    .addEventListener('click', sellMageTowers)
document.querySelector('#sellall')
    .addEventListener('click', sellAll)
document.querySelector('#selltraps')
    .addEventListener('click', sellSlowTraps)
document.querySelector('#selldoors')
    .addEventListener('click', sellDoors)
document.querySelector('#sellmines')
    .addEventListener('click', sellGoldMines)
document.querySelector('#sellwalls')
    .addEventListener('click', sellWalls)
document.querySelector('#sellmelees')
    .addEventListener('click', sellMeleeTowers)
document.querySelector('#sellharvesters')
    .addEventListener('click', sellHarvesters)
 
function onLeaveParty() {
    Game.currentGame.network.sendRpc({
        name: "LeaveParty"
    })
}
document.querySelector('#use-di')
    .addEventListener('change', function () {
    var THIS_DI_EVENT = this
    game.ui.getComponent('PopupOverlay')
        .showConfirmation('Are you sure you want to change default insults? This will reset all custom insults', 1e4, function () {
        if (THIS_DI_EVENT.checked) {
            insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana"
 
 
 
 
 
                       , "you're orange juice toothpaste flavored"]
            game.ui.getComponent('PopupOverlay')
                .showHint('Successfully activated default insults.', 1e4)
            window.use_di = true
            if (changeChat) {
                doNewSend(['ch', ['âš™ï¸ Activated Use Default Insults âš™ï¸']])
            }
        } else {
            insults = ["There are no insults, use !addinsult to add one!"]
            game.ui.getComponent('PopupOverlay')
                .showHint('Successfully deactivated default insults.', 1e4)
            window.use_di = false
            if (changeChat) {
                doNewSend(['ch', ['âš™ï¸ Deactivated Use Default Insults âš™ï¸']])
            }
        }
    }, function () {
        game.ui.getComponent('PopupOverlay')
            .showHint('OK!', 1e4)
    })
})
document.querySelector('#menu-leaveparty-btn')
    .addEventListener('click', onLeaveParty)
document.querySelector('#showpp')
    .addEventListener('change', function () {
    var THIS_PP_EVENT = this;
    if (THIS_PP_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated Show Private Parties âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated Show Private Parties âš™ï¸']])
        }
    }
})
document.querySelector('#copycat')
    .addEventListener('change', function () {
    var THIS_CC_EVENT = this;
    if (THIS_CC_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated CopyCat âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated CopyCat âš™ï¸']])
        }
    }
})
document.querySelector('#deadchat')
    .addEventListener('change', function () {
    var THIS_DC_EVENT = this;
    if (THIS_DC_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated Death Chat âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated Death Chat âš™ï¸']])
        }
    }
})
document.querySelector('#noobchat')
    .addEventListener('change', function () {
    var THIS_NC_EVENT = this;
    if (THIS_NC_EVENT.checked) {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Activated Noob Chat âš™ï¸']])
        }
    } else {
        if (changeChat) {
            doNewSend(['ch', ['âš™ï¸ Deactivated Noob Chat âš™ï¸']])
        }
    }
})
// <--- end of menu stuff (defining & appending)
// also event listeners on the menu forgot to add that at start of script
var removeDeleted = function (e) { // remove deleted/empty/undefined/null items in an array
    let fp = []
    for (let i = 0; i < e.length; i++) {
        if (e[i] !== undefined) {
            fp.push(e[i])
        }
    }
    return fp;
}
 
function loadedPlayers() { // loaded player names
    var returns = []
    Object.entries(Game.currentGame.world.entities)
        .forEach((stuff => {
        if (stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame
                                                                                                                               .world.getMyUid()].targetTick.uid) || window.useSamePI)) {
            returns.push(stuff[1].targetTick.name)
        }
    }))
    return returns;
}
window.loadedIDS = function () {
    var returns = []
    Object.entries(Game.currentGame.world.entities)
        .forEach((stuff => {
        if (stuff[1].targetTick.entityClass == "PlayerEntity" && ((stuff[1].targetTick.uid !== Game.currentGame.world.entities[Game.currentGame
                                                                                                                               .world.getMyUid()].targetTick.uid) || window.useSamePI)) {
            var h = stuff[1].targetTick
            if (document.querySelector('#advancedlpi')
                .checked) {
                returns.push(JSON.stringify(h))
            } else {
                returns.push(stuff[1].targetTick.name + " - Wood: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.wood +
                             ", Stone: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.stone + ", Gold: " + Game.currentGame
                             .world.entities[stuff[1].targetTick.uid].targetTick.gold)
            }
        }
    }))
    return returns;
}
 
function spamchatclick() { // used to be called spam chat, its split chat now
    var user = document.querySelector('#spamchat')
    .value
    splitChatLength(user)
}
document.querySelector('#spamchatbtn')
    .addEventListener('click', spamchatclick)
document.querySelector('#resetinsultsbtn')
    .addEventListener('click', resetInsults)
 
function resetInsults() {
    if (window.use_di) {
        insults = ["you smooth brained potato", "you rotten pumpkin brain", "you soggy zuicini", "you watered down banana"
 
 
 
 
 
                   , "you're orange juice toothpaste flavored"]
    } else {
        insults = ["There are no insults, use !addinsult to add one!"]
    }
    doNewSend(['ch', ["âœ… Successfully reset insults âœ…"]])
}
document.querySelector('#togglecmd')
    .addEventListener('click', toggleCmds)
var balls = ["Outlook good.", "Really?", "Perhaps.", "Definitely not.", "Yup.", "Are you retarded?", "Naw", "Yup.", "Yup."]
var breadEaten = 0
var cmdInterval = setInterval(function () {
    if (game.world.isInWorld) {
        if (window.cmdsEnabled) {
            var playerName = Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.name
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 4) == "!ch") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                            .length - 1].innerText.split(':')[1].slice(4)
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 7) == "!bread") {
                breadEaten++;
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸžðŸžðŸž @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                         .length - 1].innerText.split(':')[0] + " has eaten bread! " + breadEaten + " people have eaten bread! ðŸžðŸžðŸž"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 13) == "!willigetagf") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸ’ The chances of you getting a girlfriend are " + Math.floor(Math.random() * 10) + "%! @" + document
                    .querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                           .length - 1].innerText.split(':')[0] + " ðŸ’"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 9) == "!insults") {
                var insultCounteRz = 1;
                var innsultSInterval = setInterval(() => {
                    if (insultCounteRz <= (insults.length)) {
                        doNewSend(['ch', ['ðŸ“– Insults [' + insultCounteRz + "/" + (insults.length) + "]: " + insults[insultCounteRz - 1] +
                                          " ðŸ“–"]])
                        insultCounteRz++;
                    } else {
                        insultCounteRz = 0;
                        clearInterval(innsultSInterval)
                    }
                }, 1500)
                }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1)
                .includes('**')) {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "âŒ Don't fucâ€Œking swear you bitcâ€Œh @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll(
                        '.hud-chat-message')
                                                                                                                    .length - 1].innerText.split(':')[0] + " âŒ"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 7) == "!8ball") {
                q.forEach((item => {
                    if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                       .length - 1].innerText.toLowerCase()
                        .split(':')[1].includes(item.word)) {
                        window.ball = item.answers[Math.floor(Math.random() * item.answers.length)]
                    } else {
                        window.ball = balls[Math.floor(Math.random() * balls.length)]
                    }
                }))
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸŽ± Magic 8Ball answered with " + window.ball + " ðŸŽ±"
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 10) == "!commands") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸ’» Commands [1/3]: !8ball,!ch,!bread,!insult,!addinsult ðŸ’»"
                })
                setTimeout(function () {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "ðŸ’» Commands [2/3]: !willigetagf, !slots, !boss, !insults ðŸ’»"
                    })
                }, 1500)
                setTimeout(function () {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "ðŸ’» Commands [3/3]: none ðŸ’»"
                    })
                }, 3000)
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 6) == "!boss") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: bw1
                })
                setTimeout(function () {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: bw2
                    })
                }, 1500)
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 11) == "!addinsult") {
                if (!insults.includes(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                     .length - 1].innerText.toLowerCase()
                                      .split(':')[1].slice(11))) {
                    if (window.use_di) {
                        insults.push(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                    .length - 1].innerText.toLowerCase()
                                     .split(':')[1].slice(11))
                    } else {
                        insults = []
                        insults.push(document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                    .length - 1].innerText.toLowerCase()
                                     .split(':')[1].slice(11))
                    }
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "ðŸ“ Added to insults ðŸ“"
                    })
                } else {
                    Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: "Local",
                        message: "âŒ That insult already exists âŒ"
                    })
                }
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.toLowerCase()
                .split(':')[1].slice(1, 8) == "!insult" && document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                                          .length - 1].innerText.split(':')[1].slice(1, 9) !== "!insults") {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸ“ " + insults[Math.floor(Math.random() * insults.length)] + " @" + loadedPlayers()[Math.floor(Math.random() *
                                                                                                                             loadedPlayers()
                                                                                                                             .length)] + " ðŸ“"
                })
            }
            if (document.querySelector('#hud-respawn')
                .style.display == "block" && document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                            .length - 1].innerText.split(':')[1] !== (playerName + " thinks that whoever killed them is an idiot!") && document.querySelector(
                '#deadchat')
                .checked) {
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: (playerName + " thinks that whoever killed them is an idiot!")
                })
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].slice(1, 7) == "!slots") {
                var f = window.generateSlots()
                Game.currentGame.network.sendRpc({
                    name: "SendChatMessage",
                    channel: "Local",
                    message: "ðŸŽ° @" + document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                                                     .length - 1].innerText.split(':')[0] + " Your slots results are: " + f[0] + " with a score of " + f[1] + "! ðŸŽ°"
                })
            }
 
            function getUserRoles(s) {
                users.forEach((item => {
                    if (item.name == s) {
                        return item.roles
                    } else {
                        return []
                    }
                }))
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].includes('!disconnect ' + window.ajsd) && (users[0].name == document.querySelectorAll(
                '.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                     .length - 1].innerText.split(':')[0] || users[1].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                             .querySelectorAll('.hud-chat-message')
                                                                                                                                             .length - 1].innerText.split(':')[0] || users[2].name == document.querySelectorAll('.hud-chat-message')[document
						.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.split(':')[0] || users[3].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                .querySelectorAll('.hud-chat-message')
                                                                                                                                .length - 1].innerText.split(':')[0] || document.querySelectorAll('.hud-chat-message')[document.querySelectorAll(
                '.hud-chat-message')
						.length - 1].innerText.split(':')[0].toLowerCase()
                                                                                                                                               .includes('pot') || users[4].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.toLowerCase()
                                                                                                                                               .split(':')[0])) {
                document.querySelector('.hud-chat-messages')
                    .innerHTML = ""
                console.clear()
                doNewSend(['ch', ['Bye have a great day!']])
                Game.currentGame.network.disconnect()
            }
            if (document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
                                                               .length - 1].innerText.split(':')[1].includes('!eid') && (users[0].name == document.querySelectorAll('.hud-chat-message')[document
						.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.split(':')[0] || users[1].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                .querySelectorAll('.hud-chat-message')
                                                                                                                                .length - 1].innerText.split(':')[0] || users[2].name == document.querySelectorAll('.hud-chat-message')[document
						.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.split(':')[0] || users[3].name == document.querySelectorAll('.hud-chat-message')[document
                                                                                                                                .querySelectorAll('.hud-chat-message')
                                                                                                                                .length - 1].innerText.split(':')[0] || document.querySelectorAll('.hud-chat-message')[document.querySelectorAll(
                '.hud-chat-message')
						.length - 1].innerText.split(':')[0].toLowerCase()
                                                                                                                         .includes('pot') || users[4].name == document.querySelectorAll('.hud-chat-message')[document.querySelectorAll('.hud-chat-message')
						.length - 1].innerText.toLowerCase()
                                                                                                                         .split(':')[0])) {
                doNewSend(['ch', [window.ajsd]])
            }
        }
    }
}, 750)
 
document.querySelector('#toggleahrc')
    .addEventListener('click', function () {
    window.ahrc = !window.ahrc
    document.querySelector('#toggleahrc')
        .innerText = window.ahrc ? "Disable AHRC" : "Enable AHRC"
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(window.ahrc, 'AHRC')]])
    }
})
 
function autoBow() {
    if (isBowing) {
        isBowing = false
        clearInterval(window.bow)
    } else {
        isBowing = true
        if (Game.currentGame.ui.inventory.Bow) {
            Game.currentGame.network.sendRpc({
                name: "EquipItem",
                itemName: "Bow",
                tier: Game.currentGame.ui.inventory.Bow.tier
            })
            window.bow = setInterval(function () {
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 1
                })
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 0
                })
                Game.currentGame.inputPacketScheduler.scheduleInput({
                    space: 0
                })
            }, 0);
        }
    }
    document.querySelector('#toggleab')
        .innerText = isBowing ? "Disable AutoBow" : "Enable AutoBow"
    doNewSend(['ch', [isBowing ? "ðŸŸ© Enabled AutoBow ðŸŸ©" : "ðŸŸ¥ Disabled AutoBow ðŸŸ¥"]])
}
document.querySelector('#toggleab')
    .addEventListener('click', autoBow)
document.querySelector('#upgradeallbtn')
    .addEventListener('click', upgradeAll)
 
function onChangePP() {
    game.ui.getComponent('PopupOverlay')
        .showHint('This may take a bit to apply, so be patient')
}
document.querySelector('#showpp')
    .addEventListener('change', onChangePP)
document.querySelector('#idkbtn11')
    .addEventListener('click', btnChatCircle)
document.querySelector('#idkbtn22')
    .addEventListener('click', btnChatRect)
document.querySelector('#advancedlpi')
    .addEventListener('change', function (e) {
    var THIS_LPI_EVENT = this;
    if (THIS_LPI_EVENT.checked) {
        doNewSend(['ch', ['âš™ï¸ Activated Advanced Player Info âš™ï¸']])
    } else {
        doNewSend(['ch', ['âš™ï¸ Deactivated Advanced Player Info âš™ï¸']])
    }
})
document.querySelector('#zos')
    .addEventListener('change', function (e) {
    var THIS_ZOS_EVENT = this;
    window.zoomonscroll = THIS_ZOS_EVENT.checked
    if (THIS_ZOS_EVENT.checked) {
        doNewSend(['ch', ['âš™ï¸ Activated Zoom On Scroll âš™ï¸']])
    } else {
        doNewSend(['ch', ['âš™ï¸ Deactivated Zoom On Scroll âš™ï¸']])
    }
})
 
window.sendAitoAlt = () => {
    if (window.startaito) {
        let ws = new WebSocket(`ws://${Game.currentGame.options.servers[Game.currentGame.options.serverId].hostname}:8000`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => {
            ws.isclosed = true;
        }
        ws.onopen = () => {
            ws.network = new Game.currentGame.networkType();
            ws.network.sendEnterWorldAndDisplayName = (t) => {
                ws.network.sendPacket(4, {
                    displayName: t
                });
            };
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
            ws.network.sendEnterWorldAndDisplayName(localStorage.name);
        }
        ws.onEnterWorld = () => {
            // useless
        }
        ws.onmessage = msg => {
            ws.data = ws.network.codec.decode(msg.data);
            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            }
            if (ws.data.name) {
                ws.dataType = ws.data;
            }
            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;
                ws.close();
            }
            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;
                    ws.close();
                    window.sendAitoAlt();
                }
            }
            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
                if (ws.isDay) {
                    ws.verified = true;
                }
            }
            if (ws.data.name == "Dead") {
                ws.network.sendInput({
                    respawn: 1
                });
            }
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
                    }
                }
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            }
            switch (ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
        }
    }
}
 
function toggleAito() {
    if (window.startaito) {
        window.startaito = false;
    } else {
        window.startaito = true;
        window.sendAitoAlt()
    }
    doNewSend(['ch', [window.startaito ? "ðŸŸ© Enabled Aito ðŸŸ©" : "ðŸŸ¥ Disabled Aito ðŸŸ¥"]])
    document.querySelector('#mainxaito')
        .innerText = window.startaito ? "Disable Aito" : "Enable Aito"
}
document.querySelector('#mainxaito')
    .addEventListener('click', toggleAito)
document.querySelector('#idkbtn33')
    .addEventListener('click', leaveChat)
Game.currentGame.network.addRpcHandler('ReceiveChatMessage', (e) => {
    if (e.uid !== game.world.getMyUid() && document.querySelector('#copycat')
        .checked) {
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Local",
            message: e.message
        })
    }
    if (e.message.toLowerCase()
        .includes('ligma')) {
        doNewSend(['ch', ['LIGMA BALLS BITCH AHAHA @' + e.displayName]])
    }
})
document.querySelector('#togglebot')
    .addEventListener('click', function () {
    botMode = !botMode
    this.innerText = botMode ? "Disable Bot Mode" : "Enable Bot Mode"
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(botMode, "Bot Mode")]])
    }
})
document.querySelector('#toggleresp')
    .addEventListener('click', function () {
    autoRespawn = !autoRespawn
    this.innerText = autoRespawn ? "Disable Auto Respawn" : "Enable Auto Respawn"
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(autoRespawn, "Auto Respawn")]])
    }
})/*
window.lol = setInterval(changeHue, 50)
window.rainbow = setInterval(() => {
    if (!transparentMenu) {
        settingsRainbow.style.backgroundColor = `hsla(${hue}, 25%, 30%, 0.45)`
		document.querySelector("#hud-menu-settings > div")
            .style.backgroundColor = `rgba(0, 0, 0, 0.25)`
	} else {
        settingsRainbow.style.backgroundColor = `rgba(0, 0, 0, 0)`
		document.querySelector("#hud-menu-settings > div")
            .style.backgroundColor = `rgba(0, 0, 0, 0)`
	}
}, 10)*/
document.querySelector('#togglespmch')
    .addEventListener('click', function () {
    pauseChatSpam(document.querySelector('#spmchinput')
                  .value)
    if (changeChat) {
        doNewSend(['ch', [enDisAbleEmj(isSpamming, "Chat Spam")]])
    }
    this.innerText = isSpamming ? "Disable Spam Chat" : "Enable Spam Chat"
})
document.querySelector('#walldoor')
    .addEventListener('click', doorWall)
document.querySelector('#apexmode')
    .addEventListener('change', function () {
    changeChat = this.checked
})
//instructions
