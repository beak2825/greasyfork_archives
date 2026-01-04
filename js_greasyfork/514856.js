// ==UserScript==
// @name         ani2mpv
// @namespace    npm/vite-plugin-monkey
// @version      2.0.1
// @author       Yotsuba
// @description  讓動畫瘋跳轉到 MPV
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514856/ani2mpv.user.js
// @updateURL https://update.greasyfork.org/scripts/514856/ani2mpv.meta.js
// ==/UserScript==

(function (React, ReactDOM) {
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

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
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
  var f$1 = React, k$1 = Symbol.for("react.element"), l$1 = Symbol.for("react.fragment"), m$2 = Object.prototype.hasOwnProperty, n$1 = f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
  function q$1(c2, a, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a.key && (e2 = "" + a.key);
    void 0 !== a.ref && (h2 = a.ref);
    for (b2 in a) m$2.call(a, b2) && !p$1.hasOwnProperty(b2) && (d2[b2] = a[b2]);
    if (c2 && c2.defaultProps) for (b2 in a = c2.defaultProps, a) void 0 === d2[b2] && (d2[b2] = a[b2]);
    return { $$typeof: k$1, type: c2, key: e2, ref: h2, props: d2, _owner: n$1.current };
  }
  reactJsxRuntime_production_min.Fragment = l$1;
  reactJsxRuntime_production_min.jsx = q$1;
  reactJsxRuntime_production_min.jsxs = q$1;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var m$1 = ReactDOM;
  {
    client.createRoot = m$1.createRoot;
    client.hydrateRoot = m$1.hydrateRoot;
  }
  function formatMuiErrorMessage(code, ...args) {
    const url = new URL(`https://mui.com/production-error/?code=${code}`);
    args.forEach((arg2) => url.searchParams.append("args[]", arg2));
    return `Minified MUI error #${code}; visit ${url} for the full message.`;
  }
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var t2 = arguments[e2];
        for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
      }
      return n2;
    }, _extends.apply(null, arguments);
  }
  function memoize$1(fn) {
    var cache = /* @__PURE__ */ Object.create(null);
    return function(arg2) {
      if (cache[arg2] === void 0) cache[arg2] = fn(arg2);
      return cache[arg2];
    };
  }
  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
  var isPropValid = /* @__PURE__ */ memoize$1(
    function(prop) {
      return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
    }
    /* Z+1 */
  );
  var isDevelopment$2 = false;
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
      this.isSpeedy = options.speedy === void 0 ? !isDevelopment$2 : options.speedy;
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
  function trim$1(value) {
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
  function substr(value, begin, end) {
    return value.slice(begin, end);
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
  function slice(begin, end) {
    return substr(characters, begin, end);
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
    return trim$1(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
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
  function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index = 0;
    var offset = 0;
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
          points[index++] = strlen(characters2) * ampersand;
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            case 0:
            case 125:
              scanning = 0;
            case 59 + offset:
              if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
              if (property > 0 && strlen(characters2) - length2)
                append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
              break;
            case 59:
              characters2 += ";";
            default:
              append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2), rulesets);
              if (character2 === 123)
                if (offset === 0)
                  parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
                else
                  switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                    case 100:
                    case 108:
                    case 109:
                    case 115:
                      parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                      break;
                    default:
                      parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                  }
          }
          index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
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
              ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
              break;
            case 44:
              points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            case 64:
              if (peek() === 45)
                characters2 += delimit(next());
              atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2) {
    var post = offset - 1;
    var rule = offset === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i = 0, j = 0, k2 = 0; i < index; ++i)
      for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j = points[i])), z2 = value; x2 < size; ++x2)
        if (z2 = trim$1(j > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
          props[k2++] = z2;
    return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2);
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
  function stringify(element, index, children, callback) {
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
  function prefix(value, length2) {
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
            return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
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
  var prefixer = function prefixer2(element, index, children, callback) {
    if (element.length > -1) {
      if (!element["return"]) switch (element.type) {
        case DECLARATION:
          element["return"] = prefix(element.value, element.length);
          break;
        case KEYFRAMES:
          return serialize([copy(element, {
            value: replace(element.value, "@", "@" + WEBKIT)
          })], callback);
        case RULESET:
          if (element.length) return combine(element.props, function(value) {
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
      var stylis = function stylis2(styles) {
        return serialize(compile(styles), serializer);
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
  var reactIs$1 = { exports: {} };
  var reactIs_production_min = {};
  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b = "function" === typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f = b ? Symbol.for("react.strict_mode") : 60108, g = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k = b ? Symbol.for("react.context") : 60110, l = b ? Symbol.for("react.async_mode") : 60111, m = b ? Symbol.for("react.concurrent_mode") : 60111, n = b ? Symbol.for("react.forward_ref") : 60112, p = b ? Symbol.for("react.suspense") : 60113, q = b ? Symbol.for("react.suspense_list") : 60120, r$1 = b ? Symbol.for("react.memo") : 60115, t = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.block") : 60121, w = b ? Symbol.for("react.fundamental") : 60117, x = b ? Symbol.for("react.responder") : 60118, y = b ? Symbol.for("react.scope") : 60119;
  function z(a) {
    if ("object" === typeof a && null !== a) {
      var u = a.$$typeof;
      switch (u) {
        case c:
          switch (a = a.type, a) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case n:
                case t:
                case r$1:
                case h:
                  return a;
                default:
                  return u;
              }
          }
        case d:
          return u;
      }
    }
  }
  function A(a) {
    return z(a) === m;
  }
  reactIs_production_min.AsyncMode = l;
  reactIs_production_min.ConcurrentMode = m;
  reactIs_production_min.ContextConsumer = k;
  reactIs_production_min.ContextProvider = h;
  reactIs_production_min.Element = c;
  reactIs_production_min.ForwardRef = n;
  reactIs_production_min.Fragment = e;
  reactIs_production_min.Lazy = t;
  reactIs_production_min.Memo = r$1;
  reactIs_production_min.Portal = d;
  reactIs_production_min.Profiler = g;
  reactIs_production_min.StrictMode = f;
  reactIs_production_min.Suspense = p;
  reactIs_production_min.isAsyncMode = function(a) {
    return A(a) || z(a) === l;
  };
  reactIs_production_min.isConcurrentMode = A;
  reactIs_production_min.isContextConsumer = function(a) {
    return z(a) === k;
  };
  reactIs_production_min.isContextProvider = function(a) {
    return z(a) === h;
  };
  reactIs_production_min.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === c;
  };
  reactIs_production_min.isForwardRef = function(a) {
    return z(a) === n;
  };
  reactIs_production_min.isFragment = function(a) {
    return z(a) === e;
  };
  reactIs_production_min.isLazy = function(a) {
    return z(a) === t;
  };
  reactIs_production_min.isMemo = function(a) {
    return z(a) === r$1;
  };
  reactIs_production_min.isPortal = function(a) {
    return z(a) === d;
  };
  reactIs_production_min.isProfiler = function(a) {
    return z(a) === g;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return z(a) === f;
  };
  reactIs_production_min.isSuspense = function(a) {
    return z(a) === p;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r$1 || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
  };
  reactIs_production_min.typeOf = z;
  {
    reactIs$1.exports = reactIs_production_min;
  }
  var reactIsExports = reactIs$1.exports;
  var reactIs = reactIsExports;
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
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
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
  var isDevelopment$1 = false;
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
  var noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
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
        var keyframes3 = interpolation;
        if (keyframes3.anim === 1) {
          cursor = {
            name: keyframes3.name,
            styles: keyframes3.styles,
            next: cursor
          };
          return keyframes3.name;
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
          var styles = serializedStyles.styles + ";";
          return styles;
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
          if (key === "NO_COMPONENT_SELECTOR" && isDevelopment$1) {
            throw new Error(noComponentSelectorMessage);
          }
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
    var styles = "";
    cursor = void 0;
    var strings = args[0];
    if (strings == null || strings.raw === void 0) {
      stringMode = false;
      styles += handleInterpolation(mergedProps, registered, strings);
    } else {
      var asTemplateStringsArr = strings;
      styles += asTemplateStringsArr[0];
    }
    for (var i = 1; i < args.length; i++) {
      styles += handleInterpolation(mergedProps, registered, args[i]);
      if (stringMode) {
        var templateStringsArr = strings;
        styles += templateStringsArr[i];
      }
    }
    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern.exec(styles)) !== null) {
      identifierName += "-" + match2[1];
    }
    var name = murmur2(styles) + identifierName;
    return {
      name,
      styles,
      next: cursor
    };
  }
  var syncFallback = function syncFallback2(create) {
    return create();
  };
  var useInsertionEffect = React__namespace["useInsertionEffect"] ? React__namespace["useInsertionEffect"] : false;
  var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
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
      toString: function toString3() {
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
  var isDevelopment = false;
  var Insertion = function Insertion2(_ref) {
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
      var styles = isReal && tag.__emotion_styles !== void 0 ? tag.__emotion_styles.slice(0) : [];
      if (identifierName !== void 0) {
        styles.push("label:" + identifierName + ";");
      }
      if (args[0] == null || args[0].raw === void 0) {
        styles.push.apply(styles, args);
      } else {
        styles.push(args[0][0]);
        var len = args.length;
        var i = 1;
        for (; i < len; i++) {
          styles.push(args[i], args[0][i]);
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
        var serialized = serializeStyles(styles.concat(classInterpolations), cache.registered, mergedProps);
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
        return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(Insertion, {
          cache,
          serialized,
          isStringTag: typeof FinalTag === "string"
        }), /* @__PURE__ */ React__namespace.createElement(FinalTag, newProps));
      });
      Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
      Styled.defaultProps = tag.defaultProps;
      Styled.__emotion_real = Styled;
      Styled.__emotion_base = baseTag;
      Styled.__emotion_styles = styles;
      Styled.__emotion_forwardProp = shouldForwardProp2;
      Object.defineProperty(Styled, "toString", {
        value: function value() {
          if (targetClassName === void 0 && isDevelopment) {
            return "NO_COMPONENT_SELECTOR";
          }
          return "." + targetClassName;
        }
      });
      Styled.withComponent = function(nextTag, nextOptions) {
        return createStyled(nextTag, _extends({}, options, nextOptions, {
          shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
        })).apply(void 0, styles);
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
  /**
   * @mui/styled-engine v6.1.5
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
  function internal_serializeStyles(styles) {
    wrapper[0] = styles;
    return serializeStyles(wrapper);
  }
  function isPlainObject$1(item) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    const prototype2 = Object.getPrototypeOf(item);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
  }
  function deepClone(source) {
    if (!isPlainObject$1(source)) {
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
        if (isPlainObject$1(source[key]) && // Avoid prototype pollution
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
    function between(start, end) {
      const endIndex = keys.indexOf(end);
      return `@media (min-width:${typeof values2[start] === "number" ? values2[start] : start}${unit}) and (max-width:${(endIndex !== -1 && typeof values2[keys[endIndex]] === "number" ? values2[keys[endIndex]] : end) - step / 100}${unit})`;
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
  function merge$1(acc, item) {
    if (!item) {
      return acc;
    }
    return deepmerge(acc, item, {
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
  const defaultContainerQueries = {
    containerQueries: (containerName) => ({
      up: (key) => {
        let result = typeof key === "number" ? key : values$1[key] || key;
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
      return propValue.reduce((acc, item, index) => {
        acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
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
        } else if (Object.keys(themeBreakpoints.values || values$1).includes(breakpoint)) {
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
  function style$1(options) {
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
  function getValue(transformer, propValue) {
    if (typeof propValue === "string" || propValue == null) {
      return propValue;
    }
    return transformer(propValue);
  }
  function getStyleFromPropValue(cssProperties, transformer) {
    return (propValue) => cssProperties.reduce((acc, cssProperty) => {
      acc[cssProperty] = getValue(transformer, propValue);
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
  function style(props, keys) {
    const transformer = createUnarySpacing(props.theme);
    return Object.keys(props).map((prop) => resolveCssProperty(props, keys, prop, transformer)).reduce(merge$1, {});
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
  function compose(...styles) {
    const handlers = styles.reduce((acc, style2) => {
      style2.filterProps.forEach((prop) => {
        acc[prop] = style2;
      });
      return acc;
    }, {});
    const fn = (props) => {
      return Object.keys(props).reduce((acc, prop) => {
        if (handlers[prop]) {
          return merge$1(acc, handlers[prop](props));
        }
        return acc;
      }, {});
    };
    fn.propTypes = {};
    fn.filterProps = styles.reduce((acc, style2) => acc.concat(style2.filterProps), []);
    return fn;
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
        borderRadius: getValue(transformer, propValue)
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
        gap: getValue(transformer, propValue)
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
        columnGap: getValue(transformer, propValue)
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
        rowGap: getValue(transformer, propValue)
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
        var _a, _b, _c, _d, _e;
        const breakpoint = ((_c = (_b = (_a = props.theme) == null ? void 0 : _a.breakpoints) == null ? void 0 : _b.values) == null ? void 0 : _c[propValue]) || values$1[propValue];
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
    function getThemeValue(prop, val, theme, config) {
      const props = {
        [prop]: val,
        theme
      };
      const options = config[prop];
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
      const config = theme.unstable_sxConfig ?? defaultSxConfig;
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
              if (config[styleKey]) {
                css2 = merge$1(css2, getThemeValue(styleKey, value, theme, config));
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
              css2 = merge$1(css2, getThemeValue(styleKey, value, theme, config));
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
  function applyStyles(key, styles) {
    var _a;
    const theme = this;
    if (theme.vars) {
      if (!((_a = theme.colorSchemes) == null ? void 0 : _a[key]) || typeof theme.getColorSchemeSelector !== "function") {
        return {};
      }
      let selector = theme.getColorSchemeSelector(key);
      if (selector === "&") {
        return styles;
      }
      if (selector.includes("data-") || selector.includes(".")) {
        selector = `*:where(${selector.replace(/\s*&$/, "")}) &`;
      }
      return {
        [selector]: styles
      };
    }
    if (theme.palette.mode === key) {
      return styles;
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
  function useTheme$1(defaultTheme2 = null) {
    const contextTheme = React__namespace.useContext(ThemeContext);
    return !contextTheme || isObjectEmpty$1(contextTheme) ? defaultTheme2 : contextTheme;
  }
  const systemDefaultTheme$1 = createTheme$1();
  function useTheme(defaultTheme2 = systemDefaultTheme$1) {
    return useTheme$1(defaultTheme2);
  }
  const splitProps = (props) => {
    var _a;
    const result = {
      systemProps: {},
      otherProps: {}
    };
    const config = ((_a = props == null ? void 0 : props.theme) == null ? void 0 : _a.unstable_sxConfig) ?? defaultSxConfig;
    Object.keys(props).forEach((prop) => {
      if (config[prop]) {
        result.systemProps[prop] = props[prop];
      } else {
        result.otherProps[prop] = props[prop];
      }
    });
    return result;
  };
  function extendSxProp(props) {
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
  function r(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2) n2 += e2;
    else if ("object" == typeof e2) if (Array.isArray(e2)) {
      var o = e2.length;
      for (t2 = 0; t2 < o; t2++) e2[t2] && (f2 = r(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
    } else for (f2 in e2) e2[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx() {
    for (var e2, t2, f2 = 0, n2 = "", o = arguments.length; f2 < o; f2++) (e2 = arguments[f2]) && (t2 = r(e2)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function createBox(options = {}) {
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
      const theme = useTheme(defaultTheme2);
      const {
        className,
        component = "div",
        ...other
      } = extendSxProp(inProps);
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
    return (_props, styles) => styles[slot];
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
      internal_mutateStyles(tag, (styles) => styles.filter((style2) => style2 !== styleFunctionSx));
      const {
        name: componentName,
        slot: componentSlot,
        skipVariantsResolver: inputSkipVariantsResolver,
        skipSx: inputSkipSx,
        // TODO v6: remove `lowercaseFirstLetter()` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        overridesResolver = defaultOverridesResolver(lowercaseFirstLetter(componentSlot)),
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
        if (componentName && overridesResolver) {
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
            return overridesResolver(props, resolvedStyleOverrides);
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
    for (const _ in object) {
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
    return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n2, index) => {
    return index < 3 ? parseInt(n2, 16) : Math.round(parseInt(n2, 16) / 255 * 1e3) / 1e3;
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
      if (warning && false) {
        console.warn(warning);
      }
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
  function setRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
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
    const config = theme.components[name];
    if (config.defaultProps) {
      return resolveProps(config.defaultProps, props);
    }
    if (!config.styleOverrides && !config.variants) {
      return resolveProps(config, props);
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
    keys.forEach((k2, index) => {
      if (index === keys.length - 1) {
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
        if (!shouldSkipPaths || shouldSkipPaths && !shouldSkipPaths([...parentKeys, key])) {
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
      getSelector = defaultGetSelector2,
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
      insertStyleSheet(getSelector(void 0, {
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
        insertStyleSheet(getSelector(colorScheme, {
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
        insertStyleSheet(getSelector(key, {
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
  const THEME_ID = "$$material";
  const common = {
    black: "#000",
    white: "#fff"
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
    const create = (props = ["all"], options = {}) => {
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
      create,
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
      for (let index = 0; index < array.length; index++) {
        const [key, value] = array[index];
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
  const defaultDarkOverlays = [...Array(25)].map((_, index) => {
    if (index === 0) {
      return "none";
    }
    const overlay = getOverlayAlpha(index);
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
  const excludeVariablesFromRoot = (cssVarPrefix) => [...[...Array(25)].map((_, index) => `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}overlays-${index}`), `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkBg`, `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkColor`];
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
    if (!color2 || !color2.startsWith("hsl")) {
      return color2;
    }
    return hslToRgb(color2);
  }
  function setColorChannel(obj, key) {
    if (!(`${key}Channel` in obj)) {
      obj[`${key}Channel`] = private_safeColorChannel(toRgb(obj[key]), `MUI: Can't create \`palette.${key}Channel\` because \`palette.${key}\` is not one of these formats: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().
To suppress this warning, you need to explicitly provide the \`palette.${key}Channel\` as a string (in rgb format, for example "12 12 12") or undefined if you want to remove the channel token.`);
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
        if (colors && typeof colors === "object") {
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
  function slotShouldForwardProp(prop) {
    return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
  }
  const rootShouldForwardProp = (prop) => slotShouldForwardProp(prop) && prop !== "classes";
  const styled = createStyled2({
    themeId: THEME_ID,
    defaultTheme: defaultTheme$1,
    rootShouldForwardProp
  });
  const boxClasses = generateUtilityClasses("MuiBox", ["root"]);
  const defaultTheme = createTheme();
  const Box = createBox({
    themeId: THEME_ID,
    defaultTheme,
    defaultClassName: boxClasses.root,
    generateClassName: ClassNameGenerator.generate
  });
  const memoTheme = unstable_memoTheme;
  function useDefaultProps(params) {
    return useDefaultProps$1(params);
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
  const TransitionGroupContext = React.createContext(null);
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
      var children = values(this.state.children).map(childFactory2);
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
  TransitionGroup.defaultProps = defaultProps;
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
  const useUtilityClasses$1 = (ownerState) => {
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
    overridesResolver: (props, styles) => styles.root
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
    function useRippleHandler(rippleAction, eventCallback, skipRippleAction = disableTouchRipple) {
      return useEventCallback((event) => {
        if (eventCallback) {
          eventCallback(event);
        }
        const ignore = skipRippleAction;
        if (!ignore) {
          ripple[rippleAction](event);
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
    const classes = useUtilityClasses$1(ownerState);
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
  function getButtonUtilityClass(slot) {
    return generateUtilityClass("MuiButton", slot);
  }
  const buttonClasses = generateUtilityClasses("MuiButton", ["root", "text", "textInherit", "textPrimary", "textSecondary", "textSuccess", "textError", "textInfo", "textWarning", "outlined", "outlinedInherit", "outlinedPrimary", "outlinedSecondary", "outlinedSuccess", "outlinedError", "outlinedInfo", "outlinedWarning", "contained", "containedInherit", "containedPrimary", "containedSecondary", "containedSuccess", "containedError", "containedInfo", "containedWarning", "disableElevation", "focusVisible", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorSuccess", "colorError", "colorInfo", "colorWarning", "textSizeSmall", "textSizeMedium", "textSizeLarge", "outlinedSizeSmall", "outlinedSizeMedium", "outlinedSizeLarge", "containedSizeSmall", "containedSizeMedium", "containedSizeLarge", "sizeMedium", "sizeSmall", "sizeLarge", "fullWidth", "startIcon", "endIcon", "icon", "iconSizeSmall", "iconSizeMedium", "iconSizeLarge"]);
  const ButtonGroupContext = /* @__PURE__ */ React__namespace.createContext({});
  const ButtonGroupButtonContext = /* @__PURE__ */ React__namespace.createContext(void 0);
  const useUtilityClasses = (ownerState) => {
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
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, styles[ownerState.variant], styles[`${ownerState.variant}${capitalize(ownerState.color)}`], styles[`size${capitalize(ownerState.size)}`], styles[`${ownerState.variant}Size${capitalize(ownerState.size)}`], ownerState.color === "inherit" && styles.colorInherit, ownerState.disableElevation && styles.disableElevation, ownerState.fullWidth && styles.fullWidth];
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
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.startIcon, styles[`iconSize${capitalize(ownerState.size)}`]];
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
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.endIcon, styles[`iconSize${capitalize(ownerState.size)}`]];
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
    const classes = useUtilityClasses(ownerState);
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
  function MpvButton({ onClick }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        sx: {
          color: "white",
          backgroundColor: "black",
          marginTop: "20px",
          border: "2px solid white",
          borderRadius: "5px",
          fontSize: "20px",
          "&:hover": {
            backgroundColor: "#00B4D8"
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "text",
            onClick,
            fullWidth: true,
            sx: { padding: "10px 50px" },
            children: "用 MPV 播放"
          }
        )
      }
    );
  }
  function MessageBox({ text }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        sx: {
          color: "white",
          marginTop: "20px",
          fontSize: "15px",
          fontWeight: "bold",
          whiteSpace: "nowrap"
        },
        children: text
      }
    );
  }
  function Page({ onClick, text }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MpvButton, { onClick }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageBox, { text })
    ] });
  }
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  const isString = typeOfTest("string");
  const isFunction = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l2;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l2 = obj.length; i < l2; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };
    for (let i = 0, l2 = arguments.length; i < l2; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }
  const extend = (a, b2, thisArg, { allOwnKeys } = {}) => {
    forEach(b2, (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position2) => {
    str = String(str);
    if (position2 === void 0 || position2 > str.length) {
      position2 = str.length;
    }
    position2 -= searchString.length;
    const lastIndex = str.indexOf(searchString, position2);
    return lastIndex !== -1 && lastIndex === position2;
  };
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while ((result = iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m2, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter2) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter2));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  const ALPHA = "abcdefghijklmnopqrstuvwxyz";
  const DIGIT = "0123456789";
  const ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
  };
  const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
    let str = "";
    const { length: length2 } = alphabet;
    while (size--) {
      str += alphabet[Math.random() * length2 | 0];
    }
    return str;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token2, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token2) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token2, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
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
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap
  };
  function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError, Error, {
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
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError.prototype;
  const descriptors = {};
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
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error, axiosError, function filter2(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token2, i) {
      token2 = removeBrackets(token2);
      return !dots && i ? "[" + token2 + "]" : token2;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$2(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match2) {
      return charMap[match2];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append2(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode2 = encoder ? function(value) {
      return encoder.call(this, value, encode$2);
    } : encode$2;
    return this._pairs.map(function each(pair) {
      return _encode2(pair[0]) + "=" + _encode2(pair[1]);
    }, "").join("&");
  };
  function encode$1(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode2 = options && options.encode || encode$1;
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode2);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h2) {
        if (h2 !== null) {
          fn(h2);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window.location.href || "http://localhost";
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = {
    ...utils,
    ...platform$1
  };
  function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }
  function parsePropPath(name) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match2) => {
      return match2[0] === "[]" ? "" : match2[1] || match2[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      const result = buildPath(path, value, target[name], index);
      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e2) {
        if (e2.name !== "SyntaxError") {
          throw e2;
        }
      }
    }
    return (0, JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$1.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional2 = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data);
        } catch (e2) {
          if (strictJSONParsing) {
            if (e2.name === "SyntaxError") {
              throw AxiosError.from(e2, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e2;
          }
        }
      }
      return data;
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
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const ignoreDuplicateOf = utils$1.toObjectSet([
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
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line2) {
      i = line2.indexOf(":");
      key = line2.substring(0, i).trim().toLowerCase();
      val = line2.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match2;
    while (match2 = tokensRE.exec(str)) {
      tokens[match2[1]] = match2[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
    if (utils$1.isFunction(filter2)) {
      return filter2.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value)) return;
    if (utils$1.isString(filter2)) {
      return value.indexOf(filter2) !== -1;
    }
    if (utils$1.isRegExp(filter2)) {
      return filter2.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w2, char2, str) => {
      return char2.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isHeaders(header)) {
        for (const [key, value] of header.entries()) {
          setHeader(value, key, rewrite);
        }
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  }
  AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders);
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders.from(context.headers);
    let data = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }
  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError(message, config, request) {
    AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response) {
    const validateStatus2 = response.config.validateStatus;
    if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError(
        "Request failed with status code " + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match2 = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match2 && match2[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(null, args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e2) => {
      const loaded = e2.loaded;
      const total = e2.lengthComputable ? e2.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e2,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function standardBrowserEnv() {
      const msie = platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent);
      const urlParsingNode = document.createElement("a");
      let originURL;
      function resolveURL(url) {
        let href = url;
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
        const parsed = utils$1.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    /* @__PURE__ */ function nonStandardBrowserEnv() {
      return function isURLSameOrigin2() {
        return true;
      };
    }()
  );
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils$1.isString(path) && cookie.push("path=" + path);
        utils$1.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match2 = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match2 ? decodeURIComponent(match2[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
  function mergeConfig(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b2, caseless) {
      if (!utils$1.isUndefined(b2)) {
        return getMergedValue(a, b2, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a, caseless);
      }
    }
    function valueFromConfig2(a, b2) {
      if (!utils$1.isUndefined(b2)) {
        return getMergedValue(void 0, b2);
      }
    }
    function defaultToConfig2(a, b2) {
      if (!utils$1.isUndefined(b2)) {
        return getMergedValue(void 0, b2);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b2, prop) {
      if (prop in config2) {
        return getMergedValue(a, b2);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b2) => mergeDeepProperties(headersToObject(a), headersToObject(b2), true)
    };
    utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }
  const resolveConfig = (config) => {
    const newConfig = mergeConfig({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    let contentType;
    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if ((contentType = headers.getContentType()) !== false) {
        const [type, ...tokens] = contentType ? contentType.split(";").map((token2) => token2.trim()).filter(Boolean) : [];
        headers.setContentType([type || "multipart/form-data", ...tokens].join("; "));
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
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
        reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional2 = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length: length2 } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length2) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$1.asap(unsubscribe);
      return signal;
    }
  };
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  const readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  const readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e2) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e2);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const isFetchSupported = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
  const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === "function";
  const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Response(str).arrayBuffer()));
  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e2) {
      return false;
    }
  };
  const supportsRequestStream = isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const supportsResponseStream = isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && ((res) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res2) => res2[type]() : (_, config) => {
        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
    });
  })(new Response());
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils$1.isBlob(body)) {
      return body.size;
    }
    if (utils$1.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils$1.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils$1.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length2 = utils$1.toFiniteNumber(headers.getContentLength());
    return length2 == null ? getBodyLength(body) : length2;
  };
  const fetchAdapter = isFetchSupported && (async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig(config);
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = "credentials" in Request.prototype;
      request = new Request(url, {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      });
      let response = await fetch(request);
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError.from(err, err && err.code, config, request);
    }
  });
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: fetchAdapter
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e2) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  const adapters = {
    getAdapter: (adapters2) => {
      adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
      const { length: length2 } = adapters2;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length2; i++) {
        nameOrAdapter = adapters2[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError(`Unknown adapter '${id}'`);
          }
        }
        if (adapter) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length2 ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION$1 = "1.7.7";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version2, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError(
          formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
          AxiosError.ERR_DEPRECATED
        );
      }
      if (version2 && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version2 + " and will be removed in the near future"
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
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result = value === void 0 || validator2(value, opt, options);
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
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy;
          Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e2) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      const { transitional: transitional2, paramsSerializer, headers } = config;
      if (transitional2 !== void 0) {
        validator.assertOptions(transitional2, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      i = 0;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  }
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  class CancelToken {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token2 = this;
      this.promise.then((cancel) => {
        if (!token2._listeners) return;
        let i = token2._listeners.length;
        while (i-- > 0) {
          token2._listeners[i](cancel);
        }
        token2._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token2.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token2.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token2.reason) {
          return;
        }
        token2.reason = new CanceledError(message, config, request);
        resolvePromise(token2.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token2 = new CancelToken(function executor(c2) {
        cancel = c2;
      });
      return {
        token: token2,
        cancel
      };
    }
  }
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });
  function createInstance(defaultConfig) {
    const context = new Axios(defaultConfig);
    const instance = bind(Axios.prototype.request, context);
    utils$1.extend(instance, Axios.prototype, context, { allOwnKeys: true });
    utils$1.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults);
  axios.Axios = Axios;
  axios.CanceledError = CanceledError;
  axios.CancelToken = CancelToken;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION$1;
  axios.toFormData = toFormData;
  axios.AxiosError = AxiosError;
  axios.Cancel = axios.CanceledError;
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;
  axios.isAxiosError = isAxiosError;
  axios.mergeConfig = mergeConfig;
  axios.AxiosHeaders = AxiosHeaders;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode;
  axios.default = axios;
  function apiBase(onSuccess, onError, method, urlPath, data = null, contentType = "application/json") {
    const apiRoot = "https://ani.gamer.com.tw";
    const url = `${apiRoot}${urlPath}`;
    const headers = {
      "Content-Type": contentType
    };
    const config = { headers };
    {
      config.params = data;
      axios[method.toLowerCase()](url, config).then((response) => {
        onSuccess(response);
      }).catch((error) => {
        onError(error);
      });
    }
  }
  const __vite_import_meta_env__$2 = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false };
  const isSelfAtom = (atom2, a) => atom2.unstable_is ? atom2.unstable_is(a) : a === atom2;
  const hasInitialValue = (atom2) => "init" in atom2;
  const isActuallyWritableAtom = (atom2) => !!atom2.write;
  const isAtomStateInitialized = (atomState) => "v" in atomState || "e" in atomState;
  const returnAtomValue = (atomState) => {
    if ("e" in atomState) {
      throw atomState.e;
    }
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && !("v" in atomState)) {
      throw new Error("[Bug] atom state is not initialized");
    }
    return atomState.v;
  };
  const PROMISE_STATE = Symbol();
  const getPromiseState = (promise) => promise[PROMISE_STATE];
  const isPendingPromise = (value) => {
    var _a;
    return isPromiseLike$1(value) && !((_a = getPromiseState(value)) == null ? void 0 : _a[1]);
  };
  const cancelPromise = (promise, nextValue) => {
    const promiseState = getPromiseState(promise);
    if (promiseState) {
      promiseState[1] = true;
      promiseState[0].forEach((fn) => fn(nextValue));
    } else if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      throw new Error("[Bug] cancelable promise not found");
    }
  };
  const patchPromiseForCancelability = (promise) => {
    if (getPromiseState(promise)) {
      return;
    }
    const promiseState = [/* @__PURE__ */ new Set(), false];
    promise[PROMISE_STATE] = promiseState;
    const settle2 = () => {
      promiseState[1] = true;
    };
    promise.then(settle2, settle2);
    promise.onCancel = (fn) => {
      promiseState[0].add(fn);
    };
  };
  const isPromiseLike$1 = (p2) => typeof (p2 == null ? void 0 : p2.then) === "function";
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
  const setAtomStateValueOrPromise = (atom2, valueOrPromise, ensureAtomState) => {
    const atomState = ensureAtomState(atom2);
    const hasPrevValue = "v" in atomState;
    const prevValue = atomState.v;
    const pendingPromise = isPendingPromise(atomState.v) ? atomState.v : null;
    if (isPromiseLike$1(valueOrPromise)) {
      patchPromiseForCancelability(valueOrPromise);
      for (const a of atomState.d.keys()) {
        addPendingPromiseToDependency(atom2, valueOrPromise, ensureAtomState(a));
      }
    }
    atomState.v = valueOrPromise;
    delete atomState.e;
    if (!hasPrevValue || !Object.is(prevValue, atomState.v)) {
      ++atomState.n;
      if (pendingPromise) {
        cancelPromise(pendingPromise, valueOrPromise);
      }
    }
  };
  const getMountedOrPendingDependents = (atom2, atomState, mountedMap) => {
    var _a;
    const dependents = /* @__PURE__ */ new Set();
    for (const a of ((_a = mountedMap.get(atom2)) == null ? void 0 : _a.t) || []) {
      if (mountedMap.has(a)) {
        dependents.add(a);
      }
    }
    for (const atomWithPendingPromise of atomState.p) {
      dependents.add(atomWithPendingPromise);
    }
    return dependents;
  };
  const createStoreHook = () => {
    const callbacks = /* @__PURE__ */ new Set();
    const notify = () => {
      callbacks.forEach((fn) => fn());
    };
    notify.add = (fn) => {
      callbacks.add(fn);
      return () => {
        callbacks.delete(fn);
      };
    };
    return notify;
  };
  const createStoreHookForAtoms = () => {
    const all2 = {};
    const callbacks = /* @__PURE__ */ new WeakMap();
    const notify = (atom2) => {
      var _a, _b;
      (_a = callbacks.get(all2)) == null ? void 0 : _a.forEach((fn) => fn(atom2));
      (_b = callbacks.get(atom2)) == null ? void 0 : _b.forEach((fn) => fn());
    };
    notify.add = (atom2, fn) => {
      const key = atom2 || all2;
      const fns = (callbacks.has(key) ? callbacks : callbacks.set(key, /* @__PURE__ */ new Set())).get(key);
      fns.add(fn);
      return () => {
        fns == null ? void 0 : fns.delete(fn);
        if (!fns.size) {
          callbacks.delete(key);
        }
      };
    };
    return notify;
  };
  const initializeStoreHooks = (storeHooks) => {
    storeHooks.c || (storeHooks.c = createStoreHookForAtoms());
    storeHooks.m || (storeHooks.m = createStoreHookForAtoms());
    storeHooks.u || (storeHooks.u = createStoreHookForAtoms());
    storeHooks.f || (storeHooks.f = createStoreHook());
    return storeHooks;
  };
  const BUILDING_BLOCKS = Symbol();
  const buildStore = (atomStateMap = /* @__PURE__ */ new WeakMap(), mountedMap = /* @__PURE__ */ new WeakMap(), invalidatedAtoms = /* @__PURE__ */ new WeakMap(), changedAtoms = /* @__PURE__ */ new Set(), mountCallbacks = /* @__PURE__ */ new Set(), unmountCallbacks = /* @__PURE__ */ new Set(), storeHooks = {}, atomRead = (atom2, ...params) => atom2.read(...params), atomWrite = (atom2, ...params) => atom2.write(...params), atomOnInit = (atom2, store2) => {
    var _a;
    return (_a = atom2.unstable_onInit) == null ? void 0 : _a.call(atom2, store2);
  }, atomOnMount = (atom2, setAtom) => {
    var _a;
    return (_a = atom2.onMount) == null ? void 0 : _a.call(atom2, setAtom);
  }, ...buildingBlockFunctions) => {
    const ensureAtomState = buildingBlockFunctions[0] || ((atom2) => {
      if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && !atom2) {
        throw new Error("Atom is undefined or null");
      }
      let atomState = atomStateMap.get(atom2);
      if (!atomState) {
        atomState = { d: /* @__PURE__ */ new Map(), p: /* @__PURE__ */ new Set(), n: 0 };
        atomStateMap.set(atom2, atomState);
        atomOnInit == null ? void 0 : atomOnInit(atom2, store2);
      }
      return atomState;
    });
    const flushCallbacks = buildingBlockFunctions[1] || (() => {
      let hasError;
      let error;
      const call = (fn) => {
        try {
          fn();
        } catch (e2) {
          if (!hasError) {
            hasError = true;
            error = e2;
          }
        }
      };
      do {
        if (storeHooks.f) {
          call(storeHooks.f);
        }
        const callbacks = /* @__PURE__ */ new Set();
        const add = callbacks.add.bind(callbacks);
        changedAtoms.forEach((atom2) => {
          var _a;
          return (_a = mountedMap.get(atom2)) == null ? void 0 : _a.l.forEach(add);
        });
        changedAtoms.clear();
        unmountCallbacks.forEach(add);
        unmountCallbacks.clear();
        mountCallbacks.forEach(add);
        mountCallbacks.clear();
        callbacks.forEach(call);
        if (changedAtoms.size) {
          recomputeInvalidatedAtoms();
        }
      } while (changedAtoms.size || unmountCallbacks.size || mountCallbacks.size);
      if (hasError) {
        throw error;
      }
    });
    const recomputeInvalidatedAtoms = buildingBlockFunctions[2] || (() => {
      var _a;
      const topSortedReversed = [];
      const visiting = /* @__PURE__ */ new WeakSet();
      const visited = /* @__PURE__ */ new WeakSet();
      const stack = Array.from(changedAtoms);
      while (stack.length) {
        const a = stack[stack.length - 1];
        const aState = ensureAtomState(a);
        if (visited.has(a)) {
          stack.pop();
          continue;
        }
        if (visiting.has(a)) {
          if (invalidatedAtoms.get(a) === aState.n) {
            topSortedReversed.push([a, aState, aState.n]);
          } else if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && invalidatedAtoms.has(a)) {
            throw new Error("[Bug] invalidated atom exists");
          }
          visited.add(a);
          stack.pop();
          continue;
        }
        visiting.add(a);
        for (const d2 of getMountedOrPendingDependents(a, aState, mountedMap)) {
          if (!visiting.has(d2)) {
            stack.push(d2);
          }
        }
      }
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
          readAtomState(a);
          mountDependencies(a);
          if (prevEpochNumber !== aState.n) {
            changedAtoms.add(a);
            (_a = storeHooks.c) == null ? void 0 : _a.call(storeHooks, a);
          }
        }
        invalidatedAtoms.delete(a);
      }
    });
    const readAtomState = buildingBlockFunctions[3] || ((atom2) => {
      var _a, _b;
      const atomState = ensureAtomState(atom2);
      if (isAtomStateInitialized(atomState)) {
        if (mountedMap.has(atom2) && invalidatedAtoms.get(atom2) !== atomState.n) {
          return atomState;
        }
        if (Array.from(atomState.d).every(
          ([a, n2]) => (
            // Recursively, read the atom state of the dependency, and
            // check if the atom epoch number is unchanged
            readAtomState(a).n === n2
          )
        )) {
          return atomState;
        }
      }
      atomState.d.clear();
      let isSync = true;
      const mountDependenciesIfAsync = () => {
        if (mountedMap.has(atom2)) {
          mountDependencies(atom2);
          recomputeInvalidatedAtoms();
          flushCallbacks();
        }
      };
      const getter = (a) => {
        var _a2;
        if (isSelfAtom(atom2, a)) {
          const aState2 = ensureAtomState(a);
          if (!isAtomStateInitialized(aState2)) {
            if (hasInitialValue(a)) {
              setAtomStateValueOrPromise(a, a.init, ensureAtomState);
            } else {
              throw new Error("no atom init");
            }
          }
          return returnAtomValue(aState2);
        }
        const aState = readAtomState(a);
        try {
          return returnAtomValue(aState);
        } finally {
          atomState.d.set(a, aState.n);
          if (isPendingPromise(atomState.v)) {
            addPendingPromiseToDependency(atom2, atomState.v, aState);
          }
          (_a2 = mountedMap.get(a)) == null ? void 0 : _a2.t.add(atom2);
          if (!isSync) {
            mountDependenciesIfAsync();
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
          if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && !isActuallyWritableAtom(atom2)) {
            console.warn("setSelf function cannot be used with read-only atom");
          }
          if (!setSelf && isActuallyWritableAtom(atom2)) {
            setSelf = (...args) => {
              if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && isSync) {
                console.warn("setSelf function cannot be called in sync");
              }
              if (!isSync) {
                try {
                  return writeAtomState(atom2, ...args);
                } finally {
                  recomputeInvalidatedAtoms();
                  flushCallbacks();
                }
              }
            };
          }
          return setSelf;
        }
      };
      const prevEpochNumber = atomState.n;
      try {
        const valueOrPromise = atomRead(atom2, getter, options);
        setAtomStateValueOrPromise(atom2, valueOrPromise, ensureAtomState);
        if (isPromiseLike$1(valueOrPromise)) {
          (_a = valueOrPromise.onCancel) == null ? void 0 : _a.call(valueOrPromise, () => controller == null ? void 0 : controller.abort());
          valueOrPromise.then(
            mountDependenciesIfAsync,
            mountDependenciesIfAsync
          );
        }
        return atomState;
      } catch (error) {
        delete atomState.v;
        atomState.e = error;
        ++atomState.n;
        return atomState;
      } finally {
        isSync = false;
        if (prevEpochNumber !== atomState.n && invalidatedAtoms.get(atom2) === prevEpochNumber) {
          invalidatedAtoms.set(atom2, atomState.n);
          changedAtoms.add(atom2);
          (_b = storeHooks.c) == null ? void 0 : _b.call(storeHooks, atom2);
        }
      }
    });
    const invalidateDependents = buildingBlockFunctions[4] || ((atom2) => {
      const stack = [atom2];
      while (stack.length) {
        const a = stack.pop();
        const aState = ensureAtomState(a);
        for (const d2 of getMountedOrPendingDependents(a, aState, mountedMap)) {
          const dState = ensureAtomState(d2);
          invalidatedAtoms.set(d2, dState.n);
          stack.push(d2);
        }
      }
    });
    const writeAtomState = buildingBlockFunctions[5] || ((atom2, ...args) => {
      let isSync = true;
      const getter = (a) => returnAtomValue(readAtomState(a));
      const setter = (a, ...args2) => {
        var _a;
        const aState = ensureAtomState(a);
        try {
          if (isSelfAtom(atom2, a)) {
            if (!hasInitialValue(a)) {
              throw new Error("atom not writable");
            }
            const prevEpochNumber = aState.n;
            const v2 = args2[0];
            setAtomStateValueOrPromise(a, v2, ensureAtomState);
            mountDependencies(a);
            if (prevEpochNumber !== aState.n) {
              changedAtoms.add(a);
              (_a = storeHooks.c) == null ? void 0 : _a.call(storeHooks, a);
              invalidateDependents(a);
            }
            return void 0;
          } else {
            return writeAtomState(a, ...args2);
          }
        } finally {
          if (!isSync) {
            recomputeInvalidatedAtoms();
            flushCallbacks();
          }
        }
      };
      try {
        return atomWrite(atom2, getter, setter, ...args);
      } finally {
        isSync = false;
      }
    });
    const mountDependencies = buildingBlockFunctions[6] || ((atom2) => {
      var _a;
      const atomState = ensureAtomState(atom2);
      const mounted = mountedMap.get(atom2);
      if (mounted && !isPendingPromise(atomState.v)) {
        for (const [a, n2] of atomState.d) {
          if (!mounted.d.has(a)) {
            const aState = ensureAtomState(a);
            const aMounted = mountAtom(a);
            aMounted.t.add(atom2);
            mounted.d.add(a);
            if (n2 !== aState.n) {
              changedAtoms.add(a);
              (_a = storeHooks.c) == null ? void 0 : _a.call(storeHooks, a);
              invalidateDependents(a);
            }
          }
        }
        for (const a of mounted.d || []) {
          if (!atomState.d.has(a)) {
            mounted.d.delete(a);
            const aMounted = unmountAtom(a);
            aMounted == null ? void 0 : aMounted.t.delete(atom2);
          }
        }
      }
    });
    const mountAtom = buildingBlockFunctions[7] || ((atom2) => {
      var _a;
      const atomState = ensureAtomState(atom2);
      let mounted = mountedMap.get(atom2);
      if (!mounted) {
        readAtomState(atom2);
        for (const a of atomState.d.keys()) {
          const aMounted = mountAtom(a);
          aMounted.t.add(atom2);
        }
        mounted = {
          l: /* @__PURE__ */ new Set(),
          d: new Set(atomState.d.keys()),
          t: /* @__PURE__ */ new Set()
        };
        mountedMap.set(atom2, mounted);
        (_a = storeHooks.m) == null ? void 0 : _a.call(storeHooks, atom2);
        if (isActuallyWritableAtom(atom2)) {
          const processOnMount = () => {
            let isSync = true;
            const setAtom = (...args) => {
              try {
                return writeAtomState(atom2, ...args);
              } finally {
                if (!isSync) {
                  recomputeInvalidatedAtoms();
                  flushCallbacks();
                }
              }
            };
            try {
              const onUnmount = atomOnMount(atom2, setAtom);
              if (onUnmount) {
                mounted.u = () => {
                  isSync = true;
                  try {
                    onUnmount();
                  } finally {
                    isSync = false;
                  }
                };
              }
            } finally {
              isSync = false;
            }
          };
          mountCallbacks.add(processOnMount);
        }
      }
      return mounted;
    });
    const unmountAtom = buildingBlockFunctions[8] || ((atom2) => {
      var _a;
      const atomState = ensureAtomState(atom2);
      let mounted = mountedMap.get(atom2);
      if (mounted && !mounted.l.size && !Array.from(mounted.t).some((a) => {
        var _a2;
        return (_a2 = mountedMap.get(a)) == null ? void 0 : _a2.d.has(atom2);
      })) {
        if (mounted.u) {
          unmountCallbacks.add(mounted.u);
        }
        mounted = void 0;
        mountedMap.delete(atom2);
        (_a = storeHooks.u) == null ? void 0 : _a.call(storeHooks, atom2);
        for (const a of atomState.d.keys()) {
          const aMounted = unmountAtom(a);
          aMounted == null ? void 0 : aMounted.t.delete(atom2);
        }
        return void 0;
      }
      return mounted;
    });
    const buildingBlocks = [
      // store state
      atomStateMap,
      mountedMap,
      invalidatedAtoms,
      changedAtoms,
      mountCallbacks,
      unmountCallbacks,
      storeHooks,
      // atom intercepters
      atomRead,
      atomWrite,
      atomOnInit,
      atomOnMount,
      // building-block functions
      ensureAtomState,
      flushCallbacks,
      recomputeInvalidatedAtoms,
      readAtomState,
      invalidateDependents,
      writeAtomState,
      mountDependencies,
      mountAtom,
      unmountAtom
    ];
    const store2 = {
      get: (atom2) => returnAtomValue(readAtomState(atom2)),
      set: (atom2, ...args) => {
        try {
          return writeAtomState(atom2, ...args);
        } finally {
          recomputeInvalidatedAtoms();
          flushCallbacks();
        }
      },
      sub: (atom2, listener) => {
        const mounted = mountAtom(atom2);
        const listeners = mounted.l;
        listeners.add(listener);
        flushCallbacks();
        return () => {
          listeners.delete(listener);
          unmountAtom(atom2);
          flushCallbacks();
        };
      }
    };
    Object.defineProperty(store2, BUILDING_BLOCKS, { value: buildingBlocks });
    return store2;
  };
  const INTERNAL_buildStoreRev1 = buildStore;
  const INTERNAL_initializeStoreHooks = initializeStoreHooks;
  const __vite_import_meta_env__$1 = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false };
  let keyCount = 0;
  function atom(read, write) {
    const key = `atom${++keyCount}`;
    const config = {
      toString() {
        return (__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && this.debugLabel ? key + ":" + this.debugLabel : key;
      }
    };
    {
      config.init = read;
      config.read = defaultRead;
      config.write = defaultWrite;
    }
    return config;
  }
  function defaultRead(get) {
    return get(this);
  }
  function defaultWrite(get, set, arg2) {
    return set(
      this,
      typeof arg2 === "function" ? arg2(get(this)) : arg2
    );
  }
  const createDevStoreRev4 = () => {
    let inRestoreAtom = 0;
    const storeHooks = INTERNAL_initializeStoreHooks({});
    const atomStateMap = /* @__PURE__ */ new WeakMap();
    const mountedAtoms = /* @__PURE__ */ new WeakMap();
    const store2 = INTERNAL_buildStoreRev1(
      atomStateMap,
      mountedAtoms,
      void 0,
      void 0,
      void 0,
      void 0,
      storeHooks,
      void 0,
      (atom2, get, set, ...args) => {
        if (inRestoreAtom) {
          return set(atom2, ...args);
        }
        return atom2.write(get, set, ...args);
      }
    );
    const debugMountedAtoms = /* @__PURE__ */ new Set();
    storeHooks.m.add(void 0, (atom2) => {
      debugMountedAtoms.add(atom2);
      const atomState = atomStateMap.get(atom2);
      atomState.m = mountedAtoms.get(atom2);
    });
    storeHooks.u.add(void 0, (atom2) => {
      debugMountedAtoms.delete(atom2);
      const atomState = atomStateMap.get(atom2);
      delete atomState.m;
    });
    const devStore = {
      // store dev methods (these are tentative and subject to change without notice)
      dev4_get_internal_weak_map: () => atomStateMap,
      dev4_get_mounted_atoms: () => debugMountedAtoms,
      dev4_restore_atoms: (values2) => {
        const restoreAtom = {
          read: () => null,
          write: (_get, set) => {
            ++inRestoreAtom;
            try {
              for (const [atom2, value] of values2) {
                if ("init" in atom2) {
                  set(atom2, value);
                }
              }
            } finally {
              --inRestoreAtom;
            }
          }
        };
        store2.set(restoreAtom);
      }
    };
    return Object.assign(store2, devStore);
  };
  const createStore = () => {
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      return createDevStoreRev4();
    }
    const store2 = INTERNAL_buildStoreRev1();
    return store2;
  };
  let defaultStore;
  const getDefaultStore = () => {
    if (!defaultStore) {
      defaultStore = createStore();
      if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
        globalThis.__JOTAI_DEFAULT_STORE__ || (globalThis.__JOTAI_DEFAULT_STORE__ = defaultStore);
        if (globalThis.__JOTAI_DEFAULT_STORE__ !== defaultStore) {
          console.warn(
            "Detected multiple Jotai instances. It may cause unexpected behavior with the default store. https://github.com/pmndrs/jotai/discussions/2044"
          );
        }
      }
    }
    return defaultStore;
  };
  const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false };
  const StoreContext = React.createContext(
    void 0
  );
  const useStore = (options) => {
    const store2 = React.useContext(StoreContext);
    return store2 || getDefaultStore();
  };
  const isPromiseLike = (x2) => typeof (x2 == null ? void 0 : x2.then) === "function";
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
              if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && nextValue === p2) {
                throw new Error("[Bug] p is not updated even after cancelation");
              }
              if (isPromiseLike(nextValue)) {
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
    const store2 = useStore();
    const [[valueFromReducer, storeFromReducer, atomFromReducer], rerender] = React.useReducer(
      (prev2) => {
        const nextValue = store2.get(atom2);
        if (Object.is(prev2[0], nextValue) && prev2[1] === store2 && prev2[2] === atom2) {
          return prev2;
        }
        return [nextValue, store2, atom2];
      },
      void 0,
      () => [store2.get(atom2), store2, atom2]
    );
    let value = valueFromReducer;
    if (storeFromReducer !== store2 || atomFromReducer !== atom2) {
      rerender();
      value = store2.get(atom2);
    }
    const delay = void 0;
    React.useEffect(() => {
      const unsub = store2.sub(atom2, () => {
        rerender();
      });
      rerender();
      return unsub;
    }, [store2, atom2, delay]);
    React.useDebugValue(value);
    if (isPromiseLike(value)) {
      const promise = createContinuablePromise(value);
      return use(promise);
    }
    return value;
  }
  function useSetAtom(atom2, options) {
    const store2 = useStore();
    const setAtom = React.useCallback(
      (...args) => {
        if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && !("write" in atom2)) {
          throw new Error("not writable atom");
        }
        return store2.set(atom2, ...args);
      },
      [store2, atom2]
    );
    return setAtom;
  }
  function useAtom(atom2, options) {
    return [
      useAtomValue(atom2),
      // We do wrong type assertion here, which results in throwing an error.
      useSetAtom(atom2)
    ];
  }
  const vipAtom = atom(null);
  const adAtom = atom(null);
  const videoSnAtom = atom(null);
  const videoUrlAtom = atom(null);
  const videoTitleAtom = atom(null);
  const videoUnlockedAtom = atom(null);
  const store$5 = getDefaultStore();
  const device = animefun.getdeviceid();
  function apiStartAd(onSuccess, onError) {
    apiBase(onSuccess, onError, "GET", "/ajax/videoCastcishu.php", {
      s: getAd()[0],
      sn: store$5.get(videoSnAtom)
    });
  }
  function apiEndAd(onSuccess, onError) {
    apiBase(onSuccess, onError, "GET", "/ajax/videoCastcishu.php", {
      s: getAd()[0],
      sn: store$5.get(videoSnAtom),
      ad: "end"
    });
  }
  function apiGetM3U8(onSuccess, onError) {
    apiBase(onSuccess, onError, "GET", "/ajax/m3u8.php", {
      sn: store$5.get(videoSnAtom),
      device
    });
  }
  function apiGetToken(onSuccess, onError) {
    apiBase(onSuccess, onError, "GET", "/ajax/token.php", {
      sn: store$5.get(videoSnAtom),
      device
    });
  }
  function useAnime() {
    const [videoSn, setVideoSn] = useAtom(videoSnAtom);
    const [videoTitle, setVideoTitle] = useAtom(videoTitleAtom);
    React.useEffect(() => {
      if (videoSn == null) {
        setVideoSn(animefun.videoSn);
      }
      if (videoTitle == null) {
        setVideoTitle(animefun.title);
      }
    }, []);
  }
  const store$4 = getDefaultStore();
  const getM3U8 = () => {
    apiGetM3U8(
      (response) => {
        console.log(`ani2mpv: 影片 M3U8 ${response.data.src}`);
        store$4.set(videoUrlAtom, response.data.src);
      },
      (error) => {
      }
    );
  };
  function useAd() {
    const [ad, setAd] = useAtom(adAtom);
    const [videoSn, setVideoSn] = useAtom(videoSnAtom);
    React.useEffect(() => {
      if (ad == null) {
        return;
      }
      if (ad.videoSn !== videoSn) {
        console.log("ani2mpv: 銷毀 adTimer");
        setAd(null);
        return;
      }
      if (ad.timer > 0) {
        setTimeout(() => {
          console.log(`ani2mpv: 廣告播放中，還剩下 ${ad.timer - 1} 秒`);
          setAd((prev2) => ({
            ...prev2,
            timer: prev2.timer - 1
          }));
        }, 1e3);
        return;
      }
      if (ad.timer == 0) {
        apiEndAd(
          (response) => {
            console.log("ani2mpv: 廣告結束");
            getM3U8();
          },
          (error) => {
          }
        );
      }
    }, [ad]);
    return { ad, setAd };
  }
  function useVipStatus() {
    const [vip, setVip] = useAtom(vipAtom);
    React.useEffect(() => {
      if (vip == null) {
        apiGetToken(
          (response) => {
            setVip(response.data.vip);
          },
          (error) => {
          }
        );
      }
    }, [vip]);
    return { vip, setVip };
  }
  const version = "3.7.7";
  const VERSION = version;
  const _hasBuffer = typeof Buffer === "function";
  const _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
  const _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
  const b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const b64chs = Array.prototype.slice.call(b64ch);
  const b64tab = ((a) => {
    let tab = {};
    a.forEach((c2, i) => tab[c2] = i);
    return tab;
  })(b64chs);
  const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  const _fromCC = String.fromCharCode.bind(String);
  const _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
  const _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
  const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
  const btoaPolyfill = (bin) => {
    let u32, c0, c1, c2, asc = "";
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length; ) {
      if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
        throw new TypeError("invalid character found");
      u32 = c0 << 16 | c1 << 8 | c2;
      asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
  };
  const _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
  const _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
    const maxargs = 4096;
    let strs = [];
    for (let i = 0, l2 = u8a.length; i < l2; i += maxargs) {
      strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
    }
    return _btoa(strs.join(""));
  };
  const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
  const cb_utob = (c2) => {
    if (c2.length < 2) {
      var cc = c2.charCodeAt(0);
      return cc < 128 ? c2 : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    } else {
      var cc = 65536 + (c2.charCodeAt(0) - 55296) * 1024 + (c2.charCodeAt(1) - 56320);
      return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    }
  };
  const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
  const utob = (u) => u.replace(re_utob, cb_utob);
  const _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
  const encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
  const encodeURI = (src) => encode(src, true);
  const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
  const cb_btou = (cccc) => {
    switch (cccc.length) {
      case 4:
        var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
        return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
      case 3:
        return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
      default:
        return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
    }
  };
  const btou = (b2) => b2.replace(re_btou, cb_btou);
  const atobPolyfill = (asc) => {
    asc = asc.replace(/\s+/g, "");
    if (!b64re.test(asc))
      throw new TypeError("malformed base64.");
    asc += "==".slice(2 - (asc.length & 3));
    let u24, bin = "", r1, r2;
    for (let i = 0; i < asc.length; ) {
      u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
      bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
  };
  const _atob = typeof atob === "function" ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
  const _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c2) => c2.charCodeAt(0)));
  const toUint8Array = (a) => _toUint8Array(_unURI(a));
  const _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
  const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
  const decode = (src) => _decode(_unURI(src));
  const isValid = (src) => {
    if (typeof src !== "string")
      return false;
    const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
  };
  const _noEnum = (v2) => {
    return {
      value: v2,
      enumerable: false,
      writable: true,
      configurable: true
    };
  };
  const extendString = function() {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add("fromBase64", function() {
      return decode(this);
    });
    _add("toBase64", function(urlsafe) {
      return encode(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return encode(this, true);
    });
    _add("toBase64URL", function() {
      return encode(this, true);
    });
    _add("toUint8Array", function() {
      return toUint8Array(this);
    });
  };
  const extendUint8Array = function() {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add("toBase64", function(urlsafe) {
      return fromUint8Array(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return fromUint8Array(this, true);
    });
    _add("toBase64URL", function() {
      return fromUint8Array(this, true);
    });
  };
  const extendBuiltins = () => {
    extendString();
    extendUint8Array();
  };
  const gBase64 = {
    version,
    VERSION,
    atob: _atob,
    atobPolyfill,
    btoa: _btoa,
    btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode,
    encodeURI,
    encodeURL: encodeURI,
    utob,
    btou,
    decode,
    isValid,
    fromUint8Array,
    toUint8Array,
    extendString,
    extendUint8Array,
    extendBuiltins
  };
  const store$3 = getDefaultStore();
  const animeToMpv = (url) => {
    const title = `巴哈姆特動畫瘋 | ${store$3.get(
    videoTitleAtom
  )} | ani2mpv Yotsuba`;
    const mpv = `mpv://play/${gBase64.encodeURI(
    url
  )}/?v_title=${gBase64.encodeURI(title)}`;
    window.location.href = mpv;
  };
  function useVideoAlert() {
    const [videoUrl, setVideoUrl] = useAtom(videoUrlAtom);
    React.useEffect(() => {
      if (videoUrl !== null) {
        animeToMpv(videoUrl);
      }
    }, [videoUrl]);
    return { videoUrl, setVideoUrl };
  }
  function useVideoSnEffect() {
    const [videoSn, setVideoSn] = useAtom(videoSnAtom);
    const [videoUrl, setVideoUrl] = useAtom(videoUrlAtom);
    React.useEffect(() => {
      console.log("ani2mpv: 偵測到換頁，videoSn 變更為", videoSn);
      setVideoUrl(null);
    }, [videoSn]);
    return { videoSn, setVideoSn };
  }
  function Ani2Mpv() {
    useAnime();
    const { videoSn } = useVideoSnEffect();
    const { ad, setAd } = useAd();
    const { vip } = useVipStatus();
    const { videoUrl } = useVideoAlert();
    const [videoUnlocked, setVideoUnlocked] = useAtom(videoUnlockedAtom);
    const onClick = () => {
      if (videoUrl) {
        animeToMpv();
        return;
      }
      if (vip || videoUnlocked) {
        getM3U8();
        return;
      }
      apiStartAd(
        (response) => {
          console.log("ani2mpv: 廣告開始");
          setAd({ timer: 25, videoSn });
        },
        (error) => {
        }
      );
    };
    if (vip == true) {
      var text = `你是付費會員！`;
    } else if (videoUnlocked) {
      var text = `不用觀看廣告即可播放`;
    } else if (vip == false && ad == null) {
      var text = `按下按鈕後自動觀看廣告`;
    } else if (vip == false && ad.timer > 0) {
      var text = `廣告播放中，還剩下 ${ad.timer} 秒`;
    } else if (vip == false && ad.timer == 0) {
      var text = `廣告播放完畢`;
    } else {
      var text = `取得會員資訊中 ...`;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Page, { onClick, text });
  }
  function App() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Ani2Mpv, {});
  }
  const store$2 = getDefaultStore();
  (function overrideFetch() {
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
      let url;
      if (typeof input === "string") {
        url = new URL(input, location.origin);
      } else if (input instanceof Request) {
        url = new URL(input.url, location.origin);
      } else {
        return originalFetch(input, init);
      }
      if (url.pathname === "/ajax/token.php") {
        console.log("ani2mpv: 攔截到 /ajax/token.php");
        try {
          const response = await originalFetch(input, init);
          const clonedResponse = response.clone();
          const responseData = await clonedResponse.json();
          if (responseData && typeof responseData.vip !== "undefined") {
            store$2.set(vipAtom, responseData.vip);
            store$2.set(videoUnlockedAtom, responseData.time);
            console.log("ani2mpv: VIP 狀態為", responseData.vip);
            console.log("ani2mpv: time 狀態為", responseData.time);
          }
          return response;
        } catch (error) {
          console.error("ani2mpv: ", error);
          throw error;
        }
      }
      return originalFetch(input, init);
    };
  })();
  const store$1 = getDefaultStore();
  (function monitorUrlChange() {
    let lastSn = null;
    function getSnFromQuery() {
      const params = new URLSearchParams(window.location.search);
      return params.get("sn") || null;
    }
    function updateVideoSn() {
      const newSn = getSnFromQuery();
      if (newSn !== lastSn) {
        lastSn = newSn;
        store$1.set(videoSnAtom, newSn);
      }
    }
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      updateVideoSn();
    };
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      updateVideoSn();
    };
    window.addEventListener("popstate", updateVideoSn);
    updateVideoSn();
  })();
  const store = getDefaultStore();
  (function monitorVideoTitle() {
    function updateAnimeTitle() {
      const titleElement = document.querySelector(".anime_name h1");
      if (titleElement) {
        const titleText = titleElement.textContent.trim();
        console.log("ani2mpv: 影片標題更新為", titleText);
        store.set(videoTitleAtom, titleText);
      }
    }
    updateAnimeTitle();
    const observer2 = new MutationObserver(updateAnimeTitle);
    const targetNode = document.querySelector(".anime_name");
    if (targetNode) {
      observer2.observe(targetNode, { childList: true, subtree: true });
    }
    const globalObserver = new MutationObserver(() => {
      const newTarget = document.querySelector(".anime_name");
      if (newTarget) {
        observer2.observe(newTarget, { childList: true, subtree: true });
        globalObserver.disconnect();
        updateAnimeTitle();
      }
    });
    globalObserver.observe(document.body, { childList: true, subtree: true });
  })();
  console.log("ani2mpv: 載入 main.jsx");
  let reactRoot = null;
  let appContainer = null;
  const targetSelector = ".ncc-choose-btn";
  const observer = new MutationObserver(() => {
    const target = document.querySelector(targetSelector);
    if (target && !reactRoot) {
      appContainer = document.createElement("div");
      appContainer.id = "ani2mpv-root";
      target.after(appContainer);
      reactRoot = client.createRoot(appContainer);
      reactRoot.render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
    }
    if (!target && reactRoot) {
      reactRoot.unmount();
      reactRoot = null;
      if (appContainer && appContainer.parentNode) {
        appContainer.parentNode.removeChild(appContainer);
        appContainer = null;
      }
    }
    if (appContainer && !document.body.contains(appContainer) && reactRoot) {
      reactRoot.unmount();
      reactRoot = null;
      appContainer = null;
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})(React, ReactDOM);