// ==UserScript==
// @name         thingz
// @description  https://github.com/Cazka/thingz
// @version      3.2.0
// @author       Cazka
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?domain=diep.io
// @namespace    https://greasyfork.org/users/541070
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480655/thingz.user.js
// @updateURL https://update.greasyfork.org/scripts/480655/thingz.meta.js
// ==/UserScript==
(() => {
    const _window = 'undefined' == typeof unsafeWindow ? window : unsafeWindow;
    if (_window.thingz) return;
 
    //thingz start
    var thingz;
    /******/ (() => {
        // webpackBootstrap
        /******/ 'use strict';
        /******/ // The require scope
        /******/ var __webpack_require__ = {};
        /******/
        /************************************************************************/
        /******/ /* webpack/runtime/define property getters */
        /******/ (() => {
            /******/ // define getter functions for harmony exports
            /******/ __webpack_require__.d = (exports, definition) => {
                /******/ for (var key in definition) {
                    /******/ if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                        /******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                        /******/
                    }
                    /******/
                }
                /******/
            };
            /******/
        })();
        /******/
        /******/ /* webpack/runtime/hasOwnProperty shorthand */
        /******/ (() => {
            /******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
            /******/
        })();
        /******/
        /******/ /* webpack/runtime/make namespace object */
        /******/ (() => {
            /******/ // define __esModule on exports
            /******/ __webpack_require__.r = (exports) => {
                /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                    /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                    /******/
                }
                /******/ Object.defineProperty(exports, '__esModule', { value: true });
                /******/
            };
            /******/
        })();
        /******/
        /************************************************************************/
        var __webpack_exports__ = {};
        // ESM COMPAT FLAG
        __webpack_require__.r(__webpack_exports__);
 
        // EXPORTS
        __webpack_require__.d(__webpack_exports__, {
            apis: () => /* reexport */ apis_namespaceObject,
            core: () => /* reexport */ core_namespaceObject,
            extensions: () => /* reexport */ extensions_namespaceObject,
            tools: () => /* reexport */ tools_namespaceObject,
            types: () => /* reexport */ types_namespaceObject,
        });
 
        // NAMESPACE OBJECT: ./src/apis/index.ts
        var apis_namespaceObject = {};
        __webpack_require__.r(apis_namespaceObject);
        __webpack_require__.d(apis_namespaceObject, {
            arena: () => arena,
            camera: () => camera,
            game: () => game,
            input: () => input,
            minimap: () => minimap,
            player: () => player,
            playerMovement: () => playerMovement,
            scaling: () => scaling,
        });
 
        // NAMESPACE OBJECT: ./src/core/index.ts
        var core_namespaceObject = {};
        __webpack_require__.r(core_namespaceObject);
        __webpack_require__.d(core_namespaceObject, {
            CanvasKit: () => CanvasKit,
            EventEmitter: () => EventEmitter,
            Movement: () => Movement,
            Vector: () => Vector,
        });
 
        // NAMESPACE OBJECT: ./src/extensions/index.ts
        var extensions_namespaceObject = {};
        __webpack_require__.r(extensions_namespaceObject);
        __webpack_require__.d(extensions_namespaceObject, {
            debugTool: () => debugTool,
            entityManager: () => entityManager,
        });
 
        // NAMESPACE OBJECT: ./src/tools/index.ts
        var tools_namespaceObject = {};
        __webpack_require__.r(tools_namespaceObject);
        __webpack_require__.d(tools_namespaceObject, {
            backgroundOverlay: () => backgroundOverlay,
            overlay: () => overlay,
        });
 
        // NAMESPACE OBJECT: ./src/types/index.ts
        var types_namespaceObject = {};
        __webpack_require__.r(types_namespaceObject);
        __webpack_require__.d(types_namespaceObject, {
            Entity: () => Entity,
            EntityColor: () => EntityColor,
            EntityType: () => EntityType,
        }); // CONCATENATED MODULE: ./src/core/vector.ts
 
        class Vector {
            x;
            y;
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            static len(v) {
                return Math.sqrt(v.x ** 2 + v.y ** 2);
            }
            static round(v) {
                return new Vector(Math.round(v.x), Math.round(v.y));
            }
            static scale(r, v) {
                return new Vector(r * v.x, r * v.y);
            }
            static unscale(r, v) {
                return new Vector(v.x / r, v.y / r);
            }
            static add(u, v) {
                return new Vector(u.x + v.x, u.y + v.y);
            }
            static subtract(u, v) {
                return new Vector(u.x - v.x, u.y - v.y);
            }
            static multiply(u, v) {
                return new Vector(u.x * v.x, u.y * v.y);
            }
            static divide(u, v) {
                return new Vector(u.x / v.x, u.y / v.y);
            }
            static distance(u, v) {
                return Vector.len(Vector.subtract(u, v));
            }
            /**
             * Calculates the [centroid](https://en.wikipedia.org/wiki/Centroid)
             */
            static centroid(...vertices) {
                const sum = vertices.reduce((acc, vec) => Vector.add(acc, vec), new Vector(0, 0));
                const centroid = Vector.scale(1 / vertices.length, sum);
                return centroid;
            }
            /**
             * Calcutes the radius from a set of vertices that are placed on a circle
             */
            static radius(...vertices) {
                const centroid = Vector.centroid(...vertices);
                const distance = vertices.reduce((acc, vec) => acc + Vector.distance(centroid, vec), 0);
                const radius = distance / vertices.length;
                return radius;
            }
        } // CONCATENATED MODULE: ./src/core/canvas_kit.ts
 
        class CanvasKit {
            /**
             * If you need a canvas then create it with this method.
             */
            static createCanvas() {
                const canvas = document.createElement('canvas');
                canvas.className = 'CanvasKit-bypass';
                canvas.style.pointerEvents = 'none';
                canvas.style.position = 'fixed';
                canvas.style['z-index'] = 1;
                canvas.style.top = '0px';
                canvas.style.left = '0px';
                canvas.style.right = '0px';
                canvas.style.bottom = '0px';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                return canvas;
            }
            /**
             * The consumer will be called before.
             */
            static hookRAF(consumer) {
                _window.requestAnimationFrame = new Proxy(_window.requestAnimationFrame, {
                    apply(target, thisArg, args) {
                        consumer();
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            /**
             * The consumer will be called before
             */
            static hookCtx(method, consumer) {
                const target = _window.CanvasRenderingContext2D.prototype;
                target[method] = new Proxy(target[method], {
                    apply(target, thisArg, args) {
                        if (thisArg.canvas.className !== 'CanvasKit-bypass') consumer(target, thisArg, args);
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            /**
             * replaces the function. Use `return Reflect.apply(target, thisArg, args);` in
             * your function to call the original function.
             */
            static overrideCtx(method, func) {
                const target = _window.CanvasRenderingContext2D.prototype;
                target[method] = new Proxy(target[method], {
                    apply(target, thisArg, args) {
                        if (thisArg.canvas.className !== 'CanvasKit-bypass') return func(target, thisArg, args);
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            /**
             *
             * Calls the callback method when a polygon with `numVertices` is being drawn.
             */
            static hookPolygon(numVertices, cb) {
                let index = 0;
                let vertices = [];
                const onFillPolygon = (ctx) => {
                    cb(vertices, ctx);
                };
                CanvasKit.hookCtx('beginPath', (target, thisArg, args) => {
                    index = 1;
                    vertices = [];
                });
                CanvasKit.hookCtx('moveTo', (target, thisArg, args) => {
                    if (index === 1) {
                        index++;
                        vertices.push(new Vector(args[0], args[1]));
                        return;
                    }
                    index = 0;
                });
                CanvasKit.hookCtx('lineTo', (target, thisArg, args) => {
                    if (index >= 2 && index <= numVertices) {
                        index++;
                        vertices.push(new Vector(args[0], args[1]));
                        return;
                    }
                    index = 0;
                });
                CanvasKit.hookCtx('fill', (target, thisArg, args) => {
                    if (index === numVertices + 1) {
                        index++;
                        onFillPolygon(thisArg);
                        return;
                    }
                    index = 0;
                });
            }
        } // CONCATENATED MODULE: ./src/core/event_emitter.ts
 
        class EventEmitter extends EventTarget {
            /**
             *
             * @param {string} eventName The name of the event
             * @param  {...any} args The arguments that will be passed to the listener
             */
            emit(eventName, ...args) {
                this.dispatchEvent(new CustomEvent(eventName, { detail: args }));
            }
            /**
             *
             * @param {string} eventName The name of the event
             * @param {EventCallback} listener The callback function
             */
            on(eventName, listener) {
                this.addEventListener(eventName, (e) => Reflect.apply(listener, this, e.detail));
            }
            /**
             *
             * @param {string} eventName The name of the event
             * @param {EventCallback} listener The callback function
             */
            once(eventName, listener) {
                this.addEventListener(eventName, (e) => Reflect.apply(listener, this, e.detail), { once: true });
            }
            /**
             *
             * @param {string} eventName The name of the event
             * @param {EventCallback} listener The callback function
             */
            off(eventName, listener) {
                this.removeEventListener(eventName, listener);
            }
        } // CONCATENATED MODULE: ./src/apis/game.ts
 
        /**
         * Events:
         * - frame: Emitted every frame. Can be used for things that should be executed on every frame
         * - frame_end: Emitted after `frame` and is mainly used internally to update position variables
         * - state => (state): Emitted whenever the game changes its state: 'home', 'game', 'stats', 'loading', 'captcha
         * - s_home: Emitted when the game changes its state to home
         * - s_game: Emitted when the game changes its state to game
         * - s_stats: Emitted when the game changes its state to stats
         * - s_loading: Emitted when the game changes its state to loading
         * - s_captcha: Emitted when the game changes its state to captcha
         */
        class Game extends EventEmitter {
            #ready = false;
            #shadowRoot;
            constructor() {
                super();
                CanvasKit.hookRAF(() => this.#onframe());
            }
            #onframe() {
                if (!this.#ready && _window.input !== undefined) {
                    this.#ready = true;
                    this.#onready();
                }
                super.emit('frame');
                super.emit('frame_end');
            }
            #onready() {
                setTimeout(() => super.emit('ready'), 100);
                this.#shadowRoot = document.querySelector('d-base').shadowRoot;
                new MutationObserver((mutationList, observer) => {
                    mutationList.forEach((mutation) => {
                        if (mutation.addedNodes.length === 0) {
                            return;
                        }
                        super.emit('state', this.state);
                        super.emit(`s_${this.state}`);
                        return;
                    });
                }).observe(this.#shadowRoot, { childList: true });
            }
            get state() {
                return this.#shadowRoot.querySelector('.screen').tagName.slice(2).toLowerCase();
            }
            get inHome() {
                return this.state == 'home';
            }
            get inGame() {
                return this.state == 'game';
            }
            get inStats() {
                return this.state == 'stats';
            }
            get inLoading() {
                return this.state == 'loading';
            }
            get isCaptcha() {
                return this.state == 'captcha';
            }
        }
        const game = new Game(); // CONCATENATED MODULE: ./src/apis/minimap.ts
 
        /**
         * The Minimap API
         */
        class Minimap {
            #minimapDim = new Vector(1, 1);
            #minimapPos = new Vector(0, 0);
            #viewportDim = new Vector(1, 1);
            #viewportPos = new Vector(1, 1);
            #arrowPos = new Vector(0.5, 0.5);
            #drawViewport = false;
            constructor() {
                game.once('ready', () => {
                    _window.input.set_convar('ren_minimap_viewport', 'true');
                    _window.input.set_convar = new Proxy(_window.input.set_convar, {
                        apply: (target, thisArg, args) => {
                            if (args[0] === 'ren_minimap_viewport') {
                                this.#drawViewport = args[1];
                                return;
                            }
                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                });
                this.#minimapHook();
                this.#viewportHook();
                this.#arrowHook();
            }
            get minimapDim() {
                return this.#minimapDim;
            }
            get minimapPos() {
                return this.#minimapPos;
            }
            get viewportDim() {
                return this.#viewportDim;
            }
            get viewportPos() {
                return this.#viewportPos;
            }
            get arrowPos() {
                return this.#arrowPos;
            }
            #minimapHook() {
                CanvasKit.hookCtx('strokeRect', (target, thisArg, args) => {
                    const transform = thisArg.getTransform();
                    this.#minimapDim = new Vector(transform.a, transform.d);
                    this.#minimapPos = new Vector(transform.e, transform.f);
                });
            }
            #viewportHook() {
                CanvasKit.overrideCtx('fillRect', (target, thisArg, args) => {
                    const transform = thisArg.getTransform();
                    if (thisArg.globalAlpha !== 0.1) {
                        return Reflect.apply(target, thisArg, args);
                    }
                    if (
                        Math.abs(transform.a / transform.d - _window.innerWidth / _window.innerHeight) >
                        (_window.innerWidth / _window.innerHeight) * 0.000_05
                    ) {
                        return Reflect.apply(target, thisArg, args);
                    }
                    this.#viewportDim = new Vector(transform.a, transform.d);
                    this.#viewportPos = new Vector(transform.e, transform.f);
                    if (this.#drawViewport) {
                        return Reflect.apply(target, thisArg, args);
                    }
                });
            }
            #arrowHook() {
                CanvasKit.hookPolygon(3, (vertices, ctx) => {
                    const side1 = Math.round(Vector.distance(vertices[0], vertices[1]));
                    const side2 = Math.round(Vector.distance(vertices[0], vertices[2]));
                    const side3 = Math.round(Vector.distance(vertices[1], vertices[2]));
                    if (side1 === side2 && side2 === side3) return;
                    const centroid = Vector.centroid(...vertices);
                    const arrowPos = Vector.subtract(centroid, this.#minimapPos);
                    const position = Vector.divide(arrowPos, this.#minimapDim);
                    this.#arrowPos = position;
                });
            }
        }
        const minimap = new Minimap(); // CONCATENATED MODULE: ./src/apis/camera.ts
 
        class Camera {
            #position;
            constructor() {
                game.on('frame_end', () => {
                    const center = Vector.add(minimap.viewportPos, Vector.unscale(2, minimap.viewportDim));
                    const cameraPos = Vector.subtract(center, minimap.minimapPos);
                    const normalized = Vector.divide(cameraPos, minimap.minimapDim);
                    this.#position = arena.scale(normalized);
                });
            }
            get position() {
                return this.#position;
            }
        }
        const camera = new Camera(); // CONCATENATED MODULE: ./src/apis/scaling.ts
 
        class Scaling {
            #scalingFactor = 1;
            #drawSolidBackground = false;
            constructor() {
                // TODO: game.on('ready')
                setTimeout(() => {
                    _window.input.set_convar = new Proxy(_window.input.set_convar, {
                        apply: (target, thisArg, args) => {
                            if (args[0] === 'ren_solid_background') this.#drawSolidBackground = args[1];
                            else Reflect.apply(target, thisArg, args);
                        },
                    });
                }, 1000);
                CanvasKit.overrideCtx('stroke', (target, thisArg, args) => {
                    if (thisArg.fillStyle !== '#cdcdcd') {
                        return Reflect.apply(target, thisArg, args);
                    }
                    if (thisArg.globalAlpha === 0) {
                        return Reflect.apply(target, thisArg, args);
                    }
                    this.#scalingFactor = thisArg.globalAlpha * 10;
                    if (!this.#drawSolidBackground) {
                        return Reflect.apply(target, thisArg, args);
                    }
                });
            }
            get windowRatio() {
                return Math.max(_window.innerWidth / 1920, _window.innerHeight / 1080);
            }
            get scalingFactor() {
                return this.#scalingFactor;
            }
            get fov() {
                return this.#scalingFactor / this.windowRatio;
            }
            /**
             *
             * @param {Vector} v The vector in canvas units
             * @returns {Vector} The vector in arena units
             */
            toArenaUnits(v) {
                return Vector.round(Vector.unscale(this.#scalingFactor, v));
            }
            /**
             *
             * @param {Vector} v The vector in arena units
             * @returns {Vector} The vector in canvas units
             */
            toCanvasUnits(v) {
                return Vector.round(Vector.scale(this.#scalingFactor, v));
            }
            /**
             * Will translate coordinates from canvas to arena
             * @param {Vector} canvasPos The canvas coordinates
             * @returns {Vector} The `canvasPos` translated to arena coordinates
             */
            toArenaPos(canvasPos) {
                const direction = Vector.subtract(canvasPos, this.screenToCanvas(new Vector(_window.innerWidth / 2, _window.innerHeight / 2)));
                const scaled = this.toArenaUnits(direction);
                const arenaPos = Vector.add(scaled, camera.position);
                return arenaPos;
            }
            /**
             * Will translate coordinates from arena to canvas
             * @param {Vector} arenaPos The arena coordinates
             * @returns {Vector} The `arenaPos` translated to canvas coordinates
             */
            toCanvasPos(arenaPos) {
                const direction = Vector.subtract(arenaPos, camera.position);
                const scaled = this.toCanvasUnits(direction);
                const canvasPos = Vector.add(scaled, this.screenToCanvas(new Vector(_window.innerWidth / 2, _window.innerHeight / 2)));
                return canvasPos;
            }
            screenToCanvasUnits(n) {
                return n * _window.devicePixelRatio;
            }
            canvasToScreenUnits(n) {
                return n / _window.devicePixelRatio;
            }
            /**
             * Will translate coordinates from screen to canvas
             * @param v The screen coordinates
             * @returns The canvas coordinates
             */
            screenToCanvas(v) {
                return Vector.scale(_window.devicePixelRatio, v);
            }
            /**
             * Will translate coordinates from canvas to screen
             * @param v The canvas coordinates
             * @returns the screen coordinates
             */
            canvasToScreen(v) {
                return Vector.scale(1 / _window.devicePixelRatio, v);
            }
        }
        const scaling = new Scaling(); // CONCATENATED MODULE: ./src/apis/arena.ts
 
        class Arena {
            #size = 1;
            constructor() {
                setInterval(() => {
                    const ratio = Vector.divide(minimap.minimapDim, minimap.viewportDim);
                    const arenaDim = Vector.multiply(ratio, scaling.screenToCanvas(new Vector(_window.innerWidth, _window.innerHeight)));
                    const arenaSize = scaling.toArenaUnits(arenaDim);
                    this.#size = arenaSize.x;
                }, 16);
            }
            /**
             * @returns {number} The Arena size in arena units
             */
            get size() {
                return this.#size;
            }
            /**
             *
             * @param {Vector} vector The vector in [0, 1] coordinates
             * @returns {Vector} The scaled vector in [-Arena.size/2, Arena.size/2] coordinates
             */
            scale(vector) {
                const scale = (value) => Math.round(this.#size * (value - 0.5));
                return new Vector(scale(vector.x), scale(vector.y));
            }
            /**
             *
             * @param {Vector} vector - The scaled vector in [-Arena.size/2, Arena.size/2] coordinates
             * @returns {Vector} The unscaled vector in [0, 1] coordinates
             */
            unscale(vector) {
                const unscale = (value) => value / this.#size + 0.5;
                return new Vector(unscale(vector.x), unscale(vector.y));
            }
        }
        const arena = new Arena(); // CONCATENATED MODULE: ./src/apis/input.ts
 
        const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
        class Input {
            #gameCanvas;
            constructor() {
                game.once('ready', () => {
                    this.#gameCanvas = document.getElementById('canvas');
                });
            }
            keyDown(key) {
                if (typeof key == 'string') {
                    key = this.#toKeyCode(key);
                }
                const keydown = new KeyboardEvent('keydown', {
                    key: '',
                    code: '',
                    keyCode: key,
                    which: key,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                _window.dispatchEvent(keydown);
            }
            keyUp(key) {
                if (typeof key == 'string') {
                    key = this.#toKeyCode(key);
                }
                const keyup = new KeyboardEvent('keyup', {
                    key: '',
                    code: '',
                    keyCode: key,
                    which: key,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                _window.dispatchEvent(keyup);
            }
            async keyPress(key) {
                this.keyDown(key);
                await sleep(200);
                this.keyUp(key);
                await sleep(10);
            }
            mouse(x, y) {
                const mousemove = new MouseEvent('mousemove', {
                    clientX: x,
                    clientY: y,
                    cancelable: true,
                    composed: true,
                    bubbles: true,
                });
                this.#gameCanvas.dispatchEvent(mousemove);
            }
            #toKeyCode(key) {
                if (key.length != 1) {
                    throw new Error(`thingz: Unsupported key: ${key}`);
                }
                return key.toUpperCase().charCodeAt(0);
            }
        }
        const input = new Input(); // CONCATENATED MODULE: ./src/apis/gamepad.ts
 
        class Gamepad {
            #axes;
            #buttons;
            connected;
            /**
             * Emulates a Gampad
             * when `gamepad.connected` is set to `true` the game will
             * ignore following keyboard inputs:
             * 		W, A, S, D, upArrow, leftArrow, downArrow, rightArray
             *      leftMouse, rightMouse, Spacebar, Shift,
             *      MouseMovement to change tank angle
             * these are also the only keys we emulate with this gamepad
             *
             */
            constructor() {
                this.#axes = [0, 0, 0, 0];
                this.#buttons = [...Array(17)].map((x) => {
                    return { pressed: false };
                });
                this.connected = false;
                _window.navigator.getGamepads = new Proxy(_window.navigator.getGamepads, {
                    apply: (target, thisArg, args) => {
                        if (this.connected) return [this.#toGamepad()];
                        return Reflect.apply(target, thisArg, args);
                    },
                });
            }
            set x(value) {
                this.#axes[0] = value;
            }
            set y(value) {
                this.#axes[1] = value;
            }
            set mx(value) {
                this.#axes[2] = value;
            }
            set my(value) {
                this.#axes[3] = value;
            }
            set leftMouse(value) {
                this.#buttons[7].pressed = value;
            }
            set rightMouse(value) {
                this.#buttons[6].pressed = value;
            }
            get x() {
                return this.#axes[0];
            }
            get y() {
                return this.#axes[1];
            }
            get mx() {
                return this.#axes[2];
            }
            get my() {
                return this.#axes[3];
            }
            get leftMouse() {
                return this.#buttons[7].pressed;
            }
            get rightMouse() {
                return this.#buttons[6].pressed;
            }
            #toGamepad() {
                return {
                    axes: this.#axes,
                    buttons: this.#buttons,
                    mapping: 'standard',
                };
            }
        }
        const gamepad = new Gamepad(); // CONCATENATED MODULE: ./src/core/movement.ts
 
        class Movement {
            #position = new Vector(0, 0);
            #velocity = new Vector(0, 0);
            /*
             * used for average velocity calculation
             */
            #velocitySamplesSize = 10;
            #velocitySamples = [];
            #velocitySamplesIndex = 0;
            #velocityLastNow = performance.now();
            get position() {
                return this.#position;
            }
            /**
             * Velocity in [diep_]units / second
             */
            get velocity() {
                return this.#velocity;
            }
            /**
             * Predict where this object will be after `time`
             * @param time The time in ms.
             */
            predictPos(time) {
                const duration = (time + performance.now() - this.#velocityLastNow) / 1000;
                return Vector.add(this.#position, Vector.scale(duration, this.#velocity));
            }
            updatePos(newPos) {
                this.#updateVelocity(newPos);
                this.#position = newPos;
            }
            #updateVelocity(newPos) {
                const now = performance.now();
                const time = (now - this.#velocityLastNow) / 1000;
                if (time === 0) return;
                this.#velocityLastNow = now;
                const velocity = Vector.unscale(time, Vector.subtract(newPos, this.#position));
                // add current velocity to our samples array
                this.#velocitySamples[this.#velocitySamplesIndex++] = velocity;
                this.#velocitySamplesIndex %= this.#velocitySamplesSize;
                // calculate the average velocity
                this.#velocity = Vector.unscale(
                    this.#velocitySamples.length,
                    this.#velocitySamples.reduce((acc, x) => Vector.add(acc, x))
                );
            }
        } // CONCATENATED MODULE: ./src/apis/player_movement.ts
 
        class PlayerMovement extends Movement {
            /**
             * Using the minimap arrow to get the player position and velocity
             */
            constructor() {
                super();
                game.on('frame_end', () => super.updatePos(arena.scale(minimap.arrowPos)));
            }
        }
        const playerMovement = new PlayerMovement(); // CONCATENATED MODULE: ./src/apis/player.ts
 
        const player_sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
        class Player extends EventEmitter {
            #isDead = true;
            #mouseLock = false;
            #mouseCanvasPos = new Vector(0, 0);
            #mousePos = new Vector(0, 0);
            #username = _window.localStorage.name;
            #gamemode = _window.localStorage.gamemode;
            #level = 1;
            #tank = 'Tank';
            constructor() {
                super();
                game.once('ready', () => {
                    //Check dead or alive
                    game.on('frame', () => {
                        const isDead = !_window.input.should_prevent_unload();
                        if (this.#isDead == isDead) return;
                        this.#isDead = isDead;
                        if (this.#isDead) this.#ondead();
                        else this.#onspawn();
                    });
                    //update mouse position
                    game.on('frame', () => {
                        this.#mousePos = scaling.toArenaPos(this.#mouseCanvasPos);
                    });
                    //Mouse events
                    const canvas = document.getElementById('canvas');
                    canvas.onmousemove = new Proxy(canvas.onmousemove, {
                        apply: (target, thisArg, args) => {
                            if (this.#mouseLock) return;
                            this.#onmousemove(args[0]);
                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                    canvas.onmousedown = new Proxy(canvas.onmousedown, {
                        apply: (target, thisArg, args) => {
                            if (this.#mouseLock) return;
                            this.#onmousedown(args[0]);
                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                    canvas.onmouseup = new Proxy(canvas.onmouseup, {
                        apply: (target, thisArg, args) => {
                            if (this.#mouseLock) return;
                            this.#onmouseup(args[0]);
                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                    //Key events
                    _window.onkeydown = new Proxy(_window.onkeydown, {
                        apply: (target, thisArg, args) => {
                            this.#onkeydown(args[0]);
                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                    _window.onkeyup = new Proxy(_window.onkeyup, {
                        apply: (target, thisArg, args) => {
                            this.#onkeyup(args[0]);
                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                    // username
                    _window.input.trySpawn = new Proxy(_window.input.trySpawn, {
                        apply: (target, thisArg, args) => {
                            this.#username = args[0];
                            return Reflect.apply(target, thisArg, args);
                        },
                    });
                    // tank and level event listener
                    CanvasKit.hookCtx('fillText', (target, thisArg, args) => {
                        const text = args[0];
                        const match = text.match(/^Lvl (\d+) (\w+\s?\w*)$/);
                        if (match == null) {
                            return;
                        }
                        const newLevel = Number(match[1]);
                        const newTank = match[2];
                        // make sure to trigger events for all levels in between.
                        while (newLevel > this.#level + 1) {
                            super.emit('level', ++this.#level);
                        }
                        if (newLevel !== this.#level) super.emit('level', newLevel);
                        if (newTank !== this.#tank) super.emit('tank', newTank);
                        this.#level = newLevel;
                        this.#tank = match[2];
                    });
                });
            }
            get position() {
                return playerMovement.position;
            }
            get velocity() {
                return playerMovement.velocity;
            }
            get mouse() {
                return this.#mousePos;
            }
            get isDead() {
                return this.#isDead;
            }
            get gamemode() {
                return this.#gamemode;
            }
            get level() {
                return this.#level;
            }
            get tank() {
                return this.#tank;
            }
            /**
             * Predict where this object will be after `time`
             * @param time The time in ms
             */
            predictPos(time) {
                return playerMovement.predictPos(time);
            }
            async #ondead() {
                await player_sleep(50);
                super.emit('dead');
            }
            async #onspawn() {
                this.#gamemode = _window.localStorage.gamemode;
                await player_sleep(50);
                super.emit('spawn');
            }
            useGamepad(value) {
                gamepad.connected = value;
            }
            async spawn(name = this.#username) {
                if (!this.#isDead) {
                    return;
                }
                _window.input.trySpawn(name);
            }
            async upgrade_stat(id, level) {
                if (id < 1 || id > 8) throw `thingz: ${id} is not a supported stat`;
                input.keyDown(85);
                for (let i = 0; i < level; i++) {
                    await input.keyPress(48 + id);
                }
                input.keyUp(85);
                await player_sleep(250);
            }
            async upgrade_tank(index) {
                index -= 1;
                const x_index = index % 2;
                const y_index = Math.floor(index / 2);
                const x = scaling.screenToCanvasUnits(scaling.windowRatio * (x_index * 115 + 97.5));
                const y = scaling.screenToCanvasUnits(scaling.windowRatio * (y_index * 110 + 120));
                this.#mouseLock = true;
                input.mouse(x, y);
                await input.keyPress(1);
                // wait 200 ms before disabling mouselock
                await player_sleep(200);
                this.#mouseLock = false;
                // wait 1500 ms for the animation to finish
                await player_sleep(1500);
            }
            moveTo(arenaPos) {
                if (gamepad.connected) {
                    const direction = Vector.subtract(arenaPos, this.position);
                    const distance = Vector.len(direction);
                    if (distance === 0) {
                        gamepad.x = 0;
                        gamepad.y = 0;
                        return;
                    }
                    //max speed
                    const velocity = Vector.scale(1 / distance, direction);
                    gamepad.x = velocity.x;
                    gamepad.y = velocity.y;
                } else {
                    const direction = Vector.subtract(arenaPos, this.position);
                    if (direction.x > 0) {
                        input.keyUp('a');
                        input.keyDown('d');
                    } else if (direction.x < 0) {
                        input.keyUp('d');
                        input.keyDown('a');
                    } else {
                        input.keyUp('a');
                        input.keyUp('d');
                    }
                    if (direction.y > 0) {
                        input.keyUp('w');
                        input.keyDown('s');
                    } else if (direction.y < 0) {
                        input.keyUp('s');
                        input.keyDown('w');
                    } else {
                        input.keyUp('w');
                        input.keyUp('s');
                    }
                }
            }
            lookAt(arenaPos) {
                const position = scaling.toCanvasPos(arenaPos);
                input.mouse(position.x, position.y);
                this.#onmousemove({ clientX: position.x, clientY: position.y });
            }
            #onmousemove(e) {
                this.#mouseCanvasPos = scaling.screenToCanvas(new Vector(e.clientX, e.clientY));
                if (gamepad.connected) {
                    const arenaPos = scaling.toArenaPos(this.#mouseCanvasPos);
                    const direction = Vector.subtract(arenaPos, this.position);
                    let axes = Vector.scale(scaling.fov / 1200 / 1.1, direction);
                    const length = Vector.len(axes);
                    if (length !== 0 && length < 0.15) {
                        axes = Vector.scale(0.15 / length, axes);
                    }
                    gamepad.mx = axes.x;
                    gamepad.my = axes.y;
                }
            }
            #onmousedown(e) {
                if (gamepad.connected) this.#onkeydown({ keyCode: e.which });
            }
            #onmouseup(e) {
                if (gamepad.connected) this.#onkeyup({ keyCode: e.which });
            }
            #onkeydown(e) {
                super.emit('keydown', e.keyCode);
                if (gamepad.connected) {
                    switch (e.keyCode) {
                        case 37:
                        case 65:
                            gamepad.x = -1;
                            break;
                        case 40:
                        case 83:
                            gamepad.y = 1;
                            break;
                        case 38:
                        case 87:
                            gamepad.y = -1;
                            break;
                        case 39:
                        case 68:
                            gamepad.x = 1;
                            break;
                        case 1:
                        case 32:
                            gamepad.leftMouse = true;
                            break;
                        case 3:
                        case 16:
                            gamepad.rightMouse = true;
                            break;
                    }
                }
            }
            #onkeyup(e) {
                super.emit('keyup', e.keyCode);
                if (gamepad.connected) {
                    switch (e.keyCode) {
                        case 37:
                        case 65:
                            gamepad.x = 0;
                            break;
                        case 40:
                        case 83:
                            gamepad.y = 0;
                            break;
                        case 38:
                        case 87:
                            gamepad.y = 0;
                            break;
                        case 39:
                        case 68:
                            gamepad.x = 0;
                            break;
                        case 1:
                        case 32:
                            gamepad.leftMouse = false;
                            break;
                        case 3:
                        case 16:
                            gamepad.rightMouse = false;
                            break;
                    }
                }
            }
        }
        const player = new Player(); // CONCATENATED MODULE: ./src/apis/index.ts // CONCATENATED MODULE: ./src/core/index.ts // CONCATENATED MODULE: ./src/types/entity.ts
 
        var EntityType;
        (function (EntityType) {
            EntityType[(EntityType['Player'] = 0)] = 'Player';
            EntityType[(EntityType['Bullet'] = 1)] = 'Bullet';
            EntityType[(EntityType['Drone'] = 2)] = 'Drone';
            EntityType[(EntityType['Trap'] = 3)] = 'Trap';
            EntityType[(EntityType['Square'] = 4)] = 'Square';
            EntityType[(EntityType['Triangle'] = 5)] = 'Triangle';
            EntityType[(EntityType['Pentagon'] = 6)] = 'Pentagon';
            EntityType[(EntityType['AlphaPentagon'] = 7)] = 'AlphaPentagon';
            EntityType[(EntityType['Crasher'] = 8)] = 'Crasher';
            EntityType[(EntityType['UNKNOWN'] = 9)] = 'UNKNOWN';
        })(EntityType || (EntityType = {}));
        var EntityColor;
        (function (EntityColor) {
            EntityColor['TeamBlue'] = '#00b2e1';
            EntityColor['TeamRed'] = '#f14e54';
            EntityColor['TeamPurple'] = '#bf7ff5';
            EntityColor['TeamGreen'] = '#00e16e';
            EntityColor['Square'] = '#ffe869';
            EntityColor['Triangle'] = '#fc7677';
            EntityColor['Pentagon'] = '#768dfc';
            EntityColor['AlphaPentagon'] = '#768dfc';
            EntityColor['Crasher'] = '#f177dd';
            EntityColor['NecromancerDrone'] = '#fcc376';
        })(EntityColor || (EntityColor = {}));
        const TeamColors = [EntityColor.TeamBlue, EntityColor.TeamRed, EntityColor.TeamPurple, EntityColor.TeamGreen];
        /**
         * Represents an ingame Entity.
         *
         * Holds minimal information currently.
         */
        class Entity extends Movement {
            type;
            parent;
            extras;
            constructor(type, parent, extras) {
                super();
                this.type = type;
                this.parent = parent;
                this.extras = extras;
            }
            updatePos(newPos) {
                super.updatePos(newPos);
            }
        } // CONCATENATED MODULE: ./src/extensions/extension.ts
 
        class Extension {
            onload;
            #loaded = false;
            constructor(onload) {
                this.onload = onload;
            }
            load() {
                if (this.#loaded) {
                    return;
                }
                this.#loaded = true;
                this.onload();
            }
        } // CONCATENATED MODULE: ./src/extensions/entity_manager.ts
 
        const random_id = () => Math.random().toString(36).slice(2, 5);
        /**
         * Entity Manager is used to access the information about the entities, that are currently drawn on the screen.
         * To access the entities the EntityManager exposes the EntityManager.entities field.
         */
        class EntityManager extends Extension {
            #entities = [];
            #entitiesLastFrame = this.#entities;
            constructor() {
                super(() => {
                    game.on('frame_end', () => {
                        this.#entitiesLastFrame = this.#entities;
                        this.#entities = [];
                    });
                    this.#triangleHook();
                    this.#squareHook();
                    this.#pentagonHook();
                    //when is a bullet being drawn?
                    //when is a player being drawn?
                    this.#playerHook();
                });
            }
            get entities() {
                return this.#entities;
            }
            /**
             *
             * @returns The own player entity
             */
            getPlayer() {
                const player = this.#entities.filter(
                    (entity) => entity.type == EntityType.Player && Vector.distance(entity.position, playerMovement.position) < 28
                );
                return player[0];
            }
            /**
             * Adds the entity to `#entities`.
             *
             * Will either find the entity in `#entitiesLastFrame` or create a new `Entity`.
             */
            #add(type, position, extras = {}) {
                let entity = this.#findEntity(type, position);
                if (!entity) {
                    const parent = this.#findParent(type, position);
                    entity = new Entity(type, parent, {
                        id: random_id(),
                        timestamp: performance.now(),
                        ...extras,
                    });
                }
                //TODO: remove radius from extras
                entity.extras.radius = extras.radius;
                entity.updatePos(position);
                this.#entities.push(entity);
            }
            /**
             * If an entity is newly created, try to find it's parent entity.
             */
            #findParent(type, position) {
                if (type == EntityType.Bullet) {
                    // TODO: do we want to change the parent entity to EntityType.Barrel in the future?
                    return this.#findEntity(EntityType.Player, position, 300);
                }
            }
            /**
             * Searches `#entitiesLastFrame` for the entity that is closest to `position`
             * @returns the entity or null if there is no match.
             */
            #findEntity(type, position, tolerance = 42) {
                let result = null;
                let shortestDistance = Infinity;
                this.#entitiesLastFrame.forEach((entity, i) => {
                    if (entity.type !== type) return;
                    const distance = Vector.distance(entity.position, position);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        result = entity;
                    }
                });
                if (shortestDistance > tolerance) {
                    return null;
                }
                return result;
            }
            #triangleHook() {
                CanvasKit.hookPolygon(3, (vertices, ctx) => {
                    const side1 = Math.round(Vector.distance(vertices[0], vertices[1]));
                    const side2 = Math.round(Vector.distance(vertices[0], vertices[2]));
                    const side3 = Math.round(Vector.distance(vertices[1], vertices[2]));
                    //ignore Minimap Arrow
                    if (side1 !== side2 || side2 !== side3) return;
                    //ignore Leader Arrow
                    if ('#000000' === ctx.fillStyle) return;
                    vertices = vertices.map((x) => scaling.toArenaPos(x));
                    const position = Vector.centroid(...vertices);
                    const radius = Math.round(Vector.radius(...vertices));
                    const color = ctx.fillStyle;
                    let type;
                    switch (radius) {
                        case 23:
                            //battleship drone
                            if (TeamColors.includes(color)) type = EntityType.Drone;
                            break;
                        case 30:
                            //base drone
                            if (TeamColors.includes(color)) type = EntityType.Drone;
                            break;
                        case 35:
                            //small crasher
                            if (EntityColor.Crasher === color) type = EntityType.Crasher;
                            break;
                        case 40:
                        case 41:
                        case 42:
                        case 43:
                        case 44:
                        case 45:
                        case 46:
                            //overseer/overlord drone
                            if (TeamColors.includes(color)) type = EntityType.Drone;
                            break;
                        case 55:
                            //big crasher
                            if (EntityColor.Crasher === color) type = EntityType.Crasher;
                            //triangle
                            if (EntityColor.Triangle === color) type = EntityType.Triangle;
                            break;
                    }
                    if (type === undefined) type = EntityType.UNKNOWN;
                    this.#add(type, position, { color, radius });
                });
            }
            #squareHook() {
                CanvasKit.hookPolygon(4, (vertices, ctx) => {
                    vertices = vertices.map((x) => scaling.toArenaPos(x));
                    const position = Vector.centroid(...vertices);
                    const radius = Math.round(Vector.radius(...vertices));
                    const color = ctx.fillStyle;
                    let type;
                    switch (radius) {
                        case 55:
                            //square
                            if (EntityColor.Square === color) type = EntityType.Square;
                            //necromancer drone
                            if (TeamColors.includes(color) || EntityColor.NecromancerDrone === color) type = EntityType.Drone;
                            break;
                    }
                    if (type === undefined) type = EntityType.UNKNOWN;
                    this.#add(type, position, { color, radius });
                });
            }
            #pentagonHook() {
                CanvasKit.hookPolygon(5, (vertices, ctx) => {
                    vertices = vertices.map((x) => scaling.toArenaPos(x));
                    const position = Vector.centroid(...vertices);
                    const radius = Math.round(Vector.radius(...vertices));
                    const color = ctx.fillStyle;
                    let type;
                    switch (radius) {
                        case 75:
                            if (EntityColor.Pentagon === color) type = EntityType.Pentagon;
                            break;
                        case 200:
                            if (EntityColor.AlphaPentagon === color) type = EntityType.AlphaPentagon;
                            break;
                    }
                    if (type === undefined) type = EntityType.UNKNOWN;
                    this.#add(type, position, { color, radius });
                });
            }
            #playerHook() {
                let index = 0;
                let position;
                let color;
                let radius;
                const onCircle = () => {
                    position = scaling.toArenaPos(position);
                    radius = scaling.toArenaUnits(new Vector(radius, radius)).x;
                    let type = EntityType.UNKNOWN;
                    if (radius > 53) {
                        type = EntityType.Player;
                    } else {
                        type = EntityType.Bullet;
                    }
                    this.#add(type, position, {
                        color,
                        radius,
                    });
                };
                //Sequence: beginPath -> arc -> fill -> beginPath -> arc -> fill -> arc
                CanvasKit.hookCtx('beginPath', (target, thisArg, args) => {
                    //start
                    if (index !== 3) {
                        index = 1;
                        return;
                    }
                    if (index === 3) {
                        index++;
                        return;
                    }
                    index = 0;
                });
                //check when a circle is drawn.
                CanvasKit.hookCtx('arc', (target, thisArg, args) => {
                    //outline
                    if (index === 1) {
                        index++;
                        const transform = thisArg.getTransform();
                        position = new Vector(transform.e, transform.f);
                        radius = transform.a;
                        return;
                    }
                    if (index === 4) {
                        index++;
                        color = thisArg.fillStyle;
                        return;
                    }
                    //last arc call
                    if (index === 6) {
                        index++;
                        onCircle();
                        return;
                    }
                    index = 0;
                });
                CanvasKit.hookCtx('fill', (target, thisArg, args) => {
                    if (index === 2) {
                        index++;
                        return;
                    }
                    if (index === 5) {
                        index++;
                        return;
                    }
                    index = 0;
                });
            }
        }
        const entityManager = new EntityManager(); // CONCATENATED MODULE: ./src/tools/overlay.ts
 
        class Overlay {
            canvas;
            ctx;
            constructor() {
                this.canvas = CanvasKit.createCanvas();
                this.ctx = this.canvas.getContext('2d');
                document.body.appendChild(this.canvas);
                _window.addEventListener('resize', () => this.#onResize());
                game.on('frame', () => this.#onFrame());
                this.#onResize();
            }
            #onResize() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
            }
            #onFrame() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
        const overlay = new Overlay(); // CONCATENATED MODULE: ./src/extensions/debug_tool.ts
 
        class DebugTool extends Extension {
            #drawBoundingBox = false;
            #drawVelocity = false;
            #drawParent = false;
            #drawInfo = false;
            #drawStats = false;
            constructor() {
                super(() => {
                    entityManager.load();
                    game.on('frame', () => {
                        entityManager.entities.forEach((entity) => {
                            const position = scaling.toCanvasPos(entity.position);
                            const futurePos = scaling.toCanvasPos(entity.predictPos(1000));
                            const dimensions = scaling.toCanvasUnits(new Vector(2 * entity.extras.radius, 2 * entity.extras.radius));
                            if (this.#drawBoundingBox) {
                                this.#_drawboundingBox(entity, position, dimensions);
                            }
                            if (this.#drawVelocity) {
                                this.#_drawVelocity(position, futurePos);
                            }
                            if (this.#drawParent) {
                                this.#_drawParent(entity, position);
                            }
                            if (this.#drawInfo) {
                                this.#_drawInfo(entity, position, dimensions);
                            }
                        });
                        if (this.#drawStats) {
                            this.#_drawStats();
                        }
                    });
                });
            }
            drawAll(v) {
                this.#drawBoundingBox = v;
                this.#drawVelocity = v;
                this.#drawParent = v;
                this.#drawInfo = v;
                this.#drawStats = v;
            }
            drawBoundingBox(v) {
                this.#drawBoundingBox = v;
            }
            drawVelocity(v) {
                this.#drawVelocity = v;
            }
            drawParent(v) {
                this.#drawParent = v;
            }
            drawInfo(v) {
                this.#drawInfo = v;
            }
            drawStats(v) {
                this.#drawStats = v;
            }
            #_drawboundingBox(entity, position, dimensions) {
                overlay.ctx.save();
                overlay.ctx.strokeStyle = entity.type === EntityType.UNKNOWN ? '#ffffff' : entity.extras.color;
                overlay.ctx.lineWidth = scaling.toCanvasUnits(new Vector(5, 5)).x;
                overlay.ctx.strokeRect(position.x - dimensions.x / 2, position.y - dimensions.y / 2, dimensions.x, dimensions.y);
                overlay.ctx.restore();
            }
            #_drawVelocity(position, futurePos) {
                overlay.ctx.save();
                overlay.ctx.strokeStyle = '#000000';
                overlay.ctx.lineWidth = scaling.toCanvasUnits(new Vector(5, 5)).x;
                overlay.ctx.beginPath();
                overlay.ctx.moveTo(position.x, position.y);
                overlay.ctx.lineTo(futurePos.x, futurePos.y);
                overlay.ctx.stroke();
                overlay.ctx.restore();
            }
            #_drawParent(entity, position) {
                if (entity.parent == null) {
                    return;
                }
                const parentPos = scaling.toCanvasPos(entity.parent.position);
                overlay.ctx.save();
                overlay.ctx.strokeStyle = '#8aff69';
                overlay.ctx.lineWidth = scaling.toCanvasUnits(new Vector(5, 5)).x;
                overlay.ctx.beginPath();
                overlay.ctx.moveTo(position.x, position.y);
                overlay.ctx.lineTo(parentPos.x, parentPos.y);
                overlay.ctx.stroke();
                overlay.ctx.restore();
            }
            #_drawInfo(entity, position, dimensions) {
                overlay.ctx.save();
                const fontSize = scaling.toCanvasUnits(new Vector(30, 30)).x;
                overlay.ctx.font = fontSize + 'px Ubuntu';
                overlay.ctx.fillStyle = `#ffffff`;
                overlay.ctx.strokeStyle = '#000000';
                overlay.ctx.lineWidth = fontSize / 5;
                overlay.ctx.strokeText(
                    `${entity.extras.id} ${Math.floor((performance.now() - entity.extras.timestamp) / 1000)}`,
                    position.x,
                    position.y - dimensions.y * 0.7
                );
                overlay.ctx.fillText(
                    `${entity.extras.id} ${Math.floor((performance.now() - entity.extras.timestamp) / 1000)}`,
                    position.x,
                    position.y - dimensions.y * 0.7
                );
                overlay.ctx.restore();
            }
            #_drawStats() {
                const text = `Debug Tool:
          Game Info:
          gamemode: ${player.gamemode}
          entities: ${entityManager.entities.length}
          
          Player Info:
          Is dead: ${player.isDead}
          level: ${player.level}
          tank: ${player.tank}
          position: ${Math.round(player.position.x)},${Math.round(player.position.y)}
          mouse: ${Math.round(player.mouse.x)},${Math.round(player.mouse.y)}
          velocity [units/seconds]: ${Math.round(Math.hypot(player.velocity.x, player.velocity.y))}`;
                overlay.ctx.save();
                const fontSize = 20 * _window.devicePixelRatio;
                overlay.ctx.font = `${fontSize}px Ubuntu`;
                overlay.ctx.fillStyle = `#ffffff`;
                overlay.ctx.strokeStyle = '#000000';
                overlay.ctx.lineWidth = fontSize / 5;
                text.split('\n').forEach((x, i) => {
                    overlay.ctx.strokeText(x, 0, _window.innerHeight * 0.25 + i * fontSize * 1.05);
                    overlay.ctx.fillText(x, 0, _window.innerHeight * 0.25 + i * fontSize * 1.05);
                });
                overlay.ctx.restore();
            }
        }
        const debugTool = new DebugTool(); // CONCATENATED MODULE: ./src/extensions/index.ts // CONCATENATED MODULE: ./src/tools/background_overlay.ts
 
        class BackgroundOverlay {
            canvas;
            ctx;
            #gameCanvas;
            #gameContext;
            constructor() {
                this.canvas = CanvasKit.createCanvas();
                this.ctx = this.canvas.getContext('2d');
                _window.addEventListener('resize', () => this.#onResize());
                game.on('frame', () => this.#onFrame());
                this.#onResize();
                game.once('ready', () => {
                    this.#gameCanvas = document.getElementById('canvas');
                    this.#gameContext = this.#gameCanvas.getContext('2d');
                    this.#hookBackground();
                });
            }
            #onResize() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
            }
            #onFrame() {
                this.canvas.width = _window.innerWidth * _window.devicePixelRatio;
                this.canvas.height = _window.innerHeight * _window.devicePixelRatio;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            #hookBackground() {
                CanvasKit.overrideCtx('fillRect', (target, thisArg, args) => {
                    if (typeof thisArg.fillStyle !== 'object') {
                        return Reflect.apply(target, thisArg, args);
                    }
                    const result = Reflect.apply(target, thisArg, args);
                    this.#gameContext.save();
                    this.#gameContext.setTransform(1, 0, 0, 1, 0, 0);
                    this.#gameContext.globalAlpha = 1;
                    this.#gameContext.drawImage(this.canvas, 0, 0);
                    this.#gameContext.restore();
                    return result;
                });
            }
        }
        const backgroundOverlay = new BackgroundOverlay(); // CONCATENATED MODULE: ./src/tools/index.ts // CONCATENATED MODULE: ./src/types/index.ts // CONCATENATED MODULE: ./src/index.ts
 
        thingz = __webpack_exports__;
        /******/
    })();
    //thingz end
 
    _window.thingz = thingz;
})();