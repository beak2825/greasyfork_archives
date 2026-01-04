// ==UserScript==
// @name         MihoyoBBSCookie
// @namespace    https://www.imbytecat.com/
// @version      3.1.0
// @author       ziyunhui
// @description  get cookie on Mihoyo BBS
// @icon         https://vitejs.dev/logo.svg
// @match        https://bbs.mihoyo.com/ys/strategy/*
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_cookie
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/462262/MihoyoBBSCookie.user.js
// @updateURL https://update.greasyfork.org/scripts/462262/MihoyoBBSCookie.meta.js
// ==/UserScript==

// use vite-plugin-monkey@1.1.4 at 2023-03-22T07:26:46.785Z

(function(React2, ReactDOM2) {
  "use strict";
  const _interopDefaultLegacy = (e2) => e2 && typeof e2 === "object" && "default" in e2 ? e2 : { default: e2 };
  function _interopNamespace(e2) {
    if (e2 && e2.__esModule)
      return e2;
    const n2 = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e2) {
      for (const k2 in e2) {
        if (k2 !== "default") {
          const d2 = Object.getOwnPropertyDescriptor(e2, k2);
          Object.defineProperty(n2, k2, d2.get ? d2 : {
            enumerable: true,
            get: () => e2[k2]
          });
        }
      }
    }
    n2.default = e2;
    return Object.freeze(n2);
  }
  const React__namespace = /* @__PURE__ */ _interopNamespace(React2);
  const React__default = /* @__PURE__ */ _interopDefaultLegacy(React2);
  const ReactDOM__default = /* @__PURE__ */ _interopDefaultLegacy(ReactDOM2);
  const ReactDOM__namespace = /* @__PURE__ */ _interopNamespace(ReactDOM2);
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
  var abs = Math.abs;
  var from = String.fromCharCode;
  var assign = Object.assign;
  function hash(value, length2) {
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
        if (z2 = trim(j > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
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
  function memoize$1(fn) {
    var cache2 = /* @__PURE__ */ Object.create(null);
    return function(arg) {
      if (cache2[arg] === void 0)
        cache2[arg] = fn(arg);
      return cache2[arg];
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
    if (element.type !== "rule" || !element.parent || element.length < 1) {
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
      if (value.charCodeAt(0) === 108 && value.charCodeAt(2) === 98) {
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
    var container2;
    var nodesToHydrate = [];
    {
      container2 = options.container || document.head;
      Array.prototype.forEach.call(
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
        container: container2,
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
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
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
    return _extends.apply(this, arguments);
  }
  function getAugmentedNamespace(n2) {
    var f2 = n2.default;
    if (typeof f2 == "function") {
      var a = function() {
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
  var b$1 = "function" === typeof Symbol && Symbol.for, c$1 = b$1 ? Symbol.for("react.element") : 60103, d$1 = b$1 ? Symbol.for("react.portal") : 60106, e$1 = b$1 ? Symbol.for("react.fragment") : 60107, f$2 = b$1 ? Symbol.for("react.strict_mode") : 60108, g$1 = b$1 ? Symbol.for("react.profiler") : 60114, h$1 = b$1 ? Symbol.for("react.provider") : 60109, k$2 = b$1 ? Symbol.for("react.context") : 60110, l$2 = b$1 ? Symbol.for("react.async_mode") : 60111, m$3 = b$1 ? Symbol.for("react.concurrent_mode") : 60111, n$2 = b$1 ? Symbol.for("react.forward_ref") : 60112, p$2 = b$1 ? Symbol.for("react.suspense") : 60113, q$2 = b$1 ? Symbol.for("react.suspense_list") : 60120, r$1 = b$1 ? Symbol.for("react.memo") : 60115, t$1 = b$1 ? Symbol.for("react.lazy") : 60116, v$1 = b$1 ? Symbol.for("react.block") : 60121, w = b$1 ? Symbol.for("react.fundamental") : 60117, x = b$1 ? Symbol.for("react.responder") : 60118, y = b$1 ? Symbol.for("react.scope") : 60119;
  function z(a) {
    if ("object" === typeof a && null !== a) {
      var u2 = a.$$typeof;
      switch (u2) {
        case c$1:
          switch (a = a.type, a) {
            case l$2:
            case m$3:
            case e$1:
            case g$1:
            case f$2:
            case p$2:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k$2:
                case n$2:
                case t$1:
                case r$1:
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
    return z(a) === m$3;
  }
  reactIs_production_min$1.AsyncMode = l$2;
  reactIs_production_min$1.ConcurrentMode = m$3;
  reactIs_production_min$1.ContextConsumer = k$2;
  reactIs_production_min$1.ContextProvider = h$1;
  reactIs_production_min$1.Element = c$1;
  reactIs_production_min$1.ForwardRef = n$2;
  reactIs_production_min$1.Fragment = e$1;
  reactIs_production_min$1.Lazy = t$1;
  reactIs_production_min$1.Memo = r$1;
  reactIs_production_min$1.Portal = d$1;
  reactIs_production_min$1.Profiler = g$1;
  reactIs_production_min$1.StrictMode = f$2;
  reactIs_production_min$1.Suspense = p$2;
  reactIs_production_min$1.isAsyncMode = function(a) {
    return A(a) || z(a) === l$2;
  };
  reactIs_production_min$1.isConcurrentMode = A;
  reactIs_production_min$1.isContextConsumer = function(a) {
    return z(a) === k$2;
  };
  reactIs_production_min$1.isContextProvider = function(a) {
    return z(a) === h$1;
  };
  reactIs_production_min$1.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === c$1;
  };
  reactIs_production_min$1.isForwardRef = function(a) {
    return z(a) === n$2;
  };
  reactIs_production_min$1.isFragment = function(a) {
    return z(a) === e$1;
  };
  reactIs_production_min$1.isLazy = function(a) {
    return z(a) === t$1;
  };
  reactIs_production_min$1.isMemo = function(a) {
    return z(a) === r$1;
  };
  reactIs_production_min$1.isPortal = function(a) {
    return z(a) === d$1;
  };
  reactIs_production_min$1.isProfiler = function(a) {
    return z(a) === g$1;
  };
  reactIs_production_min$1.isStrictMode = function(a) {
    return z(a) === f$2;
  };
  reactIs_production_min$1.isSuspense = function(a) {
    return z(a) === p$2;
  };
  reactIs_production_min$1.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === e$1 || a === m$3 || a === g$1 || a === f$2 || a === p$2 || a === q$2 || "object" === typeof a && null !== a && (a.$$typeof === t$1 || a.$$typeof === r$1 || a.$$typeof === h$1 || a.$$typeof === k$2 || a.$$typeof === n$2 || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v$1);
  };
  reactIs_production_min$1.typeOf = z;
  (function(module) {
    {
      module.exports = reactIs_production_min$1;
    }
  })(reactIs$2);
  var reactIs$1 = reactIs$2.exports;
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
    if ((isStringTag2 === false || isBrowser === false) && cache2.registered[className] === void 0) {
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
      k2 = (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16);
      k2 ^= k2 >>> 24;
      h2 = (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16) ^ (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h2 ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h2 ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h2 ^= str.charCodeAt(i) & 255;
        h2 = (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    h2 ^= h2 >>> 13;
    h2 = (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
  }
  var unitlessKeys = {
    animationIterationCount: 1,
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
      identifierName += "-" + match2[1];
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
  var useInsertionEffect = React__namespace["useInsertionEffect"] ? React__namespace["useInsertionEffect"] : false;
  var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
  var EmotionCacheContext = /* @__PURE__ */ React2.createContext(
    typeof HTMLElement !== "undefined" ? /* @__PURE__ */ createCache({
      key: "css"
    }) : null
  );
  var CacheProvider = EmotionCacheContext.Provider;
  var withEmotionCache = function withEmotionCache2(func) {
    return /* @__PURE__ */ React2.forwardRef(function(props, ref) {
      var cache2 = React2.useContext(EmotionCacheContext);
      return func(props, cache2, ref);
    });
  };
  var ThemeContext$2 = /* @__PURE__ */ React2.createContext({});
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
      toString: function toString() {
        return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
      }
    };
  };
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
  function isPlainObject(item) {
    return item !== null && typeof item === "object" && item.constructor === Object;
  }
  function deepClone(source) {
    if (!isPlainObject(source)) {
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
    const output = options.clone ? _extends({}, target) : target;
    if (isPlainObject(target) && isPlainObject(source)) {
      Object.keys(source).forEach((key) => {
        if (key === "__proto__") {
          return;
        }
        if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
          output[key] = deepmerge(target[key], source[key], options);
        } else if (options.clone) {
          output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  }
  function formatMuiErrorMessage(code) {
    let url = "https://mui.com/production-error/?code=" + code;
    for (let i = 1; i < arguments.length; i += 1) {
      url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified MUI error #" + code + "; visit " + url + " for the full message.";
  }
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
  var b = Symbol.for("react.element"), c = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), e = Symbol.for("react.strict_mode"), f$1 = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), h = Symbol.for("react.context"), k$1 = Symbol.for("react.server_context"), l$1 = Symbol.for("react.forward_ref"), m$2 = Symbol.for("react.suspense"), n$1 = Symbol.for("react.suspense_list"), p$1 = Symbol.for("react.memo"), q$1 = Symbol.for("react.lazy"), t = Symbol.for("react.offscreen"), u;
  u = Symbol.for("react.module.reference");
  function v(a) {
    if ("object" === typeof a && null !== a) {
      var r2 = a.$$typeof;
      switch (r2) {
        case b:
          switch (a = a.type, a) {
            case d:
            case f$1:
            case e:
            case m$2:
            case n$1:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k$1:
                case h:
                case l$1:
                case q$1:
                case p$1:
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
  reactIs_production_min.ForwardRef = l$1;
  reactIs_production_min.Fragment = d;
  reactIs_production_min.Lazy = q$1;
  reactIs_production_min.Memo = p$1;
  reactIs_production_min.Portal = c;
  reactIs_production_min.Profiler = f$1;
  reactIs_production_min.StrictMode = e;
  reactIs_production_min.Suspense = m$2;
  reactIs_production_min.SuspenseList = n$1;
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
    return v(a) === l$1;
  };
  reactIs_production_min.isFragment = function(a) {
    return v(a) === d;
  };
  reactIs_production_min.isLazy = function(a) {
    return v(a) === q$1;
  };
  reactIs_production_min.isMemo = function(a) {
    return v(a) === p$1;
  };
  reactIs_production_min.isPortal = function(a) {
    return v(a) === c;
  };
  reactIs_production_min.isProfiler = function(a) {
    return v(a) === f$1;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return v(a) === e;
  };
  reactIs_production_min.isSuspense = function(a) {
    return v(a) === m$2;
  };
  reactIs_production_min.isSuspenseList = function(a) {
    return v(a) === n$1;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === d || a === f$1 || a === e || a === m$2 || a === n$1 || a === t || "object" === typeof a && null !== a && (a.$$typeof === q$1 || a.$$typeof === p$1 || a.$$typeof === g || a.$$typeof === h || a.$$typeof === l$1 || a.$$typeof === u || void 0 !== a.getModuleId) ? true : false;
  };
  reactIs_production_min.typeOf = v;
  (function(module) {
    {
      module.exports = reactIs_production_min;
    }
  })(reactIs);
  function capitalize(string) {
    if (typeof string !== "string") {
      throw new Error(formatMuiErrorMessage(7));
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
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
  function debounce(func, wait = 166) {
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
    return /* @__PURE__ */ React__namespace.isValidElement(element) && muiNames.indexOf(element.type.muiName) !== -1;
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
  function setRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  }
  const useEnhancedEffect = typeof window !== "undefined" ? React__namespace.useLayoutEffect : React__namespace.useEffect;
  const useEnhancedEffect$1 = useEnhancedEffect;
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
  const maybeReactUseId = React__namespace["useId"];
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
    useEnhancedEffect$1(() => {
      ref.current = fn;
    });
    return React__namespace.useCallback((...args) => (0, ref.current)(...args), []);
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
  let hadKeyboardEvent = true;
  let hadFocusVisibleRecently = false;
  let hadFocusVisibleRecentlyTimeout;
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
    const ref = React__namespace.useCallback((node2) => {
      if (node2 != null) {
        prepare(node2.ownerDocument);
      }
    }, []);
    const isFocusVisibleRef = React__namespace.useRef(false);
    function handleBlurVisible() {
      if (isFocusVisibleRef.current) {
        hadFocusVisibleRecently = true;
        window.clearTimeout(hadFocusVisibleRecentlyTimeout);
        hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
          hadFocusVisibleRecently = false;
        }, 100);
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
  function getScrollbarSize(doc) {
    const documentWidth = doc.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  function resolveProps(defaultProps2, props) {
    const output = _extends({}, props);
    Object.keys(defaultProps2).forEach((propName) => {
      if (propName.toString().match(/^(components|slots)$/)) {
        output[propName] = _extends({}, defaultProps2[propName], output[propName]);
      } else if (propName.toString().match(/^(componentsProps|slotProps)$/)) {
        const defaultSlotProps = defaultProps2[propName] || {};
        const slotProps = props[propName];
        output[propName] = {};
        if (!slotProps || !Object.keys(slotProps)) {
          output[propName] = defaultSlotProps;
        } else if (!defaultSlotProps || !Object.keys(defaultSlotProps)) {
          output[propName] = slotProps;
        } else {
          output[propName] = _extends({}, slotProps);
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
  const ClassNameGenerator$1 = ClassNameGenerator;
  const globalStateClassesMapping = {
    active: "active",
    checked: "checked",
    completed: "completed",
    disabled: "disabled",
    readOnly: "readOnly",
    error: "error",
    expanded: "expanded",
    focused: "focused",
    focusVisible: "focusVisible",
    required: "required",
    selected: "selected"
  };
  function generateUtilityClass(componentName, slot, globalStatePrefix = "Mui") {
    const globalStateClass = globalStateClassesMapping[slot];
    return globalStateClass ? `${globalStatePrefix}-${globalStateClass}` : `${ClassNameGenerator$1.generate(componentName)}-${slot}`;
  }
  function generateUtilityClasses(componentName, slots, globalStatePrefix = "Mui") {
    const result = {};
    slots.forEach((slot) => {
      result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
    });
    return result;
  }
  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
  var isPropValid = /* @__PURE__ */ memoize$1(
    function(prop) {
      return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
    }
  );
  var testOmitPropsOnStringTag = isPropValid;
  var testOmitPropsOnComponent = function testOmitPropsOnComponent2(key) {
    return key !== "theme";
  };
  var getDefaultShouldForwardProp = function getDefaultShouldForwardProp2(tag) {
    return typeof tag === "string" && tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
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
          mergedProps.theme = React2.useContext(ThemeContext$2);
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
          if (finalShouldForwardProp(_key)) {
            newProps[_key] = props[_key];
          }
        }
        newProps.className = className;
        newProps.ref = ref;
        return /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Insertion, {
          cache: cache2,
          serialized,
          isStringTag: typeof FinalTag === "string"
        }), /* @__PURE__ */ React2.createElement(FinalTag, newProps));
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
        return createStyled2(nextTag, _extends({}, options, nextOptions, {
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
  var jsxRuntime$1 = { exports: {} };
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
  var f = React__default.default, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c2, a, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a.key && (e2 = "" + a.key);
    void 0 !== a.ref && (h2 = a.ref);
    for (b2 in a)
      m$1.call(a, b2) && !p.hasOwnProperty(b2) && (d2[b2] = a[b2]);
    if (c2 && c2.defaultProps)
      for (b2 in a = c2.defaultProps, a)
        void 0 === d2[b2] && (d2[b2] = a[b2]);
    return { $$typeof: k, type: c2, key: e2, ref: h2, props: d2, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  (function(module) {
    {
      module.exports = reactJsxRuntime_production_min;
    }
  })(jsxRuntime$1);
  const Fragment = jsxRuntime$1.exports.Fragment;
  const jsx = jsxRuntime$1.exports.jsx;
  const jsxs = jsxRuntime$1.exports.jsxs;
  const jsxRuntime = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Fragment,
    jsx,
    jsxs
  }, Symbol.toStringTag, { value: "Module" }));
  /**
   * @mui/styled-engine v5.11.11
   *
   * @license MIT
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  function styled$2(tag, options) {
    const stylesFactory = newStyled(tag, options);
    return stylesFactory;
  }
  const internal_processStyles = (tag, processor) => {
    if (Array.isArray(tag.__emotion_styles)) {
      tag.__emotion_styles = processor(tag.__emotion_styles);
    }
  };
  function merge(acc, item) {
    if (!item) {
      return acc;
    }
    return deepmerge(acc, item, {
      clone: false
    });
  }
  const values$1 = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536
  };
  const defaultBreakpoints = {
    keys: ["xs", "sm", "md", "lg", "xl"],
    up: (key) => `@media (min-width:${values$1[key]}px)`
  };
  function handleBreakpoints(props, propValue, styleFromPropValue) {
    const theme2 = props.theme || {};
    if (Array.isArray(propValue)) {
      const themeBreakpoints = theme2.breakpoints || defaultBreakpoints;
      return propValue.reduce((acc, item, index) => {
        acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
        return acc;
      }, {});
    }
    if (typeof propValue === "object") {
      const themeBreakpoints = theme2.breakpoints || defaultBreakpoints;
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
      const theme2 = props.theme;
      const themeMapping = getPath(theme2, themeKey) || {};
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
  function compose(...styles2) {
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
  function memoize(fn) {
    const cache2 = {};
    return (arg) => {
      if (cache2[arg] === void 0) {
        cache2[arg] = fn(arg);
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
  function createUnaryUnit(theme2, themeKey, defaultValue, propName) {
    var _getPath;
    const themeSpacing = (_getPath = getPath(theme2, themeKey, false)) != null ? _getPath : defaultValue;
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
  function createUnarySpacing(theme2) {
    return createUnaryUnit(theme2, "spacing", 8);
  }
  function getValue(transformer, propValue) {
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
      acc[cssProperty] = getValue(transformer, propValue);
      return acc;
    }, {});
  }
  function resolveCssProperty(props, keys, prop, transformer) {
    if (keys.indexOf(prop) === -1) {
      return null;
    }
    const cssProperties = getCssProperties(prop);
    const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
    const propValue = props[prop];
    return handleBreakpoints(props, propValue, styleFromPropValue);
  }
  function style(props, keys) {
    const transformer = createUnarySpacing(props.theme);
    return Object.keys(props).map((prop) => resolveCssProperty(props, keys, prop, transformer)).reduce(merge, {});
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
  function borderTransform(value) {
    if (typeof value !== "number") {
      return value;
    }
    return `${value}px solid`;
  }
  const border = style$1({
    prop: "border",
    themeKey: "borders",
    transform: borderTransform
  });
  const borderTop = style$1({
    prop: "borderTop",
    themeKey: "borders",
    transform: borderTransform
  });
  const borderRight = style$1({
    prop: "borderRight",
    themeKey: "borders",
    transform: borderTransform
  });
  const borderBottom = style$1({
    prop: "borderBottom",
    themeKey: "borders",
    transform: borderTransform
  });
  const borderLeft = style$1({
    prop: "borderLeft",
    themeKey: "borders",
    transform: borderTransform
  });
  const borderColor = style$1({
    prop: "borderColor",
    themeKey: "palette"
  });
  const borderTopColor = style$1({
    prop: "borderTopColor",
    themeKey: "palette"
  });
  const borderRightColor = style$1({
    prop: "borderRightColor",
    themeKey: "palette"
  });
  const borderBottomColor = style$1({
    prop: "borderBottomColor",
    themeKey: "palette"
  });
  const borderLeftColor = style$1({
    prop: "borderLeftColor",
    themeKey: "palette"
  });
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
  compose(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius);
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
        var _props$theme, _props$theme$breakpoi, _props$theme$breakpoi2;
        const breakpoint = ((_props$theme = props.theme) == null ? void 0 : (_props$theme$breakpoi = _props$theme.breakpoints) == null ? void 0 : (_props$theme$breakpoi2 = _props$theme$breakpoi.values) == null ? void 0 : _props$theme$breakpoi2[propValue]) || values$1[propValue];
        return {
          maxWidth: breakpoint || sizingTransform(propValue)
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
  const createFontStyleFunction = (prop) => {
    return (props) => {
      if (props[prop] !== void 0 && props[prop] !== null) {
        const styleFromPropValue = (propValue) => {
          var _props$theme$typograp;
          let value = (_props$theme$typograp = props.theme.typography) == null ? void 0 : _props$theme$typograp[propValue];
          if (typeof value === "object") {
            value = null;
          }
          if (!value) {
            var _props$theme$typograp2, _props$prop;
            value = (_props$theme$typograp2 = props.theme.typography) == null ? void 0 : _props$theme$typograp2[`${prop}${props[prop] === "default" || props[prop] === prop ? "" : capitalize((_props$prop = props[prop]) == null ? void 0 : _props$prop.toString())}`];
          }
          if (!value) {
            var _props$theme$typograp3, _props$theme$typograp4, _props$theme$typograp5;
            value = (_props$theme$typograp3 = (_props$theme$typograp4 = props.theme.typography) == null ? void 0 : (_props$theme$typograp5 = _props$theme$typograp4[propValue]) == null ? void 0 : _props$theme$typograp5[prop]) != null ? _props$theme$typograp3 : propValue;
          }
          return {
            [prop]: value
          };
        };
        return handleBreakpoints(props, props[prop], styleFromPropValue);
      }
      return null;
    };
  };
  const defaultSxConfig = {
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
    borderRadius: {
      themeKey: "shape.borderRadius",
      style: borderRadius
    },
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
    position: {},
    zIndex: {
      themeKey: "zIndex"
    },
    top: {},
    right: {},
    bottom: {},
    left: {},
    boxShadow: {
      themeKey: "shadows"
    },
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
    fontFamily: {
      themeKey: "typography",
      style: createFontStyleFunction("fontFamily")
    },
    fontSize: {
      themeKey: "typography",
      style: createFontStyleFunction("fontSize")
    },
    fontStyle: {
      themeKey: "typography"
    },
    fontWeight: {
      themeKey: "typography",
      style: createFontStyleFunction("fontWeight")
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
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object) => union.size === Object.keys(object).length);
  }
  function callIfFn(maybeFn, arg) {
    return typeof maybeFn === "function" ? maybeFn(arg) : maybeFn;
  }
  function unstable_createStyleFunctionSx() {
    function getThemeValue(prop, val, theme2, config2) {
      const props = {
        [prop]: val,
        theme: theme2
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
      const themeMapping = getPath(theme2, themeKey) || {};
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
      var _theme$unstable_sxCon;
      const {
        sx,
        theme: theme2 = {}
      } = props || {};
      if (!sx) {
        return null;
      }
      const config2 = (_theme$unstable_sxCon = theme2.unstable_sxConfig) != null ? _theme$unstable_sxCon : defaultSxConfig$1;
      function traverse(sxInput) {
        let sxObject = sxInput;
        if (typeof sxInput === "function") {
          sxObject = sxInput(theme2);
        } else if (typeof sxInput !== "object") {
          return sxInput;
        }
        if (!sxObject) {
          return null;
        }
        const emptyBreakpoints = createEmptyBreakpointObject(theme2.breakpoints);
        const breakpointsKeys = Object.keys(emptyBreakpoints);
        let css2 = emptyBreakpoints;
        Object.keys(sxObject).forEach((styleKey) => {
          const value = callIfFn(sxObject[styleKey], theme2);
          if (value !== null && value !== void 0) {
            if (typeof value === "object") {
              if (config2[styleKey]) {
                css2 = merge(css2, getThemeValue(styleKey, value, theme2, config2));
              } else {
                const breakpointsValues = handleBreakpoints({
                  theme: theme2
                }, value, (x2) => ({
                  [styleKey]: x2
                }));
                if (objectsHaveSameKeys(breakpointsValues, value)) {
                  css2[styleKey] = styleFunctionSx2({
                    sx: value,
                    theme: theme2
                  });
                } else {
                  css2 = merge(css2, breakpointsValues);
                }
              }
            } else {
              css2 = merge(css2, getThemeValue(styleKey, value, theme2, config2));
            }
          }
        });
        return removeUnusedBreakpoints(breakpointsKeys, css2);
      }
      return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
    }
    return styleFunctionSx2;
  }
  const styleFunctionSx = unstable_createStyleFunctionSx();
  styleFunctionSx.filterProps = ["sx"];
  const styleFunctionSx$1 = styleFunctionSx;
  const _excluded$u = ["sx"];
  const splitProps = (props) => {
    var _props$theme$unstable, _props$theme;
    const result = {
      systemProps: {},
      otherProps: {}
    };
    const config2 = (_props$theme$unstable = props == null ? void 0 : (_props$theme = props.theme) == null ? void 0 : _props$theme.unstable_sxConfig) != null ? _props$theme$unstable : defaultSxConfig$1;
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
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$u);
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
        if (!isPlainObject(result)) {
          return systemProps;
        }
        return _extends({}, systemProps, result);
      };
    } else {
      finalSx = _extends({}, systemProps, inSx);
    }
    return _extends({}, otherProps, {
      sx: finalSx
    });
  }
  function r(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2)
      n2 += e2;
    else if ("object" == typeof e2)
      if (Array.isArray(e2))
        for (t2 = 0; t2 < e2.length; t2++)
          e2[t2] && (f2 = r(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
      else
        for (t2 in e2)
          e2[t2] && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function clsx() {
    for (var e2, t2, f2 = 0, n2 = ""; f2 < arguments.length; )
      (e2 = arguments[f2++]) && (t2 = r(e2)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  const _excluded$t = ["values", "unit", "step"];
  const sortBreakpointsValues = (values2) => {
    const breakpointsAsArray = Object.keys(values2).map((key) => ({
      key,
      val: values2[key]
    })) || [];
    breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
    return breakpointsAsArray.reduce((acc, obj) => {
      return _extends({}, acc, {
        [obj.key]: obj.val
      });
    }, {});
  };
  function createBreakpoints(breakpoints) {
    const {
      values: values2 = {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
      },
      unit = "px",
      step = 5
    } = breakpoints, other = _objectWithoutPropertiesLoose(breakpoints, _excluded$t);
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
    return _extends({
      keys,
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
  const _excluded$s = ["breakpoints", "palette", "spacing", "shape"];
  function createTheme$1(options = {}, ...args) {
    const {
      breakpoints: breakpointsInput = {},
      palette: paletteInput = {},
      spacing: spacingInput,
      shape: shapeInput = {}
    } = options, other = _objectWithoutPropertiesLoose(options, _excluded$s);
    const breakpoints = createBreakpoints(breakpointsInput);
    const spacing = createSpacing(spacingInput);
    let muiTheme = deepmerge({
      breakpoints,
      direction: "ltr",
      components: {},
      palette: _extends({
        mode: "light"
      }, paletteInput),
      spacing,
      shape: _extends({}, shape$1, shapeInput)
    }, other);
    muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = _extends({}, defaultSxConfig$1, other == null ? void 0 : other.unstable_sxConfig);
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx$1({
        sx: props,
        theme: this
      });
    };
    return muiTheme;
  }
  const ThemeContext = /* @__PURE__ */ React__namespace.createContext(null);
  const ThemeContext$1 = ThemeContext;
  function useTheme$3() {
    const theme2 = React__namespace.useContext(ThemeContext$1);
    return theme2;
  }
  const hasSymbol = typeof Symbol === "function" && Symbol.for;
  const nested = hasSymbol ? Symbol.for("mui.nested") : "__THEME_NESTED__";
  function mergeOuterLocalTheme(outerTheme, localTheme) {
    if (typeof localTheme === "function") {
      const mergedTheme = localTheme(outerTheme);
      return mergedTheme;
    }
    return _extends({}, outerTheme, localTheme);
  }
  function ThemeProvider$1(props) {
    const {
      children,
      theme: localTheme
    } = props;
    const outerTheme = useTheme$3();
    const theme2 = React__namespace.useMemo(() => {
      const output = outerTheme === null ? localTheme : mergeOuterLocalTheme(outerTheme, localTheme);
      if (output != null) {
        output[nested] = outerTheme !== null;
      }
      return output;
    }, [localTheme, outerTheme]);
    return /* @__PURE__ */ jsx(ThemeContext$1.Provider, {
      value: theme2,
      children
    });
  }
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  function useTheme$2(defaultTheme2 = null) {
    const contextTheme = useTheme$3();
    return !contextTheme || isObjectEmpty(contextTheme) ? defaultTheme2 : contextTheme;
  }
  const systemDefaultTheme$1 = createTheme$1();
  function useTheme$1(defaultTheme2 = systemDefaultTheme$1) {
    return useTheme$2(defaultTheme2);
  }
  const _excluded$r = ["variant"];
  function isEmpty$1(string) {
    return string.length === 0;
  }
  function propsToClassKey(props) {
    const {
      variant
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$r);
    let classKey = variant || "";
    Object.keys(other).sort().forEach((key) => {
      if (key === "color") {
        classKey += isEmpty$1(classKey) ? props[key] : capitalize(props[key]);
      } else {
        classKey += `${isEmpty$1(classKey) ? key : capitalize(key)}${capitalize(props[key].toString())}`;
      }
    });
    return classKey;
  }
  const _excluded$q = ["name", "slot", "skipVariantsResolver", "skipSx", "overridesResolver"], _excluded2$3 = ["theme"], _excluded3 = ["theme"];
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  function isStringTag(tag) {
    return typeof tag === "string" && tag.charCodeAt(0) > 96;
  }
  const getStyleOverrides = (name, theme2) => {
    if (theme2.components && theme2.components[name] && theme2.components[name].styleOverrides) {
      return theme2.components[name].styleOverrides;
    }
    return null;
  };
  const getVariantStyles = (name, theme2) => {
    let variants = [];
    if (theme2 && theme2.components && theme2.components[name] && theme2.components[name].variants) {
      variants = theme2.components[name].variants;
    }
    const variantsStyles = {};
    variants.forEach((definition) => {
      const key = propsToClassKey(definition.props);
      variantsStyles[key] = definition.style;
    });
    return variantsStyles;
  };
  const variantsResolver = (props, styles2, theme2, name) => {
    var _theme$components, _theme$components$nam;
    const {
      ownerState = {}
    } = props;
    const variantsStyles = [];
    const themeVariants = theme2 == null ? void 0 : (_theme$components = theme2.components) == null ? void 0 : (_theme$components$nam = _theme$components[name]) == null ? void 0 : _theme$components$nam.variants;
    if (themeVariants) {
      themeVariants.forEach((themeVariant) => {
        let isMatch = true;
        Object.keys(themeVariant.props).forEach((key) => {
          if (ownerState[key] !== themeVariant.props[key] && props[key] !== themeVariant.props[key]) {
            isMatch = false;
          }
        });
        if (isMatch) {
          variantsStyles.push(styles2[propsToClassKey(themeVariant.props)]);
        }
      });
    }
    return variantsStyles;
  };
  function shouldForwardProp(prop) {
    return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
  }
  const systemDefaultTheme = createTheme$1();
  function createStyled(input = {}) {
    const {
      defaultTheme: defaultTheme2 = systemDefaultTheme,
      rootShouldForwardProp: rootShouldForwardProp2 = shouldForwardProp,
      slotShouldForwardProp = shouldForwardProp
    } = input;
    const systemSx = (props) => {
      const theme2 = isEmpty(props.theme) ? defaultTheme2 : props.theme;
      return styleFunctionSx$1(_extends({}, props, {
        theme: theme2
      }));
    };
    systemSx.__mui_systemSx = true;
    return (tag, inputOptions = {}) => {
      internal_processStyles(tag, (styles2) => styles2.filter((style2) => !(style2 != null && style2.__mui_systemSx)));
      const {
        name: componentName,
        slot: componentSlot,
        skipVariantsResolver: inputSkipVariantsResolver,
        skipSx: inputSkipSx,
        overridesResolver: overridesResolver2
      } = inputOptions, options = _objectWithoutPropertiesLoose(inputOptions, _excluded$q);
      const skipVariantsResolver = inputSkipVariantsResolver !== void 0 ? inputSkipVariantsResolver : componentSlot && componentSlot !== "Root" || false;
      const skipSx = inputSkipSx || false;
      let label;
      let shouldForwardPropOption = shouldForwardProp;
      if (componentSlot === "Root") {
        shouldForwardPropOption = rootShouldForwardProp2;
      } else if (componentSlot) {
        shouldForwardPropOption = slotShouldForwardProp;
      } else if (isStringTag(tag)) {
        shouldForwardPropOption = void 0;
      }
      const defaultStyledResolver = styled$2(tag, _extends({
        shouldForwardProp: shouldForwardPropOption,
        label
      }, options));
      const muiStyledResolver = (styleArg, ...expressions) => {
        const expressionsWithDefaultTheme = expressions ? expressions.map((stylesArg) => {
          return typeof stylesArg === "function" && stylesArg.__emotion_real !== stylesArg ? (_ref) => {
            let {
              theme: themeInput
            } = _ref, other = _objectWithoutPropertiesLoose(_ref, _excluded2$3);
            return stylesArg(_extends({
              theme: isEmpty(themeInput) ? defaultTheme2 : themeInput
            }, other));
          } : stylesArg;
        }) : [];
        let transformedStyleArg = styleArg;
        if (componentName && overridesResolver2) {
          expressionsWithDefaultTheme.push((props) => {
            const theme2 = isEmpty(props.theme) ? defaultTheme2 : props.theme;
            const styleOverrides = getStyleOverrides(componentName, theme2);
            if (styleOverrides) {
              const resolvedStyleOverrides = {};
              Object.entries(styleOverrides).forEach(([slotKey, slotStyle]) => {
                resolvedStyleOverrides[slotKey] = typeof slotStyle === "function" ? slotStyle(_extends({}, props, {
                  theme: theme2
                })) : slotStyle;
              });
              return overridesResolver2(props, resolvedStyleOverrides);
            }
            return null;
          });
        }
        if (componentName && !skipVariantsResolver) {
          expressionsWithDefaultTheme.push((props) => {
            const theme2 = isEmpty(props.theme) ? defaultTheme2 : props.theme;
            return variantsResolver(props, getVariantStyles(componentName, theme2), theme2, componentName);
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
        } else if (typeof styleArg === "function" && styleArg.__emotion_real !== styleArg) {
          transformedStyleArg = (_ref2) => {
            let {
              theme: themeInput
            } = _ref2, other = _objectWithoutPropertiesLoose(_ref2, _excluded3);
            return styleArg(_extends({
              theme: isEmpty(themeInput) ? defaultTheme2 : themeInput
            }, other));
          };
        }
        const Component = defaultStyledResolver(transformedStyleArg, ...expressionsWithDefaultTheme);
        return Component;
      };
      if (defaultStyledResolver.withConfig) {
        muiStyledResolver.withConfig = defaultStyledResolver.withConfig;
      }
      return muiStyledResolver;
    };
  }
  function getThemeProps(params) {
    const {
      theme: theme2,
      name,
      props
    } = params;
    if (!theme2 || !theme2.components || !theme2.components[name] || !theme2.components[name].defaultProps) {
      return props;
    }
    return resolveProps(theme2.components[name].defaultProps, props);
  }
  function useThemeProps$1({
    props,
    name,
    defaultTheme: defaultTheme2
  }) {
    const theme2 = useTheme$1(defaultTheme2);
    const mergedProps = getThemeProps({
      theme: theme2,
      name,
      props
    });
    return mergedProps;
  }
  function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(min, value), max);
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
    if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
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
      if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(colorSpace) === -1) {
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
    value = clamp(value);
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
  function darken(color2, coefficient) {
    color2 = decomposeColor(color2);
    coefficient = clamp(coefficient);
    if (color2.type.indexOf("hsl") !== -1) {
      color2.values[2] *= 1 - coefficient;
    } else if (color2.type.indexOf("rgb") !== -1 || color2.type.indexOf("color") !== -1) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] *= 1 - coefficient;
      }
    }
    return recomposeColor(color2);
  }
  function lighten(color2, coefficient) {
    color2 = decomposeColor(color2);
    coefficient = clamp(coefficient);
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
    return recomposeColor(color2);
  }
  function emphasize(color2, coefficient = 0.15) {
    return getLuminance(color2) > 0.5 ? darken(color2, coefficient) : lighten(color2, coefficient);
  }
  const EMPTY_THEME = {};
  function InnerThemeProvider(props) {
    const theme2 = useTheme$1();
    return /* @__PURE__ */ jsx(ThemeContext$2.Provider, {
      value: typeof theme2 === "object" ? theme2 : EMPTY_THEME,
      children: props.children
    });
  }
  function ThemeProvider(props) {
    const {
      children,
      theme: localTheme
    } = props;
    return /* @__PURE__ */ jsx(ThemeProvider$1, {
      theme: localTheme,
      children: /* @__PURE__ */ jsx(InnerThemeProvider, {
        children
      })
    });
  }
  function createMixins(breakpoints, mixins) {
    return _extends({
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
  const _excluded$p = ["mode", "contrastThreshold", "tonalOffset"];
  const light = {
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)"
    },
    divider: "rgba(0, 0, 0, 0.12)",
    background: {
      paper: common$1.white,
      default: common$1.white
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.04)",
      hoverOpacity: 0.04,
      selected: "rgba(0, 0, 0, 0.08)",
      selectedOpacity: 0.08,
      disabled: "rgba(0, 0, 0, 0.26)",
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
        intent.light = lighten(intent.main, tonalOffsetLight);
      } else if (direction === "dark") {
        intent.dark = darken(intent.main, tonalOffsetDark);
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
      light: orange$1[500],
      dark: orange$1[900]
    };
  }
  function createPalette(palette) {
    const {
      mode = "light",
      contrastThreshold = 3,
      tonalOffset = 0.2
    } = palette, other = _objectWithoutPropertiesLoose(palette, _excluded$p);
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
      color2 = _extends({}, color2);
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
    const modes = {
      dark,
      light
    };
    const paletteOutput = deepmerge(_extends({
      common: _extends({}, common$1),
      mode,
      primary: augmentColor({
        color: primary,
        name: "primary"
      }),
      secondary: augmentColor({
        color: secondary,
        name: "secondary",
        mainShade: "A400",
        lightShade: "A200",
        darkShade: "A700"
      }),
      error: augmentColor({
        color: error,
        name: "error"
      }),
      warning: augmentColor({
        color: warning,
        name: "warning"
      }),
      info: augmentColor({
        color: info,
        name: "info"
      }),
      success: augmentColor({
        color: success,
        name: "success"
      }),
      grey: grey$1,
      contrastThreshold,
      getContrastText,
      augmentColor,
      tonalOffset
    }, modes[mode]), other);
    return paletteOutput;
  }
  const _excluded$o = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
  function round(value) {
    return Math.round(value * 1e5) / 1e5;
  }
  const caseAllCaps = {
    textTransform: "uppercase"
  };
  const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
  function createTypography(palette, typography) {
    const _ref = typeof typography === "function" ? typography(palette) : typography, {
      fontFamily = defaultFontFamily,
      fontSize: fontSize2 = 14,
      fontWeightLight = 300,
      fontWeightRegular = 400,
      fontWeightMedium = 500,
      fontWeightBold = 700,
      htmlFontSize: htmlFontSize2 = 16,
      allVariants,
      pxToRem: pxToRem2
    } = _ref, other = _objectWithoutPropertiesLoose(_ref, _excluded$o);
    const coef = fontSize2 / 14;
    const pxToRem = pxToRem2 || ((size) => `${size / htmlFontSize2 * coef}rem`);
    const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => _extends({
      fontFamily,
      fontWeight,
      fontSize: pxToRem(size),
      lineHeight
    }, fontFamily === defaultFontFamily ? {
      letterSpacing: `${round(letterSpacing / size)}em`
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
      inherit: {
        fontFamily: "inherit",
        fontWeight: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit"
      }
    };
    return deepmerge(_extends({
      htmlFontSize: htmlFontSize2,
      pxToRem,
      fontFamily,
      fontSize: fontSize2,
      fontWeightLight,
      fontWeightRegular,
      fontWeightMedium,
      fontWeightBold
    }, variants), other, {
      clone: false
    });
  }
  const shadowKeyUmbraOpacity = 0.2;
  const shadowKeyPenumbraOpacity = 0.14;
  const shadowAmbientShadowOpacity = 0.12;
  function createShadow(...px) {
    return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(",");
  }
  const shadows = ["none", createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
  const shadows$1 = shadows;
  const _excluded$n = ["duration", "easing", "delay"];
  const easing = {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
  };
  const duration = {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
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
    return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
  }
  function createTransitions(inputTransitions) {
    const mergedEasing = _extends({}, easing, inputTransitions.easing);
    const mergedDuration = _extends({}, duration, inputTransitions.duration);
    const create = (props = ["all"], options = {}) => {
      const {
        duration: durationOption = mergedDuration.standard,
        easing: easingOption = mergedEasing.easeInOut,
        delay = 0
      } = options;
      _objectWithoutPropertiesLoose(options, _excluded$n);
      return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
    };
    return _extends({
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
  const _excluded$m = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
  function createTheme(options = {}, ...args) {
    const {
      mixins: mixinsInput = {},
      palette: paletteInput = {},
      transitions: transitionsInput = {},
      typography: typographyInput = {}
    } = options, other = _objectWithoutPropertiesLoose(options, _excluded$m);
    if (options.vars) {
      throw new Error(formatMuiErrorMessage(18));
    }
    const palette = createPalette(paletteInput);
    const systemTheme = createTheme$1(options);
    let muiTheme = deepmerge(systemTheme, {
      mixins: createMixins(systemTheme.breakpoints, mixinsInput),
      palette,
      shadows: shadows$1.slice(),
      typography: createTypography(palette, typographyInput),
      transitions: createTransitions(transitionsInput),
      zIndex: _extends({}, zIndex$1)
    });
    muiTheme = deepmerge(muiTheme, other);
    muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = _extends({}, defaultSxConfig$1, other == null ? void 0 : other.unstable_sxConfig);
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx$1({
        sx: props,
        theme: this
      });
    };
    return muiTheme;
  }
  var client = {};
  var m = ReactDOM__default.default;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var AutoFixHigh = {};
  var interopRequireDefault = { exports: {} };
  (function(module) {
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : {
        "default": obj
      };
    }
    module.exports = _interopRequireDefault2, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(interopRequireDefault);
  var createSvgIcon$1 = {};
  function isHostComponent(element) {
    return typeof element === "string";
  }
  function appendOwnerState(elementType, otherProps, ownerState) {
    if (elementType === void 0 || isHostComponent(elementType)) {
      return otherProps;
    }
    return _extends({}, otherProps, {
      ownerState: _extends({}, otherProps.ownerState, ownerState)
    });
  }
  const defaultContextValue = {
    disableDefaultClasses: false
  };
  const ClassNameConfiguratorContext = /* @__PURE__ */ React__namespace.createContext(defaultContextValue);
  function useClassNamesOverride(generateUtilityClass2) {
    const {
      disableDefaultClasses
    } = React__namespace.useContext(ClassNameConfiguratorContext);
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
  function resolveComponentProps(componentProps, ownerState) {
    if (typeof componentProps === "function") {
      return componentProps(ownerState);
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
      const joinedClasses2 = clsx(externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className, className, additionalProps == null ? void 0 : additionalProps.className);
      const mergedStyle2 = _extends({}, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
      const props2 = _extends({}, additionalProps, externalForwardedProps, externalSlotProps);
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
    const eventHandlers = extractEventHandlers(_extends({}, externalForwardedProps, externalSlotProps));
    const componentsPropsWithoutEventHandlers = omitEventHandlers(externalSlotProps);
    const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps);
    const internalSlotProps = getSlotProps(eventHandlers);
    const joinedClasses = clsx(internalSlotProps == null ? void 0 : internalSlotProps.className, additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
    const mergedStyle = _extends({}, internalSlotProps == null ? void 0 : internalSlotProps.style, additionalProps == null ? void 0 : additionalProps.style, externalForwardedProps == null ? void 0 : externalForwardedProps.style, externalSlotProps == null ? void 0 : externalSlotProps.style);
    const props = _extends({}, internalSlotProps, additionalProps, otherPropsWithoutEventHandlers, componentsPropsWithoutEventHandlers);
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
  const _excluded$l = ["elementType", "externalSlotProps", "ownerState"];
  function useSlotProps(parameters) {
    var _parameters$additiona;
    const {
      elementType,
      externalSlotProps,
      ownerState
    } = parameters, rest = _objectWithoutPropertiesLoose(parameters, _excluded$l);
    const resolvedComponentsProps = resolveComponentProps(externalSlotProps, ownerState);
    const {
      props: mergedProps,
      internalRef
    } = mergeSlotProps(_extends({}, rest, {
      externalSlotProps: resolvedComponentsProps
    }));
    const ref = useForkRef(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, (_parameters$additiona = parameters.additionalProps) == null ? void 0 : _parameters$additiona.ref);
    const props = appendOwnerState(elementType, _extends({}, mergedProps, {
      ref
    }), ownerState);
    return props;
  }
  function mapEventPropToEvent(eventProp) {
    return eventProp.substring(2).toLowerCase();
  }
  function clickedRootScrollbar(event, doc) {
    return doc.documentElement.clientWidth < event.clientX || doc.documentElement.clientHeight < event.clientY;
  }
  function ClickAwayListener(props) {
    const {
      children,
      disableReactTree = false,
      mouseEvent = "onClick",
      onClickAway,
      touchEvent = "onTouchEnd"
    } = props;
    const movedRef = React__namespace.useRef(false);
    const nodeRef = React__namespace.useRef(null);
    const activatedRef = React__namespace.useRef(false);
    const syntheticEventRef = React__namespace.useRef(false);
    React__namespace.useEffect(() => {
      setTimeout(() => {
        activatedRef.current = true;
      }, 0);
      return () => {
        activatedRef.current = false;
      };
    }, []);
    const handleRef = useForkRef(
      children.ref,
      nodeRef
    );
    const handleClickAway = useEventCallback((event) => {
      const insideReactTree = syntheticEventRef.current;
      syntheticEventRef.current = false;
      const doc = ownerDocument(nodeRef.current);
      if (!activatedRef.current || !nodeRef.current || "clientX" in event && clickedRootScrollbar(event, doc)) {
        return;
      }
      if (movedRef.current) {
        movedRef.current = false;
        return;
      }
      let insideDOM;
      if (event.composedPath) {
        insideDOM = event.composedPath().indexOf(nodeRef.current) > -1;
      } else {
        insideDOM = !doc.documentElement.contains(
          event.target
        ) || nodeRef.current.contains(
          event.target
        );
      }
      if (!insideDOM && (disableReactTree || !insideReactTree)) {
        onClickAway(event);
      }
    });
    const createHandleSynthetic = (handlerName) => (event) => {
      syntheticEventRef.current = true;
      const childrenPropsHandler = children.props[handlerName];
      if (childrenPropsHandler) {
        childrenPropsHandler(event);
      }
    };
    const childrenProps = {
      ref: handleRef
    };
    if (touchEvent !== false) {
      childrenProps[touchEvent] = createHandleSynthetic(touchEvent);
    }
    React__namespace.useEffect(() => {
      if (touchEvent !== false) {
        const mappedTouchEvent = mapEventPropToEvent(touchEvent);
        const doc = ownerDocument(nodeRef.current);
        const handleTouchMove = () => {
          movedRef.current = true;
        };
        doc.addEventListener(mappedTouchEvent, handleClickAway);
        doc.addEventListener("touchmove", handleTouchMove);
        return () => {
          doc.removeEventListener(mappedTouchEvent, handleClickAway);
          doc.removeEventListener("touchmove", handleTouchMove);
        };
      }
      return void 0;
    }, [handleClickAway, touchEvent]);
    if (mouseEvent !== false) {
      childrenProps[mouseEvent] = createHandleSynthetic(mouseEvent);
    }
    React__namespace.useEffect(() => {
      if (mouseEvent !== false) {
        const mappedMouseEvent = mapEventPropToEvent(mouseEvent);
        const doc = ownerDocument(nodeRef.current);
        doc.addEventListener(mappedMouseEvent, handleClickAway);
        return () => {
          doc.removeEventListener(mappedMouseEvent, handleClickAway);
        };
      }
      return void 0;
    }, [handleClickAway, mouseEvent]);
    return /* @__PURE__ */ jsx(React__namespace.Fragment, {
      children: /* @__PURE__ */ React__namespace.cloneElement(children, childrenProps)
    });
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
    const handleRef = useForkRef(children.ref, rootRef);
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
      const contain = (nativeEvent) => {
        const {
          current: rootElement
        } = rootRef;
        if (rootElement === null) {
          return;
        }
        if (!doc.hasFocus() || disableEnforceFocus || !isEnabled() || ignoreNextEnforceFocus.current) {
          ignoreNextEnforceFocus.current = false;
          return;
        }
        if (!rootElement.contains(doc.activeElement)) {
          if (nativeEvent && reactFocusEventTarget.current !== nativeEvent.target || doc.activeElement !== reactFocusEventTarget.current) {
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
        }
      };
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
      doc.addEventListener("focusin", contain);
      doc.addEventListener("keydown", loopFocus, true);
      const interval = setInterval(() => {
        if (doc.activeElement && doc.activeElement.tagName === "BODY") {
          contain(null);
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
    return /* @__PURE__ */ jsxs(React__namespace.Fragment, {
      children: [/* @__PURE__ */ jsx("div", {
        tabIndex: open ? 0 : -1,
        onFocus: handleFocusSentinel,
        ref: sentinelStart,
        "data-testid": "sentinelStart"
      }), /* @__PURE__ */ React__namespace.cloneElement(children, {
        ref: handleRef,
        onFocus
      }), /* @__PURE__ */ jsx("div", {
        tabIndex: open ? 0 : -1,
        onFocus: handleFocusSentinel,
        ref: sentinelEnd,
        "data-testid": "sentinelEnd"
      })]
    });
  }
  function getContainer$1(container2) {
    return typeof container2 === "function" ? container2() : container2;
  }
  const Portal = /* @__PURE__ */ React__namespace.forwardRef(function Portal2(props, ref) {
    const {
      children,
      container: container2,
      disablePortal = false
    } = props;
    const [mountNode, setMountNode] = React__namespace.useState(null);
    const handleRef = useForkRef(/* @__PURE__ */ React__namespace.isValidElement(children) ? children.ref : null, ref);
    useEnhancedEffect$1(() => {
      if (!disablePortal) {
        setMountNode(getContainer$1(container2) || document.body);
      }
    }, [container2, disablePortal]);
    useEnhancedEffect$1(() => {
      if (mountNode && !disablePortal) {
        setRef(ref, mountNode);
        return () => {
          setRef(ref, null);
        };
      }
      return void 0;
    }, [ref, mountNode, disablePortal]);
    if (disablePortal) {
      if (/* @__PURE__ */ React__namespace.isValidElement(children)) {
        const newProps = {
          ref: handleRef
        };
        return /* @__PURE__ */ React__namespace.cloneElement(children, newProps);
      }
      return /* @__PURE__ */ jsx(React__namespace.Fragment, {
        children
      });
    }
    return /* @__PURE__ */ jsx(React__namespace.Fragment, {
      children: mountNode ? /* @__PURE__ */ ReactDOM__namespace.createPortal(children, mountNode) : mountNode
    });
  });
  const Portal$1 = Portal;
  function isOverflowing(container2) {
    const doc = ownerDocument(container2);
    if (doc.body === container2) {
      return ownerWindow(container2).innerWidth > doc.documentElement.clientWidth;
    }
    return container2.scrollHeight > container2.clientHeight;
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
  function ariaHiddenSiblings(container2, mountElement, currentElement, elementsToExclude, show) {
    const blacklist = [mountElement, currentElement, ...elementsToExclude];
    [].forEach.call(container2.children, (element) => {
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
    const container2 = containerInfo.container;
    if (!props.disableScrollLock) {
      if (isOverflowing(container2)) {
        const scrollbarSize = getScrollbarSize(ownerDocument(container2));
        restoreStyle.push({
          value: container2.style.paddingRight,
          property: "padding-right",
          el: container2
        });
        container2.style.paddingRight = `${getPaddingRight(container2) + scrollbarSize}px`;
        const fixedElements2 = ownerDocument(container2).querySelectorAll(".mui-fixed");
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
      if (container2.parentNode instanceof DocumentFragment) {
        scrollContainer = ownerDocument(container2).body;
      } else {
        const parent = container2.parentElement;
        const containerWindow = ownerWindow(container2);
        scrollContainer = (parent == null ? void 0 : parent.nodeName) === "HTML" && containerWindow.getComputedStyle(parent).overflowY === "scroll" ? parent : container2;
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
  function getHiddenSiblings(container2) {
    const hiddenSiblings = [];
    [].forEach.call(container2.children, (element) => {
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
    add(modal, container2) {
      let modalIndex = this.modals.indexOf(modal);
      if (modalIndex !== -1) {
        return modalIndex;
      }
      modalIndex = this.modals.length;
      this.modals.push(modal);
      if (modal.modalRef) {
        ariaHidden(modal.modalRef, false);
      }
      const hiddenSiblings = getHiddenSiblings(container2);
      ariaHiddenSiblings(container2, modal.mount, modal.modalRef, hiddenSiblings, true);
      const containerIndex = findIndexOf(this.containers, (item) => item.container === container2);
      if (containerIndex !== -1) {
        this.containers[containerIndex].modals.push(modal);
        return modalIndex;
      }
      this.containers.push({
        modals: [modal],
        container: container2,
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
  function getModalUtilityClass(slot) {
    return generateUtilityClass("MuiModal", slot);
  }
  generateUtilityClasses("MuiModal", ["root", "hidden", "backdrop"]);
  const _excluded$k = ["children", "closeAfterTransition", "component", "container", "disableAutoFocus", "disableEnforceFocus", "disableEscapeKeyDown", "disablePortal", "disableRestoreFocus", "disableScrollLock", "hideBackdrop", "keepMounted", "manager", "onBackdropClick", "onClose", "onKeyDown", "open", "onTransitionEnter", "onTransitionExited", "slotProps", "slots"];
  const useUtilityClasses$f = (ownerState) => {
    const {
      open,
      exited
    } = ownerState;
    const slots = {
      root: ["root", !open && exited && "hidden"],
      backdrop: ["backdrop"]
    };
    return composeClasses(slots, useClassNamesOverride(getModalUtilityClass));
  };
  function getContainer(container2) {
    return typeof container2 === "function" ? container2() : container2;
  }
  function getHasTransition(children) {
    return children ? children.props.hasOwnProperty("in") : false;
  }
  const defaultManager = new ModalManager();
  const ModalUnstyled = /* @__PURE__ */ React__namespace.forwardRef(function ModalUnstyled2(props, forwardedRef) {
    var _props$ariaHidden, _ref;
    const {
      children,
      closeAfterTransition = false,
      component,
      container: container2,
      disableAutoFocus = false,
      disableEnforceFocus = false,
      disableEscapeKeyDown = false,
      disablePortal = false,
      disableRestoreFocus = false,
      disableScrollLock = false,
      hideBackdrop = false,
      keepMounted = false,
      manager = defaultManager,
      onBackdropClick,
      onClose,
      onKeyDown,
      open,
      onTransitionEnter,
      onTransitionExited,
      slotProps = {},
      slots = {}
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$k);
    const [exited, setExited] = React__namespace.useState(!open);
    const modal = React__namespace.useRef({});
    const mountNodeRef = React__namespace.useRef(null);
    const modalRef = React__namespace.useRef(null);
    const handleRef = useForkRef(modalRef, forwardedRef);
    const hasTransition = getHasTransition(children);
    const ariaHiddenProp = (_props$ariaHidden = props["aria-hidden"]) != null ? _props$ariaHidden : true;
    const getDoc = () => ownerDocument(mountNodeRef.current);
    const getModal = () => {
      modal.current.modalRef = modalRef.current;
      modal.current.mountNode = mountNodeRef.current;
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
      const resolvedContainer = getContainer(container2) || getDoc().body;
      manager.add(getModal(), resolvedContainer);
      if (modalRef.current) {
        handleMounted();
      }
    });
    const isTopModal = React__namespace.useCallback(() => manager.isTopModal(getModal()), [manager]);
    const handlePortalRef = useEventCallback((node2) => {
      mountNodeRef.current = node2;
      if (!node2 || !modalRef.current) {
        return;
      }
      if (open && isTopModal()) {
        handleMounted();
      } else {
        ariaHidden(modalRef.current, ariaHiddenProp);
      }
    });
    const handleClose = React__namespace.useCallback(() => {
      manager.remove(getModal(), ariaHiddenProp);
    }, [manager, ariaHiddenProp]);
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
    const ownerState = _extends({}, props, {
      closeAfterTransition,
      disableAutoFocus,
      disableEnforceFocus,
      disableEscapeKeyDown,
      disablePortal,
      disableRestoreFocus,
      disableScrollLock,
      exited,
      hideBackdrop,
      keepMounted
    });
    const classes = useUtilityClasses$f(ownerState);
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
    const handleBackdropClick = (event) => {
      if (event.target !== event.currentTarget) {
        return;
      }
      if (onBackdropClick) {
        onBackdropClick(event);
      }
      if (onClose) {
        onClose(event, "backdropClick");
      }
    };
    const handleKeyDown2 = (event) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
      if (event.key !== "Escape" || !isTopModal()) {
        return;
      }
      if (!disableEscapeKeyDown) {
        event.stopPropagation();
        if (onClose) {
          onClose(event, "escapeKeyDown");
        }
      }
    };
    const childProps = {};
    if (children.props.tabIndex === void 0) {
      childProps.tabIndex = "-1";
    }
    if (hasTransition) {
      childProps.onEnter = createChainedFunction(handleEnter, children.props.onEnter);
      childProps.onExited = createChainedFunction(handleExited, children.props.onExited);
    }
    const Root = (_ref = component != null ? component : slots.root) != null ? _ref : "div";
    const rootProps = useSlotProps({
      elementType: Root,
      externalSlotProps: slotProps.root,
      externalForwardedProps: other,
      additionalProps: {
        ref: handleRef,
        role: "presentation",
        onKeyDown: handleKeyDown2
      },
      className: classes.root,
      ownerState
    });
    const BackdropComponent = slots.backdrop;
    const backdropProps = useSlotProps({
      elementType: BackdropComponent,
      externalSlotProps: slotProps.backdrop,
      additionalProps: {
        "aria-hidden": true,
        onClick: handleBackdropClick,
        open
      },
      className: classes.backdrop,
      ownerState
    });
    if (!keepMounted && !open && (!hasTransition || exited)) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      Portal$1,
      {
        ref: handlePortalRef,
        container: container2,
        disablePortal,
        children: /* @__PURE__ */ jsxs(Root, _extends({}, rootProps, {
          children: [!hideBackdrop && BackdropComponent ? /* @__PURE__ */ jsx(BackdropComponent, _extends({}, backdropProps)) : null, /* @__PURE__ */ jsx(FocusTrap, {
            disableEnforceFocus,
            disableAutoFocus,
            disableRestoreFocus,
            isEnabled: isTopModal,
            open,
            children: /* @__PURE__ */ React__namespace.cloneElement(children, childProps)
          })]
        }))
      }
    );
  });
  const ModalUnstyled$1 = ModalUnstyled;
  function useSnackbar(parameters) {
    const {
      autoHideDuration = null,
      disableWindowBlurListener = false,
      onClose,
      open,
      ref,
      resumeHideDuration
    } = parameters;
    const timerAutoHide = React__namespace.useRef();
    React__namespace.useEffect(() => {
      if (!open) {
        return void 0;
      }
      function handleKeyDown2(nativeEvent) {
        if (!nativeEvent.defaultPrevented) {
          if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
            onClose == null ? void 0 : onClose(nativeEvent, "escapeKeyDown");
          }
        }
      }
      document.addEventListener("keydown", handleKeyDown2);
      return () => {
        document.removeEventListener("keydown", handleKeyDown2);
      };
    }, [open, onClose]);
    const handleClose = useEventCallback((event, reason) => {
      onClose == null ? void 0 : onClose(event, reason);
    });
    const setAutoHideTimer = useEventCallback((autoHideDurationParam) => {
      if (!onClose || autoHideDurationParam == null) {
        return;
      }
      clearTimeout(timerAutoHide.current);
      timerAutoHide.current = setTimeout(() => {
        handleClose(null, "timeout");
      }, autoHideDurationParam);
    });
    React__namespace.useEffect(() => {
      if (open) {
        setAutoHideTimer(autoHideDuration);
      }
      return () => {
        clearTimeout(timerAutoHide.current);
      };
    }, [open, autoHideDuration, setAutoHideTimer]);
    const handleClickAway = (event) => {
      onClose == null ? void 0 : onClose(event, "clickaway");
    };
    const handlePause = () => {
      clearTimeout(timerAutoHide.current);
    };
    const handleResume = React__namespace.useCallback(() => {
      if (autoHideDuration != null) {
        setAutoHideTimer(resumeHideDuration != null ? resumeHideDuration : autoHideDuration * 0.5);
      }
    }, [autoHideDuration, resumeHideDuration, setAutoHideTimer]);
    const createHandleBlur = (otherHandlers) => (event) => {
      const onBlurCallback = otherHandlers.onBlur;
      onBlurCallback == null ? void 0 : onBlurCallback(event);
      handleResume();
    };
    const createHandleFocus = (otherHandlers) => (event) => {
      const onFocusCallback = otherHandlers.onFocus;
      onFocusCallback == null ? void 0 : onFocusCallback(event);
      handlePause();
    };
    const createMouseEnter = (otherHandlers) => (event) => {
      const onMouseEnterCallback = otherHandlers.onMouseEnter;
      onMouseEnterCallback == null ? void 0 : onMouseEnterCallback(event);
      handlePause();
    };
    const createMouseLeave = (otherHandlers) => (event) => {
      const onMouseLeaveCallback = otherHandlers.onMouseLeave;
      onMouseLeaveCallback == null ? void 0 : onMouseLeaveCallback(event);
      handleResume();
    };
    React__namespace.useEffect(() => {
      if (!disableWindowBlurListener && open) {
        window.addEventListener("focus", handleResume);
        window.addEventListener("blur", handlePause);
        return () => {
          window.removeEventListener("focus", handleResume);
          window.removeEventListener("blur", handlePause);
        };
      }
      return void 0;
    }, [disableWindowBlurListener, handleResume, open]);
    const getRootProps = (otherHandlers = {}) => {
      const propsEventHandlers = extractEventHandlers(parameters);
      const externalEventHandlers = _extends({}, propsEventHandlers, otherHandlers);
      return _extends({
        ref,
        role: "presentation"
      }, externalEventHandlers, {
        onBlur: createHandleBlur(externalEventHandlers),
        onFocus: createHandleFocus(externalEventHandlers),
        onMouseEnter: createMouseEnter(externalEventHandlers),
        onMouseLeave: createMouseLeave(externalEventHandlers)
      });
    };
    return {
      getRootProps,
      onClickAway: handleClickAway
    };
  }
  const defaultTheme = createTheme();
  const defaultTheme$1 = defaultTheme;
  function useThemeProps({
    props,
    name
  }) {
    return useThemeProps$1({
      props,
      name,
      defaultTheme: defaultTheme$1
    });
  }
  const rootShouldForwardProp = (prop) => shouldForwardProp(prop) && prop !== "classes";
  const styled = createStyled({
    defaultTheme: defaultTheme$1,
    rootShouldForwardProp
  });
  const styled$1 = styled;
  function getSvgIconUtilityClass(slot) {
    return generateUtilityClass("MuiSvgIcon", slot);
  }
  generateUtilityClasses("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);
  const _excluded$j = ["children", "className", "color", "component", "fontSize", "htmlColor", "inheritViewBox", "titleAccess", "viewBox"];
  const useUtilityClasses$e = (ownerState) => {
    const {
      color: color2,
      fontSize: fontSize2,
      classes
    } = ownerState;
    const slots = {
      root: ["root", color2 !== "inherit" && `color${capitalize(color2)}`, `fontSize${capitalize(fontSize2)}`]
    };
    return composeClasses(slots, getSvgIconUtilityClass, classes);
  };
  const SvgIconRoot = styled$1("svg", {
    name: "MuiSvgIcon",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "inherit" && styles2[`color${capitalize(ownerState.color)}`], styles2[`fontSize${capitalize(ownerState.fontSize)}`]];
    }
  })(({
    theme: theme2,
    ownerState
  }) => {
    var _theme$transitions, _theme$transitions$cr, _theme$transitions2, _theme$transitions2$d, _theme$typography, _theme$typography$pxT, _theme$typography2, _theme$typography2$px, _theme$typography3, _theme$typography3$px, _palette$ownerState$c, _palette, _palette$ownerState$c2, _palette2, _palette2$action, _palette3, _palette3$action;
    return {
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      fill: "currentColor",
      flexShrink: 0,
      transition: (_theme$transitions = theme2.transitions) == null ? void 0 : (_theme$transitions$cr = _theme$transitions.create) == null ? void 0 : _theme$transitions$cr.call(_theme$transitions, "fill", {
        duration: (_theme$transitions2 = theme2.transitions) == null ? void 0 : (_theme$transitions2$d = _theme$transitions2.duration) == null ? void 0 : _theme$transitions2$d.shorter
      }),
      fontSize: {
        inherit: "inherit",
        small: ((_theme$typography = theme2.typography) == null ? void 0 : (_theme$typography$pxT = _theme$typography.pxToRem) == null ? void 0 : _theme$typography$pxT.call(_theme$typography, 20)) || "1.25rem",
        medium: ((_theme$typography2 = theme2.typography) == null ? void 0 : (_theme$typography2$px = _theme$typography2.pxToRem) == null ? void 0 : _theme$typography2$px.call(_theme$typography2, 24)) || "1.5rem",
        large: ((_theme$typography3 = theme2.typography) == null ? void 0 : (_theme$typography3$px = _theme$typography3.pxToRem) == null ? void 0 : _theme$typography3$px.call(_theme$typography3, 35)) || "2.1875rem"
      }[ownerState.fontSize],
      color: (_palette$ownerState$c = (_palette = (theme2.vars || theme2).palette) == null ? void 0 : (_palette$ownerState$c2 = _palette[ownerState.color]) == null ? void 0 : _palette$ownerState$c2.main) != null ? _palette$ownerState$c : {
        action: (_palette2 = (theme2.vars || theme2).palette) == null ? void 0 : (_palette2$action = _palette2.action) == null ? void 0 : _palette2$action.active,
        disabled: (_palette3 = (theme2.vars || theme2).palette) == null ? void 0 : (_palette3$action = _palette3.action) == null ? void 0 : _palette3$action.disabled,
        inherit: void 0
      }[ownerState.color]
    };
  });
  const SvgIcon = /* @__PURE__ */ React__namespace.forwardRef(function SvgIcon2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiSvgIcon"
    });
    const {
      children,
      className,
      color: color2 = "inherit",
      component = "svg",
      fontSize: fontSize2 = "medium",
      htmlColor,
      inheritViewBox = false,
      titleAccess,
      viewBox = "0 0 24 24"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$j);
    const ownerState = _extends({}, props, {
      color: color2,
      component,
      fontSize: fontSize2,
      instanceFontSize: inProps.fontSize,
      inheritViewBox,
      viewBox
    });
    const more = {};
    if (!inheritViewBox) {
      more.viewBox = viewBox;
    }
    const classes = useUtilityClasses$e(ownerState);
    return /* @__PURE__ */ jsxs(SvgIconRoot, _extends({
      as: component,
      className: clsx(classes.root, className),
      focusable: "false",
      color: htmlColor,
      "aria-hidden": titleAccess ? void 0 : true,
      role: titleAccess ? "img" : void 0,
      ref
    }, more, other, {
      ownerState,
      children: [children, titleAccess ? /* @__PURE__ */ jsx("title", {
        children: titleAccess
      }) : null]
    }));
  });
  SvgIcon.muiName = "SvgIcon";
  const SvgIcon$1 = SvgIcon;
  function createSvgIcon(path, displayName) {
    function Component(props, ref) {
      return /* @__PURE__ */ jsx(SvgIcon$1, _extends({
        "data-testid": `${displayName}Icon`,
        ref
      }, props, {
        children: path
      }));
    }
    Component.muiName = SvgIcon$1.muiName;
    return /* @__PURE__ */ React__namespace.memo(/* @__PURE__ */ React__namespace.forwardRef(Component));
  }
  const unstable_ClassNameGenerator = {
    configure: (generator) => {
      ClassNameGenerator$1.configure(generator);
    }
  };
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    unstable_ClassNameGenerator,
    capitalize,
    createChainedFunction,
    createSvgIcon,
    debounce,
    deprecatedPropType,
    isMuiElement,
    ownerDocument,
    ownerWindow,
    requirePropFactory,
    setRef,
    unstable_useEnhancedEffect: useEnhancedEffect$1,
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
  const require$$2 = /* @__PURE__ */ getAugmentedNamespace(jsxRuntime);
  var _interopRequireDefault$1 = interopRequireDefault.exports;
  Object.defineProperty(AutoFixHigh, "__esModule", {
    value: true
  });
  var default_1$1 = AutoFixHigh.default = void 0;
  var _createSvgIcon$1 = _interopRequireDefault$1(requireCreateSvgIcon());
  var _jsxRuntime$1 = require$$2;
  var _default$1 = (0, _createSvgIcon$1.default)(/* @__PURE__ */ (0, _jsxRuntime$1.jsx)("path", {
    d: "M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"
  }), "AutoFixHigh");
  default_1$1 = AutoFixHigh.default = _default$1;
  var ContentCopy = {};
  var _interopRequireDefault = interopRequireDefault.exports;
  Object.defineProperty(ContentCopy, "__esModule", {
    value: true
  });
  var default_1 = ContentCopy.default = void 0;
  var _createSvgIcon = _interopRequireDefault(requireCreateSvgIcon());
  var _jsxRuntime = require$$2;
  var _default = (0, _createSvgIcon.default)(/* @__PURE__ */ (0, _jsxRuntime.jsx)("path", {
    d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
  }), "ContentCopy");
  default_1 = ContentCopy.default = _default;
  const getOverlayAlpha = (elevation) => {
    let alphaValue;
    if (elevation < 1) {
      alphaValue = 5.11916 * elevation ** 2;
    } else {
      alphaValue = 4.5 * Math.log(elevation + 1) + 2;
    }
    return (alphaValue / 100).toFixed(2);
  };
  const getOverlayAlpha$1 = getOverlayAlpha;
  function useTheme() {
    const theme2 = useTheme$1(defaultTheme$1);
    return theme2;
  }
  function getPaperUtilityClass(slot) {
    return generateUtilityClass("MuiPaper", slot);
  }
  generateUtilityClasses("MuiPaper", ["root", "rounded", "outlined", "elevation", "elevation0", "elevation1", "elevation2", "elevation3", "elevation4", "elevation5", "elevation6", "elevation7", "elevation8", "elevation9", "elevation10", "elevation11", "elevation12", "elevation13", "elevation14", "elevation15", "elevation16", "elevation17", "elevation18", "elevation19", "elevation20", "elevation21", "elevation22", "elevation23", "elevation24"]);
  const _excluded$i = ["className", "component", "elevation", "square", "variant"];
  const useUtilityClasses$d = (ownerState) => {
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
  const PaperRoot = styled$1("div", {
    name: "MuiPaper",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], !ownerState.square && styles2.rounded, ownerState.variant === "elevation" && styles2[`elevation${ownerState.elevation}`]];
    }
  })(({
    theme: theme2,
    ownerState
  }) => {
    var _theme$vars$overlays;
    return _extends({
      backgroundColor: (theme2.vars || theme2).palette.background.paper,
      color: (theme2.vars || theme2).palette.text.primary,
      transition: theme2.transitions.create("box-shadow")
    }, !ownerState.square && {
      borderRadius: theme2.shape.borderRadius
    }, ownerState.variant === "outlined" && {
      border: `1px solid ${(theme2.vars || theme2).palette.divider}`
    }, ownerState.variant === "elevation" && _extends({
      boxShadow: (theme2.vars || theme2).shadows[ownerState.elevation]
    }, !theme2.vars && theme2.palette.mode === "dark" && {
      backgroundImage: `linear-gradient(${alpha("#fff", getOverlayAlpha$1(ownerState.elevation))}, ${alpha("#fff", getOverlayAlpha$1(ownerState.elevation))})`
    }, theme2.vars && {
      backgroundImage: (_theme$vars$overlays = theme2.vars.overlays) == null ? void 0 : _theme$vars$overlays[ownerState.elevation]
    }));
  });
  const Paper = /* @__PURE__ */ React__namespace.forwardRef(function Paper2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiPaper"
    });
    const {
      className,
      component = "div",
      elevation = 1,
      square = false,
      variant = "elevation"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$i);
    const ownerState = _extends({}, props, {
      component,
      elevation,
      square,
      variant
    });
    const classes = useUtilityClasses$d(ownerState);
    return /* @__PURE__ */ jsx(PaperRoot, _extends({
      as: component,
      ownerState,
      className: clsx(classes.root, className),
      ref
    }, other));
  });
  const Paper$1 = Paper;
  function getAlertUtilityClass(slot) {
    return generateUtilityClass("MuiAlert", slot);
  }
  const alertClasses = generateUtilityClasses("MuiAlert", ["root", "action", "icon", "message", "filled", "filledSuccess", "filledInfo", "filledWarning", "filledError", "outlined", "outlinedSuccess", "outlinedInfo", "outlinedWarning", "outlinedError", "standard", "standardSuccess", "standardInfo", "standardWarning", "standardError"]);
  const alertClasses$1 = alertClasses;
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
  const TransitionGroupContext = React__default.default.createContext(null);
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
      var timeout = this.props.timeout;
      var exit, enter, appear;
      exit = enter = appear = timeout;
      if (timeout != null && typeof timeout !== "number") {
        exit = timeout.exit;
        enter = timeout.enter;
        appear = timeout.appear !== void 0 ? timeout.appear : enter;
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
            var node2 = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM__default.default.findDOMNode(this);
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
      var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM__default.default.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
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
      var maybeNode = this.props.nodeRef ? void 0 : ReactDOM__default.default.findDOMNode(this);
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
    _proto.onTransitionEnd = function onTransitionEnd(timeout, handler) {
      this.setNextCallback(handler);
      var node2 = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM__default.default.findDOMNode(this);
      var doesNotHaveTimeoutOrListener = timeout == null && !this.props.addEndListener;
      if (!node2 || doesNotHaveTimeoutOrListener) {
        setTimeout(this.nextCallback, 0);
        return;
      }
      if (this.props.addEndListener) {
        var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node2, this.nextCallback], maybeNode = _ref3[0], maybeNextCallback = _ref3[1];
        this.props.addEndListener(maybeNode, maybeNextCallback);
      }
      if (timeout != null) {
        setTimeout(this.nextCallback, timeout);
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
      return /* @__PURE__ */ jsx(TransitionGroupContext.Provider, {
        value: null,
        children: typeof children === "function" ? children(status, childProps) : React__default.default.cloneElement(React__default.default.Children.only(children), childProps)
      });
    };
    return Transition2;
  }(React__default.default.Component);
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
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function getChildMapping(children, mapFn) {
    var mapper = function mapper2(child) {
      return mapFn && React2.isValidElement(child) ? mapFn(child) : child;
    };
    var result = /* @__PURE__ */ Object.create(null);
    if (children)
      React2.Children.map(children, function(c2) {
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
      return React2.cloneElement(child, {
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
      if (!React2.isValidElement(child))
        return;
      var hasPrev = key in prevChildMapping;
      var hasNext = key in nextChildMapping;
      var prevChild = prevChildMapping[key];
      var isLeaving = React2.isValidElement(prevChild) && !prevChild.props.in;
      if (hasNext && (!hasPrev || isLeaving)) {
        children[key] = React2.cloneElement(child, {
          onExited: onExited.bind(null, child),
          in: true,
          exit: getProp(child, "exit", nextProps),
          enter: getProp(child, "enter", nextProps)
        });
      } else if (!hasNext && hasPrev && !isLeaving) {
        children[key] = React2.cloneElement(child, {
          in: false
        });
      } else if (hasNext && hasPrev && React2.isValidElement(prevChild)) {
        children[key] = React2.cloneElement(child, {
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
          var children = _extends({}, state.children);
          delete children[child.key];
          return {
            children
          };
        });
      }
    };
    _proto.render = function render() {
      var _this$props = this.props, Component = _this$props.component, childFactory = _this$props.childFactory, props = _objectWithoutPropertiesLoose(_this$props, ["component", "childFactory"]);
      var contextValue = this.state.contextValue;
      var children = values(this.state.children).map(childFactory);
      delete props.appear;
      delete props.enter;
      delete props.exit;
      if (Component === null) {
        return /* @__PURE__ */ jsx(TransitionGroupContext.Provider, {
          value: contextValue,
          children
        });
      }
      return /* @__PURE__ */ jsx(TransitionGroupContext.Provider, {
        value: contextValue,
        children: /* @__PURE__ */ jsx(Component, {
          ...props,
          children
        })
      });
    };
    return TransitionGroup2;
  }(React__default.default.Component);
  TransitionGroup.propTypes = {};
  TransitionGroup.defaultProps = defaultProps;
  const TransitionGroup$1 = TransitionGroup;
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
    return /* @__PURE__ */ jsx("span", {
      className: rippleClassName,
      style: rippleStyles,
      children: /* @__PURE__ */ jsx("span", {
        className: childClassName
      })
    });
  }
  const touchRippleClasses = generateUtilityClasses("MuiTouchRipple", ["root", "ripple", "rippleVisible", "ripplePulsate", "child", "childLeaving", "childPulsate"]);
  const touchRippleClasses$1 = touchRippleClasses;
  const _excluded$h = ["center", "classes", "className"];
  let _ = (t2) => t2, _t, _t2, _t3, _t4;
  const DURATION = 550;
  const DELAY_RIPPLE = 80;
  const enterKeyframe = keyframes(_t || (_t = _`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`));
  const exitKeyframe = keyframes(_t2 || (_t2 = _`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`));
  const pulsateKeyframe = keyframes(_t3 || (_t3 = _`
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
  const TouchRippleRoot = styled$1("span", {
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
  const TouchRippleRipple = styled$1(Ripple, {
    name: "MuiTouchRipple",
    slot: "Ripple"
  })(_t4 || (_t4 = _`
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
`), touchRippleClasses$1.rippleVisible, enterKeyframe, DURATION, ({
    theme: theme2
  }) => theme2.transitions.easing.easeInOut, touchRippleClasses$1.ripplePulsate, ({
    theme: theme2
  }) => theme2.transitions.duration.shorter, touchRippleClasses$1.child, touchRippleClasses$1.childLeaving, exitKeyframe, DURATION, ({
    theme: theme2
  }) => theme2.transitions.easing.easeInOut, touchRippleClasses$1.childPulsate, pulsateKeyframe, ({
    theme: theme2
  }) => theme2.transitions.easing.easeInOut);
  const TouchRipple = /* @__PURE__ */ React__namespace.forwardRef(function TouchRipple2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiTouchRipple"
    });
    const {
      center: centerProp = false,
      classes = {},
      className
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$h);
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
    const startTimer = React__namespace.useRef(null);
    const startTimerCommit = React__namespace.useRef(null);
    const container2 = React__namespace.useRef(null);
    React__namespace.useEffect(() => {
      return () => {
        clearTimeout(startTimer.current);
      };
    }, []);
    const startCommit = React__namespace.useCallback((params) => {
      const {
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize,
        cb
      } = params;
      setRipples((oldRipples) => [...oldRipples, /* @__PURE__ */ jsx(TouchRippleRipple, {
        classes: {
          ripple: clsx(classes.ripple, touchRippleClasses$1.ripple),
          rippleVisible: clsx(classes.rippleVisible, touchRippleClasses$1.rippleVisible),
          ripplePulsate: clsx(classes.ripplePulsate, touchRippleClasses$1.ripplePulsate),
          child: clsx(classes.child, touchRippleClasses$1.child),
          childLeaving: clsx(classes.childLeaving, touchRippleClasses$1.childLeaving),
          childPulsate: clsx(classes.childPulsate, touchRippleClasses$1.childPulsate)
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
      } = options;
      if ((event == null ? void 0 : event.type) === "mousedown" && ignoringMouseDown.current) {
        ignoringMouseDown.current = false;
        return;
      }
      if ((event == null ? void 0 : event.type) === "touchstart") {
        ignoringMouseDown.current = true;
      }
      const element = fakeElement ? null : container2.current;
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
          startTimer.current = setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          }, DELAY_RIPPLE);
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
    }, [centerProp, startCommit]);
    const pulsate = React__namespace.useCallback(() => {
      start({}, {
        pulsate: true
      });
    }, [start]);
    const stop = React__namespace.useCallback((event, cb) => {
      clearTimeout(startTimer.current);
      if ((event == null ? void 0 : event.type) === "touchend" && startTimerCommit.current) {
        startTimerCommit.current();
        startTimerCommit.current = null;
        startTimer.current = setTimeout(() => {
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
    }, []);
    React__namespace.useImperativeHandle(ref, () => ({
      pulsate,
      start,
      stop
    }), [pulsate, start, stop]);
    return /* @__PURE__ */ jsx(TouchRippleRoot, _extends({
      className: clsx(touchRippleClasses$1.root, classes.root, className),
      ref: container2
    }, other, {
      children: /* @__PURE__ */ jsx(TransitionGroup$1, {
        component: null,
        exit: true,
        children: ripples
      })
    }));
  });
  const TouchRipple$1 = TouchRipple;
  function getButtonBaseUtilityClass(slot) {
    return generateUtilityClass("MuiButtonBase", slot);
  }
  const buttonBaseClasses = generateUtilityClasses("MuiButtonBase", ["root", "disabled", "focusVisible"]);
  const buttonBaseClasses$1 = buttonBaseClasses;
  const _excluded$g = ["action", "centerRipple", "children", "className", "component", "disabled", "disableRipple", "disableTouchRipple", "focusRipple", "focusVisibleClassName", "LinkComponent", "onBlur", "onClick", "onContextMenu", "onDragLeave", "onFocus", "onFocusVisible", "onKeyDown", "onKeyUp", "onMouseDown", "onMouseLeave", "onMouseUp", "onTouchEnd", "onTouchMove", "onTouchStart", "tabIndex", "TouchRippleProps", "touchRippleRef", "type"];
  const useUtilityClasses$c = (ownerState) => {
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
  const ButtonBaseRoot = styled$1("button", {
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
    outline: 0,
    border: 0,
    margin: 0,
    borderRadius: 0,
    padding: 0,
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    MozAppearance: "none",
    WebkitAppearance: "none",
    textDecoration: "none",
    color: "inherit",
    "&::-moz-focus-inner": {
      borderStyle: "none"
    },
    [`&.${buttonBaseClasses$1.disabled}`]: {
      pointerEvents: "none",
      cursor: "default"
    },
    "@media print": {
      colorAdjust: "exact"
    }
  });
  const ButtonBase = /* @__PURE__ */ React__namespace.forwardRef(function ButtonBase2(inProps, ref) {
    const props = useThemeProps({
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
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$g);
    const buttonRef = React__namespace.useRef(null);
    const rippleRef = React__namespace.useRef(null);
    const handleRippleRef = useForkRef(rippleRef, touchRippleRef);
    const {
      isFocusVisibleRef,
      onFocus: handleFocusVisible,
      onBlur: handleBlurVisible,
      ref: focusVisibleRef
    } = useIsFocusVisible();
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
    const [mountedState, setMountedState] = React__namespace.useState(false);
    React__namespace.useEffect(() => {
      setMountedState(true);
    }, []);
    const enableTouchRipple = mountedState && !disableRipple && !disabled;
    React__namespace.useEffect(() => {
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
      const button = buttonRef.current;
      return component && component !== "button" && !(button.tagName === "A" && button.href);
    };
    const keydownRef = React__namespace.useRef(false);
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
    const ownerState = _extends({}, props, {
      centerRipple,
      component,
      disabled,
      disableRipple,
      disableTouchRipple,
      focusRipple,
      tabIndex,
      focusVisible
    });
    const classes = useUtilityClasses$c(ownerState);
    return /* @__PURE__ */ jsxs(ButtonBaseRoot, _extends({
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
      children: [children, enableTouchRipple ? /* @__PURE__ */ jsx(TouchRipple$1, _extends({
        ref: handleRippleRef,
        center: centerRipple
      }, TouchRippleProps)) : null]
    }));
  });
  const ButtonBase$1 = ButtonBase;
  function getIconButtonUtilityClass(slot) {
    return generateUtilityClass("MuiIconButton", slot);
  }
  const iconButtonClasses = generateUtilityClasses("MuiIconButton", ["root", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorError", "colorInfo", "colorSuccess", "colorWarning", "edgeStart", "edgeEnd", "sizeSmall", "sizeMedium", "sizeLarge"]);
  const iconButtonClasses$1 = iconButtonClasses;
  const _excluded$f = ["edge", "children", "className", "color", "disabled", "disableFocusRipple", "size"];
  const useUtilityClasses$b = (ownerState) => {
    const {
      classes,
      disabled,
      color: color2,
      edge,
      size
    } = ownerState;
    const slots = {
      root: ["root", disabled && "disabled", color2 !== "default" && `color${capitalize(color2)}`, edge && `edge${capitalize(edge)}`, `size${capitalize(size)}`]
    };
    return composeClasses(slots, getIconButtonUtilityClass, classes);
  };
  const IconButtonRoot = styled$1(ButtonBase$1, {
    name: "MuiIconButton",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "default" && styles2[`color${capitalize(ownerState.color)}`], ownerState.edge && styles2[`edge${capitalize(ownerState.edge)}`], styles2[`size${capitalize(ownerState.size)}`]];
    }
  })(({
    theme: theme2,
    ownerState
  }) => _extends({
    textAlign: "center",
    flex: "0 0 auto",
    fontSize: theme2.typography.pxToRem(24),
    padding: 8,
    borderRadius: "50%",
    overflow: "visible",
    color: (theme2.vars || theme2).palette.action.active,
    transition: theme2.transitions.create("background-color", {
      duration: theme2.transitions.duration.shortest
    })
  }, !ownerState.disableRipple && {
    "&:hover": {
      backgroundColor: theme2.vars ? `rgba(${theme2.vars.palette.action.activeChannel} / ${theme2.vars.palette.action.hoverOpacity})` : alpha(theme2.palette.action.active, theme2.palette.action.hoverOpacity),
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    }
  }, ownerState.edge === "start" && {
    marginLeft: ownerState.size === "small" ? -3 : -12
  }, ownerState.edge === "end" && {
    marginRight: ownerState.size === "small" ? -3 : -12
  }), ({
    theme: theme2,
    ownerState
  }) => {
    var _palette;
    const palette = (_palette = (theme2.vars || theme2).palette) == null ? void 0 : _palette[ownerState.color];
    return _extends({}, ownerState.color === "inherit" && {
      color: "inherit"
    }, ownerState.color !== "inherit" && ownerState.color !== "default" && _extends({
      color: palette == null ? void 0 : palette.main
    }, !ownerState.disableRipple && {
      "&:hover": _extends({}, palette && {
        backgroundColor: theme2.vars ? `rgba(${palette.mainChannel} / ${theme2.vars.palette.action.hoverOpacity})` : alpha(palette.main, theme2.palette.action.hoverOpacity)
      }, {
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      })
    }), ownerState.size === "small" && {
      padding: 5,
      fontSize: theme2.typography.pxToRem(18)
    }, ownerState.size === "large" && {
      padding: 12,
      fontSize: theme2.typography.pxToRem(28)
    }, {
      [`&.${iconButtonClasses$1.disabled}`]: {
        backgroundColor: "transparent",
        color: (theme2.vars || theme2).palette.action.disabled
      }
    });
  });
  const IconButton = /* @__PURE__ */ React__namespace.forwardRef(function IconButton2(inProps, ref) {
    const props = useThemeProps({
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
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$f);
    const ownerState = _extends({}, props, {
      edge,
      color: color2,
      disabled,
      disableFocusRipple,
      size
    });
    const classes = useUtilityClasses$b(ownerState);
    return /* @__PURE__ */ jsx(IconButtonRoot, _extends({
      className: clsx(classes.root, className),
      centerRipple: true,
      focusRipple: !disableFocusRipple,
      disabled,
      ref,
      ownerState
    }, other, {
      children
    }));
  });
  const IconButton$1 = IconButton;
  const SuccessOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsx("path", {
    d: "M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"
  }), "SuccessOutlined");
  const ReportProblemOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsx("path", {
    d: "M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"
  }), "ReportProblemOutlined");
  const ErrorOutlineIcon = createSvgIcon(/* @__PURE__ */ jsx("path", {
    d: "M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
  }), "ErrorOutline");
  const InfoOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsx("path", {
    d: "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"
  }), "InfoOutlined");
  const CloseIcon = createSvgIcon(/* @__PURE__ */ jsx("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  }), "Close");
  const _excluded$e = ["action", "children", "className", "closeText", "color", "components", "componentsProps", "icon", "iconMapping", "onClose", "role", "severity", "slotProps", "slots", "variant"];
  const useUtilityClasses$a = (ownerState) => {
    const {
      variant,
      color: color2,
      severity,
      classes
    } = ownerState;
    const slots = {
      root: ["root", `${variant}${capitalize(color2 || severity)}`, `${variant}`],
      icon: ["icon"],
      message: ["message"],
      action: ["action"]
    };
    return composeClasses(slots, getAlertUtilityClass, classes);
  };
  const AlertRoot = styled$1(Paper$1, {
    name: "MuiAlert",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], styles2[`${ownerState.variant}${capitalize(ownerState.color || ownerState.severity)}`]];
    }
  })(({
    theme: theme2,
    ownerState
  }) => {
    const getColor = theme2.palette.mode === "light" ? darken : lighten;
    const getBackgroundColor = theme2.palette.mode === "light" ? lighten : darken;
    const color2 = ownerState.color || ownerState.severity;
    return _extends({}, theme2.typography.body2, {
      backgroundColor: "transparent",
      display: "flex",
      padding: "6px 16px"
    }, color2 && ownerState.variant === "standard" && {
      color: theme2.vars ? theme2.vars.palette.Alert[`${color2}Color`] : getColor(theme2.palette[color2].light, 0.6),
      backgroundColor: theme2.vars ? theme2.vars.palette.Alert[`${color2}StandardBg`] : getBackgroundColor(theme2.palette[color2].light, 0.9),
      [`& .${alertClasses$1.icon}`]: theme2.vars ? {
        color: theme2.vars.palette.Alert[`${color2}IconColor`]
      } : {
        color: theme2.palette[color2].main
      }
    }, color2 && ownerState.variant === "outlined" && {
      color: theme2.vars ? theme2.vars.palette.Alert[`${color2}Color`] : getColor(theme2.palette[color2].light, 0.6),
      border: `1px solid ${(theme2.vars || theme2).palette[color2].light}`,
      [`& .${alertClasses$1.icon}`]: theme2.vars ? {
        color: theme2.vars.palette.Alert[`${color2}IconColor`]
      } : {
        color: theme2.palette[color2].main
      }
    }, color2 && ownerState.variant === "filled" && _extends({
      fontWeight: theme2.typography.fontWeightMedium
    }, theme2.vars ? {
      color: theme2.vars.palette.Alert[`${color2}FilledColor`],
      backgroundColor: theme2.vars.palette.Alert[`${color2}FilledBg`]
    } : {
      backgroundColor: theme2.palette.mode === "dark" ? theme2.palette[color2].dark : theme2.palette[color2].main,
      color: theme2.palette.getContrastText(theme2.palette[color2].main)
    }));
  });
  const AlertIcon = styled$1("div", {
    name: "MuiAlert",
    slot: "Icon",
    overridesResolver: (props, styles2) => styles2.icon
  })({
    marginRight: 12,
    padding: "7px 0",
    display: "flex",
    fontSize: 22,
    opacity: 0.9
  });
  const AlertMessage = styled$1("div", {
    name: "MuiAlert",
    slot: "Message",
    overridesResolver: (props, styles2) => styles2.message
  })({
    padding: "8px 0",
    minWidth: 0,
    overflow: "auto"
  });
  const AlertAction = styled$1("div", {
    name: "MuiAlert",
    slot: "Action",
    overridesResolver: (props, styles2) => styles2.action
  })({
    display: "flex",
    alignItems: "flex-start",
    padding: "4px 0 0 16px",
    marginLeft: "auto",
    marginRight: -8
  });
  const defaultIconMapping = {
    success: /* @__PURE__ */ jsx(SuccessOutlinedIcon, {
      fontSize: "inherit"
    }),
    warning: /* @__PURE__ */ jsx(ReportProblemOutlinedIcon, {
      fontSize: "inherit"
    }),
    error: /* @__PURE__ */ jsx(ErrorOutlineIcon, {
      fontSize: "inherit"
    }),
    info: /* @__PURE__ */ jsx(InfoOutlinedIcon, {
      fontSize: "inherit"
    })
  };
  const Alert = /* @__PURE__ */ React__namespace.forwardRef(function Alert2(inProps, ref) {
    var _ref, _slots$closeButton, _ref2, _slots$closeIcon, _slotProps$closeButto, _slotProps$closeIcon;
    const props = useThemeProps({
      props: inProps,
      name: "MuiAlert"
    });
    const {
      action,
      children,
      className,
      closeText = "Close",
      color: color2,
      components = {},
      componentsProps = {},
      icon,
      iconMapping = defaultIconMapping,
      onClose,
      role = "alert",
      severity = "success",
      slotProps = {},
      slots = {},
      variant = "standard"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$e);
    const ownerState = _extends({}, props, {
      color: color2,
      severity,
      variant
    });
    const classes = useUtilityClasses$a(ownerState);
    const AlertCloseButton = (_ref = (_slots$closeButton = slots.closeButton) != null ? _slots$closeButton : components.CloseButton) != null ? _ref : IconButton$1;
    const AlertCloseIcon = (_ref2 = (_slots$closeIcon = slots.closeIcon) != null ? _slots$closeIcon : components.CloseIcon) != null ? _ref2 : CloseIcon;
    const closeButtonProps = (_slotProps$closeButto = slotProps.closeButton) != null ? _slotProps$closeButto : componentsProps.closeButton;
    const closeIconProps = (_slotProps$closeIcon = slotProps.closeIcon) != null ? _slotProps$closeIcon : componentsProps.closeIcon;
    return /* @__PURE__ */ jsxs(AlertRoot, _extends({
      role,
      elevation: 0,
      ownerState,
      className: clsx(classes.root, className),
      ref
    }, other, {
      children: [icon !== false ? /* @__PURE__ */ jsx(AlertIcon, {
        ownerState,
        className: classes.icon,
        children: icon || iconMapping[severity] || defaultIconMapping[severity]
      }) : null, /* @__PURE__ */ jsx(AlertMessage, {
        ownerState,
        className: classes.message,
        children
      }), action != null ? /* @__PURE__ */ jsx(AlertAction, {
        ownerState,
        className: classes.action,
        children: action
      }) : null, action == null && onClose ? /* @__PURE__ */ jsx(AlertAction, {
        ownerState,
        className: classes.action,
        children: /* @__PURE__ */ jsx(AlertCloseButton, _extends({
          size: "small",
          "aria-label": closeText,
          title: closeText,
          color: "inherit",
          onClick: onClose
        }, closeButtonProps, {
          children: /* @__PURE__ */ jsx(AlertCloseIcon, _extends({
            fontSize: "small"
          }, closeIconProps))
        }))
      }) : null]
    }));
  });
  const Alert$1 = Alert;
  function getListItemIconUtilityClass(slot) {
    return generateUtilityClass("MuiListItemIcon", slot);
  }
  const listItemIconClasses = generateUtilityClasses("MuiListItemIcon", ["root", "alignItemsFlexStart"]);
  const listItemIconClasses$1 = listItemIconClasses;
  const ListContext = /* @__PURE__ */ React__namespace.createContext({});
  const ListContext$1 = ListContext;
  const _excluded$d = ["className"];
  const useUtilityClasses$9 = (ownerState) => {
    const {
      alignItems,
      classes
    } = ownerState;
    const slots = {
      root: ["root", alignItems === "flex-start" && "alignItemsFlexStart"]
    };
    return composeClasses(slots, getListItemIconUtilityClass, classes);
  };
  const ListItemIconRoot = styled$1("div", {
    name: "MuiListItemIcon",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.alignItems === "flex-start" && styles2.alignItemsFlexStart];
    }
  })(({
    theme: theme2,
    ownerState
  }) => _extends({
    minWidth: 56,
    color: (theme2.vars || theme2).palette.action.active,
    flexShrink: 0,
    display: "inline-flex"
  }, ownerState.alignItems === "flex-start" && {
    marginTop: 8
  }));
  const ListItemIcon = /* @__PURE__ */ React__namespace.forwardRef(function ListItemIcon2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiListItemIcon"
    });
    const {
      className
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$d);
    const context = React__namespace.useContext(ListContext$1);
    const ownerState = _extends({}, props, {
      alignItems: context.alignItems
    });
    const classes = useUtilityClasses$9(ownerState);
    return /* @__PURE__ */ jsx(ListItemIconRoot, _extends({
      className: clsx(classes.root, className),
      ownerState,
      ref
    }, other));
  });
  const ListItemIcon$1 = ListItemIcon;
  function getTypographyUtilityClass(slot) {
    return generateUtilityClass("MuiTypography", slot);
  }
  generateUtilityClasses("MuiTypography", ["root", "h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "inherit", "button", "caption", "overline", "alignLeft", "alignRight", "alignCenter", "alignJustify", "noWrap", "gutterBottom", "paragraph"]);
  const _excluded$c = ["align", "className", "component", "gutterBottom", "noWrap", "paragraph", "variant", "variantMapping"];
  const useUtilityClasses$8 = (ownerState) => {
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
  const TypographyRoot = styled$1("span", {
    name: "MuiTypography",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.variant && styles2[ownerState.variant], ownerState.align !== "inherit" && styles2[`align${capitalize(ownerState.align)}`], ownerState.noWrap && styles2.noWrap, ownerState.gutterBottom && styles2.gutterBottom, ownerState.paragraph && styles2.paragraph];
    }
  })(({
    theme: theme2,
    ownerState
  }) => _extends({
    margin: 0
  }, ownerState.variant && theme2.typography[ownerState.variant], ownerState.align !== "inherit" && {
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
  const Typography = /* @__PURE__ */ React__namespace.forwardRef(function Typography2(inProps, ref) {
    const themeProps = useThemeProps({
      props: inProps,
      name: "MuiTypography"
    });
    const color2 = transformDeprecatedColors(themeProps.color);
    const props = extendSxProp(_extends({}, themeProps, {
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
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$c);
    const ownerState = _extends({}, props, {
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
    const classes = useUtilityClasses$8(ownerState);
    return /* @__PURE__ */ jsx(TypographyRoot, _extends({
      as: Component,
      ref,
      ownerState,
      className: clsx(classes.root, className)
    }, other));
  });
  const Typography$1 = Typography;
  function getListItemTextUtilityClass(slot) {
    return generateUtilityClass("MuiListItemText", slot);
  }
  const listItemTextClasses = generateUtilityClasses("MuiListItemText", ["root", "multiline", "dense", "inset", "primary", "secondary"]);
  const listItemTextClasses$1 = listItemTextClasses;
  const _excluded$b = ["children", "className", "disableTypography", "inset", "primary", "primaryTypographyProps", "secondary", "secondaryTypographyProps"];
  const useUtilityClasses$7 = (ownerState) => {
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
  const ListItemTextRoot = styled$1("div", {
    name: "MuiListItemText",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [{
        [`& .${listItemTextClasses$1.primary}`]: styles2.primary
      }, {
        [`& .${listItemTextClasses$1.secondary}`]: styles2.secondary
      }, styles2.root, ownerState.inset && styles2.inset, ownerState.primary && ownerState.secondary && styles2.multiline, ownerState.dense && styles2.dense];
    }
  })(({
    ownerState
  }) => _extends({
    flex: "1 1 auto",
    minWidth: 0,
    marginTop: 4,
    marginBottom: 4
  }, ownerState.primary && ownerState.secondary && {
    marginTop: 6,
    marginBottom: 6
  }, ownerState.inset && {
    paddingLeft: 56
  }));
  const ListItemText = /* @__PURE__ */ React__namespace.forwardRef(function ListItemText2(inProps, ref) {
    const props = useThemeProps({
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
      secondaryTypographyProps
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$b);
    const {
      dense
    } = React__namespace.useContext(ListContext$1);
    let primary = primaryProp != null ? primaryProp : children;
    let secondary = secondaryProp;
    const ownerState = _extends({}, props, {
      disableTypography,
      inset,
      primary: !!primary,
      secondary: !!secondary,
      dense
    });
    const classes = useUtilityClasses$7(ownerState);
    if (primary != null && primary.type !== Typography$1 && !disableTypography) {
      primary = /* @__PURE__ */ jsx(Typography$1, _extends({
        variant: dense ? "body2" : "body1",
        className: classes.primary,
        component: primaryTypographyProps != null && primaryTypographyProps.variant ? void 0 : "span",
        display: "block"
      }, primaryTypographyProps, {
        children: primary
      }));
    }
    if (secondary != null && secondary.type !== Typography$1 && !disableTypography) {
      secondary = /* @__PURE__ */ jsx(Typography$1, _extends({
        variant: "body2",
        className: classes.secondary,
        color: "text.secondary",
        display: "block"
      }, secondaryTypographyProps, {
        children: secondary
      }));
    }
    return /* @__PURE__ */ jsxs(ListItemTextRoot, _extends({
      className: clsx(classes.root, className),
      ownerState,
      ref
    }, other, {
      children: [primary, secondary]
    }));
  });
  const ListItemText$1 = ListItemText;
  function getListUtilityClass(slot) {
    return generateUtilityClass("MuiList", slot);
  }
  generateUtilityClasses("MuiList", ["root", "padding", "dense", "subheader"]);
  const _excluded$a = ["children", "className", "component", "dense", "disablePadding", "subheader"];
  const useUtilityClasses$6 = (ownerState) => {
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
  const ListRoot = styled$1("ul", {
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
  }) => _extends({
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
  const List = /* @__PURE__ */ React__namespace.forwardRef(function List2(inProps, ref) {
    const props = useThemeProps({
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
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$a);
    const context = React__namespace.useMemo(() => ({
      dense
    }), [dense]);
    const ownerState = _extends({}, props, {
      component,
      dense,
      disablePadding
    });
    const classes = useUtilityClasses$6(ownerState);
    return /* @__PURE__ */ jsx(ListContext$1.Provider, {
      value: context,
      children: /* @__PURE__ */ jsxs(ListRoot, _extends({
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
  const _excluded$9 = ["actions", "autoFocus", "autoFocusItem", "children", "className", "disabledItemsFocusable", "disableListWrap", "onKeyDown", "variant"];
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
  const MenuList = /* @__PURE__ */ React__namespace.forwardRef(function MenuList2(props, ref) {
    const {
      actions,
      autoFocus = false,
      autoFocusItem = false,
      children,
      className,
      disabledItemsFocusable = false,
      disableListWrap = false,
      onKeyDown,
      variant = "selectedMenu"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$9);
    const listRef = React__namespace.useRef(null);
    const textCriteriaRef = React__namespace.useRef({
      keys: [],
      repeating: true,
      previousKeyMatched: true,
      lastTime: null
    });
    useEnhancedEffect$1(() => {
      if (autoFocus) {
        listRef.current.focus();
      }
    }, [autoFocus]);
    React__namespace.useImperativeHandle(actions, () => ({
      adjustStyleForScrollbar: (containerElement, theme2) => {
        const noExplicitWidth = !listRef.current.style.width;
        if (containerElement.clientHeight < listRef.current.clientHeight && noExplicitWidth) {
          const scrollbarSize = `${getScrollbarSize(ownerDocument(containerElement))}px`;
          listRef.current.style[theme2.direction === "rtl" ? "paddingLeft" : "paddingRight"] = scrollbarSize;
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
    React__namespace.Children.forEach(children, (child, index) => {
      if (!/* @__PURE__ */ React__namespace.isValidElement(child)) {
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
    const items = React__namespace.Children.map(children, (child, index) => {
      if (index === activeItemIndex) {
        const newChildProps = {};
        if (autoFocusItem) {
          newChildProps.autoFocus = true;
        }
        if (child.props.tabIndex === void 0 && variant === "selectedMenu") {
          newChildProps.tabIndex = 0;
        }
        return /* @__PURE__ */ React__namespace.cloneElement(child, newChildProps);
      }
      return child;
    });
    return /* @__PURE__ */ jsx(List$1, _extends({
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
  const _excluded$8 = ["addEndListener", "appear", "children", "easing", "in", "onEnter", "onEntered", "onEntering", "onExit", "onExited", "onExiting", "style", "timeout", "TransitionComponent"];
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
  const Grow = /* @__PURE__ */ React__namespace.forwardRef(function Grow2(props, ref) {
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
      TransitionComponent = Transition$1
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$8);
    const timer = React__namespace.useRef();
    const autoTimeout = React__namespace.useRef();
    const theme2 = useTheme();
    const nodeRef = React__namespace.useRef(null);
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
        duration2 = theme2.transitions.getAutoHeightDuration(node2.clientHeight);
        autoTimeout.current = duration2;
      } else {
        duration2 = transitionDuration;
      }
      node2.style.transition = [theme2.transitions.create("opacity", {
        duration: duration2,
        delay
      }), theme2.transitions.create("transform", {
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
        duration2 = theme2.transitions.getAutoHeightDuration(node2.clientHeight);
        autoTimeout.current = duration2;
      } else {
        duration2 = transitionDuration;
      }
      node2.style.transition = [theme2.transitions.create("opacity", {
        duration: duration2,
        delay
      }), theme2.transitions.create("transform", {
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
        timer.current = setTimeout(next2, autoTimeout.current || 0);
      }
      if (addEndListener) {
        addEndListener(nodeRef.current, next2);
      }
    };
    React__namespace.useEffect(() => {
      return () => {
        clearTimeout(timer.current);
      };
    }, []);
    return /* @__PURE__ */ jsx(TransitionComponent, _extends({
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
        return /* @__PURE__ */ React__namespace.cloneElement(children, _extends({
          style: _extends({
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
  const _excluded$7 = ["addEndListener", "appear", "children", "easing", "in", "onEnter", "onEntered", "onEntering", "onExit", "onExited", "onExiting", "style", "timeout", "TransitionComponent"];
  const styles = {
    entering: {
      opacity: 1
    },
    entered: {
      opacity: 1
    }
  };
  const Fade = /* @__PURE__ */ React__namespace.forwardRef(function Fade2(props, ref) {
    const theme2 = useTheme();
    const defaultTimeout = {
      enter: theme2.transitions.duration.enteringScreen,
      exit: theme2.transitions.duration.leavingScreen
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
      TransitionComponent = Transition$1
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$7);
    const nodeRef = React__namespace.useRef(null);
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
      node2.style.webkitTransition = theme2.transitions.create("opacity", transitionProps);
      node2.style.transition = theme2.transitions.create("opacity", transitionProps);
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
      node2.style.webkitTransition = theme2.transitions.create("opacity", transitionProps);
      node2.style.transition = theme2.transitions.create("opacity", transitionProps);
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
    return /* @__PURE__ */ jsx(TransitionComponent, _extends({
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
        return /* @__PURE__ */ React__namespace.cloneElement(children, _extends({
          style: _extends({
            opacity: 0,
            visibility: state === "exited" && !inProp ? "hidden" : void 0
          }, styles[state], style2, children.props.style),
          ref: handleRef
        }, childProps));
      }
    }));
  });
  const Fade$1 = Fade;
  function getBackdropUtilityClass(slot) {
    return generateUtilityClass("MuiBackdrop", slot);
  }
  generateUtilityClasses("MuiBackdrop", ["root", "invisible"]);
  const _excluded$6 = ["children", "className", "component", "components", "componentsProps", "invisible", "open", "slotProps", "slots", "TransitionComponent", "transitionDuration"];
  const useUtilityClasses$5 = (ownerState) => {
    const {
      classes,
      invisible
    } = ownerState;
    const slots = {
      root: ["root", invisible && "invisible"]
    };
    return composeClasses(slots, getBackdropUtilityClass, classes);
  };
  const BackdropRoot = styled$1("div", {
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
  }) => _extends({
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
  const Backdrop = /* @__PURE__ */ React__namespace.forwardRef(function Backdrop2(inProps, ref) {
    var _slotProps$root, _ref, _slots$root;
    const props = useThemeProps({
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
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$6);
    const ownerState = _extends({}, props, {
      component,
      invisible
    });
    const classes = useUtilityClasses$5(ownerState);
    const rootSlotProps = (_slotProps$root = slotProps.root) != null ? _slotProps$root : componentsProps.root;
    return /* @__PURE__ */ jsx(TransitionComponent, _extends({
      in: open,
      timeout: transitionDuration
    }, other, {
      children: /* @__PURE__ */ jsx(BackdropRoot, _extends({
        "aria-hidden": true
      }, rootSlotProps, {
        as: (_ref = (_slots$root = slots.root) != null ? _slots$root : components.Root) != null ? _ref : component,
        className: clsx(classes.root, className, rootSlotProps == null ? void 0 : rootSlotProps.className),
        ownerState: _extends({}, ownerState, rootSlotProps == null ? void 0 : rootSlotProps.ownerState),
        classes,
        ref,
        children
      }))
    }));
  });
  const Backdrop$1 = Backdrop;
  const _excluded$5 = ["BackdropComponent", "BackdropProps", "classes", "className", "closeAfterTransition", "children", "component", "components", "componentsProps", "disableAutoFocus", "disableEnforceFocus", "disableEscapeKeyDown", "disablePortal", "disableRestoreFocus", "disableScrollLock", "hideBackdrop", "keepMounted", "slotProps", "slots", "theme"];
  const ModalRoot = styled$1("div", {
    name: "MuiModal",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, !ownerState.open && ownerState.exited && styles2.hidden];
    }
  })(({
    theme: theme2,
    ownerState
  }) => _extends({
    position: "fixed",
    zIndex: (theme2.vars || theme2).zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  }, !ownerState.open && ownerState.exited && {
    visibility: "hidden"
  }));
  const ModalBackdrop = styled$1(Backdrop$1, {
    name: "MuiModal",
    slot: "Backdrop",
    overridesResolver: (props, styles2) => {
      return styles2.backdrop;
    }
  })({
    zIndex: -1
  });
  const Modal = /* @__PURE__ */ React__namespace.forwardRef(function Modal2(inProps, ref) {
    var _ref, _slots$root, _ref2, _slots$backdrop, _slotProps$root, _slotProps$backdrop;
    const props = useThemeProps({
      name: "MuiModal",
      props: inProps
    });
    const {
      BackdropComponent = ModalBackdrop,
      BackdropProps,
      classes,
      className,
      closeAfterTransition = false,
      children,
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
      slotProps,
      slots,
      theme: theme2
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$5);
    const [exited, setExited] = React__namespace.useState(true);
    const commonProps = {
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
    const ownerState = _extends({}, props, commonProps, {
      exited
    });
    const RootSlot = (_ref = (_slots$root = slots == null ? void 0 : slots.root) != null ? _slots$root : components.Root) != null ? _ref : ModalRoot;
    const BackdropSlot = (_ref2 = (_slots$backdrop = slots == null ? void 0 : slots.backdrop) != null ? _slots$backdrop : components.Backdrop) != null ? _ref2 : BackdropComponent;
    const rootSlotProps = (_slotProps$root = slotProps == null ? void 0 : slotProps.root) != null ? _slotProps$root : componentsProps.root;
    const backdropSlotProps = (_slotProps$backdrop = slotProps == null ? void 0 : slotProps.backdrop) != null ? _slotProps$backdrop : componentsProps.backdrop;
    return /* @__PURE__ */ jsx(ModalUnstyled$1, _extends({
      slots: {
        root: RootSlot,
        backdrop: BackdropSlot
      },
      slotProps: {
        root: () => _extends({}, resolveComponentProps(rootSlotProps, ownerState), !isHostComponent(RootSlot) && {
          as: component,
          theme: theme2
        }, {
          className: clsx(className, rootSlotProps == null ? void 0 : rootSlotProps.className, classes == null ? void 0 : classes.root, !ownerState.open && ownerState.exited && (classes == null ? void 0 : classes.hidden))
        }),
        backdrop: () => _extends({}, BackdropProps, resolveComponentProps(backdropSlotProps, ownerState), {
          className: clsx(backdropSlotProps == null ? void 0 : backdropSlotProps.className, classes == null ? void 0 : classes.backdrop)
        })
      },
      onTransitionEnter: () => setExited(false),
      onTransitionExited: () => setExited(true),
      ref
    }, other, commonProps, {
      children
    }));
  });
  const Modal$1 = Modal;
  function getPopoverUtilityClass(slot) {
    return generateUtilityClass("MuiPopover", slot);
  }
  generateUtilityClasses("MuiPopover", ["root", "paper"]);
  const _excluded$4 = ["onEntering"], _excluded2$2 = ["action", "anchorEl", "anchorOrigin", "anchorPosition", "anchorReference", "children", "className", "container", "elevation", "marginThreshold", "open", "PaperProps", "transformOrigin", "TransitionComponent", "transitionDuration", "TransitionProps"];
  function getOffsetTop(rect, vertical) {
    let offset = 0;
    if (typeof vertical === "number") {
      offset = vertical;
    } else if (vertical === "center") {
      offset = rect.height / 2;
    } else if (vertical === "bottom") {
      offset = rect.height;
    }
    return offset;
  }
  function getOffsetLeft(rect, horizontal) {
    let offset = 0;
    if (typeof horizontal === "number") {
      offset = horizontal;
    } else if (horizontal === "center") {
      offset = rect.width / 2;
    } else if (horizontal === "right") {
      offset = rect.width;
    }
    return offset;
  }
  function getTransformOriginValue(transformOrigin) {
    return [transformOrigin.horizontal, transformOrigin.vertical].map((n2) => typeof n2 === "number" ? `${n2}px` : n2).join(" ");
  }
  function resolveAnchorEl(anchorEl) {
    return typeof anchorEl === "function" ? anchorEl() : anchorEl;
  }
  const useUtilityClasses$4 = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"],
      paper: ["paper"]
    };
    return composeClasses(slots, getPopoverUtilityClass, classes);
  };
  const PopoverRoot = styled$1(Modal$1, {
    name: "MuiPopover",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({});
  const PopoverPaper = styled$1(Paper$1, {
    name: "MuiPopover",
    slot: "Paper",
    overridesResolver: (props, styles2) => styles2.paper
  })({
    position: "absolute",
    overflowY: "auto",
    overflowX: "hidden",
    minWidth: 16,
    minHeight: 16,
    maxWidth: "calc(100% - 32px)",
    maxHeight: "calc(100% - 32px)",
    outline: 0
  });
  const Popover = /* @__PURE__ */ React__namespace.forwardRef(function Popover2(inProps, ref) {
    const props = useThemeProps({
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
      PaperProps = {},
      transformOrigin = {
        vertical: "top",
        horizontal: "left"
      },
      TransitionComponent = Grow$1,
      transitionDuration: transitionDurationProp = "auto",
      TransitionProps: {
        onEntering
      } = {}
    } = props, TransitionProps = _objectWithoutPropertiesLoose(props.TransitionProps, _excluded$4), other = _objectWithoutPropertiesLoose(props, _excluded2$2);
    const paperRef = React__namespace.useRef();
    const handlePaperRef = useForkRef(paperRef, PaperProps.ref);
    const ownerState = _extends({}, props, {
      anchorOrigin,
      anchorReference,
      elevation,
      marginThreshold,
      PaperProps,
      transformOrigin,
      TransitionComponent,
      transitionDuration: transitionDurationProp,
      TransitionProps
    });
    const classes = useUtilityClasses$4(ownerState);
    const getAnchorOffset = React__namespace.useCallback(() => {
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
    const getTransformOrigin = React__namespace.useCallback((elemRect) => {
      return {
        vertical: getOffsetTop(elemRect, transformOrigin.vertical),
        horizontal: getOffsetLeft(elemRect, transformOrigin.horizontal)
      };
    }, [transformOrigin.horizontal, transformOrigin.vertical]);
    const getPositioningStyle = React__namespace.useCallback((element) => {
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
      let top = anchorOffset.top - elemTransformOrigin.vertical;
      let left = anchorOffset.left - elemTransformOrigin.horizontal;
      const bottom = top + elemRect.height;
      const right = left + elemRect.width;
      const containerWindow = ownerWindow(resolveAnchorEl(anchorEl));
      const heightThreshold = containerWindow.innerHeight - marginThreshold;
      const widthThreshold = containerWindow.innerWidth - marginThreshold;
      if (top < marginThreshold) {
        const diff = top - marginThreshold;
        top -= diff;
        elemTransformOrigin.vertical += diff;
      } else if (bottom > heightThreshold) {
        const diff = bottom - heightThreshold;
        top -= diff;
        elemTransformOrigin.vertical += diff;
      }
      if (left < marginThreshold) {
        const diff = left - marginThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      } else if (right > widthThreshold) {
        const diff = right - widthThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      }
      return {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        transformOrigin: getTransformOriginValue(elemTransformOrigin)
      };
    }, [anchorEl, anchorReference, getAnchorOffset, getTransformOrigin, marginThreshold]);
    const [isPositioned, setIsPositioned] = React__namespace.useState(open);
    const setPositioningStyles = React__namespace.useCallback(() => {
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
    const handleEntering = (element, isAppearing) => {
      if (onEntering) {
        onEntering(element, isAppearing);
      }
      setPositioningStyles();
    };
    const handleExited = () => {
      setIsPositioned(false);
    };
    React__namespace.useEffect(() => {
      if (open) {
        setPositioningStyles();
      }
    });
    React__namespace.useImperativeHandle(action, () => open ? {
      updatePosition: () => {
        setPositioningStyles();
      }
    } : null, [open, setPositioningStyles]);
    React__namespace.useEffect(() => {
      if (!open) {
        return void 0;
      }
      const handleResize = debounce(() => {
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
    const container2 = containerProp || (anchorEl ? ownerDocument(resolveAnchorEl(anchorEl)).body : void 0);
    return /* @__PURE__ */ jsx(PopoverRoot, _extends({
      BackdropProps: {
        invisible: true
      },
      className: clsx(classes.root, className),
      container: container2,
      open,
      ref,
      ownerState
    }, other, {
      children: /* @__PURE__ */ jsx(TransitionComponent, _extends({
        appear: true,
        in: open,
        onEntering: handleEntering,
        onExited: handleExited,
        timeout: transitionDuration
      }, TransitionProps, {
        children: /* @__PURE__ */ jsx(PopoverPaper, _extends({
          elevation
        }, PaperProps, {
          ref: handlePaperRef,
          className: clsx(classes.paper, PaperProps.className)
        }, isPositioned ? void 0 : {
          style: _extends({}, PaperProps.style, {
            opacity: 0
          })
        }, {
          ownerState,
          children
        }))
      }))
    }));
  });
  const Popover$1 = Popover;
  function getMenuUtilityClass(slot) {
    return generateUtilityClass("MuiMenu", slot);
  }
  generateUtilityClasses("MuiMenu", ["root", "paper", "list"]);
  const _excluded$3 = ["onEntering"], _excluded2$1 = ["autoFocus", "children", "disableAutoFocusItem", "MenuListProps", "onClose", "open", "PaperProps", "PopoverClasses", "transitionDuration", "TransitionProps", "variant"];
  const RTL_ORIGIN = {
    vertical: "top",
    horizontal: "right"
  };
  const LTR_ORIGIN = {
    vertical: "top",
    horizontal: "left"
  };
  const useUtilityClasses$3 = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"],
      paper: ["paper"],
      list: ["list"]
    };
    return composeClasses(slots, getMenuUtilityClass, classes);
  };
  const MenuRoot = styled$1(Popover$1, {
    shouldForwardProp: (prop) => rootShouldForwardProp(prop) || prop === "classes",
    name: "MuiMenu",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({});
  const MenuPaper = styled$1(Paper$1, {
    name: "MuiMenu",
    slot: "Paper",
    overridesResolver: (props, styles2) => styles2.paper
  })({
    maxHeight: "calc(100% - 96px)",
    WebkitOverflowScrolling: "touch"
  });
  const MenuMenuList = styled$1(MenuList$1, {
    name: "MuiMenu",
    slot: "List",
    overridesResolver: (props, styles2) => styles2.list
  })({
    outline: 0
  });
  const Menu = /* @__PURE__ */ React__namespace.forwardRef(function Menu2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiMenu"
    });
    const {
      autoFocus = true,
      children,
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
      variant = "selectedMenu"
    } = props, TransitionProps = _objectWithoutPropertiesLoose(props.TransitionProps, _excluded$3), other = _objectWithoutPropertiesLoose(props, _excluded2$1);
    const theme2 = useTheme();
    const isRtl = theme2.direction === "rtl";
    const ownerState = _extends({}, props, {
      autoFocus,
      disableAutoFocusItem,
      MenuListProps,
      onEntering,
      PaperProps,
      transitionDuration,
      TransitionProps,
      variant
    });
    const classes = useUtilityClasses$3(ownerState);
    const autoFocusItem = autoFocus && !disableAutoFocusItem && open;
    const menuListActionsRef = React__namespace.useRef(null);
    const handleEntering = (element, isAppearing) => {
      if (menuListActionsRef.current) {
        menuListActionsRef.current.adjustStyleForScrollbar(element, theme2);
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
    React__namespace.Children.map(children, (child, index) => {
      if (!/* @__PURE__ */ React__namespace.isValidElement(child)) {
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
    return /* @__PURE__ */ jsx(MenuRoot, _extends({
      onClose,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: isRtl ? "right" : "left"
      },
      transformOrigin: isRtl ? RTL_ORIGIN : LTR_ORIGIN,
      PaperProps: _extends({
        as: MenuPaper
      }, PaperProps, {
        classes: _extends({}, PaperProps.classes, {
          root: classes.paper
        })
      }),
      className: classes.root,
      open,
      ref,
      transitionDuration,
      TransitionProps: _extends({
        onEntering: handleEntering
      }, TransitionProps),
      ownerState
    }, other, {
      classes: PopoverClasses,
      children: /* @__PURE__ */ jsx(MenuMenuList, _extends({
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
  const dividerClasses = generateUtilityClasses("MuiDivider", ["root", "absolute", "fullWidth", "inset", "middle", "flexItem", "light", "vertical", "withChildren", "withChildrenVertical", "textAlignRight", "textAlignLeft", "wrapper", "wrapperVertical"]);
  const dividerClasses$1 = dividerClasses;
  function getMenuItemUtilityClass(slot) {
    return generateUtilityClass("MuiMenuItem", slot);
  }
  const menuItemClasses = generateUtilityClasses("MuiMenuItem", ["root", "focusVisible", "dense", "disabled", "divider", "gutters", "selected"]);
  const menuItemClasses$1 = menuItemClasses;
  const _excluded$2 = ["autoFocus", "component", "dense", "divider", "disableGutters", "focusVisibleClassName", "role", "tabIndex", "className"];
  const overridesResolver = (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, ownerState.dense && styles2.dense, ownerState.divider && styles2.divider, !ownerState.disableGutters && styles2.gutters];
  };
  const useUtilityClasses$2 = (ownerState) => {
    const {
      disabled,
      dense,
      divider,
      disableGutters,
      selected,
      classes
    } = ownerState;
    const slots = {
      root: ["root", dense && "dense", disabled && "disabled", !disableGutters && "gutters", divider && "divider", selected && "selected"]
    };
    const composedClasses = composeClasses(slots, getMenuItemUtilityClass, classes);
    return _extends({}, classes, composedClasses);
  };
  const MenuItemRoot = styled$1(ButtonBase$1, {
    shouldForwardProp: (prop) => rootShouldForwardProp(prop) || prop === "classes",
    name: "MuiMenuItem",
    slot: "Root",
    overridesResolver
  })(({
    theme: theme2,
    ownerState
  }) => _extends({}, theme2.typography.body1, {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    textDecoration: "none",
    minHeight: 48,
    paddingTop: 6,
    paddingBottom: 6,
    boxSizing: "border-box",
    whiteSpace: "nowrap"
  }, !ownerState.disableGutters && {
    paddingLeft: 16,
    paddingRight: 16
  }, ownerState.divider && {
    borderBottom: `1px solid ${(theme2.vars || theme2).palette.divider}`,
    backgroundClip: "padding-box"
  }, {
    "&:hover": {
      textDecoration: "none",
      backgroundColor: (theme2.vars || theme2).palette.action.hover,
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    },
    [`&.${menuItemClasses$1.selected}`]: {
      backgroundColor: theme2.vars ? `rgba(${theme2.vars.palette.primary.mainChannel} / ${theme2.vars.palette.action.selectedOpacity})` : alpha(theme2.palette.primary.main, theme2.palette.action.selectedOpacity),
      [`&.${menuItemClasses$1.focusVisible}`]: {
        backgroundColor: theme2.vars ? `rgba(${theme2.vars.palette.primary.mainChannel} / calc(${theme2.vars.palette.action.selectedOpacity} + ${theme2.vars.palette.action.focusOpacity}))` : alpha(theme2.palette.primary.main, theme2.palette.action.selectedOpacity + theme2.palette.action.focusOpacity)
      }
    },
    [`&.${menuItemClasses$1.selected}:hover`]: {
      backgroundColor: theme2.vars ? `rgba(${theme2.vars.palette.primary.mainChannel} / calc(${theme2.vars.palette.action.selectedOpacity} + ${theme2.vars.palette.action.hoverOpacity}))` : alpha(theme2.palette.primary.main, theme2.palette.action.selectedOpacity + theme2.palette.action.hoverOpacity),
      "@media (hover: none)": {
        backgroundColor: theme2.vars ? `rgba(${theme2.vars.palette.primary.mainChannel} / ${theme2.vars.palette.action.selectedOpacity})` : alpha(theme2.palette.primary.main, theme2.palette.action.selectedOpacity)
      }
    },
    [`&.${menuItemClasses$1.focusVisible}`]: {
      backgroundColor: (theme2.vars || theme2).palette.action.focus
    },
    [`&.${menuItemClasses$1.disabled}`]: {
      opacity: (theme2.vars || theme2).palette.action.disabledOpacity
    },
    [`& + .${dividerClasses$1.root}`]: {
      marginTop: theme2.spacing(1),
      marginBottom: theme2.spacing(1)
    },
    [`& + .${dividerClasses$1.inset}`]: {
      marginLeft: 52
    },
    [`& .${listItemTextClasses$1.root}`]: {
      marginTop: 0,
      marginBottom: 0
    },
    [`& .${listItemTextClasses$1.inset}`]: {
      paddingLeft: 36
    },
    [`& .${listItemIconClasses$1.root}`]: {
      minWidth: 36
    }
  }, !ownerState.dense && {
    [theme2.breakpoints.up("sm")]: {
      minHeight: "auto"
    }
  }, ownerState.dense && _extends({
    minHeight: 32,
    paddingTop: 4,
    paddingBottom: 4
  }, theme2.typography.body2, {
    [`& .${listItemIconClasses$1.root} svg`]: {
      fontSize: "1.25rem"
    }
  })));
  const MenuItem = /* @__PURE__ */ React__namespace.forwardRef(function MenuItem2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiMenuItem"
    });
    const {
      autoFocus = false,
      component = "li",
      dense = false,
      divider = false,
      disableGutters = false,
      focusVisibleClassName,
      role = "menuitem",
      tabIndex: tabIndexProp,
      className
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$2);
    const context = React__namespace.useContext(ListContext$1);
    const childContext = React__namespace.useMemo(() => ({
      dense: dense || context.dense || false,
      disableGutters
    }), [context.dense, dense, disableGutters]);
    const menuItemRef = React__namespace.useRef(null);
    useEnhancedEffect$1(() => {
      if (autoFocus) {
        if (menuItemRef.current) {
          menuItemRef.current.focus();
        }
      }
    }, [autoFocus]);
    const ownerState = _extends({}, props, {
      dense: childContext.dense,
      divider,
      disableGutters
    });
    const classes = useUtilityClasses$2(props);
    const handleRef = useForkRef(menuItemRef, ref);
    let tabIndex;
    if (!props.disabled) {
      tabIndex = tabIndexProp !== void 0 ? tabIndexProp : -1;
    }
    return /* @__PURE__ */ jsx(ListContext$1.Provider, {
      value: childContext,
      children: /* @__PURE__ */ jsx(MenuItemRoot, _extends({
        ref: handleRef,
        role,
        tabIndex,
        component,
        focusVisibleClassName: clsx(classes.focusVisible, focusVisibleClassName),
        className: clsx(classes.root, className)
      }, other, {
        ownerState,
        classes
      }))
    });
  });
  const MenuItem$1 = MenuItem;
  function getSnackbarContentUtilityClass(slot) {
    return generateUtilityClass("MuiSnackbarContent", slot);
  }
  generateUtilityClasses("MuiSnackbarContent", ["root", "message", "action"]);
  const _excluded$1 = ["action", "className", "message", "role"];
  const useUtilityClasses$1 = (ownerState) => {
    const {
      classes
    } = ownerState;
    const slots = {
      root: ["root"],
      action: ["action"],
      message: ["message"]
    };
    return composeClasses(slots, getSnackbarContentUtilityClass, classes);
  };
  const SnackbarContentRoot = styled$1(Paper$1, {
    name: "MuiSnackbarContent",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })(({
    theme: theme2
  }) => {
    const emphasis = theme2.palette.mode === "light" ? 0.8 : 0.98;
    const backgroundColor2 = emphasize(theme2.palette.background.default, emphasis);
    return _extends({}, theme2.typography.body2, {
      color: theme2.vars ? theme2.vars.palette.SnackbarContent.color : theme2.palette.getContrastText(backgroundColor2),
      backgroundColor: theme2.vars ? theme2.vars.palette.SnackbarContent.bg : backgroundColor2,
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      padding: "6px 16px",
      borderRadius: (theme2.vars || theme2).shape.borderRadius,
      flexGrow: 1,
      [theme2.breakpoints.up("sm")]: {
        flexGrow: "initial",
        minWidth: 288
      }
    });
  });
  const SnackbarContentMessage = styled$1("div", {
    name: "MuiSnackbarContent",
    slot: "Message",
    overridesResolver: (props, styles2) => styles2.message
  })({
    padding: "8px 0"
  });
  const SnackbarContentAction = styled$1("div", {
    name: "MuiSnackbarContent",
    slot: "Action",
    overridesResolver: (props, styles2) => styles2.action
  })({
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    paddingLeft: 16,
    marginRight: -8
  });
  const SnackbarContent = /* @__PURE__ */ React__namespace.forwardRef(function SnackbarContent2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiSnackbarContent"
    });
    const {
      action,
      className,
      message,
      role = "alert"
    } = props, other = _objectWithoutPropertiesLoose(props, _excluded$1);
    const ownerState = props;
    const classes = useUtilityClasses$1(ownerState);
    return /* @__PURE__ */ jsxs(SnackbarContentRoot, _extends({
      role,
      square: true,
      elevation: 6,
      className: clsx(classes.root, className),
      ownerState,
      ref
    }, other, {
      children: [/* @__PURE__ */ jsx(SnackbarContentMessage, {
        className: classes.message,
        ownerState,
        children: message
      }), action ? /* @__PURE__ */ jsx(SnackbarContentAction, {
        className: classes.action,
        ownerState,
        children: action
      }) : null]
    }));
  });
  const SnackbarContent$1 = SnackbarContent;
  function getSnackbarUtilityClass(slot) {
    return generateUtilityClass("MuiSnackbar", slot);
  }
  generateUtilityClasses("MuiSnackbar", ["root", "anchorOriginTopCenter", "anchorOriginBottomCenter", "anchorOriginTopRight", "anchorOriginBottomRight", "anchorOriginTopLeft", "anchorOriginBottomLeft"]);
  const _excluded = ["onEnter", "onExited"], _excluded2 = ["action", "anchorOrigin", "autoHideDuration", "children", "className", "ClickAwayListenerProps", "ContentProps", "disableWindowBlurListener", "message", "onBlur", "onClose", "onFocus", "onMouseEnter", "onMouseLeave", "open", "resumeHideDuration", "TransitionComponent", "transitionDuration", "TransitionProps"];
  const useUtilityClasses = (ownerState) => {
    const {
      classes,
      anchorOrigin
    } = ownerState;
    const slots = {
      root: ["root", `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(anchorOrigin.horizontal)}`]
    };
    return composeClasses(slots, getSnackbarUtilityClass, classes);
  };
  const SnackbarRoot = styled$1("div", {
    name: "MuiSnackbar",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[`anchorOrigin${capitalize(ownerState.anchorOrigin.vertical)}${capitalize(ownerState.anchorOrigin.horizontal)}`]];
    }
  })(({
    theme: theme2,
    ownerState
  }) => {
    const center = {
      left: "50%",
      right: "auto",
      transform: "translateX(-50%)"
    };
    return _extends({
      zIndex: (theme2.vars || theme2).zIndex.snackbar,
      position: "fixed",
      display: "flex",
      left: 8,
      right: 8,
      justifyContent: "center",
      alignItems: "center"
    }, ownerState.anchorOrigin.vertical === "top" ? {
      top: 8
    } : {
      bottom: 8
    }, ownerState.anchorOrigin.horizontal === "left" && {
      justifyContent: "flex-start"
    }, ownerState.anchorOrigin.horizontal === "right" && {
      justifyContent: "flex-end"
    }, {
      [theme2.breakpoints.up("sm")]: _extends({}, ownerState.anchorOrigin.vertical === "top" ? {
        top: 24
      } : {
        bottom: 24
      }, ownerState.anchorOrigin.horizontal === "center" && center, ownerState.anchorOrigin.horizontal === "left" && {
        left: 24,
        right: "auto"
      }, ownerState.anchorOrigin.horizontal === "right" && {
        right: 24,
        left: "auto"
      })
    });
  });
  const Snackbar = /* @__PURE__ */ React__namespace.forwardRef(function Snackbar2(inProps, ref) {
    const props = useThemeProps({
      props: inProps,
      name: "MuiSnackbar"
    });
    const theme2 = useTheme();
    const defaultTransitionDuration = {
      enter: theme2.transitions.duration.enteringScreen,
      exit: theme2.transitions.duration.leavingScreen
    };
    const {
      action,
      anchorOrigin: {
        vertical,
        horizontal
      } = {
        vertical: "bottom",
        horizontal: "left"
      },
      autoHideDuration = null,
      children,
      className,
      ClickAwayListenerProps,
      ContentProps,
      disableWindowBlurListener = false,
      message,
      open,
      TransitionComponent = Grow$1,
      transitionDuration = defaultTransitionDuration,
      TransitionProps: {
        onEnter,
        onExited
      } = {}
    } = props, TransitionProps = _objectWithoutPropertiesLoose(props.TransitionProps, _excluded), other = _objectWithoutPropertiesLoose(props, _excluded2);
    const ownerState = _extends({}, props, {
      anchorOrigin: {
        vertical,
        horizontal
      },
      autoHideDuration,
      disableWindowBlurListener,
      TransitionComponent,
      transitionDuration
    });
    const classes = useUtilityClasses(ownerState);
    const {
      getRootProps,
      onClickAway
    } = useSnackbar(_extends({}, ownerState, {
      ref
    }));
    const [exited, setExited] = React__namespace.useState(true);
    const rootProps = useSlotProps({
      elementType: SnackbarRoot,
      getSlotProps: getRootProps,
      externalForwardedProps: other,
      ownerState,
      className: [classes.root, className]
    });
    const handleExited = (node2) => {
      setExited(true);
      if (onExited) {
        onExited(node2);
      }
    };
    const handleEnter = (node2, isAppearing) => {
      setExited(false);
      if (onEnter) {
        onEnter(node2, isAppearing);
      }
    };
    if (!open && exited) {
      return null;
    }
    return /* @__PURE__ */ jsx(ClickAwayListener, _extends({
      onClickAway
    }, ClickAwayListenerProps, {
      children: /* @__PURE__ */ jsx(SnackbarRoot, _extends({}, rootProps, {
        children: /* @__PURE__ */ jsx(TransitionComponent, _extends({
          appear: true,
          in: open,
          timeout: transitionDuration,
          direction: vertical === "top" ? "down" : "up",
          onEnter: handleEnter,
          onExited: handleExited
        }, TransitionProps, {
          children: children || /* @__PURE__ */ jsx(SnackbarContent$1, _extends({
            message,
            action
          }, ContentProps))
        }))
      }))
    }));
  });
  const Snackbar$1 = Snackbar;
  const useToast = () => {
    const [state, setState] = React2.useState({
      open: false,
      message: "",
      severity: "success"
    });
    const handleOpen = (toastMessage, toastSeverity) => {
      setState({
        open: true,
        message: toastMessage,
        severity: toastSeverity
      });
    };
    const handleClose = () => {
      setState({
        ...state,
        open: false
      });
    };
    return { ...state, handleOpen, handleClose };
  };
  const Z_INDEX_MAX = 2 ** 31 - 1;
  const CustomButton = newStyled(IconButton$1)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: ${Z_INDEX_MAX - 1};
  opacity: 0.75;
  transition: all 225ms linear;
  background-color: #c2e0ff;
  &:hover {
    opacity: 1;
    background-color: #99ccf3;
  }
`;
  const CustomMenu = newStyled(Menu$1)`
  z-index: ${Z_INDEX_MAX};
`;
  const App = () => {
    const [anchorEl, setAnchorEl] = React2.useState(null);
    const menuOpen = Boolean(anchorEl);
    const {
      open: toastOpen,
      message: toastMessage,
      severity: toastSeverity,
      handleOpen: handleToastOpen,
      handleClose: handleToastClose
    } = useToast();
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
    const copyToClipboard = (text) => {
      GM_setClipboard(text);
    };
    const getCookie = () => new Promise((resolve, reject) => {
      GM_cookie("list", {}, (cookie, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(cookie);
        }
      });
    });
    const getSession = async () => {
      try {
        const cookie = await getCookie();
        var sessionData = "";
        var ct = 0;
        for (let i = 0; i < cookie.length; i++) {
          var item = cookie[i];
          if (item.name === "ltuid") {
            sessionData += "ltuid=" + item.value + ";";
            ct++;
          }
          if (item.name === "ltoken") {
            sessionData += "ltoken=" + item.value + ";";
            ct++;
          }
          if (item.name === "cookie_token") {
            sessionData += "cookie_token=" + item.value + ";";
            ct++;
          }
          if (item.name === "account_id") {
            sessionData += "account_id=" + item.value + ";";
            ct++;
          }
        }
        if (ct === 4) {
          copyToClipboard(sessionData);
          handleToastOpen("Cookie \u6570\u636E\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F", "success");
        } else {
          handleToastOpen("Cookie \u83B7\u53D6\u672A\u6210\u529F\uFF0C\u8BF7\u5148\u767B\u5165", "error");
        }
      } catch (error) {
        handleToastOpen("\u83B7\u53D6 Cookie \u5931\u8D25", "error");
      }
    };
    const handleGetSession = () => {
      getSession();
      handleMenuClose();
    };
    return /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx(CustomButton, {
        color: "primary",
        id: "custom-button",
        "aria-controls": menuOpen ? "custom-menu" : void 0,
        "aria-haspopup": "true",
        "aria-expanded": menuOpen ? "true" : void 0,
        onClick: handleMenuOpen,
        children: /* @__PURE__ */ jsx(default_1$1, {})
      }), /* @__PURE__ */ jsx(CustomMenu, {
        id: "custom-menu",
        anchorEl,
        open: menuOpen,
        onClose: handleMenuClose,
        MenuListProps: {
          "aria-labelledby": "custom-button"
        },
        children: /* @__PURE__ */ jsxs(MenuItem$1, {
          onClick: handleGetSession,
          children: [/* @__PURE__ */ jsx(ListItemIcon$1, {
            children: /* @__PURE__ */ jsx(default_1, {
              fontSize: "small"
            })
          }), /* @__PURE__ */ jsx(ListItemText$1, {
            children: "\u5BFC\u51FA\u7C73\u6E38\u793ECookie\u6570\u636E"
          })]
        })
      }), /* @__PURE__ */ jsx(Snackbar$1, {
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center"
        },
        open: toastOpen,
        autoHideDuration: 2e3,
        onClose: handleToastClose,
        children: /* @__PURE__ */ jsx(Alert$1, {
          onClose: handleToastClose,
          severity: toastSeverity,
          sx: {
            width: "100%"
          },
          children: toastMessage
        })
      })]
    });
  };
  const container = document.createElement("div");
  container.id = "monkey";
  container.style.all = "initial";
  document.body.appendChild(container);
  const shadowContainer = container.attachShadow({
    mode: "closed"
  });
  const app = document.createElement("div");
  shadowContainer.appendChild(app);
  const emotionRoot = document.createElement("style");
  shadowContainer.appendChild(emotionRoot);
  const cache = createCache({
    key: "css",
    prepend: true,
    container: emotionRoot
  });
  const {
    fontSize
  } = window.getComputedStyle(document.documentElement);
  const htmlFontSize = parseFloat(fontSize);
  const theme = createTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container: app
        }
      },
      MuiPopper: {
        defaultProps: {
          container: app
        }
      },
      MuiModal: {
        defaultProps: {
          container: app
        }
      }
    },
    typography: {
      htmlFontSize
    }
  });
  client.createRoot(app).render(/* @__PURE__ */ jsx(React__default.default.StrictMode, {
    children: /* @__PURE__ */ jsx(CacheProvider, {
      value: cache,
      children: /* @__PURE__ */ jsx(ThemeProvider, {
        theme,
        children: /* @__PURE__ */ jsx(App, {})
      })
    })
  }));
})(React, ReactDOM);
 
