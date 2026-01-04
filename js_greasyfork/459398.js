// ==UserScript==
// @name VK IM reposts filter
// @version 1.0.0
// @namespace http://tampermonkey.net/
// @description Searches for reposts or just a picture messages in VK Messenger. Just open a chat and click "Find reposts"!
// @homepage https://github.com/pboymt/userscript-typescript-template#readme
// @match https://vk.com/*
// @require https://cdn.jsdelivr.net/npm/axios@0.27.2
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459398/VK%20IM%20reposts%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/459398/VK%20IM%20reposts%20filter.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.App = void 0;
const route_guard_1 = __webpack_require__(2);
const element_existence_guard_1 = __webpack_require__(3);
const routes_1 = __webpack_require__(6);
const element_find_1 = __webpack_require__(7);
const element_collection_1 = __webpack_require__(8);
const app_facade_1 = __webpack_require__(9);
const logger_1 = __webpack_require__(4);
class App {
    constructor() {
        logger_1.Logger.log("Скрипт инициализирован!");
        this.initializeFeatures();
    }
    renderElements() {
        logger_1.Logger.log("addButtons запущен!");
        (0, app_facade_1.addButtons)();
    }
    initializeFeatures() {
        (0, app_facade_1.loadStyles)();
    }
}
__decorate([
    (0, route_guard_1.routeGuardIncludes)(routes_1.Routes.IMSelected),
    (0, element_existence_guard_1.elementShouldNotExistGuard)(element_find_1.GetElementCollection.get(element_collection_1.ElementCollection.IMDialogToolBarMoreActionsPanelRepostsFilterButton).selector),
    (0, element_existence_guard_1.elementShouldExistGuard)((_a = element_find_1.GetElementCollection.get(element_collection_1.ElementCollection.IMDialogToolBarMoreActionsPanel)) === null || _a === void 0 ? void 0 : _a.selector)
], App.prototype, "renderElements", null);
exports.App = App;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.routeGuardIncludes = exports.routeGuardExact = void 0;
const routeGuardExact = (route) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const url = new URL(location.href);
        if (url.pathname + url.hash === route || url.href === route) {
            originalMethod.apply(this, args);
        }
        else {
            return;
        }
    };
    return descriptor;
};
exports.routeGuardExact = routeGuardExact;
const routeGuardIncludes = (route) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const url = new URL(location.href);
        if (url.toString().includes(route)) {
            originalMethod.apply(this, args);
        }
        else {
            return;
        }
    };
    return descriptor;
};
exports.routeGuardIncludes = routeGuardIncludes;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementShouldExistGuard = exports.elementShouldNotExistGuard = void 0;
const logger_1 = __webpack_require__(4);
const elementShouldNotExistGuard = (selector) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        if (selector) {
            const url = new URL(location.href);
            if (document.querySelector(selector) === null) {
                logger_1.Logger.log("Проверка отсутствия элемента... Элемента нет... ОК");
                originalMethod.apply(this, args);
            }
            else {
                logger_1.Logger.log("Проверка отсутствия элемента... Элемент есть... Плохо");
                return;
            }
        }
        ;
        return;
    };
    return descriptor;
};
exports.elementShouldNotExistGuard = elementShouldNotExistGuard;
const elementShouldExistGuard = (selector) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        if (selector) {
            if (document.querySelector(selector) !== null) {
                logger_1.Logger.log("Проверка наличия элемента... Элемент есть... ОК");
                originalMethod.apply(this, args);
            }
            else {
                logger_1.Logger.log("Проверка наличия элемента... Элемента нет. Плохо");
                return;
            }
        }
        return;
    };
    return descriptor;
};
exports.elementShouldExistGuard = elementShouldExistGuard;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const only_env_guard_1 = __webpack_require__(5);
class Logger {
    static log(message, level = "log") {
        switch (level) {
            case "log":
                console.log(message);
                break;
            case "info":
                console.info(message);
                break;
            case "warn":
                console.warn(message);
                break;
            default:
                console.log(message);
                break;
        }
    }
    static error(message) {
        console.error(message);
    }
}
__decorate([
    (0, only_env_guard_1.EnvGuard)("development")
], Logger, "log", null);
exports.Logger = Logger;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnvGuard = void 0;
const EnvGuard = (env) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const url = new URL(location.href);
        if (env === {"ENV":"production"}.ENV) {
            originalMethod.apply(this, args);
        }
        else {
            return;
        }
    };
    return descriptor;
};
exports.EnvGuard = EnvGuard;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Routes = void 0;
var Routes;
(function (Routes) {
    Routes["IM"] = "/im";
    Routes["IMSelected"] = "im?sel=";
})(Routes = exports.Routes || (exports.Routes = {}));


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetElementCollection = exports.ElementFind = void 0;
const element_collection_1 = __webpack_require__(8);
class ElementFind {
    constructor(contextElement = document) {
        this.contextElement = contextElement;
    }
    getElementByQuerySingle(query) {
        return this._queryGet(query);
    }
    getElementByQueryMultiple(query) {
        return this._queryGetMultiple(query);
    }
    getElementByElementIdSingle(query) {
        return this._getByElementCollection(GetElementCollection.get(query));
    }
    _queryGetMultiple(query) {
        return Array.from(this.contextElement.querySelectorAll(query));
    }
    _queryGet(query) {
        return this.contextElement.querySelector(query);
    }
    _getByElementCollection(query) {
        var _a, _b, _c;
        if (query.id !== element_collection_1.ElementCollection.Root) {
            const elem = (_c = (_b = (_a = this.contextElement.querySelector(".viewport__content-section .modal-body .panel-group")) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode) === null || _c === void 0 ? void 0 : _c.querySelector(".control-label");
            if (elem) {
                return elem;
            }
        }
        return this.contextElement.querySelector(query.selector);
    }
    _getElementMultiple(query) {
        return Array.from(this.contextElement.querySelectorAll(query.selector));
    }
}
exports.ElementFind = ElementFind;
class GetElementCollection {
    static get(id) {
        return element_collection_1.elementCollectionList.find((element) => element.id === id);
    }
}
exports.GetElementCollection = GetElementCollection;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementCollectionList = exports.ElementCollection = void 0;
var ElementCollection;
(function (ElementCollection) {
    ElementCollection[ElementCollection["Root"] = 0] = "Root";
    ElementCollection[ElementCollection["LeftColumnAlbums"] = 1] = "LeftColumnAlbums";
    ElementCollection[ElementCollection["IM"] = 2] = "IM";
    ElementCollection[ElementCollection["IMDialog"] = 3] = "IMDialog";
    ElementCollection[ElementCollection["IMDialogList"] = 4] = "IMDialogList";
    ElementCollection[ElementCollection["IMDialogHeader"] = 5] = "IMDialogHeader";
    ElementCollection[ElementCollection["IMDialogHeaderTitle"] = 6] = "IMDialogHeaderTitle";
    ElementCollection[ElementCollection["IMDialogContainer"] = 7] = "IMDialogContainer";
    ElementCollection[ElementCollection["IMDialogChatHeaderIn"] = 8] = "IMDialogChatHeaderIn";
    ElementCollection[ElementCollection["IMDialogToolBar"] = 9] = "IMDialogToolBar";
    ElementCollection[ElementCollection["IMDialogToolBarPinnedMessages"] = 10] = "IMDialogToolBarPinnedMessages";
    ElementCollection[ElementCollection["IMDialogToolBarMoreActionsPanel"] = 11] = "IMDialogToolBarMoreActionsPanel";
    ElementCollection[ElementCollection["IMDialogToolBarMoreActionsPanelSearchButton"] = 12] = "IMDialogToolBarMoreActionsPanelSearchButton";
    ElementCollection[ElementCollection["IMDialogToolBarMoreActionsPanelSecondButton"] = 13] = "IMDialogToolBarMoreActionsPanelSecondButton";
    ElementCollection[ElementCollection["IMDialogBody"] = 14] = "IMDialogBody";
    ElementCollection[ElementCollection["IMDialogMessageStacks"] = 15] = "IMDialogMessageStacks";
    ElementCollection[ElementCollection["IMDialogMessages"] = 16] = "IMDialogMessages";
    ElementCollection[ElementCollection["IMDialogMessagesOnlyPictures"] = 17] = "IMDialogMessagesOnlyPictures";
    ElementCollection[ElementCollection["IMDialogMessagesOnlyPicturesContent"] = 18] = "IMDialogMessagesOnlyPicturesContent";
    ElementCollection[ElementCollection["IMDialogScrollableContainer"] = 19] = "IMDialogScrollableContainer";
    ElementCollection[ElementCollection["IMDialogContainerFilterPanel"] = 20] = "IMDialogContainerFilterPanel";
    ElementCollection[ElementCollection["IMDialogContainerFilterPanelContainer"] = 21] = "IMDialogContainerFilterPanelContainer";
    ElementCollection[ElementCollection["IMDialogContainerFilterPanelContainerCounter"] = 22] = "IMDialogContainerFilterPanelContainerCounter";
    ElementCollection[ElementCollection["IMDialogToolBarMoreActionsPanelRepostsFilterButton"] = 23] = "IMDialogToolBarMoreActionsPanelRepostsFilterButton";
})(ElementCollection = exports.ElementCollection || (exports.ElementCollection = {}));
exports.elementCollectionList = [
    {
        id: ElementCollection.Root,
        selector: "#content",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.LeftColumnAlbums,
        selector: "#l_ph > a[href]",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IM,
        selector: "#content > div > div",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogList,
        selector: "#content > div > div > .im-page--dialogs._im_page_dialogs.page_block",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogHeader,
        selector: "#content > div > div > .im-page--history > .im-page-history-w > .im-page--chat-header._im_dialog_actions > div > .im-page--toolsw > .im-page--title-wrapper",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogHeaderTitle,
        selector: "#content > div > div > .im-page--history > .im-page-history-w > .im-page--chat-header._im_dialog_actions > div > .im-page--toolsw > .im-page--title-wrapper > div > span.im-page--title-main > span",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogContainer,
        selector: "#content > div > div > .im-page--history > .im-page-history-w",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogChatHeaderIn,
        selector: "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w .im-page--chat-header-in",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogToolBar,
        selector: "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w .im-page--toolsw",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogToolBarPinnedMessages,
        selector: "#content > div > div > .im-page--history > .im-page-history-w > .im-page--chat-header > .im-page--chat-header-in > .im-page--pinned",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogToolBarMoreActionsPanel,
        selector: "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w .im-page--toolsw .im-page--header-more .ui_actions_menu",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogToolBarMoreActionsPanelSearchButton,
        selector: "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w .im-page--toolsw .im-page--header-more .ui_actions_menu > .ui_actions_menu_item:first-child",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogToolBarMoreActionsPanelSecondButton,
        selector: "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w .im-page--toolsw .im-page--header-more .ui_actions_menu > .ui_actions_menu_item:nth-child(2)",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogContainerFilterPanel,
        selector: "#vk-im-resposts-filter-panel",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogContainerFilterPanelContainer,
        selector: "#vk-im-resposts-filter-panel > .vk-im-resposts-filter-panel-container",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogContainerFilterPanelContainerCounter,
        selector: "#vk-im-resposts-counter",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogToolBarMoreActionsPanelRepostsFilterButton,
        selector: "#content > div > div > div.im-page--history.page_block._im_page_history > div.im-page-history-w .im-page--toolsw .im-page--header-more .ui_actions_menu #vk-im-resposts-filter-add-button-threedots",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogBody,
        selector: "#content > div > div > .im-page--history > .im-page-history-w > .im-page--chat-body",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.IMDialogMessageStacks,
        selector: "#content > div > div > .im-page--history > .im-page-history-w > .im-page--chat-body .im-mess-stack",
        preferredMode: "selectMultiple"
    },
    {
        id: ElementCollection.IMDialogMessages,
        selector: "#content > div > div > .im-page--history > .im-page-history-w > .im-page--chat-body .im-mess-stack .im-mess",
        preferredMode: "selectMultiple"
    },
    {
        id: ElementCollection.IMDialogScrollableContainer,
        selector: "#content > div > div > .im-page--history > .im-page-history-w > .im-page--chat-body .ui_scroll_overflow > .ui_scroll_outer",
        preferredMode: "selectMultiple"
    },
    {
        id: ElementCollection.IMDialogMessagesOnlyPictures,
        selector: ".im-mess:has(.page_post_sized_thumbs):not(:has(.post,.im-replied,.im_msg_media_link,.im-videomessage))",
        preferredMode: "selectMultiple"
    },
    {
        id: ElementCollection.IMDialogMessagesOnlyPicturesContent,
        selector: ".im-mess .im-mess--text:has(.page_post_sized_thumbs):not(:has(.post,.im-replied,.im_msg_media_link,.im-videomessage))",
        preferredMode: "selectMultiple"
    },
];


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadStyles = exports.addButtons = void 0;
const button_model_1 = __webpack_require__(10);
const element_find_1 = __webpack_require__(7);
const render_fabric_1 = __webpack_require__(11);
const element_collection_1 = __webpack_require__(8);
const three_dots_button_control_1 = __webpack_require__(13);
const panel_place_action_1 = __webpack_require__(16);
const styles_injecter_1 = __webpack_require__(28);
function addButtons() {
    addThreeDotsButton();
    function addThreeDotsButton() {
        const addSearchButton = new three_dots_button_control_1.ThreeDotsButtonControl({
            id: "vk-im-resposts-filter-add-button-threedots",
            tag: "a",
            classes: ["ui_actions_menu_item", "im-action", "im-action_search", "_im_action"],
            attributes: { "tabindex": "0", "role": "link" },
            icon: button_model_1.ButtonIcons.none,
            text: "Поиск репостов",
        }, panel_place_action_1.PanelPlaceAction.prototype.run, {}).element;
        const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogToolBarMoreActionsPanel);
        const insertBeforeElem = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogToolBarMoreActionsPanelSecondButton);
        new render_fabric_1.RenderAt().render(addSearchButton, element, insertBeforeElem);
    }
}
exports.addButtons = addButtons;
function loadStyles() {
    new styles_injecter_1.StylesInjecter().injectInit();
}
exports.loadStyles = loadStyles;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonIcons = void 0;
var ButtonIcons;
(function (ButtonIcons) {
    ButtonIcons["none"] = "none";
    ButtonIcons["glyphiconPicture"] = "glyphicon-picture";
})(ButtonIcons = exports.ButtonIcons || (exports.ButtonIcons = {}));


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RenderAt = void 0;
const logger_1 = __webpack_require__(4);
const render_model_1 = __webpack_require__(12);
class RenderAt {
    render(element, place, renderBefore) {
        if (place && element) {
            if (renderBefore) {
                place.insertBefore(element, renderBefore);
            }
            else {
                place.appendChild(element);
            }
            logger_1.Logger.log(`Зарендерил "${(element === null || element === void 0 ? void 0 : element.innerText) || `элемент с тегом "${element === null || element === void 0 ? void 0 : element.tagName}"`}"!`);
            return element;
        }
        else {
            logger_1.Logger.log("Хуёво, нихуя не зарендерил");
            return render_model_1.RenderResult.NOELEMENT;
        }
    }
    remove(elem) {
        var _a;
        if (elem) {
            (_a = elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
            return render_model_1.DeleteResult.SUCCESS;
        }
        else {
            return render_model_1.DeleteResult.NOELEMENT;
        }
    }
}
exports.RenderAt = RenderAt;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteResult = exports.RenderResult = void 0;
var RenderResult;
(function (RenderResult) {
    RenderResult[RenderResult["SUCCESS"] = 0] = "SUCCESS";
    RenderResult[RenderResult["FAIL"] = 1] = "FAIL";
    RenderResult[RenderResult["NOELEMENT"] = 2] = "NOELEMENT";
})(RenderResult = exports.RenderResult || (exports.RenderResult = {}));
var DeleteResult;
(function (DeleteResult) {
    DeleteResult[DeleteResult["SUCCESS"] = 0] = "SUCCESS";
    DeleteResult[DeleteResult["FAIL"] = 1] = "FAIL";
    DeleteResult[DeleteResult["NOELEMENT"] = 2] = "NOELEMENT";
})(DeleteResult = exports.DeleteResult || (exports.DeleteResult = {}));


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThreeDotsButtonControl = void 0;
const button_base_control_1 = __webpack_require__(14);
class ThreeDotsButtonControl extends button_base_control_1.ButtonBaseControl {
    constructor(params, callback, args) {
        super(params, callback, args);
    }
    setInnerHTML() {
        this.element.innerHTML = ``;
    }
}
exports.ThreeDotsButtonControl = ThreeDotsButtonControl;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonBaseControl = void 0;
const control_base_control_1 = __webpack_require__(15);
class ButtonBaseControl extends control_base_control_1.ControlBase {
    constructor(params, callback, args) {
        super(params);
        this.addEventListener(this.element, callback, args);
    }
    addEventListener(button, callback, args) {
        button.addEventListener("click", callback.bind(this, args), false);
    }
    ;
}
exports.ButtonBaseControl = ButtonBaseControl;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ControlBase = void 0;
class ControlBase {
    constructor(params) {
        var _a;
        this.element = this.createElement((_a = params.tag) !== null && _a !== void 0 ? _a : "button");
        if (params.classes)
            this.setClasses(params.classes);
        if (params.text && !params.html)
            this.setInnerText(params.text);
        if (params.html && !params.text)
            this.setInnerHtml(params.html);
        if (params.attributes)
            this.setAttributes(params.attributes);
        if (params.styles)
            this.setStyles(params.styles);
        if (params.id)
            this.setId(params.id);
    }
    createElement(element) {
        return document.createElement(element);
    }
    ;
    setInnerText(text = "Ошибка: текст не был назначен") {
        this.element.innerText = text;
    }
    ;
    setInnerHtml(html = "Ошибка: HTML-разметка не была назначена") {
        this.element.innerHTML = html;
    }
    ;
    setId(id) {
        if (id) {
            this.element.id = id;
        }
    }
    ;
    setClasses(classes) {
        classes.forEach(element => {
            this.element.classList.add(element);
        });
    }
    ;
    setAttributes(attributes) {
        Object.entries(attributes).forEach(([key, value]) => { this.element.setAttribute(key, value); });
    }
    ;
    setStyles(styles) {
        styles === null || styles === void 0 ? void 0 : styles.forEach((style) => {
            if (style.selector) {
                this.element.querySelector(style.selector).style.setProperty(style.key, style.value);
            }
            else {
                this.element.style.setProperty(style.key, style.value);
            }
        });
    }
}
exports.ControlBase = ControlBase;


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PanelPlaceAction = void 0;
const button_model_1 = __webpack_require__(10);
const button_control_1 = __webpack_require__(17);
const panel_control_1 = __webpack_require__(18);
const element_collection_1 = __webpack_require__(8);
const element_find_1 = __webpack_require__(7);
const element_existence_guard_1 = __webpack_require__(3);
const render_fabric_1 = __webpack_require__(11);
const get_messages_action_1 = __webpack_require__(20);
const panel_close_action_1 = __webpack_require__(22);
const panel_set_state_action_1 = __webpack_require__(23);
class PanelPlaceAction {
    run() {
        addPanel();
        addClosebutton();
        panel_set_state_action_1.PanelSetStateAction.prototype.run("search");
        get_messages_action_1.GetMessagesAction.restoreState();
        function addPanel() {
            const addPanel = new panel_control_1.PanelControl({
                id: "vk-im-resposts-filter-panel",
                tag: "div",
                classes: ["im-page--toolsw"],
                styles: [
                    {
                        key: "display",
                        value: "flex"
                    },
                    {
                        key: "flex-direction",
                        value: "row"
                    },
                    {
                        key: "user-select",
                        value: "none"
                    }
                ],
                html: `<div class="vk-im-resposts-filter-panel-container" style="display: flex; width: 100%; justify-content: center; align-items: center;"></div>`
            }).element;
            const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogChatHeaderIn);
            const insertBeforeElem = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogToolBarPinnedMessages);
            new render_fabric_1.RenderAt().render(addPanel, element, insertBeforeElem);
        }
        function addClosebutton() {
            const addClosePanelButton = new button_control_1.ButtonControl({
                id: "vk-im-resposts-filter-close=panel-button",
                tag: "button",
                classes: ["im-page-pinned--hide"],
                icon: button_model_1.ButtonIcons.none,
                text: "",
            }, panel_close_action_1.ClosePanelAction.prototype.run, {}).element;
            const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanel);
            new render_fabric_1.RenderAt().render(addClosePanelButton, element);
        }
    }
}
__decorate([
    (0, element_existence_guard_1.elementShouldNotExistGuard)(element_find_1.GetElementCollection.get(element_collection_1.ElementCollection.IMDialogContainerFilterPanel).selector)
], PanelPlaceAction.prototype, "run", null);
exports.PanelPlaceAction = PanelPlaceAction;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonControl = void 0;
const button_base_control_1 = __webpack_require__(14);
class ButtonControl extends button_base_control_1.ButtonBaseControl {
    constructor(params, callback, args) {
        super(params, callback, args);
    }
}
exports.ButtonControl = ButtonControl;


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PanelControl = void 0;
const panel_base_control_1 = __webpack_require__(19);
class PanelControl extends panel_base_control_1.PanelBaseControl {
    constructor(params) {
        super(params);
    }
}
exports.PanelControl = PanelControl;


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PanelBaseControl = void 0;
const control_base_control_1 = __webpack_require__(15);
class PanelBaseControl extends control_base_control_1.ControlBase {
    constructor(params) {
        super(params);
    }
}
exports.PanelBaseControl = PanelBaseControl;


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetMessagesAction = void 0;
const element_collection_1 = __webpack_require__(8);
const element_find_1 = __webpack_require__(7);
const get_vk_id_util_1 = __webpack_require__(21);
class GetMessagesAction {
    run() {
        GetMessagesAction.findMessages("add");
    }
    static navigateMessages(direction) {
        GetMessagesAction.setMessageCount(GetMessagesAction.messages.length);
        if (GetMessagesAction.messages.length === 0) {
            GetMessagesAction.prototype.run();
        }
        switch (direction) {
            case "down":
                if (GetMessagesAction.currentMessageIndex === undefined) {
                    GetMessagesAction.currentMessageIndex = 0;
                    scrollToElem();
                }
                else {
                    if (GetMessagesAction.currentMessageIndex < GetMessagesAction.messages.length - 1) {
                        GetMessagesAction.currentMessageIndex++;
                        scrollToElem();
                    }
                    else if (GetMessagesAction.currentMessageIndex === GetMessagesAction.messages.length - 1) {
                        GetMessagesAction.currentMessageIndex = 0;
                        scrollToElem();
                    }
                    ;
                }
                break;
            case "up":
                if (GetMessagesAction.currentMessageIndex === undefined) {
                    GetMessagesAction.currentMessageIndex = GetMessagesAction.messages.length - 1;
                    scrollToElem();
                }
                else {
                    if (GetMessagesAction.currentMessageIndex > 0) {
                        GetMessagesAction.currentMessageIndex--;
                        scrollToElem();
                    }
                }
                break;
            default:
                break;
        }
        function scrollToElem() {
            const element = GetMessagesAction.messages[GetMessagesAction.currentMessageIndex];
            if (element.isConnected) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            else {
                GetMessagesAction.resetState();
            }
            ;
        }
        if (GetMessagesAction.currentMessageIndex < 3) {
            GetMessagesAction.prototype.run();
            if (GetMessagesAction.currentMessageIndex === 0 && GetMessagesAction.messagesDelta === 0) {
                new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogScrollableContainer).scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
        }
    }
    static setMessageCount(count) {
        const counterElement = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanelContainerCounter);
        if (count === 0) {
            counterElement.innerText = `Репостов не найдено`;
        }
        else {
            counterElement.innerText = `Количество репостов: ${count}`;
        }
    }
    static resetState(keepMessageSearch) {
        if (!keepMessageSearch) {
            GetMessagesAction.messages = [];
            GetMessagesAction.currentMessageIndex = undefined;
            GetMessagesAction.messagesDelta = undefined;
            GetMessagesAction.setMessageCount(0);
        }
        else {
            GetMessagesAction.unmarkMessages(GetMessagesAction.messages);
        }
        ;
    }
    static restoreState() {
        if (GetMessagesAction.messages.length !== 0) {
            GetMessagesAction.findMessages("new");
        }
    }
    static markMessagesAsFound(messages) {
        messages.forEach(message => {
            message.classList.add("vk-im-resposts-found");
        });
    }
    static unmarkMessages(messages) {
        messages.forEach(message => {
            message.classList.contains("vk-im-resposts-found") && message.classList.remove("vk-im-resposts-found");
        });
    }
    static findMessages(mode) {
        if (mode === "add") {
            const baseSelector = element_find_1.GetElementCollection.get(element_collection_1.ElementCollection.IMDialogMessagesOnlyPictures).selector;
            const messages = new element_find_1.ElementFind().getElementByQueryMultiple(`.im-mess-stack[data-peer="${(0, get_vk_id_util_1.getVKId)()}"] ${baseSelector}:not(.vk-im-resposts-found)`);
            const completeLength = GetMessagesAction.messages.unshift(...messages);
            GetMessagesAction.messagesDelta = messages.length;
            if (GetMessagesAction.currentMessageIndex !== undefined)
                GetMessagesAction.currentMessageIndex += messages.length;
            GetMessagesAction.markMessagesAsFound(GetMessagesAction.messages);
            GetMessagesAction.setMessageCount(completeLength);
        }
        else {
            const baseSelector = element_find_1.GetElementCollection.get(element_collection_1.ElementCollection.IMDialogMessagesOnlyPictures).selector;
            const messages = new element_find_1.ElementFind().getElementByQueryMultiple(`.im-mess-stack[data-peer="${(0, get_vk_id_util_1.getVKId)()}"] ${baseSelector}:not(.vk-im-resposts-found)`);
            GetMessagesAction.messagesDelta = messages.length;
            if (GetMessagesAction.currentMessageIndex === undefined)
                GetMessagesAction.currentMessageIndex = 0;
            GetMessagesAction.markMessagesAsFound(GetMessagesAction.messages);
            GetMessagesAction.setMessageCount(messages.length);
        }
    }
}
exports.GetMessagesAction = GetMessagesAction;
GetMessagesAction.messages = [];


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getVKId = void 0;
const element_collection_1 = __webpack_require__(8);
const element_find_1 = __webpack_require__(7);
function getVKId() {
    var _a, _b;
    return (_b = (_a = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.LeftColumnAlbums)) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) === null || _b === void 0 ? void 0 : _b.replace(/\/albums/, "");
}
exports.getVKId = getVKId;


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClosePanelAction = void 0;
const element_collection_1 = __webpack_require__(8);
const element_find_1 = __webpack_require__(7);
const element_existence_guard_1 = __webpack_require__(3);
const render_fabric_1 = __webpack_require__(11);
const get_messages_action_1 = __webpack_require__(20);
class ClosePanelAction {
    run() {
        const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanel);
        new render_fabric_1.RenderAt().remove(element);
        get_messages_action_1.GetMessagesAction.resetState(true);
    }
}
__decorate([
    (0, element_existence_guard_1.elementShouldExistGuard)(element_find_1.GetElementCollection.get(element_collection_1.ElementCollection.IMDialogContainerFilterPanel).selector)
], ClosePanelAction.prototype, "run", null);
exports.ClosePanelAction = ClosePanelAction;


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PanelSetStateAction = void 0;
const button_control_1 = __webpack_require__(24);
const button_flat_control_1 = __webpack_require__(25);
const button_model_1 = __webpack_require__(10);
const control_base_control_1 = __webpack_require__(15);
const counter_control_1 = __webpack_require__(26);
const element_collection_1 = __webpack_require__(8);
const element_find_1 = __webpack_require__(7);
const element_existence_guard_1 = __webpack_require__(3);
const render_fabric_1 = __webpack_require__(11);
const get_messages_action_1 = __webpack_require__(20);
class PanelSetStateAction {
    run(state) {
        this.clearContainer();
        this.renderState(state);
    }
    clearContainer() {
        const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanelContainer);
        element.innerHTML = ``;
    }
    renderState(state) {
        switch (state) {
            case "loading":
                renderLoadingState();
                break;
            case "search":
                renderSearchButton();
                renderCounter();
                renderArrow("up");
                renderArrow("down");
                break;
            default:
                break;
        }
        function renderSearchButton() {
            const addSearchButton = new button_flat_control_1.ButtonFlat({
                id: "vk-im-resposts-filter-search-button",
                tag: "div",
                classes: ["addpost_button_wrap"],
                icon: button_model_1.ButtonIcons.none,
                html: `<button class="FlatButton FlatButton--secondary FlatButton--size-m addpost_button" type="button">
    <span class="FlatButton__in">
        <span class="FlatButton__content">Найти репосты</span>
    </span>
</button>`,
            }, get_messages_action_1.GetMessagesAction.prototype.run, {}).element;
            const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanelContainer);
            new render_fabric_1.RenderAt().render(addSearchButton, element);
        }
        function renderCounter() {
            const addCounter = new counter_control_1.CounterControl({
                id: "vk-im-resposts-counter",
                tag: "div",
                classes: ["addpost_button_wrap"],
                styles: [{
                        key: "margin-left",
                        value: "20px"
                    }],
                html: `Количество репостов: <span></span>`
            }).element;
            const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanelContainer);
            new render_fabric_1.RenderAt().render(addCounter, element);
        }
        function renderArrow(mode) {
            const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanelContainer);
            const arrowElement = new button_control_1.ButtonChevronControl({
                id: `vk-im-resposts-filter-arrow-${mode}`,
                tag: "span",
                classes: ["ui_rmenu_item_dropdown"],
                icon: button_model_1.ButtonIcons.none,
                styles: [{
                        key: "cursor",
                        value: "pointer"
                    }],
                html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" fill="none" viewBox="0 0 16 12"><path fill="currentColor" d="M4.45 3.7a.9.9 0 0 0-1.1 1.4l4.1 3.21a.9.9 0 0 0 1.1 0l4.1-3.2a.9.9 0 1 0-1.1-1.42L8 6.46 4.45 3.7Z"></path></svg>`,
                mode
            }, get_messages_action_1.GetMessagesAction.navigateMessages, mode).element;
            new render_fabric_1.RenderAt().render(arrowElement, element);
        }
        ;
        function renderLoadingState() {
            const element = new element_find_1.ElementFind().getElementByElementIdSingle(element_collection_1.ElementCollection.IMDialogContainerFilterPanelContainer);
            const loadingElement = new control_base_control_1.ControlBase({
                id: "vk-im-resposts-filter-loading",
                tag: "div",
                classes: ["pr", "videoplayer_waiting", "pr_big"],
                html: `<div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div>`,
            }).element;
            new render_fabric_1.RenderAt().render(loadingElement, element);
            return element;
        }
    }
}
__decorate([
    (0, element_existence_guard_1.elementShouldExistGuard)(element_find_1.GetElementCollection.get(element_collection_1.ElementCollection.IMDialogContainerFilterPanel).selector)
], PanelSetStateAction.prototype, "run", null);
exports.PanelSetStateAction = PanelSetStateAction;


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonChevronControl = void 0;
const button_base_control_1 = __webpack_require__(14);
class ButtonChevronControl extends button_base_control_1.ButtonBaseControl {
    constructor(params, callback, args) {
        super(params, callback, args);
        params.mode === "up" ? this.element.style.setProperty("transform", "rotate(180deg)") : null;
    }
}
exports.ButtonChevronControl = ButtonChevronControl;


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonFlat = void 0;
const button_base_control_1 = __webpack_require__(14);
class ButtonFlat extends button_base_control_1.ButtonBaseControl {
    constructor(params, callback, args) {
        super(params, callback, args);
    }
}
exports.ButtonFlat = ButtonFlat;


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CounterControl = void 0;
const counter_base_control_1 = __webpack_require__(27);
class CounterControl extends counter_base_control_1.CounterBaseControl {
    constructor(params) {
        super(params);
    }
}
exports.CounterControl = CounterControl;


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CounterBaseControl = void 0;
const control_base_control_1 = __webpack_require__(15);
class CounterBaseControl extends control_base_control_1.ControlBase {
    constructor(params) {
        super(params);
    }
}
exports.CounterBaseControl = CounterBaseControl;


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StylesInjecter = void 0;
const styles_scss_1 = __importDefault(__webpack_require__(29));
const userscript_permissions_guard_1 = __webpack_require__(39);
class StylesInjecter {
    injectInit() {
        styles_scss_1.default;
    }
    static inject(css) {
        GM_addStyle(css);
    }
}
__decorate([
    (0, userscript_permissions_guard_1.checkUserscriptPermission)("GM_addStyle")
], StylesInjecter, "inject", null);
exports.StylesInjecter = StylesInjecter;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(33);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(34);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(35);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(36);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),
/* 30 */
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 31 */
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),
/* 32 */
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),
/* 34 */
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),
/* 35 */
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),
/* 36 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".vk-im-resposts-found {\n  background: rgba(57, 125, 204, 0.15);\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 37 */
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),
/* 38 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkUserscriptPermission = void 0;
const checkUserscriptPermission = (permissionName) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        if (typeof window[permissionName] === "function") {
            originalMethod.apply(this, args);
        }
        else {
            console.error(`${permissionName} is not defined`);
            return;
        }
    };
    return descriptor;
};
exports.checkUserscriptPermission = checkUserscriptPermission;


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stopScheduling = exports.startScheduling = void 0;
let interval = null;
const startScheduling = (app) => {
    interval = setInterval(function () {
        app.renderElements();
    }, 5000);
};
exports.startScheduling = startScheduling;
const stopScheduling = () => {
    clearInterval(interval);
};
exports.stopScheduling = stopScheduling;


/***/ })
/******/ 	]);
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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const app_1 = __webpack_require__(1);
const scheduler_1 = __webpack_require__(40);
const app = new app_1.App();
(0, scheduler_1.startScheduling)(app);

})();

/******/ })()
;