// ==UserScript==
// @name         Clap mod
// @version      v2
// @description  I hate seeing people killing me with my mod
// @match        http*://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @license      MIT
// @grant        none
// @namespace Good Guy
// @downloadURL https://update.greasyfork.org/scripts/530079/Clap%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/530079/Clap%20mod.meta.js
// ==/UserScript==
/** VARIABLES **/
let spike = 0;
let weapongrind = false;
let { msgpack, config, jQuery: $ } = window;
let leaderboard = document.getElementById('leaderboard')
let gameCanvas = document.getElementById("gameCanvas");
let mainContext = gameCanvas.getContext("2d");
let storeMenu = document.getElementById("storeMenu");
let allianceMenu = document.getElementById("allianceMenu");
let chatHolder = document.getElementById("chatHolder");
let altchaCheckbox = document.getElementById('altcha_checkbox');
let altcha = document.getElementById('altcha');
let menuOpened = false;
let mouseX, mouseY, width = innerWidth, height = innerHeight;
let moveKeys = { w: false, a: false, s: false, d: false };
let myPlayer = {
    id: null, x: null, y: null, dir: null, object: null, weapon: null, clan: null,
    isLeader: null, maxXP: 300, XP: 0, age: 1, hat: null, accessory: null, isSkull: null, maxHealth: 100
};
let locked = false, gameTick = 0, enemy = [], ws = null;
let tPing = 90;
let players = [], nearestEnemy = {}, enemyAngle, isEnemyNear;
let primary, secondary, foodType, wallType, spikeType, millType, mineType, boostType, spawnpadType, turretType, haveMine;
let SaVeGe = {
    tick: 0,
    tickQueue: [],
    manage: [],
    tickRate: 1000 / 9,
    tickSpeed: 0,
    lastTick: performance.now(),
    tickBase(set, tick) {
        const targetTick = this.tick + tick;
        this.tickQueue[targetTick] = this.tickQueue[targetTick] ?? [];
        this.tickQueue[targetTick].push(set);
    }
};

document.getElementById("gameName").innerHTML = "Clap mod";
document.querySelector("#pre-content-container").remove(); //ANTI AD

/** SOCKET **/
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (m) {
    if (!ws) {
        document.websocket = this;
        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};

/** FPS BOOSTER **/
let { maxScreenWidth, maxScreenHeight } = config;
let FPSBooster;
let { moveTo, lineTo } = CanvasRenderingContext2D.prototype;

CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
    if (!FPSBooster || this.globalAlpha !== 0.06) {
        return moveTo.call(this, x, y);
    }
};
CanvasRenderingContext2D.prototype.lineTo = function(x, y) {
    if (!FPSBooster || this.globalAlpha !== 0.06) {
        return lineTo.call(this, x, y);
    }
};

class Checker {
    check(callback) {
        return (event) => {
            if (event instanceof Event && (event.isTrusted ?? true)) {
                callback(event);
            }
        };
    }
}

let checker = new Checker();
let updateScreen = () => {
    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;

    if (FPSBooster) {

    } else {
    }
};
/** LOCKERS **/
let lockers = {
    attacker: false,
    breaker: false,
    storeOpened: false,
}

/** WS SEND PACKET **/
let sendPacket = (packet, ...data) => {
    ws.send(new Uint8Array(msgpack.encode([packet, data])));
};

/** FOR STORE FUNCTIONS **/
let goldCount = () => {
    let scoreCount = document.getElementById("scoreDisplay");
    return scoreCount ? parseInt(scoreCount.innerText) : 0;
};

let hatPrice = (hatId) => {
    let hatPrice = {
        45: 0,
        51: 0,
        50: 0,
        28: 0,
        29: 0,
        30: 0,
        36: 0,
        37: 0,
        38: 0,
        44: 0,
        35: 0,
        42: 0,
        43: 0,
        49: 0,
        57: 50,
        8: 100,
        2: 500,
        15: 600,
        5: 1000,
        4: 2000,
        18: 2000,
        31: 2500,
        1: 3000,
        10: 3000,
        48: 3000,
        6: 4000,
        23: 4000,
        13: 5000,
        9: 5000,
        32: 5000,
        7: 6000,
        22: 6000,
        12: 6000,
        26: 8000,
        21: 10000,
        46: 10000,
        14: 10000,
        11: 10000,
        53: 10000,
        20: 12000,
        58: 12000,
        27: 15000,
        40: 15000,
        52: 15000,
        55: 20000,
        56: 20000
    };
    return hatPrice[hatId] || 0;
};

let accPrice = (accessoryId) => {
    let accPrice = {
        12: 1000,
        9: 1000,
        10: 1000,
        3: 1500,
        8: 2000,
        11: 2000,
        17: 3000,
        6: 3000,
        4: 4000,
        5: 5000,
        2: 6000,
        1: 8000,
        7: 8000,
        14: 10000,
        15: 10000,
        20: 10000,
        16: 12000,
        13: 15000,
        19: 15000,
        18: 20000,
        21: 20000
    };
    return accPrice[accessoryId] || 0;
};
let purchased = [];
let isPurchased = (id) => {
    return purchased.includes(id);
};

/** STORE **/
let storeBuy = (id, index) => {
    if (isPurchased(id)) {
        return;
    }
    let gold = goldCount();
    let cost = 0;
    if (index === 0) {
        cost = hatPrice(id);
    } else if (index === 1) {
        cost = accPrice(id);
    }
    if (gold >= cost) {
        sendPacket('c', 1, id, index);
        purchased.push(id);
    }
};
let storeEquip = (id, index) => sendPacket('c', 0, id, index);

/** EQUIP WEAPONS **/
let equipWeapon = (weapon) => sendPacket('z', weapon, true);

/** SEND CHAT **/
let sendChat = message => sendPacket('6', message);

/** AUTO GATHER **/
let autoGather = () => sendPacket('K', 1, 1);

/** REQUEST ANIMATION FRAME **/
let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || (callback => setTimeout(callback, 1000 / 60));

/** HANDLE MESSAGE **/
let handleMessage = (message) => {
    let decodeData = msgpack.decode(new Uint8Array(message.data));

    let data = Array.isArray(decodeData) && decodeData.length > 1 ? [decodeData[0], ...decodeData[1]] : decodeData;

    if (!data) return;

    let dataType = data[0];

    if (dataType === "C" && myPlayer.id == null) {
        myPlayer.id = data[1];
    }
    if (dataType == "D" && data[2]) {
        secondary = null;
        primary = 0;
        foodType = 0;
        wallType = 3;
        spikeType = 6;
        millType = 10;
        spawnpadType = 36;
    }
    if (dataType == "V") {
        if (data[2] == 1) {
            primary = data[1][0];
            secondary = data[1][1] ?? null;
        } else {
            foodType = data[1][0];
            wallType = data[1][1];
            spikeType = data[1][2];
            millType = data[1][3];
            boostType = data[1][4] ?? -1;
            haveMine = data[1][5] == 13 || data[1][4] == 14;
            if (haveMine) {
                mineType = data[1][5];
            }
            turretType = data[1][5 + (haveMine ? 1 : 0)];
        }
    }
    if (dataType == "a") updatePlayers(data);
    if (dataType === "T") updateAge(data[1], data[2], data[3]);
    if (dataType == "O" && data[1] == myPlayer.id) {
        let playerID = data[1];
        let health = data[2];
        updateHealth(health, playerID);
    }
};

/** DISTANCE CALCULATE **/
let distance = (a, b) => {
    return Math.sqrt(Math.pow(b.y - a[2], 2) + Math.pow(b.x - a[1], 2));
};

/** ANTI ALTCHA **/
document.getElementById('altcha').style.display = 'none';
document.getElementById('altcha_checkbox').click();

/** UPDATE XP/MAXXP/AGE **/
let updateAge = (xp, maxXp, age) => {
    if (xp != undefined) {
        myPlayer.XP = xp;
    }
    if (maxXp != undefined) {
        myPlayer.maxXP = maxXp;
    }
    if (age != undefined) {
        myPlayer.age = age;
    }
}

/** PLACE **/
let place = (id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) => {
    if (typeof id !== "number" || id == -1) return;
    sendPacket("z", id, null);
    sendPacket("F", 1, angle);
    sendPacket("F", 0, angle);
    sendPacket("z", myPlayer.weapon, true);
}
//sendupgrade
function sendUpgrade(index) {
    //myPlayer.reloads[index] = 0;
        sendPacket("H", index);
}
/** HOOK **/
let hook = (target, prop, setter, getter) => {
    let symbol = Symbol(prop);
    Object.defineProperty(target, prop, {
        get() {
            getter(this, this[symbol]);
            return this[symbol];
        },
        set(value) {
            setter(this, symbol, value);
        },
        configurable: true
    })
}

/** IS TEAM **/
let isTeam = (kaka) => {
    return kaka.clan == myPlayer.clan;
};

/** OPEN/CLOSED **/
let checkMenu = () => {
    return (allianceMenu.style.display != "block" && chatHolder.style.display != "block" && storeMenu.style.display != "block" && !menuOpened);
}

/** RENDERING **/
let object = null;
hook(Object.prototype, "isItem", function(that, symbol, value) {
    that[symbol] = value;
}, function(that, value) {
    if (value === true) {
        object = that;
    }
});

CanvasRenderingContext2D.prototype.restore = new Proxy(CanvasRenderingContext2D.prototype.restore, {
    apply(target, thisArg, args) {
        markObject(thisArg);
        return Reflect.apply(target, thisArg, args);
    }
});

let markColor = (id) => {

    if (id === myPlayer.id) {
        return { color: "#00ff00", render: true };
    } else {
        return { color: "#FF4D4D", render: false };
    }
};

// item.owner.sid

let markObject = (ctx) => {
    if (!object || !object.owner || myPlayer.id === null) return;
    let distance = Math.sqrt(Math.pow(myPlayer.x - object.x, 2) + Math.pow(myPlayer.y - object.y, 2));
    if (distance > 300) return;
    let type = markColor(object.owner.sid);
    if (!type.render) return;
    ctx.fillStyle = type.color;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2 * Math.PI);
    ctx.fill();
    object = null;
};
/** WEAPONS/NAMES/IDS **/
let weapon = {
    "tool_hammer": 0,
    "hand_axe": 1,
    "great_axe": 2,
    "short_sword": 3,
    "katana": 4,
    "polearm": 5,
    "bat": 6,
    "daggers": 7,
    "stick": 8,
    "hunting_bow": 9,
    "great_hammer": 10,
    "wooden_shield": 11,
    "crossbow": 12,
    "repeater_crossbow": 13,
    "mc_grabby": 14,
    "musket": 15
};

/** UPDATE PLAYERS **/
let updatePlayers = data => {
    SaVeGe.tick++
    let enemies = [];
    let players = [];
    let cTickQ = SaVeGe.tickQueue[SaVeGe.tick];
    if (Array.isArray(cTickQ)) {
        cTickQ.forEach((did) => did());
        SaVeGe.tickQueue[SaVeGe.tick] = null;
    }
    for (let i = 0; i < data[1].length / 13; i++) {
        let playerInfo = data[1].slice(13 * i, 13 * i + 13);
        players.push(playerInfo);

        if (playerInfo[0] == myPlayer.id) {
            myPlayer.x = playerInfo[1];
            myPlayer.y = playerInfo[2];
            myPlayer.dir = playerInfo[3];
            myPlayer.object = playerInfo[4];
            myPlayer.weapon = playerInfo[5];
            myPlayer.clan = playerInfo[7];
            myPlayer.isLeader = playerInfo[8];
            myPlayer.hat = playerInfo[9];
            myPlayer.accessory = playerInfo[10];
            myPlayer.isSkull = playerInfo[11];
        } else if (playerInfo[7] != myPlayer.clan && playerInfo[7] !== null) {
            enemies.push({
                id: playerInfo[0],
                x: playerInfo[1],
                y: playerInfo[2],
                dir: playerInfo[3],
                object: playerInfo[4],
                weapon: playerInfo[5],
                clan: playerInfo[7],
                isLeader: playerInfo[8],
                hat: playerInfo[9],
                accessory: playerInfo[10],
                isSkull: playerInfo[11]
            });
        }
    }

    if (enemies) {
        nearestEnemy = enemies.sort((a, b) => distance(a, myPlayer) - distance(b, myPlayer))[0];
    }

    let isEnemyNear = nearestEnemy ? (Math.sqrt(Math.pow(myPlayer.y - nearestEnemy.y, 2) + Math.pow(myPlayer.x - nearestEnemy.x, 2)) < 320) : true;
    enemyAngle = nearestEnemy ? Math.atan2(nearestEnemy.y - myPlayer.y, nearestEnemy.x - myPlayer.x) : (myPlayer?.dir ?? 0)
};

/** PLACE REPEATER **/
let placeRepeater = (key, action) => {
    return {
        interval: null,
        action,
        key,
    };
}
let grindInterval;
let repeaters = [
    placeRepeater("q", () => {
        place(foodType);
    }),
    placeRepeater("f", () => {
        place(boostType);
    }),
    placeRepeater("v", () => {
        place(spikeType);
    }),
    placeRepeater("F", () => {
        place(millType);
    }),
    placeRepeater("h", () => {
place(turretType);
    }),
    placeRepeater("t", () => {
        place(wallType);
    }),
    placeRepeater("c",() => {
           // let c = myPlayer.dir;
                place(spikeType, myPlayer.dir + toRad(0));
        place(spikeType, myPlayer.dir + toRad(120));
        place(spikeType, myPlayer.dir - toRad(120));
    }),
        placeRepeater("z",() => {
                let a = myPlayer.dir;
        place(boostType, myPlayer.dir + toRad(45));
        place(boostType, myPlayer.dir - toRad(45));
        place(boostType, myPlayer.dir + toRad(135));
        place(boostType, myPlayer.dir - toRad(135));
        place(boostType, myPlayer.dir + toRad(0));
        place(boostType, myPlayer.dir - toRad(180));
        place(boostType, myPlayer.dir + toRad(90));
        place(boostType, myPlayer.dir - toRad(90));
        place(boostType, a);
                }),
        placeRepeater("g", () => {
    place(spikeType, myPlayer.dir + toRad(90));
    place(spikeType, myPlayer.dir - toRad(90));
    place(boostType, myPlayer.dir);
    }),
        placeRepeater(" ", () => {
    }),
];
/** HIT **/
let hit = () => {
    sendPacket("F", 1, enemyAngle);
    sendPacket("F", 0);
}

/** SOCKET CONNECTION **/
let socketFound = stuff => {
    stuff.addEventListener("message", handleMessage);
    gameCanvas.addEventListener("mousemove", ({ x, y }) => {
        mouseX = x;
        mouseY = y;
    });
    window.addEventListener("resize", () => {
        height = innerHeight;
        width = innerWidth;
    });
};
/** MOVEMENT **/
let moveEz = (key, isKeyDown) => {
    moveKeys[key] = isKeyDown;
    if ((moveKeys.w || moveKeys.a || moveKeys.s || moveKeys.d) && !locked) {
       // storeEquip(12, 0);
        locked = true;
    }
    if (!moveKeys.w && !moveKeys.a && !moveKeys.s && !moveKeys.d && locked) {
      // storeEquip(6, 0);
        locked = false;
    }
};
let soike = 0;
/** AUTO HEAL **/
let defHealSpeed = 120;
let autoHeal = (health, damage) => {
    let cHealSpeed = defHealSpeed;
    if (health <= 50) {
        cHealSpeed = 100;
        place(foodType, null);
        place(foodType, null);
        place(foodType, null);
        place(foodType, null);
        place(foodType, null);
        storeEquip(21, 1);
    } else if (damage >= 30) {
        cHealSpeed = 110;
        place(foodType, null);
        place(foodType, null);
        place(foodType, null);
        place(foodType, null);
        storeBuy(21, 1);
        storeEquip(21, 1);
    }
    if (health < myPlayer.maxHealth) {
        let healing = setInterval(() => {
            if (myPlayer.health < myPlayer.maxHealth) {
                place(foodType, null);
            } else {
                clearInterval(healing);
            }
        }, cHealSpeed);
    }
};
    setInterval(function() {
if (soike === 1 && myPlayer.age > 5){
    soike = 0;
        place(spikeType, myPlayer.dir + toRad(45));
        place(spikeType, myPlayer.dir - toRad(45));
        place(spikeType, myPlayer.dir + toRad(135));
        place(spikeType, myPlayer.dir - toRad(135));
        place(spikeType, myPlayer.dir + toRad(0));
        place(spikeType, myPlayer.dir - toRad(180));
        place(spikeType, myPlayer.dir + toRad(90));
        place(spikeType, myPlayer.dir - toRad(90));
    soike = 0;
}
}, 100);
    setInterval(function() {
        if (myPlayer.hat === 45) {
        storeEquip(13, 1);
        }
}, 100);
/** UPDATE HEALTH **/
let lastHealth = 100;
let updateHealth = (health, playerID) => {
    if (myPlayer.id === playerID) {
        let damage = Math.max(0, lastHealth - health);
        myPlayer.health = health;
        if (myPlayer.health > 0) {
            autoHeal(myPlayer.health, damage);
        }
        lastHealth = health;
    } else {
        enemy.health = health;
    }
};
/** INSTA KILL **/
let instaKill = (...instaType) => {
    let type = instaType[0];

    switch (type) {
        case "normal":
            sendChat("");
            storeBuy(0, 1);
            storeEquip(0, 1);
            setTimeout(()=>{
                 storeBuy(7, 0);
                 storeEquip(7, 0);
                                 equipWeapon(primary);
                 hit();
                 setTimeout(()=>{
                    equipWeapon(secondary);
                    hit();
                                         storeBuy(53, 0);
                    storeEquip(53, 0);
                    setTimeout(() => {
                          storeBuy(6, 0);
                          storeEquip(6, 0);
                        if (secondary == 15){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },1500);
                        } else if (secondary == 12){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },1000);
                        } else if (secondary == 13){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },400);
                        }
                        setTimeout(() => {
                          storeBuy(11, 1);
                          storeEquip(11, 1);
                           equipWeapon(primary);
                            equipWeapon(secondary);
                    }, 170);
                    }, 170);
                  }, 120);
             }, 120);
            break;

        case "boostTick":
            sendChat("");
            storeEquip(0, 1);
            place(boostType, null);
                        setTimeout(()=>{
                 equipWeapon(secondary);
                 storeBuy(53, 0);
                 storeEquip(53, 0);
                 hit();
                 setTimeout(()=>{
                    equipWeapon(primary);
                    storeBuy(7, 0);
                    storeEquip(7, 0);
                     if (enemy.health > 0){
                     place(spikeType, null);
                     } else{
                     place(foodType, null);
                     }
                    hit();
                    setTimeout(() => {
                          storeBuy(6, 0);
                          storeEquip(6, 0);
                        setTimeout(() => {
                          storeBuy(11, 1);
                          storeEquip(11, 1);
                            if (secondary == 15){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },1500);
                        } else if (secondary == 12){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },1000);
                        } else if (secondary == 13){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },400);
                        }
                           equipWeapon(primary);
                            equipWeapon(secondary);
                    }, 170);
                    }, 170);
                  }, 110);
             }, 100);
            break;

        case "reverseInsta":
            sendChat("");
                        storeEquip(0, 1);
                        setTimeout(()=>{
                 equipWeapon(secondary);
                 storeBuy(53, 0);
                 storeEquip(53, 0);
                 hit();
                 setTimeout(()=>{
                                         storeBuy(7, 0);
                    storeEquip(7, 0);
                    hit();
                    equipWeapon(primary);
                    setTimeout(() => {
                          storeBuy(6, 0);
                          storeEquip(6, 0);
                        setTimeout(() => {
                          storeBuy(11, 1);
                          storeEquip(11, 1);
                            if (secondary == 15){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },1500);
                        } else if (secondary == 12){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },1000);
                        } else if (secondary == 13){
                            equipWeapon(secondary);
                            setTimeout(()=>{
                            equipWeapon(primary);
                            },400);
                        }
                           equipWeapon(primary);
                            equipWeapon(secondary);
                    }, 170);
                    }, 170);
                  }, 100);
             }, 100);

            break;

        case "oneTick":
                        sendChat("");
            storeEquip(0, 1);
                        setTimeout(()=>{
                 equipWeapon(primary);
                 storeBuy(7, 0);
                 storeEquip(7, 0);
                 hit();
                 setTimeout(()=>{
                    equipWeapon(secondary);
                     place(spikeType, null);
                     hit();
                     storeEquip(53, 0);
                        setTimeout(() => {
                          storeBuy(6, 0);
                          storeEquip(6, 0);
                            equipWeapon(primary);
                            setTimeout(() => {
                          storeBuy(11, 1);
                          storeEquip(11, 1);
                           equipWeapon(secondary);
                    }, 800);
                    }, 170);
                  }, 105);
             }, 100);

            break;

        default:
            sendChat("");
            break;
    }
};

let instaKillMode = 0;
let isInstaKillModeEnabled = false;

let humanBasedInsta = () => {
    if (!isInstaKillModeEnabled) return;

    switch (instaKillMode) {
        case 0:
            equipWeapon(primary);
            storeBuy(7, 0);
            storeEquip(7, 0);
            hit();
            break;

        case 1:
            equipWeapon(secondary);
            storeBuy(53, 0);
            storeEquip(53, 0);
            hit();
            break;

        case 2:
            equipWeapon(primary);
            storeBuy(6, 0);
            storeEquip(6, 0);
            break;

        case 3:
            sendChat("");
            break;

        default:
            sendChat("");
            break;
    }

    instaKillMode = (instaKillMode + 1) % 4;
};
let movementdir;
document.addEventListener("keydown", (event) => {
 if (event.key === "w") {
     movementdir = -1.57;
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "d") {
     movementdir = 0;
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "s") {
     movementdir = 1.57;
  }
});
document.addEventListener("keydown", (event) => {
if (event.key === "a") {
     movementdir = -3.14
  }
});
document.addEventListener("keydown", (event) => {
      if (event.key === ",") {
        storeBuy(31, 0);
        storeEquip(31, 0);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === ",") {
        storeBuy(15, 0);
        storeEquip(15, 0);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "e") {
        storeEquip(20, 0);
  }
});
let autoa = false;
let aInterval;
    document.addEventListener("keydown", (event) => {
  if (event.key === "/") {
    autoa = !autoa;
    sendChat(autoa ? "" : "");

    if (autoa) {
      aInterval = setInterval(() => {
          setTimeout(() => {
    storeBuy(8, 0);
    storeEquip(8, 0);
    setTimeout(() => {
    storeBuy(15, 0);
    storeEquip(15, 0);
                    }, 150);
                    }, 150);
      }, 300);
    } else {
      clearInterval(aInterval);
    }
  }
});
document.addEventListener("keydown", (event) => {
      if (event.key === "`") {
      weapongrind = !weapongrind;
      sendChat(weapongrind ? "ON" : "OFF");
  }
});
let keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.code] = true;
if (window.location.hostname === "sandbox.moomoo.io") {
    // Check if both keys are pressed
    if (keys["KeyW"] && keys["KeyD"]) {
        movementdir = -0.785;
    }
            if (keys["KeyD"] && keys["KeyS"]) {
        movementdir = 0.785;
    }
            if (keys["KeyS"] && keys["KeyA"]) {
        movementdir = 2.355;
    }
            if (keys["KeyA"] && keys["KeyW"]) {
        movementdir = -2.355;
    }
}
});
document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});
//autospike
/** KEY EVENTS **/
document.addEventListener('keydown', ({ key }) => {
    if (key == 'Escape') {
        let menu = document.getElementById('modMenu');
        if (menu) {
            if (menu.style.visibility === 'hidden') {
                menu.style.visibility = 'visible';
                menu.style.opacity = '1';
                menu.style.transform = 'translate(-50%, -50%) scale(1)';
                menuOpened = true;
            } else {
                menu.style.opacity = '0';
                menu.style.transform = 'translate(-50%, -50%) scale(0.95)';
                menuOpened = false;
                menu.style.visibility = 'hidden';
            }
        }
    }
    if (!checkMenu()) return;
    for (let repeater of repeaters) {
        if (repeater.key === key && repeater.interval === null) {
            repeater.interval = setInterval(
                repeater.action, 100
            );
        }
    }
    // if (key in moveKeys) moveEz(key, true);
    if (key == "r") {
        let instaTypes = document.getElementById('instaKillType');
        let instaType = instaTypes.value;
        instaKill(instaType);
    }
});

document.addEventListener('keyup', ({ key }) => {
    if (!checkMenu()) return;
    for (let repeater of repeaters) {
        if (repeater.key === key && repeater.interval !== null) {
            clearInterval(repeater.interval);
            repeater.interval = null;
        }
    }
    // if (key in moveKeys) moveEz(key, false);
});
function toRad(angle) {
    return angle * 0.01745329251;
}
let automill = false;
let millInterval;
if (window.location.hostname === "sandbox.moomoo.io") {
document.addEventListener("keydown", (event) => {
  if (event.key === "=") {
      automill = !automill;
                if (automill) {
      millInterval = setInterval(() => {
          place(millType, movementdir - 1.90);
          place(millType, movementdir - 3.14);
          place(millType, movementdir + 1.90);
      }, 135);
    } else {
      clearInterval(millInterval);
    };
  }
  });
};
/** MOUSE EVENTS **/
document.addEventListener('mousedown', (mouse) => {
    if (!checkMenu()) return;
    if (mouse.button === 0 && !lockers.attacker) {
        humanBasedInsta();
        if (!isInstaKillModeEnabled) {
            storeBuy(11, 1);
            storeEquip(0, 1);
                        equipWeapon(primary);
            setTimeout(()=>{
                storeBuy(7, 0);
                storeEquip(7, 0);
                autoGather();
            }, 100);
            lockers.attacker = true;
        }
    }
    if (mouse.button === 2 && !lockers.breaker) {
        if (!isInstaKillModeEnabled) {
            sendChat("");
            storeBuy(40, 0);
            storeEquip(40, 0);
            autoGather();

            lockers.breaker = true;
        }
        if (secondary == 10 && weapongrind == false) {
        equipWeapon(secondary);
        }
    }
});

document.addEventListener('mouseup', (mouse) => {
    if (!checkMenu()) return;
    if (mouse.button === 0 && lockers.attacker) {
        if (!isInstaKillModeEnabled) {
            storeBuy(11, 1);
            storeEquip(11, 1);
            autoGather();
            setTimeout(()=>{
                storeBuy(6, 0);
                storeEquip(6, 0);
            }, 200);
            lockers.attacker = false;
        }
    }
    if (mouse.button === 2 && lockers.breaker) {
        if (!isInstaKillModeEnabled) {
            storeBuy(6, 0);
            storeEquip(6, 0);
            autoGather();
            lockers.breaker = false;
        }
    }
});
let prevCount = 0;
const handleMutations = (mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.target.id === "killCounter") {
            const count = parseInt(mutation.target.innerText, 10) || 0;
            if (count > prevCount) {
                sendChat("Pls, say hi to Good Guy,");
                setTimeout(()=>{
                    sendChat("When you meet him :D");
                },650);
                prevCount = count;
            }
        }
    }
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
    subtree: true,
    childList: true,
});
setInterval(function() {
    if (myPlayer.y > 6830 && myPlayer.y < 7600) {
        storeBuy(31, 0);
        storeEquip(31, 0);
    }
}, 130);
setInterval(function() {
    if (myPlayer.y < 2400) {
       storeEquip(15, 0);
       storeEquip(15, 0);
    }
}, 900);
setInterval(function() {
    storeBuy(11, 1);
}, 100);
setInterval(function() {
    storeBuy(6, 0);
}, 100);
setInterval(function() {
    storeBuy(7, 0);
}, 100);
setInterval(function() {
    storeBuy(40, 0);
}, 100);
/*


STYLING AND MOD MENUS UNDER


*/


/** MOD MENU **/
let createModMenu = () => {
    let menuContainer = document.createElement('div');
    menuContainer.id = 'modMenu';

    menuContainer.innerHTML = `
        <h2 class="mod-menu-title">
        </h2>
        <div class="menu-item" style="margin-top: 0px;">
            <label style="cursor: pointer;">
                <div class="toggle-switch">
                    <input type="checkbox" id="fpsBoosterToggle" class="checkbox">
                    <span class="slider"></span>
                </div>
                <span class="menu-label">FPS Booster</span>
            </label>
        </div>
        <div class="menu-item" style="margin-top: 0px;">
            <label style="cursor: pointer;">
                <div class="toggle-switch">
                    <input type="checkbox" id="autoGatherToggle" class="checkbox">
                    <span class="slider"></span>
                </div>
                <span class="menu-label">Auto Gather</span>
            </label>
        </div>
        <div class="menu-item">
            <label for="instaKillType" style="font-size: 16px">InstaKill Type:</label>
            <select id="instaKillType">
                            <option value="normal">Normal Insta</option>
                            <option value="reverseInsta">Reverse Insta</option>
                            <option value="boostTick">Boost Tick</option>
                            <option value="oneTick">One Tick</option>
            </select>
        </div>
        <div class="menu-footer">
            Credits: SaVeGe
        </div>
    `;

    document.body.appendChild(menuContainer);

    document.getElementById('fpsBoosterToggle').checked = FPSBooster;
    document.getElementById('fpsBoosterToggle').addEventListener('change', (e) => {
        FPSBooster = e.target.checked;
        updateScreen();
    });

    document.getElementById('autoGatherToggle').addEventListener('change', (e) => {
        if (e.target.checked) {
            autoGather();
        } else {
            autoGather();
        }
    });
};

createModMenu();

let menuStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    #modMenu {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        width: 420px;
        background: rgba(30, 30, 30, 0.8);
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        color: #ffffff;
        visibility: hidden;
        opacity: 0;
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        transition: transform 0.6s ease, opacity 0.6s ease, visibility 0.6s ease;
        border: 1px solid rgba(255, 255, 255, 0.25);
    }

    #modMenu h2 {
        text-align: center;
        color: #ffffff;
        font-size: 36px;
        letter-spacing: 1.5px;
        margin-bottom: 20px;
        text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    }

    #modMenu .menu-item {
        margin-bottom: 15px;
    }

    #modMenu .menu-footer {
        margin-top: 20px;
        text-align: center;
        color: #ccc;
        font-size: 14px;
        font-style: italic;
    }

    #modMenu .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
    }

    #modMenu .toggle-switch input {
        display: none;
    }

    #modMenu .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 34px;
        transition: background-color 0.4s, box-shadow 0.4s;
        box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.3);
    }

    #modMenu .slider:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 4px;
        bottom: 2px;
        background-color: #ffffff;
        border-radius: 50%;
        transition: transform 0.4s, box-shadow 0.4s;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
    }

    #modMenu input:checked + .slider {
        background-color: rgba(0, 234, 255, 0.8);
        box-shadow: 0 0 15px rgba(0, 234, 255, 0.6);
    }

    #modMenu input:checked + .slider:before {
        transform: translateX(24px);
        box-shadow: 0px 4px 6px rgba(0, 234, 255, 0.6);
    }

    #modMenu .menu-label {
        position: absolute;
        font-size: 16px;
        margin-top: 5px;
        color: #ddd;
        margin-left: 10px;
        transition: color 0.3s ease;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    #modMenu select {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 5px;
        color: #ddd;
        padding: 10px;
        font-size: 16px;
        font-family: 'Poppins', sans-serif;
        width: 100%;
        margin-top: 5px;
        transition: background 0.3s, border-color 0.3s;
    }

    #modMenu select:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.6);
    }

    #modMenu select option {
        background-color: rgba(30, 30, 30, 0.8);
        color: #ffffff;
    }

    #modMenu select option:hover {
        background-color: rgba(0, 234, 255, 0.5);
    }

    #modMenu select:focus {
        outline: none;
        border-color: rgba(0, 234, 255, 0.8);
        background-color: rgba(255, 255, 255, 0.3);
    }

    #modMenu button {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #ffffff;
        border-radius: 5px;
        padding: 12px 20px;
        font-size: 18px;
        cursor: pointer;
        transition: background 0.3s, box-shadow 0.3s;
        width: 100%;
    }

    #modMenu button:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.6);
    }
    #leaderboard::after {
        display: block;
        font-size: 40px;
        text-align: center;
        margin: 0 auto;
    }
`;

let styleSheet = document.createElement('style');
Object.assign(styleSheet, { type: 'text/css', textContent: menuStyles });
document.head.append(styleSheet);

