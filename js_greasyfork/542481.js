// ==UserScript==
// @name         Melon Hub Revival (patched)
// @namespace    https://github.com/OfficiallyMelon/Melon-Hub
// @version      v1.0.1.2 Fixed
// @description  hack client for bloxd.io, revived with poop client's hook
// @author       melon
// @match        https://*.bloxd.io*
// @icon         https://bloxd.io*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542481/Melon%20Hub%20Revival%20%28patched%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542481/Melon%20Hub%20Revival%20%28patched%29.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 
	(() => {
		__webpack_require__.d = (exports, definition) => {
			for(var key in definition) {
				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
				}
			}
		};
	})();
/******/ 
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 
	(() => {
		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
	})();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

__webpack_require__.d(__webpack_exports__, {
  n9: () => (/* binding */ addOutput),
  oP: () => (/* binding */ injectionStatus)
});

// hook by wang
var S = {
    fakeMouseEvent(t) {
        let e = {
            button: 0,
            buttons: 1,
            clientX: Math.floor(Math.random() * 999 + 1),
            clientY: Math.floor(Math.random() * 999 + 1),
            screenX: Math.floor(Math.random() * 999 + 1),
            screenY: Math.floor(Math.random() * 999 + 1),
            target: document.querySelector("#noa-container"),
            type: t,
            isTrusted: !0,
            view: window,
            bubbles: !0,
            cancelable: !0,
            timeStamp: performance.now()
        };
        return e.prototype = MouseEvent.prototype, e;
    }
};

var s = {
    keys(t) {
        var e = [], i = 0;
        for (var o in t) t != null && (e[i] = o, i++);
        return e;
    },
    values(t) {
        for (var e = this.keys(t), i = [], o = 0, n = 0; o < e.length;) {
            var c = e[o], d = t[c];
            i[n] = d, n++, o++;
        }
        return i;
    },
    assign(t, ...e) {
        let i = Object(t);
        for (let o = 0; o < e.length; o++) {
            let n = e[o];
            if (n != null) for (let c in n) i[c] = n[c];
        }
        return i;
    }
};

var A = {
    wpRequire: null,
    _cachedNoa: null,
    get noa() {
        return this?._cachedNoa || (this._cachedNoa = s.values(this.bloxdProps).find(t => t?.entities)), this._cachedNoa;
    },
    init() {
        if (!window.webpackChunkbloxd) {
            throw new Error("webpackChunkbloxd not available");
        }
        let t = Math.floor(Math.random() * 9999999 + 1);
        window.webpackChunkbloxd.push([[t], {}, i => this.wpRequire = i]);
        this.bloxdProps = s.values(this.findModule("nonBlocksClient:") || this.findModuleAlternative())?.find(i => typeof i == "object") || null;
        if (!this.bloxdProps) {
            throw new Error("bloxdProps not found");
        }
    },
    findModule(t) {
        if (!this.wpRequire) return null;
        let e = this.wpRequire.m;
        for (let i in e) {
            let o = e[i];
            if (o && o.toString().includes(t)) {
                addOutput("Hook Debug:", `Found module with identifier: ${t}`);
                return this.wpRequire(i);
            }
        }
        addError("Hook Debug:", `Module with identifier ${t} not found`);
        return null;
    },
    findModuleAlternative() {
        const identifiers = ["nonBlocksClient:", "bloxdClient", "gameClient", "entities"];
        for (let id of identifiers) {
            let module = this.findModule(id);
            if (module) return module;
        }
        addError("Hook Debug:", "No alternative module found");
        return null;
    }
};
var l = A;

var C = {
    get getPosition() { return s.values(l.noa?.entities || [])[28] || (() => [0, 0, 0]); },
    get getMoveState() { return s.values(l.noa?.entities || [])[36] || (() => ({})); },
    get getPhysicsBody() { return s.values(l.noa?.entities || [])[30] || (() => ({})); },
    get registry() { return s.values(l.noa || [])[17] || ({}); },
    get getBlockSolidity() { return s.values(this.registry)[5] || (() => false); },
    get getBlockID() { return l.noa?.bloxd ? l.noa.bloxd[Object.getOwnPropertyNames(l.noa.bloxd.constructor.prototype)[3]]?.bind(l.noa.bloxd) : (() => 0); },
    get getHeldItem() { return s.values(l.noa?.entities || [])[39] || (() => null); },
    safeGetHeldItem(t) {
        let e;
        try { e = this.getHeldItem(t); } catch { e = null; }
        return e;
    },
    get playerList() {
        return s.values(l.noa?.bloxd?.getPlayerIds?.() || []).filter(t => t !== 1 && this.safeGetHeldItem(t)).map(t => parseInt(t));
    },
    get doAttack() {
        let t = this.safeGetHeldItem(1);
        return (t?.doAttack || t?.breakingItem?.doAttack || (() => {})).bind(t);
    },
    setVelocity(t = null, e = null, i = null) {
        let o = this.getPhysicsBody(1), n = s.values(o)[16] || [0, 0, 0];
        t !== null && (n[0] = t);
        e !== null && (n[1] = e);
        i !== null && (n[2] = i);
    },
    isAlive(t) { return s.values(l.noa?.entities || [])[37]?.(t)?.isAlive || false; },
    touchingWall() {
        let t = this.getPosition(1), e = .35, i = [[0, 0, 0], [e, 0, 0], [-e, 0, 0], [0, 0, e], [0, 0, -e], [e, 0, e], [e, 0, -e], [-e, 0, e], [-e, 0, -e]], o = [0, 1, 2];
        for (let [n, c, d] of i) for (let u of o) {
            let m = Math.floor(t[0] + n), h = Math.floor(t[1] + c + u), E = Math.floor(t[2] + d), M = this.getBlockID(m, h, E);
            if (this.getBlockSolidity(M)) return !0;
        }
        return !1;
    }
};

var r = { noa: C, mouse: S };

// Configuration
var config = {
    coordinates: [null, null, null],
    methods: {},
    CurrentlyInjected: false,
    freecamPosition: [0, 0, 0],
    noaInstance: null
};

// Hook Initialization with Persistent Retry
function initHookWithRetry(maxAttempts = 60, delay = 3000) {
    let attempts = 0;
    function tryInit() {
        // Stop if already injected
        if (config.CurrentlyInjected) {
            addOutput("Hook Debug:", "Already injected, stopping retry loop");
            return;
        }
        // Check if on a valid bloxd.io page
        if (!window.location.href.includes("bloxd.io")) {
            addError("Hook Debug:", "Not on a bloxd.io page, stopping retry loop");
            return;
        }
        try {
            addOutput("Hook Debug:", `Attempt ${attempts + 1}/${maxAttempts} to initialize hook on ${window.location.href}`);
            // Wait for webpackChunkbloxd to be defined
            if (!window.webpackChunkbloxd) {
                throw new Error("webpackChunkbloxd not available yet");
            }
            l.init();
            config.noaInstance = l.noa;
            if (!config.noaInstance) {
                throw new Error("noa instance is null");
            }
            if (!config.noaInstance.entities) {
                throw new Error("noa.entities not available");
            }
            if (!config.noaInstance.bloxd) {
                throw new Error("noa.bloxd not available");
            }
            if (!config.noaInstance.bloxd.getPlayerIds) {
                throw new Error("noa.bloxd.getPlayerIds not available");
            }
            config.CurrentlyInjected = true;
            addOutput("Injection State:", "Successfully hooked noa!");
            console.log("Successfully hooked noa!");
            window.noa = config.noaInstance;
            setTimeout(() => {
                injectionStatus.style.cssText =
                    "position:absolute;bottom:5px;right:5px;width:15px;height:15px;background:green;border-radius:50%;";
            }, 100);
        } catch (e) {
            if (attempts < maxAttempts) {
                attempts++;
                addError("Hook Debug:", `Attempt ${attempts}/${maxAttempts} failed: ${e.message}, retrying in ${delay}ms...`);
                setTimeout(tryInit, delay);
            } else {
                addError("Injection State:", `Failed to hook noa after ${maxAttempts} attempts: ${e.message}. Please reload the page or check for game updates.`);
            }
        }
    }
    // Start the retry loop immediately
    tryInit();
    // Continue retrying until successful or max attempts reached
    if (!config.CurrentlyInjected) {
        setInterval(() => {
            if (!config.CurrentlyInjected && attempts < maxAttempts) {
                tryInit();
            }
        }, delay);
    }
}
setTimeout(initHookWithRetry, 100);

// Packet Handling
var hookedSend = null;
var Context = null;
function interceptSockets() {
    (function () {
        var originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function (obj, prop, descriptor) {
            try {
                if (prop === "send" && typeof descriptor.value === "function") {
                    addOutput("Hook Debug:", "Successfully hooked send function");
                    hookedSend = descriptor.value;
                    descriptor.value = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (hookedSend) {
                            Context = this;
                            return hookedSend.apply(this, args);
                        } else {
                            addError("Hook Error:", "hookedSend is null");
                        }
                    };
                }
            } catch (error) {
                addError("Hook Error:", `Failed to hook send: ${error.message}`);
            }
            return originalDefineProperty.apply(this, arguments);
        };
        Object.defineProperty(window, "getHookedSend", {
            value: function () { return hookedSend; },
            writable: false,
            configurable: false
        });
    })();
}

var PacketType = {
    PLACE_BLOCK: 114,
};

var packets = {
    [PacketType.PLACE_BLOCK]: {
        pos: null,
        toBlock: null,
        checker: null
    }
};

function sendPacket(packetType, data) {
    if (hookedSend && Context) {
        hookedSend.apply(Context, [packetType, data]);
    } else {
        addError("Hook Error:", "Cannot send packet: hookedSend or Context is null");
    }
}

// Utility Functions
var D = {
    normalizeVector(t) {
        let e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2];
        if (e > 0) {
            let i = 1 / Math.sqrt(e);
            return [t[0] * i, t[1] * i, t[2] * i];
        }
        return t;
    },
    distanceBetween(t, e) {
        let i = e[0] - t[0], o = e[1] - t[1], n = e[2] - t[2];
        return i * i + o * o + n * n;
    },
    distanceBetweenSqrt(t, e) {
        return Math.sqrt(this.distanceBetween(t, e));
    },
    lerp(t, e, i) {
        return t + (e - t) * i;
    }
};

var Utilities = {
    simulateLeftClick(element) {
        if (element) {
            element.dispatchEvent(new MouseEvent("mousedown", { button: 0, bubbles: true, cancelable: true }));
            element.dispatchEvent(new MouseEvent("mouseup", { button: 0, bubbles: true, cancelable: true }));
        } else {
            addError("Utilities Error:", "Cannot simulate left click: element not found");
        }
    },
    calculateDistance(pos1, pos2) {
        var dx = pos2.x - pos1.x;
        var dy = pos2.y - pos1.y;
        var dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    simulateRightClick(element) {
        if (element) {
            element.dispatchEvent(new MouseEvent("mousedown", { button: 2, bubbles: true, cancelable: true }));
            element.dispatchEvent(new MouseEvent("mouseup", { button: 2, bubbles: true, cancelable: true }));
        } else {
            addError("Utilities Error:", "Cannot simulate right click: element not found");
        }
    },
    setDir(facing) {
        if (config.noaInstance) {
            var heading = Math.atan2(facing[0], facing[2]);
            var pitch = Math.asin(-facing[1]);
            config.noaInstance.camera.heading = heading;
            config.noaInstance.camera.pitch = pitch;
        } else {
            addError("Utilities Error:", "Cannot set direction: noaInstance is null");
        }
    },
    removeAllCookies() {
        document.cookie.split(";").forEach(function (e) {
            document.cookie = e.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }
};

// Module Base Class
var Module = class {
    constructor(name) {
        this.name = name;
        this.isEnabled = false;
        this.keybind = "";
    }
    onEnable() {}
    onDisable() {}
    onRender() {}
    enable() {
        this.isEnabled = true;
        this.onEnable();
        addOutput(`${this.name} enabled`);
    }
    disable() {
        this.isEnabled = false;
        this.onDisable();
        addOutput(`${this.name} disabled`);
    }
    toggle() {
        this.isEnabled ? this.disable() : this.enable();
    }
};

// Module Definitions
var Killaura = class extends Module {
    constructor() {
        super("Killaura");
    }
    onRender() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("Killaura Error:", "Cannot run: noaInstance or injection not ready");
            return;
        }
        // Aimbot logic: Aim at the nearest player
        var cPlayer = null;
        var cDist = Infinity;
        r.noa.playerList.forEach(function(id) {
            var lifeformState = r.noa.isAlive(id);
            if (lifeformState) {
                var myPos = r.noa.getPosition(1);
                var enemyPos = r.noa.getPosition(id);
                var distance = D.distanceBetweenSqrt(myPos, enemyPos);
                if (distance < cDist && distance <= 20) {
                    cDist = distance;
                    cPlayer = enemyPos;
                }
            }
        });
        if (cPlayer) {
            var myPos = r.noa.getPosition(1);
            var dirVec = [cPlayer[0] - myPos[0], cPlayer[1] - myPos[1], cPlayer[2] - myPos[2]];
            var normVec = D.normalizeVector(dirVec);
            Utilities.setDir(normVec);
        }
        // AutoClicker logic: Simulate left click
        let element = document.querySelector("#noa-canvas");
        Utilities.simulateLeftClick(element);
    }
};

var AutoClicker = class extends Module {
    constructor() {
        super("AutoClicker");
    }
    onRender() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("AutoClicker Error:", "Cannot run: noaInstance or injection not ready");
            return;
        }
        let element = document.querySelector("#noa-canvas");
        Utilities.simulateLeftClick(element);
    }
};

var AntiShake = class extends Module {
    constructor() {
        super("AntiShake");
    }
    onRender() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("AntiShake Error:", "Cannot run: noaInstance or injection not ready");
            return;
        }
        try {
            var cameraState = s.values(config.noaInstance.entities)[12](config.noaInstance.playerEntity);
            if (cameraState && cameraState.shakePower !== undefined) {
                cameraState.shakePower = 0;
            }
        } catch (e) {
            addError("AntiShake Error:", e.message);
        }
    }
};

var Scaffold = class extends Module {
    constructor() {
        super("Scaffold");
    }
    onRender() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("Scaffold Error:", "Cannot run: noaInstance or injection not ready");
            return;
        }
        var player = config.noaInstance.playerEntity;
        var position = r.noa.getPosition(player);
        var block = r.noa.getBlockID(Math.floor(position[0]), Math.floor(position[1] - 1), Math.floor(position[2]));
        var heldItem = r.noa.safeGetHeldItem(player);
        var ObjID = heldItem && ("CubeBlock" === heldItem.typeObj.type || "TwoDBlock" === heldItem.typeObj.type || "SlabBlock" === heldItem.typeObj.type) ? heldItem.typeObj.id : null;
        if (block === 0 && ObjID) {
            var roundedPosition = [
                Math.floor(position[0]),
                Math.floor(position[1] - 1),
                Math.floor(position[2])
            ];
            addOutput("Placing block at", roundedPosition.toString());
            sendPacket(PacketType.PLACE_BLOCK, {
                pos: roundedPosition,
                toBlock: ObjID,
                checker: ''
            });
            config.noaInstance.setBlock(roundedPosition[0], roundedPosition[1], roundedPosition[2], ObjID);
        }
    }
};

var Unban = class extends Module {
    constructor() {
        super("Account Gen");
    }
    onEnable() {
        Utilities.removeAllCookies();
        location.reload();
    }
};

var Aimbot = class extends Module {
    constructor() {
        super("Aimbot");
    }
    onRender() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("Aimbot Error:", "Cannot run: noaInstance or injection not ready");
            return;
        }
        var cPlayer = null;
        var cDist = Infinity;
        r.noa.playerList.forEach(function(id) {
            var lifeformState = r.noa.isAlive(id);
            if (lifeformState) {
                var myPos = r.noa.getPosition(1);
                var enemyPos = r.noa.getPosition(id);
                var distance = D.distanceBetweenSqrt(myPos, enemyPos);
                if (distance < cDist && distance <= 20) {
                    cDist = distance;
                    cPlayer = enemyPos;
                }
            }
        });
        if (cPlayer) {
            var myPos = r.noa.getPosition(1);
            var dirVec = [cPlayer[0] - myPos[0], cPlayer[1] - myPos[1], cPlayer[2] - myPos[2]];
            var normVec = D.normalizeVector(dirVec);
            Utilities.setDir(normVec);
        }
    }
};

var Spider = class extends Module {
    constructor() {
        super("Spider");
    }
    onRender() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("Spider Error:", "Cannot run: noaInstance or injection not ready");
            return;
        }
        if (r.noa.touchingWall() && config.noaInstance.inputs.state.jump) {
            r.noa.setVelocity(null, 5, null);
        }
    }
};

var Jesus = class extends Module {
    constructor() {
        super("Jesus");
    }
    onEnable() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("Jesus Error:", "Cannot run: noaInstance or injection not ready");
            return;
        }
        try {
            let e = s.values(s.values(l.findModule("Gun:class")).find(o => typeof o == "object"));
            let i = s.keys(r.noa.registry)[12];
            r.noa.registry[i][e.find(o => o.name == "Water").id] = !0;
            r.noa.registry[i][e.find(o => o.name == "Lava").id] = !0;
        } catch (e) {
            addError("Jesus Error:", e.message);
        }
    }
    onDisable() {
        if (!config.noaInstance || !config.CurrentlyInjected) {
            addError("Jesus Error:", "Cannot disable: noaInstance or injection not ready");
            return;
        }
        try {
            let e = s.values(s.values(l.findModule("Gun:class")).find(o => typeof o == "object"));
            let i = s.keys(r.noa.registry)[12];
            r.noa.registry[i][e.find(o => o.name == "Water").id] = !1;
            r.noa.registry[i][e.find(o => o.name == "Lava").id] = !1;
        } catch (e) {
            addError("Jesus Error:", e.message);
        }
    }
};

// UI Components
var UI_link = document.createElement('link');
UI_link.rel = 'stylesheet';
UI_link.href = 'https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500&display=swap';
var UI_frame = document.createElement('div');
UI_frame.style.cssText = 'position:fixed;top:10px;right:10px;width:697.5px;height:448.5px;background-color:transparent;border-radius:10px;overflow:hidden;z-index:2147483646';
var rightImage = document.createElement('img');
rightImage.src = 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/RightMelon.png?raw=true';
rightImage.style.cssText = 'width:697.5px;height:448.5px';
rightImage.style.position = 'relative';
var leftImage = document.createElement('img');
leftImage.src = 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/LeftMelon.png?raw=true';
leftImage.style.cssText = 'position:fixed;top:10px;right:495px;width:217.5px;height:448.5px;z-index:2147483646';
var melonHubText = document.createElement('div');
melonHubText.innerText = 'Melon Hub';
melonHubText.style.cssText = 'position:absolute; top:20px; left:34px; font-family: Inter, sans-serif; font-size: 22px; font-weight: 500; color: white; z-index: 2147483647;';
var versionText = document.createElement('div');
versionText.innerText = '1.0.1.1 Fixed';
versionText.style.cssText = 'position:absolute; top:20px; left:145px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 300; color: white; z-index: 2147483647;';
var buttonContainer = document.createElement('div');
buttonContainer.style.cssText = 'position:absolute;top:60px;left:-25px;width:217.5px;height:448.5px;z-index:2147483651;';
var rightButtonContainer = document.createElement('div');
rightButtonContainer.id = 'rightButtonContainer';
rightButtonContainer.style.cssText = 'position: absolute; top: 50px; right: 10px; width: 470px; height: 380px; z-index: 2147483649; overflow-y: auto; overflow-x: hidden; padding-right: 10px; box-sizing: border-box;';
var miniConsole = document.createElement('div');
miniConsole.id = 'miniConsole';
miniConsole.style.cssText = 'position: absolute; top: 40px; right: 5px; width: 470px; height: 380px; background-color: black; color: green; overflow-y: auto; padding: 10px; box-sizing: border-box; font-family: monospace; font-size: 14px; border: 2px solid gray; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); display: none; z-index: 20000000000;';
var injectionStatus = document.createElement("div");
injectionStatus.id = 'injectionStatus';
injectionStatus.style.cssText =
    "position:absolute;bottom:5px;right:5px;width:15px;height:15px;background:red;border-radius:50%;";

// Create UI
document.head.appendChild(UI_link);
UI_frame.appendChild(rightImage);
UI_frame.appendChild(leftImage);
UI_frame.appendChild(melonHubText);
UI_frame.appendChild(versionText);
UI_frame.appendChild(buttonContainer);
UI_frame.appendChild(rightButtonContainer);
UI_frame.appendChild(miniConsole);
UI_frame.appendChild(injectionStatus);
document.body.appendChild(UI_frame);

// Intercept Sockets
interceptSockets();

// Debug Console
var logs = [];
function addOutput() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var text = args.join(' ');
    var output = document.createElement('div');
    output.textContent = "> ".concat(text);
    output.style.color = 'green';
    output.style.marginBottom = '5px';
    miniConsole.appendChild(output);
    miniConsole.scrollTop = miniConsole.scrollHeight;
    logs.push({ text: text, type: 'output' });
}
function addError() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var text = args.join(' ');
    var output = document.createElement('div');
    output.textContent = "> ".concat(text);
    output.style.color = 'red';
    output.style.marginBottom = '5px';
    miniConsole.appendChild(output);
    miniConsole.scrollTop = miniConsole.scrollHeight;
    logs.push({ text: text, type: 'error' });
}
function reapplyLogs() {
    miniConsole.innerHTML = '';
    logs.forEach(function (log) {
        if (log.type === 'output') {
            addOutput(log.text);
        } else if (log.type === 'error') {
            addError(log.text);
        }
    });
}

// Dragging
var isDragging = false;
var offsetX = 0;
var offsetY = 0;
UI_frame.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.clientX - UI_frame.getBoundingClientRect().left;
    offsetY = e.clientY - UI_frame.getBoundingClientRect().top;
    UI_frame.style.cursor = 'grabbing';
});
document.addEventListener('mousemove', function (e) {
    if (isDragging) {
        var newLeft = "".concat(e.clientX - offsetX, "px");
        var newTop = "".concat(e.clientY - offsetY, "px");
        UI_frame.style.left = newLeft;
        UI_frame.style.top = newTop;
        leftImage.style.left = "".concat(e.clientX - offsetX, "px");
        leftImage.style.top = "".concat(e.clientY - offsetY, "px");
    }
});
document.addEventListener('mouseup', function () {
    isDragging = false;
    UI_frame.style.cursor = 'default';
});

// Module Manager
var ModuleManager = {
    modules: [
        new Killaura(),
        new AutoClicker(),
        new AntiShake(),
        new Scaffold(),
        new Unban(),
        new Aimbot(),
        new Spider(),
        new Jesus()
    ],
    getModByName(name) {
        return this.modules.find(e => e.name === name);
    },
    handleKeyPress(key) {
        this.modules.forEach(e => {
            if (e?.keybind?.toLowerCase?.() == key.toLowerCase()) {
                e.toggle();
            }
        });
    }
};

// Button Functions
var buttonStateTable = {};
function createRightButton(title, secondTitle, additionalInfo, module) {
    var btn = document.createElement("div");
    btn.style.cssText = "\n  position:relative;width:450px;height:75px;margin-bottom:10px;border-radius: 10px; right: -5px;\n  transition:transform 0.2s;cursor:pointer;\n  background:url('https://raw.githubusercontent.com/OfficiallyMelon/files-cdn/refs/heads/main/bloxd-ui/ButtonHolder.png') no-repeat center/cover;\n  transform-origin: top;\n";
    btn.onmouseenter = function () { return (btn.style.transform = "scaleY(1.05)"); };
    btn.onmouseleave = function () { return (btn.style.transform = "scaleY(1)"); };
    var titleContainer = document.createElement("div");
    titleContainer.style.cssText = "position:absolute;top:5px;left:5px;display:flex;align-items:center;";
    btn.appendChild(titleContainer);
    var titleText = document.createElement("div");
    titleText.innerText = title;
    titleText.style.cssText =
        "font-family:Gabarito,sans-serif;font-size:16px;font-weight:500;color:white;";
    titleContainer.appendChild(titleText);
    var secondTitleText = document.createElement("div");
    secondTitleText.innerText = secondTitle;
    secondTitleText.style.cssText =
        "margin-left:5px;font-family:Gabarito,sans-serif;font-size:13px;font-weight:400;color:rgba(255, 255, 255, 0.56);";
    titleContainer.appendChild(secondTitleText);
    var descriptionText = document.createElement("div");
    descriptionText.innerText = additionalInfo;
    descriptionText.style.cssText =
        "position:absolute;top:50px;left:5px;font-family:Gabarito,sans-serif;font-size:14px;font-weight:400;color:rgba(255, 255, 255, 0.71);";
    btn.appendChild(descriptionText);
    var redCircle = document.createElement("div");
    redCircle.style.cssText =
        "position:absolute;bottom:5px;right:5px;width:15px;height:15px;background:red;border-radius:50%;";
    btn.appendChild(redCircle);
    if (!(title in buttonStateTable)) {
        buttonStateTable[title] = false;
    }
    redCircle.style.backgroundColor = buttonStateTable[title] ? "green" : "red";
    module.button = {
        setActive: (state) => {
            buttonStateTable[title] = state;
            redCircle.style.backgroundColor = state ? "green" : "red";
            module.toggle();
        }
    };
    btn.onclick = function () {
        buttonStateTable[title] = !buttonStateTable[title];
        SaveManager.saveObject('buttonStates', buttonStateTable);
        SaveManager.saveBoolean(title, buttonStateTable[title], true);
        redCircle.style.backgroundColor = buttonStateTable[title] ? "green" : "red";
        addOutput("Toggled", title, "to", buttonStateTable[title] ? "on" : "off");
        module.toggle();
    };
    Keybinds.forEach(function (keybind) {
        if (keybind.Module === title) {
            document.addEventListener('keydown', function (event) {
                if (event.key !== keybind.Keybind || (keybind.KeybindCode.length > 0 && event.code !== keybind.KeybindCode)) {
                    return;
                }
                buttonStateTable[title] = !buttonStateTable[title];
                SaveManager.saveObject('buttonStates', buttonStateTable);
                SaveManager.saveBoolean(title, buttonStateTable[title], true);
                redCircle.style.backgroundColor = buttonStateTable[title] ? "green" : "red";
                addOutput("Toggled", title, "to", buttonStateTable[title] ? "on" : "off");
                module.toggle();
            });
        }
    });
    return btn;
}

function createRightThemeButton(title, secondTitle, additionalInfo, onClick) {
    var btn = document.createElement("div");
    btn.style.cssText = "\n  position:relative;width:450px;height:75px;margin-bottom:10px;border-radius: 10px; right: -5px;\n  transition:transform 0.2s;cursor:pointer;\n  background:url('https://raw.githubusercontent.com/OfficiallyMelon/files-cdn/refs/heads/main/bloxd-ui/ButtonHolder.png') no-repeat center/cover;\n  transform-origin: top;\n";
    btn.onmouseenter = function () { return (btn.style.transform = "scaleY(1.05)"); };
    btn.onmouseleave = function () { return (btn.style.transform = "scaleY(1)"); };
    var titleContainer = document.createElement("div");
    titleContainer.style.cssText = "position:absolute;top:5px;left:5px;display:flex;align-items:center;";
    btn.appendChild(titleContainer);
    var titleText = document.createElement("div");
    titleText.innerText = title;
    titleText.style.cssText =
        "font-family:Gabarito,sans-serif;font-size:16px;font-weight:500;color:white;";
    titleContainer.appendChild(titleText);
    var secondTitleText = document.createElement("div");
    secondTitleText.innerText = secondTitle;
    secondTitleText.style.cssText =
        "margin-left:5px;font-family:Gabarito,sans-serif;font-size:13px;font-weight:400;color:rgba(255, 255, 255, 0.56);";
    titleContainer.appendChild(secondTitleText);
    var descriptionText = document.createElement("div");
    descriptionText.innerText = additionalInfo;
    descriptionText.style.cssText =
        "position:absolute;top:50px;left:5px;font-family:Gabarito,sans-serif;font-size:14px;font-weight:400;color:rgba(255, 255, 255, 0.71);";
    btn.appendChild(descriptionText);
    btn.onclick = function () {
        buttonStateTable[title] = !buttonStateTable[title];
        SaveManager.saveObject('buttonStates', buttonStateTable);
        onClick();
    };
    return btn;
}

function createKeybindButton(title, secondTitle, additionalInfo) {
    var btn = document.createElement("div");
    btn.style.cssText = "\n  position:relative;width:450px;height:75px;margin-bottom:10px;border-radius: 10px; right: -5px;\n  transition:transform 0.2s;cursor:pointer;\n  background:url('https://raw.githubusercontent.com/OfficiallyMelon/files-cdn/refs/heads/main/bloxd-ui/ButtonHolder.png') no-repeat center/cover;\n  transform-origin: top;\n";
    btn.onmouseenter = function () { return (btn.style.transform = "scaleY(1.05)"); };
    btn.onmouseleave = function () { return (btn.style.transform = "scaleY(1)"); };
    var titleContainer = document.createElement("div");
    titleContainer.style.cssText = "position:absolute;top:5px;left:5px;display:flex;align-items:center;";
    btn.appendChild(titleContainer);
    var titleText = document.createElement("div");
    titleText.innerText = title;
    titleText.style.cssText =
        "font-family:Gabarito,sans-serif;font-size:16px;font-weight:500;color:white;";
    titleContainer.appendChild(titleText);
    var secondTitleText = document.createElement("div");
    secondTitleText.innerText = secondTitle;
    secondTitleText.style.cssText =
        "margin-left:5px;font-family:Gabarito,sans-serif;font-size:13px;font-weight:400;color:rgba(255, 255, 255, 0.56);";
    titleContainer.appendChild(secondTitleText);
    var descriptionText = document.createElement("div");
    descriptionText.innerText = additionalInfo;
    descriptionText.style.cssText =
        "position:absolute;top:50px;left:5px;font-family:Gabarito,sans-serif;font-size:14px;font-weight:400;color:rgba(255, 255, 255, 0.71);";
    btn.appendChild(descriptionText);
    var currentKeybind = (Keybinds.find(function (bind) { return bind.Module === title; })?.Keybind) || "None";
    var keybindBox = document.createElement("div");
    keybindBox.innerText = currentKeybind;
    keybindBox.style.cssText = "\n  position: absolute;\n  bottom: 5px;\n  right: 5px;\n  width: 50px;\n  height: 20px;\n  background: rgba(0, 0, 0, 0.5);\n  color: white;\n  font-family: Gabarito, sans-serif;\n  font-size: 12px;\n  font-weight: 400;\n  text-align: center;\n  line-height: 20px;\n  border-radius: 5px;\n  cursor: pointer;\n";
    btn.appendChild(keybindBox);
    btn.onclick = function () {
        document.addEventListener("keydown", function (event) {
            ChangeKeybind(title, event.key.toString(), event.code ? event.code.toString() : "");
            keybindBox.innerText = event.key.toUpperCase();
        }, { once: true });
    };
    keybindBox.onclick = function (event) {
        event.stopPropagation();
        ChangeKeybind(title, "", "");
        keybindBox.innerText = "None";
    };
    return btn;
}

// Save Manager
var SaveManager = {
    saveBoolean(key, value, overwrite = true) {
        if (overwrite || localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
    importBoolean(key) {
        var value = localStorage.getItem(key);
        return value ? JSON.parse(value) : false;
    },
    saveString(key, value) {
        localStorage.setItem(key, value);
    },
    importString(key) {
        return localStorage.getItem(key);
    },
    saveObject(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    importObject(key) {
        var value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
};

// Keybinds
var Keybinds = loadKeybinds();
function loadKeybinds() {
    var savedKeybinds = localStorage.getItem('keybinds');
    if (savedKeybinds) {
        return JSON.parse(savedKeybinds);
    } else {
        return [
            { Module: "Killaura", Keybind: "", KeybindCode: "" },
            { Module: "AutoClicker", Keybind: "", KeybindCode: "" },
            { Module: "AntiShake", Keybind: "", KeybindCode: "" },
            { Module: "Scaffold", Keybind: "", KeybindCode: "" },
            { Module: "Account Gen", Keybind: "", KeybindCode: "" },
            { Module: "Aimbot", Keybind: "", KeybindCode: "" },
            { Module: "Spider", Keybind: "", KeybindCode: "" },
            { Module: "Jesus", Keybind: "", KeybindCode: "" }
        ];
    }
}

function ChangeKeybind(Module, Key, KeyCode) {
    for (var element of Keybinds) {
        if (element.Module === Module) {
            element.Keybind = Key !== null ? Key : element.Keybind;
            element.KeybindCode = KeyCode !== null ? KeyCode : element.KeybindCode;
        }
    }
    localStorage.setItem('keybinds', JSON.stringify(Keybinds));
}

// Button Creation
function createButton(button, index, buttonContainer) {
    var btn = document.createElement('img');
    btn.src = button.src;
    btn.style.cssText = `
        position: absolute;
        width: 104px;
        height: 23.3px;
        left: 50%;
        transform: translateX(-50%);
        top: ${15 + index * 35}px;
        z-index: 2147483652;
        transition: transform 0.2s, scale 0.2s;
        cursor: pointer;
    `;
    btn.addEventListener('mouseenter', function () {
        btn.style.transform = 'translateX(-50%) scale(1.05)';
    });
    btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translateX(-50%) scale(1)';
    });
    btn.addEventListener('click', button.onClick);
    buttonContainer.appendChild(btn);
}

function ButtonType(BTN_TYPE = "") {
    var rightButtonContainer = document.getElementById("rightButtonContainer");
    if (!rightButtonContainer) return;
    while (rightButtonContainer.firstChild) {
        rightButtonContainer.removeChild(rightButtonContainer.firstChild);
    }
    if (BTN_TYPE === "Debug") {
        miniConsole.style.display = 'block';
    } else {
        miniConsole.style.display = 'none';
    }
    if (BTN_TYPE === "Themes") {
        themes.forEach(function (theme) {
            rightButtonContainer.appendChild(createRightThemeButton(theme.name, "(Theme)", theme.desc, function () {
                addOutput("Theme", theme.name, "is now active.");
                leftImage.src = theme.LeftImage;
                rightImage.src = theme.RightImage;
                SaveManager.saveString('activeTheme', theme.name);
            }));
        });
    }
    if (BTN_TYPE === "Settings") {
        ModuleManager.modules.forEach(function (module) {
            rightButtonContainer.appendChild(createKeybindButton(module.name, "Keybind", "Change keybind"));
        });
    }
    ModuleManager.modules.forEach(function (module) {
        if (module.type === BTN_TYPE || BTN_TYPE === "") {
            rightButtonContainer.appendChild(createRightButton(module.name, `(${module.type || 'Misc'})`, module.desc || '', module));
        }
    });
}

var themes = [
    {
        name: "(Default) Melon Hub",
        LeftImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/LeftMelon.png?raw=true",
        RightImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/RightMelon.png?raw=true",
        desc: "The default Melon Hub theme."
    },
    {
        name: "Netflix",
        LeftImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/LeftNetflix.png?raw=true",
        RightImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/RIghtNetflix.png?raw=true",
        desc: "Netflix theme including Red and Black colors, and Netflix logos."
    },
    {
        name: "McDonalds",
        LeftImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/LeftMaccas.png?raw=true",
        RightImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/RightMaccas.png?raw=true",
        desc: "McDonalds theme with themed graphics."
    },
    {
        name: "Minecraft",
        LeftImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/LeftMinecraft.png?raw=true",
        RightImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/RightMinecraft.png?raw=true",
        desc: "Minecraft theme including grass and dirt blocks."
    },
    {
        name: "Hatsune Miku",
        LeftImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/LeftMiku.png?raw=true",
        RightImage: "https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/RightMiku.png?raw=true",
        desc: "Hatsune Miku themed interface."
    }
];

var buttonData = [
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/AllBTN.png?raw=true',
        style: 'top:15px;',
        onClick: function () { return ButtonType(""); }
    },
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/CombatBTN.png?raw=true',
        style: 'top:72px;',
        onClick: function () { return ButtonType("Combat"); }
    },
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/MovementBTN.png?raw=true',
        style: 'top:119px;',
        onClick: function () { return ButtonType("Movement"); }
    },
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/PlayerBTN.png?raw=true',
        style: 'top:166px;',
        onClick: function () { return ButtonType("Player"); }
    },
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/ExploitBTN.png?raw=true',
        style: 'top:213px;',
        onClick: function () { return ButtonType("Exploit"); }
    },
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/SettingsBTN.png?raw=true',
        style: 'top:354px;',
        onClick: function () { return ButtonType("Settings"); }
    },
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/ThemesBTN.png?raw=true',
        style: 'top:401px;',
        onClick: function () { return ButtonType("Themes"); }
    },
    {
        src: 'https://github.com/OfficiallyMelon/Melon-Hub/blob/main/Assets/bloxd.io/DebugBTN.png?raw=true',
        style: 'top:448px;',
        onClick: function () { return ButtonType("Debug"); }
    }
];

// Assign Types to Modules
ModuleManager.modules.forEach(module => {
    if (["Killaura", "AutoClicker", "AntiShake", "Aimbot"].includes(module.name)) {
        module.type = "Combat";
    } else if (["Spider", "Jesus"].includes(module.name)) {
        module.type = "Movement";
    } else if (["Scaffold", "Account Gen"].includes(module.name)) {
        module.type = "Player";
    }
    module.desc = {
        "Killaura": "Automatically aims and clicks to attack the nearest player",
        "AutoClicker": "Automatically clicks for you",
        "AntiShake": "Disables camera shake on hit (BROKEN)",
        "Scaffold": "Automatically places blocks under you (BROKEN)",
        "Account Gen": "Clears cookies to generate a new account",
        "Aimbot": "Automatically aims at the nearest player",
        "Spider": "Climb walls",
        "Jesus": "Walk on water and lava"
    }[module.name];
});

buttonData.forEach(function (button, index) {
    createButton(button, index, buttonContainer);
});

ButtonType("");
window.ondragstart = function () { return false; };

// Load Saved Theme
var savedTheme = SaveManager.importString('activeTheme');
if (savedTheme) {
    var theme = themes.find(function (t) { return t.name === savedTheme; });
    if (theme) {
        leftImage.src = theme.LeftImage;
        rightImage.src = theme.RightImage;
    }
}

// Render Loop
function renderLoop() {
    if (config.CurrentlyInjected && config.noaInstance) {
        ModuleManager.modules.forEach(module => {
            if (module.isEnabled) {
                module.onRender();
            }
        });
    } else {
        addError("Render Loop:", "Skipping module execution: injection not ready or noaInstance is null");
    }
    requestAnimationFrame(renderLoop);
}
renderLoop();

document.addEventListener("keydown", t => {
    ModuleManager.handleKeyPress(t.key);
});

/******/ })();