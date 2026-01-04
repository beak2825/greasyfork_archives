// ==UserScript==
// @name         wnacg-helper
// @namespace    https://www.wnacg.com/
// @version      0.0.3
// @author       dzh
// @description  A manga helper for wnacg.com
// @license      MIT
// @icon         https://www.wnacg.com/favicon.ico
// @match        https://www.wnacg.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/501482/wnacg-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/501482/wnacg-helper.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(' @import"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";.shortcut{display:none;position:absolute;bottom:5px;right:25px;border:none;padding:6px 10px;font-size:14px;color:#f0f8ff;background-color:#000;border-radius:25px}.shortcut:hover{background-color:#000c;cursor:pointer}.pic_box:hover .shortcut{display:block}.shortcut-icon{position:fixed;right:50px;bottom:50px;font-size:35px}.shortcut-icon:hover{cursor:pointer} ');

(function () {
  'use strict';

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var jquery = { exports: {} };
  /*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   */
  (function(module) {
    (function(global2, factory) {
      {
        module.exports = global2.document ? factory(global2, true) : function(w2) {
          if (!w2.document) {
            throw new Error("jQuery requires a window with a document");
          }
          return factory(w2);
        };
      }
    })(typeof window !== "undefined" ? window : commonjsGlobal, function(window2, noGlobal) {
      var arr = [];
      var getProto = Object.getPrototypeOf;
      var slice = arr.slice;
      var flat = arr.flat ? function(array) {
        return arr.flat.call(array);
      } : function(array) {
        return arr.concat.apply([], array);
      };
      var push = arr.push;
      var indexOf = arr.indexOf;
      var class2type = {};
      var toString = class2type.toString;
      var hasOwn = class2type.hasOwnProperty;
      var fnToString = hasOwn.toString;
      var ObjectFunctionString = fnToString.call(Object);
      var support = {};
      var isFunction = function isFunction2(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
      };
      var isWindow = function isWindow2(obj) {
        return obj != null && obj === obj.window;
      };
      var document2 = window2.document;
      var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
      };
      function DOMEval(code, node, doc) {
        doc = doc || document2;
        var i2, val, script = doc.createElement("script");
        script.text = code;
        if (node) {
          for (i2 in preservedScriptAttributes) {
            val = node[i2] || node.getAttribute && node.getAttribute(i2);
            if (val) {
              script.setAttribute(i2, val);
            }
          }
        }
        doc.head.appendChild(script).parentNode.removeChild(script);
      }
      function toType(obj) {
        if (obj == null) {
          return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
      }
      var version = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
      };
      jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
          if (num == null) {
            return slice.call(this);
          }
          return num < 0 ? this[num + this.length] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
          var ret = jQuery.merge(this.constructor(), elems);
          ret.prevObject = this;
          return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function(callback) {
          return jQuery.each(this, callback);
        },
        map: function(callback) {
          return this.pushStack(jQuery.map(this, function(elem, i2) {
            return callback.call(elem, i2, elem);
          }));
        },
        slice: function() {
          return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i2) {
            return (i2 + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i2) {
            return i2 % 2;
          }));
        },
        eq: function(i2) {
          var len = this.length, j2 = +i2 + (i2 < 0 ? len : 0);
          return this.pushStack(j2 >= 0 && j2 < len ? [this[j2]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push,
        sort: arr.sort,
        splice: arr.splice
      };
      jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i2 = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[i2] || {};
          i2++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
          target = {};
        }
        if (i2 === length) {
          target = this;
          i2--;
        }
        for (; i2 < length; i2++) {
          if ((options = arguments[i2]) != null) {
            for (name in options) {
              copy = options[name];
              if (name === "__proto__" || target === copy) {
                continue;
              }
              if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                src = target[name];
                if (copyIsArray && !Array.isArray(src)) {
                  clone = [];
                } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                  clone = {};
                } else {
                  clone = src;
                }
                copyIsArray = false;
                target[name] = jQuery.extend(deep, clone, copy);
              } else if (copy !== void 0) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      };
      jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function(msg) {
          throw new Error(msg);
        },
        noop: function() {
        },
        isPlainObject: function(obj) {
          var proto, Ctor;
          if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
          }
          proto = getProto(obj);
          if (!proto) {
            return true;
          }
          Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
          return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        isEmptyObject: function(obj) {
          var name;
          for (name in obj) {
            return false;
          }
          return true;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(code, options, doc) {
          DOMEval(code, { nonce: options && options.nonce }, doc);
        },
        each: function(obj, callback) {
          var length, i2 = 0;
          if (isArrayLike(obj)) {
            length = obj.length;
            for (; i2 < length; i2++) {
              if (callback.call(obj[i2], i2, obj[i2]) === false) {
                break;
              }
            }
          } else {
            for (i2 in obj) {
              if (callback.call(obj[i2], i2, obj[i2]) === false) {
                break;
              }
            }
          }
          return obj;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(elem) {
          var node, ret = "", i2 = 0, nodeType = elem.nodeType;
          if (!nodeType) {
            while (node = elem[i2++]) {
              ret += jQuery.text(node);
            }
          }
          if (nodeType === 1 || nodeType === 11) {
            return elem.textContent;
          }
          if (nodeType === 9) {
            return elem.documentElement.textContent;
          }
          if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
          }
          return ret;
        },
        // results is for internal usage only
        makeArray: function(arr2, results) {
          var ret = results || [];
          if (arr2 != null) {
            if (isArrayLike(Object(arr2))) {
              jQuery.merge(
                ret,
                typeof arr2 === "string" ? [arr2] : arr2
              );
            } else {
              push.call(ret, arr2);
            }
          }
          return ret;
        },
        inArray: function(elem, arr2, i2) {
          return arr2 == null ? -1 : indexOf.call(arr2, elem, i2);
        },
        isXMLDoc: function(elem) {
          var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
          return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(first, second) {
          var len = +second.length, j2 = 0, i2 = first.length;
          for (; j2 < len; j2++) {
            first[i2++] = second[j2];
          }
          first.length = i2;
          return first;
        },
        grep: function(elems, callback, invert) {
          var callbackInverse, matches = [], i2 = 0, length = elems.length, callbackExpect = !invert;
          for (; i2 < length; i2++) {
            callbackInverse = !callback(elems[i2], i2);
            if (callbackInverse !== callbackExpect) {
              matches.push(elems[i2]);
            }
          }
          return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
          var length, value, i2 = 0, ret = [];
          if (isArrayLike(elems)) {
            length = elems.length;
            for (; i2 < length; i2++) {
              value = callback(elems[i2], i2, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          } else {
            for (i2 in elems) {
              value = callback(elems[i2], i2, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          }
          return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support
      });
      if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
      }
      jQuery.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(_i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        }
      );
      function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length, type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
          return false;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
      }
      function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
      }
      var pop = arr.pop;
      var sort = arr.sort;
      var splice = arr.splice;
      var whitespace = "[\\x20\\t\\r\\n\\f]";
      var rtrimCSS = new RegExp(
        "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
        "g"
      );
      jQuery.contains = function(a2, b2) {
        var bup = b2 && b2.parentNode;
        return a2 === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (a2.contains ? a2.contains(bup) : a2.compareDocumentPosition && a2.compareDocumentPosition(bup) & 16));
      };
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function fcssescape(ch, asCodePoint) {
        if (asCodePoint) {
          if (ch === "\0") {
            return "�";
          }
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        return "\\" + ch;
      }
      jQuery.escapeSelector = function(sel) {
        return (sel + "").replace(rcssescape, fcssescape);
      };
      var preferredDoc = document2, pushNative = push;
      (function() {
        var i2, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a2, b2) {
          if (a2 === b2) {
            hasDuplicate = true;
          }
          return 0;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
          ID: new RegExp("^#(" + identifier + ")"),
          CLASS: new RegExp("^\\.(" + identifier + ")"),
          TAG: new RegExp("^(" + identifier + "|[*])"),
          ATTR: new RegExp("^" + attributes),
          PSEUDO: new RegExp("^" + pseudos),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + booleans + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
          var high = "0x" + escape.slice(1) - 65536;
          if (nonHex) {
            return nonHex;
          }
          return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        }, unloadHandler = function() {
          setDocument();
        }, inDisabledFieldset = addCombinator(
          function(elem) {
            return elem.disabled === true && nodeName(elem, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function safeActiveElement() {
          try {
            return document3.activeElement;
          } catch (err) {
          }
        }
        try {
          push2.apply(
            arr = slice.call(preferredDoc.childNodes),
            preferredDoc.childNodes
          );
          arr[preferredDoc.childNodes.length].nodeType;
        } catch (e2) {
          push2 = {
            apply: function(target, els) {
              pushNative.apply(target, slice.call(els));
            },
            call: function(target) {
              pushNative.apply(target, slice.call(arguments, 1));
            }
          };
        }
        function find(selector, context, results, seed) {
          var m2, i3, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
          results = results || [];
          if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
            return results;
          }
          if (!seed) {
            setDocument(context);
            context = context || document3;
            if (documentIsHTML) {
              if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                if (m2 = match[1]) {
                  if (nodeType === 9) {
                    if (elem = context.getElementById(m2)) {
                      if (elem.id === m2) {
                        push2.call(results, elem);
                        return results;
                      }
                    } else {
                      return results;
                    }
                  } else {
                    if (newContext && (elem = newContext.getElementById(m2)) && find.contains(context, elem) && elem.id === m2) {
                      push2.call(results, elem);
                      return results;
                    }
                  }
                } else if (match[2]) {
                  push2.apply(results, context.getElementsByTagName(selector));
                  return results;
                } else if ((m2 = match[3]) && context.getElementsByClassName) {
                  push2.apply(results, context.getElementsByClassName(m2));
                  return results;
                }
              }
              if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                newSelector = selector;
                newContext = context;
                if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                  newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                  if (newContext != context || !support.scope) {
                    if (nid = context.getAttribute("id")) {
                      nid = jQuery.escapeSelector(nid);
                    } else {
                      context.setAttribute("id", nid = expando);
                    }
                  }
                  groups = tokenize(selector);
                  i3 = groups.length;
                  while (i3--) {
                    groups[i3] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i3]);
                  }
                  newSelector = groups.join(",");
                }
                try {
                  push2.apply(
                    results,
                    newContext.querySelectorAll(newSelector)
                  );
                  return results;
                } catch (qsaError) {
                  nonnativeSelectorCache(selector, true);
                } finally {
                  if (nid === expando) {
                    context.removeAttribute("id");
                  }
                }
              }
            }
          }
          return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
        }
        function createCache() {
          var keys = [];
          function cache(key, value) {
            if (keys.push(key + " ") > Expr.cacheLength) {
              delete cache[keys.shift()];
            }
            return cache[key + " "] = value;
          }
          return cache;
        }
        function markFunction(fn2) {
          fn2[expando] = true;
          return fn2;
        }
        function assert(fn2) {
          var el2 = document3.createElement("fieldset");
          try {
            return !!fn2(el2);
          } catch (e2) {
            return false;
          } finally {
            if (el2.parentNode) {
              el2.parentNode.removeChild(el2);
            }
            el2 = null;
          }
        }
        function createInputPseudo(type) {
          return function(elem) {
            return nodeName(elem, "input") && elem.type === type;
          };
        }
        function createButtonPseudo(type) {
          return function(elem) {
            return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
          };
        }
        function createDisabledPseudo(disabled) {
          return function(elem) {
            if ("form" in elem) {
              if (elem.parentNode && elem.disabled === false) {
                if ("label" in elem) {
                  if ("label" in elem.parentNode) {
                    return elem.parentNode.disabled === disabled;
                  } else {
                    return elem.disabled === disabled;
                  }
                }
                return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
              }
              return elem.disabled === disabled;
            } else if ("label" in elem) {
              return elem.disabled === disabled;
            }
            return false;
          };
        }
        function createPositionalPseudo(fn2) {
          return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches2) {
              var j2, matchIndexes = fn2([], seed.length, argument), i3 = matchIndexes.length;
              while (i3--) {
                if (seed[j2 = matchIndexes[i3]]) {
                  seed[j2] = !(matches2[j2] = seed[j2]);
                }
              }
            });
          });
        }
        function testContext(context) {
          return context && typeof context.getElementsByTagName !== "undefined" && context;
        }
        function setDocument(node) {
          var subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
          if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
            return document3;
          }
          document3 = doc;
          documentElement2 = document3.documentElement;
          documentIsHTML = !jQuery.isXMLDoc(document3);
          matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
          if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
            subWindow.addEventListener("unload", unloadHandler);
          }
          support.getById = assert(function(el2) {
            documentElement2.appendChild(el2).id = jQuery.expando;
            return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
          });
          support.disconnectedMatch = assert(function(el2) {
            return matches.call(el2, "*");
          });
          support.scope = assert(function() {
            return document3.querySelectorAll(":scope");
          });
          support.cssHas = assert(function() {
            try {
              document3.querySelector(":has(*,:jqfake)");
              return false;
            } catch (e2) {
              return true;
            }
          });
          if (support.getById) {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                return elem.getAttribute("id") === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var elem = context.getElementById(id);
                return elem ? [elem] : [];
              }
            };
          } else {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return node2 && node2.value === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var node2, i3, elems, elem = context.getElementById(id);
                if (elem) {
                  node2 = elem.getAttributeNode("id");
                  if (node2 && node2.value === id) {
                    return [elem];
                  }
                  elems = context.getElementsByName(id);
                  i3 = 0;
                  while (elem = elems[i3++]) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                  }
                }
                return [];
              }
            };
          }
          Expr.find.TAG = function(tag, context) {
            if (typeof context.getElementsByTagName !== "undefined") {
              return context.getElementsByTagName(tag);
            } else {
              return context.querySelectorAll(tag);
            }
          };
          Expr.find.CLASS = function(className, context) {
            if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
              return context.getElementsByClassName(className);
            }
          };
          rbuggyQSA = [];
          assert(function(el2) {
            var input;
            documentElement2.appendChild(el2).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
            if (!el2.querySelectorAll("[selected]").length) {
              rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
            }
            if (!el2.querySelectorAll("[id~=" + expando + "-]").length) {
              rbuggyQSA.push("~=");
            }
            if (!el2.querySelectorAll("a#" + expando + "+*").length) {
              rbuggyQSA.push(".#.+[+~]");
            }
            if (!el2.querySelectorAll(":checked").length) {
              rbuggyQSA.push(":checked");
            }
            input = document3.createElement("input");
            input.setAttribute("type", "hidden");
            el2.appendChild(input).setAttribute("name", "D");
            documentElement2.appendChild(el2).disabled = true;
            if (el2.querySelectorAll(":disabled").length !== 2) {
              rbuggyQSA.push(":enabled", ":disabled");
            }
            input = document3.createElement("input");
            input.setAttribute("name", "");
            el2.appendChild(input);
            if (!el2.querySelectorAll("[name='']").length) {
              rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
            }
          });
          if (!support.cssHas) {
            rbuggyQSA.push(":has");
          }
          rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
          sortOrder = function(a2, b2) {
            if (a2 === b2) {
              hasDuplicate = true;
              return 0;
            }
            var compare = !a2.compareDocumentPosition - !b2.compareDocumentPosition;
            if (compare) {
              return compare;
            }
            compare = (a2.ownerDocument || a2) == (b2.ownerDocument || b2) ? a2.compareDocumentPosition(b2) : (
              // Otherwise we know they are disconnected
              1
            );
            if (compare & 1 || !support.sortDetached && b2.compareDocumentPosition(a2) === compare) {
              if (a2 === document3 || a2.ownerDocument == preferredDoc && find.contains(preferredDoc, a2)) {
                return -1;
              }
              if (b2 === document3 || b2.ownerDocument == preferredDoc && find.contains(preferredDoc, b2)) {
                return 1;
              }
              return sortInput ? indexOf.call(sortInput, a2) - indexOf.call(sortInput, b2) : 0;
            }
            return compare & 4 ? -1 : 1;
          };
          return document3;
        }
        find.matches = function(expr, elements) {
          return find(expr, null, null, elements);
        };
        find.matchesSelector = function(elem, expr) {
          setDocument(elem);
          if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
            try {
              var ret = matches.call(elem, expr);
              if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              elem.document && elem.document.nodeType !== 11) {
                return ret;
              }
            } catch (e2) {
              nonnativeSelectorCache(expr, true);
            }
          }
          return find(expr, document3, null, [elem]).length > 0;
        };
        find.contains = function(context, elem) {
          if ((context.ownerDocument || context) != document3) {
            setDocument(context);
          }
          return jQuery.contains(context, elem);
        };
        find.attr = function(elem, name) {
          if ((elem.ownerDocument || elem) != document3) {
            setDocument(elem);
          }
          var fn2 = Expr.attrHandle[name.toLowerCase()], val = fn2 && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn2(elem, name, !documentIsHTML) : void 0;
          if (val !== void 0) {
            return val;
          }
          return elem.getAttribute(name);
        };
        find.error = function(msg) {
          throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        jQuery.uniqueSort = function(results) {
          var elem, duplicates = [], j2 = 0, i3 = 0;
          hasDuplicate = !support.sortStable;
          sortInput = !support.sortStable && slice.call(results, 0);
          sort.call(results, sortOrder);
          if (hasDuplicate) {
            while (elem = results[i3++]) {
              if (elem === results[i3]) {
                j2 = duplicates.push(i3);
              }
            }
            while (j2--) {
              splice.call(results, duplicates[j2], 1);
            }
          }
          sortInput = null;
          return results;
        };
        jQuery.fn.uniqueSort = function() {
          return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
        };
        Expr = jQuery.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: markFunction,
          match: matchExpr,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(match) {
              match[1] = match[1].replace(runescape, funescape);
              match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
              if (match[2] === "~=") {
                match[3] = " " + match[3] + " ";
              }
              return match.slice(0, 4);
            },
            CHILD: function(match) {
              match[1] = match[1].toLowerCase();
              if (match[1].slice(0, 3) === "nth") {
                if (!match[3]) {
                  find.error(match[0]);
                }
                match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                match[5] = +(match[7] + match[8] || match[3] === "odd");
              } else if (match[3]) {
                find.error(match[0]);
              }
              return match;
            },
            PSEUDO: function(match) {
              var excess, unquoted = !match[6] && match[2];
              if (matchExpr.CHILD.test(match[0])) {
                return null;
              }
              if (match[3]) {
                match[2] = match[4] || match[5] || "";
              } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
              (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
              (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                match[0] = match[0].slice(0, excess);
                match[2] = unquoted.slice(0, excess);
              }
              return match.slice(0, 3);
            }
          },
          filter: {
            TAG: function(nodeNameSelector) {
              var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
              return nodeNameSelector === "*" ? function() {
                return true;
              } : function(elem) {
                return nodeName(elem, expectedNodeName);
              };
            },
            CLASS: function(className) {
              var pattern = classCache[className + " "];
              return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                return pattern.test(
                  typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(name, operator, check) {
              return function(elem) {
                var result = find.attr(elem, name);
                if (result == null) {
                  return operator === "!=";
                }
                if (!operator) {
                  return true;
                }
                result += "";
                if (operator === "=") {
                  return result === check;
                }
                if (operator === "!=") {
                  return result !== check;
                }
                if (operator === "^=") {
                  return check && result.indexOf(check) === 0;
                }
                if (operator === "*=") {
                  return check && result.indexOf(check) > -1;
                }
                if (operator === "$=") {
                  return check && result.slice(-check.length) === check;
                }
                if (operator === "~=") {
                  return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                }
                if (operator === "|=") {
                  return result === check || result.slice(0, check.length + 1) === check + "-";
                }
                return false;
              };
            },
            CHILD: function(type, what, _argument, first, last) {
              var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
              return first === 1 && last === 0 ? (
                // Shortcut for :nth-*(n)
                function(elem) {
                  return !!elem.parentNode;
                }
              ) : function(elem, _context, xml) {
                var cache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                if (parent) {
                  if (simple) {
                    while (dir2) {
                      node = elem;
                      while (node = node[dir2]) {
                        if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                          return false;
                        }
                      }
                      start = dir2 = type === "only" && !start && "nextSibling";
                    }
                    return true;
                  }
                  start = [forward ? parent.firstChild : parent.lastChild];
                  if (forward && useCache) {
                    outerCache = parent[expando] || (parent[expando] = {});
                    cache = outerCache[type] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff = nodeIndex && cache[2];
                    node = nodeIndex && parent.childNodes[nodeIndex];
                    while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                    (diff = nodeIndex = 0) || start.pop()) {
                      if (node.nodeType === 1 && ++diff && node === elem) {
                        outerCache[type] = [dirruns, nodeIndex, diff];
                        break;
                      }
                    }
                  } else {
                    if (useCache) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      cache = outerCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex;
                    }
                    if (diff === false) {
                      while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                        if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                          if (useCache) {
                            outerCache = node[expando] || (node[expando] = {});
                            outerCache[type] = [dirruns, diff];
                          }
                          if (node === elem) {
                            break;
                          }
                        }
                      }
                    }
                  }
                  diff -= last;
                  return diff === first || diff % first === 0 && diff / first >= 0;
                }
              };
            },
            PSEUDO: function(pseudo, argument) {
              var args, fn2 = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
              if (fn2[expando]) {
                return fn2(argument);
              }
              if (fn2.length > 1) {
                args = [pseudo, pseudo, "", argument];
                return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                  var idx, matched = fn2(seed, argument), i3 = matched.length;
                  while (i3--) {
                    idx = indexOf.call(seed, matched[i3]);
                    seed[idx] = !(matches2[idx] = matched[i3]);
                  }
                }) : function(elem) {
                  return fn2(elem, 0, args);
                };
              }
              return fn2;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: markFunction(function(selector) {
              var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
              return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                var elem, unmatched = matcher(seed, null, xml, []), i3 = seed.length;
                while (i3--) {
                  if (elem = unmatched[i3]) {
                    seed[i3] = !(matches2[i3] = elem);
                  }
                }
              }) : function(elem, _context, xml) {
                input[0] = elem;
                matcher(input, null, xml, results);
                input[0] = null;
                return !results.pop();
              };
            }),
            has: markFunction(function(selector) {
              return function(elem) {
                return find(selector, elem).length > 0;
              };
            }),
            contains: markFunction(function(text) {
              text = text.replace(runescape, funescape);
              return function(elem) {
                return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: markFunction(function(lang) {
              if (!ridentifier.test(lang || "")) {
                find.error("unsupported lang: " + lang);
              }
              lang = lang.replace(runescape, funescape).toLowerCase();
              return function(elem) {
                var elemLang;
                do {
                  if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                    elemLang = elemLang.toLowerCase();
                    return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                  }
                } while ((elem = elem.parentNode) && elem.nodeType === 1);
                return false;
              };
            }),
            // Miscellaneous
            target: function(elem) {
              var hash = window2.location && window2.location.hash;
              return hash && hash.slice(1) === elem.id;
            },
            root: function(elem) {
              return elem === documentElement2;
            },
            focus: function(elem) {
              return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
            },
            // Boolean properties
            enabled: createDisabledPseudo(false),
            disabled: createDisabledPseudo(true),
            checked: function(elem) {
              return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
            },
            selected: function(elem) {
              if (elem.parentNode) {
                elem.parentNode.selectedIndex;
              }
              return elem.selected === true;
            },
            // Contents
            empty: function(elem) {
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                if (elem.nodeType < 6) {
                  return false;
                }
              }
              return true;
            },
            parent: function(elem) {
              return !Expr.pseudos.empty(elem);
            },
            // Element/input types
            header: function(elem) {
              return rheader.test(elem.nodeName);
            },
            input: function(elem) {
              return rinputs.test(elem.nodeName);
            },
            button: function(elem) {
              return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
            },
            text: function(elem) {
              var attr;
              return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
            },
            // Position-in-collection
            first: createPositionalPseudo(function() {
              return [0];
            }),
            last: createPositionalPseudo(function(_matchIndexes, length) {
              return [length - 1];
            }),
            eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
              return [argument < 0 ? argument + length : argument];
            }),
            even: createPositionalPseudo(function(matchIndexes, length) {
              var i3 = 0;
              for (; i3 < length; i3 += 2) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            }),
            odd: createPositionalPseudo(function(matchIndexes, length) {
              var i3 = 1;
              for (; i3 < length; i3 += 2) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            }),
            lt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i3;
              if (argument < 0) {
                i3 = argument + length;
              } else if (argument > length) {
                i3 = length;
              } else {
                i3 = argument;
              }
              for (; --i3 >= 0; ) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            }),
            gt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i3 = argument < 0 ? argument + length : argument;
              for (; ++i3 < length; ) {
                matchIndexes.push(i3);
              }
              return matchIndexes;
            })
          }
        };
        Expr.pseudos.nth = Expr.pseudos.eq;
        for (i2 in { radio: true, checkbox: true, file: true, password: true, image: true }) {
          Expr.pseudos[i2] = createInputPseudo(i2);
        }
        for (i2 in { submit: true, reset: true }) {
          Expr.pseudos[i2] = createButtonPseudo(i2);
        }
        function setFilters() {
        }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        function tokenize(selector, parseOnly) {
          var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
          if (cached) {
            return parseOnly ? 0 : cached.slice(0);
          }
          soFar = selector;
          groups = [];
          preFilters = Expr.preFilter;
          while (soFar) {
            if (!matched || (match = rcomma.exec(soFar))) {
              if (match) {
                soFar = soFar.slice(match[0].length) || soFar;
              }
              groups.push(tokens = []);
            }
            matched = false;
            if (match = rleadingCombinator.exec(soFar)) {
              matched = match.shift();
              tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace(rtrimCSS, " ")
              });
              soFar = soFar.slice(matched.length);
            }
            for (type in Expr.filter) {
              if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  type,
                  matches: match
                });
                soFar = soFar.slice(matched.length);
              }
            }
            if (!matched) {
              break;
            }
          }
          if (parseOnly) {
            return soFar.length;
          }
          return soFar ? find.error(selector) : (
            // Cache the tokens
            tokenCache(selector, groups).slice(0)
          );
        }
        function toSelector(tokens) {
          var i3 = 0, len = tokens.length, selector = "";
          for (; i3 < len; i3++) {
            selector += tokens[i3].value;
          }
          return selector;
        }
        function addCombinator(matcher, combinator, base) {
          var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
          return combinator.first ? (
            // Check against closest ancestor/preceding element
            function(elem, context, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context, xml);
                }
              }
              return false;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(elem, context, xml) {
              var oldCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if (skip && nodeName(elem, skip)) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      outerCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            }
          );
        }
        function elementMatcher(matchers) {
          return matchers.length > 1 ? function(elem, context, xml) {
            var i3 = matchers.length;
            while (i3--) {
              if (!matchers[i3](elem, context, xml)) {
                return false;
              }
            }
            return true;
          } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
          var i3 = 0, len = contexts.length;
          for (; i3 < len; i3++) {
            find(selector, contexts[i3], results);
          }
          return results;
        }
        function condense(unmatched, map, filter, context, xml) {
          var elem, newUnmatched = [], i3 = 0, len = unmatched.length, mapped = map != null;
          for (; i3 < len; i3++) {
            if (elem = unmatched[i3]) {
              if (!filter || filter(elem, context, xml)) {
                newUnmatched.push(elem);
                if (mapped) {
                  map.push(i3);
                }
              }
            }
          }
          return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
          if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
          }
          if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
          }
          return markFunction(function(seed, results, context, xml) {
            var temp, i3, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
              selector || "*",
              context.nodeType ? [context] : context,
              []
            ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
            if (matcher) {
              matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                results
              );
              matcher(matcherIn, matcherOut, context, xml);
            } else {
              matcherOut = matcherIn;
            }
            if (postFilter) {
              temp = condense(matcherOut, postMap);
              postFilter(temp, [], context, xml);
              i3 = temp.length;
              while (i3--) {
                if (elem = temp[i3]) {
                  matcherOut[postMap[i3]] = !(matcherIn[postMap[i3]] = elem);
                }
              }
            }
            if (seed) {
              if (postFinder || preFilter) {
                if (postFinder) {
                  temp = [];
                  i3 = matcherOut.length;
                  while (i3--) {
                    if (elem = matcherOut[i3]) {
                      temp.push(matcherIn[i3] = elem);
                    }
                  }
                  postFinder(null, matcherOut = [], temp, xml);
                }
                i3 = matcherOut.length;
                while (i3--) {
                  if ((elem = matcherOut[i3]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i3]) > -1) {
                    seed[temp] = !(results[temp] = elem);
                  }
                }
              }
            } else {
              matcherOut = condense(
                matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
              );
              if (postFinder) {
                postFinder(null, results, matcherOut, xml);
              } else {
                push2.apply(results, matcherOut);
              }
            }
          });
        }
        function matcherFromTokens(tokens) {
          var checkContext, matcher, j2, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i3 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
            return indexOf.call(checkContext, elem) > -1;
          }, implicitRelative, true), matchers = [function(elem, context, xml) {
            var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          }];
          for (; i3 < len; i3++) {
            if (matcher = Expr.relative[tokens[i3].type]) {
              matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
              matcher = Expr.filter[tokens[i3].type].apply(null, tokens[i3].matches);
              if (matcher[expando]) {
                j2 = ++i3;
                for (; j2 < len; j2++) {
                  if (Expr.relative[tokens[j2].type]) {
                    break;
                  }
                }
                return setMatcher(
                  i3 > 1 && elementMatcher(matchers),
                  i3 > 1 && toSelector(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    tokens.slice(0, i3 - 1).concat({ value: tokens[i3 - 2].type === " " ? "*" : "" })
                  ).replace(rtrimCSS, "$1"),
                  matcher,
                  i3 < j2 && matcherFromTokens(tokens.slice(i3, j2)),
                  j2 < len && matcherFromTokens(tokens = tokens.slice(j2)),
                  j2 < len && toSelector(tokens)
                );
              }
              matchers.push(matcher);
            }
          }
          return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
          var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
            var elem, j2, matcher, matchedCount = 0, i3 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
            if (outermost) {
              outermostContext = context == document3 || context || outermost;
            }
            for (; i3 !== len && (elem = elems[i3]) != null; i3++) {
              if (byElement && elem) {
                j2 = 0;
                if (!context && elem.ownerDocument != document3) {
                  setDocument(elem);
                  xml = !documentIsHTML;
                }
                while (matcher = elementMatchers[j2++]) {
                  if (matcher(elem, context || document3, xml)) {
                    push2.call(results, elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if (elem = !matcher && elem) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i3;
            if (bySet && i3 !== matchedCount) {
              j2 = 0;
              while (matcher = setMatchers[j2++]) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i3--) {
                    if (!(unmatched[i3] || setMatched[i3])) {
                      setMatched[i3] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push2.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                jQuery.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
          return bySet ? markFunction(superMatcher) : superMatcher;
        }
        function compile(selector, match) {
          var i3, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
          if (!cached) {
            if (!match) {
              match = tokenize(selector);
            }
            i3 = match.length;
            while (i3--) {
              cached = matcherFromTokens(match[i3]);
              if (cached[expando]) {
                setMatchers.push(cached);
              } else {
                elementMatchers.push(cached);
              }
            }
            cached = compilerCache(
              selector,
              matcherFromGroupMatchers(elementMatchers, setMatchers)
            );
            cached.selector = selector;
          }
          return cached;
        }
        function select(selector, context, results, seed) {
          var i3, tokens, token, type, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
          results = results || [];
          if (match.length === 1) {
            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
              context = (Expr.find.ID(
                token.matches[0].replace(runescape, funescape),
                context
              ) || [])[0];
              if (!context) {
                return results;
              } else if (compiled) {
                context = context.parentNode;
              }
              selector = selector.slice(tokens.shift().value.length);
            }
            i3 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
            while (i3--) {
              token = tokens[i3];
              if (Expr.relative[type = token.type]) {
                break;
              }
              if (find2 = Expr.find[type]) {
                if (seed = find2(
                  token.matches[0].replace(runescape, funescape),
                  rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                )) {
                  tokens.splice(i3, 1);
                  selector = seed.length && toSelector(tokens);
                  if (!selector) {
                    push2.apply(results, seed);
                    return results;
                  }
                  break;
                }
              }
            }
          }
          (compiled || compile(selector, match))(
            seed,
            context,
            !documentIsHTML,
            results,
            !context || rsibling.test(selector) && testContext(context.parentNode) || context
          );
          return results;
        }
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        setDocument();
        support.sortDetached = assert(function(el2) {
          return el2.compareDocumentPosition(document3.createElement("fieldset")) & 1;
        });
        jQuery.find = find;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = jQuery.uniqueSort;
        find.compile = compile;
        find.select = select;
        find.setDocument = setDocument;
        find.tokenize = tokenize;
        find.escape = jQuery.escapeSelector;
        find.getText = jQuery.text;
        find.isXML = jQuery.isXMLDoc;
        find.selectors = jQuery.expr;
        find.support = jQuery.support;
        find.uniqueSort = jQuery.uniqueSort;
      })();
      var dir = function(elem, dir2, until) {
        var matched = [], truncate = until !== void 0;
        while ((elem = elem[dir2]) && elem.nodeType !== 9) {
          if (elem.nodeType === 1) {
            if (truncate && jQuery(elem).is(until)) {
              break;
            }
            matched.push(elem);
          }
        }
        return matched;
      };
      var siblings = function(n2, elem) {
        var matched = [];
        for (; n2; n2 = n2.nextSibling) {
          if (n2.nodeType === 1 && n2 !== elem) {
            matched.push(n2);
          }
        }
        return matched;
      };
      var rneedsContext = jQuery.expr.match.needsContext;
      var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function winnow(elements, qualifier, not) {
        if (isFunction(qualifier)) {
          return jQuery.grep(elements, function(elem, i2) {
            return !!qualifier.call(elem, i2, elem) !== not;
          });
        }
        if (qualifier.nodeType) {
          return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
          });
        }
        if (typeof qualifier !== "string") {
          return jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
          });
        }
        return jQuery.filter(qualifier, elements, not);
      }
      jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        if (not) {
          expr = ":not(" + expr + ")";
        }
        if (elems.length === 1 && elem.nodeType === 1) {
          return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
        }
        return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
          return elem2.nodeType === 1;
        }));
      };
      jQuery.fn.extend({
        find: function(selector) {
          var i2, ret, len = this.length, self2 = this;
          if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function() {
              for (i2 = 0; i2 < len; i2++) {
                if (jQuery.contains(self2[i2], this)) {
                  return true;
                }
              }
            }));
          }
          ret = this.pushStack([]);
          for (i2 = 0; i2 < len; i2++) {
            jQuery.find(selector, self2[i2], ret);
          }
          return len > 1 ? jQuery.uniqueSort(ret) : ret;
        },
        filter: function(selector) {
          return this.pushStack(winnow(this, selector || [], false));
        },
        not: function(selector) {
          return this.pushStack(winnow(this, selector || [], true));
        },
        is: function(selector) {
          return !!winnow(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
            false
          ).length;
        }
      });
      var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
        var match, elem;
        if (!selector) {
          return this;
        }
        root = root || rootjQuery;
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match = [null, selector, null];
          } else {
            match = rquickExpr.exec(selector);
          }
          if (match && (match[1] || !context)) {
            if (match[1]) {
              context = context instanceof jQuery ? context[0] : context;
              jQuery.merge(this, jQuery.parseHTML(
                match[1],
                context && context.nodeType ? context.ownerDocument || context : document2,
                true
              ));
              if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                for (match in context) {
                  if (isFunction(this[match])) {
                    this[match](context[match]);
                  } else {
                    this.attr(match, context[match]);
                  }
                }
              }
              return this;
            } else {
              elem = document2.getElementById(match[2]);
              if (elem) {
                this[0] = elem;
                this.length = 1;
              }
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || root).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
          return this;
        } else if (isFunction(selector)) {
          return root.ready !== void 0 ? root.ready(selector) : (
            // Execute immediately if ready is not present
            selector(jQuery)
          );
        }
        return jQuery.makeArray(selector, this);
      };
      init.prototype = jQuery.fn;
      rootjQuery = jQuery(document2);
      var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
      jQuery.fn.extend({
        has: function(target) {
          var targets = jQuery(target, this), l2 = targets.length;
          return this.filter(function() {
            var i2 = 0;
            for (; i2 < l2; i2++) {
              if (jQuery.contains(this, targets[i2])) {
                return true;
              }
            }
          });
        },
        closest: function(selectors, context) {
          var cur, i2 = 0, l2 = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
          if (!rneedsContext.test(selectors)) {
            for (; i2 < l2; i2++) {
              for (cur = this[i2]; cur && cur !== context; cur = cur.parentNode) {
                if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                ))) {
                  matched.push(cur);
                  break;
                }
              }
            }
          }
          return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },
        // Determine the position of an element within the set
        index: function(elem) {
          if (!elem) {
            return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
          }
          if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
          }
          return indexOf.call(
            this,
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
          );
        },
        add: function(selector, context) {
          return this.pushStack(
            jQuery.uniqueSort(
              jQuery.merge(this.get(), jQuery(selector, context))
            )
          );
        },
        addBack: function(selector) {
          return this.add(
            selector == null ? this.prevObject : this.prevObject.filter(selector)
          );
        }
      });
      function sibling(cur, dir2) {
        while ((cur = cur[dir2]) && cur.nodeType !== 1) {
        }
        return cur;
      }
      jQuery.each({
        parent: function(elem) {
          var parent = elem.parentNode;
          return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
          return dir(elem, "parentNode");
        },
        parentsUntil: function(elem, _i, until) {
          return dir(elem, "parentNode", until);
        },
        next: function(elem) {
          return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
          return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
          return dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
          return dir(elem, "previousSibling");
        },
        nextUntil: function(elem, _i, until) {
          return dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, _i, until) {
          return dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
          return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
          return siblings(elem.firstChild);
        },
        contents: function(elem) {
          if (elem.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          getProto(elem.contentDocument)) {
            return elem.contentDocument;
          }
          if (nodeName(elem, "template")) {
            elem = elem.content || elem;
          }
          return jQuery.merge([], elem.childNodes);
        }
      }, function(name, fn2) {
        jQuery.fn[name] = function(until, selector) {
          var matched = jQuery.map(this, fn2, until);
          if (name.slice(-5) !== "Until") {
            selector = until;
          }
          if (selector && typeof selector === "string") {
            matched = jQuery.filter(selector, matched);
          }
          if (this.length > 1) {
            if (!guaranteedUnique[name]) {
              jQuery.uniqueSort(matched);
            }
            if (rparentsprev.test(name)) {
              matched.reverse();
            }
          }
          return this.pushStack(matched);
        };
      });
      var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
      function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnothtmlwhite) || [], function(_2, flag) {
          object[flag] = true;
        });
        return object;
      }
      jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
          locked = locked || options.once;
          fired = firing = true;
          for (; queue.length; firingIndex = -1) {
            memory = queue.shift();
            while (++firingIndex < list.length) {
              if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                firingIndex = list.length;
                memory = false;
              }
            }
          }
          if (!options.memory) {
            memory = false;
          }
          firing = false;
          if (locked) {
            if (memory) {
              list = [];
            } else {
              list = "";
            }
          }
        }, self2 = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            if (list) {
              if (memory && !firing) {
                firingIndex = list.length - 1;
                queue.push(memory);
              }
              (function add(args) {
                jQuery.each(args, function(_2, arg) {
                  if (isFunction(arg)) {
                    if (!options.unique || !self2.has(arg)) {
                      list.push(arg);
                    }
                  } else if (arg && arg.length && toType(arg) !== "string") {
                    add(arg);
                  }
                });
              })(arguments);
              if (memory && !firing) {
                fire();
              }
            }
            return this;
          },
          // Remove a callback from the list
          remove: function() {
            jQuery.each(arguments, function(_2, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            });
            return this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(fn2) {
            return fn2 ? jQuery.inArray(fn2, list) > -1 : list.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            if (list) {
              list = [];
            }
            return this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            locked = queue = [];
            list = memory = "";
            return this;
          },
          disabled: function() {
            return !list;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            locked = queue = [];
            if (!memory && !firing) {
              list = memory = "";
            }
            return this;
          },
          locked: function() {
            return !!locked;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(context, args) {
            if (!locked) {
              args = args || [];
              args = [context, args.slice ? args.slice() : args];
              queue.push(args);
              if (!firing) {
                fire();
              }
            }
            return this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            self2.fireWith(this, arguments);
            return this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!fired;
          }
        };
        return self2;
      };
      function Identity(v2) {
        return v2;
      }
      function Thrower(ex) {
        throw ex;
      }
      function adoptValue(value, resolve, reject, noValue) {
        var method;
        try {
          if (value && isFunction(method = value.promise)) {
            method.call(value).done(resolve).fail(reject);
          } else if (value && isFunction(method = value.then)) {
            method.call(value, resolve, reject);
          } else {
            resolve.apply(void 0, [value].slice(noValue));
          }
        } catch (value2) {
          reject.apply(void 0, [value2]);
        }
      }
      jQuery.extend({
        Deferred: function(func) {
          var tuples = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              jQuery.Callbacks("memory"),
              jQuery.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], state = "pending", promise = {
            state: function() {
              return state;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            "catch": function(fn2) {
              return promise.then(null, fn2);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(_i, tuple) {
                  var fn2 = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                  deferred[tuple[1]](function() {
                    var returned = fn2 && fn2.apply(this, arguments);
                    if (returned && isFunction(returned.promise)) {
                      returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                    } else {
                      newDefer[tuple[0] + "With"](
                        this,
                        fn2 ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            then: function(onFulfilled, onRejected, onProgress) {
              var maxDepth = 0;
              function resolve(depth, deferred2, handler, special) {
                return function() {
                  var that = this, args = arguments, mightThrow = function() {
                    var returned, then;
                    if (depth < maxDepth) {
                      return;
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred2.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then = returned && // Support: Promises/A+ section 2.3.4
                    // https://promisesaplus.com/#point-64
                    // Only check objects and functions for thenability
                    (typeof returned === "object" || typeof returned === "function") && returned.then;
                    if (isFunction(then)) {
                      if (special) {
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special)
                        );
                      } else {
                        maxDepth++;
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special),
                          resolve(
                            maxDepth,
                            deferred2,
                            Identity,
                            deferred2.notifyWith
                          )
                        );
                      }
                    } else {
                      if (handler !== Identity) {
                        that = void 0;
                        args = [returned];
                      }
                      (special || deferred2.resolveWith)(that, args);
                    }
                  }, process = special ? mightThrow : function() {
                    try {
                      mightThrow();
                    } catch (e2) {
                      if (jQuery.Deferred.exceptionHook) {
                        jQuery.Deferred.exceptionHook(
                          e2,
                          process.error
                        );
                      }
                      if (depth + 1 >= maxDepth) {
                        if (handler !== Thrower) {
                          that = void 0;
                          args = [e2];
                        }
                        deferred2.rejectWith(that, args);
                      }
                    }
                  };
                  if (depth) {
                    process();
                  } else {
                    if (jQuery.Deferred.getErrorHook) {
                      process.error = jQuery.Deferred.getErrorHook();
                    } else if (jQuery.Deferred.getStackHook) {
                      process.error = jQuery.Deferred.getStackHook();
                    }
                    window2.setTimeout(process);
                  }
                };
              }
              return jQuery.Deferred(function(newDefer) {
                tuples[0][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onProgress) ? onProgress : Identity,
                    newDefer.notifyWith
                  )
                );
                tuples[1][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onFulfilled) ? onFulfilled : Identity
                  )
                );
                tuples[2][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onRejected) ? onRejected : Thrower
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          }, deferred = {};
          jQuery.each(tuples, function(i2, tuple) {
            var list = tuple[2], stateString = tuple[5];
            promise[tuple[1]] = list.add;
            if (stateString) {
              list.add(
                function() {
                  state = stateString;
                },
                // rejected_callbacks.disable
                // fulfilled_callbacks.disable
                tuples[3 - i2][2].disable,
                // rejected_handlers.disable
                // fulfilled_handlers.disable
                tuples[3 - i2][3].disable,
                // progress_callbacks.lock
                tuples[0][2].lock,
                // progress_handlers.lock
                tuples[0][3].lock
              );
            }
            list.add(tuple[3].fire);
            deferred[tuple[0]] = function() {
              deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
              return this;
            };
            deferred[tuple[0] + "With"] = list.fireWith;
          });
          promise.promise(deferred);
          if (func) {
            func.call(deferred, deferred);
          }
          return deferred;
        },
        // Deferred helper
        when: function(singleValue) {
          var remaining = arguments.length, i2 = remaining, resolveContexts = Array(i2), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i3) {
            return function(value) {
              resolveContexts[i3] = this;
              resolveValues[i3] = arguments.length > 1 ? slice.call(arguments) : value;
              if (!--remaining) {
                primary.resolveWith(resolveContexts, resolveValues);
              }
            };
          };
          if (remaining <= 1) {
            adoptValue(
              singleValue,
              primary.done(updateFunc(i2)).resolve,
              primary.reject,
              !remaining
            );
            if (primary.state() === "pending" || isFunction(resolveValues[i2] && resolveValues[i2].then)) {
              return primary.then();
            }
          }
          while (i2--) {
            adoptValue(resolveValues[i2], updateFunc(i2), primary.reject);
          }
          return primary.promise();
        }
      });
      var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      jQuery.Deferred.exceptionHook = function(error, asyncError) {
        if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
          window2.console.warn(
            "jQuery.Deferred exception: " + error.message,
            error.stack,
            asyncError
          );
        }
      };
      jQuery.readyException = function(error) {
        window2.setTimeout(function() {
          throw error;
        });
      };
      var readyList = jQuery.Deferred();
      jQuery.fn.ready = function(fn2) {
        readyList.then(fn2).catch(function(error) {
          jQuery.readyException(error);
        });
        return this;
      };
      jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(wait) {
          if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
          }
          jQuery.isReady = true;
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }
          readyList.resolveWith(document2, [jQuery]);
        }
      });
      jQuery.ready.then = readyList.then;
      function completed() {
        document2.removeEventListener("DOMContentLoaded", completed);
        window2.removeEventListener("load", completed);
        jQuery.ready();
      }
      if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
        window2.setTimeout(jQuery.ready);
      } else {
        document2.addEventListener("DOMContentLoaded", completed);
        window2.addEventListener("load", completed);
      }
      var access = function(elems, fn2, key, value, chainable, emptyGet, raw) {
        var i2 = 0, len = elems.length, bulk = key == null;
        if (toType(key) === "object") {
          chainable = true;
          for (i2 in key) {
            access(elems, fn2, i2, key[i2], true, emptyGet, raw);
          }
        } else if (value !== void 0) {
          chainable = true;
          if (!isFunction(value)) {
            raw = true;
          }
          if (bulk) {
            if (raw) {
              fn2.call(elems, value);
              fn2 = null;
            } else {
              bulk = fn2;
              fn2 = function(elem, _key, value2) {
                return bulk.call(jQuery(elem), value2);
              };
            }
          }
          if (fn2) {
            for (; i2 < len; i2++) {
              fn2(
                elems[i2],
                key,
                raw ? value : value.call(elems[i2], i2, fn2(elems[i2], key))
              );
            }
          }
        }
        if (chainable) {
          return elems;
        }
        if (bulk) {
          return fn2.call(elems);
        }
        return len ? fn2(elems[0], key) : emptyGet;
      };
      var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
      function fcamelCase(_all, letter) {
        return letter.toUpperCase();
      }
      function camelCase(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
      }
      var acceptData = function(owner) {
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
      };
      function Data() {
        this.expando = jQuery.expando + Data.uid++;
      }
      Data.uid = 1;
      Data.prototype = {
        cache: function(owner) {
          var value = owner[this.expando];
          if (!value) {
            value = {};
            if (acceptData(owner)) {
              if (owner.nodeType) {
                owner[this.expando] = value;
              } else {
                Object.defineProperty(owner, this.expando, {
                  value,
                  configurable: true
                });
              }
            }
          }
          return value;
        },
        set: function(owner, data, value) {
          var prop, cache = this.cache(owner);
          if (typeof data === "string") {
            cache[camelCase(data)] = value;
          } else {
            for (prop in data) {
              cache[camelCase(prop)] = data[prop];
            }
          }
          return cache;
        },
        get: function(owner, key) {
          return key === void 0 ? this.cache(owner) : (
            // Always use camelCase key (gh-2257)
            owner[this.expando] && owner[this.expando][camelCase(key)]
          );
        },
        access: function(owner, key, value) {
          if (key === void 0 || key && typeof key === "string" && value === void 0) {
            return this.get(owner, key);
          }
          this.set(owner, key, value);
          return value !== void 0 ? value : key;
        },
        remove: function(owner, key) {
          var i2, cache = owner[this.expando];
          if (cache === void 0) {
            return;
          }
          if (key !== void 0) {
            if (Array.isArray(key)) {
              key = key.map(camelCase);
            } else {
              key = camelCase(key);
              key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
            }
            i2 = key.length;
            while (i2--) {
              delete cache[key[i2]];
            }
          }
          if (key === void 0 || jQuery.isEmptyObject(cache)) {
            if (owner.nodeType) {
              owner[this.expando] = void 0;
            } else {
              delete owner[this.expando];
            }
          }
        },
        hasData: function(owner) {
          var cache = owner[this.expando];
          return cache !== void 0 && !jQuery.isEmptyObject(cache);
        }
      };
      var dataPriv = new Data();
      var dataUser = new Data();
      var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
      function getData(data) {
        if (data === "true") {
          return true;
        }
        if (data === "false") {
          return false;
        }
        if (data === "null") {
          return null;
        }
        if (data === +data + "") {
          return +data;
        }
        if (rbrace.test(data)) {
          return JSON.parse(data);
        }
        return data;
      }
      function dataAttr(elem, key, data) {
        var name;
        if (data === void 0 && elem.nodeType === 1) {
          name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
          data = elem.getAttribute(name);
          if (typeof data === "string") {
            try {
              data = getData(data);
            } catch (e2) {
            }
            dataUser.set(elem, key, data);
          } else {
            data = void 0;
          }
        }
        return data;
      }
      jQuery.extend({
        hasData: function(elem) {
          return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },
        data: function(elem, name, data) {
          return dataUser.access(elem, name, data);
        },
        removeData: function(elem, name) {
          dataUser.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(elem, name, data) {
          return dataPriv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
          dataPriv.remove(elem, name);
        }
      });
      jQuery.fn.extend({
        data: function(key, value) {
          var i2, name, data, elem = this[0], attrs = elem && elem.attributes;
          if (key === void 0) {
            if (this.length) {
              data = dataUser.get(elem);
              if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                i2 = attrs.length;
                while (i2--) {
                  if (attrs[i2]) {
                    name = attrs[i2].name;
                    if (name.indexOf("data-") === 0) {
                      name = camelCase(name.slice(5));
                      dataAttr(elem, name, data[name]);
                    }
                  }
                }
                dataPriv.set(elem, "hasDataAttrs", true);
              }
            }
            return data;
          }
          if (typeof key === "object") {
            return this.each(function() {
              dataUser.set(this, key);
            });
          }
          return access(this, function(value2) {
            var data2;
            if (elem && value2 === void 0) {
              data2 = dataUser.get(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              data2 = dataAttr(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              return;
            }
            this.each(function() {
              dataUser.set(this, key, value2);
            });
          }, null, value, arguments.length > 1, null, true);
        },
        removeData: function(key) {
          return this.each(function() {
            dataUser.remove(this, key);
          });
        }
      });
      jQuery.extend({
        queue: function(elem, type, data) {
          var queue;
          if (elem) {
            type = (type || "fx") + "queue";
            queue = dataPriv.get(elem, type);
            if (data) {
              if (!queue || Array.isArray(data)) {
                queue = dataPriv.access(elem, type, jQuery.makeArray(data));
              } else {
                queue.push(data);
              }
            }
            return queue || [];
          }
        },
        dequeue: function(elem, type) {
          type = type || "fx";
          var queue = jQuery.queue(elem, type), startLength = queue.length, fn2 = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
            jQuery.dequeue(elem, type);
          };
          if (fn2 === "inprogress") {
            fn2 = queue.shift();
            startLength--;
          }
          if (fn2) {
            if (type === "fx") {
              queue.unshift("inprogress");
            }
            delete hooks.stop;
            fn2.call(elem, next, hooks);
          }
          if (!startLength && hooks) {
            hooks.empty.fire();
          }
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(elem, type) {
          var key = type + "queueHooks";
          return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
            empty: jQuery.Callbacks("once memory").add(function() {
              dataPriv.remove(elem, [type + "queue", key]);
            })
          });
        }
      });
      jQuery.fn.extend({
        queue: function(type, data) {
          var setter = 2;
          if (typeof type !== "string") {
            data = type;
            type = "fx";
            setter--;
          }
          if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
          }
          return data === void 0 ? this : this.each(function() {
            var queue = jQuery.queue(this, type, data);
            jQuery._queueHooks(this, type);
            if (type === "fx" && queue[0] !== "inprogress") {
              jQuery.dequeue(this, type);
            }
          });
        },
        dequeue: function(type) {
          return this.each(function() {
            jQuery.dequeue(this, type);
          });
        },
        clearQueue: function(type) {
          return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(type, obj) {
          var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i2 = this.length, resolve = function() {
            if (!--count) {
              defer.resolveWith(elements, [elements]);
            }
          };
          if (typeof type !== "string") {
            obj = type;
            type = void 0;
          }
          type = type || "fx";
          while (i2--) {
            tmp = dataPriv.get(elements[i2], type + "queueHooks");
            if (tmp && tmp.empty) {
              count++;
              tmp.empty.add(resolve);
            }
          }
          resolve();
          return defer.promise(obj);
        }
      });
      var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
      var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
      var cssExpand = ["Top", "Right", "Bottom", "Left"];
      var documentElement = document2.documentElement;
      var isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem);
      }, composed = { composed: true };
      if (documentElement.getRootNode) {
        isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
        };
      }
      var isHiddenWithinTree = function(elem, el2) {
        elem = el2 || elem;
        return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        isAttached(elem) && jQuery.css(elem, "display") === "none";
      };
      function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
          return tween.cur();
        } : function() {
          return jQuery.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
        if (initialInUnit && initialInUnit[3] !== unit) {
          initial = initial / 2;
          unit = unit || initialInUnit[3];
          initialInUnit = +initial || 1;
          while (maxIterations--) {
            jQuery.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
              maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
          }
          initialInUnit = initialInUnit * 2;
          jQuery.style(elem, prop, initialInUnit + unit);
          valueParts = valueParts || [];
        }
        if (valueParts) {
          initialInUnit = +initialInUnit || +initial || 0;
          adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
          if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
          }
        }
        return adjusted;
      }
      var defaultDisplayMap = {};
      function getDefaultDisplay(elem) {
        var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
        if (display) {
          return display;
        }
        temp = doc.body.appendChild(doc.createElement(nodeName2));
        display = jQuery.css(temp, "display");
        temp.parentNode.removeChild(temp);
        if (display === "none") {
          display = "block";
        }
        defaultDisplayMap[nodeName2] = display;
        return display;
      }
      function showHide(elements, show) {
        var display, elem, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }
          display = elem.style.display;
          if (show) {
            if (display === "none") {
              values[index] = dataPriv.get(elem, "display") || null;
              if (!values[index]) {
                elem.style.display = "";
              }
            }
            if (elem.style.display === "" && isHiddenWithinTree(elem)) {
              values[index] = getDefaultDisplay(elem);
            }
          } else {
            if (display !== "none") {
              values[index] = "none";
              dataPriv.set(elem, "display", display);
            }
          }
        }
        for (index = 0; index < length; index++) {
          if (values[index] != null) {
            elements[index].style.display = values[index];
          }
        }
        return elements;
      }
      jQuery.fn.extend({
        show: function() {
          return showHide(this, true);
        },
        hide: function() {
          return showHide(this);
        },
        toggle: function(state) {
          if (typeof state === "boolean") {
            return state ? this.show() : this.hide();
          }
          return this.each(function() {
            if (isHiddenWithinTree(this)) {
              jQuery(this).show();
            } else {
              jQuery(this).hide();
            }
          });
        }
      });
      var rcheckableType = /^(?:checkbox|radio)$/i;
      var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
      var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");
        div.appendChild(input);
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        div.innerHTML = "<option></option>";
        support.option = !!div.lastChild;
      })();
      var wrapMap = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;
      if (!support.option) {
        wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
      }
      function getAll(context, tag) {
        var ret;
        if (typeof context.getElementsByTagName !== "undefined") {
          ret = context.getElementsByTagName(tag || "*");
        } else if (typeof context.querySelectorAll !== "undefined") {
          ret = context.querySelectorAll(tag || "*");
        } else {
          ret = [];
        }
        if (tag === void 0 || tag && nodeName(context, tag)) {
          return jQuery.merge([context], ret);
        }
        return ret;
      }
      function setGlobalEval(elems, refElements) {
        var i2 = 0, l2 = elems.length;
        for (; i2 < l2; i2++) {
          dataPriv.set(
            elems[i2],
            "globalEval",
            !refElements || dataPriv.get(refElements[i2], "globalEval")
          );
        }
      }
      var rhtml = /<|&#?\w+;/;
      function buildFragment(elems, context, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, attached, j2, fragment = context.createDocumentFragment(), nodes = [], i2 = 0, l2 = elems.length;
        for (; i2 < l2; i2++) {
          elem = elems[i2];
          if (elem || elem === 0) {
            if (toType(elem) === "object") {
              jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
            } else if (!rhtml.test(elem)) {
              nodes.push(context.createTextNode(elem));
            } else {
              tmp = tmp || fragment.appendChild(context.createElement("div"));
              tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
              j2 = wrap[0];
              while (j2--) {
                tmp = tmp.lastChild;
              }
              jQuery.merge(nodes, tmp.childNodes);
              tmp = fragment.firstChild;
              tmp.textContent = "";
            }
          }
        }
        fragment.textContent = "";
        i2 = 0;
        while (elem = nodes[i2++]) {
          if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
              ignored.push(elem);
            }
            continue;
          }
          attached = isAttached(elem);
          tmp = getAll(fragment.appendChild(elem), "script");
          if (attached) {
            setGlobalEval(tmp);
          }
          if (scripts) {
            j2 = 0;
            while (elem = tmp[j2++]) {
              if (rscriptType.test(elem.type || "")) {
                scripts.push(elem);
              }
            }
          }
        }
        return fragment;
      }
      var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
      function returnTrue() {
        return true;
      }
      function returnFalse() {
        return false;
      }
      function on2(elem, types, selector, data, fn2, one) {
        var origFn, type;
        if (typeof types === "object") {
          if (typeof selector !== "string") {
            data = data || selector;
            selector = void 0;
          }
          for (type in types) {
            on2(elem, type, selector, data, types[type], one);
          }
          return elem;
        }
        if (data == null && fn2 == null) {
          fn2 = selector;
          data = selector = void 0;
        } else if (fn2 == null) {
          if (typeof selector === "string") {
            fn2 = data;
            data = void 0;
          } else {
            fn2 = data;
            data = selector;
            selector = void 0;
          }
        }
        if (fn2 === false) {
          fn2 = returnFalse;
        } else if (!fn2) {
          return elem;
        }
        if (one === 1) {
          origFn = fn2;
          fn2 = function(event) {
            jQuery().off(event);
            return origFn.apply(this, arguments);
          };
          fn2.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function() {
          jQuery.event.add(this, types, fn2, data, selector);
        });
      }
      jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
          var handleObjIn, eventHandle, tmp, events, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
          if (!acceptData(elem)) {
            return;
          }
          if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
          }
          if (selector) {
            jQuery.find.matchesSelector(documentElement, selector);
          }
          if (!handler.guid) {
            handler.guid = jQuery.guid++;
          }
          if (!(events = elemData.events)) {
            events = elemData.events = /* @__PURE__ */ Object.create(null);
          }
          if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function(e2) {
              return typeof jQuery !== "undefined" && jQuery.event.triggered !== e2.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            };
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t2 = types.length;
          while (t2--) {
            tmp = rtypenamespace.exec(types[t2]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type,
              origType,
              data,
              handler,
              guid: handler.guid,
              selector,
              needsContext: selector && jQuery.expr.match.needsContext.test(selector),
              namespace: namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              handlers = events[type] = [];
              handlers.delegateCount = 0;
              if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle);
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            jQuery.event.global[type] = true;
          }
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
          var j2, origCount, tmp, events, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
          if (!elemData || !(events = elemData.events)) {
            return;
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t2 = types.length;
          while (t2--) {
            tmp = rtypenamespace.exec(types[t2]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              for (type in events) {
                jQuery.event.remove(elem, type + types[t2], handler, selector, true);
              }
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j2 = handlers.length;
            while (j2--) {
              handleObj = handlers[j2];
              if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                handlers.splice(j2, 1);
                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }
            if (origCount && !handlers.length) {
              if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                jQuery.removeEvent(elem, type, elemData.handle);
              }
              delete events[type];
            }
          }
          if (jQuery.isEmptyObject(events)) {
            dataPriv.remove(elem, "handle events");
          }
        },
        dispatch: function(nativeEvent) {
          var i2, j2, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
          args[0] = event;
          for (i2 = 1; i2 < arguments.length; i2++) {
            args[i2] = arguments[i2];
          }
          event.delegateTarget = this;
          if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
          }
          handlerQueue = jQuery.event.handlers.call(this, event, handlers);
          i2 = 0;
          while ((matched = handlerQueue[i2++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;
            j2 = 0;
            while ((handleObj = matched.handlers[j2++]) && !event.isImmediatePropagationStopped()) {
              if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                event.handleObj = handleObj;
                event.data = handleObj.data;
                ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                if (ret !== void 0) {
                  if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            }
          }
          if (special.postDispatch) {
            special.postDispatch.call(this, event);
          }
          return event.result;
        },
        handlers: function(event, handlers) {
          var i2, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
          if (delegateCount && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          cur.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(event.type === "click" && event.button >= 1)) {
            for (; cur !== this; cur = cur.parentNode || this) {
              if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                matchedHandlers = [];
                matchedSelectors = {};
                for (i2 = 0; i2 < delegateCount; i2++) {
                  handleObj = handlers[i2];
                  sel = handleObj.selector + " ";
                  if (matchedSelectors[sel] === void 0) {
                    matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                  }
                  if (matchedSelectors[sel]) {
                    matchedHandlers.push(handleObj);
                  }
                }
                if (matchedHandlers.length) {
                  handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                }
              }
            }
          }
          cur = this;
          if (delegateCount < handlers.length) {
            handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
          }
          return handlerQueue;
        },
        addProp: function(name, hook) {
          Object.defineProperty(jQuery.Event.prototype, name, {
            enumerable: true,
            configurable: true,
            get: isFunction(hook) ? function() {
              if (this.originalEvent) {
                return hook(this.originalEvent);
              }
            } : function() {
              if (this.originalEvent) {
                return this.originalEvent[name];
              }
            },
            set: function(value) {
              Object.defineProperty(this, name, {
                enumerable: true,
                configurable: true,
                writable: true,
                value
              });
            }
          });
        },
        fix: function(originalEvent) {
          return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(data) {
              var el2 = this || data;
              if (rcheckableType.test(el2.type) && el2.click && nodeName(el2, "input")) {
                leverageNative(el2, "click", true);
              }
              return false;
            },
            trigger: function(data) {
              var el2 = this || data;
              if (rcheckableType.test(el2.type) && el2.click && nodeName(el2, "input")) {
                leverageNative(el2, "click");
              }
              return true;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(event) {
              var target = event.target;
              return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
            }
          },
          beforeunload: {
            postDispatch: function(event) {
              if (event.result !== void 0 && event.originalEvent) {
                event.originalEvent.returnValue = event.result;
              }
            }
          }
        }
      };
      function leverageNative(el2, type, isSetup) {
        if (!isSetup) {
          if (dataPriv.get(el2, type) === void 0) {
            jQuery.event.add(el2, type, returnTrue);
          }
          return;
        }
        dataPriv.set(el2, type, false);
        jQuery.event.add(el2, type, {
          namespace: false,
          handler: function(event) {
            var result, saved = dataPriv.get(this, type);
            if (event.isTrigger & 1 && this[type]) {
              if (!saved) {
                saved = slice.call(arguments);
                dataPriv.set(this, type, saved);
                this[type]();
                result = dataPriv.get(this, type);
                dataPriv.set(this, type, false);
                if (saved !== result) {
                  event.stopImmediatePropagation();
                  event.preventDefault();
                  return result;
                }
              } else if ((jQuery.event.special[type] || {}).delegateType) {
                event.stopPropagation();
              }
            } else if (saved) {
              dataPriv.set(this, type, jQuery.event.trigger(
                saved[0],
                saved.slice(1),
                this
              ));
              event.stopPropagation();
              event.isImmediatePropagationStopped = returnTrue;
            }
          }
        });
      }
      jQuery.removeEvent = function(elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle);
        }
      };
      jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
          return new jQuery.Event(src, props);
        }
        if (src && src.type) {
          this.originalEvent = src;
          this.type = src.type;
          this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
          src.returnValue === false ? returnTrue : returnFalse;
          this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
          this.currentTarget = src.currentTarget;
          this.relatedTarget = src.relatedTarget;
        } else {
          this.type = src;
        }
        if (props) {
          jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || Date.now();
        this[jQuery.expando] = true;
      };
      jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function() {
          var e2 = this.originalEvent;
          this.isDefaultPrevented = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.preventDefault();
          }
        },
        stopPropagation: function() {
          var e2 = this.originalEvent;
          this.isPropagationStopped = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.stopPropagation();
          }
        },
        stopImmediatePropagation: function() {
          var e2 = this.originalEvent;
          this.isImmediatePropagationStopped = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.stopImmediatePropagation();
          }
          this.stopPropagation();
        }
      };
      jQuery.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        which: true
      }, jQuery.event.addProp);
      jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
        function focusMappedHandler(nativeEvent) {
          if (document2.documentMode) {
            var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
            event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
            event.isSimulated = true;
            handle(nativeEvent);
            if (event.target === event.currentTarget) {
              handle(event);
            }
          } else {
            jQuery.event.simulate(
              delegateType,
              nativeEvent.target,
              jQuery.event.fix(nativeEvent)
            );
          }
        }
        jQuery.event.special[type] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var attaches;
            leverageNative(this, type, true);
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType);
              if (!attaches) {
                this.addEventListener(delegateType, focusMappedHandler);
              }
              dataPriv.set(this, delegateType, (attaches || 0) + 1);
            } else {
              return false;
            }
          },
          trigger: function() {
            leverageNative(this, type);
            return true;
          },
          teardown: function() {
            var attaches;
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType) - 1;
              if (!attaches) {
                this.removeEventListener(delegateType, focusMappedHandler);
                dataPriv.remove(this, delegateType);
              } else {
                dataPriv.set(this, delegateType, attaches);
              }
            } else {
              return false;
            }
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(event) {
            return dataPriv.get(event.target, type);
          },
          delegateType
        };
        jQuery.event.special[delegateType] = {
          setup: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
            if (!attaches) {
              if (document2.documentMode) {
                this.addEventListener(delegateType, focusMappedHandler);
              } else {
                doc.addEventListener(type, focusMappedHandler, true);
              }
            }
            dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
          },
          teardown: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
            if (!attaches) {
              if (document2.documentMode) {
                this.removeEventListener(delegateType, focusMappedHandler);
              } else {
                doc.removeEventListener(type, focusMappedHandler, true);
              }
              dataPriv.remove(dataHolder, delegateType);
            } else {
              dataPriv.set(dataHolder, delegateType, attaches);
            }
          }
        };
      });
      jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(orig, fix) {
        jQuery.event.special[orig] = {
          delegateType: fix,
          bindType: fix,
          handle: function(event) {
            var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
            if (!related || related !== target && !jQuery.contains(target, related)) {
              event.type = handleObj.origType;
              ret = handleObj.handler.apply(this, arguments);
              event.type = fix;
            }
            return ret;
          }
        };
      });
      jQuery.fn.extend({
        on: function(types, selector, data, fn2) {
          return on2(this, types, selector, data, fn2);
        },
        one: function(types, selector, data, fn2) {
          return on2(this, types, selector, data, fn2, 1);
        },
        off: function(types, selector, fn2) {
          var handleObj, type;
          if (types && types.preventDefault && types.handleObj) {
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
              handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
              handleObj.selector,
              handleObj.handler
            );
            return this;
          }
          if (typeof types === "object") {
            for (type in types) {
              this.off(type, selector, types[type]);
            }
            return this;
          }
          if (selector === false || typeof selector === "function") {
            fn2 = selector;
            selector = void 0;
          }
          if (fn2 === false) {
            fn2 = returnFalse;
          }
          return this.each(function() {
            jQuery.event.remove(this, types, fn2, selector);
          });
        }
      });
      var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function manipulationTarget(elem, content) {
        if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
          return jQuery(elem).children("tbody")[0] || elem;
        }
        return elem;
      }
      function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
      }
      function restoreScript(elem) {
        if ((elem.type || "").slice(0, 5) === "true/") {
          elem.type = elem.type.slice(5);
        } else {
          elem.removeAttribute("type");
        }
        return elem;
      }
      function cloneCopyEvent(src, dest) {
        var i2, l2, type, pdataOld, udataOld, udataCur, events;
        if (dest.nodeType !== 1) {
          return;
        }
        if (dataPriv.hasData(src)) {
          pdataOld = dataPriv.get(src);
          events = pdataOld.events;
          if (events) {
            dataPriv.remove(dest, "handle events");
            for (type in events) {
              for (i2 = 0, l2 = events[type].length; i2 < l2; i2++) {
                jQuery.event.add(dest, type, events[type][i2]);
              }
            }
          }
        }
        if (dataUser.hasData(src)) {
          udataOld = dataUser.access(src);
          udataCur = jQuery.extend({}, udataOld);
          dataUser.set(dest, udataCur);
        }
      }
      function fixInput(src, dest) {
        var nodeName2 = dest.nodeName.toLowerCase();
        if (nodeName2 === "input" && rcheckableType.test(src.type)) {
          dest.checked = src.checked;
        } else if (nodeName2 === "input" || nodeName2 === "textarea") {
          dest.defaultValue = src.defaultValue;
        }
      }
      function domManip(collection, args, callback, ignored) {
        args = flat(args);
        var fragment, first, scripts, hasScripts, node, doc, i2 = 0, l2 = collection.length, iNoClone = l2 - 1, value = args[0], valueIsFunction = isFunction(value);
        if (valueIsFunction || l2 > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
          return collection.each(function(index) {
            var self2 = collection.eq(index);
            if (valueIsFunction) {
              args[0] = value.call(this, index, self2.html());
            }
            domManip(self2, args, callback, ignored);
          });
        }
        if (l2) {
          fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
          first = fragment.firstChild;
          if (fragment.childNodes.length === 1) {
            fragment = first;
          }
          if (first || ignored) {
            scripts = jQuery.map(getAll(fragment, "script"), disableScript);
            hasScripts = scripts.length;
            for (; i2 < l2; i2++) {
              node = fragment;
              if (i2 !== iNoClone) {
                node = jQuery.clone(node, true, true);
                if (hasScripts) {
                  jQuery.merge(scripts, getAll(node, "script"));
                }
              }
              callback.call(collection[i2], node, i2);
            }
            if (hasScripts) {
              doc = scripts[scripts.length - 1].ownerDocument;
              jQuery.map(scripts, restoreScript);
              for (i2 = 0; i2 < hasScripts; i2++) {
                node = scripts[i2];
                if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                  if (node.src && (node.type || "").toLowerCase() !== "module") {
                    if (jQuery._evalUrl && !node.noModule) {
                      jQuery._evalUrl(node.src, {
                        nonce: node.nonce || node.getAttribute("nonce")
                      }, doc);
                    }
                  } else {
                    DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                  }
                }
              }
            }
          }
        }
        return collection;
      }
      function remove(elem, selector, keepData) {
        var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i2 = 0;
        for (; (node = nodes[i2]) != null; i2++) {
          if (!keepData && node.nodeType === 1) {
            jQuery.cleanData(getAll(node));
          }
          if (node.parentNode) {
            if (keepData && isAttached(node)) {
              setGlobalEval(getAll(node, "script"));
            }
            node.parentNode.removeChild(node);
          }
        }
        return elem;
      }
      jQuery.extend({
        htmlPrefilter: function(html) {
          return html;
        },
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
          var i2, l2, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
          if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            destElements = getAll(clone);
            srcElements = getAll(elem);
            for (i2 = 0, l2 = srcElements.length; i2 < l2; i2++) {
              fixInput(srcElements[i2], destElements[i2]);
            }
          }
          if (dataAndEvents) {
            if (deepDataAndEvents) {
              srcElements = srcElements || getAll(elem);
              destElements = destElements || getAll(clone);
              for (i2 = 0, l2 = srcElements.length; i2 < l2; i2++) {
                cloneCopyEvent(srcElements[i2], destElements[i2]);
              }
            } else {
              cloneCopyEvent(elem, clone);
            }
          }
          destElements = getAll(clone, "script");
          if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
          }
          return clone;
        },
        cleanData: function(elems) {
          var data, elem, type, special = jQuery.event.special, i2 = 0;
          for (; (elem = elems[i2]) !== void 0; i2++) {
            if (acceptData(elem)) {
              if (data = elem[dataPriv.expando]) {
                if (data.events) {
                  for (type in data.events) {
                    if (special[type]) {
                      jQuery.event.remove(elem, type);
                    } else {
                      jQuery.removeEvent(elem, type, data.handle);
                    }
                  }
                }
                elem[dataPriv.expando] = void 0;
              }
              if (elem[dataUser.expando]) {
                elem[dataUser.expando] = void 0;
              }
            }
          }
        }
      });
      jQuery.fn.extend({
        detach: function(selector) {
          return remove(this, selector, true);
        },
        remove: function(selector) {
          return remove(this, selector);
        },
        text: function(value) {
          return access(this, function(value2) {
            return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = value2;
              }
            });
          }, null, value, arguments.length);
        },
        append: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.appendChild(elem);
            }
          });
        },
        prepend: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.insertBefore(elem, target.firstChild);
            }
          });
        },
        before: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this);
            }
          });
        },
        after: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this.nextSibling);
            }
          });
        },
        empty: function() {
          var elem, i2 = 0;
          for (; (elem = this[i2]) != null; i2++) {
            if (elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem, false));
              elem.textContent = "";
            }
          }
          return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
          dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
          deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
          return this.map(function() {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
          });
        },
        html: function(value) {
          return access(this, function(value2) {
            var elem = this[0] || {}, i2 = 0, l2 = this.length;
            if (value2 === void 0 && elem.nodeType === 1) {
              return elem.innerHTML;
            }
            if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
              value2 = jQuery.htmlPrefilter(value2);
              try {
                for (; i2 < l2; i2++) {
                  elem = this[i2] || {};
                  if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                    elem.innerHTML = value2;
                  }
                }
                elem = 0;
              } catch (e2) {
              }
            }
            if (elem) {
              this.empty().append(value2);
            }
          }, null, value, arguments.length);
        },
        replaceWith: function() {
          var ignored = [];
          return domManip(this, arguments, function(elem) {
            var parent = this.parentNode;
            if (jQuery.inArray(this, ignored) < 0) {
              jQuery.cleanData(getAll(this));
              if (parent) {
                parent.replaceChild(elem, this);
              }
            }
          }, ignored);
        }
      });
      jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(name, original) {
        jQuery.fn[name] = function(selector) {
          var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i2 = 0;
          for (; i2 <= last; i2++) {
            elems = i2 === last ? this : this.clone(true);
            jQuery(insert[i2])[original](elems);
            push.apply(ret, elems.get());
          }
          return this.pushStack(ret);
        };
      });
      var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
      var rcustomProp = /^--/;
      var getStyles = function(elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
          view = window2;
        }
        return view.getComputedStyle(elem);
      };
      var swap = function(elem, options, callback) {
        var ret, name, old = {};
        for (name in options) {
          old[name] = elem.style[name];
          elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for (name in options) {
          elem.style[name] = old[name];
        }
        return ret;
      };
      var rboxStyle = new RegExp(cssExpand.join("|"), "i");
      (function() {
        function computeStyleTests() {
          if (!div) {
            return;
          }
          container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
          div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
          documentElement.appendChild(container).appendChild(div);
          var divStyle = window2.getComputedStyle(div);
          pixelPositionVal = divStyle.top !== "1%";
          reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
          div.style.right = "60%";
          pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
          boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
          div.style.position = "absolute";
          scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
          documentElement.removeChild(container);
          div = null;
        }
        function roundPixelMeasures(measure) {
          return Math.round(parseFloat(measure));
        }
        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
        if (!div.style) {
          return;
        }
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
        jQuery.extend(support, {
          boxSizingReliable: function() {
            computeStyleTests();
            return boxSizingReliableVal;
          },
          pixelBoxStyles: function() {
            computeStyleTests();
            return pixelBoxStylesVal;
          },
          pixelPosition: function() {
            computeStyleTests();
            return pixelPositionVal;
          },
          reliableMarginLeft: function() {
            computeStyleTests();
            return reliableMarginLeftVal;
          },
          scrollboxSize: function() {
            computeStyleTests();
            return scrollboxSizeVal;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var table, tr, trChild, trStyle;
            if (reliableTrDimensionsVal == null) {
              table = document2.createElement("table");
              tr = document2.createElement("tr");
              trChild = document2.createElement("div");
              table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
              tr.style.cssText = "box-sizing:content-box;border:1px solid";
              tr.style.height = "1px";
              trChild.style.height = "9px";
              trChild.style.display = "block";
              documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
              trStyle = window2.getComputedStyle(tr);
              reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
              documentElement.removeChild(table);
            }
            return reliableTrDimensionsVal;
          }
        });
      })();
      function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
        computed = computed || getStyles(elem);
        if (computed) {
          ret = computed.getPropertyValue(name) || computed[name];
          if (isCustomProp && ret) {
            ret = ret.replace(rtrimCSS, "$1") || void 0;
          }
          if (ret === "" && !isAttached(elem)) {
            ret = jQuery.style(elem, name);
          }
          if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
          }
        }
        return ret !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          ret + ""
        ) : ret;
      }
      function addGetHookIf(conditionFn, hookFn) {
        return {
          get: function() {
            if (conditionFn()) {
              delete this.get;
              return;
            }
            return (this.get = hookFn).apply(this, arguments);
          }
        };
      }
      var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
      function vendorPropName(name) {
        var capName = name[0].toUpperCase() + name.slice(1), i2 = cssPrefixes.length;
        while (i2--) {
          name = cssPrefixes[i2] + capName;
          if (name in emptyStyle) {
            return name;
          }
        }
      }
      function finalPropName(name) {
        var final = jQuery.cssProps[name] || vendorProps[name];
        if (final) {
          return final;
        }
        if (name in emptyStyle) {
          return name;
        }
        return vendorProps[name] = vendorPropName(name) || name;
      }
      var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function setPositiveNumber(_elem, value, subtract) {
        var matches = rcssNum.exec(value);
        return matches ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
        ) : value;
      }
      function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
        var i2 = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
        if (box === (isBorderBox ? "border" : "content")) {
          return 0;
        }
        for (; i2 < 4; i2 += 2) {
          if (box === "margin") {
            marginDelta += jQuery.css(elem, box + cssExpand[i2], true, styles);
          }
          if (!isBorderBox) {
            delta += jQuery.css(elem, "padding" + cssExpand[i2], true, styles);
            if (box !== "padding") {
              delta += jQuery.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
            } else {
              extra += jQuery.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
            }
          } else {
            if (box === "content") {
              delta -= jQuery.css(elem, "padding" + cssExpand[i2], true, styles);
            }
            if (box !== "margin") {
              delta -= jQuery.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
            }
          }
        }
        if (!isBorderBox && computedVal >= 0) {
          delta += Math.max(0, Math.ceil(
            elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
            // Use an explicit zero to avoid NaN (gh-3964)
          )) || 0;
        }
        return delta + marginDelta;
      }
      function getWidthOrHeight(elem, dimension, extra) {
        var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
        if (rnumnonpx.test(val)) {
          if (!extra) {
            return val;
          }
          val = "auto";
        }
        if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        val === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
        elem.getClientRects().length) {
          isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
          valueIsBorderBox = offsetProp in elem;
          if (valueIsBorderBox) {
            val = elem[offsetProp];
          }
        }
        val = parseFloat(val) || 0;
        return val + boxModelAdjustment(
          elem,
          dimension,
          extra || (isBorderBox ? "border" : "content"),
          valueIsBorderBox,
          styles,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          val
        ) + "px";
      }
      jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(elem, computed) {
              if (computed) {
                var ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageSlice: true,
          columnCount: true,
          flexGrow: true,
          flexShrink: true,
          fontWeight: true,
          gridArea: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnStart: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowStart: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          scale: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeMiterlimit: true,
          strokeOpacity: true
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
          if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
          }
          var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (value !== void 0) {
            type = typeof value;
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
              value = adjustCSS(elem, name, ret);
              type = "number";
            }
            if (value == null || value !== value) {
              return;
            }
            if (type === "number" && !isCustomProp) {
              value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
            }
            if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style[name] = "inherit";
            }
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
              if (isCustomProp) {
                style.setProperty(name, value);
              } else {
                style[name] = value;
              }
            }
          } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
              return ret;
            }
            return style[name];
          }
        },
        css: function(elem, name, extra, styles) {
          var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
          }
          if (val === void 0) {
            val = curCSS(elem, name, styles);
          }
          if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
          }
          if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
          }
          return val;
        }
      });
      jQuery.each(["height", "width"], function(_i, dimension) {
        jQuery.cssHooks[dimension] = {
          get: function(elem, computed, extra) {
            if (computed) {
              return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                return getWidthOrHeight(elem, dimension, extra);
              }) : getWidthOrHeight(elem, dimension, extra);
            }
          },
          set: function(elem, value, extra) {
            var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
              elem,
              dimension,
              extra,
              isBorderBox,
              styles
            ) : 0;
            if (isBorderBox && scrollboxSizeBuggy) {
              subtract -= Math.ceil(
                elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
              );
            }
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
              elem.style[dimension] = value;
              value = jQuery.css(elem, dimension);
            }
            return setPositiveNumber(elem, value, subtract);
          }
        };
      });
      jQuery.cssHooks.marginLeft = addGetHookIf(
        support.reliableMarginLeft,
        function(elem, computed) {
          if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
              return elem.getBoundingClientRect().left;
            })) + "px";
          }
        }
      );
      jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
          expand: function(value) {
            var i2 = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
            for (; i2 < 4; i2++) {
              expanded[prefix + cssExpand[i2] + suffix] = parts[i2] || parts[i2 - 2] || parts[0];
            }
            return expanded;
          }
        };
        if (prefix !== "margin") {
          jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
      });
      jQuery.fn.extend({
        css: function(name, value) {
          return access(this, function(elem, name2, value2) {
            var styles, len, map = {}, i2 = 0;
            if (Array.isArray(name2)) {
              styles = getStyles(elem);
              len = name2.length;
              for (; i2 < len; i2++) {
                map[name2[i2]] = jQuery.css(elem, name2[i2], false, styles);
              }
              return map;
            }
            return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
          }, name, value, arguments.length > 1);
        }
      });
      function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
      }
      jQuery.Tween = Tween;
      Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
          this.elem = elem;
          this.prop = prop;
          this.easing = easing || jQuery.easing._default;
          this.options = options;
          this.start = this.now = this.cur();
          this.end = end;
          this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
          var hooks = Tween.propHooks[this.prop];
          return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
          var eased, hooks = Tween.propHooks[this.prop];
          if (this.options.duration) {
            this.pos = eased = jQuery.easing[this.easing](
              percent,
              this.options.duration * percent,
              0,
              1,
              this.options.duration
            );
          } else {
            this.pos = eased = percent;
          }
          this.now = (this.end - this.start) * eased + this.start;
          if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
          }
          if (hooks && hooks.set) {
            hooks.set(this);
          } else {
            Tween.propHooks._default.set(this);
          }
          return this;
        }
      };
      Tween.prototype.init.prototype = Tween.prototype;
      Tween.propHooks = {
        _default: {
          get: function(tween) {
            var result;
            if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
              return tween.elem[tween.prop];
            }
            result = jQuery.css(tween.elem, tween.prop, "");
            return !result || result === "auto" ? 0 : result;
          },
          set: function(tween) {
            if (jQuery.fx.step[tween.prop]) {
              jQuery.fx.step[tween.prop](tween);
            } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
              jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
            } else {
              tween.elem[tween.prop] = tween.now;
            }
          }
        }
      };
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
          if (tween.elem.nodeType && tween.elem.parentNode) {
            tween.elem[tween.prop] = tween.now;
          }
        }
      };
      jQuery.easing = {
        linear: function(p2) {
          return p2;
        },
        swing: function(p2) {
          return 0.5 - Math.cos(p2 * Math.PI) / 2;
        },
        _default: "swing"
      };
      jQuery.fx = Tween.prototype.init;
      jQuery.fx.step = {};
      var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
      function schedule() {
        if (inProgress) {
          if (document2.hidden === false && window2.requestAnimationFrame) {
            window2.requestAnimationFrame(schedule);
          } else {
            window2.setTimeout(schedule, jQuery.fx.interval);
          }
          jQuery.fx.tick();
        }
      }
      function createFxNow() {
        window2.setTimeout(function() {
          fxNow = void 0;
        });
        return fxNow = Date.now();
      }
      function genFx(type, includeWidth) {
        var which, i2 = 0, attrs = { height: type };
        includeWidth = includeWidth ? 1 : 0;
        for (; i2 < 4; i2 += 2 - includeWidth) {
          which = cssExpand[i2];
          attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
          attrs.opacity = attrs.width = type;
        }
        return attrs;
      }
      function createTween(value, prop, animation) {
        var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
        for (; index < length; index++) {
          if (tween = collection[index].call(animation, prop, value)) {
            return tween;
          }
        }
      }
      function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
        if (!opts.queue) {
          hooks = jQuery._queueHooks(elem, "fx");
          if (hooks.unqueued == null) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
              if (!hooks.unqueued) {
                oldfire();
              }
            };
          }
          hooks.unqueued++;
          anim.always(function() {
            anim.always(function() {
              hooks.unqueued--;
              if (!jQuery.queue(elem, "fx").length) {
                hooks.empty.fire();
              }
            });
          });
        }
        for (prop in props) {
          value = props[prop];
          if (rfxtypes.test(value)) {
            delete props[prop];
            toggle = toggle || value === "toggle";
            if (value === (hidden ? "hide" : "show")) {
              if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                hidden = true;
              } else {
                continue;
              }
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
          }
        }
        propTween = !jQuery.isEmptyObject(props);
        if (!propTween && jQuery.isEmptyObject(orig)) {
          return;
        }
        if (isBox && elem.nodeType === 1) {
          opts.overflow = [style.overflow, style.overflowX, style.overflowY];
          restoreDisplay = dataShow && dataShow.display;
          if (restoreDisplay == null) {
            restoreDisplay = dataPriv.get(elem, "display");
          }
          display = jQuery.css(elem, "display");
          if (display === "none") {
            if (restoreDisplay) {
              display = restoreDisplay;
            } else {
              showHide([elem], true);
              restoreDisplay = elem.style.display || restoreDisplay;
              display = jQuery.css(elem, "display");
              showHide([elem]);
            }
          }
          if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
            if (jQuery.css(elem, "float") === "none") {
              if (!propTween) {
                anim.done(function() {
                  style.display = restoreDisplay;
                });
                if (restoreDisplay == null) {
                  display = style.display;
                  restoreDisplay = display === "none" ? "" : display;
                }
              }
              style.display = "inline-block";
            }
          }
        }
        if (opts.overflow) {
          style.overflow = "hidden";
          anim.always(function() {
            style.overflow = opts.overflow[0];
            style.overflowX = opts.overflow[1];
            style.overflowY = opts.overflow[2];
          });
        }
        propTween = false;
        for (prop in orig) {
          if (!propTween) {
            if (dataShow) {
              if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
              }
            } else {
              dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
            }
            if (toggle) {
              dataShow.hidden = !hidden;
            }
            if (hidden) {
              showHide([elem], true);
            }
            anim.done(function() {
              if (!hidden) {
                showHide([elem]);
              }
              dataPriv.remove(elem, "fxshow");
              for (prop in orig) {
                jQuery.style(elem, prop, orig[prop]);
              }
            });
          }
          propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
          if (!(prop in dataShow)) {
            dataShow[prop] = propTween.start;
            if (hidden) {
              propTween.end = propTween.start;
              propTween.start = 0;
            }
          }
        }
      }
      function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
          name = camelCase(index);
          easing = specialEasing[name];
          value = props[index];
          if (Array.isArray(value)) {
            easing = value[1];
            value = props[index] = value[0];
          }
          if (index !== name) {
            props[name] = value;
            delete props[index];
          }
          hooks = jQuery.cssHooks[name];
          if (hooks && "expand" in hooks) {
            value = hooks.expand(value);
            delete props[name];
            for (index in value) {
              if (!(index in props)) {
                props[index] = value[index];
                specialEasing[index] = easing;
              }
            }
          } else {
            specialEasing[name] = easing;
          }
        }
      }
      function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }), tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
          for (; index2 < length2; index2++) {
            animation.tweens[index2].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length2) {
            return remaining;
          }
          if (!length2) {
            deferred.notifyWith(elem, [animation, 1, 0]);
          }
          deferred.resolveWith(elem, [animation]);
          return false;
        }, animation = deferred.promise({
          elem,
          props: jQuery.extend({}, properties),
          opts: jQuery.extend(true, {
            specialEasing: {},
            easing: jQuery.easing._default
          }, options),
          originalProperties: properties,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(
              elem,
              animation.opts,
              prop,
              end,
              animation.opts.specialEasing[prop] || animation.opts.easing
            );
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(1);
            }
            if (gotoEnd) {
              deferred.notifyWith(elem, [animation, 1, 0]);
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
          result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
          if (result) {
            if (isFunction(result.stop)) {
              jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
            }
            return result;
          }
        }
        jQuery.map(props, createTween, animation);
        if (isFunction(animation.opts.start)) {
          animation.opts.start.call(elem, animation);
        }
        animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
        jQuery.fx.timer(
          jQuery.extend(tick, {
            elem,
            anim: animation,
            queue: animation.opts.queue
          })
        );
        return animation;
      }
      jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
          "*": [function(prop, value) {
            var tween = this.createTween(prop, value);
            adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
            return tween;
          }]
        },
        tweener: function(props, callback) {
          if (isFunction(props)) {
            callback = props;
            props = ["*"];
          } else {
            props = props.match(rnothtmlwhite);
          }
          var prop, index = 0, length = props.length;
          for (; index < length; index++) {
            prop = props[index];
            Animation.tweeners[prop] = Animation.tweeners[prop] || [];
            Animation.tweeners[prop].unshift(callback);
          }
        },
        prefilters: [defaultPrefilter],
        prefilter: function(callback, prepend) {
          if (prepend) {
            Animation.prefilters.unshift(callback);
          } else {
            Animation.prefilters.push(callback);
          }
        }
      });
      jQuery.speed = function(speed, easing, fn2) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
          complete: fn2 || !fn2 && easing || isFunction(speed) && speed,
          duration: speed,
          easing: fn2 && easing || easing && !isFunction(easing) && easing
        };
        if (jQuery.fx.off) {
          opt.duration = 0;
        } else {
          if (typeof opt.duration !== "number") {
            if (opt.duration in jQuery.fx.speeds) {
              opt.duration = jQuery.fx.speeds[opt.duration];
            } else {
              opt.duration = jQuery.fx.speeds._default;
            }
          }
        }
        if (opt.queue == null || opt.queue === true) {
          opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
          if (isFunction(opt.old)) {
            opt.old.call(this);
          }
          if (opt.queue) {
            jQuery.dequeue(this, opt.queue);
          }
        };
        return opt;
      };
      jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
          return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
          var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || dataPriv.get(this, "finish")) {
              anim.stop(true);
            }
          };
          doAnimation.finish = doAnimation;
          return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
          var stopQueue = function(hooks) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop(gotoEnd);
          };
          if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = void 0;
          }
          if (clearQueue) {
            this.queue(type || "fx", []);
          }
          return this.each(function() {
            var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
            if (index) {
              if (data[index] && data[index].stop) {
                stopQueue(data[index]);
              }
            } else {
              for (index in data) {
                if (data[index] && data[index].stop && rrun.test(index)) {
                  stopQueue(data[index]);
                }
              }
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                timers[index].anim.stop(gotoEnd);
                dequeue = false;
                timers.splice(index, 1);
              }
            }
            if (dequeue || !gotoEnd) {
              jQuery.dequeue(this, type);
            }
          });
        },
        finish: function(type) {
          if (type !== false) {
            type = type || "fx";
          }
          return this.each(function() {
            var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
            data.finish = true;
            jQuery.queue(this, type, []);
            if (hooks && hooks.stop) {
              hooks.stop.call(this, true);
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && timers[index].queue === type) {
                timers[index].anim.stop(true);
                timers.splice(index, 1);
              }
            }
            for (index = 0; index < length; index++) {
              if (queue[index] && queue[index].finish) {
                queue[index].finish.call(this);
              }
            }
            delete data.finish;
          });
        }
      });
      jQuery.each(["toggle", "show", "hide"], function(_i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
          return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
      });
      jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
          return this.animate(props, speed, easing, callback);
        };
      });
      jQuery.timers = [];
      jQuery.fx.tick = function() {
        var timer, i2 = 0, timers = jQuery.timers;
        fxNow = Date.now();
        for (; i2 < timers.length; i2++) {
          timer = timers[i2];
          if (!timer() && timers[i2] === timer) {
            timers.splice(i2--, 1);
          }
        }
        if (!timers.length) {
          jQuery.fx.stop();
        }
        fxNow = void 0;
      };
      jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer);
        jQuery.fx.start();
      };
      jQuery.fx.interval = 13;
      jQuery.fx.start = function() {
        if (inProgress) {
          return;
        }
        inProgress = true;
        schedule();
      };
      jQuery.fx.stop = function() {
        inProgress = null;
      };
      jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      };
      jQuery.fn.delay = function(time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function(next, hooks) {
          var timeout = window2.setTimeout(next, time);
          hooks.stop = function() {
            window2.clearTimeout(timeout);
          };
        });
      };
      (function() {
        var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
        input.type = "checkbox";
        support.checkOn = input.value !== "";
        support.optSelected = opt.selected;
        input = document2.createElement("input");
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
      })();
      var boolHook, attrHandle = jQuery.expr.attrHandle;
      jQuery.fn.extend({
        attr: function(name, value) {
          return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
          return this.each(function() {
            jQuery.removeAttr(this, name);
          });
        }
      });
      jQuery.extend({
        attr: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
          }
          if (value !== void 0) {
            if (value === null) {
              jQuery.removeAttr(elem, name);
              return;
            }
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            elem.setAttribute(name, value + "");
            return value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          ret = jQuery.find.attr(elem, name);
          return ret == null ? void 0 : ret;
        },
        attrHooks: {
          type: {
            set: function(elem, value) {
              if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                var val = elem.value;
                elem.setAttribute("type", value);
                if (val) {
                  elem.value = val;
                }
                return value;
              }
            }
          }
        },
        removeAttr: function(elem, value) {
          var name, i2 = 0, attrNames = value && value.match(rnothtmlwhite);
          if (attrNames && elem.nodeType === 1) {
            while (name = attrNames[i2++]) {
              elem.removeAttribute(name);
            }
          }
        }
      });
      boolHook = {
        set: function(elem, value, name) {
          if (value === false) {
            jQuery.removeAttr(elem, name);
          } else {
            elem.setAttribute(name, name);
          }
          return name;
        }
      };
      jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name2, isXML) {
          var ret, handle, lowercaseName = name2.toLowerCase();
          if (!isXML) {
            handle = attrHandle[lowercaseName];
            attrHandle[lowercaseName] = ret;
            ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
            attrHandle[lowercaseName] = handle;
          }
          return ret;
        };
      });
      var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
      jQuery.fn.extend({
        prop: function(name, value) {
          return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
          return this.each(function() {
            delete this[jQuery.propFix[name] || name];
          });
        }
      });
      jQuery.extend({
        prop: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
          }
          if (value !== void 0) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            return elem[name] = value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          return elem[name];
        },
        propHooks: {
          tabIndex: {
            get: function(elem) {
              var tabindex = jQuery.find.attr(elem, "tabindex");
              if (tabindex) {
                return parseInt(tabindex, 10);
              }
              if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                return 0;
              }
              return -1;
            }
          }
        },
        propFix: {
          "for": "htmlFor",
          "class": "className"
        }
      });
      if (!support.optSelected) {
        jQuery.propHooks.selected = {
          get: function(elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
            return null;
          },
          set: function(elem) {
            var parent = elem.parentNode;
            if (parent) {
              parent.selectedIndex;
              if (parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
            }
          }
        };
      }
      jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
      });
      function stripAndCollapse(value) {
        var tokens = value.match(rnothtmlwhite) || [];
        return tokens.join(" ");
      }
      function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
      }
      function classesToArray(value) {
        if (Array.isArray(value)) {
          return value;
        }
        if (typeof value === "string") {
          return value.match(rnothtmlwhite) || [];
        }
        return [];
      }
      jQuery.fn.extend({
        addClass: function(value) {
          var classNames, cur, curValue, className, i2, finalValue;
          if (isFunction(value)) {
            return this.each(function(j2) {
              jQuery(this).addClass(value.call(this, j2, getClass(this)));
            });
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i2 = 0; i2 < classNames.length; i2++) {
                  className = classNames[i2];
                  if (cur.indexOf(" " + className + " ") < 0) {
                    cur += className + " ";
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        removeClass: function(value) {
          var classNames, cur, curValue, className, i2, finalValue;
          if (isFunction(value)) {
            return this.each(function(j2) {
              jQuery(this).removeClass(value.call(this, j2, getClass(this)));
            });
          }
          if (!arguments.length) {
            return this.attr("class", "");
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i2 = 0; i2 < classNames.length; i2++) {
                  className = classNames[i2];
                  while (cur.indexOf(" " + className + " ") > -1) {
                    cur = cur.replace(" " + className + " ", " ");
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        toggleClass: function(value, stateVal) {
          var classNames, className, i2, self2, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
          if (isFunction(value)) {
            return this.each(function(i3) {
              jQuery(this).toggleClass(
                value.call(this, i3, getClass(this), stateVal),
                stateVal
              );
            });
          }
          if (typeof stateVal === "boolean" && isValidValue) {
            return stateVal ? this.addClass(value) : this.removeClass(value);
          }
          classNames = classesToArray(value);
          return this.each(function() {
            if (isValidValue) {
              self2 = jQuery(this);
              for (i2 = 0; i2 < classNames.length; i2++) {
                className = classNames[i2];
                if (self2.hasClass(className)) {
                  self2.removeClass(className);
                } else {
                  self2.addClass(className);
                }
              }
            } else if (value === void 0 || type === "boolean") {
              className = getClass(this);
              if (className) {
                dataPriv.set(this, "__className__", className);
              }
              if (this.setAttribute) {
                this.setAttribute(
                  "class",
                  className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                );
              }
            }
          });
        },
        hasClass: function(selector) {
          var className, elem, i2 = 0;
          className = " " + selector + " ";
          while (elem = this[i2++]) {
            if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
              return true;
            }
          }
          return false;
        }
      });
      var rreturn = /\r/g;
      jQuery.fn.extend({
        val: function(value) {
          var hooks, ret, valueIsFunction, elem = this[0];
          if (!arguments.length) {
            if (elem) {
              hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
              if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                return ret;
              }
              ret = elem.value;
              if (typeof ret === "string") {
                return ret.replace(rreturn, "");
              }
              return ret == null ? "" : ret;
            }
            return;
          }
          valueIsFunction = isFunction(value);
          return this.each(function(i2) {
            var val;
            if (this.nodeType !== 1) {
              return;
            }
            if (valueIsFunction) {
              val = value.call(this, i2, jQuery(this).val());
            } else {
              val = value;
            }
            if (val == null) {
              val = "";
            } else if (typeof val === "number") {
              val += "";
            } else if (Array.isArray(val)) {
              val = jQuery.map(val, function(value2) {
                return value2 == null ? "" : value2 + "";
              });
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
              this.value = val;
            }
          });
        }
      });
      jQuery.extend({
        valHooks: {
          option: {
            get: function(elem) {
              var val = jQuery.find.attr(elem, "value");
              return val != null ? val : (
                // Support: IE <=10 - 11 only
                // option.text throws exceptions (trac-14686, trac-14858)
                // Strip and collapse whitespace
                // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                stripAndCollapse(jQuery.text(elem))
              );
            }
          },
          select: {
            get: function(elem) {
              var value, option, i2, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
              if (index < 0) {
                i2 = max;
              } else {
                i2 = one ? index : 0;
              }
              for (; i2 < max; i2++) {
                option = options[i2];
                if ((option.selected || i2 === index) && // Don't return options that are disabled or in a disabled optgroup
                !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                  value = jQuery(option).val();
                  if (one) {
                    return value;
                  }
                  values.push(value);
                }
              }
              return values;
            },
            set: function(elem, value) {
              var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i2 = options.length;
              while (i2--) {
                option = options[i2];
                if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                  optionSet = true;
                }
              }
              if (!optionSet) {
                elem.selectedIndex = -1;
              }
              return values;
            }
          }
        }
      });
      jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = {
          set: function(elem, value) {
            if (Array.isArray(value)) {
              return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
            }
          }
        };
        if (!support.checkOn) {
          jQuery.valHooks[this].get = function(elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
          };
        }
      });
      var location2 = window2.location;
      var nonce = { guid: Date.now() };
      var rquery = /\?/;
      jQuery.parseXML = function(data) {
        var xml, parserErrorElem;
        if (!data || typeof data !== "string") {
          return null;
        }
        try {
          xml = new window2.DOMParser().parseFromString(data, "text/xml");
        } catch (e2) {
        }
        parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
        if (!xml || parserErrorElem) {
          jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el2) {
            return el2.textContent;
          }).join("\n") : data));
        }
        return xml;
      };
      var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e2) {
        e2.stopPropagation();
      };
      jQuery.extend(jQuery.event, {
        trigger: function(event, data, elem, onlyHandlers) {
          var i2, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
          cur = lastElement = tmp = elem = elem || document2;
          if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
          }
          if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
          }
          if (type.indexOf(".") > -1) {
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
          }
          ontype = type.indexOf(":") < 0 && "on" + type;
          event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
          event.isTrigger = onlyHandlers ? 2 : 3;
          event.namespace = namespaces.join(".");
          event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
          event.result = void 0;
          if (!event.target) {
            event.target = elem;
          }
          data = data == null ? [event] : jQuery.makeArray(data, [event]);
          special = jQuery.event.special[type] || {};
          if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
            return;
          }
          if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }
            if (tmp === (elem.ownerDocument || document2)) {
              eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
            }
          }
          i2 = 0;
          while ((cur = eventPath[i2++]) && !event.isPropagationStopped()) {
            lastElement = cur;
            event.type = i2 > 1 ? bubbleType : special.bindType || type;
            handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
            if (handle) {
              handle.apply(cur, data);
            }
            handle = ontype && cur[ontype];
            if (handle && handle.apply && acceptData(cur)) {
              event.result = handle.apply(cur, data);
              if (event.result === false) {
                event.preventDefault();
              }
            }
          }
          event.type = type;
          if (!onlyHandlers && !event.isDefaultPrevented()) {
            if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
              if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                tmp = elem[ontype];
                if (tmp) {
                  elem[ontype] = null;
                }
                jQuery.event.triggered = type;
                if (event.isPropagationStopped()) {
                  lastElement.addEventListener(type, stopPropagationCallback);
                }
                elem[type]();
                if (event.isPropagationStopped()) {
                  lastElement.removeEventListener(type, stopPropagationCallback);
                }
                jQuery.event.triggered = void 0;
                if (tmp) {
                  elem[ontype] = tmp;
                }
              }
            }
          }
          return event.result;
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(type, elem, event) {
          var e2 = jQuery.extend(
            new jQuery.Event(),
            event,
            {
              type,
              isSimulated: true
            }
          );
          jQuery.event.trigger(e2, null, elem);
        }
      });
      jQuery.fn.extend({
        trigger: function(type, data) {
          return this.each(function() {
            jQuery.event.trigger(type, data, this);
          });
        },
        triggerHandler: function(type, data) {
          var elem = this[0];
          if (elem) {
            return jQuery.event.trigger(type, data, elem, true);
          }
        }
      });
      var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
      function buildParams(prefix, obj, traditional, add) {
        var name;
        if (Array.isArray(obj)) {
          jQuery.each(obj, function(i2, v2) {
            if (traditional || rbracket.test(prefix)) {
              add(prefix, v2);
            } else {
              buildParams(
                prefix + "[" + (typeof v2 === "object" && v2 != null ? i2 : "") + "]",
                v2,
                traditional,
                add
              );
            }
          });
        } else if (!traditional && toType(obj) === "object") {
          for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
          }
        } else {
          add(prefix, obj);
        }
      }
      jQuery.param = function(a2, traditional) {
        var prefix, s2 = [], add = function(key, valueOrFunction) {
          var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
          s2[s2.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };
        if (a2 == null) {
          return "";
        }
        if (Array.isArray(a2) || a2.jquery && !jQuery.isPlainObject(a2)) {
          jQuery.each(a2, function() {
            add(this.name, this.value);
          });
        } else {
          for (prefix in a2) {
            buildParams(prefix, a2[prefix], traditional, add);
          }
        }
        return s2.join("&");
      };
      jQuery.fn.extend({
        serialize: function() {
          return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
          }).filter(function() {
            var type = this.type;
            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
          }).map(function(_i, elem) {
            var val = jQuery(this).val();
            if (val == null) {
              return null;
            }
            if (Array.isArray(val)) {
              return jQuery.map(val, function(val2) {
                return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
              });
            }
            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
          }).get();
        }
      });
      var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
      originAnchor.href = location2.href;
      function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
          if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
          }
          var dataType, i2 = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
          if (isFunction(func)) {
            while (dataType = dataTypes[i2++]) {
              if (dataType[0] === "+") {
                dataType = dataType.slice(1) || "*";
                (structure[dataType] = structure[dataType] || []).unshift(func);
              } else {
                (structure[dataType] = structure[dataType] || []).push(func);
              }
            }
          }
        };
      }
      function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
          var selected;
          inspected[dataType] = true;
          jQuery.each(structure[dataType] || [], function(_2, prefilterOrFactory) {
            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
            if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
              options.dataTypes.unshift(dataTypeOrTransport);
              inspect(dataTypeOrTransport);
              return false;
            } else if (seekingTransport) {
              return !(selected = dataTypeOrTransport);
            }
          });
          return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
      }
      function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
          if (src[key] !== void 0) {
            (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
          }
        }
        if (deep) {
          jQuery.extend(true, target, deep);
        }
        return target;
      }
      function ajaxHandleResponses(s2, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s2.contents, dataTypes = s2.dataTypes;
        while (dataTypes[0] === "*") {
          dataTypes.shift();
          if (ct === void 0) {
            ct = s2.mimeType || jqXHR.getResponseHeader("Content-Type");
          }
        }
        if (ct) {
          for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
              dataTypes.unshift(type);
              break;
            }
          }
        }
        if (dataTypes[0] in responses) {
          finalDataType = dataTypes[0];
        } else {
          for (type in responses) {
            if (!dataTypes[0] || s2.converters[type + " " + dataTypes[0]]) {
              finalDataType = type;
              break;
            }
            if (!firstDataType) {
              firstDataType = type;
            }
          }
          finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
          if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
          }
          return responses[finalDataType];
        }
      }
      function ajaxConvert(s2, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s2.dataTypes.slice();
        if (dataTypes[1]) {
          for (conv in s2.converters) {
            converters[conv.toLowerCase()] = s2.converters[conv];
          }
        }
        current = dataTypes.shift();
        while (current) {
          if (s2.responseFields[current]) {
            jqXHR[s2.responseFields[current]] = response;
          }
          if (!prev && isSuccess && s2.dataFilter) {
            response = s2.dataFilter(response, s2.dataType);
          }
          prev = current;
          current = dataTypes.shift();
          if (current) {
            if (current === "*") {
              current = prev;
            } else if (prev !== "*" && prev !== current) {
              conv = converters[prev + " " + current] || converters["* " + current];
              if (!conv) {
                for (conv2 in converters) {
                  tmp = conv2.split(" ");
                  if (tmp[1] === current) {
                    conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                    if (conv) {
                      if (conv === true) {
                        conv = converters[conv2];
                      } else if (converters[conv2] !== true) {
                        current = tmp[0];
                        dataTypes.unshift(tmp[1]);
                      }
                      break;
                    }
                  }
                }
              }
              if (conv !== true) {
                if (conv && s2.throws) {
                  response = conv(response);
                } else {
                  try {
                    response = conv(response);
                  } catch (e2) {
                    return {
                      state: "parsererror",
                      error: conv ? e2 : "No conversion from " + prev + " to " + current
                    };
                  }
                }
              }
            }
          }
        }
        return { state: "success", data: response };
      }
      jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: location2.href,
          type: "GET",
          isLocal: rlocalProtocol.test(location2.protocol),
          global: true,
          processData: true,
          async: true,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": true,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": jQuery.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: true,
            context: true
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
          return settings ? (
            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
          ) : (
            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target)
          );
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
          if (typeof url === "object") {
            options = url;
            url = void 0;
          }
          options = options || {};
          var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i2, uncached, s2 = jQuery.ajaxSetup({}, options), callbackContext = s2.context || s2, globalEventContext = s2.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s2.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(key) {
              var match;
              if (completed2) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while (match = rheaders.exec(responseHeadersString)) {
                    responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                  }
                }
                match = responseHeaders[key.toLowerCase() + " "];
              }
              return match == null ? null : match.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return completed2 ? responseHeadersString : null;
            },
            // Caches the header
            setRequestHeader: function(name, value) {
              if (completed2 == null) {
                name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            // Overrides response content-type header
            overrideMimeType: function(type) {
              if (completed2 == null) {
                s2.mimeType = type;
              }
              return this;
            },
            // Status-dependent callbacks
            statusCode: function(map) {
              var code;
              if (map) {
                if (completed2) {
                  jqXHR.always(map[jqXHR.status]);
                } else {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                }
              }
              return this;
            },
            // Cancel the request
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
          deferred.promise(jqXHR);
          s2.url = ((url || s2.url || location2.href) + "").replace(rprotocol, location2.protocol + "//");
          s2.type = options.method || options.type || s2.method || s2.type;
          s2.dataTypes = (s2.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
          if (s2.crossDomain == null) {
            urlAnchor = document2.createElement("a");
            try {
              urlAnchor.href = s2.url;
              urlAnchor.href = urlAnchor.href;
              s2.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
            } catch (e2) {
              s2.crossDomain = true;
            }
          }
          if (s2.data && s2.processData && typeof s2.data !== "string") {
            s2.data = jQuery.param(s2.data, s2.traditional);
          }
          inspectPrefiltersOrTransports(prefilters, s2, options, jqXHR);
          if (completed2) {
            return jqXHR;
          }
          fireGlobals = jQuery.event && s2.global;
          if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
          }
          s2.type = s2.type.toUpperCase();
          s2.hasContent = !rnoContent.test(s2.type);
          cacheURL = s2.url.replace(rhash, "");
          if (!s2.hasContent) {
            uncached = s2.url.slice(cacheURL.length);
            if (s2.data && (s2.processData || typeof s2.data === "string")) {
              cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s2.data;
              delete s2.data;
            }
            if (s2.cache === false) {
              cacheURL = cacheURL.replace(rantiCache, "$1");
              uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
            }
            s2.url = cacheURL + uncached;
          } else if (s2.data && s2.processData && (s2.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
            s2.data = s2.data.replace(r20, "+");
          }
          if (s2.ifModified) {
            if (jQuery.lastModified[cacheURL]) {
              jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
            }
            if (jQuery.etag[cacheURL]) {
              jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
            }
          }
          if (s2.data && s2.hasContent && s2.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s2.contentType);
          }
          jqXHR.setRequestHeader(
            "Accept",
            s2.dataTypes[0] && s2.accepts[s2.dataTypes[0]] ? s2.accepts[s2.dataTypes[0]] + (s2.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s2.accepts["*"]
          );
          for (i2 in s2.headers) {
            jqXHR.setRequestHeader(i2, s2.headers[i2]);
          }
          if (s2.beforeSend && (s2.beforeSend.call(callbackContext, jqXHR, s2) === false || completed2)) {
            return jqXHR.abort();
          }
          strAbort = "abort";
          completeDeferred.add(s2.complete);
          jqXHR.done(s2.success);
          jqXHR.fail(s2.error);
          transport = inspectPrefiltersOrTransports(transports, s2, options, jqXHR);
          if (!transport) {
            done(-1, "No Transport");
          } else {
            jqXHR.readyState = 1;
            if (fireGlobals) {
              globalEventContext.trigger("ajaxSend", [jqXHR, s2]);
            }
            if (completed2) {
              return jqXHR;
            }
            if (s2.async && s2.timeout > 0) {
              timeoutTimer = window2.setTimeout(function() {
                jqXHR.abort("timeout");
              }, s2.timeout);
            }
            try {
              completed2 = false;
              transport.send(requestHeaders, done);
            } catch (e2) {
              if (completed2) {
                throw e2;
              }
              done(-1, e2);
            }
          }
          function done(status, nativeStatusText, responses, headers) {
            var isSuccess, success, error, response, modified, statusText = nativeStatusText;
            if (completed2) {
              return;
            }
            completed2 = true;
            if (timeoutTimer) {
              window2.clearTimeout(timeoutTimer);
            }
            transport = void 0;
            responseHeadersString = headers || "";
            jqXHR.readyState = status > 0 ? 4 : 0;
            isSuccess = status >= 200 && status < 300 || status === 304;
            if (responses) {
              response = ajaxHandleResponses(s2, jqXHR, responses);
            }
            if (!isSuccess && jQuery.inArray("script", s2.dataTypes) > -1 && jQuery.inArray("json", s2.dataTypes) < 0) {
              s2.converters["text script"] = function() {
              };
            }
            response = ajaxConvert(s2, response, jqXHR, isSuccess);
            if (isSuccess) {
              if (s2.ifModified) {
                modified = jqXHR.getResponseHeader("Last-Modified");
                if (modified) {
                  jQuery.lastModified[cacheURL] = modified;
                }
                modified = jqXHR.getResponseHeader("etag");
                if (modified) {
                  jQuery.etag[cacheURL] = modified;
                }
              }
              if (status === 204 || s2.type === "HEAD") {
                statusText = "nocontent";
              } else if (status === 304) {
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            } else {
              error = statusText;
              if (status || !statusText) {
                statusText = "error";
                if (status < 0) {
                  status = 0;
                }
              }
            }
            jqXHR.status = status;
            jqXHR.statusText = (nativeStatusText || statusText) + "";
            if (isSuccess) {
              deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
              deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }
            jqXHR.statusCode(statusCode);
            statusCode = void 0;
            if (fireGlobals) {
              globalEventContext.trigger(
                isSuccess ? "ajaxSuccess" : "ajaxError",
                [jqXHR, s2, isSuccess ? success : error]
              );
            }
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
            if (fireGlobals) {
              globalEventContext.trigger("ajaxComplete", [jqXHR, s2]);
              if (!--jQuery.active) {
                jQuery.event.trigger("ajaxStop");
              }
            }
          }
          return jqXHR;
        },
        getJSON: function(url, data, callback) {
          return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
          return jQuery.get(url, void 0, callback, "script");
        }
      });
      jQuery.each(["get", "post"], function(_i, method) {
        jQuery[method] = function(url, data, callback, type) {
          if (isFunction(data)) {
            type = type || callback;
            callback = data;
            data = void 0;
          }
          return jQuery.ajax(jQuery.extend({
            url,
            type: method,
            dataType: type,
            data,
            success: callback
          }, jQuery.isPlainObject(url) && url));
        };
      });
      jQuery.ajaxPrefilter(function(s2) {
        var i2;
        for (i2 in s2.headers) {
          if (i2.toLowerCase() === "content-type") {
            s2.contentType = s2.headers[i2] || "";
          }
        }
      });
      jQuery._evalUrl = function(url, options, doc) {
        return jQuery.ajax({
          url,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: true,
          async: false,
          global: false,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(response) {
            jQuery.globalEval(response, options, doc);
          }
        });
      };
      jQuery.fn.extend({
        wrapAll: function(html) {
          var wrap;
          if (this[0]) {
            if (isFunction(html)) {
              html = html.call(this[0]);
            }
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
            if (this[0].parentNode) {
              wrap.insertBefore(this[0]);
            }
            wrap.map(function() {
              var elem = this;
              while (elem.firstElementChild) {
                elem = elem.firstElementChild;
              }
              return elem;
            }).append(this);
          }
          return this;
        },
        wrapInner: function(html) {
          if (isFunction(html)) {
            return this.each(function(i2) {
              jQuery(this).wrapInner(html.call(this, i2));
            });
          }
          return this.each(function() {
            var self2 = jQuery(this), contents = self2.contents();
            if (contents.length) {
              contents.wrapAll(html);
            } else {
              self2.append(html);
            }
          });
        },
        wrap: function(html) {
          var htmlIsFunction = isFunction(html);
          return this.each(function(i2) {
            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i2) : html);
          });
        },
        unwrap: function(selector) {
          this.parent(selector).not("body").each(function() {
            jQuery(this).replaceWith(this.childNodes);
          });
          return this;
        }
      });
      jQuery.expr.pseudos.hidden = function(elem) {
        return !jQuery.expr.pseudos.visible(elem);
      };
      jQuery.expr.pseudos.visible = function(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      };
      jQuery.ajaxSettings.xhr = function() {
        try {
          return new window2.XMLHttpRequest();
        } catch (e2) {
        }
      };
      var xhrSuccessStatus = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, xhrSupported = jQuery.ajaxSettings.xhr();
      support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
      support.ajax = xhrSupported = !!xhrSupported;
      jQuery.ajaxTransport(function(options) {
        var callback, errorCallback;
        if (support.cors || xhrSupported && !options.crossDomain) {
          return {
            send: function(headers, complete) {
              var i2, xhr = options.xhr();
              xhr.open(
                options.type,
                options.url,
                options.async,
                options.username,
                options.password
              );
              if (options.xhrFields) {
                for (i2 in options.xhrFields) {
                  xhr[i2] = options.xhrFields[i2];
                }
              }
              if (options.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }
              if (!options.crossDomain && !headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
              for (i2 in headers) {
                xhr.setRequestHeader(i2, headers[i2]);
              }
              callback = function(type) {
                return function() {
                  if (callback) {
                    callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                    if (type === "abort") {
                      xhr.abort();
                    } else if (type === "error") {
                      if (typeof xhr.status !== "number") {
                        complete(0, "error");
                      } else {
                        complete(
                          // File: protocol always yields status 0; see trac-8605, trac-14207
                          xhr.status,
                          xhr.statusText
                        );
                      }
                    } else {
                      complete(
                        xhrSuccessStatus[xhr.status] || xhr.status,
                        xhr.statusText,
                        // Support: IE <=9 only
                        // IE9 has no XHR2 but throws on binary (trac-11426)
                        // For XHR2 non-text, let the caller handle it (gh-2498)
                        (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                        xhr.getAllResponseHeaders()
                      );
                    }
                  }
                };
              };
              xhr.onload = callback();
              errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
              if (xhr.onabort !== void 0) {
                xhr.onabort = errorCallback;
              } else {
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    window2.setTimeout(function() {
                      if (callback) {
                        errorCallback();
                      }
                    });
                  }
                };
              }
              callback = callback("abort");
              try {
                xhr.send(options.hasContent && options.data || null);
              } catch (e2) {
                if (callback) {
                  throw e2;
                }
              }
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      jQuery.ajaxPrefilter(function(s2) {
        if (s2.crossDomain) {
          s2.contents.script = false;
        }
      });
      jQuery.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(text) {
            jQuery.globalEval(text);
            return text;
          }
        }
      });
      jQuery.ajaxPrefilter("script", function(s2) {
        if (s2.cache === void 0) {
          s2.cache = false;
        }
        if (s2.crossDomain) {
          s2.type = "GET";
        }
      });
      jQuery.ajaxTransport("script", function(s2) {
        if (s2.crossDomain || s2.scriptAttrs) {
          var script, callback;
          return {
            send: function(_2, complete) {
              script = jQuery("<script>").attr(s2.scriptAttrs || {}).prop({ charset: s2.scriptCharset, src: s2.url }).on("load error", callback = function(evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              });
              document2.head.appendChild(script[0]);
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
      jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
          this[callback] = true;
          return callback;
        }
      });
      jQuery.ajaxPrefilter("json jsonp", function(s2, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s2.jsonp !== false && (rjsonp.test(s2.url) ? "url" : typeof s2.data === "string" && (s2.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s2.data) && "data");
        if (jsonProp || s2.dataTypes[0] === "jsonp") {
          callbackName = s2.jsonpCallback = isFunction(s2.jsonpCallback) ? s2.jsonpCallback() : s2.jsonpCallback;
          if (jsonProp) {
            s2[jsonProp] = s2[jsonProp].replace(rjsonp, "$1" + callbackName);
          } else if (s2.jsonp !== false) {
            s2.url += (rquery.test(s2.url) ? "&" : "?") + s2.jsonp + "=" + callbackName;
          }
          s2.converters["script json"] = function() {
            if (!responseContainer) {
              jQuery.error(callbackName + " was not called");
            }
            return responseContainer[0];
          };
          s2.dataTypes[0] = "json";
          overwritten = window2[callbackName];
          window2[callbackName] = function() {
            responseContainer = arguments;
          };
          jqXHR.always(function() {
            if (overwritten === void 0) {
              jQuery(window2).removeProp(callbackName);
            } else {
              window2[callbackName] = overwritten;
            }
            if (s2[callbackName]) {
              s2.jsonpCallback = originalSettings.jsonpCallback;
              oldCallbacks.push(callbackName);
            }
            if (responseContainer && isFunction(overwritten)) {
              overwritten(responseContainer[0]);
            }
            responseContainer = overwritten = void 0;
          });
          return "script";
        }
      });
      support.createHTMLDocument = function() {
        var body = document2.implementation.createHTMLDocument("").body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
      }();
      jQuery.parseHTML = function(data, context, keepScripts) {
        if (typeof data !== "string") {
          return [];
        }
        if (typeof context === "boolean") {
          keepScripts = context;
          context = false;
        }
        var base, parsed, scripts;
        if (!context) {
          if (support.createHTMLDocument) {
            context = document2.implementation.createHTMLDocument("");
            base = context.createElement("base");
            base.href = document2.location.href;
            context.head.appendChild(base);
          } else {
            context = document2;
          }
        }
        parsed = rsingleTag.exec(data);
        scripts = !keepScripts && [];
        if (parsed) {
          return [context.createElement(parsed[1])];
        }
        parsed = buildFragment([data], context, scripts);
        if (scripts && scripts.length) {
          jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
      };
      jQuery.fn.load = function(url, params, callback) {
        var selector, type, response, self2 = this, off = url.indexOf(" ");
        if (off > -1) {
          selector = stripAndCollapse(url.slice(off));
          url = url.slice(0, off);
        }
        if (isFunction(params)) {
          callback = params;
          params = void 0;
        } else if (params && typeof params === "object") {
          type = "POST";
        }
        if (self2.length > 0) {
          jQuery.ajax({
            url,
            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
          }).done(function(responseText) {
            response = arguments;
            self2.html(selector ? (
              // If a selector was specified, locate the right elements in a dummy div
              // Exclude scripts to avoid IE 'Permission Denied' errors
              jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
            ) : (
              // Otherwise use the full result
              responseText
            ));
          }).always(callback && function(jqXHR, status) {
            self2.each(function() {
              callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
            });
          });
        }
        return this;
      };
      jQuery.expr.pseudos.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn2) {
          return elem === fn2.elem;
        }).length;
      };
      jQuery.offset = {
        setOffset: function(elem, options, i2) {
          var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
          if (position === "static") {
            elem.style.position = "relative";
          }
          curOffset = curElem.offset();
          curCSSTop = jQuery.css(elem, "top");
          curCSSLeft = jQuery.css(elem, "left");
          calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
          if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
          } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
          }
          if (isFunction(options)) {
            options = options.call(elem, i2, jQuery.extend({}, curOffset));
          }
          if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
          }
          if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
          }
          if ("using" in options) {
            options.using.call(elem, props);
          } else {
            curElem.css(props);
          }
        }
      };
      jQuery.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(options) {
          if (arguments.length) {
            return options === void 0 ? this : this.each(function(i2) {
              jQuery.offset.setOffset(this, options, i2);
            });
          }
          var rect, win, elem = this[0];
          if (!elem) {
            return;
          }
          if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
          }
          rect = elem.getBoundingClientRect();
          win = elem.ownerDocument.defaultView;
          return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
          };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (!this[0]) {
            return;
          }
          var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
          if (jQuery.css(elem, "position") === "fixed") {
            offset = elem.getBoundingClientRect();
          } else {
            offset = this.offset();
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
              parentOffset = jQuery(offsetParent).offset();
              parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
              parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
            }
          }
          return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
          };
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            var offsetParent = this.offsetParent;
            while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || documentElement;
          });
        }
      });
      jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
          return access(this, function(elem, method2, val2) {
            var win;
            if (isWindow(elem)) {
              win = elem;
            } else if (elem.nodeType === 9) {
              win = elem.defaultView;
            }
            if (val2 === void 0) {
              return win ? win[prop] : elem[method2];
            }
            if (win) {
              win.scrollTo(
                !top ? val2 : win.pageXOffset,
                top ? val2 : win.pageYOffset
              );
            } else {
              elem[method2] = val2;
            }
          }, method, val, arguments.length);
        };
      });
      jQuery.each(["top", "left"], function(_i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(
          support.pixelPosition,
          function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
          }
        );
      });
      jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
        jQuery.each({
          padding: "inner" + name,
          content: type,
          "": "outer" + name
        }, function(defaultExtra, funcName) {
          jQuery.fn[funcName] = function(margin, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
            return access(this, function(elem, type2, value2) {
              var doc;
              if (isWindow(elem)) {
                return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
              }
              if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                  elem.body["scroll" + name],
                  doc["scroll" + name],
                  elem.body["offset" + name],
                  doc["offset" + name],
                  doc["client" + name]
                );
              }
              return value2 === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                jQuery.css(elem, type2, extra)
              ) : (
                // Set width or height on the element
                jQuery.style(elem, type2, value2, extra)
              );
            }, type, chainable ? margin : void 0, chainable);
          };
        });
      });
      jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(_i, type) {
        jQuery.fn[type] = function(fn2) {
          return this.on(type, fn2);
        };
      });
      jQuery.fn.extend({
        bind: function(types, data, fn2) {
          return this.on(types, null, data, fn2);
        },
        unbind: function(types, fn2) {
          return this.off(types, null, fn2);
        },
        delegate: function(selector, types, data, fn2) {
          return this.on(types, selector, data, fn2);
        },
        undelegate: function(selector, types, fn2) {
          return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn2);
        },
        hover: function(fnOver, fnOut) {
          return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
        }
      });
      jQuery.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(_i, name) {
          jQuery.fn[name] = function(data, fn2) {
            return arguments.length > 0 ? this.on(name, null, data, fn2) : this.trigger(name);
          };
        }
      );
      var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      jQuery.proxy = function(fn2, context) {
        var tmp, args, proxy;
        if (typeof context === "string") {
          tmp = fn2[context];
          context = fn2;
          fn2 = tmp;
        }
        if (!isFunction(fn2)) {
          return void 0;
        }
        args = slice.call(arguments, 2);
        proxy = function() {
          return fn2.apply(context || this, args.concat(slice.call(arguments)));
        };
        proxy.guid = fn2.guid = fn2.guid || jQuery.guid++;
        return proxy;
      };
      jQuery.holdReady = function(hold) {
        if (hold) {
          jQuery.readyWait++;
        } else {
          jQuery.ready(true);
        }
      };
      jQuery.isArray = Array.isArray;
      jQuery.parseJSON = JSON.parse;
      jQuery.nodeName = nodeName;
      jQuery.isFunction = isFunction;
      jQuery.isWindow = isWindow;
      jQuery.camelCase = camelCase;
      jQuery.type = toType;
      jQuery.now = Date.now;
      jQuery.isNumeric = function(obj) {
        var type = jQuery.type(obj);
        return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj));
      };
      jQuery.trim = function(text) {
        return text == null ? "" : (text + "").replace(rtrim, "$1");
      };
      var _jQuery = window2.jQuery, _$ = window2.$;
      jQuery.noConflict = function(deep) {
        if (window2.$ === jQuery) {
          window2.$ = _$;
        }
        if (deep && window2.jQuery === jQuery) {
          window2.jQuery = _jQuery;
        }
        return jQuery;
      };
      if (typeof noGlobal === "undefined") {
        window2.jQuery = window2.$ = jQuery;
      }
      return jQuery;
    });
  })(jquery);
  var jqueryExports = jquery.exports;
  const $$2 = /* @__PURE__ */ getDefaultExportFromCjs(jqueryExports);
  $$2(() => {
    observerImgList();
  });
  console.log($$2.fn.jquery);
  $$2(window).on("load", () => {
    $$2(document).on("keydown", handleKeydownEvent);
  });
  function observerImgList() {
    const targetNode = document.getElementById("img_list");
    if (!targetNode) return;
    const observer = new MutationObserver(handleMutationCallback);
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }
  function handleMutationCallback(mutationList, observer) {
    mutationList.forEach((mutation) => {
      if (mutation.type === "childList") {
        autoChangeWidth();
      }
    });
  }
  function autoChangeWidth() {
    const imgList = document.querySelectorAll("#img_list img");
    imgList.forEach((img) => {
      img.style.width = "60%";
    });
  }
  function handleKeydownEvent(e2) {
    switch (e2.key) {
      case "=":
        plusWidth();
        break;
      case "-":
        minusWidth();
        break;
      case "r":
        autoChangeWidth();
        break;
    }
  }
  function plusWidth() {
    const imgList = document.querySelectorAll("#img_list img");
    const plusStep = 2;
    imgList.forEach((img) => {
      const width = parseInt(img.style.width);
      img.style.width = `${width + plusStep}%`;
    });
  }
  function minusWidth() {
    const imgList = document.querySelectorAll("#img_list img");
    const minusStep = 2;
    imgList.forEach((img) => {
      const width = parseInt(img.style.width);
      if (width <= 10) return;
      img.style.width = `${width - minusStep}%`;
    });
  }
  const pathUrl = new URL(location.href).pathname;
  const isSlidePage = () => pathUrl.includes("slide-aid");
  const slideViewUrl = (pid) => `https://www.wnacg.com/photos-slide-aid-${pid}.html`;
  $$2(addSlideViewShortcut);
  function addSlideViewShortcut() {
    const mangaBox = $$2(".gallary_wrap .gallary_item");
    $$2(mangaBox).each(addShortcutEle);
  }
  function addShortcutEle() {
    const container = $$2(this).find(".pic_box");
    const ele = $$2(document.createElement("button"));
    ele.text("Slide View");
    ele.addClass("shortcut");
    ele.on("click", goToSlideView);
    container.append(ele);
  }
  function goToSlideView() {
    const link = $$2(this).parent().find("a").attr("href");
    const pid = link.match(/\d+/)[0];
    window.open(slideViewUrl(pid), "_blank");
  }
  var n, l$1, u$1, i$1, o$1, r$1, f$1, e$1, c$1, s$1, a$1, h$1 = {}, p$1 = [], v$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, y$1 = Array.isArray;
  function d$1(n2, l2) {
    for (var u2 in l2) n2[u2] = l2[u2];
    return n2;
  }
  function w$2(n2) {
    var l2 = n2.parentNode;
    l2 && l2.removeChild(n2);
  }
  function _$1(l2, u2, t2) {
    var i2, o2, r2, f2 = {};
    for (r2 in u2) "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
    if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (r2 in l2.defaultProps) void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
    return g$2(l2, f2, i2, o2, null);
  }
  function g$2(n2, t2, i2, o2, r2) {
    var f2 = { type: n2, props: t2, key: i2, ref: o2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r2 ? ++u$1 : r2, __i: -1, __u: 0 };
    return null == r2 && null != l$1.vnode && l$1.vnode(f2), f2;
  }
  function m$1() {
    return { current: null };
  }
  function k$2(n2) {
    return n2.children;
  }
  function b(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function x$2(n2, l2) {
    if (null == l2) return n2.__ ? x$2(n2.__, n2.__i + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
    return "function" == typeof n2.type ? x$2(n2) : null;
  }
  function C$2(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
      return C$2(n2);
    }
  }
  function M$1(n2) {
    (!n2.__d && (n2.__d = true) && i$1.push(n2) && !P$2.__r++ || o$1 !== l$1.debounceRendering) && ((o$1 = l$1.debounceRendering) || r$1)(P$2);
  }
  function P$2() {
    var n2, u2, t2, o2, r2, e2, c2, s2;
    for (i$1.sort(f$1); n2 = i$1.shift(); ) n2.__d && (u2 = i$1.length, o2 = void 0, e2 = (r2 = (t2 = n2).__v).__e, c2 = [], s2 = [], t2.__P && ((o2 = d$1({}, r2)).__v = r2.__v + 1, l$1.vnode && l$1.vnode(o2), O$1(t2.__P, o2, r2, t2.__n, t2.__P.namespaceURI, 32 & r2.__u ? [e2] : null, c2, null == e2 ? x$2(r2) : e2, !!(32 & r2.__u), s2), o2.__v = r2.__v, o2.__.__k[o2.__i] = o2, j$2(c2, o2, s2), o2.__e != e2 && C$2(o2)), i$1.length > u2 && i$1.sort(f$1));
    P$2.__r = 0;
  }
  function S(n2, l2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
    var a2, v2, y2, d2, w2, _2 = t2 && t2.__k || p$1, g2 = l2.length;
    for (u2.__d = e2, $$1(u2, l2, _2), e2 = u2.__d, a2 = 0; a2 < g2; a2++) null != (y2 = u2.__k[a2]) && "boolean" != typeof y2 && "function" != typeof y2 && (v2 = -1 === y2.__i ? h$1 : _2[y2.__i] || h$1, y2.__i = a2, O$1(n2, y2, v2, i2, o2, r2, f2, e2, c2, s2), d2 = y2.__e, y2.ref && v2.ref != y2.ref && (v2.ref && N$1(v2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), null == w2 && null != d2 && (w2 = d2), 65536 & y2.__u || v2.__k === y2.__k ? e2 = I$1(y2, e2, n2) : "function" == typeof y2.type && void 0 !== y2.__d ? e2 = y2.__d : d2 && (e2 = d2.nextSibling), y2.__d = void 0, y2.__u &= -196609);
    u2.__d = e2, u2.__e = w2;
  }
  function $$1(n2, l2, u2) {
    var t2, i2, o2, r2, f2, e2 = l2.length, c2 = u2.length, s2 = c2, a2 = 0;
    for (n2.__k = [], t2 = 0; t2 < e2; t2++) r2 = t2 + a2, null != (i2 = n2.__k[t2] = null == (i2 = l2[t2]) || "boolean" == typeof i2 || "function" == typeof i2 ? null : "string" == typeof i2 || "number" == typeof i2 || "bigint" == typeof i2 || i2.constructor == String ? g$2(null, i2, null, null, null) : y$1(i2) ? g$2(k$2, { children: i2 }, null, null, null) : void 0 === i2.constructor && i2.__b > 0 ? g$2(i2.type, i2.props, i2.key, i2.ref ? i2.ref : null, i2.__v) : i2) ? (i2.__ = n2, i2.__b = n2.__b + 1, f2 = L$1(i2, u2, r2, s2), i2.__i = f2, o2 = null, -1 !== f2 && (s2--, (o2 = u2[f2]) && (o2.__u |= 131072)), null == o2 || null === o2.__v ? (-1 == f2 && a2--, "function" != typeof i2.type && (i2.__u |= 65536)) : f2 !== r2 && (f2 == r2 - 1 ? a2 = f2 - r2 : f2 == r2 + 1 ? a2++ : f2 > r2 ? s2 > e2 - r2 ? a2 += f2 - r2 : a2-- : f2 < r2 && a2++, f2 !== t2 + a2 && (i2.__u |= 65536))) : (o2 = u2[r2]) && null == o2.key && o2.__e && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x$2(o2)), V$1(o2, o2, false), u2[r2] = null, s2--);
    if (s2) for (t2 = 0; t2 < c2; t2++) null != (o2 = u2[t2]) && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x$2(o2)), V$1(o2, o2));
  }
  function I$1(n2, l2, u2) {
    var t2, i2;
    if ("function" == typeof n2.type) {
      for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = I$1(t2[i2], l2, u2));
      return l2;
    }
    n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = x$2(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
    do {
      l2 = l2 && l2.nextSibling;
    } while (null != l2 && 8 === l2.nodeType);
    return l2;
  }
  function H$1(n2, l2) {
    return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (y$1(n2) ? n2.some(function(n3) {
      H$1(n3, l2);
    }) : l2.push(n2)), l2;
  }
  function L$1(n2, l2, u2, t2) {
    var i2 = n2.key, o2 = n2.type, r2 = u2 - 1, f2 = u2 + 1, e2 = l2[u2];
    if (null === e2 || e2 && i2 == e2.key && o2 === e2.type && 0 == (131072 & e2.__u)) return u2;
    if (t2 > (null != e2 && 0 == (131072 & e2.__u) ? 1 : 0)) for (; r2 >= 0 || f2 < l2.length; ) {
      if (r2 >= 0) {
        if ((e2 = l2[r2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return r2;
        r2--;
      }
      if (f2 < l2.length) {
        if ((e2 = l2[f2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return f2;
        f2++;
      }
    }
    return -1;
  }
  function T$2(n2, l2, u2) {
    "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || v$1.test(l2) ? u2 : u2 + "px";
  }
  function A$2(n2, l2, u2, t2, i2) {
    var o2;
    n: if ("style" === l2) if ("string" == typeof u2) n2.style.cssText = u2;
    else {
      if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$2(n2.style, l2, "");
      if (u2) for (l2 in u2) t2 && u2[l2] === t2[l2] || T$2(n2.style, l2, u2[l2]);
    }
    else if ("o" === l2[0] && "n" === l2[1]) o2 = l2 !== (l2 = l2.replace(/(PointerCapture)$|Capture$/i, "$1")), l2 = l2.toLowerCase() in n2 || "onFocusOut" === l2 || "onFocusIn" === l2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = e$1, n2.addEventListener(l2, o2 ? s$1 : c$1, o2)) : n2.removeEventListener(l2, o2 ? s$1 : c$1, o2);
    else {
      if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
        n2[l2] = null == u2 ? "" : u2;
        break n;
      } catch (n3) {
      }
      "function" == typeof u2 || (null == u2 || false === u2 && "-" !== l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
    }
  }
  function F$2(n2) {
    return function(u2) {
      if (this.l) {
        var t2 = this.l[u2.type + n2];
        if (null == u2.t) u2.t = e$1++;
        else if (u2.t < t2.u) return;
        return t2(l$1.event ? l$1.event(u2) : u2);
      }
    };
  }
  function O$1(n2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
    var a2, h2, p2, v2, w2, _2, g2, m2, x2, C2, M2, P2, $2, I2, H2, L2, T2 = u2.type;
    if (void 0 !== u2.constructor) return null;
    128 & t2.__u && (c2 = !!(32 & t2.__u), r2 = [e2 = u2.__e = t2.__e]), (a2 = l$1.__b) && a2(u2);
    n: if ("function" == typeof T2) try {
      if (m2 = u2.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a2 = T2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? g2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (x2 ? u2.__c = h2 = new T2(m2, M2) : (u2.__c = h2 = new b(m2, M2), h2.constructor = T2, h2.render = q$2), C2 && C2.sub(h2), h2.props = m2, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), x2 && null == h2.__s && (h2.__s = h2.state), x2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$1({}, h2.__s)), d$1(h2.__s, T2.getDerivedStateFromProps(m2, h2.__s))), v2 = h2.props, w2 = h2.state, h2.__v = u2, p2) x2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), x2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
      else {
        if (x2 && null == T2.getDerivedStateFromProps && m2 !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(m2, M2), !h2.__e && (null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(m2, h2.__s, M2) || u2.__v === t2.__v)) {
          for (u2.__v !== t2.__v && (h2.props = m2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.forEach(function(n3) {
            n3 && (n3.__ = u2);
          }), P2 = 0; P2 < h2._sb.length; P2++) h2.__h.push(h2._sb[P2]);
          h2._sb = [], h2.__h.length && f2.push(h2);
          break n;
        }
        null != h2.componentWillUpdate && h2.componentWillUpdate(m2, h2.__s, M2), x2 && null != h2.componentDidUpdate && h2.__h.push(function() {
          h2.componentDidUpdate(v2, w2, _2);
        });
      }
      if (h2.context = M2, h2.props = m2, h2.__P = n2, h2.__e = false, $2 = l$1.__r, I2 = 0, x2) {
        for (h2.state = h2.__s, h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++) h2.__h.push(h2._sb[H2]);
        h2._sb = [];
      } else do {
        h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
      } while (h2.__d && ++I2 < 25);
      h2.state = h2.__s, null != h2.getChildContext && (i2 = d$1(d$1({}, i2), h2.getChildContext())), x2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(v2, w2)), S(n2, y$1(L2 = null != a2 && a2.type === k$2 && null == a2.key ? a2.props.children : a2) ? L2 : [L2], u2, t2, i2, o2, r2, f2, e2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && f2.push(h2), g2 && (h2.__E = h2.__ = null);
    } catch (n3) {
      if (u2.__v = null, c2 || null != r2) {
        for (u2.__u |= c2 ? 160 : 32; e2 && 8 === e2.nodeType && e2.nextSibling; ) e2 = e2.nextSibling;
        r2[r2.indexOf(e2)] = null, u2.__e = e2;
      } else u2.__e = t2.__e, u2.__k = t2.__k;
      l$1.__e(n3, u2, t2);
    }
    else null == r2 && u2.__v === t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : u2.__e = z$2(t2.__e, u2, t2, i2, o2, r2, f2, c2, s2);
    (a2 = l$1.diffed) && a2(u2);
  }
  function j$2(n2, u2, t2) {
    u2.__d = void 0;
    for (var i2 = 0; i2 < t2.length; i2++) N$1(t2[i2], t2[++i2], t2[++i2]);
    l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$1.__e(n3, u3.__v);
      }
    });
  }
  function z$2(l2, u2, t2, i2, o2, r2, f2, e2, c2) {
    var s2, a2, p2, v2, d2, _2, g2, m2 = t2.props, k2 = u2.props, b2 = u2.type;
    if ("svg" === b2 ? o2 = "http://www.w3.org/2000/svg" : "math" === b2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != r2) {
      for (s2 = 0; s2 < r2.length; s2++) if ((d2 = r2[s2]) && "setAttribute" in d2 == !!b2 && (b2 ? d2.localName === b2 : 3 === d2.nodeType)) {
        l2 = d2, r2[s2] = null;
        break;
      }
    }
    if (null == l2) {
      if (null === b2) return document.createTextNode(k2);
      l2 = document.createElementNS(o2, b2, k2.is && k2), r2 = null, e2 = false;
    }
    if (null === b2) m2 === k2 || e2 && l2.data === k2 || (l2.data = k2);
    else {
      if (r2 = r2 && n.call(l2.childNodes), m2 = t2.props || h$1, !e2 && null != r2) for (m2 = {}, s2 = 0; s2 < l2.attributes.length; s2++) m2[(d2 = l2.attributes[s2]).name] = d2.value;
      for (s2 in m2) if (d2 = m2[s2], "children" == s2) ;
      else if ("dangerouslySetInnerHTML" == s2) p2 = d2;
      else if ("key" !== s2 && !(s2 in k2)) {
        if ("value" == s2 && "defaultValue" in k2 || "checked" == s2 && "defaultChecked" in k2) continue;
        A$2(l2, s2, null, d2, o2);
      }
      for (s2 in k2) d2 = k2[s2], "children" == s2 ? v2 = d2 : "dangerouslySetInnerHTML" == s2 ? a2 = d2 : "value" == s2 ? _2 = d2 : "checked" == s2 ? g2 = d2 : "key" === s2 || e2 && "function" != typeof d2 || m2[s2] === d2 || A$2(l2, s2, d2, m2[s2], o2);
      if (a2) e2 || p2 && (a2.__html === p2.__html || a2.__html === l2.innerHTML) || (l2.innerHTML = a2.__html), u2.__k = [];
      else if (p2 && (l2.innerHTML = ""), S(l2, y$1(v2) ? v2 : [v2], u2, t2, i2, "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : o2, r2, f2, r2 ? r2[0] : t2.__k && x$2(t2, 0), e2, c2), null != r2) for (s2 = r2.length; s2--; ) null != r2[s2] && w$2(r2[s2]);
      e2 || (s2 = "value", void 0 !== _2 && (_2 !== l2[s2] || "progress" === b2 && !_2 || "option" === b2 && _2 !== m2[s2]) && A$2(l2, s2, _2, m2[s2], o2), s2 = "checked", void 0 !== g2 && g2 !== l2[s2] && A$2(l2, s2, g2, m2[s2], o2));
    }
    return l2;
  }
  function N$1(n2, u2, t2) {
    try {
      if ("function" == typeof n2) {
        var i2 = "function" == typeof n2.__u;
        i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
      } else n2.current = u2;
    } catch (n3) {
      l$1.__e(n3, t2);
    }
  }
  function V$1(n2, u2, t2) {
    var i2, o2;
    if (l$1.unmount && l$1.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current !== n2.__e || N$1(i2, null, u2)), null != (i2 = n2.__c)) {
      if (i2.componentWillUnmount) try {
        i2.componentWillUnmount();
      } catch (n3) {
        l$1.__e(n3, u2);
      }
      i2.base = i2.__P = null;
    }
    if (i2 = n2.__k) for (o2 = 0; o2 < i2.length; o2++) i2[o2] && V$1(i2[o2], u2, t2 || "function" != typeof n2.type);
    t2 || null == n2.__e || w$2(n2.__e), n2.__c = n2.__ = n2.__e = n2.__d = void 0;
  }
  function q$2(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function B$2(u2, t2, i2) {
    var o2, r2, f2, e2;
    l$1.__ && l$1.__(u2, t2), r2 = (o2 = "function" == typeof i2) ? null : i2 && i2.__k || t2.__k, f2 = [], e2 = [], O$1(t2, u2 = (!o2 && i2 || t2).__k = _$1(k$2, null, [u2]), r2 || h$1, h$1, t2.namespaceURI, !o2 && i2 ? [i2] : r2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, f2, !o2 && i2 ? i2 : r2 ? r2.__e : t2.firstChild, o2, e2), j$2(f2, u2, e2);
  }
  function D$2(n2, l2) {
    B$2(n2, l2, D$2);
  }
  function E$1(l2, u2, t2) {
    var i2, o2, r2, f2, e2 = d$1({}, l2.props);
    for (r2 in l2.type && l2.type.defaultProps && (f2 = l2.type.defaultProps), u2) "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : e2[r2] = void 0 === u2[r2] && void 0 !== f2 ? f2[r2] : u2[r2];
    return arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), g$2(l2.type, e2, i2 || l2.key, o2 || l2.ref, null);
  }
  function G$1(n2, l2) {
    var u2 = { __c: l2 = "__cC" + a$1++, __: n2, Consumer: function(n3, l3) {
      return n3.children(l3);
    }, Provider: function(n3) {
      var u3, t2;
      return this.getChildContext || (u3 = [], (t2 = {})[l2] = this, this.getChildContext = function() {
        return t2;
      }, this.componentWillUnmount = function() {
        u3 = null;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value !== n4.value && u3.some(function(n5) {
          n5.__e = true, M$1(n5);
        });
      }, this.sub = function(n4) {
        u3.push(n4);
        var l3 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u3 && u3.splice(u3.indexOf(n4), 1), l3 && l3.call(n4);
        };
      }), n3.children;
    } };
    return u2.Provider.__ = u2.Consumer.contextType = u2;
  }
  n = p$1.slice, l$1 = { __e: function(n2, l2, u2, t2) {
    for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
      if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
    } catch (l3) {
      n2 = l3;
    }
    throw n2;
  } }, u$1 = 0, b.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = d$1({}, this.state), "function" == typeof n2 && (n2 = n2(d$1({}, u2), this.props)), n2 && d$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M$1(this));
  }, b.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), M$1(this));
  }, b.prototype.render = k$2, i$1 = [], r$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$1 = function(n2, l2) {
    return n2.__v.__b - l2.__v.__b;
  }, P$2.__r = 0, e$1 = 0, c$1 = F$2(false), s$1 = F$2(true), a$1 = 0;
  var t, r, u, i, o = 0, f = [], c = l$1, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, s = c.__;
  function d(n2, t2) {
    c.__h && c.__h(r, n2, o || t2), o = 0;
    var u2 = r.__H || (r.__H = { __: [], __h: [] });
    return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
  }
  function h(n2) {
    return o = 1, p(D$1, n2);
  }
  function p(n2, u2, i2) {
    var o2 = d(t++, 2);
    if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : D$1(void 0, u2), function(n3) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.u)) {
      var f2 = function(n3, t2, r2) {
        if (!o2.__c.__H) return true;
        var u3 = o2.__c.__H.__.filter(function(n4) {
          return !!n4.__c;
        });
        if (u3.every(function(n4) {
          return !n4.__N;
        })) return !c2 || c2.call(this, n3, t2, r2);
        var i3 = false;
        return u3.forEach(function(n4) {
          if (n4.__N) {
            var t3 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
          }
        }), !(!i3 && o2.__c.props === n3) && (!c2 || c2.call(this, n3, t2, r2));
      };
      r.u = true;
      var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
      r.componentWillUpdate = function(n3, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n3, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n3, t2, r2);
      }, r.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function y(n2, u2) {
    var i2 = d(t++, 3);
    !c.__s && C$1(i2.__H, u2) && (i2.__ = n2, i2.i = u2, r.__H.__h.push(i2));
  }
  function _(n2, u2) {
    var i2 = d(t++, 4);
    !c.__s && C$1(i2.__H, u2) && (i2.__ = n2, i2.i = u2, r.__h.push(i2));
  }
  function A$1(n2) {
    return o = 5, T$1(function() {
      return { current: n2 };
    }, []);
  }
  function F$1(n2, t2, r2) {
    o = 6, _(function() {
      return "function" == typeof n2 ? (n2(t2()), function() {
        return n2(null);
      }) : n2 ? (n2.current = t2(), function() {
        return n2.current = null;
      }) : void 0;
    }, null == r2 ? r2 : r2.concat(n2));
  }
  function T$1(n2, r2) {
    var u2 = d(t++, 7);
    return C$1(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
  }
  function q$1(n2, t2) {
    return o = 8, T$1(function() {
      return n2;
    }, t2);
  }
  function x$1(n2) {
    var u2 = r.context[n2.__c], i2 = d(t++, 9);
    return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n2.__;
  }
  function P$1(n2, t2) {
    c.useDebugValue && c.useDebugValue(t2 ? t2(n2) : n2);
  }
  function g$1() {
    var n2 = d(t++, 11);
    if (!n2.__) {
      for (var u2 = r.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
      var i2 = u2.__m || (u2.__m = [0, 0]);
      n2.__ = "P" + i2[0] + "-" + i2[1]++;
    }
    return n2.__;
  }
  function j$1() {
    for (var n2; n2 = f.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z$1), n2.__H.__h.forEach(B$1), n2.__H.__h = [];
    } catch (t2) {
      n2.__H.__h = [], c.__e(t2, n2.__v);
    }
  }
  c.__b = function(n2) {
    r = null, e && e(n2);
  }, c.__ = function(n2, t2) {
    n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s && s(n2, t2);
  }, c.__r = function(n2) {
    a && a(n2), t = 0;
    var i2 = (r = n2.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = void 0;
    })) : (i2.__h.forEach(z$1), i2.__h.forEach(B$1), i2.__h = [], t = 0)), u = r;
  }, c.diffed = function(n2) {
    v && v(n2);
    var t2 = n2.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w$1)(j$1)), t2.__H.__.forEach(function(n3) {
      n3.i && (n3.__H = n3.i), n3.i = void 0;
    })), u = r = null;
  }, c.__c = function(n2, t2) {
    t2.some(function(n3) {
      try {
        n3.__h.forEach(z$1), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B$1(n4);
        });
      } catch (r2) {
        t2.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t2 = [], c.__e(r2, n3.__v);
      }
    }), l && l(n2, t2);
  }, c.unmount = function(n2) {
    m && m(n2);
    var t2, r2 = n2.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
      try {
        z$1(n3);
      } catch (n4) {
        t2 = n4;
      }
    }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
  };
  var k$1 = "function" == typeof requestAnimationFrame;
  function w$1(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), k$1 && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 100);
    k$1 && (t2 = requestAnimationFrame(r2));
  }
  function z$1(n2) {
    var t2 = r, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
  }
  function B$1(n2) {
    var t2 = r;
    n2.__c = n2.__(), r = t2;
  }
  function C$1(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  function D$1(n2, t2) {
    return "function" == typeof t2 ? t2(n2) : t2;
  }
  function g(n2, t2) {
    for (var e2 in t2) n2[e2] = t2[e2];
    return n2;
  }
  function E(n2, t2) {
    for (var e2 in n2) if ("__source" !== e2 && !(e2 in t2)) return true;
    for (var r2 in t2) if ("__source" !== r2 && n2[r2] !== t2[r2]) return true;
    return false;
  }
  function C(n2, t2) {
    this.props = n2, this.context = t2;
  }
  function x(n2, e2) {
    function r2(n3) {
      var t2 = this.props.ref, r3 = t2 == n3.ref;
      return !r3 && t2 && (t2.call ? t2(null) : t2.current = null), e2 ? !e2(this.props, n3) || !r3 : E(this.props, n3);
    }
    function u2(e3) {
      return this.shouldComponentUpdate = r2, _$1(n2, e3);
    }
    return u2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u2.prototype.isReactComponent = true, u2.__f = true, u2;
  }
  (C.prototype = new b()).isPureReactComponent = true, C.prototype.shouldComponentUpdate = function(n2, t2) {
    return E(this.props, n2) || E(this.state, t2);
  };
  var R = l$1.__b;
  l$1.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), R && R(n2);
  };
  var w = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
  function k(n2) {
    function t2(t3) {
      var e2 = g({}, t3);
      return delete e2.ref, n2(e2, t3.ref || null);
    }
    return t2.$$typeof = w, t2.render = t2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
  }
  var I = function(n2, t2) {
    return null == n2 ? null : H$1(H$1(n2).map(t2));
  }, N = { map: I, forEach: I, count: function(n2) {
    return n2 ? H$1(n2).length : 0;
  }, only: function(n2) {
    var t2 = H$1(n2);
    if (1 !== t2.length) throw "Children.only";
    return t2[0];
  }, toArray: H$1 }, M = l$1.__e;
  l$1.__e = function(n2, t2, e2, r2) {
    if (n2.then) {
      for (var u2, o2 = t2; o2 = o2.__; ) if ((u2 = o2.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
    }
    M(n2, t2, e2, r2);
  };
  var T = l$1.unmount;
  function A(n2, t2, e2) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return A(n3, t2, e2);
    })), n2;
  }
  function D(n2, t2, e2) {
    return n2 && e2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return D(n3, t2, e2);
    }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e2)), n2;
  }
  function L() {
    this.__u = 0, this.t = null, this.__b = null;
  }
  function O(n2) {
    var t2 = n2.__.__c;
    return t2 && t2.__a && t2.__a(n2);
  }
  function F(n2) {
    var e2, r2, u2;
    function o2(o3) {
      if (e2 || (e2 = n2()).then(function(n3) {
        r2 = n3.default || n3;
      }, function(n3) {
        u2 = n3;
      }), u2) throw u2;
      if (!r2) throw e2;
      return _$1(r2, o3);
    }
    return o2.displayName = "Lazy", o2.__f = true, o2;
  }
  function U() {
    this.u = null, this.o = null;
  }
  l$1.unmount = function(n2) {
    var t2 = n2.__c;
    t2 && t2.__R && t2.__R(), t2 && 32 & n2.__u && (n2.type = null), T && T(n2);
  }, (L.prototype = new b()).__c = function(n2, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.t && (r2.t = []), r2.t.push(e2);
    var u2 = O(r2.__v), o2 = false, i2 = function() {
      o2 || (o2 = true, e2.__R = null, u2 ? u2(c2) : c2());
    };
    e2.__R = i2;
    var c2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n3 = r2.state.__a;
          r2.__v.__k[0] = D(n3, n3.__c.__P, n3.__c.__O);
        }
        var t3;
        for (r2.setState({ __a: r2.__b = null }); t3 = r2.t.pop(); ) t3.forceUpdate();
      }
    };
    r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
  }, L.prototype.componentWillUnmount = function() {
    this.t = [];
  }, L.prototype.render = function(n2, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = A(this.__b, r2, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && _$1(k$2, null, n2.fallback);
    return i2 && (i2.__u &= -33), [_$1(k$2, null, e2.__a ? null : n2.children), i2];
  };
  var V = function(n2, t2, e2) {
    if (++e2[1] === e2[0] && n2.o.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size)) for (e2 = n2.u; e2; ) {
      for (; e2.length > 3; ) e2.pop()();
      if (e2[1] < e2[0]) break;
      n2.u = e2 = e2[2];
    }
  };
  function W(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function P(n2) {
    var e2 = this, r2 = n2.i;
    e2.componentWillUnmount = function() {
      B$2(null, e2.l), e2.l = null, e2.i = null;
    }, e2.i && e2.i !== r2 && e2.componentWillUnmount(), e2.l || (e2.i = r2, e2.l = { nodeType: 1, parentNode: r2, childNodes: [], contains: function() {
      return true;
    }, appendChild: function(n3) {
      this.childNodes.push(n3), e2.i.appendChild(n3);
    }, insertBefore: function(n3, t2) {
      this.childNodes.push(n3), e2.i.appendChild(n3);
    }, removeChild: function(n3) {
      this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.i.removeChild(n3);
    } }), B$2(_$1(W, { context: e2.context }, n2.__v), e2.l);
  }
  function j(n2, e2) {
    var r2 = _$1(P, { __v: n2, i: e2 });
    return r2.containerInfo = e2, r2;
  }
  (U.prototype = new b()).__a = function(n2) {
    var t2 = this, e2 = O(t2.__v), r2 = t2.o.get(n2);
    return r2[0]++, function(u2) {
      var o2 = function() {
        t2.props.revealOrder ? (r2.push(u2), V(t2, n2, r2)) : u2();
      };
      e2 ? e2(o2) : o2();
    };
  }, U.prototype.render = function(n2) {
    this.u = null, this.o = /* @__PURE__ */ new Map();
    var t2 = H$1(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; ) this.o.set(t2[e2], this.u = [1, 0, this.u]);
    return n2.children;
  }, U.prototype.componentDidUpdate = U.prototype.componentDidMount = function() {
    var n2 = this;
    this.o.forEach(function(t2, e2) {
      V(n2, e2, t2);
    });
  };
  var z = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, B = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, H = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Z = /[A-Z0-9]/g, Y = "undefined" != typeof document, $ = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  function q(n2, t2, e2) {
    return null == t2.__k && (t2.textContent = ""), B$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  function G(n2, t2, e2) {
    return D$2(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  b.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
    Object.defineProperty(b.prototype, t2, { configurable: true, get: function() {
      return this["UNSAFE_" + t2];
    }, set: function(n2) {
      Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
    } });
  });
  var J = l$1.event;
  function K() {
  }
  function Q() {
    return this.cancelBubble;
  }
  function X() {
    return this.defaultPrevented;
  }
  l$1.event = function(n2) {
    return J && (n2 = J(n2)), n2.persist = K, n2.isPropagationStopped = Q, n2.isDefaultPrevented = X, n2.nativeEvent = n2;
  };
  var nn, tn = { enumerable: false, configurable: true, get: function() {
    return this.class;
  } }, en = l$1.vnode;
  l$1.vnode = function(n2) {
    "string" == typeof n2.type && function(n3) {
      var t2 = n3.props, e2 = n3.type, u2 = {};
      for (var o2 in t2) {
        var i2 = t2[o2];
        if (!("value" === o2 && "defaultValue" in t2 && null == i2 || Y && "children" === o2 && "noscript" === e2 || "class" === o2 || "className" === o2)) {
          var c2 = o2.toLowerCase();
          "defaultValue" === o2 && "value" in t2 && null == t2.value ? o2 = "value" : "download" === o2 && true === i2 ? i2 = "" : "translate" === c2 && "no" === i2 ? i2 = false : "ondoubleclick" === c2 ? o2 = "ondblclick" : "onchange" !== c2 || "input" !== e2 && "textarea" !== e2 || $(t2.type) ? "onfocus" === c2 ? o2 = "onfocusin" : "onblur" === c2 ? o2 = "onfocusout" : H.test(o2) ? o2 = c2 : -1 === e2.indexOf("-") && B.test(o2) ? o2 = o2.replace(Z, "-$&").toLowerCase() : null === i2 && (i2 = void 0) : c2 = o2 = "oninput", "oninput" === c2 && u2[o2 = c2] && (o2 = "oninputCapture"), u2[o2] = i2;
        }
      }
      "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
      })), "select" == e2 && null != u2.defaultValue && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
      })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", tn)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
    }(n2), n2.$$typeof = z, en && en(n2);
  };
  var rn = l$1.__r;
  l$1.__r = function(n2) {
    rn && rn(n2), nn = n2.__c;
  };
  var un = l$1.diffed;
  l$1.diffed = function(n2) {
    un && un(n2);
    var t2 = n2.props, e2 = n2.__e;
    null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), nn = null;
  };
  var on = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
    return nn.__n[n2.__c].props.value;
  }, useCallback: q$1, useContext: x$1, useDebugValue: P$1, useDeferredValue: bn, useEffect: y, useId: g$1, useImperativeHandle: F$1, useInsertionEffect: gn, useLayoutEffect: _, useMemo: T$1, useReducer: p, useRef: A$1, useState: h, useSyncExternalStore: Cn, useTransition: Sn } } };
  function ln(n2) {
    return _$1.bind(null, n2);
  }
  function fn(n2) {
    return !!n2 && n2.$$typeof === z;
  }
  function an(n2) {
    return fn(n2) && n2.type === k$2;
  }
  function sn(n2) {
    return !!n2 && !!n2.displayName && ("string" == typeof n2.displayName || n2.displayName instanceof String) && n2.displayName.startsWith("Memo(");
  }
  function hn(n2) {
    return fn(n2) ? E$1.apply(null, arguments) : n2;
  }
  function vn(n2) {
    return !!n2.__k && (B$2(null, n2), true);
  }
  function dn(n2) {
    return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
  }
  var pn = function(n2, t2) {
    return n2(t2);
  }, mn = function(n2, t2) {
    return n2(t2);
  }, yn = k$2;
  function _n(n2) {
    n2();
  }
  function bn(n2) {
    return n2;
  }
  function Sn() {
    return [false, _n];
  }
  var gn = _, En = fn;
  function Cn(n2, t2) {
    var e2 = t2(), r2 = h({ h: { __: e2, v: t2 } }), u2 = r2[0].h, o2 = r2[1];
    return _(function() {
      u2.__ = e2, u2.v = t2, xn(u2) && o2({ h: u2 });
    }, [n2, e2, t2]), y(function() {
      return xn(u2) && o2({ h: u2 }), n2(function() {
        xn(u2) && o2({ h: u2 });
      });
    }, [n2]), e2;
  }
  function xn(n2) {
    var t2, e2, r2 = n2.v, u2 = n2.__;
    try {
      var o2 = r2();
      return !((t2 = u2) === (e2 = o2) && (0 !== t2 || 1 / t2 == 1 / e2) || t2 != t2 && e2 != e2);
    } catch (n3) {
      return true;
    }
  }
  var Rn = { useState: h, useId: g$1, useReducer: p, useEffect: y, useLayoutEffect: _, useInsertionEffect: gn, useTransition: Sn, useDeferredValue: bn, useSyncExternalStore: Cn, startTransition: _n, useRef: A$1, useImperativeHandle: F$1, useMemo: T$1, useCallback: q$1, useContext: x$1, useDebugValue: P$1, version: "17.0.2", Children: N, render: q, hydrate: G, unmountComponentAtNode: vn, createPortal: j, createElement: _$1, createContext: G$1, createFactory: ln, cloneElement: hn, createRef: m$1, Fragment: k$2, isValidElement: fn, isElement: En, isFragment: an, isMemo: sn, findDOMNode: dn, Component: b, PureComponent: C, memo: x, forwardRef: k, flushSync: mn, unstable_batchedUpdates: pn, StrictMode: yn, Suspense: L, SuspenseList: U, lazy: F, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: on };
  function AlbumPageShortCut() {
    if (!isSlidePage()) return null;
    const handleOnClick = (e2) => {
      e2.stopPropagation();
      window.open(location.href.replace("slide", "index"), "_self");
    };
    return /* @__PURE__ */ Rn.createElement(Rn.Fragment, null, /* @__PURE__ */ Rn.createElement("i", { className: "bi bi-house shortcut-icon", onClick: handleOnClick }));
  }
  const app = /* @__PURE__ */ Rn.createElement(AlbumPageShortCut, null);
  const el = document.createElement("div");
  B$2(app, el);
  document.body.append(el);

})();