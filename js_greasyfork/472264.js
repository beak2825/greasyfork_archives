// ==UserScript==
// @name       Aladar
// @name:ru    Аладар
// @author     ClintFlames
// @version    1.0.0-alpha
// @namespace  https://violentmonkey.github.io
// @license    MIT

// @description       Aladar aka allies radar showing your allies on minimap.
// @description:ru    Aladar или же радар союзников - показывает ваших союзников на миникарте.
// @icon 
// @homepageURL https://github.com/ClintFlames/aladar
// @supportURL  https://github.com/ClintFlames/aladar/issues

// @match       https://diep.io/
// @run-at      document-start
// @inject-into page
// @noframes

// @require https://greasyfork.org/scripts/433681-diepapi/code/diepAPI.js?version=1129359

// @grant GM.getValue
// @grant GM.setValue
// @grant GM.addValueChangeListener
// @grant GM.registerMenuCommand
// @grant GM.unregisterMenuCommand

// @grant GM.notification
// @downloadURL https://update.greasyfork.org/scripts/472264/Aladar.user.js
// @updateURL https://update.greasyfork.org/scripts/472264/Aladar.meta.js
// ==/UserScript==

// buildnum (base 36) 5k



/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Config.ts":
/*!***********************!*\
  !*** ./src/Config.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports) {


var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Config_lastServer, _Config_showPlayer, _Config_autoConnect;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Config = void 0;
const getValue = async (name, defaultValue) => {
    const v = await GM.getValue(name);
    if (typeof v != typeof defaultValue)
        return defaultValue;
    return v;
};
class Config {
    get lastServer() { return __classPrivateFieldGet(this, _Config_lastServer, "f"); }
    set lastServer(v) { GM.setValue("lastServer", v); __classPrivateFieldSet(this, _Config_lastServer, v, "f"); }
    get showPlayer() { return __classPrivateFieldGet(this, _Config_showPlayer, "f"); }
    set showPlayer(v) { GM.setValue("showPlayer", v); __classPrivateFieldSet(this, _Config_showPlayer, v, "f"); }
    get autoConnect() { return __classPrivateFieldGet(this, _Config_autoConnect, "f"); }
    set autoConnect(v) { GM.setValue("autoConnect", v); __classPrivateFieldSet(this, _Config_autoConnect, v, "f"); }
    constructor() {
        _Config_lastServer.set(this, "");
        _Config_showPlayer.set(this, true);
        _Config_autoConnect.set(this, true);
    }
    async init(callback) {
        this.lastServer = await getValue("lastServer", "");
        this.showPlayer = await getValue("showPlayer", true);
        this.autoConnect = await getValue("autoConnect", true);
        GM.addValueChangeListener("lastServer", (_, oldValue, newValue) => {
            if (typeof newValue == "string")
                return;
            if (typeof oldValue == "string")
                return this.lastServer = oldValue;
            this.lastServer = "";
        });
        GM.addValueChangeListener("showPlayer", (_, oldValue, newValue) => {
            if (typeof newValue == "boolean")
                return;
            if (typeof oldValue == "boolean")
                return this.showPlayer = oldValue;
            this.showPlayer = true;
        });
        GM.addValueChangeListener("autoConnect", (_, oldValue, newValue) => {
            if (typeof newValue == "boolean")
                return;
            if (typeof oldValue == "boolean")
                return this.autoConnect = oldValue;
            this.autoConnect = true;
        });
        callback(this);
    }
}
exports.Config = Config;
_Config_lastServer = new WeakMap(), _Config_showPlayer = new WeakMap(), _Config_autoConnect = new WeakMap();


/***/ }),

/***/ "./src/aladarClient.ts":
/*!*****************************!*\
  !*** ./src/aladarClient.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connect = void 0;
let _config;
let _playerList = [];
const { player: _player, game, minimap, arena } = window.unsafeWindow.diepAPI.apis;
const { Vector } = window.unsafeWindow.diepAPI.core;
let isOnline = false;
const clamp = (x, min, max) => Math.min(Math.max(x, min), max);
const scaleNumber = (x, origin, target) => (x - origin[0]) * (target[1] - target[0]) / (origin[1] - origin[0]) + target[0];
const connect = (config, data) => {
    if (isOnline)
        return alert("Already online");
    isOnline = true;
    const [url, joinCode] = data.split("::");
    if (!url)
        return alert("URL can't be empty.");
    if (!joinCode)
        return alert("You must specify joinCode.");
    const ws = (() => {
        try {
            return new WebSocket(url);
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.message.endsWith("is invalid."))
                    return alert("URL is invalid.");
                console.log("ERROR: BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB\n");
                console.log(e.message);
                isOnline = false;
            }
        }
    })();
    if (!(ws instanceof WebSocket))
        return;
    ws.binaryType = "arraybuffer";
    config.lastServer = data;
    const playerList = [];
    _playerList = playerList;
    _config = config;
    ws.onerror = e => {
        console.log("ERROR: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n");
        console.log(e);
        isOnline = false;
    };
    ws.onclose = e => {
        isOnline = false;
        switch (e.code) {
            case 4001:
                alert("joinCode is wrong.");
                break;
            case 4002:
                alert("Server player limit is reached.");
                break;
            case 4003:
                (0, exports.connect)(config, data);
                break;
        }
    };
    ws.onopen = () => {
        console.log("OPENED");
        ws.send(joinCode);
    };
    ws.onmessage = m => {
        const data = new Uint8Array(m.data);
        switch (data[0]) {
            case 0: {
                for (let i = 1; i < data.length; i += 4) {
                    playerList.push({
                        id: data[i],
                        color: data.slice(i + 1, i + 4).reduce((o, v) => o + v.toString(16).padStart(2, "0"), "#"),
                        pos: { x: NaN, y: NaN }
                    });
                }
                break;
            }
            case 1: {
                if (_player.isDead)
                    return ws.send("");
                const pos = [
                    Math.floor(clamp(scaleNumber(_player.position.x, [arena.size * -0.5, arena.size * 0.5], [0, 255]), 0, 255)),
                    Math.floor(clamp(scaleNumber(_player.position.y, [arena.size * -0.5, arena.size * 0.5], [0, 255]), 0, 255))
                ];
                if (pos[0] > 255 || pos[1] > 255)
                    return ws.send("");
                ws.send(new Uint8Array(pos));
                break;
            }
            case 2: {
                const closeListLength = data[1];
                if (closeListLength) {
                    for (let i = 0; i < closeListLength; i++) {
                        const id = data[2 + i];
                        playerList.splice(playerList.findIndex(p => p.id == id), 1);
                    }
                }
                for (const player of playerList)
                    player.pos = { x: NaN, y: NaN };
                for (let i = 2 + closeListLength; i < data.length; i += 3) {
                    const player = playerList.find(p => p.id == data[i]);
                    if (!player)
                        continue;
                    player.pos = {
                        x: data[i + 1],
                        y: data[i + 2]
                    };
                }
                break;
            }
        }
    };
};
exports.connect = connect;
game.once("ready", () => {
    let ctx;
    const interval = setInterval(() => {
        if (!_config)
            return;
        const canvas = document.getElementById("canvas");
        if (!canvas)
            return;
        const _ctx = canvas.getContext("2d");
        if (!_ctx)
            return;
        ctx = _ctx;
        clearInterval(interval);
        game.on("frame", () => {
            ctx.globalAlpha = 1;
            for (const { color, pos } of _playerList) {
                if (!_config.showPlayer && color == _playerList[0].color)
                    continue;
                if (isNaN(pos.x))
                    continue;
                const { x, y } = Vector.add(minimap.minimapPos, Vector.multiply(minimap.minimapDim, {
                    x: scaleNumber(pos.x, [0, 255], [0, 1]),
                    y: scaleNumber(pos.y, [0, 255], [0, 1])
                }));
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 3 * window.unsafeWindow.devicePixelRatio, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = "#333339";
                ctx.stroke();
            }
        });
    }, 100);
});


/***/ }),

/***/ "./src/menu.ts":
/*!*********************!*\
  !*** ./src/menu.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startMenu = void 0;
const aladarClient_1 = __webpack_require__(/*! ./aladarClient */ "./src/aladarClient.ts");
const startMenu = (config) => {
    const changeValue = (buttonId, valueName) => (() => {
        const button = buttonList[buttonId];
        const status = button.status == "on" ? false : true;
        button.status = status ? "on" : "off";
        config[valueName] = status;
        reloadMenu();
    });
    const buttonList = [
        {
            name: "Connect to new server",
            callback: () => {
                const data = prompt("URL::JOINCODE", "");
                if (!data)
                    return alert("Empty data provided.");
                (0, aladarClient_1.connect)(config, data);
            }
        },
        {
            name: "Connect to last server",
            callback: () => {
                const lastServer = config.lastServer;
                if (!lastServer)
                    return alert("There is no last server.");
                (0, aladarClient_1.connect)(config, lastServer);
            }
        },
        {
            name: "Auto-connect to last server: ",
            status: config.autoConnect ? "on" : "off",
            callback: changeValue(2, "autoConnect")
        },
        {
            name: "Show you on minimap: ",
            status: config.showPlayer ? "on" : "off",
            callback: changeValue(3, "showPlayer")
        },
        {
            name: "Guide/Гайд",
            callback: () => { var _a; (_a = window.open("https://github.com/ClintFlames/aladar/blob/main/Guide.md", "_blank")) === null || _a === void 0 ? void 0 : _a.focus(); }
        }
    ];
    const loadMenu = () => {
        for (const button of buttonList) {
            if (!button.status) {
                GM.registerMenuCommand(button.name, button.callback);
                continue;
            }
            button.currentName = button.name + button.status;
            GM.registerMenuCommand(button.currentName, button.callback);
        }
    };
    const reloadMenu = () => {
        for (const button of buttonList) {
            if (!button.currentName) {
                GM.unregisterMenuCommand(button.name);
                continue;
            }
            GM.unregisterMenuCommand(button.currentName);
            button.currentName = "";
        }
        loadMenu();
    };
    loadMenu();
    GM.notification({
        title: "Aladar",
        text: "Loading complete"
    });
};
exports.startMenu = startMenu;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Config_1 = __webpack_require__(/*! ./Config */ "./src/Config.ts");
const aladarClient_1 = __webpack_require__(/*! ./aladarClient */ "./src/aladarClient.ts");
const menu_1 = __webpack_require__(/*! ./menu */ "./src/menu.ts");
const _window = window.unsafeWindow;
const config = new Config_1.Config();
config.init(() => {
    if (config.autoConnect && config.lastServer)
        (0, aladarClient_1.connect)(config, config.lastServer);
    (0, menu_1.startMenu)(config);
});
// const { Vector, CanvasKit } = _window.diepAPI.core;
// const { player, game, minimap, arena } = _window.diepAPI.apis;
// const { backgroundOverlay } = _window.diepAPI.tools;

})();

/******/ })()
;