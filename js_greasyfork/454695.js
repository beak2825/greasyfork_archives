// ==UserScript==
// @name        MidConfig
// @namespace   https://midra.me
// @version     1.0.3
// @description UserScript用の設定画面
// @author      Midra
// @license     MIT
// @grant       none
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};

// NAMESPACE OBJECT: ./src/Items/index.ts
var Items_namespaceObject = {};
__webpack_require__.r(Items_namespaceObject);
__webpack_require__.d(Items_namespaceObject, {
  "Button": () => (Items_Button),
  "ButtonEmpty": () => (Items_ButtonEmpty),
  "CheckBox": () => (Items_CheckBox),
  "Color": () => (Items_Color),
  "Divider": () => (Items_Divider),
  "Group": () => (Items_Group),
  "Item": () => (Items_Item),
  "Range": () => (Items_Range),
  "Select": () => (Items_Select),
  "Text": () => (Items_Text)
});

// NAMESPACE OBJECT: ./src/index.ts
var src_namespaceObject = {};
__webpack_require__.r(src_namespaceObject);
__webpack_require__.d(src_namespaceObject, {
  "Items": () => (Items_namespaceObject),
  "Panel": () => (Panel)
});

;// CONCATENATED MODULE: ./src/types.ts
const isConfigItemData = (data) => {
    if (data instanceof Object) {
        return (Object.keys(data).length === 3 &&
            data.hasOwnProperty('checked') &&
            data.hasOwnProperty('value') &&
            data.hasOwnProperty('default'));
    }
    return false;
};
const isConfigJsonData = (data) => {
    if (data instanceof Object) {
        return (Object.keys(data).length === 2 &&
            data.hasOwnProperty('version') &&
            data.hasOwnProperty('data'));
    }
    return false;
};

;// CONCATENATED MODULE: ./src/constants.ts
const SVG_CHECKMARK = '<svg class="midconfig-svg-checkmark" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.86 17.997a1.002 1.002 0 0 1-.73-.32l-4.86-5.17a1.001 1.001 0 0 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1.002 1.002 0 0 1-.73.33h-.01Z"></path></svg>';
const SVG_ARROW_DOWN = '<svg class="midconfig-svg-arrow-down" width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 16.001a1 1 0 0 1-.64-.23l-6-5a1.001 1.001 0 0 1 1.28-1.54l5.36 4.48 5.36-4.32a1 1 0 0 1 1.41.15 1 1 0 0 1-.14 1.46l-6 4.83a1 1 0 0 1-.63.17Z"></path></svg>';
const STYLE = '#midconfig{display:flex;flex-direction:column;flex-wrap:nowrap;justify-content:space-between;width:100%;height:100%;border-radius:10px;background-color:var(--back1);border:1px solid var(--text3);box-shadow:1px 1px 10px -2px var(--text3);overflow:hidden}#midconfig{--accent1: #2389ff;--accent2: #238aff26;--accent-text: #fff;--back1: #fff;--text1: #3c3c3c;--text2: #8a8a8a;--text3: #e0e0e0;--red1: #ff3456;--red2: #ff345626}#midconfig[theme=dark]{--accent1: #298cff;--accent2: #298cff36;--accent-text: #fff;--back1: #333;--text1: #f1f1f1;--text2: #a0a0a0;--text3: #505050}@media(prefers-color-scheme: dark){#midconfig[theme=auto]{--accent1: #298cff;--accent2: #298cff36;--accent-text: #fff;--back1: #333;--text1: #f1f1f1;--text2: #a0a0a0;--text3: #505050}}#midconfig #midconfig,#midconfig *,#midconfig ::after,#midconfig ::before{transition:150ms ease-in-out}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=text],#midconfig .midconfig-select-container>select{padding:0 10px;border:1px solid var(--text3);border-radius:8px;background-color:rgba(0,0,0,0)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-label-container>label>span,#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-header>span,#midconfig .midconfig-tab>.midconfig-tab-item,#midconfig .midconfig-button,#midconfig .midconfig-select-container>select{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}#midconfig ::-webkit-scrollbar{width:7px}#midconfig ::-webkit-scrollbar-track{background-color:rgba(0,0,0,0);margin:1px 0}#midconfig ::-webkit-scrollbar-thumb{background-color:var(--text2);border-radius:3px;border-right:1px solid rgba(0,0,0,0);border-left:1px solid rgba(0,0,0,0);background-clip:padding-box}#midconfig *{scrollbar-width:thin;scrollbar-color:var(--text2) rgba(0,0,0,0)}#midconfig,#midconfig *,#midconfig ::after,#midconfig ::before{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,sans-serif;font-size:14px;font-weight:400;color:var(--text1)}#midconfig :not(input){-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#midconfig svg{display:inline-block;fill:var(--text2);pointer-events:none}#midconfig input{-webkit-appearance:none;-moz-appearance:none;appearance:none}#midconfig input[type=checkbox]{display:none}#midconfig input[type=checkbox]+label{cursor:pointer}#midconfig input[type=checkbox]+label>svg.midconfig-svg-checkmark{width:16px;height:16px;min-width:16px;min-height:16px;margin:2px;border:2px solid var(--text3);border-radius:4px;fill:rgba(0,0,0,0);transition-property:background-color,border}#midconfig input[type=checkbox]:checked+label>svg.midconfig-svg-checkmark{background-color:var(--accent1);border:none;fill:var(--accent-text)}#midconfig .midconfig-select-container{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;position:relative}#midconfig .midconfig-select-container>select{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:100%;height:100%}#midconfig .midconfig-select-container>select:focus{outline:none}#midconfig .midconfig-select-container>svg.midconfig-svg-arrow-down{position:absolute;top:3px;right:3px;width:24px;height:24px;min-width:24px;min-height:24px}#midconfig .midconfig-button-container{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;width:100%}#midconfig .midconfig-button-container__disable>.midconfig-button,#midconfig .midconfig-button-container.midconfig-button-empty>.midconfig-button{opacity:.25;pointer-events:none}#midconfig .midconfig-button{display:inline-block;width:inherit;height:30px;line-height:30px;text-align:center;background-color:var(--back1);border-radius:8px;cursor:pointer}#midconfig .midconfig-button:hover{filter:opacity(0.7)}#midconfig .midconfig-button:hover:active{filter:opacity(0.5)}#midconfig .midconfig-button--solid{color:var(--accent1)}#midconfig .midconfig-button--outline{line-height:28px;color:var(--accent1);border:1px solid var(--accent1)}#midconfig .midconfig-button--outline:hover{color:var(--accent-text);background-color:var(--accent1);filter:none}#midconfig .midconfig-button--outline:hover:active{filter:opacity(0.7)}#midconfig .midconfig-button--fill-alpha{color:var(--accent1);background-color:var(--accent2)}#midconfig .midconfig-button--fill{color:var(--accent-text);background-color:var(--accent1)}#midconfig .midconfig-button--solid-red{color:var(--red1)}#midconfig .midconfig-button--outline-red{line-height:28px;color:var(--red1);border:1px solid var(--red1)}#midconfig .midconfig-button--outline-red:hover{color:#fff;background-color:var(--red1);filter:none}#midconfig .midconfig-button--outline-red:hover:active{filter:opacity(0.7)}#midconfig .midconfig-button--fill-alpha-red{color:var(--red1);background-color:var(--red2)}#midconfig .midconfig-button--fill-red{color:#fff;background-color:var(--red1)}#midconfig>*{width:100%}#midconfig .midconfig-tab{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px;padding:5px 5px 0;border-bottom:1px solid var(--text3)}#midconfig .midconfig-tab>.midconfig-tab-item{display:inline-block;width:inherit;height:30px;line-height:30px;padding:0 0 5px;text-align:center;color:var(--text2);cursor:pointer;box-sizing:content-box}#midconfig .midconfig-tab>.midconfig-tab-item::after{content:"";display:block;position:relative;top:1px;width:100%;height:4px;background-color:var(--accent1);border-radius:2px;opacity:0}#midconfig .midconfig-tab>.midconfig-tab-item__selected{font-weight:600;color:var(--accent1)}#midconfig .midconfig-tab>.midconfig-tab-item__selected::after{opacity:1}#midconfig .midconfig-main{height:100%;padding:10px 8px 10px 10px;overflow-y:scroll}#midconfig .midconfig-main>.midconfig-page-item{display:none}#midconfig .midconfig-main>.midconfig-page-item__selected{display:flex;flex-direction:column;flex-wrap:nowrap;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-header{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;justify-content:space-between;height:30px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-header>svg.midconfig-svg-arrow-down{width:30px;height:inherit;max-width:30px;max-height:30px;min-width:30px;min-height:30px;transform:scale(-1, -1)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-items{display:flex;flex-direction:column;flex-wrap:nowrap;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group>.midconfig-group-items>.midconfig-item>.midconfig-label-container{padding-left:15px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group.midconfig-accordion>.midconfig-group-header{cursor:pointer}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group.midconfig-accordion__close>.midconfig-group-header>svg.midconfig-svg-arrow-down{transform:scale(1, 1)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-group.midconfig-accordion__close>.midconfig-group-items{display:none}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;justify-content:space-between;gap:5px;height:30px;overflow:hidden}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item:not(.midconfig-item-checkbox)>*{width:50%;overflow:hidden}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>*{width:100%;height:inherit}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>*>*{width:100%;height:inherit}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-label-container>label{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=text]:focus{outline:none;border-color:var(--accent1)}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]{width:30px;height:30px;min-width:30px;min-height:30px;border:none;border-radius:50%;overflow:hidden;cursor:pointer}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-webkit-color-swatch-wrapper{padding:0}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-moz-color-swatch-wrapper{padding:0}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-webkit-color-swatch{border:1px solid var(--text3);border-radius:50%}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=color]::-moz-color-swatch{border:1px solid var(--text3);border-radius:50%}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]{width:65%;height:6px;background:linear-gradient(90deg, var(--accent1) var(--range-progress, 0), var(--text3) var(--range-progress, 0));border-radius:3px;transition:none}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:12px;height:12px;background-color:var(--accent1);border-radius:6px;border:none;cursor:ew-resize}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]::-moz-range-thumb{-moz-appearance:none;appearance:none;width:12px;height:12px;background-color:var(--accent1);border-radius:6px;border:none;cursor:ew-resize}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item>.midconfig-input-container>input[type=range]+input[type=text]{width:35%;padding:0;text-align:center}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item.midconfig-button-container>.midconfig-label-container{width:100%}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item.midconfig-button-container>.midconfig-button{max-width:120px;min-width:90px}#midconfig .midconfig-main>.midconfig-page-item .midconfig-item__disable>.midconfig-input-container{opacity:.25;pointer-events:none}#midconfig .midconfig-main>.midconfig-page-item .midconfig-divider{display:block;width:100%;height:1px;background-color:var(--text3);margin:2px 0}#midconfig .midconfig-bottom{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:5px;padding:5px;border-top:1px solid var(--text3)}';

;// CONCATENATED MODULE: ./src/util.ts
const escapeHTML = (html) => {
    if (typeof html !== 'string') {
        return html;
    }
    return html.replace(/[&'`"<>]/g, (match) => {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match] || match;
    });
};
const setTextWithTitle = (elem, text) => {
    elem.textContent = text;
    elem.addEventListener('mouseover', ({ target }) => {
        if (target instanceof HTMLElement) {
            if (0 < target.scrollWidth - target.offsetWidth) {
                target.title = target.textContent || '';
            }
            else {
                target.title = '';
            }
        }
    });
};
const fullWidthToHalfWidth = (str) => {
    return str
        .replace('＃', '#')
        .replace(/[ａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
};
const generateUID = (len = 10) => {
    const str = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
    return `${Array.from(Array(len)).map(() => str[Math.random() * str.length | 0]).join('')}-${Date.now()}`;
};
const isColorCode = (hex) => {
    return /^#?[a-fA-F0-9]{6}$/.test(hex);
};

;// CONCATENATED MODULE: ./src/Items/Item.ts
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Item_initData, _Item_uid, _Item_value, _Item_labalContainer, _Item_inputContainer, _Item_inputCheckbox;


class Item extends HTMLElement {
    constructor(initData) {
        super();
        _Item_initData.set(this, void 0);
        _Item_uid.set(this, void 0);
        _Item_value.set(this, void 0);
        _Item_labalContainer.set(this, void 0);
        _Item_inputContainer.set(this, void 0);
        _Item_inputCheckbox.set(this, null);
        __classPrivateFieldSet(this, _Item_initData, initData, "f");
        __classPrivateFieldSet(this, _Item_uid, `midconfig-${generateUID()}`, "f");
        __classPrivateFieldSet(this, _Item_value, initData.default, "f");
        this.classList.add(Item.NAME);
        this.classList.add(this.tagName.toLowerCase());
        __classPrivateFieldSet(this, _Item_labalContainer, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _Item_labalContainer, "f").classList.add('midconfig-label-container');
        // ラベル
        const label = document.createElement('label');
        const span = document.createElement('span');
        setTextWithTitle(span, initData.label);
        label.appendChild(span);
        __classPrivateFieldGet(this, _Item_labalContainer, "f").insertAdjacentElement('beforeend', label);
        // チェックボックス
        if (initData.withCheckBox === true) {
            label.setAttribute('for', __classPrivateFieldGet(this, _Item_uid, "f"));
            label.insertAdjacentHTML('afterbegin', SVG_CHECKMARK);
            __classPrivateFieldSet(this, _Item_inputCheckbox, document.createElement('input'), "f");
            __classPrivateFieldGet(this, _Item_inputCheckbox, "f").type = 'checkbox';
            __classPrivateFieldGet(this, _Item_inputCheckbox, "f").id = __classPrivateFieldGet(this, _Item_uid, "f");
            __classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked = Boolean(initData.checked);
            if (!this.checked) {
                this.classList.add(`${Item.NAME}__disable`);
            }
            __classPrivateFieldGet(this, _Item_inputCheckbox, "f").addEventListener('change', () => {
                if (this.checked) {
                    this.classList.remove(`${Item.NAME}__disable`);
                }
                else {
                    this.classList.add(`${Item.NAME}__disable`);
                }
                if (typeof __classPrivateFieldGet(this, _Item_initData, "f").onChange === 'function') {
                    __classPrivateFieldGet(this, _Item_initData, "f").onChange({
                        target: this,
                        id: __classPrivateFieldGet(this, _Item_initData, "f").id,
                        value: null,
                        checked: this.checked,
                    });
                }
            });
            __classPrivateFieldGet(this, _Item_labalContainer, "f").insertAdjacentElement('afterbegin', __classPrivateFieldGet(this, _Item_inputCheckbox, "f"));
        }
        __classPrivateFieldSet(this, _Item_inputContainer, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _Item_inputContainer, "f").classList.add('midconfig-input-container');
        this.appendChild(__classPrivateFieldGet(this, _Item_labalContainer, "f"));
        this.appendChild(__classPrivateFieldGet(this, _Item_inputContainer, "f"));
    }
    get initData() { return __classPrivateFieldGet(this, _Item_initData, "f"); }
    get uid() { return __classPrivateFieldGet(this, _Item_uid, "f"); }
    get value() { return __classPrivateFieldGet(this, _Item_value, "f"); }
    get checked() {
        if (__classPrivateFieldGet(this, _Item_inputCheckbox, "f") !== null) {
            return __classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked;
        }
        else {
            return null;
        }
    }
    get labalContainer() { return __classPrivateFieldGet(this, _Item_labalContainer, "f"); }
    get inputContainer() { return __classPrivateFieldGet(this, _Item_inputContainer, "f"); }
    get inputCheckbox() { return __classPrivateFieldGet(this, _Item_inputCheckbox, "f"); }
    set checked(data) {
        if (typeof data === 'boolean' &&
            __classPrivateFieldGet(this, _Item_inputCheckbox, "f") !== null) {
            if (data === __classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked) {
                return;
            }
            __classPrivateFieldGet(this, _Item_inputCheckbox, "f").checked = data;
            if (this.checked) {
                this.classList.remove(`${Item.NAME}__disable`);
            }
            else {
                this.classList.add(`${Item.NAME}__disable`);
            }
            if (typeof __classPrivateFieldGet(this, _Item_initData, "f").onChange === 'function') {
                __classPrivateFieldGet(this, _Item_initData, "f").onChange({
                    target: this,
                    id: __classPrivateFieldGet(this, _Item_initData, "f").id,
                    value: null,
                    checked: this.checked,
                });
            }
        }
    }
    set _value(data) {
        if (typeof data === 'string' ||
            typeof data === 'number' ||
            typeof data === 'boolean') {
            if (data === __classPrivateFieldGet(this, _Item_value, "f")) {
                return;
            }
            __classPrivateFieldSet(this, _Item_value, data, "f");
            if (typeof __classPrivateFieldGet(this, _Item_initData, "f").onChange === 'function') {
                __classPrivateFieldGet(this, _Item_initData, "f").onChange({
                    target: this,
                    id: __classPrivateFieldGet(this, _Item_initData, "f").id,
                    value: __classPrivateFieldGet(this, _Item_value, "f"),
                    checked: this.checked,
                });
            }
        }
    }
    getValue() { return this.value; }
    setValue(data) {
        if (typeof data === 'string' ||
            typeof data === 'number' ||
            typeof data === 'boolean') {
            this._value = data;
        }
    }
    getData() {
        return {
            checked: this.checked,
            value: this.value,
            default: __classPrivateFieldGet(this, _Item_initData, "f").default,
        };
    }
    setData(data) {
        this.setValue(data.value);
        this.checked = data.checked;
    }
    reset() {
        this.setValue(__classPrivateFieldGet(this, _Item_initData, "f").default);
        this.checked = Boolean(__classPrivateFieldGet(this, _Item_initData, "f").checked);
    }
}
_Item_initData = new WeakMap(), _Item_uid = new WeakMap(), _Item_value = new WeakMap(), _Item_labalContainer = new WeakMap(), _Item_inputContainer = new WeakMap(), _Item_inputCheckbox = new WeakMap();
Item.NAME = 'midconfig-item';
// customElements.define(Item.NAME, Item)
customElements.constructor.prototype.define.call(customElements, Item.NAME, Item);
/* harmony default export */ const Items_Item = (Item);

;// CONCATENATED MODULE: ./src/Items/Text.ts
var Text_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Text_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Text_inputText;

class Text extends Items_Item {
    constructor(initData, option) {
        super(initData);
        _Text_inputText.set(this, void 0);
        Text_classPrivateFieldSet(this, _Text_inputText, document.createElement('input'), "f");
        Text_classPrivateFieldGet(this, _Text_inputText, "f").type = 'text';
        Text_classPrivateFieldGet(this, _Text_inputText, "f").value = initData.default;
        Text_classPrivateFieldGet(this, _Text_inputText, "f").spellcheck = false;
        Text_classPrivateFieldGet(this, _Text_inputText, "f").setAttribute('autocorrect', 'off');
        if (typeof option?.maxlength === 'number') {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").maxLength = option.maxlength;
        }
        if (typeof option?.minlength === 'number') {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").minLength = option.minlength;
        }
        if (typeof option?.placeholder === 'string') {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").placeholder = option.placeholder;
        }
        else {
            Text_classPrivateFieldGet(this, _Text_inputText, "f").placeholder = initData.default;
        }
        Text_classPrivateFieldGet(this, _Text_inputText, "f").addEventListener('change', () => {
            this.setValue(Text_classPrivateFieldGet(this, _Text_inputText, "f").value);
        });
        this.inputContainer.appendChild(Text_classPrivateFieldGet(this, _Text_inputText, "f"));
    }
    setValue(data) {
        if (typeof data === 'number') {
            data = data.toString();
        }
        if (typeof data === 'string') {
            data = data.trim();
            Text_classPrivateFieldGet(this, _Text_inputText, "f").value = data;
            this._value = data;
        }
    }
}
_Text_inputText = new WeakMap();
// customElements.define('midconfig-item-text', Text)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-text', Text);
/* harmony default export */ const Items_Text = (Text);

;// CONCATENATED MODULE: ./src/Items/CheckBox.ts

class CheckBox extends Items_Item {
    constructor(initData) {
        initData.withCheckBox = true;
        initData.checked || (initData.checked = initData.default);
        super(initData);
        this.inputContainer.remove();
    }
    get value() { return Boolean(this.inputCheckbox?.checked); }
    setValue(data) {
        if (typeof data === 'boolean' &&
            this.inputCheckbox !== null) {
            this.inputCheckbox.checked = data;
            this._value = data;
        }
    }
}
// customElements.define('midconfig-item-checkbox', CheckBox)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-checkbox', CheckBox);
/* harmony default export */ const Items_CheckBox = (CheckBox);

;// CONCATENATED MODULE: ./src/Items/Color.ts
var Color_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Color_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Color_inputColor, _Color_inputText;


class Color extends Items_Item {
    constructor(initData, option) {
        super(initData);
        _Color_inputColor.set(this, void 0);
        _Color_inputText.set(this, void 0);
        initData.default = initData.default.toUpperCase();
        Color_classPrivateFieldSet(this, _Color_inputColor, document.createElement('input'), "f");
        Color_classPrivateFieldGet(this, _Color_inputColor, "f").type = 'color';
        Color_classPrivateFieldGet(this, _Color_inputColor, "f").value = initData.default;
        Color_classPrivateFieldSet(this, _Color_inputText, document.createElement('input'), "f");
        Color_classPrivateFieldGet(this, _Color_inputText, "f").type = 'text';
        Color_classPrivateFieldGet(this, _Color_inputText, "f").value = initData.default;
        Color_classPrivateFieldGet(this, _Color_inputText, "f").spellcheck = false;
        Color_classPrivateFieldGet(this, _Color_inputText, "f").setAttribute('autocorrect', 'off');
        Color_classPrivateFieldGet(this, _Color_inputText, "f").maxLength = 7;
        Color_classPrivateFieldGet(this, _Color_inputText, "f").minLength = 6;
        if (typeof option?.placeholder === 'string') {
            Color_classPrivateFieldGet(this, _Color_inputText, "f").placeholder = option.placeholder;
        }
        else {
            Color_classPrivateFieldGet(this, _Color_inputText, "f").placeholder = initData.default;
        }
        const changeHandler = ({ target }) => {
            if (target instanceof HTMLInputElement) {
                if (target.value === '') {
                    target.value = this.initData.default;
                }
                target.value = fullWidthToHalfWidth(target.value);
                this.setValue(target.value);
            }
        };
        Color_classPrivateFieldGet(this, _Color_inputColor, "f").addEventListener('change', changeHandler);
        Color_classPrivateFieldGet(this, _Color_inputText, "f").addEventListener('change', changeHandler);
        this.inputContainer.appendChild(Color_classPrivateFieldGet(this, _Color_inputColor, "f"));
        this.inputContainer.appendChild(Color_classPrivateFieldGet(this, _Color_inputText, "f"));
    }
    setValue(data) {
        if (typeof data === 'string') {
            data = data.trim().toUpperCase();
            if (!isColorCode(data)) {
                data = this.initData.default;
            }
            if (!data.startsWith('#')) {
                data = `#${data}`;
            }
            Color_classPrivateFieldGet(this, _Color_inputColor, "f").value = data;
            Color_classPrivateFieldGet(this, _Color_inputText, "f").value = data;
            this._value = data;
        }
    }
}
_Color_inputColor = new WeakMap(), _Color_inputText = new WeakMap();
// customElements.define('midconfig-item-color', Color)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-color', Color);
/* harmony default export */ const Items_Color = (Color);

;// CONCATENATED MODULE: ./src/Items/Range.ts
var Range_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Range_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Range_inputRange, _Range_inputText;


class Range extends Items_Item {
    constructor(initData, option) {
        super(initData);
        _Range_inputRange.set(this, void 0);
        _Range_inputText.set(this, void 0);
        Range_classPrivateFieldSet(this, _Range_inputRange, document.createElement('input'), "f");
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").type = 'range';
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").value = initData.default.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").max = option.max.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").min = option.min.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").step = option.step.toString();
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").style.setProperty('--range-progress', `${(initData.default - option.min) / (option.max - option.min) * 100}%`);
        Range_classPrivateFieldSet(this, _Range_inputText, document.createElement('input'), "f");
        Range_classPrivateFieldGet(this, _Range_inputText, "f").type = 'text';
        Range_classPrivateFieldGet(this, _Range_inputText, "f").value = initData.default.toString();
        Range_classPrivateFieldGet(this, _Range_inputText, "f").spellcheck = false;
        Range_classPrivateFieldGet(this, _Range_inputText, "f").setAttribute('autocorrect', 'off');
        Range_classPrivateFieldGet(this, _Range_inputText, "f").maxLength = (option.max + option.step).toString().length;
        if (typeof option.placeholder === 'string') {
            Range_classPrivateFieldGet(this, _Range_inputText, "f").placeholder = option.placeholder;
        }
        else {
            Range_classPrivateFieldGet(this, _Range_inputText, "f").placeholder = initData.default.toString();
        }
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").addEventListener('input', () => {
            Range_classPrivateFieldGet(this, _Range_inputRange, "f").style.setProperty('--range-progress', `${(Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").value) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) / (Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").max) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) * 100}%`);
            Range_classPrivateFieldGet(this, _Range_inputText, "f").value = Range_classPrivateFieldGet(this, _Range_inputRange, "f").value;
        });
        const changeHandler = ({ target }) => {
            if (target instanceof HTMLInputElement) {
                if (target.value === '') {
                    target.value = this.initData.default;
                }
                target.value = fullWidthToHalfWidth(target.value);
                this.setValue(target.value);
            }
        };
        Range_classPrivateFieldGet(this, _Range_inputRange, "f").addEventListener('change', changeHandler);
        Range_classPrivateFieldGet(this, _Range_inputText, "f").addEventListener('change', changeHandler);
        this.inputContainer.appendChild(Range_classPrivateFieldGet(this, _Range_inputRange, "f"));
        this.inputContainer.appendChild(Range_classPrivateFieldGet(this, _Range_inputText, "f"));
    }
    setValue(data) {
        if (typeof data === 'string') {
            data = Number(data);
        }
        if (Number.isNaN(data)) {
            data = this.initData.default;
        }
        if (typeof data === 'number' &&
            data <= Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").max) &&
            Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min) <= data) {
            Range_classPrivateFieldGet(this, _Range_inputRange, "f").value = data.toString();
            Range_classPrivateFieldGet(this, _Range_inputText, "f").value = data.toString();
            Range_classPrivateFieldGet(this, _Range_inputRange, "f").style.setProperty('--range-progress', `${(Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").value) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) / (Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").max) - Number(Range_classPrivateFieldGet(this, _Range_inputRange, "f").min)) * 100}%`);
            this._value = data;
        }
    }
}
_Range_inputRange = new WeakMap(), _Range_inputText = new WeakMap();
// customElements.define('midconfig-item-range', Range)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-range', Range);
/* harmony default export */ const Items_Range = (Range);

;// CONCATENATED MODULE: ./src/Items/Select.ts
var Select_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Select_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Select_select, _Select_options;


class Select extends Items_Item {
    constructor(initData, options) {
        super(initData);
        _Select_select.set(this, void 0);
        _Select_options.set(this, []);
        const selectContainer = document.createElement('div');
        selectContainer.classList.add('midconfig-select-container');
        Select_classPrivateFieldSet(this, _Select_select, document.createElement('select'), "f");
        for (const { text, value } of options) {
            const option = document.createElement('option');
            option.text = text;
            option.value = value;
            if (value === initData.default) {
                option.selected = true;
            }
            Select_classPrivateFieldGet(this, _Select_select, "f").appendChild(option);
            Select_classPrivateFieldGet(this, _Select_options, "f").push(option);
        }
        Select_classPrivateFieldGet(this, _Select_select, "f").addEventListener('change', () => {
            this.setValue(Select_classPrivateFieldGet(this, _Select_select, "f").value);
        });
        selectContainer.appendChild(Select_classPrivateFieldGet(this, _Select_select, "f"));
        selectContainer.insertAdjacentHTML('beforeend', SVG_ARROW_DOWN);
        this.inputContainer.appendChild(selectContainer);
    }
    setValue(data) {
        if (typeof data === 'string') {
            data = data.trim();
            const targetOption = Select_classPrivateFieldGet(this, _Select_options, "f").find(v => v.value === data);
            if (targetOption !== void 0) {
                targetOption.selected = true;
                this._value = data;
            }
        }
    }
}
_Select_select = new WeakMap(), _Select_options = new WeakMap();
// customElements.define('midconfig-item-select', Select)
customElements.constructor.prototype.define.call(customElements, 'midconfig-item-select', Select);
/* harmony default export */ const Items_Select = (Select);

;// CONCATENATED MODULE: ./src/Items/Button.ts
var Button_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Button_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Button_initData, _Button_disable, _Button_labalContainer;

class Button extends HTMLElement {
    constructor(initData) {
        super();
        _Button_initData.set(this, void 0);
        _Button_disable.set(this, void 0);
        _Button_labalContainer.set(this, null);
        Button_classPrivateFieldSet(this, _Button_initData, initData, "f");
        this.disable = Boolean(initData.disable);
        this.classList.add('midconfig-item');
        this.classList.add(this.tagName.toLowerCase());
        if (typeof initData.label === 'string') {
            Button_classPrivateFieldSet(this, _Button_labalContainer, document.createElement('div'), "f");
            Button_classPrivateFieldGet(this, _Button_labalContainer, "f").classList.add('midconfig-label-container');
            const label = document.createElement('label');
            const span = document.createElement('span');
            setTextWithTitle(span, initData.label);
            label.appendChild(span);
            Button_classPrivateFieldGet(this, _Button_labalContainer, "f").appendChild(label);
            this.appendChild(Button_classPrivateFieldGet(this, _Button_labalContainer, "f"));
        }
        const button = document.createElement('div');
        button.classList.add('midconfig-button');
        button.classList.add(`midconfig-button--${initData.type}`);
        setTextWithTitle(button, initData.text);
        button.addEventListener('click', () => {
            Button_classPrivateFieldGet(this, _Button_initData, "f").onClick(Button_classPrivateFieldGet(this, _Button_initData, "f").id);
        });
        this.appendChild(button);
    }
    get initData() { return Button_classPrivateFieldGet(this, _Button_initData, "f"); }
    get disable() { return Button_classPrivateFieldGet(this, _Button_disable, "f"); }
    get labalContainer() { return Button_classPrivateFieldGet(this, _Button_labalContainer, "f"); }
    set disable(v) {
        Button_classPrivateFieldSet(this, _Button_disable, Boolean(v), "f");
        if (Button_classPrivateFieldGet(this, _Button_disable, "f")) {
            this.classList.add(`${Button.NAME}__disable`);
        }
        else {
            this.classList.remove(`${Button.NAME}__disable`);
        }
    }
}
_Button_initData = new WeakMap(), _Button_disable = new WeakMap(), _Button_labalContainer = new WeakMap();
Button.NAME = 'midconfig-button-container';
// customElements.define(Button.NAME, Button)
customElements.constructor.prototype.define.call(customElements, Button.NAME, Button);
/* harmony default export */ const Items_Button = (Button);

;// CONCATENATED MODULE: ./src/Items/ButtonEmpty.ts

class ButtonEmpty extends Items_Button {
    constructor() {
        super({
            id: '',
            text: '',
            type: 'solid',
            // disable: true,
            onClick: () => null,
        });
        this.classList.add('midconfig-button-container');
    }
}
ButtonEmpty.NAME = 'midconfig-button-empty';
// customElements.define(ButtonEmpty.NAME, ButtonEmpty)
customElements.constructor.prototype.define.call(customElements, ButtonEmpty.NAME, ButtonEmpty);
/* harmony default export */ const Items_ButtonEmpty = (ButtonEmpty);

;// CONCATENATED MODULE: ./src/Items/Divider.ts
class Divider extends HTMLElement {
    constructor() {
        super();
        this.classList.add(this.tagName.toLowerCase());
    }
}
Divider.NAME = 'midconfig-divider';
// customElements.define(Divider.NAME, Divider)
customElements.constructor.prototype.define.call(customElements, Divider.NAME, Divider);
/* harmony default export */ const Items_Divider = (Divider);

;// CONCATENATED MODULE: ./src/Items/Group.ts
var Group_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var Group_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Group_initData, _Group_isOpen;



class Group extends HTMLElement {
    constructor(initData) {
        super();
        _Group_initData.set(this, void 0);
        _Group_isOpen.set(this, void 0);
        Group_classPrivateFieldSet(this, _Group_initData, initData, "f");
        Group_classPrivateFieldSet(this, _Group_isOpen, Boolean(initData.isAccordionOpen), "f");
        this.classList.add(Group.NAME);
        // ヘッダー
        const header = document.createElement('div');
        header.classList.add(`${Group.NAME}-header`);
        const span = document.createElement('span');
        setTextWithTitle(span, initData.label);
        header.appendChild(span);
        // アイテム
        const items = document.createElement('div');
        items.classList.add(`${Group.NAME}-items`);
        for (const item of initData.items) {
            items.appendChild(item);
        }
        if (initData.isAccordion) {
            this.classList.add('midconfig-accordion');
            if (!Group_classPrivateFieldGet(this, _Group_isOpen, "f")) {
                this.classList.add('midconfig-accordion__close');
            }
            header.insertAdjacentHTML('beforeend', SVG_ARROW_DOWN);
            header.addEventListener('click', () => Group_classPrivateFieldGet(this, _Group_isOpen, "f") ? this.close() : this.open());
        }
        this.appendChild(header);
        this.appendChild(items);
    }
    get initData() { return Group_classPrivateFieldGet(this, _Group_initData, "f"); }
    get isOpen() { return Group_classPrivateFieldGet(this, _Group_isOpen, "f"); }
    open() {
        Group_classPrivateFieldSet(this, _Group_isOpen, true, "f");
        this.classList.remove('midconfig-accordion__close');
    }
    close() {
        Group_classPrivateFieldSet(this, _Group_isOpen, false, "f");
        this.classList.add('midconfig-accordion__close');
    }
    getData() {
        const data = {};
        Group_classPrivateFieldGet(this, _Group_initData, "f").items.forEach(item => {
            if (item instanceof Items_Item) {
                data[item.initData.id] = item.getData();
            }
        });
        return data;
    }
    setData(values) {
        Object.keys(values).forEach(id => {
            Group_classPrivateFieldGet(this, _Group_initData, "f").items.forEach(item => {
                if (item instanceof Items_Item &&
                    item.initData.id === id) {
                    item.setData(values[id]);
                }
            });
        });
    }
    reset() {
        Group_classPrivateFieldGet(this, _Group_initData, "f").items.forEach(v => v instanceof Items_Item && v.reset());
    }
}
_Group_initData = new WeakMap(), _Group_isOpen = new WeakMap();
Group.NAME = 'midconfig-group';
// customElements.define(Group.NAME, Group)
customElements.constructor.prototype.define.call(customElements, Group.NAME, Group);
/* harmony default export */ const Items_Group = (Group);

;// CONCATENATED MODULE: ./src/Items/index.ts


// import TextArea from './TextArea'










;// CONCATENATED MODULE: ./src/index.ts
var src_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var src_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Panel_initData, _Panel_shadowInner, _Panel_tab, _Panel_main, _Panel_bottom;




class Panel extends HTMLElement {
    constructor(initData, isDev) {
        super();
        _Panel_initData.set(this, void 0);
        _Panel_shadowInner.set(this, null);
        _Panel_tab.set(this, void 0);
        _Panel_main.set(this, void 0);
        _Panel_bottom.set(this, void 0);
        src_classPrivateFieldSet(this, _Panel_initData, initData, "f");
        this.classList.add(Panel.NAME);
        src_classPrivateFieldSet(this, _Panel_tab, document.createElement('div'), "f");
        src_classPrivateFieldGet(this, _Panel_tab, "f").classList.add('midconfig-tab');
        src_classPrivateFieldSet(this, _Panel_main, document.createElement('div'), "f");
        src_classPrivateFieldGet(this, _Panel_main, "f").classList.add('midconfig-main');
        src_classPrivateFieldSet(this, _Panel_bottom, document.createElement('div'), "f");
        src_classPrivateFieldGet(this, _Panel_bottom, "f").classList.add('midconfig-bottom');
        initData.tabs.forEach((tab, idx) => {
            const tabItem = document.createElement('div');
            tabItem.classList.add('midconfig-tab-item');
            setTextWithTitle(tabItem, tab.label);
            const pageItem = document.createElement('div');
            pageItem.classList.add('midconfig-page-item');
            tab.child.forEach(item => pageItem.appendChild(item));
            if (idx === 0) {
                tabItem.classList.add('midconfig-tab-item__selected');
                pageItem.classList.add('midconfig-page-item__selected');
            }
            tabItem.addEventListener('click', () => {
                Array.from(src_classPrivateFieldGet(this, _Panel_tab, "f").children).forEach(item => {
                    item.classList.remove('midconfig-tab-item__selected');
                });
                tabItem.classList.add('midconfig-tab-item__selected');
                Array.from(src_classPrivateFieldGet(this, _Panel_main, "f").children).forEach(page => {
                    page.classList.remove('midconfig-page-item__selected');
                });
                pageItem.classList.add('midconfig-page-item__selected');
            });
            src_classPrivateFieldGet(this, _Panel_tab, "f").appendChild(tabItem);
            src_classPrivateFieldGet(this, _Panel_main, "f").appendChild(pageItem);
        });
        initData.buttons.forEach(button => {
            delete button.initData.label;
            button.labalContainer?.remove();
            src_classPrivateFieldGet(this, _Panel_bottom, "f").appendChild(button);
        });
        if (!Boolean(isDev)) {
            src_classPrivateFieldSet(this, _Panel_shadowInner, document.createElement('div'), "f");
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").id = 'midconfig';
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").appendChild(src_classPrivateFieldGet(this, _Panel_tab, "f"));
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").appendChild(src_classPrivateFieldGet(this, _Panel_main, "f"));
            src_classPrivateFieldGet(this, _Panel_shadowInner, "f").appendChild(src_classPrivateFieldGet(this, _Panel_bottom, "f"));
            const shadow = this.attachShadow({ mode: 'closed' });
            shadow.appendChild(src_classPrivateFieldGet(this, _Panel_shadowInner, "f"));
            const style = document.createElement('style');
            style.textContent = STYLE;
            shadow.appendChild(style);
        }
        else {
            this.id = 'midconfig';
            this.appendChild(src_classPrivateFieldGet(this, _Panel_tab, "f"));
            this.appendChild(src_classPrivateFieldGet(this, _Panel_main, "f"));
            this.appendChild(src_classPrivateFieldGet(this, _Panel_bottom, "f"));
            Panel.addStyle(STYLE);
        }
        this.style.display = isDev ? 'flex' : 'block';
        this.setTheme(initData.theme);
        this.load();
    }
    get initData() { return src_classPrivateFieldGet(this, _Panel_initData, "f"); }
    get key() { return `midconfig-${src_classPrivateFieldGet(this, _Panel_initData, "f").id}`; }
    /**
     * @param key `"{tabId} > {groupId | itemId} > {itemId}"`
     */
    getValue(key) {
        let result = void 0;
        const parsedKey = key.split('>').map(v => v.trim());
        if (parsedKey.length < 2 ||
            3 < parsedKey.length) {
            return result;
        }
        const data = this.getJSON().data;
        Object.keys(data).forEach(tabId => {
            if (tabId !== parsedKey[0]) {
                return;
            }
            const tab = data[tabId];
            Object.keys(tab).forEach(itemId => {
                if (itemId !== parsedKey[1]) {
                    return;
                }
                const item = tab[itemId];
                if (isConfigItemData(item)) {
                    result = item;
                }
                else {
                    Object.keys(item).forEach(id => {
                        if (id !== parsedKey[2]) {
                            return;
                        }
                        const groupItem = item[id];
                        if (isConfigItemData(groupItem)) {
                            result = groupItem;
                        }
                    });
                }
            });
        });
        return result;
    }
    getJSON() {
        const json = {
            version: src_classPrivateFieldGet(this, _Panel_initData, "f").version,
            data: {},
        };
        src_classPrivateFieldGet(this, _Panel_initData, "f").tabs.forEach(tab => {
            var _a, _b;
            (_a = json.data)[_b = tab.id] || (_a[_b] = {});
            tab.child.forEach(item => {
                if (item instanceof Items_Item ||
                    item instanceof Items_Group) {
                    json.data[tab.id][item.initData.id] = item.getData();
                }
            });
        });
        return json;
    }
    setJSON(json) {
        if (!isConfigJsonData(json)) {
            return false;
        }
        try {
            Object.keys(json.data).forEach(tabId => {
                const targetTab = src_classPrivateFieldGet(this, _Panel_initData, "f").tabs.filter(v => v.id === tabId);
                targetTab.forEach(tab => {
                    Object.keys(json.data[tabId]).forEach(itemId => {
                        const data = json.data[tabId][itemId];
                        const targetItem = tab.child.filter(item => {
                            if (item instanceof Items_Item ||
                                item instanceof Items_Group) {
                                return item.initData.id === itemId;
                            }
                        });
                        targetItem.forEach(item => {
                            if (isConfigItemData(data)) {
                                if (item instanceof Items_Item) {
                                    item.setData(data);
                                }
                            }
                            else {
                                if (item instanceof Items_Group) {
                                    item.setData(data);
                                }
                            }
                        });
                    });
                });
            });
            return true;
        }
        catch (e) {
            console.error(e);
        }
        return false;
    }
    save() {
        try {
            const value = JSON.stringify(this.getJSON());
            Panel.setValue(this.key, value);
        }
        catch (e) {
            console.error(e);
        }
    }
    load() {
        try {
            const value = Panel.getValue(this.key);
            if (typeof value === 'string') {
                this.setJSON(JSON.parse(value));
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    reset() {
        src_classPrivateFieldGet(this, _Panel_initData, "f").tabs.forEach(tab => {
            tab.child.forEach(item => {
                if (item instanceof Items_Item ||
                    item instanceof Items_Group) {
                    item.reset();
                }
            });
        });
        Panel.deleteValue(this.key);
    }
    export() {
        const value = JSON.stringify(this.getJSON());
        window.prompt('エクスポート', value);
    }
    setTheme(theme = 'auto') {
        if (['auto', 'light', 'dark'].includes(theme)) {
            (src_classPrivateFieldGet(this, _Panel_shadowInner, "f") || this).setAttribute('theme', theme);
        }
    }
    static getValue(key) {
        let result;
        let GMGetValue = null;
        try {
            // @ts-ignore
            GMGetValue || (GMGetValue = GM_getValue);
        }
        catch { }
        try {
            // @ts-ignore
            GMGetValue || (GMGetValue = GM && GM.getValue);
        }
        catch { }
        try {
            if (typeof GMGetValue === 'function') {
                result = GMGetValue(key);
            }
            else {
                result = window.localStorage.getItem(key);
            }
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }
    static setValue(key, value) {
        let GMSetValue = null;
        try {
            // @ts-ignore
            GMSetValue || (GMSetValue = GM_setValue);
        }
        catch { }
        try {
            // @ts-ignore
            GMSetValue || (GMSetValue = GM && GM.setValue);
        }
        catch { }
        try {
            if (typeof GMSetValue === 'function') {
                GMSetValue(key, value);
            }
            else {
                window.localStorage.setItem(key, value);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    static deleteValue(key) {
        let GMDeleteValue = null;
        try {
            // @ts-ignore
            GMDeleteValue || (GMDeleteValue = GM_deleteValue);
        }
        catch { }
        try {
            // @ts-ignore
            GMDeleteValue || (GMDeleteValue = GM && GM.deleteValue);
        }
        catch { }
        try {
            if (typeof GMDeleteValue === 'function') {
                GMDeleteValue(key);
            }
            else {
                window.localStorage.removeItem(key);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    static addStyle(style) {
        let GMAddStyle = null;
        try {
            // @ts-ignore
            GMAddStyle || (GMAddStyle = GM_addStyle);
        }
        catch { }
        try {
            // @ts-ignore
            GMAddStyle || (GMAddStyle = GM && GM.addStyle);
        }
        catch { }
        try {
            if (typeof GMAddStyle === 'function') {
                GMAddStyle(style);
            }
            else {
                const styleElem = document.createElement('style');
                styleElem.textContent = style;
                document.head.appendChild(styleElem);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
_Panel_initData = new WeakMap(), _Panel_shadowInner = new WeakMap(), _Panel_tab = new WeakMap(), _Panel_main = new WeakMap(), _Panel_bottom = new WeakMap();
Panel.NAME = 'midconfig-panel';
// customElements.define(Panel.NAME, Panel)
customElements.constructor.prototype.define.call(customElements, Panel.NAME, Panel);


;// CONCATENATED MODULE: ./output/index.ts

window['MidConfig'] = src_namespaceObject;

/******/ })()
;