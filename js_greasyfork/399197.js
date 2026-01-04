// ==UserScript==
// @name                'Doublesplit - 999999 in 1
// @name:ru             'Doublesplit - 999999 в 1
// @name:uk             'Doublesplit - 999999 в 1
// @name:ja             'デルタ - 999999 イン 1
// @name:es             'Doublesplit - 999999 en 1
// @name:zh-CN          'Doublesplit - 999999 合 1
// @name:de             'Doublesplit - 999999 in 1
// @name:ar             'دلتا - 999999 في 1
// @description         Doublesplit - Agario extension, with zoom, minimap, helpers, adblocker
// @description:es      Doublesplit - extensión para Agario con zoom, minimapa, ayudas y bloqueador de anuncios
// @description:ru      Doublesplit — расширение для Agario с зумом, миникартой, помощниками и блокировщиком рекламы
// @description:zh-CN   Doublesplit - agario 的扩展，带有缩放、小地图、辅助功能和广告拦截器
// @description:uk      Doublesplit — розширення для Agario із зумом, мінікартою, помічниками та блокувальником реклами
// @description:tr      Doublesplit - Agario için yakınlaştırma, mini harita, yardımcılar ve reklam engelleyici uzantısı
// @description:de      Doublesplit – Erweiterung für Agario mit Zoom, Minikarte, Helfern und Werbeblocker
// @description:ja      Doublesplit - Agario のズーム、ミニマップ、ヘルパー、広告ブロッカー付き拡張機能
// @description:pl      Doublesplit - rozszerzenie do Agario z powiększeniem, minimapą, pomocnikami i blokadą reklam
// @description:fr      Doublesplit - extension pour Agario avec zoom, mini-carte, assistants et bloqueur de publicité
// @description:ar      دلتا - إضافة لـ Agario مع مانع إعلانات
// @version             8.0.9
// @namespace           doublesplit.agar
// @author              neo
// @icon                https://deltav4.gitlab.io/favicon.ico
// @match               *://*.agar.io/
// @run-at              document-start
// @grant               GM.xmlHttpRequest
// @grant               GM.registerMenuCommand
// @grant               window.close
// @grant               unsafeWindow
// @license             MPL-2.0
// @antifeature         ads
// @source              https://github.com/doublesplit/lite-ext/
// @supportURL          https://discord.gg/HHmyKW6
// @require             https://cdnjs.cloudflare.com/ajax/libs/preact/10.21.0/preact.umd.min.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/preact/10.21.0/hooks.umd.min.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/preact/10.21.0/compat.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/399197/%27Doublesplit%20-%20999999%20in%201.user.js
// @updateURL https://update.greasyfork.org/scripts/399197/%27Doublesplit%20-%20999999%20in%201.meta.js
// ==/UserScript==

/*
  GREASYFORK VERSION

  en: If this user script does not start, write me a discord
  ru: Если данное расширение не запускается, напишите мне в дискорд
  https://discord.gg/HHmyKW6
 
*/

(function (window) {
/******/ // runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ var __webpack_modules__ = ({

/***/ 32:
/***/ ((module) => {

"use strict";
module.exports = preact;

/***/ }),

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {

"use strict";


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

/***/ 102:
/***/ ((module) => {

"use strict";


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

/***/ 113:
/***/ ((module) => {

"use strict";


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

/***/ 390:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Minimap: () => (/* binding */ Minimap)
/* harmony export */ });
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(632);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(701);
/* harmony import */ var _Contexts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(413);
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(557);
/* module decorator */ module = __webpack_require__.hmd(module);




function Minimap() {
  const app = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useContext)(_Contexts__WEBPACK_IMPORTED_MODULE_2__.AppContext);
  const [minimapEnabled, setMinimapEnabled] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useState)(_settings__WEBPACK_IMPORTED_MODULE_1__.settings.raw.Minimap.value);
  const $canvas = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const $sectors = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const $minimap = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const ctx = $canvas.current.getContext('2d');
    const sectors = $sectors.current.querySelectorAll('.sector');
    let sectorIndex = -1;
    let rafId;
    function render() {
      const sectorId = app.world.drawMinimap(ctx, $canvas.current, true);
      setSector(sectorId);
      rafId = requestAnimationFrame(render);
    }
    function setSector(index) {
      if (index === sectorIndex || index < 0) return;
      index = Math.min(index, sectors.length - 1);
      sectorIndex !== -1 && sectors[sectorIndex].classList.remove('active');
      sectors[index].classList.add('active');
      sectorIndex = index;
    }
    if (minimapEnabled) rafId = requestAnimationFrame(render);
    $minimap.current.style.display = minimapEnabled ? '' : 'none';
    const minimapListener = _settings__WEBPACK_IMPORTED_MODULE_1__.settings.on('Minimap', value => {
      setMinimapEnabled(value);
    });
    return () => {
      _settings__WEBPACK_IMPORTED_MODULE_1__.settings.removeListener('Minimap', minimapListener);
      cancelAnimationFrame(rafId);
    };
  }, [minimapEnabled]);
  return (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    ref: $minimap,
    id: "ds-minimap",
    style: {
      zIndex: 1000
    },
    children: [(0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      class: "background",
      ref: $sectors,
      children: [(0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "A1"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "A2"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "A3"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "A4"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "A5"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "B1"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "B2"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "B3"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "B4"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "B5"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "C1"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "C2"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "C3"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "C4"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "C5"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "D1"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "D2"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "D3"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "D4"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "D5"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "E1"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "E2"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "E3"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "E4"
      }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        class: "sector",
        children: "E5"
      })]
    }), (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("canvas", {
      id: "minimap",
      width: "200",
      height: "200",
      ref: $canvas
    })]
  });
}
if ('hot' in module) {
  // @ts-ignore
  module['hot'].accept();
}

/***/ }),

/***/ 397:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(653);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(102);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*! tailwindcss v4.1.4 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    --spacing: 0.25rem;
    --default-font-family: var(--font-sans);
    --default-mono-font-family: var(--font-mono);
  }
}
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html,
  :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
      -o-tab-size: 4;
         tab-size: 4;
    font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  samp,
  pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  :-moz-focusring {
    outline: auto;
  }
  progress {
    vertical-align: baseline;
  }
  summary {
    display: list-item;
  }
  ol,
  ul,
  menu {
    list-style: none;
  }
  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    display: block;
    vertical-align: middle;
  }
  img,
  video {
    max-width: 100%;
    height: auto;
  }
  button,
  input,
  select,
  optgroup,
  textarea,
  ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  :where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
  :where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
  ::file-selector-button {
    margin-inline-end: 4px;
  }
  ::-moz-placeholder {
    opacity: 1;
  }
  ::placeholder {
    opacity: 1;
  }
  @supports (not (-webkit-appearance: -apple-pay-button))  or
    (contain-intrinsic-size: 1px) {
    ::-moz-placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
  textarea {
    resize: vertical;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
  ::-webkit-datetime-edit {
    display: inline-flex;
  }
  ::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  ::-webkit-datetime-edit,
  ::-webkit-datetime-edit-year-field,
  ::-webkit-datetime-edit-month-field,
  ::-webkit-datetime-edit-day-field,
  ::-webkit-datetime-edit-hour-field,
  ::-webkit-datetime-edit-minute-field,
  ::-webkit-datetime-edit-second-field,
  ::-webkit-datetime-edit-millisecond-field,
  ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  button,
  input:where([type="button"], [type="reset"], [type="submit"]),
  ::file-selector-button {
    -webkit-appearance: button;
       -moz-appearance: button;
            appearance: button;
  }
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    height: auto;
  }
  [hidden]:where(:not([hidden="until-found"])) {
    display: none !important;
  }
}
@layer utilities {
  .absolute {
    position: absolute !important;
  }
  .fixed {
    position: fixed !important;
  }
  .relative {
    position: relative !important;
  }
  .static {
    position: static !important;
  }
  .mx-2 {
    margin-inline: calc(var(--spacing) * 2) !important;
  }
  .contents {
    display: contents !important;
  }
  .flex {
    display: flex !important;
  }
  .grid {
    display: grid !important;
  }
  .inline {
    display: inline !important;
  }
  .h-full {
    height: 100% !important;
  }
  .w-4 {
    width: calc(var(--spacing) * 4) !important;
  }
  .w-full {
    width: 100% !important;
  }
  .grow {
    flex-grow: 1 !important;
  }
  .transform {
    transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,) !important;
  }
  .resize {
    resize: both !important;
  }
  .flex-row {
    flex-direction: row !important;
  }
  .gap-2 {
    gap: calc(var(--spacing) * 2) !important;
  }
  .p-1 {
    padding: calc(var(--spacing) * 1) !important;
  }
  .text-left {
    text-align: left !important;
  }
}
*,
::after,
::before,
::backdrop,
::file-selector-button {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid;
}
html,
:host {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
    -o-tab-size: 4;
       tab-size: 4;
  font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji');
  font-feature-settings: var(--default-font-feature-settings, normal);
  font-variation-settings: var(--default-font-variation-settings, normal);
  -webkit-tap-highlight-color: transparent;
}
hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}
abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}
a {
  color: inherit;
  -webkit-text-decoration: inherit;
  text-decoration: inherit;
}
b,
strong {
  font-weight: bolder;
}
code,
kbd,
samp,
pre {
  font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
  font-feature-settings: var(--default-mono-font-feature-settings, normal);
  font-variation-settings: var(--default-mono-font-variation-settings, normal);
  font-size: 1em;
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
}
:-moz-focusring {
  outline: auto;
}
progress {
  vertical-align: baseline;
}
summary {
  display: list-item;
}
ol,
ul,
menu {
  list-style: none;
}
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  vertical-align: middle;
}
img,
video {
  max-width: 100%;
  height: auto;
}
button,
input,
select,
optgroup,
textarea,
::file-selector-button {
  font: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  letter-spacing: inherit;
  color: inherit;
  border-radius: 0;
  background-color: transparent;
  opacity: 1;
}
:where(select:is([multiple], [size])) optgroup {
  font-weight: bolder;
}
:where(select:is([multiple], [size])) optgroup option {
  padding-inline-start: 20px;
}
::file-selector-button {
  margin-inline-end: 4px;
}
::-moz-placeholder {
  opacity: 1;
}
::placeholder {
  opacity: 1;
}
@supports (not (-webkit-appearance: -apple-pay-button))  or
  (contain-intrinsic-size: 1px) {
  ::-moz-placeholder {
    color: currentcolor;
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, currentcolor 50%, transparent);
    }
  }
  ::placeholder {
    color: currentcolor;
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, currentcolor 50%, transparent);
    }
  }
}
textarea {
  resize: vertical;
}
::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-date-and-time-value {
  min-height: 1lh;
  text-align: inherit;
}
::-webkit-datetime-edit {
  display: inline-flex;
}
::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}
::-webkit-datetime-edit,
::-webkit-datetime-edit-year-field,
::-webkit-datetime-edit-month-field,
::-webkit-datetime-edit-day-field,
::-webkit-datetime-edit-hour-field,
::-webkit-datetime-edit-minute-field,
::-webkit-datetime-edit-second-field,
::-webkit-datetime-edit-millisecond-field,
::-webkit-datetime-edit-meridiem-field {
  padding-block: 0;
}
:-moz-ui-invalid {
  box-shadow: none;
}
button,
input:where([type='button'], [type='reset'], [type='submit']),
::file-selector-button {
  -webkit-appearance: button;
     -moz-appearance: button;
          appearance: button;
}
::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}
[hidden]:where(:not([hidden='until-found'])) {
  display: none !important;
}
:root {
  --bottom-banner-height: 0px !important;
}
#title {
  margin-top: 0 !important;
}
#mainui-play {
  height: 595px !important;
}
#mainPanel {
  display: flex;
  flex-direction: column;
  height: 100%;
}
#mainPanel #nick,
.input-addon {
  border: 1px solid #4e4e4e !important;
  padding-left: 10px;
}
#socialLoginContainer {
  position: initial !important;
}
#instructions {
  position: initial !important;
  display: none !important;
  overflow: hidden !important;
  flex-direction: column !important;
  margin: 0 !important;
}
.play-container {
  display: flex;
  height: 100%;
  padding: 0 !important;
}
#play {
  top: initial !important;
}
#nick {
  position: initial !important;
  left: initial !important;
  top: initial !important;
  float: initial !important;
}
#skinButton {
  position: relative !important;
  display: block;
  left: initial !important;
  width: 46px;
  height: 46px;
}
#playnick {
  position: initial !important;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
#socialLoginContainer {
  top: initial !important;
  margin: 4px 20px 0px 20px !important;
}
.guest {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menu-addon {
  gap: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menu-button {
  color: #fff;
  background-color: #54c800;
  border-color: #54c800;
  height: 34px;
  font-size: 20px;
  line-height: 1.5;
  padding: 0 0.5rem;
}
.menu-button:hover {
  filter: brightness(0.7) contrast(1);
}
.input-addon {
  width: 100%;
  height: 28px;
}
.circle {
  display: flex !important;
  flex-direction: column !important;
  position: absolute !important;
}
.plus-text {
  top: 0 !important;
  margin: auto;
}
.skinWrapper > img {
  left: 0 !important;
  top: 0 !important;
  height: 100% !important;
}
#settingsButton {
  left: 5px;
  position: absolute !important;
}
.circle {
  display: flex;
  justify-content: center;
}
.agario-panel {
  margin: 0 auto;
}
.tosBox {
  display: none !important;
}
#mcbanners {
  display: none !important;
}
.play-blocker img {
  margin: auto;
}
@property --tw-rotate-x {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-y {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-z {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-x {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-y {
  syntax: "*";
  inherits: false;
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --tw-rotate-x: initial;
      --tw-rotate-y: initial;
      --tw-rotate-z: initial;
      --tw-skew-x: initial;
      --tw-skew-y: initial;
    }
  }
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 413:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppContext: () => (/* binding */ AppContext)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(preact__WEBPACK_IMPORTED_MODULE_0__);

const AppContext = (0,preact__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

/***/ }),

/***/ 540:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 557:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fragment: () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   jsx: () => (/* binding */ u),
/* harmony export */   jsxs: () => (/* binding */ u)
/* harmony export */ });
/* unused harmony exports jsxAttr, jsxDEV, jsxEscape, jsxTemplate */
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(preact__WEBPACK_IMPORTED_MODULE_0__);


var t = /["&<]/;
function n(r) {
  if (0 === r.length || !1 === t.test(r)) return r;
  for (var e = 0, n = 0, o = "", f = ""; n < r.length; n++) {
    switch (r.charCodeAt(n)) {
      case 34:
        f = "&quot;";
        break;
      case 38:
        f = "&amp;";
        break;
      case 60:
        f = "&lt;";
        break;
      default:
        continue;
    }
    n !== e && (o += r.slice(e, n)), o += f, e = n + 1;
  }
  return n !== e && (o += r.slice(e, n)), o;
}
var o = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  f = 0,
  i = Array.isArray;
function u(e, t, n, o, i, u) {
  t || (t = {});
  var a,
    c,
    p = t;
  if ("ref" in p) for (c in p = {}, t) "ref" == c ? a = t[c] : p[c] = t[c];
  var l = {
    type: e,
    props: p,
    key: n,
    ref: a,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: --f,
    __i: -1,
    __u: 0,
    __source: i,
    __self: u
  };
  if ("function" == typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
  return preact__WEBPACK_IMPORTED_MODULE_0__.options.vnode && preact__WEBPACK_IMPORTED_MODULE_0__.options.vnode(l), l;
}
function a(r) {
  var t = u(e, {
    tpl: r,
    exprs: [].slice.call(arguments, 1)
  });
  return t.key = t.__v, t;
}
var c = {},
  p = /[A-Z]/g;
function l(e, t) {
  if (r.attr) {
    var f = r.attr(e, t);
    if ("string" == typeof f) return f;
  }
  if ("ref" === e || "key" === e) return "";
  if ("style" === e && "object" == typeof t) {
    var i = "";
    for (var u in t) {
      var a = t[u];
      if (null != a && "" !== a) {
        var l = "-" == u[0] ? u : c[u] || (c[u] = u.replace(p, "-$&").toLowerCase()),
          s = ";";
        "number" != typeof a || l.startsWith("--") || o.test(l) || (s = "px;"), i = i + l + ":" + a + s;
      }
    }
    return e + '="' + i + '"';
  }
  return null == t || !1 === t || "function" == typeof t || "object" == typeof t ? "" : !0 === t ? e : e + '="' + n(t) + '"';
}
function s(r) {
  if (null == r || "boolean" == typeof r || "function" == typeof r) return null;
  if ("object" == typeof r) {
    if (void 0 === r.constructor) return r;
    if (i(r)) {
      for (var e = 0; e < r.length; e++) r[e] = s(r[e]);
      return r;
    }
  }
  return n("" + r);
}


/***/ }),

/***/ 632:
/***/ ((module) => {

"use strict";
module.exports = preactHooks;

/***/ }),

/***/ 653:
/***/ ((module) => {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 659:
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
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

/***/ 701:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  settings: () => (/* binding */ settings)
});

// EXTERNAL MODULE: ./Shared/src/utils/Eventify.ts
var Eventify = __webpack_require__(714);
;// ./dev/src/Settngs.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class BasicSetting {
  constructor({
    path = 'DEFAULT',
    name = ''
  }) {
    this.exportable = true;
    this.type = 'NONE';
    this._value = null;
    this.default = null;
    this.path = path;
    this.name = name;
  }
  get value() {
    return this._value;
  }
  set value(data) {
    this._value = data;
  }
  setter(data) {
    this.value = data;
  }
  get export() {
    return this.value;
  }
}
class Settings extends Eventify.Eventify {
  constructor(descriptions) {
    super();
    this.raw = descriptions;
    const self = this;
    this.proxy = new Proxy(this.raw, {
      set: (target, prop, newValue) => {
        const previous = target[prop].value;
        self.emit('before*', prop, newValue); // before set
        target[prop].setter(newValue);
        try {
          newValue !== previous && self.emit.call(this, prop, newValue, previous); // on set
          newValue !== previous && self.emit('*', prop, newValue, previous); // on any
        } catch (message) {
          console.error(message);
        }
        return true;
      },
      get(target, prop) {
        return target[prop].value;
      }
    });
  }
  import(object) {
    if (!object) return;
    for (const option in this.raw) {
      if (this.raw.hasOwnProperty(option) && object.hasOwnProperty(option)) {
        this.proxy[option] = object[option];
      }
    }
  }
  export() {
    const export_data = {};
    for (const option in this.raw) {
      export_data[option] = this.raw[option].export;
    }
    return export_data;
  }
  restore() {
    for (const opt in this.raw) {
      const option = opt;
      if (this.raw.hasOwnProperty(option)) {
        this.proxy[option] = this.raw[option].default;
      }
    }
  }
}
;// ./dev/src/utils/microColor.ts
var _a;
class MicroColor {
  constructor(red = 255, green = 255, blue = 255, alpha = 255) {
    this.r = red;
    this.g = green;
    this.b = blue;
    this.a = alpha;
    this.vector = new Float32Array(4);
    this.bytes = new Uint8Array(4);
    this.dataview = new DataView(this.bytes.buffer);
    this.string = '#000000';
    this.int = 0;
    this.inta = 0;
    this.updVector();
    this.updString();
    this.updInt();
  }
  updVector() {
    this.vector[0] = this.r / 255;
    this.vector[1] = this.g / 255;
    this.vector[2] = this.b / 255;
    this.vector[3] = this.a / 255;
    this.bytes[0] = this.r;
    this.bytes[1] = this.g;
    this.bytes[2] = this.b;
    this.bytes[3] = this.a;
    this.float = this.dataview.getFloat32(0, true);
    this.u32 = this.r | this.g << 8 | this.b << 16 | this.a << 24;
    // for (let i = 0; i < 4; i++) {
    //     this.u32 |= this.bytes[i] << (8 * i);
    // }
  }
  updString() {
    this.string = this.toRgb(true);
  }
  updInt() {
    this.int = this.getInt();
    this.inta = this.getInta();
  }
  cloneFrom(t) {
    this.r = t.r;
    this.g = t.g;
    this.b = t.b;
    this.a = t.a;
    this.updVector();
    this.updString();
    return this;
  }
  fromHSL(h, s, l, a = 255) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(h / 60 % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (0 <= h && h < 60) {
      r = c, g = x, b = 0;
    } else if (60 <= h && h < 120) {
      r = x, g = c, b = 0;
    } else if (120 <= h && h < 180) {
      r = 0, g = c, b = x;
    } else if (180 <= h && h < 240) {
      r = 0, g = x, b = c;
    } else if (240 <= h && h < 300) {
      r = x, g = 0, b = c;
    } else if (300 <= h && h < 360) {
      r = c, g = 0, b = x;
    }
    // Having obtained RGB, convert channels to hex
    this.r = Math.round((r + m) * 255);
    this.g = Math.round((g + m) * 255);
    this.b = Math.round((b + m) * 255);
    this.a = a;
    return this;
  }
  fromRGB(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.updVector();
    this.updString();
    return this;
  }
  // fromINTA(int: number, alpha = 255) {
  //     const a = (int >> 24) & alpha;
  //     return this.fromINT(color);
  // }
  fromINT(int, reorder) {
    this.a = (4278190080 & int) >>> 24;
    this.r = (16711680 & int) >>> 16;
    this.g = (65280 & int) >>> 8;
    this.b = (255 & int) >>> 0;
    if (reorder) Object.assign(this, {
      r: this.a,
      g: this.r,
      b: this.g,
      a: this.b
    });
    this.updVector();
    this.updString();
    return this;
  }
  fromHex(hex) {
    const len = hex.length;
    if (!hex || len !== 7 && len !== 9) return this;
    let i = hex.length === 9 ? 32 : 24;
    const n = parseInt(hex.slice(1), 16);
    const r = n >> (i -= 8) & 255;
    const g = n >> (i -= 8) & 255;
    const b = n >> (i -= 8) & 255;
    const a = i ? n >> i - 8 & 255 : 255;
    return this.fromRGB(r, g, b, a);
  }
  get getNormalFromSecure() {
    return _a.rgbToInt(Math.ceil(this.r / 0.9), Math.ceil(this.g / 0.9), Math.ceil(this.b / 0.9));
  }
  toRgb(useAlpha) {
    return useAlpha ? `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})` : `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
  getHEXA() {
    let r = this.r.toString(16);
    let g = this.g.toString(16);
    let b = this.b.toString(16);
    let a = this.a.toString(16);
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    if (a.length == 1) a = '0' + a;
    return '#' + r + g + b + a;
  }
  getFloat() {
    const bits = this.a << 24 | this.b << 16 | this.g << 8 | this.r;
    return _a.pack(bits & 0xfeffffff);
  }
  getHEX() {
    return '#' + (16777216 | this.getInt()).toString(16).substring(1);
  }
  getInt() {
    return this.r << 16 | this.g << 8 | this.b;
  }
  getIntaShader(alpha) {
    return this.r | this.g << 8 | this.b << 16 | (alpha < 0 ? this.a : alpha) << 24;
  }
  getIntShader() {
    return this.r | this.g << 8 | this.b << 16;
  }
  getInta() {
    return this.a << 24 | this.r << 16 | this.g << 8 | this.b;
  }
  getSecureHex() {
    return _a.colorIntToHex(_a.rgbToInt(~~(this.r * 0.9), ~~(this.g * 0.9), ~~(this.b * 0.9)));
  }
  static rgbToInt(r, g, b) {
    return r << 16 | g << 8 | b;
  }
  static colorIntToHex(int) {
    let s = int.toString(16);
    for (; s.length < 6;) {
      s = '0' + s;
    }
    return '#' + s;
  }
  static inta2shader(int) {
    const a = (0xff000000 & int) >>> 24;
    const r = (0xff0000 & int) >>> 16;
    const g = (0xff00 & int) >>> 8;
    const b = (0xff & int) >>> 0;
    return r | g << 8 | b << 16 | a << 24;
  }
  toHEX8() {
    return `#${(16777216 | this.getInt()).toString(16).substring(1)}${this.a.toString(16).padStart(2, '0')}`;
  }
  static pack(i) {
    _a.int32[0] = i;
    return _a.float32[0];
  }
  static unpack(f) {
    _a.float32[0] = f;
    return _a.int32[0];
  }
  static darkenColor(color, percent) {
    const num = typeof color == 'string' ? parseInt(color, 16) : color,
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      B = (num >> 8 & 0x00ff) + amt,
      G = (num & 0x0000ff) + amt;
    return 255 << 24 | R << 16 | G << 8 | B;
  }
  static brighten(int, amount = 10) {
    const a = (4278190080 & int) >>> 24;
    let r = (16711680 & int) >>> 16;
    let g = (65280 & int) >>> 8;
    let b = (255 & int) >>> 0;
    r = Math.max(0, Math.min(255, r - Math.round(255 * -(amount / 100))));
    g = Math.max(0, Math.min(255, g - Math.round(255 * -(amount / 100))));
    b = Math.max(0, Math.min(255, b - Math.round(255 * -(amount / 100))));
    return a << 24 | r << 16 | g << 8 | b;
  }
  static multiplyAlpha(int, alpha) {
    return ((int >>> 24) * alpha & 0xff) << 24 | int & 0x00ffffff;
  }
}
_a = MicroColor;
(() => {
  _a.int8 = new Int8Array(4);
  _a.int32 = new Int32Array(_a.int8.buffer, 0, 1);
  _a.float32 = new Float32Array(_a.int8.buffer, 0, 1);
})();
MicroColor.temp = new _a();
MicroColor.isValidHex = hex => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
MicroColor.getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, 'g'));
MicroColor.convertHexUnitTo256 = hexStr => parseInt(hexStr.repeat(2 / hexStr.length), 16);
MicroColor.getAlphafloat = (a, alpha) => {
  if (typeof a !== 'undefined') {
    return a / 255;
  }
  if (typeof alpha != 'number' || alpha < 0 || alpha > 1) {
    return 1;
  }
  return alpha;
};
MicroColor.hexToRGBA = hex => {
  if (!_a.isValidHex(hex)) {
    throw new Error('Invalid HEX');
  }
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = _a.getChunksFromString(hex.slice(1), chunkSize);
  return hexArr.map(_a.convertHexUnitTo256);
};
/* harmony default export */ const microColor = (MicroColor);
;// ./dev/src/utils/microColorUtils.ts
let canvas;
let ctx;
function parseColorToInta(input) {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    ctx = canvas.getContext('2d');
  }
  if (!ctx) return 0;
  ctx.clearRect(0, 0, 1, 1);
  try {
    ctx.fillStyle = input;
  } catch (_a) {
    return 0;
  }
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return a << 24 | r << 16 | g << 8 | b;
}
;// ./dev/src/Settings.entities.ts



class Color extends BasicSetting {
  constructor({
    value = '#FF00FFFF',
    useAlpha = false,
    useCss = false,
    path
  }) {
    super({
      path
    });
    this.microcolor = new microColor();
    this.string = '#FFFFFF'; // hex or rgba
    this.type = 'COL';
    this.value = 0;
    // this.hexa = '#FF00FF66' // 8-Digit hex
    // this.vector = new Float32Array(4)
    // this.rgba = new Uint8Array(4)
    this.alpha = useAlpha;
    this.default = value;
    this.useCss = useCss;
    this.setter(value);
  }
  get export() {
    return this.microcolor.toHEX8();
  }
  toJSON() {
    return this.export;
  }
  setter(string_or_number) {
    let inta = 0;
    if (typeof string_or_number === 'string') {
      if (string_or_number[0] == '#' && (string_or_number.length == 7 || string_or_number.length == 9)) {
        inta = microColor.temp.fromHex(string_or_number).getInta();
      } else {
        inta = parseColorToInta(string_or_number);
      }
    } else {
      inta = string_or_number;
    }
    this.microcolor.fromINT(inta);
    this.value = inta;
    this.string = this.alpha ? this.microcolor.fromINT(inta).toRgb(this.alpha) : this.microcolor.fromINT(inta).getHEX();
  }
}
class Select extends BasicSetting {
  constructor({
    name,
    options = {},
    value,
    path
  }) {
    super({
      name,
      path
    });
    this.type = 'SEL';
    this.options = options;
    this.value = value;
    this.default = value;
    this.setter(value);
  }
  get export() {
    return this.value;
  }
  toJSON() {
    return this.export;
  }
  setter(data) {
    let isError = true;
    for (const [, value] of Object.entries(this.options)) {
      if (value === data) {
        isError = false;
      }
    }
    if (isError) {
      console.error('Select: Invalid value ', data, ', fallback to default', this, this.default);
      this.value = this.default;
      return;
    }
    this.value = data;
  }
}
class Slider extends BasicSetting {
  constructor({
    name,
    min,
    max,
    step,
    value,
    useCss = false,
    dim = '',
    unit = '',
    path
  }) {
    var _a;
    super({
      name,
      path
    });
    this.type = 'SLD';
    this.min = min;
    this.max = max;
    this.step = step;
    this.value = value;
    this.default = value;
    this.useCss = useCss;
    this.dim = dim;
    this.unit = unit;
    this.precision = ((_a = step.toString().split('.')[1]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    this.setter(value);
  }
  get export() {
    return this.value;
  }
  toJSON() {
    return this.export;
  }
  setter(data) {
    if (typeof data !== 'number' || typeof data == 'undefined') data = this.default;
    this.value = data;
  }
}
class Option extends BasicSetting {
  constructor({
    name,
    value,
    path
  }) {
    super({
      name,
      path
    });
    this.type = 'OPT';
    this.value = value;
    this.default = value;
    this.setter(value);
  }
  get export() {
    return this.value;
  }
  toJSON() {
    return this.export;
  }
  setter(data) {
    this.value = data;
  }
}
class Input extends BasicSetting {
  constructor({
    name,
    value,
    csshook = s => s,
    path,
    useCss = false,
    options = {}
  }) {
    super({
      name,
      path
    });
    this.type = 'INP';
    this.value = value;
    this.default = value;
    this.csshook = csshook;
    this.useCss = useCss;
    this.options = options;
    this.setter(value);
  }
  get export() {
    return this.value;
  }
  toJSON() {
    return this.export;
  }
  setter(data) {
    if (typeof data !== 'string' || typeof data == 'undefined') data = this.default;
    this.value = String(data);
  }
  cssValue() {
    return this.csshook ? this.csshook(this.value) : this.value;
  }
}
;// ./dev/src/settings.ts


var Group1;
(function (Group1) {
  Group1["s_game"] = "gameplayGroup";
})(Group1 || (Group1 = {}));
const settingsDescriptions = {
  Minimap: new Option({
    path: Group1.s_game,
    value: true
  }),
  AutoRespawn: new Option({
    path: Group1.s_game,
    value: false
  }),
  LeaderboardTitle: new Input({
    path: Group1.s_game,
    value: 'Doublesplit',
    options: {
      Leaderboard: 'Leaderboard'
    }
  }),
  MapBorder: new Option({
    path: Group1.s_game,
    value: true
  }),
  MapSectors: new Option({
    path: Group1.s_game,
    value: true
  }),
  MapSectorLabels: new Option({
    path: Group1.s_game,
    value: true
  }),
  AutoCollectCoins: new Option({
    path: Group1.s_game,
    value: true
  }),
  AcidMode: new Option({
    path: Group1.s_game,
    value: false
  })
  // label: new Color({ path: Group1.s_game, value: 0x1affa3ff }),
  // miniblob: new Color({ path: Group1.s_game, value: 0x0000ffff }),
  // transparent_cells: new Slider({ path: Group1.s_game, value: 1, min: 0.1, max: 1, step: 0.1 })
};
const settings = new Settings(settingsDescriptions);
Object.assign(window, {
  settings
});

/***/ }),

/***/ 714:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventObject: () => (/* binding */ EventObject),
/* harmony export */   Eventify: () => (/* binding */ Eventify),
/* harmony export */   deferrify: () => (/* binding */ deferrify)
/* harmony export */ });
/* unused harmony exports EventMixin, eventify, Promised, sleep */
// https://stackoverflow.com/questions/50071115/typescript-promise-rejection-type
//https://github.com/microsoft/TypeScript/issues/24122
function EventMixin(Base) {
  class EventifyBase extends Base {
    constructor() {
      super(...arguments);
      /* Stores events */
      this.events = {};
      /* Stores delegated events */
      // ev: Array<[EventifyBase, EventName<EventMap>, LISTENER]> = [];
      this.ev = [];
      this.blockRemovingListeners = false;
    }
    on(...rest) {
      var _a;
      var _b;
      if (rest.length < 2) throw new Error('Eventify.on() need at least 2 arguments');
      const length = rest.length;
      const listener = rest[length - 1];
      for (let i = 0; length - 1 > i; i++) {
        const event = rest[i];
        (_a = (_b = this.events)[event]) !== null && _a !== void 0 ? _a : _b[event] = [];
        this.events[event].push(listener);
      }
      return listener;
    }
    removeListener(event, listener) {
      if (typeof this.events[event] === 'object') {
        const idx = this.events[event].indexOf(listener);
        if (idx > -1) {
          this.events[event].splice(idx, 1);
        }
        if (this.events[event].length === 0) {
          delete this.events[event];
        }
      }
    }
    emit(event, ...rest) {
      // this.blockRemovingListeners = true;
      if (this.events[event]) {
        const listeners = this.events[event].slice();
        for (const listener of listeners) {
          listener.apply(this, rest);
        }
      }
      // this.blockRemovingListeners = false;
    }
    once(event, listener) {
      const once_listener = (...args) => {
        this.removeListener(event, once_listener);
        listener.apply(this, args);
      };
      this.on(event, once_listener);
      return once_listener;
    }
    waitTimeout(event, timeout, abortController) {
      const ret = this.waitfor(event, (_, rejector) => {
        const timeoutId = setTimeout(() => {
          const error = new Error(`Waiting "${event.toString()}" Timeout`);
          error.cause = 'timeout';
          rejector(error);
        }, timeout);
        if (abortController) {
          function abort() {
            clearTimeout(timeoutId);
            const error = new Error(`Waiting "${event.toString()}" Aborted`);
            error.cause = 'aborted';
            rejector(error);
          }
          if (abortController.signal.aborted) {
            abort();
          } else {
            abortController.signal.addEventListener('abort', abort, {
              once: true
            });
          }
        }
        return () => {
          clearTimeout(timeoutId);
        };
      });
      return ret;
    }
    waitfor(event, reject_callback) {
      return new Promise((_resolve, _reject) => {
        let destroyCallbackCalled = false;
        const removeListener = () => {
          this.removeListener(event, resolver);
          this.removeListener(event, rejector);
          if (destroyCallbackCalled) return;
          destroyCallbackCalled = true;
          destroyRejectCallback();
        };
        function resolver(v) {
          _resolve(v);
          removeListener();
        }
        function rejector(e) {
          _reject(e);
          removeListener();
        }
        // @ts-ignore
        const destroyRejectCallback = reject_callback(resolver, rejector);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const self = this;
        self.listenSelf(event, resolver);
        self.listenSelf(event, rejector);
      });
    }
    delegateTo(target, ...rest) {
      if (arguments.length < 3) throw new Error('Eventify.delegateTo() need at least 3 arguments');
      const length = rest.length,
        listener = rest[length - 1];
      for (let i = 0; length - 1 > i; i++) {
        const event = rest[i];
        if (typeof target.events[event] !== 'object') {
          target.events[event] = [];
        }
        const _target = target;
        target.ev.push({
          delegated: this,
          event: event,
          listener: listener
        });
        this.on(event, listener);
      }
      return listener;
    }
    listenTo(target, ...rest) {
      return target.delegateTo(this, ...rest);
    }
    listenSelf(...rest) {
      return this.listenTo(this, ...rest);
    }
    /**
     * Removes delegated events
     */
    unlisten() {
      const before = this.ev.slice();
      for (let i = 0; before.length > i; i++) {
        const target = before[i].delegated;
        const eventName = before[i].event;
        const listener = before[i].listener;
        target.removeListener(eventName, listener);
        const idx = this.ev.indexOf(before[i]);
        if (idx > -1) this.ev.splice(idx, 1);
      }
      if (this.ev.length > 0) {
        console.error('We have error in unlisten()', before, this.ev);
      }
    }
  }
  return EventifyBase;
}
class Eventify extends EventMixin(class {}) {}
/* LIB : EVENTIFY ANY OBJECT */
const props = ['on', 'removeListener', 'emit', 'once', 'listenTo', 'delegateTo', 'listenSelf', 'unlisten', 'ev', 'events', 'waitfor', 'waitTimeout'];
const eventify = function (object) {
  const EVENTIFY = new Eventify();
  props.forEach(key => {
    Object.defineProperty(object, key, {
      value: EVENTIFY[key],
      enumerable: false,
      writable: false
    });
  });
  return object;
};
function EventObject(object) {
  // = instead extends
  const _Eventify = eventify(object);
  const eventObject = new Proxy(object, {
    set(target, prop, val) {
      const prev = object[prop];
      const curr = val;
      // @ts-ignore
      _Eventify.emit('before*', prop, val);
      //@ts-ignore
      object[prop] = val;
      try {
        // @ts-ignore
        _Eventify.emit(prop, val, prev);
        if (prev !== curr) {
          // @ts-ignore
          _Eventify.emit('change:*', prop, val); // @ts-ignore
          _Eventify.emit('change:' + String(prop), val, prev);
        }
        // @ts-ignore
        _Eventify.emit('*', prop, val, prev);
      } catch (message) {
        console.error(message);
      }
      return true;
    }
  });
  Object.defineProperty(eventObject, 'raw', {
    get() {
      return object;
    }
  });
  return eventObject;
  // return eventObject as EventObjectReturnType<OBJ>;
}
function deferrify(params) {
  let resolve = null;
  let reject = null;
  const promise = new Promise((resolveFunc, rejectFunc) => {
    var _a;
    resolve = resolveFunc;
    reject = rejectFunc;
    if ((params === null || params === void 0 ? void 0 : params.signal) instanceof Promise) {
      params.signal.catch(reject);
    } else if ((_a = params === null || params === void 0 ? void 0 : params.signal) === null || _a === void 0 ? void 0 : _a.aborted) {
      reject();
    }
  });
  return {
    promise,
    resolve,
    reject
  };
}
class Promised extends Promise {
  constructor(executor) {
    super((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      // @ts-ignore
      if (executor !== undefined) executor(resolve, reject);
    });
  }
}
const sleep = delay => function chainDelay(args) {
  return new Promise(res => {
    setTimeout(() => res(args), delay);
  });
};

/***/ }),

/***/ 767:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(653);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(102);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#minimap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
#ds-minimap {
    position: fixed;
    bottom: 15px;
    right: 15px;
    width: 200px;
    height: 200px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    overflow: hidden;
    background-color: rgba(20, 20, 20, 0.75);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
#ds-minimap .background {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    width: 100%;
    height: 100%;
}
#ds-minimap .sector {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ddd;
    font-size: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition:
        background-color 0.3s ease,
        transform 0.2s ease;
}
#ds-minimap .sector.active {
    background-color: rgba(0, 191, 255, 0.3);
    border: 1px solid #00bfff;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 825:
/***/ ((module) => {

"use strict";


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
  }

  // For old IE
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
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
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

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/harmony module decorator */
/******/ (() => {
/******/ 	__webpack_require__.hmd = (module) => {
/******/ 		module = Object.create(module);
/******/ 		if (!module.children) module.children = [];
/******/ 		Object.defineProperty(module, 'exports', {
/******/ 			enumerable: true,
/******/ 			set: () => {
/******/ 				throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 			}
/******/ 		});
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/nonce */
/******/ (() => {
/******/ 	__webpack_require__.nc = undefined;
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./Shared/src/utils/Eventify.ts
var Eventify = __webpack_require__(714);
;// ./dev/src/utils/utils.ts
/**
 * Finds all nodes in the given tree structure that match the specified condition.
 */
function find_node(where = window['agarApp'].home, cond) {
  const results = [];
  const find_static = (where = window['agarApp'].home, cond) => {
    function each_children(child, depth) {
      depth += 1;
      child.forEach(ch => {
        if (cond(ch, depth)) results.push(ch);
        ch.children && each_children(ch.children, depth);
      });
    }
    each_children(where, -1);
    return results;
  };
  function each_children(child, depth) {
    var _a, _b, _c, _d, _e, _f, _g;
    depth += 1;
    if (cond(child, depth)) results.push(child);
    child._staticTrees && find_static(child._staticTrees, cond);
    // console.log(depth, 'TAG:', child, child.$vnode?.tag)
    (_a = child.$children) === null || _a === void 0 ? void 0 : _a.forEach(ch => {
      each_children(ch, depth);
    });
    (_b = child.children) === null || _b === void 0 ? void 0 : _b.forEach(ch => {
      each_children(ch, depth);
    });
    (_d = (_c = child._vnode) === null || _c === void 0 ? void 0 : _c.children) === null || _d === void 0 ? void 0 : _d.forEach(ch => {
      each_children(ch, depth);
    });
    (_g = (_f = (_e = child._vnode) === null || _e === void 0 ? void 0 : _e.componentOptions) === null || _f === void 0 ? void 0 : _f.children) === null || _g === void 0 ? void 0 : _g.forEach(ch => {
      each_children(ch, depth);
    });
  }
  each_children(where, -1);
  return results;
}
/**
@example
overrideMethod(ctx, 'drawImage', (originalMethod, args) => {
    return originalMethod.apply(ctx, args);
})
 */
function overrideMethod(obj, methodName, getMethod) {
  const originalMethod = obj[methodName];
  obj[methodName] = function () {
    return getMethod(originalMethod, arguments);
  };
}
function overridePrototype(obj, methodName, getMethod) {
  const originalMethod = obj[methodName];
  return obj[methodName] = getMethod(originalMethod);
}
const updateCssString = (() => {
  const records = {};
  return (name, css) => {
    if (!records[name]) {
      const style = document.createElement('style');
      style.setAttribute('data-css-name', name);
      document.head.appendChild(style);
      records[name] = style;
    }
    records[name].textContent = css;
  };
})();
function setCssVariable(_line, name, value, dimension) {
  const root = document.body;
  if (dimension) value += dimension;
  if (value === 0) {
    value = 'none';
  }
  root.style.setProperty(`--${name}`, String(value));
}
function camelCaseToWords(s) {
  const result = s.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
;// ./dev/src/agario-patches.ts

function exposeHxClasses() {
  let $hxClasses;
  const targetProperty = 'ApplicationMain';
  return new Promise(resolve => {
    Object.defineProperty(Object.prototype, targetProperty, {
      set: function (value) {
        delete Object.prototype[targetProperty];
        this.ApplicationMain = value;
        $hxClasses = value;
        Object.assign(window, {
          hx: this
        });
        resolve(this);
      },
      get: function () {
        return $hxClasses;
      },
      configurable: true,
      enumerable: false
    });
  });
}
function coreInitPatch() {
  overrideMethod(window['core'], 'setFpsCap', originalMethod => {
    return originalMethod(-1);
  });
}
function coreUiPatch() {
  const title = document.querySelector('#title');
  title.innerHTML = 'Doublesplit';
  title.style.fontSize = '2.5em';
}
function coreAdsPatch() {
  var _a, _b, _c, _d, _e;
  document.addEventListener('update_user_info', e => {
    if (e.detail.isPayingUser) return;
    const detail = Object.assign(Object.assign({}, e.detail), {
      isPayingUser: true
    });
    const ev = new CustomEvent('update_user_info', {
      detail
    });
    e.stopPropagation();
    document.dispatchEvent(ev);
  });
  // window.hx.Core.user.userInfo.isPayingUser=true
  // Ads delete
  (_a = find_node(undefined, child => {
    var _a;
    return (_a = child.$vnode) === null || _a === void 0 ? void 0 : _a.tag.includes('-ads');
  })[0]) === null || _a === void 0 ? void 0 : _a.$destroy();
  (_b = find_node(undefined, child => {
    var _a;
    return (_a = child.$vnode) === null || _a === void 0 ? void 0 : _a.tag.includes('-promo');
  })[0]) === null || _b === void 0 ? void 0 : _b.$destroy();
  find_node(undefined, child => {
    var _a, _b;
    return (_b = (_a = child.elm) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.includes('agar-io');
  }).forEach(child => {
    var _a;
    (_a = child.elm.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(child.elm);
  });
  find_node(undefined, child => child.playVideoAd).forEach(elem => {
    elem.getVideoTimestamp = () => Date.now();
  });
  {
    const vnode = (_c = find_node(undefined, child => Object.getPrototypeOf(child).hasOwnProperty('hasBottomAd'))) === null || _c === void 0 ? void 0 : _c[0];
    if (vnode) {
      Object.defineProperties(vnode, {
        fastEntry: {
          get: () => true
        }
      });
    }
  }
  // Youtube, FB buttons
  {
    const vnode = find_node(undefined, child => {
      var _a;
      if (((_a = child === null || child === void 0 ? void 0 : child.elm) === null || _a === void 0 ? void 0 : _a.id) == 'socialButtons') return true;
    })[0];
    if (vnode) {
      vnode.elm.parentElement.removeChild(vnode.elm);
    }
  }
  // Skin floating badge
  {
    const bubble = find_node(undefined, child => {
      var _a, _b;
      return (_b = (_a = child.data) === null || _a === void 0 ? void 0 : _a.staticClass) === null || _b === void 0 ? void 0 : _b.includes('bubble');
    })[0];
    (_d = bubble === null || bubble === void 0 ? void 0 : bubble.elm) === null || _d === void 0 ? void 0 : _d.parentElement.removeChild(bubble === null || bubble === void 0 ? void 0 : bubble.elm);
  }
  {
    const vnode = (_e = find_node(undefined, child => Object.getPrototypeOf(child).hasOwnProperty('hasBottomAd'))) === null || _e === void 0 ? void 0 : _e[0];
    if (vnode) {
      ['hasBottomAd', 'hasSideAds'].map(prop => {
        vnode._computedWatchers[prop]['getter'] = () => false;
      });
      Object.defineProperties(vnode, {
        hasBottomAd: {
          get: () => false
        },
        // hasSideAds: {get:()=> false},
        // hasTopAd: {get:()=> false},
        // showSideBanners: {get:()=> false},
        // showBottomBanners: {get:()=> false},
        fastEntry: {
          get: () => true
        }
      });
    }
  }
  document.documentElement.style.setProperty(`--bottom-banner-height`, '0px');
  let agarapp = window['agarApp'];
  Object.defineProperty(window, 'agarApp', {
    get() {
      return agarapp;
    },
    set(value) {
      agarapp = value;
      onAgarApp();
    }
  });
  function onAgarApp() {
    var _a, _b, _c;
    var _d;
    (_a = (_d = window['agarApp']).ads) !== null && _a !== void 0 ? _a : _d.ads = {};
    Object.assign(window['agarApp'].ads, {
      requestAds() {},
      requestAd() {},
      refreshAd() {},
      destroyAd() {},
      adSlots() {},
      enableTargetedAds() {},
      disableTargetedAds() {},
      isTargeted() {},
      supersonicAds: {
        BrandConnectReadyEvent() {},
        BrandConnectDoneEvent() {},
        BrandConnectOpenEvent() {},
        BrandConnectCloseEvent() {},
        BrandConnectCompletedEvent() {},
        hasEngagement() {
          return false;
        }
      }
    });
    if ((_b = window['agarApp']) === null || _b === void 0 ? void 0 : _b.main) ['sendEndSession', 'initDataDog', 'sendAnalyticsInitEvent', 'onGoliathReady', 'onGoliathUnload', 'initAnalytics', 'initGuestAnalytics', 'sendAnalyticsInitEvent', 'initBrowserId'].forEach(prop => {
      window['agarApp'].main[prop] = () => {};
    });
    if ((_c = window['agarApp']) === null || _c === void 0 ? void 0 : _c.MCSDK) ['sendMatchEvent'].forEach(prop => window['agarApp'].MCSDK[prop] = () => {});
  }
  try {
    onAgarApp();
  } catch (e) {}
}
function fixNoServers() {
  let AgarioEndpoints = null;
  class HookXMLHttpRequest extends window.XMLHttpRequest {
    constructor() {
      super();
    }
    open(method, _url, async, username, password) {
      const url = new URL(_url, location.href);
      if (url.pathname.endsWith('/info')) {
        this.addEventListener('load', () => {
          const regions = JSON.parse(this.responseText);
          AgarioEndpoints = regions;
        });
      }
      if (url.pathname.endsWith('/findServerWithFriends')) {
        console.log('Hooked XMLHttpRequest:', method, url);
        this.addEventListener('load', e => {
          const endpoints = JSON.parse(this.responseText);
          if (endpoints.status == 'no_servers') {
            const escapeIndex = (index, count) => (index % count + count) % count;
            const otherRegions = Object.keys(AgarioEndpoints.regions);
            const targetRegion = window['MC'].getRegion();
            const regionIndex = otherRegions.indexOf(targetRegion);
            const tryRegion = escapeIndex(regionIndex + 1, otherRegions.length);
            console.log('Trying region:', otherRegions[tryRegion]);
            setTimeout(() => {
              window['MC'].setRegion(otherRegions[tryRegion], true);
            }, 0);
          }
          if (false) {}
        });
      }
      super.open(method, url, async, username, password);
    }
  }
  window.XMLHttpRequest = HookXMLHttpRequest;
}
// EXTERNAL MODULE: ./dev/src/settings.ts + 4 modules
var settings = __webpack_require__(701);
// EXTERNAL MODULE: external "preact"
var external_preact_ = __webpack_require__(32);
// EXTERNAL MODULE: ./dev/src/ui/Contexts.ts
var Contexts = __webpack_require__(413);
// EXTERNAL MODULE: external "preactHooks"
var external_preactHooks_ = __webpack_require__(632);
;// ./dev/src/utils/minmax.ts
function vh(v) {
  const h = window.innerHeight;
  return v * h / 100;
}
function vw(v) {
  const w = window.innerWidth;
  return v * w / 100;
}
function vmin(v) {
  return Math.min(vh(v), vw(v));
}
function vmax(v) {
  return Math.max(vh(v), vw(v));
}
function gcd(a = window.innerWidth, b = window.innerHeight) {
  return b == 0 ? a : gcd(b, a % b);
}
;// ./dev/src/ui/componetns/hooks.tsx



const scaling = (0,Eventify.EventObject)({
  uiScale: 1
});
function calcScale() {
  const gc = gcd();
  let sizeOfMap = 1;
  const {
    w,
    h
  } = {
    w: 4,
    h: 3
  };
  if (gc * window.innerWidth / (gc * window.innerHeight) > w / h) {
    sizeOfMap = vh(27) / 200;
  } else {
    sizeOfMap = h * vw(27) / w / 200;
  }
  scaling.uiScale = Math.min(1, sizeOfMap);
}
window.addEventListener('resize', calcScale);
calcScale();
function useEventify(effect, deps) {
  const eventify = (0,external_preactHooks_.useMemo)(() => new Eventify.Eventify(), []);
  (0,external_preactHooks_.useEffect)(() => {
    const destroy = effect(eventify);
    return () => {
      if (destroy) destroy();
      eventify.unlisten();
    };
  }, deps);
}
// EXTERNAL MODULE: ./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var jsxRuntime_module = __webpack_require__(557);
;// ./dev/src/ui/componetns/Inputs.tsx




function keepValue(a) {
  const e = a;
  if (e.keyCode === 27) {
    e.target.blur();
    e.preventDefault();
  }
}
function UiOption({
  target,
  name
}) {
  const [value, updateValue] = (0,external_preactHooks_.useState)(target.raw[name].value);
  // @ts-ignore
  useEventify(e => e.listenTo(target, name, () => updateValue(target.raw[name].value))(), [name]);
  return (0,jsxRuntime_module.jsx)(UiOptionMarkup
  // @ts-ignore
  , {
    name: camelCaseToWords(target.raw[name].name || name),
    value: value,
    onValue: value => {
      updateValue(value);
      target.proxy[name] = value;
    }
  });
}
function UiOptionMarkup({
  name,
  value,
  onValue
}) {
  return (0,jsxRuntime_module.jsxs)("label", {
    className: "flex flex-row p-1 text-left gap-2",
    children: [(0,jsxRuntime_module.jsx)("div", {
      className: "grow",
      children: name
    }), (0,jsxRuntime_module.jsx)("div", {
      className: "",
      children: (0,jsxRuntime_module.jsxs)("label", {
        className: "switch",
        children: [(0,jsxRuntime_module.jsx)("input", {
          name: Math.random().toString(),
          className: "",
          onChange: e => onValue(e.target['checked']),
          checked: value,
          defaultChecked: value,
          type: "checkbox"
        }), (0,jsxRuntime_module.jsx)("div", {
          className: "slider round",
          "data-on": 'ui_on',
          "data-off": 'ui_off'
        })]
      })
    })]
  });
}
function UiSlider({
  target,
  name
}) {
  const helperRef = (0,external_preactHooks_.useRef)();
  const unit = target.raw[name].unit || '';
  function updateValue(value) {
    helperRef.current.innerText = String(value.toFixed(target.raw[name].precision)) + unit;
  }
  useEventify(e => {
    // @ts-ignore
    e.listenTo(target, name, () => updateValue(target.raw[name].value))();
    return () => e.unlisten();
  }, [name]);
  return (0,jsxRuntime_module.jsx)(SliderRender
  // @ts-ignore
  , {
    name: camelCaseToWords(name),
    value: target.raw[name].value,
    data: target.raw[name],
    onValue: value => {
      target.proxy[name] = value;
      updateValue(value);
    },
    helperRef: helperRef
  });
}
function SliderRender({
  name,
  value,
  data,
  onValue,
  helperRef
}) {
  const rangeRef = (0,external_preactHooks_.useRef)();
  return (0,jsxRuntime_module.jsxs)("label", {
    class: "flex p-1 text-left gap-2",
    children: [(0,jsxRuntime_module.jsx)("div", {
      class: "grow",
      children: name
    }), (0,jsxRuntime_module.jsx)("div", {
      ref: helperRef,
      class: "helper"
    }), (0,jsxRuntime_module.jsx)("div", {
      class: "text-left",
      children: (0,jsxRuntime_module.jsx)("input", {
        name: Math.random().toString(),
        ref: rangeRef,
        class: "",
        type: "range",
        onInput: e => onValue(Number(e.target['value'])),
        min: data.min,
        max: data.max,
        step: data.step,
        value: value,
        defaultValue: value.toString()
      })
    })]
  });
}
function UiSelectbox({
  target,
  name
}) {
  const [value, updateValue] = (0,external_preactHooks_.useState)(target.raw[name].value);
  useEventify(e => {
    const handleStatusChange = () => updateValue(target.raw[name].value);
    // @ts-ignore
    e.listenTo(target, name, handleStatusChange);
    handleStatusChange();
    return () => e.unlisten();
  }, [name]);
  return (0,jsxRuntime_module.jsx)(SelectboxRender, {
    name: camelCaseToWords(name.toString()),
    value: value,
    data: target.raw[name].options,
    onValue: value => {
      // updateValue(value)
      target.proxy[name] = value;
    }
  });
}
function SelectboxRender({
  name,
  value,
  data,
  onValue
}) {
  return (0,jsxRuntime_module.jsxs)("div", {
    className: "flex p-1 text-left gap-2",
    children: [(0,jsxRuntime_module.jsx)("div", {
      className: "grow",
      children: name
    }), (0,jsxRuntime_module.jsx)("div", {
      className: "",
      children: (0,jsxRuntime_module.jsx)("select", {
        name: Math.random().toString(),
        className: "selectbox",
        value: value,
        onChange: e => onValue(isNaN(e.target.value) ? e.target.value : Number(e.target.value)),
        children: Object.entries(data).map(([name, value]) => (0,jsxRuntime_module.jsx)("option", {
          value: value,
          children: camelCaseToWords(name)
        }))
      })
    })]
  });
}
function UiInputbox({
  target,
  name
}) {
  var _a;
  function onValue(value) {
    // const { target, name } = this.props;
    target.proxy[name] = value;
  }
  const [value, updateValue] = (0,external_preactHooks_.useState)(target.raw[name].value);
  useEventify(e => {
    const handleStatusChange = () => updateValue(target.raw[name].value);
    // @ts-ignore
    e.listenTo(target, name, handleStatusChange);
    handleStatusChange();
    return () => e.unlisten();
  }, [name]);
  const display_name = camelCaseToWords(name);
  return (0,jsxRuntime_module.jsxs)("div", {
    class: "flex p-1 text-left gap-2",
    children: [(0,jsxRuntime_module.jsx)("div", {
      class: "grow",
      children: display_name
    }), (0,jsxRuntime_module.jsxs)("div", {
      class: "flex grow",
      style: {
        width: '30%'
      },
      children: [(0,jsxRuntime_module.jsx)("input", {
        name: Math.random().toString(),
        class: "input",
        type: "search",
        inputMode: "text",
        autocomplete: "off",
        style: "width: 100%;",
        placeholder: name.toString(),
        onKeyDown: keepValue,
        onInput: e => onValue(e.target['value']),
        value: value,
        defaultValue: value
      }),  true ? (0,jsxRuntime_module.jsxs)("select", {
        name: 'select-' + Math.random(),
        class: "w-4",
        onChange: _e => {
          const e = _e;
          e.target.value != undefined && onValue(e.target.value);
          e.target.value = '';
          e.target.blur();
        },
        style: "",
        children: [(0,jsxRuntime_module.jsx)("option", {
          value: ""
        }), typeof target.raw[name].default !== 'undefined' && (0,jsxRuntime_module.jsx)("option", {
          value: target.raw[name].default,
          children: "Default"
        }), (_a = Object.entries(target.raw[name].options)) === null || _a === void 0 ? void 0 : _a.map(([key, val]) => (0,jsxRuntime_module.jsx)("option", {
          value: val,
          children: key
        }))]
      }) : 0]
    })]
  });
}
;// ./dev/src/ui/SettingsList.tsx


function SettingsList({
  array,
  target
}) {
  // @ts-ignore
  const result = array.map(([optName, setting]) => {
    const type = setting.type;
    // @ts-ignore
    if (type == 'OPT') return (0,jsxRuntime_module.jsx)(UiOption, {
      target: target,
      name: optName
    });
    // @ts-ignore
    if (type == 'SLD') return (0,jsxRuntime_module.jsx)(UiSlider, {
      target: target,
      name: optName
    });
    // @ts-ignore
    if (type == 'SEL') return (0,jsxRuntime_module.jsx)(UiSelectbox, {
      target: target,
      name: optName
    });
    // @ts-ignore
    if (type == 'INP') return (0,jsxRuntime_module.jsx)(UiInputbox, {
      target: target,
      name: optName
    });
    // @ts-ignore
    if (type == 'COL') return (0,jsxRuntime_module.jsx)(UiColorbox, {
      target: target,
      name: optName
    });
  });
  return result;
}
;// ./dev/src/ui/Menu.tsx






function MenuButtons() {
  const app = (0,external_preactHooks_.useContext)(Contexts.AppContext);
  const inputRef = (0,external_preactHooks_.useRef)();
  useEventify(e => {
    e.listenTo(app.state, 'ws', () => {
      inputRef.current.value = app.state.ws;
    })();
  }, []);
  return (0,jsxRuntime_module.jsxs)("div", {
    class: 'menu-addon',
    style: {
      marginTop: '4px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    children: [(0,jsxRuntime_module.jsx)("button", {
      style: {
        width: '242px'
      },
      type: "submit",
      class: "btn menu-button ",
      onClick: () => app.spectate(),
      children: "Spectate"
    }), (0,jsxRuntime_module.jsxs)("div", {
      style: {
        display: 'flex',
        gap: '4px',
        paddingTop: '4px',
        alignItems: 'center'
      },
      children: [(0,jsxRuntime_module.jsx)("input", {
        class: "input-addon",
        placeholder: "server",
        ref: inputRef
      }), (0,jsxRuntime_module.jsx)("button", {
        type: "submit",
        class: "btn menu-button",
        onClick: () => app.connect(inputRef.current.value),
        children: "Connect"
      })]
    })]
  });
}
const Menu = () => {
  return (0,jsxRuntime_module.jsx)("div", {
    className: "h-full",
    style: {
      overflowY: 'scroll'
    },
    onWheel: e => e.stopPropagation(),
    children: (0,jsxRuntime_module.jsx)("div", {
      className: "mx-2",
      children: (0,jsxRuntime_module.jsx)(SettingsList, {
        array: Object.entries(settings.settings.raw),
        target: settings.settings
      })
    })
  });
};
// EXTERNAL MODULE: ./dev/src/ui/Minimap.tsx
var Minimap = __webpack_require__(390);
;// ./dev/src/ui/componetns/preact-portal.tsx


class Portal extends external_preact_.Component {
  constructor() {
    super(...arguments);
    this.isMounted = false;
  }
  componentDidUpdate(props) {
    for (const i in props) {
      if (props[i] !== this.props[i]) {
        return setTimeout(() => this.renderLayer());
      }
    }
  }
  componentDidMount() {
    this.isMounted = true;
    this.renderLayer = this.renderLayer.bind(this);
    this.renderLayer();
  }
  componentWillUnmount() {
    this.renderLayer(false);
    this.isMounted = false;
    if (this.remote && this.remote.parentNode) this.remote.parentNode.removeChild(this.remote);
  }
  findNode(node) {
    return typeof node === 'string' ? document.querySelector(node) : node;
  }
  renderLayer(show = true) {
    if (!this.isMounted) return;
    // clean up old node if moving bases:
    if (this.props.into !== this.intoPointer) {
      this.intoPointer = this.props.into;
      if (this.into && this.remote) {
        // @ts-ignore
        this.remote = (0,external_preact_.render)((0,jsxRuntime_module.jsx)(PortalProxy, {}), createRootFragment(this.into, this.remote));
      }
      this.into = this.findNode(this.props.into);
    }
    // @ts-ignore
    this.remote = (0,external_preact_.render)((0,jsxRuntime_module.jsx)(PortalProxy, {
      context: this.$state,
      children: show && this.props.children ? [this.props.children] : null
    }), createRootFragment(this.into, this.remote));
  }
  render() {
    return null;
  }
}
class PortalProxy extends external_preact_.Component {
  getChildContext() {
    return this.props.context;
  }
  render({
    children
  } = this.props) {
    return children && children[0] || null;
  }
}
/**
 * A Preact 11+ implementation of the `replaceNode` parameter from Preact 10.
 *
 * This creates a "Persistent Fragment" (a fake DOM element) containing one or more
 * DOM nodes, which can then be passed as the `parent` argument to Preact's `render()` method.
 */
function createRootFragment(parent, replaceNode) {
  if (replaceNode) {
    replaceNode = Array.isArray(replaceNode) ? replaceNode : [replaceNode];
  } else {
    replaceNode = [parent];
    parent = parent.parentNode;
  }
  const s = replaceNode[replaceNode.length - 1].nextSibling;
  const rootFragment = {
    nodeType: 1,
    parentNode: parent,
    firstChild: replaceNode[0],
    childNodes: replaceNode,
    insertBefore: (c, r) => {
      parent.insertBefore(c, r || s);
      return c;
    },
    appendChild: c => {
      parent.insertBefore(c, s);
      return c;
    },
    removeChild: function (c) {
      parent.removeChild(c);
      return c;
    }
  };
  parent.__k = rootFragment;
  return rootFragment;
}
;// ./dev/src/ui/index.tsx





// import './style.scss' with { type: 'cssfile' };

function initLiteui(app) {
  // import('./style.scss', { type: 'cssfile' }).then((module) => {});
  const liteui = document.createElement('div');
  liteui.style = 'display:flex; flex-direction:column; overflow:hidden;';
  document.getElementById('instructions').insertAdjacentElement('afterend', liteui);
  (0,external_preact_.render)((0,jsxRuntime_module.jsx)(jsxRuntime_module.Fragment, {
    children: (0,jsxRuntime_module.jsx)(Portal, {
      into: liteui,
      children: (0,jsxRuntime_module.jsx)(jsxRuntime_module.Fragment, {
        children: (0,jsxRuntime_module.jsxs)("div", {
          "data-portal": true,
          className: "w-full",
          style: "overflow: hidden;display: flex;height: 100%;flex-direction: column;",
          children: [(0,jsxRuntime_module.jsx)(Contexts.AppContext.Provider, {
            value: app,
            children: (0,jsxRuntime_module.jsx)(MenuButtons, {})
          }), (0,jsxRuntime_module.jsx)(Contexts.AppContext.Provider, {
            value: app,
            children: (0,jsxRuntime_module.jsx)(Menu, {})
          })]
        })
      })
    })
  }), document.body);
  {
    const promoPanel = document.querySelector('#mainui-promo');
    const replacement = document.createElement('div');
    replacement.style = 'width: 100%; height: 100%; background-color: #fff';
    (0,external_preact_.render)((0,jsxRuntime_module.jsx)(Contexts.AppContext.Provider, {
      value: app
    }), replacement);
    promoPanel.insertAdjacentElement('afterbegin', replacement);
  }
  {
    const minimapElem = document.createElement('div');
    (0,external_preact_.render)((0,jsxRuntime_module.jsx)(Contexts.AppContext.Provider, {
      value: app,
      children: (0,jsxRuntime_module.jsx)(Minimap.Minimap, {})
    }), minimapElem);
    document.body.insertAdjacentElement('afterbegin', minimapElem);
  }
  {
    const observer = new window.MutationObserver(mtRecs => {
      for (const mtRec of mtRecs) {
        const elem = mtRec.target;
        if (elem.style.display !== 'none') {
          elem.style.display = 'flex';
          elem.style.display = 'flex-direction:column';
        }
      }
    });
    observer.observe(window.document.querySelector('#mainPanel'), {
      attributeFilter: ['style']
    });
  }
}
;// ./dev/src/utils/env.ts
function makeGLobal(name, value) {
  window[name] = value;
  return value;
}
;// ./dev/src/utils/Sampler.ts
class Sampler {
  constructor() {
    this.samplerIndex = 0;
    this.sampler = new Float32Array(30).fill(0);
    this.averagePerSecond = 0;
    this.renderedFrames = 0;
    this.average = 0;
    this.now = 0;
  }
  step() {
    const now = Date.now();
    const elapsed = now - this.now;
    this.now = now;
    const delta = elapsed / 1000;
    const perSecond = 1 / delta;
    let average = 0;
    let howmuchSamples = 0;
    this.sampler[this.samplerIndex] = Math.round(perSecond);
    this.samplerIndex = (this.samplerIndex + 1) % this.sampler.length;
    for (let i = 0; i < Math.min(this.sampler.length, this.renderedFrames); i++) {
      average += this.sampler[i];
      howmuchSamples++;
    }
    average = Math.round(average / howmuchSamples);
    this.average = average;
    if (this.renderedFrames <= this.sampler.length) this.renderedFrames++;
  }
}
;// ./dev/src/utils/storage.ts
var __classPrivateFieldGet = undefined && undefined.__classPrivateFieldGet || function (receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Storage_namespace;
class Storage {
  constructor() {
    _Storage_namespace.set(this, 'ds_');
  }
  set(key, object, namespace = __classPrivateFieldGet(this, _Storage_namespace, "f"), middleware = d => d) {
    localStorage.setItem(namespace + key, middleware(JSON.stringify(object)));
  }
  get(key, namespace = __classPrivateFieldGet(this, _Storage_namespace, "f"), middleware = d => d) {
    let obj = {};
    const rawData = localStorage.getItem(namespace + key);
    if (typeof rawData === 'string') {
      try {
        obj = JSON.parse(middleware(rawData));
      } catch (e) {
        console.error(e);
      }
    }
    return obj;
  }
  clear(key, namespace = __classPrivateFieldGet(this, _Storage_namespace, "f")) {
    return localStorage.removeItem(namespace + key);
  }
}
_Storage_namespace = new WeakMap();
const storage = new Storage();
;// ./dev/src/utils/wasmPatcher.ts
function applyPatch(u8, operations, anyFail) {
  let result = u8;
  const initialLength = u8.length;
  for (const {
    pattern,
    payload,
    type
  } of operations) {
    const index = findPattern(result, pattern);
    if (index === -1) {
      console.error(`Pattern not found: ${pattern.map(b => b.toString(16)).join(' ')}`);
      anyFail();
      continue;
    }
    let patchIndex = index;
    if (type === 'insertAfter') patchIndex = index + pattern.length;else if (type === 'insertBefore') patchIndex = index;else if (type === 'replaceAfter') {
      patchIndex = index + pattern.length;
      const sliceBefore = result.slice(0, patchIndex);
      const sliceAfter = result.slice(patchIndex + payload.length);
      result = concatUint8Arrays([sliceBefore, new Uint8Array(payload), sliceAfter]);
      continue;
    } else if (type === 'replaceBefore') {
      patchIndex = index - payload.length;
      if (patchIndex < 0) throw new Error('replaceBefore would underflow the buffer');
      const sliceBefore = result.slice(0, patchIndex);
      const sliceAfter = result.slice(index);
      result = concatUint8Arrays([sliceBefore, new Uint8Array(payload), sliceAfter]);
      continue;
    } else if (type === 'replaceUlebAfter') {
      // Compute new ULEB value = old + deltaInserted
      patchIndex = index + pattern.length;
      const {
        value: oldVal,
        length: oldLen
      } = readULEB(result, patchIndex);
      const deltaInserted = result.length - initialLength; // growth from previous ops
      const newVal = oldVal + deltaInserted;
      const newBytes = writeULEB(newVal);
      // Replace oldLen bytes with newBytes (may grow/shrink)
      const sliceBefore = result.slice(0, patchIndex);
      const sliceAfter = result.slice(patchIndex + oldLen);
      result = concatUint8Arrays([sliceBefore, newBytes, sliceAfter]);
      continue;
    }
    // Default insert
    const sliceBefore = result.slice(0, patchIndex);
    const sliceAfter = result.slice(patchIndex);
    result = concatUint8Arrays([sliceBefore, new Uint8Array(payload), sliceAfter]);
  }
  return result;
}
function findPattern(buffer, pattern) {
  for (let i = 0; i <= buffer.length - pattern.length; i++) {
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (buffer[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
}
function concatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
// ---- ULEB128 helpers ----
function readULEB(buffer, offset) {
  let result = 0 >>> 0;
  let shift = 0;
  let pos = offset;
  while (pos < buffer.length) {
    const byte = buffer[pos++];
    result |= (byte & 0x7f) << shift >>> 0;
    if ((byte & 0x80) === 0) break;
    shift += 7;
    if (shift > 35) throw new Error('ULEB128 value too large');
  }
  return {
    value: result >>> 0,
    length: pos - offset
  };
}
function writeULEB(value) {
  if (value < 0) throw new Error('ULEB128 cannot encode negative values');
  const out = [];
  let v = value >>> 0;
  do {
    let byte = v & 0x7f;
    v >>>= 7;
    if (v !== 0) byte |= 0x80;
    out.push(byte);
  } while (v !== 0);
  return new Uint8Array(out);
}
// Public helpers to auto-fix section sizes without specifying a pattern
function fixSectionSizeByDelta(u8, sectionId, delta) {
  if (delta === 0) return u8;
  // Validate header
  if (u8.length < 8 || u8[0] !== 0x00 || u8[1] !== 0x61 || u8[2] !== 0x73 || u8[3] !== 0x6d) {
    console.warn('[wasmPatcher] Not a wasm module (magic mismatch)');
    return u8;
  }
  let i = 8; // skip version
  while (i < u8.length) {
    const sid = u8[i++];
    const sizeInfo = readULEB(u8, i);
    const sizeStart = i;
    const sizeLen = sizeInfo.length;
    const payloadSize = sizeInfo.value >>> 0;
    const payloadStart = i + sizeLen;
    if (sid === sectionId) {
      const newSize = payloadSize + delta;
      if (newSize < 0) {
        console.error('[wasmPatcher] Negative section size after delta, skipping');
        return u8;
      }
      const newSizeBytes = writeULEB(newSize);
      const before = u8.slice(0, sizeStart);
      const after = u8.slice(sizeStart + sizeLen);
      return concatUint8Arrays([before, newSizeBytes, after]);
    }
    i = payloadStart + payloadSize; // jump to next section using declared size
  }
  console.warn(`[wasmPatcher] Section ${sectionId} not found, no size fixed`);
  return u8;
}
function autoFixCodeSectionSize(u8Original, u8Patched) {
  const delta = u8Patched.length - u8Original.length;
  if (delta === 0) return u8Patched;
  return fixSectionSizeByDelta(u8Patched, 0x0a, delta);
}
;// ./dev/src/Cell.ts
class Cell {
  constructor() {
    this.accountID = null;
    this.name = null;
  }
  static size2squared(cell_size) {
    return cell_size * cell_size;
  }
  static squared2size(squared_size) {
    return Math.sqrt(squared_size);
  }
  static size2mass(cell_size) {
    return cell_size * cell_size / 100;
  }
  static mass2size(cell_mass) {
    return Math.sqrt(100 * cell_mass);
  }
  construct(id, colorInt, accountID) {
    this.id = id;
    this.colorInt = colorInt;
    this.accountID = accountID;
  }
  setTarget(x, y, size) {
    this.targetX = x;
    this.targetY = y;
    this.targetSize = size;
  }
  setName(name) {
    if (name) this.name = name;
  }
}
;// ./dev/src/World.ts


// import { ServerPlayer } from './ui/Stores';
class World extends Eventify.Eventify {
  get isAgar() {
    var _a;
    return (_a = this.ws) === null || _a === void 0 ? void 0 : _a.url.includes('minic');
  }
  get clientVersion() {
    if (this.client_version_int) return this.client_version_int;
    if (window['MC'] && window['MC'].CLIENT_VERSION) {
      this.CLIENT_VERSION = window['MC'].CLIENT_VERSION;
    } else {
      this.CLIENT_VERSION = '3.11.28';
      alert('Failed to get CLIENT_VERSION, please report this issue');
    }
    const version2int = (x = '0') => x.split('.').reduce((n, c, i, a) => n + parseInt(c) * Math.pow(100, a.length - i - 1), 0);
    this.client_version_int = version2int(this.CLIENT_VERSION);
    return this.clientVersion;
  }
  constructor(app) {
    super();
    this.myCellIds = new Set();
    this.ownCells = new Map();
    this.cells = new Map();
    this.CLIENT_VERSION = null;
    this.client_version_int = 0;
    this.xorBuffer = (buffer, key) => {
      const dataView = new DataView(buffer);
      for (let i = 0; i < dataView.byteLength; i++) {
        dataView.setUint8(i, dataView.getUint8(i) ^ key >>> i % 4 * 8 & 255);
      }
      return buffer;
    };
    this.overWriteWS = _target => {
      const target = _target;
      this.ws = target;
      target._onopen = target.onopen;
      target._onmessage = target.onmessage;
      target.onopen = e => {
        this.reset();
        target._onopen(e);
      };
      target.onmessage = message => {
        target._onmessage(message);
        let offset = 0;
        let msg = message.data;
        if (this.decryptionKey) msg = this.xorBuffer(msg, this.decryptionKey ^ this.clientVersion);
        const view = new DataView(msg);
        const opcode = view.getUint8(offset++);
        switch (opcode) {
          case 17:
            const playerX = view.getFloat32(offset, true);
            offset += 4;
            const playerY = view.getFloat32(offset, true);
            offset += 4;
            this.targetX = this.receiveX(playerX);
            this.targetY = this.receiveY(playerY);
            break;
          case 32:
            this.myCellIds.add(view.getUint32(offset, true));
            break;
          case 69:
            this.ghostCells(view, offset);
            break;
          case 241:
            this.decryptionKey = view.getUint32(offset, true);
            offset += 4;
            const strlen = World.strlen(view, offset);
            const serverVersion = strlen ? World.decoder.decode(new Uint8Array(view.buffer, offset, strlen - 1)) : null;
            break;
          case 255:
            this.handleMessages(this.uncompressMessage(new Uint8Array(view.buffer.slice(5)), new Uint8Array(view.getUint32(offset, true))));
            break;
          default:
            this.handleMessages(new Uint8Array(msg));
        }
      };
    };
    this.texts = new Map();
    this.websocketHooked = false;
    this.reset();
    this.app = app;
  }
  reset() {
    this.isPlay = false;
    this.ownCells.clear();
    this.cells.clear();
    this.minimap = [];
    this.offsetX = 0;
    this.offsetY = 0;
    this.borderX = 0;
    this.borderY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.myCellIds.clear();
    this.decryptionKey = 0;
    this.mapOffsetFixed = false;
    this.mapShiftX = 0;
    this.mapShiftY = 0;
    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
    this.mapMinX = 0;
    this.mapMinY = 0;
    this.mapMaxX = 0;
    this.mapMaxY = 0;
    this.mapMidX = 0;
    this.mapMidY = 0;
    this.mapSizeH = 0;
    this.mapSizeV = 0;
    this.mapShrinkW = 1;
    this.mapShrinkH = 1;
    this.viewX = 0;
    this.viewY = 0;
    this.mirrorV = false;
    this.mirrorH = false;
  }
  uncompressMessage(input, output) {
    for (let i = 0, j = 0; i < input.length;) {
      const byte = input[i++];
      let literalsLength = byte >> 4;
      if (literalsLength > 0) {
        let length = literalsLength + 240;
        while (length === 255) {
          length = input[i++];
          literalsLength += length;
        }
        const end = i + literalsLength;
        while (i < end) output[j++] = input[i++];
        if (i === input.length) return output;
      }
      const offset = input[i++] | input[i++] << 8;
      if (offset === 0 || offset > j) return -(i - 2);
      let matchLength = byte & 15;
      let length = matchLength + 240;
      while (length === 255) {
        length = input[i++];
        matchLength += length;
      }
      let pos = j - offset;
      const end = j + matchLength + 4;
      while (j < end) output[j++] = output[pos++];
    }
    return output;
  }
  eatCellEvent(eater, victim) {
    if (eater && victim) {
      this.removeCell(victim);
    } else {
      this.removeCell(victim);
    }
  }
  removeCell(cell) {
    if (cell) {
      this.cells.delete(cell.id);
      this.ownCells.delete(cell.id);
      const isMyCell = this.myCellIds.has(cell.id);
      if (isMyCell) {
        this.myCellIds.delete(cell.id);
        if (this.isPlay && this.myCellIds.size === 0) {
          this.isPlay = false;
        }
      }
    }
  }
  handleMessages(message) {
    let offset = 0;
    const view = new DataView(message.buffer);
    const opcode = view.getUint8(offset++);
    switch (opcode) {
      case 16:
        {
          const eatRecordLength = view.getUint16(offset, true);
          offset += 2;
          for (let i = 0; i < eatRecordLength; i++) {
            const eaterID = view.getUint32(offset, true);
            offset += 4;
            const victimID = view.getUint32(offset, true);
            offset += 4;
            const eater = this.cells.get(eaterID);
            const victim = this.cells.get(victimID);
            this.eatCellEvent(eater, victim);
          }
          while (true) {
            const id = view.getUint32(offset, true);
            offset += 4;
            if (id === 0) break;
            const targetX = this.receiveX(view.getInt32(offset, true));
            offset += 4;
            const targetY = this.receiveY(view.getInt32(offset, true));
            offset += 4;
            const size = view.getUint32(offset, true);
            offset += 2;
            const flags = view.getUint8(offset++);
            const extendedFlags = flags & 128 ? view.getUint8(offset++) : 0;
            const color = flags & 2 ? view.getUint32(offset++, true) | view.getUint32(offset++, true) << 8 | view.getUint32(offset++, true) << 16 : null;
            if (flags & 4) while (view.getInt8(offset++) !== 0) {
              /* intentionally left empty */
            }
            const nameLength = flags & 8 ? World.strlen(view, offset) : 0;
            const name = nameLength ? World.decoder.decode(new Uint8Array(view.buffer, offset, nameLength - 1)) : null;
            offset += nameLength;
            const accountID = extendedFlags & 4 ? (offset += 4, view.getUint32(offset - 4, true)) : 0;
            const isNew = !this.cells.has(id);
            const cell = this.cells.get(id) || this.cells.set(id, new Cell()).get(id);
            if (isNew) {
              cell.construct(id, color, accountID);
              name !== null && cell.setName(name);
              this.cells.set(id, cell);
            }
            name !== null && cell.setName(name);
            if (accountID !== 0) cell.accountID = accountID;
            if (this.myCellIds.has(id)) {
              this.targetX = targetX;
              this.targetY = targetY;
            }
            if (this.myCellIds.has(id) && !this.ownCells.has(id)) {
              this.ownCells.set(id, cell);
              this.isPlay = true;
            }
            cell.setTarget(targetX, targetY, size);
          }
          const removeLength = view.getUint16(offset, true);
          offset += 2;
          for (let i = 0; i < removeLength; i++) {
            const removedID = view.getUint32(offset, true);
            offset += 4;
            this.removeCell(this.cells.get(removedID));
          }
        }
        break;
      case 64:
        const minx = view.getFloat64(offset, true);
        offset += 8;
        const miny = view.getFloat64(offset, true);
        offset += 8;
        const maxx = view.getFloat64(offset, true);
        offset += 8;
        const maxy = view.getFloat64(offset, true);
        if (!this.mapOffsetFixed) {
          this.offsetX = (minx + maxx) / 2;
          this.offsetY = (miny + maxy) / 2;
          this.borderX = maxx - minx;
          this.borderY = maxy - miny;
          this.setMapOffset(minx, miny, maxx, maxy);
          this.mapOffsetFixed = true;
        }
        break;
    }
  }
  setMapOffset(left, top, right, bottom) {
    const isAgar = this.ws.url.includes('minic');
    if (right - left > 14000 && bottom - top > 14000 || !isAgar) {
      if (this.mapOffsetFixed) return;
      if (isAgar) {
        const side = 14142;
        this.mapShrinkW = side / (right - left);
        this.mapShrinkH = side / (bottom - top);
        left = this.shrinkX(left);
        top = this.shrinkY(top);
        right = this.shrinkX(right);
        bottom = this.shrinkY(bottom);
      }
      this.mapShiftY = 0;
      this.mapShiftX = 0;
      const prX = -(right - left) * 0.5;
      const prY = -(bottom - top) * 0.5;
      const diffX = prX - left;
      const diffY = prY - top;
      this.mapShiftX = -diffX;
      this.mapShiftY = -diffY;
      left = this.shiftX(left);
      top = this.shiftY(top);
      right = this.shiftX(right);
      bottom = this.shiftY(bottom);
      this.mapOffsetX = (right - left) * 0.5 - right;
      this.mapOffsetY = (bottom - top) * 0.5 - bottom;
      this.mapMinX = left;
      this.mapMinY = top;
      this.mapMaxX = right;
      this.mapMaxY = bottom;
      this.mapMidX = (this.mapMaxX + this.mapMinX) * 0.5;
      this.mapMidY = (this.mapMaxY + this.mapMinY) * 0.5;
      this.mapSizeH = this.mapMaxX - this.mapMinX;
      this.mapSizeV = this.mapMaxY - this.mapMinY;
      if (!this.mapOffsetFixed) {
        this.viewX = (right + left) * 0.5;
        this.viewY = (bottom + top) * 0.5;
      }
      this.mapOffsetFixed = true;
    } else {}
  }
  ghostCells(view, offset) {
    this.minimap = [];
    let x = 0,
      y = 0,
      mass = 0;
    const length = view.getUint16(offset, true);
    offset += 2;
    for (let i = 0; i < length; i++) {
      x = this.receiveX(view.getInt32(offset, true));
      offset += 4;
      y = this.receiveY(view.getInt32(offset, true));
      offset += 4;
      mass = view.getUint32(offset, true);
      offset += 5;
      this.minimap.push({
        x: x,
        y: y,
        size: ~~Math.sqrt(100 * mass),
        mass: mass
      });
    }
  }
  unshrinkX(x) {
    return x / this.mapShrinkW;
  }
  unshrinkY(y) {
    return y / this.mapShrinkH;
  }
  shrinkX(x) {
    return x * this.mapShrinkW;
  }
  shrinkY(y) {
    return y * this.mapShrinkH;
  }
  unshiftX(x) {
    return x - -this.mapShiftX;
  }
  unshiftY(y) {
    return y - -this.mapShiftY;
  }
  shiftX(x) {
    return x - this.mapShiftX;
  }
  shiftY(y) {
    return y - this.mapShiftY;
  }
  invflipX(x) {
    return this.mirrorH ? x : this.mapMaxX - (x - this.mapMinX);
  }
  invflipY(y) {
    return this.mirrorV ? y : this.mapMaxY - (y - this.mapMinY);
  }
  flipX(x) {
    return !this.mirrorH ? x : this.mapMaxX - (x - this.mapMinX);
  }
  flipY(y) {
    return !this.mirrorV ? y : this.mapMaxY - (y - this.mapMinY);
  }
  receiveX(x) {
    x = this.shrinkX(x);
    x = this.shiftX(x);
    x = this.flipX(x);
    return x;
  }
  receiveY(y) {
    y = this.shrinkY(y);
    y = this.shiftY(y);
    y = this.flipY(y);
    return y;
  }
  serverX(x) {
    x = this.flipX(x);
    x = this.unshiftX(x);
    x = this.unshrinkX(x);
    return x;
  }
  serverY(y) {
    y = this.flipY(y);
    y = this.unshiftY(y);
    y = this.unshrinkY(y);
    return y;
  }
  drawMinimap(ctx, canvas, clear = true) {
    function safe(number) {
      return number == 0 ? 1 : number;
    }
    if (clear) ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.5;
    this.minimap.forEach(cell => {
      const x = safe(cell.x + this.borderX / 2) / this.borderX * canvas.width;
      const y = safe(cell.y + this.borderY / 2) / this.borderY * canvas.height;
      const size = cell.size / this.borderX * canvas.width + 1;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    const playerX = safe(this.targetX + this.borderX / 2) / this.borderX * canvas.width;
    const playerY = safe(this.targetY + this.borderY / 2) / this.borderY * canvas.height;
    ctx.fillStyle = '#00bfff';
    ctx.beginPath();
    ctx.arc(playerX, playerY, 5, 0, Math.PI * 2);
    ctx.fill();
    const sectorSizeX = canvas.width / 5;
    const sectorSizeY = canvas.height / 5;
    const sectorCol = Math.floor(playerX / sectorSizeX);
    const sectorRow = Math.floor(playerY / sectorSizeY);
    const activeSectorIndex = sectorRow * 5 + sectorCol;
    return Number.isFinite(activeSectorIndex) ? activeSectorIndex : -1;
  }
  initialize() {
    if (this.websocketHooked) return console.error('Error: WebSocket already hooked');
    this.websocketHooked = true;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    class WS extends window.WebSocket {
      constructor(url, protocols) {
        const errorStack = new Error().stack;
        const isAgar = /wasm:\/\/|wasm-function|WebAssembly.instantiate/.test(errorStack);
        const isAgarServer = url.includes('minic');
        if (isAgar && !isAgarServer) {
          // window['core'].disableIntegrityChecks(true);
        }
        if (isAgar) self.emit('beforeConnect', url, isAgarServer);
        super(url, protocols);
        if (isAgar) Promise.resolve().then(() => self.overWriteWS(this));
      }
    }
    WS.injectedOnce = false;
    window.WebSocket = WS;
  }
}
World.decoder = new TextDecoder('utf-8');
World.strlen = (view, offset) => {
  let length = 0;
  while (view.getUint8(offset + length++) !== 0) {}
  return length;
};
;// ./dev/src/App.ts
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};










class App {
  display_vue() {
    return find_node(window['agarApp'].home, (child, depth) => {
      var _a;
      console.log(child, (_a = child === null || child === void 0 ? void 0 : child.$vnode) === null || _a === void 0 ? void 0 : _a.tag);
      return true;
    });
  }
  constructor() {
    this.minimapPlayers = [];
    this.sampler = new Sampler();
    this.performance_now = 0; // for speedhack
    this.timer_mp = 1; // time multiplier
    this.sector = 5;
    this.stopmovement = false;
    /*** camera zoom ****/
    this.scale = 1;
    /** target cursor world */
    this.mouse = {
      x: 0,
      y: 0
    };
    /** cursor on canvas display */
    this.mouseDisplay = {
      x: 0,
      y: 0
    };
    /** world camera position */
    this.camera = {
      x: 0,
      y: 0
    };
    this.state = (0,Eventify.EventObject)({
      play: false,
      pause: false,
      ws: '',
      nextWs: '',
      waitForSpawn: false,
      isLoggedIn: false
    });
    this.memory = (0,Eventify.EventObject)({
      skinUrl: ''
    });
    /** vue ui */
    this.mainui = null;
    /** exposed emscripten module */
    this.emsc = null;
    /** exposed $hxClasses */
    this.hx = null;
    this.userID = Math.random().toString(36).slice(2, 10);
    this.observerPatcher = e => {
      const randomKey = 'app_' + Math.random().toString(36).slice(2, 10);
      window[randomKey] = this;
      const app = 'window.' + randomKey;
      const replacements = {
        registerSkin: [[/("\s?registerSkin\s?"\s?:\s?function\s?\(\s?(.+?)\s?,\s?(.+?)\s?,\s?(.+?)\s?,\s?(.+?)\s?,\s?(.+?)\s?\)\s?\{\s?)/i, `$1${app}.onRegisterSkin($2,$3,$4,$5,$6);`]],
        onConnect: [[/(;..?\s?\.\s?onopen\s?=\s?function\s?\(\s?\)\s?\{\s?)/i, `$1${app}.onConnect(this.url, this);`]],
        mobileData: [[/(\s?if\s?\(\s?window\s?\[\s?"\s?MC\s?"\s?]\s?&&\s?window\s?\[\s?"\s?MC\s?"\s?]\s?\[\s?"\s?onMobileData\s?"\s?]\s?\)\s?window\s?\[\s?"\s?MC\s?"\s?]\s?\[\s?"\s?onMobileData\s?"\s?]\s?\(\s?(.+?)\s?\))/i, `$2=${app}.onPacket($2);$1`]],
        'Emscripten hook': [[/(\w+)\W+instantiateWasm/, `(${app}.onEmscripten($1)), $&`]],
        'Mouse hook': [[/("\s?setTarget\s?"\s?:\s?function\s?\(\s?(.+?)\s?,\s?(.+?)\s?\)\s?\{\s?)/i, `$1 var [$2, $3] = ${app}.syncMouse($2, $3);`]],
        'Player Zoom': [[/("\s?playerZoom\s?"\s?:\s?function\s?\(\s?(.+?)\s?\)\s?\{\s?)/i, `$1$2=${app}.onPlayerZoom($2);`]],
        'WebSocket onclose': [[/(;..?\s?\.\s?onclose\s?=\s?function\s?\(\s?\)\s?\{\s?)/i, `$1${app}.onDisconnect(this);`]],
        'WebSocket onerror': [[/(;..?\s?\.\s?onerror\s?=\s?function\s?\(\s?\)\s?\{\s?)/i, `$1${app}.onDisconnect(this);`]],
        'Binary Patch': [[/(instantiate\(\s?)([^,]+)/, `$1${app}.patchWasm($2)`]],
        something: [[/([a-z]{6}\s?[a-z|A-Z]{16}\s?\(\s?([a-z]{6})\s?,\s?[a-z|A-Z]{10}\s?,\s?[a-z|A-Z]{7}\s?,\s?[a-zA-Z]{8}\s?\)\s?\{\s?)/i, '$1$2=true;']]
      };
      for (const [name, array] of Object.entries(replacements)) {
        let current = 0;
        for (const [regexp, replacer] of array) {
          if (regexp.test(e)) {
            e = e.replace(regexp, replacer);
            current++;
          } else {
            console.log(`[Not Found - ${current}]: `, name);
          }
        }
      }
      return e;
    };
    this.calls = [];
    this.world = new World(this);
    this.world.on('beforeConnect', this.beforeConnect.bind(this));
    setInterval(() => {
      if (!this.world.ownCells.size) return;
      const offsetX = ~(this.camera.x + this.world.offsetX);
      const offsetY = ~(this.camera.y + this.world.offsetY);
      const myCell = this.world.ownCells.values().next().value;
    }, 1000);
    const storageName = 'lite_settings';
    settings.settings.import(Object.assign(Object.assign({}, settings.settings.export()), storage.get(storageName)));
    settings.settings.on('*', _ => {
      storage.set(storageName, settings.settings.export());
    });
    Object.assign(this.memory, storage.get('memory'));
    this.memory.on('*', () => {
      console.log('nick', this.memory);
      storage.set('memory', this.memory);
    });
    // this.memory.on('skinUrl', () => {
    //     // @ts-ignore
    //     if (this.memory.skinUrl)
    //         try {
    //             window['core'].registerSkin(
    //                 document.getElementById('nick').value,
    //                 null,
    //                 this.memory.skinUrl,
    //                 2,
    //                 null
    //             );
    //         } catch (e) {}
    // })();
    exposeHxClasses().then(hx => {
      this.hx = hx;
      const patchHxCore = this.patchHxCore.bind(this);
      overrideMethod(hx.Core, 'init', function (o, args) {
        o.apply(this, args);
        patchHxCore();
      });
    });
    this.initObserver().then(() => {
      this.world.initialize();
      this.waitCore().then(() => {
        this.handleCoreInit();
      });
    });
    overrideMethod(window.console, 'log', function (o, args) {
      var _a, _b;
      if ((_b = (_a = args[0]).startsWith) === null || _b === void 0 ? void 0 : _b.call(_a, '       ,,,,,')) return window.console.log = o;
      return o.apply(this, args);
    });
  }
  patchHxCore() {
    const onDc = () => {
      if (!this.hx.Core.ui.network.connected) this.connect('wss://imsolo.pro:2102');
    };
    const core = this.hx.Core;
    const state = this.state;
    /** Patch disconnect dialog */
    overridePrototype(core.views, 'openView', function (o) {
      return function () {
        const [targetView, options] = arguments;
        targetView.allowDisableClose = false;
        targetView.closeOnEscape = true;
        targetView.debugui = true;
        if (targetView.state === 'disconnected_dialog') {
          options.allowClickClose = true;
          setTimeout(onDc, 5000);
        }
        return o.apply(this, arguments);
      };
    });
    /** Fix broken skin preview */
    overridePrototype(core.services.gameui, 'setUserSkin', function (o) {
      return function () {
        const [targetSkin] = arguments;
        arguments[0] = targetSkin ? targetSkin + '?' : targetSkin;
        return o.apply(this, arguments);
      };
    });
    /** Fix no servers response, or force server selection */
    overridePrototype(core.ui.network, 'makeMasterRequest', function (o) {
      return function () {
        const nextServer = state.nextWs;
        if (nextServer) {
          const response = {
            endpoints: {
              http: nextServer,
              https: nextServer
            },
            status: 'ok',
            count: 0
          };
          state.nextWs = '';
          return arguments[2](JSON.stringify(response));
        }
        return o.apply(this, arguments);
      };
    });
    /** Disable menu appearing on respawn */
    overridePrototype(core, 'dispatchDocumentEvent', function (o) {
      return function () {
        const [eventName, detail] = arguments;
        if (eventName === 'game_over') {
          if (settings.settings.proxy.AutoRespawn) return;
        }
        return o.apply(this, arguments);
      };
    });
  }
  loadAndPatchCore(url, resolve) {
    return __awaiter(this, void 0, void 0, function* () {
      // Backup
      // overrideMethod(window, 'fetch', function (o, args) {
      //     if (typeof args[0] === 'string' && args[0].includes('.core.wasm')) {
      //         args[0] = new URL('../../static/renamed.core.wasm', import.meta.url).toString();
      //     }
      //     const r = o.apply(this, args);
      //     return r;
      // });
      try {
        const request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.onload = () => {
          const patchedText = this.observerPatcher(request.responseText);
          const blob = new Blob([patchedText], {
            type: 'text/javascript'
          });
          const blobURL = URL.createObjectURL(blob);
          const script = document.createElement('script');
          script.id = 'agario.core.js';
          script.src = blobURL;
          script.onload = () => {
            URL.revokeObjectURL(blobURL);
            resolve();
          };
          document.body.appendChild(script);
        };
        request.send();
      } catch (error) {
        console.error('[ERROR] Failed to load and patch core:', error);
      }
    });
  }
  initObserver() {
    const deferred = (0,Eventify.deferrify)();
    const observer = new window.MutationObserver(mtRecs => {
      var _a;
      for (const mtRec of mtRecs) {
        for (let i = 0; i < mtRec.addedNodes.length; i++) {
          const elem = mtRec.addedNodes[i];
          const [t] = elem.src && elem.src.match(/agario\.core\.js.+/i) || [];
          if (t) {
            observer.disconnect();
            elem.remove();
            (_a = elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
            this.loadAndPatchCore(t, deferred.resolve);
          }
        }
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    return deferred.promise;
  }
  patchWasm(u) {
    let anyFail = false;
    const bytes = hex => hex.split(' ').map(b => parseInt(b, 16));
    const original = new Uint8Array(u);
    const patchedUint8Array = applyPatch(original, [{
      pattern: bytes('D4 01 2D 00 00 45 0D 00 20 02 10 0F 20 01 20 02 10 1E 21 01'),
      payload: bytes('20 00 28 02 1C 45 04 40 0F 0B'),
      type: 'insertAfter'
    }, {
      pattern: bytes('00 0B 37 03 00 20 00 20 04 37 03 08 20 03 41 10 6A 24 00 0B'),
      payload: bytes('8A'),
      type: 'replaceAfter'
    }, {
      pattern: bytes('41 1B 6C 41 01 6A 73 3A 00 07 20 1F BF 44 00 00 00 00 00 00'),
      payload: bytes('00 00'),
      type: 'replaceAfter'
    }], () => anyFail = true);
    if (anyFail) return u;
    const fixed = autoFixCodeSectionSize(original, patchedUint8Array);
    return fixed.buffer;
  }
  waitCore() {
    return __awaiter(this, void 0, void 0, function* () {
      const deferred = (0,Eventify.deferrify)();
      addEventListener('core_init_complete', () => {
        var _a;
        if (!window['core']) {
          // backup event
          if ((_a = window['MC']) === null || _a === void 0 ? void 0 : _a['onAgarioCoreLoaded']) {
            const old_loaded = window['MC']['onAgarioCoreLoaded'];
            window['MC']['onAgarioCoreLoaded'] = function () {
              deferred.resolve();
              window['MC']['onAgarioCoreLoaded'] = old_loaded;
              return old_loaded.apply(this, arguments);
            };
            return;
          }
          // deadline mode
          Object.defineProperty(window, 'core', {
            get: () => window['_core'],
            set: value => (window['_core'] = value, deferred.resolve())
          });
          return;
        }
        deferred.resolve();
      });
      addEventListener('event_regions_update', () => __awaiter(this, void 0, void 0, function* () {}));
      // let rafRequest: any = null;
      // function watchVue() {
      //     rafRequest = requestAnimationFrame(() => {
      //         if (window['agarApp']) cancelAnimationFrame(rafRequest);
      //         coreAdsPatch();
      //     });
      // }
      // watchVue();
      // Object.defineProperty(window, 'mcReady', {
      //     get: () => () => {},
      //     set: () => {}
      // });
      return deferred.promise;
    });
  }
  handleCoreInit() {
    coreInitPatch();
    coreAdsPatch();
    // fixNoServers();
    coreUiPatch();
    this.init();
    this.onCoreInit();
    initLiteui(this);
  }
  modifyScore(sourceString) {
    if (!this.state.play) sourceString = '';
    return `${sourceString}`;
  }
  init() {
    const modifyScore = this.modifyScore.bind(this);
    const onPlayerSpawn = this.onPlayerSpawn.bind(this);
    const onPlayerDeath = this.onPlayerDeath.bind(this);
    // timelord.activate();
    // this.performance_now = window.performance['_now']();
    // const updateRealTime = (realTime_ms: number) => {
    //     const dt = realTime_ms - this.performance_now;
    //     timelord.stepTime(dt * (settings.proxy.AnimationDelay / 100), dt * this.timer_mp);
    //     this.performance_now = realTime_ms;
    //     window['_requestAnimationFrame'](updateRealTime);
    // };
    // updateRealTime(this.performance_now);
    overridePrototype(CanvasRenderingContext2D.prototype, 'fillText', o => {
      return function () {
        if (arguments[0].includes('Scor')) {
          arguments[0] = modifyScore(arguments[0]);
        } else if (arguments[0].startsWith('Leaderboard')) {
          arguments[0] = settings.settings.proxy.LeaderboardTitle;
        }
        return o.apply(this, arguments);
      };
    });
    overridePrototype(CanvasRenderingContext2D.prototype, 'measureText', o => {
      return function () {
        if (arguments[0].includes('Scor')) {
          arguments[0] = modifyScore(arguments[0]);
        }
        return o.apply(this, arguments);
      };
    });
    overrideMethod(window['MC'], 'onPlayerSpawn', function (o, args) {
      o.apply(this, args);
      onPlayerSpawn(...args);
    });
    overrideMethod(window['MC'], 'onPlayerDeath', function (o, args) {
      o.apply(this, args);
      onPlayerDeath(...args);
    });
  }
  onEmscripten(Module) {
    var _a, _b;
    this.emsc = Module;
    makeGLobal('emsc', Module);
    console.log('emsc', Module);
    this.canvas = document.getElementById('canvas');
    const ctx = this.canvas.getContext('2d');
    const world = this.world;
    function numberIsInRange(value, min, max) {
      return value >= min && value <= max;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const traceCalls = ['clearRect', 'drawImage', 'fillText', 'strokeText', 'fillRect', 'strokeRect',
    // 'beginPath',
    'moveTo',
    // 'lineTo',
    // 'arc',
    'scale', 'save', 'restore', 'translate', 'transform', 'setTransform'];
    let gotScale = false;
    let callNumber = -1;
    traceCalls.forEach(method => {
      // @ts-ignore
      overrideMethod(ctx, method, function (o, args) {
        callNumber++;
        // self.calls.push(method);
        // if (callNumber === 3)  console.log('scale', ...args);
        // if (callNumber === 2) {
        //     console.log('translate', ...args);
        // }
        // if (numberIsInRange(callNumber - 1, 1, 7))  function () {}; // Off grid
        const cmd = o.apply(ctx, args);
        return cmd;
      });
    });
    overrideMethod(ctx, 'scale', function (o, args) {
      if (!gotScale) {
        gotScale = true;
        self.scale = args[0];
      }
      const cmd = o.apply(ctx, args);
      return cmd;
    });
    // if (callNumber == 9) console.log('canvas', args[0], args[1]);
    // if (callNumber == 11) console.log('cam', args[0], args[1]);
    overrideMethod(ctx, 'drawImage', function (o, args) {
      let dx = 0,
        dy = 0,
        dw = 0,
        dh = 0;
      if (args.length == 9) {
        dx = args[5];
        dy = args[6];
        dw = args[7];
        dh = args[8];
      } else if (args.length == 3) {
        dx = args[1];
        dy = args[2];
      }
      const cmd = o.apply(ctx, args);
      return cmd;
    });
    /*** Camera hook ***/
    let translateCall = -1;
    overrideMethod(ctx, 'translate', function (o, args) {
      translateCall++;
      if (translateCall == 2) {
        self.camera.x = args[0];
        self.camera.y = args[1];
        self.drawBackground(ctx, world, o);
      }
      return o.apply(ctx, args);
    });
    /*** Before render ***/
    (_a = Module['preMainLoop']) !== null && _a !== void 0 ? _a : Module['preMainLoop'] = () => {};
    overrideMethod(Module, 'preMainLoop', (o, args) => {
      this.calls = [];
      o.apply(this, args);
    });
    /*** After render ***/
    (_b = Module['postMainLoop']) !== null && _b !== void 0 ? _b : Module['postMainLoop'] = () => {};
    overrideMethod(Module, 'postMainLoop', (o, args) => {
      this.sampler.step();
      callNumber = -1;
      translateCall = -1;
      gotScale = false;
      this.drawHud(ctx);
      o.apply(this, args);
    });
  }
  onRegisterSkin() {
    // console.log('register skin', arguments);
  }
  onCoreInit() {
    settings.settings.on('AcidMode', v => {
      window['core'].setAcid(v);
    })(settings.settings.proxy.AcidMode);
    /** COINS COLLECTION */
    {
      const collectCoins = () => {
        if (this.state.isLoggedIn && settings.settings.proxy.AutoCollectCoins) {
          window['agarApp'].API.getFreeCoins();
          window['agarApp'].API.closeTopView();
        }
      };
      addEventListener('login', () => this.state.isLoggedIn = true);
      addEventListener('logout', () => this.state.isLoggedIn = false);
      addEventListener('free_coins_timer', collectCoins);
      this.state.on('isLoggedIn', collectCoins);
      settings.settings.on('AutoCollectCoins', collectCoins)();
    }
  }
  get menuShow() {
    if (!this.mainui) this.mainui = find_node(window['agarApp'].home, child => {
      var _a, _b;
      return (_b = (_a = child.$vnode) === null || _a === void 0 ? void 0 : _a.tag) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('mainui');
    })[0];
    if (!this.mainui) return false;
    return this.mainui.menuShow;
  }
  beforeConnect(url, isAgar) {}
  onConnect(url) {
    console.log('Connected', url);
    this.state.ws = url;
    //onconnect
    if (this.state.waitForSpawn) {
      window['MC'].playGame();
      this.state.waitForSpawn = false;
    }
    // window['core'].setFadeout(false);
    // window['core'].setFadeout = () => {};
    this.disableMenuBackground();
    if (this.hx) {
      this.hx.Core.ui.network.set_connecting(false);
      this.hx.Core.ui.network.set_connected(true);
      this.hx.Core.disconnectDialog && this.hx.Core.closeDisconnectDialog();
      // this.hx.Core.views.closeAllViews();
      this.hx.Core.onConnect();
      if (!this.world.isAgar) {
        /** Add posibility to play custom server */
        const detail = {
          id: '11111111-2222-3333-4444-555555555555',
          name: 'Guest',
          isPayingUser: true,
          // <-- true for no ads
          avatarUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=',
          level: 100,
          currentXp: 500000,
          totalXp: 500000,
          realm: ['Guest', 2],
          isNewUser: false,
          hasLoggedIntoMobile: false
        };
        const ev = new CustomEvent('update_user_info', {
          detail
        });
        document.dispatchEvent(ev);
      }
      // window['MC'].onConnect();
    }
    // ('login_state_update');
    // const details = { login: 'IN', connected: true };
    // this.hx.Core.loginState = ['IN', 1];
    // this.hx.Core.onUserLoggedIn();
    // Core.get_states().disable("state_main_screen");
  }
  disableMenuBackground() {
    if (!this.world.isAgar) return;
    this.emsc._ac_special_on();
    window['core'].setFpsCap(-1);
    window['core'].setFadeout(false);
    requestAnimationFrame(() => {
      window['core'].setFadeout(true);
    });
    this.emsc._ac_spectate();
  }
  spectate() {
    var _a;
    (_a = find_node(undefined, child => child === null || child === void 0 ? void 0 : child.spectate)[0]) === null || _a === void 0 ? void 0 : _a.spectate();
  }
  integrityChecksEnable(isEnabled) {
    window['core'].disableIntegrityChecks(!isEnabled);
  }
  // ws://localhost:8089?i
  // ws://127.0.0.1:8089?i
  connect(url) {
    const isOfficial = url.includes('minic');
    const integrityChecksEnabled = url.includes('?i');
    this.integrityChecksEnable(isOfficial || integrityChecksEnabled);
    if (window['raga'] && url.indexOf('raga') > -1) {
      window['raga'].isSwitchingGameMode = true;
      window['raga'].gameMode = 'ragaffa-16x';
    }
    const urlParsed = new URL(url);
    const host = urlParsed.host + urlParsed.pathname + urlParsed.search;
    // Hack to enable insecure ws connection
    const isSecure = urlParsed.protocol === 'wss:';
    // this.hx.Core.ui.network._integrityChecksActive = isSecure;
    this.hx.Core.ui.network._isSecure = isSecure;
    this.hx.Core.ui.network._host = host;
    this.hx.Core.ui.network.onFindServerSuccess();
    this.hx.Core.ui.network._isSecure = true;
  }
  respawn() {
    if (this.state.play) {
      this.connect(this.state.ws);
      this.state.waitForSpawn = true;
    } else {
      window['core'].setFadeout(false);
      window['core'].sendSpectate();
      window['MC'].playGame();
      this.state.waitForSpawn = true;
      setTimeout(() => {
        // window['MC'].playGame();
        // window['agarApp'].home.$children[0].$children[0].spectate()
        // window['agarApp'].home.$children[0].$children[0].play()
        // window['agarApp'].home.$children[0].onHideMainMenu()
        // window['agarApp'].home.$children[0].onGameStart()
      }, 200);
    }
  }
  onPlayerSpawn(...args) {
    this.state.play = true;
    this.state.waitForSpawn = false;
  }
  onPlayerDeath(...args) {
    find_node(undefined, child => {
      if (child.fastEntry !== undefined) return true;else return false;
    }).forEach(child => {
      !child.fastEntry && Object.defineProperty(child, 'fastEntry', {
        get: () => true,
        set: x => x
      });
    });
    window['core'].setFadeout(true);
    const setInterval = window['_setInterval'] || window.setInterval;
    const clearInterval = window['_clearInterval'] || window.clearInterval;
    const setTimeout = window['_setTimeout'] || window.setTimeout;
    const clearTimeout = window['_clearTimeout'] || window.clearTimeout;
    this.state.play = false;
    this.reset();
    if (!window['agarApp'].home.$children[0].$children[0].showMenu && settings.settings.proxy.AutoRespawn) {
      this.respawn();
      return true;
    } else {
      const prev = this.timer_mp;
      this.timer_mp = 10000;
      setTimeout(() => this.timer_mp = prev, 800);
    }
    // window.setTimeout(MC.showNickDialog, 500);
  }
  onPacket(packet) {
    return packet;
  }
  reset() {
    this.stopmovement = false;
  }
  dumpMem() {
    const blob = new Blob([this['emsc'].buffer]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dump.bin';
    a.click();
    URL.revokeObjectURL(a.href);
  }
  onDisconnect(obj) {
    console.log('disconnected', obj);
    if (settings.settings.proxy.AutoRespawn && this.state.waitForSpawn) {
      this.state.nextWs = this.state.ws;
    }
    setTimeout(() => {
      if (this.state.nextWs && this.hx.Core.ui.network.connecting === false && this.hx.Core.ui.network.connected === false) {
        this.connect(this.state.nextWs);
      }
    });
  }
  onPlayerZoom(zoom) {
    return zoom;
  }
  syncCamera(x, y) {
    this.camera.x = x;
    this.camera.y = y;
  }
  syncMouse(mouseDisplayX, mouseDisplayY) {
    this.mouseDisplay.x = mouseDisplayX;
    this.mouseDisplay.y = mouseDisplayY;
    this.calcMosuseWorld();
    if (this.state.pause) {
      return [this.canvas.width / 2, this.canvas.height / 2];
    }
    return [mouseDisplayX, mouseDisplayY];
  }
  calcMosuseWorld() {
    const camX = this.camera.x + this.world.offsetX;
    const camY = this.camera.y + this.world.offsetY;
    const canvasCenterX = this.canvas.width / 2;
    const canvasCenterY = this.canvas.height / 2;
    this.mouse.x = -((canvasCenterX - this.mouseDisplay.x) / this.scale + camX);
    this.mouse.y = -((canvasCenterY - this.mouseDisplay.y) / this.scale + camY);
  }
  renderLoop() {}
  drawBackground(ctx, world, translate = ctx['translate']) {
    const offsetX = this.camera.x + this.world.offsetX;
    const offsetY = this.camera.y + this.world.offsetY;
    const initialAlpha = ctx.globalAlpha;
    translate(offsetX, offsetY);
    /*** Map Border ****/
    if (settings.settings.proxy.MapBorder) {
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 20;
      ctx.fillStyle = 'green';
      ctx.strokeRect(this.world.mapMinX, this.world.mapMinY, this.world.mapSizeH, this.world.mapSizeV);
      ctx.globalAlpha = initialAlpha;
    }
    const parselw = this.world.mapSizeH / this.sector;
    const parselh = this.world.mapSizeV / this.sector;
    /*** Map Sectors ****/
    if (settings.settings.proxy.MapSectors) {
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = 'green';
      ctx.globalAlpha = 0.2;
      for (let zi = 1; zi < this.sector; zi++) {
        ctx.moveTo(this.world.mapMinX, this.world.mapMinY + parselw * zi);
        ctx.lineTo(this.world.mapMaxX, this.world.mapMinY + parselw * zi);
        ctx.moveTo(this.world.mapMinX + parselh * zi, this.world.mapMinY);
        ctx.lineTo(this.world.mapMinX + parselh * zi, this.world.mapMaxY);
      }
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = initialAlpha;
    }
    /*** Sector Label ****/
    if (settings.settings.proxy.MapSectorLabels) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = parselw / 2.8 + 'px Segoe Print';
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = 'green';
      const bucw = parselw / 2,
        buch = parselh / 2;
      for (let sat = 0; sat < this.sector; sat++) {
        const label = String.fromCharCode(65 + sat);
        for (let sut = 0; sut < this.sector; sut++) {
          ctx.fillText(label + (sut + 1), this.world.mapMinX + parselw * sut + bucw, this.world.mapMinY + parselh * sat + buch);
        }
      }
      ctx.globalAlpha = initialAlpha;
    }
    /*** C3 sign ****/
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '380px Segoe Print';
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#808080';
    ctx.fillText('Doublesplit', 0, 0);
    ctx.globalAlpha = initialAlpha;
    translate(-offsetX, -offsetY);
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    // ctx.scale(1 / this.zoomvalue, 1 / this.zoomvalue);
    // ctx.fillRect(0, 0 + ctx.canvas.height / 2 - 150, 200, 100);
    // ctx.scale(this.zoomvalue, this.zoomvalue);
    return;
    /*** Mini Map ****/
    if (false) {
      const minimapWidth = 100;
      const minimapHeight = 100;
      const mapMinX = this.world.mapMinX;
      const mapMinY = this.world.mapMinY;
      const mapMaxX = this.world.mapMaxX;
      const mapMaxY = this.world.mapMaxY;
      const mapWidth = this.world.mapSizeH;
      const mapHeight = this.world.mapSizeV;
      const viewX = this.camera.x;
      const viewY = this.camera.y;
      const mw = minimapWidth / 5;
      const blurrylines = 0;
      let leftrate = (viewX - mapMinX) / mapWidth;
      let toprate = (viewY - mapMinY) / mapHeight;
      let minileft = Math.round(minimapWidth * leftrate * 100) / 100;
      let minitop = Math.round(minimapHeight * toprate * 100) / 100;
      ctx.beginPath();
      ctx.clearRect(0, 0, minimapWidth, minimapHeight);
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'blue'; //settings.raw.border.string;
      ctx.strokeRect(blurrylines + mw, blurrylines + mw, minimapWidth - mw * 2, minimapHeight - mw * 2);
      ctx.strokeRect(blurrylines + mw * 2, blurrylines + mw * 2, minimapWidth - mw * 4, minimapHeight - mw * 4);
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'red'; //settings.raw.miniblob.string;
      ctx.arc(minileft, minitop, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = 'red';
      leftrate = minimapWidth / mapWidth;
      toprate = minimapHeight / mapHeight;
      minileft = Math.round((mapWidth / 2 + (this.mouse.x - offsetX)) * leftrate);
      minitop = Math.round((mapHeight / 2 + (this.mouse.y - offsetY)) * toprate);
      ctx.arc(minileft, minitop, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }
  drawHud(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, 0, 0);
  }
}
// if ('hot' in module) {
//     // @ts-ignore
//     module['hot'].decline();
//     // @ts-ignore
//     module['hot'].dispose(() => {
//         location.reload();
//     });
// }
;// ./dev/src/dev.ts

function enableVueDevtools() {
  overrideMethod(window.Object, 'defineProperty', (originalMethod, args) => {
    if (args[1] === 'config') {
      const orig_getter = args[2].get;
      args[2].get = function () {
        const vueConfig = orig_getter();
        vueConfig.devtools = true;
        vueConfig.productionTip = true;
        return () => vueConfig;
      };
      window.Object.defineProperty = originalMethod;
    }
    return originalMethod.apply(window.Object, args);
  });
}
function enableFastCanvasView() {
  Object.defineProperty(window.HTMLCanvasElement.prototype, 'aaa', {
    get() {
      this.toBlob(blob => {
        const blobUrl = URL.createObjectURL(blob);
        createPopupWin(blobUrl, 'Canvas', 800, 600);
      });
      return 1;
    }
  });
}
function createPopupWin(pageURL, pageTitle, popupWinWidth, popupWinHeight) {
  const left = (screen.width - popupWinWidth) / 2;
  const top = (screen.height - popupWinHeight) / 4;
  return window.open(pageURL, pageTitle, 'resizable=yes, width=' + popupWinWidth + ', height=' + popupWinHeight + ', top=' + top + ', left=' + left);
}
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./dev/src/ui/minimap.css
var minimap = __webpack_require__(767);
;// ./dev/src/ui/minimap.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(minimap["default"], options);




       /* harmony default export */ const ui_minimap = (minimap["default"] && minimap["default"].locals ? minimap["default"].locals : undefined);

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].use[2]!./dev/src/ui/style.css
var style = __webpack_require__(397);
;// ./dev/src/ui/style.css

      
      
      
      
      
      
      
      
      

var style_options = {};

style_options.styleTagTransform = (styleTagTransform_default());
style_options.setAttributes = (setAttributesWithoutAttributes_default());
style_options.insert = insertBySelector_default().bind(null, "head");
style_options.domAPI = (styleDomAPI_default());
style_options.insertStyleElement = (insertStyleElement_default());

var style_update = injectStylesIntoStyleTag_default()(style["default"], style_options);




       /* harmony default export */ const ui_style = (style["default"] && style["default"].locals ? style["default"].locals : undefined);

;// ./dev/src/userscripting/Tampermonkey.ts
function registerMenuCommands() {
  const links = [{
    name: '\uD83D\uDF02 Adverisement: Play cell games on Delt.io',
    url: 'https://delt.io'
  }, {
    name: '\uD83D\uDDAD Contact: Delta Discord',
    url: 'https://bit.ly/3RXQXQd'
  }];
  try {
    links.forEach(link => GM.registerMenuCommand(link.name, () => window.location.href = link.url));
  } catch (e) {}
}
function registerCheckUpdates() {
  GM.registerMenuCommand(`Version: ${GM.info.script.version} - Check for updates`, checkUpdates);
}
function checkUpdates() {
  const url = GM.info.scriptUpdateURL;
  if (!url) return alert('⛔ Error:\nNo update URL found!');
  const version2int = (x = '0') => x.split('.').reduce((n, c, i, a) => n + parseInt(c) * Math.pow(100, a.length - i - 1), 0);
  const req = new Promise(r => GM.xmlHttpRequest({
    method: 'GET',
    url: url,
    onload: r
  }));
  req.then(res => {
    const matches = /\/\/\s*@version\s*(\S+)/im.exec(res.responseText);
    if (!matches) return alert('⛔ Error:\nNo version found!');
    const remoteVersion = version2int(matches[1]);
    const localVersion = version2int(GM.info.script.version);
    if (remoteVersion > localVersion) {
      const msg = `🔔 New version available: ${matches[1]}\n\nDo you want to update?`;
      if (confirm(msg)) {
        const installer = window.open(url, '_blank');
        const i = setInterval(() => {
          if (!installer.closed) return;
          clearInterval(i);
          location.reload();
        }, 100);
      }
    } else {
      alert('👍 You are using the latest version!');
    }
  }).catch(e => {
    console.error(e);
    alert('⛔ Error: Cant fetch update info!\n' + e);
  });
}
function isGM() {
  return typeof GM !== 'undefined' && GM;
}
;// ./dev/src/index.ts







if (window.location.href.includes('agar.io')) {
  enableVueDevtools();
  enableFastCanvasView();
  const app = new App();
  makeGLobal('app', app);
  makeGLobal('find_node', find_node);
  if (isGM() && !window.GM_skipMenu) {
    registerMenuCommands();
    registerCheckUpdates();
  }
} else {
  console.log('This script is intended to run on agar.io only.');
}
})();

MyLibrary = __webpack_exports__;

})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);