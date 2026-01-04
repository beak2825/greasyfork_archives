// ==UserScript==
// @name         Genesis Mod
// @namespace    http://tampermonkey.net/
// @version      v3.0.2
// @description  OP Mod In 2024!
// @author       2k09__
// @match        https://moomoo.io/
// @match        https://dev.moomoo.io/
// @match        https://sandbox.moomoo.io/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493929/Genesis%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/493929/Genesis%20Mod.meta.js
// ==/UserScript==
var ws;
$("#moomooio_728x90_home").parent().css({display: "none"});
    setTimeout(() => {
    document.getElementById("gameName").innnerHTML = 'G';
     document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
     document.getElementById("gameName").innerHTML = 'Ge';
      document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
      document.getElementById("gameName").innerHTML = 'Gen';
       document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
    document.getElementById("gameName").innnerHTML = 'Gene';
     document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
     document.getElementById("gameName").innerHTML = 'Genes';
      document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
      document.getElementById("gameName").innerHTML = 'Genesi';
       document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
    document.getElementById("gameName").innnerHTML = 'Genesis';
     document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
     document.getElementById("gameName").innerHTML = 'Genesis ';
      document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
      document.getElementById("gameName").innerHTML = 'Genesis M';
       document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
    document.getElementById("gameName").innnerHTML = 'Genesis Mo';
     document.getElementById("gameName").style.color = "#000000";
    setTimeout(() => {
     document.getElementById("gameName").innerHTML = 'Genesis Mod';
      document.getElementById("gameName").style.color = "#000000";
          }, 10000);
         }, 10000);
        }, 10000);
       }, 10000);
      }, 10000);
     }, 10000);
    }, 10000);
   }, 10000);
  }, 10000);
 }, 10000);
}, 10000);

      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'R';
       document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Re';
        document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Rev';
        document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Reve';
        document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Reven';
        document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Reven';
        document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Reveng';
        document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Revenge';
        document.getElementById('diedText').style.color = "#000000";
      setTimeout(() => {
      document.getElementById("diedText").innerHTML = 'Revenge !';
        document.getElementById('diedText').style.color = "#000000";
        }, 510);
       }, 510);
      }, 510);
     }, 510);
    }, 510);
   }, 510);
  }, 510);
 }, 510);
}, 510);
setTimeout(() => {
 document.getElementById("leaderboard").innerHTML = 'Im';
  document.getElementById("leaderboard").style.color = "#000000";
  setTimeout(() => {
   document.getElementById("leaderboard").innerHTML = 'Super';
    document.getElementById("leaderboard").style.color = "#000000";
    setTimeout(() => {
     document.getElementById("leaderboard").innerHTML = 'Pro';
      document.getElementById("leaderboard").style.color = "#000000";
      setTimeout(() => {
       document.getElementById("leaderboard").innerHTML = 'Now';
        document.getElementById("leaderboard").style.color = "#000000";
         setTimeout(() => {
          document.getElementById("leaderboard").innerHTML = 'Im Super Pro Now !';
           document.getElementById("leaderboard").style.color = "#00000";
        }, 10000);
      }, 10000);
    }, 10000);
  }, 10000);
}, 25000);


const MooMoo = (function MooMooJS_beta() {})[69]

MooMoo.addEventListener("updatehealth", (data) => {
    let sid = data[0]
    let health = data[1]

    if (MooMoo.myPlayer.sid === sid && health < 100) {

        let food = MooMoo.myPlayer.inventory.food;

        if(health < 100 && health > 79) {
        setTimeout(() => {
        MooMoo.myPlayer.place(food)
        }, 90);
        } else if(health < 80 && health > 59) {
            storeEquip(6)
            setTimeout(() => {
                MooMoo.myPlayer.place(food)
                MooMoo.myPlayer.place(food)
            }, 90);
        } else if(health < 60 && health > 39) {
            storeEquip(7)
            MooMoo.myPlayer.place(food)
            MooMoo.myPlayer.place(food)
        } else if(health < 40 && health > 0) {
            storeEquip(7)
            MooMoo.myPlayer.place(food)
            MooMoo.myPlayer.place(food)
            MooMoo.myPlayer.place(food)
        };
    };
});
   var hatList = {
       Unequip: 0,
       WinterCap: 15,
       BullHelmet: 7,
       SoldierHelmet: 6,
       TankGear: 40,
       TurretGear: 53,
       FlipperHat: 31,
       BoosterHat: 12,
       BarbarianArmor: 26,
       EmpHelmet: 22,
       ThiefGear: 52,
       SamuraiArmor: 20,
       AssassinGear: 56,
       BushidoArmor: 16,
       PigHead: 29
   };
    function buyAndEquip(name) {
        var target2 = hatList.name;
        storeBuy(target2);
        storeEquip(target2);
    };
    if (document.activeElement.id !== 'chatBox'){
        document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case 16: buyAndEquip('Unequip'); break; // Shift
                case 82: buyAndEquip('BullHelmet'); break; // R
                case 90: buyAndEquip('TankGear'); break; // Z
                case 71: buyAndEquip('SoldierHelmet'); break; // G
                case 66: buyAndEquip('BoosterHat'); break; // B
                case 89: buyAndEquip('FlipperHat'); break; // Y
                case 78: buyAndEquip('WinterCap'); break; // N
                case 74: buyAndEquip('EmpHelmet'); break; // J
                case 84: buyAndEquip('TurretGear'); break; // T
                case 88: buyAndEquip('ThiefGear'); break; // K
                case 76: buyAndEquip('BarbarianArmor'); break; // H
                case 85: buyAndEquip('SamuraiArmor'); break; // U
                case 73: buyAndEquip('AssassinGear'); break; // I
                case 79: buyAndEquip('BushidoArmor'); break; // O
                case 80: buyAndEquip('PigHead'); break; // P
            };
        });
    };
localStorage.moofoll = !0;
var preInsta = false,
   canInsta = false;

function updatePreInstaStatus() {
   var e = document.getElementById("preInstaStatus");
   preInsta ? (e.innerText = "[true]") : (e.innerText = "[false]");
}
async function asyncInsta() {
   let e = MooMoo.ActivePlayerManager.getClosestEnemyDistance();
   if (preInsta && !canInsta && e && e <= 200) {
      canInsta = true;
      let {
         secondary: o
      } = MooMoo.myPlayer.inventory,
         t = MooMoo.ActivePlayerManager.getClosestEnemyAngle(), {
            primary: a,
         } = MooMoo.myPlayer.inventory;
      MooMoo.myPlayer.hit(t);
      MooMoo.sendPacket("5", a, true);
      MooMoo.myPlayer.buyHat(7);
      MooMoo.myPlayer.equipHat(7);
      MooMoo.myPlayer.unequipAccessory();
      setTimeout(() => {
         MooMoo.myPlayer.hit(t);
         MooMoo.myPlayer.buyHat(53);
         MooMoo.myPlayer.equipHat(53);
         MooMoo.sendPacket("5", o, true);
      }, 100);
      setTimeout(() => {
         MooMoo.sendPacket("5", a, true);
         MooMoo.myPlayer.buyHat(6);
         MooMoo.myPlayer.equipHat(6);
         MooMoo.myPlayer.buyAccessory(11);
         MooMoo.myPlayer.equipAccessory(11);
         2400 > MooMoo.myPlayer.y ?
            (MooMoo.myPlayer.buyHat(15), MooMoo.myPlayer.equipHat(15)) :
            6850 < MooMoo.myPlayer.y && MooMoo.myPlayer.y < 7550 ?
            (MooMoo.myPlayer.buyHat(31), MooMoo.myPlayer.equipHat(31)) :
            (MooMoo.myPlayer.buyHat(12), MooMoo.myPlayer.equipHat(12));
         canInsta = false;
         preInsta = false;
         document.getElementById("preInstaStatus").innerText = "[false]";
      }, 200);
   }
}
var isKeyDown = false;

function handleKeyDown(e) {
   82 !== e.which ||
      isKeyDown ||
      "chatbox" === document.activeElement.id.toLowerCase() ||
      ((isKeyDown = true),
         preInsta ? ((preInsta = false), (canInsta = false)) : (preInsta = true),
         asyncInsta(),
         updatePreInstaStatus());
}

function handleKeyUp(e) {
   82 === e.which && (isKeyDown = false);
}
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keydown", handleKeyDown);
MooMoo.addEventListener("updatePlayers", function (e) {
   canInsta || asyncInsta();
});
var preInstaStatusElement = document.createElement("div");
preInstaStatusElement.id = "preInstaStatus";
preInstaStatusElement.style.position = "fixed";
preInstaStatusElement.style.top = "5%";
preInstaStatusElement.style.left = "5%";
preInstaStatusElement.style.transform = "translate(-50%, -50%)";
preInstaStatusElement.style.color = "white";
preInstaStatusElement.style.fontSize = "25px";
document.body.appendChild(preInstaStatusElement);
updatePreInstaStatus();

(() => {
    // Constants and Variables
    let ws = null;
    let x = 0;
    let y = 0;
    let msgpack5 = window.msgpack;
    let scale = 45;
    let placeOffset = 5;
    let autoMill = false;
    let moreMill = false;
    let Allplayers = [];
    let players = [];
    //--------------------------------------------------------------------------------------------------
    const inventory = {
        primary: null,
        secondary: null,
        food: null,
        wall: null,
        spike: null,
        mill: null,
        mine: null,
        boostPad: null,
        trap: null,
        turret: null,
        teleporter: null,
        spawnpad: null
    };
    const vars = {
        camX: 0,
        camY: 0
    };
    const myPlayer = {
        sid: null,
        x: null,
        y: null,
        dir: null,
        buildIndex: null,
        weaponIndex: null,
        weaponVariant: null,
        team: null,
        isLeader: null,
        skinIndex: null,
        tailIndex: null,
        iconIndex: null
    };

    //--------------------------------------------------------------------------------------------------
    // Helper Functions

    /**
   * Utility function to join arrays
   * @param {Array} message - The array to join
   * @returns {Array} - Joined array
   */
    const join = message => Array.isArray(message) ? [...message] : [...message];

    /**
   * Hook function for WebSocket
   * @param {object} ms - WebSocket message
   */
    const hookWS = ms => {
        let tmpData = msgpack5.decode(new Uint8Array(ms.data));
        if ((ms = undefined) || (tmpData = (ms = tmpData.length > 1 ? [tmpData[0], ...join(tmpData[1])] : tmpData)[0]) || ms) {
            if ("C" == tmpData && null === myPlayer.sid && (myPlayer.sid = ms[1]) || "a" == tmpData) {
                for (tmpData = 0; tmpData < ms[1].length / 13; tmpData++) {
                    let data = ms[1].slice(13 * tmpData, 13 * (tmpData + 1));
                    if (data[0] == myPlayer.sid) {
                        Object.assign(myPlayer, {
                            x: data[1],
                            y: data[2],
                            dir: data[3],
                            buildIndex: data[4],
                            weaponIndex: data[5],
                            weaponVariant: data[6],
                            team: data[7],
                            isLeader: data[8],
                            skinIndex: data[9],
                            tailIndex: data[10],
                            iconIndex: data[11]
                        });
                    }
                }
            }

            vars.camX || (vars.camX = myPlayer.x);
            vars.camY || (vars.camY = myPlayer.y);

            //--------------------------------------------------------------------------------------------------
            //--------------------------------------------------------------------------------------------------
            if (y !== myPlayer.y || x !== myPlayer.x) {
                //--------------------------------------------------------------------------------------------------
                // AUTO MILL CODE:
                if (autoMill) {
                    let angle = Math.atan2(y - myPlayer.y, x - myPlayer.x);
                    place(inventory.mill, angle + Math.PI / 2.5);
                    place(inventory.mill, angle);
                    place(inventory.mill, angle - Math.PI / 2.5);
                }
                x = myPlayer.x;
                y = myPlayer.y;
            }
            if(moreMill){
                place(inventory.mill);
            }
        }
        cacheItems();
    }
    //--------------------------------------------------------------------------------------------------

    /**
   * Function to emit a packet
   * @param {string} event - Event type
   * @param {*} a - Parameter a
   * @param {*} b - Parameter b
   * @param {*} c - Parameter c
   * @param {*} m - Parameter m
   * @param {*} r - Parameter r
   */
    const emit = (event, a, b, c, m, r) => ws.send(Uint8Array.from([...msgpack5.encode([event, [a, b, c, m, r]])]));

    /**
   * Function to place an item
   * @param {number} event - Event type
   * @param {number} l - Angle
   */
    const place = (event, l) => {
        emit("G", event, false);
        emit("d", 1, l);
        emit("d", 0, l);
        emit("G", myPlayer.weaponIndex, true);
    };
    const hit = function (ang) {
        emit("d", 1, ang);
        emit("d", 0, ang);
        emit("G", myPlayer.weaponIndex, true);
    };

    /**
   * Function to send a chat message
   * @param {string} event - The chat message
   */
    const chat = event => emit("6", event);

    //--------------------------------------------------------------------------------------------------
    /**
   * Cache the player's items
   */
    const cacheItems = () => {
        for (let c = 0; c < 9; c++) {
            var _document$getElementB;
            if (((_document$getElementB = document.getElementById(`actionBarItem${c}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetParent) !== null) {
                inventory.primary = c;
            }
        }
        for (let s = 9; s < 16; s++) {
            var _document$getElementB2;
            if (((_document$getElementB2 = document.getElementById(`actionBarItem${s}`)) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.offsetParent) !== null) {
                inventory.secondary = s;
            }
        }
        for (let P = 16; P < 19; P++) {
            var _document$getElementB3;
            if (((_document$getElementB3 = document.getElementById(`actionBarItem${P}`)) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.offsetParent) !== null) {
                inventory.food = P - 16;
            }
        }
        for (let f = 19; f < 22; f++) {
            var _document$getElementB4;
            if (((_document$getElementB4 = document.getElementById(`actionBarItem${f}`)) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.offsetParent) !== null) {
                inventory.wall = f - 16;
            }
        }
        for (let _ = 22; _ < 26; _++) {
            var _document$getElementB5;
            if (((_document$getElementB5 = document.getElementById(`actionBarItem${_}`)) === null || _document$getElementB5 === void 0 ? void 0 : _document$getElementB5.offsetParent) !== null) {
                inventory.spike = _ - 16;
            }
        }
        for (let u = 26; u < 29; u++) {
            var _document$getElementB6;
            if (((_document$getElementB6 = document.getElementById(`actionBarItem${u}`)) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.offsetParent) !== null) {
                inventory.mill = u - 16;
            }
        }
        for (let I = 29; I < 31; I++) {
            var _document$getElementB7;
            if (((_document$getElementB7 = document.getElementById(`actionBarItem${I}`)) === null || _document$getElementB7 === void 0 ? void 0 : _document$getElementB7.offsetParent) !== null) {
                inventory.mine = I - 16;
            }
        }
        for (let p = 31; p < 33; p++) {
            var _document$getElementB8;
            if (((_document$getElementB8 = document.getElementById(`actionBarItem${p}`)) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.offsetParent) !== null) {
                inventory.boostPad = p - 16;
            }
        }
        for (let x = 31; x < 33; x++) {
            var _document$getElementB9;
            if (((_document$getElementB9 = document.getElementById(`actionBarItem${x}`)) === null || _document$getElementB9 === void 0 ? void 0 : _document$getElementB9.offsetParent) !== null) {
                inventory.trap = x - 16;
            }
        }
        for (let g = 33; g < 35; g++) {
            var _document$getElementB10;
            if (((_document$getElementB10 = document.getElementById(`actionBarItem${g}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && g !== 36) {
                inventory.turret = g - 16;
            }
        }
        for (let y = 36; y < 39; y++) {
            if (((_document$getElementB10 = document.getElementById(`actionBarItem${y}`)) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.offsetParent) !== null && y !== 36) {
                inventory.teleporter = y - 16;
            }
        }
        inventory.spawnpad = 36;
    };
    //--------------------------------------------------------------------------------------------------
    // Auto Mill
    document.addEventListener("keydown", event => {
        if (event.keyCode === 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {//M
            autoMill = !autoMill;
        }
        if (event.keyCode === 70 && document.activeElement.id.toLowerCase() !== 'chatbox'){//N
            moreMill = true;
        }
    });
    document.addEventListener("keyup", event => {
        if (event.keyCode === 70 && document.activeElement.id.toLowerCase() !== 'chatbox'){//N
            moreMill = false;
        }
    });
    //--------------------------------------------------------------------------------------------------
    // Override WebSocket's send method
    document.msgpack = window.msgpack;
    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (event) {
        ws || (document.ws = this, ws = this, document.ws.addEventListener("message", hookWS));
        this.oldSend(event);
    };
})();
let msgpack5 = window.msgpack;
 let prevCount = 0;

/**
 * Attach an event listener to the WebSocket object
 * @param {WebSocket} e - The WebSocket object
 */
const attachWebSocketListener = e => {
  e.addEventListener("message", hookWS);
};

/**
 * WebSocket message hook function
 * @param {MessageEvent} e - The WebSocket message event
 */
const hookWS = e => {
  // You can add actions related to WebSocket messages here
};

/**
 * Send a packet on the WebSocket
 * @param {Array} e - The packet to send
 */
const sendPacket = e => {
  if (ws) {
    ws.send(msgpack5.encode(e));
  }
};

/**
 * Send a chat message
 * @param {string} e - The message to send
 */
const chat = e => {
  sendPacket(["6", [e]]);
};

// Override WebSocket's send method
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
  if (!ws) {
    [document.ws, ws] = [this, this];
    attachWebSocketListener(this);
  }
  this.oldSend(e);
};

// Mutation Observer
/**
 * Handle observed mutations
 * @param {MutationRecord[]} mutationsList - List of observed mutations
 */
const handleMutations = mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "killCounter") {
      const count = parseInt(mutation.target.innerText, 10) || 0;
      if (count > prevCount) {
        chat("Genesis Mod v3 - GG");
        prevCount = count;
      }
    }
  }
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
  subtree: true,
  childList: true
});