// ==UserScript==
// @name         YT 彈幕
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  在直播串流時將聊天室的訊息轉換成彈幕發送
// @author       JayHuang
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/b5305900/img/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527661/YT%20%E5%BD%88%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527661/YT%20%E5%BD%88%E5%B9%95.meta.js
// ==/UserScript==
const showUser = false; // 是否顯示使用者
const fontFamily = "Arial"; // 字型
const speed = 2; // 每幀移動 px 量
const bufferDistance = 20; // 開始位置增量(px)，防止突兀的出現
const size = 36; // 字體大小
const weight = 800; // 字體粗細 (normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900)
const alive = 5; // 存活秒數(若 `fixed` 為 `true` 時才會生效)
const at = "full"; // 上下半部( "top" | "bottom" | "full" )
const from = "right"; // 從左到右 或 從右到左 ( "right" | "left" )
// ----------以上可調整--------------
const defaultConfig = {
    showUser,
    color: "white", // 字體顏色
    fontFamily,
    size,
    fontSizeRadio: false, // 字體大小是否跟隨影片比例調整
    weight,
    at,
    from,
    speed,
    bufferDistance,
    fixed: false, // 是否固度位置
    alive, // 若 `fixed` 為 `true` 時才會生效
};
var SceneInitState;
(function (SceneInitState) {
    SceneInitState[SceneInitState["\u670D\u52D9\u5DF2\u7D50\u675F"] = 0] = "\u670D\u52D9\u5DF2\u7D50\u675F";
    SceneInitState[SceneInitState["\u670D\u52D9\u521D\u59CB\u5316"] = 1] = "\u670D\u52D9\u521D\u59CB\u5316";
    SceneInitState[SceneInitState["\u670D\u52D9\u5DF2\u555F\u52D5"] = 2] = "\u670D\u52D9\u5DF2\u555F\u52D5";
})(SceneInitState || (SceneInitState = {}));
const danmuState = "danmuState";
const danmuManualCtrl = "danmuCtrl";
function theLog(...message) {
    console.log("[danmu]::", ...message);
}
function sleep(millisecond = 400) {
    return new Promise((resolve) => {
        setTimeout(resolve, millisecond);
    });
}
function debounceWrapper(func, wait = 1000) {
    let timeout = null;
    return function (...args) {
        if (timeout) {
            theLog("Too Fast!!");
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
async function getElement(selectors, option = {}) {
    var _a, _b;
    let element = null;
    const signal = (_a = option.signal) !== null && _a !== void 0 ? _a : { aborted: false };
    let limitRetry = (_b = option.limitRetry) !== null && _b !== void 0 ? _b : 400;
    const delaytime = option.delaytime;
    while (element === null && limitRetry >= 0) {
        if (signal.aborted) {
            throw new Error(`Search aborted for selector: ${selectors} and Reason: ${signal.reason}`);
        }
        element = document.querySelector(selectors);
        limitRetry -= 1;
        await sleep(delaytime);
    }
    if (element) {
        return element;
    }
    else {
        throw new Error("Not Found Element: " + selectors);
    }
}
class DanMuManager {
    get ratio() {
        return window.devicePixelRatio;
    }
    get isFreeze() {
        return document.visibilityState === "hidden";
    }
    get isActive() {
        return !this.isFreeze;
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        theLog("DanMuManager Constructor");
        this.canvas = document.createElement("canvas");
        const ctx = this.canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("Not Support Canvas Context");
        }
        else {
            this.ctx = ctx;
            this.danmuSet = new Set();
            this.__injectCanvas();
            this.loop = this.loop.bind(this);
            this.loodID = requestAnimationFrame(this.loop);
        }
    }
    loop() {
        this.__setCanvas();
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);
        const willDelete = [];
        this.danmuSet.forEach((danmu) => {
            const obj = danmu.update();
            if (obj) {
                const { size, color, weight, message, x, y } = obj;
                this.ctx.font = `${weight} ${size}px Arial`;
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 1;
                this.ctx.fillText(message, x, y);
                this.ctx.strokeText(message, x, y);
            }
            else {
                willDelete.push(danmu);
            }
        });
        willDelete.forEach((danmu) => {
            this.danmuSet.delete(danmu);
        });
        this.loodID = requestAnimationFrame(this.loop);
    }
    addDanmu(message, user, option) {
        if (this.isActive) {
            const width = this.canvas.width;
            const height = this.canvas.height;
            const danmu = new DanMu(message, user, { width, height }, this, option);
            this.danmuSet.add(danmu);
        }
    }
    onDestroy() {
        this.canvas.remove();
        this.danmuSet.clear();
        cancelAnimationFrame(this.loodID);
        theLog("DanMuManager onDestroy");
    }
    __injectCanvas() {
        var _a;
        (_a = this.elementRef.parentElement) === null || _a === void 0 ? void 0 : _a.append(this.canvas);
    }
    __setCanvas() {
        this.canvas.style.position = "absolute";
        this.canvas.style.width = this.elementRef.style.width;
        this.canvas.style.height = this.elementRef.style.height;
        this.canvas.style.top = this.elementRef.style.top;
        this.canvas.style.left = this.elementRef.style.left;
        this.canvas.width = this.elementRef.clientWidth * this.ratio;
        this.canvas.height = this.elementRef.clientHeight * this.ratio;
    }
}
class DanMu {
    get width() {
        return this.elementRef.width;
    }
    get height() {
        return this.elementRef.height;
    }
    constructor(message, user, elementRef, manager, config) {
        this.message = message;
        this.user = user;
        this.elementRef = elementRef;
        this.manager = manager;
        const { showUser, color, size, weight, fixed, at, from, bufferDistance, speed, alive, fontFamily, fontSizeRadio, } = Object.assign(Object.assign({}, defaultConfig), config);
        this.config = {
            showUser,
            color,
            size,
            weight,
            fontFamily,
            fixed,
            at,
            from,
            speed: fixed ? 0 : from === "left" ? speed : speed * -1,
            alive: alive * 1000,
            bufferDistance,
            fontSizeRadio,
        };
        this.textWidth = this.__computerWidth();
        const ref_x = (this.textWidth + bufferDistance) * 1.5;
        this.rangeX = [ref_x * -1, this.width + ref_x];
        this.locate = this.__getInitLoate();
        this.currXaxis = this.locate.x;
        this.isEnd = false;
        this.time = Date.now();
    }
    update() {
        if (this.isEnd) {
            return null;
        }
        else {
            const { size, weight, color, showUser, speed, alive, fixed } = this.config;
            const message = showUser
                ? `${this.user} 說: ${this.message}`
                : this.message;
            this.currXaxis += speed;
            if (fixed) {
                const timeGap = Date.now() - this.time;
                if (timeGap >= alive) {
                    this.isEnd = true;
                }
            }
            else if (this.currXaxis < this.rangeX[0] ||
                this.currXaxis > this.rangeX[1]) {
                this.isEnd = true;
            }
            return {
                size,
                weight,
                color,
                message,
                x: this.currXaxis,
                y: this.locate.y,
            };
        }
    }
    __computerWidth() {
        const { weight, size } = this.config;
        this.manager.ctx.font = `${weight} ${size}px Arial`;
        const textMetrics = this.manager.ctx.measureText(this.message);
        return textMetrics.width;
    }
    __getInitLoate() {
        const x = this.__getXaxis();
        const y = this.__getYaxis();
        return { x, y };
    }
    __getXaxis() {
        const { fixed, from } = this.config;
        if (fixed) {
            return (this.width - this.textWidth) / 2;
        }
        else if (from === "left") {
            return this.rangeX[0];
        }
        else {
            return this.rangeX[1];
        }
    }
    __getYaxis() {
        const { at } = this.config;
        const padding = 20;
        const rangeY = [padding, this.height - padding];
        if (at === "bottom") {
            rangeY[0] = this.height / 2;
        }
        else if (at === "top") {
            rangeY[1] = this.height / 2;
        }
        return Math.floor(Math.random() * (rangeY[1] - rangeY[0] + 1)) + rangeY[0];
    }
}
class ChatObserver {
    get ChatListElement() {
        var _a, _b;
        return (_b = (_a = this.iframeBody) === null || _a === void 0 ? void 0 : _a.querySelector("#items")) !== null && _b !== void 0 ? _b : null;
    }
    constructor(containerEl, manager) {
        var _a;
        this.manager = manager;
        theLog("ChatObserver Constructor");
        if (containerEl instanceof HTMLIFrameElement) {
            this.containerEl = containerEl;
            this.iframeBody = (_a = containerEl.contentDocument) === null || _a === void 0 ? void 0 : _a.body;
            this.__addObs();
            if (!this.iframeBody) {
                containerEl.onload = () => {
                    var _a;
                    this.iframeBody = (_a = containerEl.contentDocument) === null || _a === void 0 ? void 0 : _a.body;
                    this.__addObs();
                };
            }
        }
        else {
            throw new Error("ChatObserver Error");
        }
    }
    __addObs() {
        if (this.iframeBody && this.iframeBody.children.length > 0) {
            const targetEl = this.ChatListElement;
            if (targetEl && this.stateObs === undefined) {
                theLog("add observer");
                const stateObs = new MutationObserver((entire) => {
                    entire.forEach((record) => {
                        record.addedNodes.forEach((node) => {
                            this.decodeElement(node)
                                .then(() => { })
                                .catch(() => { });
                        });
                    });
                });
                stateObs.observe(targetEl, { childList: true });
            }
        }
    }
    async decodeElement(el) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            const authorEl = el.querySelector("#author-name");
            const isMember = Array.from((_a = authorEl === null || authorEl === void 0 ? void 0 : authorEl.classList) !== null && _a !== void 0 ? _a : []).includes("member");
            const userName = authorEl === null || authorEl === void 0 ? void 0 : authorEl.textContent;
            const message = (_b = el.querySelector("#message")) === null || _b === void 0 ? void 0 : _b.textContent;
            if (userName && message) {
                this.manager.addDanmu(message, userName, isMember ? { color: "red", size: 36, fixed: true } : {});
                resolve();
            }
            else {
                reject();
            }
        });
    }
    __removeObs() {
        var _a;
        (_a = this.stateObs) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.stateObs = undefined;
        theLog("remove observer");
    }
    onDestroy() {
        this.__removeObs();
        theLog("ChatObserver onDestroy");
    }
}
class InsertKit {
    constructor() {
        this.rootElement = document.createElement("div");
        this.switchElement = document.createElement("label");
        this.fontSizeElement = document.createElement("div");
        this.__setRootElement();
        this.__setSwitchElement();
        this.rootElement.append(this.switchElement, this.fontSizeElement);
    }
    onInsert() {
        theLog("onInsert");
        getElement("#below.style-scope.ytd-watch-flexy")
            .then((ref) => {
            if (ref.parentElement) {
                ref.parentElement.insertBefore(this.rootElement, ref);
            }
        })
            .catch((e) => {
            theLog("找不到主畫面");
        });
    }
    onDesroy() {
        this.rootElement.remove();
    }
    __setRootElement() {
        this.rootElement.style.display = "flex";
        this.rootElement.style.flexDirection = "row";
        this.rootElement.style.alignItems = "center";
        this.rootElement.style.justifyContent = "center";
        this.rootElement.style.padding = "4px 16px";
        this.rootElement.style.margin = "8px";
        this.rootElement.style.borderRadius = "8px";
        this.rootElement.style.backgroundColor = "rgba(30,30,30, 0.5)";
        this.rootElement.style.width = "max-content";
    }
    __setSwitchElement() {
        this.switchElement.id = "tp-switch-btn";
        this.switchElement.style.color = "var(--yt-live-chat-primary-text-color)";
        const inputEl = document.createElement("input");
        inputEl.type = "checkbox";
        inputEl.name = "toggle";
        inputEl.hidden = true;
        inputEl.disabled = true;
        inputEl.classList.add("Toggle__input");
        const spanEl = document.createElement("span");
        spanEl.style.marginLeft = "8px";
        spanEl.classList.add("Toggle__display");
        spanEl.innerHTML = `<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="Toggle__icon Toggle__icon--checkmark">
<path d="M6.08471 10.6237L2.29164 6.83059L1 8.11313L6.08471 13.1978L17 2.28255L15.7175 1L6.08471 10.6237Z" fill="currentcolor" stroke="currentcolor"></path>
</svg>
<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="Toggle__icon Toggle__icon--cross">
<path d="M11.167 0L6.5 4.667L1.833 0L0 1.833L4.667 6.5L0 11.167L1.833 13L6.5 8.333L11.167 13L13 11.167L8.333 6.5L13 1.833L11.167 0Z" fill="currentcolor"></path>
</svg>`;
        inputEl.onclick = () => {
            document.dispatchEvent(new CustomEvent(danmuManualCtrl, {
                detail: !inputEl.checked,
            }));
        };
        document.addEventListener(danmuState, (event) => {
            const { detail } = event;
            switch (detail) {
                case SceneInitState.服務初始化:
                    inputEl.disabled = true;
                    break;
                case SceneInitState.服務已啟動:
                    inputEl.disabled = false;
                    inputEl.checked = true;
                    break;
                case SceneInitState.服務已結束:
                    inputEl.disabled = false;
                    inputEl.checked = false;
                    break;
                default:
                    break;
            }
        });
        this.switchElement.append("彈幕開關", inputEl, spanEl);
    }
}
class Scene {
    get state() {
        return this.__state;
    }
    set state(v) {
        if (this.__state !== v) {
            this.__state = v;
            document.dispatchEvent(new CustomEvent(danmuState, {
                detail: v,
            }));
        }
    }
    constructor() {
        theLog("Scene Constructor");
        this.prevUrl = "";
        this.destroy = () => { };
        this.__state = SceneInitState.服務已結束;
        document.addEventListener(danmuManualCtrl, (event) => {
            const { detail } = event;
            if (detail) {
                this.onManualClose();
            }
            else {
                this.onManualOpen();
            }
        });
    }
    changeScene(url) {
        var _a;
        theLog("changeScene");
        if (this.prevUrl !== url) {
            this.prevUrl = url;
            const isVideo = Scene.videoRegExp.test(url);
            if (isVideo) {
                switch (this.state) {
                    case SceneInitState.服務已結束: {
                        theLog("啟動服務");
                        this.__onInit();
                        break;
                    }
                    case SceneInitState.服務初始化:
                        theLog("啟動中.....");
                        break;
                    case SceneInitState.服務已啟動:
                        theLog("關閉服務並重新啟動");
                        this.__onDesroy().then(() => {
                            this.__onInit();
                        });
                        break;
                }
            }
            else {
                (_a = this.controller) === null || _a === void 0 ? void 0 : _a.abort();
                this.__onDesroy();
            }
        }
    }
    onManualOpen() {
        theLog("手動開啟服務");
        this.__onDesroy().then(() => {
            this.__onInit();
        });
    }
    onManualClose() {
        theLog("手動關閉服務");
        this.__onDesroy();
    }
    async __onInit() {
        try {
            this.state = SceneInitState.服務初始化;
            this.controller = new AbortController();
            const signal = this.controller.signal;
            const [video, container] = await Promise.all([
                getElement(".video-stream.html5-main-video", { signal }),
                getElement("#chat-container #chatframe", { signal }),
            ]);
            theLog({ video, container });
            const manager = new DanMuManager(video);
            const obs = new ChatObserver(container, manager);
            this.controller = undefined;
            this.state = SceneInitState.服務已啟動;
            this.destroy = () => {
                manager.onDestroy();
                obs.onDestroy();
            };
        }
        catch (e) {
            theLog("Error occur", e);
            this.state = SceneInitState.服務已結束;
            this.destroy = () => { };
        }
    }
    async __onDesroy() {
        return new Promise((resolve) => {
            this.destroy();
            this.state = SceneInitState.服務已結束;
            setTimeout(resolve, 200);
        });
    }
}
Scene.videoRegExp = new RegExp(/^https:\/\/www.youtube.com\/watch\?v=(\S+)/);
(function () {
    "use strict";
    theLog("Loaded Script");
    // @ts-ignore
    GM_addStyle(`.Toggle__display {
  --offset: 0.25em;
  --diameter: 1.8em;
  
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  width: calc(var(--diameter) * 2 + var(--offset) * 2);
  height: calc(var(--diameter) + var(--offset) * 2);
  position: relative;
  border-radius: 100vw;
  background-color: #fbe4e2;
  transition: 250ms;
  margin-right: 1ch;
}

.Toggle__display::before {
  content: '';
  z-index: 2;
  position: absolute;
  top: 50%;
  left: var(--offset);
  width: var(--diameter);
  height: var(--diameter);
  border-radius: 50%;
  background-color: white;
  transform: translate(0, -50%);
  will-change: transform;
  transition: inherit;
}

.Toggle__input:focus + .Toggle__display {
  outline: 1px dotted #212121;
  outline: 1px auto -webkit-focus-ring-color;
  outline-offset: 2px;
}

.Toggle__input:focus:not(:focus-visible) + .Toggle__display {
  outline: 0;
}

.Toggle__input:checked + .Toggle__display {
  background-color: #e3f5eb;
}

.Toggle__input:checked + .Toggle__display::before {
  transform: translate(100%, -50%);
}

.Toggle__input:disabled + .Toggle__display {
  opacity: 0.6;
  filter: grayscale(40%);
  cursor: not-allowed;
}

.Toggle__icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  fill: currentcolor;
  vertical-align: middle;
  overflow: hidden;
}

.Toggle__icon--cross {
  color: #e74c3c;
  font-size: 85%;
}

.Toggle__icon--checkmark {
  color: #1fb978;
}`);
    const scene = new Scene();
    const kit = new InsertKit();
    const changeScene = debounceWrapper(scene.changeScene.bind(scene));
    const insertElement = debounceWrapper(kit.onInsert.bind(kit));
    const observer = new MutationObserver(() => {
        changeScene(window.location.href);
        insertElement();
    });
    const titleElement = document.querySelector("title");
    if (titleElement) {
        observer.observe(titleElement, { childList: true });
    }
})();
