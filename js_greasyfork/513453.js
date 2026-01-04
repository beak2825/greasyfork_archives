 // ==UserScript==
    // @name         Void Console
    // @name2        Void.PL
    // @name3        VoidConsole.PL
    // @name4        VoidConsole.cc
    // @name5        Void.cc
    // @namespace    http://tampermonkey.net/
    // @version      1.2
    // @description  Press Right Shift to close/open the menu some features can be patched beacuse i forgot about this cheat lol.(if you guys want to work with me on this cheat beacuse i forgot how to script kogama exploits lol contact me my discord: killerek1337_
    // @author       KILLEREK1337
    // @match        *://*.kogama.com/page/webgl-frame/*
    // @match        *://*.kogama.com.br/page/webgl-frame/*
    // @match        https*://*friends.kogama.com/page/webgl-frame*
    // @icon         https://res.cloudinary.com/rglweb/image/fetch/f_auto/https://www.raygrahams.com/images/thumbs/0010592_700.jpg
    // @run-at       document-start
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513453/Void%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/513453/Void%20Console.meta.js
    // ==/UserScript==

    const wsServers = [];
    const sockets = [];
    let gamePlayers = [];


    const speeds = new Map(Object.entries({
        shotgun: 500,
        bazooka: 500,
        central: 250,
        sword: 300,
        pistols: 150,
        pistol: 200,
        shuriken: 300
    }));

    const reloads = new Map(speeds.entries());

    const push = Array.prototype.push;
    const foreach = Array.prototype.forEach;
    const uint8array = Uint8Array;
    const uint32array = Uint32Array;
    const uint16array = Uint16Array;
    const float32array = Float32Array;
    const settimeout = setTimeout;
    const error = Error;
    const fromCharCode = String.fromCharCode;
    const messageevent = MessageEvent;

    let normalizedSurface = 0;
    let weapon = "central";
    const symbol = Symbol("onmessage");
    let dragging = false;
    let position;
    let dX;
    let dY;
    let playerSid = 0;
    let startYPort = false;
    let actorNR = 0;

    function wsServer(eventData) {
        const event = new messageevent("message", eventData);

        for (const listener of wsServers) {
            listener(event);
        };
    }

    function to32xConvertedByte(n) {
        return new uint8array(new uint32array([n]).buffer).reverse();
    }

    function to16xConvertedByte(n) {
        return new uint8array(new uint16array([n]).buffer).reverse();
    }

    function to32xConvertedFloat(n) {
        return new uint8array(new float32array([n]).buffer);
    }

    function to32BitNumber(chunk) {
        return ((chunk[0] << 8 |
                 chunk[1]) << 8 |
                chunk[2]) << 8 |
            chunk[3];
    }

    function findDoubles(array) {
        const doubles = [];
        const getDouble = () => array.indexOf(102);
        const doublesCount = array.filter(e => e == 102).length;

        for (let i = 0; i < doublesCount; i++) {
            const doubleIndex = getDouble();
            const double = new uint8array([
                array[doubleIndex + 4],
                array[doubleIndex + 3],
                array[doubleIndex + 2],
                array[doubleIndex + 1]]).buffer;
            doubles.push({
                double: new float32array(double)[0],
                startIndex: doubleIndex + 1
            });
        };

        return doubles;
    };

    function AOBScan(arr1, arr2) {
        let index = 0;
        let index1 = 0;

        while (index < arr1.length && index1 < arr2.length) {
            if (arr1[index] === arr2[index1]) {
                index++;
            }
            index1++;
        }

        return index === arr1.length;
    }

    HTMLElement.prototype.requestFullscreen = new Proxy(HTMLElement.prototype.requestFullscreen, {
        apply(target, that, args) {
            return Reflect.apply(target, document.documentElement, args);
        }
    });

    Object.defineProperty(Object.prototype, "setPosition", {
        get() {
            return function setPosition(x, y, z) {
                const dx = parseFloat(x);
                const dy = parseFloat(y);
                const dz = parseFloat(z);

                if (!isFinite(dx) || !isFinite(dy) || !isFinite(dz)) return;

                var p = this.panner;
                if (p.positionX) {
                    if (p.positionX.value !== x) {
                        p.positionX.value = x;
                    }
                    if (p.positionY.value !== y) {
                        p.positionY.value = y;
                    }
                    if (p.positionZ.value !== z) {
                        p.positionZ.value = z
                    }
                } else if (p._x !== x || p._y !== y || p._z !== z) {
                    p.setPosition(x, y, z);
                    p._x = x;
                    p._y = y;
                    p._z = z
                }

            }
        },
        set() {

        }
    });

    Object.defineProperty(Object.prototype, "setPitch", {
        get() {
            return function setPitch(value) { }
        }, set() { }
    });

    Object.defineProperty(Object.prototype, "quit", {
        get() {
            return function quit() { }
        }, set(quitFunc) {
            alert(quitFunc);
        }
    });

    Object.defineProperty(WebSocket.prototype, "onmessage", {
        get() {
            return this[symbol];
        }, set(callback) {
            this[symbol] = callback;
            this.addEventListener("message", callback);
            packets.notification("Hooked peer connection at " + this.url);
            this.addEventListener("message", function(packet) {
                const packet_ = new uint8array(packet.data);
                const arr = new uint8array(event.data);
                const arr_ = [...arr];
                top.packets.packetsReceived.push(arr_);
                switch (packet_[2]) {
                    case 58:
                        packets.central();
                        break;
                    case 81:
                        onTickAction();
                        break;
                    case 29:
                        packets.setPlayerWeapon(packet_);
                        break;
                    case 255:
                        const ints = [];
                        packet_.forEach((val, index, array) => {
                            if (array[index - 4] === 105) {
                                let args = [array[index - 3] << 8, array[index - 2] << 8, array[index - 1] << 8, array[index]].reverse();
                                ints.push(args[0] | args[1] | args[2] | args[3]);
                            }
                        });
                        actorNR = ints[0];
                        break;
                    case 61:
                        const players = fromCharCode.apply(null,
                                                           packet_);
                        gamePlayers = [...new Set(players.match(/(\d+)/gm).filter(e => e.length == 6))];
                        gamePlayers.forEach(player => {
                            const e = document.createElement("option");
                            e.innerHTML = player;
                            e.value = player;
                            document.querySelector("#select1").append(e);
                        });

                        playerSid = parseInt(players.split(":")[1].replace(',"spawnRoleAvatarIds"', ""));
                        break;
                    case 2:
                        const doubles = findDoubles(arr);
                        const index = arr.indexOf(doubles[1].startIndex);
                        const index1 = arr.indexOf(doubles[0].startIndex);
                        const playerSidCurrent = to32BitNumber(arr_.slice(4, 11));

                        top.console.log(playerSidCurrent, actorNR, playerSid);

                        if (playerSidCurrent != playerSid && actorNR != to32BitNumber(arr_.slice(4, 11))) break;

                        top.console.log("Player position: " + doubles[0].double + "," + doubles[1].double + "," + doubles[2].double);

                        packets.motionY = ~~doubles[1].double / normalizedSurface;
                        normalizedSurface = normalizedSurface * 0.5 + (~~doubles[1].double) * 0.5;

                        if (top.flightY) {
                            const yCoord = parseInt(top.flightY);
                            const _ = to32xConvertedFloat(yCoord || 0.1);

                            arr[index] = _[0];
                            arr[index + 1] = _[1];
                            arr[index + 2] = _[2];
                            arr[index + 3] = _[3];

                            return wsServer({
                                data: arr.buffer
                            });
                        } else if (top.yPort) {
                            startYPort = true;
                        }

                        if (top.impulseTool && doubles[0] && doubles[1] && doubles[2]) {
                            packets.lookAt(doubles[0].double, doubles[1].double, doubles[2].double);
                        }

                        if (top.scaffold) {
                            packets.permetuation(doubles[0].double, doubles[1].double - 1, doubles[2].double);
                        }
                        break;
                }
                return false;

            });

            wsServers.push(callback.bind(this));
            sockets.push(this);
        }
    });

    let delta = 0;
    let lastTick = Date.now();
    let holdingPrimary = false;

    function onTickAction() {
        if (top.rapidFire) {
            packets[weapon]();
        };

        if (top.arf) {
            packets.actToAll("central");
            packets.actToAll("none");
        };

        if (top.sh_) {
            packets.actToAll("hpglitch");
        }

        if (top.rapidMode) {
            packets.central();
            packets[weapon]();
        }

        if (startYPort) {
            packets.yPort();
            startYPort = false;

        }
    }

    const client_menu = document.createElement("div");
    client_menu.style = [
        "position: fixed",
        "color: #000000",
        "z-index: 10",
        "top: 10%",
        "right: 10%",
        "font-weight: slim",
        "font-family: 'Roboto'",
        "scrollbar-color: #000000 #000000",
        "user-select: none"
    ].join(";");
    client_menu.innerHTML = `
      <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
        <style>
            @keyframes glow {
                0% {
                    text-shadow: 0 0 5px black, 0 0 10px black, 0 0 15px black, 0 0 20px black, 0 0 25px black, 0 0 30px black, 0 0 35px black;
                }
                50% {
                    text-shadow: 0 0 10px black, 0 0 20px black, 0 0 30px black, 0 0 40px black, 0 0 50px black, 0 0 60px black, 0 0 70px black;
                }
                100% {
                    text-shadow: 0 0 5px black, 0 0 10px black, 0 0 15px black, 0 0 20px black, 0 0 25px black, 0 0 30px black, 0 0 35px black;
                }
            }

            .glowing-text {
                animation: glow 2s infinite ease-in-out;
            }

            :root {
                --accent: #00B400;
            }

            .feature {
                width: 100% !important;
                height: 30px !important;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(5px);
                border-radius: 40px;
                text-align: center;
                display: inline-block;
                vertical-align: middle;
                margin: 2px;
                font-size: 15px;
                transition: all 1s;
            }

            .feature:hover {
                transition: all 1s;
                transform: scale(105%);
            }
        </style>
    </head>
    <body>
        <div id="menu" style="width: 440px; height: 300px; border-top: 0px solid; background: rgba(0, 0, 0, 0.0); color: #000000; position: absolute; top: 25%; right: 25%; font-family: Arial; font-size: 35px; cursor: move;">
            <span class="glowing-text" style="position: absolute; top: 10px; left: 30px; color: #000000">Void Console</span>
            <div style="font-size: 16.7px; position: absolute; top: 45px; left: 28px">
                <span class="kogama__" onclick="[...document.querySelectorAll('column')].forEach(e => e.style.display='none'); [...document.querySelectorAll('column')][0].style.display='block'">Weapons</span>
                <span onclick="[...document.querySelectorAll('column')].forEach(e => e.style.display='none'); [...document.querySelectorAll('column')][3].style.display='block'">Exploits</span>
            </div>
            <div style="width: 80%; height: 60%; position: absolute; top: 25%; left: 9%; border: 0px solid; border-color: rgba(0, 0, 0, 0.0); overflow-y: scroll; scrollbar-width: none; font-size: 14px">
                <column>
                    <table style="color: white">
                        <thead>
                            <tr>
                                <th>Weapon</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td onclick="top.packets.cube_gun(null, top.packets.cubeID)">Cube-Gun</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.impulse_gun()">Impulse Gun</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.bazooka()">Bazooka</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.pistols()">Double Revolvers</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.heal_gun()">Heal Gun</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.central()">Center Gun</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.shotgun()">Shotgun</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.shuriken()">Shuriken</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.rail()">Rail</td>
                            </tr>
                            <tr>
                                <td onclick="top.packets.sword()">Sword</td>
                            </tr>
                            <tr>
                            </tr>
                            <tr>
                                <td onclick="top.packets.pistol()">Revolver</td>
                            </tr>
                        </tbody>
                    </table>
                </column>
                <column style="display: none">
                    Max player health: <input type="range" value="100" min="1" max="1000" onchange="top.packets.maxHealth(this.value);document.getElementById('maxHealth').innerHTML=this.value"> <span id="maxHealth">100</span> <br>
                    <select id="select" style="border: 2px solid var(--accent); border-top: 4px solid var(--accent); color: #fff; outline: 0; background: #111111">
                        <option value="cube_gun"> CubeGun </option>
                        <option value="impulse_gun"> Impulse Gun </option>
                        <option value="bazooka"> Bazooka </option>
                        <option value="flame"> Flametower </option>
                        <option value="heal_gun"> Healer Gun </option>
                        <option value="pistols"> Pistols </option>
                        <option value="central"> Central </option>
                        <option value="shuriken"> Shuriken </option>
                        <option value="shotgun"> Shotgun </option>
                        <option value="rail"> Rail Gun </option>
                        <option value="sword"> Sword </option>
                        <option value="growthgun"> Slapgun Spawner </option>
                        <option value="rail"> Pistol (1x) </option>
                        <option value="immortality"> Buble (halfly patched) </option>
                        <option value="setScale"> Scalarity </option>
                        <option value="cube"> Spawn Yourself </option>
                        <option value="hpglitch"> Instant HP </option>
                    </select> <span onclick="top.packets.actToAll(document.querySelector('#select').value)"> Execute </span><br>
                    Aggressive Crash: <select id="select1" style="border: 2px solid var(--accent); border-top: 4px solid var(--accent); color: #fff; outline: 0; background: #111111"></select> <span onclick="top.packets.crash(document.querySelector('#select1').value)"> Crash! </span><br>
                </column>
                <column style="display: none">
                    <div class='no_kirka'> Flight Fixed Y: <input type="range" min="-100" max="100" value="0" onchange="top.flightY = this.value"> </div> <br>
                    Flight Fixed Y state: <input type="checkbox" onchange="top.flightY=this.checked"> <br>
                </column>
                <column style="display: none; word-break: break-word; width: 100%; height: 100%; max-width: 100%; max-height: 100%; min-width: 100%; min-height: 100%;">
                    <span class="feature" onclick="top.packets.immortality();this.innerHTML=this.innerHTML=='AutoHeal: OFF'?'AutoHeal: ON':'AutoHeal: OFF'">AutoHeal: OFF</span> <br>
                    <span class="feature" onclick="top.packets.impulse_tool();this.innerHTML=this.innerHTML=='AutoShot/InfAmmo: OFF'?'AutoShot/InfAmmo: ON':'AutoShot/InfAmmo: OFF'">AutoShot/InfAmmo: OFF</span><br>
                    <column id="logging" style="display: none; overflow-y: scroll; max-width: 100%; max-height: 100%; width: 100%; height: 100%; scrollbar-width: none">
                        <span onclick="top.packets.sniffer();if(this.innerHTML=='Sniffer: OFF'){this.innerHTML='Sniffer: ON'}else{this.innerHTML='Sniffer: OFF'}">Sniffer: OFF</span><br>
                        <span onclick="top.packets.repeatPackets()"> Repeat packets queue </span> <br>
                        <div id="packetsSniffer" style="font-size: 7px"> Packets will appear here </div>
                    </column>
                    <column style="display: none; overflow: scroll; max-width: 100%; max-height: 100%; width: 100

        `;
    client_menu.id = "clientMenu";
    client_menu.style.setProperty("accent", "#00B400");
    client_menu.addEventListener("mousedown", e => {
        dragging = true;
        position = e;
        dX = e.clientX - client_menu.getBoundingClientRect().left;
        dY = e.clientY - client_menu.getBoundingClientRect().top;
    });

    document.addEventListener("mousedown", e => {
        holdingPrimary = true;
    });

    document.addEventListener("mouseup", e => {
        dragging = false;

        holdingPrimary = false;
    });

    document.addEventListener("mousemove", e => {
        if (!dragging) return;

        const menuX = e.clientX// + dX;
        const menuY = e.clientY// + dY;
        const deltaX = menuX - position.clientX;
        const deltaY = menuY - position.clientY;

        const currentX = parseInt(client_menu.style.left);
        const currentY = parseInt(client_menu.style.top);

        const newX = currentX - deltaX;
        const newY = currentY - deltaY;

        client_menu.style.left = newX + "px";
        client_menu.style.top = newY + "px";
        position = e;
    });

    document.addEventListener("keyup", e => {
        switch (e.code) {
            case "ShiftRight":
                client_menu.style.display = client_menu.style.display == "block" ? "none" : "block";
                break;

        }
    });

    document.documentElement.append(client_menu);

    const packets = {
        motionY: 0,
        cubeID: 7,
        packetsReceived: [],
        sniffing: false,
        repeatPackets() {
            this.packetsReceived.forEach(packet => {
                const encodedPacket = new Uint8Array(packet);
                wsServer({ data: encodedPacket });
            });
        },
        sendPacket(packet) {
            const encodedPacket = new Uint8Array(JSON.parse(packet));
            this.notification("Sending packet " + encodedPacket);
            wsServer({ data: encodedPacket });
        },
        setPlayerWeapon(packet) {
            const arr = [...packet];

            const weaponSid = arr.slice(44, 48);
            const pID = arr.slice(7, 11);
            const myPID = [...to32xConvertedByte(playerSid)];
            const mappings = new Map(Object.entries({
                1: "central",
                4: "bazooka",
                10: "flame",
                70: "heal_gun",
                6: "rail",
                2: "impulse_gun",
                8: "sword",
                13: "pistols",
                9: "shotgun",
                11: "cube_gun"
            }));
            let weaponName;

            if (pID[0] != myPID[0] ||
                pID[1] != myPID[1] ||
                pID[2] != myPID[2] ||
                pID[3] != myPID[3]) return;

            weaponName = mappings.get(String(to32BitNumber(weaponSid)));

            //top.console.log("Weapon SID: " + to32BitNumber(weaponSid) + " weapon name: " + weaponName);

            if (weaponName) {
                weapon = weaponName;

                packets.notification("Picking " + weaponName + "!");
            }

            if (weaponName == "cube_gun") {
                packets.cubeID = arr[116];
            }
        },
        sniffer() {
            this.sniffing = !this.sniffing;
            if (!this.sniffing) {
                document.getElementById("packetsSniffer").innerHTML = this.packetsReceived.map(packet => `<span class=".shadow" onclick="top.packets.sendPacket('${JSON.stringify(packet)}')">${packet.join(", ")} is ${String.fromCharCode(...packet)}</span>`).join("<br>");
            } else this.packetsReceived = [];
        },
        actToAll(action) {
            gamePlayers.filter(e => e.length == 6)
                .forEach(e => this[action](e, packets.cubeID));
        },
        crash(pid = 0) {
            this.none(pid);
            this.hpglitch(pid, -NaN);
            this.cube(pid, 0, 0, 0);
            this.movement(pid);
            this.none(pid);
        },
        movement(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 2, 0, 7, 22, ...to32xConvertedByte(pid), 0, 0, 0, 0, 0, 0
            ]).buffer });
        },
        fire(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 8, 105, 115, 70, 105, 114, 105, 110, 103, 111, 1, 254, 105, 0, 0, 0, 0
            ]).buffer });
        },
        combatYaw() {
            if (!document.pointerLockElement) return;

            document.pointerLockElement.dispatchEvent(new MouseEvent("mousemove", {
                movement: Math.random() * 10
            }));
        },
        changeCubeId(cubeID) {
            this.cubeID = parseInt(cubeID);
        },
        cube(pid = playerSid, x = 1, y = 1, z = 1) {
            pid = playerSid;
            wsServer({ data: new uint8array([
                243,4,79,0,14,24,102,...to32xConvertedFloat(x),25,102,...to32xConvertedFloat(y),26,102,...to32xConvertedFloat(z),27,102,0,0,0,0,28,102,0,0,0,0,29,102,0,0,0,0,30,102,0,0,0,0,72,121,0,3,105,...to32xConvertedByte(pid),0,0,0,0,255,255,255,255,101,111,0,20,105,0,0,0,0,128,105,0,0,0,1,58,105,255,255,255,255,92,105,255,255,255,255,254,105,0,0,0,0
            ]).buffer });
        },
        rail(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 6, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "rail";
        },
        sword(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 8, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "sword";
        },
        growthgun(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 2, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 62, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 115, 0, 9, 97, 110, 105, 109, 97, 116, 105, 111, 110, 68, 0, 0, 0, 2, 115, 0, 5, 115, 116, 97, 116, 101, 115, 0, 4, 73, 100, 108, 101, 115, 0, 9, 116, 105, 109, 101, 83, 116, 97, 109, 112, 105, 80, 15, 108, 52, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "growthgun";
        },
        pistol(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 12, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "pistol";
        },
        antirfire() {
            top.arf_ = !top.arf_;
        },
        cube_gun(pid = playerSid, id = null) {
            if (!pid) pid = playerSid;
            if (!id) id = this.cubeID;

            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 4, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 11, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 115, 0, 8, 105, 116, 101, 109, 68, 97, 116, 97, 68, 0, 0, 0, 1, 115, 0, 8, 109, 97, 116, 101, 114, 105, 97, 108, 98, id, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "cube_gun";
        },
        kick_all(pid = playerSid) {
            wsServer(new uint8array([243, 2, 25, 0, 2, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 4, 115, 105, 122, 101, 102, 63, 128, 0, 0]));
        },
        impulse_gun(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 2, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 2, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 115, 0, 9, 97, 110, 105, 109, 97, 116, 105, 111, 110, 68, 0, 0, 0, 2, 115, 0, 5, 115, 116, 97, 116, 101, 115, 0, 4, 73, 100, 108, 101, 115, 0, 9, 116, 105, 109, 101, 83, 116, 97, 109, 112, 105, 70, 131, 252, 232, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "impulse_gun";
        },
        bazooka(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 4, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "bazooka";
        },
        heal_gun(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 70, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "heal_gun";
        },
        pistols(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 13, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "pistols";
        },
        central(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 1, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
        },
        shotgun(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 9, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "shotgun";
        },
        none(pid = playerSid) {
            if (pid == playerSid) return; // prevent crashes due to webgl signature dismatch

            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 255, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "none";
        },
        flame(pid = playerSid) {
            wsServer({ data: new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 10, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer });
            weapon = "flame";
        },
        shuriken(pid = playerSid) {
            wsServer({ data:new uint8array([
                243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 11, 99, 117, 114, 114, 101, 110, 116, 73, 116, 101, 109, 68, 0, 0, 0, 3, 115, 0, 4, 116, 121, 112, 101, 105, 0, 0, 0, 45, 115, 0, 9, 118, 97, 114, 105, 97, 110, 116, 73, 100, 105, 0, 0, 0, 0, 115, 0, 15, 117, 112, 100, 97, 116, 101, 73, 116, 101, 109, 83, 116, 97, 116, 101, 105, 0, 0, 0, 4, 254, 105, 0, 0, 0, 0
            ]).buffer});
            weapon = "shuriken";
         },
        maxHealth(health, pid = playerSid) {
            wsServer({ data: new uint8array([243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 9, 109, 97, 120, 72, 101, 97, 108, 116, 104, 105, ...new uint8array(new Float32Array([health]).buffer).reverse(), 254, 105, 0, 0, 0, 0]).buffer });
        },
        setHealth(pid = playerSid, health = 100) {
            wsServer({ data: new uint8array([243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 6, 104, 101, 97, 108, 116, 104, 102, ...new uint8array(new Float32Array([health]).buffer).reverse(), 254, 105, 0, 0, 0, 0]).buffer });
        },
        immortality(pid = playerSid) {
            //wsServer({ data: new uint8array([243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 17, 115, 112, 97, 119, 110, 82, 111, 108, 101, 77, 111, 100, 101, 84, 121, 112, 101, 105, 0, 0, 0, 0, 254, 105, 0, 0, 0, 0]).buffer });
            top.regenerate = !top.regenerate;

        },
        notificationOffset: 0,
        notification(text) {
            const notif = document.createElement("div");
            notif.innerHTML = text;
            notif.style = "width: 0px; text-align: center; height: 0px; z-index: 0; background: rgba(0, 0, 0, 0.5); color: white; font-size: 0px; border-bottom: 0px solid green; position: fixed; right: 0px";
            notif.style.top = (this.notificationOffset += 0) + "px";
            document.documentElement.appendChild(notif);

            setTimeout(() => {
                this.notificationOffset -= 0;
                notif.remove();
            }, 0);
        },
        fallingTrp: 0,
        yPort() {
            if (this.motionY > 1) { // airstrafe
                this.fallingTrp -= 0.1 + Math.random() * 0.1;
                this.motionY = -0;
                this.jump();
                if (this.fallingTrp <= 0.9) { // up force < gravity
                    this.notification("YPortStabilizer: Falling!");
                    this.central();
                    this.pistols();
                    this.fire();

                    this.central();
                    this.pistols();
                    this.fire();
                    this.fallingTrp += 0.11 + Math.random() * 0.3;
                }
            } else {
                this.notification("BHop: Adding Up Force");
                this.pistols();
                this.fire();
                this.jump();
            }
        },
        setScale(sid = playerSid) { },
        impulse_tool() {
            top.impulseTool = !top.impulseTool;
        },
        lookAt(x, y, z) {
            wsServer({ data: new uint8array([243, 4, 31, 0, 8, 22, 105,
                                             ...to32xConvertedByte(playerSid),
                                             74, 102, ...to32xConvertedFloat(x),
                                             75, 102, ...to32xConvertedFloat(y),
                                             76, 102, ...to32xConvertedFloat(z),
                                             77, 102, ...to32xConvertedFloat(x),
                                             78, 102, ...to32xConvertedFloat(y),
                                             79, 102, ...to32xConvertedFloat(x), 254, 105, 0, 0, 0, 0]) });
        },
        internalCubeSeparator: 0,
        permetuation(x, y, z) {
            wsServer({
                data: new uint8array([
                    243, 4, 10, 0, 3, 47, 105, ...to32xConvertedByte(playerSid), 49, 120, 0, 0, 0, (this.cubeID > -1 ? 9 : 7), (this.cubeID > -1 ? 2 : 0),
                    ...to16xConvertedByte(x), ...to16xConvertedByte(y), ...to16xConvertedByte(z), ...(this.cubeID ? [7, this.cubeID] : []),
                    254, 105, 0, 0, 0, 0
                ])
            });
        },
        scaffold() {
            top.scaffold = !top.scaffold;
        },
        rotationData(pitch, yaw, pid = playerSid) {
            const pYAW = Math.random();
            const pPITCH = Math.random();
            wsServer({
                data: new Uint8Array([
                    243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(playerSid), 70, 68, ...to32xConvertedFloat(pYAW), 115, 0, 15, 104, 101, 97, 100, 82, 111, 116, 97, 116, 105, 111, 110, 89, 97, 119, 102, 67, 178, 12, 110, 115, 0, 17, 104, 101, 97, 100, 82, 111, 116, 97, 116, 105, 111, 110, 80, 105, 116, 99, 104, 102, ...to32xConvertedFloat(pPITCH), 254, 105, ...to32xConvertedFloat(pPITCH)
                ])
            });
        },
        rotation() {
            top.antiAim = !top.antiAim;
        },
        jump() {

            let wsServers = [];
    const push = Array.prototype.push;
    const foreach = Array.prototype.forEach;
    const uint8array = Uint8Array;
    const uint32array = Uint32Array;
    const uint16array = Uint16Array;
    const float32array = Float32Array;
    const error = Error;
    const fromCharCode = String.fromCharCode;
    const messageevent = MessageEvent;
    let playerSid = 0;
    const symbol = Symbol("onmessage");
    let autoheal = false;
    let players = "";

    document.addEventListener("keyup", e => {
        switch (e.code) {
            case "KeyX":
                autoheal = !autoheal;
                packets.notification((autoheal ? "Enabling" : "Disabling") + " autoheal module");
                break;
        }
    });

    function wsServer(eventData) {
        const event = new messageevent("message", eventData);

        for (const listener of wsServers) {
            listener(event);
        };
    };

    function to32xConvertedByte(n) {
        return new uint8array(new uint32array([n]).buffer).reverse();
    }

    Object.defineProperty(WebSocket.prototype, "onmessage", {
        get() {
            return this[symbol];
        }, set(callback) {
            this[symbol] = callback;
            this.addEventListener("message", callback);
            packets.notification("Hooked peer connection at " + this.url);
            this.addEventListener("message", function(packet) {
                const packet_ = new uint8array(packet.data);
                const arr = new uint8array(event.data);
                const arr_ = [...arr];
                switch (packet_[2]) {
                    case 61:
                        players = fromCharCode.apply(null,
                                                           packet_);

                        playerSid = parseInt(players.split(":")[1].replace(',"spawnRoleAvatarIds"', ""));
                        packets.notification("Player sid: " + playerSid);
                        break;
                }
                return false;

            });

            wsServers.push(callback.bind(this));
        }
    });

    const packets = {
        notificationOffset: 0,
        setPlayerHealth(pid = playerSid, health = 100) {
            wsServer({ data: new uint8array([243, 4, 29, 0, 3, 22, 105, ...to32xConvertedByte(pid), 70, 68, 0, 0, 0, 1, 115, 0, 6, 104, 101, 97, 108, 116, 104, 102, ...new uint8array(new Float32Array([health]).buffer).reverse(), 254, 105, 0, 0, 0, 0]).buffer });
        },
        notification(text) {
            const notif = document.createElement("div");
            notif.innerHTML = text;
            notif.style = "width: 300px; text-align: center; height: 50px; z-index: 9999; background: rgba(0, 0, 0, 0.5); color: white; font-size: 20px; border-bottom: 2px solid green; position: fixed; right: 0px";
            notif.style.top = (this.notificationOffset += 70) + "px";
            document.documentElement.appendChild(notif);

            setTimeout(() => {
                this.notificationOffset -= 70;
                notif.remove();
            }, 2000);
        },
    };

    setInterval(() => {
        if (!autoheal) return;

        packets.setPlayerHealth();
    }, 300);


        }
    };

    let lastRegen = Date.now();

    setInterval(() => {
        if (top.regenerate && Date.now() - lastRegen > 300) {
            packets.setHealth();
            lastRegen = Date.now();
        }
        if (top.antiAim) packets.rotationData();

        if (!top.impulseTool ||
            !holdingPrimary || !weapon) return;

        packets[weapon]();
        packets.fire();
    }, 50);

    Object.defineProperty(top, "packets", {
        get() {
            const { stack } = new error();
            if (stack.includes("app")) return undefined;

            return packets;

        }
    });
    let autoheal = false;
    let players = "";
    document.addEventListener("keyup", e => {
        switch (e.code) {
            case "KeyX":
                autoheal = !autoheal;
                packets.notification((autoheal ? "Enabling" : "Disabling") + " autoheal module");
                break;

        }
    });

