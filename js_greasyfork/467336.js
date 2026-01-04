// ==UserScript==
// @name         CopyBot renew
// @namespace    BOJS script
// @version      1.4.1
// @description  For all questions and suggestions Nab#9255
// @author       Nab#9255
// @match        *://ourworldofpixels.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldofpixels.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467336/CopyBot%20renew.user.js
// @updateURL https://update.greasyfork.org/scripts/467336/CopyBot%20renew.meta.js
// ==/UserScript==
//#UnmodCygnus

(function () {
    let copyser;
    let CopyPlayer = [[0], [0]];
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    let moduleList = []

    let originalFunction = Object.defineProperty
    Object.defineProperty = function () {
        let returnValue = originalFunction.call(originalFunction, ...arguments)
        let object = arguments[0]
        if (!object?.__esModule) return returnValue
        moduleList.push(object)
        if (moduleList.length === 1) {
            setTimeout(() => {
                finishedLoading()
            }, 0)
        }
        return returnValue
    }

    let modules = {}

    function finishedLoading() {
        console.log(moduleList);
        modules.bucket = moduleList.find(module => module.Bucket)
        modules.canvas_renderer = moduleList.find(module => module.unloadFarClusters)
        modules.captcha = moduleList.find(module => module.loadAndRequestCaptcha)
        modules.conf = moduleList.find(module => module.EVENTS)
        modules.context = moduleList.find(module => module.createContextMenu)
        modules.Fx = moduleList.find(module => module.PLAYERFX)
        modules.global = moduleList.find(module => module.PublicAPI)
        modules.local_player = moduleList.find(module => module.networkRankVerification)
        modules.main = moduleList.find(module => module.revealSecrets)
        modules.misc = moduleList.find(module => module.setCookie)
        modules.net = moduleList.find(module => module.net)
        modules.Protocol = moduleList.find(module => module.Protocol)
        modules.Player = moduleList.find(module => module.Player)
        modules.tools = moduleList.find(module => module.showToolsWindow)
        modules.windowsys = moduleList.find(module => module.windowSys)
        modules.World = moduleList.find(module => module.World)

        modules.events = modules.global.eventSys.constructor
        modules.all = moduleList //it's unsafe to access these by index as those values may change

        OWOP.net = modules.net.net
        OWOP.Protocol = modules.Protocol.Protocol
        modules.main.revealSecrets = () => { }

        OWOP.main = modules.main;
        //modules.main.showPlayerList(!0);

        //add OWOP.eventSys
        OWOP.eventSys = modules.global.eventSys

        //add OWOP.World
        OWOP.World = modules.World.World

        //add OWOP.misc
        OWOP.misc = modules.main.misc

        //add OWOP.EVENTS
        OWOP.EVENTS = modules.conf.EVENTS;

        //add OWOP.require
        OWOP.require = function getModule(name) {
            if (modules[name]) {
                return modules[name]
            } else {
                throw new Error(`No module by the name ${name}`)
            }
        }
    }

    window.origWS = window.WebSocket;
    setInterval(() => {
        if (window.WebSocket != window.origWS) {
            window.WebSocket = window.origWS;
        }
    }, 1000)
    let ips = [];
    function genCol(ip) {
        if (!ips[`${ip}`]) {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            ips[`${ip}`] = `rgb(${r}, ${g}, ${b})`;

            return `rgb(${r}, ${g}, ${b})`;
        } else return ips[`${ip}`];
    }
    function load() {
        //OWOP.secrets.showPlayerList(!0);
        if (!OWOP.EVENTS) {
            OWOP.EVENTS = OWOP.events;
            OWOP.tools = OWOP.tool;
        }
        var style = document.createElement('style');
        style.innerHTML = `
        #botsTab {
            max-height: 182px !important;
        }

        #player-list button {
            height: 20px !important;
        }

        #assetsid {
            max-width: 305.15px !important;
            max-height: 50px !important;
            overflow-y: scroll !important;
            display: flex !important;
            flex-wrap: wrap !important;
            transition: .2s !important;
            justify-content: center !important;
        }

        #assetsid:hover {
            max-height: 200px !important;
        }

        .copyUser,
                  copypref {
            text-shadow: 1px 1px #421754 !important;
            color: #e4951a !important;
        }

        copyuseful {
            font-size: 0px;
            text-shadow: 1px 1px #421754 !important;
            color: #e4951a !important;
            transition: .2s !important;
            cursor: pointer !important;
        }

        li:hover copyuseful {
            display: unset !important;
            font-size: 13px !important;
        }

        #assetsid > img {
            width: 75px !important;
            height: 75px !important;
        }

        #assetsid > button {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
        }

        [id*="NewChat-Tab-"] {
            opacity: 0.9;
            transition: .2s;
            background-color: #0009 !important;
        }

        #ciifcakemmcbbdpmljdohdmbodagmela-img,
              #patterpaste::-webkit-scrollbar {
            display: none !important;
        }

        *::-webkit-scrollbar {
            display: none !important;
        }

        #player-list.winframe > * {
            background: #7e635c;
        }

        #player-list.winframe {
            position: absolute !important;
            top: calc(100% + 15px) !important;
            left: -11px !important;
        }

        #BOJS-BOX > .wincontainer button,
        .copy-tools > button {
            border-image: url(https://cdn.discordapp.com/attachments/450024393628844032/1099010360532549643/button.png) 6 repeat !important;
            background-color: #151515 !important;
        }

        #BOJS-BOX > .wincontainer button:active,
        .copy-tools > button:active {
            border-image: url(https://cdn.discordapp.com/attachments/450024393628844032/1099010360788385852/button_pressed.png) 6 repeat !important;
        }

        #BOJS-BOX > .wincontainer,
        .copy-tools {
            border-image: url(https://cdn.discordapp.com/attachments/450024393628844032/1099010361279135844/window_in.png) 5 repeat !important;
            background-color: #3d3d3d !important;
        }

        #BOJS-BOX > .wincontainer *,
        .copy-tools *,
        .BOJS-BOX span,
        #copy-tools span {
            text-shadow: 1px 1px #421754 !important;
            color: #e4951a !important;
        }

        .BOJS-BOX,
        #copy-tools {
            border-image: url(https://cdn.discordapp.com/attachments/450024393628844032/1099010361509806150/window_out.png) 11 repeat !important;
            border-image-outset: 4px !important;
            background-color: #151515 !important;
        }

        div[id*="NewChat-Tab-Public"] {
            background-color: #00000099 !important;
        }

        #BOJS-BOX {
            display: flex;
        }

        button {
            border-color: #1b1c1f !important;
            border-width: 3px !important;
        }

        #uip {
            width: max-content !important;
        }

        .square {
            height: 15px;
            width: 15px;
        }

        .copytip {
            top: unset;
            left: unset;
            display: none;
            margin: 20px;
            transition: .2s;
        }

        #player-list.IP_INFO > * > * > * > * {
            width: 0px !important;
        }

        #player-list.IP_INFO > * {
            text-align: left !important;
        }

        #curList {
            width: 20px !important;
            height: 20px !important;
            background-size: 25px !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }

        button>* {
            position: absolute !important;
            top: 0 !important;
            margin: auto 0 !important;
        }

        ::-webkit-scrollbar {
            display: none !important !important;
        }

        #chat {
            left: 10px !important;
            bottom: 10px !important;
        }

        #patterpaste::-webkit-scrollbar {
            display: none !important;
        }

        #palette-bg,
                    #arc-widget-container>*>* {
            display: none !important;
        }

        #copybotcont {
            background-size: 100% !important;
        }

        #palette {
            right: -30px !important;
            transform: translateY(0) !important;
        }

        #chat-messages > li {
            white-space: normal !important;
        }`;
        document.head.appendChild(style);
        let isBrowser = typeof window !== "undefined";
        let OWOPUnlocked = (() => {
            if (typeof OWOP === "undefined") return false;
            return typeof OWOP.require !== "undefined";
        })();
        var BOJS = {};
        let move = (x, y) => {
            OWOP.net.protocol.lastSentX = x * 16;
            OWOP.net.protocol.lastSentY = y * 16;
            OWOP.net.connection.send(new Int32Array([x * 16, y * 16, 0]).buffer);
        };
        function loadScript(src, onload) {
            var s = document.createElement('script');
            s.src = src;
            s.onload = onload;
            document.body.appendChild(s);
        };
        loadScript("https://raw.githack.com/Olical/EventEmitter/master/EventEmitter.min.js");
        if (OWOPUnlocked) {
            EventEmitter = OWOP.require("events");
        }
        else if (isBrowser) {
            ! function (e) {
                "use strict";

                function t() { }

                function n(e, t) {
                    for (var n = e.length; n--;)
                        if (e[n].listener === t) return n;
                    return -1
                }

                function r(e) {
                    return function () {
                        return this[e].apply(this, arguments)
                    }
                }

                function i(e) {
                    return "function" == typeof e || e instanceof RegExp || !(!e || "object" != typeof e) && i(e.listener)
                }
                var s = t.prototype,
                    o = e.EventEmitter;
                s.getListeners = function (e) {
                    var t, n, r = this._getEvents();
                    if (e instanceof RegExp) {
                        t = {};
                        for (n in r) r.hasOwnProperty(n) && e.test(n) && (t[n] = r[n])
                    }
                    else t = r[e] || (r[e] = []);
                    return t
                }, s.flattenListeners = function (e) {
                    var t, n = [];
                    for (t = 0; t < e.length; t += 1) n.push(e[t].listener);
                    return n
                }, s.getListenersAsObject = function (e) {
                    var t, n = this.getListeners(e);
                    return n instanceof Array && (t = {}, t[e] = n), t || n
                }, s.addListener = function (e, t) {
                    if (!i(t)) throw new TypeError("listener must be a function");
                    var r, s = this.getListenersAsObject(e),
                        o = "object" == typeof t;
                    for (r in s) s.hasOwnProperty(r) && -1 === n(s[r], t) && s[r].push(o ? t : {
                        listener: t,
                        once: !1
                    });
                    return this
                }, s.on = r("addListener"), s.addOnceListener = function (e, t) {
                    return this.addListener(e, {
                        listener: t,
                        once: !0
                    })
                }, s.once = r("addOnceListener"), s.defineEvent = function (e) {
                    return this.getListeners(e), this
                }, s.defineEvents = function (e) {
                    for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
                    return this
                }, s.removeListener = function (e, t) {
                    var r, i, s = this.getListenersAsObject(e);
                    for (i in s) s.hasOwnProperty(i) && -1 !== (r = n(s[i], t)) && s[i].splice(r, 1);
                    return this
                }, s.off = r("removeListener"), s.addListeners = function (e, t) {
                    return this.manipulateListeners(!1, e, t)
                }, s.removeListeners = function (e, t) {
                    return this.manipulateListeners(!0, e, t)
                }, s.manipulateListeners = function (e, t, n) {
                    var r, i, s = e ? this.removeListener : this.addListener,
                        o = e ? this.removeListeners : this.addListeners;
                    if ("object" != typeof t || t instanceof RegExp)
                        for (r = n.length; r--;) s.call(this, t, n[r]);
                    else
                        for (r in t) t.hasOwnProperty(r) && (i = t[r]) && ("function" == typeof i ? s.call(this, r, i) : o.call(this, r, i));
                    return this
                }, s.removeEvent = function (e) {
                    var t, n = typeof e,
                        r = this._getEvents();
                    if ("string" === n) delete r[e];
                    else if (e instanceof RegExp)
                        for (t in r) r.hasOwnProperty(t) && e.test(t) && delete r[t];
                    else delete this._events;
                    return this
                }, s.removeAllListeners = r("removeEvent"), s.emitEvent = function (e, t) {
                    var n, r, i, s, o = this.getListenersAsObject(e);
                    for (s in o)
                        if (o.hasOwnProperty(s))
                            for (n = o[s].slice(0), i = 0; i < n.length; i++) r = n[i], !0 === r.once && this.removeListener(e, r.listener), r.listener.apply(this, t || []) === this._getOnceReturnValue() && this.removeListener(e, r.listener);
                    return this
                }, s.trigger = r("emitEvent"), s.emit = function (e) {
                    var t = Array.prototype.slice.call(arguments, 1);
                    return this.emitEvent(e, t)
                }, s.setOnceReturnValue = function (e) {
                    return this._onceReturnValue = e, this
                }, s._getOnceReturnValue = function () {
                    return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
                }, s._getEvents = function () {
                    return this._events || (this._events = {})
                }, t.noConflict = function () {
                    return e.EventEmitter = o, t
                }, "function" == typeof define && define.amd ? define(function () {
                    return t
                }) : "object" == typeof module && module.exports ? module.exports = t : e.EventEmitter = t
            }("undefined" != typeof window ? window : this || {});
            // upper thing is event emitter
        }
        else {
            WebSocket = require("ws");
            EventEmitter = require("events");
            Canvas = require("canvas");
        }
        if (!Object.values) Object.values = function (object) {
            return Object.keys(object).map(function (key) {
                return object[key];
            });
        }
        class Bucket {
            constructor(rate, time, infinite) {
                this.lastCheck = Date.now();
                this.allowance = 0;
                this.rate = rate;
                this.time = time;
                this.infinite = infinite;
            };
            update() {
                this.allowance += (Date.now() - this.lastCheck) / 1000 * (this.rate / this.time);
                this.lastCheck = Date.now();
                if (this.allowance > this.rate) {
                    this.allowance = this.rate;
                }
            };
            canSpend(count) {
                if (this.infinite) {
                    return true;
                }
                this.update();
                if (this.allowance < count) {
                    return false;
                }
                this.allowance -= count;
                return true;
            };
        };
        class WeirdDataView {
            constructor(arrayBuffer = new ArrayBuffer()) {
                this.offset = 0;
                this.dv = new DataView(arrayBuffer);
            }
            get buffer() {
                return this.dv.buffer;
            }
            // set
            // 8
            setUint8(value, offset = this.offset, addToOffset = true) {
                let data = this.dv.setUint8(offset, value);
                this.offset = addToOffset ? offset + 1 : offset;
            }
            setInt8(value, offset = this.offset, addToOffset = true) {
                let data = this.dv.setInt8(offset, value);
                this.offset = addToOffset ? offset + 1 : offset;
            }
            // 16
            setUint16(value, offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.setUint16(offset, value, littleEndian);
                this.offset = addToOffset ? offset + 2 : offset;
            }
            setInt16(value, offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.setInt16(offset, value, littleEndian);
                this.offset = addToOffset ? offset + 2 : offset;
            }
            // 32
            setUint32(value, offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.setUint32(offset, value, littleEndian);
                this.offset = addToOffset ? offset + 4 : offset;
            }
            setInt32(value, offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.setInt32(offset, value, littleEndian);
                this.offset = addToOffset ? offset + 4 : offset;
            }
            // get
            // 8
            getUint8(offset = this.offset, addToOffset = true) {
                let data = this.dv.getUint8(offset);
                this.offset = addToOffset ? offset + 1 : offset;
                return data;
            }
            getInt8(offset = this.offset, addToOffset = true) {
                let data = this.dv.getInt8(offset);
                this.offset = addToOffset ? offset + 1 : offset;
                return data;
            }
            // 16
            getUint16(offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.getUint16(offset, littleEndian);
                this.offset = addToOffset ? offset + 2 : offset;
                return data;
            }
            getInt16(offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.getInt16(offset, littleEndian);
                this.offset = addToOffset ? offset + 2 : offset;
                return data;
            }
            // 32
            getUint32(offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.getUint32(offset, littleEndian);
                this.offset = addToOffset ? offset + 4 : offset;
                return data;
            }
            getInt32(offset = this.offset, littleEndian = true, addToOffset = true) {
                let data = this.dv.getInt32(offset, littleEndian);
                this.offset = addToOffset ? offset + 4 : offset;
                return data;
            }
        }
        class ChunkSystem {
            static getIbyXY(x, y, w) {
                return (y * w + x) * 3;
            }
            constructor() {
                this.chunks = {};
                this.chunkProtected = {};
            };
            setChunk(x, y, data) {
                if (!data || typeof x !== "number" || typeof y !== "number") throw new Error("x or y is not a number or no data!");
                return this.chunks[`${x},${y}`] = data;
            };
            getChunk(x, y) {
                return this.chunks[`${x},${y}`];
            };
            removeChunk(x, y) {
                return delete this.chunks[`${x},${y}`];
            };
            setPixel(x, y, rgb) {
                if (typeof rgb !== "object" || typeof x !== "number" || typeof y !== "number") throw new Error("x or y is not a number or rgb is not array!");
                const chunkX = Math.floor(x / Client.options.chunkSize);
                const chunkY = Math.floor(y / Client.options.chunkSize);
                const chunk = this.getChunk(chunkX, chunkY);
                if (!chunk) return;
                const i = ChunkSystem.getIbyXY(x & Client.options.chunkSize - 1, y & Client.options.chunkSize - 1, Client.options.chunkSize);
                chunk[i] = rgb[0];
                chunk[i + 1] = rgb[1];
                chunk[i + 2] = rgb[2];
                return true;
            };
            getPixel(x, y) {
                if (typeof x !== "number" || typeof y !== "number") throw new Error("x or y is not a number!");
                const chunkX = Math.floor(x / Client.options.chunkSize);
                const chunkY = Math.floor(y / Client.options.chunkSize);
                const chunk = this.getChunk(chunkX, chunkY);
                if (!chunk) return;
                const i = ChunkSystem.getIbyXY(x & Client.options.chunkSize - 1, y & Client.options.chunkSize - 1, Client.options.chunkSize);
                return [chunk[i], chunk[i + 1], chunk[i + 2]];
            };
            setChunkProtection(x, y, newState) {
                if (typeof x !== "number" || typeof y !== "number") throw new Error("x or y is not a number!");
                if (newState) this.chunkProtected[`${x},${y}`] = true;
                else delete this.chunkProtected[`${x},${y}`];
                return true;
            }
            isProtected(x, y) {
                if (typeof x !== "number" || typeof y !== "number") throw new Error("x or y is not a number!");
                return !!this.chunkProtected[`${x},${y}`];
            }
        };
        const canvasUtils = {
            getIbyXY(x, y, w) {
                return (y * w + x) * 4;
            },
            _lerp(color1, color2, factor = 0.5) {
                return Math.round(color1 + (color2 - color1) * factor);
            },
            lerp(color1, color2, factor = 0.5) {
                let result = Uint8ClampedArray(3); // i don't really want other values like NaN
                for (let i = 0; i < 3; i++) {
                    result[i] = canvasUtils._lerp(color1[i], color2[i], factor);
                }
                return result;
            },
            imageDataToCtx(imageData) { // canvas = ctx.canvas
                let canvas = canvasUtils.createCanvas(imageData.width, imageData.height);
                let ctx = canvas.getContext("2d");
                ctx.putImageData(imageData, 0, 0);
                return ctx;
            },
            createCanvas(width, height) {
                let canvas;
                if (isBrowser) {
                    canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                }
                else {
                    canvas = new Canvas.Canvas(width, height);
                }
                return canvas;
            },
            createImageData() {
                let imageData;
                if (isBrowser) {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    imageData = ctx.createImageData(...arguments);
                }
                else {
                    imageData = Canvas.createImageData(...arguments);
                }
                return imageData;
            },
            dataToImageData(data, width, height, hasAlpha = true, alpha = 255) {
                let imageData = canvasUtils.createImageData(width, height);
                if (!hasAlpha) {
                    data = canvasUtils.addAlphaToData(data, alpha);
                }
                for (let i = 0; i < data.length; i++) imageData.data[i] = data[i]; // WTF WHY IT CAN'T BE JUST image.data = data; WHYYYYYYYYYYYYYYYYYYYYYYYYYYY
                return imageData;
            },
            removeAlphaFromImageData(data) {
                if (data.length % 4 !== 0) throw new Error("Data is not image data");
                let newData = new Uint8ClampedArray(data.length - data.length / 4);
                for (let i = 0, i2 = 0; i < newData.length;) {
                    newData[i++] = data[i2++];
                    newData[i++] = data[i2++];
                    newData[i++] = data[i2++];
                    i2++;
                }
                return newData;
            },
            addAlphaToData(data, alpha = 255) {
                if (data.length % 3 !== 0) throw new Error("Data is not data ;-;");
                let newData = new Uint8ClampedArray(data.length + data.length / 3);
                for (let i = 0, i2 = 0; i < newData.length;) {
                    newData[i++] = data[i2++];
                    newData[i++] = data[i2++];
                    newData[i++] = data[i2++];
                    newData[i++] = alpha;
                }
                return newData;
            }
            /*,
                    lerpImageDataWithNormalColors(imageData, imageDataWithoutAlphaChannel) { // i will delete it but i added it idk why
                        let lerped = new Uint8ClampedArray(imageDataWithoutAlphaChannel.length);
                        for (let i = 0, i2 = 0; i < imageData.length;) {
                        let factor = imageData[i + 3];
                        lerped[i2] = canvasUtils._lerp(imageDataWithoutAlphaChannel[i2], imageData[i], factor / 255);
                        i++;
                        i2++;
                        lerped[i2] = canvasUtils._lerp(imageDataWithoutAlphaChannel[i2], imageData[i], factor / 255);
                        i++;
                        i2++;
                        lerped[i2] = canvasUtils._lerp(imageDataWithoutAlphaChannel[i2], imageData[i], factor / 255);
                        i++;
                        i2++;

                        i++;
                        }
                        return lerped;
                    }*/
        };
        class Client extends EventEmitter {
            static options = {
                chunkSize: 16,
                maxChatBuffer: 256,
                maxMessageLength: {
                    0: 128,
                    1: 128,
                    2: 512,
                    3: 16384
                },
                maxWorldNameLength: 24,
                worldBorder: 0xFFFFFF, // or Math.pow(2, 24)-1
                misc: {
                    chatVerification: String.fromCharCode(10),
                    tokenVerification: "CaptchA",
                    worldVerification: 25565
                },
                opcode: {
                    setId: 0,
                    worldUpdate: 1,
                    chunkLoad: 2,
                    teleport: 3,
                    setRank: 4,
                    captcha: 5,
                    setPQuota: 6,
                    chunkProtected: 7
                },
                chatQuota: {
                    0: [4, 6],
                    1: [4, 6],
                    2: [10, 3],
                    3: [0, 1000]
                },
                captchaState: {
                    WAITING: 0,
                    VERIFYING: 1,
                    VERIFIED: 2,
                    OK: 3,
                    INVALID: 4
                },
                tools: {
                    0: [1, "cursor"],
                    1: [0, "move"],
                    2: [0, "pippete"],
                    3: [2, "eraser"],
                    4: [0, "zoom"],
                    5: [1, "bucket"],
                    6: [2, "paste"],
                    7: [0, "export"],
                    8: [1, "line"],
                    9: [2, "protect"],
                    10: [2, "copy"]
                }
            };
            static utils = {
                shouldMove(x1, y1, x2, y2) {
                    let distx = Math.trunc(x2 / Client.options.chunkSize) - Math.trunc(x1 / Client.options.chunkSize);
                    distx *= distx;
                    let disty = Math.trunc(y2 / Client.options.chunkSize) - Math.trunc(y1 / Client.options.chunkSize);
                    disty *= disty;
                    let dist = Math.sqrt(distx + disty);
                    return dist >= 3;
                },
                decompress(u8arr) {
                    var originalLength = u8arr[1] << 8 | u8arr[0];
                    var u8decompressedarr = new Uint8ClampedArray(originalLength);
                    var numOfRepeats = u8arr[3] << 8 | u8arr[2];
                    var offset = numOfRepeats * 2 + 4;
                    var uptr = 0;
                    var cptr = offset;
                    for (var i = 0; i < numOfRepeats; i++) {
                        var currentRepeatLoc = (u8arr[4 + i * 2 + 1] << 8 | u8arr[4 + i * 2]) + offset;
                        while (cptr < currentRepeatLoc) {
                            u8decompressedarr[uptr++] = u8arr[cptr++];
                        }
                        var repeatedNum = u8arr[cptr + 1] << 8 | u8arr[cptr];
                        var repeatedColorR = u8arr[cptr + 2];
                        var repeatedColorG = u8arr[cptr + 3];
                        var repeatedColorB = u8arr[cptr + 4];
                        cptr += 5;
                        while (repeatedNum--) {
                            u8decompressedarr[uptr] = repeatedColorR;
                            u8decompressedarr[uptr + 1] = repeatedColorG;
                            u8decompressedarr[uptr + 2] = repeatedColorB;
                            uptr += 3;
                        }
                    }
                    while (cptr < u8arr.length) {
                        u8decompressedarr[uptr++] = u8arr[cptr++];
                    }
                    return u8decompressedarr;
                },
                Player: class {
                    constructor(id) {
                        this.id = id;
                        this.nick = "";
                        this.x = 0;
                        this.y = 0;
                        this.color = [0, 0, 0];
                        this.rank = 0;
                    }
                },
                createChunkFromRGB(color) {
                    let tile = new Uint8ClampedArray(Client.options.chunkSize * Client.options.chunkSize * 3);
                    for (var i = 0; i < tile.length;) {
                        tile[i++] = color[0];
                        tile[i++] = color[1];
                        tile[i++] = color[2];
                    }
                    return tile;
                },
                isArraysSame(...arrays) {
                    arrays = arrays.map(array => JSON.stringify(array));
                    return !arrays.filter(array => arrays[0] !== array).length;
                }
            };
            constructor(options = {}) {
                super();
                const that = this;
                this.chunkSystem = new ChunkSystem();
                this.pendingLoad = {};
                this.destroyed = false;
                if (options.local) options.reconnect = true;
                if (!options.ws) options.ws = OWOP.options.serverAddress[0].url;
                if (!options.origin && !isBrowser) options.origin = options.ws.replace("ws", "http");
                if (typeof options.protocol === "undefined") options.protocol = 1;
                if (typeof options.autoConnectWorld === "undefined") options.autoConnectWorld = true;
                if (typeof options.log === "undefined") options.log = true;
                if (typeof options.autoMakeSocket === "undefined") options.autoMakeSocket = true;
                if (typeof options.captchaSiteKey === "undefined") options.captchaSiteKey = "6LcgvScUAAAAAARUXtwrM8MP0A0N70z4DHNJh-KI";
                if (typeof options.reconnectTime === "undefined") options.reconnectTime = 5000;
                if (typeof options.reconnectTries === "undefined") options.reconnectTries = -1; // endless
                this.reconnectTries = options.reconnectTries;
                if (options.controller && !isBrowser) {
                    const stdin = process.openStdin();
                    stdin.on("data", d => {
                        const msg = d.toString().trim();
                        try {
                            return console.log(String(eval(msg)).slice(0, 1000));
                        }
                        catch (e) {
                            console.log('[ERROR]: ' + e.name + ": " + e.message + "\n" + e.stack);
                        }
                    });
                }
                this.clientOptions = options;
                this.players = {};
                this.player = {
                    id: null,
                    color: [0, 0, 0],
                    tool: 0,
                    x: 0,
                    y: 0,
                    rank: 0,
                    nick: options.nick,
                    chatBucket: new Bucket(...Client.options.chatQuota[0]),
                    pixelBucket: new Bucket(32, 4)
                };
                this.chat = {
                    send(message, sendModifier = true) {
                        if (!that.ws || that.ws.readyState !== 1) return false;
                        if (!that.clientOptions.unsafe) {
                            if (!that.player.chatBucket.canSpend(1)) return false;
                            message = message.slice(0, Client.options.maxMessageLength[that.player.rank]);
                        }
                        if (sendModifier) message = that.chat.sendModifier(message);
                        that.ws.send(message + Client.options.misc.chatVerification);
                    },
                    recvModifier(message) {
                        return message;
                    },
                    sendModifier(message) {
                        return message;
                    },
                    messages: [],
                    /*
                    0-3 - normal owop ranks
                    4 - discord
                    */
                    parseMessage(msg) {
                        let something = msg.split(": ");
                        if (msg.startsWith("DEV") || msg.toLowerCase().startsWith("server:") || msg[0] === "<" || something.length < 2) return [
                            null, null, null, msg
                        ];
                        let before = something.shift();
                        let message = something.join(": ").trim();
                        let user = {
                            rank: 0,
                            id: null,
                            nick: ""
                        }
                        let tell = false;
                        if (before.startsWith("[D]")) {
                            user.rank = 4; // rank 4 is discord
                            user.nick = before.slice(4).trim(); // two ways one is spliting by space second is by just slicing 4 letters
                        }
                        else if (before.startsWith("(M)")) {
                            user.nick = before.slice(4).trim();
                            user.rank = 2;
                        }
                        else if (before.startsWith("(A)")) {
                            user.nick = before.slice(4).trim();
                            user.rank = 3;
                        }
                        else if (before.startsWith("[") || /[0-9]/g.test(before[0])) {
                            if (before.startsWith("[")) {
                                user.id = +before.split("]")[0].substr(1);
                                user.nick = before.split("]");
                                user.nick.shift();
                                user.nick = user.nick.join("]").trim();
                            }
                            else {
                                user.id = +before;
                                user.nick = before.trim(); // trim is not needed i think
                            }
                            user.rank = 0; //that.players[user.id] ? that.players[user.id].rank : 0;
                        }
                        else if (before.startsWith("-> ") && /[0-9]/g.test(before[4])) {
                            tell = true;
                            user.id = +before.split(" ")[1];
                            user.nick = user.id.toString();
                            user.rank = 0 //that.players[user.id] ? that.players[user.id].rank : 0;
                        }
                        else if (before.toLowerCase().startsWith("-> you tell")) {
                            user.id = that.player.id;
                            user.nick = that.player.nick;
                            tell = true;
                        }
                        return [user, message, tell, msg];
                    }
                };
                this.world = {
                    join(name = "main") {
                        let nameCopy = name = (name.replace(/[^a-zA-Z0-9\._]/gm, "").slice(0, 24) || "main");
                        nameCopy = nameCopy.split("").map(x => x.charCodeAt(0));
                        let dv = new DataView(new ArrayBuffer(name.length + 2));
                        for (let i = 0; i < name.length; i++) dv.setUint8(i, nameCopy[i] || 0);
                        dv.setUint16(name.length, that.clientOptions.worldVerification || Client.options.misc.worldVerification, true);
                        that.ws.send(dv.buffer);
                        that.world.name = name;
                        that.log("Joining world: " + name);
                    },
                    leave() {
                        this.ws.close(); // bug it will reconnect if can
                    },
                    move(x = that.player.x, y = that.player.y) {
                        if (that.ws.readyState !== 1) return false;
                        let tool = document.getElementById("bottools").value;
                        that.player.tool = tool;
                        that.player.x = x = +x;
                        that.player.y = y = +y;
                        x *= 16;
                        y *= 16;
                        let dv = new WeirdDataView(new ArrayBuffer(12));
                        dv.setInt32(x);
                        dv.setInt32(y);
                        dv.setUint8(that.player.color[0]);
                        dv.setUint8(that.player.color[1]);
                        dv.setUint8(that.player.color[2]);
                        dv.setUint8(that.player.tool);
                        that.ws.send(dv.buffer);
                        return true;
                    },
                    setPixel(x = that.player.x, y = that.player.y, color = that.player.color, wolfMove = false, sneaky = false, move = (that.player.rank < 3)) {
                        if (that.ws.readyState !== 1) return false;
                        let tool = document.getElementById("bottools").value;
                        that.player.tool = tool;
                        if (bSneaky) {
                            sneaky = true;
                            that.player.color = [0, 0, 0];
                        } else {
                            that.player.color = color;
                        }
                        let oldX = that.player.x;
                        let oldY = that.player.y;
                        x = +x;
                        y = +y;
                        if (!that.clientOptions.unsafe && (!that.player.pixelBucket.canSpend(1) || that.player.rank === 0)) return false;
                        if (wolfMove) {
                            if (Client.utils.shouldMove(that.player.x, that.player.x, x, y)) that.world.move(x, y);
                        }
                        else if (move) {
                            that.world.move(x, y);
                        }
                        let dv = new WeirdDataView(new ArrayBuffer(11));
                        dv.setInt32(x);
                        dv.setInt32(y);
                        dv.setUint8(color[0]);
                        dv.setUint8(color[1]);
                        dv.setUint8(color[2]);
                        that.ws.send(dv.buffer);
                        if (sneaky) that.world.move(oldX, oldY);
                        return true;
                    },
                    pasteChunk(x, y, data) {
                        if (that.ws.readyState !== 1 || !that.clientOptions.unsafe && that.player.rank < 2) return false;
                        let dv = new DataView(new ArrayBuffer(8 + Client.options.chunkSize * Client.options.chunkSize * 3));
                        dv.setInt32(0, x, true);
                        dv.setInt32(4, y, true);
                        for (let i = 0; i < data.length; i++) dv.setUint8(8 + i, data[i]);
                        that.ws.send(dv.buffer);
                        return true;
                    },
                    async pasteImageData(x, y, imageData, isImage) { // tried to do fastest as possible
                        if (that.ws.readyState !== 1 || !that.clientOptions.unsafe && that.player.rank < 2) return false;
                        // math
                        let chunkXStart = Math.floor(x / Client.options.chunkSize);
                        let chunkXEnd = Math.floor((x + imageData.width) / Client.options.chunkSize) + 1;
                        let chunkYStart = Math.floor(x / Client.options.chunkSize);
                        let chunkYEnd = Math.floor((x + imageData.height) / Client.options.chunkSize) + 1;
                        let canvasWidthInChunks = chunkXEnd - chunkXStart;
                        let canvasHeightInChunks = chunkYEnd - chunkXStart;
                        let posXOnCanvas = x % Client.options.chunkSize;
                        let posYOnCanvas = y % Client.options.chunkSize;
                        // some shit
                        let canvas = canvasUtils.createCanvas(canvasWidthInChunks * Client.options.chunkSize, canvasHeightInChunks * Client.options.chunkSize);
                        let ctx = canvas.getContext("2d");
                        let image = isImage ? imageData : canvasUtils.imageDataToCtx(imageData).canvas;
                        // requesting chunks and setting them on canvas
                        await new Promise(resolve => {
                            let chunksLasted = canvasWidthInChunks * canvasHeightInChunks;
                            for (let xx = chunkXStart, canvasX = 0; xx < chunkXEnd; xx++, canvasX += Client.options.chunkSize) {
                                for (let yy = chunkYStart, canvasY = 0; yy < chunkYEnd; yy++, canvasY += Client.options.chunkSize) {
                                    that.world.requestChunk(xx, yy).then(data => {
                                        let chunkImageData = canvasUtils.dataToImageData(data, Client.options.chunkSize, Client.options.chunkSize, false);
                                        ctx.putImageData(chunkImageData, canvasX, canvasY);
                                        chunksLasted--;
                                        if (!chunksLasted) resolve();
                                    });
                                }
                            }
                        });
                        ctx.drawImage(image, posXOnCanvas, posYOnCanvas); // setting image
                        // pasting
                        for (let xx = chunkXStart, canvasX = 0; xx < chunkXEnd; xx++, canvasX += Client.options.chunkSize) {
                            for (let yy = chunkYStart, canvasY = 0; yy < chunkYEnd; yy++, canvasY += Client.options.chunkSize) {
                                let chunkImageData = ctx.getImageData(canvasX, canvasY, Client.options.chunkSize, Client.options.chunkSize);
                                let chunkData = canvasUtils.removeAlphaFromImageData(chunkImageData.data);
                                if (Client.utils.isArraysSame(chunkData, that.chunkSystem.getChunk(xx, yy))) continue;
                                that.world.pasteChunk(xx, yy, chunkData);
                            }
                        }
                        return true;
                    },
                    setTool(tool) {
                        if (that.ws.readyState !== 1) return false;
                        that.player.tool = +tool;
                        let dv = new WeirdDataView(new ArrayBuffer(12));
                        dv.setInt32(that.player.x * 16);
                        dv.setInt32(that.player.y * 16);
                        dv.setUint8(that.player.color[0]);
                        dv.setUint8(that.player.color[1]);
                        dv.setUint8(that.player.color[2]);
                        dv.setUint8(that.player.tool);
                        that.ws.send(dv.buffer);
                        return true;
                    },
                    setColor(color) {
                        if (that.ws.readyState !== 1) return false;
                        that.player.color = color;
                        let dv = new WeirdDataView(new ArrayBuffer(12));
                        dv.setInt32(that.player.x * 16);
                        dv.setInt32(that.player.y * 16);
                        dv.setUint8(that.player.color[0]);
                        dv.setUint8(that.player.color[1]);
                        dv.setUint8(that.player.color[2]);
                        dv.setUint8(that.player.tool);
                        that.ws.send(dv.buffer);
                        return true;
                    },
                    protectChunk(x, y, newState = 1) {
                        if (that.ws.readyState !== 1 || that.player.rank < 2 && that.clientOptions.unsafe) return false;
                        let dv = new WeirdDataView(new ArrayBuffer(10));
                        dv.setInt32(x);
                        dv.setInt32(y);
                        dv.setUint8(newState);
                        that.ws.send(dv.buffer);
                        return true;
                    },
                    clearChunk(x, y, color) {
                        if (that.ws.readyState !== 1 || that.player.rank < 2 && that.clientOptions.unsafe) return false;
                        if (that.clientOptions.protocol === 0) {
                            if (color[0] === 255 && color[1] === 255 && color[2] === 255) {
                                let dv = new WeirdDataView(new ArrayBuffer(9));
                                dv.setInt32(x);
                                dv.setInt32(y);
                                that.ws.send(dv.buffer);
                            }
                            else {
                                that.world.pasteChunk(x, y, Client.utils.createChunkFromRGB(color));
                            }
                        }
                        else {
                            let dv = new WeirdDataView(new ArrayBuffer(13));
                            dv.setInt32(x);
                            dv.setInt32(y);
                            dv.setUint8(color[0]);
                            dv.setUint8(color[1]);
                            dv.setUint8(color[2]);
                            that.ws.send(dv.buffer);
                        }
                        return true;
                    },
                    __requestChunk(x, y) {
                        let dv = new WeirdDataView(new ArrayBuffer(8));
                        dv.setInt32(x);
                        dv.setInt32(y);
                        that.ws.send(dv.buffer);
                        return true;
                    },
                    _requestChunk(x, y) {
                        return new Promise(async (resolve, reject) => {
                            if (that.pendingLoad[x + "," + y]) await that.pendingLoad[x + "," + y];
                            if (that.chunkSystem.getChunk(x, y)) return resolve(that.chunkSystem.getChunk(x, y));
                            let wb = Client.options.worldBorder;
                            if (!that.clientOptions.unsafe && (x > wb || y > wb || x < ~wb || y < ~wb)) return reject(false);
                            let func = ((cx, cy, data) => {
                                if (x !== cx || y !== cy) return;
                                that.off("chunk", func);
                                resolve(data);
                            });
                            that.on("chunk", func);
                            that.world.__requestChunk(x, y);
                        });
                    },
                    requestChunk(x, y, inaccurate) { // i think that there is simplier way but i can't invent it
                        if (inaccurate) {
                            x = Math.floor(x / Client.options.chunkSize);
                            y = Math.floor(y / Client.options.chunkSize);
                        };
                        let chunk = that.world._requestChunk(x, y);
                        that.pendingLoad[x + "," + y] = new Promise(async resolve => {
                            resolve(await chunk);
                            delete that.pendingLoad[x + "," + y];
                        });
                        return chunk;
                    },
                    async getPixel(x, y) {
                        if (isBrowser)
                            if (that.clientOptions.simpleChunks) return OWOP.world.getPixel(x, y);
                        await that.world.requestChunk(x, y, true);
                        return that.chunkSystem.getPixel(x, y);
                    }
                };
                this.captcha = {
                    usedKeys: [],
                    login(key) {
                        if (!that.ws || that.ws.readyState !== 1) return false;
                        if (that.captcha.usedKeys.includes(key)) {
                            return false
                        }
                        else if (!key.startsWith("LETMEINPLZ")) {
                            that.captcha.usedKeys.push(key);
                        }
                        that.ws.send(Client.options.misc.tokenVerification + key);
                        that.captcha.usedKeys.push(key);
                        return true;
                    },
                    renderCaptcha(uniqueName = true) {
                        // you can do it self only on browser
                        if (isBrowser) {
                            return new Promise(resolve => {
                                OWOP.windowSys.addWindow(new OWOP.windowSys.class.window(`Verification Needed` + (uniqueName ? String.fromCharCode(Math.random() * 100) : ""), {
                                    closeable: true,
                                    moveable: true
                                }, win => {
                                    grecaptcha.render(win.addObj(OWOP.util.mkHTML('div', {})), {
                                        theme: 'dark',
                                        sitekey: that.clientOptions.captchaSiteKey,
                                        callback: token => {
                                            win.close();
                                            resolve(token);
                                        }
                                    });
                                }));
                            });
                        }
                        else {
                            throw new Error("Node JS can't use renderCaptcha")
                        }
                    },
                    async renderAndLogin(unique = true) {
                        that.captcha.login(await that.captcha.renderCaptcha(unique));
                    }
                };
                if (options.autoMakeSocket) this.makeSocket();
            }
            log(...args) {
                if (this.clientOptions.log) console.log(...args);
            }
            destroy() {
                if (this.ws.readyState === 1) this.ws.close();
                if (!this.clientOptions.local) this.destroyed = true;
                this.emit("destroy");
            }
            makeSocket() {
                let ws;
                if (!this.clientOptions.local) ws = new WebSocket(this.clientOptions.ws, isBrowser ? undefined : this.clientOptions); else {
                    ws = OWOP.net.protocol.ws;
                    this.ws = ws;
                    setTimeout(() => {
                        this.emit("open");
                        this.player.id = OWOP.player.id;
                        this.isWorldConnected = true;
                        this.world.name = OWOP.world.name;
                        this.player.rank = OWOP.player.rank;
                        this.emit("join", OWOP.world.name, OWOP.player.id);
                        let rate = OWOP.net.protocol.placeBucket.rate, time = OWOP.net.protocol.placeBucket.time;
                        this.player.pixelBucket = OWOP.net.protocol.placeBucket;
                        this.emit("pquota", rate, time);
                        this.emit("rank", OWOP.player.rank);
                    }, 1000);
                }
                this.players = {};
                ws.binaryType = "arraybuffer";
                ws.onopen = () => {
                    this.emit("open", ...arguments);
                    this.log("Connected");
                }
                ws.onclose = () => {
                    this.emit("close", ...arguments);
                    this.isWorldConnected = false;
                    this.log("Disconnected");
                    // if someone dumb will set this.reconnectTries to 0 then it will change after \/ to -1 (endless) but will not connect
                    if (!this.destroyed && this.clientOptions.reconnect) setTimeout(this.makeSocket.bind(this), this.clientOptions.reconnectTime)
                }
                ws.onmessage = e => {
                    let msg = e.data;
                    this.msg = e.data;
                    this.emit("rawMessage", msg);
                    const isBinary = typeof msg !== "string";
                    if (isBinary) {
                        let dv = new WeirdDataView(msg);
                        let len = dv.byteLength;
                        switch (dv.getUint8()) {
                            case Client.options.opcode.setId: {
                                this.player.id = dv.getUint32();;
                                this.isWorldConnected = true;
                                this.player.rank = 0;
                                this.log(`Joined world '${this.world.name}' and got id '${this.player.id}'`);
                                if (this.clientOptions.adminlogin) this.chat.send("/adminlogin " + this.clientOptions.adminlogin);
                                if (this.clientOptions.modlogin) this.chat.send("/modlogin " + this.clientOptions.modlogin);
                                if (this.clientOptions.pass) this.chat.send("/pass " + this.clientOptions.pass);
                                if (this.clientOptions.nick) this.chat.send("/nick " + this.clientOptions.nick);
                                this.emit("join", this.world.name, this.player.id);
                                break;
                            }
                            case Client.options.opcode.worldUpdate: {
                                let count = dv.getUint8(); // players update size
                                let updatedPlayers = {};
                                let newPlayers = [];
                                for (let i = 0; i < count; i++) { // player updates
                                    let id = dv.getUint32(); // player id
                                    //let isNew = false;
                                    if (!this.players[id]) {
                                        //isNew = true;
                                        this.players[id] = new Client.utils.Player(id);
                                        newPlayers.push(id);
                                    }
                                    let player = updatedPlayers[id] = this.players[id];
                                    player.x = dv.getInt32() / 16; // x
                                    player.y = dv.getInt32() / 16; // y
                                    player.color[0] = dv.getUint8(); // r
                                    player.color[1] = dv.getUint8(); // g
                                    player.color[2] = dv.getUint8(); // b
                                    player.tool = dv.getUint8(); // tool
                                    player.tool = Client.options.tools[player.tool] ? player.tool : 0;
                                    player.rank = Math.max(player.rank, Client.options.tools[player.tool][0]);
                                }
                                if (count) {
                                    this.emit("updatedPlayers", updatedPlayers);
                                    if (newPlayers.length) this.emit("newPlayers", newPlayers);
                                }
                                count = dv.getUint16(); // pixels update size
                                let updatedPixels = [];
                                for (let i = 0; i < count; i++) { // pixel updates
                                    let pixel = {};
                                    if (this.clientOptions.protocol === 1) pixel.id = dv.getUint32(); // player which set pixel id
                                    pixel.x = dv.getInt32(); // pixel x
                                    pixel.y = dv.getInt32(); // y
                                    pixel.color = [dv.getUint8(), dv.getUint8(),
                                    dv.getUint8()
                                    ];
                                    this.chunkSystem.setPixel(pixel.x, pixel.y, pixel.color);
                                    updatedPixels.push(pixel);
                                    //this.emit("pixelUpdate", pixel);
                                }
                                if (count) this.emit("updatedPixels", updatedPixels);
                                count = dv.getUint8(); // disconnections of players update size
                                let disconnectedPlayers = [];
                                for (let i = 0; i < count; i++) {
                                    let leftId = dv.getUint32();
                                    disconnectedPlayers.push(leftId);
                                    delete this.players[leftId];
                                }
                                if (count) this.emit("playersLeft", disconnectedPlayers);
                                break;
                            }
                            case Client.options.opcode.captcha: {
                                let id = dv.getUint8();
                                this.emit("captcha", id);
                                switch (id) {
                                    case Client.options.captchaState.WAITING: {
                                        this.log("Captcha State: 0 (WAITING)");
                                        if (this.clientOptions.captchaPass) {
                                            this.captcha.login("LETMEINPLZ" + this.clientOptions.captchaPass);
                                            this.log("Trying to login using captcha pass");
                                        }
                                        else if (this.clientOptions.captchaToken) {
                                            this.log("Trying to login using captcha token");
                                            if (!this.captcha.login(this.clientOptions.captchaToken)) console.log("login failed token already used");
                                        }
                                        break;
                                    }
                                    case Client.options.captchaState.VERIFYING: {
                                        this.log("Captcha State: 1 (VERIFYING)");
                                        break;
                                    }
                                    case Client.options.captchaState.VERIFIED: {
                                        this.log("Captcha State: 2 (VERIFIED)");
                                        break;
                                    }
                                    case Client.options.captchaState.OK: {
                                        this.log("Captcha State: 3 (OK)");
                                        if (this.clientOptions.autoConnectWorld) this.world.join(this.clientOptions.world);
                                        break;
                                    }
                                    case Client.options.captchaState.INVALID: {
                                        this.log("Captcha State: 4 (INVALID)");
                                        break;
                                    }
                                }
                                break;
                            }
                            case Client.options.opcode.chunkLoad: {
                                let chunkX = dv.getInt32();
                                let chunkY = dv.getInt32();
                                let locked = !!dv.getUint8();
                                let chunk = new Uint8ClampedArray(msg, 10);
                                chunk = Client.utils.decompress(chunk);
                                let isNew = !this.chunkSystem.getChunk(chunkX, chunkY);
                                this.chunkSystem.setChunk(chunkX, chunkY, chunk);
                                this.chunkSystem.setChunkProtection(chunkX, chunkY, locked);
                                this.emit("chunk", chunkX, chunkY, chunk, locked, isNew);
                                break;
                            }
                            case Client.options.opcode.teleport: {
                                if (!this.clientOptions.teleport) break;
                                let x = dv.getInt32();
                                let y = dv.getInt32();
                                this.world.move(x, y); // lazy to write
                                this.emit("teleport", x, y);
                                break;
                            }
                            case Client.options.opcode.setRank: {
                                let rank = dv.getUint8();
                                this.player.rank = rank;
                                this.player.chatBucket = new Bucket(...Client.options.chatQuota[rank]);
                                this.emit("rank", rank);
                                break;
                            }
                            case Client.options.opcode.setPQuota: {
                                let rate = dv.getUint16();
                                let per = dv.getUint16();
                                this.player.pixelBucket = new Bucket(rate, per);
                                this.emit("pquota", rate, per);
                                this.log(`New pixelQuota: ${rate}x${per}`);
                                break;
                            }
                            case Client.options.opcode.chunkProtected: {
                                let chunkX = dv.getInt32();
                                let chunkY = dv.getInt32();
                                let locked = !!dv.getUint8();
                                this.chunkSystem.setChunkProtection(chunkX, chunkY, locked);
                                this.emit("chunkProtect", chunkX, chunkY, locked);
                                break;
                            }
                        }
                    }
                    else {
                        if (msg.toLowerCase().startsWith("you are banned")) {
                            this.destroy();
                            this.emit("ban", msg);
                        }
                        let parsedMessage = this.chat.parseMessage(msg);
                        let userInfo = parsedMessage[0];
                        if (userInfo) {
                            if (userInfo.id) {
                                if (this.players[userInfo.id]) {
                                    this.players[userInfo.id].nick = userInfo.nick;
                                }
                            }
                        }
                        msg = this.chat.recvModifier(msg);
                        if (this.chat.messages.length > Client.options.maxChatBuffer) this.chat.messages.shift();
                        this.chat.messages.push(msg);
                        if (msg.toLowerCase().startsWith("Nickname reset")) {
                            this.player.nick = "";
                        }
                        else if (msg.toLowerCase().startsWith("Nickname set to")) {
                            this.player.nick = msg.slice("Nickname set to: \"".length, -1);
                        }
                        this.emit("message", msg, parsedMessage);
                        this.log(msg);
                    }
                }
                ws.onerror = () => {
                    this.emit("close", ...arguments);
                    this.isWorldConnected = false;
                    this.log("Disconnected");
                }
                this.ws = ws;
            }
        }
        if (isBrowser) {
            BOJS = { // browser
                Client,
                ChunkSystem,
                WeirdDataView,
                EventEmitter, // should be defined globally
                Bucket,
                canvasUtils
            }
        }
        else if (!isBrowser) {
            module.exports = {
                Client,
                ChunkSystem,
                WeirdDataView,
                Bucket,
                canvasUtils
            }
        }
        window.BOJS = BOJS;


        loadScript("https://www.google.com/recaptcha/api.js");
        const renderCaptcha = (botId, count) => new Promise(resolve => {
            OWOP.windowSys.addWindow(new OWOP.windowSys.class.window(`CAPTCHA - ${botId}`, {
                closeable: true
            }, function (win) {
                grecaptcha.render(win.addObj(OWOP.util.mkHTML("div", {})), {
                    theme: "dark",
                    sitekey: "6LcgvScUAAAAAARUXtwrM8MP0A0N70z4DHNJh-KI",
                    callback: function callback(token) {
                        console.log(token)
                        win.close();
                        resolve(token);
                    }
                });
            }));
        });
        class Bot {
            constructor(ip, local) {
                this.BOJS = new BOJS.Client({
                    reconnect: false,
                    log: false,
                    world: OWOP.world.name,
                    local: local
                });
                this.BOJS.ip = ip;
                this.BOJS.local = local;
                this.BOJS.on("join", this.onJoin.bind(this));
                this.BOJS.on("close", this.onClose.bind(this));
                this.BOJS.on("captcha", this.onCaptcha.bind(this));
                this.BOJS.on("message", this.onMessage.bind(this));
            }
            onMessage() {
                function delbot() {
                    let botCount = document.getElementById("botCount");
                    bots = bots.filter(i => i.BOJS.player.id !== this.BOJS.player.id);
                    botCount.innerText = "Bots: " + bots.length;
                    console.log(`Bot ${this.BOJS.player.id} left the game.`)
                    clearInterval(this.BOJS.PBinterval);
                    document.getElementById("bot-" + this.BOJS.player.id).remove();
                }
                if (this.BOJS.msg.toLowerCase().startsWith("world full")) {
                    delbot()
                    OWOP.chat.local(`World full`);
                } else if (this.BOJS.msg.toLowerCase().startsWith("remaining time:")) {
                    delbot()
                    OWOP.chat.local("<span class='admin'>[" + this.id + "]" + "[" + this.BOJS.ip + "]:" + " ⏰</span>")
                } else if (this.BOJS.msg.toLowerCase().startsWith("you are banned")) {
                    delbot()
                    OWOP.chat.local("<span class='admin'>[" + this.id + "]" + "[" + this.BOJS.ip + "]:" + " 🔨</span>")
                } else if (this.BOJS.msg.toLowerCase().startsWith("<span style=")) {
                }
            }
            onClose() {
                let botCount = document.getElementById("botCount");
                if (!this.BOJS.local) bots = bots.filter(i => i.BOJS.player.id !== this.BOJS.player.id);
                botCount.innerText = "Bots: " + bots.length;
                console.log(`Bot ${this.BOJS.player.id} left the game.`)
                clearInterval(this.BOJS.PBinterval);
                document.getElementById("bot-" + this.BOJS.player.id).remove();
            }
            onJoin() {
                setTimeout(() => {
                    this.BOJS.PBinterval = setInterval(() => {
                        try {
                            this.BOJS.player.pixelBucket.canSpend(0);
                            let PBElem = document.getElementById("bot-" + this.BOJS.player.id).childNodes[2];
                            PBElem.innerText = Math.round(this.BOJS.player.pixelBucket.allowance);
                        } catch {
                            clearInterval(this.BOJS.PBinterval);
                        }
                    }, 100);
                }, 1000);
                let botsTab = document.getElementById("botsTab");
                var t = document.createElement("tr");
                t.id = "bot-" + this.BOJS.player.id;
                const square = document.createElement('div');
                square.classList.add('square');
                let col = genCol(this.BOJS.ip);
                square.style.backgroundColor = col;
                const tooltip = document.createElement('div');
                tooltip.classList.add("tooltip", "copytip", "framed", "whitetext");
                tooltip.textContent = this.BOJS.ip;
                square.appendChild(tooltip);
                let c;
                square.addEventListener('mouseover', () => {
                    c = setTimeout(() => {
                        tooltip.style.opacity = '0';
                        tooltip.style.display = 'block';
                        setTimeout(() => tooltip.style.opacity = '1', 10);
                    }, 500)
                });

                square.addEventListener('mouseout', () => {
                    clearTimeout(c);
                    tooltip.style.opacity = '0';
                    setTimeout(() => tooltip.style.display = 'none', 200);
                });

                t.innerHTML = "<td>" + this.BOJS.player.id + "</th><td></td><td>0</td><td><button>KICK</button></td>";
                t.childNodes[1].appendChild(square);
                t.childNodes[3].addEventListener("mousedown", () => {
                    this.BOJS.destroy();
                })
                botsTab.appendChild(t);
                let botCount = document.getElementById("botCount");
                botCount.innerText = "Bots: " + bots.length;
                console.log(`Bot ${this.BOJS.player.id} joined the game.`)
                console.log(`Bot world:` + OWOP.world.name); //OWOP.net.protocol.worldName
            }
            async onCaptcha(id) {
                if (id === 0) {
                    var captchacode = await renderCaptcha(this.id, 0)
                    this.BOJS.ws.send(OWOP.options.serverAddress[0].proto.misc.tokenVerification + captchacode);
                }
            }
        }

        let bots = [];
        async function joinBots(local = false, count = 1, timeout = 0) {
            for (var i = 0; i < count; i++) {
                let response = await fetch("https://ourworldofpixels.com/api/", {
                    "method": "GET"
                });
                let data = await response.json();
                bots.push(new Bot(data.yourIp, local));
            }
        }
        joinBots(true);
        let protect = true;
        let forsprotect = false;
        let bSneaky = false;
        let stop121 = false;
        let stop = false;
        let deprot = false;
        OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("Сору Bоt", {
            closeable: true
        }, win => {
            var mkHTML = OWOP.util.mkHTML;
            let botswin = document.createElement("div");
            botswin.classList.add("wincontainer");
            botswin.style.minWidth = "unset";
            botswin.style.height = "unset";
            botswin.style.marginRight = "10px";

            let protWin = document.createElement("div");
            protWin.classList.add("wincontainer");
            protWin.style.minWidth = "unset";
            protWin.style.height = "unset";

            let joinbutton = document.createElement("button");
            joinbutton.innerHTML = `Join`;
            joinbutton.style.marginRight = "5px";
            joinbutton.addEventListener("mousedown", (e) => {
                joinBots();
            })
            botswin.appendChild(joinbutton);

            let botcount = document.createElement("text");
            botcount.innerHTML = `<text id="botCount">Bots: 0</text>`;
            botcount.style.marginRight = "5px";
            botswin.appendChild(botcount);

            let stopbutton = document.createElement("button");
            stopbutton.innerHTML = `stop`
            stopbutton.addEventListener("mousedown", () => {
                setTimeout(() => {
                    stop121 = false;
                }, 2000);
                stop121 = true;
            })
            botswin.appendChild(stopbutton);
            botswin.appendChild(mkHTML("br"));

            let ProtectLable = document.createElement("lable");
            ProtectLable.innerHTML = `Protect`
            ProtectLable.style.marginRight = "5px";
            protWin.appendChild(ProtectLable);

            let Protect = document.createElement("button");
            Protect.innerHTML = `on`
            Protect.style.marginRight = "5px";
            Protect.addEventListener("mousedown", () => {
                protect = !protect;
                Protect.innerHTML = protect ? "on" : "off"
                for (let i in protection) {
                    let cord = i.split(",");
                    placePixel(cord[0], cord[1], protection[i])
                }
            })
            protWin.appendChild(Protect);

            let clearProtect = document.createElement("button");
            clearProtect.innerHTML = `Clear`
            clearProtect.addEventListener("mousedown", () => {
                for (let i in protection) {
                    delete protection[i];
                }
            })
            protWin.appendChild(clearProtect);
            protWin.appendChild(mkHTML("br"));

            let forsProtectL = document.createElement("lable");
            forsProtectL.innerHTML = `Force Protect`
            forsProtectL.style.marginRight = "5px";
            protWin.appendChild(forsProtectL);

            let forsProtect = document.createElement("button");
            forsProtect.innerHTML = `off`
            forsProtect.style.marginRight = "5px";
            forsProtect.addEventListener("mousedown", () => {
                forsprotect = !forsprotect;
                forsProtect.innerHTML = forsprotect ? "on" : "off"
            })
            protWin.appendChild(forsProtect);
            protWin.appendChild(mkHTML("br"));

            let DeProtectL = document.createElement("lable");
            DeProtectL.innerHTML = `UnProtect`;
            DeProtectL.style.marginRight = "5px";
            protWin.appendChild(DeProtectL);

            let DeProtect = document.createElement("button");
            DeProtect.innerHTML = `off`
            DeProtect.style.marginRight = "5px";
            DeProtect.addEventListener("mousedown", () => {
                deprot = !deprot;
                DeProtect.innerHTML = deprot ? "on" : "off"
            })
            protWin.appendChild(DeProtect);
            protWin.appendChild(mkHTML("br"));
            /*
            let seeProtBorderL = document.createElement("lable");
            seeProtBorderL.innerHTML = `Prot Zone`;
            seeProtBorderL.style.marginRight = "5px";
            protWin.appendChild(seeProtBorderL);

            let seeProtBorder = document.createElement("button");
            seeProtBorder.innerHTML = `on`
            seeProtBorder.style.marginRight = "5px";
            seeProtBorder.addEventListener("mousedown", () => {
                protBorder = !protBorder;
                seeProtBorder.innerHTML = protBorder ? "on" : "off"
                let ctx = canvasas.getContext("2d");
                ctx.clearRect(0, 0, canvasas.width, canvasas.height);
            })
            protWin.appendChild(seeProtBorder);
            protWin.appendChild(mkHTML("br"));
    */
            let sneakyL = document.createElement("lable");
            sneakyL.innerHTML = `Sneaky bots`
            sneakyL.style.marginRight = "5px";
            botswin.appendChild(sneakyL);

            let sneakyB = document.createElement("button");
            sneakyB.innerHTML = `off`
            sneakyB.style.marginRight = "5px";
            sneakyB.addEventListener("mousedown", () => {
                bSneaky = !bSneaky;
                sneakyB.innerHTML = bSneaky ? "on" : "off"
            })
            botswin.appendChild(sneakyB);
            botswin.appendChild(mkHTML("br"));

            let follow = false;
            let Follow = document.createElement("button");
            Follow.innerHTML = `off`
            Follow.style.marginRight = "5px";
            Follow.addEventListener("mousedown", () => {
                follow = !follow;
                startFol();
                Follow.innerHTML = follow ? "on" : "off"
            })
            botswin.appendChild(Follow);
            botswin.appendChild(mkHTML("br"));

            async function startFol() {
                let angle = 0;
                let ader = 0;
                while (follow) {
                    ader += 0.01 * bots.length;
                    const centerX = OWOP.mouse.tileX;
                    const centerY = OWOP.mouse.tileY;
                    const radius = bots.length * 2;

                    for (let i in bots) {
                        const x = centerX + radius * Math.cos((angle * i));
                        const y = centerY + radius * Math.sin((angle * i));
                        bots[i].BOJS.world.move(x, y);
                        angle = (2 * Math.PI) / ((bots.length / ader) * 2);
                    }
                    await sleep(25);
                }
            }
            let botToolsLable = document.createElement("lable");
            botToolsLable.innerHTML = `botsTool`
            botToolsLable.style.marginRight = "5px";
            botswin.appendChild(botToolsLable);

            let botTools = document.createElement("select");
            botTools.innerHTML = "select";
            botTools.id = "bottools";
            botswin.appendChild(botTools);
            botswin.appendChild(mkHTML("br"));

            let clearDeadBots = document.createElement("button");
            clearDeadBots.innerHTML = `DEbots`
            clearDeadBots.addEventListener("mousedown", () => {
                for (let i in bots) {
                    if (!bots[i].BOJS.isWorldConnected) {
                        clearInterval(bots[i].BOJS.PBinterval);
                        let botCount = document.getElementById("botCount");
                        bots = bots.filter(j => j.BOJS.player.id !== bots[i].BOJS.player.id);
                        botCount.innerText = "Bots: " + bots.length;
                        console.log(`Bot ${bots[i].BOJS.player.id} left the game.`)
                        document.getElementById("bot-" + bots[i].BOJS.player.id).remove();
                    }
                }
            })
            botswin.appendChild(clearDeadBots);
            botswin.appendChild(mkHTML("br"));

            win.container.id = "BOJS-BOX";
            win.container.parentElement.classList.add("BOJS-BOX");
            win.container.appendChild(botswin);
            win.container.appendChild(protWin);
            win.container.classList.remove("wincontainer")
        })).move(70, 115);

        OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("m", {
            closeable: true
        }, win => {
            let botsTab = document.createElement("table");
            botsTab.id = "botsTab";

            var t = document.createElement("tr");
            t.innerHTML = "<th>ID</th><th>IP</th><th>PB</th><th><button>KICK</button></th>";
            t.childNodes[3].addEventListener("mousedown", () => {
                for (let i in bots) {
                    bots[i].BOJS.destroy();
                }
            })
            botsTab.appendChild(t);
            win.container.appendChild(botsTab);
            botsTab.parentElement.classList.add("botsTabid");
            botsTab.parentElement.style.maxHeight = "182px";
            win.container.parentElement.id = "copy-tools";
            win.container.classList.add("copy-tools");
            setTimeout(() => {
                let win = botsTab.parentElement.parentElement;
                win.querySelector("span").id = "ip_info";
                win.querySelector("span").innerHTML = "";
            }, 1000)
            botsTab.parentElement.id = "player-list";
        })).move(400, 115);
        let selectpic = false;
        OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("Сору Assets", {
            closeable: true
        }, win => {
            win.container.parentElement.id = "copy-tools";
            win.container.classList.add("copy-tools");
            const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '{}');
            let selectedpic = false;

            function addImage(imageData, id) {
                const img = document.createElement('img');
                img.src = imageData;
                img.style.width = '100px';
                img.style.height = '100px';
                img.dataset.id = id;
                img.addEventListener('click', () => {
                    if (selectedpic === id) {
                        selectedpic = false;
                        selectpic = false;
                        console.log(selectpic)
                    } else {
                        selectedpic = id;
                        selectpic = imageData;
                        console.log(selectpic)
                    }
                    localStorage.setItem('selectedpic', selectedpic.toString());
                    updateImageStyles();
                });
                img.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    deleteImage(id);
                });
                win.container.appendChild(img);
                updateImageStyles();
            }

            function deleteImage(id) {
                const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '{}');
                delete uploadedImages[id];
                localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
                win.container.querySelectorAll(`img[data-id="${id}"]`).forEach(img => img.remove());
            }

            Object.entries(uploadedImages).forEach(([id, imageData]) => addImage(imageData, id));

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.addEventListener('change', () => {
                Array.from(input.files).forEach(file => {
                    if (!file || !file.type.startsWith('image/')) {
                        return;
                    }
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '{}');
                        const id = Date.now().toString();
                        uploadedImages[id] = reader.result;
                        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
                        addImage(reader.result, id);
                    });
                    reader.readAsDataURL(file);
                });
            });

            const button = document.createElement('button');
            button.textContent = 'Upload Image';
            button.addEventListener('click', () => {
                input.click();
            });
            win.container.appendChild(button);
            button.parentElement.id = "assetsid";

            function updateImageStyles() {
                win.container.querySelectorAll('img').forEach((img, index) => {
                    if (img.dataset.id === selectedpic.toString()) {
                        img.style.border = '2px solid blue';
                    } else {
                        img.style.border = 'none';
                    }
                });
            }
        })).move(70, 248);
        const TOOLs = ["cursor 0", "move 1", "pippete 2", "eraser 3", "zoom 4", "bucket 5", "paste 6", "export 7", "line 8", "protect 9", "copy 10"];
        for (const tool of TOOLs) {
            const option = document.createElement("option");
            option.value = tool.split(" ")[1];
            option.innerHTML = tool.split(" ")[0];
            document.getElementById("bottools").appendChild(option);
        }
        const eq = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

        let last = 0;
        const getFree = () => {
            let b = bots.length;
            if (b === 0) return -1;
            if (last >= b) last = 0;
            return last++;
        };
        let protection = new Proxy([], {
            set: function (target, key, value) {
                target[key] = value;
                const [x, y] = key.split(',').map(Number);
                const event = new CustomEvent('protMod', { detail: { x, y, col: value } });
                document.dispatchEvent(event);
                return true;
            },
            deleteProperty: function (target, key) {
                const [x, y] = key.split(',').map(Number);
                const event = new CustomEvent('protDel', { detail: { x, y } });
                document.dispatchEvent(event);
                delete target[key];
                return true;
            }
        });
        /*
        let viv = document.querySelector("#viewport");
        let canvasas = document.createElement("canvas");
        canvasas.style.position = "absolute";
        canvasas.style.left = "0";
        canvasas.style.top = "0";
        let origc = document.querySelector("#animations");
        canvasas.width = origc.width;
        canvasas.height = origc.height;
        viv.append(canvasas);
        let rerenderBorder = function () {
            if (!protBorder) return;
            let ctx = canvasas.getContext("2d");
            ctx.clearRect(0, 0, canvasas.width, canvasas.height);
            let l = OWOP;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 5;

            for (let k in protection) {
                let [x, y] = k.split(',').map(Number);
                let pixel = protection[k];
                let cx = Math.abs((-OWOP.camera.x + x) * OWOP.camera.zoom);
                let cy = Math.abs((-OWOP.camera.y + y) * OWOP.camera.zoom);
                if (pixel) {
                    if (cx < 1920 && cy < 1080) {
                        let i = ((-OWOP.camera.x + x) * OWOP.camera.zoom);
                        let j = ((-OWOP.camera.y + y) * OWOP.camera.zoom);
                        if (!protection[`${x - 1},${y}`]) {
                            ctx.beginPath();
                            ctx.moveTo(i, j);
                            ctx.lineTo(i, j + l.camera.zoom);
                            ctx.stroke();
                        }
                        if (!protection[`${x},${y - 1}`]) {
                            ctx.beginPath();
                            ctx.moveTo(i, j);
                            ctx.lineTo(i + l.camera.zoom, j);
                            ctx.stroke();
                        }
                        if (!protection[`${x + 1},${y}`]) {
                            ctx.beginPath();
                            ctx.moveTo(i + l.camera.zoom, j);
                            ctx.lineTo(i + l.camera.zoom, j + l.camera.zoom);
                            ctx.stroke();
                        }
                        if (!protection[`${x},${y + 1}`]) {
                            ctx.beginPath();
                            ctx.moveTo(i, j + l.camera.zoom);
                            ctx.lineTo(i + l.camera.zoom, j + l.camera.zoom);
                            ctx.stroke();
                        }
                    }
                }
            }
        }
        let debounceTimerId = null;

        document.addEventListener('protMod', function (event) {
            const { x, y, col } = event.detail;
            clearTimeout(debounceTimerId);
            debounceTimerId = setTimeout(function () {
                rerenderBorder();
            }, 20);
        });
        document.addEventListener('protDel', function (event) {
            const { x, y } = event.detail;
            clearTimeout(debounceTimerId);
            debounceTimerId = setTimeout(function () {
                rerenderBorder();
            }, 20);
        });
        OWOP.eventSys.addListener(OWOP.EVENTS.camera.moved, function () {
            clearTimeout(debounceTimerId);
            debounceTimerId = setTimeout(function () {
                rerenderBorder();
            }, 5);
        }.bind(this));
        OWOP.eventSys.addListener(OWOP.EVENTS.camera.zoom, function () {
            clearTimeout(debounceTimerId);
            debounceTimerId = setTimeout(function () {
                rerenderBorder();
            }, 5);
        }.bind(this));
        */
        const chatCommands = {};
        window.chatCommands = chatCommands;

        function addChatCommand(name, help, usage, callback) {
            chatCommands[name] = { name, help, usage, callback };
        }

        function removeChatCommand(name) {
            delete chatCommands[name];
        }
        const blockedIDs = [];

        addChatCommand('block', 'Adds an ID to the blocked list', '/block "ID" (add / remove), /block (blocked list)', (args) => {
            const id = args[0];
            if (!args[0]) {
                if (blockedIDs.length > 0) {
                    OWOP.chat.local(`Blocked IDs: ${blockedIDs.join(', ')}`);
                } else {
                    OWOP.chat.local('The blocked list is empty.');
                }
            } else if (!blockedIDs.includes(id)) {
                blockedIDs.push(id);
                OWOP.chat.local(`ID "${id}" has been added to the blocked list.`);
            } else {
                const index = blockedIDs.indexOf(id);
                blockedIDs.splice(index, 1);
                OWOP.chat.local(`ID "${id}" has been removed from the blocked list.`);
            }
        });
        addChatCommand('tp', 'Teleport player to x, y coordinate', '/tp "X" "Y" (Teleport player to x, y coordinate)', (args) => {
            let X = parseInt(args[0]);
            let Y = parseInt(args[1]);
            if (!args[0]) {
                OWOP.chat.local(`Usage: /tp "x" "y"`);
            } else if (!args[1]) {
                OWOP.emit(29, X, X)
                OWOP.chat.local(`X: "${X}" ,Y: "${Y}"`);
            } else {
                OWOP.emit(29, X, Y)
                OWOP.chat.local(`X: "${X}" ,Y: "${Y}"`);
            }
        });
        addChatCommand('paste', 'paste pick', '/paste "X" "Y" (paste pick)', (args) => {
            let X = parseInt(args[0]);
            let Y = parseInt(args[1]);
            if (!args[0] || !args[1] || !(args[0] == parseInt(X)) || !(args[1] == parseInt(Y))) {
                OWOP.chat.local(`Usage: /paste "x" "y"`);
            } else {
                function a() {
                    let ctx;
                    let imgData = null;
                    var canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    function loadImage() {
                        var input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = function () {
                            var file = this.files[0];
                            var reader = new FileReader();
                            reader.onload = function () {
                                var img = new Image;
                                img.onload = async function () {
                                    canvas.width = img.width;
                                    canvas.height = img.height;
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(img, 0, 0);
                                    imgData = ctx.getImageData(0, 0, img.width, img.height);
                                    await sleep(100);
                                    OWOP.chat.local(`Pasting on X:${X}, Y:${Y}`);
                                    stop = true;
                                    await pasteImage(imgData, X, Y);
                                    stop = false;
                                    OWOP.chat.local(`Pasting Finish!`);
                                };
                                img.src = reader.result;
                            }.bind(this);
                            reader.readAsDataURL(file);
                        };
                        input.click();
                    }
                    loadImage();
                }
                a();
            }
        })
        addChatCommand('zoom', 'Set custom zoom', '/zoom 1-16 (set camera zoom)', (args) => {
            let num = parseInt(args[0]);
            if (!args[0] || !(args[0] == parseInt(num))) {
                OWOP.chat.local(`Usage: /zoom 1 - 16`);
            } else {
                OWOP.camera.zoom = num;
                OWOP.chat.local(`Zoom updated to ` + num);
            }
        });
        addChatCommand('speed', 'Set custom camera speed', '/speed (set camera speed)', (args) => {
            let num = parseInt(args[0]);
            if (!args[0] || !(args[0] == parseInt(num))) {
                OWOP.chat.local(`Usage: /speed 1 - 60`);
            } else {
                OWOP.options.movementSpeed = num,
                    OWOP.chat.local(`Camera speed: ` + num);
            }
        });
        addChatCommand('send', 'Send msg to copy server', '/send (messege)', (args) => {
            if (!args[0]) {
                OWOP.chat.local(`Usage: /send (messege)`);
            } else {
                try {
                    let msg = args.join(" ");
                    copyser.send(JSON.stringify(["Msg", [msg, '', '']]));
                } catch { };
            }
        });

        addChatCommand('recon', 'Reconnect to world', "/recon (disconnect all connected client)", (args) => {
            fetch("https://ourworldofpixels.com/api/disconnectme");
            setTimeout(() => {
                document.querySelector("#reconnect-btn").click();
                setTimeout(() => {
                    OWOP.chat.local(`Your id now: ` + OWOP.player.id);
                }, 2000)
            }, 2000)
        });
        let mutedId = [];
        function isMuted(id) {
            return mutedId.includes(id);
        }

        addChatCommand('mute', 'Mute a player', '/mute "ID" (add / remove), /mute (muted list)', (args) => {
            const id = args[0];
            if (!id) {
                if (mutedId.length > 0) {
                    OWOP.chat.local(`Muted IDs: ${mutedId.join(', ')}`);
                } else {
                    OWOP.chat.local('Muted list is empty.');
                }
            } else if (!isMuted(id)) {
                mutedId.push(id);
                OWOP.chat.local(`Player ID: "${id}" has been muted.`);
            } else {
                const index = mutedId.indexOf(id);
                mutedId.splice(index, 1);
                OWOP.chat.local(`Player ID: "${id}" has been unmuted.`);
            }
        });
        addChatCommand('copyHelp', 'Help list', '/copyHelp (help list)', () => {
            for (let i in chatCommands) {
                let b = chatCommands[i];
                OWOP.chat.local(b.usage);
            }
        })
        function parseIdFromMessage(message) {
            const match = message.match(/^\[?(\d+)\]?/);
            return match ? match[1] : null;
        }
        let pastmsg = [];
        function getPlayerType(id) {
            if (CopyPlayer[1].includes(parseInt(id))) {
                return "[Dev] ";
            } else if (CopyPlayer[0].includes(parseInt(id))) {
                return "[User] ";
            } else {
                return "";
            }
        }
        OWOP.chat.recvModifier = (msg) => {
            const id = parseIdFromMessage(msg);
            if (!id) return msg;
            if (isMuted(id)) {
                return null;
            }
            setTimeout(() => {
                let a = document.querySelector("#chat-messages > *:last-child");
                let copyPref = document.createElement("copyPref");
                copyPref.innerText = getPlayerType(id);
                if (pastmsg != msg) {
                    a.prepend(copyPref);
                } else {
                    a.querySelector("copyPref").replaceWith(copyPref);
                }

                if (id != OWOP.player.id) {
                    let player = OWOP.misc.world.players[id];
                    let cord = [Math.floor(player.x / 16), Math.floor(player.y / 16)];
                    console.log(cord)

                    let useful = document.createElement("copyuseful");
                    let cords = document.createElement("text");
                    cords.innerText = `${Math.floor(player.x / 16)}, ${Math.floor(player.y / 16)} `;
                    let inter;
                    cords.addEventListener("mouseover", (() => {
                        inter = setInterval((() => {
                            if (!OWOP.misc.world.players[id]) return;
                            cords.innerText = `${Math.floor(OWOP.misc.world.players[id].x / 16)}, ${Math.floor(OWOP.misc.world.players[id].x / 16)} `;
                        }))
                    }));
                    cords.addEventListener("mouseout", (() => {
                        clearInterval(inter);
                        cords.innerText = `${cord[0]}, ${cord[1]} `;
                    }));
                    useful.addEventListener("mousedown", ((e) => {
                        if (e.button == 0)
                            OWOP.emit(29, OWOP.misc.world.players[id].x / 16, OWOP.misc.world.players[id].y / 16);
                        else
                            OWOP.emit(29, cord[0], cord[1]);
                    }));
                    useful.prepend(cords);

                    if (pastmsg != msg) {
                        a.append(useful);
                    } else {
                        a.querySelector("copyuseful").replaceWith(useful);
                    }
                }
                pastmsg.push = msg;
            }, 100)
            return msg;
        };
        OWOP.chat.sendModifier = (message) => {
            if (message.startsWith('/')) {
                const args = message.substring(1).split(' ');
                console.log(args);
                const cmdName = args.shift();
                console.log(cmdName);
                if (cmdName in chatCommands) {
                    chatCommands[cmdName].callback(args);
                    return "/a";
                } else {
                    return message;
                }
            }
            return message;
        };

        OWOP.eventSys.addListener(OWOP.EVENTS.net.world.tilesUpdated, function (message) {
            if (protect) {
                for (let i = 0; i < message.length; i++) {
                    let p = message[i];
                    let pCol = [(p.rgb & (255 << 0)) >> 0, (p.rgb & (255 << 8)) >> 8, (p.rgb & (255 << 16)) >> 16];
                    let pixel = protection[`${p.x},${p.y}`];
                    if (pixel && !eq(pCol, pixel)) placePixel(p.x, p.y, pixel, true, true);
                }
            }
        }.bind(this));
        let pixbusu = false;
        let updStatusCTool = (() => {
            for (var i in copyTools) {
                let l = document.getElementById("tool-" + i).childNodes[0];
                let r = copyTools[i];
                setTimeout(() => {
                    r.name == OWOP.player.tool.name ? (l.style.backgroundImage = "url(https://i.imgur.com/GbmtkOY.png)",
                        i.className = "selected") : l.style.backgroundImage = "url(https://i.imgur.com/NnjGRWI.png)",
                        l.style.backgroundPosition = r.setposition;
                }, 100)
            }
        })
        document.addEventListener("mouseup", function (e) {
            updStatusCTool();
        })
        async function placePixel(x, y, color, ...other) {
            if (forsprotect) {
                protection[`${x},${y}`] = color;
            }
            try {
                if (stop121 || !!OWOP.misc._world.chunks[`${Math.floor(x / 16)},${Math.floor(y / 16)}`].locked) return;
                await pixbusu == true;
                if (color[3]) {
                    let alpha = color[3] / 255;
                    let r = color[0];
                    let g = color[1];
                    let b = color[2];
                    let pixel = OWOP.world.getPixel(x, y);
                    color = [
                        lerp(pixel[0], r, alpha), lerp(pixel[1], g, alpha), lerp(pixel[2], b, alpha)
                    ];
                }
                pixbusu = true;
                let a = getFree();
                if (a == -1) {
                    pixbusu = false;
                    return;
                }
                bots[a].BOJS.player.pixelBucket.canSpend(0);
                if (!eq(OWOP.world.getPixel(x, y), color)) {
                    if (bots[a].BOJS.player.pixelBucket.allowance >= 2) {
                        bots[a].BOJS.world.setPixel(x, y, color, ...other);
                        pixbusu = false;
                    } else {
                        await sleep(0);
                        pixbusu = false;
                        await placePixel(x, y, color, ...other);
                        return;
                    }
                }
                pixbusu = false;
            } catch { }
        }
        let copyToolwin = OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("Сору tools", {
            closeable: false
        }, win => {
            win.container.id = "toole-container";
            win.container.classList.add("copy-tools");
            win.container.parentElement.id = "copy-tools";
            win.container.addEventListener("mouseup", function (e) {
                updStatusCTool();
            })
        })).move(70, 32);
        let copyTools = {};
        function updateCopyTools() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : copyToolwin;
            if (e) {
                var t = e.container,
                    n = function (e, r) {
                        return function (t) {
                            OWOP.tools.allTools[e] = copyTools[e];
                            OWOP.player.tool = e;
                            delete OWOP.tools.allTools[e];
                            OWOP.sounds.play(OWOP.sounds.click);
                            updStatusCTool();
                        }
                    };
                for (var o in t.innerHTML = "", copyTools) {
                    var r = copyTools[o];
                    var i = document.createElement("button"),
                        l = document.createElement("div");
                    (0, OWOP.util.setTooltip)(i, r.name + " tool"),
                        i.id = "tool-" + o,
                        i.addEventListener("mousedown", n(o, i)),
                        r.name == OWOP.player.tool.name ? (l.style.backgroundImage = "url(https://i.imgur.com/GbmtkOY.png)",
                            i.className = "selected") : l.style.backgroundImage = "url(https://i.imgur.com/NnjGRWI.png)",
                        l.style.backgroundPosition = r.setposition,
                        i.appendChild(l),
                        t.appendChild(i)
                }
            }
        }
        function w(e) {
            e.id = e.name.toLowerCase()
            copyTools[e.id] = e,
                updateCopyTools()
        }
        let busu = false;
        async function ChunkFill(X, Y, color, pix) {
            while (busu) await sleep(0);
            busu = true;
            for (let y = 0; y < pix; ++y) {
                for (let x = 0; x < pix; ++x) {
                    await placePixel(x + X * pix, y + Y * pix, color);
                }
            }
            for (let i in bots) bots[i].BOJS.world.move(0, 0)
            busu = false;
        }
        function lerp(v0, v1, r) {
            return v0 * (1 - r) + v1 * r;
        }
        async function pasteImage(img, X = OWOP.mouse.tileX, Y = OWOP.mouse.tileY) {
            if (img === null) {
                alert('No image loaded');
                return;
            }
            for (var y = 0; y < img.height; y++) {
                for (var x = 0; x < img.width; x++) {
                    if (!stop) return;
                    var r = img.data[(y * img.width + x) * 4];
                    var g = img.data[(y * img.width + x) * 4 + 1];
                    var b = img.data[(y * img.width + x) * 4 + 2];
                    var alpha = img.data[(y * img.width + x) * 4 + 3] / 255;
                    let pixel = OWOP.world.getPixel(x + X, y + Y);
                    let color = [
                        lerp(pixel[0], r, alpha), lerp(pixel[1], g, alpha), lerp(pixel[2], b, alpha)
                    ];
                    await placePixel(x + X, y + Y, color);
                }
            }
            return true;
        }
        async function BotSetChunk(e, t, n) {
            var o = new Uint8Array(8 + 16 * 16 * 3)
            let i = 0;
            for (var y = 0, b = 8; y < 16; y++, b += 3) {
                for (var x = 0, a = 8; x < 16; x++, a += 3) {
                    if (stop121) return;
                    o[a] = 255 & n[i], o[a + 1] = n[i] >> 8 & 255, o[a + 2] = n[i] >> 16 & 255;
                    i++
                    await placePixel(x + e * 16, y + t * 16, [o[a], o[a + 1], o[a + 2]]);
                }
            }
            return !0;
        }
        async function protectFromTo(x1, y1, x2, y2) {
            let xStart = x1 > x2 ? x2 : x1;
            let yStart = y1 > y2 ? y2 : y1;
            let xEnd = x1 < x2 ? x2 : x1;
            let yEnd = y1 < y2 ? y2 : y1;
            for (var y = yStart; y < yEnd; y++) {
                for (var x = xStart; x < xEnd; x++) {
                    if (deprot) delete protection[`${x},${y}`]; else {
                        let pix = OWOP.world.getPixel(x, y);
                        protection[`${x},${y}`] = pix;
                    }
                }
            }
        }
        async function drawFromTo(x1, y1, x2, y2, color) {
            let xStart = x1 > x2 ? x2 : x1;
            let yStart = y1 > y2 ? y2 : y1;
            let xEnd = x1 < x2 ? x2 : x1;
            let yEnd = y1 < y2 ? y2 : y1;
            for (var y = yStart; y < yEnd; y++) {
                for (var x = xStart; x < xEnd; x++) {
                    await placePixel(x, y, color)
                }
            }
            return true;
        }
        async function drawFromToUnpix(x1, y1, x2, y2, color, col) {
            let xStart = x1 > x2 ? x2 : x1;
            let yStart = y1 > y2 ? y2 : y1;
            let xEnd = x1 < x2 ? x2 : x1;
            let yEnd = y1 < y2 ? y2 : y1;
            for (let y = yStart; y < yEnd; y++) {
                for (let x = xStart; x < xEnd; x++) {
                    let a = OWOP.world.getPixel(x, y);
                    if (col.some(c => eq(c, a))) {
                        await placePixel(x, y, color);
                    }
                }
            }
            return true;
        }
        function palleteToClear(x1, y1, x2, y2) {
            let xStart = x1 > x2 ? x2 : x1;
            let yStart = y1 > y2 ? y2 : y1;
            let xEnd = x1 < x2 ? x2 : x1;
            let yEnd = y1 < y2 ? y2 : y1;
            let pall = new Set(); // Use a Set object to store unique color values
            for (let y = yStart; y < yEnd; y++) {
                for (let x = xStart; x < xEnd; x++) {
                    const pixelColor = OWOP.world.getPixel(x, y);
                    if (OWOP.player.palette.some(c => !eq(c, pixelColor))) {
                        pall.add(JSON.stringify(pixelColor)); // Store unique color values in the Set
                    }
                }
            }
            return Array.from(pall).map(color => JSON.parse(color)); // Convert the Set back to an array and parse the color values
        }
        let areaa = 1;
        let fillAreaAfterSelected = false;
        w(new OWOP.tools.class("Еraser", OWOP.cursors.erase, OWOP.fx.player.RECT_SELECT_ALIGNED(0), 1, function (tool) {
            let pix = 16;
            tool.setFxRenderer((fx, ctx) => {
                const X = fx.extra.player.x,
                    Y = fx.extra.player.y,
                    cX = (pix * Math.floor(X / (pix * 16)) - OWOP.camera.x) * OWOP.camera.zoom,
                    cY = (pix * Math.floor(Y / (pix * 16)) - OWOP.camera.y) * OWOP.camera.zoom;
                ctx.globalAlpha = .2;
                ctx.fillStyle = OWOP.player.htmlRgb;
                ctx.fillRect(cX, cY, pix * OWOP.camera.zoom, pix * OWOP.camera.zoom);
                return true;
            });

            tool.setEvent('mousedown mousemove', async function (mouse, event) {
                if (mouse.buttons === 1) {
                    let chunkX = Math.floor(OWOP.mouse.tileX / pix);
                    let chunkY = Math.floor(OWOP.mouse.tileY / pix);
                    let color = event.button === 0 ? OWOP.player.selectedColor : [0xff, 0xff, 0xff];
                    await ChunkFill(chunkX, chunkY, color, pix);
                }
            });
        }));
        w(new OWOP.tools.class("Сopy", OWOP.cursors.copy, OWOP.fx.player.RECT_SELECT_ALIGNED(0), 1, function (tool) {
            let e = tool;
            let u = OWOP;
            e.setFxRenderer(function (t, n, o) {
                if (!t.extra.isLocalPlayer) return 1;
                var r = t.extra.player.x,
                    i = t.extra.player.y,
                    a = (Math.floor(r / 16) - u.camera.x) * u.camera.zoom,
                    s = (Math.floor(i / 16) - u.camera.y) * u.camera.zoom,
                    l = n.lineWidth;
                if (n.lineWidth = 1, e.extra.end) {
                    var c = e.extra.start,
                        d = e.extra.end,
                        h = (r = (c[0] - u.camera.x) * u.camera.zoom + .5, i = (c[1] - u.camera.y) * u.camera.zoom + .5, d[0] - c[0]),
                        f = d[1] - c[1];
                    n.beginPath(), n.rect(r, i, h * u.camera.zoom, f * u.camera.zoom), n.globalAlpha = 1, n.strokeStyle = "#FFFFFF", n.stroke(), n.setLineDash([3, 4]), n.strokeStyle = "#000000", n.stroke(), n.globalAlpha = .25 + Math.sin(o / 500) / 4, n.fillStyle = u.renderer.patterns.unloaded, n.fill(), n.setLineDash([]);
                    var p = n.font;
                    n.font = "16px sans-serif";
                    var m = (e.extra.clicking ? "" : "Right click to copy ") + "(" + Math.abs(h) + "x" + Math.abs(f) + ")",
                        v = window.innerWidth >> 1,
                        g = window.innerHeight >> 1;
                    return function (e, t, n, o, r) {
                        e.strokeStyle = "#000000",
                            e.fillStyle = "#FFFFFF",
                            e.lineWidth = 2.5,
                            e.globalAlpha = .5,
                            r && (n -= e.measureText(t).width >> 1),
                            e.strokeText(t, n, o),
                            e.globalAlpha = 1,
                            e.fillText(t, n, o)
                    }(n, m, v = Math.max(r, Math.min(v, r + h * u.camera.zoom)), g = Math.max(i, Math.min(g, i + f * u.camera.zoom)), !0), n.font = p, n.lineWidth = l, 0
                }
                return n.beginPath(),
                    n.moveTo(0, s + .5),
                    n.lineTo(window.innerWidth, s + .5),
                    n.moveTo(a + .5, 0),
                    n.lineTo(a + .5, window.innerHeight),
                    n.globalAlpha = 1,
                    n.strokeStyle = "#FFFFFF",
                    n.stroke(),
                    n.setLineDash([3]),
                    n.strokeStyle = "#000000",
                    n.stroke(), n.setLineDash([]),
                    n.lineWidth = l, 1
            }), e.extra.start = null, e.extra.end = null, e.extra.clicking = !1, e.setEvent("mousedown", function (t, n) {
                var o = e.extra.start,
                    r = e.extra.end,
                    i = function () {
                        return t.tileX >= o[0] && t.tileX < r[0] && t.tileY >= o[1] && t.tileY < r[1]
                    };
                if (1 !== t.buttons || e.extra.end) {
                    if (1 === t.buttons && e.extra.end)
                        if (i()) {
                            var a = t.tileX,
                                s = t.tileY;
                            e.setEvent("mousemove", function (t, n) {
                                var i = t.tileX - a,
                                    l = t.tileY - s;
                                e.extra.start = [o[0] + i, o[1] + l], e.extra.end = [
                                    r[0] + i, r[1] + l
                                ]
                            });
                            var l = function () {
                                e.setEvent("mouseup deselect mousemove", null)
                            };
                            e.setEvent("deselect", l), e.setEvent("mouseup", function (e, t) {
                                1 & e.buttons || l()
                            })
                        }
                        else e.extra.start = null, e.extra.end = null;
                    else if (2 === t.buttons && e.extra.end && i()) {
                        e.extra.start = null, e.extra.end = null;
                        var d = o[0],
                            f = o[1],
                            m = r[0] - o[0],
                            v = r[1] - o[1],
                            g = document.createElement("canvas");
                        g.width = m, g.height = v;
                        for (var y = g.getContext("2d"), w = y.createImageData(m, v), b = f; b < f + v; b++)
                            for (var k = d; k < d + m; k++) {
                                var x = OWOP.world.getPixel(k, b);
                                x && (w.data[4 * ((b - f) * m + (k - d))] = x[0], w.data[4 * (
                                    (b - f) * m + (k - d)) + 1] = x[1], w.data[4 * ((b - f) * m + (k - d)) + 2] = x[2], w.data[4 * ((b - f) * m + (k - d)) + 3] = 255)
                            }
                        y.putImageData(w, 0, 0);
                        OWOP.tools.allTools["рaste"] = copyTools["рaste"];
                        var E = OWOP.player.tools["рaste"];
                        E.extra.canvas = g;
                        var S = E.events.select;
                        E.events.select = function () {
                            E.events.select = S
                        }, OWOP.player.tool = "рaste"
                    }
                }
                else {
                    e.extra.start = [t.tileX, t.tileY], e.extra.clicking = !0, e.setEvent("mousemove", function (t, n) {
                        if (e.extra.start && 1 === t.buttons) return e.extra.end = [t.tileX, t.tileY], 1
                    });
                    var T = function () {
                        e.setEvent("mousemove mouseup deselect", null), e.extra.clicking = !1;
                        var t = e.extra.start,
                            n = e.extra.end;
                        if (n) {
                            if (t[0] !== n[0] && t[1] !== n[1] || (e.extra.start = null, e.extra.end = null), t[0] > n[0]) {
                                var o = n[0];
                                n[0] = t[0], t[0] = o
                            }
                            if (t[1] > n[1]) {
                                o = n[1];
                                n[1] = t[1], t[1] = o
                            }
                        }
                        u.renderer.render(u.renderer.rendertype.FX)
                    };
                    e.setEvent("deselect", T), e.setEvent("mouseup", function (e, t) {
                        1 & e.buttons || T()
                    })
                }
            })
        }));
        w(new OWOP.tools.class('Pаster', OWOP.cursors.paste, OWOP.fx.player.RECT_SELECT_ALIGNED(0), 1, function (tool) {
            var imgData = null;
            let imeg = {
                width: 10,
                height: 10
            }
            let ctx;
            var canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            let imgg;
            const camera = OWOP.camera;
            let XX = OWOP.mouse.tileX;
            let YY = OWOP.mouse.tileY;
            function loadImage() {
                if (selectpic) {
                    const img = document.createElement('img');
                    img.src = selectpic;
                    imgg = img;
                    canvas.width = img.width;
                    imeg.width = img.width;
                    canvas.height = img.height;
                    imeg.height = img.height;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    imgData = ctx.getImageData(0, 0, img.width, img.height);
                } else {
                    var input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        reader.onload = function () {
                            var img = new Image;
                            img.onload = function () {
                                imgg = img;
                                canvas.width = img.width;
                                imeg.width = img.width;
                                canvas.height = img.height;
                                imeg.height = img.height;
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(img, 0, 0);
                                imgData = ctx.getImageData(0, 0, img.width, img.height);
                            };
                            img.src = reader.result;
                        }.bind(this);
                        reader.readAsDataURL(file);
                    };
                    input.click();
                }
            }

            tool.setFxRenderer(function (fx, ctx) {
                let zoom = camera.zoom;
                if (stop) {
                    let fxx = Math.floor(XX << 4 / 16) - camera.x;
                    let fxy = Math.floor(YY << 4 / 16) - camera.y;
                    if (fx.extra.isLocalPlayer && imgData.width && imgData.height) {
                        ctx.globalAlpha = 0.5;
                        ctx.strokeStyle = "#000000";
                        ctx.scale(zoom, zoom);
                        try {
                            ctx.drawImage(imgg, fxx, fxy);
                        } catch { }
                        ctx.scale(1 / zoom, 1 / zoom);
                        ctx.globalAlpha = 0.8;
                        ctx.strokeRect(fxx * zoom, fxy * zoom, imgData.width * zoom, imgData.height * zoom);
                        return 0;
                    }
                } else if (!stop) {
                    let fxx = Math.floor(OWOP.mouse.tileX << 4 / 16) - camera.x;
                    let fxy = Math.floor(OWOP.mouse.tileY << 4 / 16) - camera.y;
                    if (fx.extra.isLocalPlayer && imeg.width && imeg.height) {
                        ctx.globalAlpha = 0.5;
                        ctx.strokeStyle = "#000000";
                        ctx.scale(zoom, zoom);
                        try {
                            ctx.drawImage(imgg, fxx, fxy);
                        } catch { }
                        ctx.scale(1 / zoom, 1 / zoom);
                        ctx.globalAlpha = 0.8;
                        ctx.strokeRect(fxx * zoom, fxy * zoom, imeg.width * zoom, imeg.height * zoom);
                        return 0;
                    }
                }
            });
            tool.setEvent("select", function () {
                if (!stop) {
                    loadImage();
                }
            })
            tool.setEvent('mousedown', async (mouse, event) => {
                if (event.button == 0) {
                    XX = OWOP.mouse.tileX;
                    YY = OWOP.mouse.tileY;
                    stop = true;
                    await pasteImage(imgData);
                    stop = false;
                } else {
                    stop = false;
                }
            });
        }));
        w(new OWOP.tools.class('Fillеr', OWOP.cursors.fill, OWOP.fx.player.NONE, 1, tool => {
            let stopFlag = false;

            async function fill(x, y, targetColor, fillColor) {
                if (!targetColor) return;
                const pixelQueue = [[x, y]];
                const visited = new Set();
                while (pixelQueue.length > 0) {
                    if (stopFlag) return;
                    const [x, y] = pixelQueue.shift();
                    if (visited.has(`${x},${y}`)) {
                        continue;
                    }
                    visited.add(`${x},${y}`);
                    const currentColor = await OWOP.world.getPixel(x, y);
                    if (
                        currentColor[0] !== targetColor[0] ||
                        currentColor[1] !== targetColor[1] ||
                        currentColor[2] !== targetColor[2]
                    ) {
                        continue;
                    }
                    await placePixel(x, y, fillColor);
                    pixelQueue.push([x + 1, y]);
                    pixelQueue.push([x - 1, y]);
                    pixelQueue.push([x, y + 1]);
                    pixelQueue.push([x, y - 1]);
                    // add diagonals to the queue to fill in a circular pattern
                    pixelQueue.push([x + 1, y + 1]);
                    pixelQueue.push([x + 1, y - 1]);
                    pixelQueue.push([x - 1, y + 1]);
                    pixelQueue.push([x - 1, y - 1]);
                }
            }
            function stopFill() {
                stopFlag = true;
                busy = false;
            }
            let busy = false;
            async function startFill(newX, newY, targetColor, fillColor) {
                if (busy) return;
                busy = true;
                stopFlag = false;
                await fill(newX, newY, targetColor, fillColor);
            }
            tool.setEvent("mousedown", async function (mouse) {
                if (4 & mouse.buttons || 3 & mouse.buttons == 3)
                    return;
                startFill(mouse.tileX, mouse.tileY, OWOP.world.getPixel(mouse.tileX, mouse.tileY), OWOP.player.selectedColor);
            });
            tool.setEvent("mouseup deselect", mouse => {
                stopFill();
                return;
            });
        }));
        w(new OWOP.tools.class('Area Еraser', OWOP.cursors.select, OWOP.fx.player.NONE, 1, function (tool) {
            tool.setFxRenderer(function (fx, ctx, time) {
                if (!fx.extra.isLocalPlayer) return 1;
                var r = fx.extra.player.x,
                    i = fx.extra.player.y,
                    a = (Math.floor(r / 16) - OWOP.camera.x) * OWOP.camera.zoom,
                    s = (Math.floor(i / 16) - OWOP.camera.y) * OWOP.camera.zoom;
                let x = fx.extra.player.x;
                let y = fx.extra.player.y;
                let oldlinew = ctx.lineWidth;
                ctx.lineWidth = 1;
                if (tool.extra.end) {
                    let s = tool.extra.start;
                    let e = tool.extra.end;
                    let x = (s[0] - OWOP.camera.x) * OWOP.camera.zoom + 0.5;
                    let y = (s[1] - OWOP.camera.y) * OWOP.camera.zoom + 0.5;
                    let w = e[0] - s[0];
                    let h = e[1] - s[1];
                    ctx.beginPath();
                    ctx.rect(x, y, w * OWOP.camera.zoom, h * OWOP.camera.zoom);
                    ctx.globalAlpha = 0.25;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                    ctx.setLineDash([3, 4]);
                    ctx.strokeStyle = "#000000";
                    ctx.stroke();
                    ctx.globalAlpha = 0.25 + Math.sin(time / 320) / 4;
                    ctx.fillStyle = OWOP.renderer.patterns.unloaded;
                    ctx.fill();
                    ctx.setLineDash([]);
                    let oldfont = ctx.font;
                    ctx.font = "16px sans-serif";
                    let txt = (!tool.extra.clicking ? "Right-Click Inside to start. | Right-Click Anywhere to stop. " : "") + '(' + Math.abs(w) + 'x' + Math.abs(h) + ')';
                    let txtx = window.innerWidth >> 1;
                    let txty = window.innerHeight >> 1;
                    txtx = Math.max(x, Math.min(txtx, x + w * OWOP.camera.zoom));
                    txty = Math.max(y, Math.min(txty, y + h * OWOP.camera.zoom));
                    OWOP.drawText = (ctx, str, x, y, centered) => {
                        ctx.strokeStyle = "#000000", ctx.fillStyle = "#FFFFFF", ctx.lineWidth = 2.5, ctx.globalAlpha = 1;
                        if (centered) {
                            x -= ctx.measureText(str).width >> 1;
                        }
                        ctx.strokeText(str, x, y);
                        ctx.globalAlpha = 1;
                        ctx.fillText(str, x, y);
                    };
                    OWOP.drawText(ctx, txt, txtx, txty, true);
                    ctx.font = oldfont;
                    ctx.lineWidth = oldlinew;
                    return 0;
                } else {
                    ctx.beginPath(),
                        ctx.moveTo(0, s + .5),
                        ctx.lineTo(window.innerWidth, s + .5),
                        ctx.moveTo(a + .5, 0),
                        ctx.lineTo(a + .5, window.innerHeight),
                        ctx.globalAlpha = 1,
                        ctx.strokeStyle = "#FFFFFF",
                        ctx.stroke(),
                        ctx.setLineDash([3]),
                        ctx.strokeStyle = "#000000",
                        ctx.stroke(),
                        ctx.setLineDash([]),
                        ctx.lineWidth = 1
                    return 1;
                }
            });
            tool.extra.start = null;
            tool.extra.end = null;
            tool.extra.clicking = false;
            tool.setEvent('mousedown', function (mouse, event) {
                let s = tool.extra.start;
                let e = tool.extra.end;
                let isInside = function isInside() {
                    return mouse.tileX >= s[0] && mouse.tileX < e[0] && mouse.tileY >= s[1] && mouse.tileY < e[1];
                };
                if (mouse.buttons === 1 && !tool.extra.end) {
                    tool.extra.start = [Math.floor(mouse.tileX / areaa) * areaa, Math.floor(mouse.tileY / areaa) * areaa];
                    tool.extra.clicking = true;
                    tool.setEvent('mousemove', function (mouse, event) {
                        if (tool.extra.start && mouse.buttons === 1) {
                            tool.extra.end = [Math.floor(mouse.tileX / areaa) * areaa, Math.floor(mouse.tileY / areaa) * areaa];
                            return 1;
                        }
                    });
                    let finish = async function finish() {
                        tool.setEvent('mousemove mouseup deselect', null);
                        tool.extra.clicking = false;
                        let s = tool.extra.start;
                        let e = tool.extra.end;
                        if (fillAreaAfterSelected == true) {
                            let color = OWOP.player.selectedColor;
                            tool.extra.start = null;
                            tool.extra.end = null;
                            OWOP.renderer.render(OWOP.renderer.rendertype.FX);
                            await drawFromTo(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], color)
                        }
                        if (e) {
                            if (s[0] === e[0] || s[1] === e[1]) {
                                tool.extra.start = null;
                                tool.extra.end = null;
                            }
                            if (s[0] > e[0]) {
                                let tmp = e[0];
                                e[0] = s[0];
                                s[0] = tmp;
                            }
                            if (s[1] > e[1]) {
                                let tmp = e[1];
                                e[1] = s[1];
                                s[1] = tmp;
                            }
                        }
                        OWOP.renderer.render(OWOP.renderer.rendertype.FX);
                    };
                    tool.setEvent('deselect', finish);
                    tool.setEvent('mouseup', function (mouse, event) {
                        if (!(mouse.buttons & 1)) {
                            finish();
                        }
                    });
                }
                else if (mouse.buttons === 1 && tool.extra.end) {
                    if (isInside()) {
                        let offx = mouse.tileX;
                        let offy = mouse.tileY;
                        tool.setEvent('mousemove', function (mouse, event) {
                            let dx = mouse.tileX - offx;
                            let dy = mouse.tileY - offy;
                            tool.extra.start = [s[0] + dx, s[1] + dy];
                            tool.extra.end = [e[0] + dx, e[1] + dy];
                        });
                        let end = function end() {
                            tool.setEvent('mouseup deselect mousemove', null);
                        };
                        tool.setEvent('deselect', end);
                        tool.setEvent('mouseup', function (mouse, event) {
                            if (!(mouse.buttons & 1)) {
                                end();
                            };
                        });
                    }
                }
                else if (mouse.buttons === 2 && tool.extra.end && isInside()) {
                    let color = OWOP.player.selectedColor;
                    drawFromTo(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], color)
                }
                else {
                    if (event.button == 2) {
                        tool.extra.start = null;
                        tool.extra.end = null;
                    }
                }
            });
        }));
        w(new OWOP.tools.class("Тext", OWOP.cursors.write, OWOP.fx.player.NONE, 1, function (tool) {
            var xPos = null;
            var yPos = null;
            var fonts = {};
            var font = null;

            var fontInput = new OWOP.windowSys.class.input("Choose Font", 955, "number", function (value) {
                var id = parseInt(value);
                if (id in fonts) {
                    font = id;
                    return;
                }
                let url = "https://www.pentacom.jp/pentacom/bitfontmaker2/gallery/?id=" + id;
                url = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
                fetch(url).then(a => {
                    return a.text();
                }).then(a => {
                    fontExtr = document.createElement("div");
                    fontExtr.innerHTML = a;
                    let scripts = fontExtr.querySelectorAll("script");
                    var source = scripts[10].textContent;
                    console.log(source);
                    var data = JSON.parse(source.match(/loadData\('(.+)'\)/)[1]);
                    var meta = source.match(/drawSample\('',([0-9]+),(-?[0-9]+),([0-9]+)\)/);
                    console.log(meta);
                    data.letterspace = parseInt(meta[1]);
                    data.monospacewidth = parseInt(meta[2]);
                    fonts[id] = data;
                    font = id;
                });
            });

            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
            chars += "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя"
            chars += "¡¢£€¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";
            chars += "ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž";

            tool.setFxRenderer(function (fx, ctx, time) {
                var x = fx.extra.player.x;
                var y = fx.extra.player.y;
                if (xPos !== null && yPos !== null) {
                    x = xPos * 16;
                    y = yPos * 16;
                }
                var fxx = (Math.floor(x / 16) - OWOP.camera.x) * OWOP.camera.zoom;
                var fxy = (Math.floor(y / 16) - OWOP.camera.y) * OWOP.camera.zoom;
                ctx.globalAlpha = 0.8;
                ctx.strokeStyle = fx.extra.player.htmlRgb;
                ctx.strokeRect(fxx, fxy, OWOP.camera.zoom, OWOP.camera.zoom * 12);
                return 0;
            });

            tool.setEvent("select", function () {
                OWOP.windowSys.addWindow(fontInput);
            });
            tool.setEvent("deselect", function () {
                font = null;
            });

            tool.setEvent("mousedown mousemove", function (mouse, event) {
                if (mouse.buttons === 1) {
                    xPos = mouse.tileX;
                    yPos = mouse.tileY;
                }
            });
            tool.setEvent("keydown", function () { return true; });
            tool.setEvent("keyup", function () { return true; });

            window.addEventListener("keypress", function (event) {
                if (font === null || xPos === null || yPos === null || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
                    return;
                }

                var f = fonts[font];
                var letterSpacing = (f.letterspace / 64 | 0) - 1;
                var isMono = f.monospacewidth !== -1;

                if (event.which == 32) {
                    xPos += isMono ? f.monospacewidth : 4 + letterSpacing;
                    return;
                }

                var char = f[event.which];
                if (!char) {
                    return;
                }

                var width = 0;
                for (var y = 0; y < 16; y++) {
                    for (var x = 0; x < 16; x++) {
                        if (char[y] & (1 << x) && x > width) width = x;
                    }
                }

                var color = OWOP.player.palette[OWOP.player.paletteIndex];

                //отрисовка буквы и границы
                for (var y = 0; y < 16; y++) {
                    for (var x = 0; x < 16; x++) {
                        if (!(char[y] & (1 << x))) {
                            continue;
                        }
                        placePixel(xPos + x - 2, yPos + y, color);
                    }
                }

                xPos += isMono ? f.monospacewidth : width + letterSpacing;
            });
        }));
        w(new OWOP.tools.class("Рaste", OWOP.cursors.paste, OWOP.fx.player.RECT_SELECT_ALIGNED(0), 1, function (e) {
            let u = OWOP;
            let h = OWOP;
            delete OWOP.tools.allTools["рaste"];
            e.extra.sendQueue = [], e.setFxRenderer(function (t, n, o) {
                var r = u.camera.zoom,
                    a = t.extra.player.x,
                    s = t.extra.player.y,
                    l = Math.floor(a / 16) - u.camera.x,
                    c = Math.floor(s / 16) - u.camera.y,
                    d = e.extra.sendQueue;
                if (d.length) {
                    var h = 16;
                    n.strokeStyle = "#000000", n.globalAlpha = .8, n.beginPath();
                    for (var f = 0; f < d.length; f++) n.rect((d[f].x * h - u.camera.x) * r, (d[f].y * h - u.camera.y) * r, r * h, r * h);
                    return n.stroke(), 0
                }
                if (e.extra.canvas && t.extra.isLocalPlayer) return n.globalAlpha = .5 + Math.sin(o / 500) / 4, n.strokeStyle = "#000000", n.scale(r, r), n.drawImage(e.extra.canvas, l, c), n.scale(1 / r, 1 / r), n.globalAlpha = .8, n.strokeRect(l * r, c * r, e.extra.canvas.width * r, e.extra.canvas.height * r), 0
            });
            e.setEvent("tick", async function () {
                var t = e.extra.sendQueue;
                t.length && await BotSetChunk(t[0].x, t[0].y, t[0].buf) && t.shift()
            }), e.setEvent("mousedown", function (t) {
                if (1 & t.buttons) {
                    if (e.extra.canvas) {
                        if (e.extra.sendQueue.length) throw new Error("Wait until pasting finishes, or cancel with right click!");
                        !async function (t, n) {
                            var o = new Uint32Array(16 * 16),
                                r = e.extra.canvas.getContext("2d").getImageData(0, 0, e.extra.canvas.width, e.extra.canvas.height),
                                s = new Uint32Array(r.data.buffer),
                                c = Math.ceil(((0, OWOP.util.absMod)(t, 16) + r.width) / 16),
                                u = Math.ceil(((0, OWOP.util.absMod)(n, 16) + r.height) / 16),
                                d = function (o, i) {
                                    var a = i - n,
                                        l = o - t;
                                    if (a < 0 || l < 0 || a >= r.height || l >= r.width) {
                                        var c = OWOP.world.getPixel(o, i);
                                        return !c && e.extra.wreckStuff && (c = [255, 255,
                                            255
                                        ]), c ? c[2] << 16 | c[1] << 8 | c[0] : null
                                    }
                                    var u = s[a * r.width + l],
                                        d = OWOP.world.getPixel(o, i),
                                        f = u >> 24 & 255;
                                    if (!d) {
                                        if (!e.extra.wreckStuff) return null;
                                        d = [255, 255, 255]
                                    }
                                    var p = (1 - f / 255) * d[0] + f / 255 * (255 & u),
                                        m = (1 - f / 255) * d[1] + f / 255 * (u >> 8 & 255),
                                        v = (1 - f / 255) * d[2] + f / 255 * (u >> 16 & 255),
                                        g = v << 16 | m << 8 | p;
                                    return p == d[0] && m == d[1] && v == d[2] ? g : 4278190080 | g
                                },
                                f = function (e, t) {
                                    for (var n = 0, r = e * 16, a = t * 16, s = 0; s < 16; s++)
                                        for (var l = 0; l < 16; l++) {
                                            var c = d(l + r, s + a);
                                            if (null === c) throw new Error("Couldn't paste -- chunk (" + e + ", " + t + ") is unloaded");
                                            4278190080 & c && ++n, o[s * 16 + l] = 16777215 & c
                                        }
                                    return n ? o : null
                                };
                            for (var p = Math.floor(n / 16), m = u; --m >= 0; p++)
                                for (var v = Math.floor(t / 16), g = c; --g >= 0; v++) {
                                    var y = await f(v, p);
                                    if (y && !(await BotSetChunk(v, p, y))) {
                                        var w = new Uint32Array(y.length);
                                        w.set(y), e.extra.sendQueue.push({
                                            x: v,
                                            y: p,
                                            buf: w
                                        })
                                    }
                                }
                        }(t.tileX, t.tileY)
                    }
                }
                else 2 & t.buttons && (e.extra.sendQueue = [])
            });
            var t = document.createElement("input");
            t.type = "file", t.accept = "image/*", e.setEvent("select", function () {
                t.onchange = function (n) {
                    if (t.files && t.files[0]) {
                        var o = new FileReader;
                        o.onload = function (t) {
                            var n = new Image;
                            n.onload = function () {
                                e.extra.canvas = document.createElement("canvas"),
                                    e.extra.canvas.width = n.width,
                                    e.extra.canvas.height = n.height,
                                    e.extra.canvas.getContext("2d").drawImage(n, 0, 0),
                                    console.log("Loaded image")
                            }, n.src = t.target.result
                        }, o.readAsDataURL(t.files[0])
                    }
                }, t.click()
            })
        }));
        w(new OWOP.tools.class('Areа Unpixels (press n to select recolor pallete)', OWOP.cursors.select, OWOP.fx.player.NONE, 1, function (tool) {
            tool.setFxRenderer(function (fx, ctx, time) {
                if (!fx.extra.isLocalPlayer) return 1;
                var r = fx.extra.player.x,
                    i = fx.extra.player.y,
                    a = (Math.floor(r / 16) - OWOP.camera.x) * OWOP.camera.zoom,
                    s = (Math.floor(i / 16) - OWOP.camera.y) * OWOP.camera.zoom;
                let x = fx.extra.player.x;
                let y = fx.extra.player.y;
                let oldlinew = ctx.lineWidth;
                ctx.lineWidth = 1;
                if (tool.extra.end) {
                    let s = tool.extra.start;
                    let e = tool.extra.end;
                    let x = (s[0] - OWOP.camera.x) * OWOP.camera.zoom + 0.5;
                    let y = (s[1] - OWOP.camera.y) * OWOP.camera.zoom + 0.5;
                    let w = e[0] - s[0];
                    let h = e[1] - s[1];
                    ctx.beginPath();
                    ctx.rect(x, y, w * OWOP.camera.zoom, h * OWOP.camera.zoom);
                    ctx.globalAlpha = 0.25;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                    ctx.setLineDash([3, 4]);
                    ctx.strokeStyle = "#000000";
                    ctx.stroke();
                    ctx.globalAlpha = 0.25 + Math.sin(time / 320) / 4;
                    ctx.fillStyle = OWOP.renderer.patterns.unloaded;
                    ctx.fill();
                    ctx.setLineDash([]);
                    let oldfont = ctx.font;
                    ctx.font = "16px sans-serif";
                    let txt;
                    if (col) {
                        txt = (!tool.extra.clicking ? "" : "") + '(' + Math.abs(w) + 'x' + Math.abs(h) + ')';
                    } else {
                        txt = (!tool.extra.clicking ? "Right-Click Inside to start. | Right-Click Anywhere to stop. " : "") + '(' + Math.abs(w) + 'x' + Math.abs(h) + ')';
                    }
                    let txtx = window.innerWidth >> 1;
                    let txty = window.innerHeight >> 1;
                    txtx = Math.max(x, Math.min(txtx, x + w * OWOP.camera.zoom));
                    txty = Math.max(y, Math.min(txty, y + h * OWOP.camera.zoom));
                    OWOP.drawText = (ctx, str, x, y, centered) => {
                        ctx.strokeStyle = "#000000", ctx.fillStyle = "#FFFFFF", ctx.lineWidth = 2.5, ctx.globalAlpha = 1;
                        if (centered) {
                            x -= ctx.measureText(str).width >> 1;
                        }
                        ctx.strokeText(str, x, y);
                        ctx.globalAlpha = 1;
                        ctx.fillText(str, x, y);
                    };
                    OWOP.drawText(ctx, txt, txtx, txty, true);
                    ctx.font = oldfont;
                    ctx.lineWidth = oldlinew;
                    return 0;
                } else {
                    ctx.beginPath(),
                        ctx.moveTo(0, s + .5),
                        ctx.lineTo(window.innerWidth, s + .5),
                        ctx.moveTo(a + .5, 0),
                        ctx.lineTo(a + .5, window.innerHeight),
                        ctx.globalAlpha = 1,
                        ctx.strokeStyle = "#FFFFFF",
                        ctx.stroke(),
                        ctx.setLineDash([3]),
                        ctx.strokeStyle = "#000000",
                        ctx.stroke(),
                        ctx.setLineDash([]),
                        ctx.lineWidth = 1
                    return 1;
                }
            });
            let col = false;
            let cols = [];
            document.addEventListener("keydown", ((e) => {
                if (e.code == "KeyN") {
                    col = !col;
                }
            }))
            tool.extra.start = null;
            tool.extra.end = null;
            tool.extra.clicking = false;
            tool.setEvent('mousedown', function (mouse, event) {
                let s = tool.extra.start;
                let e = tool.extra.end;
                let isInside = function isInside() {
                    return mouse.tileX >= s[0] && mouse.tileX < e[0] && mouse.tileY >= s[1] && mouse.tileY < e[1];
                };
                if (mouse.buttons === 1 && !tool.extra.end) {
                    tool.extra.start = [Math.floor(mouse.tileX / areaa) * areaa, Math.floor(mouse.tileY / areaa) * areaa];
                    tool.extra.clicking = true;
                    tool.setEvent('mousemove', function (mouse, event) {
                        if (tool.extra.start && mouse.buttons === 1) {
                            tool.extra.end = [Math.floor(mouse.tileX / areaa) * areaa, Math.floor(mouse.tileY / areaa) * areaa];
                            return 1;
                        }
                    });
                    let finish = async function finish() {
                        tool.setEvent('mousemove mouseup deselect', null);
                        tool.extra.clicking = false;
                        let s = tool.extra.start;
                        let e = tool.extra.end;
                        if (fillAreaAfterSelected == true) {
                            let color = OWOP.player.selectedColor;
                            tool.extra.start = null;
                            tool.extra.end = null;
                            OWOP.renderer.render(OWOP.renderer.rendertype.FX);
                            if (!col) {
                                await drawFromToUnpix(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], color, cols);
                            } else {
                                cols = palleteToClear(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1]);
                            }
                        }
                        if (e) {
                            if (s[0] === e[0] || s[1] === e[1]) {
                                tool.extra.start = null;
                                tool.extra.end = null;
                            }
                            if (s[0] > e[0]) {
                                let tmp = e[0];
                                e[0] = s[0];
                                s[0] = tmp;
                            }
                            if (s[1] > e[1]) {
                                let tmp = e[1];
                                e[1] = s[1];
                                s[1] = tmp;
                            }
                        }
                        OWOP.renderer.render(OWOP.renderer.rendertype.FX);
                    };
                    tool.setEvent('deselect', finish);
                    tool.setEvent('mouseup', function (mouse, event) {
                        if (!(mouse.buttons & 1)) {
                            finish();
                        }
                    });
                }
                else if (mouse.buttons === 1 && tool.extra.end) {
                    if (isInside()) {
                        let offx = mouse.tileX;
                        let offy = mouse.tileY;
                        tool.setEvent('mousemove', function (mouse, event) {
                            let dx = mouse.tileX - offx;
                            let dy = mouse.tileY - offy;
                            tool.extra.start = [s[0] + dx, s[1] + dy];
                            tool.extra.end = [e[0] + dx, e[1] + dy];
                        });
                        let end = function end() {
                            tool.setEvent('mouseup deselect mousemove', null);
                        };
                        tool.setEvent('deselect', end);
                        tool.setEvent('mouseup', function (mouse, event) {
                            if (!(mouse.buttons & 1)) {
                                end();
                            };
                        });
                    }
                }
                else if (mouse.buttons === 2 && tool.extra.end && isInside()) {
                    let color = OWOP.player.selectedColor;
                    if (!col) {
                        drawFromToUnpix(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], color, cols);
                    } else {
                        cols = palleteToClear(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1]);
                    }
                }
                else {
                    if (event.button == 2) {
                        tool.extra.start = null;
                        tool.extra.end = null;
                    }
                }
            });
        }));
        w(new OWOP.tools.class('Areа Protect', OWOP.cursors.selectprotect, OWOP.fx.player.NONE, 1, function (tool) {
            tool.setFxRenderer(function (fx, ctx, time) {
                if (!fx.extra.isLocalPlayer) return 1;
                var r = fx.extra.player.x,
                    i = fx.extra.player.y,
                    a = (Math.floor(r / 16) - OWOP.camera.x) * OWOP.camera.zoom,
                    s = (Math.floor(i / 16) - OWOP.camera.y) * OWOP.camera.zoom;

                let oldlinew = ctx.lineWidth;
                ctx.lineWidth = 1;
                if (tool.extra.end) {
                    let s = tool.extra.start;
                    let e = tool.extra.end;
                    let x = (s[0] - OWOP.camera.x) * OWOP.camera.zoom + 0.5;
                    let y = (s[1] - OWOP.camera.y) * OWOP.camera.zoom + 0.5;
                    let w = e[0] - s[0];
                    let h = e[1] - s[1];
                    ctx.beginPath();
                    ctx.rect(x, y, w * OWOP.camera.zoom, h * OWOP.camera.zoom);
                    ctx.globalAlpha = 0.25;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke();
                    ctx.setLineDash([3, 4]);
                    ctx.strokeStyle = "#000000";
                    ctx.stroke();
                    ctx.globalAlpha = 0.25 + Math.sin(time / 320) / 4;
                    ctx.fillStyle = OWOP.renderer.patterns.unloaded;
                    ctx.fill();
                    ctx.setLineDash([]);
                    let oldfont = ctx.font;
                    ctx.font = "16px sans-serif";
                    let txt = (!tool.extra.clicking ? "Right-Click Inside to start. | Right-Click Anywhere to stop. " : "") + '(' + Math.abs(w) + 'x' + Math.abs(h) + ')';
                    let txtx = window.innerWidth >> 1;
                    let txty = window.innerHeight >> 1;
                    txtx = Math.max(x, Math.min(txtx, x + w * OWOP.camera.zoom));
                    txty = Math.max(y, Math.min(txty, y + h * OWOP.camera.zoom));
                    OWOP.drawText = (ctx, str, x, y, centered) => {
                        ctx.strokeStyle = "#000000", ctx.fillStyle = "#FFFFFF", ctx.lineWidth = 2.5, ctx.globalAlpha = 1;
                        if (centered) {
                            x -= ctx.measureText(str).width >> 1;
                        }
                        ctx.strokeText(str, x, y);
                        ctx.globalAlpha = 1;
                        ctx.fillText(str, x, y);
                    };
                    OWOP.drawText(ctx, txt, txtx, txty, true);
                    ctx.font = oldfont;
                    ctx.lineWidth = oldlinew;
                    return 0;
                } else {
                    ctx.beginPath(),
                        ctx.moveTo(0, s + .5),
                        ctx.lineTo(window.innerWidth, s + .5),
                        ctx.moveTo(a + .5, 0),
                        ctx.lineTo(a + .5, window.innerHeight),
                        ctx.globalAlpha = 1,
                        ctx.strokeStyle = "#FFFFFF",
                        ctx.stroke(),
                        ctx.setLineDash([3]),
                        ctx.strokeStyle = "#000000",
                        ctx.stroke(),
                        ctx.setLineDash([]),
                        ctx.lineWidth = 1
                    return 1;
                }
            });
            tool.extra.start = null;
            tool.extra.end = null;
            tool.extra.clicking = false;
            tool.setEvent('mousedown', function (mouse, event) {
                let s = tool.extra.start;
                let e = tool.extra.end;
                let isInside = function isInside() {
                    return mouse.tileX >= s[0] && mouse.tileX < e[0] && mouse.tileY >= s[1] && mouse.tileY < e[1];
                };
                if (mouse.buttons === 1 && !tool.extra.end) {
                    tool.extra.start = [Math.floor(mouse.tileX / areaa) * areaa, Math.floor(mouse.tileY / areaa) * areaa];
                    tool.extra.clicking = true;
                    tool.setEvent('mousemove', function (mouse, event) {
                        if (tool.extra.start && mouse.buttons === 1) {
                            tool.extra.end = [Math.floor(mouse.tileX / areaa) * areaa, Math.floor(mouse.tileY / areaa) * areaa];
                            return 1;
                        }
                    });
                    let finish = async function finish() {
                        tool.setEvent('mousemove mouseup deselect', null);
                        tool.extra.clicking = false;
                        let s = tool.extra.start;
                        let e = tool.extra.end;
                        if (fillAreaAfterSelected == true) {
                            let color = OWOP.player.selectedColor;
                            tool.extra.start = null;
                            tool.extra.end = null;
                            OWOP.renderer.render(OWOP.renderer.rendertype.FX);
                            await protectFromTo(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], color)
                        }
                        if (e) {
                            if (s[0] === e[0] || s[1] === e[1]) {
                                tool.extra.start = null;
                                tool.extra.end = null;
                            }
                            if (s[0] > e[0]) {
                                let tmp = e[0];
                                e[0] = s[0];
                                s[0] = tmp;
                            }
                            if (s[1] > e[1]) {
                                let tmp = e[1];
                                e[1] = s[1];
                                s[1] = tmp;
                            }
                        }
                        OWOP.renderer.render(OWOP.renderer.rendertype.FX);
                    };
                    tool.setEvent('deselect', finish);
                    tool.setEvent('mouseup', function (mouse, event) {
                        if (!(mouse.buttons & 1)) {
                            finish();
                        }
                    });
                }
                else if (mouse.buttons === 1 && tool.extra.end) {
                    if (isInside()) {
                        let offx = mouse.tileX;
                        let offy = mouse.tileY;
                        tool.setEvent('mousemove', function (mouse, event) {
                            let dx = mouse.tileX - offx;
                            let dy = mouse.tileY - offy;
                            tool.extra.start = [s[0] + dx, s[1] + dy];
                            tool.extra.end = [e[0] + dx, e[1] + dy];
                        });
                        let end = function end() {
                            tool.setEvent('mouseup deselect mousemove', null);
                        };
                        tool.setEvent('deselect', end);
                        tool.setEvent('mouseup', function (mouse, event) {
                            if (!(mouse.buttons & 1)) {
                                end();
                            };
                        });
                    }
                }
                else if (mouse.buttons === 2 && tool.extra.end && isInside()) {
                    let color = OWOP.player.selectedColor;
                    protectFromTo(tool.extra.start[0], tool.extra.start[1], tool.extra.end[0], tool.extra.end[1], color)
                }
                else {
                    if (event.button == 2) {
                        tool.extra.start = null;
                        tool.extra.end = null;
                    }
                }
            });
        }));
        w(new OWOP.tools.class('Bots Fill test', OWOP.cursors.fill, OWOP.fx.player.NONE, 1, tool => {
            let visited = [];
            let stopp = false;

            async function findColorBoundary(x, y, colorToFind, a) {
                if (stopp) return;
                if (visited[x] && visited[x][y]) {
                    return;
                }

                visited[x] = visited[x] || [];
                visited[x][y] = true;

                let pixelColor = OWOP.world.getPixel(x, y);

                if (eq(pixelColor, colorToFind)) {
                    await findColorBoundary(x + 1, y, colorToFind, a);
                    await findColorBoundary(x, y + 1, colorToFind, a);
                    await findColorBoundary(x - 1, y, colorToFind, a);
                    await findColorBoundary(x, y - 1, colorToFind, a);
                } else {
                    await placePixel(x, y, a);
                }
            }

            tool.setEvent("mousedown", async function (mouse) {
                if (4 & mouse.buttons || 3 & mouse.buttons == 3)
                    return;
                visited = [];
                stopp = false;
                let colorToFind = OWOP.world.getPixel(mouse.tileX, mouse.tileY);
                let a = OWOP.player.selectedColor;
                await findColorBoundary(mouse.tileX, mouse.tileY, colorToFind, a);
            });
            tool.setEvent("mouseup deselect", mouse => {
                stopp = true;
            });
        }));
    }
    async function load2() {
        while (!document.getElementById("ip_info")) await sleep(0);
        const square = document.createElement('div');
        square.style.height = "18px";
        square.style.width = "18px";
        square.style.marginTop = "2px";
        square.style.marginRight = "4px";

        const tooltip = document.createElement('div');
        tooltip.classList.add("tooltip", "copytip", "framed", "whitetext");
        square.appendChild(tooltip);

        const uip = document.createElement("span");
        const box = document.createElement('div');
        box.style.display = 'flex';
        box.appendChild(square);
        box.appendChild(uip);

        let win = document.getElementById("ip_info");
        win.appendChild(box);
        const fetchIpInfo = async () => {
            const response = await fetch("https://ourworldofpixels.com/api/");
            const data = await response.json();
            const ip = data.yourIp;
            const con = data.yourConns;
            const banned = (data.banned !== 0 ? " 🔨" : " ✅") + ", " + con;;
            tooltip.textContent = ip;
            uip.innerText = banned;
            square.style.backgroundColor = genCol(ip);
        };


        let c;
        square.addEventListener('mouseover', () => {
            c = setTimeout(() => {
                tooltip.style.display = 'block';
                setTimeout(() => tooltip.style.opacity = '1', 10);
            }, 500)
        });

        square.addEventListener('mouseout', () => {
            clearTimeout(c);
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.style.display = 'none', 200);
        });

        fetchIpInfo();
        setInterval(fetchIpInfo, 3000);
    }
    async function load3() {
        function savePosition() {
            for (let i in OWOP.windowSys.windows) {
                let win = OWOP.windowSys.windows[i];
                const pos = {
                    x: win.x,
                    y: win.y
                };
                localStorage.setItem(i, JSON.stringify(pos));
            }
        }

        function restorePosition() {
            for (let i in OWOP.windowSys.windows) {
                let win = OWOP.windowSys.windows[i];
                let pos = JSON.parse(localStorage.getItem(i));
                win.move(pos.x, pos.y)
            }

        }
        restorePosition();
        setInterval(() => {
            savePosition();
        }, 1000)
    }
    function load4() {
        let isConnected = false;
        let copyser;

        function connect(id) {
            isConnected = false;
            copyser = new WebSocket("wss://testcopyserver.notbot1.repl.co");

            copyser.addEventListener("open", () => {
                copyser.send(JSON.stringify(["Join", [id, OWOP.world.name, "!"]]));
                setInterval(() => {
                    try {
                        copyser.send("ping")
                    } catch { }
                }, 2500);
            });

            copyser.addEventListener("message", (e) => {
                let data;
                try {
                    data = JSON.parse(e.data);
                } catch (error) {
                    return;
                }

                switch (data[0]) {
                    case "Clients":
                        CopyPlayer = data[1];
                        break;
                    case "Connected":
                        OWOP.chat.local("Connected: " + data[1] + ", " + data[2] + ", " + data[3]);
                        break;
                    case "DevHelp":
                        placePixel(data[1], data[2], data[3]);
                        break;
                    case "msg":
                        let msg = document.createElement("li");
                        msg.innerHTML = data[1];
                        document.querySelector("#chat-messages").append(msg);
                        break;
                }
            });
            copyser.addEventListener("close", async () => {
                await sleep(1000);
                connect();
            });
        }
        OWOP.eventSys.addListener(22, () => {
            copyser.close();
        });
        OWOP.eventSys.addListener(25, (id) => {
            isConnected = true;
            connect(id);
        });
        setInterval(() => {
            try {
                let playerList = document.querySelector("#windows > div:not(.BOJS-BOX, #copy-tools, :nth-child(1)) > .wincontainer").children[0].childNodes;
                for (let i = 1; i < playerList.length; i++) {
                    let elem = playerList[i].childNodes[0];
                    elem.classList.toggle("copyUser", CopyPlayer[0].includes(parseInt(elem.innerText)));
                }
            } catch (error) { }
        }, 1000);
    }
    async function waitForOWOP() {
        while (!window.OWOP) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        load4();
        setTimeout(() => {
            console.log("CopyBot renewed");
            console.log("v 1.4.2 public release");
            console.log("Add true userbot (use you like bot)");
            console.log("I recommend using without neko, opm and other client modifier scripts");
            console.log("For all questions and suggestions Nab#9255");
            console.log("#UnmodCygnus");
            load();
            load2();
            load3();
        }, 5000)
    }

    waitForOWOP();
})();