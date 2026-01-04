// ==UserScript==
// @name SMM Planner - SakhaDay
// @version 0.0.5
// @namespace https://smmplanner.com/
// @description This is a little text enhancer for SMM Planner dashboard. Preferably for Cyrillic text style rules.
// @homepage https://github.com/pboymt/userscript-typescript-template#readme
// @license https://opensource.org/licenses/MIT
// @match https://smmplanner.com/*
// @downloadURL https://update.greasyfork.org/scripts/454780/SMM%20Planner%20-%20SakhaDay.user.js
// @updateURL https://update.greasyfork.org/scripts/454780/SMM%20Planner%20-%20SakhaDay.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddButtons = exports.App = void 0;
var app_1 = __webpack_require__(2);
Object.defineProperty(exports, "App", ({ enumerable: true, get: function () { return app_1.App; } }));
var app_facade_1 = __webpack_require__(3);
Object.defineProperty(exports, "AddButtons", ({ enumerable: true, get: function () { return app_facade_1.AddButtons; } }));


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.App = void 0;
const app_facade_1 = __webpack_require__(3);
const element_find_module_1 = __webpack_require__(12);
const element_find_module_2 = __webpack_require__(12);
const guards_module_1 = __webpack_require__(16);
const routes_1 = __webpack_require__(19);
class App {
    constructor() {
        console.log("Скрипт инициализирован!");
    }
    addButtons() {
        console.log("addButtons запущен!");
        (0, app_facade_1.AddButtons)();
    }
}
__decorate([
    (0, guards_module_1.routeGuard)(routes_1.Routes.CreatePost),
    (0, guards_module_1.elementShouldNotExistGuard)("#sd-add-all-public"),
    (0, guards_module_1.elementShouldExistGuard)(element_find_module_1.GetElementCollection.get(element_find_module_2.ElementCollection.ModalBody).selector)
], App.prototype, "addButtons", null);
exports.App = App;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddButtons = void 0;
const actions_module_1 = __webpack_require__(4);
const buttons_module_1 = __webpack_require__(9);
const element_find_module_1 = __webpack_require__(12);
const render_module_1 = __webpack_require__(13);
function AddButtons() {
    const addButtonAddAll = new buttons_module_1.Button({
        id: "sd-add-all-public",
        classes: ["btn", "btn-default"],
        icon: buttons_module_1.ButtonIcons.glyphiconPicture,
        text: "Добавить все паблики"
    }, actions_module_1.AddPublics.prototype.add, actions_module_1.AddAllPublicsData).element;
    let place = new element_find_module_1.ElementFind().getSingle(element_find_module_1.GetElementCollection.get(element_find_module_1.ElementCollection.AddPageLabel));
    new render_module_1.RenderAt().render(addButtonAddAll, place);
    const addButtonFixText = new buttons_module_1.TypographyButton({
        id: "sd-fix-text",
        classes: [],
        icon: buttons_module_1.ButtonIcons.none,
        text: "Исправить текст"
    }, actions_module_1.FixText.fix, null).element;
    place = new element_find_module_1.ElementFind().getSingle(element_find_module_1.GetElementCollection.get(element_find_module_1.ElementCollection.TypographHost));
    new render_module_1.RenderAt().render(addButtonFixText, place);
}
exports.AddButtons = AddButtons;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddAllPublicsData = exports.FixText = exports.AddPublics = void 0;
var add_publics_action_1 = __webpack_require__(5);
Object.defineProperty(exports, "AddPublics", ({ enumerable: true, get: function () { return add_publics_action_1.AddPublics; } }));
var fix_text_action_1 = __webpack_require__(7);
Object.defineProperty(exports, "FixText", ({ enumerable: true, get: function () { return fix_text_action_1.FixText; } }));
var add_publics_model_1 = __webpack_require__(8);
Object.defineProperty(exports, "AddAllPublicsData", ({ enumerable: true, get: function () { return add_publics_model_1.AddAllPublicsData; } }));


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddPublics = void 0;
const element_find_1 = __webpack_require__(6);
class AddPublics {
    add(publics) {
        const publicNamesCollection = new Set();
        publics.forEach((publicName) => publicNamesCollection.add(publicName.publicName));
        const panels = new element_find_1.ElementFind().getMultiple(element_find_1.GetElementCollection.get(element_find_1.ElementCollection.Buttons))
            .filter((panel) => Array.from(publicNamesCollection).includes(panel.innerText.toLowerCase()));
        function delay(t) {
            return new Promise(resolve => setTimeout(resolve, t));
        }
        function clickAddAllPublicsButton(panel) {
            return __awaiter(this, void 0, void 0, function* () {
                panel.querySelector("a[role='button'] a.pull-right").click();
                return Promise.resolve();
            });
        }
        function clickModalDialogOKButton() {
            return __awaiter(this, void 0, void 0, function* () {
                new element_find_1.ElementFind().getSingle(element_find_1.GetElementCollection.get(element_find_1.ElementCollection.ModalDialogOKButton)).click();
                return Promise.resolve();
            });
        }
        function run() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let item of panels) {
                    yield clickAddAllPublicsButton(item);
                    yield delay(150);
                    yield clickModalDialogOKButton();
                    yield delay(300);
                }
            });
        }
        run();
    }
}
exports.AddPublics = AddPublics;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetElementCollection = exports.ElementCollection = exports.ElementFind = void 0;
class ElementFind {
    constructor(contextElement = document) {
        this.contextElement = contextElement;
    }
    getSingle(query) {
        return this.getElementSingle(query);
    }
    getMultiple(query) {
        return this.getElementMultiple(query);
    }
    getElementSingle(query) {
        if (query.id === ElementCollection.AddPageLabel) {
            return this.contextElement.querySelector(".viewport__content-section .modal-body .panel-group").parentNode.parentNode.querySelector(".control-label");
        }
        return this.contextElement.querySelector(query.selector);
    }
    getElementMultiple(query) {
        return Array.from(this.contextElement.querySelectorAll(query.selector));
    }
}
exports.ElementFind = ElementFind;
var ElementCollection;
(function (ElementCollection) {
    ElementCollection[ElementCollection["Root"] = 0] = "Root";
    ElementCollection[ElementCollection["Modal"] = 1] = "Modal";
    ElementCollection[ElementCollection["ModalBody"] = 2] = "ModalBody";
    ElementCollection[ElementCollection["Form"] = 3] = "Form";
    ElementCollection[ElementCollection["PanelGroup"] = 4] = "PanelGroup";
    ElementCollection[ElementCollection["AddPageLabel"] = 5] = "AddPageLabel";
    ElementCollection[ElementCollection["Panels"] = 6] = "Panels";
    ElementCollection[ElementCollection["Buttons"] = 7] = "Buttons";
    ElementCollection[ElementCollection["ButtonsAddAll"] = 8] = "ButtonsAddAll";
    ElementCollection[ElementCollection["ModalDialogOKButton"] = 9] = "ModalDialogOKButton";
    ElementCollection[ElementCollection["TypographHost"] = 10] = "TypographHost";
    ElementCollection[ElementCollection["Editor"] = 11] = "Editor";
})(ElementCollection = exports.ElementCollection || (exports.ElementCollection = {}));
const elementCollectionList = [
    {
        id: ElementCollection.Root,
        selector: "iframe[src='iframe/app/#/postproject']",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.Modal,
        selector: ".viewport__content-section",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.ModalBody,
        selector: ".viewport__content-section .modal-body",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.Form,
        selector: ".viewport__content-section .modal-body form[role='form']",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.PanelGroup,
        selector: ".viewport__content-section .modal-body .panel-group",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.AddPageLabel,
        selector: ".viewport__content-section .modal-body .panel-group",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.Panels,
        selector: ".viewport__content-section .modal-body .panel-group > .panel-default",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.Buttons,
        selector: ".viewport__content-section .modal-body .panel-group > .panel-default a[role='button']",
        preferredMode: "selectMultiple"
    },
    {
        id: ElementCollection.ButtonsAddAll,
        selector: ".viewport__content-section .modal-body .panel-group > .panel-default a[role='button'] a.pull-right",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.ModalDialogOKButton,
        selector: "body.modal-open .modal-dialog .modal-content .modal-footer button.btn-primary",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.TypographHost,
        selector: ".viewport__content-section .modal-body form[role='form'] > .form-group.emoji-group > div:nth-child(4)",
        preferredMode: "selectSingle"
    },
    {
        id: ElementCollection.Editor,
        selector: ".viewport__content-section .modal-body form[role='form'] .emoji-wysiwyg-editor",
        preferredMode: "selectSingle"
    },
];
class GetElementCollection {
    static get(id) {
        return elementCollectionList.find((element) => element.id === id);
    }
}
exports.GetElementCollection = GetElementCollection;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FixText = void 0;
const element_find_1 = __webpack_require__(6);
class FixText {
    static fix() {
        const editor = new element_find_1.ElementFind().getSingle(element_find_1.GetElementCollection.get(element_find_1.ElementCollection.Editor));
        let text = FixText.fixQuotes(editor.innerText);
        text = FixText.fixBannedOrgs(text);
        text = FixText.fixInsufficientParagraphs(text);
        text = FixText.fixE(text);
        text = FixText.fixDash(text);
        editor.innerText = text;
    }
    static fixQuotes(text) {
        let textModified = text;
        textModified = textModified.replace(/(\s|^|\n|\(|\[|\{)\"(.)/gi, "$1«$2");
        textModified = textModified.replace(/(.)\"(\s|^|\n|\(|\[|\{|\.|\,|\?|\!|\:|\;|\-)/gi, "$1»$2");
        return textModified;
    }
    static fixBannedOrgs(text) {
        const regex = /(^|\s|\n|"|«)(?!\*)(Meta|Facebook|Instagram|Мета|Фейсбук|ФБ|FB|Инстаграм|Инста|Insta)(?!\*)/gi;
        let textModified = text;
        const isMentioned = regex.test(textModified);
        function replaceCondition(capturedGroups) {
            if (/^|\s|\n|"|«/gi.test(capturedGroups[1])) {
                return "$1$2*";
            }
            else {
                if (/^|\s|\n|"|«/gi.test(capturedGroups[2])) {
                    return "$2$3*";
                }
                else {
                    return capturedGroups[3] ? "$3*" : "$2*";
                }
            }
        }
        if (isMentioned) {
            const capturedGroups = regex.exec(textModified);
            if (capturedGroups) {
                textModified = textModified.replace(regex, replaceCondition(capturedGroups));
                if (!textModified.match(/\* соцсеть запрещена в РФ и признана экстремистской(\.|$|\n)/gi)) {
                    textModified += "\n\n\* соцсеть запрещена в РФ и признана экстремистской";
                }
            }
        }
        return textModified;
    }
    static fixInsufficientParagraphs(text) {
        let textModified = text;
        textModified = textModified.replace(/(.)\n(.)/gi, "$1\n\n$2");
        return textModified;
    }
    static fixE(text) {
        let textModified = text;
        textModified = textModified.replace(/(.)ё(.)/g, "$1е$2");
        textModified = textModified.replace(/(.)Ё(.)/g, "$1Е$2");
        return textModified;
    }
    static fixDash(text) {
        let textModified = text;
        textModified = textModified.replace(/(\s|^|\n|\(|\[|\{|\.|\,|\?|\!|\:|\;)\-(\s|^|\n|\(|\[|\{|\.|\,|\?|\!|\:|\;)/gi, "$1—$2");
        textModified = textModified.replace(/(\s|^|\n|\(|\[|\{|\.|\,|\?|\!|\:|\;)\–(\s|^|\n|\(|\[|\{|\.|\,|\?|\!|\:|\;)/gi, "$1—$2");
        return textModified;
    }
}
exports.FixText = FixText;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddAllPublicsData = void 0;
exports.AddAllPublicsData = [
    { publicName: "sakhaday", social: "fb" },
    { publicName: "sakhaday", social: "ig" },
    { publicName: "sakhaday", social: "tg" },
    { publicName: "sakhaday", social: "tw" },
    { publicName: "sakhaday", social: "vk" },
    { publicName: "yakutsk news", social: "fb" },
    { publicName: "yakutsk news", social: "ig" },
    { publicName: "yakutsk news", social: "tg" },
    { publicName: "yakutsk news", social: "tw" },
    { publicName: "yakutsk news", social: "vk" },
    { publicName: "yakutsk news", social: "ok" },
];


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonIcons = exports.TypographyButton = exports.Button = void 0;
var button_1 = __webpack_require__(10);
Object.defineProperty(exports, "Button", ({ enumerable: true, get: function () { return button_1.Button; } }));
Object.defineProperty(exports, "TypographyButton", ({ enumerable: true, get: function () { return button_1.TypographyButton; } }));
Object.defineProperty(exports, "ButtonIcons", ({ enumerable: true, get: function () { return button_1.ButtonIcons; } }));


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonIcons = exports.TypographyButton = exports.Button = void 0;
const yakutsknews_icon_1 = __webpack_require__(11);
class Button {
    constructor(params, callback, args) {
        var _a;
        let innerHTML = `<span class="${params.icon !== ButtonIcons.none ? 'glyphicon' : ''} ${params.icon !== ButtonIcons.none ? params.icon : ''}">
</span>
<span>
    <span class="ng-scope">${(_a = params.text) !== null && _a !== void 0 ? _a : 'Текст'}</span>
</span>`;
        const button = document.createElement("button");
        button.innerHTML = innerHTML;
        if (params.id) {
            button.id = params.id;
        }
        params.classes.forEach(element => {
            button.classList.add(element);
        });
        button.addEventListener("click", callback.bind(this, args), false);
        button.sdCallerParams = args;
        this.element = button;
    }
}
exports.Button = Button;
class TypographyButton {
    constructor(params, callback, args) {
        let innerHTML = `<i class="typograph-icon"></i>`;
        const button = document.createElement("typograph-input");
        button.innerHTML = innerHTML;
        if (params.id) {
            button.id = params.id;
        }
        params.classes.forEach(element => {
            button.classList.add(element);
        });
        button.classList.add("ng-isolate-scope");
        button.setAttribute("text", "project.icon");
        button.style.setProperty("right", "35px");
        button.querySelector("i").style.setProperty("background", `url(${yakutsknews_icon_1.YakutskNewsIcon}) no-repeat`);
        button.addEventListener("click", callback.bind(this, args), false);
        button.sdCallerParams = args;
        this.element = button;
    }
}
exports.TypographyButton = TypographyButton;
var ButtonIcons;
(function (ButtonIcons) {
    ButtonIcons["none"] = "none";
    ButtonIcons["glyphiconPicture"] = "glyphicon-picture";
})(ButtonIcons = exports.ButtonIcons || (exports.ButtonIcons = {}));


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.YakutskNewsIcon = void 0;
exports.YakutskNewsIcon = `data:image/svg+xml;base64,PHN2ZyBpZD0i0KHQu9C+0LlfMSIgZGF0YS1uYW1lPSLQodC70L7QuSAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6bm9uZTtzdHJva2U6I2E3YTdhNztzdHJva2Utd2lkdGg6OHB4O30uY2xzLTJ7ZmlsbDojN2E3YTdhO308L3N0eWxlPjwvZGVmcz48Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9IjUwIiBjeT0iNTAiIHI9IjQ2Ii8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzQuODksNTkuNTRjLTIuNDQsMS45LTQuNDQsMy44Ny02LjgyLDUuMTRhNS40MSw1LjQxLDAsMCwxLTQuNjUtLjEzYy0xLS42Ny0xLjI3LTIuNy0xLjU2LTQuMTgtLjE2LS44Mi4zNy0xLjc0LjQzLTIuNjJhMTQuNTUsMTQuNTUsMCwwLDAtLjE3LTIuMjdjLS44NS4xLTEuODctLjA3LTIuNTIuMzQtMi41MiwxLjU3LTMuNjQsNC00LjI5LDYuODgtLjIzLDEtMS4yLDEuODctMS44NCwyLjc5LTEtLjg2LTIuNjctMS41Ni0yLjk1LTIuNjFBMjMuNDksMjMuNDksMCwwLDEsNTAsNTZhODcuNDMsODcuNDMsMCwwLDEsNC4xMS0yMi40MywyMi4zNiwyMi4zNiwwLDAsMSwxLjY2LTMuOTRDNTcuOTEsMjUuNTksNjAuNjcsMjUsNjQuNjYsMjhjLTQsNi41NS02LjIyLDEzLjc4LTcuNzksMjEuMjJsLjY3LjM3YzEuMzctMS43OSwyLjY1LTMuNjgsNC4xNi01LjM2YTEyLjE0LDEyLjE0LDAsMCwxLDMuNTMtMi44MmMyLjU2LTEuMjUsNC4xNS0uMjYsNC43NiwyLjkzLTQuOC4zMy03LjgzLDMuMjQtOS45Myw3LjQ3QTMyLjU3LDMyLjU3LDAsMCwxLDYzLjQ4LDUwYzMuOS0xLjUxLDYsLjA3LDUuNTcsNC4yMS0uMTYsMS42LS41MSwzLjE4LS41NSw0Ljc4LDAsLjY5LjM2LDEuNzkuODYsMmEyLjMzLDIuMzMsMCwwLDAsMi4xNS0uNTgsNDUuNTYsNDUuNTYsMCwwLDAsMy42My01Ljc4Yy40My0uODMuMTQtMiwuNDktMi45MS44MS0yLjEzLjY0LTMuNDYtMi45My0yLjg5LDEuMS0xLjM1LDEuNTUtMi40MiwyLjI4LTIuNjksMS45My0uNjgsMi4zOS0yLDIuODEtMy44M2E2MS40Myw2MS40MywwLDAsMSwyLjU5LTcuOTFjMS0yLjU0LDUuNTgtMy4zNiw3LjI2LTEuMjkuMzcuNDYuMTEsMS42Mi0uMTQsMi4zNUM4Ni4zMiwzOC45LDg1LDQyLjI4LDgzLjY3LDQ2bDMuMjEuNDQuNDUuNjljLS45LjczLTEuNzUsMi0yLjczLDIuMDYtMS41Mi4xNy0yLC43NC0yLjE5LDIuMS0uMjcsMi40OC0uNzIsNS0uOCw3LjQ1QTMsMywwLDAsMCw4My4wNiw2MWEyLjc5LDIuNzksMCwwLDAsMi4zNy0uN2MxLjM3LTEuMzUsMi41MS0yLjkzLDMuOTItNC42My4wOS40Ny4yOS44My4xOCwxLTEuNzYsMy4xNy0zLjc1LDYuMTMtNy4xNCw3Ljg0LTMuNzUsMS44OS01LjkzLjkzLTctMy4xNEM3NS4yMiw2MC44MSw3NS4wNiw2MC4yMSw3NC44OSw1OS41NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zNy4zNiw1Ny42N2MtMS41NiwxLjc5LTIuOTMsMy41OS00LjU0LDUuMTRhNi41Myw2LjUzLDAsMCwxLTcsMS40Yy0yLjM2LS45LTMuMTgtMy4yOC0zLjQ1LTUuNjgtLjg1LTcuODEuODEtMTUuMzQsMi43NS0yMi44Mi4xNi0uNi4zNS0xLjIuNDUtMS44MSwwLS4yMy0uMTMtLjUtLjItLjc1LTUuNjQsMS4yMS04LjY2LDQtOS40MSw5LjUyLTEuNDQtLjgyLTMtMS4yMi0zLjY4LTIuMjNzLTEuMzgtMy4yMi0uODEtNC4wNmExMi40OCwxMi40OCwwLDAsMSw0Ljg4LTQuMjFjMi45MS0xLjMxLDYuMTUtMS44Nyw5LjE4LTIuOTJhMTQuMTEsMTQuMTEsMCwwLDAsMy40OS0yYzMuNTMtMi41Miw0LjIzLTIuNTYsOC4yMSwwLTUuODMsNS41Ni02Ljk1LDEzLjA4LTguMywyMC40MmE1My43NSw1My43NSwwLDAsMC0uNTUsOS45MiwzLjYxLDMuNjEsMCwwLDAsMS40OCwyLjgyLDMuMzMsMy4zMywwLDAsMCwzLS44N2MxLjU3LTEuOTIsMy4yOC00LDQtNi4yOCwyLjE0LTYuOCwzLjgyLTEzLjc1LDUuNjktMjAuNjMuMzUtMS4zLjY5LTIuNjEsMS4xMi0zLjg5LDEuMTEtMy4yNSwyLjU4LTMuODQsNS43NC0yLjUyLDEuODIuNzUsMi4xMywxLjUzLDEuNDksMy42NS0yLjM1LDcuNzgtNC4xOSwxNS43MS02LjM1LDIzLjU1QzQzLDU5LjE3LDQxLjY2LDY1LjA4LDM5LjM1LDcwLjU2Yy0yLjE3LDUuMTItNS4yNSw3LTkuOCw2LjI4LTEuNTUtLjI2LTMtMS40Mi00LjM3LTIuMzMtLjI3LS4xNy0uMDYtMS4wNi0uMDctMS42Mi40Ny4wOSwxLjA1LDAsMS4zOS4zLDIuNiwyLDQuNTQsMi4wOSw1LjgzLS42M0MzNC41Miw2Ny45MiwzNiw2MywzNy43NSw1OC4xLDM3Ljc4LDU4LDM3LjUzLDU3Ljg1LDM3LjM2LDU3LjY3WiIvPjwvc3ZnPg==`;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetElementCollection = exports.ElementCollection = exports.ElementFind = void 0;
var element_find_1 = __webpack_require__(6);
Object.defineProperty(exports, "ElementFind", ({ enumerable: true, get: function () { return element_find_1.ElementFind; } }));
Object.defineProperty(exports, "ElementCollection", ({ enumerable: true, get: function () { return element_find_1.ElementCollection; } }));
Object.defineProperty(exports, "GetElementCollection", ({ enumerable: true, get: function () { return element_find_1.GetElementCollection; } }));


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteResult = exports.RenderResult = exports.RenderAt = void 0;
var render_fabric_1 = __webpack_require__(14);
Object.defineProperty(exports, "RenderAt", ({ enumerable: true, get: function () { return render_fabric_1.RenderAt; } }));
var render_model_1 = __webpack_require__(15);
Object.defineProperty(exports, "RenderResult", ({ enumerable: true, get: function () { return render_model_1.RenderResult; } }));
Object.defineProperty(exports, "DeleteResult", ({ enumerable: true, get: function () { return render_model_1.DeleteResult; } }));


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RenderAt = void 0;
const render_model_1 = __webpack_require__(15);
class RenderAt {
    render(element, place) {
        var _a;
        if (place && element) {
            place.appendChild(element);
            console.log(`Зарендерил "${(_a = element === null || element === void 0 ? void 0 : element.innerText) !== null && _a !== void 0 ? _a : 'элемент'}"!`);
            return element;
        }
        else {
            console.log("Хуёво, нихуя не зарендерил");
            return render_model_1.RenderResult.NOELEMENT;
        }
    }
    remove(elem) {
        if (elem) {
            elem.parentNode.removeChild(elem);
            return render_model_1.DeleteResult.SUCCESS;
        }
        else {
            return render_model_1.DeleteResult.NOELEMENT;
        }
    }
}
exports.RenderAt = RenderAt;


/***/ }),
/* 15 */
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
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementShouldExistGuard = exports.elementShouldNotExistGuard = exports.routeGuard = void 0;
var route_guard_1 = __webpack_require__(17);
Object.defineProperty(exports, "routeGuard", ({ enumerable: true, get: function () { return route_guard_1.routeGuard; } }));
var element_existence_guard_1 = __webpack_require__(18);
Object.defineProperty(exports, "elementShouldNotExistGuard", ({ enumerable: true, get: function () { return element_existence_guard_1.elementShouldNotExistGuard; } }));
Object.defineProperty(exports, "elementShouldExistGuard", ({ enumerable: true, get: function () { return element_existence_guard_1.elementShouldExistGuard; } }));


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.routeGuard = void 0;
const routeGuard = (route) => (target, propertyKey, descriptor) => {
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
exports.routeGuard = routeGuard;


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementShouldExistGuard = exports.elementShouldNotExistGuard = void 0;
const elementShouldNotExistGuard = (selector) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const url = new URL(location.href);
        if (document.querySelector(selector) === null) {
            console.log("Проверка отсутствия элемента... Элемента нет... ОК");
            originalMethod.apply(this, args);
        }
        else {
            console.log("Проверка отсутствия элемента... Элемент есть... Плохо");
            return;
        }
    };
    return descriptor;
};
exports.elementShouldNotExistGuard = elementShouldNotExistGuard;
const elementShouldExistGuard = (selector) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        if (document.querySelector(selector) !== null) {
            console.log("Проверка наличия элемента... Элемент есть... ОК");
            originalMethod.apply(this, args);
        }
        else {
            console.log("Проверка наличия элемента... Элемента нет. Плохо");
            return;
        }
    };
    return descriptor;
};
exports.elementShouldExistGuard = elementShouldExistGuard;


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Routes = void 0;
var Routes;
(function (Routes) {
    Routes["IFrame"] = "/iframe/app";
    Routes["CreatePost"] = "/iframe/app/#/postproject";
})(Routes = exports.Routes || (exports.Routes = {}));


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stopScheduling = exports.startScheduling = void 0;
let interval = null;
const startScheduling = (app) => {
    interval = setInterval(function () {
        app.addButtons();
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

Object.defineProperty(exports, "__esModule", ({ value: true }));
const app_module_1 = __webpack_require__(1);
const scheduler_1 = __webpack_require__(20);
const app = new app_module_1.App();
(0, scheduler_1.startScheduling)(app);

})();

/******/ })()
;