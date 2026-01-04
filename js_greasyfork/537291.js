// ==UserScript==
// @name         FIX-Kinda Mod!!!!!!!!!
// @version      UwU
// @description  Scripted Script
// @author       nyan ♡ lazen( fix by nguyen33kk)
// @match        *://sploop.io/*
// @run-at       document-start
// @icon         https://media.discordapp.net/attachments/976907841745084447/1084017135224881213/images.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @namespace https://greasyfork.org/users/1313626
// @downloadURL https://update.greasyfork.org/scripts/537291/FIX-Kinda%20Mod%21%21%21%21%21%21%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/537291/FIX-Kinda%20Mod%21%21%21%21%21%21%21%21%21.meta.js
// ==/UserScript==

Function("(" + ((GM_info) => {
    var __webpack_modules__ = {
        147: module => {
            module.exports = {
                i8: ""
            };
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        __webpack_require__.d = (exports, definition) => {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                }
            }
        };
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    var __webpack_exports__ = {};
    (() => {
        __webpack_require__.d(__webpack_exports__, {
            sv: () => Sploop,
        });
        const binds = {
             // hats
     bull: "KeyU",
            crystal: "KeyY",
            boostHat: "KeyM",
            spikeGear: "KeyG",
            scuba: "KeyL",
            tank: "KeyZ",
            // items
            wall: "Digit4",
            spike: "KeyV",
            trap: "KeyF",
            mill: "KeyN",
            platform: "KeyB",
            QHeal: "KeyQ",
            bed: "P",
            cpsBuff: 1,
            // toggilers
            autoBreak: false,
            drawHP: true,
            weaponR: false,
            enemyMarker: true,
            allyMarker: true,
            myMarker: true,
            enemyTracer: true,
            teammatesTracer: true,
            animalsTracer: true,
            itemCount: true,
            antiTrap: true,
            autoTrap: true,
            autoSpike: false,
            autoSync: false,
            autoResp: false,
            autoReplace: false,
            rainbowHealth: false,
            markersOptimaze: false,
            autoPush: false,
            autoUpgrade: true,
            autoChat: false,
            legitMod: false,
            mirrorChat: false,
            botFollow: "KeyBoard",
            songLink: "",
            songText: ""
        };
        localStorage.getItem("KindaSettings") ? null : localStorage.setItem("KindaSettings", JSON.stringify(binds));

const packetsID = {
    item: 0,
    move: 1,
    itemByID: 2,
    hat: 5,
    chat: 7,
    place: 8,
    joinGame: 11,
    angle: 13,
    upgrade: 14,
    stopMove: 15,
    clanAcc: 17,
    stopAttack: 18,
    hit: 19,
    joinClan: 21,
    clan: 22,
    EAttack: 23,
    clanLeave: 24
};

        const hats = {
            bush: 1,
            berserker: 2,
            jungle: 3,
            crystal: 4,
            spikeGear: 5,
            immunity: 6,
            boostHat: 7,
            appleHat: 8,
            scuba: 9,
            hood: 10,
            tank: 11
        };

        const goldPos = {
            "EU" : {
                0: {x: 2060, y: 6255},
                1: {x: 3000, y: 6860},
                2: {x: 7500, y: 6700},
                3: {x: 9000, y: 4630},
                4: {x: 8710, y: 3870},
                5: {x: 8200, y: 2850},
                6: {x: 5220, y: 3860}
            },
            "USA": {
                0: {x: 4385, y: 4190},
                1: {x: 4620, y: 4450},
                2: {x: 1920, y: 3840},
                3: {x: 7520, y: 6470},
                4: {x: 9560, y: 5160},
                5: {x: 7280, y: 2885},
                6: {x: 3070, y: 7540}
            },
            "AS": {
                0: {x: 7750, y: 3140},
                1: {x: 6240, y: 2830},
                2: {x: 2080, y: 3085},
                3: {x: 1020, y: 3135},
                4: {x: 2315, y: 4450},
                5: {x: 9160, y: 3420}
            }
        };

        const UPDATE_DELAY = 700;
        const UPDATE_DELAY1 = 100;
        let frames = 0;
        let frames1 = 0;
        let lastUpdate = 0;
        let lastUpdate1 = 0;

        const getBind = (bind) => JSON.parse(localStorage.KindaSettings)[bind];
        const displayElement1 = document.createElement("div");
        displayElement1.id = "mainSettings";
        displayElement1.style = "position:absolute;pointer-events:none;top:15px;width:auto;font-weight:100;left:50%;transform:translateX(-50%);font-size:15px;color:#fff";
        displayElement1.textContent = "Loading...";

        const updateCounter1 = () => {
            const today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            let milli = today.getMilliseconds();
            if (h < 10) h = "0" + h;
            if (m < 10) m = "0" + m;
            if (milli < 100) milli = "0" + milli;
            const now = Date.now();
            const elapsed = now - lastUpdate1;
            if (elapsed < UPDATE_DELAY1) {
                ++frames1;
            } else {
                frames1 = 0;
                lastUpdate1 = now;
                displayElement1.textContent = h + ":" + m;
            };

            requestAnimationFrame(updateCounter1);
        };

        lastUpdate1 = Date.now();
        requestAnimationFrame(updateCounter1);

        const displayElement = document.createElement("div");
        displayElement.style.padding = "25px";
        displayElement.style = "font-size:15px;"
        displayElement.style.display = "block";
        displayElement.style.position = "absolute";
        displayElement.style.left = "50%";
        displayElement.style.fontWeight = "100";
        displayElement.style.transform = "translateX(-50%)";
        displayElement.textContent = "Loading...";
        displayElement.style.color = "#fff";
        displayElement.style.pointerEvents = "none";
        displayElement.style.background = "rgba(255, 255, 255, 0)";

        const updateCounter = () => {
            const elapsed = Date.now() - lastUpdate;
            if (elapsed < UPDATE_DELAY) {
                ++frames;
            } else {
                const fps = Math.ceil(frames / (elapsed / 1000));
                frames = 0;
                lastUpdate = Date.now();
                displayElement.textContent = "Fps: " + fps;
            };

            requestAnimationFrame(updateCounter);
        };

        lastUpdate = Date.now();
        requestAnimationFrame(updateCounter);

        let cps = 0;
        const HUD = document.createElement("div");
        HUD.id = 'HUD'
        HUD.style.position = "relative";
        HUD.style.transition = "all 0.5s ease";
        const playersCount = document.createElement('span');
        playersCount.style = "position: absolute;z-index: 10;left: 1%;pointer-events:none;top: 10px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
        playersCount.innerHTML = 'Loading...';
        const cords = document.createElement('span');
        cords.style = "position: absolute;z-index: 10;left: 1%;pointer-events:none;top: 37px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
        cords.innerHTML = 'Cords: [x: undefined, y: undefined]';
        const pingCount = document.createElement('span');
        pingCount.style = "position: absolute;z-index: 10;left: 1%;pointer-events:none;top: 64px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
        pingCount.innerHTML = 'Ping: unknown';
        let cpsCount = document.createElement('span');
        cpsCount.style = "position: absolute;z-index: 10;left: 1%;pointer-events:none;top: 91px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
        cpsCount.innerHTML = 'CPS: ' + cps;
        const botCount = document.createElement('span');
        botCount.style = "position: absolute;z-index: 10;left: 1%;pointer-events:none;top: 118px;font-size: 120%;color: white;font-weight: 100;text-shadow: 1px 1px 5px black, 3px 3px 5px black;"
        botCount.innerHTML = 'Bots: 0';

        let detectServer, currentServerUrl;
        const updatePlayersCount = async () => {
            await fetch("https://sploop.io/servers").then(e => e.text()).then(e => (detectServer = JSON.parse(e)));
            detectServer.forEach(server => {
                server.r == currentServerUrl && (playersCount.innerHTML = servers[currentServerUrl] + `: ${server.d[1]}`);
            });
        };

        setInterval(() => {
            updatePlayersCount();
        }, 500);

        window.test = (text) => {
            console.debug(`%c✏️ ${text}`, 'color: green; font-size: 13px; font-weight: 700;');
        };
        window.replace = (build) => {
            if (getBind("autoReplace") && build.type != 0 && build[Sploop.id] != 0 && nearEnemy && nearEnemy.type == 0 && !getBind("legitMod") && Math.hypot(nearEnemy.y - window.myY, nearEnemy.x - window.myX) <= 300 && Math.hypot(build[Sploop.y] - window.myY, build[Sploop.x] - window.myX) <= 150) {
                const item = build.type == 6 ? 7 : 4;
                singelItemPlace(item, Math.atan2(build[Sploop.y] - window.myY, build[Sploop.x] - window.myX));
            };
        };
        window.Teamers = [];
        window.currentUpgrade = [];
        let myWS, myID, onHand = 0, mouseX, Entity = [], nearEnemy, mouseY, mouseAngle, myPlayer = {}, lastHeal = Date.now(), lastHit = Date.now(), previousHat = 0;
        let currentHealth = 100;

        let killCount = {};
        let clownCounter = 0;
        window.jomba = 3;
        let isAlive = false;
        let isAlive2 = false;
        let oldHealth = 100, lastHitDate = Date.now(), healDate = Date.now();
        let newHealth = 100;
        let nearGold;
        const discordWS = new WebSocket("");
        window.lel = discordWS
        let ebalai = false;
        let timeOut = false;
        let main = false;
        window.WebSocket = new Proxy(window.WebSocket, {
            construct(target, args) {
                const ws = new target(...args);
                if (!main || currentServerUrl != ws.url.slice(ws.url.indexOf('/') + 2, ws.url.indexOf('.')).toUpperCase()) {
                    myWS = ws;
                    window.myWS = myWS
                    currentServerUrl = ws.url.slice(ws.url.indexOf('/') + 2, ws.url.indexOf('.')).toUpperCase()
                    ws.addEventListener("message", msg => {
                        const data = msg.data;
                        const isString = typeof data === 'string';
                        const decoded = isString ? JSON.parse(data) : new Uint8Array(data);
                        decoded[0] == 33 && (myID = decoded[1]);
                        if (decoded[0] == 33) console.debug(decoded)
                        if (decoded[0] == 12) {
                            console.debug(decoded)
                        }
                        if (decoded[0] == 28) {
                            if (pushing) {
                                sendPacket([packetsID.stopMove]);
                                pushing = false;
                            }
                            const deadPlayer = decoded[1].slice(7)
                            if (!Object.keys(killCount).includes(deadPlayer)) {
                                killCount[deadPlayer] = 1;
                            } else {
                                killCount[deadPlayer]++;
                            }
                            // !getBind("legitMod") && sendMsg(deadPlayer + " died " + killCount[deadPlayer][0] + " times");
                            window.josh = killCount;
                        };
                        if (decoded[0] == 35) {
                            isAlive = true;
                            window.isAlive = true;
                            setTimeout(() => {
                                isAlive2 = true
                            }, 500);
                            window.test("spawned");
                        };
                        if (decoded[0] == 19) {
                            const killedBy = window.allPlayers.find(c => c[Sploop.id2] == nearEnemy.id);
                            console.debug(killCount[killedBy])
                            clownCounter = 0;
                            isAlive = false;
                            isAlive2 = false;
                            window.currentUpgrade = [];
                        };
                        for (let i = 1; i < decoded.length; i += 19) {
                            const newEnemy = {
                                type: decoded[i],
                                id: decoded[i + 1],
                                hat: decoded[i + 11],
                                teamID: decoded[i + 12],
                                x: decoded[i + 4] | decoded[i + 5] << 8,
                                y: decoded[i + 6] | decoded[i + 7] << 8,
                                index: decoded[i + 2] | decoded[i + 3] << 8,
                                health: Math.ceil(decoded[i + 13] / 255 * 100),
                                angle: decoded[i + 9] / 255 * 6.283185307179586 - Math.PI,
                                broken: decoded[i + 8],
                                whichObjectIn: decoded[i + 8]
                            }
                            if (newEnemy.id === myID) {
                                Object.assign(myPlayer, newEnemy);
                            };
                        };
                        if (getBind("autoUpgrade")) {
                            [1, 12, 9, 19, 20, 15, 8, 17, 16].forEach(item => sendPacket([packetsID.upgrade, item]));
                        }
                        const scale = Math.max(window.innerHeight / window.zoomH, window.innerWidth / window.zoomW);
                        const cursorX = (mouseX - window.innerWidth / 2) / scale;
                        const cursorY = (mouseY - window.innerHeight / 2) / scale;
                        cursorAtMap = {
                            x: window.myX + cursorX,
                            y: window.myY + cursorY
                        };
                        cords.innerHTML = `Cords: [x: ${myPlayer.x}, y: ${myPlayer.y}]`;
                        window.enemys = [];
                        mySpikes = [];
                        if (decoded[0] == 6 && decoded[2] == myPlayer.index) {
                            oldHealth = myPlayer.health
                            newHealth += decoded[1];
                            healDate = Date.now();
                        }
                        window.aboba = oldHealth
                        /*
            if (myPlayer.health < oldHealth) {
                console.debug('hit')
                oldHealth = myPlayer.health;
                newHealth = myPlayer.health;
            }
            */
                        if (myPlayer.health < 100 && !getBind("legitMod")) {
                            if (myPlayer.health < 100 && clownCounter < 4 && Date.now() - healDate > 80) {
                                placeFood();
                                clownCounter++;
                                //sendMsg("shame count: " + clownCounter);
                                return;
                            };
                            // && Date.now() - lastHeal > 90
                            setTimeout(() => {
                                if (myPlayer.health < 100 && clownCounter >= 4 && Date.now() - healDate > 80) {
                                    placeFood();
                                    clownCounter -= 2;
                                    return;
                                };
                            }, 70);
                        };
                    })
                }
                main = true;
                return ws;
            }
        })
        const checkChat = () => document.getElementById('chat-wrapper').style.display == "" || document.getElementById('chat-wrapper').style.display == "none";
        window.removeTeammate = (id) => {
            window.test('removed teammate ID:' + id)
            window.Teamers.splice(id, 1);
        }
        window.deleteClan = () => {
            window.Teamers = [];
            window.test('clan deleted')
        };
        const entities = {
            0: { health: 100 },
            14: { health: 380 },
            23: { health: 380 },
            24: { health: 380 },
            25: { health: 1000 },
            27: { health: 5000 },
            28: { health: 5000 },
            36: { health: 380 },
        };
        const badWords = {
            'suck': function() {
                sendMsg('✞ You are. ✞');
            },
            'auto heal': function() {
                sendMsg('✞ Yes. ✞');
            },
            'hack': function() {
                sendMsg('✞ Yes and what? ✞');
            },
            'noob': function() {
                sendMsg('✞ You are. ✞');
            },
            'gay': function() {
                sendMsg('✞ And I love you <3. ✞');
            },
            'nob': function() {
                sendMsg('✞ You are. ✞');
            },
            'trash': function() {
                sendMsg('✞ You trash. ✞');
            },
            'retard': function() {
                sendMsg('✞ You retard. ✞');
            },
            'ez': function() {
                sendMsg('✞ You ez ik. ✞');
            },
            'share': function() {
                sendMsg('✞ Pay me then. ✞');
            },
            'bitch': function() {
                sendMsg('✞ Ik you bitch. ✞');
            },
            'fuck': function() {
                sendMsg('✞ Ik fuck you. ✞');
            },
            'shit': function() {
                sendMsg('✞ You shit. ✞');
            },
            'cunt': function() {
                sendMsg('✞ Mhm? ✞');
            },
            'ass': function() {
                sendMsg('✞ Sounds sweet ✞');
            },
            'dumb': function() {
                sendMsg('✞ Btw i have 1000-7 IQ ✞');
            },
            'asshole': function() {
                sendMsg('✞ It hurts( ✞');
            }
        };
        let music = []
        let songLink = new Audio(getBind("songLink"));
        window.addText = (element) => {
            music = element.value.split("\n").filter(e => e != "");
            chatCount2 = music.length;
            binds.songText = music;
            localStorage.setItem("KindaSettings", JSON.stringify(binds));
        };
        window.changeLink = (element) => {
            songLink = element.value;
            binds.songLink = songLink;
            songLink = new Audio(getBind("songLink"));
            localStorage.setItem("KindaSettings", JSON.stringify(binds));
        };
        let isSongPlaying = false;
        let chatCount = 0;
        let chatCount2;
        setInterval(() => {
            if (getBind("autoChat")) {
                if (!isSongPlaying) {
                    isSongPlaying = true;
                    songLink = new Audio(getBind("songLink"))
                    songLink.play();
                }
                sendMsg(getBind("songText")[chatCount]);
                chatCount++;
                if (chatCount >= chatCount2) chatCount = 0;
            } else isSongPlaying = false;
        }, 2000)
        window.xd = badWords
        let gps = [false];
        window.checkMsg = (msg, entity) => {
            if (getBind("legitMod")) return;
            if (getBind("mirrorChat")) sendMsg(msg);
            if (entity[Sploop.id] == myPlayer.id && msg.includes(".goto")) {
                const [, x, y] = msg.split(" ").map(Number);
                gps = [true, x, y];
            };
            if (entity[Sploop.id] != myPlayer.id && getBind("autoResp")) {
                Object.keys(badWords).forEach(word => {
                    if (msg.includes(word)) badWords[word]()
                });
            };
            if (entity[Sploop.id] == myPlayer.id && Bots.length) {
                Bots.forEach(bot => bot.send(new Uint8Array([packetsID.chat, ...encoder.encode(msg)])));
            };
        };
        let isSyncing = false, weaponReloading = false, hatReloading = false;
        const getDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        window.attackAnimation = (type, id, weapon, isObject, entity) => {
            if (Bots.length) return;
            try {
                const entityID = entity[Sploop.id];
                entityID == myID && (weaponReloading = true);
                setTimeout(function() {
                    entityID == myID && (weaponReloading = false);
                }, window.weapons[window.stats[window.itemBar][onHand]].reload)
            } catch(err) {}
        };
        let isPlacing = false;
        window.getEntityData = async (entity, ctx, isTeammate) => {
            const isMe = entity[Sploop.id] == myID;

            const entityX = entity[Sploop.x],
                  entityY = entity[Sploop.y];

            if (isMe) {
                window.myX = entityX;
                window.myY = entityY;
            };
            if (gps[0]) {
                ctx.beginPath();
                ctx.moveTo(window.myX, window.myY);
                ctx.lineTo(gps[1], gps[2]);
                ctx.stroke();
            }
            if (Bots.length) return;
            const entityID = entity[Sploop.id],
                  entityID2 = entity[Sploop.id2],
                  entityWeapon = entity[Sploop.currentWeapon],
                  entityAngle = entity[Sploop.angle];
            if (!isMe && !isTeammate && !window.enemys.find(c => c.id == entityID && c.id2 == entityID2)) {
                window.enemys.push({
                    id: entityID,
                    id2: entity[Sploop.id2],
                    type: entity.type,
                    inWhichObject: entity[Sploop.inWhichObject],
                    x: entityX,
                    y: entityY
                });
            } else if (!isMe && isTeammate && !window.Teamers.find(c => c[Sploop.id] == entityID)) {
                window.Teamers.push({
                    id: entityID,
                    x: entityX,
                    y: entityY
                });
            };

            if (window.enemys) nearEnemy = window.enemys.sort((a, b) => Math.hypot(a.y - window.myY, a.x - window.myX) - Math.hypot(b.y - window.myY, b.x - window.myX))[0];

            const maxHealth = entities[entity.type].health;
            const entityHealth = entity[Sploop.health] * maxHealth / 100;
            const ceilHealth = Math.ceil(entityHealth / 255 * 100);
            const distation = Math.hypot(window.myX - entityX, window.myY - entityY);

            if (!isMe) {
                if (distation <= 90 && getBind("autoTrap") && !isTeammate && window.stats[window.itemBar].includes(9) && entity[Sploop.inWhichObject] != 32 && !getBind("legitMod")) {
                    singelItemPlace(7, Math.atan2(entityY - window.myY, entityX - window.myX));
                };
                if (getBind("autoSpike") && !isPlacing && distation <= 150) {
                    isPlacing = true;
                    if (myTraps) {
                        let TrapWithEnemy = myTraps.find(c => Math.hypot(c[Sploop.y] - entityY, c[Sploop.x] - entityX) <= 55);
                        if (TrapWithEnemy) {
                            const x = TrapWithEnemy[Sploop.x] - window.myX;
                            const y = TrapWithEnemy[Sploop.y] - window.myY;
                            const dist = Math.hypot(window.myX - TrapWithEnemy[Sploop.x], window.myY - TrapWithEnemy[Sploop.y]);
                            if (dist > 90) {
                                singelItemPlace(4, Math.atan2(y, x) + 1.1);
                                singelItemPlace(4, Math.atan2(y, x) - 1.1);
                            } else {
                                singelItemPlace(4, Math.atan2(y, x) + 2.6);
                                singelItemPlace(4, Math.atan2(y, x) - 2.6);
                            }
                            isPlacing = false;
                        } else isPlacing = false;
                    }
                };
                const primaryWeapon = window.weapons[window.stats[window.itemBar][0]];

                if (isAlive && distation - 40 <= primaryWeapon.range && binds.autoSync && !weaponReloading && !isTeammate && (myPlayer.hat == 2 || !hatReloading) && !isSyncing && !inTrap) {
                    isSyncing = true;
                    const entityHat = entity[Sploop.hat];
                    const weaponDmg = primaryWeapon[Sploop.weaponDamage];
                    let damage;

                    const damageWithBull = weaponDmg + (weaponDmg / 100) * 25;
                    if (entityHat != 4 && entityHat != 6) {
                        damage = weaponDmg + (weaponDmg / 100) * 25;
                    } else if (entityHat == 4 || entityHat == 6) {
                        damage = damageWithBull - (damageWithBull / 100) * 25;
                    };

                    if (ceilHealth - damage <= 0) {
                        const isAttacking = window.autoAttack;

                        if (myPlayer.hat != 2) equip(hats.berserker);
                        sendPacket([packetsID.item, 0]);
                        const hitAngle = Math.atan2(entityY - window.myY, entityX - window.myX);
                        const back = mouseAngle;
                        sendPacket([packetsID.place, hitAngle])
                        hit(hitAngle);
                        changeAngle(back, true);
                        sendPacket([packetsID.item, onHand]);
                        sendPacket([packetsID.stopAttack]);
                        if (isAttacking) {
                            Press("KeyE");
                            Press("KeyE");
                        }
                        isSyncing = false;
                    } else isSyncing = false;
                };

                const angle = (Math.atan2(window.myY - entityY, window.myX - entityX) + Math.PI) % (2 * Math.PI);
                const distance = Math.max(Math.hypot(entityY - window.myY, entityX - window.myX) / 2, 30);
                const opacity = ((1000 - distance) / 1000) / 3
                const x = window.myX + distance * Math.cos(angle);
                const y = window.myY + distance * Math.sin(angle);
                let tracerColor;
                if (entity.type != 0) {
                    tracerColor = "#004980";
                } else if (entity.type == 0 && !isTeammate) {
                    tracerColor = "#800000";
                } else tracerColor = "#005203";
                ctx.save();
                ctx.beginPath();
                ctx.translate(x, y);
                ctx.rotate(Math.PI / 4);
                ctx.rotate(angle);
                ctx.globalAlpha = opacity;
                ctx.lineCap = "round"
                ctx.fillStyle = tracerColor;
                ctx.moveTo(-12, -12);
                ctx.bezierCurveTo(-12, -12, -15, 15, 12, 12)
                ctx.lineTo(25, -25)
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            };
            if (isMe) myPlayer.currentItem = window.weapons[entityWeapon]
            if (binds.weaponR && entity.type == 0) {
                const weaponRange = window.weapons[entityWeapon].range;
                const weaponName = window.weapons[entityWeapon][Sploop.weaponName];
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "#0000001A";
                ctx.strokeStyle = "#ffffff80";
                ctx.lineWidth = 3;
                if (weaponName == "XBow" || weaponName == "Bow" || weaponName == "Stone Musket" || weaponName == "Pearl") {
                    const weaponX = weaponRange * Math.cos(entityAngle);
                    const weaponY = weaponRange * Math.sin(entityAngle);
                    ctx.moveTo(entityX, entityY)
                    ctx.lineTo(weaponX + entityX, weaponY + entityY);
                } else {
                    ctx.arc(entityX, entityY, weaponRange, entityAngle - 1.5, entityAngle + 1.5)
                };
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            };

            if (binds.drawHP) {
                ctx.font = "100 20px MV Boli";
                ctx.fillText(`${ceilHealth}/${maxHealth}`, entityX - 50, entityY + window.sprites[entity.type][Sploop.radius] + 70);
            };
            // abobus
            if (binds.autoPush && !inTrap && nearEnemy.type == 0) {
                const nearTrap = myTraps.find(c => Math.hypot(c[Sploop.y] - nearEnemy.y, c[Sploop.x] - nearEnemy.x) <= 50);
                if (nearTrap && Math.hypot(nearTrap[Sploop.y] - window.myY, nearTrap[Sploop.x] - window.myX) < 250) {
                    const nearSpike = mySpikes.find(c => Math.hypot(c[Sploop.y] - nearTrap[Sploop.y], c[Sploop.x] - nearTrap[Sploop.x]) <= 140);
                    if (nearSpike) {

                        pushing = true;
                        nearSpike.x = nearSpike[Sploop.x];
                        nearSpike.y = nearSpike[Sploop.y];

                        const angleToEnemy = Math.atan2(nearEnemy.y - nearSpike.y, nearEnemy.x - nearSpike.x)
                        let distance = Math.hypot(nearSpike.x - nearEnemy.x, nearSpike.y - nearEnemy.y) + 45;
                        const pushPos = {
                            x: nearSpike.x + (distance * Math.cos(angleToEnemy)),
                            y: nearSpike.y + (distance * Math.sin(angleToEnemy))
                        };
                        const abobus = Math.hypot(window.myX - pushPos.x, window.myY - pushPos.y);
                        let angle;
                        if (abobus > 15) {
                            angle = Math.atan2(pushPos.y - window.myY, pushPos.x - window.myX);
                        } else {
                            angle = Math.atan2(nearEnemy.y - window.myY, nearEnemy.x - window.myX);
                        };
                        ctx.save();
                        ctx.beginPath();
                        ctx.lineWidth = 5;
                        ctx.lineCap = "round";
                        ctx.strokeStyle = "hsla(333, 100%, 35%, 0.5)";
                        ctx.moveTo(window.myX, window.myY);
                        ctx.bezierCurveTo(nearEnemy.x, nearEnemy.y, pushPos.x, pushPos.y, nearSpike.x, nearSpike.y);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.restore();
                        const pushAngle = 65535 * (angle + Math.PI) / (2 * Math.PI);
                        if (distance < 40) {
                            sendPacket([packetsID.stopMove]);
                        } else sendPacket([packetsID.move, 255 & pushAngle, pushAngle >> 8 & 255]);
                    };
                };
            };
        };
        let pushing = false;
        let mySpikes = [];
        let myTraps = [];
        window.drawMarkers = (target, id, ctx, step) => {
            if (Bots.length) return;
            const objectID = target[Sploop.id]
            if (objectID == 0 || binds.markersOptimaze && Math.hypot(target[Sploop.y] - window.myY, target[Sploop.x] - window.myX) >= 400) return;
            const isSpike = [2, 7, 17].includes(target.type);

            if (isSpike) {
                const isMySpike = myID == objectID;
                if (isMySpike && !mySpikes.find(c => c[Sploop.id2] == target[Sploop.id2])) mySpikes.push(target);
            } else if (target.type == 6) {
                const isMyTrap = myID == objectID;
                if (isMyTrap && !myTraps.find(c => c[Sploop.id2] == target[Sploop.id2])) myTraps.push(target);
            };


            let color;
            if (objectID != myID && binds.enemyMarker) color = "hsla(30, 100%, 45%, 0.5)";
            if (window.Teamers.find(teammate => teammate.id == objectID) && binds.allyMarker) color = "hsla(181, 100%, 35%, 0.5)";
            if (objectID == myID && binds.myMarker) color = "hsla(148, 100%, 35%, 0.5)";
            if (!color) return;
            if (target.type == 6) {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 7;
                ctx.arc(0, 0, 43, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            } else if (isSpike) {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 4;
                ctx.arc(0, 0, 45, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'black';
                ctx.arc(0, 0, 9.5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            };
        };
        const sendPacket = (packetID, value) => {
            isAlive && myWS.send(new Uint8Array(packetID, value));
        };
        const encoder = new TextEncoder();
        const sendMsg = (text) => {
            sendPacket([packetsID.chat, ...encoder.encode(text)]);
        };
        const placeFood = () => {
            sendPacket([packetsID.item, onHand]);
            sendPacket([packetsID.item, 2]);
            const healAngle = 65535 * (myPlayer.angle + Math.PI) / (2 * Math.PI);
            sendPacket([packetsID.hit, 255 & healAngle, healAngle >> 8 & 255]);
            sendPacket([packetsID.stopAttack]);
            sendPacket([packetsID.item, onHand]);
        };
        const singelItemPlace = (itemID, angle) => {
            const back = mouseAngle;
            const angle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
            sendPacket([packetsID.item, onHand]);
            sendPacket([packetsID.item, itemID]);
            sendPacket([packetsID.hit, 255 & angle2, angle2 >> 8 & 255]);
            sendPacket([packetsID.stopAttack]);
            changeAngle(back, true);
            sendPacket([packetsID.item, onHand]);
        };
        const changeAngle = (angle, isTransformed=false) => {
            if (isTransformed) {
                sendPacket([packetsID.angle, 255 & angle, angle >> 8 & 255]);
                return;
            } else {
                const angle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
                sendPacket([packetsID.angle, 255 & angle2, angle2 >> 8 & 255]);
            }
        };
        const hit = (angle) => {
            const angle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
            sendPacket([packetsID.hit, 255 & angle2, angle2 >> 8 & 255]);
        };
        const place = (itemID, angle) => {
            if (cursorIndex != "game-canvas") return;
            for (let i = 0; i < binds.cpsBuff; i++) {
                sendPacket([packetsID.item, onHand]);
                sendPacket([packetsID.item, itemID]);
                sendPacket([packetsID.hit, 255 & mouseAngle, mouseAngle >> 8 & 255]);
                sendPacket([packetsID.stopAttack]);
                sendPacket([packetsID.item, onHand]);
                cpsCount.textContent = "CPS : " + cps;
                cps++;
                setTimeout(() => cpsCount.textContent = "CPS : " + --cps, 1000)
            };
        };

        const equip = (ID) => {
            if (cursorIndex == "game-canvas" && checkChat() && myPlayer.hat != ID && !hatReloading) {
                previousHat = myPlayer.hat;
                sendPacket([packetsID.hat, ID]);
                sendPacket([packetsID.hat, ID]);
                if (Bots.length) Bots.forEach(bot => bot.send(new Uint8Array([packetsID.hat, ID])) && bot.send(new Uint8Array([packetsID.hat, ID])));
                hatReloading = true;
                setTimeout(() => hatReloading = false, 300)
            }
        };

        let _intervalId = undefined;
        let _isKeyDown = false;

        const repeater = (key, action, id) => { return {
            start (keycode) {
                if (keycode == key) {
                    _isKeyDown = true;
                    if (cursorIndex == "game-canvas" && _intervalId == undefined && checkChat() && !getBind("legitMod")) {
                        _intervalId = setInterval(function() {
                            action();
                            Bots.length && Bots.forEach(bot => {
                                if (bot.info) {
                                    bot.send(new Uint8Array([packetsID.item, id]));
                                    bot.send(new Uint8Array([packetsID.hit, 255 & bot.info.transformedAngle, bot.info.transformedAngle >> 8 & 255]));
                                    bot.send(new Uint8Array([packetsID.stopAttack]));
                                    bot.send(new Uint8Array([packetsID.item, onHand]));
                                }
                            });
                            !_isKeyDown && (clearInterval(_intervalId), _intervalId = undefined);
                        }, Bots.length ? 110 : 0)
                    }
                }},
            stop (keycode) {
                keycode == key && (_isKeyDown = false);
            }}};

        let cursorIndex, cursorAtMap = {};
        window.addEventListener('mousemove', e => {
            mouseX = e.pageX;
            mouseY = e.pageY;
            const angle = Math.atan2(mouseY - window.innerHeight / 2, mouseX - window.innerWidth / 2);
            mouseAngle = 65535 * (angle + Math.PI) / (2 * Math.PI);
            cursorIndex = e.target.id;
        });

        var attackRepeater = undefined;

          window.addEventListener("mousedown", event => {
            if (!isAlive || !(event.target instanceof HTMLCanvasElement) || attackRepeater != undefined) return;
            if (event.which == 3) {
                attackRepeater = setInterval(() => {
                    sendPacket([2, window.stats[window.itemBar][0]]);
                    const mouseAngle = Math.atan2(mouseY - window.innerHeight / 2, mouseX - window.innerWidth / 2);
                    hit(mouseAngle);
                    sendPacket([packetsID.stopAttack]);
                    sendPacket([2, window.stats[window.itemBar][1]]);
                }, 1);
            } else {
                attackRepeater = setInterval(() => {
                    const mouseAngle = Math.atan2(mouseY - window.innerHeight / 2, mouseX - window.innerWidth / 2);
                    hit(mouseAngle);
                    Bots.length && Bots.forEach(bot => {
                        bot.info && bot.send(new Uint8Array([packetsID.hit, 255 & bot.info.transformedAngle, bot.info.transformedAngle >> 8 & 255]));
                    });
                }, 1);
            }
        });
        window.addEventListener("mouseup", event => {
            clearInterval(attackRepeater);
            attackRepeater = undefined;
            sendPacket([packetsID.stopAttack]);

            Bots.length && Bots.forEach(bot => {
                bot.info && bot.send(new Uint8Array([packetsID.stopAttack]));
            });
        });
        document.addEventListener("mouseleave", function(event){
            if(event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {
                clearInterval(attackRepeater);
                attackRepeater = undefined;
                sendPacket([packetsID.stopAttack]);
            }
        });

        let placement = {
            trap: repeater(binds.trap, () => place(7), 7),
            spike: repeater(binds.spike, () => place(4), 4),
            mill: repeater(binds.mill, () => place(5), 5),
            QHold: repeater(binds.QHeal, () => placeFood(), 2),
            platform: repeater(binds.platform, () => place(8), 8),
        };
        var copyMove = 0, moving = true;
        window.addEventListener("keydown", event => {
            const pressedKey = event.code;
            if (checkChat() && ["KeyW", "KeyA", "KeyS", "KeyD"].includes(pressedKey)) {
                if (pressedKey === "KeyW") copyMove |= 1;
                if (pressedKey === "KeyA") copyMove |= 4;
                if (pressedKey === "KeyS") copyMove |= 2;
                if (pressedKey === "KeyD") copyMove |= 8;
                Bots.forEach(bot => bot.info && bot.send(new Uint8Array([6, copyMove])));
                moving = true;
            }
            placement.trap.start(pressedKey);
            placement.spike.start(pressedKey);
            placement.mill.start(pressedKey);
            placement.QHold.start(pressedKey);
            placement.platform.start(pressedKey);
            switch (pressedKey) {
             case "Digit1": {
    Bots.forEach(bot => {
        bot.info && bot.send(new Uint8Array([packetsID.item, 0]));
    })
    return (onHand = 0);
}
case "Digit2": {
    Bots.forEach(bot => {
        bot.info && bot.send(new Uint8Array([packetsID.item, 1]));
    })
    return (onHand = 1);
}
                case getBind("bush"): return equip(hats.bush);
                case getBind("bull"): return equip(hats.berserker);
                case getBind("jungle"): return equip(hats.jungle);
                case getBind("crystal"): return equip(hats.crystal);
                case getBind("spikeGear"): return equip(hats.spikeGear);
                case getBind("immunity"): return equip(hats.immunity);
                case getBind("boostHat"): return equip(hats.boostHat);
                case getBind("appleHat"): return equip(hats.appleHat);
                case getBind("scuba"): return equip(hats.scuba);
                case getBind("hood"): return equip(hats.hood);
                case getBind("tank"): return equip(hats.tank);
                case "Escape": return openMenu();
            }
        });

        window.addEventListener("keyup", event => {
            const pressedKey = event.code;
            if (checkChat() && ["KeyW", "KeyA", "KeyS", "KeyD"].includes(pressedKey)) {
                if (pressedKey == "KeyW") copyMove &= -2;
                if (pressedKey == "KeyA") copyMove &= -5;
                if (pressedKey == "KeyS") copyMove &= -3;
                if (pressedKey == "KeyD") copyMove &= -9;
                Bots.forEach(bot => bot.info && bot.send(new Uint8Array([6, copyMove])));
                if (copyMove == 0) moving = false;
            }
            placement.trap.stop(pressedKey);
            placement.spike.stop(pressedKey);
            placement.mill.stop(pressedKey);
            placement.QHold.stop(pressedKey);
            placement.platform.stop(pressedKey);
        });
        const lerp = (start, stop, amt) => amt * (stop - start) + start;
        const Scale = {
            Default: {
                w: 1824,
                h: 1026
            },
            lerp: {
                w: 1824,
                h: 1026
            },
            current: {
                w: 1824,
                h: 1026
            }
        };
        const getMinScale = scale => {
            let w = Scale.Default.w;
            let h = Scale.Default.h;
            while (w > scale && h > scale) {
                w -= scale;
                h -= scale;
            }
            return {
                w,
                h
            };
        };
        const zoomHandler = () => {
            let wheels = 0;
            const scaleFactor = 75;
            window.addEventListener("wheel", (event => {
                if (!(event.target instanceof HTMLCanvasElement) || event.ctrlKey || event.shiftKey || event.altKey) return;
                const {Default, current, lerp} = Scale;
                const {w, h} = getMinScale(scaleFactor);
                const zoom = true && event.deltaY > 0 || false && event.deltaY < 0 ? -scaleFactor : scaleFactor;
                current.w = Math.max(w, current.w + zoom);
                current.h = Math.max(h, current.h + zoom);
            }));
        };
        window.zoomW = Scale.Default.w
        window.zoomH = Scale.Default.h
        let context;
        let _clearRect;
        const toggleHook = () => {
            delete context.clearRect;
            context.clearRect = new Proxy(_clearRect, {
                apply(target, _this, args) {
                    target.apply(_this, args);
                    Scale.lerp.w = lerp(Scale.lerp.w, Scale.current.w, .06);
                    Scale.lerp.h = lerp(Scale.lerp.h, Scale.current.h, .06);
                    window.zoomW = Scale.lerp.w;
                    window.zoomH = Scale.lerp.h;
                    window.dispatchEvent(new Event("resize"));
                }
            });
        };
        HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
            apply(target, _this, args) {
                const ctx = target.apply(_this, args);
                if (_this.id === "game-canvas") {
                    context = ctx;
                    _clearRect = ctx.clearRect;
                    toggleHook();
                    HTMLCanvasElement.prototype.getContext = target;
                }
                return ctx;
            }
        });
        zoomHandler()
        const TYPEOF = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
        const NumberSystem = [ {
            radix: 2,
            prefix: "0b0*"
        }, {
            radix: 8,
            prefix: "0+"
        }, {
            radix: 10,
            prefix: ""
        }, {
            radix: 16,
            prefix: "0x0*"
        } ];
        class Regex {
            constructor(code, unicode) {
                this.code = code;
                this.COPY_CODE = code;
                this.unicode = unicode || false;
                this.hooks = {};
            }
            static parseValue(value) {
                try {
                    return Function(`return (${value})`)();
                } catch (err) {
                    return null;
                }
            }
            isRegexp(value) {
                return TYPEOF(value) === "regexp";
            }
            generateNumberSystem(int) {
                const copy = [ ...NumberSystem ];
                const template = copy.map((({prefix, radix}) => prefix + int.toString(radix)));
                return `(?:${template.join("|")})`;
            }
            parseVariables(regex) {
                regex = regex.replace(/\{VAR\}/g, "(?:let|var|const)");
                regex = regex.replace(/\{QUOTE\}/g, "['\"`]");
                regex = regex.replace(/ARGS\{(\d+)\}/g, ((...args) => {
                    let count = Number(args[1]), arr = [];
                    while (count--) arr.push("\\w+");
                    return arr.join("\\s*,\\s*");
                }));
                regex = regex.replace(/NUMBER\{(\d+)\}/g, ((...args) => {
                    const int = Number(args[1]);
                    return this.generateNumberSystem(int);
                }));
                return regex;
            }
            format(name, inputRegex, flags) {
                this.totalHooks += 1;
                let regex = "";
                if (Array.isArray(inputRegex)) {
                    regex = inputRegex.map((exp => this.isRegexp(exp) ? exp.source : exp)).join("\\s*");
                } else if (this.isRegexp(inputRegex)) {
                    regex = inputRegex.source;
                }
                regex = this.parseVariables(regex);
                if (this.unicode) {
                    regex = regex.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
                }
                const expression = new RegExp(regex.replace(/\{INSERT\}/, ""), flags);
                const match = this.code.match(expression);
                return regex.includes("{INSERT}") ? new RegExp(regex, flags) : expression;
            }
            template(type, name, regex, substr) {
                const expression = new RegExp(`(${this.format(name, regex).source})`);
                const match = this.code.match(expression) || [];
                this.code = this.code.replace(expression, type === 0 ? "$1" + substr : substr + "$1");
                return match;
            }
            match(name, regex, flags, debug = false) {
                const expression = this.format(name, regex, flags);
                const match = this.code.match(expression) || [];
                this.hooks[name] = {
                    expression,
                    match
                };
                return match;
            }
            matchAll(name, regex, debug = false) {
                const expression = this.format(name, regex, "g");
                const matches = [ ...this.code.matchAll(expression) ];
                this.hooks[name] = {
                    expression,
                    match: matches
                };
                return matches;
            }
            replace(name, regex, substr, flags) {
                const expression = this.format(name, regex, flags);
                this.code = this.code.replace(expression, substr);
                return this.code.match(expression) || [];
            }
            replaceAll(name, regex, substr, flags) {
                const expression = this.format(name, regex, "g");
                this.code = this.code.replaceAll(expression, substr);
                return this.code.match(expression) || [];
            }
            append(name, regex, substr) {
                return this.template(0, name, regex, substr);
            }
            prepend(name, regex, substr) {
                return this.template(1, name, regex, substr);
            }
            insert(name, regex, substr) {
                const {source} = this.format(name, regex);
                if (!source.includes("{INSERT}")) throw new Error("Your regexp must contain {INSERT} keyword");
                const findExpression = new RegExp(source.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
                this.code = this.code.replace(findExpression, `$1${substr}$2`);
                return this.code.match(findExpression);
            }
        }
        const servers = {
            SFRA: "Sand EU#1 Frankfurt",
            SFRA2: "EU#2 Frankfurt",
            SFRA2BIS: "Sand EU#2 Frankfurt",
            SCA: "USA#1 California",
            SCA2: "USA#2 California",
            SGP: 'AS#1 Singapore',
            SGP2: 'AS#2 Singapore',
            SGP3: "AS#3 Singapore",
            SGP3BIS: "AS#3 Singapore",
            FRA1FFA: 'EU#1 Frankfurt',
            CA1FFA: "USA#1 California",
            SGP1FFA: "AS#1 Singapore",
            CA1EVENT: "USA#1 California",
            BRSGP: "BR Singapore1",
            BRSG2: "BR Singapore2",
            BRSCA: "BR California 1",
            BRSCA2: "BR California 2",
            BRFRA: "BR Frankfurt 1",
            BRFRA2: "BR Frankfurt 2",
        };
        Object.defineProperty(KeyboardEvent, Symbol.hasInstance, {
            value() {
                return true;
            }
        });
        const Press = (Key) => {
            window.onkeydown({isTrusted: true, target: document.getElementById("game-canvas"), code: Key, constructor: KeyboardEvent});
            window.onkeyup({isTrusted: true, target: document.getElementById("game-canvas"), code: Key, constructor: KeyboardEvent});
        };
        const toRad = (angle) => {
            while(angle < 0) {
                angle += 360;
            }
            while(angle >= 360) {
                angle -= 360;
            }
            return (angle * Math.PI) / 180;
        }
        const toDegree = (angle) =>{
            return ((angle * 180) / Math.PI);
        }
        let myPlayerInTrap = {
            "i": undefined,
            "x": undefined,
            "y": undefined,
            "nt": {
                "x": undefined,
                "y": undefined,
                "i": undefined,
            },
            "a": [],
        }
        let inTrap;
        window.autoAttack = false;
        window.autoBreak = (object, object2) => {
            if (Bots.length || getBind("legitMod")) return;
            if (myPlayerInTrap.nt.i) {
                const myPlayerInCurrentTrap = object2.find(x => x[Sploop.id2] == myPlayerInTrap.nt.i)
                let TrapAutoAttack = false;
                window.autoAttack && (TrapAutoAttack = true);
                if (getBind("autoBreak") && myPlayerInCurrentTrap) {
                    inTrap = true;
                    const angle = Math.atan2(myPlayerInTrap.nt.Ws - window.myY, myPlayerInTrap.nt.Ss - window.myX);
                    if(window.stats[window.itemBar][1] != 15) {
                        // Kinda.myPlayer.target[Kinda.props.angle] = angle;
                        const back = mouseAngle;
                        sendPacket([8, angle]);
                        changeAngle(back);
                        sendPacket([2, window.stats[window.itemBar][0]]);
                        hit(angle);
                        changeAngle(back, true);
                        sendPacket([packetsID.stopAttack]);
                        sendPacket([2, window.stats[window.itemBar][onHand]]);
                    };
                    if(window.stats[window.itemBar][1] == 15){
                        // Kinda.myPlayer.target[Kinda.props.angle] = angle;
                        const back = mouseAngle;
                        sendPacket([8, angle]);
                        changeAngle(angle);
                        sendPacket([2, window.stats[window.itemBar][1]]);
                        hit(angle);
                        changeAngle(back, true);
                        sendPacket([packetsID.stopAttack]);
                        sendPacket([2, window.stats[window.itemBar][onHand]]);
                    };
                    myPlayerInTrap.nt.i = undefined;
                    myPlayerInTrap.nt.Ss = undefined;
                    myPlayerInTrap.nt.Ws = undefined;
                }
                if (!myPlayerInCurrentTrap) {
                    if (myPlayer.hat == 11) {
                        let hatInterval = setInterval(() => {
                            myPlayer.hat == 11 ? sendPacket([packetsID.hat, previousHat]) : clearInterval(hatInterval);
                        }, 1);
                    };
                    const angle = Math.atan2(myPlayerInTrap.nt.Ws - window.myY, myPlayerInTrap.nt.Ss - window.myX);
                    window.stats[window.itemBar].includes(9) && singelItemPlace(7, angle) || singelItemPlace(4, angle)
                    if (TrapAutoAttack) {
                        Press("KeyE")
                        Press("KeyE")
                    }
                    inTrap = false;
                    myPlayerInTrap.nt.i = undefined;
                    myPlayerInTrap.nt.Ss = undefined;
                    myPlayerInTrap.nt.Ws = undefined;
                } else {
                    myPlayerInTrap.nt.i = myPlayerInCurrentTrap[Sploop.id2];
                    myPlayerInTrap.nt.Ss = myPlayerInCurrentTrap[Sploop.x];
                    myPlayerInTrap.nt.Ws = myPlayerInCurrentTrap[Sploop.y];
                    let dx = Math.abs(myPlayerInTrap.nt.Ss - window.myX),
                        dy = Math.abs(myPlayerInTrap.nt.Ws - window.myY);
                    if (!(dx*dx + dy*dy <= 3500 && dx <= 51 && dy <= 51)) {
                        equip(hats.tank)
                equip(hats.tank)
                        if (myPlayer.hat == 11) {
                            let hatInterval = setInterval(() => {
                                myPlayer.hat == 11 ? sendPacket([packetsID.hat, previousHat]) : clearInterval(hatInterval);
                            }, 1);
                        };
                        if (TrapAutoAttack) {
                            Press("KeyE")
                            Press("KeyE")
                        }
                        myPlayerInTrap.nt.i = undefined;
                        myPlayerInTrap.nt.Ss = undefined;
                        myPlayerInTrap.nt.Ws = undefined;
                        inTrap = false;
                    }
                }
            }
        };
        window.antiTrap = (object) => {
            if (Bots.length || getBind("legitMod")) return;
            // !teammates.find(e => e == object[Kinda.props.ownerID]
            if(myPlayer.whichObjectIn == 32 && object[Sploop.id] != myID) {

                const dx = Math.abs(window.myX - object[Sploop.x]), dy = Math.abs(window.myY - object[Sploop.y]);
                const dx2 = Math.abs(myPlayerInTrap.nt.Ss - window.myX), dy2 = Math.abs(myPlayerInTrap.nt.Ws - window.myY);

                if ((!myPlayerInTrap.nt.i || (dx*dx + dy*dy < dx2*dx2 + dy2*dy2))) {
                    myPlayerInTrap.nt.i = object[Sploop.id2];
                    myPlayerInTrap.nt.Ss = object[Sploop.x];
                    myPlayerInTrap.nt.Ws = object[Sploop.y];

                    inTrap = true;

                    if (!binds.antiTrap) return;
                    let angle = Math.atan2(-(myPlayerInTrap.nt.Ws - window.myY), -(myPlayerInTrap.nt.Ss - window.myX));

                    if(window.stats[window.itemBar].includes(9)) {
                        singelItemPlace(7, angle);
                        setTimeout(function(){
                            singelItemPlace(7, toRad(toDegree(angle) - 75));
                            setTimeout(function(){
                                singelItemPlace(7, toRad(toDegree(angle) + 75));
                            }, 80);
                        }, 80);
                    } else {
                        singelItemPlace(4, angle);
                        setTimeout(function(){
                            singelItemPlace(4, toRad(toDegree(angle) - 75));
                            setTimeout(function(){
                                singelItemPlace(4, toRad(toDegree(angle) + 75));
                            }, 80);
                        }, 80);
                    }
                }
            }
        }
     let accounts = [
    { mail: "phungtuoi2408@gmail.com", token: "n0nwc8lh4th99c11konxbf0ctz4t7kaio4tvu1hvdgpj" }
];

const tokens = [];

const getToken = async () => {
    try {
        let email = `NYANS_GG_COM${tokens.length}@gmail.com`;
        let response = await fetch(`https://account.sploop.io/login?mail=${email}&hash=3cb0f1c5a4a574ff8a8d2aee04cbd1aa`);
        let data = await response.text();

        let jsonData = JSON.parse(data);
        if (jsonData.token) {
            tokens.push(jsonData.token);
            console.log("Token:", jsonData.token);
            getToken();
        }
    } catch (error) {
        console.error("Lỗi", error);
    }
};
getToken();

        window.tokens = tokens;
        let Bots = [], botsDist = 85;
        const wallForm = {};
        let multipler = 80;
        for (let i = 1; i < 50; i++) {
            const upOrDown = !Boolean(i % 2)
            const operator = upOrDown ? "+" : "-"
            let distMultipler = multipler
            wallForm[i] = {
                angle: function(x, y) {
                    return eval(`Math.atan2(window.myY - (y ${operator} ${distMultipler}), window.myX - x)`)
                },
                dist: function(x, y) {
                    return eval(`Math.hypot(y - window.myY ${operator} ${distMultipler}, x - window.myX) >= 30`)
                }
            }
            !Boolean(i % 2) ? multipler += 60 : null
        }
        const dickForm = {
            1: {
                angle: function(x, y) {
                    return Math.atan2(window.myY - (y + 80), window.myX - x)
                },
                dist: function(x, y) {
                    return Math.hypot(y - window.myY + 80, x - window.myX) >= 30
                }
            },
            2: {
                angle: function(x, y) {
                    return Math.atan2(window.myY - (y - 60), window.myX - (x - 60))
                },
                dist: function(x, y) {
                    return Math.hypot(y - window.myY - 60, x - window.myX - 60) >= 30
                }
            },
            3: {
                angle: function(x, y) {
                    return Math.atan2(window.myY - (y - 60), window.myX - (x + 60))
                },
                dist: function(x, y) {
                    return Math.hypot(y - window.myY - 60, x - window.myX + 60) >= 30
                }
            },
            4: {
                angle: function(x, y) {
                    return Math.atan2(window.myY - (y + 150), window.myX - x)
                },
                dist: function(x, y) {
                    return Math.hypot(y - window.myY + 150, x - window.myX) >= 30
                }
            },
        };
        let botNumber = 1;
        const makeBot = (botType, serverUrl, isTest) => {
            const currentBot = Bots.length;
            const whichServer = serverUrl ? serverUrl : null
            Bots.push(new WebSocket(whichServer ? serverUrl : myWS.url));
            const thisBot = Bots[currentBot];

            thisBot.binaryType = 'arraybuffer';

            thisBot.addEventListener('close', (error) => {
                window.test("bot disconnected");
                if (botType == "gold") makeBot("gold", thisBot.url);
                botCount.innerHTML = "Bots: " + Bots.filter(c => c.readyState === 1).length;
                Bots.filter(c => {
                    c.readyState != 1 && Bots.splice(Bots.indexOf(c), 1);
                })
               //if (Bots.filter(c => c.readyState === 1).length == 0) request.send(JSON.stringify(params + (currentGold + oldGold)))
            });

            thisBot.uncap = async (data) => {
                let Token = await fetch("https://token.sploop.io/164633?v=" + 1e5 * Math.random()).then(e => e.text());
                Token = window.encodeToken(Token, 13, 9, 252);
                const serverInfo = window.getServerInfo(data[1], window.myToken);

                thisBot.send(new Uint8Array([packetsID.joinGame, data[1], ...serverInfo, ...Token]));
                thisBot.near = true;
                thisBot.alive = false;
                thisBot.enemys = [];
                thisBot.clownCount = 0;
                thisBot.oldX = 0;
                thisBot.oldY = 0;
                thisBot.stacked = 0;
                thisBot.test = true;

                !botType && (thisBot.numb = botNumber);
                !botType && botNumber++;

                const totalBots = Bots.filter(c => c.readyState === 1).length;
                botCount.innerHTML = `Bots: ${totalBots}`;
                if (totalBots != 1 && !botType) {
                    if (Number.isInteger(totalBots / 4)) {
                        botsDist += 32;
                    }
                }
                window.test("succefully connected")
            };

            thisBot.addEventListener('message', async (msg) => {
                const isString = typeof msg == "string";
                const Data = "string" == typeof msg.data ? JSON.parse(msg.data) : new Uint8Array(msg.data);
                Data[0] == 33 && (thisBot.id = Data[1]);
                let isMyUpdate = undefined;
                if (Data[0] == 20) {
                    for (let e = 1; e < Data.length; e += 19) {
                        if (Data[e + 1] == thisBot.id && Data[e] == 0) {
                            thisBot.info = {
                                health: Data[e + 13] / 255 * 100,
                                teamID: Data[e + 12],
                                x: Data[e + 4] | Data[e + 5] << 8,
                                y: Data[e + 6] | Data[e + 7] << 8,
                                id: Data[e + 1],
                                whichObjectIn: Data[e + 8]
                            };
                            isMyUpdate = true;
                            break;
                        } else if (botType == "zombie" && !Bots.find(c => c.id == Data[e + 1]) && Data[e + 1] != thisBot.id && Data[e + 1] != myPlayer.id && Data[e] == 0 && !thisBot.enemys.find(c => c.id == Data[e + 1])) {
                            thisBot.enemys.push({
                                id: Data[e + 1],
                                health: Data[e + 13] / 255 * 100,
                                x: Data[e + 4] | Data[e + 5] << 8,
                                y: Data[e + 6] | Data[e + 7] << 8,
                            });
                        }
                    }
                };
                if (Data[0] == 35) {
                    thisBot.alive = true;
                }
                if (Data[0] == 19) {
                    thisBot.alive = false;
                }
                if (Data[0] == 3 && botType == "afk") {
                    if (!ebalai && discordWS.readyState == 1) {
                        ebalai = true;
                        let count = 1;
                        let list = '';
                        let listNames = [];
                        Data[1].forEach(player => {
                            const aboba = window.allPlayers.find(e => e.Sc == player[0])
                            listNames.push({name: aboba.fc, gold: aboba.zr})
                        })
                        let tempMsv = [];
                        listNames.forEach(e => tempMsv.push(e.name))
                        const longestNick = tempMsv.reduce((c, v) => c.match(/./gu).length > v.match(/./gu).length ? c : v).match(/./gu).length;
                        for (let i = 1; i < tempMsv.length + 1; i++) {
                            const sus = i - 1;
                            const gold = listNames[sus].gold
                            const nickLength = listNames[sus].name.match(/./gu).length;
                            list += `${i}. ${listNames[sus].name} (${gold})\n`
                            if (!timeOut && gold > 10000) {
                                discordWS.send(JSON.stringify(["rich", listNames[sus].name, gold]))
                                timeOut = true;
                                setTimeout(() => {
                                    timeOut = false;
                                }, 180000)
                            }
                        }
                        const whichServ = thisBot.url.slice(thisBot.url.indexOf('/') + 2, thisBot.url.indexOf('.')).toUpperCase()
                        const suba = whichServ == "FRA1FFA" ? "Frank" : whichServ == "CA1FFA" ? "USA" : whichServ == "SGP1FFA" ? "AS" : null;
                        discordWS.send(JSON.stringify([suba, list]))
                        window.lel = discordWS
                        setTimeout(() => {
                            ebalai = false;
                        }, 9000)
                    }
                }
                Data[0] == 25 && thisBot.uncap(Data);
                if (!thisBot.alive || !thisBot.alive && botType == "dick") {
                    if (botType == "afk") {
                        thisBot.send(JSON.stringify([10, "", '0', "FFFFFEEEEGGBBBAAA", '0', '0']))
                    } else if (botType == "gold") {
                        thisBot.send(JSON.stringify([10, "nyanner's hot dog", localStorage.getItem('skin'), "FFFFFEEEEGGBBBAAA", localStorage.getItem('accessory'), localStorage.getItem('accMail'), localStorage.accToken, '0']))
                    } else if (botType == "zombie") {
                        thisBot.send(JSON.stringify([10, "Zombie", "5", "FFFFFEEEEGGBBBAAA", localStorage.getItem('accessory'), '0']))
                    } else if (botType != "dick") {
                        thisBot.send(JSON.stringify([10, localStorage.getItem('nickname'), String(Math.floor(Math.random() * 6)), "FFFFFEEEEGGBBBAAA", localStorage.getItem('accessory'), "NYANS_GG_COM" + botNumber, tokens[botNumber], '0']));
                    }
                };
                if (!thisBot.info || botType == "afk") return;
                window.currentUpgrade.forEach(id => {
                    thisBot.info && thisBot.send(new Uint8Array([packetsID.upgrade, id]));
                });
                const mouseAngle2 = Math.atan2(cursorAtMap.y - thisBot.info.y, cursorAtMap.x - thisBot.info.x);
                const transformedAngle = 65535 * (mouseAngle2 + Math.PI) / (2 * Math.PI);
                thisBot.info.transformedAngle = transformedAngle;
                if (thisBot.info) {
                    if (thisBot.info.health < 100 && thisBot.clownCount < 2) {
                        thisBot.send(new Uint8Array([packetsID.item, 2]));
                        thisBot.send(new Uint8Array([packetsID.hit, 255 & thisBot.info.transformedAngle, thisBot.info.transformedAngle >> 8 & 255]));
                        thisBot.send(new Uint8Array([packetsID.stopAttack]));
                        thisBot.send(new Uint8Array([packetsID.item, onHand]));
                        thisBot.clownCount++;
                        return;
                    }
                    setTimeout(() => {
                        if (thisBot.info.health < 100 && thisBot.clownCount >= 2) {
                            thisBot.send(new Uint8Array([packetsID.item, 2]));
                            thisBot.send(new Uint8Array([packetsID.hit, 255 & thisBot.info.transformedAngle, thisBot.info.transformedAngle >> 8 & 255]));
                            thisBot.send(new Uint8Array([packetsID.stopAttack]));
                            thisBot.send(new Uint8Array([packetsID.item, onHand]));
                            thisBot.clownCount -= 2;
                            return;
                        }
                    }, 70)
                }
                if (thisBot.info) thisBot.info.teamID == 0 && thisBot.send(new Uint8Array([packetsID.joinClan, myPlayer.teamID]));
                if (botType == "zombie" && thisBot.alive && Data[0] == 20) {
                    thisBot.send(new Uint8Array([packetsID.chat, ...encoder.encode("Brainsss...")]));
                    [1, 12, 9, 19, 20, 15, 8, 17, 16].forEach(item => thisBot.send(new Uint8Array([packetsID.upgrade, item])));
                    if (thisBot.enemys) {
                        thisBot.nearEnemy = thisBot.enemys.sort((a, b) => Math.hypot(a.y - thisBot.info.y, a.x - thisBot.info.x) - Math.hypot(b.y - thisBot.info.y, b.x - thisBot.info.x))[0];
                        if (thisBot.nearEnemy) {
                            if (thisBot.nearEnemy.id != myPlayer.id) {
                                const angleToEnemy = Math.atan2(thisBot.nearEnemy.y - thisBot.info.y, thisBot.nearEnemy.x - thisBot.info.x);
                                const transformedAngle = 65535 * (angleToEnemy + Math.PI) / (2 * Math.PI);
                                thisBot.send(new Uint8Array([packetsID.move, 255 & transformedAngle, transformedAngle >> 8 & 255]));
                                thisBot.send(new Uint8Array([packetsID.hit, 255 & transformedAngle, transformedAngle >> 8 & 255]));
                                thisBot.nearEnemy = undefined;
                                thisBot.enemys = [];
                            }
                        } else if (Data[0] == 20) {
                            thisBot.send(new Uint8Array([packetsID.stopAttack]));
                            thisBot.send(new Uint8Array([packetsID.stopMove]));
                        }
                    }
                    return;
                }
                if (botType == "gold" && isMyUpdate && thisBot.alive && thisBot.info) {
                    [13, 12, 9, 19, 18, 15, 8, 16].forEach(item => thisBot.send(new Uint8Array([packetsID.upgrade, item])));
                    const crnServerURL = thisBot.url.slice(myWS.url.indexOf('/') + 2, thisBot.url.indexOf('.')).toUpperCase()
                    const server = servers[crnServerURL] == "EU#1 Frankfurt" ? goldPos.EU : servers[crnServerURL] == "USA#1 California" ? goldPos.USA : goldPos.AS;
                    const nearGold = Object.values(server).sort((a, b) => Math.hypot(a.y - thisBot.info.y, a.x - thisBot.info.x) - Math.hypot(b.y - thisBot.info.y, b.x - thisBot.info.x))[0];
                    const distation = Math.hypot(thisBot.info.x - nearGold.x, thisBot.info.y - nearGold.y);
                    let angle = Math.atan2(nearGold.y - thisBot.info.y, nearGold.x - thisBot.info.x);

                    angle = 65535 * (angle + Math.PI) / (2 * Math.PI);
                    thisBot.send(new Uint8Array([packetsID.hit, 255 & angle, angle >> 8 & 255]));
                    if (distation > 120) {
                        thisBot.send(new Uint8Array([packetsID.move, 255 & angle, angle >> 8 & 255]));
                    } else {
                        thisBot.send(new Uint8Array([packetsID.stopMove]));
                        const angle = toRad(toDegree(Math.atan2(nearGold.y - thisBot.info.y, nearGold.x - thisBot.info.x)) - 180)
                        const transformedAngle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
                        const angle2 = toRad(toDegree(Math.atan2(nearGold.y - thisBot.info.y, nearGold.x - thisBot.info.x)) - 90)
                        const transformedAngle3 = 65535 * (angle2 + Math.PI) / (2 * Math.PI);
                        const angle3 = toRad(toDegree(Math.atan2(nearGold.y - thisBot.info.y, nearGold.x - thisBot.info.x)) + 90)
                        const transformedAngle4 = 65535 * (angle3 + Math.PI) / (2 * Math.PI);
                        thisBot.send(new Uint8Array([packetsID.item, 4]));
                        thisBot.send(new Uint8Array([packetsID.hit, 255 & transformedAngle2, transformedAngle2 >> 8 & 255]));
                        thisBot.send(new Uint8Array([packetsID.stopAttack]));
                        thisBot.send(new Uint8Array([packetsID.item, onHand]));
                        setTimeout(() => {
                            if (Math.hypot(thisBot.info.x - nearGold.x, thisBot.info.y - nearGold.y) > 120) {
                                thisBot.send(new Uint8Array([packetsID.item, 4]));
                                thisBot.send(new Uint8Array([packetsID.hit, 255 & transformedAngle3, transformedAngle3 >> 8 & 255]));
                                thisBot.send(new Uint8Array([packetsID.stopAttack]));
                                thisBot.send(new Uint8Array([packetsID.item, onHand]));
                            }
                            setTimeout(() => {
                                if (Math.hypot(thisBot.info.x - nearGold.x, thisBot.info.y - nearGold.y) > 120) {
                                    thisBot.send(new Uint8Array([packetsID.item, 4]));
                                    thisBot.send(new Uint8Array([packetsID.hit, 255 & transformedAngle4, transformedAngle4 >> 8 & 255]));
                                    thisBot.send(new Uint8Array([packetsID.stopAttack]));
                                    thisBot.send(new Uint8Array([packetsID.item, onHand]));
                                }
                            }, 300)
                        }, 300)
                    }
                    return;
                };
                thisBot.info && thisBot.send(new Uint8Array([packetsID.angle, 255 & thisBot.info.transformedAngle, thisBot.info.transformedAngle >> 8 & 255]));
                //thisBot.send(new Uint8Array([packetsID.move, 255 & thisBot.info.transformedAngle, thisBot.info.transformedAngle >> 8 & 255]))
                const dist1 = Math.hypot(thisBot.info.y - window.myY, thisBot.info.x - window.myX)
                if (dist1 >= 600) {
                    const angle = toRad(toDegree(Math.atan2(window.myY - thisBot.info.y, window.myX - thisBot.info.x)) - 180)
                    const transformedAngle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
                    thisBot.send(new Uint8Array([packetsID.item, 5]));
                    thisBot.send(new Uint8Array([packetsID.hit, 255 & transformedAngle2, transformedAngle2 >> 8 & 255]));
                    thisBot.send(new Uint8Array([packetsID.stopAttack]));
                    thisBot.send(new Uint8Array([packetsID.item, onHand]));
                }
                if (botType == "zombie" || botType == "gold") return;
                if (getBind("botFollow") == "KeyBoard" && dist1 >= botsDist) {
                    const angleToMe = Math.atan2(window.myY - thisBot.info.y, window.myX - thisBot.info.x);
                    const transformedAngle2 = 65535 * (angleToMe + Math.PI) / (2 * Math.PI);
                    if (!moving || dist1 >= 500) thisBot.send(new Uint8Array([packetsID.move, 255 & transformedAngle2, transformedAngle2 >> 8 & 255]));
                    thisBot.near = true;
                } else if (getBind("botFollow") == "KeyBoard") {
                    if (!moving && thisBot.near) thisBot.send(new Uint8Array([15]));
                    thisBot.near = false;
                };
                if (getBind("botFollow") == "Mouse") {
                    thisBot.send(new Uint8Array([packetsID.move, 255 & transformedAngle, transformedAngle >> 8 & 255]));
                }
                if (getBind("botFollow") == "Wall" && thisBot.info) {
                    const angle = wallForm[thisBot.numb].angle(thisBot.info.x, thisBot.info.y);
                    const dist = wallForm[thisBot.numb].dist(thisBot.info.x, thisBot.info.y);
                    if (dist) {
                        const transformedAngle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
                        if (!moving || dist1 >= 300) thisBot.send(new Uint8Array([packetsID.move, 255 & transformedAngle2, transformedAngle2 >> 8 & 255]));
                        thisBot.near = true;
                    } else if (getBind("botFollow") == "Wall") {
                        if (!moving && thisBot.near) thisBot.send(new Uint8Array([15]));
                        thisBot.near = false;
                    }
                }
                if (getBind("botFollow") == "DICK?? (4)") {
                    const angle = dickForm[thisBot.numb].angle(thisBot.info.x, thisBot.info.y);
                    const dist = dickForm[thisBot.numb].dist(thisBot.info.x, thisBot.info.y);
                    if (dist) {
                        const transformedAngle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
                        if (!moving || dist1 >= 300) thisBot.send(new Uint8Array([packetsID.move, 255 & transformedAngle2, transformedAngle2 >> 8 & 255]));
                        thisBot.near = true;
                    } else if (getBind("botFollow") == "DICK?? (4)") {
                        if (!moving && thisBot.near) thisBot.send(new Uint8Array([15]));
                        thisBot.near = false;
                    }
                }
            });
            setTimeout(() => {
                thisBot.send(JSON.stringify([10, localStorage.getItem('nickname'), String(Math.floor(Math.random() * 6)), "FFFFFEEEEGGBBBAAA", localStorage.getItem('accessory'), "NYANS_GG_COM" + botNumber, tokens[botNumber], '0']));
            }, 1000)
        };
        window.Bots = Bots;
        window.makeBot = makeBot;
        let hue = 0;
        let defaultHPColor = "#a4cc4f";
        setInterval(() => {
            if (binds.rainbowHealth) {
                window.myHPColor = `hsl(${hue}, 80%, 50%)`;
                hue += 0.2;
                hue >= 360 && (hue = 0);
            } else {
                window.myHPColor = defaultHPColor;
            }
        }, 20)
        const modules_Regex = Regex;
        let Sploop;
        let fontSize = 30;
        window.enemys = [];
        const applyHooks = code => {
            const Hook = new modules_Regex(code, true);
            window.COPY_CODE = (Hook.COPY_CODE.match(/^\((.+)\)\(.+\);$/) || [])[1];
            Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, `EXTERNAL.__proto__.toString=()=>COPY_CODE;`);
            Hook.replace("strict", /{QUOTE}use strict{QUOTE};/, "");
            Hook.replace('r_a', /(\(\)\.\w{2}\()([a-z]\(\d{3}\))(\,\d{2})/, `$1""$3`);
            const myData = Hook.match('myPlayer', /=(\w.get\(\w{2}\));\w&&\w\(\)/)[1];
            const X = Hook.match('playerX', /\{this\.(\w{2})=\w\|\|0/)[1];
            const Y = Hook.match('playerY', /,this\.(\w{2})=\w\|\|0\}/)[1];
            const ID = Hook.match('ID', /&&\w{2}===\w\.(\w{2})\){/)[1];
            const ID2 = Hook.match('ID2', /-1!==\w+\.(\w+)&&/)[1];
            const currentWeapon = Hook.match("crntWeapon", /,\w.(\w{2})===/)[1];
            const angle = Hook.match("angle", /;\w.(\w{2})=\w\(\)/)[1];
            const weaponName = Hook.match("wpnName", /(\w{2}):"XX/)[1];
            const health = Hook.match("health", /(\w{2})<<8;/)[1];
            const weaponDamage = Hook.match("wpnDamage", /(\w{2}):32,reload:300/)[1];
            const teamID = Hook.match('test', /,\w=\w.(\w{2})\|.+?\<\<8/)[1];
            const radius = Hook.match("radius", /(\w{2}):220/)[1];
            const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
            const inWhichObject = Hook.match("iwo", /110\).+?,1===\w.(\w{2})&&!\w{2}/)[1];
            const weaponID = Hook.match('el', /(\w{2}):0,\w{2}:22,reload:150/)[1];
            console.debug(weaponName, weaponDamage, weaponID)
            Sploop = {
                myPlayer: {
                    myData: myData,
                    x: `${myData}.${X}`,
                    y: `${myData}.${Y}`,
                    id: `${myData}.${ID}`,
                    teamID: `${myData}.${teamID}`,
                    angle: `${myData}.${angle}`
                },
                x: X,
                y: Y,
                id: ID,
                id2: ID2,
                hat: hat,
                type: 'type',
                angle: angle,
                health: health,
                radius: radius,
                teamID: teamID,
                weaponID: weaponID,
                weaponName: weaponName,
                weaponDamage: weaponDamage,
                currentWeapon: currentWeapon,
                inWhichObject: inWhichObject
            }
            let clanFunc = Hook.match('gg', /\d{3}\)\)\}function (\w{2})\((\w),(\w),(\w),(\w)\)|\s\)\}function (\w{2})\((\w),(\w),(\w),(\w)\)|"\)\}function (\w{2})\((\w),(\w),(\w),(\w)\)/)
            clanFunc = clanFunc.filter(Boolean)
            let getclanregex = new RegExp(`function ${clanFunc[1]}\\(${clanFunc[2]},${clanFunc[3]},${clanFunc[4]},${clanFunc[5]}\\)\\{`)
            Hook.append('clanTeammates', getclanregex, `
            if (document.getElementById("homepage").style.display != "flex") {
                 window.test(${clanFunc[2]});
                 // if(e === false || i === false) window.deleteClan();
                 if (${clanFunc[2]} && ${clanFunc[4]} || ${clanFunc[2]} == ${Sploop.myPlayer.id}) window.removeTeammate(${clanFunc[5]});
              }
            `)
            const SomeShit = Hook.match("MurkaLoveWhenDick", /,(\w):6,/)[1];
            const SomeShit2 = Hook.match("FiendLoveHardCum", /10,(\w{2}):11,|10,(\w):11,/)[1];
            const regex = new RegExp(`(\\w=\\w\\[\\w\\(\\)\\.${SomeShit}],\\w=\\w\\[\\w\\(\\d{3}\\)\\])|(\\w=\\w\\[\\w\\(\\)\\.${SomeShit}],\\w=\\w\\.length)`);
            const regex2 = new RegExp(`(\\w{2}\\(\\w\\[\\w\\]\\,\\w\\(\\)\\.\\w\\,\\w\\,\\w\\)\\;)(\\D{8}${SomeShit2}.{14})`);
            const trapDatas = Hook.match('test', /\w{2}\(((\w)\[(\w)\])\,\w\(\)\./)
            const itemBar = Hook.match("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/)[3];
            const serverList = Hook.match("allPlayers", /\w",\w{2}:\w\?(\w{2}\.\w{2})\[/)[1];
            const weaponList = Hook.match("weaponList", /\?Math\.PI\/2.+?(\w\(\))/)[1];
            window.itemBar = itemBar;
            Hook.replace("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/, `$1window.stats=$2;window.weapons = ${weaponList};window.sprites = tt();window.allPlayers = ${serverList};function`);
            let getAutoAttack = Hook.match("autoAttack", /Date\.now.{2},\w{2}=!1\,(\w{2})|Date\[\w\(\d{3}\)\].{2},\w{2}=!1\,(\w{2})/);
            getAutoAttack = getAutoAttack.filter(Boolean)[1];
            const findAutoAttack = new RegExp(`${getAutoAttack}=(\\w)`)
            const aboba = Hook.match("a", /\w{2}=\w\(3970.+?],(\w)=\w./)[1];
            Hook.append("qwes", /t\(570\)\+o;/, `console.debug(r, bt);`);
            Hook.append("wbty", /w-form-urlencoded"\),/, `console.debug(o);`)
            Hook.append("awbr", /519\)\]\.visibility="visible"\);/, `console.debug(t);`)
            Hook.append('autoAttack', findAutoAttack, `;window.autoAttack = $1`)
            Hook.replace("renderItems", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, `$1window.drawMarkers(...arguments)$2`);
            Hook.append('AutoBreak', regex, `;window.autoBreak(${trapDatas[1]}, ${trapDatas[2]})`)
            Hook.replace('AntiTrap', regex2, `{$1window.antiTrap(${trapDatas[1]});}$2`)
            //
            //Hook.append("HEHE", /f\+=n.Zh.Xh,/, `console.debug(n),`);
            Hook.append('replace', /(\w)\)return;\w\.delete\(\w\);/, `window.replace($2);`)
            Hook.append('showFullMats', /10},\w{2}\Dfunction\((\w)\){/, `return $2;`)
            Hook.replace('showFullGold', /(\w)\>\d{7}.*?\+""/, `$1`)
            //
            Hook.replace('customLoader', /Loading Sploop.io/, `Loading Kinda Mod...`)
            Hook.replace('customItemObvodka', /23,"#fff"/, `23,"#fff","#303030"`)
            Hook.replace('customItemObvodka', /eec39d"/, `eec39d", "#303030"`)
            Hook.replace('customItemInfo', /4f403c/, '4f403c80')
            Hook.replace('customBar', /F2C39F/, `FFF`)
            Hook.replace('customBar', /10,"#5D3A37"|10,\w\(\d{3}\)/, `10,"#00000080"`)
            Hook.replace('customHP', /(,\.18.+?\:).+?\)}/, `$1window.myHPColor)}`)
            Hook.replace('customHP', /(\.5;.+?\?).+?",/, `$1window.myHPColor : "#ff8000",`)
            Hook.append("showHoods", /\w+\.\w+!==\w+\)/, `|| true`);
            Hook.append('attackReload', /\+=NUMBER{5}.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?;/, `window.attackAnimation($2, $3, $4, $5, $6);`)
            Hook.replace("zoom", /(\w+):NUMBER{1824},(\w+):NUMBER{1026}/, `get $1(){return window.zoomW},get $2(){return window.zoomH}`);
            //Hook.append("checkChat", /Color.+?8,(\w).+?-3\)\),(\w).+?;/, `window.checkMsg($2, $3);`)
            /*
            Hook.replace('fpsSmooth', /Mi\(vo,o\)/, `Mi(vo,o / 3)`)
            Hook.replace("fpsSmooth", /ai\(o\)\),/, `ai(o / 3)),`)
            Hook.replace("fpsSmooth", /e\.Vh,o\),/, `e.Vh, o / 3),`)
            */
           // Hook.append("chat", /,o=t\.code;/, `if (document.getElementById("songChanger").style.display!="none")return;`)
            Hook.append("blockMouse", /\/\w{2}}function \w{2}\((\w)\)\{/, "if($2.which==3)return;")
            Hook.replace('customClan', /"\["/, `"✞ "`);
            Hook.replace('customClan', /"\]"/, `" ✞"`);
            Hook.replaceAll("font", /"px Baloo Paaji/, `"px Monserrat`);
            Hook.replace('grid', /1,(\w{2})=!0/, `1, $1=false`)
            Hook.replace('millMarker', /=false,(\w{2})=!0/, `=false,$1=false`)
            Hook.replace('enablePing', /42.5\),(\w{2})=!1/, `42.5),$1=true`)
            Hook.replace('customClan', /"#96C949","#404040"|"#96C949","#404040"|"#96C949",\w\(\d{3}\)/, `""`);
            Hook.replace('showIDs', /((\w).\w{2};const \w=\w.\w{2}\|\|\(\w.\w{2}=\w\(\).\w{2}\()(\w).(\w{2})/, `$1 "{" + $2.${Sploop.id} + "} " + $3.$4 `);
            const botThing = Hook.match('get', /const \w=(\w{2}\(\))\(/)[1];
            const botThing1 = Hook.match('get', /window\[\(0,(\w{2}\.\w{2})\)/)[1];
            const botThing2 = Hook.match('get', /\)\);(\w)\(\w\[0/)[1];
            const botThing3 = Hook.match('get', /(\w\[11\])\(\w,13,9,252\)\);/)[1];
            Hook.append('bots', /\].\w\)\}\}function \w{2}\(\)\{/, `window.getServerInfo = ${botThing};window.myToken = window[(0, ${botThing1})("getMemTo")]();window.anotherShit = ${botThing2};window.encodeToken = ${botThing3};`)
            Hook.append('upgradeDetector', /\],\w{2}\(new Uint8Array\(\[\w{2}\(\).\w{2}\.\w{2},(\w)]\)\),/, `window.currentUpgrade.push($2),`);
            let args = Hook.match("drawEntityInfo", /-NUMBER{50},.+?function \w+\((ARGS{3})\)\{/)[1];
            Hook.append('drawEntityInfo', /width,\w\*\w.height\)|width,\w\*\w\[\w\(\d{3}\)\]\)/, `;try {window.getEntityData(${args});} catch(err) {}`)
            return Hook.code;
        }
        const shittyUI = ["game-bottom-content", "landscape", "game-right-content-main", "game-left-content-main", "google_play", "cross-promo", "bottom-wrap", "discord", "left-content", "top-wrap-left"];
        const removeTrash = () => shittyUI.forEach(element => document.getElementById(element).remove());
        window.eval = new Proxy(window.eval, {
            apply(target, _this, args) {
                const code = args[0];
                if (code.length > 1e5) {
                    args[0] = applyHooks(code);
                    window.eval = target;
                    document.title = "KindaMod";
                    document.body.append(HUD);
                    document.body.appendChild(displayElement1);
                    document.body.appendChild(displayElement);
                    HUD.append(playersCount, cords, pingCount, cpsCount, botCount);
                    const Comfortaa = document.createElement('style');
                    Comfortaa.innerHTML = `@import "https://fonts.googleapis.com/css2?family=Comfortaa&display=swap";`;
                    document.head.appendChild(Comfortaa);
                    target.apply(_this, args);
                    return;
                }
                return target.apply(_this, args);
            }
        });
        const doc = (element) => document.getElementById(element)
        window.addEventListener('DOMContentLoaded', function loader (event) {
            window.test('DOM loaded');
            try {
                addStyles();
                localStorage.setItem("keybinds", JSON.stringify({"0":"KeyW","1":"KeyS","2":"KeyD","3":"KeyA","4":"KeyF","5":"KeyQ","6":"Space","7":"KeyR","8":"KeyR","9":"KeyX","10":"KeyE","11":"ArrowUp","12":"ArrowRight","13":"ArrowDown","14":"ArrowLeft","15":"Escape","16":"Enter","17":"KeyL","18":"none"}));
                removeTrash();
                doc("game-middle-main").style = `
                left: 5%;
                transform: scale(0.8);
                background: rgb(150 67 196 / 20%);
                border-radius: 0px;
                box-shadow: rgb(111 65 140) 5px 5px 20px 2px;
                border-color: rgb(173 84 196 / 20%);
                bottom: 5vh;
                `
                doc("nav").style = `
                scale: 0.8;
                left: -25%;
                position: inherit;
                `;
                doc("chat").style = `
                outline: none;
                background-color: rgb(159 95 196 / 50%);
                border: 4px solid rgb(121 60 156 / 50%);
                padding: 10px;
                width: 250px;
                color: white;
                font-weight: bold;
                text-shadow: none;
                box-shadow: none;
                `;
                doc("main-content").style.background = "none";
                doc("logo").src = "https://media.discordapp.net/attachments/907337754814316565/1059471987526860882/Kinda.png";
                doc("logo").style = `
                left: -25%;
                position: inherit;
                `;
                removeEventListener("DOMContentLoaded", loader);
                const wallpaper = document.createElement("img");
                wallpaper.src = "https://media.discordapp.net/attachments/907337754814316565/1025108123914092654/illustration-anime-anime-girls-thigh-highs-screenshot-figurine-30624-wallhere.com.jpg";
                wallpaper.style = `
                position: fixed;background-size: cover;background-repeat: no-repeat;overflow: hidden;z-index: 0; user-select: none; left: 0; top: 0;height: 135%;width: 135%;min-height: 1050px;min-width: 1400px;
               `;
                doc("homepage").insertAdjacentElement("afterBegin", wallpaper)
            } catch(err) {}
        });
        const addStyles = () => {
            const styleItem = document.createElement("style");
            styleItem.type = "text/css";

            styleItem.appendChild(document.createTextNode(`

.menus {
  display: block;
  position: relative;
  height: 0px;
}
.menu-title {
  display: block;
  width: 100px;
  height: 35px;
  padding: 8px 0 0;
  background: #3c3c3c;
  text-align: center;
  color: #ffffff;
  font-weight: 100;
  font-size: 15px;
  transition: 0.3s background-color;
}

.menu-title:before {
  content: "";
  display: block;
  height: 0;
  border-top: 5px solid #9dc852;
  border-bottom: 0 solid #dddddd;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 101;
  transition:
    0.2s 0.2s border-top ease-out,
    0.3s border-top-color;
}

.menu-title:hover:before { border-top-color: #8db842; }

.menus:hover > .menu-title:before {
  border-top-width: 0;
  transition:
    0.2s border-top-width ease-in,
    0.3s border-top-color;
}

.menu-title:after {
  content: "";
  display: block;
  height: 0;
  border-bottom: 0 solid #ebebeb;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 101;
  transition: 0.2s border-bottom ease-in;
}

.menus:hover > .menu-title:after {
  border-bottom-width: 5px;
  transition: 0.2s 0.2s border-bottom-width ease-out;
}

.menu-dropdown {
  min-width: 100px;
  position: absolute;
  background: #3c3c3c;
  z-index: 100;
  transition:
    0.5s padding,
    0.5s background;
}

.menu-dropdown:after {
  content: "";
  display: block;
  height: 0;
  border-top: 5px solid #ebebeb;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 101;
  transition: 0.5s border-top;
}

.menus:not(:hover) > .menu-dropdown:after {
  border-top-color: #dddddd;
}

.menus:not(:hover) > .menu-title:after {
  border-bottom-color: #dddddd;
}

.menu-dropdown > * {
  overflow: hidden;
  height: 30px;
  font-size: 11px;
  padding: 8px 10px;
  background: rgba(0,0,0,0);
  white-space: nowrap;
  transition:
    0.5s height cubic-bezier(.100,.100,.100,1.5),
    0.5s padding cubic-bezier(.100,.100,.100,1.5),
    0.5s margin cubic-bezier(.100,.100,.100,1.5),
    0.5s 0.2s color,
    0.2s background-color;
}

.menu-dropdown > *:hover {
  background: rgba(0,0,0,0.1);
}

.menus:not(:hover) > .menu-dropdown > * {
  visibility: hidden;
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin: 0;
  color: rgba(25,25,25,0);
  transition:
    0.5s 0.1s height,
    0.5s 0.1s padding,
    0.5s 0.1s margin,
    0.3s color,
    0.6s visibility;
  z-index: 99;
}

.hList {
    position: relative;
    bottom: 25px;
    left: 90px;
    width: 80px;
}

.hList > * {
  float: left;
}

.hList > * + * {
  margin-left: 0;
}

.pop-box {
  box-shadow: none;
}
#play:hover {
    transition: all 0.5s ease;
    background: #7844af;
    box-shadow: inset 0 -9px 0 rgb(103 48 133 / 70%);
}
#play {
    transition: all 0.5s ease;
background: #5f328f;
    box-shadow: inset 0 -9px 0 rgb(78 32 103 / 70%);
    border-radius: 7px;
}
#play:active {
    transition: all 0.5s ease;
    background: #814fb6;
    box-shadow: inset 0 -9px 0 rgb(101 47 130 / 70%);
}
.dark-blue-button {
    transition: all 0.5s ease;
background: #5f328f;
    box-shadow: inset 0 -9px 0 rgb(78 32 103 / 70%);
}
.dark-blue-button-3-active {
    transition: all 0.5s ease;
    background: #814fb6;
    box-shadow: inset 0 -9px 0 rgb(101 47 130 / 70%);
}
.dark-blue-button:hover {
    transition: all 0.5s ease;
    background: #7844af;
    box-shadow: inset 0 -9px 0 rgb(103 48 133 / 70%);
}
.dark-blue-button-3-active:active {
    transition: all 0.5s ease;
    background: #814fb6;
    box-shadow: inset 0 -9px 0 rgb(101 47 130 / 70%);
}
.game-mode {
    transition: all 0.5s ease;
    border-radius: 7px;
}
#nickname {
    transition: all 0.5s ease;
    border-radius: 5px;
}
#server-select {
    transition: all 0.5s ease;
    border-radius: 5px;
background: #5f328f;
    box-shadow: inset 0 -9px 0 rgb(78 32 103 / 70%);
}
#server-select:hover {
    transition: all 0.5s ease;
    background: #7844af;
    box-shadow: inset 0 -9px 0 rgb(103 48 133 / 70%);
}
#server-select:active {
    transition: all 0.5s ease;
    background: #814fb6;
    box-shadow: inset 0 -9px 0 rgb(101 47 130 / 70%);
}
.pop-close:hover {
    filter: brightness(1.1);
    transition: all 0.5s ease;
}
.pop-close {
    transition: all 0.5s ease;
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
}
.scrollbar::-webkit-scrollbar-thumb {
    transition: all 0.5s ease;
    background: #ffffff;
    border-radius: 0px;
    border: 4px solid #141414;
    box-shadow: none;
}
.scrollbar::-webkit-scrollbar {
    transition: all 0.5s ease;
    border-radius: 0px;
    border: 4px solid #141414
}
.background-img-play {
    background: none;
}
.side-button:hover {
    transition: all 0.5s ease;
    background: #000000;
}
.green-button {
    transition: all 0.5s ease;
    background-color: rgb(172 102 212 / 40%);
    box-shadow: inset 0 -5px 0 rgb(68 20 118 / 40%);
}
.green-button:hover {
    transition: all 0.5s ease;
    background-color: rgb(175 104 216 / 80%);
    box-shadow: inset 0 -5px 0 rgb(113 57 171 / 40%);
}
.green-button:active {
    transition: all 0.5s ease;
background-color: rgb(130 72 163 / 80%);
    box-shadow: inset 0 -5px 0 rgb(69 30 110 / 40%);
}
   .selector {
    color: white;
    display: block;
    height: 20px;
    transition: all 0.5s ease;
  }
  .selector:hover {
    background: rgb(0 0 0 / 80%);
    color: hsl(269deg 48% 65%);
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
    transition: all 0.5s ease;
    transform: scale(1.1);
    letter-spacing: 0.8px;
  }
  .btn {
    color: #ffffff;
    border-radius: 5px;
    font-weight: 100;
    width: 100px;
    background: rgb(78 78 78 / 0%);
    padding: 5px;
    font-size: 15px;
    outline: none;
    border: 2px solid #643597;
    overflow: hidden;
    height: 35px;
    transition: all 0.5s ease 0s;
  }
  .btn:hover {
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
    transform: scale(1.1);
    box-shadow: 0 0 20px 1px #643597
  }
  .btn2:hover {
    cursor: pointer;
  }
  .text {
    color: #643597;
    font-weight: 500;
    font-size: 22px;
    padding-left: 5px;
    vertical-align: middle;
  }
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(255,255,255, 0.5);
    box-shadow: 0 0 0 0 rgba(255,255,255, 0.4);
  }
  70% {
      -moz-box-shadow: 0 0 0 50px rgba(255,255,255, 0);
      box-shadow: 0 0 0 50px rgba(255,255,255, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(255,255,255, 0);
      box-shadow: 0 0 0 0 rgba(255,255,255, 0);
  }
}
@keyframes btnPulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(100, 53, 151, 1);
    box-shadow: 0 0 0 0 rgba(100, 53, 151, 1);
  }
  70% {
      -moz-box-shadow: 0 0 0 50px rgba(100, 53, 151, 0.5);
      box-shadow: 0 0 0 50px rgba(100, 53, 151, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(100, 53, 151, 0);
      box-shadow: 0 0 0 0 rgba(100, 53, 151, 0);
  }
}
  .custom-checkbox {
    z-index: 1;
    opacity: 0;
    position: absolute;
    width: 18px;
    height: 20px;
  }
.custom-checkbox+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
    justify-content: center;
    position: absolute;
}
select:hover {
    cursor: pointer;
}
.custom-checkbox+label::before {
  content: '';
  transition: all 0.3s ease;
  display: inline-block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #643597;
  border-radius: 0px;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}
.custom-checkbox:checked+label::before {
  border-color: #643597;
  background-color: #643597;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
}
.custom-checkbox:not(:disabled):not(:checked)+label:hover::before {
  border-color: #643597;
}

.custom-checkbox:not(:disabled):active+label::before {
  background-color: #643597;
  border-color: #643597;
}

.custom-checkbox:focus:not(:checked)+label::before {
  border-color: #643597;
}

.custom-checkbox:disabled+label::before {
  background-color: #643597;
}
`));
            document.head.appendChild(styleItem);
            const menu = document.createElement("div");
            menu.id = "KindaMenu";
            menu.innerHTML = `
<div style="left: 0px; filter: drop-shadow(black 2px 4px 6px); transition: all 0.5s ease 0s; background: rgb(0, 0, 0); overflow: hidden; position: absolute; width: 300px; height: 100%; z-index: 100;">
<img src="https://i.pinimg.com/750x/05/b4/a2/05b4a279ed98ba1e3e9eb585968c0410.jpg" style="
    position: absolute;
    width: 145%;
    bottom: 0;
    left: -20px;
    height: 100%;
    -webkit-user-drag: none;
    opacity: 0.25;
    pointer-events: none;
">
<b4 style="
    right: 8px;
    position: relative;
    font-size: 25px;
    text-align: center;
    display: block;
    top: 5px;
    font-weight: bold;
    text-decoration: underline;
    color: #643597;
">✎ Kinda<b4 style="
    color: #fff;
    text-decoration: underline;
    font-weight: bold;
">Settings</b4></b4>
<div id="selectors" style="
    position: absolute;
    width: 230px;
    height: 80px;
    top: 50px;
    left: 15px;
    left: 9%;
    text-align: center;
"><b4 data="hatMacro" class="selector" style="
">Hat Macro</b4><b4 data="place" class="selector" style="
">KeyBinds</b4><b4 data="visual" class="selector" style="
">Visual</b4><b4 data="autos" class="selector" style="
">AutoSettings</b4><b4 data="bots" class="selector" style="
">Multibox</b4><b4 data="other" class="selector" style="
">Other</b4></div>
<div id="tabContent">
<div id="hatMacro" style="display: none; width: 150px; position: absolute; height: 350px; top: 160px; left: 22px;"><div id="binds" style="top: 20px;position: relative;"><b4 style="color: white; left: -10px; top: -10px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Hats...</b4><div style="width: 200px; font-size: 95.1771%;"><button id="bush" class="btn">${getBind("bush")}</button>
<b4 class="text" style="">&amp; Bush</b4></div><div style="width: 200px; padding-top: 2px; font-size: 95.1771%;"><button id="bull" class="btn">${getBind("bull")}</button>
<b4 class="text" style="">&amp; Bull</b4></div>
<div style="width: 220px; padding-top: 2px; font-size: 95.1771%;"><button id="jungle" class="btn">${getBind("jungle")}</button>
<b4 class="text" style="">&amp; Jungle</b4></div><div style="width: 220px; padding-top: 2px; font-size: 95.1771%;"><button id="crystal" class="btn">${getBind("crystal")}</button>
<b4 class="text" style="">&amp; Crystal</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="spikeGear" class="btn">${getBind("spikeGear")}</button>
<b4 class="text" style="">&amp; SpikeGear</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="immunity" class="btn">${getBind("immunity")}</button>
<b4 class="text" style="">&amp; Immunity</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="boostHat" class="btn">${getBind("boostHat")}</button>
<b4 class="text" style="">&amp; BoostHat</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="appleHat" class="btn">${getBind("appleHat")}</button>
<b4 class="text" style="">&amp; AppleHat</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="scuba" class="btn">${getBind("scuba")}</button>
<b4 class="text" style="">&amp; Scuba</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="hood" class="btn">${getBind("hood")}</button>
<b4 class="text" style="">&amp; Hood</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="tank" class="btn">${getBind("tank")}</button>
<b4 class="text" style="">&amp; Tank</b4></div></div></div><div id="place" style="display: none; width: 150px; position: absolute; height: 350px; top: 160px; left: 22px;"><div id="binds" style="top: 20px;position: relative;"><b4 style="color: white; left: -10px; top: -10px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Binds...</b4><div style="width: 210px; font-size: 95.1771%;"><button id="cookie" class="btn">${getBind("cookie")}</button>
<b4 class="text" style="">&amp; Cookie</b4></div><div style="width: 200px; padding-top: 2px; font-size: 95.1771%;"><button id="wall" class="btn">Digit4</button>
<b4 class="text" style="">&amp; Wall</b4></div>
<div style="width: 220px; padding-top: 2px; font-size: 95.1771%;"><button id="spike" class="btn">${getBind("spike")}</button>
<b4 class="text" style="">&amp; Spike</b4></div><div style="width: 220px; padding-top: 2px; font-size: 95.1771%;"><button id="trap" class="btn">${getBind("trap")}</button>
<b4 class="text" style="">&amp; Trap</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="platform" class="btn">${getBind("platform")}</button>
<b4 class="text" style="">&amp; Platform</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="turret" class="btn">${getBind("turret")}</button>
<b4 class="text" style="">&amp; Turret</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="mill" class="btn">${getBind("mill")}</button>
<b4 class="text" style="">&amp; Mill</b4></div><div style="width: 250px; padding-top: 2px; font-size: 95.1771%;"><button id="bed" class="btn">${getBind("bed")}</button>
<b4 class="text" style="">&amp; Bed</b4></div><div style="width: 250px; padding-top: 20px; font-size: 95.1771%;"><input value="${getBind("cpsBuff")}" oninput="window.zaglotus(this)" id="cps" class="btn" style="
    text-align: center;
">
<b4 class="text" style="">&amp; CPS</b4></div></div></div><div id="visual" style="display: none; width: 150px; position: absolute; height: 50px; top: 160px; left: 22px;"><div id="binds" style="top: 20px;position: absolute;font-size: 100%;"><b4 style="color: white; left: -10px; top: -10px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Visuals...</b4><div style="position: relative; left: 40px; font-size: 95.1771%;"><b4 data="drawHP" style="position: relative;font-weight: 100;color: white;right: 5px;">drawHP</b4><input data="drawHP" type="checkbox" class="custom-checkbox"><label id="drawHP"></label></div>

<div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="itemCount" style="position: relative;font-weight: 100;color: white;right: 5px;">draw item count</b4><input data="itemCount" type="checkbox" class="custom-checkbox"><label id="itemCount"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="weaponR" style="position: relative;font-weight: 100;color: white;right: 5px;">draw weapon range</b4><input data="weaponR" type="checkbox" class="custom-checkbox"><label id="weaponR"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="rainbowHealth" style="position: relative;font-weight: 100;color: white;right: 5px;">rainbowHP</b4><input data="rainbowHealth" type="checkbox" class="custom-checkbox"><label id="rainbowHealth"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="fpsBypass" style="position: relative;font-weight: 100;color: white;right: 5px;">FPS bypass</b4><input data="fpsBypass" type="checkbox" class="custom-checkbox"><label id="fpsBypass"></label></div><div style="text-align: end; width: 200px; padding-top: 35px; font-size: 95.1771%;"></div><b4 style="color: white; left: -10px; top: -10px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Markers...</b4><div style="text-align: left; position: relative; left: 45px; font-size: 95.1771%;"><b4 data="enemyMarker" style="position: relative;font-weight: 100;color: white;right: 10px;">enemy</b4><input data="enemyMarker" type="checkbox" class="custom-checkbox"><label id="enemyMarker"></label></div><div style="text-align: left; position: relative; left: 45px; padding-top: 15px; font-size: 95.1771%;"><b4 data="allyMarker" style="position: relative;font-weight: 100;color: white;right: 10px;">ally</b4><input data="allyMarker" type="checkbox" class="custom-checkbox"><label id="allyMarker"></label></div><div style="text-align: left; position: relative; left: 45px; padding-top: 15px; font-size: 95.1771%;"><b4 data="myMarker" style="position: relative;font-weight: 100;color: white;right: 10px;">mine</b4><input data="myMarker" type="checkbox" class="custom-checkbox"><label id="myMarker"></label></div><div style="text-align: left; position: relative; left: 45px; padding-top: 15px; font-size: 95.1771%;"><b4 data="markersOptimaze" style="position: relative;font-weight: 100;color: white;right: 10px;">optimaze markers</b4><input data="markersOptimaze" type="checkbox" class="custom-checkbox"><label id="markersOptimaze"></label></div><b4 style="color: white; left: -10px; top: 15px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Tracers...</b4><div style="text-align: left; position: relative; left: 45px; padding-top: 20px; font-size: 95.1771%;"><b4 data="enemyTracer" style="position: relative;font-weight: 100;color: white;right: 10px;">enemy</b4><input data="enemyTracer" type="checkbox" class="custom-checkbox"><label id="enemyTracer"></label></div><div style="text-align: left; position: relative; left: 45px; padding-top: 10px; font-size: 95.1771%;"><b4 data="animalsTracer" style="position: relative;font-weight: 100;color: white;right: 10px;">ally</b4><input data="animalsTracer" type="checkbox" class="custom-checkbox"><label id="animalsTracer"></label></div><div style="text-align: left; position: relative; left: 45px; padding-top: 10px; font-size: 95.1771%;"><b4 data="enemyMarker" style="position: relative;font-weight: 100;color: white;right: 10px;">teammates</b4><input data="teammatesTracer" type="checkbox" class="custom-checkbox"><label id="teammatesTracer"></label></div></div></div><div id="autos" style="display: block; width: 150px; position: absolute; height: 50px; top: 160px; left: 22px;"><div id="binds" style="top: 20px;position: absolute;font-size: 100%;"><b4 style="color: white; left: -10px; top: -10px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Automatics...</b4><div style="position: relative; left: 40px; font-size: 95.1771%;"><b4 data="autoBreak" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Break</b4><input data="autoBreak" type="checkbox" class="custom-checkbox"><label id="autoBreak"></label></div>

<div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoTrap" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Trap</b4><input data="autoTrap" type="checkbox" class="custom-checkbox"><label id="autoTrap"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoSpike" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Spike</b4><input data="autoSpike" type="checkbox" class="custom-checkbox"><label id="autoSpike"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoReplace" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Replace</b4><input data="autoReplace" type="checkbox" class="custom-checkbox"><label id="autoReplace"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoPush" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Push</b4><input data="autoPush" type="checkbox" class="custom-checkbox"><label id="autoPush"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="antiTrap" style="position: relative;font-weight: 100;color: white;right: 5px;">Anti Trap</b4><input data="antiTrap" type="checkbox" class="custom-checkbox"><label id="antiTrap"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoResp" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Response</b4><input data="autoResp" type="checkbox" class="custom-checkbox"><label id="autoResp"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoUpgrade" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Upgrade</b4><input data="autoUpgrade" type="checkbox" class="custom-checkbox"><label id="autoUpgrade"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoSync" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Sync</b4><input data="autoSync" type="checkbox" class="custom-checkbox"><label id="autoSync"></label></div><div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="autoChat" style="position: relative;font-weight: 100;color: white;right: 5px;">Auto Chat</b4><input data="autoChat" type="checkbox" class="custom-checkbox"><label id="autoChat"></label></div><button data="changeSong" class="btn2" style="position: relative; top: 12px; right: -24px; color: white; background: rgb(60, 60, 60); box-shadow: rgb(46, 46, 46) 0px -5px 0px inset; padding: 8px; border-radius: 5px; border: 2px solid rgb(20, 20, 20); outline: none; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); font-size: 95.1771%;"><h4 style="
    font-weight: 700;
    bottom: 2px;
    position: relative;
    pointer-events: none;
">ChangeSong</h4></button></div></div><div id="bots" style="display: none; width: 150px; position: absolute; height: 50px; top: 160px; left: 22px;"><div id="binds" style="top: 20px;position: absolute;font-size: 100%;"><b4 style="color: white; left: -10px; top: -10px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Bots...</b4><div style="position: relative; left: 40px; font-size: 95.1771%;"><button data="connectBot" class="btn2" style="position: relative;color: white;right: 5px;background: #3c3c3c;box-shadow: inset 0px -5px 0px #2e2e2e;padding: 8px;border-radius: 5px;border: 2px solid #141414;outline: none;transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><h4 style="
    font-weight: 700;
    bottom: 2px;
    position: relative;
    pointer-events: none;
">Connect Bot</h4></button>

<h4 style="
    width: 200px;
    font-size: 15px;
    color: white;
    font-weight: 100;
    padding-top: 15px;
">followType: </h4>
<ul class="hList" style="
    position: relative;
    bottom: 25px;
    left: 90px;
    width: 100px;
">
  <li>
    <a class="menus">
      <h2 class="menu-title">Mouse</h2>
      <ul class="menu-dropdown">
        <li>KeyBoard</li>
        <li>Mouse</li>
        <li>DICK?? (4)</li>
        <li>Wall</li>

      </ul>
    </a>
  </li>



</ul>

<button data="farmBot" class="btn2" style="position: relative;color: white;top: 20px;right: 5px;background: #3c3c3c;box-shadow: inset 0px -5px 0px #2e2e2e;padding: 8px;border-radius: 5px;border: 2px solid #141414;outline: none;transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><h4 style="
    font-weight: 700;
    bottom: 2px;
    position: relative;
    pointer-events: none;
">Run Farm Bots</h4></button><button data="zombieBot" class="btn2" style="position: relative;color: white;top: 25px;right: 5px;background: #3c3c3c;box-shadow: inset 0px -5px 0px #2e2e2e;padding: 8px;border-radius: 5px;border: 2px solid #141414;outline: none;transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><h4 style="
    font-weight: 700;
    bottom: 2px;
    position: relative;
    pointer-events: none;
">Run Zombies</h4></button><button data="disconnect" class="btn2" style="position: relative;color: white;top: 30px;right: 5px;background: #3c3c3c;box-shadow: inset 0px -5px 0px #2e2e2e;padding: 8px;border-radius: 5px;border: 2px solid #141414;outline: none;transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);"><h4 style="
    font-weight: 700;
    bottom: 2px;
    position: relative;
    pointer-events: none;
">Disconnect</h4></button></div>

</div></div><div id="other" style="display: none; width: 150px; position: absolute; height: 50px; top: 160px; left: 22px;"><div id="binds" style="top: 20px;position: absolute;font-size: 100%;"><b4 style="color: white; left: -10px; top: -10px; font-weight: 100; font-size: 118.971%; position: relative;">✎ Other...</b4><div style="position: relative; left: 40px; font-size: 95.1771%;">
<b4 data="legitMod" style="position: relative;font-weight: 100;color: white;right: 5px;">Legit Mod</b4><input data="legitMod" type="checkbox" class="custom-checkbox"><label id="legitMod"></label></div>

<div style="text-align: left; position: relative; left: 40px; padding-top: 15px; font-size: 95.1771%;"><b4 data="mirrorChat" style="position: relative;font-weight: 100;color: white;right: 5px;">Mirror Chat</b4><input data="mirrorChat" type="checkbox" class="custom-checkbox"><label id="mirrorChat"></label></div></div></div></div></div>
    <div id="songChanger" style="font-size: 95.1771%;position: absolute;width: 400px;z-index: 200;display: block;height: 400px;background: rgb(26, 26, 26);left: 330px;top: 30px;border-radius: 15px;"><div style="
    position: relative;
    top: 20px;
    left: 25px;
    height: 300px;
    text-align: start;
    color: white;
    background: rgb(0 0 0 / 50%);
    border: none;
    outline: none;
    width: 340px;
    border-radius: 10px;
"><textarea oninput="window.addText(this)" id="songText" style="background: none;outline: none;border: none;color: hsl(0 0% 90% / 1);padding: 8px;font-weight: 100;width: 340px;height: 297px;resize: none;font-family: Comfortaa;"></textarea>
<input oninput="window.changeLink(this)" id="songLink" placeholder="https://cringesong.mp3/" style="
    top: 20px;
    position: relative;
    outline: none;
    border: none;
    color: white;
    width: 340px;
    padding-left: 10px;
    height: 40px;
    border-radius: 10px;
    font-weight: 100;
    font-family: Comfortaa;
    background: rgb(0 0 0 / 50%);
"></div></div>`;
            document.body.append(menu);
            const oldFrameUpdate = window.requestAnimationFrame;
            window.addEventListener("resize", event => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                const scale = Math.min(1, Math.min(width / 824, height / 700));
                [...document.querySelectorAll("#binds")].forEach(element => [...element.children].forEach(el => {
                    if (el.textContent.includes("✎")) {
                        el.style.fontSize = `${(scale * 120)}%`;
                    } else {
                        el.style.fontSize = `${(scale * 96)}%`;
                    }
                }));
            });
            [...document.getElementsByClassName("menu-dropdown")[0].children].forEach(element => {
                element.addEventListener("mouseup", event => {
                    document.querySelector("#binds > div > ul > li > a > h2").innerHTML = event.target.innerHTML;
                    binds.botFollow = event.target.innerHTML;
                    localStorage.setItem("KindaSettings", JSON.stringify(binds));
                })
            });
            [...document.getElementsByClassName("custom-checkbox")].forEach(element => {
                const bindName = element.attributes[0].value
                binds[bindName] = getBind(bindName);
                element.checked = getBind(bindName);
                if (bindName == 'fpsBypass' && element.checked) window.requestAnimationFrame = (frame) => setTimeout(frame, 0);
                element.addEventListener("mouseup", event => {
                    if (bindName == "fpsBypass") {
                        if (!element.checked) {
                            window.requestAnimationFrame = (frame) => setTimeout(frame, 0);
                        } else window.requestAnimationFrame = oldFrameUpdate
                    };
                    if (bindName == "autoChat" && element.checked) {
                        songLink.pause();
                        songLink.currentTime = 0;
                        chatCount = 0;
                    }
                    const newPulse = document.createElement("div");
                    newPulse.style.position = "absolute";
                    newPulse.style.left = "10px";
                    newPulse.style.animation = "pulse 2s";
                    doc(element.attributes[0].nodeValue).append(newPulse);
                    binds[bindName] = !element.checked;
                    localStorage.setItem('KindaSettings', JSON.stringify(binds));
                    setTimeout(() => {newPulse.remove()}, 2000);
                })
            });
            [...document.getElementsByClassName("btn")].forEach(element => {
                element.addEventListener("click", event => {
                    const x = event.clientX - 27;
                    const y = event.clientY - event.target.offsetTop - 205;
                    const newPulse = document.createElement("div");
                    newPulse.style = `
                position: relative;
    width: 5px;
    left: ${x}px;
    top: ${y}px;
    overflow: hidden;
    animation: btnPulse 2s;
    `;
                    doc(element.attributes[0].nodeValue).append(newPulse);
                    setTimeout(() => {newPulse.remove()}, 2000)
                })
            });
            [...document.getElementsByClassName("selector")].forEach(element => {
                element.addEventListener("mouseup", event => {
                    doc("tabContent");
                    [...document.getElementById("tabContent").children].forEach(el => {
                        el.style.display = "none";
                    });
                    doc(element.attributes[0].nodeValue).style.display = "block";
                })
            });
            window.zaglotus = () => {
                event.target.value = event.target.value.replaceAll(/[a-zA-Z]/g, '')
                if (!isNaN(Number(event.data)) && event.data) {
                    binds.cpsBuff = Number(event.target.value);
                }
            }
            [...document.querySelectorAll("#binds")].forEach(element => {
                element.addEventListener("mouseup", function changeBinds (event) {
                    if (event.target.localName == "button") {
                        const btnName = event.target.attributes[0].value;
                        if (btnName == "connectBot") {
                            makeBot();
                            return
                        } else if (btnName == "farmBot") {
                            makeBot("gold", "wss://fra1ffa.sploop.io/ws");
                            makeBot("gold", "wss://ca1ffa.sploop.io/ws");
                            makeBot("gold", "wss://sgp1ffa.sploop.io/ws");
                        } else if (btnName == "disconnect") {
                            Bots.forEach(bot => bot.close())
                            botsDist = 85;
                        } else if (btnName == "zombieBot") {
                            makeBot("zombie", myWS.url);
                            /*
                    makeBot("zombie", "wss://sfra2.sploop.io/ws");
                    makeBot("zombie", "wss://sca.sploop.io/ws");
                    makeBot("zombie", "wss://sca2.sploop.io/ws");
                    makeBot("zombie", "wss://sgp3.sploop.io/ws");
                    makeBot("zombie", "wss://sgp3bis.sploop.io/ws");
                    makeBot("zombie", "wss://fra1ffa.sploop.io/ws");
                    makeBot("zombie", "wss://ca1ffa.sploop.io/ws");
                    makeBot("zombie", "wss://sgp1ffa.sploop.io/ws");
                    */
                        } else if (btnName == "changeSong") {
                            doc("songChanger").style.display = doc("songChanger").style.display == "block" ? doc("songChanger").style.display = "none" : doc("songChanger").style.display = "block";
                        };
                        doc(event.target.id).childNodes[0].nodeValue = "...";
                        this.addEventListener("keyup", function listener2 (event2) {
                            doc(event.target.id).childNodes[0].nodeValue = event2.code;
                            binds[event.target.id] = event2.code;
                            event2.target.blur();
                            localStorage.setItem('KindaSettings', JSON.stringify(binds))
                            this.removeEventListener('keyup', listener2);
                            placement = {
                                trap: repeater(binds.trap, () => place(7), 7),
                                spike: repeater(binds.spike, () => place(4), 4),
                                mill: repeater(binds.mill, () => place(5), 5),
                                QHold: repeater(binds.QHeal, () => placeFood(), 2),
                                platform: repeater(binds.platform, () => place(8), 8),
                            }
                        })
                    }
                })
            })
        }
        const openMenu = () => {
            if (document.querySelector("#KindaMenu > div").style.left == "-350px") {
                document.querySelector("#cps").disabled = false;
                document.querySelector("#KindaMenu > div").style.left = "0px";
                HUD.style.left = "350px";
            } else {
                document.querySelector("#cps").disabled = true;
                document.querySelector("#KindaMenu > div").style.left = "-350px";
                HUD.style.left = "0px";
            }
        }
        })();
}).toString() + `)(${JSON.stringify(GM_info)});`)();