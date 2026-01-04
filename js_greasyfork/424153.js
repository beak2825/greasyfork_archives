// ==UserScript==a
// @name         </> Kurt & Java TC Mod
// @namespace    http://tampermonkey.net/
// @version      20.0
// @description  Kurt & Java
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424153/%3C%3E%20Kurt%20%20Java%20TC%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/424153/%3C%3E%20Kurt%20%20Java%20TC%20Mod.meta.js
// ==/UserScript==

let css2 = `
.btn:hover {
cursor: pointer;
}
.btn-blue {
background-color: #010201;
}
.btn-blue:hover .btn-blue:active {
background-color: #010201;
}
.btn:hover {
cursor: pointer;
}
.btn-red {
background-color: #360010;
}
.btn-red:hover .btn-blue:active {
background-color: #360010;
}
.btn:hover {
cursor: pointer;
}
.btn-gold {
background-color: #5a6600;
}
.btn-gold:hover .btn-blue:active {
background-color: #5a6600;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-purple {
background-color: #290033;
}
.btn-purple:hover .btn-blue:active {
background-color: #290033;
}
.btn:hover {
cursor: pointer;
}
.btn-green {
background-color: #001603;
}
.btn-green:hover .btn-blue:active {
background-color: #001603;
}
.btn:hover {
cursor: pointer;
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
background-image: url("https://cdn.discordapp.com/emojis/819849804716703754.png?v=1");
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

function $(classname) {
    var element = document.getElementsByClassName(classname)
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
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
changeHeight.innerHTML = "@keyframes hud-popup-message {0% { max-height: 0; margin-bottom: 0; opacity: 0; }100% { max-height: 1000px; margin-bottom: 10px; opacity: 1; }} .hud-map .hud-map-spot {display: none;position: absolute;width: 4px;height: 4px;margin: -2px 0 0 -2px;background: #ff5b5b;border-radius: 50%;z-index: 2;} .hud-chat .hud-chat-message { -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text; }"
document.body.appendChild(changeHeight)
var widget = '<iframe src="https://discordapp.com/widget?id=821773113506267136&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" style="width: 300px;height: 320px;"></iframe>'
$("hud-intro-left").innerHTML = widget

var PopupOverlay = Game.currentGame.ui.getComponent("PopupOverlay")

var input = $("hud-chat-input")
var pets = $("hud-shop-actions-equip")

function clearChat() {
    input.value = null
}

let tyles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);

document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-blue hud-intro-play");

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

let modHTML = `
<div class="hud-menu-zipp3">
<br />
<div style="text-align:center">
<button class="SE" style="width: 20%">• Menü I</button>
<button class="AB" style="width: 20%">• Yapay Zeka</button>
<button class="BS" style="width: 20%">• Üs Kaydedici</button>
<button class="SI" style="width: 20%">• Menü II</button>
<div class="hud-zipp-grid3">
</div>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp3")[0];

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
    document.getElementsByClassName("SE")[0].innerText = "★";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Menü I";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i")[0]) {
            document.getElementsByClassName(i + "i")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("AB")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("AB")[0].innerText = "★";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Yapay Zeka";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i2")[0]) {
            document.getElementsByClassName(i + "i2")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("BS")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("BS")[0].innerText = "★";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Üs Kaydedici";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i3")[0]) {
            document.getElementsByClassName(i + "i3")[0].style.display = "";
        }
    }
})

document.getElementsByClassName("SI")[0].addEventListener("click", function() {
    displayAllToNone();
    document.getElementsByClassName("SI")[0].innerText = "★";
    document.getElementsByClassName("etc.Class")[0].innerText = "• Menü II";
    for (let i = 0; i < 50; i++) {
        if (document.getElementsByClassName(i + "i5")[0]) {
            document.getElementsByClassName(i + "i5")[0].style.display = "";
        }
    }
})

var IntroFooter = '';
IntroFooter += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-footer')[0].innerHTML = IntroFooter;

var IntroSocial = '';
IntroSocial += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-social')[0].innerHTML = IntroSocial;

var IntroCornerTopLeft = '';
IntroCornerTopLeft += "<center><h3></h3>";

document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = IntroCornerTopLeft;

document.getElementsByClassName("hud-intro-form")[0].style.height = "300px";
document.getElementsByClassName("hud-intro-play")[0].setAttribute("class", "btn btn-red hud-intro-play");
document.querySelectorAll('.ad-unit').forEach(function(a) {
    a.remove();
});

function modm() {
    if(zipz123.style.display == "none" || zipz123.style.display == "") {
        zipz123.style.display = "block";
    } else {
        zipz123.style.display = "none";
    };
};
function displayAllToNone() {
    document.getElementsByClassName("SE")[0].innerText = "• Menü I";
    document.getElementsByClassName("AB")[0].innerText = "• Yapay Zeka";
    document.getElementsByClassName("BS")[0].innerText = "• Üs Kaydedici";
    document.getElementsByClassName("SI")[0].innerText = "• Menü II";
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
    "detail": "..."
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
        text: "Öldün! Tekrardan Gelişmen Gerek Daha Yeni Başlıyoruz.",
        theme: "relax",
        type: "error",
        timeout: 3000
    }).show()
    document.querySelector(".hud-respawn-btn").click()
})

document.getElementsByClassName("hud-zipp-grid3")[0].innerHTML = `
<div style="text-align:center"><br>
<hr />
<h3 class="etc.Class">• Kurt & Java TC Modu</h3>
<hr />
<button class="btn btn-green 0i" style="width: 45%;">Üs Kaldır</button>

<button class="btn btn-green 1i" style="width: 45%;">Hepsini Kaldır</button>

<button class="btn btn-green 2i" style="width: 45%;">Duvarları Kaldır</button>

<button class="btn btn-green 3i" style="width: 45%;">Kapıları Kaldır</button>

<button class="btn btn-green 4i" style="width: 45%;">Tuzakları Kaldır</button>

<button class="btn btn-green 5i" style="width: 45%;">Okları Kaldır</button>

<button class="btn btn-green 6i" style="width: 45%;">Büyücüleri Kaldır</button>

<button class="btn btn-green 7i" style="width: 45%;">Hayvanları Kaldır</button>

<button class="btn btn-blue 8i" style="width: 45%;">Her Şeyi Yükselt &</button>

<button class="btn btn-blue 9i" style="width: 45%;">Otomatik Kazıcı &</button>

<button class="btn btn-blue 10i" style="width: 45%;">Otomatik Yay &</button>

<button class="btn btn-blue 13i" style="width: 45%;">Herkesi Partiye Al &</button>

<button class="btn btn-blue 14i" style="width: 45%;">Herkesi Partiden At &</button>

<br class="15i"><br class="16i">

<button class="btn btn-green 0i5" style="width: 45%;">Tüm Üyelere Silme Hakkı Tanı</button>

<button class="btn btn-green 1i5" style="width: 45%;"">Tüm Üyeleri Parti den At</button>

<button class="btn btn-blue 3i5" style="width: 45%;">Selam Gönderme &</button>

<button class="btn btn-blue 5i5" style="width: 45%;">Bilgi Gönderme &</button>

<button class="btn btn-red 8i5" style="width: 45%;">Can Doldurucu &</button>

<button class="btn btn-red 9i5" style="width: 45%;">Pet Güç Arttırıcı &</button>

<button class="btn btn-blue 6i5" style="width: 45%;">Ani Hızlanma &</button>

<button class="btn btn-blue 10i5" style="width: 45%;">Mesajları Kaldır &</button>

<input style="width: 45%; type="text" class="btn btn-white 12i5" placeholder="Parti İsminiz">

<button class="btn btn-white 13i5" style="width: 45%;">Tüm Oyuncuları At &</button>

<br class="14i5"><br class="15i5">

<button class="0i2">Klon Gönder</button>

<button class="1i2">Hedef Yeteneği &</button>

<button class="2i2">Takip Yeteneği &</button>

<br class="23i2"><br class="24i2">

<button class="3i2">Klon Kaldır</button>

<input type="number" class="4i2" placeholder="Kaldırılacak Klon ID si">

<button class="7i2">Tüm Klonları Kaldır</button>

<br class="5i2"><br class="6i2">

<button class="8i2">Kaynakları Göster</button>

<button class="21i2">Kontrollü Klon</button>

<button class="22i2">Kontrolsüz Klon</button>

<br class="9i2"><br class="10i2">

<button class="11i2">Zaman Dondurucu &</button>

<button class="12i2">4 Oyuncu Atağı &</button>

<button class="13i2">L Anaktarı &</button>

<br class="14i2"><br class="15i2">

<input type="text" value="1" class="16i2" placeholder="Player Rank" style="width: 25%;">

<button class="18i2">Aktif Oyuncu Bulucu</button>

<button class="25i2">Pozisyonu Takip Et</button> &nbsp;

<br class="19i2"><br class="20i2">

<button class="0i3" onclick="RecordBase();">Rekor Üssü I</button>
<button class="1i3" onclick="buildRecordedBase();">Kaydedilmiş Üs Oluşturun I</button>
<button class="2i3" onclick="DeleteRecordedbase();">Kaydedilmiş Tabanı Kaldırın I</button>
<br class="3i3"><br class="4i3">
<button class="5i3" onclick="RecordBase2();">Rekor Üssü II</button>
<button class="6i3" onclick="buildRecordedBase2();">Kaydedilmiş Üs Oluşturun II</button>
<button class="7i3" onclick="DeleteRecordedbase2();">Kaydedilmiş Tabanı Kaldırın II</button>
<br class="8i3"><br class="9i3">
<button class="10i3" onclick="RecordBase3();">Rekor Üssü I</button>
<button class="11i3" onclick="buildRecordedBase3();">Kaydedilmiş Üs Oluşturun III</button>
<button class="12i3" onclick="DeleteRecordedbase3();">Kaydedilmiş Tabanı Kaldırın III</button>
<br class="13i3"><br class="14i3">
<button class="15i3" onclick="saveBase();">Üs Kayıt</button>
<button class="16i3" onclick="buildSavedBase();">Kaydedilmiş Kuleler İnşa Edin</button>
<br class="17i3"><br class="18i3">
<button class="21i3" onclick="autobuildtoggle();">Kaydedilmiş Kuleleri Otomatik Oluşturun &</button>
<button class="26i3" onclick="upgradealltoggle();">Her Şeyi Yükselt &</button>
<br class="28i3"><br class="29i3">
<input type="text" class="30i3" placeholder='Üslerinizi Kaydedin Ve Fawori Üssünüzü Oluşturun' style="width: 100%" disabled="true">
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
                    game.network.sendRpc({name: "SendChatMessage", channel: "Local", message: "Merhaba " + msg.entities[i].name})
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
    document.getElementsByClassName("8i")[0].innerText = "Her Şeyi Yükselt &Kapalı";
    if (upgradeAll) {
        document.getElementsByClassName("8i")[0].className = "btn btn-red 8i";
        document.getElementsByClassName("8i")[0].innerText = "Her Şeyi Yükselt &Açık";
    }
})
document.getElementsByClassName("9i")[0].addEventListener('click', function() {
    AHRC = !AHRC;
    document.getElementsByClassName("9i")[0].className = "btn btn-blue 9i";
    document.getElementsByClassName("9i")[0].innerText = "Otomatik Kazıcı &Kapalı";
    if (AHRC) {
        document.getElementsByClassName("9i")[0].className = "btn btn-red 9i";
        document.getElementsByClassName("9i")[0].innerText = "Otomatik Kazıcı &Açık";
    }
})
document.getElementsByClassName("10i")[0].addEventListener('click', function() {
    autobow = !autobow;
    let playerWeapon = game.ui.playerTick.weaponName;
    document.getElementsByClassName("10i")[0].className = "btn btn-blue 10i";
    document.getElementsByClassName("10i")[0].innerText = "Otomatik Yay &Kapalı";
    if (autobow) {
        document.getElementsByClassName("10i")[0].className = "btn btn-red 10i";
        document.getElementsByClassName("10i")[0].innerText = "Otomatik Yay &Açık";
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

document.getElementsByClassName("11i2")[0].addEventListener('click', function() {
    window.startaito = !window.startaito;
    document.getElementsByClassName("11i2")[0].innerText = "Zaman Dondurucu &Kapalı";
    if (window.startaito) {
        window.sendAitoAlt();
        document.getElementsByClassName("11i2")[0].innerText = "Zaman Dondurucu &Açık";
    }
})
document.getElementsByClassName("13i")[0].addEventListener('click', function() {
    accept = !accept;
    document.getElementsByClassName("13i")[0].className = "btn btn-blue 13i";
    document.getElementsByClassName("13i")[0].innerText = "Herkesi Partiye Al &Kapalı";
    if (accept) {
        document.getElementsByClassName("13i")[0].className = "btn btn-red 13i";
        document.getElementsByClassName("13i")[0].innerText = "Herkesi Partiye Al &Açık";
    }
})
document.getElementsByClassName("14i")[0].addEventListener('click', function() {
    kick = !kick;
    document.getElementsByClassName("14i")[0].className = "btn btn-blue 14i";
    document.getElementsByClassName("14i")[0].innerText = "Herkesi Partiden At &Kapalı";
    if (kick) {
        document.getElementsByClassName("14i")[0].className = "btn btn-red 14i";
        document.getElementsByClassName("14i")[0].innerText = "Herkesi Partiden At &Açık";
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
document.getElementsByClassName("3i5")[0].addEventListener('click', function() {
    autohi = !autohi;
    document.getElementsByClassName("3i5")[0].className = "btn btn-blue 3i5";
    document.getElementsByClassName("3i5")[0].innerText = "Selam Gönderme &Kapalı";
    if (autohi) {
        document.getElementsByClassName("3i5")[0].className = "btn btn-red 3i5";
        document.getElementsByClassName("3i5")[0].innerText = "Selam Gönderme &Açık";
    }
})
document.getElementsByClassName("5i5")[0].addEventListener('click', function() {
    autorss = !autorss;
    document.getElementsByClassName("5i5")[0].className = "btn btn-blue 5i5";
    document.getElementsByClassName("5i5")[0].innerText = "Bilgi Gönderme &Kapalı";
    if (autorss) {
        document.getElementsByClassName("5i5")[0].className = "btn btn-red 5i5";
        document.getElementsByClassName("5i5")[0].innerText = "Bilgi Gönderme &Açık";
    }
})
document.getElementsByClassName("6i5")[0].addEventListener('click', function() {
    run = !run;
    document.getElementsByClassName("6i5")[0].className = "btn btn-blue 6i5";
    document.getElementsByClassName("6i5")[0].innerText = "Ani Hızlanma &Kapalı";
    if (run) {
        document.getElementsByClassName("6i5")[0].className = "btn btn-red 6i5";
        document.getElementsByClassName("6i5")[0].innerText = "Ani Hızlanma &Açık";
    }
})
document.getElementsByClassName("8i5")[0].addEventListener('click', function() {
    heal = !heal;
    document.getElementsByClassName("8i5")[0].className = "btn btn-green 8i5";
    document.getElementsByClassName("8i5")[0].innerText = "Can Doldurucu &Açık";
    if (heal) {
        document.getElementsByClassName("8i5")[0].className = "btn btn-red 8i5";
        document.getElementsByClassName("8i5")[0].innerText = "Can Doldurucu &Kapalı";
    }
})
document.getElementsByClassName("9i5")[0].addEventListener('click', function() {
    revive = !revive;
    document.getElementsByClassName("9i5")[0].className = "btn btn-green 9i5";
    document.getElementsByClassName("9i5")[0].innerText = "Pet Güç Arttırıcı &Açık";
    if (revive) {
        document.getElementsByClassName("9i5")[0].className = "btn btn-red 9i5";
        document.getElementsByClassName("9i5")[0].innerText = "Pet Güç Arttırıcı &Kapalı";
    }
})
document.getElementsByClassName("10i5")[0].addEventListener('click', function() {
    clearMsgs = !clearMsgs;
    document.getElementsByClassName("10i5")[0].className = "btn btn-blue 10i5";
    document.getElementsByClassName("10i5")[0].innerText = "Mesajları Kaldır &Kapalı";
    if (clearMsgs) {
        document.getElementsByClassName("10i5")[0].className = "btn btn-red 10i5";
        document.getElementsByClassName("10i5")[0].innerText = "Mesajları Kaldır &Açık";
    }
})
document.getElementsByClassName("13i5")[0].addEventListener('click', function() {
    kick1p = !kick1p;
    document.getElementsByClassName("13i5")[0].className = "btn btn-white 13i5";
    document.getElementsByClassName("13i5")[0].innerText = "Tüm Oyuncuları At &Kapalı";
    if (kick1p) {
        document.getElementsByClassName("13i5")[0].className = "btn btn-red 13i5";
        document.getElementsByClassName("13i5")[0].innerText = "Tüm Oyuncuları At &Açık";
    }
})
document.getElementsByClassName("12i2")[0].addEventListener('click', function() {
    window.shouldStartScript = !window.shouldStartScript;
    document.getElementsByClassName("12i2")[0].innerText = "4 Oyuncu Atağı &Kapalı";
    if (window.shouldStartScript) {
        document.getElementsByClassName("12i2")[0].innerText = "4 Oyuncu Atağı &Açık";
    }
})
document.getElementsByClassName("18i2")[0].addEventListener('click', function() {
    window.startaito2 = !window.startaito2;
    document.getElementsByClassName("18i2")[0].innerText = "Aktif Oyuncu Bulucu &Kapalı";
    if (window.startaito2) {
        window.sendAitoAlt2();
        document.getElementsByClassName("18i2")[0].innerText = "Aktif Oyuncu Bulucu &Açık";
    }
})
document.getElementsByClassName("25i2")[0].addEventListener('click', function() {
    if (window.playerX && window.playerY) {
        window.findPlayer = !window.findPlayer;
        document.getElementsByClassName("25i2")[0].innerText = "Pozisyonu Takip Et &Kapalı";
        if (window.findPlayer) {
            document.getElementsByClassName("25i2")[0].innerText = "Pozisyonu Takip Et &Açık";
        }
    } else {
        game.ui.components.PopupOverlay.showHint("Oyuncu Bulunamadı! Bulunduktan Sonra Tekrar Deneyebilirsiniz.");
    }
})
document.getElementsByClassName("13i2")[0].addEventListener('click', function() {
    window.startaito7 = !window.startaito7;
    LKeyWithTimeouts();
    document.getElementsByClassName("13i2")[0].innerText = "L Anaktarı &Kapalı";
    if (window.startaito7) {
        document.getElementsByClassName("13i2")[0].innerText = "L Anaktarı &Açık";
    }
})

document.getElementsByClassName("0i2")[0].addEventListener('click', function() {
    window.sendWs();
})
document.getElementsByClassName("1i2")[0].addEventListener('click', function() {
    setTimeout(() => {
        if (window.aim) {
            document.getElementsByClassName("1i2")[0].innerText = "Hedef Yeteneği &Kapalı";
        } else {
            document.getElementsByClassName("1i2")[0].innerText = "Hedef Yeteneği &Açık";
        }
    }, 100)
})
document.getElementsByClassName("2i2")[0].addEventListener('click', function() {
    setTimeout(() => {
        if (window.move) {
            document.getElementsByClassName("2i2")[0].innerText = "Takip Yeteneği &Kapalı";
        } else {
            document.getElementsByClassName("2i2")[0].innerText = "Takip Yeteneği &Açık";
        }
    }, 100)
})
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
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Üssü kaydetmek istediğinizden emin misiniz? İki kez kaydettiyseniz, kaydedilen ilk baz silinecektir.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Başarıyla kaydedildi!");
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
            game.ui.components.PopupOverlay.showHint("Başarıyla kaydedilen üs inşa edildi");
            var basecode = localStorage.RecordedBase1
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.DeleteRecordedbase = function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Kayıtlı temeli silmek istediğinizden emin misiniz?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Başarıyla kaydedilen baz silindi!");
        localStorage.RecordedBase1 = null;
    })
}
window.RecordBase2 = function(baseName) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Üssü kaydetmek istediğinizden emin misiniz? İki kez kaydettiyseniz, kaydedilen ilk baz silinecektir.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Başarıyla kaydedildi!");
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
            game.ui.components.PopupOverlay.showHint("Başarıyla kaydedilen üs inşa edildi");
            var basecode = localStorage.RecordedBase2
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.DeleteRecordedbase2 = function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Kayıtlı temeli silmek istediğinizden emin misiniz?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Başarıyla kaydedilen baz silindi!");
        localStorage.RecordedBase2 = null;
    })
}
window.RecordBase3 = function(baseName) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Üssü kaydetmek istediğinizden emin misiniz? İki kez kaydettiyseniz, kaydedilen ilk baz silinecektir.", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Başarıyla kaydedildi!");
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
            game.ui.components.PopupOverlay.showHint("Başarıyla kaydedilen üs inşa edildi!");
            var basecode = localStorage.RecordedBase3
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.DeleteRecordedbase3 = function() {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Kayıtlı temeli silmek istediğinizden emin misiniz?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Başarıyla kaydedilen baz silindi!");
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
            game.ui.components.PopupOverlay.showHint("Başarıyla kaydedilen üs inşa edildi");
            var basecode = document.getElementsByClassName("30i3")[0].value;
            basecode = new Function(basecode)
            return basecode()
        }
    }, 275)
    }
window.saveBase = () => {
    game.ui.components.PopupOverlay.showHint("Başarıyla kaydedildi");
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

window.autobuildtoggle = () => {
    autobuild = !autobuild;
    document.getElementsByClassName("21i3")[0].innerText = "Kaydedilmiş Kuleleri Otomatik Oluştur &Açık";
    if (autobuild) {
        document.getElementsByClassName("21i3")[0].innerText = "Kaydedilmiş Kuleleri Otomatik Oluştur &Kapalı";
    }
}
window.upgradealltoggle = () => {
    upgradeAll2 = !upgradeAll2;
    document.getElementsByClassName("26i3")[0].innerText = "Her Şeyi Yüksrlt &Açık";
    if (upgradeAll2) {
        document.getElementsByClassName("26i3")[0].innerText = "Her Şeyi Yüksrlt &Kapalı";
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
window.sendAitoAlt2 = () => {
    if (window.startaito2) {
        let ver = false;
        let player = game.ui.components.Leaderboard.leaderboardData[document.getElementsByClassName("16i2")[0].value - 1].name;
        let ws = new WebSocket(`ws://${Game.currentGame.options.servers[Game.currentGame.options.serverId].hostname}:8000`);
        ws.binaryType = "arraybuffer";
        ws.onclose = () => {
            ws.isclosed = true;
        }
        ws.onopen = () => {
            ws.network = new Game.currentGame.networkType();
            ws.network.sendEnterWorldAndDisplayName = (t) => {
                ws.name = t;
                ws.network.sendPacket(4, {
                    displayName: t
                });
            };
            ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
            ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
            ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
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
            if (ws.data.entities) {
                for (let i in ws.data.entities) {
                    if (ws.data.entities[i].name == player) {
                        window.startaito2 = false;
                        window.playerX = Math.round(ws.data.entities[i].position.x);
                        window.playerY = Math.round(ws.data.entities[i].position.y);
                        document.getElementsByClassName("16i2")[0].value = "(" + window.playerX + ", " + window.playerY + ")";
                        document.getElementsByClassName("18i2")[0].innerText = "Aktif Oyuncu Bulundu";
                        game.ui.components.PopupOverlay.showHint(`Successfully found the current player, {x: ${window.playerX}, y: ${window.playerY}};`);
                        console.log(ws.data.entities[i]);
                    }
                    if (ws.data.entities[i].name) { ver = true; };
                }
            }
            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;
            }
            if (ws.data.name == "Dead") {
                ws.network.sendInput({respawn: 1});
            }
            if (ver && !ws.isclosed) {
                ws.isclosed = true;
                setTimeout(() => {
                    ws.close();
                    window.sendAitoAlt2();
                }, 1500);
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
                ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey});
            }
            switch(ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
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
            ws.network.sendEnterWorldAndDisplayName = (t) => { ws.network.sendPacket(4, {displayName: t}); };
            ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
            ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
            ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
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
                ws.network.sendInput({respawn: 1});
            }
            if (ws.data.name == "Leaderboard") {
                ws.lb = ws.data;
                if (ws.psk) {
                    ws.network.sendRpc({name: "JoinPartyByShareKey", partyShareKey: game.ui.getPlayerPartyShareKey()});
                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Pause", tier: 1});
                    }
                }
            }
            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            }
            switch(ws.data.opcode) {
                case 4:
                    ws.onEnterWorld(ws.data);
                    break;
            }
        }
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
        ws.network.sendEnterWorldAndDisplayName = (t) => { ws.network.sendPacket(4, {displayName: t}); };
        ws.network.sendInput = (t) => { ws.network.sendPacket(3, t); };
        ws.network.sendRpc = (t) => { ws.network.sendPacket(9, t); };
        ws.network.sendPacket = (e, t) => { if (!ws.isclosed) { ws.send(ws.network.codec.encode(e, t)); } };
        ws.network.sendEnterWorldAndDisplayName(localStorage.name);
    }
    ws.onEnterWorld = () => {
        // useless
    }
    ws.onmessage = msg => {
        ws.data = ws.network.codec.decode(msg.data);
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
            document.getElementsByClassName("hud-respawn-btn")[0].addEventListener('click', function() {
                ws.network.sendRpc({respawn: 1});
            })
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
                    if (ws.inventory.Bow) {
                        ws.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: ws.inventory.Bow.tier})
                    } else {
                        ws.network.sendRpc({name: "BuyItem", itemName: "Bow", tier: 1})
                        ws.network.sendRpc({name: "EquipItem", itemName: "Bow", tier: 1})
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
                            ws.network.sendRpc({name: "SetPartyName", partyName: ws.cloneId + ""});
                        }, 1000);
                    }
                }
            }, 1750);
        }
        if (ws.data.name == "SetItem") {
            ws.inventory[ws.data.response.itemName] = ws.data.response;
            if (!ws.inventory[ws.data.response.itemName].stacks) {
                delete ws.inventory[ws.data.response.itemName];
            }
        }
        if (ws.data.name == "PartyApplicant") {
            ws.partyApplicant = ws.data.response;
            if (ws.partyApplicant.applicantUid == game.world.myUid) {
                ws.network.sendRpc({name: "PartyApplicantDecide", applicantUid: game.world.myUid, accepted: 1})
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
        if (ws.automove) {
            if (ws.playerTick) {
                if (ws.myPlayer.position.y-ws.playerTick.position.y > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-ws.playerTick.position.y), 2) + Math.pow((ws.myPlayer.position.x-ws.playerTick.position.x), 2)) < 100) {
                    ws.network.sendInput({down: 0})
                } else {
                    ws.network.sendInput({down: 1})
                }
                if (-ws.myPlayer.position.y+ws.playerTick.position.y > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-ws.playerTick.position.y), 2) + Math.pow((ws.myPlayer.position.x-ws.playerTick.position.x), 2)) < 100) {
                    ws.network.sendInput({up: 0})
                } else {
                    ws.network.sendInput({up: 1})
                }
                if (-ws.myPlayer.position.x+ws.playerTick.position.x > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-ws.playerTick.position.y), 2) + Math.pow((ws.myPlayer.position.x-ws.playerTick.position.x), 2)) < 100) {
                    ws.network.sendInput({left: 0})
                } else {
                    ws.network.sendInput({left: 1})
                }
                if (ws.myPlayer.position.x-ws.playerTick.position.x > 100 || Math.sqrt(Math.pow((ws.myPlayer.position.y-ws.playerTick.position.y), 2) + Math.pow((ws.myPlayer.position.x-ws.playerTick.position.x), 2)) < 100) {
                    ws.network.sendInput({right: 0})
                } else {
                    ws.network.sendInput({right: 1})
                }
            }
        }
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
                }, 7925);
            }, 75);
        }, 16000);
    } else {
        clearInterval(window.FKeyOn);
        window.FKeyOn = null;
    }
}
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
            case "Key*":
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

window.addEventListener("load", function(e) {
    var chat = $("hud-chat");
    var html = `<div class='GLB'>
                   <button style='opacity: 0; transition: opacity 0.15s ease-in-out;' class='GLBbtn'>Sunucuya Seslen</button>
                </div>`;
    chat.insertAdjacentHTML("afterend", html);
    var sendBtn = $("GLBbtn");
    sendBtn.addEventListener("click", function(e) {
        let msg = $("hud-chat-input").value;
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Global",
            message: msg
        });
    });
    var input = document.querySelectorAll(".hud-chat")[0];
    var observer = new MutationObserver(styleChangedCallback);

    function styleChangedCallback(mutations) {
        var newIndex = mutations[0].target.className;

        if (newIndex == "hud-chat is-focused") {
            sendBtn.style.opacity = 1;
        } else {
            sendBtn.style.opacity = 0;
        }
    }
    observer.observe(input, {
        attributes: true,
        attributeFilter: ["class"]
    });
});

let dimension = 1;

const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (3090 * dimension), canvasHeight / (1080 * dimension));
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
        dimension = Math.min(2.35, dimension + 0.51);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.11, dimension - 0.51);
        onWindowResize();
    }
}

(function() {
    'use strict';
})();

window.loadedIDS = function(){
    var returns = []
    Object.entries(Game.currentGame.world.entities).forEach((stuff => {
        if(stuff[1].targetTick.entityClass == "PlayerEntity" && stuff[1].targetTick.name !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.name){
            returns.push(stuff[1].targetTick.name +
                         " - Odun: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.wood +
                         ", Taş: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.stone +
                         ", Altın: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.gold)
        }
    }))
    return returns;
}
var i = setInterval(function(){
    document.querySelector('.hud-menu-icon').innerText = JSON.stringify(window.loadedIDS())
}, 100)

addEventListener('keydown', function(e){
    if(e.key == "-"){
        Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1});
        Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1})
        console.log('invisable')
    }
}) // Kurt

addEventListener('keydown', function(e){
    if(e.key == "+"){
        Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
    }
    if(e.key == "+"){
        Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
        console.log('invisable')
    }
})// Kurt

var el = document.getElementsByTagName('input');

for (var i = 0; i < el.length; i++) {
    var currentEl = el[i];
    currentEl.style.borderRadius = '1em'; // standard
    currentEl.style.MozBorderRadius = '1em'; // Mozilla
    currentEl.style.WebkitBorderRadius = '1em'; // WebKitww
    currentEl.style.color = "#ffffff";
    currentEl.style.border = "2px solid #00042e";
    currentEl.style.backgroundColor = "#080808";
}

var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
    Style1[i].style.borderRadius = '1em'; // standard
    Style1[i].style.MozBorderRadius = '1em'; // Mozilla
    Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
    Style1[i].style.color = "#ffffff";
    Style1[i].style.border = "2px solid #080808";
}

var el = document.getElementsByTagName('select, input');

for (var i = 0; i < el.length; i++) {
    var currentEl = el[i];
    currentEl.style.borderRadius = '1em'; // standard
    currentEl.style.MozBorderRadius = '1em'; // Mozilla
    currentEl.style.WebkitBorderRadius = '1em'; // WebKitww
    currentEl.style.color = "#ffffff";
    currentEl.style.border = "2px solid #00042e";
    currentEl.style.backgroundColor = "#080808";
}

var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-menu-icon, .hud-spell-icon, .hud-chat-messages, .hud-health-bar-inner, .hud-toolbar-building, .hud-ticker-bar, .hud-toolbar-item, .hud-shield-bar-inner, .custom_input');
for (var i = 0; i < Style1.length; i++) {
    Style1[i].style.borderRadius = '1em'; // standard
    Style1[i].style.MozBorderRadius = '1em'; // Mozilla
    Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
    Style1[i].style.color = "#ffffff";
    Style1[i].style.border = "2px solid #080808";
}

var Style1 = document.querySelectorAll('.hud-intro-corner-top-left');
for (var i = 0; i < Style1.length; i++) {
    Style1[i].style.borderRadius = '1em'; // standard
    Style1[i].style.MozBorderRadius = '1em'; // Mozilla
    Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
    Style1[i].style.color = "#ffffff";
}

var css = '.hud-menu-settings { background: url(\'https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-shop { background: url(\'https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-intro::after { background: url(\'https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-party { background: url(\'https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-intro-footer { background: url(\'https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = '.hud-menu-scripts { background: url(\'https://i.pinimg.com/originals/de/e3/b6/dee3b69d434789662bdf3f54ed3a8a7d.gif\') }';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

(function() {
    var js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.all.min.js";
    document.getElementsByTagName('head')[0].appendChild(js);
    var css = document.createElement('script');
    css.type = 'text/css';
    css.src = "https://cdn.jsdelivr.net/npm/sweetalert2@7.26.10/dist/sweetalert2.min.css";
    document.getElementsByTagName('head')[0].appendChild(css);
    var intervalId = setInterval(function() {
        if(Game.currentGame.world.inWorld === true) {
            clearInterval(intervalId);
            var my_elem = document.getElementsByClassName('hud-party-actions')[0];
            var div = document.createElement('div');
            var btncustom = "<style type=\"text/css\">.custom_input { width: 100px; height: 35px; font-size: 15px; padding: 5px 10px; color: #555; border-radius: 5px; border: 1px solid #bbb; outline: none;}a.button1{ display:inline-block; padding:0.35em 1.2em; border:0.1em solid #FFFFFF; margin:0 0.3em 0.3em 0; border-radius:0.12em; box-sizing: border-box; text-decoration:none; font-family:'Roboto',sans-serif; font-weight:300; color:#FFFFFF; text-align:center; transition: all 0.2s;}a.button1:hover{ color:#000000; background-color:#FFFFFF;}@media all and (max-width:30em){ a.button1{ display:block; margin:0.4em auto; }}</style>";
            document.body.insertAdjacentHTML("beforeend", btncustom);
            div.innerHTML = "<div style=\"display: inline-block; margin-left: 15px; margin-right: 10px;\"> Parti İsim: </div><a class=\"button1\">Aktif Et</a><a class=\"button1\" style=\"margin-left:10px\">Kapat</a><small style=\"margin-left: 5px; margin-right: 5px;\"> Hız: </small><input class=\"custom_input\" type=\"number\" value=\"100\" min=\"0\" max=\"10000\" />";
            my_elem.parentNode.insertBefore(div, my_elem);
            document.getElementById('hud-menu-party').style.height = "480px";
            let maxlength = setInterval(function() {
                if(document.getElementsByClassName('swal2-input')[0]) {
                    clearInterval(maxlength);
                    var i;
                    for(i = 0; i < document.getElementsByClassName('swal2-input').length; i++) {
                        document.getElementsByClassName('swal2-input')[i].maxLength = 49;
                    }
                }
            }, 100);
            var start = document.getElementsByClassName('button1')[0];
            start.style.marginBottom = "20px";
            var id = null;
            let interval = setInterval(function() {
                if(start) {
                    clearInterval(interval);
                    var speed = document.querySelector('input[class="custom_input"]');
                    start.onclick = function() {
                        swal.mixin({
                            input: 'text',
                            confirmButtonText: 'Devam',
                            showİşlemiSonlandırButton: true,
                            progressSteps: ['1', '2', '3'],
                        }).queue([{
                            title: '• Kurt & Java',
                            text: 'Parti İsmi Tekrarlayıcı 1'
                        }, {
                            title: '• Kurt & Java',
                            text: 'Parti İsmi Tekrarlayıcı 2'
                        }, {
                            title: '• Kurt & Java',
                            text: 'Parti İsmi Tekrarlayıcı 3'
                        }]).then((result) => {
                            if(result.value) {
                                swal({
                                    title: 'Başardın',
                                    html: 'Parti İsimlerin <pre><code>' + JSON.stringify(result.value) + '</code></pre>',
                                    confirmButtonText: 'Güzel',
                                    onClose: () => {
                                        function countInArray(array, what) {
                                            var count = 0;
                                            for(var i = 0; i < array.length; i++) {
                                                if(array[i] === what) {
                                                    count++;
                                                }
                                            }
                                            return count;
                                        }
                                        var i;
                                        for(i = 0; i < result.value.length; i++) {
                                            if(result.value[i] == "") {
                                                var parties = countInArray(result.value, "");
                                                if(parties == 0) {
                                                    result.value.length = 3;
                                                } else if(parties == 1) {
                                                    result.value.length = 2;
                                                } else if(parties == 2) {
                                                    result.value.length = 1;
                                                } else if(parties == 3) {
                                                    result.value.length = 0;
                                                    result.value == undefined;
                                                    swal("Hata!", "Parti İsmin Girilemedi!", "error")
                                                }
                                            }
                                        }
                                        document.getElementsByClassName('hud-menu-icon')[1].click();
                                        var partyTag = document.getElementsByClassName('hud-party-tag')[0];
                                        var space = new Event("keyup");
                                        var delay;
                                        id = setInterval(function() {
                                            partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                            space.keyCode = 32;
                                            partyTag.dispatchEvent(space);
                                        }, delay);
                                        speed.addEventListener("input", function() {
                                            clearInterval(id);
                                            delay = speed.value;
                                            id = setInterval(function() {
                                                partyTag.value = result.value[Math.floor(Math.random() * result.value.length)];
                                                space.keyCode = 32;
                                                partyTag.dispatchEvent(space);
                                            }, delay)
                                        });
                                        var stop = document.getElementsByClassName('button1')[1];
                                        stop.onclick = function() {
                                            result.value = null;
                                            clearInterval(id);
                                            id = null;
                                            var i;
                                            for(i = 0; i < 10000; i++) {
                                                clearInterval(i);
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }, 1000)
            }
    }, 250)
    })();

var IntroGuide = '';

IntroGuide += "<center><h3>#Yapımcı</h3>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 90%;\" id=\"cbc1\">Kurt</button>";
IntroGuide += "<center><h3>• Yaratıcı Nickler</h3>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name1();\">I</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name2();\">II</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name3();\">III</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name4();\">IV</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name5();\">V</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name6();\">VI</button>";
IntroGuide += "<br>";
IntroGuide += "<center><h3>• Şekilli Taglar</h3>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name7();\">I</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name8();\">II</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name9();\">III</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name10();\">IV</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name11();\">V</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-blue\" style=\"width: 45%;\" onclick=\"name12();\">VI</button>";
IntroGuide += "<br>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

let x = 'Biz Buralara Asansörle Gelmedik Aslan Parçaları..';

alert(x);
Game.currentGame.ui.getComponent("Chat").onMessageReceived({

    displayName: "Kurt & Java",

    message: "Hoş Geldin Burası Senin Dünyan.",

    channel: "Local",

})


Game.currentGame.ui.getComponent("Chat").onMessageReceived({

    displayName: "Kurt & Java",

    message: "Kalkana Tıklayıp Hilemizin Tadını Çıkar!",

    channel: "Local",

})

//stylecodes();

window.name1 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = 'Tesla';
};
window.name2 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = 'Saye';
};
window.name3 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = 'Lewis';
};
window.name4 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = 'Rew Kont';
};
window.name5 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = 'Outlays';
};
window.name6 = function() {

    document.getElementsByClassName('hud-intro-name')[0].value = 'Ryan Wolf';
};
window.name7 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = '⚚';
};
window.name8 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = '★';
};
window.name9 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = '☨';
};
window.name10 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = '∞';
};
window.name11 = function() {
    document.getElementsByClassName('hud-intro-name')[0].value = '†';
};
window.name12 = function() {

    document.getElementsByClassName('hud-intro-name')[0].value = '♆';
};

//document.getElementsByClassName("hud-settings-grid")[0].innerHTML = settingsHTML;