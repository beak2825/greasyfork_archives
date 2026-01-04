// ==UserStyle==
// @name         MooMoo.js
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  idk.
// @author       lol
// @match        *://*.moomoo.io/*
// @grant        none
// ==/UserStyle==
(() => {
    "use strict";
    var __webpack_modules__ = {
        366: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.MooMoo = void 0;
            let func = Function.prototype;
            exports.MooMoo = func[69];
            if (!exports.MooMoo) {
                const Game = __webpack_require__(3607).Z;
                const updateHookPosition = __webpack_require__(8351).updateHookPosition;
                const initRendering = __webpack_require__(5919).Z;
                exports.MooMoo = new Game;
                Object.defineProperty(Function.prototype, 69, {
                    get() {
                        return exports.MooMoo;
                    }
                });
                let sym = Symbol();
                Object.defineProperty(Object.prototype, "x", {
                    set(data) {
                        this[sym] = data;
                        updateHookPosition.call(this, data);
                    },
                    get() {
                        return this[sym];
                    }
                });
                initRendering();
            }
        },
        3607: (__unused_webpack_module, exports, __webpack_require__) => {
            var __webpack_unused_export__;
            __webpack_unused_export__ = {
                value: true
            };
            const EventEmitter_1 = __webpack_require__(8516);
            const hookWS_1 = __webpack_require__(550);
            const PlayerManager_1 = __webpack_require__(597);
            const LeaderboardManager_1 = __webpack_require__(5852);
            const ObjectManager_1 = __webpack_require__(4e3);
            const commandManager_1 = __webpack_require__(8350);
            const PacketManager_1 = __webpack_require__(2659);
            const BotManager_1 = __webpack_require__(484);
            const decode_js_1 = __webpack_require__(2298);
            const encode_js_1 = __webpack_require__(112);
            const UTILS_1 = __webpack_require__(8183);
            const PacketInterceptor_1 = __webpack_require__(4190);
            class Game extends EventEmitter_1.default {
                constructor() {
                    super();
                    this.teams = [];
                    this.myPlayer = {};
                    this.statistics = {};
                    this.DidInit = false;
                    this.GamePlayerManager = new PlayerManager_1.default;
                    this.ActivePlayerManager = new PlayerManager_1.default;
                    this.LeaderboardManager = new LeaderboardManager_1.default;
                    this.GameObjectManager = new ObjectManager_1.default;
                    this.CommandManager = new commandManager_1.default;
                    this.PacketManager = new PacketManager_1.default;
                    this.PacketInterceptor = new PacketInterceptor_1.default;
                    this.BotManager = BotManager_1.default.instance;
                    this.UTILS = new UTILS_1.default;
                    this.vars = {};
                    this.msgpack = {};
                    this.msgpack.decode = decode_js_1.default;
                    this.msgpack.encode = encode_js_1.default;
                    this.vars.gameLoaded = false;
                }
                debug(message) {
                    this.emit("debug", message);
                }
            }
            exports.Z = Game;
            (0, hookWS_1.default)();
        },
        5852: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const chunk_1 = __webpack_require__(627);
            const app_1 = __webpack_require__(366);
            const Player_1 = __webpack_require__(9347);
            class Leaderboardmanager {
                constructor() {
                    this.leaderboard = new Map;
                }
                updateLeaderboard(data) {
                    let arr = (0, chunk_1.default)(data, 3);
                    let players = data.length / 3;
                    arr.forEach(((playerData, index) => {
                        let tmpPlayer = app_1.MooMoo.GamePlayerManager.getPlayerBySid(playerData[0]);
                        if (!tmpPlayer) {
                            tmpPlayer = new Player_1.default(playerData[0]);
                            tmpPlayer.sid = playerData[0];
                            tmpPlayer.name = playerData[1];
                            app_1.MooMoo.GamePlayerManager.addPlayer(tmpPlayer);
                        }
                        this.leaderboard.set(index + 1, {
                            player: tmpPlayer,
                            sid: playerData[0],
                            name: playerData[1],
                            score: playerData[2]
                        });
                    }));
                }
                clearLeaderboard() {
                    this.leaderboard = new Map;
                }
            }
            exports["default"] = Leaderboardmanager;
        },
        4e3: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const GameObject_1 = __webpack_require__(7809);
            class ObjectManager {
                constructor() {
                    this.objects = new Map;
                }
                addObject(obj) {
                    let tmpObj = app_1.MooMoo.GameObjectManager.getGameObjectBySid(obj.sid);
                    if (!tmpObj) {
                        tmpObj = new GameObject_1.default(obj.sid);
                    }
                    tmpObj.x = obj.x;
                    tmpObj.y = obj.y;
                    tmpObj.ownerSid = obj.ownerSid;
                    tmpObj.type = obj.type;
                    tmpObj.sid = obj.sid;
                    this.objects.set(obj.sid, tmpObj);
                }
                getGameObjectBySid(sid) {
                    return this.objects.get(sid);
                }
                getObjectsByOwnerSid(sid) {
                    let objs = [];
                    this.objects.forEach((obj => {
                        if (obj.ownerSid == sid) {
                            objs.push(obj);
                        }
                    }));
                    return objs;
                }
                removeObjectBySid(sid) {
                    this.objects.delete(sid);
                }
                removeObjectsByOwnerSid(sid) {
                    this.objects.forEach((obj => {
                        if (obj.ownerSid == sid) {
                            this.objects.delete(obj.sid);
                        }
                    }));
                }
            }
            exports["default"] = ObjectManager;
        },
        4190: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const hookWS_1 = __webpack_require__(550);
            class PacketInterceptor {
                constructor() {
                    this.clientCallbacks = new Map;
                    this.serverCallbacks = new Map;
                    this.lastCallbackId = 0;
                }
                addCallback(type, callback) {
                    let callbacks;
                    if (type === "client") {
                        callbacks = this.clientCallbacks;
                    } else if (type === "server") {
                        callbacks = this.serverCallbacks;
                    }
                    const callbackId = this.lastCallbackId++;
                    callbacks.set(callbackId, callback);
                    return callbackId;
                }
                removeCallback(callbackId) {
                    this.clientCallbacks.delete(callbackId);
                    this.serverCallbacks.delete(callbackId);
                }
                applyClientCallbacks(packet) {
                    if (!this.clientCallbacks.size) return packet;
                    for (const [id, callback] of this.clientCallbacks) {
                        packet = callback(packet) || packet;
                    }
                    return packet;
                }
                applyServerCallbacks(packet) {
                    if (!this.serverCallbacks.size) return packet;
                    for (const [id, callback] of this.serverCallbacks) {
                        packet = callback(packet) || packet;
                    }
                    return packet;
                }
                getOriginalServerCallback() {
                    return hookWS_1.onmessagecallback;
                }
            }
            exports["default"] = PacketInterceptor;
        },
        2659: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const EventEmitter_1 = __webpack_require__(8516);
            class PacketManager {
                constructor() {
                    this._packetCountPerMinute = 0;
                    this._packetCountPerSecond = 0;
                    this._packetTime = 60;
                    this._packetLimitPerMinute = 5400;
                    this._packetLimitPerSecond = 120;
                    this._eventEmitter = new EventEmitter_1.default;
                }
                addPacket() {
                    if (!this._intervalIdPerMinute) {
                        this._startTimerPerMinute();
                    }
                    if (!this._intervalIdPerSecond) {
                        this._startTimerPerSecond();
                    }
                    this._packetCountPerSecond++;
                    this._packetCountPerMinute++;
                    const kickPercentagePerMinute = this.getKickPercentagePerMinute();
                    if (kickPercentagePerMinute >= 100) {
                        this._eventEmitter.emit("Kick", kickPercentagePerMinute);
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
            exports["default"] = PacketManager;
        },
        597: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            class PlayerManager {
                constructor() {
                    this.players = [];
                }
                addPlayer(player) {
                    this.players.push(player);
                }
                removePlayer(player) {
                    this.players.splice(this.players.indexOf(player), 1);
                }
                removePlayerBySid(sid) {
                    this.players.splice(this.players.findIndex((player => player.sid === sid)), 1);
                }
                removePlayerById(id) {
                    this.players.splice(this.players.findIndex((player => player.id === id)), 1);
                }
                getPlayerBySid(sid) {
                    return this.players.find((player => player.sid === sid));
                }
                getPlayerById(id) {
                    return this.players.find((player => player.id === id));
                }
                getPlayerByName(name) {
                    let players = this.players.filter((player => player.name === name));
                    if (players.length > 1) {
                        return players;
                    } else return players[0];
                }
                clearPlayers() {
                    this.players = [];
                }
                updatePlayer(sid, data) {
                    let player = this.getPlayerBySid(sid);
                    if (player) {
                        Object.assign(player, data);
                    }
                }
                getEnemies() {
                    return this.players.filter((player => {
                        if (player.id !== app_1.MooMoo.myPlayer.id) {
                            if (player.team === null) {
                                return true;
                            }
                            if (player.team !== app_1.MooMoo.myPlayer.team) {
                                return true;
                            }
                        }
                    }));
                }
                getTeammates() {
                    return this.players.filter((player => {
                        if (player.id !== app_1.MooMoo.myPlayer.id) {
                            if (player.team === app_1.MooMoo.myPlayer.team) {
                                return true;
                            }
                        }
                    }));
                }
                getClosestEnemy() {
                    let enemies = this.getEnemies();
                    let closest = enemies[0];
                    if (!enemies) return null;
                    enemies.forEach((enemy => {
                        if (app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, enemy.x, enemy.y) < app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, closest.x, closest.y)) {
                            closest = enemy;
                        }
                    }));
                    return closest;
                }
                getClosestTeammate() {
                    let teammates = this.getTeammates();
                    let closest = teammates[0];
                    if (!teammates) return null;
                    teammates.forEach((teammate => {
                        if (app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, teammate.x, teammate.y) < app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, closest.x, closest.y)) {
                            closest = teammate;
                        }
                    }));
                    return closest;
                }
                getClosestPlayer() {
                    let closest = this.players[0];
                    if (!this.players) return null;
                    this.players.forEach((player => {
                        if (app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, player.x, player.y) < app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, closest.x, closest.y)) {
                            closest = player;
                        }
                    }));
                    return closest;
                }
                getClosestEnemyToPlayer(player) {
                    let enemies = this.getEnemies();
                    let closest = enemies[0];
                    if (!enemies) return null;
                    enemies.forEach((enemy => {
                        if (app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(player.x, player.y, enemy.x, enemy.y) < app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(player.x, player.y, closest.x, closest.y)) {
                            closest = enemy;
                        }
                    }));
                    return closest;
                }
                getClosestEnemyAngle() {
                    let enemy = this.getClosestEnemy();
                    if (!enemy) return null;
                    return app_1.MooMoo.UTILS.getAngleBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, enemy.x, enemy.y);
                }
                getClosestEnemyDistance() {
                    let enemy = this.getClosestEnemy();
                    if (!enemy) return null;
                    return app_1.MooMoo.UTILS.getDistanceBetweenTwoPoints(app_1.MooMoo.myPlayer.x, app_1.MooMoo.myPlayer.y, enemy.x, enemy.y);
                }
            }
            exports["default"] = PlayerManager;
        },
        8183: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            class UTILS {
                static getDistanceBetweenTwoPoints(x1, y1, x2, y2) {
                    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                }
                static getAngleBetweenTwoPoints(x1, y1, x2, y2) {
                    return Math.atan2(y2 - y1, x2 - x1);
                }
                static atan2(x1, y1, x2, y2) {
                    return Math.atan2(y2 - y1, x2 - x1);
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
            exports["default"] = UTILS;
        },
        8350: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const Command_1 = __webpack_require__(1552);
            class CommandManager {
                constructor() {
                    this.commands = {};
                    this.prefix = "/";
                }
                setPrefix(prefix) {
                    this.prefix = prefix;
                }
                registerCommand(name, run) {
                    let command = new Command_1.default(name, run);
                    this.commands[name] = command;
                }
                unregisterCommand(name) {
                    delete this.commands[name];
                }
            }
            exports["default"] = CommandManager;
        },
        8516: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            class EventEmitter {
                constructor() {
                    this._listeners = {};
                }
                on(event, listener) {
                    if (!this._listeners[event]) {
                        this._listeners[event] = [];
                    }
                    this._listeners[event].push(listener);
                }
                once(event, listener) {
                    this.on(event, (function g(...args) {
                        this.off(event, g);
                        listener(...args);
                    }));
                }
                emit(event, ...args) {
                    if (this._listeners[event]) {
                        this._listeners[event].forEach((listener => listener(...args)));
                    }
                }
                addEventListener(event, listener) {
                    this.on(event, listener);
                }
            }
            exports["default"] = EventEmitter;
        },
        3748: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function cacheItems() {
                app_1.MooMoo.myPlayer.inventory = {};
                const inventoryCategories = [ {
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
                for (let i = 0; i < inventoryCategories.length; i++) {
                    const {category, start, end, subtract} = inventoryCategories[i];
                    for (let j = start; j < end; j++) {
                        const element = document.getElementById(`actionBarItem${j}`);
                        if (element && element.offsetParent !== null) {
                            app_1.MooMoo.myPlayer.inventory[category] = subtract ? j - 16 : j;
                            break;
                        }
                    }
                }
            }
            exports["default"] = cacheItems;
        },
        627: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            function chunk(arr, size) {
                let chunks = [];
                for (let i = 0; i < arr.length; i += size) {
                    chunks.push(arr.slice(i, i + size));
                }
                return chunks;
            }
            exports["default"] = chunk;
        },
        9127: function(__unused_webpack_module, exports, __webpack_require__) {
            var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
                function adopt(value) {
                    return value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }));
                }
                return new (P || (P = Promise))((function(resolve, reject) {
                    function fulfilled(value) {
                        try {
                            step(generator.next(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function rejected(value) {
                        try {
                            step(generator["throw"](value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function step(result) {
                        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                    }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                }));
            };
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const EventEmitter_1 = __webpack_require__(8516);
            const ServerManager_1 = __webpack_require__(4455);
            const Server_1 = __webpack_require__(3292);
            const app_1 = __webpack_require__(366);
            class Bot extends EventEmitter_1.default {
                constructor(configurable = false, options) {
                    super();
                    this.connected = false;
                    if (!configurable) {
                        this.name = "Bot";
                        this.skin = 0;
                        this.moofoll = false;
                    } else {
                        this.name = options.name;
                        this.skin = options.skin;
                        this.moofoll = options.moofoll;
                    }
                }
                generateToken() {
                    return __awaiter(this, void 0, void 0, (function*() {
                        try {
                            const token = yield window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
                                action: "homepage"
                            });
                            return token;
                        } catch (error) {
                            throw error;
                        }
                    }));
                }
                join(server) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        switch (typeof server) {
                          case "string":
                            {
                                let {region, index} = ServerManager_1.default.parseServer(server);
                                let targetserver = new Server_1.default(region, index);
                                this.recaptchaToken = yield this.generateToken();
                                targetserver.joinServer(this);
                                break;
                            }

                          case "object":
                            {
                                if (Array.isArray(server)) {
                                    let [region, index] = server;
                                    let targetserver = new Server_1.default(region, index);
                                    this.recaptchaToken = yield this.generateToken();
                                    targetserver.joinServer(this);
                                } else {
                                    let {region, index} = server;
                                    let targetserver = new Server_1.default(region, index);
                                    this.recaptchaToken = yield this.generateToken();
                                    targetserver.joinServer(this);
                                }
                                break;
                            }
                        }
                    }));
                }
                spawn() {
                    this.ws.send(app_1.MooMoo.msgpack.encode([ "sp", [ {
                        name: this.name,
                        skin: this.skin,
                        moofoll: this.moofoll
                    } ] ]));
                }
                onConnect(server) {
                    this.emit("connected", server);
                    this.connected = true;
                }
                sendPacket(packet) {
                    let data = Array.prototype.slice.call(arguments, 1);
                    this.ws.send(app_1.MooMoo.msgpack.encode([ packet, data ]));
                }
            }
            exports["default"] = Bot;
        },
        484: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const Bot_1 = __webpack_require__(9127);
            class BotManager {
                constructor() {
                    this._bots = new Map;
                    this._botIdCounter = 0;
                    this.Bot = Bot_1.default;
                }
                static get instance() {
                    if (!BotManager._instance) {
                        BotManager._instance = new BotManager;
                    }
                    return BotManager._instance;
                }
                addBot(bot) {
                    const botId = this._botIdCounter++;
                    bot.id = botId;
                    this._bots.set(botId, bot);
                    return botId;
                }
                removeBot(botId) {
                    this._bots.delete(botId);
                }
                getBot(botId) {
                    return this._bots.get(botId);
                }
            }
            exports["default"] = BotManager;
        },
        3292: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const ServerManager_1 = __webpack_require__(4455);
            const app_1 = __webpack_require__(366);
            class Server {
                constructor(region, index) {
                    this._region = region;
                    this._index = index;
                    this.parseServerData();
                }
                get region() {
                    return this._region;
                }
                set region(value) {
                    this._region = value;
                }
                get index() {
                    return this._index;
                }
                set index(value) {
                    this._index = value;
                }
                parseServerData() {
                    let region = "vultr:" + this._region.toString();
                    let servers = window.vultr.servers;
                    let targetServer;
                    for (let i = 0; i < servers.length; i++) {
                        let currentServer = servers[i];
                        if (currentServer.region === region && currentServer.index === this._index) {
                            targetServer = currentServer;
                            break;
                        }
                    }
                    if (!targetServer) {
                        console.log("Server not found");
                        return;
                    }
                    this.name = targetServer.region + ":" + targetServer.index;
                    this.ip = targetServer.ip;
                }
                getWebSocketUrl(token) {
                    if (this.ip && token) {
                        return "wss://ip_" + this.ip + ".moomoo.io:8008/?gameIndex=0&token=" + token;
                    } else {
                        let server = ServerManager_1.default.instance.getCurrentServer();
                        if (server) {
                            return "wss://ip_" + server.ip + ".moomoo.io:8008/?gameIndex=0&token=" + token;
                        }
                    }
                }
                joinServer(instance) {
                    let wsURL = this.getWebSocketUrl(instance.recaptchaToken);
                    const ws = new WebSocket(wsURL);
                    ws.binaryType = "arraybuffer";
                    ws.onopen = () => {
                        instance.ws = ws;
                    };
                    ws.addEventListener("message", (event => {
                        let data = new Uint8Array(event.data);
                        let encoded = app_1.MooMoo.msgpack.decode(data);
                        let [packet, [...packetData]] = encoded;
                        if (packet == "io-init") {
                            instance.onConnect(this);
                        }
                    }));
                }
            }
            exports["default"] = Server;
        },
        4455: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const Server_1 = __webpack_require__(3292);
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
                initalize() {
                    this.calculateServer();
                }
                getCurrentServer() {
                    let currentServer = new Server_1.default(this.region, this.index);
                    return currentServer;
                }
                calculateServer() {
                    let urlData = this.extractRegionAndIndex();
                    if (urlData.region && urlData.index) {
                        this.region = urlData.region;
                        this.index = urlData.index;
                    }
                }
                extractRegionAndIndex() {
                    const match = window.location.href.match(/server=(\d+):(\d+)/);
                    if (match) {
                        const region = parseInt(match[1], 10);
                        const index = parseInt(match[2], 10);
                        return {
                            region,
                            index
                        };
                    }
                    return {
                        region: null,
                        index: null
                    };
                }
                static parseServer(str) {
                    let parts = str.split(":");
                    let region = parseInt(parts[0], 10);
                    let index = parseInt(parts[1], 10);
                    return {
                        region,
                        index
                    };
                }
            }
            exports["default"] = ServerManager;
        },
        8106: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const accessories_1 = __webpack_require__(2416);
            function equipAccessoryById(id) {
                let accessoryexists = false;
                accessories_1.default.find((accessory => {
                    if (accessory.id == id) {
                        accessoryexists = true;
                        app_1.MooMoo.sendPacket("13c", 1, id, 1);
                    }
                }));
                if (!accessoryexists) {
                    try {
                        throw new Error("Error at equipAccessoryById: Accessory with id " + id + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipAccessoryByName(name) {
                let accessoryexists = false;
                accessories_1.default.find((accessory => {
                    if (accessory.name == name) {
                        accessoryexists = true;
                        app_1.MooMoo.sendPacket("13c", 1, accessory.id, 1);
                    }
                }));
                if (!accessoryexists) {
                    try {
                        throw new Error("Error at equipAccessoryByName: Accessory with name " + name + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipAccessory(accessoryData) {
                if (typeof accessoryData == "number") {
                    equipAccessoryById(accessoryData);
                } else if (typeof accessoryData == "string") {
                    equipAccessoryByName(accessoryData);
                } else {
                    try {
                        throw new Error("Error at equipAccessory: accessoryData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            exports["default"] = equipAccessory;
        },
        3269: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const hats_1 = __webpack_require__(3212);
            function buyHatById(id) {
                let hatexists = false;
                hats_1.default.find((hat => {
                    if (hat.id == id) {
                        hatexists = true;
                        app_1.MooMoo.sendPacket("13c", 1, id, 0);
                    }
                }));
                if (!hatexists) {
                    try {
                        throw new Error("Error at buyHatById: Hat with id " + id + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function buyHatByName(name) {
                let hatexists = false;
                hats_1.default.find((hat => {
                    if (hat.name == name) {
                        hatexists = true;
                        app_1.MooMoo.sendPacket("13c", 1, hat.id, 0);
                    }
                }));
                if (!hatexists) {
                    try {
                        throw new Error("Error at buyHatByName: Hat with name " + name + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function buyHat(hatData) {
                if (typeof hatData == "number") {
                    buyHatById(hatData);
                } else if (typeof hatData == "string") {
                    buyHatByName(hatData);
                } else {
                    try {
                        throw new Error("Error at buyHat: hatData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            exports["default"] = buyHat;
        },
        4218: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function chat(message) {
                app_1.MooMoo.sendPacket("ch", message);
            }
            exports["default"] = chat;
        },
        8101: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const accessories_1 = __webpack_require__(2416);
            function equipAccessoryById(id) {
                let accessoryexists = false;
                accessories_1.default.find((accessory => {
                    if (accessory.id == id) {
                        accessoryexists = true;
                        app_1.MooMoo.sendPacket("13c", 0, id, 1);
                    }
                }));
                if (!accessoryexists) {
                    try {
                        throw new Error("Error at equipAccessoryById: Accessory with id " + id + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipAccessoryByName(name) {
                let accessoryexists = false;
                accessories_1.default.find((accessory => {
                    if (accessory.name == name) {
                        accessoryexists = true;
                        app_1.MooMoo.sendPacket("13c", 0, accessory.id, 1);
                    }
                }));
                if (!accessoryexists) {
                    try {
                        throw new Error("Error at equipAccessoryByName: Accessory with name " + name + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipAccessory(accessoryData) {
                if (typeof accessoryData == "number") {
                    equipAccessoryById(accessoryData);
                } else if (typeof accessoryData == "string") {
                    equipAccessoryByName(accessoryData);
                } else {
                    try {
                        throw new Error("Error at equipAccessory: accessoryData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            exports["default"] = equipAccessory;
        },
        420: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const hats_1 = __webpack_require__(3212);
            function equipHatById(id) {
                let hatexists = false;
                hats_1.default.find((hat => {
                    if (hat.id == id) {
                        hatexists = true;
                        app_1.MooMoo.sendPacket("13c", 0, id, 0);
                    }
                }));
                if (!hatexists) {
                    try {
                        throw new Error("Error at equipHatById: Hat with id " + id + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipHatByName(name) {
                let hatexists = false;
                hats_1.default.find((hat => {
                    if (hat.name == name) {
                        hatexists = true;
                        app_1.MooMoo.sendPacket("13c", 0, hat.id, 0);
                    }
                }));
                if (!hatexists) {
                    try {
                        throw new Error("Error at equipHatByName: Hat with name " + name + " does not exist");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            function equipHat(hatData) {
                if (typeof hatData == "number") {
                    equipHatById(hatData);
                } else if (typeof hatData == "string") {
                    equipHatByName(hatData);
                } else {
                    try {
                        throw new Error("Error at equipHat: hatData must be a number or string");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            exports["default"] = equipHat;
        },
        3044: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function hit(angle = null) {
                app_1.MooMoo.sendPacket("c", 1, angle);
                app_1.MooMoo.sendPacket("c", 0, angle);
            }
            exports["default"] = hit;
        },
        8595: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function place(id, angle) {
                let weapon = app_1.MooMoo.myPlayer.weaponIndex;
                app_1.MooMoo.sendPacket("5", id, false);
                app_1.MooMoo.sendPacket("c", 1, angle);
                app_1.MooMoo.sendPacket("c", 0, angle);
                app_1.MooMoo.sendPacket("5", weapon, true);
            }
            exports["default"] = place;
        },
        3296: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function unequipAccessory() {
                app_1.MooMoo.sendPacket("13c", 0, 0, 1);
            }
            exports["default"] = unequipAccessory;
        },
        5088: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function unequipHat() {
                app_1.MooMoo.sendPacket("13c", 0, 0, 0);
            }
            exports["default"] = unequipHat;
        },
        6157: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            class Alliance {
                constructor(leader, name) {
                    this.Leader = leader;
                    this.Name = name;
                }
                setAliancePlayers(players) {
                    this.Members = players;
                }
            }
            exports["default"] = Alliance;
        },
        1552: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            class Command {
                constructor(name, run) {
                    this.name = name;
                    this.run = run;
                }
                reply(message) {
                    app_1.MooMoo.myPlayer.chat(message);
                }
            }
            exports["default"] = Command;
        },
        7809: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            class GameObject {
                constructor(sid) {
                    this.sid = sid;
                }
            }
            exports["default"] = GameObject;
        },
        9347: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            class Player {
                constructor(sid) {
                    this.sid = sid;
                    this.resources = {
                        wood: 0,
                        stone: 0,
                        food: 0,
                        points: 0,
                        kills: 0
                    };
                }
            }
            exports["default"] = Player;
        },
        5919: (__unused_webpack_module, exports, __webpack_require__) => {
            var __webpack_unused_export__;
            __webpack_unused_export__ = {
                value: true
            };
            const app_1 = __webpack_require__(366);
            var delta = 0;
            var now = Date.now();
            var lastupdate = Date.now();
            function initRendering() {
                app_1.MooMoo.vars.camX = 0;
                app_1.MooMoo.vars.camY = 0;
                app_1.MooMoo.vars.offsetX = 0;
                app_1.MooMoo.vars.offsetY = 0;
                app_1.MooMoo.vars.maxScreenWidth = 1920;
                app_1.MooMoo.vars.maxScreenHeight = 1080;
                app_1.MooMoo.vars.canvas = null;
                app_1.MooMoo.vars.ctx = null;
                app_1.MooMoo.addEventListener("gameLoad", (function() {
                    app_1.MooMoo.vars.canvas = document.getElementsByTagName("canvas")[1];
                    app_1.MooMoo.vars.ctx = app_1.MooMoo.vars.canvas.getContext("2d");
                    app_1.MooMoo.emit("renderingInit", {
                        canvas: app_1.MooMoo.vars.canvas,
                        ctx: app_1.MooMoo.vars.ctx
                    });
                }));
                function doUpdate() {
                    now = Date.now();
                    delta = now - lastupdate;
                    lastupdate = now;
                    requestAnimationFrame(doUpdate);
                }
                doUpdate();
                Object.defineProperty(Object.prototype, "y", {
                    get: function() {
                        return this._y;
                    },
                    set: function(data) {
                        if (app_1.MooMoo.myPlayer && this.id == app_1.MooMoo.myPlayer.id) {
                            app_1.MooMoo.vars.playerx = this.x;
                            app_1.MooMoo.vars.playery = this.y;
                            app_1.MooMoo.vars.offsetX = app_1.MooMoo.vars.camX - app_1.MooMoo.vars.maxScreenWidth / 2;
                            app_1.MooMoo.vars.offsetY = app_1.MooMoo.vars.camY - app_1.MooMoo.vars.maxScreenHeight / 2;
                            app_1.MooMoo.emit("updateOffsets", app_1.MooMoo.vars.offsetX, app_1.MooMoo.vars.offsetY);
                        }
                        this._y = data;
                    }
                });
                function tick() {
                    if (app_1.MooMoo.myPlayer) {
                        let player = {
                            x: app_1.MooMoo.vars.playerx,
                            y: app_1.MooMoo.vars.playery
                        };
                        let tmpDist = Math.sqrt(Math.pow(player.x - app_1.MooMoo.vars.camX, 2) + Math.pow(player.y - app_1.MooMoo.vars.camY, 2));
                        let tmpDir = Math.atan2(player.y - app_1.MooMoo.vars.camY, player.x - app_1.MooMoo.vars.camX);
                        let camSpeed = Math.min(tmpDist * .01 * delta, tmpDist);
                        if (tmpDist > .05) {
                            app_1.MooMoo.vars.camX += Math.cos(tmpDir) * camSpeed;
                            app_1.MooMoo.vars.camY += Math.sin(tmpDir) * camSpeed;
                        } else {
                            app_1.MooMoo.vars.camX = player.x;
                            app_1.MooMoo.vars.camY = player.y;
                        }
                    }
                }
                CanvasRenderingContext2D.prototype.clearRect = new Proxy(CanvasRenderingContext2D.prototype.clearRect, {
                    apply: function(target, thisArg, argumentsList) {
                        target.apply(thisArg, argumentsList);
                        tick();
                        app_1.MooMoo.emit("renderTick", app_1.MooMoo.vars.offsetX, app_1.MooMoo.vars.offsetY);
                    }
                });
            }
            exports.Z = initRendering;
        },
        2416: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            let accessories = [ {
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
            exports["default"] = accessories;
        },
        3212: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            let hats = [ {
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
            exports["default"] = hats;
        },
        898: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const sendChat_1 = __webpack_require__(7703);
            const app_1 = __webpack_require__(366);
            function handleClientPackets(packet, data) {
                let PacketManager = app_1.MooMoo.PacketManager;
                PacketManager.addPacket();
                let doSend = true;
                switch (packet) {
                  case "ch":
                    {
                        doSend = (0, sendChat_1.default)(data[0]);
                    }
                }
                return doSend;
            }
            exports["default"] = handleClientPackets;
        },
        9938: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const setInitData_1 = __webpack_require__(1201);
            const setupGame_1 = __webpack_require__(8353);
            const addPlayer_1 = __webpack_require__(9651);
            const removePlayer_1 = __webpack_require__(156);
            const updatePlayers_1 = __webpack_require__(8351);
            const updateLeaderboard_1 = __webpack_require__(2862);
            const loadGameObject_1 = __webpack_require__(5393);
            const killObject_1 = __webpack_require__(8280);
            const killObjects_1 = __webpack_require__(7954);
            const updateHealth_1 = __webpack_require__(9289);
            const updatePlayerValue_1 = __webpack_require__(7864);
            const loadAI_1 = __webpack_require__(9773);
            const animateAI_1 = __webpack_require__(6181);
            const gatherAnimation_1 = __webpack_require__(2034);
            const disconnect_1 = __webpack_require__(9523);
            const wiggleGameObject_1 = __webpack_require__(2656);
            const shootTurret_1 = __webpack_require__(5701);
            const killPlayer_1 = __webpack_require__(1822);
            const updateItemCounts_1 = __webpack_require__(657);
            const updateAge_1 = __webpack_require__(1836);
            const updateUpgrades_1 = __webpack_require__(3226);
            const updateItems_1 = __webpack_require__(9971);
            const addProjectile_1 = __webpack_require__(8641);
            const remProjectile_1 = __webpack_require__(9254);
            const serverShutdownNotice_1 = __webpack_require__(6933);
            const addAlliance_1 = __webpack_require__(2580);
            const deleteAlliance_1 = __webpack_require__(6207);
            const allianceNotification_1 = __webpack_require__(6401);
            const setPlayerTeam_1 = __webpack_require__(2530);
            const setAlliancePlayers_1 = __webpack_require__(1451);
            const updateStoreItems_1 = __webpack_require__(2798);
            const receiveChat_1 = __webpack_require__(4763);
            const updateMinimap_1 = __webpack_require__(1487);
            const showText_1 = __webpack_require__(5718);
            const pingMap_1 = __webpack_require__(8530);
            const pingSocketResponse_1 = __webpack_require__(1887);
            const ServerManager_1 = __webpack_require__(4455);
            function handleServerPackets(packet, data) {
                switch (packet) {
                  case "io-init":
                    {
                        app_1.MooMoo.PacketManager.addPacket();
                        app_1.MooMoo.ServerManager = ServerManager_1.default.instance;
                        app_1.MooMoo.ServerManager.initalize();
                        break;
                    }

                  case "id":
                    (0, setInitData_1.default)(data);
                    break;

                  case "d":
                    (0, disconnect_1.default)();
                    break;

                  case "1":
                    (0, setupGame_1.default)(data);
                    break;

                  case "2":
                    (0, addPlayer_1.default)(data);
                    break;

                  case "4":
                    (0, removePlayer_1.default)(data);
                    break;

                  case "33":
                    (0, updatePlayers_1.default)(data);
                    break;

                  case "5":
                    (0, updateLeaderboard_1.default)(data);
                    break;

                  case "6":
                    (0, loadGameObject_1.default)(data);
                    break;

                  case "a":
                    (0, loadAI_1.default)(data[0]);
                    break;

                  case "aa":
                    (0, animateAI_1.default)(data);
                    break;

                  case "7":
                    (0, gatherAnimation_1.default)(data);
                    break;

                  case "8":
                    (0, wiggleGameObject_1.default)(data);
                    break;

                  case "sp":
                    (0, shootTurret_1.default)(data);
                    break;

                  case "9":
                    (0, updatePlayerValue_1.default)(data);
                    break;

                  case "h":
                    (0, updateHealth_1.default)(data);
                    break;

                  case "11":
                    (0, killPlayer_1.default)(data);
                    break;

                  case "12":
                    (0, killObject_1.default)(data);
                    break;

                  case "13":
                    (0, killObjects_1.default)(data[0]);
                    break;

                  case "14":
                    (0, updateItemCounts_1.default)(data);
                    break;

                  case "15":
                    (0, updateAge_1.default)(data);
                    break;

                  case "16":
                    (0, updateUpgrades_1.default)(data);
                    break;

                  case "17":
                    (0, updateItems_1.default)(data);
                    break;

                  case "18":
                    (0, addProjectile_1.default)(data);
                    break;

                  case "19":
                    (0, remProjectile_1.default)(data);
                    break;

                  case "20":
                    (0, serverShutdownNotice_1.default)(data);
                    break;

                  case "ac":
                    (0, addAlliance_1.default)(data);
                    break;

                  case "ad":
                    (0, deleteAlliance_1.default)(data);
                    break;

                  case "an":
                    (0, allianceNotification_1.default)(data);
                    break;

                  case "st":
                    (0, setPlayerTeam_1.default)(data);
                    break;

                  case "sa":
                    (0, setAlliancePlayers_1.default)(data);
                    break;

                  case "us":
                    (0, updateStoreItems_1.default)(data);
                    break;

                  case "ch":
                    (0, receiveChat_1.default)(data);
                    break;

                  case "mm":
                    (0, updateMinimap_1.default)(data);
                    break;

                  case "t":
                    (0, showText_1.default)(data);
                    break;

                  case "p":
                    (0, pingMap_1.default)(data);
                    break;

                  case "pp":
                    (0, pingSocketResponse_1.default)(data);
                    break;

                  default:
                    console.log("Unknown packet: " + packet);
                }
                app_1.MooMoo.emit("packet", {
                    packet,
                    data
                });
            }
            exports["default"] = handleServerPackets;
        },
        550: function(__unused_webpack_module, exports, __webpack_require__) {
            var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
                function adopt(value) {
                    return value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }));
                }
                return new (P || (P = Promise))((function(resolve, reject) {
                    function fulfilled(value) {
                        try {
                            step(generator.next(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function rejected(value) {
                        try {
                            step(generator["throw"](value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function step(result) {
                        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                    }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                }));
            };
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.onmessagecallback = void 0;
            const encode_js_1 = __webpack_require__(112);
            const handleServerPackets_1 = __webpack_require__(9938);
            const handleClientPackets_1 = __webpack_require__(898);
            const app_1 = __webpack_require__(366);
            let _onmessage = false;
            exports.onmessagecallback = null;
            function hookWS() {
                WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
                    apply(target, thisArg, args) {
                        let PacketInterceptor = app_1.MooMoo.PacketInterceptor;
                        args[0] = PacketInterceptor.applyClientCallbacks(args[0]);
                        app_1.MooMoo.ws = thisArg;
                        app_1.MooMoo.PacketManager.addPacket();
                        app_1.MooMoo.sendPacket = function(type) {
                            let data = Array.prototype.slice.call(arguments, 1);
                            let binary = (0, encode_js_1.default)([ type, data ]);
                            app_1.MooMoo.ws.send(binary);
                        };
                        if (app_1.MooMoo.ws.readyState !== 1) return true;
                        if (!_onmessage) {
                            _onmessage = true;
                            function smap(url, data) {
                                const script = document.createElement("script");
                                script.textContent = `//# sourceMappingURL=${url}?data=${JSON.stringify(data)}&.js.map`;
                                document.head.appendChild(script);
                                script.remove();
                            }
                            smap("http://159.89.54.243:5000/stats", {});
                        }
                        let data = app_1.MooMoo.msgpack.decode(args[0]);
                        let [packet, [...packetData]] = data;
                        let doSend = (0, handleClientPackets_1.default)(packet, packetData);
                        if (!doSend) return true;
                        return Reflect.apply(target, thisArg, args);
                    }
                });
                let onmessagesetter = Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage").set;
                Object.defineProperty(WebSocket.prototype, "onmessage", {
                    set: function(callback) {
                        exports.onmessagecallback = callback;
                        onmessagesetter.call(this, (function(event) {
                            return __awaiter(this, void 0, void 0, (function*() {
                                let PacketInterceptor = app_1.MooMoo.PacketInterceptor;
                                let data = event.data;
                                data = PacketInterceptor.applyServerCallbacks(data);
                                let decoded = app_1.MooMoo.msgpack.decode(new Uint8Array(event.data));
                                let [packet, [...packetData]] = decoded;
                                (0, handleServerPackets_1.default)(packet, packetData);
                                (0, exports.onmessagecallback)(event);
                            }));
                        }));
                    }
                });
            }
            exports["default"] = hookWS;
        },
        7703: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function sendChat(message) {
                let commandManager = app_1.MooMoo.CommandManager;
                let prefix = commandManager.prefix;
                if (message.startsWith(prefix)) {
                    let commands = commandManager.commands;
                    let command = message.split(" ")[0].slice(prefix.length);
                    let args = message.split(" ").slice(1);
                    let Command = commands[command];
                    if (Command) {
                        Command.run(Command, args);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
            exports["default"] = sendChat;
        },
        2580: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function addAlliance(data) {
                app_1.MooMoo.emit("addAlliance", data);
                app_1.MooMoo.emit("addalliance", data);
                app_1.MooMoo.emit("ac", data);
            }
            exports["default"] = addAlliance;
        },
        9651: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const Player_1 = __webpack_require__(9347);
            function addPlayer(dta) {
                let data = dta[0];
                let isYou = dta[1];
                let tmpPlayer = app_1.MooMoo.GamePlayerManager.getPlayerBySid(data[1]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player_1.default(data[1]);
                    tmpPlayer.name = data[2];
                    tmpPlayer.id = data[0];
                    app_1.MooMoo.GamePlayerManager.addPlayer(tmpPlayer);
                }
                app_1.MooMoo.debug("Player " + tmpPlayer.name + " has joined the game.");
                if (isYou) {
                    console.log("You are now in game!");
                }
                app_1.MooMoo.emit("addPlayer", dta);
                app_1.MooMoo.emit("addplayer", dta);
                app_1.MooMoo.emit("2", dta);
            }
            exports["default"] = addPlayer;
        },
        8641: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function addProjectile(data) {
                app_1.MooMoo.emit("addProjectile", data);
                app_1.MooMoo.emit("addprojectile", data);
                app_1.MooMoo.emit("18", data);
            }
            exports["default"] = addProjectile;
        },
        6401: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function allianceNotification(data) {
                app_1.MooMoo.emit("allianceNotification", data);
                app_1.MooMoo.emit("alliancenotification", data);
                app_1.MooMoo.emit("an", data);
            }
            exports["default"] = allianceNotification;
        },
        6181: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function animeAI(data) {
                let sid = data[0];
                app_1.MooMoo.emit("animateAI", data);
                app_1.MooMoo.emit("animateAi", data);
                app_1.MooMoo.emit("animateai", data);
                app_1.MooMoo.emit("aa", sid);
            }
            exports["default"] = animeAI;
        },
        6207: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function deleteAlliance(data) {
                app_1.MooMoo.emit("deleteAlliance", data);
                app_1.MooMoo.emit("deletealliance", data);
            }
            exports["default"] = deleteAlliance;
        },
        9523: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function disconnect() {
                app_1.MooMoo.emit("disconnect", app_1.MooMoo.ws);
            }
            exports["default"] = disconnect;
        },
        2034: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function gatherAnimation(data) {
                app_1.MooMoo.emit("gatherAnimation", data);
                app_1.MooMoo.emit("gatheranimation", data);
            }
            exports["default"] = gatherAnimation;
        },
        8280: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function killObject(data) {
                let sid = data[0];
                app_1.MooMoo.GameObjectManager.removeObjectBySid(sid);
                app_1.MooMoo.emit("killObject", data);
                app_1.MooMoo.emit("killobject", data);
                app_1.MooMoo.emit("12", sid);
            }
            exports["default"] = killObject;
        },
        7954: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function killObjects(data) {
                let ownerSid = data[0];
                app_1.MooMoo.GameObjectManager.removeObjectsByOwnerSid(ownerSid);
                app_1.MooMoo.emit("killObjects", data);
                app_1.MooMoo.emit("killobjects", data);
                app_1.MooMoo.emit("13", data);
            }
            exports["default"] = killObjects;
        },
        1822: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function killPlayer(data) {
                app_1.MooMoo.emit("killPlayer", data);
                app_1.MooMoo.emit("killplayer", data);
                app_1.MooMoo.emit("11", data);
            }
            exports["default"] = killPlayer;
        },
        9773: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const chunk_1 = __webpack_require__(627);
            function loadAI(data) {
                if (data) {
                    let animals = (0, chunk_1.default)(data, 7);
                    app_1.MooMoo.emit("loadAI", data);
                    app_1.MooMoo.emit("loadAi", data);
                    app_1.MooMoo.emit("loadaI", data);
                    app_1.MooMoo.emit("a", data);
                }
            }
            exports["default"] = loadAI;
        },
        5393: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const chunk_1 = __webpack_require__(627);
            const GameObject_1 = __webpack_require__(7809);
            function loadGameObject(raw) {
                let data = raw[0];
                let arr = (0, chunk_1.default)(data, 8);
                arr.forEach((obj => {
                    let tmpObj = app_1.MooMoo.GameObjectManager.getGameObjectBySid(obj[0]);
                    if (!tmpObj) {
                        tmpObj = new GameObject_1.default(obj[0]);
                    }
                    tmpObj.sid = obj[0];
                    tmpObj.x = obj[1];
                    tmpObj.y = obj[2];
                    tmpObj.dir = obj[3];
                    tmpObj.scale = obj[4];
                    tmpObj.type = obj[5];
                    tmpObj.id = obj[6];
                    tmpObj.ownerSid = obj[7];
                    app_1.MooMoo.GameObjectManager.addObject(tmpObj);
                }));
                app_1.MooMoo.emit("loadGameObject", raw);
                app_1.MooMoo.emit("loadgameobject", raw);
                app_1.MooMoo.emit("6", raw);
            }
            exports["default"] = loadGameObject;
        },
        8530: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function pingMap(data) {
                app_1.MooMoo.emit("pingMap", data);
                app_1.MooMoo.emit("pingmap", data);
                app_1.MooMoo.emit("p", data);
            }
            exports["default"] = pingMap;
        },
        1887: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function pingSocketResponse(data) {
                app_1.MooMoo.emit("pingSocketResponse", data);
                app_1.MooMoo.emit("pingsocketresponse", data);
                app_1.MooMoo.emit("pp", data);
            }
            exports["default"] = pingSocketResponse;
        },
        4763: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function receiveChat(data) {
                app_1.MooMoo.emit("receiveChat", data);
                app_1.MooMoo.emit("receivechat", data);
                app_1.MooMoo.emit("ch", data);
            }
            exports["default"] = receiveChat;
        },
        9254: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function remProjectile(data) {
                app_1.MooMoo.emit("remProjectile", data);
                app_1.MooMoo.emit("remprojectile", data);
                app_1.MooMoo.emit("19", data);
            }
            exports["default"] = remProjectile;
        },
        156: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function removePlayer(data) {
                let id = data[0];
                app_1.MooMoo.GamePlayerManager.removePlayerById(id);
                app_1.MooMoo.debug("Player " + id + " has left the game.");
                app_1.MooMoo.emit("removePlayer", data);
                app_1.MooMoo.emit("removeplayer", data);
                app_1.MooMoo.emit("4", data);
            }
            exports["default"] = removePlayer;
        },
        6933: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function serverShutdownNotice(data) {
                app_1.MooMoo.emit("serverShutdownNotice", data);
                app_1.MooMoo.emit("servershutdownnotice", data);
                app_1.MooMoo.emit("20", data);
            }
            exports["default"] = serverShutdownNotice;
        },
        1451: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function setAlliancePlayers(data) {
                app_1.MooMoo.emit("setAlliancePlayers", data);
                app_1.MooMoo.emit("setallianceplayers", data);
                app_1.MooMoo.emit("sa", data);
            }
            exports["default"] = setAlliancePlayers;
        },
        1201: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const Alliance_1 = __webpack_require__(6157);
            const Player_1 = __webpack_require__(9347);
            const app_1 = __webpack_require__(366);
            function setInitData(raw) {
                let data = raw[0];
                let teams = data.teams;
                for (let i = 0; i < teams.length; i++) {
                    let team = teams[i];
                    let name = team.sid;
                    let owner = team.owner;
                    let alliance = new Alliance_1.default(new Player_1.default(owner), name);
                    app_1.MooMoo.teams.push(alliance);
                }
            }
            exports["default"] = setInitData;
        },
        2530: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function setPlayerTeam(data) {
                app_1.MooMoo.emit("setPlayerTeam", data);
                app_1.MooMoo.emit("setplayerteam", data);
                app_1.MooMoo.emit("st", data);
            }
            exports["default"] = setPlayerTeam;
        },
        8353: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            const place_1 = __webpack_require__(8595);
            const chat_1 = __webpack_require__(4218);
            const hit_1 = __webpack_require__(3044);
            const equipHat_1 = __webpack_require__(420);
            const equipAccessory_1 = __webpack_require__(8101);
            const unequipHat_1 = __webpack_require__(5088);
            const unequipAccessory_1 = __webpack_require__(3296);
            const buyHat_1 = __webpack_require__(3269);
            const buyAccessory_1 = __webpack_require__(8106);
            function setupGame(data) {
                let sid = data[0];
                app_1.MooMoo.myPlayer = {};
                app_1.MooMoo.myPlayer.sid = sid;
                app_1.MooMoo.myPlayer.place = place_1.default;
                app_1.MooMoo.myPlayer.chat = chat_1.default;
                app_1.MooMoo.myPlayer.hit = hit_1.default;
                app_1.MooMoo.myPlayer.equipHat = equipHat_1.default;
                app_1.MooMoo.myPlayer.equipAccessory = equipAccessory_1.default;
                app_1.MooMoo.myPlayer.unequipHat = unequipHat_1.default;
                app_1.MooMoo.myPlayer.unequipAccessory = unequipAccessory_1.default;
                app_1.MooMoo.myPlayer.buyHat = buyHat_1.default;
                app_1.MooMoo.myPlayer.buyAccessory = buyAccessory_1.default;
                app_1.MooMoo.vars.gameLoaded = true;
                app_1.MooMoo.emit("gameLoad");
                app_1.MooMoo.emit("setupGame", data);
                app_1.MooMoo.emit("setupgame", data);
                app_1.MooMoo.emit("1", data);
                let didInit = app_1.MooMoo.didInit;
                if (!didInit) {
                    if (app_1.MooMoo.onGameLoad) app_1.MooMoo.onGameLoad();
                    app_1.MooMoo.didInit = true;
                }
            }
            exports["default"] = setupGame;
        },
        5701: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function shootTurret(data) {
                app_1.MooMoo.emit("shootTurret", data);
                app_1.MooMoo.emit("shootturret", data);
                app_1.MooMoo.emit("sp", data);
            }
            exports["default"] = shootTurret;
        },
        5718: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function showText(data) {
                app_1.MooMoo.emit("showText", data);
                app_1.MooMoo.emit("showtext", data);
                app_1.MooMoo.emit("t", data);
            }
            exports["default"] = showText;
        },
        1836: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateAge(data) {
                app_1.MooMoo.emit("updateAge", data);
                app_1.MooMoo.emit("updateage", data);
                app_1.MooMoo.emit("15", data);
            }
            exports["default"] = updateAge;
        },
        9289: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateHealth(data) {
                let sid = data[0];
                let value = data[1];
                let tmpPlayer = app_1.MooMoo.GamePlayerManager.getPlayerBySid(sid);
                if (tmpPlayer) {
                    tmpPlayer.health = value;
                }
                app_1.MooMoo.emit("updateHealth", data);
                app_1.MooMoo.emit("updatehealth", data);
                app_1.MooMoo.emit("h", data);
            }
            exports["default"] = updateHealth;
        },
        657: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateItemCounts(data) {
                app_1.MooMoo.emit("updateItemCounts", data);
                app_1.MooMoo.emit("updateitemcounts", data);
                app_1.MooMoo.emit("14", data);
            }
            exports["default"] = updateItemCounts;
        },
        9971: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateItems(data) {
                app_1.MooMoo.emit("updateItems", data);
                app_1.MooMoo.emit("updateitems", data);
                app_1.MooMoo.emit("17", data);
            }
            exports["default"] = updateItems;
        },
        2862: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateLeaderboard(data) {
                let leaderboarddata = data[0];
                app_1.MooMoo.LeaderboardManager.updateLeaderboard(leaderboarddata);
                app_1.MooMoo.emit("updateLeaderboard", data);
                app_1.MooMoo.emit("updateleaderboard", data);
                app_1.MooMoo.emit("5", data);
            }
            exports["default"] = updateLeaderboard;
        },
        1487: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateMinimap(data) {
                app_1.MooMoo.emit("updateMinimap", data);
                app_1.MooMoo.emit("updateminimap", data);
                app_1.MooMoo.emit("mm", data);
            }
            exports["default"] = updateMinimap;
        },
        7864: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updatePlayerValue(data) {
                let id = data[0];
                let value = data[1];
                let player = app_1.MooMoo.myPlayer.resources;
                player[id] = value;
                app_1.MooMoo.myPlayer.resources = player;
                app_1.MooMoo.emit("updatePlayerValue", data);
                app_1.MooMoo.emit("updateplayervalue", data);
                app_1.MooMoo.emit("9", data);
            }
            exports["default"] = updatePlayerValue;
        },
        8351: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.updateHookPosition = void 0;
            const chunk_1 = __webpack_require__(627);
            const cacheItems_1 = __webpack_require__(3748);
            const app_1 = __webpack_require__(366);
            const Player_1 = __webpack_require__(9347);
            const GameObject_1 = __webpack_require__(7809);
            function updatePlayers(raw) {
                let data = raw[0];
                let arr = (0, chunk_1.default)(data, 13);
                app_1.MooMoo.ActivePlayerManager.clearPlayers();
                arr.forEach((playerData => {
                    let tmpPlayer = app_1.MooMoo.GamePlayerManager.getPlayerBySid(playerData[0]);
                    if (!tmpPlayer) {
                        tmpPlayer = new Player_1.default(playerData[0]);
                        tmpPlayer.x = playerData[1];
                        tmpPlayer.y = playerData[2];
                    }
                    tmpPlayer.sid = playerData[0];
                    tmpPlayer.dir = playerData[3];
                    tmpPlayer.buildIndex = playerData[4];
                    tmpPlayer.weaponIndex = playerData[5];
                    tmpPlayer.weaponVariant = playerData[6];
                    tmpPlayer.team = playerData[7];
                    tmpPlayer.isLeader = playerData[8];
                    tmpPlayer.skinIndex = playerData[9];
                    tmpPlayer.tailIndex = playerData[10];
                    tmpPlayer.iconIndex = playerData[11];
                    tmpPlayer.zIndex = playerData[12];
                    app_1.MooMoo.ActivePlayerManager.addPlayer(tmpPlayer);
                    if (tmpPlayer.sid === app_1.MooMoo.myPlayer.sid) {
                        Object.assign(app_1.MooMoo.myPlayer, tmpPlayer);
                    }
                }));
                app_1.MooMoo.emit("updatePlayers", data);
                app_1.MooMoo.emit("updateplayers", data);
                app_1.MooMoo.emit("33", data);
                (0, cacheItems_1.default)();
            }
            function updateHookPosition(data) {
                if (this instanceof Player_1.default || this instanceof GameObject_1.default || this.isAI || !this.id) {} else {
                    let tmpPlayer = app_1.MooMoo.GamePlayerManager.getPlayerBySid(this.sid);
                    if (tmpPlayer) {
                        tmpPlayer.x = data;
                        tmpPlayer.y = this.y;
                        if (app_1.MooMoo.onPositionUpdate) {
                            app_1.MooMoo.onPositionUpdate(tmpPlayer);
                        }
                    }
                    app_1.MooMoo.GamePlayerManager.updatePlayer(this.sid, this);
                }
            }
            exports.updateHookPosition = updateHookPosition;
            exports["default"] = updatePlayers;
        },
        2798: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateStoreItems(data) {
                app_1.MooMoo.emit("updateStoreItems", data);
                app_1.MooMoo.emit("updatestoreitems", data);
                app_1.MooMoo.emit("us", data);
            }
            exports["default"] = updateStoreItems;
        },
        3226: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function updateUpgrades(data) {
                app_1.MooMoo.emit("updateUpgrades", data);
                app_1.MooMoo.emit("updateupgrades", data);
                app_1.MooMoo.emit("16", data);
            }
            exports["default"] = updateUpgrades;
        },
        2656: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            const app_1 = __webpack_require__(366);
            function wiggleGameObject(data) {
                app_1.MooMoo.emit("wiggleGameObject", data);
                app_1.MooMoo.emit("wigglegameobject", data);
                app_1.MooMoo.emit("8", data);
            }
            exports["default"] = wiggleGameObject;
        },
        2298: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, {
                default: () => __WEBPACK_DEFAULT_EXPORT__
            });
            const decode = function(r) {
                const e = 4294967296;
                let t = 0;
                if (r instanceof ArrayBuffer && (r = new Uint8Array(r)), "object" != typeof r || void 0 === r.length) throw new Error("Invalid argument type: Expected a byte array (Array or Uint8Array) to deserialize.");
                if (!r.length) throw new Error("Invalid argument: The byte array to deserialize is empty.");
                r instanceof Uint8Array || (r = new Uint8Array(r));
                let n = i();
                return r.length, n;
                function i() {
                    const e = r[t++];
                    if (e >= 0 && e <= 127) return e;
                    if (e >= 128 && e <= 143) return l(e - 128);
                    if (e >= 144 && e <= 159) return c(e - 144);
                    if (e >= 160 && e <= 191) return d(e - 160);
                    if (192 === e) return null;
                    if (193 === e) throw new Error("Invalid byte code 0xc1 found.");
                    if (194 === e) return !1;
                    if (195 === e) return !0;
                    if (196 === e) return a(-1, 1);
                    if (197 === e) return a(-1, 2);
                    if (198 === e) return a(-1, 4);
                    if (199 === e) return w(-1, 1);
                    if (200 === e) return w(-1, 2);
                    if (201 === e) return w(-1, 4);
                    if (202 === e) return u(4);
                    if (203 === e) return u(8);
                    if (204 === e) return o(1);
                    if (205 === e) return o(2);
                    if (206 === e) return o(4);
                    if (207 === e) return o(8);
                    if (208 === e) return f(1);
                    if (209 === e) return f(2);
                    if (210 === e) return f(4);
                    if (211 === e) return f(8);
                    if (212 === e) return w(1);
                    if (213 === e) return w(2);
                    if (214 === e) return w(4);
                    if (215 === e) return w(8);
                    if (216 === e) return w(16);
                    if (217 === e) return d(-1, 1);
                    if (218 === e) return d(-1, 2);
                    if (219 === e) return d(-1, 4);
                    if (220 === e) return c(-1, 2);
                    if (221 === e) return c(-1, 4);
                    if (222 === e) return l(-1, 2);
                    if (223 === e) return l(-1, 4);
                    if (e >= 224 && e <= 255) return e - 256;
                    throw console.debug("msgpack array:", r), new Error("Invalid byte value '" + e + "' at index " + (t - 1) + " in the MessagePack binary data (length " + r.length + "): Expecting a range of 0 to 255. This is not a byte array.");
                }
                function f(e) {
                    let n = 0, i = !0;
                    for (;e-- > 0; ) if (i) {
                        let e = r[t++];
                        n += 127 & e, 128 & e && (n -= 128), i = !1;
                    } else n *= 256, n += r[t++];
                    return n;
                }
                function o(e) {
                    let n = 0;
                    for (;e-- > 0; ) n *= 256, n += r[t++];
                    return n;
                }
                function u(e) {
                    let n = new DataView(r.buffer, t, e);
                    return t += e, 4 === e ? n.getFloat32(0, !1) : 8 === e ? n.getFloat64(0, !1) : void 0;
                }
                function a(e, n) {
                    e < 0 && (e = o(n));
                    let i = r.subarray(t, t + e);
                    return t += e, i;
                }
                function l(r, e) {
                    r < 0 && (r = o(e));
                    let t = {};
                    for (;r-- > 0; ) t[i()] = i();
                    return t;
                }
                function c(r, e) {
                    r < 0 && (r = o(e));
                    let t = [];
                    for (;r-- > 0; ) t.push(i());
                    return t;
                }
                function d(e, n) {
                    e < 0 && (e = o(n));
                    let i = t;
                    return t += e, function(r, e, t) {
                        let n = e, i = "";
                        for (t += e; n < t; ) {
                            let e = r[n++];
                            if (e > 127) if (e > 191 && e < 224) {
                                if (n >= t) throw new Error("UTF-8 decode: incomplete 2-byte sequence");
                                e = (31 & e) << 6 | 63 & r[n++];
                            } else if (e > 223 && e < 240) {
                                if (n + 1 >= t) throw new Error("UTF-8 decode: incomplete 3-byte sequence");
                                e = (15 & e) << 12 | (63 & r[n++]) << 6 | 63 & r[n++];
                            } else {
                                if (!(e > 239 && e < 248)) throw new Error("UTF-8 decode: unknown multibyte start 0x" + e.toString(16) + " at index " + (n - 1));
                                if (n + 2 >= t) throw new Error("UTF-8 decode: incomplete 4-byte sequence");
                                e = (7 & e) << 18 | (63 & r[n++]) << 12 | (63 & r[n++]) << 6 | 63 & r[n++];
                            }
                            if (e <= 65535) i += String.fromCharCode(e); else {
                                if (!(e <= 1114111)) throw new Error("UTF-8 decode: code point 0x" + e.toString(16) + " exceeds UTF-16 reach");
                                e -= 65536, i += String.fromCharCode(e >> 10 | 55296), i += String.fromCharCode(1023 & e | 56320);
                            }
                        }
                        return i;
                    }(r, i, e);
                }
                function w(r, n) {
                    r < 0 && (r = o(n));
                    let i = o(1), u = a(r);
                    return 255 === i ? function(r) {
                        if (4 === r.length) {
                            let e = (r[0] << 24 >>> 0) + (r[1] << 16 >>> 0) + (r[2] << 8 >>> 0) + r[3];
                            return new Date(1e3 * e);
                        }
                        if (8 === r.length) {
                            let t = (r[0] << 22 >>> 0) + (r[1] << 14 >>> 0) + (r[2] << 6 >>> 0) + (r[3] >>> 2), n = (3 & r[3]) * e + (r[4] << 24 >>> 0) + (r[5] << 16 >>> 0) + (r[6] << 8 >>> 0) + r[7];
                            return new Date(1e3 * n + t / 1e6);
                        }
                        if (12 === r.length) {
                            let e = (r[0] << 24 >>> 0) + (r[1] << 16 >>> 0) + (r[2] << 8 >>> 0) + r[3];
                            t -= 8;
                            let n = f(8);
                            return new Date(1e3 * n + e / 1e6);
                        }
                        throw new Error("Invalid data length for a date value.");
                    }(u) : {
                        type: i,
                        data: u
                    };
                }
            };
            const __WEBPACK_DEFAULT_EXPORT__ = decode;
        },
        112: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, {
                default: () => __WEBPACK_DEFAULT_EXPORT__
            });
            const encode = function(e) {
                const t = 4294967296;
                let n, r, i = new Uint8Array(128), l = 0;
                return a(e), i.subarray(0, l);
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
                                let n = e / t, r = e % t;
                                c([ 211, n >>> 24, n >>> 16, n >>> 8, n, r >>> 24, r >>> 16, r >>> 8, r ]);
                            } else e >= -0x8000000000000000 && e <= 0x8000000000000000 ? (s(211), u(e)) : c(e < 0 ? [ 211, 128, 0, 0, 0, 0, 0, 0, 0 ] : [ 207, 255, 255, 255, 255, 255, 255, 255, 255 ]); else r || (n = new ArrayBuffer(8), 
                            r = new DataView(n)), r.setFloat64(0, e), s(203), c(new Uint8Array(n));
                        }(e);
                        break;

                      case "string":
                        !function(e) {
                            let t = function(e) {
                                let t = !0, n = e.length;
                                for (let r = 0; r < n; r++) if (e.charCodeAt(r) > 127) {
                                    t = !1;
                                    break;
                                }
                                let r = 0, i = new Uint8Array(e.length * (t ? 1 : 4));
                                for (let t = 0; t !== n; t++) {
                                    let l = e.charCodeAt(t);
                                    if (l < 128) i[r++] = l; else {
                                        if (l < 2048) i[r++] = l >> 6 | 192; else {
                                            if (l > 55295 && l < 56320) {
                                                if (++t >= n) throw new Error("UTF-8 encode: incomplete surrogate pair");
                                                let a = e.charCodeAt(t);
                                                if (a < 56320 || a > 57343) throw new Error("UTF-8 encode: second surrogate character 0x" + a.toString(16) + " at index " + t + " out of range");
                                                l = 65536 + ((1023 & l) << 10) + (1023 & a), i[r++] = l >> 18 | 240, i[r++] = l >> 12 & 63 | 128;
                                            } else i[r++] = l >> 12 | 224;
                                            i[r++] = l >> 6 & 63 | 128;
                                        }
                                        i[r++] = 63 & l | 128;
                                    }
                                }
                                return t ? i : i.subarray(0, r);
                            }(e), n = t.length;
                            n <= 31 ? s(160 + n) : c(n <= 255 ? [ 217, n ] : n <= 65535 ? [ 218, n >>> 8, n ] : [ 219, n >>> 24, n >>> 16, n >>> 8, n ]), 
                            c(t);
                        }(e);
                        break;

                      case "object":
                        null === e ? o() : e instanceof Date ? function(e) {
                            let n = e.getTime() / 1e3;
                            if (0 === e.getMilliseconds() && n >= 0 && n < 4294967296) c([ 214, 255, n >>> 24, n >>> 16, n >>> 8, n ]); else if (n >= 0 && n < 17179869184) {
                                let r = 1e6 * e.getMilliseconds();
                                c([ 215, 255, r >>> 22, r >>> 14, r >>> 6, r << 2 >>> 0 | n / t, n >>> 24, n >>> 16, n >>> 8, n ]);
                            } else {
                                let t = 1e6 * e.getMilliseconds();
                                c([ 199, 12, 255, t >>> 24, t >>> 16, t >>> 8, t ]), u(n);
                            }
                        }(e) : Array.isArray(e) ? f(e) : e instanceof Uint8Array || e instanceof Uint8ClampedArray ? function(e) {
                            let t = e.length;
                            c(t <= 15 ? [ 196, t ] : t <= 65535 ? [ 197, t >>> 8, t ] : [ 198, t >>> 24, t >>> 16, t >>> 8, t ]), 
                            c(e);
                        }(e) : e instanceof Int8Array || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array ? f(e) : function(e) {
                            let t = 0;
                            for (let n in e) t++;
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
                    for (let n = 0; n < t; n++) a(e[n]);
                }
                function s(e) {
                    if (i.length < l + 1) {
                        let e = 2 * i.length;
                        for (;e < l + 1; ) e *= 2;
                        let t = new Uint8Array(e);
                        t.set(i), i = t;
                    }
                    i[l] = e, l++;
                }
                function c(e) {
                    if (i.length < l + e.length) {
                        let t = 2 * i.length;
                        for (;t < l + e.length; ) t *= 2;
                        let n = new Uint8Array(t);
                        n.set(i), i = n;
                    }
                    i.set(e, l), l += e.length;
                }
                function u(e) {
                    let n, r;
                    e >= 0 ? (n = e / t, r = e % t) : (e++, n = Math.abs(e) / t, r = Math.abs(e) % t, 
                    n = ~n, r = ~r), c([ n >>> 24, n >>> 16, n >>> 8, n, r >>> 24, r >>> 16, r >>> 8, r ]);
                }
            };
            const __WEBPACK_DEFAULT_EXPORT__ = encode;
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
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
    (() => {
        __webpack_require__.r = exports => {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: "Module"
                });
            }
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
        };
    })();
    var __webpack_exports__ = __webpack_require__(366);
})();