// ==UserScript==
// @name         Douban
// @namespace    impossible98/douban
// @version      0.0.1
// @author       impossible98
// @description  Something about douban.
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @homepageURL  https://plutodoc.coding.net/public/monkey/douban-extension/git/files
// @match        https://movie.douban.com/subject/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499464/Douban.user.js
// @updateURL https://update.greasyfork.org/scripts/499464/Douban.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .i-icon{display:inline-block;color:inherit;font-style:normal;line-height:0;text-align:center;text-transform:none;vertical-align:-.125em;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.i-icon-spin svg{animation:i-icon-spin 1s infinite linear}.i-icon-rtl{transform:scaleX(-1)}@keyframes i-icon-spin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes i-icon-spin{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.App{background:#f4f4ec;padding:10px;margin-bottom:20px;word-wrap:break-word}div{display:block}button{margin-left:10px} ");

(function (React, require$$0) {
  'use strict';

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
  var f = React, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var m = require$$0;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var _excluded = ["size", "strokeWidth", "strokeLinecap", "strokeLinejoin", "theme", "fill", "className", "spin"];
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  var DEFAULT_ICON_CONFIGS = {
    size: "1em",
    strokeWidth: 4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    rtl: false,
    theme: "outline",
    colors: {
      outline: {
        fill: "#333",
        background: "transparent"
      },
      filled: {
        fill: "#333",
        background: "#FFF"
      },
      twoTone: {
        fill: "#333",
        twoTone: "#2F88FF"
      },
      multiColor: {
        outStrokeColor: "#333",
        outFillColor: "#2F88FF",
        innerStrokeColor: "#FFF",
        innerFillColor: "#43CCF8"
      }
    },
    prefix: "i"
  };
  function guid() {
    return "icon-" + ((1 + Math.random()) * 4294967296 | 0).toString(16).substring(1);
  }
  function IconConverter(id, icon, config) {
    var fill = typeof icon.fill === "string" ? [icon.fill] : icon.fill || [];
    var colors = [];
    var theme = icon.theme || config.theme;
    switch (theme) {
      case "outline":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("none");
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("none");
        break;
      case "filled":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("#FFF");
        colors.push("#FFF");
        break;
      case "two-tone":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.twoTone.twoTone);
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.twoTone.twoTone);
        break;
      case "multi-color":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.multiColor.outFillColor);
        colors.push(typeof fill[2] === "string" ? fill[2] : config.colors.multiColor.innerStrokeColor);
        colors.push(typeof fill[3] === "string" ? fill[3] : config.colors.multiColor.innerFillColor);
        break;
    }
    return {
      size: icon.size || config.size,
      strokeWidth: icon.strokeWidth || config.strokeWidth,
      strokeLinecap: icon.strokeLinecap || config.strokeLinecap,
      strokeLinejoin: icon.strokeLinejoin || config.strokeLinejoin,
      colors,
      id
    };
  }
  var IconContext = /* @__PURE__ */ React.createContext(DEFAULT_ICON_CONFIGS);
  IconContext.Provider;
  function IconWrapper(name, rtl, render) {
    return function(props) {
      var size = props.size, strokeWidth = props.strokeWidth, strokeLinecap = props.strokeLinecap, strokeLinejoin = props.strokeLinejoin, theme = props.theme, fill = props.fill, className = props.className, spin = props.spin, extra = _objectWithoutProperties(props, _excluded);
      var ICON_CONFIGS = React.useContext(IconContext);
      var id = React.useMemo(guid, []);
      var svgProps = IconConverter(id, {
        size,
        strokeWidth,
        strokeLinecap,
        strokeLinejoin,
        theme,
        fill
      }, ICON_CONFIGS);
      var cls = [ICON_CONFIGS.prefix + "-icon"];
      cls.push(ICON_CONFIGS.prefix + "-icon-" + name);
      if (ICON_CONFIGS.rtl) {
        cls.push(ICON_CONFIGS.prefix + "-icon-rtl");
      }
      if (spin) {
        cls.push(ICON_CONFIGS.prefix + "-icon-spin");
      }
      if (className) {
        cls.push(className);
      }
      return /* @__PURE__ */ React.createElement("span", _objectSpread(_objectSpread({}, extra), {}, {
        className: cls.join(" ")
      }), render(svgProps));
    };
  }
  const CopyOne = IconWrapper("copy-one", true, function(props) {
    return /* @__PURE__ */ React.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React.createElement("path", {
      d: "M13 38H41V16H30V4H13V38Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React.createElement("path", {
      d: "M30 4L41 16",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React.createElement("path", {
      d: "M7 20V44H28",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React.createElement("path", {
      d: "M19 20H23",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap
    }), /* @__PURE__ */ React.createElement("path", {
      d: "M19 28H31",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap
    }));
  });
  function App() {
    const [copySuccess, setCopySuccess] = React.useState(false);
    const contentElement = document.getElementById("content");
    const h1Element = contentElement == null ? void 0 : contentElement.getElementsByTagName("h1")[0];
    const spanElement = h1Element == null ? void 0 : h1Element.getElementsByTagName("span")[0];
    let text = "";
    if (spanElement !== null && spanElement !== void 0) {
      text = spanElement.innerText;
    }
    const targetURL = "https://tv.doutoutiao.cc/search.php";
    const targetURL2 = "https://www.themoviedb.org/search?query=" + text;
    const handleClick = async () => {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1e3);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "App", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Others" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "bs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: targetURL, target: "_blank", rel: "noopener noreferrer", children: "高清剧集网" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleClick, children: [
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyOne, { theme: "outline", size: "16", fill: "#333" })
          ] }),
          copySuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Copy Success!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: targetURL2, target: "_blank", rel: "noopener noreferrer", children: "TMDB" }) })
      ] })
    ] });
  }
  client.createRoot(
    (() => {
      var _a;
      const app = document.createElement("div");
      const element = document.querySelector(".gray_ad");
      (_a = element == null ? void 0 : element.parentNode) == null ? void 0 : _a.insertBefore(app, element.nextSibling);
      return app;
    })()
  ).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );

})(React, ReactDOM);