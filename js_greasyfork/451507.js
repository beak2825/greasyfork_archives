// ==UserScript==
// @name                 Xbox Cloud Gaming Vibration
// @name:zh-CN           Xbox Cloud Gaming 游戏振动支持
// @name:zh-TW           Xbox Cloud Gaming 游戲振動支持
// @namespace            http://tampermonkey.net/
// @version              1.4
// @description          Add game force feedback (vibration or rumble) support for Xbox Cloud Gaming
// @description:zh-CN    让 Xbox Cloud Gaming 支持游戏力反馈（振动）功能
// @description:zh-TW    將 Xbox Cloud Gaming 支援游戲力回饋（振動）功能
// @author               TGSAN
// @match                https://www.xbox.com/*/play*
// @icon                 data:image/png;base64,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
// @inject-into          page
// @run-at               document-start
// @grant                unsafeWindow
// @grant                GM_setValue
// @grant                GM_getValue
// @grant                GM_registerMenuCommand
// @grant                GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/451507/Xbox%20Cloud%20Gaming%20Vibration.user.js
// @updateURL https://update.greasyfork.org/scripts/451507/Xbox%20Cloud%20Gaming%20Vibration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const useControllerVibration = true;
    const useMobileVibration = true;
    const lang = navigator.language.toLowerCase();

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[Xbox Cloud Gaming Vibration] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[Xbox Cloud Gaming Vibration] use window mode (your userscript extensions not support unsafeWindow)");
    }

    let configList = {
        "XCLOUD_HAPTIC_IMPULSE_TRIGGERS_EMU": {
            "desc": {
                "en": "Impulse Triggers Haptic Emulation",
                "zh": "脈衝發射鍵觸覺回饋仿真",
                "zh-cn": "脉冲扳机触感反馈模拟",
            },
            "value": "1"
        },
        "XCLOUD_HAPTIC_CONTROLLER_ENABLE": {
            "desc": {
                "en": "Gamepad Haptic ",
                "zh": "游戲控制器觸覺回饋",
                "zh-cn": "游戏控制器触感反馈",
            },
            "value": "1"
        },
        "XCLOUD_HAPTIC_DEVICE_ENABLE": {
            "desc": {
                "en": "Device Haptic (Tablet or Mobile)",
                "zh": "裝置觸覺回饋（平板電腦或手機）",
                "zh-cn": "设备触感反馈（平板电脑或手机）",
            },
            "value": "1"
        },
        "XCLOUD_HAPTIC_DEVICE_AUTO_DISABLE": {
            "desc": {
                "en": "Disable Device Haptic When Using Gamepad",
                "zh": "使用游戲控制器時停用裝置觸覺回饋",
                "zh-cn": "使用游戏控制器时禁用设备触感反馈",
            },
            "value": "1"
        }
    }
    let menuItemList = [];

    function checkSelected(key) {
        let value = GM_getValue(key);
        if (value === undefined) {
            GM_setValue(key, configList[key].value);
        }
        return value == "1";
    }

    function registerSwitchMenuItem(key) {
        let configItem = configList[key];
        let name = configItem["desc"]["en"];
        let blurMatch = configItem["desc"][lang.substr(0, 2)];
        let match = configItem["desc"][lang];
        if (match) {
            name = match;
        } else if (blurMatch) {
            name = blurMatch;
        }
        let isSelected = checkSelected(key);
        return GM_registerMenuCommand((isSelected ? "✅" : "🔲") + " " + name, function() {
            GM_setValue(key, isSelected ? "0" : "1");
            loadAndUpdateSwitchMenuItem();
        });
    }

    async function loadAndUpdateSwitchMenuItem() {
        for(let command of menuItemList) {
            await GM_unregisterMenuCommand(command);
        }
        menuItemList = [];
        let configKeys = Object.keys(configList);
        for(let configKey of configKeys) {
            configList[configKey].value = checkSelected(configKey) ? "1" : "0";
            menuItemList.push(await registerSwitchMenuItem(configKey));
        }
        // Apply
        haptic.enableControllerHaptic = checkSelected("XCLOUD_HAPTIC_CONTROLLER_ENABLE");
        haptic.enableDeviceHaptic = checkSelected("XCLOUD_HAPTIC_DEVICE_ENABLE");
        haptic.alwaysEnableDeviceHaptic = !checkSelected("XCLOUD_HAPTIC_DEVICE_AUTO_DISABLE");
    }

    let haptic = null;
    const xinputMaxHaptic = 65535;

    windowCtx.RTCPeerConnection.prototype.originalCreateDataChannelXCGV = windowCtx.RTCPeerConnection.prototype.createDataChannel;
    windowCtx.RTCPeerConnection.prototype.createDataChannel = function (...params) {
        let dc = this.originalCreateDataChannelXCGV(...params);
        if (dc.label == "input") {
            dc.addEventListener("message", function (de) {
                if (typeof(de.data) == "object") {
                    let dataBytes = new Uint8Array(de.data);
                    if (dataBytes[0] == 128) {
                        const leftM = dataBytes[3] / 255;
                        const rightM = dataBytes[4] / 255;
                        const leftT = dataBytes[5] / 255;
                        const rightT = dataBytes[6] / 255;
                        let wLeftMotorSpeed = leftM * xinputMaxHaptic;
                        let wRightMotorSpeed = rightM * xinputMaxHaptic;
                        if (checkSelected("XCLOUD_HAPTIC_IMPULSE_TRIGGERS_EMU")) {
                            wRightMotorSpeed = Math.max(wRightMotorSpeed, leftT * xinputMaxHaptic, rightT * xinputMaxHaptic);
                        }
                        if (haptic) {
                            haptic.SetState(wLeftMotorSpeed, wRightMotorSpeed);
                        }
                    }
                }
            });
            dc.addEventListener("close", function () {
                if (haptic) haptic.SetState(0, 0);
            });
        }
        return dc;
    }

    // WebHaptic.ts Compile with Webpack, using Polify, disable UglifyJS
    var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function (t, e, i, a) {
        if (i === "a" && !a) throw new TypeError("Private accessor was defined without a getter");
        if (typeof e === "function" ? t !== e || !a : !e.has(t)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return i === "m" ? a : i === "a" ? a.call(t) : a ? a.value : e.get(t)
    };
    var __classPrivateFieldSet = this && this.__classPrivateFieldSet || function (t, e, i, a, s) {
        if (a === "m") throw new TypeError("Private method is not writable");
        if (a === "a" && !s) throw new TypeError("Private accessor was defined without a setter");
        if (typeof e === "function" ? t !== e || !s : !e.has(t)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return a === "a" ? s.call(t, i) : s ? s.value = i : e.set(t, i), i
    };
    var _WebHapticV2_enableControllerHaptic, _WebHapticV2_enableDeviceHaptic;
    class WebHapticV2 {
        set enableControllerHaptic(t) {
            var e;
            if (__classPrivateFieldGet(this, _WebHapticV2_enableControllerHaptic, "f") != t) {
                __classPrivateFieldSet(this, _WebHapticV2_enableControllerHaptic, t, "f");
                if (t) {
                    this.controllerHaptic = new WebControllerHaptic
                } else {
                    (e = this.controllerHaptic) === null || e === void 0 ? void 0 : e.Dispose();
                    this.controllerHaptic = undefined
                }
            }
        }
        get enableControllerHaptic() {
            return __classPrivateFieldGet(this, _WebHapticV2_enableControllerHaptic, "f")
        }
        set enableDeviceHaptic(t) {
            var e;
            if (__classPrivateFieldGet(this, _WebHapticV2_enableDeviceHaptic, "f") != t) {
                __classPrivateFieldSet(this, _WebHapticV2_enableDeviceHaptic, t, "f");
                if (t) {
                    this.deviceHaptic = new WebDeviceHaptic
                } else {
                    (e = this.deviceHaptic) === null || e === void 0 ? void 0 : e.Dispose();
                    this.deviceHaptic = undefined
                }
            }
        }
        get enableDeviceHaptic() {
            return __classPrivateFieldGet(this, _WebHapticV2_enableDeviceHaptic, "f")
        }
        constructor(t = 0) {
            _WebHapticV2_enableControllerHaptic.set(this, false);
            _WebHapticV2_enableDeviceHaptic.set(this, false);
            this.alwaysEnableDeviceHaptic = false;
            this.updateTimeoutMs = t;
            this.enableDeviceHaptic = false;
            this.enableControllerHaptic = false
        }
        SetState(t, e) {
            if (this.updateTimeoutId) {
                clearTimeout(this.updateTimeoutId)
            }
            let i = false;
            if (this.controllerHaptic !== undefined) {
                i = this.controllerHaptic.GetHapticGamepadsCount() > 0;
                this.controllerHaptic.SetState(t, e)
            }
            if (this.deviceHaptic !== undefined) {
                if (this.alwaysEnableDeviceHaptic || !i) {
                    this.deviceHaptic.SetState(t, e)
                } else {
                    this.deviceHaptic.SetState(0, 0)
                }
            }
            if (this.updateTimeoutMs > 0) {
                if (t > 0 || e > 0) {
                    this.updateTimeoutId = setTimeout(() => {
                        this.updateTimeoutId = undefined;
                        this.SetState(0, 0)
                    }, this.updateTimeoutMs)
                }
            }
        }
        Dispose() {
            this.SetState(0, 0);
            this.enableControllerHaptic = false;
            this.enableDeviceHaptic = false
        }
    }
    _WebHapticV2_enableControllerHaptic = new WeakMap, _WebHapticV2_enableDeviceHaptic = new WeakMap;
    class WebDeviceHaptic {
        constructor() {
            this.tickSliceCount = 100;
            this.tickSliceMs = 10;
            this.rangeTirm = 8;
            this.supportDeviceHaptic = false;
            this.pwmTerminateTick = 0;
            this.supportDeviceHaptic = WebDeviceHaptic.IsSupport()
        }
        Dispose() {
            this.SetState(0, 0)
        }
        SetState(t, e) {
            this.SetWebHapticState(t, e)
        }
        getAdvancedVibrateMotorPercent(t) {
            const e = .75;
            const i = -.1;
            const a = 1 / (e + i * t);
            return Math.pow(t, a)
        }
        SetWebHapticState(a, s) {
            if (this.supportDeviceHaptic) {
                let t = .5;
                let e = 65535;
                let i = Math.max(a, s * t);
                if (i > 0) {
                    let t = this.getAdvancedVibrateMotorPercent(i / e);
                    this.pwmTerminateTick = Math.round(this.tickSliceCount / this.rangeTirm * t);
                    const n = this.tickSliceCount * this.tickSliceMs * this.rangeTirm;
                    if (this.hapticPwmIntervalId === undefined) {
                        let t = 0;
                        this.hapticPwmIntervalId = setInterval(() => {
                            if (t == 0) {
                                window.navigator.vibrate(n)
                            }
                            if (t < this.pwmTerminateTick) {
                                t++
                            } else {
                                t = 0
                            }
                        }, this.tickSliceMs)
                    }
                } else {
                    if (this.hapticPwmIntervalId !== undefined) {
                        clearInterval(this.hapticPwmIntervalId);
                        this.hapticPwmIntervalId = undefined
                    }
                    window.navigator.vibrate(0)
                }
            }
        }
        static IsSupport() {
            if (!!window.navigator.vibrate) {
                return true
            } else {
                return false
            }
        }
    }
    class WebControllerHaptic {
        constructor() {
            this.magnitudeDurationMs = 1e3;
            this.supportControllerHaptic = false;
            this.gamepads = [];
            this.hapticGamepadsCount = 0;
            this.supportControllerHaptic = WebControllerHaptic.IsSupport();
            this.onGamepadConnected = t => {
                console.log("A gamepad was connected:" + t.gamepad.id);
                this.UpdateGamepads()
            };
            this.onGamepadDisonnected = t => {
                console.log("A gamepad was disconnected:" + t.gamepad.id);
                this.UpdateGamepads()
            };
            if (this.supportControllerHaptic) {
                window.addEventListener("gamepadconnected", this.onGamepadConnected);
                window.addEventListener("gamepaddisconnected", this.onGamepadDisonnected);
                this.UpdateGamepads()
            }
        }
        GetHapticGamepadsCount() {
            return this.hapticGamepadsCount
        }
        Dispose() {
            this.SetState(0, 0);
            if (this.supportControllerHaptic) {
                window.removeEventListener("gamepadconnected", this.onGamepadConnected);
                window.removeEventListener("gamepaddisconnected", this.onGamepadDisonnected)
            }
        }
        SetState(t, e) {
            this.SetControllerState(t, e)
        }
        SetControllerState(a, s) {
            var n, o, r;
            if (this.hapticTimeoutId != undefined) {
                clearTimeout(this.hapticTimeoutId);
                this.hapticTimeoutId = undefined
            }
            if (this.supportControllerHaptic) {
                let t = 65535;
                let e = a / t;
                let i = s / t;
                for (const [c, l] of Object.entries(this.gamepads)) {
                    if (l != null) {
                        (n = l === null || l === void 0 ? void 0 : l.vibrationActuator) === null || n === void 0 ? void 0 : n.playEffect("dual-rumble", {
                            duration: this.magnitudeDurationMs,
                            strongMagnitude: e,
                            weakMagnitude: i
                        });
                        if (l.hapticActuators != null) {
                            (o = l.hapticActuators[0]) === null || o === void 0 ? void 0 : o.pulse(e, this.magnitudeDurationMs);
                            (r = l.hapticActuators[1]) === null || r === void 0 ? void 0 : r.pulse(i, this.magnitudeDurationMs)
                        }
                    }
                }
                if (a > 0 || s > 0) {
                    this.hapticTimeoutId = setTimeout(() => {
                        this.hapticTimeoutId = undefined;
                        this.SetControllerState(a, s)
                    }, this.magnitudeDurationMs + 15)
                }
            }
        }
        UpdateGamepads() {
            this.gamepads = navigator.getGamepads();
            let e = 0;
            this.gamepads.forEach(t => {
                if (t != null) {
                    if (t.vibrationActuator != null) {
                        e++
                    } else if (t.hapticActuators != null && t.hapticActuators.length > 0) {
                        e++
                    }
                }
            });
            this.hapticGamepadsCount = e
        }
        static IsSupport() {
            var t, e, i, a;
            if (!!window.Gamepad && (((e = (t = window.GamepadHapticActuator) === null || t === void 0 ? void 0 : t.prototype) === null || e === void 0 ? void 0 : e.hasOwnProperty("playEffect")) || ((a = (i = window.GamepadHapticActuator) === null || i === void 0 ? void 0 : i.prototype) === null || a === void 0 ? void 0 : a.hasOwnProperty("pulse")))) {
                return true
            } else {
                return false
            }
        }
    }

    windowCtx.xcloudHaptic = new WebHapticV2();
    haptic = windowCtx.xcloudHaptic;

    loadAndUpdateSwitchMenuItem();
})();