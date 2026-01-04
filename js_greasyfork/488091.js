// ==UserScript==
// @name         Sigmally Modder By ShadowSoftware
// @version      8.5
// @description  Clans Menu
// @author       ShadowSoftware
// @match        *://sigmally.com/*
// @icon         https://raw.githubusercontent.com/Sigmally/SigMod/main/images/sigmodclient2.gif
// @run-at       document-end
// @license      MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/488091/Sigmally%20Modder%20By%20ShadowSoftware.user.js
// @updateURL https://update.greasyfork.org/scripts/488091/Sigmally%20Modder%20By%20ShadowSoftware.meta.js
// ==/UserScript==
(function() {
    let version = 8;
    let cversion = 1.1;
    let storageName = "shadow-setting";
    let logo = "https://i.ibb.co/Hn9qnjm/Sigmod-Logo.png";
    let logoAnim = "https://i.ibb.co/Q8CN5Cj/sigmodclient.gif";

    'use strict';
    let modSettings = localStorage.getItem(storageName);
    if (!modSettings) {
        modSettings = {
            keyBindings: {
                rapidFeed: "w",
                doubleSplit: "d",
                tripleSplit: "f",
                quadSplit: "g",
                freezePlayer: "s",
                verticalSplit: "t",
                doubleTrick: "",
                selfTrick: "",
                toggleMenu: "v",
                location: "y",
                toggleChat: "z",
                toggleNames: "",
                toggleSkins: "",
                toggleAutoRespawn: "",
            },
            freezeType: "press",
            m1: null,
            m2: null,
            mapColor: null,
            nameColor: null,
            gradientName: {
                enabled: false,
                color1: null,
                color2: null,
            },
            borderColor: null,
            foodColor: null,
            cellColor: null,
            mapImageURL: "",
            virusImage: "/assets/images/viruses/2.png",
            skinImage: {
                original: null,
                replaceImg: null,
            },
            Theme: "Dark",
            addedThemes: [],
            savedNames: [],
            AutoRespawn: false,
            tag: "📦",
            chatSettings: {
                limit: 100,
                bgColor: "rgba(0, 0, 0, 0.4)",
                themeColor: "#8a25e5",
                showTime: true,
                showNameColors: true,
                showClientChat: false,
                showChatButtons: true,
                blurTag: false,
                locationText: "{pos}",
            },
            deathScreenPos: "center",
            fps: {
                fpsMode: false,
                hideFood: false,
                showNames: true,
                shortLongNames: false,
                removeOutlines: false,
            },
            removeShopPopup: false,
            playTimer: false,
            autoClaimCoins: false,
        };
        updateStorage();
    } else {
        modSettings = JSON.parse(modSettings);
    }

    function updateStorage() {
        localStorage.setItem(storageName, JSON.stringify(modSettings));
    }

    // remove old storage
    if (localStorage.getItem("settings-sigmod-v7")) localStorage.removeItem("settings-sigmod-v7");
    if (localStorage.getItem("settings-sigmod")) localStorage.removeItem("settings-sigmod");

    function keypress(key, keycode) {
        const keyDownEvent = new KeyboardEvent("keydown", { key: key, code: keycode });
        const keyUpEvent = new KeyboardEvent("keyup", { key: key, code: keycode });

        window.dispatchEvent(keyDownEvent);
        window.dispatchEvent(keyUpEvent);
    }
    function mousemove(sx, sy) {
        const mouseMoveEvent = new MouseEvent("mousemove", { clientX: sx, clientY: sy });
        const canvas = document.getElementById("canvas");
        canvas.dispatchEvent(mouseMoveEvent);
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
        return `${formattedHours}:${minutes} ${ampm}`;
    }

    function noXSS(data) {
        return data
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function parsetxt(val) {
        return /^(?:\{([^}]*)\})?([^]*)/.exec(val)[2].trim();
    }

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(url, options) {
        if (url.includes('auth')) {
            return originalFetch(url, options)
                .then(response => {
                return response.json().then(data => {
                    if (!data.body.user) return;
                    const claim = document.getElementById("free-chest-button");
                    unsafeWindow.user = data.body.user;
                    mods.setProfile(data.body.user);
                    if (modSettings.autoClaimCoins && claim.style.display !== "none") {
                        setTimeout(() => {
                            claim.click();
                        }, 500);
                    }
                    return new Response(JSON.stringify(data), response);
                });
            });
        }
        return originalFetch.apply(this, arguments);
    };

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function RgbaToHex(code) {
        const rgbaValues = code.match(/\d+/g);
        const [r, g, b] = rgbaValues.slice(0, 3);
        return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`;
    }

    function menuClosed() {
        const menuWrapper = document.getElementById("menu-wrapper");

        return menuWrapper.style.display === "none";
    }

    function isDeath() {
        const __line2 = document.getElementById("__line2");
        return !__line2.classList.contains("line--hidden");
    }

    function getGameMode() {
        const gameMode = document.getElementById("gamemode")
        const options = Object.values(gameMode.querySelectorAll("option"))
        const selectedOption = options.filter((option) => option.value === gameMode.value)[0]
        const serverName = selectedOption.textContent.split(" ")[0]

        return serverName
    }

 

    function minimapUpdate() {
        setInterval(() => {
            if (isDeath()) return;
            const miniMap = mods.canvas;
            const border = mods.border;
            const ctx = miniMap.getContext("2d");
            ctx.clearRect(0, 0, miniMap.width, miniMap.height);

            if (!menuClosed()) {
                ctx.clearRect(0, 0, miniMap.width, miniMap.height);
                return;
            }

            for (const miniMapData of client.miniMapData) {
                if (!border.width) break

                if (miniMapData[2] === null || miniMapData[3] === client.id) continue;
                if (!miniMapData[0] && !miniMapData[1]) {
                    ctx.clearRect(0, 0, miniMap.width, miniMap.height);
                    continue;
                }

                const fullX = miniMapData[0] + border.width / 2
                const fullY = miniMapData[1] + border.width / 2
                const x = (fullX / border.width) * miniMap.width
                const y = (fullY / border.width) * miniMap.height

                ctx.fillStyle = "#3283bd"
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();


                const minDist = (y - 15.5);
                const nameYOffset = minDist <= 1 ? - (4.5) : 10;

                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.font = "9px Ubuntu";
                ctx.fillText(miniMapData[2], x, y - nameYOffset);
            }
        }, 500);
    }

    // EU server
    const coordinates = {};
    const gridSize = 4500;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const label = String.fromCharCode(65 + i) + (j + 1);

            const minX = -11000 + (i * gridSize);
            const minY = -11000 + (j * gridSize);
            const maxX = -6500 + (i * gridSize);
            const maxY = -6500 + (j * gridSize);

            coordinates[label] = {
                min: {
                    x: minX,
                    y: minY
                },
                max: {
                    x: maxX,
                    y: maxY
                }
            };
        }
    }

    // US1; US2 servers
    const coordinates2 = {};
    const gridSize2 = 7000;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const label = String.fromCharCode(65 + i) + (j + 1);

            const minX = -17022 + (i * gridSize2);
            const minY = -17022 + (j * gridSize2);
            const maxX = -10000 + (i * gridSize2);
            const maxY = -10000 + (j * gridSize2);

            coordinates2[label] = {
                min: {
                    x: minX,
                    y: minY
                },
                max: {
                    x: maxX,
                    y: maxY
                }
            };
        }
    }

    // This following external script is safe (msgpack-lite) "Fast Pure JavaScript MessagePack Encoder and Decoder".
    // msgpack-lite Repository: github.com/kawanet/msgpack-lite; npm: https://www.npmjs.com/package/msgpack-lite
    let client = null;
    let msgpackloaded = false;
    fetch("https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js")
        .then((res) => res.text())
        .then((script) => {
        const executeScript = new Function(script);
        executeScript();
        msgpackloaded = true;
    });

    let miniMapReseted = false

    class modClient {
        constructor() {
            this.ws = null;
            this.wsUrl = "wss://app.czrsd.com/sigmod/ws";
            this.readyState = null;

            this.miniMapData = [];
            this.id = Math.abs(~~(Math.random() * 9e10));

            this.connect();
        }

        connect() {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.binaryType = "arraybuffer";

            this.ws.addEventListener("open", this.onOpen.bind(this));
            this.ws.addEventListener("close", this.onClose.bind(this));
            this.ws.addEventListener("message", this.onMessage.bind(this));
            this.ws.addEventListener("error", this.onError.bind(this));
        }
        close() {
            console.log(this.ws);
            if (this.ws) {
                this.ws.close();
                this.readyState = 3;
            }
        }

        onOpen(event) {
            console.log("WebSocket connection opened.");

            this.readyState = 1;

            const tagElement = document.querySelector("#tag");
            const tagText = document.querySelector(".tagText");

            const sendStartData = setInterval(() => {
                setTimeout(() => {
                    clearInterval(sendStartData);
                }, 1000);
                if (!msgpackloaded) return;
                this.send({
                    type: "server-changed",
                    content: getGameMode()
                });
                this.send({
                    type: "version",
                    content: cversion,
                });

                function getTagFromUrl() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const tagValue = urlParams.get('tag');

                    return tagValue ? tagValue.replace(/\/$/, '') : null;
                }

                const tagValue = getTagFromUrl();

                if (tagValue !== null) {
                    modSettings.tag = tagValue;
                    updateStorage();
                    tagElement.value = tagValue;
                    tagText.innerText = `Tag: ${tagValue}`;
                    this.send({
                        type: "update-tag",
                        content: modSettings.tag,
                    });
                }

                if (modSettings.tag && tagValue == null) {
                    tagElement.value = modSettings.tag;
                    tagText.innerText = `Tag: ${modSettings.tag}`;
                    this.send({
                        type: "update-tag",
                        content: modSettings.tag,
                    });
                }

                clearInterval(sendStartData);
            });
        }

        onClose(event) {
            this.readyState = 3;
            const message = document.createElement("div");
            message.classList.add("error-message_sigMod")
            message.innerHTML = `
                <img src="https://w7.pngwing.com/pngs/93/531/png-transparent-discord-computer-icons-logo-discord-logo-smiley-discord-thumbnail.png" width="38" draggable="false">
                <span class="text" style="color: #000; user-select: auto;">You Joined Best Clan ?  <a href="https://discord.gg/D3FZvNGK" target="_blank">Click And Join</a>. </span>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <button class="btn" id="close-error-message_sigMod" style="color: #000;">X</button>
                </div>
            `;

            setTimeout(() => {
                message.style.right = "20px";
            }, 200)

            document.querySelector(".body__inner").append(message)

            const close = document.getElementById("close-error-message_sigMod");
            const refresh = document.getElementById("refresh-error-message_sigMod");
            close.addEventListener("click", () => {
                message.style.right = "-500px";
                setTimeout(() => {
                    message.remove();
                }, 500)
            });
            refresh.addEventListener("click", () => {
                this.connect();
                message.style.right = "-500px";
                setTimeout(() => {
                    message.remove();
                }, 500)
            });
        }

        onMessage(event) {
            const message = unsafeWindow.msgpack.decode(new Uint8Array(event.data));

            if (message.type === "ping") {
                mods.ping.end = Date.now();
                mods.ping.latency = mods.ping.end - mods.ping.start;
                document.getElementById("clientPing").innerHTML = `Client Ping: ${mods.ping.latency}ms`;
            }

            if (message.type === "minimap-data") {
                this.miniMapData = message.content;
            }

            if (message.type === "chat-message") {
                let content = message.content;
                if (content) {
                    let admin = content.admin;
                    let mod = content.mod;
                    let vip = content.vip;
                    let name = content.nickname;
                    let chatMessage = content.text;
                    let color = content.color || "";

                    if (admin) name = "[Owner] " + name;
                    if (mod) name = "[Mod] " + name;
                    if (vip) name = "[VIP] " + name;
                    if (name === "") name = "Unnamed";
                    name = parsetxt(name);

                    mods.updateChat({
                        admin,
                        mod,
                        color,
                        name,
                        message: chatMessage,
                        time: modSettings.chatSettings.showTime ? Date.now() : null,
                    });
                }
            }

            if (message.type === "update-available") {
                console.log("New update available.");
                const modAlert = document.createElement("div");
                modAlert.classList.add("modAlert");
                modAlert.innerHTML = `
                    <span>You are using an old mod version. Please update.</span>
                    <div class="flex" style="align-items: center; gap: 5px;">
                        <button id="updateMod" class="modButton" style="width: 100%">Update</button>
                    </div>
                `;
                document.body.append(modAlert);

                document.getElementById("updateMod").addEventListener("click", () => {
                    window.open(message.content);
                    modAlert.remove();
                });
            }

            // Tournaments //
            if (message.type === "tournament-preview") {
                mods.showTournament(message.content);
                mods.tData = message.content;
            }
            if (message.type === "t-ready") {
                const content = message.content;
                const readyText = document.getElementById("t-ready-0");
                if (readyText) {
                    readyText.innerText = content;
                }
            }
            if (message.type === "tournament-go") {
                mods.startTournament();
            }
            if (message.type === "get-score") {
                mods.getScore(message.content);
            }
            if (message.type === "user-died") {
                const { dead, max } = message.content;
                document.getElementById("usersDead").textContent = `(${dead}/${max})`;
            }
            if (message.type === "round-end") {
                mods.roundEnd(message.content);
            }
            if (message.type === "round-ready") {
                const text = document.getElementById("round-ready");
                text.textContent = `Ready (${message.content.ready}/${message.content.max})`;
            }
            if (message.type === "next-round") {
                mods.nextRound(message.content);
            }
            if (message.type === "tournament-end") {
                mods.endTournament(message.content);
            }
        }

        onError(event) {
            console.error("WebSocket error. More details: ", event);
        }

        send(data) {
            if (!msgpackloaded || !data || this.readyState !== 1) return;
            const msg = unsafeWindow.msgpack.encode(data);
            this.ws.send(msg);
        }
    }

    const __buf = new DataView(new ArrayBuffer(8))
    function Writer(littleEndian) {
        this._e = littleEndian;
        this.reset();
        return this;
    }

    Writer.prototype = {
        writer: true,
        reset: function (littleEndian) {
            this._b = [];
            this._o = 0;
        },
        setUint8: function (a) {
            if (a >= 0 && a < 256) this._b.push(a);
            return this;
        },
        setInt8: function (a) {
            if (a >= -128 && a < 128) this._b.push(a);
            return this;
        },
        setUint16: function (a) {
            __buf.setUint16(0, a, this._e);
            this._move(2);
            return this;
        },
        setInt16: function (a) {
            __buf.setInt16(0, a, this._e);
            this._move(2);
            return this;
        },
        setUint32: function (a) {
            __buf.setUint32(0, a, this._e);
            this._move(4);
            return this;
        },
        setInt32: function (a) {
            __buf.setInt32(0, a, this._e);
            this._move(4);
            return this;
        },
        setFloat32: function (a) {
            __buf.setFloat32(0, a, this._e);
            this._move(4);
            return this;
        },
        setFloat64: function (a) {
            __buf.setFloat64(0, a, this._e);
            this._move(8);
            return this;
        },
        _move: function (b) {
            for (let i = 0; i < b; i++) this._b.push(__buf.getUint8(i));
        },
        setStringUTF8: function (s) {
            const bytesStr = unescape(encodeURIComponent(s));
            for (let i = 0, l = bytesStr.length; i < l; i++)
                this._b.push(bytesStr.charCodeAt(i));
            this._b.push(0);
            return this;
        },
        build: function () {
            return new Uint8Array(this._b);
        },
    };

    function Reader(view, offset, littleEndian) {
        this._e = littleEndian;
        if (view) this.repurpose(view, offset);
    }

    Reader.prototype = {
        reader: true,
        repurpose: function (view, offset) {
            this.view = view;
            this._o = offset || 0;
        },
        getUint8: function () {
            return this.view.getUint8(this._o++, this._e);
        },
        getInt8: function () {
            return this.view.getInt8(this._o++, this._e);
        },
        getUint16: function () {
            return this.view.getUint16((this._o += 2) - 2, this._e);
        },
        getInt16: function () {
            return this.view.getInt16((this._o += 2) - 2, this._e);
        },
        getUint32: function () {
            return this.view.getUint32((this._o += 4) - 4, this._e);
        },
        getInt32: function () {
            return this.view.getInt32((this._o += 4) - 4, this._e);
        },
        getFloat32: function () {
            return this.view.getFloat32((this._o += 4) - 4, this._e);
        },
        getFloat64: function () {
            return this.view.getFloat64((this._o += 8) - 8, this._e);
        },
        getStringUTF8: function (decode = true) {
            let bytes = [];
            let b;
            while ((b = this.view.getUint8(this._o++)) !== 0)
                bytes.push(b);

            let uint8Array = new Uint8Array(bytes);
            let decoder = new TextDecoder('utf-8');
            let s = decoder.decode(uint8Array);

            return decode ? s : uint8Array;
        },


        raw: function (len = 0) {
            const buf = this.view.buffer.slice(this._o, this._o + len);
            this._o += len;
            return buf;
        },
    };

    let sendChat = null;
    let activeCellY = null;
    let activeCellX = null;
    let sendingPos = false;
    let _getScore = false;
    let lastScore = 0;
    let myId = null;

    function getWs() {
        unsafeWindow.socket = null;

        const oldSend = WebSocket.prototype.send;

        function wsSend(data) {
            if (data.build) unsafeWindow.socket.send(data.build());
            else unsafeWindow.socket.send(data);
        }

        sendChat = function sendChat(text) {
            const writer = new Writer();
            writer.setUint8(C[0x63]);
            writer.setUint8(0);
            writer.setStringUTF8(text);
            wsSend(writer);
        };

        function bytesToHex(r, g, b) {
            return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
        }

        const C = new Uint8Array(256);
        const R = new Uint8Array(256);

        let handshake = false;

        WebSocket.prototype.send = function (data) {
            if (!unsafeWindow.socket) {
                unsafeWindow.socket = this;

                unsafeWindow.socket.addEventListener("close", () => {
                    unsafeWindow.socket = null;
                    handshake = false;

                    const chatMessages = document.getElementById("mod-messages");
                    if (chatMessages) chatMessages.innerHTML = "";
                });

                this.addEventListener("message", (event) => {
                    Reader.prototype.reader = true;

                    const reader = new Reader(new DataView(event.data), 0, true);

                    if (!handshake) {
                        const ver = reader.getStringUTF8(false);

                        C.set(new Uint8Array(reader.raw(256)));

                        for (const i in C) R[C[i]] = ~~i;

                        handshake = true;

                        return;
                    }

                    const r = reader.getUint8();

                    switch (R[r]) {
                        case 0x10: {
                            let count = reader.getUint16();

                            for (let i = 0; i < count; i++) {
                                let killer = reader.getUint32();
                                let killed = reader.getUint32();
                            }

                            for (let i = 0; i < count; i++) {
                                let id = reader.getUint32();
                                if (id === 0) break;

                                let x = reader.getInt16();
                                let y = reader.getInt16();
                                let s = reader.getUint16();

                                let flags = reader.getUint8();
                                let updColor = !!(flags & 0x02);
                                let updSkin = !!(flags & 0x04);
                                let updName = !!(flags & 0x08);
                                let isUpdate = reader.getUint8() === 0;
                                let isPlayer = !!reader.getUint8();
                                let isSub = !!reader.getUint8();
                                let clan = reader.getStringUTF8();

                                let color = updColor
                                ? bytesToHex(reader.getUint8(), reader.getUint8(), reader.getUint8())
                                : null;
                                let skin = updSkin ? reader.getStringUTF8() : null;
                                let name = updName ? reader.getStringUTF8() : null;

                                if (isDeath()) {
                                    activeCellX = null;
                                    activeCellY = null;
                                    if (sendingPos) {
                                        client.send({
                                            type: "minimap-update",
                                            content: [null, null, null, client.id],
                                        });
                                        sendingPos = false;
                                    }
                                    return;
                                }

                                if (id !== myId) return;
                                activeCellX = x;
                                activeCellY = y;

                                if (!sendingPos) sendingPos = true;

                                client.send({
                                    type: "minimap-update",
                                    content: [activeCellX, activeCellY, mods.nick, client.id],
                                });
                            }
                        }
                            break;
                        case 0x20: {
                            // new cell from me
                            const id = reader.getUint32();
                            myId = id;
                        }
                            break;

                        case 0x63: {
                            // chat message
                            const flags = reader.getUint8();
                            const color = bytesToHex(
                                reader.getUint8(),
                                reader.getUint8(),
                                reader.getUint8()
                            );
                            let name = reader.getStringUTF8();
                            const message = reader.getStringUTF8();

                            const server = !!(flags & 0x80);
                            const admin = !!(flags & 0x40);
                            const mod = !!(flags & 0x20);

                            if (server && name !== 'SERVER') name = '[SERVER]';
                            if (admin) name = '[ADMIN] ' + name;
                            if (mod) name = '[MOD] ' + name;
                            if (name === "") name = "Unnamed";
                            name = parsetxt(name);

                            if (modSettings.chatSettings.showClientChat) return;
                            mods.updateChat({
                                server,
                                admin,
                                mod,
                                color: modSettings.chatSettings.showNameColors ? color : "#fafafa",
                                name: name,
                                message,
                                time: modSettings.chatSettings.showTime ? Date.now() : null,
                            });
                            break;
                        }
                        case 0x40: {
                            const border = mods.border;

                            mods.border.left = reader.getFloat64();
                            mods.border.top = reader.getFloat64();
                            mods.border.right = reader.getFloat64();
                            mods.border.bottom = reader.getFloat64();

                            border.width = border.right - border.left;
                            border.height = border.bottom - border.top;
                            border.centerX = (border.left + border.right) / 2;
                            border.centerY = (border.top + border.bottom) / 2;

                            unsafeWindow.border = { ...border };
                        }
                            break;
                    }
                });
            }

            return oldSend.apply(this, arguments);
        };
    }


    setTimeout(() => {
        const gameSettings = document.querySelector(".checkbox-grid");
        gameSettings.innerHTML += `
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="showNames">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Names</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="showSkins">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Skins</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="autoRespawn">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Auto Respawn</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="removeShopPopup">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Remove shop popup</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="autoClaimCoins">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Auto claim coins</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="showPosition">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Position</label>
                    </div>
                  </div>
                </li>
                `;

        let autoRespawn = document.getElementById("autoRespawn");
        let autoRespawnEnabled = false;
        autoRespawn.addEventListener("change", () => {
            if(!autoRespawnEnabled) {
                modSettings.AutoRespawn = true;
                updateStorage();
                autoRespawnEnabled = true;
            } else {
                modSettings.AutoRespawn = false;
                updateStorage();
                autoRespawnEnabled = false;
            }
        });

        if(modSettings.AutoRespawn) {
            autoRespawn.checked = true;
            autoRespawnEnabled = true;
        }
    });

    function loadVirusImage(img) {
        const replacementVirus = new Image();
        replacementVirus.src = img;
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

        CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
            if (image instanceof HTMLImageElement && image.src.includes("2.png")) {
                originalDrawImage.call(this, replacementVirus, ...args);
            } else {
                originalDrawImage.apply(this, arguments);
            }
        };
    }

    function loadSkinImage(skin, img) {
        const replacementSkin = new Image();
        replacementSkin.src = img;
        const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

        CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
            if (image instanceof HTMLImageElement && image.src.includes(`${skin}.png`)) {
                originalDrawImage.call(this, replacementSkin, ...args);
            } else {
                originalDrawImage.apply(this, arguments);
            }
        };
    }

    const getEmojis = async () => {
        const response = await fetch("https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json");
        const emojis = await response.json();

        // Add more objects if u want:
        emojis.push(
            {
                "emoji": "❤",
                "description": "Default heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
            {
                "emoji": "🧡",
                "description": "Orange heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
            {
                "emoji": "💛",
                "description": "Yellow heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
            {
                "emoji": "💚",
                "description": "Green heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
            {
                "emoji": "💙",
                "description": "Blue heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
            {
                "emoji": "💜",
                "description": "Purple heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
            {
                "emoji": "🤎",
                "description": "Brown heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
            {
                "emoji": "🖤",
                "description": "Black heart",
                "category": "Smileys & Emotion",
                "tags": ["heart", "love"],
            },
        );

        return emojis;
    };


    function mod() {
        this.Username = "Guest";
        this.splitKey = {
            keyCode: 32,
            code: "Space",
            cancelable: true,
            composed: true,
            isTrusted: true,
            which: 32,
        }
        this.border = {};
        this.currentTag = null;
        this.nick = null;

        this.ping = {
            latency: NaN,
            intervalId: null,
            start: null,
            end: null,
        }

        this.tData = {};

        this.load();
    }

    mod.prototype = {
        get style() {
            return `
        :root {
             --default-mod-color: #2E2D80;
        }
        .mod_menu * {
            margin: 0;
            padding: 0;
            font-family: 'Ubuntu';
            box-sizing: border-box;
        }

        .mod_menu {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, .6);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            transition: all .3s ease;
        }
        #menu-wrapper>.menu-center {
            height: 728px !important;;
            display: flex !important;;
            flex-direction: column !important;;
            justify-content: space-between !important;;
            padding: 20px !important;;
        }
        .mod_menu_wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 700px;
            height: 500px;
            background: #111;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 10px #000;
        }

        .mod_menu_header {
            display: flex;
            width: 100%;
            position: relative;
            height: 60px;
        }

        .mod_menu_header .header_img {
            width: 100%;
            height: 60px;
            object-fit: cover;
            object-position: center;
            position: absolute;
        }

        .mod_menu_header button {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: 10px;
            top: 30px;
            background: rgba(11, 11, 11, .7);
            width: 42px;
            height: 42px;
            font-size: 16px;
            transform: translateY(-50%);
        }

        .mod_menu_header button:hover {
            background: rgba(11, 11, 11, .5);
        }

        .mod_menu_inner {
            display: flex;
        }

        .mod_menu_navbar {
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 132px;
            padding: 10px;
            background: #181818;
            height: 440px;
        }

        .mod_nav_btn {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            padding: 5px;
            background: #050505;
            border-radius: 8px;
            font-size: 16px;
            border: 1px solid transparent;
            outline: none;
            width: 100%;
            transition: all .3s ease;
        }

        .mod_nav_btn:nth-child(8) {
            margin-top: auto;
        }

        .mod_selected {
            border: 1px solid rgba(89, 89, 89, .9);
        }

        .mod_nav_btn img {
            width: 22px;
        }

        .mod_menu_content {
            width: 100%;
            padding: 10px;
        }

        .mod_tab {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 5px;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: 420px;
            opacity: 1;
            transition: all .2s ease;
        }

        .text-center {
            text-align: center;
        }
        .f-big {
            font-size: 18px;
        }

        .modColItems {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            width: 100%;
        }

        .modRowItems {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #050505;
            gap: 58px;
            border-radius: 0.5rem;
            padding: 10px;
            width: 100%;
        }

        input[type=range] {
            -webkit-appearance: none;
            height: 22px;
            background: transparent;
            cursor: pointer;
        }

        input[type=range]::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            background: #542499;
            height: 4px;
            border-radius: 6px;
        }
        input[type=range]::-webkit-slider-thumb {
            appearance: none;
            background: #6B32BD;
            height: 16px;
            width: 16px;
            position: relative;
            top: -5px;
            border-radius: 50%;
        }

        input:focus, select:focus, button:focus{
             outline: none;
        }
        .flex {
             display: flex;
        }
        .centerX {
             display: flex;
             justify-content: center;
        }
        .centerY {
             display: flex;
             align-items: center;
        }
        .centerXY {
             display: flex;
             align-items: center;
             justify-content: center
        }
        .f-column {
             display: flex;
             flex-direction: column;
        }
        .macros_wrapper {
            display: flex;
            width: 100%;
            justify-content: center;
            flex-direction: column;
            gap: 10px;
            background: #050505;
            padding: 10px;
            border-radius: 0.75rem;
        }
        .macro_grid {
            display: grid;
            grid-template-columns: 1.2fr 1.1fr;
            gap: 5px;
        }
        .g-2 {
            gap: 2px;
        }
        .g-5 {
            gap: 5px;
        }
        .g-10 {
            gap: 10px;
        }
        .p-2 {
            padding: 2px;
        }
        .macrosContainer {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }
        .macroRow {
            background: #121212;
            border-radius: 5px;
            padding: 7px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
        .keybinding {
            border-radius: 5px;
            background: #242424;
            border: none;
            color: #fff;
            padding: 2px 5px;
            max-width: 50px;
            font-weight: 500;
            text-align: center;
        }
        .hidden {
             display: none;
        }
        #text-block,#left_ad_block,#ad_bottom,.ad-block,.ad-block-left,.ad-block-right {
             display: none;
        }
        .SettingsTitle{
             font-size: 32px;
             color: #EEE;
             margin-left: 10px;
        }
        .CloseBtn{
             width: 46px;
             background-color: transparent;
        }
        .select-btn {
            padding: 15px 20px;
            background: #222;
            border-radius: 2px;
            position: relative;
        }

        .select-btn:active {
            scale: 0.95
        }

        .select-btn::before {
            content: "...";
            font-size: 20px;
            color: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
         .text {
             user-select: none;
             font-weight: 500;
             text-align: left;
        }
         .modButton{
             background-color: #333;
             border-radius: 5px;
             color: #fff;
             transition: all .3s;
             outline: none;
             padding: 5px;
             font-size: 13px;
             border: none;
        }
         .modButton:hover {
             background-color: #222
        }
         .modInput {
             background-color: #111;
             border: none;
             border-radius: 5px;
             position: relative;
             border-top-right-radius: 4px;
             border-top-left-radius: 4px;
             font-weight: 500;
             padding: 5px;
             color: #fff;
        }

        .modCheckbox input[type="checkbox"] {
             display: none;
             visibility: hidden;
        }
        .modCheckbox label {
          display: inline-block;
        }

        .modCheckbox .cbx {
          position: relative;
          top: 1px;
          width: 17px;
          height: 17px;
          margin: 2px;
          border: 1px solid #c8ccd4;
          border-radius: 3px;
          vertical-align: middle;
          transition: background 0.1s ease;
          cursor: pointer;
        }

        .modCheckbox .cbx:after {
          content: '';
          position: absolute;
          top: 1px;
          left: 5px;
          width: 5px;
          height: 11px;
          opacity: 0;
          transform: rotate(45deg) scale(0);
          border-right: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transition: all 0.3s ease;
          transition-delay: 0.15s;
        }

        .modCheckbox input[type="checkbox"]:checked ~ .cbx {
          border-color: transparent;
          background: #6871f1;
          box-shadow: 0 0 10px #2E2D80;
        }

        .modCheckbox input[type="checkbox"]:checked ~ .cbx:after {
          opacity: 1;
          transform: rotate(45deg) scale(1);
        }

         .SettingsButton{
             border: none;
             outline: none;
             margin-right: 10px;
             transition: all .3s ease;
        }
         .SettingsButton:hover {
             scale: 1.1;
        }
         .colorInput{
             background-color: transparent;
             width: 33px;
             height: 35px;
             border-radius: 50%;
             border: none;
        }
         .colorInput::-webkit-color-swatch {
             border-radius: 50%;
             border: 2px solid #fff;
        }
        .whiteBorder_colorInput::-webkit-color-swatch {
            border-color: #fff;
        }
        #dclinkdiv {
            display: flex;
            flex-direction: row;
            height: 280px;
        }
         .dclinks {
             width: calc(100% - 5px);
             height: 36px;
             display: flex;
             justify-content: center;
             align-items: center;
             background-color: rgba(88, 101, 242, 1);
             border-radius: 6px;
             margin: 0 auto;
             color: #fff;
        }
         #cm_close__settings {
             width: 50px;
             transition: all .3s ease;
        }
         #cm_close__settings svg:hover {
             scale: 1.1;
        }
         #cm_close__settings svg {
             transition: all .3s ease;
        }
         .modTitleText {
             text-align: center;
             font-size: 16px;
        }
        .modItem {
             display: flex;
             justify-content: center;
             align-items: center;
             flex-direction: column;
        }
         .mod_tab-content {
             width: 100%;
             margin: 10px;
             overflow: auto;
             display: flex;
             flex-direction: column;
        }

        #Tab6 .mod_tab-content {
             overflow-y: auto;
             max-height: 230px;
             display: flex;
             flex-wrap: nowrap;
             flex-direction: column;
             gap: 10px;
        }

        .tab-content, #coins-tab, #chests-tab {
            overflow-x: hidden;
            justify-content: center;
        }

        #shop-skins-buttons::after {
            background: #050505;
        }

         .w-100 {
             width: 100%
        }
         .btn:hover {
             color: unset;
        }

        #savedNames {
            background-color: #000;
            padding: 5px;
            border-radius: 5px;
            overflow-y: auto;
            height: 155px;
            background-image: url("https://raw.githubusercontent.com/Sigmally/SigMod/main/images/purple_gradient.png");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            box-shadow: 0 0 10px #000;
        }

        .scroll::-webkit-scrollbar {
            width: 7px;
        }
        .scroll::-webkit-scrollbar-track {
            background: #222;
            border-radius: 5px;
        }
        .scroll::-webkit-scrollbar-thumb {
            background-color: #333;
            border-radius: 5px;
        }
        .scroll::-webkit-scrollbar-thumb:hover {
            background: #353535;
        }

        .themes {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 420px;
            background: #000;
            border-radius: 5px;
            overflow-y: scroll;
            gap: 10px;
            padding: 5px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .themeContent {
          width: 50px;
          height: 50px;
          border: 2px solid #222;
          border-radius: 50%;
          background-position: center;
        }

        .theme {
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
        }
         .delName {
             font-weight: 500;
             background: #e17e7e;
             height: 20px;
             border: none;
             border-radius: 5px;
             font-size: 10px;
             margin-left: 5px;
             color: #fff;
             display: flex;
             justify-content: center;
             align-items: center;
             width: 20px;
        }
         .NameDiv {
             display: flex;
             background: #111;
             border-radius: 5px;
             margin: 5px;
             padding: 3px 8px;
             height: 34px;
             align-items: center;
             justify-content: space-between;
             cursor: pointer;
             box-shadow: 0 5px 10px -2px #000;
        }
        .NameLabel {
            cursor: pointer;
            font-weight: 500;
            text-align: center;
            color: #fff;
        }
        .resetButton {
            width: 25px;
            height: 25px;
            background-image: url("https://raw.githubusercontent.com/Sigmally/SigMod/main/images/reset.svg");
            background-color: transparent;
            border: none;
        }

        .modAlert {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99995;
            background: #3F3F3F;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 10px;
            color: #fff;
        }

        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        .tournamentAlert {
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99995;
            background: url("https://app.czrsd.com/static/tournament_winteredition.png");
            background-size: cover;
            background-position: center;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px #4e7ed5;
        }
        .tournamentAlert * {
            font-family: 'Poppins', sans-serif;
        }
        .tournamentAlert__inner {
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            color: #fff;
            padding: 10px;
            border-radius: 10px;
        }
        .tournamentAlert .tHeader span {
            font-size: 16px;
            font-weight: 600;
        }
        .tournamentAlert p {
            text-align: center;
        }
        .tournamentAlert .tHeader button {
            background: #C13939;
            border: none;
            border-radius: 50%;
            height: 32px;
            width: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease-in-out;
        }
        .tournamentAlert .tHeader button:hover {
            background: #e05151;
            scale: 1.05;
            box-shadow: 0 0 10px #e05151;
        }

        .tournamentAlert::after {
            content: '';
            width: 102%;
            height: 100%;
            position: absolute;
            top: 0;
            left: -2px;
            background: rgba(0, 0, 0, .8);
            z-index: -1;
        }

        .tournamentAlert .tFooter img {
            width: 50px;
            height: 50px;
            border-radius: 100%;
        }

        .tournamentAlert .tFooter button {
            background: #0057FF;
            border: none;
            border-radius: 20px;
            padding: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease-in-out;
        }

        .tournamentAlert .tFooter button:hover {
            background: #0077ff;
            scale: 1.1;
            box-shadow: 0 0 10px #0077ff;
        }

        .alert_overlay {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9999999;
            pointer-events: none;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
        }

        .infoAlert {
            padding: 5px;
            border-radius: 5px;
            margin-top: 5px;
            color: #fff;
        }

        .modAlert-success {
            background: #39d73c;
        }
        .modAlert-success .alert-loader {
            background: #2a971f;
        }
        .modAlert-default {
            background: #151515;
        }
        .modAlert-default .alert-loader {
            background: #222;
        }
        .modAlert-danger {
            background: #D44121;
        }
        .modAlert-danger .modAlert-loader {
            background: #A5361E;
        }
        #free-coins .modAlert-danger {
            background: #fff !important;
        }

        .modAlert-loader {
            width: 100%;
            height: 2px;
            margin-top: 5px;
            transition: all .3s ease-in-out;
            animation: loadAlert 2s forwards;
        }

        @keyframes loadAlert {
            0% {
                width: 100%;
            }
            100% {
                width: 0%;
            }
        }


        .themeEditor {
            z-index: 999999999999;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, .85);
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 0 10px #000;
            width: 400px;
        }

        .theme_editor_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .theme-editor-tab {
            display: flex;
            justify-content: center;
            align-items: start;
            flex-direction: column;
            margin-top: 10px
        }

        .themes_preview {
            width: 50px;
            height: 50px;
            border: 2px solid #fff;
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modKeybindings {
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            max-height: 170px;
        }
        .modKeybindings > label {
            margin-right: 5px;
        }
        #signInBtn, #nick, #gamemode, #option_0, #option_1, #option_2, .form-control, .profile-header, .coins-num, #clan-members, .member-index, .member-level, #clan-requests {
            background: rgba(0, 0, 0, 0.4) !important;
            color: #fff !important;
        }
        .profile-name, #progress-next, .member-desc > p:first-child, #clan-leave > div, .clans-item > div > b, #clans-input input, #shop-nav button {
            color: #fff !important;
        }
        .head-desc, #shop-nav button {
            border: 1px solid #000;
        }
        #clan-handler, #request-handler, #clans-list, #clans-input, .clans-item button, #shop-content, #shop-nav button:hover, .card-particles-bar-bg {
            background: #111;
            color: #fff !important;
        }
        #clans_and_settings {
            height: auto !important;
        }
        .card-body {
            background: linear-gradient(180deg, #000 0%, #1b354c 100%);
        }
        .free-card:hover .card-body {
            background: linear-gradient(180deg, #111 0%, #1b354c 100%);
        }
        #shop-tab-body, #shop-skins-buttons, #shop-nav {
            background: #050505;
        }
        #clan-leave {
            background: #111;
            bottom: -1px;
        }
        .sent {
            position: relative;
            width: 100px;
        }

        .sent::before {
            content: "Sent request";
            width: 100%;
            height: 10px;
            word-spacing: normal;
            white-space: nowrap;
            position: absolute;
            background: #4f79f9;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .btn, .sign-in-out-btn {
            transition: all .2s ease;
        }
        #clan .connecting__content, #clans .connecting__content {
            background: #151515;
            color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
        }

        .skin-select__icon-text {
            color: #fff;
        }

        .justify-sb {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .macro-extanded_input {
            width: 75px;
            text-align: center;
        }
        #gamemode option {
            background: #111;
        }

        .stats-line {
            width: 100%;
            user-select: none;
            margin-bottom: 5px;
            padding: 5px;
            background: #050505;
            border: 1px solid var(--default-mod);
            border-radius: 5px;
        }
        .my-5 {
            margin: 5px 0;
        }

        .stats-info-text {
            color: #7d7d7d;
        }

        .setting-card-wrapper {
            margin-right: 10px;
            padding: 10px;
            background: #161616;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
        }

        .setting-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .setting-card-action {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
        }

        .setting-card-action {
            width: 100%;
        }

        .setting-card-name {
            font-size: 16px;
            user-select: none;
            width: 100%;
        }

        .mod-small-modal {
            display: flex;
            flex-direction: column;
            gap: 10px;
            position: absolute;
            z-index: 99999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #191919;
            box-shadow: 0 5px 15px -2px #000;
            border: 2px solid var(--default-mod-color);
            padding: 10px;
            border-radius: 5px;
        }

        .mod-small-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .mod-small-modal-header h1 {
            font-size: 20px;
            font-weight: 500;
            margin: 0;
        }

        .mod-small-modal-content {
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
        }

        .mod-small-modal-content_selectImage {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .previmg {
            width: 50px;
            height: 50px;
            border: 2px solid #ccc;
        }

        .stats__item>span, #title, .stats-btn__text {
           color: #fff;
        }

        .top-users__inner::-webkit-scrollbar-thumb {
            border: none;
        }

        .modChat {
            min-width: 450px;
            max-width: 450px;
            min-height: 285px;
            max-height: 285px;
            color: #fafafa;
            padding: 10px;
            position: absolute;
            bottom: 10px;
            left: 10px;
            z-index: 999;
            border-radius: .5rem;
            overflow: hidden;
            opacity: 1;
            transition: all .3s ease;
        }

        .modChat__inner {
            min-width: 430px;
            max-width: 430px;
            min-height: 265px;
            max-height: 265px;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 5px;
            justify-content: flex-end;
            opacity: 1;
            transition: all .3s ease;
        }

        .modchat-chatbuttons {
            margin-bottom: auto;
            display: flex;
            gap: 5px;
        }

        .tagText {
            margin-left: auto;
            font-size: 14px;
        }

        #mod-messages {
            position: relative;
            display: flex;
            flex-direction: column;
            max-height: 185px;
            overflow-y: auto;
            direction: rtl;
            scroll-behavior: smooth;
        }
        .message {
            direction: ltr;
            margin: 2px 0 0 5px;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .message_name {
            user-select: none;
        }

        .message .time {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
        }

        #chatInputContainer {
            display: flex;
            gap: 5px;
            align-items: center;
            padding: 5px;
            background: rgba(25,25,25, .6);
            border-radius: .5rem;
            overflow: hidden;
        }

        .chatInput {
            flex-grow: 1;
            border: none;
            background: transparent;
            color: #fff;
            padding: 5px;
            outline: none;
            max-width: 100%;
        }

        .chatButton {
            background: #8a25e5;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            height: 100%;
            color: #fff;
            transition: all 0.3s;
            cursor: pointer;
            display: flex;
            align-items: center;
            height: 28px;
            justify-content: center;
            gap: 5px;
        }
        .chatButton:hover {
            background: #7a25e5;
        }
        .chatCloseBtn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .emojisContainer {
            flex-direction: column;
            gap: 5px;
        }
        .chatAddedContainer {
            position: absolute;
            bottom: 10px;
            left: 465px;
            z-index: 9999;
            padding: 10px;
            background: #151515;
            border-radius: .5rem;
            min-width: 172px;
            max-width: 172px;
            min-height: 250px;
            max-height: 250px;
        }
        #categories {
            overflow-y: auto;
            max-height: calc(250px - 50px);
            gap: 2px;
        }
        .category {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .category span {
            color: #fafafa;
            font-size: 14px;
            text-align: center;
        }

        .emojiContainer {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
        }

        #categories .emoji {
            padding: 2px;
            border-radius: 5px;
            font-size: 16px;
            user-select: none;
            cursor: pointer;
        }

        .chatSettingsContainer {
            padding: 10px 3px;
        }
        .chatSettingsContainer .scroll {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 235px;
            overflow-y: auto;
            padding: 0 10px;
        }

        .csBlock {
            border: 2px solid #050505;
            border-radius: .5rem;
            color: #fff;
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 5px;
            padding-bottom: 5px;
        }

        .csBlock .csBlockTitle {
            background: #080808;
            width: 100%;
            padding: 3px;
            text-align: center;
        }

        .csRow {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 5px;
            width: 100%;
        }

        .csRowName {
            display: flex;
            gap: 5px;
            align-items: start;
        }

        .csRowName .infoIcon {
            width: 14px;
            cursor: pointer;
        }

        .modInfoPopup {
            position: absolute;
            top: 2px;
            left: 58%;
            text-align: center;
            background: #151515;
            border: 1px solid #607bff;
            border-radius: 10px;
            transform: translateX(-50%);
            white-space: nowrap;
            padding: 5px;
            z-index: 99999;
        }

        .modInfoPopup::after {
            content: '';
            display: block;
            position: absolute;
            bottom: -7px;
            background: #151515;
            right: 50%;
            transform: translateX(-50%) rotate(-45deg);
            width: 12px;
            height: 12px;
            border-left: 1px solid #607bff;
            border-bottom: 1px solid #607bff;
        }

        .modInfoPopup p {
            margin: 0;
            font-size: 12px;
            color: #fff;
        }

        .error-message_sigMod {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 20px;
            right: -500px;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, .8);
            z-index: 9999999;
            width: 400px;
            border-radius: 10px;
            padding: 10px;
            gap: 6px;
            transition: all .3s ease-out;
        }

        .minimapContainer {
            display: flex;
            flex-direction: column;
            align-items: end;
            pointer-events: none;
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 99999;
        }
        .tournament_time {
            color: #fff;
            font-size: 15px;
        }
        .minimap {
            border-radius: 2px;
            border-top: 1px solid rgba(255, 255, 255, .5);
            border-left: 1px solid rgba(255, 255, 255, .5);
            box-shadow: 0 0 4px rgba(255, 255, 255, .5);
        }

        #tag {
            width: 50px;
        }

        .blur {
            color: transparent!important;
            text-shadow: 0 0 5px hsl(0deg 0% 90% / 70%);
            transition: all .2s;
        }

        .blur:focus, .blur:hover {
            color: #fafafa!important;
            text-shadow: none;
        }
        .progress-row button {
            background: transparent;
        }
        .mod_player-stats {
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-self: start;
        }

        .mod_player-stats .player-stats-grid {
            display: grid;
            grid-template-columns: 1.2fr 1.1fr;
            gap: 5px;
        }

        .player-stat {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px;
            background: rgba(05, 05, 05, .75);
            border-radius: 5px;
            width: 100%;
            height: 85px;
            box-shadow: 0px 2px 10px -2px #000;
            z-index: 2;
        }
        .player-stat span[id] {
            font-size: 17px;
        }

        .quickAccess {
            background: #050505;
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 5px;
            border-radius: 5px;
            width: 100%;
            max-height: 154px;
            overflow-y: auto;
        }

        .quickAccess div.modRowItems {
            padding: 2px!important;
        }

        #mod_home .justify-sb {
            z-index: 2;
        }

        .modTitleText {
            font-size: 15px;
            color: #fafafa;
            text-align: start;
        }
        .modDescText {
            text-align: start;
            font-size: 12px;
            color: #777;
        }
        .modButton-secondary {
            background-color: #171717;
            color: #fff;
            border: none;
            padding: 5px 15px;
            border-radius: 15px;
        }
        .vr {
            width: 2px;
            height: 250px;
            background-color: #fafafa;
        }

        .modProfileWrapper {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .modUserProfile {
            display: flex;
            flex-direction: column;
            gap: 7px;
            border-radius: 5px;
            background: #050505;
            min-width: 300px;
            max-width: 300px;
            height: 154px;
            max-height: 154px;
            padding: 5px 10px;
        }

        .modUserProfile .user-level {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .mod-user-level {
            position: relative;
            margin: 0 auto;
            color: #fff;
            text-shadow: 1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
        }
        .brand_wrapper {
            position: relative;
            height: 72px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .brand_img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 72px;
            border-radius: 10px;
            object-fit: cover;
            object-position: center;
            z-index: 1;
            box-shadow: 0 0 10px #000;
        }
        .brand_credits {
            font-size: 16px;
            color: #D3A7FF
        }
        .p_s_n {
            background-color: #050505;
            border-radius: 15px;
            box-shadow: 0 3px 10px -2px #050505;
            margin: 35px 0;
            font-size: 16px;
            width: 50%;
            align-self: center;
        }
        .brand_yt {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
        }
        .yt_wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            width: 122px;
            height: 100px;
            padding: 10px;
            background-color: #B63333;
            border-radius: 15px;
            cursor: pointer;
        }
        .yt_wrapper span {
            user-select: none;
        }

        .hidden_full {
            display: none !important;
            visibility: hidden;
        }

        .mod_overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, .7);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .tournaments-wrapper {
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
            background: #151515;
            box-shadow: 0 5px 10px 2px #000;
            border-radius: 0.75rem;
            padding: 2.25rem;
            color: #fafafa;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            min-width: 632px;
            opacity: 0;
            transition: all .3s ease;
            animation: 0.5s ease fadeIn forwards;
        }
        @keyframes fadeIn {
            0% {
                top: 60%;
                opacity: 0;
            }
            100% {
                top: 50%;
                opacity: 1;
            }
        }
        .tournaments h1 {
            margin: 0;
        }
        .t_profile {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .t_profile img {
            border: 2px solid #ccc;
            border-radius: 50%;
        }
        .team {
            display: flex;
            gap: 10px;
            padding: 10px;
            position: relative;
        }
        .team.blue {
            border-radius: 0 5px 5px 0;
        }
        .team.red {
            border-radius: 5px 0 0 5px;
        }
        .blue {
            background: rgb(71, 113, 203);
        }
        .red {
            background: rgb(203, 71, 71);
        }

        .blue_polygon {
            width: 75px;
            clip-path: polygon(100% 0, 0 0, 100% 100%);
            background: rgb(71, 113, 203);
        }

        .red_polygon {
            width: 75px;
            clip-path: polygon(0 100%, 0 0, 100% 100%);
            background: rgb(203, 71, 71);
        }

        .vs {
            position: relative;
            align-items: center;
            justify-content: center;
        }
        .vs span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-shadow: 1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 0 6px #000;
            font-size: 28px;
        }

        details {
          border: 1px solid #aaa;
          border-radius: 4px;
          padding: 0.5em 0.5em 0;
          user-select: none;
          text-align: start;
        }

        summary {
          font-weight: bold;
          margin: -0.5em -0.5em 0;
          padding: 0.5em;
        }

        details[open] {
          padding: 0.5em;
        }

        details[open] summary {
          border-bottom: 1px solid #aaa;
          margin-bottom: 0.5em;
        }
        button[disabled] {
            filter: grayscale(1);
        }

        .tournament_alert {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #151515;
            color: #fff;
            text-align: center;
            padding: 20px;
            z-index: 999999;
            border-radius: 10px;
            box-shadow: 0 0 10px #000;
            display: flex;
            gap: 10px;
        }
        .tournament-profile {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            box-shadow: 0 0 10px #000;
        }

        .tround_text {
            color: #fff;
            font-size: 24px;
            position: absolute;
            bottom: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .claimedBadgeWrapper {
            background: linear-gradient(232deg, #020405 1%, #04181E 100%);
            border-radius: 10px;
            width: 320px;
            height: 330px;
            box-shadow: 0 0 40px -20px #39bdff;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
            justify-content: center;
            color: #fff;
            padding: 10px;
        }

        .btn-cyan {
            background: #53B6CC;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            color: #fff;
            font-weight: 500;
            width: fit-content;
            padding: 5px 10px;
        }

        .playTimer {
            z-index: 2;
            position: absolute;
            top: 128px;
            left: 4px;
            color: #8d8d8d;
            font-size: 14px;
            font-weight: 500;
            user-select: none;
            pointer-events: none;
        }

            `
        },
        respawnTime: Date.now(),
        respawnCooldown: 1000,
        move(cx, cy) {
            const mouseMoveEvent = new MouseEvent("mousemove", { clientX: cx, clientY: cy });
            const canvas = document.querySelector("canvas");
            canvas.dispatchEvent(mouseMoveEvent);
        },

        game() {
            const { fillRect, fillText, strokeText, moveTo, arc } = CanvasRenderingContext2D.prototype;

            const byId = (id) => document.getElementById(id);

            const mapColor = byId("mapColor");
            const nameColor = byId("nameColor");
            const borderColor = byId("borderColor");
            const foodColor = byId("foodColor");
            const cellColor = byId("cellColor");
            const gradientNameColor1 = byId("gradientNameColor1");
            const gradientNameColor2 = byId("gradientNameColor2");

            const mapColorReset = byId("mapColorReset");
            const nameColorReset = byId("nameColorReset");
            const borderColorReset = byId("borderColorReset");
            const foodColorReset = byId("foodColorReset");
            const cellColorReset = byId("cellColorReset");
            const gradientColorReset1 = byId("gradientColorReset1");
            const gradientColorReset2 = byId("gradientColorReset2");

            let disabledGColors = 0;
            const reset = (type) => {
                const white = "#ffffff";
                switch (type) {
                    case 'map':
                        modSettings.mapColor = null;
                        mapColor.value = white;
                        break;
                    case 'name':
                        modSettings.nameColor = null;
                        nameColor.value = white;
                        break;
                    case 'gradName1':
                        modSettings.gradientName.color1 = null;
                        gradientNameColor1.value = white;
                        if (modSettings.gradientName.color2 === null) {
                            modSettings.gradientName.enabled = false;
                        }
                        break;
                    case 'gradName2':
                        modSettings.gradientName.color2 = null;
                        gradientNameColor2.value = white;
                        if (modSettings.gradientName.color1 === null) {
                            modSettings.gradientName.enabled = false;
                        }
                        break;
                    case 'border':
                        modSettings.borderColor = null;
                        borderColor.value = white;
                        break;
                    case 'food':
                        modSettings.foodColor = null;
                        foodColor.value = white;
                        break;
                    case 'cell':
                        modSettings.cellColor = null;
                        cellColor.value = white;
                        break;
                    case 'skin':
                        modSettings.skinImage.original = null;
                        modSettings.skinImage.replaceImg = null;
                        if (confirm("Please refresh the page to make it work. Reload?")) {
                            location.reload();
                        }
                        break;
                    case 'virus':
                        modSettings.virusImage = "/assets/images/viruses/2.png";
                        if (confirm("Please refresh the page to make it work. Reload?")) {
                            location.reload();
                        }
                        break;
                }
                updateStorage();
            };

            const loadStorage = () => {
                if (modSettings.nameColor) {
                    nameColor.value = modSettings.nameColor;
                }

                if (modSettings.mapColor) {
                    mapColor.value = modSettings.mapColor;
                }

                if (modSettings.borderColor) {
                    borderColor.value = modSettings.borderColor;
                }

                if (modSettings.foodColor) {
                    foodColor.value = modSettings.foodColor;
                }
                if (modSettings.cellColor) {
                    cellColor.value = modSettings.cellColor;
                }

                loadVirusImage(modSettings.virusImage);
                if (modSettings.skinImage.original !== null) {
                    loadSkinImage(modSettings.skinImage.original, modSettings.skinImage.replaceImg);
                }
            };

            loadStorage();

            mapColor.addEventListener("input", () => {
                modSettings.mapColor = mapColor.value;
                updateStorage();
            });
            nameColor.addEventListener("input", () => {
                modSettings.nameColor = nameColor.value;
                updateStorage();
            });
            gradientNameColor1.addEventListener("input", () => {
                if (!modSettings.gradientName.enabled) {
                    modSettings.gradientName.enabled = true;
                }
                modSettings.gradientName.color1 = gradientNameColor1.value;
                updateStorage();
            });
            gradientNameColor2.addEventListener("input", () => {
                modSettings.gradientName.color2 = gradientNameColor2.value;
                updateStorage();
            });
            borderColor.addEventListener("input", () => {
                modSettings.borderColor = borderColor.value;
                updateStorage();
            });
            foodColor.addEventListener("input", () => {
                modSettings.foodColor = foodColor.value;
                updateStorage();
            });
            cellColor.addEventListener("input", () => {
                modSettings.cellColor = cellColor.value;
                updateStorage();
            });

            mapColorReset.addEventListener("click", () => reset("map"));
            borderColorReset.addEventListener("click", () => reset("border"));
            nameColorReset.addEventListener("click", () => reset("name"));
            gradientColorReset1.addEventListener("click", () => reset("gradName1"));
            gradientColorReset2.addEventListener("click", () => reset("gradName2"));
            foodColorReset.addEventListener("click", () => reset("food"));
            cellColorReset.addEventListener("click", () => reset("cell"));

            // Render new colors / images
            CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
                if ((width + height) / 2 === (window.innerWidth + window.innerHeight) / 2) {
                    this.fillStyle = modSettings.mapColor;
                }
                fillRect.apply(this, arguments);
            };


            CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
                if (modSettings.fps.hideFood || modSettings.fps.fpsMode) {
                    if (radius <= 20) {
                        this.fillStyle = "transparent";
                        this.strokeStyle = "transparent";
                    }
                }
                if (radius >= 86) {
                    this.fillStyle = modSettings.cellColor;
                } else if (radius <= 20 && modSettings.foodColor !== null && !modSettings.fps.fpsMode && !modSettings.fps.hideFood) {
                    this.fillStyle = modSettings.foodColor;
                    this.strokeStyle = modSettings.foodColor;
                }

                arc.apply(this, arguments);
            };

            CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {
                if (text === byId("nick").value && !modSettings.gradientName.enabled && modSettings.nameColor !== null) {
                    this.fillStyle = modSettings.nameColor;
                }

                if (text === byId("nick").value && modSettings.gradientName.enabled) {
                    const width = this.measureText(text).width;
                    const fontSize = 8;
                    const gradient = this.createLinearGradient(x - width / 2 + fontSize / 2, y, x + width / 2 - fontSize / 2, y + fontSize);

                    const color1 = modSettings.gradientName.color1 ?? "#ffffff";
                    const color2 = modSettings.gradientName.color2 ?? "#ffffff";

                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(1, color2);

                    this.fillStyle = gradient;
                }


                if (text.startsWith("X:")) {
                    this.fillStyle = "transparent";
                }

                if (modSettings.fps.removeOutlines) {
                    this.shadowBlur = 0;
                    this.shadowColor = "transparent";
                }

                if (text.length > 21 && modSettings.fps.shortLongNames || modSettings.fps.fpsMode) {
                    text = text.slice(0, 21) + "...";
                }

                if (text.includes("Score") && _getScore) {
                    _getScore = false;
                    const currentScore = text.substring(6).replace(/\s/g, '');
                    lastScore = parseInt(currentScore, 10);
                    const scoreText = document.getElementById("t-myScore");
                    if (!scoreText) return;
                    scoreText.textContent = `Your score: ${lastScore}`;
                }

                return fillText.apply(this, arguments);
            };

            CanvasRenderingContext2D.prototype.strokeText = function (text, x, y) {
                if (text.length > 21 && modSettings.fps.shortLongNames || modSettings.fps.fpsMode) {
                    text = text.slice(0, 21) + "...";
                }

                if (modSettings.fps.removeOutlines) {
                    this.shadowBlur = 0;
                    this.shadowColor = "transparent";
                } else {
                    this.shadowBlur = 7;
                    this.shadowColor = '#000';
                }

                return strokeText.apply(this, arguments);
            };

            CanvasRenderingContext2D.prototype.moveTo = function (x, y) {
                this.strokeStyle = modSettings.borderColor;
                return moveTo.apply(this, arguments);
            };

            // Virus & Skin image
            const virusPreview = byId("virus");
            const setVirus = byId("setVirus");
            const virusURL = byId("virusURL");
            const openVirusModal = byId("virusImageSelect");
            const closeVirusModal = byId("closeVirusModal");
            const virusModal = byId("virusModal");
            const resetSkin = byId("resetSkin");
            const resetVirus = byId("resetVirus");

            openVirusModal.addEventListener("click", () => {
                virusModal.style.display = "flex";
            });
            closeVirusModal.addEventListener("click", () => {
                virusModal.style.display = "none";
            });

            setVirus.addEventListener("click", () => {
                modSettings.virusImage = virusURL.value;
                loadVirusImage(modSettings.virusImage);
                updateStorage();
                virusPreview.src = modSettings.virusImage;
            });

            const skinPreview = byId("skinPreview");
            const skinURL = byId("skinURL");
            const setSkin = byId("setSkin");
            const openSkinModal = byId("SkinReplaceSelect");
            const closeSkinModal = byId("closeSkinModal");
            const skinModal = byId("skinModal");
            const originalSkin = byId("originalSkinSelect");

            openSkinModal.addEventListener("click", () => {
                skinModal.style.display = "flex";
            });
            closeSkinModal.addEventListener("click", () => {
                skinModal.style.display = "none";
            });

            setSkin.addEventListener("click", () => {
                modSettings.skinImage.original = originalSkin.value;
                modSettings.skinImage.replaceImg = skinURL.value;
                loadSkinImage(modSettings.skinImage.original, modSettings.skinImage.replaceImg);
                updateStorage();
                skinPreview.src = modSettings.skinImage.replaceImg;
            });

            const deathScreenPos = byId("deathScreenPos");
            const deathScreen = byId("__line2");

            const applyMargin = (position) => {
                switch (position) {
                    case "left":
                        deathScreen.style.marginLeft = "0";
                        break;
                    case "right":
                        deathScreen.style.marginRight = "0";
                        break;
                    case "top":
                        deathScreen.style.marginTop = "20px";
                        break;
                    case "bottom":
                        deathScreen.style.marginBottom = "20px";
                        break;
                    default:
                        deathScreen.style.margin = "auto";
                }
            };

            deathScreenPos.addEventListener("change", () => {
                const selected = deathScreenPos.value;
                applyMargin(selected);
                modSettings.deathScreenPos = selected;
                updateStorage();
            });

            const defaultPosition = modSettings.deathScreenPos || "center";

            applyMargin(defaultPosition);
            deathScreenPos.value = defaultPosition;
        },


        menu() {
            const mod_menu = document.createElement("div");
            mod_menu.classList.add("mod_menu");
            mod_menu.style.display = "none";
            mod_menu.style.opacity = "0";
            mod_menu.innerHTML = `
                <div class="mod_menu_wrapper">
                    <div class="mod_menu_header">
                        <img src="${logoAnim}" draggable="false" class="header_img" />
                        <button type="button" class="modButton" id="closeBtn">
                            <svg width="18" height="20" viewBox="0 0 16 16" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="mod_menu_inner">
                        <div class="mod_menu_navbar">
                            <button class="mod_nav_btn mod_selected" id="tab_home_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/icons/home%20(1).png" />
                                Home
                            </button>
                            <button class="mod_nav_btn" id="tab_macros_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/icons/keyboard%20(1).png" />
                                Macros
                            </button>
                            <button class="mod_nav_btn" id="tab_game_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/icons/games.png" />
                                Game
                            </button>
                            <button class="mod_nav_btn" id="tab_name_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/836ca0f4c25fc6de2e429ee3583be5f860884a0c/images/icons/name.svg" />
                                Name
                            </button>
                            <button class="mod_nav_btn" id="tab_themes_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/icons/theme.png" />
                                Themes
                            </button>
                            <button class="mod_nav_btn" id="tab_fps_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/icons/frames-per-second.png" />
                                FPS
                            </button>
                            <button class="mod_nav_btn" id="tab_friends_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/icons/friends%20(1).png" />
                                Friends
                            </button>
                            <button class="mod_nav_btn" id="tab_info_btn">
                                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/icons/info.png" />
                                Info
                            </button>
                        </div>
                        <div class="mod_menu_content">
                            <div class="mod_tab" id="mod_home">
                                <span class="text-center f-big" id="welcomeUser">Welcome ${noXSS(this.Username) || "Unnamed"}, to the SigMod Client!</span>
                                <div class="justify-sb">
                                    <div class="mod_player-stats">
                                        <span class="justify-sb">Your stats:</span>
                                        <div class="player-stats-grid">
                                            <div class="player-stat">
                                                <span>Time played</span>
                                                <span id="stat-time-played">0h 0m</span>
                                            </div>
                                            <div class="player-stat">
                                                <span>Highest Mass</span>
                                                <span id="stat-highest-mass">0</span>
                                            </div>
                                            <div class="player-stat">
                                                <span>Total deaths</span>
                                                <span id="stat-total-deaths">0</span>
                                            </div>
                                            <div class="player-stat">
                                                <span>Total Mass</span>
                                                <span id="stat-total-mass">0</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="randomVid"></div>
                                </div>
                                <div class="justify-sb" style="gap: 18px;">
                                    <div class="f-column w-100" style="gap: 5px;">
                                        <span>Quick access</span>
                                        <div class="quickAccess scroll" id="mod_qaccess"></div>
                                    </div>
                                    <div class="modProfileWrapper">
                                        <span>Mod profile</span>
                                        <div class="modUserProfile">
                                            <div class="justify-sb">
                                                <div class="flex" style="align-items: center; gap: 5px;">
                                                    <img src="https://sigmally.com/assets/images/agario-profile.png" width="50" height="50" id="my-profile-img" style="border-radius: 50%;" draggable="false" />
                                                    <span id="my-profile-name">Guest</span>
                                                </div>
                                                <div style="position: relative">
                                                    <img width="35" height="35" src="https://sigmally.com/assets/images/agario-star.png">
                                                    <div class="user-level">
                                                        <div class="mod-user-level" id="my-profile-lvl">0</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <span id="my-profile-role">Guest</span>
                                            <hr />
                                            <span id="my-profile-bio">No Bio.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mod_tab scroll" id="mod_macros" style="display: none">
                                    <div class="modColItems">
                                    <div class="macros_wrapper">
                                        <span class="text-center">Keybindings</span>
                                        <hr style="border-color: #3F3F3F">
                                        <div style="justify-content: center;">
                                            <div class="f-column g-10" style="align-items: center; justify-content: center;">
                                                <div class="macrosContainer">
                                                    <div class="f-column g-10">
                                                        <label class="macroRow">
                                                          <span class="text">Rapid Feed</span>
                                                          <input type="text" name="rapidFeed" id="modinput1" class="keybinding" value="${modSettings.keyBindings.rapidFeed}" maxlength="1" onfocus="this.select()" placeholder="..." />
                                                        </label>
                                                        <label class="macroRow">
                                                          <span class="text">Double Split</span>
                                                          <input type="text" name="doubleSplit" id="modinput2" class="keybinding" value="${modSettings.keyBindings.doubleSplit}" maxlength="1" onfocus="this.select()" placeholder="..." />
                                                        </label>
                                                        <label class="macroRow">
                                                          <span class="text">Triple Split</span>
                                                          <input type="text" name="tripleSplit" id="modinput3" class="keybinding" value="${modSettings.keyBindings.tripleSplit}" maxlength="1" onfocus="this.select()" placeholder="..." />
                                                        </label>
                                                    </div>
                                                    <div class="f-column g-10">
                                                        <label class="macroRow">
                                                          <span class="text">Quad Split</span>
                                                          <input type="text" name="quadSplit" id="modinput4" class="keybinding" value="${modSettings.keyBindings.quadSplit}" maxlength="1" onfocus="this.select()" placeholder="..." />
                                                        </label>
                                                        <label class="macroRow">
                                                          <span class="text">Freeze Player</span>
                                                          <input type="text" name="freezePlayer" id="modinput5" class="keybinding" value="${modSettings.keyBindings.freezePlayer}" maxlength="1" onfocus="this.select()" placeholder="..." />
                                                        </label>
                                                        <label class="macroRow">
                                                          <span class="text">Vertical Line</span>
                                                          <input type="text" name="verticalSplit" id="modinput8" class="keybinding" value="${modSettings.keyBindings.verticalSplit}" maxlength="1" onfocus="this.select()" placeholder="..." />
                                                        </label>
                                                    </div>
                                                </div>
                                                <label class="macroRow">
                                                  <span class="text">Toggle Menu</span>
                                                  <input type="text" name="toggleMenu" id="modinput6" class="keybinding" value="${modSettings.keyBindings.toggleMenu}" maxlength="1" onfocus="this.select()" placeholder="..." />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="macros_wrapper">
                                        <span class="text-center">Advanced Keybinding options</span>
                                        <div class="setting-card-wrapper">
                                            <div class="setting-card">
                                                <div class="setting-card-action">
                                                    <span class="setting-card-name">Mouse macros</span>
                                                </div>
                                            </div>
                                            <div class="setting-parameters" style="display: none;">
                                                <div class="my-5">
                                                    <span class="stats-info-text">Feed or Split with mouse buttons</span>
                                                </div>
                                                <div class="stats-line justify-sb">
                                                    <span>Mouse Button 1 (left)</span>
                                                    <select class="form-control macro-extanded_input" style="padding: 2px; text-align: left; width: 100px" id="m1_macroSelect">
                                                        <option value="none">None</option>
                                                        <option value="fastfeed">Fast Feed</option>
                                                        <option value="split">Split (1)</option>
                                                        <option value="split2">Double Split</option>
                                                        <option value="split3">Triple Split</option>
                                                        <option value="split4">Quad Split</option>
                                                        <option value="freeze">Freeze Player</option>
                                                        <option value="dTrick">Double Trick</option>
                                                        <option value="sTrick">Self Trick</option>
                                                    </select>
                                                </div>

                                                <div class="stats-line justify-sb">
                                                    <span>Mouse Button 2 (right)</span>
                                                    <select class="form-control" style="padding: 2px; text-align: left; width: 100px" id="m2_macroSelect">
                                                        <option value="none">None</option>
                                                        <option value="fastfeed">Fast Feed</option>
                                                        <option value="split">Split (1)</option>
                                                        <option value="split2">Double Split</option>
                                                        <option value="split3">Triple Split</option>
                                                        <option value="split4">Quad Split</option>
                                                        <option value="freeze">Freeze Player</option>
                                                        <option value="dTrick">Double Trick</option>
                                                        <option value="sTrick">Self Trick</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="setting-card-wrapper">
                                            <div class="setting-card">
                                                <div class="setting-card-action">
                                                    <span class="setting-card-name">Freeze Player</span>
                                                </div>
                                            </div>

                                            <div class="setting-parameters" style="display: none;">
                                                <div class="my-5">
                                                    <span class="stats-info-text">Freeze your player on the Map and linesplit</span>
                                                </div>

                                                <div class="stats-line justify-sb">
                                                    <span>Type of Freeze</span>
                                                    <select class="form-control" style="padding: 2px; text-align: left; width: 100px" id="freezeType">
                                                        <option value="press">Press</option>
                                                        <option value="hold">Hold</option>
                                                    </select>
                                                </div>

                                                <div class="stats-line justify-sb">
                                                    <span>Bind</span>
                                                    <input value="${modSettings.keyBindings.freezePlayer}" readonly id="modinput7" name="freezePlayer" class="form-control macro-extanded_input" onfocus="this.select();">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="setting-card-wrapper">
                                            <div class="setting-card">
                                                <div class="setting-card-action">
                                                    <span class="setting-card-name">Toggle Settings</span>
                                                </div>
                                            </div>

                                            <div class="setting-parameters" style="display: none;">
                                                <div class="my-5">
                                                    <span class="stats-info-text">Toggle settings with a keybind.</span>
                                                </div>

                                                <div class="stats-line justify-sb">
                                                    <span>Toggle Names</span>
                                                    <input value="${modSettings.keyBindings.toggleNames || ""}" placeholder="..." readonly id="modinput11" name="toggleNames" class="keybinding" onfocus="this.select();">
                                                </div>

                                                <div class="stats-line justify-sb">
                                                    <span>Toggle Skins</span>
                                                    <input value="${modSettings.keyBindings.toggleSkins || ""}" placeholder="..." readonly id="modinput12" name="toggleSkins" class="keybinding" onfocus="this.select();">
                                                </div>

                                                <div class="stats-line justify-sb">
                                                <span>Toggle Autorespawn</span>
                                                    <input value="${modSettings.keyBindings.toggleAutoRespawn || ""}" placeholder="..." readonly id="modinput13" name="toggleAutoRespawn" class="keybinding" onfocus="this.select();">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="setting-card-wrapper">
                                            <div class="setting-card">
                                                <div class="setting-card-action">
                                                    <span class="setting-card-name">Tricksplits</span>
                                                </div>
                                            </div>
                                            <div class="setting-parameters" style="display: none;">
                                                <div class="my-5">
                                                    <span class="stats-info-text">Other split options</span>
                                                </div>
                                                <div class="stats-line justify-sb">
                                                    <span>Double Trick</span>
                                                    <input value="${modSettings.keyBindings.doubleTrick || ""}" placeholder="..." readonly id="modinput14" name="doubleTrick" class="keybinding" onfocus="this.select();">
                                                </div>
                                                <div class="stats-line justify-sb">
                                                    <span>Self Trick</span>
                                                    <input value="${modSettings.keyBindings.selfTrick || ""}" placeholder="..." readonly id="modinput15" name="selfTrick" class="keybinding" onfocus="this.select();">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mod_tab scroll" id="mod_game" style="display: none">
                                <div class="modColItems">
                                    <div class="modRowItems">
                                        <div class="modItem">
                                            <span class="text">Map Color</span>
                                            <div class="centerXY">
                                                <input type="color" value="#ffffff" id="mapColor" class="colorInput" />
                                                <button class="resetButton" id="mapColorReset"></button>
                                            </div>
                                        </div>
                                        <div class="modItem">
                                            <span class="text">Border Colors</span>
                                            <div class="centerXY">
                                                <input type="color" value="#ffffff" id="borderColor" class="colorInput" />
                                                <button class="resetButton" id="borderColorReset"></button>
                                             </div>
                                        </div>
                                        <div class="modItem">
                                            <span class="text">Food color</span>
                                            <div class="centerXY">
                                                <input type="color" value="#ffffff" id="foodColor" class="colorInput" />
                                                <button class="resetButton" id="foodColorReset"></button>
                                             </div>
                                        </div>
                                        <div class="modItem">
                                            <span class="text">Cell color</span>
                                            <div class="centerXY">
                                                <input type="color" value="#ffffff" id="cellColor" class="colorInput" />
                                                <button class="resetButton" id="cellColorReset"></button>
                                             </div>
                                        </div>
                                    </div>
                                    <div class="modRowItems">
                                        <div class="modItem">
                                            <span class="text">Virus Image</span>
                                            <div class="centerXY" style="margin-top: 5px">
                                                <button class="btn select-btn" id="virusImageSelect"></button>
                                             </div>
                                        </div>
                                        <div class="modItem">
                                            <span class="text">Replace Skins</span>
                                            <div class="centerXY" style="margin-top: 5px">
                                                <button class="btn select-btn" id="SkinReplaceSelect"></button>
                                             </div>
                                        </div>
                                    </div>
                                    <div class="modRowItems justify-sb">
                                        <span class="text">Death screen Position</span>
                                        <select id="deathScreenPos" class="form-control" style="width: 30%">
                                            <option value="center" selected>Center</option>
                                            <option value="left">Left</option>
                                            <option value="right">Right</option>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                        </select>
                                    </div>
                                    <div class="modRowItems justify-sb">
                                        <span class="text">Play timer</span>
                                        <div class="modCheckbox">
                                          <input id="playTimerToggle" type="checkbox" />
                                          <label class="cbx" for="playTimerToggle"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mod-small-modal" id="virusModal" style="display: none;">
                                <div class="mod-small-modal-header">
                                    <h1>Virus Image</h1>
                                    <button class="ctrl-modal__close" id="closeVirusModal">
                                        <svg width="22" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </button>
                                </div>
                                <hr>
                                <div class="mod-small-modal-content">
                                    <div class="mod-small-modal-content_selectImage">
                                        <div class="flex" style="gap: 5px;">
                                            <input type="text" class="modInput" placeholder="Virus Image URL" id="virusURL" value="${virusImgVal()}" />
                                            <button class="modButton" id="setVirus">Apply</button>
                                        </div>
                                    </div>
                                    <button class="modButton" id="resetVirus" style="align-self: start; margin-top: 5px;">Reset</button>
                                    <img src="${modSettings.virusImage}" class="previmg" id="virus" draggable="false" >
                                </div>
                            </div>
                            <div class="mod-small-modal" id="skinModal" style="display: none;">
                                <div class="mod-small-modal-header">
                                    <h1>Skin Replacement</h1>
                                    <button class="ctrl-modal__close" id="closeSkinModal">
                                        <svg width="22" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    </button>
                                </div>
                                <hr>
                                <div class="mod-small-modal-content">
                                    <div class="mod-small-modal-content_selectImage">
                                        <div class="centerXY" style="gap: 5px;">
                                            <span>Original Skin: </span>
                                            <select class="form-control" style="padding: 2px; text-align: left; width: fit-content" id="originalSkinSelect">
                                              <option value="Alexander">Alexander</option>
                                              <option value="Celia">Celia</option>
                                              <option value="Chet">Chet</option>
                                              <option value="Chip">Chip</option>
                                              <option value="Dale">Dale</option>
                                              <option value="Hardscrabble">Hardscrabble</option>
                                              <option value="Harley">Harley</option>
                                              <option value="Proctor">Proctor</option>
                                              <option value="Roz">Roz</option>
                                              <option value="Rocky">Rocky</option>
                                              <option value="Lenny">Lenny</option>
                                              <option value="Bullseye">Bullseye</option>
                                              <option value="Hamm">Hamm</option>
                                              <option value="Peep">Peep</option>
                                              <option value="Art">Art</option>
                                              <option value="Bile">Bile</option>
                                              <option value="Boo">Boo</option>
                                              <option value="Brandywine">Brandywine</option>
                                              <option value="Carlton">Carlton</option>
                                              <option value="Derek">Derek</option>
                                              <option value="Fungus">Fungus</option>
                                              <option value="George">George</option>
                                              <option value="Gesner">Gesner</option>
                                              <option value="Josh">Josh</option>
                                              <option value="Michael">Michael</option>
                                              <option value="Needleman">Needleman</option>
                                              <option value="Peterson">Peterson</option>
                                              <option value="Randall">Randall</option>
                                              <option value="Smitty">Smitty</option>
                                              <option value="Spike">Spike</option>
                                              <option value="Squibbles">Squibbles</option>
                                              <option value="Sulley">Sulley</option>
                                              <option value="Waternoose">Waternoose</option>
                                              <option value="Worthington">Worthington</option>
                                              <option value="Yeti">Yeti</option>
                                              <option value="Terri">Terri</option>
                                            </select>
                                        </div>
                                        <span style="text-align: center">Will be replaced with...</span>
                                        <div class="flex" style="gap: 5px;">
                                            <input type="text" class="modInput" placeholder="Skin Image URL" id="skinURL" value="${skinImgVal()}"/>
                                            <button class="modButton" id="setSkin">Apply</button>
                                        </div>
                                    </div>
                                    <button class="modButton" id="resetSkin" style="align-self: start; margin-top: 5px;">Reset</button>
                                    <img src="" class="previmg" id="skinPreview" draggable="false" >
                                </div>
                            </div>
                            <div class="mod_tab scroll" id="mod_name" style="display: none">
                            <div class="modColItems">
                                <div class="modRowItems justify-sb" style="align-items: start;">
                                    <div class="f-column g-5" style="align-items: start; justify-content: start;">
                                        <span class="modTitleText">Name fonts & special characters</span>
                                        <span class="modDescText">Customize your name with special characters or fonts</span>
                                    </div>
                                    <div class="f-column g-5">
                                        <button class="modButton-secondary" onclick="window.open('https://nickfinder.com', '_blank')">Nickfinder</button>
                                        <button class="modButton-secondary" onclick="window.open('https://www.stylishnamemaker.com', '_blank')">Stylish Name</button>
                                        <button class="modButton-secondary" onclick="window.open('https://www.tell.wtf', '_blank')">Tell.wtf</button>
                                    </div>
                                </div>
                                <div class="modRowItems justify-sb">
                                    <div class="f-column g-5">
                                        <span class="modTitleText">Save names</span>
                                        <span class="modDescText">Save your names local</span>
                                        <div class="flex g-5">
                                            <input class="modInput" placeholder="Enter a name..." id="saveNameValue" />
                                            <button id="saveName" class="modButton-secondary f-big" style="border-radius: 5px; background: url('https://sigmally.com/assets/images/icon/plus.svg'); background-color: #111; background-size: 50% auto; background-repeat: no-repeat; background-position: center;"></button>
                                        </div>
                                        <div id="savedNames" class="f-column scroll"></div>
                                    </div>
                                    <div class="vr"></div>
                                    <div class="f-column g-5">
                                        <span class="modTitleText">Name Color</span>
                                        <span class="modDescText">Customize your name color</span>
                                        <div class="justify-sb">
                                            <input type="color" value="#ffffff" id="nameColor" class="colorInput">
                                            <button class="resetButton" id="nameColorReset"></button>
                                        </div>
                                        <span class="modTitleText">Gradient Name</span>
                                        <span class="modDescText">Customize your name with a gradient color</span>
                                        <div class="justify-sb">
                                            <div class="flex g-2" style="align-items: center">
                                                <input type="color" value="#ffffff" id="gradientNameColor1" class="colorInput">
                                                <span>➜ First color</span>
                                            </div>
                                            <button class="resetButton" id="gradientColorReset1"></button>
                                        </div>
                                        <div class="justify-sb">
                                            <div class="flex g-2" style="align-items: center">
                                                <input type="color" value="#ffffff" id="gradientNameColor2" class="colorInput">
                                                <span>➜ Second color</span>
                                            </div>
                                            <button class="resetButton" id="gradientColorReset2"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div class="mod_tab scroll" id="mod_themes" style="display: none">
                                <div class="themes scroll" id="themes">
                                    <div class="theme" id="createTheme">
                                        <div class="themeContent" style="background: url('https://sigmally.com/assets/images/icon/plus.svg'); background-size: 50% auto; background-repeat: no-repeat; background-position: center;"></div>
                                        <div class="themeName text" style="color: #fff">Create</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mod_tab scroll" id="mod_fps" style="display: none">
                                <div class="modRowItems justify-sb">
                                    <span>FPS Mode [Beta]</span>
                                    <div class="modCheckbox">
                                      <input id="fpsMode" type="checkbox" />
                                      <label class="cbx" for="fpsMode"></label>
                                    </div>
                                </div>
                                <span class="text-center">Custom FPS Settings</span>
                                <div class="modRowItems justify-sb">
                                    <span>Hide Food</span>
                                    <div class="modCheckbox">
                                      <input id="fps-hideFood" class="fpsCheckbox" type="checkbox" />
                                      <label class="cbx" for="fps-hideFood"></label>
                                    </div>
                                </div>
                                <div class="modRowItems justify-sb">
                                    <span>Show Names</span>
                                    <div class="modCheckbox">
                                      <input id="fps-remNames" class="fpsCheckbox" type="checkbox" checked />
                                      <label class="cbx" for="fps-remNames"></label>
                                    </div>
                                </div>
                                <div class="modRowItems justify-sb">
                                    <span>Shorten long names</span>
                                    <div class="modCheckbox">
                                      <input id="fps-shortenLongNames" class="fpsCheckbox" type="checkbox" />
                                      <label class="cbx" for="fps-shortenLongNames"></label>
                                    </div>
                                </div>
                                <div class="modRowItems justify-sb">
                                    <span>Remove text shadows</span>
                                    <div class="modCheckbox">
                                      <input id="fps-remOutlines" class="fpsCheckbox" type="checkbox" />
                                      <label class="cbx" for="fps-remOutlines"></label>
                                    </div>
                                </div>
                            </div>
                            <div class="mod_tab scroll" id="mod_friends" style="display: none">
                                <center style="display: flex; align-items: center; justify-content: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="50px" width="50px" version="1.1" viewBox="0 0 330 330">
                                    <path id="XMLID_510_" d="M65,330h200c8.284,0,15-6.716,15-15V145c0-8.284-6.716-15-15-15h-15V85c0-46.869-38.131-85-85-85   S80,38.131,80,85v45H65c-8.284,0-15,6.716-15,15v170C50,323.284,56.716,330,65,330z M180,234.986V255c0,8.284-6.716,15-15,15   s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25   C190,223.162,186.068,230.421,180,234.986z M110,85c0-30.327,24.673-55,55-55s55,24.673,55,55v45H110V85z"/>
                                </svg>
                                This feature is coming soon!
                                </center>
                            </div>
                            <div class="mod_tab scroll f-column g-5 text-center" id="mod_info" style="display: none">
                                <div class="brand_wrapper">
                                    <img src="https://raw.githubusercontent.com/Sigmally/SigMod/6f1ed65927f50ebc4ef71dbbefaa68fcb220d83f/images/stackedwaves.svg" class="brand_img" />
                                    <span style="font-size: 24px; z-index: 2;">SigMod V${version} by Cursed</span>
                                </div>
                                <span style="font-size: 20px; margin-top: 5px;">Thanks to</span>
                                <span class="brand_credits">Ultra, Black, Nudo, Dreamz, Xaris, Benzofury</span>
                                <button class="modButton p_s_n" onclick="window.open('https://github.com/Sigmally/SigMod/blob/main/privacy_security.md')">Privacy and Security notice</button>
                                <div class="brand_yt">
                                    <div class="yt_wrapper" onclick="window.open('https://www.youtube.com/@sigmallyCursed')">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
                                            <path d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z" fill="#ffffff"></path>
                                        </svg>
                                        <span style="font-size: 12px;">Modded By ShadowSoftware</span>
                                    </div>
                                    <div class="yt_wrapper" onclick="window.open('https://discord.gg/D3FZvNGK')">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
                                            <path d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z" fill="#ffffff"></path>
                                        </svg>
                                        <span style="font-size: 15px;">ShadowSoftware</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.append(mod_menu);
            this.getSettings();

            mod_menu.addEventListener("click", (e) => {
                const wrapper = document.querySelector(".mod_menu_wrapper");

                if (wrapper && wrapper.contains(e.target)) return;

                mod_menu.style.opacity = 0;
                setTimeout(() => {
                    mod_menu.style.display = "none";
                }, 300);
            });

            function openModTab(tabId) {
                const allTabs = document.getElementsByClassName("mod_tab");
                const allTabButtons = document.querySelectorAll(".mod_nav_btn");

                for (const tab of allTabs) {
                    tab.style.opacity = 0;
                    setTimeout(() => {
                        tab.style.display = "none";
                    }, 200);
                }

                allTabButtons.forEach(tabBtn => tabBtn.classList.remove("mod_selected"));

                const selectedTab = document.getElementById(tabId);
                setTimeout(() => {
                    selectedTab.style.display = "flex";
                    setTimeout(() => {
                        selectedTab.style.opacity = 1;
                    }, 10);
                }, 200);
                this.classList.add("mod_selected");
            }


            document.querySelectorAll(".mod_nav_btn").forEach(tabBtn => {
                tabBtn.addEventListener("click", function() {
                    openModTab.call(this, this.id.replace("tab_", "mod_").replace("_btn", ""));
                });
            });

            const videoList = [
                "c-_KP3Ti2vQ?si=PHj2aNye5Uj_yXY9",
                "IdBXpxmxYpU?si=4-fZWJUpewLG7c8H",
                "xCUtce1D9f0?si=ybsNDCUL1M1WnuLc",
                "B9LOJQOVH_Q?si=5qJPAxMT_EvFNW8Y",
                "emLjRdTWm5A?si=4suR21ZEb-zmy1RD",
                "190DhVhom5c?si=3TfghIX-u_wsBpR2",
                "t_6L9G13vK8?si=wbiiT78h6RQUgPOd",
                "B--KgGV7XMM?si=GkYtJ5ueks676_J9",
                "Sq2UqzBO_IQ?si=ETvsFSueAwvl8Frm",
                "OsO48zwyLfw?si=plItxN8vhFZbLAf8"
            ];

            function getrdmVid() {
                const randomIndex = Math.floor(Math.random() * videoList.length);
                return videoList[randomIndex];
            }

            const randomVid = document.getElementById("randomVid");
            randomVid.style = "align-self: start";
            randomVid.innerHTML = `
                <iframe width="300" height="200" style="border-radius: 10px; box-shadow: 0 0 10px -2px #000;" src="https://www.youtube.com/embed/${getrdmVid()}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            `;

            const openMenu = document.querySelectorAll("#clans_and_settings button")[1];
            openMenu.removeAttribute("onclick");
            openMenu.addEventListener("click", () => {
                mod_menu.style.display = "flex";
                setTimeout(() => {
                    mod_menu.style.opacity = 1;
                }, 10);
            });

            const closeModal = document.getElementById("closeBtn");
            closeModal.addEventListener("click", () => {
                mod_menu.style.opacity = 0;
                setTimeout(() => {
                    mod_menu.style.display = "none";
                }, 300);
            });

            function virusImgVal() {
                if(modSettings.virusImage === "/assets/images/viruses/2.png" || modSettings.virusImage === "") return "";
                return modSettings.virusImage;
            }
            function skinImgVal() {
                if(modSettings.skinImage.replaceImg === "" || modSettings.skinImage.replaceImg === null) return "";
                return modSettings.skinImage.replaceImg;
            }

            setTimeout(() => {
                const authorized = Boolean(unsafeWindow.user);
                const user = unsafeWindow.user || null;

                fetch('https://app.czrsd.com/sigmod/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        authorized,
                        user,
                        nick: this.nick,
                    }),
                })
                    .then((res) => res.ok ? res.json() : Promise.reject('Server error'))
                    .then((data) => data && data.banned ? this.banned() : null)
                    .catch((error) => console.error('Error during fetch:', error));
            }, 7000);

            const playTimerToggle = document.getElementById("playTimerToggle");
            playTimerToggle.addEventListener("change", () => {
                modSettings.playTimer = playTimerToggle.checked;
                updateStorage();
            });
            if (modSettings.playTimer) {
                playTimerToggle.checked = true;
            }
        },

        setProfile(user) {
            const img = document.getElementById("my-profile-img");
            const name = document.getElementById("my-profile-name");
            const lvl = document.getElementById("my-profile-lvl");
            const role = document.getElementById("my-profile-role");
            const bio = document.getElementById("my-profile-bio");

            img.src = user.imageURL;
            name.innerText = user.givenName;
            lvl.innerText = user.level;
            role.innerText = "Member";
        },

        getSettings() {
            const mod_qaccess = document.querySelector("#mod_qaccess");
            const settingsGrid = document.querySelector("#settings > .checkbox-grid");
            const settingsNames = settingsGrid.querySelectorAll("label:not([class])");
            const inputs = settingsGrid.querySelectorAll("input");

            inputs.forEach((checkbox, index) => {
                if (checkbox.id === "showChat" || checkbox.id === "showMinimap") return;
                const modrow = document.createElement("div");
                modrow.classList.add("justify-sb", "p-2");

                if (checkbox.id === "showPosition" || checkbox.id === "showNames") {
                    modrow.style.display = "none";
                }
                modrow.innerHTML = `
                    <span>${settingsNames[index].textContent}</span>
                    <div class="modCheckbox" id="${checkbox.id}_wrapper"></div>
                `;
                mod_qaccess.append(modrow);

                const cbWrapper = document.getElementById(`${checkbox.id}_wrapper`);
                cbWrapper.appendChild(checkbox);

                cbWrapper.appendChild(
                    Object.assign(document.createElement("label"), {
                        classList: ['cbx'],
                        htmlFor: checkbox.id
                    })
                );
            });
        },

        Themes() {
            const elements = [
                "#menu",
                "#title",
                ".top-users__inner",
                "#left-menu",
                ".menu-links",
                ".menu--stats-mode",
            ];

            const themeEditor = document.createElement("div");
            themeEditor.classList.add("themeEditor");
            themeEditor.style.display = "none";

            themeEditor.innerHTML = `
                <div class="theme_editor_header">
                    <h3>Theme Editor</h3>
                    <button class="btn CloseBtn" id="closeThemeEditor">
                        <svg width="22" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
                <hr />
                <main class="theme_editor_content">
                    <div class="centerXY" style="justify-content: flex-end;gap: 10px">
                        <span class="text">Select Theme Type: </span>
                        <select class="form-control" style="background: #222; color: #fff; width: 150px" id="theme-type-select">
                            <option>Static Color</option>
                            <option>Gradient</option>
                            <option>Image / Gif</option>
                        </select>
                    </div>

                    <div id="theme_editor_color" class="theme-editor-tab">
                        <div class="centerXY">
                            <label for="theme-editor-bgcolorinput" class="text">Background color:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-bgcolorinput"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-colorinput" class="text">Text color:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-colorinput"/>
                        </div>
                        <div style="background-color: #000000" class="themes_preview" id="color_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" maxlength="15" placeholder="Theme name..." id="colorThemeName"/>
                            <button class="btn btn-success" id="saveColorTheme">Save</button>
                        </div>
                    </div>


                    <div id="theme_editor_gradient" class="theme-editor-tab" style="display: none;">
                        <div class="centerXY">
                            <label for="theme-editor-gcolor1" class="text">Color 1:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-gcolor1"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-g_color" class="text">Color 2:</label>
                            <input type="color" value="#ffffff" class="colorInput whiteBorder_colorInput" id="theme-editor-g_color"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-gcolor2" class="text">Text Color:</label>
                            <input type="color" value="#ffffff" class="colorInput whiteBorder_colorInput" id="theme-editor-gcolor2"/>
                        </div>

                        <div class="centerXY" style="gap: 10px">
                            <label for="gradient-type" class="text">Gradient Type:</label>
                            <select id="gradient-type" class="form-control" style="background: #222; color: #fff; width: 120px;">
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                            </select>
                        </div>

                        <div id="theme-editor-gradient_angle" class="centerY" style="gap: 10px; width: 100%">
                            <label for="g_angle" class="text" id="gradient_angle_text" style="width: 115px;">Angle (0deg):</label>
                            <input type="range" id="g_angle" value="0" min="0" max="360">
                        </div>

                        <div style="background: linear-gradient(0deg, #000, #fff)" class="themes_preview" id="gradient_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" placeholder="Theme name..." id="GradientThemeName"/>
                            <button class="btn btn-success" id="saveGradientTheme">Save</button>
                        </div>
                    </div>



                    <div id="theme_editor_image" class="theme-editor-tab" style="display: none">
                        <div class="centerXY">
                            <input type="text" id="theme-editor-imagelink" placeholder="Image / GIF URL (https://i.ibb.co/k6hn4v0/Galaxy-Example.png)" class="form-control" style="background: #222; color: #fff"/>
                        </div>
                        <div class="centerXY" style="margin: 5px; gap: 5px;">
                            <label for="theme-editor-textcolorImage" class="text">Text Color: </label>
                            <input type="color" class="colorInput whiteBorder_colorInput" value="#ffffff" id="theme-editor-textcolorImage"/>
                        </div>

                        <div style="background: url('https://i.ibb.co/k6hn4v0/Galaxy-Example.png'); background-position: center; background-size: cover;" class="themes_preview" id="image_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" placeholder="Theme name..." id="imageThemeName"/>
                            <button class="btn btn-success" id="saveImageTheme">Save</button>
                        </div>
                    </div>
                </main>
            `;

            document.body.append(themeEditor);

            setTimeout(() => {
                document.querySelectorAll(".stats-btn__share-btn")[1].querySelector("rect").remove();

                const themeTypeSelect = document.getElementById("theme-type-select");
                const colorTab = document.getElementById("theme_editor_color");
                const gradientTab = document.getElementById("theme_editor_gradient");
                const imageTab = document.getElementById("theme_editor_image");
                const gradientAngleDiv = document.getElementById("theme-editor-gradient_angle");

                themeTypeSelect.addEventListener("change", function() {
                    const selectedOption = themeTypeSelect.value;
                    switch (selectedOption) {
                        case "Static Color":
                            colorTab.style.display = "flex";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "none";
                            break;
                        case "Gradient":
                            colorTab.style.display = "none";
                            gradientTab.style.display = "flex";
                            imageTab.style.display = "none";
                            break;
                        case "Image / Gif":
                            colorTab.style.display = "none";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "flex";
                            break;
                        default:
                            colorTab.style.display = "flex";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "none";
                    }
                });

                const colorInputs = document.querySelectorAll("#theme_editor_color .colorInput");
                colorInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const bgColorInput = document.getElementById("theme-editor-bgcolorinput").value;
                        const textColorInput = document.getElementById("theme-editor-colorinput").value;

                        applyColorTheme(bgColorInput, textColorInput);
                    });
                });

                const gradientInputs = document.querySelectorAll("#theme_editor_gradient .colorInput");
                gradientInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                        const gColor2 = document.getElementById("theme-editor-g_color").value;
                        const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                        const gAngle = document.getElementById("g_angle").value;
                        const gradientType = document.getElementById("gradient-type").value;

                        applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType);
                    });
                });

                const imageInputs = document.querySelectorAll("#theme_editor_image .colorInput");
                imageInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const imageLinkInput = document.getElementById("theme-editor-imagelink").value;
                        const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                        let img;
                        if(imageLinkInput == "") {
                            img = "https://i.ibb.co/k6hn4v0/Galaxy-Example.png"
                        } else {
                            img = imageLinkInput;
                        }
                        applyImageTheme(img, textColorImageInput);
                    });
                });
                const image_preview = document.getElementById("image_preview");
                const image_link = document.getElementById("theme-editor-imagelink");

                let isWriting = false;
                let timeoutId;

                image_link.addEventListener("input", () => {
                    if (!isWriting) {
                        isWriting = true;
                    } else {
                        clearTimeout(timeoutId);
                    }

                    timeoutId = setTimeout(() => {
                        const imageLinkInput = image_link.value;
                        const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                        let img;
                        if (imageLinkInput === "") {
                            img = "https://i.ibb.co/k6hn4v0/Galaxy-Example.png";
                        } else {
                            img = imageLinkInput;
                        }

                        applyImageTheme(img, textColorImageInput);
                        isWriting = false;
                    }, 1000);
                });


                const gradientTypeSelect = document.getElementById("gradient-type");
                const angleInput = document.getElementById("g_angle");

                gradientTypeSelect.addEventListener("change", function() {
                    const selectedType = gradientTypeSelect.value;
                    gradientAngleDiv.style.display = selectedType === "linear" ? "flex" : "none";

                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;

                    applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, selectedType);
                });

                angleInput.addEventListener("input", function() {
                    const gradient_angle_text = document.getElementById("gradient_angle_text");
                    gradient_angle_text.innerText = `Angle (${angleInput.value}deg): `;
                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;
                    const gradientType = document.getElementById("gradient-type").value;

                    applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType);
                });

                function applyColorTheme(bgColor, textColor) {
                    const previewDivs = document.querySelectorAll("#theme_editor_color .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        previewDiv.style.backgroundColor = bgColor;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = textColor;
                    });
                }

                function applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType) {
                    const previewDivs = document.querySelectorAll("#theme_editor_gradient .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        const gradient = gradientType === "linear"
                        ? `linear-gradient(${gAngle}deg, ${gColor1}, ${gColor2})`
                        : `radial-gradient(circle, ${gColor1}, ${gColor2})`;
                        previewDiv.style.background = gradient;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = gTextColor;
                    });
                }

                function applyImageTheme(imageLink, textColor) {
                    const previewDivs = document.querySelectorAll("#theme_editor_image .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        previewDiv.style.backgroundImage = `url('${imageLink}')`;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = textColor;
                    });
                }



                const createTheme = document.getElementById("createTheme");
                createTheme.addEventListener("click", () => {
                    themeEditor.style.display = "block";
                });

                const closeThemeEditor = document.getElementById("closeThemeEditor");
                closeThemeEditor.addEventListener("click", () => {
                    themeEditor.style.display = "none";
                });

                let themesDiv = document.getElementById("themes")

                const saveColorThemeBtn = document.getElementById("saveColorTheme");
                const saveGradientThemeBtn = document.getElementById("saveGradientTheme");
                const saveImageThemeBtn = document.getElementById("saveImageTheme");

                saveColorThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("colorThemeName").value;
                    const bgColorInput = document.getElementById("theme-editor-bgcolorinput").value;
                    const textColorInput = document.getElementById("theme-editor-colorinput").value;

                    if(name == "") return

                    const theme = {
                        name: name,
                        background: bgColorInput,
                        text: textColorInput
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    updateStorage();

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });

                saveGradientThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("GradientThemeName").value;
                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;
                    const gradientType = document.getElementById("gradient-type").value;

                    if(name == "") return

                    let gradient_radial_linear = () => {
                        if(gradientType == "linear") {
                            return `${gradientType}-gradient(${gAngle}deg, ${gColor1}, ${gColor2})`
                        } else if (gradientType == "radial") {
                            return `${gradientType}-gradient(circle, ${gColor1}, ${gColor2})`
                        }
                    }
                    const theme = {
                        name: name,
                        background: gradient_radial_linear(),
                        text: gTextColor,
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    updateStorage();

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });

                saveImageThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("imageThemeName").value;
                    const imageLink = document.getElementById("theme-editor-imagelink").value;
                    const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                    if(name == "" || imageLink == "") return

                    const theme = {
                        name: name,
                        background: imageLink,
                        text: textColorImageInput
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    updateStorage();

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });
            });

            const b_inner = document.querySelector(".body__inner");
            let bodyColorElements = b_inner.querySelectorAll(
                ".body__inner > :not(.body__inner), #s-skin-select-icon-text"
            );

            const toggleColor = (element, background, text) => {
                let image = `url("${background}")`;
                if (background.includes("http")) {
                    element.style.background = image;
                    element.style.backgroundPosition = "center";
                    element.style.backgroundSize = "cover";
                    element.style.backgroundRepeat = "no-repeat";
                } else {
                    element.style.background = background;
                    element.style.backgroundRepeat = "no-repeat";
                }
                element.style.color = text;
            };

            const openSVG = document.querySelector("#clans_and_settings > Button > svg");
            const openSVGPath = document.querySelector("#clans_and_settings > Button > svg > path");
            const newPath = openSVG.setAttribute("fill", "#fff")
            openSVG.setAttribute("width", "36")
            openSVG.setAttribute("height", "36")

            const toggleTheme = (theme) => {
                if (theme.text === "#FFFFFF") {
                    openSVGPath.setAttribute("fill", "#fff")
                } else {
                    openSVG.setAttribute("fill", "#222");
                }

                const backgroundColor = theme.background;
                const textColor = theme.text;

                elements.forEach(selector => {
                    const el = document.querySelector(selector);
                    if (selector === "#title") {
                        el.style.color = textColor;
                    } else {
                        toggleColor(el, backgroundColor, textColor);
                    }
                });

                bodyColorElements.forEach((element) => {
                    element.style.color = textColor;
                });

                modSettings.Theme = theme.name;
                updateStorage();
            };

            const themes = {
                defaults: [
                    {
                        name: "Dark",
                        background: "#151515",
                        text: "#FFFFFF"
                    },
                    {
                        name: "White",
                        background: "#ffffff",
                        text: "#000000"
                    },
                ],
                orderly: [
                    {
                        name: "THC",
                        background: "linear-gradient(160deg, #9BEC7A, #117500)",
                        text: "#000000"
                    },
                    {
                        name: "4 AM",
                        background: "linear-gradient(160deg, #8B0AE1, #111)",
                        text: "#FFFFFF"
                    },
                    {
                        name: "OTO",
                        background: "linear-gradient(160deg, #A20000, #050505)",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Gaming",
                        background: "https://i.ibb.co/DwKkQfh/BG-1-lower-quality.jpg",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Shapes",
                        background: "https://i.ibb.co/h8TmVyM/BG-2.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Blue",
                        background: "https://i.ibb.co/9yQBfWj/BG-3.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Blue - 2",
                        background: "https://i.ibb.co/7RJvNCX/BG-4.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Purple",
                        background: "https://i.ibb.co/vxY15Tv/BG-5.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Orange Blue",
                        background: "https://i.ibb.co/99nfFBN/BG-6.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Gradient",
                        background: "https://i.ibb.co/hWMLwLS/BG-7.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Sky",
                        background: "https://i.ibb.co/P4XqDFw/BG-9.png",
                        text: "#000000"
                    },
                    {
                        name: "Sunset",
                        background: "https://i.ibb.co/0BVbYHC/BG-10.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Galaxy",
                        background: "https://i.ibb.co/MsssDKP/Galaxy.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Planet",
                        background: "https://i.ibb.co/KLqWM32/Planet.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "colorful",
                        background: "https://i.ibb.co/VqtB3TX/colorful.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Sunset - 2",
                        background: "https://i.ibb.co/TLp2nvv/Sunset.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Epic",
                        background: "https://i.ibb.co/kcv4tvn/Epic.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Galaxy - 2",
                        background: "https://i.ibb.co/smRs6V0/galaxy.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Cloudy",
                        background: "https://i.ibb.co/MCW7Bcd/cloudy.png",
                        text: "#000000"
                    },
                ]
            };

            function createThemeCard(theme) {
                const themeCard = document.createElement("div");
                themeCard.classList.add("theme");
                let themeBG;
                if (theme.background.includes("http")) {
                    themeBG = `background: url(${theme.background})`;
                } else {
                    themeBG = `background: ${theme.background}`;
                }
                themeCard.innerHTML = `
                  <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                  <div class="themeName text" style="color: #fff">${theme.name}</div>
                `;

                themeCard.addEventListener("click", () => {
                    toggleTheme(theme);
                });

                if (modSettings.addedThemes.includes(theme)) {
                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if (confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                updateStorage();
                            }
                        }
                    }, false);
                }

                return themeCard;
            }

            const themesContainer = document.getElementById("themes");

            themes.defaults.forEach((theme) => {
                const themeCard = createThemeCard(theme);
                themesContainer.append(themeCard);
            });

            const orderlyThemes = [...themes.orderly, ...modSettings.addedThemes];
            orderlyThemes.sort((a, b) => a.name.localeCompare(b.name));
            orderlyThemes.forEach((theme) => {
                const themeCard = createThemeCard(theme);
                themesContainer.appendChild(themeCard);
            });


            const savedTheme = modSettings.Theme;
            if (savedTheme) {
                let selectedTheme;
                selectedTheme = themes.defaults.find((theme) => theme.name === savedTheme);
                if (!selectedTheme) {
                    selectedTheme = themes.orderly.find((theme) => theme.name === savedTheme) || modSettings.addedThemes.find((theme) => theme.name === savedTheme);
                }

                if (selectedTheme) {
                    toggleTheme(selectedTheme);
                }
            }
        },

        chat() {
            const showChat = document.querySelector('#showChat');
            if (showChat.checked) {
                showChat.click();
            }
            setTimeout(() => {
                if (showChat) {
                    showChat.remove();
                }
            });

            const chatDiv = document.createElement("div");
            chatDiv.classList.add("modChat");
            chatDiv.innerHTML = `
                <div class="modChat__inner">
                    <div class="modchat-chatbuttons">
                        <button class="chatButton" id="mainchat">Main</button>
                        <button class="chatButton" id="partychat">Party</button>
                        <span class="tagText"></span>
                    </div>
                    <div id="mod-messages" class="scroll"></div>
                    <div id="chatInputContainer">
                        <input type="text" id="chatSendInput" class="chatInput" placeholder="message..." maxlength="250" minlength="1" />
                        <button class="chatButton" id="openChatSettings">
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.4249 7.45169C15.7658 7.45169 15.0874 6.27836 15.9124 4.83919C16.3891 4.00503 16.1049 2.94169 15.2708 2.46503L13.6849 1.55753C12.9608 1.12669 12.0258 1.38336 11.5949 2.10753L11.4941 2.28169C10.6691 3.72086 9.31242 3.72086 8.47825 2.28169L8.37742 2.10753C7.96492 1.38336 7.02992 1.12669 6.30575 1.55753L4.71992 2.46503C3.88575 2.94169 3.60158 4.01419 4.07825 4.84836C4.91242 6.27836 4.23408 7.45169 2.57492 7.45169C1.62159 7.45169 0.833252 8.23086 0.833252 9.19336V10.8067C0.833252 11.76 1.61242 12.5484 2.57492 12.5484C4.23408 12.5484 4.91242 13.7217 4.07825 15.1609C3.60158 15.995 3.88575 17.0584 4.71992 17.535L6.30575 18.4425C7.02992 18.8734 7.96492 18.6167 8.39575 17.8925L8.49658 17.7184C9.32158 16.2792 10.6783 16.2792 11.5124 17.7184L11.6133 17.8925C12.0441 18.6167 12.9791 18.8734 13.7033 18.4425L15.2891 17.535C16.1233 17.0584 16.4074 15.9859 15.9307 15.1609C15.0966 13.7217 15.7749 12.5484 17.4341 12.5484C18.3874 12.5484 19.1758 11.7692 19.1758 10.8067V9.19336C19.1666 8.24003 18.3874 7.45169 17.4249 7.45169ZM9.99992 12.9792C8.35908 12.9792 7.02075 11.6409 7.02075 10C7.02075 8.35919 8.35908 7.02086 9.99992 7.02086C11.6408 7.02086 12.9791 8.35919 12.9791 10C12.9791 11.6409 11.6408 12.9792 9.99992 12.9792Z" fill="#fff"></path>
                            </svg>
                        </button>
                        <button class="chatButton" id="openEmojiMenu">😎</button>
                        <button id="sendButton" class="chatButton">
                            Send
                            <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/send.svg" width="20" height="20" draggable="false"/>
                        </button>
                    </div>
                </div>
            `;
            document.body.append(chatDiv);

            const main = document.getElementById("mainchat");
            const party = document.getElementById("partychat");
            main.addEventListener("click", () => {
                if (modSettings.chatSettings.showClientChat) {
                    document.getElementById("mod-messages").innerHTML = "";
                    modSettings.chatSettings.showClientChat = false;
                    updateStorage();
                }
            });
            party.addEventListener("click", () => {
                if (!modSettings.chatSettings.showClientChat) {
                    modSettings.chatSettings.showClientChat = true;
                    updateStorage();
                }
                const modMessages = document.getElementById("mod-messages");
                if (!modSettings.tag) {
                    modMessages.innerHTML = `
                        <div class="message">
                            <span>
                                <span style="color: #5a44eb" class="message_name">[SERVER]</span>: You need to be in a tag to use the SigMod party chat.
                            </span>
                        </div>
                    `;
                } else {
                    modMessages.innerHTML = `
                        <div class="message">
                            <span>
                                <span style="color: #5a44eb" class="message_name">[SERVER]</span>: Welcome to the SigMod party chat!
                            </span>
                        </div>
                    `;
                }
            });

            if (modSettings.chatSettings.showClientChat) {
                const modMessages = document.getElementById("mod-messages");
                if (modMessages.children.length > 1) return;
                modMessages.innerHTML = `
                    <div class="message">
                        <span>
                            <span style="color: #5a44eb" class="message_name">[SERVER]</span>: Welcome to the SigMod party chat!
                        </span>
                    </div>
                `;
            }


            const text = document.getElementById("chatSendInput");
            const send = document.getElementById("sendButton");

            send.addEventListener("click", () => {
                let val = text.value;
                if (val == "") return;

                if (modSettings.chatSettings.showClientChat) {
                    const id = unsafeWindow.user ? unsafeWindow.user._id : null;
                    client.send({
                        type: "chat-message",
                        content: {
                            name: this.nick,
                            message: val,
                            id: id,
                        }
                    });
                } else {
                    // MAX 15 CHARS PER MSG
                    if (val.length > 15) {
                        const parts = [];
                        for (let i = 0; i < val.length; i += 15) {
                            parts.push(val.substring(i, i + 15));
                        }

                        let index = 0;
                        const sendPart = () => {
                            if (index < parts.length) {
                                sendChat(parts[index]);
                                index++;
                                setTimeout(sendPart, 1000);
                            }
                        };

                        sendPart();
                    } else {
                        sendChat(val);
                    }
                }

                text.value = "";
                text.blur();
            });


            this.chatSettings();
            this.emojiMenu();


            const chatSettingsContainer = document.querySelector(".chatSettingsContainer")
            const emojisContainer = document.querySelector(".emojisContainer")

            document.getElementById("openChatSettings").addEventListener("click", () => {
                if (chatSettingsContainer.classList.contains("hidden")) {
                    chatSettingsContainer.classList.remove("hidden");
                    emojisContainer.classList.add("hidden");
                } else {
                    chatSettingsContainer.classList.add("hidden");
                }
            });

            document.getElementById("openEmojiMenu").addEventListener("click", () => {
                if (emojisContainer.classList.contains("hidden")) {
                    emojisContainer.classList.remove("hidden");
                    chatSettingsContainer.classList.add("hidden");
                } else {
                    emojisContainer.classList.add("hidden");
                }
            });
            const scrollUpButton = document.createElement("button");
            scrollUpButton.style = "position: absolute;bottom: 60px;left: 50%;transform: translateX(-50%);width: 80px;display:none;box-shadow:0 0 5px #000;";
            scrollUpButton.innerHTML = "↓";
            scrollUpButton.id = "scroll-down-btn";
            scrollUpButton.classList.add("modButton");
            document.querySelector(".modChat__inner").appendChild(scrollUpButton);


            let focused = false;
            let typed = false;

            document.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && text.value.length > 0) {
                    send.click();
                    focused = false;
                    scrollUpButton.click();
                } else if (e.key === "Enter") {
                    if (document.activeElement == HTMLInputElement) return;

                    focused ? text.blur() : text.focus();
                    focused = !focused;
                }
            });


            text.addEventListener("input", (e) => {
                typed = text.value.length > 1;
            });

            text.addEventListener("blur", (e) => {
                focused = false;
            });

            text.addEventListener("keydown", (e) => {
                const key = e.key.toLowerCase();
                if (key == "w") {
                    e.stopPropagation();
                }

                if (key == " ") {
                    e.stopPropagation();
                }
            });
        },

        updateChat(data) {
            let time = ""
            if (data.time != null) time = formatTime(data.time);

            const name = noXSS(data.name);
            const msg = noXSS(data.message);

            const chatMessage = document.createElement("div");
            chatMessage.classList.add("message");
            chatMessage.innerHTML = `
            <span>
                <span style="color: ${data.color}" class="message_name">${name}</span>: ${msg}
            </span>
            <span class="time">${time}</span>
            `

            const chatContainer = document.getElementById("mod-messages");
            const manuallyScrolled = chatContainer.scrollHeight - chatContainer.scrollTop > 200;
            if (!manuallyScrolled) {
                setTimeout(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                });
            }

            const scrollDownButton = document.getElementById("scroll-down-btn");

            chatContainer.addEventListener("scroll", () => {
                if (chatContainer.scrollHeight - chatContainer.scrollTop > 300) {
                    scrollDownButton.style.display = "block";
                }
                if (chatContainer.scrollHeight - chatContainer.scrollTop < 299 && scrollDownButton.style.display === "block") {
                    scrollDownButton.style.display = "none";
                }
            });

            scrollDownButton.addEventListener("click", () => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            });


            document.getElementById("mod-messages").append(chatMessage);

            const messageCount = chatContainer.children.length;
            const messageLimit = modSettings.chatSettings.limit;
            if (messageCount > messageLimit) {
                const messagesToRemove = messageCount - messageLimit;
                for (let i = 0; i < messagesToRemove; i++) {
                    chatContainer.removeChild(chatContainer.firstChild);
                }
            }
        },

        emojiMenu() {
            const emojisContainer = document.createElement("div");
            emojisContainer.classList.add("chatAddedContainer", "emojisContainer", "hidden");
            emojisContainer.innerHTML = `
                <input type="text" class="chatInput" id="searchEmoji" style="background-color: #050505; border-radius: .5rem;" placeholder="Search..." />
                <div id="categories" class="scroll"></div>
            `;

            const categoriesContainer = emojisContainer.querySelector("#categories");

            const updateEmojis = (searchTerm) => {
                categoriesContainer.innerHTML = '';

                window.emojis.forEach(emojiData => {
                    const { emoji, description, category, tags } = emojiData;

                    if (tags.some(tag => tag.includes(searchTerm.toLowerCase()))) {
                        let categoryId = category.replace(/\s+/g, '-').replace('&', 'and').toLowerCase();
                        let categoryDiv = categoriesContainer.querySelector(`#${categoryId}`);
                        if (!categoryDiv) {
                            categoryDiv = document.createElement("div");
                            categoryDiv.id = categoryId;
                            categoryDiv.classList.add("category");
                            categoryDiv.innerHTML = `<span>${category}</span><div class="emojiContainer"></div>`;
                            categoriesContainer.appendChild(categoryDiv);
                        }

                        const emojiContainer = categoryDiv.querySelector(".emojiContainer");

                        const emojiDiv = document.createElement("div");
                        emojiDiv.classList.add("emoji");
                        emojiDiv.innerHTML = emoji;
                        emojiDiv.title = `${emoji} - ${description}`;
                        emojiDiv.addEventListener("click", () => {
                            const chatInput = document.querySelector("#chatSendInput");
                            chatInput.value += emoji;
                        });

                        emojiContainer.appendChild(emojiDiv);
                    }
                });
            };

            const chatInput = emojisContainer.querySelector("#searchEmoji");
            chatInput.addEventListener("input", (event) => {
                const searchTerm = event.target.value.toLowerCase();
                updateEmojis(searchTerm);
            });

            document.body.append(emojisContainer);

            getEmojis().then(emojis => {
                window.emojis = emojis;
                updateEmojis("");
            });
        },

        chatSettings() {
            const menu = document.createElement("div");
            menu.classList.add("chatAddedContainer", "chatSettingsContainer", "scroll", "hidden");
            menu.innerHTML = `
                <div class="modInfoPopup" style="display: none">
                    <p>Send location in chat with keybind</p>
                </div>
                <div class="scroll">
                    <div class="csBlock">
                        <div class="csBlockTitle">
                            <span>Keybindings</span>
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Location</span>
                                <span class="infoIcon">
                                    <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 416.979 416.979" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path> </g> </g></svg>
                                </span>
                            </div>
                            <input type="text" name="location" id="modinput9" class="keybinding" value="${modSettings.keyBindings.location || ""}" placeholder="..." maxlength="1" onfocus="this.select()">
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Show / Hide</span>
                            </div>
                            <input type="text" name="toggleChat" id="modinput10" class="keybinding" value="${modSettings.keyBindings.toggleChat || ""}" placeholder="..." maxlength="1" onfocus="this.select()">
                        </div>
                    </div>
                    <div class="csBlock">
                        <div class="csBlockTitle">
                            <span>General</span>
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Time</span>
                            </div>
                            <div class="modCheckbox">
                              <input id="showChatTime" type="checkbox" checked />
                              <label class="cbx" for="showChatTime"></label>
                            </div>
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Name colors</span>
                            </div>
                            <div class="modCheckbox">
                              <input id="showNameColors" type="checkbox" checked />
                              <label class="cbx" for="showNameColors"></label>
                            </div>
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Party / Main</span>
                            </div>
                            <div class="modCheckbox">
                              <input id="showPartyMain" type="checkbox" checked />
                              <label class="cbx" for="showPartyMain"></label>
                            </div>
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Blur Tag</span>
                            </div>
                            <div class="modCheckbox">
                              <input id="blurTag" type="checkbox" checked />
                              <label class="cbx" for="blurTag"></label>
                            </div>
                        </div>
                        <div class="flex f-column" style="gap: 5px; align-items: center; padding: 0 5px">
                            <div class="csRowName">
                                <span>Location text</span>
                            </div>
                          <input type="text" id="locationText" placeholder="{pos}..." value="{pos}" class="form-control" />
                        </div>
                    </div>
                    <div class="csBlock">
                        <div class="csBlockTitle">
                            <span>Style</span>
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Background</span>
                            </div>
                            <input type="color" class="colorInput" value="${RgbaToHex(modSettings.chatSettings.bgColor)}" id="chatbgChanger" />
                        </div>
                        <div class="csRow">
                            <div class="csRowName">
                                <span>Theme</span>
                            </div>
                            <input type="color" class="colorInput" value="${modSettings.chatSettings.themeColor || "#ffffff"}" id="chatThemeChanger" />
                        </div>
                    </div>
                </div>
            `;
            document.body.append(menu);

            const infoIcon = document.querySelector(".infoIcon");
            const modInfoPopup = document.querySelector(".modInfoPopup");
            let popupOpen = false;

            infoIcon.addEventListener("click", (event) => {
                event.stopPropagation();
                modInfoPopup.style.display = popupOpen ? "none" : "block";
                popupOpen = !popupOpen;
            });

            document.addEventListener("click", (event) => {
                if (popupOpen && !modInfoPopup.contains(event.target)) {
                    modInfoPopup.style.display = "none";
                    popupOpen = false;
                }
            });

            const showChatTime = document.querySelector("#showChatTime");
            const showNameColors = document.querySelector("#showNameColors");

            showChatTime.addEventListener("change", () => {
                const timeElements = document.querySelectorAll(".time");
                if (showChatTime.checked) {
                    modSettings.chatSettings.showTime = true;
                    updateStorage();
                } else {
                    modSettings.chatSettings.showTime = false;
                    if (timeElements) {
                        timeElements.forEach(el => el.innerHTML="");
                    }
                    updateStorage();
                }
            });

            showNameColors.addEventListener("change", () => {
                const message_names = document.querySelectorAll(".message_name");
                if (showNameColors.checked) {
                    modSettings.chatSettings.showNameColors = true;
                    updateStorage();
                } else {
                    modSettings.chatSettings.showNameColors = false;
                    if (message_names) {
                        message_names.forEach(el => el.style.color="#fafafa");
                    }
                    updateStorage();
                }
            });

            const bgChanger = document.querySelector("#chatbgChanger");

            bgChanger.addEventListener("input", () => {
                const hexColor = bgChanger.value;
                const rgbaColor = hexToRgba(hexColor, 0.4);
                modSettings.chatSettings.bgColor = rgbaColor;
                modChat.style.background = rgbaColor;
                updateStorage();
            });

            const themeChanger = document.querySelector("#chatThemeChanger");
            const chatBtns = document.querySelectorAll(".chatButton");
            themeChanger.addEventListener("input", () => {
                const hexColor = themeChanger.value;
                modSettings.chatSettings.themeColor = hexColor;
                chatBtns.forEach(btn => {
                    btn.style.background = hexColor;
                });
                updateStorage();
            });

            const modChat = document.querySelector(".modChat");
            modChat.style.background = modSettings.chatSettings.bgColor;
            if (modSettings.chatSettings.themeColor) {
                chatBtns.forEach(btn => {
                    btn.style.background = modSettings.chatSettings.themeColor;
                });
            }

            const showPartyMain = document.querySelector("#showPartyMain");
            const chatHeader = document.querySelector(".modchat-chatbuttons");

            const changeButtonsState = (show) => {
                chatHeader.style.display = show ? "flex" : "none";
                modChat.style.maxHeight = show ? "285px" : "250px";
                modChat.style.minHeight = show ? "285px" : "250px";
                const modChatInner = document.querySelector(".modChat__inner");
                modChatInner.style.maxHeight = show ? "265px" : "230px";
                modChatInner.style.minHeight = show ? "265px" : "230px";
            }

            showPartyMain.addEventListener("change", () => {
                const show = showPartyMain.checked;
                modSettings.chatSettings.showChatButtons = show;
                changeButtonsState(show);
                updateStorage();
            });

            showPartyMain.checked = modSettings.chatSettings.showChatButtons;
            changeButtonsState(modSettings.chatSettings.showChatButtons);


            setTimeout(() => {
                const blurTag = document.getElementById("blurTag");
                const tagText = document.querySelector(".tagText");
                const tagElement = document.querySelector("#tag");
                blurTag.addEventListener("change", () => {
                    const state = blurTag.checked;

                    state ? (tagText.classList.add("blur"), tagElement.classList.add("blur")) : (tagText.classList.remove("blur"), tagElement.classList.remove("blur"));
                    modSettings.chatSettings.blurTag = state;
                    updateStorage();
                });
                blurTag.checked = modSettings.chatSettings.blurTag;
                if (modSettings.chatSettings.blurTag) {
                    tagText.classList.add("blur");
                    tagElement.classList.add("blur");
                }
            });

            const locationText = document.getElementById("locationText");
            locationText.addEventListener("input", (e) => {
                e.stopPropagation();
                modSettings.chatSettings.locationText = locationText.value;
            });
            locationText.value = modSettings.chatSettings.locationText || "{pos}";
        },

        toggleChat() {
            const modChat = document.querySelector(".modChat");
            const modChatAdded = document.querySelectorAll(".chatAddedContainer");

            const isModChatHidden = modChat.style.display === "none" || getComputedStyle(modChat).display === "none";

            if (isModChatHidden) {
                modChat.style.opacity = 0;
                modChat.style.display = "flex";

                setTimeout(() => {
                    modChat.style.opacity = 1;
                }, 10);
            } else {
                modChat.style.opacity = 0;
                modChatAdded.forEach(container => container.classList.add("hidden"));

                setTimeout(() => {
                    modChat.style.display = "none";
                }, 300);
            }
        },


        macroSettings() {
            const allSettingNames = document.querySelectorAll(".setting-card-name")

            for (const settingName of Object.values(allSettingNames)) {
                settingName.addEventListener("click", (event) => {
                    const settingCardWrappers = document.querySelectorAll(".setting-card-wrapper")
                    const currentWrapper = Object.values(settingCardWrappers).filter((wrapper) => wrapper.querySelector(".setting-card-name").textContent === settingName.textContent)[0]
                    const settingParameters = currentWrapper.querySelector(".setting-parameters")

                    settingParameters.style.display = settingParameters.style.display === "none" ? "block" : "none"
                })
            }
        },

        smallMods() {
            const modAlert_overlay = document.createElement("div");
            modAlert_overlay.classList.add("alert_overlay");
            modAlert_overlay.id = "modAlert_overlay";
            document.body.append(modAlert_overlay);

            const popup = document.getElementById("shop-popup");
            const removeShopPopup = document.getElementById("removeShopPopup");
            removeShopPopup.addEventListener("change", () => {
                const checked = removeShopPopup.checked;
                if (checked) {
                    popup.classList.add("hidden_full");
                    modSettings.removeShopPopup = true;
                } else {
                    popup.classList.remove("hidden_full");
                    modSettings.removeShopPopup = false;
                }
                updateStorage();
            });
            if (modSettings.removeShopPopup) {
                popup.classList.add("hidden_full");
                removeShopPopup.checked = true;
            }

            const auto = document.getElementById("autoClaimCoins");
            auto.addEventListener("change", () => {
                const checked = auto.checked;
                if (checked) {
                    modSettings.autoClaimCoins = true;
                } else {
                    modSettings.autoClaimCoins = false;
                }
                updateStorage();
            });
            if (modSettings.autoClaimCoins) {
                auto.checked = true;
            }

            const playBtn = document.getElementById("play-btn");
            playBtn.addEventListener("click", (e) => {
                activeCellX = null;
                activeCellY = null;
            });

            const gameTitle = document.getElementById("title");
            gameTitle.innerHTML = 'Sigmally<span style="display: block; font-size: 14px; font-family: Comic Sans MS ">Mod by <a href="https://discord.gg/D3FZvNGK" target="_blank">ShadowSoftware</a></span>';

            const nickName = document.getElementById("nick");
            nickName.maxLength = 50;
            nickName.type = "text";

            const nick = nickName.value;
            this.Username = nick;

            const topusersInner = document.querySelector(".top-users__inner");
            topusersInner.classList.add("scroll");
            topusersInner.style.border = "none";

            document.getElementById("signOutBtn").addEventListener("click", () => {
                unsafeWindow.user = null;
            });
        },

        credits() {
            console.log(`%c
 ░▒▓███████▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓██████▓▒░░▒▓████████▓▒░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░ ░▒▓██████▓▒░ ░▒▓█████████████▓▒░


 ░▒▓███████▓▒░░▒▓██████▓▒░░▒▓████████▓▒░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░░▒▓███████▓▒░░▒▓████████▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░         ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░         ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░
 ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░    ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓███████▓▒░░▒▓██████▓▒░
       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░         ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░
       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░         ░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░
░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░         ░▒▓█▓▒░    ░▒▓█████████████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░


`, 'background-color: black; color: green')
        },
        saveNames() {
            let savedNames = modSettings.savedNames;
            let savedNamesOutput = document.getElementById("savedNames");
            let saveNameBtn = document.getElementById("saveName");
            let saveNameInput = document.getElementById("saveNameValue");

            const createNameDiv = (name) => {
                let nameDiv = document.createElement("div");
                nameDiv.classList.add("NameDiv");

                let nameLabel = document.createElement("label");
                nameLabel.classList.add("NameLabel");
                nameLabel.innerText = name;

                let delName = document.createElement("button");
                delName.innerText = "X";
                delName.classList.add("delName");

                nameDiv.addEventListener("click", () => {
                    const name = nameLabel.innerText;
                    navigator.clipboard.writeText(name).then(() => {
                        this.modAlert(`Added the name '${name}' to your clipboard!`, "success");
                    });
                });

                delName.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete the name '" + nameLabel.innerText + "'?")) {
                        console.log("deleted name: " + nameLabel.innerText);
                        nameDiv.remove();
                        savedNames = savedNames.filter((n) => n !== nameLabel.innerText);
                        modSettings.savedNames = savedNames;
                        updateStorage();
                    }
                });

                nameDiv.appendChild(nameLabel);
                nameDiv.appendChild(delName);
                return nameDiv;
            };

            saveNameBtn.addEventListener("click", () => {
                if (saveNameInput.value == "") {
                    console.log("empty name");
                } else {
                    setTimeout(() => {
                        saveNameInput.value = "";
                    }, 10);

                    if (savedNames.includes(saveNameInput.value)) {
                        console.log("You already have this name saved!");
                        return;
                    }

                    let nameDiv = createNameDiv(saveNameInput.value);
                    savedNamesOutput.appendChild(nameDiv);

                    savedNames.push(saveNameInput.value);
                    modSettings.savedNames = savedNames;
                    updateStorage();
                }
            });

            if (savedNames.length > 0) {
                savedNames.forEach((name) => {
                    let nameDiv = createNameDiv(name);
                    savedNamesOutput.appendChild(nameDiv);
                });
            }
        },

        initStats() {
            const statElements = ["stat-time-played", "stat-highest-mass", "stat-total-deaths", "stat-total-mass"];
            this.storage = localStorage.getItem("game-stats");

            if (!this.storage) {
                this.storage = {
                    "time-played": 0, // seconds
                    "highest-mass": 0,
                    "total-deaths": 0,
                    "total-mass": 0,
                };
                localStorage.setItem("game-stats", JSON.stringify(this.storage));
            } else {
                this.storage = JSON.parse(this.storage);
            }

            statElements.forEach(rawStat => {
                const stat = rawStat.replace("stat-", "");
                const value = this.storage[stat];
                this.updateStatElm(rawStat, value);
            });

            this.session.bind(this)();
        },

        updateStat(key, value) {
            this.storage[key] = value;
            localStorage.setItem("game-stats", JSON.stringify(this.storage));
            this.updateStatElm(key, value);
        },

        updateStatElm(stat, value) {
            const element = document.getElementById(stat);

            if (element) {
                if (stat === "stat-time-played") {
                    const hours = Math.floor(value / 3600);
                    const minutes = Math.floor((value % 3600) / 60);
                    const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                    element.innerHTML = formattedTime;
                } else {
                    const formattedValue = stat === "stat-highest-mass" || stat === "stat-total-mass"
                    ? value > 999 ? `${(value / 1000).toFixed(1)}k` : value.toString()
                    : value.toString();
                    element.innerHTML = formattedValue;
                }
            }
        },

        session() {
            let playingInterval;
            let minPlaying = 0;
            let isPlaying = false;
            let dead = false;

            const playBtn = document.getElementById("play-btn");

            playBtn.addEventListener("click", () => {
                if (isPlaying) return;
                isPlaying = true;
                let timer = null;
                if (modSettings.playTimer) {
                    timer = document.createElement("span");
                    timer.classList.add("playTimer");
                    timer.innerText = "0m0s played";
                    document.body.append(timer);
                }
                let count = 0;
                playingInterval = setInterval(() => {
                    count++;
                    this.storage["time-played"]++;
                    if (count % 60 === 0) {
                        minPlaying++;
                    }
                    this.updateStat("time-played", this.storage["time-played"]);

                    if (modSettings.playTimer) {
                        this.updateTimeStat(timer, count);
                    }
                }, 1000);
            });

            setInterval(() => {
                if (isDeath() && !dead) {
                    clearInterval(playingInterval);
                    dead = true;
                    const playTimer = document.querySelector(".playTimer");
                    if (playTimer) playTimer.remove();
                    const score = parseFloat(document.getElementById("highest_mass").innerText);
                    const highest = this.storage["highest-mass"];

                    if (score > highest) {
                        this.storage["highest-mass"] = score;
                        this.updateStat("highest-mass", this.storage["highest-mass"]);
                    }

                    this.storage["total-deaths"]++;
                    this.updateStat("total-deaths", this.storage["total-deaths"]);

                    this.storage["total-mass"] += score;
                    this.updateStat("total-mass", this.storage["total-mass"]);
                    isPlaying = false;
                } else if (!isDeath()) {
                    dead = false;
                }
            });
        },
        updateTimeStat(el, seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const timeString = `${minutes}m${remainingSeconds}s`;

            el.innerText = `${timeString} played`;
        },

        fps() {
            const byId = (id) => document.getElementById(id);
            const fpsMode = byId("fpsMode");
            const hideFood = byId("fps-hideFood");
            const removeNames = byId("fps-remNames");
            const shortlongNames = byId("fps-shortenLongNames");
            const removeTextoutlines = byId("fps-remOutlines");
            const allElements = document.querySelectorAll(".fpsCheckbox");

            const toggleFPSmode = (turnOn) => {
                modSettings.fps.fpsMode = turnOn;
                if (turnOn) {
                    console.log("FPS mode enabled");

                    allElements.forEach(elm => {
                        elm.setAttribute("disabled", "true");
                    });
                    toggleNames();

                    const cb = document.getElementById("showSkins");
                    if (!cb.checked) {
                        cb.click();
                    }

                } else {
                    console.log("FPS mode disabled");

                    allElements.forEach(elm => {
                        elm.removeAttribute("disabled");
                    });

                    toggleNames();
                }
                updateStorage();
            };

            const toggleNames = () => {
                modSettings.fps.showNames = removeNames.checked;
                const cb = document.getElementById("showNames");
                if (cb.checked && removeNames.checked) {
                    cb.click();
                } else {
                    cb.click();
                }
                updateStorage();
            };

            // checkbox events
            fpsMode.addEventListener("change", () => {
                toggleFPSmode(fpsMode.checked);
            });
            hideFood.addEventListener("change", () => {
                modSettings.fps.hideFood = hideFood.checked;
                updateStorage();
            });
            removeNames.addEventListener("change", () => {
                toggleNames();
            });
            shortlongNames.addEventListener("change", () => {
                modSettings.fps.shortLongNames = shortlongNames.checked;
                updateStorage();
            });
            removeTextoutlines.addEventListener("change", () => {
                modSettings.fps.removeOutlines = removeTextoutlines.checked;
                updateStorage();
            });

            // set checkbox state
            const loadStorage = () => {
                const option = modSettings.fps;
                if (option.fpsMode) {
                    fpsMode.checked = true;
                }
                if (option.hideFood) {
                    hideFood.checked = true;
                }
                if (option.removeNames) {
                    removeNames.checked = true;
                }
                if (option.shortlongNames) {
                    shortlongNames.checked = true;
                }
                if (option.removeOutlines) {
                    removeTextoutlines.checked = true;
                }
            };

            loadStorage();
        },

        Macros() {
            const KEY_SPLIT = this.splitKey;
            let ff = null;
            let keydown = false;
            let open = false;
            const canvas = document.getElementById("canvas");
            const freezeType = document.getElementById("freezeType");
            const mod_menu = document.querySelector(".mod_menu");
            let freezeKeyPressed = false;
            let freezeMouseClicked = false;
            let freezeOverlay = null;


            freezeType.value = modSettings.freezeType;
            freezeType.addEventListener("change", () => {
                modSettings.freezeType = freezeType.value;
                updateStorage();
            });

            function fastMass() {
                let x = 15;
                while (x--) {
                    keypress("w", "KeyW");
                }
            }

            function splitRecursive(times) {
                if (times > 0) {
                    window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                    window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                    splitRecursive(times - 1);
                }
            }

            function split() {
                splitRecursive(1);
            }

            function split2() {
                splitRecursive(2);
            }

            function split3() {
                splitRecursive(3);
            }

            function split4() {
                splitRecursive(4);
            }

            async function selfTrick() {
                let i = 4;

                while (i--) {
                    splitRecursive(1);
                    await Math.delay(20)
                }
            }
            async function doubleTrick() {
                let i = 2;

                while (i--) {
                    splitRecursive(1);
                    await Math.delay(20)
                }
            }

            function mouseToScreenCenter() {
                const screenCenterX = canvas.width / 2
                const screenCenterY = canvas.height / 2

                mousemove(screenCenterX, screenCenterY)

                return {
                    x: screenCenterX,
                    y: screenCenterY
                }
            }

            async function verticalLine() {
                let i = 4;

                while (i--) {
                    const centerXY = mouseToScreenCenter();
                    const offsetUpX = centerXY.x
                    const offsetUpY = centerXY.y - 100
                    const offsetDownX = centerXY.x
                    const offsetDownY = centerXY.y + 100

                    await Math.delay(50)

                    mousemove(offsetUpX, offsetUpY)

                    await Math.delay(80)

                    split();

                    await Math.delay(160)

                    mousemove(offsetDownX, offsetDownY)

                    if (i == 0) break

                    await Math.delay(80)

                    split();
                }

                freezePlayer("hold", false);
            }

            function freezePlayer(type, mouse) {
                if(freezeType.value === "hold" && type === "hold") {
                    const CX = canvas.width / 2;
                    const CY = canvas.height / 2;

                    mousemove(CX, CY);
                } else if(freezeType.value === "press" && type === "press") {
                    if(!freezeKeyPressed) {
                        const CX = canvas.width / 2;
                        const CY = canvas.height / 2;

                        mousemove(CX, CY);


                        freezeOverlay = document.createElement("div");
                        freezeOverlay.innerHTML = `
                                <span style="position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); color: #fff; font-size: 26px; user-select: none;">Movement Stopped</span>
                            `;
                        freezeOverlay.style = "position: absolute; top: 0; left: 0; z-index: 99; width: 100%; height: 100vh; overflow: hidden;";

                        if (mouse && (modSettings.m1 === "freeze" || modSettings.m2 === "freeze")) {
                            freezeOverlay.addEventListener("mousedown", (e) => {
                                if (e.button === 0 && modSettings.m1 === "freeze") { // Left mouse button (1)
                                    handleFreezeEvent();
                                }
                                if (e.button === 2 && modSettings.m2 === "freeze") { // Right mouse button (2)
                                    handleFreezeEvent();
                                }
                            });

                            if (modSettings.m2 === "freeze") {
                                freezeOverlay.addEventListener("contextmenu", (e) => {
                                    e.preventDefault();
                                });
                            }
                        }

                        function handleFreezeEvent() {
                            if (freezeOverlay != null) freezeOverlay.remove();
                            freezeOverlay = null;
                            freezeKeyPressed = false;
                        }


                        document.querySelector(".body__inner").append(freezeOverlay)

                        freezeKeyPressed = true;
                    } else {
                        if(freezeOverlay != null) freezeOverlay.remove();
                        freezeOverlay = null;
                        freezeKeyPressed = false;
                    }
                }
            }

            function sendLocation() {
                if (!activeCellX || !activeCellY) return;

                const gamemode = document.getElementById("gamemode");
                const coordinatesToCheck = (gamemode.value === "eu0.sigmally.com/ws/") ? coordinates : coordinates2;

                let field = "";

                for (const label in coordinatesToCheck) {
                    const { min, max } = coordinatesToCheck[label];

                    if (
                        activeCellX >= min.x &&
                        activeCellX <= max.x &&
                        activeCellY >= min.y &&
                        activeCellY <= max.y
                    ) {
                        field = label;
                        break;
                    }
                }

                const locationText = modSettings.chatSettings.locationText || field;
                const message = locationText.replace('{pos}', field);
                sendChat(message);
            }

            function toggleSettings(setting) {
                const settingElement = document.querySelector(`input#${setting}`);
                if (settingElement) {
                    settingElement.click();
                } else {
                    console.error(`Setting "${setting}" not found`);
                }
            }


            document.addEventListener("keyup", (e) => {
                const key = e.key.toLowerCase();
                if (key == modSettings.keyBindings.rapidFeed && keydown) {
                    clearInterval(ff);
                    keydown = false;
                }
            });
            document.addEventListener("keydown", (e) => {
                const key = e.key.toLowerCase();

                if (key == "p") {
                    e.stopPropagation();
                }
                if (key == "tab") {
                    e.preventDefault();
                }

                if (document.activeElement instanceof HTMLInputElement && document.activeElement.type == 'text') return;

                if (key == modSettings.keyBindings.toggleMenu) {
                    if (!open) {
                        mod_menu.style.display = "flex";
                        setTimeout(() => {
                            mod_menu.style.opacity = 1;
                        }, 10);
                        open = true;
                    } else {
                        mod_menu.style.opacity = 0;
                        setTimeout(() => {
                            mod_menu.style.display = "none";
                        }, 300);
                        open = false;
                    }
                }

                if (key == modSettings.keyBindings.freezePlayer) {
                    if (menuClosed()) {
                        freezePlayer(modSettings.freezeType, false);
                    }
                }

                if (key == modSettings.keyBindings.rapidFeed && !keydown) {
                    keydown = true;
                    ff = setInterval(fastMass, 50);
                }
                if (key == modSettings.keyBindings.doubleSplit) {
                    split2();
                }

                if (key == modSettings.keyBindings.tripleSplit) {
                    split3();
                }

                if (key == modSettings.keyBindings.quadSplit) {
                    split4();
                }

                if (key == modSettings.keyBindings.selfTrick) {
                    selfTrick();
                }

                if (key == modSettings.keyBindings.doubleTrick) {
                    doubleTrick();
                }

                if (key == modSettings.keyBindings.verticalSplit) {
                    verticalLine();
                }

                if (key == modSettings.keyBindings.location) {
                    sendLocation();
                }

                if (key == modSettings.keyBindings.toggleChat) {
                    mods.toggleChat();
                }

                if (key == modSettings.keyBindings.toggleNames) {
                    toggleSettings("showNames");
                }

                if (key == modSettings.keyBindings.toggleSkins) {
                    toggleSettings("showSkins");
                }

                if (key == modSettings.keyBindings.toggleAutoRespawn) {
                    toggleSettings("autoRespawn");
                }
            });

            let mouseFastFeed;

            canvas.addEventListener("mousedown", (e) => {
                if (e.button === 0) { // Left mouse button (0)
                    if (modSettings.m1 === "fastfeed") {
                        mouseFastFeed = setInterval(fastMass, 15);
                    } else if (modSettings.m1 === "split1") {
                        split();
                    } else if (modSettings.m1 === "split2") {
                        split2();
                    } else if (modSettings.m1 === "split3") {
                        split3();
                    } else if (modSettings.m1 === "split4") {
                        split4();
                    } else if (modSettings.m1 === "freeze") {
                        freezePlayer(modSettings.freezeType, true);
                    } else if (modSettings.m1 === "dTrick") {
                        doubleTrick();
                    } else if (modSettings.m1 === "sTrick") {
                        selfTrick();
                    }
                } else if (e.button === 2) { // Right mouse button (2)
                    e.preventDefault();
                    if (modSettings.m2 === "fastfeed") {
                        mouseFastFeed = setInterval(fastMass, 15);
                    } else if (modSettings.m2 === "split1") {
                        split();
                    } else if (modSettings.m2 === "split2") {
                        split2();
                    } else if (modSettings.m2 === "split3") {
                        split3();
                    } else if (modSettings.m2 === "split4") {
                        split4();
                    } else if (modSettings.m2 === "freeze") {
                        freezePlayer(modSettings.freezeType, true);
                    } else if (modSettings.m2 === "dTrick") {
                        doubleTrick();
                    } else if (modSettings.m2 === "sTrick") {
                        selfTrick();
                    }
                }
            });

            canvas.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            });

            canvas.addEventListener("mouseup", () => {
                clearInterval(mouseFastFeed);
            });

            const macroSelectHandler = (macroSelect, key) => {
                macroSelect.value = modSettings[key] || "none";

                macroSelect.addEventListener("change", () => {
                    const selectedOption = macroSelect.value;

                    const optionActions = {
                        "none": () => {
                            modSettings[key] = null;
                        },
                        "fastfeed": () => {
                            modSettings[key] = "fastfeed";
                        },
                        "split": () => {
                            modSettings[key] = "split";
                        },
                        "split2": () => {
                            modSettings[key] = "split2";
                        },
                        "split3": () => {
                            modSettings[key] = "split3";
                        },
                        "split4": () => {
                            modSettings[key] = "split4";
                        },
                        "freeze": () => {
                            modSettings[key] = "freeze";
                        },
                        "dTrick": () => {
                            modSettings[key] = "dTrick";
                        },
                        "sTrick": () => {
                            modSettings[key] = "sTrick";
                        },
                    };

                    if (optionActions[selectedOption]) {
                        optionActions[selectedOption]();
                        updateStorage();
                    }
                });
            };

            const m1_macroSelect = document.getElementById("m1_macroSelect");
            const m2_macroSelect = document.getElementById("m2_macroSelect");

            macroSelectHandler(m1_macroSelect, "m1");
            macroSelectHandler(m2_macroSelect, "m2");
        },

        setInputActions() {
            const numModInputs = 15;

            const macroInputs = Array.from({ length: numModInputs }, (_, i) => `modinput${i + 1}`);

            macroInputs.forEach((modkey) => {
                const modInput = document.getElementById(modkey);

                document.addEventListener("keydown", (event) => {
                    if (document.activeElement !== modInput) return;

                    if (event.key === "Backspace") {
                        modInput.value = "";
                        let propertyName = modInput.name;
                        modSettings.keyBindings[propertyName] = "";
                        updateStorage();
                        return;
                    }

                    modInput.value = event.key.toLowerCase();

                    if (modInput.value !== "" && (macroInputs.filter((item) => item === modInput.value).length > 1 || macroInputs.some((otherKey) => {
                        const otherInput = document.getElementById(otherKey);
                        return otherInput !== modInput && otherInput.value === modInput.value;
                    }))) {
                        alert("You can't use 2 keybindings at the same time.");
                        setTimeout(() => {modInput.value = ""})
                        return;
                    }

                    let propertyName = modInput.name;
                    modSettings.keyBindings[propertyName] = modInput.value;

                    updateStorage();
                });
            });
        },

        mainMenu() {
            let menucontent = document.querySelector(".menu-center-content");
            menucontent.style.margin = "auto";

            const discordlinks = document.createElement("div");
            discordlinks.setAttribute("id", "dclinkdiv")
            discordlinks.innerHTML = `
            <iframe src="https://discord.com/widget?id=1206747938378747914&theme=dark" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                `;
            document.getElementById("discord_link").remove();
            document.getElementById("menu").appendChild(discordlinks)

            let clansbtn = document.querySelector("#clans_and_settings button");
            clansbtn.innerHTML = "Clans";
            document.querySelectorAll("#clans_and_settings button")[1].removeAttribute("onclick");
        },

        respawn() {
            const __line2 = document.getElementById("__line2")
            const c = document.getElementById("continue_button")
            const p = document.getElementById("play-btn")

            if (__line2.classList.contains("line--hidden")) return

            this.respawnTime = null

            setTimeout(() => {
                c.click()
                p.click()
            }, 20);

            this.respawnTime = Date.now()

        },

        clientPing() {
            const pingElement = document.createElement("span");
            pingElement.innerHTML = `Client Ping: 0ms`;
            pingElement.id = "clientPing";
            pingElement.style = `
                position: absolute;
                right: 10px;
                bottom: 5px;
                color: #fff;
                font-size: 1.8rem;
            `
            document.querySelector(".mod_menu").append(pingElement);

            this.ping.intervalId = setInterval(() => {
                if (client.readyState != 1) return;
                this.ping.start = Date.now();

                client.send({
                    type: "get-ping",
                });
            }, 2000);
        },

        createMinimap() {
            const dataContainer = document.createElement("div");
            dataContainer.classList.add("minimapContainer");
            dataContainer.innerHTML = `
                <span class="hidden tournament_time"></span>
            `;
            const playBtn = document.getElementById("play-btn")
            const miniMap = document.createElement("canvas");
            miniMap.width = 200;
            miniMap.height = 200;
            miniMap.classList.add("minimap");
            this.canvas = miniMap;

            let viewportScale = 1

            document.body.append(dataContainer);
            dataContainer.append(miniMap);

            function resizeMiniMap() {
                viewportScale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080)

                miniMap.width = miniMap.height = 200 * viewportScale
            }

            resizeMiniMap()

            window.addEventListener("resize", resizeMiniMap)

            minimapUpdate();
        },

        tagsystem() {
            const nick = document.querySelector("#nick");
            const tagElement = document.createElement("input");
            const tagText = document.querySelector(".tagText");

            tagElement.classList.add("form-control");
            tagElement.placeholder = "tag";
            tagElement.id = "tag";
            tagElement.maxLength = 3;

            const pnick = nick.parentElement;
            pnick.style = "display: flex; gap: 5px;";

            tagElement.addEventListener("input", (e) => {
                e.stopPropagation();
                const tagValue = tagElement.value;

                tagText.innerText = tagValue ? `Tag: ${tagValue}` : "";

                modSettings.tag = tagElement.value;
                updateStorage();
                client.send({
                    type: "update-tag",
                    content: modSettings.tag,
                });
                const miniMap = this.canvas;
                const ctx = miniMap.getContext("2d");
                ctx.clearRect(0, 0, miniMap.width, miniMap.height);
                this.miniMapData = [];
            });

            nick.insertAdjacentElement("beforebegin", tagElement);
        },
        updateNick() {
            const nick = document.getElementById("nick");
            this.nick = nick.value;
            nick.addEventListener("input", () => {
                this.nick = nick.value;
            });
        },

        checkConn() {
            const gamemode = document.getElementById("gamemode");
            gamemode.addEventListener("change", () => {
                getWs();
            });
            setInterval(() => {
                if (unsafeWindow.socket && unsafeWindow.socket.readyState === 3) {
                    console.log("Reconnecting...");
                    getWs();
                }
            }, 1000);
        },

        load() {
            // Load game faster
            function randomPos() {
                let eventOptions = {
                    clientX: Math.floor(Math.random() * window.innerWidth),
                    clientY: Math.floor(Math.random() * window.innerHeight),
                    bubbles: true,
                    cancelable: true
                };

                let event = new MouseEvent('mousemove', eventOptions);

                document.dispatchEvent(event);
            }
            setInterval(randomPos);
            setTimeout(() => clearInterval(), 500);

            getWs();
            const intervalId = setInterval(() => {
                if (unsafeWindow.socket && unsafeWindow.socket.readyState === 1) {
                    this.createMenu();
                    this.checkConn();
                    client = new modClient();
                    unsafeWindow.disconnect = client.close;
                    clearInterval(intervalId);
                }
            }, 100);
        },

        showTournament(data) {
            let msg = null;
            let intervalId = setInterval(() => {
                if (isDeath() || !menuClosed()) {
                    clearInterval(intervalId);
                    intervalId = null;
                    if (msg) msg.remove();

                    const { name, organizer, users, time, rounds, prizes, totalUsers } = data;

                    const teamHTML = (team, color) => team.map(user => `
                        <div class="t_profile">
                            <img src="${user.imageURL}" width="50" />
                            <span>${user.name}</span>
                        </div>
                    `).join('');

                    const addBrTags = text => text.replace(/(\d+\.\s)/g, '<br>$1');

                    const overlay = document.createElement("div");
                    overlay.classList.add("mod_overlay");
                    overlay.id = "tournaments_preview";
                    overlay.innerHTML = `
                        <div class="tournaments-wrapper">
                            <h1>${name}</h1>
                            <span>${organizer}</span>
                            <hr />
                            <div class="flex" style="gap: 10px; align-items: center;">
                                <div class="flex blue_container">
                                    <div class="blue_polygon"></div>
                                    <div class="team blue">${teamHTML(users[0])}</div>
                                </div>
                                <div class="vs">
                                    <img src="https://static.vecteezy.com/system/resources/previews/009/380/763/original/thunderbolt-clipart-design-illustration-free-png.png" width="50" height="75" style="filter: drop-shadow(0px 4px 8px #E9FF4D);" />
                                    <span>VS</span>
                                </div>
                                <div class="flex red_container">
                                    <div class="team red">${teamHTML(users[1])}</div>
                                    <div class="red_polygon"></div>
                                </div>
                            </div>
                            <details>
                                <summary>⮞ Match Details</summary>
                                Rounds: ${rounds}<br>
                                prizes: ${addBrTags(prizes)}
                                <br>
                                Time: ${time}
                            </details>
                            <span>Ready (<span id="t-ready-0">0</span>/${totalUsers})</span>
                            <button class="btn btn-success" id="btn_ready">Ready</button>
                        </div>
                    `;
                    document.body.append(overlay);

                    const btn_ready = document.getElementById("btn_ready");
                    btn_ready.addEventListener("click", () => {
                        btn_ready.disabled = "disabled";
                        client.send({
                            type: "tournament-ready",
                            content: modSettings.tag,
                        });
                    });
                } else if (!msg) {
                    document.getElementById("play-btn").disabled = "disabled";
                    msg = document.createElement("div");
                    msg.classList.add("tournament_alert", "f-column");
                    msg.innerHTML = `<span style="font-size: 14px">Please lose your mass to start the tournament!</span>`;
                    document.body.append(msg);
                }
            });
        },
        startTournament() {
            const tournaments_preview = document.getElementById("tournaments_preview");
            if (tournaments_preview) tournaments_preview.remove();
            document.getElementById("play-btn").removeAttribute("disabled");
            const overlay = document.createElement("div");
            overlay.classList.add("mod_overlay");
            overlay.innerHTML = `
                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/START!.png" />
            `;
            document.body.append(overlay);

            setTimeout(() => {
                overlay.remove();
            }, 1000);

            this.TournamentTimer();
        },
        TournamentTimer(altTime) {
            let time = null;
            if (altTime && !this.tData) time = altTime;
            if (this.tData.time) {
                time = this.tData.time;
            }

            let totalTimeInSeconds = parseTimeToSeconds(time);
            let currentTimeInSeconds = totalTimeInSeconds;

            function parseTimeToSeconds(timeString) {
                const timeComponents = timeString.split(/[ms]/);
                const minutes = parseInt(timeComponents[0], 10) || 0;
                const seconds = parseInt(timeComponents[1], 10) || 0;
                return minutes * 60 + seconds;
            }

            function updTime() {
                let minutes = Math.floor(currentTimeInSeconds / 60);
                let seconds = currentTimeInSeconds % 60;

                const tournamentTime = document.querySelector(".tournament_time");
                if (tournamentTime.classList.contains("hidden")) {
                    tournamentTime.classList.remove("hidden");
                }
                tournamentTime.textContent = `${minutes}m ${seconds}s`;

                if (currentTimeInSeconds <= 0) {
                    clearInterval(timerInterval);
                    timeIsUp();
                } else {
                    currentTimeInSeconds--;
                }
            }

            function timeIsUp() {
                document.querySelector(".tournament_time").classList.add("hidden");
                console.log("Time is up!");
            }

            const timerInterval = setInterval(updTime, 1000);
        },
        getScore(data) {
            document.getElementById("play-btn").disabled = "disabled";
            if (data.stopped) {
                client.send({
                    type: "t-score",
                    content: {
                        email: unsafeWindow.user.email,
                        score: 0,
                    },
                });
                return;
            }
            let sentScore = false;
            _getScore = true;

            let sendScore = null;
            sendScore = setInterval(() => {
                if (sentScore) {
                    clearInterval(sendScore);
                    sendScore = null;
                    return;
                };

                if (menuClosed()) {
                    if (isDeath()) {
                        client.send({
                            type: "t-score",
                            content: {
                                email: unsafeWindow.user.email,
                                score: lastScore,
                            },
                        });
                        sentScore = true;
                    }
                } else {
                    client.send({
                        type: "t-score",
                        content: {
                            email: unsafeWindow.user.email,
                            score: 0,
                        },
                    });
                    sentScore = true;
                }
            });

            const msg = document.createElement("div");
            msg.classList.add("tournament_alert", "f-column");
            msg.id = "t-alert-die";
            msg.innerHTML = `
                <span style="font-size: 14px">Please lose your mass to end the round</span>
                <span style="font-size: 12px" id="t-myScore">Your score: 0</span>
                <div class="justify-sb">
                    <span style="font-size: 12px;">⚠ Do not refresh the page!</span>
                    <span id="usersDead">(0/${this.tData.totalUsers})</span>
                </div>
            `;
            document.body.append(msg);
        },

        winnersMessage(winners) {
            let winnersMessage = "";

            if (winners.length === 1) {
                winnersMessage = `The winner is ${noXSS(winners[0].name)}`;
            } else if (winners.length === 2) {
                winnersMessage = `The winners are ${noXSS(winners[0].name)} and ${noXSS(winners[1].name)}`;
            } else if (winners.length > 2) {
                const lastWinner = winners.pop();
                const winnersNames = winners.map(winner => winner.name).join(', ');
                winnersMessage = `The winners are ${noXSS(winnersNames)}, and ${noXSS(lastWinner.name)}`;
            }
            return winnersMessage;
        },

        roundEnd(data) {
            if (data.stopped) {
                const overlay = document.createElement("div");
                overlay.classList.add("mod_overlay", "f-column");
                overlay.id = "round-results";
                overlay.innerHTML = `
                <div class="tournaments-wrapper" style="height: 400px;">
                    <span style="font-size: 24px; font-weight: 600">End of round ${round}!</span>
                    <span>${winnersMessage}</span>
                    <div style="display: flex; justify-content: space-evenly; width: 100%; margin-top: 65px; align-items: center;">
                        ${createStats()}
                    </div>
                    <div class="flex g-5" style="margin-top: auto; align-self: end; align-items: center">
                        <span id="round-ready">Ready (0/${maxReady})</span>
                        <button class="btn btn-success" id="tournament-ready">Ready</button>
                    </div>
                </div>
            `;
                document.body.append(overlay);
                return;
            }
            document.getElementById("t-alert-die").remove();
            const { round, winners, usersLost, maxReady } = data;

            console.log(winners, winners[0].state);

            const winnersMessage = this.winnersMessage(winners);
            function createStats() {
                const winnerImages = winners.map(winner => `<img src="${winner.imageURL}" class="tournament-profile" />`).join('');
                const usersLostImages = usersLost.map(user => `<img src="${user.imageURL}" class="tournament-profile" />`).join('');

                return (`
                    <div class="f-column g-5">
                        <span class="text-center" style="font-size: 24px; font-weight: 600;">${winners[0].state}</span>
                        <div class="f-column g-5">
                            <div class="flex g-10" style="justify-content: center;">
                                ${winnerImages}
                            </div>
                            <span>Score: ${winners[0].teamScore}</span>
                        </div>
                    </div>
                    <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/trophy.png" width="60" />
                    <div class="f-column g-5">
                        <span class="text-center" style="font-size: 24px; font-weight: 600;">${usersLost[0].state}</span>
                        <div class="f-column g-5">
                            <div class="flex g-10 style="justify-content: center;"">
                                ${usersLostImages}
                            </div>
                            <span>Score: ${usersLost[0].teamScore}</span>
                        </div>
                    </div>
                `);
            }

            const overlay = document.createElement("div");
            overlay.classList.add("mod_overlay", "f-column");
            overlay.id = "round-results";
            overlay.innerHTML = `
                <div class="tournaments-wrapper" style="height: 400px;">
                    <span style="font-size: 24px; font-weight: 600">End of round ${round}!</span>
                    <span>${winnersMessage}</span>
                    <div style="display: flex; justify-content: space-evenly; width: 100%; margin-top: 65px; align-items: center;">
                        ${createStats()}
                    </div>
                    <div class="flex g-5" style="margin-top: auto; align-self: end; align-items: center">
                        <span id="round-ready">Ready (0/${maxReady})</span>
                        <button class="btn btn-success" id="tournament-ready">Ready</button>
                    </div>
                </div>
            `;
            document.body.append(overlay);

            const ready = document.getElementById("tournament-ready");
            ready.addEventListener("click", () => {
                client.send({
                    type: "round-ready",
                });
                ready.disabled = "disabled";
            });
        },

        nextRound(data) {
            console.log(`Round ${data.round} started!`);
            document.getElementById("play-btn").removeAttribute("disabled");
            const roundResults = document.getElementById("round-results");
            if (roundResults) roundResults.remove();

            const overlay = document.createElement("div");
            overlay.classList.add("mod_overlay");
            overlay.innerHTML = `
                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/START!.png" />
                <span class="tround_text">Round ${data.round}/${data.max}</span>
            `;
            document.body.append(overlay);

            setTimeout(() => {
                overlay.remove();
            }, 1000);

            this.TournamentTimer(data.duration);
        },

        endTournament(data) {
            document.getElementById("play-btn").removeAttribute("disabled");
            if (data.stopped) {
                this.tData = {};
                this.modAlert("Tournamend has been canceled.", "danger");
                return;
            }
            const { winners, usersLost, vs } = data;
            const dieAlert = document.getElementById("t-alert-die");
            if (dieAlert) dieAlert.remove();

            const winnersMessage = this.winnersMessage(winners);

            const isWinner = winners.some((user) => user.email === unsafeWindow.user.email);
            let badgeClaimed = false;

            const winnerImages = winners.map(winner => `<img src="${winner.imageURL}" draggable="false" class="tournament-profile" />`).join('');

            const overlay = document.createElement("div");
            overlay.classList.add("mod_overlay", "f-column");
            overlay.innerHTML = `
                <div class="tournaments-wrapper" style="height: 400px;">
                    <span style="font-size: 24px; font-weight: 600">End of the ${vs}v${vs} Tournament!</span>
                    <span>${winnersMessage}</span>
                    <div style="display: flex; justify-content: space-evenly; width: 100%; margin-top: 35px; align-items: center;">
                        <div class="f-column g-5">
                            <span class="text-center" style="font-size: 24px; font-weight: 600;">${winners[0].state}:${usersLost[0].state}</span>
                            <div class="flex g-10" style="align-items: center">
                                ${winnerImages}
                            </div>
                        </div>
                    </div>
                    <span style="font-size: 22px;">${isWinner ? 'You Won!' : 'You Lost!'}</span>
                    <div class="justify-sb" style="margin-top: auto; width: 100%; align-items: end;">
                        <div class="f-column g-5" style="display: ${isWinner ? 'flex' : 'none'}; align-items: center;" id="badgeWrapper">
                            <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/trophy.png" width="40" draggable="false" />
                            <button class="btn-cyan" id="claim-badge">Claim Badge</button>
                        </div>
                        <button class="btn" style="background: #CC5353;color:#fff;width: 100px;" id="tournament-leave">Leave</button>
                    </div>
                </div>
            `;
            document.body.append(overlay);

            const leave = document.getElementById("tournament-leave");
            leave.addEventListener("click", () => {
                this.tData = {};
                if (isWinner && !badgeClaimed) {
                    this.modAlert("Don't forget to claim your badge!", "default");
                } else {
                    overlay.remove();
                }
            });

            const claimBadge = document.getElementById("claim-badge");
            claimBadge.addEventListener("click", () => {
                fetch("https://app.czrsd.com/sigmod/badge", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: unsafeWindow.user._id,
                        badge: "tournament-winner",
                    }),
                }).then(res => {
                    return res.json();
                }).then(data => {
                    console.log(data);
                    if (data.success) {
                        claimedModal();
                        document.getElementById("badgeWrapper").style.display = "none";
                        badgeClaimed = true;
                    } else {
                        this.modAlert("You already have this badge!", "default");
                        document.getElementById("badgeWrapper").style.display = "none";
                        badgeClaimed = true;
                    }
                }).catch(error => {
                    this.modAlert("Error? Try again.", "danger");
                });
            });

            function claimedModal() {
                const overlay = document.createElement("div");
                overlay.classList.add("mod_overlay");
                overlay.innerHTML = `
                    <div class="claimedBadgeWrapper">
                        <span style="font-size: 24px">Claimed Badge!</span>
                        <span style="color: #A1A1A1">This badge is now added to your mod profile</span>
                        <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/trophy.png" draggable="false" width="60" />
                        <button class="btn-cyan" id="closeBadgeModal" style="margin-top: auto">OK</button>
                    </div>
                `;
                document.body.append(overlay);

                document.getElementById("closeBadgeModal").addEventListener("click", () => {
                    overlay.remove();
                });
            }
        },
        modAlert(text, type) {
            const overlay = document.querySelector("#modAlert_overlay");
            const alertWrapper = document.createElement("div");
            alertWrapper.classList.add("infoAlert")
            if (type == "success") {
                alertWrapper.classList.add("modAlert-success")
            } else if (type == "danger") {
                alertWrapper.classList.add("modAlert-danger")
            } else if (type == "default") {
                alertWrapper.classList.add("modAlert-default")
            }

            alertWrapper.innerHTML = `
                <span>${noXSS(text)}</span>
                <div class="modAlert-loader"></div>
            `;

            overlay.append(alertWrapper);

            setTimeout(() => {
                alertWrapper.remove();
            }, 2000);
        },

        createMenu() {
            this.smallMods();
            this.menu();
            this.credits();
            this.chat();
            this.Macros();
            this.Themes();
            this.updateNick();
            this.clientPing();
            this.tagsystem();
            this.createMinimap();
            this.saveNames();
            this.setInputActions();
            this.game();
            this.mainMenu();
            this.macroSettings();
            this.fps();
            this.initStats();

            const styleTag = document.createElement("style")
            styleTag.innerHTML = this.style;
            document.head.append(styleTag);

            setInterval(() => {
                if (modSettings.AutoRespawn && this.respawnTime && Date.now() - this.respawnTime >= this.respawnCooldown) {
                    this.respawn();
                }
            })
        }
    }
    window.setInterval = new Proxy(setInterval, {
        apply(target, _this, args) {
            if (args[1] === (1000 / 7)) {
                args[1] = 0
            }

            return target.apply(_this, args)
        }
    });
    Math.delay = function(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms)
        })
    }

    const mods = new mod();
})();