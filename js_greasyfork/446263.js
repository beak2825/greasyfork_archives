// ==UserScript==
// @name         Main X(soon version)
// @namespace    http://tampermonkey.net/
// @version      null
// @description  discord:♛Ꭾls♣ℌelp♠ℳe xD♕#3818 and not Trollers xD#0961
// @author       ♛Ꭾls♣ℌelp♠ℳe xD♕ and not trollers xD
// @match        zombs.io
// @match        http://tc-mod-xyz.glitch.me/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446263/Main%20X%28soon%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446263/Main%20X%28soon%20version%29.meta.js
// ==/UserScript==

//auto respawn
(function(t, e) {
        let script = document.createElement("script")
        script.src = t
        document.body.appendChild(script)

        let link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = e
        document.head.appendChild(link)
    })("https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js", "https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css")

    const playerDeath = new CustomEvent("playerDeath", {
        "detail": "Fires at player's death."
    })
    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutations[0].target.style.display == "block") {
                document.dispatchEvent(playerDeath)
            }
        })
    }).observe(document.querySelector(".hud-respawn"), {
        attributes: true
    })
    document.addEventListener("playerDeath", function() {
        new Noty({
            text: "the ghost of ₮roℓℓerᏕ 202 Revived you...!",
            theme: "relax",
            type: "error",
            timeout: 2000
        }).show()
        document.querySelector(".hud-respawn-btn").click()
    })


//added Invincbillity Shield
function FixShield() {
        if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
         Game.currentGame.network.sendRpc({name: "EquipItem", itemName: "ZombieShield", tier:  Game.currentGame.ui.inventory.ZombieShield.tier});
    }
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);

 game.renderer.ground.setVisible(true);

//Messages
Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "Trollers_bot",
        message: "I Will End This World..."
})

//Messages
Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "Trollers_bot",
        message: "I Am The Power Fullest..."
})

//Messages
Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "Trollers_bot",
        message: "https://www.youtube.com/watch?v=iik25wqIuFo  .this is my yt channel"
})

//Messages
Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "rickrole_bot",
        message: "Never gonna give you up Never gonna let you down"
})

//Messages
Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "rickrole_bot",
        message: "Never gonna run around and desert you"})

//Messages
Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "rickrole_bot",
        message: "Never gonna make you cry Never gonna say goodbye"})

//Messages
Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "rickrole_bot",
        message: "Never gonna tell a lie and hurt you"})

let css2 = `
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
background-image: url();
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
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

// REMOVE ADS
document.querySelectorAll('.ad-unit').forEach(function(a) {
  a.remove();
});
document.querySelector('.hud-intro-footer').remove();
document.querySelector('.hud-intro-youtuber').remove();
document.querySelector('.hud-intro-social').remove();
document.querySelector('.hud-intro-more-games').remove();

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
    document.getElementsByClassName("etc.Class")[0].innerText = "Main (1)";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("AB")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("AB")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main (2)";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("BS")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("BS")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main (3)";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("SI")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SI")[0].innerText = "- - -";
    document.getElementsByClassName("etc.Class")[0].innerText = "Main (4)";
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
    document.getElementsByClassName("SE")[0].innerText = "Main Xyz!";
    document.getElementsByClassName("AB")[0].innerText = "x!";
    document.getElementsByClassName("BS")[0].innerText = "y!";
    document.getElementsByClassName("SI")[0].innerText = "z!";
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
<h3 class="etc.Class">Normal Scripts!</h3>
<hr />
<button class="btn btn-green 0i" style="width: 45%;">Sell All!</button>

<button class="btn btn-green 1i" style="width: 45%;">Sell Walls!!</button>

<button class="btn btn-green 2i" style="width: 45%;">Sell Doors!</button>

<button class="btn btn-green 3i" style="width: 45%;">Sell Traps!</button>

<button class="btn btn-green 4i" style="width: 45%;">Sell Archers!</button>

<button class="btn btn-green 5i" style="width: 45%;">Sell Cannons!</button>

<button class="btn btn-green 6i" style="width: 45%;">Sell Melees!</button>

<button class="btn btn-green 7i" style="width: 45%;">Sell Bombs!</button>

<button class="btn btn-green 8i" style="width: 45%;">Sell Mages!</button>

<button class="btn btn-green 9i" style="width: 45%;">Sell Gold Mines!</button>

<button class="btn btn-blue 10i" style="width: 45%;">Active Upgrade All!</button>

<button class="btn btn-blue 11i" style="width: 45%;">Active AHRC!</button>

<button class="btn btn-blue 12i" style="width: 45%;">Enable Autobow</button>

<button class="btn btn-blue 13i" style="width: 45%;">Enable Auto Accepter</button>

<button class="btn btn-blue 14i" style="width: 45%;">Enable Auto Kicker</button>

<br class="15i"><br class="16i">

<button class="btn btn-green 0i5" style="width: 45%;">Can Members Sell!</button>

<button class="btn btn-green 3i5" style="width: 45%;"">Kick All Members!</button>

<button class="btn btn-blue 4i5" style="width: 45%;">Auto Spear!</button>

<button class="btn btn-blue 5i5" style="width: 45%;">Auto Bomb!</button>

<button class="btn btn-red 8i5" style="width: 45%;">!(Auto heal and Pet Heal)</button>

<button class="btn btn-red 9i5" style="width: 45%;">!(Revive and Evolve Pets)</button>

<button class="btn btn-blue 6i5" style="width: 45%;">Enable Speed Run</button>

<button class="btn btn-blue 10i5" style="width: 45%;">Clear Messages!</button>

<button class="btn btn-white 12i5" style="width: 45%;">Auto Respawn!</button>

<button class="btn btn-white 13i5" style="width: 45%;">Enable 3x3 wall!</button>

<br class="14i5"><br class="15i5">

<button class="0i2">Send Alt!</button>

<button class="1i2">Enable Aim!</button>

<button class="2i2">Enable Player Follower!</button>

<button class="10i2">Enable MouseMove!</button>

<br class="23i2"><br class="24i2">

<button class="3i2">Delete Alt!</button>

<input type="number" class="4i2" placeholder="Alt Id">

<button class="7i2">Delete All Alts!</button>

<br class="5i2"><br class="6i2">

<button class="8i2">Show Resources!</button>

<button class="21i2">Control Alts!</button>

<button class="22i2">Uncontrol Alts!</button>

<br class="9i2"><br class="10i2">

<button class="11i2">Start Aito!</button>

<button class="12i2">Active 4 Player Trick</button>

<button class="13i2">Fill Party!</button>

<br class="14i2"><br class="15i2">

<input type="text" value="1" class="16i2" placeholder="Player Rank" style="width: 25%;">

<button class="18i2">Active Player Finder</button>

<button class="25i2">Fill Server!</button>

<br class="19i2"><br class="20i2">

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
<br class="31i3"></br class="32i3">


`;
let score = 0;
let oldWave = 0;
let logs = 0;
document.getElementsByClassName('hud-settings-grid')[0].innerHTML = '';

let Main1Keys = true;
let Main2Keys = true;
let Main3Keys = true;

displayAllToNone();
let button;
let altname = 1;
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
let aimingYaw = 1;
let uid;
let entities = {};
let lb = {};
let players = {};
let buildings = {};
let msg;
let Bowteir = 0;
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

game.ui.components.PlacementOverlay.oldStartPlacing = game.ui.components.PlacementOverlay.startPlacing;
game.ui.components.PlacementOverlay.startPlacing = function(e) {
    game.ui.components.PlacementOverlay.oldStartPlacing(e);
    if (game.ui.components.PlacementOverlay.placeholderEntity) {
        game.ui.components.PlacementOverlay.direction = 2;
        game.ui.components.PlacementOverlay.placeholderEntity.setRotation(180);
    }
}

game.ui.components.PlacementOverlay.cycleDirection = function () {
    if (game.ui.components.PlacementOverlay.placeholderEntity) {
        game.ui.components.PlacementOverlay.direction = (game.ui.components.PlacementOverlay.direction + 1) % 4;
        game.ui.components.PlacementOverlay.placeholderEntity.setRotation(game.ui.components.PlacementOverlay.direction * 90);
    }
};

let getElement = (Element) => {
    return document.getElementsByClassName(Element);
}
let getId = (Element) => {
    return document.getElementById(Element);
}
getElement("hud-party-members")[0].style.display = "block";
getElement("hud-party-grid")[0].style.display = "none";
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
let keyTab = document.createElement("a");
keyTab.className = "hud-party-tabs-link";
keyTab.id = "keyTab";
keyTab.innerHTML = "Keys";
getElement("hud-party-tabs")[0].appendChild(keyTab);
let keyHud = document.createElement("div");
keyHud.className = "hud-keys hud-party-grid";
keyHud.id = "keyHud";
keyHud.style = "display: none;";
getElement("hud-menu hud-menu-party")[0].insertBefore(keyHud, getElement("hud-party-actions")[0]);
getId("privateTab").onclick = e => {
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
    if (getId("keyHud").getAttribute("style") == "display: block;") {
        getId("keyHud").setAttribute("style", "display: none;");
    }
}
getElement("hud-party-tabs-link")[0].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getElement("hud-party-tabs-link")[1].onmouseup = e => {
    getId("privateHud").setAttribute("style", "display: none;");
    getId("keyHud").setAttribute("style", "display: none;");
    getId
    if (getId("privateTab").className == "hud-party-tabs-link is-active") {
        getId("privateTab").className = "hud-party-tabs-link"
    }
    if (getId("keyTab").className == "hud-party-tabs-link is-active") {
        getId("keyTab").className = "hud-party-tabs-link"
    }
}
getId("keyTab").onmouseup = e => {
    for (let i = 0; i < getElement("hud-party-tabs-link").length; i++) {
        getElement("hud-party-tabs-link")[i].className = "hud-party-tabs-link";
    }
    getId("keyTab").className = "hud-party-tabs-link is-active";
    getId("keyHud").setAttribute("style", "display: block;");
    if (getElement("hud-party-members")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-members")[0].setAttribute("style", "display: none;");
    }
    if (getElement("hud-party-grid")[0].getAttribute("style") == "display: block;") {
        getElement("hud-party-grid")[0].setAttribute("style", "display: none;");
    }
    if (getId("privateHud").getAttribute("style") == "display: block;") {
        getId("privateHud").setAttribute("style", "display: none;");
    }
    if (getId("keyHud").getAttribute("style") == "display: none;") {
        getId("keyHud").setAttribute("style", "display: block;");
    }
}
let interval = () => {
    if (msg.uid) {
        uid = msg.uid;
        players = {};
        entities = {};
        buildings = {};
        window.message = 0;
        for (let i = 0; i < 750; i++) {
            game.network.sendInput({mouseMoved: 0})
        }
    }
    `if (msg.name == "ReceiveChatMessage") {
let response = msg.response;
let word = response.message;
let reversedWord = "";
for (let i = word.length - 1; i > -1; i--) {
reversedWord += word[i];
}
game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: reversedWord});
}`
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
                    game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: "hi " + msg.entities[i].name})
                }
                if (autorss) {
                    game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: msg.entities[i].name + ", W: " + counter(msg.entities[i].wood) + ", S: " + counter(msg.entities[i].stone) + ", G: " + counter(msg.entities[i].gold) + ", T: " + Math.floor(msg.entities[i].token) + ";"});
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
        if (autorss) {
            if (!window.timeouter) {
                window.timeouter = true;
                setTimeout(() => { window.timeouter = false; }, 300);
                for (let i in game.world.entities) {
                    if (allSocketsByUid[i]) {
                        if (game.world.entities[i].fromTick.uid == allSocketsByUid[i].uid) {
                            game.world.entities[i].targetTick.id = allSocketsByUid[i].id;
                        }
                    }
                    if (game.world.entities[i].targetTick.name) {
                        if (!game.world.entities[i].targetTick.oldName) {
                            game.world.entities[i].targetTick.oldName = game.world.entities[i].targetTick.name;
                        }
                        if (!game.world.entities[i].fromTick.id) {
                            game.world.entities[i].targetTick.name = `${game.world.entities[i].targetTick.oldName}, W: ${counter(game.world.entities[i].fromTick.wood)}, S: ${counter(game.world.entities[i].fromTick.stone)}, G: ${counter(game.world.entities[i].fromTick.gold)}, T: ${Math.floor(game.world.entities[i].fromTick.token)};
x: ${game.world.entities[i].fromTick.position.x}, y: ${game.world.entities[i].fromTick.position.y}, partyId: ${game.world.entities[i].fromTick.partyId};`
                        } else {
                            game.world.entities[i].targetTick.name = `${game.world.entities[i].targetTick.oldName}, ID: ${game.world.entities[i].targetTick.id}, W: ${counter(game.world.entities[i].fromTick.wood)}, S: ${counter(game.world.entities[i].fromTick.stone)}, G: ${counter(game.world.entities[i].fromTick.gold)}, T: ${Math.floor(game.world.entities[i].fromTick.token)};
x: ${game.world.entities[i].fromTick.position.x}, y: ${game.world.entities[i].fromTick.position.y}, partyId: ${game.world.entities[i].fromTick.partyId};`
                        }
                    }
                }
            }
        } else {
            if (game.world.entities[game.world.myUid].targetTick.oldName) {
                for (let i in game.world.entities) {
                    if (game.world.entities[i].targetTick.oldName) {
                        if (game.world.entities[i].targetTick.name) {
                            game.world.entities[i].targetTick.name = game.world.entities[i].targetTick.oldName;
                            game.world.entities[i].targetTick.oldName = null;
                        }
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
        if (msg.name == 'Leaderboard') {
            let e = msg.response;
            for (let i in e) {
                if ((e[i].wave - 1) !== -1 && e[i].uid == game.world.myUid) {
                    if (e[i].wave !== oldWave) {
                        logs = logs + 1;
                        oldWave = e[i].wave;
                        score = e[i].score;
                        document.getElementsByClassName('hud-settings-grid')[0].innerHTML += `
<div class="score${logs}">{wave: ${e[i].wave}, Score Gained: ${0}, Total Score: ${score}};</div>`
                    } else {
                        document.getElementsByClassName(`score${logs}`)[0].innerText = `{wave: ${e[i].wave}, Score Gained: ${e[i].score - score}, Total Score: ${e[i].score}};`;
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
document.getElementsByClassName("10i2")[0].addEventListener('click', function() {
    window.mousemove = !window.mousemove;
    this.innerText = window.mousemove ? "Disable MouseMove!" : "Enable MouseMove!"
})
function F_PlayerFollower() {
    let altFollowPlayer = !altFollowPlayer;
    document.getElementsByClassName("2i2")[0],addEventListener("click"), function() {
        for (var i = 1; i <= numOfAlts; i++) {
            let win = document.getElementById("null" + i)
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
function sellAllByType(type) {
    if (!game.ui.playerPartyCanSell) return;

    let sellInterval = () => {
        let target = Object.values(game.ui.buildings).find(e => e.type == type);
        if (target !== undefined) {
            Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: target.uid});
            setTimeout(() => { sellInterval(); }, .000000000000000000000000000000000000000000001);
        }
    }
    sellInterval();
};

document.getElementsByClassName("0i")[0].addEventListener('click', function() {
        let sellInterval = () => {
            if (Object.keys(game.ui.buildings).length > 1 && game.ui.playerPartyCanSell) {
                Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: parseInt(Object.keys(game.ui.buildings)[1])});
                setTimeout(() => { sellInterval(); }, .000000000000000000000000000000000000000000001);
            }
        }
        sellInterval();
    })
document.getElementsByClassName("1i")[0].addEventListener('click', () => { sellAllByType("Wall") });
document.getElementsByClassName("2i")[0].addEventListener('click', () => { sellAllByType("Door") });
document.getElementsByClassName("3i")[0].addEventListener('click', () => { sellAllByType("SlowTrap") });
document.getElementsByClassName("4i")[0].addEventListener('click', () => { sellAllByType("ArrowTower") });
document.getElementsByClassName("5i")[0].addEventListener('click', () => { sellAllByType("CannonTower") });
document.getElementsByClassName("6i")[0].addEventListener('click', () => { sellAllByType("MeleeTower") });
document.getElementsByClassName("7i")[0].addEventListener('click', () => { sellAllByType("BombTower") });
document.getElementsByClassName("8i")[0].addEventListener('click', () => { sellAllByType("MagicTower") });
document.getElementsByClassName("9i")[0].addEventListener('click', () => { sellAllByType("GoldMine") });
document.getElementsByClassName("11i")[0].addEventListener('click', () => { Game.currentGame.network.sendRpc({name: "DeleteBuilding", uid: game.ui.getPlayerPetUid()}); });

document.getElementsByClassName("10i")[0].addEventListener('click', function() {
    upgradeAll = !upgradeAll;
    document.getElementsByClassName("10i")[0].className = "btn btn-blue 10i";
    document.getElementsByClassName("10i")[0].innerText = "Active Upgrade All!";
    if (upgradeAll) {
        document.getElementsByClassName("10i")[0].className = "btn btn-red 10i";
        document.getElementsByClassName("10i")[0].innerText = "Inactive Upgrade All!";
    }
})
document.getElementsByClassName("11i")[0].addEventListener('click', function() {
    AHRC = !AHRC;
    document.getElementsByClassName("11i")[0].className = "btn btn-blue 11i";
    document.getElementsByClassName("11i")[0].innerText = "Active AHRC!";
    if (AHRC) {
        document.getElementsByClassName("11i")[0].className = "btn btn-red 11i";
        document.getElementsByClassName("11i")[0].innerText = "Inactive AHRC!";
    }
})
document.getElementsByClassName("12i")[0].addEventListener('click', function() {
    autobow = !autobow;
    let playerWeapon = game.ui.playerTick.weaponName;
    document.getElementsByClassName("12i")[0].className = "btn btn-blue 12i";
    document.getElementsByClassName("12i")[0].innerText = "Enable Autobow";
    if (autobow) {
        document.getElementsByClassName("12i")[0].className = "btn btn-red 12i";
        document.getElementsByClassName("12i")[0].innerText = "Disable Autobow";
        if (game.ui.inventory.Bow) {
            game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: game.ui.inventory.Bow.tier})
        } else {
            game.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1})
            game.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: 1})
        }
    } else {
        game.network.sendRpc({name: "EquipItem", itemName: playerWeapon, tier: game.ui.inventory[playerWeapon].tier})
    }
})
window.autobuildtoggle = () => {
    autobuild = !autobuild;
    document.getElementsByClassName("21i3")[0].innerText = "Enable Auto Build Saved Towers!";
    if (autobuild) {
        document.getElementsByClassName("21i3")[0].innerText = "Disable Auto Build Saved Towers!";
    }
}
document.getElementsByClassName("11i2")[0].addEventListener('click', function() {
    window.startaito = !window.startaito;
    document.getElementsByClassName("11i2")[0].innerText = "Start Aito!";
    if (window.startaito) {
        window.sendAitoAlt();
        document.getElementsByClassName("11i2")[0].innerText = "Stop Aito!";
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
document.getElementsByClassName("5i5")[0].addEventListener('click', function() {
    autorss = !autorss;
    document.getElementsByClassName("5i5")[0].className = "btn btn-blue 5i5";
    document.getElementsByClassName("5i5")[0].innerText = "Enable Send Info!";
    if (autorss) {
        document.getElementsByClassName("5i5")[0].className = "btn btn-red 5i5";
        document.getElementsByClassName("5i5")[0].innerText = "Disable Send Info!";
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
    document.getElementsByClassName("13i5")[0].innerText = "Enable 3x3 Wall!";
    if (kick1p) {
        document.getElementsByClassName("13i5")[0].className = "btn btn-red 13i5";
        document.getElementsByClassName("13i5")[0].innerText = "Disable 3x3 Wall!";
    }
})
document.getElementsByClassName("12i2")[0].addEventListener('click', function() {
    window.shouldStartScript = !window.shouldStartScript;
    document.getElementsByClassName("12i2")[0].innerText = "Active 4 Player Trick";
    if (window.shouldStartScript) {
        document.getElementsByClassName("12i2")[0].innerText = "!(Active 4 Player Trick)";
    }
})
document.getElementsByClassName("18i2")[0].addEventListener('click', function() {
    window.startaito2 = !window.startaito2;
    document.getElementsByClassName("18i2")[0].innerText = "Active Player Finder";
    if (window.startaito2) {
        window.sendAitoAlt2();
        document.getElementsByClassName("18i2")[0].innerText = "!(Active Player Finder)";
    }
})
document.getElementsByClassName("25i2")[0].addEventListener('click', function() {
    if (window.playerX && window.playerY) {
        window.findPlayer = !window.findPlayer;
        document.getElementsByClassName("25i2")[0].innerText = "Fill Party!";
        if (window.findPlayer) {
            document.getElementsByClassName("25i2")[0].innerText = "Unfill Party!";
            }
    }
})
document.getElementsByClassName("4i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("4i")[0].className = "btn btn-green 4i";
    document.getElementsByClassName("4i")[0].innerText = "Sell Archers!";
    if (accept) {
        document.getElementsByClassName("4i")[0].className = "btn btn-red 4i";
        document.getElementsByClassName("4i")[0].innerText = "Disable Sell Archers!";
    }
})
document.getElementsByClassName("1i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("1i")[0].className = "btn btn-green 1i";
    document.getElementsByClassName("1i")[0].innerText = "Sell Walls!";
    if (accept) {
        document.getElementsByClassName("1i")[0].className = "btn btn-red 1i";
        document.getElementsByClassName("1i")[0].innerText = "Disable Sell Walls!";
    }
})
document.getElementsByClassName("3i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("3i")[0].className = "btn btn-green 3i";
    document.getElementsByClassName("3i")[0].innerText = "Sell Traps!";
    if (accept) {
        document.getElementsByClassName("3i")[0].className = "btn btn-red 3i";
        document.getElementsByClassName("3i")[0].innerText = "Disable Sell Traps!";
    }
})
document.getElementsByClassName("5i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("5i")[0].className = "btn btn-green 5i";
    document.getElementsByClassName("5i")[0].innerText = "Sell Cannons!";
    if (accept) {
        document.getElementsByClassName("5i")[0].className = "btn btn-red 5i";
        document.getElementsByClassName("5i")[0].innerText = "Disable Sell Cannons!";
    }
})
document.getElementsByClassName("7i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("7i")[0].className = "btn btn-green 7i";
    document.getElementsByClassName("7i")[0].innerText = "Sell Bombs!";
    if (accept) {
        document.getElementsByClassName("7i")[0].className = "btn btn-red 7i";
        document.getElementsByClassName("7i")[0].innerText = "Disable Sell Bombs!";
    }
})
document.getElementsByClassName("9i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("9i")[0].className = "btn btn-green 9i";
    document.getElementsByClassName("9i")[0].innerText = "Sell Gold Mines!";
    if (accept) {
        document.getElementsByClassName("9i")[0].className = "btn btn-red 9i";
        document.getElementsByClassName("9i")[0].innerText = "Disable Sell Gold Mines!";
    }
})
document.getElementsByClassName("6i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("6i")[0].className = "btn btn-green 6i";
    document.getElementsByClassName("6i")[0].innerText = "Sell Melees!";
    if (accept) {
        document.getElementsByClassName("6i")[0].className = "btn btn-red 6i";
        document.getElementsByClassName("6i")[0].innerText = "Disable Sell Melees!";
    }
})
document.getElementsByClassName("8i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("8i")[0].className = "btn btn-green 8i";
    document.getElementsByClassName("8i")[0].innerText = "Sell Mages!";
    if (accept) {
        document.getElementsByClassName("8i")[0].className = "btn btn-red 8i";
        document.getElementsByClassName("8i")[0].innerText = "Disable Sell Mages!";
    }
})
document.getElementsByClassName("2i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("2i")[0].className = "btn btn-green 2i";
    document.getElementsByClassName("2i")[0].innerText = "Sell Doors!";
    if (accept) {
        document.getElementsByClassName("2i")[0].className = "btn btn-red 2i";
        document.getElementsByClassName("2i")[0].innerText = "Disable Sell Doors!";
    }
})
document.getElementsByClassName("12i5")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("12i5")[0].className = "btn btn-white 12i5";
    document.getElementsByClassName("12i5")[0].innerText = "Auto Respawn!";
    if (accept) {
        document.getElementsByClassName("12i5")[0].className = "btn btn-red 12i5";
        document.getElementsByClassName("12i5")[0].innerText = "Disable Auto Respawn!";
    }
})
document.getElementsByClassName("0i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("0i")[0].className = "btn btn-green 0i";
    document.getElementsByClassName("0i")[0].innerText = "Sell All!";
    if (accept) {
        document.getElementsByClassName("0i")[0].className = "btn btn-red 0i";
        document.getElementsByClassName("0i")[0].innerText = "Disable Sell All!";
    }
})
document.getElementsByClassName("2i2")[0].addEventListener('click', function() {
    window.EnablePlayerFollower = !window.EnablePlayerFollower;
    document.getElementsByClassName("2i2")[0].innerText = "Enable Player Follower!";
    if (window.EnablePlayerFollower) {
        document.getElementsByClassName("2i2")[0].innerText = "Disable Player Follower!";
    }
})






