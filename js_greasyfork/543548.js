// ==UserScript==
// @name         x-RedDragon Client
// @namespace    https://www.youtube.com/@x-RedDragonOficial
// @version      1.5.6.0
// @description  R=InstaNormal | T=ReverseInsta | Y=BoostInsta | G=BoostSpike | B=4Traps/Boost | C=4Spikes | ,=AntiTrap | M=AutoMills | F=Trap/BoostPad | V=Spike | N=Mill | H=Teleport/Turret | AutoBiomeHat | Esc=MenuGoldbot/Music | ClickRight=FastBreak | AutoHeal | AutoGG | AntiInstas | Visual Mods.
// @icon         https://i.imgur.com/AFJt4iq.png
// @author       x-RedDragonYT
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @require      https://update.greasyfork.org/scripts/480301/1322984/CowJS.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543548/x-RedDragon%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/543548/x-RedDragon%20Client.meta.js
// ==/UserScript==

//Utility
(function () {
    'use strict';

    let ws;
    const msgpack5 = window.msgpack;

    let boostType, spikeType, turretType = null, windmillType = null, foodType;
    let width, height, mouseX, mouseY;
    let myPlayer = {
        id: null, x: null, y: null, dir: null, object: null,
        weapon: null, clan: null, isLeader: null,
        hat: null, accessory: null, isSkull: null
    };
    let myPlayeroldx, myPlayeroldy;
    let automillx = 10, automilly = 10;
    let walkmillhaha = false;
    let healToggle = true;
    const keysPressed = {};
    const placementIntervals = {};
    let gInterval = null;

    let autoaim = false;
    let nearestEnemy = null, nearestEnemyAngle = 0, enemiesNear = [];

    let gameTick = 0, lastDamageTick = 0, damageTimes = 0, shame = 0, shameTime = 0, HP = 100;
    let anti = true;
    let primary = null;

    function storeEquip(hatId = null, accessoryId = null) {
        const hat = hatId !== null ? hatId : myPlayer.hat || 0;
        const acc = accessoryId !== null ? accessoryId : myPlayer.accessory || 0;
        doNewSend(["c", [0, hat, acc]]);
    }

    const cvs = document.getElementById("gameCanvas");
    if (!cvs) return;

    cvs.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        width = e.target.clientWidth;
        height = e.target.clientHeight;
    });

    function doNewSend(sender) {
        if (ws && msgpack5) ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
    }

    function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
        if (id == null) return;
        doNewSend(["z", [id, null]]);
        doNewSend(["F", [1, angle]]);
        doNewSend(["F", [0, angle]]);
        doNewSend(["z", [myPlayer.weapon, true]]);
    }

    function isVisible(el) {
        return el && el.offsetParent !== null;
    }

    function updateItems() {
        for (let i = 31; i < 33; i++) if (isVisible(document.getElementById("actionBarItem" + i))) boostType = i - 16;
        for (let i = 22; i < 26; i++) if (isVisible(document.getElementById("actionBarItem" + i))) spikeType = i - 16;
        for (let i = 26; i <= 28; i++) if (isVisible(document.getElementById("actionBarItem" + i))) windmillType = i - 16;
        for (let i = 33; i <= 38; i++) if (i !== 36 && isVisible(document.getElementById("actionBarItem" + i))) turretType = i - 16;
        for (let i = 16; i <= 18; i++) if (isVisible(document.getElementById("actionBarItem" + i))) foodType = i - 16;
    }
    setInterval(updateItems, 250);

    function toRad(degrees) {
        return degrees * 0.01745329251;
    }

    function getSecondaryWeaponIndex() {
        for (let i = 9; i <= 15; i++) {
            if (isVisible(document.getElementById("actionBarItem" + i)) && i !== myPlayer.weapon) {
                return i;
            }
        }
        return myPlayer.weapon;
    }

    function startPlacingStructure(key, itemId) {
        if (!placementIntervals[key]) placementIntervals[key] = setInterval(() => place(itemId), 50);
    }
    function stopPlacingStructure(key) {
        clearInterval(placementIntervals[key]);
        delete placementIntervals[key];
    }

    function performGSequence() {
    if (!nearestEnemy) return;


    const dx = myPlayer.x - nearestEnemy[1];
    const dy = myPlayer.y - nearestEnemy[2];
    const distance = Math.sqrt(dx * dx + dy * dy);


    doNewSend(["9", [nearestEnemyAngle]]);


    place(spikeType, nearestEnemyAngle + Math.PI / 2);
    place(spikeType, nearestEnemyAngle - Math.PI / 2);


    if (distance <= 150) {
        place(spikeType, nearestEnemyAngle - Math.PI / 4);
        place(spikeType, nearestEnemyAngle + Math.PI / 4);
    }


    place(boostType, nearestEnemyAngle);
    }

    function performBPlacement() {
    const base = myPlayer.dir;
    place(boostType, base);
    place(boostType, base + Math.PI / 2);
    place(boostType, base - Math.PI / 2);
    place(boostType, base + Math.PI);
    }

    function placeFourSpikesUp() {
    const firstAngle = -Math.PI / 2;
    place(spikeType, firstAngle);
    place(spikeType, firstAngle + toRad(90));
    place(spikeType, firstAngle + toRad(180));
    place(spikeType, firstAngle + toRad(270));
}

    document.addEventListener("keydown", e => {
    if (document.activeElement.id.toLowerCase() === 'chatbox') return;
    const k = e.key.toLowerCase();
    if (keysPressed[k]) return;
    keysPressed[k] = true;

//=== INSTAKILL NORMAL ===
if (e.keyCode == 82 && document.activeElement.id.toLowerCase() !== "chatbox") {
    storeEquip(0, 1);
    setTimeout(() => {
        autoaim = true;
        const primary = myPlayer.weapon;
        const secondary = getSecondaryWeaponIndex();

        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["z", [primary, true]]);
        doNewSend(["F", [1]]);
        setTimeout(() => doNewSend(["F", [0]]), 25);

        setTimeout(() => {
            doNewSend(["c", [0, 53, 0]]);
            doNewSend(["z", [secondary, true]]);
            doNewSend(["F", [1]]);
            setTimeout(() => doNewSend(["F", [0]]), 25);

            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["z", [primary, true]]);
                doNewSend(["z", [primary, true]]);
                autoaim = false;

                setTimeout(() => {
                    storeEquip(11, 1);

                    if (secondary === 15) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1500);
                    } else if (secondary === 12) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1000);
                    } else if (secondary === 13) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 400);
                    }
                }, 170);
            }, 120);
        }, 120);
    }, 120);
}

//=== INSTAKILL REVERSO ===
if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== "chatbox") {
    storeEquip(0, 1);
    setTimeout(() => {
        autoaim = true;
        const primary = myPlayer.weapon;
        const secondary = getSecondaryWeaponIndex();

        doNewSend(["z", [secondary, true]]);
        doNewSend(["z", [secondary, true]]);

        doNewSend(["c", [0, 53, 0]]);
        doNewSend(["F", [1]]);
        setTimeout(() => doNewSend(["F", [0]]), 25);

        setTimeout(() => {

            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["F", [1]]);
            setTimeout(() => doNewSend(["F", [0]]), 25);
        }, 90);

        setTimeout(() => {

            doNewSend(["z", [primary, true]]);
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 6, 0]]);
            storeEquip(11, 1);
            autoaim = false;

            setTimeout(() => {

                if (secondary === 15) {
                    doNewSend(["z", [secondary, true]]);
                    setTimeout(() => doNewSend(["z", [primary, true]]), 1500);
                } else if (secondary === 12) {
                    doNewSend(["z", [secondary, true]]);
                    setTimeout(() => doNewSend(["z", [primary, true]]), 1000);
                } else if (secondary === 13) {
                    doNewSend(["z", [secondary, true]]);
                    setTimeout(() => doNewSend(["z", [primary, true]]), 400);
                }
            }, 200);
        }, 500);
    }, 120);
}

//=== BOOST TICK ===
if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== "chatbox") {
    place(boostType, nearestEnemyAngle);
        storeEquip(0, 1);
    setTimeout(() => {
        const primary = myPlayer.weapon;
        const secondary = getSecondaryWeaponIndex();

        doNewSend(["z", [secondary, true]]);
        doNewSend(["c", [0, 53, 0]]);
        doNewSend(["F", [1]]);
        setTimeout(() => doNewSend(["F", [0]]), 25);

        setTimeout(() => {
            doNewSend(["z", [primary, true]]);
            doNewSend(["c", [0, 7, 0]]);

            if (nearestEnemy) {
                place(spikeType, nearestEnemyAngle);
            } else {
                place(foodType);
            }

            doNewSend(["F", [1]]);
            setTimeout(() => doNewSend(["F", [0]]), 25);

            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);

                setTimeout(() => {

                    storeEquip(11, 1);
                    if (secondary === 15) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1500);
                    } else if (secondary === 12) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1000);
                    } else if (secondary === 13) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 400);
                    }

                    doNewSend(["z", [primary, true]]);
                    doNewSend(["z", [secondary, true]]);
                }, 170);
            }, 170);
        }, 110);
    }, 100);
}

    if (k === 'm') {
        walkmillhaha = !walkmillhaha;
        doNewSend(["6", ["AutoMills : " + walkmillhaha]]);
    }
    if (k === 'f') startPlacingStructure(k, boostType);
    if (k === 'v') startPlacingStructure(k, spikeType);
    if (k === 'n') startPlacingStructure(k, windmillType);
    if (k === 'h') startPlacingStructure(k, turretType);


    if (k === 'g' && !gInterval) {
        performGSequence();
        gInterval = setInterval(performGSequence, 80);
    }

    if (k === 'b') performBPlacement();
    if (k === 'c') placeFourSpikesUp();
});

document.addEventListener("keyup", e => {
    const k = e.key.toLowerCase();
    keysPressed[k] = false;
    stopPlacingStructure(k);

    if (k === 'g' && gInterval) {
        clearInterval(gInterval);
        gInterval = null;


        doNewSend(["9", [myPlayer.dir]]);


        if (nearestEnemy) {
            place(spikeType, nearestEnemyAngle - Math.PI / 4);
            place(spikeType, nearestEnemyAngle + Math.PI / 4);
        }
    }
});

if (!WebSocket.prototype.__originalSend) {
    WebSocket.prototype.__originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        if (!ws) {
            ws = this;
            document.ws = this;
            ws.addEventListener("message", handleMessage);
        }
        return this.__originalSend(data);
    };
}

function handleMessage(m) {
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data = (temp.length > 1) ? [temp[0], ...temp[1]] : temp;
    if (!data) return;

    let item = data[0];

    // === Identificación del jugador ===
    if (data[0] === "C" && myPlayer.id == null) myPlayer.id = data[1];

    // === Actualización de enemigos y AutoMills ===
    if (data[0] === "a") {
        primary = myPlayer.weapon;
        gameTick++;

        for (let i = 0; i < data[1].length / 13; i++) {
            let obj = data[1].slice(13 * i, 13 * i + 13);
            if (obj[0] === myPlayer.id) {
                [myPlayer.x, myPlayer.y, myPlayer.dir, myPlayer.object, myPlayer.weapon,
                    , myPlayer.clan, myPlayer.isLeader, myPlayer.hat, myPlayer.accessory,
                    myPlayer.isSkull] = [obj[1], obj[2], obj[3], obj[4],
                    obj[5], obj[7], obj[8], obj[9], obj[10], obj[11]];
            } else enemiesNear.push(obj);
        }

        if (enemiesNear.length > 0) {
            nearestEnemy = enemiesNear.sort(
                (a, b) => Math.hypot(a[1] - myPlayer.x, a[2] - myPlayer.y) - Math.hypot(b[1] - myPlayer.x, b[2] - myPlayer.y)
            )[0];
            nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        } else nearestEnemy = null;

        enemiesNear = [];

        if (automillx === false) automillx = myPlayer.x;
        if (automilly === false) automilly = myPlayer.y;

        if (myPlayeroldy !== myPlayer.y || myPlayeroldx !== myPlayer.x) {
            if (walkmillhaha) {
                if (Math.sqrt(Math.pow(myPlayer.y - automilly, 2) + Math.pow(myPlayer.x - automillx, 2)) > 100) {
                    let angle = Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x);
                    place(windmillType, angle + toRad(78));
                    place(windmillType, angle - toRad(78));
                    place(windmillType, angle);
                    doNewSend(["D", [Math.atan2(mouseY - height / 2, mouseX - width / 2)]]);
                    automillx = myPlayer.x;
                    automilly = myPlayer.y;
                }
            }
            myPlayeroldx = myPlayer.x;
            myPlayeroldy = myPlayer.y;
        }
    }

        if (item == "X") {
            if (data[5] == 3.6) {
                let dir_1 = (dir) => Math.atan2(Math.sin(dir), Math.cos(dir));
                let a1 = dir_1((Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x) + Math.PI + Math.PI) % (Math.PI * 2));
                let a2 = dir_1((dir_1(data[3]) + Math.PI) % (Math.PI * 2));
                let a3 = a1 - a2;
                if (0.36 > a3 && -0.36 < a3) {
                    //doNewSend(["6", ["Sync Detect Test"]]);
                    doNewSend(["D", [Math.atan2(data[2] - myPlayer.y, data[1] - myPlayer.x)]]);
                    if (data[2] < 80 && data[2] > 0) {
                        doNewSend(["c", [0, 6, 0]]);
                        place(foodType);
                        place(foodType);
                    }
                }
            }
        }

        if (myPlayer.hat == 45 && shame) shameTime = 30000;
        if (myPlayer.hat == 45 && shame) shame = 30000;

        if (item == "O" && data[1] == myPlayer.id) {
            gameTick = 0;
            lastDamageTick = 0;
            shame = 0;
            HP = 100;
            shameTime = 0;

            let damage = HP - data[2];
            HP = data[2];

            if (damage <= -1) {
                damageTimes++;
                if (!lastDamageTick) return;
                let healTime = gameTick - lastDamageTick;
                lastDamageTick = 0;
                if (healTime <= 1) shame = shame++;
                else shame = Math.max(0, shame - 2);
            } else lastDamageTick = gameTick;

            if (data[2] < 100 && data[2] > 0 && healToggle == true) {
                setTimeout(() => {
                    place(foodType);
                    place(foodType);
                    doNewSend(["c", [0, 6, 0]]);
                    //doNewSend(["6", ["Heal"]]);
                }, 115);
            }

            if (data[2] < 48 && data[2] > 0 && anti == true && nearestEnemy && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
                healToggle = false;
                doNewSend(["c", [0, 22, 0]]);
                //doNewSend(["6", ["Anti"]]);
                place(foodType);
                setTimeout(() => {
                    place(foodType);
                    doNewSend(["c", [0, 6, 0]]);
                    healToggle = true;
                }, 200);
                setTimeout(() => doNewSend(["c", [0, 7, 0]]), 700);
                setTimeout(() => doNewSend(["c", [0, 6, 0]]), 1900);
            }

            if (data[2] < 62 && data[2] > 41 && anti == true && nearestEnemy && (nearestEnemy[5] == 5 || nearestEnemy[5] == 3)) {
                healToggle = false;
                doNewSend(["c", [0, 22, 0]]);
                //doNewSend(["6", ["Anti"]]);
                place(foodType);
                setTimeout(() => {
                    place(foodType);
                    doNewSend(["c", [0, 6, 0]]);
                    healToggle = true;
                }, 200);
                setTimeout(() => doNewSend(["c", [0, 7, 0]]), 700);
                setTimeout(() => doNewSend(["c", [0, 6, 0]]), 1900);
            }

            if (data[2] < 56 && data[2] > 50) {
                healToggle = false;
                setTimeout(() => {
                    place(foodType);
                    place(foodType);
                    doNewSend(["c", [0, 6, 0]]);
                    //doNewSend(["6", ["BHeal1"]]);
                    healToggle = true;
                }, 140);
            }
        }
    }
    // 🧠 Anti-Rotación
    Object.defineProperty(Object.prototype, "turnSpeed", {
        get() { return 0; },
        set(_) {},
        configurable: true
    });

setInterval(() => {

    // AutoAim
    if (autoaim && nearestEnemy) {
        doNewSend(["D", [nearestEnemyAngle]]);
    }
}, 15);

// === AUTO GG ===
let prevKillCount = 0;

function initAutoGG() {
    const killCounter = document.getElementById("killCounter");
    if (!killCounter) {
        setTimeout(initAutoGG, 500);
        return;
    }

    const observer = new MutationObserver(() => {
        const count = parseInt(killCounter.innerText, 10) || 0;
        if (count > prevKillCount) {
            prevKillCount = count;
            doNewSend(["6", ["<[GG]>x-RedDragon Client<[GG]>"]]);
            setTimeout(() => {
                doNewSend(["6", [`Kills : ${prevKillCount}`]]);
            }, 1500);
        }
    });

    observer.observe(killCounter, { childList: true, characterData: true, subtree: true });
}

initAutoGG();

// === FastBreack ===
const WEAPON_SPEEDS = {
  0: 260, 1: 360, 2: 360, 3: 260, 4: 260,
  5: 500, 6: 660, 7: 60, 8: 360,
  9: 560, 10: 360, 12: 660, 13: 170,
  14: 660, 15: 1460
};

let rightClickHeld = false;
let rightLoopRunning = false;
let lastAttackTime = 0;

function getWeaponReloadTime(id) {
  return WEAPON_SPEEDS[id] || 400;
}

function weaponReady(id) {
  return Date.now() - lastAttackTime >= getWeaponReloadTime(id);
}

function equipWeapon(id) {
  doNewSend(["z", [id, true]]);
}

function equipHat(id) {
  doNewSend(["c", [0, id, 0]]);
}

function swing() {
  lastAttackTime = Date.now();
  doNewSend(["F", [1]]);
  setTimeout(() => doNewSend(["F", [0]]), 12);
}

function isInUI(e) {
  const target = e.target;
  return target.closest(
    '#nameInput, .menuButton, .menuCard, #bottomText, #storeHolder,' +
    '#youtuberBtn, #adCard, .setNameContainer, .newsHolder, #gameUI,' +
    '.resourceDisplay, #killCounter, .uiElement, .actionBarItem, #itemInfoHolder'
  );
}

function rightAttackStep() {
  if (!rightClickHeld) return;

  const secondary = getSecondaryWeaponIndex();
  const primary = myPlayer.weapon;
  const weaponToUse = secondary === 10 ? secondary : primary;

  equipWeapon(weaponToUse);
  equipHat(40);

  if (!weaponReady(weaponToUse)) return;

  swing();

  const reload = getWeaponReloadTime(weaponToUse);
  setTimeout(() => {
    if (rightClickHeld) equipHat(6);
  }, reload - 20);
}

function rightAttackLoop() {
  if (!rightClickHeld) {
    rightLoopRunning = false;
    return;
  }

  rightAttackStep();

  const secondary = getSecondaryWeaponIndex();
  const currentWeapon = secondary === 10 ? secondary : myPlayer.weapon;
  const delay = getWeaponReloadTime(currentWeapon) * 2;

  setTimeout(rightAttackLoop, delay);
}

document.addEventListener("mousedown", e => {
  if (isInUI(e)) return;

  if (e.button === 2 && !rightClickHeld) {
    rightClickHeld = true;
    if (!rightLoopRunning) {
      rightLoopRunning = true;
      rightAttackLoop();
    }
  }
});

document.addEventListener("mouseup", e => {
  if (e.button === 2) {
    rightClickHeld = false;
    rightLoopRunning = false;
    setTimeout(() => equipHat(6), 100);
  }
});

function quickClick(button = 2) {
  if (
    document.activeElement &&
    (document.activeElement.tagName === "INPUT" ||
     document.activeElement.isContentEditable)
  ) return;

  if (button === 2) {
    rightClickHeld = true;
    setTimeout(() => {
      rightClickHeld = false;
      setTimeout(() => equipHat(6), 100);
    }, 100);
  }
}

// 🎩 AutoBiomeHatController optimizado
function autoBiomeHatController() {
    let normalHat = 12;
    let currentHat = null;
    let overridePause = false;
    let resumeTimeout = null;
    const movementKeys = new Set();
    const overrideKeys = new Set(["r", "t", " "]);

    function setHat(id) {
        if (id !== currentHat && myPlayer && myPlayer.id != null) {
            currentHat = id;
            doNewSend(["c", [0, id, 0]]);

            let accessoryId = null;
            if (id === 6) {
                accessoryId = 0;
            } else if ([15, 31, 12].includes(id)) {
                accessoryId = 11;
            }

            if (accessoryId !== null) {
                [40, 80, 120].forEach(delay => {
                    setTimeout(() => {
                        storeEquip(accessoryId, 1);
                    }, delay);
                });
            }
        }
    }

    function updateBiomeHat() {
        if (!myPlayer || typeof myPlayer.y !== "number") return;
        if (myPlayer.y < 2400) normalHat = 15;
        else if (myPlayer.y > 6850 && myPlayer.y < 7550) normalHat = 31;
        else normalHat = 12;
    }

    function updateHatLogic() {
        if (overridePause) return;
        updateBiomeHat();
        if (movementKeys.size > 0) {
            setHat(normalHat);
        } else {
            setHat(6);
        }
    }

    function pauseOverride() {
        overridePause = true;
        if (resumeTimeout) clearTimeout(resumeTimeout);
    }

    function resumeOverride() {
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            overridePause = false;
            updateHatLogic();
        }, 360);
    }

    document.addEventListener("keydown", e => {
        const key = e.key.toLowerCase();
        if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
            if (!movementKeys.has(key)) {
                movementKeys.add(key);
                updateHatLogic();
            }
        }
        if (overrideKeys.has(key)) pauseOverride();
    });

    document.addEventListener("keyup", e => {
        const key = e.key.toLowerCase();
        if (movementKeys.delete(key)) updateHatLogic();
        if (overrideKeys.has(key)) resumeOverride();
    });

    document.addEventListener("mousedown", e => {
        if (e.button === 0 || e.button === 2) pauseOverride();
    });

    document.addEventListener("mouseup", e => {
        if (e.button === 0 || e.button === 2) resumeOverride();
    });

    setInterval(() => {
        if (!overridePause) updateHatLogic();
    }, 250);

    console.log("AutoBiomeHatController activated.");
}

autoBiomeHatController();

// === AntiTrap ===
let antiTrap = false;
let intrap = false;
let trapAngle = null;
let trapId = null;
let trapOwnerId = null;
let antiTrapRunning = false;
let enteredTrap = false;

const FAST_ATTACK_TIMES_ALT = {
    0: 260, 1: 360, 2: 360, 3: 260, 4: 260,
    5: 500, 6: 660, 7: 60, 8: 360,
    9: 560, 10: 360, 12: 660, 13: 170,
    14: 660, 15: 1460
};

document.addEventListener("keydown", e => {
    if (document.activeElement?.id?.toLowerCase() === "chatbox") return;
    if (e.key === ",") {
        antiTrap = !antiTrap;
        doNewSend(["6", ["AntiTrap : " + antiTrap]]);
    }
});

function handleTrapData(node) {
    for (let i = 0; i < node[1].length / 8; i++) {
        const obj = node[1].slice(i * 8, i * 8 + 8);
        if (obj[6] !== 15) continue;
        if (obj[7] === myPlayer.id || obj[7] === myPlayer.clan) continue;

        const dx = obj[1] - myPlayer.x;
        const dy = obj[2] - myPlayer.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 90 && !intrap) {
            intrap = true;
            trapAngle = Math.atan2(dy, dx);
            trapId = obj[0];
            trapOwnerId = obj[7];
            enteredTrap = false;
            doNewSend(["6", ["Trap Detected"]]);

            if (!antiTrapRunning) {
                antiTrapRunning = true;
                antiTrapLoop();
            }
        }
    }
}

const oldHandleMessageTrap = handleMessage;
handleMessage = function (m) {
    const temp = msgpack5.decode(new Uint8Array(m.data));
    const data = temp?.length > 1 ? [temp[0], ...temp[1]] : temp;
    if (!data) return;

    if (data[0] === "H") handleTrapData(data);

    if (data[0] === "E" && trapOwnerId === data[1] && intrap) {
        intrap = false;
        trapId = null;
        trapOwnerId = null;
        antiTrapRunning = false;
        setTimeout(() => doNewSend(["c", [0, 6, 0]]), 100);
        doNewSend(["6", ["Trap Owner Disconnected"]]);
    }

    if (data[0] === "Q" && intrap && trapId === data[1]) {
        intrap = false;
        trapId = null;
        trapOwnerId = null;
        antiTrapRunning = false;
        setTimeout(() => doNewSend(["c", [0, 6, 0]]), 100);
        doNewSend(["6", ["Trap Cleared"]]);
    }

    oldHandleMessageTrap(m);
};

function getCorrectWeapon() {
    const primary = myPlayer.weapon;
    const secondary = getSecondaryWeaponIndex();
    return secondary === 10 ? secondary : primary;
}

function equipCorrectWeapon() {
    const weapon = getCorrectWeapon();
    doNewSend(["z", [weapon, true]]);
}

function antiTrapEnterSequence() {
    const a1 = trapAngle + (135 * Math.PI / 180);
    const a2 = a1 + (45 * Math.PI / 180);
    const a3 = a2 + (45 * Math.PI / 180);

    place(spikeType, a1);
    place(spikeType, a2);
    place(spikeType, a3);

    enteredTrap = true;
}

function antiTrapAttackStep() {
    if (!antiTrap || !intrap) return;
    if (myPlayer?.health !== undefined && myPlayer.health <= 0) {
        intrap = false;
        antiTrapRunning = false;
        setTimeout(() => doNewSend(["c", [0, 6, 0]]), 100);
        return;
    }

    const weapon = getCorrectWeapon();
    const attackDelay = FAST_ATTACK_TIMES_ALT[weapon] || 300;

    equipCorrectWeapon();
    doNewSend(["c", [0, 40, 0]]);
    doNewSend(["D", [trapAngle]]);
    doNewSend(["F", [1, trapAngle]]);
    setTimeout(() => doNewSend(["F", [0, trapAngle]]), 15);

    setTimeout(() => {
        if (antiTrap && intrap) {
            doNewSend(["c", [0, 6, 0]]);
        }
    }, 20);

    return attackDelay;
}

function antiTrapLoop() {
    if (!antiTrap || !intrap) {
        antiTrapRunning = false;
        return;
    }

    if (!enteredTrap) antiTrapEnterSequence();

    const delay = antiTrapAttackStep();

    setTimeout(() => {
        if (antiTrap && intrap) antiTrapLoop();
    }, delay);
}
})();

//AntiGrid
(function() {
    'use strict';

    const GRID_ENABLED = false;

    function waitForConfig(callback) {
        if (window.config && window.config.maxScreenWidth && window.config.maxScreenHeight) {
            callback();
        } else {
            setTimeout(() => waitForConfig(callback), 100);
        }
    }

    waitForConfig(() => {
        const maxWidth = window.config.maxScreenWidth;
        const maxHeight = window.config.maxScreenHeight;

        const CELL_SIZE = 50;
        const tolerance = 1.5;

        function isGridLinePair(x1, y1, x2, y2) {
            const isStraight = (x1 === x2 || y1 === y2);
            const isNearGrid = (coord) =>
                (coord % CELL_SIZE <= tolerance) || (CELL_SIZE - (coord % CELL_SIZE) <= tolerance);
            return isStraight && (isNearGrid(x1) || isNearGrid(y1));
        }

        let lastMoveTo = null;

        const originalMoveTo = CanvasRenderingContext2D.prototype.moveTo;
        const originalLineTo = CanvasRenderingContext2D.prototype.lineTo;

        CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
            lastMoveTo = [x, y];
            return originalMoveTo.call(this, x, y);
        };

        CanvasRenderingContext2D.prototype.lineTo = function(x, y) {
            if (!GRID_ENABLED && lastMoveTo) {
                const [x0, y0] = lastMoveTo;
                if (
                    x >= 0 && x <= maxWidth &&
                    y >= 0 && y <= maxHeight &&
                    isGridLinePair(x0, y0, x, y)
                ) {
                    return this;
                }
            }
            return originalLineTo.call(this, x, y);
        };
    });
})();

//Visuals
(function () {
    'use strict';

    const config = window.config || {};
    config.skinColors = [
        "#bf8f54", "#4c4c4c", "#896c4b",
        "#fadadc", "#ececec", "#c37373",
        "#000000", "#ecaff7", "#738cc3",
        "#8bc373", "#91b2db"
    ];
    window.config = config;

function addNamePrefix() {
    const input = document.querySelector('#nameInput');
    if (input && !input.value.trim().startsWith('x-')) {
        input.value = 'x-' + input.value.trim();
        pulseEffect(input);
    }
}

function pulseEffect(el) {
    el.style.transition = 'transform 0.2s ease';
    el.style.transform = 'scale(1.05)';
    setTimeout(() => el.style.transform = 'scale(1)', 200);
}

window.addEventListener('load', () => {
    addNamePrefix();
    const input = document.querySelector('#nameInput');
    if (input) {
        input.addEventListener('input', () => {
            input.value = 'x-' + input.value.replace(/^x-+/i, '');
        });

        input.addEventListener('blur', () => {
            if (!input.value.startsWith('x-')) {
                input.value = 'x-' + input.value;
                pulseEffect(input);
            }
        });
    }
});

    const css = `
    body {
        background: linear-gradient(135deg, rgba(15, 15, 15, 0.2), rgba(28, 28, 28, 0.2));
        font-family: 'Orbitron', sans-serif;
        color: white;
    }

    #mainMenu {
        background-color: black !important;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .menuButton {
        background-color: rgba(0, 0, 0, 0.6);
        border: 2px solid #ff3333;
        color: #ffffff;
        font-family: 'Orbitron', sans-serif;
        font-size: 18px;
        font-weight: bold;
        padding: 12px 28px;
        border-radius: 14px;
        cursor: pointer;
        box-shadow: 0 0 15px #ff0000;
        transition: all 0.4s ease-in-out;
        text-shadow: 0 0 6px #ff0000;
    }

    .menuButton.epic-hover:hover {
        background: linear-gradient(135deg, #ff1111, #ff0000, #cc0000);
        background-size: 300% 300%;
        animation: redPulse 3s infinite ease-in-out;
        box-shadow: 0 0 25px #ff0000, 0 0 50px #ff1111;
        color: #fff;
        transform: scale(1.1);
        border: 3px solid #ffffff;
    }

    @keyframes redPulse {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    #gameName {
        font-size: 80px !important;
        font-weight: bold;
        color: #ff2222 !important;
        text-shadow: 0 0 12px #ff0000, 0 0 30px #ff1111;
        animation: shimmer 3s infinite;
        font-family: 'Courier New', monospace !important;
        position: relative;
        top: -50px;
        text-align: center;
        transition: all 0.5s ease;
    }

    @keyframes shimmer {
        0% { text-shadow: 0 0 12px #ff0000, 0 0 30px #ff1111; }
        50% { text-shadow: 0 0 20px #ff3333, 0 0 40px #ff0000; }
        100% { text-shadow: 0 0 12px #ff0000, 0 0 30px #ff1111; }
    }

    #gameName::after {
        content: "𝕩-ℝ𝕖𝕕𝔻𝕣𝕒𝕘𝕠𝕟 ℂ𝕝𝕚𝕖𝕟𝕥";
        display: block;
        font-size: 1.1em;
        color: #ff4444;
        text-shadow: 0 0 25px #ff1111, 0 0 45px #ff0000;
        animation: glowtext 2s infinite alternate;
        position: relative;
        top: 10px;
        text-align: center;
    }

    @keyframes glowtext {
        0% { opacity: 1; }
        100% { opacity: 0.7; }
    }

    #loadingScreen {
        background: rgba(0, 0, 0, 0.2) !important;
        box-shadow: none !important;
        border: none !important;
    }

    #loadingScreen::before {
        content: "Cargando x-RedDragon Client...";
        font-size: 28px;
        color: #ff2222;
        text-shadow: 0 0 12px #ff0000;
        margin-bottom: 20px;
        animation: pulseText 2s infinite;
    }

    @keyframes pulseText {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
    }

    .menuCard, #bottomText, #storeHolder, #youtuberBtn, #adCard, .setNameContainer, .newsHolder {
        background-color: rgba(20, 20, 20, 0.2);
        padding: 20px;
        border: 2px solid #ff3333;
        box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 35px rgba(255, 50, 50, 0.6);
        color: #fff !important;
        animation: borderGlow 4s linear infinite;
        text-align: center;
    }

    @keyframes borderGlow {
        0% { box-shadow: 0 0 12px #ff0000; }
        50% { box-shadow: 0 0 25px #ff3333, 0 0 35px #ff1111; }
        100% { box-shadow: 0 0 12px #ff0000; }
    }

    #gameUI .joinAlBtn, a {
        animation: 5s infinite linear both normal redRainbow;
    }

    @keyframes redRainbow {
        0% { filter: brightness(1) hue-rotate(0deg); }
        100% { filter: brightness(1.2) hue-rotate(360deg); }
    }

    .resourceDisplay, #killCounter {
        width: 120px;
        margin: 0 auto;
        border: 3px solid #ff2222;
        border-radius: 12px;
        background-color: rgba(50, 0, 0, 0.3);
        color: #fff;
        padding: 8px;
        text-align: center;
        font-size: 14px;
        box-shadow: 0 0 10px #ff0000;
    }

    .uiElement {
        border: 2px solid #ff4444;
        background-color: rgba(40, 0, 0, 0.25);
        padding: 10px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        box-shadow: 0 0 10px #ff1111;
    }

    .actionBarItem {
        border: 3px solid #ff4444;
        border-radius: 50%;
        width: 65px;
        height: 65px;
        background-position: center;
        background-size: 55px 55px;
        background-color: rgba(255, 0, 0, 0.2);
        box-shadow: 0 0 15px #ff0000;
        transition: transform 0.2s ease-in-out;
    }

    .actionBarItem:hover {
        transform: scale(1.1);
        box-shadow: 0 0 18px #ff6666;
        background-color: rgba(255, 70, 70, 0.35);
    }

    #itemInfoHolder {
        position: absolute;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        width: 350px;
        background-color: rgba(0, 0, 0, 0.3);
        border: 2px solid #ff3333;
        border-radius: 12px;
        color: white;
        padding: 10px;
        font-size: 14px;
        text-align: center;
        box-shadow: 0 0 15px #ff0000;
    }

    ::-webkit-scrollbar {
        width: 12px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
        margin-top: 10px;
        margin-bottom: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #ff3333;
        border-radius: 0px;
        box-shadow: 0 0 12px #ff3333;
    }
    `;

    const style = document.createElement('style');
    style.innerText = css;
    document.head.appendChild(style);

    const observer = new MutationObserver(() => {
        const gameName = document.getElementById('gameName');
        if (gameName && gameName.innerText !== '𝕩-ℝ𝕖𝕕𝔻𝕣𝕒𝕘𝕠𝕟 ℂ𝕝𝕚𝕖𝕟𝕥') {
            gameName.innerText = '';
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("x-RedDragon Client Full Customization Applied.");

    const waitForMap = setInterval(() => {
        const map = document.getElementById("mapDisplay");
        if (map) {
            map.style.backgroundImage = "url('http://i.imgur.com/Qllo1mA.png')";
            map.style.backgroundSize = "cover";
            map.style.border = "3px solid #ff3333";
            map.style.boxShadow = "0 0 15px #ff0000";
            map.style.borderRadius = "8px";
            clearInterval(waitForMap);
        }
    }, 1);

    const title = "𝕩-ℝ𝕖𝕕𝔻𝕣𝕒𝕘𝕠𝕟 ℂ𝕝𝕚𝕖𝕟𝕥";
    let index = 0;
    function animateTitle() {
        document.title = title.slice(0, index + 1);
        index++;
        if (index <= title.length) {
            setTimeout(animateTitle, 150);
        }
    }
    animateTitle();

    const oldIcons = document.querySelectorAll("link[rel*='icon']");
    oldIcons.forEach(icon => icon.remove());
    const newFavicon = document.createElement("link");
    newFavicon.rel = "icon";
    newFavicon.type = "image/png";
    newFavicon.href = "https://i.imgur.com/vXgDJSp.png";
    document.head.appendChild(newFavicon);

    let frameCount = 0;
    let fps = 0;
    let ping = 0;
    let lastLoop = performance.now();
    let pingTimes = [];

    function updatePing() {
        const startTime = performance.now();
        fetch(window.location.href, { method: 'HEAD', cache: "no-store" })
            .then(() => {
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);
                pingTimes.push(latency);
                if (pingTimes.length > 10) pingTimes.shift();
                ping = Math.round(pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length);
            })
            .catch(() => ping = 0);
        setTimeout(updatePing, 1000);
    }
    updatePing();

    function updateFPS() {
        const now = performance.now();
        frameCount++;
        if (now - lastLoop >= 1000) {
            fps = Math.round(frameCount / ((now - lastLoop) / 1000));
            frameCount = 0;
            lastLoop = now;
        }
        requestAnimationFrame(updateFPS);
    }
    updateFPS();

    const statsContainer = document.createElement('div');
    statsContainer.id = 'fpsPingDisplay';
    Object.assign(statsContainer.style, {
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '22px',
        fontFamily: "'Orbitron', sans-serif",
        color: '#FFFFFF',
        textShadow: '0 0 3px #000000, 1px 1px 0 #000, -1px -1px 0 #000',
        background: 'none',
        padding: '0',
        borderRadius: '0',
        border: 'none',
        boxShadow: 'none',
        zIndex: '0',
        pointerEvents: 'none'
    });
    document.body.appendChild(statsContainer);

    function updateStatsDisplay() {
        statsContainer.textContent = `FPS: ${fps} | Ping: ${ping}ms`;
        setTimeout(updateStatsDisplay, 500);
    }
    updateStatsDisplay();

    window.getStats = function () {
        return { fps, ping };
    };
    const textureReplacements = [
        { test: "access_18.png", replaceWith: "https://i.imgur.com/0rmN7L9.png" },
        { test: "access_19.png", replaceWith: "https://i.imgur.com/sULkUZT.png" },
        { test: "access_21.png", replaceWith: "data:image/png;base64,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" },
        { test: "axe_1_d.png", replaceWith: "https://i.imgur.com/OU5os0h.png" },
        { test: "axe_1_r.png", replaceWith: "https://i.imgur.com/kr8H9g7.png" },
        { test: "axe_1_g.png", replaceWith: "data:image/png;base64,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" },
        { test: "axe_1.png", replaceWith: "data:image/png;base64,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" },
        { test: "bat_1_d.png", replaceWith: "https://i.imgur.com/phXTNsa.png" },
        { test: "bat_1_g.png", replaceWith: "https://i.imgur.com/ivLPh10.png" },
        { test: "bat_1_r.png", replaceWith: "https://i.imgur.com/6ayjbIz.png" },
        { test: "bow_1_d.png", replaceWith: "https://i.imgur.com/qu7HHT5.png" },
        { test: "bow_1_r.png", replaceWith: "https://i.imgur.com/Oneg3oF.png" },
        { test: "crossbow_1_d.png", replaceWith: "https://i.imgur.com/TRqDlgX.png" },
        { test: "crossbow_1_r.png", replaceWith: "https://i.imgur.com/EVesBtw.png" },
        { test: "crossbow_2_d.png", replaceWith: "https://i.imgur.com/DVjCdwI.png" },
        { test: "crossbow_2_r.png", replaceWith: "https://i.imgur.com/z4CyaXk.png" },
        { test: "dagger_1_d.png", replaceWith: "data:image/png;base64,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" },
        { test: "dagger_1_r.png", replaceWith: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAIABJREFUeJzsvXl8VNX9//96n3tnSTIJa9gFFJQlLS5oELUqbpAEArENuNRqf7bY1Za61Pr9/Or020Vqq37qp5vUVqu2tUahEkLwI25FRUAqokERVPZ9yTKZzHLveX//mCRMkpk7905mC9zn4zEPyJ1zzzkzc9/vc877vN/vQ7CxAeD1esW6descHo/H4ff7HU6n06HruqppmkMI4WRmVQhNAE5dShlSVTUshAgyc8jhcAQBhGpqavRsfw4ba1C2O2CTObxer2hoaHAFg8EiKeUwZm0MQGcxa+N0XYwRAsMAHgBQIQA3AAczK0TU5TlhZiYiycxhIvIBOMKMXULQ+wDeVVU0uFy8p6RkerPX69Wy8VltzGErgJOUDmFvbW0dwswTADmNSE5jFhMADGPmPCJS0tE2M+tEdJyIPwTEy4B41eVyNZx99tlNtkLILWwFcJLAzDR//nx3MNg8UtMwHeBrmGk6gJGIjOZZ7R6AJiJsYBbLHA750rBhY3YuWbIknOV+nfLYCqCPc8stt7gPHz5cwqx/iZlnA3wmQK5s9ysBASJsBvA4oNSXlpbutWcG2cFWAH0QZqa5c+cO0bTQDcz8dWY+K13T+QzQCtDLRPwHZvFWfX19c7Y7dCphK4A+hNfrFf/5z9ozNI0XMdNXAHiy3acUIpm5QVHEg/n5hf+qqalpynaHTgVsBdBHqKqqGhII+H8A4Ns4uQQ/BrxVCHFvcfGwlU888UQg2705memr08ZTBmamd95556JwOPg8gCoAzmz3Kf3QYGbM9/laPj9hwsT127ZtO57tHp2s2DOAHKa6ulppbW2+gRm/A1CY5uZYqIJIVaA4VShuB9Q8FYrLCcWlgFQBQIB1CRnWoLWFEW4NQGsNQYY0SE2mq1tbAeX6+vr6d9PUwCmNrQByFK/Xq65bt+47gHwAgCOFVYcdHpfD1b8A7iGFyB9ahBvW7ExJxf+4/HT4dh6Bb28jQs1t4NQphU15eShfuvTF/amq0CaCrQBykOrqasXv931L1/WHe2ndZyXPSflDClF4ejG+8s6+E28w9/jxGUA3p79e89j4/mj+7DBCTW0SgEi2HiK6t66ufjERcQq7d8pjK4Acg5lp9uyyBVLyk0hi5CdVIK+4EAMmDcdN6/d1VAoQRf7taAdxhL2jbBp48vxhOLp5L4LHWhnWn71Nquq8uLa21p+Ovp2q2AogxygrK7sQ0F8EqMjKfe5iD4aUnoEbXt9h/qZ4wp5GJQAAfzqjCI1bD0APWvL9Oaiqzs/V1tYeSVe/TkXUbHfA5gTXXjtzuN8v/0pkXvgLRw/Et49pQBuA7sKfSJA7ZgXdyxBFlggpUgJPnj8MTdsOIXDEFxH6zUn5+oSklHa0YYqxFUCOUFZW5goE+EEiPstMeeFUMLpsCq57+ZOY7zMz4HYCgZChIHOkcI8yvRH9Z64ch2Pv70HrvkbogTDjteYUaBJ+X0ppT/9TjK0AcgQi+UVmLDBT1lHoxh3sBGIIf8fITURAMJxwNKdutoHe8Ifh+WjZcRjyhS47dqmYRoSFEE+sWLEylGoj5amOrQBygLlz554WCgUeggkruVrgigh/DOKJcafQpGFt/4+rJuDQ2m1oO9jI2JaKkb4nRPQ3RXGusncAUk/S2zI2qcHr9arBoP/nAIYmKiucCu6MCvRj5ohQt4/glGgkT+Fo/+QXJuIhVWLnvzag7WAjkB6DcpiIfudy5d25fPnyljTUf8pjuwJnmYIC1xUALUZiZcynV02lku1H2/9qF3qiE6N6+78U9f8exLjeY0vQYKbw1OWT8fLuA2j8YAf0QChBl5MmDOBNIuUbBQWeJc8//7wvXQ2d6tgLqixSWVlZqGnBNcw4O1HZ4vNG49aPGyN/tAs/E534ATtGdhPT/S6b8DHKxdqkf2pGCQ6t2YxwY2uiriaLZMZuIegFIuWfQohN9p5/+rFtAFkkHA5fByQWfteA/E7hZykBIUDoJqQmhLizaLTQd79PSpDoOhn5w+iBaKpd2ytPvlgwsx8QW4RAnaLw8v79h2x98skn/fZaP3PYM4AsUVFRMUBKbROA0QmKyns8RScEz4whr71MPCXAUnYuHRjdFEK3+pdMHI5j72w18YnMwQw/M55TVXpeSvoPgMP19fXBlDWQBubNm9c/FApNYOYhAJrdbveHS5cuPXwyKCrbCJgFmJmk1G5EYuHHoCmjOn8jBk4Y8qLdersZ9jr+iqkmmCMjfCx7QQzl0tSwI1EXLUGEfCFwEZG6s76+fk8uCz8zU0VFxUWhUNuzzPpLgFwK6C+2tfnXlJeXf6+srMySt2YuYhsBs8DmzZuHaFroqUTuvorbge82RUXUtQtoF8MfovbyO4Q61sjeUUW03aDLGxwzPmCN3y+R+pniQCll2aRJ41/6+ONPDqe47pSxYcOGS5n15wBMAeACIABSiTAI4JnMmDZhwoQ3+nK+AnsGkGGYmQIB/00AjUxUdsRlE6LvA2Agid22+KhdoLsgZUQpSHliFtH+4g7F0pO0BPoTYYym4emqqqoh6ai/t1RUVJzBrP8D8bdniYivkDL8cllZ2YXM3CeX032y032ZsrKyYiK5jhmnG5VzFuXhB9J6GoAOr79O77+OHQMYhPoa2BUeVPWEln+1IA8Dzx2P4NEmNG7ZqVsJYSaih0tLL7zbalbg6upqT1tb23BmdimKcuy88847lKrMwvPmzesfDPrrAbrQ5C2NgPjqtGnTlnu93nRlRkkL9hIgw0yYMH4WM76OBMr3tJmfw+c+sz6zjF7TRy8VkhF+APi4dAL8uw9Hdh+6oXryUHzZOfj2nkace6AJFzQHsL1iqgjuPQoZMi2Lk/fvP7B827Zth8wU9nq9an6+65pQKPQQs36vlPJrUurz9+3bO3LSpMkNW7du7ZXDUHV1tbOtrfURgOZYuM0N8LX79+9rPOecczdt2bKlzwQt2TOADBJJ8dXyK2ZeZFROqAJ3u6Pyflpx4e3uD2BUh8l6n7p8Mo5v+hShxhZAMtR++SicPBq3rvs07j2/GZyPth0HzPUZ4p6VK1c+kMiqftNNNxUcPXr4Pmb+HmLnRtwGiAXJpg+L5GIo/46U8jdITjYkQA+pquO+vuLDYCuADFJdXe1sbW36PTPdmqjsmNln4/rXPgNgvKffgzTH8lvh4SIHgvuOmijJz3g8/W6uqamJ61pYWVk5IhwO/QXgmQkqOyqEWrlixYq1VrfpKipmXiUlr+jtwSpEVEOk3FZXV5fzxkHbCJhBSkpKJCB2mCl7cO2JSL/cEGdz/OWKyfhNcT5+GWg1KfwAIFSfzxdnc4KpvLz8/HA4+LoJ4QeAQVJqyysryy62YpibPXv2mVLib6k4VYmZq3VdWzF37tzTeltXurEVQAbxer0aM60GsCdR2cBRX9dFt5kgnliW/wzw+NWfw/+MLMKv9AAOLX8bbZ8dAGvml8FE2DZt2rQe5wR6vV519uyyBczaywDGW+jSIE2TSysqKkrNFK6unjlQ07S/A0jZjgQRLgqFAq+Wl5efk6o600FfGlxOCm655Rb3oUMHFjLLBxKNNoOmjMLXP43KnpNoep/h6f8fS4ajpWEXdF9bMjn+2uE2QLm6vr7+zeirN910U8GRI4fuZeYfJpsYlRkHnE6auXz5qs3xypSVlbmklEuEwFdMVmvVJfoYIL48bdq0F3Nxh8DeBcgwmzZt0mbMuOL95uamYgAXGJUNNfqx++qJJ3YD4qXwMt7HTymPXzkZ/25sxuvHmxDYfQQcsfYn3TARngTEY9u3b++cMlRWVo7w+VqeAPA1IupFJmF4pOQ5Z5551ovbt2/v4XBUXV2thEKB24lwl5n6xowdhYXf/DJ98P5HCAZNR0LmAfzF/fv3HZox44rNGzduzCklYM8AskRFRcUZUmrvwdoxXyxUQcLlwJkDPCgYNRBXvn8g7YL/58smoe3TfWjbcQh6W+o8d5npFSHEjStXrjwQ+ZupsnLWuZqGpwFMSlU7RPiMSK2oq6v78ETbTLNnzyqXEkth4rSlwiIPvi1P6KIn++Vj316zuxwAM+tCiAcUxfGzXNohsBVAlli0aFHeRx9t+V8Al/SmHqEKuIcNxMDzJ+LLq+POdC3zp9LT0bp1D0KHmyFDPZbnvaJdGJ5dsGDu3wcPHr7zscf+uk/XdVXXQ7N0nR8mwoCUNhhhGyDK6uvrPwGAOXNmlmgaXoGJdb+qKvjRj29H+IE/d7m+fOwwbPngY0udIOKniRy358oOga0AMozX6xUbN649R9PwAIDLkcJlmGtQERalYIB+2KMgfKgJMobzTwrQAQTy8twuEqQSEcKhcDAYDOlElG+loo7ch+b7yQ2q6ipXVTUQCPhXATjXzF0337oAw/9ZH/O9tRdMxuuvvm2y/c5+vK4ozhtXrFix1+KNKcdWABkkkgAkdAcz/xCAO03NyH4TR4tv7mlM6uaHPQqCB3JicDLE5XLi1ttuhK7reOyPT0PXTSurTcy8k4jmmil82YwLMX3DFsMy2ysuxdKalRYVJm8FlGvr6+uNK08ztgLIEOXl5WOk1B8nwoxMtKcW5mHwzPNxy6r3TN/z2IXjcOyVTZAyt8PcBxcPxKK7bkPL//0dAODIl+fgL0v+nvJ+nz5uNBYcNKdIj988D39e8ndoYSvhCHxYUcT82tr617OVW8BWABmgrKxsMiBfgLW97F5DqoLBV5+HW9eYS+jx+/HFaN4U+5yBXGHYaA++f9fX0fijruvx/Qtm4qnHn0/ZsqWoXyG+pVsTD3HHV/Hfv14Cf2ub6XuY2S8EfaOgoOjvNTU1GY8hsLcB08ycOXMmSqmtAoyj/9KCZLR9dgBbr/gcztuV2Ctvw4A8BE2OeFmAJ58/iBbsZgRe7unqX9jwCUYtmIWGzb3PXuRwqPjB3d8Ev2UtpIDXbsI0UtBQ6ECgzdw2IRE5AMwJhYLykku+sH7Tpk0piWg0i60A0khlZeUITQvVIcMjfxeY0bbzILZXnI9zPjloWHTTWcPR9pn5ra1MoToEps8aSddsNB5Z+3/4GYZWXYmPtmzvVXt353ssC3805+uEA2OH4djRJrO3CACX+/0tw0tKPv/vjz76KJB04xaJO8dhZqqqquoXDAZLhEAJgGJmtpOImoSIHMyymhmmjvqKghVHHjk9Q+DwDIHqKgSRgK61Iew7imDLfoTbGi3F3AOA4snDXSYOG/5lmw9s3qCWdgqKHPiuzLN0zwdXlWLFv1Yn1d5ZZw/EtZ+kZhD+9zln4a033rF0DxFeUlXXLcuXL9+XuHTviakAvF6veOedtefrOv0Xs7zS6vaMjXVIqCgYOhmVM6aYKh/SdHz26afY/N5/EA6b26fPHzcCtx80TrH/UL5A6FD2lwEOh4ozJg1G1afJ+cy8e9l5eLHuNUv3FI/Ix63NqR3jPpp5MV5YuqpH3sYEfCCEOj/acSldxFQA5eXlZzHrTyOBq6pNasgbeDqqZl2c1L3+QAivvfKS3th43MyMQBZXTBO3vh7/uXr03NE4vuYDw0ocDhUDBw0EEXC88dgxoZJTFXAKRVEBTsp1V1VcyHMXoLCoEOPGj8GFF02F76e/T6aqTt65+GysfnGNqbJ5BSq+l6Zx7uhNlXjisWcQtrZDsB9QqleuXPlWOncIeiiA9qQV/8XM98V63yal8IDiy6js6t5HjT7zbA2kltgLyDGgEHeEjX/Wxb5mDQZnRrhcTixypMuNIbWsvaAEr7+61rCMogrc5bbikZ0Ei27Gbx78E9r8lpb3PiLlltLS0mXpCiTqoa3dbrcb4HLYwp9uePDgspQIPwAsqP4ShJo4lD18vAV/mjbOsIxzUKHhPDgYDCH4zeusdTBLTN/QgEsujR8VrKgC02f1zM/aMWXvMnXvlo7dEg//Fff99E4MGmzJy9nDrP9j/fq3v19dXZ0wXiEZekwbJ0wYXhgM4l4iS0EqNhbp1286lZUlTAxsGiLC50pKsHnze3qiCDq9uRXTDfa4N505DMF9xxK0B4w9aFwmVxi9/wgGzZ6B3bv2dpmGe4qcmHbVCFz8Wldrfee5Ct0jLDtyLCYZdh14bR2maox9pw3F8eOmdwgUANeEw6GBkyZNXrN169aUHsgYQwFMyde08CIiWDO92phGVQegqmpaSuvsyAK8q9Elgs3GBmTNH9S/4HLHVRIXHGnFG6GgYYy/r7UV5+dI6svOMxAQ/9yD4k92Y9ZPF2H4iKE4Y9wYXHLZNFRWX4khf3mra13Rh67GoxdKAABKWgMInDMR+/Yab8tGtwiglFn//KRJJa9s3bo1ZQc09vgEVVVVgwIB/ycA+qWqEZsu8A03fNnUk9OZ2tsi/3xuGfSQ8TNSdN54fOvj+Il4f6UHDUN/FUXA+8B30Xrf45b7lyqYOeZJyIYnI8Wu6ITiMCnYvciA0sl7l1+AVXWvWN0heJdIuW7lypXWwhDjEG8UyG1n8D6MyzXK9HOTbJx/v9GJM2EFdhqPPs6hxmtVXZfYv7PZsEw64XjZj4HOg1MTPcTcsaaPd1qSAakwkJ392gbcfOt8qKoll45zmfXVs2fPmp6Kw0jiKQDDiokITqcLDofDfkW9zAjsF794ueH7FkeDmMwqHQkSxvvZ4Sbj/fW8sYnT4324ZZulfqWSHuvzOBh9n92PWGu/aLoPqRglhz1Tjx/cfRtcbku5SE/Tda4vLy+f6/V6e5XXM6mbiQAhCEII+9X+itjdjB8JIRIbcq2O+swc8yF3eowFmDXdsLML39kBJDgWbNfO7ISzm1WSPY5QT6KORPWnAvHI0/D+7A70H2Bp1d0PkP9ct27ttxYuXGj9CKmOtuNcN/x2IjMne5XQFQYzDF3yVHVg4lrifK/R21LRZeKNhO4BYxI1RX++xNhLWThVwwGi8Xh2PAZTIXi9riPFz3+T97f4RpgxZuwoK7c5ATyyZ8+un1dXVydltE9qCQAkvz49yTGcdzudg5KuuOP7Njv1rbjYeK8fALQW4+Aa4TReRlhIjNm3MCHc6Rr+rj/SjCnnTLZyCzHzXa2tLX+tqqqy/IDZRsAMoiiJXU0zqVgT5voTxivEbM0C091qwvqT3J0xS/n2PbjyGmupIpm5OhDwLy0rK7M0hUh6BmBjHWZr3pxpF7BED3GC5BqKkp1octPCZ3BQitE326X+bp6AnKGzFy54azOu//I8q21dCvDv5s2b19/sDfbJQCkjsotsVELTrB1c23HMd7pINMVPdMKvy9XrU7SSxrQhMI4ARR+dbrpNg/rSwZh/vYKbv3UDVIeVCEUuCwaDM81uESa9BLCNgDExVKjhsNmz8k6Q7AO3wkQaMLXQeEkiQ5qhBmiSGctb0QMiijyksZ7DqP39BJUkVgJRdWTD7jX8r7W405UPYWyPjcZBJK8qLy83FTuQJSMgdRqzsv1K1WonsqVsXJemm/b/7jVtx+If3d0OG+UKfGLWFCCBUTPkzO5KsdMLsEPg21/ccd1UJdRztIsO+ulNAFAKePDzBfg1+SE188tHKWWRatK7KN4PnPJPrKoOqGrS25VpIxwOQdd7nwGmQ6EYzYxYZi7dW8h3xDBrkHCqhhJiJjU4F7mA5hzYCegm7L316mMiUPt6P1u7Xb+Y0h/KR4fAa617WwqhfDp16tRQbW1t4rJxrqfsUwsh4HLl5aTwA4CUqYloYWaIBFZzAKh57sWUtGdE7esNSJQyTB1QaFhHcH/i5QoXZc8GkE46ZhbZEv7F/QGxdjfzsaSWWEeY6QWv12tqtElrjj9FUeFwpCWMOSXE86JLlnYFYHh6bDjU44zKlOPb/37CMgXjRwDv7Y77fviI8chDgkAFufvb9kV+MdIJ8ckxYI8EkhuEA0Twjhp12kazN6TNCJjrwg8AmpbaM+/alwEJpwH//OeylLYbzbJVbyVcapCq4DYD4QcAzWc8+jAANjHjsUnM/RM9WMwBiK1HAAtr/W7sI8LNo0aNWbJkyRLTD3ZajIB9QfgBpGTtHw0Rmdob1/VWLFv2RkrbBoBV6/ebMf7BNdTYJfnPX5gA1hMfs0P7shcNeDLwi3MHYLFLA72zD2hN2pYSJsLjRMpFdXWraqwIP9ALI2C8GUAs4e9uHLO6v93dGBP5GwCM643e5eme6CEi/B3+9T2DR09UEx1dzp27S93/jb7fzOdra9uBZcsIVVXJJQONxbHtLxsuP9qRjvFTBTa+FbdA08ZtQKJBQDLow8NYHPtdjv6XmZmImBRSgY4ovPYwXEGAaP8OBQEE6FKABQEKAQ4F7FKRN8yF73+YvW3HVHN/f4J4cxfQi+PMmPEWkbijoMCzoaamRk/GZpFUQpBINGD3kY7bo+KULtcigtBdIE78/0SQS9f3IkJ04u8OJRD9byyilUVU2Q6tSB0OEtT12+r+PWTM+uN0DsWXvnR1r+qor9+J48fXmBF+OIaMwB3++KnBfz+1FM2vr05FvouUQwqh4PR8fOdA3z3P5v4xbtDHR4Fwr4zP+4jo/wwaVFzz1FNP9So7UFJGQGZA13t+gMgJrenb6oqZqNGgXNT/O7cgci2IKRQ6iGeeeQ7XXfelpO5/7rnVCIUOAGa8OoWCgnMuAN56NW6Rtg+3ADko/ADAOsO3vRW/LlRxJ/etoyp+MakQtOUwqKFXyyYfgEdU1flwbW3tkVT0K94MYDsA0/7ENqlBVfuhqOh8zJo1PGHZpUtfQyCwx9So30HepCn43u4dcd9/9NJr0PjiMnAM5Z5rKPkK7hIF2e5GQn5x3gDQliOgo/6kHYqYWScSy1SVvVOnTv8wlSnC4ymAjwEkDl63SRdSUfKEqvaDEPkgUiBlELreDE1rAbN1AVUHD8GdAeM19CPjJsL/3vpk+5xx1ByfCdw/WAHtauzVOh/AJkDc4fF43qipqUm511WPJQAz6wA3A2QrgOwhdL0Num7+mGnDygoKUTj9cuDVVYblQnt3pKS9TKG1aFhcGMA9nFuHlNx/eh5o6xHQjt7MpHg/oNynqurfamtrkzsfzQQ9po/9+/cPEHFDuhq0ySwiLx+FX7gatyUQ/iUz50FvzlysQspoCeF+NbX+HMnyi5J+uJ+CoPcPAqFkhZ/biOgRQClduXLlY+kUfiCGAnj88ceDzOo/AE58zpRNTiM8/VB0eRm++Ubik3I5FAJS7BeRKaixDYvzstf3X5w/CPfn6xDr94BakhYbCdByVaULSksvXFRfX78nnWcCdhDT2jtv3rz+oVBgsZTya1aPobaJTcSQQ0EAbmQgD4Nj+CgUTrsMC1cnDggBgD9eeg0a658zEwbGAAcAOsKM3US0D8AxAEEAIJKKrpNDCHISsQOA68SL3czkbP/bCcABsAOAykwqETkYcAKMiHdARxlz8Igi/CiDvkm/KB0M+uw4aFcT0Ksj1bmBiO4sKCh6JR3rfCPibvdUVFQMkFK7EeBvADQOkR/NaHuo+6NzYme/3REk6npUjCVFUowymIjkifdItp/X0H4Nkhky8jdLgCQRdGZIZuhE0CPXoQPQANIB1gHSAKkRkSYlaUJA03VoQkSuA0Jn1qUQig5InVnoRLoEFL29Lh2AxpF0PlrHNSGELiU0IRDzXwAakdQAaEJQmFlpBHCASI7Xdf1XAE0w9xNZgxwO5JWch9u3WztZ+tEZs3C8riYpg1XEbkTNQmAXwO8TKesBuUlV3TucTufxkpKSQENDA5eUlFBDQ4Pw+Xzk8XiE2+0WgUCAfD6f8Hg85Pf7RX6+RoGAU6iqKsLhsENK7StSyp+aHoj6ucCDCwBmKADG9lPgUgBIjsgoM6Rk6DqDJUPXAalLHPfraA1GHj1ijnwPjPZw4M4P2vEkRv7VZG9DhY8A4ucA/lJfX58Vt0rD/V5mpvnz5xf5fL6RisLDpWQPsyAAOpEME0EjIo0Imq6LMBFpiqKHw2HSFEUJM7POzLrD4ZAAEAqFWFEUFkKwqgYZAAIBhVVVZUVROBAIMACoqsqRl58BwO9X2eFwsMPhYJ/PF9nYdzjY5XKx2+3mxsZGdrvdDAAFBQV88OBB9ng8PGDAAAaAESNGcPsDyPfdd197uHj6p1fxuP766wc3Nh6tBejCVNVJqgrnaacjr+RcfOM14/V+PB7QQpAJdgosEgBwGMDHANYJQesUhbe4XEUHSkpK/Ga2s7xer7p+/dt3MfPPkaP+CdbhNiLxF2ZaXF9fvyebPTlJvtC+RXX1zIE+H94DYCmBYwxY5OWT87TT4R43Ed9Y81KvKnt40GAEdyaOJeglIWbsJ6INRLwSUN4cMmTIrieeeCKu5lm4cKFjz56dP2PG3enuXDqJOKHJ1Yoi7p069cJ3zYbsprVP2e7AqUhZWdk1gFyFBEsqUlRiPZKWi4SiQggI1QnKK4Rz4FDcfvCzlPbrD5dchebVteAUR0kmIADwJiL6PbN4Id5U+JZbbnEfOrTvt8x0ayY7lyqY8TGRuNPj8byY6XW+EbYCyDBer1esX//WX5npy0blHP2H4A4t88Evv500Bb6Na4EUJUqxABNhtarSd5cvXxUzV1llZWWhprU9wSyuzXTnkoWZjwshHiBSHq2rq0ucZinD2Aogw7QbVz8GMNio3D2eogz1qCe/O7sU/vfWQfdZy2KcCoiw3uFwf+mFF16ImbCgqqpqUFtb27NEfEWm+2aREBH+RqT+bMWKFZ9l0+ZkhJ3RIcMQ6echgZs1qdnNpfDt99aj3zVz4Zl2KdRBxaAM5v9nRmkoFLw93nl3y5YtOyqEuJEZ8eOZswsD8jUi5eKCgqKv19XVfZqrwg8A9h5/hhk/fvx3AVxkVMZZfBqmh1PjBpwsUz/ZitLDB3CRrqNh1rVwDB4K4XREAoV0DZAybSHDzBgZCARrtm7dGtMesG3bNt+UKePrw2EeT0QT0tUPi0gAHwlBtxcU9PvxCy+8sGvLli05K/gd5MIXd8rQbsh6ldlw+4/v8RRptp5RAAAgAElEQVTl9O/y6NWVkC3N0I4fRvjwIehNxyD9reBwyFJ0ogEBIdQr6+rqDEf56upqT2tr83UAvsOMCYjvq9IjGQW3x4m3j85RvinEzCzbr8sOn5TI/9HuZ8ISoHBkOw+HAPEuEVYqivOt5cuXZ37d1AvSmhTUpiutra0uZjE4gbudBgveb9ngtpeW97i2ZM514IBfaM3HoR09DO3YEciWJuiBQDIGRYWZEz6bNTU1Pmb+c1VV1XOhUGisEHIEM9wANCkpLIQMMyshZg4JIcLMHFJVGQqHSROCNIfDIbv7pgQCCjscJ/xSon1Sov1RgsGg7NevnwwEAuFnn302nMvTfCNsBZBB3G635vM1J9pjy2nhj8fC//1Xz4tCwaNz5kNvboJ2aD8Cn26FbDMV29IqhNhvpmC74DUC2NT+yji5lmTGCrYRMIOMGzeujVkmzNn9oCOpo95TyqNXVmDJVXN6Xc9tL9dB7T8Q4WOHzQo/mPHu4MGDjdMW26SEvqu6+ihlZWXzAJkoL7h2j6coK7Oz35acg8AnH0P3NYPAEPkFcI4aC+eosfjGv//Xcn1/mH45Wt56FbLV3NI4EjSlVNXX15uLYrLpFfYSIMO43e41gYD/IIChBsXUhwuLsagl/YeIdMe34c3ONTsDkIE2aMeOwP/Bu/j1gIFwnzEBjlFjY9oBuvM/4yei9eU6SzYAIeifzLCuaWySwt4GzDDXXXddcO/ePSMAGAYCybYWXOLIrDnggXAYrMXxUmWGbPMjtG8XAtu2YN2AgfjPhM9j05TzMfXTj7sU/eNlM/F6+5rfSrQcEd5TVddNdXV1fTAzSd/EXgJkgdmzZ5+t66F1ABkerucePQnfP7Y3U93CYp/1iFRyOKEOKoZr7Hg4ho6EfvwofOv/DRmw5sfQ7itfXl9f/4nlTtgkjb0EyAJ5eXkftrYGVzNThVG5wJ6PgfzcznzL4RDCB/YifGAvSFEBsOWswpGR31lVW1ub2ugmm4TYuwBZoKamJsSs/ooTpfeVOh7Ki3s+S8qhHoe9WIN1zbLwM2MVoMyyhT872DOALDF06NB1Bw/ufxPApUblQod3MzLkGegYPBKhQ7sy0RQASCL6jxC0AeDq8vJZLYBoIZI+QGlRFN0HsJ/IHQyHw2FFUTS32x0uKCgIjh07NpTK3PinMrYNIIuUlZVdAciXkGAmRg4XfugyNBekjAddhQgf3ZsLR4N1uOi2p2LjEEA+AMekxG4h8C4R1gDKpoKCgsM1NTW5f5pJDpLtH/mUZuHChY5du3a+SIQZicqq/Ypxp565RM2/Fg5ozUc15PYskQEcAvAPQPx25cqVOR15l4vYCiDLzJ49s1TX+d+JdgQAwDl0NH7Q2piJbnXym+IxCB7YAdnWkguzAiN2ESnfLi0tXWkvD8xj+wFkmRtuuOng3r17igGUJiqrtzZhw6ARmB7KXKjwhf4mXCwIlzhd9M6wM6AH/IAezkVl0A/ga/bv37N227ZPMmbI6Ovk2o94SnLttTOHBwJ4kxmnmynvLB6NH7RldibQnYf7D0f4yG7IgD+nlIGUqBdCXJetNNt9DXsGkAN8+OEnvvHjz/oY4GqY+E10fxPezi/CRZnP29fJ9IAPFwuBS5wu2jjyTHA4AA4Hw8jyM0XEQx0OWrZ16/aD2exHX8H2A8gRpk2b9hKAn5strzUexgN6bti7vnd4F+4i4B5PkeMeTxEcg0ZCON1AxIKfYSg/HKZhmW+3b5IzUzcbYM6cOfnhcOCPROIm0zcpKu7Jy90jsgHgocJiyNZGyIAfrIUgdU0nIoH0PH+aEOo1dXV1r6ah7pMOWwHkGNXV1f2am5v/IQTKLNzGruHjKBvRg6nkN0POAKQGqWuAroP1EDgUhN7aBGne8NkohDq1rq4u7SecnAzYCiAHqa6eObC1Fc8w42or9yl5HtylnFyrul8xQW81HxzIzC8MGzbiOqOThmxOYCuAHKWqqmpQMOh/ghmzLd4qXcNPF4tajqalX5niobz+CB3eZTHJKLcJ4bgqUTJRmxPYuwA5ykcffdR21lkTV0mpjSCisy3cSrqvEW9KxsYR43Fhhh2HestDhcV4vfEw9Ei/rQxQLITyk/z8gn/2hXTcuYI9A8hx5syZk69poXuZ+R7TR2RHIZxuuMeU4Pb929LRvZTxUF5/hI/uBSe3tclE9D8FBYX31NTUZPdAhT6GrQD6AF6vV92w4e3rpOTfAyhMpg5SHXAOGYtFzbm1Pf4rUqG3HOvNeQIagF+oqvOXtbW15rKO2nRiK4A+AjPT7Nmzz5NSewrApF5UJZX8QuEYMgbfP5Idj9kH8/pBO34gFacQHwHEd0477bSlS5YsyeiRxicLtgLoY8yZM2ewpoV+CeAWpMCRi1QnlIL+cAwYgu+lSSH89+DR0I7th97aBNa1lNTJTK8Q0XdXrlz5oR0BmDy2AuiDtC8JqqSUvwFoeIqrl6SoglQnyOmGcOVDuPIgHC5AcYCE6GJPeGT4mZBaGNBCkCE/ZCAAGWoDhwOQ4ZCejN0iAceEoP8/P7/wyZqaGl+K6z7lsBVAH6a8vHwMoP2Mma5Dbsftp4IQEf1dURz3LV++fLc96qeGk8tr5BRj5cqVO0eNGvv/CaFeQ4T1SHDoYB9FI+LVQqgzSksv/Hptbe0uW/hThz0DOEmorKws1LTgPGb8GMD4bPcnBWjM9G9F4fuLi4e/YXv2pQdbAZxkVFdX9/P5fF8E5B2I7Bb0td+4lVnWqap4cMSIMe/a1v300tceDhuTRByItEuklN8n4suIKJdDBpkZu4Sgx4mUpy644IIddlqvzGArgJOc6upqxefzjSXiSmZeAPAUgLJ//HB7Qk8ifgmgvzGLt+wsPpnHVgCnEGVlZS5VVUdomlZKJGcCmC4ljyaiPKT/WWAAfmb+lIheFkJd7nQ6N6uq2min9M4etgI4RWFm+upXv+o6duzYQObQGVJiiqbxOUJgAoCRzBhIxPnMUC0k75AAdIDbAGoiwn6AP2ZWNioKb9J12g7gcH19febym9sYYisAm06YmX7yk58oGzdudLrdIXdbmyOPiAo1TesPYACRLCSiPGZ2EAkBsA4gyMwtzKKRiI4pitIEwO92uwMDBgwIPvroo5q9bWdjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2MZOx+ATSder1esW7fO4fF4HH6/3+F0Oh26rquapjmEEE5mVoXQBODUpZQhVVXDQoggM4ccDkcQQMjO7tO3sBXAKYbX6xUNDQ2uYDBYJKUcxqyNAegsZm2crosxQmAYwAMAKgTgBuBgZoWIujwrzMxEJJk5TEQ+AEfaE3u+D+BdVUWDy8V7SkqmN3u93tScB2aTcmwFcBLTIeytra1DmHkCIKcRyWnMYgKAYcycl4ajuwAAzKwT0XEi/hAQLwPiVZfL1XD22Wc32Qohd7AVwEkEM9P8+fPdwWDzSE3DdICvYabpAEYiMppntXsAmoiwgVksczjkS8OGjdlp5/3PLrYCOAm45ZZb3IcPHy5h1r/EzLMBPhMgV7b7lYAAETYDeBxQ6ktLS/faM4PMYyuAPgoz09y5c4doWugGZv46M5+Vrul8BmgF6GUi/oN9PkBmsRVAH8Pr9Yr//GftGZrGi5jpKwA82e5TCpHM3KAo4sH8/MJ/1dTUNGW7Qyc7tgLoQ1RVVQ0JBPw/APBtnFyCHwPeKoS4t7h42Er7YND00VenjKcUzEzvvPPOReFw8HkAVQCc2e5T+qHBzJjv87V8fsKEieu3bdt2PNs9OhmxZwA5TnV1tdLa2nwDM34HoDDNzbFQBZGqQHGqUNwOqHkqFJcTiksBqQKAAOsSMqxBawsj3BqA1hqCDGmQWrrO8+StgHJ9fX39u2lq4JTFVgA5jNfrVdetW/cdQD4AwJHCqsMOj8vh6l8A95BC5A8twg1rdqak4n9cfjp8O4/At7cRoeY2cOqUwqa8PJQvXfri/lRVaGMrgJylurpa8ft939J1/eFeWvdZyXNS/pBCFJ5ejK+8sy9lfTTLY+P7o/mzwwg1tUkAItl6iOjeurr6xfZRY6nDVgA5CDPT7NllC6TkJ5HEyE+qQF5xIQZMGo6b1scQeI7IDyPyAHRIU+fDQOl7LJ48fxiObt6L4LHWjuatsElVnRfX1tb609G3UxFbAeQgZWVlFwL6iwAVWbnPXezBkNIzcMPrO7q+wVEDZjfhZubIQxB9nTmiHNKoCP50RhEatx6AHrTk+3NQVZ2fq62tPZKufp1qqNnugE1Xrr125nC/X/6VyLzwF44eiG8f04A2AFHC3zmyGwhyzPeIUj4yPHn+MDRtO4TAEV9E6Dcn5esTklLa0YYpxFYAOURZWZkrEOAHifgsM+WFU8Hosim47uVPerzXZX7NnHBaz+2zhGiFkMwcvYNnrhyHY+/vQeu+RuiBMOO15hToFH5fSmlP/1OIrQByCCL5RWYsMFPWUejGHewEYgg/AJAJoe/aNnVdKiRRBwD8YXg+WnYchnyhy45dKiYUYSHEEytWrAylc2lyqmErgBxh7ty5p4VCgYdgwkquFrgiwh+HHut3swLTC8H6TYFA28FGxrZUjPQ9IaK/KYpzlb0DkFqS3pKxSR1er1cNBv0/BzA0UVnhVHBngkC/aAlkTp+8PPmFiXhIlVjsa0bbwcbuTaeKMBH9zuXKu3P58uUtaaj/lMZ2Bc4BCgpcVwC0GIkVMv8wrzCxkEVN3Tun9kmM7hzHGPjU5ZPx8u4DaPxgB/RAyHK9JgkDeJNI+UZBgWfJ888/70tXQ6cy9mIqy1RWVhZqWnANM85OVLb4vNG49ePGhHUmbbyLVhRxlMaDqo5wY2sytZtBMmO3EPQCkfJPIcQme88/vdg2gCwTDoevAxILv2tA/gnh79inR9R6v2OqH2PUjrnXH4voHQDmLnaEP4weiKYtO3rlyRcLZvYDYosQqFMUXt6//5CtTz75pN9e62cGewaQRSoqKgZIqW0CMDpBUXmPp0gYCXIXaYm1pWekBLqP/OhqSFwycTiOvbM18QcyCTP8zHhOVel5Kek/AA7X19cHU9ZAGpg3b17/UCg0gZmHAGh2u90fLl269HBfV1S2ETBLMDNJqd2IxMKPQVNGCaBdIOOM4hSpFGgXdCLqYgDsvLe9TKegd5/qE0XW/lHXmhp2WP58RhAhXwhcRKTurK+v35PLws/MVFFRcVEo1PYss/4SIJcC+ottbf415eXl3ysrK7PkrZlr2EbALLF58+YhmhZ6KpG7r+J24LtN5iLqqENwow2AiBr9gU7h7lhCdM4KYoz8Hazx+yVSP1scKKUsmzRp/Esff/zJ4RTXnTI2bNhwKbP+HIApAFwABEAqEQYBPJMZ0yZMmPBGX81XYM8AsgAzUyDgvwmgkYnKjrhsQsdNZuvuUb5TKUTZB6KvtV+IvB97hpGWQH8ijNE0PF1VVTUkHfX3loqKijOY9X8g/vYsEfEVUoZfLisru5CZ+9ySus91+GSgrKysmEiuY8bpRuWcRXn4gWwPBkxyKy8VmLH8qwV5GHjueASPNqFxy07dSggzET1cWnrh3VazAldXV3va2tqGM7NLUZRj55133qFUZRaeN29e/2DQXw/QhSZvaQTEV6dNm7bc6/WmKzNKyrGXAFlgwoTxs5jxdSRQwKfN/Bw+91n7zNKq8KdQYXxcOgH+3YfBsudzrXryUHzZOfj2nkace6AJFzQH8AWXW7ztEpAh07I4ef/+A8u3bdt2yExhr9er5ue7rgmFQg8x6/dKKb8mpT5/3769IydNmtywdevWXjkMVVdXO9vaWh8BaI6F29wAX7t//77Gc845d9OWLVv6RNCSvQTIMNXV1QozLkGC716oAte98mnyDaVwtnDL29swfOb5yB81BKonD2q+G+7hA1F85Tm4Ew58de3HPe65kx3IGzvMbBP9pJQVZqbQN910U8H69W//ghkvADwTwFAiDABwJjPfFQ4HXysrKzvX0geMgpnJ7/fdBuCrSdzulFL+t8/X8vM5c+bkJ9uHTGIvATJMdXW1s7W16ffMdGuismNmn43rX/sMQM99+bhkcakQi4eLHAjuO2qiJD/j8fS7uaamJq5rYWVl5YhwOPSXdsE34qgQauWKFSvWWt2mq6iYeZWUvKK3B6sQUQ2RcltdXV1OGwftGUCGKSkpkYDYYabswbUnIv1MCz/S6/9vhr9cMRm/Kc7HLwOtJoUfAITq8/lifkhmpvLy8vPD4eDrJoQfAAZJqS2vrCy72Iphbvbs2WdKib+l4lQlZq7WdW3F3LlzT+ttXenEVgAZxuv1asy0GsCeRGUDR309Ft0xRTtqX9/Akp92/mdkEX6lB3Bo+dto++wAWDO/DCbCtmnTpvU4J9Dr9aqzZ5ctYNZeBjDeQncGaZpcWlFRUWqmcHX1zIGapv0dQMp2JIhwUSgUeLW8vPycVNWZanJnrngKccstt7gPHTqwkFk+kGi0GTRlFL7+aZzsORlI3ZWIP5YMR0vDLui+tl7kD+E2QLm6vr7+zeirN910U8GRI4fuZeYfJpsYlRkHnE6auXz5qs3xypSVlbmklEuEwFdMVmvVJfoYIL48bdq0F3Nth8DeBcgCmzZt0mbMuOL95uamYgAXGJUNNfqx++qJJ3YDosniaP+bAS68frwJgd1HwBFrf9IdIcKTgHhs+/btnVOGysrKET5fyxMAvkZEvcgkDI+UPOfMM896cfv27T0cjqqrq5VQKHA7Ee4yU9+YsaOw8Jtfpg/e/wjBoOlIyDyAv7h//75DM2ZcsXnjxo05owTsGUAWqaioOENK7T1YO+aLhSpIuBzIH1qEfmcNw41vpCanvxF/vmwS2j7dh7Ydh6C3pc5zl5leEULcuHLlygORv5kqK2edq2l4GsCkVLVDhM+I1Iq6uroPT7TNNHv2rHIpsRQmTlsqLPLg2/KELnqyXz727T1gug/MrAshHlAUx89yJcrRVgBZZNGiRXkffbTlfwFc0pt6hCrgHjYQtzemNjb/T6Wno3XrHoQON0OGeizPe0W7MDy7YMHcvw8ePHznY4/9dZ+u66quh2bpOj/cvrWXarYBoqy+vv4TAJgzZ2aJpuEVmFj3q6qCH/34doQf+HOX68vHDsOWD3pugxpBxE8TOW7PhR0CWwFkAa/XKzZuXHuOpuEBAJcjhUsx16AiLErBAP2wR0H4UBNkDOefFKADCOTluV0kSCUihEPhYDAY0onI0v55R/yD+X5yg6q6ylVVDQQC/lUATPkM3HzrAgz/Z33M99ZeMBmvv/q2yfY7+/G6ojhvXLFixV6LN6YUWwFkmEgCkNAdzPxDAO40NSP7TRwtvrkncfKQWDzsURA8kPXBKSEulxO33nYjdF3HY398GrpuWlltYuadRDTXTOHLZlyI6Ru2GJbZXnEpltastKgweSugXFtfX29ceRqxFUAGKS8vHyOl/jgRZmSiPbUwD3eytYOFHrtwHI69sglS5naY++DigVh0121o+b+/AwAc+fIc/GXJ31Pe79PHjcaCg+YU6fGb5+HPS/4OLWwlHIEPK4qYX1tb/3o2cgvYCiBDlJWVTQbkC7C2l91rSFUw+OrzcOsacwk9fj++GM2bYqcazxWGjfbg+3d9HY0/6roe379gJp56/PmULVuK+hXiW7o1ERF3fBX//esl8Le2mb6Hmf1C0DcKCor+XlNTk9EYAnsbMAPMmTNnopTaKsA4+i8tSEbbZwew9YrP4bxdib3yNgzIQ9DkiJcFePL5g2jBbkbg5Z4nhRc2fIJRC2ahYXPvsxc5HCp+cPc3wW9ZO5Gc127CNFLQUOhAoM2cUZaIHADmhEJBecklX1i/adOmlEQ0msFWAGmmsrJyhKaF6pDhkb8LzGjbeRCXqAl3urDprOFo+8z81lamUB0C02eNpGs2Go+s/T/8DEOrrsRHW7b3qr278z2WhT+a83XCgbHDcOxok9lbBIDL/f6W4SUln//3Rx99FEi6cQsYzm+YmaqqqvoFg8ESIVACoJiZ7USiJiEiB7OsZoapo76iYMWRR07PEDg8Q6C6CkEkoGttCPuOItiyH+G2Rksx9wCgePJwl4nDhn/Z5gObN6ilnYIiB74r8yzd88FVpVjxr9VJtXfW2QNx7SepGYT/fc5ZeOuNdyzdQ4SXVNV1y/Lly9N+lntcBeD1esU776w9X9fpv5jllVa3Z2ysQ0JFwdDJqJwxxVT5lWt3oHnPfyDD5n1K8seNwO0HjVPsP5QvEDqU/WWAw6HijEmDUfVpcj4z7152Hl6se83SPcUj8nFrc2rHuI9mXowXlq6yGqT1gRDq/GjHpXQQVwGUl5efxaw/jQSuqjapIW/g6aiadXFS965YsxVNu9abnRHI4opp4tbX4z9Xj547GsfXfGBYicOhYuCggSACjjceOyZUcqoCTqEoKsBJue6qigt57gIUFhVi3PgxuPCiqfD99PfJVNXJOxefjdUvrjFVNq9AxfcMxjnT6dVjcPSmSjzx2DMIW9sh2A8o1StXrnwrXTsEMT9JdXW10tra8l/MfF+8MjYpgwcUX0ZlV/c+avSZZ2sgtcReQI4BhbgjbPyzLvY1azA4N8LlcmKRI11uDKll7QUleP3VtYZlFFXgLndsj+x4gm9ZISy6Gb958E9o81ta3vuIlFtKS0uXpSOQKKamdrvdboDLYQt/uuHBg8tSIvwAcN38agg1cSh7+HgL/jRtnGEZ56BCw3lwMBhC8JvXWetglpi+oQGXXBo/KlhRBabPip2ftTNtegwh75Jq3QwP/xX3/fRODBpsycvZw6z/Y/36t79fXV2d2IprkZhTxgkThhcGg7iXyFKQio1F+vWbTmVlCRMDdxIrK1D3a58rKcHmze/piSLo9OZWTDfY49505jAE9x0z7A8RMPagcZlcYfT+Ixg0ewZ279rbZRruKXJixrShKH0zYq3vHl5Ncc5HjKZD/M1EZgZeW4epGmPfaUNx/LjpHQIFwDXhcGjgpEmT12zdujVlQR9xFMCUfE0LLyKCNdOrjWlUdQCqqqaZKtsh5PEesO7XdzW6RLDZ2ICs+YP6F1zuuErigiOteCMUNIzx97W24vw+kfoyQvEnuzHrp4swfMRQnDFuDGZMGIfLjvow7FNf17ToFvMsdCoJC7aBktYAAudMxL69B83eQgBKmfXPT5pU8srWrVtTckBj3AeAyM4WlEa4uHh2SirqfgIQAMy+dCIUZ0Gi+5Tfn2UcBKfkuQyf6JYmHwp+Ejt3ZvT5BNG94/ZrYO7Rb44+tajbfV3q7AXHf/wIRta8iImr3kC/1WvBjTF2RDoOVElPIFQnV235DGWzr7SU04EZs8PhYH15ebnVreWYGAl5bjuD92FcrlE0Y4b5gz4SPSCxlEC/0YkzYQV2Go8+zqHGa1Vdl9i/s2u2og4h7uxz++jYeb39WpfRNrrv3Q8xYY4IYqzvIYYSMQPHUC7dISJApH8MPPu1Dbj51vlQVUsuHecy66tnz541vbeHkRh9QsOKiQhOpwsOh8N+Rb3MaPP+/c1v91mZhkYzq3QkSBjvZ4ebjPfX88YmTo/34ZZtXfsR6Uzs/sUymHU/ragb3P0Eo273IobyS4TRcqpLOUu1Js+wZ+rxg7tvg8ttKRfpabrO9eXl5XO9Xm/Smqo3qZYgBEEIYb/aXxG7m/HDKIQTV15pPkKvN9Nep8dYgFnTDStf+M4OIMGxYLt2RoWzm0hJzuj6mRKNxpRgBtRxEGrHbKDLMqJbu0lh9ki2ZOtvRzzyNLw/uwP9B/Szcls/QP5z3bq131q4cKG1sM+Odg3eM/xMke/YXiV0hcEMw9Q5qjrQUo29yfnnHjAmYfV/vsR4KSmcquEg0Xg8ymPQzKjazareKcCxSKBQOFrQ20f1LmceSnnCQh9dp4XnttNmYVjI5JkNCWjy/hbfCDPGjB1l5TYngEf27Nn18+rqastG+6SXAEB2s9HmMIbzbqdzkKXKeqNkKy423usHAK3FOLhGOI2XER2JMbMxGBgdlw5mQIieD7HFZ5aQQAmk4SCW6480Y8o5k63cQsx8V2try1+rqqosPWC2ETDDKIq1kIp0K9mEuf4SGMI4agTOJAmnp0YzB9ONcOdx6mg/Ur2z/o7lRkc7KVaA5dv34MprrKWKZObqQMC/tKyszPQUolczABvrMOdOlB2AxIKbYCtMUSLW67Q8LEZrfyOBM7FrYoZOJ4j2tjrv6n6UepqOY7vgrc24/svzrNZ9KcC/mzdvXn8zhe29/pQSeVyMSmhacgfXxppiJ5p2v/SecdQfkHiKn+iEX5fL+ilaPfwC4pVL97LCoP4u269G7r5pPotxzL9ewc3fugGqw0qEIpcFg8GZZrYIe7UEsI2AMTFUquGw2bPyuhJr1Eo0kgWbEyecVQuNlyQypBlqgCZ5IrCFzRjYuhnMDC38Vvzso/tglo4txO6vWP3qPtXvvgRII8P/Wos7XfkQxvbYaBxE8qry8vKEsQNGasWUETB5JUA5c4ht5CP0XplFZobG34mmm/b/7jVtxxIeL863rtma6FcwHHp+EDjxUHZ89rgVxhKYjnV2PGHqUALdYyDi+OhbspkkY73v5uCUKX5NfkjN/PJRSlnkcDgTehcZ/bgpH95V1QFVTWq7Mq2EwyHoeu8zwHRsQxkpAJYaVq9uxlVXFfW6vUSEfEcMcwQIp2r4DD96zmnAGw2W2qTuI2U7ndtx8RyBYtzX6Y/fXbFEeQnGVBoGI7OhgspBfukMgY9Zzw4mhPLp1KlTQ7W1tcblDN5L2fckhIDLlZeTwg8AUqYmooWZIUy4jx5vNI5NTwW1rzcgUYIQdUChYR3B/cktVwB0cemNuUefwLuvi5EN6HpvO/HUbFz123F8enQ77X/n4mJ2cWsLJzPHKawAABOWSURBVCP8AI4w0wterzfhqJZ2I6CiqHA63TnrM9DpPZYi2hWA4VwtHDqMV15J7VFb3fHtfz9hmYLxIwzfDx+JcypxOySy+5vGm210zsKir0f9ztGxCV2Cjyw6CaWLxQEfFvuageT8/ANE8J522mkbzRTu1RIgkeAoigqHI+U5DFKKpqVWENtHOpHouzl8eAWAqpS23cGyVW+BpbHyJ1XBbe/tNiyj+YxHn+yLSjtxDKTMDGoX7OjlGUfNLqKt/Zky6sVjMQeA1l6F+u8jwqJRo8YsW7JkiakHO21GwL4g/ABSsvaPhoigKAo0Y+M5dL0Vy5a9gaqqXp0L2oNV6/ebMf7BNXQg0BQ/fdifvzABXL/BMB9AX4FEV0Nlx2jf3Q25Sy6AyIWM9G+xSwOO9uqw4DARngaUn9TV1e2ykj8wLTOAWMLfXVlY3UHoHhYb+RsAjOuN3knqnAK21xMR/vZ1IXc6fUa10fm/jtrQ7u/fxTh9YuCw9vna2nZg2TJCVVVyyUC789KrjTi2/2WJxEs76Rg/VWDjW3ELNG3cBiQSfsmRqWpsOPpfZmYiYlJIBTrW9JEvjgQBov07FAQQoEsBFgQoBDgU3OO3foRFLCHunOYb2SA6ApRS5ONvxGJ/C+BLfi7FjLeIxB0FBZ4NNTU1utX+xixdVVU1KBDwfwIgbmgSESBE9x+F26PilC7XIoLQXSCirL0dxpluAhcRohN/dyiB6H9j0X1a1162Y0pEHQ4S1PXb6v5dZGzkczqH4ktfurpXddTX78Tx42vMCD8cQ0bgDn98J6HfTy1F8+urc3L0J4Xwwzxj46UhJl2XGYi/NZkCFgdbgXCvjM/7iOj/DBpUXPPUU08lnR0oaQVgk1qEcGPQoKtx9dXWv/LnnluNUMjkaT5CwT35xtmCHsz3IHwo7WdS9Aq1UMWdbODEFEd4WcouSwJD0qAA7ucAqHfrfB+AR1TV+XBtbe2R3vYno34ANvGRMoDDh2vx7LP9UFR0PmbNGm5Y/uWXA2hqehuBwB5To34HeRNKgN07DMtoR03nqcsaWouGX+W34i7RU5kZZVHK1pTmfrcOOuo3jmEwgJl1IrFMVdk7der0D1OVItxoBvAxAGvB6zapRCpKnlDVfhAiH0QKpAxC15uhaS1gtj59VAcPwZ0BY8v+I+Mmwv/e+mT7nHESzgS6Y2VUT9EMYLG/BejdseWbAHGHx+N5o6amJmUZgYE4MwBm1gFuBshWANlD6HobdN38MdOGlRUUJhR+AAjt3ZGS9jKF1qJhcWEA93C3Q0riLQEy6MK7ONQKhHqzzuf9gHKfqqp/q62t7dU2QTxiKoD+/fsHDh1qbWCmselo1CaziLx83G1yJNObMxerkDJaQri/v4IfaYk9TQ1diKOJ3g60yP0UBLUkPqHJoPE2IvEnZvGrlStX7k3XsWBAnLXj448/HmRW/wFwbz6FTQ4gPP1wt2IhlDTFfhGZghrbsDgvqu8GAs4mlaHVLbX783Usbm3pjfBLgJarKl1QWnrhovr6+j3pFH7AQMHNmzevfygUWCyl/JrVY6htYhMx5FAQgBsZcMN2DB+FO1qM3Xm7s7i12Yz5lwEOAHSEGbuJaB+AYwCCAEAkFV0nhxDkJGIHANeJF7uZydn+txOAA2AHAJWZVCJyMOAEGBHvgI4y5rjH0y3IyiBgiAmIuSBIYu2/uM0H9OpIdW4gojsLCopeSfU63wjDT1lRUTFASu1GgL8B0DhEfjSje7o/OlFZlCKOIFHXoxyviSMlwEQkT7xHst1zs/0aJDNk5G+WAEki6MyQzNCJoEeuQwegAaQDrAOkAVIjIk1K0oSApuvQhIhcB4TOrEshFB2QOrPQiXQJKHp7XToAjSPpfLSOa0IIXUpoQiDmvwA0IqkB0ISgMLPSCOAAkRyv6/qvAJqQ+CeyDjkcyCs5D7dvt36ydLIGq4jdiJqFwC6A3ydS1gNyk6q6dzidzuMlJSWBhoYGLikpoYaGBuHz+cjj8Qi32y0CgQD5fD7h8XjI7/eL/HyNAgGnUFVVhMNhh5TaV6SUPzU9EPVz4R79RKKSzghAZrAQnfv73SMD69w6tuqMICIuxJDc/qRylFsTdzyJkX812dv4gSOA+DmAv9TX11vT1ikgoZpjZpo/f36Rz+cbqSg8XEr2MAsCoBPJMBE0ItKIoOm6CBORpih6OBwmTVGUMDPrzKw7HA4JAKFQiBVFYSEEq2qQASAQUFhVVVYUhQOBAAOAqqocefkZAPx+lR0OBzscDvb5Iq5TDoeDXS4Xu91ubmxsZLfbzQBQUFDABw8eZI/HwwMGDGAAGDFiBLc/gHzfffe1B4Sld3plxPXXXz+4sfFoLUAXpqpOUlU4Tzsdiw4nv433gBaCNGEstEAAwGEAHwNYJwStUxTe4nIVHSgpKfGb2c7yer3q+vVv38XMP0cOOiclB7cRib8w0+L6+vo92erFSfJl9j2qq2cO9PnwHgBLOaBjwCIvn5ynnY7v7zMO7jHDw4MGI7gzcSxBLwkxYz8RbSDilYDy5pAhQ3Y98cQTcTXPwoULHXv27PwZM+5Od+fSScSuIFcrirh36tQL3zUTspvW/mSz8VOZsv/X3r0HR1XdcQD//s69u9nsJpIgiCBIlBRBKiCYCKJWwYKxJBraTBmLM9iOWBWdjrUzTmdqccZpazt2phV5zXRq61ir6ZQhcROsWPEB8igCUl7hFQMBkkAgZB937+P8+sfGio9ks8nu3Q05nxlmYOfcu79h9549z98pK5sLyPVI0KUiTSd24juLSGg6hIDQvaDcfHiHjoBn2Gg8sveDlMb2vBEFp3iXZAIGwLuIaAWzWNddU3jx4sW+1taTy5npR24GlyrMaCAST+Xl5b3lZj+/J6oCyIBly5aJbds2/4WZFvVUzlNwBfJvnAMm0bUNifDwtpq0x7d84mSEdnwEpChRShKYCBt0nR6vqVl/8OsKVFRU5Nt29GVmscDt4PqKmc8JIX5LpK0OBoPnMh3PxVQFkAFdg6sNAIb1VC7vm7djaeMul6L6opemlCKyeyucUN+yGPcHEbZ5PL7vrVu37mv7NJWVlZdHo9E3iHi227ElySTCq0T6c2+++eaxTI45dUelBc8AImcaEiyzJt0L74irXYroqx7bvQ0/AyHv5tuhXz4cpLk3E8yMUtOMPdHdeXdr1649K4T4ATO638+cWQzIjUTarEDgsoeCweDRbHz4AUDN72dAcXHx4wBu6amMd/gYLD2WmV//i5W2ncYtjoNbPV7sLrkNwusBO058wZCUadsyzIyrDCNWffDgwa8dDzh06FBo8uTiesviYiK6Ll1xJEkCOCAEPREIDHlm3bp1Tfv27cvKB/8z2fCfNqh0DWS9y9zj9B9fVlJGj+7f5FpcfbFyxh2wz7XBamuF09EOGQmDLTOp3Yk9MITQ5wSDwR5/5auqqvLC4QsLASxlxnXofq3KV5JRcFdCia5f54vWphAzs+x6XX62JiX+d3StM2EJkBWfzkMrIHYSoU7TvJtramrc7zf1UTLHjSgpEA6Hc5jFsATL7WwtrzA7Uyhf5JEtG7/4Qo4PyPGJl6aWwD7bBrv9DGRnBxzD6MuAosbMCb+f1dXVIWb+U2Vl5T9M0ywSQo5ihg+ALSVZQkiLWTOZ2RRCWMxs6ro0LYtsIcj2eDzyy2tTDENjj+fzdSkXr0m5eD1KLBaTQ4YMkYZhWG+88YaVrc38nqgKwGU+n88OhS4kmmPzOB39zvWQMY/t2v75P4QG+ANYUXIr7NZTMI4ehIz2amNbWAhxqjcFux688wB2df1xXbZmvU5EDQK6bNy4cVFmmTBnd/TYbjfCcc2j2z+E1d7W24cfzNg5bNiw/q9sUno0MKutAa6srOw+QK5NUMwumLVA//HuDa7EdLHlk6bCONIAJ3QBBIbwB+AdXYQnjjb06X4rZ96Bzs3vQoZ71zWOb5rSKuvr63s+1kbpN9UFyACfz/eBYURaAIzooZgePep+K+CPY7+ByPZN/++zMwBpRGG3n8FvhAa9cCh8116Hpfs/6dX9XiyegPA7waTGAISg15nxr77EryRHdQEyYMqUKecAvJaonNn6KVZPv8eFiOJW3jAbxuF93T+s0oF9tg2h7R/iN9EIXsjLx/Ibpnd7vxdy/Qjv2pbUw0+E3bqe82R9fb3KReECtQ4gAzZu3MgTJkw8zew8CFD3rTCWADuYEXVnVmmLLw/m6V5uBGIJGeqEeaIRm5ixtaAQH4+fhNLW01gxbSbePX4MzoXzSb0/MxoAcW8wGFR9f5eoFkCG5Obm7ifihB1840QDVt04z42Q+rz2ny0T1ulmhLa8h+ejEXRu2gBpJJfLkAi7PR7v3fX19Uf6FITSJ6oCyJDq6mqTWf8dJ0rvKx1EDmxxJSYtrwD0lcNeksOOHV8pmMw1jPWAdndtbe2xfr25kjQ1C5BBixcv9rW0nHoLwO0JinLe5Dtp6dFeHfjaL7/3F8BsbUr7+3SRRPQxEdUDaGPmTkB0EskQoHVqmhMCOELki1mWZWmaZvt8PisQCMSKiorMVOXGH8xUBZBhZWVlswH5NhK0xsiTg4Jb7sXDO9anNZ5V0+5GeO8mWGebs+FosM+W6HalYmMToBCAdilxXAjsJMIHgLYrEAi0VVdXu75/eaDL9Ac86C1ZssTT1PTpW0S4M1FZfchwPOW4Mzi+vGgqjKa9sC+ctZHd08UMoBXAa4BYXldXl7U777KRqgCywPz580odh98HKCdRWe+Iq/FkOLnR9f5YNWUOYicPI3a6ETLamQ2tgp40EWmPlZaW1qnuQe+oacAscP/9D7Q0N58YDqA0UVkn3IHtl4/CTDM1JwYlclPLMcyIdGCWIOyZPpdIaHCMCOBY2VgZDAF47qlTJz46dOiIawMZA1m2fYCD1oIF80YaBjYx45relPcOvxpPRt1rCXzZiutvQ+zkYVhnjkMakayqDKREvRBiYSbSbA80qgWQJfbvPxIqLh7fAHAVevG5OJEObPFfhj3T7sZNJw+5EOEXlbQ1YaYRwiwhsGf6PBIeD9gywFbMQoa/V0Q8wuOhtQcPHs7+Y44zTFUAWWTRokWNzc0nACQeEAQAaURgtnyKPVNn46aWxrTG1pOS1sZ4N4GA/95crml5BYCUgGOBHVvC9dYBaVKKmsOHD6tFRQlkTbNNiSsvL/dblrGKSDzQ64s0HXkTb8lYAtGerJw8B/a5FljnWyDD5yGNCNg2IR3bISKB9HwHbSH0ucFg8N003PuSoiqALFRVVTXkwoULrwmBsiQu45yR4yhw/Uws2Zr+1OH9sebmCrBtQZoG2IxCmjGwY4JtC2zHT2uTjg04Tvx1MwYn3AHZ+4HP80Lo04PBYNpPOBnoVAWQpaqq5g0Nh/F3Znw7meu03DwEJs3Cowc+Sldorlox8VaE922CE+79seXMvO7KK0ct7OmkISVOVQBZrLKy8vJYLPIyM+YneanMGXmN8I8vSfvKwXRZNeUuRBr+A7OtKckkoxwVwnNXomSiSpwaBMxiBw4ciI4fP2G9lPYoIpqSxKXkhM4j1nwIO0YV45NJt2F6c9+y+bht1ZQ5eD8SQvjAVjjxBU/J/EixENqzfn/g9WxPx50tVAtgACgvL/fbtvlzZn6610dkX0R4ffCNnQTf6PFYsj2YjhD7beWk2xA9ugfW2WZw37YlMxG9GAjkP11dXe3OKqlLgKoABohly5bp27dvWSglrwCQ35d7kO6B94oi5IyZgEf3vpfiCJO3puQ7iLU0wjh+EE5ne3/OE7AB/ErXvc/X1tb2LuuoAkBVAAMKM9P8+fOnSWm/AmBiP24lNX++8FwxFjkjrsEjLlYGq0srYLefhNF8CPa506k4hfgMIJaOGTPmn2vWrHH1SONLgaoABqDy8vJhtm0+D2AxUpDUhXQvtEABPIVXQC8cAeEvgObLTcl04upp82CHzsFqPw27/RSccAfYsft9XwBgpn8T0eN1dXX71Q7AvlEVwADV1SWolFL+AaCRKb69JE0XpHtBXh9Ejh8iJxfCkwNoHpAQgNBABLDkeH5A2wJsE9KMQBoGpBkFWwakZTp9GbdIoF0I+oXfn//X6urqUIrvPaioCmCAu+eee8YC9nPMtBDZvW8/FUwi+pumeX5ZU1NzXP3q95/KCTjA1dXVfTp6dNEPhdDnEmEbEhw6OEDZRLxBCP3O0tIZD9XW1japhz81VAvgElJRUZFv27H7mPEMgOJMx5MCNjO9r2n86+HDR36oVvalnqoALkFVVVVDQqHQdwH5U8RnCwba5xxmlkFdFy+MGjV2pxrdT5+B9sVQkhBfQGTfKqX8CRF/i4j8mY6pB8yMJiHoz0TaKyUlJY0qrVf6qQpgEKiqqtJCoVAREVcw8/cBngxQbqbjQldCTyJ+G6BXmcVmlcXHXaoCGGTKyspydF0fZdt2KZGcB2CmlHw1EeUi/d8HBhBh5qNE9I4Qeo3X6/1E1/XzKqV3ZqgKYBBjZnrwwQdz2tvbhzKb10qJybbNU4XAdQCuYsZQIvYzQ08ieYcE4AAcBaiDCKcAbmDWdmga73IcOgygTR3+mR1UBaB8ATPTs88+q+3YscPr85m+aNSTS0T5tm0XACgkkvlElMvMHiIhAHYAxJi5k1mcJ6J2TdM6AER8Pp9RWFgYW716ta2m7RRFURRFURRFUTLuf/Ooy+q2jXNLAAAAAElFTkSuQmCC" },
        { test: "dagger_1_g.png", replaceWith: "data:image/png;base64,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" },
        { test: "dagger_1.png", replaceWith: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAIABJREFUeJzsnXl8VMeV73+n7u1FOwIk9sXsIBsvOGBsxmtsaG0g7Barx2Sc2EkmycRJnHkvLxN3Zux587LOZCYzY8aJHYfFRhgMQhIEbOMNjDC2DBZmtdkXiUVLq9d767w/JMwmdfdVr4L7/Xz0kXS7btXp7lunqk6dOodgYgLA5XKJbdu2WTIzMy0ej8ditVotuq6rmqZZhBBWZlaF0ARg1aWUAVVVg0IIPzMHLBaLH0CgoqJCT/b7MDEGJVsAk8ThcrlEfX29ze/3Z0sp+zNrwwAaw6yN1HUxTAj0BzgXoCwAdgAWZlaI6LLnhJmZiCQzB4nIDeAMM44IQbsAfKyqqLfZ+FhBwdQWl8ulJeO9mkSGqQCuUS509ra2tnxmHgvIKURyCrMYC6A/M6cRkRKPtplZJ6LzRPwZIN4AxFs2m63+5ptvbjYVQmphKoBrBGam8vJyu9/fMkjTMBXgh5hpKoBBaB/NkyoegGYibGcWqy0WubF//2GHFy9eHEyyXNc9pgLo4SxatMje2NhYwKw/wszFAI8GyJZsucLgI8JOAC8CSs3kyZOPmzOD5GAqgB4IM9PMmTPzNS0wn5m/wcxj4jWdTwBtAL1BxP/FLLbU1NS0JFug6wlTAfQgXC6X+OijrSM0jZ9ipr8GkJlsmWKIZOZ6RRG/Tk/Per2ioqI52QJdD5gKoIdQVlaW7/N5fgDgb3FtdfxO4L1CiJ/k5fWvfumll3zJluZapqdOG68bmJk+/PDDO4NB/2sAygBYky1T/KG+zCh3u1tvGjt2XO3+/fvPJ1uiaxVzBpDCOJ1Opa2tZT4zfg8gK87NsVAFkapAsapQ7BaoaSoUmxWKTQGpAoAA6xIyqEHzBhFs80FrC0AGNEhNxkusvYAyr6am5uM4NXBdYyqAFMXlcqnbtm37DiB/AcASw6qDlkybxdYrA/b8LKT3y8a03JtjUvH7LbvgPnwG7uNNCLR4wbFTCnVpaShctWrDyVhVaNKOqQBSEKfTqXg87m/ruv7bKK37rKRZKT0/C1k35OHegbfHTMZI+cvud9DyRSMCzV4JQHS3HiL6SVVVzb8QEcdQvOseUwGkGMxMxcWOOVLyy+jGyE+qQFpeFnLHD8A9/RPf4UOx+UQtzu48Dv+5NobxZ69OVa13VVZWeuIh2/WKmmwBTC6nsLBwCiCfB8hQ57fnZSJ/8ghMy5kYL9Gi5t6Bk4GBwIZPN1PT3lPQ/YZ8fwYASAdgKoAYYiqAFGL27OkDPB75JyLKjvSerKG9UTKtMJ5iRc3mE7Vo3t8A3xm30U5/KQEppXnaMMaYCiBFcDgcNp+Pf03EYyIpL6wKhjom4s6MgniLZpgtbfU4t+sY2k40QfcFuzPd7wTeJaU0R/8YYyqAFIFIPsyMOZGUtWTZ4Sx5JN4iGaZq+ya0HmqEDF42UMfCzhQUQry0bl114IqTySZRYiqAFGDmzJlDAgHfbxCBlVzNsKVU53/fsxcNW/fDe7opRiP91RDRUkWxrjd3AGKPqQCSjMvlUj/44P3niES/cGWFVUH5TGcixArL5vP7cGbrbgSa3BcuxaPzB4losc2W9szq1atb41D/dY+pAJLM9u1b7yUS8yIoysNLb036/PftlgNofHcXAs1t8WwmCGArkfJsRkbG2xUVFYF4NnY9YyqAJFJaWpqlaf5fIYLvIe+2oXSHdVwCpOqct1sPouHdnQg2xa3jS2YcFYLWECmvCiHqzD3/+GMqgCQSDAbnAgjrh2vLTceD4+5OgESdU1X3Hpp3H4rKk68zmNkDiN1CoEpReG2vXvl7X375ZY+51k8cSZ9SXq8UFRXlSqnVARgapqicP39hTDueEdbv245zH+6NWX3M8DBjparSa1LSRwAaa2pq/DFrIA7MmjWrVyAQGMvM+QBa7Hb7Z6tWrWq8FhRV0h6s6xlmJim1BQjf+dFn4uCkfkfN9YdiWh8R0oXAnUTq4ZqammOp3PmZmYqKiu4MBLwrmPWNgFwF6Bu8Xs+7hYWFf+dwOCJ22EpVzHgASWDnzp35mhb4MxDa40+xWzDznuJEidUpOz/+WCL2M8XeUkrH+PGjNu7bd7AxxnXHjO3bt9/NrK8EMBGADYAASCVCH4CnM2PK2LFj3+vJ8QrMGUCCYWby+TyPAjQoXNmB94xNhEjhiMtBfyIM0zQsKSsry49H/dFSVFQ0gllfDqCr7Vki4vulDL7hcDjuYOYeuZw2ZwAJpra2No+IFwPIDVXOmp0Gxy33J0iqrtlz9KCQvtDRu9WMNPSdMh5qhh2+xiadiCIdWPrruqYuWLDwjc2bNxtSNE6nM3PEiBHDRo8ePXD8+PHqvHnzvEbr6IpZs2b10jT/KoDGhy9NvQB+ZOnSZXsWLly4b/PmzT3KLmAqgAQzduyoGcz4BsJMq4dMvxFDrMkfHE/nAJ6jjWB5dd9SM9OQd88tKLntbozI6Y8xA4ahcVSm8B8/CxmI+NDPhJMnT63dv39/QySFXS6Xmp5ueygQCPyGWf+JlPLrUurlJ04cHzR+/IT6vXv3RuUw5HQ6rV5v2+8AKjFwmx3g2SdPnmi65ZZb63bv3t1jDi2ZS4AE4nQ6FWZMQ5jPXagCd2bemCCpQnN//ngMmH470gfnQ81Mg5puh31Ab+Q9cAvKSx/GA3mX+yY8kD4S5SUPI214/0ibyJFSFkUyhX700Uczams/+GdmrAF4OoB+RMgFMJqZnw4G/ZsdDsetht9kB8xMHo/7SQBf68btVinlv7rdrc+VlJSkd1eGRNMj1y09FafTaW1ra/5PZno8XNlhxTfjruybEiFW3Hhtcw38J85GUJJfyczMeSyUx19paenAYDDwx46OH4qzQqil69at22p0m66oaPpXpeR10SZWIaIKIuXJqqqqlDcOmjOABFJQUCABcSiSsqe3HoyzNPFhk/sAVm/dhOUrlkfY+QFAqG63u9PBiJmpsLDw9mDQ/3YEnR8A+kiprS0tddxlxDBXXFw8WkosjUVWJWZ26rq2bubMmUOirSvemAoggbhcLo2ZNgE4Fq6s76w7XmF2Y84b3s+xZsdmvLp6BRrWfgDvF6fAWuTLYCLsnzJlylWWRpfLpRYXO+Ywa28AGGVApD6aJlcVFRVNjqSw0zm9t6ZpywDEzOhChDsDAd9bhYWFt8SqznhgGgETzLRp0854PG1+gO8HKJQrNp2gcxiVPzxRohmm+uB2fPTeB2jd+QUHz7aQkU5/EfYC4h9eeOGFI5deffTRRzP279/7Myn5N0SUZrxeymDm4gkTRm/cu/fA6a5KdQRi+b0QcERYsRG/iN4Al48ePWbXwoULP0/FHQJTASSYuro67b777t/V0tKcB+ArocoGmjxoGUopsRtwgTfaDuCTbdtR90EtfEfPgNut/d22JRHhZUC8cODAgS+1R2lp6UC3u/UlAF83sKXYWd2ZUnLJ6NFjNhw4cOAqhyOn06kEAr7vEeHpSOobNnwwnvjWQvp01x74/REfUEwD+OGTJ0803Hff/Tt37NiRUjM70wiYJIqKikZIqX0CY2m+WKiChM2C0bmZyBjcG2NGTImXiF+ysXk/vJ+fgPdQA3Rv7Dx3melNIcSC6urqU+3/M5WWzrhV07AEQAR78JFBhC+I1KKqqqrPLrbNVFw8o1BKrEIE2ZaysjNRUjzry/83v70JJ46filgGZtaFEL9QFMuzqXTK0VQASeKpp55K27Nn918ATIumHqEK2Pv3Ru/bx+Hu9OGxEQ7AhlO70Lb3GAKNLZCB0I5ARunoDCvmzJm5rG/fAYdfeOFPJ3RdV3U9MEPX+bcdW3uxZj8gHDU1NQcBoKRkeoGm4U1EsO5XVQX/+2ffw8E9l08i6nbWYven+wwJQcRLiCzfS5UdAlMBJBiXyyV27Nh6i6bhFwDuRQyXYbY+2Xh4emnU9bz2ZhWCDc2QnTj/xAAdgC8tzW4jQSoRIRgI+v3+gE5EhvbPiQhEZEBOrldVW6Gqqj6fz7MeQEQ+A489PgdBb+dR2o+fPIC33/ogwva/lONtRbEuWLdu3XGDN8YcUwEkkPYAIIEfMvPfA7DHqRmZM26oKLqte/EDXnuzCv5TKTE4hcRms+LxJxdA13W88N9LoOsRK6s6Zj5MRDMjKXzPfXdg0IDQGxABvQmrKqoNKkzeCyiza2pqdhu4KeaYCiBBFBYWDpNSf5EI9yWiPTUrDX2n3477rcMivucvDfU492YdpEw5Y/Vl9M3rjaeefhL1dUcBAOnZjD8uXhZzuW8YORRTp0SmSLNyBf6weBm0oJG8B9yoKKK8srLm7WTFFjD9ABKAw+GYwKxvSlTnBwCt1YvTr2/BxvORB/MInGlJ+c7ff2gmfvSzx77s/ADgaSE8+rVHIETsHufsnKyIOz8AtJ6X+PFP/hbpGUZ2LClP02RVUdGMhU6nMyk7cuY2YJwpKSkZJ6W2HsANCW9cMrxfnMKpQRaMTOsbtvi+hiPwn25KgGDdgifc3oem3lqC08euNqJLTUXBLTegfmf00YssFhU/+PG30HTWmLG+6ZwX48ZNwLETn8PnjWybkIgsAEoCAb+cNu2vauvq6rqdOqk7mAogjpSWlg7UtEAVjHmxxRZmeA+fRuOoLNyg9gpZ9AtugfeLyLe2EoVqEZg6YxCNG/RgyHIkrRgzYTD27D4QVXtz58433PkvZfSocfD6m3HubHOktwgA93o8rQMKCm56Z8+ePb5uN26QLm0AzExlZWU5fr+/QAgUAMhjZjOIaIQQkYVZOpkRUaqvS2DFkkbWzHxYMvOh2rJAJKBrXgTdZ+FvPYmgt0k3mjZcyUzDnNKHw5Zb/uoycOQGtbiTkW3BzOKIEiZ9SYvnFNa9vqlb7Y25uTduL4hNrsVDR/Zgy3sfGrqHCBtV1bZo7dq1J2IiRLj2OrvocrnEhx9uvV3X6afM8gGj2zMmxiGhIqPfBLz8+3+M+J7n/vn/YucnHyEYjGyfPn3kQMyaEjrIyMpN6xBoSP4ywGJRMWJ8X0y68avduv9s8zFsqNps6J68gel48N7Z3WqvKzz+s1izaj2YDdlWPhVCLb/UcSledKoACgsLxzDrSxDGVdUkNqT1vgFLX/htt+//m7/5mt7UdD6SGYHMK5oiHswZ3WWBmqN1OP/upyErsVhU9O7TG0TA+aZz54RKVlXAKhRFBbhbljhVsSHNnoGs7CyMHDUMd9w5Cbs/CXtmKiQNZw9j04Z3IyqblqGibObcqNrriowc4KUXXkHQ2A7BSUBxVldXb4nnDsFVCsDpdCptba0/ZeZnOnvdJKZwbt499Ifnn4q6okfK50Bq4d10LblZcDpCb4EvW7ZEQ4icETabFQ8/XG5YxmRw/ORBvP3W1pBlFFVgTvn8uMoxdGQu/u3X/wOvx9Dy3k2kLJo8efJql8sVl3XZVdrabrfbAS6E2fnjDfft64hJ5weAlStehVDDH2UPnm/FhtP1IctY+2SFtPX4/QH0G9QzVoWDBozEtLu7PhWsqAJTZ4SNzxo1Rw6exzP/9CP06WvIyzmTWV9eW/vB951OZ9jzCt3hKgXg8zXYpAwfr94kOnJyptLixU/GtM6VK14FM4c9k9taF9pKnnZD+HBeH2zZEblgSWbo4DGYOXvGVXv0mdlW3OUYjKHZ9yREjp07DmH6Q0UYMdJQ97Iw86/a2lp/U1pamhVrma5aN44dOzFd04JPEaEbZ7BNIkFVc7F06S/jUvf6LQeFvyW0AVnz+PWJE2/ucq0+ps9g7Nq1M2S6b3dbG0aPSomw5RFhVdMxZ2EhBgzshxEjh2HaPVNQ6nwAvjPh/SNizeDBw2BLI5w43mWYgishAJOZ9ZvGjy94c+/evTFL0NjpQ0BkegjGEV6x4sW4Vf7S734KxZoRsgwRKev2hD7AoqTZQi4BW5vdGD+pj3EBk8gnHx6C7rch3dYHnhbCp7URd8CYM2bUTXAUPwCiyFfazCgOBv01hYWFRreWu6Srjp7a/qA9GJttcNxtKzlDw0fC8h0O/fBb+4Veq+q6xMnDLYbkMrmc3OwBeOzxcqiqIZeOW5n1TcXFM6bGIhnJVRWUlZX18fk8BwHkdHkTESwWK5hTx2EkFdA0Lex+76pVrydElocfeQQsu952IlXBvPJ5Xb6+/sROnNu8M2Qb9311GgakcMiynsLg4dn4t9/8AX6foWArzYBYNGXKlLXR7BB0a6pPBAhBEEKYPx0/7ZGrQnd+IeJiyO0Ua2boOBes6SGFnTFwIhAmLdiRw0k/zn5NcOxQC1zP/hC9crscczsjB5Cvbtu29dtPPPFE58EKIqBbSwBmGPVsug5gMCOkS56q9k6UMLDnhj0GTBvP7QlZQFjVkANE0/nkewxeK+z66AgKHSUYNnywkdusAH537NiR55xOZ7eM9l19wWHXFkaMF9cRIffPrdbEGc1e/O3fhy2jtXpDvi6soY9+GAiMaRIhd915LybeMsHILcTMT7e1tf6prKzM8ANmGgETiKKklvNM2Fh/Yc7Xm7PA+HDjhNvwwEPGQkUys9Pn86xyOByGphDdngGYGCfljKbhZnFhQlwpinmaPF706zsc8xbOCv8dXc7dAP9+1qxZoc99X4K53x8zCAgzc9K0qBLXxpxwU/xwGX5ttqizaJmEgGQmHvv2fKgWI6fw2eH3+6dHukXY7SWAOf3rlJAKNRiMNFde9Cz6u+fCllGzQi9JZEALqQGaZcLiVly3BM8Typ1zIULbYy/FQiS/WlhYGNGWU1eqJSIjYPeVABmc2cSP9rcQvTIjCv+ZaHrEEWKixnvu83BF+MHcsV1+C28GDgFhjJoBa4p8idcwFV+8Af60EVKLfPkopcy2WKwRrc+6+oJjPryrqgWq2u3tyrgRDAag69GHYbsQoz6UAgjlmBNrAu4zIaMGCasasvdGEhqcs80lQLxYcugdKHsawOeMz7KEUD6fNGlSoLKyMnzZLq7HTLULIWCzpaVk5wcAKbuT0PJqmDmiqLRz5n4jJu2F4rHv/hzhQoapuaEPlvlPhl+umAogPix7Zy3E1qPcnc4P4AwzrXG5XBGNNnGN8acoKiyWxHm/GYWZY2rL6FAAEiFsAcHAVTkqY4775K6wZTJGDQz5evBMaD9/EgTKSN3vtieyZMd6iIPngPbpfncGYR8RXIMHD4n4rHbcjICp3vkBQNNim/OuYxkQdhrgdC6IabuXsuDrPwi71CBVgWNY6KxYmjv06MMAOIZx+K9nlu57E8vWrIDYe+ZC5+8OJ4jw2ODBwxYvXrw44gc7LkbAntD5AcRk7X8pRARFUaCFNp5D19uwYMH3sXTpv8a0/a//+N8jMf7B1i+0S/LG83vBugwZDwAA6EQL0M+QiCaXsOTouxC7G0FRhCAHECTCEkD5eVVV1RGj8QO7bQQ00vmvVBZGdxCY+TLX4/b/ASB0vUQXrPwX5b1QT3vn547XCFe+5YvVXPijvQzzxXov/X3p/ZG8P6/3EBYseApLl3Y/GOiVnDvwRsjlRwfSMmpSyDLNO/YD4QYByaDPGrHssyWdvcqX/mZmJiImhVSg4zug9g+OBAGi4zMUBBCgSwEWBCgEWBSwTUVafxtmj34ozFvrOSx9pxLiRAsQRSYmZmwhEj/MyMjcXlFRoXfHPb+bx4EBIa60MXHHqTjlsmvtHeHKDnHx7wvXr+xw7Z3o4v8XlMClvzvjUmVxSdkLUyK64CBBl39aV34OCdvfslr74ZVXno+qjscf/zXOn383ks4PS/5AOL/adWjwdcdPoeXtTWFH/2RACiHjhnSUTi5LtijdZuknfwHtOwsEozI+nyCi/9OnT17Fn//856iiA3XLCMgM6PrVb6A9Q2v8trouKovQWvPS1zv+/nILItUOMQUCp/HII3OxcuUr3bp/7txvIhA4BUTi1SkUZNwSOtK797PdQAp2fgBgneE+0IYVp19BeUl8QnjHiyX73wLtbgS1RXWAyg3gd6pq/W1lZeWZWMiVMD8Ak66R0ofZs2dBVXOQnX07Xnjhu2HvmT//O/D5jkU06l8gbWwBCvt2vf1X0+SDdjZ5YbIiRWvV8OrryzFnVtcBTVKFJcfeBe0+A3HWc+k01xDMrBOJ1arKrkmTpn4WyxDhXS0B9gFI3OF1kyuRipImVDUHQqSDSIGUfuh6CzStFREE/r0KtW8+yh8KvYZ+vX4fPJ/UdlfmhKNmqSk9E1i6pQp0pCmqdT6AOkD8MDMz872KioqYn7++agbQHlaaWwAyFUDyELruha6HPq8fcWUZWciaem/YcoHjh2LSXqLQWjUsq1yB+SWplaRk6a6NoL1nQIFo1vl8ElCeUVV1aWVlZVTbBKG4SgH06tXL19DQVs9Mw+PVqEniEGnpyPqrB+HICr0tu94voLck7qxCzGgNYGn1a1hQGD7xabxZcvBt0O4GUKuh2H5XwF4i8T/M4pfV1dXH45kWDOhk/fjiiy/6mdXlAEfzLkxSAJGZg+x7HSjqHT4QCQcCQIz9IhIFNXmxbOOqpLW/5MT7WLppNUTtsWg6vwRorarSVyZPvuOpmpqaY/Hu/EAX1t5Zs2b1CgR8/yKl/LrRNNQmndNuyCE/ADsSEIfBMmAwsqbcgxnpkRn0q5t8aKpZGYn5lwH2AXSGGUeJ6ASAcwD8AEAkFV0nixBkJWILANvFH7Yzk7XjfysAC8AWACozqURkYcAKMNq9Ay6UiQwemI0F95ZGWjxqlpzaAvriPOhIMxBVSnWuJ6IfZWRkvxmPdX4ounw6ioqKcqXUFgD8TYBGov1LC/U0XfnoXNzZ73AEueQ6XzSJUnuIUQYTkbz4Gsn2a+i4BskM2f4/S4AkEXRmSGboRNDbr0MHoAGkA6wDpAFSIyJNStKEgKbr0IRovw4InVmXQig6IHVmoRPpElD0jrp0ABq3h/PRLlwTQuhSQhMCnf4GoBFJDYAmBAWZlSYAp4jkKF3XfwlQXNLqkMWCtILbMGtC1xmAO6OmNYDzVRXdMli1242oRQgcAXgXkVILyDpVtR+yWq3nCwoKfPX19VxQUED19fXC7XZTZmamsNvtwufzkdvtFpmZmeTxeER6ukY+n1WoqiqCwaBFSu2vpZT/FPFAlGMD980AmKEAGJ6jwKYAkNzeR5khJUPXGSwZug5IXeK8R0ebv/3RI+b2z4HREQH3yzd64Uls/63Jblv2OzgDiOcA/LGmpiYpSRZCDg/MTOXl5dlut3uQovAAKTmTWRAAnUgGiaARkUYETddFkIg0RdGDwSBpiqIEmVlnZt1isUgACAQCrCgKCyFYVf0MAD6fwqqqsqIo7PP5GABUVeX2Hw8DgMejssViYYvFwm63u31j32Jhm83Gdrudm5qa2G63MwBkZGTw6dOnOTMzk3NzcxkABg4cyB0PID/zzDMMAImYXnXFvHnz+jY1na0E6I5Y1UmqCuuQG5BWcCsKs7vnhv3KqpWQvpgG+fABaASwD8A2IWibovBumy37VEFBgSeS7SyXy6XW1n7wNDM/hxT1TzAOe4nEH5npX2pqaqLLgR4l18gH2rNwOqf3drvxCQBDARw7gUVaOlmH3AD7yHEozI0uneNr72+B/3D4swRREmDGSSLaTsTVgPJ+fn7+kZdeeqlLzfPEE09Yjh07/Cwzfhxv4eJJuxOa3KQo4ieTJt3xcaRHduMqU7IFuB5xOBwPAXI9wiypSFGJ9faTRSQUFUJAqFZQWhasvfth1pSbYipX1TkPWjZVgmN8SjIMPoDriOg/mcWarqbCixYtsjc0nPgPZno8kcLFCmbsIxI/yszM3JDodX4oTAWQYFwul6it3fInZloYqpylVz6chYk//LJ2/yG4d2wFYhQoxQBMhE2qSt9du3b93s4KlJaWZmma9yVmMTvRwnUXZj4vhPgFkfJ8VVVV+DBLCcZUAAmmw7i6D0DIvNTz54fUD3Gl8vApeD7ZBt2d+CjGRKi1WOyPrFmz5mhnr5eVlfXxer0riLjrE02pQYAIS4nUZ9etW/dFMm1OoTAjOiQYIv02hHGzJjW5sRRKhvVHzkMzkTnlbqh98kAJjP/PjMmBgP97XeW7W7169VkhxAJmbEmYUMZgQG4mUu7KyMj+RlVV1eep2vmBOIcEM7kaKVGEMIrX0id0uK5EMMMOYORQYORQ1LRJaGcaEDx1FMHG05AeN1jT4nZkmJmdp0+f/h2ATmcB1dXVp2bPnv6Ix8P/RUSl8ZLDIBLAXiHoH9PTe62pqKiIjR93nEmFD+66ocOQ9RZzyO0/nj9/YUp/LzVeQLa2QDvfiGBjA/Tmc5CeNnAwYOh0Ygh8QqgPVFVVhRzlnU5nZltby1wA32HGWHTtq3JVMAruOCfeMTpf4ptCzMyy47q84JPS/jc6/ExYAhRs385DAyA+JkK1oli3rF27NrWyv4TBnAEkkLa2Nhuz6BsugRAMeL8lA0cagLRsID8bGDsSALDeJ8A+j9BazkM72wjt3BnI1mboPl93DIoKM4d9NisqKtzM/IeysrKVgUBguBByIDPsADQpKSiEDDIrAWYOCCGCzBxQVRkIBkkTgjSLxSKv9E3x+RS2WC76pVzqk3KpP4rf75c5OTnS5/MFV6xYEUzlaX4oTAWQQOx2u+Z2t4TbY0vpzt8VM+wSsNuBXgOAoQO+vF7TpkNvaYbWcBK+z/dCeiM62NYmhDgZScGOjtcEoK7jJ+GkWpAZI5hGwAQycuRIL7MMG7O7omZjIsQJSU2bjvWe6Ac1R4YCtVdvBM81Rtr5wYyP+/bt2+n63yS29FzV1UNxOByzALk6TDFt/vyFSZmdrT14BL6D+6C7W0BgiPQMWAcPh3XwcBT2shuur6qxBa1b3oJsi2xp3H5oSimrqakJn9bGJGrMJUCCsdvt7/p8ntMIHVBbfe2trXj4vqmJEutL3Nvf/3LNzgCkzwvt3Bl4Pv0YK3J7wz5iLCyDh7fbAcKwZvc+tO3cYcgGIARkXco5AAAgAElEQVS9yoy/dFN8E4OYR30TzNy5c/3Hjx8bCCDkQSDpbcVNN96YIKnaeeW118BaF16qzJBeDwInjsC3fzf2NDTiIKz4wpaFUZbLJ5LVzX7UvbsZvs/3GjotR4RPVNX2aFVVVQ+MTNIzMZcASaC4uPhmXQ9sAyhkcj370PGYPW1SosTCsmWdxvgPCVmsUPvkwTZ8FCz9BkE/fxbu2ncgfca2wTt85QtramoOGhbCpNuYS4AkkJaW9llbm38TMxWFKuc7tg9A4hRAd+BgAMFTxxE8dRykqAAY3EnI+FC0j/zWssrKyi/iI6VJV5i7AEmgoqIiwKz+ksOF95U6Vm58O0FSAXRVshdjsK4Z7vzMWA8oM8zOnxzMGUCS6Nev37bTp0++D+DuUOUCjUcTlqXH0ncQAg1HEtEUAEgi+kgI2g6ws7BwRisgWomkG1BaFUV3A+whsvuDwWBQURTNbrcHMzIy/MOHDw/EMjb+9YxpA0giDofjfkBuRJiZGFlsmOd0JkSmig1vIXj2eCqkBrvgotsRio0DALkBnJMSR4XAx0R4F1DqMjIyGisqKhJ+fvlaINlf8nXNE088YTly5PAGItwXrqyak4fyoumJEAsAsGJdDbSWsxpSe5bIABoALAfEf1RXV6f0ybtUxFQASaa4ePpkXed3wu0IAIC131A88kDIFUPMWb31E/hPHYL0tqbCrCAUR4iUv508eXK1uTyIHNMPIMnMn//o6ePHj+UBmByurN7WjH1nWjHhhqEJkKyd8UP648bx43DTTRNpf3MQus8D6MFUVAY5AD908uSxrfv3H0yYIaOnk2pf4nXJ7NnTB/h8eJ8ZN0RS3po3FI88mNiZwJW89s52BM8chfR5UkoZSIkaIcTcZIXZ7mmkzBd3veNwOByAfB3tyTDCovbKQ3lh4mwCoVi9tQ6BhiPQ21qCSPppRm6xWMRfrV27fmdy5egZmEuAFGHhwoWHjh8/BiC8QRAApM+D+gNf4Mbx4+IrWASMH9IfN44bi5tumqjcdNNE7DlxFtCDYF2TSPggQ4qUYu2BAwdMj8IIMGcAKURJSUl6MOj7byLxaMQ3KSrmz0ndFNkAsPKtrZBtTZA+D1gLQOqaTkQC8Xn+NCHUh6qqqt6KQ93XHKYCSDGcTmdOS0vLciHgMHAb2waMpGScHowlqz/4FJAapK4Bug7WA+CAH3pbM2Qg4rMFTUKok6qqquKe4eRawFQAKYjTOb13WxteYcaDRu5T0jIxp2xWvMRKCq+uqYTeFvnhQGZe07//wLmhMg2ZXMRUAClKWVlZH7/f8xIzig3eKm0DbhAP33dXXORKFCs3voNA4xGDQUbZK4Tlq+GCiZpcxDQCpih79uzxjhkzbr2U2kAiutnAraS7m/DpZ3twoFXH+MGh4o6kHivf2oq6be9Bb2sCjA1QLITy8/T0jFd3795tegNGiDkDSHFKSkrSNS3wE2b+XxGnyL4EYbXDPqwAs74yPh7ixYyVG99B8OxxcPdSkjER/XtGRtb/6inx+FMFUwH0AFwul7p9+wdzpeT/BJDVnTpItcCaPxwP3zslxtJFx6uV1dBbz0WTT0AD8M+qav1/lZWVkUUdNfkSUwH0EJiZiouLb5NS+zOAaIZzqaRnCUv+MMy+85ZYiWeIio1vQzt/KhZZiM8A4jtDhgxZtXjx4oSmNL5WMBVAD6OkpKSvpgX+H4BFiEFAF1KtUDJ6wZKbj7I4KYRVW+qgnTsJva0ZrGsxqZOZ3iSi71ZXV39mngDsPqYC6IF0LAnKpJT/BtCA8HcYQpKiClKtIKsdwpYOYUuDsNgAxQIS4jJ7wuvbP4PUgoAWgAx4IH0+yIAXHPRBBgN6d+wWYTgnBP1DenrWyxUVFe4Y133dYSqAHkxhYeEwQHuWmeYitc/tx4IAES1TFMsza9euPWqO+rHBjAnYg6murj48ePDwvxFCfYgItQiTdLCHohHxJiHU+yZPvuMblZWVR8zOHzvMGcA1QmlpaZam+Wcx42cARiVbnhigMdM7isL/Ny9vwHumZ198MBXANYbT6cxxu90PA/KHaN8t6GnfcRuzrFJV8euBA4d9bFr340tPezhMIqTdgUibJqX8PhHfQ0TpyZYpBMyMI0LQi0TKn7/yla8cMsN6JQZTAVzjOJ1Oxe12DyfiUmaeA/BEgCLI7Bd3GEADEW8EaCmz2GJG8Uk8pgK4jnA4HDZVVQdqmjaZSE4HMFVKHkpEaYj/s8AAPMz8ORG9IYS61mq17lRVtckM6Z08TAVwncLM9LWvfc127ty53syBEVJioqbxLUJgLIBBzOhNxOnMUA0E75AAdIC9ADUT4STA+5iVHYrCdbpOBwA01tTU+OP65kwixlQAJl/CzPTzn/9c2bFjh9VuD9i9XksaEWVpmtYLQC6RzCKiNGa2EAkBsA7Az8ytzKKJiM4pitIMwGO32325ubn+559/XjO37UxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTAxjxgMw+RKXyyW2bdtmyczMtHg8HovVarXouq5qmmYRQliZWRVCE4BVl1IGVFUNCiH8zBywWCx+AAEzuk/PwlQA1xkul0vU19fb/H5/tpSyP7M2DKAxzNpIXRfDhEB/gHMBygJgB2BhZoWILntWmJmJSDJzkIjcAM50BPbcBeBjVUW9zcbHCgqmtrhcrtjkAzOJOaYCuIa50Nnb2trymXksIKcQySnMYiyA/sycFofUXQAAZtaJ6DwRfwaINwDxls1mq7/55pubTYWQOpgK4BqCmam8vNzu97cM0jRMBfghZpoKYBDaR/OkigegmQjbmcVqi0Vu7N9/2GEz7n9yMRXANcCiRYvsjY2NBcz6I8xcDPBogGzJlisMPiLsBPAioNRMnjz5uDkzSDymAuihMDPNnDkzX9MC85n5G8w8Jl7T+QTQBtAbRPxfZn6AxGIqgB6Gy+USH320dYSm8VPM9NcAMpMtUwyRzFyvKOLX6elZr1dUVDQnW6BrHVMB9CDKysryfT7PDwD8La6tjt8JvFcI8ZO8vP7VZmLQ+NFTp4zXFcxMH3744Z3BoP81AGUArMmWKf5QX2aUu92tN40dO652//7955Mt0bWIOQNIcZxOp9LW1jKfGb8HkBXn5liogkhVoFhVKHYL1DQVis0KxaaAVAFAgHUJGdSgeYMItvmgtQUgAxqkFq98nrwXUObV1NR8HKcGrltMBZDCuFwuddu2bd8B5C8AWGJYddCSabPYemXAnp+F9H7ZmJZ7c0wqfr9lF9yHz8B9vAmBFi84dkqhLi0NhatWbTgZqwpNTAWQsjidTsXjcX9b1/XfRmndZyXNSun5Wci6IQ/3Drw9ZjJGyl92v4OWLxoRaPZKAKK79RDRT6qqav7FTDUWO0wFkIIwMxUXO+ZIyS+jGyM/qQJpeVnIHT8A9/RPfIcPxeYTtTi78zj859oYxp+/OlW13lVZWemJh2zXI2qyBTC5msLCwimAfB4gQ53fnpeJ/MkjMC1nYrxEi5p7B04GBgIbPt1MTXtPQfcb8v0ZACAdgKkAYoSpAFKM2bOnD/B45J+IKDvSe7KG9kbJtMJ4ihU1m0/Uonl/A3xn3EY7/aUEpJTmacMYYiqAFMLhcNh8Pv41EY+JpLywKhjqmIg7MwriLZphtrTV49yuY2g70QTdF+zOdL8TeJeU0hz9Y4ipAFIIIvkwM+ZEUtaSZYez5JF4i2SYqu2b0HqoETJ42UAdC1tTUAjx0rp11YErTiabRIGpAFKEmTNnDgkEfL9BBFZyNcOWcp1/9Rvr4D3dFKOR/mqIaKmiWNebOwCxxVQAKYDL5VI/+OD954hEv3BlhVVB+UxnIsQKy+bz+3Bm624EmtwXLsWj8weJaLHNlvbM6tWrW+NQ/3WNqQBSgO3bt95LJOZFUJTnPjIv6fPft1sOoPHdXQg0t8WzmSCArUTKsxkZGW9XVFQE4tnY9YqpAJJMaWlplqb5f4UIvou824YmvfNXVK9GsCluHV8y46gQtIZIeVUIUWfu+ccXUwEkmWAwOBdAWD9cW246Hhx3dwIk6pyquvfQvPtQVJ58ncHMHkDsFgJVisJre/XK3/vyyy97zLV+Ykj6iHI9U1RUlCulVgdgaJiicv78hTHteEZYv287zn24N2b1McPDjJWqSq9JSR8BaKypqfHHrIE4MGvWrF6BQGAsM+cDaLHb7Z+tWrWqsacrqqQ9VNc7zExSagsQvvOjz8TBSf2emusPxbQ+IqQLgTuJ1MM1NTXHUrnzMzMVFRXdGQh4VzDrGwG5CtA3eL2edwsLC//O4XBE7LCVipjxAJLEzp078zUt8GcgtMefYrdg5j3FiRKrU3Z+/LFE7GeLvaWUjvHjR23ct+9gY4zrjhnbt2+/m1lfCWAiABsAAZBKhD4AT2fGlLFjx77XU+MVmDOAJMDM5PN5HgVoULiyA+8ZmwiRwhGXg/5EGKZpWFJWVpYfj/qjpaioaASzvhxAV9uzRMT3Sxl8w+Fw3MHMPW5Jbc4AkkBtbW0eES8GkBuqnDU7DY5b7k+QVF2z5+hBIX2ho3erGWnoO2U81Aw7fI1NOhFFOrj013VNXbBg4RubN282pGicTmfmiBEjho0ePXrg+PHj1Xnz5nmN1tEVs2bN6qVp/lUAjQ9fmnoB/MjSpcv2LFy4cN/mzZt7jF3AVABJYOzYUTOY8Q2EmVYPmX4jhliTPziezgE8RxvB8uq+pWamIe+eW1By290YkdMfYwYMw8SJN4vPDu2HDER86GfCyZOn1u7fv78hksIul0tNT7c9FAgEfsOs/0RK+XUp9fITJ44PGj9+Qv3evXujchhyOp1Wr7ftdwCVGLjNDvDskydPNN1yy611u3fv7hGHlswlQIJxOp0KM6YhzGcvVIE7M29MkFShuT9/PAZMvx3pg/OhZqZBTbfDPqA38h64BeWlD+OBvHFX3VNe8jDShvePtIkcKWVRJFPoRx99NKO29oN/ZsYagKcD6EeEXACjmfnpYNC/2eFw3GroDV4CM5PH434SwNe6cbtVSvmvbnfrcyUlJendlSGR9Lg1S0/H6XRa29qa/5OZHg9Xdljxzbgr+6ZEiBU3XttcA/+JsxGU5FcyM3MeC+XxV1paOjAYDPyxo+OH4qwQaum6deu2Gt2mKyqa/lUpeV20iVWIqIJIebKqqiqljYPmDCDBFBQUSEAciqTs6a0H4yxNfNjkPoDVWzdh+YrlEXZ+ABCq2+3udEBiZiosLLw9GPS/HUHnB4A+UmprS0sddxkxzBUXF4+WEktjkVWJmZ26rq2bOXPmkGjriiemAkgwLpdLY6ZNAI6FK+s7645XmN24sGbHZry6egUa1n4A7xenwFrky2Ai7J8yZcpVlkaXy6UWFzvmMGtvABhlQJw+miZXFRUVTY6ksNM5vbemacsAxMzoQoQ7AwHfW4WFhbfEqs5YYy4BksCiRYvsDQ2nnmCWvwg32vSZOBjTb7w3QZIZp/rgdrTWH4Hu9kZxFJi9gPJgTU3N+5deffTRRzPOnGn4CTP/fXcDozLjlNVK09euXb+zqzIOh8MmpVwsBP46wmqNukSfA8TCKVOmbHC5XCml1M1dgCRQV1en3Xff/btaWprzAHwlVNlAkwctQykldgMuZfW7G1D3QS18R8+A26393R5MiPAyIF44cODAl1OG0tLSgW5360sAvm5gS7GzujOl5JLRo8dsOHDgwFUOR06nUwkEfN8jwtOR1Dds+GA88a2F9OmuPfD7Iz6gmAbwwydPnmi47777d+7YsSNllIA5A0giRUVFI6TUPoGxNF8sVEHCZkF6v2zkjOmPv+odm5j+odjYvB/ez0/Ae6gBujd2nrvM9KYQYkF1dfWp9v+ZSktn3KppWAIggj34yCDCF0RqUVVV1WcX22YqLp5RKCVWIYJsS1nZmSgpnvXl/5vf3oQTx09FLAMz60KIXyiK5dlUOeVoKoAk8tRTT6Xt2bP7LwCmRVOPUAXs/Xtj1t0zYiRZOxtO7ULb3mMINLZABkI7AhmlozOsmDNn5rK+fQccfuGFP53QdV3V9cAMXeffdmztxZr9gHDU1NQcBICSkukFmoY3EcG6X1UV/O+ffQ8H91w+iajbWYvdn+4zJAQRLyGyfC8VdghMBZAEXC6X2LFj6y2ahl8AuBcxXIrZ+mTj4emlUdfz2ptVCDY0Q3bi/BMDdAC+tDS7jQSpRIRgIOj3+wM6ERnaPyciEJEBObleVW2Fqqr6fD7PegAR+Qw89vgcBL2dR2k/fvIA3n7rgwjb/1KOtxXFumDdunXHDd4YU0wFkGDaA4AEfsjMfw/AHqdmZM64oaLotu7FD3jtzSr4TyV9cAqLzWbF408ugK7reOG/l0DXI1ZWdcx8mIhmRlL4nvvuwKABoTcgAnoTVlVUG1SYvBdQZtfU1Ow2cFNMMRVAAiksLBwmpf4iEe5LRHtqVhrKSx42dM9fGupx7s06SJna7ux983rjqaefRH3dUQBAejbjj4uXxVzuG0YOxdQpkSnSrFyBPyxeBi1oJO8BNyqKKK+srHk7GbEFTAWQIBwOxwRAroGxveyoIVVB3wdvw4O5kZ0qXLd7K1rqUtsBqf/QTHz/6W9g59bL1+OWND/+/OJrMVu2ZOdkobgooknClwwf3Qf/+qvF8LR5I76HmT1C0DczMrKXVVRUJPQMgbkNmABKSkrGSamtB3BDwhuXDO8Xp3BqkAUj0/qGLb6v4Qj8p5sSIFi34Am396Gpt5bg9LGrjehSU1Fwyw2o3xl99CKLRcUPfvwtNJ01ZqxvOufFuHETcOzE5/B5I9smJCILgJJAwC+nTfur2rq6um6nTjKKqQDiTGlp6UBNC1QhwSP/ZTDDe/g0bioIf67gC26B94vIt7YShWoRmDpjEI0b9GDIciStGDNhMPbsPhBVe3Pnzjfc+S9l9Khx8Pqbce5sc6S3CAD3ejytAwoKbnpnz549vm43boCQSwBmprKyshy/318gBAoA5DGzGUg0QojIwiydzIgo1dclsGJJI2tmPiyZ+VBtWSAS0DUvgu6z8LeeRNDbpBv1jlMy0zCnNLxNYPmry8CRG9TiTka2BTOLI0qY9CUtnlNY9/qmbrU35ubeuL0gNrkWDx3Zgy3vfWjoHiJsVFXborVr156IiRCh2urqBZfLJT78cOvtuk4/ZZYPGN2eMTEOCRUZ/Sbg5d//Y0Tl/+aHv0LLsY8gg5GPVOkjB2LWlNBBRlZuWodAQ/KXARaLihHj+2LSjV/t1v1nm49hQ9VmQ/fkDUzHg/fO7lZ7XeHxn8WaVevBbMjG96kQavmljkvxoEsFUFhYOIZZX4IwrqomsSGt9w1Y+sJvu3Xvor97Ds1HaiOdEci8oiniwZzRXRaoOVqH8+9+GrISi0VF7z69QQScbzp3TqhkVQWsQlFUgLvluqsqNqTZM5CVnYWRo4bhjjsnYfcnYc9MhaTh7GFs2vBuRGXTMlSUzZwbVXtdkZEDvPTCKwga2yE4CSjO6urqLfHaIehUATidTqWtrfWnzPxMV2VMYgbn5t1Df3j+qagreqR8DqQW3k3XkpsFpyO0dXvZsiUaQuSNsNmsePjhcsMyJoPjJw/i7be2hiyjqAJzyufHVY6hI3Pxb7/+H3g9hpb3biJl0eTJk1fH4yBRp5rabrfbAS6E2fnjDfft64hJ5weAlStehVDDH2UPnm/FhtP1IctY+2SFtPX4/QH0G9QzVoWDBozEtLu7PhWsqAJTZ4SNzxo1Rw6exzP/9CP06WvIyzmTWV9eW/vB951OZ9jzCkbpVAH4fA02KcPHqzeJjpycqbR48ZMxrXPlilfBzGH3klvrQlvJ024IH87rgy07IhcsyQwdPAYzZ89AekbaZdczs614cNoADM2+JyFy7NxxCNMfKsKIkYa6l4WZf9XW1vqb0tLSrFjK0+macezYiemaFnyKCGmdvW4SPaqai6VLfxmXutdvOSj8LaENyJrHr0+ceHOXa/UxfQZj166dIc/4u9vaMHpUSoQtjwirmo45CwsxYGA/jBg5DPeNHYnhBZORlpV494zBg4fBlkY4cfx0pLcQgMnM+k3jxxe8uXfv3pgkaOzyASAyowXFEc7Li1+yj5d+91Mo1oyQZYhIWbcn9AEWJc0WcgnY2uzG+El9jAuYRD758BB0vw3ptj5oTs9LqixjRt0ER/EDIIp8pc2M4mDQX1NYWGh0a7lTQnXy1HYG78HYbIPp97835qNvlJyh4SNh+Q6HHn2s/UKvVXVd4uThFkNymVxObvYAPPZ4OVTVkEvHrcz6puLiGVOjTUYSSgGErJiIYLXaYLFYzJ9LfiLR5r163WX0ezLMC7/4O5AI7bMVbA7tP5A2PHwUos927zckl8nVBDwW/ODHT8JmNxSLdIiuc01hYeFMl8vV7dl6NKGWIARBCGH+dPy0R64KPXESwor/+q953f3YDWHNDN2BWdNDCjtj4EQgTFqwI4eTepz9muHYoRa4nv0heuXmGLktB5Cvbtu29dtPPPFE58EKwtDtJQAzjHo2XQcwmBEydI6q9k6UMLDnDgtXhDae2xOygLCqIQeJpvPJ9xi8Vtj10REUOkowbPhgI7dZAfzu2LEjzzmdTsNG+24vAQAYMl5cR4Scd1utiTOavfjbvw9bRmsNfWxVWEMvIwwExjSJkLvuvBcTb5lg5BZi5qfb2lr/VFZWZugBM42ACUZRUst5JmysPxF6lWjOAuPDjRNuwwMPGQsVycxOn8+zyuFwRDyFiGoGYGIc5tQ5ZQeg3ZgTijDBNRTFPFEeL/r1HY55C2eF/44u526Afz9r1qxekRQ29/pjCgFhZk6aFlXiWkM8+Q8vhS0TboofLsOvzRZ1Fi2TEJDMxGPfng/VYuQUPjv8fv/0SLYIo1oCmNO/TgmpVIPBSHPlRY+/JbyFXs0KvSSRAS2kBmiWCYlbcV0TPE8od86FCG2PvRQLkfxqYWFh2LMDodRKREbA7isBMjiziR/tbyF6ZUYU/jPR9IgjxESN99zn4Yrwg7ljw30LIYeeRx6aFeplkxixovIVSC3y5aOUMttisYZdn4X6cmM+vKuqBarare3KuBIMBqDr0YdhuxCjPpQCYKnhm9/8I/77v/8m6vbCEXCfCRkjQFjVkJ2/5sjHsRfKxBDL168EnzM+yxJC+XzSpEmBysrK0OVCvBaz8VkIAZstLSU7PwBIGZtArMwMEcZqDgDnm0KfTY8Fj3335wgXIETNDX2wzH8yccsVk6tZtnwpd6fzAzjDTGtcLlfYUS3uRkBFUWG12lPWZ4CZY2rL6FAAIedqwUAjvv3t5TFrszPcJ3eFLZMxamDI14NnQvv5k0jN77Sns2zFMixbtgTonp+/jwiuIUOGRHRWO6olQLiOoygqLJaYxzCIKZoW25x3HcsAEe6zaWxcByA+LsELvv4DsAyt/ElV4BgWOiuW5g49+pgm4NiybM0KoC0qx6oTRHhq8OBhqxcvXhzRgx03I2BP6PwAYrL2vxQigqIo0EIbz6HrbViw4PtYuvRfY9r+13/875EY/2DrF9oleeP5vWBdhowHYBIblm1YBUQRghxAkAhLAOXnVVVVR4zED4zLDKCzzn+lsjC6g8DMly0j2v8HgND1El2w8l+U90I97Z2fO14jXPmWL1Zz4Y/2MswX673096X3R/L+vN5DWLDgKSxd2r1goFfy5N++gHMn35AIv7STllGTQpZp3rEfCNf5JbdPVTuHL/3NzExETAqpQMd3QO0fHAkCRMdnKAggQJcCLAhQCLAomP/VsjBvqWey7JWlQBTpzJixhUj8MCMjc3tFRYVudKndaemysrI+Pp/nIIAujya1nwa80sbEHafilMuutXeEKzvExb8vXL+yw7V3oov/X1ACl/7ujEuVxSVlL0yJ6IKDBF3+aV35WSRs5LNa++GVV56Pqo7HH/81zp9/N5LOD0v+QDi/2nVo8HXHT6Hl7U0pOfqTQpg3Z0GyxYiaZRXLgWBUxucTRPR/+vTJq/jzn//c7ehA3VYAJrFFCDv69HkQzz//uOF75879JgKBCLP5CAXz54a2PVRsehPBhrjnpIgKNUtFeUl8QnjHk6VrVoCiW+e7AfxOVa2/raysPBOtPAn1AzDpGil9aGysRHn5O8jOvh0vvPDdkOW/9a0laG7+AD7fsYhG/QukjS0IW0Y7G3GcuqShtWp49fXlmDMrMbEVomXpX1aDznpA3dxxYmadSKxWVXZNmjT1s1iFCA81A9gHIHGH102uRCpKmlDVHAiRDiIFUvqh6y3QtFZEEPj3KtS++Sh/6KGQZV6v3wfPJ7XdlTnh9ISZQLTrfAB1gPhhZmbmexUVFTE9f93pDKA9rDS3AGQqgOQhdN0LXY88zXTIyjKywnZ+AAgcPxST9hKF1qphWeUKzC9JvSQly1YuBwLRrPP5JKA8o6rq0srKyqi2CbqiUwXQq1cvX0NDWz0zDY9HoyaJRaSlY+7MyPLc6y2JO6sQM1oDWFr9GhYUxjfQaqQsrawAtYbP0NQ17CUS/8MsflldXX08XmnBgC7Wji+++KKfWV0OcDTvwiQFEJk5mFtmINlljP0iEgU1ebFs46qkyrB002osW740ms4vAVqrqvSVyZPveKqmpuZYPDs/0MUMgIh41qxZVYGA7yUp5deNpqE26Zx2Qw75AdiRADdsy4DBcN53r6F7OLJzEQywD6AzzDhKRCcAnAPgBwAiqeg6WYQgKxFbANgu/rCdmawd/1sBWAC2AFCZSSUiCwNWgNHuHXChTAQ0xmWWHBHLXl0GiiqlOtcT0Y8yMrLerKioCFRWboiZbKEIuc9bVFSUK6W2AOBvAjQS7V9aqHuu1FYXd/Y7HEEuuc4Xd/6pPcQog4lIXnyNZPs1dFyDZIZs/58lQOuYJzsAAA5JSURBVJIIOjMkM3Qi6O3XoQPQANIB1gHSAKkRkSYlaUJA03VoQrRfB4TOrEshFB2QOrPQiXQJKHpHXToAjdvD+WgXrgkhdCmhCYFOfwPQiKQGQBOCgsxKE4BTRHKUruu/BCguaXXIYkFawW2YNaHrDMBd0V2DVbvdiFqEwBGAdxEptYCsU1X7IavVer6goMBXX1/PBQUFVF9fL9xuN2VmZgq73S58Ph+53W6RmZlJHo9HpKdr5PNZhaqqIhgMWqTU/lpK+U8RD0Q5Nswvchp+D7s2rMJeneEHt1vrJXc8qXyJWxNfeBLbf2vyUgeW7nAGEM8B+GNNTU3CkyyEdfRgZiovL892u92DFIUHSMmZzIIA6EQySASNiDQiaLougkSkKYoeDAZJUxQlyMw6M+sWi0UCQCAQYEVRWAjBqupnAPD5FFZVlRVFYZ/PxwCgqiq3/3gYADwelS0WC1ssFna73QwAFouFbTYb2+12bmpqYrvdzgCQkZHBp0+f5szMTM7NzWUAGDhwIHc8gPzMM88w0D7TicNnGhHz5s3r29R0thKgO2JVJ6kqrENuwMNTp3S7jldWrYT0xTTIhw9AI4B9ALYJQdsUhXfbbNmnCgoKPJFsZ7lcLrW29oOnmfk5pKBzUvdgL5H4IzP9S01NTXQ50KPgGvkwex5O5/Tebjc+AWAoBnQnsEhLJ+uQGzD79tCHeyLhtfe3wH84/FmCKAkw4yQRbSfiakB5Pz8//8hLL73UpeZ54oknLMeOHX6WGT+Ot3DxpN35VG5SFPGTSZPu+DiSI7txlSeZjV/POByOhwC5HmGWVKSoxHr7ySISigohIFQrKC0L1t79YOk7GEUjDaWbDsvyFa+CY3xKMgw+gOuI6D+ZxZqupsKLFi2yNzSc+A9mMu4umQIwYx+R+FFmZuaGWO/ndxdTASQBl8slamu3/ImZFoYqZ+mVj6xbHwCT6DiGRHCEz9odNWv3H4J7x1YgRoFSDMBE2KSq9N21a9fv7axAaWlplqZ5X2IWBrY2kgsznxdC/IJIeb6qqup8suW5FFMBJIEO4+o+AH1Dlcu88W6UTjSURz5mVB4+Bc8n26C7ExfF+AJEqLVY7I+sWbPmaGevl5WV9fF6vSuIuOsTTalBgAhLidRn161b90UybU5dYYYFTwJE+m0I42ZNqhXWfsnp/ABQMqw/5pTOROaUu6H2yQMlMP4/MyYHAv7vdZXvbvXq1WeFEAuYsSVhQhmDAbmZSLkrIyP7G1VVVZ+nYucHAHN/PwmMGjXquwDuDFXGmjcEpTclTwFcYGzvHBSMGoWbbrwJh7LzIawWsK63OwzJ+AUMYcYgn89fsXfv3k7tAfv373dPnDiqJhjkUUQ0Nl5yGEQC2CMEfS8jI+dna9asObJ79+6U7PgXMJJtwCQGdBiypoZ5Xtk+dHwqPNCXUTKsPzDsohGiqqGFtPONCDY2QG8+B+lpAwcDhk4ndgUR+mmaNgRAp8sAAFi1asNJp9O5sK2tZS6A7zBjLLr2VbkqGAV3BJToGJ0v8U0hZmbZcf3/t3fvsW1ddRzAv79zrx+JkybpmnRJmyZd27TZqg0xNWIPgQasXdokLGWBaNqkDon9A0hI/DMhAauEQBPiDwRCbBICMbGxeWIsqe2OFSZ1dOxBabuxpk2TtnGSpmlaNw8/ru/j/PgjGXSDxXbq2NfN+UiVKuvc21P53p/P83fkh2tS5v+OhXUmLAGy5qfzcAkQx4gQ1jTvm319fYXvNy2RCgAFlkgkfMxiTaYDhLSKGnemUL7GnrpVQN0qYOumaz8W/dEJ2FemYMcuQ87NwDGMpQwoasyc8fkMBoNxZv51d3f3S6ZpNgshG5jhB2BLSZYQ0mLWTGY2hRAWM5u6Lk3LIlsIsj0ej/z42hTD0Njj+e+6lGvXpFy7HiWdTsuqqippGIb14osvWm5t5i9GBYAC8/v9djw+m2mOzePMXAbq6wpSp3zr3FAPbKj/yGcHJmKwL03AOHsaMpXVkt2EEGIim4ILL940gOMLfwrOrVmvM1GDgAW2adOmFLPMmLM7de5EIapTMB31q2HFprJ9+cGMY2vWrPnE5r+SH6UZtkpce3v7g4B8OUMxu/qevfrupsIfJ943HIUxPAgnPgsCQ5QH4F3fjAe3b1vS/UJTs5h783XIRHZd4/lNU1p3JBJZ/Fgb5bqpLkAR+P3+NwwjOQlg7SLF9NTZE0DTXYWqFgDgTycGkBw4/p8+OwOQRgp27DKe+9cx6DWr4b9lK7q2NGd1v1dODiLx3tGcxgCEoBeY8eclVF/JkZoGLILe3t70+PhYA4BFNwLJ1BzGarZhy6rC9NRC5+JIfvAW2P6EVarMkKkkzAtRvH/yJE5dmsIwvNhas+r/Fg++dgjG2dM57ZYjwgld9z0aCoVKMDNJ6VFdgCLp6Oi4w3HMtwHyLVbOv6EVe++9syB1euX4OSROHsn5OvJ4od9UC1/zZnTd0ogDY1OIv3MY0sgtndnCWvndkUhkOOdKKEuiugBFUlZWNpBIpA8x057FyhljgwiPbsfuxkXjRH4sce0/Wyasi+OwLo7j+Xd1ADy/WCgH87/83u7+/v5zS6qEsiRqFqBIgsGgyaz/hDOl95UOkqfeKkidtIpq0P8c9pIbduycX35mHAS0B9TLX3iqC1BE+/bt809OTrwK4LMZinLF7fdR1/Z1y16nlw4dhnkpuuz/zgJJRP8kogiAKWaeA8QckYwD2pymOXGAk0T+tGVZlqZptt/vtwKBQLq5udnMV278lUwFgCJrb2//PCBfQ4bWGHl8qL77S2hft7wHrobHTCQ+OALryrgbjgb7cInuQio2NgGKA4hJiVEhcIwIbwDa8UAgMBUMBgu+f7nUFfsLXvEef/xxTzQ68ioR7stUVq+qxVf27CpEtdD3XhRG9APYs1dsuHusiAFcAvA8IH4RDoddu/POjVQAcIGOjl1tjsOHM80IAIB37QY89IVMPYb8CY8kkL4whPTF85CpOTe0ChYTJdK+0dbWFlbdg+yodQAu8PDDj06Oj4/VAmjLVNZJzGDw8hxu3ViYrcJbqr1obbwZ21u3IVrRRCQ0OEYScCw3BoMqgHdOTIz9/cyZ4YINZJQyt32BK9bevbvqDQNHmLExm/Le2g146P7CtQQ+7sDQVaQvDMG6PAppJF0VDKRERAjRW4w026VGtQBcYmBgOL55c8sgwD3I4ntxkjMYGJ1ANLARWyoLP5vbsroMtzatw/bWVkQrmkl4PGDLAFtpC0V+roh4rcdDL58+PeT+Y46LTAUAF3nkkUfOj4+PAcg8IAgA0kjCnBxBtGwdtlQXYKHQJ2ip8c13E7ZtxWh1i6ZVVANSAo4FdmyJgrcOSJNS9A0NDakVhRm4ptmmzOvs7Cy3LONXROLRrC/SdFS03l20BKKLCZ1PwL46CWt6EjIxDWkkwbYJ6dgOEQkszzNoC6HvDIVCry/DvW8oKgC4UE9PT9Xs7OzzQqA9h8vYV7+JArfehQcW22PoAgcnAbYtSNMAmylIMw12TLBtge3509qkYwOOM/+5mYaTmIE0s95bMC2EfmcoFFr2E05KnQoALtXTs2t1IoE/MOP+XK7TyioQuO0edLTULlfVCurAmRgSJ4/ASWS/OZCZX7n55obexU4aUuapAOBi3d3dN6XTyd8yoyPHS6WvfqMob9mx7CsHl0t4JInk4D9gTkVzTDLKKSE8XwyFQm5NGe4qahDQxU6dOpVqadl2UEq7gYjuyOFScuLTSI+fwdCcgxG9DpsrSiPWh0cSOHHsKBKn3oaTmAZy+5FiIbT95eWBF9yejtstSuOpWOE6OzvLbdv8LjM/kfUR2dcQXj/8TbfBv74FD9S7M+aHhq8idfZ9WFfGwUvblsxE9PNAoPKJYDCYWyKCFUwFgBLx5JNP6u+++1avlPxLAJVLuQfpHnjrmuFr3IaOTVV5rmHuDk44SE+ehzF6Gs5c7HrOE7AB/EjXvU/19/dnl3VUAaACQElhZuro6Pi0lPazAFqv41ZSK68Unrom+NZuxJ4CBoPIRcCOXYAxfgb21Yv5OIX4MiC+2djY+MdnnnmmoEca3whUAChBnZ2da2zbfArAPuTjFB7dCy1QDU9NHfSatRDl1dD8ZXmZToyMpWHHr8KKXYQdm4CTmAE79vXfGAAz/ZWIvhUOhwfUDsClUQGgRC10CbqllD8DqD7zFTmRpOmCdC/I64fwlUP4yiA8PkDzgIQAhAYigCUDLCFtC7BNSDMJaRiQZgpsGZCW6Sxl3CKDmBD0vfLyyt8Fg8F4nu+9oqgAUOJ2797dBNg/ZKZeuHvffj6YRPScpnl+0NfXN6p+9a+fyglY4sLh8Mj69c1fE0LfSYR3kOHQwRJlE/EhIfT72to+8/X+/v6oevnzQ7UAbiBdXV2Vtp1+kBnfB7C52PXJA5uZDmsa/7i2tv5vamVf/qkAcAPq6empisfjXwbkdzA/W1Bq33OCWYZ0Xfy0oaHpmBrdXz6l9mAoOZhfQGTfK6X8NhF/jogKf9Bg9pgZUSHoN0Taszt27Div0notPxUAVoCenh4tHo83E3EXM38V4NsBKit2vbCQ0JOIXwPo98ziTZXFp7BUAFhh2tvbfbquN9i23UYkdwG4S0reQERlWP7ngQEkmfksEf1FCL3P6/W+p+v6tErpXRwqAKxgzEyPPfaYLxaLrWY2b5ESt9s2f0oIbAWwjhmribicGXoOyTskAAfgFEAzRJgAeJBZO6ppfNxxaAjAVCQSSS/rf07JigoAykcwM+3fv187evSo1+83/amUp4yIKm3brgZQQyQriaiMmT1EQgDsAEgz8xyzmCaimKZpMwCSfr/fqKmpST/99NO2mrZTFEVRFEVRFEUpun8DuPVcxy/da6QAAAAASUVORK5CYII=" },
        { test: "enemy.png", replaceWith: "https://i.imgur.com/Ib6nqTa.png" },
        { test: "grab_1_d.png", replaceWith: "https://i.imgur.com/7kbtWfk.png" },
        { test: "grab_1_g.png", replaceWith: "https://i.imgur.com/DRzBdFX.png" },
        { test: "grab_1_r.png", replaceWith: "https://i.imgur.com/wV42LEE.png" },
        { test: "great_axe_1_d.png", replaceWith: "https://i.imgur.com/aAJyHBB.png" },
        { test: "great_axe_1_r.png", replaceWith: "data:image/png;base64,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" },
        { test: "great_axe_1_g.png", replaceWith: "data:image/png;base64,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" },
        { test: "great_axe_1.png", replaceWith: "data:image/png;base64,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" },
        { test: "great_hammer_1_d.png", replaceWith: "https://i.imgur.com/Fg93gj3.png" },
        { test: "great_hammer_1_r.png", replaceWith: "https://i.imgur.com/tmUzurk.png" },
        { test: "great_hammer_1_g.png", replaceWith: "data:image/png;base64,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" },
        { test: "great_hammer_1.png", replaceWith: "data:image/png;base64,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" },
        { test: "hammer_1_d.png", replaceWith: "https://i.imgur.com/WPWU8zC.png" },
        { test: "hammer_1_r.png", replaceWith: "https://i.imgur.com/oRXUfW8.png" },
        { test: "hammer_1_g.png", replaceWith: "data:image/png;base64,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" },
        { test: "hammer_1.png", replaceWith: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABHNCSVQICAgIfAhkiAAAIABJREFUeJztnWlwXNeV3//nvdcrFgLcwUWERFIiRcmSJZGy9oVaAJCEFg+UsZ2RZafCSaqcSsaTmfjLjFqZ1CTlTOIZTzmZslNlO6ORpgzblEiRAK3FsmUppkTJtkRIFkVI3EACBEABYKPRy3vv5EODEheg3+31Nl6fXxW0ALfvPUD3/b9zzz33XEAQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQhLkL6TZAyBKLxYy33nqrzrbt+aZpRmzbNlRfa1kWua4bJqKg67oZIppkZidPE1LBYHA8EAic6e7uzve1whxFBKAK2LZt20LbTn8ZwFeZuRVAiIgI6u8PX9CW8xmfmZkINkBDRNjBbPz9nj17PiSivPoR5h4iAJrp6OhYBdj/h5nu0W3Lp9CHRMZXdu/e/YqIgL9RdjOF0tPV1VXvuplvVtfkBwC+jNn+bmdnZ6tuS4TyIgKgkXg8vonIeEi3HTNDV9h2+o9isZh8RnyMvLmaiMViBhFvBRDQbUsOOvv7+yO6jRDKhwiAJvr6+izXxTW67fBg1djYmAiAjxEB0ERdXZ1BxPN12+FB2LIs+Yz4GHlzNTE5OUkAV7P7D2aWz4fPsXQbUKskk0kCyGOCEc+fv4SITI/eXNi2Ddd1QASYZgCmaSFXOoDrMsbHh+E49uyjyxag7xEB0EQ4HObJyTRxjilmmiatWrUBllV6R4GZ0df3Kqam4jmbJZNJEQEfIy6eJpLJJDHnl7FXWhh5JgwKPkQEQBPhcFj77MvlfUy3cC3L0m6nUD5EADRCpDsVW+Z2rSMCoAn9SwCA2Ut/iMUD8DciAJoIh8Os3wNwvRrI5Pc5IgCaqA4PwPPnbFkJEQEfIwKgCd1BQGYGefgfROIB+B0RAI3oXgKwwjZAIiExAD8jAqCJalgCeMOeQQJhbiMCoIlqCAJ6ewDEgUCgykVKKAYRAE3MDQ+g6u0TikQEQBO6g4AqMEM8AJ8jAqAR3UsArwc8EXM8HhcB8DEiAJrQvQRgZoWzAN6ZQsLcRgRAE9UQBFRY4svT3+eIAGhCtwegVutDdgH8jgiAJqohCKiQCixLAJ8jAqARnUsAZlJIBWYOhULahUooHyIAmlBZAriuA9edvWZfsXgnAhluNXgqQvkQAdDEdBAwZ7VPZsbw8HGQ16O6IFTmtaQC+x0RAE0kk0ki8qoKDAwNHUEqNVUJky6CGe7Y2Jh4AD5GBEAT4XCYXdd7J95xbJw4cajk49u2DfZ4wBuGBAH9jgiARohIaYKNjp5AIjFR0rEHBw/DdXMPzwyWGIC/EQHQRDYIqLbGdl0XAwMHSzb2xMQIhoePKbSUGIDfEQHQRL6ZgOPjozhz5nTR49p2BocP93m6/0A2BlBXVycegI8RAdBEvpmAzIyjR3+vNHFzMTDwgXJQ0TDUlijC3EUEQBOFrK0TiQmcPj1Y8LbgxMQoTp06qtyeGe7Q0JB4AD5GBEAjhWQCDgx8ANtO5z2W42Tw0UcH8n2ZeAA+RwRAE4UeBkqlpnDq1LG8vYCjR99HOp1fPgERnPr6evEAfIwIgCaKOQ588uRHyGRSyu3HxoYxMnI873FUdymEuYsIgCaKOQ7sOBkMDPQrtbXtNI4c6StkGDCT29zcLB6AjxEB0ESxCTYjI8cwNRX3bHfs2EGk08mCxjAMdpYtWyYC4GNEADRSzHHgs8lBuU70jY0NFeT6n0XqAfgfEQBNlKIi0NjYMOLxmZODMpkUjhx5r5juwWw4fX194gH4GBEATSgGAXNOPmbG8eMfXOQFMHNRrv9ZDMPjsIAw5xEB0ISKB6AShY/HxzA+fuq8742NDWN0dEDFDI/xDWfDhg3iAfgYEQBNqAQBiShlKOz3Hzv2PhwnWzkok0nh6NF3Vc3wsMF1VDsS5iYiABpRCQI2BAOe/SSTCYyMHM/L9bcMlbfecB5//HHxAHyMCIAmVJYARGQsjISg4gWcPPkhRkcHcPr0Cc+2RMDiaNizJqDrsngAPkcEQBMqQUACU8gysCAS8uwvk0njyJH3FAp9AvNCQTSELJBHPrFpui6pXSAgzFFEADShFgQEgYFF0bCSy+4qLNktg9BSF1F8403xAHyOCIAmlDIBp5/QJmVFoFiIgGX1UVgGgUGeHgCzBAH9jgiARryXAJ/+fH4kgJBZ3Ns1LxjEvFA2qKiSg0RkiPvvc0QANJFvJqABwtL6SMHjBQwDLQ3nvF5hZEkF9j8iAJpQCQIy+LyfNwQDiAasvMciApY1RGGd4/Ez2DNgyOyIAPgcEQBNKHkAF/yUALQU4AU0hYJoDOYvHMyyBPA7IgCaUMwEvMhDqAtYn6zjVQiaxoyiobBbCNOUoqB+RwRAI96ZgBfPUmbGkrqwUnIQEbC8IQpzhrZKNwNKRSDfIwKgCbUg4MyzPGxZWBgJeo6xOBpGfQExg3NGFwHwOSIAmiimJiAzY2E0jIZZ1vUEYGEklDN3QM0DkCWA3yn88SAURbEFQUwiLG+ow0giiYl0BrbLIADZ1OEwmjzjBCp5ALIL4HdEADQRDoc5Hs+/vv+5BIxsbsACJwTbZRiUDfqZhqGwxafifIgH4HdEADRCBMo1T71SdYGsux80DQTNT7+nciBIDdkG9DsSA9CE2hKgfPNPsWc5C+BzRAA0UUwQsDSoePclcyWEKkUEQBOlqApcFEojSwzA74gAaKLYi0GKhRWcD0kE8j8iABrRuQRQUR8i8QD8jgiAJgo5DFRavDsXD8D/iABoQn8Q0BvxAPyPCIAmdAcB5TCQAIgAaEMlCFjeFYBS75IH4HNEADQiQUBBNyIAmtC9BIBsAwoQAdCG7iCgygrAMAwRAJ8jAqAJ3R6ABAEFQARAG7ozARXzACQI6HNEADSiNQ9AlgACRAC0oXsJAIU7P2UJ4H9EADQxF4KAUhPQ/4gAaEK3B6ByGtAwJBHI74gAaGJuBAFd8QB8jgiARqr9MBCzBAH9jgiAJrQvAZR2AWQJ4HdEADShOwiogiwB/I8IgCZ0ewCKiAfgc0QANKE7CKiiPcyGCIDPEQHQSLUvAQxDEoH8jgiAJvQvAeQ4sCACoA3dQUCV68NkCeB/RAA0od0DUJMeEQCfIwKgCe1BQKU8AFkC+B0RAI1UexBQ6gH4HxEATeheAqhdIW6KAPgcEQBN6A4CglROA0omoN8RAdCEbg9A7TSgBAH9jgiAJuZCEBCQGIDfEQHQiM4lgNrAlgiAzxEB0ITuJYDKwK4rMQC/IwKgCe1BQAUsS5YAfkcEQBPaPQDvIABLEND/iABoQncQUM33EA/A74gAaKT6y4JLENDviABoQvcSQPE4sAiAzxEB0IT+IKCS9ogA+BwRAE3o9wC8EQ/A/4gAaEJ3EFClHkggIALgd0QANKL3MJBKIxEAvyMCoAndSwC1XYCgCIDPEQHQhP4goDeO40gqsM8RAdCEbg/AaxeAmdk0zaoOUgrFIwKgCZ1BQFIoBiLUBiIAGtGaCajQxjAM8QB8jgiAJnQuAZjZMwhIRDL5awARAE3oDgKqzO50Oi0i4HNEADRR7UFAABIErAFEADQhQUChGhAB0EiV5wGwBAH9jwiAJqo9CCjUBiIAmtAfBPRSAGbLSolM+BwRAE3oDwJW8+pDqBQiAJqo/uPAxMmk7AL4HREAjehaAjAAyfMRABEAbeheAjB7aQ+zZVmiEj5HBEATOoOABO8gYLWXKxNKgwiAJnR7AF4jE5FkAtYAIgCa0BkEZEA2AQQAIgBaqfZMwGQyKR6AzxEB0ITKEqCc6qByN2AZhxeqBBEATejOBPRGdgFqAREATegOArKn9kiiQC0gAqAJpSBgGf0DUqgHIB6A/xEB0Ei1VwSyrIQIgM8RAdCE3uPASheDyJ0ANYAIgCa0BwEVbgevgBWCZkQANKE3CKjkAnAiITEAvyMCoAm1TMByOgjeh4HKOLhQJYgAaMRrCcAK2TqFDuztfBAHAgERAZ8jAqAJ3XkAXh4AM1wRAP8jAqAJrUFA/uQfs0IkS4BaQARAE/o9AC+I4/F4FdsnlAIRAE2oBQHL9RRmKAQBJQ+gBhAB0Ij3EqCs5wE9fi5BwFpABEATKkuA8u0CKPkWMvlrABEATSgFAcsaIvReAoRCIREBn2PpNqBWUSsIMvORXCKC47pwOfuYPuso8PTuvusCIIYBAwGTYBnG+QVAmLKnfXOMTlI3vCYQAdBEOBzmeDyd9+sStoPTU2lMZjLIONNxOsr+49xJTgQYZMAkYF44iAXhEALGOU99j+nNDFf35SVC+REB0AgRcu62n/uMZgCjUymcSiThuHxRwwtnNDPgsAsHwPBkEqcTKSyMhrEwGsx6Dd7myeSvAUQANKGUB3DOI310KoXB+FTBs9JhxtDkFKZsBy11YVD2coBcgztjY2O6bi+mRx99NDo6Orqcma8kcpcCNE5k/jYajfZ3d3fn7zoJMyICoIlwOMyTk+mcHgARGEQ4k7aLmvznMpFKI2AQmNlFjiBwJWMAzEydnZ0RovQy26aNW7bc3wHQLcxYDiDI0x4Osz02OTn2z1u3bv0vzz333ECl7PMzIgCaUNoGBHHKsXH8TKKk/vjHybTrMpIAorOOXcYYADPTV77yldDw8PAyZvuGLVva25n5NgArAQ7m2KFoYjb+jeNkrmxvb/9ST0/P8XLYV0uIAGhCJQjI7PLAmSnYbmmT8lxmgwimRy5AyQZlZnrkkUfCmcyZJZkMNm7Z0nYfM+4AsApAsIBww+1E/M2urq5/1d3dPVUqO2sREQCNeAYBGcGk7ZRlbGav957durq6gj2Axx57LDw2NrjUtvHZjo72NiK+nZkvBShUaJ/nWcf8L+Lx+E8B/LgU/dUqIgCaUMoDIDLLaIJHEhgpewDMTB0dHUHLspbYtn0NEd8/NHTyboBbAYpk2wAlzmwyAPevu7q6nu/u7h4vZce1hAhAgWzfvj0wMDBQb5pmBICTyWSmbrzxxkQsFrNVXl9oHsCFBEzgqtVAY5RhGATTBCangP2/BzJKlswGu0NDQzMK1LRLH0ilUgtdN33tli1t9wHYbNup1QBFPvVqyn7aeW0iEX8UwN+XeyC/UsU301QnsVjM2rdv342A8zUAtzGjGQCIMM5sfEjEvyLCy4FAuK+5uXn4+9//fmqmiHpXV1ckHp94HcBVhdoSMIH/9EeMvX3tF/0smOzFq+8U2jPATPsbGhpuObvl1tXVFZyamlrkupmrAboP4Ltdl9cS0ayBxErAjMFAIHj1rl27RnTaMVcRAciDWCxm7N//6wdsm/8XEZbmbs1TRHQE4FcB40XAeLOuru7Ej370o0ki4sceeyw8NHTyNQCfLcQWIuCxDsaBUxdPfgC4fnkP/uGZwt9eInodMB4BcDmzex/g3g3Q5QDqC+60TBDRX2za9Lm/jsVicoQ5T0QA8qCzs3NZJpN6DoVN2gyAk0TufmbrBcuy9tt28juAsbEQWzbfwJigmSf/Wfbv7y2mokAc2fB8Q8E9FAMBwaABO8NwL8x8vABmfBwIBK/ftWvXRxWyzjdIDCAPMpnMNQA2FPjyAIBLmI1LAPfhTCblEBkFhfjXrYLn5AeAoMVIZQrW+Mo+6QkIhU00L4rgkssbsWbx3QCAwx+/jNc8tvuJ0Ow4yT/v6ur6Wnd3d3m2TXyKCEAeGAbPc10EStHXdIQ/7yj/gnmMhsXekx8AmhoIQ6fzHaFCTD/hmxdHsHJNIy5v2Txjs9bmO/F2UzfiY6mc3THTlxOJxHcAHCiDtb5FBCAveADgdKn2svMlFGBcdrna5AeA5QtRVQIQDJloWhTGitWNWLd85gk/ExvvWoqf7zji0YoizM5fdnV1fUG8AHVEAPIgGm18Ox6f+C2AGys9tkHAv30IeDWPVe7alYy3DuoL81hBA82LwlhxWSPWr7yn4H5aIrehedEpfDycO+mPmR9MJieuAfBWwYPVGBIEzJOtW9vudBx3z9kEl0rxB3cBR+Jteb3m3vU9+Ov/W7m32AoaaFoQxorVDbjykntL3v/TT/8TvKqkuS56DMN4qKenJ/eaQQAgHkDePProV1/54Q+//xeu634TFSqptnFjG47E83/d8++1wzJ7UaZsYlgBE/PmB9HSWo/PrL6/PIOcQ8uqepw4fCZnG8PA/QDuAPCzshvkA8QDyIP29vZGwP3XzPiP3nkApeGmqxh2RH3dfyHvv9uDicnSvM2GSQiFTYQiJgIhE2DAzrhIpxzYGRdkEOobg2hdN2/WoF6xPP30kypbm2/W1zfe2d3dXYBs1hblzDX3FR0dHauY+Wki/DFRwVtkKgX5AWTX/G03AXGz8MkPAAG3H6OFZ8qfZy9PT/hkwkHiTAaJMxkkEzYyKReOzbAzLhLxDE4ciWNk4kNcesm6omyfibh9BGMjnt59SzqdeffQoUNF5ELWBiIACjz4YFurbTu7iYoL/kXDoG23MJoagFSakLGnC3ieAxHQWAd86X7go4n81vwzsazxEPoLL51RsOsQH0+DoyexZP6aggefiZUtV+Ddd9/x8gII4KuvvHLDD95//32pHpQDEQAPHnzwwaZUKv1TgK4rtq+MDYyMExqXtKNpwRosbVmDL97xAZoaCI11QGsLcPu1ADW0YShemonz2dYPsK9Pz0ovnXSwdk2heVOzkzKOY3TQswzAAtfljw4dOiQ7AjmQGEAOurq6zMnJM/+Vmf+slP1etgxYsLz4p7sqb+7vhUc2bVmI1Fl46IE/LEvfP/7J00invKKbfBwwr+vp6RkuixE+QC4GycHk5OTVzO7XSt3vhyeAzFhvqbudlUi4YkOdRyhSPgdzw6ZFCq1oBYCvMrM86GZBBGAWYrGYBbj/vlz7/b/9AIjalRGB9av0VPhuXd9ctr7Xr7wH4TrvXWwi9487OzsXlM2QOY4IwCzs27dvKTN3qrQNRy2sXNOIddctROsVTTBMtQfOL34DrIz2FGWnCvdtAkLBsg9zHvMXh3FlEdl/Knz2Vu+dWGassm37M2U1ZA4jAjALhsGbAMz3ardh4yI8/OAf4rZNnbhuXRtuvn4rbt92SbbuvgI7fkm4anF5ReD599rx8O2MUIUu+21oCqLtnj8o+ziXLrgT9Y2eymYQccVTt+cKIgAzwMzkurjTq93i5XW4Zu3FGXDLorfh+rtalEKszMA/9hJuW11eETg03o6vfwG4YR1jXn22mpBpAJaZ/e9QEGiIAouagFVLgQ2XAhvXA61L8xON+qYQtnU8Uqbf4mI+c/NihVbulRIHmBlJBZ6BJ554wiTidV4ZZ/fc8dCsP7t86WZM3bAXfW94B6BtB/jfOwhXldlRfeG9dlADcPl6tfbLIz3Y/3v1edPQFMS2jq4CrSuM1vl34jV6MmdlcWZqeeSRRwwAckrwAsQDOAdmpm3btkVff/31y6ZvpZkVlXX+NWvvx8o1jUpjT6WAgY8qtzPgxYpIL559hZQrCjU2V/bJfy6m4fVecHM8HpeH3QzIH2Wa7du3B7Zu3Xors/11ZtwKYF6u9q7D/NTTT573yaMi0ypOjADXru3BsF1c+m+xLI/0YMcv1X+XxvkhbG2r7JP/XEzLgOPkerhTw8KFCy0AckLwAsQDQLbY5/HjRx5yXfvHzNgKoAneK3j65Jrd6S9mnvErH37+lt6l6tJgD57JY/LPW6B38gOAYXnaWzcyMiJZrzMgAgDgjTfeaAXw36AQ9S83UymUfVdgNhYHerDrVfXJ37QghC336538ABAI5P4YMyNSX++KtzsDNS8A2Yi//RAzLtVty1k+Oln5MRcHerD7tTwm/8IQOqpg8gNAIOj1MeaQbUdFAGag5v8ojzzySGD6ogvdpnyCWWFZXmT15jX5mxeH0V6BfX5VgqHc3j0RWZlMpiTFXP1GzXsAqVQqBPBluu04CxHQWpFSI1nmG73Y8//U21fb5AeAYDj3c4yZTcPIVLSE21yh5j0Ax3EsAGp7dRWgdSnw9tDMuwAbFvVidJzhuIR5dYyVS4CfHyx8x6AJPdi7L48n/6II2u/5fMHjlYtw1NMDMJir5z2uJmpeAILBoJFM2hXOlL8YIuCyZYz5y86f0FG7F2+9D8SngDfOu2E3++9QsBdXXAJ03jrzHYGz0YQePP+G+uSfvySCts3VN/kBIBj2DPCT6+oP8FYjNS8AyWTSgEdhlEgI+NwGwDCycYKzWaXMwNkbvpnp7B3Yn/zcPef/mQEQw3Wz/519LWCZjOYGYP0q4Jf9n07gBWYvXnqTkM7ktj+VBt4+BBzoJ9x8dQ9SIW8RmIfevCb/wqUR3Hd3dU5+IHujkDe0sOyGzEFqXgDC4TBNTU2alOP0zuJmIG6eU8CjhFv1NoBhGxju//R7H5/sxf4B5JVD4DLwq7cJlyzpwZJLZheBBrcXL7ypbl+1T37AOwYwjXgAMyBBwFTKIKKcf4dAJWUy3oP+ASin4F7I0SHC0NGZ8wgauQcv5TP5W6JVP/kB7xhAFipfcYI5TM0LgGVZBjz+DsEKHaO96/IevPl79fz72Tg6RIhmzheBdQt68NKb6q7LouVR3HfXw8UZUiFaIrd5tmHmnKndtUrNC0Amk/EWAO9U05LQ/RKVrHbfawfOt/nZV9S9isXL63DvHXNj8qviONyk24ZqpOYFIBRiy+useLBCS4Ajg6XrK2MDgWTWC7jlUvXLQRYvr8t5zLlq8fj1DEOWADNR8wKQThtByhUBRGWWAE3oKXnl3gMfZn+t4XG1yb9waWRuTn6oxGW5ORaL1fzn/UJq/g9iWW4YHp8fqwIewKHj3h/hYMjE7dsuwcaNbUp1BianS+fXR9SUxbZd70ZViuFRE4CZ5vX19dX8rteF1LwAZDIU9WoTqMBB0vHJ3D8nIlzzmXsxNXglAGBp881YvLwu52tcBu5Z34O3BtqVfoexkRR6X/yJqslVhWl5HghqTCaTIgAXUPMCACAKDw+gEtuAXu7/TBWIVqxuyP0aytb8A4B1rWp2nB6awt6X5p4IeFVoIkK9bdsiABdQ8wJApOABVGAXIBrK/XPHdvFx8vXzvvfemyM5X9NQR+g9kE0KCs9vUy4NPjo4hZ/NMRGwPGoCAAhLTYCLEQEg1/OUWCU8gOWLvNfph945jTff2ovf/O5neOONXkxN2rO2JQKuvuz8Ph9tY3iWz5tmZHBueQKBkOdHWWoCzEDNC4Dret/8k7HLvwuwcb3azHQdhp32DtYZBFx3xfl2//ZkOx6+g5XvLBgdnJozMQGvmgAAAlIT4GJqXhENA+ELr+i+kF2vGjCNvQBnJw8RA0SfPE2NaRk1jeyTl6a/ZxBgmtkDP+EgMK+O0NrCOJa4OFf/jWNtaKzrxYRHMFCVUBB47aOLxzky2Y7OW3vx7Ctq/ZyNCdxf5SnBKjUBHMfRdEti9VLzHgAAj9U34LqMjM3IOEDaBlIZQiqdrd83lcput01OAROTwHgcGIsDpyeAkXFg6DQwMEzoHyC8dRD46S8I+/f3YvBIL+5ce3667rZbS/dLtbbM7rWcSLZh2y3qXs1ciAmEwrk/ykRkmKZZXyFz5gwiAOCKXxbBDBw7BXz7x4SbWj8VgYOn27C+tfj+QwHg4TtytxlMt+clAtUeE7Az3r8Lc0aKglxAzQsAszEETQUBU+ls/v+51C9qw6oiSoJZJvCl+9WKgwym27Hl5vw8gWoVgZNHzng1YWbFW1triJoXACJ6H0CJVt75M3QauOuCpcDilW24dm3+fdVFgK99nvHOLCXFZuJUZu6LwLtHn0dqysuR45RpOqMVMWgOUfMCYBjGhwC9pmt8l4GBGbbzA01t+NrnGS0L4Bm1DwWB268BrryqDa/OEPjz4lQmv+VAtcUE3vm19/2LAD40zchAuW2Za9T8bSkHDx7MXHHF6iPM2IZsVmDFuWwZcMa++JE/ML4Wjc1r8Ng9HyASAgBCwGKEQ8D8RuDylYS2zzGooR22uaYoG+LOWlx/6Qc4eEzNS07EbZwY/gBrLr2yqHGL5eevPoOJj71v/DIM879ff/0NL7/88svVU/+9CpA1EYCuri4zkTizxXX5bwAU4HwXR+etjJMpvfcBniXfC0J0FgsdTL2Kl37ykUrTY5YVvG7Xrl25UydrEBGAaZiZHnjggRbbTt/BjJuInOXM5rVedwbUNQZgmgaYGa7L2aIbPF0QlLMn7LwSd6pJAABgSbAXz72q3n7B0oiWPIGdz/0I8Ym0VzM2DHp09+7eJyth01xDBGAWmJk6Otr/DuB/l6vdF7/4Lz37euqp3J+9bbcwBtPVIwBA9pLQfO4JrHTx0Lf79+LAPqW1/4v19Y3buru7p8pt01yk5oOAs0FETASPotylGqsSo+THYLodm2+o3jyB9/YrefNJIvNPZPLPTs2nAueCmZO6bSg1zdSD3xwkTExmbxjKVSfQdT/Jj1CSqNHBKbzwix1lryr08mvPwnG8xYkI3969e/cBj4JPNY0IQA6I6Ew+tfmrmdtX9+B7u+ic2oAqkyL/mXNqYBK/+2Avrll7f74vVWIw+SucOOyZ9AOAD1tW+H8SkT/ewDIhS4CcsG+ixv/wLJXsoJEXhw6cLlvfv/6Z0lY+A+Y3du7cOVQ2Q3yCCEBujldikHI7GRTv/aQ+YCVIJctzvOLt/r1IxJXCMi8tWbLk2bIY4TNEAHJAZB1nzn1Y6Lne7hKMU3QXOek7XN7+K4Va4I+nTDPwpz/4wQ98F78pByIAOXBdd4iIErnaTJxO4eSU4uF6TUxVeCqEy1B456VXdigF/gD69g033PBOyQ3wKSIAuZkA0O/V6OVnjuDg4IsVMKcwKhkFIwLWX7egpH2enHoFg8dUAhh82LKCfxOLxeZuffMKIwKQgz179qQB7PFqxwzsf+kkdj73owpYlT+V2siI1Fn47O0tWL/y3pL2u+/5EyrN2DSNr0u6b37INmAOiIg7Ojr+2XXt/6BSPTg+kcZTTz3QfmfNAAAE60lEQVQJIiAYNkEGIZPyfhjNsZ1GNkyiQMBApD6A+nkBNM4PYdGyKJbX3V7ywVQDf8zY6zjkKdbC+YgH4MGmTZveMww8nc9rmIHUlIPkpA1H4badcgYB2zbMfFV4EZDrMFJJB2MjSRzvP4ODvzuNvn3DeLt/b6nHwntvKh3hn7SswDd6enq8jwUK5yEegAexWMx+4IEHnkinpzYD1KrZnKrETrsYGZzCyOAUDux7EqZloH5eAEtW1GPFmkYsDd1SUL8v/HKHkoAC+NtIJHKgoEFqHBEABZ599tljHR0dX2a2dwE0t+rKaciCdWwX46MpjI+mcPB3ozCMw4jWB7BwWRQrVjfgknkeBQsBDEy+glPHvQN/zDgSiUS/1d3dXfHajn5ABECR3bt3v9LR0dEFuE8BKGmYe47FAPLGdRnxiTTiE2kc/v0YiP4JoYiJ+YsjWLG6AWuW3H3Ra954USnw5xoG/nzHjh1S6qtARAAUISJm5ue3bNlyF7PzPQA36raphDAq6CswM5IJGycOn8GJw2fwOj2JYNDEvIUhtKyqx8enkooZf9y7ePGynWU32MeIAOTB9MGSdzo7O+/NZFJfBvgbAC3XbVexMFM3ER8AcA+ADQCaUckAMQPplIPhgQSGB3LmXX36EuZEIBCSjL8ikV2AAti5c+eZPXt6vxMIhDcR0Z8C3Adg9ov6PEiUMXatcgDIMDDQ07P3r2688abN4XD0CiLzRsD4E4B2ATiBIn63cmGa5v/YuXPn+7rtmOvIQekimS4lVm/b9pVEfI/r8m0AX8aMBiIQQC7ALbn6IILypZ152weC63H3OBF9a8+e3q9f+P1YLGb09fVFE4nESsDZ5Lq4F+DPAbwCIM8blcrIB5YVvFmSfopHBKDExGIxq7+/P3T69OlgNGpTImFd57r2z1DFf+vZBOBCmJk6OzsjrusudV33M0TOvcy4FaDVAOoqYCoAuIDx+Z6enmcqNJ6vkRhAiYnFYjayLvMkAGzbdv9J14WD6v5bK+1DTMdAEgA+nP56pqurK+g4EwtSKWxgpjuY3c3MtI4I81CWJSb3Aih5dlOtUs0fSl9gWdFh206Mo8Rbh6WEmeOFvra7uzsN4OT01wvbt2//zydPnpznOM5qIr7NcdzNAK4FeBERFXsPxThg/plk/JUOEYAys2jRoo+PHTvyWwCbddsyCwwYB0vV2Xe/+90MgJHpr31dXV3fisfjdUS0ipk/x2zfQ0SbAFoGIKhsJLNjGMZf7t695z2p8Vc65C9ZATo62r7guu4/luAJWA5OEJl37dmzp2QikItYLGb09/dHxsdPtWQyxrUA3wvwrczcmuPAVZKI/tY0A3+1a9cutX1CQQnxACqAZQWfy2TSuwHu1G3LBaQB49srVqxQul6nFEyf1Z8EcGj668ft7e0hIiwCcDXg3gHgJgAtADIAvUtk/LCuru5FKe9desQDqBAdHR2rXDfzTSLjIQAB3fYAfNwwzL+LRuu/193dPa7bmnPZvn17YHBwMBwKhYx4PJ6UNX/5EAGoIJ2dnQ2ZTGYjEd8F4Apmt851y7ugNQxmInIdB7ZpIsFMJ4j4N8zGvpUrVx6dXrMLNYoIgAaYmZ544omK/e0ff/xxBj7ZxhMEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRDmNv8f5yGUtIqctHIAAAAASUVORK5CYII=" },
        { test: "hat_7.png",  replaceWith: "https://i.imgur.com/vAOzlyY.png" },
        { test: "hat_15.png", replaceWith: "https://i.imgur.com/YRQ8Ybq.png" },
        { test: "hat_11.png", replaceWith: "https://i.imgur.com/yfqME8H.png" },
        { test: "hat_12.png", replaceWith: "https://i.imgur.com/VSUId2s.png" },
        { test: "hat_40.png", replaceWith: "https://i.imgur.com/Xzmg27N.png" },
        { test: "hat_26.png", replaceWith: "https://i.imgur.com/I0xGtyZ.png" },
        { test: "hat_6.png",  replaceWith: "https://i.imgur.com/vM9Ri8g.png" },
        { test: "musket_1_d.png", replaceWith: "https://i.imgur.com/jwH99zm.png" },
        { test: "musket_1_r.png", replaceWith: "https://i.imgur.com/jPE54IT.png" },
        { test: "samurai_1_d.png", replaceWith: "https://i.imgur.com/4ZxIJQM.png" },
        { test: "samurai_1_g.png", replaceWith: "https://i.imgur.com/QKBc2ou.png" },
        { test: "samurai_1_r.png", replaceWith: "data:image/png;base64,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" },
        { test: "samurai_1.png", replaceWith: "data:image/png;base64,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" },
        { test: "shield_1_d.png", replaceWith: "https://i.imgur.com/hSqLP3t.png" },
        { test: "shield_1_r.png", replaceWith: "https://i.imgur.com/SNFV2dc.png" },
        { test: "spear_1_d.png", replaceWith: "https://i.imgur.com/HSWcyku.png" },
        { test: "spear_1_g.png", replaceWith: "https://i.imgur.com/jKDdyvc.png" },
        { test: "spear_1.png", replaceWith: "data:image/png;base64,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" },
        { test: "spear_1_r.png", replaceWith: "data:image/png;base64,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" },
        { test: "stick_1_d.png", replaceWith: "https://i.imgur.com/H5wGqQR.png" },
        { test: "stick_1_g.png", replaceWith: "https://i.imgur.com/NOaBBRd.png" },
        { test: "stick_1_r.png", replaceWith: "https://i.imgur.com/uTDGDDy.png" },
        { test: "sword_1_d.png", replaceWith: "https://i.imgur.com/h5jqSRp.png" },
        { test: "sword_1_g.png", replaceWith: "https://i.imgur.com/wOTr8TG.png" },
        { test: "sword_1_r.png", replaceWith: "https://i.imgur.com/V9dzAbF.png" },
        { test: "sword_1.png", replaceWith: "data:image/png;base64,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" }
    ];

    const orig = Object.getOwnPropertyDescriptor(Image.prototype, "src");
    Object.defineProperty(Image.prototype, "src", {
        set(l) {
            for (const { test, replaceWith } of textureReplacements) {
                if (l.includes(test)) {
                    l = replaceWith;
                    break;
                }
            }
            orig.set.call(this, l);
        },
        get: orig.get,
        configurable: true
    });
})();

//WeaponReloadPrediction
(function () {
	"use strict";

	let ws;
	const msgpack = window.msgpack;

	WebSocket.prototype._send = WebSocket.prototype.send;
	WebSocket.prototype.send = function (m) {
		if (!ws) {
			ws = this;
			window.ws = this;
		}
		this._send(m);
	};

	function modifyCanvasRenderingContext2D() {
		if (CanvasRenderingContext2D.prototype.roundRect) {
			CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) {
				this.beginPath();
				this.rect(x, y, w, h);
				this.closePath();
				return this;
			};
		}
	}

	if (window.jQuery) {
		$(document).ready(modifyCanvasRenderingContext2D);
	} else {
		window.addEventListener("load", modifyCanvasRenderingContext2D);
	}

	window.Cow.setCodec(msgpack);

	const smoothReload = new WeakMap();

	function lerp(a, b, t) {
		return a + (b - a) * t;
	}

	window.Cow.addRender("global", () => {
		const ctx = window.Cow.renderer.context;

		const hbWidth = window.config?.healthBarWidth ?? 50;
		const hbPad = window.config?.healthBarPad ?? 5;
		const nameY = window.config?.nameY ?? 0;

		const width = hbWidth / 2 - hbPad / 2;
		const height = 17;

		window.Cow.playersManager.eachVisible(player => {
			if (!player || !player.alive) return;

			let state = smoothReload.get(player);
			if (!state) {
				state = { p: 0, s: 0 };
				smoothReload.set(player, state);
			}

			const targetP =
				player.reloads?.primary
					? Math.min(player.reloads.primary.count / player.reloads.primary.max, 1)
					: 0;

			const targetS =
				player.reloads?.secondary
					? Math.min(player.reloads.secondary.count / player.reloads.secondary.max, 1)
					: 0;

			state.p = lerp(state.p, targetP, 0.15);
			state.s = lerp(state.s, targetS, 0.15);

			const yOffset =
				player.renderY + player.scale + nameY - 5;

			const barColor = player.isAlly ? "#8ecc51" : "#cc5151";

			ctx.save();

			ctx.fillStyle = "#3d3f42";
			ctx.fillRect(
				player.renderX - width * 1.19 - width - hbPad,
				yOffset - height / 2,
				2 * width + 2 * hbPad,
				height
			);

			ctx.fillStyle = barColor;
			ctx.fillRect(
				player.renderX - width * 1.19 - width,
				yOffset - height / 2 + hbPad,
				2 * width * state.p,
				height - 2 * hbPad
			);

			ctx.fillStyle = "#3d3f42";
			ctx.fillRect(
				player.renderX + width * 1.19 - width - hbPad,
				yOffset - height / 2,
				2 * width + 2 * hbPad,
				height
			);

			ctx.fillStyle = barColor;
			ctx.fillRect(
				player.renderX + width * 1.19 - width,
				yOffset - height / 2 + hbPad,
				2 * width * state.s,
				height - 2 * hbPad
			);

			ctx.restore();
		});

		const ageBar = document.getElementById("ageBarBody");
		if (ageBar) {
			ageBar.style.backgroundColor = "#b00000";
			ageBar.style.border = "2px solid #600000";
			ageBar.style.transform = "translateY(-3px)"; // bajado 3px desde -6px
		}
	});
})();

//HealBarsBuildings
// @require      https://update.greasyfork.org/scripts/480301/1283571/CowJS.js
// @require      https://update.greasyfork.org/scripts/480303/1282926/MooUI.js
(function () {
	"use strict";

	function init() {
		if (!window.Cow) {
			setTimeout(init, 100);
			return;
		}

		const Cow = window.Cow;

		function drawHP(ctx, o) {
			const max = o.maxHealth || o.maxHP || 100;
			const cur = o.health || o.hp || max;
			if (cur >= max) return;

			const hp = cur / max;
			const r = 22;
			const w = 10;
			const a = hp * Math.PI * 2;

			ctx.save();
			ctx.translate(o.renderX || o.x, o.renderY || o.y);

			// Fondo
			ctx.strokeStyle = "#2b0000";
			ctx.lineWidth = w;
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, Math.PI * 2);
			ctx.stroke();

			// HP rojo
			ctx.strokeStyle = "#b00000";
			ctx.lineWidth = w - 3;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, a);
			ctx.stroke();

			// Porcentaje de vida
			const percent = Math.floor(hp * 100) + "%";
			ctx.font = "bold 14px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#ffffff";
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 2;
			ctx.strokeText(percent, 0, 0);
			ctx.fillText(percent, 0, 0);

			ctx.restore();
		}

		function render() {
			if (!Cow.player) return;
			const ctx = Cow.renderer.context;

			Cow.objectsManager.eachVisible((o) => {
				if (
					(o.health == null && o.hp == null) ||
					(o.maxHealth == null && o.maxHP == null)
				) return;

				drawHP(ctx, o);
			});
		}

		if (Cow.addRender) {
			Cow.addRender("hp-circle-red", render);
		} else {
			(function loop() {
				render();
				requestAnimationFrame(loop);
			})();
		}
	}

	if (document.readyState === "complete") init();
	else window.addEventListener("load", init);
})();

//AutoVerifity
(function () {
    'use strict';

    let ws = null;
    let { msgpack } = window;
    let playerID = null;
    let myPlayer = {
        id: null, x: null, y: null, dir: null, object: null, weapon: null,
        clan: null, isLeader: null, maxXP: 300, XP: 0, age: 1,
        hat: null, accessory: null, isSkull: null, maxHealth: 100,
        health: 100
    };
    let players = [], enemy = [], nearestEnemy = {};
    let gameCanvas = document.getElementById("gameCanvas");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX, mouseY;

    const sendPacket = (packet, ...data) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(new Uint8Array(msgpack.encode([packet, data])));
        }
    };

    const updatePlayers = data => {
        players = [];
        for (let i = 0; i < data[1].length / 13; i++) {
            const playerInfo = data[1].slice(i * 13, i * 13 + 13);
            if (playerInfo[0] === myPlayer.id) {
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
            } else {
                players.push({
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
    };

    const updateHealth = (health, playerIDCheck) => {
        if (myPlayer.id === playerIDCheck) {
            myPlayer.health = health;
            console.log("[🩸 Salud actualizada]", health);
        }
    };

    const handleMessage = (message) => {
        const decoded = msgpack.decode(new Uint8Array(message.data));
        const data = Array.isArray(decoded) && decoded.length > 1 ? [decoded[0], ...decoded[1]] : decoded;
        if (!data) return;
        const type = data[0];
        if (type === "C" && myPlayer.id == null) {
            myPlayer.id = data[1];
            console.log("[✔️ Verificación] ID del jugador:", myPlayer.id);
        }
        if (type === "a") updatePlayers(data);
        if (type === "O") updateHealth(data[2], data[1]);
    };

    const socketFound = (sock) => {
        sock.addEventListener("message", handleMessage);
        if (gameCanvas) {
            gameCanvas.addEventListener("mousemove", ({ x, y }) => {
                mouseX = x;
                mouseY = y;
            });
        }
        window.addEventListener("resize", () => {
            width = window.innerWidth;
            height = window.innerHeight;
        });
    };

    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (m) {
        if (!ws) {
            ws = this;
            document.websocket = this;
            socketFound(this);
            console.log("[🔌 WebSocket] Interceptado correctamente.");
        }
        this.oldSend(m);
    };

    const altchaCheck = setInterval(() => {
        let altcha = document.getElementById('altcha');
        let altchaBox = document.getElementById('altcha_checkbox');
        if (altcha && altchaBox) {
            altcha.style.display = 'none';
            altchaBox.checked = true;
            altchaBox.click();
            clearInterval(altchaCheck);
            console.log("[🚫 Altcha] Eliminado.");
        }
    }, 500);
})();

//AutoReloadWeb
(function() {
    "use strict";

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function refreshPage() {
        await delay(1500);
        window.onbeforeunload = null;
        location.reload();
    }

    function interceptProperty(target, propName, onSetCallback) {
        const hiddenKey = Symbol(propName);
        Object.defineProperty(target, propName, {
            get() {
                return this[hiddenKey];
            },
            set(value) {
                onSetCallback(this, hiddenKey, value);
            },
            configurable: true
        });
    }

    function wrapFunction(originalFunc, wrapper) {
        return new Proxy(originalFunc, {
            apply(target, thisArg, args) {
                return wrapper.call(thisArg, target, args);
            }
        });
    }

    interceptProperty(Object.prototype, "errorCallback", (obj, key, val) => {
        obj[key] = val;
        if (typeof val !== "function") return;
        obj[key] = wrapFunction(val, (target, args) => {
            window.alert = () => {};
            refreshPage();
            return target.apply(this, args);
        });
    });

    ["onclose", "onerror"].forEach(eventName => {
        const descriptor = Object.getOwnPropertyDescriptor(WebSocket.prototype, eventName);
        if (!descriptor || !descriptor.set) return;
        Object.defineProperty(WebSocket.prototype, eventName, {
            set(handler) {
                const wrappedHandler = wrapFunction(handler, (target, args) => {
                    refreshPage();
                    return target.apply(this, args);
                });
                descriptor.set.call(this, wrappedHandler);
            }
        });
    });

})();

//Radar
(function () {
    "use strict";

    const playersMap = new Map();
    let playerId = null;
    let radarLayer = null;
    let wsHooked = false;

    function getRadarLayer() {
        if (radarLayer) return radarLayer;

        radarLayer = document.createElement("div");
        radarLayer.id = "xrd-radar-layer";

        Object.assign(radarLayer.style, {
            position: "fixed",
            inset: "0",
            pointerEvents: "none",
            contain: "strict",
            willChange: "transform",
            zIndex: "40"
        });

        const ui = document.getElementById("mainMenu");
        if (ui) {
            const z = parseInt(getComputedStyle(ui).zIndex);
            if (!isNaN(z)) radarLayer.style.zIndex = z - 1;
        }

        document.documentElement.appendChild(radarLayer);
        return radarLayer;
    }

    function hookWebSocketSafely() {
        if (wsHooked) return;
        wsHooked = true;

        const originalAddEvent = WebSocket.prototype.addEventListener;

        WebSocket.prototype.addEventListener = function (type, listener, options) {
            if (type === "message") {
                const wrapped = (e) => {
                    try {
                        if (e.data instanceof ArrayBuffer) {
                            const data = msgpack.decode(e.data);

                            if (data[0] === "C") {
                                playerId = data[1][0];
                            }

                            if (data[0] === "a") {
                                playersMap.clear();
                                const info = data[1][0];
                                for (let i = 0; i < info.length; i += 13) {
                                    playersMap.set(info[i], {
                                        x: info[i + 1],
                                        y: info[i + 2],
                                        team: info[i + 7]
                                    });
                                }
                            }
                        }
                    } catch (_) {}

                    listener.call(this, e);
                };

                return originalAddEvent.call(this, type, wrapped, options);
            }

            return originalAddEvent.call(this, type, listener, options);
        };
    }

    function createArrow(id) {
        let arrow = document.getElementById("xrd-r-" + id);
        if (arrow) return arrow;

        arrow = document.createElement("div");
        arrow.id = "xrd-r-" + id;

        Object.assign(arrow.style, {
            position: "fixed",
            width: "0",
            height: "0",
            borderStyle: "solid",
            borderWidth: "10px 0 10px 20px",
            pointerEvents: "none",
            zIndex: "1"
        });

        getRadarLayer().appendChild(arrow);
        return arrow;
    }

    function updateRadar() {
        requestAnimationFrame(updateRadar);

        if (!playerId || !playersMap.has(playerId)) return;

        const me = playersMap.get(playerId);
        const cx = innerWidth / 2;
        const cy = innerHeight / 2;

        for (const [id, p] of playersMap) {
            if (id === playerId) continue;

            const arrow = createArrow(id);

            const dx = p.x - me.x;
            const dy = me.y - p.y;

            const angle = Math.atan2(dy, dx);
            const rotation = -angle * 180 / Math.PI;

            const dist = Math.min(Math.hypot(dx, dy) / 600, 1);

            Object.assign(arrow.style, {
                display: "block",
                opacity: dist,
                transform: `rotate(${rotation}deg)`,
                left: `${cx + Math.cos(angle) * cy * dist}px`,
                top: `${cy - Math.sin(angle) * cy * dist}px`,
                borderColor:
                    p.team && p.team === me.team
                        ? "transparent transparent transparent #00ff00"
                        : "transparent transparent transparent #ff0000"
            });
        }

        document.querySelectorAll('[id^="xrd-r-"]').forEach(el => {
            const id = +el.id.replace("xrd-r-", "");
            if (!playersMap.has(id)) el.remove();
        });
    }

    hookWebSocketSafely();
    updateRadar();

})();

//Menu
(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

    #moddedMenu, #moddedMenu * { box-sizing: border-box; font-family: 'Poppins', system-ui, sans-serif; }

    :root {
        --bg-main: #0a0a0a;
        --bg-panel: #1a1a1a;
        --accent: #c40000;
        --accent-dark: #550000;
        --text-main: #ffffff;
        --radius-lg: 16px;
        --radius-md: 12px;
        --radius-sm: 8px;
    }

    #moddedMenu { position: fixed; inset: 0; display: none; justify-content: center; align-items: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(6px); z-index: 999999; }
    #moddedMenu.open { display:flex; }

    .rd-wrapper { width: 900px; height: 560px; background: var(--bg-main); border-radius: var(--radius-lg); padding: 14px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 0 40px rgba(196,0,0,0.7); }

    .rd-header { height: 56px; background: var(--bg-panel); border-radius: var(--radius-md); padding: 0 18px; display: flex; align-items: center; gap: 12px; position: relative; }
    .rd-header h1 { font-size: 18px; font-weight: 600; color: var(--text-main); margin:0; display:flex; align-items:center; gap:8px; }
    .rd-close { position: absolute; right: 12px; top: 12px; width: 32px; height: 32px; border-radius: var(--radius-sm); border:none; background: var(--accent); color:#fff; cursor:pointer; }

    .rd-main { flex:1; display:flex; gap:12px; }

    .rd-navbar { width:200px; background: var(--bg-panel); border-radius: var(--radius-md); padding:8px; display:flex; flex-direction: column; gap:8px; }
    .rd-nav-btn { height:46px; border-radius: var(--radius-sm); border:none; background: var(--bg-main); color:#fff; cursor:pointer; font-size:14px; transition:.25s; }
    .rd-nav-btn:hover { background: var(--accent); }
    .rd-nav-btn.active { background: var(--accent); box-shadow: 0 0 12px var(--accent); }

    .rd-content { flex:1; background: var(--bg-panel); border-radius: var(--radius-md); padding:16px; position:relative; overflow:hidden; }
    .rd-page { position:absolute; inset:16px; opacity:0; transform: translateY(20px); pointer-events:none; transition:.3s; overflow:hidden; }
    .rd-page.active { opacity:1; transform: translateY(0); pointer-events:auto; }
    .rd-page h2 { margin-bottom:12px; font-size:17px; color:#fff; }

    .rd-select, .rd-button { width:80%; padding:8px; margin:6px auto; display:block; border-radius:8px; border:1px solid var(--accent); background:#111; color:#fff; text-align:center; font-family: monospace; font-size:1em; }
    .rd-button { cursor:pointer; transition:.2s; font-weight:bold; }
    .rd-button:hover { background: var(--accent); }

    #buttons { display:flex; justify-content:center; gap:12px; margin:8px 0; }
    .indicator { text-align:center; color: var(--accent); font-size:0.9em; }
    .indicator.active { color:#00ff66; }

    #keybingPage { overflow-y:auto; padding-right:4px; }
    #keybingPage::-webkit-scrollbar { width:8px; }
    #keybingPage::-webkit-scrollbar-track { background: #111; border-radius: 8px; }
    #keybingPage::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 8px; }
    #keybingPage::-webkit-scrollbar-thumb:hover { background: var(--accent-dark); }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div'); menu.id='moddedMenu';
    menu.innerHTML = `
    <div class="rd-wrapper">
        <div class="rd-header">
            <h1><img src="https://files.catbox.moe/5bucev.png" style="width:40px;height:40px;border-radius:50%;"> 𝕩-ℝ𝕖𝕕𝔻𝕣𝕒𝕘𝕠𝕟 ℂ𝕝𝕚𝕖𝕟𝕥</h1>
            <button class="rd-close">𝗫</button>
        </div>
        <div class="rd-main">
            <div class="rd-navbar">
                <button class="rd-nav-btn active" data-id="keybing">Keybing</button>
                <button class="rd-nav-btn" data-id="music">Music</button>
                <button class="rd-nav-btn" data-id="bot">Bot</button>
                <button class="rd-nav-btn" data-id="credits">Credits</button>
            </div>
            <div class="rd-content">
                <div class="rd-page active" data-page="keybing" id="keybingPage"><h2>Key Bindings</h2></div>
                <div class="rd-page" data-page="music" id="musicPage"></div>
                <div class="rd-page" data-page="bot" id="botPage"></div>
                <div class="rd-page" data-page="credits" id="creditsPage">
                    <h2>Credits</h2>
                    <button class="rd-button" id="ytBtn">Visit YouTube Channel</button>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(menu);

    const keybingPage = document.getElementById('keybingPage');
    const mods = [
        {name:"InstaNormal", key:"R"},
        {name:"ReverseInsta", key:"T"},
        {name:"BoostInsta", key:"Y"},
        {name:"BoostSpike", key:"G"},
        {name:"4Traps/Boost", key:"B"},
        {name:"4Spikes", key:"C"},
        {name:"AntiTrap", key:","},
        {name:"AutoMills", key:"M"},
        {name:"Trap/BoostPad", key:"F"},
        {name:"Spike", key:"V"},
        {name:"Mill", key:"N"},
        {name:"Teleport/Turret", key:"H"},
        {name:"FastBreak", key:"ClickRight"}
    ];
    mods.forEach(mod=>{
        if(!mod.key) return;
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.marginBottom = '6px';
        row.style.padding = '6px 12px';
        row.style.background = '#111';
        row.style.border = '1px solid #c40000';
        row.style.borderRadius = '8px';
        row.style.color = '#fff';
        row.style.fontFamily = 'monospace';
        const name = document.createElement('span'); name.textContent = mod.name;
        const keyBox = document.createElement('span'); keyBox.textContent = mod.key;
        keyBox.style.background = '#c40000';
        keyBox.style.color = '#fff';
        keyBox.style.padding = '2px 6px';
        keyBox.style.borderRadius = '4px';
        keyBox.style.fontWeight = 'bold';
        row.appendChild(name); row.appendChild(keyBox);
        keybingPage.appendChild(row);
    });

    const musicPage = document.getElementById('musicPage');
    const musicTracks = [
    {name:"Alan Walker - Faded",url:"https://files.catbox.moe/p9om0y.mp3"},
    {name:"Alan Walker - Alone",url:"https://files.catbox.moe/xptxat.mp3"},
    {name:"TheFatRat - Unity",url:"https://files.catbox.moe/cx5uyo.mp3"},
    {name:"TheFatRat - Monody",url:"https://files.catbox.moe/7fwpbl.mp3"},
    {name:"NEFFEX - Fight Back",url:"https://files.catbox.moe/iif5rx.mp3"},
    {name:"NEFFEX - Never Give Up",url:"https://files.catbox.moe/2pamid.mp3"},
    {name:"Alan Walker - Dust",url:"https://files.catbox.moe/w1sb9x.mp3"},
    {name:"Alan Walker - Catch Me",url:"https://files.catbox.moe/74b06c.mp3"},
    {name:"Alan Walker - Last Song",url:"https://files.catbox.moe/nuta1v.mp3"},
    {name:"Egzod - Royalty ft. Neoni",url:"https://files.catbox.moe/zlfc04.mp3"},
    {name:"Rival - Lonely Way", url:"https://files.catbox.moe/pvvol1.mp3"},
    {name:"Rival - Throne", url:"https://files.catbox.moe/1xptgl.mp3"},
    {name:"Rival - Be Gone", url:"https://files.catbox.moe/1b66yg.mp3"},
    {name:"Rival - Walls", url:"https://files.catbox.moe/9fts5y.mp3"},
    {name:"Rival - Control", url:"https://files.catbox.moe/gkd21e.mp3"},
    {name:"Egzod - No Rival", url:"https://files.catbox.moe/s6lw44.mp3"},
    {name:"do not resurrect - Necrotic Grip", url:"https://files.catbox.moe/12ndfn.mp3"},
    {name:"Witchouse 40k - Black Rainbow", url:"https://files.catbox.moe/41hpxf.mp3"},
    {name:"Grim Salvo - Feasting", url:"https://files.catbox.moe/rpicy8.mp3"},
    {name:"Initial D - Don't Stand so Close", url:"https://files.catbox.moe/mvt5vu.mp3"},
    {name:"Initial D - The Top", url:"https://files.catbox.moe/m05yul.mp3"},
    {name:"Initial D - Gas Gas Gas", url:"https://files.catbox.moe/i125jn.mp3"},
    {name:"Initial D - Running In The 90's", url:"https://files.catbox.moe/x9i2yf.mp3"},
    {name:"Initial D - No One Sleep In Tokyo", url:"https://files.catbox.moe/d7ma70.mp3"},
    {name:"UNSECRET & Noeni - Fallout", url:"https://files.catbox.moe/cz07sk.mp3"},
    {name:"V O E - Giants", url:"https://files.catbox.moe/a5hp0f.mp3"},
    {name:"Neoni - Champion", url:"https://files.catbox.moe/ptuaf6.mp3"},
    {name:"JPB & Mendum - Losing Control", url:"https://files.catbox.moe/1ta7n9.mp3"},
    {name:"Freddie Dredd - Limbo", url:"https://files.catbox.moe/vt686o.mp3"},
    {name:"xxxmanera - NFS", url:"https://files.catbox.moe/do69yr.mp3"},
    {name:"Take Me Home", url:"https://files.catbox.moe/t60gd6.mp3"},
    {name:"rarin - GTA", url:"https://files.catbox.moe/4h68o1.mp3"},
    {name:"Ghost", url:"https://files.catbox.moe/6kewnq.mp3"},
    {name:"Rico Story 1", url:"https://files.catbox.moe/h4jfhb.mp3"},
    {name:"xxxmanera - Loyalty Before Royalty", url:"https://files.catbox.moe/nlo77z.mp3"},
    {name:"xxxmanera - Sosa! Baby", url:"https://files.catbox.moe/6s1lnp.mp3"},
    {name:"xxxmanera - Dead Idol", url:"https://files.catbox.moe/pa14i1.mp3"},
    {name:"CRVN x Zack Merci - Nobody", url:"https://files.catbox.moe/lgjj6h.mp3"},
    {name:"Cheriimoya, Sierra Kidd - Living Life", url:"https://files.catbox.moe/hg93qr.mp3"},
    {name:"Adrenaline - ACE", url:"https://files.catbox.moe/1vr1px.mp3"}
    ];

    const musicSelect = document.createElement('select'); musicSelect.className='rd-select';
    musicTracks.forEach(track=>{ const o=document.createElement('option'); o.value=track.url; o.textContent=track.name; musicSelect.appendChild(o); });
    musicPage.appendChild(musicSelect);
    const buttonsDiv = document.createElement('div'); buttonsDiv.id='buttons';
    const playBtn = document.createElement('button'); playBtn.className='rd-button'; playBtn.textContent='Play';
    const stopBtn = document.createElement('button'); stopBtn.className='rd-button'; stopBtn.textContent='Stop';
    buttonsDiv.appendChild(playBtn); buttonsDiv.appendChild(stopBtn);
    musicPage.appendChild(buttonsDiv);
    const modeSelect = document.createElement('select'); modeSelect.className='rd-select';
    modeSelect.innerHTML=`<option value="repeat">Repeat</option><option value="next">Next</option>`;
    musicPage.appendChild(modeSelect);
    const audio = document.createElement('audio'); audio.id='audioPlayer'; musicPage.appendChild(audio);
    function playMusic(){ audio.src=musicSelect.value; audio.play(); }
    playBtn.addEventListener('click',()=>{ if(audio.src!==musicSelect.value) audio.src=musicSelect.value; audio.play(); });
    stopBtn.addEventListener('click',()=>{ audio.pause(); audio.currentTime=0; });
    musicSelect.addEventListener('change',()=>{ if(!audio.paused) playMusic(); });
    audio.addEventListener('ended',()=>{
        if(modeSelect.value==='repeat'){audio.currentTime=0; audio.play();}
        else { const idx=(musicSelect.selectedIndex+1)%musicSelect.options.length; musicSelect.selectedIndex=idx; playMusic(); }
    });

    const botPage = document.getElementById('botPage');
    const respawnBtn = document.createElement('button'); respawnBtn.className='rd-button'; respawnBtn.textContent='Disable Respawn';
    const chatToggleBtn = document.createElement('button'); chatToggleBtn.className='rd-button'; chatToggleBtn.textContent='Chat Spam: ON';
    const moveToggleBtn = document.createElement('button'); moveToggleBtn.className='rd-button'; moveToggleBtn.textContent='Bot Movement: ON';
    const respawnIndicator = document.createElement('div'); respawnIndicator.className='indicator active'; respawnIndicator.textContent='Respawn Enabled';
    botPage.appendChild(respawnBtn); botPage.appendChild(chatToggleBtn); botPage.appendChild(moveToggleBtn); botPage.appendChild(respawnIndicator);

    let chatEnabled=true, movementEnabled=true, respawnEnabled=true;
    respawnBtn.addEventListener('click',()=>{ respawnEnabled=false; respawnIndicator.textContent='Respawn Disabled'; respawnIndicator.classList.remove('active'); });
    chatToggleBtn.addEventListener('click',()=>{ chatEnabled=!chatEnabled; chatToggleBtn.textContent=`Chat Spam: ${chatEnabled?'ON':'OFF'}`; bots.forEach(b=>b.chatIndex=0); });
    moveToggleBtn.addEventListener('click',()=>{ movementEnabled=!movementEnabled; moveToggleBtn.textContent=`Bot Movement: ${movementEnabled?'ON':'OFF'}`; bots.forEach(b=>b.autm.boolean=movementEnabled); });

    document.getElementById('ytBtn').addEventListener('click',()=>{ window.open('https://youtube.com/@x-RedDragonOficial','_blank'); });

    menu.querySelector('.rd-close').onclick = ()=>menu.classList.remove('open');
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') menu.classList.toggle('open'); });
    menu.querySelectorAll('.rd-nav-btn').forEach(btn=>{
        btn.onclick=()=>{
            const id = btn.dataset.id;
            menu.querySelectorAll('.rd-nav-btn').forEach(b=>b.classList.remove('active'));
            menu.querySelectorAll('.rd-page').forEach(p=>p.classList.remove('active'));
            btn.classList.add('active');
            menu.querySelector(`[data-page="${id}"]`).classList.add('active');
        };
    });

    const msgpackLite = window.msgpack;
    const NativeWebSocket = window.WebSocket;

    let mainSocket; let bots=[]; let ownPlayer={sid:null,x:0,y:0,dir:0,skinIndex:0,name:null};
    const chatMessages = [
    "Hello mooaddict",
    "I am hathu slave",
    "Watch out",
    "Run",
    "Attack",
    "Stay close",
    "Help me",
    "Gather wood",
    "Enemy here",
    "Follow me",
    "Build faster",
    "Need food",
    "Collect stone",
    "We are surrounded",
    "Stay alert",
    "Hide now",
    "Defend base",
    "Make weapons",
    "We need walls",
    "Get ready",
    "Nice job",
    "We got this",
    "Keep going",
    "Move quick",
    "Hold position",
    "Dont give up",
    "Im low health",
    "Im out of food",
    "Im out of wood",
    "They are coming",
    "Go left",
    "Go right",
    "Go back",
    "Go forward",
    "Stay behind me",
    "They are weak",
    "Im farming",
    "Need backup",
    "Keep distance",
    "Good teamwork",
    "We can win",
    "Nice defense",
    "Im crafting",
    "Wait for me",
    "Lets rush",
    "Lets raid",
    "Attack the base",
    "Protect me",
    "I need help",
    "Follow the plan",
    "Stay hidden",
    "Get gold",
    "Get food",
    "Get wood",
    "Get stone",
    "Im ready",
    "Im almost done",
    "Wait a second",
    "Come fast",
    "I see enemies",
    "They found us",
    "We lost it",
    "We won",
    "That was close",
    "That was easy",
    "They are strong",
    "We need towers",
    "Keep farming",
    "Stay near",
    "Dont move",
    "Im a pro trust me",
    "This base is art",
    "My spike is hungry",
    "I run faster scared",
    "No plan only chaos",
    "Im lag but I fight",
    "Cow squad on top",
    "We moo together",
    "Im speed in person",
    "Banana tactic go",
    "Im lost send help",
    "My brain left",
    "Build or cry",
    "They fear my hat",
    "Im not scared ok yes",
    "Run like your life",
    "Silent but deadly",
    "I see danger",
    "I smell danger",
    "Danger everywhere",
    "I believe in us",
    "Charge like heroes",
    "Focus target",
    "Keep pressure",
    "Break their hopes",
    "Moo power active",
    "Too many run",
    "My hand hurts",
    "Calm and destroy",
    "We fight proud",
    "Smart move",
    "Big brain plan",
    "Small brain moment",
    "Hit and run",
    "Push forward",
    "Retreat fast",
    "Hold the gate",
    "Guard the king",
    "Farm like beasts",
    "Never surrender",
    "Stay sharp",
    "Stay alive",
    "Almost victory",
    "We need magic",
    "Battle cry",
    "Keep the hype",
    "Trust the plan",
    "Plan is gone",
    "Hope is gone",
    "Im doing my best",
    "They are flanking",
    "Stay in group",
    "We lost the gate",
    "Hold strong",
    "I am defending",
    "I am attacking",
    "They push hard",
    "Watch the top",
    "Build traps",
    "Farm more",
    "More spikes needed",
    "Fix the gate",
    "Im watching mid",
    "Go defend bottom",
    "They hit base",
    "Rebuild walls",
    "Collect gold fast",
    "Upgrade base",
    "We need mills",
    "Hold the bridge",
    "Guard the side",
    "Farm zone clear",
    "Im leader now",
    "We go all in",
    "Stay hidden well",
    "They are camping",
    "Ambush them",
    "Flank right",
    "Flank left",
    "Charge now",
    "Defend the core",
    "They got traps",
    "Avoid spikes",
    "Place walls",
    "Keep crafting",
    "Push together",
    "Wait regroup",
    "We rebuild fast",
    "Dont panic",
    "Stay calm",
    "This is fun",
    "Nice teamwork",
    "We are legends",
    "They fear us",
    "We are unstoppable",
    "Base looks great",
    "That was smart",
    "My ping is bad",
    "I lag too much",
    "Im invisible now",
    "I am speed",
    "They cant stop me",
    "Im not dying",
    "Im eating berries",
    "Cow mode on",
    "Im building art",
    "Lag gives power",
    "Im peaceful",
    "They hit hard",
    "Ouch that hurt",
    "Im too good",
    "No mercy",
    "We moo again",
    "Respect the cow",
    "We rule this map",
    "Im born to win",
    "Sleep is for noobs",
    "Too easy",
    "One more fight",
    "This is chaos",
    "They panic now",
    "I see the base",
    "Charge now",
    "Move fast",
    "Keep running",
    "Dont look back",
    "Left side clear",
    "Right side safe",
    "We are hunters",
    "They are doomed",
    "Focus the king",
    "Guard the mills",
    "They rush mid",
    "Stay on hill",
    "We control map",
    "Hold for life",
    "They are lost",
    "Nice escape",
    "Close call",
    "Big fight ahead",
    "We can hold",
    "More traps needed",
    "That was intense",
    "We are still alive",
    "They rebuild fast",
    "Im low on gold",
    "Feed me wood",
    "Feed me stone",
    "Feed me food",
    "Feed me gold",
    "Base is safe",
    "Base is gone",
    "We are rich",
    "We are poor",
    "We can rebuild",
    "They failed attack",
    "We need allies",
    "We need cows",
    "We need spikes",
    "We need hope",
    "Im proud of us",
    "Good shot",
    "Nice hit",
    "Keep farming food",
    "Push the wall",
    "Reclaim land",
    "Moo gang rise",
    "No walls no fear",
    "I run circles",
    "I lag to win",
    "Im a builder cow",
    "We moo in peace",
    "They stole my mill",
    "Im chasing them",
    "We are raiders",
    "Cow army ready",
    "Attack formation",
    "Defend the herd",
    "Keep mooing",
    "Never stop mooing",
    "Stay focused",
    "Hold strong base",
    "Repair fast",
    "We hold line",
    "They broke gate",
    "Keep guard up",
    "They retreat",
    "Dont let escape",
    "Chase them all",
    "We take land",
    "I need tools",
    "Make gear fast",
    "Im collecting",
    "Build mill fast",
    "They spy us",
    "Hide mills",
    "Good strategy",
    "Big brain team",
    "Keep control",
    "Push line",
    "I got resources",
    "We share loot",
    "We are family",
    "We moo united",
    "Im not scared",
    "They are scared",
    "This is victory",
    "Easy claps",
    "Best team ever",
    "We are heroes",
    "The fight continues",
    "Stay with me",
    "We win again",
    "Lets end this",
    "Final push",
    "Stay in cover",
    "Watch tower up",
    "Collect fast",
    "Farm nonstop",
    "Never stop",
    "All good",
    "Nice plan",
    "Smart idea",
    "Lets chill",
    "We are cracked",
    "This is easy win",
    "We destroy all",
    "Hold the base",
    "Dont split up",
    "Together strong",
    "They rush us",
    "Stay quiet",
    "Prepare defense",
    "Final wave",
    "Dont lose hope",
    "Victory soon",
    "We stand tall",
    "Defend to end",
    "Time to strike",
    "Stay brave",
    "Go defend base",
    "Dont waste food",
    "Repair now",
    "Trap the gate",
    "Spike wall done",
    "Go raid now",
    "We can rebuild",
    "Stay together",
    "Im respawning",
    "They rush again"
    ];
    let randomHats=[28,29,30,36,37,38,42,43,44,49];

    async function safeDecode(event){
        try{
            let buf;
            if(event.data instanceof Blob) buf=new Uint8Array(await event.data.arrayBuffer());
            else if(event.data instanceof ArrayBuffer) buf=new Uint8Array(event.data);
            else return null;
            return msgpackLite.decode(buf);
        }catch{return null;}
    }

    function hookPacket(decoded){ if(!decoded) return null; return decoded.length>1 && Array.isArray(decoded[1]) ? [decoded[0], ...decoded[1]] : decoded; }

    class WebSocketProxy extends NativeWebSocket {
        constructor(...args){
            super(...args);
            if(!mainSocket){ mainSocket=this;
                this.addEventListener("message", async e=>{
                    let hooked=hookPacket(await safeDecode(e)); if(!hooked) return;
                    if(hooked[0]==="io-init"){ let region=mainSocket.url.split("/")[2]; const BOT_COUNT=3;
                        for(let i=0;i<BOT_COUNT;i++){ let token=await altSolver.generate(); bots.push(new BotClient(region,token)); }
                    }
                    if(hooked[0]==="C" && ownPlayer.sid==null) ownPlayer.sid=hooked[1];
                    if(hooked[0]==="D" && hooked[1][1]===ownPlayer.sid) ownPlayer.name=hooked[1][2];
                    if(hooked[0]==="a"){
                        for(let i=0;i<hooked[1].length/13;i++){ let p=hooked[1].slice(13*i,13*i+13); if(p[0]==ownPlayer.sid) [ownPlayer.x,ownPlayer.y,ownPlayer.dir,ownPlayer.skinIndex]=[p[1],p[2],p[3],p[9]]; }
                        for(let b of bots){ b.autm.x=ownPlayer.x; b.autm.y=ownPlayer.y; }
                    }
                });
            }
        }
    }
    window.WebSocket = WebSocketProxy;

    class BotClient {
        constructor(region, token){
            this.socket=new NativeWebSocket(`wss://${region}/?token=${token}`);
            this.sid=null; this.x=0; this.y=0; this.dir=0; this.weaponIndex=0; this.health=100; this.foodCount=100; this.packetCount=0;
            this.autm={x:0,y:0,boolean:true}; this.chatIndex=0; setInterval(()=>this.packetCount=0,1000);

            this.socket.addEventListener("open",()=>{
                setInterval(()=>{
                    if(this.sid && chatEnabled){ let msg=chatMessages[this.chatIndex]; this.sendMessage("6",msg); this.chatIndex=(this.chatIndex+1)%chatMessages.length; }
                },750);

                this.socket.addEventListener("message",async e=>{
                    let hooked=hookPacket(await safeDecode(e)); if(!hooked) return;
                    if(hooked[0]==="io-init" && respawnEnabled) this.spawn();
                    if(hooked[0]==="C" && this.sid==null) this.sid=hooked[1];
                    if(hooked[0]==="D" && hooked[1][1]===this.sid){ this.foodCount=100; this.health=100; }
                    if(hooked[0]==="a"){
                        for(let i=0;i<hooked[1].length/13;i++){ let p=hooked[1].slice(13*i,13*i+13); if(p[0]===this.sid) [this.x,this.y,this.dir,this.weaponIndex]=[p[1],p[2],p[3],p[5]]; }
                        this.equipIndex(0, randomHats[Math.floor(Math.random()*randomHats.length)],0);
                        if(this.autm.boolean){
                            let dx = this.autm.x - this.x;
                            let dy = this.autm.y - this.y;
                            let dist = Math.hypot(dx, dy);
                            if(dist > 5){
                                let ang = Math.atan2(dy, dx);
                                this.sendMessage("9", ang);
                            } else {
                                this.sendMessage("9", null);
                            }
                        }
                    }
                    if(hooked[0]==="P" && respawnEnabled) this.spawn();
                });
            });
        }

        spawn(){ if(!respawnEnabled) return; let randomSkin=Math.floor(Math.random()*15); this.sendMessage("M",{name:"goldbot",moofoll:true,skin:randomSkin}); }
        equipIndex(buy,id,index){ this.sendMessage("c",buy,id,index); }
        sendMessage(type,...args){ if(this.packetCount<120){ this.socket.send(new Uint8Array(msgpackLite.encode([type,args]))); this.packetCount++; } }
    }

    class AltSolver {
        constructor(){ this.core_count=Math.min(16,navigator.hardwareConcurrency||8); this.workers=[]; this.initialized=false; this.blobUrl=null; }

        initWorkerPool() {
            if(this.initialized) return;
            const workerCode = `
                importScripts('https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/build/sha256.min.js');
                let challenge=null, salt=null;
                self.onmessage=function(e){
                    const data=e.data;
                    if(data.init){ challenge=data.challenge; salt=data.salt; self.postMessage({ready:true}); return; }
                    const {start,end}=data;
                    for(let i=start;i<=end;i++){ if(sha256(salt+i)===challenge){ self.postMessage({found:i}); return; } }
                    self.postMessage({done:true});
                };
            `;
            const blob=new Blob([workerCode],{type:"application/javascript"});
            this.blobUrl=URL.createObjectURL(blob);
            for(let i=0;i<this.core_count;i++) this.workers.push(new Worker(this.blobUrl));
            this.initialized=true;
        }

        async getChallenge(){
            const response=await fetch("https://api.moomoo.io/verify");
            return await response.json();
        }

        async solveChallenge(challengeData){
            this.initWorkerPool();
            const {challenge,salt,maxnumber}=challengeData;
            const segmentSize=Math.ceil(maxnumber/this.core_count);
            let solved=false, doneCount=0;

            return new Promise((resolve,reject)=>{
                const startTime=performance.now();
                const tasks=this.workers.map((worker,idx)=>({ start:idx*segmentSize, end:Math.min(maxnumber,(idx+1)*segmentSize-1) }));

                this.workers.forEach((worker,idx)=>{
                    worker.onmessage=e=>{
                        const msg=e.data;
                        if(msg.ready) worker.postMessage(tasks[idx]);
                        else if(msg.found!=null && !solved){
                            solved=true;
                            const number=msg.found;
                            const took=((performance.now()-startTime)/1000).toFixed(2);
                            resolve({challenge,salt,maxnumber,number,took});
                            this.cleanupWorkers();
                        } else if(msg.done){ doneCount++; if(!solved && doneCount===this.workers.length){ reject(new Error("Challenge not solved")); this.cleanupWorkers(); } }
                    };
                    worker.onerror=err=>{ if(!solved){ reject(err); this.cleanupWorkers(); } };
                    worker.postMessage({init:true,challenge,salt});
                });
            });
        }

        cleanupWorkers(){
            this.workers.forEach(w=>w.terminate());
            this.workers=[]; this.initialized=false;
            if(this.blobUrl){ URL.revokeObjectURL(this.blobUrl); this.blobUrl=null; }
        }

        static createPayload(Data,Date_){
            return btoa(JSON.stringify({
                algorithm:"SHA-256",
                challenge:Data.challenge,
                salt:Data.salt,
                number:Date_.number,
                signature:Data.signature||null,
                took:Date_.took
            }));
        }

        async generate(){
            const challengeData=await this.getChallenge();
            const solution=await this.solveChallenge(challengeData);
            this.code=`alt:${AltSolver.createPayload(challengeData,solution)}`;
            return this.code;
        }
    }

    let altSolver = new AltSolver();
})();