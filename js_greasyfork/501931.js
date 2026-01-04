// ==UserScript==
// @name         斗鱼PK条切换显示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通过按钮来切换显示斗鱼的PK条
// @author       Oreki
// @license      MIT
// @match        *://*.douyu.com/0*
// @match        *://*.douyu.com/1*
// @match        *://*.douyu.com/2*
// @match        *://*.douyu.com/3*
// @match        *://*.douyu.com/4*
// @match   	 *://*.douyu.com/5*
// @match        *://*.douyu.com/6*
// @match        *://*.douyu.com/7*
// @match        *://*.douyu.com/8*
// @match        *://*.douyu.com/9*
// @match        *://*.douyu.com/topic/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501931/%E6%96%97%E9%B1%BCPK%E6%9D%A1%E5%88%87%E6%8D%A2%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/501931/%E6%96%97%E9%B1%BCPK%E6%9D%A1%E5%88%87%E6%8D%A2%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
(function () {
    'use strict';
    var _PlayerVideo_instances, _PlayerVideo_el, _PlayerVideo_subscribers, _PlayerVideo_init, _PlayerVideo_setListenner, _Button_instances, _Button_el, _Button_isActive, _Button_isShow, _Button_init, _Button_createEl, _Button_setBaseClasses, _Button_changeActiveClasses, _Button_changeStatusContent, _Button_toggleStatus, _Button_changeStatus, _Style_instances, _Style_init, _Style_creatEl, _Style_setId;
    const TOGGLEPK_SHORTCUT_KEY = 'X';
    function DouyuTogglePK() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomPlayer, button, style, pk } = init();
            console.log(button, style);
            // 向页面注入style样式表
            style.inject();
            // 注册按钮的点击
            button.onClick((btnIsActive) => {
                console.log("-- PK Toggled --");
                togglePk(btnIsActive, pk);
            });
            // 注册播放器的快捷键事件
            roomPlayer.on("keyup", (e) => {
                console.log(`-- video keyup event ${e.code} --`);
                if (e.code === `Key${TOGGLEPK_SHORTCUT_KEY}` && pk.status) {
                    button.click();
                }
            });
            // 监听页面中PK条的出现与消失
            setPkObserver(button, pk);
            // 等待斗鱼直播间加载完毕后再将按钮载入界面
            yield douyuRoomLoaded();
            button.insert(document.querySelector('.PlayerToolbar-Wealth'), 0);
        });
    }
    function togglePk(btnIsActive, pk) {
        // 按下状态 隐藏PK条
        if (btnIsActive)
            pk.hide();
        else
            pk.show();
    }
    function setPkObserver(button, pk) {
        // 单独PK条监听
        const PkViewObserver = new MutationObserver(pkViewObserverCallback);
        PkViewObserver.observe(document.querySelector('#js-player-video-case'), { childList: true, attributes: false });
        // 多人PK条监听
        const MorePkObserver = new MutationObserver(morePkObsedrverCallback);
        MorePkObserver.observe(document.querySelector('#js-player-video-above'), { childList: true, attributes: false });
        // 单独PK条监听 回调函数
        function pkViewObserverCallback(mutationList) {
            mutationList.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((addedNode) => {
                        if (addedNode && addedNode instanceof Element && addedNode.classList[0] === 'PkView') {
                            pk.setPkEl(0);
                            button.resetStatus();
                            button.show();
                        }
                    });
                    mutation.removedNodes.forEach((removedNode) => {
                        if (removedNode && removedNode instanceof Element && removedNode.classList[0] === 'PkView') {
                            pk.removePkEl();
                            button.hide();
                            button.resetStatus();
                        }
                    });
                }
            });
        }
        // 多人PK条监听 回调函数
        function morePkObsedrverCallback(mutationList) {
            mutationList.forEach((mutation) => {
                // DOM变动类型为DOM节点变动
                if (mutation.type === 'childList') {
                    // 遍历增加的节点
                    // 如果出现PK条则出现按钮
                    mutation.addedNodes.forEach((addedNode) => {
                        // 多人PK条
                        if (addedNode.firstChild && addedNode.firstChild instanceof Element
                            && addedNode.firstChild.classList[0] === 'MorePk') {
                            pk.setPkEl(1);
                            button.resetStatus();
                            button.show();
                        }
                    });
                    // 遍历减少的节点
                    mutation.removedNodes.forEach((removedNode) => {
                        // 多人PK条
                        // if (removedNode.firstChild && removedNode.firstChild instanceof Element
                        // && removedNode.firstChild.classList[0] === 'MorePk')
                        pk.removePkEl();
                        button.hide();
                        button.resetStatus();
                    });
                }
            });
        }
    }
    function douyuRoomLoaded() {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                const dom1 = document.querySelector(".BackpackButton");
                const dom2 = document.querySelector(".Barrage-main");
                if (!dom1 || !dom2) {
                    return;
                }
                const timer1 = setTimeout(() => {
                    resolve();
                    clearTimeout(timer1);
                }, 1500);
                clearInterval(timer);
            }, 2000);
        });
    }
    function init() {
        const roomPlayer = new PlayerVideo();
        const button = initButton();
        const style = initStyle();
        const pk = initPk();
        return {
            roomPlayer,
            button,
            style,
            pk,
        };
    }
    function initButton() {
        const bData = {
            baseClasses: ['button-douyu-toggle-pk'],
            activeClasses: ['button-active-douyu-toggle-pk']
        };
        const b = new Button();
        b.setStatusContent({
            falseContent: '隐藏PK条',
            trueContent: '显示PK条',
        });
        b.setClasses({
            baseClasses: bData.baseClasses,
            activeClasses: bData.activeClasses,
        });
        b.setTitle("快捷键:X, 需要焦点在播放器上");
        return b;
    }
    function initStyle() {
        const s = new Style('styleDouyuTogglePk');
        const styleContnet = `
      button.button-douyu-toggle-pk {display: none; padding: 1px 12px; margin-right: 12px; border: none;border-radius: .5rem;
        background-color: #ff5d2338;color: #ff5d23;box-shadow: 2px 2px 2px #ff5d23;transition: all .3s ease; outline: none;}
      button.button-active-douyu-toggle-pk {box-shadow: inset 2px 2px 2px #ff5d23}
      button.button-douyu-toggle-pk:hover {background-color: #ff5d23aa;color:rgba(255,255,255,.85);cursor: pointer;}
    `;
        s.setContent(styleContnet);
        return s;
    }
    function initPk() {
        const p = new PK();
        const pkType = [
            { class: '.PkView' },
            { class: '.MorePk' },
        ];
        p.setPkType(pkType);
        return p;
    }
    class PlayerVideo {
        constructor() {
            _PlayerVideo_instances.add(this);
            _PlayerVideo_el.set(this, null);
            _PlayerVideo_subscribers.set(this, {
                click: [],
                keypress: [],
                keyup: [],
                keydown: [],
            });
            __classPrivateFieldGet(this, _PlayerVideo_instances, "m", _PlayerVideo_init).call(this);
            __classPrivateFieldGet(this, _PlayerVideo_instances, "m", _PlayerVideo_setListenner).call(this);
        }
        on(event, callback) {
            __classPrivateFieldGet(this, _PlayerVideo_subscribers, "f")[event].push(callback);
        }
    }
    _PlayerVideo_el = new WeakMap(), _PlayerVideo_subscribers = new WeakMap(), _PlayerVideo_instances = new WeakSet(), _PlayerVideo_init = function _PlayerVideo_init() {
        __classPrivateFieldSet(this, _PlayerVideo_el, document.querySelector("#js-player-video"), "f");
    }, _PlayerVideo_setListenner = function _PlayerVideo_setListenner() {
        const events = ["click", "keypress", "keyup", "keydown"];
        events.forEach((event) => {
            var _a;
            (_a = __classPrivateFieldGet(this, _PlayerVideo_el, "f")) === null || _a === void 0 ? void 0 : _a.addEventListener(event, (e) => {
                __classPrivateFieldGet(this, _PlayerVideo_subscribers, "f")[event].forEach((callback) => {
                    callback(e);
                });
            });
        });
    };
    class Button {
        constructor() {
            _Button_instances.add(this);
            _Button_el.set(this, null);
            _Button_isActive.set(this, false);
            _Button_isShow.set(this, false);
            this.statusContent = {
                trueContent: 'on',
                falseContent: 'off',
            };
            this.classes = null;
            __classPrivateFieldGet(this, _Button_instances, "m", _Button_init).call(this);
        }
        // 设置button的基础classes和active classes
        setClasses(classes) {
            this.classes = classes;
            __classPrivateFieldGet(this, _Button_instances, "m", _Button_setBaseClasses).call(this);
        }
        // 设置button的状态content
        setStatusContent(statusContent) {
            this.statusContent = statusContent;
            __classPrivateFieldGet(this, _Button_instances, "m", _Button_changeStatusContent).call(this);
        }
        setTitle(title) {
            __classPrivateFieldGet(this, _Button_el, "f").title = title;
        }
        // 主动触发click
        click() {
            var _a;
            (_a = __classPrivateFieldGet(this, _Button_el, "f")) === null || _a === void 0 ? void 0 : _a.click();
        }
        onClick(callback) {
            var _a;
            (_a = __classPrivateFieldGet(this, _Button_el, "f")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
                __classPrivateFieldGet(this, _Button_instances, "m", _Button_toggleStatus).call(this);
                __classPrivateFieldGet(this, _Button_instances, "m", _Button_changeStatusContent).call(this);
                __classPrivateFieldGet(this, _Button_instances, "m", _Button_changeActiveClasses).call(this);
                callback(__classPrivateFieldGet(this, _Button_isActive, "f"));
            });
        }
        appendToBody() {
            document.body.appendChild(__classPrivateFieldGet(this, _Button_el, "f"));
        }
        insert(parentNode, index) {
            parentNode.insertBefore(__classPrivateFieldGet(this, _Button_el, "f"), parentNode.childNodes[index]);
        }
        hide() {
            if (!__classPrivateFieldGet(this, _Button_isShow, "f"))
                return;
            __classPrivateFieldSet(this, _Button_isShow, false, "f");
            __classPrivateFieldGet(this, _Button_el, "f").style.display = 'none';
        }
        show() {
            if (__classPrivateFieldGet(this, _Button_isShow, "f"))
                return;
            __classPrivateFieldSet(this, _Button_isShow, true, "f");
            __classPrivateFieldGet(this, _Button_el, "f").style.display = 'inline-block';
        }
        resetStatus() {
            __classPrivateFieldGet(this, _Button_instances, "m", _Button_changeStatus).call(this, false);
            __classPrivateFieldGet(this, _Button_instances, "m", _Button_changeStatusContent).call(this);
            __classPrivateFieldGet(this, _Button_instances, "m", _Button_changeActiveClasses).call(this);
        }
    }
    _Button_el = new WeakMap(), _Button_isActive = new WeakMap(), _Button_isShow = new WeakMap(), _Button_instances = new WeakSet(), _Button_init = function _Button_init() {
        __classPrivateFieldGet(this, _Button_instances, "m", _Button_createEl).call(this);
    }, _Button_createEl = function _Button_createEl() {
        __classPrivateFieldSet(this, _Button_el, document.createElement('button'), "f");
    }, _Button_setBaseClasses = function _Button_setBaseClasses() {
        var _a;
        (_a = __classPrivateFieldGet(this, _Button_el, "f")) === null || _a === void 0 ? void 0 : _a.classList.add(...this.classes.baseClasses);
    }, _Button_changeActiveClasses = function _Button_changeActiveClasses() {
        var _a, _b;
        if (__classPrivateFieldGet(this, _Button_isActive, "f")) {
            (_a = __classPrivateFieldGet(this, _Button_el, "f")) === null || _a === void 0 ? void 0 : _a.classList.add(...this.classes.activeClasses);
        }
        else {
            (_b = __classPrivateFieldGet(this, _Button_el, "f")) === null || _b === void 0 ? void 0 : _b.classList.remove(...this.classes.activeClasses);
        }
    }, _Button_changeStatusContent = function _Button_changeStatusContent() {
        __classPrivateFieldGet(this, _Button_el, "f").textContent = __classPrivateFieldGet(this, _Button_isActive, "f") ? this.statusContent.trueContent : this.statusContent.falseContent;
    }, _Button_toggleStatus = function _Button_toggleStatus() {
        __classPrivateFieldSet(this, _Button_isActive, !__classPrivateFieldGet(this, _Button_isActive, "f"), "f");
    }, _Button_changeStatus = function _Button_changeStatus(status) {
        __classPrivateFieldSet(this, _Button_isActive, status, "f");
    };
    class Style {
        constructor(id) {
            _Style_instances.add(this);
            this.el = null;
            __classPrivateFieldGet(this, _Style_instances, "m", _Style_init).call(this, id);
        }
        setContent(content) {
            this.el.textContent = content;
        }
        inject() {
            document.body.appendChild(this.el);
        }
    }
    _Style_instances = new WeakSet(), _Style_init = function _Style_init(id) {
        __classPrivateFieldGet(this, _Style_instances, "m", _Style_creatEl).call(this);
        __classPrivateFieldGet(this, _Style_instances, "m", _Style_setId).call(this, id);
    }, _Style_creatEl = function _Style_creatEl() {
        this.el = document.createElement('style');
    }, _Style_setId = function _Style_setId(id) {
        this.el.id = id;
    };
    class PK {
        constructor() {
            this.el = null;
            this.type = null;
            this.status = false;
        }
        setPkType(pkType) {
            this.type = pkType;
        }
        setPkEl(type) {
            if (!this.type)
                throw new Error();
            switch (type) {
                case 0:
                    this.el = document.querySelector(this.type[0].class);
                    break;
                case 1:
                    this.el = document.querySelector(this.type[1].class);
                    break;
            }
            this.status = true;
        }
        removePkEl() {
            this.el = null;
            this.status = false;
        }
        hide() {
            if (this.el)
                this.el.style.display = 'none';
        }
        show() {
            if (this.el)
                this.el.style.display = 'block';
        }
    }
    DouyuTogglePK();
})();
