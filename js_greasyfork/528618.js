// ==UserScript==
// @name         网页调试防护工具（增强版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持调试防护 / RTC 保护 / UA伪装 / 指纹防御等功能（含字体、插件、Canvas GPU伪装）
// @author       arschlochnop
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528618/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E9%98%B2%E6%8A%A4%E5%B7%A5%E5%85%B7%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528618/%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95%E9%98%B2%E6%8A%A4%E5%B7%A5%E5%85%B7%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

const DEFAULT_CONFIG = {
    debuggerProtection: true,
    disableRTC: true,
    spoofNavigator: true,
    antiFingerprint: true
};

const state = {
    menuIds: {},
    config: { ...DEFAULT_CONFIG }
};

// ------------- 核心伪装工具 (Native Disguise) -------------
const NativeUtils = (function() {
    const rawToString = Function.prototype.toString;
    const rawToSString = rawToString.call(rawToString);

    function makeNative(func, name) {
        Object.defineProperty(func, 'toString', {
            value: function() {
                if (this === func) {
                    return `function ${name || func.name || 'function'}() { [native code] }`;
                }
                return rawToString.call(this);
            },
            configurable: true,
            writable: true
        });
        Object.defineProperty(func.toString, 'toString', {
            value: function() { return rawToSString; },
            configurable: true,
            writable: true
        });
        return func;
    }
    return { makeNative };
})();

// ------------- 工具 -------------
function override(obj, prop, val) {
    try {
        Object.defineProperty(obj, prop, {
            get: () => val,
            configurable: false
        });
    } catch(e) {
        console.warn('[Override]', prop, 'failed', e);
    }
}

// ------------- 调试防护 (修复只读属性报错) -------------
function debuggerProtections() {
    if (!state.config.debuggerProtection) return;

    const rawConstructor = Function.prototype.constructor;
    const rawSetInterval = window.setInterval;
    const rawEval = window.eval;

    // --- 1. 构造函数 Hook ---
    const safeConstructor = function (params) {
        if (typeof params === 'string' && params.includes("debugger")) {
            params = params.replaceAll("debugger", "");
        }
        return rawConstructor.apply(this, arguments);
    };

    // 修复原型链
    safeConstructor.prototype = Function.prototype;
    // Native 伪装
    NativeUtils.makeNative(safeConstructor, "Function");

    // [关键修复] writable: true
    // 很多库(lodash/jquery)在extend对象时会尝试重写constructor
    // 如果设置为false，严格模式下会抛出 "Cannot assign to read only property"
    Object.defineProperty(Function.prototype, "constructor", {
        value: safeConstructor,
        writable: true, // <--- 必须为 true 以兼容第三方库
        configurable: false
    });

    // --- 2. setInterval Hook ---
    const safeSetInterval = function (code, delay, ...args) {
        if (typeof code === 'string' && code.includes("debugger")) {
            return null;
        }
        return rawSetInterval.call(window, code, delay, ...args);
    };
    NativeUtils.makeNative(safeSetInterval, "setInterval");
    Object.defineProperty(window, "setInterval", {
        value: safeSetInterval,
        configurable: true // 建议保持 true 以免破坏某些热重载逻辑
    });

    // --- 3. Eval Hook ---
    const safeEval = function (code) {
        if (typeof code === 'string' && code.includes("debugger")) {
            code = code.replaceAll("debugger", "");
        }
        return rawEval.call(window, code);
    };
    NativeUtils.makeNative(safeEval, "eval");
    Object.defineProperty(window, "eval", {
        value: safeEval,
        configurable: true
    });

    console.log("[Tampermonkey] Debugger防护已启用 (兼容性修复版)");
}

// ------------- RTC 保护 -------------
function disableRTCObjects() {
    if (!state.config.disableRTC) return;
    const rtcItems = [
        "RTCError", "RTCRtpSender", "RTCDTMFSender", "RTCErrorEvent",
        "RTCTrackEvent", "RTCCertificate", "RTCDataChannel", "RTCRtpReceiver",
        "RTCStatsReport", "RTCIceCandidate", "RTCIceTransport", "RTCDtlsTransport",
        "RTCSctpTransport", "RTCPeerConnection", "RTCRtpTransceiver", "RTCDataChannelEvent",
        "RTCEncodedAudioFrame", "RTCEncodedVideoFrame", "RTCSessionDescription",
        "RTCDTMFToneChangeEvent", "RTCPeerConnectionIceEvent", "RTCPeerConnectionIceErrorEvent"
    ];
    ["", "webkit", "moz", "ms"].forEach(prefix => {
        rtcItems.forEach(rtc => {
            const obj = prefix + rtc;
            if (window[obj]) {
                try {
                     // 使用 undefined 覆盖比 delete 更温和，防止 delete 报错
                    window[obj] = undefined;
                } catch(e) { console.warn('Failed to disable RTC:', obj); }
            }
        });
    });
    console.log("[Tampermonkey] RTC 对象已禁用");
}

// ------------- Navigator 伪装 -------------
function spoofNavigator() {
    if (!state.config.spoofNavigator) return;

    const platform = "Android";
    const ua = "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL Build/QQ1A.200205.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Mobile Safari/537.36";

    // 使用 try-catch 包裹，因为部分浏览器可能封锁了这些属性的修改
    try {
        Object.defineProperty(navigator, 'platform', { get: () => platform, configurable: true });
        Object.defineProperty(navigator, 'userAgent', { get: () => ua, configurable: true });
        Object.defineProperty(navigator, 'appVersion', { get: () => '5.0 (Linux; Android 10; Pixel 3 XL Build/QQ1A.200205.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Mobile Safari/537.36', configurable: true });
    } catch(e) { console.log("Navigator spoofing partial failure"); }

    const rawResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = function() {
        const options = rawResolvedOptions.call(this);
        options.timeZone = 'Asia/Tokyo';
        return options;
    };
    console.log("[Tampermonkey] navigator 对象已伪装");
}

// ------------- 防指纹核心 -------------
function antiFingerprint() {
    if (!state.config.antiFingerprint) return;

    // 1. Plugin / MimeType 伪装
    function createPlugin(name, description, suffix) {
        return {
            name: name,
            description: description,
            filename: name.toLowerCase() + suffix,
            length: 1,
            0: { type: 'application/x-' + name.toLowerCase(), suffixes: suffix.replace('.', '') }
        };
    }
    const fakePlugins = [
        createPlugin('Chrome PDF Plugin', 'Portable Document Format', '.pdf'),
        createPlugin('Chrome PDF Viewer', '', ''),
        createPlugin('Native Client', '', '')
    ];
    // 兼容性写法，避免报错
    if(Object.getOwnPropertyDescriptor(navigator, 'plugins')?.configurable) {
         override(navigator, 'plugins', fakePlugins);
    }
    if(Object.getOwnPropertyDescriptor(navigator, 'mimeTypes')?.configurable) {
         override(navigator, 'mimeTypes', []);
    }

    // 2. Canvas 噪声
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        const ctx = origGetContext.call(this, type, ...args);
        if (type === '2d' && ctx) {
            const origGetImageData = ctx.getImageData;
            ctx.getImageData = function(x, y, w, h) {
                const imageData = origGetImageData.call(this, x, y, w, h);
                if (imageData.data.length > 0) {
                   const idx = Math.floor(Math.random() * (imageData.data.length / 4)) * 4;
                   imageData.data[idx] = Math.max(0, Math.min(255, imageData.data[idx] + (Math.random() > 0.5 ? 1 : -1)));
                }
                return imageData;
            };
            NativeUtils.makeNative(ctx.getImageData, "getImageData");
        }
        return ctx;
    };
    NativeUtils.makeNative(HTMLCanvasElement.prototype.getContext, "getContext");

    // 3. WebGL 参数
    const origGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(param) {
        if (param === 37445) return 'Google Inc. (NVIDIA)';
        if (param === 37446) return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)';
        return origGetParameter.call(this, param);
    };
    NativeUtils.makeNative(WebGLRenderingContext.prototype.getParameter, "getParameter");

    // 4. 屏幕尺寸
    const spoofedScreen = { width: 375, height: 812, availWidth: 375, availHeight: 724, colorDepth: 24, pixelDepth: 24 };
    for (const key in spoofedScreen) {
        try { override(screen, key, spoofedScreen[key]); } catch(e){}
    }
    override(navigator, 'hardwareConcurrency', 4);
    console.log("[Tampermonkey] Anti-Fingerprint 已启用");
}

// ------------- 菜单管理 -------------
async function toggleFeature(key, label, tooltip, hookFunc) {
    state.config[key] = !state.config[key];
    await GM_setValue(key, state.config[key]);
    if (!state.config[key]) location.reload();
    updateMenu(key, label, tooltip, hookFunc);
}

function updateMenu(key, label, tooltip, hookFunc) {
    if (state.menuIds[key]) GM_unregisterMenuCommand(state.menuIds[key]);
    const status = state.config[key] ? "✅" : "❌";
    state.menuIds[key] = GM_registerMenuCommand(
        `[${status}] ${label}`,
        () => toggleFeature(key, label, tooltip, hookFunc),
        tooltip
    );
}

// ------------- 初始化 -------------
(async () => {
    for (let key of Object.keys(DEFAULT_CONFIG)) {
        state.config[key] = await GM_getValue(key, DEFAULT_CONFIG[key]);
    }
    debuggerProtections();
    disableRTCObjects();
    spoofNavigator();
    antiFingerprint();

    updateMenu("debuggerProtection", "Debugger防护", "拦截所有 debugger 注入方法", debuggerProtections);
    updateMenu("disableRTC", "屏蔽 RTC 对象", "防止通过 WebRTC 泄露真实 IP", disableRTCObjects);
    updateMenu("spoofNavigator", "伪造 Navigator 信息", "模拟 Android 设备 UA 和系统属性", spoofNavigator);
    updateMenu("antiFingerprint", "指纹防御", "WebGl/Canvas/Screen 伪装", antiFingerprint);
})();