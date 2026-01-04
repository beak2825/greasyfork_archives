// ==UserScript==
// @name            Bilibili 评论搜索
// @name:en         Bilibili Comment Search
// @name:zh         Bilibili 评论搜索
// @namespace       npm/vite-plugin-monkey
// @version         0.2.1
// @author          pacexy <pacexy@gmail.com>
// @description     让 Bilibili 支持评论搜索。
// @description:en  Add comment searching support in Bilibili.
// @description:zh  让 Bilibili 支持评论搜索。
// @license         MIT
// @icon            https://www.bilibili.com/favicon.ico
// @homepage        https://github.com/pacexy/userscript-bilibili-comment-search#readme
// @homepageURL     https://github.com/pacexy/userscript-bilibili-comment-search#readme
// @source          https://github.com/pacexy/userscript-bilibili-comment-search.git
// @supportURL      https://github.com/pacexy/userscript-bilibili-comment-search/issues
// @match           *://www.bilibili.com/video/av*
// @match           *://www.bilibili.com/bangumi/play/ep*
// @match           *://www.bilibili.com/bangumi/play/ss*
// @match           *://www.bilibili.com/video/BV*
// @require         https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require         https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @downloadURL https://update.greasyfork.org/scripts/467863/Bilibili%20%E8%AF%84%E8%AE%BA%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/467863/Bilibili%20%E8%AF%84%E8%AE%BA%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(e=>{const o=document.createElement("style");o.dataset.source="vite-plugin-monkey",o.textContent=e,document.head.append(o)})(' #comment-search-root{float:right}#comment-search-root button{margin-left:auto;border:none;padding:4px 8px;border-radius:4px}#comment-search-root dialog[open]{display:block}#comment-search-root dialog{display:none;width:800px;margin:auto;padding:1em;border-radius:8px;border:none;outline:none;overflow:hidden}#comment-search-root dialog .header{display:flex;align-items:center}#comment-search-root dialog .header h1{font-size:15px;color:var(--text1)}#comment-search-root dialog .header h1 span{color:var(--text3)}#comment-search-root dialog input{padding:5px 10px;border:1px solid var(--Ga1);border-radius:4px;background-color:var(--bg3);color:var(--text1);outline:none;width:100%;margin-top:20px}#comment-search-root dialog .note{color:var(--text3);margin:10px 0}#comment-search-root dialog .comment-tree{height:500px;overflow:auto;overscroll-behavior:contain}#comment-search-root .comment-item{display:flex}#comment-search-root .comment-item-avatar{border-radius:50%;background-color:var(--Ga1);margin-right:10px;flex-shrink:0}#comment-search-root .comment-item-username{font-size:var(--bili-comments-font-size-name);margin-bottom:4px;margin-right:12px;color:#fb7299}#comment-search-root .comment-item-username[data-vip="0"]{color:var(--text2)}#comment-search-root .comment-item-message{font-size:14px;color:var(--text1)}#comment-search-root .comment-item-highlight{background-color:#f8eec2}#comment-search-root .comment-item-time{color:var(--text3);margin-top:4px} ');

(function (require$$0, require$$0$1) {
  'use strict';

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
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
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
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  var main = { exports: {} };
  (function(module) {
    module.exports = /******/
    function(modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId])
          return installedModules[moduleId].exports;
        var module2 = installedModules[moduleId] = {
          /******/
          exports: {},
          /******/
          id: moduleId,
          /******/
          loaded: false
          /******/
        };
        modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
        module2.loaded = true;
        return module2.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.p = "";
      return __webpack_require__(0);
    }([
      /* 0 */
      /***/
      function(module2, exports, __webpack_require__) {
        module2.exports = __webpack_require__(1);
      },
      /* 1 */
      /***/
      function(module2, exports, __webpack_require__) {
        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { "default": obj };
        }
        var _Highlighter = __webpack_require__(2);
        var _Highlighter2 = _interopRequireDefault(_Highlighter);
        exports["default"] = _Highlighter2["default"];
        module2.exports = exports["default"];
      },
      /* 2 */
      /***/
      function(module2, exports, __webpack_require__) {
        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        var _extends = Object.assign || function(target) {
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
        exports["default"] = Highlighter2;
        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { "default": obj };
        }
        function _objectWithoutProperties(obj, keys) {
          var target = {};
          for (var i in obj) {
            if (keys.indexOf(i) >= 0)
              continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i))
              continue;
            target[i] = obj[i];
          }
          return target;
        }
        var _highlightWordsCore = __webpack_require__(3);
        var _propTypes = __webpack_require__(4);
        var _propTypes2 = _interopRequireDefault(_propTypes);
        var _react = __webpack_require__(14);
        var _memoizeOne = __webpack_require__(15);
        var _memoizeOne2 = _interopRequireDefault(_memoizeOne);
        Highlighter2.propTypes = {
          activeClassName: _propTypes2["default"].string,
          activeIndex: _propTypes2["default"].number,
          activeStyle: _propTypes2["default"].object,
          autoEscape: _propTypes2["default"].bool,
          className: _propTypes2["default"].string,
          findChunks: _propTypes2["default"].func,
          highlightClassName: _propTypes2["default"].oneOfType([_propTypes2["default"].object, _propTypes2["default"].string]),
          highlightStyle: _propTypes2["default"].object,
          highlightTag: _propTypes2["default"].oneOfType([_propTypes2["default"].node, _propTypes2["default"].func, _propTypes2["default"].string]),
          sanitize: _propTypes2["default"].func,
          searchWords: _propTypes2["default"].arrayOf(_propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].instanceOf(RegExp)])).isRequired,
          textToHighlight: _propTypes2["default"].string.isRequired,
          unhighlightTag: _propTypes2["default"].oneOfType([_propTypes2["default"].node, _propTypes2["default"].func, _propTypes2["default"].string]),
          unhighlightClassName: _propTypes2["default"].string,
          unhighlightStyle: _propTypes2["default"].object
        };
        function Highlighter2(_ref) {
          var _ref$activeClassName = _ref.activeClassName;
          var activeClassName = _ref$activeClassName === void 0 ? "" : _ref$activeClassName;
          var _ref$activeIndex = _ref.activeIndex;
          var activeIndex = _ref$activeIndex === void 0 ? -1 : _ref$activeIndex;
          var activeStyle = _ref.activeStyle;
          var autoEscape = _ref.autoEscape;
          var _ref$caseSensitive = _ref.caseSensitive;
          var caseSensitive = _ref$caseSensitive === void 0 ? false : _ref$caseSensitive;
          var className = _ref.className;
          var findChunks = _ref.findChunks;
          var _ref$highlightClassName = _ref.highlightClassName;
          var highlightClassName = _ref$highlightClassName === void 0 ? "" : _ref$highlightClassName;
          var _ref$highlightStyle = _ref.highlightStyle;
          var highlightStyle = _ref$highlightStyle === void 0 ? {} : _ref$highlightStyle;
          var _ref$highlightTag = _ref.highlightTag;
          var highlightTag = _ref$highlightTag === void 0 ? "mark" : _ref$highlightTag;
          var sanitize = _ref.sanitize;
          var searchWords = _ref.searchWords;
          var textToHighlight = _ref.textToHighlight;
          var _ref$unhighlightTag = _ref.unhighlightTag;
          var unhighlightTag = _ref$unhighlightTag === void 0 ? "span" : _ref$unhighlightTag;
          var _ref$unhighlightClassName = _ref.unhighlightClassName;
          var unhighlightClassName = _ref$unhighlightClassName === void 0 ? "" : _ref$unhighlightClassName;
          var unhighlightStyle = _ref.unhighlightStyle;
          var rest = _objectWithoutProperties(_ref, ["activeClassName", "activeIndex", "activeStyle", "autoEscape", "caseSensitive", "className", "findChunks", "highlightClassName", "highlightStyle", "highlightTag", "sanitize", "searchWords", "textToHighlight", "unhighlightTag", "unhighlightClassName", "unhighlightStyle"]);
          var chunks = (0, _highlightWordsCore.findAll)({
            autoEscape,
            caseSensitive,
            findChunks,
            sanitize,
            searchWords,
            textToHighlight
          });
          var HighlightTag = highlightTag;
          var highlightIndex = -1;
          var highlightClassNames = "";
          var highlightStyles = void 0;
          var lowercaseProps = function lowercaseProps2(object) {
            var mapped = {};
            for (var key in object) {
              mapped[key.toLowerCase()] = object[key];
            }
            return mapped;
          };
          var memoizedLowercaseProps = (0, _memoizeOne2["default"])(lowercaseProps);
          return (0, _react.createElement)("span", _extends({
            className
          }, rest, {
            children: chunks.map(function(chunk, index) {
              var text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);
              if (chunk.highlight) {
                highlightIndex++;
                var highlightClass = void 0;
                if (typeof highlightClassName === "object") {
                  if (!caseSensitive) {
                    highlightClassName = memoizedLowercaseProps(highlightClassName);
                    highlightClass = highlightClassName[text.toLowerCase()];
                  } else {
                    highlightClass = highlightClassName[text];
                  }
                } else {
                  highlightClass = highlightClassName;
                }
                var isActive = highlightIndex === +activeIndex;
                highlightClassNames = highlightClass + " " + (isActive ? activeClassName : "");
                highlightStyles = isActive === true && activeStyle != null ? Object.assign({}, highlightStyle, activeStyle) : highlightStyle;
                var props = {
                  children: text,
                  className: highlightClassNames,
                  key: index,
                  style: highlightStyles
                };
                if (typeof HighlightTag !== "string") {
                  props.highlightIndex = highlightIndex;
                }
                return (0, _react.createElement)(HighlightTag, props);
              } else {
                return (0, _react.createElement)(unhighlightTag, {
                  children: text,
                  className: unhighlightClassName,
                  key: index,
                  style: unhighlightStyle
                });
              }
            })
          }));
        }
        module2.exports = exports["default"];
      },
      /* 3 */
      /***/
      function(module2, exports) {
        module2.exports = /******/
        function(modules) {
          var installedModules = {};
          function __webpack_require__(moduleId) {
            if (installedModules[moduleId])
              return installedModules[moduleId].exports;
            var module3 = installedModules[moduleId] = {
              /******/
              exports: {},
              /******/
              id: moduleId,
              /******/
              loaded: false
              /******/
            };
            modules[moduleId].call(module3.exports, module3, module3.exports, __webpack_require__);
            module3.loaded = true;
            return module3.exports;
          }
          __webpack_require__.m = modules;
          __webpack_require__.c = installedModules;
          __webpack_require__.p = "";
          return __webpack_require__(0);
        }([
          /* 0 */
          /***/
          function(module3, exports2, __webpack_require__) {
            module3.exports = __webpack_require__(1);
          },
          /* 1 */
          /***/
          function(module3, exports2, __webpack_require__) {
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            var _utils = __webpack_require__(2);
            Object.defineProperty(exports2, "combineChunks", {
              enumerable: true,
              get: function get() {
                return _utils.combineChunks;
              }
            });
            Object.defineProperty(exports2, "fillInChunks", {
              enumerable: true,
              get: function get() {
                return _utils.fillInChunks;
              }
            });
            Object.defineProperty(exports2, "findAll", {
              enumerable: true,
              get: function get() {
                return _utils.findAll;
              }
            });
            Object.defineProperty(exports2, "findChunks", {
              enumerable: true,
              get: function get() {
                return _utils.findChunks;
              }
            });
          },
          /* 2 */
          /***/
          function(module3, exports2) {
            Object.defineProperty(exports2, "__esModule", {
              value: true
            });
            exports2.findAll = function findAll(_ref) {
              var autoEscape = _ref.autoEscape, _ref$caseSensitive = _ref.caseSensitive, caseSensitive = _ref$caseSensitive === void 0 ? false : _ref$caseSensitive, _ref$findChunks = _ref.findChunks, findChunks = _ref$findChunks === void 0 ? defaultFindChunks : _ref$findChunks, sanitize = _ref.sanitize, searchWords = _ref.searchWords, textToHighlight = _ref.textToHighlight;
              return fillInChunks({
                chunksToHighlight: combineChunks({
                  chunks: findChunks({
                    autoEscape,
                    caseSensitive,
                    sanitize,
                    searchWords,
                    textToHighlight
                  })
                }),
                totalLength: textToHighlight ? textToHighlight.length : 0
              });
            };
            var combineChunks = exports2.combineChunks = function combineChunks2(_ref2) {
              var chunks = _ref2.chunks;
              chunks = chunks.sort(function(first, second) {
                return first.start - second.start;
              }).reduce(function(processedChunks, nextChunk) {
                if (processedChunks.length === 0) {
                  return [nextChunk];
                } else {
                  var prevChunk = processedChunks.pop();
                  if (nextChunk.start <= prevChunk.end) {
                    var endIndex = Math.max(prevChunk.end, nextChunk.end);
                    processedChunks.push({ start: prevChunk.start, end: endIndex });
                  } else {
                    processedChunks.push(prevChunk, nextChunk);
                  }
                  return processedChunks;
                }
              }, []);
              return chunks;
            };
            var defaultFindChunks = function defaultFindChunks2(_ref3) {
              var autoEscape = _ref3.autoEscape, caseSensitive = _ref3.caseSensitive, _ref3$sanitize = _ref3.sanitize, sanitize = _ref3$sanitize === void 0 ? identity : _ref3$sanitize, searchWords = _ref3.searchWords, textToHighlight = _ref3.textToHighlight;
              textToHighlight = sanitize(textToHighlight);
              return searchWords.filter(function(searchWord) {
                return searchWord;
              }).reduce(function(chunks, searchWord) {
                searchWord = sanitize(searchWord);
                if (autoEscape) {
                  searchWord = escapeRegExpFn(searchWord);
                }
                var regex = new RegExp(searchWord, caseSensitive ? "g" : "gi");
                var match = void 0;
                while (match = regex.exec(textToHighlight)) {
                  var start = match.index;
                  var end = regex.lastIndex;
                  if (end > start) {
                    chunks.push({ start, end });
                  }
                  if (match.index == regex.lastIndex) {
                    regex.lastIndex++;
                  }
                }
                return chunks;
              }, []);
            };
            exports2.findChunks = defaultFindChunks;
            var fillInChunks = exports2.fillInChunks = function fillInChunks2(_ref4) {
              var chunksToHighlight = _ref4.chunksToHighlight, totalLength = _ref4.totalLength;
              var allChunks = [];
              var append = function append2(start, end, highlight) {
                if (end - start > 0) {
                  allChunks.push({
                    start,
                    end,
                    highlight
                  });
                }
              };
              if (chunksToHighlight.length === 0) {
                append(0, totalLength, false);
              } else {
                var lastIndex = 0;
                chunksToHighlight.forEach(function(chunk) {
                  append(lastIndex, chunk.start, false);
                  append(chunk.start, chunk.end, true);
                  lastIndex = chunk.end;
                });
                append(lastIndex, totalLength, false);
              }
              return allChunks;
            };
            function identity(value) {
              return value;
            }
            function escapeRegExpFn(str) {
              return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            }
          }
          /******/
        ]);
      },
      /* 4 */
      /***/
      function(module2, exports, __webpack_require__) {
        (function(process) {
          {
            module2.exports = __webpack_require__(13)();
          }
        }).call(exports, __webpack_require__(5));
      },
      /* 5 */
      /***/
      function(module2, exports) {
        var process = module2.exports = {};
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
          throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
          throw new Error("clearTimeout has not been defined");
        }
        (function() {
          try {
            if (typeof setTimeout === "function") {
              cachedSetTimeout = setTimeout;
            } else {
              cachedSetTimeout = defaultSetTimout;
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout;
          }
          try {
            if (typeof clearTimeout === "function") {
              cachedClearTimeout = clearTimeout;
            } else {
              cachedClearTimeout = defaultClearTimeout;
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
          }
        })();
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            return setTimeout(fun, 0);
          }
          if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }
          try {
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e2) {
              return cachedSetTimeout.call(this, fun, 0);
            }
          }
        }
        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            return clearTimeout(marker);
          }
          if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }
          try {
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              return cachedClearTimeout.call(null, marker);
            } catch (e2) {
              return cachedClearTimeout.call(this, marker);
            }
          }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return;
          }
          draining = false;
          if (currentQueue.length) {
            queue = currentQueue.concat(queue);
          } else {
            queueIndex = -1;
          }
          if (queue.length) {
            drainQueue();
          }
        }
        function drainQueue() {
          if (draining) {
            return;
          }
          var timeout = runTimeout(cleanUpNextTick);
          draining = true;
          var len = queue.length;
          while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run();
              }
            }
            queueIndex = -1;
            len = queue.length;
          }
          currentQueue = null;
          draining = false;
          runClearTimeout(timeout);
        }
        process.nextTick = function(fun) {
          var args = new Array(arguments.length - 1);
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
            }
          }
          queue.push(new Item(fun, args));
          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
          }
        };
        function Item(fun, array) {
          this.fun = fun;
          this.array = array;
        }
        Item.prototype.run = function() {
          this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {
        }
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function(name2) {
          return [];
        };
        process.binding = function(name2) {
          throw new Error("process.binding is not supported");
        };
        process.cwd = function() {
          return "/";
        };
        process.chdir = function(dir) {
          throw new Error("process.chdir is not supported");
        };
        process.umask = function() {
          return 0;
        };
      },
      /* 6 */
      /***/
      function(module2, exports, __webpack_require__) {
        (function(process) {
          var emptyFunction = __webpack_require__(7);
          var invariant = __webpack_require__(8);
          var warning = __webpack_require__(9);
          var assign = __webpack_require__(10);
          var ReactPropTypesSecret = __webpack_require__(11);
          var checkPropTypes = __webpack_require__(12);
          module2.exports = function(isValidElement, throwOnDirectAccess) {
            var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
            var FAUX_ITERATOR_SYMBOL = "@@iterator";
            function getIteratorFn(maybeIterable) {
              var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
              if (typeof iteratorFn === "function") {
                return iteratorFn;
              }
            }
            var ANONYMOUS = "<<anonymous>>";
            var ReactPropTypes = {
              array: createPrimitiveTypeChecker("array"),
              bool: createPrimitiveTypeChecker("boolean"),
              func: createPrimitiveTypeChecker("function"),
              number: createPrimitiveTypeChecker("number"),
              object: createPrimitiveTypeChecker("object"),
              string: createPrimitiveTypeChecker("string"),
              symbol: createPrimitiveTypeChecker("symbol"),
              any: createAnyTypeChecker(),
              arrayOf: createArrayOfTypeChecker,
              element: createElementTypeChecker(),
              instanceOf: createInstanceTypeChecker,
              node: createNodeChecker(),
              objectOf: createObjectOfTypeChecker,
              oneOf: createEnumTypeChecker,
              oneOfType: createUnionTypeChecker,
              shape: createShapeTypeChecker,
              exact: createStrictShapeTypeChecker
            };
            function is(x, y) {
              if (x === y) {
                return x !== 0 || 1 / x === 1 / y;
              } else {
                return x !== x && y !== y;
              }
            }
            function PropTypeError(message) {
              this.message = message;
              this.stack = "";
            }
            PropTypeError.prototype = Error.prototype;
            function createChainableTypeChecker(validate) {
              function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
                componentName = componentName || ANONYMOUS;
                propFullName = propFullName || propName;
                if (secret !== ReactPropTypesSecret) {
                  if (throwOnDirectAccess) {
                    invariant(
                      false,
                      "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
                    );
                  }
                }
                if (props[propName] == null) {
                  if (isRequired) {
                    if (props[propName] === null) {
                      return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
                    }
                    return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
                  }
                  return null;
                } else {
                  return validate(props, propName, componentName, location, propFullName);
                }
              }
              var chainedCheckType = checkType.bind(null, false);
              chainedCheckType.isRequired = checkType.bind(null, true);
              return chainedCheckType;
            }
            function createPrimitiveTypeChecker(expectedType) {
              function validate(props, propName, componentName, location, propFullName, secret) {
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== expectedType) {
                  var preciseType = getPreciseType(propValue);
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createAnyTypeChecker() {
              return createChainableTypeChecker(emptyFunction.thatReturnsNull);
            }
            function createArrayOfTypeChecker(typeChecker) {
              function validate(props, propName, componentName, location, propFullName) {
                if (typeof typeChecker !== "function") {
                  return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
                }
                var propValue = props[propName];
                if (!Array.isArray(propValue)) {
                  var propType = getPropType(propValue);
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
                }
                for (var i = 0; i < propValue.length; i++) {
                  var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret);
                  if (error instanceof Error) {
                    return error;
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createElementTypeChecker() {
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                if (!isValidElement(propValue)) {
                  var propType = getPropType(propValue);
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createInstanceTypeChecker(expectedClass) {
              function validate(props, propName, componentName, location, propFullName) {
                if (!(props[propName] instanceof expectedClass)) {
                  var expectedClassName = expectedClass.name || ANONYMOUS;
                  var actualClassName = getClassName(props[propName]);
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createEnumTypeChecker(expectedValues) {
              if (!Array.isArray(expectedValues)) {
                return emptyFunction.thatReturnsNull;
              }
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                for (var i = 0; i < expectedValues.length; i++) {
                  if (is(propValue, expectedValues[i])) {
                    return null;
                  }
                }
                var valuesString = JSON.stringify(expectedValues);
                return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + propValue + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
              }
              return createChainableTypeChecker(validate);
            }
            function createObjectOfTypeChecker(typeChecker) {
              function validate(props, propName, componentName, location, propFullName) {
                if (typeof typeChecker !== "function") {
                  return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
                }
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== "object") {
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
                }
                for (var key in propValue) {
                  if (propValue.hasOwnProperty(key)) {
                    var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
                    if (error instanceof Error) {
                      return error;
                    }
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createUnionTypeChecker(arrayOfTypeCheckers) {
              if (!Array.isArray(arrayOfTypeCheckers)) {
                return emptyFunction.thatReturnsNull;
              }
              for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                var checker = arrayOfTypeCheckers[i];
                if (typeof checker !== "function") {
                  warning(
                    false,
                    "Invalid argument supplied to oneOfType. Expected an array of check functions, but received %s at index %s.",
                    getPostfixForTypeWarning(checker),
                    i
                  );
                  return emptyFunction.thatReturnsNull;
                }
              }
              function validate(props, propName, componentName, location, propFullName) {
                for (var i2 = 0; i2 < arrayOfTypeCheckers.length; i2++) {
                  var checker2 = arrayOfTypeCheckers[i2];
                  if (checker2(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
                    return null;
                  }
                }
                return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`."));
              }
              return createChainableTypeChecker(validate);
            }
            function createNodeChecker() {
              function validate(props, propName, componentName, location, propFullName) {
                if (!isNode(props[propName])) {
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createShapeTypeChecker(shapeTypes) {
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== "object") {
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
                }
                for (var key in shapeTypes) {
                  var checker = shapeTypes[key];
                  if (!checker) {
                    continue;
                  }
                  var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
                  if (error) {
                    return error;
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function createStrictShapeTypeChecker(shapeTypes) {
              function validate(props, propName, componentName, location, propFullName) {
                var propValue = props[propName];
                var propType = getPropType(propValue);
                if (propType !== "object") {
                  return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
                }
                var allKeys = assign({}, props[propName], shapeTypes);
                for (var key in allKeys) {
                  var checker = shapeTypes[key];
                  if (!checker) {
                    return new PropTypeError(
                      "Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  ")
                    );
                  }
                  var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
                  if (error) {
                    return error;
                  }
                }
                return null;
              }
              return createChainableTypeChecker(validate);
            }
            function isNode(propValue) {
              switch (typeof propValue) {
                case "number":
                case "string":
                case "undefined":
                  return true;
                case "boolean":
                  return !propValue;
                case "object":
                  if (Array.isArray(propValue)) {
                    return propValue.every(isNode);
                  }
                  if (propValue === null || isValidElement(propValue)) {
                    return true;
                  }
                  var iteratorFn = getIteratorFn(propValue);
                  if (iteratorFn) {
                    var iterator = iteratorFn.call(propValue);
                    var step;
                    if (iteratorFn !== propValue.entries) {
                      while (!(step = iterator.next()).done) {
                        if (!isNode(step.value)) {
                          return false;
                        }
                      }
                    } else {
                      while (!(step = iterator.next()).done) {
                        var entry = step.value;
                        if (entry) {
                          if (!isNode(entry[1])) {
                            return false;
                          }
                        }
                      }
                    }
                  } else {
                    return false;
                  }
                  return true;
                default:
                  return false;
              }
            }
            function isSymbol(propType, propValue) {
              if (propType === "symbol") {
                return true;
              }
              if (propValue["@@toStringTag"] === "Symbol") {
                return true;
              }
              if (typeof Symbol === "function" && propValue instanceof Symbol) {
                return true;
              }
              return false;
            }
            function getPropType(propValue) {
              var propType = typeof propValue;
              if (Array.isArray(propValue)) {
                return "array";
              }
              if (propValue instanceof RegExp) {
                return "object";
              }
              if (isSymbol(propType, propValue)) {
                return "symbol";
              }
              return propType;
            }
            function getPreciseType(propValue) {
              if (typeof propValue === "undefined" || propValue === null) {
                return "" + propValue;
              }
              var propType = getPropType(propValue);
              if (propType === "object") {
                if (propValue instanceof Date) {
                  return "date";
                } else if (propValue instanceof RegExp) {
                  return "regexp";
                }
              }
              return propType;
            }
            function getPostfixForTypeWarning(value) {
              var type = getPreciseType(value);
              switch (type) {
                case "array":
                case "object":
                  return "an " + type;
                case "boolean":
                case "date":
                case "regexp":
                  return "a " + type;
                default:
                  return type;
              }
            }
            function getClassName(propValue) {
              if (!propValue.constructor || !propValue.constructor.name) {
                return ANONYMOUS;
              }
              return propValue.constructor.name;
            }
            ReactPropTypes.checkPropTypes = checkPropTypes;
            ReactPropTypes.PropTypes = ReactPropTypes;
            return ReactPropTypes;
          };
        }).call(exports, __webpack_require__(5));
      },
      /* 7 */
      /***/
      function(module2, exports) {
        function makeEmptyFunction(arg) {
          return function() {
            return arg;
          };
        }
        var emptyFunction = function emptyFunction2() {
        };
        emptyFunction.thatReturns = makeEmptyFunction;
        emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
        emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
        emptyFunction.thatReturnsNull = makeEmptyFunction(null);
        emptyFunction.thatReturnsThis = function() {
          return this;
        };
        emptyFunction.thatReturnsArgument = function(arg) {
          return arg;
        };
        module2.exports = emptyFunction;
      },
      /* 8 */
      /***/
      function(module2, exports, __webpack_require__) {
        (function(process) {
          function invariant(condition, format, a, b, c, d, e, f2) {
            if (!condition) {
              var error;
              if (format === void 0) {
                error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
              } else {
                var args = [a, b, c, d, e, f2];
                var argIndex = 0;
                error = new Error(format.replace(/%s/g, function() {
                  return args[argIndex++];
                }));
                error.name = "Invariant Violation";
              }
              error.framesToPop = 1;
              throw error;
            }
          }
          module2.exports = invariant;
        }).call(exports, __webpack_require__(5));
      },
      /* 9 */
      /***/
      function(module2, exports, __webpack_require__) {
        (function(process) {
          var emptyFunction = __webpack_require__(7);
          var warning = emptyFunction;
          module2.exports = warning;
        }).call(exports, __webpack_require__(5));
      },
      /* 10 */
      /***/
      function(module2, exports) {
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
        module2.exports = shouldUseNative() ? Object.assign : function(target, source) {
          var from;
          var to = toObject(target);
          var symbols;
          for (var s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
            for (var key in from) {
              if (hasOwnProperty.call(from, key)) {
                to[key] = from[key];
              }
            }
            if (getOwnPropertySymbols) {
              symbols = getOwnPropertySymbols(from);
              for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                  to[symbols[i]] = from[symbols[i]];
                }
              }
            }
          }
          return to;
        };
      },
      /* 11 */
      /***/
      function(module2, exports) {
        var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
        module2.exports = ReactPropTypesSecret;
      },
      /* 12 */
      /***/
      function(module2, exports, __webpack_require__) {
        (function(process) {
          function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
          }
          module2.exports = checkPropTypes;
        }).call(exports, __webpack_require__(5));
      },
      /* 13 */
      /***/
      function(module2, exports, __webpack_require__) {
        var emptyFunction = __webpack_require__(7);
        var invariant = __webpack_require__(8);
        var ReactPropTypesSecret = __webpack_require__(11);
        module2.exports = function() {
          function shim(props, propName, componentName, location, propFullName, secret) {
            if (secret === ReactPropTypesSecret) {
              return;
            }
            invariant(
              false,
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
            );
          }
          shim.isRequired = shim;
          function getShim() {
            return shim;
          }
          var ReactPropTypes = {
            array: shim,
            bool: shim,
            func: shim,
            number: shim,
            object: shim,
            string: shim,
            symbol: shim,
            any: shim,
            arrayOf: getShim,
            element: shim,
            instanceOf: getShim,
            node: shim,
            objectOf: getShim,
            oneOf: getShim,
            oneOfType: getShim,
            shape: getShim,
            exact: getShim
          };
          ReactPropTypes.checkPropTypes = emptyFunction;
          ReactPropTypes.PropTypes = ReactPropTypes;
          return ReactPropTypes;
        };
      },
      /* 14 */
      /***/
      function(module2, exports) {
        module2.exports = require$$0;
      },
      /* 15 */
      /***/
      function(module2, exports) {
        var simpleIsEqual = function simpleIsEqual2(a, b) {
          return a === b;
        };
        function index(resultFn) {
          var isEqual = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : simpleIsEqual;
          var lastThis = void 0;
          var lastArgs = [];
          var lastResult = void 0;
          var calledOnce = false;
          var isNewArgEqualToLast = function isNewArgEqualToLast2(newArg, index2) {
            return isEqual(newArg, lastArgs[index2]);
          };
          var result = function result2() {
            for (var _len = arguments.length, newArgs = Array(_len), _key = 0; _key < _len; _key++) {
              newArgs[_key] = arguments[_key];
            }
            if (calledOnce && lastThis === this && newArgs.length === lastArgs.length && newArgs.every(isNewArgEqualToLast)) {
              return lastResult;
            }
            calledOnce = true;
            lastThis = this;
            lastArgs = newArgs;
            lastResult = resultFn.apply(this, newArgs);
            return lastResult;
          };
          return result;
        }
        module2.exports = index;
      }
      /******/
    ]);
  })(main);
  var mainExports = main.exports;
  const Highlighter = /* @__PURE__ */ getDefaultExportFromCjs(mainExports);
  var CommentType = /* @__PURE__ */ ((CommentType2) => {
    CommentType2[CommentType2["VIDEO"] = 1] = "VIDEO";
    CommentType2[CommentType2["TOPIC"] = 2] = "TOPIC";
    CommentType2[CommentType2["ACTIVITY"] = 4] = "ACTIVITY";
    CommentType2[CommentType2["SHORT_VIDEO"] = 5] = "SHORT_VIDEO";
    CommentType2[CommentType2["BAN_INFO"] = 6] = "BAN_INFO";
    CommentType2[CommentType2["NOTICE"] = 7] = "NOTICE";
    CommentType2[CommentType2["LIVE_ACTIVITY"] = 8] = "LIVE_ACTIVITY";
    CommentType2[CommentType2["ACTIVITY_ARTICLE"] = 9] = "ACTIVITY_ARTICLE";
    CommentType2[CommentType2["LIVE_NOTICE"] = 10] = "LIVE_NOTICE";
    CommentType2[CommentType2["ALBUM"] = 11] = "ALBUM";
    CommentType2[CommentType2["COLUMN"] = 12] = "COLUMN";
    CommentType2[CommentType2["TICKET"] = 13] = "TICKET";
    CommentType2[CommentType2["AUDIO"] = 14] = "AUDIO";
    CommentType2[CommentType2["JURY"] = 15] = "JURY";
    CommentType2[CommentType2["REVIEW"] = 16] = "REVIEW";
    CommentType2[CommentType2["DYNAMIC"] = 17] = "DYNAMIC";
    CommentType2[CommentType2["PLAYLIST"] = 18] = "PLAYLIST";
    CommentType2[CommentType2["MUSIC_PLAYLIST"] = 19] = "MUSIC_PLAYLIST";
    CommentType2[CommentType2["COMIC_1"] = 20] = "COMIC_1";
    CommentType2[CommentType2["COMIC_2"] = 21] = "COMIC_2";
    CommentType2[CommentType2["COMIC_3"] = 22] = "COMIC_3";
    CommentType2[CommentType2["COURSE"] = 33] = "COURSE";
    return CommentType2;
  })(CommentType || {});
  var CommentSort = /* @__PURE__ */ ((CommentSort2) => {
    CommentSort2[CommentSort2["TIME"] = 0] = "TIME";
    CommentSort2[CommentSort2["LIKES"] = 1] = "LIKES";
    CommentSort2[CommentSort2["REPLIES"] = 2] = "REPLIES";
    return CommentSort2;
  })(CommentSort || {});
  const name = "userscript-bilibili-comment-search";
  const version = "0.2.1";
  function assertEl(el) {
    if (!el) {
      throw new Error("Element not found");
    }
    return el;
  }
  function debug(message) {
    console.log(`[${name}] ${message}`);
  }
  function extractVideoId(url) {
    const match = url.match(/\/video\/(BV\w+)\//);
    if (!match) {
      throw new Error(`Failed to extract video id from url: ${url}`);
    }
    return match[1];
  }
  function formatDateTime(ts) {
    const date = new Date(ts * 1e3);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }
  const PAGE_LIMIT = 20;
  const replies = [];
  async function fetchComments(videoId) {
    if (replies.length > 0) {
      return replies;
    }
    const pageSize = 20;
    let page = 1;
    while (true) {
      const params = new URLSearchParams({
        type: CommentType.VIDEO.toString(),
        oid: videoId,
        sort: CommentSort.TIME.toString(),
        pn: page.toString(),
        ps: pageSize.toString()
      });
      debug(`fetch comments: page ${page}`);
      const response = await fetch(
        `https://api.bilibili.com/x/v2/reply?${params}`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (data.code !== 0) {
        throw new Error(`Failed to fetch comments: ${data.message}`);
      }
      if (!data.data) {
        throw new Error(`Failed to fetch comments: ${data.message}`);
      }
      replies.push(...data.data.replies ?? []);
      if (page * pageSize >= Math.min(PAGE_LIMIT * pageSize, data.data.page.count)) {
        break;
      }
      page++;
    }
    return replies;
  }
  let keyword = "";
  function App() {
    const dialogRef = require$$0.useRef(null);
    const inputRef = require$$0.useRef(null);
    const [comments, setComments] = require$$0.useState();
    const promiseRef = require$$0.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "dialog",
        {
          ref: dialogRef,
          onClick: (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
              e.currentTarget.close();
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
                "Bilibili Comment Search ",
                "",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "v",
                  version
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                var _a;
                return (_a = dialogRef.current) == null ? void 0 : _a.close();
              }, children: "X" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: inputRef,
                placeholder: "搜索评论",
                onKeyDown: (e) => {
                  if (e.key === "Enter" && promiseRef.current) {
                    e.preventDefault();
                    keyword = e.currentTarget.value;
                    promiseRef.current.then((allComments) => {
                      const comments2 = searchComments(allComments);
                      setComments(comments2);
                    }).catch((e2) => {
                      console.error(e2);
                    });
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "note", children: [
              "Note: 由于性能和 Rate Limit 的原因，目前仅会加载 ",
              PAGE_LIMIT,
              " ",
              "页评论，即 ",
              PAGE_LIMIT,
              " * 20 条评论，及其至多 3 条子评论。"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comment-tree", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CommentTree, { comments }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            var _a, _b;
            (_a = dialogRef.current) == null ? void 0 : _a.showModal();
            (_b = inputRef.current) == null ? void 0 : _b.focus();
            const videoId = extractVideoId(window.location.href);
            promiseRef.current = fetchComments(videoId);
          },
          children: "搜索评论"
        }
      )
    ] });
  }
  const CommentTree = ({ comments, sub = false }) => {
    if (!comments)
      return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: comments.sort((c1, c2) => c1.ctime - c2.ctime).map((comment) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: "comment-item",
        style: {
          marginTop: sub ? "10px" : "20px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: comment.member.avatar,
              className: "comment-item-avatar",
              style: {
                width: sub ? "28px" : "40px",
                height: sub ? "28px" : "40px"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "comment-item-content",
              style: {
                ...!sub && {
                  display: "flex",
                  flexDirection: "column"
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    className: "comment-item-username",
                    href: `https://space.bilibili.com/${comment.member.mid}`,
                    target: "_blank",
                    "data-vip": comment.member.vip.vipType,
                    children: comment.member.uname
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Highlighter,
                  {
                    className: "comment-item-message",
                    highlightClassName: "comment-item-highlight",
                    searchWords: [keyword],
                    autoEscape: true,
                    textToHighlight: comment.content.message
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comment-item-time", children: formatDateTime(comment.ctime) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CommentTree, { comments: comment.replies, sub: true })
              ]
            }
          )
        ]
      },
      comment.rpid
    )) });
  };
  function searchComments(allComments) {
    return allComments.filter((comment) => {
      var _a;
      return comment.content.message.includes(keyword) || ((_a = comment.replies) == null ? void 0 : _a.some((reply) => reply.content.message.includes(keyword)));
    });
  }
  function run() {
    debug("run");
    const id = "comment-search-root";
    let root = document.querySelector(`#${id}`);
    if (root) {
      debug("root exists");
      return;
    }
    const container = assertEl(document.querySelector("#commentapp"));
    root = document.createElement("div");
    root.id = id;
    container.prepend(root);
    debug("render");
    client.createRoot(root).render(
      /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
    );
  }
  window.addEventListener("load", () => {
    const timer = setInterval(() => {
      try {
        run();
        clearInterval(timer);
      } catch (error) {
      }
    }, 500);
  });

})(React, ReactDOM);
