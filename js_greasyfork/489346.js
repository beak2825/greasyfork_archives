// ==UserScript==
// @name         linuxdo-next
// @namespace    linuxdo-next
// @version      0.2.6
// @author       delph1s
// @description  一个呼吸顺畅的 linux.do 论坛
// @license      GPLv2
// @iconURL      https://cdn.linux.do/uploads/default/original/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b.png
// @homepageURL  https://github.com/delph1s/linuxdo-next
// @match        *://linux.do/
// @match        *://linux.do/*
// @match        *://connect.linux.do/
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @connect      connect.linux.do
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489346/linuxdo-next.user.js
// @updateURL https://update.greasyfork.org/scripts/489346/linuxdo-next.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const t=document.createElement("style");t.textContent=n,document.head.append(t)})(' :export{appName:"linuxdo-next";pluginContainer:linuxdo-next-container;pandoraButton:linuxdo-next-pandora-next}#linuxdo-next-container{left:0;font-size:12px}.linuxdo-next-pandora-next{position:fixed;right:1rem;bottom:1rem;z-index:1500} ');

(function (React$1, ReactDOM__default) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const React$1__namespace = /*#__PURE__*/_interopNamespaceDefault(React$1);
  const ReactDOM__default__namespace = /*#__PURE__*/_interopNamespaceDefault(ReactDOM__default);

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  function getAugmentedNamespace(n2) {
    if (n2.__esModule)
      return n2;
    var f2 = n2.default;
    if (typeof f2 == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f2, arguments, this.constructor);
        }
        return f2.apply(this, arguments);
      };
      a.prototype = f2.prototype;
    } else
      a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n2).forEach(function(k2) {
      var d2 = Object.getOwnPropertyDescriptor(n2, k2);
      Object.defineProperty(a, k2, d2.get ? d2 : {
        enumerable: true,
        get: function() {
          return n2[k2];
        }
      });
    });
    return a;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f$2 = React$1, k$2 = Symbol.for("react.element"), l$2 = Symbol.for("react.fragment"), m$3 = Object.prototype.hasOwnProperty, n$2 = f$2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$2 = { key: true, ref: true, __self: true, __source: true };
  function q$2(c2, a, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a.key && (e2 = "" + a.key);
    void 0 !== a.ref && (h2 = a.ref);
    for (b2 in a)
      m$3.call(a, b2) && !p$2.hasOwnProperty(b2) && (d2[b2] = a[b2]);
    if (c2 && c2.defaultProps)
      for (b2 in a = c2.defaultProps, a)
        void 0 === d2[b2] && (d2[b2] = a[b2]);
    return { $$typeof: k$2, type: c2, key: e2, ref: h2, props: d2, _owner: n$2.current };
  }
  reactJsxRuntime_production_min.Fragment = l$2;
  reactJsxRuntime_production_min.jsx = q$2;
  reactJsxRuntime_production_min.jsxs = q$2;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  const appName = '"linuxdo-next"';
  const pluginContainer = "linuxdo-next-container";
  const pandoraButton = "linuxdo-next-pandora-next";
  const styles$3 = {
    appName,
    pluginContainer,
    pandoraButton
  };
  var client = {};
  var m$2 = ReactDOM__default;
  {
    client.createRoot = m$2.createRoot;
    client.hydrateRoot = m$2.hydrateRoot;
  }
  const filterForwardProps = (targetProp, excludeProps) => excludeProps.indexOf(targetProp) === -1;
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _extends$1() {
    _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends$1.apply(this, arguments);
  }
  function r$1(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2)
      n2 += e2;
    else if ("object" == typeof e2)
      if (Array.isArray(e2)) {
        var o = e2.length;
        for (t2 = 0; t2 < o; t2++)
          e2[t2] && (f2 = r$1(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
      } else
        for (f2 in e2)
          e2[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx() {
    for (var e2, t2, f2 = 0, n2 = "", o = arguments.length; f2 < o; f2++)
      (e2 = arguments[f2]) && (t2 = r$1(e2)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function resolveProps$1(defaultProps2, props) {
    const output = _extends$1({}, props);
    Object.keys(defaultProps2).forEach((propName) => {
      if (propName.toString().match(/^(components|slots)$/)) {
        output[propName] = _extends$1({}, defaultProps2[propName], output[propName]);
      } else if (propName.toString().match(/^(componentsProps|slotProps)$/)) {
        const defaultSlotProps = defaultProps2[propName] || {};
        const slotProps = props[propName];
        output[propName] = {};
        if (!slotProps || !Object.keys(slotProps)) {
          output[propName] = defaultSlotProps;
        } else if (!defaultSlotProps || !Object.keys(defaultSlotProps)) {
          output[propName] = slotProps;
        } else {
          output[propName] = _extends$1({}, slotProps);
          Object.keys(defaultSlotProps).forEach((slotPropName) => {
            output[propName][slotPropName] = resolveProps$1(defaultSlotProps[slotPropName], slotProps[slotPropName]);
          });
        }
      } else if (output[propName] === void 0) {
        output[propName] = defaultProps2[propName];
      }
    });
    return output;
  }
  function composeClasses$1(slots, getUtilityClass, classes = void 0) {
    const output = {};
    Object.keys(slots).forEach(
      // `Object.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
      // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
      (slot) => {
        output[slot] = slots[slot].reduce((acc, key) => {
          if (key) {
            const utilityClass = getUtilityClass(key);
            if (utilityClass !== "") {
              acc.push(utilityClass);
            }
            if (classes && classes[key]) {
              acc.push(classes[key]);
            }
          }
          return acc;
        }, []).join(" ");
      }
    );
    return output;
  }
  var colorManipulator = {};
  var interopRequireDefault = { exports: {} };
  (function(module) {
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    module.exports = _interopRequireDefault2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(interopRequireDefault);
  var interopRequireDefaultExports = interopRequireDefault.exports;
  function formatMuiErrorMessage$1(code) {
    let url = "https://mui.com/production-error/?code=" + code;
    for (let i = 1; i < arguments.length; i += 1) {
      url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified MUI error #" + code + "; visit " + url + " for the full message.";
  }
  const formatMuiErrorMessage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: formatMuiErrorMessage$1
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$1$1 = /* @__PURE__ */ getAugmentedNamespace(formatMuiErrorMessage);
  function clamp$1(val, min2 = Number.MIN_SAFE_INTEGER, max2 = Number.MAX_SAFE_INTEGER) {
    return Math.max(min2, Math.min(val, max2));
  }
  const clamp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: clamp$1
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$2 = /* @__PURE__ */ getAugmentedNamespace(clamp);
  var _interopRequireDefault$2 = interopRequireDefaultExports;
  Object.defineProperty(colorManipulator, "__esModule", {
    value: true
  });
  var alpha_1 = colorManipulator.alpha = alpha$1;
  colorManipulator.blend = blend;
  colorManipulator.colorChannel = void 0;
  var darken_1 = colorManipulator.darken = darken;
  colorManipulator.decomposeColor = decomposeColor$1;
  colorManipulator.emphasize = emphasize;
  var getContrastRatio_1 = colorManipulator.getContrastRatio = getContrastRatio;
  colorManipulator.getLuminance = getLuminance;
  colorManipulator.hexToRgb = hexToRgb$2;
  colorManipulator.hslToRgb = hslToRgb;
  var lighten_1 = colorManipulator.lighten = lighten;
  colorManipulator.private_safeAlpha = private_safeAlpha;
  colorManipulator.private_safeColorChannel = void 0;
  colorManipulator.private_safeDarken = private_safeDarken;
  colorManipulator.private_safeEmphasize = private_safeEmphasize;
  colorManipulator.private_safeLighten = private_safeLighten;
  colorManipulator.recomposeColor = recomposeColor$1;
  colorManipulator.rgbToHex = rgbToHex;
  var _formatMuiErrorMessage2 = _interopRequireDefault$2(require$$1$1);
  var _clamp = _interopRequireDefault$2(require$$2);
  function clampWrapper$1(value, min2 = 0, max2 = 1) {
    return (0, _clamp.default)(value, min2, max2);
  }
  function hexToRgb$2(color2) {
    color2 = color2.slice(1);
    const re = new RegExp(`.{1,${color2.length >= 6 ? 2 : 1}}`, "g");
    let colors = color2.match(re);
    if (colors && colors[0].length === 1) {
      colors = colors.map((n2) => n2 + n2);
    }
    return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n2, index) => {
    return index < 3 ? parseInt(n2, 16) : Math.round(parseInt(n2, 16) / 255 * 1e3) / 1e3;
  }).join(", ")})` : "";
  }
  function intToHex(int) {
    const hex = int.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }
  function decomposeColor$1(color2) {
    if (color2.type) {
      return color2;
    }
    if (color2.charAt(0) === "#") {
      return decomposeColor$1(hexToRgb$2(color2));
    }
    const marker = color2.indexOf("(");
    const type = color2.substring(0, marker);
    if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
      throw new Error((0, _formatMuiErrorMessage2.default)(9, color2));
    }
    let values2 = color2.substring(marker + 1, color2.length - 1);
    let colorSpace;
    if (type === "color") {
      values2 = values2.split(" ");
      colorSpace = values2.shift();
      if (values2.length === 4 && values2[3].charAt(0) === "/") {
        values2[3] = values2[3].slice(1);
      }
      if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(colorSpace) === -1) {
        throw new Error((0, _formatMuiErrorMessage2.default)(10, colorSpace));
      }
    } else {
      values2 = values2.split(",");
    }
    values2 = values2.map((value) => parseFloat(value));
    return {
      type,
      values: values2,
      colorSpace
    };
  }
  const colorChannel = (color2) => {
    const decomposedColor = decomposeColor$1(color2);
    return decomposedColor.values.slice(0, 3).map((val, idx) => decomposedColor.type.indexOf("hsl") !== -1 && idx !== 0 ? `${val}%` : val).join(" ");
  };
  colorManipulator.colorChannel = colorChannel;
  const private_safeColorChannel = (color2, warning) => {
    try {
      return colorChannel(color2);
    } catch (error) {
      if (warning && false) {
        console.warn(warning);
      }
      return color2;
    }
  };
  colorManipulator.private_safeColorChannel = private_safeColorChannel;
  function recomposeColor$1(color2) {
    const {
      type,
      colorSpace
    } = color2;
    let {
      values: values2
    } = color2;
    if (type.indexOf("rgb") !== -1) {
      values2 = values2.map((n2, i) => i < 3 ? parseInt(n2, 10) : n2);
    } else if (type.indexOf("hsl") !== -1) {
      values2[1] = `${values2[1]}%`;
      values2[2] = `${values2[2]}%`;
    }
    if (type.indexOf("color") !== -1) {
      values2 = `${colorSpace} ${values2.join(" ")}`;
    } else {
      values2 = `${values2.join(", ")}`;
    }
    return `${type}(${values2})`;
  }
  function rgbToHex(color2) {
    if (color2.indexOf("#") === 0) {
      return color2;
    }
    const {
      values: values2
    } = decomposeColor$1(color2);
    return `#${values2.map((n2, i) => intToHex(i === 3 ? Math.round(255 * n2) : n2)).join("")}`;
  }
  function hslToRgb(color2) {
    color2 = decomposeColor$1(color2);
    const {
      values: values2
    } = color2;
    const h2 = values2[0];
    const s = values2[1] / 100;
    const l2 = values2[2] / 100;
    const a = s * Math.min(l2, 1 - l2);
    const f2 = (n2, k2 = (n2 + h2 / 30) % 12) => l2 - a * Math.max(Math.min(k2 - 3, 9 - k2, 1), -1);
    let type = "rgb";
    const rgb = [Math.round(f2(0) * 255), Math.round(f2(8) * 255), Math.round(f2(4) * 255)];
    if (color2.type === "hsla") {
      type += "a";
      rgb.push(values2[3]);
    }
    return recomposeColor$1({
      type,
      values: rgb
    });
  }
  function getLuminance(color2) {
    color2 = decomposeColor$1(color2);
    let rgb = color2.type === "hsl" || color2.type === "hsla" ? decomposeColor$1(hslToRgb(color2)).values : color2.values;
    rgb = rgb.map((val) => {
      if (color2.type !== "color") {
        val /= 255;
      }
      return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
    });
    return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
  }
  function getContrastRatio(foreground, background) {
    const lumA = getLuminance(foreground);
    const lumB = getLuminance(background);
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
  }
  function alpha$1(color2, value) {
    color2 = decomposeColor$1(color2);
    value = clampWrapper$1(value);
    if (color2.type === "rgb" || color2.type === "hsl") {
      color2.type += "a";
    }
    if (color2.type === "color") {
      color2.values[3] = `/${value}`;
    } else {
      color2.values[3] = value;
    }
    return recomposeColor$1(color2);
  }
  function private_safeAlpha(color2, value, warning) {
    try {
      return alpha$1(color2, value);
    } catch (error) {
      if (warning && false) {
        console.warn(warning);
      }
      return color2;
    }
  }
  function darken(color2, coefficient) {
    color2 = decomposeColor$1(color2);
    coefficient = clampWrapper$1(coefficient);
    if (color2.type.indexOf("hsl") !== -1) {
      color2.values[2] *= 1 - coefficient;
    } else if (color2.type.indexOf("rgb") !== -1 || color2.type.indexOf("color") !== -1) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] *= 1 - coefficient;
      }
    }
    return recomposeColor$1(color2);
  }
  function private_safeDarken(color2, coefficient, warning) {
    try {
      return darken(color2, coefficient);
    } catch (error) {
      if (warning && false) {
        console.warn(warning);
      }
      return color2;
    }
  }
  function lighten(color2, coefficient) {
    color2 = decomposeColor$1(color2);
    coefficient = clampWrapper$1(coefficient);
    if (color2.type.indexOf("hsl") !== -1) {
      color2.values[2] += (100 - color2.values[2]) * coefficient;
    } else if (color2.type.indexOf("rgb") !== -1) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] += (255 - color2.values[i]) * coefficient;
      }
    } else if (color2.type.indexOf("color") !== -1) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] += (1 - color2.values[i]) * coefficient;
      }
    }
    return recomposeColor$1(color2);
  }
  function private_safeLighten(color2, coefficient, warning) {
    try {
      return lighten(color2, coefficient);
    } catch (error) {
      if (warning && false) {
        console.warn(warning);
      }
      return color2;
    }
  }
  function emphasize(color2, coefficient = 0.15) {
    return getLuminance(color2) > 0.5 ? darken(color2, coefficient) : lighten(color2, coefficient);
  }
  function private_safeEmphasize(color2, coefficient, warning) {
    try {
      return private_safeEmphasize(color2, coefficient);
    } catch (error) {
      if (warning && false) {
        console.warn(warning);
      }
      return color2;
    }
  }
  function blend(background, overlay, opacity, gamma = 1) {
    const blendChannel = (b2, o) => Math.round((b2 ** (1 / gamma) * (1 - opacity) + o ** (1 / gamma) * opacity) ** gamma);
    const backgroundColor2 = decomposeColor$1(background);
    const overlayColor = decomposeColor$1(overlay);
    const rgb = [blendChannel(backgroundColor2.values[0], overlayColor.values[0]), blendChannel(backgroundColor2.values[1], overlayColor.values[1]), blendChannel(backgroundColor2.values[2], overlayColor.values[2])];
    return recomposeColor$1({
      type: "rgb",
      values: rgb
    });
  }
  var createStyled$2 = {};
  var _extends = { exports: {} };
  var hasRequired_extends;
  function require_extends() {
    if (hasRequired_extends)
      return _extends.exports;
    hasRequired_extends = 1;
    (function(module) {
      function _extends3() {
        module.exports = _extends3 = Object.assign ? Object.assign.bind() : function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        }, module.exports.__esModule = true, module.exports["default"] = module.exports;
        return _extends3.apply(this, arguments);
      }
      module.exports = _extends3, module.exports.__esModule = true, module.exports["default"] = module.exports;
    })(_extends);
    return _extends.exports;
  }
  var objectWithoutPropertiesLoose = { exports: {} };
  var hasRequiredObjectWithoutPropertiesLoose;
  function requireObjectWithoutPropertiesLoose() {
    if (hasRequiredObjectWithoutPropertiesLoose)
      return objectWithoutPropertiesLoose.exports;
    hasRequiredObjectWithoutPropertiesLoose = 1;
    (function(module) {
      function _objectWithoutPropertiesLoose3(source, excluded) {
        if (source == null)
          return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0)
            continue;
          target[key] = source[key];
        }
        return target;
      }
      module.exports = _objectWithoutPropertiesLoose3, module.exports.__esModule = true, module.exports["default"] = module.exports;
    })(objectWithoutPropertiesLoose);
    return objectWithoutPropertiesLoose.exports;
  }
  function memoize$3(fn2) {
    var cache2 = /* @__PURE__ */ Object.create(null);
    return function(arg) {
      if (cache2[arg] === void 0)
        cache2[arg] = fn2(arg);
      return cache2[arg];
    };
  }
  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
  var isPropValid = /* @__PURE__ */ memoize$3(
    function(prop) {
      return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
    }
    /* Z+1 */
  );
  function sheetForTag(tag) {
    if (tag.sheet) {
      return tag.sheet;
    }
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        return document.styleSheets[i];
      }
    }
  }
  function createStyleElement(options) {
    var tag = document.createElement("style");
    tag.setAttribute("data-emotion", options.key);
    if (options.nonce !== void 0) {
      tag.setAttribute("nonce", options.nonce);
    }
    tag.appendChild(document.createTextNode(""));
    tag.setAttribute("data-s", "");
    return tag;
  }
  var StyleSheet = /* @__PURE__ */ function() {
    function StyleSheet2(options) {
      var _this = this;
      this._insertTag = function(tag) {
        var before;
        if (_this.tags.length === 0) {
          if (_this.insertionPoint) {
            before = _this.insertionPoint.nextSibling;
          } else if (_this.prepend) {
            before = _this.container.firstChild;
          } else {
            before = _this.before;
          }
        } else {
          before = _this.tags[_this.tags.length - 1].nextSibling;
        }
        _this.container.insertBefore(tag, before);
        _this.tags.push(tag);
      };
      this.isSpeedy = options.speedy === void 0 ? true : options.speedy;
      this.tags = [];
      this.ctr = 0;
      this.nonce = options.nonce;
      this.key = options.key;
      this.container = options.container;
      this.prepend = options.prepend;
      this.insertionPoint = options.insertionPoint;
      this.before = null;
    }
    var _proto = StyleSheet2.prototype;
    _proto.hydrate = function hydrate(nodes) {
      nodes.forEach(this._insertTag);
    };
    _proto.insert = function insert(rule) {
      if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
        this._insertTag(createStyleElement(this));
      }
      var tag = this.tags[this.tags.length - 1];
      if (this.isSpeedy) {
        var sheet = sheetForTag(tag);
        try {
          sheet.insertRule(rule, sheet.cssRules.length);
        } catch (e2) {
        }
      } else {
        tag.appendChild(document.createTextNode(rule));
      }
      this.ctr++;
    };
    _proto.flush = function flush() {
      this.tags.forEach(function(tag) {
        return tag.parentNode && tag.parentNode.removeChild(tag);
      });
      this.tags = [];
      this.ctr = 0;
    };
    return StyleSheet2;
  }();
  var MS = "-ms-";
  var MOZ = "-moz-";
  var WEBKIT = "-webkit-";
  var COMMENT = "comm";
  var RULESET = "rule";
  var DECLARATION = "decl";
  var IMPORT = "@import";
  var KEYFRAMES = "@keyframes";
  var LAYER = "@layer";
  var abs = Math.abs;
  var from = String.fromCharCode;
  var assign = Object.assign;
  function hash$2(value, length2) {
    return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
  }
  function trim(value) {
    return value.trim();
  }
  function match(value, pattern) {
    return (value = pattern.exec(value)) ? value[0] : value;
  }
  function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
  }
  function indexof(value, search) {
    return value.indexOf(search);
  }
  function charat(value, index) {
    return value.charCodeAt(index) | 0;
  }
  function substr(value, begin, end2) {
    return value.slice(begin, end2);
  }
  function strlen(value) {
    return value.length;
  }
  function sizeof(value) {
    return value.length;
  }
  function append(value, array) {
    return array.push(value), value;
  }
  function combine(array, callback) {
    return array.map(callback).join("");
  }
  var line = 1;
  var column = 1;
  var length = 0;
  var position = 0;
  var character = 0;
  var characters = "";
  function node(value, root2, parent, type, props, children, length2) {
    return { value, root: root2, parent, type, props, children, line, column, length: length2, return: "" };
  }
  function copy(root2, props) {
    return assign(node("", null, null, "", null, null, 0), root2, { length: -root2.length }, props);
  }
  function char() {
    return character;
  }
  function prev() {
    character = position > 0 ? charat(characters, --position) : 0;
    if (column--, character === 10)
      column = 1, line--;
    return character;
  }
  function next() {
    character = position < length ? charat(characters, position++) : 0;
    if (column++, character === 10)
      column = 1, line++;
    return character;
  }
  function peek() {
    return charat(characters, position);
  }
  function caret() {
    return position;
  }
  function slice(begin, end2) {
    return substr(characters, begin, end2);
  }
  function token(type) {
    switch (type) {
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      case 59:
      case 123:
      case 125:
        return 4;
      case 58:
        return 3;
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function alloc(value) {
    return line = column = 1, length = strlen(characters = value), position = 0, [];
  }
  function dealloc(value) {
    return characters = "", value;
  }
  function delimit(type) {
    return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
  }
  function whitespace(type) {
    while (character = peek())
      if (character < 33)
        next();
      else
        break;
    return token(type) > 2 || token(character) > 3 ? "" : " ";
  }
  function escaping(index, count) {
    while (--count && next())
      if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
        break;
    return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
  }
  function delimiter(type) {
    while (next())
      switch (character) {
        case type:
          return position;
        case 34:
        case 39:
          if (type !== 34 && type !== 39)
            delimiter(character);
          break;
        case 40:
          if (type === 41)
            delimiter(type);
          break;
        case 92:
          next();
          break;
      }
    return position;
  }
  function commenter(type, index) {
    while (next())
      if (type + character === 47 + 10)
        break;
      else if (type + character === 42 + 42 && peek() === 47)
        break;
    return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
  }
  function identifier(index) {
    while (!token(peek()))
      next();
    return slice(index, position);
  }
  function compile(value) {
    return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
  }
  function parse(value, root2, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index = 0;
    var offset2 = 0;
    var length2 = pseudo;
    var atrule = 0;
    var property2 = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character2 = 0;
    var type = "";
    var props = rules;
    var children = rulesets;
    var reference2 = rule;
    var characters2 = type;
    while (scanning)
      switch (previous = character2, character2 = next()) {
        case 40:
          if (previous != 108 && charat(characters2, length2 - 1) == 58) {
            if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
              ampersand = -1;
            break;
          }
        case 34:
        case 39:
        case 91:
          characters2 += delimit(character2);
          break;
        case 9:
        case 10:
        case 13:
        case 32:
          characters2 += whitespace(previous);
          break;
        case 92:
          characters2 += escaping(caret() - 1, 7);
          continue;
        case 47:
          switch (peek()) {
            case 42:
            case 47:
              append(comment(commenter(next(), caret()), root2, parent), declarations);
              break;
            default:
              characters2 += "/";
          }
          break;
        case 123 * variable:
          points[index++] = strlen(characters2) * ampersand;
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            case 0:
            case 125:
              scanning = 0;
            case 59 + offset2:
              if (ampersand == -1)
                characters2 = replace(characters2, /\f/g, "");
              if (property2 > 0 && strlen(characters2) - length2)
                append(property2 > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
              break;
            case 59:
              characters2 += ";";
            default:
              append(reference2 = ruleset(characters2, root2, parent, index, offset2, rules, points, type, props = [], children = [], length2), rulesets);
              if (character2 === 123)
                if (offset2 === 0)
                  parse(characters2, root2, reference2, reference2, props, rulesets, length2, points, children);
                else
                  switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                    case 100:
                    case 108:
                    case 109:
                    case 115:
                      parse(value, reference2, reference2, rule && append(ruleset(value, reference2, reference2, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                      break;
                    default:
                      parse(characters2, reference2, reference2, reference2, [""], children, 0, points, children);
                  }
          }
          index = offset2 = property2 = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
          break;
        case 58:
          length2 = 1 + strlen(characters2), property2 = previous;
        default:
          if (variable < 1) {
            if (character2 == 123)
              --variable;
            else if (character2 == 125 && variable++ == 0 && prev() == 125)
              continue;
          }
          switch (characters2 += from(character2), character2 * variable) {
            case 38:
              ampersand = offset2 > 0 ? 1 : (characters2 += "\f", -1);
              break;
            case 44:
              points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            case 64:
              if (peek() === 45)
                characters2 += delimit(next());
              atrule = peek(), offset2 = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root2, parent, index, offset2, rules, points, type, props, children, length2) {
    var post = offset2 - 1;
    var rule = offset2 === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i = 0, j = 0, k2 = 0; i < index; ++i)
      for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j = points[i])), z2 = value; x2 < size; ++x2)
        if (z2 = trim(j > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
          props[k2++] = z2;
    return node(value, root2, parent, offset2 === 0 ? RULESET : type, props, children, length2);
  }
  function comment(value, root2, parent) {
    return node(value, root2, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
  }
  function declaration(value, root2, parent, length2) {
    return node(value, root2, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
  }
  function serialize(children, callback) {
    var output = "";
    var length2 = sizeof(children);
    for (var i = 0; i < length2; i++)
      output += callback(children[i], i, children, callback) || "";
    return output;
  }
  function stringify(element, index, children, callback) {
    switch (element.type) {
      case LAYER:
        if (element.children.length)
          break;
      case IMPORT:
      case DECLARATION:
        return element.return = element.return || element.value;
      case COMMENT:
        return "";
      case KEYFRAMES:
        return element.return = element.value + "{" + serialize(element.children, callback) + "}";
      case RULESET:
        element.value = element.props.join(",");
    }
    return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
  }
  function middleware(collection) {
    var length2 = sizeof(collection);
    return function(element, index, children, callback) {
      var output = "";
      for (var i = 0; i < length2; i++)
        output += collection[i](element, index, children, callback) || "";
      return output;
    };
  }
  function rulesheet(callback) {
    return function(element) {
      if (!element.root) {
        if (element = element.return)
          callback(element);
      }
    };
  }
  var identifierWithPointTracking = function identifierWithPointTracking2(begin, points, index) {
    var previous = 0;
    var character2 = 0;
    while (true) {
      previous = character2;
      character2 = peek();
      if (previous === 38 && character2 === 12) {
        points[index] = 1;
      }
      if (token(character2)) {
        break;
      }
      next();
    }
    return slice(begin, position);
  };
  var toRules = function toRules2(parsed, points) {
    var index = -1;
    var character2 = 44;
    do {
      switch (token(character2)) {
        case 0:
          if (character2 === 38 && peek() === 12) {
            points[index] = 1;
          }
          parsed[index] += identifierWithPointTracking(position - 1, points, index);
          break;
        case 2:
          parsed[index] += delimit(character2);
          break;
        case 4:
          if (character2 === 44) {
            parsed[++index] = peek() === 58 ? "&\f" : "";
            points[index] = parsed[index].length;
            break;
          }
        default:
          parsed[index] += from(character2);
      }
    } while (character2 = next());
    return parsed;
  };
  var getRules = function getRules2(value, points) {
    return dealloc(toRules(alloc(value), points));
  };
  var fixedElements = /* @__PURE__ */ new WeakMap();
  var compat = function compat2(element) {
    if (element.type !== "rule" || !element.parent || // positive .length indicates that this rule contains pseudo
    // negative .length indicates that this rule has been already prefixed
    element.length < 1) {
      return;
    }
    var value = element.value, parent = element.parent;
    var isImplicitRule = element.column === parent.column && element.line === parent.line;
    while (parent.type !== "rule") {
      parent = parent.parent;
      if (!parent)
        return;
    }
    if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) {
      return;
    }
    if (isImplicitRule) {
      return;
    }
    fixedElements.set(element, true);
    var points = [];
    var rules = getRules(value, points);
    var parentRules = parent.props;
    for (var i = 0, k2 = 0; i < rules.length; i++) {
      for (var j = 0; j < parentRules.length; j++, k2++) {
        element.props[k2] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
      }
    }
  };
  var removeLabel = function removeLabel2(element) {
    if (element.type === "decl") {
      var value = element.value;
      if (
        // charcode for l
        value.charCodeAt(0) === 108 && // charcode for b
        value.charCodeAt(2) === 98
      ) {
        element["return"] = "";
        element.value = "";
      }
    }
  };
  function prefix(value, length2) {
    switch (hash$2(value, length2)) {
      case 5103:
        return WEBKIT + "print-" + value + value;
      case 5737:
      case 4201:
      case 3177:
      case 3433:
      case 1641:
      case 4457:
      case 2921:
      case 5572:
      case 6356:
      case 5844:
      case 3191:
      case 6645:
      case 3005:
      case 6391:
      case 5879:
      case 5623:
      case 6135:
      case 4599:
      case 4855:
      case 4215:
      case 6389:
      case 5109:
      case 5365:
      case 5621:
      case 3829:
        return WEBKIT + value + value;
      case 5349:
      case 4246:
      case 4810:
      case 6968:
      case 2756:
        return WEBKIT + value + MOZ + value + MS + value + value;
      case 6828:
      case 4268:
        return WEBKIT + value + MS + value + value;
      case 6165:
        return WEBKIT + value + MS + "flex-" + value + value;
      case 5187:
        return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
      case 5443:
        return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
      case 4675:
        return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
      case 5548:
        return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
      case 5292:
        return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
      case 6060:
        return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
      case 4554:
        return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
      case 6187:
        return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
      case 5495:
      case 3959:
        return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
      case 4968:
        return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
      case 4095:
      case 3583:
      case 4068:
      case 2532:
        return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
      case 8116:
      case 7059:
      case 5753:
      case 5535:
      case 5445:
      case 5701:
      case 4933:
      case 4677:
      case 5533:
      case 5789:
      case 5021:
      case 4765:
        if (strlen(value) - 1 - length2 > 6)
          switch (charat(value, length2 + 1)) {
            case 109:
              if (charat(value, length2 + 4) !== 45)
                break;
            case 102:
              return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
            case 115:
              return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
          }
        break;
      case 4949:
        if (charat(value, length2 + 1) !== 115)
          break;
      case 6444:
        switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
          case 107:
            return replace(value, ":", ":" + WEBKIT) + value;
          case 101:
            return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        }
        break;
      case 5936:
        switch (charat(value, length2 + 11)) {
          case 114:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
          case 108:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
          case 45:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
        }
        return WEBKIT + value + MS + value + value;
    }
    return value;
  }
  var prefixer = function prefixer2(element, index, children, callback) {
    if (element.length > -1) {
      if (!element["return"])
        switch (element.type) {
          case DECLARATION:
            element["return"] = prefix(element.value, element.length);
            break;
          case KEYFRAMES:
            return serialize([copy(element, {
              value: replace(element.value, "@", "@" + WEBKIT)
            })], callback);
          case RULESET:
            if (element.length)
              return combine(element.props, function(value) {
                switch (match(value, /(::plac\w+|:read-\w+)/)) {
                  case ":read-only":
                  case ":read-write":
                    return serialize([copy(element, {
                      props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")]
                    })], callback);
                  case "::placeholder":
                    return serialize([copy(element, {
                      props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")]
                    }), copy(element, {
                      props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")]
                    }), copy(element, {
                      props: [replace(value, /:(plac\w+)/, MS + "input-$1")]
                    })], callback);
                }
                return "";
              });
        }
    }
  };
  var defaultStylisPlugins = [prefixer];
  var createCache = function createCache2(options) {
    var key = options.key;
    if (key === "css") {
      var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
      Array.prototype.forEach.call(ssrStyles, function(node2) {
        var dataEmotionAttribute = node2.getAttribute("data-emotion");
        if (dataEmotionAttribute.indexOf(" ") === -1) {
          return;
        }
        document.head.appendChild(node2);
        node2.setAttribute("data-s", "");
      });
    }
    var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
    var inserted = {};
    var container;
    var nodesToHydrate = [];
    {
      container = options.container || document.head;
      Array.prototype.forEach.call(
        // this means we will ignore elements which don't have a space in them which
        // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
        document.querySelectorAll('style[data-emotion^="' + key + ' "]'),
        function(node2) {
          var attrib = node2.getAttribute("data-emotion").split(" ");
          for (var i = 1; i < attrib.length; i++) {
            inserted[attrib[i]] = true;
          }
          nodesToHydrate.push(node2);
        }
      );
    }
    var _insert;
    var omnipresentPlugins = [compat, removeLabel];
    {
      var currentSheet;
      var finalizingPlugins = [stringify, rulesheet(function(rule) {
        currentSheet.insert(rule);
      })];
      var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
      var stylis = function stylis2(styles2) {
        return serialize(compile(styles2), serializer);
      };
      _insert = function insert(selector, serialized, sheet, shouldCache) {
        currentSheet = sheet;
        stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
        if (shouldCache) {
          cache2.inserted[serialized.name] = true;
        }
      };
    }
    var cache2 = {
      key,
      sheet: new StyleSheet({
        key,
        container,
        nonce: options.nonce,
        speedy: options.speedy,
        prepend: options.prepend,
        insertionPoint: options.insertionPoint
      }),
      nonce: options.nonce,
      inserted,
      registered: {},
      insert: _insert
    };
    cache2.sheet.hydrate(nodesToHydrate);
    return cache2;
  };
  var reactIs$2 = { exports: {} };
  var reactIs_production_min$1 = {};
  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b$1 = "function" === typeof Symbol && Symbol.for, c$1 = b$1 ? Symbol.for("react.element") : 60103, d$1 = b$1 ? Symbol.for("react.portal") : 60106, e$1 = b$1 ? Symbol.for("react.fragment") : 60107, f$1 = b$1 ? Symbol.for("react.strict_mode") : 60108, g$1 = b$1 ? Symbol.for("react.profiler") : 60114, h$1 = b$1 ? Symbol.for("react.provider") : 60109, k$1 = b$1 ? Symbol.for("react.context") : 60110, l$1 = b$1 ? Symbol.for("react.async_mode") : 60111, m$1 = b$1 ? Symbol.for("react.concurrent_mode") : 60111, n$1 = b$1 ? Symbol.for("react.forward_ref") : 60112, p$1 = b$1 ? Symbol.for("react.suspense") : 60113, q$1 = b$1 ? Symbol.for("react.suspense_list") : 60120, r = b$1 ? Symbol.for("react.memo") : 60115, t$1 = b$1 ? Symbol.for("react.lazy") : 60116, v$1 = b$1 ? Symbol.for("react.block") : 60121, w = b$1 ? Symbol.for("react.fundamental") : 60117, x = b$1 ? Symbol.for("react.responder") : 60118, y = b$1 ? Symbol.for("react.scope") : 60119;
  function z(a) {
    if ("object" === typeof a && null !== a) {
      var u2 = a.$$typeof;
      switch (u2) {
        case c$1:
          switch (a = a.type, a) {
            case l$1:
            case m$1:
            case e$1:
            case g$1:
            case f$1:
            case p$1:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k$1:
                case n$1:
                case t$1:
                case r:
                case h$1:
                  return a;
                default:
                  return u2;
              }
          }
        case d$1:
          return u2;
      }
    }
  }
  function A(a) {
    return z(a) === m$1;
  }
  reactIs_production_min$1.AsyncMode = l$1;
  reactIs_production_min$1.ConcurrentMode = m$1;
  reactIs_production_min$1.ContextConsumer = k$1;
  reactIs_production_min$1.ContextProvider = h$1;
  reactIs_production_min$1.Element = c$1;
  reactIs_production_min$1.ForwardRef = n$1;
  reactIs_production_min$1.Fragment = e$1;
  reactIs_production_min$1.Lazy = t$1;
  reactIs_production_min$1.Memo = r;
  reactIs_production_min$1.Portal = d$1;
  reactIs_production_min$1.Profiler = g$1;
  reactIs_production_min$1.StrictMode = f$1;
  reactIs_production_min$1.Suspense = p$1;
  reactIs_production_min$1.isAsyncMode = function(a) {
    return A(a) || z(a) === l$1;
  };
  reactIs_production_min$1.isConcurrentMode = A;
  reactIs_production_min$1.isContextConsumer = function(a) {
    return z(a) === k$1;
  };
  reactIs_production_min$1.isContextProvider = function(a) {
    return z(a) === h$1;
  };
  reactIs_production_min$1.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === c$1;
  };
  reactIs_production_min$1.isForwardRef = function(a) {
    return z(a) === n$1;
  };
  reactIs_production_min$1.isFragment = function(a) {
    return z(a) === e$1;
  };
  reactIs_production_min$1.isLazy = function(a) {
    return z(a) === t$1;
  };
  reactIs_production_min$1.isMemo = function(a) {
    return z(a) === r;
  };
  reactIs_production_min$1.isPortal = function(a) {
    return z(a) === d$1;
  };
  reactIs_production_min$1.isProfiler = function(a) {
    return z(a) === g$1;
  };
  reactIs_production_min$1.isStrictMode = function(a) {
    return z(a) === f$1;
  };
  reactIs_production_min$1.isSuspense = function(a) {
    return z(a) === p$1;
  };
  reactIs_production_min$1.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === e$1 || a === m$1 || a === g$1 || a === f$1 || a === p$1 || a === q$1 || "object" === typeof a && null !== a && (a.$$typeof === t$1 || a.$$typeof === r || a.$$typeof === h$1 || a.$$typeof === k$1 || a.$$typeof === n$1 || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v$1);
  };
  reactIs_production_min$1.typeOf = z;
  {
    reactIs$2.exports = reactIs_production_min$1;
  }
  var reactIsExports$1 = reactIs$2.exports;
  var reactIs$1 = reactIsExports$1;
  var FORWARD_REF_STATICS = {
    "$$typeof": true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    "$$typeof": true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs$1.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs$1.Memo] = MEMO_STATICS;
  var isBrowser = true;
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = "";
    classNames.split(" ").forEach(function(className) {
      if (registered[className] !== void 0) {
        registeredStyles.push(registered[className] + ";");
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var registerStyles = function registerStyles2(cache2, serialized, isStringTag2) {
    var className = cache2.key + "-" + serialized.name;
    if (
      // we only need to add the styles to the registered cache if the
      // class name could be used further down
      // the tree but if it's a string tag, we know it won't
      // so we don't have to add it to registered cache.
      // this improves memory usage since we can avoid storing the whole style string
      (isStringTag2 === false || // we need to always store it if we're in compat mode and
      // in node since emotion-server relies on whether a style is in
      // the registered cache to know whether a style is global or not
      // also, note that this check will be dead code eliminated in the browser
      isBrowser === false) && cache2.registered[className] === void 0
    ) {
      cache2.registered[className] = serialized.styles;
    }
  };
  var insertStyles = function insertStyles2(cache2, serialized, isStringTag2) {
    registerStyles(cache2, serialized, isStringTag2);
    var className = cache2.key + "-" + serialized.name;
    if (cache2.inserted[serialized.name] === void 0) {
      var current = serialized;
      do {
        cache2.insert(serialized === current ? "." + className : "", current, cache2.sheet, true);
        current = current.next;
      } while (current !== void 0);
    }
  };
  function murmur2(str) {
    var h2 = 0;
    var k2, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
      k2 = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
      k2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16);
      k2 ^= /* k >>> r: */
      k2 >>> 24;
      h2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
      (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h2 ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h2 ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h2 ^= str.charCodeAt(i) & 255;
        h2 = /* Math.imul(h, m): */
        (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    h2 ^= h2 >>> 13;
    h2 = /* Math.imul(h, m): */
    (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
  }
  var unitlessKeys = {
    animationIterationCount: 1,
    aspectRatio: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };
  var hyphenateRegex = /[A-Z]|^ms/g;
  var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
  var isCustomProperty = function isCustomProperty2(property2) {
    return property2.charCodeAt(1) === 45;
  };
  var isProcessableValue = function isProcessableValue2(value) {
    return value != null && typeof value !== "boolean";
  };
  var processStyleName = /* @__PURE__ */ memoize$3(function(styleName) {
    return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
  });
  var processStyleValue = function processStyleValue2(key, value) {
    switch (key) {
      case "animation":
      case "animationName": {
        if (typeof value === "string") {
          return value.replace(animationRegex, function(match2, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
    }
    if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === "number" && value !== 0) {
      return value + "px";
    }
    return value;
  };
  var noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
  function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
      return "";
    }
    if (interpolation.__emotion_styles !== void 0) {
      return interpolation;
    }
    switch (typeof interpolation) {
      case "boolean": {
        return "";
      }
      case "object": {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }
        if (interpolation.styles !== void 0) {
          var next2 = interpolation.next;
          if (next2 !== void 0) {
            while (next2 !== void 0) {
              cursor = {
                name: next2.name,
                styles: next2.styles,
                next: cursor
              };
              next2 = next2.next;
            }
          }
          var styles2 = interpolation.styles + ";";
          return styles2;
        }
        return createStringFromObject(mergedProps, registered, interpolation);
      }
      case "function": {
        if (mergedProps !== void 0) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        }
        break;
      }
    }
    if (registered == null) {
      return interpolation;
    }
    var cached = registered[interpolation];
    return cached !== void 0 ? cached : interpolation;
  }
  function createStringFromObject(mergedProps, registered, obj) {
    var string = "";
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
      }
    } else {
      for (var _key in obj) {
        var value = obj[_key];
        if (typeof value !== "object") {
          if (registered != null && registered[value] !== void 0) {
            string += _key + "{" + registered[value] + "}";
          } else if (isProcessableValue(value)) {
            string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
          }
        } else {
          if (_key === "NO_COMPONENT_SELECTOR" && false) {
            throw new Error(noComponentSelectorMessage);
          }
          if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue(value[_i])) {
                string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value);
            switch (_key) {
              case "animation":
              case "animationName": {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }
              default: {
                string += _key + "{" + interpolated + "}";
              }
            }
          }
        }
      }
    }
    return string;
  }
  var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
  var cursor;
  var serializeStyles = function serializeStyles2(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
      return args[0];
    }
    var stringMode = true;
    var styles2 = "";
    cursor = void 0;
    var strings = args[0];
    if (strings == null || strings.raw === void 0) {
      stringMode = false;
      styles2 += handleInterpolation(mergedProps, registered, strings);
    } else {
      styles2 += strings[0];
    }
    for (var i = 1; i < args.length; i++) {
      styles2 += handleInterpolation(mergedProps, registered, args[i]);
      if (stringMode) {
        styles2 += strings[i];
      }
    }
    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern.exec(styles2)) !== null) {
      identifierName += "-" + // $FlowFixMe we know it's not null
      match2[1];
    }
    var name = murmur2(styles2) + identifierName;
    return {
      name,
      styles: styles2,
      next: cursor
    };
  };
  var syncFallback = function syncFallback2(create) {
    return create();
  };
  var useInsertionEffect = React$1__namespace["useInsertionEffect"] ? React$1__namespace["useInsertionEffect"] : false;
  var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
  var useInsertionEffectWithLayoutFallback = useInsertionEffect || React$1__namespace.useLayoutEffect;
  var EmotionCacheContext = /* @__PURE__ */ React$1__namespace.createContext(
    // we're doing this to avoid preconstruct's dead code elimination in this one case
    // because this module is primarily intended for the browser and node
    // but it's also required in react native and similar environments sometimes
    // and we could have a special build just for that
    // but this is much easier and the native packages
    // might use a different theme context in the future anyway
    typeof HTMLElement !== "undefined" ? /* @__PURE__ */ createCache({
      key: "css"
    }) : null
  );
  var CacheProvider = EmotionCacheContext.Provider;
  var withEmotionCache = function withEmotionCache2(func) {
    return /* @__PURE__ */ React$1.forwardRef(function(props, ref) {
      var cache2 = React$1.useContext(EmotionCacheContext);
      return func(props, cache2, ref);
    });
  };
  var ThemeContext$2 = /* @__PURE__ */ React$1__namespace.createContext({});
  var Global = /* @__PURE__ */ withEmotionCache(function(props, cache2) {
    var styles2 = props.styles;
    var serialized = serializeStyles([styles2], void 0, React$1__namespace.useContext(ThemeContext$2));
    var sheetRef = React$1__namespace.useRef();
    useInsertionEffectWithLayoutFallback(function() {
      var key = cache2.key + "-global";
      var sheet = new cache2.sheet.constructor({
        key,
        nonce: cache2.sheet.nonce,
        container: cache2.sheet.container,
        speedy: cache2.sheet.isSpeedy
      });
      var rehydrating = false;
      var node2 = document.querySelector('style[data-emotion="' + key + " " + serialized.name + '"]');
      if (cache2.sheet.tags.length) {
        sheet.before = cache2.sheet.tags[0];
      }
      if (node2 !== null) {
        rehydrating = true;
        node2.setAttribute("data-emotion", key);
        sheet.hydrate([node2]);
      }
      sheetRef.current = [sheet, rehydrating];
      return function() {
        sheet.flush();
      };
    }, [cache2]);
    useInsertionEffectWithLayoutFallback(function() {
      var sheetRefCurrent = sheetRef.current;
      var sheet = sheetRefCurrent[0], rehydrating = sheetRefCurrent[1];
      if (rehydrating) {
        sheetRefCurrent[1] = false;
        return;
      }
      if (serialized.next !== void 0) {
        insertStyles(cache2, serialized.next, true);
      }
      if (sheet.tags.length) {
        var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
        sheet.before = element;
        sheet.flush();
      }
      cache2.insert("", serialized, sheet, false);
    }, [cache2, serialized.name]);
    return null;
  });
  function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return serializeStyles(args);
  }
  var keyframes = function keyframes2() {
    var insertable = css.apply(void 0, arguments);
    var name = "animation-" + insertable.name;
    return {
      name,
      styles: "@keyframes " + name + "{" + insertable.styles + "}",
      anim: 1,
      toString: function toString2() {
        return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
      }
    };
  };
  var testOmitPropsOnStringTag = isPropValid;
  var testOmitPropsOnComponent = function testOmitPropsOnComponent2(key) {
    return key !== "theme";
  };
  var getDefaultShouldForwardProp = function getDefaultShouldForwardProp2(tag) {
    return typeof tag === "string" && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
  };
  var composeShouldForwardProps = function composeShouldForwardProps2(tag, options, isReal) {
    var shouldForwardProp2;
    if (options) {
      var optionsShouldForwardProp = options.shouldForwardProp;
      shouldForwardProp2 = tag.__emotion_forwardProp && optionsShouldForwardProp ? function(propName) {
        return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
      } : optionsShouldForwardProp;
    }
    if (typeof shouldForwardProp2 !== "function" && isReal) {
      shouldForwardProp2 = tag.__emotion_forwardProp;
    }
    return shouldForwardProp2;
  };
  var Insertion = function Insertion2(_ref) {
    var cache2 = _ref.cache, serialized = _ref.serialized, isStringTag2 = _ref.isStringTag;
    registerStyles(cache2, serialized, isStringTag2);
    useInsertionEffectAlwaysWithSyncFallback(function() {
      return insertStyles(cache2, serialized, isStringTag2);
    });
    return null;
  };
  var createStyled$1 = function createStyled2(tag, options) {
    var isReal = tag.__emotion_real === tag;
    var baseTag = isReal && tag.__emotion_base || tag;
    var identifierName;
    var targetClassName;
    if (options !== void 0) {
      identifierName = options.label;
      targetClassName = options.target;
    }
    var shouldForwardProp2 = composeShouldForwardProps(tag, options, isReal);
    var defaultShouldForwardProp = shouldForwardProp2 || getDefaultShouldForwardProp(baseTag);
    var shouldUseAs = !defaultShouldForwardProp("as");
    return function() {
      var args = arguments;
      var styles2 = isReal && tag.__emotion_styles !== void 0 ? tag.__emotion_styles.slice(0) : [];
      if (identifierName !== void 0) {
        styles2.push("label:" + identifierName + ";");
      }
      if (args[0] == null || args[0].raw === void 0) {
        styles2.push.apply(styles2, args);
      } else {
        styles2.push(args[0][0]);
        var len = args.length;
        var i = 1;
        for (; i < len; i++) {
          styles2.push(args[i], args[0][i]);
        }
      }
      var Styled = withEmotionCache(function(props, cache2, ref) {
        var FinalTag = shouldUseAs && props.as || baseTag;
        var className = "";
        var classInterpolations = [];
        var mergedProps = props;
        if (props.theme == null) {
          mergedProps = {};
          for (var key in props) {
            mergedProps[key] = props[key];
          }
          mergedProps.theme = React$1__namespace.useContext(ThemeContext$2);
        }
        if (typeof props.className === "string") {
          className = getRegisteredStyles(cache2.registered, classInterpolations, props.className);
        } else if (props.className != null) {
          className = props.className + " ";
        }
        var serialized = serializeStyles(styles2.concat(classInterpolations), cache2.registered, mergedProps);
        className += cache2.key + "-" + serialized.name;
        if (targetClassName !== void 0) {
          className += " " + targetClassName;
        }
        var finalShouldForwardProp = shouldUseAs && shouldForwardProp2 === void 0 ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
        var newProps = {};
        for (var _key in props) {
          if (shouldUseAs && _key === "as")
            continue;
          if (
            // $FlowFixMe
            finalShouldForwardProp(_key)
          ) {
            newProps[_key] = props[_key];
          }
        }
        newProps.className = className;
        newProps.ref = ref;
        return /* @__PURE__ */ React$1__namespace.createElement(React$1__namespace.Fragment, null, /* @__PURE__ */ React$1__namespace.createElement(Insertion, {
          cache: cache2,
          serialized,
          isStringTag: typeof FinalTag === "string"
        }), /* @__PURE__ */ React$1__namespace.createElement(FinalTag, newProps));
      });
      Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
      Styled.defaultProps = tag.defaultProps;
      Styled.__emotion_real = Styled;
      Styled.__emotion_base = baseTag;
      Styled.__emotion_styles = styles2;
      Styled.__emotion_forwardProp = shouldForwardProp2;
      Object.defineProperty(Styled, "toString", {
        value: function value() {
          if (targetClassName === void 0 && false) {
            return "NO_COMPONENT_SELECTOR";
          }
          return "." + targetClassName;
        }
      });
      Styled.withComponent = function(nextTag, nextOptions) {
        return createStyled2(nextTag, _extends$1({}, options, nextOptions, {
          shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
        })).apply(void 0, styles2);
      };
      return Styled;
    };
  };
  var tags = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    // SVG
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan"
  ];
  var newStyled = createStyled$1.bind();
  tags.forEach(function(tagName) {
    newStyled[tagName] = newStyled(tagName);
  });
  let cache;
  if (typeof document === "object") {
    cache = createCache({
      key: "css",
      prepend: true
    });
  }
  function StyledEngineProvider(props) {
    const {
      injectFirst,
      children
    } = props;
    return injectFirst && cache ? /* @__PURE__ */ jsxRuntimeExports.jsx(CacheProvider, {
      value: cache,
      children
    }) : children;
  }
  function isEmpty$3(obj) {
    return obj === void 0 || obj === null || Object.keys(obj).length === 0;
  }
  function GlobalStyles$3(props) {
    const {
      styles: styles2,
      defaultTheme: defaultTheme2 = {}
    } = props;
    const globalStyles = typeof styles2 === "function" ? (themeInput) => styles2(isEmpty$3(themeInput) ? defaultTheme2 : themeInput) : styles2;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Global, {
      styles: globalStyles
    });
  }
  function styled$1(tag, options) {
    const stylesFactory = newStyled(tag, options);
    return stylesFactory;
  }
  const internal_processStyles = (tag, processor) => {
    if (Array.isArray(tag.__emotion_styles)) {
      tag.__emotion_styles = processor(tag.__emotion_styles);
    }
  };
  const styledEngine = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    GlobalStyles: GlobalStyles$3,
    StyledEngineProvider,
    ThemeContext: ThemeContext$2,
    css,
    default: styled$1,
    internal_processStyles,
    keyframes
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$1 = /* @__PURE__ */ getAugmentedNamespace(styledEngine);
  function isPlainObject$2(item) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    const prototype = Object.getPrototypeOf(item);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
  }
  function deepClone(source) {
    if (!isPlainObject$2(source)) {
      return source;
    }
    const output = {};
    Object.keys(source).forEach((key) => {
      output[key] = deepClone(source[key]);
    });
    return output;
  }
  function deepmerge$1(target, source, options = {
    clone: true
  }) {
    const output = options.clone ? _extends$1({}, target) : target;
    if (isPlainObject$2(target) && isPlainObject$2(source)) {
      Object.keys(source).forEach((key) => {
        if (key === "__proto__") {
          return;
        }
        if (isPlainObject$2(source[key]) && key in target && isPlainObject$2(target[key])) {
          output[key] = deepmerge$1(target[key], source[key], options);
        } else if (options.clone) {
          output[key] = isPlainObject$2(source[key]) ? deepClone(source[key]) : source[key];
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  }
  const deepmerge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: deepmerge$1,
    isPlainObject: isPlainObject$2
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$4 = /* @__PURE__ */ getAugmentedNamespace(deepmerge);
  function capitalize$1(string) {
    if (typeof string !== "string") {
      throw new Error(formatMuiErrorMessage$1(7));
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const capitalize = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: capitalize$1
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$5 = /* @__PURE__ */ getAugmentedNamespace(capitalize);
  var reactIs = { exports: {} };
  var reactIs_production_min = {};
  /**
   * @license React
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b = Symbol.for("react.element"), c = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), e = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), h = Symbol.for("react.context"), k = Symbol.for("react.server_context"), l = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), n = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), q = Symbol.for("react.lazy"), t = Symbol.for("react.offscreen"), u;
  u = Symbol.for("react.module.reference");
  function v(a) {
    if ("object" === typeof a && null !== a) {
      var r2 = a.$$typeof;
      switch (r2) {
        case b:
          switch (a = a.type, a) {
            case d:
            case f:
            case e:
            case m:
            case n:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case h:
                case l:
                case q:
                case p:
                case g:
                  return a;
                default:
                  return r2;
              }
          }
        case c:
          return r2;
      }
    }
  }
  reactIs_production_min.ContextConsumer = h;
  reactIs_production_min.ContextProvider = g;
  reactIs_production_min.Element = b;
  reactIs_production_min.ForwardRef = l;
  reactIs_production_min.Fragment = d;
  reactIs_production_min.Lazy = q;
  reactIs_production_min.Memo = p;
  reactIs_production_min.Portal = c;
  reactIs_production_min.Profiler = f;
  reactIs_production_min.StrictMode = e;
  reactIs_production_min.Suspense = m;
  reactIs_production_min.SuspenseList = n;
  reactIs_production_min.isAsyncMode = function() {
    return false;
  };
  reactIs_production_min.isConcurrentMode = function() {
    return false;
  };
  reactIs_production_min.isContextConsumer = function(a) {
    return v(a) === h;
  };
  reactIs_production_min.isContextProvider = function(a) {
    return v(a) === g;
  };
  reactIs_production_min.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === b;
  };
  reactIs_production_min.isForwardRef = function(a) {
    return v(a) === l;
  };
  reactIs_production_min.isFragment = function(a) {
    return v(a) === d;
  };
  reactIs_production_min.isLazy = function(a) {
    return v(a) === q;
  };
  reactIs_production_min.isMemo = function(a) {
    return v(a) === p;
  };
  reactIs_production_min.isPortal = function(a) {
    return v(a) === c;
  };
  reactIs_production_min.isProfiler = function(a) {
    return v(a) === f;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return v(a) === e;
  };
  reactIs_production_min.isSuspense = function(a) {
    return v(a) === m;
  };
  reactIs_production_min.isSuspenseList = function(a) {
    return v(a) === n;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === d || a === f || a === e || a === m || a === n || a === t || "object" === typeof a && null !== a && (a.$$typeof === q || a.$$typeof === p || a.$$typeof === g || a.$$typeof === h || a.$$typeof === l || a.$$typeof === u || void 0 !== a.getModuleId) ? true : false;
  };
  reactIs_production_min.typeOf = v;
  {
    reactIs.exports = reactIs_production_min;
  }
  var reactIsExports = reactIs.exports;
  const fnNameMatchRegex = /^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;
  function getFunctionName(fn2) {
    const match2 = `${fn2}`.match(fnNameMatchRegex);
    const name = match2 && match2[1];
    return name || "";
  }
  function getFunctionComponentName(Component, fallback = "") {
    return Component.displayName || Component.name || getFunctionName(Component) || fallback;
  }
  function getWrappedName(outerType, innerType, wrapperName) {
    const functionName = getFunctionComponentName(innerType);
    return outerType.displayName || (functionName !== "" ? `${wrapperName}(${functionName})` : wrapperName);
  }
  function getDisplayName$1(Component) {
    if (Component == null) {
      return void 0;
    }
    if (typeof Component === "string") {
      return Component;
    }
    if (typeof Component === "function") {
      return getFunctionComponentName(Component, "Component");
    }
    if (typeof Component === "object") {
      switch (Component.$$typeof) {
        case reactIsExports.ForwardRef:
          return getWrappedName(Component, Component.render, "ForwardRef");
        case reactIsExports.Memo:
          return getWrappedName(Component, Component.type, "memo");
        default:
          return void 0;
      }
    }
    return void 0;
  }
  const getDisplayName = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: getDisplayName$1,
    getFunctionName
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$6 = /* @__PURE__ */ getAugmentedNamespace(getDisplayName);
  const _excluded$_ = ["values", "unit", "step"];
  const sortBreakpointsValues = (values2) => {
    const breakpointsAsArray = Object.keys(values2).map((key) => ({
      key,
      val: values2[key]
    })) || [];
    breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
    return breakpointsAsArray.reduce((acc, obj) => {
      return _extends$1({}, acc, {
        [obj.key]: obj.val
      });
    }, {});
  };
  function createBreakpoints(breakpoints2) {
    const {
      // The breakpoint **start** at this value.
      // For instance with the first breakpoint xs: [xs, sm).
      values: values2 = {
        xs: 0,
        // phone
        sm: 600,
        // tablet
        md: 900,
        // small laptop
        lg: 1200,
        // desktop
        xl: 1536
        // large screen
      },
      unit = "px",
      step = 5
    } = breakpoints2, other = _objectWithoutPropertiesLoose(breakpoints2, _excluded$_);
    const sortedValues = sortBreakpointsValues(values2);
    const keys2 = Object.keys(sortedValues);
    function up(key) {
      const value = typeof values2[key] === "number" ? values2[key] : key;
      return `@media (min-width:${value}${unit})`;
    }
    function down(key) {
      const value = typeof values2[key] === "number" ? values2[key] : key;
      return `@media (max-width:${value - step / 100}${unit})`;
    }
    function between(start2, end2) {
      const endIndex = keys2.indexOf(end2);
      return `@media (min-width:${typeof values2[start2] === "number" ? values2[start2] : start2}${unit}) and (max-width:${(endIndex !== -1 && typeof values2[keys2[endIndex]] === "number" ? values2[keys2[endIndex]] : end2) - step / 100}${unit})`;
    }
    function only(key) {
      if (keys2.indexOf(key) + 1 < keys2.length) {
        return between(key, keys2[keys2.indexOf(key) + 1]);
      }
      return up(key);
    }
    function not(key) {
      const keyIndex = keys2.indexOf(key);
      if (keyIndex === 0) {
        return up(keys2[1]);
      }
      if (keyIndex === keys2.length - 1) {
        return down(keys2[keyIndex]);
      }
      return between(key, keys2[keys2.indexOf(key) + 1]).replace("@media", "@media not all and");
    }
    return _extends$1({
      keys: keys2,
      values: sortedValues,
      up,
      down,
      between,
      only,
      not,
      unit
    }, other);
  }
  const shape = {
    borderRadius: 4
  };
  const shape$1 = shape;
  function merge$1(acc, item) {
    if (!item) {
      return acc;
    }
    return deepmerge$1(acc, item, {
      clone: false
      // No need to clone deep, it's way faster.
    });
  }
  const values$1 = {
    xs: 0,
    // phone
    sm: 600,
    // tablet
    md: 900,
    // small laptop
    lg: 1200,
    // desktop
    xl: 1536
    // large screen
  };
  const defaultBreakpoints = {
    // Sorted ASC by size. That's important.
    // It can't be configured as it's used statically for propTypes.
    keys: ["xs", "sm", "md", "lg", "xl"],
    up: (key) => `@media (min-width:${values$1[key]}px)`
  };
  function handleBreakpoints(props, propValue, styleFromPropValue) {
    const theme = props.theme || {};
    if (Array.isArray(propValue)) {
      const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
      return propValue.reduce((acc, item, index) => {
        acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
        return acc;
      }, {});
    }
    if (typeof propValue === "object") {
      const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
      return Object.keys(propValue).reduce((acc, breakpoint) => {
        if (Object.keys(themeBreakpoints.values || values$1).indexOf(breakpoint) !== -1) {
          const mediaKey = themeBreakpoints.up(breakpoint);
          acc[mediaKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
        } else {
          const cssKey = breakpoint;
          acc[cssKey] = propValue[cssKey];
        }
        return acc;
      }, {});
    }
    const output = styleFromPropValue(propValue);
    return output;
  }
  function createEmptyBreakpointObject(breakpointsInput = {}) {
    var _breakpointsInput$key;
    const breakpointsInOrder = (_breakpointsInput$key = breakpointsInput.keys) == null ? void 0 : _breakpointsInput$key.reduce((acc, key) => {
      const breakpointStyleKey = breakpointsInput.up(key);
      acc[breakpointStyleKey] = {};
      return acc;
    }, {});
    return breakpointsInOrder || {};
  }
  function removeUnusedBreakpoints(breakpointKeys, style2) {
    return breakpointKeys.reduce((acc, key) => {
      const breakpointOutput = acc[key];
      const isBreakpointUnused = !breakpointOutput || Object.keys(breakpointOutput).length === 0;
      if (isBreakpointUnused) {
        delete acc[key];
      }
      return acc;
    }, style2);
  }
  function computeBreakpointsBase(breakpointValues, themeBreakpoints) {
    if (typeof breakpointValues !== "object") {
      return {};
    }
    const base = {};
    const breakpointsKeys = Object.keys(themeBreakpoints);
    if (Array.isArray(breakpointValues)) {
      breakpointsKeys.forEach((breakpoint, i) => {
        if (i < breakpointValues.length) {
          base[breakpoint] = true;
        }
      });
    } else {
      breakpointsKeys.forEach((breakpoint) => {
        if (breakpointValues[breakpoint] != null) {
          base[breakpoint] = true;
        }
      });
    }
    return base;
  }
  function resolveBreakpointValues({
    values: breakpointValues,
    breakpoints: themeBreakpoints,
    base: customBase
  }) {
    const base = customBase || computeBreakpointsBase(breakpointValues, themeBreakpoints);
    const keys2 = Object.keys(base);
    if (keys2.length === 0) {
      return breakpointValues;
    }
    let previous;
    return keys2.reduce((acc, breakpoint, i) => {
      if (Array.isArray(breakpointValues)) {
        acc[breakpoint] = breakpointValues[i] != null ? breakpointValues[i] : breakpointValues[previous];
        previous = i;
      } else if (typeof breakpointValues === "object") {
        acc[breakpoint] = breakpointValues[breakpoint] != null ? breakpointValues[breakpoint] : breakpointValues[previous];
        previous = breakpoint;
      } else {
        acc[breakpoint] = breakpointValues;
      }
      return acc;
    }, {});
  }
  function getPath(obj, path, checkVars = true) {
    if (!path || typeof path !== "string") {
      return null;
    }
    if (obj && obj.vars && checkVars) {
      const val = `vars.${path}`.split(".").reduce((acc, item) => acc && acc[item] ? acc[item] : null, obj);
      if (val != null) {
        return val;
      }
    }
    return path.split(".").reduce((acc, item) => {
      if (acc && acc[item] != null) {
        return acc[item];
      }
      return null;
    }, obj);
  }
  function getStyleValue$1(themeMapping, transform, propValueFinal, userValue = propValueFinal) {
    let value;
    if (typeof themeMapping === "function") {
      value = themeMapping(propValueFinal);
    } else if (Array.isArray(themeMapping)) {
      value = themeMapping[propValueFinal] || userValue;
    } else {
      value = getPath(themeMapping, propValueFinal) || userValue;
    }
    if (transform) {
      value = transform(value, userValue, themeMapping);
    }
    return value;
  }
  function style$1(options) {
    const {
      prop,
      cssProperty = options.prop,
      themeKey,
      transform
    } = options;
    const fn2 = (props) => {
      if (props[prop] == null) {
        return null;
      }
      const propValue = props[prop];
      const theme = props.theme;
      const themeMapping = getPath(theme, themeKey) || {};
      const styleFromPropValue = (propValueFinal) => {
        let value = getStyleValue$1(themeMapping, transform, propValueFinal);
        if (propValueFinal === value && typeof propValueFinal === "string") {
          value = getStyleValue$1(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize$1(propValueFinal)}`, propValueFinal);
        }
        if (cssProperty === false) {
          return value;
        }
        return {
          [cssProperty]: value
        };
      };
      return handleBreakpoints(props, propValue, styleFromPropValue);
    };
    fn2.propTypes = {};
    fn2.filterProps = [prop];
    return fn2;
  }
  function memoize$2(fn2) {
    const cache2 = {};
    return (arg) => {
      if (cache2[arg] === void 0) {
        cache2[arg] = fn2(arg);
      }
      return cache2[arg];
    };
  }
  const properties = {
    m: "margin",
    p: "padding"
  };
  const directions = {
    t: "Top",
    r: "Right",
    b: "Bottom",
    l: "Left",
    x: ["Left", "Right"],
    y: ["Top", "Bottom"]
  };
  const aliases = {
    marginX: "mx",
    marginY: "my",
    paddingX: "px",
    paddingY: "py"
  };
  const getCssProperties = memoize$2((prop) => {
    if (prop.length > 2) {
      if (aliases[prop]) {
        prop = aliases[prop];
      } else {
        return [prop];
      }
    }
    const [a, b2] = prop.split("");
    const property2 = properties[a];
    const direction = directions[b2] || "";
    return Array.isArray(direction) ? direction.map((dir) => property2 + dir) : [property2 + direction];
  });
  const marginKeys = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"];
  const paddingKeys = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"];
  [...marginKeys, ...paddingKeys];
  function createUnaryUnit(theme, themeKey, defaultValue, propName) {
    var _getPath;
    const themeSpacing = (_getPath = getPath(theme, themeKey, false)) != null ? _getPath : defaultValue;
    if (typeof themeSpacing === "number") {
      return (abs2) => {
        if (typeof abs2 === "string") {
          return abs2;
        }
        return themeSpacing * abs2;
      };
    }
    if (Array.isArray(themeSpacing)) {
      return (abs2) => {
        if (typeof abs2 === "string") {
          return abs2;
        }
        return themeSpacing[abs2];
      };
    }
    if (typeof themeSpacing === "function") {
      return themeSpacing;
    }
    return () => void 0;
  }
  function createUnarySpacing(theme) {
    return createUnaryUnit(theme, "spacing", 8);
  }
  function getValue$2(transformer, propValue) {
    if (typeof propValue === "string" || propValue == null) {
      return propValue;
    }
    const abs2 = Math.abs(propValue);
    const transformed = transformer(abs2);
    if (propValue >= 0) {
      return transformed;
    }
    if (typeof transformed === "number") {
      return -transformed;
    }
    return `-${transformed}`;
  }
  function getStyleFromPropValue(cssProperties, transformer) {
    return (propValue) => cssProperties.reduce((acc, cssProperty) => {
      acc[cssProperty] = getValue$2(transformer, propValue);
      return acc;
    }, {});
  }
  function resolveCssProperty(props, keys2, prop, transformer) {
    if (keys2.indexOf(prop) === -1) {
      return null;
    }
    const cssProperties = getCssProperties(prop);
    const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
    const propValue = props[prop];
    return handleBreakpoints(props, propValue, styleFromPropValue);
  }
  function style(props, keys2) {
    const transformer = createUnarySpacing(props.theme);
    return Object.keys(props).map((prop) => resolveCssProperty(props, keys2, prop, transformer)).reduce(merge$1, {});
  }
  function margin(props) {
    return style(props, marginKeys);
  }
  margin.propTypes = {};
  margin.filterProps = marginKeys;
  function padding(props) {
    return style(props, paddingKeys);
  }
  padding.propTypes = {};
  padding.filterProps = paddingKeys;
  function createSpacing(spacingInput = 8) {
    if (spacingInput.mui) {
      return spacingInput;
    }
    const transform = createUnarySpacing({
      spacing: spacingInput
    });
    const spacing = (...argsInput) => {
      const args = argsInput.length === 0 ? [1] : argsInput;
      return args.map((argument) => {
        const output = transform(argument);
        return typeof output === "number" ? `${output}px` : output;
      }).join(" ");
    };
    spacing.mui = true;
    return spacing;
  }
  function compose(...styles2) {
    const handlers = styles2.reduce((acc, style2) => {
      style2.filterProps.forEach((prop) => {
        acc[prop] = style2;
      });
      return acc;
    }, {});
    const fn2 = (props) => {
      return Object.keys(props).reduce((acc, prop) => {
        if (handlers[prop]) {
          return merge$1(acc, handlers[prop](props));
        }
        return acc;
      }, {});
    };
    fn2.propTypes = {};
    fn2.filterProps = styles2.reduce((acc, style2) => acc.concat(style2.filterProps), []);
    return fn2;
  }
  function borderTransform(value) {
    if (typeof value !== "number") {
      return value;
    }
    return `${value}px solid`;
  }
  function createBorderStyle(prop, transform) {
    return style$1({
      prop,
      themeKey: "borders",
      transform
    });
  }
  const border = createBorderStyle("border", borderTransform);
  const borderTop = createBorderStyle("borderTop", borderTransform);
  const borderRight = createBorderStyle("borderRight", borderTransform);
  const borderBottom = createBorderStyle("borderBottom", borderTransform);
  const borderLeft = createBorderStyle("borderLeft", borderTransform);
  const borderColor = createBorderStyle("borderColor");
  const borderTopColor = createBorderStyle("borderTopColor");
  const borderRightColor = createBorderStyle("borderRightColor");
  const borderBottomColor = createBorderStyle("borderBottomColor");
  const borderLeftColor = createBorderStyle("borderLeftColor");
  const outline = createBorderStyle("outline", borderTransform);
  const outlineColor = createBorderStyle("outlineColor");
  const borderRadius = (props) => {
    if (props.borderRadius !== void 0 && props.borderRadius !== null) {
      const transformer = createUnaryUnit(props.theme, "shape.borderRadius", 4);
      const styleFromPropValue = (propValue) => ({
        borderRadius: getValue$2(transformer, propValue)
      });
      return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
    }
    return null;
  };
  borderRadius.propTypes = {};
  borderRadius.filterProps = ["borderRadius"];
  compose(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, outline, outlineColor);
  const gap = (props) => {
    if (props.gap !== void 0 && props.gap !== null) {
      const transformer = createUnaryUnit(props.theme, "spacing", 8);
      const styleFromPropValue = (propValue) => ({
        gap: getValue$2(transformer, propValue)
      });
      return handleBreakpoints(props, props.gap, styleFromPropValue);
    }
    return null;
  };
  gap.propTypes = {};
  gap.filterProps = ["gap"];
  const columnGap = (props) => {
    if (props.columnGap !== void 0 && props.columnGap !== null) {
      const transformer = createUnaryUnit(props.theme, "spacing", 8);
      const styleFromPropValue = (propValue) => ({
        columnGap: getValue$2(transformer, propValue)
      });
      return handleBreakpoints(props, props.columnGap, styleFromPropValue);
    }
    return null;
  };
  columnGap.propTypes = {};
  columnGap.filterProps = ["columnGap"];
  const rowGap = (props) => {
    if (props.rowGap !== void 0 && props.rowGap !== null) {
      const transformer = createUnaryUnit(props.theme, "spacing", 8);
      const styleFromPropValue = (propValue) => ({
        rowGap: getValue$2(transformer, propValue)
      });
      return handleBreakpoints(props, props.rowGap, styleFromPropValue);
    }
    return null;
  };
  rowGap.propTypes = {};
  rowGap.filterProps = ["rowGap"];
  const gridColumn = style$1({
    prop: "gridColumn"
  });
  const gridRow = style$1({
    prop: "gridRow"
  });
  const gridAutoFlow = style$1({
    prop: "gridAutoFlow"
  });
  const gridAutoColumns = style$1({
    prop: "gridAutoColumns"
  });
  const gridAutoRows = style$1({
    prop: "gridAutoRows"
  });
  const gridTemplateColumns = style$1({
    prop: "gridTemplateColumns"
  });
  const gridTemplateRows = style$1({
    prop: "gridTemplateRows"
  });
  const gridTemplateAreas = style$1({
    prop: "gridTemplateAreas"
  });
  const gridArea = style$1({
    prop: "gridArea"
  });
  compose(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);
  function paletteTransform(value, userValue) {
    if (userValue === "grey") {
      return userValue;
    }
    return value;
  }
  const color = style$1({
    prop: "color",
    themeKey: "palette",
    transform: paletteTransform
  });
  const bgcolor = style$1({
    prop: "bgcolor",
    cssProperty: "backgroundColor",
    themeKey: "palette",
    transform: paletteTransform
  });
  const backgroundColor = style$1({
    prop: "backgroundColor",
    themeKey: "palette",
    transform: paletteTransform
  });
  compose(color, bgcolor, backgroundColor);
  function sizingTransform(value) {
    return value <= 1 && value !== 0 ? `${value * 100}%` : value;
  }
  const width = style$1({
    prop: "width",
    transform: sizingTransform
  });
  const maxWidth = (props) => {
    if (props.maxWidth !== void 0 && props.maxWidth !== null) {
      const styleFromPropValue = (propValue) => {
        var _props$theme, _props$theme2;
        const breakpoint = ((_props$theme = props.theme) == null || (_props$theme = _props$theme.breakpoints) == null || (_props$theme = _props$theme.values) == null ? void 0 : _props$theme[propValue]) || values$1[propValue];
        if (!breakpoint) {
          return {
            maxWidth: sizingTransform(propValue)
          };
        }
        if (((_props$theme2 = props.theme) == null || (_props$theme2 = _props$theme2.breakpoints) == null ? void 0 : _props$theme2.unit) !== "px") {
          return {
            maxWidth: `${breakpoint}${props.theme.breakpoints.unit}`
          };
        }
        return {
          maxWidth: breakpoint
        };
      };
      return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
    }
    return null;
  };
  maxWidth.filterProps = ["maxWidth"];
  const minWidth = style$1({
    prop: "minWidth",
    transform: sizingTransform
  });
  const height = style$1({
    prop: "height",
    transform: sizingTransform
  });
  const maxHeight = style$1({
    prop: "maxHeight",
    transform: sizingTransform
  });
  const minHeight = style$1({
    prop: "minHeight",
    transform: sizingTransform
  });
  style$1({
    prop: "size",
    cssProperty: "width",
    transform: sizingTransform
  });
  style$1({
    prop: "size",
    cssProperty: "height",
    transform: sizingTransform
  });
  const boxSizing = style$1({
    prop: "boxSizing"
  });
  compose(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
  const defaultSxConfig = {
    // borders
    border: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderTop: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderRight: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderBottom: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderLeft: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderColor: {
      themeKey: "palette"
    },
    borderTopColor: {
      themeKey: "palette"
    },
    borderRightColor: {
      themeKey: "palette"
    },
    borderBottomColor: {
      themeKey: "palette"
    },
    borderLeftColor: {
      themeKey: "palette"
    },
    outline: {
      themeKey: "borders",
      transform: borderTransform
    },
    outlineColor: {
      themeKey: "palette"
    },
    borderRadius: {
      themeKey: "shape.borderRadius",
      style: borderRadius
    },
    // palette
    color: {
      themeKey: "palette",
      transform: paletteTransform
    },
    bgcolor: {
      themeKey: "palette",
      cssProperty: "backgroundColor",
      transform: paletteTransform
    },
    backgroundColor: {
      themeKey: "palette",
      transform: paletteTransform
    },
    // spacing
    p: {
      style: padding
    },
    pt: {
      style: padding
    },
    pr: {
      style: padding
    },
    pb: {
      style: padding
    },
    pl: {
      style: padding
    },
    px: {
      style: padding
    },
    py: {
      style: padding
    },
    padding: {
      style: padding
    },
    paddingTop: {
      style: padding
    },
    paddingRight: {
      style: padding
    },
    paddingBottom: {
      style: padding
    },
    paddingLeft: {
      style: padding
    },
    paddingX: {
      style: padding
    },
    paddingY: {
      style: padding
    },
    paddingInline: {
      style: padding
    },
    paddingInlineStart: {
      style: padding
    },
    paddingInlineEnd: {
      style: padding
    },
    paddingBlock: {
      style: padding
    },
    paddingBlockStart: {
      style: padding
    },
    paddingBlockEnd: {
      style: padding
    },
    m: {
      style: margin
    },
    mt: {
      style: margin
    },
    mr: {
      style: margin
    },
    mb: {
      style: margin
    },
    ml: {
      style: margin
    },
    mx: {
      style: margin
    },
    my: {
      style: margin
    },
    margin: {
      style: margin
    },
    marginTop: {
      style: margin
    },
    marginRight: {
      style: margin
    },
    marginBottom: {
      style: margin
    },
    marginLeft: {
      style: margin
    },
    marginX: {
      style: margin
    },
    marginY: {
      style: margin
    },
    marginInline: {
      style: margin
    },
    marginInlineStart: {
      style: margin
    },
    marginInlineEnd: {
      style: margin
    },
    marginBlock: {
      style: margin
    },
    marginBlockStart: {
      style: margin
    },
    marginBlockEnd: {
      style: margin
    },
    // display
    displayPrint: {
      cssProperty: false,
      transform: (value) => ({
        "@media print": {
          display: value
        }
      })
    },
    display: {},
    overflow: {},
    textOverflow: {},
    visibility: {},
    whiteSpace: {},
    // flexbox
    flexBasis: {},
    flexDirection: {},
    flexWrap: {},
    justifyContent: {},
    alignItems: {},
    alignContent: {},
    order: {},
    flex: {},
    flexGrow: {},
    flexShrink: {},
    alignSelf: {},
    justifyItems: {},
    justifySelf: {},
    // grid
    gap: {
      style: gap
    },
    rowGap: {
      style: rowGap
    },
    columnGap: {
      style: columnGap
    },
    gridColumn: {},
    gridRow: {},
    gridAutoFlow: {},
    gridAutoColumns: {},
    gridAutoRows: {},
    gridTemplateColumns: {},
    gridTemplateRows: {},
    gridTemplateAreas: {},
    gridArea: {},
    // positions
    position: {},
    zIndex: {
      themeKey: "zIndex"
    },
    top: {},
    right: {},
    bottom: {},
    left: {},
    // shadows
    boxShadow: {
      themeKey: "shadows"
    },
    // sizing
    width: {
      transform: sizingTransform
    },
    maxWidth: {
      style: maxWidth
    },
    minWidth: {
      transform: sizingTransform
    },
    height: {
      transform: sizingTransform
    },
    maxHeight: {
      transform: sizingTransform
    },
    minHeight: {
      transform: sizingTransform
    },
    boxSizing: {},
    // typography
    fontFamily: {
      themeKey: "typography"
    },
    fontSize: {
      themeKey: "typography"
    },
    fontStyle: {
      themeKey: "typography"
    },
    fontWeight: {
      themeKey: "typography"
    },
    letterSpacing: {},
    textTransform: {},
    lineHeight: {},
    textAlign: {},
    typography: {
      cssProperty: false,
      themeKey: "typography"
    }
  };
  const defaultSxConfig$1 = defaultSxConfig;
  function objectsHaveSameKeys(...objects) {
    const allKeys = objects.reduce((keys2, object) => keys2.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object) => union.size === Object.keys(object).length);
  }
  function callIfFn(maybeFn, arg) {
    return typeof maybeFn === "function" ? maybeFn(arg) : maybeFn;
  }
  function unstable_createStyleFunctionSx() {
    function getThemeValue(prop, val, theme, config2) {
      const props = {
        [prop]: val,
        theme
      };
      const options = config2[prop];
      if (!options) {
        return {
          [prop]: val
        };
      }
      const {
        cssProperty = prop,
        themeKey,
        transform,
        style: style2
      } = options;
      if (val == null) {
        return null;
      }
      if (themeKey === "typography" && val === "inherit") {
        return {
          [prop]: val
        };
      }
      const themeMapping = getPath(theme, themeKey) || {};
      if (style2) {
        return style2(props);
      }
      const styleFromPropValue = (propValueFinal) => {
        let value = getStyleValue$1(themeMapping, transform, propValueFinal);
        if (propValueFinal === value && typeof propValueFinal === "string") {
          value = getStyleValue$1(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize$1(propValueFinal)}`, propValueFinal);
        }
        if (cssProperty === false) {
          return value;
        }
        return {
          [cssProperty]: value
        };
      };
      return handleBreakpoints(props, val, styleFromPropValue);
    }
    function styleFunctionSx2(props) {
      var _theme$unstable_sxCon;
      const {
        sx,
        theme = {}
      } = props || {};
      if (!sx) {
        return null;
      }
      const config2 = (_theme$unstable_sxCon = theme.unstable_sxConfig) != null ? _theme$unstable_sxCon : defaultSxConfig$1;
      function traverse(sxInput) {
        let sxObject = sxInput;
        if (typeof sxInput === "function") {
          sxObject = sxInput(theme);
        } else if (typeof sxInput !== "object") {
          return sxInput;
        }
        if (!sxObject) {
          return null;
        }
        const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
        const breakpointsKeys = Object.keys(emptyBreakpoints);
        let css2 = emptyBreakpoints;
        Object.keys(sxObject).forEach((styleKey) => {
          const value = callIfFn(sxObject[styleKey], theme);
          if (value !== null && value !== void 0) {
            if (typeof value === "object") {
              if (config2[styleKey]) {
                css2 = merge$1(css2, getThemeValue(styleKey, value, theme, config2));
              } else {
                const breakpointsValues = handleBreakpoints({
                  theme
                }, value, (x2) => ({
                  [styleKey]: x2
                }));
                if (objectsHaveSameKeys(breakpointsValues, value)) {
                  css2[styleKey] = styleFunctionSx2({
                    sx: value,
                    theme
                  });
                } else {
                  css2 = merge$1(css2, breakpointsValues);
                }
              }
            } else {
              css2 = merge$1(css2, getThemeValue(styleKey, value, theme, config2));
            }
          }
        });
        return removeUnusedBreakpoints(breakpointsKeys, css2);
      }
      return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
    }
    return styleFunctionSx2;
  }
  const styleFunctionSx$1 = unstable_createStyleFunctionSx();
  styleFunctionSx$1.filterProps = ["sx"];
  const styleFunctionSx$2 = styleFunctionSx$1;
  function applyStyles$2(key, styles2) {
    const theme = this;
    if (theme.vars && typeof theme.getColorSchemeSelector === "function") {
      const selector = theme.getColorSchemeSelector(key).replace(/(\[[^\]]+\])/, "*:where($1)");
      return {
        [selector]: styles2
      };
    }
    if (theme.palette.mode === key) {
      return styles2;
    }
    return {};
  }
  const _excluded$Z = ["breakpoints", "palette", "spacing", "shape"];
  function createTheme$2(options = {}, ...args) {
    const {
      breakpoints: breakpointsInput = {},
      palette: paletteInput = {},
      spacing: spacingInput,
      shape: shapeInput = {}
    } = options, other = _objectWithoutPropertiesLoose(options, _excluded$Z);
    const breakpoints2 = createBreakpoints(breakpointsInput);
    const spacing = createSpacing(spacingInput);
    let muiTheme = deepmerge$1({
      breakpoints: breakpoints2,
      direction: "ltr",
      components: {},
      // Inject component definitions.
      palette: _extends$1({
        mode: "light"
      }, paletteInput),
      spacing,
      shape: _extends$1({}, shape$1, shapeInput)
    }, other);
    muiTheme.applyStyles = applyStyles$2;
    muiTheme = args.reduce((acc, argument) => deepmerge$1(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = _extends$1({}, defaultSxConfig$1, other == null ? void 0 : other.unstable_sxConfig);
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx$2({
        sx: props,
        theme: this
      });
    };
    return muiTheme;
  }
  const createTheme$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: createTheme$2,
    private_createBreakpoints: createBreakpoints,
    unstable_applyStyles: applyStyles$2
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$7 = /* @__PURE__ */ getAugmentedNamespace(createTheme$1);
  const _excluded$Y = ["sx"];
  const splitProps = (props) => {
    var _props$theme$unstable, _props$theme;
    const result = {
      systemProps: {},
      otherProps: {}
    };
    const config2 = (_props$theme$unstable = props == null || (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : defaultSxConfig$1;
    Object.keys(props).forEach((prop) => {
      if (config2[prop]) {
        result.systemProps[prop] = props[prop];
      } else {
        result.otherProps[prop] = props[prop];
      }
    });
    return result;
  };
  function extendSxProp(props) {
    const {
      sx: inSx
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$Y);
    const {
      systemProps,
      otherProps
    } = splitProps(other);
    let finalSx;
    if (Array.isArray(inSx)) {
      finalSx = [systemProps, ...inSx];
    } else if (typeof inSx === "function") {
      finalSx = (...args) => {
        const result = inSx(...args);
        if (!isPlainObject$2(result)) {
          return systemProps;
        }
        return _extends$1({}, systemProps, result);
      };
    } else {
      finalSx = _extends$1({}, systemProps, inSx);
    }
    return _extends$1({}, otherProps, {
      sx: finalSx
    });
  }
  const styleFunctionSx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: styleFunctionSx$2,
    extendSxProp,
    unstable_createStyleFunctionSx,
    unstable_defaultSxConfig: defaultSxConfig$1
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$8 = /* @__PURE__ */ getAugmentedNamespace(styleFunctionSx);
  var _interopRequireDefault$1 = interopRequireDefaultExports;
  Object.defineProperty(createStyled$2, "__esModule", {
    value: true
  });
  var _default = createStyled$2.default = createStyled;
  var shouldForwardProp_1 = createStyled$2.shouldForwardProp = shouldForwardProp;
  createStyled$2.systemDefaultTheme = void 0;
  var _extends2 = _interopRequireDefault$1(require_extends());
  var _objectWithoutPropertiesLoose2 = _interopRequireDefault$1(requireObjectWithoutPropertiesLoose());
  var _styledEngine$1 = _interopRequireWildcard$1(require$$1);
  var _deepmerge = require$$4;
  _interopRequireDefault$1(require$$5);
  _interopRequireDefault$1(require$$6);
  var _createTheme = _interopRequireDefault$1(require$$7);
  var _styleFunctionSx = _interopRequireDefault$1(require$$8);
  const _excluded$X = ["ownerState"], _excluded2$7 = ["variants"], _excluded3$2 = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"];
  function _getRequireWildcardCache$1(e2) {
    if ("function" != typeof WeakMap)
      return null;
    var r2 = /* @__PURE__ */ new WeakMap(), t2 = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache$1 = function(e22) {
      return e22 ? t2 : r2;
    })(e2);
  }
  function _interopRequireWildcard$1(e2, r2) {
    if (!r2 && e2 && e2.__esModule)
      return e2;
    if (null === e2 || "object" != typeof e2 && "function" != typeof e2)
      return { default: e2 };
    var t2 = _getRequireWildcardCache$1(r2);
    if (t2 && t2.has(e2))
      return t2.get(e2);
    var n2 = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var u2 in e2)
      if ("default" !== u2 && Object.prototype.hasOwnProperty.call(e2, u2)) {
        var i = a ? Object.getOwnPropertyDescriptor(e2, u2) : null;
        i && (i.get || i.set) ? Object.defineProperty(n2, u2, i) : n2[u2] = e2[u2];
      }
    return n2.default = e2, t2 && t2.set(e2, n2), n2;
  }
  function isEmpty$2(obj) {
    return Object.keys(obj).length === 0;
  }
  function isStringTag(tag) {
    return typeof tag === "string" && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96;
  }
  function shouldForwardProp(prop) {
    return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
  }
  const systemDefaultTheme$1 = createStyled$2.systemDefaultTheme = (0, _createTheme.default)();
  const lowercaseFirstLetter = (string) => {
    if (!string) {
      return string;
    }
    return string.charAt(0).toLowerCase() + string.slice(1);
  };
  function resolveTheme({
    defaultTheme: defaultTheme2,
    theme,
    themeId
  }) {
    return isEmpty$2(theme) ? defaultTheme2 : theme[themeId] || theme;
  }
  function defaultOverridesResolver(slot) {
    if (!slot) {
      return null;
    }
    return (props, styles2) => styles2[slot];
  }
  function processStyleArg(callableStyle, _ref) {
    let {
      ownerState
    } = _ref, props = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded$X);
    const resolvedStylesArg = typeof callableStyle === "function" ? callableStyle((0, _extends2.default)({
      ownerState
    }, props)) : callableStyle;
    if (Array.isArray(resolvedStylesArg)) {
      return resolvedStylesArg.flatMap((resolvedStyle) => processStyleArg(resolvedStyle, (0, _extends2.default)({
        ownerState
      }, props)));
    }
    if (!!resolvedStylesArg && typeof resolvedStylesArg === "object" && Array.isArray(resolvedStylesArg.variants)) {
      const {
        variants = []
      } = resolvedStylesArg, otherStyles = (0, _objectWithoutPropertiesLoose2.default)(resolvedStylesArg, _excluded2$7);
      let result = otherStyles;
      variants.forEach((variant) => {
        let isMatch = true;
        if (typeof variant.props === "function") {
          isMatch = variant.props((0, _extends2.default)({
            ownerState
          }, props, ownerState));
        } else {
          Object.keys(variant.props).forEach((key) => {
            if ((ownerState == null ? void 0 : ownerState[key]) !== variant.props[key] && props[key] !== variant.props[key]) {
              isMatch = false;
            }
          });
        }
        if (isMatch) {
          if (!Array.isArray(result)) {
            result = [result];
          }
          result.push(typeof variant.style === "function" ? variant.style((0, _extends2.default)({
            ownerState
          }, props, ownerState)) : variant.style);
        }
      });
      return result;
    }
    return resolvedStylesArg;
  }
  function createStyled(input2 = {}) {
    const {
      themeId,
      defaultTheme: defaultTheme2 = systemDefaultTheme$1,
      rootShouldForwardProp: rootShouldForwardProp2 = shouldForwardProp,
      slotShouldForwardProp: slotShouldForwardProp2 = shouldForwardProp
    } = input2;
    const systemSx = (props) => {
      return (0, _styleFunctionSx.default)((0, _extends2.default)({}, props, {
        theme: resolveTheme((0, _extends2.default)({}, props, {
          defaultTheme: defaultTheme2,
          themeId
        }))
      }));
    };
    systemSx.__mui_systemSx = true;
    return (tag, inputOptions = {}) => {
      (0, _styledEngine$1.internal_processStyles)(tag, (styles2) => styles2.filter((style2) => !(style2 != null && style2.__mui_systemSx)));
      const {
        name: componentName,
        slot: componentSlot,
        skipVariantsResolver: inputSkipVariantsResolver,
        skipSx: inputSkipSx,
        // TODO v6: remove `lowercaseFirstLetter()` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        overridesResolver: overridesResolver2 = defaultOverridesResolver(lowercaseFirstLetter(componentSlot))
      } = inputOptions, options = (0, _objectWithoutPropertiesLoose2.default)(inputOptions, _excluded3$2);
      const skipVariantsResolver = inputSkipVariantsResolver !== void 0 ? inputSkipVariantsResolver : (
        // TODO v6: remove `Root` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        componentSlot && componentSlot !== "Root" && componentSlot !== "root" || false
      );
      const skipSx = inputSkipSx || false;
      let label;
      let shouldForwardPropOption = shouldForwardProp;
      if (componentSlot === "Root" || componentSlot === "root") {
        shouldForwardPropOption = rootShouldForwardProp2;
      } else if (componentSlot) {
        shouldForwardPropOption = slotShouldForwardProp2;
      } else if (isStringTag(tag)) {
        shouldForwardPropOption = void 0;
      }
      const defaultStyledResolver = (0, _styledEngine$1.default)(tag, (0, _extends2.default)({
        shouldForwardProp: shouldForwardPropOption,
        label
      }, options));
      const transformStyleArg = (stylesArg) => {
        if (typeof stylesArg === "function" && stylesArg.__emotion_real !== stylesArg || (0, _deepmerge.isPlainObject)(stylesArg)) {
          return (props) => processStyleArg(stylesArg, (0, _extends2.default)({}, props, {
            theme: resolveTheme({
              theme: props.theme,
              defaultTheme: defaultTheme2,
              themeId
            })
          }));
        }
        return stylesArg;
      };
      const muiStyledResolver = (styleArg, ...expressions) => {
        let transformedStyleArg = transformStyleArg(styleArg);
        const expressionsWithDefaultTheme = expressions ? expressions.map(transformStyleArg) : [];
        if (componentName && overridesResolver2) {
          expressionsWithDefaultTheme.push((props) => {
            const theme = resolveTheme((0, _extends2.default)({}, props, {
              defaultTheme: defaultTheme2,
              themeId
            }));
            if (!theme.components || !theme.components[componentName] || !theme.components[componentName].styleOverrides) {
              return null;
            }
            const styleOverrides = theme.components[componentName].styleOverrides;
            const resolvedStyleOverrides = {};
            Object.entries(styleOverrides).forEach(([slotKey, slotStyle]) => {
              resolvedStyleOverrides[slotKey] = processStyleArg(slotStyle, (0, _extends2.default)({}, props, {
                theme
              }));
            });
            return overridesResolver2(props, resolvedStyleOverrides);
          });
        }
        if (componentName && !skipVariantsResolver) {
          expressionsWithDefaultTheme.push((props) => {
            var _theme$components;
            const theme = resolveTheme((0, _extends2.default)({}, props, {
              defaultTheme: defaultTheme2,
              themeId
            }));
            const themeVariants = theme == null || (_theme$components = theme.components) == null || (_theme$components = _theme$components[componentName]) == null ? void 0 : _theme$components.variants;
            return processStyleArg({
              variants: themeVariants
            }, (0, _extends2.default)({}, props, {
              theme
            }));
          });
        }
        if (!skipSx) {
          expressionsWithDefaultTheme.push(systemSx);
        }
        const numOfCustomFnsApplied = expressionsWithDefaultTheme.length - expressions.length;
        if (Array.isArray(styleArg) && numOfCustomFnsApplied > 0) {
          const placeholders = new Array(numOfCustomFnsApplied).fill("");
          transformedStyleArg = [...styleArg, ...placeholders];
          transformedStyleArg.raw = [...styleArg.raw, ...placeholders];
        }
        const Component = defaultStyledResolver(transformedStyleArg, ...expressionsWithDefaultTheme);
        if (tag.muiName) {
          Component.muiName = tag.muiName;
        }
        return Component;
      };
      if (defaultStyledResolver.withConfig) {
        muiStyledResolver.withConfig = defaultStyledResolver.withConfig;
      }
      return muiStyledResolver;
    };
  }
  const defaultGenerator$1 = (componentName) => componentName;
  const createClassNameGenerator$1 = () => {
    let generate = defaultGenerator$1;
    return {
      configure(generator) {
        generate = generator;
      },
      generate(componentName) {
        return generate(componentName);
      },
      reset() {
        generate = defaultGenerator$1;
      }
    };
  };
  const ClassNameGenerator$1 = createClassNameGenerator$1();
  const globalStateClasses$1 = {
    active: "active",
    checked: "checked",
    completed: "completed",
    disabled: "disabled",
    error: "error",
    expanded: "expanded",
    focused: "focused",
    focusVisible: "focusVisible",
    open: "open",
    readOnly: "readOnly",
    required: "required",
    selected: "selected"
  };
  function generateUtilityClass$2(componentName, slot, globalStatePrefix = "Mui") {
    const globalStateClass = globalStateClasses$1[slot];
    return globalStateClass ? `${globalStatePrefix}-${globalStateClass}` : `${ClassNameGenerator$1.generate(componentName)}-${slot}`;
  }
  function createMixins(breakpoints2, mixins) {
    return _extends$1({
      toolbar: {
        minHeight: 56,
        [breakpoints2.up("xs")]: {
          "@media (orientation: landscape)": {
            minHeight: 48
          }
        },
        [breakpoints2.up("sm")]: {
          minHeight: 64
        }
      }
    }, mixins);
  }
  const common = {
    black: "#000",
    white: "#fff"
  };
  const common$1 = common;
  const grey = {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#f5f5f5",
    A200: "#eeeeee",
    A400: "#bdbdbd",
    A700: "#616161"
  };
  const grey$1 = grey;
  const purple = {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8",
    300: "#ba68c8",
    400: "#ab47bc",
    500: "#9c27b0",
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
    A100: "#ea80fc",
    A200: "#e040fb",
    A400: "#d500f9",
    A700: "#aa00ff"
  };
  const purple$1 = purple;
  const red = {
    50: "#ffebee",
    100: "#ffcdd2",
    200: "#ef9a9a",
    300: "#e57373",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
    A100: "#ff8a80",
    A200: "#ff5252",
    A400: "#ff1744",
    A700: "#d50000"
  };
  const red$1 = red;
  const orange = {
    50: "#fff3e0",
    100: "#ffe0b2",
    200: "#ffcc80",
    300: "#ffb74d",
    400: "#ffa726",
    500: "#ff9800",
    600: "#fb8c00",
    700: "#f57c00",
    800: "#ef6c00",
    900: "#e65100",
    A100: "#ffd180",
    A200: "#ffab40",
    A400: "#ff9100",
    A700: "#ff6d00"
  };
  const orange$1 = orange;
  const blue = {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
    A100: "#82b1ff",
    A200: "#448aff",
    A400: "#2979ff",
    A700: "#2962ff"
  };
  const blue$1 = blue;
  const lightBlue = {
    50: "#e1f5fe",
    100: "#b3e5fc",
    200: "#81d4fa",
    300: "#4fc3f7",
    400: "#29b6f6",
    500: "#03a9f4",
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
    A100: "#80d8ff",
    A200: "#40c4ff",
    A400: "#00b0ff",
    A700: "#0091ea"
  };
  const lightBlue$1 = lightBlue;
  const green = {
    50: "#e8f5e9",
    100: "#c8e6c9",
    200: "#a5d6a7",
    300: "#81c784",
    400: "#66bb6a",
    500: "#4caf50",
    600: "#43a047",
    700: "#388e3c",
    800: "#2e7d32",
    900: "#1b5e20",
    A100: "#b9f6ca",
    A200: "#69f0ae",
    A400: "#00e676",
    A700: "#00c853"
  };
  const green$1 = green;
  const _excluded$W = ["mode", "contrastThreshold", "tonalOffset"];
  const light = {
    // The colors used to style the text.
    text: {
      // The most important text.
      primary: "rgba(0, 0, 0, 0.87)",
      // Secondary text.
      secondary: "rgba(0, 0, 0, 0.6)",
      // Disabled text have even lower visual prominence.
      disabled: "rgba(0, 0, 0, 0.38)"
    },
    // The color used to divide different elements.
    divider: "rgba(0, 0, 0, 0.12)",
    // The background colors used to style the surfaces.
    // Consistency between these values is important.
    background: {
      paper: common$1.white,
      default: common$1.white
    },
    // The colors used to style the action elements.
    action: {
      // The color of an active action like an icon button.
      active: "rgba(0, 0, 0, 0.54)",
      // The color of an hovered action.
      hover: "rgba(0, 0, 0, 0.04)",
      hoverOpacity: 0.04,
      // The color of a selected action.
      selected: "rgba(0, 0, 0, 0.08)",
      selectedOpacity: 0.08,
      // The color of a disabled action.
      disabled: "rgba(0, 0, 0, 0.26)",
      // The background color of a disabled action.
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(0, 0, 0, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.12
    }
  };
  const dark = {
    text: {
      primary: common$1.white,
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
      icon: "rgba(255, 255, 255, 0.5)"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    background: {
      paper: "#121212",
      default: "#121212"
    },
    action: {
      active: common$1.white,
      hover: "rgba(255, 255, 255, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(255, 255, 255, 0.16)",
      selectedOpacity: 0.16,
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(255, 255, 255, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.24
    }
  };
  function addLightOrDark(intent, direction, shade, tonalOffset) {
    const tonalOffsetLight = tonalOffset.light || tonalOffset;
    const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
    if (!intent[direction]) {
      if (intent.hasOwnProperty(shade)) {
        intent[direction] = intent[shade];
      } else if (direction === "light") {
        intent.light = lighten_1(intent.main, tonalOffsetLight);
      } else if (direction === "dark") {
        intent.dark = darken_1(intent.main, tonalOffsetDark);
      }
    }
  }
  function getDefaultPrimary(mode = "light") {
    if (mode === "dark") {
      return {
        main: blue$1[200],
        light: blue$1[50],
        dark: blue$1[400]
      };
    }
    return {
      main: blue$1[700],
      light: blue$1[400],
      dark: blue$1[800]
    };
  }
  function getDefaultSecondary(mode = "light") {
    if (mode === "dark") {
      return {
        main: purple$1[200],
        light: purple$1[50],
        dark: purple$1[400]
      };
    }
    return {
      main: purple$1[500],
      light: purple$1[300],
      dark: purple$1[700]
    };
  }
  function getDefaultError(mode = "light") {
    if (mode === "dark") {
      return {
        main: red$1[500],
        light: red$1[300],
        dark: red$1[700]
      };
    }
    return {
      main: red$1[700],
      light: red$1[400],
      dark: red$1[800]
    };
  }
  function getDefaultInfo(mode = "light") {
    if (mode === "dark") {
      return {
        main: lightBlue$1[400],
        light: lightBlue$1[300],
        dark: lightBlue$1[700]
      };
    }
    return {
      main: lightBlue$1[700],
      light: lightBlue$1[500],
      dark: lightBlue$1[900]
    };
  }
  function getDefaultSuccess(mode = "light") {
    if (mode === "dark") {
      return {
        main: green$1[400],
        light: green$1[300],
        dark: green$1[700]
      };
    }
    return {
      main: green$1[800],
      light: green$1[500],
      dark: green$1[900]
    };
  }
  function getDefaultWarning(mode = "light") {
    if (mode === "dark") {
      return {
        main: orange$1[400],
        light: orange$1[300],
        dark: orange$1[700]
      };
    }
    return {
      main: "#ed6c02",
      // closest to orange[800] that pass 3:1.
      light: orange$1[500],
      dark: orange$1[900]
    };
  }
  function createPalette(palette2) {
    const {
      mode = "light",
      contrastThreshold = 3,
      tonalOffset = 0.2
    } = palette2, other = _objectWithoutPropertiesLoose(palette2, _excluded$W);
    const primary = palette2.primary || getDefaultPrimary(mode);
    const secondary = palette2.secondary || getDefaultSecondary(mode);
    const error = palette2.error || getDefaultError(mode);
    const info = palette2.info || getDefaultInfo(mode);
    const success = palette2.success || getDefaultSuccess(mode);
    const warning = palette2.warning || getDefaultWarning(mode);
    function getContrastText(background) {
      const contrastText = getContrastRatio_1(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
      return contrastText;
    }
    const augmentColor = ({
      color: color2,
      name,
      mainShade = 500,
      lightShade = 300,
      darkShade = 700
    }) => {
      color2 = _extends$1({}, color2);
      if (!color2.main && color2[mainShade]) {
        color2.main = color2[mainShade];
      }
      if (!color2.hasOwnProperty("main")) {
        throw new Error(formatMuiErrorMessage$1(11, name ? ` (${name})` : "", mainShade));
      }
      if (typeof color2.main !== "string") {
        throw new Error(formatMuiErrorMessage$1(12, name ? ` (${name})` : "", JSON.stringify(color2.main)));
      }
      addLightOrDark(color2, "light", lightShade, tonalOffset);
      addLightOrDark(color2, "dark", darkShade, tonalOffset);
      if (!color2.contrastText) {
        color2.contrastText = getContrastText(color2.main);
      }
      return color2;
    };
    const modes = {
      dark,
      light
    };
    const paletteOutput = deepmerge$1(_extends$1({
      // A collection of common colors.
      common: _extends$1({}, common$1),
      // prevent mutable object.
      // The palette mode, can be light or dark.
      mode,
      // The colors used to represent primary interface elements for a user.
      primary: augmentColor({
        color: primary,
        name: "primary"
      }),
      // The colors used to represent secondary interface elements for a user.
      secondary: augmentColor({
        color: secondary,
        name: "secondary",
        mainShade: "A400",
        lightShade: "A200",
        darkShade: "A700"
      }),
      // The colors used to represent interface elements that the user should be made aware of.
      error: augmentColor({
        color: error,
        name: "error"
      }),
      // The colors used to represent potentially dangerous actions or important messages.
      warning: augmentColor({
        color: warning,
        name: "warning"
      }),
      // The colors used to present information to the user that is neutral and not necessarily important.
      info: augmentColor({
        color: info,
        name: "info"
      }),
      // The colors used to indicate the successful completion of an action that user triggered.
      success: augmentColor({
        color: success,
        name: "success"
      }),
      // The grey colors.
      grey: grey$1,
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold,
      // Takes a background color and returns the text color that maximizes the contrast.
      getContrastText,
      // Generate a rich color object.
      augmentColor,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset
    }, modes[mode]), other);
    return paletteOutput;
  }
  const _excluded$V = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
  function round$2(value) {
    return Math.round(value * 1e5) / 1e5;
  }
  const caseAllCaps = {
    textTransform: "uppercase"
  };
  const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
  function createTypography(palette2, typography2) {
    const _ref = typeof typography2 === "function" ? typography2(palette2) : typography2, {
      fontFamily = defaultFontFamily,
      // The default font size of the Material Specification.
      fontSize = 14,
      // px
      fontWeightLight = 300,
      fontWeightRegular = 400,
      fontWeightMedium = 500,
      fontWeightBold = 700,
      // Tell MUI what's the font-size on the html element.
      // 16px is the default font-size used by browsers.
      htmlFontSize = 16,
      // Apply the CSS properties to all the variants.
      allVariants,
      pxToRem: pxToRem2
    } = _ref, other = _objectWithoutPropertiesLoose(_ref, _excluded$V);
    const coef = fontSize / 14;
    const pxToRem3 = pxToRem2 || ((size) => `${size / htmlFontSize * coef}rem`);
    const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => _extends$1({
      fontFamily,
      fontWeight,
      fontSize: pxToRem3(size),
      // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
      lineHeight
    }, fontFamily === defaultFontFamily ? {
      letterSpacing: `${round$2(letterSpacing / size)}em`
    } : {}, casing, allVariants);
    const variants = {
      h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
      h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
      h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
      h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
      h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
      h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
      subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
      subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
      body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
      body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
      button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
      caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
      overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps),
      // TODO v6: Remove handling of 'inherit' variant from the theme as it is already handled in Material UI's Typography component. Also, remember to remove the associated types.
      inherit: {
        fontFamily: "inherit",
        fontWeight: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit"
      }
    };
    return deepmerge$1(_extends$1({
      htmlFontSize,
      pxToRem: pxToRem3,
      fontFamily,
      fontSize,
      fontWeightLight,
      fontWeightRegular,
      fontWeightMedium,
      fontWeightBold
    }, variants), other, {
      clone: false
      // No need to clone deep
    });
  }
  const shadowKeyUmbraOpacity = 0.2;
  const shadowKeyPenumbraOpacity = 0.14;
  const shadowAmbientShadowOpacity = 0.12;
  function createShadow(...px) {
    return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(",");
  }
  const shadows = ["none", createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
  const _excluded$U = ["duration", "easing", "delay"];
  const easing = {
    // This is the most common easing curve.
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    // Objects enter the screen at full velocity from off-screen and
    // slowly decelerate to a resting point.
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    // Objects leave the screen at full velocity. They do not decelerate when off-screen.
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    // The sharp curve is used by objects that may return to the screen at any time.
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
  };
  const duration = {
    shortest: 150,
    shorter: 200,
    short: 250,
    // most basic recommended timing
    standard: 300,
    // this is to be used in complex animations
    complex: 375,
    // recommended when something is entering screen
    enteringScreen: 225,
    // recommended when something is leaving screen
    leavingScreen: 195
  };
  function formatMs(milliseconds) {
    return `${Math.round(milliseconds)}ms`;
  }
  function getAutoHeightDuration(height2) {
    if (!height2) {
      return 0;
    }
    const constant2 = height2 / 36;
    return Math.round((4 + 15 * constant2 ** 0.25 + constant2 / 5) * 10);
  }
  function createTransitions(inputTransitions) {
    const mergedEasing = _extends$1({}, easing, inputTransitions.easing);
    const mergedDuration = _extends$1({}, duration, inputTransitions.duration);
    const create = (props = ["all"], options = {}) => {
      const {
        duration: durationOption = mergedDuration.standard,
        easing: easingOption = mergedEasing.easeInOut,
        delay = 0
      } = options;
      _objectWithoutPropertiesLoose(options, _excluded$U);
      return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
    };
    return _extends$1({
      getAutoHeightDuration,
      create
    }, inputTransitions, {
      easing: mergedEasing,
      duration: mergedDuration
    });
  }
  const zIndex = {
    mobileStepper: 1e3,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  };
  const zIndex$1 = zIndex;
  const _excluded$T = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
  function createTheme(options = {}, ...args) {
    const {
      mixins: mixinsInput = {},
      palette: paletteInput = {},
      transitions: transitionsInput = {},
      typography: typographyInput = {}
    } = options, other = _objectWithoutPropertiesLoose(options, _excluded$T);
    if (options.vars) {
      throw new Error(formatMuiErrorMessage$1(18));
    }
    const palette2 = createPalette(paletteInput);
    const systemTheme = createTheme$2(options);
    let muiTheme = deepmerge$1(systemTheme, {
      mixins: createMixins(systemTheme.breakpoints, mixinsInput),
      palette: palette2,
      // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
      shadows: shadows.slice(),
      typography: createTypography(palette2, typographyInput),
      transitions: createTransitions(transitionsInput),
      zIndex: _extends$1({}, zIndex$1)
    });
    muiTheme = deepmerge$1(muiTheme, other);
    muiTheme = args.reduce((acc, argument) => deepmerge$1(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = _extends$1({}, defaultSxConfig$1, other == null ? void 0 : other.unstable_sxConfig);
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx$2({
        sx: props,
        theme: this
      });
    };
    return muiTheme;
  }
  const defaultTheme$1 = createTheme();
  const defaultTheme$2 = defaultTheme$1;
  const THEME_ID = "$$material";
  const rootShouldForwardProp$1 = (prop) => shouldForwardProp_1(prop) && prop !== "classes";
  const slotShouldForwardProp = shouldForwardProp_1;
  const styled = _default({
    themeId: THEME_ID,
    defaultTheme: defaultTheme$2,
    rootShouldForwardProp: rootShouldForwardProp$1
  });
  function getThemeProps(params) {
    const {
      theme,
      name,
      props
    } = params;
    if (!theme || !theme.components || !theme.components[name] || !theme.components[name].defaultProps) {
      return props;
    }
    return resolveProps$1(theme.components[name].defaultProps, props);
  }
  function isObjectEmpty$1(obj) {
    return Object.keys(obj).length === 0;
  }
  function useTheme$4(defaultTheme2 = null) {
    const contextTheme = React$1__namespace.useContext(ThemeContext$2);
    return !contextTheme || isObjectEmpty$1(contextTheme) ? defaultTheme2 : contextTheme;
  }
  const systemDefaultTheme = createTheme$2();
  function useTheme$3(defaultTheme2 = systemDefaultTheme) {
    return useTheme$4(defaultTheme2);
  }
  function useThemeProps$2({
    props,
    name,
    defaultTheme: defaultTheme2,
    themeId
  }) {
    let theme = useTheme$3(defaultTheme2);
    if (themeId) {
      theme = theme[themeId] || theme;
    }
    const mergedProps = getThemeProps({
      theme,
      name,
      props
    });
    return mergedProps;
  }
  function useThemeProps$1({
    props,
    name
  }) {
    return useThemeProps$2({
      props,
      name,
      defaultTheme: defaultTheme$2,
      themeId: THEME_ID
    });
  }
  function setRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  }
  function useForkRef(...refs) {
    return React$1__namespace.useMemo(() => {
      if (refs.every((ref) => ref == null)) {
        return null;
      }
      return (instance) => {
        refs.forEach((ref) => {
          setRef(ref, instance);
        });
      };
    }, refs);
  }
  const useEnhancedEffect = typeof window !== "undefined" ? React$1__namespace.useLayoutEffect : React$1__namespace.useEffect;
  function useEventCallback(fn2) {
    const ref = React$1__namespace.useRef(fn2);
    useEnhancedEffect(() => {
      ref.current = fn2;
    });
    return React$1__namespace.useRef((...args) => (
      // @ts-expect-error hide `this`
      (0, ref.current)(...args)
    )).current;
  }
  const UNINITIALIZED = {};
  function useLazyRef(init, initArg) {
    const ref = React$1__namespace.useRef(UNINITIALIZED);
    if (ref.current === UNINITIALIZED) {
      ref.current = init(initArg);
    }
    return ref;
  }
  const EMPTY = [];
  function useOnMount(fn2) {
    React$1__namespace.useEffect(fn2, EMPTY);
  }
  class Timeout {
    constructor() {
      this.currentId = null;
      this.clear = () => {
        if (this.currentId !== null) {
          clearTimeout(this.currentId);
          this.currentId = null;
        }
      };
      this.disposeEffect = () => {
        return this.clear;
      };
    }
    static create() {
      return new Timeout();
    }
    /**
     * Executes `fn` after `delay`, clearing any previously scheduled call.
     */
    start(delay, fn2) {
      this.clear();
      this.currentId = setTimeout(() => {
        this.currentId = null;
        fn2();
      }, delay);
    }
  }
  function useTimeout() {
    const timeout = useLazyRef(Timeout.create).current;
    useOnMount(timeout.disposeEffect);
    return timeout;
  }
  let hadKeyboardEvent = true;
  let hadFocusVisibleRecently = false;
  const hadFocusVisibleRecentlyTimeout = new Timeout();
  const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    "datetime-local": true
  };
  function focusTriggersKeyboardModality(node2) {
    const {
      type,
      tagName
    } = node2;
    if (tagName === "INPUT" && inputTypesWhitelist[type] && !node2.readOnly) {
      return true;
    }
    if (tagName === "TEXTAREA" && !node2.readOnly) {
      return true;
    }
    if (node2.isContentEditable) {
      return true;
    }
    return false;
  }
  function handleKeyDown(event) {
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }
    hadKeyboardEvent = true;
  }
  function handlePointerDown() {
    hadKeyboardEvent = false;
  }
  function handleVisibilityChange() {
    if (this.visibilityState === "hidden") {
      if (hadFocusVisibleRecently) {
        hadKeyboardEvent = true;
      }
    }
  }
  function prepare(doc) {
    doc.addEventListener("keydown", handleKeyDown, true);
    doc.addEventListener("mousedown", handlePointerDown, true);
    doc.addEventListener("pointerdown", handlePointerDown, true);
    doc.addEventListener("touchstart", handlePointerDown, true);
    doc.addEventListener("visibilitychange", handleVisibilityChange, true);
  }
  function isFocusVisible(event) {
    const {
      target
    } = event;
    try {
      return target.matches(":focus-visible");
    } catch (error) {
    }
    return hadKeyboardEvent || focusTriggersKeyboardModality(target);
  }
  function useIsFocusVisible() {
    const ref = React$1__namespace.useCallback((node2) => {
      if (node2 != null) {
        prepare(node2.ownerDocument);
      }
    }, []);
    const isFocusVisibleRef = React$1__namespace.useRef(false);
    function handleBlurVisible() {
      if (isFocusVisibleRef.current) {
        hadFocusVisibleRecently = true;
        hadFocusVisibleRecentlyTimeout.start(100, () => {
          hadFocusVisibleRecently = false;
        });
        isFocusVisibleRef.current = false;
        return true;
      }
      return false;
    }
    function handleFocusVisible(event) {
      if (isFocusVisible(event)) {
        isFocusVisibleRef.current = true;
        return true;
      }
      return false;
    }
    return {
      isFocusVisibleRef,
      onFocus: handleFocusVisible,
      onBlur: handleBlurVisible,
      ref
    };
  }
  function _setPrototypeOf(o, p2) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p3) {
      o2.__proto__ = p3;
      return o2;
    };
    return _setPrototypeOf(o, p2);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  const config = {
    disabled: false
  };
  const TransitionGroupContext = React$1.createContext(null);
  var forceReflow = function forceReflow2(node2) {
    return node2.scrollTop;
  };
  var UNMOUNTED = "unmounted";
  var EXITED = "exited";
  var ENTERING = "entering";
  var ENTERED = "entered";
  var EXITING = "exiting";
  var Transition = /* @__PURE__ */ function(_React$Component) {
    _inheritsLoose(Transition2, _React$Component);
    function Transition2(props, context) {
      var _this;
      _this = _React$Component.call(this, props, context) || this;
      var parentGroup = context;
      var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
      var initialStatus;
      _this.appearStatus = null;
      if (props.in) {
        if (appear) {
          initialStatus = EXITED;
          _this.appearStatus = ENTERING;
        } else {
          initialStatus = ENTERED;
        }
      } else {
        if (props.unmountOnExit || props.mountOnEnter) {
          initialStatus = UNMOUNTED;
        } else {
          initialStatus = EXITED;
        }
      }
      _this.state = {
        status: initialStatus
      };
      _this.nextCallback = null;
      return _this;
    }
    Transition2.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
      var nextIn = _ref.in;
      if (nextIn && prevState.status === UNMOUNTED) {
        return {
          status: EXITED
        };
      }
      return null;
    };
    var _proto = Transition2.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this.updateStatus(true, this.appearStatus);
    };
    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      var nextStatus = null;
      if (prevProps !== this.props) {
        var status = this.state.status;
        if (this.props.in) {
          if (status !== ENTERING && status !== ENTERED) {
            nextStatus = ENTERING;
          }
        } else {
          if (status === ENTERING || status === ENTERED) {
            nextStatus = EXITING;
          }
        }
      }
      this.updateStatus(false, nextStatus);
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.cancelNextCallback();
    };
    _proto.getTimeouts = function getTimeouts() {
      var timeout2 = this.props.timeout;
      var exit, enter, appear;
      exit = enter = appear = timeout2;
      if (timeout2 != null && typeof timeout2 !== "number") {
        exit = timeout2.exit;
        enter = timeout2.enter;
        appear = timeout2.appear !== void 0 ? timeout2.appear : enter;
      }
      return {
        exit,
        enter,
        appear
      };
    };
    _proto.updateStatus = function updateStatus(mounting, nextStatus) {
      if (mounting === void 0) {
        mounting = false;
      }
      if (nextStatus !== null) {
        this.cancelNextCallback();
        if (nextStatus === ENTERING) {
          if (this.props.unmountOnExit || this.props.mountOnEnter) {
            var node2 = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM__default.findDOMNode(this);
            if (node2)
              forceReflow(node2);
          }
          this.performEnter(mounting);
        } else {
          this.performExit();
        }
      } else if (this.props.unmountOnExit && this.state.status === EXITED) {
        this.setState({
          status: UNMOUNTED
        });
      }
    };
    _proto.performEnter = function performEnter(mounting) {
      var _this2 = this;
      var enter = this.props.enter;
      var appearing = this.context ? this.context.isMounting : mounting;
      var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM__default.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
      var timeouts = this.getTimeouts();
      var enterTimeout = appearing ? timeouts.appear : timeouts.enter;
      if (!mounting && !enter || config.disabled) {
        this.safeSetState({
          status: ENTERED
        }, function() {
          _this2.props.onEntered(maybeNode);
        });
        return;
      }
      this.props.onEnter(maybeNode, maybeAppearing);
      this.safeSetState({
        status: ENTERING
      }, function() {
        _this2.props.onEntering(maybeNode, maybeAppearing);
        _this2.onTransitionEnd(enterTimeout, function() {
          _this2.safeSetState({
            status: ENTERED
          }, function() {
            _this2.props.onEntered(maybeNode, maybeAppearing);
          });
        });
      });
    };
    _proto.performExit = function performExit() {
      var _this3 = this;
      var exit = this.props.exit;
      var timeouts = this.getTimeouts();
      var maybeNode = this.props.nodeRef ? void 0 : ReactDOM__default.findDOMNode(this);
      if (!exit || config.disabled) {
        this.safeSetState({
          status: EXITED
        }, function() {
          _this3.props.onExited(maybeNode);
        });
        return;
      }
      this.props.onExit(maybeNode);
      this.safeSetState({
        status: EXITING
      }, function() {
        _this3.props.onExiting(maybeNode);
        _this3.onTransitionEnd(timeouts.exit, function() {
          _this3.safeSetState({
            status: EXITED
          }, function() {
            _this3.props.onExited(maybeNode);
          });
        });
      });
    };
    _proto.cancelNextCallback = function cancelNextCallback() {
      if (this.nextCallback !== null) {
        this.nextCallback.cancel();
        this.nextCallback = null;
      }
    };
    _proto.safeSetState = function safeSetState(nextState, callback) {
      callback = this.setNextCallback(callback);
      this.setState(nextState, callback);
    };
    _proto.setNextCallback = function setNextCallback(callback) {
      var _this4 = this;
      var active = true;
      this.nextCallback = function(event) {
        if (active) {
          active = false;
          _this4.nextCallback = null;
          callback(event);
        }
      };
      this.nextCallback.cancel = function() {
        active = false;
      };
      return this.nextCallback;
    };
    _proto.onTransitionEnd = function onTransitionEnd(timeout2, handler) {
      this.setNextCallback(handler);
      var node2 = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM__default.findDOMNode(this);
      var doesNotHaveTimeoutOrListener = timeout2 == null && !this.props.addEndListener;
      if (!node2 || doesNotHaveTimeoutOrListener) {
        setTimeout(this.nextCallback, 0);
        return;
      }
      if (this.props.addEndListener) {
        var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node2, this.nextCallback], maybeNode = _ref3[0], maybeNextCallback = _ref3[1];
        this.props.addEndListener(maybeNode, maybeNextCallback);
      }
      if (timeout2 != null) {
        setTimeout(this.nextCallback, timeout2);
      }
    };
    _proto.render = function render() {
      var status = this.state.status;
      if (status === UNMOUNTED) {
        return null;
      }
      var _this$props = this.props, children = _this$props.children;
      _this$props.in;
      _this$props.mountOnEnter;
      _this$props.unmountOnExit;
      _this$props.appear;
      _this$props.enter;
      _this$props.exit;
      _this$props.timeout;
      _this$props.addEndListener;
      _this$props.onEnter;
      _this$props.onEntering;
      _this$props.onEntered;
      _this$props.onExit;
      _this$props.onExiting;
      _this$props.onExited;
      _this$props.nodeRef;
      var childProps = _objectWithoutPropertiesLoose(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
      return (
        // allows for nested Transitions
        /* @__PURE__ */ React$1.createElement(TransitionGroupContext.Provider, {
          value: null
        }, typeof children === "function" ? children(status, childProps) : React$1.cloneElement(React$1.Children.only(children), childProps))
      );
    };
    return Transition2;
  }(React$1.Component);
  Transition.contextType = TransitionGroupContext;
  Transition.propTypes = {};
  function noop() {
  }
  Transition.defaultProps = {
    in: false,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    enter: true,
    exit: true,
    onEnter: noop,
    onEntering: noop,
    onEntered: noop,
    onExit: noop,
    onExiting: noop,
    onExited: noop
  };
  Transition.UNMOUNTED = UNMOUNTED;
  Transition.EXITED = EXITED;
  Transition.ENTERING = ENTERING;
  Transition.ENTERED = ENTERED;
  Transition.EXITING = EXITING;
  const Transition$1 = Transition;
  function _assertThisInitialized(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function getChildMapping(children, mapFn) {
    var mapper = function mapper2(child) {
      return mapFn && React$1.isValidElement(child) ? mapFn(child) : child;
    };
    var result = /* @__PURE__ */ Object.create(null);
    if (children)
      React$1.Children.map(children, function(c2) {
        return c2;
      }).forEach(function(child) {
        result[child.key] = mapper(child);
      });
    return result;
  }
  function mergeChildMappings(prev2, next2) {
    prev2 = prev2 || {};
    next2 = next2 || {};
    function getValueForKey(key) {
      return key in next2 ? next2[key] : prev2[key];
    }
    var nextKeysPending = /* @__PURE__ */ Object.create(null);
    var pendingKeys = [];
    for (var prevKey in prev2) {
      if (prevKey in next2) {
        if (pendingKeys.length) {
          nextKeysPending[prevKey] = pendingKeys;
          pendingKeys = [];
        }
      } else {
        pendingKeys.push(prevKey);
      }
    }
    var i;
    var childMapping = {};
    for (var nextKey in next2) {
      if (nextKeysPending[nextKey]) {
        for (i = 0; i < nextKeysPending[nextKey].length; i++) {
          var pendingNextKey = nextKeysPending[nextKey][i];
          childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
        }
      }
      childMapping[nextKey] = getValueForKey(nextKey);
    }
    for (i = 0; i < pendingKeys.length; i++) {
      childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }
    return childMapping;
  }
  function getProp(child, prop, props) {
    return props[prop] != null ? props[prop] : child.props[prop];
  }
  function getInitialChildMapping(props, onExited) {
    return getChildMapping(props.children, function(child) {
      return React$1.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: true,
        appear: getProp(child, "appear", props),
        enter: getProp(child, "enter", props),
        exit: getProp(child, "exit", props)
      });
    });
  }
  function getNextChildMapping(nextProps, prevChildMapping, onExited) {
    var nextChildMapping = getChildMapping(nextProps.children);
    var children = mergeChildMappings(prevChildMapping, nextChildMapping);
    Object.keys(children).forEach(function(key) {
      var child = children[key];
      if (!React$1.isValidElement(child))
        return;
      var hasPrev = key in prevChildMapping;
      var hasNext = key in nextChildMapping;
      var prevChild = prevChildMapping[key];
      var isLeaving = React$1.isValidElement(prevChild) && !prevChild.props.in;
      if (hasNext && (!hasPrev || isLeaving)) {
        children[key] = React$1.cloneElement(child, {
          onExited: onExited.bind(null, child),
          in: true,
          exit: getProp(child, "exit", nextProps),
          enter: getProp(child, "enter", nextProps)
        });
      } else if (!hasNext && hasPrev && !isLeaving) {
        children[key] = React$1.cloneElement(child, {
          in: false
        });
      } else if (hasNext && hasPrev && React$1.isValidElement(prevChild)) {
        children[key] = React$1.cloneElement(child, {
          onExited: onExited.bind(null, child),
          in: prevChild.props.in,
          exit: getProp(child, "exit", nextProps),
          enter: getProp(child, "enter", nextProps)
        });
      }
    });
    return children;
  }
  var values = Object.values || function(obj) {
    return Object.keys(obj).map(function(k2) {
      return obj[k2];
    });
  };
  var defaultProps = {
    component: "div",
    childFactory: function childFactory(child) {
      return child;
    }
  };
  var TransitionGroup = /* @__PURE__ */ function(_React$Component) {
    _inheritsLoose(TransitionGroup2, _React$Component);
    function TransitionGroup2(props, context) {
      var _this;
      _this = _React$Component.call(this, props, context) || this;
      var handleExited = _this.handleExited.bind(_assertThisInitialized(_this));
      _this.state = {
        contextValue: {
          isMounting: true
        },
        handleExited,
        firstRender: true
      };
      return _this;
    }
    var _proto = TransitionGroup2.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this.mounted = true;
      this.setState({
        contextValue: {
          isMounting: false
        }
      });
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.mounted = false;
    };
    TransitionGroup2.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
      var prevChildMapping = _ref.children, handleExited = _ref.handleExited, firstRender = _ref.firstRender;
      return {
        children: firstRender ? getInitialChildMapping(nextProps, handleExited) : getNextChildMapping(nextProps, prevChildMapping, handleExited),
        firstRender: false
      };
    };
    _proto.handleExited = function handleExited(child, node2) {
      var currentChildMapping = getChildMapping(this.props.children);
      if (child.key in currentChildMapping)
        return;
      if (child.props.onExited) {
        child.props.onExited(node2);
      }
      if (this.mounted) {
        this.setState(function(state) {
          var children = _extends$1({}, state.children);
          delete children[child.key];
          return {
            children
          };
        });
      }
    };
    _proto.render = function render() {
      var _this$props = this.props, Component = _this$props.component, childFactory2 = _this$props.childFactory, props = _objectWithoutPropertiesLoose(_this$props, ["component", "childFactory"]);
      var contextValue = this.state.contextValue;
      var children = values(this.state.children).map(childFactory2);
      delete props.appear;
      delete props.enter;
      delete props.exit;
      if (Component === null) {
        return /* @__PURE__ */ React$1.createElement(TransitionGroupContext.Provider, {
          value: contextValue
        }, children);
      }
      return /* @__PURE__ */ React$1.createElement(TransitionGroupContext.Provider, {
        value: contextValue
      }, /* @__PURE__ */ React$1.createElement(Component, props, children));
    };
    return TransitionGroup2;
  }(React$1.Component);
  TransitionGroup.propTypes = {};
  TransitionGroup.defaultProps = defaultProps;
  const TransitionGroup$1 = TransitionGroup;
  function GlobalStyles$2({
    styles: styles2,
    themeId,
    defaultTheme: defaultTheme2 = {}
  }) {
    const upperTheme = useTheme$3(defaultTheme2);
    const globalStyles = typeof styles2 === "function" ? styles2(themeId ? upperTheme[themeId] || upperTheme : upperTheme) : styles2;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalStyles$3, {
      styles: globalStyles
    });
  }
  const _excluded$S = ["className", "component"];
  function createBox(options = {}) {
    const {
      themeId,
      defaultTheme: defaultTheme2,
      defaultClassName = "MuiBox-root",
      generateClassName
    } = options;
    const BoxRoot2 = styled$1("div", {
      shouldForwardProp: (prop) => prop !== "theme" && prop !== "sx" && prop !== "as"
    })(styleFunctionSx$2);
    const Box2 = /* @__PURE__ */ React$1__namespace.forwardRef(function Box3(inProps, ref) {
      const theme = useTheme$3(defaultTheme2);
      const _extendSxProp = extendSxProp(inProps), {
        className,
        component = "div"
      } = _extendSxProp, other = _objectWithoutPropertiesLoose(_extendSxProp, _excluded$S);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(BoxRoot2, _extends$1({
        as: component,
        ref,
        className: clsx(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
        theme: themeId ? theme[themeId] || theme : theme
      }, other));
    });
    return Box2;
  }
  function generateUtilityClasses$2(componentName, slots, globalStatePrefix = "Mui") {
    const result = {};
    slots.forEach((slot) => {
      result[slot] = generateUtilityClass$2(componentName, slot, globalStatePrefix);
    });
    return result;
  }
  function useMediaQueryOld(query, defaultMatches, matchMedia, ssrMatchMedia, noSsr) {
    const [match2, setMatch] = React$1__namespace.useState(() => {
      if (noSsr && matchMedia) {
        return matchMedia(query).matches;
      }
      if (ssrMatchMedia) {
        return ssrMatchMedia(query).matches;
      }
      return defaultMatches;
    });
    useEnhancedEffect(() => {
      let active = true;
      if (!matchMedia) {
        return void 0;
      }
      const queryList = matchMedia(query);
      const updateMatch = () => {
        if (active) {
          setMatch(queryList.matches);
        }
      };
      updateMatch();
      queryList.addListener(updateMatch);
      return () => {
        active = false;
        queryList.removeListener(updateMatch);
      };
    }, [query, matchMedia]);
    return match2;
  }
  const maybeReactUseSyncExternalStore = React$1__namespace["useSyncExternalStore"];
  function useMediaQueryNew(query, defaultMatches, matchMedia, ssrMatchMedia, noSsr) {
    const getDefaultSnapshot = React$1__namespace.useCallback(() => defaultMatches, [defaultMatches]);
    const getServerSnapshot = React$1__namespace.useMemo(() => {
      if (noSsr && matchMedia) {
        return () => matchMedia(query).matches;
      }
      if (ssrMatchMedia !== null) {
        const {
          matches
        } = ssrMatchMedia(query);
        return () => matches;
      }
      return getDefaultSnapshot;
    }, [getDefaultSnapshot, query, ssrMatchMedia, noSsr, matchMedia]);
    const [getSnapshot, subscribe] = React$1__namespace.useMemo(() => {
      if (matchMedia === null) {
        return [getDefaultSnapshot, () => () => {
        }];
      }
      const mediaQueryList = matchMedia(query);
      return [() => mediaQueryList.matches, (notify) => {
        mediaQueryList.addListener(notify);
        return () => {
          mediaQueryList.removeListener(notify);
        };
      }];
    }, [getDefaultSnapshot, matchMedia, query]);
    const match2 = maybeReactUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return match2;
  }
  function useMediaQuery(queryInput, options = {}) {
    const theme = useTheme$4();
    const supportMatchMedia = typeof window !== "undefined" && typeof window.matchMedia !== "undefined";
    const {
      defaultMatches = false,
      matchMedia = supportMatchMedia ? window.matchMedia : null,
      ssrMatchMedia = null,
      noSsr = false
    } = getThemeProps({
      name: "MuiUseMediaQuery",
      props: options,
      theme
    });
    let query = typeof queryInput === "function" ? queryInput(theme) : queryInput;
    query = query.replace(/^@media( ?)/m, "");
    const useMediaQueryImplementation = maybeReactUseSyncExternalStore !== void 0 ? useMediaQueryNew : useMediaQueryOld;
    const match2 = useMediaQueryImplementation(query, defaultMatches, matchMedia, ssrMatchMedia, noSsr);
    return match2;
  }
  function clampWrapper(value, min2 = 0, max2 = 1) {
    return clamp$1(value, min2, max2);
  }
  function hexToRgb$1(color2) {
    color2 = color2.slice(1);
    const re = new RegExp(`.{1,${color2.length >= 6 ? 2 : 1}}`, "g");
    let colors = color2.match(re);
    if (colors && colors[0].length === 1) {
      colors = colors.map((n2) => n2 + n2);
    }
    return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n2, index) => {
    return index < 3 ? parseInt(n2, 16) : Math.round(parseInt(n2, 16) / 255 * 1e3) / 1e3;
  }).join(", ")})` : "";
  }
  function decomposeColor(color2) {
    if (color2.type) {
      return color2;
    }
    if (color2.charAt(0) === "#") {
      return decomposeColor(hexToRgb$1(color2));
    }
    const marker = color2.indexOf("(");
    const type = color2.substring(0, marker);
    if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
      throw new Error(formatMuiErrorMessage$1(9, color2));
    }
    let values2 = color2.substring(marker + 1, color2.length - 1);
    let colorSpace;
    if (type === "color") {
      values2 = values2.split(" ");
      colorSpace = values2.shift();
      if (values2.length === 4 && values2[3].charAt(0) === "/") {
        values2[3] = values2[3].slice(1);
      }
      if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(colorSpace) === -1) {
        throw new Error(formatMuiErrorMessage$1(10, colorSpace));
      }
    } else {
      values2 = values2.split(",");
    }
    values2 = values2.map((value) => parseFloat(value));
    return {
      type,
      values: values2,
      colorSpace
    };
  }
  function recomposeColor(color2) {
    const {
      type,
      colorSpace
    } = color2;
    let {
      values: values2
    } = color2;
    if (type.indexOf("rgb") !== -1) {
      values2 = values2.map((n2, i) => i < 3 ? parseInt(n2, 10) : n2);
    } else if (type.indexOf("hsl") !== -1) {
      values2[1] = `${values2[1]}%`;
      values2[2] = `${values2[2]}%`;
    }
    if (type.indexOf("color") !== -1) {
      values2 = `${colorSpace} ${values2.join(" ")}`;
    } else {
      values2 = `${values2.join(", ")}`;
    }
    return `${type}(${values2})`;
  }
  function alpha(color2, value) {
    color2 = decomposeColor(color2);
    value = clampWrapper(value);
    if (color2.type === "rgb" || color2.type === "hsl") {
      color2.type += "a";
    }
    if (color2.type === "color") {
      color2.values[3] = `/${value}`;
    } else {
      color2.values[3] = value;
    }
    return recomposeColor(color2);
  }
  function createChainedFunction(...funcs) {
    return funcs.reduce((acc, func) => {
      if (func == null) {
        return acc;
      }
      return function chainedFunction(...args) {
        acc.apply(this, args);
        func.apply(this, args);
      };
    }, () => {
    });
  }
  function debounce$1(func, wait = 166) {
    let timeout;
    function debounced(...args) {
      const later = () => {
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
    debounced.clear = () => {
      clearTimeout(timeout);
    };
    return debounced;
  }
  function deprecatedPropType(validator, reason) {
    {
      return () => null;
    }
  }
  function isMuiElement(element, muiNames) {
    var _muiName, _element$type;
    return /* @__PURE__ */ React$1__namespace.isValidElement(element) && muiNames.indexOf(
      // For server components `muiName` is avaialble in element.type._payload.value.muiName
      // relevant info - https://github.com/facebook/react/blob/2807d781a08db8e9873687fccc25c0f12b4fb3d4/packages/react/src/ReactLazy.js#L45
      // eslint-disable-next-line no-underscore-dangle
      (_muiName = element.type.muiName) != null ? _muiName : (_element$type = element.type) == null || (_element$type = _element$type._payload) == null || (_element$type = _element$type.value) == null ? void 0 : _element$type.muiName
    ) !== -1;
  }
  function ownerDocument(node2) {
    return node2 && node2.ownerDocument || document;
  }
  function ownerWindow(node2) {
    const doc = ownerDocument(node2);
    return doc.defaultView || window;
  }
  function requirePropFactory(componentNameInError, Component) {
    {
      return () => null;
    }
  }
  let globalId = 0;
  function useGlobalId(idOverride) {
    const [defaultId, setDefaultId] = React$1__namespace.useState(idOverride);
    const id = idOverride || defaultId;
    React$1__namespace.useEffect(() => {
      if (defaultId == null) {
        globalId += 1;
        setDefaultId(`mui-${globalId}`);
      }
    }, [defaultId]);
    return id;
  }
  const maybeReactUseId = React$1__namespace["useId".toString()];
  function useId(idOverride) {
    if (maybeReactUseId !== void 0) {
      const reactId = maybeReactUseId();
      return idOverride != null ? idOverride : reactId;
    }
    return useGlobalId(idOverride);
  }
  function unsupportedProp(props, propName, componentName, location, propFullName) {
    {
      return null;
    }
  }
  function useControlled({
    controlled,
    default: defaultProp,
    name,
    state = "value"
  }) {
    const {
      current: isControlled
    } = React$1__namespace.useRef(controlled !== void 0);
    const [valueState, setValue] = React$1__namespace.useState(defaultProp);
    const value = isControlled ? controlled : valueState;
    const setValueIfUncontrolled = React$1__namespace.useCallback((newValue) => {
      if (!isControlled) {
        setValue(newValue);
      }
    }, []);
    return [value, setValueIfUncontrolled];
  }
  function getScrollbarSize(doc) {
    const documentWidth = doc.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  const usePreviousProps = (value) => {
    const ref = React$1__namespace.useRef({});
    React$1__namespace.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const ThemeContext = /* @__PURE__ */ React$1__namespace.createContext(null);
  const ThemeContext$1 = ThemeContext;
  function useTheme$2() {
    const theme = React$1__namespace.useContext(ThemeContext$1);
    return theme;
  }
  const hasSymbol = typeof Symbol === "function" && Symbol.for;
  const nested = hasSymbol ? Symbol.for("mui.nested") : "__THEME_NESTED__";
  function mergeOuterLocalTheme(outerTheme, localTheme) {
    if (typeof localTheme === "function") {
      const mergedTheme = localTheme(outerTheme);
      return mergedTheme;
    }
    return _extends$1({}, outerTheme, localTheme);
  }
  function ThemeProvider$3(props) {
    const {
      children,
      theme: localTheme
    } = props;
    const outerTheme = useTheme$2();
    const theme = React$1__namespace.useMemo(() => {
      const output = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);
      if (output != null) {
        output[nested] = outerTheme !== null;
      }
      return output;
    }, [localTheme, outerTheme]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext$1.Provider, {
      value: theme,
      children
    });
  }
  const EMPTY_THEME = {};
  function useThemeScoping(themeId, upperTheme, localTheme, isPrivate = false) {
    return React$1__namespace.useMemo(() => {
      const resolvedTheme = themeId ? upperTheme[themeId] || upperTheme : upperTheme;
      if (typeof localTheme === "function") {
        const mergedTheme = localTheme(resolvedTheme);
        const result = themeId ? _extends$1({}, upperTheme, {
          [themeId]: mergedTheme
        }) : mergedTheme;
        if (isPrivate) {
          return () => result;
        }
        return result;
      }
      return themeId ? _extends$1({}, upperTheme, {
        [themeId]: localTheme
      }) : _extends$1({}, upperTheme, localTheme);
    }, [themeId, upperTheme, localTheme, isPrivate]);
  }
  function ThemeProvider$2(props) {
    const {
      children,
      theme: localTheme,
      themeId
    } = props;
    const upperTheme = useTheme$4(EMPTY_THEME);
    const upperPrivateTheme = useTheme$2() || EMPTY_THEME;
    const engineTheme = useThemeScoping(themeId, upperTheme, localTheme);
    const privateTheme = useThemeScoping(themeId, upperPrivateTheme, localTheme, true);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider$3, {
      theme: privateTheme,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext$2.Provider, {
        value: engineTheme,
        children
      })
    });
  }
  function Ripple(props) {
    const {
      className,
      classes,
      pulsate = false,
      rippleX,
      rippleY,
      rippleSize,
      in: inProp,
      onExited,
      timeout
    } = props;
    const [leaving, setLeaving] = React$1__namespace.useState(false);
    const rippleClassName = clsx(className, classes.ripple, classes.rippleVisible, pulsate && classes.ripplePulsate);
    const rippleStyles = {
      width: rippleSize,
      height: rippleSize,
      top: -(rippleSize / 2) + rippleY,
      left: -(rippleSize / 2) + rippleX
    };
    const childClassName = clsx(classes.child, leaving && classes.childLeaving, pulsate && classes.childPulsate);
    if (!inProp && !leaving) {
      setLeaving(true);
    }
    React$1__namespace.useEffect(() => {
      if (!inProp && onExited != null) {
        const timeoutId = setTimeout(onExited, timeout);
        return () => {
          clearTimeout(timeoutId);
        };
      }
      return void 0;
    }, [onExited, inProp, timeout]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
      className: rippleClassName,
      style: rippleStyles,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        className: childClassName
      })
    });
  }
  const touchRippleClasses = generateUtilityClasses$2("MuiTouchRipple", ["root", "ripple", "rippleVisible", "ripplePulsate", "child", "childLeaving", "childPulsate"]);
  const _excluded$R = ["center", "classes", "className"];
  let _$3 = (t2) => t2, _t$3, _t2$3, _t3$3, _t4$3;
  const DURATION = 550;
  const DELAY_RIPPLE = 80;
  const enterKeyframe = keyframes(_t$3 || (_t$3 = _$3`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`));
  const exitKeyframe = keyframes(_t2$3 || (_t2$3 = _$3`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`));
  const pulsateKeyframe = keyframes(_t3$3 || (_t3$3 = _$3`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`));
  const TouchRippleRoot = styled("span", {
    name: "MuiTouchRipple",
    slot: "Root"
  })({
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: "inherit"
  });
  const TouchRippleRipple = styled(Ripple, {
    name: "MuiTouchRipple",
    slot: "Ripple"
  })(_t4$3 || (_t4$3 = _$3`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`), touchRippleClasses.rippleVisible, enterKeyframe, DURATION, ({
    theme
  }) => theme.transitions.easing.easeInOut, touchRippleClasses.ripplePulsate, ({
    theme
  }) => theme.transitions.duration.shorter, touchRippleClasses.child, touchRippleClasses.childLeaving, exitKeyframe, DURATION, ({
    theme
  }) => theme.transitions.easing.easeInOut, touchRippleClasses.childPulsate, pulsateKeyframe, ({
    theme
  }) => theme.transitions.easing.easeInOut);
  const TouchRipple = /* @__PURE__ */ React$1__namespace.forwardRef(function TouchRipple2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiTouchRipple"
    });
    const {
      center: centerProp = false,
      classes = {},
      className
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$R);
    const [ripples, setRipples] = React$1__namespace.useState([]);
    const nextKey = React$1__namespace.useRef(0);
    const rippleCallback = React$1__namespace.useRef(null);
    React$1__namespace.useEffect(() => {
      if (rippleCallback.current) {
        rippleCallback.current();
        rippleCallback.current = null;
      }
    }, [ripples]);
    const ignoringMouseDown = React$1__namespace.useRef(false);
    const startTimer = useTimeout();
    const startTimerCommit = React$1__namespace.useRef(null);
    const container = React$1__namespace.useRef(null);
    const startCommit = React$1__namespace.useCallback((params) => {
      const {
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize,
        cb
      } = params;
      setRipples((oldRipples) => [...oldRipples, /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRippleRipple, {
        classes: {
          ripple: clsx(classes.ripple, touchRippleClasses.ripple),
          rippleVisible: clsx(classes.rippleVisible, touchRippleClasses.rippleVisible),
          ripplePulsate: clsx(classes.ripplePulsate, touchRippleClasses.ripplePulsate),
          child: clsx(classes.child, touchRippleClasses.child),
          childLeaving: clsx(classes.childLeaving, touchRippleClasses.childLeaving),
          childPulsate: clsx(classes.childPulsate, touchRippleClasses.childPulsate)
        },
        timeout: DURATION,
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize
      }, nextKey.current)]);
      nextKey.current += 1;
      rippleCallback.current = cb;
    }, [classes]);
    const start2 = React$1__namespace.useCallback((event = {}, options = {}, cb = () => {
    }) => {
      const {
        pulsate: pulsate2 = false,
        center = centerProp || options.pulsate,
        fakeElement = false
        // For test purposes
      } = options;
      if ((event == null ? void 0 : event.type) === "mousedown" && ignoringMouseDown.current) {
        ignoringMouseDown.current = false;
        return;
      }
      if ((event == null ? void 0 : event.type) === "touchstart") {
        ignoringMouseDown.current = true;
      }
      const element = fakeElement ? null : container.current;
      const rect = element ? element.getBoundingClientRect() : {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      };
      let rippleX;
      let rippleY;
      let rippleSize;
      if (center || event === void 0 || event.clientX === 0 && event.clientY === 0 || !event.clientX && !event.touches) {
        rippleX = Math.round(rect.width / 2);
        rippleY = Math.round(rect.height / 2);
      } else {
        const {
          clientX,
          clientY
        } = event.touches && event.touches.length > 0 ? event.touches[0] : event;
        rippleX = Math.round(clientX - rect.left);
        rippleY = Math.round(clientY - rect.top);
      }
      if (center) {
        rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
        if (rippleSize % 2 === 0) {
          rippleSize += 1;
        }
      } else {
        const sizeX = Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
        const sizeY = Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
      }
      if (event != null && event.touches) {
        if (startTimerCommit.current === null) {
          startTimerCommit.current = () => {
            startCommit({
              pulsate: pulsate2,
              rippleX,
              rippleY,
              rippleSize,
              cb
            });
          };
          startTimer.start(DELAY_RIPPLE, () => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          });
        }
      } else {
        startCommit({
          pulsate: pulsate2,
          rippleX,
          rippleY,
          rippleSize,
          cb
        });
      }
    }, [centerProp, startCommit, startTimer]);
    const pulsate = React$1__namespace.useCallback(() => {
      start2({}, {
        pulsate: true
      });
    }, [start2]);
    const stop = React$1__namespace.useCallback((event, cb) => {
      startTimer.clear();
      if ((event == null ? void 0 : event.type) === "touchend" && startTimerCommit.current) {
        startTimerCommit.current();
        startTimerCommit.current = null;
        startTimer.start(0, () => {
          stop(event, cb);
        });
        return;
      }
      startTimerCommit.current = null;
      setRipples((oldRipples) => {
        if (oldRipples.length > 0) {
          return oldRipples.slice(1);
        }
        return oldRipples;
      });
      rippleCallback.current = cb;
    }, [startTimer]);
    React$1__namespace.useImperativeHandle(ref, () => ({
      pulsate,
      start: start2,
      stop
    }), [pulsate, start2, stop]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRippleRoot, _extends$1({
      className: clsx(touchRippleClasses.root, classes.root, className),
      ref: container
    }, other, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionGroup$1, {
        component: null,
        exit: true,
        children: ripples
      })
    }));
  });
  const TouchRipple$1 = TouchRipple;
  function getButtonBaseUtilityClass(slot) {
    return generateUtilityClass$2("MuiButtonBase", slot);
  }
  const buttonBaseClasses = generateUtilityClasses$2("MuiButtonBase", ["root", "disabled", "focusVisible"]);
  const _excluded$Q = ["action", "centerRipple", "children", "className", "component", "disabled", "disableRipple", "disableTouchRipple", "focusRipple", "focusVisibleClassName", "LinkComponent", "onBlur", "onClick", "onContextMenu", "onDragLeave", "onFocus", "onFocusVisible", "onKeyDown", "onKeyUp", "onMouseDown", "onMouseLeave", "onMouseUp", "onTouchEnd", "onTouchMove", "onTouchStart", "tabIndex", "TouchRippleProps", "touchRippleRef", "type"];
  const useUtilityClasses$G = (ownerState) => {
    const {
      disabled,
      focusVisible,
      focusVisibleClassName,
      classes
    } = ownerState;
    const slots = {
      root: ["root", disabled && "disabled", focusVisible && "focusVisible"]
    };
    const composedClasses = composeClasses$1(slots, getButtonBaseUtilityClass, classes);
    if (focusVisible && focusVisibleClassName) {
      composedClasses.root += ` ${focusVisibleClassName}`;
    }
    return composedClasses;
  };
  const ButtonBaseRoot = styled("button", {
    name: "MuiButtonBase",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
    backgroundColor: "transparent",
    // Reset default value
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    border: 0,
    margin: 0,
    // Remove the margin in Safari
    borderRadius: 0,
    padding: 0,
    // Remove the padding in Firefox
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    MozAppearance: "none",
    // Reset
    WebkitAppearance: "none",
    // Reset
    textDecoration: "none",
    // So we take precedent over the style of a native <a /> element.
    color: "inherit",
    "&::-moz-focus-inner": {
      borderStyle: "none"
      // Remove Firefox dotted outline.
    },
    [`&.${buttonBaseClasses.disabled}`]: {
      pointerEvents: "none",
      // Disable link interactions
      cursor: "default"
    },
    "@media print": {
      colorAdjust: "exact"
    }
  });
  const ButtonBase = /* @__PURE__ */ React$1__namespace.forwardRef(function ButtonBase2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiButtonBase"
    });
    const {
      action,
      centerRipple = false,
      children,
      className,
      component = "button",
      disabled = false,
      disableRipple = false,
      disableTouchRipple = false,
      focusRipple = false,
      LinkComponent = "a",
      onBlur,
      onClick,
      onContextMenu,
      onDragLeave,
      onFocus,
      onFocusVisible,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      tabIndex = 0,
      TouchRippleProps,
      touchRippleRef,
      type
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$Q);
    const buttonRef = React$1__namespace.useRef(null);
    const rippleRef = React$1__namespace.useRef(null);
    const handleRippleRef = useForkRef(rippleRef, touchRippleRef);
    const {
      isFocusVisibleRef,
      onFocus: handleFocusVisible,
      onBlur: handleBlurVisible,
      ref: focusVisibleRef
    } = useIsFocusVisible();
    const [focusVisible, setFocusVisible] = React$1__namespace.useState(false);
    if (disabled && focusVisible) {
      setFocusVisible(false);
    }
    React$1__namespace.useImperativeHandle(action, () => ({
      focusVisible: () => {
        setFocusVisible(true);
        buttonRef.current.focus();
      }
    }), []);
    const [mountedState, setMountedState] = React$1__namespace.useState(false);
    React$1__namespace.useEffect(() => {
      setMountedState(true);
    }, []);
    const enableTouchRipple = mountedState && !disableRipple && !disabled;
    React$1__namespace.useEffect(() => {
      if (focusVisible && focusRipple && !disableRipple && mountedState) {
        rippleRef.current.pulsate();
      }
    }, [disableRipple, focusRipple, focusVisible, mountedState]);
    function useRippleHandler(rippleAction, eventCallback, skipRippleAction = disableTouchRipple) {
      return useEventCallback((event) => {
        if (eventCallback) {
          eventCallback(event);
        }
        const ignore = skipRippleAction;
        if (!ignore && rippleRef.current) {
          rippleRef.current[rippleAction](event);
        }
        return true;
      });
    }
    const handleMouseDown = useRippleHandler("start", onMouseDown);
    const handleContextMenu = useRippleHandler("stop", onContextMenu);
    const handleDragLeave = useRippleHandler("stop", onDragLeave);
    const handleMouseUp = useRippleHandler("stop", onMouseUp);
    const handleMouseLeave = useRippleHandler("stop", (event) => {
      if (focusVisible) {
        event.preventDefault();
      }
      if (onMouseLeave) {
        onMouseLeave(event);
      }
    });
    const handleTouchStart = useRippleHandler("start", onTouchStart);
    const handleTouchEnd = useRippleHandler("stop", onTouchEnd);
    const handleTouchMove = useRippleHandler("stop", onTouchMove);
    const handleBlur = useRippleHandler("stop", (event) => {
      handleBlurVisible(event);
      if (isFocusVisibleRef.current === false) {
        setFocusVisible(false);
      }
      if (onBlur) {
        onBlur(event);
      }
    }, false);
    const handleFocus = useEventCallback((event) => {
      if (!buttonRef.current) {
        buttonRef.current = event.currentTarget;
      }
      handleFocusVisible(event);
      if (isFocusVisibleRef.current === true) {
        setFocusVisible(true);
        if (onFocusVisible) {
          onFocusVisible(event);
        }
      }
      if (onFocus) {
        onFocus(event);
      }
    });
    const isNonNativeButton = () => {
      const button2 = buttonRef.current;
      return component && component !== "button" && !(button2.tagName === "A" && button2.href);
    };
    const keydownRef = React$1__namespace.useRef(false);
    const handleKeyDown2 = useEventCallback((event) => {
      if (focusRipple && !keydownRef.current && focusVisible && rippleRef.current && event.key === " ") {
        keydownRef.current = true;
        rippleRef.current.stop(event, () => {
          rippleRef.current.start(event);
        });
      }
      if (event.target === event.currentTarget && isNonNativeButton() && event.key === " ") {
        event.preventDefault();
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
      if (event.target === event.currentTarget && isNonNativeButton() && event.key === "Enter" && !disabled) {
        event.preventDefault();
        if (onClick) {
          onClick(event);
        }
      }
    });
    const handleKeyUp = useEventCallback((event) => {
      if (focusRipple && event.key === " " && rippleRef.current && focusVisible && !event.defaultPrevented) {
        keydownRef.current = false;
        rippleRef.current.stop(event, () => {
          rippleRef.current.pulsate(event);
        });
      }
      if (onKeyUp) {
        onKeyUp(event);
      }
      if (onClick && event.target === event.currentTarget && isNonNativeButton() && event.key === " " && !event.defaultPrevented) {
        onClick(event);
      }
    });
    let ComponentProp = component;
    if (ComponentProp === "button" && (other.href || other.to)) {
      ComponentProp = LinkComponent;
    }
    const buttonProps = {};
    if (ComponentProp === "button") {
      buttonProps.type = type === void 0 ? "button" : type;
      buttonProps.disabled = disabled;
    } else {
      if (!other.href && !other.to) {
        buttonProps.role = "button";
      }
      if (disabled) {
        buttonProps["aria-disabled"] = disabled;
      }
    }
    const handleRef = useForkRef(ref, focusVisibleRef, buttonRef);
    const ownerState = _extends$1({}, props, {
      centerRipple,
      component,
      disabled,
      disableRipple,
      disableTouchRipple,
      focusRipple,
      tabIndex,
      focusVisible
    });
    const classes = useUtilityClasses$G(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonBaseRoot, _extends$1({
      as: ComponentProp,
      className: clsx(classes.root, className),
      ownerState,
      onBlur: handleBlur,
      onClick,
      onContextMenu: handleContextMenu,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown2,
      onKeyUp: handleKeyUp,
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onDragLeave: handleDragLeave,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
      onTouchStart: handleTouchStart,
      ref: handleRef,
      tabIndex: disabled ? -1 : tabIndex,
      type
    }, buttonProps, other, {
      children: [children, enableTouchRipple ? (
        /* TouchRipple is only needed client-side, x2 boost on the server. */
        /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRipple$1, _extends$1({
          ref: handleRippleRef,
          center: centerRipple
        }, TouchRippleProps))
      ) : null]
    }));
  });
  const ButtonBase$1 = ButtonBase;
  function getButtonUtilityClass(slot) {
    return generateUtilityClass$2("MuiButton", slot);
  }
  const buttonClasses = generateUtilityClasses$2("MuiButton", ["root", "text", "textInherit", "textPrimary", "textSecondary", "textSuccess", "textError", "textInfo", "textWarning", "outlined", "outlinedInherit", "outlinedPrimary", "outlinedSecondary", "outlinedSuccess", "outlinedError", "outlinedInfo", "outlinedWarning", "contained", "containedInherit", "containedPrimary", "containedSecondary", "containedSuccess", "containedError", "containedInfo", "containedWarning", "disableElevation", "focusVisible", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorSuccess", "colorError", "colorInfo", "colorWarning", "textSizeSmall", "textSizeMedium", "textSizeLarge", "outlinedSizeSmall", "outlinedSizeMedium", "outlinedSizeLarge", "containedSizeSmall", "containedSizeMedium", "containedSizeLarge", "sizeMedium", "sizeSmall", "sizeLarge", "fullWidth", "startIcon", "endIcon", "icon", "iconSizeSmall", "iconSizeMedium", "iconSizeLarge"]);
  const buttonClasses$1 = buttonClasses;
  const ButtonGroupContext = /* @__PURE__ */ React$1__namespace.createContext({});
  const ButtonGroupContext$1 = ButtonGroupContext;
  const ButtonGroupButtonContext = /* @__PURE__ */ React$1__namespace.createContext(void 0);
  const ButtonGroupButtonContext$1 = ButtonGroupButtonContext;
  const _excluded$P = ["children", "color", "component", "className", "disabled", "disableElevation", "disableFocusRipple", "endIcon", "focusVisibleClassName", "fullWidth", "size", "startIcon", "type", "variant"];
  const useUtilityClasses$F = (ownerState) => {
    const {
      color: color2,
      disableElevation,
      fullWidth,
      size,
      variant,
      classes
    } = ownerState;
    const slots = {
      root: ["root", variant, `${variant}${capitalize$1(color2)}`, `size${capitalize$1(size)}`, `${variant}Size${capitalize$1(size)}`, `color${capitalize$1(color2)}`, disableElevation && "disableElevation", fullWidth && "fullWidth"],
      label: ["label"],
      startIcon: ["icon", "startIcon", `iconSize${capitalize$1(size)}`],
      endIcon: ["icon", "endIcon", `iconSize${capitalize$1(size)}`]
    };
    const composedClasses = composeClasses$1(slots, getButtonUtilityClass, classes);
    return _extends$1({}, classes, composedClasses);
  };
  const commonIconStyles = (ownerState) => _extends$1({}, ownerState.size === "small" && {
    "& > *:nth-of-type(1)": {
      fontSize: 18
    }
  }, ownerState.size === "medium" && {
    "& > *:nth-of-type(1)": {
      fontSize: 20
    }
  }, ownerState.size === "large" && {
    "& > *:nth-of-type(1)": {
      fontSize: 22
    }
  });
  const ButtonRoot$1 = styled(ButtonBase$1, {
    shouldForwardProp: (prop) => rootShouldForwardProp$1(prop) || prop === "classes",
    name: "MuiButton",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], styles2[`${ownerState.variant}${capitalize$1(ownerState.color)}`], styles2[`size${capitalize$1(ownerState.size)}`], styles2[`${ownerState.variant}Size${capitalize$1(ownerState.size)}`], ownerState.color === "inherit" && styles2.colorInherit, ownerState.disableElevation && styles2.disableElevation, ownerState.fullWidth && styles2.fullWidth];
    }
  })(({
    theme,
    ownerState
  }) => {
    var _theme$palette$getCon, _theme$palette;
    const inheritContainedBackgroundColor = theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800];
    const inheritContainedHoverBackgroundColor = theme.palette.mode === "light" ? theme.palette.grey.A100 : theme.palette.grey[700];
    return _extends$1({}, theme.typography.button, {
      minWidth: 64,
      padding: "6px 16px",
      borderRadius: (theme.vars || theme).shape.borderRadius,
      transition: theme.transitions.create(["background-color", "box-shadow", "border-color", "color"], {
        duration: theme.transitions.duration.short
      }),
      "&:hover": _extends$1({
        textDecoration: "none",
        backgroundColor: theme.vars ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette.text.primary, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      }, ownerState.variant === "text" && ownerState.color !== "inherit" && {
        backgroundColor: theme.vars ? `rgba(${theme.vars.palette[ownerState.color].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      }, ownerState.variant === "outlined" && ownerState.color !== "inherit" && {
        border: `1px solid ${(theme.vars || theme).palette[ownerState.color].main}`,
        backgroundColor: theme.vars ? `rgba(${theme.vars.palette[ownerState.color].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      }, ownerState.variant === "contained" && {
        backgroundColor: theme.vars ? theme.vars.palette.Button.inheritContainedHoverBg : inheritContainedHoverBackgroundColor,
        boxShadow: (theme.vars || theme).shadows[4],
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          boxShadow: (theme.vars || theme).shadows[2],
          backgroundColor: (theme.vars || theme).palette.grey[300]
        }
      }, ownerState.variant === "contained" && ownerState.color !== "inherit" && {
        backgroundColor: (theme.vars || theme).palette[ownerState.color].dark,
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: (theme.vars || theme).palette[ownerState.color].main
        }
      }),
      "&:active": _extends$1({}, ownerState.variant === "contained" && {
        boxShadow: (theme.vars || theme).shadows[8]
      }),
      [`&.${buttonClasses$1.focusVisible}`]: _extends$1({}, ownerState.variant === "contained" && {
        boxShadow: (theme.vars || theme).shadows[6]
      }),
      [`&.${buttonClasses$1.disabled}`]: _extends$1({
        color: (theme.vars || theme).palette.action.disabled
      }, ownerState.variant === "outlined" && {
        border: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`
      }, ownerState.variant === "contained" && {
        color: (theme.vars || theme).palette.action.disabled,
        boxShadow: (theme.vars || theme).shadows[0],
        backgroundColor: (theme.vars || theme).palette.action.disabledBackground
      })
    }, ownerState.variant === "text" && {
      padding: "6px 8px"
    }, ownerState.variant === "text" && ownerState.color !== "inherit" && {
      color: (theme.vars || theme).palette[ownerState.color].main
    }, ownerState.variant === "outlined" && {
      padding: "5px 15px",
      border: "1px solid currentColor"
    }, ownerState.variant === "outlined" && ownerState.color !== "inherit" && {
      color: (theme.vars || theme).palette[ownerState.color].main,
      border: theme.vars ? `1px solid rgba(${theme.vars.palette[ownerState.color].mainChannel} / 0.5)` : `1px solid ${alpha_1(theme.palette[ownerState.color].main, 0.5)}`
    }, ownerState.variant === "contained" && {
      color: theme.vars ? (
        // this is safe because grey does not change between default light/dark mode
        theme.vars.palette.text.primary
      ) : (_theme$palette$getCon = (_theme$palette = theme.palette).getContrastText) == null ? void 0 : _theme$palette$getCon.call(_theme$palette, theme.palette.grey[300]),
      backgroundColor: theme.vars ? theme.vars.palette.Button.inheritContainedBg : inheritContainedBackgroundColor,
      boxShadow: (theme.vars || theme).shadows[2]
    }, ownerState.variant === "contained" && ownerState.color !== "inherit" && {
      color: (theme.vars || theme).palette[ownerState.color].contrastText,
      backgroundColor: (theme.vars || theme).palette[ownerState.color].main
    }, ownerState.color === "inherit" && {
      color: "inherit",
      borderColor: "currentColor"
    }, ownerState.size === "small" && ownerState.variant === "text" && {
      padding: "4px 5px",
      fontSize: theme.typography.pxToRem(13)
    }, ownerState.size === "large" && ownerState.variant === "text" && {
      padding: "8px 11px",
      fontSize: theme.typography.pxToRem(15)
    }, ownerState.size === "small" && ownerState.variant === "outlined" && {
      padding: "3px 9px",
      fontSize: theme.typography.pxToRem(13)
    }, ownerState.size === "large" && ownerState.variant === "outlined" && {
      padding: "7px 21px",
      fontSize: theme.typography.pxToRem(15)
    }, ownerState.size === "small" && ownerState.variant === "contained" && {
      padding: "4px 10px",
      fontSize: theme.typography.pxToRem(13)
    }, ownerState.size === "large" && ownerState.variant === "contained" && {
      padding: "8px 22px",
      fontSize: theme.typography.pxToRem(15)
    }, ownerState.fullWidth && {
      width: "100%"
    });
  }, ({
    ownerState
  }) => ownerState.disableElevation && {
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none"
    },
    [`&.${buttonClasses$1.focusVisible}`]: {
      boxShadow: "none"
    },
    "&:active": {
      boxShadow: "none"
    },
    [`&.${buttonClasses$1.disabled}`]: {
      boxShadow: "none"
    }
  });
  const ButtonStartIcon = styled("span", {
    name: "MuiButton",
    slot: "StartIcon",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.startIcon, styles2[`iconSize${capitalize$1(ownerState.size)}`]];
    }
  })(({
    ownerState
  }) => _extends$1({
    display: "inherit",
    marginRight: 8,
    marginLeft: -4
  }, ownerState.size === "small" && {
    marginLeft: -2
  }, commonIconStyles(ownerState)));
  const ButtonEndIcon = styled("span", {
    name: "MuiButton",
    slot: "EndIcon",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.endIcon, styles2[`iconSize${capitalize$1(ownerState.size)}`]];
    }
  })(({
    ownerState
  }) => _extends$1({
    display: "inherit",
    marginRight: -4,
    marginLeft: 8
  }, ownerState.size === "small" && {
    marginRight: -2
  }, commonIconStyles(ownerState)));
  const Button$1 = /* @__PURE__ */ React$1__namespace.forwardRef(function Button2(inProps, ref) {
    const contextProps = React$1__namespace.useContext(ButtonGroupContext$1);
    const buttonGroupButtonContextPositionClassName = React$1__namespace.useContext(ButtonGroupButtonContext$1);
    const resolvedProps = resolveProps$1(contextProps, inProps);
    const props = useThemeProps$1({
      props: resolvedProps,
      name: "MuiButton"
    });
    const {
      children,
      color: color2 = "primary",
      component = "button",
      className,
      disabled = false,
      disableElevation = false,
      disableFocusRipple = false,
      endIcon: endIconProp,
      focusVisibleClassName,
      fullWidth = false,
      size = "medium",
      startIcon: startIconProp,
      type,
      variant = "text"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$P);
    const ownerState = _extends$1({}, props, {
      color: color2,
      component,
      disabled,
      disableElevation,
      disableFocusRipple,
      fullWidth,
      size,
      type,
      variant
    });
    const classes = useUtilityClasses$F(ownerState);
    const startIcon = startIconProp && /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonStartIcon, {
      className: classes.startIcon,
      ownerState,
      children: startIconProp
    });
    const endIcon = endIconProp && /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonEndIcon, {
      className: classes.endIcon,
      ownerState,
      children: endIconProp
    });
    const positionClassName = buttonGroupButtonContextPositionClassName || "";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonRoot$1, _extends$1({
      ownerState,
      className: clsx(contextProps.className, classes.root, className, positionClassName),
      component,
      disabled,
      focusRipple: !disableFocusRipple,
      focusVisibleClassName: clsx(classes.focusVisible, focusVisibleClassName),
      ref,
      type
    }, other, {
      classes,
      children: [startIcon, children, endIcon]
    }));
  });
  const Button$2 = Button$1;
  function getUnit(input2) {
    return String(input2).match(/[\d.\-+]*\s*(.*)/)[1] || "";
  }
  function toUnitless(length2) {
    return parseFloat(length2);
  }
  function useTheme$1() {
    const theme = useTheme$3(defaultTheme$2);
    return theme[THEME_ID] || theme;
  }
  const _excluded$O = ["theme"];
  function ThemeProvider$1(_ref) {
    let {
      theme: themeInput
    } = _ref, props = _objectWithoutPropertiesLoose(_ref, _excluded$O);
    const scopedTheme = themeInput[THEME_ID];
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider$2, _extends$1({}, props, {
      themeId: scopedTheme ? THEME_ID : void 0,
      theme: scopedTheme || themeInput
    }));
  }
  const getOverlayAlpha = (elevation) => {
    let alphaValue;
    if (elevation < 1) {
      alphaValue = 5.11916 * elevation ** 2;
    } else {
      alphaValue = 4.5 * Math.log(elevation + 1) + 2;
    }
    return (alphaValue / 100).toFixed(2);
  };
  const ButtonRoot = styled(Button$2, {
    shouldForwardProp: (fieldName) => filterForwardProps(fieldName, ["ownerState"])
  })(({ ownerState, theme }) => {
    const { functions, borders: borders2 } = theme;
    const { size, circular, iconOnly } = ownerState;
    const { pxToRem: pxToRem2 } = functions;
    const { borderRadius: borderRadius2 } = borders2;
    const circularStyles = () => ({
      borderRadius: borderRadius2.section
    });
    const iconOnlyStyles = () => {
      let sizeValue = pxToRem2(38);
      if (size === "small") {
        sizeValue = pxToRem2(25.4);
      } else if (size === "large") {
        sizeValue = pxToRem2(52);
      }
      let paddingValue = `${pxToRem2(11)} ${pxToRem2(11)} ${pxToRem2(10)}`;
      if (size === "small") {
        paddingValue = pxToRem2(4.5);
      } else if (size === "large") {
        paddingValue = pxToRem2(16);
      }
      return {
        width: sizeValue,
        minWidth: sizeValue,
        height: sizeValue,
        minHeight: sizeValue,
        padding: paddingValue,
        "& .material-icons": {
          marginTop: 0
        },
        "&:hover, &:focus, &:active": {
          transform: "none"
        }
      };
    };
    return {
      ...circular && circularStyles(),
      ...iconOnly && iconOnlyStyles()
    };
  });
  const Button = React$1.forwardRef(
    ({
      color: color2 = "info",
      variant = "gradient",
      size = "medium",
      circular = false,
      iconOnly = false,
      children,
      ...restProps
    }, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ButtonRoot,
        {
          ...restProps,
          ref,
          color: color2,
          variant,
          size,
          ownerState: { size, circular, iconOnly },
          children
        }
      );
    }
  );
  const uiConfig = {
    pandoraDrawerWidth: "280px",
    pandoraDrawerMinHeight: "50%",
    pandoraDrawerMaxHeight: "70%"
  };
  const StyledPandoraButton = styled(Button, {
    shouldForwardProp: (fieldName) => filterForwardProps(fieldName, ["openPandora", "buttonVisible", "buttonPosition"])
  })(({ buttonPosition = "right", openPandora = false, buttonVisible = false, theme }) => {
    const { transitions } = theme;
    const baseStyle = {
      position: "fixed"
    };
    switch (buttonPosition) {
      case "top":
        return {
          ...baseStyle,
          left: "50%",
          top: 0,
          transition: transitions.create(["top"], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter
          }),
          ...openPandora && {
            top: uiConfig.pandoraDrawerWidth,
            transition: transitions.create(["top"], {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          }
        };
      case "right":
        return {
          ...baseStyle,
          top: "50%",
          right: 0,
          transform: "translateX(60%) rotate(-90deg)",
          transition: transitions.create(["right", "transform"], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter
          }),
          ...buttonVisible && {
            transform: "translateX(33%) rotate(-90deg)",
            transition: transitions.create(["right", "transform"], {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          },
          ...openPandora && {
            right: uiConfig.pandoraDrawerWidth,
            transform: "translateX(33%) rotate(-90deg)",
            transition: transitions.create(["right", "transform"], {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          }
        };
      case "bottom":
        return {
          ...baseStyle,
          left: "50%",
          bottom: 0,
          transition: transitions.create(["bottom"], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter
          }),
          ...openPandora && {
            left: uiConfig.pandoraDrawerWidth,
            transition: transitions.create(["bottom"], {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          }
        };
      case "left":
        return {
          ...baseStyle,
          top: "50%",
          left: 0,
          transition: transitions.create(["left"], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter
          }),
          ...openPandora && {
            left: uiConfig.pandoraDrawerWidth,
            transition: transitions.create(["left"], {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          }
        };
      default:
        return {
          ...baseStyle,
          top: "50%",
          right: 0,
          transition: transitions.create(["right"], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.shorter
          }),
          ...openPandora && {
            right: uiConfig.pandoraDrawerWidth,
            transition: transitions.create(["right"], {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          }
        };
    }
  });
  function PandoraButton({ openPandora = false, pandoraButtonPosition = "right", ...restProps }) {
    const visibleTimeout = React$1.useRef();
    const [visible, setVisible] = React$1.useState(false);
    const handleMouseEnter = () => {
      clearTimeout(visibleTimeout.current);
      setVisible(true);
    };
    const handleMouseLeave = () => {
      visibleTimeout.current = setTimeout(() => setVisible(false), 1500);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      StyledPandoraButton,
      {
        ...restProps,
        openPandora,
        buttonPosition: pandoraButtonPosition,
        buttonVisible: visible,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        children: openPandora ? "关闭助手" : "打开助手"
      }
    );
  }
  function getTypographyUtilityClass(slot) {
    return generateUtilityClass$2("MuiTypography", slot);
  }
  generateUtilityClasses$2("MuiTypography", ["root", "h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "inherit", "button", "caption", "overline", "alignLeft", "alignRight", "alignCenter", "alignJustify", "noWrap", "gutterBottom", "paragraph"]);
  const _excluded$N = ["align", "className", "component", "gutterBottom", "noWrap", "paragraph", "variant", "variantMapping"];
  const useUtilityClasses$E = (ownerState) => {
    const {
      align,
      gutterBottom,
      noWrap,
      paragraph,
      variant,
      classes
    } = ownerState;
    const slots = {
      root: ["root", variant, ownerState.align !== "inherit" && `align${capitalize$1(align)}`, gutterBottom && "gutterBottom", noWrap && "noWrap", paragraph && "paragraph"]
    };
    return composeClasses$1(slots, getTypographyUtilityClass, classes);
  };
  const TypographyRoot$1 = styled("span", {
    name: "MuiTypography",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.variant && styles2[ownerState.variant], ownerState.align !== "inherit" && styles2[`align${capitalize$1(ownerState.align)}`], ownerState.noWrap && styles2.noWrap, ownerState.gutterBottom && styles2.gutterBottom, ownerState.paragraph && styles2.paragraph];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    margin: 0
  }, ownerState.variant === "inherit" && {
    // Some elements, like <button> on Chrome have default font that doesn't inherit, reset this.
    font: "inherit"
  }, ownerState.variant !== "inherit" && theme.typography[ownerState.variant], ownerState.align !== "inherit" && {
    textAlign: ownerState.align
  }, ownerState.noWrap && {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }, ownerState.gutterBottom && {
    marginBottom: "0.35em"
  }, ownerState.paragraph && {
    marginBottom: 16
  }));
  const defaultVariantMapping = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body1: "p",
    body2: "p",
    inherit: "p"
  };
  const colorTransformations = {
    primary: "primary.main",
    textPrimary: "text.primary",
    secondary: "secondary.main",
    textSecondary: "text.secondary",
    error: "error.main"
  };
  const transformDeprecatedColors = (color2) => {
    return colorTransformations[color2] || color2;
  };
  const Typography$1 = /* @__PURE__ */ React$1__namespace.forwardRef(function Typography2(inProps, ref) {
    const themeProps = useThemeProps$1({
      props: inProps,
      name: "MuiTypography"
    });
    const color2 = transformDeprecatedColors(themeProps.color);
    const props = extendSxProp(_extends$1({}, themeProps, {
      color: color2
    }));
    const {
      align = "inherit",
      className,
      component,
      gutterBottom = false,
      noWrap = false,
      paragraph = false,
      variant = "body1",
      variantMapping = defaultVariantMapping
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$N);
    const ownerState = _extends$1({}, props, {
      align,
      color: color2,
      className,
      component,
      gutterBottom,
      noWrap,
      paragraph,
      variant,
      variantMapping
    });
    const Component = component || (paragraph ? "p" : variantMapping[variant] || defaultVariantMapping[variant]) || "span";
    const classes = useUtilityClasses$E(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TypographyRoot$1, _extends$1({
      as: Component,
      ref,
      ownerState,
      className: clsx(classes.root, className)
    }, other));
  });
  const Typography$2 = Typography$1;
  const TypographyRoot = styled(Typography$2, {
    shouldForwardProp: (fieldName) => filterForwardProps(fieldName, ["ownerState"])
  })(({ theme, ownerState }) => {
    const { palette: palette2, typography: typography2, functions } = theme;
    const isLight = palette2.mode === "light";
    const { color: color2, textTransform, verticalAlign, fontWeight, opacity, textGradient } = ownerState;
    const { gradients, transparent, white } = palette2;
    const { fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold } = typography2;
    const { linearGradient: linearGradient2 } = functions;
    const fontWeights = {
      light: fontWeightLight,
      regular: fontWeightRegular,
      medium: fontWeightMedium,
      bold: fontWeightBold
    };
    const gradientStyles = () => ({
      backgroundImage: color2 !== "inherit" && color2 !== "text" && color2 !== "white" && gradients[color2] ? linearGradient2(gradients[color2].main, gradients[color2].state) : linearGradient2(gradients.dark.main, gradients.dark.state),
      display: "inline-block",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: transparent.main,
      position: "relative",
      zIndex: 1
    });
    let colorValue = color2 === "inherit" || !palette2[color2] ? "inherit" : palette2[color2].main;
    if (!isLight && (color2 === "inherit" || !palette2[color2])) {
      colorValue = "inherit";
    } else if (!isLight && color2 === "dark")
      colorValue = white.main;
    return {
      opacity,
      textTransform,
      verticalAlign,
      textDecoration: "none",
      color: colorValue,
      fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
      ...textGradient && gradientStyles()
    };
  });
  function Typography({
    color: color2 = "dark",
    fontWeight = "regular",
    textTransform = "none",
    verticalAlign = "unset",
    textGradient = false,
    opacity = 1,
    children,
    ...restProps
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TypographyRoot,
      {
        ...restProps,
        ownerState: {
          color: color2,
          textTransform,
          verticalAlign,
          fontWeight,
          opacity,
          textGradient
        },
        children
      }
    );
  }
  function getLinearProgressUtilityClass(slot) {
    return generateUtilityClass$2("MuiLinearProgress", slot);
  }
  const linearProgressClasses = generateUtilityClasses$2("MuiLinearProgress", ["root", "colorPrimary", "colorSecondary", "determinate", "indeterminate", "buffer", "query", "dashed", "dashedColorPrimary", "dashedColorSecondary", "bar", "barColorPrimary", "barColorSecondary", "bar1Indeterminate", "bar1Determinate", "bar1Buffer", "bar2Indeterminate", "bar2Buffer"]);
  const linearProgressClasses$1 = linearProgressClasses;
  const _excluded$M = ["className", "color", "value", "valueBuffer", "variant"];
  let _$2 = (t2) => t2, _t$2, _t2$2, _t3$2, _t4$2, _t5, _t6;
  const TRANSITION_DURATION = 4;
  const indeterminate1Keyframe = keyframes(_t$2 || (_t$2 = _$2`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`));
  const indeterminate2Keyframe = keyframes(_t2$2 || (_t2$2 = _$2`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`));
  const bufferKeyframe = keyframes(_t3$2 || (_t3$2 = _$2`
  0% {
    opacity: 1;
    background-position: 0 -23px;
  }

  60% {
    opacity: 0;
    background-position: 0 -23px;
  }

  100% {
    opacity: 1;
    background-position: -200px -23px;
  }
`));
  const useUtilityClasses$D = (ownerState) => {
    const {
      classes,
      variant,
      color: color2
    } = ownerState;
    const slots = {
      root: ["root", `color${capitalize$1(color2)}`, variant],
      dashed: ["dashed", `dashedColor${capitalize$1(color2)}`],
      bar1: ["bar", `barColor${capitalize$1(color2)}`, (variant === "indeterminate" || variant === "query") && "bar1Indeterminate", variant === "determinate" && "bar1Determinate", variant === "buffer" && "bar1Buffer"],
      bar2: ["bar", variant !== "buffer" && `barColor${capitalize$1(color2)}`, variant === "buffer" && `color${capitalize$1(color2)}`, (variant === "indeterminate" || variant === "query") && "bar2Indeterminate", variant === "buffer" && "bar2Buffer"]
    };
    return composeClasses$1(slots, getLinearProgressUtilityClass, classes);
  };
  const getColorShade = (theme, color2) => {
    if (color2 === "inherit") {
      return "currentColor";
    }
    if (theme.vars) {
      return theme.vars.palette.LinearProgress[`${color2}Bg`];
    }
    return theme.palette.mode === "light" ? lighten_1(theme.palette[color2].main, 0.62) : darken_1(theme.palette[color2].main, 0.5);
  };
  const LinearProgressRoot$1 = styled("span", {
    name: "MuiLinearProgress",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[`color${capitalize$1(ownerState.color)}`], styles2[ownerState.variant]];
    }
  })(({
    ownerState,
    theme
  }) => _extends$1({
    position: "relative",
    overflow: "hidden",
    display: "block",
    height: 4,
    zIndex: 0,
    // Fix Safari's bug during composition of different paint.
    "@media print": {
      colorAdjust: "exact"
    },
    backgroundColor: getColorShade(theme, ownerState.color)
  }, ownerState.color === "inherit" && ownerState.variant !== "buffer" && {
    backgroundColor: "none",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "currentColor",
      opacity: 0.3
    }
  }, ownerState.variant === "buffer" && {
    backgroundColor: "transparent"
  }, ownerState.variant === "query" && {
    transform: "rotate(180deg)"
  }));
  const LinearProgressDashed = styled("span", {
    name: "MuiLinearProgress",
    slot: "Dashed",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.dashed, styles2[`dashedColor${capitalize$1(ownerState.color)}`]];
    }
  })(({
    ownerState,
    theme
  }) => {
    const backgroundColor2 = getColorShade(theme, ownerState.color);
    return _extends$1({
      position: "absolute",
      marginTop: 0,
      height: "100%",
      width: "100%"
    }, ownerState.color === "inherit" && {
      opacity: 0.3
    }, {
      backgroundImage: `radial-gradient(${backgroundColor2} 0%, ${backgroundColor2} 16%, transparent 42%)`,
      backgroundSize: "10px 10px",
      backgroundPosition: "0 -23px"
    });
  }, css(_t4$2 || (_t4$2 = _$2`
    animation: ${0} 3s infinite linear;
  `), bufferKeyframe));
  const LinearProgressBar1 = styled("span", {
    name: "MuiLinearProgress",
    slot: "Bar1",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.bar, styles2[`barColor${capitalize$1(ownerState.color)}`], (ownerState.variant === "indeterminate" || ownerState.variant === "query") && styles2.bar1Indeterminate, ownerState.variant === "determinate" && styles2.bar1Determinate, ownerState.variant === "buffer" && styles2.bar1Buffer];
    }
  })(({
    ownerState,
    theme
  }) => _extends$1({
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    transition: "transform 0.2s linear",
    transformOrigin: "left",
    backgroundColor: ownerState.color === "inherit" ? "currentColor" : (theme.vars || theme).palette[ownerState.color].main
  }, ownerState.variant === "determinate" && {
    transition: `transform .${TRANSITION_DURATION}s linear`
  }, ownerState.variant === "buffer" && {
    zIndex: 1,
    transition: `transform .${TRANSITION_DURATION}s linear`
  }), ({
    ownerState
  }) => (ownerState.variant === "indeterminate" || ownerState.variant === "query") && css(_t5 || (_t5 = _$2`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    `), indeterminate1Keyframe));
  const LinearProgressBar2 = styled("span", {
    name: "MuiLinearProgress",
    slot: "Bar2",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.bar, styles2[`barColor${capitalize$1(ownerState.color)}`], (ownerState.variant === "indeterminate" || ownerState.variant === "query") && styles2.bar2Indeterminate, ownerState.variant === "buffer" && styles2.bar2Buffer];
    }
  })(({
    ownerState,
    theme
  }) => _extends$1({
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    transition: "transform 0.2s linear",
    transformOrigin: "left"
  }, ownerState.variant !== "buffer" && {
    backgroundColor: ownerState.color === "inherit" ? "currentColor" : (theme.vars || theme).palette[ownerState.color].main
  }, ownerState.color === "inherit" && {
    opacity: 0.3
  }, ownerState.variant === "buffer" && {
    backgroundColor: getColorShade(theme, ownerState.color),
    transition: `transform .${TRANSITION_DURATION}s linear`
  }), ({
    ownerState
  }) => (ownerState.variant === "indeterminate" || ownerState.variant === "query") && css(_t6 || (_t6 = _$2`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
    `), indeterminate2Keyframe));
  const LinearProgress$1 = /* @__PURE__ */ React$1__namespace.forwardRef(function LinearProgress2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiLinearProgress"
    });
    const {
      className,
      color: color2 = "primary",
      value,
      valueBuffer,
      variant = "indeterminate"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$M);
    const ownerState = _extends$1({}, props, {
      color: color2,
      variant
    });
    const classes = useUtilityClasses$D(ownerState);
    const theme = useTheme$1();
    const rootProps = {};
    const inlineStyles = {
      bar1: {},
      bar2: {}
    };
    if (variant === "determinate" || variant === "buffer") {
      if (value !== void 0) {
        rootProps["aria-valuenow"] = Math.round(value);
        rootProps["aria-valuemin"] = 0;
        rootProps["aria-valuemax"] = 100;
        let transform = value - 100;
        if (theme.direction === "rtl") {
          transform = -transform;
        }
        inlineStyles.bar1.transform = `translateX(${transform}%)`;
      }
    }
    if (variant === "buffer") {
      if (valueBuffer !== void 0) {
        let transform = (valueBuffer || 0) - 100;
        if (theme.direction === "rtl") {
          transform = -transform;
        }
        inlineStyles.bar2.transform = `translateX(${transform}%)`;
      }
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(LinearProgressRoot$1, _extends$1({
      className: clsx(classes.root, className),
      ownerState,
      role: "progressbar"
    }, rootProps, {
      ref
    }, other, {
      children: [variant === "buffer" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LinearProgressDashed, {
        className: classes.dashed,
        ownerState
      }) : null, /* @__PURE__ */ jsxRuntimeExports.jsx(LinearProgressBar1, {
        className: classes.bar1,
        ownerState,
        style: inlineStyles.bar1
      }), variant === "determinate" ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(LinearProgressBar2, {
        className: classes.bar2,
        ownerState,
        style: inlineStyles.bar2
      })]
    }));
  });
  const LinearProgress$2 = LinearProgress$1;
  const LinearProgressRoot = styled(LinearProgress$2, {
    shouldForwardProp: (fieldName) => filterForwardProps(fieldName, ["ownerState"])
  })(({ theme, ownerState }) => {
    const { palette: palette2, functions } = theme;
    const { color: color2, value, variant } = ownerState;
    const { text, gradients } = palette2;
    const { linearGradient: linearGradient2 } = functions;
    let backgroundValue;
    if (variant === "gradient") {
      backgroundValue = gradients[color2] ? linearGradient2(gradients[color2].main, gradients[color2].state) : linearGradient2(gradients.info.main, gradients.info.state);
    } else {
      backgroundValue = palette2[color2] ? palette2[color2].main : palette2.info.main;
    }
    return {
      [`& .${linearProgressClasses$1.bar}`]: {
        background: backgroundValue,
        width: `${value}%`,
        color: text.main
      }
    };
  });
  function LinearProgress({
    variant = "contained",
    color: color2 = "info",
    value = 0,
    label = false,
    labelPosition = "top",
    labelColor = void 0,
    labelText = void 0,
    ...restProps
  }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      label && labelPosition === "top" && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "button", fontWeight: "medium", color: labelColor || "text", children: labelText || `${value}%` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinearProgressRoot, { ...restProps, variant: "determinate", value, ownerState: { color: color2, value, variant } })
    ] });
  }
  const qsFilter = (selector) => {
    return selector;
  };
  const qsOne = (selectorOrElement, scopedSelector) => {
    if (!scopedSelector) {
      return document.querySelector(qsFilter(selectorOrElement));
    }
    return selectorOrElement.querySelector(qsFilter(scopedSelector));
  };
  const getCsrfToken = () => {
    const csrfTokenMetaDom = qsOne('meta[name="csrf-token"]');
    if (csrfTokenMetaDom) {
      return csrfTokenMetaDom.getAttribute("content");
    }
    return null;
  };
  const initialPreloadedData = {
    currentUser: {
      id: -1,
      username: "",
      name: "",
      avatar_template: ""
    },
    topicTrackingStates: null
  };
  const getPreloadedData = () => {
    const preloadedDataDom = qsOne("#data-preloaded");
    if (preloadedDataDom) {
      const preloadedStringData = preloadedDataDom.getAttribute("data-preloaded");
      if (preloadedStringData) {
        try {
          const preloadedRawData = JSON.parse(preloadedStringData);
          const preloadedData = { ...initialPreloadedData };
          try {
            preloadedData.currentUser = JSON.parse(preloadedRawData.currentUser);
          } catch {
          }
          try {
            preloadedData.topicTrackingStates = JSON.parse(preloadedRawData.topicTrackingStates);
          } catch {
          }
          return preloadedData;
        } catch {
          return initialPreloadedData;
        }
      }
      return initialPreloadedData;
    }
    return initialPreloadedData;
  };
  const getPreloadedUserProfile = () => {
    const preloadedData = getPreloadedData();
    return preloadedData.currentUser;
  };
  const getPreloadedUsername = () => {
    return getPreloadedUserProfile().username;
  };
  function isHostComponent(element) {
    return typeof element === "string";
  }
  function appendOwnerState(elementType, otherProps, ownerState) {
    if (elementType === void 0 || isHostComponent(elementType)) {
      return otherProps;
    }
    return _extends$1({}, otherProps, {
      ownerState: _extends$1({}, otherProps.ownerState, ownerState)
    });
  }
  const defaultContextValue = {
    disableDefaultClasses: false
  };
  const ClassNameConfiguratorContext = /* @__PURE__ */ React$1__namespace.createContext(defaultContextValue);
  function useClassNamesOverride(generateUtilityClass2) {
    const {
      disableDefaultClasses
    } = React$1__namespace.useContext(ClassNameConfiguratorContext);
    return (slot) => {
      if (disableDefaultClasses) {
        return "";
      }
      return generateUtilityClass2(slot);
    };
  }
  function extractEventHandlers(object, excludeKeys = []) {
    if (object === void 0) {
      return {};
    }
    const result = {};
    Object.keys(object).filter((prop) => prop.match(/^on[A-Z]/) && typeof object[prop] === "function" && !excludeKeys.includes(prop)).forEach((prop) => {
      result[prop] = object[prop];
    });
    return result;
  }
  function resolveComponentProps(componentProps, ownerState, slotState) {
    if (typeof componentProps === "function") {
      return componentProps(ownerState, slotState);
    }
    return componentProps;
  }
  function omitEventHandlers(object) {
    if (object === void 0) {
      return {};
    }
    const result = {};
    Object.keys(object).filter((prop) => !(prop.match(/^on[A-Z]/) && typeof object[prop] === "function")).forEach((prop) => {
      result[prop] = object[prop];
    });
    return result;
  }
  function mergeSlotProps(parameters) {
    const {
      getSlotProps,
      additionalProps,
      externalSlotProps,
      externalForwardedProps,
      className
    } = parameters;
    if (!getSlotProps) {
      const joinedClasses2 = clsx(additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
      const mergedStyle2 = _extends$1({}, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
      const props2 = _extends$1({}, additionalProps, externalForwardedProps, externalSlotProps);
      if (joinedClasses2.length > 0) {
        props2.className = joinedClasses2;
      }
      if (Object.keys(mergedStyle2).length > 0) {
        props2.style = mergedStyle2;
      }
      return {
        props: props2,
        internalRef: void 0
      };
    }
    const eventHandlers = extractEventHandlers(_extends$1({}, externalForwardedProps, externalSlotProps));
    const componentsPropsWithoutEventHandlers = omitEventHandlers(externalSlotProps);
    const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps);
    const internalSlotProps = getSlotProps(eventHandlers);
    const joinedClasses = clsx(internalSlotProps == null ? void 0 : internalSlotProps.className, additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
    const mergedStyle = _extends$1({}, internalSlotProps == null ? void 0 : internalSlotProps.style, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
    const props = _extends$1({}, internalSlotProps, additionalProps, otherPropsWithoutEventHandlers, componentsPropsWithoutEventHandlers);
    if (joinedClasses.length > 0) {
      props.className = joinedClasses;
    }
    if (Object.keys(mergedStyle).length > 0) {
      props.style = mergedStyle;
    }
    return {
      props,
      internalRef: internalSlotProps.ref
    };
  }
  const _excluded$L = ["elementType", "externalSlotProps", "ownerState", "skipResolvingSlotProps"];
  function useSlotProps(parameters) {
    var _parameters$additiona;
    const {
      elementType,
      externalSlotProps,
      ownerState,
      skipResolvingSlotProps = false
    } = parameters, rest = _objectWithoutPropertiesLoose(parameters, _excluded$L);
    const resolvedComponentsProps = skipResolvingSlotProps ? {} : resolveComponentProps(externalSlotProps, ownerState);
    const {
      props: mergedProps,
      internalRef
    } = mergeSlotProps(_extends$1({}, rest, {
      externalSlotProps: resolvedComponentsProps
    }));
    const ref = useForkRef(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, (_parameters$additiona = parameters.additionalProps) == null ? void 0 : _parameters$additiona.ref);
    const props = appendOwnerState(elementType, _extends$1({}, mergedProps, {
      ref
    }), ownerState);
    return props;
  }
  function isOverflowing(container) {
    const doc = ownerDocument(container);
    if (doc.body === container) {
      return ownerWindow(container).innerWidth > doc.documentElement.clientWidth;
    }
    return container.scrollHeight > container.clientHeight;
  }
  function ariaHidden(element, show) {
    if (show) {
      element.setAttribute("aria-hidden", "true");
    } else {
      element.removeAttribute("aria-hidden");
    }
  }
  function getPaddingRight(element) {
    return parseInt(ownerWindow(element).getComputedStyle(element).paddingRight, 10) || 0;
  }
  function isAriaHiddenForbiddenOnElement(element) {
    const forbiddenTagNames = ["TEMPLATE", "SCRIPT", "STYLE", "LINK", "MAP", "META", "NOSCRIPT", "PICTURE", "COL", "COLGROUP", "PARAM", "SLOT", "SOURCE", "TRACK"];
    const isForbiddenTagName = forbiddenTagNames.indexOf(element.tagName) !== -1;
    const isInputHidden = element.tagName === "INPUT" && element.getAttribute("type") === "hidden";
    return isForbiddenTagName || isInputHidden;
  }
  function ariaHiddenSiblings(container, mountElement, currentElement, elementsToExclude, show) {
    const blacklist = [mountElement, currentElement, ...elementsToExclude];
    [].forEach.call(container.children, (element) => {
      const isNotExcludedElement = blacklist.indexOf(element) === -1;
      const isNotForbiddenElement = !isAriaHiddenForbiddenOnElement(element);
      if (isNotExcludedElement && isNotForbiddenElement) {
        ariaHidden(element, show);
      }
    });
  }
  function findIndexOf(items, callback) {
    let idx = -1;
    items.some((item, index) => {
      if (callback(item)) {
        idx = index;
        return true;
      }
      return false;
    });
    return idx;
  }
  function handleContainer(containerInfo, props) {
    const restoreStyle = [];
    const container = containerInfo.container;
    if (!props.disableScrollLock) {
      if (isOverflowing(container)) {
        const scrollbarSize = getScrollbarSize(ownerDocument(container));
        restoreStyle.push({
          value: container.style.paddingRight,
          property: "padding-right",
          el: container
        });
        container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;
        const fixedElements2 = ownerDocument(container).querySelectorAll(".mui-fixed");
        [].forEach.call(fixedElements2, (element) => {
          restoreStyle.push({
            value: element.style.paddingRight,
            property: "padding-right",
            el: element
          });
          element.style.paddingRight = `${getPaddingRight(element) + scrollbarSize}px`;
        });
      }
      let scrollContainer;
      if (container.parentNode instanceof DocumentFragment) {
        scrollContainer = ownerDocument(container).body;
      } else {
        const parent = container.parentElement;
        const containerWindow = ownerWindow(container);
        scrollContainer = (parent == null ? void 0 : parent.nodeName) === "HTML" && containerWindow.getComputedStyle(parent).overflowY === "scroll" ? parent : container;
      }
      restoreStyle.push({
        value: scrollContainer.style.overflow,
        property: "overflow",
        el: scrollContainer
      }, {
        value: scrollContainer.style.overflowX,
        property: "overflow-x",
        el: scrollContainer
      }, {
        value: scrollContainer.style.overflowY,
        property: "overflow-y",
        el: scrollContainer
      });
      scrollContainer.style.overflow = "hidden";
    }
    const restore = () => {
      restoreStyle.forEach(({
        value,
        el,
        property: property2
      }) => {
        if (value) {
          el.style.setProperty(property2, value);
        } else {
          el.style.removeProperty(property2);
        }
      });
    };
    return restore;
  }
  function getHiddenSiblings(container) {
    const hiddenSiblings = [];
    [].forEach.call(container.children, (element) => {
      if (element.getAttribute("aria-hidden") === "true") {
        hiddenSiblings.push(element);
      }
    });
    return hiddenSiblings;
  }
  class ModalManager {
    constructor() {
      this.containers = void 0;
      this.modals = void 0;
      this.modals = [];
      this.containers = [];
    }
    add(modal, container) {
      let modalIndex = this.modals.indexOf(modal);
      if (modalIndex !== -1) {
        return modalIndex;
      }
      modalIndex = this.modals.length;
      this.modals.push(modal);
      if (modal.modalRef) {
        ariaHidden(modal.modalRef, false);
      }
      const hiddenSiblings = getHiddenSiblings(container);
      ariaHiddenSiblings(container, modal.mount, modal.modalRef, hiddenSiblings, true);
      const containerIndex = findIndexOf(this.containers, (item) => item.container === container);
      if (containerIndex !== -1) {
        this.containers[containerIndex].modals.push(modal);
        return modalIndex;
      }
      this.containers.push({
        modals: [modal],
        container,
        restore: null,
        hiddenSiblings
      });
      return modalIndex;
    }
    mount(modal, props) {
      const containerIndex = findIndexOf(this.containers, (item) => item.modals.indexOf(modal) !== -1);
      const containerInfo = this.containers[containerIndex];
      if (!containerInfo.restore) {
        containerInfo.restore = handleContainer(containerInfo, props);
      }
    }
    remove(modal, ariaHiddenState = true) {
      const modalIndex = this.modals.indexOf(modal);
      if (modalIndex === -1) {
        return modalIndex;
      }
      const containerIndex = findIndexOf(this.containers, (item) => item.modals.indexOf(modal) !== -1);
      const containerInfo = this.containers[containerIndex];
      containerInfo.modals.splice(containerInfo.modals.indexOf(modal), 1);
      this.modals.splice(modalIndex, 1);
      if (containerInfo.modals.length === 0) {
        if (containerInfo.restore) {
          containerInfo.restore();
        }
        if (modal.modalRef) {
          ariaHidden(modal.modalRef, ariaHiddenState);
        }
        ariaHiddenSiblings(containerInfo.container, modal.mount, modal.modalRef, containerInfo.hiddenSiblings, false);
        this.containers.splice(containerIndex, 1);
      } else {
        const nextTop = containerInfo.modals[containerInfo.modals.length - 1];
        if (nextTop.modalRef) {
          ariaHidden(nextTop.modalRef, false);
        }
      }
      return modalIndex;
    }
    isTopModal(modal) {
      return this.modals.length > 0 && this.modals[this.modals.length - 1] === modal;
    }
  }
  function getContainer$1(container) {
    return typeof container === "function" ? container() : container;
  }
  function getHasTransition(children) {
    return children ? children.props.hasOwnProperty("in") : false;
  }
  const defaultManager = new ModalManager();
  function useModal(parameters) {
    const {
      container,
      disableEscapeKeyDown = false,
      disableScrollLock = false,
      // @ts-ignore internal logic - Base UI supports the manager as a prop too
      manager = defaultManager,
      closeAfterTransition = false,
      onTransitionEnter,
      onTransitionExited,
      children,
      onClose,
      open,
      rootRef
    } = parameters;
    const modal = React$1__namespace.useRef({});
    const mountNodeRef = React$1__namespace.useRef(null);
    const modalRef = React$1__namespace.useRef(null);
    const handleRef = useForkRef(modalRef, rootRef);
    const [exited, setExited] = React$1__namespace.useState(!open);
    const hasTransition = getHasTransition(children);
    let ariaHiddenProp = true;
    if (parameters["aria-hidden"] === "false" || parameters["aria-hidden"] === false) {
      ariaHiddenProp = false;
    }
    const getDoc = () => ownerDocument(mountNodeRef.current);
    const getModal = () => {
      modal.current.modalRef = modalRef.current;
      modal.current.mount = mountNodeRef.current;
      return modal.current;
    };
    const handleMounted = () => {
      manager.mount(getModal(), {
        disableScrollLock
      });
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    };
    const handleOpen = useEventCallback(() => {
      const resolvedContainer = getContainer$1(container) || getDoc().body;
      manager.add(getModal(), resolvedContainer);
      if (modalRef.current) {
        handleMounted();
      }
    });
    const isTopModal = React$1__namespace.useCallback(() => manager.isTopModal(getModal()), [manager]);
    const handlePortalRef = useEventCallback((node2) => {
      mountNodeRef.current = node2;
      if (!node2) {
        return;
      }
      if (open && isTopModal()) {
        handleMounted();
      } else if (modalRef.current) {
        ariaHidden(modalRef.current, ariaHiddenProp);
      }
    });
    const handleClose = React$1__namespace.useCallback(() => {
      manager.remove(getModal(), ariaHiddenProp);
    }, [ariaHiddenProp, manager]);
    React$1__namespace.useEffect(() => {
      return () => {
        handleClose();
      };
    }, [handleClose]);
    React$1__namespace.useEffect(() => {
      if (open) {
        handleOpen();
      } else if (!hasTransition || !closeAfterTransition) {
        handleClose();
      }
    }, [open, handleClose, hasTransition, closeAfterTransition, handleOpen]);
    const createHandleKeyDown = (otherHandlers) => (event) => {
      var _otherHandlers$onKeyD;
      (_otherHandlers$onKeyD = otherHandlers.onKeyDown) == null || _otherHandlers$onKeyD.call(otherHandlers, event);
      if (event.key !== "Escape" || event.which === 229 || // Wait until IME is settled.
      !isTopModal()) {
        return;
      }
      if (!disableEscapeKeyDown) {
        event.stopPropagation();
        if (onClose) {
          onClose(event, "escapeKeyDown");
        }
      }
    };
    const createHandleBackdropClick = (otherHandlers) => (event) => {
      var _otherHandlers$onClic;
      (_otherHandlers$onClic = otherHandlers.onClick) == null || _otherHandlers$onClic.call(otherHandlers, event);
      if (event.target !== event.currentTarget) {
        return;
      }
      if (onClose) {
        onClose(event, "backdropClick");
      }
    };
    const getRootProps = (otherHandlers = {}) => {
      const propsEventHandlers = extractEventHandlers(parameters);
      delete propsEventHandlers.onTransitionEnter;
      delete propsEventHandlers.onTransitionExited;
      const externalEventHandlers = _extends$1({}, propsEventHandlers, otherHandlers);
      return _extends$1({
        role: "presentation"
      }, externalEventHandlers, {
        onKeyDown: createHandleKeyDown(externalEventHandlers),
        ref: handleRef
      });
    };
    const getBackdropProps = (otherHandlers = {}) => {
      const externalEventHandlers = otherHandlers;
      return _extends$1({
        "aria-hidden": true
      }, externalEventHandlers, {
        onClick: createHandleBackdropClick(externalEventHandlers),
        open
      });
    };
    const getTransitionProps2 = () => {
      const handleEnter = () => {
        setExited(false);
        if (onTransitionEnter) {
          onTransitionEnter();
        }
      };
      const handleExited = () => {
        setExited(true);
        if (onTransitionExited) {
          onTransitionExited();
        }
        if (closeAfterTransition) {
          handleClose();
        }
      };
      return {
        onEnter: createChainedFunction(handleEnter, children == null ? void 0 : children.props.onEnter),
        onExited: createChainedFunction(handleExited, children == null ? void 0 : children.props.onExited)
      };
    };
    return {
      getRootProps,
      getBackdropProps,
      getTransitionProps: getTransitionProps2,
      rootRef: handleRef,
      portalRef: handlePortalRef,
      isTopModal,
      exited,
      hasTransition
    };
  }
  const candidatesSelector = ["input", "select", "textarea", "a[href]", "button", "[tabindex]", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])'].join(",");
  function getTabIndex(node2) {
    const tabindexAttr = parseInt(node2.getAttribute("tabindex") || "", 10);
    if (!Number.isNaN(tabindexAttr)) {
      return tabindexAttr;
    }
    if (node2.contentEditable === "true" || (node2.nodeName === "AUDIO" || node2.nodeName === "VIDEO" || node2.nodeName === "DETAILS") && node2.getAttribute("tabindex") === null) {
      return 0;
    }
    return node2.tabIndex;
  }
  function isNonTabbableRadio(node2) {
    if (node2.tagName !== "INPUT" || node2.type !== "radio") {
      return false;
    }
    if (!node2.name) {
      return false;
    }
    const getRadio = (selector) => node2.ownerDocument.querySelector(`input[type="radio"]${selector}`);
    let roving = getRadio(`[name="${node2.name}"]:checked`);
    if (!roving) {
      roving = getRadio(`[name="${node2.name}"]`);
    }
    return roving !== node2;
  }
  function isNodeMatchingSelectorFocusable(node2) {
    if (node2.disabled || node2.tagName === "INPUT" && node2.type === "hidden" || isNonTabbableRadio(node2)) {
      return false;
    }
    return true;
  }
  function defaultGetTabbable(root2) {
    const regularTabNodes = [];
    const orderedTabNodes = [];
    Array.from(root2.querySelectorAll(candidatesSelector)).forEach((node2, i) => {
      const nodeTabIndex = getTabIndex(node2);
      if (nodeTabIndex === -1 || !isNodeMatchingSelectorFocusable(node2)) {
        return;
      }
      if (nodeTabIndex === 0) {
        regularTabNodes.push(node2);
      } else {
        orderedTabNodes.push({
          documentOrder: i,
          tabIndex: nodeTabIndex,
          node: node2
        });
      }
    });
    return orderedTabNodes.sort((a, b2) => a.tabIndex === b2.tabIndex ? a.documentOrder - b2.documentOrder : a.tabIndex - b2.tabIndex).map((a) => a.node).concat(regularTabNodes);
  }
  function defaultIsEnabled() {
    return true;
  }
  function FocusTrap(props) {
    const {
      children,
      disableAutoFocus = false,
      disableEnforceFocus = false,
      disableRestoreFocus = false,
      getTabbable = defaultGetTabbable,
      isEnabled = defaultIsEnabled,
      open
    } = props;
    const ignoreNextEnforceFocus = React$1__namespace.useRef(false);
    const sentinelStart = React$1__namespace.useRef(null);
    const sentinelEnd = React$1__namespace.useRef(null);
    const nodeToRestore = React$1__namespace.useRef(null);
    const reactFocusEventTarget = React$1__namespace.useRef(null);
    const activated = React$1__namespace.useRef(false);
    const rootRef = React$1__namespace.useRef(null);
    const handleRef = useForkRef(children.ref, rootRef);
    const lastKeydown = React$1__namespace.useRef(null);
    React$1__namespace.useEffect(() => {
      if (!open || !rootRef.current) {
        return;
      }
      activated.current = !disableAutoFocus;
    }, [disableAutoFocus, open]);
    React$1__namespace.useEffect(() => {
      if (!open || !rootRef.current) {
        return;
      }
      const doc = ownerDocument(rootRef.current);
      if (!rootRef.current.contains(doc.activeElement)) {
        if (!rootRef.current.hasAttribute("tabIndex")) {
          rootRef.current.setAttribute("tabIndex", "-1");
        }
        if (activated.current) {
          rootRef.current.focus();
        }
      }
      return () => {
        if (!disableRestoreFocus) {
          if (nodeToRestore.current && nodeToRestore.current.focus) {
            ignoreNextEnforceFocus.current = true;
            nodeToRestore.current.focus();
          }
          nodeToRestore.current = null;
        }
      };
    }, [open]);
    React$1__namespace.useEffect(() => {
      if (!open || !rootRef.current) {
        return;
      }
      const doc = ownerDocument(rootRef.current);
      const loopFocus = (nativeEvent) => {
        lastKeydown.current = nativeEvent;
        if (disableEnforceFocus || !isEnabled() || nativeEvent.key !== "Tab") {
          return;
        }
        if (doc.activeElement === rootRef.current && nativeEvent.shiftKey) {
          ignoreNextEnforceFocus.current = true;
          if (sentinelEnd.current) {
            sentinelEnd.current.focus();
          }
        }
      };
      const contain = () => {
        const rootElement = rootRef.current;
        if (rootElement === null) {
          return;
        }
        if (!doc.hasFocus() || !isEnabled() || ignoreNextEnforceFocus.current) {
          ignoreNextEnforceFocus.current = false;
          return;
        }
        if (rootElement.contains(doc.activeElement)) {
          return;
        }
        if (disableEnforceFocus && doc.activeElement !== sentinelStart.current && doc.activeElement !== sentinelEnd.current) {
          return;
        }
        if (doc.activeElement !== reactFocusEventTarget.current) {
          reactFocusEventTarget.current = null;
        } else if (reactFocusEventTarget.current !== null) {
          return;
        }
        if (!activated.current) {
          return;
        }
        let tabbable = [];
        if (doc.activeElement === sentinelStart.current || doc.activeElement === sentinelEnd.current) {
          tabbable = getTabbable(rootRef.current);
        }
        if (tabbable.length > 0) {
          var _lastKeydown$current, _lastKeydown$current2;
          const isShiftTab = Boolean(((_lastKeydown$current = lastKeydown.current) == null ? void 0 : _lastKeydown$current.shiftKey) && ((_lastKeydown$current2 = lastKeydown.current) == null ? void 0 : _lastKeydown$current2.key) === "Tab");
          const focusNext = tabbable[0];
          const focusPrevious = tabbable[tabbable.length - 1];
          if (typeof focusNext !== "string" && typeof focusPrevious !== "string") {
            if (isShiftTab) {
              focusPrevious.focus();
            } else {
              focusNext.focus();
            }
          }
        } else {
          rootElement.focus();
        }
      };
      doc.addEventListener("focusin", contain);
      doc.addEventListener("keydown", loopFocus, true);
      const interval = setInterval(() => {
        if (doc.activeElement && doc.activeElement.tagName === "BODY") {
          contain();
        }
      }, 50);
      return () => {
        clearInterval(interval);
        doc.removeEventListener("focusin", contain);
        doc.removeEventListener("keydown", loopFocus, true);
      };
    }, [disableAutoFocus, disableEnforceFocus, disableRestoreFocus, isEnabled, open, getTabbable]);
    const onFocus = (event) => {
      if (nodeToRestore.current === null) {
        nodeToRestore.current = event.relatedTarget;
      }
      activated.current = true;
      reactFocusEventTarget.current = event.target;
      const childrenPropsHandler = children.props.onFocus;
      if (childrenPropsHandler) {
        childrenPropsHandler(event);
      }
    };
    const handleFocusSentinel = (event) => {
      if (nodeToRestore.current === null) {
        nodeToRestore.current = event.relatedTarget;
      }
      activated.current = true;
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        tabIndex: open ? 0 : -1,
        onFocus: handleFocusSentinel,
        ref: sentinelStart,
        "data-testid": "sentinelStart"
      }), /* @__PURE__ */ React$1__namespace.cloneElement(children, {
        ref: handleRef,
        onFocus
      }), /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        tabIndex: open ? 0 : -1,
        onFocus: handleFocusSentinel,
        ref: sentinelEnd,
        "data-testid": "sentinelEnd"
      })]
    });
  }
  function getContainer(container) {
    return typeof container === "function" ? container() : container;
  }
  const Portal = /* @__PURE__ */ React$1__namespace.forwardRef(function Portal2(props, forwardedRef) {
    const {
      children,
      container,
      disablePortal = false
    } = props;
    const [mountNode, setMountNode] = React$1__namespace.useState(null);
    const handleRef = useForkRef(/* @__PURE__ */ React$1__namespace.isValidElement(children) ? children.ref : null, forwardedRef);
    useEnhancedEffect(() => {
      if (!disablePortal) {
        setMountNode(getContainer(container) || document.body);
      }
    }, [container, disablePortal]);
    useEnhancedEffect(() => {
      if (mountNode && !disablePortal) {
        setRef(forwardedRef, mountNode);
        return () => {
          setRef(forwardedRef, null);
        };
      }
      return void 0;
    }, [forwardedRef, mountNode, disablePortal]);
    if (disablePortal) {
      if (/* @__PURE__ */ React$1__namespace.isValidElement(children)) {
        const newProps = {
          ref: handleRef
        };
        return /* @__PURE__ */ React$1__namespace.cloneElement(children, newProps);
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(React$1__namespace.Fragment, {
        children
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(React$1__namespace.Fragment, {
      children: mountNode ? /* @__PURE__ */ ReactDOM__default__namespace.createPortal(children, mountNode) : mountNode
    });
  });
  const reflow = (node2) => node2.scrollTop;
  function getTransitionProps(props, options) {
    var _style$transitionDura, _style$transitionTimi;
    const {
      timeout,
      easing: easing2,
      style: style2 = {}
    } = props;
    return {
      duration: (_style$transitionDura = style2.transitionDuration) != null ? _style$transitionDura : typeof timeout === "number" ? timeout : timeout[options.mode] || 0,
      easing: (_style$transitionTimi = style2.transitionTimingFunction) != null ? _style$transitionTimi : typeof easing2 === "object" ? easing2[options.mode] : easing2,
      delay: style2.transitionDelay
    };
  }
  const _excluded$K = ["addEndListener", "appear", "children", "easing", "in", "onEnter", "onEntered", "onEntering", "onExit", "onExited", "onExiting", "style", "timeout", "TransitionComponent"];
  const styles$2 = {
    entering: {
      opacity: 1
    },
    entered: {
      opacity: 1
    }
  };
  const Fade = /* @__PURE__ */ React$1__namespace.forwardRef(function Fade2(props, ref) {
    const theme = useTheme$1();
    const defaultTimeout = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      addEndListener,
      appear = true,
      children,
      easing: easing2,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style: style2,
      timeout = defaultTimeout,
      // eslint-disable-next-line react/prop-types
      TransitionComponent = Transition$1
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$K);
    const nodeRef = React$1__namespace.useRef(null);
    const handleRef = useForkRef(nodeRef, children.ref, ref);
    const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
      if (callback) {
        const node2 = nodeRef.current;
        if (maybeIsAppearing === void 0) {
          callback(node2);
        } else {
          callback(node2, maybeIsAppearing);
        }
      }
    };
    const handleEntering = normalizedTransitionCallback(onEntering);
    const handleEnter = normalizedTransitionCallback((node2, isAppearing) => {
      reflow(node2);
      const transitionProps = getTransitionProps({
        style: style2,
        timeout,
        easing: easing2
      }, {
        mode: "enter"
      });
      node2.style.webkitTransition = theme.transitions.create("opacity", transitionProps);
      node2.style.transition = theme.transitions.create("opacity", transitionProps);
      if (onEnter) {
        onEnter(node2, isAppearing);
      }
    });
    const handleEntered = normalizedTransitionCallback(onEntered);
    const handleExiting = normalizedTransitionCallback(onExiting);
    const handleExit = normalizedTransitionCallback((node2) => {
      const transitionProps = getTransitionProps({
        style: style2,
        timeout,
        easing: easing2
      }, {
        mode: "exit"
      });
      node2.style.webkitTransition = theme.transitions.create("opacity", transitionProps);
      node2.style.transition = theme.transitions.create("opacity", transitionProps);
      if (onExit) {
        onExit(node2);
      }
    });
    const handleExited = normalizedTransitionCallback(onExited);
    const handleAddEndListener = (next2) => {
      if (addEndListener) {
        addEndListener(nodeRef.current, next2);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
      appear,
      in: inProp,
      nodeRef,
      onEnter: handleEnter,
      onEntered: handleEntered,
      onEntering: handleEntering,
      onExit: handleExit,
      onExited: handleExited,
      onExiting: handleExiting,
      addEndListener: handleAddEndListener,
      timeout
    }, other, {
      children: (state, childProps) => {
        return /* @__PURE__ */ React$1__namespace.cloneElement(children, _extends$1({
          style: _extends$1({
            opacity: 0,
            visibility: state === "exited" && !inProp ? "hidden" : void 0
          }, styles$2[state], style2, children.props.style),
          ref: handleRef
        }, childProps));
      }
    }));
  });
  const Fade$1 = Fade;
  function getBackdropUtilityClass(slot) {
    return generateUtilityClass$2("MuiBackdrop", slot);
  }
  generateUtilityClasses$2("MuiBackdrop", ["root", "invisible"]);
  const _excluded$J = ["children", "className", "component", "components", "componentsProps", "invisible", "open", "slotProps", "slots", "TransitionComponent", "transitionDuration"];
  const useUtilityClasses$C = (ownerState) => {
    const {
      classes,
      invisible
    } = ownerState;
    const slots = {
      root: ["root", invisible && "invisible"]
    };
    return composeClasses$1(slots, getBackdropUtilityClass, classes);
  };
  const BackdropRoot = styled("div", {
    name: "MuiBackdrop",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.invisible && styles2.invisible];
    }
  })(({
    ownerState
  }) => _extends$1({
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    WebkitTapHighlightColor: "transparent"
  }, ownerState.invisible && {
    backgroundColor: "transparent"
  }));
  const Backdrop = /* @__PURE__ */ React$1__namespace.forwardRef(function Backdrop2(inProps, ref) {
    var _slotProps$root, _ref, _slots$root;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiBackdrop"
    });
    const {
      children,
      className,
      component = "div",
      components = {},
      componentsProps = {},
      invisible = false,
      open,
      slotProps = {},
      slots = {},
      TransitionComponent = Fade$1,
      transitionDuration
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$J);
    const ownerState = _extends$1({}, props, {
      component,
      invisible
    });
    const classes = useUtilityClasses$C(ownerState);
    const rootSlotProps = (_slotProps$root = slotProps.root) != null ? _slotProps$root : componentsProps.root;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
      in: open,
      timeout: transitionDuration
    }, other, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(BackdropRoot, _extends$1({
        "aria-hidden": true
      }, rootSlotProps, {
        as: (_ref = (_slots$root = slots.root) != null ? _slots$root : components.Root) != null ? _ref : component,
        className: clsx(classes.root, className, rootSlotProps == null ? void 0 : rootSlotProps.className),
        ownerState: _extends$1({}, ownerState, rootSlotProps == null ? void 0 : rootSlotProps.ownerState),
        classes,
        ref,
        children
      }))
    }));
  });
  const Backdrop$1 = Backdrop;
  function getModalUtilityClass(slot) {
    return generateUtilityClass$2("MuiModal", slot);
  }
  generateUtilityClasses$2("MuiModal", ["root", "hidden", "backdrop"]);
  const _excluded$I = ["BackdropComponent", "BackdropProps", "classes", "className", "closeAfterTransition", "children", "container", "component", "components", "componentsProps", "disableAutoFocus", "disableEnforceFocus", "disableEscapeKeyDown", "disablePortal", "disableRestoreFocus", "disableScrollLock", "hideBackdrop", "keepMounted", "onBackdropClick", "onClose", "onTransitionEnter", "onTransitionExited", "open", "slotProps", "slots", "theme"];
  const useUtilityClasses$B = (ownerState) => {
    const {
      open,
      exited,
      classes
    } = ownerState;
    const slots = {
      root: ["root", !open && exited && "hidden"],
      backdrop: ["backdrop"]
    };
    return composeClasses$1(slots, getModalUtilityClass, classes);
  };
  const ModalRoot = styled("div", {
    name: "MuiModal",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, !ownerState.open && ownerState.exited && styles2.hidden];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    position: "fixed",
    zIndex: (theme.vars || theme).zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  }, !ownerState.open && ownerState.exited && {
    visibility: "hidden"
  }));
  const ModalBackdrop = styled(Backdrop$1, {
    name: "MuiModal",
    slot: "Backdrop",
    overridesResolver: (props, styles2) => {
      return styles2.backdrop;
    }
  })({
    zIndex: -1
  });
  const Modal = /* @__PURE__ */ React$1__namespace.forwardRef(function Modal2(inProps, ref) {
    var _ref, _slots$root, _ref2, _slots$backdrop, _slotProps$root, _slotProps$backdrop;
    const props = useThemeProps$1({
      name: "MuiModal",
      props: inProps
    });
    const {
      BackdropComponent = ModalBackdrop,
      BackdropProps,
      className,
      closeAfterTransition = false,
      children,
      container,
      component,
      components = {},
      componentsProps = {},
      disableAutoFocus = false,
      disableEnforceFocus = false,
      disableEscapeKeyDown = false,
      disablePortal = false,
      disableRestoreFocus = false,
      disableScrollLock = false,
      hideBackdrop = false,
      keepMounted = false,
      onBackdropClick,
      open,
      slotProps,
      slots
      // eslint-disable-next-line react/prop-types
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$I);
    const propsWithDefaults = _extends$1({}, props, {
      closeAfterTransition,
      disableAutoFocus,
      disableEnforceFocus,
      disableEscapeKeyDown,
      disablePortal,
      disableRestoreFocus,
      disableScrollLock,
      hideBackdrop,
      keepMounted
    });
    const {
      getRootProps,
      getBackdropProps,
      getTransitionProps: getTransitionProps2,
      portalRef,
      isTopModal,
      exited,
      hasTransition
    } = useModal(_extends$1({}, propsWithDefaults, {
      rootRef: ref
    }));
    const ownerState = _extends$1({}, propsWithDefaults, {
      exited
    });
    const classes = useUtilityClasses$B(ownerState);
    const childProps = {};
    if (children.props.tabIndex === void 0) {
      childProps.tabIndex = "-1";
    }
    if (hasTransition) {
      const {
        onEnter,
        onExited
      } = getTransitionProps2();
      childProps.onEnter = onEnter;
      childProps.onExited = onExited;
    }
    const RootSlot = (_ref = (_slots$root = slots == null ? void 0 : slots.root) != null ? _slots$root : components.Root) != null ? _ref : ModalRoot;
    const BackdropSlot = (_ref2 = (_slots$backdrop = slots == null ? void 0 : slots.backdrop) != null ? _slots$backdrop : components.Backdrop) != null ? _ref2 : BackdropComponent;
    const rootSlotProps = (_slotProps$root = slotProps == null ? void 0 : slotProps.root) != null ? _slotProps$root : componentsProps.root;
    const backdropSlotProps = (_slotProps$backdrop = slotProps == null ? void 0 : slotProps.backdrop) != null ? _slotProps$backdrop : componentsProps.backdrop;
    const rootProps = useSlotProps({
      elementType: RootSlot,
      externalSlotProps: rootSlotProps,
      externalForwardedProps: other,
      getSlotProps: getRootProps,
      additionalProps: {
        ref,
        as: component
      },
      ownerState,
      className: clsx(className, rootSlotProps == null ? void 0 : rootSlotProps.className, classes == null ? void 0 : classes.root, !ownerState.open && ownerState.exited && (classes == null ? void 0 : classes.hidden))
    });
    const backdropProps = useSlotProps({
      elementType: BackdropSlot,
      externalSlotProps: backdropSlotProps,
      additionalProps: BackdropProps,
      getSlotProps: (otherHandlers) => {
        return getBackdropProps(_extends$1({}, otherHandlers, {
          onClick: (e2) => {
            if (onBackdropClick) {
              onBackdropClick(e2);
            }
            if (otherHandlers != null && otherHandlers.onClick) {
              otherHandlers.onClick(e2);
            }
          }
        }));
      },
      className: clsx(backdropSlotProps == null ? void 0 : backdropSlotProps.className, BackdropProps == null ? void 0 : BackdropProps.className, classes == null ? void 0 : classes.backdrop),
      ownerState
    });
    if (!keepMounted && !open && (!hasTransition || exited)) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, {
      ref: portalRef,
      container,
      disablePortal,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(RootSlot, _extends$1({}, rootProps, {
        children: [!hideBackdrop && BackdropComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(BackdropSlot, _extends$1({}, backdropProps)) : null, /* @__PURE__ */ jsxRuntimeExports.jsx(FocusTrap, {
          disableEnforceFocus,
          disableAutoFocus,
          disableRestoreFocus,
          isEnabled: isTopModal,
          open,
          children: /* @__PURE__ */ React$1__namespace.cloneElement(children, childProps)
        })]
      }))
    });
  });
  const Modal$1 = Modal;
  function getPaperUtilityClass(slot) {
    return generateUtilityClass$2("MuiPaper", slot);
  }
  generateUtilityClasses$2("MuiPaper", ["root", "rounded", "outlined", "elevation", "elevation0", "elevation1", "elevation2", "elevation3", "elevation4", "elevation5", "elevation6", "elevation7", "elevation8", "elevation9", "elevation10", "elevation11", "elevation12", "elevation13", "elevation14", "elevation15", "elevation16", "elevation17", "elevation18", "elevation19", "elevation20", "elevation21", "elevation22", "elevation23", "elevation24"]);
  const _excluded$H = ["className", "component", "elevation", "square", "variant"];
  const useUtilityClasses$A = (ownerState) => {
    const {
      square,
      elevation,
      variant,
      classes
    } = ownerState;
    const slots = {
      root: ["root", variant, !square && "rounded", variant === "elevation" && `elevation${elevation}`]
    };
    return composeClasses$1(slots, getPaperUtilityClass, classes);
  };
  const PaperRoot = styled("div", {
    name: "MuiPaper",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], !ownerState.square && styles2.rounded, ownerState.variant === "elevation" && styles2[`elevation${ownerState.elevation}`]];
    }
  })(({
    theme,
    ownerState
  }) => {
    var _theme$vars$overlays;
    return _extends$1({
      backgroundColor: (theme.vars || theme).palette.background.paper,
      color: (theme.vars || theme).palette.text.primary,
      transition: theme.transitions.create("box-shadow")
    }, !ownerState.square && {
      borderRadius: theme.shape.borderRadius
    }, ownerState.variant === "outlined" && {
      border: `1px solid ${(theme.vars || theme).palette.divider}`
    }, ownerState.variant === "elevation" && _extends$1({
      boxShadow: (theme.vars || theme).shadows[ownerState.elevation]
    }, !theme.vars && theme.palette.mode === "dark" && {
      backgroundImage: `linear-gradient(${alpha_1("#fff", getOverlayAlpha(ownerState.elevation))}, ${alpha_1("#fff", getOverlayAlpha(ownerState.elevation))})`
    }, theme.vars && {
      backgroundImage: (_theme$vars$overlays = theme.vars.overlays) == null ? void 0 : _theme$vars$overlays[ownerState.elevation]
    }));
  });
  const Paper = /* @__PURE__ */ React$1__namespace.forwardRef(function Paper2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiPaper"
    });
    const {
      className,
      component = "div",
      elevation = 1,
      square = false,
      variant = "elevation"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$H);
    const ownerState = _extends$1({}, props, {
      component,
      elevation,
      square,
      variant
    });
    const classes = useUtilityClasses$A(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PaperRoot, _extends$1({
      as: component,
      ownerState,
      className: clsx(classes.root, className),
      ref
    }, other));
  });
  const Paper$1 = Paper;
  function getDialogUtilityClass(slot) {
    return generateUtilityClass$2("MuiDialog", slot);
  }
  const dialogClasses = generateUtilityClasses$2("MuiDialog", ["root", "scrollPaper", "scrollBody", "container", "paper", "paperScrollPaper", "paperScrollBody", "paperWidthFalse", "paperWidthXs", "paperWidthSm", "paperWidthMd", "paperWidthLg", "paperWidthXl", "paperFullWidth", "paperFullScreen"]);
  const dialogClasses$1 = dialogClasses;
  const DialogContext = /* @__PURE__ */ React$1__namespace.createContext({});
  const DialogContext$1 = DialogContext;
  const _excluded$G = ["aria-describedby", "aria-labelledby", "BackdropComponent", "BackdropProps", "children", "className", "disableEscapeKeyDown", "fullScreen", "fullWidth", "maxWidth", "onBackdropClick", "onClose", "open", "PaperComponent", "PaperProps", "scroll", "TransitionComponent", "transitionDuration", "TransitionProps"];
  const DialogBackdrop = styled(Backdrop$1, {
    name: "MuiDialog",
    slot: "Backdrop",
    overrides: (props, styles2) => styles2.backdrop
  })({
    // Improve scrollable dialog support.
    zIndex: -1
  });
  const useUtilityClasses$z = (ownerState) => {
    const {
      classes,
      scroll,
      maxWidth: maxWidth2,
      fullWidth,
      fullScreen
    } = ownerState;
    const slots = {
      root: ["root"],
      container: ["container", `scroll${capitalize$1(scroll)}`],
      paper: ["paper", `paperScroll${capitalize$1(scroll)}`, `paperWidth${capitalize$1(String(maxWidth2))}`, fullWidth && "paperFullWidth", fullScreen && "paperFullScreen"]
    };
    return composeClasses$1(slots, getDialogUtilityClass, classes);
  };
  const DialogRoot = styled(Modal$1, {
    name: "MuiDialog",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({
    "@media print": {
      // Use !important to override the Modal inline-style.
      position: "absolute !important"
    }
  });
  const DialogContainer = styled("div", {
    name: "MuiDialog",
    slot: "Container",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.container, styles2[`scroll${capitalize$1(ownerState.scroll)}`]];
    }
  })(({
    ownerState
  }) => _extends$1({
    height: "100%",
    "@media print": {
      height: "auto"
    },
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0
  }, ownerState.scroll === "paper" && {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }, ownerState.scroll === "body" && {
    overflowY: "auto",
    overflowX: "hidden",
    textAlign: "center",
    "&::after": {
      content: '""',
      display: "inline-block",
      verticalAlign: "middle",
      height: "100%",
      width: "0"
    }
  }));
  const DialogPaper = styled(Paper$1, {
    name: "MuiDialog",
    slot: "Paper",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.paper, styles2[`scrollPaper${capitalize$1(ownerState.scroll)}`], styles2[`paperWidth${capitalize$1(String(ownerState.maxWidth))}`], ownerState.fullWidth && styles2.paperFullWidth, ownerState.fullScreen && styles2.paperFullScreen];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    margin: 32,
    position: "relative",
    overflowY: "auto",
    // Fix IE11 issue, to remove at some point.
    "@media print": {
      overflowY: "visible",
      boxShadow: "none"
    }
  }, ownerState.scroll === "paper" && {
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100% - 64px)"
  }, ownerState.scroll === "body" && {
    display: "inline-block",
    verticalAlign: "middle",
    textAlign: "left"
    // 'initial' doesn't work on IE11
  }, !ownerState.maxWidth && {
    maxWidth: "calc(100% - 64px)"
  }, ownerState.maxWidth === "xs" && {
    maxWidth: theme.breakpoints.unit === "px" ? Math.max(theme.breakpoints.values.xs, 444) : `max(${theme.breakpoints.values.xs}${theme.breakpoints.unit}, 444px)`,
    [`&.${dialogClasses$1.paperScrollBody}`]: {
      [theme.breakpoints.down(Math.max(theme.breakpoints.values.xs, 444) + 32 * 2)]: {
        maxWidth: "calc(100% - 64px)"
      }
    }
  }, ownerState.maxWidth && ownerState.maxWidth !== "xs" && {
    maxWidth: `${theme.breakpoints.values[ownerState.maxWidth]}${theme.breakpoints.unit}`,
    [`&.${dialogClasses$1.paperScrollBody}`]: {
      [theme.breakpoints.down(theme.breakpoints.values[ownerState.maxWidth] + 32 * 2)]: {
        maxWidth: "calc(100% - 64px)"
      }
    }
  }, ownerState.fullWidth && {
    width: "calc(100% - 64px)"
  }, ownerState.fullScreen && {
    margin: 0,
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    maxHeight: "none",
    borderRadius: 0,
    [`&.${dialogClasses$1.paperScrollBody}`]: {
      margin: 0,
      maxWidth: "100%"
    }
  }));
  const Dialog = /* @__PURE__ */ React$1__namespace.forwardRef(function Dialog2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiDialog"
    });
    const theme = useTheme$1();
    const defaultTransitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      "aria-describedby": ariaDescribedby,
      "aria-labelledby": ariaLabelledbyProp,
      BackdropComponent,
      BackdropProps,
      children,
      className,
      disableEscapeKeyDown = false,
      fullScreen = false,
      fullWidth = false,
      maxWidth: maxWidth2 = "sm",
      onBackdropClick,
      onClose,
      open,
      PaperComponent = Paper$1,
      PaperProps = {},
      scroll = "paper",
      TransitionComponent = Fade$1,
      transitionDuration = defaultTransitionDuration,
      TransitionProps
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$G);
    const ownerState = _extends$1({}, props, {
      disableEscapeKeyDown,
      fullScreen,
      fullWidth,
      maxWidth: maxWidth2,
      scroll
    });
    const classes = useUtilityClasses$z(ownerState);
    const backdropClick = React$1__namespace.useRef();
    const handleMouseDown = (event) => {
      backdropClick.current = event.target === event.currentTarget;
    };
    const handleBackdropClick = (event) => {
      if (!backdropClick.current) {
        return;
      }
      backdropClick.current = null;
      if (onBackdropClick) {
        onBackdropClick(event);
      }
      if (onClose) {
        onClose(event, "backdropClick");
      }
    };
    const ariaLabelledby = useId(ariaLabelledbyProp);
    const dialogContextValue = React$1__namespace.useMemo(() => {
      return {
        titleId: ariaLabelledby
      };
    }, [ariaLabelledby]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, _extends$1({
      className: clsx(classes.root, className),
      closeAfterTransition: true,
      components: {
        Backdrop: DialogBackdrop
      },
      componentsProps: {
        backdrop: _extends$1({
          transitionDuration,
          as: BackdropComponent
        }, BackdropProps)
      },
      disableEscapeKeyDown,
      onClose,
      open,
      ref,
      onClick: handleBackdropClick,
      ownerState
    }, other, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
        appear: true,
        in: open,
        timeout: transitionDuration,
        role: "presentation"
      }, TransitionProps, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContainer, {
          className: clsx(classes.container),
          onMouseDown: handleMouseDown,
          ownerState,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPaper, _extends$1({
            as: PaperComponent,
            elevation: 24,
            role: "dialog",
            "aria-describedby": ariaDescribedby,
            "aria-labelledby": ariaLabelledby
          }, PaperProps, {
            className: clsx(classes.paper, PaperProps.className),
            ownerState,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContext$1.Provider, {
              value: dialogContextValue,
              children
            })
          }))
        })
      }))
    }));
  });
  const Dialog$1 = Dialog;
  function getDialogActionsUtilityClass(slot) {
    return generateUtilityClass$2("MuiDialogActions", slot);
  }
  generateUtilityClasses$2("MuiDialogActions", ["root", "spacing"]);
  const _excluded$F = ["className", "disableSpacing"];
  const useUtilityClasses$y = (ownerState) => {
    const {
      classes,
      disableSpacing
    } = ownerState;
    const slots = {
      root: ["root", !disableSpacing && "spacing"]
    };
    return composeClasses$1(slots, getDialogActionsUtilityClass, classes);
  };
  const DialogActionsRoot = styled("div", {
    name: "MuiDialogActions",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, !ownerState.disableSpacing && styles2.spacing];
    }
  })(({
    ownerState
  }) => _extends$1({
    display: "flex",
    alignItems: "center",
    padding: 8,
    justifyContent: "flex-end",
    flex: "0 0 auto"
  }, !ownerState.disableSpacing && {
    "& > :not(style) ~ :not(style)": {
      marginLeft: 8
    }
  }));
  const DialogActions = /* @__PURE__ */ React$1__namespace.forwardRef(function DialogActions2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiDialogActions"
    });
    const {
      className,
      disableSpacing = false
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$F);
    const ownerState = _extends$1({}, props, {
      disableSpacing
    });
    const classes = useUtilityClasses$y(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogActionsRoot, _extends$1({
      className: clsx(classes.root, className),
      ownerState,
      ref
    }, other));
  });
  const DialogActions$1 = DialogActions;
  function getDialogContentUtilityClass(slot) {
    return generateUtilityClass$2("MuiDialogContent", slot);
  }
  generateUtilityClasses$2("MuiDialogContent", ["root", "dividers"]);
  function getDialogTitleUtilityClass(slot) {
    return generateUtilityClass$2("MuiDialogTitle", slot);
  }
  const dialogTitleClasses = generateUtilityClasses$2("MuiDialogTitle", ["root"]);
  const dialogTitleClasses$1 = dialogTitleClasses;
  const _excluded$E = ["className", "dividers"];
  const useUtilityClasses$x = (ownerState) => {
    const {
      classes,
      dividers
    } = ownerState;
    const slots = {
      root: ["root", dividers && "dividers"]
    };
    return composeClasses$1(slots, getDialogContentUtilityClass, classes);
  };
  const DialogContentRoot = styled("div", {
    name: "MuiDialogContent",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.dividers && styles2.dividers];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    flex: "1 1 auto",
    // Add iOS momentum scrolling for iOS < 13.0
    WebkitOverflowScrolling: "touch",
    overflowY: "auto",
    padding: "20px 24px"
  }, ownerState.dividers ? {
    padding: "16px 24px",
    borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`
  } : {
    [`.${dialogTitleClasses$1.root} + &`]: {
      paddingTop: 0
    }
  }));
  const DialogContent = /* @__PURE__ */ React$1__namespace.forwardRef(function DialogContent2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiDialogContent"
    });
    const {
      className,
      dividers = false
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$E);
    const ownerState = _extends$1({}, props, {
      dividers
    });
    const classes = useUtilityClasses$x(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentRoot, _extends$1({
      className: clsx(classes.root, className),
      ownerState,
      ref
    }, other));
  });
  const DialogContent$1 = DialogContent;
  const _excluded$D = ["className", "id"];
  const useUtilityClasses$w = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"]
    };
    return composeClasses$1(slots, getDialogTitleUtilityClass, classes);
  };
  const DialogTitleRoot = styled(Typography$2, {
    name: "MuiDialogTitle",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({
    padding: "16px 24px",
    flex: "0 0 auto"
  });
  const DialogTitle = /* @__PURE__ */ React$1__namespace.forwardRef(function DialogTitle2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiDialogTitle"
    });
    const {
      className,
      id: idProp
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$D);
    const ownerState = props;
    const classes = useUtilityClasses$w(ownerState);
    const {
      titleId = idProp
    } = React$1__namespace.useContext(DialogContext$1);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitleRoot, _extends$1({
      component: "h2",
      className: clsx(classes.root, className),
      ownerState,
      ref,
      variant: "h6",
      id: idProp != null ? idProp : titleId
    }, other));
  });
  const DialogTitle$1 = DialogTitle;
  function getSkeletonUtilityClass(slot) {
    return generateUtilityClass$2("MuiSkeleton", slot);
  }
  generateUtilityClasses$2("MuiSkeleton", ["root", "text", "rectangular", "rounded", "circular", "pulse", "wave", "withChildren", "fitContent", "heightAuto"]);
  const _excluded$C = ["animation", "className", "component", "height", "style", "variant", "width"];
  let _$1 = (t2) => t2, _t$1, _t2$1, _t3$1, _t4$1;
  const useUtilityClasses$v = (ownerState) => {
    const {
      classes,
      variant,
      animation,
      hasChildren,
      width: width2,
      height: height2
    } = ownerState;
    const slots = {
      root: ["root", variant, animation, hasChildren && "withChildren", hasChildren && !width2 && "fitContent", hasChildren && !height2 && "heightAuto"]
    };
    return composeClasses$1(slots, getSkeletonUtilityClass, classes);
  };
  const pulseKeyframe = keyframes(_t$1 || (_t$1 = _$1`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`));
  const waveKeyframe = keyframes(_t2$1 || (_t2$1 = _$1`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`));
  const SkeletonRoot = styled("span", {
    name: "MuiSkeleton",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], ownerState.animation !== false && styles2[ownerState.animation], ownerState.hasChildren && styles2.withChildren, ownerState.hasChildren && !ownerState.width && styles2.fitContent, ownerState.hasChildren && !ownerState.height && styles2.heightAuto];
    }
  })(({
    theme,
    ownerState
  }) => {
    const radiusUnit = getUnit(theme.shape.borderRadius) || "px";
    const radiusValue = toUnitless(theme.shape.borderRadius);
    return _extends$1({
      display: "block",
      // Create a "on paper" color with sufficient contrast retaining the color
      backgroundColor: theme.vars ? theme.vars.palette.Skeleton.bg : alpha(theme.palette.text.primary, theme.palette.mode === "light" ? 0.11 : 0.13),
      height: "1.2em"
    }, ownerState.variant === "text" && {
      marginTop: 0,
      marginBottom: 0,
      height: "auto",
      transformOrigin: "0 55%",
      transform: "scale(1, 0.60)",
      borderRadius: `${radiusValue}${radiusUnit}/${Math.round(radiusValue / 0.6 * 10) / 10}${radiusUnit}`,
      "&:empty:before": {
        content: '"\\00a0"'
      }
    }, ownerState.variant === "circular" && {
      borderRadius: "50%"
    }, ownerState.variant === "rounded" && {
      borderRadius: (theme.vars || theme).shape.borderRadius
    }, ownerState.hasChildren && {
      "& > *": {
        visibility: "hidden"
      }
    }, ownerState.hasChildren && !ownerState.width && {
      maxWidth: "fit-content"
    }, ownerState.hasChildren && !ownerState.height && {
      height: "auto"
    });
  }, ({
    ownerState
  }) => ownerState.animation === "pulse" && css(_t3$1 || (_t3$1 = _$1`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `), pulseKeyframe), ({
    ownerState,
    theme
  }) => ownerState.animation === "wave" && css(_t4$1 || (_t4$1 = _$1`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `), waveKeyframe, (theme.vars || theme).palette.action.hover));
  const Skeleton = /* @__PURE__ */ React$1__namespace.forwardRef(function Skeleton2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiSkeleton"
    });
    const {
      animation = "pulse",
      className,
      component = "span",
      height: height2,
      style: style2,
      variant = "text",
      width: width2
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$C);
    const ownerState = _extends$1({}, props, {
      animation,
      component,
      variant,
      hasChildren: Boolean(other.children)
    });
    const classes = useUtilityClasses$v(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRoot, _extends$1({
      as: component,
      ref,
      className: clsx(classes.root, className),
      ownerState
    }, other, {
      style: _extends$1({
        width: width2,
        height: height2
      }, style2)
    }));
  });
  const Skeleton$1 = Skeleton;
  const _excluded$B = ["addEndListener", "appear", "children", "easing", "in", "onEnter", "onEntered", "onEntering", "onExit", "onExited", "onExiting", "style", "timeout", "TransitionComponent"];
  function getScale(value) {
    return `scale(${value}, ${value ** 2})`;
  }
  const styles$1 = {
    entering: {
      opacity: 1,
      transform: getScale(1)
    },
    entered: {
      opacity: 1,
      transform: "none"
    }
  };
  const isWebKit154 = typeof navigator !== "undefined" && /^((?!chrome|android).)*(safari|mobile)/i.test(navigator.userAgent) && /(os |version\/)15(.|_)4/i.test(navigator.userAgent);
  const Grow = /* @__PURE__ */ React$1__namespace.forwardRef(function Grow2(props, ref) {
    const {
      addEndListener,
      appear = true,
      children,
      easing: easing2,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style: style2,
      timeout = "auto",
      // eslint-disable-next-line react/prop-types
      TransitionComponent = Transition$1
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$B);
    const timer = useTimeout();
    const autoTimeout = React$1__namespace.useRef();
    const theme = useTheme$1();
    const nodeRef = React$1__namespace.useRef(null);
    const handleRef = useForkRef(nodeRef, children.ref, ref);
    const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
      if (callback) {
        const node2 = nodeRef.current;
        if (maybeIsAppearing === void 0) {
          callback(node2);
        } else {
          callback(node2, maybeIsAppearing);
        }
      }
    };
    const handleEntering = normalizedTransitionCallback(onEntering);
    const handleEnter = normalizedTransitionCallback((node2, isAppearing) => {
      reflow(node2);
      const {
        duration: transitionDuration,
        delay,
        easing: transitionTimingFunction
      } = getTransitionProps({
        style: style2,
        timeout,
        easing: easing2
      }, {
        mode: "enter"
      });
      let duration2;
      if (timeout === "auto") {
        duration2 = theme.transitions.getAutoHeightDuration(node2.clientHeight);
        autoTimeout.current = duration2;
      } else {
        duration2 = transitionDuration;
      }
      node2.style.transition = [theme.transitions.create("opacity", {
        duration: duration2,
        delay
      }), theme.transitions.create("transform", {
        duration: isWebKit154 ? duration2 : duration2 * 0.666,
        delay,
        easing: transitionTimingFunction
      })].join(",");
      if (onEnter) {
        onEnter(node2, isAppearing);
      }
    });
    const handleEntered = normalizedTransitionCallback(onEntered);
    const handleExiting = normalizedTransitionCallback(onExiting);
    const handleExit = normalizedTransitionCallback((node2) => {
      const {
        duration: transitionDuration,
        delay,
        easing: transitionTimingFunction
      } = getTransitionProps({
        style: style2,
        timeout,
        easing: easing2
      }, {
        mode: "exit"
      });
      let duration2;
      if (timeout === "auto") {
        duration2 = theme.transitions.getAutoHeightDuration(node2.clientHeight);
        autoTimeout.current = duration2;
      } else {
        duration2 = transitionDuration;
      }
      node2.style.transition = [theme.transitions.create("opacity", {
        duration: duration2,
        delay
      }), theme.transitions.create("transform", {
        duration: isWebKit154 ? duration2 : duration2 * 0.666,
        delay: isWebKit154 ? delay : delay || duration2 * 0.333,
        easing: transitionTimingFunction
      })].join(",");
      node2.style.opacity = 0;
      node2.style.transform = getScale(0.75);
      if (onExit) {
        onExit(node2);
      }
    });
    const handleExited = normalizedTransitionCallback(onExited);
    const handleAddEndListener = (next2) => {
      if (timeout === "auto") {
        timer.start(autoTimeout.current || 0, next2);
      }
      if (addEndListener) {
        addEndListener(nodeRef.current, next2);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
      appear,
      in: inProp,
      nodeRef,
      onEnter: handleEnter,
      onEntered: handleEntered,
      onEntering: handleEntering,
      onExit: handleExit,
      onExited: handleExited,
      onExiting: handleExiting,
      addEndListener: handleAddEndListener,
      timeout: timeout === "auto" ? null : timeout
    }, other, {
      children: (state, childProps) => {
        return /* @__PURE__ */ React$1__namespace.cloneElement(children, _extends$1({
          style: _extends$1({
            opacity: 0,
            transform: getScale(0.75),
            visibility: state === "exited" && !inProp ? "hidden" : void 0
          }, styles$1[state], style2, children.props.style),
          ref: handleRef
        }, childProps));
      }
    }));
  });
  Grow.muiSupportAuto = true;
  const Grow$1 = Grow;
  var top = "top";
  var bottom = "bottom";
  var right = "right";
  var left = "left";
  var auto = "auto";
  var basePlacements = [top, bottom, right, left];
  var start = "start";
  var end = "end";
  var clippingParents = "clippingParents";
  var viewport = "viewport";
  var popper = "popper";
  var reference = "reference";
  var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []);
  var beforeRead = "beforeRead";
  var read = "read";
  var afterRead = "afterRead";
  var beforeMain = "beforeMain";
  var main = "main";
  var afterMain = "afterMain";
  var beforeWrite = "beforeWrite";
  var write = "write";
  var afterWrite = "afterWrite";
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
  }
  function getWindow(node2) {
    if (node2 == null) {
      return window;
    }
    if (node2.toString() !== "[object Window]") {
      var ownerDocument2 = node2.ownerDocument;
      return ownerDocument2 ? ownerDocument2.defaultView || window : window;
    }
    return node2;
  }
  function isElement(node2) {
    var OwnElement = getWindow(node2).Element;
    return node2 instanceof OwnElement || node2 instanceof Element;
  }
  function isHTMLElement$1(node2) {
    var OwnElement = getWindow(node2).HTMLElement;
    return node2 instanceof OwnElement || node2 instanceof HTMLElement;
  }
  function isShadowRoot(node2) {
    if (typeof ShadowRoot === "undefined") {
      return false;
    }
    var OwnElement = getWindow(node2).ShadowRoot;
    return node2 instanceof OwnElement || node2 instanceof ShadowRoot;
  }
  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function(name) {
      var style2 = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name];
      if (!isHTMLElement$1(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style2);
      Object.keys(attributes).forEach(function(name2) {
        var value = attributes[name2];
        if (value === false) {
          element.removeAttribute(name2);
        } else {
          element.setAttribute(name2, value === true ? "" : value);
        }
      });
    });
  }
  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
    return function() {
      Object.keys(state.elements).forEach(function(name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
        var style2 = styleProperties.reduce(function(style3, property2) {
          style3[property2] = "";
          return style3;
        }, {});
        if (!isHTMLElement$1(element) || !getNodeName(element)) {
          return;
        }
        Object.assign(element.style, style2);
        Object.keys(attributes).forEach(function(attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  }
  const applyStyles$1 = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: applyStyles,
    effect: effect$2,
    requires: ["computeStyles"]
  };
  function getBasePlacement(placement) {
    return placement.split("-")[0];
  }
  var max = Math.max;
  var min = Math.min;
  var round$1 = Math.round;
  function getUAString() {
    var uaData = navigator.userAgentData;
    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function(item) {
        return item.brand + "/" + item.version;
      }).join(" ");
    }
    return navigator.userAgent;
  }
  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if (includeScale && isHTMLElement$1(element)) {
      scaleX = element.offsetWidth > 0 ? round$1(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round$1(clientRect.height) / element.offsetHeight || 1 : 1;
    }
    var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x2 = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y2 = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width2 = clientRect.width / scaleX;
    var height2 = clientRect.height / scaleY;
    return {
      width: width2,
      height: height2,
      top: y2,
      right: x2 + width2,
      bottom: y2 + height2,
      left: x2,
      x: x2,
      y: y2
    };
  }
  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element);
    var width2 = element.offsetWidth;
    var height2 = element.offsetHeight;
    if (Math.abs(clientRect.width - width2) <= 1) {
      width2 = clientRect.width;
    }
    if (Math.abs(clientRect.height - height2) <= 1) {
      height2 = clientRect.height;
    }
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width2,
      height: height2
    };
  }
  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode();
    if (parent.contains(child)) {
      return true;
    } else if (rootNode && isShadowRoot(rootNode)) {
      var next2 = child;
      do {
        if (next2 && parent.isSameNode(next2)) {
          return true;
        }
        next2 = next2.parentNode || next2.host;
      } while (next2);
    }
    return false;
  }
  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
  }
  function getDocumentElement(element) {
    return ((isElement(element) ? element.ownerDocument : (
      // $FlowFixMe[prop-missing]
      element.document
    )) || window.document).documentElement;
  }
  function getParentNode(element) {
    if (getNodeName(element) === "html") {
      return element;
    }
    return (
      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || // DOM Element detected
      (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element)
    );
  }
  function getTrueOffsetParent(element) {
    if (!isHTMLElement$1(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === "fixed") {
      return null;
    }
    return element.offsetParent;
  }
  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());
    if (isIE && isHTMLElement$1(element)) {
      var elementCss = getComputedStyle(element);
      if (elementCss.position === "fixed") {
        return null;
      }
    }
    var currentNode = getParentNode(element);
    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }
    while (isHTMLElement$1(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
      var css2 = getComputedStyle(currentNode);
      if (css2.transform !== "none" || css2.perspective !== "none" || css2.contain === "paint" || ["transform", "perspective"].indexOf(css2.willChange) !== -1 || isFirefox && css2.willChange === "filter" || isFirefox && css2.filter && css2.filter !== "none") {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }
    return null;
  }
  function getOffsetParent(element) {
    var window2 = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
      offsetParent = getTrueOffsetParent(offsetParent);
    }
    if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
      return window2;
    }
    return offsetParent || getContainingBlock(element) || window2;
  }
  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
  }
  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }
  function withinMaxClamp(min2, value, max2) {
    var v2 = within(min2, value, max2);
    return v2 > max2 ? max2 : v2;
  }
  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }
  function expandToHashMap(value, keys2) {
    return keys2.reduce(function(hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }
  var toPaddingObject = function toPaddingObject2(padding2, state) {
    padding2 = typeof padding2 === "function" ? padding2(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding2;
    return mergePaddingObject(typeof padding2 !== "number" ? padding2 : expandToHashMap(padding2, basePlacements));
  };
  function arrow(_ref) {
    var _state$modifiersData$;
    var state = _ref.state, name = _ref.name, options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? "height" : "width";
    if (!arrowElement || !popperOffsets2) {
      return;
    }
    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === "y" ? top : left;
    var maxProp = axis === "y" ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
    var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2;
    var min2 = paddingObject[minProp];
    var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset2 = within(min2, center, max2);
    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
  }
  function effect$1(_ref2) {
    var state = _ref2.state, options = _ref2.options;
    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
    if (arrowElement == null) {
      return;
    }
    if (typeof arrowElement === "string") {
      arrowElement = state.elements.popper.querySelector(arrowElement);
      if (!arrowElement) {
        return;
      }
    }
    if (!contains(state.elements.popper, arrowElement)) {
      return;
    }
    state.elements.arrow = arrowElement;
  }
  const arrow$1 = {
    name: "arrow",
    enabled: true,
    phase: "main",
    fn: arrow,
    effect: effect$1,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };
  function getVariation(placement) {
    return placement.split("-")[1];
  }
  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  function roundOffsetsByDPR(_ref, win) {
    var x2 = _ref.x, y2 = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round$1(x2 * dpr) / dpr || 0,
      y: round$1(y2 * dpr) / dpr || 0
    };
  }
  function mapToStyles(_ref2) {
    var _Object$assign2;
    var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position2 = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x2 = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y2 = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
      x: x2,
      y: y2
    }) : {
      x: x2,
      y: y2
    };
    x2 = _ref3.x;
    y2 = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = left;
    var sideY = top;
    var win = window;
    if (adaptive) {
      var offsetParent = getOffsetParent(popper2);
      var heightProp = "clientHeight";
      var widthProp = "clientWidth";
      if (offsetParent === getWindow(popper2)) {
        offsetParent = getDocumentElement(popper2);
        if (getComputedStyle(offsetParent).position !== "static" && position2 === "absolute") {
          heightProp = "scrollHeight";
          widthProp = "scrollWidth";
        }
      }
      offsetParent = offsetParent;
      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
          // $FlowFixMe[prop-missing]
          offsetParent[heightProp]
        );
        y2 -= offsetY - popperRect.height;
        y2 *= gpuAcceleration ? 1 : -1;
      }
      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
          // $FlowFixMe[prop-missing]
          offsetParent[widthProp]
        );
        x2 -= offsetX - popperRect.width;
        x2 *= gpuAcceleration ? 1 : -1;
      }
    }
    var commonStyles = Object.assign({
      position: position2
    }, adaptive && unsetSides);
    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x: x2,
      y: y2
    }, getWindow(popper2)) : {
      x: x2,
      y: y2
    };
    x2 = _ref4.x;
    y2 = _ref4.y;
    if (gpuAcceleration) {
      var _Object$assign;
      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x2 + "px, " + y2 + "px)" : "translate3d(" + x2 + "px, " + y2 + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y2 + "px" : "", _Object$assign2[sideX] = hasX ? x2 + "px" : "", _Object$assign2.transform = "", _Object$assign2));
  }
  function computeStyles(_ref5) {
    var state = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration,
      isFixed: state.options.strategy === "fixed"
    };
    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive,
        roundOffsets
      })));
    }
    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: "absolute",
        adaptive: false,
        roundOffsets
      })));
    }
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-placement": state.placement
    });
  }
  const computeStyles$1 = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {}
  };
  var passive = {
    passive: true
  };
  function effect(_ref) {
    var state = _ref.state, instance = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window2 = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.addEventListener("resize", instance.update, passive);
    }
    return function() {
      if (scroll) {
        scrollParents.forEach(function(scrollParent) {
          scrollParent.removeEventListener("scroll", instance.update, passive);
        });
      }
      if (resize) {
        window2.removeEventListener("resize", instance.update, passive);
      }
    };
  }
  const eventListeners = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn() {
    },
    effect,
    data: {}
  };
  var hash$1 = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function(matched) {
      return hash$1[matched];
    });
  }
  var hash = {
    start: "end",
    end: "start"
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function(matched) {
      return hash[matched];
    });
  }
  function getWindowScroll(node2) {
    var win = getWindow(node2);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft,
      scrollTop
    };
  }
  function getWindowScrollBarX(element) {
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }
  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width2 = html.clientWidth;
    var height2 = html.clientHeight;
    var x2 = 0;
    var y2 = 0;
    if (visualViewport) {
      width2 = visualViewport.width;
      height2 = visualViewport.height;
      var layoutViewport = isLayoutViewport();
      if (layoutViewport || !layoutViewport && strategy === "fixed") {
        x2 = visualViewport.offsetLeft;
        y2 = visualViewport.offsetTop;
      }
    }
    return {
      width: width2,
      height: height2,
      x: x2 + getWindowScrollBarX(element),
      y: y2
    };
  }
  function getDocumentRect(element) {
    var _element$ownerDocumen;
    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width2 = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height2 = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x2 = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y2 = -winScroll.scrollTop;
    if (getComputedStyle(body || html).direction === "rtl") {
      x2 += max(html.clientWidth, body ? body.clientWidth : 0) - width2;
    }
    return {
      width: width2,
      height: height2,
      x: x2,
      y: y2
    };
  }
  function isScrollParent(element) {
    var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }
  function getScrollParent(node2) {
    if (["html", "body", "#document"].indexOf(getNodeName(node2)) >= 0) {
      return node2.ownerDocument.body;
    }
    if (isHTMLElement$1(node2) && isScrollParent(node2)) {
      return node2;
    }
    return getScrollParent(getParentNode(node2));
  }
  function listScrollParents(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) {
      list = [];
    }
    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : (
      // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)))
    );
  }
  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }
  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === "fixed");
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }
  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  }
  function getClippingParents(element) {
    var clippingParents2 = listScrollParents(getParentNode(element));
    var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement$1(element) ? getOffsetParent(element) : element;
    if (!isElement(clipperElement)) {
      return [];
    }
    return clippingParents2.filter(function(clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
    });
  }
  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
    var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents2[0];
    var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }
  function computeOffsets(_ref) {
    var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference2.x + reference2.width / 2 - element.width / 2;
    var commonY = reference2.y + reference2.height / 2 - element.height / 2;
    var offsets;
    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference2.y - element.height
        };
        break;
      case bottom:
        offsets = {
          x: commonX,
          y: reference2.y + reference2.height
        };
        break;
      case right:
        offsets = {
          x: reference2.x + reference2.width,
          y: commonY
        };
        break;
      case left:
        offsets = {
          x: reference2.x - element.width,
          y: commonY
        };
        break;
      default:
        offsets = {
          x: reference2.x,
          y: reference2.y
        };
    }
    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
    if (mainAxis != null) {
      var len = mainAxis === "y" ? "height" : "width";
      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
          break;
        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
          break;
      }
    }
    return offsets;
  }
  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding2 = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding2 !== "number" ? padding2 : expandToHashMap(padding2, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets2 = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: "absolute",
      placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset;
    if (elementContext === popper && offsetData) {
      var offset2 = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function(key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
        overflowOffsets[key] += offset2[axis] * multiply;
      });
    }
    return overflowOffsets;
  }
  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding2 = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
      return getVariation(placement2) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function(placement2) {
      return allowedAutoPlacements.indexOf(placement2) >= 0;
    });
    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    }
    var overflows = allowedPlacements.reduce(function(acc, placement2) {
      acc[placement2] = detectOverflow(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding: padding2
      })[getBasePlacement(placement2)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function(a, b2) {
      return overflows[a] - overflows[b2];
    });
  }
  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }
    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }
  function flip(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    if (state.modifiersData[name]._skip) {
      return;
    }
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding2 = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
      return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding: padding2,
        flipVariations,
        allowedAutoPlacements
      }) : placement2);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = /* @__PURE__ */ new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements2[0];
    for (var i = 0; i < placements2.length; i++) {
      var placement = placements2[i];
      var _basePlacement = getBasePlacement(placement);
      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? "width" : "height";
      var overflow = detectOverflow(state, {
        placement,
        boundary,
        rootBoundary,
        altBoundary,
        padding: padding2
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }
      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];
      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }
      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }
      if (checks.every(function(check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }
      checksMap.set(placement, checks);
    }
    if (makeFallbackChecks) {
      var numberOfChecks = flipVariations ? 3 : 1;
      var _loop = function _loop2(_i2) {
        var fittingPlacement = placements2.find(function(placement2) {
          var checks2 = checksMap.get(placement2);
          if (checks2) {
            return checks2.slice(0, _i2).every(function(check) {
              return check;
            });
          }
        });
        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };
      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);
        if (_ret === "break")
          break;
      }
    }
    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  }
  const flip$1 = {
    name: "flip",
    enabled: true,
    phase: "main",
    fn: flip,
    requiresIfExists: ["offset"],
    data: {
      _skip: false
    }
  };
  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }
    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }
  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function(side) {
      return overflow[side] >= 0;
    });
  }
  function hide(_ref) {
    var state = _ref.state, name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: "reference"
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets,
      popperEscapeOffsets,
      isReferenceHidden,
      hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-reference-hidden": isReferenceHidden,
      "data-popper-escaped": hasPopperEscaped
    });
  }
  const hide$1 = {
    name: "hide",
    enabled: true,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide
  };
  function distanceAndSkiddingToXY(placement, rects, offset2) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
      placement
    })) : offset2, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }
  function offset(_ref2) {
    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
    var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function(acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement], x2 = _data$state$placement.x, y2 = _data$state$placement.y;
    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x2;
      state.modifiersData.popperOffsets.y += y2;
    }
    state.modifiersData[name] = data;
  }
  const offset$1 = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset
  };
  function popperOffsets(_ref) {
    var state = _ref.state, name = _ref.name;
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: "absolute",
      placement: state.placement
    });
  }
  const popperOffsets$1 = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: popperOffsets,
    data: {}
  };
  function getAltAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function preventOverflow(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding2 = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary,
      rootBoundary,
      padding: padding2,
      altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
      x: 0,
      y: 0
    };
    if (!popperOffsets2) {
      return;
    }
    if (checkMainAxis) {
      var _offsetModifierState$;
      var mainSide = mainAxis === "y" ? top : left;
      var altSide = mainAxis === "y" ? bottom : right;
      var len = mainAxis === "y" ? "height" : "width";
      var offset2 = popperOffsets2[mainAxis];
      var min$1 = offset2 + overflow[mainSide];
      var max$1 = offset2 - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide];
      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset2 + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets2[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset2;
    }
    if (checkAltAxis) {
      var _offsetModifierState$2;
      var _mainSide = mainAxis === "x" ? top : left;
      var _altSide = mainAxis === "x" ? bottom : right;
      var _offset = popperOffsets2[altAxis];
      var _len = altAxis === "y" ? "height" : "width";
      var _min = _offset + overflow[_mainSide];
      var _max = _offset - overflow[_altSide];
      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
      popperOffsets2[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
    state.modifiersData[name] = data;
  }
  const preventOverflow$1 = {
    name: "preventOverflow",
    enabled: true,
    phase: "main",
    fn: preventOverflow,
    requiresIfExists: ["offset"]
  };
  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  function getNodeScroll(node2) {
    if (node2 === getWindow(node2) || !isHTMLElement$1(node2)) {
      return getWindowScroll(node2);
    } else {
      return getHTMLElementScroll(node2);
    }
  }
  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round$1(rect.width) / element.offsetWidth || 1;
    var scaleY = round$1(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  }
  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    var isOffsetParentAnElement = isHTMLElement$1(offsetParent);
    var offsetParentIsScaled = isHTMLElement$1(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement$1(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }
  function order(modifiers) {
    var map = /* @__PURE__ */ new Map();
    var visited = /* @__PURE__ */ new Set();
    var result = [];
    modifiers.forEach(function(modifier) {
      map.set(modifier.name, modifier);
    });
    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function(dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);
          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }
    modifiers.forEach(function(modifier) {
      if (!visited.has(modifier.name)) {
        sort(modifier);
      }
    });
    return result;
  }
  function orderModifiers(modifiers) {
    var orderedModifiers = order(modifiers);
    return modifierPhases.reduce(function(acc, phase) {
      return acc.concat(orderedModifiers.filter(function(modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }
  function debounce(fn2) {
    var pending;
    return function() {
      if (!pending) {
        pending = new Promise(function(resolve) {
          Promise.resolve().then(function() {
            pending = void 0;
            resolve(fn2());
          });
        });
      }
      return pending;
    };
  }
  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function(merged2, current) {
      var existing = merged2[current.name];
      merged2[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged2;
    }, {});
    return Object.keys(merged).map(function(key) {
      return merged[key];
    });
  }
  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return !args.some(function(element) {
      return !(element && typeof element.getBoundingClientRect === "function");
    });
  }
  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper2(reference2, popper2, options) {
      if (options === void 0) {
        options = defaultOptions;
      }
      var state = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference2,
          popper: popper2
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state,
        setOptions: function setOptions(setOptionsAction) {
          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options2);
          state.scrollParents = {
            reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
            popper: listScrollParents(popper2)
          };
          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
          state.orderedModifiers = orderedModifiers.filter(function(m2) {
            return m2.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }
          var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
          if (!areValidElements(reference3, popper3)) {
            return;
          }
          state.rects = {
            reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
            popper: getLayoutRect(popper3)
          };
          state.reset = false;
          state.placement = state.options.placement;
          state.orderedModifiers.forEach(function(modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }
            var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
            if (typeof fn2 === "function") {
              state = fn2({
                state,
                options: _options,
                name,
                instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function() {
          return new Promise(function(resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };
      if (!areValidElements(reference2, popper2)) {
        return instance;
      }
      instance.setOptions(options).then(function(state2) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state2);
        }
      });
      function runModifierEffects() {
        state.orderedModifiers.forEach(function(_ref) {
          var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect2 = _ref.effect;
          if (typeof effect2 === "function") {
            var cleanupFn = effect2({
              state,
              name,
              instance,
              options: options2
            });
            var noopFn = function noopFn2() {
            };
            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }
      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function(fn2) {
          return fn2();
        });
        effectCleanupFns = [];
      }
      return instance;
    };
  }
  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
  var createPopper = /* @__PURE__ */ popperGenerator({
    defaultModifiers
  });
  const GLOBAL_CLASS_PREFIX = "base";
  function buildStateClass(state) {
    return `${GLOBAL_CLASS_PREFIX}--${state}`;
  }
  function buildSlotClass(componentName, slot) {
    return `${GLOBAL_CLASS_PREFIX}-${componentName}-${slot}`;
  }
  function generateUtilityClass$1(componentName, slot) {
    const globalStateClass = globalStateClasses$1[slot];
    return globalStateClass ? buildStateClass(globalStateClass) : buildSlotClass(componentName, slot);
  }
  function generateUtilityClasses$1(componentName, slots) {
    const result = {};
    slots.forEach((slot) => {
      result[slot] = generateUtilityClass$1(componentName, slot);
    });
    return result;
  }
  const COMPONENT_NAME = "Popper";
  function getPopperUtilityClass(slot) {
    return generateUtilityClass$1(COMPONENT_NAME, slot);
  }
  generateUtilityClasses$1(COMPONENT_NAME, ["root"]);
  const _excluded$A = ["anchorEl", "children", "direction", "disablePortal", "modifiers", "open", "placement", "popperOptions", "popperRef", "slotProps", "slots", "TransitionProps", "ownerState"], _excluded2$6 = ["anchorEl", "children", "container", "direction", "disablePortal", "keepMounted", "modifiers", "open", "placement", "popperOptions", "popperRef", "style", "transition", "slotProps", "slots"];
  function flipPlacement(placement, direction) {
    if (direction === "ltr") {
      return placement;
    }
    switch (placement) {
      case "bottom-end":
        return "bottom-start";
      case "bottom-start":
        return "bottom-end";
      case "top-end":
        return "top-start";
      case "top-start":
        return "top-end";
      default:
        return placement;
    }
  }
  function resolveAnchorEl$1(anchorEl) {
    return typeof anchorEl === "function" ? anchorEl() : anchorEl;
  }
  function isHTMLElement(element) {
    return element.nodeType !== void 0;
  }
  const useUtilityClasses$u = () => {
    const slots = {
      root: ["root"]
    };
    return composeClasses$1(slots, useClassNamesOverride(getPopperUtilityClass));
  };
  const defaultPopperOptions = {};
  const PopperTooltip = /* @__PURE__ */ React$1__namespace.forwardRef(function PopperTooltip2(props, forwardedRef) {
    var _slots$root;
    const {
      anchorEl,
      children,
      direction,
      disablePortal,
      modifiers,
      open,
      placement: initialPlacement,
      popperOptions,
      popperRef: popperRefProp,
      slotProps = {},
      slots = {},
      TransitionProps
      // @ts-ignore internal logic
      // prevent from spreading to DOM, it can come from the parent component e.g. Select.
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$A);
    const tooltipRef = React$1__namespace.useRef(null);
    const ownRef = useForkRef(tooltipRef, forwardedRef);
    const popperRef = React$1__namespace.useRef(null);
    const handlePopperRef = useForkRef(popperRef, popperRefProp);
    const handlePopperRefRef = React$1__namespace.useRef(handlePopperRef);
    useEnhancedEffect(() => {
      handlePopperRefRef.current = handlePopperRef;
    }, [handlePopperRef]);
    React$1__namespace.useImperativeHandle(popperRefProp, () => popperRef.current, []);
    const rtlPlacement = flipPlacement(initialPlacement, direction);
    const [placement, setPlacement] = React$1__namespace.useState(rtlPlacement);
    const [resolvedAnchorElement, setResolvedAnchorElement] = React$1__namespace.useState(resolveAnchorEl$1(anchorEl));
    React$1__namespace.useEffect(() => {
      if (popperRef.current) {
        popperRef.current.forceUpdate();
      }
    });
    React$1__namespace.useEffect(() => {
      if (anchorEl) {
        setResolvedAnchorElement(resolveAnchorEl$1(anchorEl));
      }
    }, [anchorEl]);
    useEnhancedEffect(() => {
      if (!resolvedAnchorElement || !open) {
        return void 0;
      }
      const handlePopperUpdate = (data) => {
        setPlacement(data.placement);
      };
      let popperModifiers = [{
        name: "preventOverflow",
        options: {
          altBoundary: disablePortal
        }
      }, {
        name: "flip",
        options: {
          altBoundary: disablePortal
        }
      }, {
        name: "onUpdate",
        enabled: true,
        phase: "afterWrite",
        fn: ({
          state
        }) => {
          handlePopperUpdate(state);
        }
      }];
      if (modifiers != null) {
        popperModifiers = popperModifiers.concat(modifiers);
      }
      if (popperOptions && popperOptions.modifiers != null) {
        popperModifiers = popperModifiers.concat(popperOptions.modifiers);
      }
      const popper2 = createPopper(resolvedAnchorElement, tooltipRef.current, _extends$1({
        placement: rtlPlacement
      }, popperOptions, {
        modifiers: popperModifiers
      }));
      handlePopperRefRef.current(popper2);
      return () => {
        popper2.destroy();
        handlePopperRefRef.current(null);
      };
    }, [resolvedAnchorElement, disablePortal, modifiers, open, popperOptions, rtlPlacement]);
    const childProps = {
      placement
    };
    if (TransitionProps !== null) {
      childProps.TransitionProps = TransitionProps;
    }
    const classes = useUtilityClasses$u();
    const Root = (_slots$root = slots.root) != null ? _slots$root : "div";
    const rootProps = useSlotProps({
      elementType: Root,
      externalSlotProps: slotProps.root,
      externalForwardedProps: other,
      additionalProps: {
        role: "tooltip",
        ref: ownRef
      },
      ownerState: props,
      className: classes.root
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, _extends$1({}, rootProps, {
      children: typeof children === "function" ? children(childProps) : children
    }));
  });
  const Popper$2 = /* @__PURE__ */ React$1__namespace.forwardRef(function Popper2(props, forwardedRef) {
    const {
      anchorEl,
      children,
      container: containerProp,
      direction = "ltr",
      disablePortal = false,
      keepMounted = false,
      modifiers,
      open,
      placement = "bottom",
      popperOptions = defaultPopperOptions,
      popperRef,
      style: style2,
      transition = false,
      slotProps = {},
      slots = {}
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded2$6);
    const [exited, setExited] = React$1__namespace.useState(true);
    const handleEnter = () => {
      setExited(false);
    };
    const handleExited = () => {
      setExited(true);
    };
    if (!keepMounted && !open && (!transition || exited)) {
      return null;
    }
    let container;
    if (containerProp) {
      container = containerProp;
    } else if (anchorEl) {
      const resolvedAnchorEl = resolveAnchorEl$1(anchorEl);
      container = resolvedAnchorEl && isHTMLElement(resolvedAnchorEl) ? ownerDocument(resolvedAnchorEl).body : ownerDocument(null).body;
    }
    const display = !open && keepMounted && (!transition || exited) ? "none" : void 0;
    const transitionProps = transition ? {
      in: open,
      onEnter: handleEnter,
      onExited: handleExited
    } : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, {
      disablePortal,
      container,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(PopperTooltip, _extends$1({
        anchorEl,
        direction,
        disablePortal,
        modifiers,
        ref: forwardedRef,
        open: transition ? !exited : open,
        placement,
        popperOptions,
        popperRef,
        slotProps,
        slots
      }, other, {
        style: _extends$1({
          // Prevents scroll issue, waiting for Popper.js to add this style once initiated.
          position: "fixed",
          // Fix Popper.js display issue
          top: 0,
          left: 0,
          display
        }, style2),
        TransitionProps: transitionProps,
        children
      }))
    });
  });
  var useThemeWithoutDefault = {};
  Object.defineProperty(useThemeWithoutDefault, "__esModule", {
    value: true
  });
  var default_1$1 = useThemeWithoutDefault.default = void 0;
  var React = _interopRequireWildcard(React$1);
  var _styledEngine = require$$1;
  function _getRequireWildcardCache(e2) {
    if ("function" != typeof WeakMap)
      return null;
    var r2 = /* @__PURE__ */ new WeakMap(), t2 = /* @__PURE__ */ new WeakMap();
    return (_getRequireWildcardCache = function(e3) {
      return e3 ? t2 : r2;
    })(e2);
  }
  function _interopRequireWildcard(e2, r2) {
    if (!r2 && e2 && e2.__esModule)
      return e2;
    if (null === e2 || "object" != typeof e2 && "function" != typeof e2)
      return { default: e2 };
    var t2 = _getRequireWildcardCache(r2);
    if (t2 && t2.has(e2))
      return t2.get(e2);
    var n2 = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var u2 in e2)
      if ("default" !== u2 && Object.prototype.hasOwnProperty.call(e2, u2)) {
        var i = a ? Object.getOwnPropertyDescriptor(e2, u2) : null;
        i && (i.get || i.set) ? Object.defineProperty(n2, u2, i) : n2[u2] = e2[u2];
      }
    return n2.default = e2, t2 && t2.set(e2, n2), n2;
  }
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  function useTheme(defaultTheme2 = null) {
    const contextTheme = React.useContext(_styledEngine.ThemeContext);
    return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme2 : contextTheme;
  }
  default_1$1 = useThemeWithoutDefault.default = useTheme;
  const _excluded$z = ["anchorEl", "component", "components", "componentsProps", "container", "disablePortal", "keepMounted", "modifiers", "open", "placement", "popperOptions", "popperRef", "transition", "slots", "slotProps"];
  const PopperRoot = styled(Popper$2, {
    name: "MuiPopper",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({});
  const Popper = /* @__PURE__ */ React$1__namespace.forwardRef(function Popper22(inProps, ref) {
    var _slots$root;
    const theme = default_1$1();
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiPopper"
    });
    const {
      anchorEl,
      component,
      components,
      componentsProps,
      container,
      disablePortal,
      keepMounted,
      modifiers,
      open,
      placement,
      popperOptions,
      popperRef,
      transition,
      slots,
      slotProps
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$z);
    const RootComponent = (_slots$root = slots == null ? void 0 : slots.root) != null ? _slots$root : components == null ? void 0 : components.Root;
    const otherProps = _extends$1({
      anchorEl,
      container,
      disablePortal,
      keepMounted,
      modifiers,
      open,
      placement,
      popperOptions,
      popperRef,
      transition
    }, other);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PopperRoot, _extends$1({
      as: component,
      direction: theme == null ? void 0 : theme.direction,
      slots: {
        root: RootComponent
      },
      slotProps: slotProps != null ? slotProps : componentsProps
    }, otherProps, {
      ref
    }));
  });
  const Popper$1 = Popper;
  function getTooltipUtilityClass(slot) {
    return generateUtilityClass$2("MuiTooltip", slot);
  }
  const tooltipClasses = generateUtilityClasses$2("MuiTooltip", ["popper", "popperInteractive", "popperArrow", "popperClose", "tooltip", "tooltipArrow", "touch", "tooltipPlacementLeft", "tooltipPlacementRight", "tooltipPlacementTop", "tooltipPlacementBottom", "arrow"]);
  const tooltipClasses$1 = tooltipClasses;
  const _excluded$y = ["arrow", "children", "classes", "components", "componentsProps", "describeChild", "disableFocusListener", "disableHoverListener", "disableInteractive", "disableTouchListener", "enterDelay", "enterNextDelay", "enterTouchDelay", "followCursor", "id", "leaveDelay", "leaveTouchDelay", "onClose", "onOpen", "open", "placement", "PopperComponent", "PopperProps", "slotProps", "slots", "title", "TransitionComponent", "TransitionProps"];
  function round(value) {
    return Math.round(value * 1e5) / 1e5;
  }
  const useUtilityClasses$t = (ownerState) => {
    const {
      classes,
      disableInteractive,
      arrow: arrow2,
      touch,
      placement
    } = ownerState;
    const slots = {
      popper: ["popper", !disableInteractive && "popperInteractive", arrow2 && "popperArrow"],
      tooltip: ["tooltip", arrow2 && "tooltipArrow", touch && "touch", `tooltipPlacement${capitalize$1(placement.split("-")[0])}`],
      arrow: ["arrow"]
    };
    return composeClasses$1(slots, getTooltipUtilityClass, classes);
  };
  const TooltipPopper = styled(Popper$1, {
    name: "MuiTooltip",
    slot: "Popper",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.popper, !ownerState.disableInteractive && styles2.popperInteractive, ownerState.arrow && styles2.popperArrow, !ownerState.open && styles2.popperClose];
    }
  })(({
    theme,
    ownerState,
    open
  }) => _extends$1({
    zIndex: (theme.vars || theme).zIndex.tooltip,
    pointerEvents: "none"
  }, !ownerState.disableInteractive && {
    pointerEvents: "auto"
  }, !open && {
    pointerEvents: "none"
  }, ownerState.arrow && {
    [`&[data-popper-placement*="bottom"] .${tooltipClasses$1.arrow}`]: {
      top: 0,
      marginTop: "-0.71em",
      "&::before": {
        transformOrigin: "0 100%"
      }
    },
    [`&[data-popper-placement*="top"] .${tooltipClasses$1.arrow}`]: {
      bottom: 0,
      marginBottom: "-0.71em",
      "&::before": {
        transformOrigin: "100% 0"
      }
    },
    [`&[data-popper-placement*="right"] .${tooltipClasses$1.arrow}`]: _extends$1({}, !ownerState.isRtl ? {
      left: 0,
      marginLeft: "-0.71em"
    } : {
      right: 0,
      marginRight: "-0.71em"
    }, {
      height: "1em",
      width: "0.71em",
      "&::before": {
        transformOrigin: "100% 100%"
      }
    }),
    [`&[data-popper-placement*="left"] .${tooltipClasses$1.arrow}`]: _extends$1({}, !ownerState.isRtl ? {
      right: 0,
      marginRight: "-0.71em"
    } : {
      left: 0,
      marginLeft: "-0.71em"
    }, {
      height: "1em",
      width: "0.71em",
      "&::before": {
        transformOrigin: "0 0"
      }
    })
  }));
  const TooltipTooltip = styled("div", {
    name: "MuiTooltip",
    slot: "Tooltip",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.tooltip, ownerState.touch && styles2.touch, ownerState.arrow && styles2.tooltipArrow, styles2[`tooltipPlacement${capitalize$1(ownerState.placement.split("-")[0])}`]];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    backgroundColor: theme.vars ? theme.vars.palette.Tooltip.bg : alpha_1(theme.palette.grey[700], 0.92),
    borderRadius: (theme.vars || theme).shape.borderRadius,
    color: (theme.vars || theme).palette.common.white,
    fontFamily: theme.typography.fontFamily,
    padding: "4px 8px",
    fontSize: theme.typography.pxToRem(11),
    maxWidth: 300,
    margin: 2,
    wordWrap: "break-word",
    fontWeight: theme.typography.fontWeightMedium
  }, ownerState.arrow && {
    position: "relative",
    margin: 0
  }, ownerState.touch && {
    padding: "8px 16px",
    fontSize: theme.typography.pxToRem(14),
    lineHeight: `${round(16 / 14)}em`,
    fontWeight: theme.typography.fontWeightRegular
  }, {
    [`.${tooltipClasses$1.popper}[data-popper-placement*="left"] &`]: _extends$1({
      transformOrigin: "right center"
    }, !ownerState.isRtl ? _extends$1({
      marginRight: "14px"
    }, ownerState.touch && {
      marginRight: "24px"
    }) : _extends$1({
      marginLeft: "14px"
    }, ownerState.touch && {
      marginLeft: "24px"
    })),
    [`.${tooltipClasses$1.popper}[data-popper-placement*="right"] &`]: _extends$1({
      transformOrigin: "left center"
    }, !ownerState.isRtl ? _extends$1({
      marginLeft: "14px"
    }, ownerState.touch && {
      marginLeft: "24px"
    }) : _extends$1({
      marginRight: "14px"
    }, ownerState.touch && {
      marginRight: "24px"
    })),
    [`.${tooltipClasses$1.popper}[data-popper-placement*="top"] &`]: _extends$1({
      transformOrigin: "center bottom",
      marginBottom: "14px"
    }, ownerState.touch && {
      marginBottom: "24px"
    }),
    [`.${tooltipClasses$1.popper}[data-popper-placement*="bottom"] &`]: _extends$1({
      transformOrigin: "center top",
      marginTop: "14px"
    }, ownerState.touch && {
      marginTop: "24px"
    })
  }));
  const TooltipArrow = styled("span", {
    name: "MuiTooltip",
    slot: "Arrow",
    overridesResolver: (props, styles2) => styles2.arrow
  })(({
    theme
  }) => ({
    overflow: "hidden",
    position: "absolute",
    width: "1em",
    height: "0.71em",
    boxSizing: "border-box",
    color: theme.vars ? theme.vars.palette.Tooltip.bg : alpha_1(theme.palette.grey[700], 0.9),
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: "100%",
      height: "100%",
      backgroundColor: "currentColor",
      transform: "rotate(45deg)"
    }
  }));
  let hystersisOpen = false;
  const hystersisTimer = new Timeout();
  let cursorPosition = {
    x: 0,
    y: 0
  };
  function composeEventHandler(handler, eventHandler) {
    return (event) => {
      if (eventHandler) {
        eventHandler(event);
      }
      handler(event);
    };
  }
  const Tooltip = /* @__PURE__ */ React$1__namespace.forwardRef(function Tooltip2(inProps, ref) {
    var _ref, _slots$popper, _ref2, _ref3, _slots$transition, _ref4, _slots$tooltip, _ref5, _slots$arrow, _slotProps$popper, _ref6, _slotProps$popper2, _slotProps$transition, _slotProps$tooltip, _ref7, _slotProps$tooltip2, _slotProps$arrow, _ref8, _slotProps$arrow2;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiTooltip"
    });
    const {
      arrow: arrow2 = false,
      children: childrenProp,
      components = {},
      componentsProps = {},
      describeChild = false,
      disableFocusListener = false,
      disableHoverListener = false,
      disableInteractive: disableInteractiveProp = false,
      disableTouchListener = false,
      enterDelay = 100,
      enterNextDelay = 0,
      enterTouchDelay = 700,
      followCursor = false,
      id: idProp,
      leaveDelay = 0,
      leaveTouchDelay = 1500,
      onClose,
      onOpen,
      open: openProp,
      placement = "bottom",
      PopperComponent: PopperComponentProp,
      PopperProps = {},
      slotProps = {},
      slots = {},
      title,
      TransitionComponent: TransitionComponentProp = Grow$1,
      TransitionProps
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$y);
    const children = /* @__PURE__ */ React$1__namespace.isValidElement(childrenProp) ? childrenProp : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
      children: childrenProp
    });
    const theme = useTheme$1();
    const isRtl = theme.direction === "rtl";
    const [childNode, setChildNode] = React$1__namespace.useState();
    const [arrowRef, setArrowRef] = React$1__namespace.useState(null);
    const ignoreNonTouchEvents = React$1__namespace.useRef(false);
    const disableInteractive = disableInteractiveProp || followCursor;
    const closeTimer = useTimeout();
    const enterTimer = useTimeout();
    const leaveTimer = useTimeout();
    const touchTimer = useTimeout();
    const [openState, setOpenState] = useControlled({
      controlled: openProp,
      default: false,
      name: "Tooltip",
      state: "open"
    });
    let open = openState;
    const id = useId(idProp);
    const prevUserSelect = React$1__namespace.useRef();
    const stopTouchInteraction = useEventCallback(() => {
      if (prevUserSelect.current !== void 0) {
        document.body.style.WebkitUserSelect = prevUserSelect.current;
        prevUserSelect.current = void 0;
      }
      touchTimer.clear();
    });
    React$1__namespace.useEffect(() => stopTouchInteraction, [stopTouchInteraction]);
    const handleOpen = (event) => {
      hystersisTimer.clear();
      hystersisOpen = true;
      setOpenState(true);
      if (onOpen && !open) {
        onOpen(event);
      }
    };
    const handleClose = useEventCallback(
      /**
       * @param {React.SyntheticEvent | Event} event
       */
      (event) => {
        hystersisTimer.start(800 + leaveDelay, () => {
          hystersisOpen = false;
        });
        setOpenState(false);
        if (onClose && open) {
          onClose(event);
        }
        closeTimer.start(theme.transitions.duration.shortest, () => {
          ignoreNonTouchEvents.current = false;
        });
      }
    );
    const handleMouseOver = (event) => {
      if (ignoreNonTouchEvents.current && event.type !== "touchstart") {
        return;
      }
      if (childNode) {
        childNode.removeAttribute("title");
      }
      enterTimer.clear();
      leaveTimer.clear();
      if (enterDelay || hystersisOpen && enterNextDelay) {
        enterTimer.start(hystersisOpen ? enterNextDelay : enterDelay, () => {
          handleOpen(event);
        });
      } else {
        handleOpen(event);
      }
    };
    const handleMouseLeave = (event) => {
      enterTimer.clear();
      leaveTimer.start(leaveDelay, () => {
        handleClose(event);
      });
    };
    const {
      isFocusVisibleRef,
      onBlur: handleBlurVisible,
      onFocus: handleFocusVisible,
      ref: focusVisibleRef
    } = useIsFocusVisible();
    const [, setChildIsFocusVisible] = React$1__namespace.useState(false);
    const handleBlur = (event) => {
      handleBlurVisible(event);
      if (isFocusVisibleRef.current === false) {
        setChildIsFocusVisible(false);
        handleMouseLeave(event);
      }
    };
    const handleFocus = (event) => {
      if (!childNode) {
        setChildNode(event.currentTarget);
      }
      handleFocusVisible(event);
      if (isFocusVisibleRef.current === true) {
        setChildIsFocusVisible(true);
        handleMouseOver(event);
      }
    };
    const detectTouchStart = (event) => {
      ignoreNonTouchEvents.current = true;
      const childrenProps2 = children.props;
      if (childrenProps2.onTouchStart) {
        childrenProps2.onTouchStart(event);
      }
    };
    const handleTouchStart = (event) => {
      detectTouchStart(event);
      leaveTimer.clear();
      closeTimer.clear();
      stopTouchInteraction();
      prevUserSelect.current = document.body.style.WebkitUserSelect;
      document.body.style.WebkitUserSelect = "none";
      touchTimer.start(enterTouchDelay, () => {
        document.body.style.WebkitUserSelect = prevUserSelect.current;
        handleMouseOver(event);
      });
    };
    const handleTouchEnd = (event) => {
      if (children.props.onTouchEnd) {
        children.props.onTouchEnd(event);
      }
      stopTouchInteraction();
      leaveTimer.start(leaveTouchDelay, () => {
        handleClose(event);
      });
    };
    React$1__namespace.useEffect(() => {
      if (!open) {
        return void 0;
      }
      function handleKeyDown2(nativeEvent) {
        if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
          handleClose(nativeEvent);
        }
      }
      document.addEventListener("keydown", handleKeyDown2);
      return () => {
        document.removeEventListener("keydown", handleKeyDown2);
      };
    }, [handleClose, open]);
    const handleRef = useForkRef(children.ref, focusVisibleRef, setChildNode, ref);
    if (!title && title !== 0) {
      open = false;
    }
    const popperRef = React$1__namespace.useRef();
    const handleMouseMove = (event) => {
      const childrenProps2 = children.props;
      if (childrenProps2.onMouseMove) {
        childrenProps2.onMouseMove(event);
      }
      cursorPosition = {
        x: event.clientX,
        y: event.clientY
      };
      if (popperRef.current) {
        popperRef.current.update();
      }
    };
    const nameOrDescProps = {};
    const titleIsString = typeof title === "string";
    if (describeChild) {
      nameOrDescProps.title = !open && titleIsString && !disableHoverListener ? title : null;
      nameOrDescProps["aria-describedby"] = open ? id : null;
    } else {
      nameOrDescProps["aria-label"] = titleIsString ? title : null;
      nameOrDescProps["aria-labelledby"] = open && !titleIsString ? id : null;
    }
    const childrenProps = _extends$1({}, nameOrDescProps, other, children.props, {
      className: clsx(other.className, children.props.className),
      onTouchStart: detectTouchStart,
      ref: handleRef
    }, followCursor ? {
      onMouseMove: handleMouseMove
    } : {});
    const interactiveWrapperListeners = {};
    if (!disableTouchListener) {
      childrenProps.onTouchStart = handleTouchStart;
      childrenProps.onTouchEnd = handleTouchEnd;
    }
    if (!disableHoverListener) {
      childrenProps.onMouseOver = composeEventHandler(handleMouseOver, childrenProps.onMouseOver);
      childrenProps.onMouseLeave = composeEventHandler(handleMouseLeave, childrenProps.onMouseLeave);
      if (!disableInteractive) {
        interactiveWrapperListeners.onMouseOver = handleMouseOver;
        interactiveWrapperListeners.onMouseLeave = handleMouseLeave;
      }
    }
    if (!disableFocusListener) {
      childrenProps.onFocus = composeEventHandler(handleFocus, childrenProps.onFocus);
      childrenProps.onBlur = composeEventHandler(handleBlur, childrenProps.onBlur);
      if (!disableInteractive) {
        interactiveWrapperListeners.onFocus = handleFocus;
        interactiveWrapperListeners.onBlur = handleBlur;
      }
    }
    const popperOptions = React$1__namespace.useMemo(() => {
      var _PopperProps$popperOp;
      let tooltipModifiers = [{
        name: "arrow",
        enabled: Boolean(arrowRef),
        options: {
          element: arrowRef,
          padding: 4
        }
      }];
      if ((_PopperProps$popperOp = PopperProps.popperOptions) != null && _PopperProps$popperOp.modifiers) {
        tooltipModifiers = tooltipModifiers.concat(PopperProps.popperOptions.modifiers);
      }
      return _extends$1({}, PopperProps.popperOptions, {
        modifiers: tooltipModifiers
      });
    }, [arrowRef, PopperProps]);
    const ownerState = _extends$1({}, props, {
      isRtl,
      arrow: arrow2,
      disableInteractive,
      placement,
      PopperComponentProp,
      touch: ignoreNonTouchEvents.current
    });
    const classes = useUtilityClasses$t(ownerState);
    const PopperComponent = (_ref = (_slots$popper = slots.popper) != null ? _slots$popper : components.Popper) != null ? _ref : TooltipPopper;
    const TransitionComponent = (_ref2 = (_ref3 = (_slots$transition = slots.transition) != null ? _slots$transition : components.Transition) != null ? _ref3 : TransitionComponentProp) != null ? _ref2 : Grow$1;
    const TooltipComponent = (_ref4 = (_slots$tooltip = slots.tooltip) != null ? _slots$tooltip : components.Tooltip) != null ? _ref4 : TooltipTooltip;
    const ArrowComponent = (_ref5 = (_slots$arrow = slots.arrow) != null ? _slots$arrow : components.Arrow) != null ? _ref5 : TooltipArrow;
    const popperProps = appendOwnerState(PopperComponent, _extends$1({}, PopperProps, (_slotProps$popper = slotProps.popper) != null ? _slotProps$popper : componentsProps.popper, {
      className: clsx(classes.popper, PopperProps == null ? void 0 : PopperProps.className, (_ref6 = (_slotProps$popper2 = slotProps.popper) != null ? _slotProps$popper2 : componentsProps.popper) == null ? void 0 : _ref6.className)
    }), ownerState);
    const transitionProps = appendOwnerState(TransitionComponent, _extends$1({}, TransitionProps, (_slotProps$transition = slotProps.transition) != null ? _slotProps$transition : componentsProps.transition), ownerState);
    const tooltipProps = appendOwnerState(TooltipComponent, _extends$1({}, (_slotProps$tooltip = slotProps.tooltip) != null ? _slotProps$tooltip : componentsProps.tooltip, {
      className: clsx(classes.tooltip, (_ref7 = (_slotProps$tooltip2 = slotProps.tooltip) != null ? _slotProps$tooltip2 : componentsProps.tooltip) == null ? void 0 : _ref7.className)
    }), ownerState);
    const tooltipArrowProps = appendOwnerState(ArrowComponent, _extends$1({}, (_slotProps$arrow = slotProps.arrow) != null ? _slotProps$arrow : componentsProps.arrow, {
      className: clsx(classes.arrow, (_ref8 = (_slotProps$arrow2 = slotProps.arrow) != null ? _slotProps$arrow2 : componentsProps.arrow) == null ? void 0 : _ref8.className)
    }), ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
      children: [/* @__PURE__ */ React$1__namespace.cloneElement(children, childrenProps), /* @__PURE__ */ jsxRuntimeExports.jsx(PopperComponent, _extends$1({
        as: PopperComponentProp != null ? PopperComponentProp : Popper$1,
        placement,
        anchorEl: followCursor ? {
          getBoundingClientRect: () => ({
            top: cursorPosition.y,
            left: cursorPosition.x,
            right: cursorPosition.x,
            bottom: cursorPosition.y,
            width: 0,
            height: 0
          })
        } : childNode,
        popperRef,
        open: childNode ? open : false,
        id,
        transition: true
      }, interactiveWrapperListeners, popperProps, {
        popperOptions,
        children: ({
          TransitionProps: TransitionPropsInner
        }) => /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
          timeout: theme.transitions.duration.shorter
        }, TransitionPropsInner, transitionProps, {
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipComponent, _extends$1({}, tooltipProps, {
            children: [title, arrow2 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowComponent, _extends$1({}, tooltipArrowProps, {
              ref: setArrowRef
            })) : null]
          }))
        }))
      }))]
    });
  });
  const Tooltip$1 = Tooltip;
  const appConfig = {
    domain: "https://linux.do"
  };
  const baseRoutes = {
    user: `${appConfig.domain}/u`,
    topics: `${appConfig.domain}/topics`,
    topicsShort: `${appConfig.domain}/t`,
    posts: `${appConfig.domain}/posts`
  };
  const routes = {
    about: `${appConfig.domain}/about.json`,
    leaderBoard: (period) => `${appConfig.domain}/leaderboard/1?period=${period}`,
    user: {
      searchUsers: `${baseRoutes.user}/search/users`,
      // 用户查询
      userProfile: (username) => `${baseRoutes.user}/${username}.json`,
      // 用户数据
      summary: (username) => `${baseRoutes.user}/${username}/summary.json`,
      // 用户总结
      trustLevelInfo: "https://connect.linux.do/"
      // 官方信任等级查询页面
    },
    topics: {
      detail: (topicID) => `${baseRoutes.topicsShort}/${topicID}.json`,
      // 主题详情
      createdBy: (username) => `${baseRoutes.topics}/created-by/${username}.json`,
      // 用户创建的主题
      timing: `${baseRoutes.topics}/timings`
      // 阅读计时
    },
    posts: {
      root: baseRoutes.posts,
      detail: (postID) => `${baseRoutes.posts}/${postID}.json`
    }
  };
  const fetchForumAbout = (csrfToken) => {
    return fetch(routes.about, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "discourse-logged-in": "true",
        "discourse-present": "true",
        "discourse-track-view": "true",
        "x-csrf-token": csrfToken,
        "x-requested-with": "XMLHttpRequest"
      },
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include"
    }).then((serverPromise) => {
      return serverPromise.json().then((res) => {
        return Promise.resolve(res);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
  };
  function eq$5(value, other) {
    return value === other || value !== value && other !== other;
  }
  var eq_1 = eq$5;
  var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$1;
  var freeGlobal = _freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root$8 = freeGlobal || freeSelf || Function("return this")();
  var _root = root$8;
  var root$7 = _root;
  var Symbol$6 = root$7.Symbol;
  var _Symbol = Symbol$6;
  var Symbol$5 = _Symbol;
  var objectProto$f = Object.prototype;
  var hasOwnProperty$c = objectProto$f.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$f.toString;
  var symToStringTag$1 = Symbol$5 ? Symbol$5.toStringTag : void 0;
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty$c.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e2) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var _getRawTag = getRawTag$1;
  var objectProto$e = Object.prototype;
  var nativeObjectToString = objectProto$e.toString;
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }
  var _objectToString = objectToString$1;
  var Symbol$4 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$4 ? Symbol$4.toStringTag : void 0;
  function baseGetTag$6(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  var _baseGetTag = baseGetTag$6;
  function isObject$8(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$8;
  var baseGetTag$5 = _baseGetTag, isObject$7 = isObject_1;
  var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
  function isFunction$3(value) {
    if (!isObject$7(value)) {
      return false;
    }
    var tag = baseGetTag$5(value);
    return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var isFunction_1 = isFunction$3;
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  function isLength$3(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }
  var isLength_1 = isLength$3;
  var isFunction$2 = isFunction_1, isLength$2 = isLength_1;
  function isArrayLike$5(value) {
    return value != null && isLength$2(value.length) && !isFunction$2(value);
  }
  var isArrayLike_1 = isArrayLike$5;
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex$3(value, length2) {
    var type = typeof value;
    length2 = length2 == null ? MAX_SAFE_INTEGER : length2;
    return !!length2 && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length2);
  }
  var _isIndex = isIndex$3;
  var eq$4 = eq_1, isArrayLike$4 = isArrayLike_1, isIndex$2 = _isIndex, isObject$6 = isObject_1;
  function isIterateeCall$2(value, index, object) {
    if (!isObject$6(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike$4(object) && isIndex$2(index, object.length) : type == "string" && index in object) {
      return eq$4(object[index], value);
    }
    return false;
  }
  var _isIterateeCall = isIterateeCall$2;
  function isObjectLike$7(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$7;
  var baseGetTag$4 = _baseGetTag, isObjectLike$6 = isObjectLike_1;
  var symbolTag$1 = "[object Symbol]";
  function isSymbol$3(value) {
    return typeof value == "symbol" || isObjectLike$6(value) && baseGetTag$4(value) == symbolTag$1;
  }
  var isSymbol_1 = isSymbol$3;
  function baseTimes$1(n2, iteratee) {
    var index = -1, result = Array(n2);
    while (++index < n2) {
      result[index] = iteratee(index);
    }
    return result;
  }
  var _baseTimes = baseTimes$1;
  var baseGetTag$3 = _baseGetTag, isObjectLike$5 = isObjectLike_1;
  var argsTag$2 = "[object Arguments]";
  function baseIsArguments$1(value) {
    return isObjectLike$5(value) && baseGetTag$3(value) == argsTag$2;
  }
  var _baseIsArguments = baseIsArguments$1;
  var baseIsArguments = _baseIsArguments, isObjectLike$4 = isObjectLike_1;
  var objectProto$d = Object.prototype;
  var hasOwnProperty$b = objectProto$d.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$d.propertyIsEnumerable;
  var isArguments$3 = baseIsArguments(/* @__PURE__ */ function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike$4(value) && hasOwnProperty$b.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };
  var isArguments_1 = isArguments$3;
  var isArray$a = Array.isArray;
  var isArray_1 = isArray$a;
  var isBuffer$3 = { exports: {} };
  function stubFalse() {
    return false;
  }
  var stubFalse_1 = stubFalse;
  isBuffer$3.exports;
  (function(module, exports) {
    var root2 = _root, stubFalse2 = stubFalse_1;
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? root2.Buffer : void 0;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
    var isBuffer2 = nativeIsBuffer || stubFalse2;
    module.exports = isBuffer2;
  })(isBuffer$3, isBuffer$3.exports);
  var isBufferExports = isBuffer$3.exports;
  var baseGetTag$2 = _baseGetTag, isLength$1 = isLength_1, isObjectLike$3 = isObjectLike_1;
  var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", objectTag$3 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", weakMapTag$1 = "[object WeakMap]";
  var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag] = typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
  function baseIsTypedArray$1(value) {
    return isObjectLike$3(value) && isLength$1(value.length) && !!typedArrayTags[baseGetTag$2(value)];
  }
  var _baseIsTypedArray = baseIsTypedArray$1;
  function baseUnary$1(func) {
    return function(value) {
      return func(value);
    };
  }
  var _baseUnary = baseUnary$1;
  var _nodeUtil = { exports: {} };
  _nodeUtil.exports;
  (function(module, exports) {
    var freeGlobal2 = _freeGlobal;
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal2.process;
    var nodeUtil2 = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e2) {
      }
    }();
    module.exports = nodeUtil2;
  })(_nodeUtil, _nodeUtil.exports);
  var _nodeUtilExports = _nodeUtil.exports;
  var baseIsTypedArray = _baseIsTypedArray, baseUnary = _baseUnary, nodeUtil$2 = _nodeUtilExports;
  var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;
  var isTypedArray$3 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  var isTypedArray_1 = isTypedArray$3;
  var baseTimes = _baseTimes, isArguments$2 = isArguments_1, isArray$9 = isArray_1, isBuffer$2 = isBufferExports, isIndex$1 = _isIndex, isTypedArray$2 = isTypedArray_1;
  var objectProto$c = Object.prototype;
  var hasOwnProperty$a = objectProto$c.hasOwnProperty;
  function arrayLikeKeys$2(value, inherited) {
    var isArr = isArray$9(value), isArg = !isArr && isArguments$2(value), isBuff = !isArr && !isArg && isBuffer$2(value), isType = !isArr && !isArg && !isBuff && isTypedArray$2(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length2 = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$a.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex$1(key, length2)))) {
        result.push(key);
      }
    }
    return result;
  }
  var _arrayLikeKeys = arrayLikeKeys$2;
  var objectProto$b = Object.prototype;
  function isPrototype$3(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$b;
    return value === proto;
  }
  var _isPrototype = isPrototype$3;
  function overArg$2(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var _overArg = overArg$2;
  var overArg$1 = _overArg;
  var nativeKeys$1 = overArg$1(Object.keys, Object);
  var _nativeKeys = nativeKeys$1;
  var isPrototype$2 = _isPrototype, nativeKeys = _nativeKeys;
  var objectProto$a = Object.prototype;
  var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
  function baseKeys$1(object) {
    if (!isPrototype$2(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$9.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  var _baseKeys = baseKeys$1;
  var arrayLikeKeys$1 = _arrayLikeKeys, baseKeys = _baseKeys, isArrayLike$3 = isArrayLike_1;
  function keys$3(object) {
    return isArrayLike$3(object) ? arrayLikeKeys$1(object) : baseKeys(object);
  }
  var keys_1 = keys$3;
  const lodashKeys = /* @__PURE__ */ getDefaultExportFromCjs(keys_1);
  const objectToQuery = (obj) => {
    const query = lodashKeys(obj).reduce((previousValue, currentValue) => {
      if (obj[currentValue] !== void 0) {
        return [...previousValue, `${currentValue}=${obj[currentValue]}`];
      }
      return previousValue;
    }, []);
    return query.join("&");
  };
  function listCacheClear$1() {
    this.__data__ = [];
    this.size = 0;
  }
  var _listCacheClear = listCacheClear$1;
  var eq$3 = eq_1;
  function assocIndexOf$4(array, key) {
    var length2 = array.length;
    while (length2--) {
      if (eq$3(array[length2][0], key)) {
        return length2;
      }
    }
    return -1;
  }
  var _assocIndexOf = assocIndexOf$4;
  var assocIndexOf$3 = _assocIndexOf;
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete$1(key) {
    var data = this.__data__, index = assocIndexOf$3(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  var _listCacheDelete = listCacheDelete$1;
  var assocIndexOf$2 = _assocIndexOf;
  function listCacheGet$1(key) {
    var data = this.__data__, index = assocIndexOf$2(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  var _listCacheGet = listCacheGet$1;
  var assocIndexOf$1 = _assocIndexOf;
  function listCacheHas$1(key) {
    return assocIndexOf$1(this.__data__, key) > -1;
  }
  var _listCacheHas = listCacheHas$1;
  var assocIndexOf = _assocIndexOf;
  function listCacheSet$1(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  var _listCacheSet = listCacheSet$1;
  var listCacheClear = _listCacheClear, listCacheDelete = _listCacheDelete, listCacheGet = _listCacheGet, listCacheHas = _listCacheHas, listCacheSet = _listCacheSet;
  function ListCache$4(entries) {
    var index = -1, length2 = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length2) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache$4.prototype.clear = listCacheClear;
  ListCache$4.prototype["delete"] = listCacheDelete;
  ListCache$4.prototype.get = listCacheGet;
  ListCache$4.prototype.has = listCacheHas;
  ListCache$4.prototype.set = listCacheSet;
  var _ListCache = ListCache$4;
  var ListCache$3 = _ListCache;
  function stackClear$1() {
    this.__data__ = new ListCache$3();
    this.size = 0;
  }
  var _stackClear = stackClear$1;
  function stackDelete$1(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  var _stackDelete = stackDelete$1;
  function stackGet$1(key) {
    return this.__data__.get(key);
  }
  var _stackGet = stackGet$1;
  function stackHas$1(key) {
    return this.__data__.has(key);
  }
  var _stackHas = stackHas$1;
  var root$6 = _root;
  var coreJsData$1 = root$6["__core-js_shared__"];
  var _coreJsData = coreJsData$1;
  var coreJsData = _coreJsData;
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked$1(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var _isMasked = isMasked$1;
  var funcProto$2 = Function.prototype;
  var funcToString$2 = funcProto$2.toString;
  function toSource$2(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e2) {
      }
      try {
        return func + "";
      } catch (e2) {
      }
    }
    return "";
  }
  var _toSource = toSource$2;
  var isFunction$1 = isFunction_1, isMasked = _isMasked, isObject$5 = isObject_1, toSource$1 = _toSource;
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto$1 = Function.prototype, objectProto$9 = Object.prototype;
  var funcToString$1 = funcProto$1.toString;
  var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString$1.call(hasOwnProperty$8).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative$1(value) {
    if (!isObject$5(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource$1(value));
  }
  var _baseIsNative = baseIsNative$1;
  function getValue$1(object, key) {
    return object == null ? void 0 : object[key];
  }
  var _getValue = getValue$1;
  var baseIsNative = _baseIsNative, getValue = _getValue;
  function getNative$7(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : void 0;
  }
  var _getNative = getNative$7;
  var getNative$6 = _getNative, root$5 = _root;
  var Map$4 = getNative$6(root$5, "Map");
  var _Map = Map$4;
  var getNative$5 = _getNative;
  var nativeCreate$4 = getNative$5(Object, "create");
  var _nativeCreate = nativeCreate$4;
  var nativeCreate$3 = _nativeCreate;
  function hashClear$1() {
    this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
    this.size = 0;
  }
  var _hashClear = hashClear$1;
  function hashDelete$1(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var _hashDelete = hashDelete$1;
  var nativeCreate$2 = _nativeCreate;
  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  var objectProto$8 = Object.prototype;
  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  function hashGet$1(key) {
    var data = this.__data__;
    if (nativeCreate$2) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? void 0 : result;
    }
    return hasOwnProperty$7.call(data, key) ? data[key] : void 0;
  }
  var _hashGet = hashGet$1;
  var nativeCreate$1 = _nativeCreate;
  var objectProto$7 = Object.prototype;
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  function hashHas$1(key) {
    var data = this.__data__;
    return nativeCreate$1 ? data[key] !== void 0 : hasOwnProperty$6.call(data, key);
  }
  var _hashHas = hashHas$1;
  var nativeCreate = _nativeCreate;
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  function hashSet$1(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
    return this;
  }
  var _hashSet = hashSet$1;
  var hashClear = _hashClear, hashDelete = _hashDelete, hashGet = _hashGet, hashHas = _hashHas, hashSet = _hashSet;
  function Hash$1(entries) {
    var index = -1, length2 = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length2) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash$1.prototype.clear = hashClear;
  Hash$1.prototype["delete"] = hashDelete;
  Hash$1.prototype.get = hashGet;
  Hash$1.prototype.has = hashHas;
  Hash$1.prototype.set = hashSet;
  var _Hash = Hash$1;
  var Hash = _Hash, ListCache$2 = _ListCache, Map$3 = _Map;
  function mapCacheClear$1() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$3 || ListCache$2)(),
      "string": new Hash()
    };
  }
  var _mapCacheClear = mapCacheClear$1;
  function isKeyable$1(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  var _isKeyable = isKeyable$1;
  var isKeyable = _isKeyable;
  function getMapData$4(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  var _getMapData = getMapData$4;
  var getMapData$3 = _getMapData;
  function mapCacheDelete$1(key) {
    var result = getMapData$3(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  var _mapCacheDelete = mapCacheDelete$1;
  var getMapData$2 = _getMapData;
  function mapCacheGet$1(key) {
    return getMapData$2(this, key).get(key);
  }
  var _mapCacheGet = mapCacheGet$1;
  var getMapData$1 = _getMapData;
  function mapCacheHas$1(key) {
    return getMapData$1(this, key).has(key);
  }
  var _mapCacheHas = mapCacheHas$1;
  var getMapData = _getMapData;
  function mapCacheSet$1(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  var _mapCacheSet = mapCacheSet$1;
  var mapCacheClear = _mapCacheClear, mapCacheDelete = _mapCacheDelete, mapCacheGet = _mapCacheGet, mapCacheHas = _mapCacheHas, mapCacheSet = _mapCacheSet;
  function MapCache$3(entries) {
    var index = -1, length2 = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length2) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache$3.prototype.clear = mapCacheClear;
  MapCache$3.prototype["delete"] = mapCacheDelete;
  MapCache$3.prototype.get = mapCacheGet;
  MapCache$3.prototype.has = mapCacheHas;
  MapCache$3.prototype.set = mapCacheSet;
  var _MapCache = MapCache$3;
  var ListCache$1 = _ListCache, Map$2 = _Map, MapCache$2 = _MapCache;
  var LARGE_ARRAY_SIZE = 200;
  function stackSet$1(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache$1) {
      var pairs = data.__data__;
      if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache$2(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  var _stackSet = stackSet$1;
  var ListCache = _ListCache, stackClear = _stackClear, stackDelete = _stackDelete, stackGet = _stackGet, stackHas = _stackHas, stackSet = _stackSet;
  function Stack$3(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack$3.prototype.clear = stackClear;
  Stack$3.prototype["delete"] = stackDelete;
  Stack$3.prototype.get = stackGet;
  Stack$3.prototype.has = stackHas;
  Stack$3.prototype.set = stackSet;
  var _Stack = Stack$3;
  var getNative$4 = _getNative;
  var defineProperty$2 = function() {
    try {
      var func = getNative$4(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e2) {
    }
  }();
  var _defineProperty = defineProperty$2;
  var defineProperty$1 = _defineProperty;
  function baseAssignValue$3(object, key, value) {
    if (key == "__proto__" && defineProperty$1) {
      defineProperty$1(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  var _baseAssignValue = baseAssignValue$3;
  var baseAssignValue$2 = _baseAssignValue, eq$2 = eq_1;
  function assignMergeValue$2(object, key, value) {
    if (value !== void 0 && !eq$2(object[key], value) || value === void 0 && !(key in object)) {
      baseAssignValue$2(object, key, value);
    }
  }
  var _assignMergeValue = assignMergeValue$2;
  function createBaseFor$1(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length2 = props.length;
      while (length2--) {
        var key = props[fromRight ? length2 : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  var _createBaseFor = createBaseFor$1;
  var createBaseFor = _createBaseFor;
  var baseFor$2 = createBaseFor();
  var _baseFor = baseFor$2;
  var _cloneBuffer = { exports: {} };
  _cloneBuffer.exports;
  (function(module, exports) {
    var root2 = _root;
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? root2.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
    function cloneBuffer2(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length2 = buffer.length, result = allocUnsafe ? allocUnsafe(length2) : new buffer.constructor(length2);
      buffer.copy(result);
      return result;
    }
    module.exports = cloneBuffer2;
  })(_cloneBuffer, _cloneBuffer.exports);
  var _cloneBufferExports = _cloneBuffer.exports;
  var root$4 = _root;
  var Uint8Array$2 = root$4.Uint8Array;
  var _Uint8Array = Uint8Array$2;
  var Uint8Array$1 = _Uint8Array;
  function cloneArrayBuffer$1(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
    return result;
  }
  var _cloneArrayBuffer = cloneArrayBuffer$1;
  var cloneArrayBuffer = _cloneArrayBuffer;
  function cloneTypedArray$1(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  var _cloneTypedArray = cloneTypedArray$1;
  function copyArray$1(source, array) {
    var index = -1, length2 = source.length;
    array || (array = Array(length2));
    while (++index < length2) {
      array[index] = source[index];
    }
    return array;
  }
  var _copyArray = copyArray$1;
  var isObject$4 = isObject_1;
  var objectCreate = Object.create;
  var baseCreate$1 = /* @__PURE__ */ function() {
    function object() {
    }
    return function(proto) {
      if (!isObject$4(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();
  var _baseCreate = baseCreate$1;
  var overArg = _overArg;
  var getPrototype$2 = overArg(Object.getPrototypeOf, Object);
  var _getPrototype = getPrototype$2;
  var baseCreate = _baseCreate, getPrototype$1 = _getPrototype, isPrototype$1 = _isPrototype;
  function initCloneObject$1(object) {
    return typeof object.constructor == "function" && !isPrototype$1(object) ? baseCreate(getPrototype$1(object)) : {};
  }
  var _initCloneObject = initCloneObject$1;
  var isArrayLike$2 = isArrayLike_1, isObjectLike$2 = isObjectLike_1;
  function isArrayLikeObject$1(value) {
    return isObjectLike$2(value) && isArrayLike$2(value);
  }
  var isArrayLikeObject_1 = isArrayLikeObject$1;
  var baseGetTag$1 = _baseGetTag, getPrototype = _getPrototype, isObjectLike$1 = isObjectLike_1;
  var objectTag$2 = "[object Object]";
  var funcProto = Function.prototype, objectProto$6 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject$1(value) {
    if (!isObjectLike$1(value) || baseGetTag$1(value) != objectTag$2) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$5.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }
  var isPlainObject_1 = isPlainObject$1;
  function safeGet$2(object, key) {
    if (key === "constructor" && typeof object[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object[key];
  }
  var _safeGet = safeGet$2;
  var baseAssignValue$1 = _baseAssignValue, eq$1 = eq_1;
  var objectProto$5 = Object.prototype;
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
  function assignValue$1(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$4.call(object, key) && eq$1(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue$1(object, key, value);
    }
  }
  var _assignValue = assignValue$1;
  var assignValue = _assignValue, baseAssignValue = _baseAssignValue;
  function copyObject$1(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length2 = props.length;
    while (++index < length2) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }
  var _copyObject = copyObject$1;
  function nativeKeysIn$1(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  var _nativeKeysIn = nativeKeysIn$1;
  var isObject$3 = isObject_1, isPrototype = _isPrototype, nativeKeysIn = _nativeKeysIn;
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  function baseKeysIn$1(object) {
    if (!isObject$3(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty$3.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  var _baseKeysIn = baseKeysIn$1;
  var arrayLikeKeys = _arrayLikeKeys, baseKeysIn = _baseKeysIn, isArrayLike$1 = isArrayLike_1;
  function keysIn$2(object) {
    return isArrayLike$1(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }
  var keysIn_1 = keysIn$2;
  var copyObject = _copyObject, keysIn$1 = keysIn_1;
  function toPlainObject$1(value) {
    return copyObject(value, keysIn$1(value));
  }
  var toPlainObject_1 = toPlainObject$1;
  var assignMergeValue$1 = _assignMergeValue, cloneBuffer = _cloneBufferExports, cloneTypedArray = _cloneTypedArray, copyArray = _copyArray, initCloneObject = _initCloneObject, isArguments$1 = isArguments_1, isArray$8 = isArray_1, isArrayLikeObject = isArrayLikeObject_1, isBuffer$1 = isBufferExports, isFunction = isFunction_1, isObject$2 = isObject_1, isPlainObject = isPlainObject_1, isTypedArray$1 = isTypedArray_1, safeGet$1 = _safeGet, toPlainObject = toPlainObject_1;
  function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet$1(object, key), srcValue = safeGet$1(source, key), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue$1(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray$8(srcValue), isBuff = !isArr && isBuffer$1(srcValue), isTyped = !isArr && !isBuff && isTypedArray$1(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray$8(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments$1(srcValue)) {
        newValue = objValue;
        if (isArguments$1(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject$2(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue$1(object, key, newValue);
  }
  var _baseMergeDeep = baseMergeDeep$1;
  var Stack$2 = _Stack, assignMergeValue = _assignMergeValue, baseFor$1 = _baseFor, baseMergeDeep = _baseMergeDeep, isObject$1 = isObject_1, keysIn = keysIn_1, safeGet = _safeGet;
  function baseMerge$1(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor$1(source, function(srcValue, key) {
      stack || (stack = new Stack$2());
      if (isObject$1(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge$1, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }
  var _baseMerge = baseMerge$1;
  function identity$3(value) {
    return value;
  }
  var identity_1 = identity$3;
  function apply$1(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  var _apply = apply$1;
  var apply = _apply;
  var nativeMax = Math.max;
  function overRest$1(func, start2, transform) {
    start2 = nativeMax(start2 === void 0 ? func.length - 1 : start2, 0);
    return function() {
      var args = arguments, index = -1, length2 = nativeMax(args.length - start2, 0), array = Array(length2);
      while (++index < length2) {
        array[index] = args[start2 + index];
      }
      index = -1;
      var otherArgs = Array(start2 + 1);
      while (++index < start2) {
        otherArgs[index] = args[index];
      }
      otherArgs[start2] = transform(array);
      return apply(func, this, otherArgs);
    };
  }
  var _overRest = overRest$1;
  function constant$1(value) {
    return function() {
      return value;
    };
  }
  var constant_1 = constant$1;
  var constant = constant_1, defineProperty = _defineProperty, identity$2 = identity_1;
  var baseSetToString$1 = !defineProperty ? identity$2 : function(func, string) {
    return defineProperty(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string),
      "writable": true
    });
  };
  var _baseSetToString = baseSetToString$1;
  var HOT_COUNT = 800, HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut$1(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  var _shortOut = shortOut$1;
  var baseSetToString = _baseSetToString, shortOut = _shortOut;
  var setToString$1 = shortOut(baseSetToString);
  var _setToString = setToString$1;
  var identity$1 = identity_1, overRest = _overRest, setToString = _setToString;
  function baseRest$1(func, start2) {
    return setToString(overRest(func, start2, identity$1), func + "");
  }
  var _baseRest = baseRest$1;
  var baseRest = _baseRest, isIterateeCall$1 = _isIterateeCall;
  function createAssigner$1(assigner) {
    return baseRest(function(object, sources) {
      var index = -1, length2 = sources.length, customizer = length2 > 1 ? sources[length2 - 1] : void 0, guard = length2 > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length2--, customizer) : void 0;
      if (guard && isIterateeCall$1(sources[0], sources[1], guard)) {
        customizer = length2 < 3 ? void 0 : customizer;
        length2 = 1;
      }
      object = Object(object);
      while (++index < length2) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  var _createAssigner = createAssigner$1;
  var baseMerge = _baseMerge, createAssigner = _createAssigner;
  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });
  var merge_1 = merge;
  const lodashMerge = /* @__PURE__ */ getDefaultExportFromCjs(merge_1);
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const fetchGetUserSummary = (username, csrfToken) => {
    return fetch(routes.user.summary(username), {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "discourse-logged-in": "true",
        "discourse-present": "true",
        "discourse-track-view": "true",
        "x-csrf-token": csrfToken,
        "x-requested-with": "XMLHttpRequest"
      },
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include"
    }).then((serverPromise) => {
      return serverPromise.json().then((res) => {
        return Promise.resolve(res);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
  };
  const initRealTrustLevelInfo = [
    {
      key: "days_visited",
      title: "访问次数",
      value: "0",
      requireValue: "0"
    },
    {
      key: "topics_reply_count",
      title: "回复的话题",
      value: "0",
      requireValue: "0"
    },
    {
      key: "topics_entered",
      title: "浏览的话题",
      value: "0",
      requireValue: "0"
    },
    {
      key: "topics_entered_all",
      title: "浏览的话题（所有时间）",
      value: "0",
      requireValue: "0"
    },
    {
      key: "posts_read_count",
      title: "已读帖子",
      value: "0",
      requireValue: "0"
    },
    {
      key: "posts_read_count_all",
      title: "已读帖子（所有时间）",
      value: "0",
      requireValue: "0"
    },
    {
      title: "被举报的帖子",
      value: "0",
      requireValue: "0"
    },
    {
      title: "发起举报的用户",
      value: "0",
      requireValue: "0"
    },
    {
      title: "点赞",
      value: "0",
      requireValue: "0"
    },
    {
      title: "获赞",
      value: "0",
      requireValue: "0"
    },
    {
      title: "获赞：单日最高数量",
      value: "0",
      requireValue: "0"
    },
    {
      title: "获赞：点赞用户数量",
      value: "0",
      requireValue: "0"
    },
    {
      title: "被禁言（过去6个月）",
      value: "0",
      requireValue: "0"
    },
    {
      title: "被封禁（过去6个月）",
      value: "0",
      requireValue: "0"
    }
  ];
  const fetchRealTrustLevelInfo = () => {
    const extractTrustLevelInfo = (trustLevelInfoHtmlText) => {
      if (trustLevelInfoHtmlText) {
        const trustLevelInfoParser = new DOMParser();
        const trustLevelInfoDoc = trustLevelInfoParser.parseFromString(trustLevelInfoHtmlText, "text/html");
        const tableTr = Array.from(trustLevelInfoDoc.querySelectorAll("table tr td"));
        if (tableTr) {
          const tableData = [];
          tableTr.forEach((value) => {
            tableData.push(value.textContent || "");
          });
          const trustLevelInfo = [
            {
              title: "访问次数",
              value: tableData[1],
              requireValue: tableData[2]
            },
            {
              title: "回复的话题",
              value: tableData[4],
              requireValue: tableData[5]
            },
            {
              title: "浏览的话题",
              value: tableData[7],
              requireValue: tableData[8]
            },
            {
              title: "浏览的话题（所有时间）",
              value: tableData[10],
              requireValue: tableData[11]
            },
            {
              title: "已读帖子",
              value: tableData[13],
              requireValue: tableData[14]
            },
            {
              title: "已读帖子（所有时间）",
              value: tableData[16],
              requireValue: tableData[17]
            },
            {
              title: "被举报的帖子",
              value: tableData[19],
              requireValue: tableData[20]
            },
            {
              title: "发起举报的用户",
              value: tableData[22],
              requireValue: tableData[23]
            },
            {
              title: "点赞",
              value: tableData[25],
              requireValue: tableData[26]
            },
            {
              title: "获赞",
              value: tableData[28],
              requireValue: tableData[29]
            },
            {
              title: "获赞：单日最高数量",
              value: tableData[31],
              requireValue: tableData[32]
            },
            {
              title: "获赞：点赞用户数量",
              value: tableData[34],
              requireValue: tableData[35]
            },
            {
              title: "被禁言（过去6个月）",
              value: tableData[37],
              requireValue: tableData[38]
            },
            {
              title: "被封禁（过去6个月）",
              value: tableData[40],
              requireValue: tableData[41]
            }
          ];
          return trustLevelInfo;
        }
        return initRealTrustLevelInfo;
      }
      return initRealTrustLevelInfo;
    };
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url: routes.user.trustLevelInfo,
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6",
          "sec-ch-ua": '"Chromium";v="999", "Not(A:Brand";v="24", "Microsoft Edge";v="999"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"linux"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1"
        },
        // data: undefined,
        // cookie,
        // binary,
        // nocache,
        // revalidate,
        // timeout,
        // context,
        // responseType,
        // overrideMimeType,
        // anonymous: true,
        // fetch,
        // user,
        // password,
        // onabort,
        onerror: (err) => {
          console.log("请求异常");
          resolve(initRealTrustLevelInfo);
        },
        // onloadstart,
        // onprogress,
        // onreadystatechange,
        // ontimeout,
        onload: (serverResponse) => {
          try {
            resolve(extractTrustLevelInfo(serverResponse.responseText));
          } catch (err) {
            resolve(initRealTrustLevelInfo);
          }
        }
      });
    });
  };
  const fetchUserProfile = (username, csrfToken) => {
    return fetch(routes.user.userProfile(username), {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "discourse-logged-in": "true",
        "discourse-present": "true",
        "discourse-track-view": "true",
        "x-csrf-token": csrfToken,
        "x-requested-with": "XMLHttpRequest"
      },
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include"
    }).then((serverPromise) => {
      return serverPromise.json().then((res) => {
        return Promise.resolve(res);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
  };
  const fetchSearchUsers = (query, csrfToken) => {
    const newQuery = lodashMerge(
      {
        term: "neo",
        topic_id: void 0,
        category_id: void 0,
        limit: 10
      },
      query
    );
    const urlQuery = objectToQuery(newQuery);
    return fetch(`${routes.user.searchUsers}?${urlQuery}`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "discourse-logged-in": "true",
        "discourse-present": "true",
        "x-csrf-token": csrfToken,
        "x-requested-with": "XMLHttpRequest"
      },
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include"
    }).then((serverPromise) => {
      return serverPromise.json().then((res) => {
        return Promise.resolve(res);
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
  };
  function arrayMap$1(array, iteratee) {
    var index = -1, length2 = array == null ? 0 : array.length, result = Array(length2);
    while (++index < length2) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  var _arrayMap = arrayMap$1;
  var Symbol$3 = _Symbol, arrayMap = _arrayMap, isArray$7 = isArray_1, isSymbol$2 = isSymbol_1;
  var INFINITY$1 = 1 / 0;
  var symbolProto$2 = Symbol$3 ? Symbol$3.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
  function baseToString$1(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray$7(value)) {
      return arrayMap(value, baseToString$1) + "";
    }
    if (isSymbol$2(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$1 ? "-0" : result;
  }
  var _baseToString = baseToString$1;
  var baseToString = _baseToString;
  function toString$2(value) {
    return value == null ? "" : baseToString(value);
  }
  var toString_1 = toString$2;
  var toString$1 = toString_1;
  var idCounter = 0;
  function uniqueId(prefix2) {
    var id = ++idCounter;
    return toString$1(prefix2) + id;
  }
  var uniqueId_1 = uniqueId;
  const lodashUniqueId = /* @__PURE__ */ getDefaultExportFromCjs(uniqueId_1);
  function LinearProgressWithLabel(props) {
    const { title, color: color2, value, label, ...restProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      LinearProgress,
      {
        ...restProps,
        value,
        color: color2,
        variant: "gradient",
        label: true,
        labelColor: color2,
        labelText: `${title}：${label}`
      }
    );
  }
  function TrustLevelDialog({ open = false, toggleOpen }) {
    const [userProfile, setUserProfile] = React$1.useState(null);
    const [trustLevelData, setTrustLevelData] = React$1.useState([]);
    const extractValue = (value) => {
      if (value.includes("%")) {
        return parseFloat(value);
      }
      if (value.includes("≥")) {
        return parseFloat(value.substring(1).trim());
      }
      return parseFloat(value);
    };
    const extractRequireValue = (requireValue) => {
      if (requireValue.includes("%")) {
        return parseFloat(requireValue);
      }
      if (requireValue.includes("最多")) {
        return parseFloat(requireValue.match(/\d+/)[0]);
      }
      return parseFloat(requireValue);
    };
    const determineCalc = (title, value, requireValue) => {
      if (title.includes("被禁言") || title.includes("封禁") || requireValue.includes("最多")) {
        return "<=";
      }
      return ">=";
    };
    const transToProgressData = (title, value, requireValue, calc) => {
      let newValue = value;
      if (requireValue === 0) {
        newValue = value * 100;
      } else {
        newValue = value / requireValue * 100;
      }
      newValue = newValue > 100 ? 100 : newValue;
      if (calc === ">=") {
        return newValue < 100 ? { title, color: "error", value: newValue, label: `${value} < ${requireValue}，未达标` } : { title, color: "success", value: newValue, label: `${value} ≥ ${requireValue}，已达标` };
      }
      if (calc === "<=") {
        return newValue > 100 ? { title, color: "error", value: newValue, label: `${value} > ${requireValue}，未达标` } : { title, color: "success", value: newValue, label: `${value} ≤ ${requireValue}，已达标` };
      }
      return { title, color: "primary", value: newValue, label: `${value} / ${requireValue}，未知` };
    };
    React$1.useEffect(() => {
      const transformStats = (items) => {
        return items.map((item) => {
          const value = extractValue(item.value);
          const requireValue = extractRequireValue(item.requireValue);
          const calc = determineCalc(item.title, item.value, item.requireValue);
          const progressData = transToProgressData(item.title, value, requireValue, calc);
          return progressData;
        });
      };
      const username = getPreloadedUsername();
      const csrfToken = getCsrfToken();
      if (username && csrfToken) {
        fetchUserProfile(username, csrfToken).then((res) => {
          setUserProfile(res);
          if (res.user.trust_level >= 2) {
            fetchRealTrustLevelInfo().then((trustLevelRawData) => {
              const transformedData = transformStats(trustLevelRawData);
              setTrustLevelData(transformedData);
            });
          } else if (res.user.trust_level === 1)
            ;
          else
            ;
        });
      }
      return () => {
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog$1, { fullWidth: true, maxWidth: "sm", open, onClose: () => toggleOpen(false), keepMounted: false, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle$1, { variant: "h2", children: "用户等级信息" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent$1, { children: userProfile && (userProfile.user.trust_level >= 2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", children: `你的用户等级为${userProfile.user.trust_level}级，精确信息通过 connect.linux.do 查询` }),
        userProfile.user.trust_level === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: "你作为一个成熟的3级用户，应该学会和始皇达成py交易进阶4级了" }),
        userProfile.user.trust_level === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: "什么？你已经和始皇达成py交易了？" }),
        trustLevelData.length > 0 ? trustLevelData.map((ltd) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          LinearProgressWithLabel,
          {
            title: ltd.title,
            value: ltd.value,
            label: ltd.label,
            color: ltd.color
          },
          lodashUniqueId("tlProcess")
        )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton$1, { animation: "wave" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", children: `你的用户等级为${userProfile.user.trust_level}级，还没有权限通过 connect.linux.do 查询，以下为估算数据` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: "见笑了，这部分我还没有写好" })
      ] })) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogActions$1, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { title: "点击跳转 2024.03.22 更新说明", placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            color: "error",
            variant: "text",
            onClick: () => window.open("https://linux.do/t/topic/35204#h-2024-03-22-9", "_blank"),
            children: "一直无法显示？"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { title: "被始皇 Ban 了应急就跳转官方吧", placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { color: "warning", variant: "text", onClick: () => window.open("https://connect.linux.do/", "_blank"), children: "跳转官方" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { color: "info", onClick: () => toggleOpen(false), children: "好的，我知道了" })
      ] })
    ] });
  }
  const boxClasses = generateUtilityClasses$2("MuiBox", ["root"]);
  const boxClasses$1 = boxClasses;
  const defaultTheme = createTheme();
  const Box$1 = createBox({
    themeId: THEME_ID,
    defaultTheme,
    defaultClassName: boxClasses$1.root,
    generateClassName: ClassNameGenerator$1.generate
  });
  const Box$2 = Box$1;
  var objectProto$3 = Object.prototype;
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  function baseHas$1(object, key) {
    return object != null && hasOwnProperty$2.call(object, key);
  }
  var _baseHas = baseHas$1;
  var isArray$6 = isArray_1, isSymbol$1 = isSymbol_1;
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
  function isKey$3(value, object) {
    if (isArray$6(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol$1(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  var _isKey = isKey$3;
  var MapCache$1 = _MapCache;
  var FUNC_ERROR_TEXT = "Expected a function";
  function memoize$1(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache2 = memoized.cache;
      if (cache2.has(key)) {
        return cache2.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache2.set(key, result) || cache2;
      return result;
    };
    memoized.cache = new (memoize$1.Cache || MapCache$1)();
    return memoized;
  }
  memoize$1.Cache = MapCache$1;
  var memoize_1 = memoize$1;
  var memoize = memoize_1;
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped$1(func) {
    var result = memoize(func, function(key) {
      if (cache2.size === MAX_MEMOIZE_SIZE) {
        cache2.clear();
      }
      return key;
    });
    var cache2 = result.cache;
    return result;
  }
  var _memoizeCapped = memoizeCapped$1;
  var memoizeCapped = _memoizeCapped;
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath$1 = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match2, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match2);
    });
    return result;
  });
  var _stringToPath = stringToPath$1;
  var isArray$5 = isArray_1, isKey$2 = _isKey, stringToPath = _stringToPath, toString = toString_1;
  function castPath$2(value, object) {
    if (isArray$5(value)) {
      return value;
    }
    return isKey$2(value, object) ? [value] : stringToPath(toString(value));
  }
  var _castPath = castPath$2;
  var isSymbol = isSymbol_1;
  var INFINITY = 1 / 0;
  function toKey$4(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  var _toKey = toKey$4;
  var castPath$1 = _castPath, isArguments = isArguments_1, isArray$4 = isArray_1, isIndex = _isIndex, isLength = isLength_1, toKey$3 = _toKey;
  function hasPath$2(object, path, hasFunc) {
    path = castPath$1(path, object);
    var index = -1, length2 = path.length, result = false;
    while (++index < length2) {
      var key = toKey$3(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length2) {
      return result;
    }
    length2 = object == null ? 0 : object.length;
    return !!length2 && isLength(length2) && isIndex(key, length2) && (isArray$4(object) || isArguments(object));
  }
  var _hasPath = hasPath$2;
  var baseHas = _baseHas, hasPath$1 = _hasPath;
  function has(object, path) {
    return object != null && hasPath$1(object, path, baseHas);
  }
  var has_1 = has;
  const lodashHas = /* @__PURE__ */ getDefaultExportFromCjs(has_1);
  const BoxRoot = styled(Box$2, {
    shouldForwardProp: (fieldName) => filterForwardProps(fieldName, ["ownerState"])
  })(({ theme, ownerState }) => {
    const { palette: palette2, functions, borders: borders2, boxShadows: boxShadows2 } = theme;
    const { variant, bgColor, color: color2, opacity, borderRadius: borderRadius2, shadow, coloredShadow } = ownerState;
    const { gradients, grey: grey2, white } = palette2;
    const { linearGradient: linearGradient2 } = functions;
    const { borderRadius: radius } = borders2;
    const { colored } = boxShadows2;
    const greyColors = {
      "grey-100": grey2[100],
      "grey-200": grey2[200],
      "grey-300": grey2[300],
      "grey-400": grey2[400],
      "grey-500": grey2[500],
      "grey-600": grey2[600],
      "grey-700": grey2[700],
      "grey-800": grey2[800],
      "grey-900": grey2[900]
    };
    const validColors = [
      "transparent",
      "white",
      "black",
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "text",
      "grey-100",
      "grey-200",
      "grey-300",
      "grey-400",
      "grey-500",
      "grey-600",
      "grey-700",
      "grey-800",
      "grey-900"
    ];
    const validBorderRadius = ["xs", "sm", "md", "lg", "xl", "xxl", "section"];
    const validBoxShadows = ["xs", "sm", "md", "lg", "xl", "xxl", "inset"];
    let backgroundValue = bgColor;
    if (variant === "gradient") {
      backgroundValue = lodashHas(gradients, bgColor) ? linearGradient2(
        gradients[bgColor].main,
        gradients[bgColor].state
      ) : white.main;
    } else if (validColors.includes(bgColor)) {
      backgroundValue = palette2[bgColor] ? palette2[bgColor].main : greyColors[bgColor];
    } else {
      backgroundValue = bgColor;
    }
    let colorValue = color2;
    if (validColors.includes(color2)) {
      colorValue = palette2[color2] ? palette2[color2].main : greyColors[color2];
    }
    let borderRadiusValue = borderRadius2;
    if (validBorderRadius.includes(borderRadius2)) {
      borderRadiusValue = radius[borderRadius2];
    }
    let boxShadowValue = "none";
    if (validBoxShadows.includes(shadow)) {
      boxShadowValue = boxShadows2[shadow];
    } else if (coloredShadow) {
      boxShadowValue = lodashHas(colored, coloredShadow) ? colored[coloredShadow] : "none";
    }
    return {
      opacity,
      background: backgroundValue,
      color: colorValue,
      borderRadius: borderRadiusValue,
      boxShadow: boxShadowValue
    };
  });
  const Box = React$1.forwardRef(
    ({
      variant = "contained",
      bgColor = "transparent",
      color: color2 = "dark",
      opacity = 1,
      borderRadius: borderRadius2 = "none",
      shadow = "none",
      coloredShadow = "none",
      ...restProps
    }, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        BoxRoot,
        {
          ...restProps,
          ref,
          ownerState: { variant, bgColor, color: color2, opacity, borderRadius: borderRadius2, shadow, coloredShadow }
        }
      );
    }
  );
  var Close = {};
  var createSvgIcon$1 = {};
  function getSvgIconUtilityClass(slot) {
    return generateUtilityClass$2("MuiSvgIcon", slot);
  }
  const svgIconClasses = generateUtilityClasses$2("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);
  const svgIconClasses$1 = svgIconClasses;
  const _excluded$x = ["children", "className", "color", "component", "fontSize", "htmlColor", "inheritViewBox", "titleAccess", "viewBox"];
  const useUtilityClasses$s = (ownerState) => {
    const {
      color: color2,
      fontSize,
      classes
    } = ownerState;
    const slots = {
      root: ["root", color2 !== "inherit" && `color${capitalize$1(color2)}`, `fontSize${capitalize$1(fontSize)}`]
    };
    return composeClasses$1(slots, getSvgIconUtilityClass, classes);
  };
  const SvgIconRoot = styled("svg", {
    name: "MuiSvgIcon",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "inherit" && styles2[`color${capitalize$1(ownerState.color)}`], styles2[`fontSize${capitalize$1(ownerState.fontSize)}`]];
    }
  })(({
    theme,
    ownerState
  }) => {
    var _theme$transitions, _theme$transitions$cr, _theme$transitions2, _theme$typography, _theme$typography$pxT, _theme$typography2, _theme$typography2$px, _theme$typography3, _theme$typography3$px, _palette$ownerState$c, _palette, _palette2, _palette3;
    return {
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      // the <svg> will define the property that has `currentColor`
      // e.g. heroicons uses fill="none" and stroke="currentColor"
      fill: ownerState.hasSvgAsChild ? void 0 : "currentColor",
      flexShrink: 0,
      transition: (_theme$transitions = theme.transitions) == null || (_theme$transitions$cr = _theme$transitions.create) == null ? void 0 : _theme$transitions$cr.call(_theme$transitions, "fill", {
        duration: (_theme$transitions2 = theme.transitions) == null || (_theme$transitions2 = _theme$transitions2.duration) == null ? void 0 : _theme$transitions2.shorter
      }),
      fontSize: {
        inherit: "inherit",
        small: ((_theme$typography = theme.typography) == null || (_theme$typography$pxT = _theme$typography.pxToRem) == null ? void 0 : _theme$typography$pxT.call(_theme$typography, 20)) || "1.25rem",
        medium: ((_theme$typography2 = theme.typography) == null || (_theme$typography2$px = _theme$typography2.pxToRem) == null ? void 0 : _theme$typography2$px.call(_theme$typography2, 24)) || "1.5rem",
        large: ((_theme$typography3 = theme.typography) == null || (_theme$typography3$px = _theme$typography3.pxToRem) == null ? void 0 : _theme$typography3$px.call(_theme$typography3, 35)) || "2.1875rem"
      }[ownerState.fontSize],
      // TODO v5 deprecate, v6 remove for sx
      color: (_palette$ownerState$c = (_palette = (theme.vars || theme).palette) == null || (_palette = _palette[ownerState.color]) == null ? void 0 : _palette.main) != null ? _palette$ownerState$c : {
        action: (_palette2 = (theme.vars || theme).palette) == null || (_palette2 = _palette2.action) == null ? void 0 : _palette2.active,
        disabled: (_palette3 = (theme.vars || theme).palette) == null || (_palette3 = _palette3.action) == null ? void 0 : _palette3.disabled,
        inherit: void 0
      }[ownerState.color]
    };
  });
  const SvgIcon = /* @__PURE__ */ React$1__namespace.forwardRef(function SvgIcon2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiSvgIcon"
    });
    const {
      children,
      className,
      color: color2 = "inherit",
      component = "svg",
      fontSize = "medium",
      htmlColor,
      inheritViewBox = false,
      titleAccess,
      viewBox = "0 0 24 24"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$x);
    const hasSvgAsChild = /* @__PURE__ */ React$1__namespace.isValidElement(children) && children.type === "svg";
    const ownerState = _extends$1({}, props, {
      color: color2,
      component,
      fontSize,
      instanceFontSize: inProps.fontSize,
      inheritViewBox,
      viewBox,
      hasSvgAsChild
    });
    const more = {};
    if (!inheritViewBox) {
      more.viewBox = viewBox;
    }
    const classes = useUtilityClasses$s(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SvgIconRoot, _extends$1({
      as: component,
      className: clsx(classes.root, className),
      focusable: "false",
      color: htmlColor,
      "aria-hidden": titleAccess ? void 0 : true,
      role: titleAccess ? "img" : void 0,
      ref
    }, more, other, hasSvgAsChild && children.props, {
      ownerState,
      children: [hasSvgAsChild ? children.props.children : children, titleAccess ? /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        children: titleAccess
      }) : null]
    }));
  });
  SvgIcon.muiName = "SvgIcon";
  function createSvgIcon(path, displayName) {
    function Component(props, ref) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SvgIcon, _extends$1({
        "data-testid": `${displayName}Icon`,
        ref
      }, props, {
        children: path
      }));
    }
    Component.muiName = SvgIcon.muiName;
    return /* @__PURE__ */ React$1__namespace.memo(/* @__PURE__ */ React$1__namespace.forwardRef(Component));
  }
  const unstable_ClassNameGenerator = {
    configure: (generator) => {
      ClassNameGenerator$1.configure(generator);
    }
  };
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    capitalize: capitalize$1,
    createChainedFunction,
    createSvgIcon,
    debounce: debounce$1,
    deprecatedPropType,
    isMuiElement,
    ownerDocument,
    ownerWindow,
    requirePropFactory,
    setRef,
    unstable_ClassNameGenerator,
    unstable_useEnhancedEffect: useEnhancedEffect,
    unstable_useId: useId,
    unsupportedProp,
    useControlled,
    useEventCallback,
    useForkRef,
    useIsFocusVisible
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$0 = /* @__PURE__ */ getAugmentedNamespace(utils);
  var hasRequiredCreateSvgIcon;
  function requireCreateSvgIcon() {
    if (hasRequiredCreateSvgIcon)
      return createSvgIcon$1;
    hasRequiredCreateSvgIcon = 1;
    (function(exports) {
      "use client";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "default", {
        enumerable: true,
        get: function() {
          return _utils.createSvgIcon;
        }
      });
      var _utils = require$$0;
    })(createSvgIcon$1);
    return createSvgIcon$1;
  }
  var _interopRequireDefault = interopRequireDefaultExports;
  Object.defineProperty(Close, "__esModule", {
    value: true
  });
  var default_1 = Close.default = void 0;
  var _createSvgIcon = _interopRequireDefault(requireCreateSvgIcon());
  var _jsxRuntime = jsxRuntimeExports;
  default_1 = Close.default = (0, _createSvgIcon.default)(/* @__PURE__ */ (0, _jsxRuntime.jsx)("path", {
    d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  }), "Close");
  const _excluded$w = ["onChange", "maxRows", "minRows", "style", "value"];
  function getStyleValue(value) {
    return parseInt(value, 10) || 0;
  }
  const styles = {
    shadow: {
      // Visibility needed to hide the extra text area on iPads
      visibility: "hidden",
      // Remove from the content flow
      position: "absolute",
      // Ignore the scrollbar width
      overflow: "hidden",
      height: 0,
      top: 0,
      left: 0,
      // Create a new layer, increase the isolation of the computed values
      transform: "translateZ(0)"
    }
  };
  function isEmpty$1(obj) {
    return obj === void 0 || obj === null || Object.keys(obj).length === 0 || obj.outerHeightStyle === 0 && !obj.overflowing;
  }
  const TextareaAutosize = /* @__PURE__ */ React$1__namespace.forwardRef(function TextareaAutosize2(props, forwardedRef) {
    const {
      onChange,
      maxRows,
      minRows = 1,
      style: style2,
      value
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$w);
    const {
      current: isControlled
    } = React$1__namespace.useRef(value != null);
    const inputRef = React$1__namespace.useRef(null);
    const handleRef = useForkRef(forwardedRef, inputRef);
    const shadowRef = React$1__namespace.useRef(null);
    const calculateTextareaStyles = React$1__namespace.useCallback(() => {
      const input2 = inputRef.current;
      const containerWindow = ownerWindow(input2);
      const computedStyle = containerWindow.getComputedStyle(input2);
      if (computedStyle.width === "0px") {
        return {
          outerHeightStyle: 0,
          overflowing: false
        };
      }
      const inputShallow = shadowRef.current;
      inputShallow.style.width = computedStyle.width;
      inputShallow.value = input2.value || props.placeholder || "x";
      if (inputShallow.value.slice(-1) === "\n") {
        inputShallow.value += " ";
      }
      const boxSizing2 = computedStyle.boxSizing;
      const padding2 = getStyleValue(computedStyle.paddingBottom) + getStyleValue(computedStyle.paddingTop);
      const border2 = getStyleValue(computedStyle.borderBottomWidth) + getStyleValue(computedStyle.borderTopWidth);
      const innerHeight = inputShallow.scrollHeight;
      inputShallow.value = "x";
      const singleRowHeight = inputShallow.scrollHeight;
      let outerHeight = innerHeight;
      if (minRows) {
        outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight);
      }
      if (maxRows) {
        outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight);
      }
      outerHeight = Math.max(outerHeight, singleRowHeight);
      const outerHeightStyle = outerHeight + (boxSizing2 === "border-box" ? padding2 + border2 : 0);
      const overflowing = Math.abs(outerHeight - innerHeight) <= 1;
      return {
        outerHeightStyle,
        overflowing
      };
    }, [maxRows, minRows, props.placeholder]);
    const syncHeight = React$1__namespace.useCallback(() => {
      const textareaStyles = calculateTextareaStyles();
      if (isEmpty$1(textareaStyles)) {
        return;
      }
      const input2 = inputRef.current;
      input2.style.height = `${textareaStyles.outerHeightStyle}px`;
      input2.style.overflow = textareaStyles.overflowing ? "hidden" : "";
    }, [calculateTextareaStyles]);
    useEnhancedEffect(() => {
      const handleResize = () => {
        syncHeight();
      };
      let rAF;
      const debounceHandleResize = debounce$1(handleResize);
      const input2 = inputRef.current;
      const containerWindow = ownerWindow(input2);
      containerWindow.addEventListener("resize", debounceHandleResize);
      let resizeObserver;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(input2);
      }
      return () => {
        debounceHandleResize.clear();
        cancelAnimationFrame(rAF);
        containerWindow.removeEventListener("resize", debounceHandleResize);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }, [calculateTextareaStyles, syncHeight]);
    useEnhancedEffect(() => {
      syncHeight();
    });
    const handleChange = (event) => {
      if (!isControlled) {
        syncHeight();
      }
      if (onChange) {
        onChange(event);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx("textarea", _extends$1({
        value,
        onChange: handleChange,
        ref: handleRef,
        rows: minRows
      }, other)), /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
        "aria-hidden": true,
        className: props.className,
        readOnly: true,
        ref: shadowRef,
        tabIndex: -1,
        style: _extends$1({}, styles.shadow, style2, {
          paddingTop: 0,
          paddingBottom: 0
        })
      })]
    });
  });
  function stripDiacritics(string) {
    return typeof string.normalize !== "undefined" ? string.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : string;
  }
  function createFilterOptions(config2 = {}) {
    const {
      ignoreAccents = true,
      ignoreCase = true,
      limit,
      matchFrom = "any",
      stringify: stringify2,
      trim: trim2 = false
    } = config2;
    return (options, {
      inputValue,
      getOptionLabel
    }) => {
      let input2 = trim2 ? inputValue.trim() : inputValue;
      if (ignoreCase) {
        input2 = input2.toLowerCase();
      }
      if (ignoreAccents) {
        input2 = stripDiacritics(input2);
      }
      const filteredOptions = !input2 ? options : options.filter((option) => {
        let candidate = (stringify2 || getOptionLabel)(option);
        if (ignoreCase) {
          candidate = candidate.toLowerCase();
        }
        if (ignoreAccents) {
          candidate = stripDiacritics(candidate);
        }
        return matchFrom === "start" ? candidate.indexOf(input2) === 0 : candidate.indexOf(input2) > -1;
      });
      return typeof limit === "number" ? filteredOptions.slice(0, limit) : filteredOptions;
    };
  }
  function findIndex(array, comp) {
    for (let i = 0; i < array.length; i += 1) {
      if (comp(array[i])) {
        return i;
      }
    }
    return -1;
  }
  const defaultFilterOptions = createFilterOptions();
  const pageSize = 5;
  const defaultIsActiveElementInListbox = (listboxRef) => {
    var _listboxRef$current$p;
    return listboxRef.current !== null && ((_listboxRef$current$p = listboxRef.current.parentElement) == null ? void 0 : _listboxRef$current$p.contains(document.activeElement));
  };
  function useAutocomplete(props) {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unstable_isActiveElementInListbox = defaultIsActiveElementInListbox,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unstable_classNamePrefix = "Mui",
      autoComplete = false,
      autoHighlight = false,
      autoSelect = false,
      blurOnSelect = false,
      clearOnBlur = !props.freeSolo,
      clearOnEscape = false,
      componentName = "useAutocomplete",
      defaultValue = props.multiple ? [] : null,
      disableClearable = false,
      disableCloseOnSelect = false,
      disabled: disabledProp,
      disabledItemsFocusable = false,
      disableListWrap = false,
      filterOptions = defaultFilterOptions,
      filterSelectedOptions = false,
      freeSolo = false,
      getOptionDisabled,
      getOptionKey,
      getOptionLabel: getOptionLabelProp = (option) => {
        var _option$label;
        return (_option$label = option.label) != null ? _option$label : option;
      },
      groupBy,
      handleHomeEndKeys = !props.freeSolo,
      id: idProp,
      includeInputInList = false,
      inputValue: inputValueProp,
      isOptionEqualToValue = (option, value2) => option === value2,
      multiple = false,
      onChange,
      onClose,
      onHighlightChange,
      onInputChange,
      onOpen,
      open: openProp,
      openOnFocus = false,
      options,
      readOnly = false,
      selectOnFocus = !props.freeSolo,
      value: valueProp
    } = props;
    const id = useId(idProp);
    let getOptionLabel = getOptionLabelProp;
    getOptionLabel = (option) => {
      const optionLabel = getOptionLabelProp(option);
      if (typeof optionLabel !== "string") {
        return String(optionLabel);
      }
      return optionLabel;
    };
    const ignoreFocus = React$1__namespace.useRef(false);
    const firstFocus = React$1__namespace.useRef(true);
    const inputRef = React$1__namespace.useRef(null);
    const listboxRef = React$1__namespace.useRef(null);
    const [anchorEl, setAnchorEl] = React$1__namespace.useState(null);
    const [focusedTag, setFocusedTag] = React$1__namespace.useState(-1);
    const defaultHighlighted = autoHighlight ? 0 : -1;
    const highlightedIndexRef = React$1__namespace.useRef(defaultHighlighted);
    const [value, setValueState] = useControlled({
      controlled: valueProp,
      default: defaultValue,
      name: componentName
    });
    const [inputValue, setInputValueState] = useControlled({
      controlled: inputValueProp,
      default: "",
      name: componentName,
      state: "inputValue"
    });
    const [focused, setFocused] = React$1__namespace.useState(false);
    const resetInputValue = React$1__namespace.useCallback((event, newValue) => {
      const isOptionSelected = multiple ? value.length < newValue.length : newValue !== null;
      if (!isOptionSelected && !clearOnBlur) {
        return;
      }
      let newInputValue;
      if (multiple) {
        newInputValue = "";
      } else if (newValue == null) {
        newInputValue = "";
      } else {
        const optionLabel = getOptionLabel(newValue);
        newInputValue = typeof optionLabel === "string" ? optionLabel : "";
      }
      if (inputValue === newInputValue) {
        return;
      }
      setInputValueState(newInputValue);
      if (onInputChange) {
        onInputChange(event, newInputValue, "reset");
      }
    }, [getOptionLabel, inputValue, multiple, onInputChange, setInputValueState, clearOnBlur, value]);
    const [open, setOpenState] = useControlled({
      controlled: openProp,
      default: false,
      name: componentName,
      state: "open"
    });
    const [inputPristine, setInputPristine] = React$1__namespace.useState(true);
    const inputValueIsSelectedValue = !multiple && value != null && inputValue === getOptionLabel(value);
    const popupOpen = open && !readOnly;
    const filteredOptions = popupOpen ? filterOptions(
      options.filter((option) => {
        if (filterSelectedOptions && (multiple ? value : [value]).some((value2) => value2 !== null && isOptionEqualToValue(option, value2))) {
          return false;
        }
        return true;
      }),
      // we use the empty string to manipulate `filterOptions` to not filter any options
      // i.e. the filter predicate always returns true
      {
        inputValue: inputValueIsSelectedValue && inputPristine ? "" : inputValue,
        getOptionLabel
      }
    ) : [];
    const previousProps = usePreviousProps({
      filteredOptions,
      value,
      inputValue
    });
    React$1__namespace.useEffect(() => {
      const valueChange = value !== previousProps.value;
      if (focused && !valueChange) {
        return;
      }
      if (freeSolo && !valueChange) {
        return;
      }
      resetInputValue(null, value);
    }, [value, resetInputValue, focused, previousProps.value, freeSolo]);
    const listboxAvailable = open && filteredOptions.length > 0 && !readOnly;
    const focusTag = useEventCallback((tagToFocus) => {
      if (tagToFocus === -1) {
        inputRef.current.focus();
      } else {
        anchorEl.querySelector(`[data-tag-index="${tagToFocus}"]`).focus();
      }
    });
    React$1__namespace.useEffect(() => {
      if (multiple && focusedTag > value.length - 1) {
        setFocusedTag(-1);
        focusTag(-1);
      }
    }, [value, multiple, focusedTag, focusTag]);
    function validOptionIndex(index, direction) {
      if (!listboxRef.current || index < 0 || index >= filteredOptions.length) {
        return -1;
      }
      let nextFocus = index;
      while (true) {
        const option = listboxRef.current.querySelector(`[data-option-index="${nextFocus}"]`);
        const nextFocusDisabled = disabledItemsFocusable ? false : !option || option.disabled || option.getAttribute("aria-disabled") === "true";
        if (option && option.hasAttribute("tabindex") && !nextFocusDisabled) {
          return nextFocus;
        }
        if (direction === "next") {
          nextFocus = (nextFocus + 1) % filteredOptions.length;
        } else {
          nextFocus = (nextFocus - 1 + filteredOptions.length) % filteredOptions.length;
        }
        if (nextFocus === index) {
          return -1;
        }
      }
    }
    const setHighlightedIndex = useEventCallback(({
      event,
      index,
      reason = "auto"
    }) => {
      highlightedIndexRef.current = index;
      if (index === -1) {
        inputRef.current.removeAttribute("aria-activedescendant");
      } else {
        inputRef.current.setAttribute("aria-activedescendant", `${id}-option-${index}`);
      }
      if (onHighlightChange) {
        onHighlightChange(event, index === -1 ? null : filteredOptions[index], reason);
      }
      if (!listboxRef.current) {
        return;
      }
      const prev2 = listboxRef.current.querySelector(`[role="option"].${unstable_classNamePrefix}-focused`);
      if (prev2) {
        prev2.classList.remove(`${unstable_classNamePrefix}-focused`);
        prev2.classList.remove(`${unstable_classNamePrefix}-focusVisible`);
      }
      let listboxNode = listboxRef.current;
      if (listboxRef.current.getAttribute("role") !== "listbox") {
        listboxNode = listboxRef.current.parentElement.querySelector('[role="listbox"]');
      }
      if (!listboxNode) {
        return;
      }
      if (index === -1) {
        listboxNode.scrollTop = 0;
        return;
      }
      const option = listboxRef.current.querySelector(`[data-option-index="${index}"]`);
      if (!option) {
        return;
      }
      option.classList.add(`${unstable_classNamePrefix}-focused`);
      if (reason === "keyboard") {
        option.classList.add(`${unstable_classNamePrefix}-focusVisible`);
      }
      if (listboxNode.scrollHeight > listboxNode.clientHeight && reason !== "mouse" && reason !== "touch") {
        const element = option;
        const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
        const elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
        } else if (element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0) < listboxNode.scrollTop) {
          listboxNode.scrollTop = element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0);
        }
      }
    });
    const changeHighlightedIndex = useEventCallback(({
      event,
      diff,
      direction = "next",
      reason = "auto"
    }) => {
      if (!popupOpen) {
        return;
      }
      const getNextIndex = () => {
        const maxIndex = filteredOptions.length - 1;
        if (diff === "reset") {
          return defaultHighlighted;
        }
        if (diff === "start") {
          return 0;
        }
        if (diff === "end") {
          return maxIndex;
        }
        const newIndex = highlightedIndexRef.current + diff;
        if (newIndex < 0) {
          if (newIndex === -1 && includeInputInList) {
            return -1;
          }
          if (disableListWrap && highlightedIndexRef.current !== -1 || Math.abs(diff) > 1) {
            return 0;
          }
          return maxIndex;
        }
        if (newIndex > maxIndex) {
          if (newIndex === maxIndex + 1 && includeInputInList) {
            return -1;
          }
          if (disableListWrap || Math.abs(diff) > 1) {
            return maxIndex;
          }
          return 0;
        }
        return newIndex;
      };
      const nextIndex = validOptionIndex(getNextIndex(), direction);
      setHighlightedIndex({
        index: nextIndex,
        reason,
        event
      });
      if (autoComplete && diff !== "reset") {
        if (nextIndex === -1) {
          inputRef.current.value = inputValue;
        } else {
          const option = getOptionLabel(filteredOptions[nextIndex]);
          inputRef.current.value = option;
          const index = option.toLowerCase().indexOf(inputValue.toLowerCase());
          if (index === 0 && inputValue.length > 0) {
            inputRef.current.setSelectionRange(inputValue.length, option.length);
          }
        }
      }
    });
    const checkHighlightedOptionExists = () => {
      const isSameValue = (value1, value2) => {
        const label1 = value1 ? getOptionLabel(value1) : "";
        const label2 = value2 ? getOptionLabel(value2) : "";
        return label1 === label2;
      };
      if (highlightedIndexRef.current !== -1 && previousProps.filteredOptions && previousProps.filteredOptions.length !== filteredOptions.length && previousProps.inputValue === inputValue && (multiple ? value.length === previousProps.value.length && previousProps.value.every((val, i) => getOptionLabel(value[i]) === getOptionLabel(val)) : isSameValue(previousProps.value, value))) {
        const previousHighlightedOption = previousProps.filteredOptions[highlightedIndexRef.current];
        if (previousHighlightedOption) {
          const previousHighlightedOptionExists = filteredOptions.some((option) => {
            return getOptionLabel(option) === getOptionLabel(previousHighlightedOption);
          });
          if (previousHighlightedOptionExists) {
            return true;
          }
        }
      }
      return false;
    };
    const syncHighlightedIndex = React$1__namespace.useCallback(() => {
      if (!popupOpen) {
        return;
      }
      if (checkHighlightedOptionExists()) {
        return;
      }
      const valueItem = multiple ? value[0] : value;
      if (filteredOptions.length === 0 || valueItem == null) {
        changeHighlightedIndex({
          diff: "reset"
        });
        return;
      }
      if (!listboxRef.current) {
        return;
      }
      if (valueItem != null) {
        const currentOption = filteredOptions[highlightedIndexRef.current];
        if (multiple && currentOption && findIndex(value, (val) => isOptionEqualToValue(currentOption, val)) !== -1) {
          return;
        }
        const itemIndex = findIndex(filteredOptions, (optionItem) => isOptionEqualToValue(optionItem, valueItem));
        if (itemIndex === -1) {
          changeHighlightedIndex({
            diff: "reset"
          });
        } else {
          setHighlightedIndex({
            index: itemIndex
          });
        }
        return;
      }
      if (highlightedIndexRef.current >= filteredOptions.length - 1) {
        setHighlightedIndex({
          index: filteredOptions.length - 1
        });
        return;
      }
      setHighlightedIndex({
        index: highlightedIndexRef.current
      });
    }, [
      // Only sync the highlighted index when the option switch between empty and not
      filteredOptions.length,
      // Don't sync the highlighted index with the value when multiple
      // eslint-disable-next-line react-hooks/exhaustive-deps
      multiple ? false : value,
      filterSelectedOptions,
      changeHighlightedIndex,
      setHighlightedIndex,
      popupOpen,
      inputValue,
      multiple
    ]);
    const handleListboxRef = useEventCallback((node2) => {
      setRef(listboxRef, node2);
      if (!node2) {
        return;
      }
      syncHighlightedIndex();
    });
    React$1__namespace.useEffect(() => {
      syncHighlightedIndex();
    }, [syncHighlightedIndex]);
    const handleOpen = (event) => {
      if (open) {
        return;
      }
      setOpenState(true);
      setInputPristine(true);
      if (onOpen) {
        onOpen(event);
      }
    };
    const handleClose = (event, reason) => {
      if (!open) {
        return;
      }
      setOpenState(false);
      if (onClose) {
        onClose(event, reason);
      }
    };
    const handleValue = (event, newValue, reason, details) => {
      if (multiple) {
        if (value.length === newValue.length && value.every((val, i) => val === newValue[i])) {
          return;
        }
      } else if (value === newValue) {
        return;
      }
      if (onChange) {
        onChange(event, newValue, reason, details);
      }
      setValueState(newValue);
    };
    const isTouch = React$1__namespace.useRef(false);
    const selectNewValue = (event, option, reasonProp = "selectOption", origin = "options") => {
      let reason = reasonProp;
      let newValue = option;
      if (multiple) {
        newValue = Array.isArray(value) ? value.slice() : [];
        const itemIndex = findIndex(newValue, (valueItem) => isOptionEqualToValue(option, valueItem));
        if (itemIndex === -1) {
          newValue.push(option);
        } else if (origin !== "freeSolo") {
          newValue.splice(itemIndex, 1);
          reason = "removeOption";
        }
      }
      resetInputValue(event, newValue);
      handleValue(event, newValue, reason, {
        option
      });
      if (!disableCloseOnSelect && (!event || !event.ctrlKey && !event.metaKey)) {
        handleClose(event, reason);
      }
      if (blurOnSelect === true || blurOnSelect === "touch" && isTouch.current || blurOnSelect === "mouse" && !isTouch.current) {
        inputRef.current.blur();
      }
    };
    function validTagIndex(index, direction) {
      if (index === -1) {
        return -1;
      }
      let nextFocus = index;
      while (true) {
        if (direction === "next" && nextFocus === value.length || direction === "previous" && nextFocus === -1) {
          return -1;
        }
        const option = anchorEl.querySelector(`[data-tag-index="${nextFocus}"]`);
        if (!option || !option.hasAttribute("tabindex") || option.disabled || option.getAttribute("aria-disabled") === "true") {
          nextFocus += direction === "next" ? 1 : -1;
        } else {
          return nextFocus;
        }
      }
    }
    const handleFocusTag = (event, direction) => {
      if (!multiple) {
        return;
      }
      if (inputValue === "") {
        handleClose(event, "toggleInput");
      }
      let nextTag = focusedTag;
      if (focusedTag === -1) {
        if (inputValue === "" && direction === "previous") {
          nextTag = value.length - 1;
        }
      } else {
        nextTag += direction === "next" ? 1 : -1;
        if (nextTag < 0) {
          nextTag = 0;
        }
        if (nextTag === value.length) {
          nextTag = -1;
        }
      }
      nextTag = validTagIndex(nextTag, direction);
      setFocusedTag(nextTag);
      focusTag(nextTag);
    };
    const handleClear = (event) => {
      ignoreFocus.current = true;
      setInputValueState("");
      if (onInputChange) {
        onInputChange(event, "", "clear");
      }
      handleValue(event, multiple ? [] : null, "clear");
    };
    const handleKeyDown2 = (other) => (event) => {
      if (other.onKeyDown) {
        other.onKeyDown(event);
      }
      if (event.defaultMuiPrevented) {
        return;
      }
      if (focusedTag !== -1 && ["ArrowLeft", "ArrowRight"].indexOf(event.key) === -1) {
        setFocusedTag(-1);
        focusTag(-1);
      }
      if (event.which !== 229) {
        switch (event.key) {
          case "Home":
            if (popupOpen && handleHomeEndKeys) {
              event.preventDefault();
              changeHighlightedIndex({
                diff: "start",
                direction: "next",
                reason: "keyboard",
                event
              });
            }
            break;
          case "End":
            if (popupOpen && handleHomeEndKeys) {
              event.preventDefault();
              changeHighlightedIndex({
                diff: "end",
                direction: "previous",
                reason: "keyboard",
                event
              });
            }
            break;
          case "PageUp":
            event.preventDefault();
            changeHighlightedIndex({
              diff: -pageSize,
              direction: "previous",
              reason: "keyboard",
              event
            });
            handleOpen(event);
            break;
          case "PageDown":
            event.preventDefault();
            changeHighlightedIndex({
              diff: pageSize,
              direction: "next",
              reason: "keyboard",
              event
            });
            handleOpen(event);
            break;
          case "ArrowDown":
            event.preventDefault();
            changeHighlightedIndex({
              diff: 1,
              direction: "next",
              reason: "keyboard",
              event
            });
            handleOpen(event);
            break;
          case "ArrowUp":
            event.preventDefault();
            changeHighlightedIndex({
              diff: -1,
              direction: "previous",
              reason: "keyboard",
              event
            });
            handleOpen(event);
            break;
          case "ArrowLeft":
            handleFocusTag(event, "previous");
            break;
          case "ArrowRight":
            handleFocusTag(event, "next");
            break;
          case "Enter":
            if (highlightedIndexRef.current !== -1 && popupOpen) {
              const option = filteredOptions[highlightedIndexRef.current];
              const disabled = getOptionDisabled ? getOptionDisabled(option) : false;
              event.preventDefault();
              if (disabled) {
                return;
              }
              selectNewValue(event, option, "selectOption");
              if (autoComplete) {
                inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
              }
            } else if (freeSolo && inputValue !== "" && inputValueIsSelectedValue === false) {
              if (multiple) {
                event.preventDefault();
              }
              selectNewValue(event, inputValue, "createOption", "freeSolo");
            }
            break;
          case "Escape":
            if (popupOpen) {
              event.preventDefault();
              event.stopPropagation();
              handleClose(event, "escape");
            } else if (clearOnEscape && (inputValue !== "" || multiple && value.length > 0)) {
              event.preventDefault();
              event.stopPropagation();
              handleClear(event);
            }
            break;
          case "Backspace":
            if (multiple && !readOnly && inputValue === "" && value.length > 0) {
              const index = focusedTag === -1 ? value.length - 1 : focusedTag;
              const newValue = value.slice();
              newValue.splice(index, 1);
              handleValue(event, newValue, "removeOption", {
                option: value[index]
              });
            }
            break;
          case "Delete":
            if (multiple && !readOnly && inputValue === "" && value.length > 0 && focusedTag !== -1) {
              const index = focusedTag;
              const newValue = value.slice();
              newValue.splice(index, 1);
              handleValue(event, newValue, "removeOption", {
                option: value[index]
              });
            }
            break;
        }
      }
    };
    const handleFocus = (event) => {
      setFocused(true);
      if (openOnFocus && !ignoreFocus.current) {
        handleOpen(event);
      }
    };
    const handleBlur = (event) => {
      if (unstable_isActiveElementInListbox(listboxRef)) {
        inputRef.current.focus();
        return;
      }
      setFocused(false);
      firstFocus.current = true;
      ignoreFocus.current = false;
      if (autoSelect && highlightedIndexRef.current !== -1 && popupOpen) {
        selectNewValue(event, filteredOptions[highlightedIndexRef.current], "blur");
      } else if (autoSelect && freeSolo && inputValue !== "") {
        selectNewValue(event, inputValue, "blur", "freeSolo");
      } else if (clearOnBlur) {
        resetInputValue(event, value);
      }
      handleClose(event, "blur");
    };
    const handleInputChange = (event) => {
      const newValue = event.target.value;
      if (inputValue !== newValue) {
        setInputValueState(newValue);
        setInputPristine(false);
        if (onInputChange) {
          onInputChange(event, newValue, "input");
        }
      }
      if (newValue === "") {
        if (!disableClearable && !multiple) {
          handleValue(event, null, "clear");
        }
      } else {
        handleOpen(event);
      }
    };
    const handleOptionMouseMove = (event) => {
      const index = Number(event.currentTarget.getAttribute("data-option-index"));
      if (highlightedIndexRef.current !== index) {
        setHighlightedIndex({
          event,
          index,
          reason: "mouse"
        });
      }
    };
    const handleOptionTouchStart = (event) => {
      setHighlightedIndex({
        event,
        index: Number(event.currentTarget.getAttribute("data-option-index")),
        reason: "touch"
      });
      isTouch.current = true;
    };
    const handleOptionClick = (event) => {
      const index = Number(event.currentTarget.getAttribute("data-option-index"));
      selectNewValue(event, filteredOptions[index], "selectOption");
      isTouch.current = false;
    };
    const handleTagDelete = (index) => (event) => {
      const newValue = value.slice();
      newValue.splice(index, 1);
      handleValue(event, newValue, "removeOption", {
        option: value[index]
      });
    };
    const handlePopupIndicator = (event) => {
      if (open) {
        handleClose(event, "toggleInput");
      } else {
        handleOpen(event);
      }
    };
    const handleMouseDown = (event) => {
      if (!event.currentTarget.contains(event.target)) {
        return;
      }
      if (event.target.getAttribute("id") !== id) {
        event.preventDefault();
      }
    };
    const handleClick = (event) => {
      if (!event.currentTarget.contains(event.target)) {
        return;
      }
      inputRef.current.focus();
      if (selectOnFocus && firstFocus.current && inputRef.current.selectionEnd - inputRef.current.selectionStart === 0) {
        inputRef.current.select();
      }
      firstFocus.current = false;
    };
    const handleInputMouseDown = (event) => {
      if (!disabledProp && (inputValue === "" || !open)) {
        handlePopupIndicator(event);
      }
    };
    let dirty = freeSolo && inputValue.length > 0;
    dirty = dirty || (multiple ? value.length > 0 : value !== null);
    let groupedOptions = filteredOptions;
    if (groupBy) {
      groupedOptions = filteredOptions.reduce((acc, option, index) => {
        const group = groupBy(option);
        if (acc.length > 0 && acc[acc.length - 1].group === group) {
          acc[acc.length - 1].options.push(option);
        } else {
          acc.push({
            key: index,
            index,
            group,
            options: [option]
          });
        }
        return acc;
      }, []);
    }
    if (disabledProp && focused) {
      handleBlur();
    }
    return {
      getRootProps: (other = {}) => _extends$1({
        "aria-owns": listboxAvailable ? `${id}-listbox` : null
      }, other, {
        onKeyDown: handleKeyDown2(other),
        onMouseDown: handleMouseDown,
        onClick: handleClick
      }),
      getInputLabelProps: () => ({
        id: `${id}-label`,
        htmlFor: id
      }),
      getInputProps: () => ({
        id,
        value: inputValue,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onChange: handleInputChange,
        onMouseDown: handleInputMouseDown,
        // if open then this is handled imperatively so don't let react override
        // only have an opinion about this when closed
        "aria-activedescendant": popupOpen ? "" : null,
        "aria-autocomplete": autoComplete ? "both" : "list",
        "aria-controls": listboxAvailable ? `${id}-listbox` : void 0,
        "aria-expanded": listboxAvailable,
        // Disable browser's suggestion that might overlap with the popup.
        // Handle autocomplete but not autofill.
        autoComplete: "off",
        ref: inputRef,
        autoCapitalize: "none",
        spellCheck: "false",
        role: "combobox",
        disabled: disabledProp
      }),
      getClearProps: () => ({
        tabIndex: -1,
        type: "button",
        onClick: handleClear
      }),
      getPopupIndicatorProps: () => ({
        tabIndex: -1,
        type: "button",
        onClick: handlePopupIndicator
      }),
      getTagProps: ({
        index
      }) => _extends$1({
        key: index,
        "data-tag-index": index,
        tabIndex: -1
      }, !readOnly && {
        onDelete: handleTagDelete(index)
      }),
      getListboxProps: () => ({
        role: "listbox",
        id: `${id}-listbox`,
        "aria-labelledby": `${id}-label`,
        ref: handleListboxRef,
        onMouseDown: (event) => {
          event.preventDefault();
        }
      }),
      getOptionProps: ({
        index,
        option
      }) => {
        var _getOptionKey;
        const selected = (multiple ? value : [value]).some((value2) => value2 != null && isOptionEqualToValue(option, value2));
        const disabled = getOptionDisabled ? getOptionDisabled(option) : false;
        return {
          key: (_getOptionKey = getOptionKey == null ? void 0 : getOptionKey(option)) != null ? _getOptionKey : getOptionLabel(option),
          tabIndex: -1,
          role: "option",
          id: `${id}-option-${index}`,
          onMouseMove: handleOptionMouseMove,
          onClick: handleOptionClick,
          onTouchStart: handleOptionTouchStart,
          "data-option-index": index,
          "aria-disabled": disabled,
          "aria-selected": selected
        };
      },
      id,
      inputValue,
      value,
      dirty,
      expanded: popupOpen && anchorEl,
      popupOpen,
      focused: focused || focusedTag !== -1,
      anchorEl,
      setAnchorEl,
      focusedTag,
      groupedOptions
    };
  }
  function getListSubheaderUtilityClass(slot) {
    return generateUtilityClass$2("MuiListSubheader", slot);
  }
  generateUtilityClasses$2("MuiListSubheader", ["root", "colorPrimary", "colorInherit", "gutters", "inset", "sticky"]);
  const _excluded$v = ["className", "color", "component", "disableGutters", "disableSticky", "inset"];
  const useUtilityClasses$r = (ownerState) => {
    const {
      classes,
      color: color2,
      disableGutters,
      inset,
      disableSticky
    } = ownerState;
    const slots = {
      root: ["root", color2 !== "default" && `color${capitalize$1(color2)}`, !disableGutters && "gutters", inset && "inset", !disableSticky && "sticky"]
    };
    return composeClasses$1(slots, getListSubheaderUtilityClass, classes);
  };
  const ListSubheaderRoot = styled("li", {
    name: "MuiListSubheader",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "default" && styles2[`color${capitalize$1(ownerState.color)}`], !ownerState.disableGutters && styles2.gutters, ownerState.inset && styles2.inset, !ownerState.disableSticky && styles2.sticky];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    boxSizing: "border-box",
    lineHeight: "48px",
    listStyle: "none",
    color: (theme.vars || theme).palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(14)
  }, ownerState.color === "primary" && {
    color: (theme.vars || theme).palette.primary.main
  }, ownerState.color === "inherit" && {
    color: "inherit"
  }, !ownerState.disableGutters && {
    paddingLeft: 16,
    paddingRight: 16
  }, ownerState.inset && {
    paddingLeft: 72
  }, !ownerState.disableSticky && {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: (theme.vars || theme).palette.background.paper
  }));
  const ListSubheader = /* @__PURE__ */ React$1__namespace.forwardRef(function ListSubheader2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiListSubheader"
    });
    const {
      className,
      color: color2 = "default",
      component = "li",
      disableGutters = false,
      disableSticky = false,
      inset = false
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$v);
    const ownerState = _extends$1({}, props, {
      color: color2,
      component,
      disableGutters,
      disableSticky,
      inset
    });
    const classes = useUtilityClasses$r(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ListSubheaderRoot, _extends$1({
      as: component,
      className: clsx(classes.root, className),
      ref,
      ownerState
    }, other));
  });
  ListSubheader.muiSkipListHighlight = true;
  const ListSubheader$1 = ListSubheader;
  function getIconButtonUtilityClass(slot) {
    return generateUtilityClass$2("MuiIconButton", slot);
  }
  const iconButtonClasses = generateUtilityClasses$2("MuiIconButton", ["root", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorError", "colorInfo", "colorSuccess", "colorWarning", "edgeStart", "edgeEnd", "sizeSmall", "sizeMedium", "sizeLarge"]);
  const _excluded$u = ["edge", "children", "className", "color", "disabled", "disableFocusRipple", "size"];
  const useUtilityClasses$q = (ownerState) => {
    const {
      classes,
      disabled,
      color: color2,
      edge,
      size
    } = ownerState;
    const slots = {
      root: ["root", disabled && "disabled", color2 !== "default" && `color${capitalize$1(color2)}`, edge && `edge${capitalize$1(edge)}`, `size${capitalize$1(size)}`]
    };
    return composeClasses$1(slots, getIconButtonUtilityClass, classes);
  };
  const IconButtonRoot = styled(ButtonBase$1, {
    name: "MuiIconButton",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "default" && styles2[`color${capitalize$1(ownerState.color)}`], ownerState.edge && styles2[`edge${capitalize$1(ownerState.edge)}`], styles2[`size${capitalize$1(ownerState.size)}`]];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    textAlign: "center",
    flex: "0 0 auto",
    fontSize: theme.typography.pxToRem(24),
    padding: 8,
    borderRadius: "50%",
    overflow: "visible",
    // Explicitly set the default value to solve a bug on IE11.
    color: (theme.vars || theme).palette.action.active,
    transition: theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest
    })
  }, !ownerState.disableRipple && {
    "&:hover": {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette.action.active, theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  }, ownerState.edge === "start" && {
    marginLeft: ownerState.size === "small" ? -3 : -12
  }, ownerState.edge === "end" && {
    marginRight: ownerState.size === "small" ? -3 : -12
  }), ({
    theme,
    ownerState
  }) => {
    var _palette;
    const palette2 = (_palette = (theme.vars || theme).palette) == null ? void 0 : _palette[ownerState.color];
    return _extends$1({}, ownerState.color === "inherit" && {
      color: "inherit"
    }, ownerState.color !== "inherit" && ownerState.color !== "default" && _extends$1({
      color: palette2 == null ? void 0 : palette2.main
    }, !ownerState.disableRipple && {
      "&:hover": _extends$1({}, palette2 && {
        backgroundColor: theme.vars ? `rgba(${palette2.mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(palette2.main, theme.palette.action.hoverOpacity)
      }, {
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      })
    }), ownerState.size === "small" && {
      padding: 5,
      fontSize: theme.typography.pxToRem(18)
    }, ownerState.size === "large" && {
      padding: 12,
      fontSize: theme.typography.pxToRem(28)
    }, {
      [`&.${iconButtonClasses.disabled}`]: {
        backgroundColor: "transparent",
        color: (theme.vars || theme).palette.action.disabled
      }
    });
  });
  const IconButton = /* @__PURE__ */ React$1__namespace.forwardRef(function IconButton2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiIconButton"
    });
    const {
      edge = false,
      children,
      className,
      color: color2 = "default",
      disabled = false,
      disableFocusRipple = false,
      size = "medium"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$u);
    const ownerState = _extends$1({}, props, {
      edge,
      color: color2,
      disabled,
      disableFocusRipple,
      size
    });
    const classes = useUtilityClasses$q(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(IconButtonRoot, _extends$1({
      className: clsx(classes.root, className),
      centerRipple: true,
      focusRipple: !disableFocusRipple,
      disabled,
      ref
    }, other, {
      ownerState,
      children
    }));
  });
  const IconButton$1 = IconButton;
  const CancelIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
  }), "Cancel");
  function getChipUtilityClass(slot) {
    return generateUtilityClass$2("MuiChip", slot);
  }
  const chipClasses = generateUtilityClasses$2("MuiChip", ["root", "sizeSmall", "sizeMedium", "colorError", "colorInfo", "colorPrimary", "colorSecondary", "colorSuccess", "colorWarning", "disabled", "clickable", "clickableColorPrimary", "clickableColorSecondary", "deletable", "deletableColorPrimary", "deletableColorSecondary", "outlined", "filled", "outlinedPrimary", "outlinedSecondary", "filledPrimary", "filledSecondary", "avatar", "avatarSmall", "avatarMedium", "avatarColorPrimary", "avatarColorSecondary", "icon", "iconSmall", "iconMedium", "iconColorPrimary", "iconColorSecondary", "label", "labelSmall", "labelMedium", "deleteIcon", "deleteIconSmall", "deleteIconMedium", "deleteIconColorPrimary", "deleteIconColorSecondary", "deleteIconOutlinedColorPrimary", "deleteIconOutlinedColorSecondary", "deleteIconFilledColorPrimary", "deleteIconFilledColorSecondary", "focusVisible"]);
  const chipClasses$1 = chipClasses;
  const _excluded$t = ["avatar", "className", "clickable", "color", "component", "deleteIcon", "disabled", "icon", "label", "onClick", "onDelete", "onKeyDown", "onKeyUp", "size", "variant", "tabIndex", "skipFocusWhenDisabled"];
  const useUtilityClasses$p = (ownerState) => {
    const {
      classes,
      disabled,
      size,
      color: color2,
      iconColor,
      onDelete,
      clickable,
      variant
    } = ownerState;
    const slots = {
      root: ["root", variant, disabled && "disabled", `size${capitalize$1(size)}`, `color${capitalize$1(color2)}`, clickable && "clickable", clickable && `clickableColor${capitalize$1(color2)}`, onDelete && "deletable", onDelete && `deletableColor${capitalize$1(color2)}`, `${variant}${capitalize$1(color2)}`],
      label: ["label", `label${capitalize$1(size)}`],
      avatar: ["avatar", `avatar${capitalize$1(size)}`, `avatarColor${capitalize$1(color2)}`],
      icon: ["icon", `icon${capitalize$1(size)}`, `iconColor${capitalize$1(iconColor)}`],
      deleteIcon: ["deleteIcon", `deleteIcon${capitalize$1(size)}`, `deleteIconColor${capitalize$1(color2)}`, `deleteIcon${capitalize$1(variant)}Color${capitalize$1(color2)}`]
    };
    return composeClasses$1(slots, getChipUtilityClass, classes);
  };
  const ChipRoot = styled("div", {
    name: "MuiChip",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      const {
        color: color2,
        iconColor,
        clickable,
        onDelete,
        size,
        variant
      } = ownerState;
      return [{
        [`& .${chipClasses$1.avatar}`]: styles2.avatar
      }, {
        [`& .${chipClasses$1.avatar}`]: styles2[`avatar${capitalize$1(size)}`]
      }, {
        [`& .${chipClasses$1.avatar}`]: styles2[`avatarColor${capitalize$1(color2)}`]
      }, {
        [`& .${chipClasses$1.icon}`]: styles2.icon
      }, {
        [`& .${chipClasses$1.icon}`]: styles2[`icon${capitalize$1(size)}`]
      }, {
        [`& .${chipClasses$1.icon}`]: styles2[`iconColor${capitalize$1(iconColor)}`]
      }, {
        [`& .${chipClasses$1.deleteIcon}`]: styles2.deleteIcon
      }, {
        [`& .${chipClasses$1.deleteIcon}`]: styles2[`deleteIcon${capitalize$1(size)}`]
      }, {
        [`& .${chipClasses$1.deleteIcon}`]: styles2[`deleteIconColor${capitalize$1(color2)}`]
      }, {
        [`& .${chipClasses$1.deleteIcon}`]: styles2[`deleteIcon${capitalize$1(variant)}Color${capitalize$1(color2)}`]
      }, styles2.root, styles2[`size${capitalize$1(size)}`], styles2[`color${capitalize$1(color2)}`], clickable && styles2.clickable, clickable && color2 !== "default" && styles2[`clickableColor${capitalize$1(color2)})`], onDelete && styles2.deletable, onDelete && color2 !== "default" && styles2[`deletableColor${capitalize$1(color2)}`], styles2[variant], styles2[`${variant}${capitalize$1(color2)}`]];
    }
  })(({
    theme,
    ownerState
  }) => {
    const textColor = theme.palette.mode === "light" ? theme.palette.grey[700] : theme.palette.grey[300];
    return _extends$1({
      maxWidth: "100%",
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(13),
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: 32,
      color: (theme.vars || theme).palette.text.primary,
      backgroundColor: (theme.vars || theme).palette.action.selected,
      borderRadius: 32 / 2,
      whiteSpace: "nowrap",
      transition: theme.transitions.create(["background-color", "box-shadow"]),
      // reset cursor explicitly in case ButtonBase is used
      cursor: "unset",
      // We disable the focus ring for mouse, touch and keyboard users.
      outline: 0,
      textDecoration: "none",
      border: 0,
      // Remove `button` border
      padding: 0,
      // Remove `button` padding
      verticalAlign: "middle",
      boxSizing: "border-box",
      [`&.${chipClasses$1.disabled}`]: {
        opacity: (theme.vars || theme).palette.action.disabledOpacity,
        pointerEvents: "none"
      },
      [`& .${chipClasses$1.avatar}`]: {
        marginLeft: 5,
        marginRight: -6,
        width: 24,
        height: 24,
        color: theme.vars ? theme.vars.palette.Chip.defaultAvatarColor : textColor,
        fontSize: theme.typography.pxToRem(12)
      },
      [`& .${chipClasses$1.avatarColorPrimary}`]: {
        color: (theme.vars || theme).palette.primary.contrastText,
        backgroundColor: (theme.vars || theme).palette.primary.dark
      },
      [`& .${chipClasses$1.avatarColorSecondary}`]: {
        color: (theme.vars || theme).palette.secondary.contrastText,
        backgroundColor: (theme.vars || theme).palette.secondary.dark
      },
      [`& .${chipClasses$1.avatarSmall}`]: {
        marginLeft: 4,
        marginRight: -4,
        width: 18,
        height: 18,
        fontSize: theme.typography.pxToRem(10)
      },
      [`& .${chipClasses$1.icon}`]: _extends$1({
        marginLeft: 5,
        marginRight: -6
      }, ownerState.size === "small" && {
        fontSize: 18,
        marginLeft: 4,
        marginRight: -4
      }, ownerState.iconColor === ownerState.color && _extends$1({
        color: theme.vars ? theme.vars.palette.Chip.defaultIconColor : textColor
      }, ownerState.color !== "default" && {
        color: "inherit"
      })),
      [`& .${chipClasses$1.deleteIcon}`]: _extends$1({
        WebkitTapHighlightColor: "transparent",
        color: theme.vars ? `rgba(${theme.vars.palette.text.primaryChannel} / 0.26)` : alpha_1(theme.palette.text.primary, 0.26),
        fontSize: 22,
        cursor: "pointer",
        margin: "0 5px 0 -6px",
        "&:hover": {
          color: theme.vars ? `rgba(${theme.vars.palette.text.primaryChannel} / 0.4)` : alpha_1(theme.palette.text.primary, 0.4)
        }
      }, ownerState.size === "small" && {
        fontSize: 16,
        marginRight: 4,
        marginLeft: -4
      }, ownerState.color !== "default" && {
        color: theme.vars ? `rgba(${theme.vars.palette[ownerState.color].contrastTextChannel} / 0.7)` : alpha_1(theme.palette[ownerState.color].contrastText, 0.7),
        "&:hover, &:active": {
          color: (theme.vars || theme).palette[ownerState.color].contrastText
        }
      })
    }, ownerState.size === "small" && {
      height: 24
    }, ownerState.color !== "default" && {
      backgroundColor: (theme.vars || theme).palette[ownerState.color].main,
      color: (theme.vars || theme).palette[ownerState.color].contrastText
    }, ownerState.onDelete && {
      [`&.${chipClasses$1.focusVisible}`]: {
        backgroundColor: theme.vars ? `rgba(${theme.vars.palette.action.selectedChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.focusOpacity}))` : alpha_1(theme.palette.action.selected, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
      }
    }, ownerState.onDelete && ownerState.color !== "default" && {
      [`&.${chipClasses$1.focusVisible}`]: {
        backgroundColor: (theme.vars || theme).palette[ownerState.color].dark
      }
    });
  }, ({
    theme,
    ownerState
  }) => _extends$1({}, ownerState.clickable && {
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.action.selectedChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))` : alpha_1(theme.palette.action.selected, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity)
    },
    [`&.${chipClasses$1.focusVisible}`]: {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.action.selectedChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.focusOpacity}))` : alpha_1(theme.palette.action.selected, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
    },
    "&:active": {
      boxShadow: (theme.vars || theme).shadows[1]
    }
  }, ownerState.clickable && ownerState.color !== "default" && {
    [`&:hover, &.${chipClasses$1.focusVisible}`]: {
      backgroundColor: (theme.vars || theme).palette[ownerState.color].dark
    }
  }), ({
    theme,
    ownerState
  }) => _extends$1({}, ownerState.variant === "outlined" && {
    backgroundColor: "transparent",
    border: theme.vars ? `1px solid ${theme.vars.palette.Chip.defaultBorder}` : `1px solid ${theme.palette.mode === "light" ? theme.palette.grey[400] : theme.palette.grey[700]}`,
    [`&.${chipClasses$1.clickable}:hover`]: {
      backgroundColor: (theme.vars || theme).palette.action.hover
    },
    [`&.${chipClasses$1.focusVisible}`]: {
      backgroundColor: (theme.vars || theme).palette.action.focus
    },
    [`& .${chipClasses$1.avatar}`]: {
      marginLeft: 4
    },
    [`& .${chipClasses$1.avatarSmall}`]: {
      marginLeft: 2
    },
    [`& .${chipClasses$1.icon}`]: {
      marginLeft: 4
    },
    [`& .${chipClasses$1.iconSmall}`]: {
      marginLeft: 2
    },
    [`& .${chipClasses$1.deleteIcon}`]: {
      marginRight: 5
    },
    [`& .${chipClasses$1.deleteIconSmall}`]: {
      marginRight: 3
    }
  }, ownerState.variant === "outlined" && ownerState.color !== "default" && {
    color: (theme.vars || theme).palette[ownerState.color].main,
    border: `1px solid ${theme.vars ? `rgba(${theme.vars.palette[ownerState.color].mainChannel} / 0.7)` : alpha_1(theme.palette[ownerState.color].main, 0.7)}`,
    [`&.${chipClasses$1.clickable}:hover`]: {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette[ownerState.color].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity)
    },
    [`&.${chipClasses$1.focusVisible}`]: {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette[ownerState.color].mainChannel} / ${theme.vars.palette.action.focusOpacity})` : alpha_1(theme.palette[ownerState.color].main, theme.palette.action.focusOpacity)
    },
    [`& .${chipClasses$1.deleteIcon}`]: {
      color: theme.vars ? `rgba(${theme.vars.palette[ownerState.color].mainChannel} / 0.7)` : alpha_1(theme.palette[ownerState.color].main, 0.7),
      "&:hover, &:active": {
        color: (theme.vars || theme).palette[ownerState.color].main
      }
    }
  }));
  const ChipLabel = styled("span", {
    name: "MuiChip",
    slot: "Label",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      const {
        size
      } = ownerState;
      return [styles2.label, styles2[`label${capitalize$1(size)}`]];
    }
  })(({
    ownerState
  }) => _extends$1({
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingLeft: 12,
    paddingRight: 12,
    whiteSpace: "nowrap"
  }, ownerState.variant === "outlined" && {
    paddingLeft: 11,
    paddingRight: 11
  }, ownerState.size === "small" && {
    paddingLeft: 8,
    paddingRight: 8
  }, ownerState.size === "small" && ownerState.variant === "outlined" && {
    paddingLeft: 7,
    paddingRight: 7
  }));
  function isDeleteKeyboardEvent(keyboardEvent) {
    return keyboardEvent.key === "Backspace" || keyboardEvent.key === "Delete";
  }
  const Chip = /* @__PURE__ */ React$1__namespace.forwardRef(function Chip2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiChip"
    });
    const {
      avatar: avatarProp,
      className,
      clickable: clickableProp,
      color: color2 = "default",
      component: ComponentProp,
      deleteIcon: deleteIconProp,
      disabled = false,
      icon: iconProp,
      label,
      onClick,
      onDelete,
      onKeyDown,
      onKeyUp,
      size = "medium",
      variant = "filled",
      tabIndex,
      skipFocusWhenDisabled = false
      // TODO v6: Rename to `focusableWhenDisabled`.
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$t);
    const chipRef = React$1__namespace.useRef(null);
    const handleRef = useForkRef(chipRef, ref);
    const handleDeleteIconClick = (event) => {
      event.stopPropagation();
      if (onDelete) {
        onDelete(event);
      }
    };
    const handleKeyDown2 = (event) => {
      if (event.currentTarget === event.target && isDeleteKeyboardEvent(event)) {
        event.preventDefault();
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
    };
    const handleKeyUp = (event) => {
      if (event.currentTarget === event.target) {
        if (onDelete && isDeleteKeyboardEvent(event)) {
          onDelete(event);
        } else if (event.key === "Escape" && chipRef.current) {
          chipRef.current.blur();
        }
      }
      if (onKeyUp) {
        onKeyUp(event);
      }
    };
    const clickable = clickableProp !== false && onClick ? true : clickableProp;
    const component = clickable || onDelete ? ButtonBase$1 : ComponentProp || "div";
    const ownerState = _extends$1({}, props, {
      component,
      disabled,
      size,
      color: color2,
      iconColor: /* @__PURE__ */ React$1__namespace.isValidElement(iconProp) ? iconProp.props.color || color2 : color2,
      onDelete: !!onDelete,
      clickable,
      variant
    });
    const classes = useUtilityClasses$p(ownerState);
    const moreProps = component === ButtonBase$1 ? _extends$1({
      component: ComponentProp || "div",
      focusVisibleClassName: classes.focusVisible
    }, onDelete && {
      disableRipple: true
    }) : {};
    let deleteIcon = null;
    if (onDelete) {
      deleteIcon = deleteIconProp && /* @__PURE__ */ React$1__namespace.isValidElement(deleteIconProp) ? /* @__PURE__ */ React$1__namespace.cloneElement(deleteIconProp, {
        className: clsx(deleteIconProp.props.className, classes.deleteIcon),
        onClick: handleDeleteIconClick
      }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CancelIcon, {
        className: clsx(classes.deleteIcon),
        onClick: handleDeleteIconClick
      });
    }
    let avatar = null;
    if (avatarProp && /* @__PURE__ */ React$1__namespace.isValidElement(avatarProp)) {
      avatar = /* @__PURE__ */ React$1__namespace.cloneElement(avatarProp, {
        className: clsx(classes.avatar, avatarProp.props.className)
      });
    }
    let icon = null;
    if (iconProp && /* @__PURE__ */ React$1__namespace.isValidElement(iconProp)) {
      icon = /* @__PURE__ */ React$1__namespace.cloneElement(iconProp, {
        className: clsx(classes.icon, iconProp.props.className)
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ChipRoot, _extends$1({
      as: component,
      className: clsx(classes.root, className),
      disabled: clickable && disabled ? true : void 0,
      onClick,
      onKeyDown: handleKeyDown2,
      onKeyUp: handleKeyUp,
      ref: handleRef,
      tabIndex: skipFocusWhenDisabled && disabled ? -1 : tabIndex,
      ownerState
    }, moreProps, other, {
      children: [avatar || icon, /* @__PURE__ */ jsxRuntimeExports.jsx(ChipLabel, {
        className: clsx(classes.label),
        ownerState,
        children: label
      }), deleteIcon]
    }));
  });
  const Chip$1 = Chip;
  function formControlState({
    props,
    states,
    muiFormControl
  }) {
    return states.reduce((acc, state) => {
      acc[state] = props[state];
      if (muiFormControl) {
        if (typeof props[state] === "undefined") {
          acc[state] = muiFormControl[state];
        }
      }
      return acc;
    }, {});
  }
  const FormControlContext = /* @__PURE__ */ React$1__namespace.createContext(void 0);
  const FormControlContext$1 = FormControlContext;
  function useFormControl() {
    return React$1__namespace.useContext(FormControlContext$1);
  }
  function GlobalStyles$1(props) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalStyles$2, _extends$1({}, props, {
      defaultTheme: defaultTheme$2,
      themeId: THEME_ID
    }));
  }
  function hasValue(value) {
    return value != null && !(Array.isArray(value) && value.length === 0);
  }
  function isFilled(obj, SSR = false) {
    return obj && (hasValue(obj.value) && obj.value !== "" || SSR && hasValue(obj.defaultValue) && obj.defaultValue !== "");
  }
  function isAdornedStart(obj) {
    return obj.startAdornment;
  }
  function getInputBaseUtilityClass(slot) {
    return generateUtilityClass$2("MuiInputBase", slot);
  }
  const inputBaseClasses = generateUtilityClasses$2("MuiInputBase", ["root", "formControl", "focused", "disabled", "adornedStart", "adornedEnd", "error", "sizeSmall", "multiline", "colorSecondary", "fullWidth", "hiddenLabel", "readOnly", "input", "inputSizeSmall", "inputMultiline", "inputTypeSearch", "inputAdornedStart", "inputAdornedEnd", "inputHiddenLabel"]);
  const inputBaseClasses$1 = inputBaseClasses;
  const _excluded$s = ["aria-describedby", "autoComplete", "autoFocus", "className", "color", "components", "componentsProps", "defaultValue", "disabled", "disableInjectingGlobalStyles", "endAdornment", "error", "fullWidth", "id", "inputComponent", "inputProps", "inputRef", "margin", "maxRows", "minRows", "multiline", "name", "onBlur", "onChange", "onClick", "onFocus", "onKeyDown", "onKeyUp", "placeholder", "readOnly", "renderSuffix", "rows", "size", "slotProps", "slots", "startAdornment", "type", "value"];
  const rootOverridesResolver = (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, ownerState.formControl && styles2.formControl, ownerState.startAdornment && styles2.adornedStart, ownerState.endAdornment && styles2.adornedEnd, ownerState.error && styles2.error, ownerState.size === "small" && styles2.sizeSmall, ownerState.multiline && styles2.multiline, ownerState.color && styles2[`color${capitalize$1(ownerState.color)}`], ownerState.fullWidth && styles2.fullWidth, ownerState.hiddenLabel && styles2.hiddenLabel];
  };
  const inputOverridesResolver = (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.input, ownerState.size === "small" && styles2.inputSizeSmall, ownerState.multiline && styles2.inputMultiline, ownerState.type === "search" && styles2.inputTypeSearch, ownerState.startAdornment && styles2.inputAdornedStart, ownerState.endAdornment && styles2.inputAdornedEnd, ownerState.hiddenLabel && styles2.inputHiddenLabel];
  };
  const useUtilityClasses$o = (ownerState) => {
    const {
      classes,
      color: color2,
      disabled,
      error,
      endAdornment,
      focused,
      formControl,
      fullWidth,
      hiddenLabel,
      multiline,
      readOnly,
      size,
      startAdornment,
      type
    } = ownerState;
    const slots = {
      root: ["root", `color${capitalize$1(color2)}`, disabled && "disabled", error && "error", fullWidth && "fullWidth", focused && "focused", formControl && "formControl", size && size !== "medium" && `size${capitalize$1(size)}`, multiline && "multiline", startAdornment && "adornedStart", endAdornment && "adornedEnd", hiddenLabel && "hiddenLabel", readOnly && "readOnly"],
      input: ["input", disabled && "disabled", type === "search" && "inputTypeSearch", multiline && "inputMultiline", size === "small" && "inputSizeSmall", hiddenLabel && "inputHiddenLabel", startAdornment && "inputAdornedStart", endAdornment && "inputAdornedEnd", readOnly && "readOnly"]
    };
    return composeClasses$1(slots, getInputBaseUtilityClass, classes);
  };
  const InputBaseRoot = styled("div", {
    name: "MuiInputBase",
    slot: "Root",
    overridesResolver: rootOverridesResolver
  })(({
    theme,
    ownerState
  }) => _extends$1({}, theme.typography.body1, {
    color: (theme.vars || theme).palette.text.primary,
    lineHeight: "1.4375em",
    // 23px
    boxSizing: "border-box",
    // Prevent padding issue with fullWidth.
    position: "relative",
    cursor: "text",
    display: "inline-flex",
    alignItems: "center",
    [`&.${inputBaseClasses$1.disabled}`]: {
      color: (theme.vars || theme).palette.text.disabled,
      cursor: "default"
    }
  }, ownerState.multiline && _extends$1({
    padding: "4px 0 5px"
  }, ownerState.size === "small" && {
    paddingTop: 1
  }), ownerState.fullWidth && {
    width: "100%"
  }));
  const InputBaseComponent = styled("input", {
    name: "MuiInputBase",
    slot: "Input",
    overridesResolver: inputOverridesResolver
  })(({
    theme,
    ownerState
  }) => {
    const light2 = theme.palette.mode === "light";
    const placeholder = _extends$1({
      color: "currentColor"
    }, theme.vars ? {
      opacity: theme.vars.opacity.inputPlaceholder
    } : {
      opacity: light2 ? 0.42 : 0.5
    }, {
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shorter
      })
    });
    const placeholderHidden = {
      opacity: "0 !important"
    };
    const placeholderVisible = theme.vars ? {
      opacity: theme.vars.opacity.inputPlaceholder
    } : {
      opacity: light2 ? 0.42 : 0.5
    };
    return _extends$1({
      font: "inherit",
      letterSpacing: "inherit",
      color: "currentColor",
      padding: "4px 0 5px",
      border: 0,
      boxSizing: "content-box",
      background: "none",
      height: "1.4375em",
      // Reset 23pxthe native input line-height
      margin: 0,
      // Reset for Safari
      WebkitTapHighlightColor: "transparent",
      display: "block",
      // Make the flex item shrink with Firefox
      minWidth: 0,
      width: "100%",
      // Fix IE11 width issue
      animationName: "mui-auto-fill-cancel",
      animationDuration: "10ms",
      "&::-webkit-input-placeholder": placeholder,
      "&::-moz-placeholder": placeholder,
      // Firefox 19+
      "&:-ms-input-placeholder": placeholder,
      // IE11
      "&::-ms-input-placeholder": placeholder,
      // Edge
      "&:focus": {
        outline: 0
      },
      // Reset Firefox invalid required input style
      "&:invalid": {
        boxShadow: "none"
      },
      "&::-webkit-search-decoration": {
        // Remove the padding when type=search.
        WebkitAppearance: "none"
      },
      // Show and hide the placeholder logic
      [`label[data-shrink=false] + .${inputBaseClasses$1.formControl} &`]: {
        "&::-webkit-input-placeholder": placeholderHidden,
        "&::-moz-placeholder": placeholderHidden,
        // Firefox 19+
        "&:-ms-input-placeholder": placeholderHidden,
        // IE11
        "&::-ms-input-placeholder": placeholderHidden,
        // Edge
        "&:focus::-webkit-input-placeholder": placeholderVisible,
        "&:focus::-moz-placeholder": placeholderVisible,
        // Firefox 19+
        "&:focus:-ms-input-placeholder": placeholderVisible,
        // IE11
        "&:focus::-ms-input-placeholder": placeholderVisible
        // Edge
      },
      [`&.${inputBaseClasses$1.disabled}`]: {
        opacity: 1,
        // Reset iOS opacity
        WebkitTextFillColor: (theme.vars || theme).palette.text.disabled
        // Fix opacity Safari bug
      },
      "&:-webkit-autofill": {
        animationDuration: "5000s",
        animationName: "mui-auto-fill"
      }
    }, ownerState.size === "small" && {
      paddingTop: 1
    }, ownerState.multiline && {
      height: "auto",
      resize: "none",
      padding: 0,
      paddingTop: 0
    }, ownerState.type === "search" && {
      // Improve type search style.
      MozAppearance: "textfield"
    });
  });
  const inputGlobalStyles = /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalStyles$1, {
    styles: {
      "@keyframes mui-auto-fill": {
        from: {
          display: "block"
        }
      },
      "@keyframes mui-auto-fill-cancel": {
        from: {
          display: "block"
        }
      }
    }
  });
  const InputBase = /* @__PURE__ */ React$1__namespace.forwardRef(function InputBase2(inProps, ref) {
    var _slotProps$input;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiInputBase"
    });
    const {
      "aria-describedby": ariaDescribedby,
      autoComplete,
      autoFocus,
      className,
      components = {},
      componentsProps = {},
      defaultValue,
      disabled,
      disableInjectingGlobalStyles,
      endAdornment,
      fullWidth = false,
      id,
      inputComponent = "input",
      inputProps: inputPropsProp = {},
      inputRef: inputRefProp,
      maxRows,
      minRows,
      multiline = false,
      name,
      onBlur,
      onChange,
      onClick,
      onFocus,
      onKeyDown,
      onKeyUp,
      placeholder,
      readOnly,
      renderSuffix,
      rows,
      slotProps = {},
      slots = {},
      startAdornment,
      type = "text",
      value: valueProp
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$s);
    const value = inputPropsProp.value != null ? inputPropsProp.value : valueProp;
    const {
      current: isControlled
    } = React$1__namespace.useRef(value != null);
    const inputRef = React$1__namespace.useRef();
    const handleInputRefWarning = React$1__namespace.useCallback((instance) => {
    }, []);
    const handleInputRef = useForkRef(inputRef, inputRefProp, inputPropsProp.ref, handleInputRefWarning);
    const [focused, setFocused] = React$1__namespace.useState(false);
    const muiFormControl = useFormControl();
    const fcs = formControlState({
      props,
      muiFormControl,
      states: ["color", "disabled", "error", "hiddenLabel", "size", "required", "filled"]
    });
    fcs.focused = muiFormControl ? muiFormControl.focused : focused;
    React$1__namespace.useEffect(() => {
      if (!muiFormControl && disabled && focused) {
        setFocused(false);
        if (onBlur) {
          onBlur();
        }
      }
    }, [muiFormControl, disabled, focused, onBlur]);
    const onFilled = muiFormControl && muiFormControl.onFilled;
    const onEmpty = muiFormControl && muiFormControl.onEmpty;
    const checkDirty = React$1__namespace.useCallback((obj) => {
      if (isFilled(obj)) {
        if (onFilled) {
          onFilled();
        }
      } else if (onEmpty) {
        onEmpty();
      }
    }, [onFilled, onEmpty]);
    useEnhancedEffect(() => {
      if (isControlled) {
        checkDirty({
          value
        });
      }
    }, [value, checkDirty, isControlled]);
    const handleFocus = (event) => {
      if (fcs.disabled) {
        event.stopPropagation();
        return;
      }
      if (onFocus) {
        onFocus(event);
      }
      if (inputPropsProp.onFocus) {
        inputPropsProp.onFocus(event);
      }
      if (muiFormControl && muiFormControl.onFocus) {
        muiFormControl.onFocus(event);
      } else {
        setFocused(true);
      }
    };
    const handleBlur = (event) => {
      if (onBlur) {
        onBlur(event);
      }
      if (inputPropsProp.onBlur) {
        inputPropsProp.onBlur(event);
      }
      if (muiFormControl && muiFormControl.onBlur) {
        muiFormControl.onBlur(event);
      } else {
        setFocused(false);
      }
    };
    const handleChange = (event, ...args) => {
      if (!isControlled) {
        const element = event.target || inputRef.current;
        if (element == null) {
          throw new Error(formatMuiErrorMessage$1(1));
        }
        checkDirty({
          value: element.value
        });
      }
      if (inputPropsProp.onChange) {
        inputPropsProp.onChange(event, ...args);
      }
      if (onChange) {
        onChange(event, ...args);
      }
    };
    React$1__namespace.useEffect(() => {
      checkDirty(inputRef.current);
    }, []);
    const handleClick = (event) => {
      if (inputRef.current && event.currentTarget === event.target) {
        inputRef.current.focus();
      }
      if (onClick) {
        onClick(event);
      }
    };
    let InputComponent = inputComponent;
    let inputProps = inputPropsProp;
    if (multiline && InputComponent === "input") {
      if (rows) {
        inputProps = _extends$1({
          type: void 0,
          minRows: rows,
          maxRows: rows
        }, inputProps);
      } else {
        inputProps = _extends$1({
          type: void 0,
          maxRows,
          minRows
        }, inputProps);
      }
      InputComponent = TextareaAutosize;
    }
    const handleAutoFill = (event) => {
      checkDirty(event.animationName === "mui-auto-fill-cancel" ? inputRef.current : {
        value: "x"
      });
    };
    React$1__namespace.useEffect(() => {
      if (muiFormControl) {
        muiFormControl.setAdornedStart(Boolean(startAdornment));
      }
    }, [muiFormControl, startAdornment]);
    const ownerState = _extends$1({}, props, {
      color: fcs.color || "primary",
      disabled: fcs.disabled,
      endAdornment,
      error: fcs.error,
      focused: fcs.focused,
      formControl: muiFormControl,
      fullWidth,
      hiddenLabel: fcs.hiddenLabel,
      multiline,
      size: fcs.size,
      startAdornment,
      type
    });
    const classes = useUtilityClasses$o(ownerState);
    const Root = slots.root || components.Root || InputBaseRoot;
    const rootProps = slotProps.root || componentsProps.root || {};
    const Input3 = slots.input || components.Input || InputBaseComponent;
    inputProps = _extends$1({}, inputProps, (_slotProps$input = slotProps.input) != null ? _slotProps$input : componentsProps.input);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
      children: [!disableInjectingGlobalStyles && inputGlobalStyles, /* @__PURE__ */ jsxRuntimeExports.jsxs(Root, _extends$1({}, rootProps, !isHostComponent(Root) && {
        ownerState: _extends$1({}, ownerState, rootProps.ownerState)
      }, {
        ref,
        onClick: handleClick
      }, other, {
        className: clsx(classes.root, rootProps.className, className, readOnly && "MuiInputBase-readOnly"),
        children: [startAdornment, /* @__PURE__ */ jsxRuntimeExports.jsx(FormControlContext$1.Provider, {
          value: null,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input3, _extends$1({
            ownerState,
            "aria-invalid": fcs.error,
            "aria-describedby": ariaDescribedby,
            autoComplete,
            autoFocus,
            defaultValue,
            disabled: fcs.disabled,
            id,
            onAnimationStart: handleAutoFill,
            name,
            placeholder,
            readOnly,
            required: fcs.required,
            rows,
            value,
            onKeyDown,
            onKeyUp,
            type
          }, inputProps, !isHostComponent(Input3) && {
            as: InputComponent,
            ownerState: _extends$1({}, ownerState, inputProps.ownerState)
          }, {
            ref: handleInputRef,
            className: clsx(classes.input, inputProps.className, readOnly && "MuiInputBase-readOnly"),
            onBlur: handleBlur,
            onChange: handleChange,
            onFocus: handleFocus
          }))
        }), endAdornment, renderSuffix ? renderSuffix(_extends$1({}, fcs, {
          startAdornment
        })) : null]
      }))]
    });
  });
  const InputBase$1 = InputBase;
  function getInputUtilityClass(slot) {
    return generateUtilityClass$2("MuiInput", slot);
  }
  const inputClasses = _extends$1({}, inputBaseClasses$1, generateUtilityClasses$2("MuiInput", ["root", "underline", "input"]));
  const inputClasses$1 = inputClasses;
  function getOutlinedInputUtilityClass(slot) {
    return generateUtilityClass$2("MuiOutlinedInput", slot);
  }
  const outlinedInputClasses = _extends$1({}, inputBaseClasses$1, generateUtilityClasses$2("MuiOutlinedInput", ["root", "notchedOutline", "input"]));
  const outlinedInputClasses$1 = outlinedInputClasses;
  function getFilledInputUtilityClass(slot) {
    return generateUtilityClass$2("MuiFilledInput", slot);
  }
  const filledInputClasses = _extends$1({}, inputBaseClasses$1, generateUtilityClasses$2("MuiFilledInput", ["root", "underline", "input"]));
  const filledInputClasses$1 = filledInputClasses;
  const CloseIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  }), "Close");
  const ArrowDropDownIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M7 10l5 5 5-5z"
  }), "ArrowDropDown");
  function getAutocompleteUtilityClass(slot) {
    return generateUtilityClass$2("MuiAutocomplete", slot);
  }
  const autocompleteClasses = generateUtilityClasses$2("MuiAutocomplete", ["root", "expanded", "fullWidth", "focused", "focusVisible", "tag", "tagSizeSmall", "tagSizeMedium", "hasPopupIcon", "hasClearIcon", "inputRoot", "input", "inputFocused", "endAdornment", "clearIndicator", "popupIndicator", "popupIndicatorOpen", "popper", "popperDisablePortal", "paper", "listbox", "loading", "noOptions", "option", "groupLabel", "groupUl"]);
  const autocompleteClasses$1 = autocompleteClasses;
  var _ClearIcon, _ArrowDropDownIcon;
  const _excluded$r = ["autoComplete", "autoHighlight", "autoSelect", "blurOnSelect", "ChipProps", "className", "clearIcon", "clearOnBlur", "clearOnEscape", "clearText", "closeText", "componentsProps", "defaultValue", "disableClearable", "disableCloseOnSelect", "disabled", "disabledItemsFocusable", "disableListWrap", "disablePortal", "filterOptions", "filterSelectedOptions", "forcePopupIcon", "freeSolo", "fullWidth", "getLimitTagsText", "getOptionDisabled", "getOptionKey", "getOptionLabel", "isOptionEqualToValue", "groupBy", "handleHomeEndKeys", "id", "includeInputInList", "inputValue", "limitTags", "ListboxComponent", "ListboxProps", "loading", "loadingText", "multiple", "noOptionsText", "onChange", "onClose", "onHighlightChange", "onInputChange", "onOpen", "open", "openOnFocus", "openText", "options", "PaperComponent", "PopperComponent", "popupIcon", "readOnly", "renderGroup", "renderInput", "renderOption", "renderTags", "selectOnFocus", "size", "slotProps", "value"], _excluded2$5 = ["ref"];
  const useUtilityClasses$n = (ownerState) => {
    const {
      classes,
      disablePortal,
      expanded,
      focused,
      fullWidth,
      hasClearIcon,
      hasPopupIcon,
      inputFocused,
      popupOpen,
      size
    } = ownerState;
    const slots = {
      root: ["root", expanded && "expanded", focused && "focused", fullWidth && "fullWidth", hasClearIcon && "hasClearIcon", hasPopupIcon && "hasPopupIcon"],
      inputRoot: ["inputRoot"],
      input: ["input", inputFocused && "inputFocused"],
      tag: ["tag", `tagSize${capitalize$1(size)}`],
      endAdornment: ["endAdornment"],
      clearIndicator: ["clearIndicator"],
      popupIndicator: ["popupIndicator", popupOpen && "popupIndicatorOpen"],
      popper: ["popper", disablePortal && "popperDisablePortal"],
      paper: ["paper"],
      listbox: ["listbox"],
      loading: ["loading"],
      noOptions: ["noOptions"],
      option: ["option"],
      groupLabel: ["groupLabel"],
      groupUl: ["groupUl"]
    };
    return composeClasses$1(slots, getAutocompleteUtilityClass, classes);
  };
  const AutocompleteRoot = styled("div", {
    name: "MuiAutocomplete",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      const {
        fullWidth,
        hasClearIcon,
        hasPopupIcon,
        inputFocused,
        size
      } = ownerState;
      return [{
        [`& .${autocompleteClasses$1.tag}`]: styles2.tag
      }, {
        [`& .${autocompleteClasses$1.tag}`]: styles2[`tagSize${capitalize$1(size)}`]
      }, {
        [`& .${autocompleteClasses$1.inputRoot}`]: styles2.inputRoot
      }, {
        [`& .${autocompleteClasses$1.input}`]: styles2.input
      }, {
        [`& .${autocompleteClasses$1.input}`]: inputFocused && styles2.inputFocused
      }, styles2.root, fullWidth && styles2.fullWidth, hasPopupIcon && styles2.hasPopupIcon, hasClearIcon && styles2.hasClearIcon];
    }
  })(({
    ownerState
  }) => _extends$1({
    [`&.${autocompleteClasses$1.focused} .${autocompleteClasses$1.clearIndicator}`]: {
      visibility: "visible"
    },
    /* Avoid double tap issue on iOS */
    "@media (pointer: fine)": {
      [`&:hover .${autocompleteClasses$1.clearIndicator}`]: {
        visibility: "visible"
      }
    }
  }, ownerState.fullWidth && {
    width: "100%"
  }, {
    [`& .${autocompleteClasses$1.tag}`]: _extends$1({
      margin: 3,
      maxWidth: "calc(100% - 6px)"
    }, ownerState.size === "small" && {
      margin: 2,
      maxWidth: "calc(100% - 4px)"
    }),
    [`& .${autocompleteClasses$1.inputRoot}`]: {
      flexWrap: "wrap",
      [`.${autocompleteClasses$1.hasPopupIcon}&, .${autocompleteClasses$1.hasClearIcon}&`]: {
        paddingRight: 26 + 4
      },
      [`.${autocompleteClasses$1.hasPopupIcon}.${autocompleteClasses$1.hasClearIcon}&`]: {
        paddingRight: 52 + 4
      },
      [`& .${autocompleteClasses$1.input}`]: {
        width: 0,
        minWidth: 30
      }
    },
    [`& .${inputClasses$1.root}`]: {
      paddingBottom: 1,
      "& .MuiInput-input": {
        padding: "4px 4px 4px 0px"
      }
    },
    [`& .${inputClasses$1.root}.${inputBaseClasses$1.sizeSmall}`]: {
      [`& .${inputClasses$1.input}`]: {
        padding: "2px 4px 3px 0"
      }
    },
    [`& .${outlinedInputClasses$1.root}`]: {
      padding: 9,
      [`.${autocompleteClasses$1.hasPopupIcon}&, .${autocompleteClasses$1.hasClearIcon}&`]: {
        paddingRight: 26 + 4 + 9
      },
      [`.${autocompleteClasses$1.hasPopupIcon}.${autocompleteClasses$1.hasClearIcon}&`]: {
        paddingRight: 52 + 4 + 9
      },
      [`& .${autocompleteClasses$1.input}`]: {
        padding: "7.5px 4px 7.5px 5px"
      },
      [`& .${autocompleteClasses$1.endAdornment}`]: {
        right: 9
      }
    },
    [`& .${outlinedInputClasses$1.root}.${inputBaseClasses$1.sizeSmall}`]: {
      // Don't specify paddingRight, as it overrides the default value set when there is only
      // one of the popup or clear icon as the specificity is equal so the latter one wins
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 6,
      [`& .${autocompleteClasses$1.input}`]: {
        padding: "2.5px 4px 2.5px 8px"
      }
    },
    [`& .${filledInputClasses$1.root}`]: {
      paddingTop: 19,
      paddingLeft: 8,
      [`.${autocompleteClasses$1.hasPopupIcon}&, .${autocompleteClasses$1.hasClearIcon}&`]: {
        paddingRight: 26 + 4 + 9
      },
      [`.${autocompleteClasses$1.hasPopupIcon}.${autocompleteClasses$1.hasClearIcon}&`]: {
        paddingRight: 52 + 4 + 9
      },
      [`& .${filledInputClasses$1.input}`]: {
        padding: "7px 4px"
      },
      [`& .${autocompleteClasses$1.endAdornment}`]: {
        right: 9
      }
    },
    [`& .${filledInputClasses$1.root}.${inputBaseClasses$1.sizeSmall}`]: {
      paddingBottom: 1,
      [`& .${filledInputClasses$1.input}`]: {
        padding: "2.5px 4px"
      }
    },
    [`& .${inputBaseClasses$1.hiddenLabel}`]: {
      paddingTop: 8
    },
    [`& .${filledInputClasses$1.root}.${inputBaseClasses$1.hiddenLabel}`]: {
      paddingTop: 0,
      paddingBottom: 0,
      [`& .${autocompleteClasses$1.input}`]: {
        paddingTop: 16,
        paddingBottom: 17
      }
    },
    [`& .${filledInputClasses$1.root}.${inputBaseClasses$1.hiddenLabel}.${inputBaseClasses$1.sizeSmall}`]: {
      [`& .${autocompleteClasses$1.input}`]: {
        paddingTop: 8,
        paddingBottom: 9
      }
    },
    [`& .${autocompleteClasses$1.input}`]: _extends$1({
      flexGrow: 1,
      textOverflow: "ellipsis",
      opacity: 0
    }, ownerState.inputFocused && {
      opacity: 1
    })
  }));
  const AutocompleteEndAdornment = styled("div", {
    name: "MuiAutocomplete",
    slot: "EndAdornment",
    overridesResolver: (props, styles2) => styles2.endAdornment
  })({
    // We use a position absolute to support wrapping tags.
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translate(0, -50%)"
  });
  const AutocompleteClearIndicator = styled(IconButton$1, {
    name: "MuiAutocomplete",
    slot: "ClearIndicator",
    overridesResolver: (props, styles2) => styles2.clearIndicator
  })({
    marginRight: -2,
    padding: 4,
    visibility: "hidden"
  });
  const AutocompletePopupIndicator = styled(IconButton$1, {
    name: "MuiAutocomplete",
    slot: "PopupIndicator",
    overridesResolver: ({
      ownerState
    }, styles2) => _extends$1({}, styles2.popupIndicator, ownerState.popupOpen && styles2.popupIndicatorOpen)
  })(({
    ownerState
  }) => _extends$1({
    padding: 2,
    marginRight: -2
  }, ownerState.popupOpen && {
    transform: "rotate(180deg)"
  }));
  const AutocompletePopper = styled(Popper$1, {
    name: "MuiAutocomplete",
    slot: "Popper",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [{
        [`& .${autocompleteClasses$1.option}`]: styles2.option
      }, styles2.popper, ownerState.disablePortal && styles2.popperDisablePortal];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    zIndex: (theme.vars || theme).zIndex.modal
  }, ownerState.disablePortal && {
    position: "absolute"
  }));
  const AutocompletePaper = styled(Paper$1, {
    name: "MuiAutocomplete",
    slot: "Paper",
    overridesResolver: (props, styles2) => styles2.paper
  })(({
    theme
  }) => _extends$1({}, theme.typography.body1, {
    overflow: "auto"
  }));
  const AutocompleteLoading = styled("div", {
    name: "MuiAutocomplete",
    slot: "Loading",
    overridesResolver: (props, styles2) => styles2.loading
  })(({
    theme
  }) => ({
    color: (theme.vars || theme).palette.text.secondary,
    padding: "14px 16px"
  }));
  const AutocompleteNoOptions = styled("div", {
    name: "MuiAutocomplete",
    slot: "NoOptions",
    overridesResolver: (props, styles2) => styles2.noOptions
  })(({
    theme
  }) => ({
    color: (theme.vars || theme).palette.text.secondary,
    padding: "14px 16px"
  }));
  const AutocompleteListbox = styled("div", {
    name: "MuiAutocomplete",
    slot: "Listbox",
    overridesResolver: (props, styles2) => styles2.listbox
  })(({
    theme
  }) => ({
    listStyle: "none",
    margin: 0,
    padding: "8px 0",
    maxHeight: "40vh",
    overflow: "auto",
    position: "relative",
    [`& .${autocompleteClasses$1.option}`]: {
      minHeight: 48,
      display: "flex",
      overflow: "hidden",
      justifyContent: "flex-start",
      alignItems: "center",
      cursor: "pointer",
      paddingTop: 6,
      boxSizing: "border-box",
      outline: "0",
      WebkitTapHighlightColor: "transparent",
      paddingBottom: 6,
      paddingLeft: 16,
      paddingRight: 16,
      [theme.breakpoints.up("sm")]: {
        minHeight: "auto"
      },
      [`&.${autocompleteClasses$1.focused}`]: {
        backgroundColor: (theme.vars || theme).palette.action.hover,
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      },
      '&[aria-disabled="true"]': {
        opacity: (theme.vars || theme).palette.action.disabledOpacity,
        pointerEvents: "none"
      },
      [`&.${autocompleteClasses$1.focusVisible}`]: {
        backgroundColor: (theme.vars || theme).palette.action.focus
      },
      '&[aria-selected="true"]': {
        backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})` : alpha_1(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        [`&.${autocompleteClasses$1.focused}`]: {
          backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))` : alpha_1(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: (theme.vars || theme).palette.action.selected
          }
        },
        [`&.${autocompleteClasses$1.focusVisible}`]: {
          backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.focusOpacity}))` : alpha_1(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
        }
      }
    }
  }));
  const AutocompleteGroupLabel = styled(ListSubheader$1, {
    name: "MuiAutocomplete",
    slot: "GroupLabel",
    overridesResolver: (props, styles2) => styles2.groupLabel
  })(({
    theme
  }) => ({
    backgroundColor: (theme.vars || theme).palette.background.paper,
    top: -8
  }));
  const AutocompleteGroupUl = styled("ul", {
    name: "MuiAutocomplete",
    slot: "GroupUl",
    overridesResolver: (props, styles2) => styles2.groupUl
  })({
    padding: 0,
    [`& .${autocompleteClasses$1.option}`]: {
      paddingLeft: 24
    }
  });
  const Autocomplete = /* @__PURE__ */ React$1__namespace.forwardRef(function Autocomplete2(inProps, ref) {
    var _slotProps$clearIndic, _slotProps$paper, _slotProps$popper, _slotProps$popupIndic;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiAutocomplete"
    });
    const {
      autoComplete = false,
      autoHighlight = false,
      autoSelect = false,
      blurOnSelect = false,
      ChipProps,
      className,
      clearIcon = _ClearIcon || (_ClearIcon = /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {
        fontSize: "small"
      })),
      clearOnBlur = !props.freeSolo,
      clearOnEscape = false,
      clearText = "Clear",
      closeText = "Close",
      componentsProps = {},
      defaultValue = props.multiple ? [] : null,
      disableClearable = false,
      disableCloseOnSelect = false,
      disabled = false,
      disabledItemsFocusable = false,
      disableListWrap = false,
      disablePortal = false,
      filterSelectedOptions = false,
      forcePopupIcon = "auto",
      freeSolo = false,
      fullWidth = false,
      getLimitTagsText = (more) => `+${more}`,
      getOptionLabel: getOptionLabelProp,
      groupBy,
      handleHomeEndKeys = !props.freeSolo,
      includeInputInList = false,
      limitTags = -1,
      ListboxComponent = "ul",
      ListboxProps,
      loading = false,
      loadingText = "Loading…",
      multiple = false,
      noOptionsText = "No options",
      openOnFocus = false,
      openText = "Open",
      PaperComponent = Paper$1,
      PopperComponent = Popper$1,
      popupIcon = _ArrowDropDownIcon || (_ArrowDropDownIcon = /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDropDownIcon, {})),
      readOnly = false,
      renderGroup: renderGroupProp,
      renderInput,
      renderOption: renderOptionProp,
      renderTags,
      selectOnFocus = !props.freeSolo,
      size = "medium",
      slotProps = {}
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$r);
    const {
      getRootProps,
      getInputProps,
      getInputLabelProps,
      getPopupIndicatorProps,
      getClearProps,
      getTagProps,
      getListboxProps,
      getOptionProps,
      value,
      dirty,
      expanded,
      id,
      popupOpen,
      focused,
      focusedTag,
      anchorEl,
      setAnchorEl,
      inputValue,
      groupedOptions
    } = useAutocomplete(_extends$1({}, props, {
      componentName: "Autocomplete"
    }));
    const hasClearIcon = !disableClearable && !disabled && dirty && !readOnly;
    const hasPopupIcon = (!freeSolo || forcePopupIcon === true) && forcePopupIcon !== false;
    const {
      onMouseDown: handleInputMouseDown
    } = getInputProps();
    const {
      ref: externalListboxRef
    } = ListboxProps != null ? ListboxProps : {};
    const _getListboxProps = getListboxProps(), {
      ref: listboxRef
    } = _getListboxProps, otherListboxProps = _objectWithoutPropertiesLoose(_getListboxProps, _excluded2$5);
    const combinedListboxRef = useForkRef(listboxRef, externalListboxRef);
    const defaultGetOptionLabel = (option) => {
      var _option$label;
      return (_option$label = option.label) != null ? _option$label : option;
    };
    const getOptionLabel = getOptionLabelProp || defaultGetOptionLabel;
    const ownerState = _extends$1({}, props, {
      disablePortal,
      expanded,
      focused,
      fullWidth,
      getOptionLabel,
      hasClearIcon,
      hasPopupIcon,
      inputFocused: focusedTag === -1,
      popupOpen,
      size
    });
    const classes = useUtilityClasses$n(ownerState);
    let startAdornment;
    if (multiple && value.length > 0) {
      const getCustomizedTagProps = (params) => _extends$1({
        className: classes.tag,
        disabled
      }, getTagProps(params));
      if (renderTags) {
        startAdornment = renderTags(value, getCustomizedTagProps, ownerState);
      } else {
        startAdornment = value.map((option, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip$1, _extends$1({
          label: getOptionLabel(option),
          size
        }, getCustomizedTagProps({
          index
        }), ChipProps)));
      }
    }
    if (limitTags > -1 && Array.isArray(startAdornment)) {
      const more = startAdornment.length - limitTags;
      if (!focused && more > 0) {
        startAdornment = startAdornment.splice(0, limitTags);
        startAdornment.push(/* @__PURE__ */ jsxRuntimeExports.jsx("span", {
          className: classes.tag,
          children: getLimitTagsText(more)
        }, startAdornment.length));
      }
    }
    const defaultRenderGroup = (params) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(AutocompleteGroupLabel, {
        className: classes.groupLabel,
        ownerState,
        component: "div",
        children: params.group
      }), /* @__PURE__ */ jsxRuntimeExports.jsx(AutocompleteGroupUl, {
        className: classes.groupUl,
        ownerState,
        children: params.children
      })]
    }, params.key);
    const renderGroup = renderGroupProp || defaultRenderGroup;
    const defaultRenderOption = (props2, option) => {
      return /* @__PURE__ */ React$1.createElement("li", _extends$1({}, props2, {
        key: props2.key
      }), getOptionLabel(option));
    };
    const renderOption = renderOptionProp || defaultRenderOption;
    const renderListOption = (option, index) => {
      const optionProps = getOptionProps({
        option,
        index
      });
      return renderOption(_extends$1({}, optionProps, {
        className: classes.option
      }), option, {
        selected: optionProps["aria-selected"],
        index,
        inputValue
      }, ownerState);
    };
    const clearIndicatorSlotProps = (_slotProps$clearIndic = slotProps.clearIndicator) != null ? _slotProps$clearIndic : componentsProps.clearIndicator;
    const paperSlotProps = (_slotProps$paper = slotProps.paper) != null ? _slotProps$paper : componentsProps.paper;
    const popperSlotProps = (_slotProps$popper = slotProps.popper) != null ? _slotProps$popper : componentsProps.popper;
    const popupIndicatorSlotProps = (_slotProps$popupIndic = slotProps.popupIndicator) != null ? _slotProps$popupIndic : componentsProps.popupIndicator;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(AutocompleteRoot, _extends$1({
        ref,
        className: clsx(classes.root, className),
        ownerState
      }, getRootProps(other), {
        children: renderInput({
          id,
          disabled,
          fullWidth: true,
          size: size === "small" ? "small" : void 0,
          InputLabelProps: getInputLabelProps(),
          InputProps: _extends$1({
            ref: setAnchorEl,
            className: classes.inputRoot,
            startAdornment,
            onClick: (event) => {
              if (event.target === event.currentTarget) {
                handleInputMouseDown(event);
              }
            }
          }, (hasClearIcon || hasPopupIcon) && {
            endAdornment: /* @__PURE__ */ jsxRuntimeExports.jsxs(AutocompleteEndAdornment, {
              className: classes.endAdornment,
              ownerState,
              children: [hasClearIcon ? /* @__PURE__ */ jsxRuntimeExports.jsx(AutocompleteClearIndicator, _extends$1({}, getClearProps(), {
                "aria-label": clearText,
                title: clearText,
                ownerState
              }, clearIndicatorSlotProps, {
                className: clsx(classes.clearIndicator, clearIndicatorSlotProps == null ? void 0 : clearIndicatorSlotProps.className),
                children: clearIcon
              })) : null, hasPopupIcon ? /* @__PURE__ */ jsxRuntimeExports.jsx(AutocompletePopupIndicator, _extends$1({}, getPopupIndicatorProps(), {
                disabled,
                "aria-label": popupOpen ? closeText : openText,
                title: popupOpen ? closeText : openText,
                ownerState
              }, popupIndicatorSlotProps, {
                className: clsx(classes.popupIndicator, popupIndicatorSlotProps == null ? void 0 : popupIndicatorSlotProps.className),
                children: popupIcon
              })) : null]
            })
          }),
          inputProps: _extends$1({
            className: classes.input,
            disabled,
            readOnly
          }, getInputProps())
        })
      })), anchorEl ? /* @__PURE__ */ jsxRuntimeExports.jsx(AutocompletePopper, _extends$1({
        as: PopperComponent,
        disablePortal,
        style: {
          width: anchorEl ? anchorEl.clientWidth : null
        },
        ownerState,
        role: "presentation",
        anchorEl,
        open: popupOpen
      }, popperSlotProps, {
        className: clsx(classes.popper, popperSlotProps == null ? void 0 : popperSlotProps.className),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AutocompletePaper, _extends$1({
          ownerState,
          as: PaperComponent
        }, paperSlotProps, {
          className: clsx(classes.paper, paperSlotProps == null ? void 0 : paperSlotProps.className),
          children: [loading && groupedOptions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(AutocompleteLoading, {
            className: classes.loading,
            ownerState,
            children: loadingText
          }) : null, groupedOptions.length === 0 && !freeSolo && !loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(AutocompleteNoOptions, {
            className: classes.noOptions,
            ownerState,
            role: "presentation",
            onMouseDown: (event) => {
              event.preventDefault();
            },
            children: noOptionsText
          }) : null, groupedOptions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(AutocompleteListbox, _extends$1({
            as: ListboxComponent,
            className: classes.listbox,
            ownerState
          }, otherListboxProps, ListboxProps, {
            ref: combinedListboxRef,
            children: groupedOptions.map((option, index) => {
              if (groupBy) {
                return renderGroup({
                  key: option.key,
                  group: option.group,
                  children: option.options.map((option2, index2) => renderListOption(option2, option.index + index2))
                });
              }
              return renderListOption(option, index);
            })
          })) : null]
        }))
      })) : null]
    });
  });
  const Autocomplete$1 = Autocomplete;
  function createUseThemeProps(name) {
    return useThemeProps$1;
  }
  const Person = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
  }), "Person");
  function getAvatarUtilityClass(slot) {
    return generateUtilityClass$2("MuiAvatar", slot);
  }
  generateUtilityClasses$2("MuiAvatar", ["root", "colorDefault", "circular", "rounded", "square", "img", "fallback"]);
  const _excluded$q = ["className", "elementType", "ownerState", "externalForwardedProps", "getSlotOwnerState", "internalForwardedProps"], _excluded2$4 = ["component", "slots", "slotProps"], _excluded3$1 = ["component"];
  function useSlot(name, parameters) {
    const {
      className,
      elementType: initialElementType,
      ownerState,
      externalForwardedProps,
      getSlotOwnerState,
      internalForwardedProps
    } = parameters, useSlotPropsParams = _objectWithoutPropertiesLoose(parameters, _excluded$q);
    const {
      component: rootComponent,
      slots = {
        [name]: void 0
      },
      slotProps = {
        [name]: void 0
      }
    } = externalForwardedProps, other = _objectWithoutPropertiesLoose(externalForwardedProps, _excluded2$4);
    const elementType = slots[name] || initialElementType;
    const resolvedComponentsProps = resolveComponentProps(slotProps[name], ownerState);
    const _mergeSlotProps = mergeSlotProps(_extends$1({
      className
    }, useSlotPropsParams, {
      externalForwardedProps: name === "root" ? other : void 0,
      externalSlotProps: resolvedComponentsProps
    })), {
      props: {
        component: slotComponent
      },
      internalRef
    } = _mergeSlotProps, mergedProps = _objectWithoutPropertiesLoose(_mergeSlotProps.props, _excluded3$1);
    const ref = useForkRef(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, parameters.ref);
    const slotOwnerState = getSlotOwnerState ? getSlotOwnerState(mergedProps) : {};
    const finalOwnerState = _extends$1({}, ownerState, slotOwnerState);
    const LeafComponent = name === "root" ? slotComponent || rootComponent : slotComponent;
    const props = appendOwnerState(elementType, _extends$1({}, name === "root" && !rootComponent && !slots[name] && internalForwardedProps, name !== "root" && !slots[name] && internalForwardedProps, mergedProps, LeafComponent && {
      as: LeafComponent
    }, {
      ref
    }), finalOwnerState);
    Object.keys(slotOwnerState).forEach((propName) => {
      delete props[propName];
    });
    return [elementType, props];
  }
  const _excluded$p = ["alt", "children", "className", "component", "slots", "slotProps", "imgProps", "sizes", "src", "srcSet", "variant"];
  const useThemeProps = createUseThemeProps();
  const useUtilityClasses$m = (ownerState) => {
    const {
      classes,
      variant,
      colorDefault
    } = ownerState;
    const slots = {
      root: ["root", variant, colorDefault && "colorDefault"],
      img: ["img"],
      fallback: ["fallback"]
    };
    return composeClasses$1(slots, getAvatarUtilityClass, classes);
  };
  const AvatarRoot = styled("div", {
    name: "MuiAvatar",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], ownerState.colorDefault && styles2.colorDefault];
    }
  })(({
    theme
  }) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 40,
    height: 40,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(20),
    lineHeight: 1,
    borderRadius: "50%",
    overflow: "hidden",
    userSelect: "none",
    variants: [{
      props: {
        variant: "rounded"
      },
      style: {
        borderRadius: (theme.vars || theme).shape.borderRadius
      }
    }, {
      props: {
        variant: "square"
      },
      style: {
        borderRadius: 0
      }
    }, {
      props: {
        colorDefault: true
      },
      style: _extends$1({
        color: (theme.vars || theme).palette.background.default
      }, theme.vars ? {
        backgroundColor: theme.vars.palette.Avatar.defaultBg
      } : _extends$1({
        backgroundColor: theme.palette.grey[400]
      }, theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[600]
      })))
    }]
  }));
  const AvatarImg = styled("img", {
    name: "MuiAvatar",
    slot: "Img",
    overridesResolver: (props, styles2) => styles2.img
  })({
    width: "100%",
    height: "100%",
    textAlign: "center",
    // Handle non-square image. The property isn't supported by IE11.
    objectFit: "cover",
    // Hide alt text.
    color: "transparent",
    // Hide the image broken icon, only works on Chrome.
    textIndent: 1e4
  });
  const AvatarFallback = styled(Person, {
    name: "MuiAvatar",
    slot: "Fallback",
    overridesResolver: (props, styles2) => styles2.fallback
  })({
    width: "75%",
    height: "75%"
  });
  function useLoaded({
    crossOrigin,
    referrerPolicy,
    src,
    srcSet
  }) {
    const [loaded, setLoaded] = React$1__namespace.useState(false);
    React$1__namespace.useEffect(() => {
      if (!src && !srcSet) {
        return void 0;
      }
      setLoaded(false);
      let active = true;
      const image = new Image();
      image.onload = () => {
        if (!active) {
          return;
        }
        setLoaded("loaded");
      };
      image.onerror = () => {
        if (!active) {
          return;
        }
        setLoaded("error");
      };
      image.crossOrigin = crossOrigin;
      image.referrerPolicy = referrerPolicy;
      image.src = src;
      if (srcSet) {
        image.srcset = srcSet;
      }
      return () => {
        active = false;
      };
    }, [crossOrigin, referrerPolicy, src, srcSet]);
    return loaded;
  }
  const Avatar = /* @__PURE__ */ React$1__namespace.forwardRef(function Avatar2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiAvatar"
    });
    const {
      alt,
      children: childrenProp,
      className,
      component = "div",
      slots = {},
      slotProps = {},
      imgProps,
      sizes,
      src,
      srcSet,
      variant = "circular"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$p);
    let children = null;
    const loaded = useLoaded(_extends$1({}, imgProps, {
      src,
      srcSet
    }));
    const hasImg = src || srcSet;
    const hasImgNotFailing = hasImg && loaded !== "error";
    const ownerState = _extends$1({}, props, {
      colorDefault: !hasImgNotFailing,
      component,
      variant
    });
    const classes = useUtilityClasses$m(ownerState);
    const [ImgSlot, imgSlotProps] = useSlot("img", {
      className: classes.img,
      elementType: AvatarImg,
      externalForwardedProps: {
        slots,
        slotProps: {
          img: _extends$1({}, imgProps, slotProps.img)
        }
      },
      additionalProps: {
        alt,
        src,
        srcSet,
        sizes
      },
      ownerState
    });
    if (hasImgNotFailing) {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx(ImgSlot, _extends$1({}, imgSlotProps));
    } else if (!!childrenProp || childrenProp === 0) {
      children = childrenProp;
    } else if (hasImg && alt) {
      children = alt[0];
    } else {
      children = /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, {
        ownerState,
        className: classes.fallback
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarRoot, _extends$1({
      as: component,
      ownerState,
      className: clsx(classes.root, className),
      ref
    }, other, {
      children
    }));
  });
  const Avatar$1 = Avatar;
  const GridContext = /* @__PURE__ */ React$1__namespace.createContext();
  const GridContext$1 = GridContext;
  function getGridUtilityClass(slot) {
    return generateUtilityClass$2("MuiGrid", slot);
  }
  const SPACINGS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const DIRECTIONS = ["column-reverse", "column", "row-reverse", "row"];
  const WRAPS = ["nowrap", "wrap-reverse", "wrap"];
  const GRID_SIZES = ["auto", true, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const gridClasses = generateUtilityClasses$2("MuiGrid", [
    "root",
    "container",
    "item",
    "zeroMinWidth",
    // spacings
    ...SPACINGS.map((spacing) => `spacing-xs-${spacing}`),
    // direction values
    ...DIRECTIONS.map((direction) => `direction-xs-${direction}`),
    // wrap values
    ...WRAPS.map((wrap) => `wrap-xs-${wrap}`),
    // grid sizes for all breakpoints
    ...GRID_SIZES.map((size) => `grid-xs-${size}`),
    ...GRID_SIZES.map((size) => `grid-sm-${size}`),
    ...GRID_SIZES.map((size) => `grid-md-${size}`),
    ...GRID_SIZES.map((size) => `grid-lg-${size}`),
    ...GRID_SIZES.map((size) => `grid-xl-${size}`)
  ]);
  const _excluded$o = ["className", "columns", "columnSpacing", "component", "container", "direction", "item", "rowSpacing", "spacing", "wrap", "zeroMinWidth"];
  function getOffset(val) {
    const parse2 = parseFloat(val);
    return `${parse2}${String(val).replace(String(parse2), "") || "px"}`;
  }
  function generateGrid({
    theme,
    ownerState
  }) {
    let size;
    return theme.breakpoints.keys.reduce((globalStyles, breakpoint) => {
      let styles2 = {};
      if (ownerState[breakpoint]) {
        size = ownerState[breakpoint];
      }
      if (!size) {
        return globalStyles;
      }
      if (size === true) {
        styles2 = {
          flexBasis: 0,
          flexGrow: 1,
          maxWidth: "100%"
        };
      } else if (size === "auto") {
        styles2 = {
          flexBasis: "auto",
          flexGrow: 0,
          flexShrink: 0,
          maxWidth: "none",
          width: "auto"
        };
      } else {
        const columnsBreakpointValues = resolveBreakpointValues({
          values: ownerState.columns,
          breakpoints: theme.breakpoints.values
        });
        const columnValue = typeof columnsBreakpointValues === "object" ? columnsBreakpointValues[breakpoint] : columnsBreakpointValues;
        if (columnValue === void 0 || columnValue === null) {
          return globalStyles;
        }
        const width2 = `${Math.round(size / columnValue * 1e8) / 1e6}%`;
        let more = {};
        if (ownerState.container && ownerState.item && ownerState.columnSpacing !== 0) {
          const themeSpacing = theme.spacing(ownerState.columnSpacing);
          if (themeSpacing !== "0px") {
            const fullWidth = `calc(${width2} + ${getOffset(themeSpacing)})`;
            more = {
              flexBasis: fullWidth,
              maxWidth: fullWidth
            };
          }
        }
        styles2 = _extends$1({
          flexBasis: width2,
          flexGrow: 0,
          maxWidth: width2
        }, more);
      }
      if (theme.breakpoints.values[breakpoint] === 0) {
        Object.assign(globalStyles, styles2);
      } else {
        globalStyles[theme.breakpoints.up(breakpoint)] = styles2;
      }
      return globalStyles;
    }, {});
  }
  function generateDirection({
    theme,
    ownerState
  }) {
    const directionValues = resolveBreakpointValues({
      values: ownerState.direction,
      breakpoints: theme.breakpoints.values
    });
    return handleBreakpoints({
      theme
    }, directionValues, (propValue) => {
      const output = {
        flexDirection: propValue
      };
      if (propValue.indexOf("column") === 0) {
        output[`& > .${gridClasses.item}`] = {
          maxWidth: "none"
        };
      }
      return output;
    });
  }
  function extractZeroValueBreakpointKeys({
    breakpoints: breakpoints2,
    values: values2
  }) {
    let nonZeroKey = "";
    Object.keys(values2).forEach((key) => {
      if (nonZeroKey !== "") {
        return;
      }
      if (values2[key] !== 0) {
        nonZeroKey = key;
      }
    });
    const sortedBreakpointKeysByValue = Object.keys(breakpoints2).sort((a, b2) => {
      return breakpoints2[a] - breakpoints2[b2];
    });
    return sortedBreakpointKeysByValue.slice(0, sortedBreakpointKeysByValue.indexOf(nonZeroKey));
  }
  function generateRowGap({
    theme,
    ownerState
  }) {
    const {
      container,
      rowSpacing
    } = ownerState;
    let styles2 = {};
    if (container && rowSpacing !== 0) {
      const rowSpacingValues = resolveBreakpointValues({
        values: rowSpacing,
        breakpoints: theme.breakpoints.values
      });
      let zeroValueBreakpointKeys;
      if (typeof rowSpacingValues === "object") {
        zeroValueBreakpointKeys = extractZeroValueBreakpointKeys({
          breakpoints: theme.breakpoints.values,
          values: rowSpacingValues
        });
      }
      styles2 = handleBreakpoints({
        theme
      }, rowSpacingValues, (propValue, breakpoint) => {
        var _zeroValueBreakpointK;
        const themeSpacing = theme.spacing(propValue);
        if (themeSpacing !== "0px") {
          return {
            marginTop: `-${getOffset(themeSpacing)}`,
            [`& > .${gridClasses.item}`]: {
              paddingTop: getOffset(themeSpacing)
            }
          };
        }
        if ((_zeroValueBreakpointK = zeroValueBreakpointKeys) != null && _zeroValueBreakpointK.includes(breakpoint)) {
          return {};
        }
        return {
          marginTop: 0,
          [`& > .${gridClasses.item}`]: {
            paddingTop: 0
          }
        };
      });
    }
    return styles2;
  }
  function generateColumnGap({
    theme,
    ownerState
  }) {
    const {
      container,
      columnSpacing
    } = ownerState;
    let styles2 = {};
    if (container && columnSpacing !== 0) {
      const columnSpacingValues = resolveBreakpointValues({
        values: columnSpacing,
        breakpoints: theme.breakpoints.values
      });
      let zeroValueBreakpointKeys;
      if (typeof columnSpacingValues === "object") {
        zeroValueBreakpointKeys = extractZeroValueBreakpointKeys({
          breakpoints: theme.breakpoints.values,
          values: columnSpacingValues
        });
      }
      styles2 = handleBreakpoints({
        theme
      }, columnSpacingValues, (propValue, breakpoint) => {
        var _zeroValueBreakpointK2;
        const themeSpacing = theme.spacing(propValue);
        if (themeSpacing !== "0px") {
          return {
            width: `calc(100% + ${getOffset(themeSpacing)})`,
            marginLeft: `-${getOffset(themeSpacing)}`,
            [`& > .${gridClasses.item}`]: {
              paddingLeft: getOffset(themeSpacing)
            }
          };
        }
        if ((_zeroValueBreakpointK2 = zeroValueBreakpointKeys) != null && _zeroValueBreakpointK2.includes(breakpoint)) {
          return {};
        }
        return {
          width: "100%",
          marginLeft: 0,
          [`& > .${gridClasses.item}`]: {
            paddingLeft: 0
          }
        };
      });
    }
    return styles2;
  }
  function resolveSpacingStyles(spacing, breakpoints2, styles2 = {}) {
    if (!spacing || spacing <= 0) {
      return [];
    }
    if (typeof spacing === "string" && !Number.isNaN(Number(spacing)) || typeof spacing === "number") {
      return [styles2[`spacing-xs-${String(spacing)}`]];
    }
    const spacingStyles = [];
    breakpoints2.forEach((breakpoint) => {
      const value = spacing[breakpoint];
      if (Number(value) > 0) {
        spacingStyles.push(styles2[`spacing-${breakpoint}-${String(value)}`]);
      }
    });
    return spacingStyles;
  }
  const GridRoot = styled("div", {
    name: "MuiGrid",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      const {
        container,
        direction,
        item,
        spacing,
        wrap,
        zeroMinWidth,
        breakpoints: breakpoints2
      } = ownerState;
      let spacingStyles = [];
      if (container) {
        spacingStyles = resolveSpacingStyles(spacing, breakpoints2, styles2);
      }
      const breakpointsStyles = [];
      breakpoints2.forEach((breakpoint) => {
        const value = ownerState[breakpoint];
        if (value) {
          breakpointsStyles.push(styles2[`grid-${breakpoint}-${String(value)}`]);
        }
      });
      return [styles2.root, container && styles2.container, item && styles2.item, zeroMinWidth && styles2.zeroMinWidth, ...spacingStyles, direction !== "row" && styles2[`direction-xs-${String(direction)}`], wrap !== "wrap" && styles2[`wrap-xs-${String(wrap)}`], ...breakpointsStyles];
    }
  })(({
    ownerState
  }) => _extends$1({
    boxSizing: "border-box"
  }, ownerState.container && {
    display: "flex",
    flexWrap: "wrap",
    width: "100%"
  }, ownerState.item && {
    margin: 0
    // For instance, it's useful when used with a `figure` element.
  }, ownerState.zeroMinWidth && {
    minWidth: 0
  }, ownerState.wrap !== "wrap" && {
    flexWrap: ownerState.wrap
  }), generateDirection, generateRowGap, generateColumnGap, generateGrid);
  function resolveSpacingClasses(spacing, breakpoints2) {
    if (!spacing || spacing <= 0) {
      return [];
    }
    if (typeof spacing === "string" && !Number.isNaN(Number(spacing)) || typeof spacing === "number") {
      return [`spacing-xs-${String(spacing)}`];
    }
    const classes = [];
    breakpoints2.forEach((breakpoint) => {
      const value = spacing[breakpoint];
      if (Number(value) > 0) {
        const className = `spacing-${breakpoint}-${String(value)}`;
        classes.push(className);
      }
    });
    return classes;
  }
  const useUtilityClasses$l = (ownerState) => {
    const {
      classes,
      container,
      direction,
      item,
      spacing,
      wrap,
      zeroMinWidth,
      breakpoints: breakpoints2
    } = ownerState;
    let spacingClasses = [];
    if (container) {
      spacingClasses = resolveSpacingClasses(spacing, breakpoints2);
    }
    const breakpointsClasses = [];
    breakpoints2.forEach((breakpoint) => {
      const value = ownerState[breakpoint];
      if (value) {
        breakpointsClasses.push(`grid-${breakpoint}-${String(value)}`);
      }
    });
    const slots = {
      root: ["root", container && "container", item && "item", zeroMinWidth && "zeroMinWidth", ...spacingClasses, direction !== "row" && `direction-xs-${String(direction)}`, wrap !== "wrap" && `wrap-xs-${String(wrap)}`, ...breakpointsClasses]
    };
    return composeClasses$1(slots, getGridUtilityClass, classes);
  };
  const Grid = /* @__PURE__ */ React$1__namespace.forwardRef(function Grid2(inProps, ref) {
    const themeProps = useThemeProps$1({
      props: inProps,
      name: "MuiGrid"
    });
    const {
      breakpoints: breakpoints2
    } = useTheme$1();
    const props = extendSxProp(themeProps);
    const {
      className,
      columns: columnsProp,
      columnSpacing: columnSpacingProp,
      component = "div",
      container = false,
      direction = "row",
      item = false,
      rowSpacing: rowSpacingProp,
      spacing = 0,
      wrap = "wrap",
      zeroMinWidth = false
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$o);
    const rowSpacing = rowSpacingProp || spacing;
    const columnSpacing = columnSpacingProp || spacing;
    const columnsContext = React$1__namespace.useContext(GridContext$1);
    const columns = container ? columnsProp || 12 : columnsContext;
    const breakpointsValues = {};
    const otherFiltered = _extends$1({}, other);
    breakpoints2.keys.forEach((breakpoint) => {
      if (other[breakpoint] != null) {
        breakpointsValues[breakpoint] = other[breakpoint];
        delete otherFiltered[breakpoint];
      }
    });
    const ownerState = _extends$1({}, props, {
      columns,
      container,
      direction,
      item,
      rowSpacing,
      columnSpacing,
      wrap,
      zeroMinWidth,
      spacing
    }, breakpointsValues, {
      breakpoints: breakpoints2.keys
    });
    const classes = useUtilityClasses$l(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GridContext$1.Provider, {
      value: columns,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(GridRoot, _extends$1({
        ownerState,
        className: clsx(classes.root, className),
        as: component,
        ref
      }, otherFiltered))
    });
  });
  const Grid$1 = Grid;
  const _excluded$n = ["disableUnderline", "components", "componentsProps", "fullWidth", "inputComponent", "multiline", "slotProps", "slots", "type"];
  const useUtilityClasses$k = (ownerState) => {
    const {
      classes,
      disableUnderline
    } = ownerState;
    const slots = {
      root: ["root", !disableUnderline && "underline"],
      input: ["input"]
    };
    const composedClasses = composeClasses$1(slots, getInputUtilityClass, classes);
    return _extends$1({}, classes, composedClasses);
  };
  const InputRoot = styled(InputBaseRoot, {
    shouldForwardProp: (prop) => rootShouldForwardProp$1(prop) || prop === "classes",
    name: "MuiInput",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [...rootOverridesResolver(props, styles2), !ownerState.disableUnderline && styles2.underline];
    }
  })(({
    theme,
    ownerState
  }) => {
    const light2 = theme.palette.mode === "light";
    let bottomLineColor = light2 ? "rgba(0, 0, 0, 0.42)" : "rgba(255, 255, 255, 0.7)";
    if (theme.vars) {
      bottomLineColor = `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})`;
    }
    return _extends$1({
      position: "relative"
    }, ownerState.formControl && {
      "label + &": {
        marginTop: 16
      }
    }, !ownerState.disableUnderline && {
      "&::after": {
        borderBottom: `2px solid ${(theme.vars || theme).palette[ownerState.color].main}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        position: "absolute",
        right: 0,
        transform: "scaleX(0)",
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut
        }),
        pointerEvents: "none"
        // Transparent to the hover style.
      },
      [`&.${inputClasses$1.focused}:after`]: {
        // translateX(0) is a workaround for Safari transform scale bug
        // See https://github.com/mui/material-ui/issues/31766
        transform: "scaleX(1) translateX(0)"
      },
      [`&.${inputClasses$1.error}`]: {
        "&::before, &::after": {
          borderBottomColor: (theme.vars || theme).palette.error.main
        }
      },
      "&::before": {
        borderBottom: `1px solid ${bottomLineColor}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '"\\00a0"',
        position: "absolute",
        right: 0,
        transition: theme.transitions.create("border-bottom-color", {
          duration: theme.transitions.duration.shorter
        }),
        pointerEvents: "none"
        // Transparent to the hover style.
      },
      [`&:hover:not(.${inputClasses$1.disabled}, .${inputClasses$1.error}):before`]: {
        borderBottom: `2px solid ${(theme.vars || theme).palette.text.primary}`,
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          borderBottom: `1px solid ${bottomLineColor}`
        }
      },
      [`&.${inputClasses$1.disabled}:before`]: {
        borderBottomStyle: "dotted"
      }
    });
  });
  const InputInput = styled(InputBaseComponent, {
    name: "MuiInput",
    slot: "Input",
    overridesResolver: inputOverridesResolver
  })({});
  const Input = /* @__PURE__ */ React$1__namespace.forwardRef(function Input2(inProps, ref) {
    var _ref, _slots$root, _ref2, _slots$input;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiInput"
    });
    const {
      disableUnderline,
      components = {},
      componentsProps: componentsPropsProp,
      fullWidth = false,
      inputComponent = "input",
      multiline = false,
      slotProps,
      slots = {},
      type = "text"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$n);
    const classes = useUtilityClasses$k(props);
    const ownerState = {
      disableUnderline
    };
    const inputComponentsProps = {
      root: {
        ownerState
      }
    };
    const componentsProps = (slotProps != null ? slotProps : componentsPropsProp) ? deepmerge$1(slotProps != null ? slotProps : componentsPropsProp, inputComponentsProps) : inputComponentsProps;
    const RootSlot = (_ref = (_slots$root = slots.root) != null ? _slots$root : components.Root) != null ? _ref : InputRoot;
    const InputSlot = (_ref2 = (_slots$input = slots.input) != null ? _slots$input : components.Input) != null ? _ref2 : InputInput;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(InputBase$1, _extends$1({
      slots: {
        root: RootSlot,
        input: InputSlot
      },
      slotProps: componentsProps,
      fullWidth,
      inputComponent,
      multiline,
      ref,
      type
    }, other, {
      classes
    }));
  });
  Input.muiName = "Input";
  const Input$1 = Input;
  const _excluded$m = ["disableUnderline", "components", "componentsProps", "fullWidth", "hiddenLabel", "inputComponent", "multiline", "slotProps", "slots", "type"];
  const useUtilityClasses$j = (ownerState) => {
    const {
      classes,
      disableUnderline
    } = ownerState;
    const slots = {
      root: ["root", !disableUnderline && "underline"],
      input: ["input"]
    };
    const composedClasses = composeClasses$1(slots, getFilledInputUtilityClass, classes);
    return _extends$1({}, classes, composedClasses);
  };
  const FilledInputRoot = styled(InputBaseRoot, {
    shouldForwardProp: (prop) => rootShouldForwardProp$1(prop) || prop === "classes",
    name: "MuiFilledInput",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [...rootOverridesResolver(props, styles2), !ownerState.disableUnderline && styles2.underline];
    }
  })(({
    theme,
    ownerState
  }) => {
    var _palette;
    const light2 = theme.palette.mode === "light";
    const bottomLineColor = light2 ? "rgba(0, 0, 0, 0.42)" : "rgba(255, 255, 255, 0.7)";
    const backgroundColor2 = light2 ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.09)";
    const hoverBackground = light2 ? "rgba(0, 0, 0, 0.09)" : "rgba(255, 255, 255, 0.13)";
    const disabledBackground = light2 ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)";
    return _extends$1({
      position: "relative",
      backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor2,
      borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
      transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut
      }),
      "&:hover": {
        backgroundColor: theme.vars ? theme.vars.palette.FilledInput.hoverBg : hoverBackground,
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor2
        }
      },
      [`&.${filledInputClasses$1.focused}`]: {
        backgroundColor: theme.vars ? theme.vars.palette.FilledInput.bg : backgroundColor2
      },
      [`&.${filledInputClasses$1.disabled}`]: {
        backgroundColor: theme.vars ? theme.vars.palette.FilledInput.disabledBg : disabledBackground
      }
    }, !ownerState.disableUnderline && {
      "&::after": {
        borderBottom: `2px solid ${(_palette = (theme.vars || theme).palette[ownerState.color || "primary"]) == null ? void 0 : _palette.main}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        position: "absolute",
        right: 0,
        transform: "scaleX(0)",
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut
        }),
        pointerEvents: "none"
        // Transparent to the hover style.
      },
      [`&.${filledInputClasses$1.focused}:after`]: {
        // translateX(0) is a workaround for Safari transform scale bug
        // See https://github.com/mui/material-ui/issues/31766
        transform: "scaleX(1) translateX(0)"
      },
      [`&.${filledInputClasses$1.error}`]: {
        "&::before, &::after": {
          borderBottomColor: (theme.vars || theme).palette.error.main
        }
      },
      "&::before": {
        borderBottom: `1px solid ${theme.vars ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / ${theme.vars.opacity.inputUnderline})` : bottomLineColor}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE11 "''" https://github.com/cssinjs/jss/issues/242
        content: '"\\00a0"',
        position: "absolute",
        right: 0,
        transition: theme.transitions.create("border-bottom-color", {
          duration: theme.transitions.duration.shorter
        }),
        pointerEvents: "none"
        // Transparent to the hover style.
      },
      [`&:hover:not(.${filledInputClasses$1.disabled}, .${filledInputClasses$1.error}):before`]: {
        borderBottom: `1px solid ${(theme.vars || theme).palette.text.primary}`
      },
      [`&.${filledInputClasses$1.disabled}:before`]: {
        borderBottomStyle: "dotted"
      }
    }, ownerState.startAdornment && {
      paddingLeft: 12
    }, ownerState.endAdornment && {
      paddingRight: 12
    }, ownerState.multiline && _extends$1({
      padding: "25px 12px 8px"
    }, ownerState.size === "small" && {
      paddingTop: 21,
      paddingBottom: 4
    }, ownerState.hiddenLabel && {
      paddingTop: 16,
      paddingBottom: 17
    }, ownerState.hiddenLabel && ownerState.size === "small" && {
      paddingTop: 8,
      paddingBottom: 9
    }));
  });
  const FilledInputInput = styled(InputBaseComponent, {
    name: "MuiFilledInput",
    slot: "Input",
    overridesResolver: inputOverridesResolver
  })(({
    theme,
    ownerState
  }) => _extends$1({
    paddingTop: 25,
    paddingRight: 12,
    paddingBottom: 8,
    paddingLeft: 12
  }, !theme.vars && {
    "&:-webkit-autofill": {
      WebkitBoxShadow: theme.palette.mode === "light" ? null : "0 0 0 100px #266798 inset",
      WebkitTextFillColor: theme.palette.mode === "light" ? null : "#fff",
      caretColor: theme.palette.mode === "light" ? null : "#fff",
      borderTopLeftRadius: "inherit",
      borderTopRightRadius: "inherit"
    }
  }, theme.vars && {
    "&:-webkit-autofill": {
      borderTopLeftRadius: "inherit",
      borderTopRightRadius: "inherit"
    },
    [theme.getColorSchemeSelector("dark")]: {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 100px #266798 inset",
        WebkitTextFillColor: "#fff",
        caretColor: "#fff"
      }
    }
  }, ownerState.size === "small" && {
    paddingTop: 21,
    paddingBottom: 4
  }, ownerState.hiddenLabel && {
    paddingTop: 16,
    paddingBottom: 17
  }, ownerState.startAdornment && {
    paddingLeft: 0
  }, ownerState.endAdornment && {
    paddingRight: 0
  }, ownerState.hiddenLabel && ownerState.size === "small" && {
    paddingTop: 8,
    paddingBottom: 9
  }, ownerState.multiline && {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0
  }));
  const FilledInput = /* @__PURE__ */ React$1__namespace.forwardRef(function FilledInput2(inProps, ref) {
    var _ref, _slots$root, _ref2, _slots$input;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiFilledInput"
    });
    const {
      components = {},
      componentsProps: componentsPropsProp,
      fullWidth = false,
      // declare here to prevent spreading to DOM
      inputComponent = "input",
      multiline = false,
      slotProps,
      slots = {},
      type = "text"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$m);
    const ownerState = _extends$1({}, props, {
      fullWidth,
      inputComponent,
      multiline,
      type
    });
    const classes = useUtilityClasses$j(props);
    const filledInputComponentsProps = {
      root: {
        ownerState
      },
      input: {
        ownerState
      }
    };
    const componentsProps = (slotProps != null ? slotProps : componentsPropsProp) ? deepmerge$1(filledInputComponentsProps, slotProps != null ? slotProps : componentsPropsProp) : filledInputComponentsProps;
    const RootSlot = (_ref = (_slots$root = slots.root) != null ? _slots$root : components.Root) != null ? _ref : FilledInputRoot;
    const InputSlot = (_ref2 = (_slots$input = slots.input) != null ? _slots$input : components.Input) != null ? _ref2 : FilledInputInput;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(InputBase$1, _extends$1({
      slots: {
        root: RootSlot,
        input: InputSlot
      },
      componentsProps,
      fullWidth,
      inputComponent,
      multiline,
      ref,
      type
    }, other, {
      classes
    }));
  });
  FilledInput.muiName = "Input";
  const FilledInput$1 = FilledInput;
  var _span$2;
  const _excluded$l = ["children", "classes", "className", "label", "notched"];
  const NotchedOutlineRoot$1 = styled("fieldset", {
    shouldForwardProp: rootShouldForwardProp$1
  })({
    textAlign: "left",
    position: "absolute",
    bottom: 0,
    right: 0,
    top: -5,
    left: 0,
    margin: 0,
    padding: "0 8px",
    pointerEvents: "none",
    borderRadius: "inherit",
    borderStyle: "solid",
    borderWidth: 1,
    overflow: "hidden",
    minWidth: "0%"
  });
  const NotchedOutlineLegend = styled("legend", {
    shouldForwardProp: rootShouldForwardProp$1
  })(({
    ownerState,
    theme
  }) => _extends$1({
    float: "unset",
    // Fix conflict with bootstrap
    width: "auto",
    // Fix conflict with bootstrap
    overflow: "hidden"
  }, !ownerState.withLabel && {
    padding: 0,
    lineHeight: "11px",
    // sync with `height` in `legend` styles
    transition: theme.transitions.create("width", {
      duration: 150,
      easing: theme.transitions.easing.easeOut
    })
  }, ownerState.withLabel && _extends$1({
    display: "block",
    // Fix conflict with normalize.css and sanitize.css
    padding: 0,
    height: 11,
    // sync with `lineHeight` in `legend` styles
    fontSize: "0.75em",
    visibility: "hidden",
    maxWidth: 0.01,
    transition: theme.transitions.create("max-width", {
      duration: 50,
      easing: theme.transitions.easing.easeOut
    }),
    whiteSpace: "nowrap",
    "& > span": {
      paddingLeft: 5,
      paddingRight: 5,
      display: "inline-block",
      opacity: 0,
      visibility: "visible"
    }
  }, ownerState.notched && {
    maxWidth: "100%",
    transition: theme.transitions.create("max-width", {
      duration: 100,
      easing: theme.transitions.easing.easeOut,
      delay: 50
    })
  })));
  function NotchedOutline(props) {
    const {
      className,
      label,
      notched
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$l);
    const withLabel = label != null && label !== "";
    const ownerState = _extends$1({}, props, {
      notched,
      withLabel
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(NotchedOutlineRoot$1, _extends$1({
      "aria-hidden": true,
      className,
      ownerState
    }, other, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotchedOutlineLegend, {
        ownerState,
        children: withLabel ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
          children: label
        }) : (
          // notranslate needed while Google Translate will not fix zero-width space issue
          _span$2 || (_span$2 = /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
            className: "notranslate",
            children: "​"
          }))
        )
      })
    }));
  }
  const _excluded$k = ["components", "fullWidth", "inputComponent", "label", "multiline", "notched", "slots", "type"];
  const useUtilityClasses$i = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"],
      notchedOutline: ["notchedOutline"],
      input: ["input"]
    };
    const composedClasses = composeClasses$1(slots, getOutlinedInputUtilityClass, classes);
    return _extends$1({}, classes, composedClasses);
  };
  const OutlinedInputRoot = styled(InputBaseRoot, {
    shouldForwardProp: (prop) => rootShouldForwardProp$1(prop) || prop === "classes",
    name: "MuiOutlinedInput",
    slot: "Root",
    overridesResolver: rootOverridesResolver
  })(({
    theme,
    ownerState
  }) => {
    const borderColor2 = theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)";
    return _extends$1({
      position: "relative",
      borderRadius: (theme.vars || theme).shape.borderRadius,
      [`&:hover .${outlinedInputClasses$1.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.text.primary
      },
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        [`&:hover .${outlinedInputClasses$1.notchedOutline}`]: {
          borderColor: theme.vars ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)` : borderColor2
        }
      },
      [`&.${outlinedInputClasses$1.focused} .${outlinedInputClasses$1.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette[ownerState.color].main,
        borderWidth: 2
      },
      [`&.${outlinedInputClasses$1.error} .${outlinedInputClasses$1.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.error.main
      },
      [`&.${outlinedInputClasses$1.disabled} .${outlinedInputClasses$1.notchedOutline}`]: {
        borderColor: (theme.vars || theme).palette.action.disabled
      }
    }, ownerState.startAdornment && {
      paddingLeft: 14
    }, ownerState.endAdornment && {
      paddingRight: 14
    }, ownerState.multiline && _extends$1({
      padding: "16.5px 14px"
    }, ownerState.size === "small" && {
      padding: "8.5px 14px"
    }));
  });
  const NotchedOutlineRoot = styled(NotchedOutline, {
    name: "MuiOutlinedInput",
    slot: "NotchedOutline",
    overridesResolver: (props, styles2) => styles2.notchedOutline
  })(({
    theme
  }) => {
    const borderColor2 = theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)";
    return {
      borderColor: theme.vars ? `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)` : borderColor2
    };
  });
  const OutlinedInputInput = styled(InputBaseComponent, {
    name: "MuiOutlinedInput",
    slot: "Input",
    overridesResolver: inputOverridesResolver
  })(({
    theme,
    ownerState
  }) => _extends$1({
    padding: "16.5px 14px"
  }, !theme.vars && {
    "&:-webkit-autofill": {
      WebkitBoxShadow: theme.palette.mode === "light" ? null : "0 0 0 100px #266798 inset",
      WebkitTextFillColor: theme.palette.mode === "light" ? null : "#fff",
      caretColor: theme.palette.mode === "light" ? null : "#fff",
      borderRadius: "inherit"
    }
  }, theme.vars && {
    "&:-webkit-autofill": {
      borderRadius: "inherit"
    },
    [theme.getColorSchemeSelector("dark")]: {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 100px #266798 inset",
        WebkitTextFillColor: "#fff",
        caretColor: "#fff"
      }
    }
  }, ownerState.size === "small" && {
    padding: "8.5px 14px"
  }, ownerState.multiline && {
    padding: 0
  }, ownerState.startAdornment && {
    paddingLeft: 0
  }, ownerState.endAdornment && {
    paddingRight: 0
  }));
  const OutlinedInput = /* @__PURE__ */ React$1__namespace.forwardRef(function OutlinedInput2(inProps, ref) {
    var _ref, _slots$root, _ref2, _slots$input, _React$Fragment;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiOutlinedInput"
    });
    const {
      components = {},
      fullWidth = false,
      inputComponent = "input",
      label,
      multiline = false,
      notched,
      slots = {},
      type = "text"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$k);
    const classes = useUtilityClasses$i(props);
    const muiFormControl = useFormControl();
    const fcs = formControlState({
      props,
      muiFormControl,
      states: ["color", "disabled", "error", "focused", "hiddenLabel", "size", "required"]
    });
    const ownerState = _extends$1({}, props, {
      color: fcs.color || "primary",
      disabled: fcs.disabled,
      error: fcs.error,
      focused: fcs.focused,
      formControl: muiFormControl,
      fullWidth,
      hiddenLabel: fcs.hiddenLabel,
      multiline,
      size: fcs.size,
      type
    });
    const RootSlot = (_ref = (_slots$root = slots.root) != null ? _slots$root : components.Root) != null ? _ref : OutlinedInputRoot;
    const InputSlot = (_ref2 = (_slots$input = slots.input) != null ? _slots$input : components.Input) != null ? _ref2 : OutlinedInputInput;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(InputBase$1, _extends$1({
      slots: {
        root: RootSlot,
        input: InputSlot
      },
      renderSuffix: (state) => /* @__PURE__ */ jsxRuntimeExports.jsx(NotchedOutlineRoot, {
        ownerState,
        className: classes.notchedOutline,
        label: label != null && label !== "" && fcs.required ? _React$Fragment || (_React$Fragment = /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
          children: [label, " ", "*"]
        })) : label,
        notched: typeof notched !== "undefined" ? notched : Boolean(state.startAdornment || state.filled || state.focused)
      }),
      fullWidth,
      inputComponent,
      multiline,
      ref,
      type
    }, other, {
      classes: _extends$1({}, classes, {
        notchedOutline: null
      })
    }));
  });
  OutlinedInput.muiName = "Input";
  const OutlinedInput$1 = OutlinedInput;
  function getFormLabelUtilityClasses(slot) {
    return generateUtilityClass$2("MuiFormLabel", slot);
  }
  const formLabelClasses = generateUtilityClasses$2("MuiFormLabel", ["root", "colorSecondary", "focused", "disabled", "error", "filled", "required", "asterisk"]);
  const formLabelClasses$1 = formLabelClasses;
  const _excluded$j = ["children", "className", "color", "component", "disabled", "error", "filled", "focused", "required"];
  const useUtilityClasses$h = (ownerState) => {
    const {
      classes,
      color: color2,
      focused,
      disabled,
      error,
      filled,
      required
    } = ownerState;
    const slots = {
      root: ["root", `color${capitalize$1(color2)}`, disabled && "disabled", error && "error", filled && "filled", focused && "focused", required && "required"],
      asterisk: ["asterisk", error && "error"]
    };
    return composeClasses$1(slots, getFormLabelUtilityClasses, classes);
  };
  const FormLabelRoot = styled("label", {
    name: "MuiFormLabel",
    slot: "Root",
    overridesResolver: ({
      ownerState
    }, styles2) => {
      return _extends$1({}, styles2.root, ownerState.color === "secondary" && styles2.colorSecondary, ownerState.filled && styles2.filled);
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    color: (theme.vars || theme).palette.text.secondary
  }, theme.typography.body1, {
    lineHeight: "1.4375em",
    padding: 0,
    position: "relative",
    [`&.${formLabelClasses$1.focused}`]: {
      color: (theme.vars || theme).palette[ownerState.color].main
    },
    [`&.${formLabelClasses$1.disabled}`]: {
      color: (theme.vars || theme).palette.text.disabled
    },
    [`&.${formLabelClasses$1.error}`]: {
      color: (theme.vars || theme).palette.error.main
    }
  }));
  const AsteriskComponent = styled("span", {
    name: "MuiFormLabel",
    slot: "Asterisk",
    overridesResolver: (props, styles2) => styles2.asterisk
  })(({
    theme
  }) => ({
    [`&.${formLabelClasses$1.error}`]: {
      color: (theme.vars || theme).palette.error.main
    }
  }));
  const FormLabel = /* @__PURE__ */ React$1__namespace.forwardRef(function FormLabel2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiFormLabel"
    });
    const {
      children,
      className,
      component = "label"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$j);
    const muiFormControl = useFormControl();
    const fcs = formControlState({
      props,
      muiFormControl,
      states: ["color", "required", "focused", "disabled", "error", "filled"]
    });
    const ownerState = _extends$1({}, props, {
      color: fcs.color || "primary",
      component,
      disabled: fcs.disabled,
      error: fcs.error,
      filled: fcs.filled,
      focused: fcs.focused,
      required: fcs.required
    });
    const classes = useUtilityClasses$h(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabelRoot, _extends$1({
      as: component,
      ownerState,
      className: clsx(classes.root, className),
      ref
    }, other, {
      children: [children, fcs.required && /* @__PURE__ */ jsxRuntimeExports.jsxs(AsteriskComponent, {
        ownerState,
        "aria-hidden": true,
        className: classes.asterisk,
        children: [" ", "*"]
      })]
    }));
  });
  const FormLabel$1 = FormLabel;
  function getInputLabelUtilityClasses(slot) {
    return generateUtilityClass$2("MuiInputLabel", slot);
  }
  const inputLabelClasses = generateUtilityClasses$2("MuiInputLabel", ["root", "focused", "disabled", "error", "required", "asterisk", "formControl", "sizeSmall", "shrink", "animated", "standard", "filled", "outlined"]);
  const inputLabelClasses$1 = inputLabelClasses;
  const _excluded$i = ["disableAnimation", "margin", "shrink", "variant", "className"];
  const useUtilityClasses$g = (ownerState) => {
    const {
      classes,
      formControl,
      size,
      shrink,
      disableAnimation,
      variant,
      required
    } = ownerState;
    const slots = {
      root: ["root", formControl && "formControl", !disableAnimation && "animated", shrink && "shrink", size && size !== "normal" && `size${capitalize$1(size)}`, variant],
      asterisk: [required && "asterisk"]
    };
    const composedClasses = composeClasses$1(slots, getInputLabelUtilityClasses, classes);
    return _extends$1({}, classes, composedClasses);
  };
  const InputLabelRoot = styled(FormLabel$1, {
    shouldForwardProp: (prop) => rootShouldForwardProp$1(prop) || prop === "classes",
    name: "MuiInputLabel",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [{
        [`& .${formLabelClasses$1.asterisk}`]: styles2.asterisk
      }, styles2.root, ownerState.formControl && styles2.formControl, ownerState.size === "small" && styles2.sizeSmall, ownerState.shrink && styles2.shrink, !ownerState.disableAnimation && styles2.animated, ownerState.focused && styles2.focused, styles2[ownerState.variant]];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    display: "block",
    transformOrigin: "top left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%"
  }, ownerState.formControl && {
    position: "absolute",
    left: 0,
    top: 0,
    // slight alteration to spec spacing to match visual spec result
    transform: "translate(0, 20px) scale(1)"
  }, ownerState.size === "small" && {
    // Compensation for the `Input.inputSizeSmall` style.
    transform: "translate(0, 17px) scale(1)"
  }, ownerState.shrink && {
    transform: "translate(0, -1.5px) scale(0.75)",
    transformOrigin: "top left",
    maxWidth: "133%"
  }, !ownerState.disableAnimation && {
    transition: theme.transitions.create(["color", "transform", "max-width"], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeOut
    })
  }, ownerState.variant === "filled" && _extends$1({
    // Chrome's autofill feature gives the input field a yellow background.
    // Since the input field is behind the label in the HTML tree,
    // the input field is drawn last and hides the label with an opaque background color.
    // zIndex: 1 will raise the label above opaque background-colors of input.
    zIndex: 1,
    pointerEvents: "none",
    transform: "translate(12px, 16px) scale(1)",
    maxWidth: "calc(100% - 24px)"
  }, ownerState.size === "small" && {
    transform: "translate(12px, 13px) scale(1)"
  }, ownerState.shrink && _extends$1({
    userSelect: "none",
    pointerEvents: "auto",
    transform: "translate(12px, 7px) scale(0.75)",
    maxWidth: "calc(133% - 24px)"
  }, ownerState.size === "small" && {
    transform: "translate(12px, 4px) scale(0.75)"
  })), ownerState.variant === "outlined" && _extends$1({
    // see comment above on filled.zIndex
    zIndex: 1,
    pointerEvents: "none",
    transform: "translate(14px, 16px) scale(1)",
    maxWidth: "calc(100% - 24px)"
  }, ownerState.size === "small" && {
    transform: "translate(14px, 9px) scale(1)"
  }, ownerState.shrink && {
    userSelect: "none",
    pointerEvents: "auto",
    // Theoretically, we should have (8+5)*2/0.75 = 34px
    // but it feels a better when it bleeds a bit on the left, so 32px.
    maxWidth: "calc(133% - 32px)",
    transform: "translate(14px, -9px) scale(0.75)"
  })));
  const InputLabel = /* @__PURE__ */ React$1__namespace.forwardRef(function InputLabel2(inProps, ref) {
    const props = useThemeProps$1({
      name: "MuiInputLabel",
      props: inProps
    });
    const {
      disableAnimation = false,
      shrink: shrinkProp,
      className
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$i);
    const muiFormControl = useFormControl();
    let shrink = shrinkProp;
    if (typeof shrink === "undefined" && muiFormControl) {
      shrink = muiFormControl.filled || muiFormControl.focused || muiFormControl.adornedStart;
    }
    const fcs = formControlState({
      props,
      muiFormControl,
      states: ["size", "variant", "required", "focused"]
    });
    const ownerState = _extends$1({}, props, {
      disableAnimation,
      formControl: muiFormControl,
      shrink,
      size: fcs.size,
      variant: fcs.variant,
      required: fcs.required,
      focused: fcs.focused
    });
    const classes = useUtilityClasses$g(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(InputLabelRoot, _extends$1({
      "data-shrink": shrink,
      ownerState,
      ref,
      className: clsx(classes.root, className)
    }, other, {
      classes
    }));
  });
  const InputLabel$1 = InputLabel;
  function getFormControlUtilityClasses(slot) {
    return generateUtilityClass$2("MuiFormControl", slot);
  }
  generateUtilityClasses$2("MuiFormControl", ["root", "marginNone", "marginNormal", "marginDense", "fullWidth", "disabled"]);
  const _excluded$h = ["children", "className", "color", "component", "disabled", "error", "focused", "fullWidth", "hiddenLabel", "margin", "required", "size", "variant"];
  const useUtilityClasses$f = (ownerState) => {
    const {
      classes,
      margin: margin2,
      fullWidth
    } = ownerState;
    const slots = {
      root: ["root", margin2 !== "none" && `margin${capitalize$1(margin2)}`, fullWidth && "fullWidth"]
    };
    return composeClasses$1(slots, getFormControlUtilityClasses, classes);
  };
  const FormControlRoot = styled("div", {
    name: "MuiFormControl",
    slot: "Root",
    overridesResolver: ({
      ownerState
    }, styles2) => {
      return _extends$1({}, styles2.root, styles2[`margin${capitalize$1(ownerState.margin)}`], ownerState.fullWidth && styles2.fullWidth);
    }
  })(({
    ownerState
  }) => _extends$1({
    display: "inline-flex",
    flexDirection: "column",
    position: "relative",
    // Reset fieldset default style.
    minWidth: 0,
    padding: 0,
    margin: 0,
    border: 0,
    verticalAlign: "top"
  }, ownerState.margin === "normal" && {
    marginTop: 16,
    marginBottom: 8
  }, ownerState.margin === "dense" && {
    marginTop: 8,
    marginBottom: 4
  }, ownerState.fullWidth && {
    width: "100%"
  }));
  const FormControl = /* @__PURE__ */ React$1__namespace.forwardRef(function FormControl2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiFormControl"
    });
    const {
      children,
      className,
      color: color2 = "primary",
      component = "div",
      disabled = false,
      error = false,
      focused: visuallyFocused,
      fullWidth = false,
      hiddenLabel = false,
      margin: margin2 = "none",
      required = false,
      size = "medium",
      variant = "outlined"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$h);
    const ownerState = _extends$1({}, props, {
      color: color2,
      component,
      disabled,
      error,
      fullWidth,
      hiddenLabel,
      margin: margin2,
      required,
      size,
      variant
    });
    const classes = useUtilityClasses$f(ownerState);
    const [adornedStart, setAdornedStart] = React$1__namespace.useState(() => {
      let initialAdornedStart = false;
      if (children) {
        React$1__namespace.Children.forEach(children, (child) => {
          if (!isMuiElement(child, ["Input", "Select"])) {
            return;
          }
          const input2 = isMuiElement(child, ["Select"]) ? child.props.input : child;
          if (input2 && isAdornedStart(input2.props)) {
            initialAdornedStart = true;
          }
        });
      }
      return initialAdornedStart;
    });
    const [filled, setFilled] = React$1__namespace.useState(() => {
      let initialFilled = false;
      if (children) {
        React$1__namespace.Children.forEach(children, (child) => {
          if (!isMuiElement(child, ["Input", "Select"])) {
            return;
          }
          if (isFilled(child.props, true) || isFilled(child.props.inputProps, true)) {
            initialFilled = true;
          }
        });
      }
      return initialFilled;
    });
    const [focusedState, setFocused] = React$1__namespace.useState(false);
    if (disabled && focusedState) {
      setFocused(false);
    }
    const focused = visuallyFocused !== void 0 && !disabled ? visuallyFocused : focusedState;
    let registerEffect;
    const childContext = React$1__namespace.useMemo(() => {
      return {
        adornedStart,
        setAdornedStart,
        color: color2,
        disabled,
        error,
        filled,
        focused,
        fullWidth,
        hiddenLabel,
        size,
        onBlur: () => {
          setFocused(false);
        },
        onEmpty: () => {
          setFilled(false);
        },
        onFilled: () => {
          setFilled(true);
        },
        onFocus: () => {
          setFocused(true);
        },
        registerEffect,
        required,
        variant
      };
    }, [adornedStart, color2, disabled, error, filled, focused, fullWidth, hiddenLabel, registerEffect, required, size, variant]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FormControlContext$1.Provider, {
      value: childContext,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormControlRoot, _extends$1({
        as: component,
        ownerState,
        className: clsx(classes.root, className),
        ref
      }, other, {
        children
      }))
    });
  });
  const FormControl$1 = FormControl;
  function getFormHelperTextUtilityClasses(slot) {
    return generateUtilityClass$2("MuiFormHelperText", slot);
  }
  const formHelperTextClasses = generateUtilityClasses$2("MuiFormHelperText", ["root", "error", "disabled", "sizeSmall", "sizeMedium", "contained", "focused", "filled", "required"]);
  const formHelperTextClasses$1 = formHelperTextClasses;
  var _span$1;
  const _excluded$g = ["children", "className", "component", "disabled", "error", "filled", "focused", "margin", "required", "variant"];
  const useUtilityClasses$e = (ownerState) => {
    const {
      classes,
      contained,
      size,
      disabled,
      error,
      filled,
      focused,
      required
    } = ownerState;
    const slots = {
      root: ["root", disabled && "disabled", error && "error", size && `size${capitalize$1(size)}`, contained && "contained", focused && "focused", filled && "filled", required && "required"]
    };
    return composeClasses$1(slots, getFormHelperTextUtilityClasses, classes);
  };
  const FormHelperTextRoot = styled("p", {
    name: "MuiFormHelperText",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.size && styles2[`size${capitalize$1(ownerState.size)}`], ownerState.contained && styles2.contained, ownerState.filled && styles2.filled];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    color: (theme.vars || theme).palette.text.secondary
  }, theme.typography.caption, {
    textAlign: "left",
    marginTop: 3,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    [`&.${formHelperTextClasses$1.disabled}`]: {
      color: (theme.vars || theme).palette.text.disabled
    },
    [`&.${formHelperTextClasses$1.error}`]: {
      color: (theme.vars || theme).palette.error.main
    }
  }, ownerState.size === "small" && {
    marginTop: 4
  }, ownerState.contained && {
    marginLeft: 14,
    marginRight: 14
  }));
  const FormHelperText = /* @__PURE__ */ React$1__namespace.forwardRef(function FormHelperText2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiFormHelperText"
    });
    const {
      children,
      className,
      component = "p"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$g);
    const muiFormControl = useFormControl();
    const fcs = formControlState({
      props,
      muiFormControl,
      states: ["variant", "size", "disabled", "error", "filled", "focused", "required"]
    });
    const ownerState = _extends$1({}, props, {
      component,
      contained: fcs.variant === "filled" || fcs.variant === "outlined",
      variant: fcs.variant,
      size: fcs.size,
      disabled: fcs.disabled,
      error: fcs.error,
      filled: fcs.filled,
      focused: fcs.focused,
      required: fcs.required
    });
    const classes = useUtilityClasses$e(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FormHelperTextRoot, _extends$1({
      as: component,
      ownerState,
      className: clsx(classes.root, className),
      ref
    }, other, {
      children: children === " " ? (
        // notranslate needed while Google Translate will not fix zero-width space issue
        _span$1 || (_span$1 = /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
          className: "notranslate",
          children: "​"
        }))
      ) : children
    }));
  });
  const FormHelperText$1 = FormHelperText;
  const ListContext = /* @__PURE__ */ React$1__namespace.createContext({});
  const ListContext$1 = ListContext;
  function getListUtilityClass(slot) {
    return generateUtilityClass$2("MuiList", slot);
  }
  generateUtilityClasses$2("MuiList", ["root", "padding", "dense", "subheader"]);
  const _excluded$f = ["children", "className", "component", "dense", "disablePadding", "subheader"];
  const useUtilityClasses$d = (ownerState) => {
    const {
      classes,
      disablePadding,
      dense,
      subheader
    } = ownerState;
    const slots = {
      root: ["root", !disablePadding && "padding", dense && "dense", subheader && "subheader"]
    };
    return composeClasses$1(slots, getListUtilityClass, classes);
  };
  const ListRoot = styled("ul", {
    name: "MuiList",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, !ownerState.disablePadding && styles2.padding, ownerState.dense && styles2.dense, ownerState.subheader && styles2.subheader];
    }
  })(({
    ownerState
  }) => _extends$1({
    listStyle: "none",
    margin: 0,
    padding: 0,
    position: "relative"
  }, !ownerState.disablePadding && {
    paddingTop: 8,
    paddingBottom: 8
  }, ownerState.subheader && {
    paddingTop: 0
  }));
  const List = /* @__PURE__ */ React$1__namespace.forwardRef(function List2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiList"
    });
    const {
      children,
      className,
      component = "ul",
      dense = false,
      disablePadding = false,
      subheader
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$f);
    const context = React$1__namespace.useMemo(() => ({
      dense
    }), [dense]);
    const ownerState = _extends$1({}, props, {
      component,
      dense,
      disablePadding
    });
    const classes = useUtilityClasses$d(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ListContext$1.Provider, {
      value: context,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ListRoot, _extends$1({
        as: component,
        className: clsx(classes.root, className),
        ref,
        ownerState
      }, other, {
        children: [subheader, children]
      }))
    });
  });
  const List$1 = List;
  const _excluded$e = ["actions", "autoFocus", "autoFocusItem", "children", "className", "disabledItemsFocusable", "disableListWrap", "onKeyDown", "variant"];
  function nextItem(list, item, disableListWrap) {
    if (list === item) {
      return list.firstChild;
    }
    if (item && item.nextElementSibling) {
      return item.nextElementSibling;
    }
    return disableListWrap ? null : list.firstChild;
  }
  function previousItem(list, item, disableListWrap) {
    if (list === item) {
      return disableListWrap ? list.firstChild : list.lastChild;
    }
    if (item && item.previousElementSibling) {
      return item.previousElementSibling;
    }
    return disableListWrap ? null : list.lastChild;
  }
  function textCriteriaMatches(nextFocus, textCriteria) {
    if (textCriteria === void 0) {
      return true;
    }
    let text = nextFocus.innerText;
    if (text === void 0) {
      text = nextFocus.textContent;
    }
    text = text.trim().toLowerCase();
    if (text.length === 0) {
      return false;
    }
    if (textCriteria.repeating) {
      return text[0] === textCriteria.keys[0];
    }
    return text.indexOf(textCriteria.keys.join("")) === 0;
  }
  function moveFocus(list, currentFocus, disableListWrap, disabledItemsFocusable, traversalFunction, textCriteria) {
    let wrappedOnce = false;
    let nextFocus = traversalFunction(list, currentFocus, currentFocus ? disableListWrap : false);
    while (nextFocus) {
      if (nextFocus === list.firstChild) {
        if (wrappedOnce) {
          return false;
        }
        wrappedOnce = true;
      }
      const nextFocusDisabled = disabledItemsFocusable ? false : nextFocus.disabled || nextFocus.getAttribute("aria-disabled") === "true";
      if (!nextFocus.hasAttribute("tabindex") || !textCriteriaMatches(nextFocus, textCriteria) || nextFocusDisabled) {
        nextFocus = traversalFunction(list, nextFocus, disableListWrap);
      } else {
        nextFocus.focus();
        return true;
      }
    }
    return false;
  }
  const MenuList = /* @__PURE__ */ React$1__namespace.forwardRef(function MenuList2(props, ref) {
    const {
      // private
      // eslint-disable-next-line react/prop-types
      actions,
      autoFocus = false,
      autoFocusItem = false,
      children,
      className,
      disabledItemsFocusable = false,
      disableListWrap = false,
      onKeyDown,
      variant = "selectedMenu"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$e);
    const listRef = React$1__namespace.useRef(null);
    const textCriteriaRef = React$1__namespace.useRef({
      keys: [],
      repeating: true,
      previousKeyMatched: true,
      lastTime: null
    });
    useEnhancedEffect(() => {
      if (autoFocus) {
        listRef.current.focus();
      }
    }, [autoFocus]);
    React$1__namespace.useImperativeHandle(actions, () => ({
      adjustStyleForScrollbar: (containerElement, theme) => {
        const noExplicitWidth = !listRef.current.style.width;
        if (containerElement.clientHeight < listRef.current.clientHeight && noExplicitWidth) {
          const scrollbarSize = `${getScrollbarSize(ownerDocument(containerElement))}px`;
          listRef.current.style[theme.direction === "rtl" ? "paddingLeft" : "paddingRight"] = scrollbarSize;
          listRef.current.style.width = `calc(100% + ${scrollbarSize})`;
        }
        return listRef.current;
      }
    }), []);
    const handleKeyDown2 = (event) => {
      const list = listRef.current;
      const key = event.key;
      const currentFocus = ownerDocument(list).activeElement;
      if (key === "ArrowDown") {
        event.preventDefault();
        moveFocus(list, currentFocus, disableListWrap, disabledItemsFocusable, nextItem);
      } else if (key === "ArrowUp") {
        event.preventDefault();
        moveFocus(list, currentFocus, disableListWrap, disabledItemsFocusable, previousItem);
      } else if (key === "Home") {
        event.preventDefault();
        moveFocus(list, null, disableListWrap, disabledItemsFocusable, nextItem);
      } else if (key === "End") {
        event.preventDefault();
        moveFocus(list, null, disableListWrap, disabledItemsFocusable, previousItem);
      } else if (key.length === 1) {
        const criteria = textCriteriaRef.current;
        const lowerKey = key.toLowerCase();
        const currTime = performance.now();
        if (criteria.keys.length > 0) {
          if (currTime - criteria.lastTime > 500) {
            criteria.keys = [];
            criteria.repeating = true;
            criteria.previousKeyMatched = true;
          } else if (criteria.repeating && lowerKey !== criteria.keys[0]) {
            criteria.repeating = false;
          }
        }
        criteria.lastTime = currTime;
        criteria.keys.push(lowerKey);
        const keepFocusOnCurrent = currentFocus && !criteria.repeating && textCriteriaMatches(currentFocus, criteria);
        if (criteria.previousKeyMatched && (keepFocusOnCurrent || moveFocus(list, currentFocus, false, disabledItemsFocusable, nextItem, criteria))) {
          event.preventDefault();
        } else {
          criteria.previousKeyMatched = false;
        }
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
    };
    const handleRef = useForkRef(listRef, ref);
    let activeItemIndex = -1;
    React$1__namespace.Children.forEach(children, (child, index) => {
      if (!/* @__PURE__ */ React$1__namespace.isValidElement(child)) {
        if (activeItemIndex === index) {
          activeItemIndex += 1;
          if (activeItemIndex >= children.length) {
            activeItemIndex = -1;
          }
        }
        return;
      }
      if (!child.props.disabled) {
        if (variant === "selectedMenu" && child.props.selected) {
          activeItemIndex = index;
        } else if (activeItemIndex === -1) {
          activeItemIndex = index;
        }
      }
      if (activeItemIndex === index && (child.props.disabled || child.props.muiSkipListHighlight || child.type.muiSkipListHighlight)) {
        activeItemIndex += 1;
        if (activeItemIndex >= children.length) {
          activeItemIndex = -1;
        }
      }
    });
    const items = React$1__namespace.Children.map(children, (child, index) => {
      if (index === activeItemIndex) {
        const newChildProps = {};
        if (autoFocusItem) {
          newChildProps.autoFocus = true;
        }
        if (child.props.tabIndex === void 0 && variant === "selectedMenu") {
          newChildProps.tabIndex = 0;
        }
        return /* @__PURE__ */ React$1__namespace.cloneElement(child, newChildProps);
      }
      return child;
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(List$1, _extends$1({
      role: "menu",
      ref: handleRef,
      className,
      onKeyDown: handleKeyDown2,
      tabIndex: autoFocus ? 0 : -1
    }, other, {
      children: items
    }));
  });
  const MenuList$1 = MenuList;
  function getPopoverUtilityClass(slot) {
    return generateUtilityClass$2("MuiPopover", slot);
  }
  generateUtilityClasses$2("MuiPopover", ["root", "paper"]);
  const _excluded$d = ["onEntering"], _excluded2$3 = ["action", "anchorEl", "anchorOrigin", "anchorPosition", "anchorReference", "children", "className", "container", "elevation", "marginThreshold", "open", "PaperProps", "slots", "slotProps", "transformOrigin", "TransitionComponent", "transitionDuration", "TransitionProps", "disableScrollLock"], _excluded3 = ["slotProps"];
  function getOffsetTop(rect, vertical) {
    let offset2 = 0;
    if (typeof vertical === "number") {
      offset2 = vertical;
    } else if (vertical === "center") {
      offset2 = rect.height / 2;
    } else if (vertical === "bottom") {
      offset2 = rect.height;
    }
    return offset2;
  }
  function getOffsetLeft(rect, horizontal) {
    let offset2 = 0;
    if (typeof horizontal === "number") {
      offset2 = horizontal;
    } else if (horizontal === "center") {
      offset2 = rect.width / 2;
    } else if (horizontal === "right") {
      offset2 = rect.width;
    }
    return offset2;
  }
  function getTransformOriginValue(transformOrigin) {
    return [transformOrigin.horizontal, transformOrigin.vertical].map((n2) => typeof n2 === "number" ? `${n2}px` : n2).join(" ");
  }
  function resolveAnchorEl(anchorEl) {
    return typeof anchorEl === "function" ? anchorEl() : anchorEl;
  }
  const useUtilityClasses$c = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"],
      paper: ["paper"]
    };
    return composeClasses$1(slots, getPopoverUtilityClass, classes);
  };
  const PopoverRoot = styled(Modal$1, {
    name: "MuiPopover",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({});
  const PopoverPaper = styled(Paper$1, {
    name: "MuiPopover",
    slot: "Paper",
    overridesResolver: (props, styles2) => styles2.paper
  })({
    position: "absolute",
    overflowY: "auto",
    overflowX: "hidden",
    // So we see the popover when it's empty.
    // It's most likely on issue on userland.
    minWidth: 16,
    minHeight: 16,
    maxWidth: "calc(100% - 32px)",
    maxHeight: "calc(100% - 32px)",
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0
  });
  const Popover = /* @__PURE__ */ React$1__namespace.forwardRef(function Popover2(inProps, ref) {
    var _slotProps$paper, _slots$root, _slots$paper;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiPopover"
    });
    const {
      action,
      anchorEl,
      anchorOrigin = {
        vertical: "top",
        horizontal: "left"
      },
      anchorPosition,
      anchorReference = "anchorEl",
      children,
      className,
      container: containerProp,
      elevation = 8,
      marginThreshold = 16,
      open,
      PaperProps: PaperPropsProp = {},
      slots,
      slotProps,
      transformOrigin = {
        vertical: "top",
        horizontal: "left"
      },
      TransitionComponent = Grow$1,
      transitionDuration: transitionDurationProp = "auto",
      TransitionProps: {
        onEntering
      } = {},
      disableScrollLock = false
    } = props, TransitionProps = _objectWithoutPropertiesLoose(props.TransitionProps, _excluded$d), other = _objectWithoutPropertiesLoose(props, _excluded2$3);
    const externalPaperSlotProps = (_slotProps$paper = slotProps == null ? void 0 : slotProps.paper) != null ? _slotProps$paper : PaperPropsProp;
    const paperRef = React$1__namespace.useRef();
    const handlePaperRef = useForkRef(paperRef, externalPaperSlotProps.ref);
    const ownerState = _extends$1({}, props, {
      anchorOrigin,
      anchorReference,
      elevation,
      marginThreshold,
      externalPaperSlotProps,
      transformOrigin,
      TransitionComponent,
      transitionDuration: transitionDurationProp,
      TransitionProps
    });
    const classes = useUtilityClasses$c(ownerState);
    const getAnchorOffset = React$1__namespace.useCallback(() => {
      if (anchorReference === "anchorPosition") {
        return anchorPosition;
      }
      const resolvedAnchorEl = resolveAnchorEl(anchorEl);
      const anchorElement = resolvedAnchorEl && resolvedAnchorEl.nodeType === 1 ? resolvedAnchorEl : ownerDocument(paperRef.current).body;
      const anchorRect = anchorElement.getBoundingClientRect();
      return {
        top: anchorRect.top + getOffsetTop(anchorRect, anchorOrigin.vertical),
        left: anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal)
      };
    }, [anchorEl, anchorOrigin.horizontal, anchorOrigin.vertical, anchorPosition, anchorReference]);
    const getTransformOrigin = React$1__namespace.useCallback((elemRect) => {
      return {
        vertical: getOffsetTop(elemRect, transformOrigin.vertical),
        horizontal: getOffsetLeft(elemRect, transformOrigin.horizontal)
      };
    }, [transformOrigin.horizontal, transformOrigin.vertical]);
    const getPositioningStyle = React$1__namespace.useCallback((element) => {
      const elemRect = {
        width: element.offsetWidth,
        height: element.offsetHeight
      };
      const elemTransformOrigin = getTransformOrigin(elemRect);
      if (anchorReference === "none") {
        return {
          top: null,
          left: null,
          transformOrigin: getTransformOriginValue(elemTransformOrigin)
        };
      }
      const anchorOffset = getAnchorOffset();
      let top2 = anchorOffset.top - elemTransformOrigin.vertical;
      let left2 = anchorOffset.left - elemTransformOrigin.horizontal;
      const bottom2 = top2 + elemRect.height;
      const right2 = left2 + elemRect.width;
      const containerWindow = ownerWindow(resolveAnchorEl(anchorEl));
      const heightThreshold = containerWindow.innerHeight - marginThreshold;
      const widthThreshold = containerWindow.innerWidth - marginThreshold;
      if (marginThreshold !== null && top2 < marginThreshold) {
        const diff = top2 - marginThreshold;
        top2 -= diff;
        elemTransformOrigin.vertical += diff;
      } else if (marginThreshold !== null && bottom2 > heightThreshold) {
        const diff = bottom2 - heightThreshold;
        top2 -= diff;
        elemTransformOrigin.vertical += diff;
      }
      if (marginThreshold !== null && left2 < marginThreshold) {
        const diff = left2 - marginThreshold;
        left2 -= diff;
        elemTransformOrigin.horizontal += diff;
      } else if (right2 > widthThreshold) {
        const diff = right2 - widthThreshold;
        left2 -= diff;
        elemTransformOrigin.horizontal += diff;
      }
      return {
        top: `${Math.round(top2)}px`,
        left: `${Math.round(left2)}px`,
        transformOrigin: getTransformOriginValue(elemTransformOrigin)
      };
    }, [anchorEl, anchorReference, getAnchorOffset, getTransformOrigin, marginThreshold]);
    const [isPositioned, setIsPositioned] = React$1__namespace.useState(open);
    const setPositioningStyles = React$1__namespace.useCallback(() => {
      const element = paperRef.current;
      if (!element) {
        return;
      }
      const positioning = getPositioningStyle(element);
      if (positioning.top !== null) {
        element.style.top = positioning.top;
      }
      if (positioning.left !== null) {
        element.style.left = positioning.left;
      }
      element.style.transformOrigin = positioning.transformOrigin;
      setIsPositioned(true);
    }, [getPositioningStyle]);
    React$1__namespace.useEffect(() => {
      if (disableScrollLock) {
        window.addEventListener("scroll", setPositioningStyles);
      }
      return () => window.removeEventListener("scroll", setPositioningStyles);
    }, [anchorEl, disableScrollLock, setPositioningStyles]);
    const handleEntering = (element, isAppearing) => {
      if (onEntering) {
        onEntering(element, isAppearing);
      }
      setPositioningStyles();
    };
    const handleExited = () => {
      setIsPositioned(false);
    };
    React$1__namespace.useEffect(() => {
      if (open) {
        setPositioningStyles();
      }
    });
    React$1__namespace.useImperativeHandle(action, () => open ? {
      updatePosition: () => {
        setPositioningStyles();
      }
    } : null, [open, setPositioningStyles]);
    React$1__namespace.useEffect(() => {
      if (!open) {
        return void 0;
      }
      const handleResize = debounce$1(() => {
        setPositioningStyles();
      });
      const containerWindow = ownerWindow(anchorEl);
      containerWindow.addEventListener("resize", handleResize);
      return () => {
        handleResize.clear();
        containerWindow.removeEventListener("resize", handleResize);
      };
    }, [anchorEl, open, setPositioningStyles]);
    let transitionDuration = transitionDurationProp;
    if (transitionDurationProp === "auto" && !TransitionComponent.muiSupportAuto) {
      transitionDuration = void 0;
    }
    const container = containerProp || (anchorEl ? ownerDocument(resolveAnchorEl(anchorEl)).body : void 0);
    const RootSlot = (_slots$root = slots == null ? void 0 : slots.root) != null ? _slots$root : PopoverRoot;
    const PaperSlot = (_slots$paper = slots == null ? void 0 : slots.paper) != null ? _slots$paper : PopoverPaper;
    const paperProps = useSlotProps({
      elementType: PaperSlot,
      externalSlotProps: _extends$1({}, externalPaperSlotProps, {
        style: isPositioned ? externalPaperSlotProps.style : _extends$1({}, externalPaperSlotProps.style, {
          opacity: 0
        })
      }),
      additionalProps: {
        elevation,
        ref: handlePaperRef
      },
      ownerState,
      className: clsx(classes.paper, externalPaperSlotProps == null ? void 0 : externalPaperSlotProps.className)
    });
    const _useSlotProps = useSlotProps({
      elementType: RootSlot,
      externalSlotProps: (slotProps == null ? void 0 : slotProps.root) || {},
      externalForwardedProps: other,
      additionalProps: {
        ref,
        slotProps: {
          backdrop: {
            invisible: true
          }
        },
        container,
        open
      },
      ownerState,
      className: clsx(classes.root, className)
    }), {
      slotProps: rootSlotPropsProp
    } = _useSlotProps, rootProps = _objectWithoutPropertiesLoose(_useSlotProps, _excluded3);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RootSlot, _extends$1({}, rootProps, !isHostComponent(RootSlot) && {
      slotProps: rootSlotPropsProp,
      disableScrollLock
    }, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
        appear: true,
        in: open,
        onEntering: handleEntering,
        onExited: handleExited,
        timeout: transitionDuration
      }, TransitionProps, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaperSlot, _extends$1({}, paperProps, {
          children
        }))
      }))
    }));
  });
  const Popover$1 = Popover;
  function getMenuUtilityClass(slot) {
    return generateUtilityClass$2("MuiMenu", slot);
  }
  generateUtilityClasses$2("MuiMenu", ["root", "paper", "list"]);
  const _excluded$c = ["onEntering"], _excluded2$2 = ["autoFocus", "children", "className", "disableAutoFocusItem", "MenuListProps", "onClose", "open", "PaperProps", "PopoverClasses", "transitionDuration", "TransitionProps", "variant", "slots", "slotProps"];
  const RTL_ORIGIN = {
    vertical: "top",
    horizontal: "right"
  };
  const LTR_ORIGIN = {
    vertical: "top",
    horizontal: "left"
  };
  const useUtilityClasses$b = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"],
      paper: ["paper"],
      list: ["list"]
    };
    return composeClasses$1(slots, getMenuUtilityClass, classes);
  };
  const MenuRoot = styled(Popover$1, {
    shouldForwardProp: (prop) => rootShouldForwardProp$1(prop) || prop === "classes",
    name: "MuiMenu",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({});
  const MenuPaper = styled(PopoverPaper, {
    name: "MuiMenu",
    slot: "Paper",
    overridesResolver: (props, styles2) => styles2.paper
  })({
    // specZ: The maximum height of a simple menu should be one or more rows less than the view
    // height. This ensures a tappable area outside of the simple menu with which to dismiss
    // the menu.
    maxHeight: "calc(100% - 96px)",
    // Add iOS momentum scrolling for iOS < 13.0
    WebkitOverflowScrolling: "touch"
  });
  const MenuMenuList = styled(MenuList$1, {
    name: "MuiMenu",
    slot: "List",
    overridesResolver: (props, styles2) => styles2.list
  })({
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0
  });
  const Menu = /* @__PURE__ */ React$1__namespace.forwardRef(function Menu2(inProps, ref) {
    var _slots$paper, _slotProps$paper;
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiMenu"
    });
    const {
      autoFocus = true,
      children,
      className,
      disableAutoFocusItem = false,
      MenuListProps = {},
      onClose,
      open,
      PaperProps = {},
      PopoverClasses,
      transitionDuration = "auto",
      TransitionProps: {
        onEntering
      } = {},
      variant = "selectedMenu",
      slots = {},
      slotProps = {}
    } = props, TransitionProps = _objectWithoutPropertiesLoose(props.TransitionProps, _excluded$c), other = _objectWithoutPropertiesLoose(props, _excluded2$2);
    const theme = useTheme$1();
    const isRtl = theme.direction === "rtl";
    const ownerState = _extends$1({}, props, {
      autoFocus,
      disableAutoFocusItem,
      MenuListProps,
      onEntering,
      PaperProps,
      transitionDuration,
      TransitionProps,
      variant
    });
    const classes = useUtilityClasses$b(ownerState);
    const autoFocusItem = autoFocus && !disableAutoFocusItem && open;
    const menuListActionsRef = React$1__namespace.useRef(null);
    const handleEntering = (element, isAppearing) => {
      if (menuListActionsRef.current) {
        menuListActionsRef.current.adjustStyleForScrollbar(element, theme);
      }
      if (onEntering) {
        onEntering(element, isAppearing);
      }
    };
    const handleListKeyDown = (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        if (onClose) {
          onClose(event, "tabKeyDown");
        }
      }
    };
    let activeItemIndex = -1;
    React$1__namespace.Children.map(children, (child, index) => {
      if (!/* @__PURE__ */ React$1__namespace.isValidElement(child)) {
        return;
      }
      if (!child.props.disabled) {
        if (variant === "selectedMenu" && child.props.selected) {
          activeItemIndex = index;
        } else if (activeItemIndex === -1) {
          activeItemIndex = index;
        }
      }
    });
    const PaperSlot = (_slots$paper = slots.paper) != null ? _slots$paper : MenuPaper;
    const paperExternalSlotProps = (_slotProps$paper = slotProps.paper) != null ? _slotProps$paper : PaperProps;
    const rootSlotProps = useSlotProps({
      elementType: slots.root,
      externalSlotProps: slotProps.root,
      ownerState,
      className: [classes.root, className]
    });
    const paperSlotProps = useSlotProps({
      elementType: PaperSlot,
      externalSlotProps: paperExternalSlotProps,
      ownerState,
      className: classes.paper
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRoot, _extends$1({
      onClose,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: isRtl ? "right" : "left"
      },
      transformOrigin: isRtl ? RTL_ORIGIN : LTR_ORIGIN,
      slots: {
        paper: PaperSlot,
        root: slots.root
      },
      slotProps: {
        root: rootSlotProps,
        paper: paperSlotProps
      },
      open,
      ref,
      transitionDuration,
      TransitionProps: _extends$1({
        onEntering: handleEntering
      }, TransitionProps),
      ownerState
    }, other, {
      classes: PopoverClasses,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuMenuList, _extends$1({
        onKeyDown: handleListKeyDown,
        actions: menuListActionsRef,
        autoFocus: autoFocus && (activeItemIndex === -1 || disableAutoFocusItem),
        autoFocusItem,
        variant
      }, MenuListProps, {
        className: clsx(classes.list, MenuListProps.className),
        children
      }))
    }));
  });
  const Menu$1 = Menu;
  function getNativeSelectUtilityClasses(slot) {
    return generateUtilityClass$2("MuiNativeSelect", slot);
  }
  const nativeSelectClasses = generateUtilityClasses$2("MuiNativeSelect", ["root", "select", "multiple", "filled", "outlined", "standard", "disabled", "icon", "iconOpen", "iconFilled", "iconOutlined", "iconStandard", "nativeInput", "error"]);
  const nativeSelectClasses$1 = nativeSelectClasses;
  const _excluded$b = ["className", "disabled", "error", "IconComponent", "inputRef", "variant"];
  const useUtilityClasses$a = (ownerState) => {
    const {
      classes,
      variant,
      disabled,
      multiple,
      open,
      error
    } = ownerState;
    const slots = {
      select: ["select", variant, disabled && "disabled", multiple && "multiple", error && "error"],
      icon: ["icon", `icon${capitalize$1(variant)}`, open && "iconOpen", disabled && "disabled"]
    };
    return composeClasses$1(slots, getNativeSelectUtilityClasses, classes);
  };
  const nativeSelectSelectStyles = ({
    ownerState,
    theme
  }) => _extends$1({
    MozAppearance: "none",
    // Reset
    WebkitAppearance: "none",
    // Reset
    // When interacting quickly, the text can end up selected.
    // Native select can't be selected either.
    userSelect: "none",
    borderRadius: 0,
    // Reset
    cursor: "pointer",
    "&:focus": _extends$1({}, theme.vars ? {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.05)`
    } : {
      backgroundColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)"
    }, {
      borderRadius: 0
      // Reset Chrome style
    }),
    // Remove IE11 arrow
    "&::-ms-expand": {
      display: "none"
    },
    [`&.${nativeSelectClasses$1.disabled}`]: {
      cursor: "default"
    },
    "&[multiple]": {
      height: "auto"
    },
    "&:not([multiple]) option, &:not([multiple]) optgroup": {
      backgroundColor: (theme.vars || theme).palette.background.paper
    },
    // Bump specificity to allow extending custom inputs
    "&&&": {
      paddingRight: 24,
      minWidth: 16
      // So it doesn't collapse.
    }
  }, ownerState.variant === "filled" && {
    "&&&": {
      paddingRight: 32
    }
  }, ownerState.variant === "outlined" && {
    borderRadius: (theme.vars || theme).shape.borderRadius,
    "&:focus": {
      borderRadius: (theme.vars || theme).shape.borderRadius
      // Reset the reset for Chrome style
    },
    "&&&": {
      paddingRight: 32
    }
  });
  const NativeSelectSelect = styled("select", {
    name: "MuiNativeSelect",
    slot: "Select",
    shouldForwardProp: rootShouldForwardProp$1,
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.select, styles2[ownerState.variant], ownerState.error && styles2.error, {
        [`&.${nativeSelectClasses$1.multiple}`]: styles2.multiple
      }];
    }
  })(nativeSelectSelectStyles);
  const nativeSelectIconStyles = ({
    ownerState,
    theme
  }) => _extends$1({
    // We use a position absolute over a flexbox in order to forward the pointer events
    // to the input and to support wrapping tags..
    position: "absolute",
    right: 0,
    top: "calc(50% - .5em)",
    // Center vertically, height is 1em
    pointerEvents: "none",
    // Don't block pointer events on the select under the icon.
    color: (theme.vars || theme).palette.action.active,
    [`&.${nativeSelectClasses$1.disabled}`]: {
      color: (theme.vars || theme).palette.action.disabled
    }
  }, ownerState.open && {
    transform: "rotate(180deg)"
  }, ownerState.variant === "filled" && {
    right: 7
  }, ownerState.variant === "outlined" && {
    right: 7
  });
  const NativeSelectIcon = styled("svg", {
    name: "MuiNativeSelect",
    slot: "Icon",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.icon, ownerState.variant && styles2[`icon${capitalize$1(ownerState.variant)}`], ownerState.open && styles2.iconOpen];
    }
  })(nativeSelectIconStyles);
  const NativeSelectInput = /* @__PURE__ */ React$1__namespace.forwardRef(function NativeSelectInput2(props, ref) {
    const {
      className,
      disabled,
      error,
      IconComponent,
      inputRef,
      variant = "standard"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$b);
    const ownerState = _extends$1({}, props, {
      disabled,
      variant,
      error
    });
    const classes = useUtilityClasses$a(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(NativeSelectSelect, _extends$1({
        ownerState,
        className: clsx(classes.select, className),
        disabled,
        ref: inputRef || ref
      }, other)), props.multiple ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(NativeSelectIcon, {
        as: IconComponent,
        ownerState,
        className: classes.icon
      })]
    });
  });
  const NativeSelectInput$1 = NativeSelectInput;
  function getSelectUtilityClasses(slot) {
    return generateUtilityClass$2("MuiSelect", slot);
  }
  const selectClasses = generateUtilityClasses$2("MuiSelect", ["root", "select", "multiple", "filled", "outlined", "standard", "disabled", "focused", "icon", "iconOpen", "iconFilled", "iconOutlined", "iconStandard", "nativeInput", "error"]);
  var _span;
  const _excluded$a = ["aria-describedby", "aria-label", "autoFocus", "autoWidth", "children", "className", "defaultOpen", "defaultValue", "disabled", "displayEmpty", "error", "IconComponent", "inputRef", "labelId", "MenuProps", "multiple", "name", "onBlur", "onChange", "onClose", "onFocus", "onOpen", "open", "readOnly", "renderValue", "SelectDisplayProps", "tabIndex", "type", "value", "variant"];
  const SelectSelect = styled("div", {
    name: "MuiSelect",
    slot: "Select",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [
        // Win specificity over the input base
        {
          [`&.${selectClasses.select}`]: styles2.select
        },
        {
          [`&.${selectClasses.select}`]: styles2[ownerState.variant]
        },
        {
          [`&.${selectClasses.error}`]: styles2.error
        },
        {
          [`&.${selectClasses.multiple}`]: styles2.multiple
        }
      ];
    }
  })(nativeSelectSelectStyles, {
    // Win specificity over the input base
    [`&.${selectClasses.select}`]: {
      height: "auto",
      // Resets for multiple select with chips
      minHeight: "1.4375em",
      // Required for select\text-field height consistency
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden"
    }
  });
  const SelectIcon = styled("svg", {
    name: "MuiSelect",
    slot: "Icon",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.icon, ownerState.variant && styles2[`icon${capitalize$1(ownerState.variant)}`], ownerState.open && styles2.iconOpen];
    }
  })(nativeSelectIconStyles);
  const SelectNativeInput = styled("input", {
    shouldForwardProp: (prop) => slotShouldForwardProp(prop) && prop !== "classes",
    name: "MuiSelect",
    slot: "NativeInput",
    overridesResolver: (props, styles2) => styles2.nativeInput
  })({
    bottom: 0,
    left: 0,
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    width: "100%",
    boxSizing: "border-box"
  });
  function areEqualValues(a, b2) {
    if (typeof b2 === "object" && b2 !== null) {
      return a === b2;
    }
    return String(a) === String(b2);
  }
  function isEmpty(display) {
    return display == null || typeof display === "string" && !display.trim();
  }
  const useUtilityClasses$9 = (ownerState) => {
    const {
      classes,
      variant,
      disabled,
      multiple,
      open,
      error
    } = ownerState;
    const slots = {
      select: ["select", variant, disabled && "disabled", multiple && "multiple", error && "error"],
      icon: ["icon", `icon${capitalize$1(variant)}`, open && "iconOpen", disabled && "disabled"],
      nativeInput: ["nativeInput"]
    };
    return composeClasses$1(slots, getSelectUtilityClasses, classes);
  };
  const SelectInput = /* @__PURE__ */ React$1__namespace.forwardRef(function SelectInput2(props, ref) {
    var _MenuProps$slotProps;
    const {
      "aria-describedby": ariaDescribedby,
      "aria-label": ariaLabel,
      autoFocus,
      autoWidth,
      children,
      className,
      defaultOpen,
      defaultValue,
      disabled,
      displayEmpty,
      error = false,
      IconComponent,
      inputRef: inputRefProp,
      labelId,
      MenuProps = {},
      multiple,
      name,
      onBlur,
      onChange,
      onClose,
      onFocus,
      onOpen,
      open: openProp,
      readOnly,
      renderValue,
      SelectDisplayProps = {},
      tabIndex: tabIndexProp,
      value: valueProp,
      variant = "standard"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$a);
    const [value, setValueState] = useControlled({
      controlled: valueProp,
      default: defaultValue,
      name: "Select"
    });
    const [openState, setOpenState] = useControlled({
      controlled: openProp,
      default: defaultOpen,
      name: "Select"
    });
    const inputRef = React$1__namespace.useRef(null);
    const displayRef = React$1__namespace.useRef(null);
    const [displayNode, setDisplayNode] = React$1__namespace.useState(null);
    const {
      current: isOpenControlled
    } = React$1__namespace.useRef(openProp != null);
    const [menuMinWidthState, setMenuMinWidthState] = React$1__namespace.useState();
    const handleRef = useForkRef(ref, inputRefProp);
    const handleDisplayRef = React$1__namespace.useCallback((node2) => {
      displayRef.current = node2;
      if (node2) {
        setDisplayNode(node2);
      }
    }, []);
    const anchorElement = displayNode == null ? void 0 : displayNode.parentNode;
    React$1__namespace.useImperativeHandle(handleRef, () => ({
      focus: () => {
        displayRef.current.focus();
      },
      node: inputRef.current,
      value
    }), [value]);
    React$1__namespace.useEffect(() => {
      if (defaultOpen && openState && displayNode && !isOpenControlled) {
        setMenuMinWidthState(autoWidth ? null : anchorElement.clientWidth);
        displayRef.current.focus();
      }
    }, [displayNode, autoWidth]);
    React$1__namespace.useEffect(() => {
      if (autoFocus) {
        displayRef.current.focus();
      }
    }, [autoFocus]);
    React$1__namespace.useEffect(() => {
      if (!labelId) {
        return void 0;
      }
      const label = ownerDocument(displayRef.current).getElementById(labelId);
      if (label) {
        const handler = () => {
          if (getSelection().isCollapsed) {
            displayRef.current.focus();
          }
        };
        label.addEventListener("click", handler);
        return () => {
          label.removeEventListener("click", handler);
        };
      }
      return void 0;
    }, [labelId]);
    const update = (open2, event) => {
      if (open2) {
        if (onOpen) {
          onOpen(event);
        }
      } else if (onClose) {
        onClose(event);
      }
      if (!isOpenControlled) {
        setMenuMinWidthState(autoWidth ? null : anchorElement.clientWidth);
        setOpenState(open2);
      }
    };
    const handleMouseDown = (event) => {
      if (event.button !== 0) {
        return;
      }
      event.preventDefault();
      displayRef.current.focus();
      update(true, event);
    };
    const handleClose = (event) => {
      update(false, event);
    };
    const childrenArray = React$1__namespace.Children.toArray(children);
    const handleChange = (event) => {
      const child = childrenArray.find((childItem) => childItem.props.value === event.target.value);
      if (child === void 0) {
        return;
      }
      setValueState(child.props.value);
      if (onChange) {
        onChange(event, child);
      }
    };
    const handleItemClick = (child) => (event) => {
      let newValue;
      if (!event.currentTarget.hasAttribute("tabindex")) {
        return;
      }
      if (multiple) {
        newValue = Array.isArray(value) ? value.slice() : [];
        const itemIndex = value.indexOf(child.props.value);
        if (itemIndex === -1) {
          newValue.push(child.props.value);
        } else {
          newValue.splice(itemIndex, 1);
        }
      } else {
        newValue = child.props.value;
      }
      if (child.props.onClick) {
        child.props.onClick(event);
      }
      if (value !== newValue) {
        setValueState(newValue);
        if (onChange) {
          const nativeEvent = event.nativeEvent || event;
          const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);
          Object.defineProperty(clonedEvent, "target", {
            writable: true,
            value: {
              value: newValue,
              name
            }
          });
          onChange(clonedEvent, child);
        }
      }
      if (!multiple) {
        update(false, event);
      }
    };
    const handleKeyDown2 = (event) => {
      if (!readOnly) {
        const validKeys = [
          " ",
          "ArrowUp",
          "ArrowDown",
          // The native select doesn't respond to enter on macOS, but it's recommended by
          // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
          "Enter"
        ];
        if (validKeys.indexOf(event.key) !== -1) {
          event.preventDefault();
          update(true, event);
        }
      }
    };
    const open = displayNode !== null && openState;
    const handleBlur = (event) => {
      if (!open && onBlur) {
        Object.defineProperty(event, "target", {
          writable: true,
          value: {
            value,
            name
          }
        });
        onBlur(event);
      }
    };
    delete other["aria-invalid"];
    let display;
    let displaySingle;
    const displayMultiple = [];
    let computeDisplay = false;
    if (isFilled({
      value
    }) || displayEmpty) {
      if (renderValue) {
        display = renderValue(value);
      } else {
        computeDisplay = true;
      }
    }
    const items = childrenArray.map((child) => {
      if (!/* @__PURE__ */ React$1__namespace.isValidElement(child)) {
        return null;
      }
      let selected;
      if (multiple) {
        if (!Array.isArray(value)) {
          throw new Error(formatMuiErrorMessage$1(2));
        }
        selected = value.some((v2) => areEqualValues(v2, child.props.value));
        if (selected && computeDisplay) {
          displayMultiple.push(child.props.children);
        }
      } else {
        selected = areEqualValues(value, child.props.value);
        if (selected && computeDisplay) {
          displaySingle = child.props.children;
        }
      }
      return /* @__PURE__ */ React$1__namespace.cloneElement(child, {
        "aria-selected": selected ? "true" : "false",
        onClick: handleItemClick(child),
        onKeyUp: (event) => {
          if (event.key === " ") {
            event.preventDefault();
          }
          if (child.props.onKeyUp) {
            child.props.onKeyUp(event);
          }
        },
        role: "option",
        selected,
        value: void 0,
        // The value is most likely not a valid HTML attribute.
        "data-value": child.props.value
        // Instead, we provide it as a data attribute.
      });
    });
    if (computeDisplay) {
      if (multiple) {
        if (displayMultiple.length === 0) {
          display = null;
        } else {
          display = displayMultiple.reduce((output, child, index) => {
            output.push(child);
            if (index < displayMultiple.length - 1) {
              output.push(", ");
            }
            return output;
          }, []);
        }
      } else {
        display = displaySingle;
      }
    }
    let menuMinWidth = menuMinWidthState;
    if (!autoWidth && isOpenControlled && displayNode) {
      menuMinWidth = anchorElement.clientWidth;
    }
    let tabIndex;
    if (typeof tabIndexProp !== "undefined") {
      tabIndex = tabIndexProp;
    } else {
      tabIndex = disabled ? null : 0;
    }
    const buttonId = SelectDisplayProps.id || (name ? `mui-component-select-${name}` : void 0);
    const ownerState = _extends$1({}, props, {
      variant,
      value,
      open,
      error
    });
    const classes = useUtilityClasses$9(ownerState);
    const paperProps = _extends$1({}, MenuProps.PaperProps, (_MenuProps$slotProps = MenuProps.slotProps) == null ? void 0 : _MenuProps$slotProps.paper);
    const listboxId = useId();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React$1__namespace.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(SelectSelect, _extends$1({
        ref: handleDisplayRef,
        tabIndex,
        role: "combobox",
        "aria-controls": listboxId,
        "aria-disabled": disabled ? "true" : void 0,
        "aria-expanded": open ? "true" : "false",
        "aria-haspopup": "listbox",
        "aria-label": ariaLabel,
        "aria-labelledby": [labelId, buttonId].filter(Boolean).join(" ") || void 0,
        "aria-describedby": ariaDescribedby,
        onKeyDown: handleKeyDown2,
        onMouseDown: disabled || readOnly ? null : handleMouseDown,
        onBlur: handleBlur,
        onFocus
      }, SelectDisplayProps, {
        ownerState,
        className: clsx(SelectDisplayProps.className, classes.select, className),
        id: buttonId,
        children: isEmpty(display) ? (
          // notranslate needed while Google Translate will not fix zero-width space issue
          _span || (_span = /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
            className: "notranslate",
            children: "​"
          }))
        ) : display
      })), /* @__PURE__ */ jsxRuntimeExports.jsx(SelectNativeInput, _extends$1({
        "aria-invalid": error,
        value: Array.isArray(value) ? value.join(",") : value,
        name,
        ref: inputRef,
        "aria-hidden": true,
        onChange: handleChange,
        tabIndex: -1,
        disabled,
        className: classes.nativeInput,
        autoFocus,
        ownerState
      }, other)), /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, {
        as: IconComponent,
        className: classes.icon,
        ownerState
      }), /* @__PURE__ */ jsxRuntimeExports.jsx(Menu$1, _extends$1({
        id: `menu-${name || ""}`,
        anchorEl: anchorElement,
        open,
        onClose: handleClose,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center"
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      }, MenuProps, {
        MenuListProps: _extends$1({
          "aria-labelledby": labelId,
          role: "listbox",
          "aria-multiselectable": multiple ? "true" : void 0,
          disableListWrap: true,
          id: listboxId
        }, MenuProps.MenuListProps),
        slotProps: _extends$1({}, MenuProps.slotProps, {
          paper: _extends$1({}, paperProps, {
            style: _extends$1({
              minWidth: menuMinWidth
            }, paperProps != null ? paperProps.style : null)
          })
        }),
        children: items
      }))]
    });
  });
  const SelectInput$1 = SelectInput;
  const _excluded$9 = ["autoWidth", "children", "classes", "className", "defaultOpen", "displayEmpty", "IconComponent", "id", "input", "inputProps", "label", "labelId", "MenuProps", "multiple", "native", "onClose", "onOpen", "open", "renderValue", "SelectDisplayProps", "variant"], _excluded2$1 = ["root"];
  const useUtilityClasses$8 = (ownerState) => {
    const {
      classes
    } = ownerState;
    return classes;
  };
  const styledRootConfig = {
    name: "MuiSelect",
    overridesResolver: (props, styles2) => styles2.root,
    shouldForwardProp: (prop) => rootShouldForwardProp$1(prop) && prop !== "variant",
    slot: "Root"
  };
  const StyledInput = styled(Input$1, styledRootConfig)("");
  const StyledOutlinedInput = styled(OutlinedInput$1, styledRootConfig)("");
  const StyledFilledInput = styled(FilledInput$1, styledRootConfig)("");
  const Select = /* @__PURE__ */ React$1__namespace.forwardRef(function Select2(inProps, ref) {
    const props = useThemeProps$1({
      name: "MuiSelect",
      props: inProps
    });
    const {
      autoWidth = false,
      children,
      classes: classesProp = {},
      className,
      defaultOpen = false,
      displayEmpty = false,
      IconComponent = ArrowDropDownIcon,
      id,
      input: input2,
      inputProps,
      label,
      labelId,
      MenuProps,
      multiple = false,
      native = false,
      onClose,
      onOpen,
      open,
      renderValue,
      SelectDisplayProps,
      variant: variantProp = "outlined"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$9);
    const inputComponent = native ? NativeSelectInput$1 : SelectInput$1;
    const muiFormControl = useFormControl();
    const fcs = formControlState({
      props,
      muiFormControl,
      states: ["variant", "error"]
    });
    const variant = fcs.variant || variantProp;
    const ownerState = _extends$1({}, props, {
      variant,
      classes: classesProp
    });
    const classes = useUtilityClasses$8(ownerState);
    const restOfClasses = _objectWithoutPropertiesLoose(classes, _excluded2$1);
    const InputComponent = input2 || {
      standard: /* @__PURE__ */ jsxRuntimeExports.jsx(StyledInput, {
        ownerState
      }),
      outlined: /* @__PURE__ */ jsxRuntimeExports.jsx(StyledOutlinedInput, {
        label,
        ownerState
      }),
      filled: /* @__PURE__ */ jsxRuntimeExports.jsx(StyledFilledInput, {
        ownerState
      })
    }[variant];
    const inputComponentRef = useForkRef(ref, InputComponent.ref);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(React$1__namespace.Fragment, {
      children: /* @__PURE__ */ React$1__namespace.cloneElement(InputComponent, _extends$1({
        // Most of the logic is implemented in `SelectInput`.
        // The `Select` component is a simple API wrapper to expose something better to play with.
        inputComponent,
        inputProps: _extends$1({
          children,
          error: fcs.error,
          IconComponent,
          variant,
          type: void 0,
          // We render a select. We can ignore the type provided by the `Input`.
          multiple
        }, native ? {
          id
        } : {
          autoWidth,
          defaultOpen,
          displayEmpty,
          labelId,
          MenuProps,
          onClose,
          onOpen,
          open,
          renderValue,
          SelectDisplayProps: _extends$1({
            id
          }, SelectDisplayProps)
        }, inputProps, {
          classes: inputProps ? deepmerge$1(restOfClasses, inputProps.classes) : restOfClasses
        }, input2 ? input2.props.inputProps : {})
      }, (multiple && native || displayEmpty) && variant === "outlined" ? {
        notched: true
      } : {}, {
        ref: inputComponentRef,
        className: clsx(InputComponent.props.className, className, classes.root)
      }, !input2 && {
        variant
      }, other))
    });
  });
  Select.muiName = "Select";
  const Select$1 = Select;
  function getTextFieldUtilityClass(slot) {
    return generateUtilityClass$2("MuiTextField", slot);
  }
  generateUtilityClasses$2("MuiTextField", ["root"]);
  const _excluded$8 = ["autoComplete", "autoFocus", "children", "className", "color", "defaultValue", "disabled", "error", "FormHelperTextProps", "fullWidth", "helperText", "id", "InputLabelProps", "inputProps", "InputProps", "inputRef", "label", "maxRows", "minRows", "multiline", "name", "onBlur", "onChange", "onFocus", "placeholder", "required", "rows", "select", "SelectProps", "type", "value", "variant"];
  const variantComponent = {
    standard: Input$1,
    filled: FilledInput$1,
    outlined: OutlinedInput$1
  };
  const useUtilityClasses$7 = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"]
    };
    return composeClasses$1(slots, getTextFieldUtilityClass, classes);
  };
  const TextFieldRoot = styled(FormControl$1, {
    name: "MuiTextField",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({});
  const TextField = /* @__PURE__ */ React$1__namespace.forwardRef(function TextField2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiTextField"
    });
    const {
      autoComplete,
      autoFocus = false,
      children,
      className,
      color: color2 = "primary",
      defaultValue,
      disabled = false,
      error = false,
      FormHelperTextProps,
      fullWidth = false,
      helperText,
      id: idOverride,
      InputLabelProps,
      inputProps,
      InputProps,
      inputRef,
      label,
      maxRows,
      minRows,
      multiline = false,
      name,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      required = false,
      rows,
      select = false,
      SelectProps,
      type,
      value,
      variant = "outlined"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$8);
    const ownerState = _extends$1({}, props, {
      autoFocus,
      color: color2,
      disabled,
      error,
      fullWidth,
      multiline,
      required,
      select,
      variant
    });
    const classes = useUtilityClasses$7(ownerState);
    const InputMore = {};
    if (variant === "outlined") {
      if (InputLabelProps && typeof InputLabelProps.shrink !== "undefined") {
        InputMore.notched = InputLabelProps.shrink;
      }
      InputMore.label = label;
    }
    if (select) {
      if (!SelectProps || !SelectProps.native) {
        InputMore.id = void 0;
      }
      InputMore["aria-describedby"] = void 0;
    }
    const id = useId(idOverride);
    const helperTextId = helperText && id ? `${id}-helper-text` : void 0;
    const inputLabelId = label && id ? `${id}-label` : void 0;
    const InputComponent = variantComponent[variant];
    const InputElement = /* @__PURE__ */ jsxRuntimeExports.jsx(InputComponent, _extends$1({
      "aria-describedby": helperTextId,
      autoComplete,
      autoFocus,
      defaultValue,
      fullWidth,
      multiline,
      name,
      rows,
      maxRows,
      minRows,
      type,
      value,
      id,
      inputRef,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      inputProps
    }, InputMore, InputProps));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(TextFieldRoot, _extends$1({
      className: clsx(classes.root, className),
      disabled,
      error,
      fullWidth,
      ref,
      required,
      color: color2,
      variant,
      ownerState
    }, other, {
      children: [label != null && label !== "" && /* @__PURE__ */ jsxRuntimeExports.jsx(InputLabel$1, _extends$1({
        htmlFor: id,
        id: inputLabelId
      }, InputLabelProps, {
        children: label
      })), select ? /* @__PURE__ */ jsxRuntimeExports.jsx(Select$1, _extends$1({
        "aria-describedby": helperTextId,
        id,
        labelId: inputLabelId,
        value,
        input: InputElement
      }, SelectProps, {
        children
      })) : InputElement, helperText && /* @__PURE__ */ jsxRuntimeExports.jsx(FormHelperText$1, _extends$1({
        id: helperTextId
      }, FormHelperTextProps, {
        children: helperText
      }))]
    }));
  });
  const TextField$1 = TextField;
  function getToolbarUtilityClass(slot) {
    return generateUtilityClass$2("MuiToolbar", slot);
  }
  generateUtilityClasses$2("MuiToolbar", ["root", "gutters", "regular", "dense"]);
  const _excluded$7 = ["className", "component", "disableGutters", "variant"];
  const useUtilityClasses$6 = (ownerState) => {
    const {
      classes,
      disableGutters,
      variant
    } = ownerState;
    const slots = {
      root: ["root", !disableGutters && "gutters", variant]
    };
    return composeClasses$1(slots, getToolbarUtilityClass, classes);
  };
  const ToolbarRoot = styled("div", {
    name: "MuiToolbar",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, !ownerState.disableGutters && styles2.gutters, styles2[ownerState.variant]];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    position: "relative",
    display: "flex",
    alignItems: "center"
  }, !ownerState.disableGutters && {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }, ownerState.variant === "dense" && {
    minHeight: 48
  }), ({
    theme,
    ownerState
  }) => ownerState.variant === "regular" && theme.mixins.toolbar);
  const Toolbar = /* @__PURE__ */ React$1__namespace.forwardRef(function Toolbar2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiToolbar"
    });
    const {
      className,
      component = "div",
      disableGutters = false,
      variant = "regular"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$7);
    const ownerState = _extends$1({}, props, {
      component,
      disableGutters,
      variant
    });
    const classes = useUtilityClasses$6(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarRoot, _extends$1({
      as: component,
      className: clsx(classes.root, className),
      ref,
      ownerState
    }, other));
  });
  const Toolbar$1 = Toolbar;
  function arraySome$2(array, predicate) {
    var index = -1, length2 = array == null ? 0 : array.length;
    while (++index < length2) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  var _arraySome = arraySome$2;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd$1(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }
  var _setCacheAdd = setCacheAdd$1;
  function setCacheHas$1(value) {
    return this.__data__.has(value);
  }
  var _setCacheHas = setCacheHas$1;
  var MapCache = _MapCache, setCacheAdd = _setCacheAdd, setCacheHas = _setCacheHas;
  function SetCache$1(values2) {
    var index = -1, length2 = values2 == null ? 0 : values2.length;
    this.__data__ = new MapCache();
    while (++index < length2) {
      this.add(values2[index]);
    }
  }
  SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd;
  SetCache$1.prototype.has = setCacheHas;
  var _SetCache = SetCache$1;
  function cacheHas$1(cache2, key) {
    return cache2.has(key);
  }
  var _cacheHas = cacheHas$1;
  var SetCache = _SetCache, arraySome$1 = _arraySome, cacheHas = _cacheHas;
  var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
  function equalArrays$2(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome$1(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  var _equalArrays = equalArrays$2;
  function mapToArray$1(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  var _mapToArray = mapToArray$1;
  function setToArray$1(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var _setToArray = setToArray$1;
  var Symbol$2 = _Symbol, Uint8Array = _Uint8Array, eq = eq_1, equalArrays$1 = _equalArrays, mapToArray = _mapToArray, setToArray = _setToArray;
  var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
  var boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag$1 = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag$1 = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]";
  var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : void 0;
  function equalByTag$1(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag$1:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag$1:
        var convert = mapToArray;
      case setTag$1:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$2;
        stack.set(object, other);
        var result = equalArrays$1(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  var _equalByTag = equalByTag$1;
  function arrayPush$1(array, values2) {
    var index = -1, length2 = values2.length, offset2 = array.length;
    while (++index < length2) {
      array[offset2 + index] = values2[index];
    }
    return array;
  }
  var _arrayPush = arrayPush$1;
  var arrayPush = _arrayPush, isArray$3 = isArray_1;
  function baseGetAllKeys$1(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray$3(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  var _baseGetAllKeys = baseGetAllKeys$1;
  function arrayFilter$1(array, predicate) {
    var index = -1, length2 = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length2) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  var _arrayFilter = arrayFilter$1;
  function stubArray$1() {
    return [];
  }
  var stubArray_1 = stubArray$1;
  var arrayFilter = _arrayFilter, stubArray = stubArray_1;
  var objectProto$2 = Object.prototype;
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols$1 = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };
  var _getSymbols = getSymbols$1;
  var baseGetAllKeys = _baseGetAllKeys, getSymbols = _getSymbols, keys$2 = keys_1;
  function getAllKeys$1(object) {
    return baseGetAllKeys(object, keys$2, getSymbols);
  }
  var _getAllKeys = getAllKeys$1;
  var getAllKeys = _getAllKeys;
  var COMPARE_PARTIAL_FLAG$3 = 1;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function equalObjects$1(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  var _equalObjects = equalObjects$1;
  var getNative$3 = _getNative, root$3 = _root;
  var DataView$1 = getNative$3(root$3, "DataView");
  var _DataView = DataView$1;
  var getNative$2 = _getNative, root$2 = _root;
  var Promise$2 = getNative$2(root$2, "Promise");
  var _Promise = Promise$2;
  var getNative$1 = _getNative, root$1 = _root;
  var Set$2 = getNative$1(root$1, "Set");
  var _Set = Set$2;
  var getNative = _getNative, root = _root;
  var WeakMap$2 = getNative(root, "WeakMap");
  var _WeakMap = WeakMap$2;
  var DataView = _DataView, Map$1 = _Map, Promise$1 = _Promise, Set$1 = _Set, WeakMap$1 = _WeakMap, baseGetTag = _baseGetTag, toSource = _toSource;
  var mapTag = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
  var dataViewTag = "[object DataView]";
  var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
  var getTag$1 = baseGetTag;
  if (DataView && getTag$1(new DataView(new ArrayBuffer(1))) != dataViewTag || Map$1 && getTag$1(new Map$1()) != mapTag || Promise$1 && getTag$1(Promise$1.resolve()) != promiseTag || Set$1 && getTag$1(new Set$1()) != setTag || WeakMap$1 && getTag$1(new WeakMap$1()) != weakMapTag) {
    getTag$1 = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag$1 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  var _getTag = getTag$1;
  var Stack$1 = _Stack, equalArrays = _equalArrays, equalByTag = _equalByTag, equalObjects = _equalObjects, getTag = _getTag, isArray$2 = isArray_1, isBuffer = isBufferExports, isTypedArray = isTypedArray_1;
  var COMPARE_PARTIAL_FLAG$2 = 1;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function baseIsEqualDeep$1(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray$2(object), othIsArr = isArray$2(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack$1());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack$1());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack$1());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }
  var _baseIsEqualDeep = baseIsEqualDeep$1;
  var baseIsEqualDeep = _baseIsEqualDeep, isObjectLike = isObjectLike_1;
  function baseIsEqual$3(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual$3, stack);
  }
  var _baseIsEqual = baseIsEqual$3;
  var Stack = _Stack, baseIsEqual$2 = _baseIsEqual;
  var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
  function baseIsMatch$1(object, source, matchData, customizer) {
    var index = matchData.length, length2 = index, noCustomizer = !customizer;
    if (object == null) {
      return !length2;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length2) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual$2(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  var _baseIsMatch = baseIsMatch$1;
  var isObject = isObject_1;
  function isStrictComparable$2(value) {
    return value === value && !isObject(value);
  }
  var _isStrictComparable = isStrictComparable$2;
  var isStrictComparable$1 = _isStrictComparable, keys$1 = keys_1;
  function getMatchData$1(object) {
    var result = keys$1(object), length2 = result.length;
    while (length2--) {
      var key = result[length2], value = object[key];
      result[length2] = [key, value, isStrictComparable$1(value)];
    }
    return result;
  }
  var _getMatchData = getMatchData$1;
  function matchesStrictComparable$2(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  var _matchesStrictComparable = matchesStrictComparable$2;
  var baseIsMatch = _baseIsMatch, getMatchData = _getMatchData, matchesStrictComparable$1 = _matchesStrictComparable;
  function baseMatches$1(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable$1(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  var _baseMatches = baseMatches$1;
  var castPath = _castPath, toKey$2 = _toKey;
  function baseGet$2(object, path) {
    path = castPath(path, object);
    var index = 0, length2 = path.length;
    while (object != null && index < length2) {
      object = object[toKey$2(path[index++])];
    }
    return index && index == length2 ? object : void 0;
  }
  var _baseGet = baseGet$2;
  var baseGet$1 = _baseGet;
  function get$1(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet$1(object, path);
    return result === void 0 ? defaultValue : result;
  }
  var get_1 = get$1;
  function baseHasIn$1(object, key) {
    return object != null && key in Object(object);
  }
  var _baseHasIn = baseHasIn$1;
  var baseHasIn = _baseHasIn, hasPath = _hasPath;
  function hasIn$1(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  var hasIn_1 = hasIn$1;
  var baseIsEqual$1 = _baseIsEqual, get = get_1, hasIn = hasIn_1, isKey$1 = _isKey, isStrictComparable = _isStrictComparable, matchesStrictComparable = _matchesStrictComparable, toKey$1 = _toKey;
  var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty$1(path, srcValue) {
    if (isKey$1(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey$1(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual$1(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }
  var _baseMatchesProperty = baseMatchesProperty$1;
  function baseProperty$1(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  var _baseProperty = baseProperty$1;
  var baseGet = _baseGet;
  function basePropertyDeep$1(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  var _basePropertyDeep = basePropertyDeep$1;
  var baseProperty = _baseProperty, basePropertyDeep = _basePropertyDeep, isKey = _isKey, toKey = _toKey;
  function property$1(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  var property_1 = property$1;
  var baseMatches = _baseMatches, baseMatchesProperty = _baseMatchesProperty, identity = identity_1, isArray$1 = isArray_1, property = property_1;
  function baseIteratee$1(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray$1(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  var _baseIteratee = baseIteratee$1;
  var baseFor = _baseFor, keys = keys_1;
  function baseForOwn$1(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }
  var _baseForOwn = baseForOwn$1;
  var isArrayLike = isArrayLike_1;
  function createBaseEach$1(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length2 = collection.length, index = fromRight ? length2 : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length2) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  var _createBaseEach = createBaseEach$1;
  var baseForOwn = _baseForOwn, createBaseEach = _createBaseEach;
  var baseEach$1 = createBaseEach(baseForOwn);
  var _baseEach = baseEach$1;
  var baseEach = _baseEach;
  function baseSome$1(collection, predicate) {
    var result;
    baseEach(collection, function(value, index, collection2) {
      result = predicate(value, index, collection2);
      return !result;
    });
    return !!result;
  }
  var _baseSome = baseSome$1;
  var arraySome = _arraySome, baseIteratee = _baseIteratee, baseSome = _baseSome, isArray = isArray_1, isIterateeCall = _isIterateeCall;
  function some(collection, predicate, guard) {
    var func = isArray(collection) ? arraySome : baseSome;
    if (guard && isIterateeCall(collection, predicate, guard)) {
      predicate = void 0;
    }
    return func(collection, baseIteratee(predicate));
  }
  var some_1 = some;
  const lodashSome = /* @__PURE__ */ getDefaultExportFromCjs(some_1);
  function UserComparisonDialog({ open, toggleOpen }) {
    const [userSuggestions, setUserSuggestions] = React$1.useState([]);
    const [userOptions, setUserOptions] = React$1.useState([]);
    const [leftUser, setLeftUser] = React$1.useState(null);
    const [leftInputUser, setLeftInputUser] = React$1.useState("");
    const [rightUser, setRightUser] = React$1.useState(null);
    const [rightInputUser, setRightInputUser] = React$1.useState("");
    const [comparisonData, setComparisonData] = React$1.useState([]);
    React$1.useEffect(() => {
      const userProfile = getPreloadedUserProfile();
      if (userProfile.username && !lodashSome(userSuggestions, ["username", userProfile.username])) {
        setUserSuggestions([
          {
            id: userProfile.id,
            username: userProfile.username,
            name: userProfile.name || userProfile.username,
            avatarTemplate: userProfile.avatar_template
          }
        ]);
        setLeftUser({
          id: userProfile.id,
          username: userProfile.username,
          name: userProfile.name || userProfile.username,
          avatarTemplate: userProfile.avatar_template
        });
      }
    }, []);
    React$1.useEffect(() => {
      let active = true;
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        if (leftInputUser) {
          fetchSearchUsers({ term: leftInputUser }, csrfToken).then((res) => {
            if (active) {
              const newOptions = res.users.map((user) => {
                return {
                  id: user.id,
                  username: user.username,
                  name: user.name || user.username,
                  avatarTemplate: user.avatar_template
                };
              });
              setUserOptions([...newOptions]);
            }
          }).catch((err) => console.error(err));
        } else {
          setUserOptions([...userSuggestions]);
        }
      }
      return () => {
        active = false;
      };
    }, [leftInputUser]);
    React$1.useEffect(() => {
      let active = true;
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        if (rightInputUser) {
          fetchSearchUsers({ term: rightInputUser }, csrfToken).then((res) => {
            if (active) {
              const newOptions = res.users.map((user) => {
                return {
                  id: user.id,
                  username: user.username,
                  name: user.name || user.username,
                  avatarTemplate: user.avatar_template
                };
              });
              setUserOptions([...newOptions]);
            }
          }).catch((err) => console.error(err));
        } else {
          setUserOptions([...userSuggestions]);
        }
      }
      return () => {
        active = false;
      };
    }, [rightInputUser]);
    const trimUserSummaryData = (dataLeftUser, dataRightUser) => {
      const { user_summary: leftUS } = dataLeftUser;
      const { user_summary: rightUS } = dataRightUser;
      const newDataList = [
        { id: "days_visited", title: "访问天数", leftValue: leftUS.days_visited, rightValue: rightUS.days_visited },
        { id: "time_read", title: "阅读时间", leftValue: leftUS.time_read, rightValue: rightUS.time_read },
        {
          id: "recent_time_read",
          title: "阅读时间（最近）",
          leftValue: leftUS.recent_time_read,
          rightValue: rightUS.recent_time_read
        },
        {
          id: "topics_entered",
          title: "浏览的话题",
          leftValue: leftUS.topics_entered,
          rightValue: rightUS.topics_entered
        },
        {
          id: "posts_read_count",
          title: "已读帖子",
          leftValue: leftUS.posts_read_count,
          rightValue: rightUS.posts_read_count
        },
        { id: "likes_given", title: "已送出赞", leftValue: leftUS.likes_given, rightValue: rightUS.likes_given },
        { id: "likes_received", title: "已收到赞", leftValue: leftUS.likes_received, rightValue: rightUS.likes_received },
        { id: "topic_count", title: "创建的话题", leftValue: leftUS.topic_count, rightValue: rightUS.topic_count },
        { id: "post_count", title: "创建的帖子", leftValue: leftUS.post_count, rightValue: rightUS.post_count },
        { id: "solved_count", title: "解决问题数", leftValue: leftUS.solved_count, rightValue: rightUS.solved_count }
      ];
      const resultData = newDataList.map((item) => {
        if (item.leftValue > item.rightValue) {
          return {
            ...item,
            leftPercent: 100,
            rightPercent: item.rightValue / item.leftValue * 100,
            leftColor: "success",
            rightColor: "primary"
          };
        }
        if (item.leftValue < item.rightValue) {
          return {
            ...item,
            leftPercent: item.leftValue / item.rightValue * 100,
            rightPercent: 100,
            leftColor: "primary",
            rightColor: "success"
          };
        }
        return {
          ...item,
          leftPercent: 100,
          rightPercent: 100,
          leftColor: "primary",
          rightColor: "primary"
        };
      });
      return resultData;
    };
    const handlePK = async () => {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        if (leftUser && rightUser) {
          const leftUserData = await fetchGetUserSummary(leftUser.username, csrfToken);
          const rightUserData = await fetchGetUserSummary(rightUser.username, csrfToken);
          if (leftUserData && !lodashSome(userSuggestions, ["username", leftUser.username])) {
            setUserSuggestions((prevState) => [
              {
                id: leftUser.id,
                username: leftUser.username,
                name: leftUser.name || leftUser.username,
                avatarTemplate: leftUser.avatarTemplate
              },
              ...prevState
            ]);
          }
          if (rightUserData && !lodashSome(userSuggestions, ["username", rightUser.username])) {
            setUserSuggestions((prevState) => [
              {
                id: rightUser.id,
                username: rightUser.username,
                name: rightUser.name || rightUser.username,
                avatarTemplate: rightUser.avatarTemplate
              },
              ...prevState
            ]);
          }
          const trimedUserSummaryData = trimUserSummaryData(leftUserData, rightUserData);
          setComparisonData(trimedUserSummaryData);
        }
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog$1, { open, onClose: () => toggleOpen(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Toolbar$1, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { ml: 2, flex: 1 }, variant: "h6", component: "div", children: "佬友PK一下" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton$1, { edge: "end", color: "inherit", onClick: () => toggleOpen(false), "aria-label": "close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(default_1, {}) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent$1, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-around", alignItems: "center", p: 3 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "280px", mr: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Autocomplete$1,
            {
              id: "pk-user-left",
              getOptionLabel: (option) => {
                if (typeof option === "string") {
                  return option;
                }
                return option.name;
              },
              filterOptions: (options) => options,
              options: userOptions.length > 0 ? userOptions : userSuggestions,
              value: leftUser,
              noOptionsText: "未选择用户",
              onChange: (event, newValue) => {
                setLeftUser(newValue);
              },
              onInputChange: (event, value) => setLeftInputUser(value),
              renderInput: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(TextField$1, { ...params, label: "挑战者" }),
              renderOption: (props, option) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid$1, { container: true, alignItems: "center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid$1, { item: true, sx: { display: "flex", width: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Avatar$1,
                  {
                    alt: option.name,
                    src: option.avatarTemplate.replace("{size}", "96"),
                    sx: { width: 24, height: 24 }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid$1, { item: true, sx: { ml: "4px", width: "calc(100% - 28px)", wordWrap: "break-word" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle1", color: "dark", fontSize: 12, children: option.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", color: "secondary", fontSize: 10, children: option.username })
                ] })
              ] }) })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "140px", textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handlePK(), children: "VS" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "280px", ml: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Autocomplete$1,
            {
              id: "pk-user-right",
              getOptionLabel: (option) => {
                if (typeof option === "string") {
                  return option;
                }
                return option.name;
              },
              filterOptions: (options) => options,
              options: userOptions.length > 0 ? userOptions : userSuggestions,
              value: rightUser,
              noOptionsText: "未选择用户",
              onChange: (event, newValue) => {
                setRightUser(newValue);
              },
              onInputChange: (event, value) => setRightInputUser(value),
              renderInput: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(TextField$1, { ...params, label: "守擂者" }),
              renderOption: (props, option) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid$1, { container: true, alignItems: "center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Grid$1, { item: true, sx: { display: "flex", width: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Avatar$1,
                  {
                    alt: option.name,
                    src: option.avatarTemplate.replace("{size}", "96"),
                    sx: { width: 24, height: 24 }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid$1, { item: true, sx: { ml: "4px", width: "calc(100% - 28px)", wordWrap: "break-word" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle1", color: "dark", fontSize: 12, children: option.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", color: "secondary", fontSize: 10, children: option.username })
                ] })
              ] }) })
            }
          ) })
        ] }),
        comparisonData.length > 0 && comparisonData.map((item) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", px: 3, pb: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", width: "40%", mr: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "20%", mr: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "button", fontWeight: "medium", color: "text", children: `${item.leftValue}` }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "80%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                LinearProgress,
                {
                  color: item.leftColor,
                  variant: "gradient",
                  value: item.leftPercent,
                  sx: { transform: "scaleX(-1)" }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { width: "20%", textAlign: "center" }, children: `${item.title}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", width: "40%", ml: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "80%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LinearProgress, { color: item.rightColor, variant: "gradient", value: item.rightPercent }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "20%", ml: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "button", fontWeight: "medium", color: "text", children: `${item.rightValue}` }) })
            ] })
          ] }, item.id);
        })
      ] })
    ] });
  }
  const SettingsContext = React$1.createContext({});
  const useSettingsContext = () => {
    const context = React$1.useContext(SettingsContext);
    if (!context)
      throw new Error("useSettingsContext must be use inside SettingsProvider");
    return context;
  };
  function resolveProps(defaultProps2, props) {
    const output = _extends$1({}, props);
    Object.keys(defaultProps2).forEach((propName) => {
      if (propName.toString().match(/^(components|slots)$/)) {
        output[propName] = _extends$1({}, defaultProps2[propName], output[propName]);
      } else if (propName.toString().match(/^(componentsProps|slotProps)$/)) {
        const defaultSlotProps = defaultProps2[propName] || {};
        const slotProps = props[propName];
        output[propName] = {};
        if (!slotProps || !Object.keys(slotProps)) {
          output[propName] = defaultSlotProps;
        } else if (!defaultSlotProps || !Object.keys(defaultSlotProps)) {
          output[propName] = slotProps;
        } else {
          output[propName] = _extends$1({}, slotProps);
          Object.keys(defaultSlotProps).forEach((slotPropName) => {
            output[propName][slotPropName] = resolveProps(defaultSlotProps[slotPropName], slotProps[slotPropName]);
          });
        }
      } else if (output[propName] === void 0) {
        output[propName] = defaultProps2[propName];
      }
    });
    return output;
  }
  function composeClasses(slots, getUtilityClass, classes = void 0) {
    const output = {};
    Object.keys(slots).forEach(
      // `Object.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
      // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
      (slot) => {
        output[slot] = slots[slot].reduce((acc, key) => {
          if (key) {
            const utilityClass = getUtilityClass(key);
            if (utilityClass !== "") {
              acc.push(utilityClass);
            }
            if (classes && classes[key]) {
              acc.push(classes[key]);
            }
          }
          return acc;
        }, []).join(" ");
      }
    );
    return output;
  }
  const defaultGenerator = (componentName) => componentName;
  const createClassNameGenerator = () => {
    let generate = defaultGenerator;
    return {
      configure(generator) {
        generate = generator;
      },
      generate(componentName) {
        return generate(componentName);
      },
      reset() {
        generate = defaultGenerator;
      }
    };
  };
  const ClassNameGenerator = createClassNameGenerator();
  const globalStateClasses = {
    active: "active",
    checked: "checked",
    completed: "completed",
    disabled: "disabled",
    error: "error",
    expanded: "expanded",
    focused: "focused",
    focusVisible: "focusVisible",
    open: "open",
    readOnly: "readOnly",
    required: "required",
    selected: "selected"
  };
  function generateUtilityClass(componentName, slot, globalStatePrefix = "Mui") {
    const globalStateClass = globalStateClasses[slot];
    return globalStateClass ? `${globalStatePrefix}-${globalStateClass}` : `${ClassNameGenerator.generate(componentName)}-${slot}`;
  }
  function generateUtilityClasses(componentName, slots, globalStatePrefix = "Mui") {
    const result = {};
    slots.forEach((slot) => {
      result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
    });
    return result;
  }
  function getCircularProgressUtilityClass(slot) {
    return generateUtilityClass$2("MuiCircularProgress", slot);
  }
  generateUtilityClasses$2("MuiCircularProgress", ["root", "determinate", "indeterminate", "colorPrimary", "colorSecondary", "svg", "circle", "circleDeterminate", "circleIndeterminate", "circleDisableShrink"]);
  const _excluded$6 = ["className", "color", "disableShrink", "size", "style", "thickness", "value", "variant"];
  let _ = (t2) => t2, _t, _t2, _t3, _t4;
  const SIZE = 44;
  const circularRotateKeyframe = keyframes(_t || (_t = _`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`));
  const circularDashKeyframe = keyframes(_t2 || (_t2 = _`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`));
  const useUtilityClasses$5 = (ownerState) => {
    const {
      classes,
      variant,
      color: color2,
      disableShrink
    } = ownerState;
    const slots = {
      root: ["root", variant, `color${capitalize$1(color2)}`],
      svg: ["svg"],
      circle: ["circle", `circle${capitalize$1(variant)}`, disableShrink && "circleDisableShrink"]
    };
    return composeClasses$1(slots, getCircularProgressUtilityClass, classes);
  };
  const CircularProgressRoot = styled("span", {
    name: "MuiCircularProgress",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], styles2[`color${capitalize$1(ownerState.color)}`]];
    }
  })(({
    ownerState,
    theme
  }) => _extends$1({
    display: "inline-block"
  }, ownerState.variant === "determinate" && {
    transition: theme.transitions.create("transform")
  }, ownerState.color !== "inherit" && {
    color: (theme.vars || theme).palette[ownerState.color].main
  }), ({
    ownerState
  }) => ownerState.variant === "indeterminate" && css(_t3 || (_t3 = _`
      animation: ${0} 1.4s linear infinite;
    `), circularRotateKeyframe));
  const CircularProgressSVG = styled("svg", {
    name: "MuiCircularProgress",
    slot: "Svg",
    overridesResolver: (props, styles2) => styles2.svg
  })({
    display: "block"
    // Keeps the progress centered
  });
  const CircularProgressCircle = styled("circle", {
    name: "MuiCircularProgress",
    slot: "Circle",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.circle, styles2[`circle${capitalize$1(ownerState.variant)}`], ownerState.disableShrink && styles2.circleDisableShrink];
    }
  })(({
    ownerState,
    theme
  }) => _extends$1({
    stroke: "currentColor"
  }, ownerState.variant === "determinate" && {
    transition: theme.transitions.create("stroke-dashoffset")
  }, ownerState.variant === "indeterminate" && {
    // Some default value that looks fine waiting for the animation to kicks in.
    strokeDasharray: "80px, 200px",
    strokeDashoffset: 0
    // Add the unit to fix a Edge 16 and below bug.
  }), ({
    ownerState
  }) => ownerState.variant === "indeterminate" && !ownerState.disableShrink && css(_t4 || (_t4 = _`
      animation: ${0} 1.4s ease-in-out infinite;
    `), circularDashKeyframe));
  const CircularProgress = /* @__PURE__ */ React$1__namespace.forwardRef(function CircularProgress2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiCircularProgress"
    });
    const {
      className,
      color: color2 = "primary",
      disableShrink = false,
      size = 40,
      style: style2,
      thickness = 3.6,
      value = 0,
      variant = "indeterminate"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$6);
    const ownerState = _extends$1({}, props, {
      color: color2,
      disableShrink,
      size,
      thickness,
      value,
      variant
    });
    const classes = useUtilityClasses$5(ownerState);
    const circleStyle = {};
    const rootStyle = {};
    const rootProps = {};
    if (variant === "determinate") {
      const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
      circleStyle.strokeDasharray = circumference.toFixed(3);
      rootProps["aria-valuenow"] = Math.round(value);
      circleStyle.strokeDashoffset = `${((100 - value) / 100 * circumference).toFixed(3)}px`;
      rootStyle.transform = "rotate(-90deg)";
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgressRoot, _extends$1({
      className: clsx(classes.root, className),
      style: _extends$1({
        width: size,
        height: size
      }, rootStyle, style2),
      ownerState,
      ref,
      role: "progressbar"
    }, rootProps, other, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgressSVG, {
        className: classes.svg,
        ownerState,
        viewBox: `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgressCircle, {
          className: classes.circle,
          style: circleStyle,
          ownerState,
          cx: SIZE,
          cy: SIZE,
          r: (SIZE - thickness) / 2,
          fill: "none",
          strokeWidth: thickness
        })
      })
    }));
  });
  const CircularProgress$1 = CircularProgress;
  function getLoadingButtonUtilityClass(slot) {
    return generateUtilityClass("MuiLoadingButton", slot);
  }
  const loadingButtonClasses = generateUtilityClasses("MuiLoadingButton", ["root", "loading", "loadingIndicator", "loadingIndicatorCenter", "loadingIndicatorStart", "loadingIndicatorEnd", "endIconLoadingEnd", "startIconLoadingStart"]);
  const loadingButtonClasses$1 = loadingButtonClasses;
  const _excluded$5 = ["children", "disabled", "id", "loading", "loadingIndicator", "loadingPosition", "variant"];
  const useUtilityClasses$4 = (ownerState) => {
    const {
      loading,
      loadingPosition,
      classes
    } = ownerState;
    const slots = {
      root: ["root", loading && "loading"],
      startIcon: [loading && `startIconLoading${capitalize$1(loadingPosition)}`],
      endIcon: [loading && `endIconLoading${capitalize$1(loadingPosition)}`],
      loadingIndicator: ["loadingIndicator", loading && `loadingIndicator${capitalize$1(loadingPosition)}`]
    };
    const composedClasses = composeClasses(slots, getLoadingButtonUtilityClass, classes);
    return _extends$1({}, classes, composedClasses);
  };
  const rootShouldForwardProp = (prop) => prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as" && prop !== "classes";
  const LoadingButtonRoot = styled(Button$2, {
    shouldForwardProp: (prop) => rootShouldForwardProp(prop) || prop === "classes",
    name: "MuiLoadingButton",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      return [styles2.root, styles2.startIconLoadingStart && {
        [`& .${loadingButtonClasses$1.startIconLoadingStart}`]: styles2.startIconLoadingStart
      }, styles2.endIconLoadingEnd && {
        [`& .${loadingButtonClasses$1.endIconLoadingEnd}`]: styles2.endIconLoadingEnd
      }];
    }
  })(({
    ownerState,
    theme
  }) => _extends$1({
    [`& .${loadingButtonClasses$1.startIconLoadingStart}, & .${loadingButtonClasses$1.endIconLoadingEnd}`]: {
      transition: theme.transitions.create(["opacity"], {
        duration: theme.transitions.duration.short
      }),
      opacity: 0
    }
  }, ownerState.loadingPosition === "center" && {
    transition: theme.transitions.create(["background-color", "box-shadow", "border-color"], {
      duration: theme.transitions.duration.short
    }),
    [`&.${loadingButtonClasses$1.loading}`]: {
      color: "transparent"
    }
  }, ownerState.loadingPosition === "start" && ownerState.fullWidth && {
    [`& .${loadingButtonClasses$1.startIconLoadingStart}, & .${loadingButtonClasses$1.endIconLoadingEnd}`]: {
      transition: theme.transitions.create(["opacity"], {
        duration: theme.transitions.duration.short
      }),
      opacity: 0,
      marginRight: -8
    }
  }, ownerState.loadingPosition === "end" && ownerState.fullWidth && {
    [`& .${loadingButtonClasses$1.startIconLoadingStart}, & .${loadingButtonClasses$1.endIconLoadingEnd}`]: {
      transition: theme.transitions.create(["opacity"], {
        duration: theme.transitions.duration.short
      }),
      opacity: 0,
      marginLeft: -8
    }
  }));
  const LoadingButtonLoadingIndicator = styled("span", {
    name: "MuiLoadingButton",
    slot: "LoadingIndicator",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.loadingIndicator, styles2[`loadingIndicator${capitalize$1(ownerState.loadingPosition)}`]];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    position: "absolute",
    visibility: "visible",
    display: "flex"
  }, ownerState.loadingPosition === "start" && (ownerState.variant === "outlined" || ownerState.variant === "contained") && {
    left: ownerState.size === "small" ? 10 : 14
  }, ownerState.loadingPosition === "start" && ownerState.variant === "text" && {
    left: 6
  }, ownerState.loadingPosition === "center" && {
    left: "50%",
    transform: "translate(-50%)",
    color: (theme.vars || theme).palette.action.disabled
  }, ownerState.loadingPosition === "end" && (ownerState.variant === "outlined" || ownerState.variant === "contained") && {
    right: ownerState.size === "small" ? 10 : 14
  }, ownerState.loadingPosition === "end" && ownerState.variant === "text" && {
    right: 6
  }, ownerState.loadingPosition === "start" && ownerState.fullWidth && {
    position: "relative",
    left: -10
  }, ownerState.loadingPosition === "end" && ownerState.fullWidth && {
    position: "relative",
    right: -10
  }));
  const LoadingButton = /* @__PURE__ */ React$1__namespace.forwardRef(function LoadingButton2(inProps, ref) {
    const contextProps = React$1__namespace.useContext(ButtonGroupContext$1);
    const resolvedProps = resolveProps(contextProps, inProps);
    const props = useThemeProps$1({
      props: resolvedProps,
      name: "MuiLoadingButton"
    });
    const {
      children,
      disabled = false,
      id: idProp,
      loading = false,
      loadingIndicator: loadingIndicatorProp,
      loadingPosition = "center",
      variant = "text"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$5);
    const id = useId(idProp);
    const loadingIndicator = loadingIndicatorProp != null ? loadingIndicatorProp : /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress$1, {
      "aria-labelledby": id,
      color: "inherit",
      size: 16
    });
    const ownerState = _extends$1({}, props, {
      disabled,
      loading,
      loadingIndicator,
      loadingPosition,
      variant
    });
    const classes = useUtilityClasses$4(ownerState);
    const loadingButtonLoadingIndicator = loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingButtonLoadingIndicator, {
      className: classes.loadingIndicator,
      ownerState,
      children: loadingIndicator
    }) : null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(LoadingButtonRoot, _extends$1({
      disabled: disabled || loading,
      id,
      ref
    }, other, {
      variant,
      classes,
      ownerState,
      children: [ownerState.loadingPosition === "end" ? children : loadingButtonLoadingIndicator, ownerState.loadingPosition === "end" ? loadingButtonLoadingIndicator : children]
    }));
  });
  const LoadingButton$1 = LoadingButton;
  function getDividerUtilityClass(slot) {
    return generateUtilityClass$2("MuiDivider", slot);
  }
  generateUtilityClasses$2("MuiDivider", ["root", "absolute", "fullWidth", "inset", "middle", "flexItem", "light", "vertical", "withChildren", "withChildrenVertical", "textAlignRight", "textAlignLeft", "wrapper", "wrapperVertical"]);
  const _excluded$4 = ["absolute", "children", "className", "component", "flexItem", "light", "orientation", "role", "textAlign", "variant"];
  const useUtilityClasses$3 = (ownerState) => {
    const {
      absolute,
      children,
      classes,
      flexItem,
      light: light2,
      orientation,
      textAlign,
      variant
    } = ownerState;
    const slots = {
      root: ["root", absolute && "absolute", variant, light2 && "light", orientation === "vertical" && "vertical", flexItem && "flexItem", children && "withChildren", children && orientation === "vertical" && "withChildrenVertical", textAlign === "right" && orientation !== "vertical" && "textAlignRight", textAlign === "left" && orientation !== "vertical" && "textAlignLeft"],
      wrapper: ["wrapper", orientation === "vertical" && "wrapperVertical"]
    };
    return composeClasses$1(slots, getDividerUtilityClass, classes);
  };
  const DividerRoot = styled("div", {
    name: "MuiDivider",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.absolute && styles2.absolute, styles2[ownerState.variant], ownerState.light && styles2.light, ownerState.orientation === "vertical" && styles2.vertical, ownerState.flexItem && styles2.flexItem, ownerState.children && styles2.withChildren, ownerState.children && ownerState.orientation === "vertical" && styles2.withChildrenVertical, ownerState.textAlign === "right" && ownerState.orientation !== "vertical" && styles2.textAlignRight, ownerState.textAlign === "left" && ownerState.orientation !== "vertical" && styles2.textAlignLeft];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    margin: 0,
    // Reset browser default style.
    flexShrink: 0,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: (theme.vars || theme).palette.divider,
    borderBottomWidth: "thin"
  }, ownerState.absolute && {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%"
  }, ownerState.light && {
    borderColor: theme.vars ? `rgba(${theme.vars.palette.dividerChannel} / 0.08)` : alpha_1(theme.palette.divider, 0.08)
  }, ownerState.variant === "inset" && {
    marginLeft: 72
  }, ownerState.variant === "middle" && ownerState.orientation === "horizontal" && {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }, ownerState.variant === "middle" && ownerState.orientation === "vertical" && {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }, ownerState.orientation === "vertical" && {
    height: "100%",
    borderBottomWidth: 0,
    borderRightWidth: "thin"
  }, ownerState.flexItem && {
    alignSelf: "stretch",
    height: "auto"
  }), ({
    ownerState
  }) => _extends$1({}, ownerState.children && {
    display: "flex",
    whiteSpace: "nowrap",
    textAlign: "center",
    border: 0,
    "&::before, &::after": {
      content: '""',
      alignSelf: "center"
    }
  }), ({
    theme,
    ownerState
  }) => _extends$1({}, ownerState.children && ownerState.orientation !== "vertical" && {
    "&::before, &::after": {
      width: "100%",
      borderTop: `thin solid ${(theme.vars || theme).palette.divider}`
    }
  }), ({
    theme,
    ownerState
  }) => _extends$1({}, ownerState.children && ownerState.orientation === "vertical" && {
    flexDirection: "column",
    "&::before, &::after": {
      height: "100%",
      borderLeft: `thin solid ${(theme.vars || theme).palette.divider}`
    }
  }), ({
    ownerState
  }) => _extends$1({}, ownerState.textAlign === "right" && ownerState.orientation !== "vertical" && {
    "&::before": {
      width: "90%"
    },
    "&::after": {
      width: "10%"
    }
  }, ownerState.textAlign === "left" && ownerState.orientation !== "vertical" && {
    "&::before": {
      width: "10%"
    },
    "&::after": {
      width: "90%"
    }
  }));
  const DividerWrapper = styled("span", {
    name: "MuiDivider",
    slot: "Wrapper",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.wrapper, ownerState.orientation === "vertical" && styles2.wrapperVertical];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    display: "inline-block",
    paddingLeft: `calc(${theme.spacing(1)} * 1.2)`,
    paddingRight: `calc(${theme.spacing(1)} * 1.2)`
  }, ownerState.orientation === "vertical" && {
    paddingTop: `calc(${theme.spacing(1)} * 1.2)`,
    paddingBottom: `calc(${theme.spacing(1)} * 1.2)`
  }));
  const Divider = /* @__PURE__ */ React$1__namespace.forwardRef(function Divider2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiDivider"
    });
    const {
      absolute = false,
      children,
      className,
      component = children ? "div" : "hr",
      flexItem = false,
      light: light2 = false,
      orientation = "horizontal",
      role = component !== "hr" ? "separator" : void 0,
      textAlign = "center",
      variant = "fullWidth"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$4);
    const ownerState = _extends$1({}, props, {
      absolute,
      component,
      flexItem,
      light: light2,
      orientation,
      role,
      textAlign,
      variant
    });
    const classes = useUtilityClasses$3(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DividerRoot, _extends$1({
      as: component,
      className: clsx(classes.root, className),
      role,
      ref,
      ownerState
    }, other, {
      children: children ? /* @__PURE__ */ jsxRuntimeExports.jsx(DividerWrapper, {
        className: classes.wrapper,
        ownerState,
        children
      }) : null
    }));
  });
  Divider.muiSkipListHighlight = true;
  const Divider$1 = Divider;
  function getSwitchBaseUtilityClass(slot) {
    return generateUtilityClass$2("PrivateSwitchBase", slot);
  }
  generateUtilityClasses$2("PrivateSwitchBase", ["root", "checked", "disabled", "input", "edgeStart", "edgeEnd"]);
  const _excluded$3 = ["autoFocus", "checked", "checkedIcon", "className", "defaultChecked", "disabled", "disableFocusRipple", "edge", "icon", "id", "inputProps", "inputRef", "name", "onBlur", "onChange", "onFocus", "readOnly", "required", "tabIndex", "type", "value"];
  const useUtilityClasses$2 = (ownerState) => {
    const {
      classes,
      checked,
      disabled,
      edge
    } = ownerState;
    const slots = {
      root: ["root", checked && "checked", disabled && "disabled", edge && `edge${capitalize$1(edge)}`],
      input: ["input"]
    };
    return composeClasses$1(slots, getSwitchBaseUtilityClass, classes);
  };
  const SwitchBaseRoot = styled(ButtonBase$1)(({
    ownerState
  }) => _extends$1({
    padding: 9,
    borderRadius: "50%"
  }, ownerState.edge === "start" && {
    marginLeft: ownerState.size === "small" ? -3 : -12
  }, ownerState.edge === "end" && {
    marginRight: ownerState.size === "small" ? -3 : -12
  }));
  const SwitchBaseInput = styled("input", {
    shouldForwardProp: rootShouldForwardProp$1
  })({
    cursor: "inherit",
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    zIndex: 1
  });
  const SwitchBase = /* @__PURE__ */ React$1__namespace.forwardRef(function SwitchBase2(props, ref) {
    const {
      autoFocus,
      checked: checkedProp,
      checkedIcon,
      className,
      defaultChecked,
      disabled: disabledProp,
      disableFocusRipple = false,
      edge = false,
      icon,
      id,
      inputProps,
      inputRef,
      name,
      onBlur,
      onChange,
      onFocus,
      readOnly,
      required = false,
      tabIndex,
      type,
      value
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$3);
    const [checked, setCheckedState] = useControlled({
      controlled: checkedProp,
      default: Boolean(defaultChecked),
      name: "SwitchBase",
      state: "checked"
    });
    const muiFormControl = useFormControl();
    const handleFocus = (event) => {
      if (onFocus) {
        onFocus(event);
      }
      if (muiFormControl && muiFormControl.onFocus) {
        muiFormControl.onFocus(event);
      }
    };
    const handleBlur = (event) => {
      if (onBlur) {
        onBlur(event);
      }
      if (muiFormControl && muiFormControl.onBlur) {
        muiFormControl.onBlur(event);
      }
    };
    const handleInputChange = (event) => {
      if (event.nativeEvent.defaultPrevented) {
        return;
      }
      const newChecked = event.target.checked;
      setCheckedState(newChecked);
      if (onChange) {
        onChange(event, newChecked);
      }
    };
    let disabled = disabledProp;
    if (muiFormControl) {
      if (typeof disabled === "undefined") {
        disabled = muiFormControl.disabled;
      }
    }
    const hasLabelFor = type === "checkbox" || type === "radio";
    const ownerState = _extends$1({}, props, {
      checked,
      disabled,
      disableFocusRipple,
      edge
    });
    const classes = useUtilityClasses$2(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchBaseRoot, _extends$1({
      component: "span",
      className: clsx(classes.root, className),
      centerRipple: true,
      focusRipple: !disableFocusRipple,
      disabled,
      tabIndex: null,
      role: void 0,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ownerState,
      ref
    }, other, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(SwitchBaseInput, _extends$1({
        autoFocus,
        checked: checkedProp,
        defaultChecked,
        className: classes.input,
        disabled,
        id: hasLabelFor ? id : void 0,
        name,
        onChange: handleInputChange,
        readOnly,
        ref: inputRef,
        required,
        ownerState,
        tabIndex,
        type
      }, type === "checkbox" && value === void 0 ? {} : {
        value
      }, inputProps)), checked ? checkedIcon : icon]
    }));
  });
  const SwitchBase$1 = SwitchBase;
  function getSwitchUtilityClass(slot) {
    return generateUtilityClass$2("MuiSwitch", slot);
  }
  const switchClasses = generateUtilityClasses$2("MuiSwitch", ["root", "edgeStart", "edgeEnd", "switchBase", "colorPrimary", "colorSecondary", "sizeSmall", "sizeMedium", "checked", "disabled", "input", "thumb", "track"]);
  const switchClasses$1 = switchClasses;
  const _excluded$2 = ["className", "color", "edge", "size", "sx"];
  const useUtilityClasses$1 = (ownerState) => {
    const {
      classes,
      edge,
      size,
      color: color2,
      checked,
      disabled
    } = ownerState;
    const slots = {
      root: ["root", edge && `edge${capitalize$1(edge)}`, `size${capitalize$1(size)}`],
      switchBase: ["switchBase", `color${capitalize$1(color2)}`, checked && "checked", disabled && "disabled"],
      thumb: ["thumb"],
      track: ["track"],
      input: ["input"]
    };
    const composedClasses = composeClasses$1(slots, getSwitchUtilityClass, classes);
    return _extends$1({}, classes, composedClasses);
  };
  const SwitchRoot = styled("span", {
    name: "MuiSwitch",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.edge && styles2[`edge${capitalize$1(ownerState.edge)}`], styles2[`size${capitalize$1(ownerState.size)}`]];
    }
  })(({
    ownerState
  }) => _extends$1({
    display: "inline-flex",
    width: 34 + 12 * 2,
    height: 14 + 12 * 2,
    overflow: "hidden",
    padding: 12,
    boxSizing: "border-box",
    position: "relative",
    flexShrink: 0,
    zIndex: 0,
    // Reset the stacking context.
    verticalAlign: "middle",
    // For correct alignment with the text.
    "@media print": {
      colorAdjust: "exact"
    }
  }, ownerState.edge === "start" && {
    marginLeft: -8
  }, ownerState.edge === "end" && {
    marginRight: -8
  }, ownerState.size === "small" && {
    width: 40,
    height: 24,
    padding: 7,
    [`& .${switchClasses$1.thumb}`]: {
      width: 16,
      height: 16
    },
    [`& .${switchClasses$1.switchBase}`]: {
      padding: 4,
      [`&.${switchClasses$1.checked}`]: {
        transform: "translateX(16px)"
      }
    }
  }));
  const SwitchSwitchBase = styled(SwitchBase$1, {
    name: "MuiSwitch",
    slot: "SwitchBase",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.switchBase, {
        [`& .${switchClasses$1.input}`]: styles2.input
      }, ownerState.color !== "default" && styles2[`color${capitalize$1(ownerState.color)}`]];
    }
  })(({
    theme
  }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    // Render above the focus ripple.
    color: theme.vars ? theme.vars.palette.Switch.defaultColor : `${theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.grey[300]}`,
    transition: theme.transitions.create(["left", "transform"], {
      duration: theme.transitions.duration.shortest
    }),
    [`&.${switchClasses$1.checked}`]: {
      transform: "translateX(20px)"
    },
    [`&.${switchClasses$1.disabled}`]: {
      color: theme.vars ? theme.vars.palette.Switch.defaultDisabledColor : `${theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600]}`
    },
    [`&.${switchClasses$1.checked} + .${switchClasses$1.track}`]: {
      opacity: 0.5
    },
    [`&.${switchClasses$1.disabled} + .${switchClasses$1.track}`]: {
      opacity: theme.vars ? theme.vars.opacity.switchTrackDisabled : `${theme.palette.mode === "light" ? 0.12 : 0.2}`
    },
    [`& .${switchClasses$1.input}`]: {
      left: "-100%",
      width: "300%"
    }
  }), ({
    theme,
    ownerState
  }) => _extends$1({
    "&:hover": {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette.action.active, theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  }, ownerState.color !== "default" && {
    [`&.${switchClasses$1.checked}`]: {
      color: (theme.vars || theme).palette[ownerState.color].main,
      "&:hover": {
        backgroundColor: theme.vars ? `rgba(${theme.vars.palette[ownerState.color].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha_1(theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity),
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      },
      [`&.${switchClasses$1.disabled}`]: {
        color: theme.vars ? theme.vars.palette.Switch[`${ownerState.color}DisabledColor`] : `${theme.palette.mode === "light" ? lighten_1(theme.palette[ownerState.color].main, 0.62) : darken_1(theme.palette[ownerState.color].main, 0.55)}`
      }
    },
    [`&.${switchClasses$1.checked} + .${switchClasses$1.track}`]: {
      backgroundColor: (theme.vars || theme).palette[ownerState.color].main
    }
  }));
  const SwitchTrack = styled("span", {
    name: "MuiSwitch",
    slot: "Track",
    overridesResolver: (props, styles2) => styles2.track
  })(({
    theme
  }) => ({
    height: "100%",
    width: "100%",
    borderRadius: 14 / 2,
    zIndex: -1,
    transition: theme.transitions.create(["opacity", "background-color"], {
      duration: theme.transitions.duration.shortest
    }),
    backgroundColor: theme.vars ? theme.vars.palette.common.onBackground : `${theme.palette.mode === "light" ? theme.palette.common.black : theme.palette.common.white}`,
    opacity: theme.vars ? theme.vars.opacity.switchTrack : `${theme.palette.mode === "light" ? 0.38 : 0.3}`
  }));
  const SwitchThumb = styled("span", {
    name: "MuiSwitch",
    slot: "Thumb",
    overridesResolver: (props, styles2) => styles2.thumb
  })(({
    theme
  }) => ({
    boxShadow: (theme.vars || theme).shadows[1],
    backgroundColor: "currentColor",
    width: 20,
    height: 20,
    borderRadius: "50%"
  }));
  const Switch = /* @__PURE__ */ React$1__namespace.forwardRef(function Switch2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiSwitch"
    });
    const {
      className,
      color: color2 = "primary",
      edge = false,
      size = "medium",
      sx
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$2);
    const ownerState = _extends$1({}, props, {
      color: color2,
      edge,
      size
    });
    const classes = useUtilityClasses$1(ownerState);
    const icon = /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchThumb, {
      className: classes.thumb,
      ownerState
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchRoot, {
      className: clsx(classes.root, className),
      sx,
      ownerState,
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(SwitchSwitchBase, _extends$1({
        type: "checkbox",
        icon,
        checkedIcon: icon,
        ref,
        ownerState
      }, other, {
        classes: _extends$1({}, classes, {
          root: classes.switchBase
        })
      })), /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchTrack, {
        className: classes.track,
        ownerState
      })]
    });
  });
  const Switch$1 = Switch;
  var Symbol$1 = _Symbol;
  var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0;
  symbolProto ? symbolProto.valueOf : void 0;
  var nodeUtil$1 = _nodeUtilExports;
  nodeUtil$1 && nodeUtil$1.isMap;
  var nodeUtil = _nodeUtilExports;
  nodeUtil && nodeUtil.isSet;
  const _excluded$1 = ["addEndListener", "appear", "children", "container", "direction", "easing", "in", "onEnter", "onEntered", "onEntering", "onExit", "onExited", "onExiting", "style", "timeout", "TransitionComponent"];
  function getTranslateValue(direction, node2, resolvedContainer) {
    const rect = node2.getBoundingClientRect();
    const containerRect = resolvedContainer && resolvedContainer.getBoundingClientRect();
    const containerWindow = ownerWindow(node2);
    let transform;
    if (node2.fakeTransform) {
      transform = node2.fakeTransform;
    } else {
      const computedStyle = containerWindow.getComputedStyle(node2);
      transform = computedStyle.getPropertyValue("-webkit-transform") || computedStyle.getPropertyValue("transform");
    }
    let offsetX = 0;
    let offsetY = 0;
    if (transform && transform !== "none" && typeof transform === "string") {
      const transformValues = transform.split("(")[1].split(")")[0].split(",");
      offsetX = parseInt(transformValues[4], 10);
      offsetY = parseInt(transformValues[5], 10);
    }
    if (direction === "left") {
      if (containerRect) {
        return `translateX(${containerRect.right + offsetX - rect.left}px)`;
      }
      return `translateX(${containerWindow.innerWidth + offsetX - rect.left}px)`;
    }
    if (direction === "right") {
      if (containerRect) {
        return `translateX(-${rect.right - containerRect.left - offsetX}px)`;
      }
      return `translateX(-${rect.left + rect.width - offsetX}px)`;
    }
    if (direction === "up") {
      if (containerRect) {
        return `translateY(${containerRect.bottom + offsetY - rect.top}px)`;
      }
      return `translateY(${containerWindow.innerHeight + offsetY - rect.top}px)`;
    }
    if (containerRect) {
      return `translateY(-${rect.top - containerRect.top + rect.height - offsetY}px)`;
    }
    return `translateY(-${rect.top + rect.height - offsetY}px)`;
  }
  function resolveContainer(containerPropProp) {
    return typeof containerPropProp === "function" ? containerPropProp() : containerPropProp;
  }
  function setTranslateValue(direction, node2, containerProp) {
    const resolvedContainer = resolveContainer(containerProp);
    const transform = getTranslateValue(direction, node2, resolvedContainer);
    if (transform) {
      node2.style.webkitTransform = transform;
      node2.style.transform = transform;
    }
  }
  const Slide = /* @__PURE__ */ React$1__namespace.forwardRef(function Slide2(props, ref) {
    const theme = useTheme$1();
    const defaultEasing = {
      enter: theme.transitions.easing.easeOut,
      exit: theme.transitions.easing.sharp
    };
    const defaultTimeout = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      addEndListener,
      appear = true,
      children,
      container: containerProp,
      direction = "down",
      easing: easingProp = defaultEasing,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style: style2,
      timeout = defaultTimeout,
      // eslint-disable-next-line react/prop-types
      TransitionComponent = Transition$1
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$1);
    const childrenRef = React$1__namespace.useRef(null);
    const handleRef = useForkRef(children.ref, childrenRef, ref);
    const normalizedTransitionCallback = (callback) => (isAppearing) => {
      if (callback) {
        if (isAppearing === void 0) {
          callback(childrenRef.current);
        } else {
          callback(childrenRef.current, isAppearing);
        }
      }
    };
    const handleEnter = normalizedTransitionCallback((node2, isAppearing) => {
      setTranslateValue(direction, node2, containerProp);
      reflow(node2);
      if (onEnter) {
        onEnter(node2, isAppearing);
      }
    });
    const handleEntering = normalizedTransitionCallback((node2, isAppearing) => {
      const transitionProps = getTransitionProps({
        timeout,
        style: style2,
        easing: easingProp
      }, {
        mode: "enter"
      });
      node2.style.webkitTransition = theme.transitions.create("-webkit-transform", _extends$1({}, transitionProps));
      node2.style.transition = theme.transitions.create("transform", _extends$1({}, transitionProps));
      node2.style.webkitTransform = "none";
      node2.style.transform = "none";
      if (onEntering) {
        onEntering(node2, isAppearing);
      }
    });
    const handleEntered = normalizedTransitionCallback(onEntered);
    const handleExiting = normalizedTransitionCallback(onExiting);
    const handleExit = normalizedTransitionCallback((node2) => {
      const transitionProps = getTransitionProps({
        timeout,
        style: style2,
        easing: easingProp
      }, {
        mode: "exit"
      });
      node2.style.webkitTransition = theme.transitions.create("-webkit-transform", transitionProps);
      node2.style.transition = theme.transitions.create("transform", transitionProps);
      setTranslateValue(direction, node2, containerProp);
      if (onExit) {
        onExit(node2);
      }
    });
    const handleExited = normalizedTransitionCallback((node2) => {
      node2.style.webkitTransition = "";
      node2.style.transition = "";
      if (onExited) {
        onExited(node2);
      }
    });
    const handleAddEndListener = (next2) => {
      if (addEndListener) {
        addEndListener(childrenRef.current, next2);
      }
    };
    const updatePosition = React$1__namespace.useCallback(() => {
      if (childrenRef.current) {
        setTranslateValue(direction, childrenRef.current, containerProp);
      }
    }, [direction, containerProp]);
    React$1__namespace.useEffect(() => {
      if (inProp || direction === "down" || direction === "right") {
        return void 0;
      }
      const handleResize = debounce$1(() => {
        if (childrenRef.current) {
          setTranslateValue(direction, childrenRef.current, containerProp);
        }
      });
      const containerWindow = ownerWindow(childrenRef.current);
      containerWindow.addEventListener("resize", handleResize);
      return () => {
        handleResize.clear();
        containerWindow.removeEventListener("resize", handleResize);
      };
    }, [direction, inProp, containerProp]);
    React$1__namespace.useEffect(() => {
      if (!inProp) {
        updatePosition();
      }
    }, [inProp, updatePosition]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
      nodeRef: childrenRef,
      onEnter: handleEnter,
      onEntered: handleEntered,
      onEntering: handleEntering,
      onExit: handleExit,
      onExited: handleExited,
      onExiting: handleExiting,
      addEndListener: handleAddEndListener,
      appear,
      in: inProp,
      timeout
    }, other, {
      children: (state, childProps) => {
        return /* @__PURE__ */ React$1__namespace.cloneElement(children, _extends$1({
          ref: handleRef,
          style: _extends$1({
            visibility: state === "exited" && !inProp ? "hidden" : void 0
          }, style2, children.props.style)
        }, childProps));
      }
    }));
  });
  const Slide$1 = Slide;
  function getDrawerUtilityClass(slot) {
    return generateUtilityClass$2("MuiDrawer", slot);
  }
  const drawerClasses = generateUtilityClasses$2("MuiDrawer", ["root", "docked", "paper", "paperAnchorLeft", "paperAnchorRight", "paperAnchorTop", "paperAnchorBottom", "paperAnchorDockedLeft", "paperAnchorDockedRight", "paperAnchorDockedTop", "paperAnchorDockedBottom", "modal"]);
  const drawerClasses$1 = drawerClasses;
  const _excluded = ["BackdropProps"], _excluded2 = ["anchor", "BackdropProps", "children", "className", "elevation", "hideBackdrop", "ModalProps", "onClose", "open", "PaperProps", "SlideProps", "TransitionComponent", "transitionDuration", "variant"];
  const overridesResolver = (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, (ownerState.variant === "permanent" || ownerState.variant === "persistent") && styles2.docked, styles2.modal];
  };
  const useUtilityClasses = (ownerState) => {
    const {
      classes,
      anchor,
      variant
    } = ownerState;
    const slots = {
      root: ["root"],
      docked: [(variant === "permanent" || variant === "persistent") && "docked"],
      modal: ["modal"],
      paper: ["paper", `paperAnchor${capitalize$1(anchor)}`, variant !== "temporary" && `paperAnchorDocked${capitalize$1(anchor)}`]
    };
    return composeClasses$1(slots, getDrawerUtilityClass, classes);
  };
  const DrawerRoot = styled(Modal$1, {
    name: "MuiDrawer",
    slot: "Root",
    overridesResolver
  })(({
    theme
  }) => ({
    zIndex: (theme.vars || theme).zIndex.drawer
  }));
  const DrawerDockedRoot = styled("div", {
    shouldForwardProp: rootShouldForwardProp$1,
    name: "MuiDrawer",
    slot: "Docked",
    skipVariantsResolver: false,
    overridesResolver
  })({
    flex: "0 0 auto"
  });
  const DrawerPaper = styled(Paper$1, {
    name: "MuiDrawer",
    slot: "Paper",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.paper, styles2[`paperAnchor${capitalize$1(ownerState.anchor)}`], ownerState.variant !== "temporary" && styles2[`paperAnchorDocked${capitalize$1(ownerState.anchor)}`]];
    }
  })(({
    theme,
    ownerState
  }) => _extends$1({
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: "1 0 auto",
    zIndex: (theme.vars || theme).zIndex.drawer,
    // Add iOS momentum scrolling for iOS < 13.0
    WebkitOverflowScrolling: "touch",
    // temporary style
    position: "fixed",
    top: 0,
    // We disable the focus ring for mouse, touch and keyboard users.
    // At some point, it would be better to keep it for keyboard users.
    // :focus-ring CSS pseudo-class will help.
    outline: 0
  }, ownerState.anchor === "left" && {
    left: 0
  }, ownerState.anchor === "top" && {
    top: 0,
    left: 0,
    right: 0,
    height: "auto",
    maxHeight: "100%"
  }, ownerState.anchor === "right" && {
    right: 0
  }, ownerState.anchor === "bottom" && {
    top: "auto",
    left: 0,
    bottom: 0,
    right: 0,
    height: "auto",
    maxHeight: "100%"
  }, ownerState.anchor === "left" && ownerState.variant !== "temporary" && {
    borderRight: `1px solid ${(theme.vars || theme).palette.divider}`
  }, ownerState.anchor === "top" && ownerState.variant !== "temporary" && {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`
  }, ownerState.anchor === "right" && ownerState.variant !== "temporary" && {
    borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`
  }, ownerState.anchor === "bottom" && ownerState.variant !== "temporary" && {
    borderTop: `1px solid ${(theme.vars || theme).palette.divider}`
  }));
  const oppositeDirection = {
    left: "right",
    right: "left",
    top: "down",
    bottom: "up"
  };
  function isHorizontal(anchor) {
    return ["left", "right"].indexOf(anchor) !== -1;
  }
  function getAnchor(theme, anchor) {
    return theme.direction === "rtl" && isHorizontal(anchor) ? oppositeDirection[anchor] : anchor;
  }
  const Drawer = /* @__PURE__ */ React$1__namespace.forwardRef(function Drawer2(inProps, ref) {
    const props = useThemeProps$1({
      props: inProps,
      name: "MuiDrawer"
    });
    const theme = useTheme$1();
    const defaultTransitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      anchor: anchorProp = "left",
      BackdropProps,
      children,
      className,
      elevation = 16,
      hideBackdrop = false,
      ModalProps: {
        BackdropProps: BackdropPropsProp
      } = {},
      onClose,
      open = false,
      PaperProps = {},
      SlideProps,
      // eslint-disable-next-line react/prop-types
      TransitionComponent = Slide$1,
      transitionDuration = defaultTransitionDuration,
      variant = "temporary"
    } = props, ModalProps = _objectWithoutPropertiesLoose(props.ModalProps, _excluded), other = _objectWithoutPropertiesLoose(props, _excluded2);
    const mounted = React$1__namespace.useRef(false);
    React$1__namespace.useEffect(() => {
      mounted.current = true;
    }, []);
    const anchorInvariant = getAnchor(theme, anchorProp);
    const anchor = anchorProp;
    const ownerState = _extends$1({}, props, {
      anchor,
      elevation,
      open,
      variant
    }, other);
    const classes = useUtilityClasses(ownerState);
    const drawer2 = /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerPaper, _extends$1({
      elevation: variant === "temporary" ? elevation : 0,
      square: true
    }, PaperProps, {
      className: clsx(classes.paper, PaperProps.className),
      ownerState,
      children
    }));
    if (variant === "permanent") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerDockedRoot, _extends$1({
        className: clsx(classes.root, classes.docked, className),
        ownerState,
        ref
      }, other, {
        children: drawer2
      }));
    }
    const slidingDrawer = /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, _extends$1({
      in: open,
      direction: oppositeDirection[anchorInvariant],
      timeout: transitionDuration,
      appear: mounted.current
    }, SlideProps, {
      children: drawer2
    }));
    if (variant === "persistent") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerDockedRoot, _extends$1({
        className: clsx(classes.root, classes.docked, className),
        ownerState,
        ref
      }, other, {
        children: slidingDrawer
      }));
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerRoot, _extends$1({
      BackdropProps: _extends$1({}, BackdropProps, BackdropPropsProp, {
        transitionDuration
      }),
      className: clsx(classes.root, classes.modal, className),
      open,
      ownerState,
      onClose,
      hideBackdrop,
      ref
    }, other, ModalProps, {
      children: slidingDrawer
    }));
  });
  const Drawer$1 = Drawer;
  const StyledPandoraDrawer = styled(Drawer$1, {
    shouldForwardProp: (fieldName) => filterForwardProps(fieldName, ["openPandora", "drawerPosition"])
  })(
    ({ drawerPosition = "right", openPandora = false, theme }) => {
      const { breakpoints: breakpoints2, transitions } = theme;
      const matches = useMediaQuery(breakpoints2.up("sm"));
      const drawerSize = matches ? uiConfig.pandoraDrawerMaxHeight : uiConfig.pandoraDrawerMinHeight;
      const drawerSizeGap = `${50 - parseInt(drawerSize.replace("%", ""), 10) / 2}%`;
      const baseStyle = {
        margin: 0
      };
      switch (drawerPosition) {
        case "top":
          return {
            [`& .${drawerClasses$1.paper}`]: {
              height: uiConfig.pandoraDrawerWidth,
              width: `${drawerSize}`,
              left: drawerSizeGap
            }
          };
        case "right":
          return {
            [`& .${drawerClasses$1.paper}`]: {
              ...baseStyle,
              width: uiConfig.pandoraDrawerWidth,
              height: `${drawerSize}`,
              top: drawerSizeGap,
              transform: `translateX(${uiConfig.pandoraDrawerWidth})`,
              transition: transitions.create(["transform"], {
                easing: transitions.easing.sharp,
                duration: transitions.duration.shorter
              }),
              ...openPandora && {
                transform: `translateX(${0})`,
                transition: transitions.create(["transform"], {
                  easing: transitions.easing.sharp,
                  duration: transitions.duration.enteringScreen
                })
              }
            }
          };
        case "bottom":
          return {
            [`& .${drawerClasses$1.paper}`]: {
              height: uiConfig.pandoraDrawerWidth,
              width: `${drawerSize}`,
              left: drawerSizeGap
            }
          };
        case "left":
          return {
            [`& .${drawerClasses$1.paper}`]: {
              width: uiConfig.pandoraDrawerWidth,
              height: `${drawerSize}`,
              top: drawerSizeGap
            }
          };
        default:
          return {
            [`& .${drawerClasses$1.paper}`]: {
              width: uiConfig.pandoraDrawerWidth,
              height: `${drawerSize}`,
              top: drawerSizeGap
            }
          };
      }
    }
  );
  styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1
  });
  function PandoraDrawer({
    openDrawer = false,
    handleCloseDrawer = void 0,
    drawerPosition = "right",
    ...restProps
  }) {
    const theme = useTheme$1();
    const settings = useSettingsContext();
    useMediaQuery(theme.breakpoints.up("sm"));
    React$1.useRef(false);
    const [isFetching, setIsFetching] = React$1.useState(false);
    const [showPrivate, setShowPrivate] = React$1.useState(0);
    const drawerVariant = drawerPosition === "left" || drawerPosition === "right" ? "permanent" : "persistent";
    const handleGetForumAbout = async () => {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        setIsFetching(true);
        const aboutData = await fetchForumAbout(csrfToken).then((res) => {
          setIsFetching(false);
          return res;
        });
        console.log(aboutData);
      }
    };
    const handleToggleOpen = (callback, state) => {
      if (state === void 0) {
        callback((prevState) => !prevState);
      } else {
        callback(state);
      }
    };
    const [levelInfoOpen, setLevelInfoOpen] = React$1.useState(false);
    const handleToggleLevelInfoDialog = (state) => {
      handleToggleOpen(setLevelInfoOpen, state);
    };
    const [openPK, setOpenPK] = React$1.useState(false);
    const handleToggleUserComparisonDialog = (state) => {
      handleToggleOpen(setOpenPK, state);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      StyledPandoraDrawer,
      {
        anchor: drawerPosition,
        variant: drawerVariant,
        open: openDrawer,
        onClose: () => handleCloseDrawer && handleCloseDrawer(),
        ModalProps: {
          keepMounted: true
        },
        openPandora: openDrawer,
        drawerPosition,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { pt: 0.5, pb: 3, px: 3, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", lineHeight: 1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", children: "主题" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch$1,
              {
                checked: settings.themeMode === "dark",
                onChange: (e2, checked) => settings.onUpdate("themeMode", checked ? "dark" : "light")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider$1, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, lineHeight: 1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", children: "修改邀请时限" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { title: "太刑了，已被点名批评", placement: "top", sx: { zIndex: 1e4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              LoadingButton$1,
              {
                color: "info",
                variant: "gradient",
                loading: false,
                onClick: () => window.open("https://linux.do/t/topic/46387/7?u=delph1s", "_blank"),
                children: "跳转说明帖子"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider$1, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", lineHeight: 1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", children: "升级之路" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { color: "info", disabled: isFetching, onClick: () => handleToggleLevelInfoDialog(true), children: "查看等级数据" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrustLevelDialog, { open: levelInfoOpen, toggleOpen: handleToggleLevelInfoDialog })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider$1, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", lineHeight: 1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", children: "论坛统计数据" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              LoadingButton$1,
              {
                color: "info",
                variant: "gradient",
                loading: isFetching,
                onClick: () => handleGetForumAbout(),
                disabled: true,
                children: "查看"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider$1, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", lineHeight: 1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", children: "与佬友PK" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              LoadingButton$1,
              {
                color: "info",
                variant: "gradient",
                loading: isFetching,
                onClick: () => handleToggleUserComparisonDialog(true),
                children: "开P"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserComparisonDialog, { open: openPK, toggleOpen: handleToggleUserComparisonDialog })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Divider$1, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", lineHeight: 1, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Typography,
              {
                variant: "h6",
                sx: {
                  ...showPrivate < 10 && {
                    "&, &:hover, &:focus, &:focus:not(:hover), &:active": {
                      color: "rgba(0, 0, 0, 0)",
                      background: "transparent",
                      boxShadow: "none"
                    }
                  }
                },
                children: "自主阅读"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                color: "info",
                variant: "gradient",
                onClick: () => setShowPrivate((prevState) => prevState + 1),
                sx: {
                  ...showPrivate < 10 && {
                    "&, &:hover, &:focus, &:focus:not(:hover), &:active": {
                      color: "rgba(0, 0, 0, 0)",
                      background: "transparent",
                      boxShadow: "none"
                    }
                  }
                },
                children: "随机阅读"
              }
            )
          ] })
        ] })
      }
    );
  }
  const localStorageAvailable = () => {
    try {
      const key = "__linuxdo_next_config__";
      window.localStorage.setItem(key, key);
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  };
  const useLocalStorage = (key, defaultValue) => {
    const storageAvailable = localStorageAvailable();
    const [value, setValue] = React$1.useState(() => {
      const storedValue = storageAvailable ? localStorage.getItem(key) : null;
      return storedValue === null ? defaultValue : JSON.parse(storedValue);
    });
    React$1.useEffect(() => {
      const listener = (e2) => {
        if (e2.storageArea === localStorage && e2.key === key) {
          setValue(e2.newValue ? JSON.parse(e2.newValue) : e2.newValue);
        }
      };
      window.addEventListener("storage", listener);
      return () => {
        window.removeEventListener("storage", listener);
      };
    }, [key, defaultValue]);
    const setValueInLocalStorage = (newValue) => {
      setValue((currentValue) => {
        const result = typeof newValue === "function" ? newValue(currentValue) : newValue;
        if (storageAvailable) {
          localStorage.setItem(key, JSON.stringify(result));
        }
        return result;
      });
    };
    return [value, setValueInLocalStorage];
  };
  var baseIsEqual = _baseIsEqual;
  function isEqual(value, other) {
    return baseIsEqual(value, other);
  }
  var isEqual_1 = isEqual;
  const lodashIsEqual = /* @__PURE__ */ getDefaultExportFromCjs(isEqual_1);
  function SettingsProvider({ children, defaultSettings }) {
    const [openDrawer, setOpenDrawer] = React$1.useState(false);
    const [settings, setSettings] = useLocalStorage("pandoraSettings", defaultSettings);
    const canReset = !lodashIsEqual(settings, defaultSettings);
    const onUpdate = React$1.useCallback(
      (name, value) => {
        setSettings((prevState) => {
          return {
            ...prevState,
            [name]: value
          };
        });
      },
      [setSettings]
    );
    const onReset = React$1.useCallback(() => {
      setSettings(defaultSettings);
    }, [defaultSettings, setSettings]);
    const onToggleDrawer = React$1.useCallback(() => {
      setOpenDrawer((prevState) => !prevState);
    }, []);
    const onCloseDrawer = React$1.useCallback(() => {
      setOpenDrawer(false);
    }, []);
    const memoizedValue = React$1.useMemo(() => {
      return {
        ...settings,
        onUpdate,
        // Reset
        canReset,
        onReset,
        // Drawer
        open: openDrawer,
        onToggle: onToggleDrawer,
        onClose: onCloseDrawer
      };
    }, [onReset, onUpdate, settings, canReset, openDrawer, onCloseDrawer, onToggleDrawer]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsContext.Provider, { value: memoizedValue, children });
  }
  const appBar = (theme) => {
    return {
      MuiAppBar: {
        defaultProps: {
          color: "transparent"
        },
        styleOverrides: {
          root: {
            boxShadow: "none"
          }
        }
      }
    };
  };
  const autocomplete = (theme) => {
    const isLight = theme.palette.mode === "light";
    const { white, light: light2, dark: dark2, text, transparent, background, gradients } = theme.palette;
    const { borderRadius: borderRadius2 } = theme.borders;
    const { md, lg } = theme.boxShadows;
    const { rgba: rgba2, pxToRem: pxToRem2 } = theme.functions;
    const { size } = theme.typography;
    return {
      MuiAutocomplete: {
        styleOverrides: {
          popper: {
            boxShadow: isLight ? lg : md,
            padding: pxToRem2(8),
            fontSize: size.sm,
            color: text.main,
            textAlign: "left",
            backgroundColor: `${isLight ? white.main : background.card} !important`,
            borderRadius: borderRadius2.md
          },
          paper: {
            boxShadow: "none",
            backgroundColor: transparent.main
          },
          option: {
            padding: `${pxToRem2(4.8)} ${pxToRem2(16)}`,
            borderRadius: borderRadius2.md,
            fontSize: size.sm,
            color: text.main,
            transition: "background-color 300ms ease, color 300ms ease",
            "&:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus": {
              backgroundColor: isLight ? light2.main : rgba2(light2.main, 0.2),
              color: isLight ? dark2.main : white.main
            },
            '&[aria-selected="true"]': {
              backgroundColor: `${isLight ? light2.main : rgba2(light2.main, 0.2)} !important`,
              color: `${isLight ? dark2.main : white.main} !important`
            }
          },
          noOptions: {
            fontSize: size.sm,
            color: text.main
          },
          groupLabel: {
            color: dark2.main
          },
          loading: {
            fontSize: size.sm,
            color: text.main
          },
          tag: {
            display: "flex",
            alignItems: "center",
            height: "auto",
            padding: pxToRem2(4),
            backgroundColor: gradients.dark.state,
            color: white.main,
            [`& .${chipClasses$1.label}`]: {
              lineHeight: 1.2,
              padding: `0 ${pxToRem2(10)} 0 ${pxToRem2(4)}`
            },
            [`& .${svgIconClasses$1.root}, & .${svgIconClasses$1.root}:hover, & .${svgIconClasses$1.root}:focus`]: {
              color: white.main,
              marginRight: 0
            }
          },
          ...!isLight && {
            popupIndicator: {
              color: text.main
            },
            clearIndicator: {
              color: text.main
            }
          }
        }
      }
    };
  };
  const ThemeColors = ["primary", "secondary", "info", "success", "warning", "error", "light", "dark"];
  const ButtonColors = ["white", ...ThemeColors];
  const button = (theme) => {
    const { palette: palette2 } = theme;
    const isLight = palette2.mode === "light";
    const {
      white,
      black,
      primary,
      secondary,
      error,
      warning,
      success,
      info,
      light: light2,
      dark: dark2,
      grey: grey2,
      text,
      transparent,
      gradients
    } = palette2;
    const { borderRadius: borderRadius2 } = theme.borders;
    const { fontWeightBold, size } = theme.typography;
    const { boxShadow: boxShadow2, linearGradient: linearGradient2, pxToRem: pxToRem2, rgba: rgba2 } = theme.functions;
    const { colored } = theme.boxShadows;
    const rootStyle = (ownerState) => {
      const containedVariant = ownerState.variant === "contained";
      const outlinedVariant = ownerState.variant === "outlined";
      const textVariant = ownerState.variant === "text";
      const gradientVariant = ownerState.variant === "gradient";
      const smallSize = ownerState.size === "small";
      const mediumSize = ownerState.size === "medium";
      const largeSize = ownerState.size === "large";
      const defaultStyle = {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: size.xs,
        fontWeight: fontWeightBold,
        borderRadius: borderRadius2.lg,
        padding: `${pxToRem2(6.302)} ${pxToRem2(16.604)}`,
        lineHeight: 1.4,
        textAlign: "center",
        textTransform: "uppercase",
        userSelect: "none",
        backgroundSize: "150% !important",
        backgroundPositionX: "25% !important",
        transition: "all 150ms ease-in",
        [`&.${buttonClasses$1.disabled}`]: {
          pointerEvent: "none",
          opacity: 0.65
        },
        "& .material-icons": {
          fontSize: pxToRem2(15),
          marginTop: pxToRem2(-2)
        }
      };
      const variantStyle = {
        ...containedVariant && {
          backgroundColor: white.main,
          minHeight: pxToRem2(isLight ? 40 : 37),
          color: text.main,
          padding: `${pxToRem2(isLight ? 10 : 9)} ${pxToRem2(24)}`,
          "&:hover": {
            backgroundColor: white.main
          },
          "&:active, &:active:focus, &:active:hover": {
            opacity: 0.85
          },
          "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem2(16)} !important`
          }
        },
        ...outlinedVariant && {
          minHeight: pxToRem2(isLight ? 40 : 39),
          color: light2.main,
          borderColor: light2.main,
          padding: `${pxToRem2(isLight ? 10 : 9)} ${pxToRem2(24)}`,
          "&:hover": {
            opacity: 0.75,
            backgroundColor: transparent.main
          },
          "& .material-icon, .material-icons-round, svg": {
            fontSize: `${pxToRem2(16)} !important`
          }
        },
        ...textVariant && {
          backgroundColor: transparent.main,
          minHeight: pxToRem2(isLight ? 40 : 37),
          color: text.main,
          boxShadow: "none",
          padding: `${pxToRem2(isLight ? 10 : 9)} ${pxToRem2(24)}`,
          "&:hover": {
            backgroundColor: transparent.main,
            boxShadow: "none"
          },
          "&:focus": {
            boxShadow: "none"
          },
          "&:active, &:active:focus, &:active:hover": {
            opacity: 0.85,
            boxShadow: "none"
          },
          [`&.${buttonClasses$1.disabled}`]: {
            boxShadow: "none"
          },
          [`& .material-icon, .material-icons-round, svg`]: {
            fontSize: `${pxToRem2(16)} !important`
          }
        }
      };
      const colorStyle = ButtonColors.map((color2) => {
        if (color2 === ownerState.color) {
          if (containedVariant) {
            const backgroundValue = lodashHas(palette2, color2) ? palette2[color2].main : white.main;
            const focusedBackgroundValue = lodashHas(palette2, color2) ? palette2[color2].focus : white.focus;
            const boxShadowValue = lodashHas(colored, color2) ? `${boxShadow2([0, 3], [3, 0], palette2[color2].main, 0.15)}, ${boxShadow2(
            [0, 3],
            [1, -2],
            palette2[color2].main,
            0.2
          )}, ${boxShadow2([0, 1], [5, 0], palette2[color2].main, 0.15)}` : "none";
            const hoveredBoxShadowValue = lodashHas(colored, color2) ? `${boxShadow2([0, 14], [26, -12], palette2[color2].main, 0.4)}, ${boxShadow2(
            [0, 4],
            [23, 0],
            palette2[color2].main,
            0.15
          )}, ${boxShadow2([0, 8], [10, -5], palette2[color2].main, 0.2)}` : "none";
            let colorValue = white.main;
            if (isLight && (color2 === "white" || color2 === "light" || !palette2[color2])) {
              colorValue = text.main;
            } else if (!isLight && (color2 === "white" || color2 === "light" || !palette2[color2])) {
              colorValue = grey2["600"];
            }
            let focusedColorValue = white.main;
            if (color2 === "white") {
              focusedColorValue = text.main;
            } else if (color2 === "primary" || color2 === "error" || color2 === "dark") {
              focusedColorValue = white.main;
            }
            return {
              background: backgroundValue,
              // backgroundColor: backgroundValue,
              color: colorValue,
              boxShadow: boxShadowValue,
              "&:hover": {
                backgroundColor: backgroundValue,
                color: colorValue,
                boxShadow: hoveredBoxShadowValue
              },
              "&:focus:not(:hover)": {
                backgroundColor: focusedBackgroundValue,
                color: colorValue,
                boxShadow: palette2[color2] ? boxShadow2([0, 0], [0, 3.2], palette2[color2].main, 0.5) : boxShadow2([0, 0], [0, 3.2], white.main, 0.5)
              },
              [`&.${buttonClasses$1.disabled}`]: {
                backgroundColor: backgroundValue,
                color: focusedColorValue
              }
            };
          }
          if (outlinedVariant) {
            const backgroundValue = color2 === "white" ? rgba2(white.main, 0.1) : transparent.main;
            const colorValue = lodashHas(palette2, color2) ? palette2[color2].main : white.main;
            const boxShadowValue = lodashHas(palette2, color2) ? boxShadow2([0, 0], [0, 3.2], palette2[color2].main, 0.5) : boxShadow2([0, 0], [0, 3.2], white.main, 0.5);
            let borderColorValue = lodashHas(palette2, color2) ? palette2[color2].main : rgba2(white.main, 0.75);
            if (color2 === "white") {
              borderColorValue = rgba2(white.main, 0.75);
            }
            return {
              background: backgroundValue,
              // backgroundColor: backgroundValue,
              color: colorValue,
              border: `${pxToRem2(1)} solid ${borderColorValue}`,
              "&:hover": {
                backgroundColor: transparent.main,
                color: colorValue,
                borderColor: colorValue,
                opacity: 0.85
              },
              "&:focus:not(:hover)": {
                backgroundColor: transparent.main,
                color: colorValue,
                boxShadow: boxShadowValue
              },
              "&:active:not(:hover)": {
                backgroundColor: colorValue,
                color: white.main,
                opacity: 0.85
              },
              [`&.${buttonClasses$1.disabled}`]: {
                color: colorValue,
                borderColor: colorValue
              }
            };
          }
          if (textVariant) {
            const colorValue = lodashHas(palette2, color2) ? palette2[color2].main : white.main;
            const focusedColorValue = lodashHas(palette2, color2) ? palette2[color2].focus : white.focus;
            return {
              color: colorValue,
              "&:hover": {
                color: focusedColorValue
              },
              "&:focus:not(:hover)": {
                color: focusedColorValue,
                boxShadow: "none"
              }
            };
          }
          if (gradientVariant) {
            const backgroundValue = color2 === "white" || !lodashHas(colored, color2) ? white.main : linearGradient2(gradients[color2].main, gradients[color2].state);
            const boxShadowValue = lodashHas(colored, color2) ? `${boxShadow2([0, 3], [3, 0], palette2[color2].main, 0.15)}, ${boxShadow2(
            [0, 3],
            [1, -2],
            palette2[color2].main,
            0.2
          )}, ${boxShadow2([0, 1], [5, 0], palette2[color2].main, 0.15)}` : "none";
            const hoveredBoxShadowValue = lodashHas(colored, color2) ? `${boxShadow2([0, 14], [26, -12], palette2[color2].main, 0.4)}, ${boxShadow2(
            [0, 4],
            [23, 0],
            palette2[color2].main,
            0.15
          )}, ${boxShadow2([0, 8], [10, -5], palette2[color2].main, 0.2)}` : "none";
            let colorValue = white.main;
            if (color2 === "white") {
              colorValue = text.main;
            } else if (color2 === "light") {
              colorValue = gradients.dark.state;
            }
            return {
              background: backgroundValue,
              color: colorValue,
              boxShadow: boxShadowValue,
              "&:hover": {
                boxShadow: hoveredBoxShadowValue,
                color: colorValue
              },
              "&:focus:not(:hover)": {
                boxShadow: boxShadowValue,
                color: colorValue
              },
              [`&.${buttonClasses$1.disabled}`]: {
                background: backgroundValue,
                color: colorValue
              }
            };
          }
          return {};
        }
        return {};
      });
      const sizeStyle = {
        ...smallSize && {
          ...(containedVariant || gradientVariant || textVariant) && {
            minHeight: pxToRem2(isLight ? 32 : 29),
            padding: `${pxToRem2(6)} ${pxToRem2(isLight ? 16 : 18)}`,
            fontSize: size.xs,
            "& .material-icon, .material-icons-round, svg": {
              fontSize: `${pxToRem2(12)} !important`
            }
          },
          ...outlinedVariant && {
            minHeight: pxToRem2(isLight ? 32 : 31),
            padding: `${pxToRem2(6)} ${pxToRem2(isLight ? 16 : 18)}`,
            fontSize: size.xs,
            "& .material-icon, .material-icons-round, svg": {
              fontSize: `${pxToRem2(12)} !important`
            }
          }
        },
        ...mediumSize && {
          ...(containedVariant || gradientVariant || textVariant) && {
            minHeight: pxToRem2(isLight ? 40 : 37),
            padding: `${pxToRem2(6)} ${pxToRem2(isLight ? 22 : 26)}`,
            fontSize: size.xs,
            "& .material-icon, .material-icons-round, svg": {
              fontSize: `${pxToRem2(17)} !important`
            }
          },
          ...outlinedVariant && {
            minHeight: pxToRem2(isLight ? 32 : 31),
            padding: `${pxToRem2(6)} ${pxToRem2(isLight ? 22 : 26)}`,
            fontSize: size.xs,
            "& .material-icon, .material-icons-round, svg": {
              fontSize: `${pxToRem2(17)} !important`
            }
          }
        },
        ...largeSize && {
          ...(containedVariant || gradientVariant || textVariant) && {
            minHeight: pxToRem2(isLight ? 47 : 44),
            padding: `${pxToRem2(12)} ${pxToRem2(isLight ? 28 : 34)}`,
            fontSize: size.sm,
            "& .material-icon, .material-icons-round, svg": {
              fontSize: `${pxToRem2(22)} !important`
            }
          },
          ...outlinedVariant && {
            minHeight: pxToRem2(isLight ? 47 : 46),
            padding: `${pxToRem2(12)} ${pxToRem2(isLight ? 28 : 34)}`,
            fontSize: size.sm,
            "& .material-icon, .material-icons-round, svg": {
              fontSize: `${pxToRem2(22)} !important`
            }
          }
        }
      };
      return [defaultStyle, variantStyle, ...colorStyle, sizeStyle];
    };
    return {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: false
        }
      },
      MuiButton: {
        defaultProps: {
          disableRipple: false
        },
        styleOverrides: {
          root: ({ ownerState }) => rootStyle(ownerState)
          // contained: {},
          // outlined: {},
          // text: {},
          // icon: {
          //   [`&.${buttonClasses.sizeSmall} > .${buttonClasses.icon}`]: {},
          //   [`&.${buttonClasses.sizeMedium} > .${buttonClasses.icon}`]: {},
          //   [`&.${buttonClasses.sizeLarge} > .${buttonClasses.icon}`]: {},
          // },
        }
      },
      MuiIconButton: {
        // styleOverrides: {
        //   root: {},
        // },
      },
      MuiListItemButton: {
        // styleOverrides: {
        //   root: {},
        // },
      }
    };
  };
  const card = (theme) => {
    const isLight = theme.palette.mode === "light";
    const { white, black, background } = theme.palette;
    const { borderWidth, borderRadius: borderRadius2 } = theme.borders;
    const { md } = theme.boxShadows;
    const { rgba: rgba2, pxToRem: pxToRem2 } = theme.functions;
    return {
      MuiCard: {
        styleOverrides: {
          root: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minWidth: 0,
            wordWrap: "break-word",
            ...isLight && {
              backgroundColor: white.main
            },
            ...!isLight && {
              backgroundImage: "none",
              backgroundColor: background.card
            },
            backgroundClip: "border-box",
            border: `${borderWidth[0]} solid ${rgba2(black.main, 0.125)}`,
            borderRadius: borderRadius2.xl,
            boxShadow: md,
            overflow: "visible"
          }
        }
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            marginTop: 0,
            marginBottom: 0,
            padding: `${pxToRem2(8)} ${pxToRem2(24)} ${pxToRem2(24)}`
          }
        }
      },
      MuiCardMedia: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius2.xl,
            margin: `${pxToRem2(16)} ${pxToRem2(16)} 0`
          },
          media: {
            width: "auto"
          }
        }
      }
    };
  };
  const dialog = (theme) => {
    const isLight = theme.palette.mode === "light";
    const { white, black, text, background } = theme.palette;
    const { borderColor: borderColor2, borderWidth, borderRadius: borderRadius2 } = theme.borders;
    const { md, xxl } = theme.boxShadows;
    const { rgba: rgba2, pxToRem: pxToRem2 } = theme.functions;
    const { size } = theme.typography;
    return {
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: borderRadius2.lg,
            boxShadow: xxl
          },
          paperFullScreen: {
            borderRadius: 0
          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: pxToRem2(16)
          }
        }
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: pxToRem2(16),
            fontSize: size.md,
            color: isLight ? text.main : rgba2(white.main, 0.8)
          },
          dividers: {
            ...isLight && {
              borderTop: `${borderWidth[1]} solid ${borderColor2}`,
              borderBottom: `${borderWidth[1]} solid ${borderColor2}`
            },
            ...!isLight && {
              borderTop: `${borderWidth[1]} solid ${rgba2(borderColor2, 0.6)}`,
              borderBottom: `${borderWidth[1]} solid ${rgba2(borderColor2, 0.6)}`
            }
          }
        }
      },
      MuiDialogContentText: {
        styleOverrides: {
          root: {
            fontSize: size.md,
            color: isLight ? text.main : rgba2(white.main, 0.8)
          }
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            padding: pxToRem2(16),
            fontSize: size.xl
          }
        }
      }
    };
  };
  const divider = (theme) => {
    theme.palette.mode === "light";
    const { dark: dark2, transparent } = theme.palette;
    const { pxToRem: pxToRem2, rgba: rgba2 } = theme.functions;
    return {
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: transparent.main,
            backgroundImage: `linear-gradient(to right, ${rgba2(dark2.main, 0)}, ${rgba2(
            dark2.main,
            0.4
          )}, ${rgba2(dark2.main, 0)}) !important`,
            height: pxToRem2(1),
            margin: `${pxToRem2(16)} 0`,
            borderBottom: "none",
            opacity: 0.25
          },
          vertical: {
            backgroundColor: transparent.main,
            backgroundImage: `linear-gradient(to bottom, ${rgba2(dark2.main, 0)}, ${rgba2(
            dark2.main,
            0.4
          )}, ${rgba2(dark2.main, 0)}) !important`,
            width: pxToRem2(1),
            height: "100%",
            margin: `0 ${pxToRem2(16)}`,
            borderRight: "none"
          }
        }
      }
    };
  };
  const drawer = (theme) => {
    const isLight = theme.palette.mode === "light";
    const { white, background } = theme.palette;
    const { borderRadius: borderRadius2 } = theme.borders;
    const { pxToRem: pxToRem2 } = theme.functions;
    return {
      MuiDrawer: {
        styleOverrides: {
          root: {
            width: pxToRem2(250),
            whiteSpace: "nowrap",
            border: "none"
          },
          paper: {
            width: pxToRem2(250),
            backgroundColor: isLight ? white.main : background.sidenav,
            height: `calc(100vh - ${pxToRem2(32)})`,
            margin: pxToRem2(16),
            borderRadius: borderRadius2.xl,
            border: "none"
          },
          paperAnchorDockedLeft: {
            borderRight: "none"
          }
        }
      }
    };
  };
  const input = (theme) => {
    const isLight = theme.palette.mode === "light";
    const { white, black, info, dark: dark2, text, grey: grey2, transparent, background, inputBorderColor } = theme.palette;
    const { borderWidth, borderRadius: borderRadius2 } = theme.borders;
    theme.boxShadows;
    const { rgba: rgba2, pxToRem: pxToRem2 } = theme.functions;
    const { size } = theme.typography;
    return {
      MuiInput: {
        styleOverrides: {
          root: {
            fontSize: size.sm,
            color: dark2.main,
            "&:hover:not(.Mui-disabled):before": {
              borderBottom: `${borderWidth[1]} solid ${isLight ? inputBorderColor : rgba2(inputBorderColor, 0.6)}`
            },
            "&:before": {
              borderColor: isLight ? inputBorderColor : rgba2(inputBorderColor, 0.6)
            },
            "&:after": {
              borderColor: info.main
            },
            ...!isLight && {
              input: {
                color: white.main,
                "&::-webkit-input-placeholder": {
                  color: grey2[100]
                }
              }
            }
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: size.sm,
            color: text.main,
            lineHeight: 0.9,
            "&.Mui-focused": {
              color: info.main
            },
            [`&.${inputLabelClasses$1.shrink}`]: {
              lineHeight: 1.5,
              fontSize: size.md,
              [`~ .${inputBaseClasses$1.root} .${outlinedInputClasses$1.notchedOutline} legend`]: {
                fontSize: "0.85em"
              }
            }
          },
          sizeSmall: {
            fontSize: size.xs,
            lineHeight: 1.625,
            [`&.${inputLabelClasses$1.shrink}`]: {
              lineHeight: 1.6,
              fontSize: size.sm,
              [`~ .${inputBaseClasses$1.root} .${outlinedInputClasses$1.notchedOutline} legend`]: {
                fontSize: "0.72em"
              }
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: transparent.main,
            fontSize: size.sm,
            borderRadius: borderRadius2.md,
            [`&:hover .${outlinedInputClasses$1.notchedOutline}`]: {
              borderColor: isLight ? inputBorderColor : rgba2(inputBorderColor, 0.6)
            },
            "&.Mui-focused": {
              [`& .${outlinedInputClasses$1.notchedOutline}`]: {
                borderColor: info.main
              }
            }
          },
          notchedOutline: {
            borderColor: isLight ? inputBorderColor : rgba2(inputBorderColor, 0.6)
          },
          input: {
            color: isLight ? grey2[700] : white.main,
            padding: pxToRem2(12),
            backgroundColor: transparent.main,
            ...!isLight && {
              "&::-webkit-input-placeholder": {
                color: grey2[100]
              }
            }
          },
          inputSizeSmall: {
            fontSize: size.xs,
            padding: pxToRem2(10)
          },
          multiline: {
            color: grey2[700],
            padding: 0
          }
        }
      }
    };
  };
  const progress = (theme) => {
    theme.palette.mode === "light";
    const { light: light2 } = theme.palette;
    const { borderRadius: borderRadius2 } = theme.borders;
    const { pxToRem: pxToRem2 } = theme.functions;
    return {
      MuiCircularProgress: {
        // styleOverrides: {
        //   root: {},
        // },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: pxToRem2(6),
            borderRadius: borderRadius2.md,
            overflow: "visible",
            position: "relative"
          },
          colorPrimary: {
            backgroundColor: light2.main
          },
          colorSecondary: {
            backgroundColor: light2.main
          },
          bar: {
            height: pxToRem2(6),
            borderRadius: borderRadius2.sm,
            position: "absolute",
            transform: `translate(0, 0) !important`,
            transition: "width 0.6s ease !important"
          }
        }
      }
    };
  };
  const switchButton = (theme) => {
    theme.palette.mode === "light";
    const { white, gradients, grey: grey2, transparent } = theme.palette;
    const { borderWidth } = theme.borders;
    const { md } = theme.boxShadows;
    const { pxToRem: pxToRem2, linearGradient: linearGradient2 } = theme.functions;
    return {
      MuiSwitch: {
        defaultProps: {
          disableRipple: false
        },
        styleOverrides: {
          switchBase: {
            color: gradients.dark.main,
            "&:hover": {
              backgroundColor: transparent.main
            },
            "&.Mui-checked": {
              color: gradients.dark.main,
              "&:hover": {
                backgroundColor: transparent.main
              },
              [`& .${switchClasses$1.thumb}`]: {
                borderColor: `${gradients.dark.main} !important`
              },
              [`& + .${switchClasses$1.track}`]: {
                backgroundColor: `${gradients.dark.main} !important`,
                borderColor: `${gradients.dark.main} !important`,
                opacity: 1
              }
            },
            [`&.Mui-disabled + .${switchClasses$1.track}`]: {
              opacity: "0.3 !important"
            },
            [`&.Mui-focusVisible .${switchClasses$1.thumb}`]: {
              backgroundImage: linearGradient2(gradients.info.main, gradients.info.state)
            }
          },
          thumb: {
            backgroundColor: white.main,
            boxShadow: md,
            border: `${borderWidth[1]} solid ${grey2[400]}`
          },
          track: {
            width: pxToRem2(32),
            height: pxToRem2(15),
            backgroundColor: grey2[400],
            border: `${borderWidth[1]} solid ${grey2[400]}`,
            opacity: 1
          },
          checked: {}
        }
      }
    };
  };
  const componentsOverrides = (theme) => {
    const components = lodashMerge(
      appBar(),
      autocomplete(theme),
      button(theme),
      card(theme),
      dialog(theme),
      divider(theme),
      drawer(theme),
      input(theme),
      progress(theme),
      switchButton(theme)
    );
    return components;
  };
  const pxToRem = (number, baseNumber = 16) => {
    return `${number / baseNumber}rem`;
  };
  var chroma$1 = { exports: {} };
  /**
   * chroma.js - JavaScript library for color conversions
   *
   * Copyright (c) 2011-2019, Gregor Aisch
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice, this
   * list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. The name Gregor Aisch may not be used to endorse or promote products
   * derived from this software without specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
   * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
   * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
   * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
   * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *
   * -------------------------------------------------------
   *
   * chroma.js includes colors from colorbrewer2.org, which are released under
   * the following license:
   *
   * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
   * and The Pennsylvania State University.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing,
   * software distributed under the License is distributed on an
   * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
   * either express or implied. See the License for the specific
   * language governing permissions and limitations under the License.
   *
   * ------------------------------------------------------
   *
   * Named colors are taken from X11 Color Names.
   * http://www.w3.org/TR/css3-color/#svg-color
   *
   * @preserve
   */
  (function(module, exports) {
    (function(global2, factory) {
      module.exports = factory();
    })(commonjsGlobal, function() {
      var limit$2 = function(x2, min3, max3) {
        if (min3 === void 0)
          min3 = 0;
        if (max3 === void 0)
          max3 = 1;
        return x2 < min3 ? min3 : x2 > max3 ? max3 : x2;
      };
      var limit$1 = limit$2;
      var clip_rgb$3 = function(rgb2) {
        rgb2._clipped = false;
        rgb2._unclipped = rgb2.slice(0);
        for (var i2 = 0; i2 <= 3; i2++) {
          if (i2 < 3) {
            if (rgb2[i2] < 0 || rgb2[i2] > 255) {
              rgb2._clipped = true;
            }
            rgb2[i2] = limit$1(rgb2[i2], 0, 255);
          } else if (i2 === 3) {
            rgb2[i2] = limit$1(rgb2[i2], 0, 1);
          }
        }
        return rgb2;
      };
      var classToType = {};
      for (var i$1 = 0, list$1 = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Undefined", "Null"]; i$1 < list$1.length; i$1 += 1) {
        var name = list$1[i$1];
        classToType["[object " + name + "]"] = name.toLowerCase();
      }
      var type$p = function(obj) {
        return classToType[Object.prototype.toString.call(obj)] || "object";
      };
      var type$o = type$p;
      var unpack$B = function(args, keyOrder) {
        if (keyOrder === void 0)
          keyOrder = null;
        if (args.length >= 3) {
          return Array.prototype.slice.call(args);
        }
        if (type$o(args[0]) == "object" && keyOrder) {
          return keyOrder.split("").filter(function(k2) {
            return args[0][k2] !== void 0;
          }).map(function(k2) {
            return args[0][k2];
          });
        }
        return args[0];
      };
      var type$n = type$p;
      var last$4 = function(args) {
        if (args.length < 2) {
          return null;
        }
        var l2 = args.length - 1;
        if (type$n(args[l2]) == "string") {
          return args[l2].toLowerCase();
        }
        return null;
      };
      var PI$2 = Math.PI;
      var utils2 = {
        clip_rgb: clip_rgb$3,
        limit: limit$2,
        type: type$p,
        unpack: unpack$B,
        last: last$4,
        PI: PI$2,
        TWOPI: PI$2 * 2,
        PITHIRD: PI$2 / 3,
        DEG2RAD: PI$2 / 180,
        RAD2DEG: 180 / PI$2
      };
      var input$h = {
        format: {},
        autodetect: []
      };
      var last$3 = utils2.last;
      var clip_rgb$2 = utils2.clip_rgb;
      var type$m = utils2.type;
      var _input = input$h;
      var Color$D = function Color2() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var me = this;
        if (type$m(args[0]) === "object" && args[0].constructor && args[0].constructor === this.constructor) {
          return args[0];
        }
        var mode = last$3(args);
        var autodetect = false;
        if (!mode) {
          autodetect = true;
          if (!_input.sorted) {
            _input.autodetect = _input.autodetect.sort(function(a, b2) {
              return b2.p - a.p;
            });
            _input.sorted = true;
          }
          for (var i2 = 0, list2 = _input.autodetect; i2 < list2.length; i2 += 1) {
            var chk = list2[i2];
            mode = chk.test.apply(chk, args);
            if (mode) {
              break;
            }
          }
        }
        if (_input.format[mode]) {
          var rgb2 = _input.format[mode].apply(null, autodetect ? args : args.slice(0, -1));
          me._rgb = clip_rgb$2(rgb2);
        } else {
          throw new Error("unknown format: " + args);
        }
        if (me._rgb.length === 3) {
          me._rgb.push(1);
        }
      };
      Color$D.prototype.toString = function toString2() {
        if (type$m(this.hex) == "function") {
          return this.hex();
        }
        return "[" + this._rgb.join(",") + "]";
      };
      var Color_1 = Color$D;
      var chroma$k = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(chroma$k.Color, [null].concat(args)))();
      };
      chroma$k.Color = Color_1;
      chroma$k.version = "2.4.2";
      var chroma_1 = chroma$k;
      var unpack$A = utils2.unpack;
      var max$2 = Math.max;
      var rgb2cmyk$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$A(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        r2 = r2 / 255;
        g2 = g2 / 255;
        b2 = b2 / 255;
        var k2 = 1 - max$2(r2, max$2(g2, b2));
        var f2 = k2 < 1 ? 1 / (1 - k2) : 0;
        var c2 = (1 - r2 - k2) * f2;
        var m2 = (1 - g2 - k2) * f2;
        var y2 = (1 - b2 - k2) * f2;
        return [c2, m2, y2, k2];
      };
      var rgb2cmyk_1 = rgb2cmyk$1;
      var unpack$z = utils2.unpack;
      var cmyk2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$z(args, "cmyk");
        var c2 = args[0];
        var m2 = args[1];
        var y2 = args[2];
        var k2 = args[3];
        var alpha2 = args.length > 4 ? args[4] : 1;
        if (k2 === 1) {
          return [0, 0, 0, alpha2];
        }
        return [
          c2 >= 1 ? 0 : 255 * (1 - c2) * (1 - k2),
          // r
          m2 >= 1 ? 0 : 255 * (1 - m2) * (1 - k2),
          // g
          y2 >= 1 ? 0 : 255 * (1 - y2) * (1 - k2),
          // b
          alpha2
        ];
      };
      var cmyk2rgb_1 = cmyk2rgb;
      var chroma$j = chroma_1;
      var Color$C = Color_1;
      var input$g = input$h;
      var unpack$y = utils2.unpack;
      var type$l = utils2.type;
      var rgb2cmyk = rgb2cmyk_1;
      Color$C.prototype.cmyk = function() {
        return rgb2cmyk(this._rgb);
      };
      chroma$j.cmyk = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$C, [null].concat(args, ["cmyk"])))();
      };
      input$g.format.cmyk = cmyk2rgb_1;
      input$g.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$y(args, "cmyk");
          if (type$l(args) === "array" && args.length === 4) {
            return "cmyk";
          }
        }
      });
      var unpack$x = utils2.unpack;
      var last$2 = utils2.last;
      var rnd = function(a) {
        return Math.round(a * 100) / 100;
      };
      var hsl2css$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var hsla = unpack$x(args, "hsla");
        var mode = last$2(args) || "lsa";
        hsla[0] = rnd(hsla[0] || 0);
        hsla[1] = rnd(hsla[1] * 100) + "%";
        hsla[2] = rnd(hsla[2] * 100) + "%";
        if (mode === "hsla" || hsla.length > 3 && hsla[3] < 1) {
          hsla[3] = hsla.length > 3 ? hsla[3] : 1;
          mode = "hsla";
        } else {
          hsla.length = 3;
        }
        return mode + "(" + hsla.join(",") + ")";
      };
      var hsl2css_1 = hsl2css$1;
      var unpack$w = utils2.unpack;
      var rgb2hsl$3 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$w(args, "rgba");
        var r2 = args[0];
        var g2 = args[1];
        var b2 = args[2];
        r2 /= 255;
        g2 /= 255;
        b2 /= 255;
        var min3 = Math.min(r2, g2, b2);
        var max3 = Math.max(r2, g2, b2);
        var l2 = (max3 + min3) / 2;
        var s, h2;
        if (max3 === min3) {
          s = 0;
          h2 = Number.NaN;
        } else {
          s = l2 < 0.5 ? (max3 - min3) / (max3 + min3) : (max3 - min3) / (2 - max3 - min3);
        }
        if (r2 == max3) {
          h2 = (g2 - b2) / (max3 - min3);
        } else if (g2 == max3) {
          h2 = 2 + (b2 - r2) / (max3 - min3);
        } else if (b2 == max3) {
          h2 = 4 + (r2 - g2) / (max3 - min3);
        }
        h2 *= 60;
        if (h2 < 0) {
          h2 += 360;
        }
        if (args.length > 3 && args[3] !== void 0) {
          return [h2, s, l2, args[3]];
        }
        return [h2, s, l2];
      };
      var rgb2hsl_1 = rgb2hsl$3;
      var unpack$v = utils2.unpack;
      var last$1 = utils2.last;
      var hsl2css = hsl2css_1;
      var rgb2hsl$2 = rgb2hsl_1;
      var round$6 = Math.round;
      var rgb2css$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgba2 = unpack$v(args, "rgba");
        var mode = last$1(args) || "rgb";
        if (mode.substr(0, 3) == "hsl") {
          return hsl2css(rgb2hsl$2(rgba2), mode);
        }
        rgba2[0] = round$6(rgba2[0]);
        rgba2[1] = round$6(rgba2[1]);
        rgba2[2] = round$6(rgba2[2]);
        if (mode === "rgba" || rgba2.length > 3 && rgba2[3] < 1) {
          rgba2[3] = rgba2.length > 3 ? rgba2[3] : 1;
          mode = "rgba";
        }
        return mode + "(" + rgba2.slice(0, mode === "rgb" ? 3 : 4).join(",") + ")";
      };
      var rgb2css_1 = rgb2css$1;
      var unpack$u = utils2.unpack;
      var round$5 = Math.round;
      var hsl2rgb$1 = function() {
        var assign2;
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$u(args, "hsl");
        var h2 = args[0];
        var s = args[1];
        var l2 = args[2];
        var r2, g2, b2;
        if (s === 0) {
          r2 = g2 = b2 = l2 * 255;
        } else {
          var t3 = [0, 0, 0];
          var c2 = [0, 0, 0];
          var t2 = l2 < 0.5 ? l2 * (1 + s) : l2 + s - l2 * s;
          var t1 = 2 * l2 - t2;
          var h_ = h2 / 360;
          t3[0] = h_ + 1 / 3;
          t3[1] = h_;
          t3[2] = h_ - 1 / 3;
          for (var i2 = 0; i2 < 3; i2++) {
            if (t3[i2] < 0) {
              t3[i2] += 1;
            }
            if (t3[i2] > 1) {
              t3[i2] -= 1;
            }
            if (6 * t3[i2] < 1) {
              c2[i2] = t1 + (t2 - t1) * 6 * t3[i2];
            } else if (2 * t3[i2] < 1) {
              c2[i2] = t2;
            } else if (3 * t3[i2] < 2) {
              c2[i2] = t1 + (t2 - t1) * (2 / 3 - t3[i2]) * 6;
            } else {
              c2[i2] = t1;
            }
          }
          assign2 = [round$5(c2[0] * 255), round$5(c2[1] * 255), round$5(c2[2] * 255)], r2 = assign2[0], g2 = assign2[1], b2 = assign2[2];
        }
        if (args.length > 3) {
          return [r2, g2, b2, args[3]];
        }
        return [r2, g2, b2, 1];
      };
      var hsl2rgb_1 = hsl2rgb$1;
      var hsl2rgb = hsl2rgb_1;
      var input$f = input$h;
      var RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;
      var RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/;
      var RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
      var RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
      var RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/;
      var RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/;
      var round$4 = Math.round;
      var css2rgb$1 = function(css2) {
        css2 = css2.toLowerCase().trim();
        var m2;
        if (input$f.format.named) {
          try {
            return input$f.format.named(css2);
          } catch (e2) {
          }
        }
        if (m2 = css2.match(RE_RGB)) {
          var rgb2 = m2.slice(1, 4);
          for (var i2 = 0; i2 < 3; i2++) {
            rgb2[i2] = +rgb2[i2];
          }
          rgb2[3] = 1;
          return rgb2;
        }
        if (m2 = css2.match(RE_RGBA)) {
          var rgb$1 = m2.slice(1, 5);
          for (var i$12 = 0; i$12 < 4; i$12++) {
            rgb$1[i$12] = +rgb$1[i$12];
          }
          return rgb$1;
        }
        if (m2 = css2.match(RE_RGB_PCT)) {
          var rgb$2 = m2.slice(1, 4);
          for (var i$2 = 0; i$2 < 3; i$2++) {
            rgb$2[i$2] = round$4(rgb$2[i$2] * 2.55);
          }
          rgb$2[3] = 1;
          return rgb$2;
        }
        if (m2 = css2.match(RE_RGBA_PCT)) {
          var rgb$3 = m2.slice(1, 5);
          for (var i$3 = 0; i$3 < 3; i$3++) {
            rgb$3[i$3] = round$4(rgb$3[i$3] * 2.55);
          }
          rgb$3[3] = +rgb$3[3];
          return rgb$3;
        }
        if (m2 = css2.match(RE_HSL)) {
          var hsl2 = m2.slice(1, 4);
          hsl2[1] *= 0.01;
          hsl2[2] *= 0.01;
          var rgb$4 = hsl2rgb(hsl2);
          rgb$4[3] = 1;
          return rgb$4;
        }
        if (m2 = css2.match(RE_HSLA)) {
          var hsl$1 = m2.slice(1, 4);
          hsl$1[1] *= 0.01;
          hsl$1[2] *= 0.01;
          var rgb$5 = hsl2rgb(hsl$1);
          rgb$5[3] = +m2[4];
          return rgb$5;
        }
      };
      css2rgb$1.test = function(s) {
        return RE_RGB.test(s) || RE_RGBA.test(s) || RE_RGB_PCT.test(s) || RE_RGBA_PCT.test(s) || RE_HSL.test(s) || RE_HSLA.test(s);
      };
      var css2rgb_1 = css2rgb$1;
      var chroma$i = chroma_1;
      var Color$B = Color_1;
      var input$e = input$h;
      var type$k = utils2.type;
      var rgb2css = rgb2css_1;
      var css2rgb = css2rgb_1;
      Color$B.prototype.css = function(mode) {
        return rgb2css(this._rgb, mode);
      };
      chroma$i.css = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$B, [null].concat(args, ["css"])))();
      };
      input$e.format.css = css2rgb;
      input$e.autodetect.push({
        p: 5,
        test: function(h2) {
          var rest = [], len = arguments.length - 1;
          while (len-- > 0)
            rest[len] = arguments[len + 1];
          if (!rest.length && type$k(h2) === "string" && css2rgb.test(h2)) {
            return "css";
          }
        }
      });
      var Color$A = Color_1;
      var chroma$h = chroma_1;
      var input$d = input$h;
      var unpack$t = utils2.unpack;
      input$d.format.gl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgb2 = unpack$t(args, "rgba");
        rgb2[0] *= 255;
        rgb2[1] *= 255;
        rgb2[2] *= 255;
        return rgb2;
      };
      chroma$h.gl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$A, [null].concat(args, ["gl"])))();
      };
      Color$A.prototype.gl = function() {
        var rgb2 = this._rgb;
        return [rgb2[0] / 255, rgb2[1] / 255, rgb2[2] / 255, rgb2[3]];
      };
      var unpack$s = utils2.unpack;
      var rgb2hcg$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$s(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        var min3 = Math.min(r2, g2, b2);
        var max3 = Math.max(r2, g2, b2);
        var delta = max3 - min3;
        var c2 = delta * 100 / 255;
        var _g = min3 / (255 - delta) * 100;
        var h2;
        if (delta === 0) {
          h2 = Number.NaN;
        } else {
          if (r2 === max3) {
            h2 = (g2 - b2) / delta;
          }
          if (g2 === max3) {
            h2 = 2 + (b2 - r2) / delta;
          }
          if (b2 === max3) {
            h2 = 4 + (r2 - g2) / delta;
          }
          h2 *= 60;
          if (h2 < 0) {
            h2 += 360;
          }
        }
        return [h2, c2, _g];
      };
      var rgb2hcg_1 = rgb2hcg$1;
      var unpack$r = utils2.unpack;
      var floor$3 = Math.floor;
      var hcg2rgb = function() {
        var assign2, assign$1, assign$2, assign$3, assign$4, assign$5;
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$r(args, "hcg");
        var h2 = args[0];
        var c2 = args[1];
        var _g = args[2];
        var r2, g2, b2;
        _g = _g * 255;
        var _c = c2 * 255;
        if (c2 === 0) {
          r2 = g2 = b2 = _g;
        } else {
          if (h2 === 360) {
            h2 = 0;
          }
          if (h2 > 360) {
            h2 -= 360;
          }
          if (h2 < 0) {
            h2 += 360;
          }
          h2 /= 60;
          var i2 = floor$3(h2);
          var f2 = h2 - i2;
          var p2 = _g * (1 - c2);
          var q2 = p2 + _c * (1 - f2);
          var t2 = p2 + _c * f2;
          var v2 = p2 + _c;
          switch (i2) {
            case 0:
              assign2 = [v2, t2, p2], r2 = assign2[0], g2 = assign2[1], b2 = assign2[2];
              break;
            case 1:
              assign$1 = [q2, v2, p2], r2 = assign$1[0], g2 = assign$1[1], b2 = assign$1[2];
              break;
            case 2:
              assign$2 = [p2, v2, t2], r2 = assign$2[0], g2 = assign$2[1], b2 = assign$2[2];
              break;
            case 3:
              assign$3 = [p2, q2, v2], r2 = assign$3[0], g2 = assign$3[1], b2 = assign$3[2];
              break;
            case 4:
              assign$4 = [t2, p2, v2], r2 = assign$4[0], g2 = assign$4[1], b2 = assign$4[2];
              break;
            case 5:
              assign$5 = [v2, p2, q2], r2 = assign$5[0], g2 = assign$5[1], b2 = assign$5[2];
              break;
          }
        }
        return [r2, g2, b2, args.length > 3 ? args[3] : 1];
      };
      var hcg2rgb_1 = hcg2rgb;
      var unpack$q = utils2.unpack;
      var type$j = utils2.type;
      var chroma$g = chroma_1;
      var Color$z = Color_1;
      var input$c = input$h;
      var rgb2hcg = rgb2hcg_1;
      Color$z.prototype.hcg = function() {
        return rgb2hcg(this._rgb);
      };
      chroma$g.hcg = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$z, [null].concat(args, ["hcg"])))();
      };
      input$c.format.hcg = hcg2rgb_1;
      input$c.autodetect.push({
        p: 1,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$q(args, "hcg");
          if (type$j(args) === "array" && args.length === 3) {
            return "hcg";
          }
        }
      });
      var unpack$p = utils2.unpack;
      var last = utils2.last;
      var round$3 = Math.round;
      var rgb2hex$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$p(args, "rgba");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        var a = ref[3];
        var mode = last(args) || "auto";
        if (a === void 0) {
          a = 1;
        }
        if (mode === "auto") {
          mode = a < 1 ? "rgba" : "rgb";
        }
        r2 = round$3(r2);
        g2 = round$3(g2);
        b2 = round$3(b2);
        var u2 = r2 << 16 | g2 << 8 | b2;
        var str = "000000" + u2.toString(16);
        str = str.substr(str.length - 6);
        var hxa = "0" + round$3(a * 255).toString(16);
        hxa = hxa.substr(hxa.length - 2);
        switch (mode.toLowerCase()) {
          case "rgba":
            return "#" + str + hxa;
          case "argb":
            return "#" + hxa + str;
          default:
            return "#" + str;
        }
      };
      var rgb2hex_1 = rgb2hex$2;
      var RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      var RE_HEXA = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/;
      var hex2rgb$1 = function(hex) {
        if (hex.match(RE_HEX)) {
          if (hex.length === 4 || hex.length === 7) {
            hex = hex.substr(1);
          }
          if (hex.length === 3) {
            hex = hex.split("");
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          }
          var u2 = parseInt(hex, 16);
          var r2 = u2 >> 16;
          var g2 = u2 >> 8 & 255;
          var b2 = u2 & 255;
          return [r2, g2, b2, 1];
        }
        if (hex.match(RE_HEXA)) {
          if (hex.length === 5 || hex.length === 9) {
            hex = hex.substr(1);
          }
          if (hex.length === 4) {
            hex = hex.split("");
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
          }
          var u$1 = parseInt(hex, 16);
          var r$12 = u$1 >> 24 & 255;
          var g$12 = u$1 >> 16 & 255;
          var b$12 = u$1 >> 8 & 255;
          var a = Math.round((u$1 & 255) / 255 * 100) / 100;
          return [r$12, g$12, b$12, a];
        }
        throw new Error("unknown hex color: " + hex);
      };
      var hex2rgb_1 = hex2rgb$1;
      var chroma$f = chroma_1;
      var Color$y = Color_1;
      var type$i = utils2.type;
      var input$b = input$h;
      var rgb2hex$1 = rgb2hex_1;
      Color$y.prototype.hex = function(mode) {
        return rgb2hex$1(this._rgb, mode);
      };
      chroma$f.hex = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$y, [null].concat(args, ["hex"])))();
      };
      input$b.format.hex = hex2rgb_1;
      input$b.autodetect.push({
        p: 4,
        test: function(h2) {
          var rest = [], len = arguments.length - 1;
          while (len-- > 0)
            rest[len] = arguments[len + 1];
          if (!rest.length && type$i(h2) === "string" && [3, 4, 5, 6, 7, 8, 9].indexOf(h2.length) >= 0) {
            return "hex";
          }
        }
      });
      var unpack$o = utils2.unpack;
      var TWOPI$2 = utils2.TWOPI;
      var min$2 = Math.min;
      var sqrt$4 = Math.sqrt;
      var acos = Math.acos;
      var rgb2hsi$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$o(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        r2 /= 255;
        g2 /= 255;
        b2 /= 255;
        var h2;
        var min_ = min$2(r2, g2, b2);
        var i2 = (r2 + g2 + b2) / 3;
        var s = i2 > 0 ? 1 - min_ / i2 : 0;
        if (s === 0) {
          h2 = NaN;
        } else {
          h2 = (r2 - g2 + (r2 - b2)) / 2;
          h2 /= sqrt$4((r2 - g2) * (r2 - g2) + (r2 - b2) * (g2 - b2));
          h2 = acos(h2);
          if (b2 > g2) {
            h2 = TWOPI$2 - h2;
          }
          h2 /= TWOPI$2;
        }
        return [h2 * 360, s, i2];
      };
      var rgb2hsi_1 = rgb2hsi$1;
      var unpack$n = utils2.unpack;
      var limit = utils2.limit;
      var TWOPI$1 = utils2.TWOPI;
      var PITHIRD = utils2.PITHIRD;
      var cos$4 = Math.cos;
      var hsi2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$n(args, "hsi");
        var h2 = args[0];
        var s = args[1];
        var i2 = args[2];
        var r2, g2, b2;
        if (isNaN(h2)) {
          h2 = 0;
        }
        if (isNaN(s)) {
          s = 0;
        }
        if (h2 > 360) {
          h2 -= 360;
        }
        if (h2 < 0) {
          h2 += 360;
        }
        h2 /= 360;
        if (h2 < 1 / 3) {
          b2 = (1 - s) / 3;
          r2 = (1 + s * cos$4(TWOPI$1 * h2) / cos$4(PITHIRD - TWOPI$1 * h2)) / 3;
          g2 = 1 - (b2 + r2);
        } else if (h2 < 2 / 3) {
          h2 -= 1 / 3;
          r2 = (1 - s) / 3;
          g2 = (1 + s * cos$4(TWOPI$1 * h2) / cos$4(PITHIRD - TWOPI$1 * h2)) / 3;
          b2 = 1 - (r2 + g2);
        } else {
          h2 -= 2 / 3;
          g2 = (1 - s) / 3;
          b2 = (1 + s * cos$4(TWOPI$1 * h2) / cos$4(PITHIRD - TWOPI$1 * h2)) / 3;
          r2 = 1 - (g2 + b2);
        }
        r2 = limit(i2 * r2 * 3);
        g2 = limit(i2 * g2 * 3);
        b2 = limit(i2 * b2 * 3);
        return [r2 * 255, g2 * 255, b2 * 255, args.length > 3 ? args[3] : 1];
      };
      var hsi2rgb_1 = hsi2rgb;
      var unpack$m = utils2.unpack;
      var type$h = utils2.type;
      var chroma$e = chroma_1;
      var Color$x = Color_1;
      var input$a = input$h;
      var rgb2hsi = rgb2hsi_1;
      Color$x.prototype.hsi = function() {
        return rgb2hsi(this._rgb);
      };
      chroma$e.hsi = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$x, [null].concat(args, ["hsi"])))();
      };
      input$a.format.hsi = hsi2rgb_1;
      input$a.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$m(args, "hsi");
          if (type$h(args) === "array" && args.length === 3) {
            return "hsi";
          }
        }
      });
      var unpack$l = utils2.unpack;
      var type$g = utils2.type;
      var chroma$d = chroma_1;
      var Color$w = Color_1;
      var input$9 = input$h;
      var rgb2hsl$1 = rgb2hsl_1;
      Color$w.prototype.hsl = function() {
        return rgb2hsl$1(this._rgb);
      };
      chroma$d.hsl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$w, [null].concat(args, ["hsl"])))();
      };
      input$9.format.hsl = hsl2rgb_1;
      input$9.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$l(args, "hsl");
          if (type$g(args) === "array" && args.length === 3) {
            return "hsl";
          }
        }
      });
      var unpack$k = utils2.unpack;
      var min$1 = Math.min;
      var max$1 = Math.max;
      var rgb2hsl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$k(args, "rgb");
        var r2 = args[0];
        var g2 = args[1];
        var b2 = args[2];
        var min_ = min$1(r2, g2, b2);
        var max_ = max$1(r2, g2, b2);
        var delta = max_ - min_;
        var h2, s, v2;
        v2 = max_ / 255;
        if (max_ === 0) {
          h2 = Number.NaN;
          s = 0;
        } else {
          s = delta / max_;
          if (r2 === max_) {
            h2 = (g2 - b2) / delta;
          }
          if (g2 === max_) {
            h2 = 2 + (b2 - r2) / delta;
          }
          if (b2 === max_) {
            h2 = 4 + (r2 - g2) / delta;
          }
          h2 *= 60;
          if (h2 < 0) {
            h2 += 360;
          }
        }
        return [h2, s, v2];
      };
      var rgb2hsv$1 = rgb2hsl;
      var unpack$j = utils2.unpack;
      var floor$2 = Math.floor;
      var hsv2rgb = function() {
        var assign2, assign$1, assign$2, assign$3, assign$4, assign$5;
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$j(args, "hsv");
        var h2 = args[0];
        var s = args[1];
        var v2 = args[2];
        var r2, g2, b2;
        v2 *= 255;
        if (s === 0) {
          r2 = g2 = b2 = v2;
        } else {
          if (h2 === 360) {
            h2 = 0;
          }
          if (h2 > 360) {
            h2 -= 360;
          }
          if (h2 < 0) {
            h2 += 360;
          }
          h2 /= 60;
          var i2 = floor$2(h2);
          var f2 = h2 - i2;
          var p2 = v2 * (1 - s);
          var q2 = v2 * (1 - s * f2);
          var t2 = v2 * (1 - s * (1 - f2));
          switch (i2) {
            case 0:
              assign2 = [v2, t2, p2], r2 = assign2[0], g2 = assign2[1], b2 = assign2[2];
              break;
            case 1:
              assign$1 = [q2, v2, p2], r2 = assign$1[0], g2 = assign$1[1], b2 = assign$1[2];
              break;
            case 2:
              assign$2 = [p2, v2, t2], r2 = assign$2[0], g2 = assign$2[1], b2 = assign$2[2];
              break;
            case 3:
              assign$3 = [p2, q2, v2], r2 = assign$3[0], g2 = assign$3[1], b2 = assign$3[2];
              break;
            case 4:
              assign$4 = [t2, p2, v2], r2 = assign$4[0], g2 = assign$4[1], b2 = assign$4[2];
              break;
            case 5:
              assign$5 = [v2, p2, q2], r2 = assign$5[0], g2 = assign$5[1], b2 = assign$5[2];
              break;
          }
        }
        return [r2, g2, b2, args.length > 3 ? args[3] : 1];
      };
      var hsv2rgb_1 = hsv2rgb;
      var unpack$i = utils2.unpack;
      var type$f = utils2.type;
      var chroma$c = chroma_1;
      var Color$v = Color_1;
      var input$8 = input$h;
      var rgb2hsv = rgb2hsv$1;
      Color$v.prototype.hsv = function() {
        return rgb2hsv(this._rgb);
      };
      chroma$c.hsv = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$v, [null].concat(args, ["hsv"])))();
      };
      input$8.format.hsv = hsv2rgb_1;
      input$8.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$i(args, "hsv");
          if (type$f(args) === "array" && args.length === 3) {
            return "hsv";
          }
        }
      });
      var labConstants = {
        // Corresponds roughly to RGB brighter/darker
        Kn: 18,
        // D65 standard referent
        Xn: 0.95047,
        Yn: 1,
        Zn: 1.08883,
        t0: 0.137931034,
        // 4 / 29
        t1: 0.206896552,
        // 6 / 29
        t2: 0.12841855,
        // 3 * t1 * t1
        t3: 8856452e-9
        // t1 * t1 * t1
      };
      var LAB_CONSTANTS$3 = labConstants;
      var unpack$h = utils2.unpack;
      var pow$a = Math.pow;
      var rgb2lab$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$h(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        var ref$1 = rgb2xyz(r2, g2, b2);
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        var l2 = 116 * y2 - 16;
        return [l2 < 0 ? 0 : l2, 500 * (x2 - y2), 200 * (y2 - z2)];
      };
      var rgb_xyz = function(r2) {
        if ((r2 /= 255) <= 0.04045) {
          return r2 / 12.92;
        }
        return pow$a((r2 + 0.055) / 1.055, 2.4);
      };
      var xyz_lab = function(t2) {
        if (t2 > LAB_CONSTANTS$3.t3) {
          return pow$a(t2, 1 / 3);
        }
        return t2 / LAB_CONSTANTS$3.t2 + LAB_CONSTANTS$3.t0;
      };
      var rgb2xyz = function(r2, g2, b2) {
        r2 = rgb_xyz(r2);
        g2 = rgb_xyz(g2);
        b2 = rgb_xyz(b2);
        var x2 = xyz_lab((0.4124564 * r2 + 0.3575761 * g2 + 0.1804375 * b2) / LAB_CONSTANTS$3.Xn);
        var y2 = xyz_lab((0.2126729 * r2 + 0.7151522 * g2 + 0.072175 * b2) / LAB_CONSTANTS$3.Yn);
        var z2 = xyz_lab((0.0193339 * r2 + 0.119192 * g2 + 0.9503041 * b2) / LAB_CONSTANTS$3.Zn);
        return [x2, y2, z2];
      };
      var rgb2lab_1 = rgb2lab$2;
      var LAB_CONSTANTS$2 = labConstants;
      var unpack$g = utils2.unpack;
      var pow$9 = Math.pow;
      var lab2rgb$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$g(args, "lab");
        var l2 = args[0];
        var a = args[1];
        var b2 = args[2];
        var x2, y2, z2, r2, g2, b_;
        y2 = (l2 + 16) / 116;
        x2 = isNaN(a) ? y2 : y2 + a / 500;
        z2 = isNaN(b2) ? y2 : y2 - b2 / 200;
        y2 = LAB_CONSTANTS$2.Yn * lab_xyz(y2);
        x2 = LAB_CONSTANTS$2.Xn * lab_xyz(x2);
        z2 = LAB_CONSTANTS$2.Zn * lab_xyz(z2);
        r2 = xyz_rgb(3.2404542 * x2 - 1.5371385 * y2 - 0.4985314 * z2);
        g2 = xyz_rgb(-0.969266 * x2 + 1.8760108 * y2 + 0.041556 * z2);
        b_ = xyz_rgb(0.0556434 * x2 - 0.2040259 * y2 + 1.0572252 * z2);
        return [r2, g2, b_, args.length > 3 ? args[3] : 1];
      };
      var xyz_rgb = function(r2) {
        return 255 * (r2 <= 304e-5 ? 12.92 * r2 : 1.055 * pow$9(r2, 1 / 2.4) - 0.055);
      };
      var lab_xyz = function(t2) {
        return t2 > LAB_CONSTANTS$2.t1 ? t2 * t2 * t2 : LAB_CONSTANTS$2.t2 * (t2 - LAB_CONSTANTS$2.t0);
      };
      var lab2rgb_1 = lab2rgb$1;
      var unpack$f = utils2.unpack;
      var type$e = utils2.type;
      var chroma$b = chroma_1;
      var Color$u = Color_1;
      var input$7 = input$h;
      var rgb2lab$1 = rgb2lab_1;
      Color$u.prototype.lab = function() {
        return rgb2lab$1(this._rgb);
      };
      chroma$b.lab = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$u, [null].concat(args, ["lab"])))();
      };
      input$7.format.lab = lab2rgb_1;
      input$7.autodetect.push({
        p: 2,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$f(args, "lab");
          if (type$e(args) === "array" && args.length === 3) {
            return "lab";
          }
        }
      });
      var unpack$e = utils2.unpack;
      var RAD2DEG = utils2.RAD2DEG;
      var sqrt$3 = Math.sqrt;
      var atan2$2 = Math.atan2;
      var round$22 = Math.round;
      var lab2lch$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$e(args, "lab");
        var l2 = ref[0];
        var a = ref[1];
        var b2 = ref[2];
        var c2 = sqrt$3(a * a + b2 * b2);
        var h2 = (atan2$2(b2, a) * RAD2DEG + 360) % 360;
        if (round$22(c2 * 1e4) === 0) {
          h2 = Number.NaN;
        }
        return [l2, c2, h2];
      };
      var lab2lch_1 = lab2lch$2;
      var unpack$d = utils2.unpack;
      var rgb2lab = rgb2lab_1;
      var lab2lch$1 = lab2lch_1;
      var rgb2lch$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$d(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        var ref$1 = rgb2lab(r2, g2, b2);
        var l2 = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch$1(l2, a, b_);
      };
      var rgb2lch_1 = rgb2lch$1;
      var unpack$c = utils2.unpack;
      var DEG2RAD = utils2.DEG2RAD;
      var sin$3 = Math.sin;
      var cos$3 = Math.cos;
      var lch2lab$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$c(args, "lch");
        var l2 = ref[0];
        var c2 = ref[1];
        var h2 = ref[2];
        if (isNaN(h2)) {
          h2 = 0;
        }
        h2 = h2 * DEG2RAD;
        return [l2, cos$3(h2) * c2, sin$3(h2) * c2];
      };
      var lch2lab_1 = lch2lab$2;
      var unpack$b = utils2.unpack;
      var lch2lab$1 = lch2lab_1;
      var lab2rgb = lab2rgb_1;
      var lch2rgb$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$b(args, "lch");
        var l2 = args[0];
        var c2 = args[1];
        var h2 = args[2];
        var ref = lch2lab$1(l2, c2, h2);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = lab2rgb(L, a, b_);
        var r2 = ref$1[0];
        var g2 = ref$1[1];
        var b2 = ref$1[2];
        return [r2, g2, b2, args.length > 3 ? args[3] : 1];
      };
      var lch2rgb_1 = lch2rgb$1;
      var unpack$a = utils2.unpack;
      var lch2rgb = lch2rgb_1;
      var hcl2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var hcl = unpack$a(args, "hcl").reverse();
        return lch2rgb.apply(void 0, hcl);
      };
      var hcl2rgb_1 = hcl2rgb;
      var unpack$9 = utils2.unpack;
      var type$d = utils2.type;
      var chroma$a = chroma_1;
      var Color$t = Color_1;
      var input$6 = input$h;
      var rgb2lch = rgb2lch_1;
      Color$t.prototype.lch = function() {
        return rgb2lch(this._rgb);
      };
      Color$t.prototype.hcl = function() {
        return rgb2lch(this._rgb).reverse();
      };
      chroma$a.lch = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$t, [null].concat(args, ["lch"])))();
      };
      chroma$a.hcl = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$t, [null].concat(args, ["hcl"])))();
      };
      input$6.format.lch = lch2rgb_1;
      input$6.format.hcl = hcl2rgb_1;
      ["lch", "hcl"].forEach(function(m2) {
        return input$6.autodetect.push({
          p: 2,
          test: function() {
            var args = [], len = arguments.length;
            while (len--)
              args[len] = arguments[len];
            args = unpack$9(args, m2);
            if (type$d(args) === "array" && args.length === 3) {
              return m2;
            }
          }
        });
      });
      var w3cx11$1 = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflower: "#6495ed",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        laserlemon: "#ffff54",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrod: "#fafad2",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        maroon2: "#7f0000",
        maroon3: "#b03060",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        purple2: "#7f007f",
        purple3: "#a020f0",
        rebeccapurple: "#663399",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
      };
      var w3cx11_1 = w3cx11$1;
      var Color$s = Color_1;
      var input$5 = input$h;
      var type$c = utils2.type;
      var w3cx11 = w3cx11_1;
      var hex2rgb = hex2rgb_1;
      var rgb2hex = rgb2hex_1;
      Color$s.prototype.name = function() {
        var hex = rgb2hex(this._rgb, "rgb");
        for (var i2 = 0, list2 = Object.keys(w3cx11); i2 < list2.length; i2 += 1) {
          var n2 = list2[i2];
          if (w3cx11[n2] === hex) {
            return n2.toLowerCase();
          }
        }
        return hex;
      };
      input$5.format.named = function(name2) {
        name2 = name2.toLowerCase();
        if (w3cx11[name2]) {
          return hex2rgb(w3cx11[name2]);
        }
        throw new Error("unknown color name: " + name2);
      };
      input$5.autodetect.push({
        p: 5,
        test: function(h2) {
          var rest = [], len = arguments.length - 1;
          while (len-- > 0)
            rest[len] = arguments[len + 1];
          if (!rest.length && type$c(h2) === "string" && w3cx11[h2.toLowerCase()]) {
            return "named";
          }
        }
      });
      var unpack$8 = utils2.unpack;
      var rgb2num$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$8(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        return (r2 << 16) + (g2 << 8) + b2;
      };
      var rgb2num_1 = rgb2num$1;
      var type$b = utils2.type;
      var num2rgb = function(num2) {
        if (type$b(num2) == "number" && num2 >= 0 && num2 <= 16777215) {
          var r2 = num2 >> 16;
          var g2 = num2 >> 8 & 255;
          var b2 = num2 & 255;
          return [r2, g2, b2, 1];
        }
        throw new Error("unknown num color: " + num2);
      };
      var num2rgb_1 = num2rgb;
      var chroma$9 = chroma_1;
      var Color$r = Color_1;
      var input$4 = input$h;
      var type$a = utils2.type;
      var rgb2num = rgb2num_1;
      Color$r.prototype.num = function() {
        return rgb2num(this._rgb);
      };
      chroma$9.num = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$r, [null].concat(args, ["num"])))();
      };
      input$4.format.num = num2rgb_1;
      input$4.autodetect.push({
        p: 5,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          if (args.length === 1 && type$a(args[0]) === "number" && args[0] >= 0 && args[0] <= 16777215) {
            return "num";
          }
        }
      });
      var chroma$8 = chroma_1;
      var Color$q = Color_1;
      var input$3 = input$h;
      var unpack$7 = utils2.unpack;
      var type$9 = utils2.type;
      var round$12 = Math.round;
      Color$q.prototype.rgb = function(rnd2) {
        if (rnd2 === void 0)
          rnd2 = true;
        if (rnd2 === false) {
          return this._rgb.slice(0, 3);
        }
        return this._rgb.slice(0, 3).map(round$12);
      };
      Color$q.prototype.rgba = function(rnd2) {
        if (rnd2 === void 0)
          rnd2 = true;
        return this._rgb.slice(0, 4).map(function(v2, i2) {
          return i2 < 3 ? rnd2 === false ? v2 : round$12(v2) : v2;
        });
      };
      chroma$8.rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$q, [null].concat(args, ["rgb"])))();
      };
      input$3.format.rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgba2 = unpack$7(args, "rgba");
        if (rgba2[3] === void 0) {
          rgba2[3] = 1;
        }
        return rgba2;
      };
      input$3.autodetect.push({
        p: 3,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$7(args, "rgba");
          if (type$9(args) === "array" && (args.length === 3 || args.length === 4 && type$9(args[3]) == "number" && args[3] >= 0 && args[3] <= 1)) {
            return "rgb";
          }
        }
      });
      var log$1 = Math.log;
      var temperature2rgb$1 = function(kelvin) {
        var temp = kelvin / 100;
        var r2, g2, b2;
        if (temp < 66) {
          r2 = 255;
          g2 = temp < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (g2 = temp - 2) + 104.49216199393888 * log$1(g2);
          b2 = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b2 = temp - 10) + 115.67994401066147 * log$1(b2);
        } else {
          r2 = 351.97690566805693 + 0.114206453784165 * (r2 = temp - 55) - 40.25366309332127 * log$1(r2);
          g2 = 325.4494125711974 + 0.07943456536662342 * (g2 = temp - 50) - 28.0852963507957 * log$1(g2);
          b2 = 255;
        }
        return [r2, g2, b2, 1];
      };
      var temperature2rgb_1 = temperature2rgb$1;
      var temperature2rgb = temperature2rgb_1;
      var unpack$6 = utils2.unpack;
      var round2 = Math.round;
      var rgb2temperature$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var rgb2 = unpack$6(args, "rgb");
        var r2 = rgb2[0], b2 = rgb2[2];
        var minTemp = 1e3;
        var maxTemp = 4e4;
        var eps = 0.4;
        var temp;
        while (maxTemp - minTemp > eps) {
          temp = (maxTemp + minTemp) * 0.5;
          var rgb$1 = temperature2rgb(temp);
          if (rgb$1[2] / rgb$1[0] >= b2 / r2) {
            maxTemp = temp;
          } else {
            minTemp = temp;
          }
        }
        return round2(temp);
      };
      var rgb2temperature_1 = rgb2temperature$1;
      var chroma$7 = chroma_1;
      var Color$p = Color_1;
      var input$2 = input$h;
      var rgb2temperature = rgb2temperature_1;
      Color$p.prototype.temp = Color$p.prototype.kelvin = Color$p.prototype.temperature = function() {
        return rgb2temperature(this._rgb);
      };
      chroma$7.temp = chroma$7.kelvin = chroma$7.temperature = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$p, [null].concat(args, ["temp"])))();
      };
      input$2.format.temp = input$2.format.kelvin = input$2.format.temperature = temperature2rgb_1;
      var unpack$5 = utils2.unpack;
      var cbrt = Math.cbrt;
      var pow$8 = Math.pow;
      var sign$1 = Math.sign;
      var rgb2oklab$2 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$5(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        var ref$1 = [rgb2lrgb(r2 / 255), rgb2lrgb(g2 / 255), rgb2lrgb(b2 / 255)];
        var lr = ref$1[0];
        var lg = ref$1[1];
        var lb = ref$1[2];
        var l2 = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
        var m2 = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
        var s = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
        return [
          0.2104542553 * l2 + 0.793617785 * m2 - 0.0040720468 * s,
          1.9779984951 * l2 - 2.428592205 * m2 + 0.4505937099 * s,
          0.0259040371 * l2 + 0.7827717662 * m2 - 0.808675766 * s
        ];
      };
      var rgb2oklab_1 = rgb2oklab$2;
      function rgb2lrgb(c2) {
        var abs3 = Math.abs(c2);
        if (abs3 < 0.04045) {
          return c2 / 12.92;
        }
        return (sign$1(c2) || 1) * pow$8((abs3 + 0.055) / 1.055, 2.4);
      }
      var unpack$4 = utils2.unpack;
      var pow$7 = Math.pow;
      var sign = Math.sign;
      var oklab2rgb$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$4(args, "lab");
        var L = args[0];
        var a = args[1];
        var b2 = args[2];
        var l2 = pow$7(L + 0.3963377774 * a + 0.2158037573 * b2, 3);
        var m2 = pow$7(L - 0.1055613458 * a - 0.0638541728 * b2, 3);
        var s = pow$7(L - 0.0894841775 * a - 1.291485548 * b2, 3);
        return [
          255 * lrgb2rgb(4.0767416621 * l2 - 3.3077115913 * m2 + 0.2309699292 * s),
          255 * lrgb2rgb(-1.2684380046 * l2 + 2.6097574011 * m2 - 0.3413193965 * s),
          255 * lrgb2rgb(-0.0041960863 * l2 - 0.7034186147 * m2 + 1.707614701 * s),
          args.length > 3 ? args[3] : 1
        ];
      };
      var oklab2rgb_1 = oklab2rgb$1;
      function lrgb2rgb(c2) {
        var abs3 = Math.abs(c2);
        if (abs3 > 31308e-7) {
          return (sign(c2) || 1) * (1.055 * pow$7(abs3, 1 / 2.4) - 0.055);
        }
        return c2 * 12.92;
      }
      var unpack$3 = utils2.unpack;
      var type$8 = utils2.type;
      var chroma$6 = chroma_1;
      var Color$o = Color_1;
      var input$1 = input$h;
      var rgb2oklab$1 = rgb2oklab_1;
      Color$o.prototype.oklab = function() {
        return rgb2oklab$1(this._rgb);
      };
      chroma$6.oklab = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$o, [null].concat(args, ["oklab"])))();
      };
      input$1.format.oklab = oklab2rgb_1;
      input$1.autodetect.push({
        p: 3,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack$3(args, "oklab");
          if (type$8(args) === "array" && args.length === 3) {
            return "oklab";
          }
        }
      });
      var unpack$2 = utils2.unpack;
      var rgb2oklab = rgb2oklab_1;
      var lab2lch = lab2lch_1;
      var rgb2oklch$1 = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        var ref = unpack$2(args, "rgb");
        var r2 = ref[0];
        var g2 = ref[1];
        var b2 = ref[2];
        var ref$1 = rgb2oklab(r2, g2, b2);
        var l2 = ref$1[0];
        var a = ref$1[1];
        var b_ = ref$1[2];
        return lab2lch(l2, a, b_);
      };
      var rgb2oklch_1 = rgb2oklch$1;
      var unpack$1 = utils2.unpack;
      var lch2lab = lch2lab_1;
      var oklab2rgb = oklab2rgb_1;
      var oklch2rgb = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        args = unpack$1(args, "lch");
        var l2 = args[0];
        var c2 = args[1];
        var h2 = args[2];
        var ref = lch2lab(l2, c2, h2);
        var L = ref[0];
        var a = ref[1];
        var b_ = ref[2];
        var ref$1 = oklab2rgb(L, a, b_);
        var r2 = ref$1[0];
        var g2 = ref$1[1];
        var b2 = ref$1[2];
        return [r2, g2, b2, args.length > 3 ? args[3] : 1];
      };
      var oklch2rgb_1 = oklch2rgb;
      var unpack = utils2.unpack;
      var type$7 = utils2.type;
      var chroma$5 = chroma_1;
      var Color$n = Color_1;
      var input2 = input$h;
      var rgb2oklch = rgb2oklch_1;
      Color$n.prototype.oklch = function() {
        return rgb2oklch(this._rgb);
      };
      chroma$5.oklch = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        return new (Function.prototype.bind.apply(Color$n, [null].concat(args, ["oklch"])))();
      };
      input2.format.oklch = oklch2rgb_1;
      input2.autodetect.push({
        p: 3,
        test: function() {
          var args = [], len = arguments.length;
          while (len--)
            args[len] = arguments[len];
          args = unpack(args, "oklch");
          if (type$7(args) === "array" && args.length === 3) {
            return "oklch";
          }
        }
      });
      var Color$m = Color_1;
      var type$6 = utils2.type;
      Color$m.prototype.alpha = function(a, mutate) {
        if (mutate === void 0)
          mutate = false;
        if (a !== void 0 && type$6(a) === "number") {
          if (mutate) {
            this._rgb[3] = a;
            return this;
          }
          return new Color$m([this._rgb[0], this._rgb[1], this._rgb[2], a], "rgb");
        }
        return this._rgb[3];
      };
      var Color$l = Color_1;
      Color$l.prototype.clipped = function() {
        return this._rgb._clipped || false;
      };
      var Color$k = Color_1;
      var LAB_CONSTANTS$1 = labConstants;
      Color$k.prototype.darken = function(amount) {
        if (amount === void 0)
          amount = 1;
        var me = this;
        var lab2 = me.lab();
        lab2[0] -= LAB_CONSTANTS$1.Kn * amount;
        return new Color$k(lab2, "lab").alpha(me.alpha(), true);
      };
      Color$k.prototype.brighten = function(amount) {
        if (amount === void 0)
          amount = 1;
        return this.darken(-amount);
      };
      Color$k.prototype.darker = Color$k.prototype.darken;
      Color$k.prototype.brighter = Color$k.prototype.brighten;
      var Color$j = Color_1;
      Color$j.prototype.get = function(mc) {
        var ref = mc.split(".");
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
          var i2 = mode.indexOf(channel) - (mode.substr(0, 2) === "ok" ? 2 : 0);
          if (i2 > -1) {
            return src[i2];
          }
          throw new Error("unknown channel " + channel + " in mode " + mode);
        } else {
          return src;
        }
      };
      var Color$i = Color_1;
      var type$5 = utils2.type;
      var pow$6 = Math.pow;
      var EPS = 1e-7;
      var MAX_ITER = 20;
      Color$i.prototype.luminance = function(lum) {
        if (lum !== void 0 && type$5(lum) === "number") {
          if (lum === 0) {
            return new Color$i([0, 0, 0, this._rgb[3]], "rgb");
          }
          if (lum === 1) {
            return new Color$i([255, 255, 255, this._rgb[3]], "rgb");
          }
          var cur_lum = this.luminance();
          var mode = "rgb";
          var max_iter = MAX_ITER;
          var test = function(low, high) {
            var mid = low.interpolate(high, 0.5, mode);
            var lm = mid.luminance();
            if (Math.abs(lum - lm) < EPS || !max_iter--) {
              return mid;
            }
            return lm > lum ? test(low, mid) : test(mid, high);
          };
          var rgb2 = (cur_lum > lum ? test(new Color$i([0, 0, 0]), this) : test(this, new Color$i([255, 255, 255]))).rgb();
          return new Color$i(rgb2.concat([this._rgb[3]]));
        }
        return rgb2luminance.apply(void 0, this._rgb.slice(0, 3));
      };
      var rgb2luminance = function(r2, g2, b2) {
        r2 = luminance_x(r2);
        g2 = luminance_x(g2);
        b2 = luminance_x(b2);
        return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
      };
      var luminance_x = function(x2) {
        x2 /= 255;
        return x2 <= 0.03928 ? x2 / 12.92 : pow$6((x2 + 0.055) / 1.055, 2.4);
      };
      var interpolator$1 = {};
      var Color$h = Color_1;
      var type$4 = utils2.type;
      var interpolator = interpolator$1;
      var mix$1 = function(col1, col2, f2) {
        if (f2 === void 0)
          f2 = 0.5;
        var rest = [], len = arguments.length - 3;
        while (len-- > 0)
          rest[len] = arguments[len + 3];
        var mode = rest[0] || "lrgb";
        if (!interpolator[mode] && !rest.length) {
          mode = Object.keys(interpolator)[0];
        }
        if (!interpolator[mode]) {
          throw new Error("interpolation mode " + mode + " is not defined");
        }
        if (type$4(col1) !== "object") {
          col1 = new Color$h(col1);
        }
        if (type$4(col2) !== "object") {
          col2 = new Color$h(col2);
        }
        return interpolator[mode](col1, col2, f2).alpha(col1.alpha() + f2 * (col2.alpha() - col1.alpha()));
      };
      var Color$g = Color_1;
      var mix = mix$1;
      Color$g.prototype.mix = Color$g.prototype.interpolate = function(col2, f2) {
        if (f2 === void 0)
          f2 = 0.5;
        var rest = [], len = arguments.length - 2;
        while (len-- > 0)
          rest[len] = arguments[len + 2];
        return mix.apply(void 0, [this, col2, f2].concat(rest));
      };
      var Color$f = Color_1;
      Color$f.prototype.premultiply = function(mutate) {
        if (mutate === void 0)
          mutate = false;
        var rgb2 = this._rgb;
        var a = rgb2[3];
        if (mutate) {
          this._rgb = [rgb2[0] * a, rgb2[1] * a, rgb2[2] * a, a];
          return this;
        } else {
          return new Color$f([rgb2[0] * a, rgb2[1] * a, rgb2[2] * a, a], "rgb");
        }
      };
      var Color$e = Color_1;
      var LAB_CONSTANTS = labConstants;
      Color$e.prototype.saturate = function(amount) {
        if (amount === void 0)
          amount = 1;
        var me = this;
        var lch2 = me.lch();
        lch2[1] += LAB_CONSTANTS.Kn * amount;
        if (lch2[1] < 0) {
          lch2[1] = 0;
        }
        return new Color$e(lch2, "lch").alpha(me.alpha(), true);
      };
      Color$e.prototype.desaturate = function(amount) {
        if (amount === void 0)
          amount = 1;
        return this.saturate(-amount);
      };
      var Color$d = Color_1;
      var type$3 = utils2.type;
      Color$d.prototype.set = function(mc, value, mutate) {
        if (mutate === void 0)
          mutate = false;
        var ref = mc.split(".");
        var mode = ref[0];
        var channel = ref[1];
        var src = this[mode]();
        if (channel) {
          var i2 = mode.indexOf(channel) - (mode.substr(0, 2) === "ok" ? 2 : 0);
          if (i2 > -1) {
            if (type$3(value) == "string") {
              switch (value.charAt(0)) {
                case "+":
                  src[i2] += +value;
                  break;
                case "-":
                  src[i2] += +value;
                  break;
                case "*":
                  src[i2] *= +value.substr(1);
                  break;
                case "/":
                  src[i2] /= +value.substr(1);
                  break;
                default:
                  src[i2] = +value;
              }
            } else if (type$3(value) === "number") {
              src[i2] = value;
            } else {
              throw new Error("unsupported value for Color.set");
            }
            var out = new Color$d(src, mode);
            if (mutate) {
              this._rgb = out._rgb;
              return this;
            }
            return out;
          }
          throw new Error("unknown channel " + channel + " in mode " + mode);
        } else {
          return src;
        }
      };
      var Color$c = Color_1;
      var rgb = function(col1, col2, f2) {
        var xyz0 = col1._rgb;
        var xyz1 = col2._rgb;
        return new Color$c(
          xyz0[0] + f2 * (xyz1[0] - xyz0[0]),
          xyz0[1] + f2 * (xyz1[1] - xyz0[1]),
          xyz0[2] + f2 * (xyz1[2] - xyz0[2]),
          "rgb"
        );
      };
      interpolator$1.rgb = rgb;
      var Color$b = Color_1;
      var sqrt$2 = Math.sqrt;
      var pow$5 = Math.pow;
      var lrgb = function(col1, col2, f2) {
        var ref = col1._rgb;
        var x1 = ref[0];
        var y1 = ref[1];
        var z1 = ref[2];
        var ref$1 = col2._rgb;
        var x2 = ref$1[0];
        var y2 = ref$1[1];
        var z2 = ref$1[2];
        return new Color$b(
          sqrt$2(pow$5(x1, 2) * (1 - f2) + pow$5(x2, 2) * f2),
          sqrt$2(pow$5(y1, 2) * (1 - f2) + pow$5(y2, 2) * f2),
          sqrt$2(pow$5(z1, 2) * (1 - f2) + pow$5(z2, 2) * f2),
          "rgb"
        );
      };
      interpolator$1.lrgb = lrgb;
      var Color$a = Color_1;
      var lab = function(col1, col2, f2) {
        var xyz0 = col1.lab();
        var xyz1 = col2.lab();
        return new Color$a(
          xyz0[0] + f2 * (xyz1[0] - xyz0[0]),
          xyz0[1] + f2 * (xyz1[1] - xyz0[1]),
          xyz0[2] + f2 * (xyz1[2] - xyz0[2]),
          "lab"
        );
      };
      interpolator$1.lab = lab;
      var Color$9 = Color_1;
      var _hsx = function(col1, col2, f2, m2) {
        var assign2, assign$1;
        var xyz0, xyz1;
        if (m2 === "hsl") {
          xyz0 = col1.hsl();
          xyz1 = col2.hsl();
        } else if (m2 === "hsv") {
          xyz0 = col1.hsv();
          xyz1 = col2.hsv();
        } else if (m2 === "hcg") {
          xyz0 = col1.hcg();
          xyz1 = col2.hcg();
        } else if (m2 === "hsi") {
          xyz0 = col1.hsi();
          xyz1 = col2.hsi();
        } else if (m2 === "lch" || m2 === "hcl") {
          m2 = "hcl";
          xyz0 = col1.hcl();
          xyz1 = col2.hcl();
        } else if (m2 === "oklch") {
          xyz0 = col1.oklch().reverse();
          xyz1 = col2.oklch().reverse();
        }
        var hue0, hue1, sat0, sat1, lbv0, lbv1;
        if (m2.substr(0, 1) === "h" || m2 === "oklch") {
          assign2 = xyz0, hue0 = assign2[0], sat0 = assign2[1], lbv0 = assign2[2];
          assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2];
        }
        var sat, hue, lbv, dh;
        if (!isNaN(hue0) && !isNaN(hue1)) {
          if (hue1 > hue0 && hue1 - hue0 > 180) {
            dh = hue1 - (hue0 + 360);
          } else if (hue1 < hue0 && hue0 - hue1 > 180) {
            dh = hue1 + 360 - hue0;
          } else {
            dh = hue1 - hue0;
          }
          hue = hue0 + f2 * dh;
        } else if (!isNaN(hue0)) {
          hue = hue0;
          if ((lbv1 == 1 || lbv1 == 0) && m2 != "hsv") {
            sat = sat0;
          }
        } else if (!isNaN(hue1)) {
          hue = hue1;
          if ((lbv0 == 1 || lbv0 == 0) && m2 != "hsv") {
            sat = sat1;
          }
        } else {
          hue = Number.NaN;
        }
        if (sat === void 0) {
          sat = sat0 + f2 * (sat1 - sat0);
        }
        lbv = lbv0 + f2 * (lbv1 - lbv0);
        return m2 === "oklch" ? new Color$9([lbv, sat, hue], m2) : new Color$9([hue, sat, lbv], m2);
      };
      var interpolate_hsx$5 = _hsx;
      var lch = function(col1, col2, f2) {
        return interpolate_hsx$5(col1, col2, f2, "lch");
      };
      interpolator$1.lch = lch;
      interpolator$1.hcl = lch;
      var Color$8 = Color_1;
      var num = function(col1, col2, f2) {
        var c1 = col1.num();
        var c2 = col2.num();
        return new Color$8(c1 + f2 * (c2 - c1), "num");
      };
      interpolator$1.num = num;
      var interpolate_hsx$4 = _hsx;
      var hcg = function(col1, col2, f2) {
        return interpolate_hsx$4(col1, col2, f2, "hcg");
      };
      interpolator$1.hcg = hcg;
      var interpolate_hsx$3 = _hsx;
      var hsi = function(col1, col2, f2) {
        return interpolate_hsx$3(col1, col2, f2, "hsi");
      };
      interpolator$1.hsi = hsi;
      var interpolate_hsx$2 = _hsx;
      var hsl = function(col1, col2, f2) {
        return interpolate_hsx$2(col1, col2, f2, "hsl");
      };
      interpolator$1.hsl = hsl;
      var interpolate_hsx$1 = _hsx;
      var hsv = function(col1, col2, f2) {
        return interpolate_hsx$1(col1, col2, f2, "hsv");
      };
      interpolator$1.hsv = hsv;
      var Color$7 = Color_1;
      var oklab = function(col1, col2, f2) {
        var xyz0 = col1.oklab();
        var xyz1 = col2.oklab();
        return new Color$7(
          xyz0[0] + f2 * (xyz1[0] - xyz0[0]),
          xyz0[1] + f2 * (xyz1[1] - xyz0[1]),
          xyz0[2] + f2 * (xyz1[2] - xyz0[2]),
          "oklab"
        );
      };
      interpolator$1.oklab = oklab;
      var interpolate_hsx = _hsx;
      var oklch = function(col1, col2, f2) {
        return interpolate_hsx(col1, col2, f2, "oklch");
      };
      interpolator$1.oklch = oklch;
      var Color$6 = Color_1;
      var clip_rgb$1 = utils2.clip_rgb;
      var pow$4 = Math.pow;
      var sqrt$1 = Math.sqrt;
      var PI$1 = Math.PI;
      var cos$2 = Math.cos;
      var sin$2 = Math.sin;
      var atan2$1 = Math.atan2;
      var average = function(colors, mode, weights) {
        if (mode === void 0)
          mode = "lrgb";
        if (weights === void 0)
          weights = null;
        var l2 = colors.length;
        if (!weights) {
          weights = Array.from(new Array(l2)).map(function() {
            return 1;
          });
        }
        var k2 = l2 / weights.reduce(function(a, b2) {
          return a + b2;
        });
        weights.forEach(function(w2, i3) {
          weights[i3] *= k2;
        });
        colors = colors.map(function(c2) {
          return new Color$6(c2);
        });
        if (mode === "lrgb") {
          return _average_lrgb(colors, weights);
        }
        var first = colors.shift();
        var xyz = first.get(mode);
        var cnt = [];
        var dx = 0;
        var dy = 0;
        for (var i2 = 0; i2 < xyz.length; i2++) {
          xyz[i2] = (xyz[i2] || 0) * weights[0];
          cnt.push(isNaN(xyz[i2]) ? 0 : weights[0]);
          if (mode.charAt(i2) === "h" && !isNaN(xyz[i2])) {
            var A2 = xyz[i2] / 180 * PI$1;
            dx += cos$2(A2) * weights[0];
            dy += sin$2(A2) * weights[0];
          }
        }
        var alpha2 = first.alpha() * weights[0];
        colors.forEach(function(c2, ci) {
          var xyz2 = c2.get(mode);
          alpha2 += c2.alpha() * weights[ci + 1];
          for (var i3 = 0; i3 < xyz.length; i3++) {
            if (!isNaN(xyz2[i3])) {
              cnt[i3] += weights[ci + 1];
              if (mode.charAt(i3) === "h") {
                var A3 = xyz2[i3] / 180 * PI$1;
                dx += cos$2(A3) * weights[ci + 1];
                dy += sin$2(A3) * weights[ci + 1];
              } else {
                xyz[i3] += xyz2[i3] * weights[ci + 1];
              }
            }
          }
        });
        for (var i$12 = 0; i$12 < xyz.length; i$12++) {
          if (mode.charAt(i$12) === "h") {
            var A$1 = atan2$1(dy / cnt[i$12], dx / cnt[i$12]) / PI$1 * 180;
            while (A$1 < 0) {
              A$1 += 360;
            }
            while (A$1 >= 360) {
              A$1 -= 360;
            }
            xyz[i$12] = A$1;
          } else {
            xyz[i$12] = xyz[i$12] / cnt[i$12];
          }
        }
        alpha2 /= l2;
        return new Color$6(xyz, mode).alpha(alpha2 > 0.99999 ? 1 : alpha2, true);
      };
      var _average_lrgb = function(colors, weights) {
        var l2 = colors.length;
        var xyz = [0, 0, 0, 0];
        for (var i2 = 0; i2 < colors.length; i2++) {
          var col = colors[i2];
          var f2 = weights[i2] / l2;
          var rgb2 = col._rgb;
          xyz[0] += pow$4(rgb2[0], 2) * f2;
          xyz[1] += pow$4(rgb2[1], 2) * f2;
          xyz[2] += pow$4(rgb2[2], 2) * f2;
          xyz[3] += rgb2[3] * f2;
        }
        xyz[0] = sqrt$1(xyz[0]);
        xyz[1] = sqrt$1(xyz[1]);
        xyz[2] = sqrt$1(xyz[2]);
        if (xyz[3] > 0.9999999) {
          xyz[3] = 1;
        }
        return new Color$6(clip_rgb$1(xyz));
      };
      var chroma$4 = chroma_1;
      var type$2 = utils2.type;
      var pow$3 = Math.pow;
      var scale$2 = function(colors) {
        var _mode = "rgb";
        var _nacol = chroma$4("#ccc");
        var _spread = 0;
        var _domain = [0, 1];
        var _pos = [];
        var _padding = [0, 0];
        var _classes = false;
        var _colors = [];
        var _out = false;
        var _min = 0;
        var _max = 1;
        var _correctLightness = false;
        var _colorCache = {};
        var _useCache = true;
        var _gamma = 1;
        var setColors = function(colors2) {
          colors2 = colors2 || ["#fff", "#000"];
          if (colors2 && type$2(colors2) === "string" && chroma$4.brewer && chroma$4.brewer[colors2.toLowerCase()]) {
            colors2 = chroma$4.brewer[colors2.toLowerCase()];
          }
          if (type$2(colors2) === "array") {
            if (colors2.length === 1) {
              colors2 = [colors2[0], colors2[0]];
            }
            colors2 = colors2.slice(0);
            for (var c2 = 0; c2 < colors2.length; c2++) {
              colors2[c2] = chroma$4(colors2[c2]);
            }
            _pos.length = 0;
            for (var c$12 = 0; c$12 < colors2.length; c$12++) {
              _pos.push(c$12 / (colors2.length - 1));
            }
          }
          resetCache();
          return _colors = colors2;
        };
        var getClass = function(value) {
          if (_classes != null) {
            var n2 = _classes.length - 1;
            var i2 = 0;
            while (i2 < n2 && value >= _classes[i2]) {
              i2++;
            }
            return i2 - 1;
          }
          return 0;
        };
        var tMapLightness = function(t2) {
          return t2;
        };
        var tMapDomain = function(t2) {
          return t2;
        };
        var getColor = function(val, bypassMap) {
          var col, t2;
          if (bypassMap == null) {
            bypassMap = false;
          }
          if (isNaN(val) || val === null) {
            return _nacol;
          }
          if (!bypassMap) {
            if (_classes && _classes.length > 2) {
              var c2 = getClass(val);
              t2 = c2 / (_classes.length - 2);
            } else if (_max !== _min) {
              t2 = (val - _min) / (_max - _min);
            } else {
              t2 = 1;
            }
          } else {
            t2 = val;
          }
          t2 = tMapDomain(t2);
          if (!bypassMap) {
            t2 = tMapLightness(t2);
          }
          if (_gamma !== 1) {
            t2 = pow$3(t2, _gamma);
          }
          t2 = _padding[0] + t2 * (1 - _padding[0] - _padding[1]);
          t2 = Math.min(1, Math.max(0, t2));
          var k2 = Math.floor(t2 * 1e4);
          if (_useCache && _colorCache[k2]) {
            col = _colorCache[k2];
          } else {
            if (type$2(_colors) === "array") {
              for (var i2 = 0; i2 < _pos.length; i2++) {
                var p2 = _pos[i2];
                if (t2 <= p2) {
                  col = _colors[i2];
                  break;
                }
                if (t2 >= p2 && i2 === _pos.length - 1) {
                  col = _colors[i2];
                  break;
                }
                if (t2 > p2 && t2 < _pos[i2 + 1]) {
                  t2 = (t2 - p2) / (_pos[i2 + 1] - p2);
                  col = chroma$4.interpolate(_colors[i2], _colors[i2 + 1], t2, _mode);
                  break;
                }
              }
            } else if (type$2(_colors) === "function") {
              col = _colors(t2);
            }
            if (_useCache) {
              _colorCache[k2] = col;
            }
          }
          return col;
        };
        var resetCache = function() {
          return _colorCache = {};
        };
        setColors(colors);
        var f2 = function(v2) {
          var c2 = chroma$4(getColor(v2));
          if (_out && c2[_out]) {
            return c2[_out]();
          } else {
            return c2;
          }
        };
        f2.classes = function(classes) {
          if (classes != null) {
            if (type$2(classes) === "array") {
              _classes = classes;
              _domain = [classes[0], classes[classes.length - 1]];
            } else {
              var d2 = chroma$4.analyze(_domain);
              if (classes === 0) {
                _classes = [d2.min, d2.max];
              } else {
                _classes = chroma$4.limits(d2, "e", classes);
              }
            }
            return f2;
          }
          return _classes;
        };
        f2.domain = function(domain) {
          if (!arguments.length) {
            return _domain;
          }
          _min = domain[0];
          _max = domain[domain.length - 1];
          _pos = [];
          var k2 = _colors.length;
          if (domain.length === k2 && _min !== _max) {
            for (var i2 = 0, list2 = Array.from(domain); i2 < list2.length; i2 += 1) {
              var d2 = list2[i2];
              _pos.push((d2 - _min) / (_max - _min));
            }
          } else {
            for (var c2 = 0; c2 < k2; c2++) {
              _pos.push(c2 / (k2 - 1));
            }
            if (domain.length > 2) {
              var tOut = domain.map(function(d3, i3) {
                return i3 / (domain.length - 1);
              });
              var tBreaks = domain.map(function(d3) {
                return (d3 - _min) / (_max - _min);
              });
              if (!tBreaks.every(function(val, i3) {
                return tOut[i3] === val;
              })) {
                tMapDomain = function(t2) {
                  if (t2 <= 0 || t2 >= 1) {
                    return t2;
                  }
                  var i3 = 0;
                  while (t2 >= tBreaks[i3 + 1]) {
                    i3++;
                  }
                  var f3 = (t2 - tBreaks[i3]) / (tBreaks[i3 + 1] - tBreaks[i3]);
                  var out = tOut[i3] + f3 * (tOut[i3 + 1] - tOut[i3]);
                  return out;
                };
              }
            }
          }
          _domain = [_min, _max];
          return f2;
        };
        f2.mode = function(_m) {
          if (!arguments.length) {
            return _mode;
          }
          _mode = _m;
          resetCache();
          return f2;
        };
        f2.range = function(colors2, _pos2) {
          setColors(colors2);
          return f2;
        };
        f2.out = function(_o) {
          _out = _o;
          return f2;
        };
        f2.spread = function(val) {
          if (!arguments.length) {
            return _spread;
          }
          _spread = val;
          return f2;
        };
        f2.correctLightness = function(v2) {
          if (v2 == null) {
            v2 = true;
          }
          _correctLightness = v2;
          resetCache();
          if (_correctLightness) {
            tMapLightness = function(t2) {
              var L0 = getColor(0, true).lab()[0];
              var L1 = getColor(1, true).lab()[0];
              var pol = L0 > L1;
              var L_actual = getColor(t2, true).lab()[0];
              var L_ideal = L0 + (L1 - L0) * t2;
              var L_diff = L_actual - L_ideal;
              var t0 = 0;
              var t1 = 1;
              var max_iter = 20;
              while (Math.abs(L_diff) > 0.01 && max_iter-- > 0) {
                (function() {
                  if (pol) {
                    L_diff *= -1;
                  }
                  if (L_diff < 0) {
                    t0 = t2;
                    t2 += (t1 - t2) * 0.5;
                  } else {
                    t1 = t2;
                    t2 += (t0 - t2) * 0.5;
                  }
                  L_actual = getColor(t2, true).lab()[0];
                  return L_diff = L_actual - L_ideal;
                })();
              }
              return t2;
            };
          } else {
            tMapLightness = function(t2) {
              return t2;
            };
          }
          return f2;
        };
        f2.padding = function(p2) {
          if (p2 != null) {
            if (type$2(p2) === "number") {
              p2 = [p2, p2];
            }
            _padding = p2;
            return f2;
          } else {
            return _padding;
          }
        };
        f2.colors = function(numColors, out) {
          if (arguments.length < 2) {
            out = "hex";
          }
          var result = [];
          if (arguments.length === 0) {
            result = _colors.slice(0);
          } else if (numColors === 1) {
            result = [f2(0.5)];
          } else if (numColors > 1) {
            var dm = _domain[0];
            var dd = _domain[1] - dm;
            result = __range__(0, numColors, false).map(function(i3) {
              return f2(dm + i3 / (numColors - 1) * dd);
            });
          } else {
            colors = [];
            var samples = [];
            if (_classes && _classes.length > 2) {
              for (var i2 = 1, end2 = _classes.length, asc = 1 <= end2; asc ? i2 < end2 : i2 > end2; asc ? i2++ : i2--) {
                samples.push((_classes[i2 - 1] + _classes[i2]) * 0.5);
              }
            } else {
              samples = _domain;
            }
            result = samples.map(function(v2) {
              return f2(v2);
            });
          }
          if (chroma$4[out]) {
            result = result.map(function(c2) {
              return c2[out]();
            });
          }
          return result;
        };
        f2.cache = function(c2) {
          if (c2 != null) {
            _useCache = c2;
            return f2;
          } else {
            return _useCache;
          }
        };
        f2.gamma = function(g2) {
          if (g2 != null) {
            _gamma = g2;
            return f2;
          } else {
            return _gamma;
          }
        };
        f2.nodata = function(d2) {
          if (d2 != null) {
            _nacol = chroma$4(d2);
            return f2;
          } else {
            return _nacol;
          }
        };
        return f2;
      };
      function __range__(left2, right2, inclusive) {
        var range = [];
        var ascending = left2 < right2;
        var end2 = !inclusive ? right2 : ascending ? right2 + 1 : right2 - 1;
        for (var i2 = left2; ascending ? i2 < end2 : i2 > end2; ascending ? i2++ : i2--) {
          range.push(i2);
        }
        return range;
      }
      var Color$5 = Color_1;
      var scale$1 = scale$2;
      var binom_row = function(n2) {
        var row = [1, 1];
        for (var i2 = 1; i2 < n2; i2++) {
          var newrow = [1];
          for (var j = 1; j <= row.length; j++) {
            newrow[j] = (row[j] || 0) + row[j - 1];
          }
          row = newrow;
        }
        return row;
      };
      var bezier = function(colors) {
        var assign2, assign$1, assign$2;
        var I, lab0, lab1, lab2;
        colors = colors.map(function(c2) {
          return new Color$5(c2);
        });
        if (colors.length === 2) {
          assign2 = colors.map(function(c2) {
            return c2.lab();
          }), lab0 = assign2[0], lab1 = assign2[1];
          I = function(t2) {
            var lab4 = [0, 1, 2].map(function(i2) {
              return lab0[i2] + t2 * (lab1[i2] - lab0[i2]);
            });
            return new Color$5(lab4, "lab");
          };
        } else if (colors.length === 3) {
          assign$1 = colors.map(function(c2) {
            return c2.lab();
          }), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2];
          I = function(t2) {
            var lab4 = [0, 1, 2].map(function(i2) {
              return (1 - t2) * (1 - t2) * lab0[i2] + 2 * (1 - t2) * t2 * lab1[i2] + t2 * t2 * lab2[i2];
            });
            return new Color$5(lab4, "lab");
          };
        } else if (colors.length === 4) {
          var lab3;
          assign$2 = colors.map(function(c2) {
            return c2.lab();
          }), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3];
          I = function(t2) {
            var lab4 = [0, 1, 2].map(function(i2) {
              return (1 - t2) * (1 - t2) * (1 - t2) * lab0[i2] + 3 * (1 - t2) * (1 - t2) * t2 * lab1[i2] + 3 * (1 - t2) * t2 * t2 * lab2[i2] + t2 * t2 * t2 * lab3[i2];
            });
            return new Color$5(lab4, "lab");
          };
        } else if (colors.length >= 5) {
          var labs, row, n2;
          labs = colors.map(function(c2) {
            return c2.lab();
          });
          n2 = colors.length - 1;
          row = binom_row(n2);
          I = function(t2) {
            var u2 = 1 - t2;
            var lab4 = [0, 1, 2].map(function(i2) {
              return labs.reduce(function(sum, el, j) {
                return sum + row[j] * Math.pow(u2, n2 - j) * Math.pow(t2, j) * el[i2];
              }, 0);
            });
            return new Color$5(lab4, "lab");
          };
        } else {
          throw new RangeError("No point in running bezier with only one color.");
        }
        return I;
      };
      var bezier_1 = function(colors) {
        var f2 = bezier(colors);
        f2.scale = function() {
          return scale$1(f2);
        };
        return f2;
      };
      var chroma$3 = chroma_1;
      var blend2 = function(bottom2, top2, mode) {
        if (!blend2[mode]) {
          throw new Error("unknown blend mode " + mode);
        }
        return blend2[mode](bottom2, top2);
      };
      var blend_f = function(f2) {
        return function(bottom2, top2) {
          var c0 = chroma$3(top2).rgb();
          var c1 = chroma$3(bottom2).rgb();
          return chroma$3.rgb(f2(c0, c1));
        };
      };
      var each = function(f2) {
        return function(c0, c1) {
          var out = [];
          out[0] = f2(c0[0], c1[0]);
          out[1] = f2(c0[1], c1[1]);
          out[2] = f2(c0[2], c1[2]);
          return out;
        };
      };
      var normal = function(a) {
        return a;
      };
      var multiply = function(a, b2) {
        return a * b2 / 255;
      };
      var darken2 = function(a, b2) {
        return a > b2 ? b2 : a;
      };
      var lighten2 = function(a, b2) {
        return a > b2 ? a : b2;
      };
      var screen = function(a, b2) {
        return 255 * (1 - (1 - a / 255) * (1 - b2 / 255));
      };
      var overlay = function(a, b2) {
        return b2 < 128 ? 2 * a * b2 / 255 : 255 * (1 - 2 * (1 - a / 255) * (1 - b2 / 255));
      };
      var burn = function(a, b2) {
        return 255 * (1 - (1 - b2 / 255) / (a / 255));
      };
      var dodge = function(a, b2) {
        if (a === 255) {
          return 255;
        }
        a = 255 * (b2 / 255) / (1 - a / 255);
        return a > 255 ? 255 : a;
      };
      blend2.normal = blend_f(each(normal));
      blend2.multiply = blend_f(each(multiply));
      blend2.screen = blend_f(each(screen));
      blend2.overlay = blend_f(each(overlay));
      blend2.darken = blend_f(each(darken2));
      blend2.lighten = blend_f(each(lighten2));
      blend2.dodge = blend_f(each(dodge));
      blend2.burn = blend_f(each(burn));
      var blend_1 = blend2;
      var type$1 = utils2.type;
      var clip_rgb = utils2.clip_rgb;
      var TWOPI = utils2.TWOPI;
      var pow$2 = Math.pow;
      var sin$1 = Math.sin;
      var cos$1 = Math.cos;
      var chroma$2 = chroma_1;
      var cubehelix = function(start2, rotations, hue, gamma, lightness) {
        if (start2 === void 0)
          start2 = 300;
        if (rotations === void 0)
          rotations = -1.5;
        if (hue === void 0)
          hue = 1;
        if (gamma === void 0)
          gamma = 1;
        if (lightness === void 0)
          lightness = [0, 1];
        var dh = 0, dl;
        if (type$1(lightness) === "array") {
          dl = lightness[1] - lightness[0];
        } else {
          dl = 0;
          lightness = [lightness, lightness];
        }
        var f2 = function(fract) {
          var a = TWOPI * ((start2 + 120) / 360 + rotations * fract);
          var l2 = pow$2(lightness[0] + dl * fract, gamma);
          var h2 = dh !== 0 ? hue[0] + fract * dh : hue;
          var amp = h2 * l2 * (1 - l2) / 2;
          var cos_a = cos$1(a);
          var sin_a = sin$1(a);
          var r2 = l2 + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
          var g2 = l2 + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
          var b2 = l2 + amp * (1.97294 * cos_a);
          return chroma$2(clip_rgb([r2 * 255, g2 * 255, b2 * 255, 1]));
        };
        f2.start = function(s) {
          if (s == null) {
            return start2;
          }
          start2 = s;
          return f2;
        };
        f2.rotations = function(r2) {
          if (r2 == null) {
            return rotations;
          }
          rotations = r2;
          return f2;
        };
        f2.gamma = function(g2) {
          if (g2 == null) {
            return gamma;
          }
          gamma = g2;
          return f2;
        };
        f2.hue = function(h2) {
          if (h2 == null) {
            return hue;
          }
          hue = h2;
          if (type$1(hue) === "array") {
            dh = hue[1] - hue[0];
            if (dh === 0) {
              hue = hue[1];
            }
          } else {
            dh = 0;
          }
          return f2;
        };
        f2.lightness = function(h2) {
          if (h2 == null) {
            return lightness;
          }
          if (type$1(h2) === "array") {
            lightness = h2;
            dl = h2[1] - h2[0];
          } else {
            lightness = [h2, h2];
            dl = 0;
          }
          return f2;
        };
        f2.scale = function() {
          return chroma$2.scale(f2);
        };
        f2.hue(hue);
        return f2;
      };
      var Color$4 = Color_1;
      var digits = "0123456789abcdef";
      var floor$1 = Math.floor;
      var random = Math.random;
      var random_1 = function() {
        var code = "#";
        for (var i2 = 0; i2 < 6; i2++) {
          code += digits.charAt(floor$1(random() * 16));
        }
        return new Color$4(code, "hex");
      };
      var type = type$p;
      var log = Math.log;
      var pow$1 = Math.pow;
      var floor = Math.floor;
      var abs$1 = Math.abs;
      var analyze = function(data, key2) {
        if (key2 === void 0)
          key2 = null;
        var r2 = {
          min: Number.MAX_VALUE,
          max: Number.MAX_VALUE * -1,
          sum: 0,
          values: [],
          count: 0
        };
        if (type(data) === "object") {
          data = Object.values(data);
        }
        data.forEach(function(val) {
          if (key2 && type(val) === "object") {
            val = val[key2];
          }
          if (val !== void 0 && val !== null && !isNaN(val)) {
            r2.values.push(val);
            r2.sum += val;
            if (val < r2.min) {
              r2.min = val;
            }
            if (val > r2.max) {
              r2.max = val;
            }
            r2.count += 1;
          }
        });
        r2.domain = [r2.min, r2.max];
        r2.limits = function(mode, num2) {
          return limits(r2, mode, num2);
        };
        return r2;
      };
      var limits = function(data, mode, num2) {
        if (mode === void 0)
          mode = "equal";
        if (num2 === void 0)
          num2 = 7;
        if (type(data) == "array") {
          data = analyze(data);
        }
        var min3 = data.min;
        var max3 = data.max;
        var values2 = data.values.sort(function(a, b2) {
          return a - b2;
        });
        if (num2 === 1) {
          return [min3, max3];
        }
        var limits2 = [];
        if (mode.substr(0, 1) === "c") {
          limits2.push(min3);
          limits2.push(max3);
        }
        if (mode.substr(0, 1) === "e") {
          limits2.push(min3);
          for (var i2 = 1; i2 < num2; i2++) {
            limits2.push(min3 + i2 / num2 * (max3 - min3));
          }
          limits2.push(max3);
        } else if (mode.substr(0, 1) === "l") {
          if (min3 <= 0) {
            throw new Error("Logarithmic scales are only possible for values > 0");
          }
          var min_log = Math.LOG10E * log(min3);
          var max_log = Math.LOG10E * log(max3);
          limits2.push(min3);
          for (var i$12 = 1; i$12 < num2; i$12++) {
            limits2.push(pow$1(10, min_log + i$12 / num2 * (max_log - min_log)));
          }
          limits2.push(max3);
        } else if (mode.substr(0, 1) === "q") {
          limits2.push(min3);
          for (var i$2 = 1; i$2 < num2; i$2++) {
            var p2 = (values2.length - 1) * i$2 / num2;
            var pb = floor(p2);
            if (pb === p2) {
              limits2.push(values2[pb]);
            } else {
              var pr = p2 - pb;
              limits2.push(values2[pb] * (1 - pr) + values2[pb + 1] * pr);
            }
          }
          limits2.push(max3);
        } else if (mode.substr(0, 1) === "k") {
          var cluster;
          var n2 = values2.length;
          var assignments = new Array(n2);
          var clusterSizes = new Array(num2);
          var repeat = true;
          var nb_iters = 0;
          var centroids = null;
          centroids = [];
          centroids.push(min3);
          for (var i$3 = 1; i$3 < num2; i$3++) {
            centroids.push(min3 + i$3 / num2 * (max3 - min3));
          }
          centroids.push(max3);
          while (repeat) {
            for (var j = 0; j < num2; j++) {
              clusterSizes[j] = 0;
            }
            for (var i$4 = 0; i$4 < n2; i$4++) {
              var value = values2[i$4];
              var mindist = Number.MAX_VALUE;
              var best = void 0;
              for (var j$1 = 0; j$1 < num2; j$1++) {
                var dist = abs$1(centroids[j$1] - value);
                if (dist < mindist) {
                  mindist = dist;
                  best = j$1;
                }
                clusterSizes[best]++;
                assignments[i$4] = best;
              }
            }
            var newCentroids = new Array(num2);
            for (var j$2 = 0; j$2 < num2; j$2++) {
              newCentroids[j$2] = null;
            }
            for (var i$5 = 0; i$5 < n2; i$5++) {
              cluster = assignments[i$5];
              if (newCentroids[cluster] === null) {
                newCentroids[cluster] = values2[i$5];
              } else {
                newCentroids[cluster] += values2[i$5];
              }
            }
            for (var j$3 = 0; j$3 < num2; j$3++) {
              newCentroids[j$3] *= 1 / clusterSizes[j$3];
            }
            repeat = false;
            for (var j$4 = 0; j$4 < num2; j$4++) {
              if (newCentroids[j$4] !== centroids[j$4]) {
                repeat = true;
                break;
              }
            }
            centroids = newCentroids;
            nb_iters++;
            if (nb_iters > 200) {
              repeat = false;
            }
          }
          var kClusters = {};
          for (var j$5 = 0; j$5 < num2; j$5++) {
            kClusters[j$5] = [];
          }
          for (var i$6 = 0; i$6 < n2; i$6++) {
            cluster = assignments[i$6];
            kClusters[cluster].push(values2[i$6]);
          }
          var tmpKMeansBreaks = [];
          for (var j$6 = 0; j$6 < num2; j$6++) {
            tmpKMeansBreaks.push(kClusters[j$6][0]);
            tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length - 1]);
          }
          tmpKMeansBreaks = tmpKMeansBreaks.sort(function(a, b2) {
            return a - b2;
          });
          limits2.push(tmpKMeansBreaks[0]);
          for (var i$7 = 1; i$7 < tmpKMeansBreaks.length; i$7 += 2) {
            var v2 = tmpKMeansBreaks[i$7];
            if (!isNaN(v2) && limits2.indexOf(v2) === -1) {
              limits2.push(v2);
            }
          }
        }
        return limits2;
      };
      var analyze_1 = { analyze, limits };
      var Color$3 = Color_1;
      var contrast = function(a, b2) {
        a = new Color$3(a);
        b2 = new Color$3(b2);
        var l1 = a.luminance();
        var l2 = b2.luminance();
        return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
      };
      var Color$2 = Color_1;
      var sqrt = Math.sqrt;
      var pow = Math.pow;
      var min2 = Math.min;
      var max2 = Math.max;
      var atan2 = Math.atan2;
      var abs2 = Math.abs;
      var cos = Math.cos;
      var sin = Math.sin;
      var exp = Math.exp;
      var PI = Math.PI;
      var deltaE = function(a, b2, Kl, Kc, Kh) {
        if (Kl === void 0)
          Kl = 1;
        if (Kc === void 0)
          Kc = 1;
        if (Kh === void 0)
          Kh = 1;
        var rad2deg = function(rad) {
          return 360 * rad / (2 * PI);
        };
        var deg2rad = function(deg) {
          return 2 * PI * deg / 360;
        };
        a = new Color$2(a);
        b2 = new Color$2(b2);
        var ref = Array.from(a.lab());
        var L1 = ref[0];
        var a1 = ref[1];
        var b1 = ref[2];
        var ref$1 = Array.from(b2.lab());
        var L2 = ref$1[0];
        var a2 = ref$1[1];
        var b22 = ref$1[2];
        var avgL = (L1 + L2) / 2;
        var C1 = sqrt(pow(a1, 2) + pow(b1, 2));
        var C2 = sqrt(pow(a2, 2) + pow(b22, 2));
        var avgC = (C1 + C2) / 2;
        var G = 0.5 * (1 - sqrt(pow(avgC, 7) / (pow(avgC, 7) + pow(25, 7))));
        var a1p = a1 * (1 + G);
        var a2p = a2 * (1 + G);
        var C1p = sqrt(pow(a1p, 2) + pow(b1, 2));
        var C2p = sqrt(pow(a2p, 2) + pow(b22, 2));
        var avgCp = (C1p + C2p) / 2;
        var arctan1 = rad2deg(atan2(b1, a1p));
        var arctan2 = rad2deg(atan2(b22, a2p));
        var h1p = arctan1 >= 0 ? arctan1 : arctan1 + 360;
        var h2p = arctan2 >= 0 ? arctan2 : arctan2 + 360;
        var avgHp = abs2(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
        var T = 1 - 0.17 * cos(deg2rad(avgHp - 30)) + 0.24 * cos(deg2rad(2 * avgHp)) + 0.32 * cos(deg2rad(3 * avgHp + 6)) - 0.2 * cos(deg2rad(4 * avgHp - 63));
        var deltaHp = h2p - h1p;
        deltaHp = abs2(deltaHp) <= 180 ? deltaHp : h2p <= h1p ? deltaHp + 360 : deltaHp - 360;
        deltaHp = 2 * sqrt(C1p * C2p) * sin(deg2rad(deltaHp) / 2);
        var deltaL = L2 - L1;
        var deltaCp = C2p - C1p;
        var sl = 1 + 0.015 * pow(avgL - 50, 2) / sqrt(20 + pow(avgL - 50, 2));
        var sc = 1 + 0.045 * avgCp;
        var sh = 1 + 0.015 * avgCp * T;
        var deltaTheta = 30 * exp(-pow((avgHp - 275) / 25, 2));
        var Rc = 2 * sqrt(pow(avgCp, 7) / (pow(avgCp, 7) + pow(25, 7)));
        var Rt = -Rc * sin(2 * deg2rad(deltaTheta));
        var result = sqrt(pow(deltaL / (Kl * sl), 2) + pow(deltaCp / (Kc * sc), 2) + pow(deltaHp / (Kh * sh), 2) + Rt * (deltaCp / (Kc * sc)) * (deltaHp / (Kh * sh)));
        return max2(0, min2(100, result));
      };
      var Color$1 = Color_1;
      var distance = function(a, b2, mode) {
        if (mode === void 0)
          mode = "lab";
        a = new Color$1(a);
        b2 = new Color$1(b2);
        var l1 = a.get(mode);
        var l2 = b2.get(mode);
        var sum_sq = 0;
        for (var i2 in l1) {
          var d2 = (l1[i2] || 0) - (l2[i2] || 0);
          sum_sq += d2 * d2;
        }
        return Math.sqrt(sum_sq);
      };
      var Color = Color_1;
      var valid = function() {
        var args = [], len = arguments.length;
        while (len--)
          args[len] = arguments[len];
        try {
          new (Function.prototype.bind.apply(Color, [null].concat(args)))();
          return true;
        } catch (e2) {
          return false;
        }
      };
      var chroma$12 = chroma_1;
      var scale = scale$2;
      var scales = {
        cool: function cool() {
          return scale([chroma$12.hsl(180, 1, 0.9), chroma$12.hsl(250, 0.7, 0.4)]);
        },
        hot: function hot() {
          return scale(["#000", "#f00", "#ff0", "#fff"]).mode("rgb");
        }
      };
      var colorbrewer = {
        // sequential
        OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
        PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
        BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
        Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
        BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
        YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
        YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
        Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
        RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
        Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
        YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
        Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
        GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
        Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
        YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
        PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
        Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
        PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
        Viridis: ["#440154", "#482777", "#3f4a8a", "#31678e", "#26838f", "#1f9d8a", "#6cce5a", "#b6de2b", "#fee825"],
        // diverging
        Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
        RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
        RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
        PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
        PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
        RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
        BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
        RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
        PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
        // qualitative
        Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
        Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"],
        Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
        Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"],
        Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
        Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
        Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
        Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
      };
      for (var i = 0, list = Object.keys(colorbrewer); i < list.length; i += 1) {
        var key = list[i];
        colorbrewer[key.toLowerCase()] = colorbrewer[key];
      }
      var colorbrewer_1 = colorbrewer;
      var chroma2 = chroma_1;
      chroma2.average = average;
      chroma2.bezier = bezier_1;
      chroma2.blend = blend_1;
      chroma2.cubehelix = cubehelix;
      chroma2.mix = chroma2.interpolate = mix$1;
      chroma2.random = random_1;
      chroma2.scale = scale$2;
      chroma2.analyze = analyze_1.analyze;
      chroma2.contrast = contrast;
      chroma2.deltaE = deltaE;
      chroma2.distance = distance;
      chroma2.limits = analyze_1.limits;
      chroma2.valid = valid;
      chroma2.scales = scales;
      chroma2.colors = w3cx11_1;
      chroma2.brewer = colorbrewer_1;
      var chroma_js = chroma2;
      return chroma_js;
    });
  })(chroma$1);
  var chromaExports = chroma$1.exports;
  const chroma = /* @__PURE__ */ getDefaultExportFromCjs(chromaExports);
  const hexToRgb = (color2) => {
    return chroma(color2).rgb().join(", ");
  };
  const rgba = (color2, opacity) => {
    return `rgba(${hexToRgb(color2)}, ${opacity})`;
  };
  const boxShadow = (offset2, radius, color2, opacity, inset = "") => {
    const [x2, y2] = offset2;
    const [blur, spread] = radius;
    return `${inset} ${pxToRem(x2)} ${pxToRem(y2)} ${pxToRem(blur)} ${pxToRem(spread)} ${rgba(color2, opacity)}`;
  };
  const linearGradient = (color2, colorState, angle = 195) => {
    return `linear-gradient(${angle}deg, ${color2}, ${colorState})`;
  };
  const palette = (themeMode) => {
    const isLight = themeMode === "light";
    return {
      common: {
        black: "#000000",
        white: "#FFFFFF"
      },
      white: {
        main: "#FFFFFF",
        focus: "#FFFFFF"
      },
      black: {
        light: "#000000",
        main: "#000000",
        focus: "#000000"
      },
      mode: themeMode,
      // contrastThreshold: number;
      // tonalOffset: PaletteTonalOffset;
      primary: {
        main: "#E91E63",
        focus: "#E91E63",
        contrastText: "#F0F2F5"
      },
      secondary: {
        main: "#7B809A",
        focus: "#8F93A9",
        contrastText: "#F0F2F5"
      },
      error: {
        main: "#F44335",
        focus: "#F65F53",
        contrastText: "#F0F2F5"
      },
      warning: {
        main: "#FB8C00",
        focus: "#FC9D26",
        contrastText: "#F0F2F5"
      },
      info: {
        main: "#1A73E8",
        focus: "#1662C4",
        contrastText: "#F0F2F5"
      },
      success: {
        main: "#4CAF50",
        focus: "#67BB6A",
        contrastText: "#F0F2F5"
      },
      light: isLight ? {
        main: "#F0F2F5",
        focus: "#F0F2F5",
        contrastText: "#344767"
      } : {
        main: "#F0F2F566",
        focus: "#F0F2F566"
      },
      dark: {
        main: "#344767",
        focus: "#2C3C58"
      },
      gradients: {
        primary: {
          main: "#EC407A",
          state: "#D81B60"
        },
        secondary: {
          main: "#747B8A",
          state: "#495361"
        },
        info: {
          main: "#49A3F1",
          state: "#1A73E8"
        },
        success: {
          main: "#66BB6A",
          state: "#43A047"
        },
        warning: {
          main: "#FFA726",
          state: "#FB8C00"
        },
        error: {
          main: "#EF5350",
          state: "#E53935"
        },
        light: {
          main: "#EBEFF4",
          state: "#CED4DA"
        },
        dark: isLight ? {
          main: "#42424A",
          state: "#191919"
        } : {
          main: "#323A54",
          state: "#1A2035"
        }
      },
      badgeColors: {
        primary: {
          background: "#F8B3CA",
          text: "#CC084B"
        },
        secondary: {
          background: "#D7D9E1",
          text: "#6C757D"
        },
        info: {
          background: "#AECEF7",
          text: "#095BC6"
        },
        success: {
          background: "#BCE2BE",
          text: "#339537"
        },
        warning: {
          background: "#FFD59F",
          text: "#C87000"
        },
        error: {
          background: "#FCD3D0",
          text: "#F61200"
        },
        light: {
          background: "#FFFFFF",
          text: "#C7D3DE"
        },
        dark: {
          background: "#8097BF",
          text: "#1E2E4A"
        }
      },
      coloredShadows: {
        primary: "#E91E62",
        secondary: "#110E0E",
        info: "#00BBD4",
        success: "#4CAF4F",
        warning: "#FF9900",
        error: "#F44336",
        light: "#ADB5BD",
        dark: "#404040"
      },
      grey: {
        0: "#FFFFFF",
        100: "#F8F9FA",
        200: "#F0F2F5",
        300: "#DEE2E6",
        400: "#CED4DA",
        500: "#ADB5BD",
        600: "#6C757D",
        700: "#495057",
        800: "#343A40",
        900: "#212529"
      },
      text: isLight ? {
        main: "#7B809A",
        focus: "#7B809A"
      } : {
        main: "#FFFFFFCC",
        focus: "#FFFFFFCC"
      },
      // divider: TypeDivider;
      // action: {
      // active: string;
      // hover: string;
      // hoverOpacity: number;
      // selected: string;
      // selectedOpacity: number;
      // disabled: string;
      // disabledOpacity: number;
      // disabledBackground: string;
      // focus: string;
      // focusOpacity: number;
      // activatedOpacity: number;
      // },
      background: isLight ? {
        default: "#F0F2F5"
      } : {
        default: "#1A2035",
        sidenav: "#1F283E",
        card: "#202940"
      },
      // getContrastText: (background: string) => string;
      // augmentColor: (options: PaletteAugmentColorOptions) => PaletteColor;
      transparent: {
        main: "transparent"
      },
      inputBorderColor: "#D2D6DA",
      tabs: {
        indicator: { boxShadow: "#DDDDDD" }
      }
    };
  };
  const borders = (themeMode) => {
    const isLight = themeMode === "light";
    const { white, grey: grey2 } = palette(themeMode);
    return {
      borderColor: isLight ? grey2[300] : rgba(white.main, 0.4),
      borderWidth: {
        0: 0,
        1: pxToRem(1),
        2: pxToRem(2),
        3: pxToRem(3),
        4: pxToRem(4),
        5: pxToRem(5)
      },
      borderRadius: {
        xs: pxToRem(1.6),
        sm: pxToRem(2),
        md: pxToRem(6),
        lg: pxToRem(8),
        xl: pxToRem(12),
        xxl: pxToRem(16),
        section: pxToRem(160)
      }
    };
  };
  const boxShadows = (themeMode) => {
    const isLight = themeMode === "light";
    const { white, black, dark: dark2, coloredShadows, tabs } = palette(themeMode);
    return {
      xs: boxShadow([0, 2], [9, -5], black.main, 0.15),
      sm: boxShadow([0, 5], [10, 0], black.main, 0.12),
      md: isLight ? `${boxShadow([0, 4], [6, -1], black.main, 0.1)}, ${boxShadow([0, 2], [4, -1], black.main, 0.06)}` : `${boxShadow([0, 2], [2, 0], black.main, 0.14)}, ${boxShadow(
      [0, 3],
      [1, -2],
      black.main,
      0.2
    )}, ${boxShadow([0, 1], [5, 0], black.main, 0.12)}`,
      lg: `${boxShadow([0, 10], [15, -3], black.main, 0.1)}, ${boxShadow([0, 4], [6, -2], black.main, 0.05)}`,
      xl: `${boxShadow([0, 20], [25, -5], black.main, 0.1)}, ${boxShadow([0, 10], [10, -5], black.main, 0.04)}`,
      xxl: boxShadow([0, 20], [27, 0], black.main, 0.05),
      inset: boxShadow([0, 1], [2, 0], black.main, 0.075, "inset"),
      colored: {
        primary: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow(
        [0, 7],
        [10, -5],
        coloredShadows.primary,
        0.4
      )}`,
        secondary: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow(
        [0, 7],
        [10, -5],
        coloredShadows.secondary,
        0.4
      )}`,
        info: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.info, 0.4)}`,
        success: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow(
        [0, 7],
        [10, -5],
        coloredShadows.success,
        0.4
      )}`,
        warning: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow(
        [0, 7],
        [10, -5],
        coloredShadows.warning,
        0.4
      )}`,
        error: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow(
        [0, 7],
        [10, -5],
        coloredShadows.error,
        0.4
      )}`,
        light: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow(
        [0, 7],
        [10, -5],
        coloredShadows.light,
        0.4
      )}`,
        dark: `${boxShadow([0, 4], [20, 0], black.main, 0.14)}, ${boxShadow([0, 7], [10, -5], coloredShadows.dark, 0.4)}`
      },
      navbarBoxShadow: `${boxShadow([0, 0], [1, 1], isLight ? white.main : dark2.main, 0.9, "inset")}, ${boxShadow(
      [0, 20],
      [27, 0],
      black.main,
      0.05
    )}`,
      sliderBoxShadow: {
        thumb: boxShadow([0, 1], [13, 0], black.main, 0.2)
      },
      tabsBoxShadow: {
        indicator: boxShadow([0, 1], [5, 1], tabs.indicator.boxShadow, 1)
      }
    };
  };
  const breakpoints = {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    }
  };
  function GlobalStyles() {
    const theme = useTheme$1();
    const isLight = theme.palette.mode === "light";
    const { white, info, dark: dark2, grey: grey2 } = theme.palette;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      GlobalStyles$1,
      {
        styles: {
          // [`#${styles.pluginContainer}`]: {
          //   scrollBehavior: 'smooth',
          // },
          // [`#${styles.pluginContainer} *, #${styles.pluginContainer} *::before, #${styles.pluginContainer} *::after`]: {
          //   margin: 0,
          //   padding: 0,
          // },
          // [`#${styles.pluginContainer} a, #${styles.pluginContainer} a:link, #${styles.pluginContainer} a:visited`]: {
          //   textDecoration: 'none !important',
          // },
          // [`#${styles.pluginContainer} a.link, #${styles.pluginContainer} .link, #${styles.pluginContainer} a.link:link, #${styles.pluginContainer} .link:link, #${styles.pluginContainer} a.link:visited, #${styles.pluginContainer} .link:visited`]:
          //   {
          //     color: `${dark.main} !important`,
          //     transition: 'color 150ms ease-in !important',
          //   },
          // [`#${styles.pluginContainer} a.link:hover, #${styles.pluginContainer} .link:hover, #${styles.pluginContainer} a.link:focus, #${styles.pluginContainer} .link:focus`]:
          //   {
          //     color: `${info.main} !important`,
          //   },
          [`.${dialogClasses$1.root}`]: {
            "& input[type=text], & input[type=password], & input[type=datetime], & input[type=datetime-local], & input[type=date], & input[type=month], & input[type=time], & input[type=week], & input[type=number], & input[type=email], & input[type=url], & input[type=search], & input[type=tel], & input[type=color]": {
              boxSizing: "content-box",
              display: "block",
              marginBottom: 0,
              color: isLight ? grey2[700] : white.main,
              backgroundColor: "transparent",
              border: 0,
              borderRadius: 0
            },
            "& input[type=text]:focus, & input[type=password]:focus, & input[type=datetime]:focus, & input[type=datetime-local]:focus, & input[type=date]:focus, & input[type=month]:focus, & input[type=time]:focus, & input[type=week]:focus, & input[type=number]:focus, & input[type=email]:focus, & input[type=url]:focus, & input[type=search]:focus, & input[type=tel]:focus, & input[type=color]:focus": {
              borderColor: "transparent",
              outline: 0,
              outlineOffset: 0
            }
          }
        }
      }
    );
  }
  const baseFontFamily = [
    "-apple-system",
    "BlinkMacSystemFont",
    "Helvetica Neue",
    "Helvetica",
    "Arial",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "sans-serif"
  ];
  const baseProperties = {
    fontFamily: baseFontFamily.join(","),
    fontWeightLighter: 250,
    fontWeightLight: 350,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSizeXXS: pxToRem(10.4),
    fontSizeXS: pxToRem(12),
    fontSizeSM: pxToRem(14),
    fontSizeMD: pxToRem(16),
    fontSizeLG: pxToRem(18),
    fontSizeXL: pxToRem(20),
    fontSize2XL: pxToRem(24),
    fontSize3XL: pxToRem(30)
  };
  const genBaseHeadingProperties = (isLight, themeColors) => {
    const { white, dark: dark2 } = themeColors;
    return {
      fontFamily: baseProperties.fontFamily,
      color: isLight ? dark2.main : white.main,
      fontWeight: baseProperties.fontWeightBold
    };
  };
  const genBaseDisplayProperties = (isLight, themeColors) => {
    const { white, dark: dark2 } = themeColors;
    return {
      fontFamily: baseProperties.fontFamily,
      color: isLight ? dark2.main : white.main,
      fontWeight: baseProperties.fontWeightLight,
      lineHeight: 1.2
    };
  };
  const typography = (themeMode) => {
    const isLight = themeMode === "light";
    const themeColors = palette(themeMode);
    const baseHeadingProperties = genBaseHeadingProperties(isLight, themeColors);
    const baseDisplayProperties = genBaseDisplayProperties(isLight, themeColors);
    return {
      fontFamily: baseProperties.fontFamily,
      fontWeightLighter: baseProperties.fontWeightLighter,
      fontWeightLight: baseProperties.fontWeightLight,
      fontWeightRegular: baseProperties.fontWeightRegular,
      fontWeightMedium: baseProperties.fontWeightMedium,
      fontWeightBold: baseProperties.fontWeightBold,
      h1: {
        fontSize: pxToRem(48),
        lineHeight: 1.25,
        ...baseHeadingProperties
      },
      h2: {
        fontSize: pxToRem(36),
        lineHeight: 1.3,
        ...baseHeadingProperties
      },
      h3: {
        fontSize: pxToRem(30),
        lineHeight: 1.375,
        ...baseHeadingProperties
      },
      h4: {
        fontSize: pxToRem(24),
        lineHeight: 1.375,
        ...baseHeadingProperties
      },
      h5: {
        fontSize: pxToRem(20),
        lineHeight: 1.375,
        ...baseHeadingProperties
      },
      h6: {
        fontSize: pxToRem(16),
        lineHeight: 1.625,
        ...baseHeadingProperties
      },
      subtitle1: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXL,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.625
      },
      subtitle2: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeMD,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.6
      },
      body1: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXL,
        fontWeight: baseProperties.fontWeightRegular,
        lineHeight: 1.625
      },
      body2: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeMD,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.6
      },
      button: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeSM,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.5,
        textTransform: "uppercase"
      },
      caption: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXS,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.25
      },
      overline: {
        fontFamily: baseProperties.fontFamily
      },
      d1: {
        fontSize: pxToRem(80),
        ...baseDisplayProperties
      },
      d2: {
        fontSize: pxToRem(72),
        ...baseDisplayProperties
      },
      d3: {
        fontSize: pxToRem(64),
        ...baseDisplayProperties
      },
      d4: {
        fontSize: pxToRem(56),
        ...baseDisplayProperties
      },
      d5: {
        fontSize: pxToRem(48),
        ...baseDisplayProperties
      },
      d6: {
        fontSize: pxToRem(40),
        ...baseDisplayProperties
      },
      size: {
        xxs: baseProperties.fontSizeXXS,
        xs: baseProperties.fontSizeXS,
        sm: baseProperties.fontSizeSM,
        md: baseProperties.fontSizeMD,
        lg: baseProperties.fontSizeLG,
        xl: baseProperties.fontSizeXL,
        "2xl": baseProperties.fontSize2XL,
        "3xl": baseProperties.fontSize3XL
      },
      lineHeight: {
        sm: 1.25,
        md: 1.5,
        lg: 2
      }
    };
  };
  const changeThemeMode = (mode) => {
    return {
      palette: palette(mode),
      typography: typography(mode),
      boxShadows: boxShadows(mode),
      borders: borders(mode)
    };
  };
  function ThemeProvider({ children, ...restProps }) {
    const settings = useSettingsContext();
    const themeModeOption = changeThemeMode(settings.themeMode);
    const baseOption = React$1.useMemo(() => {
      return {
        breakpoints: { ...breakpoints },
        palette: palette("light"),
        typography: typography("light"),
        boxShadows: boxShadows("light"),
        borders: borders("light"),
        functions: {
          boxShadow,
          hexToRgb,
          linearGradient,
          pxToRem,
          rgba
        },
        components: {}
      };
    }, []);
    const memoizedValue = React$1.useMemo(
      () => lodashMerge(
        // Base
        baseOption,
        // Dark mode
        themeModeOption
      ),
      [baseOption, themeModeOption]
    );
    const theme = createTheme(memoizedValue);
    theme.components = lodashMerge(componentsOverrides(theme), {});
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider$1, { theme, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalStyles, {}),
      children
    ] });
  }
  function App() {
    const [openPandora, setOpenPandora] = React$1.useState(false);
    const toggleOpenPandora = () => {
      setOpenPandora((prevState) => !prevState);
    };
    const handleClosePandora = () => {
      setOpenPandora(false);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$3.pandoraButton, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsProvider, { defaultSettings: { themeMode: "light" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PandoraButton,
        {
          color: "info",
          variant: "gradient",
          openPandora,
          onClick: () => toggleOpenPandora()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PandoraDrawer, { openDrawer: openPandora, handleCloseDrawer: handleClosePandora })
    ] }) }) });
  }
  if (window.location.hostname === "linux.do") {
    const appendLinuxDoNext = () => {
      const app = document.createElement("div");
      app.setAttribute("id", styles$3.pluginContainer);
      document.body.append(app);
      return app;
    };
    client.createRoot(appendLinuxDoNext()).render(
      /* @__PURE__ */ jsxRuntimeExports.jsx(React$1.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
    );
  }

})(React, ReactDOM);