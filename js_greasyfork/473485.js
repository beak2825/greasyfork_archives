// ==UserScript==
// @name		微信读书自动阅读
// @name:en		WeChatReadAutoScroll
// @description		微信读书阅读自动滚动, 触底自动翻页
// @description:en	微信读书阅读自动滚动, 触底自动翻页
// @version		1.0.0
// @match		https://weread.qq.com/web/reader/*
// @author		Yiero
// @icon		https://weread.qq.com/favicon.ico
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts/
// @license		GPL
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_listValues
// @run-at		document-idle
// @downloadURL https://update.greasyfork.org/scripts/473485/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/473485/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==
var __defProp = Object.defineProperty;

var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: value2
}) : obj[key] = value2;

var __publicField = (obj, key, value2) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);
    return value2;
};

class Info {
    constructor(projectName) {
        __publicField(this, "projectName");
        __publicField(this, "header");
        this.projectName = projectName;
        this.header = `[${projectName}]`;
    }
    log(...msg) {
        (() => {})(...this.contentInfo(...msg));
    }
    info(...msg) {
        console.info(...this.contentInfo(...msg));
    }
    warn(...msg) {
        console.warn(...this.contentInfo(...msg));
    }
    error(...msg) {
        console.error(...this.contentInfo(...msg));
    }
    contentInfo(...msg) {
        return [ this.header, `[${(new Date).toLocaleString("zh-ch")}]`, ...msg ];
    }
}

function MathCeilFloat(number, decimal = 0) {
    decimal = Math.pow(10, decimal);
    return Math.ceil(number * decimal) / decimal;
}

function isReachedPageBottom() {
    const {scrollTop: scrollTop, clientHeight: clientHeight, scrollHeight: scrollHeight} = document.documentElement;
    return scrollTop + clientHeight >= scrollHeight;
}

class ScrollOptionsImpl {
    constructor() {
        __publicField(this, "_delayPerMs", 0);
        __publicField(this, "_frameDuration", 0);
        __publicField(this, "_framePerSecond", 0);
        __publicField(this, "_movementDistancePerSecond", 0);
    }
    get delayPerMs() {
        return this._delayPerMs;
    }
    set delayPerMs(value) {
        if (typeof value === "string") {
            const scrollPageDuration = window.innerHeight / this.movementDistancePerSecond * 1e3;
            print.log(scrollPageDuration, this.movementDistancePerSecond);
            try {
                this._delayPerMs = eval(value.replace("auto", String(scrollPageDuration)));
            } catch (e) {
                this._delayPerMs = scrollPageDuration;
            }
        } else {
            this._delayPerMs = value;
        }
    }
    get movementDistancePerFrame() {
        return MathCeilFloat(this.movementDistancePerSecond / this.framePerSecond, 3);
    }
    get frameDuration() {
        return MathCeilFloat(1e3 / this._frameDuration);
    }
    get framePerSecond() {
        return this._framePerSecond;
    }
    set framePerSecond(value2) {
        this._framePerSecond = value2;
    }
    get movementDistancePerSecond() {
        return this._movementDistancePerSecond;
    }
    set movementDistancePerSecond(value2) {
        this._movementDistancePerSecond = value2;
    }
}

class GlobalAutoScroll {
    constructor(movementDistancePerSecond, delayPerMs = "auto", framePerSecond = 60) {
        __publicField(this, "options", new ScrollOptionsImpl);
        __publicField(this, "timer");
        this.options.movementDistancePerSecond = movementDistancePerSecond;
        this.options.delayPerMs = delayPerMs;
        this.options.framePerSecond = framePerSecond;
    }
    open() {
        if (this.timer) {
            this.close();
        }
        scrollStatusStorage.set("scrolling");
        print.info("等待滚动: ", this.options.delayPerMs);
        this.timer = window.setTimeout((() => {
            this.timer = window.setInterval((() => {
                this.scroll();
                if (isReachedPageBottom()) {
                    this.close();
                }
            }), this.options.frameDuration);
        }), this.options.delayPerMs);
    }
    close() {
        scrollStatusStorage.set("scroll-end");
        clearTimeout(this.timer);
        clearInterval(this.timer);
        this.timer = void 0;
    }
    scroll() {
        const movementDistancePerFrame = this.options.movementDistancePerFrame;
        scrollBy(0, movementDistancePerFrame);
    }
}

class GMConfigMenu {
    constructor(callback) {
        __publicField(this, "menuId", 0);
        __publicField(this, "callback");
        this.callback = callback;
    }
    open(title) {
        if (this.menuId) {
            this.close();
        }
        this.menuId = GM_registerMenuCommand(title, this.callback);
    }
    close() {
        GM_unregisterMenuCommand(this.menuId);
        this.menuId = 0;
    }
}

class LocalStorage {
    constructor(key) {
        __publicField(this, "key");
        this.key = key;
    }
    get(defaultValue) {
        return localStorage.getItem(this.key) || defaultValue || "";
    }
    remove() {
        const oldValue = this.get();
        const newValue = void 0;
        dispatchEvent(new CustomEvent("storageUpdate", {
            detail: {
                key: this.key,
                newValue: newValue,
                oldValue: oldValue
            }
        }));
        localStorage.removeItem(this.key);
    }
    set(value2) {
        const oldValue = this.get();
        const newValue = value2;
        dispatchEvent(new CustomEvent("storageUpdate", {
            detail: {
                key: this.key,
                newValue: newValue,
                oldValue: oldValue
            }
        }));
        localStorage.setItem(this.key, value2);
    }
}

class SessionStorage {
    constructor(key) {
        __publicField(this, "key");
        this.key = key;
    }
    get(defaultValue) {
        return sessionStorage.getItem(this.key) || defaultValue || "";
    }
    remove() {
        const oldValue = this.get();
        const newValue = void 0;
        dispatchEvent(new CustomEvent("storageUpdate", {
            detail: {
                key: this.key,
                newValue: newValue,
                oldValue: oldValue
            }
        }));
        sessionStorage.removeItem(this.key);
    }
    set(value2) {
        const oldValue = this.get();
        const newValue = value2;
        dispatchEvent(new CustomEvent("storageUpdate", {
            detail: {
                key: this.key,
                newValue: newValue,
                oldValue: oldValue
            }
        }));
        sessionStorage.setItem(this.key, value2);
    }
}

new MouseEvent("mouseenter", {
    button: 0,
    bubbles: true,
    cancelable: true,
    clientX: 819,
    clientY: 413
});

new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    button: 0
});

new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
    button: 0
});

new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    button: 0
});

function fireKeyEvent(el = document, evtType, keyCode) {
    let evtObj;
    if (document.createEvent) {
        if (window.KeyEvent) {
            evtObj = document.createEvent("KeyEvents");
            evtObj.initKeyEvent(evtType, true, true);
            el.dispatchEvent(evtObj);
            return;
        }
        evtObj = document.createEvent("UIEvents");
        evtObj.initUIEvent(evtType, true, true);
        delete evtObj.keyCode;
        if (typeof evtObj.keyCode === "undefined") {
            Object.defineProperty(evtObj, "keyCode", {
                value: keyCode
            });
        } else {
            evtObj.key = String.fromCharCode(keyCode);
        }
        if (typeof evtObj.ctrlKey === "undefined") {
            Object.defineProperty(evtObj, "ctrlKey", {
                value: true
            });
        } else {
            evtObj.ctrlKey = true;
        }
        el.dispatchEvent(evtObj);
        return;
    }
}

const print = new Info("WeChatReadAutoScroll");

const scrollStatusStorage = new SessionStorage("scrollStatus");

(async () => {
    const scrollSpeedController = new GMConfigMenu((() => {
        const result = prompt("页面滚动速度(px/s)");
        if (!result) {
            return;
        }
        localStorage.setItem("scrollSpeed", result);
    }));
    scrollSpeedController.open("[配置] 滚动速度");
    const scrollDelayController = new GMConfigMenu((() => {
        const result = prompt("滚动开启延时 ( auto | (auto / 2) | number ) (ms)");
        if (!result) {
            return;
        }
        localStorage.setItem("scrollDelay", result);
    }));
    scrollDelayController.open("[配置] 滚动开启延时");
    function scrollSwitch() {
        let globalAutoScroll;
        const scrollOpenController = new GMConfigMenu(scrollOpenMenuCallback);
        function scrollOpenMenuCallback() {
            const scrollSpeedStorage = new LocalStorage("scrollSpeed");
            const scrollDelayStorage = new LocalStorage("scrollDelay");
            globalAutoScroll = new GlobalAutoScroll(+scrollSpeedStorage.get("100"), scrollDelayStorage.get("auto"), 60);
            globalAutoScroll.open();
            window.addEventListener("click", (() => {
                globalAutoScroll.close();
            }), {
                once: true
            });
            scrollOpenController.close();
            scrollCloseController.open("关闭滚动");
        }
        const scrollCloseController = new GMConfigMenu((() => {
            globalAutoScroll.close();
            scrollCloseMenuCallback();
        }));
        function scrollCloseMenuCallback() {
            scrollCloseController.close();
            scrollOpenController.open("开启滚动");
        }
        scrollOpenController.open("开启滚动");
        scrollStatusStorage.set("scroll-start");
        window.addEventListener("storageUpdate", (e => {
            const event = e;
            if (event.detail.key === "scrollStatus" && event.detail.newValue === "scroll-end") {
                scrollCloseMenuCallback();
                if (isReachedPageBottom()) {
                    fireKeyEvent(document, "keydown", 39);
                    scrollOpenMenuCallback();
                }
            }
        }));
    }
    scrollSwitch();
})();
