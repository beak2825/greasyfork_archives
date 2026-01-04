// ==UserScript==
// @name         OneDrive SharePoint  文件批量下载
// @namespace    npm/vite-plugin-monkey
// @version      1.0.2
// @author       Sep-L
// @description  OneDrive SharePoint 文件批量下载的 Tampermonkey 插件, 支持文件夹递归下载
// @license      Apache 2.0
// @match        https://*.sharepoint.com/*
// @match        https://*.sharepoint.cn/*
// @require      https://unpkg.com/vue@3.4.35/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3Bwindow.VueDemi%3DVue%3B
// @require      https://unpkg.com/element-plus@2.7.8/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://unpkg.com/element-plus@2.7.8/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/502807/OneDrive%20SharePoint%20%20%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/502807/OneDrive%20SharePoint%20%20%E6%96%87%E4%BB%B6%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
  const sizes = [
    " Bytes",
    " KB",
    " MB",
    " GB",
    " TB",
    " PB",
    " EB",
    " ZB",
    " YB"
  ];
  class Helper {
    /**
     * 字节可读化
     * @param size
     * @param digits
     */
    static getSize(size, digits = 2) {
      for (let i = 1; i < sizes.length; i++) {
        if (size < Math.pow(1024, i))
          return (size / Math.pow(1024, i - 1)).toFixed(digits) + sizes[i - 1];
      }
      return "infinite";
    }
    /**
     * 反复查找指定元素
     * @param selector 选择器
     * @param interval 检查间隔
     * @param maxRetry 最大尝试次数
     */
    static findElement(selector, interval = 500, maxRetry = 10) {
      let tryTime = 0;
      return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
          const element = document.querySelector(selector);
          if (element) {
            clearInterval(intervalId);
            resolve(element);
          } else {
            tryTime++;
            if (tryTime >= maxRetry) {
              clearInterval(intervalId);
              reject(new Error(`元素 "${selector}" 未找到`));
            }
          }
        }, interval);
      });
    }
  }
  class Logger {
    static get logName() {
      return this._logName;
    }
    static set logName(value) {
      this._logName = value;
    }
    static get prefix() {
      return [
        `%c[${(/* @__PURE__ */ new Date()).toLocaleString()}]%c[${this.logName}]%c:`,
        "font-weight: bold; color: #0920e6;",
        "font-weight: bold;",
        ""
      ];
    }
    static log(...data) {
      console.log(...this.prefix, ...data);
    }
    static info(...data) {
      console.info(...this.prefix, ...data);
    }
    static error(...data) {
      console.error(...this.prefix, ...data);
    }
    static warn(...data) {
      console.warn(...this.prefix, ...data);
    }
  }
  __publicField(Logger, "_logName", "");
  const parser = new DOMParser();
  function parseFileEl(fileElement) {
    if (!fileElement) {
      return;
    }
    const oneDriveFile = {
      href: "",
      displayName: "",
      contentLength: 0,
      status: "",
      filePath: "",
      isFolder: false
    };
    let folderEl = fileElement.getElementsByTagName("D:isFolder");
    if (folderEl.length > 0 && folderEl[0].textContent == "t") {
      oneDriveFile.isFolder = true;
    }
    let displayNameEl = fileElement.getElementsByTagName("D:displayname");
    oneDriveFile.displayName = displayNameEl[0].textContent;
    let hrefEl = fileElement.getElementsByTagName("D:href");
    oneDriveFile.href = encodeURI(hrefEl[0].textContent).replaceAll("%25", "%");
    oneDriveFile.filePath = decodeURI(new URL(oneDriveFile.href).pathname);
    let statusEl = fileElement.getElementsByTagName("D:status");
    oneDriveFile.status = statusEl[0].textContent;
    let contentLengthEl = fileElement.getElementsByTagName("D:getcontentlength");
    oneDriveFile.contentLength = Number.parseInt(contentLengthEl[0].textContent);
    return oneDriveFile;
  }
  async function parseUrl(url, basePath) {
    let res = await fetch(url, {
      method: "PROPFIND",
      credentials: "include"
    });
    const fileMap = {};
    const xmlRaw = await res.text();
    const xmlDoc = parser.parseFromString(xmlRaw, "text/xml");
    const fileElements = xmlDoc.getElementsByTagName("D:response");
    for (let fileElement of fileElements) {
      const oneDriveFile = parseFileEl(fileElement);
      if (!oneDriveFile || oneDriveFile.filePath == basePath + "/") {
        continue;
      }
      let parentPath = oneDriveFile.filePath;
      if (oneDriveFile.isFolder) {
        parentPath = parentPath.substring(0, parentPath.length - 1);
      }
      parentPath = parentPath.substring(0, parentPath.lastIndexOf("/") + 1);
      if (!(parentPath in fileMap)) {
        fileMap[parentPath] = [];
      }
      fileMap[parentPath].push(oneDriveFile);
    }
    return fileMap;
  }
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
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }
                function _createClass(Constructor, protoProps, staticProps) {
                  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
                  if (staticProps) _defineProperties(Constructor, staticProps);
                  return Constructor;
                }
                function _inherits(subClass, superClass) {
                  if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                  }
                  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
                  if (superClass) _setPrototypeOf(subClass, superClass);
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
                  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
                  if (Reflect.construct.sham) return false;
                  if (typeof Proxy === "function") return true;
                  try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], function() {
                    }));
                    return true;
                  } catch (e) {
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
                      this.listener = listen_default()(trigger, "click", function(e) {
                        return _this2.onClick(e);
                      });
                    }
                    /**
                     * Defines a new `ClipboardAction` on each click event.
                     * @param {Event} e
                     */
                  }, {
                    key: "onClick",
                    value: function onClick(e) {
                      var trigger = e.delegateTarget || e.currentTarget;
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
                  return function(e) {
                    e.delegateTarget = closest(e.target, selector);
                    if (e.delegateTarget) {
                      callback.call(element, e);
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
                    var e = this.e || (this.e = {});
                    (e[name] || (e[name] = [])).push({
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
                    var e = this.e || (this.e = {});
                    var evts = e[name];
                    var liveEvents = [];
                    if (evts && callback) {
                      for (var i = 0, len = evts.length; i < len; i++) {
                        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                          liveEvents.push(evts[i]);
                      }
                    }
                    liveEvents.length ? e[name] = liveEvents : delete e[name];
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
  const useClipboard = (opts) => {
    return {
      toClipboard(text, container) {
        return new Promise((resolve, reject) => {
          const fakeEl = document.createElement("button");
          const clipboard2 = new Clipboard(fakeEl, {
            text: () => text,
            action: () => "copy",
            container: container !== void 0 ? container : document.body
          });
          clipboard2.on("success", (e) => {
            clipboard2.destroy();
            resolve(e);
          });
          clipboard2.on("error", (e) => {
            clipboard2.destroy();
            reject(e);
          });
          document.body.appendChild(fakeEl);
          fakeEl.click();
          document.body.removeChild(fakeEl);
        });
      }
    };
  };
  const _hoisted_1 = { style: { "font-weight": "bolder" } };
  const _hoisted_2 = {
    class: "percentage-value",
    style: { "margin-right": "5px" }
  };
  const _hoisted_3 = { class: "percentage-label" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "OneDriveDraw",
    setup(__props) {
      const oneDrivePageInfo = vue.reactive({
        href: "",
        host: "",
        path: "",
        name: "",
        downloading: false,
        updating: false,
        fileTreeMap: {},
        tableData: []
      });
      const oneDriveDownloadInfo = vue.reactive({
        bytesDownloaded: 0,
        percent: 0,
        status: "",
        finishText: "",
        startDownload: false
      });
      async function download(dir, oneDriveFile) {
        if (oneDriveFile.isFolder) {
          dir = await dir.getDirectoryHandle(oneDriveFile.displayName, { create: true });
          for (const subFile of oneDrivePageInfo.fileTreeMap[oneDriveFile.filePath] || []) {
            await download(dir, subFile);
          }
          return;
        }
        const fileHandle = await dir.getFileHandle(oneDriveFile.displayName, { create: true });
        if ((await fileHandle.getFile()).size > 10) {
          Logger.info(`文件已存在 ${oneDriveFile.displayName}, 跳过下载`);
          return;
        }
        oneDriveDownloadInfo.status = "";
        oneDriveDownloadInfo.downloadFile = oneDriveFile;
        oneDriveDownloadInfo.bytesDownloaded = 0;
        const writable = await fileHandle.createWritable();
        const downloadLink = oneDriveFile.href;
        const response = await fetch(downloadLink);
        if (!response.ok || !response.body) {
          throw new Error("网络响应不正常");
        }
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          oneDriveDownloadInfo.bytesDownloaded += value.length;
          oneDriveDownloadInfo.percent = Number.parseFloat(
            (oneDriveDownloadInfo.bytesDownloaded / oneDriveFile.contentLength * 100).toFixed(2)
          );
          await writable.write(value);
        }
        oneDriveDownloadInfo.percent = 100;
        await writable.close();
        oneDriveDownloadInfo.status = "success";
      }
      const tableModel = vue.ref();
      async function downloadBatch(dataList) {
        let dir = await showDirectoryPicker({ mode: "readwrite" });
        dir = await dir.getDirectoryHandle(oneDrivePageInfo.name, { create: true });
        oneDrivePageInfo.downloading = true;
        oneDriveDownloadInfo.startDownload = true;
        try {
          for (const data of dataList) {
            Logger.info(`正在下载文件 ${data.name}`);
            await download(dir, data.file);
          }
          Logger.info(`批量下载任务完成`);
          ElementPlus.ElMessage.success({
            message: "下载成功"
          });
        } finally {
          oneDrivePageInfo.downloading = false;
        }
      }
      const update = async function() {
        if (oneDrivePageInfo.href == document.location.href) {
          return;
        }
        oneDrivePageInfo.updating = true;
        try {
          oneDrivePageInfo.href = document.location.href;
          const url = document.location;
          oneDrivePageInfo.host = url.host;
          const param = new URLSearchParams(url.search);
          const path = param.get("id");
          if (path) {
            oneDrivePageInfo.path = decodeURI(path);
            oneDrivePageInfo.name = decodeURI(oneDrivePageInfo.path).split("/").at(-1);
            Logger.info(`页面内容刷新 ${oneDrivePageInfo.path}`);
          }
          parseUrl(`https://${oneDrivePageInfo.host}/${oneDrivePageInfo.path}`, oneDrivePageInfo.path).then(
            (fileMap) => {
              oneDrivePageInfo.fileTreeMap = fileMap;
              oneDrivePageInfo.tableData = oneDrivePageInfo.fileTreeMap[oneDrivePageInfo.path + "/"].map((item) => {
                return {
                  id: item.filePath,
                  name: item.displayName,
                  hasChildren: item.isFolder,
                  file: item
                };
              }).sort((a, b) => a.name.localeCompare(b.name));
              Logger.log(oneDrivePageInfo.tableData);
            }
          ).catch((err) => {
            oneDrivePageInfo.fileTreeMap = {};
            oneDrivePageInfo.tableData = [];
            Logger.error("获取文件列表失败", err);
            ElementPlus.ElMessage.error({
              message: `获取文件列表失败: ${oneDrivePageInfo.path}`
            });
          }).finally(
            () => {
              oneDrivePageInfo.updating = false;
            }
          );
        } catch (err) {
          Logger.error("解析页面链接失败", err);
          ElementPlus.ElMessage.error({
            message: `解析页面链接失败: ${oneDrivePageInfo.path}`
          });
          oneDrivePageInfo.updating = false;
        }
      };
      const { toClipboard } = useClipboard();
      async function copyDownloadLink(dataList) {
        async function copy(oneDriveFile) {
          const linkArr = [];
          if (oneDriveFile.isFolder) {
            for (const subFile of oneDrivePageInfo.fileTreeMap[oneDriveFile.filePath] || []) {
              linkArr.push(...await copy(subFile));
            }
            return linkArr;
          }
          linkArr.push(oneDriveFile.href);
          return linkArr;
        }
        const copyLinkArr = [];
        for (const data of dataList) {
          copyLinkArr.push(...await copy(data.file));
        }
        toClipboard(copyLinkArr.join("\n")).then(() => {
          ElementPlus.ElMessage.success({
            message: `已复制 ${copyLinkArr.length} 个下载链接`
          });
        });
      }
      const drawer = vue.ref(false);
      vue.onMounted(() => {
        update();
        Helper.findElement('[data-automationid="breadcrumb-root-id"]').then((container) => {
          Logger.info("添加导航栏元素个数监听");
          const MutationObserver = window.MutationObserver;
          const mutationObserver = new MutationObserver((_) => {
            update();
          });
          mutationObserver.observe(container, { childList: true });
        }).catch((err) => {
          Logger.error("获取列表元素失败", err);
        });
        window.addEventListener("beforeunload", (event) => {
          if (oneDrivePageInfo.downloading) {
            if (!confirm("当前任务仍在下载中, 确定离开当前页面？")) {
              event.preventDefault();
            }
          }
        });
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_text = vue.resolveComponent("el-text");
        const _component_el_progress = vue.resolveComponent("el-progress");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_button_group = vue.resolveComponent("el-button-group");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_container = vue.resolveComponent("el-container");
        const _component_el_drawer = vue.resolveComponent("el-drawer");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_button, {
            onClick: _cache[0] || (_cache[0] = ($event) => drawer.value = true),
            type: "primary"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("打开下载列表")
            ]),
            _: 1
          }),
          vue.createVNode(_component_el_drawer, {
            modelValue: drawer.value,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => drawer.value = $event),
            style: { "height": "100vh", "min-width": "400px" }
          }, {
            header: vue.withCtx(() => [
              vue.createVNode(_component_el_row, { style: { "flex-grow": "1", "font-weight": "bolder", "font-size": "24px" } }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" OneDrive 文件批量下载 ")
                ]),
                _: 1
              })
            ]),
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_container, { style: { "display": "flex", "flex-direction": "column", "justify-content": "center" } }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_row, {
                    align: "middle",
                    gutter: 10
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_col, { span: -1 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            onClick: _cache[1] || (_cache[1] = ($event) => downloadBatch(tableModel.value.getSelectionRows())),
                            disabled: oneDrivePageInfo.downloading
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("批量下载 ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: -1 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            onClick: _cache[2] || (_cache[2] = ($event) => downloadBatch(oneDrivePageInfo.tableData)),
                            disabled: oneDrivePageInfo.downloading
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("全部下载 ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: -1 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            onClick: _cache[3] || (_cache[3] = ($event) => copyDownloadLink(tableModel.value.getSelectionRows())),
                            disabled: oneDrivePageInfo.downloading
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("复制选中链接 ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_col, { span: -1 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            onClick: _cache[4] || (_cache[4] = ($event) => copyDownloadLink(oneDrivePageInfo.tableData)),
                            disabled: oneDrivePageInfo.downloading
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("复制所有链接 ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_divider)
                    ]),
                    _: 1
                  }),
                  oneDriveDownloadInfo.startDownload ? (vue.openBlock(), vue.createBlock(_component_el_row, { key: 0 }, {
                    default: vue.withCtx(() => [
                      oneDrivePageInfo.downloading ? (vue.openBlock(), vue.createBlock(_component_el_row, { key: 0 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_col, { style: { "flex-grow": "1" } }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_text, { size: "large" }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode(" 正在下载 "),
                                  vue.createElementVNode("span", _hoisted_1, vue.toDisplayString(oneDrivePageInfo.name), 1),
                                  vue.createTextVNode(" 目录下的文件, 请不要切换页面 ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_col, { style: { "flex-grow": "1" } }, {
                            default: vue.withCtx(() => {
                              var _a, _b;
                              return [
                                vue.createTextVNode(" 当前下载文件名 " + vue.toDisplayString((_b = oneDriveDownloadInfo.downloadFile) == null ? void 0 : _b.filePath.substring(((_a = oneDriveDownloadInfo.downloadFile) == null ? void 0 : _a.filePath.indexOf(oneDrivePageInfo.path)) + oneDrivePageInfo.path.length)), 1)
                              ];
                            }),
                            _: 1
                          })
                        ]),
                        _: 1
                      })) : (vue.openBlock(), vue.createBlock(_component_el_row, { key: 1 }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_col, { style: { "flex-grow": "1" } }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_text, {
                                size: "large",
                                style: { "color": "#67C23A" }
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode(vue.toDisplayString(oneDrivePageInfo.name) + " 下载任务已完成 ", 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })),
                      vue.createVNode(_component_el_col, null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_progress, {
                            percentage: oneDriveDownloadInfo.percent,
                            status: oneDriveDownloadInfo.status,
                            "stroke-width": "16"
                          }, {
                            default: vue.withCtx(({ percentage }) => [
                              vue.createElementVNode("span", _hoisted_2, vue.toDisplayString(percentage.toFixed(2)) + "%", 1),
                              vue.createElementVNode("span", _hoisted_3, vue.toDisplayString(vue.unref(Helper).getSize(oneDriveDownloadInfo.bytesDownloaded)) + " / " + vue.toDisplayString(vue.unref(Helper).getSize(oneDriveDownloadInfo.downloadFile.contentLength)), 1)
                            ]),
                            _: 1
                          }, 8, ["percentage", "status"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_divider)
                    ]),
                    _: 1
                  })) : vue.createCommentVNode("", true),
                  vue.createVNode(_component_el_table, {
                    ref_key: "tableModel",
                    ref: tableModel,
                    data: oneDrivePageInfo.tableData,
                    style: { "width": "100%", "margin-bottom": "20px" },
                    "row-key": "id",
                    border: ""
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_table_column, {
                        type: "selection",
                        width: "55"
                      }),
                      vue.createVNode(_component_el_table_column, {
                        prop: "name",
                        label: "名称",
                        "show-overflow-tooltip": ""
                      }),
                      vue.createVNode(_component_el_table_column, {
                        label: "操作",
                        width: "180px"
                      }, {
                        default: vue.withCtx(({ row }) => [
                          vue.createVNode(_component_el_button_group, null, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_el_button, {
                                onClick: ($event) => downloadBatch([row])
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode("下载")
                                ]),
                                _: 2
                              }, 1032, ["onClick"]),
                              vue.createVNode(_component_el_button, {
                                onClick: ($event) => copyDownloadLink([row])
                              }, {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode("复制链接")
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["data"])
                ]),
                _: 1
              })), [
                [_directive_loading, oneDrivePageInfo.updating]
              ])
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      Logger.info("初始化 app vue");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1);
      };
    }
  });
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  Logger.logName = "OneDriveBatchScript";
  Helper.findElement('[data-automationid="commandbar-secondary"]').then(
    (element) => {
      Logger.info("创建页面元素");
      const divElement = element;
      vue.createApp(_sfc_main).use(ElementPlus).mount(
        (() => {
          const app = document.createElement("div");
          divElement.style.alignItems = "center";
          divElement.append(app);
          return app;
        })()
      );
    }
  );

})(Vue, ElementPlus);