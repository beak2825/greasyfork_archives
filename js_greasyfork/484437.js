// ==UserScript==
// @name         🔥解除复制限制，支持百度文库，360文库🔥
// @namespace    https://www.softrr.cn/
// @version      2.0.5
// @author       hackhase
// @description  有些网站做了限制，没法实现右键复制，这个脚本就是为了解决这个问题。
// @license      MIT
// @icon         http://pubimage.360doc.com/index7/nlogo.jpg
// @match        *://www.jdxzz.com/*
// @match        *://wenku.baidu.com/view/*
// @match        *://www.51test.net/show/*
// @match        *://www.xuexila.com/*
// @match        *://www.cspengbo.com/*
// @match        *://*.diyifanwen.com/*
// @match        *://*.cnitpm.com/*
// @match        *://*.ruiwen.com/*
// @match        *://www.oh100.com/*
// @match        *://www.fwsir.com/*
// @match        *://www.wenxm.cn/*
// @match        *://www.unjs.com/*
// @match        *://www.ahsrst.cn/*
// @match        *://*.360doc.com/content/*
// @match        *://*.chazidian.com/*
// @match        *://blog.51cto.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.global.prod.js
// @connect      www.softrr.cn
// @connect      api.softrr.cn
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/484437/%F0%9F%94%A5%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E6%94%AF%E6%8C%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BC%8C360%E6%96%87%E5%BA%93%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/484437/%F0%9F%94%A5%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E6%94%AF%E6%8C%81%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BC%8C360%E6%96%87%E5%BA%93%F0%9F%94%A5.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' @charset "UTF-8";:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}.modal-wrapper[data-v-1634adb5]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}.modalContainer[data-v-1634adb5]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-1634adb5]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-1634adb5]{margin:0;font-size:20px;font-weight:700}.header button[data-v-1634adb5]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.contentClass[data-v-1634adb5]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.contentClass .produce p[data-v-1634adb5]{margin-top:15px}.contentClass .produce .ipt[data-v-1634adb5]{margin-top:15px;height:30px;border-radius:5px;padding-left:10px}.contentClass .img[data-v-1634adb5]{display:flex;align-items:center;justify-content:center}.contentClass .img img[data-v-1634adb5]{width:180px}input[data-v-1634adb5]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.copy[data-v-09e63593]{width:160px;z-index:999}.copy .btn[data-v-09e63593]{background-color:red;color:#fff} ');

(function (vue) {
  'use strict';

  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var clipboard = { exports: {} };
  /*!
   * clipboard.js v2.0.11
   * https://clipboardjs.com/
   *
   * Licensed MIT © Zeno Rocha
   */
  (function(module, exports) {
    (function webpackUniversalModuleDefinition(root, factory) {
      module.exports = factory();
    })(commonjsGlobal, function() {
      return (
        /******/
        function() {
          var __webpack_modules__ = {
            /***/
            686: (
              /***/
              function(__unused_webpack_module, __webpack_exports__, __webpack_require__2) {
                __webpack_require__2.d(__webpack_exports__, {
                  "default": function() {
                    return (
                      /* binding */
                      clipboard2
                    );
                  }
                });
                var tiny_emitter = __webpack_require__2(279);
                var tiny_emitter_default = /* @__PURE__ */ __webpack_require__2.n(tiny_emitter);
                var listen = __webpack_require__2(370);
                var listen_default = /* @__PURE__ */ __webpack_require__2.n(listen);
                var src_select = __webpack_require__2(817);
                var select_default = /* @__PURE__ */ __webpack_require__2.n(src_select);
                function command(type) {
                  try {
                    return document.execCommand(type);
                  } catch (err) {
                    return false;
                  }
                }
                var ClipboardActionCut = function ClipboardActionCut2(target) {
                  var selectedText = select_default()(target);
                  command("cut");
                  return selectedText;
                };
                var actions_cut = ClipboardActionCut;
                function createFakeElement(value) {
                  var isRTL = document.documentElement.getAttribute("dir") === "rtl";
                  var fakeElement = document.createElement("textarea");
                  fakeElement.style.fontSize = "12pt";
                  fakeElement.style.border = "0";
                  fakeElement.style.padding = "0";
                  fakeElement.style.margin = "0";
                  fakeElement.style.position = "absolute";
                  fakeElement.style[isRTL ? "right" : "left"] = "-9999px";
                  var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                  fakeElement.style.top = "".concat(yPosition, "px");
                  fakeElement.setAttribute("readonly", "");
                  fakeElement.value = value;
                  return fakeElement;
                }
                var fakeCopyAction = function fakeCopyAction2(value, options) {
                  var fakeElement = createFakeElement(value);
                  options.container.appendChild(fakeElement);
                  var selectedText = select_default()(fakeElement);
                  command("copy");
                  fakeElement.remove();
                  return selectedText;
                };
                var ClipboardActionCopy = function ClipboardActionCopy2(target) {
                  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                    container: document.body
                  };
                  var selectedText = "";
                  if (typeof target === "string") {
                    selectedText = fakeCopyAction(target, options);
                  } else if (target instanceof HTMLInputElement && !["text", "search", "url", "tel", "password"].includes(target === null || target === void 0 ? void 0 : target.type)) {
                    selectedText = fakeCopyAction(target.value, options);
                  } else {
                    selectedText = select_default()(target);
                    command("copy");
                  }
                  return selectedText;
                };
                var actions_copy = ClipboardActionCopy;
                function _typeof(obj) {
                  "@babel/helpers - typeof";
                  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof = function _typeof2(obj2) {
                      return typeof obj2;
                    };
                  } else {
                    _typeof = function _typeof2(obj2) {
                      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                    };
                  }
                  return _typeof(obj);
                }
                var ClipboardActionDefault = function ClipboardActionDefault2() {
                  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                  var _options$action = options.action, action = _options$action === void 0 ? "copy" : _options$action, container = options.container, target = options.target, text = options.text;
                  if (action !== "copy" && action !== "cut") {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                  }
                  if (target !== void 0) {
                    if (target && _typeof(target) === "object" && target.nodeType === 1) {
                      if (action === "copy" && target.hasAttribute("disabled")) {
                        throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                      }
                      if (action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                        throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`);
                      }
                    } else {
                      throw new Error('Invalid "target" value, use a valid Element');
                    }
                  }
                  if (text) {
                    return actions_copy(text, {
                      container
                    });
                  }
                  if (target) {
                    return action === "cut" ? actions_cut(target) : actions_copy(target, {
                      container
                    });
                  }
                };
                var actions_default = ClipboardActionDefault;
                function clipboard_typeof(obj) {
                  "@babel/helpers - typeof";
                  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    clipboard_typeof = function _typeof2(obj2) {
                      return typeof obj2;
                    };
                  } else {
                    clipboard_typeof = function _typeof2(obj2) {
                      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                    };
                  }
                  return clipboard_typeof(obj);
                }
                function _classCallCheck(instance, Constructor) {
                  if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                  }
                }
                function _defineProperties(target, props) {
                  for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor)
                      descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }
                function _createClass(Constructor, protoProps, staticProps) {
                  if (protoProps)
                    _defineProperties(Constructor.prototype, protoProps);
                  if (staticProps)
                    _defineProperties(Constructor, staticProps);
                  return Constructor;
                }
                function _inherits(subClass, superClass) {
                  if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                  }
                  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
                  if (superClass)
                    _setPrototypeOf(subClass, superClass);
                }
                function _setPrototypeOf(o, p) {
                  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
                    o2.__proto__ = p2;
                    return o2;
                  };
                  return _setPrototypeOf(o, p);
                }
                function _createSuper(Derived) {
                  var hasNativeReflectConstruct = _isNativeReflectConstruct();
                  return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived), result;
                    if (hasNativeReflectConstruct) {
                      var NewTarget = _getPrototypeOf(this).constructor;
                      result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                      result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                  };
                }
                function _possibleConstructorReturn(self2, call) {
                  if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) {
                    return call;
                  }
                  return _assertThisInitialized(self2);
                }
                function _assertThisInitialized(self2) {
                  if (self2 === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                  }
                  return self2;
                }
                function _isNativeReflectConstruct() {
                  if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                  if (Reflect.construct.sham)
                    return false;
                  if (typeof Proxy === "function")
                    return true;
                  try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], function() {
                    }));
                    return true;
                  } catch (e2) {
                    return false;
                  }
                }
                function _getPrototypeOf(o) {
                  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
                    return o2.__proto__ || Object.getPrototypeOf(o2);
                  };
                  return _getPrototypeOf(o);
                }
                function getAttributeValue(suffix, element) {
                  var attribute = "data-clipboard-".concat(suffix);
                  if (!element.hasAttribute(attribute)) {
                    return;
                  }
                  return element.getAttribute(attribute);
                }
                var Clipboard2 = /* @__PURE__ */ function(_Emitter) {
                  _inherits(Clipboard3, _Emitter);
                  var _super = _createSuper(Clipboard3);
                  function Clipboard3(trigger, options) {
                    var _this;
                    _classCallCheck(this, Clipboard3);
                    _this = _super.call(this);
                    _this.resolveOptions(options);
                    _this.listenClick(trigger);
                    return _this;
                  }
                  _createClass(Clipboard3, [{
                    key: "resolveOptions",
                    value: function resolveOptions() {
                      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                      this.action = typeof options.action === "function" ? options.action : this.defaultAction;
                      this.target = typeof options.target === "function" ? options.target : this.defaultTarget;
                      this.text = typeof options.text === "function" ? options.text : this.defaultText;
                      this.container = clipboard_typeof(options.container) === "object" ? options.container : document.body;
                    }
                    /**
                     * Adds a click event listener to the passed trigger.
                     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                     */
                  }, {
                    key: "listenClick",
                    value: function listenClick(trigger) {
                      var _this2 = this;
                      this.listener = listen_default()(trigger, "click", function(e2) {
                        return _this2.onClick(e2);
                      });
                    }
                    /**
                     * Defines a new `ClipboardAction` on each click event.
                     * @param {Event} e
                     */
                  }, {
                    key: "onClick",
                    value: function onClick(e2) {
                      var trigger = e2.delegateTarget || e2.currentTarget;
                      var action = this.action(trigger) || "copy";
                      var text = actions_default({
                        action,
                        container: this.container,
                        target: this.target(trigger),
                        text: this.text(trigger)
                      });
                      this.emit(text ? "success" : "error", {
                        action,
                        text,
                        trigger,
                        clearSelection: function clearSelection() {
                          if (trigger) {
                            trigger.focus();
                          }
                          window.getSelection().removeAllRanges();
                        }
                      });
                    }
                    /**
                     * Default `action` lookup function.
                     * @param {Element} trigger
                     */
                  }, {
                    key: "defaultAction",
                    value: function defaultAction(trigger) {
                      return getAttributeValue("action", trigger);
                    }
                    /**
                     * Default `target` lookup function.
                     * @param {Element} trigger
                     */
                  }, {
                    key: "defaultTarget",
                    value: function defaultTarget(trigger) {
                      var selector = getAttributeValue("target", trigger);
                      if (selector) {
                        return document.querySelector(selector);
                      }
                    }
                    /**
                     * Allow fire programmatically a copy action
                     * @param {String|HTMLElement} target
                     * @param {Object} options
                     * @returns Text copied.
                     */
                  }, {
                    key: "defaultText",
                    /**
                     * Default `text` lookup function.
                     * @param {Element} trigger
                     */
                    value: function defaultText(trigger) {
                      return getAttributeValue("text", trigger);
                    }
                    /**
                     * Destroy lifecycle.
                     */
                  }, {
                    key: "destroy",
                    value: function destroy() {
                      this.listener.destroy();
                    }
                  }], [{
                    key: "copy",
                    value: function copy(target) {
                      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
                        container: document.body
                      };
                      return actions_copy(target, options);
                    }
                    /**
                     * Allow fire programmatically a cut action
                     * @param {String|HTMLElement} target
                     * @returns Text cutted.
                     */
                  }, {
                    key: "cut",
                    value: function cut(target) {
                      return actions_cut(target);
                    }
                    /**
                     * Returns the support of the given action, or all actions if no action is
                     * given.
                     * @param {String} [action]
                     */
                  }, {
                    key: "isSupported",
                    value: function isSupported() {
                      var action = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["copy", "cut"];
                      var actions = typeof action === "string" ? [action] : action;
                      var support = !!document.queryCommandSupported;
                      actions.forEach(function(action2) {
                        support = support && !!document.queryCommandSupported(action2);
                      });
                      return support;
                    }
                  }]);
                  return Clipboard3;
                }(tiny_emitter_default());
                var clipboard2 = Clipboard2;
              }
            ),
            /***/
            828: (
              /***/
              function(module2) {
                var DOCUMENT_NODE_TYPE = 9;
                if (typeof Element !== "undefined" && !Element.prototype.matches) {
                  var proto = Element.prototype;
                  proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
                }
                function closest(element, selector) {
                  while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
                    if (typeof element.matches === "function" && element.matches(selector)) {
                      return element;
                    }
                    element = element.parentNode;
                  }
                }
                module2.exports = closest;
              }
            ),
            /***/
            438: (
              /***/
              function(module2, __unused_webpack_exports, __webpack_require__2) {
                var closest = __webpack_require__2(828);
                function _delegate(element, selector, type, callback, useCapture) {
                  var listenerFn = listener.apply(this, arguments);
                  element.addEventListener(type, listenerFn, useCapture);
                  return {
                    destroy: function() {
                      element.removeEventListener(type, listenerFn, useCapture);
                    }
                  };
                }
                function delegate(elements, selector, type, callback, useCapture) {
                  if (typeof elements.addEventListener === "function") {
                    return _delegate.apply(null, arguments);
                  }
                  if (typeof type === "function") {
                    return _delegate.bind(null, document).apply(null, arguments);
                  }
                  if (typeof elements === "string") {
                    elements = document.querySelectorAll(elements);
                  }
                  return Array.prototype.map.call(elements, function(element) {
                    return _delegate(element, selector, type, callback, useCapture);
                  });
                }
                function listener(element, selector, type, callback) {
                  return function(e2) {
                    e2.delegateTarget = closest(e2.target, selector);
                    if (e2.delegateTarget) {
                      callback.call(element, e2);
                    }
                  };
                }
                module2.exports = delegate;
              }
            ),
            /***/
            879: (
              /***/
              function(__unused_webpack_module, exports2) {
                exports2.node = function(value) {
                  return value !== void 0 && value instanceof HTMLElement && value.nodeType === 1;
                };
                exports2.nodeList = function(value) {
                  var type = Object.prototype.toString.call(value);
                  return value !== void 0 && (type === "[object NodeList]" || type === "[object HTMLCollection]") && "length" in value && (value.length === 0 || exports2.node(value[0]));
                };
                exports2.string = function(value) {
                  return typeof value === "string" || value instanceof String;
                };
                exports2.fn = function(value) {
                  var type = Object.prototype.toString.call(value);
                  return type === "[object Function]";
                };
              }
            ),
            /***/
            370: (
              /***/
              function(module2, __unused_webpack_exports, __webpack_require__2) {
                var is = __webpack_require__2(879);
                var delegate = __webpack_require__2(438);
                function listen(target, type, callback) {
                  if (!target && !type && !callback) {
                    throw new Error("Missing required arguments");
                  }
                  if (!is.string(type)) {
                    throw new TypeError("Second argument must be a String");
                  }
                  if (!is.fn(callback)) {
                    throw new TypeError("Third argument must be a Function");
                  }
                  if (is.node(target)) {
                    return listenNode(target, type, callback);
                  } else if (is.nodeList(target)) {
                    return listenNodeList(target, type, callback);
                  } else if (is.string(target)) {
                    return listenSelector(target, type, callback);
                  } else {
                    throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
                  }
                }
                function listenNode(node, type, callback) {
                  node.addEventListener(type, callback);
                  return {
                    destroy: function() {
                      node.removeEventListener(type, callback);
                    }
                  };
                }
                function listenNodeList(nodeList, type, callback) {
                  Array.prototype.forEach.call(nodeList, function(node) {
                    node.addEventListener(type, callback);
                  });
                  return {
                    destroy: function() {
                      Array.prototype.forEach.call(nodeList, function(node) {
                        node.removeEventListener(type, callback);
                      });
                    }
                  };
                }
                function listenSelector(selector, type, callback) {
                  return delegate(document.body, selector, type, callback);
                }
                module2.exports = listen;
              }
            ),
            /***/
            817: (
              /***/
              function(module2) {
                function select(element) {
                  var selectedText;
                  if (element.nodeName === "SELECT") {
                    element.focus();
                    selectedText = element.value;
                  } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                    var isReadOnly = element.hasAttribute("readonly");
                    if (!isReadOnly) {
                      element.setAttribute("readonly", "");
                    }
                    element.select();
                    element.setSelectionRange(0, element.value.length);
                    if (!isReadOnly) {
                      element.removeAttribute("readonly");
                    }
                    selectedText = element.value;
                  } else {
                    if (element.hasAttribute("contenteditable")) {
                      element.focus();
                    }
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    selectedText = selection.toString();
                  }
                  return selectedText;
                }
                module2.exports = select;
              }
            ),
            /***/
            279: (
              /***/
              function(module2) {
                function E() {
                }
                E.prototype = {
                  on: function(name, callback, ctx) {
                    var e2 = this.e || (this.e = {});
                    (e2[name] || (e2[name] = [])).push({
                      fn: callback,
                      ctx
                    });
                    return this;
                  },
                  once: function(name, callback, ctx) {
                    var self2 = this;
                    function listener() {
                      self2.off(name, listener);
                      callback.apply(ctx, arguments);
                    }
                    listener._ = callback;
                    return this.on(name, listener, ctx);
                  },
                  emit: function(name) {
                    var data = [].slice.call(arguments, 1);
                    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
                    var i = 0;
                    var len = evtArr.length;
                    for (i; i < len; i++) {
                      evtArr[i].fn.apply(evtArr[i].ctx, data);
                    }
                    return this;
                  },
                  off: function(name, callback) {
                    var e2 = this.e || (this.e = {});
                    var evts = e2[name];
                    var liveEvents = [];
                    if (evts && callback) {
                      for (var i = 0, len = evts.length; i < len; i++) {
                        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                          liveEvents.push(evts[i]);
                      }
                    }
                    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
                    return this;
                  }
                };
                module2.exports = E;
                module2.exports.TinyEmitter = E;
              }
            )
            /******/
          };
          var __webpack_module_cache__ = {};
          function __webpack_require__(moduleId) {
            if (__webpack_module_cache__[moduleId]) {
              return __webpack_module_cache__[moduleId].exports;
            }
            var module2 = __webpack_module_cache__[moduleId] = {
              /******/
              // no module.id needed
              /******/
              // no module.loaded needed
              /******/
              exports: {}
              /******/
            };
            __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
            return module2.exports;
          }
          !function() {
            __webpack_require__.n = function(module2) {
              var getter = module2 && module2.__esModule ? (
                /******/
                function() {
                  return module2["default"];
                }
              ) : (
                /******/
                function() {
                  return module2;
                }
              );
              __webpack_require__.d(getter, { a: getter });
              return getter;
            };
          }();
          !function() {
            __webpack_require__.d = function(exports2, definition) {
              for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports2, key)) {
                  Object.defineProperty(exports2, key, { enumerable: true, get: definition[key] });
                }
              }
            };
          }();
          !function() {
            __webpack_require__.o = function(obj, prop) {
              return Object.prototype.hasOwnProperty.call(obj, prop);
            };
          }();
          return __webpack_require__(686);
        }().default
      );
    });
  })(clipboard);
  var clipboardExports = clipboard.exports;
  const Clipboard = /* @__PURE__ */ getDefaultExportFromCjs(clipboardExports);
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-1634adb5"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "modalContainer" };
  const _hoisted_2 = { class: "header" };
  const _hoisted_3 = { class: "contentClass" };
  const _hoisted_4 = { class: "produce" };
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "1、扫描右侧公众号，点击关注！", -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "2、在软件爬取者后台回复：验证码", -1));
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "3、在下方输入框输入获取的验证码后回车", -1));
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "img" }, [
    /* @__PURE__ */ vue.createElementVNode("img", {
      src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4AAQSkZJRgABAQAAAQABAAD/2wEEEAANAA0ADQANAA4ADQAOABAAEAAOABQAFgATABYAFAAeABsAGQAZABsAHgAtACAAIgAgACIAIAAtAEQAKgAyACoAKgAyACoARAA8AEkAOwA3ADsASQA8AGwAVQBLAEsAVQBsAH0AaQBjAGkAfQCXAIcAhwCXAL4AtQC+APkA+QFOEQANAA0ADQANAA4ADQAOABAAEAAOABQAFgATABYAFAAeABsAGQAZABsAHgAtACAAIgAgACIAIAAtAEQAKgAyACoAKgAyACoARAA8AEkAOwA3ADsASQA8AGwAVQBLAEsAVQBsAH0AaQBjAGkAfQCXAIcAhwCXAL4AtQC+APkA+QFO/8IAEQgBAgECAwEiAAIRAQMRAf/EADQAAAMBAQADAQAAAAAAAAAAAAAGBwUEAQMIAgEBAAMBAQEAAAAAAAAAAAAAAAQFBgMBAv/aAAwDAQACEAMQAAAApwAAAAAAAAAAAAAAAAAAAAAAAAAAAAASnC/VnIsVEJc96yqcwBuItgmZ1VVGDCq2LOivkgfRiFxWKZiybTMysTphGSTVNVFYrXMS4sUgLiAAAAEOpsyqBAwC+KbYpmo8w78FQWFbBN+5/NtZPLROgwafpzEVrF2YA8x/MVTz4Avim2KYsKzYplQW2RbLiAAAAEOp2VnDMK3sPfx+1iJppM+oaUg/OUX6fM8wHudcjQajkmLJqU3NmBWY5yXgg/La8410GnoI1i1+Bokjh+ylgAAAAGLgBvYOGPWFq6JpejMkxpoVk3yN7tHiJ1YF8l4zOWBJT6LwpeHL1VpDMGs7eKbSM3+gju9VZAMyKzTo+kgAAAAheXrqZeMvNciIPk56g+iPmL6dBHeJSUNGzKYI+kj7hVUd4lJQ0dqgZUtONNhS1nymltyeySj3m6SOUqZXSHFxAAAACHXGF2E08VQQBpfFUGpD18c09XKWD90RlnMmDQM9N73HMdl7O+fqjT70M3T2Hb7nLYljUdTKWBznD/8Agcp1rPAhzqjeSlgAAABjRqyRswD6LkA8iwFfQJDXDjc4jUBonzinT6fo3sbozN/7sNlyolhwtaq07bDp7mm4NXobB6V9HPyzy6oDVL96blSoMqwC/AAAABC9XN0TMacnCLaiOMlMs5bwceb43hF8uiTZU3fp5H6z11s5vD7eUv17WMwaXMYNMW+quu9pHQw1cupQMqWWg/SxEst90h5AAAACVYbwDP1zrNF+tRvVLZMOevBi8a0P80qivMr1f9d+j2iqHu19HlJXXLC3XkrruBL4Vl9EYvJMDVfPEvKjgzh/PWt0uYl0AAAACHbj3tEz6+kDLoU+Ey/I+CUX3qEmPpKZJ1aMFdruKILskvhgTlp0hZVeu4kYp+ZzDpGKeiGD9JI8aLIZa2XEAAAAEcwUMta2hWc0URxTRDf2bDNuX5fKOiD9KyYfEN/gZ5fPIU/J7JKGom28WKVmTwTX2WhUhM6ymzHy9DyAAAAGLzS5sGUWgZdKY6hyoX0lNDRxPf8AsWWTU1DFZFKkEzouFokfGoFWsdXgjuDbZgWr0GUTSzxWniIhNLSUsAAAAIdV5RUCWCsF8VmlUKZ6JjSyUoX0ZzCJuPIQwrKGYQ9hqkkcjMKLKCvSGv5xLjeqx82uebUBUcYlyn0kAAAAEOsEe8DQK4U9WT3MpUfsHzEVDVyqaTdkkriLDTpTocP3lP4qssxC6Q6rSkZJf9FxMvyzMmc8mXRTizvCKXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/xAAtEAACAQMCBAcAAwADAQAAAAAEBQYAAQIDFhEUFTYHEBITFyAxISUmMDRgRf/aAAgBAQABCAD/AMJJpM7XPDhBd6SWt6SWt6SWt6SWoS7ZtbM+ek0mdrnhwgsZlDs94EKVNXLNT0y4W9JLUZlDs94EKVUmkztc8OEF+0mJKXojSx96yao2YSeiBJJkxJS9EaWPvSS1vSS1vSS1vSS1vSS/ab90MqMNGAG1CSbTKLW/d4RiplhbazK9eG1+HWak0XdnvDShYzGXa54CWUxcrFXs886SsnzMlmrcuVj1YQsWQpOzUdSsaXJUQBOoKWlTM0DMZmzmzlW1ss5GG522sttW8IxUjtuuwnRNlyWkqZmgZjM2c2crWtlvIxiTol6MEYqZYW2syvXhpe1ruKLkqIAnUFL3hGKXOFjX3uRm/dDL7TfuhlUy7XY385lhbazK9eG/45pxNukMyQr1I45i+sHW5bxK/RKhXcy3ydQmzVkSdTlZZqrIDqSxqyDk+EN7XXUlW9VZDhVHI5ZDznCnM2s1WEA+cywttZlevDf8c1NO5mXl4b/jmpv3Qy+037oZVMsLbWZX85lhbazK9eG/45qb90Mq3pJa3pJaNNJPJ1CSgjSQCtMoWEumbWzOx0mkztc8OEFjModnvAhSmKZW0x0eedOWaBmSsWCRpEATplCTZwzUdN5Lekl+kywttZlevDf8c1N+6GXl4b/jmpv3Qy+037oZVvCMVvCMVvCMVJpMiPRGjC+G/wCOam/dDKkqZmgZjM2a1wsa+9cKb90MqMNGAG1CSZLa0q5PoaZyuQrR1TQ2MPABcyivDb/7FFyVEATqClpUzNAzGZs1rlY1964RclRAE6gpZsYeAC5lFLUrNr73ImhEgFagpUywttZleoQ5VqrM+e3hGK3hGK3lGKk5gp7wwkX6uoTZqyJOr4xzrPw29H78Y518Y51HI5ZDznB1CbNWRJ1TLDjGGWVRqS9A5zi6ZdVZEG1Mu12N6jUl6BznF0y6qyINpzNrNVhANeG/45qa9zMqmWHGMMsqjUlshsbxdMuqsiDadLLNFhIVRyOWQ83wdQmzVmSbTlZZorJDr44r4xzr41r44r41/wCCauGamy24UbMJPRAkkyYkpeiNLHhLtm1sy52iwRjhNUcubplqrpvI0bJ3h4uYpUJTLWvUuek4QoDwwUWvDX8c0bGkR5GoUSWCMcJqjl3h0ZqThCgPDBRd6SWt6SWo2YSeiBJJqbOGanplwt6SWozKHZ7wIUqauWanplwt6SX7FyVEATqCluXKx6sIWLIUmZqep2Nk0XdnvDShd4RilrlY09+4RclRAE6gpey5LUJTs1HUudLkqIAnUFLkgZJ6I4YZklZKvZubDc7bWW2qEd0LamyVm1ssuEaESAVqClbLktbLktRkYpeiCEIjMZdrngJZVFyVEATqClmGjADahJK1ysae9cKkqZmgZjM2ck/1Vg+iGhEgFagpX1mnczKkrPpLMc6o3JMH3OU4mvSGRIN0q3qrIcKuwqdMuqsiDfN1CbNWRJ1OWPSlhB1d+VaTbT4JKTwnpDMY21OoTZqyJOpyx6UsJOr5Kr5KpLNrNWQwNSOR9BsHx23aV/3dOVlmqsgOo5HLIec4OJt0hkSFfctpX/R1HI50HnKmvczL7Tfuhl5eGv45o2NIjyNQokI0kArTKFZOmTX2bG+cmkztc8OEFSumT5mMsaLkyxV73IzfuhlUZlDs94EKVUmkztc8OEFmWFtrMr+cI7oW14lenimoKTvABcBRZMSUvRGlj7zktJkyx6sHZs4R3Qt8pv3Qy+037oZeZclRAE6gpaVMzQMxmbPeEYreEYpKmZoGYzNnI7bqsH0RM5XIVo6pphCpHfPG10KgaN4E+51NfTbJW0W64WezktKclatfoBYaZ4Op/GHiNhe+ko1cajBooDwMoqR23XYKyRM5XIVo6ppJpMiPRGjCrUrJt73IxkYpeiCEISpmaBmMzZyT/VWD6IaESAVqClfWadzMqcselLCTq+S/49N3TLqrIg2ty2lXBJb44r4xzpzNrNVhANeG/wCOamnDczGitX2R9bUrW1tTX1MtTO1qHAz1cbZ5kAX0sMs8eFsrcbfzje17YaHXUhQerbw3t5eG/wCOamnDczGvjHOuwq+Ts6crOqqyQ67DrbVpX/eW+psaRHkahRJsneHi5ileTlMuQrSGquEu2bWzOx1SeMIl6M4kXw3/ABzRsaRHkahRLP8A6BdY2rHHjqaOFD6+nr6ds8Ne+tnYnTtjlw/m1+F7WvaO/wDWJqSyZ2vdmiibPjFLkyxV73ImxpEeRqFE70ktRy+67F9b2fGK3pJajl912Mu7DCGAG0xhvqXJUQBOoKXGDRQHgZRS1ysa+/cKb90MqSpmaBmMzZzdyra2WWBqTSZEeiNGFWpWTX3uSTOVyFaOqaZtl7RafmFjnbjQuHvF42ux0tK1tP16GpbO3po0X287Z4en0Y8Lx3+Riak0YeHuzShdlyWoSnZqLM7Gzfuhl5eG/wCOak0XdnvDShahDpcp6lzsnMFPeGEi/WadzMqdQiylYQdUaktkHOcbxvdvF7TlZZqrIDq3htb0+q7pZ0lmQDSVb1VkOFUcjlkPOcHUJs1ZEm1D+PQ3lY2te9aPDSx9eOeto6uGPu217WtnfDPPVy1NT3tS9LjenpmRdfJNvN1CbNWRJ1OoR0laSdUaktkFzK+SqdQfpC0g6o3G7Puc4ulvSWRAP2m/dDKkrpk+ZjLGk2TLFVlnIhSd4ALgKLJiSl6I0sfeklo00k8nUJKEjSIAnTKEmzhkpst5KNmEnogSSc1ICtWxxCxvWl68vV6Oc1tDhnWoz0NHSyvoX18ycLZVradsNPSypINoFrTh9fZkY9Fr1JiSl6I0sfeklreklqZYW2syv5lgjHCao5cl/wAncPoiZMserB2bP6yaLuz3hpQsI7oW0wcrFfs88IcMcJpECRg0UB4GUVaYxmhDhjhNIgSMxl2ueAllUXJUQBOoKWfp5aoZOGN7Xte9r6epnp5Wywy1fXle9E6GWeVs9PSxzwx431NTPVytfKPaWWAWrleZdyMKCkqI8jTFGouSogCdQUtKmZoGYzNnvCMVvCMVJpMiPRGjC+G/45qb90Mvs4m3SGZIV08J6QzGNt4kfiaks4soWDg0lW9VZDhVJY10Dk6SzjpCwcHykcjsh5Pjtq0r/vLZ34fzTbSRaeeGZX+WrXVKRtLLW1r3i9aClSTpY62hp6sU08rZZKXITTWK0QXUIs1ZEnUlZdJZDnVHJJi+sZU04bmY1Mu12NRuN2fc5xdLeksyQa+Mc6jkc6DznCadzMvtN+6GVRmUOz3gQpXiTa1ujVGYyiPRBElOUy5CtIaq45fddjbu5OEKA8MFFpkmWNPZsaGEMANpjDV4kYei6eo1GUR6IMopI0OetBlrKbpVinpvIw/R0rxtde8mjCMBGYWItdMlXu8lvSS+S10yU+9yKZMserB2bOZYW2syvS10yVe9YI00k8nUJKqauWSnptwkyZY9WDs2f1LkqIAnUFLqbJGbWyy4KZyuQrR1TQw0YAbUJJktrSrk+hpnK5CtHVNIzGXa54CWVNkrNrZZcE0IkArUFKjBooDwMoq0xjNCHDHCaRAkywttZleoQ5VqrM+e3hGKSpmaBmMzZyT/AFVg+iGhEgFagpUywttZlevDa/DrNSaLuz3hpQrlyserCFizZUnpM5XIVo6ppXhv+Oam/dDL7OoTZqyJOpLNrNWQwV5HI7IeT47atK/7ynKyzVWQHXYN6dMuqsiDa+Ts6jkkwfWMqa9zMqdQfpCwg7yhva661OZtZqtIC8k0Js1WDnU5WWaqyA6jkcsh5zhNe5mVOZtZqsIBrw0z9F3HklZ9JZjnV8k29HprbVpXbrlvjWo5HLIec4TTuZl9pNJna54cIKEaSAVplCsnTJr7NjYbnbay21SYkpeiNLHjd91WM63s+MVJ4wiXoziRVrpkq96wRppJ5OoSUWCMcJqjlzdMsVdN5GG522stt5QhMra2Z3OdOWaBmSsWSYkpeiNLH3pJaNNJPJ1CStnxilyZYq97kZNJna54cIL5BSd4ALgKLvSS1vSS0mTLHqwdmz+pclRAE6gpe8IxW8IxW8IxW8IxS5yraW1uRk0XdnvDShQgiTydMYWFJmamzLnZNF3Z7w0oWEd0La8SPxNUYk6JejBGKkgZJ6I4YaNcIrzfWxDhjhNIgTZclrZclrZclqSBknojhhtlyWjQiQCtQUow0YAbUJJXOFjT3+Sm/dDKjDRgBtQkmbOVjXpvI/aadzMq+Mc6+NcK+Mc6dQfpCwg6vDT9ceV41tK93dvkevkqk8J6QzGNtI43Z9ydfGOflJI3i+sFSZd0pYMDXydnXyVhSZn1VWMZTlj0pYQdUckeL6xfCa9zMqcrOqqyQ6jkcsh5zhNe5mVTLtljUbjdn3OcfjX7TfuhlUmJKXojSx96SWt6SWplhbazK9eGd7Wu48iwRjhNUcubplqrpvI1GZQ7PeBClTVyzU9MuFvSS1vSS1vSS1vSS1s+MVs+MU6cs0DMlYsSumT5mMsaLky1V73JTfuhlW9JLW9JLRppJ5OoSUldMnzMZY0kn+UsFdJGzCT0QJJP1m/dDKplhbazK/nMsLbWZXrw2vw6zUmi7s94aUKYaMANqEkrnKtp71wS5KiAJ1BS/IuSogCdQUuMxl2ueAllTZIza2WcimcrkK0dU0jBooDwMoqS8JVYPokZGKXoghCIR3Qtpg5WK/ZsdvCMVGYy7XPASyqm/dDKplhbazK9LUrJr71wjQiQCtQUr6zfuhlTlZ1VWSHXxrXxrUyx4xdjevDf8c+TmbWarCAa8N/xzTqE2asiTq+Ts6jkkwfWMqacNzMa+Sq+R621aV/3lfGtRyOWQ85wqEd0La8SPxN5yOR9BsHW2rSv+8rctpX/AEd45HOg85wdQizVkSd9pv3Qyreklreklreklo2TvDxcxSvDS9rXcefhv+OfKMBinvAxipHfanJ3SJkyx6sHZs4wGKe8DGKmyZaqst5KG522sttW9JLW9JLUbMJPRAkkwjuhbTJMsa+xY2ThCgPDBRd6SWo5fddjOtunLNAzJWLBI0iAJ0yhJs4ZqOm8lvSS/wDp/wD/xAA3EAAABQMDAgUDAwIFBQAAAAAAAQISEwMEEQUiMWOzEDJDk6MUIHMhJFGD4iNCU2BhMEFiseH/2gAIAQEACT8A/wBiXrKKGYKNB8oGoF7NIagXs0hqBezSGoF7NIXEscLNqUi9ZRQzBRoPlAvX0VyZKNBcIFxFLM/alQ1AvZpC9fRXJko0FwjwvWUUMwUaD5R9646yI2Hgj5WRDUfhpCo+suRysEXCzILjrIjYeCPlZENQ+GkNQL2aQ1AvZpDUC9mkNQL2aX3dHtJFRlFGHKwZ8njghqPxVRqnw1R0u6Q6Asn0Vx4ORBcIFkyih+TkQfKBcRSuZsUrLefKRi3ns6zI6ryRliWcLFxPeV2RoapGWKfysW8U0TN6VcOF6ysjDkRrMW8FpQfJVeS8PSzhAuJYpn7FJ5aOr3TGqfDVBldfSyTek2T8rRp5e9SFvBaUHyVXkvD0s4QLmWKV+xSeWi9jrIe5LFnysdLukOgL1lZGHIjWY1T4aouZYmv2qTh3HmIh0e0n7uj2kj+aXcLx6XdIdAaZLEzfK3lLvC8ggf6b3PFl9Sdr6z4nSf4o6vbPw1OKRuyF3CWitFKze13lU4Xs87/TY1g6vcMVopX72uw1JqF5POz02YZ4aZFKzfM7g3ePS7pDoDpdsvDoDo9pP3dHtJHS7pePS7pDoDo9pI1AvZpDUfhpCo+svDlYIuCwXAqMrIy1WCPGSwfIuJY4WbSSL1lFDMFGg+UC9fRXJko0FwgW8sTmb1Jw7nymLiC0oMjpMJeHpfysWTKyMtXIsxXillfsSryDUC9ml9nS7pDoDo9pPh0B0e0n7uj2kjVPhqjVPhqjVPhqi8fWWxqWLLhZGOgOj2ki3gtKD5KryXh6WcIFzLE1+1ScP48xEOj2kioyijDlYM+TxwQ/dfSyTek1/wCUXMF3QfLTYtbXrfygWbKKOVSIMdAXrKyMORGsxbwWlB8lV5Lw9LOEC5lia/YpOH8eYhesrIw5EazFmyijlUiDFvLFh+9KcO48ximysjDk5I8ZLJcDpd0hcxSws2qPLHDVPhqjVPhqjUD9qoKj6K42qwZcIIvu1KKRmyJ3CRrBewNY+AawXsDWC9gXk87PTZhg1KKRmyJ3CR0u4kWU87PUY1goxSs2OdhqSSP5pdwhZTzs9RjWCjFKzY52GpJI0yKVm+Z3BuHQHS7ZDpdxIs552eoxrBRilZsc7DUkkVo5Wb2u8qnC8nnZ6bMMGpxSt2Qu4SK0UrN7XeVThrHwDWC9ga0XsjV/g/vGtJ9n/oXEU0z9qVCo+suRysEXCzILjrIjYeCPlZELiWKFm1JeFJ9GpjKcmWcHnkhbRSyv3qPLW+F4+ivlMaCFtLFEzepPLhTZRRG1OTPlBH4dAWT6y+TkWQpPo1MZTkyzg88kNN+aoKbKKI2pyZ8oIxqBezSGofDSFR9ZcjlYIuFmXhcRSyu2JUNQL2aQvX0VyZKNBcIFxFLM/alQ1AvZpfdesrIw5EazFxPeV2RoapGWKfysW8UsLNyVCyfRXHg5EFwgap8NUXMsTX7VJw/jzEL1lZGHIjWY08vepChFLEzelXkF6ysjDkRrMU31lxtTki4WRi3ilczelWW8+Ux1e6Y63aULeWOZ+4kimysjDk5I8ZLJcDTy96kNP+akER1kSPLJHyszFkyih+TkQfKPC9ZWRhyI1mKjKKMOVgz5PHBC5lia/apOHceYvC3gtKD5KryXh6WcIH7r6WSb02yfkFNlZGHJyR4yWS4+7pdshRlifsczLkmkWUEDPUfl40yWJm+VvKXCtFK/e12GpNQxfle/0WQijFKzY52GpJPjqcUjdkLuEtFGWJmxzcvU0Ysfof6z5hZ/VfS+s+J0v+KNTlifsibylvhqUUjNkTuEijLEzY5uXqaNFT7w0VPvDTYpH75XcJFlPO/1GYYLz6X6n0WSsj2CtFKze13lU4Xk88fpswwaZLEzfK3lLhZFa/Veu+Vse8Xk87PTZhg6fbL7uj2k+HQFk+svk5FkKjKyMtVgjxksHyLiWJzNiU4dz5S+y9ZRQzBRoPlAuJ7Os+SkwkZYl/KBbxSNfvUrLePMZjo9pIvX0VyZKNBcI8L1lFDMFGg+UDpd0vHrdpQ64vGUUcJjQYXHWRGw8EfKyIah8NIW895XfItykZYpnCB1u0rw6PaT93R7SfG9ZWRhyI1mLeC0oPkqvJeHpZwgap8NUap8NUW8FpQfJVeS8PSzhA/dfSyTemyT8guYLug+Wmxa2vW/lAsiQRn5zqoF+laq7HZJuGC7QL8kStysv1w1RKGtmNQStNJ2FH/5qNQuEKUPIUxGfhUZRRI5WDPlBkP3R20k3ptk484uYLug+Wmxa2vW/lAvH1lsaliy4WRi3lia/elOHceYwiOsiR5ZI+VmYt4LSg+Sq8l4elnCB+6+lkm9Nsn5BTZWRhyckeMlkuPu6XbIUZYmbHNy5TRo3zijFKzY52GpJIsitfqfXfK2PeNY+AawXsDTIpWb5XcKcOgOl2yH+VBmFZM/A2JPgsfqYqEZJLJkf6eB4MhUaozST8OwZHnI1n4P7/DoDpdshrBewMX5Xv8ARZCNHL3xWilZhbXeVThi/K9/oshF4VqVz6DJWR7Pusn1l8nIshePor5TGgvG2gu6DIqj1ra9bOFi4ljiZsSjl3hZR1kMap6z5WOgLJ9ZfJyLIf6Z+GNyyzn+C5CyUXBmQomSMfos18qL+C/gfqR+H+oQvWUURtKNB8oGl/NVFvFK1+5Sst48xmLJ9ZfJyLIagXs0gRXX0rIfSbJ+Jo0v5qo1AvZpAiujtY4fSbJ+Jopsooy1OTPk88n916ysjDkRrMVGUUSOVgz5QZC5lia/apOH8eYh0e0kW8FpQfJVeS8PSzhAuZYpn7FJ5b4Xj6y2NSxZcLIxbyxNfvSjDuPMZC5gu6D5abFra9b+UCvKSEYUbVJBkX/rILBU0mYrrR/wRGbhTWkkknD+THCz8v8ABjn9R/qELJ9FcbTkQXCBp5e9SFvFNEzelXDh0e0nw6Asn0Vx4ORBcI8LmKWJmxSuHCo+iuNqsGXCCL7ul2yGpyxM2Qt5U0WU87PUY1gvStfqvRZKyPYK0UrN7XeVThrPwf3itLEze1mXJJQrRSv3tdhqTULyednpswwanFK3ZC7hLfGocqP0STf0Uk+c4IIUWFEaVETiz/JYBGsy5NWC/X+McgicX6Fj9UkX/ci8Kb4jJTctyNF+fx1KKRmyJ3CRqUsTNkTcvMWc87PUZhg0VPvDU5YmbIm+cxeQQM9N+XitLEze1uXJJX3dHtJFxPZ1nyUmEjLEv5QLaKWZ+5Ri8ZRRwmNBhcdZEbDwR8rIhqBezSFR9ZeHKwRcFguBZMrIy1cizFzFLM8mJV5Gio+suRysEXCzIW8SVoysnKV4GRGlLuP+SIU1Gkj3Gktv/wAMIKVRmZH+m0jCcKp/oZFkyafKv1BnlZq5/gsBDqVRZEpOTIWHyrC46yI2Hgj5WRDUPhpDUC9mkOl3S8aT6NTGU5Ms4PPJAvpTupJvVcz8ot57yu+RblIyxTOEfdZPorjwciC4QOt2lC5ilczYpWW8+UjFV9GpnCsGWcHjgxUZRRI5WDPlBkNS+GoKr6NTOFYMs4PHBiyZRQ/JyIPlHhesrIw5EazHKqZkQ5IHgyBERHykstDSP+ArcfOOAecERF/BEQLzryQ6XbIXr6y+CjWXhesrIw5EazFvBaUHyVXkvD0s4QNU+GqNU+GqLx9ZbGpYsuFkY6A6PaT92mSxM3yt5S4anLE/ZE3lLR1xpksT98rfOYrRSv3tdhqTULyed/8AkY1g0yWJ++VvnPws553+ozDBeFalc+gyVkewFkheFbqXx/KhrqRqKkU08qMhriRqKl01cGRDV0LBKOlbx5qGWHmsalFIzZE7hIoyxP2OblyTSLOCBnqPc8dLtkOl3CF5BAz03ueK0sTN7WZcklDWC9gXs87PTZhg6XbL7uj2ki9fRXJko0FwgdcWb6y3uU9ZcLMhbQXdBkVR61tetnCx+6O2jh9NsnPkFNlFEbU5M+UEfhbSxOZuUnDufKYpsooy1OTPk88n4dcWj6635ORZcLMhWmtKz5ENSjLEmvlAt4ppn7zUOTl7hi0ZVQxpyLPlZELiKRr9iVZbx5iMagXs0vC4ila/YleW8eYjFvPeV3yLcpGWKZwgdLukLiKVr9iVZbx5iFR9ZeHKwRcFguPC4illfsSryNFvPeV3yLcpGWKZwj7r1lZGHIjWfhbyxyv3pRy0XMF3QfLTYtbXrfygVGUUYcrBnyeOCH7r6WSb0mv/ACi5gu6D5abFra9b+UCyZRQ/JyIPlAt5Y5n7iSKbKyMOTkjxkslwKjKKJHKwZ8oMhqXw1BVfRqZwrBlnB44MdLukLmKWFm1R5Y4ap8NUW8FpQfJVeS8PSzhA/dfSyTem2T8gpsrIw5OSPGSyXA6XdIdAWT6K48HIguEC4nvK7I0NUjLFP5WNNP3EC5gu6D5abFra9b+UeHQHR7Sfu1OKRuyF3CWjTYpX75ncJcLOed/qMwwXpWv1XoMlbHsFaKVm9rvKpw/f/W/0WQijFKzY52GpJI0cvfFnBAz1HueOn2yGpyxM2RN85+H81e4Y02KVm+Z3CneGpxSv2RO4U0VopWb2u8qnC8nnZ6bMMHT7ZDTIpWb5XcKcOh4UZYn7HMy5JpGjfP8A2C8K1K59BkrI9g1pPsi8nnZ6bMMHS7ZfdesooZgo0HygVGVkZarBHjJYPkXEsTmbEpw7nykQ6vdMLjrIjYeCPlZECK6+ljh9Jsn4mjS/mqiyjrIY1T1nysXEUrX7Eqy3jzEKj6y8OVgi4LBcCk+jUxlOTLODzyQtopZX71HlrR1e6fhbSxQs3qTy4XEFpQZHSYS8PS/lYXHWRGw8EfKyIagXs0hUfWXhysEXBYLgaX81UW8UrX71Ky3jzGYvWUUMwUaD5R43jKKOExoMagXs0hqBezSFvPeV3yLcpGWKZwj7r1lZGHIjWY1T4ao1T4ao1T4ao1T4aouJY2v2KTh3HmIWT6K48HIguECm+svLU5IuCyfIt4pYWbiMWT6K48HIguEDrdpQ64vY6yHuSxZ8rFN9ZcbU5IuFkYP6X6qOH1XR/icKr6NTOFYMs4PHBjTy96kNPL3qQ08vepCm+suNqckXCyMaeXvUhTZWRhyckeMlkuBUZRRhysGfJ44IXMsTX7FIw7jzEQ6PaSKjKKMOVgz5PHBC4lilfsUnlv39LtkNYL2Brfwf3jWC9ganLEzZE3zmOh4Xv1X0vosidJ/hDSPn/sGip94anLE/ZE3lLReQQP8ATe541gvY8LyCCT035eK0sT97W5epw0cvfGifP/YKMUr8oc7yqaKMsTNjm5epos4IGeo9zx0+2QrRSswtrvKpwvJ54/TZhg6fbIdLuJF7BAz03ueNaT7P3dHtJC46yI2Hgj5WRDUPhpDUC9mkOl3SHQ8KT6NTGU5Ms4PPJC2illfvUeWt8L19FcmSjQXCBcRSzP2pUNQL2aQ1AvZpDUC9mkNQL2aQ0v5qo0v5qouILSgyOkwl4el/KxcT2dZ8lJhIyxL+UC3ila/epWW8eYzHR7SRqBezSGo/DSFR9ZeHKwRcFguBcT2dZ8lJhIyxL+UD9r9VJN6ro/yCo+suRysEXCzL7uj2kjpd0vHpd0h0BZPorjwciC4QKjKKMOVgz5PHBC5lia/YpOHceYiF6ysjDkRrPxvWVkYciNZiyZRQ/JyIPlAt5Y5n7kpFzBd0Hy02LW1638oFRlFEjlYM+UGQxdfSyTek2T8oRHWRI8skfKzMdbtKFzFK5mxSst58pGNU+GqLJlFD8nIg+UeHR7SR0u6Qt5Ymv3pTh3HmMU2VkYcnJHjJZLj7uj2kitFKzC2u8qnDWk+yNaT7I6XcIdDw0yKVm+V3CnDoDU4pW7In8JaNHL3xZwQM9R7njpdshoqfeGj/ADi9K1+q9BkrY9g1pPsi8nnj9NmGeHW7Sh1/Gznnf6jMMF6Vr9V6DJWx7BZlalc+u+Vke8Xk87PTZhg1KKRmyJ3Cfu6PaSNQL2aQ1AvZpDUC9mkLx9FfKY0EOh49DwpvorkcnJlwgzH7U7mSb1HR8ecW895XfItykZYpnCBTfRXI5OTLhBmLaKWV+9SstaOr3TGoF7NIah8NIVH1lyOVgi4WZDrdpQtpYnM3KTh/PlMU2UURtTkz5QRjUC9mkCK6+lZD6TZPxNFxBaUGR0mEvD0v5WLJlZGWrkWYrxSyv2JV5BqBezS/3P8A/8QAIhEAAgICAQQDAQAAAAAAAAAAAQIDBAARIRITMUEFMGAU/9oACAECAQE/AP1leuZiedAZaWrUUNLMRlX+O2D2pjx6yer2gGB2PuqyrFC7OeN58vOtm3oEkDxlWWaGde0CH34HvJyzVFLDTcEj7qaK8TqygjefI0oI5m6JCH89OUSsFgTOvA89XnJJ1sUxIoIBP3VbCxbDeDjyUpHDum2HsjCKBcsVJ361xk88ZjWOJdL+/wD/xAAiEQACAgIBBAMBAAAAAAAAAAACAwEEABEFEiEwMRNBYBT/2gAIAQMBAT8A/WXLkVoHtspyrbt2ymFJidZasXampaiNT95Uv/0F0EMROvNfrOs2FLUOy6ZziKZVqoCY6YU7LHLrMQ1VnXxzHufrKIgN4xWWwjep83ItYpyzWciWvcZxlu69KzNWw9de++cjTdaqGAe5mMrVDp3pSZRMjH15r1Qn9JBrcYtHIqWSwPQF7jeQzloQKYPQjPvffKtVwuJzi2X7/wD/2Q==",
      alt: ""
    })
  ], -1));
  const _sfc_main$1 = {
    __name: "Model",
    props: {
      title: {
        type: String,
        required: true
      },
      code: {
        type: Number || String
      }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const visible = vue.ref(false);
      const openModal = () => {
        visible.value = true;
      };
      const closeModal = () => {
        visible.value = false;
      };
      __expose({
        visible,
        openModal,
        closeModal
      });
      const codeValue = vue.ref();
      const enterCode = () => {
        if (codeValue.value == props.code) {
          localStorage.setItem("code", codeValue.value);
          visible.value = false;
          alert("验证成功，畅享复制粘贴吧！");
          codeValue.value = "";
        } else {
          alert("验证码错误，请重新输入！");
          codeValue.value = "";
        }
      };
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "modal-wrapper",
          onClick: vue.withModifiers(closeModal, ["self"])
        }, [
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("h2", null, vue.toDisplayString(__props.title), 1),
              vue.createElementVNode("button", { onClick: closeModal }, "X")
            ]),
            vue.createElementVNode("div", _hoisted_3, [
              vue.createElementVNode("div", _hoisted_4, [
                _hoisted_5,
                _hoisted_6,
                _hoisted_7,
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "ipt",
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => codeValue.value = $event),
                  onKeydown: vue.withKeys(enterCode, ["enter"]),
                  placeholder: "请输入验证码后按回车"
                }, null, 544), [
                  [vue.vModelText, codeValue.value]
                ])
              ]),
              _hoisted_8
            ])
          ])
        ], 512)), [
          [vue.vShow, visible.value]
        ]);
      };
    }
  };
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-1634adb5"]]);
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const getCode = () => {
    return new Promise(function(resolve, reject) {
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.softrr.cn/api/verification?id=1`,
        headers: {
          Referer: "https://api.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          resolve(JSON.parse(res.response).code);
        },
        onerror: function(error) {
          console.log(error);
        }
      });
    });
  };
  const _hoisted_1 = ["data-clipboard-text"];
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const selectedText = vue.ref("");
      const flag = vue.ref(false);
      const mouseX = vue.ref(0);
      const mouseY = vue.ref(0);
      document.body.oncopy = function() {
        e.stopPropagation();
        return true;
      };
      const allowCopy = function(e2) {
        e2.stopImmediatePropagation();
        return true;
      };
      document.addEventListener("copy", allowCopy, true);
      document.body.onselectstart = function(event) {
        event.stopPropagation();
        event.preventDefault = true;
      };
      document.onselectstart = function(event) {
        event.stopPropagation();
        event.preventDefault = true;
      };
      document.selection = function(event) {
        event.stopPropagation();
        event.preventDefault = true;
      };
      window.addEventListener("mouseup", (e2) => {
        if (window.getSelection().toString() !== "") {
          flag.value = true;
          mouseX.value = e2.clientX;
          mouseY.value = e2.clientY;
        } else {
          flag.value = false;
        }
      });
      if (document.querySelector(".con") !== null) {
        document.querySelector(".con").style.zindex = 0;
      }
      const code = vue.ref();
      const modelRef = vue.ref();
      const onCopyText = async () => {
        let locaCode = localStorage.getItem("code") || "";
        code.value = await getCode();
        if (locaCode == code.value) {
          document.oncopy = function(event) {
            event.preventDefault = true;
          };
          document.onselectstart = function(event) {
            event.preventDefault = true;
          };
          document.oncontextmenu = function(event) {
            event.preventDefault = true;
          };
          if (window.getSelection) {
            selectedText.value = window.getSelection().toString();
          } else if (document.selection && document.selection.type !== "Control") {
            selectedText.value = document.selection.createRange().text;
          }
          const clipboard2 = new Clipboard(".btn");
          clipboard2.on("success", (e2) => {
            console.log("复制成功:", e2.text);
            e2.clearSelection();
          });
          clipboard2.on("error", () => {
            alert("复制失败");
            clipboard2.destroy();
          });
          flag.value = false;
          window.getSelection().removeAllRanges();
        } else {
          modelRef.value.openModal();
          flag.value = true;
        }
      };
      const title = vue.ref("为了更好地服务大家，需要进行简单的验证。");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.withDirectives(vue.createElementVNode("div", {
            class: "copy",
            style: vue.normalizeStyle({
              position: "fixed",
              top: mouseY.value + "px",
              left: mouseX.value + 15 + "px"
            })
          }, [
            vue.createElementVNode("button", {
              onClick: onCopyText,
              class: "btn",
              "data-clipboard-text": selectedText.value
            }, "复制", 8, _hoisted_1)
          ], 4), [
            [vue.vShow, flag.value]
          ]),
          vue.createVNode(Model, {
            title: title.value,
            code: code.value,
            ref_key: "modelRef",
            ref: modelRef
          }, null, 8, ["title", "code"])
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-09e63593"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);