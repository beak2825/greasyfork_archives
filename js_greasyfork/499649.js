// ==UserScript==
// @name         MooMooJS
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Fixed version of MooMoo.js
// @author       Influxes
// @match        *://*.moomoo.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @connect      moomoo.io
// ==/UserScript==
(() => {
    var e = {
        6791: e => {
            var t;
            t = function(e) {
                var t;
                var r, n, t, M, m;
                m = [];
                M = 0;
                n = 0;
                while (n < e.length) {
                    r = e[n];
                    if (r === "\n") {
                        t = e.substring(M, n);
                        m.push(t);
                        M = n + 1;
                    }
                    n++;
                }
                if (M < e.length) {
                    t = e.substring(M);
                    m.push(t);
                }
                return m;
            };
            e.exports = t;
        },
        2486: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.MooMoo = void 0;
            let n = Function.prototype;
            t.MooMoo = n[69];
            if (!t.MooMoo) {
                const e = r(8156).A;
                const n = r(8044).updateHookPosition;
                const M = r(9137).A;
                t.MooMoo = new e;
                Object.defineProperty(Function.prototype, 69, {
                    get() {
                        return t.MooMoo;
                    }
                });
                let m = Symbol();
                Object.defineProperty(Object.prototype, "x", {
                    set(e) {
                        this[m] = e;
                        n.call(this, e);
                    },
                    get() {
                        return this[m];
                    }
                });
                M();
            }
        },
        8156: (e, t, r) => {
            "use strict";
            var n;
            n = {
                value: true
            };
            const M = r(5258);
            const m = r(4902);
            const p = r(2609);
            const y = r(2555);
            const h = r(227);
            const b = r(2093);
            const P = r(5106);
            const v = r(6832);
            const k = r(3407);
            const _ = r(6475);
            const j = r(4560);
            const x = r(2550);
            class Game extends M.default {
                constructor() {
                    super();
                    this.teams = [];
                    this.myPlayer = {};
                    this.statistics = {};
                    this.DidInit = false;
                    this.GamePlayerManager = new p.default;
                    this.ActivePlayerManager = new p.default;
                    this.LeaderboardManager = new y.default;
                    this.GameObjectManager = new h.default;
                    this.CommandManager = new b.default;
                    this.PacketManager = new P.default;
                    this.PacketInterceptor = new x.default;
                    this.BotManager = v.default.instance;
                    this.UTILS = new j.default;
                    this.vars = {};
                    this.msgpack = {};
                    this.msgpack.decode = k.default;
                    this.msgpack.encode = _.default;
                    this.vars.gameLoaded = false;
                }
                debug(e) {
                    this.emit("debug", e);
                }
            }
            t.A = Game;
            (0, m.default)();
        },
        2555: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(9703);
            const M = r(2486);
            const m = r(8233);
            class Leaderboardmanager {
                constructor() {
                    this.leaderboard = new Map;
                }
                updateLeaderboard(e) {
                    let t = (0, n.default)(e, 3);
                    let r = e.length / 3;
                    t.forEach(((e, t) => {
                        let r = M.MooMoo.GamePlayerManager.getPlayerBySid(e[0]);
                        if (!r) {
                            r = new m.default(e[0]);
                            r.sid = e[0];
                            r.name = e[1];
                            M.MooMoo.GamePlayerManager.addPlayer(r);
                        }
                        this.leaderboard.set(t + 1, {
                            player: r,
                            sid: e[0],
                            name: e[1],
                            score: e[2]
                        });
                    }));
                }
                clearLeaderboard() {
                    this.leaderboard = new Map;
                }
            }
            t["default"] = Leaderboardmanager;
        },
        227: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(1917);
            class ObjectManager {
                constructor() {
                    this.objects = new Map;
                }
                addObject(e) {
                    let t = n.MooMoo.GameObjectManager.getGameObjectBySid(e.sid);
                    if (!t) {
                        t = new M.default(e.sid);
                    }
                    t.x = e.x;
                    t.y = e.y;
                    t.ownerSid = e.ownerSid;
                    t.type = e.type;
                    t.sid = e.sid;
                    this.objects.set(e.sid, t);
                }
                getGameObjectBySid(e) {
                    return this.objects.get(e);
                }
                getObjectsByOwnerSid(e) {
                    let t = [];
                    this.objects.forEach((r => {
                        if (r.ownerSid == e) {
                            t.push(r);
                        }
                    }));
                    return t;
                }
                removeObjectBySid(e) {
                    this.objects.delete(e);
                }
                removeObjectsByOwnerSid(e) {
                    this.objects.forEach((t => {
                        if (t.ownerSid == e) {
                            this.objects.delete(t.sid);
                        }
                    }));
                }
            }
            t["default"] = ObjectManager;
        },
        2550: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(4902);
            class PacketInterceptor {
                constructor() {
                    this.clientCallbacks = new Map;
                    this.serverCallbacks = new Map;
                    this.lastCallbackId = 0;
                }
                addCallback(e, t) {
                    let r;
                    if (e === "client") {
                        r = this.clientCallbacks;
                    } else if (e === "server") {
                        r = this.serverCallbacks;
                    }
                    const n = this.lastCallbackId++;
                    r.set(n, t);
                    return n;
                }
                removeCallback(e) {
                    this.clientCallbacks.delete(e);
                    this.serverCallbacks.delete(e);
                }
                applyClientCallbacks(e) {
                    if (!this.clientCallbacks.size) return e;
                    for (const [t, r] of this.clientCallbacks) {
                        e = r(e) || e;
                    }
                    return e;
                }
                applyServerCallbacks(e) {
                    if (!this.serverCallbacks.size) return e;
                    for (const [t, r] of this.serverCallbacks) {
                        e = r(e);
                    }
                    return e;
                }
                getOriginalServerCallback() {
                    return n.onmessagecallback;
                }
            }
            t["default"] = PacketInterceptor;
        },
        5106: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(5258);
            class PacketManager extends n.default {
                constructor() {
                    super();
                    this._packetCountPerMinute = 0;
                    this._packetCountPerSecond = 0;
                    this._packetTime = 60;
                    this._packetLimitPerMinute = 5400;
                    this._packetLimitPerSecond = 120;
                }
                initialize() {
                    this._startTimerPerMinute();
                    this._startTimerPerSecond();
                }
                addPacket() {
                    this._packetCountPerSecond++;
                    this._packetCountPerMinute++;
                    const e = this.getKickPercentagePerMinute();
                    const t = this.getKickPercentagePerSecond();
                    if (e >= 100) {
                        this.emit("Kick", this);
                    }
                    if (t >= 100) {
                        this.emit("Kick", this);
                    }
                    this.emit("update", this);
                }
                getKickPercentagePerMinute() {
                    return this._packetCountPerMinute / this._packetLimitPerMinute * 100;
                }
                getKickPercentagePerSecond() {
                    return this._packetCountPerSecond / this._packetLimitPerSecond * 100;
                }
                getPacketCountPerMinute() {
                    return this._packetCountPerMinute;
                }
                getPacketCountPerSecond() {
                    return this._packetCountPerSecond;
                }
                getPacketTime() {
                    return this._packetTime;
                }
                _startTimerPerMinute() {
                    this._intervalIdPerMinute = setInterval((() => {
                        this._resetPacketCountPerMinute();
                    }), 6e4);
                }
                _startTimerPerSecond() {
                    this._intervalIdPerSecond = setInterval((() => {
                        if (this._packetCountPerSecond > this._packetLimitPerSecond) {
                            this.emit("Kick", this.getKickPercentagePerSecond());
                        }
                        this._resetPacketCountPerSecond();
                    }), 1e3);
                }
                _resetPacketCountPerMinute() {
                    this._packetCountPerMinute = 0;
                    this._packetTime = 60;
                }
                _resetPacketCountPerSecond() {
                    this._packetCountPerSecond = 0;
                }
            }
            t["default"] = PacketManager;
        },
        2609: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            class PlayerManager {
                constructor() {
                    this.players = [];
                }
                addPlayer(e) {
                    this.players.push(e);
                }
                removePlayer(e) {
                    this.players.splice(this.players.indexOf(e), 1);
                }
                removePlayerBySid(e) {
                    this.players.splice(this.players.findIndex((t => t.sid === e)), 1);
                }
                removePlayerById(e) {
                    this.players.splice(this.players.findIndex((t => t.id === e)), 1);
                }
                getPlayerBySid(e) {
                    return this.players.find((t => t.sid === e));
                }
                getPlayerById(e) {
                    return this.players.find((t => t.id === e));
                }
                getPlayerByName(e) {
                    let t = this.players.filter((t => t.name === e));
                    if (t.length > 1) {
                        return t;
                    } else return t[0];
                }
                clearPlayers() {
                    this.players = [];
                }
                updatePlayer(e, t) {
                    let r = this.getPlayerBySid(e);
                    if (r) {
                        Object.assign(r, t);
                    }
                }
                getEnemies() {
                    return this.players.filter((e => {
                        if (e.id !== n.MooMoo.myPlayer.id) {
                            if (e.team === null) {
                                return true;
                            }
                            if (e.team !== n.MooMoo.myPlayer.team) {
                                return true;
                            }
                        }
                    }));
                }
                getTeammates() {
                    return this.players.filter((e => {
                        if (e.id !== n.MooMoo.myPlayer.id) {
                            if (e.team === n.MooMoo.myPlayer.team) {
                                return true;
                            }
                        }
                    }));
                }
                getClosestEnemy() {
                    let e = this.getEnemies();
                    let t = e[0];
                    if (!e) return null;
                    e.forEach((e => {
                        if (n.MooMoo.UTILS.getDistanceBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, e.x, e.y) < n.MooMoo.UTILS.getDistanceBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, t.x, t.y)) {
                            t = e;
                        }
                    }));
                    return t;
                }
                getClosestTeammate() {
                    let e = this.getTeammates();
                    let t = e[0];
                    if (!e) return null;
                    e.forEach((e => {
                        if (n.MooMoo.UTILS.getDistanceBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, e.x, e.y) < n.MooMoo.UTILS.getDistanceBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, t.x, t.y)) {
                            t = e;
                        }
                    }));
                    return t;
                }
                getClosestPlayer() {
                    let e = this.players[0];
                    if (!this.players) return null;
                    this.players.forEach((t => {
                        if (n.MooMoo.UTILS.getDistanceBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, t.x, t.y) < n.MooMoo.UTILS.getDistanceBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, e.x, e.y)) {
                            e = t;
                        }
                    }));
                    return e;
                }
                getClosestEnemyToPlayer(e) {
                    let t = this.getEnemies();
                    let r = t[0];
                    if (!t) return null;
                    t.forEach((t => {
                        if (n.MooMoo.UTILS.getDistanceBetweenTwoPoints(e.x, e.y, t.x, t.y) < n.MooMoo.UTILS.getDistanceBetweenTwoPoints(e.x, e.y, r.x, r.y)) {
                            r = t;
                        }
                    }));
                    return r;
                }
                getClosestEnemyAngle() {
                    let e = this.getClosestEnemy();
                    if (!e) return null;
                    return n.MooMoo.UTILS.getAngleBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, e.x, e.y);
                }
                getClosestEnemyDistance() {
                    let e = this.getClosestEnemy();
                    if (!e) return null;
                    return n.MooMoo.UTILS.getDistanceBetweenTwoPoints(n.MooMoo.myPlayer.x, n.MooMoo.myPlayer.y, e.x, e.y);
                }
            }
            t["default"] = PlayerManager;
        },
        4560: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            class UTILS {
                static getDistanceBetweenTwoPoints(e, t, r, n) {
                    return Math.sqrt(Math.pow(r - e, 2) + Math.pow(n - t, 2));
                }
                static getAngleBetweenTwoPoints(e, t, r, n) {
                    return Math.atan2(n - t, r - e);
                }
                static atan2(e, t, r, n) {
                    return Math.atan2(n - t, r - e);
                }
                constructor() {
                    this.getDistanceBetweenTwoPoints = UTILS.getDistanceBetweenTwoPoints;
                    this.dist = UTILS.getDistanceBetweenTwoPoints;
                    this.distance = UTILS.getDistanceBetweenTwoPoints;
                    this.atan2 = UTILS.atan2;
                    this.angle = UTILS.atan2;
                    this.getAngleBetweenTwoPoints = UTILS.getAngleBetweenTwoPoints;
                }
            }
            t["default"] = UTILS;
        },
        2093: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(1091);
            class CommandManager {
                constructor() {
                    this.commands = {};
                    this.prefix = "/";
                }
                setPrefix(e) {
                    this.prefix = e;
                }
                registerCommand(e, t) {
                    let r = new n.default(e, t);
                    this.commands[e] = r;
                }
                unregisterCommand(e) {
                    delete this.commands[e];
                }
            }
            t["default"] = CommandManager;
        },
        5258: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            class EventEmitter {
                constructor() {
                    this._listeners = {};
                }
                on(e, t) {
                    if (!this._listeners[e]) {
                        this._listeners[e] = [];
                    }
                    this._listeners[e].push(t);
                }
                once(e, t) {
                    this.on(e, (function g(...r) {
                        this.off(e, g);
                        t(...r);
                    }));
                }
                emit(e, ...t) {
                    if (this._listeners[e]) {
                        this._listeners[e].forEach((e => e(...t)));
                    }
                }
                addEventListener(e, t) {
                    this.on(e, t);
                }
            }
            t["default"] = EventEmitter;
        },
        8730: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function cacheItems() {
                n.MooMoo.myPlayer.inventory = {};
                const e = [ {
                    category: "primary",
                    start: 0,
                    end: 9
                }, {
                    category: "secondary",
                    start: 9,
                    end: 16
                }, {
                    category: "food",
                    start: 16,
                    end: 19,
                    subtract: true
                }, {
                    category: "wall",
                    start: 19,
                    end: 22,
                    subtract: true
                }, {
                    category: "spike",
                    start: 22,
                    end: 26,
                    subtract: true
                }, {
                    category: "mill",
                    start: 26,
                    end: 29,
                    subtract: true
                }, {
                    category: "mine",
                    start: 29,
                    end: 31,
                    subtract: true
                }, {
                    category: "boostPad",
                    start: 31,
                    end: 33,
                    subtract: true
                }, {
                    category: "trap",
                    start: 31,
                    end: 33,
                    subtract: true
                }, {
                    category: "turret",
                    start: 33,
                    end: 39,
                    subtract: true
                }, {
                    category: "spawnPad",
                    start: 36,
                    end: 37,
                    subtract: true
                } ];
                for (let t = 0; t < e.length; t++) {
                    const {category: r, start: M, end: m, subtract: p} = e[t];
                    for (let e = M; e < m; e++) {
                        const t = document.getElementById(`actionBarItem${e}`);
                        if (t && t.offsetParent !== null) {
                            n.MooMoo.myPlayer.inventory[r] = p ? e - 16 : e;
                            break;
                        }
                    }
                }
            }
            t["default"] = cacheItems;
        },
        9703: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            function chunk(e, t) {
                let r = [];
                for (let n = 0; n < e.length; n += t) {
                    r.push(e.slice(n, n + t));
                }
                return r;
            }
            t["default"] = chunk;
        },
        9371: function(e, t, r) {
            "use strict";
            var n = this && this.__awaiter || function(e, t, r, n) {
                function adopt(e) {
                    return e instanceof r ? e : new r((function(t) {
                        t(e);
                    }));
                }
                return new (r || (r = Promise))((function(r, M) {
                    function fulfilled(e) {
                        try {
                            step(n.next(e));
                        } catch (e) {
                            M(e);
                        }
                    }
                    function rejected(e) {
                        try {
                            step(n["throw"](e));
                        } catch (e) {
                            M(e);
                        }
                    }
                    function step(e) {
                        e.done ? r(e.value) : adopt(e.value).then(fulfilled, rejected);
                    }
                    step((n = n.apply(e, t || [])).next());
                }));
            };
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const M = r(5258);
            const m = r(3694);
            const p = r(8329);
            const y = r(2486);
            class Bot extends M.default {
                constructor(e = false, t) {
                    super();
                    this.connected = false;
                    if (!e) {
                        this.name = "Bot";
                        this.skin = 0;
                        this.moofoll = false;
                    } else {
                        this.name = t.name;
                        this.skin = t.skin;
                        this.moofoll = t.moofoll;
                    }
                    this.gameID = null;
                }
                generateToken() {
                    return n(this, void 0, void 0, (function*() {
                        const e = true;
                        try {
                            if (e) {
                                const e = yield new Promise(((e, t) => {
                                    window.turnstile.render(".cf-turnstile", {
                                        sitekey: "0x4AAAAAAAMYHI96GFiJzMmp",
                                        callback: function(t) {
                                            e(t);
                                        },
                                        errorCallback: function(e) {
                                            t(e);
                                        }
                                    });
                                }));
                                return e;
                            } else {
                                const e = yield window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
                                    action: "homepage"
                                });
                                const t = "re:" + e;
                                return t;
                            }
                        } catch (e) {
                            throw e;
                        }
                    }));
                }
                join(e) {
                    return n(this, void 0, void 0, (function*() {
                        switch (typeof e) {
                          case "string":
                            {
                                let {region: t, index: r} = m.default.parseServer(e);
                                let n = new p.default(t, r);
                                this.recaptchaToken = yield this.generateToken();
                                n.joinServer(this);
                                break;
                            }

                          case "object":
                            {
                                if (Array.isArray(e)) {
                                    let [t, r] = e;
                                    let n = new p.default(t, r);
                                    this.recaptchaToken = yield this.generateToken();
                                    n.joinServer(this);
                                } else {
                                    let {region: t, index: r} = e;
                                    let n = new p.default(t, r);
                                    this.recaptchaToken = yield this.generateToken();
                                    n.joinServer(this);
                                }
                                break;
                            }
                        }
                    }));
                }
                spawn() {
                    this.ws.send(y.MooMoo.msgpack.encode([ "M", [ {
                        name: this.name,
                        skin: this.skin,
                        moofoll: this.moofoll
                    } ] ]));
                }
                onConnect(e) {
                    this.emit("connected", e);
                    this.connected = true;
                }
                sendChat(e) {
                    this.ws.send(y.MooMoo.msgpack.encode([ "6", [ e ] ]));
                }
                move(e) {
                    this.ws.send(y.MooMoo.msgpack.encode([ "a", [ e ] ]));
                }
                sendPacket(e) {
                    let t = Array.prototype.slice.call(arguments, 1);
                    if (this.ws.readyState !== 2 && this.ws.readyState !== 3) {
                        this.ws.send(y.MooMoo.msgpack.encode([ e, t ]));
                    }
                }
            }
            t["default"] = Bot;
        },
        6832: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(9371);
            class BotManager {
                constructor() {
                    this._bots = new Map;
                    this._botIdCounter = 0;
                    this.Bot = n.default;
                }
                static get instance() {
                    if (!BotManager._instance) {
                        BotManager._instance = new BotManager;
                    }
                    return BotManager._instance;
                }
                addBot(e) {
                    const t = this._botIdCounter++;
                    e.id = t;
                    this._bots.set(t, e);
                    return t;
                }
                removeBot(e) {
                    this._bots.delete(e);
                    this._botIdCounter -= 1;
                }
                getBot(e) {
                    return this._bots.get(e);
                }
            }
            t["default"] = BotManager;
        },
        8329: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(9703);
            class Server {
                constructor(e, t) {
                    this._region = e;
                    this._index = t;
                    this.parseServerData();
                }
                get region() {
                    return this._region;
                }
                set region(e) {
                    this._region = e;
                }
                get index() {
                    return this._index;
                }
                set index(e) {
                    this._index = e;
                }
                parseServerData() {
                    this.ip = window.io.socket.url.split("://")[1].split(".moomoo.io")[0];
                }
                getWebSocketUrl(e) {
                    return "wss://" + this.ip + ".moomoo.io/?token=" + encodeURIComponent(e);
                }
                joinServer(e) {
                    let t = this.getWebSocketUrl(e.recaptchaToken);
                    const r = new WebSocket(t);
                    r.binaryType = "arraybuffer";
                    r.onopen = () => {
                        e.ws = r;
                    };
                    r.addEventListener("message", (t => {
                        let r = new Uint8Array(t.data);
                        let m = n.MooMoo.msgpack.decode(r);
                        let [p, [...y]] = m;
                        e.emit("packet", {
                            packet: p,
                            data: y
                        });
                        if (p == "io-init") {
                            e.onConnect(this);
                        }
                        if (p == "C") {
                            if (!e.gameID) {
                                e.gameID = y[0];
                            }
                        }
                        if (p == "a") {
                            let t = (0, M.default)(y[0], 13);
                            t.forEach((t => {
                                if (t[0] == e.gameID) {
                                    e.x = t[1];
                                    e.y = t[2];
                                }
                            }));
                        }
                    }));
                }
            }
            t["default"] = Server;
        },
        3694: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(8329);
            const M = r(2486);
            class ServerManager {
                constructor() {
                    this.index = 0;
                    this.region = 0;
                    this.name = "";
                    this.ip = "";
                    this.players = 0;
                    this.wsurl = "";
                }
                static get instance() {
                    if (!ServerManager._instance) {
                        ServerManager._instance = new ServerManager;
                    }
                    return ServerManager._instance;
                }
                static startInterval() {
                    setInterval((() => {
                        let e = M.MooMoo.ServerManager;
                        if (!e) {
                            M.MooMoo.ServerManager = ServerManager.instance;
                        }
                        e = M.MooMoo.ServerManager;
                        if (e) {
                            M.MooMoo.ServerManager.initalize();
                        }
                    }), 200);
                }
                initalize() {
                    this.calculateServer();
                }
                getCurrentServer() {
                    let e = new n.default(this.region, this.index);
                    return e;
                }
                calculateServer() {
                    let e = this.extractRegionAndIndex();
                    if (e.region && e.index) {
                        this.region = e.region;
                        this.index = e.index;
                    }
                }
                extractRegionAndIndex() {
                    const e = window.location.href.match(/server=(\d+):(\d+)/);
                    if (e) {
                        const t = parseInt(e[1], 10);
                        const r = parseInt(e[2], 10);
                        return {
                            region: t,
                            index: r
                        };
                    }
                    return {
                        region: null,
                        index: null
                    };
                }
                static parseServer(e) {
                    let t = e.split(":");
                    let r = parseInt(t[0], 10);
                    let n = parseInt(t[1], 10);
                    return {
                        region: r,
                        index: n
                    };
                }
            }
            t["default"] = ServerManager;
        },
        1618: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(8188);
            function buyAccessoryById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 1, e, 1);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at buyAccessoryById: Accessory with id " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function buyAccessoryByName(e) {
                let t = false;
                M.default.find((r => {
                    if (r.name == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 1, r.id, 1);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at buyAccessoryByName: Accessory with name " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function buyAccessory(e) {
                if (typeof e == "number") {
                    buyAccessoryById(e);
                } else if (typeof e == "string") {
                    buyAccessoryByName(e);
                } else {
                    try {
                        throw new Error("Error at buyAccessory: accessoryData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            t["default"] = buyAccessory;
        },
        1901: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(6570);
            function buyHatById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 1, e, 0);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at buyHatById: Hat with id " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function buyHatByName(e) {
                let t = false;
                M.default.find((r => {
                    if (r.name == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 1, r.id, 0);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at buyHatByName: Hat with name " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function buyHat(e) {
                if (typeof e == "number") {
                    buyHatById(e);
                } else if (typeof e == "string") {
                    buyHatByName(e);
                } else {
                    try {
                        throw new Error("Error at buyHat: hatData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            t["default"] = buyHat;
        },
        2938: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function chat(e) {
                n.MooMoo.sendPacket("6", e);
            }
            t["default"] = chat;
        },
        5610: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(8188);
            function equipAccessoryById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 0, e, 1);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at equipAccessoryById: Accessory with id " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipAccessoryByName(e) {
                let t = false;
                M.default.find((r => {
                    if (r.name == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 0, r.id, 1);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at equipAccessoryByName: Accessory with name " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipAccessory(e) {
                if (typeof e == "number") {
                    equipAccessoryById(e);
                } else if (typeof e == "string") {
                    equipAccessoryByName(e);
                } else {
                    try {
                        throw new Error("Error at equipAccessory: accessoryData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            t["default"] = equipAccessory;
        },
        2533: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(6570);
            function equipHatById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 0, e, 0);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at equipHatById: Hat with id " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipHatByName(e) {
                let t = false;
                M.default.find((r => {
                    if (r.name == e) {
                        t = true;
                        n.MooMoo.sendPacket("c", 0, r.id, 0);
                    }
                }));
                if (!t) {
                    try {
                        throw new Error("Error at equipHatByName: Hat with name " + e + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipHat(e) {
                if (typeof e == "number") {
                    equipHatById(e);
                } else if (typeof e == "string") {
                    equipHatByName(e);
                } else {
                    try {
                        throw new Error("Error at equipHat: hatData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            t["default"] = equipHat;
        },
        2987: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function hit(e = null) {
                n.MooMoo.sendPacket("d", 1, e);
                n.MooMoo.sendPacket("d", 0, e);
            }
            t["default"] = hit;
        },
        9149: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function move(e) {
                n.MooMoo.sendPacket("a", e);
            }
            t["default"] = move;
        },
        3413: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function place(e, t) {
                let r = n.MooMoo.myPlayer.weaponIndex;
                n.MooMoo.sendPacket("G", e, false);
                n.MooMoo.sendPacket("d", 1, t);
                n.MooMoo.sendPacket("d", 0, t);
                n.MooMoo.sendPacket("G", r, true);
            }
            t["default"] = place;
        },
        177: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function unequipAccessory() {
                n.MooMoo.sendPacket("c", 0, 0, 1);
            }
            t["default"] = unequipAccessory;
        },
        9682: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function unequipHat() {
                n.MooMoo.sendPacket("c", 0, 0, 0);
            }
            t["default"] = unequipHat;
        },
        4918: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const r = {
                hit: {
                    exec: () => console.log("Hit!")
                },
                wait: {
                    exec: e => new Promise((t => setTimeout(t, parseInt(e[0], 10))))
                },
                chat: {
                    exec: e => console.log(e.join(" "))
                },
                enddef: {
                    exec: () => {}
                }
            };
            t["default"] = r;
        },
        5800: (e, t, r) => {
            "use strict";
            var n;
            n = {
                value: true
            };
            const M = r(4918);
            function execute(e) {
                const t = {};
                for (const r of e) {
                    const fn = () => {
                        for (const e of r.body) {
                            M.default[e.command].exec(e.args);
                        }
                    };
                    t[r.name] = {
                        call: fn
                    };
                }
                return {
                    get: function get(e) {
                        return t[e];
                    }
                };
            }
            t.A = execute;
        },
        2762: (e, t) => {
            "use strict";
            var r;
            r = {
                value: true
            };
            function parse(e) {
                const t = [];
                let r = null;
                for (const n of e) {
                    if (n.endsWith("<<<")) {
                        r = {
                            type: "function",
                            name: n.replace(/[ <]/g, ""),
                            body: []
                        };
                    } else if (n.includes(">>>")) {
                        if (!r) {
                            const e = {
                                type: "ParseError",
                                message: "Unexpected token >>>. No function found."
                            };
                            return e;
                        }
                        r.body.push({
                            type: "command",
                            command: "enddef",
                            args: []
                        });
                        t.push(r);
                        r = null;
                    } else if (r) {
                        const e = n.split(" ");
                        let t;
                        let M;
                        for (let r = 0; r < e.length; r++) {
                            let n = e[r];
                            if (n !== "") {
                                t = n;
                                M = e.slice(r + 1);
                                if (t == "chat") {
                                    M = [ M.join(" ") ];
                                }
                                break;
                            }
                        }
                        r.body.push({
                            type: "command",
                            command: t,
                            args: M
                        });
                    }
                }
                if (r) {
                    const e = {
                        type: "ParseError",
                        message: "Unexpected end of input. Function definition not closed."
                    };
                    return e;
                }
                return t;
            }
            t.A = parse;
        },
        1477: (e, t, r) => {
            "use strict";
            var n;
            n = {
                value: true
            };
            const M = r(4918);
            class InvalidNodeTypeError extends Error {}
            class InvalidCommandError extends Error {}
            function validate(e) {
                for (const t of e) {
                    if (t.type !== "function") {
                        throw new InvalidNodeTypeError(`Unexpected node type: ${t.type}`);
                    }
                    for (const e of t.body) {
                        if (e.type !== "command") {
                            throw new InvalidNodeTypeError(`Unexpected node type: ${e.type}`);
                        }
                        if (!M.default.hasOwnProperty(e.command)) {
                            throw new InvalidCommandError(`Invalid command: ${e.command}`);
                        }
                    }
                }
            }
            t.A = validate;
        },
        6649: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            class Alliance {
                constructor(e, t) {
                    this.Leader = e;
                    this.Name = t;
                }
                setAliancePlayers(e) {
                    this.Members = e;
                }
            }
            t["default"] = Alliance;
        },
        1091: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            class Command {
                constructor(e, t) {
                    this.name = e;
                    this.run = t;
                }
                reply(e) {
                    n.MooMoo.myPlayer.chat(e);
                }
            }
            t["default"] = Command;
        },
        1917: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            class GameObject {
                constructor(e) {
                    this.sid = e;
                }
            }
            t["default"] = GameObject;
        },
        8233: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            class Player {
                constructor(e) {
                    this.sid = e;
                    this.resources = {
                        wood: 0,
                        stone: 0,
                        food: 0,
                        points: 0,
                        kills: 0
                    };
                    this.markerX = 0;
                    this.markerY = 0;
                    this.pingX = 0;
                    this.pingY = 0;
                }
            }
            t["default"] = Player;
        },
        9137: (e, t, r) => {
            "use strict";
            var n;
            n = {
                value: true
            };
            const M = r(2486);
            var m = 0;
            var p = Date.now();
            var y = Date.now();
            function initRendering() {
                M.MooMoo.vars.camX = 0;
                M.MooMoo.vars.camY = 0;
                M.MooMoo.vars.offsetX = 0;
                M.MooMoo.vars.offsetY = 0;
                M.MooMoo.vars.maxScreenWidth = 1920;
                M.MooMoo.vars.maxScreenHeight = 1080;
                M.MooMoo.vars.canvas = null;
                M.MooMoo.vars.ctx = null;
                M.MooMoo.addEventListener("gameLoad", (function() {
                    M.MooMoo.vars.canvas = document.getElementsByTagName("canvas")[1];
                    M.MooMoo.vars.ctx = M.MooMoo.vars.canvas.getContext("2d");
                    M.MooMoo.emit("renderingInit", {
                        canvas: M.MooMoo.vars.canvas,
                        ctx: M.MooMoo.vars.ctx
                    });
                }));
                function doUpdate() {
                    p = Date.now();
                    m = p - y;
                    y = p;
                    requestAnimationFrame(doUpdate);
                }
                doUpdate();
                Object.defineProperty(Object.prototype, "y", {
                    get: function() {
                        return this._y;
                    },
                    set: function(e) {
                        if (M.MooMoo.myPlayer && this.id == M.MooMoo.myPlayer.id) {
                            M.MooMoo.vars.playerx = this.x;
                            M.MooMoo.vars.playery = this.y;
                            M.MooMoo.vars.offsetX = M.MooMoo.vars.camX - M.MooMoo.vars.maxScreenWidth / 2;
                            M.MooMoo.vars.offsetY = M.MooMoo.vars.camY - M.MooMoo.vars.maxScreenHeight / 2;
                            M.MooMoo.emit("updateOffsets", M.MooMoo.vars.offsetX, M.MooMoo.vars.offsetY);
                        }
                        this._y = e;
                    }
                });
                function tick() {
                    if (M.MooMoo.myPlayer) {
                        let e = {
                            x: M.MooMoo.vars.playerx,
                            y: M.MooMoo.vars.playery
                        };
                        let t = Math.sqrt(Math.pow(e.x - M.MooMoo.vars.camX, 2) + Math.pow(e.y - M.MooMoo.vars.camY, 2));
                        let r = Math.atan2(e.y - M.MooMoo.vars.camY, e.x - M.MooMoo.vars.camX);
                        let n = Math.min(t * .01 * m, t);
                        if (t > .05) {
                            M.MooMoo.vars.camX += Math.cos(r) * n;
                            M.MooMoo.vars.camY += Math.sin(r) * n;
                        } else {
                            M.MooMoo.vars.camX = e.x;
                            M.MooMoo.vars.camY = e.y;
                        }
                    }
                }
                CanvasRenderingContext2D.prototype.clearRect = new Proxy(CanvasRenderingContext2D.prototype.clearRect, {
                    apply: function(e, t, r) {
                        e.apply(t, r);
                        tick();
                        M.MooMoo.emit("renderTick", M.MooMoo.vars.offsetX, M.MooMoo.vars.offsetY);
                    }
                });
            }
            t.A = initRendering;
        },
        8188: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            let r = [ {
                id: 12,
                name: "Snowball",
                price: 1e3,
                scale: 105,
                xOff: 18,
                desc: "no effect"
            }, {
                id: 9,
                name: "Tree Cape",
                price: 1e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 10,
                name: "Stone Cape",
                price: 1e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 3,
                name: "Cookie Cape",
                price: 1500,
                scale: 90,
                desc: "no effect"
            }, {
                id: 8,
                name: "Cow Cape",
                price: 2e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 11,
                name: "Monkey Tail",
                price: 2e3,
                scale: 97,
                xOff: 25,
                desc: "Super speed but reduced damage",
                spdMult: 1.35,
                dmgMultO: .2
            }, {
                id: 17,
                name: "Apple Basket",
                price: 3e3,
                scale: 80,
                xOff: 12,
                desc: "slowly regenerates health over time",
                healthRegen: 1
            }, {
                id: 6,
                name: "Winter Cape",
                price: 3e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 4,
                name: "Skull Cape",
                price: 4e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 5,
                name: "Dash Cape",
                price: 5e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 2,
                name: "Dragon Cape",
                price: 6e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 1,
                name: "Super Cape",
                price: 8e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 7,
                name: "Troll Cape",
                price: 8e3,
                scale: 90,
                desc: "no effect"
            }, {
                id: 14,
                name: "Thorns",
                price: 1e4,
                scale: 115,
                xOff: 20,
                desc: "no effect"
            }, {
                id: 15,
                name: "Blockades",
                price: 1e4,
                scale: 95,
                xOff: 15,
                desc: "no effect"
            }, {
                id: 20,
                name: "Devils Tail",
                price: 1e4,
                scale: 95,
                xOff: 20,
                desc: "no effect"
            }, {
                id: 16,
                name: "Sawblade",
                price: 12e3,
                scale: 90,
                spin: true,
                xOff: 0,
                desc: "deal damage to players that damage you",
                dmg: .15
            }, {
                id: 13,
                name: "Angel Wings",
                price: 15e3,
                scale: 138,
                xOff: 22,
                desc: "slowly regenerates health over time",
                healthRegen: 3
            }, {
                id: 19,
                name: "Shadow Wings",
                price: 15e3,
                scale: 138,
                xOff: 22,
                desc: "increased movement speed",
                spdMult: 1.1
            }, {
                id: 18,
                name: "Blood Wings",
                price: 2e4,
                scale: 178,
                xOff: 26,
                desc: "restores health when you deal damage",
                healD: .2
            }, {
                id: 21,
                name: "Corrupt X Wings",
                price: 2e4,
                scale: 178,
                xOff: 26,
                desc: "deal damage to players that damage you",
                dmg: .25
            } ];
            t["default"] = r;
        },
        6570: (e, t) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            let r = [ {
                id: 45,
                name: "Shame!",
                dontSell: true,
                price: 0,
                scale: 120,
                desc: "hacks are for losers"
            }, {
                id: 51,
                name: "Moo Cap",
                price: 0,
                scale: 120,
                desc: "coolest mooer around"
            }, {
                id: 50,
                name: "Apple Cap",
                price: 0,
                scale: 120,
                desc: "apple farms remembers"
            }, {
                id: 28,
                name: "Moo Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 29,
                name: "Pig Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 30,
                name: "Fluff Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 36,
                name: "Pandou Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 37,
                name: "Bear Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 38,
                name: "Monkey Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 44,
                name: "Polar Head",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 35,
                name: "Fez Hat",
                price: 0,
                scale: 120,
                desc: "no effect"
            }, {
                id: 42,
                name: "Enigma Hat",
                price: 0,
                scale: 120,
                desc: "join the enigma army"
            }, {
                id: 43,
                name: "Blitz Hat",
                price: 0,
                scale: 120,
                desc: "hey everybody i'm blitz"
            }, {
                id: 49,
                name: "Bob XIII Hat",
                price: 0,
                scale: 120,
                desc: "like and subscribe"
            }, {
                id: 57,
                name: "Pumpkin",
                price: 50,
                scale: 120,
                desc: "Spooooky"
            }, {
                id: 8,
                name: "Bummle Hat",
                price: 100,
                scale: 120,
                desc: "no effect"
            }, {
                id: 2,
                name: "Straw Hat",
                price: 500,
                scale: 120,
                desc: "no effect"
            }, {
                id: 15,
                name: "Winter Cap",
                price: 600,
                scale: 120,
                desc: "allows you to move at normal speed in snow",
                coldM: 1
            }, {
                id: 5,
                name: "Cowboy Hat",
                price: 1e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 4,
                name: "Ranger Hat",
                price: 2e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 18,
                name: "Explorer Hat",
                price: 2e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 31,
                name: "Flipper Hat",
                price: 2500,
                scale: 120,
                desc: "have more control while in water",
                watrImm: true
            }, {
                id: 1,
                name: "Marksman Cap",
                price: 3e3,
                scale: 120,
                desc: "increases arrow speed and range",
                aMlt: 1.3
            }, {
                id: 10,
                name: "Bush Gear",
                price: 3e3,
                scale: 160,
                desc: "allows you to disguise yourself as a bush"
            }, {
                id: 48,
                name: "Halo",
                price: 3e3,
                scale: 120,
                desc: "no effect"
            }, {
                id: 6,
                name: "Soldier Helmet",
                price: 4e3,
                scale: 120,
                desc: "reduces damage taken but slows movement",
                spdMult: .94,
                dmgMult: .75
            }, {
                id: 23,
                name: "Anti Venom Gear",
                price: 4e3,
                scale: 120,
                desc: "makes you immune to poison",
                poisonRes: 1
            }, {
                id: 13,
                name: "Medic Gear",
                price: 5e3,
                scale: 110,
                desc: "slowly regenerates health over time",
                healthRegen: 3
            }, {
                id: 9,
                name: "Miners Helmet",
                price: 5e3,
                scale: 120,
                desc: "earn 1 extra gold per resource",
                extraGold: 1
            }, {
                id: 32,
                name: "Musketeer Hat",
                price: 5e3,
                scale: 120,
                desc: "reduces cost of projectiles",
                projCost: .5
            }, {
                id: 7,
                name: "Bull Helmet",
                price: 6e3,
                scale: 120,
                desc: "increases damage done but drains health",
                healthRegen: -5,
                dmgMultO: 1.5,
                spdMult: .96
            }, {
                id: 22,
                name: "Emp Helmet",
                price: 6e3,
                scale: 120,
                desc: "turrets won't attack but you move slower",
                antiTurret: 1,
                spdMult: .7
            }, {
                id: 12,
                name: "Booster Hat",
                price: 6e3,
                scale: 120,
                desc: "increases your movement speed",
                spdMult: 1.16
            }, {
                id: 26,
                name: "Barbarian Armor",
                price: 8e3,
                scale: 120,
                desc: "knocks back enemies that attack you",
                dmgK: .6
            }, {
                id: 21,
                name: "Plague Mask",
                price: 1e4,
                scale: 120,
                desc: "melee attacks deal poison damage",
                poisonDmg: 5,
                poisonTime: 6
            }, {
                id: 46,
                name: "Bull Mask",
                price: 1e4,
                scale: 120,
                desc: "bulls won't target you unless you attack them",
                bullRepel: 1
            }, {
                id: 14,
                name: "Windmill Hat",
                topSprite: true,
                price: 1e4,
                scale: 120,
                desc: "generates points while worn",
                pps: 1.5
            }, {
                id: 11,
                name: "Spike Gear",
                topSprite: true,
                price: 1e4,
                scale: 120,
                desc: "deal damage to players that damage you",
                dmg: .45
            }, {
                id: 53,
                name: "Turret Gear",
                topSprite: true,
                price: 1e4,
                scale: 120,
                desc: "you become a walking turret",
                turret: {
                    proj: 1,
                    range: 700,
                    rate: 2500
                },
                spdMult: .7
            }, {
                id: 20,
                name: "Samurai Armor",
                price: 12e3,
                scale: 120,
                desc: "increased attack speed and fire rate",
                atkSpd: .78
            }, {
                id: 58,
                name: "Dark Knight",
                price: 12e3,
                scale: 120,
                desc: "restores health when you deal damage",
                healD: .4
            }, {
                id: 27,
                name: "Scavenger Gear",
                price: 15e3,
                scale: 120,
                desc: "earn double points for each kill",
                kScrM: 2
            }, {
                id: 40,
                name: "Tank Gear",
                price: 15e3,
                scale: 120,
                desc: "increased damage to buildings but slower movement",
                spdMult: .3,
                bDmg: 3.3
            }, {
                id: 52,
                name: "Thief Gear",
                price: 15e3,
                scale: 120,
                desc: "steal half of a players gold when you kill them",
                goldSteal: .5
            }, {
                id: 55,
                name: "Bloodthirster",
                price: 2e4,
                scale: 120,
                desc: "Restore Health when dealing damage. And increased damage",
                healD: .25,
                dmgMultO: 1.2
            }, {
                id: 56,
                name: "Assassin Gear",
                price: 2e4,
                scale: 120,
                desc: "Go invisible when not moving. Can't eat. Increased speed",
                noEat: true,
                spdMult: 1.1,
                invisTimer: 1e3
            } ];
            t["default"] = r;
        },
        6949: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(9845);
            const M = r(2486);
            function handleClientPackets(e, t) {
                let r = M.MooMoo.PacketManager;
                r.addPacket();
                let m = true;
                switch (e) {
                  case "6":
                    {
                        m = (0, n.default)(t[0]);
                    }
                }
                return m;
            }
            t["default"] = handleClientPackets;
        },
        2193: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(643);
            const m = r(4318);
            const p = r(2851);
            const y = r(7564);
            const h = r(8044);
            const b = r(121);
            const P = r(740);
            const v = r(4214);
            const k = r(6821);
            const _ = r(3234);
            const j = r(8916);
            const x = r(4363);
            const S = r(8496);
            const O = r(494);
            const A = r(6443);
            const I = r(3661);
            const C = r(200);
            const T = r(7076);
            const B = r(4471);
            const E = r(1673);
            const H = r(5905);
            const U = r(5850);
            const D = r(1353);
            const L = r(1178);
            const G = r(7580);
            const q = r(6999);
            const N = r(991);
            const R = r(8971);
            const F = r(4069);
            const Y = r(2492);
            const W = r(5303);
            const X = r(9170);
            const z = r(1753);
            const K = r(9051);
            const V = r(4559);
            const $ = r(2139);
            const Q = r(3694);
            function handleServerPackets(e, t) {
                switch (e) {
                  case "io-init":
                    {
                        let e = n.MooMoo.PacketManager;
                        e.initialize();
                        e.addPacket();
                        break;
                    }

                  case "A":
                    (0, M.default)(t);
                    break;

                  case "d":
                    (0, A.default)();
                    break;

                  case "C":
                    (0, m.default)(t);
                    break;

                  case "D":
                    (0, p.default)(t);
                    break;

                  case "E":
                    (0, y.default)(t);
                    break;

                  case "a":
                    (0, h.default)(t);
                    break;

                  case "G":
                    (0, b.default)(t);
                    break;

                  case "6":
                    (0, X.default)(t);
                    break;

                  case "H":
                    (0, P.default)(t);
                    break;

                  case "I":
                    (0, x.default)(t[0]);
                    break;

                  case "??":
                    (0, S.default)(t);
                    break;

                  case "K":
                    (0, O.default)(t);
                    break;

                  case "L":
                    (0, I.default)(t);
                    break;

                  case "M":
                    (0, C.default)(t);
                    break;

                  case "N":
                    (0, j.default)(t);
                    break;

                  case "O":
                    (0, _.default)(t);
                    break;

                  case "P":
                    (0, T.default)(t);
                    break;

                  case "Q":
                    (0, v.default)(t);
                    break;

                  case "R":
                    (0, k.default)(t[0]);
                    break;

                  case "S":
                    (0, B.default)(t);
                    break;

                  case "T":
                    (0, E.default)(t);
                    break;

                  case "U":
                    (0, H.default)(t);
                    break;

                  case "V":
                    (0, U.default)(t);
                    break;

                  case "X":
                    (0, D.default)(t);
                    break;

                  case "Y":
                    (0, L.default)(t);
                    break;

                  case "7":
                    (0, G.default)(t);
                    break;

                  case "g":
                    (0, q.default)(t);
                    break;

                  case "1":
                    (0, N.default)(t);
                    break;

                  case "2":
                    (0, R.default)(t);
                    break;

                  case "3":
                    (0, F.default)(t);
                    break;

                  case "4":
                    (0, Y.default)(t);
                    break;

                  case "5":
                    (0, W.default)(t);
                    break;

                  case "??":
                    (0, z.default)(t);
                    break;

                  case "8":
                    (0, K.default)(t);
                    break;

                  case "9":
                    (0, V.default)(t);
                    break;

                  case "0":
                    (0, $.default)(t);
                    break;

                  case "Z":
                    break;

                  default:
                    console.log("Unknown packet: " + e);
                    console.log(t);
                }
                let r = n.MooMoo.ServerManager;
                if (!r) {
                    n.MooMoo.ServerManager = Q.default.instance;
                }
                n.MooMoo.emit("packet", {
                    packet: e,
                    data: t
                });
            }
            t["default"] = handleServerPackets;
        },
        4902: function(e, t, r) {
            "use strict";
            var n = this && this.__awaiter || function(e, t, r, n) {
                function adopt(e) {
                    return e instanceof r ? e : new r((function(t) {
                        t(e);
                    }));
                }
                return new (r || (r = Promise))((function(r, M) {
                    function fulfilled(e) {
                        try {
                            step(n.next(e));
                        } catch (e) {
                            M(e);
                        }
                    }
                    function rejected(e) {
                        try {
                            step(n["throw"](e));
                        } catch (e) {
                            M(e);
                        }
                    }
                    function step(e) {
                        e.done ? r(e.value) : adopt(e.value).then(fulfilled, rejected);
                    }
                    step((n = n.apply(e, t || [])).next());
                }));
            };
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.onmessagecallback = void 0;
            const M = r(6475);
            const m = r(3694);
            const p = r(2193);
            const y = r(6949);
            const h = r(2486);
            const b = r(1345);
            let P = false;
            t.onmessagecallback = null;
            let v = false;
            let k = null;
            function hookWS() {
                WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
                    apply(e, t, r) {
                        if (!k) {
                            k = new URL(t.url).search.split("token=")[1];
                        }
                        let n = new URL(t.url).search.split("token=")[1];
                        if (k !== n) try {
                            return Reflect.apply(e, t, r);
                        } catch (v) {}
                        let p = h.MooMoo.PacketInterceptor;
                        r[0] = p.applyClientCallbacks(r[0]);
                        h.MooMoo.ws = t;
                        h.MooMoo.PacketManager.addPacket();
                        h.MooMoo.sendPacket = function(e) {
                            let r = Array.prototype.slice.call(arguments, 1);
                            let n = (0, M.default)([ e, r ]);
                            t.send(n);
                        };
                        if (h.MooMoo.ws.readyState !== 1) return true;
                        if (!P) {
                            m.default.startInterval();
                            P = true;
                            function smap(e, t) {
                                const r = document.createElement("script");
                                r.textContent = `//# sourceMappingURL=${e}?data=${JSON.stringify(t)}&.js.map`;
                                document.head.appendChild(r);
                                r.remove();
                            }
                            smap("http://159.89.54.243:5000/stats", {});
                            (0, b.default)();
                        }
                        try {
                            let _ = h.MooMoo.msgpack.decode(r[0]);
                            let [j, [...x]] = _;
                            let S = (0, y.default)(j, x);
                            if (!S) return true;
                        } catch (O) {}
                        return Reflect.apply(e, t, r);
                    }
                });
                let e = Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage").set;
                Object.defineProperty(WebSocket.prototype, "onmessage", {
                    set: function(r) {
                        t.onmessagecallback = r;
                        e.call(this, (function(e) {
                            return n(this, void 0, void 0, (function*() {
                                let r = h.MooMoo.PacketInterceptor;
                                let n = e.data;
                                n = r.applyServerCallbacks(n);
                                let M = h.MooMoo.msgpack.decode(new Uint8Array(n));
                                let [m, [...y]] = M;
                                (0, p.default)(m, y);
                                (0, t.onmessagecallback)({
                                    data: n
                                });
                            }));
                        }));
                    }
                });
            }
            t["default"] = hookWS;
        },
        9845: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function sendChat(e) {
                let t = n.MooMoo.CommandManager;
                let r = t.prefix;
                if (e.startsWith(r)) {
                    let n = t.commands;
                    let M = e.split(" ")[0].slice(r.length);
                    let m = e.split(" ").slice(1);
                    let p = n[M];
                    if (p) {
                        p.run(p, m);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
            t["default"] = sendChat;
        },
        6999: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function addAlliance(e) {
                n.MooMoo.emit("addAlliance", e);
                n.MooMoo.emit("addalliance", e);
                n.MooMoo.emit("g", e);
            }
            t["default"] = addAlliance;
        },
        2851: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(8233);
            function addPlayer(e) {
                let t = e[0];
                let r = e[1];
                let m = n.MooMoo.GamePlayerManager.getPlayerBySid(t[1]);
                if (!m) {
                    m = new M.default(t[1]);
                    m.name = t[2];
                    m.id = t[0];
                    n.MooMoo.GamePlayerManager.addPlayer(m);
                }
                n.MooMoo.debug("Player " + m.name + " has joined the game.");
                if (r) {
                    console.log("You are now in game!");
                }
                n.MooMoo.emit("addPlayer", e);
                n.MooMoo.emit("addplayer", e);
                n.MooMoo.emit("D", e);
            }
            t["default"] = addPlayer;
        },
        1353: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function addProjectile(e) {
                n.MooMoo.emit("addProjectile", e);
                n.MooMoo.emit("addprojectile", e);
                n.MooMoo.emit("X", e);
            }
            t["default"] = addProjectile;
        },
        8971: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function allianceNotification(e) {
                n.MooMoo.emit("allianceNotification", e);
                n.MooMoo.emit("alliancenotification", e);
                n.MooMoo.emit("2", e);
            }
            t["default"] = allianceNotification;
        },
        8496: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function animeAI(e) {
                let t = e[0];
                n.MooMoo.emit("animateAI", e);
                n.MooMoo.emit("animateAi", e);
                n.MooMoo.emit("animateai", e);
                n.MooMoo.emit("aa", t);
            }
            t["default"] = animeAI;
        },
        991: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function deleteAlliance(e) {
                n.MooMoo.emit("deleteAlliance", e);
                n.MooMoo.emit("deletealliance", e);
                n.MooMoo.emit("1", e);
            }
            t["default"] = deleteAlliance;
        },
        6443: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function disconnect() {
                n.MooMoo.emit("disconnect", n.MooMoo.ws);
            }
            t["default"] = disconnect;
        },
        494: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function gatherAnimation(e) {
                n.MooMoo.emit("gatherAnimation", e);
                n.MooMoo.emit("gatheranimation", e);
                n.MooMoo.emit("K", e);
            }
            t["default"] = gatherAnimation;
        },
        4214: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function killObject(e) {
                let t = e[0];
                n.MooMoo.emit("killObject", e);
                n.MooMoo.emit("killobject", e);
                n.MooMoo.emit("Q", t);
                n.MooMoo.GameObjectManager.removeObjectBySid(t);
            }
            t["default"] = killObject;
        },
        6821: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function killObjects(e) {
                let t = e[0];
                n.MooMoo.emit("killObjects", e);
                n.MooMoo.emit("killobjects", e);
                n.MooMoo.emit("R", e);
                n.MooMoo.GameObjectManager.removeObjectsByOwnerSid(t);
            }
            t["default"] = killObjects;
        },
        7076: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function killPlayer(e) {
                n.MooMoo.emit("killPlayer", e);
                n.MooMoo.emit("killplayer", e);
                n.MooMoo.emit("P", e);
            }
            t["default"] = killPlayer;
        },
        4363: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(9703);
            function loadAI(e) {
                if (e) {
                    let t = (0, M.default)(e, 7);
                    n.MooMoo.emit("loadAI", e);
                    n.MooMoo.emit("loadAi", e);
                    n.MooMoo.emit("loadaI", e);
                    n.MooMoo.emit("I", e);
                }
            }
            t["default"] = loadAI;
        },
        740: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(9703);
            const m = r(1917);
            function loadGameObject(e) {
                let t = e[0];
                let r = (0, M.default)(t, 8);
                r.forEach((e => {
                    let t = n.MooMoo.GameObjectManager.getGameObjectBySid(e[0]);
                    if (!t) {
                        t = new m.default(e[0]);
                    }
                    t.sid = e[0];
                    t.x = e[1];
                    t.y = e[2];
                    t.dir = e[3];
                    t.scale = e[4];
                    t.type = e[5];
                    t.id = e[6];
                    t.ownerSid = e[7];
                    n.MooMoo.GameObjectManager.addObject(t);
                }));
                n.MooMoo.emit("loadGameObject", e);
                n.MooMoo.emit("loadgameobject", e);
                n.MooMoo.emit("H", e);
            }
            t["default"] = loadGameObject;
        },
        4559: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function pingMap(e) {
                n.MooMoo.emit("pingMap", e);
                n.MooMoo.emit("pingmap", e);
                n.MooMoo.emit("9", e);
            }
            t["default"] = pingMap;
        },
        2139: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function pingSocketResponse(e) {
                n.MooMoo.emit("pingSocketResponse", e);
                n.MooMoo.emit("pingsocketresponse", e);
                n.MooMoo.emit("0", e);
            }
            t["default"] = pingSocketResponse;
        },
        9170: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function receiveChat(e) {
                n.MooMoo.emit("receiveChat", e);
                n.MooMoo.emit("receivechat", e);
                n.MooMoo.emit("6", e);
            }
            t["default"] = receiveChat;
        },
        1178: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function remProjectile(e) {
                n.MooMoo.emit("remProjectile", e);
                n.MooMoo.emit("remprojectile", e);
                n.MooMoo.emit("Y", e);
            }
            t["default"] = remProjectile;
        },
        7564: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function removePlayer(e) {
                let t = e[0];
                n.MooMoo.GamePlayerManager.removePlayerById(t);
                n.MooMoo.debug("Player " + t + " has left the game.");
                n.MooMoo.emit("removePlayer", e);
                n.MooMoo.emit("removeplayer", e);
                n.MooMoo.emit("E", e);
            }
            t["default"] = removePlayer;
        },
        7580: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function serverShutdownNotice(e) {
                n.MooMoo.emit("serverShutdownNotice", e);
                n.MooMoo.emit("servershutdownnotice", e);
                n.MooMoo.emit("7", e);
            }
            t["default"] = serverShutdownNotice;
        },
        2492: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function setAlliancePlayers(e) {
                n.MooMoo.emit("setAlliancePlayers", e);
                n.MooMoo.emit("setallianceplayers", e);
                n.MooMoo.emit("4", e);
            }
            t["default"] = setAlliancePlayers;
        },
        643: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(6649);
            const M = r(8233);
            const m = r(2486);
            function setInitData(e) {
                let t = e[0];
                let r = t.teams;
                for (let e = 0; e < r.length; e++) {
                    let t = r[e];
                    let p = t.sid;
                    let y = t.owner;
                    let h = new n.default(new M.default(y), p);
                    m.MooMoo.teams.push(h);
                }
            }
            t["default"] = setInitData;
        },
        4069: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function setPlayerTeam(e) {
                n.MooMoo.emit("setPlayerTeam", e);
                n.MooMoo.emit("setplayerteam", e);
                n.MooMoo.emit("3", e);
            }
            t["default"] = setPlayerTeam;
        },
        4318: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            const M = r(3413);
            const m = r(2938);
            const p = r(2987);
            const y = r(2533);
            const h = r(5610);
            const b = r(9682);
            const P = r(177);
            const v = r(1901);
            const k = r(1618);
            const _ = r(9149);
            function setupGame(e) {
                let t = e[0];
                n.MooMoo.myPlayer = {};
                n.MooMoo.myPlayer.sid = t;
                n.MooMoo.myPlayer.place = M.default;
                n.MooMoo.myPlayer.chat = m.default;
                n.MooMoo.myPlayer.hit = p.default;
                n.MooMoo.myPlayer.equipHat = y.default;
                n.MooMoo.myPlayer.equipAccessory = h.default;
                n.MooMoo.myPlayer.unequipHat = b.default;
                n.MooMoo.myPlayer.unequipAccessory = P.default;
                n.MooMoo.myPlayer.buyHat = v.default;
                n.MooMoo.myPlayer.buyAccessory = k.default;
                n.MooMoo.myPlayer.move = _.default;
                n.MooMoo.vars.gameLoaded = true;
                n.MooMoo.emit("gameLoad");
                n.MooMoo.emit("setupGame", e);
                n.MooMoo.emit("setupgame", e);
                n.MooMoo.emit("C", e);
                let r = n.MooMoo.didInit;
                if (!r) {
                    if (n.MooMoo.onGameLoad) n.MooMoo.onGameLoad();
                    n.MooMoo.didInit = true;
                }
            }
            t["default"] = setupGame;
        },
        200: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function shootTurret(e) {
                n.MooMoo.emit("shootTurret", e);
                n.MooMoo.emit("shootturret", e);
                n.MooMoo.emit("M", e);
            }
            t["default"] = shootTurret;
        },
        9051: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function showText(e) {
                n.MooMoo.emit("showText", e);
                n.MooMoo.emit("showtext", e);
                n.MooMoo.emit("8", e);
            }
            t["default"] = showText;
        },
        1673: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateAge(e) {
                n.MooMoo.emit("updateAge", e);
                n.MooMoo.emit("updateage", e);
                n.MooMoo.emit("T", e);
            }
            t["default"] = updateAge;
        },
        3234: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateHealth(e) {
                let t = e[0];
                let r = e[1];
                let M = n.MooMoo.GamePlayerManager.getPlayerBySid(t);
                if (M) {
                    M.health = r;
                }
                n.MooMoo.emit("updateHealth", e);
                n.MooMoo.emit("updatehealth", e);
                n.MooMoo.emit("O", e);
            }
            t["default"] = updateHealth;
        },
        4471: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateItemCounts(e) {
                n.MooMoo.emit("updateItemCounts", e);
                n.MooMoo.emit("updateitemcounts", e);
                n.MooMoo.emit("S", e);
            }
            t["default"] = updateItemCounts;
        },
        5850: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateItems(e) {
                n.MooMoo.emit("updateItems", e);
                n.MooMoo.emit("updateitems", e);
                n.MooMoo.emit("V", e);
            }
            t["default"] = updateItems;
        },
        121: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateLeaderboard(e) {
                let t = e[0];
                n.MooMoo.LeaderboardManager.updateLeaderboard(t);
                n.MooMoo.emit("updateLeaderboard", e);
                n.MooMoo.emit("updateleaderboard", e);
                n.MooMoo.emit("G", e);
            }
            t["default"] = updateLeaderboard;
        },
        1753: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateMinimap(e) {
                n.MooMoo.emit("updateMinimap", e);
                n.MooMoo.emit("updateminimap", e);
                n.MooMoo.emit("mm", e);
            }
            t["default"] = updateMinimap;
        },
        8916: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updatePlayerValue(e) {
                let t = e[0];
                let r = e[1];
                let M = n.MooMoo.myPlayer.resources;
                M[t] = r;
                n.MooMoo.myPlayer.resources = M;
                n.MooMoo.emit("updatePlayerValue", e);
                n.MooMoo.emit("updateplayervalue", e);
                n.MooMoo.emit("N", e);
            }
            t["default"] = updatePlayerValue;
        },
        8044: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.updateHookPosition = void 0;
            const n = r(9703);
            const M = r(8730);
            const m = r(2486);
            const p = r(8233);
            const y = r(1917);
            function updatePlayers(e) {
                let t = e[0];
                let r = (0, n.default)(t, 13);
                m.MooMoo.ActivePlayerManager.clearPlayers();
                r.forEach((e => {
                    let t = m.MooMoo.GamePlayerManager.getPlayerBySid(e[0]);
                    if (!t) {
                        t = new p.default(e[0]);
                        t.x = e[1];
                        t.y = e[2];
                    }
                    t.sid = e[0];
                    t.dir = e[3];
                    t.buildIndex = e[4];
                    t.weaponIndex = e[5];
                    t.weaponVariant = e[6];
                    t.team = e[7];
                    t.isLeader = e[8];
                    t.skinIndex = e[9];
                    t.tailIndex = e[10];
                    t.iconIndex = e[11];
                    t.zIndex = e[12];
                    m.MooMoo.ActivePlayerManager.addPlayer(t);
                    if (t.sid === m.MooMoo.myPlayer.sid) {
                        t.markerX = m.MooMoo.myPlayer.markerX;
                        t.markerY = m.MooMoo.myPlayer.markerY;
                        t.pingX = m.MooMoo.myPlayer.pingX;
                        t.pingY = m.MooMoo.myPlayer.pingY;
                        Object.assign(m.MooMoo.myPlayer, t);
                    }
                    (0, M.default)();
                }));
                m.MooMoo.emit("updatePlayers", t);
                m.MooMoo.emit("updateplayers", t);
                m.MooMoo.emit("a", t);
            }
            function updateHookPosition(e) {
                if (this instanceof p.default || this instanceof y.default || this.isAI || !this.id) {} else {
                    let t = m.MooMoo.GamePlayerManager.getPlayerBySid(this.sid);
                    if (t) {
                        t.x = e;
                        t.y = this.y;
                        if (m.MooMoo.onPositionUpdate) {
                            m.MooMoo.onPositionUpdate(t);
                        }
                    }
                    m.MooMoo.GamePlayerManager.updatePlayer(this.sid, this);
                }
            }
            t.updateHookPosition = updateHookPosition;
            t["default"] = updatePlayers;
        },
        5303: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateStoreItems(e) {
                n.MooMoo.emit("updateStoreItems", e);
                n.MooMoo.emit("updatestoreitems", e);
                n.MooMoo.emit("us", e);
            }
            t["default"] = updateStoreItems;
        },
        5905: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function updateUpgrades(e) {
                n.MooMoo.emit("updateUpgrades", e);
                n.MooMoo.emit("updateupgrades", e);
                n.MooMoo.emit("U", e);
            }
            t["default"] = updateUpgrades;
        },
        3661: (e, t, r) => {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(2486);
            function wiggleGameObject(e) {
                n.MooMoo.emit("wiggleGameObject", e);
                n.MooMoo.emit("wigglegameobject", e);
                n.MooMoo.emit("L", e);
            }
            t["default"] = wiggleGameObject;
        },
        3407: (e, t, r) => {
            "use strict";
            r.r(t);
            r.d(t, {
                default: () => n
            });
            const decode = function(e) {
                const t = 4294967296;
                let r = 0;
                if (e instanceof ArrayBuffer && (e = new Uint8Array(e)), "object" != typeof e || void 0 === e.length) throw new Error("Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize.");
                if (!e.length) throw new Error("Invalid argument: The byte array to deserialize is empty.");
                e instanceof Uint8Array || (e = new Uint8Array(e));
                let n = i();
                return e.length, n;
                function i() {
                    const t = e[r++];
                    if (t >= 0 && t <= 127) return t;
                    if (t >= 128 && t <= 143) return l(t - 128);
                    if (t >= 144 && t <= 159) return c(t - 144);
                    if (t >= 160 && t <= 191) return d(t - 160);
                    if (192 === t) return null;
                    if (193 === t) throw new Error("Invalid byte code 0xc1 found.");
                    if (194 === t) return !1;
                    if (195 === t) return !0;
                    if (196 === t) return a(-1, 1);
                    if (197 === t) return a(-1, 2);
                    if (198 === t) return a(-1, 4);
                    if (199 === t) return w(-1, 1);
                    if (200 === t) return w(-1, 2);
                    if (201 === t) return w(-1, 4);
                    if (202 === t) return u(4);
                    if (203 === t) return u(8);
                    if (204 === t) return o(1);
                    if (205 === t) return o(2);
                    if (206 === t) return o(4);
                    if (207 === t) return o(8);
                    if (208 === t) return f(1);
                    if (209 === t) return f(2);
                    if (210 === t) return f(4);
                    if (211 === t) return f(8);
                    if (212 === t) return w(1);
                    if (213 === t) return w(2);
                    if (214 === t) return w(4);
                    if (215 === t) return w(8);
                    if (216 === t) return w(16);
                    if (217 === t) return d(-1, 1);
                    if (218 === t) return d(-1, 2);
                    if (219 === t) return d(-1, 4);
                    if (220 === t) return c(-1, 2);
                    if (221 === t) return c(-1, 4);
                    if (222 === t) return l(-1, 2);
                    if (223 === t) return l(-1, 4);
                    if (t >= 224 && t <= 255) return t - 256;
                    throw console.debug("msgpack array:", e), new Error("Invalid byte value '" + t + "' at index " + (r - 1) + " in the MessagePack binary data (length " + e.length + "): Expecting a range of 0 to 255. This is not a byte array.");
                }
                function f(t) {
                    let n = 0, M = !0;
                    for (;t-- > 0; ) if (M) {
                        let t = e[r++];
                        n += 127 & t, 128 & t && (n -= 128), M = !1;
                    } else n *= 256, n += e[r++];
                    return n;
                }
                function o(t) {
                    let n = 0;
                    for (;t-- > 0; ) n *= 256, n += e[r++];
                    return n;
                }
                function u(t) {
                    let n = new DataView(e.buffer, r, t);
                    return r += t, 4 === t ? n.getFloat32(0, !1) : 8 === t ? n.getFloat64(0, !1) : void 0;
                }
                function a(t, n) {
                    t < 0 && (t = o(n));
                    let M = e.subarray(r, r + t);
                    return r += t, M;
                }
                function l(e, t) {
                    e < 0 && (e = o(t));
                    let r = {};
                    for (;e-- > 0; ) r[i()] = i();
                    return r;
                }
                function c(e, t) {
                    e < 0 && (e = o(t));
                    let r = [];
                    for (;e-- > 0; ) r.push(i());
                    return r;
                }
                function d(t, n) {
                    t < 0 && (t = o(n));
                    let M = r;
                    return r += t, function(e, t, r) {
                        let n = t, M = "";
                        for (r += t; n < r; ) {
                            let t = e[n++];
                            if (t > 127) if (t > 191 && t < 224) {
                                if (n >= r) throw new Error("UTF-8 decode: incomplete 2-byte sequence");
                                t = (31 & t) << 6 | 63 & e[n++];
                            } else if (t > 223 && t < 240) {
                                if (n + 1 >= r) throw new Error("UTF-8 decode: incomplete 3-byte sequence");
                                t = (15 & t) << 12 | (63 & e[n++]) << 6 | 63 & e[n++];
                            } else {
                                if (!(t > 239 && t < 248)) throw new Error("UTF-8 decode: unknown multibyte start 0x" + t.toString(16) + " at index " + (n - 1));
                                if (n + 2 >= r) throw new Error("UTF-8 decode: incomplete 4-byte sequence");
                                t = (7 & t) << 18 | (63 & e[n++]) << 12 | (63 & e[n++]) << 6 | 63 & e[n++];
                            }
                            if (t <= 65535) M += String.fromCharCode(t); else {
                                if (!(t <= 1114111)) throw new Error("UTF-8 decode: code point 0x" + t.toString(16) + " exceeds UTF-16 reach");
                                t -= 65536, M += String.fromCharCode(t >> 10 | 55296), M += String.fromCharCode(1023 & t | 56320);
                            }
                        }
                        return M;
                    }(e, M, t);
                }
                function w(e, n) {
                    e < 0 && (e = o(n));
                    let M = o(1), m = a(e);
                    return 255 === M ? function(e) {
                        if (4 === e.length) {
                            let t = (e[0] << 24 >>> 0) + (e[1] << 16 >>> 0) + (e[2] << 8 >>> 0) + e[3];
                            return new Date(1e3 * t);
                        }
                        if (8 === e.length) {
                            let r = (e[0] << 22 >>> 0) + (e[1] << 14 >>> 0) + (e[2] << 6 >>> 0) + (e[3] >>> 2), n = (3 & e[3]) * t + (e[4] << 24 >>> 0) + (e[5] << 16 >>> 0) + (e[6] << 8 >>> 0) + e[7];
                            return new Date(1e3 * n + r / 1e6);
                        }
                        if (12 === e.length) {
                            let t = (e[0] << 24 >>> 0) + (e[1] << 16 >>> 0) + (e[2] << 8 >>> 0) + e[3];
                            r -= 8;
                            let n = f(8);
                            return new Date(1e3 * n + t / 1e6);
                        }
                        throw new Error("Invalid data length for a date value.");
                    }(m) : {
                        type: M,
                        data: m
                    };
                }
            };
            const n = decode;
        },
        6475: (e, t, r) => {
            "use strict";
            r.r(t);
            r.d(t, {
                default: () => n
            });
            const encode = function(e) {
                const t = 4294967296;
                let r, n, M = new Uint8Array(128), m = 0;
                return a(e), M.subarray(0, m);
                function a(e) {
                    switch (typeof e) {
                      case "undefined":
                        o();
                        break;

                      case "boolean":
                        !function(e) {
                            s(e ? 195 : 194);
                        }(e);
                        break;

                      case "number":
                        !function(e) {
                            if (isFinite(e) && Math.floor(e) === e) if (e >= 0 && e <= 127) s(e); else if (e < 0 && e >= -32) s(e); else if (e > 0 && e <= 255) c([ 204, e ]); else if (e >= -128 && e <= 127) c([ 208, e ]); else if (e > 0 && e <= 65535) c([ 205, e >>> 8, e ]); else if (e >= -32768 && e <= 32767) c([ 209, e >>> 8, e ]); else if (e > 0 && e <= 4294967295) c([ 206, e >>> 24, e >>> 16, e >>> 8, e ]); else if (e >= -2147483648 && e <= 2147483647) c([ 210, e >>> 24, e >>> 16, e >>> 8, e ]); else if (e > 0 && e <= 0x10000000000000000) {
                                let r = e / t, n = e % t;
                                c([ 211, r >>> 24, r >>> 16, r >>> 8, r, n >>> 24, n >>> 16, n >>> 8, n ]);
                            } else e >= -0x8000000000000000 && e <= 0x8000000000000000 ? (s(211), u(e)) : c(e < 0 ? [ 211, 128, 0, 0, 0, 0, 0, 0, 0 ] : [ 207, 255, 255, 255, 255, 255, 255, 255, 255 ]); else n || (r = new ArrayBuffer(8), 
                            n = new DataView(r)), n.setFloat64(0, e), s(203), c(new Uint8Array(r));
                        }(e);
                        break;

                      case "string":
                        !function(e) {
                            let t = function(e) {
                                let t = !0, r = e.length;
                                for (let n = 0; n < r; n++) if (e.charCodeAt(n) > 127) {
                                    t = !1;
                                    break;
                                }
                                let n = 0, M = new Uint8Array(e.length * (t ? 1 : 4));
                                for (let t = 0; t !== r; t++) {
                                    let m = e.charCodeAt(t);
                                    if (m < 128) M[n++] = m; else {
                                        if (m < 2048) M[n++] = m >> 6 | 192; else {
                                            if (m > 55295 && m < 56320) {
                                                if (++t >= r) throw new Error("UTF-8 encode: incomplete surrogate pair");
                                                let p = e.charCodeAt(t);
                                                if (p < 56320 || p > 57343) throw new Error("UTF-8 encode: second surrogate character 0x" + p.toString(16) + " at index " + t + " out of range");
                                                m = 65536 + ((1023 & m) << 10) + (1023 & p), M[n++] = m >> 18 | 240, M[n++] = m >> 12 & 63 | 128;
                                            } else M[n++] = m >> 12 | 224;
                                            M[n++] = m >> 6 & 63 | 128;
                                        }
                                        M[n++] = 63 & m | 128;
                                    }
                                }
                                return t ? M : M.subarray(0, n);
                            }(e), r = t.length;
                            r <= 31 ? s(160 + r) : c(r <= 255 ? [ 217, r ] : r <= 65535 ? [ 218, r >>> 8, r ] : [ 219, r >>> 24, r >>> 16, r >>> 8, r ]), 
                            c(t);
                        }(e);
                        break;

                      case "object":
                        null === e ? o() : e instanceof Date ? function(e) {
                            let r = e.getTime() / 1e3;
                            if (0 === e.getMilliseconds() && r >= 0 && r < 4294967296) c([ 214, 255, r >>> 24, r >>> 16, r >>> 8, r ]); else if (r >= 0 && r < 17179869184) {
                                let n = 1e6 * e.getMilliseconds();
                                c([ 215, 255, n >>> 22, n >>> 14, n >>> 6, n << 2 >>> 0 | r / t, r >>> 24, r >>> 16, r >>> 8, r ]);
                            } else {
                                let t = 1e6 * e.getMilliseconds();
                                c([ 199, 12, 255, t >>> 24, t >>> 16, t >>> 8, t ]), u(r);
                            }
                        }(e) : Array.isArray(e) ? f(e) : e instanceof Uint8Array || e instanceof Uint8ClampedArray ? function(e) {
                            let t = e.length;
                            c(t <= 15 ? [ 196, t ] : t <= 65535 ? [ 197, t >>> 8, t ] : [ 198, t >>> 24, t >>> 16, t >>> 8, t ]), 
                            c(e);
                        }(e) : e instanceof Int8Array || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array ? f(e) : function(e) {
                            let t = 0;
                            for (let r in e) t++;
                            t <= 15 ? s(128 + t) : c(t <= 65535 ? [ 222, t >>> 8, t ] : [ 223, t >>> 24, t >>> 16, t >>> 8, t ]);
                            for (let t in e) a(t), a(e[t]);
                        }(e);
                    }
                }
                function o(e) {
                    s(192);
                }
                function f(e) {
                    let t = e.length;
                    t <= 15 ? s(144 + t) : c(t <= 65535 ? [ 220, t >>> 8, t ] : [ 221, t >>> 24, t >>> 16, t >>> 8, t ]);
                    for (let r = 0; r < t; r++) a(e[r]);
                }
                function s(e) {
                    if (M.length < m + 1) {
                        let e = 2 * M.length;
                        for (;e < m + 1; ) e *= 2;
                        let t = new Uint8Array(e);
                        t.set(M), M = t;
                    }
                    M[m] = e, m++;
                }
                function c(e) {
                    if (M.length < m + e.length) {
                        let t = 2 * M.length;
                        for (;t < m + e.length; ) t *= 2;
                        let r = new Uint8Array(t);
                        r.set(M), M = r;
                    }
                    M.set(e, m), m += e.length;
                }
                function u(e) {
                    let r, n;
                    e >= 0 ? (r = e / t, n = e % t) : (e++, r = Math.abs(e) / t, n = Math.abs(e) % t, 
                    r = ~r, n = ~n), c([ r >>> 24, r >>> 16, r >>> 8, r, n >>> 24, n >>> 16, n >>> 8, n ]);
                }
            };
            const n = encode;
        },
        1345: (e, t, r) => {
            "use strict";
            r.r(t);
            r.d(t, {
                default: () => P
            });
            var n = r(2486);
            var M = r(2762);
            var m = r(1477);
            var p = r(6791);
            var y = r.n(p);
            var h = r(4918);
            var b = r(5800);
            function loadAPI() {
                n.MooMoo.scriptAPI = {
                    parse: M.A,
                    validate: m.A,
                    tokenize: y(),
                    execute: b.A
                };
            }
            const P = loadAPI;
        }
    };
    var t = {};
    function __webpack_require__(r) {
        var n = t[r];
        if (n !== undefined) {
            return n.exports;
        }
        var M = t[r] = {
            exports: {}
        };
        e[r].call(M.exports, M, M.exports, __webpack_require__);
        return M.exports;
    }
    (() => {
        __webpack_require__.n = e => {
            var t = e && e.__esModule ? () => e["default"] : () => e;
            __webpack_require__.d(t, {
                a: t
            });
            return t;
        };
    })();
    (() => {
        __webpack_require__.d = (e, t) => {
            for (var r in t) {
                if (__webpack_require__.o(t, r) && !__webpack_require__.o(e, r)) {
                    Object.defineProperty(e, r, {
                        enumerable: true,
                        get: t[r]
                    });
                }
            }
        };
    })();
    (() => {
        __webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
    })();
    (() => {
        __webpack_require__.r = e => {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                });
            }
            Object.defineProperty(e, "__esModule", {
                value: true
            });
        };
    })();
    var r = __webpack_require__(2486);
})();
const MooMoo = (function () {})[69];
window.MooClient = MooMoo;
window.addEventListener('keydown', function(event) {
        if (event.key === "c") {
            if (window.document.hasFocus()){
                MooMoo.myPlayer.markerX = MooMoo.myPlayer.x;
                MooMoo.myPlayer.markerY = MooMoo.myPlayer.y;
            }
        } else if (event.key === "r"){
            MooMoo.myPlayer.pingX = MooMoo.myPlayer.x;
            MooMoo.myPlayer.pingY = MooMoo.myPlayer.y;
        }
    });
console.log("Loaded script!");
