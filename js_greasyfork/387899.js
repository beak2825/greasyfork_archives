// ==UserScript==
// @name         e3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387899/e3.user.js
// @updateURL https://update.greasyfork.org/scripts/387899/e3.meta.js
// ==/UserScript==

Game.currentGame.network.addEnterWorldHandler(() => {
const placeBuilding = (x, y, building, yaw) => {
        Game.currentGame.network.sendRpc({
                name: "MakeBuilding",
                x: x,
                y: y,
                type: building,
                yaw: yaw
        })
    upgradeBombs()
    sellBombs()
},
        sellBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })

                        }
                }
        },
      sellSlowTraps = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "SlowTrap") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },

        upgradeStash = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldStash") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeSlowTraps = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "SlowTrap") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
      SellAll = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door", "GoldMine", "Wall", "Harvester", "SlowTrap" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeGoldMines = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "GoldMine") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        upgradeBase = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door", "PetCARL", "PetMiner" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        },
        state = {
                "stopped": true
        },
        start = () => state.stopped = false,
        stop = () => state.stopped = true,
        grid = document.querySelector(".hud-party-server")

grid.innerHTML += `<button class="KodeLlmsaBgcZ">Enable gold generator</button>`

Array.prototype.slice.call(grid.childNodes)
        .find(c => c.classList && c.classList.value == "KodeLlmsaBgcZ")
                .addEventListener("click", e => {
        switch(e.target.innerText) {
                case "Enable gold generator":
                        e.target.innerText = "Disable gold generator"
                        start()
                        break
                case "Disable gold generator":
                        e.target.innerText = "Enable gold generator"
                        stop()
                        break
        }
})


Game.currentGame.network.addRpcHandler("LocalBuilding", e => {
        if(e[0].type === "Harvester" && !e[0].dead && e[0].tier === 1) {
                const intervalId = setInterval(() => {
                        if(state.stopped) return
                 placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                  placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                  placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                    placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                    placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                                     placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                  placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                  placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                    placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                    placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                  placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                  placeBuilding(e[0].x + 192, e[0].y + -1000000000, "ArrowTower", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                    placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                    placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + -1000000000, "Door", 0)
                placeBuilding(e[0].x + 0, e[0].y + 0, "BombTower", 0)
                }, 800)
                const intervalIdr = setInterval(() => {
                        if(state.stopped) return
                  upgradeBombs()
                }, 35)
                Game.currentGame.network.addEntityUpdateHandler(e => {
                        if(state.stopped) return
                        const myUid = Game.currentGame.world.myUid
                        if(e.entities[myUid].gold >= 5200 && e.entities[myUid].gold <= 10199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 5000)
                        } else if(e.entities[myUid].gold >= 10200 && e.entities[myUid].gold <= 16199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 3000)
                        } else if(e.entities[myUid].gold >= 16200 && e.entities[myUid].gold <= 20199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 1000)
                        } else if(e.entities[myUid].gold >= 20200 && e.entities[myUid].gold <= 32199) {
                                upgradeStash()
                                upgradeGoldMines()

                                setTimeout(upgradeBase, 500)
                        } else if(e.entities[myUid].gold >= 32200 && e.entities[myUid].gold <= 100199) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        } else if(e.entities[myUid].gold >= 100200 && e.entities[myUid].gold <= 400199) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        } else if(e.entities[myUid].gold >= 400200 && e.entities[myUid].gold <= 1000000) {
                                upgradeStash()
                                upgradeGoldMines()

                                upgradeBase()
                        }
                 })
           }
     })
})
//
    Game.currentGame.network.addEnterWorldHandler(()=>{
Game.currentGame.network.emitter.removeListener("PACKET_RPC",Game.currentGame.network.emitter._events.PACKET_RPC[1]),
Game.currentGame.network.sendRpc({
name:"SendChatMessage"
,channel:"Msg",
message:atob("U2NyaXB0IG1hZGUgYnkgRGVtb3N0YW5pcyBodHRwczovL2Rpc2NvcmQuZ2cvQ2NBZ2FiVQ==")
});
const onMessageReceived=e=>{
const a=Game.currentGame.ui.getComponent("Chat"),
s=e.displayName.replace(/<(?:.|\n)*?>/gm, ''),
t=e.message.replace(/<(?:.|\n)*?>/gm, ''),
m=a.ui.createElement(`<div class="hud-chat-message"><strong>${s}</strong>: ${t}</div>`);
a.messagesElem.appendChild(m);
a.messagesElem.scrollTop=a.messagesElem.scrollHeight};
Game.currentGame.network.addRpcHandler("ReceiveChatMessage",onMessageReceived);})
    //

const $ = function(className) {
    var elem = document.getElementsByClassName(className);
    if (elem.length > 1) return elem;
    return elem[0];
};
window.addEventListener("load", function(e) {
    var chat = $("hud-chat");
    var html = `<div class='GLB'>
                   <button style='opacity: 0; transition: opacity 0.15s ease-in-out;' class='GLBbtn'>Send it as global message...</button>
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
//
// INTRO STYLE CODES INNERHTML
var IntroGuide = '';

IntroGuide += "<center><h3>Zombs.io long nicknames</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name1();\">NAME [1]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name2();\">NAME [2]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name3();\">NAME [3]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name4();\">NAME [4]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name5();\">NAME [5]</button>";
IntroGuide += "&nbsp;";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 45%;\" onclick=\"name6();\">NAME [6]</button>";
IntroGuide += "<br><br>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 90%;\" onclick=\"name0();\">HIDDEN NICKNAME</button>";
IntroGuide += "<br>";
IntroGuide += "<center><h3>Zombs.io border color</h3>";
IntroGuide += "<button class=\"btn btn-green\" style=\"width: 90%;\" id=\"cbc1\">BORDER COLOR</button>";

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = IntroGuide;

// LONG NINKNAMES
window.name1 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'Ƭℏɇ Ƭᵲơɬɬɇrᵴヅ';
};
window.name2 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'ƤⱢꜺҰ€र ✖';
};
window.name3 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'ɎØƲ ƬƦɅƧꜧ ツ';
};
window.name4 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = '\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC\u0BCC';
};
window.name5 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'I&#10L&#10O&#10V&#10E&#10U';
};
window.name6 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'COMING SOON!';
};
window.name0 = function() {
  document.getElementsByClassName('hud-intro-name')[0].value = 'This has been removed';
};
//
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

var EXTREME = {}

var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
changeHeight.innerHTML = "@keyframes hud-popup-message {0% { max-height: 0; margin-bottom: 0; opacity: 0; }100% { max-height: 1000px; margin-bottom: 10px; opacity: 1; }} .hud-map .hud-map-spot {display: none;position: absolute;width: 4px;height: 4px;margin: -2px 0 0 -2px;background: #ff5b5b;border-radius: 50%;z-index: 2;} .hud-chat .hud-chat-message { -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text; }"
document.body.appendChild(changeHeight)
var widget = '<iframe src="https://mope.io/;theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" style="width: 300px;height: 320px;"></iframe>'
$("hud-intro-left").innerHTML = widget

var PopupOverlay = Game.currentGame.ui.getComponent("PopupOverlay")

var input = $("hud-chat-input")
var pets = $("hud-shop-actions-equip")

function clearChat() {
    input.value = null
}

EXTREME.GetGoldStash = function() {
    var entities = Game.currentGame.ui.buildings
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        var obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
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

EXTREME.BuildBryanSmithBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'BombTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
        }
    }, 250)
}

EXTREME.BuildThingBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x, stashPosition.y + 96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 144, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 336, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 192, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x, stashPosition.y + 288, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 432, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x, stashPosition.y + 384, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 528, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 480, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 288, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 624, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 192, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 720, stashPosition.y + 192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x, stashPosition.y + 480, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x, stashPosition.y + 576, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 720, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 672, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 672, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 624, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 528, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 576, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 288, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 576, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 768, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 384, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 480, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 384, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 456, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 696, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 744, "Door", 0)
        }
    }, 250)
}

EXTREME.RecordBase = function(baseName) {
    var base = ""
    var stash = EXTREME.GetGoldStash();
    if (stash == undefined) {
        return
    }
    var stashPosition = {
        x: stash.x,
        y: stash.y
    }
    var buildings = Game.currentGame.ui.buildings;
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }

        var obj = buildings[uid]
        var x = Game.currentGame.world.entities[obj.uid].fromTick.position.x - stashPosition.x
        var y = Game.currentGame.world.entities[obj.uid].fromTick.position.y - stashPosition.y
        base += "EXTREME.PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + Game.currentGame.world.entities[obj.uid].fromTick.model + "', " + Game.currentGame.world.entities[obj.uid].fromTick.yaw + ");"
    }
    localStorage.setItem(baseNaame, base)
}


var stash
var stashPosition
EXTREME.buildRecordedBase = function(myBaseName) {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            var basecode = localStorage.getItem(myBaseName)
            basecode = new Function(basecode)
            return basecode()
        }
    }, 250)
}

EXTREME.DeleteRecordedbase = function(mybasename) {
    if (localStorage.getItem(mybasename)) {
        PopupOverlay.showHint(EXTREME.popups.popupDeletedRecordedBase.text, EXTREME.popups.popupDeletedRecordedBase.time)
        localStorage.removeItem(mybasename)
    } else {
        PopupOverlay.showHint(EXTREME.popups.popupUnknownbase.text, EXTREME.popups.popupUnknownbase.time)
    }
}

EXTREME.commands = [
    "/1",
    "/2",
    "/3",
    "/4",
    "/5",
    "/6"
]

EXTREME.popups = {
    popupBuildBase: {
        text: "Successfully built ",
        secondtext: " base!",
        time: 4000
    },
    popupUnknownbase: {
        text: "Invalid base name",
        time: 4000
    },
    popupWaitingForGoldStash: {
        text: "Waiting for GoldStash...",
        time: 4000
    },
    popupBaseAlreadySaved: {
        text: "You already have saved a base with this name!",
        time: 4000
    },
    popupBaseRecorded: {
        text: "Successfully recorded base!",
        time: 4000
    },
    popupDeleteRecordedBase: {
        text: "Are you sure to want to delete your recorded base?",
        time: 10000,
        onaccept: function() {
            EXTREME.DeleteRecordedbase(mybasename)
        }
    },
    popupDeletedRecordedBase: {
        text: "Successfully deleted recorded base.",
        time: 4000
    },
    popupRecordedBases: {
        text: "Recorded bases:",
        time: 20000
    },
    popupNoBaseRecorded: {
        text: "You didn't record any base!",
        time: 4000
    },
    popupCommands: {
        text: "Here are the commands: ",
        time: 10000
    },
    popupBadCommand: {
        text: "This command doesn't exist.",
        time: 2000
    }
}

EXTREME.sendBotMessage = function(msg) {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "[BOT]",
        message: msg
    })
}

EXTREME.bases = [
    "2",
    "1"
]


function CheckCommand(e) {
    switch (e.which) {
        case 13:
            if (!(EXTREME.commands.indexOf(input.value) > -1)) {
                PopupOverlay.showHint(EXTREME.popups.popupBadCommand.text, EXTREME.popups.popupBadCommand.time)
                clearChat()
            }
    }
    document.removeEventListener("keydown", CheckCommand)
}

function AutoBuildBase(e) {
    switch (e.which) {
        case 13:
            var base = input.value.toLowerCase().substring(0, EXTREME.commands[0].length)
            base = input.value.toLowerCase().replace(base, "")
            base = base.trim()
            var waitingForGoldStash = setInterval(function() {
                var stash = EXTREME.GetGoldStash();
                if (stash == undefined) {
                    PopupOverlay.showHint(EXTREME.popups.popupWaitingForGoldStash.text, EXTREME.popups.popupWaitingForGoldStash.time)
                    return
                } else {
                    clearInterval(waitingForGoldStash)
                    if (base === EXTREME.bases[0]) {
                        EXTREME.BuildThingBase()
                        PopupOverlay.showHint(EXTREME.popups.popupBuildBase.text + EXTREME.bases[0] + EXTREME.popups.popupBuildBase.secondtext, EXTREME.popups.popupBuildBase.time)
                    } else if (base === EXTREME.bases[1]) {
                        EXTREME.BuildBryanSmithBase()
                        PopupOverlay.showHint(EXTREME.popups.popupBuildBase.text + EXTREME.bases[1] + EXTREME.popups.popupBuildBase.secondtext, EXTREME.popups.popupBuildBase.time)
                    } else {
                        PopupOverlay.showHint(EXTREME.popups.popupUnknownbase.text, EXTREME.popups.popupUnknownbase.time)
                    }
                }
            }, 500)
            clearChat()
            document.removeEventListener("keydown", AutoBuildBase)
    }
}

function RecordCustomBase(e) {
    switch (e.which) {
        case 13:
            var baseName = input.value.toLowerCase().substring(0, EXTREME.commands[1].length)
            baseName = input.value.toLowerCase().replace(baseName, "")
            baseName = baseName.trim()
            if (localStorage.getItem(baseName)) {
                clearChat()
                PopupOverlay.showHint(EXTREME.popups.popupBaseAlreadySaved.text, EXTREME.popups.popupBaseAlreadySaved.time)
            } else {
                clearChat()
                PopupOverlay.showHint(EXTREME.popups.popupBaseRecorded.text, EXTREME.popups.popupBaseRecorded.time)
                EXTREME.RecordBase(baseName)
            }
            document.removeEventListener("keydown", RecordCustomBase)
    }
}

function BuildCustomBase(e) {
    switch (e.which) {
        case 13:
            var nameOfBase = input.value.toLowerCase().substring(0, EXTREME.commands[2].length)
            nameOfBase = input.value.toLowerCase().replace(nameOfBase, "")
            nameOfBase = nameOfBase.trim()
            clearChat()
            if (localStorage.getItem(nameOfBase)) {
                PopupOverlay.showHint(EXTREME.popups.popupBuildBase.text + nameOfBase + EXTREME.popups.popupBuildBase.secondtext, EXTREME.popups.popupBuildBase.time)
                EXTREME.buildRecordedBase(nameOfBase)
            } else {
                PopupOverlay.showHint(EXTREME.popups.popupUnknownbase.text, EXTREME.popups.popupUnknownbase.time)
            }
            document.removeEventListener("keydown", BuildCustomBase)
    }
}

var mybasename

function DeleteRecordedbase(e) {
    switch (e.which) {
        case 13:
            mybasename = input.value.toLowerCase().substring(0, EXTREME.commands[3].length)
            mybasename = input.value.toLowerCase().replace(mybasename, "")
            mybasename = mybasename.trim()
            PopupOverlay.showConfirmation(EXTREME.popups.popupDeleteRecordedBase.text, EXTREME.popups.popupDeleteRecordedBase.time, EXTREME.popups.popupDeleteRecordedBase.onaccept)
            clearChat()
            document.removeEventListener("keydown", DeleteRecordedbase)
    }
}

function getRecordedBases(e) {
    switch (e.which) {
        case 13:
            var value = Object.keys(localStorage).filter(function (x) {
                return localStorage.getItem(x).startsWith('EXTREME');
            })
            if (value.length === 0) {
                    PopupOverlay.showHint(EXTREME.popups.popupNoBaseRecorded.text, EXTREME.popups.popupNoBaseRecorded.time)
                } else {
                    PopupOverlay.showHint(EXTREME.popups.popupRecordedBases.text + "<br>" + value, EXTREME.popups.popupRecordedBases.time)
                }
            clearChat()
            document.removeEventListener("keydown", getRecordedBases)
    }
}

function getCommands(e) {
    switch (e.which) {
        case 13:
            clearChat()
            var commands = JSON.stringify(EXTREME.commands)
            commands = JSON.parse(commands)
            for(var i = 0; i < EXTREME.commands.length; i++) {
                commands[i] = commands[i].replace(/^/,' ');
            }
            PopupOverlay.showHint(EXTREME.popups.popupCommands.text + commands, EXTREME.popups.popupCommands.time)
            document.removeEventListener("keydown", getCommands)
    }
}

input.addEventListener("input", function() {
    if (input.value.toLowerCase().indexOf(EXTREME.commands[0]) >= 0) {
        document.addEventListener("keydown", AutoBuildBase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[1]) >= 0) {
        document.addEventListener("keydown", RecordCustomBase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[2]) >= 0) {
        document.addEventListener("keydown", BuildCustomBase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[3]) >= 0) {
        document.addEventListener("keydown", DeleteRecordedbase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[4]) >= 0) {
        document.addEventListener("keydown", getRecordedBases)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[5]) >= 0) {
        document.addEventListener("keydown", getCommands)
    } else if (input.value.startsWith("/")) {
        document.addEventListener("keydown", CheckCommand)
    }
})
//
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-evolve");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 950);
}, 950);
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-revive");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 950);
}, 950);
//
var weapons = null;

function keyDown6(e) {
    switch (e.keyCode) {
        case 71:
            if (weapons == null) {
                weapons = setInterval(function () {
                    document.getElementsByClassName("hud-shop-item")[0].click();
                    document.getElementsByClassName("hud-shop-item")[1].click();
                    document.getElementsByClassName("hud-shop-item")[2].click();
                    document.getElementsByClassName("hud-shop-item")[3].click();

                });
            } else {
                clearInterval(weapons);
                weapons = null;
            }
            break;
    }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDown6);
    } else {
        window.addEventListener("keydown", keyDown6);
    }
}, 0);
//
function keyDown2(e) {
  switch (e.keyCode) {
    case 86:
      speedrun();
      speedrun2();
      break;
    case 189:
      spampartys();
      spampartys2();
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDown2);
    } else {
        window.addEventListener("keydown", keyDown2);
    }
}, 0);

// REMOVE ADS
document.querySelectorAll('.ad-unit').forEach(function(a) {
  a.remove();
});

// STYLE CODES
setInterval(() => {
  document.getElementsByClassName('hud-party-tag')[0].setAttribute('maxlength', 49);
  document.getElementsByClassName('hud-intro-name')[0].setAttribute('maxlength', 29);
  document.getElementsByClassName("hud-party-joining")[0].remove();
  document.getElementsByClassName("hud-respawn-share")[0].remove();
  document.getElementsByClassName("hud-intro-footer")[0].remove();
},1000)


// SPEED RUN WITH PET
var button9 = document.getElementById("rwp");
button9.addEventListener("click", speedrun);
button9.addEventListener("click", speedrun2);

var petrun = null;

function speedrun() {
  clearInterval(petrun);
  if (petrun !== null) {
    petrun = null;
  } else {
    petrun = setInterval(function() {
      equip = document.getElementsByClassName('hud-shop-actions-equip');
      for (var i = 0; i < equip.length; i++) {
        var pets = equip[i];
        pets.click();
      }
    }, 0); // SPEED FOR RUN
  }
}

function speedrun2() {
  var change5 = document.getElementById("rwp");
  if (change5.innerHTML == "SPEED RUN OFF") {
    change5.innerHTML = "SPEED RUN ON";
  } else {
    change5.innerHTML = "SPEED RUN OFF";
  }
}

// SPAM ALL OPEN PARTYS
var button10 = document.getElementById("sap");
button10.addEventListener("click", spampartys);
button10.addEventListener("click", spampartys2);

var partyspam = null;

function spampartys() {
  clearInterval(partyspam);
  if (partyspam !== null) {
    partyspam = null;
  } else {
    partyspam = setInterval(function() {
      partys = document.getElementsByClassName('hud-party-link');
      for (var i = 0; i < partys.length; i++) {
        var link = partys[i];
        link.click();
      }
      confirm = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
      for (var i2 = 0; i2 < confirm.length; i2++) {
        var accept = confirm[i2];
        accept.click();
      }
    }, 72); // SPEED FOR PARTY SPAM
  }
}

function spampartys2() {
  var change6 = document.getElementById("sap");
  var change7 = document.getElementsByClassName("newpartydiv")[0];
  if (change6.innerHTML == "SPAM PARTYS OFF") {
    change6.innerHTML = "SPAM PARTYS ON";
    change7.innerHTML = "SPAM PARTYS ON";
  } else {
    change6.innerHTML = "SPAM PARTYS OFF";
    change7.innerHTML = "SPAM PARTYS OFF";
  }
}
//
(function() {
  heal = document.getElementsByClassName('hud-shop-item')[10];
  petHeal = document.getElementsByClassName('hud-shop-item')[11];
  useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
  usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
  healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
  up = new Event('mouseup');
  healLevel = 97;

  HEAL = function() {
    heal.attributes.class.value = 'hud-shop-item';
    petHeal.attributes.class.value = 'hud-shop-item';
    useHeal.dispatchEvent(up);
    usePetHeal.dispatchEvent(up);
    heal.click();
    petHeal.click();
  };

  script = function(e) {
    if (e.keyCode == 82) {
      HEAL();
    }
  };
  document.addEventListener('keydown', function(e) {
    script(e);
  });
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      if (parseInt(mutations[0].target.style.width) < healLevel) {
        HEAL();
      }
    });
  });
  observer.observe(healthBar, {
    attributes: true,
    attributeFilter: ['style']
  });
})();
//
function keyDown(e) {
  switch (e.keyCode) {
      case 88:
      startUPP();
      stopUPP();
      break;
      case 45:
      SellAll();
      break;
      case 46:
      SellStash();
      break;
      case 90:
      startbow()
      stopbow()
      break;
      case 219:
          Leaveon();
          break;
      case 85:
          startSS();
          stopSS();
          break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDown);
    } else {
        window.addEventListener("keydown", keyDown);
    }
}, 0);
window.SellStash = function() {
    var entities = Game.currentGame.world.entities;
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) continue;

        var obj = entities[uid];
        if (obj.fromTick.model == "GoldStash") {
            Game.currentGame.network.sendRpc({
                name: "DeleteBuilding",
                uid: obj.fromTick.uid
            })
        }
    }
}
window.Leaveon = function() {
    Game.currentGame.network.sendRpc({ "name": "LeaveParty" })
}
function Accepton() {
   let confirm = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
      for (var i = 0; i < confirm.length; i++) {
        var accept = confirm[i];
        accept.click();
      }
}
function OpenPartyon() {
document.getElementsByClassName("hud-party-visibility is-private")[0].click();
}
function SpamPartyson() {
let spam = document.getElementsByClassName('hud-party-link');
      for (var i = 0; i < spam.length; i++) {
        var spampartys = spam[i];
        spampartys.click();
      }
}
window.sellWalls = function() {
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
}

var Settings = '';
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="SellStash();">Sell Stash!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="sellWalls();">Sell Walls!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="Leaveon();">Leave Party!</button>';
Settings += '<button id="SSL" class="btn btn-red" style="width: 50%; height: 50px;">Turn SELL ALL On</button>';
Settings += '<button id="UPP" class="btn btn-red" style="width: 50%; height: 50px;">Turn UPGRADE ALL On</button>';
Settings += '<button id="AHRC" class="btn btn-red" style="width: 50%; height: 50px;">Turn AHRC On</button>';
Settings += '<button id="bow" class="btn btn-red" style="width: 50%; height: 50px;">Turn Autobow On</button>';
Settings += '<button id="Lve" class="btn btn-red" style="width: 50%; height: 50px;">Enable L Key</button>';
Settings += '<button id="Spm" class="btn btn-red" style="width: 50%; height: 50px;">Enable Alt Spam</button>';
// SETTINGS FEATURES INNERHTML
Settings += "<label>";
Settings += "<span>zombs.io script features</span>";
Settings += "<ul class=\"hud-settings-controls\">";
Settings += "<li>( SELL ALL KEY ' )</li>";
Settings += "<li>( UPGRADE EVERYTHING KEY X )</li>";
Settings += "<li>( AHRC KEY C )</li>";
Settings += "<li>( AUTO BOW KEY Z )</li>";
Settings += "</ul></label></div>";

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;
var button100 = document.getElementById("Lve");
button100.addEventListener("click", startLeave);
button100.addEventListener("click", stopLeave);
var Leave = null;
function startLeave() {
clearInterval(Leave);
  if (Leave !== null) {
    Leave = null;
  } else {

              Leave = setInterval(function() {
                  Leaveon()
                  Accepton()
                  OpenPartyon()
              },0)
  }
    }




          function stopLeave() {
  var trade = document.getElementById("Lve");
  if (trade.innerHTML == "Enable L Key") {
    trade.innerHTML = "Disable L Key";
  } else {
    trade.innerHTML = "Enable L Key";
  }
}
//
var button15 = document.getElementById("Spm");
button15.addEventListener("click", startspam2);
button15.addEventListener("click", stopspam2);
var spam2 = null;
function startspam2() {
clearInterval(spam2);
  if (spam2 !== null) {
    spam2 = null;
  } else {

              spam2 = setInterval(() => {
                  SpamPartyson()
                  Accepton()
}, 68)
           }
     }

          function stopspam2() {
  var trade = document.getElementById("Spm");
  if (trade.innerHTML == "Enable Alt Spam") {
    trade.innerHTML = "Disable Alt Spam";
  } else {
    trade.innerHTML = "Enable Alt Spam";
  }
}
//AutoBow
var button25 = document.getElementById("bow");
button25.addEventListener("click", startbow);
button25.addEventListener("click", stopbow);
var bow = null;
function startbow() {
clearInterval(bow);
  if (bow !== null) {
    bow = null;
  } else {
          if(Game.currentGame.ui.inventory.Bow) {
              Game.currentGame.network.sendRpc({
                        name: "EquipItem",
                        itemName: "Bow",
                        tier: Game.currentGame.ui.inventory.Bow.tier
                  })
              bow = setInterval(function() {
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
}
          function stopbow() {
  var trade = document.getElementById("bow");
  if (trade.innerHTML == "Turn Autobow On") {
    trade.innerHTML = "Turn Autobow Off";
  } else {
    trade.innerHTML = "Turn Autobow On";
  }
}

window.SellAll = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

window.UpgradeAll = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

    window.UpgradeStash = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

window.Refuel = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                let e = Game.currentGame.world.getEntityByUid(obj.fromTick.uid).getTargetTick();
                let i = Math.floor(e.depositMax);
                Game.currentGame.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: obj.fromTick.uid,
                    deposit: i
                });
            }
        }
    }

    window.Collect = function() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model == "Harvester") {
                Game.currentGame.network.sendRpc({
                    name: "CollectHarvester",
                    uid: obj.fromTick.uid
                });
            }
        }
    }

//
var button22 = document.getElementById("AHRC");
button22.addEventListener("click", startAHRC);
button22.addEventListener("click", stopAHRC);
var AHRC = null;
function startAHRC() {
clearInterval(AHRC);
  if (AHRC !== null) {
    AHRC = null;
  } else {

              AHRC = setInterval(function() {
                  Collect();
                  Refuel();
                }, 1000);
           }
     }
          function stopAHRC() {
  var trade = document.getElementById("AHRC");
  if (trade.innerHTML == "Turn AHRC On") {
    trade.innerHTML = "Turn AHRC Off";
  } else {
    trade.innerHTML = "Turn AHRC On";
  }
}
//
var button21 = document.getElementById("UPP");
button21.addEventListener("click", startUPP);
button21.addEventListener("click", stopUPP);
var UPP = null;
function startUPP() {
clearInterval(UPP);
  if (UPP !== null) {
    UPP = null;
  } else {

              UPP = setInterval(function() {
                  UpgradeAll();
                  UpgradeStash();
                }, 25);
           }
     }
          function stopUPP() {
  var trade = document.getElementById("UPP");
  if (trade.innerHTML == "Turn UPGRADE ALL On") {
    trade.innerHTML = "Turn UPGRADE ALL Off";
  } else {
    trade.innerHTML = "Turn UPGRADE ALL On";
  }
}
//
var button20 = document.getElementById("SSL");
button20.addEventListener("click", startSSL);
button20.addEventListener("click", stopSSL);
var SSL = null;
function startSSL() {
clearInterval(SSL);
  if (SSL !== null) {
    SSL = null;
  } else {

              SSL = setInterval(function() {
                  SellAll();
                }, 25);
           }
     }
          function stopSSL() {
  var trade = document.getElementById("SSL");
  if (trade.innerHTML == "Turn SELL ALL On") {
    trade.innerHTML = "Turn SELL ALL Off";
  } else {
    trade.innerHTML = "Turn SELL ALL On";
  }
}
//
var button19 = document.getElementById("SS");
button19.addEventListener("click", startSS);
button19.addEventListener("click", stopSS);
var SS = null;
function startSS() {
clearInterval(SS);
  if (SS !== null) {
    SS = null;
  } else {

              SS = setInterval(function() {
                  Accepton();
                }, 0);
           }
     }
          function stopSS() {
  var trade = document.getElementById("SS");
  if (trade.innerHTML == "Turn SELL STASH On") {
    trade.innerHTML = "Turn SELL STASH Off";
  } else {
    trade.innerHTML = "Turn SELL STASH On";
  }
}