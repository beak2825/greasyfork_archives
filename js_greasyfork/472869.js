// ==UserScript==
// @name             hsrSeelieEx
// @name:zh          原神、崩坏：星穹铁道、绝区零规划助手扩展
// @namespace        https://github.com/KeyPJ/seelieEx
// @version          6.0.2
// @author           KeyPJ
// @description:zh   个人想偷懒,不想手动在仙灵 - 规划助手 手动录入角色及其天赋,于是简单整理一个脚本,利用米游社养成计算器api获取角色信息,直接导入至seelie
// @license          MIT
// @homepage         https://github.com/KeyPJ
// @homepageURL      https://github.com/KeyPJ/seelieEx
// @include          https://seelie.me/*
// @include          https://hsr.seelie.me/*
// @include          https://zzz.seelie.me/*
// @require          https://unpkg.com/react@17.0.2/umd/react.production.min.js
// @require          https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js
// @require          https://unpkg.com/localforage@1.10.0/dist/localforage.min.js
// @resource         character      https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/character.json
// @resource         hsr_character  https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/hsr_character.json
// @resource         hsr_weapon     https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/hsr_weapon.json
// @resource         weapon         https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/weapon.json
// @resource         zzz_character  https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/zzz_character.json
// @resource         zzz_weapon     https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/zzz_weapon.json
// @connect          api-takumi.mihoyo.com
// @connect          public-data-api.mihoyo.com
// @grant            GM.xmlHttpRequest
// @grant            GM_getResourceText
// @grant            GM_openInTab
// @grant            GM_registerMenuCommand
// @grant            GM_xmlhttpRequest
// @grant            unsafeWindow
// @run-at           document-end
// @contributionURL  https://github.com/KeyPJ/seelieEx
// @copyright        2021, KeyPJ https://github.com/KeyPJ
// @description 星铁规划助手导入脚本
// @downloadURL https://update.greasyfork.org/scripts/472869/hsrSeelieEx.user.js
// @updateURL https://update.greasyfork.org/scripts/472869/hsrSeelieEx.meta.js
// ==/UserScript==

(r=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=r,document.head.appendChild(t)})(' *,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.pointer-events-none{pointer-events:none}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-x-\\[20\\%\\]{left:20%;right:20%}.inset-y-0{top:0;bottom:0}.left-0{left:0}.right-0{right:0}.top-10{top:2.5rem}.z-10{z-index:10}.z-\\[1200\\]{z-index:1200}.mb-4{margin-bottom:1rem}.mt-1{margin-top:.25rem}.mt-10{margin-top:2.5rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.h-4{height:1rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.max-h-60{max-height:15rem}.min-h-min{min-height:-moz-min-content;min-height:min-content}.w-1\\/2{width:50%}.w-1\\/4{width:25%}.w-11{width:2.75rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-full{width:100%}.min-w-\\[50\\%\\]{min-width:50%}.max-w-md{max-width:28rem}.translate-x-1{--tw-translate-x: .25rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-6{--tw-translate-x: 1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-180{--tw-rotate: 180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-default{cursor:default}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.grid-flow-col{grid-auto-flow:column}.grid-rows-2{grid-template-rows:repeat(2,minmax(0,1fr))}.flex-row{flex-direction:row}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.overflow-auto{overflow:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-blue-400{--tw-border-opacity: 1;border-color:rgb(96 165 250 / var(--tw-border-opacity, 1))}.border-gray-600{--tw-border-opacity: 1;border-color:rgb(75 85 99 / var(--tw-border-opacity, 1))}.border-gray-700{--tw-border-opacity: 1;border-color:rgb(55 65 81 / var(--tw-border-opacity, 1))}.border-purple-700\\/50{border-color:#7e22ce80}.bg-amber-100{--tw-bg-opacity: 1;background-color:rgb(254 243 199 / var(--tw-bg-opacity, 1))}.bg-blue-500{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity, 1))}.bg-blue-600{--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity, 1))}.bg-gray-600{--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity, 1))}.bg-purple-800\\/70{background-color:#6b21a8b3}.bg-purple-900\\/30{background-color:#581c874d}.bg-slate-700\\/50{background-color:#33415580}.bg-slate-800\\/90{background-color:#1e293be6}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-2{padding:.5rem}.p-4{padding:1rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.pb-2{padding-bottom:.5rem}.pl-10{padding-left:2.5rem}.pl-3{padding-left:.75rem}.pr-10{padding-right:2.5rem}.pr-2{padding-right:.5rem}.pr-4{padding-right:1rem}.pt-2{padding-top:.5rem}.pt-4{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-base{font-size:1rem;line-height:1.5rem}.text-sm{font-size:.875rem;line-height:1.25rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.text-amber-600{--tw-text-opacity: 1;color:rgb(217 119 6 / var(--tw-text-opacity, 1))}.text-amber-900{--tw-text-opacity: 1;color:rgb(120 53 15 / var(--tw-text-opacity, 1))}.text-blue-300{--tw-text-opacity: 1;color:rgb(147 197 253 / var(--tw-text-opacity, 1))}.text-gray-100{--tw-text-opacity: 1;color:rgb(243 244 246 / var(--tw-text-opacity, 1))}.text-gray-200{--tw-text-opacity: 1;color:rgb(229 231 235 / var(--tw-text-opacity, 1))}.text-gray-300{--tw-text-opacity: 1;color:rgb(209 213 219 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.text-purple-300{--tw-text-opacity: 1;color:rgb(216 180 254 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}.shadow-2xl{--tw-shadow: 0 25px 50px -12px rgb(0 0 0 / .25);--tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-md{--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.ring-1{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-black{--tw-ring-opacity: 1;--tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity, 1))}.ring-opacity-5{--tw-ring-opacity: .05}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-colors{transition-property:color,background-color,border-color,fill,stroke,-webkit-text-decoration-color;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,-webkit-text-decoration-color;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.ex-flex-col{flex-direction:column}.ex-mx-auto{margin-left:auto;margin-right:auto}.hover\\:bg-amber-100:hover{--tw-bg-opacity: 1;background-color:rgb(254 243 199 / var(--tw-bg-opacity, 1))}.hover\\:bg-blue-500:hover{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity, 1))}.hover\\:bg-purple-700:hover{--tw-bg-opacity: 1;background-color:rgb(126 34 206 / var(--tw-bg-opacity, 1))}.hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:border-indigo-500:focus-visible{--tw-border-opacity: 1;border-color:rgb(99 102 241 / var(--tw-border-opacity, 1))}.focus-visible\\:ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus-visible\\:ring-white:focus-visible{--tw-ring-opacity: 1;--tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity, 1))}.focus-visible\\:ring-opacity-75:focus-visible{--tw-ring-opacity: .75}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.focus-visible\\:ring-offset-orange-300:focus-visible{--tw-ring-offset-color: #fdba74}@media (min-width: 640px){.sm\\:text-sm{font-size:.875rem;line-height:1.25rem}} ');

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(require$$1, ReactDOM2, localforage2) {
  var _a, _b;
  "use strict";
  const App$1 = "";
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === void 0) {
      throw new TypeError("Object.assign cannot be called with null or undefined");
    }
    return Object(val);
  }
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
      var test1 = new String("abc");
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
        return test2[n2];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function(letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  shouldUseNative() ? Object.assign : function(target, source) {
    var from;
    var to2 = toObject(target);
    var symbols;
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to2[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to2[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
    return to2;
  };
  /** @license React v17.0.2
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$1, g = 60103;
  reactJsxRuntime_production_min.Fragment = 60107;
  if ("function" === typeof Symbol && Symbol.for) {
    var h = Symbol.for;
    g = h("react.element");
    reactJsxRuntime_production_min.Fragment = h("react.fragment");
  }
  var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, k) {
    var b, d = {}, e = null, l = null;
    void 0 !== k && (e = "" + k);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (l = a.ref);
    for (b in a)
      n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: g, type: c, key: e, ref: l, props: d, _owner: m.current };
  }
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  const jsx = jsxRuntimeExports.jsx;
  const jsxs = jsxRuntimeExports.jsxs;
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  function ListboxSelect(props) {
    const {
      selected,
      setSelected,
      optionList,
      show,
      className = ""
    } = props;
    const [isOpen, setIsOpen] = require$$1.useState(false);
    const containerRef = require$$1.useRef(null);
    require$$1.useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    const toggleDropdown = (e) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    };
    const handleSelect = (item, e) => {
      e.stopPropagation();
      setSelected(item);
      setIsOpen(false);
    };
    return /* @__PURE__ */ jsxs("div", {
      ref: containerRef,
      className: classNames("relative mt-1 w-full", className),
      children: [/* @__PURE__ */ jsxs("button", {
        type: "button",
        className: "relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm",
        onClick: toggleDropdown,
        children: [/* @__PURE__ */ jsx("span", {
          className: "block truncate text-gray-900",
          children: show(selected)
        }), /* @__PURE__ */ jsx("span", {
          className: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",
          children: /* @__PURE__ */ jsx("svg", {
            className: `w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`,
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsx("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M19 9l-7 7-7-7"
            })
          })
        })]
      }), isOpen && /* @__PURE__ */ jsx("div", {
        className: "absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
        onClick: (e) => e.stopPropagation(),
        children: optionList.map((item, index) => /* @__PURE__ */ jsxs("div", {
          className: `cursor-default select-none relative py-2 pl-10 pr-4 ${selected === item ? "text-amber-900 bg-amber-100" : "text-gray-900 hover:bg-amber-100"}`,
          onClick: (e) => handleSelect(item, e),
          children: [/* @__PURE__ */ jsx("span", {
            className: `block truncate ${selected === item ? "font-medium" : "font-normal"}`,
            children: show(item)
          }), selected === item && /* @__PURE__ */ jsx("span", {
            className: "absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600",
            children: /* @__PURE__ */ jsx("svg", {
              className: "w-5 h-5",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M5 13l4 4L19 7"
              })
            })
          })]
        }, index))
      })]
    });
  }
  function ToggleSwitch(props) {
    const {
      className,
      checked,
      onChange,
      labelLeft,
      labelRight
    } = props;
    return /* @__PURE__ */ jsxs("div", {
      className: `${className} flex flex-row items-center`,
      children: [/* @__PURE__ */ jsx("div", {
        className: "w-1/4 text-gray-200",
        children: labelLeft
      }), /* @__PURE__ */ jsx("div", {
        className: "w-1/2",
        children: /* @__PURE__ */ jsx("button", {
          type: "button",
          className: `relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? "bg-blue-600" : "bg-gray-600"}`,
          onClick: () => onChange(!checked),
          "aria-pressed": checked,
          children: /* @__PURE__ */ jsx("span", {
            className: `inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "w-1/4 text-gray-200",
        children: labelRight
      })]
    });
  }
  var GameType = /* @__PURE__ */ ((GameType2) => {
    GameType2["GENSHIN"] = "genshin";
    GameType2["HSR"] = "hsr";
    GameType2["ZZZ"] = "zzz";
    return GameType2;
  })(GameType || {});
  const GameDomainMap = {
    "hsr.seelie.me": "hsr",
    "zzz.seelie.me": "zzz"
    /* ZZZ */
  };
  var axios$3 = { exports: {} };
  var bind$2 = function bind2(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };
  var bind$1 = bind$2;
  var toString = Object.prototype.toString;
  var kindOf = function(cache) {
    return function(thing) {
      var str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    };
  }(/* @__PURE__ */ Object.create(null));
  function kindOfTest(type) {
    type = type.toLowerCase();
    return function isKindOf(thing) {
      return kindOf(thing) === type;
    };
  }
  function isArray(val) {
    return Array.isArray(val);
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    var result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  function isString(val) {
    return typeof val === "string";
  }
  function isNumber(val) {
    return typeof val === "number";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isPlainObject(val) {
    if (kindOf(val) !== "object") {
      return false;
    }
    var prototype2 = Object.getPrototypeOf(val);
    return prototype2 === null || prototype2 === Object.prototype;
  }
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  function isFunction(val) {
    return toString.call(val) === "[object Function]";
  }
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }
  function isFormData(thing) {
    var pattern = "[object FormData]";
    return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
  }
  var isURLSearchParams = kindOfTest("URLSearchParams");
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
  }
  function isStandardBrowserEnv() {
    if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
      return false;
    }
    return typeof window !== "undefined" && typeof document !== "undefined";
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function merge() {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === "function") {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }
  function stripBOM(content) {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  }
  function inherits(constructor, superConstructor, props, descriptors2) {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    props && Object.assign(constructor.prototype, props);
  }
  function toFlatObject(sourceObj, destObj, filter) {
    var props;
    var i;
    var prop;
    var merged = {};
    destObj = destObj || {};
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if (!merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = Object.getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  }
  function endsWith(str, searchString, position) {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    var lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  }
  function toArray(thing) {
    if (!thing)
      return null;
    var i = thing.length;
    if (isUndefined(i))
      return null;
    var arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  }
  var isTypedArray = function(TypedArray) {
    return function(thing) {
      return TypedArray && thing instanceof TypedArray;
    };
  }(typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array));
  var utils$c = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    isURLSearchParams,
    isStandardBrowserEnv,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    isTypedArray,
    isFileList
  };
  const utils$d = /* @__PURE__ */ getDefaultExportFromCjs(utils$c);
  var utils$b = utils$c;
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  var buildURL$1 = function buildURL2(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils$b.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils$b.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils$b.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils$b.forEach(val, function parseValue(v) {
          if (utils$b.isDate(v)) {
            v = v.toISOString();
          } else if (utils$b.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  };
  const buildURL$2 = /* @__PURE__ */ getDefaultExportFromCjs(buildURL$1);
  var utils$a = utils$c;
  function InterceptorManager$1() {
    this.handlers = [];
  }
  InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };
  InterceptorManager$1.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager$1.prototype.forEach = function forEach2(fn) {
    utils$a.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  };
  var InterceptorManager_1 = InterceptorManager$1;
  var utils$9 = utils$c;
  var normalizeHeaderName$1 = function normalizeHeaderName2(headers2, normalizedName) {
    utils$9.forEach(headers2, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers2[normalizedName] = value;
        delete headers2[name];
      }
    });
  };
  var utils$8 = utils$c;
  function AxiosError$3(message, code, config, request, response) {
    Error.call(this);
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
  }
  utils$8.inherits(AxiosError$3, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    }
  });
  var prototype = AxiosError$3.prototype;
  var descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED"
    // eslint-disable-next-line func-names
  ].forEach(function(code) {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$3, descriptors);
  Object.defineProperty(prototype, "isAxiosError", { value: true });
  AxiosError$3.from = function(error, code, config, request, response, customProps) {
    var axiosError = Object.create(prototype);
    utils$8.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    });
    AxiosError$3.call(axiosError, error.message, code, config, request, response);
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  var AxiosError_1 = AxiosError$3;
  var transitional = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  var utils$7 = utils$c;
  function toFormData$1(obj, formData) {
    formData = formData || new FormData();
    var stack = [];
    function convertValue(value) {
      if (value === null)
        return "";
      if (utils$7.isDate(value)) {
        return value.toISOString();
      }
      if (utils$7.isArrayBuffer(value) || utils$7.isTypedArray(value)) {
        return typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function build(data2, parentKey) {
      if (utils$7.isPlainObject(data2) || utils$7.isArray(data2)) {
        if (stack.indexOf(data2) !== -1) {
          throw Error("Circular reference detected in " + parentKey);
        }
        stack.push(data2);
        utils$7.forEach(data2, function each(value, key) {
          if (utils$7.isUndefined(value))
            return;
          var fullKey = parentKey ? parentKey + "." + key : key;
          var arr;
          if (value && !parentKey && typeof value === "object") {
            if (utils$7.endsWith(key, "{}")) {
              value = JSON.stringify(value);
            } else if (utils$7.endsWith(key, "[]") && (arr = utils$7.toArray(value))) {
              arr.forEach(function(el) {
                !utils$7.isUndefined(el) && formData.append(fullKey, convertValue(el));
              });
              return;
            }
          }
          build(value, fullKey);
        });
        stack.pop();
      } else {
        formData.append(parentKey, convertValue(data2));
      }
    }
    build(obj);
    return formData;
  }
  var toFormData_1 = toFormData$1;
  var AxiosError$2 = AxiosError_1;
  var settle = function settle2(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$2(
        "Request failed with status code " + response.status,
        [AxiosError$2.ERR_BAD_REQUEST, AxiosError$2.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  };
  const settle$1 = /* @__PURE__ */ getDefaultExportFromCjs(settle);
  var cookies;
  var hasRequiredCookies;
  function requireCookies() {
    if (hasRequiredCookies)
      return cookies;
    hasRequiredCookies = 1;
    var utils2 = utils$c;
    cookies = utils2.isStandardBrowserEnv() ? (
      // Standard browser envs support document.cookie
      function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + "=" + encodeURIComponent(value));
            if (utils2.isNumber(expires)) {
              cookie.push("expires=" + new Date(expires).toGMTString());
            }
            if (utils2.isString(path)) {
              cookie.push("path=" + path);
            }
            if (utils2.isString(domain)) {
              cookie.push("domain=" + domain);
            }
            if (secure === true) {
              cookie.push("secure");
            }
            document.cookie = cookie.join("; ");
          },
          read: function read(name) {
            var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
            return match ? decodeURIComponent(match[3]) : null;
          },
          remove: function remove(name) {
            this.write(name, "", Date.now() - 864e5);
          }
        };
      }()
    ) : (
      // Non standard browser env (web workers, react-native) lack needed support.
      function nonStandardBrowserEnv() {
        return {
          write: function write() {
          },
          read: function read() {
            return null;
          },
          remove: function remove() {
          }
        };
      }()
    );
    return cookies;
  }
  var isAbsoluteURL$1 = function isAbsoluteURL2(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  };
  var combineURLs$1 = function combineURLs2(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
  var isAbsoluteURL = isAbsoluteURL$1;
  var combineURLs = combineURLs$1;
  var buildFullPath$1 = function buildFullPath2(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };
  const buildFullPath$2 = /* @__PURE__ */ getDefaultExportFromCjs(buildFullPath$1);
  var utils$6 = utils$c;
  var ignoreDuplicateOf = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  var parseHeaders = function parseHeaders2(headers2) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers2) {
      return parsed;
    }
    utils$6.forEach(headers2.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils$6.trim(line.substr(0, i)).toLowerCase();
      val = utils$6.trim(line.substr(i + 1));
      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === "set-cookie") {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      }
    });
    return parsed;
  };
  const parseHeaders$1 = /* @__PURE__ */ getDefaultExportFromCjs(parseHeaders);
  var isURLSameOrigin;
  var hasRequiredIsURLSameOrigin;
  function requireIsURLSameOrigin() {
    if (hasRequiredIsURLSameOrigin)
      return isURLSameOrigin;
    hasRequiredIsURLSameOrigin = 1;
    var utils2 = utils$c;
    isURLSameOrigin = utils2.isStandardBrowserEnv() ? (
      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
      function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement("a");
        var originURL;
        function resolveURL(url) {
          var href = url;
          if (msie) {
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
          }
          urlParsingNode.setAttribute("href", href);
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
          };
        }
        originURL = resolveURL(window.location.href);
        return function isURLSameOrigin2(requestURL) {
          var parsed = utils2.isString(requestURL) ? resolveURL(requestURL) : requestURL;
          return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
        };
      }()
    ) : (
      // Non standard browser envs (web workers, react-native) lack needed support.
      function nonStandardBrowserEnv() {
        return function isURLSameOrigin2() {
          return true;
        };
      }()
    );
    return isURLSameOrigin;
  }
  var CanceledError_1;
  var hasRequiredCanceledError;
  function requireCanceledError() {
    if (hasRequiredCanceledError)
      return CanceledError_1;
    hasRequiredCanceledError = 1;
    var AxiosError2 = AxiosError_1;
    var utils2 = utils$c;
    function CanceledError2(message) {
      AxiosError2.call(this, message == null ? "canceled" : message, AxiosError2.ERR_CANCELED);
      this.name = "CanceledError";
    }
    utils2.inherits(CanceledError2, AxiosError2, {
      __CANCEL__: true
    });
    CanceledError_1 = CanceledError2;
    return CanceledError_1;
  }
  var parseProtocol;
  var hasRequiredParseProtocol;
  function requireParseProtocol() {
    if (hasRequiredParseProtocol)
      return parseProtocol;
    hasRequiredParseProtocol = 1;
    parseProtocol = function parseProtocol2(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    };
    return parseProtocol;
  }
  var xhr;
  var hasRequiredXhr;
  function requireXhr() {
    if (hasRequiredXhr)
      return xhr;
    hasRequiredXhr = 1;
    var utils2 = utils$c;
    var settle$12 = settle;
    var cookies2 = requireCookies();
    var buildURL2 = buildURL$1;
    var buildFullPath2 = buildFullPath$1;
    var parseHeaders$12 = parseHeaders;
    var isURLSameOrigin2 = requireIsURLSameOrigin();
    var transitionalDefaults2 = transitional;
    var AxiosError2 = AxiosError_1;
    var CanceledError2 = requireCanceledError();
    var parseProtocol2 = requireParseProtocol();
    xhr = function xhrAdapter2(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener("abort", onCanceled);
          }
        }
        if (utils2.isFormData(requestData) && utils2.isStandardBrowserEnv()) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath2(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL2(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders$12(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle$12(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(new AxiosError2("Request aborted", AxiosError2.ECONNABORTED, config, request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(new AxiosError2("Network Error", AxiosError2.ERR_NETWORK, config, request, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          var transitional2 = config.transitional || transitionalDefaults2;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError2(
            timeoutErrorMessage,
            transitional2.clarifyTimeoutError ? AxiosError2.ETIMEDOUT : AxiosError2.ECONNABORTED,
            config,
            request
          ));
          request = null;
        };
        if (utils2.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin2(fullPath)) && config.xsrfCookieName ? cookies2.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils2.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils2.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === "function") {
          request.addEventListener("progress", config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === "function" && request.upload) {
          request.upload.addEventListener("progress", config.onUploadProgress);
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || cancel && cancel.type ? new CanceledError2() : cancel);
            request.abort();
            request = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        var protocol = parseProtocol2(fullPath);
        if (protocol && ["http", "https", "file"].indexOf(protocol) === -1) {
          reject(new AxiosError2("Unsupported protocol " + protocol + ":", AxiosError2.ERR_BAD_REQUEST, config));
          return;
        }
        request.send(requestData);
      });
    };
    return xhr;
  }
  var _null;
  var hasRequired_null;
  function require_null() {
    if (hasRequired_null)
      return _null;
    hasRequired_null = 1;
    _null = null;
    return _null;
  }
  var utils$5 = utils$c;
  var normalizeHeaderName = normalizeHeaderName$1;
  var AxiosError$1 = AxiosError_1;
  var transitionalDefaults = transitional;
  var toFormData = toFormData_1;
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers2, value) {
    if (!utils$5.isUndefined(headers2) && utils$5.isUndefined(headers2["Content-Type"])) {
      headers2["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== "undefined") {
      adapter = requireXhr();
    } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = requireXhr();
    }
    return adapter;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$5.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$5.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults$3 = {
    transitional: transitionalDefaults,
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data2, headers2) {
      normalizeHeaderName(headers2, "Accept");
      normalizeHeaderName(headers2, "Content-Type");
      if (utils$5.isFormData(data2) || utils$5.isArrayBuffer(data2) || utils$5.isBuffer(data2) || utils$5.isStream(data2) || utils$5.isFile(data2) || utils$5.isBlob(data2)) {
        return data2;
      }
      if (utils$5.isArrayBufferView(data2)) {
        return data2.buffer;
      }
      if (utils$5.isURLSearchParams(data2)) {
        setContentTypeIfUnset(headers2, "application/x-www-form-urlencoded;charset=utf-8");
        return data2.toString();
      }
      var isObjectPayload = utils$5.isObject(data2);
      var contentType = headers2 && headers2["Content-Type"];
      var isFileList2;
      if ((isFileList2 = utils$5.isFileList(data2)) || isObjectPayload && contentType === "multipart/form-data") {
        var _FormData = this.env && this.env.FormData;
        return toFormData(isFileList2 ? { "files[]": data2 } : data2, _FormData && new _FormData());
      } else if (isObjectPayload || contentType === "application/json") {
        setContentTypeIfUnset(headers2, "application/json");
        return stringifySafely(data2);
      }
      return data2;
    }],
    transformResponse: [function transformResponse(data2) {
      var transitional2 = this.transitional || defaults$3.transitional;
      var silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      var forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
      if (strictJSONParsing || forcedJSONParsing && utils$5.isString(data2) && data2.length) {
        try {
          return JSON.parse(data2);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data2;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: require_null()
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*"
      }
    }
  };
  utils$5.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults$3.headers[method] = {};
  });
  utils$5.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults$3.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
  });
  var defaults_1 = defaults$3;
  var utils$4 = utils$c;
  var defaults$2 = defaults_1;
  var transformData$1 = function transformData2(data2, headers2, fns) {
    var context = this || defaults$2;
    utils$4.forEach(fns, function transform(fn) {
      data2 = fn.call(context, data2, headers2);
    });
    return data2;
  };
  var isCancel$1;
  var hasRequiredIsCancel;
  function requireIsCancel() {
    if (hasRequiredIsCancel)
      return isCancel$1;
    hasRequiredIsCancel = 1;
    isCancel$1 = function isCancel2(value) {
      return !!(value && value.__CANCEL__);
    };
    return isCancel$1;
  }
  var utils$3 = utils$c;
  var transformData = transformData$1;
  var isCancel = requireIsCancel();
  var defaults$1 = defaults_1;
  var CanceledError = requireCanceledError();
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError();
    }
  }
  var dispatchRequest$1 = function dispatchRequest2(config) {
    throwIfCancellationRequested(config);
    config.headers = config.headers || {};
    config.data = transformData.call(
      config,
      config.data,
      config.headers,
      config.transformRequest
    );
    config.headers = utils$3.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );
    utils$3.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );
    var adapter = config.adapter || defaults$1.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      );
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }
      return Promise.reject(reason);
    });
  };
  var utils$2 = utils$c;
  var mergeConfig$2 = function mergeConfig2(config1, config2) {
    config2 = config2 || {};
    var config = {};
    function getMergedValue(target, source) {
      if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
        return utils$2.merge(target, source);
      } else if (utils$2.isPlainObject(source)) {
        return utils$2.merge({}, source);
      } else if (utils$2.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    function valueFromConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      }
    }
    function defaultToConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    function mergeDirectKeys(prop) {
      if (prop in config2) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    var mergeMap = {
      "url": valueFromConfig2,
      "method": valueFromConfig2,
      "data": valueFromConfig2,
      "baseURL": defaultToConfig2,
      "transformRequest": defaultToConfig2,
      "transformResponse": defaultToConfig2,
      "paramsSerializer": defaultToConfig2,
      "timeout": defaultToConfig2,
      "timeoutMessage": defaultToConfig2,
      "withCredentials": defaultToConfig2,
      "adapter": defaultToConfig2,
      "responseType": defaultToConfig2,
      "xsrfCookieName": defaultToConfig2,
      "xsrfHeaderName": defaultToConfig2,
      "onUploadProgress": defaultToConfig2,
      "onDownloadProgress": defaultToConfig2,
      "decompress": defaultToConfig2,
      "maxContentLength": defaultToConfig2,
      "maxBodyLength": defaultToConfig2,
      "beforeRedirect": defaultToConfig2,
      "transport": defaultToConfig2,
      "httpAgent": defaultToConfig2,
      "httpsAgent": defaultToConfig2,
      "cancelToken": defaultToConfig2,
      "socketPath": defaultToConfig2,
      "responseEncoding": defaultToConfig2,
      "validateStatus": mergeDirectKeys
    };
    utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
      var merge2 = mergeMap[prop] || mergeDeepProperties;
      var configValue = merge2(prop);
      utils$2.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  };
  var data;
  var hasRequiredData;
  function requireData() {
    if (hasRequiredData)
      return data;
    hasRequiredData = 1;
    data = {
      "version": "0.27.2"
    };
    return data;
  }
  var VERSION = requireData().version;
  var AxiosError = AxiosError_1;
  var validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators$1.transitional = function transitional2(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return function(value, opt, opts) {
      if (validator2 === false) {
        throw new AxiosError(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator2 = schema[opt];
      if (validator2) {
        var value = options[opt];
        var result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }
  var validator$1 = {
    assertOptions,
    validators: validators$1
  };
  var utils$1 = utils$c;
  var buildURL = buildURL$1;
  var InterceptorManager = InterceptorManager_1;
  var dispatchRequest = dispatchRequest$1;
  var mergeConfig$1 = mergeConfig$2;
  var buildFullPath = buildFullPath$1;
  var validator = validator$1;
  var validators = validator.validators;
  function Axios$1(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  Axios$1.prototype.request = function request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig$1(this.defaults, config);
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = "get";
    }
    var transitional2 = config.transitional;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    var promise;
    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest, void 0];
      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);
      promise = Promise.resolve(config);
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      return promise;
    }
    var newConfig = config;
    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }
    try {
      promise = dispatchRequest(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }
    return promise;
  };
  Axios$1.prototype.getUri = function getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    var fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  };
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data2, config) {
        return this.request(mergeConfig$1(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data: data2
        }));
      };
    }
    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  var Axios_1 = Axios$1;
  var CancelToken_1;
  var hasRequiredCancelToken;
  function requireCancelToken() {
    if (hasRequiredCancelToken)
      return CancelToken_1;
    hasRequiredCancelToken = 1;
    var CanceledError2 = requireCanceledError();
    function CancelToken(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      this.promise.then(function(cancel) {
        if (!token._listeners)
          return;
        var i;
        var l = token._listeners.length;
        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function(onfulfilled) {
        var _resolve;
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError2(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };
    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    };
    CancelToken_1 = CancelToken;
    return CancelToken_1;
  }
  var spread;
  var hasRequiredSpread;
  function requireSpread() {
    if (hasRequiredSpread)
      return spread;
    hasRequiredSpread = 1;
    spread = function spread2(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
    return spread;
  }
  var isAxiosError;
  var hasRequiredIsAxiosError;
  function requireIsAxiosError() {
    if (hasRequiredIsAxiosError)
      return isAxiosError;
    hasRequiredIsAxiosError = 1;
    var utils2 = utils$c;
    isAxiosError = function isAxiosError2(payload) {
      return utils2.isObject(payload) && payload.isAxiosError === true;
    };
    return isAxiosError;
  }
  var utils = utils$c;
  var bind = bind$2;
  var Axios = Axios_1;
  var mergeConfig = mergeConfig$2;
  var defaults = defaults_1;
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);
    utils.extend(instance, Axios.prototype, context);
    utils.extend(instance, context);
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios$2 = createInstance(defaults);
  axios$2.Axios = Axios;
  axios$2.CanceledError = requireCanceledError();
  axios$2.CancelToken = requireCancelToken();
  axios$2.isCancel = requireIsCancel();
  axios$2.VERSION = requireData().version;
  axios$2.toFormData = toFormData_1;
  axios$2.AxiosError = AxiosError_1;
  axios$2.Cancel = axios$2.CanceledError;
  axios$2.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$2.spread = requireSpread();
  axios$2.isAxiosError = requireIsAxiosError();
  axios$3.exports = axios$2;
  axios$3.exports.default = axios$2;
  var axiosExports = axios$3.exports;
  var axios = axiosExports;
  const axios$1 = /* @__PURE__ */ getDefaultExportFromCjs(axios);
  function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
      let requestData = config.data;
      const requestHeaders = config.headers ?? {};
      if (utils$d.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password || "";
        requestHeaders.Authorization = "Basic " + Buffer.from(username + ":" + password).toString("base64");
      }
      const onerror = function handleError() {
        reject(new axios.AxiosError("Network Error", axios.AxiosError.ERR_NETWORK, config));
      };
      const ontimeout = function handleTimeout() {
        reject(new axios.AxiosError("timeout of " + config.timeout + "ms exceeded", axios.AxiosError.ECONNABORTED, config));
      };
      utils$d.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
          delete requestHeaders[key];
        }
      });
      if (requestData === void 0) {
        requestData = null;
      }
      const onload = function handleLoad(resp) {
        const responseHeaders = "responseHeaders" in resp ? parseHeaders$1(resp.responseHeaders) : {};
        const responseData = !config.responseType || config.responseType === "text" ? resp.responseText : resp.response;
        const response = {
          data: responseData,
          status: resp.status,
          statusText: resp.statusText,
          headers: responseHeaders,
          config,
          request: {
            // can't got real XMLHttpRequest object, only some property is available
            responseURL: resp.finalUrl,
            status: resp.status,
            statusText: resp.statusText,
            responseXML: null
          }
        };
        settle$1(resolve, reject, response);
      };
      if (config.cancelToken) {
        config.cancelToken.promise.then(function onCanceled(cancel) {
          reject(cancel);
        });
      }
      let responseType;
      if (config.responseType && config.responseType !== "json") {
        responseType = config.responseType;
      }
      const method = config.method.toUpperCase();
      if (method === "UNLINK" || method === "PURGE" || method === "LINK") {
        reject(new axios.AxiosError(`${method} is not a supported method by GM.xmlHttpRequest`));
      } else {
        GM.xmlHttpRequest({
          method,
          url: buildURL$2(buildFullPath$2(config.baseURL, config.url), config.params, config.paramsSerializer),
          headers: Object.fromEntries(Object.entries(requestHeaders).map(([key, val]) => [key, val.toString()])),
          responseType,
          data: requestData,
          timeout: config.timeout,
          ontimeout,
          onload,
          onerror
        });
      }
    });
  }
  const characters$2 = JSON.parse(GM_getResourceText("character"));
  const weapons$2 = JSON.parse(GM_getResourceText("weapon"));
  const charactersNum$1 = characters$2.length;
  const getCharacterId$2 = (queryName) => {
    for (let e of characters$2) {
      const { id, name } = e;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getCharacterId ${queryName} 查询失败`);
    return "";
  };
  const getWeaponId$2 = (queryName) => {
    for (let e of weapons$2) {
      const { id, name } = e;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getWeaponrId ${queryName} 查询失败`);
    return "";
  };
  const elementAttrIds = [
    { element_attr_id: 1, name: "pyro" },
    { element_attr_id: 2, name: "anemo" },
    { element_attr_id: 3, name: "geo" },
    { element_attr_id: 4, name: "electro" },
    { element_attr_id: 5, name: "hydro" },
    { element_attr_id: 6, name: "cryo" },
    { element_attr_id: 7, name: "dendro" }
  ];
  const getElementAttrName = (queryName) => {
    for (let e of elementAttrIds) {
      const { element_attr_id, name } = e;
      if (queryName == element_attr_id) {
        return name;
      }
    }
    console.error(`getElementAttrName: ${queryName} 查询失败`);
    return "";
  };
  axios$1.defaults.adapter = xhrAdapter;
  axios$1.defaults.withCredentials = true;
  async function refreshPage() {
    console.log("刷新页面?");
    const confirmed = confirm("确定要刷新页面吗？刷新后将重新加载所有数据。");
    if (confirmed) {
      window.location.reload();
    }
  }
  function getGuid() {
    function S4() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    }
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  }
  function generateCharString(number = 16) {
    const characters2 = "abcdef0123456789";
    let result = "";
    for (let i = 0; i < number; i++) {
      const randomIndex = Math.floor(Math.random() * characters2.length);
      result += characters2[randomIndex];
    }
    return result;
  }
  const headers = {
    Referer: "https://act.mihoyo.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  };
  const to = (promise) => promise.then((data2) => {
    return [null, data2];
  }).catch((err) => {
    console.error(err);
    return [err];
  });
  const getFp = async () => {
    let fp = localStorage.getItem("fp");
    let deviceId = localStorage.getItem("mysDeviceId");
    if (!deviceId) {
      deviceId = getGuid();
      localStorage.setItem("mysDeviceId", deviceId);
    }
    if (!fp) {
      let url = "https://public-data-api.mihoyo.com/device-fp/api/getFp";
      const [err, res] = await to(axios$1.post(
        url,
        JSON.stringify({
          seed_id: generateCharString(),
          device_id: deviceId.toUpperCase(),
          platform: "1",
          seed_time: (/* @__PURE__ */ new Date()).getTime() + "",
          ext_fields: `{"proxyStatus":"0","accelerometer":"-0.159515x-0.830887x-0.682495","ramCapacity":"3746","IDFV":"${deviceId.toUpperCase()}","gyroscope":"-0.191951x-0.112927x0.632637","isJailBreak":"0","model":"iPhone12,5","ramRemain":"115","chargeStatus":"1","networkType":"WIFI","vendor":"--","osVersion":"17.0.2","batteryStatus":"50","screenSize":"414×896","cpuCores":"6","appMemory":"55","romCapacity":"488153","romRemain":"157348","cpuType":"CPU_TYPE_ARM64","magnetometer":"-84.426331x-89.708435x-37.117889"}`,
          app_name: "bbs_cn",
          device_fp: "38d7ee834d1e9"
        }),
        {
          timeout: 5e3,
          headers
        }
      ));
      if (!err) {
        const { status, data: resData } = await res;
        if (status == 200) {
          const { retcode, data: data2 } = resData;
          if (retcode === 0) {
            let resFp = data2["device_fp"];
            localStorage.setItem("fp", resFp);
            return resFp;
          }
        }
      }
    } else {
      return fp;
    }
  };
  const getAccount = async (roleUrl, openUrl, gameType) => {
    const [err, res] = await to(axios$1.get(roleUrl, {
      headers
    }));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: accountList } = await data2;
          return accountList;
        }
      }
    }
    alert(`请确认已登录活动页面且绑定${gameType}账户!`);
    GM_openInTab(openUrl);
    throw err ? err : new Error("账户信息获取失败");
  };
  const getStorageAccount = () => localStorage.account || "main";
  const getTotalGoal = async () => {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-goals`;
    const text = await currentAdapter.getItem(key) || "[]";
    return typeof text === "string" ? JSON.parse(text) : text;
  };
  const getGoalInactive = async () => {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-inactive`;
    const text = await currentAdapter.getItem(key) || "[]";
    return Object.keys(typeof text === "string" ? JSON.parse(text) : text);
  };
  const setGoalInactive = async (ids = /* @__PURE__ */ new Set()) => {
    const inactiveObject = Object.fromEntries(
      [...ids].map((id) => [id, true])
    );
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-inactive`;
    await currentAdapter.setItem(key, inactiveObject);
    await refreshPage();
  };
  const setGoals = async (goals) => {
    const key = `${getStorageAccount()}-goals`;
    const currentAdapter = AdapterManager.getCurrentAdapter();
    await currentAdapter.setItem(key, goals);
    await currentAdapter.setItem("last_update", (/* @__PURE__ */ new Date()).toISOString());
  };
  const getNextId = async () => {
    const goals = await getTotalGoal();
    const ids = goals.map((g2) => g2.id).filter((id) => true);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };
  const batchUpdateGoals = async (type, identifierKey, updateFn, all, ...updateArgs) => {
    const totalGoal = await getTotalGoal();
    const goalInactive = await getGoalInactive();
    const goals = totalGoal.filter((a) => a.type === type).filter((a) => all || !goalInactive.includes(a[identifierKey]));
    for (let goal of goals) {
      await updateFn(goal, ...updateArgs);
    }
    await refreshPage();
  };
  const computeInactive = (goals, config) => {
    var _a2, _b2, _c;
    const isGoalCompleted = (goal) => goal.goal.level <= goal.current.level;
    const goalTypeIdentifiers = /* @__PURE__ */ new Map();
    config.forEach(({ type, identifierKey, isTalent, talentKeys }) => {
      const filteredGoals = goals.filter((g2) => g2.type === type);
      if (isTalent && talentKeys) {
        const completedTalents = filteredGoals.filter(
          (talent) => talentKeys.every(
            (key) => talent[key].goal <= talent[key].current
          )
        );
        goalTypeIdentifiers.set(type, new Set(completedTalents.map((g2) => g2[identifierKey].toString())));
      } else {
        const goals1 = filteredGoals;
        const completedGoals = goals1.filter(isGoalCompleted);
        goalTypeIdentifiers.set(type, new Set(completedGoals.map((g2) => g2[identifierKey].toString())));
      }
    });
    const characterType = (_a2 = config.find((c) => c.type === "character")) == null ? void 0 : _a2.type;
    const talentType = (_b2 = config.find((c) => c.isTalent)) == null ? void 0 : _b2.type;
    const weaponType = (_c = config.find((c) => !c.isTalent && c.type !== "character")) == null ? void 0 : _c.type;
    const characterIds = goalTypeIdentifiers.get(characterType) || /* @__PURE__ */ new Set();
    const talentIds = goalTypeIdentifiers.get(talentType) || /* @__PURE__ */ new Set();
    const weaponIds = goalTypeIdentifiers.get(weaponType) || /* @__PURE__ */ new Set();
    const characterNames = new Set([...talentIds].filter((id) => characterIds.has(id)));
    return /* @__PURE__ */ new Set([...characterNames, ...weaponIds]);
  };
  const setInactive = async (config) => {
    const goals = await getTotalGoal();
    const inactive = computeInactive(goals, config);
    await setGoalInactive(inactive);
  };
  axios$1.defaults.adapter = xhrAdapter;
  axios$1.defaults.withCredentials = true;
  const CHARACTERS_URL$2 = "https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list";
  const requestPageSize$1 = 200;
  const getCharacters$2 = async (uid, region, page = 1) => {
    let fp = await getFp();
    const genshinHeaders = {
      "x-rpc-device_fp": fp,
      ...headers
    };
    const [err, res] = await to(axios$1.post(CHARACTERS_URL$2, JSON.stringify({
      "element_attr_ids": [],
      "weapon_cat_ids": [],
      "page": page,
      "size": requestPageSize$1,
      "uid": uid,
      "region": region,
      "lang": "zh-cn"
    }), {
      timeout: 5e3,
      headers: genshinHeaders
    }));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
      }
    }
    localStorage.removeItem("fp");
    throw err ? err : new Error("角色列表获取失败");
  };
  const getCharacterDetail$2 = async (character, uid, region) => {
    return { character, ...character };
  };
  const getDetailList$2 = async (game_uid, region) => {
    let maxPageSize = Math.ceil(charactersNum$1 / requestPageSize$1);
    let idxs = Array.from(new Array(maxPageSize).keys());
    const characters2 = [];
    for await (let i of idxs) {
      characters2.push.apply(characters2, await getCharacters$2(game_uid, region, i + 1));
    }
    const details = characters2.map((c) => getCharacterDetail$2(c));
    const detailList = [];
    for await (let d of details) {
      if (!!d) {
        detailList.push(d);
      }
    }
    return detailList;
  };
  const addGoal$2 = async (data2) => {
    var _a2, _b2;
    let index = -1;
    const goals = await getTotalGoal();
    if (data2.character) {
      index = goals.findIndex(
        (g2) => g2.character === data2.character && g2.type === data2.type
      );
    } else if (data2.id) {
      index = goals.findIndex((g2) => g2.id === data2.id);
    }
    if (index >= 0) {
      goals[index] = { ...goals[index], ...data2 };
    } else {
      const lastId = (_b2 = (_a2 = goals == null ? void 0 : goals.map((g2) => g2.id)) == null ? void 0 : _a2.filter((id) => typeof id == "number")) == null ? void 0 : _b2.sort((a, b) => a < b ? 1 : -1)[0];
      data2.id = (lastId || 0) + 1;
      goals.push(data2);
    }
    await setGoals(goals);
  };
  const addTalentGoal = async (talentCharacter, skill_list) => {
    const totalGoal = await getTotalGoal();
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "talent" && g2.character == talentCharacter);
    const [normalCurrent, skillCurrent, burstCurrent] = skill_list.filter((a) => a.max_level == 10).sort().map((a) => a.level_current);
    let talentGoal;
    if (talentIdx < 0) {
      const id = await getNextId();
      talentGoal = {
        type: "talent",
        character: talentCharacter,
        c3: false,
        c5: false,
        normal: {
          current: normalCurrent,
          goal: normalCurrent
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent
        },
        burst: {
          current: burstCurrent,
          goal: burstCurrent
        },
        id
      };
    } else {
      const seelieGoal = totalGoal[talentIdx];
      const { normal, skill, burst } = seelieGoal;
      const { goal: normalGoal } = normal;
      const { goal: skillGoal } = skill;
      const { goal: burstGoal } = burst;
      talentGoal = {
        ...seelieGoal,
        normal: {
          current: normalCurrent,
          goal: normalCurrent > normalGoal ? normalCurrent : normalGoal
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
        },
        burst: {
          current: burstCurrent,
          goal: burstCurrent > burstGoal ? burstCurrent : burstGoal
        }
      };
    }
    await addGoal$2(talentGoal);
  };
  const addCharacterGoal$2 = async (level_current, nameEn, name, type) => {
    let totalGoal = await getTotalGoal();
    let characterPredicate = (g2) => g2.type == type && g2.character == nameEn;
    let weaponPredicate = (g2) => g2.type == type && g2.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus = initCharacterStatus$2(level_current);
    let characterGoal;
    function initCharacterGoal(id) {
      return {
        type,
        character: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id
      };
    }
    function initWeaponGoal(id) {
      return {
        type,
        character: "",
        weapon: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id
      };
    }
    if (characterIdx < 0) {
      const id = await getNextId();
      characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
      const seelieGoal = type == "character" ? totalGoal[characterIdx] : totalGoal[characterIdx];
      const { goal, current } = seelieGoal;
      const { level: levelCurrent, asc: ascCurrent } = current;
      const { level: levelGoal, asc: ascGoal } = goal;
      const { level, asc } = characterStatus;
      characterGoal = {
        ...seelieGoal,
        current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
        goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal
      };
    }
    await addGoal$2(characterGoal);
  };
  async function addCharacter$2(characterDataEx) {
    const { character, skill_list, weapon } = characterDataEx;
    const { name, element_attr_id } = character;
    if (weapon) {
      const { name: name2, level_current: weaponLeveL } = weapon;
      const weaponId = getWeaponId$2(name2);
      if (weaponId) {
        await addCharacterGoal$2(weaponLeveL, weaponId, name2, "weapon");
      }
    }
    const { level_current: characterLevel } = character;
    const characterId = getCharacterId$2(name);
    if (!characterId) {
      return;
    }
    await addCharacterGoal$2(characterLevel, characterId, name, "character");
    let talentCharacter = characterId;
    if (characterId == "traveler") {
      const elementAttrName = getElementAttrName(element_attr_id);
      talentCharacter = `traveler_${elementAttrName}`;
    }
    await addTalentGoal(talentCharacter, skill_list);
  }
  const characterStatusList$2 = [
    { level: 1, asc: 0, text: "1" },
    { level: 20, asc: 0, text: "20" },
    { level: 20, asc: 1, text: "20 A" },
    { level: 40, asc: 1, text: "40" },
    { level: 40, asc: 2, text: "40 A" },
    { level: 50, asc: 2, text: "50" },
    { level: 50, asc: 3, text: "50 A" },
    { level: 60, asc: 3, text: "60" },
    { level: 60, asc: 4, text: "60 A" },
    { level: 70, asc: 4, text: "70" },
    { level: 70, asc: 5, text: "70 A" },
    { level: 80, asc: 5, text: "80" },
    { level: 80, asc: 6, text: "80 A" },
    { level: 90, asc: 6, text: "90" }
  ];
  const initCharacterStatus$2 = (level_current) => {
    let initCharacterStatus2 = characterStatusList$2[0];
    if (level_current < 20) {
      return initCharacterStatus2;
    }
    for (let characterStatus of characterStatusList$2) {
      const { level } = characterStatus;
      if (level_current < level) {
        return initCharacterStatus2;
      } else if (level_current == level) {
        return characterStatus;
      } else if (level_current > level) {
        initCharacterStatus2 = characterStatus;
      }
    }
    return initCharacterStatus2;
  };
  const updateTalent = async (talent, normalGoal = 9, skillGoal = 9, burstGoal = 9) => {
    const { normal: { current: normalCurrent }, skill: { current: skillCurrent }, burst: { current: burstCurrent } } = talent;
    const talentNew = {
      ...talent,
      normal: {
        current: normalCurrent,
        goal: normalCurrent > normalGoal ? normalCurrent : normalGoal
      },
      skill: {
        current: skillCurrent,
        goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
      },
      burst: {
        current: burstCurrent,
        goal: burstCurrent > burstGoal ? burstCurrent : burstGoal
      }
    };
    await addGoal$2(talentNew);
  };
  const batchUpdateTalent = async (all, normal, skill, burst) => {
    await batchUpdateGoals(
      "talent",
      "character",
      // 天赋目标用character字段标识
      (talent) => updateTalent(talent, normal, skill, burst),
      all
    );
  };
  const updateCharacter$2 = async (character, characterStatusGoal) => {
    const { current } = character;
    const { level: levelCurrent, asc: ascCurrent } = current;
    const { level, asc } = characterStatusGoal;
    const characterGoalNew = {
      ...character,
      goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current
    };
    await addGoal$2(characterGoalNew);
  };
  const batchUpdateCharacter$2 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "character",
      "character",
      // 角色目标用character字段标识
      updateCharacter$2,
      all,
      characterStatusGoal
    ).then(() => {
      console.log("角色更新完成");
    });
  };
  const batchUpdateWeapon$2 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "weapon",
      "weapon",
      // 武器目标用weapon字段标识
      (weapon) => updateCharacter$2(weapon, characterStatusGoal),
      all,
      characterStatusGoal
    ).then(() => {
      console.log("武器更新完成");
    });
  };
  class BaseAdapter {
    constructor() {
      // 公共实现：批量更新角色
      __publicField(this, "batchUpdateCharacter", (all, status) => {
        const { batchUpdateCharacter: batchUpdateCharacter2 } = this.importSeelieMethods();
        batchUpdateCharacter2(all, status);
      });
      // 公共实现：批量更新武器
      __publicField(this, "batchUpdateWeapon", (all, status) => {
        const { batchUpdateWeapon: batchUpdateWeapon2 } = this.importSeelieMethods();
        batchUpdateWeapon2(all, status);
      });
    }
    // 公共实现：获取账户列表
    async getAccounts() {
      const { BBS_URL, ROLE_URL } = this.getApiConfig();
      return await getAccount(ROLE_URL, BBS_URL, this.getGameName());
    }
    async getItem(key) {
      return Promise.resolve(localStorage.getItem(key));
    }
    async setItem(key, value) {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      return Promise.resolve();
    }
  }
  class GenshinAdapter extends BaseAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "batchUpdateTalent", (all, normal, skill, burst) => {
        batchUpdateTalent(all, normal, skill, burst).then(() => {
          console.log("天赋更新完成");
        });
      });
      __publicField(this, "getInactiveConfig", () => {
        const GENSHIN_INACTIVE_CONFIG = [
          { type: "character", identifierKey: "character" },
          // 角色目标（标识字段：character）
          {
            type: "talent",
            identifierKey: "character",
            isTalent: true,
            talentKeys: ["normal", "skill", "burst"]
            // 原神天赋类型：普通攻击/元素战技/元素爆发
          },
          // 天赋目标（标识字段：character）
          { type: "weapon", identifierKey: "id" }
          // 武器目标（标识字段：weapon）
        ];
        return GENSHIN_INACTIVE_CONFIG;
      });
    }
    getGameName() {
      return GameType.GENSHIN;
    }
    getApiConfig() {
      return {
        BBS_URL: "https://act.mihoyo.com/ys/event/calculator/index.html",
        ROLE_URL: "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn"
      };
    }
    async getCharacterDetails(uid, region) {
      return getDetailList$2(uid, region);
    }
    async syncCharacters(res) {
      console.group("返回数据");
      console.groupCollapsed("角色");
      console.table(res.map((a) => a.character));
      console.groupEnd();
      console.groupCollapsed("武器");
      console.table(res.map((a) => a.weapon));
      console.groupEnd();
      console.groupCollapsed("角色天赋");
      res.forEach((c) => {
        const name = c.character.name;
        console.groupCollapsed(name);
        console.table(c.skill_list);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();
      for (let v of res) {
        await addCharacter$2(v);
      }
    }
    importSeelieMethods() {
      return { batchUpdateCharacter: batchUpdateCharacter$2, batchUpdateWeapon: batchUpdateWeapon$2 };
    }
    getCharacterStatusList() {
      return characterStatusList$2;
    }
  }
  const characters$1 = JSON.parse(GM_getResourceText("hsr_character"));
  const weapons$1 = JSON.parse(GM_getResourceText("hsr_weapon"));
  const charactersNum = characters$1.length;
  const getCharacterId$1 = (queryName) => {
    for (let e of characters$1) {
      const { id, name } = e;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getCharacterId ${queryName} 查询失败`);
    return "";
  };
  const getWeaponId$1 = (queryName) => {
    for (let e of weapons$1) {
      const { id, name } = e;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getWeaponrId ${queryName} 查询失败`);
    return "";
  };
  axios$1.defaults.adapter = xhrAdapter;
  axios$1.defaults.withCredentials = true;
  const CHARACTERS_URL$1 = "https://api-takumi.mihoyo.com/event/rpgcalc/avatar/list";
  const CHARACTERS_DETAIL_URL$1 = "https://api-takumi.mihoyo.com/event/rpgcalc/avatar/detail";
  const requestPageSize = 50;
  const getCharacters$1 = async (uid, region, page = 1) => {
    let url = CHARACTERS_URL$1;
    let game = "hkrpg";
    let params = `?game=${game}&uid=${uid}&region=${region}&lang=zh-cn&tab_from=TabOwned&page=${page}&size=100`;
    const [err, res] = await to(axios$1.get(url + params, {
      headers
    }));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
      }
    }
    throw err ? err : new Error("角色列表获取失败");
  };
  const getCharacterDetail$1 = async (character, uid, region) => {
    const { item_id: id } = character;
    let game = "hkrpg";
    const params = `?game=${game}&lang=zh-cn&item_id=${id}&tab_from=TabOwned&change_target_level=0&uid=${uid}&region=${region}`;
    let URL = CHARACTERS_DETAIL_URL$1;
    const [err, res] = await to(axios$1.get(URL + params, {
      headers
    }));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const characterData = await data2;
          return characterData;
        }
      }
    } else {
      console.error(err);
    }
  };
  const getDetailList$1 = async (game_uid, region) => {
    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());
    const characters2 = [];
    for await (let i of idxs) {
      characters2.push.apply(characters2, await getCharacters$1(game_uid, region, i + 1));
    }
    const details = characters2.map((c) => getCharacterDetail$1(c, game_uid, region));
    const detailList = [];
    for await (let d of details) {
      if (!!d) {
        detailList.push(d);
      }
    }
    return detailList;
  };
  const addGoal$1 = async (data2) => {
    var _a2, _b2;
    let index = -1;
    const goals = await getTotalGoal();
    if (data2.character) {
      index = goals.findIndex(
        (g2) => g2.character === data2.character && g2.type === data2.type
      );
    } else if (data2.id) {
      index = goals.findIndex((g2) => g2.id === data2.id);
    }
    if (index >= 0) {
      goals[index] = { ...goals[index], ...data2 };
    } else {
      const lastId = (_b2 = (_a2 = goals == null ? void 0 : goals.map((g2) => g2.id)) == null ? void 0 : _a2.filter((id) => typeof id == "number")) == null ? void 0 : _b2.sort((a, b) => a < b ? 1 : -1)[0];
      data2.id = (lastId || 0) + 1;
      goals.push(data2);
    }
    await setGoals(goals);
  };
  let initBonus = {};
  const addTraceGoal$1 = async (talentCharacter, skill_list, skills_servant) => {
    const totalGoal = await getTotalGoal();
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "trace" && g2.character == talentCharacter);
    skill_list.sort((a, b) => a.point_id > b.point_id ? 1 : 0);
    const [baseCurrent, skillCurrent, ultimateCurrent, talentCurrent] = skill_list.map((a) => a.cur_level);
    let [petSkillCurrent, petTalentCurrent] = [1, 1];
    let hasServant = skills_servant && skills_servant.length > 0;
    if (hasServant) {
      [petSkillCurrent, petTalentCurrent] = skills_servant.map((a) => a.cur_level);
    }
    let talentGoal;
    if (talentIdx < 0) {
      const id = await getNextId();
      talentGoal = {
        type: "trace",
        character: talentCharacter,
        basic: {
          current: baseCurrent,
          goal: baseCurrent
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent
        },
        ultimate: {
          current: ultimateCurrent,
          goal: ultimateCurrent
        },
        talent: {
          current: talentCurrent,
          goal: talentCurrent
        },
        pet_skill: {
          current: petSkillCurrent,
          goal: petSkillCurrent
        },
        pet_talent: {
          current: petSkillCurrent,
          goal: petSkillCurrent
        },
        bonus: initBonus,
        id
      };
    } else {
      const seelieGoal = totalGoal[talentIdx];
      const { basic, skill, ultimate, talent, pet_skill, pet_talent } = seelieGoal;
      const { goal: basicGoal } = basic;
      const { goal: skillGoal } = skill;
      const { goal: ultimateGoal } = ultimate;
      const { goal: talentGoal2 } = talent;
      const { goal: petSkillGoal } = pet_skill;
      const { goal: petTalentGoal } = pet_talent;
      talentGoal = {
        ...seelieGoal,
        basic: {
          current: baseCurrent,
          goal: baseCurrent > basicGoal ? Math.min(petSkillCurrent, 6) : basicGoal
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
        },
        ultimate: {
          current: ultimateCurrent,
          goal: ultimateCurrent > ultimateGoal ? ultimateCurrent : ultimateGoal
        },
        talent: {
          current: talentCurrent,
          goal: talentCurrent > talentGoal2 ? talentCurrent : talentGoal2
        },
        pet_skill: {
          current: petSkillCurrent,
          goal: petSkillCurrent > petSkillGoal ? Math.min(petSkillCurrent, 6) : petSkillGoal
        },
        pet_talent: {
          current: petTalentCurrent,
          goal: petTalentCurrent > petTalentGoal ? Math.min(petTalentCurrent, 6) : petTalentGoal
        }
      };
    }
    await addGoal$1(talentGoal);
  };
  const addCharacterGoal$1 = async (level_current, nameEn, name, type) => {
    const totalGoal = await getTotalGoal();
    let characterPredicate = (g2) => g2.type == type && g2.character == nameEn;
    let weaponPredicate = (g2) => g2.type == type && g2.cone == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus = initCharacterStatus$1(level_current);
    let characterGoal;
    function initCharacterGoal(id) {
      return {
        type,
        character: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id,
        eidolon: 0
      };
    }
    function initWeaponGoal(id) {
      return {
        type,
        character: "",
        cone: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id
      };
    }
    if (characterIdx < 0) {
      const id = await getNextId();
      characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
      const seelieGoal = type == "character" ? totalGoal[characterIdx] : totalGoal[characterIdx];
      const { goal, current } = seelieGoal;
      const { level: levelCurrent, asc: ascCurrent } = current;
      const { level: levelGoal, asc: ascGoal } = goal;
      const { level, asc } = characterStatus;
      characterGoal = {
        ...seelieGoal,
        current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
        goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal
      };
    }
    await addGoal$1(characterGoal);
  };
  async function addCharacter$1(characterDataEx) {
    const { avatar: character, skills: skill_list, skills_servant, equipment: weapon } = characterDataEx;
    const { item_name: name } = character;
    if (weapon) {
      const { item_name: name2, cur_level: weaponLeveL } = weapon;
      const weaponId = getWeaponId$1(name2);
      if (weaponId) {
        await addCharacterGoal$1(weaponLeveL, weaponId, name2, "cone");
      }
    }
    const { cur_level: characterLevel } = character;
    const characterId = getCharacterId$1(name);
    if (!characterId || characterId.includes("trailblazer")) {
      return;
    }
    await addCharacterGoal$1(characterLevel, characterId, name, "character");
    await addTraceGoal$1(characterId, skill_list, skills_servant);
  }
  const characterStatusList$1 = [
    { level: 1, asc: 0, text: "1" },
    { level: 20, asc: 0, text: "20" },
    { level: 20, asc: 1, text: "20 A" },
    { level: 30, asc: 1, text: "30" },
    { level: 30, asc: 2, text: "30 A" },
    { level: 40, asc: 2, text: "40" },
    { level: 40, asc: 3, text: "40 A" },
    { level: 50, asc: 3, text: "50" },
    { level: 50, asc: 4, text: "50 A" },
    { level: 60, asc: 5, text: "60" },
    { level: 60, asc: 5, text: "60 A" },
    { level: 70, asc: 5, text: "70" },
    { level: 70, asc: 6, text: "70 A" },
    { level: 80, asc: 6, text: "80" }
  ];
  const initCharacterStatus$1 = (level_current) => {
    let initCharacterStatus2 = characterStatusList$1[0];
    if (level_current < 20) {
      return initCharacterStatus2;
    }
    for (let characterStatus of characterStatusList$1) {
      const { level } = characterStatus;
      if (level_current < level) {
        return initCharacterStatus2;
      } else if (level_current == level) {
        return characterStatus;
      } else if (level_current > level) {
        initCharacterStatus2 = characterStatus;
      }
    }
    return initCharacterStatus2;
  };
  const updateTrace$1 = async (talent, normalGoal = 6, skillGoal = 9, burstGoal = 9, talentGoal2 = 9) => {
    const {
      basic: { current: basicCurrent },
      skill: { current: skillCurrent },
      ultimate: { current: ultimateCurrent },
      talent: { current: talentCurrent }
    } = talent;
    const talentNew = {
      ...talent,
      basic: {
        current: basicCurrent,
        goal: basicCurrent > normalGoal ? basicCurrent : normalGoal
      },
      skill: {
        current: skillCurrent,
        goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
      },
      ultimate: {
        current: ultimateCurrent,
        goal: ultimateCurrent > burstGoal ? ultimateCurrent : burstGoal
      },
      talent: {
        current: talentCurrent,
        goal: talentCurrent > talentGoal2 ? talentCurrent : talentGoal2
      }
    };
    await addGoal$1(talentNew);
  };
  const batchUpdateTrace$1 = async (all, normal, skill, burst, t) => {
    if (normal > 6) {
      normal = 6;
    }
    await batchUpdateGoals(
      "trace",
      "character",
      // 天赋目标用character字段标识
      (trace) => updateTrace$1(trace, normal, skill, burst, t),
      all
    );
  };
  const updateCharacter$1 = async (character, characterStatusGoal) => {
    const { current } = character;
    const { level: levelCurrent, asc: ascCurrent } = current;
    const { level, asc } = characterStatusGoal;
    const characterGoalNew = {
      ...character,
      goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current
    };
    await addGoal$1(characterGoalNew);
  };
  const batchUpdateCharacter$1 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "character",
      "character",
      updateCharacter$1,
      all,
      characterStatusGoal
    ).then(() => {
      console.log("角色更新完成");
    });
  };
  const batchUpdateWeapon$1 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "cone",
      "cone",
      (weapon) => updateCharacter$1(weapon, characterStatusGoal),
      all,
      characterStatusGoal
    ).then(() => {
      console.log("武器更新完成");
    });
  };
  class HsrAdapter extends BaseAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "batchUpdateTalent", (all, normal, skill, burst, t) => {
        batchUpdateTrace$1(all, normal, skill, burst, t);
      });
      __publicField(this, "getInactiveConfig", () => {
        const HSR_INACTIVE_CONFIG = [
          { type: "character", identifierKey: "character" },
          // 角色目标
          {
            type: "trace",
            identifierKey: "character",
            isTalent: true,
            talentKeys: ["basic", "skill", "ultimate", "talent", "pet_talent", "pet_skill"]
          },
          // 行迹目标
          { type: "cone", identifierKey: "id" }
          // 光锥目标（标识键为 id）
        ];
        return HSR_INACTIVE_CONFIG;
      });
    }
    getGameName() {
      return GameType.HSR;
    }
    getApiConfig() {
      return {
        BBS_URL: "https://act.mihoyo.com/sr/event/cultivation-tool/index.html",
        ROLE_URL: "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn"
      };
    }
    async getCharacterDetails(uid, region) {
      return getDetailList$1(uid, region);
    }
    async syncCharacters(res) {
      console.group("返回数据");
      console.groupCollapsed("角色");
      console.table(res.map((a) => a.avatar));
      console.groupEnd();
      console.groupCollapsed("光锥");
      console.table(res.map((a) => a.equipment));
      console.groupEnd();
      console.groupCollapsed("角色天赋");
      res.forEach((c) => {
        const name = c.avatar.item_name;
        console.groupCollapsed(name);
        console.table(c.skills);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupCollapsed("角色额外天赋(仅展示不做处理)");
      res.forEach((c) => {
        const name = c.avatar.item_name;
        console.groupCollapsed(name);
        console.table(c.skills_other);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();
      for (let v of res) {
        await addCharacter$1(v);
      }
    }
    importSeelieMethods() {
      return { batchUpdateCharacter: batchUpdateCharacter$1, batchUpdateWeapon: batchUpdateWeapon$1 };
    }
    getCharacterStatusList() {
      return characterStatusList$1;
    }
    async getItem(key) {
      return localforage2.getItem(key);
    }
    async setItem(key, value) {
      return localforage2.setItem(key, value);
    }
  }
  axios$1.defaults.adapter = xhrAdapter;
  axios$1.defaults.withCredentials = true;
  const CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_basic_list";
  const CHARACTERS_DETAIL_URL = "https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/batch_avatar_detail_v2";
  const getCharacters = async (uid, region, page = 1) => {
    let url = CHARACTERS_URL;
    let params = `?uid=${uid}&region=${region}`;
    let fp = await getFp();
    const [err, res] = await to(axios$1.get(url + params, {
      headers: {
        ...headers,
        "x-rpc-device_fp": fp
      },
      timeout: 1e4
    }));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
      }
    }
    alert("请确认已登录活动页面且绑定账户!");
    throw err ? err : new Error("角色列表获取失败");
  };
  const getCharacterDetail = async (ids, uid, region) => {
    const params = `?uid=${uid}&region=${region}`;
    let URL = CHARACTERS_DETAIL_URL;
    let fp = await getFp();
    let avatarList = ids.map((id) => ({
      avatar_id: id,
      is_teaser: false,
      teaser_need_weapon: false,
      teaser_sp_skill: false
    }));
    const [err, res] = await to(axios$1.post(
      URL + params,
      {
        avatar_list: avatarList
      },
      {
        headers: {
          ...headers,
          "x-rpc-device_fp": fp
        },
        timeout: 1e4
      }
    ));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
      }
    } else {
      console.error(err);
    }
    return [];
  };
  const getDetailList = async (game_uid, region) => {
    let maxPageSize = 1;
    let idxs = Array.from(new Array(maxPageSize).keys());
    const characters2 = [];
    for await (let i of idxs) {
      let characterData = await getCharacters(game_uid, region, i + 1);
      characters2.push.apply(characters2, characterData.filter((a) => a.unlocked).map((a) => a.avatar));
    }
    let ids = characters2.map((a) => a.id);
    const batchSize = 10;
    const allResults = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);
      const batchResults = await getCharacterDetail(batchIds, game_uid, region);
      allResults.push(...batchResults);
    }
    return allResults;
  };
  const characters = JSON.parse(GM_getResourceText("zzz_character"));
  const weapons = JSON.parse(GM_getResourceText("zzz_weapon"));
  characters.length;
  const getCharacterId = (queryName) => {
    for (let e of characters) {
      const { id, name } = e;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getCharacterId ${queryName} 查询失败`);
    return "";
  };
  const getWeaponId = (queryName) => {
    for (let e of weapons) {
      const { id, name } = e;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getWeaponrId ${queryName} 查询失败`);
    return "";
  };
  const addGoal = async (data2) => {
    var _a2, _b2;
    let index = -1;
    const goals = await getTotalGoal();
    if (data2.character) {
      index = goals.findIndex(
        (g2) => g2.character === data2.character && g2.type === data2.type
      );
    } else if (data2.id) {
      index = goals.findIndex((g2) => g2.id === data2.id);
    }
    if (index >= 0) {
      goals[index] = { ...goals[index], ...data2 };
    } else {
      const lastId = (_b2 = (_a2 = goals == null ? void 0 : goals.map((g2) => g2.id)) == null ? void 0 : _a2.filter((id) => typeof id == "number")) == null ? void 0 : _b2.sort((a, b) => a < b ? 1 : -1)[0];
      data2.id = (lastId || 0) + 1;
      goals.push(data2);
    }
    await setGoals(goals);
  };
  const addTraceGoal = async (talentCharacter, skill_list) => {
    const totalGoal = await getTotalGoal();
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "talent" && g2.character == talentCharacter);
    const typeOrder = [0, 2, 6, 1, 3, 5];
    skill_list.sort((a, b) => {
      const aIndex = typeOrder.indexOf(a.skill_type);
      const bIndex = typeOrder.indexOf(b.skill_type);
      return aIndex - bIndex;
    });
    const [baseCurrent, dodgeCurrent, assistCurrent, specialCurrent, chainCurrent, coreCurrent] = skill_list.map((a) => a.level);
    let talentGoal;
    let coreValue = coreCurrent - 1;
    if (talentIdx < 0) {
      const id = await getNextId();
      talentGoal = {
        type: "talent",
        character: talentCharacter,
        basic: {
          current: baseCurrent,
          goal: baseCurrent
        },
        dodge: {
          current: dodgeCurrent,
          goal: dodgeCurrent
        },
        assist: {
          current: assistCurrent,
          goal: assistCurrent
        },
        special: {
          current: specialCurrent,
          goal: specialCurrent
        },
        chain: {
          current: chainCurrent,
          goal: chainCurrent
        },
        core: {
          current: Math.max(1, coreValue),
          goal: Math.max(1, coreValue)
        },
        id
      };
    } else {
      const seelieGoal = totalGoal[talentIdx];
      const { basic, dodge, assist, special, chain, core } = seelieGoal;
      const { goal: basicGoal } = basic;
      const { goal: dodgeGoal } = dodge;
      const { goal: assistGoal } = assist;
      const { goal: specialGoal } = special;
      const { goal: chainGoal } = chain;
      const { goal: coreGoal } = core;
      talentGoal = {
        ...seelieGoal,
        basic: {
          current: baseCurrent,
          goal: baseCurrent > basicGoal ? baseCurrent : basicGoal
        },
        dodge: {
          current: dodgeCurrent,
          goal: dodgeCurrent > dodgeGoal ? dodgeCurrent : dodgeGoal
        },
        assist: {
          current: assistCurrent,
          goal: assistCurrent > assistGoal ? assistCurrent : assistGoal
        },
        special: {
          current: specialCurrent,
          goal: specialCurrent > specialGoal ? specialCurrent : specialGoal
        },
        chain: {
          current: chainCurrent,
          goal: chainCurrent > chainGoal ? chainCurrent : chainGoal
        },
        core: {
          current: coreValue,
          goal: coreValue > coreGoal ? coreValue : coreGoal
        }
      };
    }
    await addGoal(talentGoal);
  };
  const addCharacterGoal = async (level_current, nameEn, name, type) => {
    let totalGoal = await getTotalGoal();
    let characterPredicate = (g2) => g2.type == type && g2.character == nameEn;
    let weaponPredicate = (g2) => g2.type == type && g2.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus = initCharacterStatus(level_current);
    let characterGoal;
    function initCharacterGoal(id) {
      return {
        type: "character",
        character: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id,
        cons: 0
      };
    }
    function initWeaponGoal(id) {
      return {
        type: "weapon",
        character: "",
        weapon: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id
      };
    }
    if (characterIdx < 0) {
      const id = await getNextId();
      characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
      const seelieGoal = type == "character" ? totalGoal[characterIdx] : totalGoal[characterIdx];
      const { goal, current } = seelieGoal;
      const { level: levelCurrent, asc: ascCurrent } = current;
      const { level: levelGoal, asc: ascGoal } = goal;
      const { level, asc } = characterStatus;
      characterGoal = {
        ...seelieGoal,
        current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
        goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal
      };
    }
    await addGoal(characterGoal);
  };
  async function addCharacter(characterDataEx) {
    const { avatar: character, weapon } = characterDataEx;
    const { name_mi18n: name, skills: skill_list } = character;
    if (weapon) {
      const { name: name2, level: weaponLeveL } = weapon;
      const weaponId = getWeaponId(name2);
      if (weaponId) {
        await addCharacterGoal(weaponLeveL, weaponId, name2, "weapon");
      }
    }
    const { level: characterLevel } = character;
    const characterId = getCharacterId(name);
    if (!characterId || characterId.includes("trailblazer")) {
      return;
    }
    await addCharacterGoal(characterLevel, characterId, name, "character");
    await addTraceGoal(characterId, skill_list);
  }
  const characterStatusList = [
    { level: 1, asc: 0, text: "1" },
    { level: 20, asc: 0, text: "20" },
    { level: 20, asc: 1, text: "20 A" },
    { level: 30, asc: 1, text: "30" },
    { level: 30, asc: 2, text: "30 A" },
    { level: 40, asc: 2, text: "40" },
    { level: 40, asc: 3, text: "40 A" },
    { level: 50, asc: 3, text: "50" },
    { level: 50, asc: 4, text: "50 A" },
    { level: 60, asc: 5, text: "60" }
  ];
  const initCharacterStatus = (level_current) => {
    let initCharacterStatus2 = characterStatusList[0];
    if (level_current < 20) {
      return initCharacterStatus2;
    }
    for (let characterStatus of characterStatusList) {
      const { level } = characterStatus;
      if (level_current < level) {
        return initCharacterStatus2;
      } else if (level_current == level) {
        return characterStatus;
      } else if (level_current > level) {
        initCharacterStatus2 = characterStatus;
      }
    }
    return initCharacterStatus2;
  };
  const updateTrace = async (talent, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
    const {
      basic: { current: baseCurrent },
      dodge: { current: dodgeCurrent },
      assist: { current: assistCurrent },
      special: { current: specialCurrent },
      chain: { current: chainCurrent },
      core: { current: coreCurrent }
    } = talent;
    const talentNew = {
      ...talent,
      basic: {
        current: baseCurrent,
        goal: baseCurrent > basicGoal ? baseCurrent : basicGoal
      },
      dodge: {
        current: dodgeCurrent,
        goal: dodgeCurrent > dodgeGoal ? dodgeCurrent : dodgeGoal
      },
      assist: {
        current: assistCurrent,
        goal: assistCurrent > assistGoal ? assistCurrent : assistGoal
      },
      special: {
        current: specialCurrent,
        goal: specialCurrent > specialGoal ? specialCurrent : specialGoal
      },
      chain: {
        current: chainCurrent,
        goal: chainCurrent > chainGoal ? chainCurrent : chainGoal
      },
      core: {
        current: coreCurrent,
        goal: coreCurrent > coreGoal ? coreCurrent : coreGoal
      }
    };
    await addGoal(talentNew);
  };
  const batchUpdateTrace = async (all, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
    if (coreGoal > 6) {
      coreGoal = 6;
    }
    await batchUpdateGoals(
      "talent",
      "character",
      // 天赋目标用character字段标识
      (trace) => updateTrace(trace, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal),
      all
    );
  };
  const updateCharacter = async (character, characterStatusGoal) => {
    const { current } = character;
    const { level: levelCurrent, asc: ascCurrent } = current;
    const { level, asc } = characterStatusGoal;
    const characterGoalNew = {
      ...character,
      goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current
    };
    await addGoal(characterGoalNew);
  };
  const batchUpdateCharacter = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "character",
      "character",
      // 角色目标用character字段标识
      updateCharacter,
      all,
      characterStatusGoal
    ).then(() => {
      console.log("角色更新完成");
    });
  };
  const batchUpdateWeapon = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "weapon",
      "weapon",
      // 武器目标用weapon字段标识
      (weapon) => updateCharacter(weapon, characterStatusGoal),
      all,
      characterStatusGoal
    ).then(() => {
      console.log("武器更新完成");
    });
  };
  class ZzzAdapter extends BaseAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "batchUpdateTalent", (all, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal) => {
        batchUpdateTrace(all, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal);
      });
      __publicField(this, "getInactiveConfig", () => {
        const ZZZ_INACTIVE_CONFIG = [
          { type: "character", identifierKey: "character" },
          // 角色目标
          {
            type: "talent",
            identifierKey: "character",
            isTalent: true,
            talentKeys: ["basic", "dodge", "assist", "special", "chain", "core"]
          },
          // 天赋目标
          { type: "weapon", identifierKey: "id" }
          // 武器目标（标识键为 id）
        ];
        return ZZZ_INACTIVE_CONFIG;
      });
    }
    getGameName() {
      return GameType.ZZZ;
    }
    getApiConfig() {
      return {
        BBS_URL: "https://act.mihoyo.com/zzz/gt/character-builder-h/index.html",
        ROLE_URL: "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookieToken?game_biz=nap_cn"
      };
    }
    async getCharacterDetails(uid, region) {
      return getDetailList(uid, region);
    }
    async syncCharacters(res) {
      console.group("返回数据");
      console.groupCollapsed("角色");
      console.table(res.map((a) => a.avatar));
      console.groupEnd();
      console.groupCollapsed("光锥");
      console.table(res.map((a) => a.weapon));
      console.groupEnd();
      console.groupCollapsed("角色天赋");
      res.forEach((c) => {
        const name = c.avatar.name_mi18n;
        console.groupCollapsed(name);
        console.table(c.avatar.skills);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();
      for (let v of res) {
        await addCharacter(v);
      }
    }
    importSeelieMethods() {
      return { batchUpdateCharacter, batchUpdateWeapon };
    }
    getCharacterStatusList() {
      return characterStatusList;
    }
  }
  class AdapterManager {
    static init() {
      this.adapters.set(GameType.GENSHIN, new GenshinAdapter());
      this.adapters.set(GameType.HSR, new HsrAdapter());
      this.adapters.set(GameType.ZZZ, new ZzzAdapter());
      this.detectCurrentGame();
    }
    // 新增：根据域名检测当前游戏
    static detectCurrentGame() {
      const hostname = window.location.hostname;
      console.log("当前域名: %s", hostname);
      for (const [domain, gameType] of Object.entries(GameDomainMap)) {
        if (hostname.includes(domain)) {
          this.currentGame = gameType;
          return;
        }
      }
      this.currentGame = GameType.GENSHIN;
    }
    // 获取当前域名对应的适配器
    static getCurrentAdapter() {
      return this.getAdapter(this.currentGame);
    }
    // 获取当前游戏类型
    static getCurrentGameType() {
      return this.currentGame;
    }
    static getAdapter(gameType) {
      const adapter = this.adapters.get(gameType);
      if (!adapter) {
        throw new Error(`未找到游戏 ${gameType} 的适配器`);
      }
      return adapter;
    }
    static getSupportedGames() {
      return Array.from(this.adapters.entries()).map(([type, adapter]) => ({
        type,
        name: adapter.getGameName()
      }));
    }
  }
  __publicField(AdapterManager, "adapters", /* @__PURE__ */ new Map());
  __publicField(AdapterManager, "currentGame");
  AdapterManager.init();
  function CharacterGoalTab(props) {
    const {
      showText,
      batchUpdateCharacter: batchUpdateCharacter2
    } = props;
    const [selectAllRoles, setSelectAllRoles] = require$$1.useState(() => true);
    const characterStatusList2 = AdapterManager.getCurrentAdapter().getCharacterStatusList();
    const optionList = characterStatusList2.slice(0).reverse();
    const [characterLevelGoal, setCharacterLevelGoal] = require$$1.useState(() => optionList[0]);
    const batchSetCharacterGoalLevel = () => {
      batchUpdateCharacter2(!selectAllRoles, characterLevelGoal);
    };
    return /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex pt-4",
        children: /* @__PURE__ */ jsx(ToggleSwitch, {
          className: "w-full",
          checked: selectAllRoles,
          onChange: setSelectAllRoles,
          labelLeft: `全部${showText}`,
          labelRight: `仅激活${showText}`
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex pt-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "w-1/2 text-white-900",
          children: [showText, "目标等级:"]
        }), /* @__PURE__ */ jsx("div", {
          className: "w-1/2",
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: characterLevelGoal,
            setSelected: setCharacterLevelGoal,
            optionList,
            show: (characterStatus) => `${characterStatus.text.replace("A", "破")}`
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex pt-2",
        children: /* @__PURE__ */ jsx("div", {
          className: "w-full",
          children: /* @__PURE__ */ jsxs("button", {
            className: "text-white bg-blue-500 px-4 py-2",
            onClick: batchSetCharacterGoalLevel,
            children: ["批量设置", showText, "目标等级"]
          })
        })
      })]
    });
  }
  const TALENT_CONFIG = {
    [GameType.GENSHIN]: {
      talentTypes: ["normal", "skill", "burst"],
      // 原神天赋类型
      labels: ["普通攻击", "元素战技", "元素爆发"],
      // 对应标签
      maxLevel: 10
      // 原神天赋最大等级
    },
    [GameType.HSR]: {
      talentTypes: ["normal", "skill", "burst", "t"],
      // HSR行迹类型
      labels: ["普通攻击", "战技", "终结技", "天赋"],
      // HSR标签
      maxLevel: 10
      // HSR行迹最大等级
    },
    [GameType.ZZZ]: {
      talentTypes: ["basic", "dodge", "assist", "special", "chain", "core"],
      // ZZZ技能类型
      labels: ["普通攻击", "闪避技", "支援技", "特殊技", "连携技", "核心被动"],
      // ZZZ标签
      maxLevel: 12
      // ZZZ技能最大等级
    }
  };
  function TalentGoalTab() {
    const currentGame = AdapterManager.getCurrentGameType();
    const {
      talentTypes,
      labels,
      maxLevel
    } = TALENT_CONFIG[currentGame] || TALENT_CONFIG[GameType.GENSHIN];
    const [talentGoalLevel, setTalentGoalLevel] = require$$1.useState(Object.fromEntries(talentTypes.map((type) => [type, maxLevel - 1])));
    const [selectAllRoles, setSelectAllRoles] = require$$1.useState(true);
    const talentLevels = Array.from({
      length: maxLevel
    }, (_, i) => i + 1).reverse();
    const handleBatchUpdate = () => {
      const levels = talentTypes.map((type) => talentGoalLevel[type]);
      AdapterManager.getCurrentAdapter().batchUpdateTalent(!selectAllRoles, ...levels);
    };
    return /* @__PURE__ */ jsxs("div", {
      children: [" ", /* @__PURE__ */ jsxs("div", {
        className: "flex pt-4",
        children: [" ", /* @__PURE__ */ jsx(ToggleSwitch, {
          className: "w-full",
          checked: selectAllRoles,
          onChange: setSelectAllRoles,
          labelLeft: "全部角色",
          labelRight: "仅激活角色"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-rows-2 grid-flow-col gap-2",
        children: [" ", talentTypes.map((type, index) => /* @__PURE__ */ jsxs("div", {
          className: "flex ex-flex-col items-center",
          children: [/* @__PURE__ */ jsx("label", {
            className: "mt-10",
            children: labels[index]
          }), " ", /* @__PURE__ */ jsx(ListboxSelect, {
            selected: talentGoalLevel[type],
            setSelected: (num) => setTalentGoalLevel({
              ...talentGoalLevel,
              [type]: num
            }),
            optionList: talentLevels,
            show: (num) => `${num}`
          })]
        }, type))]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex pt-2",
        children: [" ", /* @__PURE__ */ jsxs("div", {
          className: "w-full",
          children: [" ", /* @__PURE__ */ jsx("button", {
            onClick: handleBatchUpdate,
            className: "text-white bg-blue-500 px-4 py-2",
            children: "批量设置角色目标技能"
          })]
        })]
      })]
    });
  }
  function ExDialog(props) {
    const {
      onClose
    } = props;
    const currentAdapter = AdapterManager.getCurrentAdapter();
    require$$1.useEffect(() => {
      console.log(`当前游戏：${currentAdapter.getGameName()}`);
    }, [currentAdapter]);
    const [accountList, setAccountList] = require$$1.useState([]);
    const [currentAccount, setCurrentAccount] = require$$1.useState();
    const [isFirstPanelOpen, setIsFirstPanelOpen] = require$$1.useState(false);
    const [isSecondPanelOpen, setIsSecondPanelOpen] = require$$1.useState(false);
    const [activeTab, setActiveTab] = require$$1.useState(0);
    const [isSyncing, setIsSyncing] = require$$1.useState(false);
    const panelRefs = [require$$1.useRef(null), require$$1.useRef(null)];
    require$$1.useEffect(() => {
      const handleClickOutside = (e) => {
        if (panelRefs[0].current && !panelRefs[0].current.contains(e.target) && isFirstPanelOpen) {
          setIsFirstPanelOpen(false);
        }
        if (panelRefs[1].current && !panelRefs[1].current.contains(e.target) && isSecondPanelOpen) {
          setIsSecondPanelOpen(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [isFirstPanelOpen, isSecondPanelOpen]);
    const handleRoleSelectChange = (idx) => {
      setCurrentAccount(accountList[idx]);
    };
    const accountShow = (idx) => {
      if (!accountList || !accountList[idx]) {
        return "";
      }
      const role = accountList[idx];
      return `${role.game_uid}(${role.region})`;
    };
    const getAccountList = () => {
      currentAdapter.getAccounts().then((res) => {
        const roles = res;
        setAccountList(roles);
        roles.length > 0 && setCurrentAccount(roles[0]);
      }).catch((err) => {
        console.error(err);
        console.error("账户信息获取失败");
        alert("账户信息获取失败");
      });
    };
    const syncCharacterInfo = () => {
      if (!currentAccount) {
        console.error("账户信息获取失败");
        alert("账户信息获取失败");
        return;
      }
      console.log("开始同步角色信息");
      setIsSyncing(true);
      const {
        game_uid,
        region
      } = currentAccount;
      currentAdapter.getCharacterDetails(game_uid, region).then(async (res) => {
        await currentAdapter.syncCharacters(res);
        console.log("米游社数据无法判断是否突破,请自行比较整数等级是否已突破");
        console.log("角色信息同步完毕");
        await refreshPage();
      }).catch((err) => {
        console.error("同步失败:", err);
        GM_openInTab(currentAdapter.getApiConfig().BBS_URL);
      }).finally(() => {
        setIsSyncing(false);
      });
    };
    function classNames2(...classes) {
      return classes.filter(Boolean).join(" ");
    }
    const handleMouseLeave = () => {
      setIsFirstPanelOpen(false);
      setIsSecondPanelOpen(false);
      onClose();
    };
    const batchInActive = () => {
      setInactive(currentAdapter.getInactiveConfig());
    };
    return /* @__PURE__ */ jsxs("div", {
      className: "fixed top-10 inset-x-[20%] ex-mx-auto min-w-[50%] min-h-min rounded-md bg-slate-800/90 text-white text-center z-[1200] shadow-2xl",
      onMouseLeave: handleMouseLeave,
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold underline pt-4 text-white",
        children: "SeelieEX"
      }), /* @__PURE__ */ jsx("div", {
        className: "w-full p-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "w-full max-w-md p-2 ex-mx-auto bg-purple-900/30 rounded-2xl border border-purple-700/50",
          children: [/* @__PURE__ */ jsxs("div", {
            ref: panelRefs[0],
            className: "mt-2 border border-gray-700 rounded-lg bg-slate-700/50",
            children: [/* @__PURE__ */ jsxs("button", {
              className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-800/70 rounded-lg hover:bg-purple-700 focus:outline-none transition-colors",
              onClick: () => setIsFirstPanelOpen(!isFirstPanelOpen),
              children: [/* @__PURE__ */ jsx("span", {
                children: "角色信息同步"
              }), /* @__PURE__ */ jsx("svg", {
                className: `w-5 h-5 text-purple-300 transition-transform ${isFirstPanelOpen ? "transform rotate-180" : ""}`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M19 9l-7 7-7-7"
                })
              })]
            }), isFirstPanelOpen && /* @__PURE__ */ jsxs("div", {
              className: "px-4 pt-4 pb-2 text-sm text-gray-100",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex pt-2",
                children: /* @__PURE__ */ jsx("div", {
                  className: "w-full",
                  children: /* @__PURE__ */ jsx("button", {
                    className: "text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-colors",
                    onClick: getAccountList,
                    children: "获取账户信息"
                  })
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex pt-4",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "w-1/2 text-gray-200",
                  children: "账户选择:"
                }), /* @__PURE__ */ jsx("div", {
                  className: "w-1/2",
                  children: /* @__PURE__ */ jsx(ListboxSelect, {
                    selected: currentAccount ? accountList.indexOf(currentAccount) : 0,
                    setSelected: handleRoleSelectChange,
                    optionList: accountList.map((_, idx) => idx),
                    show: accountShow
                  })
                })]
              }), /* @__PURE__ */ jsx("div", {
                className: "flex pt-2",
                children: /* @__PURE__ */ jsxs("div", {
                  className: "w-full",
                  children: [/* @__PURE__ */ jsx("button", {
                    className: "text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-colors",
                    onClick: syncCharacterInfo,
                    disabled: isSyncing,
                    children: isSyncing ? "同步中..." : "同步mihoyo角色信息"
                  }), isSyncing && /* @__PURE__ */ jsx("div", {
                    className: "mt-2 text-blue-300",
                    children: "正在同步角色信息，请稍候..."
                  })]
                })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            ref: panelRefs[1],
            className: "mt-2 border border-gray-700 rounded-lg bg-slate-700/50",
            children: [/* @__PURE__ */ jsxs("button", {
              className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-800/70 rounded-lg hover:bg-purple-700 focus:outline-none transition-colors",
              onClick: () => setIsSecondPanelOpen(!isSecondPanelOpen),
              children: [/* @__PURE__ */ jsx("span", {
                children: "规划批量操作"
              }), /* @__PURE__ */ jsx("svg", {
                className: `w-5 h-5 text-purple-300 transition-transform ${isSecondPanelOpen ? "transform rotate-180" : ""}`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M19 9l-7 7-7-7"
                })
              })]
            }), isSecondPanelOpen && /* @__PURE__ */ jsxs("div", {
              className: "px-4 pt-4 pb-2 text-sm text-gray-100",
              children: [/* @__PURE__ */ jsx("div", {
                className: "mb-4",
                children: /* @__PURE__ */ jsx("button", {
                  className: "w-full text-white bg-blue-500 py-2 px-4 rounded transition-colors",
                  onClick: batchInActive,
                  children: "一键激活/取消未达标目标"
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "mt-4",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "flex border-b border-gray-600",
                  children: ["角色目标等级", "天赋目标等级", "武器目标等级"].map((title, idx) => /* @__PURE__ */ jsx("button", {
                    className: classNames2("px-4 py-2 focus:outline-none transition-colors", activeTab === idx ? "border-b-2 border-blue-400 text-blue-300 font-medium" : "text-gray-300 hover:text-white"),
                    onClick: () => setActiveTab(idx),
                    children: title
                  }, idx))
                }), /* @__PURE__ */ jsxs("div", {
                  className: "p-4",
                  children: [activeTab === 0 && /* @__PURE__ */ jsx(CharacterGoalTab, {
                    showText: "角色",
                    batchUpdateCharacter: currentAdapter.batchUpdateCharacter
                  }), activeTab === 1 && /* @__PURE__ */ jsx(TalentGoalTab, {}), activeTab === 2 && /* @__PURE__ */ jsx(CharacterGoalTab, {
                    showText: "武器",
                    batchUpdateCharacter: currentAdapter.batchUpdateWeapon
                  })]
                })]
              })]
            })]
          })]
        })
      })]
    });
  }
  function App() {
    const [showExDialog, setShowExDialog] = require$$1.useState(() => false);
    require$$1.useEffect(() => {
      GM_registerMenuCommand("打开SeelieEx", () => setShowExDialog(true));
      GM_registerMenuCommand("原神祈愿历史一览", () => GM_openInTab("https://genshin-gacha-banners.52v6.com"));
      GM_registerMenuCommand("意见反馈", () => GM_openInTab("https://github.com/KeyPJ/seelieEx/issues"));
    });
    return /* @__PURE__ */ jsx("div", {
      className: "App",
      style: {
        display: showExDialog ? "" : "none"
      },
      children: /* @__PURE__ */ jsx(ExDialog, {
        onClose: () => setShowExDialog(false)
      })
    });
  }
  let seelieEx = document.createElement("div");
  seelieEx.id = "seelieEx";
  seelieEx.className = "flex";
  (_b = (_a = document.getElementById("app")) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.append(seelieEx);
  ReactDOM2.render(/* @__PURE__ */ jsx(require$$1.StrictMode, {
    children: /* @__PURE__ */ jsx(App, {})
  }), document.getElementById("seelieEx"));
})(React, ReactDOM, localforage);