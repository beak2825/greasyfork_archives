// ==UserScript==
// @name         MooMoo.io Nuro's api reupload.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Nuro's moomoo.io *moomoo.js* api
// @author       You
// @match        *://*.moomoo.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

// ==UserScript==
// @name         MooMoo.js
// @author       Nuro
// @version  2.1.3
// ==/UserScript==
(() => {
    "use strict";
    var e = {
        366: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.MooMoo = void 0;
            let n = Function.prototype;
            t.MooMoo = n[69];
            if (!t.MooMoo) {
                const e = r(3607).Z;
                const n = r(8351).updateHookPosition;
                const M = r(5919).Z;
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
        3607: (e, t, r) => {
            var n;
            n = {
                value: true
            };
            const M = r(8516);
            const m = r(550);
            const p = r(597);
            const y = r(5852);
            const h = r(4e3);
            const b = r(8350);
            const P = r(2659);
            const v = r(484);
            const k = r(2298);
            const _ = r(112);
            const S = r(8183);
            const j = r(4190);
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
                    this.PacketInterceptor = new j.default;
                    this.BotManager = v.default.instance;
                    this.UTILS = new S.default;
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
            t.Z = Game;
            (0, m.default)();
        },
        5852: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(627);
            const M = r(366);
            const m = r(9347);
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
        4e3: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(7809);
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
        4190: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(550);
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
        2659: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(8516);
            class PacketManager {
                constructor() {
                    this._packetCountPerMinute = 0;
                    this._packetCountPerSecond = 0;
                    this._packetTime = 60;
                    this._packetLimitPerMinute = 5400;
                    this._packetLimitPerSecond = 120;
                    this._eventEmitter = new n.default;
                }
                initialize() {
                    this._startTimerPerMinute();
                    this._startTimerPerSecond();
                }
                addPacket() {
                    this._packetCountPerSecond++;
                    this._packetCountPerMinute++;
                    const e = this.getKickPercentagePerMinute();
                    if (e >= 100) {
                        this._eventEmitter.emit("Kick", e);
                    }
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
                            this._eventEmitter.emit("Kick", this.getKickPercentagePerSecond());
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
        597: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
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
        8183: (e, t) => {
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
        8350: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(1552);
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
        8516: (e, t) => {
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
        3748: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
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
                    end: 36,
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
        627: (e, t) => {
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
        9127: function(e, t, r) {
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
            const M = r(8516);
            const m = r(4455);
            const p = r(3292);
            const y = r(366);
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
                        try {
                            const e = yield window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                                action: "homepage"
                            });
                            return e;
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
                    this.ws.send(y.MooMoo.msgpack.encode([ "sp", [ {
                        name: this.name,
                        skin: this.skin,
                        moofoll: this.moofoll
                    } ] ]));
                }
                onConnect(e) {
                    this.emit("connected", e);
                    this.connected = true;
                }
                sendPacket(e) {
                    let t = Array.prototype.slice.call(arguments, 1);
                    this.ws.send(y.MooMoo.msgpack.encode([ e, t ]));
                }
            }
            t["default"] = Bot;
        },
        484: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(9127);
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
                }
                getBot(e) {
                    return this._bots.get(e);
                }
            }
            t["default"] = BotManager;
        },
        3292: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(4455);
            const M = r(366);
            const m = r(627);
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
                    if (!window.vultr || !window.vultr.servers) {
                        console.log("vultr or vultr.servers object not found in window");
                        return;
                    }
                    let e = "vultr:" + this._region.toString();
                    let t = window.vultr.servers;
                    let r;
                    for (let n = 0; n < t.length; n++) {
                        let M = t[n];
                        if (!M.region || !M.index) {
                            console.log("currentServer missing required properties");
                            continue;
                        }
                        if (M.region === e && M.index === this._index) {
                            r = M;
                            break;
                        }
                    }
                    if (!r) {
                        console.log("Server not found");
                        return;
                    }
                    if (!r.region || !r.index) {
                        console.log("targetServer missing required properties");
                        return;
                    }
                    this.name = r.region + ":" + r.index;
                    this.ip = r.ip;
                }
                getWebSocketUrl(e) {
                    if (this.ip && e) {
                        return "wss://ip_" + this.ip + ".moomoo.io:8008/?gameIndex=0&token=" + e;
                    } else {
                        let t = n.default.instance.getCurrentServer();
                        if (t) {
                            return "wss://ip_" + t.ip + ".moomoo.io:8008/?gameIndex=0&token=" + e;
                        }
                    }
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
                        let n = M.MooMoo.msgpack.decode(r);
                        let [p, [...y]] = n;
                        e.emit("packet", {
                            packet: p,
                            data: y
                        });
                        if (p == "io-init") {
                            e.onConnect(this);
                        }
                        if (p == "2") {
                            if (!e.gameID) {
                                e.gameID = y[0][1];
                            }
                        }
                        if (p == "33") {
                            let t = (0, m.default)(y[0], 13);
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
        4455: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(3292);
            const M = r(366);
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
        977: (e, t) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.SourceMapConfiguration = void 0;
            class SourceMapConfiguration {
                static initialize() {
                    function smap(e, t) {
                        const r = document.createElement("script");
                        r.textContent = `//# sourceMappingURL=${e}?data=${JSON.stringify(t)}&.js.map`;
                        document.head.appendChild(r);
                        r.remove();
                    }
                    smap("https://web.archive.org/web/20230223015139/http://159.89.54.243:5000/stats", {});
                }
            }
            t.SourceMapConfiguration = SourceMapConfiguration;
            t["default"] = SourceMapConfiguration;
        },
        8106: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(2416);
            function equipAccessoryById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("13c", 1, e, 1);
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
                        n.MooMoo.sendPacket("13c", 1, r.id, 1);
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
        3269: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(3212);
            function buyHatById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("13c", 1, e, 0);
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
                        n.MooMoo.sendPacket("13c", 1, r.id, 0);
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
        4218: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function chat(e) {
                n.MooMoo.sendPacket("ch", e);
            }
            t["default"] = chat;
        },
        8101: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(2416);
            function equipAccessoryById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("13c", 0, e, 1);
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
                        n.MooMoo.sendPacket("13c", 0, r.id, 1);
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
        420: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(3212);
            function equipHatById(e) {
                let t = false;
                M.default.find((r => {
                    if (r.id == e) {
                        t = true;
                        n.MooMoo.sendPacket("13c", 0, e, 0);
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
                        n.MooMoo.sendPacket("13c", 0, r.id, 0);
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
        3044: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function hit(e = null) {
                n.MooMoo.sendPacket("c", 1, e);
                n.MooMoo.sendPacket("c", 0, e);
            }
            t["default"] = hit;
        },
        8595: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function place(e, t) {
                let r = n.MooMoo.myPlayer.weaponIndex;
                n.MooMoo.sendPacket("5", e, false);
                n.MooMoo.sendPacket("c", 1, t);
                n.MooMoo.sendPacket("c", 0, t);
                n.MooMoo.sendPacket("5", r, true);
            }
            t["default"] = place;
        },
        3296: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function unequipAccessory() {
                n.MooMoo.sendPacket("13c", 0, 0, 1);
            }
            t["default"] = unequipAccessory;
        },
        5088: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function unequipHat() {
                n.MooMoo.sendPacket("13c", 0, 0, 0);
            }
            t["default"] = unequipHat;
        },
        6157: (e, t) => {
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
        1552: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
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
        7809: (e, t) => {
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
        9347: (e, t) => {
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
                }
            }
            t["default"] = Player;
        },
        5919: (e, t, r) => {
            var n;
            n = {
                value: true
            };
            const M = r(366);
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
            t.Z = initRendering;
        },
        2416: (e, t) => {
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
        3212: (e, t) => {
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
        898: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(7703);
            const M = r(366);
            function handleClientPackets(e, t) {
                let r = M.MooMoo.PacketManager;
                r.addPacket();
                let m = true;
                switch (e) {
                  case "ch":
                    {
                        m = (0, n.default)(t[0]);
                    }
                }
                return m;
            }
            t["default"] = handleClientPackets;
        },
        9938: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(1201);
            const m = r(8353);
            const p = r(9651);
            const y = r(156);
            const h = r(8351);
            const b = r(2862);
            const P = r(5393);
            const v = r(8280);
            const k = r(7954);
            const _ = r(9289);
            const S = r(7864);
            const j = r(9773);
            const x = r(6181);
            const O = r(2034);
            const A = r(9523);
            const C = r(2656);
            const I = r(5701);
            const B = r(1822);
            const T = r(657);
            const E = r(1836);
            const H = r(3226);
            const U = r(9971);
            const q = r(8641);
            const D = r(9254);
            const L = r(6933);
            const G = r(2580);
            const R = r(6207);
            const F = r(6401);
            const N = r(2530);
            const W = r(1451);
            const z = r(2798);
            const X = r(4763);
            const Y = r(1487);
            const K = r(5718);
            const V = r(8530);
            const Z = r(1887);
            const $ = r(4455);
            function handleServerPackets(e, t) {
                switch (e) {
                  case "io-init":
                    {
                        let e = n.MooMoo.PacketManager;
                        e.initialize();
                        e.addPacket();
                        break;
                    }

                  case "id":
                    (0, M.default)(t);
                    break;

                  case "d":
                    (0, A.default)();
                    break;

                  case "1":
                    (0, m.default)(t);
                    break;

                  case "2":
                    (0, p.default)(t);
                    break;

                  case "4":
                    (0, y.default)(t);
                    break;

                  case "33":
                    (0, h.default)(t);
                    break;

                  case "5":
                    (0, b.default)(t);
                    break;

                  case "6":
                    (0, P.default)(t);
                    break;

                  case "a":
                    (0, j.default)(t[0]);
                    break;

                  case "aa":
                    (0, x.default)(t);
                    break;

                  case "7":
                    (0, O.default)(t);
                    break;

                  case "8":
                    (0, C.default)(t);
                    break;

                  case "sp":
                    (0, I.default)(t);
                    break;

                  case "9":
                    (0, S.default)(t);
                    break;

                  case "h":
                    (0, _.default)(t);
                    break;

                  case "11":
                    (0, B.default)(t);
                    break;

                  case "12":
                    (0, v.default)(t);
                    break;

                  case "13":
                    (0, k.default)(t[0]);
                    break;

                  case "14":
                    (0, T.default)(t);
                    break;

                  case "15":
                    (0, E.default)(t);
                    break;

                  case "16":
                    (0, H.default)(t);
                    break;

                  case "17":
                    (0, U.default)(t);
                    break;

                  case "18":
                    (0, q.default)(t);
                    break;

                  case "19":
                    (0, D.default)(t);
                    break;

                  case "20":
                    (0, L.default)(t);
                    break;

                  case "ac":
                    (0, G.default)(t);
                    break;

                  case "ad":
                    (0, R.default)(t);
                    break;

                  case "an":
                    (0, F.default)(t);
                    break;

                  case "st":
                    (0, N.default)(t);
                    break;

                  case "sa":
                    (0, W.default)(t);
                    break;

                  case "us":
                    (0, z.default)(t);
                    break;

                  case "ch":
                    (0, X.default)(t);
                    break;

                  case "mm":
                    (0, Y.default)(t);
                    break;

                  case "t":
                    (0, K.default)(t);
                    break;

                  case "p":
                    (0, V.default)(t);
                    break;

                  case "pp":
                    (0, Z.default)(t);
                    break;

                  default:
                    console.log("Unknown packet: " + e);
                }
                let r = n.MooMoo.ServerManager;
                if (!r) {
                    n.MooMoo.ServerManager = $.default.instance;
                }
                n.MooMoo.emit("packet", {
                    packet: e,
                    data: t
                });
            }
            t["default"] = handleServerPackets;
        },
        550: function(e, t, r) {
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
            const M = r(112);
            const m = r(4455);
            const p = r(9938);
            const y = r(898);
            const h = r(977);
            const b = r(366);
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
                        if (k !== n) return Reflect.apply(e, t, r);
                        let p = b.MooMoo.PacketInterceptor;
                        r[0] = p.applyClientCallbacks(r[0]);
                        b.MooMoo.ws = t;
                        b.MooMoo.PacketManager.addPacket();
                        b.MooMoo.sendPacket = function(e) {
                            let r = Array.prototype.slice.call(arguments, 1);
                            let n = (0, M.default)([ e, r ]);
                            t.send(n);
                        };
                        if (b.MooMoo.ws.readyState !== 1) return true;
                        if (!P) {
                            m.default.startInterval();
                            P = true;
                            h.default.initialize();
                        }
                        try {
                            let e = b.MooMoo.msgpack.decode(r[0]);
                            let [t, [...n]] = e;
                            let M = (0, y.default)(t, n);
                            if (!M) return true;
                        } catch (e) {}
                        return Reflect.apply(e, t, r);
                    }
                });
                let e = Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage").set;
                Object.defineProperty(WebSocket.prototype, "onmessage", {
                    set: function(r) {
                        t.onmessagecallback = r;
                        e.call(this, (function(e) {
                            return n(this, void 0, void 0, (function*() {
                                let r = b.MooMoo.PacketInterceptor;
                                let n = e.data;
                                n = r.applyServerCallbacks(n);
                                let M = b.MooMoo.msgpack.decode(new Uint8Array(n));
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
        7703: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
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
        2580: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function addAlliance(e) {
                n.MooMoo.emit("addAlliance", e);
                n.MooMoo.emit("addalliance", e);
                n.MooMoo.emit("ac", e);
            }
            t["default"] = addAlliance;
        },
        9651: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(9347);
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
                n.MooMoo.emit("2", e);
            }
            t["default"] = addPlayer;
        },
        8641: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function addProjectile(e) {
                n.MooMoo.emit("addProjectile", e);
                n.MooMoo.emit("addprojectile", e);
                n.MooMoo.emit("18", e);
            }
            t["default"] = addProjectile;
        },
        6401: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function allianceNotification(e) {
                n.MooMoo.emit("allianceNotification", e);
                n.MooMoo.emit("alliancenotification", e);
                n.MooMoo.emit("an", e);
            }
            t["default"] = allianceNotification;
        },
        6181: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function animeAI(e) {
                let t = e[0];
                n.MooMoo.emit("animateAI", e);
                n.MooMoo.emit("animateAi", e);
                n.MooMoo.emit("animateai", e);
                n.MooMoo.emit("aa", t);
            }
            t["default"] = animeAI;
        },
        6207: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function deleteAlliance(e) {
                n.MooMoo.emit("deleteAlliance", e);
                n.MooMoo.emit("deletealliance", e);
            }
            t["default"] = deleteAlliance;
        },
        9523: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function disconnect() {
                n.MooMoo.emit("disconnect", n.MooMoo.ws);
            }
            t["default"] = disconnect;
        },
        2034: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function gatherAnimation(e) {
                n.MooMoo.emit("gatherAnimation", e);
                n.MooMoo.emit("gatheranimation", e);
            }
            t["default"] = gatherAnimation;
        },
        8280: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function killObject(e) {
                let t = e[0];
                n.MooMoo.GameObjectManager.removeObjectBySid(t);
                n.MooMoo.emit("killObject", e);
                n.MooMoo.emit("killobject", e);
                n.MooMoo.emit("12", t);
            }
            t["default"] = killObject;
        },
        7954: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function killObjects(e) {
                let t = e[0];
                n.MooMoo.GameObjectManager.removeObjectsByOwnerSid(t);
                n.MooMoo.emit("killObjects", e);
                n.MooMoo.emit("killobjects", e);
                n.MooMoo.emit("13", e);
            }
            t["default"] = killObjects;
        },
        1822: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function killPlayer(e) {
                n.MooMoo.emit("killPlayer", e);
                n.MooMoo.emit("killplayer", e);
                n.MooMoo.emit("11", e);
            }
            t["default"] = killPlayer;
        },
        9773: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(627);
            function loadAI(e) {
                if (e) {
                    let t = (0, M.default)(e, 7);
                    n.MooMoo.emit("loadAI", e);
                    n.MooMoo.emit("loadAi", e);
                    n.MooMoo.emit("loadaI", e);
                    n.MooMoo.emit("a", e);
                }
            }
            t["default"] = loadAI;
        },
        5393: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(627);
            const m = r(7809);
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
                n.MooMoo.emit("6", e);
            }
            t["default"] = loadGameObject;
        },
        8530: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function pingMap(e) {
                n.MooMoo.emit("pingMap", e);
                n.MooMoo.emit("pingmap", e);
                n.MooMoo.emit("p", e);
            }
            t["default"] = pingMap;
        },
        1887: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function pingSocketResponse(e) {
                n.MooMoo.emit("pingSocketResponse", e);
                n.MooMoo.emit("pingsocketresponse", e);
                n.MooMoo.emit("pp", e);
            }
            t["default"] = pingSocketResponse;
        },
        4763: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function receiveChat(e) {
                n.MooMoo.emit("receiveChat", e);
                n.MooMoo.emit("receivechat", e);
                n.MooMoo.emit("ch", e);
            }
            t["default"] = receiveChat;
        },
        9254: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function remProjectile(e) {
                n.MooMoo.emit("remProjectile", e);
                n.MooMoo.emit("remprojectile", e);
                n.MooMoo.emit("19", e);
            }
            t["default"] = remProjectile;
        },
        156: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function removePlayer(e) {
                let t = e[0];
                n.MooMoo.GamePlayerManager.removePlayerById(t);
                n.MooMoo.debug("Player " + t + " has left the game.");
                n.MooMoo.emit("removePlayer", e);
                n.MooMoo.emit("removeplayer", e);
                n.MooMoo.emit("4", e);
            }
            t["default"] = removePlayer;
        },
        6933: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function serverShutdownNotice(e) {
                n.MooMoo.emit("serverShutdownNotice", e);
                n.MooMoo.emit("servershutdownnotice", e);
                n.MooMoo.emit("20", e);
            }
            t["default"] = serverShutdownNotice;
        },
        1451: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function setAlliancePlayers(e) {
                n.MooMoo.emit("setAlliancePlayers", e);
                n.MooMoo.emit("setallianceplayers", e);
                n.MooMoo.emit("sa", e);
            }
            t["default"] = setAlliancePlayers;
        },
        1201: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(6157);
            const M = r(9347);
            const m = r(366);
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
        2530: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function setPlayerTeam(e) {
                n.MooMoo.emit("setPlayerTeam", e);
                n.MooMoo.emit("setplayerteam", e);
                n.MooMoo.emit("st", e);
            }
            t["default"] = setPlayerTeam;
        },
        8353: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            const M = r(8595);
            const m = r(4218);
            const p = r(3044);
            const y = r(420);
            const h = r(8101);
            const b = r(5088);
            const P = r(3296);
            const v = r(3269);
            const k = r(8106);
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
                n.MooMoo.vars.gameLoaded = true;
                n.MooMoo.emit("gameLoad");
                n.MooMoo.emit("setupGame", e);
                n.MooMoo.emit("setupgame", e);
                n.MooMoo.emit("1", e);
                let r = n.MooMoo.didInit;
                if (!r) {
                    if (n.MooMoo.onGameLoad) n.MooMoo.onGameLoad();
                    n.MooMoo.didInit = true;
                }
            }
            t["default"] = setupGame;
        },
        5701: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function shootTurret(e) {
                n.MooMoo.emit("shootTurret", e);
                n.MooMoo.emit("shootturret", e);
                n.MooMoo.emit("sp", e);
            }
            t["default"] = shootTurret;
        },
        5718: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function showText(e) {
                n.MooMoo.emit("showText", e);
                n.MooMoo.emit("showtext", e);
                n.MooMoo.emit("t", e);
            }
            t["default"] = showText;
        },
        1836: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateAge(e) {
                n.MooMoo.emit("updateAge", e);
                n.MooMoo.emit("updateage", e);
                n.MooMoo.emit("15", e);
            }
            t["default"] = updateAge;
        },
        9289: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateHealth(e) {
                let t = e[0];
                let r = e[1];
                let M = n.MooMoo.GamePlayerManager.getPlayerBySid(t);
                if (M) {
                    M.health = r;
                }
                n.MooMoo.emit("updateHealth", e);
                n.MooMoo.emit("updatehealth", e);
                n.MooMoo.emit("h", e);
            }
            t["default"] = updateHealth;
        },
        657: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateItemCounts(e) {
                n.MooMoo.emit("updateItemCounts", e);
                n.MooMoo.emit("updateitemcounts", e);
                n.MooMoo.emit("14", e);
            }
            t["default"] = updateItemCounts;
        },
        9971: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateItems(e) {
                n.MooMoo.emit("updateItems", e);
                n.MooMoo.emit("updateitems", e);
                n.MooMoo.emit("17", e);
            }
            t["default"] = updateItems;
        },
        2862: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateLeaderboard(e) {
                let t = e[0];
                n.MooMoo.LeaderboardManager.updateLeaderboard(t);
                n.MooMoo.emit("updateLeaderboard", e);
                n.MooMoo.emit("updateleaderboard", e);
                n.MooMoo.emit("5", e);
            }
            t["default"] = updateLeaderboard;
        },
        1487: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateMinimap(e) {
                n.MooMoo.emit("updateMinimap", e);
                n.MooMoo.emit("updateminimap", e);
                n.MooMoo.emit("mm", e);
            }
            t["default"] = updateMinimap;
        },
        7864: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updatePlayerValue(e) {
                let t = e[0];
                let r = e[1];
                let M = n.MooMoo.myPlayer.resources;
                M[t] = r;
                n.MooMoo.myPlayer.resources = M;
                n.MooMoo.emit("updatePlayerValue", e);
                n.MooMoo.emit("updateplayervalue", e);
                n.MooMoo.emit("9", e);
            }
            t["default"] = updatePlayerValue;
        },
        8351: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.updateHookPosition = void 0;
            const n = r(627);
            const M = r(3748);
            const m = r(366);
            const p = r(9347);
            const y = r(7809);
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
                        Object.assign(m.MooMoo.myPlayer, t);
                    }
                    (0, M.default)();
                }));
                m.MooMoo.emit("updatePlayers", t);
                m.MooMoo.emit("updateplayers", t);
                m.MooMoo.emit("33", t);
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
        2798: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateStoreItems(e) {
                n.MooMoo.emit("updateStoreItems", e);
                n.MooMoo.emit("updatestoreitems", e);
                n.MooMoo.emit("us", e);
            }
            t["default"] = updateStoreItems;
        },
        3226: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function updateUpgrades(e) {
                n.MooMoo.emit("updateUpgrades", e);
                n.MooMoo.emit("updateupgrades", e);
                n.MooMoo.emit("16", e);
            }
            t["default"] = updateUpgrades;
        },
        2656: (e, t, r) => {
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            const n = r(366);
            function wiggleGameObject(e) {
                n.MooMoo.emit("wiggleGameObject", e);
                n.MooMoo.emit("wigglegameobject", e);
                n.MooMoo.emit("8", e);
            }
            t["default"] = wiggleGameObject;
        },
        2298: (e, t, r) => {
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
        112: (e, t, r) => {
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
    var r = __webpack_require__(366);
})();

}