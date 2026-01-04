// ==UserScript==
// @name         Triangle-Flank Hybrid
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Fuck you Shädam.
// @author       diep.io (the discord guy)
// @match        https://diep.io/
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/400257/Triangle-Flank%20Hybrid.user.js
// @updateURL https://update.greasyfork.org/scripts/400257/Triangle-Flank%20Hybrid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var realSend = unsafeWindow.WebSocket.prototype.send;
    var mainWS;
    var ACBots = new Set();

    const tanks = {FlankGuard: 120, Triangle: 122, Sniper: 100, Overseer: 126, Necromancer: 74, Stalker: 66};
    const binaryFlags = ["leftclick", "up", "left", "down", "right", "godmode", "suicide", "rightclick", "levelup", "gamepad", "slash"];
    const URLRegex = /^wss?:\/\/[a-z0-9]{4}\.s\.m28n\.net\/$/g;

    unsafeWindow.WebSocket.prototype.send = function(data)
    {
        if (!(data instanceof Int8Array && this.url.match(URLRegex)) || this.dontRegister) // The other websockets (for checking latency) uses ArrayBuffer, we want only the diep.io game's websocket
        {
            return realSend.call(this, data);
        }

        if (this !== mainWS)
        {
            mainWS = this;

            this.serverID = this.url.split("://")[1].split(".")[0].toLowerCase();
            this.queuedSlashes = 0;
            this.blockSlash = false;
            this.firstSpawn = true;

            this.doHybrid = false;
            this.doStalker = false;
            this.noFlank = false; // If you want the Triangle-Flank hybrid to not give a delay for Flank Guard before switching back to Triangle
            this.ACShooting = false;

            this.realClose = this.onclose;
            this.onclose = function(event)
            {
                //ACBots.forEach(ws => ws.close());
                return this.realClose.call(this, event);
            }

            this.realRecv = this.onmessage;
            this.onmessage = function(event)
            {
                var data = new Uint8Array(event.data);
                switch (data[0])
                {
                    case 3:
                    {
                        var chars = data.slice(1, data.indexOf(0));
                        var text = "";
                        for (let char of chars) text += String.fromCharCode(char);
                        if (text === "Use your left mouse button to control the drones" || text === "Use your right mouse button to look further in the direction you're facing") return; // If you know how to install this script, you know how to use drones/Predator.
                        break;
                    }
                    case 4:
                    {
                        if (!this.partyCode) this.onmessage({data: [6]}); // Allow copying links for other gamemodes that you cannot normally generate links for
                        break;
                    }
                    case 5:
                    {
                        if (this.pingSpoof !== undefined) return;
                        break;
                    }
                    case 6:
                    {
                        if (window.location.hash && window.location.hash.indexOf("00") && window.location.hash.indexOf("00") + 2 !== window.location.hash.length)
                        {
                            this.partyCode = window.location.hash.slice(window.location.hash.indexOf("00") + 2).toUpperCase();
                        }
                        else
                        {
                            this.partyCode = Array.from(data).slice(1).map(r => r.toString(16).padStart(2, "0").split('').reverse().join("")).join("").toUpperCase();
                        }
                        break;
                    }
                    case 10:
                    {
                        var playerCount = Array.from(data).slice(1);
                        this.playerCount = 0;
                        for (let i = 0; i < playerCount.length; i++)
                        {
                            this.playerCount += playerCount[i] % 128 * Math.pow(128, i);
                            if (playerCount[i] < 128) break;
                        }
                        if (this.playerSpoof !== undefined) return;
                        break;
                    }
                }
                return this.realRecv.call(this, event);
            }
        }

        var switchTank = null;

        switch (data[0])
        {
            case 0:
            {
                //console.log(Array.from(data).splice(1));
                var view = new DataView(new ArrayBuffer(data.byteLength));
                for (let i in data) view.setInt8(i, data[i]); // For some reason I must create a new ArrayBuffer object and copy over all the contents, reusing the sent one doesn't work
                this.joinPacket = view.buffer;
                break;
            }
            case 1:
            {
                var ACPacket = new Int8Array(data);
                ACPacket[1] &= 0b10000001;
                ACPacket[2] &= 0b11110010;
                ACPacket[1] |= 0b00000001;
                ACPacket[2] |= 0b00000010;

                ACPacket[1] |= !this.ACShooting << binaryFlags.indexOf("suicide");

                /*ACBots.forEach(ws => {
                    if (ws.packetSaving) return;
                    if (ws.finishedLevelingUp)
                    {
                        ws.send(new Int8Array([4, tanks.Sniper]));
                        ws.send(new Int8Array([4, tanks.Overseer]));
                        ws.send(new Int8Array([4, tanks.Necromancer]));
                        ACPacket[2] |= 0b00001000; // Slash to get to AC

                        for (let i = 0; i < 7; i++)
                        {
                            ws.send(new Int8Array([3, 14, 1])); // Bullet Speed
                            ws.send(new Int8Array([3, 4, 1])); // Reload
                            ws.send(new Int8Array([3, 2, 1])); // Bullet Damage
                            ws.send(new Int8Array([3, 0, 1])); // Bullet Penetration
                        }
                    }
                    realSend.call(ws, ACPacket);
                    if (ws.finishedLevelingUp)
                    {
                        ws.finishedLevelingUp = false;
                        ACPacket[2] &= 0b11110111; // Slash was just for that websocket only
                    }
                    if (!this.ACShooting) ws.packetSaving = true;
                });*/

                var flags = (data[1] & 0b01111111) + ((data[2] & 0b00001111) << 7);
                if (this.queuedSlashes && (!this.blockSlash || (this.doHybrid && this.noFlank)))
                {
                    data[2] |= 1 << (binaryFlags.indexOf("slash") - 7); // Modify the outgoing packet to include holding down \
                    this.queuedSlashes--;
                    this.blockSlash = true;
                    setTimeout((mainWS) => {mainWS.blockSlash = false}, this.doHybrid ? 215 : 200, this);
                    if (this.doHybrid)
                    {
                        switchTank = tanks.Triangle; // Switch to Triangle for the Triangle-Flank hybrid cycle
                    }
                }
                else if (this.doStalker)
                {
                    switchTank = tanks.Stalker; // Switch to Stalker after pressing \ once from AC
                    this.doStalker = false;
                }
                break;
            }
            case 2:
            {
                if (this.firstSpawn)
                {
                    this.firstSpawn = false;

                    notification("Anti-Shadam Zone: ACTIVATED", 0, 255, 0, 5000);
                    notification(["Menu",
                                  "/ - Triangle-Flank Hybrid",
                                  "Shift + / - Triangle Only for Triangle-Flank Hybrid",
                                  "` - Instant AC (From Basic/Sniper/Overseer/Necromancer)",
                                  ", - AC -> Stalker",
                                  ". - Stalker -> AC"], 255, 0, 0, 7000);
                    setTimeout(notification, 0, "", 0, 0, 0, 1, "adblock"); // Nobody cares. You make enough ad revenue anyway
                }
                break;
            }
            case 3:
            {
                break;
            }
            case 4:
            {
                if (this.doHybrid && data[1] === tanks.Triangle) // If just switched to Triangle from the Triangle-Flank hybrid cycle
                {
                    this.queuedSlashes++;
                }
                break;
            }
            case 5:
            {
                if (this.pingSpoof !== undefined) return;
                break;
            }
            case 7:
            {
                return; // Some extensions get detected and it gets sent to the diep servers. Currently it appears they do nothing with it, but incase they ever start banning in the future, this script will protect you by preventing them from knowing if you used some shit extension that got detected.
                // You may still get the "You're using a modified game client" popup, but the data will never get sent.
            }
            case 8:
            {
                this.queuedSlashes = 0;
                this.doHybrid = false;
                unsafeWindow.input.set_convar("net_predict_movement", "true");
                break;
            }
        }

        if (switchTank)
        {
            setTimeout((ws) => {ws.send(new Int8Array([4, switchTank]))}, this.noFlank ? 0 : 45, this);
        }
        return realSend.call(this, data);
    }

    function notification(textOrArray, R, G, B, time, unique)
    {
        if (typeof R !== "number") R = 0; while (R < 0) R += 256; while (R > 255) R -= 256;
        if (typeof G !== "number") G = 0; while (G < 0) G += 256; while (G > 255) G -= 256;
        if (typeof B !== "number") B = 0; while (B < 0) B += 256; while (B > 255) B -= 256;
        if (typeof time !== "number" || time < 0) time = 5000; // 0 for permanent, null for invalid/cancel
        if (unique && typeof unique !== "string") unique = "";

        if (typeof textOrArray !== "string") // If we passed an array of strings, we want to send each string as a seperate notification row
        {
            for (let n of textOrArray)
            {
                notification(n, R, G, B, time, unique);
            }
            return;
        }

        var packet = [3];

        for (let i in textOrArray)
        {
            packet.push(textOrArray.charCodeAt(i));
        }

        packet.push(0);

        /* Known colours:
            Normal, e.g. adblock/predator/drones/godmode/kill/bossspawn/bosskill/domtaken/domsurrender: 0,0,0
            Announcement, e.g. arena closed/team full: 255,0,0
            Toggle, e.g. autofire/autospin: 0,0,255

        Team related, e.g. win,domcontesting,domcontrolled,takedom
            Blue Team: 0,178,225
            Red Team: 241,78,84
            Purple Team: 191,127,245
            Green Team: 0,225,110
            Yellow Team: 255,232,105
            Grey Team: // Apparently fallen bosses can also capture a dominator, obviously this is extremely rare, but if I ever find the colour of their notification I will put it here
        */

        packet.push(B); // Little-endian format, RGB in reverse order
        packet.push(G);
        packet.push(R);

        packet.push(0);

        var view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, time) // Time is in milliseconds
        for (let i = 3; i >= 0; i--) // Little-endian format
        {
            packet.push(view.getInt8(i));
        }

        /* Known uniques:
        Client sided:
            autofire: Auto Fire: ON/OFF
            autospin: Auto Spin: ON/OFF
            gamepad_enabled: Gamepad enabled/disabled // untested, obtained from the client's .wasm.wasm file
            adblock: You're using an adblocker, please consider disabling it to support the game
        Server sided:
            godmode_toggle: God mode: ON/OFF
            cant_claim_info: Someone has already taken that tank
        */

        if (unique)
        {
            for (let i in unique)
            {
                packet.push(unique.charCodeAt(i));
            }
        }

        packet.push(0);

        mainWS.realRecv.call(mainWS, {data: packet});
    }

    function playerCount(players)
    {
        if (typeof players !== "number" || players < 0 || players > ~(1 << 31)) players = 0; // 0 for hide player count
        mainWS.playerSpoof = players;

        var packet = [];

        var power = 0;
        while (players > 0)
        {
            if (power > 0) packet[power - 1] += 128;
            packet[power] = players / Math.pow(128, power) % 128;
            players -= packet[power] % 128 * Math.pow(128, power);
            power++;
        }

        packet.unshift(10);

        mainWS.realRecv.call(mainWS, {data: packet});
    }

    document.addEventListener('keydown', function(event)
    {
        if (!document.getElementById("textInput").disabled) return; // Disable keybinds while we are typing into the textbox where you enter the name to spawn in with
        var keyCode = event.keyCode || event.which;
        switch (keyCode)
        {
            case 220: // Back slash
            {
                if (event.shiftKey)
                {
                    mainWS.queuedSlashes = 0; // Just incase someone spammed something that queued slashes and they want to quickly cancel it
                    event.cancelBubble = true; // Prevent the \ ingamed
                    notification("Canceled switch tank", 0, 0, 255, 5000, "switchtank_info");
                }
                break;
            }
            case 191: // Forward slash
            {
                if (!event.shiftKey)
                {
                    mainWS.queuedSlashes = 0;
                    mainWS.doHybrid = !mainWS.doHybrid;
                    notification("Triangle-Flank Hybrid: " + (mainWS.doHybrid ? "ON" : "OFF"), 0, 0, 255, 5000, "triangleflank_toggle");
                    if (mainWS.doHybrid)
                    {
                        mainWS.send(new Int8Array([4, tanks.FlankGuard]));
                        mainWS.send(new Int8Array([4, tanks.Triangle]));
                    }
                    unsafeWindow.input.set_convar("net_predict_movement", !mainWS.doHybrid);
                }
                else
                {
                    mainWS.noFlank = !mainWS.noFlank;
                    notification("Triangle Only: " + (mainWS.noFlank ? "ON" : "OFF"), 0, 0, 255, 5000, "triangleflank_triangleonly");
                }
                break;
            }
            case 190: // Full stop
            {
                mainWS.queuedSlashes += 5; // Stalker -> AC requires five slashes
                notification("Stalker -> AC", 0, 0, 255, 5000, "switchtank_info");
                break;
            }
            case 188: // Comma
            {
                mainWS.queuedSlashes++;
                mainWS.doStalker = true;
                notification("AC -> Stalker", 0, 0, 255, 5000, "switchtank_info");
                break;
            }
            case 192: // Grave
            {   // This function works wether you're at basic, Sniper, Overseer or Necromancer, just make sure you're at level 45
                mainWS.send(new Int8Array([4, tanks.Sniper]));
                mainWS.send(new Int8Array([4, tanks.Overseer]));
                mainWS.send(new Int8Array([4, tanks.Necromancer]));
                mainWS.queuedSlashes++;
                //ws.realRecv.call(ws, {data: [3, 65, 114, 101, 110, 97, 32, 99, 108, 111, 115, 101, 100, 58, 32, 78, 111, 32, 112, 108, 97, 121, 101, 114, 115, 32, 99, 97, 110, 32, 106, 111, 105, 110, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0]}); // Arena closed: No players can join
                //ws.realRecv.call(ws, {data: [3, 84, 104, 101, 32, 116, 101, 97, 109, 32, 121, 111, 117, 32, 116, 114, 105, 101, 100, 32, 116, 111, 32, 106, 111, 105, 110, 32, 105, 115, 32, 102, 117, 108, 108, 0, 0, 0, -1, 0, 0, 64, 28, 70, 0]}); // The team you tried to join is full
                //ws.realRecv.call(ws, {data: [3, 89, 111, 117, 39, 118, 101, 32, 107, 105, 108, 108, 101, 100, 32, 92, 0, 0, 0, 0, 0, 0, 64, 100, 69, 0]}); // You've killed /
                //ws.realRecv.call(ws, {data: [3, 85, 115, 101, 32, 121, 111, 117, 114, 32, 114, 105, 103, 104, 116, 32, 109, 111, 117, 115, 101, 32, 98, 117, 116, 116, 111, 110, 32, 116, 111, 32, 108, 111, 111, 107, 32, 102, 117, 114, 116, 104, 101, 114, 32, 105, 110, 32, 116, 104, 101, 32, 100, 105, 114, 101, 99, 116, 105, 111, 110, 32, 121, 111, 117, 39, 114, 101, 32, 102, 97, 99, 105, 110, 103, 0, 0, 0, 0, 0, 0, 64, 28, 70, 0]}); // Use your right mouse button to look further in the direction you're facing
                //ws.realRecv.call(ws, {data: [3, 85, 115, 101, 32, 121, 111, 117, 114, 32, 108, 101, 102, 116, 32, 109, 111, 117, 115, 101, 32, 98, 117, 116, 116, 111, 110, 32, 116, 111, 32, 99, 111, 110, 116, 114, 111, 108, 32, 116, 104, 101, 32, 100, 114, 111, 110, 101, 115, 0, 0, 0, 0, 0, 0, 64, 28, 70, 0]}); // Use your left mouse button to control the drones
                //ws.realRecv.call(ws, {data: [3, 84, 104, 101, 32, 78, 87, 32, 68, 111, 109, 105, 110, 97, 116, 111, 114, 32, 105, 115, 32, 98, 101, 105, 110, 103, 32, 99, 111, 110, 116, 101, 115, 116, 101, 100, 0, 105, -24, -1, 0, 0, 64, 28, 70, 0]}); // The NW Dominator is being contested
                //ws.realRecv.call(ws, {data: [3, 84, 104, 101, 32, 78, 87, 32, 68, 111, 109, 105, 110, 97, 116, 111, 114, 32, 105, 115, 32, 110, 111, 119, 32, 99, 111, 110, 116, 114, 111, 108, 108, 101, 100, 32, 98, 121, 32, 82, 69, 68, 0, 84, 78, -15, 0, 0, 64, 28, 70, 0]}); // The NW Dominator is now controlled by RED
                //ws.realRecv.call(ws, {data: [3, 80, 114, 101, 115, 115, 32, 72, 32, 116, 111, 32, 116, 97, 107, 101, 32, 99, 111, 110, 116, 114, 111, 108, 32, 111, 102, 32, 116, 104, 101, 32, 100, 111, 109, 105, 110, 97, 116, 111, 114, 0, -31, -78, 0, 0, 0, 64, -100, 69, 0]}); // Press H to take control of the dominator
                //ws.realRecv.call(ws, {data: [3, 83, 111, 109, 101, 111, 110, 101, 32, 104, 97, 115, 32, 97, 108, 114, 101, 97, 100, 121, 32, 116, 97, 107, 101, 110, 32, 116, 104, 97, 116, 32, 116, 97, 110, 107, 0, 0, 0, 0, 0, 0, 64, -100, 69, 99, 97, 110, 116, 95, 99, 108, 97, 105, 109, 95, 105, 110, 102, 112, 0]}); // Someone has already taken that tank // cant_claim_info
                //ws.realRecv.call(ws, {data: [3, 80, 114, 101, 115, 115, 32, 72, 32, 116, 111, 32, 115, 117, 114, 114, 101, 110, 100, 101, 114, 32, 99, 111, 110, 116, 114, 111, 108, 32, 111, 102, 32, 116, 104, 101, 32, 116, 97, 110, 107, 0, 0, 0, 0, 0, 0, 96, 106, 70, 0]}); // Press H to surrender control of the tank
                //ws.realRecv.call(ws, {data: [3, 82, 69, 68, 32, 72, 65, 83, 32, 87, 79, 78, 32, 84, 72, 69, 32, 71, 65, 77, 69, 33, 0, 84, 78, -15, 0, 0, 0, 0, 0, 0]}); // RED HAS WON THE GAME!
                //ws.realRecv.call(ws, {data: [3, 66, 76, 85, 69, 32, 72, 65, 83, 32, 87, 79, 78, 32, 84, 72, 69, 32, 71, 65, 77, 69, 33, 0, -31, -78, 0, 0, 0, 0, 0, 0, 0]}); // BLUE HAS WON THE GAME!
                //ws.realRecv.call(ws, {data: [3, 80, 85, 82, 80, 76, 69, 32, 72, 65, 83, 32, 87, 79, 78, 32, 84, 72, 69, 32, 71, 65, 77, 69, 33, 0, 245, 127, 191, 0, 0, 0, 0, 0, 0]}); // PURPLE HAS WON THE GAME!
                //ws.realRecv.call(ws, {data: [3, 71, 82, 69, 69, 78, 32, 72, 65, 83, 32, 87, 79, 78, 32, 84, 72, 69, 32, 71, 65, 77, 69, 33, 0, 110, -31, 0, 0, 0, 0, 0, 0, 0]}); // GREEN HAS WON THE GAME!
                //ws.realRecv.call(ws, {data: [3, 71, 111, 100, 32, 109, 111, 100, 101, 58, 32, 79, 78, 0, 0, 0, 0, 0, 0, 64, -100, 69, 103, 111, 100, 109, 111, 100, 101, 95, 116, 111, 103, 103, 108, 101, 0]}); // God mode: ON // godmode_toggle
                //ws.realRecv.call(ws, {data: [3, 84, 104, 101, 32, 70, 97, 108, 108, 101, 110, 32, 79, 118, 101, 114, 108, 111, 114, 100, 32, 104, 97, 115, 32, 115, 112, 97, 119, 110, 101, 100, 33, 0, 0, 0, 0, 0, 0, 64, 28, 70, 0]}); // The Fallen Overlord has spawned!
                //ws.realRecv.call(ws, {data: [3, 84, 104, 101, 32, 70, 97, 108, 108, 101, 110, 32, 79, 118, 101, 114, 108, 111, 114, 100, 32, 104, 97, 115, 32, 98, 101, 101, 110, 32, 100, 101, 102, 101, 97, 116, 101, 100, 32, 98, 121, 32, -58, -99, -61, -104, -58, -84, 32, -58, -92, -58, -90, -30, -104, -81, 33, 0, 0, 0, 0, 0, 0, 64, 28, 70, 0]}); // The Fallen Overlord has been defeated by <name>!
                notification("Switching to Arena Closer", 255, 0, 0, 5000, "switchtank_info");
                break;
            }
            case 70: // F
            {
                if (event.shiftKey) // WARNING: DO NOT SPAM OR THE PROXY LIST API WILL TEMPORARILY BLOCK THE IP
                {
                    if (ACBots.size === 0)
                    {
                        
                        notification("Arena Closer Bots: ACTIVATED", 255, 0, 0, 5000, "acbots_status");
                        var ws = new WebSocket(mainWS.url);
                        ws.binaryType = "arraybuffer";
                        ws.dontRegister = true;
                        ws.onclose = function(event)
                        {
                            ACBots.delete(this);
                        }
                        ws.onopen = function(event)
                        {
                            ACBots.add(this);
                            this.send(mainWS.joinPacket);
                        }
                    }
                    else
                    {
                        notification("Arena Closer Bots: DEACTIVATED", 255, 0, 0, 5000, "acbots_status");
                        mainWS.ACShooting = false;
                        ACBots.forEach(ws => ws.close());
                    }
                }
                else if (ACBots.size > 0)
                {
                    mainWS.ACShooting = !mainWS.ACShooting;
                    if (mainWS.ACShooting)
                    {
                        ACBots.forEach(bot => {
                            bot.packetSaving = false;
                            var spawnPacket = [2];
                            var spawnName = GM_getValue("ACName", "");
                            for (var i in spawnName) spawnPacket.push(spawnName.charCodeAt(i));
                            spawnPacket.push(0);
                            bot.send(new Int8Array(spawnPacket));

                            bot.leveledUpTimeout = setTimeout(() => {bot.finishedLevelingUp = true; bot.leveledUpTimeout = null;}, 2500);
                        });
                    }
                    else
                    {
                        ACBots.forEach(ws => {
                            clearTimeout(ws.leveledUpTimeout);
                            ws.leveledUpTimeout = null;
                        });
                    }
                }
                break;
            }
            default:
            {
                if (keyCode >= 48 && keyCode <= 57) // 0-9
                {
                    var number = keyCode - 48; // Cannot use event.key and parseInt because shift etc modifiers will change the key, e.g. shift + 1 -> ! even though the keyCode is the same
                    var builds = GM_getValue("builds", new Array(10));

                    if (event.shiftKey)
                    {
                        event.cancelBubble = true;
                        if (!builds[number] || !builds[number].stats)
                        {
                            notification("There is no build in that slot", 0, 0, 255, 5000, "autobuild_loaded");
                        }
                        else
                        {
                            unsafeWindow.input.set_convar("game_stats_build", builds[number].stats);
                            notification("Loaded build" + (builds[number].name ? ": " + builds[number].name : " #" + number.toString()), 0, 0, 255, 5000, "autobuild_loaded");
                        }
                    }
                    else if (event.ctrlKey)
                    {
                        event.cancelBubble = true;
                        if (!builds[number]) builds[number] = {stats: "", name: ""};
                        var build = prompt("Enter the new stats for this autobuild slot", builds[number].stats);
                        if (build !== null)
                        {
                            var stats = "";
                            switch (build.length)
                            {
                                case 0:
                                    build = "00000000";
                                case 8:
                                {
                                    for (let stat in build)
                                    {
                                        stat = parseInt(stat);
                                        let level = parseInt(build[stat], 16); // Smasher classes can have up to 10, use A for 10
                                        if (isNaN(level)) return setTimeout(notification, 0, "Invalid build", 0, 0, 255, 5000, "autobuild_invalid"); // prompt() freezes the game and causes timing issues
                                        stats += (stat + 1).toString().repeat(level); // It's 1-8, not 0-7
                                    }
                                    break;
                                }
                                default:
                                    return setTimeout(notification, 0, "Invalid build", 0, 0, 255, 5000, "autobuild_invalid");
                            }
                            builds[number].stats = stats;
                            GM_setValue("builds", builds);
                            setTimeout(notification, 0, (stats ? "Set" : "Cleared") + " the build" + (builds[number].name ? ": " + builds[number].name : " at slot #" + number.toString()), 0, 0, 255, 5000, "autobuild_set_" + number.toString());
                        }
                    }
                    else if (event.altKey)
                    {
                        event.cancelBubble = true;
                        if (!builds[number]) builds[number] = {stats: "", name: ""};
                        var name = prompt("Enter the new name for this autobuild slot", builds[number].name);
                        if (name !== null)
                        {
                            builds[number].name = name;
                            GM_setValue("builds", builds);
                            setTimeout(notification, 0, (name ? "Set" : "Cleared") + " the name for slot #" + number.toString() + (builds[number].name ? ": " + builds[number].name : ""), 0, 0, 255, 5000, "autobuild_setname_" + number.toString());
                        }
                    }
                }
                break;
            }
        }
    });

    GM_registerMenuCommand('Spoof ping', function() { // Extremely shit
        var ping = prompt("Enter the ping", mainWS.pingSpoof);
        if (typeof ping === "string")
        {
            if (ping.length === 0)
            {
                clearInterval(mainWS.pingSpoofInterval);
                if (mainWS.pingSpoof !== undefined) mainWS.send("\x05"); // Restart the loop
                delete mainWS.pingSpoof;
                delete mainWS.pingSpoofInterval;
                setTimeout(notification, 0, "Ping Spoof: OFF", 0, 0, 255, 5000, "pingspoof_ping");
            }
            else
            {
                ping = parseFloat(ping);
                if (typeof ping === "number")
                {
                    clearInterval(mainWS.pingSpoofInterval);
                    mainWS.pingSpoof = ping;
                    mainWS.pingSpoofInterval = setInterval((mainWS) => {mainWS.realRecv.call(mainWS, {data: [5]}); realSend.call(mainWS, "\x05")}, mainWS.pingSpoof, mainWS);
                    setTimeout(notification, 0, "Ping Spoof: " + mainWS.pingSpoof.toString(), 0, 0, 255, 5000, "pingspoof_ping");
                }
                else
                {
                    setTimeout(notification, 0, "Invalid number", 0, 0, 255, 5000, "pingspoof_invalid");
                }
            }
        }
    });

    GM_registerMenuCommand('Spoof player count', function() {
        var players = prompt("Enter the player count", mainWS.playerSpoof || mainWS.playerCount);
        if (typeof players === "string")
        {
            if (players.length === 0)
            {
                playerCount(mainWS.playerCount);
                delete mainWS.playerSpoof;
                setTimeout(notification, 0, "Player Count Spoof: OFF", 0, 0, 255, 5000, "playercountspoof_players");
            }
            else
            {
                players = parseInt(players, 10);
                if (typeof players === "number")
                {
                    playerCount(players);
                    setTimeout(notification, 0, "Player Count Spoof: " + mainWS.playerSpoof.toString(), 0, 0, 255, 5000, "playercountspoof_players");
                }
                else
                {
                    setTimeout(notification, 0, "Invalid number", 0, 0, 255, 5000, "playercountspoof_invalid");
                }
            }
        }
    });

    GM_registerMenuCommand('Set AC bots name', function() {
        var name = prompt("Enter the name for the AC bots to spawn in with", GM_getValue("ACName", ""));
        if (typeof name === "string")
        {
            GM_setValue("ACName", name);
            setTimeout(notification, 0, name === "" ? "Emptied name" : "Set name to: " + name, 0, 0, 255, 5000, "acbots_name"); // prompt() freezes the game and causes timing issues
            if ((new TextEncoder('utf-8').encode(name)).length > 15) setTimeout(notification, 0, "Warning: Name is too long", 255, 128, 0, 5000, "acbots_name_warning"); // The script won't stop you from trying, but the server automatically truncates the name to 15 bytes
        }
    });
})();