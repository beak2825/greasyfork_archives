// ==UserScript==
// @name         bahamut-sticker-master
// @namespace    npm/vite-plugin-monkey
// @version      1.0.0
// @author       Yotsuba
// @description  自訂巴哈姆特貼圖順序
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://forum.gamer.com.tw/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522779/bahamut-sticker-master.user.js
// @updateURL https://update.greasyfork.org/scripts/522779/bahamut-sticker-master.meta.js
// ==/UserScript==

(function (React, ReactDOM__default) {
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

  const React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);
  const ReactDOM__default__namespace = /*#__PURE__*/_interopNamespaceDefault(ReactDOM__default);

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
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
  var f$2 = React, k$2 = Symbol.for("react.element"), l$2 = Symbol.for("react.fragment"), m$3 = Object.prototype.hasOwnProperty, n$2 = f$2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$2 = { key: true, ref: true, __self: true, __source: true };
  function q$2(c2, a, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a.key && (e2 = "" + a.key);
    void 0 !== a.ref && (h2 = a.ref);
    for (b2 in a) m$3.call(a, b2) && !p$2.hasOwnProperty(b2) && (d2[b2] = a[b2]);
    if (c2 && c2.defaultProps) for (b2 in a = c2.defaultProps, a) void 0 === d2[b2] && (d2[b2] = a[b2]);
    return { $$typeof: k$2, type: c2, key: e2, ref: h2, props: d2, _owner: n$2.current };
  }
  reactJsxRuntime_production_min.Fragment = l$2;
  reactJsxRuntime_production_min.jsx = q$2;
  reactJsxRuntime_production_min.jsxs = q$2;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var m$2 = ReactDOM__default;
  {
    client.createRoot = m$2.createRoot;
    client.hydrateRoot = m$2.hydrateRoot;
  }
  const common = {
    black: "#000",
    white: "#fff"
  };
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
  function formatMuiErrorMessage(code, ...args) {
    const url = new URL(`https://mui.com/production-error/?code=${code}`);
    args.forEach((arg2) => url.searchParams.append("args[]", arg2));
    return `Minified MUI error #${code}; visit ${url} for the full message.`;
  }
  const THEME_ID = "$$material";
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var t2 = arguments[e2];
        for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
      }
      return n2;
    }, _extends.apply(null, arguments);
  }
  var isDevelopment$1 = false;
  function sheetForTag(tag) {
    if (tag.sheet) {
      return tag.sheet;
    }
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        return document.styleSheets[i];
      }
    }
    return void 0;
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
      this.isSpeedy = options.speedy === void 0 ? !isDevelopment$1 : options.speedy;
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
    _proto.flush = function flush3() {
      this.tags.forEach(function(tag) {
        var _tag$parentNode;
        return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
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
  function hash(value, length2) {
    return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
  }
  function trim(value) {
    return value.trim();
  }
  function match$1(value, pattern) {
    return (value = pattern.exec(value)) ? value[0] : value;
  }
  function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
  }
  function indexof(value, search) {
    return value.indexOf(search);
  }
  function charat(value, index2) {
    return value.charCodeAt(index2) | 0;
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
  function combine$1(array, callback) {
    return array.map(callback).join("");
  }
  var line = 1;
  var column = 1;
  var length = 0;
  var position$1 = 0;
  var character = 0;
  var characters = "";
  function node(value, root, parent, type, props, children, length2) {
    return { value, root, parent, type, props, children, line, column, length: length2, return: "" };
  }
  function copy(root, props) {
    return assign(node("", null, null, "", null, null, 0), root, { length: -root.length }, props);
  }
  function char() {
    return character;
  }
  function prev() {
    character = position$1 > 0 ? charat(characters, --position$1) : 0;
    if (column--, character === 10)
      column = 1, line--;
    return character;
  }
  function next() {
    character = position$1 < length ? charat(characters, position$1++) : 0;
    if (column++, character === 10)
      column = 1, line++;
    return character;
  }
  function peek() {
    return charat(characters, position$1);
  }
  function caret() {
    return position$1;
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
    return line = column = 1, length = strlen(characters = value), position$1 = 0, [];
  }
  function dealloc(value) {
    return characters = "", value;
  }
  function delimit(type) {
    return trim(slice(position$1 - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
  }
  function whitespace(type) {
    while (character = peek())
      if (character < 33)
        next();
      else
        break;
    return token(type) > 2 || token(character) > 3 ? "" : " ";
  }
  function escaping(index2, count2) {
    while (--count2 && next())
      if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
        break;
    return slice(index2, caret() + (count2 < 6 && peek() == 32 && next() == 32));
  }
  function delimiter(type) {
    while (next())
      switch (character) {
        case type:
          return position$1;
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
    return position$1;
  }
  function commenter(type, index2) {
    while (next())
      if (type + character === 47 + 10)
        break;
      else if (type + character === 42 + 42 && peek() === 47)
        break;
    return "/*" + slice(index2, position$1 - 1) + "*" + from(type === 47 ? type : next());
  }
  function identifier(index2) {
    while (!token(peek()))
      next();
    return slice(index2, position$1);
  }
  function compile(value) {
    return dealloc(parse$1("", null, null, null, [""], value = alloc(value), 0, [0], value));
  }
  function parse$1(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index2 = 0;
    var offset3 = 0;
    var length2 = pseudo;
    var atrule = 0;
    var property = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character2 = 0;
    var type = "";
    var props = rules;
    var children = rulesets;
    var reference = rule;
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
              append(comment(commenter(next(), caret()), root, parent), declarations);
              break;
            default:
              characters2 += "/";
          }
          break;
        case 123 * variable:
          points[index2++] = strlen(characters2) * ampersand;
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            case 0:
            case 125:
              scanning = 0;
            case 59 + offset3:
              if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
              if (property > 0 && strlen(characters2) - length2)
                append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
              break;
            case 59:
              characters2 += ";";
            default:
              append(reference = ruleset(characters2, root, parent, index2, offset3, rules, points, type, props = [], children = [], length2), rulesets);
              if (character2 === 123)
                if (offset3 === 0)
                  parse$1(characters2, root, reference, reference, props, rulesets, length2, points, children);
                else
                  switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                    case 100:
                    case 108:
                    case 109:
                    case 115:
                      parse$1(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                      break;
                    default:
                      parse$1(characters2, reference, reference, reference, [""], children, 0, points, children);
                  }
          }
          index2 = offset3 = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
          break;
        case 58:
          length2 = 1 + strlen(characters2), property = previous;
        default:
          if (variable < 1) {
            if (character2 == 123)
              --variable;
            else if (character2 == 125 && variable++ == 0 && prev() == 125)
              continue;
          }
          switch (characters2 += from(character2), character2 * variable) {
            case 38:
              ampersand = offset3 > 0 ? 1 : (characters2 += "\f", -1);
              break;
            case 44:
              points[index2++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            case 64:
              if (peek() === 45)
                characters2 += delimit(next());
              atrule = peek(), offset3 = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root, parent, index2, offset3, rules, points, type, props, children, length2) {
    var post = offset3 - 1;
    var rule = offset3 === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i = 0, j = 0, k2 = 0; i < index2; ++i)
      for (var x = 0, y2 = substr(value, post + 1, post = abs(j = points[i])), z2 = value; x < size; ++x)
        if (z2 = trim(j > 0 ? rule[x] + " " + y2 : replace(y2, /&\f/g, rule[x])))
          props[k2++] = z2;
    return node(value, root, parent, offset3 === 0 ? RULESET : type, props, children, length2);
  }
  function comment(value, root, parent) {
    return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
  }
  function declaration(value, root, parent, length2) {
    return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
  }
  function serialize(children, callback) {
    var output = "";
    var length2 = sizeof(children);
    for (var i = 0; i < length2; i++)
      output += callback(children[i], i, children, callback) || "";
    return output;
  }
  function stringify(element, index2, children, callback) {
    switch (element.type) {
      case LAYER:
        if (element.children.length) break;
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
    return function(element, index2, children, callback) {
      var output = "";
      for (var i = 0; i < length2; i++)
        output += collection[i](element, index2, children, callback) || "";
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
  function memoize$1(fn) {
    var cache = /* @__PURE__ */ Object.create(null);
    return function(arg2) {
      if (cache[arg2] === void 0) cache[arg2] = fn(arg2);
      return cache[arg2];
    };
  }
  var identifierWithPointTracking = function identifierWithPointTracking2(begin, points, index2) {
    var previous = 0;
    var character2 = 0;
    while (true) {
      previous = character2;
      character2 = peek();
      if (previous === 38 && character2 === 12) {
        points[index2] = 1;
      }
      if (token(character2)) {
        break;
      }
      next();
    }
    return slice(begin, position$1);
  };
  var toRules = function toRules2(parsed, points) {
    var index2 = -1;
    var character2 = 44;
    do {
      switch (token(character2)) {
        case 0:
          if (character2 === 38 && peek() === 12) {
            points[index2] = 1;
          }
          parsed[index2] += identifierWithPointTracking(position$1 - 1, points, index2);
          break;
        case 2:
          parsed[index2] += delimit(character2);
          break;
        case 4:
          if (character2 === 44) {
            parsed[++index2] = peek() === 58 ? "&\f" : "";
            points[index2] = parsed[index2].length;
            break;
          }
        default:
          parsed[index2] += from(character2);
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
    var value = element.value;
    var parent = element.parent;
    var isImplicitRule = element.column === parent.column && element.line === parent.line;
    while (parent.type !== "rule") {
      parent = parent.parent;
      if (!parent) return;
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
  function prefix$3(value, length2) {
    switch (hash(value, length2)) {
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
        if (strlen(value) - 1 - length2 > 6) switch (charat(value, length2 + 1)) {
          case 109:
            if (charat(value, length2 + 4) !== 45) break;
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          case 115:
            return ~indexof(value, "stretch") ? prefix$3(replace(value, "stretch", "fill-available"), length2) + value : value;
        }
        break;
      case 4949:
        if (charat(value, length2 + 1) !== 115) break;
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
  var prefixer = function prefixer2(element, index2, children, callback) {
    if (element.length > -1) {
      if (!element["return"]) switch (element.type) {
        case DECLARATION:
          element["return"] = prefix$3(element.value, element.length);
          break;
        case KEYFRAMES:
          return serialize([copy(element, {
            value: replace(element.value, "@", "@" + WEBKIT)
          })], callback);
        case RULESET:
          if (element.length) return combine$1(element.props, function(value) {
            switch (match$1(value, /(::plac\w+|:read-\w+)/)) {
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
          cache.inserted[serialized.name] = true;
        }
      };
    }
    var cache = {
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
    cache.sheet.hydrate(nodesToHydrate);
    return cache;
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
  var b$1 = "function" === typeof Symbol && Symbol.for, c$1 = b$1 ? Symbol.for("react.element") : 60103, d$1 = b$1 ? Symbol.for("react.portal") : 60106, e$1 = b$1 ? Symbol.for("react.fragment") : 60107, f$1 = b$1 ? Symbol.for("react.strict_mode") : 60108, g$1 = b$1 ? Symbol.for("react.profiler") : 60114, h$1 = b$1 ? Symbol.for("react.provider") : 60109, k$1 = b$1 ? Symbol.for("react.context") : 60110, l$1 = b$1 ? Symbol.for("react.async_mode") : 60111, m$1 = b$1 ? Symbol.for("react.concurrent_mode") : 60111, n$1 = b$1 ? Symbol.for("react.forward_ref") : 60112, p$1 = b$1 ? Symbol.for("react.suspense") : 60113, q$1 = b$1 ? Symbol.for("react.suspense_list") : 60120, r$2 = b$1 ? Symbol.for("react.memo") : 60115, t = b$1 ? Symbol.for("react.lazy") : 60116, v$1 = b$1 ? Symbol.for("react.block") : 60121, w$1 = b$1 ? Symbol.for("react.fundamental") : 60117, x$1 = b$1 ? Symbol.for("react.responder") : 60118, y$1 = b$1 ? Symbol.for("react.scope") : 60119;
  function z$1(a) {
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
                case t:
                case r$2:
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
  function A$1(a) {
    return z$1(a) === m$1;
  }
  reactIs_production_min$1.AsyncMode = l$1;
  reactIs_production_min$1.ConcurrentMode = m$1;
  reactIs_production_min$1.ContextConsumer = k$1;
  reactIs_production_min$1.ContextProvider = h$1;
  reactIs_production_min$1.Element = c$1;
  reactIs_production_min$1.ForwardRef = n$1;
  reactIs_production_min$1.Fragment = e$1;
  reactIs_production_min$1.Lazy = t;
  reactIs_production_min$1.Memo = r$2;
  reactIs_production_min$1.Portal = d$1;
  reactIs_production_min$1.Profiler = g$1;
  reactIs_production_min$1.StrictMode = f$1;
  reactIs_production_min$1.Suspense = p$1;
  reactIs_production_min$1.isAsyncMode = function(a) {
    return A$1(a) || z$1(a) === l$1;
  };
  reactIs_production_min$1.isConcurrentMode = A$1;
  reactIs_production_min$1.isContextConsumer = function(a) {
    return z$1(a) === k$1;
  };
  reactIs_production_min$1.isContextProvider = function(a) {
    return z$1(a) === h$1;
  };
  reactIs_production_min$1.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === c$1;
  };
  reactIs_production_min$1.isForwardRef = function(a) {
    return z$1(a) === n$1;
  };
  reactIs_production_min$1.isFragment = function(a) {
    return z$1(a) === e$1;
  };
  reactIs_production_min$1.isLazy = function(a) {
    return z$1(a) === t;
  };
  reactIs_production_min$1.isMemo = function(a) {
    return z$1(a) === r$2;
  };
  reactIs_production_min$1.isPortal = function(a) {
    return z$1(a) === d$1;
  };
  reactIs_production_min$1.isProfiler = function(a) {
    return z$1(a) === g$1;
  };
  reactIs_production_min$1.isStrictMode = function(a) {
    return z$1(a) === f$1;
  };
  reactIs_production_min$1.isSuspense = function(a) {
    return z$1(a) === p$1;
  };
  reactIs_production_min$1.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === e$1 || a === m$1 || a === g$1 || a === f$1 || a === p$1 || a === q$1 || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r$2 || a.$$typeof === h$1 || a.$$typeof === k$1 || a.$$typeof === n$1 || a.$$typeof === w$1 || a.$$typeof === x$1 || a.$$typeof === y$1 || a.$$typeof === v$1);
  };
  reactIs_production_min$1.typeOf = z$1;
  {
    reactIs$2.exports = reactIs_production_min$1;
  }
  var reactIsExports$1 = reactIs$2.exports;
  var reactIs$1 = reactIsExports$1;
  var REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
  };
  var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
  };
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
  function getStatics(component) {
    if (reactIs$1.isMemo(component)) {
      return MEMO_STATICS;
    }
    return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
  }
  var defineProperty = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = Object.prototype;
  function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== "string") {
      if (objectPrototype) {
        var inheritedComponent = getPrototypeOf(sourceComponent);
        if (inheritedComponent && inheritedComponent !== objectPrototype) {
          hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
        }
      }
      var keys = getOwnPropertyNames(sourceComponent);
      if (getOwnPropertySymbols) {
        keys = keys.concat(getOwnPropertySymbols(sourceComponent));
      }
      var targetStatics = getStatics(targetComponent);
      var sourceStatics = getStatics(sourceComponent);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
          var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
          try {
            defineProperty(targetComponent, key, descriptor);
          } catch (e2) {
          }
        }
      }
    }
    return targetComponent;
  }
  var hoistNonReactStatics_cjs = hoistNonReactStatics;
  const hoistStatics = /* @__PURE__ */ getDefaultExportFromCjs(hoistNonReactStatics_cjs);
  var isBrowser = true;
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = "";
    classNames.split(" ").forEach(function(className) {
      if (registered[className] !== void 0) {
        registeredStyles.push(registered[className] + ";");
      } else if (className) {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var registerStyles = function registerStyles2(cache, serialized, isStringTag2) {
    var className = cache.key + "-" + serialized.name;
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
      isBrowser === false) && cache.registered[className] === void 0
    ) {
      cache.registered[className] = serialized.styles;
    }
  };
  var insertStyles = function insertStyles2(cache, serialized, isStringTag2) {
    registerStyles(cache, serialized, isStringTag2);
    var className = cache.key + "-" + serialized.name;
    if (cache.inserted[serialized.name] === void 0) {
      var current = serialized;
      do {
        cache.insert(serialized === current ? "." + className : "", current, cache.sheet, true);
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
    scale: 1,
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
  var isCustomProperty = function isCustomProperty2(property) {
    return property.charCodeAt(1) === 45;
  };
  var isProcessableValue = function isProcessableValue2(value) {
    return value != null && typeof value !== "boolean";
  };
  var processStyleName = /* @__PURE__ */ memoize$1(function(styleName) {
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
  function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
      return "";
    }
    var componentSelector = interpolation;
    if (componentSelector.__emotion_styles !== void 0) {
      return componentSelector;
    }
    switch (typeof interpolation) {
      case "boolean": {
        return "";
      }
      case "object": {
        var keyframes2 = interpolation;
        if (keyframes2.anim === 1) {
          cursor = {
            name: keyframes2.name,
            styles: keyframes2.styles,
            next: cursor
          };
          return keyframes2.name;
        }
        var serializedStyles = interpolation;
        if (serializedStyles.styles !== void 0) {
          var next2 = serializedStyles.next;
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
          var styles2 = serializedStyles.styles + ";";
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
    var asString = interpolation;
    if (registered == null) {
      return asString;
    }
    var cached = registered[asString];
    return cached !== void 0 ? cached : asString;
  }
  function createStringFromObject(mergedProps, registered, obj) {
    var string = "";
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
      }
    } else {
      for (var key in obj) {
        var value = obj[key];
        if (typeof value !== "object") {
          var asString = value;
          if (registered != null && registered[asString] !== void 0) {
            string += key + "{" + registered[asString] + "}";
          } else if (isProcessableValue(asString)) {
            string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
          }
        } else {
          if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue(value[_i])) {
                string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value);
            switch (key) {
              case "animation":
              case "animationName": {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }
              default: {
                string += key + "{" + interpolated + "}";
              }
            }
          }
        }
      }
    }
    return string;
  }
  var labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g;
  var cursor;
  function serializeStyles(args, registered, mergedProps) {
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
      var asTemplateStringsArr = strings;
      styles2 += asTemplateStringsArr[0];
    }
    for (var i = 1; i < args.length; i++) {
      styles2 += handleInterpolation(mergedProps, registered, args[i]);
      if (stringMode) {
        var templateStringsArr = strings;
        styles2 += templateStringsArr[i];
      }
    }
    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern.exec(styles2)) !== null) {
      identifierName += "-" + match2[1];
    }
    var name = murmur2(styles2) + identifierName;
    return {
      name,
      styles: styles2,
      next: cursor
    };
  }
  var syncFallback = function syncFallback2(create2) {
    return create2();
  };
  var useInsertionEffect = React__namespace["useInsertionEffect"] ? React__namespace["useInsertionEffect"] : false;
  var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
  var isDevelopment = false;
  var EmotionCacheContext = /* @__PURE__ */ React__namespace.createContext(
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
  EmotionCacheContext.Provider;
  var withEmotionCache = function withEmotionCache2(func) {
    return /* @__PURE__ */ React.forwardRef(function(props, ref) {
      var cache = React.useContext(EmotionCacheContext);
      return func(props, cache, ref);
    });
  };
  var ThemeContext = /* @__PURE__ */ React__namespace.createContext({});
  var hasOwn = {}.hasOwnProperty;
  var typePropName = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__";
  var createEmotionProps = function createEmotionProps2(type, props) {
    var newProps = {};
    for (var _key in props) {
      if (hasOwn.call(props, _key)) {
        newProps[_key] = props[_key];
      }
    }
    newProps[typePropName] = type;
    return newProps;
  };
  var Insertion$1 = function Insertion(_ref) {
    var cache = _ref.cache, serialized = _ref.serialized, isStringTag2 = _ref.isStringTag;
    registerStyles(cache, serialized, isStringTag2);
    useInsertionEffectAlwaysWithSyncFallback(function() {
      return insertStyles(cache, serialized, isStringTag2);
    });
    return null;
  };
  var Emotion = /* @__PURE__ */ withEmotionCache(function(props, cache, ref) {
    var cssProp = props.css;
    if (typeof cssProp === "string" && cache.registered[cssProp] !== void 0) {
      cssProp = cache.registered[cssProp];
    }
    var WrappedComponent = props[typePropName];
    var registeredStyles = [cssProp];
    var className = "";
    if (typeof props.className === "string") {
      className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
    } else if (props.className != null) {
      className = props.className + " ";
    }
    var serialized = serializeStyles(registeredStyles, void 0, React__namespace.useContext(ThemeContext));
    className += cache.key + "-" + serialized.name;
    var newProps = {};
    for (var _key2 in props) {
      if (hasOwn.call(props, _key2) && _key2 !== "css" && _key2 !== typePropName && !isDevelopment) {
        newProps[_key2] = props[_key2];
      }
    }
    newProps.className = className;
    if (ref) {
      newProps.ref = ref;
    }
    return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(Insertion$1, {
      cache,
      serialized,
      isStringTag: typeof WrappedComponent === "string"
    }), /* @__PURE__ */ React__namespace.createElement(WrappedComponent, newProps));
  });
  var Emotion$1 = Emotion;
  var jsx = function jsx2(type, props) {
    var args = arguments;
    if (props == null || !hasOwn.call(props, "css")) {
      return React__namespace.createElement.apply(void 0, args);
    }
    var argsLength = args.length;
    var createElementArgArray = new Array(argsLength);
    createElementArgArray[0] = Emotion$1;
    createElementArgArray[1] = createEmotionProps(type, props);
    for (var i = 2; i < argsLength; i++) {
      createElementArgArray[i] = args[i];
    }
    return React__namespace.createElement.apply(null, createElementArgArray);
  };
  (function(_jsx) {
    var JSX;
    /* @__PURE__ */ (function(_JSX) {
    })(JSX || (JSX = _jsx.JSX || (_jsx.JSX = {})));
  })(jsx);
  function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return serializeStyles(args);
  }
  function keyframes() {
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
  }
  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
  var isPropValid = /* @__PURE__ */ memoize$1(
    function(prop) {
      return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
    }
    /* Z+1 */
  );
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
  var Insertion2 = function Insertion3(_ref) {
    var cache = _ref.cache, serialized = _ref.serialized, isStringTag2 = _ref.isStringTag;
    registerStyles(cache, serialized, isStringTag2);
    useInsertionEffectAlwaysWithSyncFallback(function() {
      return insertStyles(cache, serialized, isStringTag2);
    });
    return null;
  };
  var createStyled$1 = function createStyled(tag, options) {
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
        var templateStringsArr = args[0];
        styles2.push(templateStringsArr[0]);
        var len = args.length;
        var i = 1;
        for (; i < len; i++) {
          styles2.push(args[i], templateStringsArr[i]);
        }
      }
      var Styled = withEmotionCache(function(props, cache, ref) {
        var FinalTag = shouldUseAs && props.as || baseTag;
        var className = "";
        var classInterpolations = [];
        var mergedProps = props;
        if (props.theme == null) {
          mergedProps = {};
          for (var key in props) {
            mergedProps[key] = props[key];
          }
          mergedProps.theme = React__namespace.useContext(ThemeContext);
        }
        if (typeof props.className === "string") {
          className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
        } else if (props.className != null) {
          className = props.className + " ";
        }
        var serialized = serializeStyles(styles2.concat(classInterpolations), cache.registered, mergedProps);
        className += cache.key + "-" + serialized.name;
        if (targetClassName !== void 0) {
          className += " " + targetClassName;
        }
        var finalShouldForwardProp = shouldUseAs && shouldForwardProp2 === void 0 ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
        var newProps = {};
        for (var _key in props) {
          if (shouldUseAs && _key === "as") continue;
          if (finalShouldForwardProp(_key)) {
            newProps[_key] = props[_key];
          }
        }
        newProps.className = className;
        if (ref) {
          newProps.ref = ref;
        }
        return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(Insertion2, {
          cache,
          serialized,
          isStringTag: typeof FinalTag === "string"
        }), /* @__PURE__ */ React__namespace.createElement(FinalTag, newProps));
      });
      Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
      Styled.defaultProps = tag.defaultProps;
      Styled.__emotion_real = Styled;
      Styled.__emotion_base = baseTag;
      Styled.__emotion_styles = styles2;
      Styled.__emotion_forwardProp = shouldForwardProp2;
      Object.defineProperty(Styled, "toString", {
        value: function value() {
          return "." + targetClassName;
        }
      });
      Styled.withComponent = function(nextTag, nextOptions) {
        var newStyled2 = createStyled(nextTag, _extends({}, options, nextOptions, {
          shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
        }));
        return newStyled2.apply(void 0, styles2);
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
  var newStyled = createStyled$1.bind(null);
  tags.forEach(function(tagName) {
    newStyled[tagName] = newStyled(tagName);
  });
  /**
   * @mui/styled-engine v6.3.0
   *
   * @license MIT
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  function styled$1(tag, options) {
    const stylesFactory = newStyled(tag, options);
    return stylesFactory;
  }
  function internal_mutateStyles(tag, processor) {
    if (Array.isArray(tag.__emotion_styles)) {
      tag.__emotion_styles = processor(tag.__emotion_styles);
    }
  }
  const wrapper = [];
  function internal_serializeStyles(styles2) {
    wrapper[0] = styles2;
    return serializeStyles(wrapper);
  }
  function isPlainObject$1(item) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    const prototype = Object.getPrototypeOf(item);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
  }
  function deepClone(source) {
    if (/* @__PURE__ */ React__namespace.isValidElement(source) || !isPlainObject$1(source)) {
      return source;
    }
    const output = {};
    Object.keys(source).forEach((key) => {
      output[key] = deepClone(source[key]);
    });
    return output;
  }
  function deepmerge(target, source, options = {
    clone: true
  }) {
    const output = options.clone ? {
      ...target
    } : target;
    if (isPlainObject$1(target) && isPlainObject$1(source)) {
      Object.keys(source).forEach((key) => {
        if (/* @__PURE__ */ React__namespace.isValidElement(source[key])) {
          output[key] = source[key];
        } else if (isPlainObject$1(source[key]) && // Avoid prototype pollution
        Object.prototype.hasOwnProperty.call(target, key) && isPlainObject$1(target[key])) {
          output[key] = deepmerge(target[key], source[key], options);
        } else if (options.clone) {
          output[key] = isPlainObject$1(source[key]) ? deepClone(source[key]) : source[key];
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  }
  const sortBreakpointsValues = (values2) => {
    const breakpointsAsArray = Object.keys(values2).map((key) => ({
      key,
      val: values2[key]
    })) || [];
    breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
    return breakpointsAsArray.reduce((acc, obj) => {
      return {
        ...acc,
        [obj.key]: obj.val
      };
    }, {});
  };
  function createBreakpoints(breakpoints) {
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
      step = 5,
      ...other
    } = breakpoints;
    const sortedValues = sortBreakpointsValues(values2);
    const keys = Object.keys(sortedValues);
    function up(key) {
      const value = typeof values2[key] === "number" ? values2[key] : key;
      return `@media (min-width:${value}${unit})`;
    }
    function down(key) {
      const value = typeof values2[key] === "number" ? values2[key] : key;
      return `@media (max-width:${value - step / 100}${unit})`;
    }
    function between(start, end2) {
      const endIndex = keys.indexOf(end2);
      return `@media (min-width:${typeof values2[start] === "number" ? values2[start] : start}${unit}) and (max-width:${(endIndex !== -1 && typeof values2[keys[endIndex]] === "number" ? values2[keys[endIndex]] : end2) - step / 100}${unit})`;
    }
    function only(key) {
      if (keys.indexOf(key) + 1 < keys.length) {
        return between(key, keys[keys.indexOf(key) + 1]);
      }
      return up(key);
    }
    function not(key) {
      const keyIndex = keys.indexOf(key);
      if (keyIndex === 0) {
        return up(keys[1]);
      }
      if (keyIndex === keys.length - 1) {
        return down(keys[keyIndex]);
      }
      return between(key, keys[keys.indexOf(key) + 1]).replace("@media", "@media not all and");
    }
    return {
      keys,
      values: sortedValues,
      up,
      down,
      between,
      only,
      not,
      unit,
      ...other
    };
  }
  function sortContainerQueries(theme, css2) {
    if (!theme.containerQueries) {
      return css2;
    }
    const sorted = Object.keys(css2).filter((key) => key.startsWith("@container")).sort((a, b2) => {
      var _a, _b;
      const regex = /min-width:\s*([0-9.]+)/;
      return +(((_a = a.match(regex)) == null ? void 0 : _a[1]) || 0) - +(((_b = b2.match(regex)) == null ? void 0 : _b[1]) || 0);
    });
    if (!sorted.length) {
      return css2;
    }
    return sorted.reduce((acc, key) => {
      const value = css2[key];
      delete acc[key];
      acc[key] = value;
      return acc;
    }, {
      ...css2
    });
  }
  function isCqShorthand(breakpointKeys, value) {
    return value === "@" || value.startsWith("@") && (breakpointKeys.some((key) => value.startsWith(`@${key}`)) || !!value.match(/^@\d/));
  }
  function getContainerQuery(theme, shorthand) {
    const matches = shorthand.match(/^@([^/]+)?\/?(.+)?$/);
    if (!matches) {
      return null;
    }
    const [, containerQuery, containerName] = matches;
    const value = Number.isNaN(+containerQuery) ? containerQuery || 0 : +containerQuery;
    return theme.containerQueries(containerName).up(value);
  }
  function cssContainerQueries(themeInput) {
    const toContainerQuery = (mediaQuery, name) => mediaQuery.replace("@media", name ? `@container ${name}` : "@container");
    function attachCq(node22, name) {
      node22.up = (...args) => toContainerQuery(themeInput.breakpoints.up(...args), name);
      node22.down = (...args) => toContainerQuery(themeInput.breakpoints.down(...args), name);
      node22.between = (...args) => toContainerQuery(themeInput.breakpoints.between(...args), name);
      node22.only = (...args) => toContainerQuery(themeInput.breakpoints.only(...args), name);
      node22.not = (...args) => {
        const result = toContainerQuery(themeInput.breakpoints.not(...args), name);
        if (result.includes("not all and")) {
          return result.replace("not all and ", "").replace("min-width:", "width<").replace("max-width:", "width>").replace("and", "or");
        }
        return result;
      };
    }
    const node2 = {};
    const containerQueries = (name) => {
      attachCq(node2, name);
      return node2;
    };
    attachCq(containerQueries);
    return {
      ...themeInput,
      containerQueries
    };
  }
  const shape = {
    borderRadius: 4
  };
  function merge(acc, item) {
    if (!item) {
      return acc;
    }
    return deepmerge(acc, item, {
      clone: false
      // No need to clone deep, it's way faster.
    });
  }
  const values$2 = {
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
    up: (key) => `@media (min-width:${values$2[key]}px)`
  };
  const defaultContainerQueries = {
    containerQueries: (containerName) => ({
      up: (key) => {
        let result = typeof key === "number" ? key : values$2[key] || key;
        if (typeof result === "number") {
          result = `${result}px`;
        }
        return containerName ? `@container ${containerName} (min-width:${result})` : `@container (min-width:${result})`;
      }
    })
  };
  function handleBreakpoints(props, propValue, styleFromPropValue) {
    const theme = props.theme || {};
    if (Array.isArray(propValue)) {
      const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
      return propValue.reduce((acc, item, index2) => {
        acc[themeBreakpoints.up(themeBreakpoints.keys[index2])] = styleFromPropValue(propValue[index2]);
        return acc;
      }, {});
    }
    if (typeof propValue === "object") {
      const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
      return Object.keys(propValue).reduce((acc, breakpoint) => {
        if (isCqShorthand(themeBreakpoints.keys, breakpoint)) {
          const containerKey = getContainerQuery(theme.containerQueries ? theme : defaultContainerQueries, breakpoint);
          if (containerKey) {
            acc[containerKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
          }
        } else if (Object.keys(themeBreakpoints.values || values$2).includes(breakpoint)) {
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
    var _a;
    const breakpointsInOrder = (_a = breakpointsInput.keys) == null ? void 0 : _a.reduce((acc, key) => {
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
  function capitalize(string) {
    if (typeof string !== "string") {
      throw new Error(formatMuiErrorMessage(7));
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
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
  function getStyleValue(themeMapping, transform, propValueFinal, userValue = propValueFinal) {
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
  function style$2(options) {
    const {
      prop,
      cssProperty = options.prop,
      themeKey,
      transform
    } = options;
    const fn = (props) => {
      if (props[prop] == null) {
        return null;
      }
      const propValue = props[prop];
      const theme = props.theme;
      const themeMapping = getPath(theme, themeKey) || {};
      const styleFromPropValue = (propValueFinal) => {
        let value = getStyleValue(themeMapping, transform, propValueFinal);
        if (propValueFinal === value && typeof propValueFinal === "string") {
          value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize(propValueFinal)}`, propValueFinal);
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
    fn.propTypes = {};
    fn.filterProps = [prop];
    return fn;
  }
  function memoize(fn) {
    const cache = {};
    return (arg2) => {
      if (cache[arg2] === void 0) {
        cache[arg2] = fn(arg2);
      }
      return cache[arg2];
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
  const getCssProperties = memoize((prop) => {
    if (prop.length > 2) {
      if (aliases[prop]) {
        prop = aliases[prop];
      } else {
        return [prop];
      }
    }
    const [a, b2] = prop.split("");
    const property = properties[a];
    const direction = directions[b2] || "";
    return Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
  });
  const marginKeys = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"];
  const paddingKeys = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"];
  [...marginKeys, ...paddingKeys];
  function createUnaryUnit(theme, themeKey, defaultValue, propName) {
    const themeSpacing = getPath(theme, themeKey, true) ?? defaultValue;
    if (typeof themeSpacing === "number" || typeof themeSpacing === "string") {
      return (val) => {
        if (typeof val === "string") {
          return val;
        }
        if (typeof themeSpacing === "string") {
          return `calc(${val} * ${themeSpacing})`;
        }
        return themeSpacing * val;
      };
    }
    if (Array.isArray(themeSpacing)) {
      return (val) => {
        if (typeof val === "string") {
          return val;
        }
        const abs2 = Math.abs(val);
        const transformed = themeSpacing[abs2];
        if (val >= 0) {
          return transformed;
        }
        if (typeof transformed === "number") {
          return -transformed;
        }
        return `-${transformed}`;
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
  function getValue$1(transformer, propValue) {
    if (typeof propValue === "string" || propValue == null) {
      return propValue;
    }
    return transformer(propValue);
  }
  function getStyleFromPropValue(cssProperties, transformer) {
    return (propValue) => cssProperties.reduce((acc, cssProperty) => {
      acc[cssProperty] = getValue$1(transformer, propValue);
      return acc;
    }, {});
  }
  function resolveCssProperty(props, keys, prop, transformer) {
    if (!keys.includes(prop)) {
      return null;
    }
    const cssProperties = getCssProperties(prop);
    const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
    const propValue = props[prop];
    return handleBreakpoints(props, propValue, styleFromPropValue);
  }
  function style$1(props, keys) {
    const transformer = createUnarySpacing(props.theme);
    return Object.keys(props).map((prop) => resolveCssProperty(props, keys, prop, transformer)).reduce(merge, {});
  }
  function margin(props) {
    return style$1(props, marginKeys);
  }
  margin.propTypes = {};
  margin.filterProps = marginKeys;
  function padding(props) {
    return style$1(props, paddingKeys);
  }
  padding.propTypes = {};
  padding.filterProps = paddingKeys;
  function createSpacing(spacingInput = 8, transform = createUnarySpacing({
    spacing: spacingInput
  })) {
    if (spacingInput.mui) {
      return spacingInput;
    }
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
  function compose$1(...styles2) {
    const handlers = styles2.reduce((acc, style2) => {
      style2.filterProps.forEach((prop) => {
        acc[prop] = style2;
      });
      return acc;
    }, {});
    const fn = (props) => {
      return Object.keys(props).reduce((acc, prop) => {
        if (handlers[prop]) {
          return merge(acc, handlers[prop](props));
        }
        return acc;
      }, {});
    };
    fn.propTypes = {};
    fn.filterProps = styles2.reduce((acc, style2) => acc.concat(style2.filterProps), []);
    return fn;
  }
  function borderTransform(value) {
    if (typeof value !== "number") {
      return value;
    }
    return `${value}px solid`;
  }
  function createBorderStyle(prop, transform) {
    return style$2({
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
        borderRadius: getValue$1(transformer, propValue)
      });
      return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
    }
    return null;
  };
  borderRadius.propTypes = {};
  borderRadius.filterProps = ["borderRadius"];
  compose$1(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, outline, outlineColor);
  const gap = (props) => {
    if (props.gap !== void 0 && props.gap !== null) {
      const transformer = createUnaryUnit(props.theme, "spacing", 8);
      const styleFromPropValue = (propValue) => ({
        gap: getValue$1(transformer, propValue)
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
        columnGap: getValue$1(transformer, propValue)
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
        rowGap: getValue$1(transformer, propValue)
      });
      return handleBreakpoints(props, props.rowGap, styleFromPropValue);
    }
    return null;
  };
  rowGap.propTypes = {};
  rowGap.filterProps = ["rowGap"];
  const gridColumn = style$2({
    prop: "gridColumn"
  });
  const gridRow = style$2({
    prop: "gridRow"
  });
  const gridAutoFlow = style$2({
    prop: "gridAutoFlow"
  });
  const gridAutoColumns = style$2({
    prop: "gridAutoColumns"
  });
  const gridAutoRows = style$2({
    prop: "gridAutoRows"
  });
  const gridTemplateColumns = style$2({
    prop: "gridTemplateColumns"
  });
  const gridTemplateRows = style$2({
    prop: "gridTemplateRows"
  });
  const gridTemplateAreas = style$2({
    prop: "gridTemplateAreas"
  });
  const gridArea = style$2({
    prop: "gridArea"
  });
  compose$1(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);
  function paletteTransform(value, userValue) {
    if (userValue === "grey") {
      return userValue;
    }
    return value;
  }
  const color = style$2({
    prop: "color",
    themeKey: "palette",
    transform: paletteTransform
  });
  const bgcolor = style$2({
    prop: "bgcolor",
    cssProperty: "backgroundColor",
    themeKey: "palette",
    transform: paletteTransform
  });
  const backgroundColor = style$2({
    prop: "backgroundColor",
    themeKey: "palette",
    transform: paletteTransform
  });
  compose$1(color, bgcolor, backgroundColor);
  function sizingTransform(value) {
    return value <= 1 && value !== 0 ? `${value * 100}%` : value;
  }
  const width = style$2({
    prop: "width",
    transform: sizingTransform
  });
  const maxWidth = (props) => {
    if (props.maxWidth !== void 0 && props.maxWidth !== null) {
      const styleFromPropValue = (propValue) => {
        var _a, _b, _c, _d, _e;
        const breakpoint = ((_c = (_b = (_a = props.theme) == null ? void 0 : _a.breakpoints) == null ? void 0 : _b.values) == null ? void 0 : _c[propValue]) || values$2[propValue];
        if (!breakpoint) {
          return {
            maxWidth: sizingTransform(propValue)
          };
        }
        if (((_e = (_d = props.theme) == null ? void 0 : _d.breakpoints) == null ? void 0 : _e.unit) !== "px") {
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
  const minWidth = style$2({
    prop: "minWidth",
    transform: sizingTransform
  });
  const height = style$2({
    prop: "height",
    transform: sizingTransform
  });
  const maxHeight = style$2({
    prop: "maxHeight",
    transform: sizingTransform
  });
  const minHeight = style$2({
    prop: "minHeight",
    transform: sizingTransform
  });
  style$2({
    prop: "size",
    cssProperty: "width",
    transform: sizingTransform
  });
  style$2({
    prop: "size",
    cssProperty: "height",
    transform: sizingTransform
  });
  const boxSizing = style$2({
    prop: "boxSizing"
  });
  compose$1(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
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
    font: {
      themeKey: "font"
    },
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
  function objectsHaveSameKeys(...objects) {
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object) => union.size === Object.keys(object).length);
  }
  function callIfFn(maybeFn, arg2) {
    return typeof maybeFn === "function" ? maybeFn(arg2) : maybeFn;
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
        let value = getStyleValue(themeMapping, transform, propValueFinal);
        if (propValueFinal === value && typeof propValueFinal === "string") {
          value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize(propValueFinal)}`, propValueFinal);
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
      const {
        sx,
        theme = {}
      } = props || {};
      if (!sx) {
        return null;
      }
      const config2 = theme.unstable_sxConfig ?? defaultSxConfig;
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
                css2 = merge(css2, getThemeValue(styleKey, value, theme, config2));
              } else {
                const breakpointsValues = handleBreakpoints({
                  theme
                }, value, (x) => ({
                  [styleKey]: x
                }));
                if (objectsHaveSameKeys(breakpointsValues, value)) {
                  css2[styleKey] = styleFunctionSx2({
                    sx: value,
                    theme
                  });
                } else {
                  css2 = merge(css2, breakpointsValues);
                }
              }
            } else {
              css2 = merge(css2, getThemeValue(styleKey, value, theme, config2));
            }
          }
        });
        return sortContainerQueries(theme, removeUnusedBreakpoints(breakpointsKeys, css2));
      }
      return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
    }
    return styleFunctionSx2;
  }
  const styleFunctionSx = unstable_createStyleFunctionSx();
  styleFunctionSx.filterProps = ["sx"];
  function applyStyles(key, styles2) {
    var _a;
    const theme = this;
    if (theme.vars) {
      if (!((_a = theme.colorSchemes) == null ? void 0 : _a[key]) || typeof theme.getColorSchemeSelector !== "function") {
        return {};
      }
      let selector = theme.getColorSchemeSelector(key);
      if (selector === "&") {
        return styles2;
      }
      if (selector.includes("data-") || selector.includes(".")) {
        selector = `*:where(${selector.replace(/\s*&$/, "")}) &`;
      }
      return {
        [selector]: styles2
      };
    }
    if (theme.palette.mode === key) {
      return styles2;
    }
    return {};
  }
  function createTheme$1(options = {}, ...args) {
    const {
      breakpoints: breakpointsInput = {},
      palette: paletteInput = {},
      spacing: spacingInput,
      shape: shapeInput = {},
      ...other
    } = options;
    const breakpoints = createBreakpoints(breakpointsInput);
    const spacing = createSpacing(spacingInput);
    let muiTheme = deepmerge({
      breakpoints,
      direction: "ltr",
      components: {},
      // Inject component definitions.
      palette: {
        mode: "light",
        ...paletteInput
      },
      spacing,
      shape: {
        ...shape,
        ...shapeInput
      }
    }, other);
    muiTheme = cssContainerQueries(muiTheme);
    muiTheme.applyStyles = applyStyles;
    muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = {
      ...defaultSxConfig,
      ...other == null ? void 0 : other.unstable_sxConfig
    };
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx({
        sx: props,
        theme: this
      });
    };
    return muiTheme;
  }
  function isObjectEmpty$1(obj) {
    return Object.keys(obj).length === 0;
  }
  function useTheme$2(defaultTheme2 = null) {
    const contextTheme = React__namespace.useContext(ThemeContext);
    return !contextTheme || isObjectEmpty$1(contextTheme) ? defaultTheme2 : contextTheme;
  }
  const systemDefaultTheme$1 = createTheme$1();
  function useTheme$1(defaultTheme2 = systemDefaultTheme$1) {
    return useTheme$2(defaultTheme2);
  }
  const splitProps = (props) => {
    var _a;
    const result = {
      systemProps: {},
      otherProps: {}
    };
    const config2 = ((_a = props == null ? void 0 : props.theme) == null ? void 0 : _a.unstable_sxConfig) ?? defaultSxConfig;
    Object.keys(props).forEach((prop) => {
      if (config2[prop]) {
        result.systemProps[prop] = props[prop];
      } else {
        result.otherProps[prop] = props[prop];
      }
    });
    return result;
  };
  function extendSxProp$1(props) {
    const {
      sx: inSx,
      ...other
    } = props;
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
        if (!isPlainObject$1(result)) {
          return systemProps;
        }
        return {
          ...systemProps,
          ...result
        };
      };
    } else {
      finalSx = {
        ...systemProps,
        ...inSx
      };
    }
    return {
      ...otherProps,
      sx: finalSx
    };
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
  function r$1(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2) n2 += e2;
    else if ("object" == typeof e2) if (Array.isArray(e2)) {
      var o = e2.length;
      for (t2 = 0; t2 < o; t2++) e2[t2] && (f2 = r$1(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
    } else for (f2 in e2) e2[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx() {
    for (var e2, t2, f2 = 0, n2 = "", o = arguments.length; f2 < o; f2++) (e2 = arguments[f2]) && (t2 = r$1(e2)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function createBox$1(options = {}) {
    const {
      themeId,
      defaultTheme: defaultTheme2,
      defaultClassName = "MuiBox-root",
      generateClassName
    } = options;
    const BoxRoot = styled$1("div", {
      shouldForwardProp: (prop) => prop !== "theme" && prop !== "sx" && prop !== "as"
    })(styleFunctionSx);
    const Box2 = /* @__PURE__ */ React__namespace.forwardRef(function Box3(inProps, ref) {
      const theme = useTheme$1(defaultTheme2);
      const {
        className,
        component = "div",
        ...other
      } = extendSxProp$1(inProps);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(BoxRoot, {
        as: component,
        ref,
        className: clsx(className, generateClassName ? generateClassName(defaultClassName) : defaultClassName),
        theme: themeId ? theme[themeId] || theme : theme,
        ...other
      });
    });
    return Box2;
  }
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
  function preprocessStyles(input) {
    const {
      variants,
      ...style2
    } = input;
    const result = {
      variants,
      style: internal_serializeStyles(style2),
      isProcessed: true
    };
    if (result.style === style2) {
      return result;
    }
    if (variants) {
      variants.forEach((variant) => {
        if (typeof variant.style !== "function") {
          variant.style = internal_serializeStyles(variant.style);
        }
      });
    }
    return result;
  }
  const systemDefaultTheme = createTheme$1();
  function shouldForwardProp(prop) {
    return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
  }
  function defaultOverridesResolver(slot) {
    if (!slot) {
      return null;
    }
    return (_props, styles2) => styles2[slot];
  }
  function attachTheme(props, themeId, defaultTheme2) {
    props.theme = isObjectEmpty(props.theme) ? defaultTheme2 : props.theme[themeId] || props.theme;
  }
  function processStyle(props, style2) {
    const resolvedStyle = typeof style2 === "function" ? style2(props) : style2;
    if (Array.isArray(resolvedStyle)) {
      return resolvedStyle.flatMap((subStyle) => processStyle(props, subStyle));
    }
    if (Array.isArray(resolvedStyle == null ? void 0 : resolvedStyle.variants)) {
      let rootStyle;
      if (resolvedStyle.isProcessed) {
        rootStyle = resolvedStyle.style;
      } else {
        const {
          variants,
          ...otherStyles
        } = resolvedStyle;
        rootStyle = otherStyles;
      }
      return processStyleVariants(props, resolvedStyle.variants, [rootStyle]);
    }
    if (resolvedStyle == null ? void 0 : resolvedStyle.isProcessed) {
      return resolvedStyle.style;
    }
    return resolvedStyle;
  }
  function processStyleVariants(props, variants, results = []) {
    var _a;
    let mergedState;
    variantLoop: for (let i = 0; i < variants.length; i += 1) {
      const variant = variants[i];
      if (typeof variant.props === "function") {
        mergedState ?? (mergedState = {
          ...props,
          ...props.ownerState,
          ownerState: props.ownerState
        });
        if (!variant.props(mergedState)) {
          continue;
        }
      } else {
        for (const key in variant.props) {
          if (props[key] !== variant.props[key] && ((_a = props.ownerState) == null ? void 0 : _a[key]) !== variant.props[key]) {
            continue variantLoop;
          }
        }
      }
      if (typeof variant.style === "function") {
        mergedState ?? (mergedState = {
          ...props,
          ...props.ownerState,
          ownerState: props.ownerState
        });
        results.push(variant.style(mergedState));
      } else {
        results.push(variant.style);
      }
    }
    return results;
  }
  function createStyled2(input = {}) {
    const {
      themeId,
      defaultTheme: defaultTheme2 = systemDefaultTheme,
      rootShouldForwardProp: rootShouldForwardProp2 = shouldForwardProp,
      slotShouldForwardProp: slotShouldForwardProp2 = shouldForwardProp
    } = input;
    function styleAttachTheme(props) {
      attachTheme(props, themeId, defaultTheme2);
    }
    const styled2 = (tag, inputOptions = {}) => {
      internal_mutateStyles(tag, (styles2) => styles2.filter((style2) => style2 !== styleFunctionSx));
      const {
        name: componentName,
        slot: componentSlot,
        skipVariantsResolver: inputSkipVariantsResolver,
        skipSx: inputSkipSx,
        // TODO v6: remove `lowercaseFirstLetter()` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        overridesResolver: overridesResolver2 = defaultOverridesResolver(lowercaseFirstLetter(componentSlot)),
        ...options
      } = inputOptions;
      const skipVariantsResolver = inputSkipVariantsResolver !== void 0 ? inputSkipVariantsResolver : (
        // TODO v6: remove `Root` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        componentSlot && componentSlot !== "Root" && componentSlot !== "root" || false
      );
      const skipSx = inputSkipSx || false;
      let shouldForwardPropOption = shouldForwardProp;
      if (componentSlot === "Root" || componentSlot === "root") {
        shouldForwardPropOption = rootShouldForwardProp2;
      } else if (componentSlot) {
        shouldForwardPropOption = slotShouldForwardProp2;
      } else if (isStringTag(tag)) {
        shouldForwardPropOption = void 0;
      }
      const defaultStyledResolver = styled$1(tag, {
        shouldForwardProp: shouldForwardPropOption,
        label: generateStyledLabel(),
        ...options
      });
      const transformStyle = (style2) => {
        if (typeof style2 === "function" && style2.__emotion_real !== style2) {
          return function styleFunctionProcessor(props) {
            return processStyle(props, style2);
          };
        }
        if (isPlainObject$1(style2)) {
          const serialized = preprocessStyles(style2);
          if (!serialized.variants) {
            return serialized.style;
          }
          return function styleObjectProcessor(props) {
            return processStyle(props, serialized);
          };
        }
        return style2;
      };
      const muiStyledResolver = (...expressionsInput) => {
        const expressionsHead = [];
        const expressionsBody = expressionsInput.map(transformStyle);
        const expressionsTail = [];
        expressionsHead.push(styleAttachTheme);
        if (componentName && overridesResolver2) {
          expressionsTail.push(function styleThemeOverrides(props) {
            var _a, _b;
            const theme = props.theme;
            const styleOverrides = (_b = (_a = theme.components) == null ? void 0 : _a[componentName]) == null ? void 0 : _b.styleOverrides;
            if (!styleOverrides) {
              return null;
            }
            const resolvedStyleOverrides = {};
            for (const slotKey in styleOverrides) {
              resolvedStyleOverrides[slotKey] = processStyle(props, styleOverrides[slotKey]);
            }
            return overridesResolver2(props, resolvedStyleOverrides);
          });
        }
        if (componentName && !skipVariantsResolver) {
          expressionsTail.push(function styleThemeVariants(props) {
            var _a, _b;
            const theme = props.theme;
            const themeVariants = (_b = (_a = theme == null ? void 0 : theme.components) == null ? void 0 : _a[componentName]) == null ? void 0 : _b.variants;
            if (!themeVariants) {
              return null;
            }
            return processStyleVariants(props, themeVariants);
          });
        }
        if (!skipSx) {
          expressionsTail.push(styleFunctionSx);
        }
        if (Array.isArray(expressionsBody[0])) {
          const inputStrings = expressionsBody.shift();
          const placeholdersHead = new Array(expressionsHead.length).fill("");
          const placeholdersTail = new Array(expressionsTail.length).fill("");
          let outputStrings;
          {
            outputStrings = [...placeholdersHead, ...inputStrings, ...placeholdersTail];
            outputStrings.raw = [...placeholdersHead, ...inputStrings.raw, ...placeholdersTail];
          }
          expressionsHead.unshift(outputStrings);
        }
        const expressions = [...expressionsHead, ...expressionsBody, ...expressionsTail];
        const Component = defaultStyledResolver(...expressions);
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
    return styled2;
  }
  function generateStyledLabel(componentName, componentSlot) {
    let label;
    return label;
  }
  function isObjectEmpty(object) {
    for (const _2 in object) {
      return false;
    }
    return true;
  }
  function isStringTag(tag) {
    return typeof tag === "string" && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96;
  }
  function lowercaseFirstLetter(string) {
    if (!string) {
      return string;
    }
    return string.charAt(0).toLowerCase() + string.slice(1);
  }
  function resolveProps(defaultProps2, props) {
    const output = {
      ...props
    };
    for (const key in defaultProps2) {
      if (Object.prototype.hasOwnProperty.call(defaultProps2, key)) {
        const propName = key;
        if (propName === "components" || propName === "slots") {
          output[propName] = {
            ...defaultProps2[propName],
            ...output[propName]
          };
        } else if (propName === "componentsProps" || propName === "slotProps") {
          const defaultSlotProps = defaultProps2[propName];
          const slotProps = props[propName];
          if (!slotProps) {
            output[propName] = defaultSlotProps || {};
          } else if (!defaultSlotProps) {
            output[propName] = slotProps;
          } else {
            output[propName] = {
              ...slotProps
            };
            for (const slotKey in defaultSlotProps) {
              if (Object.prototype.hasOwnProperty.call(defaultSlotProps, slotKey)) {
                const slotPropName = slotKey;
                output[propName][slotPropName] = resolveProps(defaultSlotProps[slotPropName], slotProps[slotPropName]);
              }
            }
          }
        } else if (output[propName] === void 0) {
          output[propName] = defaultProps2[propName];
        }
      }
    }
    return output;
  }
  const useEnhancedEffect = typeof window !== "undefined" ? React__namespace.useLayoutEffect : React__namespace.useEffect;
  function clamp(val, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    return Math.max(min, Math.min(val, max));
  }
  function clampWrapper(value, min = 0, max = 1) {
    return clamp(value, min, max);
  }
  function hexToRgb(color2) {
    color2 = color2.slice(1);
    const re = new RegExp(`.{1,${color2.length >= 6 ? 2 : 1}}`, "g");
    let colors = color2.match(re);
    if (colors && colors[0].length === 1) {
      colors = colors.map((n2) => n2 + n2);
    }
    return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n2, index2) => {
    return index2 < 3 ? parseInt(n2, 16) : Math.round(parseInt(n2, 16) / 255 * 1e3) / 1e3;
  }).join(", ")})` : "";
  }
  function decomposeColor(color2) {
    if (color2.type) {
      return color2;
    }
    if (color2.charAt(0) === "#") {
      return decomposeColor(hexToRgb(color2));
    }
    const marker = color2.indexOf("(");
    const type = color2.substring(0, marker);
    if (!["rgb", "rgba", "hsl", "hsla", "color"].includes(type)) {
      throw new Error(formatMuiErrorMessage(9, color2));
    }
    let values2 = color2.substring(marker + 1, color2.length - 1);
    let colorSpace;
    if (type === "color") {
      values2 = values2.split(" ");
      colorSpace = values2.shift();
      if (values2.length === 4 && values2[3].charAt(0) === "/") {
        values2[3] = values2[3].slice(1);
      }
      if (!["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].includes(colorSpace)) {
        throw new Error(formatMuiErrorMessage(10, colorSpace));
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
    const decomposedColor = decomposeColor(color2);
    return decomposedColor.values.slice(0, 3).map((val, idx) => decomposedColor.type.includes("hsl") && idx !== 0 ? `${val}%` : val).join(" ");
  };
  const private_safeColorChannel = (color2, warning) => {
    try {
      return colorChannel(color2);
    } catch (error) {
      return color2;
    }
  };
  function recomposeColor(color2) {
    const {
      type,
      colorSpace
    } = color2;
    let {
      values: values2
    } = color2;
    if (type.includes("rgb")) {
      values2 = values2.map((n2, i) => i < 3 ? parseInt(n2, 10) : n2);
    } else if (type.includes("hsl")) {
      values2[1] = `${values2[1]}%`;
      values2[2] = `${values2[2]}%`;
    }
    if (type.includes("color")) {
      values2 = `${colorSpace} ${values2.join(" ")}`;
    } else {
      values2 = `${values2.join(", ")}`;
    }
    return `${type}(${values2})`;
  }
  function hslToRgb(color2) {
    color2 = decomposeColor(color2);
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
    return recomposeColor({
      type,
      values: rgb
    });
  }
  function getLuminance(color2) {
    color2 = decomposeColor(color2);
    let rgb = color2.type === "hsl" || color2.type === "hsla" ? decomposeColor(hslToRgb(color2)).values : color2.values;
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
  function private_safeAlpha(color2, value, warning) {
    try {
      return alpha(color2, value);
    } catch (error) {
      return color2;
    }
  }
  function darken(color2, coefficient) {
    color2 = decomposeColor(color2);
    coefficient = clampWrapper(coefficient);
    if (color2.type.includes("hsl")) {
      color2.values[2] *= 1 - coefficient;
    } else if (color2.type.includes("rgb") || color2.type.includes("color")) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] *= 1 - coefficient;
      }
    }
    return recomposeColor(color2);
  }
  function private_safeDarken(color2, coefficient, warning) {
    try {
      return darken(color2, coefficient);
    } catch (error) {
      return color2;
    }
  }
  function lighten(color2, coefficient) {
    color2 = decomposeColor(color2);
    coefficient = clampWrapper(coefficient);
    if (color2.type.includes("hsl")) {
      color2.values[2] += (100 - color2.values[2]) * coefficient;
    } else if (color2.type.includes("rgb")) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] += (255 - color2.values[i]) * coefficient;
      }
    } else if (color2.type.includes("color")) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] += (1 - color2.values[i]) * coefficient;
      }
    }
    return recomposeColor(color2);
  }
  function private_safeLighten(color2, coefficient, warning) {
    try {
      return lighten(color2, coefficient);
    } catch (error) {
      return color2;
    }
  }
  function emphasize(color2, coefficient = 0.15) {
    return getLuminance(color2) > 0.5 ? darken(color2, coefficient) : lighten(color2, coefficient);
  }
  function private_safeEmphasize(color2, coefficient, warning) {
    try {
      return emphasize(color2, coefficient);
    } catch (error) {
      return color2;
    }
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
  function isMuiElement(element, muiNames) {
    var _a, _b, _c;
    return /* @__PURE__ */ React__namespace.isValidElement(element) && muiNames.indexOf(
      // For server components `muiName` is avaialble in element.type._payload.value.muiName
      // relevant info - https://github.com/facebook/react/blob/2807d781a08db8e9873687fccc25c0f12b4fb3d4/packages/react/src/ReactLazy.js#L45
      // eslint-disable-next-line no-underscore-dangle
      element.type.muiName ?? ((_c = (_b = (_a = element.type) == null ? void 0 : _a._payload) == null ? void 0 : _b.value) == null ? void 0 : _c.muiName)
    ) !== -1;
  }
  function ownerDocument(node2) {
    return node2 && node2.ownerDocument || document;
  }
  function ownerWindow(node2) {
    const doc = ownerDocument(node2);
    return doc.defaultView || window;
  }
  function setRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  }
  let globalId = 0;
  function useGlobalId(idOverride) {
    const [defaultId, setDefaultId] = React__namespace.useState(idOverride);
    const id = idOverride || defaultId;
    React__namespace.useEffect(() => {
      if (defaultId == null) {
        globalId += 1;
        setDefaultId(`mui-${globalId}`);
      }
    }, [defaultId]);
    return id;
  }
  const safeReact = {
    ...React__namespace
  };
  const maybeReactUseId = safeReact.useId;
  function useId(idOverride) {
    if (maybeReactUseId !== void 0) {
      const reactId = maybeReactUseId();
      return idOverride ?? reactId;
    }
    return useGlobalId(idOverride);
  }
  function useControlled({
    controlled,
    default: defaultProp,
    name,
    state = "value"
  }) {
    const {
      current: isControlled
    } = React__namespace.useRef(controlled !== void 0);
    const [valueState, setValue] = React__namespace.useState(defaultProp);
    const value = isControlled ? controlled : valueState;
    const setValueIfUncontrolled = React__namespace.useCallback((newValue) => {
      if (!isControlled) {
        setValue(newValue);
      }
    }, []);
    return [value, setValueIfUncontrolled];
  }
  function useEventCallback(fn) {
    const ref = React__namespace.useRef(fn);
    useEnhancedEffect(() => {
      ref.current = fn;
    });
    return React__namespace.useRef((...args) => (
      // @ts-expect-error hide `this`
      (0, ref.current)(...args)
    )).current;
  }
  function useForkRef(...refs) {
    return React__namespace.useMemo(() => {
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
  const UNINITIALIZED = {};
  function useLazyRef(init, initArg) {
    const ref = React__namespace.useRef(UNINITIALIZED);
    if (ref.current === UNINITIALIZED) {
      ref.current = init(initArg);
    }
    return ref;
  }
  const EMPTY = [];
  function useOnMount(fn) {
    React__namespace.useEffect(fn, EMPTY);
  }
  class Timeout {
    constructor() {
      __publicField(this, "currentId", null);
      __publicField(this, "clear", () => {
        if (this.currentId !== null) {
          clearTimeout(this.currentId);
          this.currentId = null;
        }
      });
      __publicField(this, "disposeEffect", () => {
        return this.clear;
      });
    }
    static create() {
      return new Timeout();
    }
    /**
     * Executes `fn` after `delay`, clearing any previously scheduled call.
     */
    start(delay, fn) {
      this.clear();
      this.currentId = setTimeout(() => {
        this.currentId = null;
        fn();
      }, delay);
    }
  }
  function useTimeout() {
    const timeout = useLazyRef(Timeout.create).current;
    useOnMount(timeout.disposeEffect);
    return timeout;
  }
  function isFocusVisible(element) {
    try {
      return element.matches(":focus-visible");
    } catch (error) {
    }
    return false;
  }
  function getScrollbarSize(win = window) {
    const documentWidth = win.document.documentElement.clientWidth;
    return win.innerWidth - documentWidth;
  }
  function composeClasses(slots, getUtilityClass, classes = void 0) {
    const output = {};
    for (const slotName in slots) {
      const slot = slots[slotName];
      let buffer = "";
      let start = true;
      for (let i = 0; i < slot.length; i += 1) {
        const value = slot[i];
        if (value) {
          buffer += (start === true ? "" : " ") + getUtilityClass(value);
          start = false;
          if (classes && classes[value]) {
            buffer += " " + classes[value];
          }
        }
      }
      output[slotName] = buffer;
    }
    return output;
  }
  function isHostComponent$1(element) {
    return typeof element === "string";
  }
  function appendOwnerState(elementType, otherProps, ownerState) {
    if (elementType === void 0 || isHostComponent$1(elementType)) {
      return otherProps;
    }
    return {
      ...otherProps,
      ownerState: {
        ...otherProps.ownerState,
        ...ownerState
      }
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
      const mergedStyle2 = {
        ...additionalProps == null ? void 0 : additionalProps.style,
        ...externalForwardedProps == null ? void 0 : externalForwardedProps.style,
        ...externalSlotProps == null ? void 0 : externalSlotProps.style
      };
      const props2 = {
        ...additionalProps,
        ...externalForwardedProps,
        ...externalSlotProps
      };
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
    const eventHandlers = extractEventHandlers({
      ...externalForwardedProps,
      ...externalSlotProps
    });
    const componentsPropsWithoutEventHandlers = omitEventHandlers(externalSlotProps);
    const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps);
    const internalSlotProps = getSlotProps(eventHandlers);
    const joinedClasses = clsx(internalSlotProps == null ? void 0 : internalSlotProps.className, additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
    const mergedStyle = {
      ...internalSlotProps == null ? void 0 : internalSlotProps.style,
      ...additionalProps == null ? void 0 : additionalProps.style,
      ...externalForwardedProps == null ? void 0 : externalForwardedProps.style,
      ...externalSlotProps == null ? void 0 : externalSlotProps.style
    };
    const props = {
      ...internalSlotProps,
      ...additionalProps,
      ...otherPropsWithoutEventHandlers,
      ...componentsPropsWithoutEventHandlers
    };
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
  function resolveComponentProps(componentProps, ownerState, slotState) {
    if (typeof componentProps === "function") {
      return componentProps(ownerState, slotState);
    }
    return componentProps;
  }
  function getReactElementRef(element) {
    var _a;
    if (parseInt(React__namespace.version, 10) >= 19) {
      return ((_a = element == null ? void 0 : element.props) == null ? void 0 : _a.ref) || null;
    }
    return (element == null ? void 0 : element.ref) || null;
  }
  const PropsContext = /* @__PURE__ */ React__namespace.createContext(void 0);
  function getThemeProps(params) {
    const {
      theme,
      name,
      props
    } = params;
    if (!theme || !theme.components || !theme.components[name]) {
      return props;
    }
    const config2 = theme.components[name];
    if (config2.defaultProps) {
      return resolveProps(config2.defaultProps, props);
    }
    if (!config2.styleOverrides && !config2.variants) {
      return resolveProps(config2, props);
    }
    return props;
  }
  function useDefaultProps$1({
    props,
    name
  }) {
    const ctx = React__namespace.useContext(PropsContext);
    return getThemeProps({
      props,
      name,
      theme: {
        components: ctx
      }
    });
  }
  const arg = {
    theme: void 0
  };
  function unstable_memoTheme(styleFn) {
    let lastValue;
    let lastTheme;
    return function styleMemoized(props) {
      let value = lastValue;
      if (value === void 0 || props.theme !== lastTheme) {
        arg.theme = props.theme;
        value = preprocessStyles(styleFn(arg));
        lastValue = value;
        lastTheme = props.theme;
      }
      return value;
    };
  }
  function createGetCssVar$1(prefix2 = "") {
    function appendVar(...vars) {
      if (!vars.length) {
        return "";
      }
      const value = vars[0];
      if (typeof value === "string" && !value.match(/(#|\(|\)|(-?(\d*\.)?\d+)(px|em|%|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc))|^(-?(\d*\.)?\d+)$|(\d+ \d+ \d+)/)) {
        return `, var(--${prefix2 ? `${prefix2}-` : ""}${value}${appendVar(...vars.slice(1))})`;
      }
      return `, ${value}`;
    }
    const getCssVar = (field, ...fallbacks) => {
      return `var(--${prefix2 ? `${prefix2}-` : ""}${field}${appendVar(...fallbacks)})`;
    };
    return getCssVar;
  }
  const assignNestedKeys = (obj, keys, value, arrayKeys = []) => {
    let temp = obj;
    keys.forEach((k2, index2) => {
      if (index2 === keys.length - 1) {
        if (Array.isArray(temp)) {
          temp[Number(k2)] = value;
        } else if (temp && typeof temp === "object") {
          temp[k2] = value;
        }
      } else if (temp && typeof temp === "object") {
        if (!temp[k2]) {
          temp[k2] = arrayKeys.includes(k2) ? [] : {};
        }
        temp = temp[k2];
      }
    });
  };
  const walkObjectDeep = (obj, callback, shouldSkipPaths) => {
    function recurse(object, parentKeys = [], arrayKeys = []) {
      Object.entries(object).forEach(([key, value]) => {
        if (!shouldSkipPaths || !shouldSkipPaths([...parentKeys, key])) {
          if (value !== void 0 && value !== null) {
            if (typeof value === "object" && Object.keys(value).length > 0) {
              recurse(value, [...parentKeys, key], Array.isArray(value) ? [...arrayKeys, key] : arrayKeys);
            } else {
              callback([...parentKeys, key], value, arrayKeys);
            }
          }
        }
      });
    }
    recurse(obj);
  };
  const getCssValue = (keys, value) => {
    if (typeof value === "number") {
      if (["lineHeight", "fontWeight", "opacity", "zIndex"].some((prop) => keys.includes(prop))) {
        return value;
      }
      const lastKey = keys[keys.length - 1];
      if (lastKey.toLowerCase().includes("opacity")) {
        return value;
      }
      return `${value}px`;
    }
    return value;
  };
  function cssVarsParser(theme, options) {
    const {
      prefix: prefix2,
      shouldSkipGeneratingVar: shouldSkipGeneratingVar2
    } = options || {};
    const css2 = {};
    const vars = {};
    const varsWithDefaults = {};
    walkObjectDeep(
      theme,
      (keys, value, arrayKeys) => {
        if (typeof value === "string" || typeof value === "number") {
          if (!shouldSkipGeneratingVar2 || !shouldSkipGeneratingVar2(keys, value)) {
            const cssVar = `--${prefix2 ? `${prefix2}-` : ""}${keys.join("-")}`;
            const resolvedValue = getCssValue(keys, value);
            Object.assign(css2, {
              [cssVar]: resolvedValue
            });
            assignNestedKeys(vars, keys, `var(${cssVar})`, arrayKeys);
            assignNestedKeys(varsWithDefaults, keys, `var(${cssVar}, ${resolvedValue})`, arrayKeys);
          }
        }
      },
      (keys) => keys[0] === "vars"
      // skip 'vars/*' paths
    );
    return {
      css: css2,
      vars,
      varsWithDefaults
    };
  }
  function prepareCssVars(theme, parserConfig = {}) {
    const {
      getSelector: getSelector2 = defaultGetSelector2,
      disableCssColorScheme,
      colorSchemeSelector: selector
    } = parserConfig;
    const {
      colorSchemes = {},
      components,
      defaultColorScheme = "light",
      ...otherTheme
    } = theme;
    const {
      vars: rootVars,
      css: rootCss,
      varsWithDefaults: rootVarsWithDefaults
    } = cssVarsParser(otherTheme, parserConfig);
    let themeVars = rootVarsWithDefaults;
    const colorSchemesMap = {};
    const {
      [defaultColorScheme]: defaultScheme,
      ...otherColorSchemes
    } = colorSchemes;
    Object.entries(otherColorSchemes || {}).forEach(([key, scheme]) => {
      const {
        vars,
        css: css2,
        varsWithDefaults
      } = cssVarsParser(scheme, parserConfig);
      themeVars = deepmerge(themeVars, varsWithDefaults);
      colorSchemesMap[key] = {
        css: css2,
        vars
      };
    });
    if (defaultScheme) {
      const {
        css: css2,
        vars,
        varsWithDefaults
      } = cssVarsParser(defaultScheme, parserConfig);
      themeVars = deepmerge(themeVars, varsWithDefaults);
      colorSchemesMap[defaultColorScheme] = {
        css: css2,
        vars
      };
    }
    function defaultGetSelector2(colorScheme, cssObject) {
      var _a, _b;
      let rule = selector;
      if (selector === "class") {
        rule = ".%s";
      }
      if (selector === "data") {
        rule = "[data-%s]";
      }
      if ((selector == null ? void 0 : selector.startsWith("data-")) && !selector.includes("%s")) {
        rule = `[${selector}="%s"]`;
      }
      if (colorScheme) {
        if (rule === "media") {
          if (theme.defaultColorScheme === colorScheme) {
            return ":root";
          }
          const mode = ((_b = (_a = colorSchemes[colorScheme]) == null ? void 0 : _a.palette) == null ? void 0 : _b.mode) || colorScheme;
          return {
            [`@media (prefers-color-scheme: ${mode})`]: {
              ":root": cssObject
            }
          };
        }
        if (rule) {
          if (theme.defaultColorScheme === colorScheme) {
            return `:root, ${rule.replace("%s", String(colorScheme))}`;
          }
          return rule.replace("%s", String(colorScheme));
        }
      }
      return ":root";
    }
    const generateThemeVars = () => {
      let vars = {
        ...rootVars
      };
      Object.entries(colorSchemesMap).forEach(([, {
        vars: schemeVars
      }]) => {
        vars = deepmerge(vars, schemeVars);
      });
      return vars;
    };
    const generateStyleSheets = () => {
      var _a, _b;
      const stylesheets = [];
      const colorScheme = theme.defaultColorScheme || "light";
      function insertStyleSheet(key, css2) {
        if (Object.keys(css2).length) {
          stylesheets.push(typeof key === "string" ? {
            [key]: {
              ...css2
            }
          } : key);
        }
      }
      insertStyleSheet(getSelector2(void 0, {
        ...rootCss
      }), rootCss);
      const {
        [colorScheme]: defaultSchemeVal,
        ...other
      } = colorSchemesMap;
      if (defaultSchemeVal) {
        const {
          css: css2
        } = defaultSchemeVal;
        const cssColorSheme = (_b = (_a = colorSchemes[colorScheme]) == null ? void 0 : _a.palette) == null ? void 0 : _b.mode;
        const finalCss = !disableCssColorScheme && cssColorSheme ? {
          colorScheme: cssColorSheme,
          ...css2
        } : {
          ...css2
        };
        insertStyleSheet(getSelector2(colorScheme, {
          ...finalCss
        }), finalCss);
      }
      Object.entries(other).forEach(([key, {
        css: css2
      }]) => {
        var _a2, _b2;
        const cssColorSheme = (_b2 = (_a2 = colorSchemes[key]) == null ? void 0 : _a2.palette) == null ? void 0 : _b2.mode;
        const finalCss = !disableCssColorScheme && cssColorSheme ? {
          colorScheme: cssColorSheme,
          ...css2
        } : {
          ...css2
        };
        insertStyleSheet(getSelector2(key, {
          ...finalCss
        }), finalCss);
      });
      return stylesheets;
    };
    return {
      vars: themeVars,
      generateThemeVars,
      generateStyleSheets
    };
  }
  function createGetColorSchemeSelector(selector) {
    return function getColorSchemeSelector(colorScheme) {
      if (selector === "media") {
        return `@media (prefers-color-scheme: ${colorScheme})`;
      }
      if (selector) {
        if (selector.startsWith("data-") && !selector.includes("%s")) {
          return `[${selector}="${colorScheme}"] &`;
        }
        if (selector === "class") {
          return `.${colorScheme} &`;
        }
        if (selector === "data") {
          return `[data-${colorScheme}] &`;
        }
        return `${selector.replace("%s", colorScheme)} &`;
      }
      return "&";
    };
  }
  function getLight() {
    return {
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
        paper: common.white,
        default: common.white
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
  }
  const light = getLight();
  function getDark() {
    return {
      text: {
        primary: common.white,
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
        active: common.white,
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
  }
  const dark = getDark();
  function addLightOrDark(intent, direction, shade, tonalOffset) {
    const tonalOffsetLight = tonalOffset.light || tonalOffset;
    const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
    if (!intent[direction]) {
      if (intent.hasOwnProperty(shade)) {
        intent[direction] = intent[shade];
      } else if (direction === "light") {
        intent.light = lighten(intent.main, tonalOffsetLight);
      } else if (direction === "dark") {
        intent.dark = darken(intent.main, tonalOffsetDark);
      }
    }
  }
  function getDefaultPrimary(mode = "light") {
    if (mode === "dark") {
      return {
        main: blue[200],
        light: blue[50],
        dark: blue[400]
      };
    }
    return {
      main: blue[700],
      light: blue[400],
      dark: blue[800]
    };
  }
  function getDefaultSecondary(mode = "light") {
    if (mode === "dark") {
      return {
        main: purple[200],
        light: purple[50],
        dark: purple[400]
      };
    }
    return {
      main: purple[500],
      light: purple[300],
      dark: purple[700]
    };
  }
  function getDefaultError(mode = "light") {
    if (mode === "dark") {
      return {
        main: red[500],
        light: red[300],
        dark: red[700]
      };
    }
    return {
      main: red[700],
      light: red[400],
      dark: red[800]
    };
  }
  function getDefaultInfo(mode = "light") {
    if (mode === "dark") {
      return {
        main: lightBlue[400],
        light: lightBlue[300],
        dark: lightBlue[700]
      };
    }
    return {
      main: lightBlue[700],
      light: lightBlue[500],
      dark: lightBlue[900]
    };
  }
  function getDefaultSuccess(mode = "light") {
    if (mode === "dark") {
      return {
        main: green[400],
        light: green[300],
        dark: green[700]
      };
    }
    return {
      main: green[800],
      light: green[500],
      dark: green[900]
    };
  }
  function getDefaultWarning(mode = "light") {
    if (mode === "dark") {
      return {
        main: orange[400],
        light: orange[300],
        dark: orange[700]
      };
    }
    return {
      main: "#ed6c02",
      // closest to orange[800] that pass 3:1.
      light: orange[500],
      dark: orange[900]
    };
  }
  function createPalette(palette) {
    const {
      mode = "light",
      contrastThreshold = 3,
      tonalOffset = 0.2,
      ...other
    } = palette;
    const primary = palette.primary || getDefaultPrimary(mode);
    const secondary = palette.secondary || getDefaultSecondary(mode);
    const error = palette.error || getDefaultError(mode);
    const info = palette.info || getDefaultInfo(mode);
    const success = palette.success || getDefaultSuccess(mode);
    const warning = palette.warning || getDefaultWarning(mode);
    function getContrastText(background) {
      const contrastText = getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
      return contrastText;
    }
    const augmentColor = ({
      color: color2,
      name,
      mainShade = 500,
      lightShade = 300,
      darkShade = 700
    }) => {
      color2 = {
        ...color2
      };
      if (!color2.main && color2[mainShade]) {
        color2.main = color2[mainShade];
      }
      if (!color2.hasOwnProperty("main")) {
        throw new Error(formatMuiErrorMessage(11, name ? ` (${name})` : "", mainShade));
      }
      if (typeof color2.main !== "string") {
        throw new Error(formatMuiErrorMessage(12, name ? ` (${name})` : "", JSON.stringify(color2.main)));
      }
      addLightOrDark(color2, "light", lightShade, tonalOffset);
      addLightOrDark(color2, "dark", darkShade, tonalOffset);
      if (!color2.contrastText) {
        color2.contrastText = getContrastText(color2.main);
      }
      return color2;
    };
    let modeHydrated;
    if (mode === "light") {
      modeHydrated = getLight();
    } else if (mode === "dark") {
      modeHydrated = getDark();
    }
    const paletteOutput = deepmerge({
      // A collection of common colors.
      common: {
        ...common
      },
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
      grey,
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
      tonalOffset,
      // The light and dark mode object.
      ...modeHydrated
    }, other);
    return paletteOutput;
  }
  function prepareTypographyVars(typography) {
    const vars = {};
    const entries = Object.entries(typography);
    entries.forEach((entry) => {
      const [key, value] = entry;
      if (typeof value === "object") {
        vars[key] = `${value.fontStyle ? `${value.fontStyle} ` : ""}${value.fontVariant ? `${value.fontVariant} ` : ""}${value.fontWeight ? `${value.fontWeight} ` : ""}${value.fontStretch ? `${value.fontStretch} ` : ""}${value.fontSize || ""}${value.lineHeight ? `/${value.lineHeight} ` : ""}${value.fontFamily || ""}`;
      }
    });
    return vars;
  }
  function createMixins(breakpoints, mixins) {
    return {
      toolbar: {
        minHeight: 56,
        [breakpoints.up("xs")]: {
          "@media (orientation: landscape)": {
            minHeight: 48
          }
        },
        [breakpoints.up("sm")]: {
          minHeight: 64
        }
      },
      ...mixins
    };
  }
  function round(value) {
    return Math.round(value * 1e5) / 1e5;
  }
  const caseAllCaps = {
    textTransform: "uppercase"
  };
  const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
  function createTypography(palette, typography) {
    const {
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
      pxToRem: pxToRem2,
      ...other
    } = typeof typography === "function" ? typography(palette) : typography;
    const coef = fontSize / 14;
    const pxToRem = pxToRem2 || ((size) => `${size / htmlFontSize * coef}rem`);
    const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => ({
      fontFamily,
      fontWeight,
      fontSize: pxToRem(size),
      // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
      lineHeight,
      // The letter spacing was designed for the Roboto font-family. Using the same letter-spacing
      // across font-families can cause issues with the kerning.
      ...fontFamily === defaultFontFamily ? {
        letterSpacing: `${round(letterSpacing / size)}em`
      } : {},
      ...casing,
      ...allVariants
    });
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
    return deepmerge({
      htmlFontSize,
      pxToRem,
      fontFamily,
      fontSize,
      fontWeightLight,
      fontWeightRegular,
      fontWeightMedium,
      fontWeightBold,
      ...variants
    }, other, {
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
    const constant = height2 / 36;
    return Math.min(Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10), 3e3);
  }
  function createTransitions(inputTransitions) {
    const mergedEasing = {
      ...easing,
      ...inputTransitions.easing
    };
    const mergedDuration = {
      ...duration,
      ...inputTransitions.duration
    };
    const create2 = (props = ["all"], options = {}) => {
      const {
        duration: durationOption = mergedDuration.standard,
        easing: easingOption = mergedEasing.easeInOut,
        delay = 0,
        ...other
      } = options;
      return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
    };
    return {
      getAutoHeightDuration,
      create: create2,
      ...inputTransitions,
      easing: mergedEasing,
      duration: mergedDuration
    };
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
  function isSerializable(val) {
    return isPlainObject$1(val) || typeof val === "undefined" || typeof val === "string" || typeof val === "boolean" || typeof val === "number" || Array.isArray(val);
  }
  function stringifyTheme(baseTheme = {}) {
    const serializableTheme = {
      ...baseTheme
    };
    function serializeTheme(object) {
      const array = Object.entries(object);
      for (let index2 = 0; index2 < array.length; index2++) {
        const [key, value] = array[index2];
        if (!isSerializable(value) || key.startsWith("unstable_")) {
          delete object[key];
        } else if (isPlainObject$1(value)) {
          object[key] = {
            ...value
          };
          serializeTheme(object[key]);
        }
      }
    }
    serializeTheme(serializableTheme);
    return `import { unstable_createBreakpoints as createBreakpoints, createTransitions } from '@mui/material/styles';

const theme = ${JSON.stringify(serializableTheme, null, 2)};

theme.breakpoints = createBreakpoints(theme.breakpoints || {});
theme.transitions = createTransitions(theme.transitions || {});

export default theme;`;
  }
  function createThemeNoVars(options = {}, ...args) {
    const {
      breakpoints: breakpointsInput,
      mixins: mixinsInput = {},
      spacing: spacingInput,
      palette: paletteInput = {},
      transitions: transitionsInput = {},
      typography: typographyInput = {},
      shape: shapeInput,
      ...other
    } = options;
    if (options.vars) {
      throw new Error(formatMuiErrorMessage(20));
    }
    const palette = createPalette(paletteInput);
    const systemTheme = createTheme$1(options);
    let muiTheme = deepmerge(systemTheme, {
      mixins: createMixins(systemTheme.breakpoints, mixinsInput),
      palette,
      // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
      shadows: shadows.slice(),
      typography: createTypography(palette, typographyInput),
      transitions: createTransitions(transitionsInput),
      zIndex: {
        ...zIndex
      }
    });
    muiTheme = deepmerge(muiTheme, other);
    muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = {
      ...defaultSxConfig,
      ...other == null ? void 0 : other.unstable_sxConfig
    };
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx({
        sx: props,
        theme: this
      });
    };
    muiTheme.toRuntimeSource = stringifyTheme;
    return muiTheme;
  }
  function getOverlayAlpha(elevation) {
    let alphaValue;
    if (elevation < 1) {
      alphaValue = 5.11916 * elevation ** 2;
    } else {
      alphaValue = 4.5 * Math.log(elevation + 1) + 2;
    }
    return Math.round(alphaValue * 10) / 1e3;
  }
  const defaultDarkOverlays = [...Array(25)].map((_2, index2) => {
    if (index2 === 0) {
      return "none";
    }
    const overlay = getOverlayAlpha(index2);
    return `linear-gradient(rgba(255 255 255 / ${overlay}), rgba(255 255 255 / ${overlay}))`;
  });
  function getOpacity(mode) {
    return {
      inputPlaceholder: mode === "dark" ? 0.5 : 0.42,
      inputUnderline: mode === "dark" ? 0.7 : 0.42,
      switchTrackDisabled: mode === "dark" ? 0.2 : 0.12,
      switchTrack: mode === "dark" ? 0.3 : 0.38
    };
  }
  function getOverlays(mode) {
    return mode === "dark" ? defaultDarkOverlays : [];
  }
  function createColorScheme(options) {
    const {
      palette: paletteInput = {
        mode: "light"
      },
      // need to cast to avoid module augmentation test
      opacity,
      overlays,
      ...rest
    } = options;
    const palette = createPalette(paletteInput);
    return {
      palette,
      opacity: {
        ...getOpacity(palette.mode),
        ...opacity
      },
      overlays: overlays || getOverlays(palette.mode),
      ...rest
    };
  }
  function shouldSkipGeneratingVar(keys) {
    var _a;
    return !!keys[0].match(/(cssVarPrefix|colorSchemeSelector|rootSelector|typography|mixins|breakpoints|direction|transitions)/) || !!keys[0].match(/sxConfig$/) || // ends with sxConfig
    keys[0] === "palette" && !!((_a = keys[1]) == null ? void 0 : _a.match(/(mode|contrastThreshold|tonalOffset)/));
  }
  const excludeVariablesFromRoot = (cssVarPrefix) => [...[...Array(25)].map((_2, index2) => `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}overlays-${index2}`), `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkBg`, `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkColor`];
  const defaultGetSelector = (theme) => (colorScheme, css2) => {
    const root = theme.rootSelector || ":root";
    const selector = theme.colorSchemeSelector;
    let rule = selector;
    if (selector === "class") {
      rule = ".%s";
    }
    if (selector === "data") {
      rule = "[data-%s]";
    }
    if ((selector == null ? void 0 : selector.startsWith("data-")) && !selector.includes("%s")) {
      rule = `[${selector}="%s"]`;
    }
    if (theme.defaultColorScheme === colorScheme) {
      if (colorScheme === "dark") {
        const excludedVariables = {};
        excludeVariablesFromRoot(theme.cssVarPrefix).forEach((cssVar) => {
          excludedVariables[cssVar] = css2[cssVar];
          delete css2[cssVar];
        });
        if (rule === "media") {
          return {
            [root]: css2,
            [`@media (prefers-color-scheme: dark)`]: {
              [root]: excludedVariables
            }
          };
        }
        if (rule) {
          return {
            [rule.replace("%s", colorScheme)]: excludedVariables,
            [`${root}, ${rule.replace("%s", colorScheme)}`]: css2
          };
        }
        return {
          [root]: {
            ...css2,
            ...excludedVariables
          }
        };
      }
      if (rule && rule !== "media") {
        return `${root}, ${rule.replace("%s", String(colorScheme))}`;
      }
    } else if (colorScheme) {
      if (rule === "media") {
        return {
          [`@media (prefers-color-scheme: ${String(colorScheme)})`]: {
            [root]: css2
          }
        };
      }
      if (rule) {
        return rule.replace("%s", String(colorScheme));
      }
    }
    return root;
  };
  function assignNode(obj, keys) {
    keys.forEach((k2) => {
      if (!obj[k2]) {
        obj[k2] = {};
      }
    });
  }
  function setColor(obj, key, defaultValue) {
    if (!obj[key] && defaultValue) {
      obj[key] = defaultValue;
    }
  }
  function toRgb(color2) {
    if (typeof color2 !== "string" || !color2.startsWith("hsl")) {
      return color2;
    }
    return hslToRgb(color2);
  }
  function setColorChannel(obj, key) {
    if (!(`${key}Channel` in obj)) {
      obj[`${key}Channel`] = private_safeColorChannel(toRgb(obj[key]));
    }
  }
  function getSpacingVal(spacingInput) {
    if (typeof spacingInput === "number") {
      return `${spacingInput}px`;
    }
    if (typeof spacingInput === "string" || typeof spacingInput === "function" || Array.isArray(spacingInput)) {
      return spacingInput;
    }
    return "8px";
  }
  const silent = (fn) => {
    try {
      return fn();
    } catch (error) {
    }
    return void 0;
  };
  const createGetCssVar = (cssVarPrefix = "mui") => createGetCssVar$1(cssVarPrefix);
  function attachColorScheme$1(colorSchemes, scheme, restTheme, colorScheme) {
    if (!scheme) {
      return void 0;
    }
    scheme = scheme === true ? {} : scheme;
    const mode = colorScheme === "dark" ? "dark" : "light";
    if (!restTheme) {
      colorSchemes[colorScheme] = createColorScheme({
        ...scheme,
        palette: {
          mode,
          ...scheme == null ? void 0 : scheme.palette
        }
      });
      return void 0;
    }
    const {
      palette,
      ...muiTheme
    } = createThemeNoVars({
      ...restTheme,
      palette: {
        mode,
        ...scheme == null ? void 0 : scheme.palette
      }
    });
    colorSchemes[colorScheme] = {
      ...scheme,
      palette,
      opacity: {
        ...getOpacity(mode),
        ...scheme == null ? void 0 : scheme.opacity
      },
      overlays: (scheme == null ? void 0 : scheme.overlays) || getOverlays(mode)
    };
    return muiTheme;
  }
  function createThemeWithVars(options = {}, ...args) {
    const {
      colorSchemes: colorSchemesInput = {
        light: true
      },
      defaultColorScheme: defaultColorSchemeInput,
      disableCssColorScheme = false,
      cssVarPrefix = "mui",
      shouldSkipGeneratingVar: shouldSkipGeneratingVar$1 = shouldSkipGeneratingVar,
      colorSchemeSelector: selector = colorSchemesInput.light && colorSchemesInput.dark ? "media" : void 0,
      rootSelector = ":root",
      ...input
    } = options;
    const firstColorScheme = Object.keys(colorSchemesInput)[0];
    const defaultColorScheme = defaultColorSchemeInput || (colorSchemesInput.light && firstColorScheme !== "light" ? "light" : firstColorScheme);
    const getCssVar = createGetCssVar(cssVarPrefix);
    const {
      [defaultColorScheme]: defaultSchemeInput,
      light: builtInLight,
      dark: builtInDark,
      ...customColorSchemes
    } = colorSchemesInput;
    const colorSchemes = {
      ...customColorSchemes
    };
    let defaultScheme = defaultSchemeInput;
    if (defaultColorScheme === "dark" && !("dark" in colorSchemesInput) || defaultColorScheme === "light" && !("light" in colorSchemesInput)) {
      defaultScheme = true;
    }
    if (!defaultScheme) {
      throw new Error(formatMuiErrorMessage(21, defaultColorScheme));
    }
    const muiTheme = attachColorScheme$1(colorSchemes, defaultScheme, input, defaultColorScheme);
    if (builtInLight && !colorSchemes.light) {
      attachColorScheme$1(colorSchemes, builtInLight, void 0, "light");
    }
    if (builtInDark && !colorSchemes.dark) {
      attachColorScheme$1(colorSchemes, builtInDark, void 0, "dark");
    }
    let theme = {
      defaultColorScheme,
      ...muiTheme,
      cssVarPrefix,
      colorSchemeSelector: selector,
      rootSelector,
      getCssVar,
      colorSchemes,
      font: {
        ...prepareTypographyVars(muiTheme.typography),
        ...muiTheme.font
      },
      spacing: getSpacingVal(input.spacing)
    };
    Object.keys(theme.colorSchemes).forEach((key) => {
      const palette = theme.colorSchemes[key].palette;
      const setCssVarColor = (cssVar) => {
        const tokens = cssVar.split("-");
        const color2 = tokens[1];
        const colorToken = tokens[2];
        return getCssVar(cssVar, palette[color2][colorToken]);
      };
      if (palette.mode === "light") {
        setColor(palette.common, "background", "#fff");
        setColor(palette.common, "onBackground", "#000");
      }
      if (palette.mode === "dark") {
        setColor(palette.common, "background", "#000");
        setColor(palette.common, "onBackground", "#fff");
      }
      assignNode(palette, ["Alert", "AppBar", "Avatar", "Button", "Chip", "FilledInput", "LinearProgress", "Skeleton", "Slider", "SnackbarContent", "SpeedDialAction", "StepConnector", "StepContent", "Switch", "TableCell", "Tooltip"]);
      if (palette.mode === "light") {
        setColor(palette.Alert, "errorColor", private_safeDarken(palette.error.light, 0.6));
        setColor(palette.Alert, "infoColor", private_safeDarken(palette.info.light, 0.6));
        setColor(palette.Alert, "successColor", private_safeDarken(palette.success.light, 0.6));
        setColor(palette.Alert, "warningColor", private_safeDarken(palette.warning.light, 0.6));
        setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-main"));
        setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-main"));
        setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-main"));
        setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-main"));
        setColor(palette.Alert, "errorFilledColor", silent(() => palette.getContrastText(palette.error.main)));
        setColor(palette.Alert, "infoFilledColor", silent(() => palette.getContrastText(palette.info.main)));
        setColor(palette.Alert, "successFilledColor", silent(() => palette.getContrastText(palette.success.main)));
        setColor(palette.Alert, "warningFilledColor", silent(() => palette.getContrastText(palette.warning.main)));
        setColor(palette.Alert, "errorStandardBg", private_safeLighten(palette.error.light, 0.9));
        setColor(palette.Alert, "infoStandardBg", private_safeLighten(palette.info.light, 0.9));
        setColor(palette.Alert, "successStandardBg", private_safeLighten(palette.success.light, 0.9));
        setColor(palette.Alert, "warningStandardBg", private_safeLighten(palette.warning.light, 0.9));
        setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
        setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
        setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
        setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
        setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-100"));
        setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-400"));
        setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-300"));
        setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-A100"));
        setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-400"));
        setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-700"));
        setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-700"));
        setColor(palette.FilledInput, "bg", "rgba(0, 0, 0, 0.06)");
        setColor(palette.FilledInput, "hoverBg", "rgba(0, 0, 0, 0.09)");
        setColor(palette.FilledInput, "disabledBg", "rgba(0, 0, 0, 0.12)");
        setColor(palette.LinearProgress, "primaryBg", private_safeLighten(palette.primary.main, 0.62));
        setColor(palette.LinearProgress, "secondaryBg", private_safeLighten(palette.secondary.main, 0.62));
        setColor(palette.LinearProgress, "errorBg", private_safeLighten(palette.error.main, 0.62));
        setColor(palette.LinearProgress, "infoBg", private_safeLighten(palette.info.main, 0.62));
        setColor(palette.LinearProgress, "successBg", private_safeLighten(palette.success.main, 0.62));
        setColor(palette.LinearProgress, "warningBg", private_safeLighten(palette.warning.main, 0.62));
        setColor(palette.Skeleton, "bg", `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.11)`);
        setColor(palette.Slider, "primaryTrack", private_safeLighten(palette.primary.main, 0.62));
        setColor(palette.Slider, "secondaryTrack", private_safeLighten(palette.secondary.main, 0.62));
        setColor(palette.Slider, "errorTrack", private_safeLighten(palette.error.main, 0.62));
        setColor(palette.Slider, "infoTrack", private_safeLighten(palette.info.main, 0.62));
        setColor(palette.Slider, "successTrack", private_safeLighten(palette.success.main, 0.62));
        setColor(palette.Slider, "warningTrack", private_safeLighten(palette.warning.main, 0.62));
        const snackbarContentBackground = private_safeEmphasize(palette.background.default, 0.8);
        setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
        setColor(palette.SnackbarContent, "color", silent(() => palette.getContrastText(snackbarContentBackground)));
        setColor(palette.SpeedDialAction, "fabHoverBg", private_safeEmphasize(palette.background.paper, 0.15));
        setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-400"));
        setColor(palette.StepContent, "border", setCssVarColor("palette-grey-400"));
        setColor(palette.Switch, "defaultColor", setCssVarColor("palette-common-white"));
        setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-100"));
        setColor(palette.Switch, "primaryDisabledColor", private_safeLighten(palette.primary.main, 0.62));
        setColor(palette.Switch, "secondaryDisabledColor", private_safeLighten(palette.secondary.main, 0.62));
        setColor(palette.Switch, "errorDisabledColor", private_safeLighten(palette.error.main, 0.62));
        setColor(palette.Switch, "infoDisabledColor", private_safeLighten(palette.info.main, 0.62));
        setColor(palette.Switch, "successDisabledColor", private_safeLighten(palette.success.main, 0.62));
        setColor(palette.Switch, "warningDisabledColor", private_safeLighten(palette.warning.main, 0.62));
        setColor(palette.TableCell, "border", private_safeLighten(private_safeAlpha(palette.divider, 1), 0.88));
        setColor(palette.Tooltip, "bg", private_safeAlpha(palette.grey[700], 0.92));
      }
      if (palette.mode === "dark") {
        setColor(palette.Alert, "errorColor", private_safeLighten(palette.error.light, 0.6));
        setColor(palette.Alert, "infoColor", private_safeLighten(palette.info.light, 0.6));
        setColor(palette.Alert, "successColor", private_safeLighten(palette.success.light, 0.6));
        setColor(palette.Alert, "warningColor", private_safeLighten(palette.warning.light, 0.6));
        setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-dark"));
        setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-dark"));
        setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-dark"));
        setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-dark"));
        setColor(palette.Alert, "errorFilledColor", silent(() => palette.getContrastText(palette.error.dark)));
        setColor(palette.Alert, "infoFilledColor", silent(() => palette.getContrastText(palette.info.dark)));
        setColor(palette.Alert, "successFilledColor", silent(() => palette.getContrastText(palette.success.dark)));
        setColor(palette.Alert, "warningFilledColor", silent(() => palette.getContrastText(palette.warning.dark)));
        setColor(palette.Alert, "errorStandardBg", private_safeDarken(palette.error.light, 0.9));
        setColor(palette.Alert, "infoStandardBg", private_safeDarken(palette.info.light, 0.9));
        setColor(palette.Alert, "successStandardBg", private_safeDarken(palette.success.light, 0.9));
        setColor(palette.Alert, "warningStandardBg", private_safeDarken(palette.warning.light, 0.9));
        setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
        setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
        setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
        setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
        setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-900"));
        setColor(palette.AppBar, "darkBg", setCssVarColor("palette-background-paper"));
        setColor(palette.AppBar, "darkColor", setCssVarColor("palette-text-primary"));
        setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-600"));
        setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-800"));
        setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-700"));
        setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-700"));
        setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-300"));
        setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-300"));
        setColor(palette.FilledInput, "bg", "rgba(255, 255, 255, 0.09)");
        setColor(palette.FilledInput, "hoverBg", "rgba(255, 255, 255, 0.13)");
        setColor(palette.FilledInput, "disabledBg", "rgba(255, 255, 255, 0.12)");
        setColor(palette.LinearProgress, "primaryBg", private_safeDarken(palette.primary.main, 0.5));
        setColor(palette.LinearProgress, "secondaryBg", private_safeDarken(palette.secondary.main, 0.5));
        setColor(palette.LinearProgress, "errorBg", private_safeDarken(palette.error.main, 0.5));
        setColor(palette.LinearProgress, "infoBg", private_safeDarken(palette.info.main, 0.5));
        setColor(palette.LinearProgress, "successBg", private_safeDarken(palette.success.main, 0.5));
        setColor(palette.LinearProgress, "warningBg", private_safeDarken(palette.warning.main, 0.5));
        setColor(palette.Skeleton, "bg", `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.13)`);
        setColor(palette.Slider, "primaryTrack", private_safeDarken(palette.primary.main, 0.5));
        setColor(palette.Slider, "secondaryTrack", private_safeDarken(palette.secondary.main, 0.5));
        setColor(palette.Slider, "errorTrack", private_safeDarken(palette.error.main, 0.5));
        setColor(palette.Slider, "infoTrack", private_safeDarken(palette.info.main, 0.5));
        setColor(palette.Slider, "successTrack", private_safeDarken(palette.success.main, 0.5));
        setColor(palette.Slider, "warningTrack", private_safeDarken(palette.warning.main, 0.5));
        const snackbarContentBackground = private_safeEmphasize(palette.background.default, 0.98);
        setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
        setColor(palette.SnackbarContent, "color", silent(() => palette.getContrastText(snackbarContentBackground)));
        setColor(palette.SpeedDialAction, "fabHoverBg", private_safeEmphasize(palette.background.paper, 0.15));
        setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-600"));
        setColor(palette.StepContent, "border", setCssVarColor("palette-grey-600"));
        setColor(palette.Switch, "defaultColor", setCssVarColor("palette-grey-300"));
        setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-600"));
        setColor(palette.Switch, "primaryDisabledColor", private_safeDarken(palette.primary.main, 0.55));
        setColor(palette.Switch, "secondaryDisabledColor", private_safeDarken(palette.secondary.main, 0.55));
        setColor(palette.Switch, "errorDisabledColor", private_safeDarken(palette.error.main, 0.55));
        setColor(palette.Switch, "infoDisabledColor", private_safeDarken(palette.info.main, 0.55));
        setColor(palette.Switch, "successDisabledColor", private_safeDarken(palette.success.main, 0.55));
        setColor(palette.Switch, "warningDisabledColor", private_safeDarken(palette.warning.main, 0.55));
        setColor(palette.TableCell, "border", private_safeDarken(private_safeAlpha(palette.divider, 1), 0.68));
        setColor(palette.Tooltip, "bg", private_safeAlpha(palette.grey[700], 0.92));
      }
      setColorChannel(palette.background, "default");
      setColorChannel(palette.background, "paper");
      setColorChannel(palette.common, "background");
      setColorChannel(palette.common, "onBackground");
      setColorChannel(palette, "divider");
      Object.keys(palette).forEach((color2) => {
        const colors = palette[color2];
        if (color2 !== "tonalOffset" && colors && typeof colors === "object") {
          if (colors.main) {
            setColor(palette[color2], "mainChannel", private_safeColorChannel(toRgb(colors.main)));
          }
          if (colors.light) {
            setColor(palette[color2], "lightChannel", private_safeColorChannel(toRgb(colors.light)));
          }
          if (colors.dark) {
            setColor(palette[color2], "darkChannel", private_safeColorChannel(toRgb(colors.dark)));
          }
          if (colors.contrastText) {
            setColor(palette[color2], "contrastTextChannel", private_safeColorChannel(toRgb(colors.contrastText)));
          }
          if (color2 === "text") {
            setColorChannel(palette[color2], "primary");
            setColorChannel(palette[color2], "secondary");
          }
          if (color2 === "action") {
            if (colors.active) {
              setColorChannel(palette[color2], "active");
            }
            if (colors.selected) {
              setColorChannel(palette[color2], "selected");
            }
          }
        }
      });
    });
    theme = args.reduce((acc, argument) => deepmerge(acc, argument), theme);
    const parserConfig = {
      prefix: cssVarPrefix,
      disableCssColorScheme,
      shouldSkipGeneratingVar: shouldSkipGeneratingVar$1,
      getSelector: defaultGetSelector(theme)
    };
    const {
      vars,
      generateThemeVars,
      generateStyleSheets
    } = prepareCssVars(theme, parserConfig);
    theme.vars = vars;
    Object.entries(theme.colorSchemes[theme.defaultColorScheme]).forEach(([key, value]) => {
      theme[key] = value;
    });
    theme.generateThemeVars = generateThemeVars;
    theme.generateStyleSheets = generateStyleSheets;
    theme.generateSpacing = function generateSpacing() {
      return createSpacing(input.spacing, createUnarySpacing(this));
    };
    theme.getColorSchemeSelector = createGetColorSchemeSelector(selector);
    theme.spacing = theme.generateSpacing();
    theme.shouldSkipGeneratingVar = shouldSkipGeneratingVar$1;
    theme.unstable_sxConfig = {
      ...defaultSxConfig,
      ...input == null ? void 0 : input.unstable_sxConfig
    };
    theme.unstable_sx = function sx(props) {
      return styleFunctionSx({
        sx: props,
        theme: this
      });
    };
    theme.toRuntimeSource = stringifyTheme;
    return theme;
  }
  function attachColorScheme(theme, scheme, colorScheme) {
    if (!theme.colorSchemes) {
      return void 0;
    }
    if (colorScheme) {
      theme.colorSchemes[scheme] = {
        ...colorScheme !== true && colorScheme,
        palette: createPalette({
          ...colorScheme === true ? {} : colorScheme.palette,
          mode: scheme
        })
        // cast type to skip module augmentation test
      };
    }
  }
  function createTheme(options = {}, ...args) {
    const {
      palette,
      cssVariables = false,
      colorSchemes: initialColorSchemes = !palette ? {
        light: true
      } : void 0,
      defaultColorScheme: initialDefaultColorScheme = palette == null ? void 0 : palette.mode,
      ...rest
    } = options;
    const defaultColorSchemeInput = initialDefaultColorScheme || "light";
    const defaultScheme = initialColorSchemes == null ? void 0 : initialColorSchemes[defaultColorSchemeInput];
    const colorSchemesInput = {
      ...initialColorSchemes,
      ...palette ? {
        [defaultColorSchemeInput]: {
          ...typeof defaultScheme !== "boolean" && defaultScheme,
          palette
        }
      } : void 0
    };
    if (cssVariables === false) {
      if (!("colorSchemes" in options)) {
        return createThemeNoVars(options, ...args);
      }
      let paletteOptions = palette;
      if (!("palette" in options)) {
        if (colorSchemesInput[defaultColorSchemeInput]) {
          if (colorSchemesInput[defaultColorSchemeInput] !== true) {
            paletteOptions = colorSchemesInput[defaultColorSchemeInput].palette;
          } else if (defaultColorSchemeInput === "dark") {
            paletteOptions = {
              mode: "dark"
            };
          }
        }
      }
      const theme = createThemeNoVars({
        ...options,
        palette: paletteOptions
      }, ...args);
      theme.defaultColorScheme = defaultColorSchemeInput;
      theme.colorSchemes = colorSchemesInput;
      if (theme.palette.mode === "light") {
        theme.colorSchemes.light = {
          ...colorSchemesInput.light !== true && colorSchemesInput.light,
          palette: theme.palette
        };
        attachColorScheme(theme, "dark", colorSchemesInput.dark);
      }
      if (theme.palette.mode === "dark") {
        theme.colorSchemes.dark = {
          ...colorSchemesInput.dark !== true && colorSchemesInput.dark,
          palette: theme.palette
        };
        attachColorScheme(theme, "light", colorSchemesInput.light);
      }
      return theme;
    }
    if (!palette && !("light" in colorSchemesInput) && defaultColorSchemeInput === "light") {
      colorSchemesInput.light = true;
    }
    return createThemeWithVars({
      ...rest,
      colorSchemes: colorSchemesInput,
      defaultColorScheme: defaultColorSchemeInput,
      ...typeof cssVariables !== "boolean" && cssVariables
    }, ...args);
  }
  const defaultTheme$1 = createTheme();
  function useTheme() {
    const theme = useTheme$1(defaultTheme$1);
    return theme[THEME_ID] || theme;
  }
  function slotShouldForwardProp(prop) {
    return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
  }
  const rootShouldForwardProp = (prop) => slotShouldForwardProp(prop) && prop !== "classes";
  const styled = createStyled2({
    themeId: THEME_ID,
    defaultTheme: defaultTheme$1,
    rootShouldForwardProp
  });
  function internal_createExtendSxProp() {
    return extendSxProp$1;
  }
  const memoTheme = unstable_memoTheme;
  function useDefaultProps(params) {
    return useDefaultProps$1(params);
  }
  function getSvgIconUtilityClass(slot) {
    return generateUtilityClass("MuiSvgIcon", slot);
  }
  generateUtilityClasses("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);
  const useUtilityClasses$g = (ownerState) => {
    const {
      color: color2,
      fontSize,
      classes
    } = ownerState;
    const slots = {
      root: ["root", color2 !== "inherit" && `color${capitalize(color2)}`, `fontSize${capitalize(fontSize)}`]
    };
    return composeClasses(slots, getSvgIconUtilityClass, classes);
  };
  const SvgIconRoot = styled("svg", {
    name: "MuiSvgIcon",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "inherit" && styles2[`color${capitalize(ownerState.color)}`], styles2[`fontSize${capitalize(ownerState.fontSize)}`]];
    }
  })(memoTheme(({
    theme
  }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    return {
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      flexShrink: 0,
      transition: (_d = (_a = theme.transitions) == null ? void 0 : _a.create) == null ? void 0 : _d.call(_a, "fill", {
        duration: (_c = (_b = (theme.vars ?? theme).transitions) == null ? void 0 : _b.duration) == null ? void 0 : _c.shorter
      }),
      variants: [
        {
          props: (props) => !props.hasSvgAsChild,
          style: {
            // the <svg> will define the property that has `currentColor`
            // for example heroicons uses fill="none" and stroke="currentColor"
            fill: "currentColor"
          }
        },
        {
          props: {
            fontSize: "inherit"
          },
          style: {
            fontSize: "inherit"
          }
        },
        {
          props: {
            fontSize: "small"
          },
          style: {
            fontSize: ((_f = (_e = theme.typography) == null ? void 0 : _e.pxToRem) == null ? void 0 : _f.call(_e, 20)) || "1.25rem"
          }
        },
        {
          props: {
            fontSize: "medium"
          },
          style: {
            fontSize: ((_h = (_g = theme.typography) == null ? void 0 : _g.pxToRem) == null ? void 0 : _h.call(_g, 24)) || "1.5rem"
          }
        },
        {
          props: {
            fontSize: "large"
          },
          style: {
            fontSize: ((_j = (_i = theme.typography) == null ? void 0 : _i.pxToRem) == null ? void 0 : _j.call(_i, 35)) || "2.1875rem"
          }
        },
        // TODO v5 deprecate color prop, v6 remove for sx
        ...Object.entries((theme.vars ?? theme).palette).filter(([, value]) => value && value.main).map(([color2]) => {
          var _a2, _b2;
          return {
            props: {
              color: color2
            },
            style: {
              color: (_b2 = (_a2 = (theme.vars ?? theme).palette) == null ? void 0 : _a2[color2]) == null ? void 0 : _b2.main
            }
          };
        }),
        {
          props: {
            color: "action"
          },
          style: {
            color: (_l = (_k = (theme.vars ?? theme).palette) == null ? void 0 : _k.action) == null ? void 0 : _l.active
          }
        },
        {
          props: {
            color: "disabled"
          },
          style: {
            color: (_n = (_m = (theme.vars ?? theme).palette) == null ? void 0 : _m.action) == null ? void 0 : _n.disabled
          }
        },
        {
          props: {
            color: "inherit"
          },
          style: {
            color: void 0
          }
        }
      ]
    };
  }));
  const SvgIcon = /* @__PURE__ */ React__namespace.forwardRef(function SvgIcon2(inProps, ref) {
    const props = useDefaultProps({
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
      viewBox = "0 0 24 24",
      ...other
    } = props;
    const hasSvgAsChild = /* @__PURE__ */ React__namespace.isValidElement(children) && children.type === "svg";
    const ownerState = {
      ...props,
      color: color2,
      component,
      fontSize,
      instanceFontSize: inProps.fontSize,
      inheritViewBox,
      viewBox,
      hasSvgAsChild
    };
    const more = {};
    if (!inheritViewBox) {
      more.viewBox = viewBox;
    }
    const classes = useUtilityClasses$g(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SvgIconRoot, {
      as: component,
      className: clsx(classes.root, className),
      focusable: "false",
      color: htmlColor,
      "aria-hidden": titleAccess ? void 0 : true,
      role: titleAccess ? "img" : void 0,
      ref,
      ...more,
      ...other,
      ...hasSvgAsChild && children.props,
      ownerState,
      children: [hasSvgAsChild ? children.props.children : children, titleAccess ? /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        children: titleAccess
      }) : null]
    });
  });
  SvgIcon.muiName = "SvgIcon";
  function createSvgIcon(path, displayName) {
    function Component(props, ref) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SvgIcon, {
        "data-testid": `${displayName}Icon`,
        ref,
        ...props,
        children: path
      });
    }
    Component.muiName = SvgIcon.muiName;
    return /* @__PURE__ */ React__namespace.memo(/* @__PURE__ */ React__namespace.forwardRef(Component));
  }
  function _objectWithoutPropertiesLoose(r2, e2) {
    if (null == r2) return {};
    var t2 = {};
    for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
      if (e2.includes(n2)) continue;
      t2[n2] = r2[n2];
    }
    return t2;
  }
  function _setPrototypeOf(t2, e2) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
      return t3.__proto__ = e3, t3;
    }, _setPrototypeOf(t2, e2);
  }
  function _inheritsLoose(t2, o) {
    t2.prototype = Object.create(o.prototype), t2.prototype.constructor = t2, _setPrototypeOf(t2, o);
  }
  const config$1 = {
    disabled: false
  };
  const TransitionGroupContext = React.createContext(null);
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
      var exit, enter2, appear;
      exit = enter2 = appear = timeout2;
      if (timeout2 != null && typeof timeout2 !== "number") {
        exit = timeout2.exit;
        enter2 = timeout2.enter;
        appear = timeout2.appear !== void 0 ? timeout2.appear : enter2;
      }
      return {
        exit,
        enter: enter2,
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
            if (node2) forceReflow(node2);
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
      var enter2 = this.props.enter;
      var appearing = this.context ? this.context.isMounting : mounting;
      var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM__default.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
      var timeouts = this.getTimeouts();
      var enterTimeout = appearing ? timeouts.appear : timeouts.enter;
      if (!mounting && !enter2 || config$1.disabled) {
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
      if (!exit || config$1.disabled) {
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
        /* @__PURE__ */ React.createElement(TransitionGroupContext.Provider, {
          value: null
        }, typeof children === "function" ? children(status, childProps) : React.cloneElement(React.Children.only(children), childProps))
      );
    };
    return Transition2;
  }(React.Component);
  Transition.contextType = TransitionGroupContext;
  Transition.propTypes = {};
  function noop$4() {
  }
  Transition.defaultProps = {
    in: false,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    enter: true,
    exit: true,
    onEnter: noop$4,
    onEntering: noop$4,
    onEntered: noop$4,
    onExit: noop$4,
    onExiting: noop$4,
    onExited: noop$4
  };
  Transition.UNMOUNTED = UNMOUNTED;
  Transition.EXITED = EXITED;
  Transition.ENTERING = ENTERING;
  Transition.ENTERED = ENTERED;
  Transition.EXITING = EXITING;
  function _assertThisInitialized(e2) {
    if (void 0 === e2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e2;
  }
  function getChildMapping(children, mapFn) {
    var mapper = function mapper2(child) {
      return mapFn && React.isValidElement(child) ? mapFn(child) : child;
    };
    var result = /* @__PURE__ */ Object.create(null);
    if (children) React.Children.map(children, function(c2) {
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
      return React.cloneElement(child, {
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
      if (!React.isValidElement(child)) return;
      var hasPrev = key in prevChildMapping;
      var hasNext = key in nextChildMapping;
      var prevChild = prevChildMapping[key];
      var isLeaving = React.isValidElement(prevChild) && !prevChild.props.in;
      if (hasNext && (!hasPrev || isLeaving)) {
        children[key] = React.cloneElement(child, {
          onExited: onExited.bind(null, child),
          in: true,
          exit: getProp(child, "exit", nextProps),
          enter: getProp(child, "enter", nextProps)
        });
      } else if (!hasNext && hasPrev && !isLeaving) {
        children[key] = React.cloneElement(child, {
          in: false
        });
      } else if (hasNext && hasPrev && React.isValidElement(prevChild)) {
        children[key] = React.cloneElement(child, {
          onExited: onExited.bind(null, child),
          in: prevChild.props.in,
          exit: getProp(child, "exit", nextProps),
          enter: getProp(child, "enter", nextProps)
        });
      }
    });
    return children;
  }
  var values$1 = Object.values || function(obj) {
    return Object.keys(obj).map(function(k2) {
      return obj[k2];
    });
  };
  var defaultProps$1 = {
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
      if (child.key in currentChildMapping) return;
      if (child.props.onExited) {
        child.props.onExited(node2);
      }
      if (this.mounted) {
        this.setState(function(state) {
          var children = _extends({}, state.children);
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
      var children = values$1(this.state.children).map(childFactory2);
      delete props.appear;
      delete props.enter;
      delete props.exit;
      if (Component === null) {
        return /* @__PURE__ */ React.createElement(TransitionGroupContext.Provider, {
          value: contextValue
        }, children);
      }
      return /* @__PURE__ */ React.createElement(TransitionGroupContext.Provider, {
        value: contextValue
      }, /* @__PURE__ */ React.createElement(Component, props, children));
    };
    return TransitionGroup2;
  }(React.Component);
  TransitionGroup.propTypes = {};
  TransitionGroup.defaultProps = defaultProps$1;
  const reflow = (node2) => node2.scrollTop;
  function getTransitionProps(props, options) {
    const {
      timeout,
      easing: easing2,
      style: style2 = {}
    } = props;
    return {
      duration: style2.transitionDuration ?? (typeof timeout === "number" ? timeout : timeout[options.mode] || 0),
      easing: style2.transitionTimingFunction ?? (typeof easing2 === "object" ? easing2[options.mode] : easing2),
      delay: style2.transitionDelay
    };
  }
  function getPaperUtilityClass(slot) {
    return generateUtilityClass("MuiPaper", slot);
  }
  generateUtilityClasses("MuiPaper", ["root", "rounded", "outlined", "elevation", "elevation0", "elevation1", "elevation2", "elevation3", "elevation4", "elevation5", "elevation6", "elevation7", "elevation8", "elevation9", "elevation10", "elevation11", "elevation12", "elevation13", "elevation14", "elevation15", "elevation16", "elevation17", "elevation18", "elevation19", "elevation20", "elevation21", "elevation22", "elevation23", "elevation24"]);
  const useUtilityClasses$f = (ownerState) => {
    const {
      square,
      elevation,
      variant,
      classes
    } = ownerState;
    const slots = {
      root: ["root", variant, !square && "rounded", variant === "elevation" && `elevation${elevation}`]
    };
    return composeClasses(slots, getPaperUtilityClass, classes);
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
  })(memoTheme(({
    theme
  }) => ({
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.primary,
    transition: theme.transitions.create("box-shadow"),
    variants: [{
      props: ({
        ownerState
      }) => !ownerState.square,
      style: {
        borderRadius: theme.shape.borderRadius
      }
    }, {
      props: {
        variant: "outlined"
      },
      style: {
        border: `1px solid ${(theme.vars || theme).palette.divider}`
      }
    }, {
      props: {
        variant: "elevation"
      },
      style: {
        boxShadow: "var(--Paper-shadow)",
        backgroundImage: "var(--Paper-overlay)"
      }
    }]
  })));
  const Paper = /* @__PURE__ */ React__namespace.forwardRef(function Paper2(inProps, ref) {
    var _a;
    const props = useDefaultProps({
      props: inProps,
      name: "MuiPaper"
    });
    const theme = useTheme();
    const {
      className,
      component = "div",
      elevation = 1,
      square = false,
      variant = "elevation",
      ...other
    } = props;
    const ownerState = {
      ...props,
      component,
      elevation,
      square,
      variant
    };
    const classes = useUtilityClasses$f(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PaperRoot, {
      as: component,
      ownerState,
      className: clsx(classes.root, className),
      ref,
      ...other,
      style: {
        ...variant === "elevation" && {
          "--Paper-shadow": (theme.vars || theme).shadows[elevation],
          ...theme.vars && {
            "--Paper-overlay": (_a = theme.vars.overlays) == null ? void 0 : _a[elevation]
          },
          ...!theme.vars && theme.palette.mode === "dark" && {
            "--Paper-overlay": `linear-gradient(${alpha("#fff", getOverlayAlpha(elevation))}, ${alpha("#fff", getOverlayAlpha(elevation))})`
          }
        },
        ...other.style
      }
    });
  });
  function useSlot(name, parameters) {
    const {
      className,
      elementType: initialElementType,
      ownerState,
      externalForwardedProps,
      internalForwardedProps,
      ...useSlotPropsParams
    } = parameters;
    const {
      component: rootComponent,
      slots = {
        [name]: void 0
      },
      slotProps = {
        [name]: void 0
      },
      ...other
    } = externalForwardedProps;
    const elementType = slots[name] || initialElementType;
    const resolvedComponentsProps = resolveComponentProps(slotProps[name], ownerState);
    const {
      props: {
        component: slotComponent,
        ...mergedProps
      },
      internalRef
    } = mergeSlotProps({
      className,
      ...useSlotPropsParams,
      externalForwardedProps: name === "root" ? other : void 0,
      externalSlotProps: resolvedComponentsProps
    });
    const ref = useForkRef(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, parameters.ref);
    const LeafComponent = name === "root" ? slotComponent || rootComponent : slotComponent;
    const props = appendOwnerState(elementType, {
      ...name === "root" && !rootComponent && !slots[name] && internalForwardedProps,
      ...name !== "root" && !slots[name] && internalForwardedProps,
      ...mergedProps,
      ...LeafComponent && {
        as: LeafComponent
      },
      ref
    }, ownerState);
    return [elementType, props];
  }
  class LazyRipple {
    constructor() {
      __publicField(this, "mountEffect", () => {
        if (this.shouldMount && !this.didMount) {
          if (this.ref.current !== null) {
            this.didMount = true;
            this.mounted.resolve();
          }
        }
      });
      this.ref = {
        current: null
      };
      this.mounted = null;
      this.didMount = false;
      this.shouldMount = false;
      this.setShouldMount = null;
    }
    /** React ref to the ripple instance */
    /** If the ripple component should be mounted */
    /** Promise that resolves when the ripple component is mounted */
    /** If the ripple component has been mounted */
    /** React state hook setter */
    static create() {
      return new LazyRipple();
    }
    static use() {
      const ripple = useLazyRef(LazyRipple.create).current;
      const [shouldMount, setShouldMount] = React__namespace.useState(false);
      ripple.shouldMount = shouldMount;
      ripple.setShouldMount = setShouldMount;
      React__namespace.useEffect(ripple.mountEffect, [shouldMount]);
      return ripple;
    }
    mount() {
      if (!this.mounted) {
        this.mounted = createControlledPromise();
        this.shouldMount = true;
        this.setShouldMount(this.shouldMount);
      }
      return this.mounted;
    }
    /* Ripple API */
    start(...args) {
      this.mount().then(() => {
        var _a;
        return (_a = this.ref.current) == null ? void 0 : _a.start(...args);
      });
    }
    stop(...args) {
      this.mount().then(() => {
        var _a;
        return (_a = this.ref.current) == null ? void 0 : _a.stop(...args);
      });
    }
    pulsate(...args) {
      this.mount().then(() => {
        var _a;
        return (_a = this.ref.current) == null ? void 0 : _a.pulsate(...args);
      });
    }
  }
  function useLazyRipple() {
    return LazyRipple.use();
  }
  function createControlledPromise() {
    let resolve;
    let reject;
    const p2 = new Promise((resolveFn, rejectFn) => {
      resolve = resolveFn;
      reject = rejectFn;
    });
    p2.resolve = resolve;
    p2.reject = reject;
    return p2;
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
    const [leaving, setLeaving] = React__namespace.useState(false);
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
    React__namespace.useEffect(() => {
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
  const touchRippleClasses = generateUtilityClasses("MuiTouchRipple", ["root", "ripple", "rippleVisible", "ripplePulsate", "child", "childLeaving", "childPulsate"]);
  const DURATION = 550;
  const DELAY_RIPPLE = 80;
  const enterKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;
  const exitKeyframe = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;
  const pulsateKeyframe = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`;
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
  })`
  opacity: 0;
  position: absolute;

  &.${touchRippleClasses.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${enterKeyframe};
    animation-duration: ${DURATION}ms;
    animation-timing-function: ${({
  theme
}) => theme.transitions.easing.easeInOut};
  }

  &.${touchRippleClasses.ripplePulsate} {
    animation-duration: ${({
  theme
}) => theme.transitions.duration.shorter}ms;
  }

  & .${touchRippleClasses.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${touchRippleClasses.childLeaving} {
    opacity: 0;
    animation-name: ${exitKeyframe};
    animation-duration: ${DURATION}ms;
    animation-timing-function: ${({
  theme
}) => theme.transitions.easing.easeInOut};
  }

  & .${touchRippleClasses.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${pulsateKeyframe};
    animation-duration: 2500ms;
    animation-timing-function: ${({
  theme
}) => theme.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`;
  const TouchRipple = /* @__PURE__ */ React__namespace.forwardRef(function TouchRipple2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiTouchRipple"
    });
    const {
      center: centerProp = false,
      classes = {},
      className,
      ...other
    } = props;
    const [ripples, setRipples] = React__namespace.useState([]);
    const nextKey = React__namespace.useRef(0);
    const rippleCallback = React__namespace.useRef(null);
    React__namespace.useEffect(() => {
      if (rippleCallback.current) {
        rippleCallback.current();
        rippleCallback.current = null;
      }
    }, [ripples]);
    const ignoringMouseDown = React__namespace.useRef(false);
    const startTimer = useTimeout();
    const startTimerCommit = React__namespace.useRef(null);
    const container = React__namespace.useRef(null);
    const startCommit = React__namespace.useCallback((params) => {
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
    const start = React__namespace.useCallback((event = {}, options = {}, cb = () => {
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
      if (event == null ? void 0 : event.touches) {
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
    const pulsate = React__namespace.useCallback(() => {
      start({}, {
        pulsate: true
      });
    }, [start]);
    const stop = React__namespace.useCallback((event, cb) => {
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
    React__namespace.useImperativeHandle(ref, () => ({
      pulsate,
      start,
      stop
    }), [pulsate, start, stop]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRippleRoot, {
      className: clsx(touchRippleClasses.root, classes.root, className),
      ref: container,
      ...other,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionGroup, {
        component: null,
        exit: true,
        children: ripples
      })
    });
  });
  function getButtonBaseUtilityClass(slot) {
    return generateUtilityClass("MuiButtonBase", slot);
  }
  const buttonBaseClasses = generateUtilityClasses("MuiButtonBase", ["root", "disabled", "focusVisible"]);
  const useUtilityClasses$e = (ownerState) => {
    const {
      disabled,
      focusVisible,
      focusVisibleClassName,
      classes
    } = ownerState;
    const slots = {
      root: ["root", disabled && "disabled", focusVisible && "focusVisible"]
    };
    const composedClasses = composeClasses(slots, getButtonBaseUtilityClass, classes);
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
  const ButtonBase = /* @__PURE__ */ React__namespace.forwardRef(function ButtonBase2(inProps, ref) {
    const props = useDefaultProps({
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
      focusVisibleClassName,
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
      type,
      ...other
    } = props;
    const buttonRef = React__namespace.useRef(null);
    const ripple = useLazyRipple();
    const handleRippleRef = useForkRef(ripple.ref, touchRippleRef);
    const [focusVisible, setFocusVisible] = React__namespace.useState(false);
    if (disabled && focusVisible) {
      setFocusVisible(false);
    }
    React__namespace.useImperativeHandle(action, () => ({
      focusVisible: () => {
        setFocusVisible(true);
        buttonRef.current.focus();
      }
    }), []);
    const enableTouchRipple = ripple.shouldMount && !disableRipple && !disabled;
    React__namespace.useEffect(() => {
      if (focusVisible && focusRipple && !disableRipple) {
        ripple.pulsate();
      }
    }, [disableRipple, focusRipple, focusVisible, ripple]);
    const handleMouseDown = useRippleHandler(ripple, "start", onMouseDown, disableTouchRipple);
    const handleContextMenu = useRippleHandler(ripple, "stop", onContextMenu, disableTouchRipple);
    const handleDragLeave = useRippleHandler(ripple, "stop", onDragLeave, disableTouchRipple);
    const handleMouseUp = useRippleHandler(ripple, "stop", onMouseUp, disableTouchRipple);
    const handleMouseLeave = useRippleHandler(ripple, "stop", (event) => {
      if (focusVisible) {
        event.preventDefault();
      }
      if (onMouseLeave) {
        onMouseLeave(event);
      }
    }, disableTouchRipple);
    const handleTouchStart = useRippleHandler(ripple, "start", onTouchStart, disableTouchRipple);
    const handleTouchEnd = useRippleHandler(ripple, "stop", onTouchEnd, disableTouchRipple);
    const handleTouchMove = useRippleHandler(ripple, "stop", onTouchMove, disableTouchRipple);
    const handleBlur = useRippleHandler(ripple, "stop", (event) => {
      if (!isFocusVisible(event.target)) {
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
      if (isFocusVisible(event.target)) {
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
      const button = buttonRef.current;
      return component && component !== "button" && !(button.tagName === "A" && button.href);
    };
    const handleKeyDown = useEventCallback((event) => {
      if (focusRipple && !event.repeat && focusVisible && event.key === " ") {
        ripple.stop(event, () => {
          ripple.start(event);
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
      if (focusRipple && event.key === " " && focusVisible && !event.defaultPrevented) {
        ripple.stop(event, () => {
          ripple.pulsate(event);
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
    const handleRef = useForkRef(ref, buttonRef);
    const ownerState = {
      ...props,
      centerRipple,
      component,
      disabled,
      disableRipple,
      disableTouchRipple,
      focusRipple,
      tabIndex,
      focusVisible
    };
    const classes = useUtilityClasses$e(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonBaseRoot, {
      as: ComponentProp,
      className: clsx(classes.root, className),
      ownerState,
      onBlur: handleBlur,
      onClick,
      onContextMenu: handleContextMenu,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
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
      type,
      ...buttonProps,
      ...other,
      children: [children, enableTouchRipple ? /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRipple, {
        ref: handleRippleRef,
        center: centerRipple,
        ...TouchRippleProps
      }) : null]
    });
  });
  function useRippleHandler(ripple, rippleAction, eventCallback, skipRippleAction = false) {
    return useEventCallback((event) => {
      if (eventCallback) {
        eventCallback(event);
      }
      if (!skipRippleAction) {
        ripple[rippleAction](event);
      }
      return true;
    });
  }
  function hasCorrectMainProperty(obj) {
    return typeof obj.main === "string";
  }
  function checkSimplePaletteColorValues(obj, additionalPropertiesToCheck = []) {
    if (!hasCorrectMainProperty(obj)) {
      return false;
    }
    for (const value of additionalPropertiesToCheck) {
      if (!obj.hasOwnProperty(value) || typeof obj[value] !== "string") {
        return false;
      }
    }
    return true;
  }
  function createSimplePaletteValueFilter(additionalPropertiesToCheck = []) {
    return ([, value]) => value && checkSimplePaletteColorValues(value, additionalPropertiesToCheck);
  }
  function getTypographyUtilityClass(slot) {
    return generateUtilityClass("MuiTypography", slot);
  }
  const typographyClasses = generateUtilityClasses("MuiTypography", ["root", "h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "inherit", "button", "caption", "overline", "alignLeft", "alignRight", "alignCenter", "alignJustify", "noWrap", "gutterBottom", "paragraph"]);
  const v6Colors$1 = {
    primary: true,
    secondary: true,
    error: true,
    info: true,
    success: true,
    warning: true,
    textPrimary: true,
    textSecondary: true,
    textDisabled: true
  };
  const extendSxProp = internal_createExtendSxProp();
  const useUtilityClasses$d = (ownerState) => {
    const {
      align,
      gutterBottom,
      noWrap,
      paragraph,
      variant,
      classes
    } = ownerState;
    const slots = {
      root: ["root", variant, ownerState.align !== "inherit" && `align${capitalize(align)}`, gutterBottom && "gutterBottom", noWrap && "noWrap", paragraph && "paragraph"]
    };
    return composeClasses(slots, getTypographyUtilityClass, classes);
  };
  const TypographyRoot = styled("span", {
    name: "MuiTypography",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.variant && styles2[ownerState.variant], ownerState.align !== "inherit" && styles2[`align${capitalize(ownerState.align)}`], ownerState.noWrap && styles2.noWrap, ownerState.gutterBottom && styles2.gutterBottom, ownerState.paragraph && styles2.paragraph];
    }
  })(memoTheme(({
    theme
  }) => {
    var _a;
    return {
      margin: 0,
      variants: [{
        props: {
          variant: "inherit"
        },
        style: {
          // Some elements, like <button> on Chrome have default font that doesn't inherit, reset this.
          font: "inherit",
          lineHeight: "inherit",
          letterSpacing: "inherit"
        }
      }, ...Object.entries(theme.typography).filter(([variant, value]) => variant !== "inherit" && value && typeof value === "object").map(([variant, value]) => ({
        props: {
          variant
        },
        style: value
      })), ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color2]) => ({
        props: {
          color: color2
        },
        style: {
          color: (theme.vars || theme).palette[color2].main
        }
      })), ...Object.entries(((_a = theme.palette) == null ? void 0 : _a.text) || {}).filter(([, value]) => typeof value === "string").map(([color2]) => ({
        props: {
          color: `text${capitalize(color2)}`
        },
        style: {
          color: (theme.vars || theme).palette.text[color2]
        }
      })), {
        props: ({
          ownerState
        }) => ownerState.align !== "inherit",
        style: {
          textAlign: "var(--Typography-textAlign)"
        }
      }, {
        props: ({
          ownerState
        }) => ownerState.noWrap,
        style: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }
      }, {
        props: ({
          ownerState
        }) => ownerState.gutterBottom,
        style: {
          marginBottom: "0.35em"
        }
      }, {
        props: ({
          ownerState
        }) => ownerState.paragraph,
        style: {
          marginBottom: 16
        }
      }]
    };
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
  const Typography = /* @__PURE__ */ React__namespace.forwardRef(function Typography2(inProps, ref) {
    const {
      color: color2,
      ...themeProps
    } = useDefaultProps({
      props: inProps,
      name: "MuiTypography"
    });
    const isSxColor = !v6Colors$1[color2];
    const props = extendSxProp({
      ...themeProps,
      ...isSxColor && {
        color: color2
      }
    });
    const {
      align = "inherit",
      className,
      component,
      gutterBottom = false,
      noWrap = false,
      paragraph = false,
      variant = "body1",
      variantMapping = defaultVariantMapping,
      ...other
    } = props;
    const ownerState = {
      ...props,
      align,
      color: color2,
      className,
      component,
      gutterBottom,
      noWrap,
      paragraph,
      variant,
      variantMapping
    };
    const Component = component || (paragraph ? "p" : variantMapping[variant] || defaultVariantMapping[variant]) || "span";
    const classes = useUtilityClasses$d(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TypographyRoot, {
      as: Component,
      ref,
      className: clsx(classes.root, className),
      ...other,
      ownerState,
      style: {
        ...align !== "inherit" && {
          "--Typography-textAlign": align
        },
        ...other.style
      }
    });
  });
  function getContainer$1(container) {
    return typeof container === "function" ? container() : container;
  }
  const Portal = /* @__PURE__ */ React__namespace.forwardRef(function Portal2(props, forwardedRef) {
    const {
      children,
      container,
      disablePortal = false
    } = props;
    const [mountNode, setMountNode] = React__namespace.useState(null);
    const handleRef = useForkRef(/* @__PURE__ */ React__namespace.isValidElement(children) ? getReactElementRef(children) : null, forwardedRef);
    useEnhancedEffect(() => {
      if (!disablePortal) {
        setMountNode(getContainer$1(container) || document.body);
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
      if (/* @__PURE__ */ React__namespace.isValidElement(children)) {
        const newProps = {
          ref: handleRef
        };
        return /* @__PURE__ */ React__namespace.cloneElement(children, newProps);
      }
      return children;
    }
    return mountNode ? /* @__PURE__ */ ReactDOM__default__namespace.createPortal(children, mountNode) : mountNode;
  });
  function isHostComponent(element) {
    return typeof element === "string";
  }
  const FormControlContext = /* @__PURE__ */ React__namespace.createContext(void 0);
  function useFormControl() {
    return React__namespace.useContext(FormControlContext);
  }
  const styles = {
    entering: {
      opacity: 1
    },
    entered: {
      opacity: 1
    }
  };
  const Fade = /* @__PURE__ */ React__namespace.forwardRef(function Fade2(props, ref) {
    const theme = useTheme();
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
      TransitionComponent = Transition,
      ...other
    } = props;
    const nodeRef = React__namespace.useRef(null);
    const handleRef = useForkRef(nodeRef, getReactElementRef(children), ref);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, {
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
      timeout,
      ...other,
      children: (state, {
        ownerState,
        ...restChildProps
      }) => {
        return /* @__PURE__ */ React__namespace.cloneElement(children, {
          style: {
            opacity: 0,
            visibility: state === "exited" && !inProp ? "hidden" : void 0,
            ...styles[state],
            ...style2,
            ...children.props.style
          },
          ref: handleRef,
          ...restChildProps
        });
      }
    });
  });
  function getBackdropUtilityClass(slot) {
    return generateUtilityClass("MuiBackdrop", slot);
  }
  generateUtilityClasses("MuiBackdrop", ["root", "invisible"]);
  const useUtilityClasses$c = (ownerState) => {
    const {
      classes,
      invisible
    } = ownerState;
    const slots = {
      root: ["root", invisible && "invisible"]
    };
    return composeClasses(slots, getBackdropUtilityClass, classes);
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
  })({
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    WebkitTapHighlightColor: "transparent",
    variants: [{
      props: {
        invisible: true
      },
      style: {
        backgroundColor: "transparent"
      }
    }]
  });
  const Backdrop = /* @__PURE__ */ React__namespace.forwardRef(function Backdrop2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiBackdrop"
    });
    const {
      children,
      className,
      component = "div",
      invisible = false,
      open,
      components = {},
      componentsProps = {},
      slotProps = {},
      slots = {},
      TransitionComponent: TransitionComponentProp,
      transitionDuration,
      ...other
    } = props;
    const ownerState = {
      ...props,
      component,
      invisible
    };
    const classes = useUtilityClasses$c(ownerState);
    const backwardCompatibleSlots = {
      transition: TransitionComponentProp,
      root: components.Root,
      ...slots
    };
    const backwardCompatibleSlotProps = {
      ...componentsProps,
      ...slotProps
    };
    const externalForwardedProps = {
      slots: backwardCompatibleSlots,
      slotProps: backwardCompatibleSlotProps
    };
    const [RootSlot, rootProps] = useSlot("root", {
      elementType: BackdropRoot,
      externalForwardedProps,
      className: clsx(classes.root, className),
      ownerState
    });
    const [TransitionSlot, transitionProps] = useSlot("transition", {
      elementType: Fade,
      externalForwardedProps,
      ownerState
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionSlot, {
      in: open,
      timeout: transitionDuration,
      ...other,
      ...transitionProps,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RootSlot, {
        "aria-hidden": true,
        ...rootProps,
        classes,
        ref,
        children
      })
    });
  });
  const boxClasses = generateUtilityClasses("MuiBox", ["root"]);
  const defaultTheme = createTheme();
  const Box = createBox$1({
    themeId: THEME_ID,
    defaultTheme,
    defaultClassName: boxClasses.root,
    generateClassName: ClassNameGenerator.generate
  });
  function getButtonUtilityClass(slot) {
    return generateUtilityClass("MuiButton", slot);
  }
  const buttonClasses = generateUtilityClasses("MuiButton", ["root", "text", "textInherit", "textPrimary", "textSecondary", "textSuccess", "textError", "textInfo", "textWarning", "outlined", "outlinedInherit", "outlinedPrimary", "outlinedSecondary", "outlinedSuccess", "outlinedError", "outlinedInfo", "outlinedWarning", "contained", "containedInherit", "containedPrimary", "containedSecondary", "containedSuccess", "containedError", "containedInfo", "containedWarning", "disableElevation", "focusVisible", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorSuccess", "colorError", "colorInfo", "colorWarning", "textSizeSmall", "textSizeMedium", "textSizeLarge", "outlinedSizeSmall", "outlinedSizeMedium", "outlinedSizeLarge", "containedSizeSmall", "containedSizeMedium", "containedSizeLarge", "sizeMedium", "sizeSmall", "sizeLarge", "fullWidth", "startIcon", "endIcon", "icon", "iconSizeSmall", "iconSizeMedium", "iconSizeLarge"]);
  const ButtonGroupContext = /* @__PURE__ */ React__namespace.createContext({});
  const ButtonGroupButtonContext = /* @__PURE__ */ React__namespace.createContext(void 0);
  const useUtilityClasses$b = (ownerState) => {
    const {
      color: color2,
      disableElevation,
      fullWidth,
      size,
      variant,
      classes
    } = ownerState;
    const slots = {
      root: ["root", variant, `${variant}${capitalize(color2)}`, `size${capitalize(size)}`, `${variant}Size${capitalize(size)}`, `color${capitalize(color2)}`, disableElevation && "disableElevation", fullWidth && "fullWidth"],
      label: ["label"],
      startIcon: ["icon", "startIcon", `iconSize${capitalize(size)}`],
      endIcon: ["icon", "endIcon", `iconSize${capitalize(size)}`]
    };
    const composedClasses = composeClasses(slots, getButtonUtilityClass, classes);
    return {
      ...classes,
      // forward the focused, disabled, etc. classes to the ButtonBase
      ...composedClasses
    };
  };
  const commonIconStyles = [{
    props: {
      size: "small"
    },
    style: {
      "& > *:nth-of-type(1)": {
        fontSize: 18
      }
    }
  }, {
    props: {
      size: "medium"
    },
    style: {
      "& > *:nth-of-type(1)": {
        fontSize: 20
      }
    }
  }, {
    props: {
      size: "large"
    },
    style: {
      "& > *:nth-of-type(1)": {
        fontSize: 22
      }
    }
  }];
  const ButtonRoot = styled(ButtonBase, {
    shouldForwardProp: (prop) => rootShouldForwardProp(prop) || prop === "classes",
    name: "MuiButton",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], styles2[`${ownerState.variant}${capitalize(ownerState.color)}`], styles2[`size${capitalize(ownerState.size)}`], styles2[`${ownerState.variant}Size${capitalize(ownerState.size)}`], ownerState.color === "inherit" && styles2.colorInherit, ownerState.disableElevation && styles2.disableElevation, ownerState.fullWidth && styles2.fullWidth];
    }
  })(memoTheme(({
    theme
  }) => {
    const inheritContainedBackgroundColor = theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[800];
    const inheritContainedHoverBackgroundColor = theme.palette.mode === "light" ? theme.palette.grey.A100 : theme.palette.grey[700];
    return {
      ...theme.typography.button,
      minWidth: 64,
      padding: "6px 16px",
      border: 0,
      borderRadius: (theme.vars || theme).shape.borderRadius,
      transition: theme.transitions.create(["background-color", "box-shadow", "border-color", "color"], {
        duration: theme.transitions.duration.short
      }),
      "&:hover": {
        textDecoration: "none"
      },
      [`&.${buttonClasses.disabled}`]: {
        color: (theme.vars || theme).palette.action.disabled
      },
      variants: [{
        props: {
          variant: "contained"
        },
        style: {
          color: `var(--variant-containedColor)`,
          backgroundColor: `var(--variant-containedBg)`,
          boxShadow: (theme.vars || theme).shadows[2],
          "&:hover": {
            boxShadow: (theme.vars || theme).shadows[4],
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
              boxShadow: (theme.vars || theme).shadows[2]
            }
          },
          "&:active": {
            boxShadow: (theme.vars || theme).shadows[8]
          },
          [`&.${buttonClasses.focusVisible}`]: {
            boxShadow: (theme.vars || theme).shadows[6]
          },
          [`&.${buttonClasses.disabled}`]: {
            color: (theme.vars || theme).palette.action.disabled,
            boxShadow: (theme.vars || theme).shadows[0],
            backgroundColor: (theme.vars || theme).palette.action.disabledBackground
          }
        }
      }, {
        props: {
          variant: "outlined"
        },
        style: {
          padding: "5px 15px",
          border: "1px solid currentColor",
          borderColor: `var(--variant-outlinedBorder, currentColor)`,
          backgroundColor: `var(--variant-outlinedBg)`,
          color: `var(--variant-outlinedColor)`,
          [`&.${buttonClasses.disabled}`]: {
            border: `1px solid ${(theme.vars || theme).palette.action.disabledBackground}`
          }
        }
      }, {
        props: {
          variant: "text"
        },
        style: {
          padding: "6px 8px",
          color: `var(--variant-textColor)`,
          backgroundColor: `var(--variant-textBg)`
        }
      }, ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color2]) => ({
        props: {
          color: color2
        },
        style: {
          "--variant-textColor": (theme.vars || theme).palette[color2].main,
          "--variant-outlinedColor": (theme.vars || theme).palette[color2].main,
          "--variant-outlinedBorder": theme.vars ? `rgba(${theme.vars.palette[color2].mainChannel} / 0.5)` : alpha(theme.palette[color2].main, 0.5),
          "--variant-containedColor": (theme.vars || theme).palette[color2].contrastText,
          "--variant-containedBg": (theme.vars || theme).palette[color2].main,
          "@media (hover: hover)": {
            "&:hover": {
              "--variant-containedBg": (theme.vars || theme).palette[color2].dark,
              "--variant-textBg": theme.vars ? `rgba(${theme.vars.palette[color2].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha(theme.palette[color2].main, theme.palette.action.hoverOpacity),
              "--variant-outlinedBorder": (theme.vars || theme).palette[color2].main,
              "--variant-outlinedBg": theme.vars ? `rgba(${theme.vars.palette[color2].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha(theme.palette[color2].main, theme.palette.action.hoverOpacity)
            }
          }
        }
      })), {
        props: {
          color: "inherit"
        },
        style: {
          color: "inherit",
          borderColor: "currentColor",
          "--variant-containedBg": theme.vars ? theme.vars.palette.Button.inheritContainedBg : inheritContainedBackgroundColor,
          "@media (hover: hover)": {
            "&:hover": {
              "--variant-containedBg": theme.vars ? theme.vars.palette.Button.inheritContainedHoverBg : inheritContainedHoverBackgroundColor,
              "--variant-textBg": theme.vars ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
              "--variant-outlinedBg": theme.vars ? `rgba(${theme.vars.palette.text.primaryChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity)
            }
          }
        }
      }, {
        props: {
          size: "small",
          variant: "text"
        },
        style: {
          padding: "4px 5px",
          fontSize: theme.typography.pxToRem(13)
        }
      }, {
        props: {
          size: "large",
          variant: "text"
        },
        style: {
          padding: "8px 11px",
          fontSize: theme.typography.pxToRem(15)
        }
      }, {
        props: {
          size: "small",
          variant: "outlined"
        },
        style: {
          padding: "3px 9px",
          fontSize: theme.typography.pxToRem(13)
        }
      }, {
        props: {
          size: "large",
          variant: "outlined"
        },
        style: {
          padding: "7px 21px",
          fontSize: theme.typography.pxToRem(15)
        }
      }, {
        props: {
          size: "small",
          variant: "contained"
        },
        style: {
          padding: "4px 10px",
          fontSize: theme.typography.pxToRem(13)
        }
      }, {
        props: {
          size: "large",
          variant: "contained"
        },
        style: {
          padding: "8px 22px",
          fontSize: theme.typography.pxToRem(15)
        }
      }, {
        props: {
          disableElevation: true
        },
        style: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none"
          },
          [`&.${buttonClasses.focusVisible}`]: {
            boxShadow: "none"
          },
          "&:active": {
            boxShadow: "none"
          },
          [`&.${buttonClasses.disabled}`]: {
            boxShadow: "none"
          }
        }
      }, {
        props: {
          fullWidth: true
        },
        style: {
          width: "100%"
        }
      }]
    };
  }));
  const ButtonStartIcon = styled("span", {
    name: "MuiButton",
    slot: "StartIcon",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.startIcon, styles2[`iconSize${capitalize(ownerState.size)}`]];
    }
  })({
    display: "inherit",
    marginRight: 8,
    marginLeft: -4,
    variants: [{
      props: {
        size: "small"
      },
      style: {
        marginLeft: -2
      }
    }, ...commonIconStyles]
  });
  const ButtonEndIcon = styled("span", {
    name: "MuiButton",
    slot: "EndIcon",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.endIcon, styles2[`iconSize${capitalize(ownerState.size)}`]];
    }
  })({
    display: "inherit",
    marginRight: -4,
    marginLeft: 8,
    variants: [{
      props: {
        size: "small"
      },
      style: {
        marginRight: -2
      }
    }, ...commonIconStyles]
  });
  const Button = /* @__PURE__ */ React__namespace.forwardRef(function Button2(inProps, ref) {
    const contextProps = React__namespace.useContext(ButtonGroupContext);
    const buttonGroupButtonContextPositionClassName = React__namespace.useContext(ButtonGroupButtonContext);
    const resolvedProps = resolveProps(contextProps, inProps);
    const props = useDefaultProps({
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
      variant = "text",
      ...other
    } = props;
    const ownerState = {
      ...props,
      color: color2,
      component,
      disabled,
      disableElevation,
      disableFocusRipple,
      fullWidth,
      size,
      type,
      variant
    };
    const classes = useUtilityClasses$b(ownerState);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonRoot, {
      ownerState,
      className: clsx(contextProps.className, classes.root, className, positionClassName),
      component,
      disabled,
      focusRipple: !disableFocusRipple,
      focusVisibleClassName: clsx(classes.focusVisible, focusVisibleClassName),
      ref,
      type,
      ...other,
      classes,
      children: [startIcon, children, endIcon]
    });
  });
  function getSwitchBaseUtilityClass(slot) {
    return generateUtilityClass("PrivateSwitchBase", slot);
  }
  generateUtilityClasses("PrivateSwitchBase", ["root", "checked", "disabled", "input", "edgeStart", "edgeEnd"]);
  const useUtilityClasses$a = (ownerState) => {
    const {
      classes,
      checked,
      disabled,
      edge
    } = ownerState;
    const slots = {
      root: ["root", checked && "checked", disabled && "disabled", edge && `edge${capitalize(edge)}`],
      input: ["input"]
    };
    return composeClasses(slots, getSwitchBaseUtilityClass, classes);
  };
  const SwitchBaseRoot = styled(ButtonBase)({
    padding: 9,
    borderRadius: "50%",
    variants: [{
      props: {
        edge: "start",
        size: "small"
      },
      style: {
        marginLeft: -3
      }
    }, {
      props: ({
        edge,
        ownerState
      }) => edge === "start" && ownerState.size !== "small",
      style: {
        marginLeft: -12
      }
    }, {
      props: {
        edge: "end",
        size: "small"
      },
      style: {
        marginRight: -3
      }
    }, {
      props: ({
        edge,
        ownerState
      }) => edge === "end" && ownerState.size !== "small",
      style: {
        marginRight: -12
      }
    }]
  });
  const SwitchBaseInput = styled("input", {
    shouldForwardProp: rootShouldForwardProp
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
  const SwitchBase = /* @__PURE__ */ React__namespace.forwardRef(function SwitchBase2(props, ref) {
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
      value,
      ...other
    } = props;
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
    const ownerState = {
      ...props,
      checked,
      disabled,
      disableFocusRipple,
      edge
    };
    const classes = useUtilityClasses$a(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchBaseRoot, {
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
      ref,
      ...other,
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(SwitchBaseInput, {
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
        type,
        ...type === "checkbox" && value === void 0 ? {} : {
          value
        },
        ...inputProps
      }), checked ? checkedIcon : icon]
    });
  });
  const CheckBoxOutlineBlankIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
  }), "CheckBoxOutlineBlank");
  const CheckBoxIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
  }), "CheckBox");
  const IndeterminateCheckBoxIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"
  }), "IndeterminateCheckBox");
  function getCheckboxUtilityClass(slot) {
    return generateUtilityClass("MuiCheckbox", slot);
  }
  const checkboxClasses = generateUtilityClasses("MuiCheckbox", ["root", "checked", "disabled", "indeterminate", "colorPrimary", "colorSecondary", "sizeSmall", "sizeMedium"]);
  const useUtilityClasses$9 = (ownerState) => {
    const {
      classes,
      indeterminate,
      color: color2,
      size
    } = ownerState;
    const slots = {
      root: ["root", indeterminate && "indeterminate", `color${capitalize(color2)}`, `size${capitalize(size)}`]
    };
    const composedClasses = composeClasses(slots, getCheckboxUtilityClass, classes);
    return {
      ...classes,
      // forward the disabled and checked classes to the SwitchBase
      ...composedClasses
    };
  };
  const CheckboxRoot = styled(SwitchBase, {
    shouldForwardProp: (prop) => rootShouldForwardProp(prop) || prop === "classes",
    name: "MuiCheckbox",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.indeterminate && styles2.indeterminate, styles2[`size${capitalize(ownerState.size)}`], ownerState.color !== "default" && styles2[`color${capitalize(ownerState.color)}`]];
    }
  })(memoTheme(({
    theme
  }) => ({
    color: (theme.vars || theme).palette.text.secondary,
    variants: [{
      props: {
        color: "default",
        disableRipple: false
      },
      style: {
        "&:hover": {
          backgroundColor: theme.vars ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity)
        }
      }
    }, ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color2]) => ({
      props: {
        color: color2,
        disableRipple: false
      },
      style: {
        "&:hover": {
          backgroundColor: theme.vars ? `rgba(${theme.vars.palette[color2].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha(theme.palette[color2].main, theme.palette.action.hoverOpacity)
        }
      }
    })), ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color2]) => ({
      props: {
        color: color2
      },
      style: {
        [`&.${checkboxClasses.checked}, &.${checkboxClasses.indeterminate}`]: {
          color: (theme.vars || theme).palette[color2].main
        },
        [`&.${checkboxClasses.disabled}`]: {
          color: (theme.vars || theme).palette.action.disabled
        }
      }
    })), {
      // Should be last to override other colors
      props: {
        disableRipple: false
      },
      style: {
        // Reset on touch devices, it doesn't add specificity
        "&:hover": {
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      }
    }]
  })));
  const defaultCheckedIcon = /* @__PURE__ */ jsxRuntimeExports.jsx(CheckBoxIcon, {});
  const defaultIcon = /* @__PURE__ */ jsxRuntimeExports.jsx(CheckBoxOutlineBlankIcon, {});
  const defaultIndeterminateIcon = /* @__PURE__ */ jsxRuntimeExports.jsx(IndeterminateCheckBoxIcon, {});
  const Checkbox = /* @__PURE__ */ React__namespace.forwardRef(function Checkbox2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiCheckbox"
    });
    const {
      checkedIcon = defaultCheckedIcon,
      color: color2 = "primary",
      icon: iconProp = defaultIcon,
      indeterminate = false,
      indeterminateIcon: indeterminateIconProp = defaultIndeterminateIcon,
      inputProps,
      size = "medium",
      disableRipple = false,
      className,
      ...other
    } = props;
    const icon = indeterminate ? indeterminateIconProp : iconProp;
    const indeterminateIcon = indeterminate ? indeterminateIconProp : checkedIcon;
    const ownerState = {
      ...props,
      disableRipple,
      color: color2,
      indeterminate,
      size
    };
    const classes = useUtilityClasses$9(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxRoot, {
      type: "checkbox",
      inputProps: {
        "data-indeterminate": indeterminate,
        ...inputProps
      },
      icon: /* @__PURE__ */ React__namespace.cloneElement(icon, {
        fontSize: icon.props.fontSize ?? size
      }),
      checkedIcon: /* @__PURE__ */ React__namespace.cloneElement(indeterminateIcon, {
        fontSize: indeterminateIcon.props.fontSize ?? size
      }),
      ownerState,
      ref,
      className: clsx(classes.root, className),
      disableRipple,
      ...other,
      classes
    });
  });
  function isOverflowing(container) {
    const doc = ownerDocument(container);
    if (doc.body === container) {
      return ownerWindow(container).innerWidth > doc.documentElement.clientWidth;
    }
    return container.scrollHeight > container.clientHeight;
  }
  function ariaHidden(element, hide) {
    if (hide) {
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
    const isForbiddenTagName = forbiddenTagNames.includes(element.tagName);
    const isInputHidden = element.tagName === "INPUT" && element.getAttribute("type") === "hidden";
    return isForbiddenTagName || isInputHidden;
  }
  function ariaHiddenSiblings(container, mountElement, currentElement, elementsToExclude, hide) {
    const blacklist = [mountElement, currentElement, ...elementsToExclude];
    [].forEach.call(container.children, (element) => {
      const isNotExcludedElement = !blacklist.includes(element);
      const isNotForbiddenElement = !isAriaHiddenForbiddenOnElement(element);
      if (isNotExcludedElement && isNotForbiddenElement) {
        ariaHidden(element, hide);
      }
    });
  }
  function findIndexOf(items, callback) {
    let idx = -1;
    items.some((item, index2) => {
      if (callback(item)) {
        idx = index2;
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
        const scrollbarSize = getScrollbarSize(ownerWindow(container));
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
      let scrollContainer2;
      if (container.parentNode instanceof DocumentFragment) {
        scrollContainer2 = ownerDocument(container).body;
      } else {
        const parent = container.parentElement;
        const containerWindow = ownerWindow(container);
        scrollContainer2 = (parent == null ? void 0 : parent.nodeName) === "HTML" && containerWindow.getComputedStyle(parent).overflowY === "scroll" ? parent : container;
      }
      restoreStyle.push({
        value: scrollContainer2.style.overflow,
        property: "overflow",
        el: scrollContainer2
      }, {
        value: scrollContainer2.style.overflowX,
        property: "overflow-x",
        el: scrollContainer2
      }, {
        value: scrollContainer2.style.overflowY,
        property: "overflow-y",
        el: scrollContainer2
      });
      scrollContainer2.style.overflow = "hidden";
    }
    const restore = () => {
      restoreStyle.forEach(({
        value,
        el,
        property
      }) => {
        if (value) {
          el.style.setProperty(property, value);
        } else {
          el.style.removeProperty(property);
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
      const containerIndex = findIndexOf(this.containers, (item) => item.modals.includes(modal));
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
      const containerIndex = findIndexOf(this.containers, (item) => item.modals.includes(modal));
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
  function defaultGetTabbable(root) {
    const regularTabNodes = [];
    const orderedTabNodes = [];
    Array.from(root.querySelectorAll(candidatesSelector)).forEach((node2, i) => {
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
    const ignoreNextEnforceFocus = React__namespace.useRef(false);
    const sentinelStart = React__namespace.useRef(null);
    const sentinelEnd = React__namespace.useRef(null);
    const nodeToRestore = React__namespace.useRef(null);
    const reactFocusEventTarget = React__namespace.useRef(null);
    const activated = React__namespace.useRef(false);
    const rootRef = React__namespace.useRef(null);
    const handleRef = useForkRef(getReactElementRef(children), rootRef);
    const lastKeydown = React__namespace.useRef(null);
    React__namespace.useEffect(() => {
      if (!open || !rootRef.current) {
        return;
      }
      activated.current = !disableAutoFocus;
    }, [disableAutoFocus, open]);
    React__namespace.useEffect(() => {
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
    React__namespace.useEffect(() => {
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
        var _a, _b;
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
          const isShiftTab = Boolean(((_a = lastKeydown.current) == null ? void 0 : _a.shiftKey) && ((_b = lastKeydown.current) == null ? void 0 : _b.key) === "Tab");
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(React__namespace.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        tabIndex: open ? 0 : -1,
        onFocus: handleFocusSentinel,
        ref: sentinelStart,
        "data-testid": "sentinelStart"
      }), /* @__PURE__ */ React__namespace.cloneElement(children, {
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
  function getHasTransition(children) {
    return children ? children.props.hasOwnProperty("in") : false;
  }
  const noop$3 = () => {
  };
  const manager = new ModalManager();
  function useModal(parameters) {
    const {
      container,
      disableEscapeKeyDown = false,
      disableScrollLock = false,
      closeAfterTransition = false,
      onTransitionEnter,
      onTransitionExited,
      children,
      onClose,
      open,
      rootRef
    } = parameters;
    const modal = React__namespace.useRef({});
    const mountNodeRef = React__namespace.useRef(null);
    const modalRef = React__namespace.useRef(null);
    const handleRef = useForkRef(modalRef, rootRef);
    const [exited, setExited] = React__namespace.useState(!open);
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
      const resolvedContainer = getContainer(container) || getDoc().body;
      manager.add(getModal(), resolvedContainer);
      if (modalRef.current) {
        handleMounted();
      }
    });
    const isTopModal = () => manager.isTopModal(getModal());
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
    const handleClose = React__namespace.useCallback(() => {
      manager.remove(getModal(), ariaHiddenProp);
    }, [ariaHiddenProp]);
    React__namespace.useEffect(() => {
      return () => {
        handleClose();
      };
    }, [handleClose]);
    React__namespace.useEffect(() => {
      if (open) {
        handleOpen();
      } else if (!hasTransition || !closeAfterTransition) {
        handleClose();
      }
    }, [open, handleClose, hasTransition, closeAfterTransition, handleOpen]);
    const createHandleKeyDown = (otherHandlers) => (event) => {
      var _a;
      (_a = otherHandlers.onKeyDown) == null ? void 0 : _a.call(otherHandlers, event);
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
      var _a;
      (_a = otherHandlers.onClick) == null ? void 0 : _a.call(otherHandlers, event);
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
      const externalEventHandlers = {
        ...propsEventHandlers,
        ...otherHandlers
      };
      return {
        /*
         * Marking an element with the role presentation indicates to assistive technology
         * that this element should be ignored; it exists to support the web application and
         * is not meant for humans to interact with directly.
         * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
         */
        role: "presentation",
        ...externalEventHandlers,
        onKeyDown: createHandleKeyDown(externalEventHandlers),
        ref: handleRef
      };
    };
    const getBackdropProps = (otherHandlers = {}) => {
      const externalEventHandlers = otherHandlers;
      return {
        "aria-hidden": true,
        ...externalEventHandlers,
        onClick: createHandleBackdropClick(externalEventHandlers),
        open
      };
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
        onEnter: createChainedFunction(handleEnter, (children == null ? void 0 : children.props.onEnter) ?? noop$3),
        onExited: createChainedFunction(handleExited, (children == null ? void 0 : children.props.onExited) ?? noop$3)
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
  function getModalUtilityClass(slot) {
    return generateUtilityClass("MuiModal", slot);
  }
  generateUtilityClasses("MuiModal", ["root", "hidden", "backdrop"]);
  const useUtilityClasses$8 = (ownerState) => {
    const {
      open,
      exited,
      classes
    } = ownerState;
    const slots = {
      root: ["root", !open && exited && "hidden"],
      backdrop: ["backdrop"]
    };
    return composeClasses(slots, getModalUtilityClass, classes);
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
  })(memoTheme(({
    theme
  }) => ({
    position: "fixed",
    zIndex: (theme.vars || theme).zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    variants: [{
      props: ({
        ownerState
      }) => !ownerState.open && ownerState.exited,
      style: {
        visibility: "hidden"
      }
    }]
  })));
  const ModalBackdrop = styled(Backdrop, {
    name: "MuiModal",
    slot: "Backdrop",
    overridesResolver: (props, styles2) => {
      return styles2.backdrop;
    }
  })({
    zIndex: -1
  });
  const Modal = /* @__PURE__ */ React__namespace.forwardRef(function Modal2(inProps, ref) {
    const props = useDefaultProps({
      name: "MuiModal",
      props: inProps
    });
    const {
      BackdropComponent = ModalBackdrop,
      BackdropProps,
      classes: classesProp,
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
      onClose,
      onTransitionEnter,
      onTransitionExited,
      open,
      slotProps = {},
      slots = {},
      // eslint-disable-next-line react/prop-types
      theme,
      ...other
    } = props;
    const propsWithDefaults = {
      ...props,
      closeAfterTransition,
      disableAutoFocus,
      disableEnforceFocus,
      disableEscapeKeyDown,
      disablePortal,
      disableRestoreFocus,
      disableScrollLock,
      hideBackdrop,
      keepMounted
    };
    const {
      getRootProps,
      getBackdropProps,
      getTransitionProps: getTransitionProps2,
      portalRef,
      isTopModal,
      exited,
      hasTransition
    } = useModal({
      ...propsWithDefaults,
      rootRef: ref
    });
    const ownerState = {
      ...propsWithDefaults,
      exited
    };
    const classes = useUtilityClasses$8(ownerState);
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
    const externalForwardedProps = {
      ...other,
      slots: {
        root: components.Root,
        backdrop: components.Backdrop,
        ...slots
      },
      slotProps: {
        ...componentsProps,
        ...slotProps
      }
    };
    const [RootSlot, rootProps] = useSlot("root", {
      elementType: ModalRoot,
      externalForwardedProps,
      getSlotProps: getRootProps,
      additionalProps: {
        ref,
        as: component
      },
      ownerState,
      className: clsx(className, classes == null ? void 0 : classes.root, !ownerState.open && ownerState.exited && (classes == null ? void 0 : classes.hidden))
    });
    const [BackdropSlot, backdropProps] = useSlot("backdrop", {
      elementType: BackdropComponent,
      externalForwardedProps,
      additionalProps: BackdropProps,
      getSlotProps: (otherHandlers) => {
        return getBackdropProps({
          ...otherHandlers,
          onClick: (event) => {
            if (onBackdropClick) {
              onBackdropClick(event);
            }
            if (otherHandlers == null ? void 0 : otherHandlers.onClick) {
              otherHandlers.onClick(event);
            }
          }
        });
      },
      className: clsx(BackdropProps == null ? void 0 : BackdropProps.className, classes == null ? void 0 : classes.backdrop),
      ownerState
    });
    const backdropRef = useForkRef(BackdropProps == null ? void 0 : BackdropProps.ref, backdropProps.ref);
    if (!keepMounted && !open && (!hasTransition || exited)) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, {
      ref: portalRef,
      container,
      disablePortal,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(RootSlot, {
        ...rootProps,
        children: [!hideBackdrop && BackdropComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(BackdropSlot, {
          ...backdropProps,
          ref: backdropRef
        }) : null, /* @__PURE__ */ jsxRuntimeExports.jsx(FocusTrap, {
          disableEnforceFocus,
          disableAutoFocus,
          disableRestoreFocus,
          isEnabled: isTopModal,
          open,
          children: /* @__PURE__ */ React__namespace.cloneElement(children, childProps)
        })]
      })
    });
  });
  function getDialogUtilityClass(slot) {
    return generateUtilityClass("MuiDialog", slot);
  }
  const dialogClasses = generateUtilityClasses("MuiDialog", ["root", "scrollPaper", "scrollBody", "container", "paper", "paperScrollPaper", "paperScrollBody", "paperWidthFalse", "paperWidthXs", "paperWidthSm", "paperWidthMd", "paperWidthLg", "paperWidthXl", "paperFullWidth", "paperFullScreen"]);
  const DialogContext = /* @__PURE__ */ React__namespace.createContext({});
  const DialogBackdrop = styled(Backdrop, {
    name: "MuiDialog",
    slot: "Backdrop",
    overrides: (props, styles2) => styles2.backdrop
  })({
    // Improve scrollable dialog support.
    zIndex: -1
  });
  const useUtilityClasses$7 = (ownerState) => {
    const {
      classes,
      scroll: scroll3,
      maxWidth: maxWidth2,
      fullWidth,
      fullScreen
    } = ownerState;
    const slots = {
      root: ["root"],
      container: ["container", `scroll${capitalize(scroll3)}`],
      paper: ["paper", `paperScroll${capitalize(scroll3)}`, `paperWidth${capitalize(String(maxWidth2))}`, fullWidth && "paperFullWidth", fullScreen && "paperFullScreen"]
    };
    return composeClasses(slots, getDialogUtilityClass, classes);
  };
  const DialogRoot = styled(Modal, {
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
      return [styles2.container, styles2[`scroll${capitalize(ownerState.scroll)}`]];
    }
  })({
    height: "100%",
    "@media print": {
      height: "auto"
    },
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    variants: [{
      props: {
        scroll: "paper"
      },
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    }, {
      props: {
        scroll: "body"
      },
      style: {
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
      }
    }]
  });
  const DialogPaper = styled(Paper, {
    name: "MuiDialog",
    slot: "Paper",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.paper, styles2[`scrollPaper${capitalize(ownerState.scroll)}`], styles2[`paperWidth${capitalize(String(ownerState.maxWidth))}`], ownerState.fullWidth && styles2.paperFullWidth, ownerState.fullScreen && styles2.paperFullScreen];
    }
  })(memoTheme(({
    theme
  }) => ({
    margin: 32,
    position: "relative",
    overflowY: "auto",
    "@media print": {
      overflowY: "visible",
      boxShadow: "none"
    },
    variants: [{
      props: {
        scroll: "paper"
      },
      style: {
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100% - 64px)"
      }
    }, {
      props: {
        scroll: "body"
      },
      style: {
        display: "inline-block",
        verticalAlign: "middle",
        textAlign: "initial"
      }
    }, {
      props: ({
        ownerState
      }) => !ownerState.maxWidth,
      style: {
        maxWidth: "calc(100% - 64px)"
      }
    }, {
      props: {
        maxWidth: "xs"
      },
      style: {
        maxWidth: theme.breakpoints.unit === "px" ? Math.max(theme.breakpoints.values.xs, 444) : `max(${theme.breakpoints.values.xs}${theme.breakpoints.unit}, 444px)`,
        [`&.${dialogClasses.paperScrollBody}`]: {
          [theme.breakpoints.down(Math.max(theme.breakpoints.values.xs, 444) + 32 * 2)]: {
            maxWidth: "calc(100% - 64px)"
          }
        }
      }
    }, ...Object.keys(theme.breakpoints.values).filter((maxWidth2) => maxWidth2 !== "xs").map((maxWidth2) => ({
      props: {
        maxWidth: maxWidth2
      },
      style: {
        maxWidth: `${theme.breakpoints.values[maxWidth2]}${theme.breakpoints.unit}`,
        [`&.${dialogClasses.paperScrollBody}`]: {
          [theme.breakpoints.down(theme.breakpoints.values[maxWidth2] + 32 * 2)]: {
            maxWidth: "calc(100% - 64px)"
          }
        }
      }
    })), {
      props: ({
        ownerState
      }) => ownerState.fullWidth,
      style: {
        width: "calc(100% - 64px)"
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.fullScreen,
      style: {
        margin: 0,
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: "none",
        borderRadius: 0,
        [`&.${dialogClasses.paperScrollBody}`]: {
          margin: 0,
          maxWidth: "100%"
        }
      }
    }]
  })));
  const Dialog = /* @__PURE__ */ React__namespace.forwardRef(function Dialog2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiDialog"
    });
    const theme = useTheme();
    const defaultTransitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      "aria-describedby": ariaDescribedby,
      "aria-labelledby": ariaLabelledbyProp,
      "aria-modal": ariaModal = true,
      BackdropComponent,
      BackdropProps,
      children,
      className,
      disableEscapeKeyDown = false,
      fullScreen = false,
      fullWidth = false,
      maxWidth: maxWidth2 = "sm",
      onBackdropClick,
      onClick,
      onClose,
      open,
      PaperComponent = Paper,
      PaperProps = {},
      scroll: scroll3 = "paper",
      TransitionComponent = Fade,
      transitionDuration = defaultTransitionDuration,
      TransitionProps,
      ...other
    } = props;
    const ownerState = {
      ...props,
      disableEscapeKeyDown,
      fullScreen,
      fullWidth,
      maxWidth: maxWidth2,
      scroll: scroll3
    };
    const classes = useUtilityClasses$7(ownerState);
    const backdropClick = React__namespace.useRef();
    const handleMouseDown = (event) => {
      backdropClick.current = event.target === event.currentTarget;
    };
    const handleBackdropClick = (event) => {
      if (onClick) {
        onClick(event);
      }
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
    const dialogContextValue = React__namespace.useMemo(() => {
      return {
        titleId: ariaLabelledby
      };
    }, [ariaLabelledby]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRoot, {
      className: clsx(classes.root, className),
      closeAfterTransition: true,
      components: {
        Backdrop: DialogBackdrop
      },
      componentsProps: {
        backdrop: {
          transitionDuration,
          as: BackdropComponent,
          ...BackdropProps
        }
      },
      disableEscapeKeyDown,
      onClose,
      open,
      ref,
      onClick: handleBackdropClick,
      ownerState,
      ...other,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, {
        appear: true,
        in: open,
        timeout: transitionDuration,
        role: "presentation",
        ...TransitionProps,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContainer, {
          className: clsx(classes.container),
          onMouseDown: handleMouseDown,
          ownerState,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPaper, {
            as: PaperComponent,
            elevation: 24,
            role: "dialog",
            "aria-describedby": ariaDescribedby,
            "aria-labelledby": ariaLabelledby,
            "aria-modal": ariaModal,
            ...PaperProps,
            className: clsx(classes.paper, PaperProps.className),
            ownerState,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContext.Provider, {
              value: dialogContextValue,
              children
            })
          })
        })
      })
    });
  });
  function getDialogActionsUtilityClass(slot) {
    return generateUtilityClass("MuiDialogActions", slot);
  }
  generateUtilityClasses("MuiDialogActions", ["root", "spacing"]);
  const useUtilityClasses$6 = (ownerState) => {
    const {
      classes,
      disableSpacing
    } = ownerState;
    const slots = {
      root: ["root", !disableSpacing && "spacing"]
    };
    return composeClasses(slots, getDialogActionsUtilityClass, classes);
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
  })({
    display: "flex",
    alignItems: "center",
    padding: 8,
    justifyContent: "flex-end",
    flex: "0 0 auto",
    variants: [{
      props: ({
        ownerState
      }) => !ownerState.disableSpacing,
      style: {
        "& > :not(style) ~ :not(style)": {
          marginLeft: 8
        }
      }
    }]
  });
  const DialogActions = /* @__PURE__ */ React__namespace.forwardRef(function DialogActions2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiDialogActions"
    });
    const {
      className,
      disableSpacing = false,
      ...other
    } = props;
    const ownerState = {
      ...props,
      disableSpacing
    };
    const classes = useUtilityClasses$6(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogActionsRoot, {
      className: clsx(classes.root, className),
      ownerState,
      ref,
      ...other
    });
  });
  function getDialogContentUtilityClass(slot) {
    return generateUtilityClass("MuiDialogContent", slot);
  }
  generateUtilityClasses("MuiDialogContent", ["root", "dividers"]);
  const dialogTitleClasses = generateUtilityClasses("MuiDialogTitle", ["root"]);
  const useUtilityClasses$5 = (ownerState) => {
    const {
      classes,
      dividers
    } = ownerState;
    const slots = {
      root: ["root", dividers && "dividers"]
    };
    return composeClasses(slots, getDialogContentUtilityClass, classes);
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
  })(memoTheme(({
    theme
  }) => ({
    flex: "1 1 auto",
    // Add iOS momentum scrolling for iOS < 13.0
    WebkitOverflowScrolling: "touch",
    overflowY: "auto",
    padding: "20px 24px",
    variants: [{
      props: ({
        ownerState
      }) => ownerState.dividers,
      style: {
        padding: "16px 24px",
        borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`
      }
    }, {
      props: ({
        ownerState
      }) => !ownerState.dividers,
      style: {
        [`.${dialogTitleClasses.root} + &`]: {
          paddingTop: 0
        }
      }
    }]
  })));
  const DialogContent = /* @__PURE__ */ React__namespace.forwardRef(function DialogContent2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiDialogContent"
    });
    const {
      className,
      dividers = false,
      ...other
    } = props;
    const ownerState = {
      ...props,
      dividers
    };
    const classes = useUtilityClasses$5(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentRoot, {
      className: clsx(classes.root, className),
      ownerState,
      ref,
      ...other
    });
  });
  function getLinkUtilityClass(slot) {
    return generateUtilityClass("MuiLink", slot);
  }
  const linkClasses = generateUtilityClasses("MuiLink", ["root", "underlineNone", "underlineHover", "underlineAlways", "button", "focusVisible"]);
  const getTextDecoration = ({
    theme,
    ownerState
  }) => {
    const transformedColor = ownerState.color;
    const color2 = getPath(theme, `palette.${transformedColor}`, false) || ownerState.color;
    const channelColor = getPath(theme, `palette.${transformedColor}Channel`);
    if ("vars" in theme && channelColor) {
      return `rgba(${channelColor} / 0.4)`;
    }
    return alpha(color2, 0.4);
  };
  const v6Colors = {
    primary: true,
    secondary: true,
    error: true,
    info: true,
    success: true,
    warning: true,
    textPrimary: true,
    textSecondary: true,
    textDisabled: true
  };
  const useUtilityClasses$4 = (ownerState) => {
    const {
      classes,
      component,
      focusVisible,
      underline
    } = ownerState;
    const slots = {
      root: ["root", `underline${capitalize(underline)}`, component === "button" && "button", focusVisible && "focusVisible"]
    };
    return composeClasses(slots, getLinkUtilityClass, classes);
  };
  const LinkRoot = styled(Typography, {
    name: "MuiLink",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[`underline${capitalize(ownerState.underline)}`], ownerState.component === "button" && styles2.button];
    }
  })(memoTheme(({
    theme
  }) => {
    return {
      variants: [{
        props: {
          underline: "none"
        },
        style: {
          textDecoration: "none"
        }
      }, {
        props: {
          underline: "hover"
        },
        style: {
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline"
          }
        }
      }, {
        props: {
          underline: "always"
        },
        style: {
          textDecoration: "underline",
          "&:hover": {
            textDecorationColor: "inherit"
          }
        }
      }, {
        props: ({
          underline,
          ownerState
        }) => underline === "always" && ownerState.color !== "inherit",
        style: {
          textDecorationColor: "var(--Link-underlineColor)"
        }
      }, ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color2]) => ({
        props: {
          underline: "always",
          color: color2
        },
        style: {
          "--Link-underlineColor": theme.vars ? `rgba(${theme.vars.palette[color2].mainChannel} / 0.4)` : alpha(theme.palette[color2].main, 0.4)
        }
      })), {
        props: {
          underline: "always",
          color: "textPrimary"
        },
        style: {
          "--Link-underlineColor": theme.vars ? `rgba(${theme.vars.palette.text.primaryChannel} / 0.4)` : alpha(theme.palette.text.primary, 0.4)
        }
      }, {
        props: {
          underline: "always",
          color: "textSecondary"
        },
        style: {
          "--Link-underlineColor": theme.vars ? `rgba(${theme.vars.palette.text.secondaryChannel} / 0.4)` : alpha(theme.palette.text.secondary, 0.4)
        }
      }, {
        props: {
          underline: "always",
          color: "textDisabled"
        },
        style: {
          "--Link-underlineColor": (theme.vars || theme).palette.text.disabled
        }
      }, {
        props: {
          component: "button"
        },
        style: {
          position: "relative",
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
          "&::-moz-focus-inner": {
            borderStyle: "none"
            // Remove Firefox dotted outline.
          },
          [`&.${linkClasses.focusVisible}`]: {
            outline: "auto"
          }
        }
      }]
    };
  }));
  const Link = /* @__PURE__ */ React__namespace.forwardRef(function Link2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiLink"
    });
    const theme = useTheme();
    const {
      className,
      color: color2 = "primary",
      component = "a",
      onBlur,
      onFocus,
      TypographyClasses,
      underline = "always",
      variant = "inherit",
      sx,
      ...other
    } = props;
    const [focusVisible, setFocusVisible] = React__namespace.useState(false);
    const handleBlur = (event) => {
      if (!isFocusVisible(event.target)) {
        setFocusVisible(false);
      }
      if (onBlur) {
        onBlur(event);
      }
    };
    const handleFocus = (event) => {
      if (isFocusVisible(event.target)) {
        setFocusVisible(true);
      }
      if (onFocus) {
        onFocus(event);
      }
    };
    const ownerState = {
      ...props,
      color: color2,
      component,
      focusVisible,
      underline,
      variant
    };
    const classes = useUtilityClasses$4(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LinkRoot, {
      color: color2,
      className: clsx(classes.root, className),
      classes: TypographyClasses,
      component,
      onBlur: handleBlur,
      onFocus: handleFocus,
      ref,
      ownerState,
      variant,
      ...other,
      sx: [...v6Colors[color2] === void 0 ? [{
        color: color2
      }] : [], ...Array.isArray(sx) ? sx : [sx]],
      style: {
        ...other.style,
        ...underline === "always" && color2 !== "inherit" && !v6Colors[color2] && {
          "--Link-underlineColor": getTextDecoration({
            theme,
            ownerState
          })
        }
      }
    });
  });
  const ListContext = /* @__PURE__ */ React__namespace.createContext({});
  function getListUtilityClass(slot) {
    return generateUtilityClass("MuiList", slot);
  }
  generateUtilityClasses("MuiList", ["root", "padding", "dense", "subheader"]);
  const useUtilityClasses$3 = (ownerState) => {
    const {
      classes,
      disablePadding,
      dense,
      subheader
    } = ownerState;
    const slots = {
      root: ["root", !disablePadding && "padding", dense && "dense", subheader && "subheader"]
    };
    return composeClasses(slots, getListUtilityClass, classes);
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
  })({
    listStyle: "none",
    margin: 0,
    padding: 0,
    position: "relative",
    variants: [{
      props: ({
        ownerState
      }) => !ownerState.disablePadding,
      style: {
        paddingTop: 8,
        paddingBottom: 8
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.subheader,
      style: {
        paddingTop: 0
      }
    }]
  });
  const List = /* @__PURE__ */ React__namespace.forwardRef(function List2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiList"
    });
    const {
      children,
      className,
      component = "ul",
      dense = false,
      disablePadding = false,
      subheader,
      ...other
    } = props;
    const context = React__namespace.useMemo(() => ({
      dense
    }), [dense]);
    const ownerState = {
      ...props,
      component,
      dense,
      disablePadding
    };
    const classes = useUtilityClasses$3(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ListContext.Provider, {
      value: context,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ListRoot, {
        as: component,
        className: clsx(classes.root, className),
        ref,
        ownerState,
        ...other,
        children: [subheader, children]
      })
    });
  });
  function getListItemUtilityClass(slot) {
    return generateUtilityClass("MuiListItem", slot);
  }
  generateUtilityClasses("MuiListItem", ["root", "container", "dense", "alignItemsFlexStart", "divider", "gutters", "padding", "secondaryAction"]);
  const listItemButtonClasses = generateUtilityClasses("MuiListItemButton", ["root", "focusVisible", "dense", "alignItemsFlexStart", "disabled", "divider", "gutters", "selected"]);
  function getListItemSecondaryActionClassesUtilityClass(slot) {
    return generateUtilityClass("MuiListItemSecondaryAction", slot);
  }
  generateUtilityClasses("MuiListItemSecondaryAction", ["root", "disableGutters"]);
  const useUtilityClasses$2 = (ownerState) => {
    const {
      disableGutters,
      classes
    } = ownerState;
    const slots = {
      root: ["root", disableGutters && "disableGutters"]
    };
    return composeClasses(slots, getListItemSecondaryActionClassesUtilityClass, classes);
  };
  const ListItemSecondaryActionRoot = styled("div", {
    name: "MuiListItemSecondaryAction",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.disableGutters && styles2.disableGutters];
    }
  })({
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    variants: [{
      props: ({
        ownerState
      }) => ownerState.disableGutters,
      style: {
        right: 0
      }
    }]
  });
  const ListItemSecondaryAction = /* @__PURE__ */ React__namespace.forwardRef(function ListItemSecondaryAction2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiListItemSecondaryAction"
    });
    const {
      className,
      ...other
    } = props;
    const context = React__namespace.useContext(ListContext);
    const ownerState = {
      ...props,
      disableGutters: context.disableGutters
    };
    const classes = useUtilityClasses$2(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ListItemSecondaryActionRoot, {
      className: clsx(classes.root, className),
      ownerState,
      ref,
      ...other
    });
  });
  ListItemSecondaryAction.muiName = "ListItemSecondaryAction";
  const overridesResolver = (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, ownerState.dense && styles2.dense, ownerState.alignItems === "flex-start" && styles2.alignItemsFlexStart, ownerState.divider && styles2.divider, !ownerState.disableGutters && styles2.gutters, !ownerState.disablePadding && styles2.padding, ownerState.hasSecondaryAction && styles2.secondaryAction];
  };
  const useUtilityClasses$1 = (ownerState) => {
    const {
      alignItems,
      classes,
      dense,
      disableGutters,
      disablePadding,
      divider,
      hasSecondaryAction
    } = ownerState;
    const slots = {
      root: ["root", dense && "dense", !disableGutters && "gutters", !disablePadding && "padding", divider && "divider", alignItems === "flex-start" && "alignItemsFlexStart", hasSecondaryAction && "secondaryAction"],
      container: ["container"]
    };
    return composeClasses(slots, getListItemUtilityClass, classes);
  };
  const ListItemRoot = styled("div", {
    name: "MuiListItem",
    slot: "Root",
    overridesResolver
  })(memoTheme(({
    theme
  }) => ({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    textDecoration: "none",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "left",
    variants: [{
      props: ({
        ownerState
      }) => !ownerState.disablePadding,
      style: {
        paddingTop: 8,
        paddingBottom: 8
      }
    }, {
      props: ({
        ownerState
      }) => !ownerState.disablePadding && ownerState.dense,
      style: {
        paddingTop: 4,
        paddingBottom: 4
      }
    }, {
      props: ({
        ownerState
      }) => !ownerState.disablePadding && !ownerState.disableGutters,
      style: {
        paddingLeft: 16,
        paddingRight: 16
      }
    }, {
      props: ({
        ownerState
      }) => !ownerState.disablePadding && !!ownerState.secondaryAction,
      style: {
        // Add some space to avoid collision as `ListItemSecondaryAction`
        // is absolutely positioned.
        paddingRight: 48
      }
    }, {
      props: ({
        ownerState
      }) => !!ownerState.secondaryAction,
      style: {
        [`& > .${listItemButtonClasses.root}`]: {
          paddingRight: 48
        }
      }
    }, {
      props: {
        alignItems: "flex-start"
      },
      style: {
        alignItems: "flex-start"
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.divider,
      style: {
        borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundClip: "padding-box"
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.button,
      style: {
        transition: theme.transitions.create("background-color", {
          duration: theme.transitions.duration.shortest
        }),
        "&:hover": {
          textDecoration: "none",
          backgroundColor: (theme.vars || theme).palette.action.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.hasSecondaryAction,
      style: {
        // Add some space to avoid collision as `ListItemSecondaryAction`
        // is absolutely positioned.
        paddingRight: 48
      }
    }]
  })));
  const ListItemContainer = styled("li", {
    name: "MuiListItem",
    slot: "Container",
    overridesResolver: (props, styles2) => styles2.container
  })({
    position: "relative"
  });
  const ListItem = /* @__PURE__ */ React__namespace.forwardRef(function ListItem2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiListItem"
    });
    const {
      alignItems = "center",
      children: childrenProp,
      className,
      component: componentProp,
      components = {},
      componentsProps = {},
      ContainerComponent = "li",
      ContainerProps: {
        className: ContainerClassName,
        ...ContainerProps
      } = {},
      dense = false,
      disableGutters = false,
      disablePadding = false,
      divider = false,
      secondaryAction,
      slotProps = {},
      slots = {},
      ...other
    } = props;
    const context = React__namespace.useContext(ListContext);
    const childContext = React__namespace.useMemo(() => ({
      dense: dense || context.dense || false,
      alignItems,
      disableGutters
    }), [alignItems, context.dense, dense, disableGutters]);
    const listItemRef = React__namespace.useRef(null);
    const children = React__namespace.Children.toArray(childrenProp);
    const hasSecondaryAction = children.length && isMuiElement(children[children.length - 1], ["ListItemSecondaryAction"]);
    const ownerState = {
      ...props,
      alignItems,
      dense: childContext.dense,
      disableGutters,
      disablePadding,
      divider,
      hasSecondaryAction
    };
    const classes = useUtilityClasses$1(ownerState);
    const handleRef = useForkRef(listItemRef, ref);
    const Root = slots.root || components.Root || ListItemRoot;
    const rootProps = slotProps.root || componentsProps.root || {};
    const componentProps = {
      className: clsx(classes.root, rootProps.className, className),
      ...other
    };
    let Component = componentProp || "li";
    if (hasSecondaryAction) {
      Component = !componentProps.component && !componentProp ? "div" : Component;
      if (ContainerComponent === "li") {
        if (Component === "li") {
          Component = "div";
        } else if (componentProps.component === "li") {
          componentProps.component = "div";
        }
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ListContext.Provider, {
        value: childContext,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ListItemContainer, {
          as: ContainerComponent,
          className: clsx(classes.container, ContainerClassName),
          ref: handleRef,
          ownerState,
          ...ContainerProps,
          children: [/* @__PURE__ */ jsxRuntimeExports.jsx(Root, {
            ...rootProps,
            ...!isHostComponent(Root) && {
              as: Component,
              ownerState: {
                ...ownerState,
                ...rootProps.ownerState
              }
            },
            ...componentProps,
            children
          }), children.pop()]
        })
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ListContext.Provider, {
      value: childContext,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Root, {
        ...rootProps,
        as: Component,
        ref: handleRef,
        ...!isHostComponent(Root) && {
          ownerState: {
            ...ownerState,
            ...rootProps.ownerState
          }
        },
        ...componentProps,
        children: [children, secondaryAction && /* @__PURE__ */ jsxRuntimeExports.jsx(ListItemSecondaryAction, {
          children: secondaryAction
        })]
      })
    });
  });
  function getListItemTextUtilityClass(slot) {
    return generateUtilityClass("MuiListItemText", slot);
  }
  const listItemTextClasses = generateUtilityClasses("MuiListItemText", ["root", "multiline", "dense", "inset", "primary", "secondary"]);
  const useUtilityClasses = (ownerState) => {
    const {
      classes,
      inset,
      primary,
      secondary,
      dense
    } = ownerState;
    const slots = {
      root: ["root", inset && "inset", dense && "dense", primary && secondary && "multiline"],
      primary: ["primary"],
      secondary: ["secondary"]
    };
    return composeClasses(slots, getListItemTextUtilityClass, classes);
  };
  const ListItemTextRoot = styled("div", {
    name: "MuiListItemText",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [{
        [`& .${listItemTextClasses.primary}`]: styles2.primary
      }, {
        [`& .${listItemTextClasses.secondary}`]: styles2.secondary
      }, styles2.root, ownerState.inset && styles2.inset, ownerState.primary && ownerState.secondary && styles2.multiline, ownerState.dense && styles2.dense];
    }
  })({
    flex: "1 1 auto",
    minWidth: 0,
    marginTop: 4,
    marginBottom: 4,
    [`.${typographyClasses.root}:where(& .${listItemTextClasses.primary})`]: {
      display: "block"
    },
    [`.${typographyClasses.root}:where(& .${listItemTextClasses.secondary})`]: {
      display: "block"
    },
    variants: [{
      props: ({
        ownerState
      }) => ownerState.primary && ownerState.secondary,
      style: {
        marginTop: 6,
        marginBottom: 6
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.inset,
      style: {
        paddingLeft: 56
      }
    }]
  });
  const ListItemText = /* @__PURE__ */ React__namespace.forwardRef(function ListItemText2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiListItemText"
    });
    const {
      children,
      className,
      disableTypography = false,
      inset = false,
      primary: primaryProp,
      primaryTypographyProps,
      secondary: secondaryProp,
      secondaryTypographyProps,
      slots = {},
      slotProps = {},
      ...other
    } = props;
    const {
      dense
    } = React__namespace.useContext(ListContext);
    let primary = primaryProp != null ? primaryProp : children;
    let secondary = secondaryProp;
    const ownerState = {
      ...props,
      disableTypography,
      inset,
      primary: !!primary,
      secondary: !!secondary,
      dense
    };
    const classes = useUtilityClasses(ownerState);
    const externalForwardedProps = {
      slots,
      slotProps: {
        primary: primaryTypographyProps,
        secondary: secondaryTypographyProps,
        ...slotProps
      }
    };
    const [PrimarySlot, primarySlotProps] = useSlot("primary", {
      className: classes.primary,
      elementType: Typography,
      externalForwardedProps,
      ownerState
    });
    const [SecondarySlot, secondarySlotProps] = useSlot("secondary", {
      className: classes.secondary,
      elementType: Typography,
      externalForwardedProps,
      ownerState
    });
    if (primary != null && primary.type !== Typography && !disableTypography) {
      primary = /* @__PURE__ */ jsxRuntimeExports.jsx(PrimarySlot, {
        variant: dense ? "body2" : "body1",
        component: (primarySlotProps == null ? void 0 : primarySlotProps.variant) ? void 0 : "span",
        ...primarySlotProps,
        children: primary
      });
    }
    if (secondary != null && secondary.type !== Typography && !disableTypography) {
      secondary = /* @__PURE__ */ jsxRuntimeExports.jsx(SecondarySlot, {
        variant: "body2",
        color: "textSecondary",
        ...secondarySlotProps,
        children: secondary
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ListItemTextRoot, {
      className: clsx(classes.root, className),
      ownerState,
      ref,
      ...other,
      children: [primary, secondary]
    });
  });
  let keyCount = 0;
  function atom(read, write) {
    const key = `atom${++keyCount}`;
    const config2 = {
      toString() {
        return key;
      }
    };
    if (typeof read === "function") {
      config2.read = read;
    } else {
      config2.init = read;
      config2.read = defaultRead;
      config2.write = defaultWrite;
    }
    if (write) {
      config2.write = write;
    }
    return config2;
  }
  function defaultRead(get2) {
    return get2(this);
  }
  function defaultWrite(get2, set, arg2) {
    return set(
      this,
      typeof arg2 === "function" ? arg2(get2(this)) : arg2
    );
  }
  const isSelfAtom = (atom2, a) => atom2.unstable_is ? atom2.unstable_is(a) : a === atom2;
  const hasInitialValue = (atom2) => "init" in atom2;
  const isActuallyWritableAtom = (atom2) => !!atom2.write;
  const cancelablePromiseMap = /* @__PURE__ */ new WeakMap();
  const isPendingPromise = (value) => {
    var _a;
    return isPromiseLike$2(value) && !((_a = cancelablePromiseMap.get(value)) == null ? void 0 : _a[1]);
  };
  const cancelPromise = (promise, nextValue) => {
    const promiseState = cancelablePromiseMap.get(promise);
    if (promiseState) {
      promiseState[1] = true;
      promiseState[0].forEach((fn) => fn(nextValue));
    }
  };
  const patchPromiseForCancelability = (promise) => {
    if (cancelablePromiseMap.has(promise)) {
      return;
    }
    const promiseState = [/* @__PURE__ */ new Set(), false];
    cancelablePromiseMap.set(promise, promiseState);
    const settle = () => {
      promiseState[1] = true;
    };
    promise.then(settle, settle);
    promise.onCancel = (fn) => {
      promiseState[0].add(fn);
    };
  };
  const isPromiseLike$2 = (x) => typeof (x == null ? void 0 : x.then) === "function";
  const isAtomStateInitialized = (atomState) => "v" in atomState || "e" in atomState;
  const returnAtomValue = (atomState) => {
    if ("e" in atomState) {
      throw atomState.e;
    }
    return atomState.v;
  };
  const addPendingPromiseToDependency = (atom2, promise, dependencyAtomState) => {
    if (!dependencyAtomState.p.has(atom2)) {
      dependencyAtomState.p.add(atom2);
      promise.then(
        () => {
          dependencyAtomState.p.delete(atom2);
        },
        () => {
          dependencyAtomState.p.delete(atom2);
        }
      );
    }
  };
  const addDependency = (batch2, atom2, atomState, a, aState) => {
    var _a;
    atomState.d.set(a, aState.n);
    if (isPendingPromise(atomState.v)) {
      addPendingPromiseToDependency(atom2, atomState.v, aState);
    }
    (_a = aState.m) == null ? void 0 : _a.t.add(atom2);
    if (batch2) {
      addBatchAtomDependent(batch2, a, atom2);
    }
  };
  const createBatch = () => ({
    D: /* @__PURE__ */ new Map(),
    H: /* @__PURE__ */ new Set(),
    M: /* @__PURE__ */ new Set(),
    L: /* @__PURE__ */ new Set()
  });
  const addBatchFunc = (batch2, priority, fn) => {
    batch2[priority].add(fn);
  };
  const registerBatchAtom = (batch2, atom2, atomState) => {
    if (!batch2.D.has(atom2)) {
      batch2.D.set(atom2, /* @__PURE__ */ new Set());
      addBatchFunc(batch2, "M", () => {
        var _a;
        (_a = atomState.m) == null ? void 0 : _a.l.forEach((listener) => addBatchFunc(batch2, "M", listener));
      });
    }
  };
  const addBatchAtomDependent = (batch2, atom2, dependent) => {
    const dependents = batch2.D.get(atom2);
    if (dependents) {
      dependents.add(dependent);
    }
  };
  const getBatchAtomDependents = (batch2, atom2) => batch2.D.get(atom2);
  const flushBatch = (batch2) => {
    let error;
    let hasError = false;
    const call = (fn) => {
      try {
        fn();
      } catch (e2) {
        if (!hasError) {
          error = e2;
          hasError = true;
        }
      }
    };
    while (batch2.H.size || batch2.M.size || batch2.L.size) {
      batch2.D.clear();
      batch2.H.forEach(call);
      batch2.H.clear();
      batch2.M.forEach(call);
      batch2.M.clear();
      batch2.L.forEach(call);
      batch2.L.clear();
    }
    if (hasError) {
      throw error;
    }
  };
  const buildStore = (...[getAtomState, atomRead, atomWrite, atomOnMount]) => {
    const setAtomStateValueOrPromise = (atom2, atomState, valueOrPromise) => {
      const hasPrevValue = "v" in atomState;
      const prevValue = atomState.v;
      const pendingPromise = isPendingPromise(atomState.v) ? atomState.v : null;
      if (isPromiseLike$2(valueOrPromise)) {
        patchPromiseForCancelability(valueOrPromise);
        for (const a of atomState.d.keys()) {
          addPendingPromiseToDependency(atom2, valueOrPromise, getAtomState(a));
        }
        atomState.v = valueOrPromise;
      } else {
        atomState.v = valueOrPromise;
      }
      delete atomState.e;
      delete atomState.x;
      if (!hasPrevValue || !Object.is(prevValue, atomState.v)) {
        ++atomState.n;
        if (pendingPromise) {
          cancelPromise(pendingPromise, valueOrPromise);
        }
      }
    };
    const readAtomState = (batch2, atom2) => {
      var _a;
      const atomState = getAtomState(atom2);
      if (isAtomStateInitialized(atomState)) {
        if (atomState.m && !atomState.x) {
          return atomState;
        }
        if (Array.from(atomState.d).every(
          ([a, n2]) => (
            // Recursively, read the atom state of the dependency, and
            // check if the atom epoch number is unchanged
            readAtomState(batch2, a).n === n2
          )
        )) {
          return atomState;
        }
      }
      atomState.d.clear();
      let isSync = true;
      const getter = (a) => {
        if (isSelfAtom(atom2, a)) {
          const aState2 = getAtomState(a);
          if (!isAtomStateInitialized(aState2)) {
            if (hasInitialValue(a)) {
              setAtomStateValueOrPromise(a, aState2, a.init);
            } else {
              throw new Error("no atom init");
            }
          }
          return returnAtomValue(aState2);
        }
        const aState = readAtomState(batch2, a);
        try {
          return returnAtomValue(aState);
        } finally {
          if (isSync) {
            addDependency(batch2, atom2, atomState, a, aState);
          } else {
            const batch22 = createBatch();
            addDependency(batch22, atom2, atomState, a, aState);
            mountDependencies(batch22, atom2, atomState);
            flushBatch(batch22);
          }
        }
      };
      let controller;
      let setSelf;
      const options = {
        get signal() {
          if (!controller) {
            controller = new AbortController();
          }
          return controller.signal;
        },
        get setSelf() {
          if (!setSelf && isActuallyWritableAtom(atom2)) {
            setSelf = (...args) => {
              if (!isSync) {
                return writeAtom(atom2, ...args);
              }
            };
          }
          return setSelf;
        }
      };
      try {
        const valueOrPromise = atomRead(atom2, getter, options);
        setAtomStateValueOrPromise(atom2, atomState, valueOrPromise);
        if (isPromiseLike$2(valueOrPromise)) {
          (_a = valueOrPromise.onCancel) == null ? void 0 : _a.call(valueOrPromise, () => controller == null ? void 0 : controller.abort());
          const complete = () => {
            if (atomState.m) {
              const batch22 = createBatch();
              mountDependencies(batch22, atom2, atomState);
              flushBatch(batch22);
            }
          };
          valueOrPromise.then(complete, complete);
        }
        return atomState;
      } catch (error) {
        delete atomState.v;
        atomState.e = error;
        delete atomState.x;
        ++atomState.n;
        return atomState;
      } finally {
        isSync = false;
      }
    };
    const readAtom = (atom2) => returnAtomValue(readAtomState(void 0, atom2));
    const getMountedOrBatchDependents = (batch2, atom2, atomState) => {
      var _a, _b;
      const dependents = /* @__PURE__ */ new Map();
      for (const a of ((_a = atomState.m) == null ? void 0 : _a.t) || []) {
        const aState = getAtomState(a);
        if (aState.m) {
          dependents.set(a, aState);
        }
      }
      for (const atomWithPendingPromise of atomState.p) {
        dependents.set(
          atomWithPendingPromise,
          getAtomState(atomWithPendingPromise)
        );
      }
      (_b = getBatchAtomDependents(batch2, atom2)) == null ? void 0 : _b.forEach((dependent) => {
        dependents.set(dependent, getAtomState(dependent));
      });
      return dependents;
    };
    const recomputeDependents = (batch2, atom2, atomState) => {
      const topSortedReversed = [];
      const visiting = /* @__PURE__ */ new Set();
      const visited = /* @__PURE__ */ new Set();
      const stack = [[atom2, atomState]];
      while (stack.length > 0) {
        const [a, aState] = stack[stack.length - 1];
        if (visited.has(a)) {
          stack.pop();
          continue;
        }
        if (visiting.has(a)) {
          topSortedReversed.push([a, aState, aState.n]);
          visited.add(a);
          aState.x = true;
          stack.pop();
          continue;
        }
        visiting.add(a);
        for (const [d2, s] of getMountedOrBatchDependents(batch2, a, aState)) {
          if (a !== d2 && !visiting.has(d2)) {
            stack.push([d2, s]);
          }
        }
      }
      addBatchFunc(batch2, "H", () => {
        const changedAtoms = /* @__PURE__ */ new Set([atom2]);
        for (let i = topSortedReversed.length - 1; i >= 0; --i) {
          const [a, aState, prevEpochNumber] = topSortedReversed[i];
          let hasChangedDeps = false;
          for (const dep of aState.d.keys()) {
            if (dep !== a && changedAtoms.has(dep)) {
              hasChangedDeps = true;
              break;
            }
          }
          if (hasChangedDeps) {
            readAtomState(batch2, a);
            mountDependencies(batch2, a, aState);
            if (prevEpochNumber !== aState.n) {
              registerBatchAtom(batch2, a, aState);
              changedAtoms.add(a);
            }
          }
          delete aState.x;
        }
      });
    };
    const writeAtomState = (batch2, atom2, ...args) => {
      let isSync = true;
      const getter = (a) => returnAtomValue(readAtomState(batch2, a));
      const setter = (a, ...args2) => {
        const aState = getAtomState(a);
        try {
          if (isSelfAtom(atom2, a)) {
            if (!hasInitialValue(a)) {
              throw new Error("atom not writable");
            }
            const prevEpochNumber = aState.n;
            const v2 = args2[0];
            setAtomStateValueOrPromise(a, aState, v2);
            mountDependencies(batch2, a, aState);
            if (prevEpochNumber !== aState.n) {
              registerBatchAtom(batch2, a, aState);
              recomputeDependents(batch2, a, aState);
            }
            return void 0;
          } else {
            return writeAtomState(batch2, a, ...args2);
          }
        } finally {
          if (!isSync) {
            flushBatch(batch2);
          }
        }
      };
      try {
        return atomWrite(atom2, getter, setter, ...args);
      } finally {
        isSync = false;
      }
    };
    const writeAtom = (atom2, ...args) => {
      const batch2 = createBatch();
      try {
        return writeAtomState(batch2, atom2, ...args);
      } finally {
        flushBatch(batch2);
      }
    };
    const mountDependencies = (batch2, atom2, atomState) => {
      if (atomState.m && !isPendingPromise(atomState.v)) {
        for (const a of atomState.d.keys()) {
          if (!atomState.m.d.has(a)) {
            const aMounted = mountAtom(batch2, a, getAtomState(a));
            aMounted.t.add(atom2);
            atomState.m.d.add(a);
          }
        }
        for (const a of atomState.m.d || []) {
          if (!atomState.d.has(a)) {
            atomState.m.d.delete(a);
            const aMounted = unmountAtom(batch2, a, getAtomState(a));
            aMounted == null ? void 0 : aMounted.t.delete(atom2);
          }
        }
      }
    };
    const mountAtom = (batch2, atom2, atomState) => {
      if (!atomState.m) {
        readAtomState(batch2, atom2);
        for (const a of atomState.d.keys()) {
          const aMounted = mountAtom(batch2, a, getAtomState(a));
          aMounted.t.add(atom2);
        }
        atomState.m = {
          l: /* @__PURE__ */ new Set(),
          d: new Set(atomState.d.keys()),
          t: /* @__PURE__ */ new Set()
        };
        if (isActuallyWritableAtom(atom2)) {
          const mounted = atomState.m;
          let setAtom;
          const createInvocationContext = (batch22, fn) => {
            let isSync = true;
            setAtom = (...args) => {
              try {
                return writeAtomState(batch22, atom2, ...args);
              } finally {
                if (!isSync) {
                  flushBatch(batch22);
                }
              }
            };
            try {
              return fn();
            } finally {
              isSync = false;
            }
          };
          addBatchFunc(batch2, "L", () => {
            const onUnmount = createInvocationContext(
              batch2,
              () => atomOnMount(atom2, (...args) => setAtom(...args))
            );
            if (onUnmount) {
              mounted.u = (batch22) => createInvocationContext(batch22, onUnmount);
            }
          });
        }
      }
      return atomState.m;
    };
    const unmountAtom = (batch2, atom2, atomState) => {
      if (atomState.m && !atomState.m.l.size && !Array.from(atomState.m.t).some((a) => {
        var _a;
        return (_a = getAtomState(a).m) == null ? void 0 : _a.d.has(atom2);
      })) {
        const onUnmount = atomState.m.u;
        if (onUnmount) {
          addBatchFunc(batch2, "L", () => onUnmount(batch2));
        }
        delete atomState.m;
        for (const a of atomState.d.keys()) {
          const aMounted = unmountAtom(batch2, a, getAtomState(a));
          aMounted == null ? void 0 : aMounted.t.delete(atom2);
        }
        return void 0;
      }
      return atomState.m;
    };
    const subscribeAtom = (atom2, listener) => {
      const batch2 = createBatch();
      const atomState = getAtomState(atom2);
      const mounted = mountAtom(batch2, atom2, atomState);
      const listeners = mounted.l;
      listeners.add(listener);
      flushBatch(batch2);
      return () => {
        listeners.delete(listener);
        const batch22 = createBatch();
        unmountAtom(batch22, atom2, atomState);
        flushBatch(batch22);
      };
    };
    const unstable_derive = (fn) => buildStore(...fn(getAtomState, atomRead, atomWrite, atomOnMount));
    const store = {
      get: readAtom,
      set: writeAtom,
      sub: subscribeAtom,
      unstable_derive
    };
    return store;
  };
  const createStore$2 = () => {
    const atomStateMap = /* @__PURE__ */ new WeakMap();
    const getAtomState = (atom2) => {
      let atomState = atomStateMap.get(atom2);
      if (!atomState) {
        atomState = { d: /* @__PURE__ */ new Map(), p: /* @__PURE__ */ new Set(), n: 0 };
        atomStateMap.set(atom2, atomState);
      }
      return atomState;
    };
    const store = buildStore(
      getAtomState,
      (atom2, ...params) => atom2.read(...params),
      (atom2, ...params) => atom2.write(...params),
      (atom2, ...params) => {
        var _a;
        return (_a = atom2.onMount) == null ? void 0 : _a.call(atom2, ...params);
      }
    );
    return store;
  };
  let defaultStore;
  const getDefaultStore = () => {
    if (!defaultStore) {
      defaultStore = createStore$2();
    }
    return defaultStore;
  };
  const StoreContext$1 = React.createContext(
    void 0
  );
  const useStore = (options) => {
    const store = React.useContext(StoreContext$1);
    return store || getDefaultStore();
  };
  const isPromiseLike$1 = (x) => typeof (x == null ? void 0 : x.then) === "function";
  const attachPromiseMeta = (promise) => {
    promise.status = "pending";
    promise.then(
      (v2) => {
        promise.status = "fulfilled";
        promise.value = v2;
      },
      (e2) => {
        promise.status = "rejected";
        promise.reason = e2;
      }
    );
  };
  const use = React.use || ((promise) => {
    if (promise.status === "pending") {
      throw promise;
    } else if (promise.status === "fulfilled") {
      return promise.value;
    } else if (promise.status === "rejected") {
      throw promise.reason;
    } else {
      attachPromiseMeta(promise);
      throw promise;
    }
  });
  const continuablePromiseMap = /* @__PURE__ */ new WeakMap();
  const createContinuablePromise = (promise) => {
    let continuablePromise = continuablePromiseMap.get(promise);
    if (!continuablePromise) {
      continuablePromise = new Promise((resolve, reject) => {
        let curr = promise;
        const onFulfilled = (me) => (v2) => {
          if (curr === me) {
            resolve(v2);
          }
        };
        const onRejected = (me) => (e2) => {
          if (curr === me) {
            reject(e2);
          }
        };
        const registerCancelHandler = (p2) => {
          if ("onCancel" in p2 && typeof p2.onCancel === "function") {
            p2.onCancel((nextValue) => {
              if (isPromiseLike$1(nextValue)) {
                continuablePromiseMap.set(nextValue, continuablePromise);
                curr = nextValue;
                nextValue.then(onFulfilled(nextValue), onRejected(nextValue));
                registerCancelHandler(nextValue);
              } else {
                resolve(nextValue);
              }
            });
          }
        };
        promise.then(onFulfilled(promise), onRejected(promise));
        registerCancelHandler(promise);
      });
      continuablePromiseMap.set(promise, continuablePromise);
    }
    return continuablePromise;
  };
  function useAtomValue(atom2, options) {
    const store = useStore();
    const [[valueFromReducer, storeFromReducer, atomFromReducer], rerender] = React.useReducer(
      (prev2) => {
        const nextValue = store.get(atom2);
        if (Object.is(prev2[0], nextValue) && prev2[1] === store && prev2[2] === atom2) {
          return prev2;
        }
        return [nextValue, store, atom2];
      },
      void 0,
      () => [store.get(atom2), store, atom2]
    );
    let value = valueFromReducer;
    if (storeFromReducer !== store || atomFromReducer !== atom2) {
      rerender();
      value = store.get(atom2);
    }
    const delay = void 0;
    React.useEffect(() => {
      const unsub = store.sub(atom2, () => {
        rerender();
      });
      rerender();
      return unsub;
    }, [store, atom2, delay]);
    React.useDebugValue(value);
    if (isPromiseLike$1(value)) {
      const promise = createContinuablePromise(value);
      return use(promise);
    }
    return value;
  }
  function useSetAtom(atom2, options) {
    const store = useStore();
    const setAtom = React.useCallback(
      (...args) => {
        return store.set(atom2, ...args);
      },
      [store, atom2]
    );
    return setAtom;
  }
  const initialState = {
    openState: false
  };
  const stateAtom = atom(initialState, async (get2, set, data) => {
    let state = get2(stateAtom);
    set(stateAtom, { ...state, ...data });
  });
  const useAppDialogAtom = () => {
    const setData = useSetAtom(stateAtom);
    const openAppDialog = () => {
      setData({ openState: true });
    };
    const closeAppDialog = () => {
      setData({ openState: false });
    };
    return { ...useAtomValue(stateAtom), openAppDialog, closeAppDialog };
  };
  function AppButton() {
    const { openAppDialog } = useAppDialogAtom();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        sx: {
          color: "#32c6c6",
          textTransform: "none"
        },
        onClick: openAppDialog,
        children: "用 Bahamut Sticker Master 調整貼圖順序"
      }
    );
  }
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function toPrimitive(t2, r2) {
    if ("object" != _typeof(t2) || !t2) return t2;
    var e2 = t2[Symbol.toPrimitive];
    if (void 0 !== e2) {
      var i = e2.call(t2, r2 || "default");
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function toPropertyKey(t2) {
    var i = toPrimitive(t2, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }
  function _defineProperty(e2, r2, t2) {
    return (r2 = toPropertyKey(r2)) in e2 ? Object.defineProperty(e2, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e2[r2] = t2, e2;
  }
  function ownKeys(e2, r2) {
    var t2 = Object.keys(e2);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e2);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
      })), t2.push.apply(t2, o);
    }
    return t2;
  }
  function _objectSpread2(e2) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r3) {
        _defineProperty(e2, r3, t2[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r3) {
        Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
      });
    }
    return e2;
  }
  function formatProdErrorMessage(code) {
    return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or use the non-minified dev environment for full errors. ";
  }
  var $$observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();
  var randomString = function randomString2() {
    return Math.random().toString(36).substring(7).split("").join(".");
  };
  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };
  function isPlainObject(obj) {
    if (typeof obj !== "object" || obj === null) return false;
    var proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
  }
  function createStore$1(reducer2, preloadedState, enhancer) {
    var _ref2;
    if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
      throw new Error(formatProdErrorMessage(0));
    }
    if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
      enhancer = preloadedState;
      preloadedState = void 0;
    }
    if (typeof enhancer !== "undefined") {
      if (typeof enhancer !== "function") {
        throw new Error(formatProdErrorMessage(1));
      }
      return enhancer(createStore$1)(reducer2, preloadedState);
    }
    if (typeof reducer2 !== "function") {
      throw new Error(formatProdErrorMessage(2));
    }
    var currentReducer = reducer2;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    function getState() {
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(3));
      }
      return currentState;
    }
    function subscribe(listener) {
      if (typeof listener !== "function") {
        throw new Error(formatProdErrorMessage(4));
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(5));
      }
      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }
        if (isDispatching) {
          throw new Error(formatProdErrorMessage(6));
        }
        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index2 = nextListeners.indexOf(listener);
        nextListeners.splice(index2, 1);
        currentListeners = null;
      };
    }
    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error(formatProdErrorMessage(7));
      }
      if (typeof action.type === "undefined") {
        throw new Error(formatProdErrorMessage(8));
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(9));
      }
      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }
      var listeners = currentListeners = nextListeners;
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }
      return action;
    }
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== "function") {
        throw new Error(formatProdErrorMessage(10));
      }
      currentReducer = nextReducer;
      dispatch({
        type: ActionTypes.REPLACE
      });
    }
    function observable() {
      var _ref;
      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function subscribe2(observer2) {
          if (typeof observer2 !== "object" || observer2 === null) {
            throw new Error(formatProdErrorMessage(11));
          }
          function observeState() {
            if (observer2.next) {
              observer2.next(getState());
            }
          }
          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe
          };
        }
      }, _ref[$$observable] = function() {
        return this;
      }, _ref;
    }
    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch,
      subscribe,
      getState,
      replaceReducer
    }, _ref2[$$observable] = observable, _ref2;
  }
  function bindActionCreator(actionCreator, dispatch) {
    return function() {
      return dispatch(actionCreator.apply(this, arguments));
    };
  }
  function bindActionCreators$1(actionCreators, dispatch) {
    if (typeof actionCreators === "function") {
      return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== "object" || actionCreators === null) {
      throw new Error(formatProdErrorMessage(16));
    }
    var boundActionCreators = {};
    for (var key in actionCreators) {
      var actionCreator = actionCreators[key];
      if (typeof actionCreator === "function") {
        boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
      }
    }
    return boundActionCreators;
  }
  function compose() {
    for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }
    if (funcs.length === 0) {
      return function(arg2) {
        return arg2;
      };
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce(function(a, b2) {
      return function() {
        return a(b2.apply(void 0, arguments));
      };
    });
  }
  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }
    return function(createStore2) {
      return function() {
        var store = createStore2.apply(void 0, arguments);
        var _dispatch = function dispatch() {
          throw new Error(formatProdErrorMessage(15));
        };
        var middlewareAPI = {
          getState: store.getState,
          dispatch: function dispatch() {
            return _dispatch.apply(void 0, arguments);
          }
        };
        var chain = middlewares.map(function(middleware2) {
          return middleware2(middlewareAPI);
        });
        _dispatch = compose.apply(void 0, chain)(store.dispatch);
        return _objectSpread2(_objectSpread2({}, store), {}, {
          dispatch: _dispatch
        });
      };
    };
  }
  var ReactReduxContext = /* @__PURE__ */ React.createContext(null);
  function defaultNoopBatch(callback) {
    callback();
  }
  var batch = defaultNoopBatch;
  var setBatch = function setBatch2(newBatch) {
    return batch = newBatch;
  };
  var getBatch = function getBatch2() {
    return batch;
  };
  function createListenerCollection() {
    var batch2 = getBatch();
    var first = null;
    var last = null;
    return {
      clear: function clear() {
        first = null;
        last = null;
      },
      notify: function notify2() {
        batch2(function() {
          var listener = first;
          while (listener) {
            listener.callback();
            listener = listener.next;
          }
        });
      },
      get: function get2() {
        var listeners = [];
        var listener = first;
        while (listener) {
          listeners.push(listener);
          listener = listener.next;
        }
        return listeners;
      },
      subscribe: function subscribe(callback) {
        var isSubscribed = true;
        var listener = last = {
          callback,
          next: null,
          prev: last
        };
        if (listener.prev) {
          listener.prev.next = listener;
        } else {
          first = listener;
        }
        return function unsubscribe() {
          if (!isSubscribed || first === null) return;
          isSubscribed = false;
          if (listener.next) {
            listener.next.prev = listener.prev;
          } else {
            last = listener.prev;
          }
          if (listener.prev) {
            listener.prev.next = listener.next;
          } else {
            first = listener.next;
          }
        };
      }
    };
  }
  var nullListeners = {
    notify: function notify() {
    },
    get: function get() {
      return [];
    }
  };
  function createSubscription(store, parentSub) {
    var unsubscribe;
    var listeners = nullListeners;
    function addNestedSub(listener) {
      trySubscribe();
      return listeners.subscribe(listener);
    }
    function notifyNestedSubs() {
      listeners.notify();
    }
    function handleChangeWrapper() {
      if (subscription.onStateChange) {
        subscription.onStateChange();
      }
    }
    function isSubscribed() {
      return Boolean(unsubscribe);
    }
    function trySubscribe() {
      if (!unsubscribe) {
        unsubscribe = parentSub ? parentSub.addNestedSub(handleChangeWrapper) : store.subscribe(handleChangeWrapper);
        listeners = createListenerCollection();
      }
    }
    function tryUnsubscribe() {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = void 0;
        listeners.clear();
        listeners = nullListeners;
      }
    }
    var subscription = {
      addNestedSub,
      notifyNestedSubs,
      handleChangeWrapper,
      isSubscribed,
      trySubscribe,
      tryUnsubscribe,
      getListeners: function getListeners() {
        return listeners;
      }
    };
    return subscription;
  }
  var useIsomorphicLayoutEffect$1 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? React.useLayoutEffect : React.useEffect;
  function Provider(_ref) {
    var store = _ref.store, context = _ref.context, children = _ref.children;
    var contextValue = React.useMemo(function() {
      var subscription = createSubscription(store);
      return {
        store,
        subscription
      };
    }, [store]);
    var previousState = React.useMemo(function() {
      return store.getState();
    }, [store]);
    useIsomorphicLayoutEffect$1(function() {
      var subscription = contextValue.subscription;
      subscription.onStateChange = subscription.notifyNestedSubs;
      subscription.trySubscribe();
      if (previousState !== store.getState()) {
        subscription.notifyNestedSubs();
      }
      return function() {
        subscription.tryUnsubscribe();
        subscription.onStateChange = null;
      };
    }, [contextValue, previousState]);
    var Context = context || ReactReduxContext;
    return /* @__PURE__ */ React.createElement(Context.Provider, {
      value: contextValue
    }, children);
  }
  var reactIs = { exports: {} };
  var reactIs_production_min = {};
  /** @license React v17.0.2
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b = 60103, c = 60106, d = 60107, e = 60108, f = 60114, g = 60109, h = 60110, k = 60112, l = 60113, m = 60120, n = 60115, p = 60116, q = 60121, r = 60122, u = 60117, v = 60129, w = 60131;
  if ("function" === typeof Symbol && Symbol.for) {
    var x = Symbol.for;
    b = x("react.element");
    c = x("react.portal");
    d = x("react.fragment");
    e = x("react.strict_mode");
    f = x("react.profiler");
    g = x("react.provider");
    h = x("react.context");
    k = x("react.forward_ref");
    l = x("react.suspense");
    m = x("react.suspense_list");
    n = x("react.memo");
    p = x("react.lazy");
    q = x("react.block");
    r = x("react.server.block");
    u = x("react.fundamental");
    v = x("react.debug_trace_mode");
    w = x("react.legacy_hidden");
  }
  function y(a) {
    if ("object" === typeof a && null !== a) {
      var t2 = a.$$typeof;
      switch (t2) {
        case b:
          switch (a = a.type, a) {
            case d:
            case f:
            case e:
            case l:
            case m:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case h:
                case k:
                case p:
                case n:
                case g:
                  return a;
                default:
                  return t2;
              }
          }
        case c:
          return t2;
      }
    }
  }
  var z = g, A = b, B = k, C = d, D = p, E = n, F = c, G = f, H = e, I = l;
  reactIs_production_min.ContextConsumer = h;
  reactIs_production_min.ContextProvider = z;
  reactIs_production_min.Element = A;
  reactIs_production_min.ForwardRef = B;
  reactIs_production_min.Fragment = C;
  reactIs_production_min.Lazy = D;
  reactIs_production_min.Memo = E;
  reactIs_production_min.Portal = F;
  reactIs_production_min.Profiler = G;
  reactIs_production_min.StrictMode = H;
  reactIs_production_min.Suspense = I;
  reactIs_production_min.isAsyncMode = function() {
    return false;
  };
  reactIs_production_min.isConcurrentMode = function() {
    return false;
  };
  reactIs_production_min.isContextConsumer = function(a) {
    return y(a) === h;
  };
  reactIs_production_min.isContextProvider = function(a) {
    return y(a) === g;
  };
  reactIs_production_min.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === b;
  };
  reactIs_production_min.isForwardRef = function(a) {
    return y(a) === k;
  };
  reactIs_production_min.isFragment = function(a) {
    return y(a) === d;
  };
  reactIs_production_min.isLazy = function(a) {
    return y(a) === p;
  };
  reactIs_production_min.isMemo = function(a) {
    return y(a) === n;
  };
  reactIs_production_min.isPortal = function(a) {
    return y(a) === c;
  };
  reactIs_production_min.isProfiler = function(a) {
    return y(a) === f;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return y(a) === e;
  };
  reactIs_production_min.isSuspense = function(a) {
    return y(a) === l;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === d || a === f || a === v || a === e || a === l || a === m || a === w || "object" === typeof a && null !== a && (a.$$typeof === p || a.$$typeof === n || a.$$typeof === g || a.$$typeof === h || a.$$typeof === k || a.$$typeof === u || a.$$typeof === q || a[0] === r) ? true : false;
  };
  reactIs_production_min.typeOf = y;
  {
    reactIs.exports = reactIs_production_min;
  }
  var reactIsExports = reactIs.exports;
  var _excluded$2 = ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"], _excluded2 = ["reactReduxForwardedRef"];
  var EMPTY_ARRAY = [];
  var NO_SUBSCRIPTION_ARRAY = [null, null];
  function storeStateUpdatesReducer(state, action) {
    var updateCount = state[1];
    return [action.payload, updateCount + 1];
  }
  function useIsomorphicLayoutEffectWithArgs(effectFunc, effectArgs, dependencies) {
    useIsomorphicLayoutEffect$1(function() {
      return effectFunc.apply(void 0, effectArgs);
    }, dependencies);
  }
  function captureWrapperProps(lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs) {
    lastWrapperProps.current = wrapperProps;
    lastChildProps.current = actualChildProps;
    renderIsScheduled.current = false;
    if (childPropsFromStoreUpdate.current) {
      childPropsFromStoreUpdate.current = null;
      notifyNestedSubs();
    }
  }
  function subscribeUpdates(shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch) {
    if (!shouldHandleStateChanges) return;
    var didUnsubscribe = false;
    var lastThrownError = null;
    var checkForUpdates = function checkForUpdates2() {
      if (didUnsubscribe) {
        return;
      }
      var latestStoreState = store.getState();
      var newChildProps, error;
      try {
        newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
      } catch (e2) {
        error = e2;
        lastThrownError = e2;
      }
      if (!error) {
        lastThrownError = null;
      }
      if (newChildProps === lastChildProps.current) {
        if (!renderIsScheduled.current) {
          notifyNestedSubs();
        }
      } else {
        lastChildProps.current = newChildProps;
        childPropsFromStoreUpdate.current = newChildProps;
        renderIsScheduled.current = true;
        forceComponentUpdateDispatch({
          type: "STORE_UPDATED",
          payload: {
            error
          }
        });
      }
    };
    subscription.onStateChange = checkForUpdates;
    subscription.trySubscribe();
    checkForUpdates();
    var unsubscribeWrapper = function unsubscribeWrapper2() {
      didUnsubscribe = true;
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;
      if (lastThrownError) {
        throw lastThrownError;
      }
    };
    return unsubscribeWrapper;
  }
  var initStateUpdates = function initStateUpdates2() {
    return [null, 0];
  };
  function connectAdvanced(selectorFactory, _ref) {
    if (_ref === void 0) {
      _ref = {};
    }
    var _ref2 = _ref, _ref2$getDisplayName = _ref2.getDisplayName, getDisplayName = _ref2$getDisplayName === void 0 ? function(name) {
      return "ConnectAdvanced(" + name + ")";
    } : _ref2$getDisplayName, _ref2$methodName = _ref2.methodName, methodName = _ref2$methodName === void 0 ? "connectAdvanced" : _ref2$methodName, _ref2$renderCountProp = _ref2.renderCountProp, renderCountProp = _ref2$renderCountProp === void 0 ? void 0 : _ref2$renderCountProp, _ref2$shouldHandleSta = _ref2.shouldHandleStateChanges, shouldHandleStateChanges = _ref2$shouldHandleSta === void 0 ? true : _ref2$shouldHandleSta, _ref2$storeKey = _ref2.storeKey, storeKey = _ref2$storeKey === void 0 ? "store" : _ref2$storeKey;
    _ref2.withRef;
    var _ref2$forwardRef = _ref2.forwardRef, forwardRef2 = _ref2$forwardRef === void 0 ? false : _ref2$forwardRef, _ref2$context = _ref2.context, context = _ref2$context === void 0 ? ReactReduxContext : _ref2$context, connectOptions = _objectWithoutPropertiesLoose(_ref2, _excluded$2);
    var Context = context;
    return function wrapWithConnect(WrappedComponent) {
      var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
      var displayName = getDisplayName(wrappedComponentName);
      var selectorFactoryOptions = _extends({}, connectOptions, {
        getDisplayName,
        methodName,
        renderCountProp,
        shouldHandleStateChanges,
        storeKey,
        displayName,
        wrappedComponentName,
        WrappedComponent
      });
      var pure = connectOptions.pure;
      function createChildSelector(store) {
        return selectorFactory(store.dispatch, selectorFactoryOptions);
      }
      var usePureOnlyMemo = pure ? React.useMemo : function(callback) {
        return callback();
      };
      function ConnectFunction(props) {
        var _useMemo = React.useMemo(function() {
          var reactReduxForwardedRef2 = props.reactReduxForwardedRef, wrapperProps2 = _objectWithoutPropertiesLoose(props, _excluded2);
          return [props.context, reactReduxForwardedRef2, wrapperProps2];
        }, [props]), propsContext = _useMemo[0], reactReduxForwardedRef = _useMemo[1], wrapperProps = _useMemo[2];
        var ContextToUse = React.useMemo(function() {
          return propsContext && propsContext.Consumer && reactIsExports.isContextConsumer(/* @__PURE__ */ React.createElement(propsContext.Consumer, null)) ? propsContext : Context;
        }, [propsContext, Context]);
        var contextValue = React.useContext(ContextToUse);
        var didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
        Boolean(contextValue) && Boolean(contextValue.store);
        var store = didStoreComeFromProps ? props.store : contextValue.store;
        var childPropsSelector = React.useMemo(function() {
          return createChildSelector(store);
        }, [store]);
        var _useMemo2 = React.useMemo(function() {
          if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY;
          var subscription2 = createSubscription(store, didStoreComeFromProps ? null : contextValue.subscription);
          var notifyNestedSubs2 = subscription2.notifyNestedSubs.bind(subscription2);
          return [subscription2, notifyNestedSubs2];
        }, [store, didStoreComeFromProps, contextValue]), subscription = _useMemo2[0], notifyNestedSubs = _useMemo2[1];
        var overriddenContextValue = React.useMemo(function() {
          if (didStoreComeFromProps) {
            return contextValue;
          }
          return _extends({}, contextValue, {
            subscription
          });
        }, [didStoreComeFromProps, contextValue, subscription]);
        var _useReducer = React.useReducer(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates), _useReducer$ = _useReducer[0], previousStateUpdateResult = _useReducer$[0], forceComponentUpdateDispatch = _useReducer[1];
        if (previousStateUpdateResult && previousStateUpdateResult.error) {
          throw previousStateUpdateResult.error;
        }
        var lastChildProps = React.useRef();
        var lastWrapperProps = React.useRef(wrapperProps);
        var childPropsFromStoreUpdate = React.useRef();
        var renderIsScheduled = React.useRef(false);
        var actualChildProps = usePureOnlyMemo(function() {
          if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
            return childPropsFromStoreUpdate.current;
          }
          return childPropsSelector(store.getState(), wrapperProps);
        }, [store, previousStateUpdateResult, wrapperProps]);
        useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, actualChildProps, childPropsFromStoreUpdate, notifyNestedSubs]);
        useIsomorphicLayoutEffectWithArgs(subscribeUpdates, [shouldHandleStateChanges, store, subscription, childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, childPropsFromStoreUpdate, notifyNestedSubs, forceComponentUpdateDispatch], [store, subscription, childPropsSelector]);
        var renderedWrappedComponent = React.useMemo(function() {
          return /* @__PURE__ */ React.createElement(WrappedComponent, _extends({}, actualChildProps, {
            ref: reactReduxForwardedRef
          }));
        }, [reactReduxForwardedRef, WrappedComponent, actualChildProps]);
        var renderedChild = React.useMemo(function() {
          if (shouldHandleStateChanges) {
            return /* @__PURE__ */ React.createElement(ContextToUse.Provider, {
              value: overriddenContextValue
            }, renderedWrappedComponent);
          }
          return renderedWrappedComponent;
        }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
        return renderedChild;
      }
      var Connect = pure ? React.memo(ConnectFunction) : ConnectFunction;
      Connect.WrappedComponent = WrappedComponent;
      Connect.displayName = ConnectFunction.displayName = displayName;
      if (forwardRef2) {
        var forwarded = React.forwardRef(function forwardConnectRef(props, ref) {
          return /* @__PURE__ */ React.createElement(Connect, _extends({}, props, {
            reactReduxForwardedRef: ref
          }));
        });
        forwarded.displayName = displayName;
        forwarded.WrappedComponent = WrappedComponent;
        return hoistStatics(forwarded, WrappedComponent);
      }
      return hoistStatics(Connect, WrappedComponent);
    };
  }
  function is(x, y2) {
    if (x === y2) {
      return x !== 0 || y2 !== 0 || 1 / x === 1 / y2;
    } else {
      return x !== x && y2 !== y2;
    }
  }
  function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true;
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
      return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (var i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }
    return true;
  }
  function bindActionCreators(actionCreators, dispatch) {
    var boundActionCreators = {};
    var _loop = function _loop2(key2) {
      var actionCreator = actionCreators[key2];
      if (typeof actionCreator === "function") {
        boundActionCreators[key2] = function() {
          return dispatch(actionCreator.apply(void 0, arguments));
        };
      }
    };
    for (var key in actionCreators) {
      _loop(key);
    }
    return boundActionCreators;
  }
  function wrapMapToPropsConstant(getConstant) {
    return function initConstantSelector(dispatch, options) {
      var constant = getConstant(dispatch, options);
      function constantSelector() {
        return constant;
      }
      constantSelector.dependsOnOwnProps = false;
      return constantSelector;
    };
  }
  function getDependsOnOwnProps(mapToProps) {
    return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== void 0 ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
  }
  function wrapMapToPropsFunc(mapToProps, methodName) {
    return function initProxySelector(dispatch, _ref) {
      _ref.displayName;
      var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
        return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
      };
      proxy.dependsOnOwnProps = true;
      proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
        proxy.mapToProps = mapToProps;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
        var props = proxy(stateOrDispatch, ownProps);
        if (typeof props === "function") {
          proxy.mapToProps = props;
          proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
          props = proxy(stateOrDispatch, ownProps);
        }
        return props;
      };
      return proxy;
    };
  }
  function whenMapDispatchToPropsIsFunction(mapDispatchToProps2) {
    return typeof mapDispatchToProps2 === "function" ? wrapMapToPropsFunc(mapDispatchToProps2) : void 0;
  }
  function whenMapDispatchToPropsIsMissing(mapDispatchToProps2) {
    return !mapDispatchToProps2 ? wrapMapToPropsConstant(function(dispatch) {
      return {
        dispatch
      };
    }) : void 0;
  }
  function whenMapDispatchToPropsIsObject(mapDispatchToProps2) {
    return mapDispatchToProps2 && typeof mapDispatchToProps2 === "object" ? wrapMapToPropsConstant(function(dispatch) {
      return bindActionCreators(mapDispatchToProps2, dispatch);
    }) : void 0;
  }
  const defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];
  function whenMapStateToPropsIsFunction(mapStateToProps) {
    return typeof mapStateToProps === "function" ? wrapMapToPropsFunc(mapStateToProps) : void 0;
  }
  function whenMapStateToPropsIsMissing(mapStateToProps) {
    return !mapStateToProps ? wrapMapToPropsConstant(function() {
      return {};
    }) : void 0;
  }
  const defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];
  function defaultMergeProps(stateProps, dispatchProps, ownProps) {
    return _extends({}, ownProps, stateProps, dispatchProps);
  }
  function wrapMergePropsFunc(mergeProps) {
    return function initMergePropsProxy(dispatch, _ref) {
      _ref.displayName;
      var pure = _ref.pure, areMergedPropsEqual = _ref.areMergedPropsEqual;
      var hasRunOnce = false;
      var mergedProps;
      return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
        var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);
        if (hasRunOnce) {
          if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
        } else {
          hasRunOnce = true;
          mergedProps = nextMergedProps;
        }
        return mergedProps;
      };
    };
  }
  function whenMergePropsIsFunction(mergeProps) {
    return typeof mergeProps === "function" ? wrapMergePropsFunc(mergeProps) : void 0;
  }
  function whenMergePropsIsOmitted(mergeProps) {
    return !mergeProps ? function() {
      return defaultMergeProps;
    } : void 0;
  }
  const defaultMergePropsFactories = [whenMergePropsIsFunction, whenMergePropsIsOmitted];
  var _excluded$1 = ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"];
  function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps2, mergeProps, dispatch) {
    return function impureFinalPropsSelector(state, ownProps) {
      return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps2(dispatch, ownProps), ownProps);
    };
  }
  function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps2, mergeProps, dispatch, _ref) {
    var areStatesEqual = _ref.areStatesEqual, areOwnPropsEqual = _ref.areOwnPropsEqual, areStatePropsEqual = _ref.areStatePropsEqual;
    var hasRunAtLeastOnce = false;
    var state;
    var ownProps;
    var stateProps;
    var dispatchProps;
    var mergedProps;
    function handleFirstCall(firstState, firstOwnProps) {
      state = firstState;
      ownProps = firstOwnProps;
      stateProps = mapStateToProps(state, ownProps);
      dispatchProps = mapDispatchToProps2(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      hasRunAtLeastOnce = true;
      return mergedProps;
    }
    function handleNewPropsAndNewState() {
      stateProps = mapStateToProps(state, ownProps);
      if (mapDispatchToProps2.dependsOnOwnProps) dispatchProps = mapDispatchToProps2(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }
    function handleNewProps() {
      if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
      if (mapDispatchToProps2.dependsOnOwnProps) dispatchProps = mapDispatchToProps2(dispatch, ownProps);
      mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }
    function handleNewState() {
      var nextStateProps = mapStateToProps(state, ownProps);
      var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
      stateProps = nextStateProps;
      if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
      return mergedProps;
    }
    function handleSubsequentCalls(nextState, nextOwnProps) {
      var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
      var stateChanged = !areStatesEqual(nextState, state, nextOwnProps, ownProps);
      state = nextState;
      ownProps = nextOwnProps;
      if (propsChanged && stateChanged) return handleNewPropsAndNewState();
      if (propsChanged) return handleNewProps();
      if (stateChanged) return handleNewState();
      return mergedProps;
    }
    return function pureFinalPropsSelector(nextState, nextOwnProps) {
      return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
    };
  }
  function finalPropsSelectorFactory(dispatch, _ref2) {
    var initMapStateToProps = _ref2.initMapStateToProps, initMapDispatchToProps = _ref2.initMapDispatchToProps, initMergeProps = _ref2.initMergeProps, options = _objectWithoutPropertiesLoose(_ref2, _excluded$1);
    var mapStateToProps = initMapStateToProps(dispatch, options);
    var mapDispatchToProps2 = initMapDispatchToProps(dispatch, options);
    var mergeProps = initMergeProps(dispatch, options);
    var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
    return selectorFactory(mapStateToProps, mapDispatchToProps2, mergeProps, dispatch, options);
  }
  var _excluded = ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"];
  function match(arg2, factories, name) {
    for (var i = factories.length - 1; i >= 0; i--) {
      var result = factories[i](arg2);
      if (result) return result;
    }
    return function(dispatch, options) {
      throw new Error("Invalid value of type " + typeof arg2 + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
    };
  }
  function strictEqual(a, b2) {
    return a === b2;
  }
  function createConnect(_temp) {
    var _ref = {} , _ref$connectHOC = _ref.connectHOC, connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC, _ref$mapStateToPropsF = _ref.mapStateToPropsFactories, mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? defaultMapStateToPropsFactories : _ref$mapStateToPropsF, _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories, mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? defaultMapDispatchToPropsFactories : _ref$mapDispatchToPro, _ref$mergePropsFactor = _ref.mergePropsFactories, mergePropsFactories = _ref$mergePropsFactor === void 0 ? defaultMergePropsFactories : _ref$mergePropsFactor, _ref$selectorFactory = _ref.selectorFactory, selectorFactory = _ref$selectorFactory === void 0 ? finalPropsSelectorFactory : _ref$selectorFactory;
    return function connect2(mapStateToProps, mapDispatchToProps2, mergeProps, _ref2) {
      if (_ref2 === void 0) {
        _ref2 = {};
      }
      var _ref3 = _ref2, _ref3$pure = _ref3.pure, pure = _ref3$pure === void 0 ? true : _ref3$pure, _ref3$areStatesEqual = _ref3.areStatesEqual, areStatesEqual = _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual, _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual, areOwnPropsEqual = _ref3$areOwnPropsEqua === void 0 ? shallowEqual : _ref3$areOwnPropsEqua, _ref3$areStatePropsEq = _ref3.areStatePropsEqual, areStatePropsEqual = _ref3$areStatePropsEq === void 0 ? shallowEqual : _ref3$areStatePropsEq, _ref3$areMergedPropsE = _ref3.areMergedPropsEqual, areMergedPropsEqual = _ref3$areMergedPropsE === void 0 ? shallowEqual : _ref3$areMergedPropsE, extraOptions = _objectWithoutPropertiesLoose(_ref3, _excluded);
      var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, "mapStateToProps");
      var initMapDispatchToProps = match(mapDispatchToProps2, mapDispatchToPropsFactories, "mapDispatchToProps");
      var initMergeProps = match(mergeProps, mergePropsFactories, "mergeProps");
      return connectHOC(selectorFactory, _extends({
        // used in error messages
        methodName: "connect",
        // used to compute Connect's displayName from the wrapped component's displayName.
        getDisplayName: function getDisplayName(name) {
          return "Connect(" + name + ")";
        },
        // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
        shouldHandleStateChanges: Boolean(mapStateToProps),
        // passed through to selectorFactory
        initMapStateToProps,
        initMapDispatchToProps,
        initMergeProps,
        pure,
        areStatesEqual,
        areOwnPropsEqual,
        areStatePropsEqual,
        areMergedPropsEqual
      }, extraOptions));
    };
  }
  const connect = /* @__PURE__ */ createConnect();
  setBatch(ReactDOM__default.unstable_batchedUpdates);
  function areInputsEqual$1(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
      return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
      if (newInputs[i] !== lastInputs[i]) {
        return false;
      }
    }
    return true;
  }
  function useMemoOne(getResult, inputs) {
    var initial = React.useState(function() {
      return {
        inputs,
        result: getResult()
      };
    })[0];
    var isFirstRun = React.useRef(true);
    var committed = React.useRef(initial);
    var useCache = isFirstRun.current || Boolean(inputs && committed.current.inputs && areInputsEqual$1(inputs, committed.current.inputs));
    var cache = useCache ? committed.current : {
      inputs,
      result: getResult()
    };
    React.useEffect(function() {
      isFirstRun.current = false;
      committed.current = cache;
    }, [cache]);
    return cache.result;
  }
  function useCallbackOne(callback, inputs) {
    return useMemoOne(function() {
      return callback;
    }, inputs);
  }
  var useMemo = useMemoOne;
  var useCallback = useCallbackOne;
  var prefix$2 = "Invariant failed";
  function invariant$1(condition, message) {
    {
      throw new Error(prefix$2);
    }
  }
  var getRect = function getRect2(_ref) {
    var top = _ref.top, right = _ref.right, bottom = _ref.bottom, left = _ref.left;
    var width2 = right - left;
    var height2 = bottom - top;
    var rect = {
      top,
      right,
      bottom,
      left,
      width: width2,
      height: height2,
      x: left,
      y: top,
      center: {
        x: (right + left) / 2,
        y: (bottom + top) / 2
      }
    };
    return rect;
  };
  var expand = function expand2(target, expandBy) {
    return {
      top: target.top - expandBy.top,
      left: target.left - expandBy.left,
      bottom: target.bottom + expandBy.bottom,
      right: target.right + expandBy.right
    };
  };
  var shrink = function shrink2(target, shrinkBy) {
    return {
      top: target.top + shrinkBy.top,
      left: target.left + shrinkBy.left,
      bottom: target.bottom - shrinkBy.bottom,
      right: target.right - shrinkBy.right
    };
  };
  var shift = function shift2(target, shiftBy) {
    return {
      top: target.top + shiftBy.y,
      left: target.left + shiftBy.x,
      bottom: target.bottom + shiftBy.y,
      right: target.right + shiftBy.x
    };
  };
  var noSpacing$1 = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  var createBox = function createBox2(_ref2) {
    var borderBox = _ref2.borderBox, _ref2$margin = _ref2.margin, margin2 = _ref2$margin === void 0 ? noSpacing$1 : _ref2$margin, _ref2$border = _ref2.border, border2 = _ref2$border === void 0 ? noSpacing$1 : _ref2$border, _ref2$padding = _ref2.padding, padding2 = _ref2$padding === void 0 ? noSpacing$1 : _ref2$padding;
    var marginBox = getRect(expand(borderBox, margin2));
    var paddingBox = getRect(shrink(borderBox, border2));
    var contentBox = getRect(shrink(paddingBox, padding2));
    return {
      marginBox,
      borderBox: getRect(borderBox),
      paddingBox,
      contentBox,
      margin: margin2,
      border: border2,
      padding: padding2
    };
  };
  var parse = function parse2(raw) {
    var value = raw.slice(0, -2);
    var suffix = raw.slice(-2);
    if (suffix !== "px") {
      return 0;
    }
    var result = Number(value);
    !!isNaN(result) ? invariant$1() : void 0;
    return result;
  };
  var getWindowScroll$1 = function getWindowScroll2() {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  };
  var offset = function offset2(original, change) {
    var borderBox = original.borderBox, border2 = original.border, margin2 = original.margin, padding2 = original.padding;
    var shifted = shift(borderBox, change);
    return createBox({
      borderBox: shifted,
      border: border2,
      margin: margin2,
      padding: padding2
    });
  };
  var withScroll = function withScroll2(original, scroll3) {
    if (scroll3 === void 0) {
      scroll3 = getWindowScroll$1();
    }
    return offset(original, scroll3);
  };
  var calculateBox = function calculateBox2(borderBox, styles2) {
    var margin2 = {
      top: parse(styles2.marginTop),
      right: parse(styles2.marginRight),
      bottom: parse(styles2.marginBottom),
      left: parse(styles2.marginLeft)
    };
    var padding2 = {
      top: parse(styles2.paddingTop),
      right: parse(styles2.paddingRight),
      bottom: parse(styles2.paddingBottom),
      left: parse(styles2.paddingLeft)
    };
    var border2 = {
      top: parse(styles2.borderTopWidth),
      right: parse(styles2.borderRightWidth),
      bottom: parse(styles2.borderBottomWidth),
      left: parse(styles2.borderLeftWidth)
    };
    return createBox({
      borderBox,
      margin: margin2,
      padding: padding2,
      border: border2
    });
  };
  var getBox = function getBox2(el) {
    var borderBox = el.getBoundingClientRect();
    var styles2 = window.getComputedStyle(el);
    return calculateBox(borderBox, styles2);
  };
  var safeIsNaN = Number.isNaN || function ponyfill(value) {
    return typeof value === "number" && value !== value;
  };
  function isEqual$2(first, second) {
    if (first === second) {
      return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
      return true;
    }
    return false;
  }
  function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
      return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
      if (!isEqual$2(newInputs[i], lastInputs[i])) {
        return false;
      }
    }
    return true;
  }
  function memoizeOne(resultFn, isEqual4) {
    if (isEqual4 === void 0) {
      isEqual4 = areInputsEqual;
    }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
      var newArgs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        newArgs[_i] = arguments[_i];
      }
      if (calledOnce && lastThis === this && isEqual4(newArgs, lastArgs)) {
        return lastResult;
      }
      lastResult = resultFn.apply(this, newArgs);
      calledOnce = true;
      lastThis = this;
      lastArgs = newArgs;
      return lastResult;
    }
    return memoized;
  }
  var rafSchd = function rafSchd2(fn) {
    var lastArgs = [];
    var frameId = null;
    var wrapperFn = function wrapperFn2() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      lastArgs = args;
      if (frameId) {
        return;
      }
      frameId = requestAnimationFrame(function() {
        frameId = null;
        fn.apply(void 0, lastArgs);
      });
    };
    wrapperFn.cancel = function() {
      if (!frameId) {
        return;
      }
      cancelAnimationFrame(frameId);
      frameId = null;
    };
    return wrapperFn;
  };
  function log(type, message) {
    {
      return;
    }
  }
  log.bind(null, "warn");
  log.bind(null, "error");
  function noop() {
  }
  function getOptions(shared2, fromBinding) {
    return _extends({}, shared2, {}, fromBinding);
  }
  function bindEvents(el, bindings, sharedOptions) {
    var unbindings = bindings.map(function(binding) {
      var options = getOptions(sharedOptions, binding.options);
      el.addEventListener(binding.eventName, binding.fn, options);
      return function unbind() {
        el.removeEventListener(binding.eventName, binding.fn, options);
      };
    });
    return function unbindAll() {
      unbindings.forEach(function(unbind) {
        unbind();
      });
    };
  }
  var prefix = "Invariant failed";
  function RbdInvariant(message) {
    this.message = message;
  }
  RbdInvariant.prototype.toString = function toString() {
    return this.message;
  };
  function invariant(condition, message) {
    {
      throw new RbdInvariant(prefix);
    }
  }
  var ErrorBoundary = function(_React$Component) {
    _inheritsLoose(ErrorBoundary2, _React$Component);
    function ErrorBoundary2() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
      _this.callbacks = null;
      _this.unbind = noop;
      _this.onWindowError = function(event) {
        var callbacks = _this.getCallbacks();
        if (callbacks.isDragging()) {
          callbacks.tryAbort();
        }
        var err = event.error;
        if (err instanceof RbdInvariant) {
          event.preventDefault();
        }
      };
      _this.getCallbacks = function() {
        if (!_this.callbacks) {
          throw new Error("Unable to find AppCallbacks in <ErrorBoundary/>");
        }
        return _this.callbacks;
      };
      _this.setCallbacks = function(callbacks) {
        _this.callbacks = callbacks;
      };
      return _this;
    }
    var _proto = ErrorBoundary2.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this.unbind = bindEvents(window, [{
        eventName: "error",
        fn: this.onWindowError
      }]);
    };
    _proto.componentDidCatch = function componentDidCatch(err) {
      if (err instanceof RbdInvariant) {
        this.setState({});
        return;
      }
      throw err;
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.unbind();
    };
    _proto.render = function render() {
      return this.props.children(this.setCallbacks);
    };
    return ErrorBoundary2;
  }(React.Component);
  var dragHandleUsageInstructions = "\n  Press space bar to start a drag.\n  When dragging you can use the arrow keys to move the item around and escape to cancel.\n  Some screen readers may require you to be in focus mode or to use your pass through key\n";
  var position = function position2(index2) {
    return index2 + 1;
  };
  var onDragStart = function onDragStart2(start3) {
    return "\n  You have lifted an item in position " + position(start3.source.index) + "\n";
  };
  var withLocation = function withLocation2(source, destination) {
    var isInHomeList = source.droppableId === destination.droppableId;
    var startPosition = position(source.index);
    var endPosition = position(destination.index);
    if (isInHomeList) {
      return "\n      You have moved the item from position " + startPosition + "\n      to position " + endPosition + "\n    ";
    }
    return "\n    You have moved the item from position " + startPosition + "\n    in list " + source.droppableId + "\n    to list " + destination.droppableId + "\n    in position " + endPosition + "\n  ";
  };
  var withCombine = function withCombine2(id, source, combine2) {
    var inHomeList = source.droppableId === combine2.droppableId;
    if (inHomeList) {
      return "\n      The item " + id + "\n      has been combined with " + combine2.draggableId;
    }
    return "\n      The item " + id + "\n      in list " + source.droppableId + "\n      has been combined with " + combine2.draggableId + "\n      in list " + combine2.droppableId + "\n    ";
  };
  var onDragUpdate = function onDragUpdate2(update2) {
    var location = update2.destination;
    if (location) {
      return withLocation(update2.source, location);
    }
    var combine2 = update2.combine;
    if (combine2) {
      return withCombine(update2.draggableId, update2.source, combine2);
    }
    return "You are over an area that cannot be dropped on";
  };
  var returnedToStart = function returnedToStart2(source) {
    return "\n  The item has returned to its starting position\n  of " + position(source.index) + "\n";
  };
  var onDragEnd = function onDragEnd2(result) {
    if (result.reason === "CANCEL") {
      return "\n      Movement cancelled.\n      " + returnedToStart(result.source) + "\n    ";
    }
    var location = result.destination;
    var combine2 = result.combine;
    if (location) {
      return "\n      You have dropped the item.\n      " + withLocation(result.source, location) + "\n    ";
    }
    if (combine2) {
      return "\n      You have dropped the item.\n      " + withCombine(result.draggableId, result.source, combine2) + "\n    ";
    }
    return "\n    The item has been dropped while not over a drop area.\n    " + returnedToStart(result.source) + "\n  ";
  };
  var preset = {
    dragHandleUsageInstructions,
    onDragStart,
    onDragUpdate,
    onDragEnd
  };
  var origin = {
    x: 0,
    y: 0
  };
  var add = function add2(point1, point2) {
    return {
      x: point1.x + point2.x,
      y: point1.y + point2.y
    };
  };
  var subtract = function subtract2(point1, point2) {
    return {
      x: point1.x - point2.x,
      y: point1.y - point2.y
    };
  };
  var isEqual = function isEqual2(point1, point2) {
    return point1.x === point2.x && point1.y === point2.y;
  };
  var negate = function negate2(point) {
    return {
      x: point.x !== 0 ? -point.x : 0,
      y: point.y !== 0 ? -point.y : 0
    };
  };
  var patch = function patch2(line2, value, otherValue) {
    var _ref;
    if (otherValue === void 0) {
      otherValue = 0;
    }
    return _ref = {}, _ref[line2] = value, _ref[line2 === "x" ? "y" : "x"] = otherValue, _ref;
  };
  var distance = function distance2(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  };
  var closest = function closest2(target, points) {
    return Math.min.apply(Math, points.map(function(point) {
      return distance(target, point);
    }));
  };
  var apply = function apply2(fn) {
    return function(point) {
      return {
        x: fn(point.x),
        y: fn(point.y)
      };
    };
  };
  var executeClip = function(frame, subject) {
    var result = getRect({
      top: Math.max(subject.top, frame.top),
      right: Math.min(subject.right, frame.right),
      bottom: Math.min(subject.bottom, frame.bottom),
      left: Math.max(subject.left, frame.left)
    });
    if (result.width <= 0 || result.height <= 0) {
      return null;
    }
    return result;
  };
  var offsetByPosition = function offsetByPosition2(spacing, point) {
    return {
      top: spacing.top + point.y,
      left: spacing.left + point.x,
      bottom: spacing.bottom + point.y,
      right: spacing.right + point.x
    };
  };
  var getCorners = function getCorners2(spacing) {
    return [{
      x: spacing.left,
      y: spacing.top
    }, {
      x: spacing.right,
      y: spacing.top
    }, {
      x: spacing.left,
      y: spacing.bottom
    }, {
      x: spacing.right,
      y: spacing.bottom
    }];
  };
  var noSpacing = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  var scroll = function scroll2(target, frame) {
    if (!frame) {
      return target;
    }
    return offsetByPosition(target, frame.scroll.diff.displacement);
  };
  var increase = function increase2(target, axis, withPlaceholder) {
    if (withPlaceholder && withPlaceholder.increasedBy) {
      var _extends2;
      return _extends({}, target, (_extends2 = {}, _extends2[axis.end] = target[axis.end] + withPlaceholder.increasedBy[axis.line], _extends2));
    }
    return target;
  };
  var clip = function clip2(target, frame) {
    if (frame && frame.shouldClipSubject) {
      return executeClip(frame.pageMarginBox, target);
    }
    return getRect(target);
  };
  var getSubject = function(_ref) {
    var page = _ref.page, withPlaceholder = _ref.withPlaceholder, axis = _ref.axis, frame = _ref.frame;
    var scrolled = scroll(page.marginBox, frame);
    var increased = increase(scrolled, axis, withPlaceholder);
    var clipped = clip(increased, frame);
    return {
      page,
      withPlaceholder,
      active: clipped
    };
  };
  var scrollDroppable = function(droppable2, newScroll) {
    !droppable2.frame ? invariant() : void 0;
    var scrollable = droppable2.frame;
    var scrollDiff = subtract(newScroll, scrollable.scroll.initial);
    var scrollDisplacement = negate(scrollDiff);
    var frame = _extends({}, scrollable, {
      scroll: {
        initial: scrollable.scroll.initial,
        current: newScroll,
        diff: {
          value: scrollDiff,
          displacement: scrollDisplacement
        },
        max: scrollable.scroll.max
      }
    });
    var subject = getSubject({
      page: droppable2.subject.page,
      withPlaceholder: droppable2.subject.withPlaceholder,
      axis: droppable2.axis,
      frame
    });
    var result = _extends({}, droppable2, {
      frame,
      subject
    });
    return result;
  };
  function values(map) {
    if (Object.values) {
      return Object.values(map);
    }
    return Object.keys(map).map(function(key) {
      return map[key];
    });
  }
  function findIndex(list, predicate) {
    if (list.findIndex) {
      return list.findIndex(predicate);
    }
    for (var i = 0; i < list.length; i++) {
      if (predicate(list[i])) {
        return i;
      }
    }
    return -1;
  }
  function find(list, predicate) {
    if (list.find) {
      return list.find(predicate);
    }
    var index2 = findIndex(list, predicate);
    if (index2 !== -1) {
      return list[index2];
    }
    return void 0;
  }
  function toArray(list) {
    return Array.prototype.slice.call(list);
  }
  var toDroppableMap = memoizeOne(function(droppables) {
    return droppables.reduce(function(previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});
  });
  var toDraggableMap = memoizeOne(function(draggables) {
    return draggables.reduce(function(previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});
  });
  var toDroppableList = memoizeOne(function(droppables) {
    return values(droppables);
  });
  var toDraggableList = memoizeOne(function(draggables) {
    return values(draggables);
  });
  var getDraggablesInsideDroppable = memoizeOne(function(droppableId, draggables) {
    var result = toDraggableList(draggables).filter(function(draggable2) {
      return droppableId === draggable2.descriptor.droppableId;
    }).sort(function(a, b2) {
      return a.descriptor.index - b2.descriptor.index;
    });
    return result;
  });
  function tryGetDestination(impact) {
    if (impact.at && impact.at.type === "REORDER") {
      return impact.at.destination;
    }
    return null;
  }
  function tryGetCombine(impact) {
    if (impact.at && impact.at.type === "COMBINE") {
      return impact.at.combine;
    }
    return null;
  }
  var removeDraggableFromList = memoizeOne(function(remove, list) {
    return list.filter(function(item) {
      return item.descriptor.id !== remove.descriptor.id;
    });
  });
  var moveToNextCombine = function(_ref) {
    var isMovingForward = _ref.isMovingForward, draggable2 = _ref.draggable, destination = _ref.destination, insideDestination = _ref.insideDestination, previousImpact = _ref.previousImpact;
    if (!destination.isCombineEnabled) {
      return null;
    }
    var location = tryGetDestination(previousImpact);
    if (!location) {
      return null;
    }
    function getImpact(target) {
      var at = {
        type: "COMBINE",
        combine: {
          draggableId: target,
          droppableId: destination.descriptor.id
        }
      };
      return _extends({}, previousImpact, {
        at
      });
    }
    var all = previousImpact.displaced.all;
    var closestId = all.length ? all[0] : null;
    if (isMovingForward) {
      return closestId ? getImpact(closestId) : null;
    }
    var withoutDraggable = removeDraggableFromList(draggable2, insideDestination);
    if (!closestId) {
      if (!withoutDraggable.length) {
        return null;
      }
      var last = withoutDraggable[withoutDraggable.length - 1];
      return getImpact(last.descriptor.id);
    }
    var indexOfClosest = findIndex(withoutDraggable, function(d2) {
      return d2.descriptor.id === closestId;
    });
    !(indexOfClosest !== -1) ? invariant() : void 0;
    var proposedIndex = indexOfClosest - 1;
    if (proposedIndex < 0) {
      return null;
    }
    var before = withoutDraggable[proposedIndex];
    return getImpact(before.descriptor.id);
  };
  var isHomeOf = function(draggable2, destination) {
    return draggable2.descriptor.droppableId === destination.descriptor.id;
  };
  var noDisplacedBy = {
    point: origin,
    value: 0
  };
  var emptyGroups = {
    invisible: {},
    visible: {},
    all: []
  };
  var noImpact = {
    displaced: emptyGroups,
    displacedBy: noDisplacedBy,
    at: null
  };
  var isWithin = function(lowerBound, upperBound) {
    return function(value) {
      return lowerBound <= value && value <= upperBound;
    };
  };
  var isPartiallyVisibleThroughFrame = function(frame) {
    var isWithinVertical = isWithin(frame.top, frame.bottom);
    var isWithinHorizontal = isWithin(frame.left, frame.right);
    return function(subject) {
      var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
      if (isContained) {
        return true;
      }
      var isPartiallyVisibleVertically = isWithinVertical(subject.top) || isWithinVertical(subject.bottom);
      var isPartiallyVisibleHorizontally = isWithinHorizontal(subject.left) || isWithinHorizontal(subject.right);
      var isPartiallyContained = isPartiallyVisibleVertically && isPartiallyVisibleHorizontally;
      if (isPartiallyContained) {
        return true;
      }
      var isBiggerVertically = subject.top < frame.top && subject.bottom > frame.bottom;
      var isBiggerHorizontally = subject.left < frame.left && subject.right > frame.right;
      var isTargetBiggerThanFrame = isBiggerVertically && isBiggerHorizontally;
      if (isTargetBiggerThanFrame) {
        return true;
      }
      var isTargetBiggerOnOneAxis = isBiggerVertically && isPartiallyVisibleHorizontally || isBiggerHorizontally && isPartiallyVisibleVertically;
      return isTargetBiggerOnOneAxis;
    };
  };
  var isTotallyVisibleThroughFrame = function(frame) {
    var isWithinVertical = isWithin(frame.top, frame.bottom);
    var isWithinHorizontal = isWithin(frame.left, frame.right);
    return function(subject) {
      var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
      return isContained;
    };
  };
  var vertical = {
    direction: "vertical",
    line: "y",
    crossAxisLine: "x",
    start: "top",
    end: "bottom",
    size: "height",
    crossAxisStart: "left",
    crossAxisEnd: "right",
    crossAxisSize: "width"
  };
  var horizontal = {
    direction: "horizontal",
    line: "x",
    crossAxisLine: "y",
    start: "left",
    end: "right",
    size: "width",
    crossAxisStart: "top",
    crossAxisEnd: "bottom",
    crossAxisSize: "height"
  };
  var isTotallyVisibleThroughFrameOnAxis = function(axis) {
    return function(frame) {
      var isWithinVertical = isWithin(frame.top, frame.bottom);
      var isWithinHorizontal = isWithin(frame.left, frame.right);
      return function(subject) {
        if (axis === vertical) {
          return isWithinVertical(subject.top) && isWithinVertical(subject.bottom);
        }
        return isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);
      };
    };
  };
  var getDroppableDisplaced = function getDroppableDisplaced2(target, destination) {
    var displacement = destination.frame ? destination.frame.scroll.diff.displacement : origin;
    return offsetByPosition(target, displacement);
  };
  var isVisibleInDroppable = function isVisibleInDroppable2(target, destination, isVisibleThroughFrameFn) {
    if (!destination.subject.active) {
      return false;
    }
    return isVisibleThroughFrameFn(destination.subject.active)(target);
  };
  var isVisibleInViewport = function isVisibleInViewport2(target, viewport, isVisibleThroughFrameFn) {
    return isVisibleThroughFrameFn(viewport)(target);
  };
  var isVisible = function isVisible2(_ref) {
    var toBeDisplaced = _ref.target, destination = _ref.destination, viewport = _ref.viewport, withDroppableDisplacement2 = _ref.withDroppableDisplacement, isVisibleThroughFrameFn = _ref.isVisibleThroughFrameFn;
    var displacedTarget = withDroppableDisplacement2 ? getDroppableDisplaced(toBeDisplaced, destination) : toBeDisplaced;
    return isVisibleInDroppable(displacedTarget, destination, isVisibleThroughFrameFn) && isVisibleInViewport(displacedTarget, viewport, isVisibleThroughFrameFn);
  };
  var isPartiallyVisible = function isPartiallyVisible2(args) {
    return isVisible(_extends({}, args, {
      isVisibleThroughFrameFn: isPartiallyVisibleThroughFrame
    }));
  };
  var isTotallyVisible = function isTotallyVisible2(args) {
    return isVisible(_extends({}, args, {
      isVisibleThroughFrameFn: isTotallyVisibleThroughFrame
    }));
  };
  var isTotallyVisibleOnAxis = function isTotallyVisibleOnAxis2(args) {
    return isVisible(_extends({}, args, {
      isVisibleThroughFrameFn: isTotallyVisibleThroughFrameOnAxis(args.destination.axis)
    }));
  };
  var getShouldAnimate = function getShouldAnimate2(id, last, forceShouldAnimate) {
    if (typeof forceShouldAnimate === "boolean") {
      return forceShouldAnimate;
    }
    if (!last) {
      return true;
    }
    var invisible = last.invisible, visible = last.visible;
    if (invisible[id]) {
      return false;
    }
    var previous = visible[id];
    return previous ? previous.shouldAnimate : true;
  };
  function getTarget(draggable2, displacedBy) {
    var marginBox = draggable2.page.marginBox;
    var expandBy = {
      top: displacedBy.point.y,
      right: 0,
      bottom: 0,
      left: displacedBy.point.x
    };
    return getRect(expand(marginBox, expandBy));
  }
  function getDisplacementGroups(_ref) {
    var afterDragging = _ref.afterDragging, destination = _ref.destination, displacedBy = _ref.displacedBy, viewport = _ref.viewport, forceShouldAnimate = _ref.forceShouldAnimate, last = _ref.last;
    return afterDragging.reduce(function process2(groups, draggable2) {
      var target = getTarget(draggable2, displacedBy);
      var id = draggable2.descriptor.id;
      groups.all.push(id);
      var isVisible3 = isPartiallyVisible({
        target,
        destination,
        viewport,
        withDroppableDisplacement: true
      });
      if (!isVisible3) {
        groups.invisible[draggable2.descriptor.id] = true;
        return groups;
      }
      var shouldAnimate = getShouldAnimate(id, last, forceShouldAnimate);
      var displacement = {
        draggableId: id,
        shouldAnimate
      };
      groups.visible[id] = displacement;
      return groups;
    }, {
      all: [],
      visible: {},
      invisible: {}
    });
  }
  function getIndexOfLastItem(draggables, options) {
    if (!draggables.length) {
      return 0;
    }
    var indexOfLastItem = draggables[draggables.length - 1].descriptor.index;
    return options.inHomeList ? indexOfLastItem : indexOfLastItem + 1;
  }
  function goAtEnd(_ref) {
    var insideDestination = _ref.insideDestination, inHomeList = _ref.inHomeList, displacedBy = _ref.displacedBy, destination = _ref.destination;
    var newIndex = getIndexOfLastItem(insideDestination, {
      inHomeList
    });
    return {
      displaced: emptyGroups,
      displacedBy,
      at: {
        type: "REORDER",
        destination: {
          droppableId: destination.descriptor.id,
          index: newIndex
        }
      }
    };
  }
  function calculateReorderImpact(_ref2) {
    var draggable2 = _ref2.draggable, insideDestination = _ref2.insideDestination, destination = _ref2.destination, viewport = _ref2.viewport, displacedBy = _ref2.displacedBy, last = _ref2.last, index2 = _ref2.index, forceShouldAnimate = _ref2.forceShouldAnimate;
    var inHomeList = isHomeOf(draggable2, destination);
    if (index2 == null) {
      return goAtEnd({
        insideDestination,
        inHomeList,
        displacedBy,
        destination
      });
    }
    var match2 = find(insideDestination, function(item) {
      return item.descriptor.index === index2;
    });
    if (!match2) {
      return goAtEnd({
        insideDestination,
        inHomeList,
        displacedBy,
        destination
      });
    }
    var withoutDragging = removeDraggableFromList(draggable2, insideDestination);
    var sliceFrom = insideDestination.indexOf(match2);
    var impacted = withoutDragging.slice(sliceFrom);
    var displaced = getDisplacementGroups({
      afterDragging: impacted,
      destination,
      displacedBy,
      last,
      viewport: viewport.frame,
      forceShouldAnimate
    });
    return {
      displaced,
      displacedBy,
      at: {
        type: "REORDER",
        destination: {
          droppableId: destination.descriptor.id,
          index: index2
        }
      }
    };
  }
  function didStartAfterCritical(draggableId, afterCritical) {
    return Boolean(afterCritical.effected[draggableId]);
  }
  var fromCombine = function(_ref) {
    var isMovingForward = _ref.isMovingForward, destination = _ref.destination, draggables = _ref.draggables, combine2 = _ref.combine, afterCritical = _ref.afterCritical;
    if (!destination.isCombineEnabled) {
      return null;
    }
    var combineId = combine2.draggableId;
    var combineWith = draggables[combineId];
    var combineWithIndex = combineWith.descriptor.index;
    var didCombineWithStartAfterCritical = didStartAfterCritical(combineId, afterCritical);
    if (didCombineWithStartAfterCritical) {
      if (isMovingForward) {
        return combineWithIndex;
      }
      return combineWithIndex - 1;
    }
    if (isMovingForward) {
      return combineWithIndex + 1;
    }
    return combineWithIndex;
  };
  var fromReorder = function(_ref) {
    var isMovingForward = _ref.isMovingForward, isInHomeList = _ref.isInHomeList, insideDestination = _ref.insideDestination, location = _ref.location;
    if (!insideDestination.length) {
      return null;
    }
    var currentIndex = location.index;
    var proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;
    var firstIndex = insideDestination[0].descriptor.index;
    var lastIndex = insideDestination[insideDestination.length - 1].descriptor.index;
    var upperBound = isInHomeList ? lastIndex : lastIndex + 1;
    if (proposedIndex < firstIndex) {
      return null;
    }
    if (proposedIndex > upperBound) {
      return null;
    }
    return proposedIndex;
  };
  var moveToNextIndex = function(_ref) {
    var isMovingForward = _ref.isMovingForward, isInHomeList = _ref.isInHomeList, draggable2 = _ref.draggable, draggables = _ref.draggables, destination = _ref.destination, insideDestination = _ref.insideDestination, previousImpact = _ref.previousImpact, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
    var wasAt = previousImpact.at;
    !wasAt ? invariant() : void 0;
    if (wasAt.type === "REORDER") {
      var _newIndex = fromReorder({
        isMovingForward,
        isInHomeList,
        location: wasAt.destination,
        insideDestination
      });
      if (_newIndex == null) {
        return null;
      }
      return calculateReorderImpact({
        draggable: draggable2,
        insideDestination,
        destination,
        viewport,
        last: previousImpact.displaced,
        displacedBy: previousImpact.displacedBy,
        index: _newIndex
      });
    }
    var newIndex = fromCombine({
      isMovingForward,
      destination,
      displaced: previousImpact.displaced,
      draggables,
      combine: wasAt.combine,
      afterCritical
    });
    if (newIndex == null) {
      return null;
    }
    return calculateReorderImpact({
      draggable: draggable2,
      insideDestination,
      destination,
      viewport,
      last: previousImpact.displaced,
      displacedBy: previousImpact.displacedBy,
      index: newIndex
    });
  };
  var getCombinedItemDisplacement = function(_ref) {
    var displaced = _ref.displaced, afterCritical = _ref.afterCritical, combineWith = _ref.combineWith, displacedBy = _ref.displacedBy;
    var isDisplaced = Boolean(displaced.visible[combineWith] || displaced.invisible[combineWith]);
    if (didStartAfterCritical(combineWith, afterCritical)) {
      return isDisplaced ? origin : negate(displacedBy.point);
    }
    return isDisplaced ? displacedBy.point : origin;
  };
  var whenCombining = function(_ref) {
    var afterCritical = _ref.afterCritical, impact = _ref.impact, draggables = _ref.draggables;
    var combine2 = tryGetCombine(impact);
    !combine2 ? invariant() : void 0;
    var combineWith = combine2.draggableId;
    var center = draggables[combineWith].page.borderBox.center;
    var displaceBy = getCombinedItemDisplacement({
      displaced: impact.displaced,
      afterCritical,
      combineWith,
      displacedBy: impact.displacedBy
    });
    return add(center, displaceBy);
  };
  var distanceFromStartToBorderBoxCenter = function distanceFromStartToBorderBoxCenter2(axis, box) {
    return box.margin[axis.start] + box.borderBox[axis.size] / 2;
  };
  var distanceFromEndToBorderBoxCenter = function distanceFromEndToBorderBoxCenter2(axis, box) {
    return box.margin[axis.end] + box.borderBox[axis.size] / 2;
  };
  var getCrossAxisBorderBoxCenter = function getCrossAxisBorderBoxCenter2(axis, target, isMoving) {
    return target[axis.crossAxisStart] + isMoving.margin[axis.crossAxisStart] + isMoving.borderBox[axis.crossAxisSize] / 2;
  };
  var goAfter = function goAfter2(_ref) {
    var axis = _ref.axis, moveRelativeTo = _ref.moveRelativeTo, isMoving = _ref.isMoving;
    return patch(axis.line, moveRelativeTo.marginBox[axis.end] + distanceFromStartToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveRelativeTo.marginBox, isMoving));
  };
  var goBefore = function goBefore2(_ref2) {
    var axis = _ref2.axis, moveRelativeTo = _ref2.moveRelativeTo, isMoving = _ref2.isMoving;
    return patch(axis.line, moveRelativeTo.marginBox[axis.start] - distanceFromEndToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveRelativeTo.marginBox, isMoving));
  };
  var goIntoStart = function goIntoStart2(_ref3) {
    var axis = _ref3.axis, moveInto = _ref3.moveInto, isMoving = _ref3.isMoving;
    return patch(axis.line, moveInto.contentBox[axis.start] + distanceFromStartToBorderBoxCenter(axis, isMoving), getCrossAxisBorderBoxCenter(axis, moveInto.contentBox, isMoving));
  };
  var whenReordering = function(_ref) {
    var impact = _ref.impact, draggable2 = _ref.draggable, draggables = _ref.draggables, droppable2 = _ref.droppable, afterCritical = _ref.afterCritical;
    var insideDestination = getDraggablesInsideDroppable(droppable2.descriptor.id, draggables);
    var draggablePage = draggable2.page;
    var axis = droppable2.axis;
    if (!insideDestination.length) {
      return goIntoStart({
        axis,
        moveInto: droppable2.page,
        isMoving: draggablePage
      });
    }
    var displaced = impact.displaced, displacedBy = impact.displacedBy;
    var closestAfter = displaced.all[0];
    if (closestAfter) {
      var closest3 = draggables[closestAfter];
      if (didStartAfterCritical(closestAfter, afterCritical)) {
        return goBefore({
          axis,
          moveRelativeTo: closest3.page,
          isMoving: draggablePage
        });
      }
      var withDisplacement = offset(closest3.page, displacedBy.point);
      return goBefore({
        axis,
        moveRelativeTo: withDisplacement,
        isMoving: draggablePage
      });
    }
    var last = insideDestination[insideDestination.length - 1];
    if (last.descriptor.id === draggable2.descriptor.id) {
      return draggablePage.borderBox.center;
    }
    if (didStartAfterCritical(last.descriptor.id, afterCritical)) {
      var page = offset(last.page, negate(afterCritical.displacedBy.point));
      return goAfter({
        axis,
        moveRelativeTo: page,
        isMoving: draggablePage
      });
    }
    return goAfter({
      axis,
      moveRelativeTo: last.page,
      isMoving: draggablePage
    });
  };
  var withDroppableDisplacement = function(droppable2, point) {
    var frame = droppable2.frame;
    if (!frame) {
      return point;
    }
    return add(point, frame.scroll.diff.displacement);
  };
  var getResultWithoutDroppableDisplacement = function getResultWithoutDroppableDisplacement2(_ref) {
    var impact = _ref.impact, draggable2 = _ref.draggable, droppable2 = _ref.droppable, draggables = _ref.draggables, afterCritical = _ref.afterCritical;
    var original = draggable2.page.borderBox.center;
    var at = impact.at;
    if (!droppable2) {
      return original;
    }
    if (!at) {
      return original;
    }
    if (at.type === "REORDER") {
      return whenReordering({
        impact,
        draggable: draggable2,
        draggables,
        droppable: droppable2,
        afterCritical
      });
    }
    return whenCombining({
      impact,
      draggables,
      afterCritical
    });
  };
  var getPageBorderBoxCenterFromImpact = function(args) {
    var withoutDisplacement = getResultWithoutDroppableDisplacement(args);
    var droppable2 = args.droppable;
    var withDisplacement = droppable2 ? withDroppableDisplacement(droppable2, withoutDisplacement) : withoutDisplacement;
    return withDisplacement;
  };
  var scrollViewport = function(viewport, newScroll) {
    var diff = subtract(newScroll, viewport.scroll.initial);
    var displacement = negate(diff);
    var frame = getRect({
      top: newScroll.y,
      bottom: newScroll.y + viewport.frame.height,
      left: newScroll.x,
      right: newScroll.x + viewport.frame.width
    });
    var updated = {
      frame,
      scroll: {
        initial: viewport.scroll.initial,
        max: viewport.scroll.max,
        current: newScroll,
        diff: {
          value: diff,
          displacement
        }
      }
    };
    return updated;
  };
  function getDraggables(ids, draggables) {
    return ids.map(function(id) {
      return draggables[id];
    });
  }
  function tryGetVisible(id, groups) {
    for (var i = 0; i < groups.length; i++) {
      var displacement = groups[i].visible[id];
      if (displacement) {
        return displacement;
      }
    }
    return null;
  }
  var speculativelyIncrease = function(_ref) {
    var impact = _ref.impact, viewport = _ref.viewport, destination = _ref.destination, draggables = _ref.draggables, maxScrollChange = _ref.maxScrollChange;
    var scrolledViewport = scrollViewport(viewport, add(viewport.scroll.current, maxScrollChange));
    var scrolledDroppable = destination.frame ? scrollDroppable(destination, add(destination.frame.scroll.current, maxScrollChange)) : destination;
    var last = impact.displaced;
    var withViewportScroll = getDisplacementGroups({
      afterDragging: getDraggables(last.all, draggables),
      destination,
      displacedBy: impact.displacedBy,
      viewport: scrolledViewport.frame,
      last,
      forceShouldAnimate: false
    });
    var withDroppableScroll2 = getDisplacementGroups({
      afterDragging: getDraggables(last.all, draggables),
      destination: scrolledDroppable,
      displacedBy: impact.displacedBy,
      viewport: viewport.frame,
      last,
      forceShouldAnimate: false
    });
    var invisible = {};
    var visible = {};
    var groups = [last, withViewportScroll, withDroppableScroll2];
    last.all.forEach(function(id) {
      var displacement = tryGetVisible(id, groups);
      if (displacement) {
        visible[id] = displacement;
        return;
      }
      invisible[id] = true;
    });
    var newImpact = _extends({}, impact, {
      displaced: {
        all: last.all,
        invisible,
        visible
      }
    });
    return newImpact;
  };
  var withViewportDisplacement = function(viewport, point) {
    return add(viewport.scroll.diff.displacement, point);
  };
  var getClientFromPageBorderBoxCenter = function(_ref) {
    var pageBorderBoxCenter = _ref.pageBorderBoxCenter, draggable2 = _ref.draggable, viewport = _ref.viewport;
    var withoutPageScrollChange = withViewportDisplacement(viewport, pageBorderBoxCenter);
    var offset22 = subtract(withoutPageScrollChange, draggable2.page.borderBox.center);
    return add(draggable2.client.borderBox.center, offset22);
  };
  var isTotallyVisibleInNewLocation = function(_ref) {
    var draggable2 = _ref.draggable, destination = _ref.destination, newPageBorderBoxCenter = _ref.newPageBorderBoxCenter, viewport = _ref.viewport, withDroppableDisplacement2 = _ref.withDroppableDisplacement, _ref$onlyOnMainAxis = _ref.onlyOnMainAxis, onlyOnMainAxis = _ref$onlyOnMainAxis === void 0 ? false : _ref$onlyOnMainAxis;
    var changeNeeded = subtract(newPageBorderBoxCenter, draggable2.page.borderBox.center);
    var shifted = offsetByPosition(draggable2.page.borderBox, changeNeeded);
    var args = {
      target: shifted,
      destination,
      withDroppableDisplacement: withDroppableDisplacement2,
      viewport
    };
    return onlyOnMainAxis ? isTotallyVisibleOnAxis(args) : isTotallyVisible(args);
  };
  var moveToNextPlace = function(_ref) {
    var isMovingForward = _ref.isMovingForward, draggable2 = _ref.draggable, destination = _ref.destination, draggables = _ref.draggables, previousImpact = _ref.previousImpact, viewport = _ref.viewport, previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter, previousClientSelection = _ref.previousClientSelection, afterCritical = _ref.afterCritical;
    if (!destination.isEnabled) {
      return null;
    }
    var insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
    var isInHomeList = isHomeOf(draggable2, destination);
    var impact = moveToNextCombine({
      isMovingForward,
      draggable: draggable2,
      destination,
      insideDestination,
      previousImpact
    }) || moveToNextIndex({
      isMovingForward,
      isInHomeList,
      draggable: draggable2,
      draggables,
      destination,
      insideDestination,
      previousImpact,
      viewport,
      afterCritical
    });
    if (!impact) {
      return null;
    }
    var pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
      impact,
      draggable: draggable2,
      droppable: destination,
      draggables,
      afterCritical
    });
    var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
      draggable: draggable2,
      destination,
      newPageBorderBoxCenter: pageBorderBoxCenter,
      viewport: viewport.frame,
      withDroppableDisplacement: false,
      onlyOnMainAxis: true
    });
    if (isVisibleInNewLocation) {
      var clientSelection = getClientFromPageBorderBoxCenter({
        pageBorderBoxCenter,
        draggable: draggable2,
        viewport
      });
      return {
        clientSelection,
        impact,
        scrollJumpRequest: null
      };
    }
    var distance3 = subtract(pageBorderBoxCenter, previousPageBorderBoxCenter);
    var cautious = speculativelyIncrease({
      impact,
      viewport,
      destination,
      draggables,
      maxScrollChange: distance3
    });
    return {
      clientSelection: previousClientSelection,
      impact: cautious,
      scrollJumpRequest: distance3
    };
  };
  var getKnownActive = function getKnownActive2(droppable2) {
    var rect = droppable2.subject.active;
    !rect ? invariant() : void 0;
    return rect;
  };
  var getBestCrossAxisDroppable = function(_ref) {
    var isMovingForward = _ref.isMovingForward, pageBorderBoxCenter = _ref.pageBorderBoxCenter, source = _ref.source, droppables = _ref.droppables, viewport = _ref.viewport;
    var active = source.subject.active;
    if (!active) {
      return null;
    }
    var axis = source.axis;
    var isBetweenSourceClipped = isWithin(active[axis.start], active[axis.end]);
    var candidates = toDroppableList(droppables).filter(function(droppable2) {
      return droppable2 !== source;
    }).filter(function(droppable2) {
      return droppable2.isEnabled;
    }).filter(function(droppable2) {
      return Boolean(droppable2.subject.active);
    }).filter(function(droppable2) {
      return isPartiallyVisibleThroughFrame(viewport.frame)(getKnownActive(droppable2));
    }).filter(function(droppable2) {
      var activeOfTarget = getKnownActive(droppable2);
      if (isMovingForward) {
        return active[axis.crossAxisEnd] < activeOfTarget[axis.crossAxisEnd];
      }
      return activeOfTarget[axis.crossAxisStart] < active[axis.crossAxisStart];
    }).filter(function(droppable2) {
      var activeOfTarget = getKnownActive(droppable2);
      var isBetweenDestinationClipped = isWithin(activeOfTarget[axis.start], activeOfTarget[axis.end]);
      return isBetweenSourceClipped(activeOfTarget[axis.start]) || isBetweenSourceClipped(activeOfTarget[axis.end]) || isBetweenDestinationClipped(active[axis.start]) || isBetweenDestinationClipped(active[axis.end]);
    }).sort(function(a, b2) {
      var first = getKnownActive(a)[axis.crossAxisStart];
      var second = getKnownActive(b2)[axis.crossAxisStart];
      if (isMovingForward) {
        return first - second;
      }
      return second - first;
    }).filter(function(droppable2, index2, array) {
      return getKnownActive(droppable2)[axis.crossAxisStart] === getKnownActive(array[0])[axis.crossAxisStart];
    });
    if (!candidates.length) {
      return null;
    }
    if (candidates.length === 1) {
      return candidates[0];
    }
    var contains = candidates.filter(function(droppable2) {
      var isWithinDroppable = isWithin(getKnownActive(droppable2)[axis.start], getKnownActive(droppable2)[axis.end]);
      return isWithinDroppable(pageBorderBoxCenter[axis.line]);
    });
    if (contains.length === 1) {
      return contains[0];
    }
    if (contains.length > 1) {
      return contains.sort(function(a, b2) {
        return getKnownActive(a)[axis.start] - getKnownActive(b2)[axis.start];
      })[0];
    }
    return candidates.sort(function(a, b2) {
      var first = closest(pageBorderBoxCenter, getCorners(getKnownActive(a)));
      var second = closest(pageBorderBoxCenter, getCorners(getKnownActive(b2)));
      if (first !== second) {
        return first - second;
      }
      return getKnownActive(a)[axis.start] - getKnownActive(b2)[axis.start];
    })[0];
  };
  var getCurrentPageBorderBoxCenter = function getCurrentPageBorderBoxCenter2(draggable2, afterCritical) {
    var original = draggable2.page.borderBox.center;
    return didStartAfterCritical(draggable2.descriptor.id, afterCritical) ? subtract(original, afterCritical.displacedBy.point) : original;
  };
  var getCurrentPageBorderBox = function getCurrentPageBorderBox2(draggable2, afterCritical) {
    var original = draggable2.page.borderBox;
    return didStartAfterCritical(draggable2.descriptor.id, afterCritical) ? offsetByPosition(original, negate(afterCritical.displacedBy.point)) : original;
  };
  var getClosestDraggable = function(_ref) {
    var pageBorderBoxCenter = _ref.pageBorderBoxCenter, viewport = _ref.viewport, destination = _ref.destination, insideDestination = _ref.insideDestination, afterCritical = _ref.afterCritical;
    var sorted = insideDestination.filter(function(draggable2) {
      return isTotallyVisible({
        target: getCurrentPageBorderBox(draggable2, afterCritical),
        destination,
        viewport: viewport.frame,
        withDroppableDisplacement: true
      });
    }).sort(function(a, b2) {
      var distanceToA = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, getCurrentPageBorderBoxCenter(a, afterCritical)));
      var distanceToB = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, getCurrentPageBorderBoxCenter(b2, afterCritical)));
      if (distanceToA < distanceToB) {
        return -1;
      }
      if (distanceToB < distanceToA) {
        return 1;
      }
      return a.descriptor.index - b2.descriptor.index;
    });
    return sorted[0] || null;
  };
  var getDisplacedBy = memoizeOne(function getDisplacedBy2(axis, displaceBy) {
    var displacement = displaceBy[axis.line];
    return {
      value: displacement,
      point: patch(axis.line, displacement)
    };
  });
  var getRequiredGrowthForPlaceholder = function getRequiredGrowthForPlaceholder2(droppable2, placeholderSize, draggables) {
    var axis = droppable2.axis;
    if (droppable2.descriptor.mode === "virtual") {
      return patch(axis.line, placeholderSize[axis.line]);
    }
    var availableSpace = droppable2.subject.page.contentBox[axis.size];
    var insideDroppable = getDraggablesInsideDroppable(droppable2.descriptor.id, draggables);
    var spaceUsed = insideDroppable.reduce(function(sum, dimension) {
      return sum + dimension.client.marginBox[axis.size];
    }, 0);
    var requiredSpace = spaceUsed + placeholderSize[axis.line];
    var needsToGrowBy = requiredSpace - availableSpace;
    if (needsToGrowBy <= 0) {
      return null;
    }
    return patch(axis.line, needsToGrowBy);
  };
  var withMaxScroll = function withMaxScroll2(frame, max) {
    return _extends({}, frame, {
      scroll: _extends({}, frame.scroll, {
        max
      })
    });
  };
  var addPlaceholder = function addPlaceholder2(droppable2, draggable2, draggables) {
    var frame = droppable2.frame;
    !!isHomeOf(draggable2, droppable2) ? invariant() : void 0;
    !!droppable2.subject.withPlaceholder ? invariant() : void 0;
    var placeholderSize = getDisplacedBy(droppable2.axis, draggable2.displaceBy).point;
    var requiredGrowth = getRequiredGrowthForPlaceholder(droppable2, placeholderSize, draggables);
    var added = {
      placeholderSize,
      increasedBy: requiredGrowth,
      oldFrameMaxScroll: droppable2.frame ? droppable2.frame.scroll.max : null
    };
    if (!frame) {
      var _subject = getSubject({
        page: droppable2.subject.page,
        withPlaceholder: added,
        axis: droppable2.axis,
        frame: droppable2.frame
      });
      return _extends({}, droppable2, {
        subject: _subject
      });
    }
    var maxScroll = requiredGrowth ? add(frame.scroll.max, requiredGrowth) : frame.scroll.max;
    var newFrame = withMaxScroll(frame, maxScroll);
    var subject = getSubject({
      page: droppable2.subject.page,
      withPlaceholder: added,
      axis: droppable2.axis,
      frame: newFrame
    });
    return _extends({}, droppable2, {
      subject,
      frame: newFrame
    });
  };
  var removePlaceholder = function removePlaceholder2(droppable2) {
    var added = droppable2.subject.withPlaceholder;
    !added ? invariant() : void 0;
    var frame = droppable2.frame;
    if (!frame) {
      var _subject2 = getSubject({
        page: droppable2.subject.page,
        axis: droppable2.axis,
        frame: null,
        withPlaceholder: null
      });
      return _extends({}, droppable2, {
        subject: _subject2
      });
    }
    var oldMaxScroll = added.oldFrameMaxScroll;
    !oldMaxScroll ? invariant() : void 0;
    var newFrame = withMaxScroll(frame, oldMaxScroll);
    var subject = getSubject({
      page: droppable2.subject.page,
      axis: droppable2.axis,
      frame: newFrame,
      withPlaceholder: null
    });
    return _extends({}, droppable2, {
      subject,
      frame: newFrame
    });
  };
  var moveToNewDroppable = function(_ref) {
    var previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter, moveRelativeTo = _ref.moveRelativeTo, insideDestination = _ref.insideDestination, draggable2 = _ref.draggable, draggables = _ref.draggables, destination = _ref.destination, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
    if (!moveRelativeTo) {
      if (insideDestination.length) {
        return null;
      }
      var proposed = {
        displaced: emptyGroups,
        displacedBy: noDisplacedBy,
        at: {
          type: "REORDER",
          destination: {
            droppableId: destination.descriptor.id,
            index: 0
          }
        }
      };
      var proposedPageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
        impact: proposed,
        draggable: draggable2,
        droppable: destination,
        draggables,
        afterCritical
      });
      var withPlaceholder = isHomeOf(draggable2, destination) ? destination : addPlaceholder(destination, draggable2, draggables);
      var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
        draggable: draggable2,
        destination: withPlaceholder,
        newPageBorderBoxCenter: proposedPageBorderBoxCenter,
        viewport: viewport.frame,
        withDroppableDisplacement: false,
        onlyOnMainAxis: true
      });
      return isVisibleInNewLocation ? proposed : null;
    }
    var isGoingBeforeTarget = Boolean(previousPageBorderBoxCenter[destination.axis.line] <= moveRelativeTo.page.borderBox.center[destination.axis.line]);
    var proposedIndex = function() {
      var relativeTo = moveRelativeTo.descriptor.index;
      if (moveRelativeTo.descriptor.id === draggable2.descriptor.id) {
        return relativeTo;
      }
      if (isGoingBeforeTarget) {
        return relativeTo;
      }
      return relativeTo + 1;
    }();
    var displacedBy = getDisplacedBy(destination.axis, draggable2.displaceBy);
    return calculateReorderImpact({
      draggable: draggable2,
      insideDestination,
      destination,
      viewport,
      displacedBy,
      last: emptyGroups,
      index: proposedIndex
    });
  };
  var moveCrossAxis = function(_ref) {
    var isMovingForward = _ref.isMovingForward, previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter, draggable2 = _ref.draggable, isOver = _ref.isOver, draggables = _ref.draggables, droppables = _ref.droppables, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
    var destination = getBestCrossAxisDroppable({
      isMovingForward,
      pageBorderBoxCenter: previousPageBorderBoxCenter,
      source: isOver,
      droppables,
      viewport
    });
    if (!destination) {
      return null;
    }
    var insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
    var moveRelativeTo = getClosestDraggable({
      pageBorderBoxCenter: previousPageBorderBoxCenter,
      viewport,
      destination,
      insideDestination,
      afterCritical
    });
    var impact = moveToNewDroppable({
      previousPageBorderBoxCenter,
      destination,
      draggable: draggable2,
      draggables,
      moveRelativeTo,
      insideDestination,
      viewport,
      afterCritical
    });
    if (!impact) {
      return null;
    }
    var pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
      impact,
      draggable: draggable2,
      droppable: destination,
      draggables,
      afterCritical
    });
    var clientSelection = getClientFromPageBorderBoxCenter({
      pageBorderBoxCenter,
      draggable: draggable2,
      viewport
    });
    return {
      clientSelection,
      impact,
      scrollJumpRequest: null
    };
  };
  var whatIsDraggedOver = function(impact) {
    var at = impact.at;
    if (!at) {
      return null;
    }
    if (at.type === "REORDER") {
      return at.destination.droppableId;
    }
    return at.combine.droppableId;
  };
  var getDroppableOver = function getDroppableOver2(impact, droppables) {
    var id = whatIsDraggedOver(impact);
    return id ? droppables[id] : null;
  };
  var moveInDirection = function(_ref) {
    var state = _ref.state, type = _ref.type;
    var isActuallyOver = getDroppableOver(state.impact, state.dimensions.droppables);
    var isMainAxisMovementAllowed = Boolean(isActuallyOver);
    var home2 = state.dimensions.droppables[state.critical.droppable.id];
    var isOver = isActuallyOver || home2;
    var direction = isOver.axis.direction;
    var isMovingOnMainAxis = direction === "vertical" && (type === "MOVE_UP" || type === "MOVE_DOWN") || direction === "horizontal" && (type === "MOVE_LEFT" || type === "MOVE_RIGHT");
    if (isMovingOnMainAxis && !isMainAxisMovementAllowed) {
      return null;
    }
    var isMovingForward = type === "MOVE_DOWN" || type === "MOVE_RIGHT";
    var draggable2 = state.dimensions.draggables[state.critical.draggable.id];
    var previousPageBorderBoxCenter = state.current.page.borderBoxCenter;
    var _state$dimensions = state.dimensions, draggables = _state$dimensions.draggables, droppables = _state$dimensions.droppables;
    return isMovingOnMainAxis ? moveToNextPlace({
      isMovingForward,
      previousPageBorderBoxCenter,
      draggable: draggable2,
      destination: isOver,
      draggables,
      viewport: state.viewport,
      previousClientSelection: state.current.client.selection,
      previousImpact: state.impact,
      afterCritical: state.afterCritical
    }) : moveCrossAxis({
      isMovingForward,
      previousPageBorderBoxCenter,
      draggable: draggable2,
      isOver,
      draggables,
      droppables,
      viewport: state.viewport,
      afterCritical: state.afterCritical
    });
  };
  function isMovementAllowed(state) {
    return state.phase === "DRAGGING" || state.phase === "COLLECTING";
  }
  function isPositionInFrame(frame) {
    var isWithinVertical = isWithin(frame.top, frame.bottom);
    var isWithinHorizontal = isWithin(frame.left, frame.right);
    return function run(point) {
      return isWithinVertical(point.y) && isWithinHorizontal(point.x);
    };
  }
  function getHasOverlap(first, second) {
    return first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
  }
  function getFurthestAway(_ref) {
    var pageBorderBox = _ref.pageBorderBox, draggable2 = _ref.draggable, candidates = _ref.candidates;
    var startCenter = draggable2.page.borderBox.center;
    var sorted = candidates.map(function(candidate) {
      var axis = candidate.axis;
      var target = patch(candidate.axis.line, pageBorderBox.center[axis.line], candidate.page.borderBox.center[axis.crossAxisLine]);
      return {
        id: candidate.descriptor.id,
        distance: distance(startCenter, target)
      };
    }).sort(function(a, b2) {
      return b2.distance - a.distance;
    });
    return sorted[0] ? sorted[0].id : null;
  }
  function getDroppableOver$1(_ref2) {
    var pageBorderBox = _ref2.pageBorderBox, draggable2 = _ref2.draggable, droppables = _ref2.droppables;
    var candidates = toDroppableList(droppables).filter(function(item) {
      if (!item.isEnabled) {
        return false;
      }
      var active = item.subject.active;
      if (!active) {
        return false;
      }
      if (!getHasOverlap(pageBorderBox, active)) {
        return false;
      }
      if (isPositionInFrame(active)(pageBorderBox.center)) {
        return true;
      }
      var axis = item.axis;
      var childCenter = active.center[axis.crossAxisLine];
      var crossAxisStart = pageBorderBox[axis.crossAxisStart];
      var crossAxisEnd = pageBorderBox[axis.crossAxisEnd];
      var isContained = isWithin(active[axis.crossAxisStart], active[axis.crossAxisEnd]);
      var isStartContained = isContained(crossAxisStart);
      var isEndContained = isContained(crossAxisEnd);
      if (!isStartContained && !isEndContained) {
        return true;
      }
      if (isStartContained) {
        return crossAxisStart < childCenter;
      }
      return crossAxisEnd > childCenter;
    });
    if (!candidates.length) {
      return null;
    }
    if (candidates.length === 1) {
      return candidates[0].descriptor.id;
    }
    return getFurthestAway({
      pageBorderBox,
      draggable: draggable2,
      candidates
    });
  }
  var offsetRectByPosition = function offsetRectByPosition2(rect, point) {
    return getRect(offsetByPosition(rect, point));
  };
  var withDroppableScroll = function(droppable2, area) {
    var frame = droppable2.frame;
    if (!frame) {
      return area;
    }
    return offsetRectByPosition(area, frame.scroll.diff.value);
  };
  function getIsDisplaced(_ref) {
    var displaced = _ref.displaced, id = _ref.id;
    return Boolean(displaced.visible[id] || displaced.invisible[id]);
  }
  function atIndex(_ref) {
    var draggable2 = _ref.draggable, closest3 = _ref.closest, inHomeList = _ref.inHomeList;
    if (!closest3) {
      return null;
    }
    if (!inHomeList) {
      return closest3.descriptor.index;
    }
    if (closest3.descriptor.index > draggable2.descriptor.index) {
      return closest3.descriptor.index - 1;
    }
    return closest3.descriptor.index;
  }
  var getReorderImpact = function(_ref2) {
    var targetRect = _ref2.pageBorderBoxWithDroppableScroll, draggable2 = _ref2.draggable, destination = _ref2.destination, insideDestination = _ref2.insideDestination, last = _ref2.last, viewport = _ref2.viewport, afterCritical = _ref2.afterCritical;
    var axis = destination.axis;
    var displacedBy = getDisplacedBy(destination.axis, draggable2.displaceBy);
    var displacement = displacedBy.value;
    var targetStart = targetRect[axis.start];
    var targetEnd = targetRect[axis.end];
    var withoutDragging = removeDraggableFromList(draggable2, insideDestination);
    var closest3 = find(withoutDragging, function(child) {
      var id = child.descriptor.id;
      var childCenter = child.page.borderBox.center[axis.line];
      var didStartAfterCritical$1 = didStartAfterCritical(id, afterCritical);
      var isDisplaced = getIsDisplaced({
        displaced: last,
        id
      });
      if (didStartAfterCritical$1) {
        if (isDisplaced) {
          return targetEnd <= childCenter;
        }
        return targetStart < childCenter - displacement;
      }
      if (isDisplaced) {
        return targetEnd <= childCenter + displacement;
      }
      return targetStart < childCenter;
    });
    var newIndex = atIndex({
      draggable: draggable2,
      closest: closest3,
      inHomeList: isHomeOf(draggable2, destination)
    });
    return calculateReorderImpact({
      draggable: draggable2,
      insideDestination,
      destination,
      viewport,
      last,
      displacedBy,
      index: newIndex
    });
  };
  var combineThresholdDivisor = 4;
  var getCombineImpact = function(_ref) {
    var draggable2 = _ref.draggable, targetRect = _ref.pageBorderBoxWithDroppableScroll, previousImpact = _ref.previousImpact, destination = _ref.destination, insideDestination = _ref.insideDestination, afterCritical = _ref.afterCritical;
    if (!destination.isCombineEnabled) {
      return null;
    }
    var axis = destination.axis;
    var displacedBy = getDisplacedBy(destination.axis, draggable2.displaceBy);
    var displacement = displacedBy.value;
    var targetStart = targetRect[axis.start];
    var targetEnd = targetRect[axis.end];
    var withoutDragging = removeDraggableFromList(draggable2, insideDestination);
    var combineWith = find(withoutDragging, function(child) {
      var id = child.descriptor.id;
      var childRect = child.page.borderBox;
      var childSize = childRect[axis.size];
      var threshold = childSize / combineThresholdDivisor;
      var didStartAfterCritical$1 = didStartAfterCritical(id, afterCritical);
      var isDisplaced = getIsDisplaced({
        displaced: previousImpact.displaced,
        id
      });
      if (didStartAfterCritical$1) {
        if (isDisplaced) {
          return targetEnd > childRect[axis.start] + threshold && targetEnd < childRect[axis.end] - threshold;
        }
        return targetStart > childRect[axis.start] - displacement + threshold && targetStart < childRect[axis.end] - displacement - threshold;
      }
      if (isDisplaced) {
        return targetEnd > childRect[axis.start] + displacement + threshold && targetEnd < childRect[axis.end] + displacement - threshold;
      }
      return targetStart > childRect[axis.start] + threshold && targetStart < childRect[axis.end] - threshold;
    });
    if (!combineWith) {
      return null;
    }
    var impact = {
      displacedBy,
      displaced: previousImpact.displaced,
      at: {
        type: "COMBINE",
        combine: {
          draggableId: combineWith.descriptor.id,
          droppableId: destination.descriptor.id
        }
      }
    };
    return impact;
  };
  var getDragImpact = function(_ref) {
    var pageOffset = _ref.pageOffset, draggable2 = _ref.draggable, draggables = _ref.draggables, droppables = _ref.droppables, previousImpact = _ref.previousImpact, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
    var pageBorderBox = offsetRectByPosition(draggable2.page.borderBox, pageOffset);
    var destinationId = getDroppableOver$1({
      pageBorderBox,
      draggable: draggable2,
      droppables
    });
    if (!destinationId) {
      return noImpact;
    }
    var destination = droppables[destinationId];
    var insideDestination = getDraggablesInsideDroppable(destination.descriptor.id, draggables);
    var pageBorderBoxWithDroppableScroll = withDroppableScroll(destination, pageBorderBox);
    return getCombineImpact({
      pageBorderBoxWithDroppableScroll,
      draggable: draggable2,
      previousImpact,
      destination,
      insideDestination,
      afterCritical
    }) || getReorderImpact({
      pageBorderBoxWithDroppableScroll,
      draggable: draggable2,
      destination,
      insideDestination,
      last: previousImpact.displaced,
      viewport,
      afterCritical
    });
  };
  var patchDroppableMap = function(droppables, updated) {
    var _extends2;
    return _extends({}, droppables, (_extends2 = {}, _extends2[updated.descriptor.id] = updated, _extends2));
  };
  var clearUnusedPlaceholder = function clearUnusedPlaceholder2(_ref) {
    var previousImpact = _ref.previousImpact, impact = _ref.impact, droppables = _ref.droppables;
    var last = whatIsDraggedOver(previousImpact);
    var now = whatIsDraggedOver(impact);
    if (!last) {
      return droppables;
    }
    if (last === now) {
      return droppables;
    }
    var lastDroppable = droppables[last];
    if (!lastDroppable.subject.withPlaceholder) {
      return droppables;
    }
    var updated = removePlaceholder(lastDroppable);
    return patchDroppableMap(droppables, updated);
  };
  var recomputePlaceholders = function(_ref2) {
    var draggable2 = _ref2.draggable, draggables = _ref2.draggables, droppables = _ref2.droppables, previousImpact = _ref2.previousImpact, impact = _ref2.impact;
    var cleaned = clearUnusedPlaceholder({
      previousImpact,
      impact,
      droppables
    });
    var isOver = whatIsDraggedOver(impact);
    if (!isOver) {
      return cleaned;
    }
    var droppable2 = droppables[isOver];
    if (isHomeOf(draggable2, droppable2)) {
      return cleaned;
    }
    if (droppable2.subject.withPlaceholder) {
      return cleaned;
    }
    var patched = addPlaceholder(droppable2, draggable2, draggables);
    return patchDroppableMap(cleaned, patched);
  };
  var update = function(_ref) {
    var state = _ref.state, forcedClientSelection = _ref.clientSelection, forcedDimensions = _ref.dimensions, forcedViewport = _ref.viewport, forcedImpact = _ref.impact, scrollJumpRequest = _ref.scrollJumpRequest;
    var viewport = forcedViewport || state.viewport;
    var dimensions = forcedDimensions || state.dimensions;
    var clientSelection = forcedClientSelection || state.current.client.selection;
    var offset22 = subtract(clientSelection, state.initial.client.selection);
    var client2 = {
      offset: offset22,
      selection: clientSelection,
      borderBoxCenter: add(state.initial.client.borderBoxCenter, offset22)
    };
    var page = {
      selection: add(client2.selection, viewport.scroll.current),
      borderBoxCenter: add(client2.borderBoxCenter, viewport.scroll.current),
      offset: add(client2.offset, viewport.scroll.diff.value)
    };
    var current = {
      client: client2,
      page
    };
    if (state.phase === "COLLECTING") {
      return _extends({
        phase: "COLLECTING"
      }, state, {
        dimensions,
        viewport,
        current
      });
    }
    var draggable2 = dimensions.draggables[state.critical.draggable.id];
    var newImpact = forcedImpact || getDragImpact({
      pageOffset: page.offset,
      draggable: draggable2,
      draggables: dimensions.draggables,
      droppables: dimensions.droppables,
      previousImpact: state.impact,
      viewport,
      afterCritical: state.afterCritical
    });
    var withUpdatedPlaceholders = recomputePlaceholders({
      draggable: draggable2,
      impact: newImpact,
      previousImpact: state.impact,
      draggables: dimensions.draggables,
      droppables: dimensions.droppables
    });
    var result = _extends({}, state, {
      current,
      dimensions: {
        draggables: dimensions.draggables,
        droppables: withUpdatedPlaceholders
      },
      impact: newImpact,
      viewport,
      scrollJumpRequest: scrollJumpRequest || null,
      forceShouldAnimate: scrollJumpRequest ? false : null
    });
    return result;
  };
  function getDraggables$1(ids, draggables) {
    return ids.map(function(id) {
      return draggables[id];
    });
  }
  var recompute = function(_ref) {
    var impact = _ref.impact, viewport = _ref.viewport, draggables = _ref.draggables, destination = _ref.destination, forceShouldAnimate = _ref.forceShouldAnimate;
    var last = impact.displaced;
    var afterDragging = getDraggables$1(last.all, draggables);
    var displaced = getDisplacementGroups({
      afterDragging,
      destination,
      displacedBy: impact.displacedBy,
      viewport: viewport.frame,
      forceShouldAnimate,
      last
    });
    return _extends({}, impact, {
      displaced
    });
  };
  var getClientBorderBoxCenter = function(_ref) {
    var impact = _ref.impact, draggable2 = _ref.draggable, droppable2 = _ref.droppable, draggables = _ref.draggables, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
    var pageBorderBoxCenter = getPageBorderBoxCenterFromImpact({
      impact,
      draggable: draggable2,
      draggables,
      droppable: droppable2,
      afterCritical
    });
    return getClientFromPageBorderBoxCenter({
      pageBorderBoxCenter,
      draggable: draggable2,
      viewport
    });
  };
  var refreshSnap = function(_ref) {
    var state = _ref.state, forcedDimensions = _ref.dimensions, forcedViewport = _ref.viewport;
    !(state.movementMode === "SNAP") ? invariant() : void 0;
    var needsVisibilityCheck = state.impact;
    var viewport = forcedViewport || state.viewport;
    var dimensions = forcedDimensions || state.dimensions;
    var draggables = dimensions.draggables, droppables = dimensions.droppables;
    var draggable2 = draggables[state.critical.draggable.id];
    var isOver = whatIsDraggedOver(needsVisibilityCheck);
    !isOver ? invariant() : void 0;
    var destination = droppables[isOver];
    var impact = recompute({
      impact: needsVisibilityCheck,
      viewport,
      destination,
      draggables
    });
    var clientSelection = getClientBorderBoxCenter({
      impact,
      draggable: draggable2,
      droppable: destination,
      draggables,
      viewport,
      afterCritical: state.afterCritical
    });
    return update({
      impact,
      clientSelection,
      state,
      dimensions,
      viewport
    });
  };
  var getHomeLocation = function(descriptor) {
    return {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };
  };
  var getLiftEffect = function(_ref) {
    var draggable2 = _ref.draggable, home2 = _ref.home, draggables = _ref.draggables, viewport = _ref.viewport;
    var displacedBy = getDisplacedBy(home2.axis, draggable2.displaceBy);
    var insideHome = getDraggablesInsideDroppable(home2.descriptor.id, draggables);
    var rawIndex = insideHome.indexOf(draggable2);
    !(rawIndex !== -1) ? invariant() : void 0;
    var afterDragging = insideHome.slice(rawIndex + 1);
    var effected = afterDragging.reduce(function(previous, item) {
      previous[item.descriptor.id] = true;
      return previous;
    }, {});
    var afterCritical = {
      inVirtualList: home2.descriptor.mode === "virtual",
      displacedBy,
      effected
    };
    var displaced = getDisplacementGroups({
      afterDragging,
      destination: home2,
      displacedBy,
      last: null,
      viewport: viewport.frame,
      forceShouldAnimate: false
    });
    var impact = {
      displaced,
      displacedBy,
      at: {
        type: "REORDER",
        destination: getHomeLocation(draggable2.descriptor)
      }
    };
    return {
      impact,
      afterCritical
    };
  };
  var patchDimensionMap = function(dimensions, updated) {
    return {
      draggables: dimensions.draggables,
      droppables: patchDroppableMap(dimensions.droppables, updated)
    };
  };
  var offsetDraggable = function(_ref) {
    var draggable2 = _ref.draggable, offset$1 = _ref.offset, initialWindowScroll = _ref.initialWindowScroll;
    var client2 = offset(draggable2.client, offset$1);
    var page = withScroll(client2, initialWindowScroll);
    var moved = _extends({}, draggable2, {
      placeholder: _extends({}, draggable2.placeholder, {
        client: client2
      }),
      client: client2,
      page
    });
    return moved;
  };
  var getFrame = function(droppable2) {
    var frame = droppable2.frame;
    !frame ? invariant() : void 0;
    return frame;
  };
  var adjustAdditionsForScrollChanges = function(_ref) {
    var additions = _ref.additions, updatedDroppables = _ref.updatedDroppables, viewport = _ref.viewport;
    var windowScrollChange = viewport.scroll.diff.value;
    return additions.map(function(draggable2) {
      var droppableId = draggable2.descriptor.droppableId;
      var modified = updatedDroppables[droppableId];
      var frame = getFrame(modified);
      var droppableScrollChange = frame.scroll.diff.value;
      var totalChange = add(windowScrollChange, droppableScrollChange);
      var moved = offsetDraggable({
        draggable: draggable2,
        offset: totalChange,
        initialWindowScroll: viewport.scroll.initial
      });
      return moved;
    });
  };
  var publishWhileDraggingInVirtual = function(_ref) {
    var state = _ref.state, published = _ref.published;
    var withScrollChange = published.modified.map(function(update2) {
      var existing = state.dimensions.droppables[update2.droppableId];
      var scrolled = scrollDroppable(existing, update2.scroll);
      return scrolled;
    });
    var droppables = _extends({}, state.dimensions.droppables, {}, toDroppableMap(withScrollChange));
    var updatedAdditions = toDraggableMap(adjustAdditionsForScrollChanges({
      additions: published.additions,
      updatedDroppables: droppables,
      viewport: state.viewport
    }));
    var draggables = _extends({}, state.dimensions.draggables, {}, updatedAdditions);
    published.removals.forEach(function(id) {
      delete draggables[id];
    });
    var dimensions = {
      droppables,
      draggables
    };
    var wasOverId = whatIsDraggedOver(state.impact);
    var wasOver = wasOverId ? dimensions.droppables[wasOverId] : null;
    var draggable2 = dimensions.draggables[state.critical.draggable.id];
    var home2 = dimensions.droppables[state.critical.droppable.id];
    var _getLiftEffect = getLiftEffect({
      draggable: draggable2,
      home: home2,
      draggables,
      viewport: state.viewport
    }), onLiftImpact = _getLiftEffect.impact, afterCritical = _getLiftEffect.afterCritical;
    var previousImpact = wasOver && wasOver.isCombineEnabled ? state.impact : onLiftImpact;
    var impact = getDragImpact({
      pageOffset: state.current.page.offset,
      draggable: dimensions.draggables[state.critical.draggable.id],
      draggables: dimensions.draggables,
      droppables: dimensions.droppables,
      previousImpact,
      viewport: state.viewport,
      afterCritical
    });
    var draggingState = _extends({
      phase: "DRAGGING"
    }, state, {
      phase: "DRAGGING",
      impact,
      onLiftImpact,
      dimensions,
      afterCritical,
      forceShouldAnimate: false
    });
    if (state.phase === "COLLECTING") {
      return draggingState;
    }
    var dropPending3 = _extends({
      phase: "DROP_PENDING"
    }, draggingState, {
      phase: "DROP_PENDING",
      reason: state.reason,
      isWaiting: false
    });
    return dropPending3;
  };
  var isSnapping = function isSnapping2(state) {
    return state.movementMode === "SNAP";
  };
  var postDroppableChange = function postDroppableChange2(state, updated, isEnabledChanging) {
    var dimensions = patchDimensionMap(state.dimensions, updated);
    if (!isSnapping(state) || isEnabledChanging) {
      return update({
        state,
        dimensions
      });
    }
    return refreshSnap({
      state,
      dimensions
    });
  };
  function removeScrollJumpRequest(state) {
    if (state.isDragging && state.movementMode === "SNAP") {
      return _extends({
        phase: "DRAGGING"
      }, state, {
        scrollJumpRequest: null
      });
    }
    return state;
  }
  var idle = {
    phase: "IDLE",
    completed: null,
    shouldFlush: false
  };
  var reducer = function(state, action) {
    if (state === void 0) {
      state = idle;
    }
    if (action.type === "FLUSH") {
      return _extends({}, idle, {
        shouldFlush: true
      });
    }
    if (action.type === "INITIAL_PUBLISH") {
      !(state.phase === "IDLE") ? invariant() : void 0;
      var _action$payload = action.payload, critical = _action$payload.critical, clientSelection = _action$payload.clientSelection, viewport = _action$payload.viewport, dimensions = _action$payload.dimensions, movementMode = _action$payload.movementMode;
      var draggable2 = dimensions.draggables[critical.draggable.id];
      var home2 = dimensions.droppables[critical.droppable.id];
      var client2 = {
        selection: clientSelection,
        borderBoxCenter: draggable2.client.borderBox.center,
        offset: origin
      };
      var initial = {
        client: client2,
        page: {
          selection: add(client2.selection, viewport.scroll.initial),
          borderBoxCenter: add(client2.selection, viewport.scroll.initial),
          offset: add(client2.selection, viewport.scroll.diff.value)
        }
      };
      var isWindowScrollAllowed = toDroppableList(dimensions.droppables).every(function(item) {
        return !item.isFixedOnPage;
      });
      var _getLiftEffect = getLiftEffect({
        draggable: draggable2,
        home: home2,
        draggables: dimensions.draggables,
        viewport
      }), impact = _getLiftEffect.impact, afterCritical = _getLiftEffect.afterCritical;
      var result = {
        phase: "DRAGGING",
        isDragging: true,
        critical,
        movementMode,
        dimensions,
        initial,
        current: initial,
        isWindowScrollAllowed,
        impact,
        afterCritical,
        onLiftImpact: impact,
        viewport,
        scrollJumpRequest: null,
        forceShouldAnimate: null
      };
      return result;
    }
    if (action.type === "COLLECTION_STARTING") {
      if (state.phase === "COLLECTING" || state.phase === "DROP_PENDING") {
        return state;
      }
      !(state.phase === "DRAGGING") ? invariant() : void 0;
      var _result = _extends({
        phase: "COLLECTING"
      }, state, {
        phase: "COLLECTING"
      });
      return _result;
    }
    if (action.type === "PUBLISH_WHILE_DRAGGING") {
      !(state.phase === "COLLECTING" || state.phase === "DROP_PENDING") ? invariant() : void 0;
      return publishWhileDraggingInVirtual({
        state,
        published: action.payload
      });
    }
    if (action.type === "MOVE") {
      if (state.phase === "DROP_PENDING") {
        return state;
      }
      !isMovementAllowed(state) ? invariant() : void 0;
      var _clientSelection = action.payload.client;
      if (isEqual(_clientSelection, state.current.client.selection)) {
        return state;
      }
      return update({
        state,
        clientSelection: _clientSelection,
        impact: isSnapping(state) ? state.impact : null
      });
    }
    if (action.type === "UPDATE_DROPPABLE_SCROLL") {
      if (state.phase === "DROP_PENDING") {
        return removeScrollJumpRequest(state);
      }
      if (state.phase === "COLLECTING") {
        return removeScrollJumpRequest(state);
      }
      !isMovementAllowed(state) ? invariant() : void 0;
      var _action$payload2 = action.payload, id = _action$payload2.id, newScroll = _action$payload2.newScroll;
      var target = state.dimensions.droppables[id];
      if (!target) {
        return state;
      }
      var scrolled = scrollDroppable(target, newScroll);
      return postDroppableChange(state, scrolled, false);
    }
    if (action.type === "UPDATE_DROPPABLE_IS_ENABLED") {
      if (state.phase === "DROP_PENDING") {
        return state;
      }
      !isMovementAllowed(state) ? invariant() : void 0;
      var _action$payload3 = action.payload, _id = _action$payload3.id, isEnabled = _action$payload3.isEnabled;
      var _target = state.dimensions.droppables[_id];
      !_target ? invariant() : void 0;
      !(_target.isEnabled !== isEnabled) ? invariant() : void 0;
      var updated = _extends({}, _target, {
        isEnabled
      });
      return postDroppableChange(state, updated, true);
    }
    if (action.type === "UPDATE_DROPPABLE_IS_COMBINE_ENABLED") {
      if (state.phase === "DROP_PENDING") {
        return state;
      }
      !isMovementAllowed(state) ? invariant() : void 0;
      var _action$payload4 = action.payload, _id2 = _action$payload4.id, isCombineEnabled = _action$payload4.isCombineEnabled;
      var _target2 = state.dimensions.droppables[_id2];
      !_target2 ? invariant() : void 0;
      !(_target2.isCombineEnabled !== isCombineEnabled) ? invariant() : void 0;
      var _updated = _extends({}, _target2, {
        isCombineEnabled
      });
      return postDroppableChange(state, _updated, true);
    }
    if (action.type === "MOVE_BY_WINDOW_SCROLL") {
      if (state.phase === "DROP_PENDING" || state.phase === "DROP_ANIMATING") {
        return state;
      }
      !isMovementAllowed(state) ? invariant() : void 0;
      !state.isWindowScrollAllowed ? invariant() : void 0;
      var _newScroll = action.payload.newScroll;
      if (isEqual(state.viewport.scroll.current, _newScroll)) {
        return removeScrollJumpRequest(state);
      }
      var _viewport = scrollViewport(state.viewport, _newScroll);
      if (isSnapping(state)) {
        return refreshSnap({
          state,
          viewport: _viewport
        });
      }
      return update({
        state,
        viewport: _viewport
      });
    }
    if (action.type === "UPDATE_VIEWPORT_MAX_SCROLL") {
      if (!isMovementAllowed(state)) {
        return state;
      }
      var maxScroll = action.payload.maxScroll;
      if (isEqual(maxScroll, state.viewport.scroll.max)) {
        return state;
      }
      var withMaxScroll3 = _extends({}, state.viewport, {
        scroll: _extends({}, state.viewport.scroll, {
          max: maxScroll
        })
      });
      return _extends({
        phase: "DRAGGING"
      }, state, {
        viewport: withMaxScroll3
      });
    }
    if (action.type === "MOVE_UP" || action.type === "MOVE_DOWN" || action.type === "MOVE_LEFT" || action.type === "MOVE_RIGHT") {
      if (state.phase === "COLLECTING" || state.phase === "DROP_PENDING") {
        return state;
      }
      !(state.phase === "DRAGGING") ? invariant() : void 0;
      var _result2 = moveInDirection({
        state,
        type: action.type
      });
      if (!_result2) {
        return state;
      }
      return update({
        state,
        impact: _result2.impact,
        clientSelection: _result2.clientSelection,
        scrollJumpRequest: _result2.scrollJumpRequest
      });
    }
    if (action.type === "DROP_PENDING") {
      var reason = action.payload.reason;
      !(state.phase === "COLLECTING") ? invariant() : void 0;
      var newState = _extends({
        phase: "DROP_PENDING"
      }, state, {
        phase: "DROP_PENDING",
        isWaiting: true,
        reason
      });
      return newState;
    }
    if (action.type === "DROP_ANIMATE") {
      var _action$payload5 = action.payload, completed = _action$payload5.completed, dropDuration = _action$payload5.dropDuration, newHomeClientOffset = _action$payload5.newHomeClientOffset;
      !(state.phase === "DRAGGING" || state.phase === "DROP_PENDING") ? invariant() : void 0;
      var _result3 = {
        phase: "DROP_ANIMATING",
        completed,
        dropDuration,
        newHomeClientOffset,
        dimensions: state.dimensions
      };
      return _result3;
    }
    if (action.type === "DROP_COMPLETE") {
      var _completed = action.payload.completed;
      return {
        phase: "IDLE",
        completed: _completed,
        shouldFlush: false
      };
    }
    return state;
  };
  var beforeInitialCapture = function beforeInitialCapture2(args) {
    return {
      type: "BEFORE_INITIAL_CAPTURE",
      payload: args
    };
  };
  var lift = function lift2(args) {
    return {
      type: "LIFT",
      payload: args
    };
  };
  var initialPublish = function initialPublish2(args) {
    return {
      type: "INITIAL_PUBLISH",
      payload: args
    };
  };
  var publishWhileDragging = function publishWhileDragging2(args) {
    return {
      type: "PUBLISH_WHILE_DRAGGING",
      payload: args
    };
  };
  var collectionStarting = function collectionStarting2() {
    return {
      type: "COLLECTION_STARTING",
      payload: null
    };
  };
  var updateDroppableScroll = function updateDroppableScroll2(args) {
    return {
      type: "UPDATE_DROPPABLE_SCROLL",
      payload: args
    };
  };
  var updateDroppableIsEnabled = function updateDroppableIsEnabled2(args) {
    return {
      type: "UPDATE_DROPPABLE_IS_ENABLED",
      payload: args
    };
  };
  var updateDroppableIsCombineEnabled = function updateDroppableIsCombineEnabled2(args) {
    return {
      type: "UPDATE_DROPPABLE_IS_COMBINE_ENABLED",
      payload: args
    };
  };
  var move = function move2(args) {
    return {
      type: "MOVE",
      payload: args
    };
  };
  var moveByWindowScroll = function moveByWindowScroll2(args) {
    return {
      type: "MOVE_BY_WINDOW_SCROLL",
      payload: args
    };
  };
  var updateViewportMaxScroll = function updateViewportMaxScroll2(args) {
    return {
      type: "UPDATE_VIEWPORT_MAX_SCROLL",
      payload: args
    };
  };
  var moveUp = function moveUp2() {
    return {
      type: "MOVE_UP",
      payload: null
    };
  };
  var moveDown = function moveDown2() {
    return {
      type: "MOVE_DOWN",
      payload: null
    };
  };
  var moveRight = function moveRight2() {
    return {
      type: "MOVE_RIGHT",
      payload: null
    };
  };
  var moveLeft = function moveLeft2() {
    return {
      type: "MOVE_LEFT",
      payload: null
    };
  };
  var flush = function flush2() {
    return {
      type: "FLUSH",
      payload: null
    };
  };
  var animateDrop = function animateDrop2(args) {
    return {
      type: "DROP_ANIMATE",
      payload: args
    };
  };
  var completeDrop = function completeDrop2(args) {
    return {
      type: "DROP_COMPLETE",
      payload: args
    };
  };
  var drop = function drop2(args) {
    return {
      type: "DROP",
      payload: args
    };
  };
  var dropPending = function dropPending2(args) {
    return {
      type: "DROP_PENDING",
      payload: args
    };
  };
  var dropAnimationFinished = function dropAnimationFinished2() {
    return {
      type: "DROP_ANIMATION_FINISHED",
      payload: null
    };
  };
  var lift$1 = function(marshal) {
    return function(_ref) {
      var getState = _ref.getState, dispatch = _ref.dispatch;
      return function(next2) {
        return function(action) {
          if (action.type !== "LIFT") {
            next2(action);
            return;
          }
          var _action$payload = action.payload, id = _action$payload.id, clientSelection = _action$payload.clientSelection, movementMode = _action$payload.movementMode;
          var initial = getState();
          if (initial.phase === "DROP_ANIMATING") {
            dispatch(completeDrop({
              completed: initial.completed
            }));
          }
          !(getState().phase === "IDLE") ? invariant() : void 0;
          dispatch(flush());
          dispatch(beforeInitialCapture({
            draggableId: id,
            movementMode
          }));
          var scrollOptions = {
            shouldPublishImmediately: movementMode === "SNAP"
          };
          var request = {
            draggableId: id,
            scrollOptions
          };
          var _marshal$startPublish = marshal.startPublishing(request), critical = _marshal$startPublish.critical, dimensions = _marshal$startPublish.dimensions, viewport = _marshal$startPublish.viewport;
          dispatch(initialPublish({
            critical,
            dimensions,
            clientSelection,
            movementMode,
            viewport
          }));
        };
      };
    };
  };
  var style = function(marshal) {
    return function() {
      return function(next2) {
        return function(action) {
          if (action.type === "INITIAL_PUBLISH") {
            marshal.dragging();
          }
          if (action.type === "DROP_ANIMATE") {
            marshal.dropping(action.payload.completed.result.reason);
          }
          if (action.type === "FLUSH" || action.type === "DROP_COMPLETE") {
            marshal.resting();
          }
          next2(action);
        };
      };
    };
  };
  var curves = {
    outOfTheWay: "cubic-bezier(0.2, 0, 0, 1)",
    drop: "cubic-bezier(.2,1,.1,1)"
  };
  var combine = {
    opacity: {
      drop: 0,
      combining: 0.7
    },
    scale: {
      drop: 0.75
    }
  };
  var timings = {
    outOfTheWay: 0.2,
    minDropTime: 0.33,
    maxDropTime: 0.55
  };
  var outOfTheWayTiming = timings.outOfTheWay + "s " + curves.outOfTheWay;
  var transitions = {
    fluid: "opacity " + outOfTheWayTiming,
    snap: "transform " + outOfTheWayTiming + ", opacity " + outOfTheWayTiming,
    drop: function drop3(duration2) {
      var timing = duration2 + "s " + curves.drop;
      return "transform " + timing + ", opacity " + timing;
    },
    outOfTheWay: "transform " + outOfTheWayTiming,
    placeholder: "height " + outOfTheWayTiming + ", width " + outOfTheWayTiming + ", margin " + outOfTheWayTiming
  };
  var moveTo = function moveTo2(offset22) {
    return isEqual(offset22, origin) ? null : "translate(" + offset22.x + "px, " + offset22.y + "px)";
  };
  var transforms = {
    moveTo,
    drop: function drop4(offset22, isCombining) {
      var translate = moveTo(offset22);
      if (!translate) {
        return null;
      }
      if (!isCombining) {
        return translate;
      }
      return translate + " scale(" + combine.scale.drop + ")";
    }
  };
  var minDropTime = timings.minDropTime, maxDropTime = timings.maxDropTime;
  var dropTimeRange = maxDropTime - minDropTime;
  var maxDropTimeAtDistance = 1500;
  var cancelDropModifier = 0.6;
  var getDropDuration = function(_ref) {
    var current = _ref.current, destination = _ref.destination, reason = _ref.reason;
    var distance$1 = distance(current, destination);
    if (distance$1 <= 0) {
      return minDropTime;
    }
    if (distance$1 >= maxDropTimeAtDistance) {
      return maxDropTime;
    }
    var percentage = distance$1 / maxDropTimeAtDistance;
    var duration2 = minDropTime + dropTimeRange * percentage;
    var withDuration = reason === "CANCEL" ? duration2 * cancelDropModifier : duration2;
    return Number(withDuration.toFixed(2));
  };
  var getNewHomeClientOffset = function(_ref) {
    var impact = _ref.impact, draggable2 = _ref.draggable, dimensions = _ref.dimensions, viewport = _ref.viewport, afterCritical = _ref.afterCritical;
    var draggables = dimensions.draggables, droppables = dimensions.droppables;
    var droppableId = whatIsDraggedOver(impact);
    var destination = droppableId ? droppables[droppableId] : null;
    var home2 = droppables[draggable2.descriptor.droppableId];
    var newClientCenter = getClientBorderBoxCenter({
      impact,
      draggable: draggable2,
      draggables,
      afterCritical,
      droppable: destination || home2,
      viewport
    });
    var offset22 = subtract(newClientCenter, draggable2.client.borderBox.center);
    return offset22;
  };
  var getDropImpact = function(_ref) {
    var draggables = _ref.draggables, reason = _ref.reason, lastImpact = _ref.lastImpact, home2 = _ref.home, viewport = _ref.viewport, onLiftImpact = _ref.onLiftImpact;
    if (!lastImpact.at || reason !== "DROP") {
      var recomputedHomeImpact = recompute({
        draggables,
        impact: onLiftImpact,
        destination: home2,
        viewport,
        forceShouldAnimate: true
      });
      return {
        impact: recomputedHomeImpact,
        didDropInsideDroppable: false
      };
    }
    if (lastImpact.at.type === "REORDER") {
      return {
        impact: lastImpact,
        didDropInsideDroppable: true
      };
    }
    var withoutMovement = _extends({}, lastImpact, {
      displaced: emptyGroups
    });
    return {
      impact: withoutMovement,
      didDropInsideDroppable: true
    };
  };
  var drop$1 = function(_ref) {
    var getState = _ref.getState, dispatch = _ref.dispatch;
    return function(next2) {
      return function(action) {
        if (action.type !== "DROP") {
          next2(action);
          return;
        }
        var state = getState();
        var reason = action.payload.reason;
        if (state.phase === "COLLECTING") {
          dispatch(dropPending({
            reason
          }));
          return;
        }
        if (state.phase === "IDLE") {
          return;
        }
        var isWaitingForDrop = state.phase === "DROP_PENDING" && state.isWaiting;
        !!isWaitingForDrop ? invariant() : void 0;
        !(state.phase === "DRAGGING" || state.phase === "DROP_PENDING") ? invariant() : void 0;
        var critical = state.critical;
        var dimensions = state.dimensions;
        var draggable2 = dimensions.draggables[state.critical.draggable.id];
        var _getDropImpact = getDropImpact({
          reason,
          lastImpact: state.impact,
          afterCritical: state.afterCritical,
          onLiftImpact: state.onLiftImpact,
          home: state.dimensions.droppables[state.critical.droppable.id],
          viewport: state.viewport,
          draggables: state.dimensions.draggables
        }), impact = _getDropImpact.impact, didDropInsideDroppable = _getDropImpact.didDropInsideDroppable;
        var destination = didDropInsideDroppable ? tryGetDestination(impact) : null;
        var combine2 = didDropInsideDroppable ? tryGetCombine(impact) : null;
        var source = {
          index: critical.draggable.index,
          droppableId: critical.droppable.id
        };
        var result = {
          draggableId: draggable2.descriptor.id,
          type: draggable2.descriptor.type,
          source,
          reason,
          mode: state.movementMode,
          destination,
          combine: combine2
        };
        var newHomeClientOffset = getNewHomeClientOffset({
          impact,
          draggable: draggable2,
          dimensions,
          viewport: state.viewport,
          afterCritical: state.afterCritical
        });
        var completed = {
          critical: state.critical,
          afterCritical: state.afterCritical,
          result,
          impact
        };
        var isAnimationRequired = !isEqual(state.current.client.offset, newHomeClientOffset) || Boolean(result.combine);
        if (!isAnimationRequired) {
          dispatch(completeDrop({
            completed
          }));
          return;
        }
        var dropDuration = getDropDuration({
          current: state.current.client.offset,
          destination: newHomeClientOffset,
          reason
        });
        var args = {
          newHomeClientOffset,
          dropDuration,
          completed
        };
        dispatch(animateDrop(args));
      };
    };
  };
  var getWindowScroll = function() {
    return {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  };
  function getWindowScrollBinding(update2) {
    return {
      eventName: "scroll",
      options: {
        passive: true,
        capture: false
      },
      fn: function fn(event) {
        if (event.target !== window && event.target !== window.document) {
          return;
        }
        update2();
      }
    };
  }
  function getScrollListener(_ref) {
    var onWindowScroll = _ref.onWindowScroll;
    function updateScroll() {
      onWindowScroll(getWindowScroll());
    }
    var scheduled = rafSchd(updateScroll);
    var binding = getWindowScrollBinding(scheduled);
    var unbind = noop;
    function isActive() {
      return unbind !== noop;
    }
    function start3() {
      !!isActive() ? invariant() : void 0;
      unbind = bindEvents(window, [binding]);
    }
    function stop() {
      !isActive() ? invariant() : void 0;
      scheduled.cancel();
      unbind();
      unbind = noop;
    }
    return {
      start: start3,
      stop,
      isActive
    };
  }
  var shouldEnd = function shouldEnd2(action) {
    return action.type === "DROP_COMPLETE" || action.type === "DROP_ANIMATE" || action.type === "FLUSH";
  };
  var scrollListener = function(store) {
    var listener = getScrollListener({
      onWindowScroll: function onWindowScroll(newScroll) {
        store.dispatch(moveByWindowScroll({
          newScroll
        }));
      }
    });
    return function(next2) {
      return function(action) {
        if (!listener.isActive() && action.type === "INITIAL_PUBLISH") {
          listener.start();
        }
        if (listener.isActive() && shouldEnd(action)) {
          listener.stop();
        }
        next2(action);
      };
    };
  };
  var getExpiringAnnounce = function(announce) {
    var wasCalled = false;
    var isExpired = false;
    var timeoutId = setTimeout(function() {
      isExpired = true;
    });
    var result = function result2(message) {
      if (wasCalled) {
        return;
      }
      if (isExpired) {
        return;
      }
      wasCalled = true;
      announce(message);
      clearTimeout(timeoutId);
    };
    result.wasCalled = function() {
      return wasCalled;
    };
    return result;
  };
  var getAsyncMarshal = function() {
    var entries = [];
    var execute3 = function execute4(timerId) {
      var index2 = findIndex(entries, function(item) {
        return item.timerId === timerId;
      });
      !(index2 !== -1) ? invariant() : void 0;
      var _entries$splice = entries.splice(index2, 1), entry = _entries$splice[0];
      entry.callback();
    };
    var add3 = function add4(fn) {
      var timerId = setTimeout(function() {
        return execute3(timerId);
      });
      var entry = {
        timerId,
        callback: fn
      };
      entries.push(entry);
    };
    var flush3 = function flush4() {
      if (!entries.length) {
        return;
      }
      var shallow = [].concat(entries);
      entries.length = 0;
      shallow.forEach(function(entry) {
        clearTimeout(entry.timerId);
        entry.callback();
      });
    };
    return {
      add: add3,
      flush: flush3
    };
  };
  var areLocationsEqual = function areLocationsEqual2(first, second) {
    if (first == null && second == null) {
      return true;
    }
    if (first == null || second == null) {
      return false;
    }
    return first.droppableId === second.droppableId && first.index === second.index;
  };
  var isCombineEqual = function isCombineEqual2(first, second) {
    if (first == null && second == null) {
      return true;
    }
    if (first == null || second == null) {
      return false;
    }
    return first.draggableId === second.draggableId && first.droppableId === second.droppableId;
  };
  var isCriticalEqual = function isCriticalEqual2(first, second) {
    if (first === second) {
      return true;
    }
    var isDraggableEqual = first.draggable.id === second.draggable.id && first.draggable.droppableId === second.draggable.droppableId && first.draggable.type === second.draggable.type && first.draggable.index === second.draggable.index;
    var isDroppableEqual = first.droppable.id === second.droppable.id && first.droppable.type === second.droppable.type;
    return isDraggableEqual && isDroppableEqual;
  };
  var withTimings = function withTimings2(key, fn) {
    fn();
  };
  var getDragStart = function getDragStart2(critical, mode) {
    return {
      draggableId: critical.draggable.id,
      type: critical.droppable.type,
      source: {
        droppableId: critical.droppable.id,
        index: critical.draggable.index
      },
      mode
    };
  };
  var execute = function execute2(responder, data, announce, getDefaultMessage) {
    if (!responder) {
      announce(getDefaultMessage(data));
      return;
    }
    var willExpire = getExpiringAnnounce(announce);
    var provided = {
      announce: willExpire
    };
    responder(data, provided);
    if (!willExpire.wasCalled()) {
      announce(getDefaultMessage(data));
    }
  };
  var getPublisher = function(getResponders, announce) {
    var asyncMarshal = getAsyncMarshal();
    var dragging = null;
    var beforeCapture = function beforeCapture2(draggableId, mode) {
      !!dragging ? invariant() : void 0;
      withTimings("onBeforeCapture", function() {
        var fn = getResponders().onBeforeCapture;
        if (fn) {
          var before = {
            draggableId,
            mode
          };
          fn(before);
        }
      });
    };
    var beforeStart = function beforeStart2(critical, mode) {
      !!dragging ? invariant() : void 0;
      withTimings("onBeforeDragStart", function() {
        var fn = getResponders().onBeforeDragStart;
        if (fn) {
          fn(getDragStart(critical, mode));
        }
      });
    };
    var start3 = function start4(critical, mode) {
      !!dragging ? invariant() : void 0;
      var data = getDragStart(critical, mode);
      dragging = {
        mode,
        lastCritical: critical,
        lastLocation: data.source,
        lastCombine: null
      };
      asyncMarshal.add(function() {
        withTimings("onDragStart", function() {
          return execute(getResponders().onDragStart, data, announce, preset.onDragStart);
        });
      });
    };
    var update2 = function update3(critical, impact) {
      var location = tryGetDestination(impact);
      var combine2 = tryGetCombine(impact);
      !dragging ? invariant() : void 0;
      var hasCriticalChanged = !isCriticalEqual(critical, dragging.lastCritical);
      if (hasCriticalChanged) {
        dragging.lastCritical = critical;
      }
      var hasLocationChanged = !areLocationsEqual(dragging.lastLocation, location);
      if (hasLocationChanged) {
        dragging.lastLocation = location;
      }
      var hasGroupingChanged = !isCombineEqual(dragging.lastCombine, combine2);
      if (hasGroupingChanged) {
        dragging.lastCombine = combine2;
      }
      if (!hasCriticalChanged && !hasLocationChanged && !hasGroupingChanged) {
        return;
      }
      var data = _extends({}, getDragStart(critical, dragging.mode), {
        combine: combine2,
        destination: location
      });
      asyncMarshal.add(function() {
        withTimings("onDragUpdate", function() {
          return execute(getResponders().onDragUpdate, data, announce, preset.onDragUpdate);
        });
      });
    };
    var flush3 = function flush4() {
      !dragging ? invariant() : void 0;
      asyncMarshal.flush();
    };
    var drop5 = function drop6(result) {
      !dragging ? invariant() : void 0;
      dragging = null;
      withTimings("onDragEnd", function() {
        return execute(getResponders().onDragEnd, result, announce, preset.onDragEnd);
      });
    };
    var abort = function abort2() {
      if (!dragging) {
        return;
      }
      var result = _extends({}, getDragStart(dragging.lastCritical, dragging.mode), {
        combine: null,
        destination: null,
        reason: "CANCEL"
      });
      drop5(result);
    };
    return {
      beforeCapture,
      beforeStart,
      start: start3,
      update: update2,
      flush: flush3,
      drop: drop5,
      abort
    };
  };
  var responders = function(getResponders, announce) {
    var publisher = getPublisher(getResponders, announce);
    return function(store) {
      return function(next2) {
        return function(action) {
          if (action.type === "BEFORE_INITIAL_CAPTURE") {
            publisher.beforeCapture(action.payload.draggableId, action.payload.movementMode);
            return;
          }
          if (action.type === "INITIAL_PUBLISH") {
            var critical = action.payload.critical;
            publisher.beforeStart(critical, action.payload.movementMode);
            next2(action);
            publisher.start(critical, action.payload.movementMode);
            return;
          }
          if (action.type === "DROP_COMPLETE") {
            var result = action.payload.completed.result;
            publisher.flush();
            next2(action);
            publisher.drop(result);
            return;
          }
          next2(action);
          if (action.type === "FLUSH") {
            publisher.abort();
            return;
          }
          var state = store.getState();
          if (state.phase === "DRAGGING") {
            publisher.update(state.critical, state.impact);
          }
        };
      };
    };
  };
  var dropAnimationFinish = function(store) {
    return function(next2) {
      return function(action) {
        if (action.type !== "DROP_ANIMATION_FINISHED") {
          next2(action);
          return;
        }
        var state = store.getState();
        !(state.phase === "DROP_ANIMATING") ? invariant() : void 0;
        store.dispatch(completeDrop({
          completed: state.completed
        }));
      };
    };
  };
  var dropAnimationFlushOnScroll = function(store) {
    var unbind = null;
    var frameId = null;
    function clear() {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (unbind) {
        unbind();
        unbind = null;
      }
    }
    return function(next2) {
      return function(action) {
        if (action.type === "FLUSH" || action.type === "DROP_COMPLETE" || action.type === "DROP_ANIMATION_FINISHED") {
          clear();
        }
        next2(action);
        if (action.type !== "DROP_ANIMATE") {
          return;
        }
        var binding = {
          eventName: "scroll",
          options: {
            capture: true,
            passive: false,
            once: true
          },
          fn: function flushDropAnimation() {
            var state = store.getState();
            if (state.phase === "DROP_ANIMATING") {
              store.dispatch(dropAnimationFinished());
            }
          }
        };
        frameId = requestAnimationFrame(function() {
          frameId = null;
          unbind = bindEvents(window, [binding]);
        });
      };
    };
  };
  var dimensionMarshalStopper = function(marshal) {
    return function() {
      return function(next2) {
        return function(action) {
          if (action.type === "DROP_COMPLETE" || action.type === "FLUSH" || action.type === "DROP_ANIMATE") {
            marshal.stopPublishing();
          }
          next2(action);
        };
      };
    };
  };
  var focus = function(marshal) {
    var isWatching = false;
    return function() {
      return function(next2) {
        return function(action) {
          if (action.type === "INITIAL_PUBLISH") {
            isWatching = true;
            marshal.tryRecordFocus(action.payload.critical.draggable.id);
            next2(action);
            marshal.tryRestoreFocusRecorded();
            return;
          }
          next2(action);
          if (!isWatching) {
            return;
          }
          if (action.type === "FLUSH") {
            isWatching = false;
            marshal.tryRestoreFocusRecorded();
            return;
          }
          if (action.type === "DROP_COMPLETE") {
            isWatching = false;
            var result = action.payload.completed.result;
            if (result.combine) {
              marshal.tryShiftRecord(result.draggableId, result.combine.draggableId);
            }
            marshal.tryRestoreFocusRecorded();
          }
        };
      };
    };
  };
  var shouldStop = function shouldStop2(action) {
    return action.type === "DROP_COMPLETE" || action.type === "DROP_ANIMATE" || action.type === "FLUSH";
  };
  var autoScroll = function(autoScroller) {
    return function(store) {
      return function(next2) {
        return function(action) {
          if (shouldStop(action)) {
            autoScroller.stop();
            next2(action);
            return;
          }
          if (action.type === "INITIAL_PUBLISH") {
            next2(action);
            var state = store.getState();
            !(state.phase === "DRAGGING") ? invariant() : void 0;
            autoScroller.start(state);
            return;
          }
          next2(action);
          autoScroller.scroll(store.getState());
        };
      };
    };
  };
  var pendingDrop = function(store) {
    return function(next2) {
      return function(action) {
        next2(action);
        if (action.type !== "PUBLISH_WHILE_DRAGGING") {
          return;
        }
        var postActionState = store.getState();
        if (postActionState.phase !== "DROP_PENDING") {
          return;
        }
        if (postActionState.isWaiting) {
          return;
        }
        store.dispatch(drop({
          reason: postActionState.reason
        }));
      };
    };
  };
  var composeEnhancers = compose;
  var createStore = function(_ref) {
    var dimensionMarshal = _ref.dimensionMarshal, focusMarshal = _ref.focusMarshal, styleMarshal = _ref.styleMarshal, getResponders = _ref.getResponders, announce = _ref.announce, autoScroller = _ref.autoScroller;
    return createStore$1(reducer, composeEnhancers(applyMiddleware(style(styleMarshal), dimensionMarshalStopper(dimensionMarshal), lift$1(dimensionMarshal), drop$1, dropAnimationFinish, dropAnimationFlushOnScroll, pendingDrop, autoScroll(autoScroller), scrollListener, focus(focusMarshal), responders(getResponders, announce))));
  };
  var clean$1 = function clean3() {
    return {
      additions: {},
      removals: {},
      modified: {}
    };
  };
  function createPublisher(_ref) {
    var registry = _ref.registry, callbacks = _ref.callbacks;
    var staging = clean$1();
    var frameId = null;
    var collect = function collect2() {
      if (frameId) {
        return;
      }
      callbacks.collectionStarting();
      frameId = requestAnimationFrame(function() {
        frameId = null;
        var _staging = staging, additions = _staging.additions, removals = _staging.removals, modified = _staging.modified;
        var added = Object.keys(additions).map(function(id) {
          return registry.draggable.getById(id).getDimension(origin);
        }).sort(function(a, b2) {
          return a.descriptor.index - b2.descriptor.index;
        });
        var updated = Object.keys(modified).map(function(id) {
          var entry = registry.droppable.getById(id);
          var scroll3 = entry.callbacks.getScrollWhileDragging();
          return {
            droppableId: id,
            scroll: scroll3
          };
        });
        var result = {
          additions: added,
          removals: Object.keys(removals),
          modified: updated
        };
        staging = clean$1();
        callbacks.publish(result);
      });
    };
    var add3 = function add4(entry) {
      var id = entry.descriptor.id;
      staging.additions[id] = entry;
      staging.modified[entry.descriptor.droppableId] = true;
      if (staging.removals[id]) {
        delete staging.removals[id];
      }
      collect();
    };
    var remove = function remove2(entry) {
      var descriptor = entry.descriptor;
      staging.removals[descriptor.id] = true;
      staging.modified[descriptor.droppableId] = true;
      if (staging.additions[descriptor.id]) {
        delete staging.additions[descriptor.id];
      }
      collect();
    };
    var stop = function stop2() {
      if (!frameId) {
        return;
      }
      cancelAnimationFrame(frameId);
      frameId = null;
      staging = clean$1();
    };
    return {
      add: add3,
      remove,
      stop
    };
  }
  var getMaxScroll = function(_ref) {
    var scrollHeight = _ref.scrollHeight, scrollWidth = _ref.scrollWidth, height2 = _ref.height, width2 = _ref.width;
    var maxScroll = subtract({
      x: scrollWidth,
      y: scrollHeight
    }, {
      x: width2,
      y: height2
    });
    var adjustedMaxScroll = {
      x: Math.max(0, maxScroll.x),
      y: Math.max(0, maxScroll.y)
    };
    return adjustedMaxScroll;
  };
  var getDocumentElement = function() {
    var doc = document.documentElement;
    !doc ? invariant() : void 0;
    return doc;
  };
  var getMaxWindowScroll = function() {
    var doc = getDocumentElement();
    var maxScroll = getMaxScroll({
      scrollHeight: doc.scrollHeight,
      scrollWidth: doc.scrollWidth,
      width: doc.clientWidth,
      height: doc.clientHeight
    });
    return maxScroll;
  };
  var getViewport = function() {
    var scroll3 = getWindowScroll();
    var maxScroll = getMaxWindowScroll();
    var top = scroll3.y;
    var left = scroll3.x;
    var doc = getDocumentElement();
    var width2 = doc.clientWidth;
    var height2 = doc.clientHeight;
    var right = left + width2;
    var bottom = top + height2;
    var frame = getRect({
      top,
      left,
      right,
      bottom
    });
    var viewport = {
      frame,
      scroll: {
        initial: scroll3,
        current: scroll3,
        max: maxScroll,
        diff: {
          value: origin,
          displacement: origin
        }
      }
    };
    return viewport;
  };
  var getInitialPublish = function(_ref) {
    var critical = _ref.critical, scrollOptions = _ref.scrollOptions, registry = _ref.registry;
    var viewport = getViewport();
    var windowScroll = viewport.scroll.current;
    var home2 = critical.droppable;
    var droppables = registry.droppable.getAllByType(home2.type).map(function(entry) {
      return entry.callbacks.getDimensionAndWatchScroll(windowScroll, scrollOptions);
    });
    var draggables = registry.draggable.getAllByType(critical.draggable.type).map(function(entry) {
      return entry.getDimension(windowScroll);
    });
    var dimensions = {
      draggables: toDraggableMap(draggables),
      droppables: toDroppableMap(droppables)
    };
    var result = {
      dimensions,
      critical,
      viewport
    };
    return result;
  };
  function shouldPublishUpdate(registry, dragging, entry) {
    if (entry.descriptor.id === dragging.id) {
      return false;
    }
    if (entry.descriptor.type !== dragging.type) {
      return false;
    }
    var home2 = registry.droppable.getById(entry.descriptor.droppableId);
    if (home2.descriptor.mode !== "virtual") {
      return false;
    }
    return true;
  }
  var createDimensionMarshal = function(registry, callbacks) {
    var collection = null;
    var publisher = createPublisher({
      callbacks: {
        publish: callbacks.publishWhileDragging,
        collectionStarting: callbacks.collectionStarting
      },
      registry
    });
    var updateDroppableIsEnabled3 = function updateDroppableIsEnabled4(id, isEnabled) {
      !registry.droppable.exists(id) ? invariant() : void 0;
      if (!collection) {
        return;
      }
      callbacks.updateDroppableIsEnabled({
        id,
        isEnabled
      });
    };
    var updateDroppableIsCombineEnabled3 = function updateDroppableIsCombineEnabled4(id, isCombineEnabled) {
      if (!collection) {
        return;
      }
      !registry.droppable.exists(id) ? invariant() : void 0;
      callbacks.updateDroppableIsCombineEnabled({
        id,
        isCombineEnabled
      });
    };
    var updateDroppableScroll3 = function updateDroppableScroll4(id, newScroll) {
      if (!collection) {
        return;
      }
      !registry.droppable.exists(id) ? invariant() : void 0;
      callbacks.updateDroppableScroll({
        id,
        newScroll
      });
    };
    var scrollDroppable2 = function scrollDroppable3(id, change) {
      if (!collection) {
        return;
      }
      registry.droppable.getById(id).callbacks.scroll(change);
    };
    var stopPublishing = function stopPublishing2() {
      if (!collection) {
        return;
      }
      publisher.stop();
      var home2 = collection.critical.droppable;
      registry.droppable.getAllByType(home2.type).forEach(function(entry) {
        return entry.callbacks.dragStopped();
      });
      collection.unsubscribe();
      collection = null;
    };
    var subscriber = function subscriber2(event) {
      !collection ? invariant() : void 0;
      var dragging = collection.critical.draggable;
      if (event.type === "ADDITION") {
        if (shouldPublishUpdate(registry, dragging, event.value)) {
          publisher.add(event.value);
        }
      }
      if (event.type === "REMOVAL") {
        if (shouldPublishUpdate(registry, dragging, event.value)) {
          publisher.remove(event.value);
        }
      }
    };
    var startPublishing = function startPublishing2(request) {
      !!collection ? invariant() : void 0;
      var entry = registry.draggable.getById(request.draggableId);
      var home2 = registry.droppable.getById(entry.descriptor.droppableId);
      var critical = {
        draggable: entry.descriptor,
        droppable: home2.descriptor
      };
      var unsubscribe = registry.subscribe(subscriber);
      collection = {
        critical,
        unsubscribe
      };
      return getInitialPublish({
        critical,
        registry,
        scrollOptions: request.scrollOptions
      });
    };
    var marshal = {
      updateDroppableIsEnabled: updateDroppableIsEnabled3,
      updateDroppableIsCombineEnabled: updateDroppableIsCombineEnabled3,
      scrollDroppable: scrollDroppable2,
      updateDroppableScroll: updateDroppableScroll3,
      startPublishing,
      stopPublishing
    };
    return marshal;
  };
  var canStartDrag = function(state, id) {
    if (state.phase === "IDLE") {
      return true;
    }
    if (state.phase !== "DROP_ANIMATING") {
      return false;
    }
    if (state.completed.result.draggableId === id) {
      return false;
    }
    return state.completed.result.reason === "DROP";
  };
  var scrollWindow = function(change) {
    window.scrollBy(change.x, change.y);
  };
  var getScrollableDroppables = memoizeOne(function(droppables) {
    return toDroppableList(droppables).filter(function(droppable2) {
      if (!droppable2.isEnabled) {
        return false;
      }
      if (!droppable2.frame) {
        return false;
      }
      return true;
    });
  });
  var getScrollableDroppableOver = function getScrollableDroppableOver2(target, droppables) {
    var maybe = find(getScrollableDroppables(droppables), function(droppable2) {
      !droppable2.frame ? invariant() : void 0;
      return isPositionInFrame(droppable2.frame.pageMarginBox)(target);
    });
    return maybe;
  };
  var getBestScrollableDroppable = function(_ref) {
    var center = _ref.center, destination = _ref.destination, droppables = _ref.droppables;
    if (destination) {
      var _dimension = droppables[destination];
      if (!_dimension.frame) {
        return null;
      }
      return _dimension;
    }
    var dimension = getScrollableDroppableOver(center, droppables);
    return dimension;
  };
  var config = {
    startFromPercentage: 0.25,
    maxScrollAtPercentage: 0.05,
    maxPixelScroll: 28,
    ease: function ease(percentage) {
      return Math.pow(percentage, 2);
    },
    durationDampening: {
      stopDampeningAt: 1200,
      accelerateAt: 360
    }
  };
  var getDistanceThresholds = function(container, axis) {
    var startScrollingFrom = container[axis.size] * config.startFromPercentage;
    var maxScrollValueAt = container[axis.size] * config.maxScrollAtPercentage;
    var thresholds = {
      startScrollingFrom,
      maxScrollValueAt
    };
    return thresholds;
  };
  var getPercentage = function(_ref) {
    var startOfRange = _ref.startOfRange, endOfRange = _ref.endOfRange, current = _ref.current;
    var range = endOfRange - startOfRange;
    if (range === 0) {
      return 0;
    }
    var currentInRange = current - startOfRange;
    var percentage = currentInRange / range;
    return percentage;
  };
  var minScroll = 1;
  var getValueFromDistance = function(distanceToEdge, thresholds) {
    if (distanceToEdge > thresholds.startScrollingFrom) {
      return 0;
    }
    if (distanceToEdge <= thresholds.maxScrollValueAt) {
      return config.maxPixelScroll;
    }
    if (distanceToEdge === thresholds.startScrollingFrom) {
      return minScroll;
    }
    var percentageFromMaxScrollValueAt = getPercentage({
      startOfRange: thresholds.maxScrollValueAt,
      endOfRange: thresholds.startScrollingFrom,
      current: distanceToEdge
    });
    var percentageFromStartScrollingFrom = 1 - percentageFromMaxScrollValueAt;
    var scroll3 = config.maxPixelScroll * config.ease(percentageFromStartScrollingFrom);
    return Math.ceil(scroll3);
  };
  var accelerateAt = config.durationDampening.accelerateAt;
  var stopAt = config.durationDampening.stopDampeningAt;
  var dampenValueByTime = function(proposedScroll, dragStartTime) {
    var startOfRange = dragStartTime;
    var endOfRange = stopAt;
    var now = Date.now();
    var runTime = now - startOfRange;
    if (runTime >= stopAt) {
      return proposedScroll;
    }
    if (runTime < accelerateAt) {
      return minScroll;
    }
    var betweenAccelerateAtAndStopAtPercentage = getPercentage({
      startOfRange: accelerateAt,
      endOfRange,
      current: runTime
    });
    var scroll3 = proposedScroll * config.ease(betweenAccelerateAtAndStopAtPercentage);
    return Math.ceil(scroll3);
  };
  var getValue = function(_ref) {
    var distanceToEdge = _ref.distanceToEdge, thresholds = _ref.thresholds, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
    var scroll3 = getValueFromDistance(distanceToEdge, thresholds);
    if (scroll3 === 0) {
      return 0;
    }
    if (!shouldUseTimeDampening) {
      return scroll3;
    }
    return Math.max(dampenValueByTime(scroll3, dragStartTime), minScroll);
  };
  var getScrollOnAxis = function(_ref) {
    var container = _ref.container, distanceToEdges = _ref.distanceToEdges, dragStartTime = _ref.dragStartTime, axis = _ref.axis, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
    var thresholds = getDistanceThresholds(container, axis);
    var isCloserToEnd = distanceToEdges[axis.end] < distanceToEdges[axis.start];
    if (isCloserToEnd) {
      return getValue({
        distanceToEdge: distanceToEdges[axis.end],
        thresholds,
        dragStartTime,
        shouldUseTimeDampening
      });
    }
    return -1 * getValue({
      distanceToEdge: distanceToEdges[axis.start],
      thresholds,
      dragStartTime,
      shouldUseTimeDampening
    });
  };
  var adjustForSizeLimits = function(_ref) {
    var container = _ref.container, subject = _ref.subject, proposedScroll = _ref.proposedScroll;
    var isTooBigVertically = subject.height > container.height;
    var isTooBigHorizontally = subject.width > container.width;
    if (!isTooBigHorizontally && !isTooBigVertically) {
      return proposedScroll;
    }
    if (isTooBigHorizontally && isTooBigVertically) {
      return null;
    }
    return {
      x: isTooBigHorizontally ? 0 : proposedScroll.x,
      y: isTooBigVertically ? 0 : proposedScroll.y
    };
  };
  var clean$2 = apply(function(value) {
    return value === 0 ? 0 : value;
  });
  var getScroll = function(_ref) {
    var dragStartTime = _ref.dragStartTime, container = _ref.container, subject = _ref.subject, center = _ref.center, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
    var distanceToEdges = {
      top: center.y - container.top,
      right: container.right - center.x,
      bottom: container.bottom - center.y,
      left: center.x - container.left
    };
    var y2 = getScrollOnAxis({
      container,
      distanceToEdges,
      dragStartTime,
      axis: vertical,
      shouldUseTimeDampening
    });
    var x = getScrollOnAxis({
      container,
      distanceToEdges,
      dragStartTime,
      axis: horizontal,
      shouldUseTimeDampening
    });
    var required2 = clean$2({
      x,
      y: y2
    });
    if (isEqual(required2, origin)) {
      return null;
    }
    var limited = adjustForSizeLimits({
      container,
      subject,
      proposedScroll: required2
    });
    if (!limited) {
      return null;
    }
    return isEqual(limited, origin) ? null : limited;
  };
  var smallestSigned = apply(function(value) {
    if (value === 0) {
      return 0;
    }
    return value > 0 ? 1 : -1;
  });
  var getOverlap = /* @__PURE__ */ function() {
    var getRemainder = function getRemainder2(target, max) {
      if (target < 0) {
        return target;
      }
      if (target > max) {
        return target - max;
      }
      return 0;
    };
    return function(_ref) {
      var current = _ref.current, max = _ref.max, change = _ref.change;
      var targetScroll = add(current, change);
      var overlap = {
        x: getRemainder(targetScroll.x, max.x),
        y: getRemainder(targetScroll.y, max.y)
      };
      if (isEqual(overlap, origin)) {
        return null;
      }
      return overlap;
    };
  }();
  var canPartiallyScroll = function canPartiallyScroll2(_ref2) {
    var rawMax = _ref2.max, current = _ref2.current, change = _ref2.change;
    var max = {
      x: Math.max(current.x, rawMax.x),
      y: Math.max(current.y, rawMax.y)
    };
    var smallestChange = smallestSigned(change);
    var overlap = getOverlap({
      max,
      current,
      change: smallestChange
    });
    if (!overlap) {
      return true;
    }
    if (smallestChange.x !== 0 && overlap.x === 0) {
      return true;
    }
    if (smallestChange.y !== 0 && overlap.y === 0) {
      return true;
    }
    return false;
  };
  var canScrollWindow = function canScrollWindow2(viewport, change) {
    return canPartiallyScroll({
      current: viewport.scroll.current,
      max: viewport.scroll.max,
      change
    });
  };
  var getWindowOverlap = function getWindowOverlap2(viewport, change) {
    if (!canScrollWindow(viewport, change)) {
      return null;
    }
    var max = viewport.scroll.max;
    var current = viewport.scroll.current;
    return getOverlap({
      current,
      max,
      change
    });
  };
  var canScrollDroppable = function canScrollDroppable2(droppable2, change) {
    var frame = droppable2.frame;
    if (!frame) {
      return false;
    }
    return canPartiallyScroll({
      current: frame.scroll.current,
      max: frame.scroll.max,
      change
    });
  };
  var getDroppableOverlap = function getDroppableOverlap2(droppable2, change) {
    var frame = droppable2.frame;
    if (!frame) {
      return null;
    }
    if (!canScrollDroppable(droppable2, change)) {
      return null;
    }
    return getOverlap({
      current: frame.scroll.current,
      max: frame.scroll.max,
      change
    });
  };
  var getWindowScrollChange = function(_ref) {
    var viewport = _ref.viewport, subject = _ref.subject, center = _ref.center, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
    var scroll3 = getScroll({
      dragStartTime,
      container: viewport.frame,
      subject,
      center,
      shouldUseTimeDampening
    });
    return scroll3 && canScrollWindow(viewport, scroll3) ? scroll3 : null;
  };
  var getDroppableScrollChange = function(_ref) {
    var droppable2 = _ref.droppable, subject = _ref.subject, center = _ref.center, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening;
    var frame = droppable2.frame;
    if (!frame) {
      return null;
    }
    var scroll3 = getScroll({
      dragStartTime,
      container: frame.pageMarginBox,
      subject,
      center,
      shouldUseTimeDampening
    });
    return scroll3 && canScrollDroppable(droppable2, scroll3) ? scroll3 : null;
  };
  var scroll$1 = function(_ref) {
    var state = _ref.state, dragStartTime = _ref.dragStartTime, shouldUseTimeDampening = _ref.shouldUseTimeDampening, scrollWindow2 = _ref.scrollWindow, scrollDroppable2 = _ref.scrollDroppable;
    var center = state.current.page.borderBoxCenter;
    var draggable2 = state.dimensions.draggables[state.critical.draggable.id];
    var subject = draggable2.page.marginBox;
    if (state.isWindowScrollAllowed) {
      var viewport = state.viewport;
      var _change = getWindowScrollChange({
        dragStartTime,
        viewport,
        subject,
        center,
        shouldUseTimeDampening
      });
      if (_change) {
        scrollWindow2(_change);
        return;
      }
    }
    var droppable2 = getBestScrollableDroppable({
      center,
      destination: whatIsDraggedOver(state.impact),
      droppables: state.dimensions.droppables
    });
    if (!droppable2) {
      return;
    }
    var change = getDroppableScrollChange({
      dragStartTime,
      droppable: droppable2,
      subject,
      center,
      shouldUseTimeDampening
    });
    if (change) {
      scrollDroppable2(droppable2.descriptor.id, change);
    }
  };
  var createFluidScroller = function(_ref) {
    var scrollWindow2 = _ref.scrollWindow, scrollDroppable2 = _ref.scrollDroppable;
    var scheduleWindowScroll = rafSchd(scrollWindow2);
    var scheduleDroppableScroll = rafSchd(scrollDroppable2);
    var dragging = null;
    var tryScroll = function tryScroll2(state) {
      !dragging ? invariant() : void 0;
      var _dragging = dragging, shouldUseTimeDampening = _dragging.shouldUseTimeDampening, dragStartTime = _dragging.dragStartTime;
      scroll$1({
        state,
        scrollWindow: scheduleWindowScroll,
        scrollDroppable: scheduleDroppableScroll,
        dragStartTime,
        shouldUseTimeDampening
      });
    };
    var start$1 = function start$12(state) {
      !!dragging ? invariant() : void 0;
      var dragStartTime = Date.now();
      var wasScrollNeeded = false;
      var fakeScrollCallback = function fakeScrollCallback2() {
        wasScrollNeeded = true;
      };
      scroll$1({
        state,
        dragStartTime: 0,
        shouldUseTimeDampening: false,
        scrollWindow: fakeScrollCallback,
        scrollDroppable: fakeScrollCallback
      });
      dragging = {
        dragStartTime,
        shouldUseTimeDampening: wasScrollNeeded
      };
      if (wasScrollNeeded) {
        tryScroll(state);
      }
    };
    var stop = function stop2() {
      if (!dragging) {
        return;
      }
      scheduleWindowScroll.cancel();
      scheduleDroppableScroll.cancel();
      dragging = null;
    };
    return {
      start: start$1,
      stop,
      scroll: tryScroll
    };
  };
  var createJumpScroller = function(_ref) {
    var move3 = _ref.move, scrollDroppable2 = _ref.scrollDroppable, scrollWindow2 = _ref.scrollWindow;
    var moveByOffset = function moveByOffset2(state, offset22) {
      var client2 = add(state.current.client.selection, offset22);
      move3({
        client: client2
      });
    };
    var scrollDroppableAsMuchAsItCan = function scrollDroppableAsMuchAsItCan2(droppable2, change) {
      if (!canScrollDroppable(droppable2, change)) {
        return change;
      }
      var overlap = getDroppableOverlap(droppable2, change);
      if (!overlap) {
        scrollDroppable2(droppable2.descriptor.id, change);
        return null;
      }
      var whatTheDroppableCanScroll = subtract(change, overlap);
      scrollDroppable2(droppable2.descriptor.id, whatTheDroppableCanScroll);
      var remainder = subtract(change, whatTheDroppableCanScroll);
      return remainder;
    };
    var scrollWindowAsMuchAsItCan = function scrollWindowAsMuchAsItCan2(isWindowScrollAllowed, viewport, change) {
      if (!isWindowScrollAllowed) {
        return change;
      }
      if (!canScrollWindow(viewport, change)) {
        return change;
      }
      var overlap = getWindowOverlap(viewport, change);
      if (!overlap) {
        scrollWindow2(change);
        return null;
      }
      var whatTheWindowCanScroll = subtract(change, overlap);
      scrollWindow2(whatTheWindowCanScroll);
      var remainder = subtract(change, whatTheWindowCanScroll);
      return remainder;
    };
    var jumpScroller = function jumpScroller2(state) {
      var request = state.scrollJumpRequest;
      if (!request) {
        return;
      }
      var destination = whatIsDraggedOver(state.impact);
      !destination ? invariant() : void 0;
      var droppableRemainder = scrollDroppableAsMuchAsItCan(state.dimensions.droppables[destination], request);
      if (!droppableRemainder) {
        return;
      }
      var viewport = state.viewport;
      var windowRemainder = scrollWindowAsMuchAsItCan(state.isWindowScrollAllowed, viewport, droppableRemainder);
      if (!windowRemainder) {
        return;
      }
      moveByOffset(state, windowRemainder);
    };
    return jumpScroller;
  };
  var createAutoScroller = function(_ref) {
    var scrollDroppable2 = _ref.scrollDroppable, scrollWindow2 = _ref.scrollWindow, move3 = _ref.move;
    var fluidScroller = createFluidScroller({
      scrollWindow: scrollWindow2,
      scrollDroppable: scrollDroppable2
    });
    var jumpScroll = createJumpScroller({
      move: move3,
      scrollWindow: scrollWindow2,
      scrollDroppable: scrollDroppable2
    });
    var scroll3 = function scroll4(state) {
      if (state.phase !== "DRAGGING") {
        return;
      }
      if (state.movementMode === "FLUID") {
        fluidScroller.scroll(state);
        return;
      }
      if (!state.scrollJumpRequest) {
        return;
      }
      jumpScroll(state);
    };
    var scroller = {
      scroll: scroll3,
      start: fluidScroller.start,
      stop: fluidScroller.stop
    };
    return scroller;
  };
  var prefix$1 = "data-rbd";
  var dragHandle = function() {
    var base = prefix$1 + "-drag-handle";
    return {
      base,
      draggableId: base + "-draggable-id",
      contextId: base + "-context-id"
    };
  }();
  var draggable = function() {
    var base = prefix$1 + "-draggable";
    return {
      base,
      contextId: base + "-context-id",
      id: base + "-id"
    };
  }();
  var droppable = function() {
    var base = prefix$1 + "-droppable";
    return {
      base,
      contextId: base + "-context-id",
      id: base + "-id"
    };
  }();
  var scrollContainer = {
    contextId: prefix$1 + "-scroll-container-context-id"
  };
  var makeGetSelector = function makeGetSelector2(context) {
    return function(attribute) {
      return "[" + attribute + '="' + context + '"]';
    };
  };
  var getStyles = function getStyles2(rules, property) {
    return rules.map(function(rule) {
      var value = rule.styles[property];
      if (!value) {
        return "";
      }
      return rule.selector + " { " + value + " }";
    }).join(" ");
  };
  var noPointerEvents = "pointer-events: none;";
  var getStyles$1 = function(contextId) {
    var getSelector2 = makeGetSelector(contextId);
    var dragHandle$1 = function() {
      var grabCursor = "\n      cursor: -webkit-grab;\n      cursor: grab;\n    ";
      return {
        selector: getSelector2(dragHandle.contextId),
        styles: {
          always: "\n          -webkit-touch-callout: none;\n          -webkit-tap-highlight-color: rgba(0,0,0,0);\n          touch-action: manipulation;\n        ",
          resting: grabCursor,
          dragging: noPointerEvents,
          dropAnimating: grabCursor
        }
      };
    }();
    var draggable$1 = function() {
      var transition = "\n      transition: " + transitions.outOfTheWay + ";\n    ";
      return {
        selector: getSelector2(draggable.contextId),
        styles: {
          dragging: transition,
          dropAnimating: transition,
          userCancel: transition
        }
      };
    }();
    var droppable$1 = {
      selector: getSelector2(droppable.contextId),
      styles: {
        always: "overflow-anchor: none;"
      }
    };
    var body = {
      selector: "body",
      styles: {
        dragging: "\n        cursor: grabbing;\n        cursor: -webkit-grabbing;\n        user-select: none;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        overflow-anchor: none;\n      "
      }
    };
    var rules = [draggable$1, dragHandle$1, droppable$1, body];
    return {
      always: getStyles(rules, "always"),
      resting: getStyles(rules, "resting"),
      dragging: getStyles(rules, "dragging"),
      dropAnimating: getStyles(rules, "dropAnimating"),
      userCancel: getStyles(rules, "userCancel")
    };
  };
  var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? React.useLayoutEffect : React.useEffect;
  var getHead = function getHead2() {
    var head = document.querySelector("head");
    !head ? invariant() : void 0;
    return head;
  };
  var createStyleEl = function createStyleEl2(nonce) {
    var el = document.createElement("style");
    if (nonce) {
      el.setAttribute("nonce", nonce);
    }
    el.type = "text/css";
    return el;
  };
  function useStyleMarshal(contextId, nonce) {
    var styles2 = useMemo(function() {
      return getStyles$1(contextId);
    }, [contextId]);
    var alwaysRef = React.useRef(null);
    var dynamicRef = React.useRef(null);
    var setDynamicStyle = useCallback(memoizeOne(function(proposed) {
      var el = dynamicRef.current;
      !el ? invariant() : void 0;
      el.textContent = proposed;
    }), []);
    var setAlwaysStyle = useCallback(function(proposed) {
      var el = alwaysRef.current;
      !el ? invariant() : void 0;
      el.textContent = proposed;
    }, []);
    useIsomorphicLayoutEffect(function() {
      !(!alwaysRef.current && !dynamicRef.current) ? invariant() : void 0;
      var always = createStyleEl(nonce);
      var dynamic = createStyleEl(nonce);
      alwaysRef.current = always;
      dynamicRef.current = dynamic;
      always.setAttribute(prefix$1 + "-always", contextId);
      dynamic.setAttribute(prefix$1 + "-dynamic", contextId);
      getHead().appendChild(always);
      getHead().appendChild(dynamic);
      setAlwaysStyle(styles2.always);
      setDynamicStyle(styles2.resting);
      return function() {
        var remove = function remove2(ref2) {
          var current = ref2.current;
          !current ? invariant() : void 0;
          getHead().removeChild(current);
          ref2.current = null;
        };
        remove(alwaysRef);
        remove(dynamicRef);
      };
    }, [nonce, setAlwaysStyle, setDynamicStyle, styles2.always, styles2.resting, contextId]);
    var dragging = useCallback(function() {
      return setDynamicStyle(styles2.dragging);
    }, [setDynamicStyle, styles2.dragging]);
    var dropping = useCallback(function(reason) {
      if (reason === "DROP") {
        setDynamicStyle(styles2.dropAnimating);
        return;
      }
      setDynamicStyle(styles2.userCancel);
    }, [setDynamicStyle, styles2.dropAnimating, styles2.userCancel]);
    var resting = useCallback(function() {
      if (!dynamicRef.current) {
        return;
      }
      setDynamicStyle(styles2.resting);
    }, [setDynamicStyle, styles2.resting]);
    var marshal = useMemo(function() {
      return {
        dragging,
        dropping,
        resting
      };
    }, [dragging, dropping, resting]);
    return marshal;
  }
  var getWindowFromEl = function(el) {
    return el && el.ownerDocument ? el.ownerDocument.defaultView : window;
  };
  function isHtmlElement(el) {
    return el instanceof getWindowFromEl(el).HTMLElement;
  }
  function findDragHandle(contextId, draggableId) {
    var selector = "[" + dragHandle.contextId + '="' + contextId + '"]';
    var possible = toArray(document.querySelectorAll(selector));
    if (!possible.length) {
      return null;
    }
    var handle = find(possible, function(el) {
      return el.getAttribute(dragHandle.draggableId) === draggableId;
    });
    if (!handle) {
      return null;
    }
    if (!isHtmlElement(handle)) {
      return null;
    }
    return handle;
  }
  function useFocusMarshal(contextId) {
    var entriesRef = React.useRef({});
    var recordRef = React.useRef(null);
    var restoreFocusFrameRef = React.useRef(null);
    var isMountedRef = React.useRef(false);
    var register = useCallback(function register2(id, focus2) {
      var entry = {
        id,
        focus: focus2
      };
      entriesRef.current[id] = entry;
      return function unregister() {
        var entries = entriesRef.current;
        var current = entries[id];
        if (current !== entry) {
          delete entries[id];
        }
      };
    }, []);
    var tryGiveFocus = useCallback(function tryGiveFocus2(tryGiveFocusTo) {
      var handle = findDragHandle(contextId, tryGiveFocusTo);
      if (handle && handle !== document.activeElement) {
        handle.focus();
      }
    }, [contextId]);
    var tryShiftRecord = useCallback(function tryShiftRecord2(previous, redirectTo) {
      if (recordRef.current === previous) {
        recordRef.current = redirectTo;
      }
    }, []);
    var tryRestoreFocusRecorded = useCallback(function tryRestoreFocusRecorded2() {
      if (restoreFocusFrameRef.current) {
        return;
      }
      if (!isMountedRef.current) {
        return;
      }
      restoreFocusFrameRef.current = requestAnimationFrame(function() {
        restoreFocusFrameRef.current = null;
        var record = recordRef.current;
        if (record) {
          tryGiveFocus(record);
        }
      });
    }, [tryGiveFocus]);
    var tryRecordFocus = useCallback(function tryRecordFocus2(id) {
      recordRef.current = null;
      var focused = document.activeElement;
      if (!focused) {
        return;
      }
      if (focused.getAttribute(dragHandle.draggableId) !== id) {
        return;
      }
      recordRef.current = id;
    }, []);
    useIsomorphicLayoutEffect(function() {
      isMountedRef.current = true;
      return function clearFrameOnUnmount() {
        isMountedRef.current = false;
        var frameId = restoreFocusFrameRef.current;
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    }, []);
    var marshal = useMemo(function() {
      return {
        register,
        tryRecordFocus,
        tryRestoreFocusRecorded,
        tryShiftRecord
      };
    }, [register, tryRecordFocus, tryRestoreFocusRecorded, tryShiftRecord]);
    return marshal;
  }
  function createRegistry() {
    var entries = {
      draggables: {},
      droppables: {}
    };
    var subscribers = [];
    function subscribe(cb) {
      subscribers.push(cb);
      return function unsubscribe() {
        var index2 = subscribers.indexOf(cb);
        if (index2 === -1) {
          return;
        }
        subscribers.splice(index2, 1);
      };
    }
    function notify2(event) {
      if (subscribers.length) {
        subscribers.forEach(function(cb) {
          return cb(event);
        });
      }
    }
    function findDraggableById(id) {
      return entries.draggables[id] || null;
    }
    function getDraggableById(id) {
      var entry = findDraggableById(id);
      !entry ? invariant() : void 0;
      return entry;
    }
    var draggableAPI = {
      register: function register(entry) {
        entries.draggables[entry.descriptor.id] = entry;
        notify2({
          type: "ADDITION",
          value: entry
        });
      },
      update: function update2(entry, last) {
        var current = entries.draggables[last.descriptor.id];
        if (!current) {
          return;
        }
        if (current.uniqueId !== entry.uniqueId) {
          return;
        }
        delete entries.draggables[last.descriptor.id];
        entries.draggables[entry.descriptor.id] = entry;
      },
      unregister: function unregister(entry) {
        var draggableId = entry.descriptor.id;
        var current = findDraggableById(draggableId);
        if (!current) {
          return;
        }
        if (entry.uniqueId !== current.uniqueId) {
          return;
        }
        delete entries.draggables[draggableId];
        notify2({
          type: "REMOVAL",
          value: entry
        });
      },
      getById: getDraggableById,
      findById: findDraggableById,
      exists: function exists(id) {
        return Boolean(findDraggableById(id));
      },
      getAllByType: function getAllByType(type) {
        return values(entries.draggables).filter(function(entry) {
          return entry.descriptor.type === type;
        });
      }
    };
    function findDroppableById(id) {
      return entries.droppables[id] || null;
    }
    function getDroppableById(id) {
      var entry = findDroppableById(id);
      !entry ? invariant() : void 0;
      return entry;
    }
    var droppableAPI = {
      register: function register(entry) {
        entries.droppables[entry.descriptor.id] = entry;
      },
      unregister: function unregister(entry) {
        var current = findDroppableById(entry.descriptor.id);
        if (!current) {
          return;
        }
        if (entry.uniqueId !== current.uniqueId) {
          return;
        }
        delete entries.droppables[entry.descriptor.id];
      },
      getById: getDroppableById,
      findById: findDroppableById,
      exists: function exists(id) {
        return Boolean(findDroppableById(id));
      },
      getAllByType: function getAllByType(type) {
        return values(entries.droppables).filter(function(entry) {
          return entry.descriptor.type === type;
        });
      }
    };
    function clean4() {
      entries.draggables = {};
      entries.droppables = {};
      subscribers.length = 0;
    }
    return {
      draggable: draggableAPI,
      droppable: droppableAPI,
      subscribe,
      clean: clean4
    };
  }
  function useRegistry() {
    var registry = useMemo(createRegistry, []);
    React.useEffect(function() {
      return function unmount() {
        requestAnimationFrame(registry.clean);
      };
    }, [registry]);
    return registry;
  }
  var StoreContext = React.createContext(null);
  var getBodyElement = function() {
    var body = document.body;
    !body ? invariant() : void 0;
    return body;
  };
  var visuallyHidden = {
    position: "absolute",
    width: "1px",
    height: "1px",
    margin: "-1px",
    border: "0",
    padding: "0",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    "clip-path": "inset(100%)"
  };
  var getId = function getId2(contextId) {
    return "rbd-announcement-" + contextId;
  };
  function useAnnouncer(contextId) {
    var id = useMemo(function() {
      return getId(contextId);
    }, [contextId]);
    var ref2 = React.useRef(null);
    React.useEffect(function setup() {
      var el = document.createElement("div");
      ref2.current = el;
      el.id = id;
      el.setAttribute("aria-live", "assertive");
      el.setAttribute("aria-atomic", "true");
      _extends(el.style, visuallyHidden);
      getBodyElement().appendChild(el);
      return function cleanup() {
        setTimeout(function remove() {
          var body = getBodyElement();
          if (body.contains(el)) {
            body.removeChild(el);
          }
          if (el === ref2.current) {
            ref2.current = null;
          }
        });
      };
    }, [id]);
    var announce = useCallback(function(message) {
      var el = ref2.current;
      if (el) {
        el.textContent = message;
        return;
      }
    }, []);
    return announce;
  }
  var count = 0;
  var defaults = {
    separator: "::"
  };
  function useUniqueId(prefix2, options) {
    if (options === void 0) {
      options = defaults;
    }
    return useMemo(function() {
      return "" + prefix2 + options.separator + count++;
    }, [options.separator, prefix2]);
  }
  function getElementId(_ref) {
    var contextId = _ref.contextId, uniqueId = _ref.uniqueId;
    return "rbd-hidden-text-" + contextId + "-" + uniqueId;
  }
  function useHiddenTextElement(_ref2) {
    var contextId = _ref2.contextId, text = _ref2.text;
    var uniqueId = useUniqueId("hidden-text", {
      separator: "-"
    });
    var id = useMemo(function() {
      return getElementId({
        contextId,
        uniqueId
      });
    }, [uniqueId, contextId]);
    React.useEffect(function mount() {
      var el = document.createElement("div");
      el.id = id;
      el.textContent = text;
      el.style.display = "none";
      getBodyElement().appendChild(el);
      return function unmount() {
        var body = getBodyElement();
        if (body.contains(el)) {
          body.removeChild(el);
        }
      };
    }, [id, text]);
    return id;
  }
  var AppContext = React.createContext(null);
  function usePrevious(current) {
    var ref2 = React.useRef(current);
    React.useEffect(function() {
      ref2.current = current;
    });
    return ref2;
  }
  function create() {
    var lock = null;
    function isClaimed() {
      return Boolean(lock);
    }
    function isActive(value) {
      return value === lock;
    }
    function claim(abandon) {
      !!lock ? invariant() : void 0;
      var newLock = {
        abandon
      };
      lock = newLock;
      return newLock;
    }
    function release() {
      !lock ? invariant() : void 0;
      lock = null;
    }
    function tryAbandon() {
      if (lock) {
        lock.abandon();
        release();
      }
    }
    return {
      isClaimed,
      isActive,
      claim,
      release,
      tryAbandon
    };
  }
  var tab = 9;
  var enter = 13;
  var escape = 27;
  var space = 32;
  var pageUp = 33;
  var pageDown = 34;
  var end = 35;
  var home = 36;
  var arrowLeft = 37;
  var arrowUp = 38;
  var arrowRight = 39;
  var arrowDown = 40;
  var _preventedKeys;
  var preventedKeys = (_preventedKeys = {}, _preventedKeys[enter] = true, _preventedKeys[tab] = true, _preventedKeys);
  var preventStandardKeyEvents = function(event) {
    if (preventedKeys[event.keyCode]) {
      event.preventDefault();
    }
  };
  var supportedEventName = function() {
    var base = "visibilitychange";
    if (typeof document === "undefined") {
      return base;
    }
    var candidates = [base, "ms" + base, "webkit" + base, "moz" + base, "o" + base];
    var supported = find(candidates, function(eventName) {
      return "on" + eventName in document;
    });
    return supported || base;
  }();
  var primaryButton = 0;
  var sloppyClickThreshold = 5;
  function isSloppyClickThresholdExceeded(original, current) {
    return Math.abs(current.x - original.x) >= sloppyClickThreshold || Math.abs(current.y - original.y) >= sloppyClickThreshold;
  }
  var idle$1 = {
    type: "IDLE"
  };
  function getCaptureBindings(_ref) {
    var cancel = _ref.cancel, completed = _ref.completed, getPhase = _ref.getPhase, setPhase = _ref.setPhase;
    return [{
      eventName: "mousemove",
      fn: function fn(event) {
        var button = event.button, clientX = event.clientX, clientY = event.clientY;
        if (button !== primaryButton) {
          return;
        }
        var point = {
          x: clientX,
          y: clientY
        };
        var phase = getPhase();
        if (phase.type === "DRAGGING") {
          event.preventDefault();
          phase.actions.move(point);
          return;
        }
        !(phase.type === "PENDING") ? invariant() : void 0;
        var pending = phase.point;
        if (!isSloppyClickThresholdExceeded(pending, point)) {
          return;
        }
        event.preventDefault();
        var actions = phase.actions.fluidLift(point);
        setPhase({
          type: "DRAGGING",
          actions
        });
      }
    }, {
      eventName: "mouseup",
      fn: function fn(event) {
        var phase = getPhase();
        if (phase.type !== "DRAGGING") {
          cancel();
          return;
        }
        event.preventDefault();
        phase.actions.drop({
          shouldBlockNextClick: true
        });
        completed();
      }
    }, {
      eventName: "mousedown",
      fn: function fn(event) {
        if (getPhase().type === "DRAGGING") {
          event.preventDefault();
        }
        cancel();
      }
    }, {
      eventName: "keydown",
      fn: function fn(event) {
        var phase = getPhase();
        if (phase.type === "PENDING") {
          cancel();
          return;
        }
        if (event.keyCode === escape) {
          event.preventDefault();
          cancel();
          return;
        }
        preventStandardKeyEvents(event);
      }
    }, {
      eventName: "resize",
      fn: cancel
    }, {
      eventName: "scroll",
      options: {
        passive: true,
        capture: false
      },
      fn: function fn() {
        if (getPhase().type === "PENDING") {
          cancel();
        }
      }
    }, {
      eventName: "webkitmouseforcedown",
      fn: function fn(event) {
        var phase = getPhase();
        !(phase.type !== "IDLE") ? invariant() : void 0;
        if (phase.actions.shouldRespectForcePress()) {
          cancel();
          return;
        }
        event.preventDefault();
      }
    }, {
      eventName: supportedEventName,
      fn: cancel
    }];
  }
  function useMouseSensor(api) {
    var phaseRef = React.useRef(idle$1);
    var unbindEventsRef = React.useRef(noop);
    var startCaptureBinding = useMemo(function() {
      return {
        eventName: "mousedown",
        fn: function onMouseDown(event) {
          if (event.defaultPrevented) {
            return;
          }
          if (event.button !== primaryButton) {
            return;
          }
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
          }
          var draggableId = api.findClosestDraggableId(event);
          if (!draggableId) {
            return;
          }
          var actions = api.tryGetLock(draggableId, stop, {
            sourceEvent: event
          });
          if (!actions) {
            return;
          }
          event.preventDefault();
          var point = {
            x: event.clientX,
            y: event.clientY
          };
          unbindEventsRef.current();
          startPendingDrag(actions, point);
        }
      };
    }, [api]);
    var preventForcePressBinding = useMemo(function() {
      return {
        eventName: "webkitmouseforcewillbegin",
        fn: function fn(event) {
          if (event.defaultPrevented) {
            return;
          }
          var id = api.findClosestDraggableId(event);
          if (!id) {
            return;
          }
          var options = api.findOptionsForDraggable(id);
          if (!options) {
            return;
          }
          if (options.shouldRespectForcePress) {
            return;
          }
          if (!api.canGetLock(id)) {
            return;
          }
          event.preventDefault();
        }
      };
    }, [api]);
    var listenForCapture = useCallback(function listenForCapture2() {
      var options = {
        passive: false,
        capture: true
      };
      unbindEventsRef.current = bindEvents(window, [preventForcePressBinding, startCaptureBinding], options);
    }, [preventForcePressBinding, startCaptureBinding]);
    var stop = useCallback(function() {
      var current = phaseRef.current;
      if (current.type === "IDLE") {
        return;
      }
      phaseRef.current = idle$1;
      unbindEventsRef.current();
      listenForCapture();
    }, [listenForCapture]);
    var cancel = useCallback(function() {
      var phase = phaseRef.current;
      stop();
      if (phase.type === "DRAGGING") {
        phase.actions.cancel({
          shouldBlockNextClick: true
        });
      }
      if (phase.type === "PENDING") {
        phase.actions.abort();
      }
    }, [stop]);
    var bindCapturingEvents = useCallback(function bindCapturingEvents2() {
      var options = {
        capture: true,
        passive: false
      };
      var bindings = getCaptureBindings({
        cancel,
        completed: stop,
        getPhase: function getPhase() {
          return phaseRef.current;
        },
        setPhase: function setPhase(phase) {
          phaseRef.current = phase;
        }
      });
      unbindEventsRef.current = bindEvents(window, bindings, options);
    }, [cancel, stop]);
    var startPendingDrag = useCallback(function startPendingDrag2(actions, point) {
      !(phaseRef.current.type === "IDLE") ? invariant() : void 0;
      phaseRef.current = {
        type: "PENDING",
        point,
        actions
      };
      bindCapturingEvents();
    }, [bindCapturingEvents]);
    useIsomorphicLayoutEffect(function mount() {
      listenForCapture();
      return function unmount() {
        unbindEventsRef.current();
      };
    }, [listenForCapture]);
  }
  var _scrollJumpKeys;
  function noop$1() {
  }
  var scrollJumpKeys = (_scrollJumpKeys = {}, _scrollJumpKeys[pageDown] = true, _scrollJumpKeys[pageUp] = true, _scrollJumpKeys[home] = true, _scrollJumpKeys[end] = true, _scrollJumpKeys);
  function getDraggingBindings(actions, stop) {
    function cancel() {
      stop();
      actions.cancel();
    }
    function drop5() {
      stop();
      actions.drop();
    }
    return [{
      eventName: "keydown",
      fn: function fn(event) {
        if (event.keyCode === escape) {
          event.preventDefault();
          cancel();
          return;
        }
        if (event.keyCode === space) {
          event.preventDefault();
          drop5();
          return;
        }
        if (event.keyCode === arrowDown) {
          event.preventDefault();
          actions.moveDown();
          return;
        }
        if (event.keyCode === arrowUp) {
          event.preventDefault();
          actions.moveUp();
          return;
        }
        if (event.keyCode === arrowRight) {
          event.preventDefault();
          actions.moveRight();
          return;
        }
        if (event.keyCode === arrowLeft) {
          event.preventDefault();
          actions.moveLeft();
          return;
        }
        if (scrollJumpKeys[event.keyCode]) {
          event.preventDefault();
          return;
        }
        preventStandardKeyEvents(event);
      }
    }, {
      eventName: "mousedown",
      fn: cancel
    }, {
      eventName: "mouseup",
      fn: cancel
    }, {
      eventName: "click",
      fn: cancel
    }, {
      eventName: "touchstart",
      fn: cancel
    }, {
      eventName: "resize",
      fn: cancel
    }, {
      eventName: "wheel",
      fn: cancel,
      options: {
        passive: true
      }
    }, {
      eventName: supportedEventName,
      fn: cancel
    }];
  }
  function useKeyboardSensor(api) {
    var unbindEventsRef = React.useRef(noop$1);
    var startCaptureBinding = useMemo(function() {
      return {
        eventName: "keydown",
        fn: function onKeyDown(event) {
          if (event.defaultPrevented) {
            return;
          }
          if (event.keyCode !== space) {
            return;
          }
          var draggableId = api.findClosestDraggableId(event);
          if (!draggableId) {
            return;
          }
          var preDrag = api.tryGetLock(draggableId, stop, {
            sourceEvent: event
          });
          if (!preDrag) {
            return;
          }
          event.preventDefault();
          var isCapturing = true;
          var actions = preDrag.snapLift();
          unbindEventsRef.current();
          function stop() {
            !isCapturing ? invariant() : void 0;
            isCapturing = false;
            unbindEventsRef.current();
            listenForCapture();
          }
          unbindEventsRef.current = bindEvents(window, getDraggingBindings(actions, stop), {
            capture: true,
            passive: false
          });
        }
      };
    }, [api]);
    var listenForCapture = useCallback(function tryStartCapture() {
      var options = {
        passive: false,
        capture: true
      };
      unbindEventsRef.current = bindEvents(window, [startCaptureBinding], options);
    }, [startCaptureBinding]);
    useIsomorphicLayoutEffect(function mount() {
      listenForCapture();
      return function unmount() {
        unbindEventsRef.current();
      };
    }, [listenForCapture]);
  }
  var idle$2 = {
    type: "IDLE"
  };
  var timeForLongPress = 120;
  var forcePressThreshold = 0.15;
  function getWindowBindings(_ref) {
    var cancel = _ref.cancel, getPhase = _ref.getPhase;
    return [{
      eventName: "orientationchange",
      fn: cancel
    }, {
      eventName: "resize",
      fn: cancel
    }, {
      eventName: "contextmenu",
      fn: function fn(event) {
        event.preventDefault();
      }
    }, {
      eventName: "keydown",
      fn: function fn(event) {
        if (getPhase().type !== "DRAGGING") {
          cancel();
          return;
        }
        if (event.keyCode === escape) {
          event.preventDefault();
        }
        cancel();
      }
    }, {
      eventName: supportedEventName,
      fn: cancel
    }];
  }
  function getHandleBindings(_ref2) {
    var cancel = _ref2.cancel, completed = _ref2.completed, getPhase = _ref2.getPhase;
    return [{
      eventName: "touchmove",
      options: {
        capture: false
      },
      fn: function fn(event) {
        var phase = getPhase();
        if (phase.type !== "DRAGGING") {
          cancel();
          return;
        }
        phase.hasMoved = true;
        var _event$touches$ = event.touches[0], clientX = _event$touches$.clientX, clientY = _event$touches$.clientY;
        var point = {
          x: clientX,
          y: clientY
        };
        event.preventDefault();
        phase.actions.move(point);
      }
    }, {
      eventName: "touchend",
      fn: function fn(event) {
        var phase = getPhase();
        if (phase.type !== "DRAGGING") {
          cancel();
          return;
        }
        event.preventDefault();
        phase.actions.drop({
          shouldBlockNextClick: true
        });
        completed();
      }
    }, {
      eventName: "touchcancel",
      fn: function fn(event) {
        if (getPhase().type !== "DRAGGING") {
          cancel();
          return;
        }
        event.preventDefault();
        cancel();
      }
    }, {
      eventName: "touchforcechange",
      fn: function fn(event) {
        var phase = getPhase();
        !(phase.type !== "IDLE") ? invariant() : void 0;
        var touch = event.touches[0];
        if (!touch) {
          return;
        }
        var isForcePress = touch.force >= forcePressThreshold;
        if (!isForcePress) {
          return;
        }
        var shouldRespect = phase.actions.shouldRespectForcePress();
        if (phase.type === "PENDING") {
          if (shouldRespect) {
            cancel();
          }
          return;
        }
        if (shouldRespect) {
          if (phase.hasMoved) {
            event.preventDefault();
            return;
          }
          cancel();
          return;
        }
        event.preventDefault();
      }
    }, {
      eventName: supportedEventName,
      fn: cancel
    }];
  }
  function useTouchSensor(api) {
    var phaseRef = React.useRef(idle$2);
    var unbindEventsRef = React.useRef(noop);
    var getPhase = useCallback(function getPhase2() {
      return phaseRef.current;
    }, []);
    var setPhase = useCallback(function setPhase2(phase) {
      phaseRef.current = phase;
    }, []);
    var startCaptureBinding = useMemo(function() {
      return {
        eventName: "touchstart",
        fn: function onTouchStart(event) {
          if (event.defaultPrevented) {
            return;
          }
          var draggableId = api.findClosestDraggableId(event);
          if (!draggableId) {
            return;
          }
          var actions = api.tryGetLock(draggableId, stop, {
            sourceEvent: event
          });
          if (!actions) {
            return;
          }
          var touch = event.touches[0];
          var clientX = touch.clientX, clientY = touch.clientY;
          var point = {
            x: clientX,
            y: clientY
          };
          unbindEventsRef.current();
          startPendingDrag(actions, point);
        }
      };
    }, [api]);
    var listenForCapture = useCallback(function listenForCapture2() {
      var options = {
        capture: true,
        passive: false
      };
      unbindEventsRef.current = bindEvents(window, [startCaptureBinding], options);
    }, [startCaptureBinding]);
    var stop = useCallback(function() {
      var current = phaseRef.current;
      if (current.type === "IDLE") {
        return;
      }
      if (current.type === "PENDING") {
        clearTimeout(current.longPressTimerId);
      }
      setPhase(idle$2);
      unbindEventsRef.current();
      listenForCapture();
    }, [listenForCapture, setPhase]);
    var cancel = useCallback(function() {
      var phase = phaseRef.current;
      stop();
      if (phase.type === "DRAGGING") {
        phase.actions.cancel({
          shouldBlockNextClick: true
        });
      }
      if (phase.type === "PENDING") {
        phase.actions.abort();
      }
    }, [stop]);
    var bindCapturingEvents = useCallback(function bindCapturingEvents2() {
      var options = {
        capture: true,
        passive: false
      };
      var args = {
        cancel,
        completed: stop,
        getPhase
      };
      var unbindTarget = bindEvents(window, getHandleBindings(args), options);
      var unbindWindow = bindEvents(window, getWindowBindings(args), options);
      unbindEventsRef.current = function unbindAll() {
        unbindTarget();
        unbindWindow();
      };
    }, [cancel, getPhase, stop]);
    var startDragging = useCallback(function startDragging2() {
      var phase = getPhase();
      !(phase.type === "PENDING") ? invariant() : void 0;
      var actions = phase.actions.fluidLift(phase.point);
      setPhase({
        type: "DRAGGING",
        actions,
        hasMoved: false
      });
    }, [getPhase, setPhase]);
    var startPendingDrag = useCallback(function startPendingDrag2(actions, point) {
      !(getPhase().type === "IDLE") ? invariant() : void 0;
      var longPressTimerId = setTimeout(startDragging, timeForLongPress);
      setPhase({
        type: "PENDING",
        point,
        actions,
        longPressTimerId
      });
      bindCapturingEvents();
    }, [bindCapturingEvents, getPhase, setPhase, startDragging]);
    useIsomorphicLayoutEffect(function mount() {
      listenForCapture();
      return function unmount() {
        unbindEventsRef.current();
        var phase = getPhase();
        if (phase.type === "PENDING") {
          clearTimeout(phase.longPressTimerId);
          setPhase(idle$2);
        }
      };
    }, [getPhase, listenForCapture, setPhase]);
    useIsomorphicLayoutEffect(function webkitHack() {
      var unbind = bindEvents(window, [{
        eventName: "touchmove",
        fn: function fn() {
        },
        options: {
          capture: false,
          passive: false
        }
      }]);
      return unbind;
    }, []);
  }
  var interactiveTagNames = {
    input: true,
    button: true,
    textarea: true,
    select: true,
    option: true,
    optgroup: true,
    video: true,
    audio: true
  };
  function isAnInteractiveElement(parent, current) {
    if (current == null) {
      return false;
    }
    var hasAnInteractiveTag = Boolean(interactiveTagNames[current.tagName.toLowerCase()]);
    if (hasAnInteractiveTag) {
      return true;
    }
    var attribute = current.getAttribute("contenteditable");
    if (attribute === "true" || attribute === "") {
      return true;
    }
    if (current === parent) {
      return false;
    }
    return isAnInteractiveElement(parent, current.parentElement);
  }
  function isEventInInteractiveElement(draggable2, event) {
    var target = event.target;
    if (!isHtmlElement(target)) {
      return false;
    }
    return isAnInteractiveElement(draggable2, target);
  }
  var getBorderBoxCenterPosition = function(el) {
    return getRect(el.getBoundingClientRect()).center;
  };
  function isElement(el) {
    return el instanceof getWindowFromEl(el).Element;
  }
  var supportedMatchesName = function() {
    var base = "matches";
    if (typeof document === "undefined") {
      return base;
    }
    var candidates = [base, "msMatchesSelector", "webkitMatchesSelector"];
    var value = find(candidates, function(name) {
      return name in Element.prototype;
    });
    return value || base;
  }();
  function closestPonyfill(el, selector) {
    if (el == null) {
      return null;
    }
    if (el[supportedMatchesName](selector)) {
      return el;
    }
    return closestPonyfill(el.parentElement, selector);
  }
  function closest$1(el, selector) {
    if (el.closest) {
      return el.closest(selector);
    }
    return closestPonyfill(el, selector);
  }
  function getSelector(contextId) {
    return "[" + dragHandle.contextId + '="' + contextId + '"]';
  }
  function findClosestDragHandleFromEvent(contextId, event) {
    var target = event.target;
    if (!isElement(target)) {
      return null;
    }
    var selector = getSelector(contextId);
    var handle = closest$1(target, selector);
    if (!handle) {
      return null;
    }
    if (!isHtmlElement(handle)) {
      return null;
    }
    return handle;
  }
  function tryGetClosestDraggableIdFromEvent(contextId, event) {
    var handle = findClosestDragHandleFromEvent(contextId, event);
    if (!handle) {
      return null;
    }
    return handle.getAttribute(dragHandle.draggableId);
  }
  function findDraggable(contextId, draggableId) {
    var selector = "[" + draggable.contextId + '="' + contextId + '"]';
    var possible = toArray(document.querySelectorAll(selector));
    var draggable$1 = find(possible, function(el) {
      return el.getAttribute(draggable.id) === draggableId;
    });
    if (!draggable$1) {
      return null;
    }
    if (!isHtmlElement(draggable$1)) {
      return null;
    }
    return draggable$1;
  }
  function preventDefault(event) {
    event.preventDefault();
  }
  function _isActive(_ref) {
    var expected = _ref.expected, phase = _ref.phase, isLockActive = _ref.isLockActive;
    _ref.shouldWarn;
    if (!isLockActive()) {
      return false;
    }
    if (expected !== phase) {
      return false;
    }
    return true;
  }
  function canStart(_ref2) {
    var lockAPI = _ref2.lockAPI, store = _ref2.store, registry = _ref2.registry, draggableId = _ref2.draggableId;
    if (lockAPI.isClaimed()) {
      return false;
    }
    var entry = registry.draggable.findById(draggableId);
    if (!entry) {
      return false;
    }
    if (!entry.options.isEnabled) {
      return false;
    }
    if (!canStartDrag(store.getState(), draggableId)) {
      return false;
    }
    return true;
  }
  function tryStart(_ref3) {
    var lockAPI = _ref3.lockAPI, contextId = _ref3.contextId, store = _ref3.store, registry = _ref3.registry, draggableId = _ref3.draggableId, forceSensorStop = _ref3.forceSensorStop, sourceEvent = _ref3.sourceEvent;
    var shouldStart = canStart({
      lockAPI,
      store,
      registry,
      draggableId
    });
    if (!shouldStart) {
      return null;
    }
    var entry = registry.draggable.getById(draggableId);
    var el = findDraggable(contextId, entry.descriptor.id);
    if (!el) {
      return null;
    }
    if (sourceEvent && !entry.options.canDragInteractiveElements && isEventInInteractiveElement(el, sourceEvent)) {
      return null;
    }
    var lock = lockAPI.claim(forceSensorStop || noop);
    var phase = "PRE_DRAG";
    function getShouldRespectForcePress() {
      return entry.options.shouldRespectForcePress;
    }
    function isLockActive() {
      return lockAPI.isActive(lock);
    }
    function tryDispatch(expected, getAction) {
      if (_isActive({
        expected,
        phase,
        isLockActive,
        shouldWarn: true
      })) {
        store.dispatch(getAction());
      }
    }
    var tryDispatchWhenDragging = tryDispatch.bind(null, "DRAGGING");
    function lift$12(args) {
      function completed() {
        lockAPI.release();
        phase = "COMPLETED";
      }
      if (phase !== "PRE_DRAG") {
        completed();
        !(phase === "PRE_DRAG") ? invariant() : void 0;
      }
      store.dispatch(lift(args.liftActionArgs));
      phase = "DRAGGING";
      function finish3(reason, options) {
        if (options === void 0) {
          options = {
            shouldBlockNextClick: false
          };
        }
        args.cleanup();
        if (options.shouldBlockNextClick) {
          var unbind = bindEvents(window, [{
            eventName: "click",
            fn: preventDefault,
            options: {
              once: true,
              passive: false,
              capture: true
            }
          }]);
          setTimeout(unbind);
        }
        completed();
        store.dispatch(drop({
          reason
        }));
      }
      return _extends({
        isActive: function isActive() {
          return _isActive({
            expected: "DRAGGING",
            phase,
            isLockActive,
            shouldWarn: false
          });
        },
        shouldRespectForcePress: getShouldRespectForcePress,
        drop: function drop5(options) {
          return finish3("DROP", options);
        },
        cancel: function cancel(options) {
          return finish3("CANCEL", options);
        }
      }, args.actions);
    }
    function fluidLift(clientSelection) {
      var move$1 = rafSchd(function(client2) {
        tryDispatchWhenDragging(function() {
          return move({
            client: client2
          });
        });
      });
      var api = lift$12({
        liftActionArgs: {
          id: draggableId,
          clientSelection,
          movementMode: "FLUID"
        },
        cleanup: function cleanup() {
          return move$1.cancel();
        },
        actions: {
          move: move$1
        }
      });
      return _extends({}, api, {
        move: move$1
      });
    }
    function snapLift() {
      var actions = {
        moveUp: function moveUp$1() {
          return tryDispatchWhenDragging(moveUp);
        },
        moveRight: function moveRight$1() {
          return tryDispatchWhenDragging(moveRight);
        },
        moveDown: function moveDown$1() {
          return tryDispatchWhenDragging(moveDown);
        },
        moveLeft: function moveLeft$1() {
          return tryDispatchWhenDragging(moveLeft);
        }
      };
      return lift$12({
        liftActionArgs: {
          id: draggableId,
          clientSelection: getBorderBoxCenterPosition(el),
          movementMode: "SNAP"
        },
        cleanup: noop,
        actions
      });
    }
    function abortPreDrag() {
      var shouldRelease = _isActive({
        expected: "PRE_DRAG",
        phase,
        isLockActive,
        shouldWarn: true
      });
      if (shouldRelease) {
        lockAPI.release();
      }
    }
    var preDrag = {
      isActive: function isActive() {
        return _isActive({
          expected: "PRE_DRAG",
          phase,
          isLockActive,
          shouldWarn: false
        });
      },
      shouldRespectForcePress: getShouldRespectForcePress,
      fluidLift,
      snapLift,
      abort: abortPreDrag
    };
    return preDrag;
  }
  var defaultSensors = [useMouseSensor, useKeyboardSensor, useTouchSensor];
  function useSensorMarshal(_ref4) {
    var contextId = _ref4.contextId, store = _ref4.store, registry = _ref4.registry, customSensors = _ref4.customSensors, enableDefaultSensors = _ref4.enableDefaultSensors;
    var useSensors = [].concat(enableDefaultSensors ? defaultSensors : [], customSensors || []);
    var lockAPI = React.useState(function() {
      return create();
    })[0];
    var tryAbandonLock = useCallback(function tryAbandonLock2(previous, current) {
      if (previous.isDragging && !current.isDragging) {
        lockAPI.tryAbandon();
      }
    }, [lockAPI]);
    useIsomorphicLayoutEffect(function listenToStore() {
      var previous = store.getState();
      var unsubscribe = store.subscribe(function() {
        var current = store.getState();
        tryAbandonLock(previous, current);
        previous = current;
      });
      return unsubscribe;
    }, [lockAPI, store, tryAbandonLock]);
    useIsomorphicLayoutEffect(function() {
      return lockAPI.tryAbandon;
    }, [lockAPI.tryAbandon]);
    var canGetLock = useCallback(function(draggableId) {
      return canStart({
        lockAPI,
        registry,
        store,
        draggableId
      });
    }, [lockAPI, registry, store]);
    var tryGetLock = useCallback(function(draggableId, forceStop, options) {
      return tryStart({
        lockAPI,
        registry,
        contextId,
        store,
        draggableId,
        forceSensorStop: forceStop,
        sourceEvent: options && options.sourceEvent ? options.sourceEvent : null
      });
    }, [contextId, lockAPI, registry, store]);
    var findClosestDraggableId = useCallback(function(event) {
      return tryGetClosestDraggableIdFromEvent(contextId, event);
    }, [contextId]);
    var findOptionsForDraggable = useCallback(function(id) {
      var entry = registry.draggable.findById(id);
      return entry ? entry.options : null;
    }, [registry.draggable]);
    var tryReleaseLock = useCallback(function tryReleaseLock2() {
      if (!lockAPI.isClaimed()) {
        return;
      }
      lockAPI.tryAbandon();
      if (store.getState().phase !== "IDLE") {
        store.dispatch(flush());
      }
    }, [lockAPI, store]);
    var isLockClaimed = useCallback(lockAPI.isClaimed, [lockAPI]);
    var api = useMemo(function() {
      return {
        canGetLock,
        tryGetLock,
        findClosestDraggableId,
        findOptionsForDraggable,
        tryReleaseLock,
        isLockClaimed
      };
    }, [canGetLock, tryGetLock, findClosestDraggableId, findOptionsForDraggable, tryReleaseLock, isLockClaimed]);
    for (var i = 0; i < useSensors.length; i++) {
      useSensors[i](api);
    }
  }
  var createResponders = function createResponders2(props) {
    return {
      onBeforeCapture: props.onBeforeCapture,
      onBeforeDragStart: props.onBeforeDragStart,
      onDragStart: props.onDragStart,
      onDragEnd: props.onDragEnd,
      onDragUpdate: props.onDragUpdate
    };
  };
  function getStore(lazyRef) {
    !lazyRef.current ? invariant() : void 0;
    return lazyRef.current;
  }
  function App$1(props) {
    var contextId = props.contextId, setCallbacks = props.setCallbacks, sensors = props.sensors, nonce = props.nonce, dragHandleUsageInstructions2 = props.dragHandleUsageInstructions;
    var lazyStoreRef = React.useRef(null);
    var lastPropsRef = usePrevious(props);
    var getResponders = useCallback(function() {
      return createResponders(lastPropsRef.current);
    }, [lastPropsRef]);
    var announce = useAnnouncer(contextId);
    var dragHandleUsageInstructionsId = useHiddenTextElement({
      contextId,
      text: dragHandleUsageInstructions2
    });
    var styleMarshal = useStyleMarshal(contextId, nonce);
    var lazyDispatch = useCallback(function(action) {
      getStore(lazyStoreRef).dispatch(action);
    }, []);
    var marshalCallbacks = useMemo(function() {
      return bindActionCreators$1({
        publishWhileDragging,
        updateDroppableScroll,
        updateDroppableIsEnabled,
        updateDroppableIsCombineEnabled,
        collectionStarting
      }, lazyDispatch);
    }, [lazyDispatch]);
    var registry = useRegistry();
    var dimensionMarshal = useMemo(function() {
      return createDimensionMarshal(registry, marshalCallbacks);
    }, [registry, marshalCallbacks]);
    var autoScroller = useMemo(function() {
      return createAutoScroller(_extends({
        scrollWindow,
        scrollDroppable: dimensionMarshal.scrollDroppable
      }, bindActionCreators$1({
        move
      }, lazyDispatch)));
    }, [dimensionMarshal.scrollDroppable, lazyDispatch]);
    var focusMarshal = useFocusMarshal(contextId);
    var store = useMemo(function() {
      return createStore({
        announce,
        autoScroller,
        dimensionMarshal,
        focusMarshal,
        getResponders,
        styleMarshal
      });
    }, [announce, autoScroller, dimensionMarshal, focusMarshal, getResponders, styleMarshal]);
    lazyStoreRef.current = store;
    var tryResetStore = useCallback(function() {
      var current = getStore(lazyStoreRef);
      var state = current.getState();
      if (state.phase !== "IDLE") {
        current.dispatch(flush());
      }
    }, []);
    var isDragging = useCallback(function() {
      var state = getStore(lazyStoreRef).getState();
      return state.isDragging || state.phase === "DROP_ANIMATING";
    }, []);
    var appCallbacks = useMemo(function() {
      return {
        isDragging,
        tryAbort: tryResetStore
      };
    }, [isDragging, tryResetStore]);
    setCallbacks(appCallbacks);
    var getCanLift = useCallback(function(id) {
      return canStartDrag(getStore(lazyStoreRef).getState(), id);
    }, []);
    var getIsMovementAllowed = useCallback(function() {
      return isMovementAllowed(getStore(lazyStoreRef).getState());
    }, []);
    var appContext = useMemo(function() {
      return {
        marshal: dimensionMarshal,
        focus: focusMarshal,
        contextId,
        canLift: getCanLift,
        isMovementAllowed: getIsMovementAllowed,
        dragHandleUsageInstructionsId,
        registry
      };
    }, [contextId, dimensionMarshal, dragHandleUsageInstructionsId, focusMarshal, getCanLift, getIsMovementAllowed, registry]);
    useSensorMarshal({
      contextId,
      store,
      registry,
      customSensors: sensors,
      enableDefaultSensors: props.enableDefaultSensors !== false
    });
    React.useEffect(function() {
      return tryResetStore;
    }, [tryResetStore]);
    return React.createElement(AppContext.Provider, {
      value: appContext
    }, React.createElement(Provider, {
      context: StoreContext,
      store
    }, props.children));
  }
  var count$1 = 0;
  function useInstanceCount() {
    return useMemo(function() {
      return "" + count$1++;
    }, []);
  }
  function DragDropContext(props) {
    var contextId = useInstanceCount();
    var dragHandleUsageInstructions2 = props.dragHandleUsageInstructions || preset.dragHandleUsageInstructions;
    return React.createElement(ErrorBoundary, null, function(setCallbacks) {
      return React.createElement(App$1, {
        nonce: props.nonce,
        contextId,
        setCallbacks,
        dragHandleUsageInstructions: dragHandleUsageInstructions2,
        enableDefaultSensors: props.enableDefaultSensors,
        sensors: props.sensors,
        onBeforeCapture: props.onBeforeCapture,
        onBeforeDragStart: props.onBeforeDragStart,
        onDragStart: props.onDragStart,
        onDragUpdate: props.onDragUpdate,
        onDragEnd: props.onDragEnd
      }, props.children);
    });
  }
  var isEqual$1 = function isEqual3(base) {
    return function(value) {
      return base === value;
    };
  };
  var isScroll = isEqual$1("scroll");
  var isAuto = isEqual$1("auto");
  var isEither = function isEither2(overflow, fn) {
    return fn(overflow.overflowX) || fn(overflow.overflowY);
  };
  var isElementScrollable = function isElementScrollable2(el) {
    var style2 = window.getComputedStyle(el);
    var overflow = {
      overflowX: style2.overflowX,
      overflowY: style2.overflowY
    };
    return isEither(overflow, isScroll) || isEither(overflow, isAuto);
  };
  var isBodyScrollable = function isBodyScrollable2() {
    {
      return false;
    }
  };
  var getClosestScrollable = function getClosestScrollable2(el) {
    if (el == null) {
      return null;
    }
    if (el === document.body) {
      return isBodyScrollable() ? el : null;
    }
    if (el === document.documentElement) {
      return null;
    }
    if (!isElementScrollable(el)) {
      return getClosestScrollable2(el.parentElement);
    }
    return el;
  };
  var getScroll$1 = function(el) {
    return {
      x: el.scrollLeft,
      y: el.scrollTop
    };
  };
  var getIsFixed = function getIsFixed2(el) {
    if (!el) {
      return false;
    }
    var style2 = window.getComputedStyle(el);
    if (style2.position === "fixed") {
      return true;
    }
    return getIsFixed2(el.parentElement);
  };
  var getEnv = function(start3) {
    var closestScrollable = getClosestScrollable(start3);
    var isFixedOnPage = getIsFixed(start3);
    return {
      closestScrollable,
      isFixedOnPage
    };
  };
  var getDroppableDimension = function(_ref) {
    var descriptor = _ref.descriptor, isEnabled = _ref.isEnabled, isCombineEnabled = _ref.isCombineEnabled, isFixedOnPage = _ref.isFixedOnPage, direction = _ref.direction, client2 = _ref.client, page = _ref.page, closest3 = _ref.closest;
    var frame = function() {
      if (!closest3) {
        return null;
      }
      var scrollSize = closest3.scrollSize, frameClient = closest3.client;
      var maxScroll = getMaxScroll({
        scrollHeight: scrollSize.scrollHeight,
        scrollWidth: scrollSize.scrollWidth,
        height: frameClient.paddingBox.height,
        width: frameClient.paddingBox.width
      });
      return {
        pageMarginBox: closest3.page.marginBox,
        frameClient,
        scrollSize,
        shouldClipSubject: closest3.shouldClipSubject,
        scroll: {
          initial: closest3.scroll,
          current: closest3.scroll,
          max: maxScroll,
          diff: {
            value: origin,
            displacement: origin
          }
        }
      };
    }();
    var axis = direction === "vertical" ? vertical : horizontal;
    var subject = getSubject({
      page,
      withPlaceholder: null,
      axis,
      frame
    });
    var dimension = {
      descriptor,
      isCombineEnabled,
      isFixedOnPage,
      axis,
      isEnabled,
      client: client2,
      page,
      frame,
      subject
    };
    return dimension;
  };
  var getClient = function getClient2(targetRef, closestScrollable) {
    var base = getBox(targetRef);
    if (!closestScrollable) {
      return base;
    }
    if (targetRef !== closestScrollable) {
      return base;
    }
    var top = base.paddingBox.top - closestScrollable.scrollTop;
    var left = base.paddingBox.left - closestScrollable.scrollLeft;
    var bottom = top + closestScrollable.scrollHeight;
    var right = left + closestScrollable.scrollWidth;
    var paddingBox = {
      top,
      right,
      bottom,
      left
    };
    var borderBox = expand(paddingBox, base.border);
    var client2 = createBox({
      borderBox,
      margin: base.margin,
      border: base.border,
      padding: base.padding
    });
    return client2;
  };
  var getDimension = function(_ref) {
    var ref2 = _ref.ref, descriptor = _ref.descriptor, env = _ref.env, windowScroll = _ref.windowScroll, direction = _ref.direction, isDropDisabled = _ref.isDropDisabled, isCombineEnabled = _ref.isCombineEnabled, shouldClipSubject = _ref.shouldClipSubject;
    var closestScrollable = env.closestScrollable;
    var client2 = getClient(ref2, closestScrollable);
    var page = withScroll(client2, windowScroll);
    var closest3 = function() {
      if (!closestScrollable) {
        return null;
      }
      var frameClient = getBox(closestScrollable);
      var scrollSize = {
        scrollHeight: closestScrollable.scrollHeight,
        scrollWidth: closestScrollable.scrollWidth
      };
      return {
        client: frameClient,
        page: withScroll(frameClient, windowScroll),
        scroll: getScroll$1(closestScrollable),
        scrollSize,
        shouldClipSubject
      };
    }();
    var dimension = getDroppableDimension({
      descriptor,
      isEnabled: !isDropDisabled,
      isCombineEnabled,
      isFixedOnPage: env.isFixedOnPage,
      direction,
      client: client2,
      page,
      closest: closest3
    });
    return dimension;
  };
  var immediate = {
    passive: false
  };
  var delayed = {
    passive: true
  };
  var getListenerOptions = function(options) {
    return options.shouldPublishImmediately ? immediate : delayed;
  };
  function useRequiredContext(Context) {
    var result = React.useContext(Context);
    !result ? invariant() : void 0;
    return result;
  }
  var getClosestScrollableFromDrag = function getClosestScrollableFromDrag2(dragging) {
    return dragging && dragging.env.closestScrollable || null;
  };
  function useDroppablePublisher(args) {
    var whileDraggingRef = React.useRef(null);
    var appContext = useRequiredContext(AppContext);
    var uniqueId = useUniqueId("droppable");
    var registry = appContext.registry, marshal = appContext.marshal;
    var previousRef = usePrevious(args);
    var descriptor = useMemo(function() {
      return {
        id: args.droppableId,
        type: args.type,
        mode: args.mode
      };
    }, [args.droppableId, args.mode, args.type]);
    var publishedDescriptorRef = React.useRef(descriptor);
    var memoizedUpdateScroll = useMemo(function() {
      return memoizeOne(function(x, y2) {
        !whileDraggingRef.current ? invariant() : void 0;
        var scroll4 = {
          x,
          y: y2
        };
        marshal.updateDroppableScroll(descriptor.id, scroll4);
      });
    }, [descriptor.id, marshal]);
    var getClosestScroll = useCallback(function() {
      var dragging = whileDraggingRef.current;
      if (!dragging || !dragging.env.closestScrollable) {
        return origin;
      }
      return getScroll$1(dragging.env.closestScrollable);
    }, []);
    var updateScroll = useCallback(function() {
      var scroll4 = getClosestScroll();
      memoizedUpdateScroll(scroll4.x, scroll4.y);
    }, [getClosestScroll, memoizedUpdateScroll]);
    var scheduleScrollUpdate = useMemo(function() {
      return rafSchd(updateScroll);
    }, [updateScroll]);
    var onClosestScroll = useCallback(function() {
      var dragging = whileDraggingRef.current;
      var closest3 = getClosestScrollableFromDrag(dragging);
      !(dragging && closest3) ? invariant() : void 0;
      var options = dragging.scrollOptions;
      if (options.shouldPublishImmediately) {
        updateScroll();
        return;
      }
      scheduleScrollUpdate();
    }, [scheduleScrollUpdate, updateScroll]);
    var getDimensionAndWatchScroll = useCallback(function(windowScroll, options) {
      !!whileDraggingRef.current ? invariant() : void 0;
      var previous = previousRef.current;
      var ref2 = previous.getDroppableRef();
      !ref2 ? invariant() : void 0;
      var env = getEnv(ref2);
      var dragging = {
        ref: ref2,
        descriptor,
        env,
        scrollOptions: options
      };
      whileDraggingRef.current = dragging;
      var dimension = getDimension({
        ref: ref2,
        descriptor,
        env,
        windowScroll,
        direction: previous.direction,
        isDropDisabled: previous.isDropDisabled,
        isCombineEnabled: previous.isCombineEnabled,
        shouldClipSubject: !previous.ignoreContainerClipping
      });
      var scrollable = env.closestScrollable;
      if (scrollable) {
        scrollable.setAttribute(scrollContainer.contextId, appContext.contextId);
        scrollable.addEventListener("scroll", onClosestScroll, getListenerOptions(dragging.scrollOptions));
      }
      return dimension;
    }, [appContext.contextId, descriptor, onClosestScroll, previousRef]);
    var getScrollWhileDragging = useCallback(function() {
      var dragging = whileDraggingRef.current;
      var closest3 = getClosestScrollableFromDrag(dragging);
      !(dragging && closest3) ? invariant() : void 0;
      return getScroll$1(closest3);
    }, []);
    var dragStopped = useCallback(function() {
      var dragging = whileDraggingRef.current;
      !dragging ? invariant() : void 0;
      var closest3 = getClosestScrollableFromDrag(dragging);
      whileDraggingRef.current = null;
      if (!closest3) {
        return;
      }
      scheduleScrollUpdate.cancel();
      closest3.removeAttribute(scrollContainer.contextId);
      closest3.removeEventListener("scroll", onClosestScroll, getListenerOptions(dragging.scrollOptions));
    }, [onClosestScroll, scheduleScrollUpdate]);
    var scroll3 = useCallback(function(change) {
      var dragging = whileDraggingRef.current;
      !dragging ? invariant() : void 0;
      var closest3 = getClosestScrollableFromDrag(dragging);
      !closest3 ? invariant() : void 0;
      closest3.scrollTop += change.y;
      closest3.scrollLeft += change.x;
    }, []);
    var callbacks = useMemo(function() {
      return {
        getDimensionAndWatchScroll,
        getScrollWhileDragging,
        dragStopped,
        scroll: scroll3
      };
    }, [dragStopped, getDimensionAndWatchScroll, getScrollWhileDragging, scroll3]);
    var entry = useMemo(function() {
      return {
        uniqueId,
        descriptor,
        callbacks
      };
    }, [callbacks, descriptor, uniqueId]);
    useIsomorphicLayoutEffect(function() {
      publishedDescriptorRef.current = entry.descriptor;
      registry.droppable.register(entry);
      return function() {
        if (whileDraggingRef.current) {
          dragStopped();
        }
        registry.droppable.unregister(entry);
      };
    }, [callbacks, descriptor, dragStopped, entry, marshal, registry.droppable]);
    useIsomorphicLayoutEffect(function() {
      if (!whileDraggingRef.current) {
        return;
      }
      marshal.updateDroppableIsEnabled(publishedDescriptorRef.current.id, !args.isDropDisabled);
    }, [args.isDropDisabled, marshal]);
    useIsomorphicLayoutEffect(function() {
      if (!whileDraggingRef.current) {
        return;
      }
      marshal.updateDroppableIsCombineEnabled(publishedDescriptorRef.current.id, args.isCombineEnabled);
    }, [args.isCombineEnabled, marshal]);
  }
  function noop$2() {
  }
  var empty = {
    width: 0,
    height: 0,
    margin: noSpacing
  };
  var getSize = function getSize2(_ref) {
    var isAnimatingOpenOnMount = _ref.isAnimatingOpenOnMount, placeholder2 = _ref.placeholder, animate = _ref.animate;
    if (isAnimatingOpenOnMount) {
      return empty;
    }
    if (animate === "close") {
      return empty;
    }
    return {
      height: placeholder2.client.borderBox.height,
      width: placeholder2.client.borderBox.width,
      margin: placeholder2.client.margin
    };
  };
  var getStyle = function getStyle2(_ref2) {
    var isAnimatingOpenOnMount = _ref2.isAnimatingOpenOnMount, placeholder2 = _ref2.placeholder, animate = _ref2.animate;
    var size = getSize({
      isAnimatingOpenOnMount,
      placeholder: placeholder2,
      animate
    });
    return {
      display: placeholder2.display,
      boxSizing: "border-box",
      width: size.width,
      height: size.height,
      marginTop: size.margin.top,
      marginRight: size.margin.right,
      marginBottom: size.margin.bottom,
      marginLeft: size.margin.left,
      flexShrink: "0",
      flexGrow: "0",
      pointerEvents: "none",
      transition: animate !== "none" ? transitions.placeholder : null
    };
  };
  function Placeholder(props) {
    var animateOpenTimerRef = React.useRef(null);
    var tryClearAnimateOpenTimer = useCallback(function() {
      if (!animateOpenTimerRef.current) {
        return;
      }
      clearTimeout(animateOpenTimerRef.current);
      animateOpenTimerRef.current = null;
    }, []);
    var animate = props.animate, onTransitionEnd = props.onTransitionEnd, onClose = props.onClose, contextId = props.contextId;
    var _useState = React.useState(props.animate === "open"), isAnimatingOpenOnMount = _useState[0], setIsAnimatingOpenOnMount = _useState[1];
    React.useEffect(function() {
      if (!isAnimatingOpenOnMount) {
        return noop$2;
      }
      if (animate !== "open") {
        tryClearAnimateOpenTimer();
        setIsAnimatingOpenOnMount(false);
        return noop$2;
      }
      if (animateOpenTimerRef.current) {
        return noop$2;
      }
      animateOpenTimerRef.current = setTimeout(function() {
        animateOpenTimerRef.current = null;
        setIsAnimatingOpenOnMount(false);
      });
      return tryClearAnimateOpenTimer;
    }, [animate, isAnimatingOpenOnMount, tryClearAnimateOpenTimer]);
    var onSizeChangeEnd = useCallback(function(event) {
      if (event.propertyName !== "height") {
        return;
      }
      onTransitionEnd();
      if (animate === "close") {
        onClose();
      }
    }, [animate, onClose, onTransitionEnd]);
    var style2 = getStyle({
      isAnimatingOpenOnMount,
      animate: props.animate,
      placeholder: props.placeholder
    });
    return React.createElement(props.placeholder.tagName, {
      style: style2,
      "data-rbd-placeholder-context-id": contextId,
      onTransitionEnd: onSizeChangeEnd,
      ref: props.innerRef
    });
  }
  var Placeholder$1 = React.memo(Placeholder);
  var DroppableContext = React.createContext(null);
  var AnimateInOut = function(_React$PureComponent) {
    _inheritsLoose(AnimateInOut2, _React$PureComponent);
    function AnimateInOut2() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;
      _this.state = {
        isVisible: Boolean(_this.props.on),
        data: _this.props.on,
        animate: _this.props.shouldAnimate && _this.props.on ? "open" : "none"
      };
      _this.onClose = function() {
        if (_this.state.animate !== "close") {
          return;
        }
        _this.setState({
          isVisible: false
        });
      };
      return _this;
    }
    AnimateInOut2.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
      if (!props.shouldAnimate) {
        return {
          isVisible: Boolean(props.on),
          data: props.on,
          animate: "none"
        };
      }
      if (props.on) {
        return {
          isVisible: true,
          data: props.on,
          animate: "open"
        };
      }
      if (state.isVisible) {
        return {
          isVisible: true,
          data: state.data,
          animate: "close"
        };
      }
      return {
        isVisible: false,
        animate: "close",
        data: null
      };
    };
    var _proto = AnimateInOut2.prototype;
    _proto.render = function render() {
      if (!this.state.isVisible) {
        return null;
      }
      var provided = {
        onClose: this.onClose,
        data: this.state.data,
        animate: this.state.animate
      };
      return this.props.children(provided);
    };
    return AnimateInOut2;
  }(React.PureComponent);
  var zIndexOptions = {
    dragging: 5e3,
    dropAnimating: 4500
  };
  var getDraggingTransition = function getDraggingTransition2(shouldAnimateDragMovement, dropping) {
    if (dropping) {
      return transitions.drop(dropping.duration);
    }
    if (shouldAnimateDragMovement) {
      return transitions.snap;
    }
    return transitions.fluid;
  };
  var getDraggingOpacity = function getDraggingOpacity2(isCombining, isDropAnimating) {
    if (!isCombining) {
      return null;
    }
    return isDropAnimating ? combine.opacity.drop : combine.opacity.combining;
  };
  var getShouldDraggingAnimate = function getShouldDraggingAnimate2(dragging) {
    if (dragging.forceShouldAnimate != null) {
      return dragging.forceShouldAnimate;
    }
    return dragging.mode === "SNAP";
  };
  function getDraggingStyle(dragging) {
    var dimension = dragging.dimension;
    var box = dimension.client;
    var offset22 = dragging.offset, combineWith = dragging.combineWith, dropping = dragging.dropping;
    var isCombining = Boolean(combineWith);
    var shouldAnimate = getShouldDraggingAnimate(dragging);
    var isDropAnimating = Boolean(dropping);
    var transform = isDropAnimating ? transforms.drop(offset22, isCombining) : transforms.moveTo(offset22);
    var style2 = {
      position: "fixed",
      top: box.marginBox.top,
      left: box.marginBox.left,
      boxSizing: "border-box",
      width: box.borderBox.width,
      height: box.borderBox.height,
      transition: getDraggingTransition(shouldAnimate, dropping),
      transform,
      opacity: getDraggingOpacity(isCombining, isDropAnimating),
      zIndex: isDropAnimating ? zIndexOptions.dropAnimating : zIndexOptions.dragging,
      pointerEvents: "none"
    };
    return style2;
  }
  function getSecondaryStyle(secondary) {
    return {
      transform: transforms.moveTo(secondary.offset),
      transition: secondary.shouldAnimateDisplacement ? null : "none"
    };
  }
  function getStyle$1(mapped) {
    return mapped.type === "DRAGGING" ? getDraggingStyle(mapped) : getSecondaryStyle(mapped);
  }
  function getDimension$1(descriptor, el, windowScroll) {
    if (windowScroll === void 0) {
      windowScroll = origin;
    }
    var computedStyles = window.getComputedStyle(el);
    var borderBox = el.getBoundingClientRect();
    var client2 = calculateBox(borderBox, computedStyles);
    var page = withScroll(client2, windowScroll);
    var placeholder2 = {
      client: client2,
      tagName: el.tagName.toLowerCase(),
      display: computedStyles.display
    };
    var displaceBy = {
      x: client2.marginBox.width,
      y: client2.marginBox.height
    };
    var dimension = {
      descriptor,
      placeholder: placeholder2,
      displaceBy,
      client: client2,
      page
    };
    return dimension;
  }
  function useDraggablePublisher(args) {
    var uniqueId = useUniqueId("draggable");
    var descriptor = args.descriptor, registry = args.registry, getDraggableRef = args.getDraggableRef, canDragInteractiveElements = args.canDragInteractiveElements, shouldRespectForcePress = args.shouldRespectForcePress, isEnabled = args.isEnabled;
    var options = useMemo(function() {
      return {
        canDragInteractiveElements,
        shouldRespectForcePress,
        isEnabled
      };
    }, [canDragInteractiveElements, isEnabled, shouldRespectForcePress]);
    var getDimension2 = useCallback(function(windowScroll) {
      var el = getDraggableRef();
      !el ? invariant() : void 0;
      return getDimension$1(descriptor, el, windowScroll);
    }, [descriptor, getDraggableRef]);
    var entry = useMemo(function() {
      return {
        uniqueId,
        descriptor,
        options,
        getDimension: getDimension2
      };
    }, [descriptor, getDimension2, options, uniqueId]);
    var publishedRef = React.useRef(entry);
    var isFirstPublishRef = React.useRef(true);
    useIsomorphicLayoutEffect(function() {
      registry.draggable.register(publishedRef.current);
      return function() {
        return registry.draggable.unregister(publishedRef.current);
      };
    }, [registry.draggable]);
    useIsomorphicLayoutEffect(function() {
      if (isFirstPublishRef.current) {
        isFirstPublishRef.current = false;
        return;
      }
      var last = publishedRef.current;
      publishedRef.current = entry;
      registry.draggable.update(entry, last);
    }, [entry, registry.draggable]);
  }
  function preventHtml5Dnd(event) {
    event.preventDefault();
  }
  function Draggable(props) {
    var ref2 = React.useRef(null);
    var setRef2 = useCallback(function(el) {
      ref2.current = el;
    }, []);
    var getRef = useCallback(function() {
      return ref2.current;
    }, []);
    var _useRequiredContext = useRequiredContext(AppContext), contextId = _useRequiredContext.contextId, dragHandleUsageInstructionsId = _useRequiredContext.dragHandleUsageInstructionsId, registry = _useRequiredContext.registry;
    var _useRequiredContext2 = useRequiredContext(DroppableContext), type = _useRequiredContext2.type, droppableId = _useRequiredContext2.droppableId;
    var descriptor = useMemo(function() {
      return {
        id: props.draggableId,
        index: props.index,
        type,
        droppableId
      };
    }, [props.draggableId, props.index, type, droppableId]);
    var children = props.children, draggableId = props.draggableId, isEnabled = props.isEnabled, shouldRespectForcePress = props.shouldRespectForcePress, canDragInteractiveElements = props.canDragInteractiveElements, isClone = props.isClone, mapped = props.mapped, dropAnimationFinishedAction = props.dropAnimationFinished;
    if (!isClone) {
      var forPublisher = useMemo(function() {
        return {
          descriptor,
          registry,
          getDraggableRef: getRef,
          canDragInteractiveElements,
          shouldRespectForcePress,
          isEnabled
        };
      }, [descriptor, registry, getRef, canDragInteractiveElements, shouldRespectForcePress, isEnabled]);
      useDraggablePublisher(forPublisher);
    }
    var dragHandleProps = useMemo(function() {
      return isEnabled ? {
        tabIndex: 0,
        role: "button",
        "aria-describedby": dragHandleUsageInstructionsId,
        "data-rbd-drag-handle-draggable-id": draggableId,
        "data-rbd-drag-handle-context-id": contextId,
        draggable: false,
        onDragStart: preventHtml5Dnd
      } : null;
    }, [contextId, dragHandleUsageInstructionsId, draggableId, isEnabled]);
    var onMoveEnd = useCallback(function(event) {
      if (mapped.type !== "DRAGGING") {
        return;
      }
      if (!mapped.dropping) {
        return;
      }
      if (event.propertyName !== "transform") {
        return;
      }
      dropAnimationFinishedAction();
    }, [dropAnimationFinishedAction, mapped]);
    var provided = useMemo(function() {
      var style2 = getStyle$1(mapped);
      var onTransitionEnd = mapped.type === "DRAGGING" && mapped.dropping ? onMoveEnd : null;
      var result = {
        innerRef: setRef2,
        draggableProps: {
          "data-rbd-draggable-context-id": contextId,
          "data-rbd-draggable-id": draggableId,
          style: style2,
          onTransitionEnd
        },
        dragHandleProps
      };
      return result;
    }, [contextId, dragHandleProps, draggableId, mapped, onMoveEnd, setRef2]);
    var rubric = useMemo(function() {
      return {
        draggableId: descriptor.id,
        type: descriptor.type,
        source: {
          index: descriptor.index,
          droppableId: descriptor.droppableId
        }
      };
    }, [descriptor.droppableId, descriptor.id, descriptor.index, descriptor.type]);
    return children(provided, mapped.snapshot, rubric);
  }
  var isStrictEqual = function(a, b2) {
    return a === b2;
  };
  var whatIsDraggedOverFromResult = function(result) {
    var combine2 = result.combine, destination = result.destination;
    if (destination) {
      return destination.droppableId;
    }
    if (combine2) {
      return combine2.droppableId;
    }
    return null;
  };
  var getCombineWithFromResult = function getCombineWithFromResult2(result) {
    return result.combine ? result.combine.draggableId : null;
  };
  var getCombineWithFromImpact = function getCombineWithFromImpact2(impact) {
    return impact.at && impact.at.type === "COMBINE" ? impact.at.combine.draggableId : null;
  };
  function getDraggableSelector() {
    var memoizedOffset = memoizeOne(function(x, y2) {
      return {
        x,
        y: y2
      };
    });
    var getMemoizedSnapshot = memoizeOne(function(mode, isClone, draggingOver, combineWith, dropping) {
      return {
        isDragging: true,
        isClone,
        isDropAnimating: Boolean(dropping),
        dropAnimation: dropping,
        mode,
        draggingOver,
        combineWith,
        combineTargetFor: null
      };
    });
    var getMemoizedProps = memoizeOne(function(offset22, mode, dimension, isClone, draggingOver, combineWith, forceShouldAnimate) {
      return {
        mapped: {
          type: "DRAGGING",
          dropping: null,
          draggingOver,
          combineWith,
          mode,
          offset: offset22,
          dimension,
          forceShouldAnimate,
          snapshot: getMemoizedSnapshot(mode, isClone, draggingOver, combineWith, null)
        }
      };
    });
    var selector = function selector2(state, ownProps) {
      if (state.isDragging) {
        if (state.critical.draggable.id !== ownProps.draggableId) {
          return null;
        }
        var offset22 = state.current.client.offset;
        var dimension = state.dimensions.draggables[ownProps.draggableId];
        var draggingOver = whatIsDraggedOver(state.impact);
        var combineWith = getCombineWithFromImpact(state.impact);
        var forceShouldAnimate = state.forceShouldAnimate;
        return getMemoizedProps(memoizedOffset(offset22.x, offset22.y), state.movementMode, dimension, ownProps.isClone, draggingOver, combineWith, forceShouldAnimate);
      }
      if (state.phase === "DROP_ANIMATING") {
        var completed = state.completed;
        if (completed.result.draggableId !== ownProps.draggableId) {
          return null;
        }
        var isClone = ownProps.isClone;
        var _dimension = state.dimensions.draggables[ownProps.draggableId];
        var result = completed.result;
        var mode = result.mode;
        var _draggingOver = whatIsDraggedOverFromResult(result);
        var _combineWith = getCombineWithFromResult(result);
        var duration2 = state.dropDuration;
        var dropping = {
          duration: duration2,
          curve: curves.drop,
          moveTo: state.newHomeClientOffset,
          opacity: _combineWith ? combine.opacity.drop : null,
          scale: _combineWith ? combine.scale.drop : null
        };
        return {
          mapped: {
            type: "DRAGGING",
            offset: state.newHomeClientOffset,
            dimension: _dimension,
            dropping,
            draggingOver: _draggingOver,
            combineWith: _combineWith,
            mode,
            forceShouldAnimate: null,
            snapshot: getMemoizedSnapshot(mode, isClone, _draggingOver, _combineWith, dropping)
          }
        };
      }
      return null;
    };
    return selector;
  }
  function getSecondarySnapshot(combineTargetFor) {
    return {
      isDragging: false,
      isDropAnimating: false,
      isClone: false,
      dropAnimation: null,
      mode: null,
      draggingOver: null,
      combineTargetFor,
      combineWith: null
    };
  }
  var atRest = {
    mapped: {
      type: "SECONDARY",
      offset: origin,
      combineTargetFor: null,
      shouldAnimateDisplacement: true,
      snapshot: getSecondarySnapshot(null)
    }
  };
  function getSecondarySelector() {
    var memoizedOffset = memoizeOne(function(x, y2) {
      return {
        x,
        y: y2
      };
    });
    var getMemoizedSnapshot = memoizeOne(getSecondarySnapshot);
    var getMemoizedProps = memoizeOne(function(offset22, combineTargetFor, shouldAnimateDisplacement) {
      if (combineTargetFor === void 0) {
        combineTargetFor = null;
      }
      return {
        mapped: {
          type: "SECONDARY",
          offset: offset22,
          combineTargetFor,
          shouldAnimateDisplacement,
          snapshot: getMemoizedSnapshot(combineTargetFor)
        }
      };
    });
    var getFallback = function getFallback2(combineTargetFor) {
      return combineTargetFor ? getMemoizedProps(origin, combineTargetFor, true) : null;
    };
    var getProps = function getProps2(ownId, draggingId, impact, afterCritical) {
      var visualDisplacement = impact.displaced.visible[ownId];
      var isAfterCriticalInVirtualList = Boolean(afterCritical.inVirtualList && afterCritical.effected[ownId]);
      var combine2 = tryGetCombine(impact);
      var combineTargetFor = combine2 && combine2.draggableId === ownId ? draggingId : null;
      if (!visualDisplacement) {
        if (!isAfterCriticalInVirtualList) {
          return getFallback(combineTargetFor);
        }
        if (impact.displaced.invisible[ownId]) {
          return null;
        }
        var change = negate(afterCritical.displacedBy.point);
        var _offset = memoizedOffset(change.x, change.y);
        return getMemoizedProps(_offset, combineTargetFor, true);
      }
      if (isAfterCriticalInVirtualList) {
        return getFallback(combineTargetFor);
      }
      var displaceBy = impact.displacedBy.point;
      var offset22 = memoizedOffset(displaceBy.x, displaceBy.y);
      return getMemoizedProps(offset22, combineTargetFor, visualDisplacement.shouldAnimate);
    };
    var selector = function selector2(state, ownProps) {
      if (state.isDragging) {
        if (state.critical.draggable.id === ownProps.draggableId) {
          return null;
        }
        return getProps(ownProps.draggableId, state.critical.draggable.id, state.impact, state.afterCritical);
      }
      if (state.phase === "DROP_ANIMATING") {
        var completed = state.completed;
        if (completed.result.draggableId === ownProps.draggableId) {
          return null;
        }
        return getProps(ownProps.draggableId, completed.result.draggableId, completed.impact, completed.afterCritical);
      }
      return null;
    };
    return selector;
  }
  var makeMapStateToProps = function makeMapStateToProps2() {
    var draggingSelector = getDraggableSelector();
    var secondarySelector = getSecondarySelector();
    var selector = function selector2(state, ownProps) {
      return draggingSelector(state, ownProps) || secondarySelector(state, ownProps) || atRest;
    };
    return selector;
  };
  var mapDispatchToProps = {
    dropAnimationFinished
  };
  var ConnectedDraggable = connect(makeMapStateToProps, mapDispatchToProps, null, {
    context: StoreContext,
    pure: true,
    areStatePropsEqual: isStrictEqual
  })(Draggable);
  function PrivateDraggable(props) {
    var droppableContext = useRequiredContext(DroppableContext);
    var isUsingCloneFor = droppableContext.isUsingCloneFor;
    if (isUsingCloneFor === props.draggableId && !props.isClone) {
      return null;
    }
    return React.createElement(ConnectedDraggable, props);
  }
  function PublicDraggable(props) {
    var isEnabled = typeof props.isDragDisabled === "boolean" ? !props.isDragDisabled : true;
    var canDragInteractiveElements = Boolean(props.disableInteractiveElementBlocking);
    var shouldRespectForcePress = Boolean(props.shouldRespectForcePress);
    return React.createElement(PrivateDraggable, _extends({}, props, {
      isClone: false,
      isEnabled,
      canDragInteractiveElements,
      shouldRespectForcePress
    }));
  }
  function Droppable(props) {
    var appContext = React.useContext(AppContext);
    !appContext ? invariant() : void 0;
    var contextId = appContext.contextId, isMovementAllowed2 = appContext.isMovementAllowed;
    var droppableRef = React.useRef(null);
    var placeholderRef = React.useRef(null);
    var children = props.children, droppableId = props.droppableId, type = props.type, mode = props.mode, direction = props.direction, ignoreContainerClipping = props.ignoreContainerClipping, isDropDisabled = props.isDropDisabled, isCombineEnabled = props.isCombineEnabled, snapshot = props.snapshot, useClone = props.useClone, updateViewportMaxScroll3 = props.updateViewportMaxScroll, getContainerForClone = props.getContainerForClone;
    var getDroppableRef = useCallback(function() {
      return droppableRef.current;
    }, []);
    var setDroppableRef = useCallback(function(value) {
      droppableRef.current = value;
    }, []);
    useCallback(function() {
      return placeholderRef.current;
    }, []);
    var setPlaceholderRef = useCallback(function(value) {
      placeholderRef.current = value;
    }, []);
    var onPlaceholderTransitionEnd = useCallback(function() {
      if (isMovementAllowed2()) {
        updateViewportMaxScroll3({
          maxScroll: getMaxWindowScroll()
        });
      }
    }, [isMovementAllowed2, updateViewportMaxScroll3]);
    useDroppablePublisher({
      droppableId,
      type,
      mode,
      direction,
      isDropDisabled,
      isCombineEnabled,
      ignoreContainerClipping,
      getDroppableRef
    });
    var placeholder2 = React.createElement(AnimateInOut, {
      on: props.placeholder,
      shouldAnimate: props.shouldAnimatePlaceholder
    }, function(_ref) {
      var onClose = _ref.onClose, data = _ref.data, animate = _ref.animate;
      return React.createElement(Placeholder$1, {
        placeholder: data,
        onClose,
        innerRef: setPlaceholderRef,
        animate,
        contextId,
        onTransitionEnd: onPlaceholderTransitionEnd
      });
    });
    var provided = useMemo(function() {
      return {
        innerRef: setDroppableRef,
        placeholder: placeholder2,
        droppableProps: {
          "data-rbd-droppable-id": droppableId,
          "data-rbd-droppable-context-id": contextId
        }
      };
    }, [contextId, droppableId, placeholder2, setDroppableRef]);
    var isUsingCloneFor = useClone ? useClone.dragging.draggableId : null;
    var droppableContext = useMemo(function() {
      return {
        droppableId,
        type,
        isUsingCloneFor
      };
    }, [droppableId, isUsingCloneFor, type]);
    function getClone() {
      if (!useClone) {
        return null;
      }
      var dragging = useClone.dragging, render = useClone.render;
      var node2 = React.createElement(PrivateDraggable, {
        draggableId: dragging.draggableId,
        index: dragging.source.index,
        isClone: true,
        isEnabled: true,
        shouldRespectForcePress: false,
        canDragInteractiveElements: true
      }, function(draggableProvided, draggableSnapshot) {
        return render(draggableProvided, draggableSnapshot, dragging);
      });
      return ReactDOM__default.createPortal(node2, getContainerForClone());
    }
    return React.createElement(DroppableContext.Provider, {
      value: droppableContext
    }, children(provided, snapshot), getClone());
  }
  var isMatchingType = function isMatchingType2(type, critical) {
    return type === critical.droppable.type;
  };
  var getDraggable = function getDraggable2(critical, dimensions) {
    return dimensions.draggables[critical.draggable.id];
  };
  var makeMapStateToProps$1 = function makeMapStateToProps3() {
    var idleWithAnimation = {
      placeholder: null,
      shouldAnimatePlaceholder: true,
      snapshot: {
        isDraggingOver: false,
        draggingOverWith: null,
        draggingFromThisWith: null,
        isUsingPlaceholder: false
      },
      useClone: null
    };
    var idleWithoutAnimation = _extends({}, idleWithAnimation, {
      shouldAnimatePlaceholder: false
    });
    var getDraggableRubric = memoizeOne(function(descriptor) {
      return {
        draggableId: descriptor.id,
        type: descriptor.type,
        source: {
          index: descriptor.index,
          droppableId: descriptor.droppableId
        }
      };
    });
    var getMapProps = memoizeOne(function(id, isEnabled, isDraggingOverForConsumer, isDraggingOverForImpact, dragging, renderClone) {
      var draggableId = dragging.descriptor.id;
      var isHome = dragging.descriptor.droppableId === id;
      if (isHome) {
        var useClone = renderClone ? {
          render: renderClone,
          dragging: getDraggableRubric(dragging.descriptor)
        } : null;
        var _snapshot = {
          isDraggingOver: isDraggingOverForConsumer,
          draggingOverWith: isDraggingOverForConsumer ? draggableId : null,
          draggingFromThisWith: draggableId,
          isUsingPlaceholder: true
        };
        return {
          placeholder: dragging.placeholder,
          shouldAnimatePlaceholder: false,
          snapshot: _snapshot,
          useClone
        };
      }
      if (!isEnabled) {
        return idleWithoutAnimation;
      }
      if (!isDraggingOverForImpact) {
        return idleWithAnimation;
      }
      var snapshot = {
        isDraggingOver: isDraggingOverForConsumer,
        draggingOverWith: draggableId,
        draggingFromThisWith: null,
        isUsingPlaceholder: true
      };
      return {
        placeholder: dragging.placeholder,
        shouldAnimatePlaceholder: true,
        snapshot,
        useClone: null
      };
    });
    var selector = function selector2(state, ownProps) {
      var id = ownProps.droppableId;
      var type = ownProps.type;
      var isEnabled = !ownProps.isDropDisabled;
      var renderClone = ownProps.renderClone;
      if (state.isDragging) {
        var critical = state.critical;
        if (!isMatchingType(type, critical)) {
          return idleWithoutAnimation;
        }
        var dragging = getDraggable(critical, state.dimensions);
        var isDraggingOver = whatIsDraggedOver(state.impact) === id;
        return getMapProps(id, isEnabled, isDraggingOver, isDraggingOver, dragging, renderClone);
      }
      if (state.phase === "DROP_ANIMATING") {
        var completed = state.completed;
        if (!isMatchingType(type, completed.critical)) {
          return idleWithoutAnimation;
        }
        var _dragging = getDraggable(completed.critical, state.dimensions);
        return getMapProps(id, isEnabled, whatIsDraggedOverFromResult(completed.result) === id, whatIsDraggedOver(completed.impact) === id, _dragging, renderClone);
      }
      if (state.phase === "IDLE" && state.completed && !state.shouldFlush) {
        var _completed = state.completed;
        if (!isMatchingType(type, _completed.critical)) {
          return idleWithoutAnimation;
        }
        var wasOver = whatIsDraggedOver(_completed.impact) === id;
        var wasCombining = Boolean(_completed.impact.at && _completed.impact.at.type === "COMBINE");
        var isHome = _completed.critical.droppable.id === id;
        if (wasOver) {
          return wasCombining ? idleWithAnimation : idleWithoutAnimation;
        }
        if (isHome) {
          return idleWithAnimation;
        }
        return idleWithoutAnimation;
      }
      return idleWithoutAnimation;
    };
    return selector;
  };
  var mapDispatchToProps$1 = {
    updateViewportMaxScroll
  };
  function getBody() {
    !document.body ? invariant() : void 0;
    return document.body;
  }
  var defaultProps = {
    mode: "standard",
    type: "DEFAULT",
    direction: "vertical",
    isDropDisabled: false,
    isCombineEnabled: false,
    ignoreContainerClipping: false,
    renderClone: null,
    getContainerForClone: getBody
  };
  var ConnectedDroppable = connect(makeMapStateToProps$1, mapDispatchToProps$1, null, {
    context: StoreContext,
    pure: true,
    areStatePropsEqual: isStrictEqual
  })(Droppable);
  ConnectedDroppable.defaultProps = defaultProps;
  var lodash = { exports: {} };
  /**
   * @license
   * Lodash <https://lodash.com/>
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */
  lodash.exports;
  (function(module, exports) {
    (function() {
      var undefined$1;
      var VERSION = "4.17.21";
      var LARGE_ARRAY_SIZE = 200;
      var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var MAX_MEMOIZE_SIZE = 500;
      var PLACEHOLDER = "__lodash_placeholder__";
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
      var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
      var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
      var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
      var wrapFlags = [
        ["ary", WRAP_ARY_FLAG],
        ["bind", WRAP_BIND_FLAG],
        ["bindKey", WRAP_BIND_KEY_FLAG],
        ["curry", WRAP_CURRY_FLAG],
        ["curryRight", WRAP_CURRY_RIGHT_FLAG],
        ["flip", WRAP_FLIP_FLAG],
        ["partial", WRAP_PARTIAL_FLAG],
        ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
        ["rearg", WRAP_REARG_FLAG]
      ];
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
      var reTrimStart = /^\s+/;
      var reWhitespace = /\s/;
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
      var reEscapeChar = /\\(\\)?/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsOctal = /^0o[0-7]+$/i;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos = "['’]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reApos = RegExp(rsApos, "g");
      var reComboMark = RegExp(rsCombo, "g");
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      var contextProps = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ];
      var templateCounter = -1;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var deburredLetters = {
        // Latin-1 Supplement block.
        "À": "A",
        "Á": "A",
        "Â": "A",
        "Ã": "A",
        "Ä": "A",
        "Å": "A",
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ä": "a",
        "å": "a",
        "Ç": "C",
        "ç": "c",
        "Ð": "D",
        "ð": "d",
        "È": "E",
        "É": "E",
        "Ê": "E",
        "Ë": "E",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "Ì": "I",
        "Í": "I",
        "Î": "I",
        "Ï": "I",
        "ì": "i",
        "í": "i",
        "î": "i",
        "ï": "i",
        "Ñ": "N",
        "ñ": "n",
        "Ò": "O",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ö": "O",
        "Ø": "O",
        "ò": "o",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ö": "o",
        "ø": "o",
        "Ù": "U",
        "Ú": "U",
        "Û": "U",
        "Ü": "U",
        "ù": "u",
        "ú": "u",
        "û": "u",
        "ü": "u",
        "Ý": "Y",
        "ý": "y",
        "ÿ": "y",
        "Æ": "Ae",
        "æ": "ae",
        "Þ": "Th",
        "þ": "th",
        "ß": "ss",
        // Latin Extended-A block.
        "Ā": "A",
        "Ă": "A",
        "Ą": "A",
        "ā": "a",
        "ă": "a",
        "ą": "a",
        "Ć": "C",
        "Ĉ": "C",
        "Ċ": "C",
        "Č": "C",
        "ć": "c",
        "ĉ": "c",
        "ċ": "c",
        "č": "c",
        "Ď": "D",
        "Đ": "D",
        "ď": "d",
        "đ": "d",
        "Ē": "E",
        "Ĕ": "E",
        "Ė": "E",
        "Ę": "E",
        "Ě": "E",
        "ē": "e",
        "ĕ": "e",
        "ė": "e",
        "ę": "e",
        "ě": "e",
        "Ĝ": "G",
        "Ğ": "G",
        "Ġ": "G",
        "Ģ": "G",
        "ĝ": "g",
        "ğ": "g",
        "ġ": "g",
        "ģ": "g",
        "Ĥ": "H",
        "Ħ": "H",
        "ĥ": "h",
        "ħ": "h",
        "Ĩ": "I",
        "Ī": "I",
        "Ĭ": "I",
        "Į": "I",
        "İ": "I",
        "ĩ": "i",
        "ī": "i",
        "ĭ": "i",
        "į": "i",
        "ı": "i",
        "Ĵ": "J",
        "ĵ": "j",
        "Ķ": "K",
        "ķ": "k",
        "ĸ": "k",
        "Ĺ": "L",
        "Ļ": "L",
        "Ľ": "L",
        "Ŀ": "L",
        "Ł": "L",
        "ĺ": "l",
        "ļ": "l",
        "ľ": "l",
        "ŀ": "l",
        "ł": "l",
        "Ń": "N",
        "Ņ": "N",
        "Ň": "N",
        "Ŋ": "N",
        "ń": "n",
        "ņ": "n",
        "ň": "n",
        "ŋ": "n",
        "Ō": "O",
        "Ŏ": "O",
        "Ő": "O",
        "ō": "o",
        "ŏ": "o",
        "ő": "o",
        "Ŕ": "R",
        "Ŗ": "R",
        "Ř": "R",
        "ŕ": "r",
        "ŗ": "r",
        "ř": "r",
        "Ś": "S",
        "Ŝ": "S",
        "Ş": "S",
        "Š": "S",
        "ś": "s",
        "ŝ": "s",
        "ş": "s",
        "š": "s",
        "Ţ": "T",
        "Ť": "T",
        "Ŧ": "T",
        "ţ": "t",
        "ť": "t",
        "ŧ": "t",
        "Ũ": "U",
        "Ū": "U",
        "Ŭ": "U",
        "Ů": "U",
        "Ű": "U",
        "Ų": "U",
        "ũ": "u",
        "ū": "u",
        "ŭ": "u",
        "ů": "u",
        "ű": "u",
        "ų": "u",
        "Ŵ": "W",
        "ŵ": "w",
        "Ŷ": "Y",
        "ŷ": "y",
        "Ÿ": "Y",
        "Ź": "Z",
        "Ż": "Z",
        "Ž": "Z",
        "ź": "z",
        "ż": "z",
        "ž": "z",
        "Ĳ": "IJ",
        "ĳ": "ij",
        "Œ": "Oe",
        "œ": "oe",
        "ŉ": "'n",
        "ſ": "s"
      };
      var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      var htmlUnescapes = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      var stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      var freeParseFloat = parseFloat, freeParseInt = parseInt;
      var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = exports && !exports.nodeType && exports;
      var freeModule = freeExports && true && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types = freeModule && freeModule.require && freeModule.require("util").types;
          if (types) {
            return types;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e2) {
        }
      }();
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      function apply3(func, thisArg, args) {
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
      function arrayAggregator(array, setter, iteratee, accumulator) {
        var index2 = -1, length2 = array == null ? 0 : array.length;
        while (++index2 < length2) {
          var value = array[index2];
          setter(accumulator, value, iteratee(value), array);
        }
        return accumulator;
      }
      function arrayEach(array, iteratee) {
        var index2 = -1, length2 = array == null ? 0 : array.length;
        while (++index2 < length2) {
          if (iteratee(array[index2], index2, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEachRight(array, iteratee) {
        var length2 = array == null ? 0 : array.length;
        while (length2--) {
          if (iteratee(array[length2], length2, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEvery(array, predicate) {
        var index2 = -1, length2 = array == null ? 0 : array.length;
        while (++index2 < length2) {
          if (!predicate(array[index2], index2, array)) {
            return false;
          }
        }
        return true;
      }
      function arrayFilter(array, predicate) {
        var index2 = -1, length2 = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index2 < length2) {
          var value = array[index2];
          if (predicate(value, index2, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function arrayIncludes(array, value) {
        var length2 = array == null ? 0 : array.length;
        return !!length2 && baseIndexOf(array, value, 0) > -1;
      }
      function arrayIncludesWith(array, value, comparator) {
        var index2 = -1, length2 = array == null ? 0 : array.length;
        while (++index2 < length2) {
          if (comparator(value, array[index2])) {
            return true;
          }
        }
        return false;
      }
      function arrayMap(array, iteratee) {
        var index2 = -1, length2 = array == null ? 0 : array.length, result = Array(length2);
        while (++index2 < length2) {
          result[index2] = iteratee(array[index2], index2, array);
        }
        return result;
      }
      function arrayPush(array, values2) {
        var index2 = -1, length2 = values2.length, offset3 = array.length;
        while (++index2 < length2) {
          array[offset3 + index2] = values2[index2];
        }
        return array;
      }
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index2 = -1, length2 = array == null ? 0 : array.length;
        if (initAccum && length2) {
          accumulator = array[++index2];
        }
        while (++index2 < length2) {
          accumulator = iteratee(accumulator, array[index2], index2, array);
        }
        return accumulator;
      }
      function arrayReduceRight(array, iteratee, accumulator, initAccum) {
        var length2 = array == null ? 0 : array.length;
        if (initAccum && length2) {
          accumulator = array[--length2];
        }
        while (length2--) {
          accumulator = iteratee(accumulator, array[length2], length2, array);
        }
        return accumulator;
      }
      function arraySome(array, predicate) {
        var index2 = -1, length2 = array == null ? 0 : array.length;
        while (++index2 < length2) {
          if (predicate(array[index2], index2, array)) {
            return true;
          }
        }
        return false;
      }
      var asciiSize = baseProperty("length");
      function asciiToArray(string) {
        return string.split("");
      }
      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }
      function baseFindKey(collection, predicate, eachFunc) {
        var result;
        eachFunc(collection, function(value, key, collection2) {
          if (predicate(value, key, collection2)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length2 = array.length, index2 = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index2-- : ++index2 < length2) {
          if (predicate(array[index2], index2, array)) {
            return index2;
          }
        }
        return -1;
      }
      function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
      }
      function baseIndexOfWith(array, value, fromIndex, comparator) {
        var index2 = fromIndex - 1, length2 = array.length;
        while (++index2 < length2) {
          if (comparator(array[index2], value)) {
            return index2;
          }
        }
        return -1;
      }
      function baseIsNaN(value) {
        return value !== value;
      }
      function baseMean(array, iteratee) {
        var length2 = array == null ? 0 : array.length;
        return length2 ? baseSum(array, iteratee) / length2 : NAN;
      }
      function baseProperty(key) {
        return function(object) {
          return object == null ? undefined$1 : object[key];
        };
      }
      function basePropertyOf(object) {
        return function(key) {
          return object == null ? undefined$1 : object[key];
        };
      }
      function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
        eachFunc(collection, function(value, index2, collection2) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index2, collection2);
        });
        return accumulator;
      }
      function baseSortBy(array, comparer) {
        var length2 = array.length;
        array.sort(comparer);
        while (length2--) {
          array[length2] = array[length2].value;
        }
        return array;
      }
      function baseSum(array, iteratee) {
        var result, index2 = -1, length2 = array.length;
        while (++index2 < length2) {
          var current = iteratee(array[index2]);
          if (current !== undefined$1) {
            result = result === undefined$1 ? current : result + current;
          }
        }
        return result;
      }
      function baseTimes(n2, iteratee) {
        var index2 = -1, result = Array(n2);
        while (++index2 < n2) {
          result[index2] = iteratee(index2);
        }
        return result;
      }
      function baseToPairs(object, props) {
        return arrayMap(props, function(key) {
          return [key, object[key]];
        });
      }
      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      function baseValues(object, props) {
        return arrayMap(props, function(key) {
          return object[key];
        });
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      function charsStartIndex(strSymbols, chrSymbols) {
        var index2 = -1, length2 = strSymbols.length;
        while (++index2 < length2 && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
        }
        return index2;
      }
      function charsEndIndex(strSymbols, chrSymbols) {
        var index2 = strSymbols.length;
        while (index2-- && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
        }
        return index2;
      }
      function countHolders(array, placeholder) {
        var length2 = array.length, result = 0;
        while (length2--) {
          if (array[length2] === placeholder) {
            ++result;
          }
        }
        return result;
      }
      var deburrLetter = basePropertyOf(deburredLetters);
      var escapeHtmlChar = basePropertyOf(htmlEscapes);
      function escapeStringChar(chr) {
        return "\\" + stringEscapes[chr];
      }
      function getValue2(object, key) {
        return object == null ? undefined$1 : object[key];
      }
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }
      function iteratorToArray(iterator) {
        var data, result = [];
        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }
      function mapToArray(map) {
        var index2 = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index2] = [key, value];
        });
        return result;
      }
      function overArg(func, transform) {
        return function(arg2) {
          return func(transform(arg2));
        };
      }
      function replaceHolders(array, placeholder) {
        var index2 = -1, length2 = array.length, resIndex = 0, result = [];
        while (++index2 < length2) {
          var value = array[index2];
          if (value === placeholder || value === PLACEHOLDER) {
            array[index2] = PLACEHOLDER;
            result[resIndex++] = index2;
          }
        }
        return result;
      }
      function setToArray(set) {
        var index2 = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index2] = value;
        });
        return result;
      }
      function setToPairs(set) {
        var index2 = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index2] = [value, value];
        });
        return result;
      }
      function strictIndexOf(array, value, fromIndex) {
        var index2 = fromIndex - 1, length2 = array.length;
        while (++index2 < length2) {
          if (array[index2] === value) {
            return index2;
          }
        }
        return -1;
      }
      function strictLastIndexOf(array, value, fromIndex) {
        var index2 = fromIndex + 1;
        while (index2--) {
          if (array[index2] === value) {
            return index2;
          }
        }
        return index2;
      }
      function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
      }
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      function trimmedEndIndex(string) {
        var index2 = string.length;
        while (index2-- && reWhitespace.test(string.charAt(index2))) {
        }
        return index2;
      }
      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
      function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
          ++result;
        }
        return result;
      }
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }
      var runInContext = function runInContext2(context) {
        context = context == null ? root : _2.defaults(root.Object(), context, _2.pick(root, contextProps));
        var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
        var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
        var coreJsData = context["__core-js_shared__"];
        var funcToString = funcProto.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var idCounter = 0;
        var maskSrcKey = function() {
          var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
          return uid ? "Symbol(src)_1." + uid : "";
        }();
        var nativeObjectToString = objectProto.toString;
        var objectCtorString = funcToString.call(Object2);
        var oldDash = root._;
        var reIsNative = RegExp2(
          "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
        );
        var Buffer2 = moduleExports ? context.Buffer : undefined$1, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined$1, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined$1, symIterator = Symbol2 ? Symbol2.iterator : undefined$1, symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined$1;
        var defineProperty2 = function() {
          try {
            var func = getNative(Object2, "defineProperty");
            func({}, "", {});
            return func;
          } catch (e2) {
          }
        }();
        var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
        var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined$1, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
        var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"), WeakMap2 = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
        var metaMap = WeakMap2 && new WeakMap2();
        var realNames = {};
        var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap2);
        var symbolProto = Symbol2 ? Symbol2.prototype : undefined$1, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1, symbolToString = symbolProto ? symbolProto.toString : undefined$1;
        function lodash2(value) {
          if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
              return value;
            }
            if (hasOwnProperty.call(value, "__wrapped__")) {
              return wrapperClone(value);
            }
          }
          return new LodashWrapper(value);
        }
        var baseCreate = /* @__PURE__ */ function() {
          function object() {
          }
          return function(proto) {
            if (!isObject(proto)) {
              return {};
            }
            if (objectCreate) {
              return objectCreate(proto);
            }
            object.prototype = proto;
            var result2 = new object();
            object.prototype = undefined$1;
            return result2;
          };
        }();
        function baseLodash() {
        }
        function LodashWrapper(value, chainAll) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__chain__ = !!chainAll;
          this.__index__ = 0;
          this.__values__ = undefined$1;
        }
        lodash2.templateSettings = {
          /**
           * Used to detect `data` property values to be HTML-escaped.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          "escape": reEscape,
          /**
           * Used to detect code to be evaluated.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          "evaluate": reEvaluate,
          /**
           * Used to detect `data` property values to inject.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          "interpolate": reInterpolate,
          /**
           * Used to reference the data object in the template text.
           *
           * @memberOf _.templateSettings
           * @type {string}
           */
          "variable": "",
          /**
           * Used to import variables into the compiled template.
           *
           * @memberOf _.templateSettings
           * @type {Object}
           */
          "imports": {
            /**
             * A reference to the `lodash` function.
             *
             * @memberOf _.templateSettings.imports
             * @type {Function}
             */
            "_": lodash2
          }
        };
        lodash2.prototype = baseLodash.prototype;
        lodash2.prototype.constructor = lodash2;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        function LazyWrapper(value) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__dir__ = 1;
          this.__filtered__ = false;
          this.__iteratees__ = [];
          this.__takeCount__ = MAX_ARRAY_LENGTH;
          this.__views__ = [];
        }
        function lazyClone() {
          var result2 = new LazyWrapper(this.__wrapped__);
          result2.__actions__ = copyArray(this.__actions__);
          result2.__dir__ = this.__dir__;
          result2.__filtered__ = this.__filtered__;
          result2.__iteratees__ = copyArray(this.__iteratees__);
          result2.__takeCount__ = this.__takeCount__;
          result2.__views__ = copyArray(this.__views__);
          return result2;
        }
        function lazyReverse() {
          if (this.__filtered__) {
            var result2 = new LazyWrapper(this);
            result2.__dir__ = -1;
            result2.__filtered__ = true;
          } else {
            result2 = this.clone();
            result2.__dir__ *= -1;
          }
          return result2;
        }
        function lazyValue() {
          var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end2 = view.end, length2 = end2 - start, index2 = isRight ? end2 : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length2, this.__takeCount__);
          if (!isArr || !isRight && arrLength == length2 && takeCount == length2) {
            return baseWrapperValue(array, this.__actions__);
          }
          var result2 = [];
          outer:
            while (length2-- && resIndex < takeCount) {
              index2 += dir;
              var iterIndex = -1, value = array[index2];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
                if (type == LAZY_MAP_FLAG) {
                  value = computed;
                } else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) {
                    continue outer;
                  } else {
                    break outer;
                  }
                }
              }
              result2[resIndex++] = value;
            }
          return result2;
        }
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        function Hash(entries) {
          var index2 = -1, length2 = entries == null ? 0 : entries.length;
          this.clear();
          while (++index2 < length2) {
            var entry = entries[index2];
            this.set(entry[0], entry[1]);
          }
        }
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
          this.size = 0;
        }
        function hashDelete(key) {
          var result2 = this.has(key) && delete this.__data__[key];
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function hashGet(key) {
          var data = this.__data__;
          if (nativeCreate) {
            var result2 = data[key];
            return result2 === HASH_UNDEFINED ? undefined$1 : result2;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
        }
        function hashHas(key) {
          var data = this.__data__;
          return nativeCreate ? data[key] !== undefined$1 : hasOwnProperty.call(data, key);
        }
        function hashSet(key, value) {
          var data = this.__data__;
          this.size += this.has(key) ? 0 : 1;
          data[key] = nativeCreate && value === undefined$1 ? HASH_UNDEFINED : value;
          return this;
        }
        Hash.prototype.clear = hashClear;
        Hash.prototype["delete"] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;
        function ListCache(entries) {
          var index2 = -1, length2 = entries == null ? 0 : entries.length;
          this.clear();
          while (++index2 < length2) {
            var entry = entries[index2];
            this.set(entry[0], entry[1]);
          }
        }
        function listCacheClear() {
          this.__data__ = [];
          this.size = 0;
        }
        function listCacheDelete(key) {
          var data = this.__data__, index2 = assocIndexOf(data, key);
          if (index2 < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index2 == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index2, 1);
          }
          --this.size;
          return true;
        }
        function listCacheGet(key) {
          var data = this.__data__, index2 = assocIndexOf(data, key);
          return index2 < 0 ? undefined$1 : data[index2][1];
        }
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }
        function listCacheSet(key, value) {
          var data = this.__data__, index2 = assocIndexOf(data, key);
          if (index2 < 0) {
            ++this.size;
            data.push([key, value]);
          } else {
            data[index2][1] = value;
          }
          return this;
        }
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype["delete"] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;
        function MapCache(entries) {
          var index2 = -1, length2 = entries == null ? 0 : entries.length;
          this.clear();
          while (++index2 < length2) {
            var entry = entries[index2];
            this.set(entry[0], entry[1]);
          }
        }
        function mapCacheClear() {
          this.size = 0;
          this.__data__ = {
            "hash": new Hash(),
            "map": new (Map2 || ListCache)(),
            "string": new Hash()
          };
        }
        function mapCacheDelete(key) {
          var result2 = getMapData(this, key)["delete"](key);
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }
        function mapCacheSet(key, value) {
          var data = getMapData(this, key), size2 = data.size;
          data.set(key, value);
          this.size += data.size == size2 ? 0 : 1;
          return this;
        }
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype["delete"] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;
        function SetCache(values3) {
          var index2 = -1, length2 = values3 == null ? 0 : values3.length;
          this.__data__ = new MapCache();
          while (++index2 < length2) {
            this.add(values3[index2]);
          }
        }
        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }
        function setCacheHas(value) {
          return this.__data__.has(value);
        }
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;
        function Stack(entries) {
          var data = this.__data__ = new ListCache(entries);
          this.size = data.size;
        }
        function stackClear() {
          this.__data__ = new ListCache();
          this.size = 0;
        }
        function stackDelete(key) {
          var data = this.__data__, result2 = data["delete"](key);
          this.size = data.size;
          return result2;
        }
        function stackGet(key) {
          return this.__data__.get(key);
        }
        function stackHas(key) {
          return this.__data__.has(key);
        }
        function stackSet(key, value) {
          var data = this.__data__;
          if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
              pairs.push([key, value]);
              this.size = ++data.size;
              return this;
            }
            data = this.__data__ = new MapCache(pairs);
          }
          data.set(key, value);
          this.size = data.size;
          return this;
        }
        Stack.prototype.clear = stackClear;
        Stack.prototype["delete"] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;
        function arrayLikeKeys(value, inherited) {
          var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length2 = result2.length;
          for (var key in value) {
            if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
            (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
            isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
            isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
            isIndex(key, length2)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function arraySample(array) {
          var length2 = array.length;
          return length2 ? array[baseRandom(0, length2 - 1)] : undefined$1;
        }
        function arraySampleSize(array, n2) {
          return shuffleSelf(copyArray(array), baseClamp(n2, 0, array.length));
        }
        function arrayShuffle(array) {
          return shuffleSelf(copyArray(array));
        }
        function assignMergeValue(object, key, value) {
          if (value !== undefined$1 && !eq(object[key], value) || value === undefined$1 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assignValue(object, key, value) {
          var objValue = object[key];
          if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined$1 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assocIndexOf(array, key) {
          var length2 = array.length;
          while (length2--) {
            if (eq(array[length2][0], key)) {
              return length2;
            }
          }
          return -1;
        }
        function baseAggregator(collection, setter, iteratee2, accumulator) {
          baseEach(collection, function(value, key, collection2) {
            setter(accumulator, value, iteratee2(value), collection2);
          });
          return accumulator;
        }
        function baseAssign(object, source) {
          return object && copyObject(source, keys(source), object);
        }
        function baseAssignIn(object, source) {
          return object && copyObject(source, keysIn(source), object);
        }
        function baseAssignValue(object, key, value) {
          if (key == "__proto__" && defineProperty2) {
            defineProperty2(object, key, {
              "configurable": true,
              "enumerable": true,
              "value": value,
              "writable": true
            });
          } else {
            object[key] = value;
          }
        }
        function baseAt(object, paths) {
          var index2 = -1, length2 = paths.length, result2 = Array2(length2), skip = object == null;
          while (++index2 < length2) {
            result2[index2] = skip ? undefined$1 : get2(object, paths[index2]);
          }
          return result2;
        }
        function baseClamp(number, lower, upper) {
          if (number === number) {
            if (upper !== undefined$1) {
              number = number <= upper ? number : upper;
            }
            if (lower !== undefined$1) {
              number = number >= lower ? number : lower;
            }
          }
          return number;
        }
        function baseClone(value, bitmask, customizer, key, object, stack) {
          var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
          if (customizer) {
            result2 = object ? customizer(value, key, object, stack) : customizer(value);
          }
          if (result2 !== undefined$1) {
            return result2;
          }
          if (!isObject(value)) {
            return value;
          }
          var isArr = isArray(value);
          if (isArr) {
            result2 = initCloneArray(value);
            if (!isDeep) {
              return copyArray(value, result2);
            }
          } else {
            var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
            if (isBuffer(value)) {
              return cloneBuffer(value, isDeep);
            }
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
              result2 = isFlat || isFunc ? {} : initCloneObject(value);
              if (!isDeep) {
                return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
              }
            } else {
              if (!cloneableTags[tag]) {
                return object ? value : {};
              }
              result2 = initCloneByTag(value, tag, isDeep);
            }
          }
          stack || (stack = new Stack());
          var stacked = stack.get(value);
          if (stacked) {
            return stacked;
          }
          stack.set(value, result2);
          if (isSet(value)) {
            value.forEach(function(subValue) {
              result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
            });
          } else if (isMap(value)) {
            value.forEach(function(subValue, key2) {
              result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
            });
          }
          var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
          var props = isArr ? undefined$1 : keysFunc(value);
          arrayEach(props || value, function(subValue, key2) {
            if (props) {
              key2 = subValue;
              subValue = value[key2];
            }
            assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
          return result2;
        }
        function baseConforms(source) {
          var props = keys(source);
          return function(object) {
            return baseConformsTo(object, source, props);
          };
        }
        function baseConformsTo(object, source, props) {
          var length2 = props.length;
          if (object == null) {
            return !length2;
          }
          object = Object2(object);
          while (length2--) {
            var key = props[length2], predicate = source[key], value = object[key];
            if (value === undefined$1 && !(key in object) || !predicate(value)) {
              return false;
            }
          }
          return true;
        }
        function baseDelay(func, wait, args) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return setTimeout2(function() {
            func.apply(undefined$1, args);
          }, wait);
        }
        function baseDifference(array, values3, iteratee2, comparator) {
          var index2 = -1, includes2 = arrayIncludes, isCommon = true, length2 = array.length, result2 = [], valuesLength = values3.length;
          if (!length2) {
            return result2;
          }
          if (iteratee2) {
            values3 = arrayMap(values3, baseUnary(iteratee2));
          }
          if (comparator) {
            includes2 = arrayIncludesWith;
            isCommon = false;
          } else if (values3.length >= LARGE_ARRAY_SIZE) {
            includes2 = cacheHas;
            isCommon = false;
            values3 = new SetCache(values3);
          }
          outer:
            while (++index2 < length2) {
              var value = array[index2], computed = iteratee2 == null ? value : iteratee2(value);
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values3[valuesIndex] === computed) {
                    continue outer;
                  }
                }
                result2.push(value);
              } else if (!includes2(values3, computed, comparator)) {
                result2.push(value);
              }
            }
          return result2;
        }
        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);
        function baseEvery(collection, predicate) {
          var result2 = true;
          baseEach(collection, function(value, index2, collection2) {
            result2 = !!predicate(value, index2, collection2);
            return result2;
          });
          return result2;
        }
        function baseExtremum(array, iteratee2, comparator) {
          var index2 = -1, length2 = array.length;
          while (++index2 < length2) {
            var value = array[index2], current = iteratee2(value);
            if (current != null && (computed === undefined$1 ? current === current && !isSymbol(current) : comparator(current, computed))) {
              var computed = current, result2 = value;
            }
          }
          return result2;
        }
        function baseFill(array, value, start, end2) {
          var length2 = array.length;
          start = toInteger(start);
          if (start < 0) {
            start = -start > length2 ? 0 : length2 + start;
          }
          end2 = end2 === undefined$1 || end2 > length2 ? length2 : toInteger(end2);
          if (end2 < 0) {
            end2 += length2;
          }
          end2 = start > end2 ? 0 : toLength(end2);
          while (start < end2) {
            array[start++] = value;
          }
          return array;
        }
        function baseFilter(collection, predicate) {
          var result2 = [];
          baseEach(collection, function(value, index2, collection2) {
            if (predicate(value, index2, collection2)) {
              result2.push(value);
            }
          });
          return result2;
        }
        function baseFlatten(array, depth, predicate, isStrict, result2) {
          var index2 = -1, length2 = array.length;
          predicate || (predicate = isFlattenable);
          result2 || (result2 = []);
          while (++index2 < length2) {
            var value = array[index2];
            if (depth > 0 && predicate(value)) {
              if (depth > 1) {
                baseFlatten(value, depth - 1, predicate, isStrict, result2);
              } else {
                arrayPush(result2, value);
              }
            } else if (!isStrict) {
              result2[result2.length] = value;
            }
          }
          return result2;
        }
        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);
        function baseForOwn(object, iteratee2) {
          return object && baseFor(object, iteratee2, keys);
        }
        function baseForOwnRight(object, iteratee2) {
          return object && baseForRight(object, iteratee2, keys);
        }
        function baseFunctions(object, props) {
          return arrayFilter(props, function(key) {
            return isFunction(object[key]);
          });
        }
        function baseGet(object, path) {
          path = castPath(path, object);
          var index2 = 0, length2 = path.length;
          while (object != null && index2 < length2) {
            object = object[toKey(path[index2++])];
          }
          return index2 && index2 == length2 ? object : undefined$1;
        }
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
          var result2 = keysFunc(object);
          return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
        }
        function baseGetTag(value) {
          if (value == null) {
            return value === undefined$1 ? undefinedTag : nullTag;
          }
          return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
        }
        function baseGt(value, other) {
          return value > other;
        }
        function baseHas(object, key) {
          return object != null && hasOwnProperty.call(object, key);
        }
        function baseHasIn(object, key) {
          return object != null && key in Object2(object);
        }
        function baseInRange(number, start, end2) {
          return number >= nativeMin(start, end2) && number < nativeMax(start, end2);
        }
        function baseIntersection(arrays, iteratee2, comparator) {
          var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length2 = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
          while (othIndex--) {
            var array = arrays[othIndex];
            if (othIndex && iteratee2) {
              array = arrayMap(array, baseUnary(iteratee2));
            }
            maxLength = nativeMin(array.length, maxLength);
            caches[othIndex] = !comparator && (iteratee2 || length2 >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined$1;
          }
          array = arrays[0];
          var index2 = -1, seen = caches[0];
          outer:
            while (++index2 < length2 && result2.length < maxLength) {
              var value = array[index2], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                othIndex = othLength;
                while (--othIndex) {
                  var cache = caches[othIndex];
                  if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                    continue outer;
                  }
                }
                if (seen) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseInverter(object, setter, iteratee2, accumulator) {
          baseForOwn(object, function(value, key, object2) {
            setter(accumulator, iteratee2(value), key, object2);
          });
          return accumulator;
        }
        function baseInvoke(object, path, args) {
          path = castPath(path, object);
          object = parent(object, path);
          var func = object == null ? object : object[toKey(last(path))];
          return func == null ? undefined$1 : apply3(func, object, args);
        }
        function baseIsArguments(value) {
          return isObjectLike(value) && baseGetTag(value) == argsTag;
        }
        function baseIsArrayBuffer(value) {
          return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
        }
        function baseIsDate(value) {
          return isObjectLike(value) && baseGetTag(value) == dateTag;
        }
        function baseIsEqual(value, other, bitmask, customizer, stack) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
        }
        function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
          var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
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
            stack || (stack = new Stack());
            return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
          }
          if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
              stack || (stack = new Stack());
              return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack || (stack = new Stack());
          return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
        }
        function baseIsMap(value) {
          return isObjectLike(value) && getTag(value) == mapTag;
        }
        function baseIsMatch(object, source, matchData, customizer) {
          var index2 = matchData.length, length2 = index2, noCustomizer = !customizer;
          if (object == null) {
            return !length2;
          }
          object = Object2(object);
          while (index2--) {
            var data = matchData[index2];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
              return false;
            }
          }
          while (++index2 < length2) {
            data = matchData[index2];
            var key = data[0], objValue = object[key], srcValue = data[1];
            if (noCustomizer && data[2]) {
              if (objValue === undefined$1 && !(key in object)) {
                return false;
              }
            } else {
              var stack = new Stack();
              if (customizer) {
                var result2 = customizer(objValue, srcValue, key, object, source, stack);
              }
              if (!(result2 === undefined$1 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                return false;
              }
            }
          }
          return true;
        }
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }
        function baseIsRegExp(value) {
          return isObjectLike(value) && baseGetTag(value) == regexpTag;
        }
        function baseIsSet(value) {
          return isObjectLike(value) && getTag(value) == setTag;
        }
        function baseIsTypedArray(value) {
          return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }
        function baseIteratee(value) {
          if (typeof value == "function") {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == "object") {
            return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
          }
          return property(value);
        }
        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result2 = [];
          for (var key in Object2(object)) {
            if (hasOwnProperty.call(object, key) && key != "constructor") {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseKeysIn(object) {
          if (!isObject(object)) {
            return nativeKeysIn(object);
          }
          var isProto = isPrototype(object), result2 = [];
          for (var key in object) {
            if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseLt(value, other) {
          return value < other;
        }
        function baseMap(collection, iteratee2) {
          var index2 = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value, key, collection2) {
            result2[++index2] = iteratee2(value, key, collection2);
          });
          return result2;
        }
        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function(object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }
        function baseMatchesProperty(path, srcValue) {
          if (isKey(path) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path), srcValue);
          }
          return function(object) {
            var objValue = get2(object, path);
            return objValue === undefined$1 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
          };
        }
        function baseMerge(object, source, srcIndex, customizer, stack) {
          if (object === source) {
            return;
          }
          baseFor(source, function(srcValue, key) {
            stack || (stack = new Stack());
            if (isObject(srcValue)) {
              baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
            } else {
              var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined$1;
              if (newValue === undefined$1) {
                newValue = srcValue;
              }
              assignMergeValue(object, key, newValue);
            }
          }, keysIn);
        }
        function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
          var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
          if (stacked) {
            assignMergeValue(object, key, stacked);
            return;
          }
          var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined$1;
          var isCommon = newValue === undefined$1;
          if (isCommon) {
            var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
            newValue = srcValue;
            if (isArr || isBuff || isTyped) {
              if (isArray(objValue)) {
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
            } else if (isPlainObject2(srcValue) || isArguments(srcValue)) {
              newValue = objValue;
              if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
              } else if (!isObject(objValue) || isFunction(objValue)) {
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
          assignMergeValue(object, key, newValue);
        }
        function baseNth(array, n2) {
          var length2 = array.length;
          if (!length2) {
            return;
          }
          n2 += n2 < 0 ? length2 : 0;
          return isIndex(n2, length2) ? array[n2] : undefined$1;
        }
        function baseOrderBy(collection, iteratees, orders) {
          if (iteratees.length) {
            iteratees = arrayMap(iteratees, function(iteratee2) {
              if (isArray(iteratee2)) {
                return function(value) {
                  return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                };
              }
              return iteratee2;
            });
          } else {
            iteratees = [identity];
          }
          var index2 = -1;
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          var result2 = baseMap(collection, function(value, key, collection2) {
            var criteria = arrayMap(iteratees, function(iteratee2) {
              return iteratee2(value);
            });
            return { "criteria": criteria, "index": ++index2, "value": value };
          });
          return baseSortBy(result2, function(object, other) {
            return compareMultiple(object, other, orders);
          });
        }
        function basePick(object, paths) {
          return basePickBy(object, paths, function(value, path) {
            return hasIn(object, path);
          });
        }
        function basePickBy(object, paths, predicate) {
          var index2 = -1, length2 = paths.length, result2 = {};
          while (++index2 < length2) {
            var path = paths[index2], value = baseGet(object, path);
            if (predicate(value, path)) {
              baseSet(result2, castPath(path, object), value);
            }
          }
          return result2;
        }
        function basePropertyDeep(path) {
          return function(object) {
            return baseGet(object, path);
          };
        }
        function basePullAll(array, values3, iteratee2, comparator) {
          var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index2 = -1, length2 = values3.length, seen = array;
          if (array === values3) {
            values3 = copyArray(values3);
          }
          if (iteratee2) {
            seen = arrayMap(array, baseUnary(iteratee2));
          }
          while (++index2 < length2) {
            var fromIndex = 0, value = values3[index2], computed = iteratee2 ? iteratee2(value) : value;
            while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
              if (seen !== array) {
                splice.call(seen, fromIndex, 1);
              }
              splice.call(array, fromIndex, 1);
            }
          }
          return array;
        }
        function basePullAt(array, indexes) {
          var length2 = array ? indexes.length : 0, lastIndex = length2 - 1;
          while (length2--) {
            var index2 = indexes[length2];
            if (length2 == lastIndex || index2 !== previous) {
              var previous = index2;
              if (isIndex(index2)) {
                splice.call(array, index2, 1);
              } else {
                baseUnset(array, index2);
              }
            }
          }
          return array;
        }
        function baseRandom(lower, upper) {
          return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
        }
        function baseRange(start, end2, step, fromRight) {
          var index2 = -1, length2 = nativeMax(nativeCeil((end2 - start) / (step || 1)), 0), result2 = Array2(length2);
          while (length2--) {
            result2[fromRight ? length2 : ++index2] = start;
            start += step;
          }
          return result2;
        }
        function baseRepeat(string, n2) {
          var result2 = "";
          if (!string || n2 < 1 || n2 > MAX_SAFE_INTEGER) {
            return result2;
          }
          do {
            if (n2 % 2) {
              result2 += string;
            }
            n2 = nativeFloor(n2 / 2);
            if (n2) {
              string += string;
            }
          } while (n2);
          return result2;
        }
        function baseRest(func, start) {
          return setToString(overRest(func, start, identity), func + "");
        }
        function baseSample(collection) {
          return arraySample(values2(collection));
        }
        function baseSampleSize(collection, n2) {
          var array = values2(collection);
          return shuffleSelf(array, baseClamp(n2, 0, array.length));
        }
        function baseSet(object, path, value, customizer) {
          if (!isObject(object)) {
            return object;
          }
          path = castPath(path, object);
          var index2 = -1, length2 = path.length, lastIndex = length2 - 1, nested = object;
          while (nested != null && ++index2 < length2) {
            var key = toKey(path[index2]), newValue = value;
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
              return object;
            }
            if (index2 != lastIndex) {
              var objValue = nested[key];
              newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
              if (newValue === undefined$1) {
                newValue = isObject(objValue) ? objValue : isIndex(path[index2 + 1]) ? [] : {};
              }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
          }
          return object;
        }
        var baseSetData = !metaMap ? identity : function(func, data) {
          metaMap.set(func, data);
          return func;
        };
        var baseSetToString = !defineProperty2 ? identity : function(func, string) {
          return defineProperty2(func, "toString", {
            "configurable": true,
            "enumerable": false,
            "value": constant(string),
            "writable": true
          });
        };
        function baseShuffle(collection) {
          return shuffleSelf(values2(collection));
        }
        function baseSlice(array, start, end2) {
          var index2 = -1, length2 = array.length;
          if (start < 0) {
            start = -start > length2 ? 0 : length2 + start;
          }
          end2 = end2 > length2 ? length2 : end2;
          if (end2 < 0) {
            end2 += length2;
          }
          length2 = start > end2 ? 0 : end2 - start >>> 0;
          start >>>= 0;
          var result2 = Array2(length2);
          while (++index2 < length2) {
            result2[index2] = array[index2 + start];
          }
          return result2;
        }
        function baseSome(collection, predicate) {
          var result2;
          baseEach(collection, function(value, index2, collection2) {
            result2 = predicate(value, index2, collection2);
            return !result2;
          });
          return !!result2;
        }
        function baseSortedIndex(array, value, retHighest) {
          var low = 0, high = array == null ? low : array.length;
          if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
              var mid = low + high >>> 1, computed = array[mid];
              if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return high;
          }
          return baseSortedIndexBy(array, value, identity, retHighest);
        }
        function baseSortedIndexBy(array, value, iteratee2, retHighest) {
          var low = 0, high = array == null ? 0 : array.length;
          if (high === 0) {
            return 0;
          }
          value = iteratee2(value);
          var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined$1;
          while (low < high) {
            var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined$1, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
            if (valIsNaN) {
              var setLow = retHighest || othIsReflexive;
            } else if (valIsUndefined) {
              setLow = othIsReflexive && (retHighest || othIsDefined);
            } else if (valIsNull) {
              setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
            } else if (valIsSymbol) {
              setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
            } else if (othIsNull || othIsSymbol) {
              setLow = false;
            } else {
              setLow = retHighest ? computed <= value : computed < value;
            }
            if (setLow) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return nativeMin(high, MAX_ARRAY_INDEX);
        }
        function baseSortedUniq(array, iteratee2) {
          var index2 = -1, length2 = array.length, resIndex = 0, result2 = [];
          while (++index2 < length2) {
            var value = array[index2], computed = iteratee2 ? iteratee2(value) : value;
            if (!index2 || !eq(computed, seen)) {
              var seen = computed;
              result2[resIndex++] = value === 0 ? 0 : value;
            }
          }
          return result2;
        }
        function baseToNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          return +value;
        }
        function baseToString(value) {
          if (typeof value == "string") {
            return value;
          }
          if (isArray(value)) {
            return arrayMap(value, baseToString) + "";
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : "";
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function baseUniq(array, iteratee2, comparator) {
          var index2 = -1, includes2 = arrayIncludes, length2 = array.length, isCommon = true, result2 = [], seen = result2;
          if (comparator) {
            isCommon = false;
            includes2 = arrayIncludesWith;
          } else if (length2 >= LARGE_ARRAY_SIZE) {
            var set2 = iteratee2 ? null : createSet(array);
            if (set2) {
              return setToArray(set2);
            }
            isCommon = false;
            includes2 = cacheHas;
            seen = new SetCache();
          } else {
            seen = iteratee2 ? [] : result2;
          }
          outer:
            while (++index2 < length2) {
              var value = array[index2], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var seenIndex = seen.length;
                while (seenIndex--) {
                  if (seen[seenIndex] === computed) {
                    continue outer;
                  }
                }
                if (iteratee2) {
                  seen.push(computed);
                }
                result2.push(value);
              } else if (!includes2(seen, computed, comparator)) {
                if (seen !== result2) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseUnset(object, path) {
          path = castPath(path, object);
          object = parent(object, path);
          return object == null || delete object[toKey(last(path))];
        }
        function baseUpdate(object, path, updater, customizer) {
          return baseSet(object, path, updater(baseGet(object, path)), customizer);
        }
        function baseWhile(array, predicate, isDrop, fromRight) {
          var length2 = array.length, index2 = fromRight ? length2 : -1;
          while ((fromRight ? index2-- : ++index2 < length2) && predicate(array[index2], index2, array)) {
          }
          return isDrop ? baseSlice(array, fromRight ? 0 : index2, fromRight ? index2 + 1 : length2) : baseSlice(array, fromRight ? index2 + 1 : 0, fromRight ? length2 : index2);
        }
        function baseWrapperValue(value, actions) {
          var result2 = value;
          if (result2 instanceof LazyWrapper) {
            result2 = result2.value();
          }
          return arrayReduce(actions, function(result3, action) {
            return action.func.apply(action.thisArg, arrayPush([result3], action.args));
          }, result2);
        }
        function baseXor(arrays, iteratee2, comparator) {
          var length2 = arrays.length;
          if (length2 < 2) {
            return length2 ? baseUniq(arrays[0]) : [];
          }
          var index2 = -1, result2 = Array2(length2);
          while (++index2 < length2) {
            var array = arrays[index2], othIndex = -1;
            while (++othIndex < length2) {
              if (othIndex != index2) {
                result2[index2] = baseDifference(result2[index2] || array, arrays[othIndex], iteratee2, comparator);
              }
            }
          }
          return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
        }
        function baseZipObject(props, values3, assignFunc) {
          var index2 = -1, length2 = props.length, valsLength = values3.length, result2 = {};
          while (++index2 < length2) {
            var value = index2 < valsLength ? values3[index2] : undefined$1;
            assignFunc(result2, props[index2], value);
          }
          return result2;
        }
        function castArrayLikeObject(value) {
          return isArrayLikeObject(value) ? value : [];
        }
        function castFunction(value) {
          return typeof value == "function" ? value : identity;
        }
        function castPath(value, object) {
          if (isArray(value)) {
            return value;
          }
          return isKey(value, object) ? [value] : stringToPath(toString2(value));
        }
        var castRest = baseRest;
        function castSlice(array, start, end2) {
          var length2 = array.length;
          end2 = end2 === undefined$1 ? length2 : end2;
          return !start && end2 >= length2 ? array : baseSlice(array, start, end2);
        }
        var clearTimeout2 = ctxClearTimeout || function(id) {
          return root.clearTimeout(id);
        };
        function cloneBuffer(buffer, isDeep) {
          if (isDeep) {
            return buffer.slice();
          }
          var length2 = buffer.length, result2 = allocUnsafe ? allocUnsafe(length2) : new buffer.constructor(length2);
          buffer.copy(result2);
          return result2;
        }
        function cloneArrayBuffer(arrayBuffer) {
          var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
          new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
          return result2;
        }
        function cloneDataView(dataView, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
          return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }
        function cloneRegExp(regexp) {
          var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
          result2.lastIndex = regexp.lastIndex;
          return result2;
        }
        function cloneSymbol(symbol) {
          return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
        }
        function cloneTypedArray(typedArray, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
          return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }
        function compareAscending(value, other) {
          if (value !== other) {
            var valIsDefined = value !== undefined$1, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
            var othIsDefined = other !== undefined$1, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
              return 1;
            }
            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
              return -1;
            }
          }
          return 0;
        }
        function compareMultiple(object, other, orders) {
          var index2 = -1, objCriteria = object.criteria, othCriteria = other.criteria, length2 = objCriteria.length, ordersLength = orders.length;
          while (++index2 < length2) {
            var result2 = compareAscending(objCriteria[index2], othCriteria[index2]);
            if (result2) {
              if (index2 >= ordersLength) {
                return result2;
              }
              var order = orders[index2];
              return result2 * (order == "desc" ? -1 : 1);
            }
          }
          return object.index - other.index;
        }
        function composeArgs(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
          while (++leftIndex < leftLength) {
            result2[leftIndex] = partials[leftIndex];
          }
          while (++argsIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[holders[argsIndex]] = args[argsIndex];
            }
          }
          while (rangeLength--) {
            result2[leftIndex++] = args[argsIndex++];
          }
          return result2;
        }
        function composeArgsRight(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
          while (++argsIndex < rangeLength) {
            result2[argsIndex] = args[argsIndex];
          }
          var offset3 = argsIndex;
          while (++rightIndex < rightLength) {
            result2[offset3 + rightIndex] = partials[rightIndex];
          }
          while (++holdersIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[offset3 + holders[holdersIndex]] = args[argsIndex++];
            }
          }
          return result2;
        }
        function copyArray(source, array) {
          var index2 = -1, length2 = source.length;
          array || (array = Array2(length2));
          while (++index2 < length2) {
            array[index2] = source[index2];
          }
          return array;
        }
        function copyObject(source, props, object, customizer) {
          var isNew = !object;
          object || (object = {});
          var index2 = -1, length2 = props.length;
          while (++index2 < length2) {
            var key = props[index2];
            var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined$1;
            if (newValue === undefined$1) {
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
        function copySymbols(source, object) {
          return copyObject(source, getSymbols(source), object);
        }
        function copySymbolsIn(source, object) {
          return copyObject(source, getSymbolsIn(source), object);
        }
        function createAggregator(setter, initializer) {
          return function(collection, iteratee2) {
            var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
            return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
          };
        }
        function createAssigner(assigner) {
          return baseRest(function(object, sources) {
            var index2 = -1, length2 = sources.length, customizer = length2 > 1 ? sources[length2 - 1] : undefined$1, guard = length2 > 2 ? sources[2] : undefined$1;
            customizer = assigner.length > 3 && typeof customizer == "function" ? (length2--, customizer) : undefined$1;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              customizer = length2 < 3 ? undefined$1 : customizer;
              length2 = 1;
            }
            object = Object2(object);
            while (++index2 < length2) {
              var source = sources[index2];
              if (source) {
                assigner(object, source, index2, customizer);
              }
            }
            return object;
          });
        }
        function createBaseEach(eachFunc, fromRight) {
          return function(collection, iteratee2) {
            if (collection == null) {
              return collection;
            }
            if (!isArrayLike(collection)) {
              return eachFunc(collection, iteratee2);
            }
            var length2 = collection.length, index2 = fromRight ? length2 : -1, iterable = Object2(collection);
            while (fromRight ? index2-- : ++index2 < length2) {
              if (iteratee2(iterable[index2], index2, iterable) === false) {
                break;
              }
            }
            return collection;
          };
        }
        function createBaseFor(fromRight) {
          return function(object, iteratee2, keysFunc) {
            var index2 = -1, iterable = Object2(object), props = keysFunc(object), length2 = props.length;
            while (length2--) {
              var key = props[fromRight ? length2 : ++index2];
              if (iteratee2(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }
        function createBind(func, bitmask, thisArg) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper2() {
            var fn = this && this !== root && this instanceof wrapper2 ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, arguments);
          }
          return wrapper2;
        }
        function createCaseFirst(methodName) {
          return function(string) {
            string = toString2(string);
            var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined$1;
            var chr = strSymbols ? strSymbols[0] : string.charAt(0);
            var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
            return chr[methodName]() + trailing;
          };
        }
        function createCompounder(callback) {
          return function(string) {
            return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
          };
        }
        function createCtor(Ctor) {
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
            return isObject(result2) ? result2 : thisBinding;
          };
        }
        function createCurry(func, bitmask, arity) {
          var Ctor = createCtor(func);
          function wrapper2() {
            var length2 = arguments.length, args = Array2(length2), index2 = length2, placeholder = getHolder(wrapper2);
            while (index2--) {
              args[index2] = arguments[index2];
            }
            var holders = length2 < 3 && args[0] !== placeholder && args[length2 - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
            length2 -= holders.length;
            if (length2 < arity) {
              return createRecurry(
                func,
                bitmask,
                createHybrid,
                wrapper2.placeholder,
                undefined$1,
                args,
                holders,
                undefined$1,
                undefined$1,
                arity - length2
              );
            }
            var fn = this && this !== root && this instanceof wrapper2 ? Ctor : func;
            return apply3(fn, this, args);
          }
          return wrapper2;
        }
        function createFind(findIndexFunc) {
          return function(collection, predicate, fromIndex) {
            var iterable = Object2(collection);
            if (!isArrayLike(collection)) {
              var iteratee2 = getIteratee(predicate, 3);
              collection = keys(collection);
              predicate = function(key) {
                return iteratee2(iterable[key], key, iterable);
              };
            }
            var index2 = findIndexFunc(collection, predicate, fromIndex);
            return index2 > -1 ? iterable[iteratee2 ? collection[index2] : index2] : undefined$1;
          };
        }
        function createFlow(fromRight) {
          return flatRest(function(funcs) {
            var length2 = funcs.length, index2 = length2, prereq = LodashWrapper.prototype.thru;
            if (fromRight) {
              funcs.reverse();
            }
            while (index2--) {
              var func = funcs[index2];
              if (typeof func != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              if (prereq && !wrapper2 && getFuncName(func) == "wrapper") {
                var wrapper2 = new LodashWrapper([], true);
              }
            }
            index2 = wrapper2 ? index2 : length2;
            while (++index2 < length2) {
              func = funcs[index2];
              var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined$1;
              if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                wrapper2 = wrapper2[getFuncName(data[0])].apply(wrapper2, data[3]);
              } else {
                wrapper2 = func.length == 1 && isLaziable(func) ? wrapper2[funcName]() : wrapper2.thru(func);
              }
            }
            return function() {
              var args = arguments, value = args[0];
              if (wrapper2 && args.length == 1 && isArray(value)) {
                return wrapper2.plant(value).value();
              }
              var index3 = 0, result2 = length2 ? funcs[index3].apply(this, args) : value;
              while (++index3 < length2) {
                result2 = funcs[index3].call(this, result2);
              }
              return result2;
            };
          });
        }
        function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
          var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined$1 : createCtor(func);
          function wrapper2() {
            var length2 = arguments.length, args = Array2(length2), index2 = length2;
            while (index2--) {
              args[index2] = arguments[index2];
            }
            if (isCurried) {
              var placeholder = getHolder(wrapper2), holdersCount = countHolders(args, placeholder);
            }
            if (partials) {
              args = composeArgs(args, partials, holders, isCurried);
            }
            if (partialsRight) {
              args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
            }
            length2 -= holdersCount;
            if (isCurried && length2 < arity) {
              var newHolders = replaceHolders(args, placeholder);
              return createRecurry(
                func,
                bitmask,
                createHybrid,
                wrapper2.placeholder,
                thisArg,
                args,
                newHolders,
                argPos,
                ary2,
                arity - length2
              );
            }
            var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
            length2 = args.length;
            if (argPos) {
              args = reorder2(args, argPos);
            } else if (isFlip && length2 > 1) {
              args.reverse();
            }
            if (isAry && ary2 < length2) {
              args.length = ary2;
            }
            if (this && this !== root && this instanceof wrapper2) {
              fn = Ctor || createCtor(fn);
            }
            return fn.apply(thisBinding, args);
          }
          return wrapper2;
        }
        function createInverter(setter, toIteratee) {
          return function(object, iteratee2) {
            return baseInverter(object, setter, toIteratee(iteratee2), {});
          };
        }
        function createMathOperation(operator, defaultValue) {
          return function(value, other) {
            var result2;
            if (value === undefined$1 && other === undefined$1) {
              return defaultValue;
            }
            if (value !== undefined$1) {
              result2 = value;
            }
            if (other !== undefined$1) {
              if (result2 === undefined$1) {
                return other;
              }
              if (typeof value == "string" || typeof other == "string") {
                value = baseToString(value);
                other = baseToString(other);
              } else {
                value = baseToNumber(value);
                other = baseToNumber(other);
              }
              result2 = operator(value, other);
            }
            return result2;
          };
        }
        function createOver(arrayFunc) {
          return flatRest(function(iteratees) {
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            return baseRest(function(args) {
              var thisArg = this;
              return arrayFunc(iteratees, function(iteratee2) {
                return apply3(iteratee2, thisArg, args);
              });
            });
          });
        }
        function createPadding(length2, chars) {
          chars = chars === undefined$1 ? " " : baseToString(chars);
          var charsLength = chars.length;
          if (charsLength < 2) {
            return charsLength ? baseRepeat(chars, length2) : chars;
          }
          var result2 = baseRepeat(chars, nativeCeil(length2 / stringSize(chars)));
          return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length2).join("") : result2.slice(0, length2);
        }
        function createPartial(func, bitmask, thisArg, partials) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper2() {
            var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper2 ? Ctor : func;
            while (++leftIndex < leftLength) {
              args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
              args[leftIndex++] = arguments[++argsIndex];
            }
            return apply3(fn, isBind ? thisArg : this, args);
          }
          return wrapper2;
        }
        function createRange(fromRight) {
          return function(start, end2, step) {
            if (step && typeof step != "number" && isIterateeCall(start, end2, step)) {
              end2 = step = undefined$1;
            }
            start = toFinite(start);
            if (end2 === undefined$1) {
              end2 = start;
              start = 0;
            } else {
              end2 = toFinite(end2);
            }
            step = step === undefined$1 ? start < end2 ? 1 : -1 : toFinite(step);
            return baseRange(start, end2, step, fromRight);
          };
        }
        function createRelationalOperation(operator) {
          return function(value, other) {
            if (!(typeof value == "string" && typeof other == "string")) {
              value = toNumber(value);
              other = toNumber(other);
            }
            return operator(value, other);
          };
        }
        function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
          var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined$1, newHoldersRight = isCurry ? undefined$1 : holders, newPartials = isCurry ? partials : undefined$1, newPartialsRight = isCurry ? undefined$1 : partials;
          bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
          bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
          if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
            bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
          }
          var newData = [
            func,
            bitmask,
            thisArg,
            newPartials,
            newHolders,
            newPartialsRight,
            newHoldersRight,
            argPos,
            ary2,
            arity
          ];
          var result2 = wrapFunc.apply(undefined$1, newData);
          if (isLaziable(func)) {
            setData(result2, newData);
          }
          result2.placeholder = placeholder;
          return setWrapToString(result2, func, bitmask);
        }
        function createRound(methodName) {
          var func = Math2[methodName];
          return function(number, precision) {
            number = toNumber(number);
            precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
            if (precision && nativeIsFinite(number)) {
              var pair = (toString2(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
              pair = (toString2(value) + "e").split("e");
              return +(pair[0] + "e" + (+pair[1] - precision));
            }
            return func(number);
          };
        }
        var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop2 : function(values3) {
          return new Set2(values3);
        };
        function createToPairs(keysFunc) {
          return function(object) {
            var tag = getTag(object);
            if (tag == mapTag) {
              return mapToArray(object);
            }
            if (tag == setTag) {
              return setToPairs(object);
            }
            return baseToPairs(object, keysFunc(object));
          };
        }
        function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
          var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
          if (!isBindKey && typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var length2 = partials ? partials.length : 0;
          if (!length2) {
            bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
            partials = holders = undefined$1;
          }
          ary2 = ary2 === undefined$1 ? ary2 : nativeMax(toInteger(ary2), 0);
          arity = arity === undefined$1 ? arity : toInteger(arity);
          length2 -= holders ? holders.length : 0;
          if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials, holdersRight = holders;
            partials = holders = undefined$1;
          }
          var data = isBindKey ? undefined$1 : getData(func);
          var newData = [
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            partialsRight,
            holdersRight,
            argPos,
            ary2,
            arity
          ];
          if (data) {
            mergeData(newData, data);
          }
          func = newData[0];
          bitmask = newData[1];
          thisArg = newData[2];
          partials = newData[3];
          holders = newData[4];
          arity = newData[9] = newData[9] === undefined$1 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length2, 0);
          if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
            bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
          }
          if (!bitmask || bitmask == WRAP_BIND_FLAG) {
            var result2 = createBind(func, bitmask, thisArg);
          } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
            result2 = createCurry(func, bitmask, arity);
          } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
            result2 = createPartial(func, bitmask, thisArg, partials);
          } else {
            result2 = createHybrid.apply(undefined$1, newData);
          }
          var setter = data ? baseSetData : setData;
          return setWrapToString(setter(result2, newData), func, bitmask);
        }
        function customDefaultsAssignIn(objValue, srcValue, key, object) {
          if (objValue === undefined$1 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
            return srcValue;
          }
          return objValue;
        }
        function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
          if (isObject(objValue) && isObject(srcValue)) {
            stack.set(srcValue, objValue);
            baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
            stack["delete"](srcValue);
          }
          return objValue;
        }
        function customOmitClone(value) {
          return isPlainObject2(value) ? undefined$1 : value;
        }
        function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          var arrStacked = stack.get(array);
          var othStacked = stack.get(other);
          if (arrStacked && othStacked) {
            return arrStacked == other && othStacked == array;
          }
          var index2 = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined$1;
          stack.set(array, other);
          stack.set(other, array);
          while (++index2 < arrLength) {
            var arrValue = array[index2], othValue = other[index2];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
            }
            if (compared !== undefined$1) {
              if (compared) {
                continue;
              }
              result2 = false;
              break;
            }
            if (seen) {
              if (!arraySome(other, function(othValue2, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
                result2 = false;
                break;
              }
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              result2 = false;
              break;
            }
          }
          stack["delete"](array);
          stack["delete"](other);
          return result2;
        }
        function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
          switch (tag) {
            case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;
            case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
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
            case mapTag:
              var convert = mapToArray;
            case setTag:
              var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) {
                return false;
              }
              var stacked = stack.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= COMPARE_UNORDERED_FLAG;
              stack.set(object, other);
              var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
              stack["delete"](object);
              return result2;
            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }
        function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index2 = objLength;
          while (index2--) {
            var key = objProps[index2];
            if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
              return false;
            }
          }
          var objStacked = stack.get(object);
          var othStacked = stack.get(other);
          if (objStacked && othStacked) {
            return objStacked == other && othStacked == object;
          }
          var result2 = true;
          stack.set(object, other);
          stack.set(other, object);
          var skipCtor = isPartial;
          while (++index2 < objLength) {
            key = objProps[index2];
            var objValue = object[key], othValue = other[key];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
            }
            if (!(compared === undefined$1 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
              result2 = false;
              break;
            }
            skipCtor || (skipCtor = key == "constructor");
          }
          if (result2 && !skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
              result2 = false;
            }
          }
          stack["delete"](object);
          stack["delete"](other);
          return result2;
        }
        function flatRest(func) {
          return setToString(overRest(func, undefined$1, flatten), func + "");
        }
        function getAllKeys(object) {
          return baseGetAllKeys(object, keys, getSymbols);
        }
        function getAllKeysIn(object) {
          return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }
        var getData = !metaMap ? noop2 : function(func) {
          return metaMap.get(func);
        };
        function getFuncName(func) {
          var result2 = func.name + "", array = realNames[result2], length2 = hasOwnProperty.call(realNames, result2) ? array.length : 0;
          while (length2--) {
            var data = array[length2], otherFunc = data.func;
            if (otherFunc == null || otherFunc == func) {
              return data.name;
            }
          }
          return result2;
        }
        function getHolder(func) {
          var object = hasOwnProperty.call(lodash2, "placeholder") ? lodash2 : func;
          return object.placeholder;
        }
        function getIteratee() {
          var result2 = lodash2.iteratee || iteratee;
          result2 = result2 === iteratee ? baseIteratee : result2;
          return arguments.length ? result2(arguments[0], arguments[1]) : result2;
        }
        function getMapData(map2, key) {
          var data = map2.__data__;
          return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
        }
        function getMatchData(object) {
          var result2 = keys(object), length2 = result2.length;
          while (length2--) {
            var key = result2[length2], value = object[key];
            result2[length2] = [key, value, isStrictComparable(value)];
          }
          return result2;
        }
        function getNative(object, key) {
          var value = getValue2(object, key);
          return baseIsNative(value) ? value : undefined$1;
        }
        function getRawTag(value) {
          var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
          try {
            value[symToStringTag] = undefined$1;
            var unmasked = true;
          } catch (e2) {
          }
          var result2 = nativeObjectToString.call(value);
          if (unmasked) {
            if (isOwn) {
              value[symToStringTag] = tag;
            } else {
              delete value[symToStringTag];
            }
          }
          return result2;
        }
        var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
          if (object == null) {
            return [];
          }
          object = Object2(object);
          return arrayFilter(nativeGetSymbols(object), function(symbol) {
            return propertyIsEnumerable.call(object, symbol);
          });
        };
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
          var result2 = [];
          while (object) {
            arrayPush(result2, getSymbols(object));
            object = getPrototype(object);
          }
          return result2;
        };
        var getTag = baseGetTag;
        if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
          getTag = function(value) {
            var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined$1, ctorString = Ctor ? toSource(Ctor) : "";
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
            return result2;
          };
        }
        function getView(start, end2, transforms2) {
          var index2 = -1, length2 = transforms2.length;
          while (++index2 < length2) {
            var data = transforms2[index2], size2 = data.size;
            switch (data.type) {
              case "drop":
                start += size2;
                break;
              case "dropRight":
                end2 -= size2;
                break;
              case "take":
                end2 = nativeMin(end2, start + size2);
                break;
              case "takeRight":
                start = nativeMax(start, end2 - size2);
                break;
            }
          }
          return { "start": start, "end": end2 };
        }
        function getWrapDetails(source) {
          var match2 = source.match(reWrapDetails);
          return match2 ? match2[1].split(reSplitDetails) : [];
        }
        function hasPath(object, path, hasFunc) {
          path = castPath(path, object);
          var index2 = -1, length2 = path.length, result2 = false;
          while (++index2 < length2) {
            var key = toKey(path[index2]);
            if (!(result2 = object != null && hasFunc(object, key))) {
              break;
            }
            object = object[key];
          }
          if (result2 || ++index2 != length2) {
            return result2;
          }
          length2 = object == null ? 0 : object.length;
          return !!length2 && isLength(length2) && isIndex(key, length2) && (isArray(object) || isArguments(object));
        }
        function initCloneArray(array) {
          var length2 = array.length, result2 = new array.constructor(length2);
          if (length2 && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
            result2.index = array.index;
            result2.input = array.input;
          }
          return result2;
        }
        function initCloneObject(object) {
          return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }
        function initCloneByTag(object, tag, isDeep) {
          var Ctor = object.constructor;
          switch (tag) {
            case arrayBufferTag:
              return cloneArrayBuffer(object);
            case boolTag:
            case dateTag:
              return new Ctor(+object);
            case dataViewTag:
              return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
              return cloneTypedArray(object, isDeep);
            case mapTag:
              return new Ctor();
            case numberTag:
            case stringTag:
              return new Ctor(object);
            case regexpTag:
              return cloneRegExp(object);
            case setTag:
              return new Ctor();
            case symbolTag:
              return cloneSymbol(object);
          }
        }
        function insertWrapDetails(source, details) {
          var length2 = details.length;
          if (!length2) {
            return source;
          }
          var lastIndex = length2 - 1;
          details[lastIndex] = (length2 > 1 ? "& " : "") + details[lastIndex];
          details = details.join(length2 > 2 ? ", " : " ");
          return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
        }
        function isFlattenable(value) {
          return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
        }
        function isIndex(value, length2) {
          var type = typeof value;
          length2 = length2 == null ? MAX_SAFE_INTEGER : length2;
          return !!length2 && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length2);
        }
        function isIterateeCall(value, index2, object) {
          if (!isObject(object)) {
            return false;
          }
          var type = typeof index2;
          if (type == "number" ? isArrayLike(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
            return eq(object[index2], value);
          }
          return false;
        }
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          var type = typeof value;
          if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
        }
        function isKeyable(value) {
          var type = typeof value;
          return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
        }
        function isLaziable(func) {
          var funcName = getFuncName(func), other = lodash2[funcName];
          if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
            return false;
          }
          if (func === other) {
            return true;
          }
          var data = getData(other);
          return !!data && func === data[0];
        }
        function isMasked(func) {
          return !!maskSrcKey && maskSrcKey in func;
        }
        var isMaskable = coreJsData ? isFunction : stubFalse;
        function isPrototype(value) {
          var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
          return value === proto;
        }
        function isStrictComparable(value) {
          return value === value && !isObject(value);
        }
        function matchesStrictComparable(key, srcValue) {
          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key] === srcValue && (srcValue !== undefined$1 || key in Object2(object));
          };
        }
        function memoizeCapped(func) {
          var result2 = memoize2(func, function(key) {
            if (cache.size === MAX_MEMOIZE_SIZE) {
              cache.clear();
            }
            return key;
          });
          var cache = result2.cache;
          return result2;
        }
        function mergeData(data, source) {
          var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
          var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
          if (!(isCommon || isCombo)) {
            return data;
          }
          if (srcBitmask & WRAP_BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
          }
          var value = source[3];
          if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : value;
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
          }
          value = source[5];
          if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
          }
          value = source[7];
          if (value) {
            data[7] = value;
          }
          if (srcBitmask & WRAP_ARY_FLAG) {
            data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
          }
          if (data[9] == null) {
            data[9] = source[9];
          }
          data[0] = source[0];
          data[1] = newBitmask;
          return data;
        }
        function nativeKeysIn(object) {
          var result2 = [];
          if (object != null) {
            for (var key in Object2(object)) {
              result2.push(key);
            }
          }
          return result2;
        }
        function objectToString(value) {
          return nativeObjectToString.call(value);
        }
        function overRest(func, start, transform2) {
          start = nativeMax(start === undefined$1 ? func.length - 1 : start, 0);
          return function() {
            var args = arguments, index2 = -1, length2 = nativeMax(args.length - start, 0), array = Array2(length2);
            while (++index2 < length2) {
              array[index2] = args[start + index2];
            }
            index2 = -1;
            var otherArgs = Array2(start + 1);
            while (++index2 < start) {
              otherArgs[index2] = args[index2];
            }
            otherArgs[start] = transform2(array);
            return apply3(func, this, otherArgs);
          };
        }
        function parent(object, path) {
          return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
        }
        function reorder2(array, indexes) {
          var arrLength = array.length, length2 = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
          while (length2--) {
            var index2 = indexes[length2];
            array[length2] = isIndex(index2, arrLength) ? oldArray[index2] : undefined$1;
          }
          return array;
        }
        function safeGet(object, key) {
          if (key === "constructor" && typeof object[key] === "function") {
            return;
          }
          if (key == "__proto__") {
            return;
          }
          return object[key];
        }
        var setData = shortOut(baseSetData);
        var setTimeout2 = ctxSetTimeout || function(func, wait) {
          return root.setTimeout(func, wait);
        };
        var setToString = shortOut(baseSetToString);
        function setWrapToString(wrapper2, reference, bitmask) {
          var source = reference + "";
          return setToString(wrapper2, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
        }
        function shortOut(func) {
          var count2 = 0, lastCalled = 0;
          return function() {
            var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
              if (++count2 >= HOT_COUNT) {
                return arguments[0];
              }
            } else {
              count2 = 0;
            }
            return func.apply(undefined$1, arguments);
          };
        }
        function shuffleSelf(array, size2) {
          var index2 = -1, length2 = array.length, lastIndex = length2 - 1;
          size2 = size2 === undefined$1 ? length2 : size2;
          while (++index2 < size2) {
            var rand = baseRandom(index2, lastIndex), value = array[rand];
            array[rand] = array[index2];
            array[index2] = value;
          }
          array.length = size2;
          return array;
        }
        var stringToPath = memoizeCapped(function(string) {
          var result2 = [];
          if (string.charCodeAt(0) === 46) {
            result2.push("");
          }
          string.replace(rePropName, function(match2, number, quote, subString) {
            result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match2);
          });
          return result2;
        });
        function toKey(value) {
          if (typeof value == "string" || isSymbol(value)) {
            return value;
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e2) {
            }
            try {
              return func + "";
            } catch (e2) {
            }
          }
          return "";
        }
        function updateWrapDetails(details, bitmask) {
          arrayEach(wrapFlags, function(pair) {
            var value = "_." + pair[0];
            if (bitmask & pair[1] && !arrayIncludes(details, value)) {
              details.push(value);
            }
          });
          return details.sort();
        }
        function wrapperClone(wrapper2) {
          if (wrapper2 instanceof LazyWrapper) {
            return wrapper2.clone();
          }
          var result2 = new LodashWrapper(wrapper2.__wrapped__, wrapper2.__chain__);
          result2.__actions__ = copyArray(wrapper2.__actions__);
          result2.__index__ = wrapper2.__index__;
          result2.__values__ = wrapper2.__values__;
          return result2;
        }
        function chunk(array, size2, guard) {
          if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined$1) {
            size2 = 1;
          } else {
            size2 = nativeMax(toInteger(size2), 0);
          }
          var length2 = array == null ? 0 : array.length;
          if (!length2 || size2 < 1) {
            return [];
          }
          var index2 = 0, resIndex = 0, result2 = Array2(nativeCeil(length2 / size2));
          while (index2 < length2) {
            result2[resIndex++] = baseSlice(array, index2, index2 += size2);
          }
          return result2;
        }
        function compact(array) {
          var index2 = -1, length2 = array == null ? 0 : array.length, resIndex = 0, result2 = [];
          while (++index2 < length2) {
            var value = array[index2];
            if (value) {
              result2[resIndex++] = value;
            }
          }
          return result2;
        }
        function concat() {
          var length2 = arguments.length;
          if (!length2) {
            return [];
          }
          var args = Array2(length2 - 1), array = arguments[0], index2 = length2;
          while (index2--) {
            args[index2 - 1] = arguments[index2];
          }
          return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
        }
        var difference = baseRest(function(array, values3) {
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values3, 1, isArrayLikeObject, true)) : [];
        });
        var differenceBy = baseRest(function(array, values3) {
          var iteratee2 = last(values3);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined$1;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values3, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
        });
        var differenceWith = baseRest(function(array, values3) {
          var comparator = last(values3);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined$1;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values3, 1, isArrayLikeObject, true), undefined$1, comparator) : [];
        });
        function drop5(array, n2, guard) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return [];
          }
          n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
          return baseSlice(array, n2 < 0 ? 0 : n2, length2);
        }
        function dropRight(array, n2, guard) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return [];
          }
          n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
          n2 = length2 - n2;
          return baseSlice(array, 0, n2 < 0 ? 0 : n2);
        }
        function dropRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
        }
        function dropWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
        }
        function fill(array, value, start, end2) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return [];
          }
          if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
            start = 0;
            end2 = length2;
          }
          return baseFill(array, value, start, end2);
        }
        function findIndex2(array, predicate, fromIndex) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return -1;
          }
          var index2 = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index2 < 0) {
            index2 = nativeMax(length2 + index2, 0);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index2);
        }
        function findLastIndex(array, predicate, fromIndex) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return -1;
          }
          var index2 = length2 - 1;
          if (fromIndex !== undefined$1) {
            index2 = toInteger(fromIndex);
            index2 = fromIndex < 0 ? nativeMax(length2 + index2, 0) : nativeMin(index2, length2 - 1);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index2, true);
        }
        function flatten(array) {
          var length2 = array == null ? 0 : array.length;
          return length2 ? baseFlatten(array, 1) : [];
        }
        function flattenDeep(array) {
          var length2 = array == null ? 0 : array.length;
          return length2 ? baseFlatten(array, INFINITY) : [];
        }
        function flattenDepth(array, depth) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return [];
          }
          depth = depth === undefined$1 ? 1 : toInteger(depth);
          return baseFlatten(array, depth);
        }
        function fromPairs(pairs) {
          var index2 = -1, length2 = pairs == null ? 0 : pairs.length, result2 = {};
          while (++index2 < length2) {
            var pair = pairs[index2];
            result2[pair[0]] = pair[1];
          }
          return result2;
        }
        function head(array) {
          return array && array.length ? array[0] : undefined$1;
        }
        function indexOf(array, value, fromIndex) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return -1;
          }
          var index2 = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index2 < 0) {
            index2 = nativeMax(length2 + index2, 0);
          }
          return baseIndexOf(array, value, index2);
        }
        function initial(array) {
          var length2 = array == null ? 0 : array.length;
          return length2 ? baseSlice(array, 0, -1) : [];
        }
        var intersection = baseRest(function(arrays) {
          var mapped = arrayMap(arrays, castArrayLikeObject);
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
        });
        var intersectionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          if (iteratee2 === last(mapped)) {
            iteratee2 = undefined$1;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
        });
        var intersectionWith = baseRest(function(arrays) {
          var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          comparator = typeof comparator == "function" ? comparator : undefined$1;
          if (comparator) {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined$1, comparator) : [];
        });
        function join(array, separator) {
          return array == null ? "" : nativeJoin.call(array, separator);
        }
        function last(array) {
          var length2 = array == null ? 0 : array.length;
          return length2 ? array[length2 - 1] : undefined$1;
        }
        function lastIndexOf(array, value, fromIndex) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return -1;
          }
          var index2 = length2;
          if (fromIndex !== undefined$1) {
            index2 = toInteger(fromIndex);
            index2 = index2 < 0 ? nativeMax(length2 + index2, 0) : nativeMin(index2, length2 - 1);
          }
          return value === value ? strictLastIndexOf(array, value, index2) : baseFindIndex(array, baseIsNaN, index2, true);
        }
        function nth(array, n2) {
          return array && array.length ? baseNth(array, toInteger(n2)) : undefined$1;
        }
        var pull = baseRest(pullAll);
        function pullAll(array, values3) {
          return array && array.length && values3 && values3.length ? basePullAll(array, values3) : array;
        }
        function pullAllBy(array, values3, iteratee2) {
          return array && array.length && values3 && values3.length ? basePullAll(array, values3, getIteratee(iteratee2, 2)) : array;
        }
        function pullAllWith(array, values3, comparator) {
          return array && array.length && values3 && values3.length ? basePullAll(array, values3, undefined$1, comparator) : array;
        }
        var pullAt = flatRest(function(array, indexes) {
          var length2 = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
          basePullAt(array, arrayMap(indexes, function(index2) {
            return isIndex(index2, length2) ? +index2 : index2;
          }).sort(compareAscending));
          return result2;
        });
        function remove(array, predicate) {
          var result2 = [];
          if (!(array && array.length)) {
            return result2;
          }
          var index2 = -1, indexes = [], length2 = array.length;
          predicate = getIteratee(predicate, 3);
          while (++index2 < length2) {
            var value = array[index2];
            if (predicate(value, index2, array)) {
              result2.push(value);
              indexes.push(index2);
            }
          }
          basePullAt(array, indexes);
          return result2;
        }
        function reverse(array) {
          return array == null ? array : nativeReverse.call(array);
        }
        function slice2(array, start, end2) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return [];
          }
          if (end2 && typeof end2 != "number" && isIterateeCall(array, start, end2)) {
            start = 0;
            end2 = length2;
          } else {
            start = start == null ? 0 : toInteger(start);
            end2 = end2 === undefined$1 ? length2 : toInteger(end2);
          }
          return baseSlice(array, start, end2);
        }
        function sortedIndex(array, value) {
          return baseSortedIndex(array, value);
        }
        function sortedIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
        }
        function sortedIndexOf(array, value) {
          var length2 = array == null ? 0 : array.length;
          if (length2) {
            var index2 = baseSortedIndex(array, value);
            if (index2 < length2 && eq(array[index2], value)) {
              return index2;
            }
          }
          return -1;
        }
        function sortedLastIndex(array, value) {
          return baseSortedIndex(array, value, true);
        }
        function sortedLastIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
        }
        function sortedLastIndexOf(array, value) {
          var length2 = array == null ? 0 : array.length;
          if (length2) {
            var index2 = baseSortedIndex(array, value, true) - 1;
            if (eq(array[index2], value)) {
              return index2;
            }
          }
          return -1;
        }
        function sortedUniq(array) {
          return array && array.length ? baseSortedUniq(array) : [];
        }
        function sortedUniqBy(array, iteratee2) {
          return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function tail(array) {
          var length2 = array == null ? 0 : array.length;
          return length2 ? baseSlice(array, 1, length2) : [];
        }
        function take(array, n2, guard) {
          if (!(array && array.length)) {
            return [];
          }
          n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
          return baseSlice(array, 0, n2 < 0 ? 0 : n2);
        }
        function takeRight(array, n2, guard) {
          var length2 = array == null ? 0 : array.length;
          if (!length2) {
            return [];
          }
          n2 = guard || n2 === undefined$1 ? 1 : toInteger(n2);
          n2 = length2 - n2;
          return baseSlice(array, n2 < 0 ? 0 : n2, length2);
        }
        function takeRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
        }
        function takeWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
        }
        var union = baseRest(function(arrays) {
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
        });
        var unionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined$1;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
        });
        var unionWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined$1;
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
        });
        function uniq(array) {
          return array && array.length ? baseUniq(array) : [];
        }
        function uniqBy(array, iteratee2) {
          return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function uniqWith(array, comparator) {
          comparator = typeof comparator == "function" ? comparator : undefined$1;
          return array && array.length ? baseUniq(array, undefined$1, comparator) : [];
        }
        function unzip(array) {
          if (!(array && array.length)) {
            return [];
          }
          var length2 = 0;
          array = arrayFilter(array, function(group) {
            if (isArrayLikeObject(group)) {
              length2 = nativeMax(group.length, length2);
              return true;
            }
          });
          return baseTimes(length2, function(index2) {
            return arrayMap(array, baseProperty(index2));
          });
        }
        function unzipWith(array, iteratee2) {
          if (!(array && array.length)) {
            return [];
          }
          var result2 = unzip(array);
          if (iteratee2 == null) {
            return result2;
          }
          return arrayMap(result2, function(group) {
            return apply3(iteratee2, undefined$1, group);
          });
        }
        var without = baseRest(function(array, values3) {
          return isArrayLikeObject(array) ? baseDifference(array, values3) : [];
        });
        var xor = baseRest(function(arrays) {
          return baseXor(arrayFilter(arrays, isArrayLikeObject));
        });
        var xorBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined$1;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
        });
        var xorWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined$1;
          return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
        });
        var zip = baseRest(unzip);
        function zipObject(props, values3) {
          return baseZipObject(props || [], values3 || [], assignValue);
        }
        function zipObjectDeep(props, values3) {
          return baseZipObject(props || [], values3 || [], baseSet);
        }
        var zipWith = baseRest(function(arrays) {
          var length2 = arrays.length, iteratee2 = length2 > 1 ? arrays[length2 - 1] : undefined$1;
          iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined$1;
          return unzipWith(arrays, iteratee2);
        });
        function chain(value) {
          var result2 = lodash2(value);
          result2.__chain__ = true;
          return result2;
        }
        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }
        function thru(value, interceptor) {
          return interceptor(value);
        }
        var wrapperAt = flatRest(function(paths) {
          var length2 = paths.length, start = length2 ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
            return baseAt(object, paths);
          };
          if (length2 > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
            return this.thru(interceptor);
          }
          value = value.slice(start, +start + (length2 ? 1 : 0));
          value.__actions__.push({
            "func": thru,
            "args": [interceptor],
            "thisArg": undefined$1
          });
          return new LodashWrapper(value, this.__chain__).thru(function(array) {
            if (length2 && !array.length) {
              array.push(undefined$1);
            }
            return array;
          });
        });
        function wrapperChain() {
          return chain(this);
        }
        function wrapperCommit() {
          return new LodashWrapper(this.value(), this.__chain__);
        }
        function wrapperNext() {
          if (this.__values__ === undefined$1) {
            this.__values__ = toArray2(this.value());
          }
          var done = this.__index__ >= this.__values__.length, value = done ? undefined$1 : this.__values__[this.__index__++];
          return { "done": done, "value": value };
        }
        function wrapperToIterator() {
          return this;
        }
        function wrapperPlant(value) {
          var result2, parent2 = this;
          while (parent2 instanceof baseLodash) {
            var clone2 = wrapperClone(parent2);
            clone2.__index__ = 0;
            clone2.__values__ = undefined$1;
            if (result2) {
              previous.__wrapped__ = clone2;
            } else {
              result2 = clone2;
            }
            var previous = clone2;
            parent2 = parent2.__wrapped__;
          }
          previous.__wrapped__ = value;
          return result2;
        }
        function wrapperReverse() {
          var value = this.__wrapped__;
          if (value instanceof LazyWrapper) {
            var wrapped = value;
            if (this.__actions__.length) {
              wrapped = new LazyWrapper(this);
            }
            wrapped = wrapped.reverse();
            wrapped.__actions__.push({
              "func": thru,
              "args": [reverse],
              "thisArg": undefined$1
            });
            return new LodashWrapper(wrapped, this.__chain__);
          }
          return this.thru(reverse);
        }
        function wrapperValue() {
          return baseWrapperValue(this.__wrapped__, this.__actions__);
        }
        var countBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            ++result2[key];
          } else {
            baseAssignValue(result2, key, 1);
          }
        });
        function every(collection, predicate, guard) {
          var func = isArray(collection) ? arrayEvery : baseEvery;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined$1;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        function filter(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, getIteratee(predicate, 3));
        }
        var find2 = createFind(findIndex2);
        var findLast = createFind(findLastIndex);
        function flatMap(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), 1);
        }
        function flatMapDeep(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), INFINITY);
        }
        function flatMapDepth(collection, iteratee2, depth) {
          depth = depth === undefined$1 ? 1 : toInteger(depth);
          return baseFlatten(map(collection, iteratee2), depth);
        }
        function forEach(collection, iteratee2) {
          var func = isArray(collection) ? arrayEach : baseEach;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function forEachRight(collection, iteratee2) {
          var func = isArray(collection) ? arrayEachRight : baseEachRight;
          return func(collection, getIteratee(iteratee2, 3));
        }
        var groupBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            result2[key].push(value);
          } else {
            baseAssignValue(result2, key, [value]);
          }
        });
        function includes(collection, value, fromIndex, guard) {
          collection = isArrayLike(collection) ? collection : values2(collection);
          fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
          var length2 = collection.length;
          if (fromIndex < 0) {
            fromIndex = nativeMax(length2 + fromIndex, 0);
          }
          return isString(collection) ? fromIndex <= length2 && collection.indexOf(value, fromIndex) > -1 : !!length2 && baseIndexOf(collection, value, fromIndex) > -1;
        }
        var invokeMap = baseRest(function(collection, path, args) {
          var index2 = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value) {
            result2[++index2] = isFunc ? apply3(path, value, args) : baseInvoke(value, path, args);
          });
          return result2;
        });
        var keyBy = createAggregator(function(result2, value, key) {
          baseAssignValue(result2, key, value);
        });
        function map(collection, iteratee2) {
          var func = isArray(collection) ? arrayMap : baseMap;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function orderBy(collection, iteratees, orders, guard) {
          if (collection == null) {
            return [];
          }
          if (!isArray(iteratees)) {
            iteratees = iteratees == null ? [] : [iteratees];
          }
          orders = guard ? undefined$1 : orders;
          if (!isArray(orders)) {
            orders = orders == null ? [] : [orders];
          }
          return baseOrderBy(collection, iteratees, orders);
        }
        var partition = createAggregator(function(result2, value, key) {
          result2[key ? 0 : 1].push(value);
        }, function() {
          return [[], []];
        });
        function reduce(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
        }
        function reduceRight(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
        }
        function reject(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, negate3(getIteratee(predicate, 3)));
        }
        function sample(collection) {
          var func = isArray(collection) ? arraySample : baseSample;
          return func(collection);
        }
        function sampleSize(collection, n2, guard) {
          if (guard ? isIterateeCall(collection, n2, guard) : n2 === undefined$1) {
            n2 = 1;
          } else {
            n2 = toInteger(n2);
          }
          var func = isArray(collection) ? arraySampleSize : baseSampleSize;
          return func(collection, n2);
        }
        function shuffle(collection) {
          var func = isArray(collection) ? arrayShuffle : baseShuffle;
          return func(collection);
        }
        function size(collection) {
          if (collection == null) {
            return 0;
          }
          if (isArrayLike(collection)) {
            return isString(collection) ? stringSize(collection) : collection.length;
          }
          var tag = getTag(collection);
          if (tag == mapTag || tag == setTag) {
            return collection.size;
          }
          return baseKeys(collection).length;
        }
        function some(collection, predicate, guard) {
          var func = isArray(collection) ? arraySome : baseSome;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined$1;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        var sortBy = baseRest(function(collection, iteratees) {
          if (collection == null) {
            return [];
          }
          var length2 = iteratees.length;
          if (length2 > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
            iteratees = [];
          } else if (length2 > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
            iteratees = [iteratees[0]];
          }
          return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
        });
        var now = ctxNow || function() {
          return root.Date.now();
        };
        function after(n2, func) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n2 = toInteger(n2);
          return function() {
            if (--n2 < 1) {
              return func.apply(this, arguments);
            }
          };
        }
        function ary(func, n2, guard) {
          n2 = guard ? undefined$1 : n2;
          n2 = func && n2 == null ? func.length : n2;
          return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n2);
        }
        function before(n2, func) {
          var result2;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n2 = toInteger(n2);
          return function() {
            if (--n2 > 0) {
              result2 = func.apply(this, arguments);
            }
            if (n2 <= 1) {
              func = undefined$1;
            }
            return result2;
          };
        }
        var bind = baseRest(function(func, thisArg, partials) {
          var bitmask = WRAP_BIND_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bind));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(func, bitmask, thisArg, partials, holders);
        });
        var bindKey = baseRest(function(object, key, partials) {
          var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bindKey));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(key, bitmask, object, partials, holders);
        });
        function curry(func, arity, guard) {
          arity = guard ? undefined$1 : arity;
          var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
          result2.placeholder = curry.placeholder;
          return result2;
        }
        function curryRight(func, arity, guard) {
          arity = guard ? undefined$1 : arity;
          var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
          result2.placeholder = curryRight.placeholder;
          return result2;
        }
        function debounce(func, wait, options) {
          var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          wait = toNumber(wait) || 0;
          if (isObject(options)) {
            leading = !!options.leading;
            maxing = "maxWait" in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = undefined$1;
            lastInvokeTime = time;
            result2 = func.apply(thisArg, args);
            return result2;
          }
          function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout2(timerExpired, wait);
            return leading ? invokeFunc(time) : result2;
          }
          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
            return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
          }
          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === undefined$1 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }
          function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
              return trailingEdge(time);
            }
            timerId = setTimeout2(timerExpired, remainingWait(time));
          }
          function trailingEdge(time) {
            timerId = undefined$1;
            if (trailing && lastArgs) {
              return invokeFunc(time);
            }
            lastArgs = lastThis = undefined$1;
            return result2;
          }
          function cancel() {
            if (timerId !== undefined$1) {
              clearTimeout2(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined$1;
          }
          function flush3() {
            return timerId === undefined$1 ? result2 : trailingEdge(now());
          }
          function debounced() {
            var time = now(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
              if (timerId === undefined$1) {
                return leadingEdge(lastCallTime);
              }
              if (maxing) {
                clearTimeout2(timerId);
                timerId = setTimeout2(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }
            if (timerId === undefined$1) {
              timerId = setTimeout2(timerExpired, wait);
            }
            return result2;
          }
          debounced.cancel = cancel;
          debounced.flush = flush3;
          return debounced;
        }
        var defer = baseRest(function(func, args) {
          return baseDelay(func, 1, args);
        });
        var delay = baseRest(function(func, wait, args) {
          return baseDelay(func, toNumber(wait) || 0, args);
        });
        function flip(func) {
          return createWrap(func, WRAP_FLIP_FLAG);
        }
        function memoize2(func, resolver) {
          if (typeof func != "function" || resolver != null && typeof resolver != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
            if (cache.has(key)) {
              return cache.get(key);
            }
            var result2 = func.apply(this, args);
            memoized.cache = cache.set(key, result2) || cache;
            return result2;
          };
          memoized.cache = new (memoize2.Cache || MapCache)();
          return memoized;
        }
        memoize2.Cache = MapCache;
        function negate3(predicate) {
          if (typeof predicate != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return !predicate.call(this);
              case 1:
                return !predicate.call(this, args[0]);
              case 2:
                return !predicate.call(this, args[0], args[1]);
              case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
            }
            return !predicate.apply(this, args);
          };
        }
        function once(func) {
          return before(2, func);
        }
        var overArgs = castRest(function(func, transforms2) {
          transforms2 = transforms2.length == 1 && isArray(transforms2[0]) ? arrayMap(transforms2[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms2, 1), baseUnary(getIteratee()));
          var funcsLength = transforms2.length;
          return baseRest(function(args) {
            var index2 = -1, length2 = nativeMin(args.length, funcsLength);
            while (++index2 < length2) {
              args[index2] = transforms2[index2].call(this, args[index2]);
            }
            return apply3(func, this, args);
          });
        });
        var partial = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partial));
          return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
        });
        var partialRight = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partialRight));
          return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
        });
        var rearg = flatRest(function(func, indexes) {
          return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
        });
        function rest(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start === undefined$1 ? start : toInteger(start);
          return baseRest(func, start);
        }
        function spread(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start == null ? 0 : nativeMax(toInteger(start), 0);
          return baseRest(function(args) {
            var array = args[start], otherArgs = castSlice(args, 0, start);
            if (array) {
              arrayPush(otherArgs, array);
            }
            return apply3(func, this, otherArgs);
          });
        }
        function throttle(func, wait, options) {
          var leading = true, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          if (isObject(options)) {
            leading = "leading" in options ? !!options.leading : leading;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          return debounce(func, wait, {
            "leading": leading,
            "maxWait": wait,
            "trailing": trailing
          });
        }
        function unary(func) {
          return ary(func, 1);
        }
        function wrap(value, wrapper2) {
          return partial(castFunction(wrapper2), value);
        }
        function castArray() {
          if (!arguments.length) {
            return [];
          }
          var value = arguments[0];
          return isArray(value) ? value : [value];
        }
        function clone(value) {
          return baseClone(value, CLONE_SYMBOLS_FLAG);
        }
        function cloneWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
        }
        function cloneDeep(value) {
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }
        function cloneDeepWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
        }
        function conformsTo(object, source) {
          return source == null || baseConformsTo(object, source, keys(source));
        }
        function eq(value, other) {
          return value === other || value !== value && other !== other;
        }
        var gt = createRelationalOperation(baseGt);
        var gte = createRelationalOperation(function(value, other) {
          return value >= other;
        });
        var isArguments = baseIsArguments(/* @__PURE__ */ function() {
          return arguments;
        }()) ? baseIsArguments : function(value) {
          return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
        };
        var isArray = Array2.isArray;
        var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction(value);
        }
        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }
        function isBoolean(value) {
          return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
        }
        var isBuffer = nativeIsBuffer || stubFalse;
        var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
        function isElement2(value) {
          return isObjectLike(value) && value.nodeType === 1 && !isPlainObject2(value);
        }
        function isEmpty(value) {
          if (value == null) {
            return true;
          }
          if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
            return !value.length;
          }
          var tag = getTag(value);
          if (tag == mapTag || tag == setTag) {
            return !value.size;
          }
          if (isPrototype(value)) {
            return !baseKeys(value).length;
          }
          for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
              return false;
            }
          }
          return true;
        }
        function isEqual4(value, other) {
          return baseIsEqual(value, other);
        }
        function isEqualWith(value, other, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          var result2 = customizer ? customizer(value, other) : undefined$1;
          return result2 === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result2;
        }
        function isError(value) {
          if (!isObjectLike(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject2(value);
        }
        function isFinite(value) {
          return typeof value == "number" && nativeIsFinite(value);
        }
        function isFunction(value) {
          if (!isObject(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }
        function isInteger(value) {
          return typeof value == "number" && value == toInteger(value);
        }
        function isLength(value) {
          return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        function isObject(value) {
          var type = typeof value;
          return value != null && (type == "object" || type == "function");
        }
        function isObjectLike(value) {
          return value != null && typeof value == "object";
        }
        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
        function isMatch(object, source) {
          return object === source || baseIsMatch(object, source, getMatchData(source));
        }
        function isMatchWith(object, source, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return baseIsMatch(object, source, getMatchData(source), customizer);
        }
        function isNaN2(value) {
          return isNumber(value) && value != +value;
        }
        function isNative(value) {
          if (isMaskable(value)) {
            throw new Error2(CORE_ERROR_TEXT);
          }
          return baseIsNative(value);
        }
        function isNull(value) {
          return value === null;
        }
        function isNil(value) {
          return value == null;
        }
        function isNumber(value) {
          return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
        }
        function isPlainObject2(value) {
          if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
            return false;
          }
          var proto = getPrototype(value);
          if (proto === null) {
            return true;
          }
          var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
          return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }
        var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
        function isSafeInteger(value) {
          return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
        }
        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
        function isString(value) {
          return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
        }
        function isSymbol(value) {
          return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
        }
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
        function isUndefined(value) {
          return value === undefined$1;
        }
        function isWeakMap(value) {
          return isObjectLike(value) && getTag(value) == weakMapTag;
        }
        function isWeakSet(value) {
          return isObjectLike(value) && baseGetTag(value) == weakSetTag;
        }
        var lt = createRelationalOperation(baseLt);
        var lte = createRelationalOperation(function(value, other) {
          return value <= other;
        });
        function toArray2(value) {
          if (!value) {
            return [];
          }
          if (isArrayLike(value)) {
            return isString(value) ? stringToArray(value) : copyArray(value);
          }
          if (symIterator && value[symIterator]) {
            return iteratorToArray(value[symIterator]());
          }
          var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values2;
          return func(value);
        }
        function toFinite(value) {
          if (!value) {
            return value === 0 ? value : 0;
          }
          value = toNumber(value);
          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }
          return value === value ? value : 0;
        }
        function toInteger(value) {
          var result2 = toFinite(value), remainder = result2 % 1;
          return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
        }
        function toLength(value) {
          return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
        }
        function toNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          if (isObject(value)) {
            var other = typeof value.valueOf == "function" ? value.valueOf() : value;
            value = isObject(other) ? other + "" : other;
          }
          if (typeof value != "string") {
            return value === 0 ? value : +value;
          }
          value = baseTrim(value);
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }
        function toPlainObject(value) {
          return copyObject(value, keysIn(value));
        }
        function toSafeInteger(value) {
          return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
        }
        function toString2(value) {
          return value == null ? "" : baseToString(value);
        }
        var assign2 = createAssigner(function(object, source) {
          if (isPrototype(source) || isArrayLike(source)) {
            copyObject(source, keys(source), object);
            return;
          }
          for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
              assignValue(object, key, source[key]);
            }
          }
        });
        var assignIn = createAssigner(function(object, source) {
          copyObject(source, keysIn(source), object);
        });
        var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keysIn(source), object, customizer);
        });
        var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keys(source), object, customizer);
        });
        var at = flatRest(baseAt);
        function create2(prototype, properties2) {
          var result2 = baseCreate(prototype);
          return properties2 == null ? result2 : baseAssign(result2, properties2);
        }
        var defaults2 = baseRest(function(object, sources) {
          object = Object2(object);
          var index2 = -1;
          var length2 = sources.length;
          var guard = length2 > 2 ? sources[2] : undefined$1;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            length2 = 1;
          }
          while (++index2 < length2) {
            var source = sources[index2];
            var props = keysIn(source);
            var propsIndex = -1;
            var propsLength = props.length;
            while (++propsIndex < propsLength) {
              var key = props[propsIndex];
              var value = object[key];
              if (value === undefined$1 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                object[key] = source[key];
              }
            }
          }
          return object;
        });
        var defaultsDeep = baseRest(function(args) {
          args.push(undefined$1, customDefaultsMerge);
          return apply3(mergeWith, undefined$1, args);
        });
        function findKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
        }
        function findLastKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
        }
        function forIn(object, iteratee2) {
          return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forInRight(object, iteratee2) {
          return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forOwn(object, iteratee2) {
          return object && baseForOwn(object, getIteratee(iteratee2, 3));
        }
        function forOwnRight(object, iteratee2) {
          return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
        }
        function functions(object) {
          return object == null ? [] : baseFunctions(object, keys(object));
        }
        function functionsIn(object) {
          return object == null ? [] : baseFunctions(object, keysIn(object));
        }
        function get2(object, path, defaultValue) {
          var result2 = object == null ? undefined$1 : baseGet(object, path);
          return result2 === undefined$1 ? defaultValue : result2;
        }
        function has(object, path) {
          return object != null && hasPath(object, path, baseHas);
        }
        function hasIn(object, path) {
          return object != null && hasPath(object, path, baseHasIn);
        }
        var invert = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          result2[value] = key;
        }, constant(identity));
        var invertBy = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          if (hasOwnProperty.call(result2, value)) {
            result2[value].push(key);
          } else {
            result2[value] = [key];
          }
        }, getIteratee);
        var invoke = baseRest(baseInvoke);
        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }
        function keysIn(object) {
          return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }
        function mapKeys(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, iteratee2(value, key, object2), value);
          });
          return result2;
        }
        function mapValues(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, key, iteratee2(value, key, object2));
          });
          return result2;
        }
        var merge2 = createAssigner(function(object, source, srcIndex) {
          baseMerge(object, source, srcIndex);
        });
        var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
          baseMerge(object, source, srcIndex, customizer);
        });
        var omit = flatRest(function(object, paths) {
          var result2 = {};
          if (object == null) {
            return result2;
          }
          var isDeep = false;
          paths = arrayMap(paths, function(path) {
            path = castPath(path, object);
            isDeep || (isDeep = path.length > 1);
            return path;
          });
          copyObject(object, getAllKeysIn(object), result2);
          if (isDeep) {
            result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
          }
          var length2 = paths.length;
          while (length2--) {
            baseUnset(result2, paths[length2]);
          }
          return result2;
        });
        function omitBy(object, predicate) {
          return pickBy(object, negate3(getIteratee(predicate)));
        }
        var pick = flatRest(function(object, paths) {
          return object == null ? {} : basePick(object, paths);
        });
        function pickBy(object, predicate) {
          if (object == null) {
            return {};
          }
          var props = arrayMap(getAllKeysIn(object), function(prop) {
            return [prop];
          });
          predicate = getIteratee(predicate);
          return basePickBy(object, props, function(value, path) {
            return predicate(value, path[0]);
          });
        }
        function result(object, path, defaultValue) {
          path = castPath(path, object);
          var index2 = -1, length2 = path.length;
          if (!length2) {
            length2 = 1;
            object = undefined$1;
          }
          while (++index2 < length2) {
            var value = object == null ? undefined$1 : object[toKey(path[index2])];
            if (value === undefined$1) {
              index2 = length2;
              value = defaultValue;
            }
            object = isFunction(value) ? value.call(object) : value;
          }
          return object;
        }
        function set(object, path, value) {
          return object == null ? object : baseSet(object, path, value);
        }
        function setWith(object, path, value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return object == null ? object : baseSet(object, path, value, customizer);
        }
        var toPairs = createToPairs(keys);
        var toPairsIn = createToPairs(keysIn);
        function transform(object, iteratee2, accumulator) {
          var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
          iteratee2 = getIteratee(iteratee2, 4);
          if (accumulator == null) {
            var Ctor = object && object.constructor;
            if (isArrLike) {
              accumulator = isArr ? new Ctor() : [];
            } else if (isObject(object)) {
              accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
            } else {
              accumulator = {};
            }
          }
          (isArrLike ? arrayEach : baseForOwn)(object, function(value, index2, object2) {
            return iteratee2(accumulator, value, index2, object2);
          });
          return accumulator;
        }
        function unset(object, path) {
          return object == null ? true : baseUnset(object, path);
        }
        function update2(object, path, updater) {
          return object == null ? object : baseUpdate(object, path, castFunction(updater));
        }
        function updateWith(object, path, updater, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined$1;
          return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
        }
        function values2(object) {
          return object == null ? [] : baseValues(object, keys(object));
        }
        function valuesIn(object) {
          return object == null ? [] : baseValues(object, keysIn(object));
        }
        function clamp2(number, lower, upper) {
          if (upper === undefined$1) {
            upper = lower;
            lower = undefined$1;
          }
          if (upper !== undefined$1) {
            upper = toNumber(upper);
            upper = upper === upper ? upper : 0;
          }
          if (lower !== undefined$1) {
            lower = toNumber(lower);
            lower = lower === lower ? lower : 0;
          }
          return baseClamp(toNumber(number), lower, upper);
        }
        function inRange(number, start, end2) {
          start = toFinite(start);
          if (end2 === undefined$1) {
            end2 = start;
            start = 0;
          } else {
            end2 = toFinite(end2);
          }
          number = toNumber(number);
          return baseInRange(number, start, end2);
        }
        function random(lower, upper, floating) {
          if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
            upper = floating = undefined$1;
          }
          if (floating === undefined$1) {
            if (typeof upper == "boolean") {
              floating = upper;
              upper = undefined$1;
            } else if (typeof lower == "boolean") {
              floating = lower;
              lower = undefined$1;
            }
          }
          if (lower === undefined$1 && upper === undefined$1) {
            lower = 0;
            upper = 1;
          } else {
            lower = toFinite(lower);
            if (upper === undefined$1) {
              upper = lower;
              lower = 0;
            } else {
              upper = toFinite(upper);
            }
          }
          if (lower > upper) {
            var temp = lower;
            lower = upper;
            upper = temp;
          }
          if (floating || lower % 1 || upper % 1) {
            var rand = nativeRandom();
            return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
          }
          return baseRandom(lower, upper);
        }
        var camelCase = createCompounder(function(result2, word, index2) {
          word = word.toLowerCase();
          return result2 + (index2 ? capitalize2(word) : word);
        });
        function capitalize2(string) {
          return upperFirst(toString2(string).toLowerCase());
        }
        function deburr(string) {
          string = toString2(string);
          return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
        }
        function endsWith(string, target, position3) {
          string = toString2(string);
          target = baseToString(target);
          var length2 = string.length;
          position3 = position3 === undefined$1 ? length2 : baseClamp(toInteger(position3), 0, length2);
          var end2 = position3;
          position3 -= target.length;
          return position3 >= 0 && string.slice(position3, end2) == target;
        }
        function escape2(string) {
          string = toString2(string);
          return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }
        function escapeRegExp(string) {
          string = toString2(string);
          return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
        }
        var kebabCase = createCompounder(function(result2, word, index2) {
          return result2 + (index2 ? "-" : "") + word.toLowerCase();
        });
        var lowerCase = createCompounder(function(result2, word, index2) {
          return result2 + (index2 ? " " : "") + word.toLowerCase();
        });
        var lowerFirst = createCaseFirst("toLowerCase");
        function pad(string, length2, chars) {
          string = toString2(string);
          length2 = toInteger(length2);
          var strLength = length2 ? stringSize(string) : 0;
          if (!length2 || strLength >= length2) {
            return string;
          }
          var mid = (length2 - strLength) / 2;
          return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
        }
        function padEnd(string, length2, chars) {
          string = toString2(string);
          length2 = toInteger(length2);
          var strLength = length2 ? stringSize(string) : 0;
          return length2 && strLength < length2 ? string + createPadding(length2 - strLength, chars) : string;
        }
        function padStart(string, length2, chars) {
          string = toString2(string);
          length2 = toInteger(length2);
          var strLength = length2 ? stringSize(string) : 0;
          return length2 && strLength < length2 ? createPadding(length2 - strLength, chars) + string : string;
        }
        function parseInt2(string, radix, guard) {
          if (guard || radix == null) {
            radix = 0;
          } else if (radix) {
            radix = +radix;
          }
          return nativeParseInt(toString2(string).replace(reTrimStart, ""), radix || 0);
        }
        function repeat(string, n2, guard) {
          if (guard ? isIterateeCall(string, n2, guard) : n2 === undefined$1) {
            n2 = 1;
          } else {
            n2 = toInteger(n2);
          }
          return baseRepeat(toString2(string), n2);
        }
        function replace2() {
          var args = arguments, string = toString2(args[0]);
          return args.length < 3 ? string : string.replace(args[1], args[2]);
        }
        var snakeCase = createCompounder(function(result2, word, index2) {
          return result2 + (index2 ? "_" : "") + word.toLowerCase();
        });
        function split(string, separator, limit) {
          if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
            separator = limit = undefined$1;
          }
          limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
          if (!limit) {
            return [];
          }
          string = toString2(string);
          if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
            separator = baseToString(separator);
            if (!separator && hasUnicode(string)) {
              return castSlice(stringToArray(string), 0, limit);
            }
          }
          return string.split(separator, limit);
        }
        var startCase = createCompounder(function(result2, word, index2) {
          return result2 + (index2 ? " " : "") + upperFirst(word);
        });
        function startsWith(string, target, position3) {
          string = toString2(string);
          position3 = position3 == null ? 0 : baseClamp(toInteger(position3), 0, string.length);
          target = baseToString(target);
          return string.slice(position3, position3 + target.length) == target;
        }
        function template(string, options, guard) {
          var settings = lodash2.templateSettings;
          if (guard && isIterateeCall(string, options, guard)) {
            options = undefined$1;
          }
          string = toString2(string);
          options = assignInWith({}, options, settings, customDefaultsAssignIn);
          var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
          var isEscaping, isEvaluating, index2 = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
          var reDelimiters = RegExp2(
            (options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$",
            "g"
          );
          var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
          string.replace(reDelimiters, function(match2, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset3) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index2, offset3).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              isEscaping = true;
              source += "' +\n__e(" + escapeValue + ") +\n'";
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += "';\n" + evaluateValue + ";\n__p += '";
            }
            if (interpolateValue) {
              source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
            }
            index2 = offset3 + match2.length;
            return match2;
          });
          source += "';\n";
          var variable = hasOwnProperty.call(options, "variable") && options.variable;
          if (!variable) {
            source = "with (obj) {\n" + source + "\n}\n";
          } else if (reForbiddenIdentifierChars.test(variable)) {
            throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
          source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
          var result2 = attempt(function() {
            return Function2(importsKeys, sourceURL + "return " + source).apply(undefined$1, importsValues);
          });
          result2.source = source;
          if (isError(result2)) {
            throw result2;
          }
          return result2;
        }
        function toLower(value) {
          return toString2(value).toLowerCase();
        }
        function toUpper(value) {
          return toString2(value).toUpperCase();
        }
        function trim2(string, chars, guard) {
          string = toString2(string);
          if (string && (guard || chars === undefined$1)) {
            return baseTrim(string);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end2 = charsEndIndex(strSymbols, chrSymbols) + 1;
          return castSlice(strSymbols, start, end2).join("");
        }
        function trimEnd(string, chars, guard) {
          string = toString2(string);
          if (string && (guard || chars === undefined$1)) {
            return string.slice(0, trimmedEndIndex(string) + 1);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), end2 = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
          return castSlice(strSymbols, 0, end2).join("");
        }
        function trimStart(string, chars, guard) {
          string = toString2(string);
          if (string && (guard || chars === undefined$1)) {
            return string.replace(reTrimStart, "");
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
          return castSlice(strSymbols, start).join("");
        }
        function truncate(string, options) {
          var length2 = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
          if (isObject(options)) {
            var separator = "separator" in options ? options.separator : separator;
            length2 = "length" in options ? toInteger(options.length) : length2;
            omission = "omission" in options ? baseToString(options.omission) : omission;
          }
          string = toString2(string);
          var strLength = string.length;
          if (hasUnicode(string)) {
            var strSymbols = stringToArray(string);
            strLength = strSymbols.length;
          }
          if (length2 >= strLength) {
            return string;
          }
          var end2 = length2 - stringSize(omission);
          if (end2 < 1) {
            return omission;
          }
          var result2 = strSymbols ? castSlice(strSymbols, 0, end2).join("") : string.slice(0, end2);
          if (separator === undefined$1) {
            return result2 + omission;
          }
          if (strSymbols) {
            end2 += result2.length - end2;
          }
          if (isRegExp(separator)) {
            if (string.slice(end2).search(separator)) {
              var match2, substring = result2;
              if (!separator.global) {
                separator = RegExp2(separator.source, toString2(reFlags.exec(separator)) + "g");
              }
              separator.lastIndex = 0;
              while (match2 = separator.exec(substring)) {
                var newEnd = match2.index;
              }
              result2 = result2.slice(0, newEnd === undefined$1 ? end2 : newEnd);
            }
          } else if (string.indexOf(baseToString(separator), end2) != end2) {
            var index2 = result2.lastIndexOf(separator);
            if (index2 > -1) {
              result2 = result2.slice(0, index2);
            }
          }
          return result2 + omission;
        }
        function unescape(string) {
          string = toString2(string);
          return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }
        var upperCase = createCompounder(function(result2, word, index2) {
          return result2 + (index2 ? " " : "") + word.toUpperCase();
        });
        var upperFirst = createCaseFirst("toUpperCase");
        function words(string, pattern, guard) {
          string = toString2(string);
          pattern = guard ? undefined$1 : pattern;
          if (pattern === undefined$1) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
          }
          return string.match(pattern) || [];
        }
        var attempt = baseRest(function(func, args) {
          try {
            return apply3(func, undefined$1, args);
          } catch (e2) {
            return isError(e2) ? e2 : new Error2(e2);
          }
        });
        var bindAll = flatRest(function(object, methodNames) {
          arrayEach(methodNames, function(key) {
            key = toKey(key);
            baseAssignValue(object, key, bind(object[key], object));
          });
          return object;
        });
        function cond(pairs) {
          var length2 = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
          pairs = !length2 ? [] : arrayMap(pairs, function(pair) {
            if (typeof pair[1] != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return [toIteratee(pair[0]), pair[1]];
          });
          return baseRest(function(args) {
            var index2 = -1;
            while (++index2 < length2) {
              var pair = pairs[index2];
              if (apply3(pair[0], this, args)) {
                return apply3(pair[1], this, args);
              }
            }
          });
        }
        function conforms(source) {
          return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
        }
        function constant(value) {
          return function() {
            return value;
          };
        }
        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }
        var flow = createFlow();
        var flowRight = createFlow(true);
        function identity(value) {
          return value;
        }
        function iteratee(func) {
          return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
        }
        function matches(source) {
          return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
        }
        function matchesProperty(path, srcValue) {
          return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
        }
        var method = baseRest(function(path, args) {
          return function(object) {
            return baseInvoke(object, path, args);
          };
        });
        var methodOf = baseRest(function(object, args) {
          return function(path) {
            return baseInvoke(object, path, args);
          };
        });
        function mixin(object, source, options) {
          var props = keys(source), methodNames = baseFunctions(source, props);
          if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
          }
          var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
          arrayEach(methodNames, function(methodName) {
            var func = source[methodName];
            object[methodName] = func;
            if (isFunc) {
              object.prototype[methodName] = function() {
                var chainAll = this.__chain__;
                if (chain2 || chainAll) {
                  var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                  actions.push({ "func": func, "args": arguments, "thisArg": object });
                  result2.__chain__ = chainAll;
                  return result2;
                }
                return func.apply(object, arrayPush([this.value()], arguments));
              };
            }
          });
          return object;
        }
        function noConflict() {
          if (root._ === this) {
            root._ = oldDash;
          }
          return this;
        }
        function noop2() {
        }
        function nthArg(n2) {
          n2 = toInteger(n2);
          return baseRest(function(args) {
            return baseNth(args, n2);
          });
        }
        var over = createOver(arrayMap);
        var overEvery = createOver(arrayEvery);
        var overSome = createOver(arraySome);
        function property(path) {
          return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }
        function propertyOf(object) {
          return function(path) {
            return object == null ? undefined$1 : baseGet(object, path);
          };
        }
        var range = createRange();
        var rangeRight = createRange(true);
        function stubArray() {
          return [];
        }
        function stubFalse() {
          return false;
        }
        function stubObject() {
          return {};
        }
        function stubString() {
          return "";
        }
        function stubTrue() {
          return true;
        }
        function times(n2, iteratee2) {
          n2 = toInteger(n2);
          if (n2 < 1 || n2 > MAX_SAFE_INTEGER) {
            return [];
          }
          var index2 = MAX_ARRAY_LENGTH, length2 = nativeMin(n2, MAX_ARRAY_LENGTH);
          iteratee2 = getIteratee(iteratee2);
          n2 -= MAX_ARRAY_LENGTH;
          var result2 = baseTimes(length2, iteratee2);
          while (++index2 < n2) {
            iteratee2(index2);
          }
          return result2;
        }
        function toPath(value) {
          if (isArray(value)) {
            return arrayMap(value, toKey);
          }
          return isSymbol(value) ? [value] : copyArray(stringToPath(toString2(value)));
        }
        function uniqueId(prefix2) {
          var id = ++idCounter;
          return toString2(prefix2) + id;
        }
        var add3 = createMathOperation(function(augend, addend) {
          return augend + addend;
        }, 0);
        var ceil = createRound("ceil");
        var divide = createMathOperation(function(dividend, divisor) {
          return dividend / divisor;
        }, 1);
        var floor = createRound("floor");
        function max(array) {
          return array && array.length ? baseExtremum(array, identity, baseGt) : undefined$1;
        }
        function maxBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined$1;
        }
        function mean(array) {
          return baseMean(array, identity);
        }
        function meanBy(array, iteratee2) {
          return baseMean(array, getIteratee(iteratee2, 2));
        }
        function min(array) {
          return array && array.length ? baseExtremum(array, identity, baseLt) : undefined$1;
        }
        function minBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined$1;
        }
        var multiply = createMathOperation(function(multiplier, multiplicand) {
          return multiplier * multiplicand;
        }, 1);
        var round2 = createRound("round");
        var subtract3 = createMathOperation(function(minuend, subtrahend) {
          return minuend - subtrahend;
        }, 0);
        function sum(array) {
          return array && array.length ? baseSum(array, identity) : 0;
        }
        function sumBy(array, iteratee2) {
          return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
        }
        lodash2.after = after;
        lodash2.ary = ary;
        lodash2.assign = assign2;
        lodash2.assignIn = assignIn;
        lodash2.assignInWith = assignInWith;
        lodash2.assignWith = assignWith;
        lodash2.at = at;
        lodash2.before = before;
        lodash2.bind = bind;
        lodash2.bindAll = bindAll;
        lodash2.bindKey = bindKey;
        lodash2.castArray = castArray;
        lodash2.chain = chain;
        lodash2.chunk = chunk;
        lodash2.compact = compact;
        lodash2.concat = concat;
        lodash2.cond = cond;
        lodash2.conforms = conforms;
        lodash2.constant = constant;
        lodash2.countBy = countBy;
        lodash2.create = create2;
        lodash2.curry = curry;
        lodash2.curryRight = curryRight;
        lodash2.debounce = debounce;
        lodash2.defaults = defaults2;
        lodash2.defaultsDeep = defaultsDeep;
        lodash2.defer = defer;
        lodash2.delay = delay;
        lodash2.difference = difference;
        lodash2.differenceBy = differenceBy;
        lodash2.differenceWith = differenceWith;
        lodash2.drop = drop5;
        lodash2.dropRight = dropRight;
        lodash2.dropRightWhile = dropRightWhile;
        lodash2.dropWhile = dropWhile;
        lodash2.fill = fill;
        lodash2.filter = filter;
        lodash2.flatMap = flatMap;
        lodash2.flatMapDeep = flatMapDeep;
        lodash2.flatMapDepth = flatMapDepth;
        lodash2.flatten = flatten;
        lodash2.flattenDeep = flattenDeep;
        lodash2.flattenDepth = flattenDepth;
        lodash2.flip = flip;
        lodash2.flow = flow;
        lodash2.flowRight = flowRight;
        lodash2.fromPairs = fromPairs;
        lodash2.functions = functions;
        lodash2.functionsIn = functionsIn;
        lodash2.groupBy = groupBy;
        lodash2.initial = initial;
        lodash2.intersection = intersection;
        lodash2.intersectionBy = intersectionBy;
        lodash2.intersectionWith = intersectionWith;
        lodash2.invert = invert;
        lodash2.invertBy = invertBy;
        lodash2.invokeMap = invokeMap;
        lodash2.iteratee = iteratee;
        lodash2.keyBy = keyBy;
        lodash2.keys = keys;
        lodash2.keysIn = keysIn;
        lodash2.map = map;
        lodash2.mapKeys = mapKeys;
        lodash2.mapValues = mapValues;
        lodash2.matches = matches;
        lodash2.matchesProperty = matchesProperty;
        lodash2.memoize = memoize2;
        lodash2.merge = merge2;
        lodash2.mergeWith = mergeWith;
        lodash2.method = method;
        lodash2.methodOf = methodOf;
        lodash2.mixin = mixin;
        lodash2.negate = negate3;
        lodash2.nthArg = nthArg;
        lodash2.omit = omit;
        lodash2.omitBy = omitBy;
        lodash2.once = once;
        lodash2.orderBy = orderBy;
        lodash2.over = over;
        lodash2.overArgs = overArgs;
        lodash2.overEvery = overEvery;
        lodash2.overSome = overSome;
        lodash2.partial = partial;
        lodash2.partialRight = partialRight;
        lodash2.partition = partition;
        lodash2.pick = pick;
        lodash2.pickBy = pickBy;
        lodash2.property = property;
        lodash2.propertyOf = propertyOf;
        lodash2.pull = pull;
        lodash2.pullAll = pullAll;
        lodash2.pullAllBy = pullAllBy;
        lodash2.pullAllWith = pullAllWith;
        lodash2.pullAt = pullAt;
        lodash2.range = range;
        lodash2.rangeRight = rangeRight;
        lodash2.rearg = rearg;
        lodash2.reject = reject;
        lodash2.remove = remove;
        lodash2.rest = rest;
        lodash2.reverse = reverse;
        lodash2.sampleSize = sampleSize;
        lodash2.set = set;
        lodash2.setWith = setWith;
        lodash2.shuffle = shuffle;
        lodash2.slice = slice2;
        lodash2.sortBy = sortBy;
        lodash2.sortedUniq = sortedUniq;
        lodash2.sortedUniqBy = sortedUniqBy;
        lodash2.split = split;
        lodash2.spread = spread;
        lodash2.tail = tail;
        lodash2.take = take;
        lodash2.takeRight = takeRight;
        lodash2.takeRightWhile = takeRightWhile;
        lodash2.takeWhile = takeWhile;
        lodash2.tap = tap;
        lodash2.throttle = throttle;
        lodash2.thru = thru;
        lodash2.toArray = toArray2;
        lodash2.toPairs = toPairs;
        lodash2.toPairsIn = toPairsIn;
        lodash2.toPath = toPath;
        lodash2.toPlainObject = toPlainObject;
        lodash2.transform = transform;
        lodash2.unary = unary;
        lodash2.union = union;
        lodash2.unionBy = unionBy;
        lodash2.unionWith = unionWith;
        lodash2.uniq = uniq;
        lodash2.uniqBy = uniqBy;
        lodash2.uniqWith = uniqWith;
        lodash2.unset = unset;
        lodash2.unzip = unzip;
        lodash2.unzipWith = unzipWith;
        lodash2.update = update2;
        lodash2.updateWith = updateWith;
        lodash2.values = values2;
        lodash2.valuesIn = valuesIn;
        lodash2.without = without;
        lodash2.words = words;
        lodash2.wrap = wrap;
        lodash2.xor = xor;
        lodash2.xorBy = xorBy;
        lodash2.xorWith = xorWith;
        lodash2.zip = zip;
        lodash2.zipObject = zipObject;
        lodash2.zipObjectDeep = zipObjectDeep;
        lodash2.zipWith = zipWith;
        lodash2.entries = toPairs;
        lodash2.entriesIn = toPairsIn;
        lodash2.extend = assignIn;
        lodash2.extendWith = assignInWith;
        mixin(lodash2, lodash2);
        lodash2.add = add3;
        lodash2.attempt = attempt;
        lodash2.camelCase = camelCase;
        lodash2.capitalize = capitalize2;
        lodash2.ceil = ceil;
        lodash2.clamp = clamp2;
        lodash2.clone = clone;
        lodash2.cloneDeep = cloneDeep;
        lodash2.cloneDeepWith = cloneDeepWith;
        lodash2.cloneWith = cloneWith;
        lodash2.conformsTo = conformsTo;
        lodash2.deburr = deburr;
        lodash2.defaultTo = defaultTo;
        lodash2.divide = divide;
        lodash2.endsWith = endsWith;
        lodash2.eq = eq;
        lodash2.escape = escape2;
        lodash2.escapeRegExp = escapeRegExp;
        lodash2.every = every;
        lodash2.find = find2;
        lodash2.findIndex = findIndex2;
        lodash2.findKey = findKey;
        lodash2.findLast = findLast;
        lodash2.findLastIndex = findLastIndex;
        lodash2.findLastKey = findLastKey;
        lodash2.floor = floor;
        lodash2.forEach = forEach;
        lodash2.forEachRight = forEachRight;
        lodash2.forIn = forIn;
        lodash2.forInRight = forInRight;
        lodash2.forOwn = forOwn;
        lodash2.forOwnRight = forOwnRight;
        lodash2.get = get2;
        lodash2.gt = gt;
        lodash2.gte = gte;
        lodash2.has = has;
        lodash2.hasIn = hasIn;
        lodash2.head = head;
        lodash2.identity = identity;
        lodash2.includes = includes;
        lodash2.indexOf = indexOf;
        lodash2.inRange = inRange;
        lodash2.invoke = invoke;
        lodash2.isArguments = isArguments;
        lodash2.isArray = isArray;
        lodash2.isArrayBuffer = isArrayBuffer;
        lodash2.isArrayLike = isArrayLike;
        lodash2.isArrayLikeObject = isArrayLikeObject;
        lodash2.isBoolean = isBoolean;
        lodash2.isBuffer = isBuffer;
        lodash2.isDate = isDate;
        lodash2.isElement = isElement2;
        lodash2.isEmpty = isEmpty;
        lodash2.isEqual = isEqual4;
        lodash2.isEqualWith = isEqualWith;
        lodash2.isError = isError;
        lodash2.isFinite = isFinite;
        lodash2.isFunction = isFunction;
        lodash2.isInteger = isInteger;
        lodash2.isLength = isLength;
        lodash2.isMap = isMap;
        lodash2.isMatch = isMatch;
        lodash2.isMatchWith = isMatchWith;
        lodash2.isNaN = isNaN2;
        lodash2.isNative = isNative;
        lodash2.isNil = isNil;
        lodash2.isNull = isNull;
        lodash2.isNumber = isNumber;
        lodash2.isObject = isObject;
        lodash2.isObjectLike = isObjectLike;
        lodash2.isPlainObject = isPlainObject2;
        lodash2.isRegExp = isRegExp;
        lodash2.isSafeInteger = isSafeInteger;
        lodash2.isSet = isSet;
        lodash2.isString = isString;
        lodash2.isSymbol = isSymbol;
        lodash2.isTypedArray = isTypedArray;
        lodash2.isUndefined = isUndefined;
        lodash2.isWeakMap = isWeakMap;
        lodash2.isWeakSet = isWeakSet;
        lodash2.join = join;
        lodash2.kebabCase = kebabCase;
        lodash2.last = last;
        lodash2.lastIndexOf = lastIndexOf;
        lodash2.lowerCase = lowerCase;
        lodash2.lowerFirst = lowerFirst;
        lodash2.lt = lt;
        lodash2.lte = lte;
        lodash2.max = max;
        lodash2.maxBy = maxBy;
        lodash2.mean = mean;
        lodash2.meanBy = meanBy;
        lodash2.min = min;
        lodash2.minBy = minBy;
        lodash2.stubArray = stubArray;
        lodash2.stubFalse = stubFalse;
        lodash2.stubObject = stubObject;
        lodash2.stubString = stubString;
        lodash2.stubTrue = stubTrue;
        lodash2.multiply = multiply;
        lodash2.nth = nth;
        lodash2.noConflict = noConflict;
        lodash2.noop = noop2;
        lodash2.now = now;
        lodash2.pad = pad;
        lodash2.padEnd = padEnd;
        lodash2.padStart = padStart;
        lodash2.parseInt = parseInt2;
        lodash2.random = random;
        lodash2.reduce = reduce;
        lodash2.reduceRight = reduceRight;
        lodash2.repeat = repeat;
        lodash2.replace = replace2;
        lodash2.result = result;
        lodash2.round = round2;
        lodash2.runInContext = runInContext2;
        lodash2.sample = sample;
        lodash2.size = size;
        lodash2.snakeCase = snakeCase;
        lodash2.some = some;
        lodash2.sortedIndex = sortedIndex;
        lodash2.sortedIndexBy = sortedIndexBy;
        lodash2.sortedIndexOf = sortedIndexOf;
        lodash2.sortedLastIndex = sortedLastIndex;
        lodash2.sortedLastIndexBy = sortedLastIndexBy;
        lodash2.sortedLastIndexOf = sortedLastIndexOf;
        lodash2.startCase = startCase;
        lodash2.startsWith = startsWith;
        lodash2.subtract = subtract3;
        lodash2.sum = sum;
        lodash2.sumBy = sumBy;
        lodash2.template = template;
        lodash2.times = times;
        lodash2.toFinite = toFinite;
        lodash2.toInteger = toInteger;
        lodash2.toLength = toLength;
        lodash2.toLower = toLower;
        lodash2.toNumber = toNumber;
        lodash2.toSafeInteger = toSafeInteger;
        lodash2.toString = toString2;
        lodash2.toUpper = toUpper;
        lodash2.trim = trim2;
        lodash2.trimEnd = trimEnd;
        lodash2.trimStart = trimStart;
        lodash2.truncate = truncate;
        lodash2.unescape = unescape;
        lodash2.uniqueId = uniqueId;
        lodash2.upperCase = upperCase;
        lodash2.upperFirst = upperFirst;
        lodash2.each = forEach;
        lodash2.eachRight = forEachRight;
        lodash2.first = head;
        mixin(lodash2, function() {
          var source = {};
          baseForOwn(lodash2, function(func, methodName) {
            if (!hasOwnProperty.call(lodash2.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        }(), { "chain": false });
        lodash2.VERSION = VERSION;
        arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
          lodash2[methodName].placeholder = lodash2;
        });
        arrayEach(["drop", "take"], function(methodName, index2) {
          LazyWrapper.prototype[methodName] = function(n2) {
            n2 = n2 === undefined$1 ? 1 : nativeMax(toInteger(n2), 0);
            var result2 = this.__filtered__ && !index2 ? new LazyWrapper(this) : this.clone();
            if (result2.__filtered__) {
              result2.__takeCount__ = nativeMin(n2, result2.__takeCount__);
            } else {
              result2.__views__.push({
                "size": nativeMin(n2, MAX_ARRAY_LENGTH),
                "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
              });
            }
            return result2;
          };
          LazyWrapper.prototype[methodName + "Right"] = function(n2) {
            return this.reverse()[methodName](n2).reverse();
          };
        });
        arrayEach(["filter", "map", "takeWhile"], function(methodName, index2) {
          var type = index2 + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
          LazyWrapper.prototype[methodName] = function(iteratee2) {
            var result2 = this.clone();
            result2.__iteratees__.push({
              "iteratee": getIteratee(iteratee2, 3),
              "type": type
            });
            result2.__filtered__ = result2.__filtered__ || isFilter;
            return result2;
          };
        });
        arrayEach(["head", "last"], function(methodName, index2) {
          var takeName = "take" + (index2 ? "Right" : "");
          LazyWrapper.prototype[methodName] = function() {
            return this[takeName](1).value()[0];
          };
        });
        arrayEach(["initial", "tail"], function(methodName, index2) {
          var dropName = "drop" + (index2 ? "" : "Right");
          LazyWrapper.prototype[methodName] = function() {
            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
          };
        });
        LazyWrapper.prototype.compact = function() {
          return this.filter(identity);
        };
        LazyWrapper.prototype.find = function(predicate) {
          return this.filter(predicate).head();
        };
        LazyWrapper.prototype.findLast = function(predicate) {
          return this.reverse().find(predicate);
        };
        LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
          if (typeof path == "function") {
            return new LazyWrapper(this);
          }
          return this.map(function(value) {
            return baseInvoke(value, path, args);
          });
        });
        LazyWrapper.prototype.reject = function(predicate) {
          return this.filter(negate3(getIteratee(predicate)));
        };
        LazyWrapper.prototype.slice = function(start, end2) {
          start = toInteger(start);
          var result2 = this;
          if (result2.__filtered__ && (start > 0 || end2 < 0)) {
            return new LazyWrapper(result2);
          }
          if (start < 0) {
            result2 = result2.takeRight(-start);
          } else if (start) {
            result2 = result2.drop(start);
          }
          if (end2 !== undefined$1) {
            end2 = toInteger(end2);
            result2 = end2 < 0 ? result2.dropRight(-end2) : result2.take(end2 - start);
          }
          return result2;
        };
        LazyWrapper.prototype.takeRightWhile = function(predicate) {
          return this.reverse().takeWhile(predicate).reverse();
        };
        LazyWrapper.prototype.toArray = function() {
          return this.take(MAX_ARRAY_LENGTH);
        };
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash2[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
          if (!lodashFunc) {
            return;
          }
          lodash2.prototype[methodName] = function() {
            var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
            var interceptor = function(value2) {
              var result3 = lodashFunc.apply(lodash2, arrayPush([value2], args));
              return isTaker && chainAll ? result3[0] : result3;
            };
            if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
              isLazy = useLazy = false;
            }
            var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
            if (!retUnwrapped && useLazy) {
              value = onlyLazy ? value : new LazyWrapper(this);
              var result2 = func.apply(value, args);
              result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined$1 });
              return new LodashWrapper(result2, chainAll);
            }
            if (isUnwrapped && onlyLazy) {
              return func.apply(this, args);
            }
            result2 = this.thru(interceptor);
            return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
          };
        });
        arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
          var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
          lodash2.prototype[methodName] = function() {
            var args = arguments;
            if (retUnwrapped && !this.__chain__) {
              var value = this.value();
              return func.apply(isArray(value) ? value : [], args);
            }
            return this[chainName](function(value2) {
              return func.apply(isArray(value2) ? value2 : [], args);
            });
          };
        });
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var lodashFunc = lodash2[methodName];
          if (lodashFunc) {
            var key = lodashFunc.name + "";
            if (!hasOwnProperty.call(realNames, key)) {
              realNames[key] = [];
            }
            realNames[key].push({ "name": methodName, "func": lodashFunc });
          }
        });
        realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
          "name": "wrapper",
          "func": undefined$1
        }];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash2.prototype.at = wrapperAt;
        lodash2.prototype.chain = wrapperChain;
        lodash2.prototype.commit = wrapperCommit;
        lodash2.prototype.next = wrapperNext;
        lodash2.prototype.plant = wrapperPlant;
        lodash2.prototype.reverse = wrapperReverse;
        lodash2.prototype.toJSON = lodash2.prototype.valueOf = lodash2.prototype.value = wrapperValue;
        lodash2.prototype.first = lodash2.prototype.head;
        if (symIterator) {
          lodash2.prototype[symIterator] = wrapperToIterator;
        }
        return lodash2;
      };
      var _2 = runInContext();
      if (freeModule) {
        (freeModule.exports = _2)._ = _2;
        freeExports._ = _2;
      } else {
        root._ = _2;
      }
    }).call(commonjsGlobal);
  })(lodash, lodash.exports);
  var lodashExports = lodash.exports;
  const _ = /* @__PURE__ */ getDefaultExportFromCjs(lodashExports);
  const RESET = Symbol(
    ""
  );
  const isPromiseLike = (x) => typeof (x == null ? void 0 : x.then) === "function";
  function createJSONStorage(getStringStorage = () => {
    try {
      return window.localStorage;
    } catch (e2) {
      return void 0;
    }
  }, options) {
    var _a;
    let lastStr;
    let lastValue;
    const storage = {
      getItem: (key, initialValue) => {
        var _a2, _b;
        const parse3 = (str2) => {
          str2 = str2 || "";
          if (lastStr !== str2) {
            try {
              lastValue = JSON.parse(str2, options == null ? void 0 : options.reviver);
            } catch (e2) {
              return initialValue;
            }
            lastStr = str2;
          }
          return lastValue;
        };
        const str = (_b = (_a2 = getStringStorage()) == null ? void 0 : _a2.getItem(key)) != null ? _b : null;
        if (isPromiseLike(str)) {
          return str.then(parse3);
        }
        return parse3(str);
      },
      setItem: (key, newValue) => {
        var _a2;
        return (_a2 = getStringStorage()) == null ? void 0 : _a2.setItem(
          key,
          JSON.stringify(newValue, void 0)
        );
      },
      removeItem: (key) => {
        var _a2;
        return (_a2 = getStringStorage()) == null ? void 0 : _a2.removeItem(key);
      }
    };
    const createHandleSubscribe = (subscriber2) => (key, callback, initialValue) => subscriber2(key, (v2) => {
      let newValue;
      try {
        newValue = JSON.parse(v2 || "");
      } catch (e2) {
        newValue = initialValue;
      }
      callback(newValue);
    });
    let subscriber;
    try {
      subscriber = (_a = getStringStorage()) == null ? void 0 : _a.subscribe;
    } catch (e2) {
    }
    if (!subscriber && typeof window !== "undefined" && typeof window.addEventListener === "function" && window.Storage) {
      subscriber = (key, callback) => {
        if (!(getStringStorage() instanceof window.Storage)) {
          return () => {
          };
        }
        const storageEventCallback = (e2) => {
          if (e2.storageArea === getStringStorage() && e2.key === key) {
            callback(e2.newValue);
          }
        };
        window.addEventListener("storage", storageEventCallback);
        return () => {
          window.removeEventListener("storage", storageEventCallback);
        };
      };
    }
    if (subscriber) {
      storage.subscribe = createHandleSubscribe(subscriber);
    }
    return storage;
  }
  const defaultStorage = createJSONStorage();
  function atomWithStorage(key, initialValue, storage = defaultStorage, options) {
    const getOnInit = options == null ? void 0 : options.getOnInit;
    const baseAtom = atom(
      getOnInit ? storage.getItem(key, initialValue) : initialValue
    );
    baseAtom.onMount = (setAtom) => {
      setAtom(storage.getItem(key, initialValue));
      let unsub;
      if (storage.subscribe) {
        unsub = storage.subscribe(key, setAtom, initialValue);
      }
      return unsub;
    };
    const anAtom = atom(
      (get2) => get2(baseAtom),
      (get2, set, update2) => {
        const nextValue = typeof update2 === "function" ? update2(get2(baseAtom)) : update2;
        if (nextValue === RESET) {
          set(baseAtom, initialValue);
          return storage.removeItem(key);
        }
        if (nextValue instanceof Promise) {
          return nextValue.then((resolvedValue) => {
            set(baseAtom, resolvedValue);
            return storage.setItem(key, resolvedValue);
          });
        }
        set(baseAtom, nextValue);
        return storage.setItem(key, nextValue);
      }
    );
    return anAtom;
  }
  const ORIGINAL_FETCH = window.fetch;
  const LOCAL_STORAGE_STICKER_LIST_KEY = "bsm_sticker_list";
  const localStorageStickerListAtom = atomWithStorage(
    LOCAL_STORAGE_STICKER_LIST_KEY,
    { data: { list: {} } },
    void 0,
    { getOnInit: true }
  );
  const stickerListAtom = atom((get2) => {
    const localStorageStickerList = get2(localStorageStickerListAtom);
    return _.sortBy(
      _.map(localStorageStickerList.data.list, (value, key) => ({
        id: key,
        ...value
      })),
      "order"
    );
  });
  const useStickerListAtom = () => {
    const stickerList = useAtomValue(stickerListAtom);
    const setLocalStorageStickerList = useSetAtom(localStorageStickerListAtom);
    const setStickerList = (stickerList2) => {
      setLocalStorageStickerList({
        data: {
          list: _.keyBy(stickerList2, "id")
        }
      });
    };
    return { stickerList, setStickerList };
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = _.clone(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return _.map(result, (item, index2) => ({
      ...item,
      order: index2 + 1
    }));
  };
  const useStickerDndList = () => {
    const { stickerList, setStickerList } = useStickerListAtom();
    const onDragEnd3 = (result) => {
      if (!result.destination) return;
      setStickerList(
        reorder(stickerList, result.source.index, result.destination.index)
      );
    };
    const handleToggle = (id) => {
      setStickerList(
        stickerList.map(
          (item) => item.id === id ? { ...item, visible: !item.visible } : item
        )
      );
    };
    return { stickerList, onDragEnd: onDragEnd3, handleToggle };
  };
  function StickerDndList() {
    const { stickerList, onDragEnd: onDragEnd3, handleToggle } = useStickerDndList();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DragDropContext, { onDragEnd: onDragEnd3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectedDroppable, { droppableId: "droppable", children: (provided) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      List,
      {
        ...provided.droppableProps,
        ref: provided.innerRef,
        sx: {
          width: "100%",
          backgroundColor: "#f4f4f4"
        },
        children: [
          stickerList.map((item, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PublicDraggable,
            {
              index: index2,
              draggableId: item.id.toString(),
              children: (provided2, snapshot) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                ListItem,
                {
                  ref: provided2.innerRef,
                  ...provided2.draggableProps,
                  ...provided2.dragHandleProps,
                  sx: {
                    backgroundColor: snapshot.isDragging ? "#e0e0e0" : item.visible ? "#ffffff" : "#f0f0f0",
                    marginBottom: "8px",
                    borderRadius: "4px",
                    opacity: item.visible ? 1 : 0.5,
                    border: "solid black"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        checked: item.visible,
                        onChange: () => handleToggle(item.id)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        href: `https://home.gamer.com.tw/sticker_detail.php?sticker=${item.id}`,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        sx: {
                          padding: "10px"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Box,
                          {
                            component: "img",
                            src: `https://im.bahamut.com.tw/sticker/${item.id}/sticker_${item.id}.png`,
                            sx: {
                              width: "50px",
                              // 設定圖片的寬度
                              height: "50px",
                              // 設定圖片的高度
                              objectFit: "cover"
                              // 確保圖片填滿框框
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ListItemText,
                      {
                        primary: item.name,
                        secondary: `貼圖序列 : ${item.order} ${!item.visible ? "（隱藏中）" : ""}`
                      }
                    )
                  ]
                }
              )
            },
            item.id
          )),
          provided.placeholder
        ]
      }
    ) }) });
  }
  function AppDialog() {
    const { openState, closeAppDialog } = useAppDialogAtom();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dialog,
      {
        open: openState,
        onClose: closeAppDialog,
        PaperProps: {
          sx: {
            position: "absolute",
            left: 0,
            width: "400px",
            backgroundColor: "#f5f5f5",
            borderRadius: "15px",
            padding: "20px",
            border: "5px solid gray"
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogContent,
            {
              sx: {
                color: "#333",
                fontSize: "18px",
                textAlign: "center"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickerDndList, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogActions, { sx: { justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outlined",
              onClick: closeAppDialog,
              sx: {
                borderWidth: "2px"
              },
              children: "關閉視窗"
            }
          ) })
        ]
      }
    );
  }
  function index() {
    console.log("Bahamut Sticker Master: 渲染完成");
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Box,
      {
        sx: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppButton, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppDialog, {})
        ]
      }
    ) });
  }
  function App() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(index, {});
  }
  const URL_MY_STICKER = "https://api.gamer.com.tw/mobile_app/im/v1/my_sticker.php";
  const mergeStickerList = (localStorageStickerList, responseStickerList) => {
    const mergedList = { ...localStorageStickerList.data.list };
    _.forEach(responseStickerList.data.list, (value, key) => {
      if (!localStorageStickerList.data.list[key]) {
        mergedList[key] = value;
      }
    });
    return {
      ...localStorageStickerList,
      data: {
        ...localStorageStickerList.data,
        list: mergedList
      }
    };
  };
  const syncResponseWithStorage = (responseStickerList) => {
    const store = getDefaultStore();
    const localStorageStickerList = store.get(localStorageStickerListAtom);
    if (_.size(localStorageStickerList.data.list) == 0) {
      console.log("Bahamut Sticker Master: 初始化 localStorage 的資料");
      store.set(localStorageStickerListAtom, responseStickerList);
      return responseStickerList;
    }
    if (_.size(localStorageStickerList.data.list) !== _.size(responseStickerList.data.list)) {
      console.log("Bahamut Sticker Master: 偵測到新貼圖");
      const mergedStickerList = mergeStickerList(
        localStorageStickerList,
        responseStickerList
      );
      store.set(localStorageStickerListAtom, mergedStickerList);
      return mergedStickerList;
    }
    console.log("Bahamut Sticker Master: 回傳自訂貼圖列表");
    return localStorageStickerList;
  };
  const fetchInterceptor = () => {
    window.fetch = (...args) => {
      if (args[0] === URL_MY_STICKER) {
        console.log("Bahamut Sticker Master: 偵測到取得貼圖的 Request");
        return ORIGINAL_FETCH(...args).then((response) => {
          return response.json().then((data) => {
            const newData = syncResponseWithStorage(data);
            return new Response(JSON.stringify(newData), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          });
        });
      }
      return ORIGINAL_FETCH(...args);
    };
  };
  console.log("Bahamut Sticker Master: 載入 main.jsx");
  fetchInterceptor();
  const app = document.createElement("div");
  const targetSelector = ".sticker-wrapper";
  const observer = new MutationObserver((mutations) => {
    const target = document.querySelector(targetSelector);
    if (target) {
      target.before(app);
      client.createRoot(app).render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})(React, ReactDOM);