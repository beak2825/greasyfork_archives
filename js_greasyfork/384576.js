// ==UserScript==
// @name         zombs.io***
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384576/zombsio%2A%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/384576/zombsio%2A%2A%2A.meta.js
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

        upgradeSlowTraps()
        sellSlowTraps()
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
                        if(["MeleeTower", "MagicTower", "CannonTower", "BombTower", "ArrowTower", "Door" || "Wall"].indexOf(obj.fromTick.model) >= 0) {
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

grid.innerHTML += `<button
        class="KodeLlmsaBgcZ">
        Enable gold generator
</button>`

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
        if(e[0].type === "GoldStash" && !e[0].dead && e[0].tier === 1) {
                if(state.stopped) return
                placeBuilding(e[0].x + -48, e[0].y + -96, "GoldMine", 0)
                placeBuilding(e[0].x + 48, e[0].y + -96, "GoldMine", 0)
                placeBuilding(e[0].x + 96, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -96, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -48, e[0].y + 96, "GoldMine", 0)
                placeBuilding(e[0].x + 48, e[0].y + 96, "GoldMine", 0)
                placeBuilding(e[0].x + 192, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -192, e[0].y + 0, "GoldMine", 0)
                placeBuilding(e[0].x + -192, e[0].y + -96, "BombTower", 0)
                placeBuilding(e[0].x + -192, e[0].y + 96, "BombTower", 0)
                placeBuilding(e[0].x + 192, e[0].y + 96, "BombTower", 0)
                placeBuilding(e[0].x + 192, e[0].y + -96, "BombTower", 0)
                placeBuilding(e[0].x + 0, e[0].y + -192, "BombTower", 0)
                placeBuilding(e[0].x + 0, e[0].y + 192, "BombTower", 0)
                placeBuilding(e[0].x + -96, e[0].y + 192, "ArrowTower", 0)
                placeBuilding(e[0].x + 96, e[0].y + 192, "ArrowTower", 0)
                placeBuilding(e[0].x + 96, e[0].y + -192, "ArrowTower", 0)
                placeBuilding(e[0].x + -96, e[0].y + -192, "ArrowTower", 0)
                placeBuilding(e[0].x + -168, e[0].y + -168, "Door", 0)
                placeBuilding(e[0].x + 168, e[0].y + -168, "Door", 0)
                placeBuilding(e[0].x + 168, e[0].y + 168, "Door", 0)
                placeBuilding(e[0].x + -168, e[0].y + 168, "Door", 0)

                const intervalId = setInterval(() => {
                        if(state.stopped) return
                        placeBuilding(e[0].x + -120, e[0].y + -120, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + -120, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + -72, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + -120, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + -72, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + 72, "SlowTrap", 0)
                        placeBuilding(e[0].x + -120, e[0].y + 120, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + 72, "SlowTrap", 0)
                        placeBuilding(e[0].x + 120, e[0].y + 120, "SlowTrap", 0)
                }, 0)

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
(function() {
  heal = document.getElementsByClassName('hud-shop-item')[10];
  petHeal = document.getElementsByClassName('hud-shop-item')[11];
  useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
  usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
  healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
  up = new Event('mouseup');
  healLevel = 94;

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
                });
            } else {
                clearInterval(weapons);
                weapons = null;
            }
            break;
            case 72:
            if (weapons == null) {
                weapons = setInterval(function () {
                    document.getElementsByClassName("hud-shop-item")[1].click();
                });
            } else {
                clearInterval(weapons);
                weapons = null;
            }
            break;
            case 74:
            if (weapons == null) {
                weapons = setInterval(function () {
                    document.getElementsByClassName("hud-shop-item")[2].click();
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
Game.currentGame.network.addEnterWorldHandler(() => {
  Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);

  Game.currentGame.network.sendRpc({
    name: "SendChatMessage",
    channel: "Message",
    message: atob("RnJlZSBNb2RzOiBodHRwOi8vem9tYnMueDEwLmJ6Lw==")
  });

  const onMessageReceived = e => {
    const a = Game.currentGame.ui.getComponent("Chat"),
      s = e.displayName,
      t = e.message,
      m = a.ui.createElement(`<div class="hud-chat-message"><strong>${s}</strong>: ${t}</div>`);
    a.messagesElem.appendChild(m);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight
  };
  Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);
})
//Send Global Message CORRECT
const $ = function(className) {
  var elem = document.getElementsByClassName(className);
  if (elem.length > 1) return elem;
  return elem[0];
};

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
//

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
      case 221:
      SellStash();
      break;
      case 222:
      SellAll();
      break;
      case 90:
      startbow();
      stopbow();
      break;
      case 88:
      startUPP();
      stopUPP();
      break;
      case 67:
      startAHRC();
      stopAHRC();
      break;
      case 76:
      startspam();
      stopspam();
      break;
      case 75:
      dlt1();
      dlt2();
      break;
      case 219:
      startLeave();
      stopLeave();
      break;
      case 85:
      spampartys3();
      spampartys4();
      break;
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

var Settings = '';
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="SellStash();">Sell Stash?</button>';
Settings += '<button class="btn btn-blue" style="width: 50%;" onclick="SellAll();">Sell All!</button>';
Settings += '<button id="UPP" class="btn btn-red" style="width: 50%; height: 50px;">UPGRADE ALL Off</button>';
Settings += '<button id="AHRC" class="btn btn-red" style="width: 50%; height: 50px;">AHRC Off</button>';
Settings += '<button id="bow" class="btn btn-red" style="width: 50%; height: 50px;">Autobow Off</button>';
Settings += '<button id="ait" class="btn btn-red" style="width: 50%; height: 50px;">Auto Timeout Off</button>';
Settings += '<button id="acc" class="btn btn-red" style="width: 50%; height: 50px;">accept Off</button>';
Settings += '<button id="Lve" class="btn btn-red" style="width: 50%; height: 50px;">Auto Leave Off</button>';
Settings += '<button id="spm" class="btn btn-red" style="width: 50%; height: 50px;">Auto needed Off</button>';
Settings += '<button id="spm2" class="btn btn-red" style="width: 50%; height: 50px;">Auto spell Off</button>';
Settings += '<button id="dlt" class="btn btn-red" style="width: 100%; height: 50px;">DELETE MESSAGES LAGS OFF</button>';
// SETTINGS FEATURES INNERHTML
Settings += "<label>";
Settings += "<span>zombs.io script features</span>";
Settings += "<ul class=\"hud-settings-controls\">";
Settings += "<li>( SELL STASH KEY } )</li>";
Settings += "<li>( SELL ALL KEY ' )</li>";
Settings += "<li>( UPGRADE EVERYTHING KEY X )</li>";
Settings += "<li>( AHRC KEY C )</li>";
Settings += "<li>( AUTO BOW KEY Z )</li>";
Settings += "</ul></label></div>";

document.getElementsByClassName("hud-settings-grid")[0].innerHTML = Settings;
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
  if (trade.innerHTML == "Autobow Off") {
    trade.innerHTML = "Autobow On";
  } else {
    trade.innerHTML = "Autobow Off";
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
  if (trade.innerHTML == "AHRC Off") {
    trade.innerHTML = "AHRC On";
  } else {
    trade.innerHTML = "AHRC Off";
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
                }, 0);
           }
     }
          function stopUPP() {
  var trade = document.getElementById("UPP");
  if (trade.innerHTML == "UPGRADE ALL Off") {
    trade.innerHTML = "UPGRADE ALL On";
  } else {
    trade.innerHTML = "UPGRADE ALL Off";
  }
}
//
var button18 = document.getElementById("ait");
button18.addEventListener("click", startait);
button18.addEventListener("click", stopait);
var ait = null;
function startait() {
clearInterval(ait);
  if (ait !== null) {
    ait = null;
  } else {

              ait = setInterval(() => {
document.getElementsByClassName("hud-spell-icon")[1].click();
}, 1)
           }
     }
        function stopait() {
  var trade = document.getElementById("ait");
  if (trade.innerHTML == "Auto Timeout Off") {
    trade.innerHTML = "Auto Timeout On";
  } else {
    trade.innerHTML = "Auto Timeout Off";
  }
}
var button16 = document.getElementById("Lve");
button16.addEventListener("click", startLeave);
button16.addEventListener("click", stopLeave);
var Leave = null;
function startLeave() {
clearInterval(Leave);
  if (Leave !== null) {
    Leave = null;
  } else {

              Leave = setInterval(function() {
                  Game.currentGame.network.sendRpc({ "name": "LeaveParty" })
                  document.getElementsByClassName("hud-party-visibility is-private")[0].click();
                  document.getElementsByClassName("hud-party-visibility is-private")[1].click();
                  document.getElementsByClassName("hud-party-visibility is-private")[2].click();
  },0);
  }
  }
          function stopLeave() {
  var trade = document.getElementById("Lve");
  if (trade.innerHTML == "Auto Leave Off") {
    trade.innerHTML = "Auto Leave On";
  } else {
    trade.innerHTML = "Auto Leave Off";
  }
}
//
var button15 = document.getElementById("spm2");
button15.addEventListener("click", startspam2);
button15.addEventListener("click", stopspam2);
var spam2 = null;
function startspam2() {
clearInterval(spam2);
  if (spam2 !== null) {
    spam2 = null;
  } else {

              spam2 = setInterval(() => {
Game.currentGame.network.sendRpc({
    name: "CastSpell",
    spell : "HealTowersSpell",
    x: Math.round(Game.currentGame.ui.playerTick.position.x),
    y: Math.round(Game.currentGame.ui.playerTick.position.y),
    tier: 1
})
}, 2000)
           }
     }
          function stopspam2() {
  var trade = document.getElementById("spm2");
  if (trade.innerHTML == "Auto spell Off") {
    trade.innerHTML = "Auto spell On";
  } else {
    trade.innerHTML = "Auto spell Off";
  }
}
//
var button14 = document.getElementById("spm");
button14.addEventListener("click", startspam);
button14.addEventListener("click", stopspam);
var spam = null;
function startspam() {
clearInterval(spam);
  if (spam !== null) {
    spam = null;
  } else {

              spam = setTimeout(function() {
  document.getElementsByClassName("hud-party-joining")[0].remove();
  document.getElementsByClassName("hud-respawn-share")[0].remove();
  document.getElementsByClassName("hud-intro-footer")[0].remove();
                }, 0);
           }
     }
          function stopspam() {
  var trade = document.getElementById("spm");
  if (trade.innerHTML == "Auto needed Off") {
    trade.innerHTML = "Auto needed On";
  } else {
    trade.innerHTML = "Auto needed Off";
  }
}

// SPAM ALL OPEN PARTYS
var button17 = document.getElementById("acc");
button17.addEventListener("click", spampartys3);
button17.addEventListener("click", spampartys4);

var partyspam2 = null;

function spampartys3() {
  clearInterval(partyspam2);
  if (partyspam2 !== null) {
    partyspam2 = null;
  } else {
    partyspam2 = setInterval(function() {
      partys = document.getElementsByClassName('hud-party-linkll');
      for (var i = 0; i < partys.length; i++) {
        var link = partys[i];
        link.click();
      }
      confirm2 = document.getElementsByClassName('btn btn-green hud-confirmation-accept');
      for (var i2 = 0; i2 < confirm2.length; i2++) {
        var accept = confirm2[i2];
        accept.click();
      }
    }, 0); // SPEED FOR PARTY SPAM
  }
}

function spampartys4() {
  var change6 = document.getElementById("acc");
  if (change6.innerHTML == "accept Off") {
    change6.innerHTML = "accept On";
  } else {
    change6.innerHTML = "accept Off";
  }
}

// SPAM ALL OPEN PARTYS
var button30 = document.getElementById("dlt");
button30.addEventListener("click", dlt1);
button30.addEventListener("click", dlt2);

var dltm = null;

function dlt1() {
  clearInterval(dltm);
  if (dltm !== null) {
    dltm = null;
  } else {
    dltm = setInterval(function() {
      rm = document.getElementsByClassName('hud-chat-message');
      for (var i = 0; i < rm.length; i++) {
        var rems = rm[i];
        rems.remove();
      }
    }, 0);
  }
}

function dlt2() {
  var change5 = document.getElementById("dlt");
  if (change5.innerHTML == "DELETE MESSAGES LAGS OFF") {
    change5.innerHTML = "DELETE MESSAGES LAGS ON";
  } else {
    change5.innerHTML = "DELETE MESSAGES LAGS OFF";
  }
}
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