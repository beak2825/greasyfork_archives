(function() {
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
                        this.camera = _constants_js__WEBPACK_IMPORTED_MODULE_1__.camera
                        this.renderer = _constants_js__WEBPACK_IMPORTED_MODULE_1__.renderer
                    }
                    addRender(renderKey, renderFunc) {
                        this.renderer.addRender(renderKey, renderFunc)
                    }
                    deleteRender(renderKey) {
                        this.renderer.renders.delete(renderKey)
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
                    camera: function() {
                        return /* binding */ camera;
                    },
                    /* harmony export */
                    cow: function() {
                        return /* binding */ cow;
                    },
                    /* harmony export */
                    renderer: function() {
                        return /* binding */ renderer;
                    },
                });
                /* harmony import */
                var _Cow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Cow.js */ "./src/Cow.js");
                /* harmony import */
                var _modules_render_Camera_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./modules/render/Camera.js */ "./src/modules/render/Camera.js");
                /* harmony import */
                var _modules_render_Renderer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__( /*! ./modules/render/Renderer.js */ "./src/modules/render/Renderer.js");
                const camera = new _modules_render_Camera_js__WEBPACK_IMPORTED_MODULE_7__["default"]()
                const renderer = new _modules_render_Renderer_js__WEBPACK_IMPORTED_MODULE_8__["default"]()
                const cow = new _Cow_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
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
                    }
                    updateFrame() {
                        this.nowUpdate = Date.now()
                        this.delta = this.nowUpdate - this.lastUpdate
                        this.lastUpdate = this.nowUpdate
                        requestAnimationFrame(this.updateFrame.bind(this))
                        this._updateAll()
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
                module.exports = JSON.parse('{"NAME":"Cow.JS","VERSION":"1.0.0","maxScreenWidth":1920,"maxScreenHeight":1080,"mapScale":14400,"riverWidth":724,"gatherAngle":1.208304866765305,"hitAngle":1.5707963267948966,"shieldAngle":1.0471975511965976,"gatherWiggle":10,"designations":{"plugins":{"AUTO_RECONECT":"auto-reconect","CHECK_PLACEMENT":"check-placement"},"packets":{"INIT_DATA":"A","DISCONNECT":"B","SETUP_GAME":"C","ADD_PLAYER":"D","REMOVE_PLAYER":"E","UPDATE_PLAYERS":"a","UPDATE_LEADERBOARD":"G","LOAD_GAME_OBJECT":"H","LOAD_AI":"I","ANIMATE_AI":"J","GATHER_ANIMATION":"K","WIGGLE_GAME_OBJECT":"L","SHOOT_TURRET":"M","UPDATE_PLAYER_VALUE":"N","UPDATE_HEALTH":"O","KILL_PLAYER":"P","KILL_OBJECT":"Q","KILL_OBJECTS":"R","UPDATE_ITEM_COUNTS":"S","UPDATE_AGE":"T","UPDATE_UPGRADES":"U","UPDATE_ITEMS":"V","ADD_PROJECTILE":"X","REMOVE_PROJECTILE":"Y","SERVER_SHUTDOWN_NOTICE":"Z","ADD_ALLIANCE":"g","DELETE_ALLIANCE":"1","ALLIANCE_NOTIFICATION":"2","SET_PLAYER_TEAM":"3","SET_ALLIANCE_PLAYERS":"4","UPDATE_STORE_ITEMS":"5","RECEIVE_CHAT":"6","UPDATE_MINIMAP":"7","SHOW_TEXT":"8","PING_MAP":"9","PING_SOCKET_RESPONSE":"0","ALLIANCE_JOIN_REQUEST":"P","KICK_FROM_CLAN":"Q","SEND_ALLIANCE_JOIN":"b","CREATE_ALLIANCE":"L","LEAVE_ALLIANCE":"N","STORE_EQUIP":"c","CHAT_MESSAGE":"6","RMD":"E","ATTACK_STATE":"d","MOVE_DIR":"a","MAP_PING":"S","AUTO_ATTACK":"K","SELECT_BUILD":"G","SPAWN":"M","SELECT_UPGRADE":"H","LOOK_DIR":"D","PING_SOCKET":"0"},"items":{"FOOD":0,"WALL":1,"SPIKE":2,"MILL":3,"TRAP":4,"TURRET":5}}}');
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