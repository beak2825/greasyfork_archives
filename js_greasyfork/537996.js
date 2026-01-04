/******/
(function() { // webpackBootstrap
    /******/
    "use strict";
    /******/
    var __webpack_modules__ = ({
        /***/
        "./src/Cow.js":
            /*!********************!*\
              !*** ./src/Cow.js ***!
              \********************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _config_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./config.json */ "./src/config.json");
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./constants.js */ "./src/constants.js");
                /* harmony import */
                var _modules_entities_Player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./modules/entities/Player.js */ "./src/modules/entities/Player.js");
                /* harmony import */
                var _modules_plugins_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./modules/plugins/index.js */ "./src/modules/plugins/index.js");
                /* harmony import */
                var _game_configs_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./game_configs/index.js */ "./src/game_configs/index.js");
                class Cow {
                    constructor() {
                        this.config = _config_json__WEBPACK_IMPORTED_MODULE_0__
                        this.items = _game_configs_index_js__WEBPACK_IMPORTED_MODULE_4__
                        this.codec = _constants_js__WEBPACK_IMPORTED_MODULE_1__.codec
                        this.socket = _constants_js__WEBPACK_IMPORTED_MODULE_1__.socket
                        this.playersManager = _constants_js__WEBPACK_IMPORTED_MODULE_1__.playersManager
                        this.objectsManager = _constants_js__WEBPACK_IMPORTED_MODULE_1__.objectsManager
                        this.animalsManager = _constants_js__WEBPACK_IMPORTED_MODULE_1__.animalsManager
                        this.ticker = _constants_js__WEBPACK_IMPORTED_MODULE_1__.ticker
                        this.camera = _constants_js__WEBPACK_IMPORTED_MODULE_1__.camera
                        this.renderer = _constants_js__WEBPACK_IMPORTED_MODULE_1__.renderer
                        this.input = _constants_js__WEBPACK_IMPORTED_MODULE_1__.input
                        this.placement = _constants_js__WEBPACK_IMPORTED_MODULE_1__.placement
                        this.player = void 0
                        this.inGame = false
                        this._plugins = new Map([
                            ["auto-reconect", new _modules_plugins_index_js__WEBPACK_IMPORTED_MODULE_3__.AutoReconect()]
                        ])
                    }
                    setCodec(msgpack) {
                        _constants_js__WEBPACK_IMPORTED_MODULE_1__.codec.encoder = { encode: msgpack.encode }
                        _constants_js__WEBPACK_IMPORTED_MODULE_1__.codec.decoder = { decode: msgpack.decode }
                        _constants_js__WEBPACK_IMPORTED_MODULE_1__.codec.isReady = true

                        this.codec = _constants_js__WEBPACK_IMPORTED_MODULE_1__.codec
                    }
                    onPacket(packetName, listener) {
                        this.socket.handler.onPacket(packetName, listener)
                    }
                    onKeyboard(keyName, listener, options) {
                        return this.input.keyboard.on(keyName, listener, options)
                    }
                    sendPacket(packetName, ...content) {
                        this.socket.send(packetName, content)
                    }
                    placeItem(groupIndex, {
                        angle
                    } = {}, callback) {
                        this.placement.placeItem(groupIndex, {
                            angle
                        }, callback)
                    }
                    addRender(renderKey, renderFunc) {
                        this.renderer.addRender(renderKey, renderFunc)
                    }
                    setInGame(_inGame) {
                        if (typeof _inGame !== 'boolean') return
                        this._inGame = _inGame
                    }
                    getNearPlayer(checkEnemy) {
                        if (!this.player) return
                        const {
                            CowUtils
                        } = window
                        let players = this.playersManager.list
                        if (!checkEnemy) players = players.filter((player) => player.visible)
                        if (checkEnemy) {
                            players = players.filter((player) => !player.isAlly && player.visible)
                        }
                        return players.sort((a, b) => {
                            a = CowUtils.getDistance(a, this.player)
                            b = CowUtils.getDistance(b, this.player)
                            return a - b
                        })[0]
                    }
                    getNearEnemy() {
                        return this.getNearPlayer(true)
                    }
                    setPlayer(player) {
                        this.camera.setTo(player.x, player.y)
                        if (!(player instanceof _modules_entities_Player_js__WEBPACK_IMPORTED_MODULE_2__["default"]) || typeof this.player !== 'undefined') return
                        this.player = player
                    }
                    setPluginState(pluginName, state) {
                        if (!this._plugins.has(pluginName)) return
                        const plugin = this._plugins.get(pluginName)
                        plugin.setActiveState(state)
                    }
                    executePlugin(pluginName) {
                        if (!this._plugins.has(pluginName)) return
                        const plugin = this._plugins.get(pluginName)
                        if (!plugin.isActiveState) return
                        plugin.execute()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Cow);
                /***/
            }),
        /***/
        "./src/constants.js":
            /*!**************************!*\
              !*** ./src/constants.js ***!
              \**************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    animalsManager: function() {
                        return /* binding */ animalsManager;
                    },
                    /* harmony export */
                    camera: function() {
                        return /* binding */ camera;
                    },
                    /* harmony export */
                    codec: function() {
                        return /* binding */ codec;
                    },
                    /* harmony export */
                    cow: function() {
                        return /* binding */ cow;
                    },
                    /* harmony export */
                    input: function() {
                        return /* binding */ input;
                    },
                    /* harmony export */
                    objectsManager: function() {
                        return /* binding */ objectsManager;
                    },
                    /* harmony export */
                    placement: function() {
                        return /* binding */ placement;
                    },
                    /* harmony export */
                    playersManager: function() {
                        return /* binding */ playersManager;
                    },
                    /* harmony export */
                    renderer: function() {
                        return /* binding */ renderer;
                    },
                    /* harmony export */
                    socket: function() {
                        return /* binding */ socket;
                    },
                    /* harmony export */
                    ticker: function() {
                        return /* binding */ ticker;
                    }
                    /* harmony export */
                });
                /* harmony import */
                var _Cow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Cow.js */ "./src/Cow.js");
                /* harmony import */
                var _modules_Placement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./modules/Placement.js */ "./src/modules/Placement.js");
                /* harmony import */
                var _modules_Ticker_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./modules/Ticker.js */ "./src/modules/Ticker.js");
                /* harmony import */
                var _modules_input_Input_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./modules/input/Input.js */ "./src/modules/input/Input.js");
                /* harmony import */
                var _modules_managers_AnimalsManager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./modules/managers/AnimalsManager.js */ "./src/modules/managers/AnimalsManager.js");
                /* harmony import */
                var _modules_managers_ObjectsManager_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./modules/managers/ObjectsManager.js */ "./src/modules/managers/ObjectsManager.js");
                /* harmony import */
                var _modules_managers_PlayersManager_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./modules/managers/PlayersManager.js */ "./src/modules/managers/PlayersManager.js");
                /* harmony import */
                var _modules_render_Camera_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./modules/render/Camera.js */ "./src/modules/render/Camera.js");
                /* harmony import */
                var _modules_render_Renderer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! ./modules/render/Renderer.js */ "./src/modules/render/Renderer.js");
                /* harmony import */
                var _modules_socket_Socket_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__( /*! ./modules/socket/Socket.js */ "./src/modules/socket/Socket.js");
                const codec = {
                    decoder: void 0,
                    encoder: void 0,
                    isReady: false
                }
                const socket = new _modules_socket_Socket_js__WEBPACK_IMPORTED_MODULE_9__["default"]()
                const playersManager = new _modules_managers_PlayersManager_js__WEBPACK_IMPORTED_MODULE_6__["default"]()
                const objectsManager = new _modules_managers_ObjectsManager_js__WEBPACK_IMPORTED_MODULE_5__["default"]()
                const animalsManager = new _modules_managers_AnimalsManager_js__WEBPACK_IMPORTED_MODULE_4__["default"]()
                const ticker = new _modules_Ticker_js__WEBPACK_IMPORTED_MODULE_2__["default"]()
                const camera = new _modules_render_Camera_js__WEBPACK_IMPORTED_MODULE_7__["default"]()
                const renderer = new _modules_render_Renderer_js__WEBPACK_IMPORTED_MODULE_8__["default"]()
                const input = new _modules_input_Input_js__WEBPACK_IMPORTED_MODULE_3__["default"]()
                const placement = new _modules_Placement_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
                const cow = new _Cow_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
                /***/
            }),
        /***/
        "./src/game_configs/accessories.js":
            /*!*****************************************!*\
              !*** ./src/game_configs/accessories.js ***!
              \*****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                const accessories = [{
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
                    spin: !0,
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
                }]
                accessories.searchById = function(id) {
                    return this.find((accessory) => accessory.id === id)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (accessories);
                /***/
            }),
        /***/
        "./src/game_configs/aiTypes.js":
            /*!*************************************!*\
              !*** ./src/game_configs/aiTypes.js ***!
              \*************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
                    id: 0,
                    src: "cow_1",
                    killScore: 150,
                    health: 500,
                    weightM: 0.8,
                    speed: 0.00095,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 50]
                }, {
                    id: 1,
                    src: "pig_1",
                    killScore: 200,
                    health: 800,
                    weightM: 0.6,
                    speed: 0.00085,
                    turnSpeed: 0.001,
                    scale: 72,
                    drop: ["food", 80]
                }, {
                    id: 2,
                    name: "Bull",
                    src: "bull_2",
                    hostile: true,
                    dmg: 20,
                    killScore: 1000,
                    health: 1800,
                    weightM: 0.5,
                    speed: 0.00094,
                    turnSpeed: 0.00074,
                    scale: 78,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 100]
                }, {
                    id: 3,
                    name: "Bully",
                    src: "bull_1",
                    hostile: true,
                    dmg: 20,
                    killScore: 2000,
                    health: 2800,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.0008,
                    scale: 90,
                    viewRange: 900,
                    chargePlayer: true,
                    drop: ["food", 400]
                }, {
                    id: 4,
                    name: "Wolf",
                    src: "wolf_1",
                    hostile: true,
                    dmg: 8,
                    killScore: 500,
                    health: 300,
                    weightM: 0.45,
                    speed: 0.001,
                    turnSpeed: 0.002,
                    scale: 84,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 200]
                }, {
                    id: 5,
                    name: "Quack",
                    src: "chicken_1",
                    dmg: 8,
                    killScore: 2000,
                    noTrap: true,
                    health: 300,
                    weightM: 0.2,
                    speed: 0.0018,
                    turnSpeed: 0.006,
                    scale: 70,
                    drop: ["food", 100]
                }, {
                    id: 6,
                    name: "MOOSTAFA",
                    nameScale: 50,
                    src: "enemy",
                    hostile: true,
                    dontRun: true,
                    fixedSpawn: true,
                    spawnDelay: 60000,
                    noTrap: true,
                    colDmg: 100,
                    dmg: 40,
                    killScore: 8000,
                    health: 18000,
                    weightM: 0.4,
                    speed: 0.0007,
                    turnSpeed: 0.01,
                    scale: 80,
                    spriteMlt: 1.8,
                    leapForce: 0.9,
                    viewRange: 1000,
                    hitRange: 210,
                    hitDelay: 1000,
                    chargePlayer: true,
                    drop: ["food", 100]
                }, {
                    id: 7,
                    name: "Treasure",
                    hostile: true,
                    nameScale: 35,
                    src: "crate_1",
                    fixedSpawn: true,
                    spawnDelay: 120000,
                    colDmg: 200,
                    killScore: 5000,
                    health: 20000,
                    weightM: 0.1,
                    speed: 0.0,
                    turnSpeed: 0.0,
                    scale: 70,
                    spriteMlt: 1.0
                }, {
                    id: 8,
                    name: "MOOFIE",
                    src: "wolf_2",
                    hostile: true,
                    fixedSpawn: true,
                    dontRun: true,
                    hitScare: 4,
                    spawnDelay: 30000,
                    noTrap: true,
                    nameScale: 35,
                    dmg: 10,
                    colDmg: 100,
                    killScore: 3000,
                    health: 7000,
                    weightM: 0.45,
                    speed: 0.0015,
                    turnSpeed: 0.002,
                    scale: 90,
                    viewRange: 800,
                    chargePlayer: true,
                    drop: ["food", 1000]
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/groups.js":
            /*!************************************!*\
              !*** ./src/game_configs/groups.js ***!
              \************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
                    id: 0,
                    name: "food",
                    layer: 0
                }, {
                    id: 1,
                    name: "walls",
                    place: !0,
                    limit: 30,
                    layer: 0
                }, {
                    id: 2,
                    name: "spikes",
                    place: !0,
                    limit: 15,
                    layer: 0
                }, {
                    id: 3,
                    name: "mill",
                    place: !0,
                    limit: 7,
                    sandboxLimit: 299,
                    layer: 1
                }, {
                    id: 4,
                    name: "mine",
                    place: !0,
                    limit: 1,
                    layer: 0
                }, {
                    id: 5,
                    name: "trap",
                    place: !0,
                    limit: 6,
                    layer: -1
                }, {
                    id: 6,
                    name: "booster",
                    place: !0,
                    limit: 12,
                    sandboxLimit: 299,
                    layer: -1
                }, {
                    id: 7,
                    name: "turret",
                    place: !0,
                    limit: 2,
                    layer: 1
                }, {
                    id: 8,
                    name: "watchtower",
                    place: !0,
                    limit: 12,
                    layer: 1
                }, {
                    id: 9,
                    name: "buff",
                    place: !0,
                    limit: 4,
                    layer: -1
                }, {
                    id: 10,
                    name: "spawn",
                    place: !0,
                    limit: 1,
                    layer: -1
                }, {
                    id: 11,
                    name: "sapling",
                    place: !0,
                    limit: 2,
                    layer: 0
                }, {
                    id: 12,
                    name: "blocker",
                    place: !0,
                    limit: 3,
                    layer: -1
                }, {
                    id: 13,
                    name: "teleporter",
                    place: !0,
                    limit: 2,
                    sandboxLimit: 299,
                    layer: -1
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/hats.js":
            /*!**********************************!*\
              !*** ./src/game_configs/hats.js ***!
              \**********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                const hats = [{
                    id: 45,
                    name: "Shame!",
                    dontSell: !0,
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
                    watrImm: !0
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
                    topSprite: !0,
                    price: 1e4,
                    scale: 120,
                    desc: "generates points while worn",
                    pps: 1.5
                }, {
                    id: 11,
                    name: "Spike Gear",
                    topSprite: !0,
                    price: 1e4,
                    scale: 120,
                    desc: "deal damage to players that damage you",
                    dmg: .45
                }, {
                    id: 53,
                    name: "Turret Gear",
                    topSprite: !0,
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
                    noEat: !0,
                    spdMult: 1.1,
                    invisTimer: 1e3
                }]
                hats.searchById = function(id) {
                    return this.find((hat) => hat.id === id)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (hats);
                /***/
            }),
        /***/
        "./src/game_configs/index.js":
            /*!***********************************!*\
              !*** ./src/game_configs/index.js ***!
              \***********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    accessories: function() {
                        return /* reexport safe */ _accessories_js__WEBPACK_IMPORTED_MODULE_0__["default"];
                    },
                    /* harmony export */
                    aiTypes: function() {
                        return /* reexport safe */ _aiTypes_js__WEBPACK_IMPORTED_MODULE_1__["default"];
                    },
                    /* harmony export */
                    groups: function() {
                        return /* reexport safe */ _groups_js__WEBPACK_IMPORTED_MODULE_2__["default"];
                    },
                    /* harmony export */
                    hats: function() {
                        return /* reexport safe */ _hats_js__WEBPACK_IMPORTED_MODULE_3__["default"];
                    },
                    /* harmony export */
                    list: function() {
                        return /* reexport safe */ _list_js__WEBPACK_IMPORTED_MODULE_4__["default"];
                    },
                    /* harmony export */
                    projectiles: function() {
                        return /* reexport safe */ _projectiles_js__WEBPACK_IMPORTED_MODULE_5__["default"];
                    },
                    /* harmony export */
                    variants: function() {
                        return /* reexport safe */ _variants_js__WEBPACK_IMPORTED_MODULE_6__["default"];
                    },
                    /* harmony export */
                    weapons: function() {
                        return /* reexport safe */ _weapons_js__WEBPACK_IMPORTED_MODULE_7__["default"];
                    }
                    /* harmony export */
                });
                /* harmony import */
                var _accessories_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./accessories.js */ "./src/game_configs/accessories.js");
                /* harmony import */
                var _aiTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./aiTypes.js */ "./src/game_configs/aiTypes.js");
                /* harmony import */
                var _groups_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./groups.js */ "./src/game_configs/groups.js");
                /* harmony import */
                var _hats_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./hats.js */ "./src/game_configs/hats.js");
                /* harmony import */
                var _list_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./list.js */ "./src/game_configs/list.js");
                /* harmony import */
                var _projectiles_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./projectiles.js */ "./src/game_configs/projectiles.js");
                /* harmony import */
                var _variants_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./variants.js */ "./src/game_configs/variants.js");
                /* harmony import */
                var _weapons_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./weapons.js */ "./src/game_configs/weapons.js");
                /***/
            }),
        /***/
        "./src/game_configs/list.js":
            /*!**********************************!*\
              !*** ./src/game_configs/list.js ***!
              \**********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _groups_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./groups.js */ "./src/game_configs/groups.js");
                const list = [{
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][0],
                    name: "apple",
                    desc: "restores 20 health when consumed",
                    req: ["food", 10],
                    consume: function(e) {
                        return e.changeHealth(20, e)
                    },
                    scale: 22,
                    holdOffset: 15
                }, {
                    age: 3,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][0],
                    name: "cookie",
                    desc: "restores 40 health when consumed",
                    req: ["food", 15],
                    consume: function(e) {
                        return e.changeHealth(40, e)
                    },
                    scale: 27,
                    holdOffset: 15
                }, {
                    age: 7,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][0],
                    name: "cheese",
                    desc: "restores 30 health and another 50 over 5 seconds",
                    req: ["food", 25],
                    consume: function(e) {
                        return e.changeHealth(30, e) || e.health < 100 ? (e.dmgOverTime.dmg = -10,
                            e.dmgOverTime.doer = e,
                            e.dmgOverTime.time = 5,
                            !0) : !1
                    },
                    scale: 27,
                    holdOffset: 15
                }, {
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][1],
                    name: "wood wall",
                    desc: "provides protection for your village",
                    req: ["wood", 10],
                    projDmg: !0,
                    health: 380,
                    scale: 50,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 3,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][1],
                    name: "stone wall",
                    desc: "provides improved protection for your village",
                    req: ["stone", 25],
                    health: 900,
                    scale: 50,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    pre: 1,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][1],
                    name: "castle wall",
                    desc: "provides powerful protection for your village",
                    req: ["stone", 35],
                    health: 1500,
                    scale: 52,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
                    name: "spikes",
                    desc: "damages enemies when they touch them",
                    req: ["wood", 20, "stone", 5],
                    health: 400,
                    dmg: 20,
                    scale: 49,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    age: 5,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
                    name: "greater spikes",
                    desc: "damages enemies when they touch them",
                    req: ["wood", 30, "stone", 10],
                    health: 500,
                    dmg: 35,
                    scale: 52,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    age: 9,
                    pre: 1,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
                    name: "poison spikes",
                    desc: "poisons enemies when they touch them",
                    req: ["wood", 35, "stone", 15],
                    health: 600,
                    dmg: 30,
                    pDmg: 5,
                    scale: 52,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    age: 9,
                    pre: 2,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][2],
                    name: "spinning spikes",
                    desc: "damages enemies when they touch them",
                    req: ["wood", 30, "stone", 20],
                    health: 500,
                    dmg: 45,
                    turnSpeed: .003,
                    scale: 52,
                    spritePadding: -23,
                    holdOffset: 8,
                    placeOffset: -5
                }, {
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][3],
                    name: "windmill",
                    desc: "generates gold over time",
                    req: ["wood", 50, "stone", 10],
                    health: 400,
                    pps: 1,
                    turnSpeed: .0016,
                    spritePadding: 25,
                    iconLineMult: 12,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: 5
                }, {
                    age: 5,
                    pre: 1,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][3],
                    name: "faster windmill",
                    desc: "generates more gold over time",
                    req: ["wood", 60, "stone", 20],
                    health: 500,
                    pps: 1.5,
                    turnSpeed: .0025,
                    spritePadding: 25,
                    iconLineMult: 12,
                    scale: 47,
                    holdOffset: 20,
                    placeOffset: 5
                }, {
                    age: 8,
                    pre: 1,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][3],
                    name: "power mill",
                    desc: "generates more gold over time",
                    req: ["wood", 100, "stone", 50],
                    health: 800,
                    pps: 2,
                    turnSpeed: .005,
                    spritePadding: 25,
                    iconLineMult: 12,
                    scale: 47,
                    holdOffset: 20,
                    placeOffset: 5
                }, {
                    age: 5,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][4],
                    type: 2,
                    name: "mine",
                    desc: "allows you to mine stone",
                    req: ["wood", 20, "stone", 100],
                    iconLineMult: 12,
                    scale: 65,
                    holdOffset: 20,
                    placeOffset: 0
                }, {
                    age: 5,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][11],
                    type: 0,
                    name: "sapling",
                    desc: "allows you to farm wood",
                    req: ["wood", 150],
                    iconLineMult: 12,
                    colDiv: .5,
                    scale: 110,
                    holdOffset: 50,
                    placeOffset: -15
                }, {
                    age: 4,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][5],
                    name: "pit trap",
                    desc: "pit that traps enemies if they walk over it",
                    req: ["wood", 30, "stone", 30],
                    trap: !0,
                    ignoreCollision: !0,
                    hideFromEnemy: !0,
                    health: 500,
                    colDiv: .2,
                    scale: 50,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 4,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][6],
                    name: "boost pad",
                    desc: "provides boost when stepped on",
                    req: ["stone", 20, "wood", 5],
                    ignoreCollision: !0,
                    boostSpeed: 1.5,
                    health: 150,
                    colDiv: .7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][7],
                    doUpdate: !0,
                    name: "turret",
                    desc: "defensive structure that shoots at enemies",
                    req: ["wood", 200, "stone", 150],
                    health: 800,
                    projectile: 1,
                    shootRange: 700,
                    shootRate: 2200,
                    scale: 43,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][8],
                    name: "platform",
                    desc: "platform to shoot over walls and cross over water",
                    req: ["wood", 20],
                    ignoreCollision: !0,
                    zIndex: 1,
                    health: 300,
                    scale: 43,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][9],
                    name: "healing pad",
                    desc: "standing on it will slowly heal you",
                    req: ["wood", 30, "food", 10],
                    ignoreCollision: !0,
                    healCol: 15,
                    health: 400,
                    colDiv: .7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 9,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][10],
                    name: "spawn pad",
                    desc: "you will spawn here when you die but it will dissapear",
                    req: ["wood", 100, "stone", 100],
                    health: 400,
                    ignoreCollision: !0,
                    spawnPoint: !0,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][12],
                    name: "blocker",
                    desc: "blocks building in radius",
                    req: ["wood", 30, "stone", 25],
                    ignoreCollision: !0,
                    blocker: 300,
                    health: 400,
                    colDiv: .7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }, {
                    age: 7,
                    group: _groups_js__WEBPACK_IMPORTED_MODULE_0__["default"][13],
                    name: "teleporter",
                    desc: "teleports you to a random point on the map",
                    req: ["wood", 60, "stone", 60],
                    ignoreCollision: !0,
                    teleport: !0,
                    health: 200,
                    colDiv: .7,
                    scale: 45,
                    holdOffset: 20,
                    placeOffset: -5
                }]
                for (var i = 0; i < list.length; ++i) {
                    list[i].id = i
                    if (list[i].pre) {
                        list[i].pre = i - list[i].pre
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (list);
                /***/
            }),
        /***/
        "./src/game_configs/projectiles.js":
            /*!*****************************************!*\
              !*** ./src/game_configs/projectiles.js ***!
              \*****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
                    indx: 0,
                    layer: 0,
                    src: "arrow_1",
                    dmg: 25,
                    speed: 1.6,
                    scale: 103,
                    range: 1e3
                }, {
                    indx: 1,
                    layer: 1,
                    dmg: 25,
                    scale: 20
                }, {
                    indx: 0,
                    layer: 0,
                    src: "arrow_1",
                    dmg: 35,
                    speed: 2.5,
                    scale: 103,
                    range: 1200
                }, {
                    indx: 0,
                    layer: 0,
                    src: "arrow_1",
                    dmg: 30,
                    speed: 2,
                    scale: 103,
                    range: 1200
                }, {
                    indx: 1,
                    layer: 1,
                    dmg: 16,
                    scale: 20
                }, {
                    indx: 0,
                    layer: 0,
                    src: "bullet_1",
                    dmg: 50,
                    speed: 3.6,
                    scale: 160,
                    range: 1400
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/variants.js":
            /*!**************************************!*\
              !*** ./src/game_configs/variants.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
                    id: 0,
                    src: "",
                    xp: 0,
                    val: 1
                }, {
                    id: 1,
                    src: "_g",
                    xp: 3000,
                    val: 1.1
                }, {
                    id: 2,
                    src: "_d",
                    xp: 7000,
                    val: 1.18
                }, {
                    id: 3,
                    src: "_r",
                    poison: true,
                    xp: 12000,
                    val: 1.18
                }]);
                /***/
            }),
        /***/
        "./src/game_configs/weapons.js":
            /*!*************************************!*\
              !*** ./src/game_configs/weapons.js ***!
              \*************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony default export */
                __webpack_exports__["default"] = ([{
                    id: 0,
                    type: 0,
                    name: "tool hammer",
                    desc: "tool for gathering all resources",
                    src: "hammer_1",
                    length: 140,
                    width: 140,
                    xOff: -3,
                    yOff: 18,
                    dmg: 25,
                    range: 65,
                    gather: 1,
                    speed: 300
                }, {
                    id: 1,
                    type: 0,
                    age: 2,
                    name: "hand axe",
                    desc: "gathers resources at a higher rate",
                    src: "axe_1",
                    length: 140,
                    width: 140,
                    xOff: 3,
                    yOff: 24,
                    dmg: 30,
                    spdMult: 1,
                    range: 70,
                    gather: 2,
                    speed: 400
                }, {
                    id: 2,
                    type: 0,
                    age: 8,
                    pre: 1,
                    name: "great axe",
                    desc: "deal more damage and gather more resources",
                    src: "great_axe_1",
                    length: 140,
                    width: 140,
                    xOff: -8,
                    yOff: 25,
                    dmg: 35,
                    spdMult: 1,
                    range: 75,
                    gather: 4,
                    speed: 400
                }, {
                    id: 3,
                    type: 0,
                    age: 2,
                    name: "short sword",
                    desc: "increased attack power but slower move speed",
                    src: "sword_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 46,
                    dmg: 35,
                    spdMult: .85,
                    range: 110,
                    gather: 1,
                    speed: 300
                }, {
                    id: 4,
                    type: 0,
                    age: 8,
                    pre: 3,
                    name: "katana",
                    desc: "greater range and damage",
                    src: "samurai_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 59,
                    dmg: 40,
                    spdMult: .8,
                    range: 118,
                    gather: 1,
                    speed: 300
                }, {
                    id: 5,
                    type: 0,
                    age: 2,
                    name: "polearm",
                    desc: "long range melee weapon",
                    src: "spear_1",
                    iPad: 1.3,
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 53,
                    dmg: 45,
                    knock: .2,
                    spdMult: .82,
                    range: 142,
                    gather: 1,
                    speed: 700
                }, {
                    id: 6,
                    type: 0,
                    age: 2,
                    name: "bat",
                    desc: "fast long range melee weapon",
                    src: "bat_1",
                    iPad: 1.3,
                    length: 110,
                    width: 180,
                    xOff: -8,
                    yOff: 53,
                    dmg: 20,
                    knock: .7,
                    range: 110,
                    gather: 1,
                    speed: 300
                }, {
                    id: 7,
                    type: 0,
                    age: 2,
                    name: "daggers",
                    desc: "really fast short range weapon",
                    src: "dagger_1",
                    iPad: .8,
                    length: 110,
                    width: 110,
                    xOff: 18,
                    yOff: 0,
                    dmg: 20,
                    knock: .1,
                    range: 65,
                    gather: 1,
                    hitSlow: .1,
                    spdMult: 1.13,
                    speed: 100
                }, {
                    id: 8,
                    type: 0,
                    age: 2,
                    name: "stick",
                    desc: "great for gathering but very weak",
                    src: "stick_1",
                    length: 140,
                    width: 140,
                    xOff: 3,
                    yOff: 24,
                    dmg: 1,
                    spdMult: 1,
                    range: 70,
                    gather: 7,
                    speed: 400
                }, {
                    id: 9,
                    type: 1,
                    age: 6,
                    name: "hunting bow",
                    desc: "bow used for ranged combat and hunting",
                    src: "bow_1",
                    req: ["wood", 4],
                    length: 120,
                    width: 120,
                    xOff: -6,
                    yOff: 0,
                    projectile: 0,
                    spdMult: .75,
                    speed: 600
                }, {
                    id: 10,
                    type: 1,
                    age: 6,
                    name: "great hammer",
                    desc: "hammer used for destroying structures",
                    src: "great_hammer_1",
                    length: 140,
                    width: 140,
                    xOff: -9,
                    yOff: 25,
                    dmg: 10,
                    spdMult: .88,
                    range: 75,
                    sDmg: 7.5,
                    gather: 1,
                    speed: 400
                }, {
                    id: 11,
                    type: 1,
                    age: 6,
                    name: "wooden shield",
                    desc: "blocks projectiles and reduces melee damage",
                    src: "shield_1",
                    length: 120,
                    width: 120,
                    shield: .2,
                    xOff: 6,
                    yOff: 0,
                    spdMult: .7
                }, {
                    id: 12,
                    type: 1,
                    age: 8,
                    pre: 9,
                    name: "crossbow",
                    desc: "deals more damage and has greater range",
                    src: "crossbow_1",
                    req: ["wood", 5],
                    aboveHand: !0,
                    armS: .75,
                    length: 120,
                    width: 120,
                    xOff: -4,
                    yOff: 0,
                    projectile: 2,
                    spdMult: .7,
                    speed: 700
                }, {
                    id: 13,
                    type: 1,
                    age: 9,
                    pre: 12,
                    name: "repeater crossbow",
                    desc: "high firerate crossbow with reduced damage",
                    src: "crossbow_2",
                    req: ["wood", 10],
                    aboveHand: !0,
                    armS: .75,
                    length: 120,
                    width: 120,
                    xOff: -4,
                    yOff: 0,
                    projectile: 3,
                    spdMult: .7,
                    speed: 230
                }, {
                    id: 14,
                    type: 1,
                    age: 6,
                    name: "mc grabby",
                    desc: "steals resources from enemies",
                    src: "grab_1",
                    length: 130,
                    width: 210,
                    xOff: -8,
                    yOff: 53,
                    dmg: 0,
                    steal: 250,
                    knock: .2,
                    spdMult: 1.05,
                    range: 125,
                    gather: 0,
                    speed: 700
                }, {
                    id: 15,
                    type: 1,
                    age: 9,
                    pre: 12,
                    name: "musket",
                    desc: "slow firerate but high damage and range",
                    src: "musket_1",
                    req: ["stone", 10],
                    aboveHand: !0,
                    rec: .35,
                    armS: .6,
                    hndS: .3,
                    hndD: 1.6,
                    length: 205,
                    width: 205,
                    xOff: 25,
                    yOff: 0,
                    projectile: 5,
                    hideProjectile: !0,
                    spdMult: .6,
                    speed: 1500
                }]);
                /***/
            }),
        /***/
        "./src/hooks.js":
            /*!**********************!*\
              !*** ./src/hooks.js ***!
              \**********************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./constants.js */ "./src/constants.js");
                /* harmony import */
                var _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./utils/CowUtils.js */ "./src/utils/CowUtils.js");
                /*// define codec
                _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].createHook({
                    property: "extensionCodec",
                    setter: (instance) => {
                        if (typeof _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.encoder !== 'undefined') {
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.decoder = instance
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.isReady = true
                            return
                        }
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.encoder = instance
                    }
                })*/
                // define websocket
                WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {
                    apply(target, instance, args) {
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.socket.isReady) {
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.socket.setWebSocket(instance)
                        }
                        return target.apply(instance, args)
                    }
                })
                /***/
            }),
        /***/
        "./src/modules/Placement.js":
            /*!**********************************!*\
              !*** ./src/modules/Placement.js ***!
              \**********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../constants.js */ "./src/constants.js");
                class Placement {
                    constructor() {
                        this.delay = 0
                        this.lastPlaceTick = 0
                    }
                    setDelay(_delay) {
                        this.delay = _delay
                    }
                    sendPlace(id, angle) {
                        const timeSincePlace = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks - this.lastPlaceTick
                        if (timeSincePlace < this.delay) return
                        const {
                            packets
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.designations
const oldWeapon = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.weaponIndex
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.SELECT_BUILD, id)
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.ATTACK_STATE, 1, angle, "by cowjs")
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.ATTACK_STATE, 0, angle, "by cowjs")
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.sendPacket(packets.SELECT_BUILD, _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.weapons[Number(oldWeapon > 8)], true)
                        this.lastPlaceTick = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks
                    }
                    placeItem(groupIndex, {
                        angle
                    } = {}, callback) {
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.alive) return
                        const itemIndex = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.items[groupIndex]
                        if (typeof itemIndex === 'undefined') return
                        const item = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.list[itemIndex]
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.isCanBuild(item)) return
                        angle = typeof angle === 'undefined' ? _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.lookAngle : angle
                        const scale = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.scale + item.scale + (item.placeOffset || 0)
                        const placeX = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.x2 + (scale * Math.cos(angle))
                        const placeY = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.y2 + (scale * Math.sin(angle))
                        const isCanPlace = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.checkItemLocation(placeX, placeY, item.scale, 0.6, item.id, false)
                        if (!item.consume && !isCanPlace) return

                        this.sendPlace(item.id, angle)

callback instanceof Function && callback()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Placement);
                /***/
            }),
        /***/
        "./src/modules/Ticker.js":
            /*!*******************************!*\
              !*** ./src/modules/Ticker.js ***!
              \*******************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Ticker {
                    constructor() {
                        this.ticks = 0
                        this.tickTasks = []
                        this.isClear = false
                    }
                    clear() {
                        this.tickTasks = []
                        this.isClear = true
                    }
                    addTickTask(callback) {
                        if (!(callback instanceof Function)) return
                        this.tickTasks.push(callback)
                    }
                    updateTicks() {
                        this.ticks += 1
                        if (this.isClear) {
                            this.isClear = false
                            return
                        }
                        if (this.tickTasks.length) {
                            this.tickTasks[0]()
                            this.tickTasks.shift()
                        }
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Ticker);
                /***/
            }),
        /***/
        "./src/modules/entities/Animal.js":
            /*!****************************************!*\
              !*** ./src/modules/entities/Animal.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _Entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Entity.js */ "./src/modules/entities/Entity.js");
                class Animal extends _Entity_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
                    constructor({
                        sid,
                        index,
                        x,
                        y,
                        dir
                    }) {
                        super({
                            sid
                        })
                        const {
                            CowUtils
                        } = window
                        let data = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.aiTypes[index]
                        if (!data) data = {}
                        this.sid = sid
                        this.x = x
                        this.y = y
                        this.name = data.name || data.src
                        this.startX = data?.fixedSpawn ? x : null
                        this.startY = data?.fixedSpawn ? y : null
                        this.xVel = 0
                        this.yVel = 0
                        this.zIndex = 0
                        this.dir = CowUtils.fixAngle(dir)
                        this.dirPlus = 0
                        this.index = index
                        this.src = data.src
                        this.weightM = data.weightM
                        this.speed = data.speed
                        this.killScore = data.killScore
                        this.turnSpeed = data.turnSpeed
                        this.scale = data.scale
                        this.maxHealth = data.health
                        this.leapForce = data.leapForce
                        this.health = this.maxHealth
                        this.chargePlayer = data.chargePlayer
                        this.viewRange = data.viewRange
                        this.drop = data.drop
                        this.dmg = data.dmg
                        this.hostile = data.hostile
                        this.dontRun = data.dontRun
                        this.hitRange = data.hitRange
                        this.hitDelay = data.hitDelay
                        this.hitScare = data.hitScare
                        this.spriteMlt = data.spriteMlt
                        this.nameScale = data.nameScale
                        this.colDmg = data.colDmg
                        this.noTrap = data.noTrap
                        this.spawnDelay = data.spawnDelay
                        this.hitWait = 0
                        this.waitCount = 1000
                        this.moveCount = 0
                        this.targetDir = 0
                        this.runFrom = null
                        this.chargeTarget = null
                        this.dmgOverTime = {}
                        this.visible = true
                    }
                    disable() {
                        this.visible = false
                    }
                    setTickData(data) {
                        const time = Date.now()
                        this.index = data[1]
                        this.time1 = (this.time2 === undefined) ? time : this.time2
                        this.time2 = time
                        this.x1 = this.x
                        this.y1 = this.y
                        this.x2 = data[2]
                        this.y2 = data[3]
                        this.dir1 = (this.dir2 === undefined) ? data[4] : this.dir2
                        this.dir2 = data[4]
                        this.dir = this.dir2
                        this.health = data[5]
                        this.dt = 0
                        this.visible = true
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Animal);
                /***/
            }),
        /***/
        "./src/modules/entities/Entity.js":
            /*!****************************************!*\
              !*** ./src/modules/entities/Entity.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Entity {
                    constructor({
                        id,
                        sid
                    }) {
                        this.id = id
                        this.sid = sid
                        this.name = "unknown"
                        this.dt = 0
                        this.x = 0
                        this.y = 0
                        this.x1 = this.x
                        this.y1 = this.y
                        this.x2 = this.x1
                        this.y2 = this.y1
                        this.dir = 0
                        this.dir1 = 0
                        this.dir2 = this.dir1
                        this.health = 100
                        this.maxHealth = this.health
                        this.scale = 35
                        this.zIndex = 0
                    }
                    get renderX() {
                        return this.x - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.camera.xOffset
                    }
                    get renderY() {
                        return this.y - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.camera.yOffset
                    }
                    setInitData(data) {
                        if (!Array.isArray(data) || !data?.length) return
                        this.id = data[0]
                        this.sid = data[1]
                        this.name = data[2]
                        this.x = data[3]
                        this.y = data[4]
                        this.dir = data[5]
                        this.health = data[6]
                        this.maxHealth = data[7]
                        this.scale = data[8]
                        if (typeof data[9] !== 'undefined') {
                            this.skinColor = data[9]
                        }
                        this.visible = false
                    }
                    setTo(x, y) {
                        if (typeof x !== 'number' || typeof y !== 'number') return
                        if (isNaN(x) || isNaN(y)) return
                        this.x = x
                        this.y = y
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Entity);
                /***/
            }),
        /***/
        "./src/modules/entities/GameObject.js":
            /*!********************************************!*\
              !*** ./src/modules/entities/GameObject.js ***!
              \********************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants */ "./src/constants.js");
                class GameObject {
                    constructor({
                        sid
                    }) {
                        const {
                            CowUtils
                        } = window
                        this.sid = sid
                        this.init = function(x, y, dir, scale, type, data, owner) {
                            data = typeof data === 'undefined' ? {} : data
                            this.x = x
                            this.y = y
                            this.dir = CowUtils.fixAngle(dir)
                            this.xWiggle = 0
                            this.yWiggle = 0
                            this.scale = scale
                            this.type = type
                            this.id = data.id
                            this.owner = owner
                            this.name = data.name
                            this.isItem = Boolean(this.id !== undefined)
                            this.group = data.group
                            this.health = data.health
                            this.maxHealth = data.health
                            this.layer = this.group !== undefined ? this.group.layer : this.type === 0 ? 3 : this.type === 2 ? 0 : this.type === 4 ? -1 : 2
                            this.sentTo = {}
                            this.gridLocations = []
                            this.doUpdate = data.doUpdate
                            this.colDiv = data.colDiv || 1
                            this.blocker = data.blocker
                            this.ignoreCollision = data.ignoreCollision
                            this.dontGather = data.dontGather
                            this.hideFromEnemy = data.hideFromEnemy
                            this.friction = data.friction
                            this.projDmg = data.projDmg
                            this.dmg = data.dmg
                            this.pDmg = data.pDmg
                            this.pps = data.pps
                            this.zIndex = data.zIndex || 0
                            this.turnSpeed = data.turnSpeed
                            this.turnSpeed2 = null
                            this.turnSpeed3 = null
                            this.req = data.req
                            this.trap = data.trap
                            this.healCol = data.healCol
                            this.teleport = data.teleport
                            this.boostSpeed = data.boostSpeed
                            this.projectile = data.projectile
                            this.shootRange = data.shootRange
                            this.shootRate = data.shootRate
                            this.shootCount = this.shootRate
                            this.spawnPoint = data.spawnPoint
                            this.visible = true
                            this.active = true
                        }
                    }
                    get renderX() {
                        return this.x + Number(this.xWiggle) - _constants__WEBPACK_IMPORTED_MODULE_0__.cow.camera.xOffset
                    }
                    get renderY() {
                        return this.y + Number(this.yWiggle) - _constants__WEBPACK_IMPORTED_MODULE_0__.cow.camera.yOffset
                    }
                    setVisible(_visible) {
                        if (typeof _visible !== 'boolean') return
                        this.visible = _visible
                    }
                    setActive(_active) {
                        if (typeof _active !== 'boolean') return
                        this.active = _active
                    }
                    getScale(scaleMult, hasColDiv) {
                        scaleMult = scaleMult || 1
                        const isVolume = this.isItem || this.type == 2 || this.type == 3 || this.type == 4
                        return this.scale * (isVolume ? 1 : (0.6 * scaleMult)) * (hasColDiv ? 1 : this.colDiv)
                    }
                    changeHealth(amount) {
                        amount = parseInt(amount)
                        this.health += amount
                        return this.health <= 0
                    }
                    doWiggle(dir) {
                        this.xWiggle += _constants__WEBPACK_IMPORTED_MODULE_0__.cow.config.gatherWiggle * Math.cos(dir)
                        this.yWiggle += _constants__WEBPACK_IMPORTED_MODULE_0__.cow.config.gatherWiggle * Math.sin(dir)
                    }
                    update() {
                        if (!this.visible) return
                        const {
                            renderer
                        } = _constants__WEBPACK_IMPORTED_MODULE_0__.cow
                        if (this.xWiggle) {
                            this.xWiggle *= Math.pow(0.99, renderer.delta)
                        }
                        if (this.yWiggle) {
                            this.yWiggle *= Math.pow(0.99, renderer.delta)
                        }
                        if (this.turnSpeed) {
                            this.dir += this.turnSpeed * renderer.delta
                        }
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (GameObject);
                /***/
            }),
        /***/
        "./src/modules/entities/Player.js":
            /*!****************************************!*\
              !*** ./src/modules/entities/Player.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _Entity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Entity.js */ "./src/modules/entities/Entity.js");
                /* harmony import */
                var _reloads_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./reloads.js */ "./src/modules/entities/reloads.js");
                class Player extends _Entity_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
                    constructor({
                        id,
                        sid
                    }) {
                        super({
                            id,
                            sid
                        })
                        this.skinColor = void 0
                        this.buildIndex = -1
                        this.weaponIndex = 0
                        this.weaponVariant = 0
                        this.team = ""
                        this.skinIndex = 0
                        this.tailIndex = 0
                        this.isLeader = false
                        this.iconIndex = 0
                        this.items = [0, 3, 6, 10]
                        this.weapons = [0]
                        this.skins = {}
                        this.tails = {}
                        const defineFreeCaps = (config, capType) => {
                            for (let i = 0; i < config.length; ++i) {
                                const cap = config[i]
                                if (cap.price > 0) continue
                                this[capType][cap.id] = true
                            }
                        }
                        defineFreeCaps(_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.hats, "skins")
                        defineFreeCaps(_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.accessories, "tails")
                        this.itemCounts = {}
                        this.gold = 100
                        this.stone = 100
                        this.wood = 100
                        this.food = 100
                        this.reloads = new _reloads_js__WEBPACK_IMPORTED_MODULE_2__["default"]()
                        this.maxXP = 300
                        this.XP = 0
                        this.age = 1
                        this.kills = 0
                        this.upgrAge = 2
                        this.upgradePoints = 0
                        this.hitTime = null
                        this.shameCount = 0
                        this.shameTimer = 0
                        this.speed = 0
                        this.moveDir = 0
                        this.isPlayer = true
                        this.lastDeath = {}
                        this.createdInstance = {}
                        this._updateCreatedInstance()
                    }
                    get isMe() {
                        return Boolean(this.sid === _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.sid && _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.alive)
                    }
                    get isAlly() {
                        return Boolean((this.sid === _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.sid) || (this.team && this.team === _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.team))
                    }
                    get weapon() {
                        return _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.weapons[this.weaponIndex]
                    }
                    get lookAngle() {
                        return this.isMe ? _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.input.mouse.angle : (this.dir || this.dir2)
                    }
                    get skin() {
                        return _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.hats.searchById(this.skinIndex)
                    }
                    get tail() {
                        return _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.accessories.searchById(this.tailIndex)
                    }
                    _updateCreatedInstance() {
                        this.createdInstance = {}
                        const ignoreKeys = ["skins", "tails", "sid", "id", "lastDeath", "reloads"]
                        for (const key in this) {
                            if (key === "createdInstance") continue
                            if (ignoreKeys.includes(key)) continue
                            this.createdInstance[key] = this[key]
                        }
                    }
                    spawn() {
                        this.alive = true
                        if (!this.isMe) return
                        for (const key in this.createdInstance) {
                            const value = this.createdInstance[key]
                            this[key] = value
                        }
                        this._updateCreatedInstance()
                        this.reloads = new _reloads_js__WEBPACK_IMPORTED_MODULE_2__["default"]()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.setInGame(true)
                    }
                    kill() {
                        if (!this.isMe) return
                        this.alive = false
                        this.lastDeath = {
                            x: this.x,
                            y: this.y
                        }
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.setInGame(false)
                    }
                    disable() {
                        this.visible = false
                    }
                    hasResources(item) {
                        for (let i = 0; i < item.req.length; i += 2) {
                            if (this[item.req[i]] >= Math.round(item.req[i + 1])) continue
                            return false
                        }
                        return true
                    }
                    isCanBuild(item) {
                        return this.hasResources(item)
                    }
                    setTickData(data) {
                        if (!Array.isArray(data) || !data?.length) return
                        const {
                            CowUtils
                        } = window
                        this.dt = 0
                        this.x1 = this.x
                        this.y1 = this.y
                        this.speed = CowUtils.getDistance(this.x2, this.y2, data[1], data[2])
                        this.x2 = data[1]
                        this.y2 = data[2]
                        this.moveDir = CowUtils.getDirection(this.x1, this.y1, this.x2, this.y2)
                        this.dir1 = this.dir2 !== null ? this.dir2 : data[3]
                        this.dir2 = data[3]
                        this.time1 = this.time2 !== null ? this.time2 : Date.now()
                        this.time2 = Date.now()
                        this.buildIndex = data[4]
                        this.weaponIndex = data[5]
                        this.weaponVariant = data[6]
                        this.team = data[7]
                        this.isLeader = data[8]
                        this.skinIndex = data[9]
                        this.tailIndex = data[10]
                        this.iconIndex = data[11]
                        this.zIndex = data[12]
                        this.visible = true
                        this.tick()
                    }
                    updateShame() {
                        const timeSinceHit = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks - this.hitTime
                        if (timeSinceHit < 2) {
                            this.shameCount += 1
                            if (this.shameCount >= 8) {
                                this.shameTimer = 30000
                                this.shameCount = 0
                            }
                        } else {
                            this.shameCount = Math.max(0, this.shameCount - 2)
                        }
                    }
                    changeHealth(_health) {
                        if (this.health < _health) {
                            this.updateShame()
                            this.hitTime = 0
                        } else {
                            this.hitTime = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.ticks
                        }
                        this.health = _health
                    }
                    onGather(didHit, weaponIndex) {
                        const reloadType = weaponIndex > 8 ? "secondary" : "primary"
                        const currentReload = this.reloads[reloadType]
                        if (this.weaponIndex === currentReload.id) {
                        currentReload.count = 0
                        currentReload.date = Date.now()
}
const skin = this.skin
                        if (didHit) {
                            const {
                                CowUtils
                            } = window
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.eachVisible((gameObject) => {
                                if (!gameObject.isItem || gameObject.dontGather) return
                                const scale = gameObject.scale || gameObject.getScale()
                                const distance = CowUtils.getDistance(this, gameObject) - scale
                                const angle = CowUtils.getDirection(gameObject, this)
                                const angleDistance = CowUtils.getAngleDist(angle, this.dir2)
                                const isInAngle = angleDistance <= _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.gatherAngle
                                const isInRange = distance <= this.weapon.range
                                if (!isInAngle || !isInRange) return
                                const damage = this.weapon.dmg * (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.variants[this.weaponVariant].val || 1)
                                const damageAmount = damage * (this.weapon.sDmg || 1) * (skin?.bDmg || 1)

                                gameObject.changeHealth(-(damageAmount))
                            })
                        }
                    }
                    updateReloads() {
                        const reloadType = this.weaponIndex > 8 ? "secondary" : "primary"
                        const currentReload = this.reloads[reloadType]

                        if (currentReload.id != this.weapon.id) {
                            currentReload.setData(this.weapon, this.weaponVariant)
                        }
                        if (this.weaponVariant != currentReload.rarity) {
                            currentReload.rarity = this.weaponVariant
                        }
                        if (this.weaponIndex === currentReload.id && this.buildIndex === -1) {
                            if (currentReload.count < currentReload.max) {
                                currentReload.add()
                            }
                        }
                        this.reloads[reloadType] = currentReload
                        if (this.reloads.turret.count < this.reloads.turret.max) {
                            this.reloads.turret.add()
                        }
                    }
                    tick() {
                        this.updateReloads()
                        if (this.skinIndex != 45) {
                            if (this.shameCount === 8) {
                                this.shameTimer = 0
                                this.shameCont = 0
                            }
                            if (this.shameTimer > 0) this.shameTimer = 0
                        } else {
                            if (this.shameCount != 8) {
                                this.shameCount = 8
                                this.shameTimer = 270
                            }
                            if (this.shameTimer > 0) this.shameTimer -= 1
                        }
                    }
                    canSee(other) {
                        if (!other) return false
                        const dx = Math.abs(other.x - this.x) - other.scale
                        const dy = Math.abs(other.y - this.y) - other.scale
                        return dx <= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenWidth / 2) * 1.3 && dy <= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenHeight / 2) * 1.3
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Player);
                /***/
            }),
        /***/
        "./src/modules/entities/reloads.js":
            /*!*****************************************!*\
              !*** ./src/modules/entities/reloads.js ***!
              \*****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Reload {
                    constructor(id, speed, ticks) {
                        const tick = 111
                        ticks = ticks || Math.ceil(speed / tick)
                        this.id = id
                        this.count = ticks
                        this.date = 0
                        this.date2 = this.date
                        this.max = ticks
                        this.max2 = speed
                        this.rarity = 0
                        this.done = true
                        this.active = false
                        const {
                            CowUtils
                        } = window
                        this._default = CowUtils.removeProto(this)
                    }
                    get dif() {
                        return this.count / this.max
                    }
                    get smoothValue() {
                        if (this.done) return 1
                        return (this.date2 - this.date) / this.max2
                    }
                    setData(weapon, weaponVariant) {
                        this.id = weapon.id
                        this.max = weapon.speed ? Math.ceil(weapon.speed / (1e3 / 9)) : 0
                        this.max2 = weapon.speed
                        this.count = parseInt(this.max)
                        this.done = true
                        this.rarity = weaponVariant
                        this.active = true
                    }
                    add() {
                        this.count += 1
                        this.count = parseInt(this.count)
                        this.done = this.count === this.max
                    }
                    clear() {
                        this.count = 0
                        this.done = false
                        this.date = Date.now()
                    }
                }
                class Reloads {
                    constructor() {
                        this.primary = new Reload(5, 300),
                            this.secondary = new Reload(15, 1500),
                            this.turret = new Reload(null, 2500, 23)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Reloads);
                /***/
            }),
        /***/
        "./src/modules/input/Input.js":
            /*!************************************!*\
              !*** ./src/modules/input/Input.js ***!
              \************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Keyboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Keyboard.js */ "./src/modules/input/Keyboard.js");
                /* harmony import */
                var _Mouse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Mouse.js */ "./src/modules/input/Mouse.js");
                class Input {
                    constructor() {
                        this.keyboard = new _Keyboard_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
                        this.mouse = new _Mouse_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Input);
                /***/
            }),
        /***/
        "./src/modules/input/Keyboard.js":
            /*!***************************************!*\
              !*** ./src/modules/input/Keyboard.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Keyboard {
                    constructor() {
                        this.activeKeys = new Map()
                        this.events = new Map()
                        this.init()
                    }
                    on(keyName, listener, options = {
                        repeat: true
                    }) {
                        if (!(listener instanceof Function)) return
                        if (!this.events.has(keyName)) {
                            this.events.set(keyName, new Map())
                        }
                        const listeners = this.events.get(keyName)
                        const id = parseInt(Date.now() / 1000 + (Math.random() * 100e3))
                        const value = {
                            listener,
                            options
                        }
                        listeners.set(id, value)
                        return {
                            rebind: (newKeyName) => {
                                const listener = this.events.get(keyName).get(id)
                                if (this.events.get(keyName).has(id)) {
                                    this.events.get(keyName).delete(id)
                                }
                                return this.on(newKeyName, listener.listener, listener.options)
                            }
                        }
                    }
                    trigger(code, doRepeat) {
                        this.events.forEach((eventsChunk, keyName) => {
                            if (!eventsChunk.size || keyName !== code) return
                            eventsChunk.forEach((event) => {
                                if (!event?.options?.repeat && doRepeat) return
                                event.listener()
                            })
                        })
                    }
                    onKeydown(event) {
                        if (!this.activeKeys.get(event.code)) {
                            this.activeKeys.set(event.code, true)
                            this.activeKeys.set(event.which, true)
                            this.trigger(event.code)
                            this.trigger(event.which)
                        }
                    }
                    onKeyup(event) {
                        if (this.activeKeys.get(event.code)) {
                            this.activeKeys.set(event.code, false)
                            this.activeKeys.set(event.which, false)
                        }
                    }
                    update() {
                        this.activeKeys.forEach((state, keyName) => {
                            if (!state) return
                            this.trigger(keyName, true)
                        })
                    }
                    init() {
                        window.addEventListener("keydown", this.onKeydown.bind(this))
                        window.addEventListener("keyup", this.onKeyup.bind(this))
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Keyboard);
                /***/
            }),
        /***/
        "./src/modules/input/Mouse.js":
            /*!************************************!*\
              !*** ./src/modules/input/Mouse.js ***!
              \************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Mouse {
                    constructor() {
                        this.x = void 0
                        this.y = void 0
                        this.isDown = false
                        this.isUp = !this.isDown
                        this.lastClick = null
                        this.lastMove = null
                        window.addEventListener("load", this.init.bind(this))
                    }
                    get angle() {
                        const canvas = document.getElementById("gameCanvas") || _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.renderer.canvas
                        if (!canvas) return
                        const width = canvas.clientWidth / 2
                        const height = canvas.clientHeight / 2
                        return Math.atan2(this.y - height, this.x - width)
                    }
                    setTo(x, y) {
                        if (typeof x !== 'number' || typeof y !== 'number') return
                        this.x = x
                        this.y = y
                        this.lastMove = Date.now()
                    }
                    setState(_isDown) {
                        this.isDown = _isDown
                        this.isUp = !_isDown
                        this.lastClick = Date.now()
                    }
                    onMousemove(event) {
                        this.setTo(event.clientX, event.clientY)
                    }
                    onMousedown() {
                        this.setState(true)
                    }
                    onMouseup() {
                        this.setState(false)
                    }
                    init() {
                        const touchControls = document.getElementById("touch-controls-fullscreen")
                        touchControls.addEventListener("mousemove", this.onMousemove.bind(this))
                        touchControls.addEventListener("mousedown", this.onMousedown.bind(this))
                        touchControls.addEventListener("mouseup", this.onMouseup.bind(this))
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Mouse);
                /***/
            }),
        /***/
        "./src/modules/managers/AnimalsManager.js":
            /*!************************************************!*\
              !*** ./src/modules/managers/AnimalsManager.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _entities_Animal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../entities/Animal.js */ "./src/modules/entities/Animal.js");
                /* harmony import */
                var _entities_Player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ../entities/Player.js */ "./src/modules/entities/Player.js");
                class AnimalsManager {
                    constructor() {
                        this.animals = new Map()
                        this.animalsInStream = 0
                    }
                    get list() {
                        return [...this.animals.values()]
                    }
                    getById(sid) {
                        return this.animals.get(sid)
                    }
                    each(callback) {
                        this.animals.forEach(callback)
                    }
                    eachVisible(callback) {
                        this.each((animal) => {
                            if (!animal.visible) return
                            callback(animal)
                        })
                    }
                    updateAnimals(content) {
                        const chunkSize = 7

this.animalsInStream = 0

this.each((animal) => animal.disable())

if (!content?.length) return

                        for (let i = 0; i < content.length; i += chunkSize) {
                            const chunk = content.slice(i, i + chunkSize)
                            if (!this.animals.has(chunk[0])) {
                                const animal = new _entities_Animal_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                                    sid: chunk[0],
                                    index: chunk[1],
                                    x: chunk[2],
                                    y: chunk[3],
                                    dir: chunk[4]
                                })
                                this.animals.set(chunk[0], animal)
                                continue
                            }
                            const animal = this.animals.get(chunk[0])
                            animal.setTickData(chunk)
animal.visible = true
this.animalsInStream += 1
                        }
                    }
                    interpolate() {
                        const {
                            renderer
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow
                        const lastTime = renderer.nowUpdate - (1000 / (window.config?.serverUpdateRate || 10))

                        this.eachVisible((animal) => {
                            animal.dt += renderer.delta
                            const rate = 170
                            const tmpRate = Math.min(1.7, animal.dt / rate)
                            const xDif = animal.x2 - animal.x1
                            const yDif = animal.y2 - animal.y1
                            animal.setTo(
                                animal.x1 + (xDif * tmpRate),
                                animal.y1 + (yDif * tmpRate)
                            )
                        })
                    }
                    update() {
                        this.interpolate()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (AnimalsManager);
                /***/
            }),
        /***/
        "./src/modules/managers/ObjectsManager.js":
            /*!************************************************!*\
              !*** ./src/modules/managers/ObjectsManager.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _entities_GameObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../entities/GameObject.js */ "./src/modules/entities/GameObject.js");
                class ObjectsManager {
                    constructor() {
                        this.objects = new Map()
                        this.objectsInStream = 0
                    }
                    get list() {
                        return [...this.objects.values()]
                    }
                    getById(sid) {
                        return this.objects.get(sid)
                    }
                    each(callback) {
                        this.objects.forEach(callback)
                    }
                    eachVisible(callback) {
                        const visibleObjects = this.list.filter((object) => object.active && object.visible)
                        for (let i = 0; i < visibleObjects.length; i++) {
                            const gameObject = visibleObjects[i]
                            if (!gameObject.visible || !gameObject.active) return
                            callback(gameObject)
                        }
                    }
                    disableAllObjects(sid) {
                        this.each((gameObject) => {
                            if (!gameObject.owner || gameObject.owner.sid !== sid) return
                            this.objects.delete(gameObject.sid)
                        })
                    }
                    onAddGameObject(gameObject) {}
                    add(sid, x, y, dir, scale, type, data, setSID, owner) {
                        let tmpObject = this.getById(sid)
                        if (!tmpObject) {
                            tmpObject = new _entities_GameObject_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                                sid
                            })
                            this.objects.set(sid, tmpObject)
                        }
                        if (setSID) tmpObject.sid = sid
                        tmpObject.init(x, y, dir, scale, type, data, setSID, owner)
                        this.onAddGameObject(tmpObject)
                    }
                    checkItemLocation(x, y, scale, scaleMult, indx, ignoreWater, getBuilding) {
                        const {
                            CowUtils
                        } = window
                        const position = {
                            x,
                            y
                        }
                        let isCanPlace = true
let building = null

                        this.eachVisible((gameObject) => {
                            if (!isCanPlace) return
                            const blockScale = (gameObject.blocker ? gameObject.blocker : (gameObject.isItem ? gameObject.scale : gameObject.getScale(scaleMult, gameObject.isItem)))
                            if (CowUtils.getDistance(position, gameObject) < (scale + blockScale)) {
                                isCanPlace = false
building = gameObject
                            }
                        })
                        if (
                            !ignoreWater && indx != 18 &&
                            y >= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2) - (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.riverWidth / 2) &&
                            y <= (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2) + (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.riverWidth / 2)
                        ) {
                            isCanPlace = false
                        }
                        return !getBuilding ? isCanPlace : building
                    }
                    update() {
                        this.objectsInStream = 0
                        this.each((gameObject) => {
                            if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.canSee(gameObject)) {
                                return gameObject.setVisible(false)
                            }
                            gameObject.setVisible(true)
                            this.objectsInStream += 1
                            // if (!gameObject.doUpdate) return
                            gameObject.update()
                        })
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (ObjectsManager);
                /***/
            }),
        /***/
        "./src/modules/managers/PlayersManager.js":
            /*!************************************************!*\
              !*** ./src/modules/managers/PlayersManager.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _entities_Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../entities/Player.js */ "./src/modules/entities/Player.js");
                class PlayersManager {
                    constructor() {
                        this.players = new Map()
                        this.playersInStream = 0
                    }
                    get list() {
                        return [...this.players.values()]
                    }
                    getById(sid) {
                        return this.players.get(sid)
                    }
                    each(callback) {
                        this.players.forEach(callback)
                    }
                    eachVisible(callback) {
                        this.each((player) => {
                            if (!player.visible) return
                            callback(player)
                        })
                    }
                    addPlayer(content, isYou) {
                        if (!this.players.has(content[1])) {
                            this.players.set(content[1], new _entities_Player_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                                id: content[0],
                                sid: content[1]
                            }))
                        }
                        const player = this.players.get(content[1])
                        player.visible = false
                        player.x2 = void 0
                        player.y2 = void 0
                        player.spawn()
                        player.setInitData(content)
                        if (isYou) {
                            _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.setPlayer(player)
                        }
                    }
                    removePlayer(sid) {
                        if (!this.players.has(sid)) return
                        this.players.delete(sid)
                    }
                    updatePlayers(content) {
                        const chunkSize = 13
                        this.playersInStream = 0
                        this.eachVisible((player) => {
                            player.disable()
                        })
                        for (let i = 0; i < content.length; i += chunkSize) {
                            const chunk = content.slice(i, i + chunkSize)
                            if (!this.players.has(chunk[0])) continue
                            const player = this.players.get(chunk[0])
                            player.setTickData(chunk)
                            this.playersInStream += 1
                        }
                    }
                    interpolate() {
                        const {
                            CowUtils
                        } = window
                        const {
                            renderer
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow
                        const lastTime = renderer.nowUpdate - (1000 / (window.config?.serverUpdateRate || 10))
                        this.eachVisible((player) => {
                            player.dt += renderer.delta
                            const total = player.time2 - player.time1
                            const fraction = lastTime - player.time1
                            const ratio = total / fraction
                            const rate = 170
                            const tmpRate = Math.min(1.7, player.dt / rate)
                            const xDif = player.x2 - player.x1
                            const yDif = player.y2 - player.y1
                            player.setTo(
                                player.x1 + (xDif * tmpRate),
                                player.y1 + (yDif * tmpRate)
                            )
                            player.dir = CowUtils.lerpAngle(player.dir2, player.dir1, Math.min(1.2, ratio))
                        })
                    }
                    update() {
                        this.interpolate()
                        this.eachVisible((player) => {
                            const reloadType = player.weaponIndex > 8 ? "secondary" : "primary"
                            const currentReload = player.reloads[reloadType]

                            if (player.weaponIndex === currentReload.id) {
                                if (currentReload.count < currentReload.max) {
                                    currentReload.date2 = Date.now()
                                }
                            }
                        })
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (PlayersManager);
                /***/
            }),
        /***/
        "./src/modules/plugins/AutoReconect.js":
            /*!*********************************************!*\
              !*** ./src/modules/plugins/AutoReconect.js ***!
              \*********************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Plugin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Plugin.js */ "./src/modules/plugins/Plugin.js");
                class AutoReconect extends _Plugin_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
                    constructor() {
                        super({
                            name: "auto-reconect",
                            description: "Automatically reloads the page after the connection is closed or the game could not be logged in",
                            once: true
                        })
                    }
                    execute() {
                        super.execute(() => {
                            location.reload()
                        })
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (AutoReconect);
                /***/
            }),
        /***/
        "./src/modules/plugins/Plugin.js":
            /*!***************************************!*\
              !*** ./src/modules/plugins/Plugin.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Plugin {
                    constructor({
                        name,
                        description,
                        once,
                        isCanChangeActiveState = true
                    }) {
                        this.name = name
                        this.description = description
                        this.once = once
                        this._isCanChangeActiveState = isCanChangeActiveState
                        this.isActiveState = false
                        this.lastActive = null
                    }
                    setActiveState(state) {
                        if (!this._isCanChangeActiveState) return
                        this.isActiveState = state
                    }
                    execute(callback) {
                        if (this.once && this.lastActive) return
                        if (callback instanceof Function) {
                            callback()
                        }
                        this.lastActive = Date.now()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Plugin);
                /***/
            }),
        /***/
        "./src/modules/plugins/index.js":
            /*!**************************************!*\
              !*** ./src/modules/plugins/index.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */
                __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */
                    AutoReconect: function() {
                        return /* reexport safe */ _AutoReconect_js__WEBPACK_IMPORTED_MODULE_0__["default"];
                    }
                    /* harmony export */
                });
                /* harmony import */
                var _AutoReconect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./AutoReconect.js */ "./src/modules/plugins/AutoReconect.js");
                /***/
            }),
        /***/
        "./src/modules/render/Camera.js":
            /*!**************************************!*\
              !*** ./src/modules/render/Camera.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Camera {
                    constructor() {
                        this.x = 0
                        this.y = 0
                        this.distance = 0
                        this.angle = 0
                        this.speed = 0
                        this.xOffset = 0
                        this.yOffset = 0
                    }
                    setTo(x, y) {
                        this.x = x
                        this.y = y
                    }
                    update() {
                        if (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player?.alive) {
                            const {
                                CowUtils
                            } = window
                            this.distance = CowUtils.getDistance(this, _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player)
                            this.angle = CowUtils.getDirection(_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player, this)
                            this.speed = Math.min(this.distance * .01 * _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.renderer.delta, this.distance)
                            if (this.distance > .05) {
                                this.x += this.speed * Math.cos(this.angle)
                                this.y += this.speed * Math.sin(this.angle)
                            } else {
                                this.setTo(
                                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.x,
                                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.y
                                )
                            }
                        } else {
                            this.setTo(
                                _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2,
                                _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.mapScale / 2
                            )
                        }
                        this.xOffset = this.x - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenWidth / 2
                        this.yOffset = this.y - _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.maxScreenHeight / 2
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Camera);
                /***/
            }),
        /***/
        "./src/modules/render/Renderer.js":
            /*!****************************************!*\
              !*** ./src/modules/render/Renderer.js ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                class Renderer {
                    constructor() {
                        this.canvas = void 0
                        this.context = void 0
                        this.renders = new Map()
                        this.nowUpdate = void 0
                        this.lastUpdate = this.nowUpdate
                        this.delta = 0
                        window.addEventListener("load", this.init.bind(this))
                    }
                    addRender(renderKey, renderFunc) {
                        if (typeof renderKey !== 'string') return
                        if (!(renderFunc instanceof Function)) return
                        if (!this.renders.has(renderKey)) {
                            this.renders.set(renderKey, new Map())
                        }
                        const rendersChunk = this.renders.get(renderKey)
                        rendersChunk.set(rendersChunk.size + 1, renderFunc)
                    }
                    _updateAll() {
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.camera.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.animalsManager.update()
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.input.keyboard.update()
                    }
                    updateFrame() {
                        this.nowUpdate = Date.now()
                        this.delta = this.nowUpdate - this.lastUpdate
                        this.lastUpdate = this.nowUpdate
                        requestAnimationFrame(this.updateFrame.bind(this))
                        this._updateAll()
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player) return
                        this.renders.forEach((rendersChunk) => {
                            if (!rendersChunk.size) return
                            rendersChunk.forEach((render) => {
                                render()
                            })
                        })
                    }
                    init() {
                        this.canvas = document.getElementById("gameCanvas")
                        this.context = this.canvas.getContext("2d")
                        this.updateFrame()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Renderer);
                /***/
            }),
        /***/
        "./src/modules/socket/Handler.js":
            /*!***************************************!*\
              !*** ./src/modules/socket/Handler.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _events_getEvents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./events/getEvents.js */ "./src/modules/socket/events/getEvents.js");
                class Handler {
                    static handlerKeys = {
                        "socket-open": "onSocketOpen",
                        "socket-message": "onSocketMessage",
                        "socket-close": "onSocketClose"
                    }
                    constructor({
                        socket
                    }) {
                        this.socket = socket
                        this.packetsListeners = new Map()
                        this.firstMessage = false
                    }
                    onPacket(packetName, listener) {
                        if (typeof packetName !== 'string') return
                        if (!(listener instanceof Function)) return
                        if (!this.packetsListeners.has(packetName)) {
                            this.packetsListeners.set(packetName, new Map())
                        }
                        const listeners = this.packetsListeners.get(packetName)
                        listeners.set(listeners.size + 1, listener)
                    }
                    onSocketOpen() {}
                    onSocketMessage(event) {
                        if (!this.firstMessage) {
                            const events = (0, _events_getEvents_js__WEBPACK_IMPORTED_MODULE_1__["default"])()
                            for (const event in events) {
                                this.onPacket(event, events[event])
                            }
                            this.firstMessage = true
                        }
                        const {
                            data
                        } = event
                        if (!(data instanceof ArrayBuffer)) return
                        const binary = new Uint8Array(data)
                        const decoded = _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.decoder.decode(binary)
                        if (!decoded.length) return
                        const type = decoded[0]
                        const content = decoded[1]
                        this.packetsListeners.forEach((packetListeners, packetName) => {
                            if (!packetListeners.size) return
                            if (packetName !== type) return
                            packetListeners.forEach((packetListener) => {
                                packetListener(...content)
                            })
                        })
                    }
                    onSocketClose() {
                        const {
                            plugins
                        } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.designations
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.executePlugin(plugins.AUTO_RECONECT)
                    }
                    handle(handlerKey, event) {
                        const listenerName = Handler.handlerKeys[handlerKey]
                        if (typeof listenerName === 'undefined') return
                        const listener = this[listenerName]
                        if (!(listener instanceof Function)) return
                        listener.call(this, event)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Handler);
                /***/
            }),
        /***/
        "./src/modules/socket/Manager.js":
            /*!***************************************!*\
              !*** ./src/modules/socket/Manager.js ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class Manager {
                    static triggerKeys = {
                        "set-websocket": "onWebSocketSetted"
                    }
                    constructor({
                        socket
                    }) {
                        this.socket = socket
                    }
                    onWebSocketSetted() {
                        const {
                            handler
                        } = this.socket
                        this.socket.onEvent("open", handler.handle.bind(handler, "socket-open"))
                        this.socket.onEvent("message", handler.handle.bind(handler, "socket-message"))
                        this.socket.onEvent("close", handler.handle.bind(handler, "socket-close"))
                    }
                    trigger(triggerKey, ...props) {
                        const listenerName = Manager.triggerKeys[triggerKey]
                        if (typeof listenerName === 'undefined') return
                        const listener = this[listenerName]
                        if (!(listener instanceof Function)) return
                        listener.call(this, ...props)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Manager);
                /***/
            }),
        /***/
        "./src/modules/socket/Socket.js":
            /*!**************************************!*\
              !*** ./src/modules/socket/Socket.js ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _Handler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Handler.js */ "./src/modules/socket/Handler.js");
                /* harmony import */
                var _Manager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./Manager.js */ "./src/modules/socket/Manager.js");
                class Socket {
                    constructor() {
                        this.websocket = void 0
                        this.socketId = void 0
                        this.handler = new _Handler_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
                            socket: this
                        })
                        this.manager = new _Manager_js__WEBPACK_IMPORTED_MODULE_2__["default"]({
                            socket: this
                        })
                    }
                    get isCreated() {
                        return Boolean(typeof this.websocket !== 'undefined')
                    }
                    get isReady() {
                        return Boolean(this.websocket?.readyState === 1)
                    }
                    send(type, content) {
                        if (!this.isReady) return
                        const encoded = _constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.encoder.encode([type, content])
                        this.websocket.send(encoded)
                    }
                    onEvent(eventKey, listener) {
                        if (!this.isCreated) return
                        if (eventKey.startsWith("on")) {
                            this.websocket[eventKey] = listener
                            return
                        }
                        this.websocket.addEventListener(eventKey, listener)
                    }
                    setSocketId(_socketId) {
                        if (typeof _socketId !== 'number') return
                        this.socketId = _socketId
                    }
                    setWebSocket(_websocket) {
                        if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.codec.isReady) return
                        if (this.websocket instanceof WebSocket) return
                        if (!(_websocket instanceof WebSocket)) return
                        if (!/moomoo/.test(_websocket.url)) return
                        this.websocket = _websocket
                        this.manager.trigger("set-websocket")
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (Socket);
                /***/
            }),
        /***/
        "./src/modules/socket/events/animals/loadAI.js":
            /*!*****************************************************!*\
              !*** ./src/modules/socket/events/animals/loadAI.js ***!
              \*****************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function loadAI(content) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.animalsManager.updateAnimals(content)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (loadAI);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/addProjectile.js":
            /*!****************************************************************!*\
              !*** ./src/modules/socket/events/game_object/addProjectile.js ***!
              \****************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                    const isTurret = range == 700 && speed == 1.5 && indx === 1
                    const {
                        CowUtils
                    } = window
                    const offset = 70
                    const position = {
                        x: indx == 1 ? x : x - offset * Math.cos(dir),
                        y: indx == 1 ? y : y - offset * Math.sin(dir),
                    }
                    const reloadType = isTurret ? "turret" : "secondary"
                    const nearPlayer = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.list
                    .filter((player) => player.visible && CowUtils.getDistance(position.x, position.y, player.x2, player.y2) <= player.scale)
                    .sort((a, b) => {
                        a = CowUtils.getDistance(position.x, position.y, a.x2, a.y2)
                        b = CowUtils.getDistance(position.x, position.y, b.x2, b.y2)

                        return a - b
                    })[0]

                    if (nearPlayer) {
                        nearPlayer.reloads[reloadType].clear()
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (addProjectile);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/killObject.js":
            /*!*************************************************************!*\
              !*** ./src/modules/socket/events/game_object/killObject.js ***!
              \*************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function killObject(sid) {
                    const gameObject = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.getById(sid)
                    if (!gameObject) return
                    gameObject.setActive(false)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (killObject);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/killObjects.js":
            /*!**************************************************************!*\
              !*** ./src/modules/socket/events/game_object/killObjects.js ***!
              \**************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function killObjects(sid) {
                    if (!sid) return
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.disableAllObjects(sid)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (killObjects);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/loadGameObject.js":
            /*!*****************************************************************!*\
              !*** ./src/modules/socket/events/game_object/loadGameObject.js ***!
              \*****************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function loadGameObject(content) {
                    const chunkSize = 8
                    for (let i = 0; i < content.length; i += chunkSize) {
                        const chunk = content.slice(i, i + chunkSize)
                        chunk[6] = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.items.list[chunk[6]]
                        if (chunk[7] >= 0) {
                            chunk[7] = {
                                sid: chunk[7]
                            }
                        }
                        _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.add(...chunk)
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (loadGameObject);
                /***/
            }),
        /***/
        "./src/modules/socket/events/game_object/wiggleGameObject.js":
            /*!*******************************************************************!*\
              !*** ./src/modules/socket/events/game_object/wiggleGameObject.js ***!
              \*******************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function wiggleGameObject(dir, sid) {
                    const gameObject = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.objectsManager.getById(sid)
                    if (!gameObject) return
                    gameObject.doWiggle(dir)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (wiggleGameObject);
                /***/
            }),
        /***/
        "./src/modules/socket/events/getEvents.js":
            /*!************************************************!*\
              !*** ./src/modules/socket/events/getEvents.js ***!
              \************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../constants.js */ "./src/constants.js");
                /* harmony import */
                var _animals_loadAI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./animals/loadAI.js */ "./src/modules/socket/events/animals/loadAI.js");
                /* harmony import */
                var _game_object_addProjectile_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./game_object/addProjectile.js */ "./src/modules/socket/events/game_object/addProjectile.js");
                /* harmony import */
                var _game_object_killObject_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./game_object/killObject.js */ "./src/modules/socket/events/game_object/killObject.js");
                /* harmony import */
                var _game_object_killObjects_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./game_object/killObjects.js */ "./src/modules/socket/events/game_object/killObjects.js");
                /* harmony import */
                var _game_object_loadGameObject_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./game_object/loadGameObject.js */ "./src/modules/socket/events/game_object/loadGameObject.js");
                /* harmony import */
                var _game_object_wiggleGameObject_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./game_object/wiggleGameObject.js */ "./src/modules/socket/events/game_object/wiggleGameObject.js");
                /* harmony import */
                var _player_addPlayer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./player/addPlayer.js */ "./src/modules/socket/events/player/addPlayer.js");
                /* harmony import */
                var _player_gatherAnimation_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! ./player/gatherAnimation.js */ "./src/modules/socket/events/player/gatherAnimation.js");
                /* harmony import */
                var _player_killPlayer_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__( /*! ./player/killPlayer.js */ "./src/modules/socket/events/player/killPlayer.js");
                /* harmony import */
                var _player_removePlayer_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__( /*! ./player/removePlayer.js */ "./src/modules/socket/events/player/removePlayer.js");
                /* harmony import */
                var _player_updateHealth_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__( /*! ./player/updateHealth.js */ "./src/modules/socket/events/player/updateHealth.js");
                /* harmony import */
                var _player_updatePlayers_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__( /*! ./player/updatePlayers.js */ "./src/modules/socket/events/player/updatePlayers.js");
                /* harmony import */
                var _stats_updateItemCounts_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__( /*! ./stats/updateItemCounts.js */ "./src/modules/socket/events/stats/updateItemCounts.js");
                /* harmony import */
                var _stats_updateItems_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__( /*! ./stats/updateItems.js */ "./src/modules/socket/events/stats/updateItems.js");
                /* harmony import */
                var _stats_updatePlayerValue_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__( /*! ./stats/updatePlayerValue.js */ "./src/modules/socket/events/stats/updatePlayerValue.js");
                /* harmony import */
                var _system_setupGame_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__( /*! ./system/setupGame.js */ "./src/modules/socket/events/system/setupGame.js");

                function getEvents() {
                    const events = {}
                    const {
                        packets
                    } = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.designations
                    events[packets.SETUP_GAME] = _system_setupGame_js__WEBPACK_IMPORTED_MODULE_16__["default"]
                    events[packets.ADD_PLAYER] = _player_addPlayer_js__WEBPACK_IMPORTED_MODULE_7__["default"]
                    events[packets.KILL_PLAYER] = _player_killPlayer_js__WEBPACK_IMPORTED_MODULE_9__["default"]
                    events[packets.REMOVE_PLAYER] = _player_removePlayer_js__WEBPACK_IMPORTED_MODULE_10__["default"]
                    events[packets.UPDATE_PLAYERS] = _player_updatePlayers_js__WEBPACK_IMPORTED_MODULE_12__["default"]
                    events[packets.UPDATE_ITEM_COUNTS] = _stats_updateItemCounts_js__WEBPACK_IMPORTED_MODULE_13__["default"]
                    events[packets.UPDATE_PLAYER_VALUE] = _stats_updatePlayerValue_js__WEBPACK_IMPORTED_MODULE_15__["default"]
                    events[packets.UPDATE_HEALTH] = _player_updateHealth_js__WEBPACK_IMPORTED_MODULE_11__["default"]
                    events[packets.UPDATE_ITEMS] = _stats_updateItems_js__WEBPACK_IMPORTED_MODULE_14__["default"]
                    events[packets.GATHER_ANIMATION] = _player_gatherAnimation_js__WEBPACK_IMPORTED_MODULE_8__["default"]
                    events[packets.ADD_PROJECTILE] = _game_object_addProjectile_js__WEBPACK_IMPORTED_MODULE_2__["default"]
                    events[packets.LOAD_GAME_OBJECT] = _game_object_loadGameObject_js__WEBPACK_IMPORTED_MODULE_5__["default"]
                    events[packets.KILL_OBJECT] = _game_object_killObject_js__WEBPACK_IMPORTED_MODULE_3__["default"]
                    events[packets.KILL_OBJECTS] = _game_object_killObjects_js__WEBPACK_IMPORTED_MODULE_4__["default"]
                    events[packets.WIGGLE_GAME_OBJECT] = _game_object_wiggleGameObject_js__WEBPACK_IMPORTED_MODULE_6__["default"]
                    events[packets.LOAD_AI] = _animals_loadAI_js__WEBPACK_IMPORTED_MODULE_1__["default"]
                    return events
                }
                /* harmony default export */
                __webpack_exports__["default"] = (getEvents);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/addPlayer.js":
            /*!*******************************************************!*\
              !*** ./src/modules/socket/events/player/addPlayer.js ***!
              \*******************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function addPlayer(content, isYou) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.addPlayer(content, isYou)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (addPlayer);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/gatherAnimation.js":
            /*!*************************************************************!*\
              !*** ./src/modules/socket/events/player/gatherAnimation.js ***!
              \*************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function gatherAnimation(sid, didHit, index) {
                    const player = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.getById(sid)
                    if (!player) return
                    player.onGather(didHit, index)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (gatherAnimation);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/killPlayer.js":
            /*!********************************************************!*\
              !*** ./src/modules/socket/events/player/killPlayer.js ***!
              \********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function killPlayer() {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.kill()
                }
                /* harmony default export */
                __webpack_exports__["default"] = (killPlayer);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/removePlayer.js":
            /*!**********************************************************!*\
              !*** ./src/modules/socket/events/player/removePlayer.js ***!
              \**********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function removePlayer(id) {
                    if (_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.players.size <= 1) return
                    const player = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.list.find((player) => player.id === id)
                    if (!player) return
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.removePlayer(player.sid)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (removePlayer);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/updateHealth.js":
            /*!**********************************************************!*\
              !*** ./src/modules/socket/events/player/updateHealth.js ***!
              \**********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updateHealth(sid, value) {
                    const player = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.getById(sid)
                    if (!player) return
                    player.changeHealth(value)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updateHealth);
                /***/
            }),
        /***/
        "./src/modules/socket/events/player/updatePlayers.js":
            /*!***********************************************************!*\
              !*** ./src/modules/socket/events/player/updatePlayers.js ***!
              \***********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updatePlayers(content) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.playersManager.updatePlayers(content)
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.ticker.updateTicks()
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updatePlayers);
                /***/
            }),
        /***/
        "./src/modules/socket/events/stats/updateItemCounts.js":
            /*!*************************************************************!*\
              !*** ./src/modules/socket/events/stats/updateItemCounts.js ***!
              \*************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updateItemCounts(index, value) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player.itemCounts[index] = value
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updateItemCounts);
                /***/
            }),
        /***/
        "./src/modules/socket/events/stats/updateItems.js":
            /*!********************************************************!*\
              !*** ./src/modules/socket/events/stats/updateItems.js ***!
              \********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updateItems(data, isWeapon) {
                    if (!data?.length) return
                    const type = isWeapon ? "weapons" : "items"
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player[type] = data
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updateItems);
                /***/
            }),
        /***/
        "./src/modules/socket/events/stats/updatePlayerValue.js":
            /*!**************************************************************!*\
              !*** ./src/modules/socket/events/stats/updatePlayerValue.js ***!
              \**************************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function updatePlayerValue(index, value, updateView) {
                    if (!_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player) return
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.player[index] = value
                }
                /* harmony default export */
                __webpack_exports__["default"] = (updatePlayerValue);
                /***/
            }),
        /***/
        "./src/modules/socket/events/system/setupGame.js":
            /*!*******************************************************!*\
              !*** ./src/modules/socket/events/system/setupGame.js ***!
              \*******************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../constants.js */ "./src/constants.js");

                function setupGame(socketId) {
                    _constants_js__WEBPACK_IMPORTED_MODULE_0__.socket.setSocketId(socketId)
                }
                /* harmony default export */
                __webpack_exports__["default"] = (setupGame);
                /***/
            }),
        /***/
        "./src/utils/CowUtils.js":
            /*!*******************************!*\
              !*** ./src/utils/CowUtils.js ***!
              \*******************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                class CowUtils {
                    static removeProto(object) {
                        if (!(object instanceof Object)) return
                        return JSON.parse(JSON.stringify(object))
                    }
                    static randInt(min, max) {
                        return Math.floor(CowUtils.randFloat(min, max))
                    }
                    static randFloat(min, max) {
                        if (typeof max === 'undefined') {
                            max = min
                            min = 0
                        }
                        return (Math.random() * (max - min + 1)) + min
                    }
                    static toRadians(degree) {
                        return degree * 0.01745329251
                    }
                    static lerp(value1, value2, amount) {
                        return value1 + (value2 - value1) * amount
                    }
                    static kFormat(value) {
                        value = parseFloat(value)
                        return value > 999 ? `${(value / 1000).toFixed(1)}k` : value
                    }
                    static fixAngle(angle) {
                        return Math.atan2(Math.cos(angle), Math.sin(angle))
                    }
                    static getDistance(x1, y1, x2, y2) {
                        if (x1 instanceof Object && y1 instanceof Object) {
                            return Math.hypot(x1.y - y1.y, x1.x - y1.x)
                        }
                        return Math.hypot(y1 - y2, x1 - x2)
                    }
                    static getDirection(x1, y1, x2, y2) {
                        if (x1 instanceof Object && y1 instanceof Object) {
                            return Math.atan2(x1.y - y1.y, x1.x - y1.x)
                        }
                        return Math.atan2(y1 - y2, x1 - x2)
                    }
                    static getAngleDist(angleBetween, targetLookDir) {
                        const difference = Math.abs(targetLookDir - angleBetween) % (Math.PI * 2)
                        return (difference > Math.PI ? (Math.PI * 2) - difference : difference)
                    }
                    static lerpAngle(value1, value2, amount) {
                        const difference = Math.abs(value2 - value1)
                        if (difference > Math.PI) {
                            if (value1 > value2) {
                                value2 += Math.PI * 2
                            } else {
                                value1 += Math.PI * 2
                            }
                        }
                        const value = value2 + ((value1 - value2) * amount)
                        if (value >= 0 && value <= (Math.PI * 2)) return value
                        return (value % (Math.PI * 2))
                    }
                    static createHook({
                        property,
                        proto = Object.prototype,
                        setter,
                        getter
                    }) {
                        const symbol = Symbol(property)
                        Object.defineProperty(proto, property, {
                            get() {
                                typeof getter === 'function' && getter(this, this[symbol])
                                return this[symbol]
                            },
                            set(value) {
                                typeof setter === 'function' && setter(this, value)
                                this[symbol] = value
                            }
                        })
                        return symbol
                    }
                }
                /* harmony default export */
                __webpack_exports__["default"] = (CowUtils);
                /***/
            }),
        /***/
        "./src/config.json":
            /*!*************************!*\
              !*** ./src/config.json ***!
              \*************************/
            /***/
            (function(module) {
                module.exports = JSON.parse('{"NAME":"Cow.JS","VERSION":"1.0.0","maxScreenWidth":1920,"maxScreenHeight":1080,"mapScale":14400,"riverWidth":724,"gatherAngle":1.208304866765305,"hitAngle":1.5707963267948966,"shieldAngle":1.0471975511965976,"gatherWiggle":10,"designations":{"plugins":{"AUTO_RECONECT":"auto-reconect","CHECK_PLACEMENT":"check-placement"},"packets":{"INIT_DATA":"A","DISCONNECT":"B","SETUP_GAME":"C","ADD_PLAYER":"D","REMOVE_PLAYER":"E","UPDATE_PLAYERS":"a","UPDATE_LEADERBOARD":"G","LOAD_GAME_OBJECT":"H","LOAD_AI":"I","ANIMATE_AI":"J","GATHER_ANIMATION":"K","WIGGLE_GAME_OBJECT":"L","SHOOT_TURRET":"M","UPDATE_PLAYER_VALUE":"N","UPDATE_HEALTH":"O","KILL_PLAYER":"P","KILL_OBJECT":"Q","KILL_OBJECTS":"R","UPDATE_ITEM_COUNTS":"S","UPDATE_AGE":"T","UPDATE_UPGRADES":"U","UPDATE_ITEMS":"V","ADD_PROJECTILE":"X","REMOVE_PROJECTILE":"Y","SERVER_SHUTDOWN_NOTICE":"Z","ADD_ALLIANCE":"g","DELETE_ALLIANCE":"1","ALLIANCE_NOTIFICATION":"2","SET_PLAYER_TEAM":"3","SET_ALLIANCE_PLAYERS":"4","UPDATE_STORE_ITEMS":"5","RECEIVE_CHAT":"6","UPDATE_MINIMAP":"7","SHOW_TEXT":"8","PING_MAP":"9","PING_SOCKET_RESPONSE":"0","ALLIANCE_JOIN_REQUEST":"P","KICK_FROM_CLAN":"Q","SEND_ALLIANCE_JOIN":"b","CREATE_ALLIANCE":"L","LEAVE_ALLIANCE":"N","STORE_EQUIP":"c","CHAT_MESSAGE":"6","RMD":"E","ATTACK_STATE":"F","MOVE_DIR":"9","MAP_PING":"S","AUTO_ATTACK":"K","SELECT_BUILD":"z","SPAWN":"M","SELECT_UPGRADE":"H","LOOK_DIR":"D","PING_SOCKET":"0"},"items":{"FOOD":0,"WALL":1,"SPIKE":2,"MILL":3,"TRAP":4,"TURRET":5}}}');
                /***/
            })
        /******/
    });
    /************************************************************************/
    /******/ // The module cache
    /******/
    var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/
        var cachedModule = __webpack_module_cache__[moduleId];
        /******/
        if (cachedModule !== undefined) {
            /******/
            return cachedModule.exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/
        var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/
            exports: {}
            /******/
        };
        /******/
        /******/ // Execute the module function
        /******/
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/
        return module.exports;
        /******/
    }
    /******/
    /************************************************************************/
    /******/
    /* webpack/runtime/define property getters */
    /******/
    ! function() {
        /******/ // define getter functions for harmony exports
        /******/
        __webpack_require__.d = function(exports, definition) {
            /******/
            for (var key in definition) {
                /******/
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    /******/
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                    /******/
                }
                /******/
            }
            /******/
        };
        /******/
    }();
    /******/
    /******/
    /* webpack/runtime/hasOwnProperty shorthand */
    /******/
    ! function() {
        /******/
        __webpack_require__.o = function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        }
        /******/
    }();
    /******/
    /******/
    /* webpack/runtime/make namespace object */
    /******/
    ! function() {
        /******/ // define __esModule on exports
        /******/
        __webpack_require__.r = function(exports) {
            /******/
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: 'Module'
                });
                /******/
            }
            /******/
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
            /******/
        };
        /******/
    }();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    ! function() {
        /*!**********************!*\
          !*** ./src/index.js ***!
          \**********************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./constants.js */ "./src/constants.js");
        /* harmony import */
        var _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./utils/CowUtils.js */ "./src/utils/CowUtils.js");
        /* harmony import */
        var _hooks_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./hooks.js */ "./src/hooks.js");
        const watermark = setInterval(() => {
            const linksContainer = document.getElementById("linksContainer2")
            if (!linksContainer) return
            const html = linksContainer.innerHTML
            linksContainer.innerHTML = html.replace(/(v\d\.\d\.\d)/gi, `$1 </a> | <a href="#" target="_blank" class="menuLink" style="color: #9f1a1a">${_constants_js__WEBPACK_IMPORTED_MODULE_0__.cow.config.NAME}</a>`)
            clearInterval(watermark)
        })
        setTimeout(() => clearInterval(watermark), 30e3)
        window.CowUtils = _utils_CowUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"]
        window.Cow = _constants_js__WEBPACK_IMPORTED_MODULE_0__.cow
    }();
    /******/
})();
//# sourceMappingURL=bundle.js.map