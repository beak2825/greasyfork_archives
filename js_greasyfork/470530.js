// ==UserScript==
// @name         rrweb-plugin
// @name:zh      web录屏工具
// @namespace    dagger/rrweb-record
// @version      0.0.8
// @author       superhu
// @description  rrweb录屏插件
// @license      MIT
// @icon         https://rc-saas.fenqile.com/img/logo.483042e4.png
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/470530/rrweb-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/470530/rrweb-plugin.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(" .warp[data-v-dfa3bc59]{position:fixed;bottom:100px;right:20px;z-index:99999;box-shadow:0 3px 6px -4px #0000001f,0 6px 16px #00000014,0 9px 28px 8px #0000000d;transition:color .3s}.rr-button[data-v-dfa3bc59]{position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;background-image:none;border:1px solid transparent;cursor:pointer;transition:all .3s cubic-bezier(.645,.045,.355,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:manipulation;min-height:35px;padding:4px 15px;font-size:14px;border-radius:3px;color:#fff;background:#4f77e8;border-color:#4f77e8;text-shadow:0 -1px 0 rgb(0 0 0 / 12%);box-shadow:0 2px #0000000d} ");

(function (vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var require_main_001 = __commonJS({
    "main-3c29dfef.js"(exports, module) {
      function _typeof$1(o2) {
        "@babel/helpers - typeof";
        return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
          return typeof o3;
        } : function(o3) {
          return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
        }, _typeof$1(o2);
      }
      function _toPrimitive(input, hint) {
        if (_typeof$1(input) !== "object" || input === null)
          return input;
        var prim = input[Symbol.toPrimitive];
        if (prim !== void 0) {
          var res = prim.call(input, hint || "default");
          if (_typeof$1(res) !== "object")
            return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (hint === "string" ? String : Number)(input);
      }
      function _toPropertyKey(arg) {
        var key2 = _toPrimitive(arg, "string");
        return _typeof$1(key2) === "symbol" ? key2 : String(key2);
      }
      function _defineProperty$i(obj, key2, value) {
        key2 = _toPropertyKey(key2);
        if (key2 in obj) {
          Object.defineProperty(obj, key2, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      function ownKeys$1(e2, r2) {
        var t2 = Object.keys(e2);
        if (Object.getOwnPropertySymbols) {
          var o2 = Object.getOwnPropertySymbols(e2);
          r2 && (o2 = o2.filter(function(r3) {
            return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
          })), t2.push.apply(t2, o2);
        }
        return t2;
      }
      function _objectSpread2$1(e2) {
        for (var r2 = 1; r2 < arguments.length; r2++) {
          var t2 = null != arguments[r2] ? arguments[r2] : {};
          r2 % 2 ? ownKeys$1(Object(t2), true).forEach(function(r3) {
            _defineProperty$i(e2, r3, t2[r3]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1(Object(t2)).forEach(function(r3) {
            Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
          });
        }
        return e2;
      }
      function _extends() {
        _extends = Object.assign ? Object.assign.bind() : function(target) {
          for (var i2 = 1; i2 < arguments.length; i2++) {
            var source = arguments[i2];
            for (var key2 in source) {
              if (Object.prototype.hasOwnProperty.call(source, key2)) {
                target[key2] = source[key2];
              }
            }
          }
          return target;
        };
        return _extends.apply(this, arguments);
      }
      const isFunction$1 = (val) => typeof val === "function";
      const isArray$2 = Array.isArray;
      const isString = (val) => typeof val === "string";
      const isObject$2 = (val) => val !== null && typeof val === "object";
      const onRE = /^on[^a-z]/;
      const isOn = (key2) => onRE.test(key2);
      const cacheStringFunction = (fn) => {
        const cache = /* @__PURE__ */ Object.create(null);
        return (str) => {
          const hit = cache[str];
          return hit || (cache[str] = fn(str));
        };
      };
      const camelizeRE = /-(\w)/g;
      const camelize = cacheStringFunction((str) => {
        return str.replace(camelizeRE, (_2, c2) => c2 ? c2.toUpperCase() : "");
      });
      const hyphenateRE = /\B([A-Z])/g;
      const hyphenate = cacheStringFunction((str) => {
        return str.replace(hyphenateRE, "-$1").toLowerCase();
      });
      const hasOwnProperty$9 = Object.prototype.hasOwnProperty;
      const hasOwn = (val, key2) => hasOwnProperty$9.call(val, key2);
      function resolvePropValue(options, props, key2, value) {
        const opt = options[key2];
        if (opt != null) {
          const hasDefault = hasOwn(opt, "default");
          if (hasDefault && value === void 0) {
            const defaultValue = opt.default;
            value = opt.type !== Function && isFunction$1(defaultValue) ? defaultValue() : defaultValue;
          }
          if (opt.type === Boolean) {
            if (!hasOwn(props, key2) && !hasDefault) {
              value = false;
            } else if (value === "") {
              value = true;
            }
          }
        }
        return value;
      }
      function renderHelper(v2) {
        let props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let defaultV = arguments.length > 2 ? arguments[2] : void 0;
        if (typeof v2 === "function") {
          return v2(props);
        }
        return v2 !== null && v2 !== void 0 ? v2 : defaultV;
      }
      function wrapPromiseFn(openFn) {
        let closeFn;
        const closePromise = new Promise((resolve) => {
          closeFn = openFn(() => {
            resolve(true);
          });
        });
        const result = () => {
          closeFn === null || closeFn === void 0 ? void 0 : closeFn();
        };
        result.then = (filled, rejected) => closePromise.then(filled, rejected);
        result.promise = closePromise;
        return result;
      }
      function classNames() {
        const classes = [];
        for (let i2 = 0; i2 < arguments.length; i2++) {
          const value = i2 < 0 || arguments.length <= i2 ? void 0 : arguments[i2];
          if (!value)
            continue;
          if (isString(value)) {
            classes.push(value);
          } else if (isArray$2(value)) {
            for (let i3 = 0; i3 < value.length; i3++) {
              const inner = classNames(value[i3]);
              if (inner) {
                classes.push(inner);
              }
            }
          } else if (isObject$2(value)) {
            for (const name in value) {
              if (value[name]) {
                classes.push(name);
              }
            }
          }
        }
        return classes.join(" ");
      }
      var MapShim = function() {
        if (typeof Map !== "undefined") {
          return Map;
        }
        function getIndex(arr, key2) {
          var result = -1;
          arr.some(function(entry, index2) {
            if (entry[0] === key2) {
              result = index2;
              return true;
            }
            return false;
          });
          return result;
        }
        return (
          /** @class */
          function() {
            function class_1() {
              this.__entries__ = [];
            }
            Object.defineProperty(class_1.prototype, "size", {
              /**
               * @returns {boolean}
               */
              get: function() {
                return this.__entries__.length;
              },
              enumerable: true,
              configurable: true
            });
            class_1.prototype.get = function(key2) {
              var index2 = getIndex(this.__entries__, key2);
              var entry = this.__entries__[index2];
              return entry && entry[1];
            };
            class_1.prototype.set = function(key2, value) {
              var index2 = getIndex(this.__entries__, key2);
              if (~index2) {
                this.__entries__[index2][1] = value;
              } else {
                this.__entries__.push([key2, value]);
              }
            };
            class_1.prototype.delete = function(key2) {
              var entries = this.__entries__;
              var index2 = getIndex(entries, key2);
              if (~index2) {
                entries.splice(index2, 1);
              }
            };
            class_1.prototype.has = function(key2) {
              return !!~getIndex(this.__entries__, key2);
            };
            class_1.prototype.clear = function() {
              this.__entries__.splice(0);
            };
            class_1.prototype.forEach = function(callback, ctx) {
              if (ctx === void 0) {
                ctx = null;
              }
              for (var _i = 0, _a2 = this.__entries__; _i < _a2.length; _i++) {
                var entry = _a2[_i];
                callback.call(ctx, entry[1], entry[0]);
              }
            };
            return class_1;
          }()
        );
      }();
      var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
      var global$1 = function() {
        if (typeof global !== "undefined" && global.Math === Math) {
          return global;
        }
        if (typeof self !== "undefined" && self.Math === Math) {
          return self;
        }
        if (typeof window !== "undefined" && window.Math === Math) {
          return window;
        }
        return Function("return this")();
      }();
      var requestAnimationFrame$1 = function() {
        if (typeof requestAnimationFrame === "function") {
          return requestAnimationFrame.bind(global$1);
        }
        return function(callback) {
          return setTimeout(function() {
            return callback(Date.now());
          }, 1e3 / 60);
        };
      }();
      var trailingTimeout = 2;
      function throttle$1(callback, delay) {
        var leadingCall = false, trailingCall = false, lastCallTime = 0;
        function resolvePending() {
          if (leadingCall) {
            leadingCall = false;
            callback();
          }
          if (trailingCall) {
            proxy();
          }
        }
        function timeoutCallback() {
          requestAnimationFrame$1(resolvePending);
        }
        function proxy() {
          var timeStamp = Date.now();
          if (leadingCall) {
            if (timeStamp - lastCallTime < trailingTimeout) {
              return;
            }
            trailingCall = true;
          } else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
          }
          lastCallTime = timeStamp;
        }
        return proxy;
      }
      var REFRESH_DELAY = 20;
      var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
      var mutationObserverSupported = typeof MutationObserver !== "undefined";
      var ResizeObserverController = (
        /** @class */
        function() {
          function ResizeObserverController2() {
            this.connected_ = false;
            this.mutationEventsAdded_ = false;
            this.mutationsObserver_ = null;
            this.observers_ = [];
            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = throttle$1(this.refresh.bind(this), REFRESH_DELAY);
          }
          ResizeObserverController2.prototype.addObserver = function(observer) {
            if (!~this.observers_.indexOf(observer)) {
              this.observers_.push(observer);
            }
            if (!this.connected_) {
              this.connect_();
            }
          };
          ResizeObserverController2.prototype.removeObserver = function(observer) {
            var observers2 = this.observers_;
            var index2 = observers2.indexOf(observer);
            if (~index2) {
              observers2.splice(index2, 1);
            }
            if (!observers2.length && this.connected_) {
              this.disconnect_();
            }
          };
          ResizeObserverController2.prototype.refresh = function() {
            var changesDetected = this.updateObservers_();
            if (changesDetected) {
              this.refresh();
            }
          };
          ResizeObserverController2.prototype.updateObservers_ = function() {
            var activeObservers = this.observers_.filter(function(observer) {
              return observer.gatherActive(), observer.hasActive();
            });
            activeObservers.forEach(function(observer) {
              return observer.broadcastActive();
            });
            return activeObservers.length > 0;
          };
          ResizeObserverController2.prototype.connect_ = function() {
            if (!isBrowser || this.connected_) {
              return;
            }
            document.addEventListener("transitionend", this.onTransitionEnd_);
            window.addEventListener("resize", this.refresh);
            if (mutationObserverSupported) {
              this.mutationsObserver_ = new MutationObserver(this.refresh);
              this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
              });
            } else {
              document.addEventListener("DOMSubtreeModified", this.refresh);
              this.mutationEventsAdded_ = true;
            }
            this.connected_ = true;
          };
          ResizeObserverController2.prototype.disconnect_ = function() {
            if (!isBrowser || !this.connected_) {
              return;
            }
            document.removeEventListener("transitionend", this.onTransitionEnd_);
            window.removeEventListener("resize", this.refresh);
            if (this.mutationsObserver_) {
              this.mutationsObserver_.disconnect();
            }
            if (this.mutationEventsAdded_) {
              document.removeEventListener("DOMSubtreeModified", this.refresh);
            }
            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
          };
          ResizeObserverController2.prototype.onTransitionEnd_ = function(_a2) {
            var _b2 = _a2.propertyName, propertyName = _b2 === void 0 ? "" : _b2;
            var isReflowProperty = transitionKeys.some(function(key2) {
              return !!~propertyName.indexOf(key2);
            });
            if (isReflowProperty) {
              this.refresh();
            }
          };
          ResizeObserverController2.getInstance = function() {
            if (!this.instance_) {
              this.instance_ = new ResizeObserverController2();
            }
            return this.instance_;
          };
          ResizeObserverController2.instance_ = null;
          return ResizeObserverController2;
        }()
      );
      var defineConfigurable = function(target, props) {
        for (var _i = 0, _a2 = Object.keys(props); _i < _a2.length; _i++) {
          var key2 = _a2[_i];
          Object.defineProperty(target, key2, {
            value: props[key2],
            enumerable: false,
            writable: false,
            configurable: true
          });
        }
        return target;
      };
      var getWindowOf = function(target) {
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
        return ownerGlobal || global$1;
      };
      var emptyRect = createRectInit(0, 0, 0, 0);
      function toFloat(value) {
        return parseFloat(value) || 0;
      }
      function getBordersSize(styles) {
        var positions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          positions[_i - 1] = arguments[_i];
        }
        return positions.reduce(function(size, position2) {
          var value = styles["border-" + position2 + "-width"];
          return size + toFloat(value);
        }, 0);
      }
      function getPaddings(styles) {
        var positions = ["top", "right", "bottom", "left"];
        var paddings = {};
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
          var position2 = positions_1[_i];
          var value = styles["padding-" + position2];
          paddings[position2] = toFloat(value);
        }
        return paddings;
      }
      function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createRectInit(0, 0, bbox.width, bbox.height);
      }
      function getHTMLElementContentRect(target) {
        var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
        if (!clientWidth && !clientHeight) {
          return emptyRect;
        }
        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;
        var width = toFloat(styles.width), height = toFloat(styles.height);
        if (styles.boxSizing === "border-box") {
          if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, "left", "right") + horizPad;
          }
          if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, "top", "bottom") + vertPad;
          }
        }
        if (!isDocumentElement(target)) {
          var vertScrollbar = Math.round(width + horizPad) - clientWidth;
          var horizScrollbar = Math.round(height + vertPad) - clientHeight;
          if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
          }
          if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
          }
        }
        return createRectInit(paddings.left, paddings.top, width, height);
      }
      var isSVGGraphicsElement = function() {
        if (typeof SVGGraphicsElement !== "undefined") {
          return function(target) {
            return target instanceof getWindowOf(target).SVGGraphicsElement;
          };
        }
        return function(target) {
          return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
        };
      }();
      function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
      }
      function getContentRect(target) {
        if (!isBrowser) {
          return emptyRect;
        }
        if (isSVGGraphicsElement(target)) {
          return getSVGContentRect(target);
        }
        return getHTMLElementContentRect(target);
      }
      function createReadOnlyRect(_a2) {
        var x2 = _a2.x, y2 = _a2.y, width = _a2.width, height = _a2.height;
        var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);
        defineConfigurable(rect, {
          x: x2,
          y: y2,
          width,
          height,
          top: y2,
          right: x2 + width,
          bottom: height + y2,
          left: x2
        });
        return rect;
      }
      function createRectInit(x2, y2, width, height) {
        return { x: x2, y: y2, width, height };
      }
      var ResizeObservation = (
        /** @class */
        function() {
          function ResizeObservation2(target) {
            this.broadcastWidth = 0;
            this.broadcastHeight = 0;
            this.contentRect_ = createRectInit(0, 0, 0, 0);
            this.target = target;
          }
          ResizeObservation2.prototype.isActive = function() {
            var rect = getContentRect(this.target);
            this.contentRect_ = rect;
            return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
          };
          ResizeObservation2.prototype.broadcastRect = function() {
            var rect = this.contentRect_;
            this.broadcastWidth = rect.width;
            this.broadcastHeight = rect.height;
            return rect;
          };
          return ResizeObservation2;
        }()
      );
      var ResizeObserverEntry = (
        /** @class */
        function() {
          function ResizeObserverEntry2(target, rectInit) {
            var contentRect = createReadOnlyRect(rectInit);
            defineConfigurable(this, { target, contentRect });
          }
          return ResizeObserverEntry2;
        }()
      );
      var ResizeObserverSPI = (
        /** @class */
        function() {
          function ResizeObserverSPI2(callback, controller, callbackCtx) {
            this.activeObservations_ = [];
            this.observations_ = new MapShim();
            if (typeof callback !== "function") {
              throw new TypeError("The callback provided as parameter 1 is not a function.");
            }
            this.callback_ = callback;
            this.controller_ = controller;
            this.callbackCtx_ = callbackCtx;
          }
          ResizeObserverSPI2.prototype.observe = function(target) {
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            if (typeof Element === "undefined" || !(Element instanceof Object)) {
              return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            if (observations.has(target)) {
              return;
            }
            observations.set(target, new ResizeObservation(target));
            this.controller_.addObserver(this);
            this.controller_.refresh();
          };
          ResizeObserverSPI2.prototype.unobserve = function(target) {
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            if (typeof Element === "undefined" || !(Element instanceof Object)) {
              return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
              throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            if (!observations.has(target)) {
              return;
            }
            observations.delete(target);
            if (!observations.size) {
              this.controller_.removeObserver(this);
            }
          };
          ResizeObserverSPI2.prototype.disconnect = function() {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
          };
          ResizeObserverSPI2.prototype.gatherActive = function() {
            var _this = this;
            this.clearActive();
            this.observations_.forEach(function(observation) {
              if (observation.isActive()) {
                _this.activeObservations_.push(observation);
              }
            });
          };
          ResizeObserverSPI2.prototype.broadcastActive = function() {
            if (!this.hasActive()) {
              return;
            }
            var ctx = this.callbackCtx_;
            var entries = this.activeObservations_.map(function(observation) {
              return new ResizeObserverEntry(observation.target, observation.broadcastRect());
            });
            this.callback_.call(ctx, entries, ctx);
            this.clearActive();
          };
          ResizeObserverSPI2.prototype.clearActive = function() {
            this.activeObservations_.splice(0);
          };
          ResizeObserverSPI2.prototype.hasActive = function() {
            return this.activeObservations_.length > 0;
          };
          return ResizeObserverSPI2;
        }()
      );
      var observers = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : new MapShim();
      var ResizeObserver = (
        /** @class */
        function() {
          function ResizeObserver2(callback) {
            if (!(this instanceof ResizeObserver2)) {
              throw new TypeError("Cannot call a class as a function.");
            }
            if (!arguments.length) {
              throw new TypeError("1 argument required, but only 0 present.");
            }
            var controller = ResizeObserverController.getInstance();
            var observer = new ResizeObserverSPI(callback, controller, this);
            observers.set(this, observer);
          }
          return ResizeObserver2;
        }()
      );
      [
        "observe",
        "unobserve",
        "disconnect"
      ].forEach(function(method) {
        ResizeObserver.prototype[method] = function() {
          var _a2;
          return (_a2 = observers.get(this))[method].apply(_a2, arguments);
        };
      });
      var index = function() {
        if (typeof global$1.ResizeObserver !== "undefined") {
          return global$1.ResizeObserver;
        }
        return ResizeObserver;
      }();
      const isValid = (value) => {
        return value !== void 0 && value !== null && value !== "";
      };
      const isValid$1 = isValid;
      const initDefaultProps = (types, defaultProps) => {
        const propTypes = _extends({}, types);
        Object.keys(defaultProps).forEach((k2) => {
          const prop = propTypes[k2];
          if (prop) {
            if (prop.type || prop.default) {
              prop.default = defaultProps[k2];
            } else if (prop.def) {
              prop.def(defaultProps[k2]);
            } else {
              propTypes[k2] = {
                type: prop,
                default: defaultProps[k2]
              };
            }
          } else {
            throw new Error(`not have ${k2} prop`);
          }
        });
        return propTypes;
      };
      const initDefaultProps$1 = initDefaultProps;
      const splitAttrs = (attrs) => {
        const allAttrs = Object.keys(attrs);
        const eventAttrs = {};
        const onEvents = {};
        const extraAttrs = {};
        for (let i2 = 0, l2 = allAttrs.length; i2 < l2; i2++) {
          const key2 = allAttrs[i2];
          if (isOn(key2)) {
            eventAttrs[key2[2].toLowerCase() + key2.slice(3)] = attrs[key2];
            onEvents[key2] = attrs[key2];
          } else {
            extraAttrs[key2] = attrs[key2];
          }
        }
        return {
          onEvents,
          events: eventAttrs,
          extraAttrs
        };
      };
      const parseStyleText = function() {
        let cssText = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
        let camel = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        const res = {};
        const listDelimiter = /;(?![^(]*\))/g;
        const propertyDelimiter = /:(.+)/;
        if (typeof cssText === "object")
          return cssText;
        cssText.split(listDelimiter).forEach(function(item) {
          if (item) {
            const tmp = item.split(propertyDelimiter);
            if (tmp.length > 1) {
              const k2 = camel ? camelize(tmp[0].trim()) : tmp[0].trim();
              res[k2] = tmp[1].trim();
            }
          }
        });
        return res;
      };
      const hasProp = (instance, prop) => {
        return instance[prop] !== void 0;
      };
      const skipFlattenKey = Symbol("skipFlatten");
      const flattenChildren = function() {
        let children = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
        let filterEmpty2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        const temp = Array.isArray(children) ? children : [children];
        const res = [];
        temp.forEach((child) => {
          if (Array.isArray(child)) {
            res.push(...flattenChildren(child, filterEmpty2));
          } else if (child && child.type === vue.Fragment) {
            if (child.key === skipFlattenKey) {
              res.push(child);
            } else {
              res.push(...flattenChildren(child.children, filterEmpty2));
            }
          } else if (child && vue.isVNode(child)) {
            if (filterEmpty2 && !isEmptyElement(child)) {
              res.push(child);
            } else if (!filterEmpty2) {
              res.push(child);
            }
          } else if (isValid$1(child)) {
            res.push(child);
          }
        });
        return res;
      };
      const getSlot = function(self2) {
        let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "default";
        let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        if (vue.isVNode(self2)) {
          if (self2.type === vue.Fragment) {
            return name === "default" ? flattenChildren(self2.children) : [];
          } else if (self2.children && self2.children[name]) {
            return flattenChildren(self2.children[name](options));
          } else {
            return [];
          }
        } else {
          const res = self2.$slots[name] && self2.$slots[name](options);
          return flattenChildren(res);
        }
      };
      const findDOMNode = (instance) => {
        var _a2;
        let node2 = ((_a2 = instance === null || instance === void 0 ? void 0 : instance.vnode) === null || _a2 === void 0 ? void 0 : _a2.el) || instance && (instance.$el || instance);
        while (node2 && !node2.tagName) {
          node2 = node2.nextSibling;
        }
        return node2;
      };
      const getOptionProps = (instance) => {
        const res = {};
        if (instance.$ && instance.$.vnode) {
          const props = instance.$.vnode.props || {};
          Object.keys(instance.$props).forEach((k2) => {
            const v2 = instance.$props[k2];
            const hyphenateKey = hyphenate(k2);
            if (v2 !== void 0 || hyphenateKey in props) {
              res[k2] = v2;
            }
          });
        } else if (vue.isVNode(instance) && typeof instance.type === "object") {
          const originProps = instance.props || {};
          const props = {};
          Object.keys(originProps).forEach((key2) => {
            props[camelize(key2)] = originProps[key2];
          });
          const options = instance.type.props || {};
          Object.keys(options).forEach((k2) => {
            const v2 = resolvePropValue(options, props, k2, props[k2]);
            if (v2 !== void 0 || k2 in props) {
              res[k2] = v2;
            }
          });
        }
        return res;
      };
      const getComponent = function(instance) {
        let prop = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "default";
        let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : instance;
        let execute = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
        let com = void 0;
        if (instance.$) {
          const temp = instance[prop];
          if (temp !== void 0) {
            return typeof temp === "function" && execute ? temp(options) : temp;
          } else {
            com = instance.$slots[prop];
            com = execute && com ? com(options) : com;
          }
        } else if (vue.isVNode(instance)) {
          const temp = instance.props && instance.props[prop];
          if (temp !== void 0 && instance.props !== null) {
            return typeof temp === "function" && execute ? temp(options) : temp;
          } else if (instance.type === vue.Fragment) {
            com = instance.children;
          } else if (instance.children && instance.children[prop]) {
            com = instance.children[prop];
            com = execute && com ? com(options) : com;
          }
        }
        if (Array.isArray(com)) {
          com = flattenChildren(com);
          com = com.length === 1 ? com[0] : com;
          com = com.length === 0 ? void 0 : com;
        }
        return com;
      };
      function getEvents() {
        let ele = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        let on2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        let props = {};
        if (ele.$) {
          props = _extends(_extends({}, props), ele.$attrs);
        } else {
          props = _extends(_extends({}, props), ele.props);
        }
        return splitAttrs(props)[on2 ? "onEvents" : "events"];
      }
      function getStyle$1(ele, camel) {
        const props = (vue.isVNode(ele) ? ele.props : ele.$attrs) || {};
        let style = props.style || {};
        if (typeof style === "string") {
          style = parseStyleText(style, camel);
        } else if (camel && style) {
          const res = {};
          Object.keys(style).forEach((k2) => res[camelize(k2)] = style[k2]);
          return res;
        }
        return style;
      }
      function isFragment(c2) {
        return c2.length === 1 && c2[0].type === vue.Fragment;
      }
      function isEmptyElement(c2) {
        return c2 && (c2.type === vue.Comment || c2.type === vue.Fragment && c2.children.length === 0 || c2.type === vue.Text && c2.children.trim() === "");
      }
      function filterEmpty() {
        let children = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
        const res = [];
        children.forEach((child) => {
          if (Array.isArray(child)) {
            res.push(...child);
          } else if ((child === null || child === void 0 ? void 0 : child.type) === vue.Fragment) {
            res.push(...filterEmpty(child.children));
          } else {
            res.push(child);
          }
        });
        return res.filter((c2) => !isEmptyElement(c2));
      }
      function isValidElement(element) {
        if (Array.isArray(element) && element.length === 1) {
          element = element[0];
        }
        return element && element.__v_isVNode && typeof element.type !== "symbol";
      }
      function getPropsSlot(slots, props) {
        let prop = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "default";
        var _a2, _b2;
        return (_a2 = props[prop]) !== null && _a2 !== void 0 ? _a2 : (_b2 = slots[prop]) === null || _b2 === void 0 ? void 0 : _b2.call(slots);
      }
      let raf = (callback) => setTimeout(callback, 16);
      let caf = (num) => clearTimeout(num);
      if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
        raf = (callback) => window.requestAnimationFrame(callback);
        caf = (handle) => window.cancelAnimationFrame(handle);
      }
      let rafUUID = 0;
      const rafIds = /* @__PURE__ */ new Map();
      function cleanup(id) {
        rafIds.delete(id);
      }
      function wrapperRaf(callback) {
        let times = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        rafUUID += 1;
        const id = rafUUID;
        function callRef(leftTimes) {
          if (leftTimes === 0) {
            cleanup(id);
            callback();
          } else {
            const realId = raf(() => {
              callRef(leftTimes - 1);
            });
            rafIds.set(id, realId);
          }
        }
        callRef(times);
        return id;
      }
      wrapperRaf.cancel = (id) => {
        const realId = rafIds.get(id);
        cleanup(realId);
        return caf(realId);
      };
      function throttleByAnimationFrame(fn) {
        let requestId;
        const later = (args) => () => {
          requestId = null;
          fn(...args);
        };
        const throttled = function() {
          if (requestId == null) {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            requestId = wrapperRaf(later(args));
          }
        };
        throttled.cancel = () => {
          wrapperRaf.cancel(requestId);
          requestId = null;
        };
        return throttled;
      }
      const tuple = function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return args;
      };
      const withInstall = (comp) => {
        const c2 = comp;
        c2.install = function(app) {
          app.component(c2.displayName || c2.name, comp);
        };
        return comp;
      };
      function objectType(defaultVal) {
        return {
          type: Object,
          default: defaultVal
        };
      }
      function booleanType(defaultVal) {
        return {
          type: Boolean,
          default: defaultVal
        };
      }
      function functionType(defaultVal) {
        return {
          type: Function,
          default: defaultVal
        };
      }
      function anyType(defaultVal, required) {
        const type = {
          validator: () => true,
          default: defaultVal
        };
        return required ? type : type;
      }
      function arrayType(defaultVal) {
        return {
          type: Array,
          default: defaultVal
        };
      }
      function stringType(defaultVal) {
        return {
          type: String,
          default: defaultVal
        };
      }
      function someType(types, defaultVal) {
        return types ? {
          type: types,
          default: defaultVal
        } : anyType(defaultVal);
      }
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, "passive", {
          get() {
            supportsPassive = true;
          }
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);
      } catch (e2) {
      }
      const supportsPassive$1 = supportsPassive;
      function addEventListenerWrap(target, eventType, cb, option) {
        if (target && target.addEventListener) {
          let opt = option;
          if (opt === void 0 && supportsPassive$1 && (eventType === "touchstart" || eventType === "touchmove" || eventType === "wheel")) {
            opt = {
              passive: false
            };
          }
          target.addEventListener(eventType, cb, opt);
        }
        return {
          remove: () => {
            if (target && target.removeEventListener) {
              target.removeEventListener(eventType, cb);
            }
          }
        };
      }
      const defaultIconPrefixCls = "anticon";
      const GlobalFormContextKey = Symbol("GlobalFormContextKey");
      const useProvideGlobalForm = (state) => {
        vue.provide(GlobalFormContextKey, state);
      };
      const configProviderProps = () => ({
        iconPrefixCls: String,
        getTargetContainer: {
          type: Function
        },
        getPopupContainer: {
          type: Function
        },
        prefixCls: String,
        getPrefixCls: {
          type: Function
        },
        renderEmpty: {
          type: Function
        },
        transformCellText: {
          type: Function
        },
        csp: objectType(),
        input: objectType(),
        autoInsertSpaceInButton: {
          type: Boolean,
          default: void 0
        },
        locale: objectType(),
        pageHeader: objectType(),
        componentSize: {
          type: String
        },
        componentDisabled: {
          type: Boolean,
          default: void 0
        },
        direction: {
          type: String,
          default: "ltr"
        },
        space: objectType(),
        virtual: {
          type: Boolean,
          default: void 0
        },
        dropdownMatchSelectWidth: {
          type: [Number, Boolean],
          default: true
        },
        form: objectType(),
        pagination: objectType(),
        theme: objectType(),
        select: objectType()
      });
      const configProviderKey = Symbol("configProvider");
      const defaultConfigProvider = {
        getPrefixCls: (suffixCls, customizePrefixCls) => {
          if (customizePrefixCls)
            return customizePrefixCls;
          return suffixCls ? `ant-${suffixCls}` : "ant";
        },
        iconPrefixCls: vue.computed(() => defaultIconPrefixCls),
        getPopupContainer: vue.computed(() => () => document.body),
        direction: vue.computed(() => "ltr")
      };
      const useConfigContextInject = () => {
        return vue.inject(configProviderKey, defaultConfigProvider);
      };
      const useConfigContextProvider = (props) => {
        return vue.provide(configProviderKey, props);
      };
      const DisabledContextKey = Symbol("DisabledContextKey");
      const useInjectDisabled = () => {
        return vue.inject(DisabledContextKey, vue.ref(void 0));
      };
      const useProviderDisabled = (disabled) => {
        const parentDisabled = useInjectDisabled();
        vue.provide(DisabledContextKey, vue.computed(() => {
          var _a2;
          return (_a2 = disabled.value) !== null && _a2 !== void 0 ? _a2 : parentDisabled.value;
        }));
        return disabled;
      };
      const enUS$1 = {
        // Options.jsx
        items_per_page: "/ page",
        jump_to: "Go to",
        jump_to_confirm: "confirm",
        page: "",
        // Pagination.jsx
        prev_page: "Previous Page",
        next_page: "Next Page",
        prev_5: "Previous 5 Pages",
        next_5: "Next 5 Pages",
        prev_3: "Previous 3 Pages",
        next_3: "Next 3 Pages"
      };
      const locale$3 = {
        locale: "en_US",
        today: "Today",
        now: "Now",
        backToToday: "Back to today",
        ok: "Ok",
        clear: "Clear",
        month: "Month",
        year: "Year",
        timeSelect: "select time",
        dateSelect: "select date",
        weekSelect: "Choose a week",
        monthSelect: "Choose a month",
        yearSelect: "Choose a year",
        decadeSelect: "Choose a decade",
        yearFormat: "YYYY",
        dateFormat: "M/D/YYYY",
        dayFormat: "D",
        dateTimeFormat: "M/D/YYYY HH:mm:ss",
        monthBeforeYear: true,
        previousMonth: "Previous month (PageUp)",
        nextMonth: "Next month (PageDown)",
        previousYear: "Last year (Control + left)",
        nextYear: "Next year (Control + right)",
        previousDecade: "Last decade",
        nextDecade: "Next decade",
        previousCentury: "Last century",
        nextCentury: "Next century"
      };
      const CalendarLocale = locale$3;
      const locale$2 = {
        placeholder: "Select time",
        rangePlaceholder: ["Start time", "End time"]
      };
      const TimePicker = locale$2;
      const locale$1 = {
        lang: _extends({
          placeholder: "Select date",
          yearPlaceholder: "Select year",
          quarterPlaceholder: "Select quarter",
          monthPlaceholder: "Select month",
          weekPlaceholder: "Select week",
          rangePlaceholder: ["Start date", "End date"],
          rangeYearPlaceholder: ["Start year", "End year"],
          rangeQuarterPlaceholder: ["Start quarter", "End quarter"],
          rangeMonthPlaceholder: ["Start month", "End month"],
          rangeWeekPlaceholder: ["Start week", "End week"]
        }, CalendarLocale),
        timePickerLocale: _extends({}, TimePicker)
      };
      const enUS = locale$1;
      const typeTemplate = "${label} is not a valid ${type}";
      const localeValues = {
        locale: "en",
        Pagination: enUS$1,
        DatePicker: enUS,
        TimePicker,
        Calendar: enUS,
        global: {
          placeholder: "Please select"
        },
        Table: {
          filterTitle: "Filter menu",
          filterConfirm: "OK",
          filterReset: "Reset",
          filterEmptyText: "No filters",
          filterCheckall: "Select all items",
          filterSearchPlaceholder: "Search in filters",
          emptyText: "No data",
          selectAll: "Select current page",
          selectInvert: "Invert current page",
          selectNone: "Clear all data",
          selectionAll: "Select all data",
          sortTitle: "Sort",
          expand: "Expand row",
          collapse: "Collapse row",
          triggerDesc: "Click to sort descending",
          triggerAsc: "Click to sort ascending",
          cancelSort: "Click to cancel sorting"
        },
        Tour: {
          Next: "Next",
          Previous: "Previous",
          Finish: "Finish"
        },
        Modal: {
          okText: "OK",
          cancelText: "Cancel",
          justOkText: "OK"
        },
        Popconfirm: {
          okText: "OK",
          cancelText: "Cancel"
        },
        Transfer: {
          titles: ["", ""],
          searchPlaceholder: "Search here",
          itemUnit: "item",
          itemsUnit: "items",
          remove: "Remove",
          selectCurrent: "Select current page",
          removeCurrent: "Remove current page",
          selectAll: "Select all data",
          removeAll: "Remove all data",
          selectInvert: "Invert current page"
        },
        Upload: {
          uploading: "Uploading...",
          removeFile: "Remove file",
          uploadError: "Upload error",
          previewFile: "Preview file",
          downloadFile: "Download file"
        },
        Empty: {
          description: "No data"
        },
        Icon: {
          icon: "icon"
        },
        Text: {
          edit: "Edit",
          copy: "Copy",
          copied: "Copied",
          expand: "Expand"
        },
        PageHeader: {
          back: "Back"
        },
        Form: {
          optional: "(optional)",
          defaultValidateMessages: {
            default: "Field validation error for ${label}",
            required: "Please enter ${label}",
            enum: "${label} must be one of [${enum}]",
            whitespace: "${label} cannot be a blank character",
            date: {
              format: "${label} date format is invalid",
              parse: "${label} cannot be converted to a date",
              invalid: "${label} is an invalid date"
            },
            types: {
              string: typeTemplate,
              method: typeTemplate,
              array: typeTemplate,
              object: typeTemplate,
              number: typeTemplate,
              date: typeTemplate,
              boolean: typeTemplate,
              integer: typeTemplate,
              float: typeTemplate,
              regexp: typeTemplate,
              email: typeTemplate,
              url: typeTemplate,
              hex: typeTemplate
            },
            string: {
              len: "${label} must be ${len} characters",
              min: "${label} must be at least ${min} characters",
              max: "${label} must be up to ${max} characters",
              range: "${label} must be between ${min}-${max} characters"
            },
            number: {
              len: "${label} must be equal to ${len}",
              min: "${label} must be minimum ${min}",
              max: "${label} must be maximum ${max}",
              range: "${label} must be between ${min}-${max}"
            },
            array: {
              len: "Must be ${len} ${label}",
              min: "At least ${min} ${label}",
              max: "At most ${max} ${label}",
              range: "The amount of ${label} must be between ${min}-${max}"
            },
            pattern: {
              mismatch: "${label} does not match the pattern ${pattern}"
            }
          }
        },
        Image: {
          preview: "Preview"
        },
        QRCode: {
          expired: "QR code expired",
          refresh: "Refresh"
        }
      };
      const defaultLocale = localeValues;
      const LocaleReceiver = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "LocaleReceiver",
        props: {
          componentName: String,
          defaultLocale: {
            type: [Object, Function]
          },
          children: {
            type: Function
          }
        },
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          const localeData = vue.inject("localeData", {});
          const locale2 = vue.computed(() => {
            const {
              componentName = "global",
              defaultLocale: defaultLocale$1
            } = props;
            const locale3 = defaultLocale$1 || defaultLocale[componentName || "global"];
            const {
              antLocale
            } = localeData;
            const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};
            return _extends(_extends({}, typeof locale3 === "function" ? locale3() : locale3), localeFromContext || {});
          });
          const localeCode = vue.computed(() => {
            const {
              antLocale
            } = localeData;
            const localeCode2 = antLocale && antLocale.locale;
            if (antLocale && antLocale.exist && !localeCode2) {
              return defaultLocale.locale;
            }
            return localeCode2;
          });
          return () => {
            const children = props.children || slots.default;
            const {
              antLocale
            } = localeData;
            return children === null || children === void 0 ? void 0 : children(locale2.value, localeCode.value, antLocale);
          };
        }
      });
      function murmur2(str) {
        var h2 = 0;
        var k2, i2 = 0, len = str.length;
        for (; len >= 4; ++i2, len -= 4) {
          k2 = str.charCodeAt(i2) & 255 | (str.charCodeAt(++i2) & 255) << 8 | (str.charCodeAt(++i2) & 255) << 16 | (str.charCodeAt(++i2) & 255) << 24;
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
            h2 ^= (str.charCodeAt(i2 + 2) & 255) << 16;
          case 2:
            h2 ^= (str.charCodeAt(i2 + 1) & 255) << 8;
          case 1:
            h2 ^= str.charCodeAt(i2) & 255;
            h2 = /* Math.imul(h, m): */
            (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
        }
        h2 ^= h2 >>> 13;
        h2 = /* Math.imul(h, m): */
        (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
        return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
      }
      const SPLIT = "%";
      class Entity {
        constructor(instanceId) {
          this.cache = /* @__PURE__ */ new Map();
          this.instanceId = instanceId;
        }
        get(keys2) {
          return this.cache.get(Array.isArray(keys2) ? keys2.join(SPLIT) : keys2) || null;
        }
        update(keys2, valueFn) {
          const path = Array.isArray(keys2) ? keys2.join(SPLIT) : keys2;
          const prevValue = this.cache.get(path);
          const nextValue = valueFn(prevValue);
          if (nextValue === null) {
            this.cache.delete(path);
          } else {
            this.cache.set(path, nextValue);
          }
        }
      }
      const CacheEntity = Entity;
      const ATTR_TOKEN = "data-token-hash";
      const ATTR_MARK = "data-css-hash";
      const CSS_IN_JS_INSTANCE = "__cssinjs_instance__";
      function createCache() {
        const cssinjsInstanceId = Math.random().toString(12).slice(2);
        if (typeof document !== "undefined" && document.head && document.body) {
          const styles = document.body.querySelectorAll(`style[${ATTR_MARK}]`) || [];
          const {
            firstChild
          } = document.head;
          Array.from(styles).forEach((style) => {
            style[CSS_IN_JS_INSTANCE] = style[CSS_IN_JS_INSTANCE] || cssinjsInstanceId;
            if (style[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
              document.head.insertBefore(style, firstChild);
            }
          });
          const styleHash = {};
          Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`)).forEach((style) => {
            var _a2;
            const hash = style.getAttribute(ATTR_MARK);
            if (styleHash[hash]) {
              if (style[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
                (_a2 = style.parentNode) === null || _a2 === void 0 ? void 0 : _a2.removeChild(style);
              }
            } else {
              styleHash[hash] = true;
            }
          });
        }
        return new CacheEntity(cssinjsInstanceId);
      }
      const StyleContextKey = Symbol("StyleContextKey");
      const getCache = () => {
        var _a2, _b2, _c;
        const instance = vue.getCurrentInstance();
        let cache;
        if (instance && instance.appContext) {
          const globalCache = (_c = (_b2 = (_a2 = instance.appContext) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.globalProperties) === null || _c === void 0 ? void 0 : _c.__ANTDV_CSSINJS_CACHE__;
          if (globalCache) {
            cache = globalCache;
          } else {
            cache = createCache();
            if (instance.appContext.config.globalProperties) {
              instance.appContext.config.globalProperties.__ANTDV_CSSINJS_CACHE__ = cache;
            }
          }
        } else {
          cache = createCache();
        }
        return cache;
      };
      const defaultStyleContext = {
        cache: createCache(),
        defaultCache: true,
        hashPriority: "low"
      };
      const useStyleInject = () => {
        const cache = getCache();
        return vue.inject(StyleContextKey, vue.shallowRef(_extends(_extends({}, defaultStyleContext), {
          cache
        })));
      };
      const useStyleProvider = (props) => {
        const parentContext = useStyleInject();
        const context = vue.shallowRef(_extends(_extends({}, defaultStyleContext), {
          cache: createCache()
        }));
        vue.watch([() => vue.unref(props), parentContext], () => {
          const mergedContext = _extends({}, parentContext.value);
          const propsValue = vue.unref(props);
          Object.keys(propsValue).forEach((key2) => {
            const value = propsValue[key2];
            if (propsValue[key2] !== void 0) {
              mergedContext[key2] = value;
            }
          });
          const {
            cache
          } = propsValue;
          mergedContext.cache = mergedContext.cache || createCache();
          mergedContext.defaultCache = !cache && parentContext.value.defaultCache;
          context.value = mergedContext;
        }, {
          immediate: true
        });
        vue.provide(StyleContextKey, context);
        return context;
      };
      const styleProviderProps = () => ({
        autoClear: booleanType(),
        /** @private Test only. Not work in production. */
        mock: stringType(),
        /**
         * Only set when you need ssr to extract style on you own.
         * If not provided, it will auto create <style /> on the end of Provider in server side.
         */
        cache: objectType(),
        /** Tell children that this context is default generated context */
        defaultCache: booleanType(),
        /** Use `:where` selector to reduce hashId css selector priority */
        hashPriority: stringType(),
        /** Tell cssinjs where to inject style in */
        container: someType(),
        /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
        ssrInline: booleanType(),
        /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
        transformers: arrayType(),
        /**
         * Linters to lint css before inject in document.
         * Styles will be linted after transforming.
         * Please note that `linters` do not support dynamic update.
         */
        linters: arrayType()
      });
      withInstall(vue.defineComponent({
        name: "AStyleProvider",
        inheritAttrs: false,
        props: styleProviderProps(),
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          useStyleProvider(props);
          return () => {
            var _a2;
            return (_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots);
          };
        }
      }));
      function useClientCache(prefix, keyPath, cacheFn, onCacheRemove) {
        const styleContext = useStyleInject();
        const fullPathStr = vue.shallowRef("");
        const res = vue.shallowRef();
        vue.watchEffect(() => {
          fullPathStr.value = [prefix, ...keyPath.value].join("%");
        });
        const clearCache = (pathStr) => {
          styleContext.value.cache.update(pathStr, (prevCache) => {
            const [times = 0, cache] = prevCache || [];
            const nextCount = times - 1;
            if (nextCount === 0) {
              onCacheRemove === null || onCacheRemove === void 0 ? void 0 : onCacheRemove(cache, false);
              return null;
            }
            return [times - 1, cache];
          });
        };
        vue.watch(fullPathStr, (newStr, oldStr) => {
          if (oldStr)
            clearCache(oldStr);
          styleContext.value.cache.update(newStr, (prevCache) => {
            const [times = 0, cache] = prevCache || [];
            let tmpCache = cache;
            const mergedCache = tmpCache || cacheFn();
            return [times + 1, mergedCache];
          });
          res.value = styleContext.value.cache.get(fullPathStr.value)[1];
        }, {
          immediate: true
        });
        vue.onBeforeUnmount(() => {
          clearCache(fullPathStr.value);
        });
        return res;
      }
      function canUseDom$1() {
        return !!(typeof window !== "undefined" && window.document && window.document.createElement);
      }
      function contains$1(root2, n2) {
        if (!root2) {
          return false;
        }
        if (root2.contains) {
          return root2.contains(n2);
        }
        return false;
      }
      const APPEND_ORDER$1 = "data-vc-order";
      const MARK_KEY$1 = `vc-util-key`;
      const containerCache$1 = /* @__PURE__ */ new Map();
      function getMark$1() {
        let {
          mark
        } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (mark) {
          return mark.startsWith("data-") ? mark : `data-${mark}`;
        }
        return MARK_KEY$1;
      }
      function getContainer$2(option) {
        if (option.attachTo) {
          return option.attachTo;
        }
        const head = document.querySelector("head");
        return head || document.body;
      }
      function getOrder$1(prepend) {
        if (prepend === "queue") {
          return "prependQueue";
        }
        return prepend ? "prepend" : "append";
      }
      function findStyles$1(container) {
        return Array.from((containerCache$1.get(container) || container).children).filter((node2) => node2.tagName === "STYLE");
      }
      function injectCSS$1(css2) {
        let option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (!canUseDom$1()) {
          return null;
        }
        const {
          csp,
          prepend
        } = option;
        const styleNode = document.createElement("style");
        styleNode.setAttribute(APPEND_ORDER$1, getOrder$1(prepend));
        if (csp === null || csp === void 0 ? void 0 : csp.nonce) {
          styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
        }
        styleNode.innerHTML = css2;
        const container = getContainer$2(option);
        const {
          firstChild
        } = container;
        if (prepend) {
          if (prepend === "queue") {
            const existStyle = findStyles$1(container).filter((node2) => ["prepend", "prependQueue"].includes(node2.getAttribute(APPEND_ORDER$1)));
            if (existStyle.length) {
              container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
              return styleNode;
            }
          }
          container.insertBefore(styleNode, firstChild);
        } else {
          container.appendChild(styleNode);
        }
        return styleNode;
      }
      function findExistNode$1(key2) {
        let option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const container = getContainer$2(option);
        return findStyles$1(container).find((node2) => node2.getAttribute(getMark$1(option)) === key2);
      }
      function removeCSS(key2) {
        let option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const existNode = findExistNode$1(key2, option);
        if (existNode) {
          const container = getContainer$2(option);
          container.removeChild(existNode);
        }
      }
      function syncRealContainer$1(container, option) {
        const cachedRealContainer = containerCache$1.get(container);
        if (!cachedRealContainer || !contains$1(document, cachedRealContainer)) {
          const placeholderStyle = injectCSS$1("", option);
          const {
            parentNode
          } = placeholderStyle;
          containerCache$1.set(container, parentNode);
          container.removeChild(placeholderStyle);
        }
      }
      function updateCSS$1(css2, key2) {
        let option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var _a2, _b2, _c;
        const container = getContainer$2(option);
        syncRealContainer$1(container, option);
        const existNode = findExistNode$1(key2, option);
        if (existNode) {
          if (((_a2 = option.csp) === null || _a2 === void 0 ? void 0 : _a2.nonce) && existNode.nonce !== ((_b2 = option.csp) === null || _b2 === void 0 ? void 0 : _b2.nonce)) {
            existNode.nonce = (_c = option.csp) === null || _c === void 0 ? void 0 : _c.nonce;
          }
          if (existNode.innerHTML !== css2) {
            existNode.innerHTML = css2;
          }
          return existNode;
        }
        const newNode = injectCSS$1(css2, option);
        newNode.setAttribute(getMark$1(option), key2);
        return newNode;
      }
      function sameDerivativeOption(left, right) {
        if (left.length !== right.length) {
          return false;
        }
        for (let i2 = 0; i2 < left.length; i2++) {
          if (left[i2] !== right[i2]) {
            return false;
          }
        }
        return true;
      }
      class ThemeCache {
        constructor() {
          this.cache = /* @__PURE__ */ new Map();
          this.keys = [];
          this.cacheCallTimes = 0;
        }
        size() {
          return this.keys.length;
        }
        internalGet(derivativeOption) {
          let updateCallTimes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
          let cache = {
            map: this.cache
          };
          derivativeOption.forEach((derivative2) => {
            var _a2;
            if (!cache) {
              cache = void 0;
            } else {
              cache = (_a2 = cache === null || cache === void 0 ? void 0 : cache.map) === null || _a2 === void 0 ? void 0 : _a2.get(derivative2);
            }
          });
          if ((cache === null || cache === void 0 ? void 0 : cache.value) && updateCallTimes) {
            cache.value[1] = this.cacheCallTimes++;
          }
          return cache === null || cache === void 0 ? void 0 : cache.value;
        }
        get(derivativeOption) {
          var _a2;
          return (_a2 = this.internalGet(derivativeOption, true)) === null || _a2 === void 0 ? void 0 : _a2[0];
        }
        has(derivativeOption) {
          return !!this.internalGet(derivativeOption);
        }
        set(derivativeOption, value) {
          if (!this.has(derivativeOption)) {
            if (this.size() + 1 > ThemeCache.MAX_CACHE_SIZE + ThemeCache.MAX_CACHE_OFFSET) {
              const [targetKey] = this.keys.reduce((result, key2) => {
                const [, callTimes] = result;
                if (this.internalGet(key2)[1] < callTimes) {
                  return [key2, this.internalGet(key2)[1]];
                }
                return result;
              }, [this.keys[0], this.cacheCallTimes]);
              this.delete(targetKey);
            }
            this.keys.push(derivativeOption);
          }
          let cache = this.cache;
          derivativeOption.forEach((derivative2, index2) => {
            if (index2 === derivativeOption.length - 1) {
              cache.set(derivative2, {
                value: [value, this.cacheCallTimes++]
              });
            } else {
              const cacheValue = cache.get(derivative2);
              if (!cacheValue) {
                cache.set(derivative2, {
                  map: /* @__PURE__ */ new Map()
                });
              } else if (!cacheValue.map) {
                cacheValue.map = /* @__PURE__ */ new Map();
              }
              cache = cache.get(derivative2).map;
            }
          });
        }
        deleteByPath(currentCache, derivatives) {
          var _a2;
          const cache = currentCache.get(derivatives[0]);
          if (derivatives.length === 1) {
            if (!cache.map) {
              currentCache.delete(derivatives[0]);
            } else {
              currentCache.set(derivatives[0], {
                map: cache.map
              });
            }
            return (_a2 = cache.value) === null || _a2 === void 0 ? void 0 : _a2[0];
          }
          const result = this.deleteByPath(cache.map, derivatives.slice(1));
          if ((!cache.map || cache.map.size === 0) && !cache.value) {
            currentCache.delete(derivatives[0]);
          }
          return result;
        }
        delete(derivativeOption) {
          if (this.has(derivativeOption)) {
            this.keys = this.keys.filter((item) => !sameDerivativeOption(item, derivativeOption));
            return this.deleteByPath(this.cache, derivativeOption);
          }
          return void 0;
        }
      }
      ThemeCache.MAX_CACHE_SIZE = 20;
      ThemeCache.MAX_CACHE_OFFSET = 5;
      function noop$3() {
      }
      let warning$1 = noop$3;
      const warning$2 = warning$1;
      let uuid$1 = 0;
      class Theme {
        constructor(derivatives) {
          this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
          this.id = uuid$1;
          if (derivatives.length === 0) {
            warning$2(derivatives.length > 0);
          }
          uuid$1 += 1;
        }
        getDerivativeToken(token2) {
          return this.derivatives.reduce((result, derivative2) => derivative2(token2, result), void 0);
        }
      }
      const cacheThemes = new ThemeCache();
      function createTheme(derivatives) {
        const derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
        if (!cacheThemes.has(derivativeArr)) {
          cacheThemes.set(derivativeArr, new Theme(derivativeArr));
        }
        return cacheThemes.get(derivativeArr);
      }
      const flattenTokenCache = /* @__PURE__ */ new WeakMap();
      function flattenToken(token2) {
        let str = flattenTokenCache.get(token2) || "";
        if (!str) {
          Object.keys(token2).forEach((key2) => {
            const value = token2[key2];
            str += key2;
            if (value instanceof Theme) {
              str += value.id;
            } else if (value && typeof value === "object") {
              str += flattenToken(value);
            } else {
              str += value;
            }
          });
          flattenTokenCache.set(token2, str);
        }
        return str;
      }
      function token2key(token2, salt) {
        return murmur2(`${salt}_${flattenToken(token2)}`);
      }
      const randomSelectorKey = `random-${Date.now()}-${Math.random()}`.replace(/\./g, "");
      const checkContent = "_bAmBoO_";
      function supportSelector(styleStr, handleElement, supportCheck) {
        var _a2, _b2;
        if (canUseDom$1()) {
          updateCSS$1(styleStr, randomSelectorKey);
          const ele = document.createElement("div");
          ele.style.position = "fixed";
          ele.style.left = "0";
          ele.style.top = "0";
          handleElement === null || handleElement === void 0 ? void 0 : handleElement(ele);
          document.body.appendChild(ele);
          const support = supportCheck ? supportCheck(ele) : (_a2 = getComputedStyle(ele).content) === null || _a2 === void 0 ? void 0 : _a2.includes(checkContent);
          (_b2 = ele.parentNode) === null || _b2 === void 0 ? void 0 : _b2.removeChild(ele);
          removeCSS(randomSelectorKey);
          return support;
        }
        return false;
      }
      let canLayer = void 0;
      function supportLayer() {
        if (canLayer === void 0) {
          canLayer = supportSelector(`@layer ${randomSelectorKey} { .${randomSelectorKey} { content: "${checkContent}"!important; } }`, (ele) => {
            ele.className = randomSelectorKey;
          });
        }
        return canLayer;
      }
      const EMPTY_OVERRIDE = {};
      const hashPrefix = "css";
      const tokenKeys = /* @__PURE__ */ new Map();
      function recordCleanToken(tokenKey) {
        tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
      }
      function removeStyleTags(key2, instanceId) {
        if (typeof document !== "undefined") {
          const styles = document.querySelectorAll(`style[${ATTR_TOKEN}="${key2}"]`);
          styles.forEach((style) => {
            var _a2;
            if (style[CSS_IN_JS_INSTANCE] === instanceId) {
              (_a2 = style.parentNode) === null || _a2 === void 0 ? void 0 : _a2.removeChild(style);
            }
          });
        }
      }
      const TOKEN_THRESHOLD = 0;
      function cleanTokenStyle(tokenKey, instanceId) {
        tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
        const tokenKeyList = Array.from(tokenKeys.keys());
        const cleanableKeyList = tokenKeyList.filter((key2) => {
          const count = tokenKeys.get(key2) || 0;
          return count <= 0;
        });
        if (tokenKeyList.length - cleanableKeyList.length > TOKEN_THRESHOLD) {
          cleanableKeyList.forEach((key2) => {
            removeStyleTags(key2, instanceId);
            tokenKeys.delete(key2);
          });
        }
      }
      const getComputedToken = (originToken, overrideToken, theme, format) => {
        const derivativeToken = theme.getDerivativeToken(originToken);
        let mergedDerivativeToken = _extends(_extends({}, derivativeToken), overrideToken);
        if (format) {
          mergedDerivativeToken = format(mergedDerivativeToken);
        }
        return mergedDerivativeToken;
      };
      function useCacheToken(theme, tokens) {
        let option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : vue.ref({});
        const style = useStyleInject();
        const mergedToken = vue.computed(() => _extends({}, ...tokens.value));
        const tokenStr = vue.computed(() => flattenToken(mergedToken.value));
        const overrideTokenStr = vue.computed(() => flattenToken(option.value.override || EMPTY_OVERRIDE));
        const cachedToken = useClientCache("token", vue.computed(() => [option.value.salt || "", theme.value.id, tokenStr.value, overrideTokenStr.value]), () => {
          const {
            salt = "",
            override = EMPTY_OVERRIDE,
            formatToken: formatToken2,
            getComputedToken: compute
          } = option.value;
          const mergedDerivativeToken = compute ? compute(mergedToken.value, override, theme.value) : getComputedToken(mergedToken.value, override, theme.value, formatToken2);
          const tokenKey = token2key(mergedDerivativeToken, salt);
          mergedDerivativeToken._tokenKey = tokenKey;
          recordCleanToken(tokenKey);
          const hashId = `${hashPrefix}-${murmur2(tokenKey)}`;
          mergedDerivativeToken._hashId = hashId;
          return [mergedDerivativeToken, hashId];
        }, (cache) => {
          var _a2;
          cleanTokenStyle(cache[0]._tokenKey, (_a2 = style.value) === null || _a2 === void 0 ? void 0 : _a2.cache.instanceId);
        });
        return cachedToken;
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
      var COMMENT = "comm";
      var RULESET = "rule";
      var DECLARATION = "decl";
      var IMPORT = "@import";
      var KEYFRAMES = "@keyframes";
      var LAYER = "@layer";
      var abs = Math.abs;
      var from = String.fromCharCode;
      function trim(value) {
        return value.trim();
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
      var line = 1;
      var column = 1;
      var length = 0;
      var position = 0;
      var character = 0;
      var characters = "";
      function node(value, root2, parent, type, props, children, length2, siblings) {
        return { value, root: root2, parent, type, props, children, line, column, length: length2, return: "", siblings };
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
      function escaping(index2, count) {
        while (--count && next())
          if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
            break;
        return slice(index2, caret() + (count < 6 && peek() == 32 && next() == 32));
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
      function commenter(type, index2) {
        while (next())
          if (type + character === 47 + 10)
            break;
          else if (type + character === 42 + 42 && peek() === 47)
            break;
        return "/*" + slice(index2, position - 1) + "*" + from(type === 47 ? type : next());
      }
      function identifier(index2) {
        while (!token(peek()))
          next();
        return slice(index2, position);
      }
      function compile(value) {
        return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
      }
      function parse(value, root2, parent, rule, rules, rulesets, pseudo, points, declarations) {
        var index2 = 0;
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
                  append(comment(commenter(next(), caret()), root2, parent, declarations), declarations);
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
                case 59 + offset:
                  if (ampersand == -1)
                    characters2 = replace(characters2, /\f/g, "");
                  if (property > 0 && strlen(characters2) - length2)
                    append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1, declarations) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2, declarations), declarations);
                  break;
                case 59:
                  characters2 += ";";
                default:
                  append(reference = ruleset(characters2, root2, parent, index2, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
                  if (character2 === 123)
                    if (offset === 0)
                      parse(characters2, root2, reference, reference, props, rulesets, length2, points, children);
                    else
                      switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                        case 100:
                        case 108:
                        case 109:
                        case 115:
                          parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2, children), children), rules, children, length2, points, rule ? props : children);
                          break;
                        default:
                          parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                      }
              }
              index2 = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
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
                  points[index2++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
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
      function ruleset(value, root2, parent, index2, offset, rules, points, type, props, children, length2, siblings) {
        var post = offset - 1;
        var rule = offset === 0 ? rules : [""];
        var size = sizeof(rule);
        for (var i2 = 0, j2 = 0, k2 = 0; i2 < index2; ++i2)
          for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j2 = points[i2])), z2 = value; x2 < size; ++x2)
            if (z2 = trim(j2 > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
              props[k2++] = z2;
        return node(value, root2, parent, offset === 0 ? RULESET : type, props, children, length2, siblings);
      }
      function comment(value, root2, parent, siblings) {
        return node(value, root2, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
      }
      function declaration(value, root2, parent, length2, siblings) {
        return node(value, root2, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2, siblings);
      }
      function serialize(children, callback) {
        var output = "";
        for (var i2 = 0; i2 < children.length; i2++)
          output += callback(children[i2], i2, children, callback) || "";
        return output;
      }
      function stringify$1(element, index2, children, callback) {
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
            if (!strlen(element.value = element.props.join(",")))
              return "";
        }
        return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
      }
      const ATTR_CACHE_MAP = "data-ant-cssinjs-cache-path";
      const CSS_FILE_STYLE = "_FILE_STYLE__";
      let cachePathMap;
      let fromCSSFile = true;
      function prepare() {
        var _a2;
        if (!cachePathMap) {
          cachePathMap = {};
          if (canUseDom$1()) {
            const div = document.createElement("div");
            div.className = ATTR_CACHE_MAP;
            div.style.position = "fixed";
            div.style.visibility = "hidden";
            div.style.top = "-9999px";
            document.body.appendChild(div);
            let content = getComputedStyle(div).content || "";
            content = content.replace(/^"/, "").replace(/"$/, "");
            content.split(";").forEach((item) => {
              const [path, hash] = item.split(":");
              cachePathMap[path] = hash;
            });
            const inlineMapStyle = document.querySelector(`style[${ATTR_CACHE_MAP}]`);
            if (inlineMapStyle) {
              fromCSSFile = false;
              (_a2 = inlineMapStyle.parentNode) === null || _a2 === void 0 ? void 0 : _a2.removeChild(inlineMapStyle);
            }
            document.body.removeChild(div);
          }
        }
      }
      function existPath(path) {
        prepare();
        return !!cachePathMap[path];
      }
      function getStyleAndHash(path) {
        const hash = cachePathMap[path];
        let styleStr = null;
        if (hash && canUseDom$1()) {
          if (fromCSSFile) {
            styleStr = CSS_FILE_STYLE;
          } else {
            const style = document.querySelector(`style[${ATTR_MARK}="${cachePathMap[path]}"]`);
            if (style) {
              styleStr = style.innerHTML;
            } else {
              delete cachePathMap[path];
            }
          }
        }
        return [styleStr, hash];
      }
      const isClientSide = canUseDom$1();
      const SKIP_CHECK = "_skip_check_";
      const MULTI_VALUE = "_multi_value_";
      function normalizeStyle(styleStr) {
        const serialized = serialize(compile(styleStr), stringify$1);
        return serialized.replace(/\{%%%\:[^;];}/g, ";");
      }
      function isCompoundCSSProperty(value) {
        return typeof value === "object" && value && (SKIP_CHECK in value || MULTI_VALUE in value);
      }
      function injectSelectorHash(key2, hashId, hashPriority) {
        if (!hashId) {
          return key2;
        }
        const hashClassName = `.${hashId}`;
        const hashSelector = hashPriority === "low" ? `:where(${hashClassName})` : hashClassName;
        const keys2 = key2.split(",").map((k2) => {
          var _a2;
          const fullPath = k2.trim().split(/\s+/);
          let firstPath = fullPath[0] || "";
          const htmlElement = ((_a2 = firstPath.match(/^\w+/)) === null || _a2 === void 0 ? void 0 : _a2[0]) || "";
          firstPath = `${htmlElement}${hashSelector}${firstPath.slice(htmlElement.length)}`;
          return [firstPath, ...fullPath.slice(1)].join(" ");
        });
        return keys2.join(",");
      }
      const globalEffectStyleKeys = /* @__PURE__ */ new Set();
      const parseStyle = function(interpolation) {
        let config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let {
          root: root2,
          injectHash,
          parentSelectors
        } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
          root: true,
          parentSelectors: []
        };
        const {
          hashId,
          layer,
          path,
          hashPriority,
          transformers = [],
          linters = []
        } = config;
        let styleStr = "";
        let effectStyle = {};
        function parseKeyframes(keyframes) {
          const animationName = keyframes.getName(hashId);
          if (!effectStyle[animationName]) {
            const [parsedStr] = parseStyle(keyframes.style, config, {
              root: false,
              parentSelectors
            });
            effectStyle[animationName] = `@keyframes ${keyframes.getName(hashId)}${parsedStr}`;
          }
        }
        function flattenList(list) {
          let fullList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
          list.forEach((item) => {
            if (Array.isArray(item)) {
              flattenList(item, fullList);
            } else if (item) {
              fullList.push(item);
            }
          });
          return fullList;
        }
        const flattenStyleList = flattenList(Array.isArray(interpolation) ? interpolation : [interpolation]);
        flattenStyleList.forEach((originStyle) => {
          const style = typeof originStyle === "string" && !root2 ? {} : originStyle;
          if (typeof style === "string") {
            styleStr += `${style}
`;
          } else if (style._keyframe) {
            parseKeyframes(style);
          } else {
            const mergedStyle = transformers.reduce((prev2, trans) => {
              var _a2;
              return ((_a2 = trans === null || trans === void 0 ? void 0 : trans.visit) === null || _a2 === void 0 ? void 0 : _a2.call(trans, prev2)) || prev2;
            }, style);
            Object.keys(mergedStyle).forEach((key2) => {
              var _a2;
              const value = mergedStyle[key2];
              if (typeof value === "object" && value && (key2 !== "animationName" || !value._keyframe) && !isCompoundCSSProperty(value)) {
                let subInjectHash = false;
                let mergedKey = key2.trim();
                let nextRoot = false;
                if ((root2 || injectHash) && hashId) {
                  if (mergedKey.startsWith("@")) {
                    subInjectHash = true;
                  } else {
                    mergedKey = injectSelectorHash(key2, hashId, hashPriority);
                  }
                } else if (root2 && !hashId && (mergedKey === "&" || mergedKey === "")) {
                  mergedKey = "";
                  nextRoot = true;
                }
                const [parsedStr, childEffectStyle] = parseStyle(value, config, {
                  root: nextRoot,
                  injectHash: subInjectHash,
                  parentSelectors: [...parentSelectors, mergedKey]
                });
                effectStyle = _extends(_extends({}, effectStyle), childEffectStyle);
                styleStr += `${mergedKey}${parsedStr}`;
              } else {
                let appendStyle = function(cssKey, cssValue) {
                  const styleName = cssKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                  let formatValue = cssValue;
                  if (!unitlessKeys[cssKey] && typeof formatValue === "number" && formatValue !== 0) {
                    formatValue = `${formatValue}px`;
                  }
                  if (cssKey === "animationName" && (cssValue === null || cssValue === void 0 ? void 0 : cssValue._keyframe)) {
                    parseKeyframes(cssValue);
                    formatValue = cssValue.getName(hashId);
                  }
                  styleStr += `${styleName}:${formatValue};`;
                };
                const actualValue = (_a2 = value === null || value === void 0 ? void 0 : value.value) !== null && _a2 !== void 0 ? _a2 : value;
                if (typeof value === "object" && (value === null || value === void 0 ? void 0 : value[MULTI_VALUE]) && Array.isArray(actualValue)) {
                  actualValue.forEach((item) => {
                    appendStyle(key2, item);
                  });
                } else {
                  appendStyle(key2, actualValue);
                }
              }
            });
          }
        });
        if (!root2) {
          styleStr = `{${styleStr}}`;
        } else if (layer && supportLayer()) {
          const layerCells = layer.split(",");
          const layerName = layerCells[layerCells.length - 1].trim();
          styleStr = `@layer ${layerName} {${styleStr}}`;
          if (layerCells.length > 1) {
            styleStr = `@layer ${layer}{%%%:%}${styleStr}`;
          }
        }
        return [styleStr, effectStyle];
      };
      function uniqueHash(path, styleStr) {
        return murmur2(`${path.join("%")}${styleStr}`);
      }
      function useStyleRegister(info, styleFn) {
        const styleContext = useStyleInject();
        const tokenKey = vue.computed(() => info.value.token._tokenKey);
        const fullPath = vue.computed(() => [tokenKey.value, ...info.value.path]);
        let isMergedClientSide = isClientSide;
        useClientCache(
          "style",
          fullPath,
          // Create cache if needed
          () => {
            const {
              path,
              hashId,
              layer,
              nonce,
              clientOnly,
              order = 0
            } = info.value;
            const cachePath = fullPath.value.join("|");
            if (existPath(cachePath)) {
              const [inlineCacheStyleStr, styleHash] = getStyleAndHash(cachePath);
              if (inlineCacheStyleStr) {
                return [inlineCacheStyleStr, tokenKey.value, styleHash, {}, clientOnly, order];
              }
            }
            const styleObj = styleFn();
            const {
              hashPriority,
              container,
              transformers,
              linters,
              cache
            } = styleContext.value;
            const [parsedStyle, effectStyle] = parseStyle(styleObj, {
              hashId,
              hashPriority,
              layer,
              path: path.join("-"),
              transformers,
              linters
            });
            const styleStr = normalizeStyle(parsedStyle);
            const styleId = uniqueHash(fullPath.value, styleStr);
            if (isMergedClientSide) {
              const mergedCSSConfig = {
                mark: ATTR_MARK,
                prepend: "queue",
                attachTo: container,
                priority: order
              };
              const nonceStr = typeof nonce === "function" ? nonce() : nonce;
              if (nonceStr) {
                mergedCSSConfig.csp = {
                  nonce: nonceStr
                };
              }
              const style = updateCSS$1(styleStr, styleId, mergedCSSConfig);
              style[CSS_IN_JS_INSTANCE] = cache.instanceId;
              style.setAttribute(ATTR_TOKEN, tokenKey.value);
              Object.keys(effectStyle).forEach((effectKey) => {
                if (!globalEffectStyleKeys.has(effectKey)) {
                  globalEffectStyleKeys.add(effectKey);
                  updateCSS$1(normalizeStyle(effectStyle[effectKey]), `_effect-${effectKey}`, {
                    mark: ATTR_MARK,
                    prepend: "queue",
                    attachTo: container
                  });
                }
              });
            }
            return [styleStr, tokenKey.value, styleId, effectStyle, clientOnly, order];
          },
          // Remove cache if no need
          (_ref, fromHMR) => {
            let [, , styleId] = _ref;
            if ((fromHMR || styleContext.value.autoClear) && isClientSide) {
              removeCSS(styleId, {
                mark: ATTR_MARK
              });
            }
          }
        );
        return (node2) => {
          return node2;
        };
      }
      class Keyframe {
        constructor(name, style) {
          this._keyframe = true;
          this.name = name;
          this.style = style;
        }
        getName() {
          let hashId = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          return hashId ? `${hashId}-${this.name}` : this.name;
        }
      }
      const Keyframes = Keyframe;
      const version = "4.0.6";
      const PresetColors = ["blue", "purple", "cyan", "green", "magenta", "pink", "red", "orange", "yellow", "volcano", "geekblue", "lime", "gold"];
      function bound01(n2, max) {
        if (isOnePointZero(n2)) {
          n2 = "100%";
        }
        var isPercent = isPercentage(n2);
        n2 = max === 360 ? n2 : Math.min(max, Math.max(0, parseFloat(n2)));
        if (isPercent) {
          n2 = parseInt(String(n2 * max), 10) / 100;
        }
        if (Math.abs(n2 - max) < 1e-6) {
          return 1;
        }
        if (max === 360) {
          n2 = (n2 < 0 ? n2 % max + max : n2 % max) / parseFloat(String(max));
        } else {
          n2 = n2 % max / parseFloat(String(max));
        }
        return n2;
      }
      function clamp01(val) {
        return Math.min(1, Math.max(0, val));
      }
      function isOnePointZero(n2) {
        return typeof n2 === "string" && n2.indexOf(".") !== -1 && parseFloat(n2) === 1;
      }
      function isPercentage(n2) {
        return typeof n2 === "string" && n2.indexOf("%") !== -1;
      }
      function boundAlpha(a2) {
        a2 = parseFloat(a2);
        if (isNaN(a2) || a2 < 0 || a2 > 1) {
          a2 = 1;
        }
        return a2;
      }
      function convertToPercentage(n2) {
        if (n2 <= 1) {
          return "".concat(Number(n2) * 100, "%");
        }
        return n2;
      }
      function pad2(c2) {
        return c2.length === 1 ? "0" + c2 : String(c2);
      }
      function rgbToRgb(r2, g2, b2) {
        return {
          r: bound01(r2, 255) * 255,
          g: bound01(g2, 255) * 255,
          b: bound01(b2, 255) * 255
        };
      }
      function rgbToHsl(r2, g2, b2) {
        r2 = bound01(r2, 255);
        g2 = bound01(g2, 255);
        b2 = bound01(b2, 255);
        var max = Math.max(r2, g2, b2);
        var min = Math.min(r2, g2, b2);
        var h2 = 0;
        var s2 = 0;
        var l2 = (max + min) / 2;
        if (max === min) {
          s2 = 0;
          h2 = 0;
        } else {
          var d2 = max - min;
          s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
          switch (max) {
            case r2:
              h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
              break;
            case g2:
              h2 = (b2 - r2) / d2 + 2;
              break;
            case b2:
              h2 = (r2 - g2) / d2 + 4;
              break;
          }
          h2 /= 6;
        }
        return { h: h2, s: s2, l: l2 };
      }
      function hue2rgb(p, q2, t2) {
        if (t2 < 0) {
          t2 += 1;
        }
        if (t2 > 1) {
          t2 -= 1;
        }
        if (t2 < 1 / 6) {
          return p + (q2 - p) * (6 * t2);
        }
        if (t2 < 1 / 2) {
          return q2;
        }
        if (t2 < 2 / 3) {
          return p + (q2 - p) * (2 / 3 - t2) * 6;
        }
        return p;
      }
      function hslToRgb(h2, s2, l2) {
        var r2;
        var g2;
        var b2;
        h2 = bound01(h2, 360);
        s2 = bound01(s2, 100);
        l2 = bound01(l2, 100);
        if (s2 === 0) {
          g2 = l2;
          b2 = l2;
          r2 = l2;
        } else {
          var q2 = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
          var p = 2 * l2 - q2;
          r2 = hue2rgb(p, q2, h2 + 1 / 3);
          g2 = hue2rgb(p, q2, h2);
          b2 = hue2rgb(p, q2, h2 - 1 / 3);
        }
        return { r: r2 * 255, g: g2 * 255, b: b2 * 255 };
      }
      function rgbToHsv(r2, g2, b2) {
        r2 = bound01(r2, 255);
        g2 = bound01(g2, 255);
        b2 = bound01(b2, 255);
        var max = Math.max(r2, g2, b2);
        var min = Math.min(r2, g2, b2);
        var h2 = 0;
        var v2 = max;
        var d2 = max - min;
        var s2 = max === 0 ? 0 : d2 / max;
        if (max === min) {
          h2 = 0;
        } else {
          switch (max) {
            case r2:
              h2 = (g2 - b2) / d2 + (g2 < b2 ? 6 : 0);
              break;
            case g2:
              h2 = (b2 - r2) / d2 + 2;
              break;
            case b2:
              h2 = (r2 - g2) / d2 + 4;
              break;
          }
          h2 /= 6;
        }
        return { h: h2, s: s2, v: v2 };
      }
      function hsvToRgb(h2, s2, v2) {
        h2 = bound01(h2, 360) * 6;
        s2 = bound01(s2, 100);
        v2 = bound01(v2, 100);
        var i2 = Math.floor(h2);
        var f2 = h2 - i2;
        var p = v2 * (1 - s2);
        var q2 = v2 * (1 - f2 * s2);
        var t2 = v2 * (1 - (1 - f2) * s2);
        var mod = i2 % 6;
        var r2 = [v2, q2, p, p, t2, v2][mod];
        var g2 = [t2, v2, v2, q2, p, p][mod];
        var b2 = [p, p, t2, v2, v2, q2][mod];
        return { r: r2 * 255, g: g2 * 255, b: b2 * 255 };
      }
      function rgbToHex(r2, g2, b2, allow3Char) {
        var hex = [
          pad2(Math.round(r2).toString(16)),
          pad2(Math.round(g2).toString(16)),
          pad2(Math.round(b2).toString(16))
        ];
        if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }
        return hex.join("");
      }
      function rgbaToHex(r2, g2, b2, a2, allow4Char) {
        var hex = [
          pad2(Math.round(r2).toString(16)),
          pad2(Math.round(g2).toString(16)),
          pad2(Math.round(b2).toString(16)),
          pad2(convertDecimalToHex(a2))
        ];
        if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
        }
        return hex.join("");
      }
      function convertDecimalToHex(d2) {
        return Math.round(parseFloat(d2) * 255).toString(16);
      }
      function convertHexToDecimal(h2) {
        return parseIntFromHex(h2) / 255;
      }
      function parseIntFromHex(val) {
        return parseInt(val, 16);
      }
      function numberInputToObject(color) {
        return {
          r: color >> 16,
          g: (color & 65280) >> 8,
          b: color & 255
        };
      }
      var names = {
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
        goldenrod: "#daa520",
        gold: "#ffd700",
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
        lavenderblush: "#fff0f5",
        lavender: "#e6e6fa",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
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
      function inputToRGB(color) {
        var rgb = { r: 0, g: 0, b: 0 };
        var a2 = 1;
        var s2 = null;
        var v2 = null;
        var l2 = null;
        var ok = false;
        var format = false;
        if (typeof color === "string") {
          color = stringInputToObject(color);
        }
        if (typeof color === "object") {
          if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s2 = convertToPercentage(color.s);
            v2 = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s2, v2);
            ok = true;
            format = "hsv";
          } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s2 = convertToPercentage(color.s);
            l2 = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s2, l2);
            ok = true;
            format = "hsl";
          }
          if (Object.prototype.hasOwnProperty.call(color, "a")) {
            a2 = color.a;
          }
        }
        a2 = boundAlpha(a2);
        return {
          ok,
          format: color.format || format,
          r: Math.min(255, Math.max(rgb.r, 0)),
          g: Math.min(255, Math.max(rgb.g, 0)),
          b: Math.min(255, Math.max(rgb.b, 0)),
          a: a2
        };
      }
      var CSS_INTEGER = "[-\\+]?\\d+%?";
      var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
      var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
      var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
      var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
      var matchers = {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
      };
      function stringInputToObject(color) {
        color = color.trim().toLowerCase();
        if (color.length === 0) {
          return false;
        }
        var named = false;
        if (names[color]) {
          color = names[color];
          named = true;
        } else if (color === "transparent") {
          return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }
        var match = matchers.rgb.exec(color);
        if (match) {
          return { r: match[1], g: match[2], b: match[3] };
        }
        match = matchers.rgba.exec(color);
        if (match) {
          return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        match = matchers.hsl.exec(color);
        if (match) {
          return { h: match[1], s: match[2], l: match[3] };
        }
        match = matchers.hsla.exec(color);
        if (match) {
          return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        match = matchers.hsv.exec(color);
        if (match) {
          return { h: match[1], s: match[2], v: match[3] };
        }
        match = matchers.hsva.exec(color);
        if (match) {
          return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        match = matchers.hex8.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
          };
        }
        match = matchers.hex6.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
          };
        }
        match = matchers.hex4.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? "name" : "hex8"
          };
        }
        match = matchers.hex3.exec(color);
        if (match) {
          return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? "name" : "hex"
          };
        }
        return false;
      }
      function isValidCSSUnit(color) {
        return Boolean(matchers.CSS_UNIT.exec(String(color)));
      }
      var TinyColor = (
        /** @class */
        function() {
          function TinyColor2(color, opts) {
            if (color === void 0) {
              color = "";
            }
            if (opts === void 0) {
              opts = {};
            }
            var _a2;
            if (color instanceof TinyColor2) {
              return color;
            }
            if (typeof color === "number") {
              color = numberInputToObject(color);
            }
            this.originalInput = color;
            var rgb = inputToRGB(color);
            this.originalInput = color;
            this.r = rgb.r;
            this.g = rgb.g;
            this.b = rgb.b;
            this.a = rgb.a;
            this.roundA = Math.round(100 * this.a) / 100;
            this.format = (_a2 = opts.format) !== null && _a2 !== void 0 ? _a2 : rgb.format;
            this.gradientType = opts.gradientType;
            if (this.r < 1) {
              this.r = Math.round(this.r);
            }
            if (this.g < 1) {
              this.g = Math.round(this.g);
            }
            if (this.b < 1) {
              this.b = Math.round(this.b);
            }
            this.isValid = rgb.ok;
          }
          TinyColor2.prototype.isDark = function() {
            return this.getBrightness() < 128;
          };
          TinyColor2.prototype.isLight = function() {
            return !this.isDark();
          };
          TinyColor2.prototype.getBrightness = function() {
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
          };
          TinyColor2.prototype.getLuminance = function() {
            var rgb = this.toRgb();
            var R2;
            var G;
            var B2;
            var RsRGB = rgb.r / 255;
            var GsRGB = rgb.g / 255;
            var BsRGB = rgb.b / 255;
            if (RsRGB <= 0.03928) {
              R2 = RsRGB / 12.92;
            } else {
              R2 = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
            }
            if (GsRGB <= 0.03928) {
              G = GsRGB / 12.92;
            } else {
              G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
            }
            if (BsRGB <= 0.03928) {
              B2 = BsRGB / 12.92;
            } else {
              B2 = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
            }
            return 0.2126 * R2 + 0.7152 * G + 0.0722 * B2;
          };
          TinyColor2.prototype.getAlpha = function() {
            return this.a;
          };
          TinyColor2.prototype.setAlpha = function(alpha) {
            this.a = boundAlpha(alpha);
            this.roundA = Math.round(100 * this.a) / 100;
            return this;
          };
          TinyColor2.prototype.isMonochrome = function() {
            var s2 = this.toHsl().s;
            return s2 === 0;
          };
          TinyColor2.prototype.toHsv = function() {
            var hsv = rgbToHsv(this.r, this.g, this.b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
          };
          TinyColor2.prototype.toHsvString = function() {
            var hsv = rgbToHsv(this.r, this.g, this.b);
            var h2 = Math.round(hsv.h * 360);
            var s2 = Math.round(hsv.s * 100);
            var v2 = Math.round(hsv.v * 100);
            return this.a === 1 ? "hsv(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%)") : "hsva(".concat(h2, ", ").concat(s2, "%, ").concat(v2, "%, ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toHsl = function() {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
          };
          TinyColor2.prototype.toHslString = function() {
            var hsl = rgbToHsl(this.r, this.g, this.b);
            var h2 = Math.round(hsl.h * 360);
            var s2 = Math.round(hsl.s * 100);
            var l2 = Math.round(hsl.l * 100);
            return this.a === 1 ? "hsl(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%)") : "hsla(".concat(h2, ", ").concat(s2, "%, ").concat(l2, "%, ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toHex = function(allow3Char) {
            if (allow3Char === void 0) {
              allow3Char = false;
            }
            return rgbToHex(this.r, this.g, this.b, allow3Char);
          };
          TinyColor2.prototype.toHexString = function(allow3Char) {
            if (allow3Char === void 0) {
              allow3Char = false;
            }
            return "#" + this.toHex(allow3Char);
          };
          TinyColor2.prototype.toHex8 = function(allow4Char) {
            if (allow4Char === void 0) {
              allow4Char = false;
            }
            return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
          };
          TinyColor2.prototype.toHex8String = function(allow4Char) {
            if (allow4Char === void 0) {
              allow4Char = false;
            }
            return "#" + this.toHex8(allow4Char);
          };
          TinyColor2.prototype.toHexShortString = function(allowShortChar) {
            if (allowShortChar === void 0) {
              allowShortChar = false;
            }
            return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
          };
          TinyColor2.prototype.toRgb = function() {
            return {
              r: Math.round(this.r),
              g: Math.round(this.g),
              b: Math.round(this.b),
              a: this.a
            };
          };
          TinyColor2.prototype.toRgbString = function() {
            var r2 = Math.round(this.r);
            var g2 = Math.round(this.g);
            var b2 = Math.round(this.b);
            return this.a === 1 ? "rgb(".concat(r2, ", ").concat(g2, ", ").concat(b2, ")") : "rgba(".concat(r2, ", ").concat(g2, ", ").concat(b2, ", ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toPercentageRgb = function() {
            var fmt = function(x2) {
              return "".concat(Math.round(bound01(x2, 255) * 100), "%");
            };
            return {
              r: fmt(this.r),
              g: fmt(this.g),
              b: fmt(this.b),
              a: this.a
            };
          };
          TinyColor2.prototype.toPercentageRgbString = function() {
            var rnd = function(x2) {
              return Math.round(bound01(x2, 255) * 100);
            };
            return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
          };
          TinyColor2.prototype.toName = function() {
            if (this.a === 0) {
              return "transparent";
            }
            if (this.a < 1) {
              return false;
            }
            var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
            for (var _i = 0, _a2 = Object.entries(names); _i < _a2.length; _i++) {
              var _b2 = _a2[_i], key2 = _b2[0], value = _b2[1];
              if (hex === value) {
                return key2;
              }
            }
            return false;
          };
          TinyColor2.prototype.toString = function(format) {
            var formatSet = Boolean(format);
            format = format !== null && format !== void 0 ? format : this.format;
            var formattedString = false;
            var hasAlpha = this.a < 1 && this.a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
            if (needsAlphaFormat) {
              if (format === "name" && this.a === 0) {
                return this.toName();
              }
              return this.toRgbString();
            }
            if (format === "rgb") {
              formattedString = this.toRgbString();
            }
            if (format === "prgb") {
              formattedString = this.toPercentageRgbString();
            }
            if (format === "hex" || format === "hex6") {
              formattedString = this.toHexString();
            }
            if (format === "hex3") {
              formattedString = this.toHexString(true);
            }
            if (format === "hex4") {
              formattedString = this.toHex8String(true);
            }
            if (format === "hex8") {
              formattedString = this.toHex8String();
            }
            if (format === "name") {
              formattedString = this.toName();
            }
            if (format === "hsl") {
              formattedString = this.toHslString();
            }
            if (format === "hsv") {
              formattedString = this.toHsvString();
            }
            return formattedString || this.toHexString();
          };
          TinyColor2.prototype.toNumber = function() {
            return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
          };
          TinyColor2.prototype.clone = function() {
            return new TinyColor2(this.toString());
          };
          TinyColor2.prototype.lighten = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.l += amount / 100;
            hsl.l = clamp01(hsl.l);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.brighten = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var rgb = this.toRgb();
            rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
            rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
            rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
            return new TinyColor2(rgb);
          };
          TinyColor2.prototype.darken = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.l -= amount / 100;
            hsl.l = clamp01(hsl.l);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.tint = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            return this.mix("white", amount);
          };
          TinyColor2.prototype.shade = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            return this.mix("black", amount);
          };
          TinyColor2.prototype.desaturate = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.s -= amount / 100;
            hsl.s = clamp01(hsl.s);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.saturate = function(amount) {
            if (amount === void 0) {
              amount = 10;
            }
            var hsl = this.toHsl();
            hsl.s += amount / 100;
            hsl.s = clamp01(hsl.s);
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.greyscale = function() {
            return this.desaturate(100);
          };
          TinyColor2.prototype.spin = function(amount) {
            var hsl = this.toHsl();
            var hue = (hsl.h + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.mix = function(color, amount) {
            if (amount === void 0) {
              amount = 50;
            }
            var rgb1 = this.toRgb();
            var rgb2 = new TinyColor2(color).toRgb();
            var p = amount / 100;
            var rgba = {
              r: (rgb2.r - rgb1.r) * p + rgb1.r,
              g: (rgb2.g - rgb1.g) * p + rgb1.g,
              b: (rgb2.b - rgb1.b) * p + rgb1.b,
              a: (rgb2.a - rgb1.a) * p + rgb1.a
            };
            return new TinyColor2(rgba);
          };
          TinyColor2.prototype.analogous = function(results, slices) {
            if (results === void 0) {
              results = 6;
            }
            if (slices === void 0) {
              slices = 30;
            }
            var hsl = this.toHsl();
            var part = 360 / slices;
            var ret = [this];
            for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
              hsl.h = (hsl.h + part) % 360;
              ret.push(new TinyColor2(hsl));
            }
            return ret;
          };
          TinyColor2.prototype.complement = function() {
            var hsl = this.toHsl();
            hsl.h = (hsl.h + 180) % 360;
            return new TinyColor2(hsl);
          };
          TinyColor2.prototype.monochromatic = function(results) {
            if (results === void 0) {
              results = 6;
            }
            var hsv = this.toHsv();
            var h2 = hsv.h;
            var s2 = hsv.s;
            var v2 = hsv.v;
            var res = [];
            var modification = 1 / results;
            while (results--) {
              res.push(new TinyColor2({ h: h2, s: s2, v: v2 }));
              v2 = (v2 + modification) % 1;
            }
            return res;
          };
          TinyColor2.prototype.splitcomplement = function() {
            var hsl = this.toHsl();
            var h2 = hsl.h;
            return [
              this,
              new TinyColor2({ h: (h2 + 72) % 360, s: hsl.s, l: hsl.l }),
              new TinyColor2({ h: (h2 + 216) % 360, s: hsl.s, l: hsl.l })
            ];
          };
          TinyColor2.prototype.onBackground = function(background) {
            var fg = this.toRgb();
            var bg = new TinyColor2(background).toRgb();
            var alpha = fg.a + bg.a * (1 - fg.a);
            return new TinyColor2({
              r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
              g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
              b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
              a: alpha
            });
          };
          TinyColor2.prototype.triad = function() {
            return this.polyad(3);
          };
          TinyColor2.prototype.tetrad = function() {
            return this.polyad(4);
          };
          TinyColor2.prototype.polyad = function(n2) {
            var hsl = this.toHsl();
            var h2 = hsl.h;
            var result = [this];
            var increment = 360 / n2;
            for (var i2 = 1; i2 < n2; i2++) {
              result.push(new TinyColor2({ h: (h2 + i2 * increment) % 360, s: hsl.s, l: hsl.l }));
            }
            return result;
          };
          TinyColor2.prototype.equals = function(color) {
            return this.toRgbString() === new TinyColor2(color).toRgbString();
          };
          return TinyColor2;
        }()
      );
      var hueStep = 2;
      var saturationStep = 0.16;
      var saturationStep2 = 0.05;
      var brightnessStep1 = 0.05;
      var brightnessStep2 = 0.15;
      var lightColorCount = 5;
      var darkColorCount = 4;
      var darkColorMap = [{
        index: 7,
        opacity: 0.15
      }, {
        index: 6,
        opacity: 0.25
      }, {
        index: 5,
        opacity: 0.3
      }, {
        index: 5,
        opacity: 0.45
      }, {
        index: 5,
        opacity: 0.65
      }, {
        index: 5,
        opacity: 0.85
      }, {
        index: 4,
        opacity: 0.9
      }, {
        index: 3,
        opacity: 0.95
      }, {
        index: 2,
        opacity: 0.97
      }, {
        index: 1,
        opacity: 0.98
      }];
      function toHsv(_ref) {
        var r2 = _ref.r, g2 = _ref.g, b2 = _ref.b;
        var hsv = rgbToHsv(r2, g2, b2);
        return {
          h: hsv.h * 360,
          s: hsv.s,
          v: hsv.v
        };
      }
      function toHex(_ref2) {
        var r2 = _ref2.r, g2 = _ref2.g, b2 = _ref2.b;
        return "#".concat(rgbToHex(r2, g2, b2, false));
      }
      function mix$1(rgb1, rgb2, amount) {
        var p = amount / 100;
        var rgb = {
          r: (rgb2.r - rgb1.r) * p + rgb1.r,
          g: (rgb2.g - rgb1.g) * p + rgb1.g,
          b: (rgb2.b - rgb1.b) * p + rgb1.b
        };
        return rgb;
      }
      function getHue(hsv, i2, light) {
        var hue;
        if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
          hue = light ? Math.round(hsv.h) - hueStep * i2 : Math.round(hsv.h) + hueStep * i2;
        } else {
          hue = light ? Math.round(hsv.h) + hueStep * i2 : Math.round(hsv.h) - hueStep * i2;
        }
        if (hue < 0) {
          hue += 360;
        } else if (hue >= 360) {
          hue -= 360;
        }
        return hue;
      }
      function getSaturation(hsv, i2, light) {
        if (hsv.h === 0 && hsv.s === 0) {
          return hsv.s;
        }
        var saturation;
        if (light) {
          saturation = hsv.s - saturationStep * i2;
        } else if (i2 === darkColorCount) {
          saturation = hsv.s + saturationStep;
        } else {
          saturation = hsv.s + saturationStep2 * i2;
        }
        if (saturation > 1) {
          saturation = 1;
        }
        if (light && i2 === lightColorCount && saturation > 0.1) {
          saturation = 0.1;
        }
        if (saturation < 0.06) {
          saturation = 0.06;
        }
        return Number(saturation.toFixed(2));
      }
      function getValue$1(hsv, i2, light) {
        var value;
        if (light) {
          value = hsv.v + brightnessStep1 * i2;
        } else {
          value = hsv.v - brightnessStep2 * i2;
        }
        if (value > 1) {
          value = 1;
        }
        return Number(value.toFixed(2));
      }
      function generate$1(color) {
        var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var patterns = [];
        var pColor = inputToRGB(color);
        for (var i2 = lightColorCount; i2 > 0; i2 -= 1) {
          var hsv = toHsv(pColor);
          var colorString = toHex(inputToRGB({
            h: getHue(hsv, i2, true),
            s: getSaturation(hsv, i2, true),
            v: getValue$1(hsv, i2, true)
          }));
          patterns.push(colorString);
        }
        patterns.push(toHex(pColor));
        for (var _i = 1; _i <= darkColorCount; _i += 1) {
          var _hsv = toHsv(pColor);
          var _colorString = toHex(inputToRGB({
            h: getHue(_hsv, _i),
            s: getSaturation(_hsv, _i),
            v: getValue$1(_hsv, _i)
          }));
          patterns.push(_colorString);
        }
        if (opts.theme === "dark") {
          return darkColorMap.map(function(_ref3) {
            var index2 = _ref3.index, opacity = _ref3.opacity;
            var darkColorString = toHex(mix$1(inputToRGB(opts.backgroundColor || "#141414"), inputToRGB(patterns[index2]), opacity * 100));
            return darkColorString;
          });
        }
        return patterns;
      }
      var presetPrimaryColors = {
        red: "#F5222D",
        volcano: "#FA541C",
        orange: "#FA8C16",
        gold: "#FAAD14",
        yellow: "#FADB14",
        lime: "#A0D911",
        green: "#52C41A",
        cyan: "#13C2C2",
        blue: "#1890FF",
        geekblue: "#2F54EB",
        purple: "#722ED1",
        magenta: "#EB2F96",
        grey: "#666666"
      };
      var presetPalettes = {};
      var presetDarkPalettes = {};
      Object.keys(presetPrimaryColors).forEach(function(key2) {
        presetPalettes[key2] = generate$1(presetPrimaryColors[key2]);
        presetPalettes[key2].primary = presetPalettes[key2][5];
        presetDarkPalettes[key2] = generate$1(presetPrimaryColors[key2], {
          theme: "dark",
          backgroundColor: "#141414"
        });
        presetDarkPalettes[key2].primary = presetDarkPalettes[key2][5];
      });
      var blue = presetPalettes.blue;
      const genControlHeight = (token2) => {
        const {
          controlHeight
        } = token2;
        return {
          controlHeightSM: controlHeight * 0.75,
          controlHeightXS: controlHeight * 0.5,
          controlHeightLG: controlHeight * 1.25
        };
      };
      const genControlHeight$1 = genControlHeight;
      function genSizeMapToken(token2) {
        const {
          sizeUnit,
          sizeStep
        } = token2;
        return {
          sizeXXL: sizeUnit * (sizeStep + 8),
          sizeXL: sizeUnit * (sizeStep + 4),
          sizeLG: sizeUnit * (sizeStep + 2),
          sizeMD: sizeUnit * (sizeStep + 1),
          sizeMS: sizeUnit * sizeStep,
          size: sizeUnit * sizeStep,
          sizeSM: sizeUnit * (sizeStep - 1),
          sizeXS: sizeUnit * (sizeStep - 2),
          sizeXXS: sizeUnit * (sizeStep - 3)
          // 4
        };
      }
      const defaultPresetColors = {
        blue: "#1677ff",
        purple: "#722ED1",
        cyan: "#13C2C2",
        green: "#52C41A",
        magenta: "#EB2F96",
        pink: "#eb2f96",
        red: "#F5222D",
        orange: "#FA8C16",
        yellow: "#FADB14",
        volcano: "#FA541C",
        geekblue: "#2F54EB",
        gold: "#FAAD14",
        lime: "#A0D911"
      };
      const seedToken = _extends(_extends({}, defaultPresetColors), {
        // Color
        colorPrimary: "#1677ff",
        colorSuccess: "#52c41a",
        colorWarning: "#faad14",
        colorError: "#ff4d4f",
        colorInfo: "#1677ff",
        colorTextBase: "",
        colorBgBase: "",
        // Font
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
'Noto Color Emoji'`,
        fontSize: 14,
        // Line
        lineWidth: 1,
        lineType: "solid",
        // Motion
        motionUnit: 0.1,
        motionBase: 0,
        motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
        motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
        motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
        motionEaseOutBack: "cubic-bezier(0.12, 0.4, 0.29, 1.46)",
        motionEaseInBack: "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
        motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
        motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
        // Radius
        borderRadius: 6,
        // Size
        sizeUnit: 4,
        sizeStep: 4,
        sizePopupArrow: 16,
        // Control Base
        controlHeight: 32,
        // zIndex
        zIndexBase: 0,
        zIndexPopupBase: 1e3,
        // Image
        opacityImage: 1,
        // Wireframe
        wireframe: false
      });
      const defaultSeedToken = seedToken;
      function genColorMapToken(seed2, _ref) {
        let {
          generateColorPalettes: generateColorPalettes2,
          generateNeutralColorPalettes: generateNeutralColorPalettes2
        } = _ref;
        const {
          colorSuccess: colorSuccessBase,
          colorWarning: colorWarningBase,
          colorError: colorErrorBase,
          colorInfo: colorInfoBase,
          colorPrimary: colorPrimaryBase,
          colorBgBase,
          colorTextBase
        } = seed2;
        const primaryColors = generateColorPalettes2(colorPrimaryBase);
        const successColors = generateColorPalettes2(colorSuccessBase);
        const warningColors = generateColorPalettes2(colorWarningBase);
        const errorColors = generateColorPalettes2(colorErrorBase);
        const infoColors = generateColorPalettes2(colorInfoBase);
        const neutralColors = generateNeutralColorPalettes2(colorBgBase, colorTextBase);
        return _extends(_extends({}, neutralColors), {
          colorPrimaryBg: primaryColors[1],
          colorPrimaryBgHover: primaryColors[2],
          colorPrimaryBorder: primaryColors[3],
          colorPrimaryBorderHover: primaryColors[4],
          colorPrimaryHover: primaryColors[5],
          colorPrimary: primaryColors[6],
          colorPrimaryActive: primaryColors[7],
          colorPrimaryTextHover: primaryColors[8],
          colorPrimaryText: primaryColors[9],
          colorPrimaryTextActive: primaryColors[10],
          colorSuccessBg: successColors[1],
          colorSuccessBgHover: successColors[2],
          colorSuccessBorder: successColors[3],
          colorSuccessBorderHover: successColors[4],
          colorSuccessHover: successColors[4],
          colorSuccess: successColors[6],
          colorSuccessActive: successColors[7],
          colorSuccessTextHover: successColors[8],
          colorSuccessText: successColors[9],
          colorSuccessTextActive: successColors[10],
          colorErrorBg: errorColors[1],
          colorErrorBgHover: errorColors[2],
          colorErrorBorder: errorColors[3],
          colorErrorBorderHover: errorColors[4],
          colorErrorHover: errorColors[5],
          colorError: errorColors[6],
          colorErrorActive: errorColors[7],
          colorErrorTextHover: errorColors[8],
          colorErrorText: errorColors[9],
          colorErrorTextActive: errorColors[10],
          colorWarningBg: warningColors[1],
          colorWarningBgHover: warningColors[2],
          colorWarningBorder: warningColors[3],
          colorWarningBorderHover: warningColors[4],
          colorWarningHover: warningColors[4],
          colorWarning: warningColors[6],
          colorWarningActive: warningColors[7],
          colorWarningTextHover: warningColors[8],
          colorWarningText: warningColors[9],
          colorWarningTextActive: warningColors[10],
          colorInfoBg: infoColors[1],
          colorInfoBgHover: infoColors[2],
          colorInfoBorder: infoColors[3],
          colorInfoBorderHover: infoColors[4],
          colorInfoHover: infoColors[4],
          colorInfo: infoColors[6],
          colorInfoActive: infoColors[7],
          colorInfoTextHover: infoColors[8],
          colorInfoText: infoColors[9],
          colorInfoTextActive: infoColors[10],
          colorBgMask: new TinyColor("#000").setAlpha(0.45).toRgbString(),
          colorWhite: "#fff"
        });
      }
      const genRadius = (radiusBase) => {
        let radiusLG = radiusBase;
        let radiusSM = radiusBase;
        let radiusXS = radiusBase;
        let radiusOuter = radiusBase;
        if (radiusBase < 6 && radiusBase >= 5) {
          radiusLG = radiusBase + 1;
        } else if (radiusBase < 16 && radiusBase >= 6) {
          radiusLG = radiusBase + 2;
        } else if (radiusBase >= 16) {
          radiusLG = 16;
        }
        if (radiusBase < 7 && radiusBase >= 5) {
          radiusSM = 4;
        } else if (radiusBase < 8 && radiusBase >= 7) {
          radiusSM = 5;
        } else if (radiusBase < 14 && radiusBase >= 8) {
          radiusSM = 6;
        } else if (radiusBase < 16 && radiusBase >= 14) {
          radiusSM = 7;
        } else if (radiusBase >= 16) {
          radiusSM = 8;
        }
        if (radiusBase < 6 && radiusBase >= 2) {
          radiusXS = 1;
        } else if (radiusBase >= 6) {
          radiusXS = 2;
        }
        if (radiusBase > 4 && radiusBase < 8) {
          radiusOuter = 4;
        } else if (radiusBase >= 8) {
          radiusOuter = 6;
        }
        return {
          borderRadius: radiusBase > 16 ? 16 : radiusBase,
          borderRadiusXS: radiusXS,
          borderRadiusSM: radiusSM,
          borderRadiusLG: radiusLG,
          borderRadiusOuter: radiusOuter
        };
      };
      const genRadius$1 = genRadius;
      function genCommonMapToken(token2) {
        const {
          motionUnit,
          motionBase,
          borderRadius,
          lineWidth
        } = token2;
        return _extends({
          // motion
          motionDurationFast: `${(motionBase + motionUnit).toFixed(1)}s`,
          motionDurationMid: `${(motionBase + motionUnit * 2).toFixed(1)}s`,
          motionDurationSlow: `${(motionBase + motionUnit * 3).toFixed(1)}s`,
          // line
          lineWidthBold: lineWidth + 1
        }, genRadius$1(borderRadius));
      }
      const getAlphaColor$1 = (baseColor, alpha) => new TinyColor(baseColor).setAlpha(alpha).toRgbString();
      const getSolidColor = (baseColor, brightness) => {
        const instance = new TinyColor(baseColor);
        return instance.darken(brightness).toHexString();
      };
      const generateColorPalettes = (baseColor) => {
        const colors = generate$1(baseColor);
        return {
          1: colors[0],
          2: colors[1],
          3: colors[2],
          4: colors[3],
          5: colors[4],
          6: colors[5],
          7: colors[6],
          8: colors[4],
          9: colors[5],
          10: colors[6]
          // 8: colors[7],
          // 9: colors[8],
          // 10: colors[9],
        };
      };
      const generateNeutralColorPalettes = (bgBaseColor, textBaseColor) => {
        const colorBgBase = bgBaseColor || "#fff";
        const colorTextBase = textBaseColor || "#000";
        return {
          colorBgBase,
          colorTextBase,
          colorText: getAlphaColor$1(colorTextBase, 0.88),
          colorTextSecondary: getAlphaColor$1(colorTextBase, 0.65),
          colorTextTertiary: getAlphaColor$1(colorTextBase, 0.45),
          colorTextQuaternary: getAlphaColor$1(colorTextBase, 0.25),
          colorFill: getAlphaColor$1(colorTextBase, 0.15),
          colorFillSecondary: getAlphaColor$1(colorTextBase, 0.06),
          colorFillTertiary: getAlphaColor$1(colorTextBase, 0.04),
          colorFillQuaternary: getAlphaColor$1(colorTextBase, 0.02),
          colorBgLayout: getSolidColor(colorBgBase, 4),
          colorBgContainer: getSolidColor(colorBgBase, 0),
          colorBgElevated: getSolidColor(colorBgBase, 0),
          colorBgSpotlight: getAlphaColor$1(colorTextBase, 0.85),
          colorBorder: getSolidColor(colorBgBase, 15),
          colorBorderSecondary: getSolidColor(colorBgBase, 6)
        };
      };
      function getFontSizes(base) {
        const fontSizes = new Array(10).fill(null).map((_2, index2) => {
          const i2 = index2 - 1;
          const baseSize = base * Math.pow(2.71828, i2 / 5);
          const intSize = index2 > 1 ? Math.floor(baseSize) : Math.ceil(baseSize);
          return Math.floor(intSize / 2) * 2;
        });
        fontSizes[1] = base;
        return fontSizes.map((size) => {
          const height = size + 8;
          return {
            size,
            lineHeight: height / size
          };
        });
      }
      const genFontMapToken = (fontSize) => {
        const fontSizePairs = getFontSizes(fontSize);
        const fontSizes = fontSizePairs.map((pair) => pair.size);
        const lineHeights = fontSizePairs.map((pair) => pair.lineHeight);
        return {
          fontSizeSM: fontSizes[0],
          fontSize: fontSizes[1],
          fontSizeLG: fontSizes[2],
          fontSizeXL: fontSizes[3],
          fontSizeHeading1: fontSizes[6],
          fontSizeHeading2: fontSizes[5],
          fontSizeHeading3: fontSizes[4],
          fontSizeHeading4: fontSizes[3],
          fontSizeHeading5: fontSizes[2],
          lineHeight: lineHeights[1],
          lineHeightLG: lineHeights[2],
          lineHeightSM: lineHeights[0],
          lineHeightHeading1: lineHeights[6],
          lineHeightHeading2: lineHeights[5],
          lineHeightHeading3: lineHeights[4],
          lineHeightHeading4: lineHeights[3],
          lineHeightHeading5: lineHeights[2]
        };
      };
      const genFontMapToken$1 = genFontMapToken;
      function derivative(token2) {
        const colorPalettes = Object.keys(defaultPresetColors).map((colorKey) => {
          const colors = generate$1(token2[colorKey]);
          return new Array(10).fill(1).reduce((prev2, _2, i2) => {
            prev2[`${colorKey}-${i2 + 1}`] = colors[i2];
            return prev2;
          }, {});
        }).reduce((prev2, cur) => {
          prev2 = _extends(_extends({}, prev2), cur);
          return prev2;
        }, {});
        return _extends(_extends(_extends(_extends(_extends(_extends(_extends({}, token2), colorPalettes), genColorMapToken(token2, {
          generateColorPalettes,
          generateNeutralColorPalettes
        })), genFontMapToken$1(token2.fontSize)), genSizeMapToken(token2)), genControlHeight$1(token2)), genCommonMapToken(token2));
      }
      function isStableColor(color) {
        return color >= 0 && color <= 255;
      }
      function getAlphaColor(frontColor, backgroundColor) {
        const {
          r: fR,
          g: fG,
          b: fB,
          a: originAlpha
        } = new TinyColor(frontColor).toRgb();
        if (originAlpha < 1) {
          return frontColor;
        }
        const {
          r: bR,
          g: bG,
          b: bB
        } = new TinyColor(backgroundColor).toRgb();
        for (let fA = 0.01; fA <= 1; fA += 0.01) {
          const r2 = Math.round((fR - bR * (1 - fA)) / fA);
          const g2 = Math.round((fG - bG * (1 - fA)) / fA);
          const b2 = Math.round((fB - bB * (1 - fA)) / fA);
          if (isStableColor(r2) && isStableColor(g2) && isStableColor(b2)) {
            return new TinyColor({
              r: r2,
              g: g2,
              b: b2,
              a: Math.round(fA * 100) / 100
            }).toRgbString();
          }
        }
        return new TinyColor({
          r: fR,
          g: fG,
          b: fB,
          a: 1
        }).toRgbString();
      }
      var __rest$b = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      function formatToken(derivativeToken) {
        const {
          override
        } = derivativeToken, restToken = __rest$b(derivativeToken, ["override"]);
        const overrideTokens = _extends({}, override);
        Object.keys(defaultSeedToken).forEach((token2) => {
          delete overrideTokens[token2];
        });
        const mergedToken = _extends(_extends({}, restToken), overrideTokens);
        const screenXS = 480;
        const screenSM = 576;
        const screenMD = 768;
        const screenLG = 992;
        const screenXL = 1200;
        const screenXXL = 1600;
        const screenXXXL = 2e3;
        const aliasToken = _extends(_extends(_extends({}, mergedToken), {
          colorLink: mergedToken.colorInfoText,
          colorLinkHover: mergedToken.colorInfoHover,
          colorLinkActive: mergedToken.colorInfoActive,
          // ============== Background ============== //
          colorFillContent: mergedToken.colorFillSecondary,
          colorFillContentHover: mergedToken.colorFill,
          colorFillAlter: mergedToken.colorFillQuaternary,
          colorBgContainerDisabled: mergedToken.colorFillTertiary,
          // ============== Split ============== //
          colorBorderBg: mergedToken.colorBgContainer,
          colorSplit: getAlphaColor(mergedToken.colorBorderSecondary, mergedToken.colorBgContainer),
          // ============== Text ============== //
          colorTextPlaceholder: mergedToken.colorTextQuaternary,
          colorTextDisabled: mergedToken.colorTextQuaternary,
          colorTextHeading: mergedToken.colorText,
          colorTextLabel: mergedToken.colorTextSecondary,
          colorTextDescription: mergedToken.colorTextTertiary,
          colorTextLightSolid: mergedToken.colorWhite,
          colorHighlight: mergedToken.colorError,
          colorBgTextHover: mergedToken.colorFillSecondary,
          colorBgTextActive: mergedToken.colorFill,
          colorIcon: mergedToken.colorTextTertiary,
          colorIconHover: mergedToken.colorText,
          colorErrorOutline: getAlphaColor(mergedToken.colorErrorBg, mergedToken.colorBgContainer),
          colorWarningOutline: getAlphaColor(mergedToken.colorWarningBg, mergedToken.colorBgContainer),
          // Font
          fontSizeIcon: mergedToken.fontSizeSM,
          // Control
          lineWidth: mergedToken.lineWidth,
          controlOutlineWidth: mergedToken.lineWidth * 2,
          // Checkbox size and expand icon size
          controlInteractiveSize: mergedToken.controlHeight / 2,
          controlItemBgHover: mergedToken.colorFillTertiary,
          controlItemBgActive: mergedToken.colorPrimaryBg,
          controlItemBgActiveHover: mergedToken.colorPrimaryBgHover,
          controlItemBgActiveDisabled: mergedToken.colorFill,
          controlTmpOutline: mergedToken.colorFillQuaternary,
          controlOutline: getAlphaColor(mergedToken.colorPrimaryBg, mergedToken.colorBgContainer),
          lineType: mergedToken.lineType,
          borderRadius: mergedToken.borderRadius,
          borderRadiusXS: mergedToken.borderRadiusXS,
          borderRadiusSM: mergedToken.borderRadiusSM,
          borderRadiusLG: mergedToken.borderRadiusLG,
          fontWeightStrong: 600,
          opacityLoading: 0.65,
          linkDecoration: "none",
          linkHoverDecoration: "none",
          linkFocusDecoration: "none",
          controlPaddingHorizontal: 12,
          controlPaddingHorizontalSM: 8,
          paddingXXS: mergedToken.sizeXXS,
          paddingXS: mergedToken.sizeXS,
          paddingSM: mergedToken.sizeSM,
          padding: mergedToken.size,
          paddingMD: mergedToken.sizeMD,
          paddingLG: mergedToken.sizeLG,
          paddingXL: mergedToken.sizeXL,
          paddingContentHorizontalLG: mergedToken.sizeLG,
          paddingContentVerticalLG: mergedToken.sizeMS,
          paddingContentHorizontal: mergedToken.sizeMS,
          paddingContentVertical: mergedToken.sizeSM,
          paddingContentHorizontalSM: mergedToken.size,
          paddingContentVerticalSM: mergedToken.sizeXS,
          marginXXS: mergedToken.sizeXXS,
          marginXS: mergedToken.sizeXS,
          marginSM: mergedToken.sizeSM,
          margin: mergedToken.size,
          marginMD: mergedToken.sizeMD,
          marginLG: mergedToken.sizeLG,
          marginXL: mergedToken.sizeXL,
          marginXXL: mergedToken.sizeXXL,
          boxShadow: `
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)
    `,
          boxShadowSecondary: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
          boxShadowTertiary: `
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)
    `,
          screenXS,
          screenXSMin: screenXS,
          screenXSMax: screenSM - 1,
          screenSM,
          screenSMMin: screenSM,
          screenSMMax: screenMD - 1,
          screenMD,
          screenMDMin: screenMD,
          screenMDMax: screenLG - 1,
          screenLG,
          screenLGMin: screenLG,
          screenLGMax: screenXL - 1,
          screenXL,
          screenXLMin: screenXL,
          screenXLMax: screenXXL - 1,
          screenXXL,
          screenXXLMin: screenXXL,
          screenXXLMax: screenXXXL - 1,
          screenXXXL,
          screenXXXLMin: screenXXXL,
          // FIXME: component box-shadow, should be removed
          boxShadowPopoverArrow: "3px 3px 7px rgba(0, 0, 0, 0.1)",
          boxShadowCard: `
      0 1px 2px -2px ${new TinyColor("rgba(0, 0, 0, 0.16)").toRgbString()},
      0 3px 6px 0 ${new TinyColor("rgba(0, 0, 0, 0.12)").toRgbString()},
      0 5px 12px 4px ${new TinyColor("rgba(0, 0, 0, 0.09)").toRgbString()}
    `,
          boxShadowDrawerRight: `
      -6px 0 16px 0 rgba(0, 0, 0, 0.08),
      -3px 0 6px -4px rgba(0, 0, 0, 0.12),
      -9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
          boxShadowDrawerLeft: `
      6px 0 16px 0 rgba(0, 0, 0, 0.08),
      3px 0 6px -4px rgba(0, 0, 0, 0.12),
      9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
          boxShadowDrawerUp: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
          boxShadowDrawerDown: `
      0 -6px 16px 0 rgba(0, 0, 0, 0.08),
      0 -3px 6px -4px rgba(0, 0, 0, 0.12),
      0 -9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
          boxShadowTabsOverflowLeft: "inset 10px 0 8px -8px rgba(0, 0, 0, 0.08)",
          boxShadowTabsOverflowRight: "inset -10px 0 8px -8px rgba(0, 0, 0, 0.08)",
          boxShadowTabsOverflowTop: "inset 0 10px 8px -8px rgba(0, 0, 0, 0.08)",
          boxShadowTabsOverflowBottom: "inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08)"
        }), overrideTokens);
        return aliasToken;
      }
      const roundedArrow = (width, innerRadius, outerRadius, bgColor, boxShadow) => {
        const unitWidth = width / 2;
        const ax = 0;
        const ay = unitWidth;
        const bx = outerRadius * 1 / Math.sqrt(2);
        const by = unitWidth - outerRadius * (1 - 1 / Math.sqrt(2));
        const cx = unitWidth - innerRadius * (1 / Math.sqrt(2));
        const cy = outerRadius * (Math.sqrt(2) - 1) + innerRadius * (1 / Math.sqrt(2));
        const dx = 2 * unitWidth - cx;
        const dy = cy;
        const ex = 2 * unitWidth - bx;
        const ey = by;
        const fx = 2 * unitWidth - ax;
        const fy = ay;
        const shadowWidth = unitWidth * Math.sqrt(2) + outerRadius * (Math.sqrt(2) - 2);
        const polygonOffset = outerRadius * (Math.sqrt(2) - 1);
        return {
          pointerEvents: "none",
          width,
          height: width,
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            width: shadowWidth,
            height: shadowWidth,
            bottom: 0,
            insetInline: 0,
            margin: "auto",
            borderRadius: {
              _skip_check_: true,
              value: `0 0 ${innerRadius}px 0`
            },
            transform: "translateY(50%) rotate(-135deg)",
            boxShadow,
            zIndex: 0,
            background: "transparent"
          },
          "&::before": {
            position: "absolute",
            bottom: 0,
            insetInlineStart: 0,
            width,
            height: width / 2,
            background: bgColor,
            clipPath: {
              _multi_value_: true,
              value: [`polygon(${polygonOffset}px 100%, 50% ${polygonOffset}px, ${2 * unitWidth - polygonOffset}px 100%, ${polygonOffset}px 100%)`, `path('M ${ax} ${ay} A ${outerRadius} ${outerRadius} 0 0 0 ${bx} ${by} L ${cx} ${cy} A ${innerRadius} ${innerRadius} 0 0 1 ${dx} ${dy} L ${ex} ${ey} A ${outerRadius} ${outerRadius} 0 0 0 ${fx} ${fy} Z')`]
            },
            content: '""'
          }
        };
      };
      function genPresetColor(token2, genCss) {
        return PresetColors.reduce((prev2, colorKey) => {
          const lightColor = token2[`${colorKey}-1`];
          const lightBorderColor = token2[`${colorKey}-3`];
          const darkColor = token2[`${colorKey}-6`];
          const textColor = token2[`${colorKey}-7`];
          return _extends(_extends({}, prev2), genCss(colorKey, {
            lightColor,
            lightBorderColor,
            darkColor,
            textColor
          }));
        }, {});
      }
      const resetComponent = (token2) => ({
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
        color: token2.colorText,
        fontSize: token2.fontSize,
        // font-variant: @font-variant-base;
        lineHeight: token2.lineHeight,
        listStyle: "none",
        // font-feature-settings: @font-feature-settings-base;
        fontFamily: token2.fontFamily
      });
      const resetIcon = () => ({
        display: "inline-flex",
        alignItems: "center",
        color: "inherit",
        fontStyle: "normal",
        lineHeight: 0,
        textAlign: "center",
        textTransform: "none",
        // for SVG icon, see https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
        verticalAlign: "-0.125em",
        textRendering: "optimizeLegibility",
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
        "> *": {
          lineHeight: 1
        },
        svg: {
          display: "inline-block"
        }
      });
      const genLinkStyle = (token2) => ({
        a: {
          color: token2.colorLink,
          textDecoration: token2.linkDecoration,
          backgroundColor: "transparent",
          outline: "none",
          cursor: "pointer",
          transition: `color ${token2.motionDurationSlow}`,
          "-webkit-text-decoration-skip": "objects",
          "&:hover": {
            color: token2.colorLinkHover
          },
          "&:active": {
            color: token2.colorLinkActive
          },
          [`&:active,
  &:hover`]: {
            textDecoration: token2.linkHoverDecoration,
            outline: 0
          },
          // https://github.com/ant-design/ant-design/issues/22503
          "&:focus": {
            textDecoration: token2.linkFocusDecoration,
            outline: 0
          },
          "&[disabled]": {
            color: token2.colorTextDisabled,
            cursor: "not-allowed"
          }
        }
      });
      const genCommonStyle = (token2, componentPrefixCls) => {
        const {
          fontFamily,
          fontSize
        } = token2;
        const rootPrefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;
        return {
          [rootPrefixSelector]: {
            fontFamily,
            fontSize,
            boxSizing: "border-box",
            "&::before, &::after": {
              boxSizing: "border-box"
            },
            [rootPrefixSelector]: {
              boxSizing: "border-box",
              "&::before, &::after": {
                boxSizing: "border-box"
              }
            }
          }
        };
      };
      function genComponentStyleHook(component, styleFn, getDefaultToken) {
        return (_prefixCls) => {
          const prefixCls = vue.computed(() => _prefixCls === null || _prefixCls === void 0 ? void 0 : _prefixCls.value);
          const [theme, token2, hashId] = useToken();
          const {
            getPrefixCls,
            iconPrefixCls
          } = useConfigContextInject();
          const rootPrefixCls = vue.computed(() => getPrefixCls());
          const sharedInfo = vue.computed(() => {
            return {
              theme: theme.value,
              token: token2.value,
              hashId: hashId.value,
              path: ["Shared", rootPrefixCls.value]
            };
          });
          useStyleRegister(sharedInfo, () => [{
            // Link
            "&": genLinkStyle(token2.value)
          }]);
          const componentInfo = vue.computed(() => {
            return {
              theme: theme.value,
              token: token2.value,
              hashId: hashId.value,
              path: [component, prefixCls.value, iconPrefixCls.value]
            };
          });
          return [useStyleRegister(componentInfo, () => {
            const {
              token: proxyToken,
              flush
            } = statisticToken(token2.value);
            const defaultComponentToken = typeof getDefaultToken === "function" ? getDefaultToken(proxyToken) : getDefaultToken;
            const mergedComponentToken = _extends(_extends({}, defaultComponentToken), token2.value[component]);
            const componentCls = `.${prefixCls.value}`;
            const mergedToken = merge(proxyToken, {
              componentCls,
              prefixCls: prefixCls.value,
              iconCls: `.${iconPrefixCls.value}`,
              antCls: `.${rootPrefixCls.value}`
            }, mergedComponentToken);
            const styleInterpolation = styleFn(mergedToken, {
              hashId: hashId.value,
              prefixCls: prefixCls.value,
              rootPrefixCls: rootPrefixCls.value,
              iconPrefixCls: iconPrefixCls.value,
              overrideComponentToken: token2.value[component]
            });
            flush(component, mergedComponentToken);
            return [genCommonStyle(token2.value, prefixCls.value), styleInterpolation];
          }), hashId];
        };
      }
      const enableStatistic = typeof CSSINJS_STATISTIC !== "undefined";
      let recording$1 = true;
      function merge() {
        for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
          objs[_key] = arguments[_key];
        }
        if (!enableStatistic) {
          return _extends({}, ...objs);
        }
        recording$1 = false;
        const ret = {};
        objs.forEach((obj) => {
          const keys2 = Object.keys(obj);
          keys2.forEach((key2) => {
            Object.defineProperty(ret, key2, {
              configurable: true,
              enumerable: true,
              get: () => obj[key2]
            });
          });
        });
        recording$1 = true;
        return ret;
      }
      function noop$2() {
      }
      function statisticToken(token2) {
        let tokenKeys2;
        let proxy = token2;
        let flush = noop$2;
        if (enableStatistic) {
          tokenKeys2 = /* @__PURE__ */ new Set();
          proxy = new Proxy(token2, {
            get(obj, prop) {
              if (recording$1) {
                tokenKeys2.add(prop);
              }
              return obj[prop];
            }
          });
          flush = (componentName, componentToken) => {
            ({
              global: Array.from(tokenKeys2),
              component: componentToken
            });
          };
        }
        return {
          token: proxy,
          keys: tokenKeys2,
          flush
        };
      }
      function toReactive(objectRef) {
        if (!vue.isRef(objectRef))
          return vue.reactive(objectRef);
        const proxy = new Proxy({}, {
          get(_2, p, receiver) {
            return Reflect.get(objectRef.value, p, receiver);
          },
          set(_2, p, value) {
            objectRef.value[p] = value;
            return true;
          },
          deleteProperty(_2, p) {
            return Reflect.deleteProperty(objectRef.value, p);
          },
          has(_2, p) {
            return Reflect.has(objectRef.value, p);
          },
          ownKeys() {
            return Object.keys(objectRef.value);
          },
          getOwnPropertyDescriptor() {
            return {
              enumerable: true,
              configurable: true
            };
          }
        });
        return vue.reactive(proxy);
      }
      const defaultTheme = createTheme(derivative);
      const defaultConfig = {
        token: defaultSeedToken,
        hashed: true
      };
      const DesignTokenContextKey = Symbol("DesignTokenContext");
      const globalDesignTokenApi = vue.ref();
      const useDesignTokenProvider = (value) => {
        vue.provide(DesignTokenContextKey, value);
        vue.watchEffect(() => {
          globalDesignTokenApi.value = value;
        });
      };
      const DesignTokenProvider = vue.defineComponent({
        props: {
          value: objectType()
        },
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          useDesignTokenProvider(toReactive(vue.computed(() => props.value)));
          return () => {
            var _a2;
            return (_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots);
          };
        }
      });
      function useToken() {
        const designTokenContext = vue.inject(DesignTokenContextKey, globalDesignTokenApi.value || defaultConfig);
        const salt = vue.computed(() => `${version}-${designTokenContext.hashed || ""}`);
        const mergedTheme = vue.computed(() => designTokenContext.theme || defaultTheme);
        const cacheToken = useCacheToken(mergedTheme, vue.computed(() => [defaultSeedToken, designTokenContext.token]), vue.computed(() => ({
          salt: salt.value,
          override: _extends({
            override: designTokenContext.token
          }, designTokenContext.components),
          formatToken
        })));
        return [mergedTheme, vue.computed(() => cacheToken.value[0]), vue.computed(() => designTokenContext.hashed ? cacheToken.value[1] : "")];
      }
      const Empty$2 = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        setup() {
          const [, token2] = useToken();
          const themeStyle = vue.computed(() => {
            const bgColor = new TinyColor(token2.value.colorBgBase);
            if (bgColor.toHsl().l < 0.5) {
              return {
                opacity: 0.65
              };
            }
            return {};
          });
          return () => vue.createVNode("svg", {
            "style": themeStyle.value,
            "width": "184",
            "height": "152",
            "viewBox": "0 0 184 152",
            "xmlns": "http://www.w3.org/2000/svg"
          }, [vue.createVNode("g", {
            "fill": "none",
            "fill-rule": "evenodd"
          }, [vue.createVNode("g", {
            "transform": "translate(24 31.67)"
          }, [vue.createVNode("ellipse", {
            "fill-opacity": ".8",
            "fill": "#F5F5F7",
            "cx": "67.797",
            "cy": "106.89",
            "rx": "67.797",
            "ry": "12.668"
          }, null), vue.createVNode("path", {
            "d": "M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z",
            "fill": "#AEB8C2"
          }, null), vue.createVNode("path", {
            "d": "M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z",
            "fill": "url(#linearGradient-1)",
            "transform": "translate(13.56)"
          }, null), vue.createVNode("path", {
            "d": "M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z",
            "fill": "#F5F5F7"
          }, null), vue.createVNode("path", {
            "d": "M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z",
            "fill": "#DCE0E6"
          }, null)]), vue.createVNode("path", {
            "d": "M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z",
            "fill": "#DCE0E6"
          }, null), vue.createVNode("g", {
            "transform": "translate(149.65 15.383)",
            "fill": "#FFF"
          }, [vue.createVNode("ellipse", {
            "cx": "20.654",
            "cy": "3.167",
            "rx": "2.849",
            "ry": "2.815"
          }, null), vue.createVNode("path", {
            "d": "M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"
          }, null)])])]);
        }
      });
      Empty$2.PRESENTED_IMAGE_DEFAULT = true;
      const DefaultEmptyImg = Empty$2;
      const Simple = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        setup() {
          const [, token2] = useToken();
          const color = vue.computed(() => {
            const {
              colorFill,
              colorFillTertiary,
              colorFillQuaternary,
              colorBgContainer
            } = token2.value;
            return {
              borderColor: new TinyColor(colorFill).onBackground(colorBgContainer).toHexString(),
              shadowColor: new TinyColor(colorFillTertiary).onBackground(colorBgContainer).toHexString(),
              contentColor: new TinyColor(colorFillQuaternary).onBackground(colorBgContainer).toHexString()
            };
          });
          return () => vue.createVNode("svg", {
            "width": "64",
            "height": "41",
            "viewBox": "0 0 64 41",
            "xmlns": "http://www.w3.org/2000/svg"
          }, [vue.createVNode("g", {
            "transform": "translate(0 1)",
            "fill": "none",
            "fill-rule": "evenodd"
          }, [vue.createVNode("ellipse", {
            "fill": color.value.shadowColor,
            "cx": "32",
            "cy": "33",
            "rx": "32",
            "ry": "7"
          }, null), vue.createVNode("g", {
            "fill-rule": "nonzero",
            "stroke": color.value.borderColor
          }, [vue.createVNode("path", {
            "d": "M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
          }, null), vue.createVNode("path", {
            "d": "M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z",
            "fill": color.value.contentColor
          }, null)])])]);
        }
      });
      Simple.PRESENTED_IMAGE_SIMPLE = true;
      const SimpleEmptyImg = Simple;
      const genSharedEmptyStyle = (token2) => {
        const {
          componentCls,
          margin,
          marginXS,
          marginXL,
          fontSize,
          lineHeight
        } = token2;
        return {
          [componentCls]: {
            marginInline: marginXS,
            fontSize,
            lineHeight,
            textAlign: "center",
            // 原来 &-image 没有父子结构，现在为了外层承担我们的hashId，改成父子结果
            [`${componentCls}-image`]: {
              height: token2.emptyImgHeight,
              marginBottom: marginXS,
              opacity: token2.opacityImage,
              img: {
                height: "100%"
              },
              svg: {
                height: "100%",
                margin: "auto"
              }
            },
            // 原来 &-footer 没有父子结构，现在为了外层承担我们的hashId，改成父子结果
            [`${componentCls}-footer`]: {
              marginTop: margin
            },
            "&-normal": {
              marginBlock: marginXL,
              color: token2.colorTextDisabled,
              [`${componentCls}-image`]: {
                height: token2.emptyImgHeightMD
              }
            },
            "&-small": {
              marginBlock: marginXS,
              color: token2.colorTextDisabled,
              [`${componentCls}-image`]: {
                height: token2.emptyImgHeightSM
              }
            }
          }
        };
      };
      const useStyle$7 = genComponentStyleHook("Empty", (token2) => {
        const {
          componentCls,
          controlHeightLG
        } = token2;
        const emptyToken = merge(token2, {
          emptyImgCls: `${componentCls}-img`,
          emptyImgHeight: controlHeightLG * 2.5,
          emptyImgHeightMD: controlHeightLG,
          emptyImgHeightSM: controlHeightLG * 0.875
        });
        return [genSharedEmptyStyle(emptyToken)];
      });
      var __rest$a = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const defaultEmptyImg = vue.createVNode(DefaultEmptyImg, null, null);
      const simpleEmptyImg = vue.createVNode(SimpleEmptyImg, null, null);
      const emptyProps = () => ({
        prefixCls: String,
        imageStyle: objectType(),
        image: anyType(),
        description: anyType()
      });
      const Empty = vue.defineComponent({
        name: "AEmpty",
        compatConfig: {
          MODE: 3
        },
        inheritAttrs: false,
        props: emptyProps(),
        setup(props, _ref) {
          let {
            slots = {},
            attrs
          } = _ref;
          const {
            direction,
            prefixCls: prefixClsRef
          } = useConfigInject("empty", props);
          const [wrapSSR, hashId] = useStyle$7(prefixClsRef);
          return () => {
            var _a2, _b2;
            const prefixCls = prefixClsRef.value;
            const _c = _extends(_extends({}, props), attrs), {
              image = ((_a2 = slots.image) === null || _a2 === void 0 ? void 0 : _a2.call(slots)) || defaultEmptyImg,
              description = ((_b2 = slots.description) === null || _b2 === void 0 ? void 0 : _b2.call(slots)) || void 0,
              imageStyle,
              class: className = ""
            } = _c, restProps = __rest$a(_c, ["image", "description", "imageStyle", "class"]);
            return wrapSSR(vue.createVNode(LocaleReceiver, {
              "componentName": "Empty",
              "children": (locale2) => {
                const des = typeof description !== "undefined" ? description : locale2.description;
                const alt = typeof des === "string" ? des : "empty";
                let imageNode = null;
                if (typeof image === "string") {
                  imageNode = vue.createVNode("img", {
                    "alt": alt,
                    "src": image
                  }, null);
                } else {
                  imageNode = image;
                }
                return vue.createVNode("div", _objectSpread2$1({
                  "class": classNames(prefixCls, className, hashId.value, {
                    [`${prefixCls}-normal`]: image === simpleEmptyImg,
                    [`${prefixCls}-rtl`]: direction.value === "rtl"
                  })
                }, restProps), [vue.createVNode("div", {
                  "class": `${prefixCls}-image`,
                  "style": imageStyle
                }, [imageNode]), des && vue.createVNode("p", {
                  "class": `${prefixCls}-description`
                }, [des]), slots.default && vue.createVNode("div", {
                  "class": `${prefixCls}-footer`
                }, [filterEmpty(slots.default())])]);
              }
            }, null));
          };
        }
      });
      Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
      Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;
      const Empty$1 = withInstall(Empty);
      const DefaultRenderEmpty = (props) => {
        const {
          prefixCls
        } = useConfigInject("empty", props);
        const renderHtml = (componentName) => {
          switch (componentName) {
            case "Table":
            case "List":
              return vue.createVNode(Empty$1, {
                "image": Empty$1.PRESENTED_IMAGE_SIMPLE
              }, null);
            case "Select":
            case "TreeSelect":
            case "Cascader":
            case "Transfer":
            case "Mentions":
              return vue.createVNode(Empty$1, {
                "image": Empty$1.PRESENTED_IMAGE_SIMPLE,
                "class": `${prefixCls.value}-small`
              }, null);
            default:
              return vue.createVNode(Empty$1, null, null);
          }
        };
        return renderHtml(props.componentName);
      };
      function renderEmpty(componentName) {
        return vue.createVNode(DefaultRenderEmpty, {
          "componentName": componentName
        }, null);
      }
      const SizeContextKey = Symbol("SizeContextKey");
      const useInjectSize = () => {
        return vue.inject(SizeContextKey, vue.ref(void 0));
      };
      const useProviderSize = (size) => {
        const parentSize = useInjectSize();
        vue.provide(SizeContextKey, vue.computed(() => size.value || parentSize.value));
        return size;
      };
      const useConfigInject = (name, props) => {
        const sizeContext = useInjectSize();
        const disabledContext = useInjectDisabled();
        const configProvider = vue.inject(configProviderKey, _extends(_extends({}, defaultConfigProvider), {
          renderEmpty: (name2) => vue.h(DefaultRenderEmpty, {
            componentName: name2
          })
        }));
        const prefixCls = vue.computed(() => configProvider.getPrefixCls(name, props.prefixCls));
        const direction = vue.computed(() => {
          var _a2, _b2;
          return (_a2 = props.direction) !== null && _a2 !== void 0 ? _a2 : (_b2 = configProvider.direction) === null || _b2 === void 0 ? void 0 : _b2.value;
        });
        const iconPrefixCls = vue.computed(() => {
          var _a2;
          return (_a2 = props.iconPrefixCls) !== null && _a2 !== void 0 ? _a2 : configProvider.iconPrefixCls.value;
        });
        const rootPrefixCls = vue.computed(() => configProvider.getPrefixCls());
        const autoInsertSpaceInButton = vue.computed(() => {
          var _a2;
          return (_a2 = configProvider.autoInsertSpaceInButton) === null || _a2 === void 0 ? void 0 : _a2.value;
        });
        const renderEmpty2 = configProvider.renderEmpty;
        const space = configProvider.space;
        const pageHeader = configProvider.pageHeader;
        const form = configProvider.form;
        const getTargetContainer = vue.computed(() => {
          var _a2, _b2;
          return (_a2 = props.getTargetContainer) !== null && _a2 !== void 0 ? _a2 : (_b2 = configProvider.getTargetContainer) === null || _b2 === void 0 ? void 0 : _b2.value;
        });
        const getPopupContainer = vue.computed(() => {
          var _a2, _b2, _c;
          return (_b2 = (_a2 = props.getContainer) !== null && _a2 !== void 0 ? _a2 : props.getPopupContainer) !== null && _b2 !== void 0 ? _b2 : (_c = configProvider.getPopupContainer) === null || _c === void 0 ? void 0 : _c.value;
        });
        const dropdownMatchSelectWidth = vue.computed(() => {
          var _a2, _b2;
          return (_a2 = props.dropdownMatchSelectWidth) !== null && _a2 !== void 0 ? _a2 : (_b2 = configProvider.dropdownMatchSelectWidth) === null || _b2 === void 0 ? void 0 : _b2.value;
        });
        const virtual = vue.computed(() => {
          var _a2;
          return (props.virtual === void 0 ? ((_a2 = configProvider.virtual) === null || _a2 === void 0 ? void 0 : _a2.value) !== false : props.virtual !== false) && dropdownMatchSelectWidth.value !== false;
        });
        const size = vue.computed(() => props.size || sizeContext.value);
        const autocomplete = vue.computed(() => {
          var _a2, _b2, _c;
          return (_a2 = props.autocomplete) !== null && _a2 !== void 0 ? _a2 : (_c = (_b2 = configProvider.input) === null || _b2 === void 0 ? void 0 : _b2.value) === null || _c === void 0 ? void 0 : _c.autocomplete;
        });
        const disabled = vue.computed(() => {
          var _a2;
          return (_a2 = props.disabled) !== null && _a2 !== void 0 ? _a2 : disabledContext.value;
        });
        const csp = vue.computed(() => {
          var _a2;
          return (_a2 = props.csp) !== null && _a2 !== void 0 ? _a2 : configProvider.csp;
        });
        return {
          configProvider,
          prefixCls,
          direction,
          size,
          getTargetContainer,
          getPopupContainer,
          space,
          pageHeader,
          form,
          autoInsertSpaceInButton,
          renderEmpty: renderEmpty2,
          virtual,
          dropdownMatchSelectWidth,
          rootPrefixCls,
          getPrefixCls: configProvider.getPrefixCls,
          autocomplete,
          csp,
          iconPrefixCls,
          disabled,
          select: configProvider.select
        };
      };
      function easeInOutCubic(t2, b2, c2, d2) {
        const cc = c2 - b2;
        t2 /= d2 / 2;
        if (t2 < 1) {
          return cc / 2 * t2 * t2 * t2 + b2;
        }
        return cc / 2 * ((t2 -= 2) * t2 * t2 + 2) + b2;
      }
      function isWindow$1(obj) {
        return obj !== null && obj !== void 0 && obj === obj.window;
      }
      function getScroll$1(target, top) {
        var _a2, _b2;
        if (typeof window === "undefined") {
          return 0;
        }
        const method = top ? "scrollTop" : "scrollLeft";
        let result = 0;
        if (isWindow$1(target)) {
          result = target[top ? "pageYOffset" : "pageXOffset"];
        } else if (target instanceof Document) {
          result = target.documentElement[method];
        } else if (target instanceof HTMLElement) {
          result = target[method];
        } else if (target) {
          result = target[method];
        }
        if (target && !isWindow$1(target) && typeof result !== "number") {
          result = (_b2 = ((_a2 = target.ownerDocument) !== null && _a2 !== void 0 ? _a2 : target).documentElement) === null || _b2 === void 0 ? void 0 : _b2[method];
        }
        return result;
      }
      function scrollTo(y2) {
        let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const {
          getContainer: getContainer2 = () => window,
          callback,
          duration = 450
        } = options;
        const container = getContainer2();
        const scrollTop = getScroll$1(container, true);
        const startTime = Date.now();
        const frameFunc = () => {
          const timestamp = Date.now();
          const time = timestamp - startTime;
          const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y2, duration);
          if (isWindow$1(container)) {
            container.scrollTo(window.pageXOffset, nextScrollTop);
          } else if (container instanceof Document || container.constructor.name === "HTMLDocument") {
            container.documentElement.scrollTop = nextScrollTop;
          } else {
            container.scrollTop = nextScrollTop;
          }
          if (time < duration) {
            wrapperRaf(frameFunc);
          } else if (typeof callback === "function") {
            callback();
          }
        };
        wrapperRaf(frameFunc);
      }
      function e(e2, t2) {
        for (var n2 = 0; n2 < t2.length; n2++) {
          var r2 = t2[n2];
          r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e2, r2.key, r2);
        }
      }
      function t(t2, n2, r2) {
        return n2 && e(t2.prototype, n2), r2 && e(t2, r2), t2;
      }
      function n() {
        return (n = Object.assign || function(e2) {
          for (var t2 = 1; t2 < arguments.length; t2++) {
            var n2 = arguments[t2];
            for (var r2 in n2)
              Object.prototype.hasOwnProperty.call(n2, r2) && (e2[r2] = n2[r2]);
          }
          return e2;
        }).apply(this, arguments);
      }
      function r(e2, t2) {
        e2.prototype = Object.create(t2.prototype), e2.prototype.constructor = e2, e2.__proto__ = t2;
      }
      function i$2(e2, t2) {
        if (null == e2)
          return {};
        var n2, r2, i2 = {}, o2 = Object.keys(e2);
        for (r2 = 0; r2 < o2.length; r2++)
          t2.indexOf(n2 = o2[r2]) >= 0 || (i2[n2] = e2[n2]);
        return i2;
      }
      function o(e2) {
        return 1 == (null != (t2 = e2) && "object" == typeof t2 && false === Array.isArray(t2)) && "[object Object]" === Object.prototype.toString.call(e2);
        var t2;
      }
      var u = Object.prototype, a = u.toString, f = u.hasOwnProperty, c = /^\s*function (\w+)/;
      function l(e2) {
        var t2, n2 = null !== (t2 = null == e2 ? void 0 : e2.type) && void 0 !== t2 ? t2 : e2;
        if (n2) {
          var r2 = n2.toString().match(c);
          return r2 ? r2[1] : "";
        }
        return "";
      }
      var s = function(e2) {
        var t2, n2;
        return false !== o(e2) && "function" == typeof (t2 = e2.constructor) && false !== o(n2 = t2.prototype) && false !== n2.hasOwnProperty("isPrototypeOf");
      }, v = function(e2) {
        return e2;
      }, y = v;
      var d = function(e2, t2) {
        return f.call(e2, t2);
      }, h = Number.isInteger || function(e2) {
        return "number" == typeof e2 && isFinite(e2) && Math.floor(e2) === e2;
      }, b = Array.isArray || function(e2) {
        return "[object Array]" === a.call(e2);
      }, O = function(e2) {
        return "[object Function]" === a.call(e2);
      }, g = function(e2) {
        return s(e2) && d(e2, "_vueTypes_name");
      }, m = function(e2) {
        return s(e2) && (d(e2, "type") || ["_vueTypes_name", "validator", "default", "required"].some(function(t2) {
          return d(e2, t2);
        }));
      };
      function j(e2, t2) {
        return Object.defineProperty(e2.bind(t2), "__original", { value: e2 });
      }
      function _(e2, t2, n2) {
        var r2;
        void 0 === n2 && (n2 = false);
        var i2 = true, o2 = "";
        r2 = s(e2) ? e2 : { type: e2 };
        var u2 = g(r2) ? r2._vueTypes_name + " - " : "";
        if (m(r2) && null !== r2.type) {
          if (void 0 === r2.type || true === r2.type)
            return i2;
          if (!r2.required && void 0 === t2)
            return i2;
          b(r2.type) ? (i2 = r2.type.some(function(e3) {
            return true === _(e3, t2, true);
          }), o2 = r2.type.map(function(e3) {
            return l(e3);
          }).join(" or ")) : i2 = "Array" === (o2 = l(r2)) ? b(t2) : "Object" === o2 ? s(t2) : "String" === o2 || "Number" === o2 || "Boolean" === o2 || "Function" === o2 ? function(e3) {
            if (null == e3)
              return "";
            var t3 = e3.constructor.toString().match(c);
            return t3 ? t3[1] : "";
          }(t2) === o2 : t2 instanceof r2.type;
        }
        if (!i2) {
          var a2 = u2 + 'value "' + t2 + '" should be of type "' + o2 + '"';
          return false === n2 ? (y(a2), false) : a2;
        }
        if (d(r2, "validator") && O(r2.validator)) {
          var f2 = y, v2 = [];
          if (y = function(e3) {
            v2.push(e3);
          }, i2 = r2.validator(t2), y = f2, !i2) {
            var p = (v2.length > 1 ? "* " : "") + v2.join("\n* ");
            return v2.length = 0, false === n2 ? (y(p), i2) : p;
          }
        }
        return i2;
      }
      function T(e2, t2) {
        var n2 = Object.defineProperties(t2, { _vueTypes_name: { value: e2, writable: true }, isRequired: { get: function() {
          return this.required = true, this;
        } }, def: { value: function(e3) {
          return void 0 !== e3 || this.default ? O(e3) || true === _(this, e3, true) ? (this.default = b(e3) ? function() {
            return [].concat(e3);
          } : s(e3) ? function() {
            return Object.assign({}, e3);
          } : e3, this) : (y(this._vueTypes_name + ' - invalid default value: "' + e3 + '"'), this) : this;
        } } }), r2 = n2.validator;
        return O(r2) && (n2.validator = j(r2, n2)), n2;
      }
      function w(e2, t2) {
        var n2 = T(e2, t2);
        return Object.defineProperty(n2, "validate", { value: function(e3) {
          return O(this.validator) && y(this._vueTypes_name + " - calling .validate() will overwrite the current custom validator function. Validator info:\n" + JSON.stringify(this)), this.validator = j(e3, this), this;
        } });
      }
      function k(e2, t2, n2) {
        var r2, o2, u2 = (r2 = t2, o2 = {}, Object.getOwnPropertyNames(r2).forEach(function(e3) {
          o2[e3] = Object.getOwnPropertyDescriptor(r2, e3);
        }), Object.defineProperties({}, o2));
        if (u2._vueTypes_name = e2, !s(n2))
          return u2;
        var a2, f2, c2 = n2.validator, l2 = i$2(n2, ["validator"]);
        if (O(c2)) {
          var v2 = u2.validator;
          v2 && (v2 = null !== (f2 = (a2 = v2).__original) && void 0 !== f2 ? f2 : a2), u2.validator = j(v2 ? function(e3) {
            return v2.call(this, e3) && c2.call(this, e3);
          } : c2, u2);
        }
        return Object.assign(u2, l2);
      }
      function P(e2) {
        return e2.replace(/^(?!\s*$)/gm, "  ");
      }
      var x$1 = function() {
        return w("any", {});
      }, A = function() {
        return w("function", { type: Function });
      }, E = function() {
        return w("boolean", { type: Boolean });
      }, N = function() {
        return w("string", { type: String });
      }, q = function() {
        return w("number", { type: Number });
      }, S = function() {
        return w("array", { type: Array });
      }, V = function() {
        return w("object", { type: Object });
      }, F = function() {
        return T("integer", { type: Number, validator: function(e2) {
          return h(e2);
        } });
      }, D = function() {
        return T("symbol", { validator: function(e2) {
          return "symbol" == typeof e2;
        } });
      };
      function L(e2, t2) {
        if (void 0 === t2 && (t2 = "custom validation failed"), "function" != typeof e2)
          throw new TypeError("[VueTypes error]: You must provide a function as argument");
        return T(e2.name || "<<anonymous function>>", { validator: function(n2) {
          var r2 = e2(n2);
          return r2 || y(this._vueTypes_name + " - " + t2), r2;
        } });
      }
      function Y(e2) {
        if (!b(e2))
          throw new TypeError("[VueTypes error]: You must provide an array as argument.");
        var t2 = 'oneOf - value should be one of "' + e2.join('", "') + '".', n2 = e2.reduce(function(e3, t3) {
          if (null != t3) {
            var n3 = t3.constructor;
            -1 === e3.indexOf(n3) && e3.push(n3);
          }
          return e3;
        }, []);
        return T("oneOf", { type: n2.length > 0 ? n2 : void 0, validator: function(n3) {
          var r2 = -1 !== e2.indexOf(n3);
          return r2 || y(t2), r2;
        } });
      }
      function B(e2) {
        if (!b(e2))
          throw new TypeError("[VueTypes error]: You must provide an array as argument");
        for (var t2 = false, n2 = [], r2 = 0; r2 < e2.length; r2 += 1) {
          var i2 = e2[r2];
          if (m(i2)) {
            if (g(i2) && "oneOf" === i2._vueTypes_name) {
              n2 = n2.concat(i2.type);
              continue;
            }
            if (O(i2.validator) && (t2 = true), true !== i2.type && i2.type) {
              n2 = n2.concat(i2.type);
              continue;
            }
          }
          n2.push(i2);
        }
        return n2 = n2.filter(function(e3, t3) {
          return n2.indexOf(e3) === t3;
        }), T("oneOfType", t2 ? { type: n2, validator: function(t3) {
          var n3 = [], r3 = e2.some(function(e3) {
            var r4 = _(g(e3) && "oneOf" === e3._vueTypes_name ? e3.type || null : e3, t3, true);
            return "string" == typeof r4 && n3.push(r4), true === r4;
          });
          return r3 || y("oneOfType - provided value does not match any of the " + n3.length + " passed-in validators:\n" + P(n3.join("\n"))), r3;
        } } : { type: n2 });
      }
      function I(e2) {
        return T("arrayOf", { type: Array, validator: function(t2) {
          var n2, r2 = t2.every(function(t3) {
            return true === (n2 = _(e2, t3, true));
          });
          return r2 || y("arrayOf - value validation error:\n" + P(n2)), r2;
        } });
      }
      function J(e2) {
        return T("instanceOf", { type: e2 });
      }
      function M(e2) {
        return T("objectOf", { type: Object, validator: function(t2) {
          var n2, r2 = Object.keys(t2).every(function(r3) {
            return true === (n2 = _(e2, t2[r3], true));
          });
          return r2 || y("objectOf - value validation error:\n" + P(n2)), r2;
        } });
      }
      function R(e2) {
        var t2 = Object.keys(e2), n2 = t2.filter(function(t3) {
          var n3;
          return !!(null === (n3 = e2[t3]) || void 0 === n3 ? void 0 : n3.required);
        }), r2 = T("shape", { type: Object, validator: function(r3) {
          var i2 = this;
          if (!s(r3))
            return false;
          var o2 = Object.keys(r3);
          if (n2.length > 0 && n2.some(function(e3) {
            return -1 === o2.indexOf(e3);
          })) {
            var u2 = n2.filter(function(e3) {
              return -1 === o2.indexOf(e3);
            });
            return y(1 === u2.length ? 'shape - required property "' + u2[0] + '" is not defined.' : 'shape - required properties "' + u2.join('", "') + '" are not defined.'), false;
          }
          return o2.every(function(n3) {
            if (-1 === t2.indexOf(n3))
              return true === i2._vueTypes_isLoose || (y('shape - shape definition does not include a "' + n3 + '" property. Allowed keys: "' + t2.join('", "') + '".'), false);
            var o3 = _(e2[n3], r3[n3], true);
            return "string" == typeof o3 && y('shape - "' + n3 + '" property validation error:\n ' + P(o3)), true === o3;
          });
        } });
        return Object.defineProperty(r2, "_vueTypes_isLoose", { writable: true, value: false }), Object.defineProperty(r2, "loose", { get: function() {
          return this._vueTypes_isLoose = true, this;
        } }), r2;
      }
      var $ = function() {
        function e2() {
        }
        return e2.extend = function(e3) {
          var t2 = this;
          if (b(e3))
            return e3.forEach(function(e4) {
              return t2.extend(e4);
            }), this;
          var n2 = e3.name, r2 = e3.validate, o2 = void 0 !== r2 && r2, u2 = e3.getter, a2 = void 0 !== u2 && u2, f2 = i$2(e3, ["name", "validate", "getter"]);
          if (d(this, n2))
            throw new TypeError('[VueTypes error]: Type "' + n2 + '" already defined');
          var c2, l2 = f2.type;
          return g(l2) ? (delete f2.type, Object.defineProperty(this, n2, a2 ? { get: function() {
            return k(n2, l2, f2);
          } } : { value: function() {
            var e4, t3 = k(n2, l2, f2);
            return t3.validator && (t3.validator = (e4 = t3.validator).bind.apply(e4, [t3].concat([].slice.call(arguments)))), t3;
          } })) : (c2 = a2 ? { get: function() {
            var e4 = Object.assign({}, f2);
            return o2 ? w(n2, e4) : T(n2, e4);
          }, enumerable: true } : { value: function() {
            var e4, t3, r3 = Object.assign({}, f2);
            return e4 = o2 ? w(n2, r3) : T(n2, r3), r3.validator && (e4.validator = (t3 = r3.validator).bind.apply(t3, [e4].concat([].slice.call(arguments)))), e4;
          }, enumerable: true }, Object.defineProperty(this, n2, c2));
        }, t(e2, null, [{ key: "any", get: function() {
          return x$1();
        } }, { key: "func", get: function() {
          return A().def(this.defaults.func);
        } }, { key: "bool", get: function() {
          return E().def(this.defaults.bool);
        } }, { key: "string", get: function() {
          return N().def(this.defaults.string);
        } }, { key: "number", get: function() {
          return q().def(this.defaults.number);
        } }, { key: "array", get: function() {
          return S().def(this.defaults.array);
        } }, { key: "object", get: function() {
          return V().def(this.defaults.object);
        } }, { key: "integer", get: function() {
          return F().def(this.defaults.integer);
        } }, { key: "symbol", get: function() {
          return D();
        } }]), e2;
      }();
      function z(e2) {
        var i2;
        return void 0 === e2 && (e2 = { func: function() {
        }, bool: true, string: "", number: 0, array: function() {
          return [];
        }, object: function() {
          return {};
        }, integer: 0 }), (i2 = function(i3) {
          function o2() {
            return i3.apply(this, arguments) || this;
          }
          return r(o2, i3), t(o2, null, [{ key: "sensibleDefaults", get: function() {
            return n({}, this.defaults);
          }, set: function(t2) {
            this.defaults = false !== t2 ? n({}, true !== t2 ? t2 : e2) : {};
          } }]), o2;
        }($)).defaults = n({}, e2), i2;
      }
      $.defaults = {}, $.custom = L, $.oneOf = Y, $.instanceOf = J, $.oneOfType = B, $.arrayOf = I, $.objectOf = M, $.shape = R, $.utils = { validate: function(e2, t2) {
        return true === _(t2, e2, true);
      }, toType: function(e2, t2, n2) {
        return void 0 === n2 && (n2 = false), n2 ? w(e2, t2) : T(e2, t2);
      } };
      (function(e2) {
        function t2() {
          return e2.apply(this, arguments) || this;
        }
        return r(t2, e2), t2;
      })(z());
      const PropTypes = z({
        func: void 0,
        bool: void 0,
        string: void 0,
        number: void 0,
        array: void 0,
        object: void 0,
        integer: void 0
      });
      PropTypes.extend([{
        name: "looseBool",
        getter: true,
        type: Boolean,
        default: void 0
      }, {
        name: "style",
        getter: true,
        type: [String, Object],
        default: void 0
      }, {
        name: "VueNode",
        getter: true,
        type: null
      }]);
      const PropTypes$1 = PropTypes;
      function returnEmptyString() {
        return "";
      }
      function returnDocument(element) {
        if (element) {
          return element.ownerDocument;
        }
        return window.document;
      }
      function noop$1() {
      }
      const triggerProps = () => ({
        action: PropTypes$1.oneOfType([PropTypes$1.string, PropTypes$1.arrayOf(PropTypes$1.string)]).def([]),
        showAction: PropTypes$1.any.def([]),
        hideAction: PropTypes$1.any.def([]),
        getPopupClassNameFromAlign: PropTypes$1.any.def(returnEmptyString),
        onPopupVisibleChange: Function,
        afterPopupVisibleChange: PropTypes$1.func.def(noop$1),
        popup: PropTypes$1.any,
        popupStyle: {
          type: Object,
          default: void 0
        },
        prefixCls: PropTypes$1.string.def("rc-trigger-popup"),
        popupClassName: PropTypes$1.string.def(""),
        popupPlacement: String,
        builtinPlacements: PropTypes$1.object,
        popupTransitionName: String,
        popupAnimation: PropTypes$1.any,
        mouseEnterDelay: PropTypes$1.number.def(0),
        mouseLeaveDelay: PropTypes$1.number.def(0.1),
        zIndex: Number,
        focusDelay: PropTypes$1.number.def(0),
        blurDelay: PropTypes$1.number.def(0.15),
        getPopupContainer: Function,
        getDocument: PropTypes$1.func.def(returnDocument),
        forceRender: {
          type: Boolean,
          default: void 0
        },
        destroyPopupOnHide: {
          type: Boolean,
          default: false
        },
        mask: {
          type: Boolean,
          default: false
        },
        maskClosable: {
          type: Boolean,
          default: true
        },
        // onPopupAlign: PropTypes.func.def(noop),
        popupAlign: PropTypes$1.object.def(() => ({})),
        popupVisible: {
          type: Boolean,
          default: void 0
        },
        defaultPopupVisible: {
          type: Boolean,
          default: false
        },
        maskTransitionName: String,
        maskAnimation: String,
        stretch: String,
        alignPoint: {
          type: Boolean,
          default: void 0
        },
        autoDestroy: {
          type: Boolean,
          default: false
        },
        mobile: Object,
        getTriggerDOMNode: Function
      });
      const innerProps = {
        visible: Boolean,
        prefixCls: String,
        zIndex: Number,
        destroyPopupOnHide: Boolean,
        forceRender: Boolean,
        // Legacy Motion
        animation: [String, Object],
        transitionName: String,
        // Measure
        stretch: {
          type: String
        },
        // Align
        align: {
          type: Object
        },
        point: {
          type: Object
        },
        getRootDomNode: {
          type: Function
        },
        getClassNameFromAlign: {
          type: Function
        },
        onMouseenter: {
          type: Function
        },
        onMouseleave: {
          type: Function
        },
        onMousedown: {
          type: Function
        },
        onTouchstart: {
          type: Function
        }
      };
      const mobileProps = _extends(_extends({}, innerProps), {
        mobile: {
          type: Object
        }
      });
      const popupProps = _extends(_extends({}, innerProps), {
        mask: Boolean,
        mobile: {
          type: Object
        },
        maskAnimation: String,
        maskTransitionName: String
      });
      function getMotion$1(_ref) {
        let {
          prefixCls,
          animation,
          transitionName: transitionName2
        } = _ref;
        if (animation) {
          return {
            name: `${prefixCls}-${animation}`
          };
        }
        if (transitionName2) {
          return {
            name: transitionName2
          };
        }
        return {};
      }
      function Mask(props) {
        const {
          prefixCls,
          visible,
          zIndex,
          mask,
          maskAnimation,
          maskTransitionName
        } = props;
        if (!mask) {
          return null;
        }
        let motion = {};
        if (maskTransitionName || maskAnimation) {
          motion = getMotion$1({
            prefixCls,
            transitionName: maskTransitionName,
            animation: maskAnimation
          });
        }
        return vue.createVNode(vue.Transition, _objectSpread2$1({
          "appear": true
        }, motion), {
          default: () => [vue.withDirectives(vue.createVNode("div", {
            "style": {
              zIndex
            },
            "class": `${prefixCls}-mask`
          }, null), [[vue.resolveDirective("if"), visible]])]
        });
      }
      Mask.displayName = "Mask";
      const MobilePopupInner = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "MobilePopupInner",
        inheritAttrs: false,
        props: mobileProps,
        emits: ["mouseenter", "mouseleave", "mousedown", "touchstart", "align"],
        setup(props, _ref) {
          let {
            expose,
            slots
          } = _ref;
          const elementRef = vue.ref();
          expose({
            forceAlign: () => {
            },
            getElement: () => elementRef.value
          });
          return () => {
            var _a2;
            const {
              zIndex,
              visible,
              prefixCls,
              mobile: {
                popupClassName,
                popupStyle,
                popupMotion = {},
                popupRender
              } = {}
            } = props;
            const mergedStyle = _extends({
              zIndex
            }, popupStyle);
            let childNode = flattenChildren((_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots));
            if (childNode.length > 1) {
              childNode = vue.createVNode("div", {
                "class": `${prefixCls}-content`
              }, [childNode]);
            }
            if (popupRender) {
              childNode = popupRender(childNode);
            }
            const mergedClassName = classNames(prefixCls, popupClassName);
            return vue.createVNode(vue.Transition, _objectSpread2$1({
              "ref": elementRef
            }, popupMotion), {
              default: () => [visible ? vue.createVNode("div", {
                "class": mergedClassName,
                "style": mergedStyle
              }, [childNode]) : null]
            });
          };
        }
      });
      var __awaiter$1 = globalThis && globalThis.__awaiter || function(thisArg, _arguments, P2, generator) {
        function adopt(value) {
          return value instanceof P2 ? value : new P2(function(resolve) {
            resolve(value);
          });
        }
        return new (P2 || (P2 = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e2) {
              reject(e2);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e2) {
              reject(e2);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      const StatusQueue = ["measure", "align", null, "motion"];
      const useVisibleStatus = (visible, doMeasure) => {
        const status = vue.shallowRef(null);
        const rafRef = vue.shallowRef();
        const destroyRef = vue.shallowRef(false);
        function setStatus(nextStatus) {
          if (!destroyRef.value) {
            status.value = nextStatus;
          }
        }
        function cancelRaf() {
          wrapperRaf.cancel(rafRef.value);
        }
        function goNextStatus(callback) {
          cancelRaf();
          rafRef.value = wrapperRaf(() => {
            let newStatus = status.value;
            switch (status.value) {
              case "align":
                newStatus = "motion";
                break;
              case "motion":
                newStatus = "stable";
                break;
            }
            setStatus(newStatus);
            callback === null || callback === void 0 ? void 0 : callback();
          });
        }
        vue.watch(visible, () => {
          setStatus("measure");
        }, {
          immediate: true,
          flush: "post"
        });
        vue.onMounted(() => {
          vue.watch(status, () => {
            switch (status.value) {
              case "measure":
                doMeasure();
                break;
            }
            if (status.value) {
              rafRef.value = wrapperRaf(() => __awaiter$1(void 0, void 0, void 0, function* () {
                const index2 = StatusQueue.indexOf(status.value);
                const nextStatus = StatusQueue[index2 + 1];
                if (nextStatus && index2 !== -1) {
                  setStatus(nextStatus);
                }
              }));
            }
          }, {
            immediate: true,
            flush: "post"
          });
        });
        vue.onBeforeUnmount(() => {
          destroyRef.value = true;
          cancelRaf();
        });
        return [status, goNextStatus];
      };
      const useStretchStyle = (stretch) => {
        const targetSize = vue.shallowRef({
          width: 0,
          height: 0
        });
        function measureStretch(element) {
          targetSize.value = {
            width: element.offsetWidth,
            height: element.offsetHeight
          };
        }
        const style = vue.computed(() => {
          const sizeStyle = {};
          if (stretch.value) {
            const {
              width,
              height
            } = targetSize.value;
            if (stretch.value.indexOf("height") !== -1 && height) {
              sizeStyle.height = `${height}px`;
            } else if (stretch.value.indexOf("minHeight") !== -1 && height) {
              sizeStyle.minHeight = `${height}px`;
            }
            if (stretch.value.indexOf("width") !== -1 && width) {
              sizeStyle.width = `${width}px`;
            } else if (stretch.value.indexOf("minWidth") !== -1 && width) {
              sizeStyle.minWidth = `${width}px`;
            }
          }
          return sizeStyle;
        });
        return [style, measureStretch];
      };
      function ownKeys(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread2(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys(Object(source), true).forEach(function(key2) {
            _defineProperty$h(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      function _typeof(obj) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
          return typeof obj2;
        } : function(obj2) {
          return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        }, _typeof(obj);
      }
      function _defineProperty$h(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var vendorPrefix;
      var jsCssMap = {
        Webkit: "-webkit-",
        Moz: "-moz-",
        // IE did it wrong again ...
        ms: "-ms-",
        O: "-o-"
      };
      function getVendorPrefix() {
        if (vendorPrefix !== void 0) {
          return vendorPrefix;
        }
        vendorPrefix = "";
        var style = document.createElement("p").style;
        var testProp = "Transform";
        for (var key2 in jsCssMap) {
          if (key2 + testProp in style) {
            vendorPrefix = key2;
          }
        }
        return vendorPrefix;
      }
      function getTransitionName$1() {
        return getVendorPrefix() ? "".concat(getVendorPrefix(), "TransitionProperty") : "transitionProperty";
      }
      function getTransformName() {
        return getVendorPrefix() ? "".concat(getVendorPrefix(), "Transform") : "transform";
      }
      function setTransitionProperty(node2, value) {
        var name = getTransitionName$1();
        if (name) {
          node2.style[name] = value;
          if (name !== "transitionProperty") {
            node2.style.transitionProperty = value;
          }
        }
      }
      function setTransform(node2, value) {
        var name = getTransformName();
        if (name) {
          node2.style[name] = value;
          if (name !== "transform") {
            node2.style.transform = value;
          }
        }
      }
      function getTransitionProperty(node2) {
        return node2.style.transitionProperty || node2.style[getTransitionName$1()];
      }
      function getTransformXY(node2) {
        var style = window.getComputedStyle(node2, null);
        var transform = style.getPropertyValue("transform") || style.getPropertyValue(getTransformName());
        if (transform && transform !== "none") {
          var matrix = transform.replace(/[^0-9\-.,]/g, "").split(",");
          return {
            x: parseFloat(matrix[12] || matrix[4], 0),
            y: parseFloat(matrix[13] || matrix[5], 0)
          };
        }
        return {
          x: 0,
          y: 0
        };
      }
      var matrix2d = /matrix\((.*)\)/;
      var matrix3d = /matrix3d\((.*)\)/;
      function setTransformXY(node2, xy) {
        var style = window.getComputedStyle(node2, null);
        var transform = style.getPropertyValue("transform") || style.getPropertyValue(getTransformName());
        if (transform && transform !== "none") {
          var arr;
          var match2d = transform.match(matrix2d);
          if (match2d) {
            match2d = match2d[1];
            arr = match2d.split(",").map(function(item) {
              return parseFloat(item, 10);
            });
            arr[4] = xy.x;
            arr[5] = xy.y;
            setTransform(node2, "matrix(".concat(arr.join(","), ")"));
          } else {
            var match3d = transform.match(matrix3d)[1];
            arr = match3d.split(",").map(function(item) {
              return parseFloat(item, 10);
            });
            arr[12] = xy.x;
            arr[13] = xy.y;
            setTransform(node2, "matrix3d(".concat(arr.join(","), ")"));
          }
        } else {
          setTransform(node2, "translateX(".concat(xy.x, "px) translateY(").concat(xy.y, "px) translateZ(0)"));
        }
      }
      var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
      var getComputedStyleX;
      function forceRelayout(elem) {
        var originalStyle = elem.style.display;
        elem.style.display = "none";
        elem.offsetHeight;
        elem.style.display = originalStyle;
      }
      function css(el, name, v2) {
        var value = v2;
        if (_typeof(name) === "object") {
          for (var i2 in name) {
            if (name.hasOwnProperty(i2)) {
              css(el, i2, name[i2]);
            }
          }
          return void 0;
        }
        if (typeof value !== "undefined") {
          if (typeof value === "number") {
            value = "".concat(value, "px");
          }
          el.style[name] = value;
          return void 0;
        }
        return getComputedStyleX(el, name);
      }
      function getClientPosition(elem) {
        var box;
        var x2;
        var y2;
        var doc = elem.ownerDocument;
        var body = doc.body;
        var docElem = doc && doc.documentElement;
        box = elem.getBoundingClientRect();
        x2 = Math.floor(box.left);
        y2 = Math.floor(box.top);
        x2 -= docElem.clientLeft || body.clientLeft || 0;
        y2 -= docElem.clientTop || body.clientTop || 0;
        return {
          left: x2,
          top: y2
        };
      }
      function getScroll(w2, top) {
        var ret = w2["page".concat(top ? "Y" : "X", "Offset")];
        var method = "scroll".concat(top ? "Top" : "Left");
        if (typeof ret !== "number") {
          var d2 = w2.document;
          ret = d2.documentElement[method];
          if (typeof ret !== "number") {
            ret = d2.body[method];
          }
        }
        return ret;
      }
      function getScrollLeft(w2) {
        return getScroll(w2);
      }
      function getScrollTop(w2) {
        return getScroll(w2, true);
      }
      function getOffset$3(el) {
        var pos = getClientPosition(el);
        var doc = el.ownerDocument;
        var w2 = doc.defaultView || doc.parentWindow;
        pos.left += getScrollLeft(w2);
        pos.top += getScrollTop(w2);
        return pos;
      }
      function isWindow(obj) {
        return obj !== null && obj !== void 0 && obj == obj.window;
      }
      function getDocument(node2) {
        if (isWindow(node2)) {
          return node2.document;
        }
        if (node2.nodeType === 9) {
          return node2;
        }
        return node2.ownerDocument;
      }
      function _getComputedStyle(elem, name, cs) {
        var computedStyle = cs;
        var val = "";
        var d2 = getDocument(elem);
        computedStyle = computedStyle || d2.defaultView.getComputedStyle(elem, null);
        if (computedStyle) {
          val = computedStyle.getPropertyValue(name) || computedStyle[name];
        }
        return val;
      }
      var _RE_NUM_NO_PX = new RegExp("^(".concat(RE_NUM, ")(?!px)[a-z%]+$"), "i");
      var RE_POS = /^(top|right|bottom|left)$/;
      var CURRENT_STYLE = "currentStyle";
      var RUNTIME_STYLE = "runtimeStyle";
      var LEFT = "left";
      var PX = "px";
      function _getComputedStyleIE(elem, name) {
        var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];
        if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
          var style = elem.style;
          var left = style[LEFT];
          var rsLeft = elem[RUNTIME_STYLE][LEFT];
          elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];
          style[LEFT] = name === "fontSize" ? "1em" : ret || 0;
          ret = style.pixelLeft + PX;
          style[LEFT] = left;
          elem[RUNTIME_STYLE][LEFT] = rsLeft;
        }
        return ret === "" ? "auto" : ret;
      }
      if (typeof window !== "undefined") {
        getComputedStyleX = window.getComputedStyle ? _getComputedStyle : _getComputedStyleIE;
      }
      function getOffsetDirection(dir, option) {
        if (dir === "left") {
          return option.useCssRight ? "right" : dir;
        }
        return option.useCssBottom ? "bottom" : dir;
      }
      function oppositeOffsetDirection(dir) {
        if (dir === "left") {
          return "right";
        } else if (dir === "right") {
          return "left";
        } else if (dir === "top") {
          return "bottom";
        } else if (dir === "bottom") {
          return "top";
        }
      }
      function setLeftTop(elem, offset, option) {
        if (css(elem, "position") === "static") {
          elem.style.position = "relative";
        }
        var presetH = -999;
        var presetV = -999;
        var horizontalProperty = getOffsetDirection("left", option);
        var verticalProperty = getOffsetDirection("top", option);
        var oppositeHorizontalProperty = oppositeOffsetDirection(horizontalProperty);
        var oppositeVerticalProperty = oppositeOffsetDirection(verticalProperty);
        if (horizontalProperty !== "left") {
          presetH = 999;
        }
        if (verticalProperty !== "top") {
          presetV = 999;
        }
        var originalTransition = "";
        var originalOffset = getOffset$3(elem);
        if ("left" in offset || "top" in offset) {
          originalTransition = getTransitionProperty(elem) || "";
          setTransitionProperty(elem, "none");
        }
        if ("left" in offset) {
          elem.style[oppositeHorizontalProperty] = "";
          elem.style[horizontalProperty] = "".concat(presetH, "px");
        }
        if ("top" in offset) {
          elem.style[oppositeVerticalProperty] = "";
          elem.style[verticalProperty] = "".concat(presetV, "px");
        }
        forceRelayout(elem);
        var old = getOffset$3(elem);
        var originalStyle = {};
        for (var key2 in offset) {
          if (offset.hasOwnProperty(key2)) {
            var dir = getOffsetDirection(key2, option);
            var preset = key2 === "left" ? presetH : presetV;
            var off = originalOffset[key2] - old[key2];
            if (dir === key2) {
              originalStyle[dir] = preset + off;
            } else {
              originalStyle[dir] = preset - off;
            }
          }
        }
        css(elem, originalStyle);
        forceRelayout(elem);
        if ("left" in offset || "top" in offset) {
          setTransitionProperty(elem, originalTransition);
        }
        var ret = {};
        for (var _key in offset) {
          if (offset.hasOwnProperty(_key)) {
            var _dir = getOffsetDirection(_key, option);
            var _off = offset[_key] - originalOffset[_key];
            if (_key === _dir) {
              ret[_dir] = originalStyle[_dir] + _off;
            } else {
              ret[_dir] = originalStyle[_dir] - _off;
            }
          }
        }
        css(elem, ret);
      }
      function setTransform$1(elem, offset) {
        var originalOffset = getOffset$3(elem);
        var originalXY = getTransformXY(elem);
        var resultXY = {
          x: originalXY.x,
          y: originalXY.y
        };
        if ("left" in offset) {
          resultXY.x = originalXY.x + offset.left - originalOffset.left;
        }
        if ("top" in offset) {
          resultXY.y = originalXY.y + offset.top - originalOffset.top;
        }
        setTransformXY(elem, resultXY);
      }
      function setOffset(elem, offset, option) {
        if (option.ignoreShake) {
          var oriOffset = getOffset$3(elem);
          var oLeft = oriOffset.left.toFixed(0);
          var oTop = oriOffset.top.toFixed(0);
          var tLeft = offset.left.toFixed(0);
          var tTop = offset.top.toFixed(0);
          if (oLeft === tLeft && oTop === tTop) {
            return;
          }
        }
        if (option.useCssRight || option.useCssBottom) {
          setLeftTop(elem, offset, option);
        } else if (option.useCssTransform && getTransformName() in document.body.style) {
          setTransform$1(elem, offset);
        } else {
          setLeftTop(elem, offset, option);
        }
      }
      function each(arr, fn) {
        for (var i2 = 0; i2 < arr.length; i2++) {
          fn(arr[i2]);
        }
      }
      function isBorderBoxFn(elem) {
        return getComputedStyleX(elem, "boxSizing") === "border-box";
      }
      var BOX_MODELS = ["margin", "border", "padding"];
      var CONTENT_INDEX = -1;
      var PADDING_INDEX = 2;
      var BORDER_INDEX = 1;
      var MARGIN_INDEX = 0;
      function swap(elem, options, callback) {
        var old = {};
        var style = elem.style;
        var name;
        for (name in options) {
          if (options.hasOwnProperty(name)) {
            old[name] = style[name];
            style[name] = options[name];
          }
        }
        callback.call(elem);
        for (name in options) {
          if (options.hasOwnProperty(name)) {
            style[name] = old[name];
          }
        }
      }
      function getPBMWidth(elem, props, which) {
        var value = 0;
        var prop;
        var j2;
        var i2;
        for (j2 = 0; j2 < props.length; j2++) {
          prop = props[j2];
          if (prop) {
            for (i2 = 0; i2 < which.length; i2++) {
              var cssProp = void 0;
              if (prop === "border") {
                cssProp = "".concat(prop).concat(which[i2], "Width");
              } else {
                cssProp = prop + which[i2];
              }
              value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
            }
          }
        }
        return value;
      }
      var domUtils = {
        getParent: function getParent2(element) {
          var parent = element;
          do {
            if (parent.nodeType === 11 && parent.host) {
              parent = parent.host;
            } else {
              parent = parent.parentNode;
            }
          } while (parent && parent.nodeType !== 1 && parent.nodeType !== 9);
          return parent;
        }
      };
      each(["Width", "Height"], function(name) {
        domUtils["doc".concat(name)] = function(refWin) {
          var d2 = refWin.document;
          return Math.max(
            // firefox chrome documentElement.scrollHeight< body.scrollHeight
            // ie standard mode : documentElement.scrollHeight> body.scrollHeight
            d2.documentElement["scroll".concat(name)],
            // quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
            d2.body["scroll".concat(name)],
            domUtils["viewport".concat(name)](d2)
          );
        };
        domUtils["viewport".concat(name)] = function(win) {
          var prop = "client".concat(name);
          var doc = win.document;
          var body = doc.body;
          var documentElement = doc.documentElement;
          var documentElementProp = documentElement[prop];
          return doc.compatMode === "CSS1Compat" && documentElementProp || body && body[prop] || documentElementProp;
        };
      });
      function getWH(elem, name, ex) {
        var extra = ex;
        if (isWindow(elem)) {
          return name === "width" ? domUtils.viewportWidth(elem) : domUtils.viewportHeight(elem);
        } else if (elem.nodeType === 9) {
          return name === "width" ? domUtils.docWidth(elem) : domUtils.docHeight(elem);
        }
        var which = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"];
        var borderBoxValue = name === "width" ? Math.floor(elem.getBoundingClientRect().width) : Math.floor(elem.getBoundingClientRect().height);
        var isBorderBox = isBorderBoxFn(elem);
        var cssBoxValue = 0;
        if (borderBoxValue === null || borderBoxValue === void 0 || borderBoxValue <= 0) {
          borderBoxValue = void 0;
          cssBoxValue = getComputedStyleX(elem, name);
          if (cssBoxValue === null || cssBoxValue === void 0 || Number(cssBoxValue) < 0) {
            cssBoxValue = elem.style[name] || 0;
          }
          cssBoxValue = Math.floor(parseFloat(cssBoxValue)) || 0;
        }
        if (extra === void 0) {
          extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
        }
        var borderBoxValueOrIsBorderBox = borderBoxValue !== void 0 || isBorderBox;
        var val = borderBoxValue || cssBoxValue;
        if (extra === CONTENT_INDEX) {
          if (borderBoxValueOrIsBorderBox) {
            return val - getPBMWidth(elem, ["border", "padding"], which);
          }
          return cssBoxValue;
        } else if (borderBoxValueOrIsBorderBox) {
          if (extra === BORDER_INDEX) {
            return val;
          }
          return val + (extra === PADDING_INDEX ? -getPBMWidth(elem, ["border"], which) : getPBMWidth(elem, ["margin"], which));
        }
        return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra), which);
      }
      var cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
      };
      function getWHIgnoreDisplay() {
        for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
          args[_key2] = arguments[_key2];
        }
        var val;
        var elem = args[0];
        if (elem.offsetWidth !== 0) {
          val = getWH.apply(void 0, args);
        } else {
          swap(elem, cssShow, function() {
            val = getWH.apply(void 0, args);
          });
        }
        return val;
      }
      each(["width", "height"], function(name) {
        var first = name.charAt(0).toUpperCase() + name.slice(1);
        domUtils["outer".concat(first)] = function(el, includeMargin) {
          return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX);
        };
        var which = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"];
        domUtils[name] = function(elem, v2) {
          var val = v2;
          if (val !== void 0) {
            if (elem) {
              var isBorderBox = isBorderBoxFn(elem);
              if (isBorderBox) {
                val += getPBMWidth(elem, ["padding", "border"], which);
              }
              return css(elem, name, val);
            }
            return void 0;
          }
          return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
        };
      });
      function mix(to, from2) {
        for (var i2 in from2) {
          if (from2.hasOwnProperty(i2)) {
            to[i2] = from2[i2];
          }
        }
        return to;
      }
      var utils = {
        getWindow: function getWindow(node2) {
          if (node2 && node2.document && node2.setTimeout) {
            return node2;
          }
          var doc = node2.ownerDocument || node2;
          return doc.defaultView || doc.parentWindow;
        },
        getDocument,
        offset: function offset(el, value, option) {
          if (typeof value !== "undefined") {
            setOffset(el, value, option || {});
          } else {
            return getOffset$3(el);
          }
        },
        isWindow,
        each,
        css,
        clone: function clone(obj) {
          var i2;
          var ret = {};
          for (i2 in obj) {
            if (obj.hasOwnProperty(i2)) {
              ret[i2] = obj[i2];
            }
          }
          var overflow = obj.overflow;
          if (overflow) {
            for (i2 in obj) {
              if (obj.hasOwnProperty(i2)) {
                ret.overflow[i2] = obj.overflow[i2];
              }
            }
          }
          return ret;
        },
        mix,
        getWindowScrollLeft: function getWindowScrollLeft(w2) {
          return getScrollLeft(w2);
        },
        getWindowScrollTop: function getWindowScrollTop(w2) {
          return getScrollTop(w2);
        },
        merge: function merge2() {
          var ret = {};
          for (var i2 = 0; i2 < arguments.length; i2++) {
            utils.mix(ret, i2 < 0 || arguments.length <= i2 ? void 0 : arguments[i2]);
          }
          return ret;
        },
        viewportWidth: 0,
        viewportHeight: 0
      };
      mix(utils, domUtils);
      var getParent$1 = utils.getParent;
      function getOffsetParent(element) {
        if (utils.isWindow(element) || element.nodeType === 9) {
          return null;
        }
        var doc = utils.getDocument(element);
        var body = doc.body;
        var parent;
        var positionStyle = utils.css(element, "position");
        var skipStatic = positionStyle === "fixed" || positionStyle === "absolute";
        if (!skipStatic) {
          return element.nodeName.toLowerCase() === "html" ? null : getParent$1(element);
        }
        for (parent = getParent$1(element); parent && parent !== body && parent.nodeType !== 9; parent = getParent$1(parent)) {
          positionStyle = utils.css(parent, "position");
          if (positionStyle !== "static") {
            return parent;
          }
        }
        return null;
      }
      var getParent$1$1 = utils.getParent;
      function isAncestorFixed(element) {
        if (utils.isWindow(element) || element.nodeType === 9) {
          return false;
        }
        var doc = utils.getDocument(element);
        var body = doc.body;
        var parent = null;
        for (
          parent = getParent$1$1(element);
          // 修复元素位于 document.documentElement 下导致崩溃问题
          parent && parent !== body && parent !== doc;
          parent = getParent$1$1(parent)
        ) {
          var positionStyle = utils.css(parent, "position");
          if (positionStyle === "fixed") {
            return true;
          }
        }
        return false;
      }
      function getVisibleRectForElement(element, alwaysByViewport) {
        var visibleRect = {
          left: 0,
          right: Infinity,
          top: 0,
          bottom: Infinity
        };
        var el = getOffsetParent(element);
        var doc = utils.getDocument(element);
        var win = doc.defaultView || doc.parentWindow;
        var body = doc.body;
        var documentElement = doc.documentElement;
        while (el) {
          if ((navigator.userAgent.indexOf("MSIE") === -1 || el.clientWidth !== 0) && // body may have overflow set on it, yet we still get the entire
          // viewport. In some browsers, el.offsetParent may be
          // document.documentElement, so check for that too.
          el !== body && el !== documentElement && utils.css(el, "overflow") !== "visible") {
            var pos = utils.offset(el);
            pos.left += el.clientLeft;
            pos.top += el.clientTop;
            visibleRect.top = Math.max(visibleRect.top, pos.top);
            visibleRect.right = Math.min(
              visibleRect.right,
              // consider area without scrollBar
              pos.left + el.clientWidth
            );
            visibleRect.bottom = Math.min(visibleRect.bottom, pos.top + el.clientHeight);
            visibleRect.left = Math.max(visibleRect.left, pos.left);
          } else if (el === body || el === documentElement) {
            break;
          }
          el = getOffsetParent(el);
        }
        var originalPosition = null;
        if (!utils.isWindow(element) && element.nodeType !== 9) {
          originalPosition = element.style.position;
          var position2 = utils.css(element, "position");
          if (position2 === "absolute") {
            element.style.position = "fixed";
          }
        }
        var scrollX = utils.getWindowScrollLeft(win);
        var scrollY = utils.getWindowScrollTop(win);
        var viewportWidth = utils.viewportWidth(win);
        var viewportHeight = utils.viewportHeight(win);
        var documentWidth = documentElement.scrollWidth;
        var documentHeight = documentElement.scrollHeight;
        var bodyStyle = window.getComputedStyle(body);
        if (bodyStyle.overflowX === "hidden") {
          documentWidth = win.innerWidth;
        }
        if (bodyStyle.overflowY === "hidden") {
          documentHeight = win.innerHeight;
        }
        if (element.style) {
          element.style.position = originalPosition;
        }
        if (alwaysByViewport || isAncestorFixed(element)) {
          visibleRect.left = Math.max(visibleRect.left, scrollX);
          visibleRect.top = Math.max(visibleRect.top, scrollY);
          visibleRect.right = Math.min(visibleRect.right, scrollX + viewportWidth);
          visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + viewportHeight);
        } else {
          var maxVisibleWidth = Math.max(documentWidth, scrollX + viewportWidth);
          visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth);
          var maxVisibleHeight = Math.max(documentHeight, scrollY + viewportHeight);
          visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight);
        }
        return visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null;
      }
      function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
        var pos = utils.clone(elFuturePos);
        var size = {
          width: elRegion.width,
          height: elRegion.height
        };
        if (overflow.adjustX && pos.left < visibleRect.left) {
          pos.left = visibleRect.left;
        }
        if (overflow.resizeWidth && pos.left >= visibleRect.left && pos.left + size.width > visibleRect.right) {
          size.width -= pos.left + size.width - visibleRect.right;
        }
        if (overflow.adjustX && pos.left + size.width > visibleRect.right) {
          pos.left = Math.max(visibleRect.right - size.width, visibleRect.left);
        }
        if (overflow.adjustY && pos.top < visibleRect.top) {
          pos.top = visibleRect.top;
        }
        if (overflow.resizeHeight && pos.top >= visibleRect.top && pos.top + size.height > visibleRect.bottom) {
          size.height -= pos.top + size.height - visibleRect.bottom;
        }
        if (overflow.adjustY && pos.top + size.height > visibleRect.bottom) {
          pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top);
        }
        return utils.mix(pos, size);
      }
      function getRegion(node2) {
        var offset;
        var w2;
        var h2;
        if (!utils.isWindow(node2) && node2.nodeType !== 9) {
          offset = utils.offset(node2);
          w2 = utils.outerWidth(node2);
          h2 = utils.outerHeight(node2);
        } else {
          var win = utils.getWindow(node2);
          offset = {
            left: utils.getWindowScrollLeft(win),
            top: utils.getWindowScrollTop(win)
          };
          w2 = utils.viewportWidth(win);
          h2 = utils.viewportHeight(win);
        }
        offset.width = w2;
        offset.height = h2;
        return offset;
      }
      function getAlignOffset(region, align) {
        var V2 = align.charAt(0);
        var H = align.charAt(1);
        var w2 = region.width;
        var h2 = region.height;
        var x2 = region.left;
        var y2 = region.top;
        if (V2 === "c") {
          y2 += h2 / 2;
        } else if (V2 === "b") {
          y2 += h2;
        }
        if (H === "c") {
          x2 += w2 / 2;
        } else if (H === "r") {
          x2 += w2;
        }
        return {
          left: x2,
          top: y2
        };
      }
      function getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset2) {
        var p1 = getAlignOffset(refNodeRegion, points[1]);
        var p2 = getAlignOffset(elRegion, points[0]);
        var diff = [p2.left - p1.left, p2.top - p1.top];
        return {
          left: Math.round(elRegion.left - diff[0] + offset[0] - targetOffset2[0]),
          top: Math.round(elRegion.top - diff[1] + offset[1] - targetOffset2[1])
        };
      }
      function isFailX(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.left < visibleRect.left || elFuturePos.left + elRegion.width > visibleRect.right;
      }
      function isFailY(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.top < visibleRect.top || elFuturePos.top + elRegion.height > visibleRect.bottom;
      }
      function isCompleteFailX(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.left > visibleRect.right || elFuturePos.left + elRegion.width < visibleRect.left;
      }
      function isCompleteFailY(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.top > visibleRect.bottom || elFuturePos.top + elRegion.height < visibleRect.top;
      }
      function flip(points, reg, map) {
        var ret = [];
        utils.each(points, function(p) {
          ret.push(p.replace(reg, function(m2) {
            return map[m2];
          }));
        });
        return ret;
      }
      function flipOffset(offset, index2) {
        offset[index2] = -offset[index2];
        return offset;
      }
      function convertOffset(str, offsetLen) {
        var n2;
        if (/%$/.test(str)) {
          n2 = parseInt(str.substring(0, str.length - 1), 10) / 100 * offsetLen;
        } else {
          n2 = parseInt(str, 10);
        }
        return n2 || 0;
      }
      function normalizeOffset(offset, el) {
        offset[0] = convertOffset(offset[0], el.width);
        offset[1] = convertOffset(offset[1], el.height);
      }
      function doAlign(el, tgtRegion, align, isTgtRegionVisible) {
        var points = align.points;
        var offset = align.offset || [0, 0];
        var targetOffset2 = align.targetOffset || [0, 0];
        var overflow = align.overflow;
        var source = align.source || el;
        offset = [].concat(offset);
        targetOffset2 = [].concat(targetOffset2);
        overflow = overflow || {};
        var newOverflowCfg = {};
        var fail = 0;
        var alwaysByViewport = !!(overflow && overflow.alwaysByViewport);
        var visibleRect = getVisibleRectForElement(source, alwaysByViewport);
        var elRegion = getRegion(source);
        normalizeOffset(offset, elRegion);
        normalizeOffset(targetOffset2, tgtRegion);
        var elFuturePos = getElFuturePos(elRegion, tgtRegion, points, offset, targetOffset2);
        var newElRegion = utils.merge(elRegion, elFuturePos);
        if (visibleRect && (overflow.adjustX || overflow.adjustY) && isTgtRegionVisible) {
          if (overflow.adjustX) {
            if (isFailX(elFuturePos, elRegion, visibleRect)) {
              var newPoints = flip(points, /[lr]/gi, {
                l: "r",
                r: "l"
              });
              var newOffset = flipOffset(offset, 0);
              var newTargetOffset = flipOffset(targetOffset2, 0);
              var newElFuturePos = getElFuturePos(elRegion, tgtRegion, newPoints, newOffset, newTargetOffset);
              if (!isCompleteFailX(newElFuturePos, elRegion, visibleRect)) {
                fail = 1;
                points = newPoints;
                offset = newOffset;
                targetOffset2 = newTargetOffset;
              }
            }
          }
          if (overflow.adjustY) {
            if (isFailY(elFuturePos, elRegion, visibleRect)) {
              var _newPoints = flip(points, /[tb]/gi, {
                t: "b",
                b: "t"
              });
              var _newOffset = flipOffset(offset, 1);
              var _newTargetOffset = flipOffset(targetOffset2, 1);
              var _newElFuturePos = getElFuturePos(elRegion, tgtRegion, _newPoints, _newOffset, _newTargetOffset);
              if (!isCompleteFailY(_newElFuturePos, elRegion, visibleRect)) {
                fail = 1;
                points = _newPoints;
                offset = _newOffset;
                targetOffset2 = _newTargetOffset;
              }
            }
          }
          if (fail) {
            elFuturePos = getElFuturePos(elRegion, tgtRegion, points, offset, targetOffset2);
            utils.mix(newElRegion, elFuturePos);
          }
          var isStillFailX = isFailX(elFuturePos, elRegion, visibleRect);
          var isStillFailY = isFailY(elFuturePos, elRegion, visibleRect);
          if (isStillFailX || isStillFailY) {
            var _newPoints2 = points;
            if (isStillFailX) {
              _newPoints2 = flip(points, /[lr]/gi, {
                l: "r",
                r: "l"
              });
            }
            if (isStillFailY) {
              _newPoints2 = flip(points, /[tb]/gi, {
                t: "b",
                b: "t"
              });
            }
            points = _newPoints2;
            offset = align.offset || [0, 0];
            targetOffset2 = align.targetOffset || [0, 0];
          }
          newOverflowCfg.adjustX = overflow.adjustX && isStillFailX;
          newOverflowCfg.adjustY = overflow.adjustY && isStillFailY;
          if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
            newElRegion = adjustForViewport(elFuturePos, elRegion, visibleRect, newOverflowCfg);
          }
        }
        if (newElRegion.width !== elRegion.width) {
          utils.css(source, "width", utils.width(source) + newElRegion.width - elRegion.width);
        }
        if (newElRegion.height !== elRegion.height) {
          utils.css(source, "height", utils.height(source) + newElRegion.height - elRegion.height);
        }
        utils.offset(source, {
          left: newElRegion.left,
          top: newElRegion.top
        }, {
          useCssRight: align.useCssRight,
          useCssBottom: align.useCssBottom,
          useCssTransform: align.useCssTransform,
          ignoreShake: align.ignoreShake
        });
        return {
          points,
          offset,
          targetOffset: targetOffset2,
          overflow: newOverflowCfg
        };
      }
      function isOutOfVisibleRect(target, alwaysByViewport) {
        var visibleRect = getVisibleRectForElement(target, alwaysByViewport);
        var targetRegion = getRegion(target);
        return !visibleRect || targetRegion.left + targetRegion.width <= visibleRect.left || targetRegion.top + targetRegion.height <= visibleRect.top || targetRegion.left >= visibleRect.right || targetRegion.top >= visibleRect.bottom;
      }
      function alignElement(el, refNode, align) {
        var target = align.target || refNode;
        var refNodeRegion = getRegion(target);
        var isTargetNotOutOfVisible = !isOutOfVisibleRect(target, align.overflow && align.overflow.alwaysByViewport);
        return doAlign(el, refNodeRegion, align, isTargetNotOutOfVisible);
      }
      alignElement.__getOffsetParent = getOffsetParent;
      alignElement.__getVisibleRectForElement = getVisibleRectForElement;
      function alignPoint(el, tgtPoint, align) {
        var pageX;
        var pageY;
        var doc = utils.getDocument(el);
        var win = doc.defaultView || doc.parentWindow;
        var scrollX = utils.getWindowScrollLeft(win);
        var scrollY = utils.getWindowScrollTop(win);
        var viewportWidth = utils.viewportWidth(win);
        var viewportHeight = utils.viewportHeight(win);
        if ("pageX" in tgtPoint) {
          pageX = tgtPoint.pageX;
        } else {
          pageX = scrollX + tgtPoint.clientX;
        }
        if ("pageY" in tgtPoint) {
          pageY = tgtPoint.pageY;
        } else {
          pageY = scrollY + tgtPoint.clientY;
        }
        var tgtRegion = {
          left: pageX,
          top: pageY,
          width: 0,
          height: 0
        };
        var pointInView = pageX >= 0 && pageX <= scrollX + viewportWidth && pageY >= 0 && pageY <= scrollY + viewportHeight;
        var points = [align.points[0], "cc"];
        return doAlign(el, tgtRegion, _objectSpread2(_objectSpread2({}, align), {}, {
          points
        }), pointInView);
      }
      function cloneElement(vnode) {
        let nodeProps = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let override = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
        let mergeRef = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        let ele = vnode;
        if (Array.isArray(vnode)) {
          ele = filterEmpty(vnode)[0];
        }
        if (!ele) {
          return null;
        }
        const node2 = vue.cloneVNode(ele, nodeProps, mergeRef);
        node2.props = override ? _extends(_extends({}, node2.props), nodeProps) : node2.props;
        warning$2(typeof node2.props.class !== "object");
        return node2;
      }
      const isVisible = (element) => {
        if (!element) {
          return false;
        }
        if (element.offsetParent) {
          return true;
        }
        if (element.getBBox) {
          const box = element.getBBox();
          if (box.width || box.height) {
            return true;
          }
        }
        if (element.getBoundingClientRect) {
          const box = element.getBoundingClientRect();
          if (box.width || box.height) {
            return true;
          }
        }
        return false;
      };
      function isSamePoint(prev2, next2) {
        if (prev2 === next2)
          return true;
        if (!prev2 || !next2)
          return false;
        if ("pageX" in next2 && "pageY" in next2) {
          return prev2.pageX === next2.pageX && prev2.pageY === next2.pageY;
        }
        if ("clientX" in next2 && "clientY" in next2) {
          return prev2.clientX === next2.clientX && prev2.clientY === next2.clientY;
        }
        return false;
      }
      function restoreFocus(activeElement, container) {
        if (activeElement !== document.activeElement && contains$1(container, activeElement) && typeof activeElement.focus === "function") {
          activeElement.focus();
        }
      }
      function monitorResize(element, callback) {
        let prevWidth = null;
        let prevHeight = null;
        function onResize(_ref) {
          let [{
            target
          }] = _ref;
          if (!document.documentElement.contains(target))
            return;
          const {
            width,
            height
          } = target.getBoundingClientRect();
          const fixedWidth = Math.floor(width);
          const fixedHeight = Math.floor(height);
          if (prevWidth !== fixedWidth || prevHeight !== fixedHeight) {
            Promise.resolve().then(() => {
              callback({
                width: fixedWidth,
                height: fixedHeight
              });
            });
          }
          prevWidth = fixedWidth;
          prevHeight = fixedHeight;
        }
        const resizeObserver = new index(onResize);
        if (element) {
          resizeObserver.observe(element);
        }
        return () => {
          resizeObserver.disconnect();
        };
      }
      const useBuffer = (callback, buffer) => {
        let called = false;
        let timeout = null;
        function cancelTrigger() {
          clearTimeout(timeout);
        }
        function trigger(force) {
          if (!called || force === true) {
            if (callback() === false) {
              return;
            }
            called = true;
            cancelTrigger();
            timeout = setTimeout(() => {
              called = false;
            }, buffer.value);
          } else {
            cancelTrigger();
            timeout = setTimeout(() => {
              called = false;
              trigger();
            }, buffer.value);
          }
        }
        return [trigger, () => {
          called = false;
          cancelTrigger();
        }];
      };
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      function assocIndexOf(array, key2) {
        var length2 = array.length;
        while (length2--) {
          if (eq(array[length2][0], key2)) {
            return length2;
          }
        }
        return -1;
      }
      var arrayProto = Array.prototype;
      var splice = arrayProto.splice;
      function listCacheDelete(key2) {
        var data = this.__data__, index2 = assocIndexOf(data, key2);
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
      function listCacheGet(key2) {
        var data = this.__data__, index2 = assocIndexOf(data, key2);
        return index2 < 0 ? void 0 : data[index2][1];
      }
      function listCacheHas(key2) {
        return assocIndexOf(this.__data__, key2) > -1;
      }
      function listCacheSet(key2, value) {
        var data = this.__data__, index2 = assocIndexOf(data, key2);
        if (index2 < 0) {
          ++this.size;
          data.push([key2, value]);
        } else {
          data[index2][1] = value;
        }
        return this;
      }
      function ListCache(entries) {
        var index2 = -1, length2 = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length2) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key2) {
        var data = this.__data__, result = data["delete"](key2);
        this.size = data.size;
        return result;
      }
      function stackGet(key2) {
        return this.__data__.get(key2);
      }
      function stackHas(key2) {
        return this.__data__.has(key2);
      }
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      const freeGlobal$1 = freeGlobal;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal$1 || freeSelf || Function("return this")();
      const root$1 = root;
      var Symbol$1 = root$1.Symbol;
      const Symbol$2 = Symbol$1;
      var objectProto$b = Object.prototype;
      var hasOwnProperty$8 = objectProto$b.hasOwnProperty;
      var nativeObjectToString$1 = objectProto$b.toString;
      var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty$8.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
      var objectProto$a = Object.prototype;
      var nativeObjectToString = objectProto$a.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      function isObject$1(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      var asyncTag = "[object AsyncFunction]", funcTag$1 = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
      function isFunction(value) {
        if (!isObject$1(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      var coreJsData = root$1["__core-js_shared__"];
      const coreJsData$1 = coreJsData;
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var funcProto$1 = Function.prototype;
      var funcToString$1 = funcProto$1.toString;
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString$1.call(func);
          } catch (e2) {
          }
          try {
            return func + "";
          } catch (e2) {
          }
        }
        return "";
      }
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var funcProto = Function.prototype, objectProto$9 = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty$7).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject$1(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function getValue(object, key2) {
        return object == null ? void 0 : object[key2];
      }
      function getNative(object, key2) {
        var value = getValue(object, key2);
        return baseIsNative(value) ? value : void 0;
      }
      var Map$1 = getNative(root$1, "Map");
      const Map$2 = Map$1;
      var nativeCreate = getNative(Object, "create");
      const nativeCreate$1 = nativeCreate;
      function hashClear() {
        this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
        this.size = 0;
      }
      function hashDelete(key2) {
        var result = this.has(key2) && delete this.__data__[key2];
        this.size -= result ? 1 : 0;
        return result;
      }
      var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
      var objectProto$8 = Object.prototype;
      var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
      function hashGet(key2) {
        var data = this.__data__;
        if (nativeCreate$1) {
          var result = data[key2];
          return result === HASH_UNDEFINED$2 ? void 0 : result;
        }
        return hasOwnProperty$6.call(data, key2) ? data[key2] : void 0;
      }
      var objectProto$7 = Object.prototype;
      var hasOwnProperty$5 = objectProto$7.hasOwnProperty;
      function hashHas(key2) {
        var data = this.__data__;
        return nativeCreate$1 ? data[key2] !== void 0 : hasOwnProperty$5.call(data, key2);
      }
      var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
      function hashSet(key2, value) {
        var data = this.__data__;
        this.size += this.has(key2) ? 0 : 1;
        data[key2] = nativeCreate$1 && value === void 0 ? HASH_UNDEFINED$1 : value;
        return this;
      }
      function Hash(entries) {
        var index2 = -1, length2 = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length2) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map$2 || ListCache)(),
          "string": new Hash()
        };
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function getMapData(map, key2) {
        var data = map.__data__;
        return isKeyable(key2) ? data[typeof key2 == "string" ? "string" : "hash"] : data.map;
      }
      function mapCacheDelete(key2) {
        var result = getMapData(this, key2)["delete"](key2);
        this.size -= result ? 1 : 0;
        return result;
      }
      function mapCacheGet(key2) {
        return getMapData(this, key2).get(key2);
      }
      function mapCacheHas(key2) {
        return getMapData(this, key2).has(key2);
      }
      function mapCacheSet(key2, value) {
        var data = getMapData(this, key2), size = data.size;
        data.set(key2, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      function MapCache(entries) {
        var index2 = -1, length2 = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length2) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      var LARGE_ARRAY_SIZE = 200;
      function stackSet(key2, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map$2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key2, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key2, value);
        this.size = data.size;
        return this;
      }
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      function SetCache(values) {
        var index2 = -1, length2 = values == null ? 0 : values.length;
        this.__data__ = new MapCache();
        while (++index2 < length2) {
          this.add(values[index2]);
        }
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function arraySome(array, predicate) {
        var index2 = -1, length2 = array == null ? 0 : array.length;
        while (++index2 < length2) {
          if (predicate(array[index2], index2, array)) {
            return true;
          }
        }
        return false;
      }
      function cacheHas(cache, key2) {
        return cache.has(key2);
      }
      var COMPARE_PARTIAL_FLAG$3 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index2 = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$1 ? new SetCache() : void 0;
        stack.set(array, other);
        stack.set(other, array);
        while (++index2 < arrLength) {
          var arrValue = array[index2], othValue = other[index2];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
          }
          if (compared !== void 0) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
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
      var Uint8Array$1 = root$1.Uint8Array;
      const Uint8Array$2 = Uint8Array$1;
      function mapToArray(map) {
        var index2 = -1, result = Array(map.size);
        map.forEach(function(value, key2) {
          result[++index2] = [key2, value];
        });
        return result;
      }
      function setToArray(set) {
        var index2 = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index2] = value;
        });
        return result;
      }
      var COMPARE_PARTIAL_FLAG$2 = 1, COMPARE_UNORDERED_FLAG = 2;
      var boolTag$1 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", mapTag$2 = "[object Map]", numberTag$1 = "[object Number]", regexpTag$1 = "[object RegExp]", setTag$2 = "[object Set]", stringTag$1 = "[object String]", symbolTag = "[object Symbol]";
      var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]";
      var symbolProto = Symbol$2 ? Symbol$2.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag$2:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag$1:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$2(object), new Uint8Array$2(other))) {
              return false;
            }
            return true;
          case boolTag$1:
          case dateTag$1:
          case numberTag$1:
            return eq(+object, +other);
          case errorTag$1:
            return object.name == other.name && object.message == other.message;
          case regexpTag$1:
          case stringTag$1:
            return object == other + "";
          case mapTag$2:
            var convert = mapToArray;
          case setTag$2:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2;
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
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      function arrayPush(array, values) {
        var index2 = -1, length2 = values.length, offset = array.length;
        while (++index2 < length2) {
          array[offset + index2] = values[index2];
        }
        return array;
      }
      var isArray = Array.isArray;
      const isArray$1 = isArray;
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
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
      function stubArray() {
        return [];
      }
      var objectProto$6 = Object.prototype;
      var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;
      var nativeGetSymbols = Object.getOwnPropertySymbols;
      var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable$1.call(object, symbol);
        });
      };
      const getSymbols$1 = getSymbols;
      function baseTimes(n2, iteratee) {
        var index2 = -1, result = Array(n2);
        while (++index2 < n2) {
          result[index2] = iteratee(index2);
        }
        return result;
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var argsTag$2 = "[object Arguments]";
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag$2;
      }
      var objectProto$5 = Object.prototype;
      var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
      var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
      var isArguments = baseIsArguments(function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty$4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
      };
      const isArguments$1 = isArguments;
      function stubFalse() {
        return false;
      }
      var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
      var Buffer$1 = moduleExports$1 ? root$1.Buffer : void 0;
      var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
      var isBuffer = nativeIsBuffer || stubFalse;
      const isBuffer$1 = isBuffer;
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length2) {
        var type = typeof value;
        length2 = length2 == null ? MAX_SAFE_INTEGER$1 : length2;
        return !!length2 && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length2);
      }
      var MAX_SAFE_INTEGER = 9007199254740991;
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag$1 = "[object Map]", numberTag = "[object Number]", objectTag$2 = "[object Object]", regexpTag = "[object RegExp]", setTag$1 = "[object Set]", stringTag = "[object String]", weakMapTag$1 = "[object WeakMap]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag] = typedArrayTags[setTag$1] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag$1] = false;
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal$1.process;
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
      const nodeUtil$1 = nodeUtil;
      var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      const isTypedArray$1 = isTypedArray;
      var objectProto$4 = Object.prototype;
      var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length2 = result.length;
        for (var key2 in value) {
          if ((inherited || hasOwnProperty$3.call(value, key2)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
          (key2 == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          isBuff && (key2 == "offset" || key2 == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          isType && (key2 == "buffer" || key2 == "byteLength" || key2 == "byteOffset") || // Skip index properties.
          isIndex(key2, length2)))) {
            result.push(key2);
          }
        }
        return result;
      }
      var objectProto$3 = Object.prototype;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$3;
        return value === proto;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      var nativeKeys = overArg(Object.keys, Object);
      const nativeKeys$1 = nativeKeys;
      var objectProto$2 = Object.prototype;
      var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys$1(object);
        }
        var result = [];
        for (var key2 in Object(object)) {
          if (hasOwnProperty$2.call(object, key2) && key2 != "constructor") {
            result.push(key2);
          }
        }
        return result;
      }
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols$1);
      }
      var COMPARE_PARTIAL_FLAG$1 = 1;
      var objectProto$1 = Object.prototype;
      var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index2 = objLength;
        while (index2--) {
          var key2 = objProps[index2];
          if (!(isPartial ? key2 in other : hasOwnProperty$1.call(other, key2))) {
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
        while (++index2 < objLength) {
          key2 = objProps[index2];
          var objValue = object[key2], othValue = other[key2];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key2, other, object, stack) : customizer(objValue, othValue, key2, object, other, stack);
          }
          if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key2 == "constructor");
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
      var DataView$1 = getNative(root$1, "DataView");
      const DataView$2 = DataView$1;
      var Promise$1 = getNative(root$1, "Promise");
      const Promise$2 = Promise$1;
      var Set$1 = getNative(root$1, "Set");
      const Set$2 = Set$1;
      var WeakMap$1 = getNative(root$1, "WeakMap");
      const WeakMap$2 = WeakMap$1;
      var mapTag = "[object Map]", objectTag$1 = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
      var dataViewTag = "[object DataView]";
      var dataViewCtorString = toSource(DataView$2), mapCtorString = toSource(Map$2), promiseCtorString = toSource(Promise$2), setCtorString = toSource(Set$2), weakMapCtorString = toSource(WeakMap$2);
      var getTag = baseGetTag;
      if (DataView$2 && getTag(new DataView$2(new ArrayBuffer(1))) != dataViewTag || Map$2 && getTag(new Map$2()) != mapTag || Promise$2 && getTag(Promise$2.resolve()) != promiseTag || Set$2 && getTag(new Set$2()) != setTag || WeakMap$2 && getTag(new WeakMap$2()) != weakMapTag) {
        getTag = function(value) {
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
      const getTag$1 = getTag;
      var COMPARE_PARTIAL_FLAG = 1;
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
      var objectProto = Object.prototype;
      var hasOwnProperty = objectProto.hasOwnProperty;
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray$1(object), othIsArr = isArray$1(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer$1(object)) {
          if (!isBuffer$1(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray$1(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
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
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      const alignProps = {
        align: Object,
        target: [Object, Function],
        onAlign: Function,
        monitorBufferTime: Number,
        monitorWindowResize: Boolean,
        disabled: Boolean
      };
      function getElement(func) {
        if (typeof func !== "function")
          return null;
        return func();
      }
      function getPoint(point) {
        if (typeof point !== "object" || !point)
          return null;
        return point;
      }
      const Align = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "Align",
        props: alignProps,
        emits: ["align"],
        setup(props, _ref) {
          let {
            expose,
            slots
          } = _ref;
          const cacheRef = vue.ref({});
          const nodeRef = vue.ref();
          const [forceAlign, cancelForceAlign] = useBuffer(() => {
            const {
              disabled: latestDisabled,
              target: latestTarget,
              align: latestAlign,
              onAlign: latestOnAlign
            } = props;
            if (!latestDisabled && latestTarget && nodeRef.value) {
              const source = nodeRef.value;
              let result;
              const element = getElement(latestTarget);
              const point = getPoint(latestTarget);
              cacheRef.value.element = element;
              cacheRef.value.point = point;
              cacheRef.value.align = latestAlign;
              const {
                activeElement
              } = document;
              if (element && isVisible(element)) {
                result = alignElement(source, element, latestAlign);
              } else if (point) {
                result = alignPoint(source, point, latestAlign);
              }
              restoreFocus(activeElement, source);
              if (latestOnAlign && result) {
                latestOnAlign(source, result);
              }
              return true;
            }
            return false;
          }, vue.computed(() => props.monitorBufferTime));
          const resizeMonitor = vue.ref({
            cancel: () => {
            }
          });
          const sourceResizeMonitor = vue.ref({
            cancel: () => {
            }
          });
          const goAlign = () => {
            const target = props.target;
            const element = getElement(target);
            const point = getPoint(target);
            if (nodeRef.value !== sourceResizeMonitor.value.element) {
              sourceResizeMonitor.value.cancel();
              sourceResizeMonitor.value.element = nodeRef.value;
              sourceResizeMonitor.value.cancel = monitorResize(nodeRef.value, forceAlign);
            }
            if (cacheRef.value.element !== element || !isSamePoint(cacheRef.value.point, point) || !isEqual(cacheRef.value.align, props.align)) {
              forceAlign();
              if (resizeMonitor.value.element !== element) {
                resizeMonitor.value.cancel();
                resizeMonitor.value.element = element;
                resizeMonitor.value.cancel = monitorResize(element, forceAlign);
              }
            }
          };
          vue.onMounted(() => {
            vue.nextTick(() => {
              goAlign();
            });
          });
          vue.onUpdated(() => {
            vue.nextTick(() => {
              goAlign();
            });
          });
          vue.watch(() => props.disabled, (disabled) => {
            if (!disabled) {
              forceAlign();
            } else {
              cancelForceAlign();
            }
          }, {
            immediate: true,
            flush: "post"
          });
          const winResizeRef = vue.ref(null);
          vue.watch(() => props.monitorWindowResize, (monitorWindowResize) => {
            if (monitorWindowResize) {
              if (!winResizeRef.value) {
                winResizeRef.value = addEventListenerWrap(window, "resize", forceAlign);
              }
            } else if (winResizeRef.value) {
              winResizeRef.value.remove();
              winResizeRef.value = null;
            }
          }, {
            flush: "post"
          });
          vue.onUnmounted(() => {
            resizeMonitor.value.cancel();
            sourceResizeMonitor.value.cancel();
            if (winResizeRef.value)
              winResizeRef.value.remove();
            cancelForceAlign();
          });
          expose({
            forceAlign: () => forceAlign(true)
          });
          return () => {
            const child = slots === null || slots === void 0 ? void 0 : slots.default();
            if (child) {
              return cloneElement(child[0], {
                ref: nodeRef
              }, true, true);
            }
            return null;
          };
        }
      });
      tuple("bottomLeft", "bottomRight", "topLeft", "topRight");
      const getTransitionProps = function(transitionName2) {
        let opt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const transitionProps = transitionName2 ? _extends({
          name: transitionName2,
          appear: true,
          // type: 'animation',
          // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
          // appearActiveClass: `antdv-base-transtion`,
          // appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
          enterFromClass: `${transitionName2}-enter ${transitionName2}-enter-prepare ${transitionName2}-enter-start`,
          enterActiveClass: `${transitionName2}-enter ${transitionName2}-enter-prepare`,
          enterToClass: `${transitionName2}-enter ${transitionName2}-enter-active`,
          leaveFromClass: ` ${transitionName2}-leave`,
          leaveActiveClass: `${transitionName2}-leave ${transitionName2}-leave-active`,
          leaveToClass: `${transitionName2}-leave ${transitionName2}-leave-active`
        }, opt) : _extends({
          css: false
        }, opt);
        return transitionProps;
      };
      const getTransitionGroupProps = function(transitionName2) {
        let opt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const transitionProps = transitionName2 ? _extends({
          name: transitionName2,
          appear: true,
          // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
          appearActiveClass: `${transitionName2}`,
          appearToClass: `${transitionName2}-appear ${transitionName2}-appear-active`,
          enterFromClass: `${transitionName2}-appear ${transitionName2}-enter ${transitionName2}-appear-prepare ${transitionName2}-enter-prepare`,
          enterActiveClass: `${transitionName2}`,
          enterToClass: `${transitionName2}-enter ${transitionName2}-appear ${transitionName2}-appear-active ${transitionName2}-enter-active`,
          leaveActiveClass: `${transitionName2} ${transitionName2}-leave`,
          leaveToClass: `${transitionName2}-leave-active`
        }, opt) : _extends({
          css: false
        }, opt);
        return transitionProps;
      };
      const getTransitionName = (rootPrefixCls, motion, transitionName2) => {
        if (transitionName2 !== void 0) {
          return transitionName2;
        }
        return `${rootPrefixCls}-${motion}`;
      };
      const PopupInner = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "PopupInner",
        inheritAttrs: false,
        props: innerProps,
        emits: ["mouseenter", "mouseleave", "mousedown", "touchstart", "align"],
        setup(props, _ref) {
          let {
            expose,
            attrs,
            slots
          } = _ref;
          const alignRef = vue.shallowRef();
          const elementRef = vue.shallowRef();
          const alignedClassName = vue.shallowRef();
          const [stretchStyle, measureStretchStyle] = useStretchStyle(vue.toRef(props, "stretch"));
          const doMeasure = () => {
            if (props.stretch) {
              measureStretchStyle(props.getRootDomNode());
            }
          };
          const visible = vue.shallowRef(false);
          let timeoutId;
          vue.watch(() => props.visible, (val) => {
            clearTimeout(timeoutId);
            if (val) {
              timeoutId = setTimeout(() => {
                visible.value = props.visible;
              });
            } else {
              visible.value = false;
            }
          }, {
            immediate: true
          });
          const [status, goNextStatus] = useVisibleStatus(visible, doMeasure);
          const prepareResolveRef = vue.shallowRef();
          const getAlignTarget = () => {
            if (props.point) {
              return props.point;
            }
            return props.getRootDomNode;
          };
          const forceAlign = () => {
            var _a2;
            (_a2 = alignRef.value) === null || _a2 === void 0 ? void 0 : _a2.forceAlign();
          };
          const onInternalAlign = (popupDomNode, matchAlign) => {
            var _a2;
            const nextAlignedClassName = props.getClassNameFromAlign(matchAlign);
            const preAlignedClassName = alignedClassName.value;
            if (alignedClassName.value !== nextAlignedClassName) {
              alignedClassName.value = nextAlignedClassName;
            }
            if (status.value === "align") {
              if (preAlignedClassName !== nextAlignedClassName) {
                Promise.resolve().then(() => {
                  forceAlign();
                });
              } else {
                goNextStatus(() => {
                  var _a3;
                  (_a3 = prepareResolveRef.value) === null || _a3 === void 0 ? void 0 : _a3.call(prepareResolveRef);
                });
              }
              (_a2 = props.onAlign) === null || _a2 === void 0 ? void 0 : _a2.call(props, popupDomNode, matchAlign);
            }
          };
          const motion = vue.computed(() => {
            const m2 = typeof props.animation === "object" ? props.animation : getMotion$1(props);
            ["onAfterEnter", "onAfterLeave"].forEach((eventName) => {
              const originFn = m2[eventName];
              m2[eventName] = (node2) => {
                goNextStatus();
                status.value = "stable";
                originFn === null || originFn === void 0 ? void 0 : originFn(node2);
              };
            });
            return m2;
          });
          const onShowPrepare = () => {
            return new Promise((resolve) => {
              prepareResolveRef.value = resolve;
            });
          };
          vue.watch([motion, status], () => {
            if (!motion.value && status.value === "motion") {
              goNextStatus();
            }
          }, {
            immediate: true
          });
          expose({
            forceAlign,
            getElement: () => {
              return elementRef.value.$el || elementRef.value;
            }
          });
          const alignDisabled = vue.computed(() => {
            var _a2;
            if (((_a2 = props.align) === null || _a2 === void 0 ? void 0 : _a2.points) && (status.value === "align" || status.value === "stable")) {
              return false;
            }
            return true;
          });
          return () => {
            var _a2;
            const {
              zIndex,
              align,
              prefixCls,
              destroyPopupOnHide,
              onMouseenter,
              onMouseleave,
              onTouchstart = () => {
              },
              onMousedown
            } = props;
            const statusValue = status.value;
            const mergedStyle = [_extends(_extends({}, stretchStyle.value), {
              zIndex,
              opacity: statusValue === "motion" || statusValue === "stable" || !visible.value ? null : 0,
              // pointerEvents: statusValue === 'stable' ? null : 'none',
              pointerEvents: !visible.value && statusValue !== "stable" ? "none" : null
            }), attrs.style];
            let childNode = flattenChildren((_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots, {
              visible: props.visible
            }));
            if (childNode.length > 1) {
              childNode = vue.createVNode("div", {
                "class": `${prefixCls}-content`
              }, [childNode]);
            }
            const mergedClassName = classNames(prefixCls, attrs.class, alignedClassName.value);
            const hasAnimate = visible.value || !props.visible;
            const transitionProps = hasAnimate ? getTransitionProps(motion.value.name, motion.value) : {};
            return vue.createVNode(vue.Transition, _objectSpread2$1(_objectSpread2$1({
              "ref": elementRef
            }, transitionProps), {}, {
              "onBeforeEnter": onShowPrepare
            }), {
              default: () => {
                return !destroyPopupOnHide || props.visible ? vue.withDirectives(vue.createVNode(Align, {
                  "target": getAlignTarget(),
                  "key": "popup",
                  "ref": alignRef,
                  "monitorWindowResize": true,
                  "disabled": alignDisabled.value,
                  "align": align,
                  "onAlign": onInternalAlign
                }, {
                  default: () => vue.createVNode("div", {
                    "class": mergedClassName,
                    "onMouseenter": onMouseenter,
                    "onMouseleave": onMouseleave,
                    "onMousedown": vue.withModifiers(onMousedown, ["capture"]),
                    [supportsPassive$1 ? "onTouchstartPassive" : "onTouchstart"]: vue.withModifiers(onTouchstart, ["capture"]),
                    "style": mergedStyle
                  }, [childNode])
                }), [[vue.vShow, visible.value]]) : null;
              }
            });
          };
        }
      });
      const Popup = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "Popup",
        inheritAttrs: false,
        props: popupProps,
        setup(props, _ref) {
          let {
            attrs,
            slots,
            expose
          } = _ref;
          const innerVisible = vue.shallowRef(false);
          const inMobile = vue.shallowRef(false);
          const popupRef = vue.shallowRef();
          const rootRef = vue.shallowRef();
          vue.watch([() => props.visible, () => props.mobile], () => {
            innerVisible.value = props.visible;
            if (props.visible && props.mobile) {
              inMobile.value = true;
            }
          }, {
            immediate: true,
            flush: "post"
          });
          expose({
            forceAlign: () => {
              var _a2;
              (_a2 = popupRef.value) === null || _a2 === void 0 ? void 0 : _a2.forceAlign();
            },
            getElement: () => {
              var _a2;
              return (_a2 = popupRef.value) === null || _a2 === void 0 ? void 0 : _a2.getElement();
            }
          });
          return () => {
            const cloneProps = _extends(_extends(_extends({}, props), attrs), {
              visible: innerVisible.value
            });
            const popupNode = inMobile.value ? vue.createVNode(MobilePopupInner, _objectSpread2$1(_objectSpread2$1({}, cloneProps), {}, {
              "mobile": props.mobile,
              "ref": popupRef
            }), {
              default: slots.default
            }) : vue.createVNode(PopupInner, _objectSpread2$1(_objectSpread2$1({}, cloneProps), {}, {
              "ref": popupRef
            }), {
              default: slots.default
            });
            return vue.createVNode("div", {
              "ref": rootRef
            }, [vue.createVNode(Mask, cloneProps, null), popupNode]);
          };
        }
      });
      function isPointsEq(a1, a2, isAlignPoint) {
        if (isAlignPoint) {
          return a1[0] === a2[0];
        }
        return a1[0] === a2[0] && a1[1] === a2[1];
      }
      function getAlignFromPlacement(builtinPlacements, placementStr, align) {
        const baseAlign = builtinPlacements[placementStr] || {};
        return _extends(_extends({}, baseAlign), align);
      }
      function getAlignPopupClassName(builtinPlacements, prefixCls, align, isAlignPoint) {
        const {
          points
        } = align;
        const placements2 = Object.keys(builtinPlacements);
        for (let i2 = 0; i2 < placements2.length; i2 += 1) {
          const placement = placements2[i2];
          if (isPointsEq(builtinPlacements[placement].points, points, isAlignPoint)) {
            return `${prefixCls}-placement-${placement}`;
          }
        }
        return "";
      }
      const BaseMixin = {
        methods: {
          setState() {
            let state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            let callback = arguments.length > 1 ? arguments[1] : void 0;
            let newState = typeof state === "function" ? state(this.$data, this.$props) : state;
            if (this.getDerivedStateFromProps) {
              const s2 = this.getDerivedStateFromProps(getOptionProps(this), _extends(_extends({}, this.$data), newState));
              if (s2 === null) {
                return;
              } else {
                newState = _extends(_extends({}, newState), s2 || {});
              }
            }
            _extends(this.$data, newState);
            if (this._.isMounted) {
              this.$forceUpdate();
            }
            vue.nextTick(() => {
              callback && callback();
            });
          },
          __emit() {
            const args = [].slice.call(arguments, 0);
            let eventName = args[0];
            eventName = `on${eventName[0].toUpperCase()}${eventName.substring(1)}`;
            const event = this.$props[eventName] || this.$attrs[eventName];
            if (args.length && event) {
              if (Array.isArray(event)) {
                for (let i2 = 0, l2 = event.length; i2 < l2; i2++) {
                  event[i2](...args.slice(1));
                }
              } else {
                event(...args.slice(1));
              }
            }
          }
        }
      };
      const PortalContextKey = Symbol("PortalContextKey");
      const useProvidePortal = function(instance) {
        let config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
          inTriggerContext: true
        };
        vue.provide(PortalContextKey, {
          inTriggerContext: config.inTriggerContext,
          shouldRender: vue.computed(() => {
            const {
              sPopupVisible,
              popupRef,
              forceRender,
              autoDestroy
            } = instance || {};
            let shouldRender = false;
            if (sPopupVisible || popupRef || forceRender) {
              shouldRender = true;
            }
            if (!sPopupVisible && autoDestroy) {
              shouldRender = false;
            }
            return shouldRender;
          })
        });
      };
      const useInjectPortal = () => {
        useProvidePortal({}, {
          inTriggerContext: false
        });
        const portalContext = vue.inject(PortalContextKey, {
          shouldRender: vue.computed(() => false),
          inTriggerContext: false
        });
        return {
          shouldRender: vue.computed(() => portalContext.shouldRender.value || portalContext.inTriggerContext === false)
        };
      };
      const Portal$1 = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "Portal",
        inheritAttrs: false,
        props: {
          getContainer: PropTypes$1.func.isRequired,
          didUpdate: Function
        },
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          let isSSR = true;
          let container;
          const {
            shouldRender
          } = useInjectPortal();
          function setContainer() {
            if (shouldRender.value) {
              container = props.getContainer();
            }
          }
          vue.onBeforeMount(() => {
            isSSR = false;
            setContainer();
          });
          vue.onMounted(() => {
            if (container)
              return;
            setContainer();
          });
          const stopWatch = vue.watch(shouldRender, () => {
            if (shouldRender.value && !container) {
              container = props.getContainer();
            }
            if (container) {
              stopWatch();
            }
          });
          vue.onUpdated(() => {
            vue.nextTick(() => {
              var _a2;
              if (shouldRender.value) {
                (_a2 = props.didUpdate) === null || _a2 === void 0 ? void 0 : _a2.call(props, props);
              }
            });
          });
          return () => {
            var _a2;
            if (!shouldRender.value)
              return null;
            if (isSSR) {
              return (_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots);
            }
            return container ? vue.createVNode(vue.Teleport, {
              "to": container
            }, slots) : null;
          };
        }
      });
      let cached;
      function getScrollBarSize(fresh) {
        if (typeof document === "undefined") {
          return 0;
        }
        if (fresh || cached === void 0) {
          const inner = document.createElement("div");
          inner.style.width = "100%";
          inner.style.height = "200px";
          const outer = document.createElement("div");
          const outerStyle = outer.style;
          outerStyle.position = "absolute";
          outerStyle.top = "0";
          outerStyle.left = "0";
          outerStyle.pointerEvents = "none";
          outerStyle.visibility = "hidden";
          outerStyle.width = "200px";
          outerStyle.height = "150px";
          outerStyle.overflow = "hidden";
          outer.appendChild(inner);
          document.body.appendChild(outer);
          const widthContained = inner.offsetWidth;
          outer.style.overflow = "scroll";
          let widthScroll = inner.offsetWidth;
          if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
          }
          document.body.removeChild(outer);
          cached = widthContained - widthScroll;
        }
        return cached;
      }
      const UNIQUE_ID = `vc-util-locker-${Date.now()}`;
      let uuid = 0;
      function isBodyOverflowing() {
        return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
      }
      function useScrollLocker(lock) {
        const mergedLock = vue.computed(() => !!lock && !!lock.value);
        uuid += 1;
        const id = `${UNIQUE_ID}_${uuid}`;
        vue.watchEffect((onClear) => {
          if (!canUseDom$1()) {
            return;
          }
          if (mergedLock.value) {
            const scrollbarSize = getScrollBarSize();
            const isOverflow = isBodyOverflowing();
            updateCSS$1(`
html body {
  overflow-y: hidden;
  ${isOverflow ? `width: calc(100% - ${scrollbarSize}px);` : ""}
}`, id);
          } else {
            removeCSS(id);
          }
          onClear(() => {
            removeCSS(id);
          });
        }, {
          flush: "post"
        });
      }
      let openCount = 0;
      const supportDom = canUseDom$1();
      const getParent = (getContainer2) => {
        if (!supportDom) {
          return null;
        }
        if (getContainer2) {
          if (typeof getContainer2 === "string") {
            return document.querySelectorAll(getContainer2)[0];
          }
          if (typeof getContainer2 === "function") {
            return getContainer2();
          }
          if (typeof getContainer2 === "object" && getContainer2 instanceof window.HTMLElement) {
            return getContainer2;
          }
        }
        return document.body;
      };
      const Portal = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "PortalWrapper",
        inheritAttrs: false,
        props: {
          wrapperClassName: String,
          forceRender: {
            type: Boolean,
            default: void 0
          },
          getContainer: PropTypes$1.any,
          visible: {
            type: Boolean,
            default: void 0
          },
          autoLock: booleanType(),
          didUpdate: Function
        },
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          const container = vue.shallowRef();
          const componentRef = vue.shallowRef();
          const rafId = vue.shallowRef();
          const defaultContainer = canUseDom$1() && document.createElement("div");
          const removeCurrentContainer = () => {
            var _a2, _b2;
            if (container.value === defaultContainer) {
              (_b2 = (_a2 = container.value) === null || _a2 === void 0 ? void 0 : _a2.parentNode) === null || _b2 === void 0 ? void 0 : _b2.removeChild(container.value);
            }
            container.value = null;
          };
          let parent = null;
          const attachToParent = function() {
            let force = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
            if (force || container.value && !container.value.parentNode) {
              parent = getParent(props.getContainer);
              if (parent) {
                parent.appendChild(container.value);
                return true;
              }
              return false;
            }
            return true;
          };
          const getContainer2 = () => {
            if (!supportDom) {
              return null;
            }
            if (!container.value) {
              container.value = defaultContainer;
              attachToParent(true);
            }
            setWrapperClassName();
            return container.value;
          };
          const setWrapperClassName = () => {
            const {
              wrapperClassName
            } = props;
            if (container.value && wrapperClassName && wrapperClassName !== container.value.className) {
              container.value.className = wrapperClassName;
            }
          };
          vue.onUpdated(() => {
            setWrapperClassName();
            attachToParent();
          });
          const instance = vue.getCurrentInstance();
          useScrollLocker(vue.computed(() => {
            return props.autoLock && props.visible && canUseDom$1() && (container.value === document.body || container.value === defaultContainer);
          }));
          vue.onMounted(() => {
            let init = false;
            vue.watch([() => props.visible, () => props.getContainer], (_ref2, _ref3) => {
              let [visible, getContainer3] = _ref2;
              let [prevVisible, prevGetContainer] = _ref3;
              if (supportDom) {
                parent = getParent(props.getContainer);
                if (parent === document.body) {
                  if (visible && !prevVisible) {
                    openCount += 1;
                  } else if (init) {
                    openCount -= 1;
                  }
                }
              }
              if (init) {
                const getContainerIsFunc = typeof getContainer3 === "function" && typeof prevGetContainer === "function";
                if (getContainerIsFunc ? getContainer3.toString() !== prevGetContainer.toString() : getContainer3 !== prevGetContainer) {
                  removeCurrentContainer();
                }
              }
              init = true;
            }, {
              immediate: true,
              flush: "post"
            });
            vue.nextTick(() => {
              if (!attachToParent()) {
                rafId.value = wrapperRaf(() => {
                  instance.update();
                });
              }
            });
          });
          vue.onBeforeUnmount(() => {
            const {
              visible
            } = props;
            if (supportDom && parent === document.body) {
              openCount = visible && openCount ? openCount - 1 : openCount;
            }
            removeCurrentContainer();
            wrapperRaf.cancel(rafId.value);
          });
          return () => {
            const {
              forceRender,
              visible
            } = props;
            let portal = null;
            const childProps = {
              getOpenCount: () => openCount,
              getContainer: getContainer2
            };
            if (forceRender || visible || componentRef.value) {
              portal = vue.createVNode(Portal$1, {
                "getContainer": getContainer2,
                "ref": componentRef,
                "didUpdate": props.didUpdate
              }, {
                default: () => {
                  var _a2;
                  return (_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots, childProps);
                }
              });
            }
            return portal;
          };
        }
      });
      const ALL_HANDLERS = ["onClick", "onMousedown", "onTouchstart", "onMouseenter", "onMouseleave", "onFocus", "onBlur", "onContextmenu"];
      const Trigger = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "Trigger",
        mixins: [BaseMixin],
        inheritAttrs: false,
        props: triggerProps(),
        setup(props) {
          const align = vue.computed(() => {
            const {
              popupPlacement,
              popupAlign,
              builtinPlacements
            } = props;
            if (popupPlacement && builtinPlacements) {
              return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
            }
            return popupAlign;
          });
          const popupRef = vue.shallowRef(null);
          const setPopupRef = (val) => {
            popupRef.value = val;
          };
          return {
            vcTriggerContext: vue.inject("vcTriggerContext", {}),
            popupRef,
            setPopupRef,
            triggerRef: vue.shallowRef(null),
            align,
            focusTime: null,
            clickOutsideHandler: null,
            contextmenuOutsideHandler1: null,
            contextmenuOutsideHandler2: null,
            touchOutsideHandler: null,
            attachId: null,
            delayTimer: null,
            hasPopupMouseDown: false,
            preClickTime: null,
            preTouchTime: null,
            mouseDownTimeout: null,
            childOriginEvents: {}
          };
        },
        data() {
          const props = this.$props;
          let popupVisible;
          if (this.popupVisible !== void 0) {
            popupVisible = !!props.popupVisible;
          } else {
            popupVisible = !!props.defaultPopupVisible;
          }
          ALL_HANDLERS.forEach((h2) => {
            this[`fire${h2}`] = (e2) => {
              this.fireEvents(h2, e2);
            };
          });
          return {
            prevPopupVisible: popupVisible,
            sPopupVisible: popupVisible,
            point: null
          };
        },
        watch: {
          popupVisible(val) {
            if (val !== void 0) {
              this.prevPopupVisible = this.sPopupVisible;
              this.sPopupVisible = val;
            }
          }
        },
        created() {
          vue.provide("vcTriggerContext", {
            onPopupMouseDown: this.onPopupMouseDown,
            onPopupMouseenter: this.onPopupMouseenter,
            onPopupMouseleave: this.onPopupMouseleave
          });
          useProvidePortal(this);
        },
        deactivated() {
          this.setPopupVisible(false);
        },
        mounted() {
          this.$nextTick(() => {
            this.updatedCal();
          });
        },
        updated() {
          this.$nextTick(() => {
            this.updatedCal();
          });
        },
        beforeUnmount() {
          this.clearDelayTimer();
          this.clearOutsideHandler();
          clearTimeout(this.mouseDownTimeout);
          wrapperRaf.cancel(this.attachId);
        },
        methods: {
          updatedCal() {
            const props = this.$props;
            const state = this.$data;
            if (state.sPopupVisible) {
              let currentDocument;
              if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextmenuToShow())) {
                currentDocument = props.getDocument(this.getRootDomNode());
                this.clickOutsideHandler = addEventListenerWrap(currentDocument, "mousedown", this.onDocumentClick);
              }
              if (!this.touchOutsideHandler) {
                currentDocument = currentDocument || props.getDocument(this.getRootDomNode());
                this.touchOutsideHandler = addEventListenerWrap(currentDocument, "touchstart", this.onDocumentClick, supportsPassive$1 ? {
                  passive: false
                } : false);
              }
              if (!this.contextmenuOutsideHandler1 && this.isContextmenuToShow()) {
                currentDocument = currentDocument || props.getDocument(this.getRootDomNode());
                this.contextmenuOutsideHandler1 = addEventListenerWrap(currentDocument, "scroll", this.onContextmenuClose);
              }
              if (!this.contextmenuOutsideHandler2 && this.isContextmenuToShow()) {
                this.contextmenuOutsideHandler2 = addEventListenerWrap(window, "blur", this.onContextmenuClose);
              }
            } else {
              this.clearOutsideHandler();
            }
          },
          onMouseenter(e2) {
            const {
              mouseEnterDelay
            } = this.$props;
            this.fireEvents("onMouseenter", e2);
            this.delaySetPopupVisible(true, mouseEnterDelay, mouseEnterDelay ? null : e2);
          },
          onMouseMove(e2) {
            this.fireEvents("onMousemove", e2);
            this.setPoint(e2);
          },
          onMouseleave(e2) {
            this.fireEvents("onMouseleave", e2);
            this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
          },
          onPopupMouseenter() {
            const {
              vcTriggerContext = {}
            } = this;
            if (vcTriggerContext.onPopupMouseenter) {
              vcTriggerContext.onPopupMouseenter();
            }
            this.clearDelayTimer();
          },
          onPopupMouseleave(e2) {
            var _a2;
            if (e2 && e2.relatedTarget && !e2.relatedTarget.setTimeout && contains$1((_a2 = this.popupRef) === null || _a2 === void 0 ? void 0 : _a2.getElement(), e2.relatedTarget)) {
              return;
            }
            this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
            const {
              vcTriggerContext = {}
            } = this;
            if (vcTriggerContext.onPopupMouseleave) {
              vcTriggerContext.onPopupMouseleave(e2);
            }
          },
          onFocus(e2) {
            this.fireEvents("onFocus", e2);
            this.clearDelayTimer();
            if (this.isFocusToShow()) {
              this.focusTime = Date.now();
              this.delaySetPopupVisible(true, this.$props.focusDelay);
            }
          },
          onMousedown(e2) {
            this.fireEvents("onMousedown", e2);
            this.preClickTime = Date.now();
          },
          onTouchstart(e2) {
            this.fireEvents("onTouchstart", e2);
            this.preTouchTime = Date.now();
          },
          onBlur(e2) {
            if (!contains$1(e2.target, e2.relatedTarget || document.activeElement)) {
              this.fireEvents("onBlur", e2);
              this.clearDelayTimer();
              if (this.isBlurToHide()) {
                this.delaySetPopupVisible(false, this.$props.blurDelay);
              }
            }
          },
          onContextmenu(e2) {
            e2.preventDefault();
            this.fireEvents("onContextmenu", e2);
            this.setPopupVisible(true, e2);
          },
          onContextmenuClose() {
            if (this.isContextmenuToShow()) {
              this.close();
            }
          },
          onClick(event) {
            this.fireEvents("onClick", event);
            if (this.focusTime) {
              let preTime;
              if (this.preClickTime && this.preTouchTime) {
                preTime = Math.min(this.preClickTime, this.preTouchTime);
              } else if (this.preClickTime) {
                preTime = this.preClickTime;
              } else if (this.preTouchTime) {
                preTime = this.preTouchTime;
              }
              if (Math.abs(preTime - this.focusTime) < 20) {
                return;
              }
              this.focusTime = 0;
            }
            this.preClickTime = 0;
            this.preTouchTime = 0;
            if (this.isClickToShow() && (this.isClickToHide() || this.isBlurToHide()) && event && event.preventDefault) {
              event.preventDefault();
            }
            if (event && event.domEvent) {
              event.domEvent.preventDefault();
            }
            const nextVisible = !this.$data.sPopupVisible;
            if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
              this.setPopupVisible(!this.$data.sPopupVisible, event);
            }
          },
          onPopupMouseDown() {
            const {
              vcTriggerContext = {}
            } = this;
            this.hasPopupMouseDown = true;
            clearTimeout(this.mouseDownTimeout);
            this.mouseDownTimeout = setTimeout(() => {
              this.hasPopupMouseDown = false;
            }, 0);
            if (vcTriggerContext.onPopupMouseDown) {
              vcTriggerContext.onPopupMouseDown(...arguments);
            }
          },
          onDocumentClick(event) {
            if (this.$props.mask && !this.$props.maskClosable) {
              return;
            }
            const target = event.target;
            const root2 = this.getRootDomNode();
            const popupNode = this.getPopupDomNode();
            if (
              // mousedown on the target should also close popup when action is contextMenu.
              // https://github.com/ant-design/ant-design/issues/29853
              (!contains$1(root2, target) || this.isContextMenuOnly()) && !contains$1(popupNode, target) && !this.hasPopupMouseDown
            ) {
              this.delaySetPopupVisible(false, 0.1);
            }
          },
          getPopupDomNode() {
            var _a2;
            return ((_a2 = this.popupRef) === null || _a2 === void 0 ? void 0 : _a2.getElement()) || null;
          },
          getRootDomNode() {
            var _a2, _b2, _c, _d;
            const {
              getTriggerDOMNode
            } = this.$props;
            if (getTriggerDOMNode) {
              const domNode = ((_b2 = (_a2 = this.triggerRef) === null || _a2 === void 0 ? void 0 : _a2.$el) === null || _b2 === void 0 ? void 0 : _b2.nodeName) === "#comment" ? null : findDOMNode(this.triggerRef);
              return findDOMNode(getTriggerDOMNode(domNode));
            }
            try {
              const domNode = ((_d = (_c = this.triggerRef) === null || _c === void 0 ? void 0 : _c.$el) === null || _d === void 0 ? void 0 : _d.nodeName) === "#comment" ? null : findDOMNode(this.triggerRef);
              if (domNode) {
                return domNode;
              }
            } catch (err) {
            }
            return findDOMNode(this);
          },
          handleGetPopupClassFromAlign(align) {
            const className = [];
            const props = this.$props;
            const {
              popupPlacement,
              builtinPlacements,
              prefixCls,
              alignPoint: alignPoint2,
              getPopupClassNameFromAlign
            } = props;
            if (popupPlacement && builtinPlacements) {
              className.push(getAlignPopupClassName(builtinPlacements, prefixCls, align, alignPoint2));
            }
            if (getPopupClassNameFromAlign) {
              className.push(getPopupClassNameFromAlign(align));
            }
            return className.join(" ");
          },
          getPopupAlign() {
            const props = this.$props;
            const {
              popupPlacement,
              popupAlign,
              builtinPlacements
            } = props;
            if (popupPlacement && builtinPlacements) {
              return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
            }
            return popupAlign;
          },
          getComponent() {
            const mouseProps = {};
            if (this.isMouseEnterToShow()) {
              mouseProps.onMouseenter = this.onPopupMouseenter;
            }
            if (this.isMouseLeaveToHide()) {
              mouseProps.onMouseleave = this.onPopupMouseleave;
            }
            mouseProps.onMousedown = this.onPopupMouseDown;
            mouseProps[supportsPassive$1 ? "onTouchstartPassive" : "onTouchstart"] = this.onPopupMouseDown;
            const {
              handleGetPopupClassFromAlign,
              getRootDomNode,
              $attrs
            } = this;
            const {
              prefixCls,
              destroyPopupOnHide,
              popupClassName,
              popupAnimation,
              popupTransitionName,
              popupStyle,
              mask,
              maskAnimation,
              maskTransitionName,
              zIndex,
              stretch,
              alignPoint: alignPoint2,
              mobile,
              forceRender
            } = this.$props;
            const {
              sPopupVisible,
              point
            } = this.$data;
            const popupProps2 = _extends(_extends({
              prefixCls,
              destroyPopupOnHide,
              visible: sPopupVisible,
              point: alignPoint2 ? point : null,
              align: this.align,
              animation: popupAnimation,
              getClassNameFromAlign: handleGetPopupClassFromAlign,
              stretch,
              getRootDomNode,
              mask,
              zIndex,
              transitionName: popupTransitionName,
              maskAnimation,
              maskTransitionName,
              class: popupClassName,
              style: popupStyle,
              onAlign: $attrs.onPopupAlign || noop$1
            }, mouseProps), {
              ref: this.setPopupRef,
              mobile,
              forceRender
            });
            return vue.createVNode(Popup, popupProps2, {
              default: this.$slots.popup || (() => getComponent(this, "popup"))
            });
          },
          attachParent(popupContainer) {
            wrapperRaf.cancel(this.attachId);
            const {
              getPopupContainer,
              getDocument: getDocument2
            } = this.$props;
            const domNode = this.getRootDomNode();
            let mountNode;
            if (!getPopupContainer) {
              mountNode = getDocument2(this.getRootDomNode()).body;
            } else if (domNode || getPopupContainer.length === 0) {
              mountNode = getPopupContainer(domNode);
            }
            if (mountNode) {
              mountNode.appendChild(popupContainer);
            } else {
              this.attachId = wrapperRaf(() => {
                this.attachParent(popupContainer);
              });
            }
          },
          getContainer() {
            const {
              $props: props
            } = this;
            const {
              getDocument: getDocument2
            } = props;
            const popupContainer = getDocument2(this.getRootDomNode()).createElement("div");
            popupContainer.style.position = "absolute";
            popupContainer.style.top = "0";
            popupContainer.style.left = "0";
            popupContainer.style.width = "100%";
            this.attachParent(popupContainer);
            return popupContainer;
          },
          setPopupVisible(sPopupVisible, event) {
            const {
              alignPoint: alignPoint2,
              sPopupVisible: prevPopupVisible,
              onPopupVisibleChange
            } = this;
            this.clearDelayTimer();
            if (prevPopupVisible !== sPopupVisible) {
              if (!hasProp(this, "popupVisible")) {
                this.setState({
                  sPopupVisible,
                  prevPopupVisible
                });
              }
              onPopupVisibleChange && onPopupVisibleChange(sPopupVisible);
            }
            if (alignPoint2 && event && sPopupVisible) {
              this.setPoint(event);
            }
          },
          setPoint(point) {
            const {
              alignPoint: alignPoint2
            } = this.$props;
            if (!alignPoint2 || !point)
              return;
            this.setState({
              point: {
                pageX: point.pageX,
                pageY: point.pageY
              }
            });
          },
          handlePortalUpdate() {
            if (this.prevPopupVisible !== this.sPopupVisible) {
              this.afterPopupVisibleChange(this.sPopupVisible);
            }
          },
          delaySetPopupVisible(visible, delayS, event) {
            const delay = delayS * 1e3;
            this.clearDelayTimer();
            if (delay) {
              const point = event ? {
                pageX: event.pageX,
                pageY: event.pageY
              } : null;
              this.delayTimer = setTimeout(() => {
                this.setPopupVisible(visible, point);
                this.clearDelayTimer();
              }, delay);
            } else {
              this.setPopupVisible(visible, event);
            }
          },
          clearDelayTimer() {
            if (this.delayTimer) {
              clearTimeout(this.delayTimer);
              this.delayTimer = null;
            }
          },
          clearOutsideHandler() {
            if (this.clickOutsideHandler) {
              this.clickOutsideHandler.remove();
              this.clickOutsideHandler = null;
            }
            if (this.contextmenuOutsideHandler1) {
              this.contextmenuOutsideHandler1.remove();
              this.contextmenuOutsideHandler1 = null;
            }
            if (this.contextmenuOutsideHandler2) {
              this.contextmenuOutsideHandler2.remove();
              this.contextmenuOutsideHandler2 = null;
            }
            if (this.touchOutsideHandler) {
              this.touchOutsideHandler.remove();
              this.touchOutsideHandler = null;
            }
          },
          createTwoChains(event) {
            let fn = () => {
            };
            const events = getEvents(this);
            if (this.childOriginEvents[event] && events[event]) {
              return this[`fire${event}`];
            }
            fn = this.childOriginEvents[event] || events[event] || fn;
            return fn;
          },
          isClickToShow() {
            const {
              action,
              showAction
            } = this.$props;
            return action.indexOf("click") !== -1 || showAction.indexOf("click") !== -1;
          },
          isContextMenuOnly() {
            const {
              action
            } = this.$props;
            return action === "contextmenu" || action.length === 1 && action[0] === "contextmenu";
          },
          isContextmenuToShow() {
            const {
              action,
              showAction
            } = this.$props;
            return action.indexOf("contextmenu") !== -1 || showAction.indexOf("contextmenu") !== -1;
          },
          isClickToHide() {
            const {
              action,
              hideAction
            } = this.$props;
            return action.indexOf("click") !== -1 || hideAction.indexOf("click") !== -1;
          },
          isMouseEnterToShow() {
            const {
              action,
              showAction
            } = this.$props;
            return action.indexOf("hover") !== -1 || showAction.indexOf("mouseenter") !== -1;
          },
          isMouseLeaveToHide() {
            const {
              action,
              hideAction
            } = this.$props;
            return action.indexOf("hover") !== -1 || hideAction.indexOf("mouseleave") !== -1;
          },
          isFocusToShow() {
            const {
              action,
              showAction
            } = this.$props;
            return action.indexOf("focus") !== -1 || showAction.indexOf("focus") !== -1;
          },
          isBlurToHide() {
            const {
              action,
              hideAction
            } = this.$props;
            return action.indexOf("focus") !== -1 || hideAction.indexOf("blur") !== -1;
          },
          forcePopupAlign() {
            var _a2;
            if (this.$data.sPopupVisible) {
              (_a2 = this.popupRef) === null || _a2 === void 0 ? void 0 : _a2.forceAlign();
            }
          },
          fireEvents(type, e2) {
            if (this.childOriginEvents[type]) {
              this.childOriginEvents[type](e2);
            }
            const event = this.$props[type] || this.$attrs[type];
            if (event) {
              event(e2);
            }
          },
          close() {
            this.setPopupVisible(false);
          }
        },
        render() {
          const {
            $attrs
          } = this;
          const children = filterEmpty(getSlot(this));
          const {
            alignPoint: alignPoint2,
            getPopupContainer
          } = this.$props;
          const child = children[0];
          this.childOriginEvents = getEvents(child);
          const newChildProps = {
            key: "trigger"
          };
          if (this.isContextmenuToShow()) {
            newChildProps.onContextmenu = this.onContextmenu;
          } else {
            newChildProps.onContextmenu = this.createTwoChains("onContextmenu");
          }
          if (this.isClickToHide() || this.isClickToShow()) {
            newChildProps.onClick = this.onClick;
            newChildProps.onMousedown = this.onMousedown;
            newChildProps[supportsPassive$1 ? "onTouchstartPassive" : "onTouchstart"] = this.onTouchstart;
          } else {
            newChildProps.onClick = this.createTwoChains("onClick");
            newChildProps.onMousedown = this.createTwoChains("onMousedown");
            newChildProps[supportsPassive$1 ? "onTouchstartPassive" : "onTouchstart"] = this.createTwoChains("onTouchstart");
          }
          if (this.isMouseEnterToShow()) {
            newChildProps.onMouseenter = this.onMouseenter;
            if (alignPoint2) {
              newChildProps.onMousemove = this.onMouseMove;
            }
          } else {
            newChildProps.onMouseenter = this.createTwoChains("onMouseenter");
          }
          if (this.isMouseLeaveToHide()) {
            newChildProps.onMouseleave = this.onMouseleave;
          } else {
            newChildProps.onMouseleave = this.createTwoChains("onMouseleave");
          }
          if (this.isFocusToShow() || this.isBlurToHide()) {
            newChildProps.onFocus = this.onFocus;
            newChildProps.onBlur = this.onBlur;
          } else {
            newChildProps.onFocus = this.createTwoChains("onFocus");
            newChildProps.onBlur = (e2) => {
              if (e2 && (!e2.relatedTarget || !contains$1(e2.target, e2.relatedTarget))) {
                this.createTwoChains("onBlur")(e2);
              }
            };
          }
          const childrenClassName = classNames(child && child.props && child.props.class, $attrs.class);
          if (childrenClassName) {
            newChildProps.class = childrenClassName;
          }
          const trigger = cloneElement(child, _extends(_extends({}, newChildProps), {
            ref: "triggerRef"
          }), true, true);
          const portal = vue.createVNode(Portal, {
            "key": "portal",
            "getContainer": getPopupContainer && (() => getPopupContainer(this.getRootDomNode())),
            "didUpdate": this.handlePortalUpdate,
            "visible": this.$data.sPopupVisible
          }, {
            default: this.getComponent
          });
          return vue.createVNode(vue.Fragment, null, [trigger, portal]);
        }
      });
      function useMergedState(defaultStateValue, option) {
        const {
          defaultValue,
          value = vue.ref()
        } = option || {};
        let initValue = typeof defaultStateValue === "function" ? defaultStateValue() : defaultStateValue;
        if (value.value !== void 0) {
          initValue = vue.unref(value);
        }
        if (defaultValue !== void 0) {
          initValue = typeof defaultValue === "function" ? defaultValue() : defaultValue;
        }
        const innerValue = vue.ref(initValue);
        const mergedValue = vue.ref(initValue);
        vue.watchEffect(() => {
          let val = value.value !== void 0 ? value.value : innerValue.value;
          if (option.postState) {
            val = option.postState(val);
          }
          mergedValue.value = val;
        });
        function triggerChange(newValue) {
          const preVal = mergedValue.value;
          innerValue.value = newValue;
          if (vue.toRaw(mergedValue.value) !== newValue && option.onChange) {
            option.onChange(newValue, preVal);
          }
        }
        vue.watch(value, () => {
          innerValue.value = value.value;
        });
        return [mergedValue, triggerChange];
      }
      var contextKey$1 = Symbol("iconContext");
      var useInjectIconContext = function useInjectIconContext2() {
        return vue.inject(contextKey$1, {
          prefixCls: vue.ref("anticon"),
          rootClassName: vue.ref(""),
          csp: vue.ref()
        });
      };
      function canUseDom() {
        return !!(typeof window !== "undefined" && window.document && window.document.createElement);
      }
      function contains(root2, n2) {
        if (!root2) {
          return false;
        }
        if (root2.contains) {
          return root2.contains(n2);
        }
        return false;
      }
      var APPEND_ORDER = "data-vc-order";
      var MARK_KEY = "vc-icon-key";
      var containerCache = /* @__PURE__ */ new Map();
      function getMark() {
        var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, mark = _ref.mark;
        if (mark) {
          return mark.startsWith("data-") ? mark : "data-".concat(mark);
        }
        return MARK_KEY;
      }
      function getContainer$1(option) {
        if (option.attachTo) {
          return option.attachTo;
        }
        var head = document.querySelector("head");
        return head || document.body;
      }
      function getOrder(prepend) {
        if (prepend === "queue") {
          return "prependQueue";
        }
        return prepend ? "prepend" : "append";
      }
      function findStyles(container) {
        return Array.from((containerCache.get(container) || container).children).filter(function(node2) {
          return node2.tagName === "STYLE";
        });
      }
      function injectCSS(css2) {
        var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (!canUseDom()) {
          return null;
        }
        var csp = option.csp, prepend = option.prepend;
        var styleNode = document.createElement("style");
        styleNode.setAttribute(APPEND_ORDER, getOrder(prepend));
        if (csp && csp.nonce) {
          styleNode.nonce = csp.nonce;
        }
        styleNode.innerHTML = css2;
        var container = getContainer$1(option);
        var firstChild = container.firstChild;
        if (prepend) {
          if (prepend === "queue") {
            var existStyle = findStyles(container).filter(function(node2) {
              return ["prepend", "prependQueue"].includes(node2.getAttribute(APPEND_ORDER));
            });
            if (existStyle.length) {
              container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
              return styleNode;
            }
          }
          container.insertBefore(styleNode, firstChild);
        } else {
          container.appendChild(styleNode);
        }
        return styleNode;
      }
      function findExistNode(key2) {
        var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var container = getContainer$1(option);
        return findStyles(container).find(function(node2) {
          return node2.getAttribute(getMark(option)) === key2;
        });
      }
      function syncRealContainer(container, option) {
        var cachedRealContainer = containerCache.get(container);
        if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
          var placeholderStyle = injectCSS("", option);
          var parentNode = placeholderStyle.parentNode;
          containerCache.set(container, parentNode);
          container.removeChild(placeholderStyle);
        }
      }
      function updateCSS(css2, key2) {
        var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var container = getContainer$1(option);
        syncRealContainer(container, option);
        var existNode = findExistNode(key2, option);
        if (existNode) {
          if (option.csp && option.csp.nonce && existNode.nonce !== option.csp.nonce) {
            existNode.nonce = option.csp.nonce;
          }
          if (existNode.innerHTML !== css2) {
            existNode.innerHTML = css2;
          }
          return existNode;
        }
        var newNode = injectCSS(css2, option);
        newNode.setAttribute(getMark(option), key2);
        return newNode;
      }
      function _objectSpread$g(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$g(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$g(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      function warning(valid, message2) {
      }
      function isIconDefinition(target) {
        return typeof target === "object" && typeof target.name === "string" && typeof target.theme === "string" && (typeof target.icon === "object" || typeof target.icon === "function");
      }
      function generate(node2, key2, rootProps) {
        if (!rootProps) {
          return vue.h(node2.tag, _objectSpread$g({
            key: key2
          }, node2.attrs), (node2.children || []).map(function(child, index2) {
            return generate(child, "".concat(key2, "-").concat(node2.tag, "-").concat(index2));
          }));
        }
        return vue.h(node2.tag, _objectSpread$g({
          key: key2
        }, rootProps, node2.attrs), (node2.children || []).map(function(child, index2) {
          return generate(child, "".concat(key2, "-").concat(node2.tag, "-").concat(index2));
        }));
      }
      function getSecondaryColor(primaryColor) {
        return generate$1(primaryColor)[0];
      }
      function normalizeTwoToneColors(twoToneColor) {
        if (!twoToneColor) {
          return [];
        }
        return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
      }
      var iconStyles = "\n.anticon {\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
      function getRoot(ele) {
        return ele && ele.getRootNode && ele.getRootNode();
      }
      function inShadow(ele) {
        if (!canUseDom()) {
          return false;
        }
        return getRoot(ele) instanceof ShadowRoot;
      }
      function getShadowRoot(ele) {
        return inShadow(ele) ? getRoot(ele) : null;
      }
      var useInsertStyles = function useInsertStyles2() {
        var _useInjectIconContext = useInjectIconContext(), prefixCls = _useInjectIconContext.prefixCls, csp = _useInjectIconContext.csp;
        var instance = vue.getCurrentInstance();
        var mergedStyleStr = iconStyles;
        if (prefixCls) {
          mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls.value);
        }
        vue.nextTick(function() {
          if (!canUseDom()) {
            return;
          }
          var ele = instance.vnode.el;
          var shadowRoot = getShadowRoot(ele);
          updateCSS(mergedStyleStr, "@ant-design-vue-icons", {
            prepend: true,
            csp: csp.value,
            attachTo: shadowRoot
          });
        });
      };
      var _excluded$1 = ["icon", "primaryColor", "secondaryColor"];
      function _objectWithoutProperties$1(source, excluded) {
        if (source == null)
          return {};
        var target = _objectWithoutPropertiesLoose$1(source, excluded);
        var key2, i2;
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i2 = 0; i2 < sourceSymbolKeys.length; i2++) {
            key2 = sourceSymbolKeys[i2];
            if (excluded.indexOf(key2) >= 0)
              continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key2))
              continue;
            target[key2] = source[key2];
          }
        }
        return target;
      }
      function _objectWithoutPropertiesLoose$1(source, excluded) {
        if (source == null)
          return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key2, i2;
        for (i2 = 0; i2 < sourceKeys.length; i2++) {
          key2 = sourceKeys[i2];
          if (excluded.indexOf(key2) >= 0)
            continue;
          target[key2] = source[key2];
        }
        return target;
      }
      function _objectSpread$f(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$f(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$f(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var twoToneColorPalette = vue.reactive({
        primaryColor: "#333",
        secondaryColor: "#E6E6E6",
        calculated: false
      });
      function setTwoToneColors(_ref) {
        var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
        twoToneColorPalette.primaryColor = primaryColor;
        twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
        twoToneColorPalette.calculated = !!secondaryColor;
      }
      function getTwoToneColors() {
        return _objectSpread$f({}, twoToneColorPalette);
      }
      var IconBase = function IconBase2(props, context) {
        var _props$context$attrs = _objectSpread$f({}, props, context.attrs), icon = _props$context$attrs.icon, primaryColor = _props$context$attrs.primaryColor, secondaryColor = _props$context$attrs.secondaryColor, restProps = _objectWithoutProperties$1(_props$context$attrs, _excluded$1);
        var colors = twoToneColorPalette;
        if (primaryColor) {
          colors = {
            primaryColor,
            secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
          };
        }
        warning(isIconDefinition(icon));
        if (!isIconDefinition(icon)) {
          return null;
        }
        var target = icon;
        if (target && typeof target.icon === "function") {
          target = _objectSpread$f({}, target, {
            icon: target.icon(colors.primaryColor, colors.secondaryColor)
          });
        }
        return generate(target.icon, "svg-".concat(target.name), _objectSpread$f({}, restProps, {
          "data-icon": target.name,
          width: "1em",
          height: "1em",
          fill: "currentColor",
          "aria-hidden": "true"
        }));
      };
      IconBase.props = {
        icon: Object,
        primaryColor: String,
        secondaryColor: String,
        focusable: String
      };
      IconBase.inheritAttrs = false;
      IconBase.displayName = "IconBase";
      IconBase.getTwoToneColors = getTwoToneColors;
      IconBase.setTwoToneColors = setTwoToneColors;
      const VueIcon = IconBase;
      function _slicedToArray$1(arr, i2) {
        return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i2) || _unsupportedIterableToArray$1(arr, i2) || _nonIterableRest$1();
      }
      function _nonIterableRest$1() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray$1(o2, minLen) {
        if (!o2)
          return;
        if (typeof o2 === "string")
          return _arrayLikeToArray$1(o2, minLen);
        var n2 = Object.prototype.toString.call(o2).slice(8, -1);
        if (n2 === "Object" && o2.constructor)
          n2 = o2.constructor.name;
        if (n2 === "Map" || n2 === "Set")
          return Array.from(o2);
        if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
          return _arrayLikeToArray$1(o2, minLen);
      }
      function _arrayLikeToArray$1(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
          arr2[i2] = arr[i2];
        }
        return arr2;
      }
      function _iterableToArrayLimit$1(arr, i2) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null)
          return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i2 && _arr.length === i2)
              break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null)
              _i["return"]();
          } finally {
            if (_d)
              throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles$1(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      function setTwoToneColor(twoToneColor) {
        var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray$1(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
        return VueIcon.setTwoToneColors({
          primaryColor,
          secondaryColor
        });
      }
      function getTwoToneColor() {
        var colors = VueIcon.getTwoToneColors();
        if (!colors.calculated) {
          return colors.primaryColor;
        }
        return [colors.primaryColor, colors.secondaryColor];
      }
      var InsertStyles = vue.defineComponent({
        name: "InsertStyles",
        setup: function setup() {
          useInsertStyles();
          return function() {
            return null;
          };
        }
      });
      var _excluded = ["class", "icon", "spin", "rotate", "tabindex", "twoToneColor", "onClick"];
      function _slicedToArray(arr, i2) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _unsupportedIterableToArray(o2, minLen) {
        if (!o2)
          return;
        if (typeof o2 === "string")
          return _arrayLikeToArray(o2, minLen);
        var n2 = Object.prototype.toString.call(o2).slice(8, -1);
        if (n2 === "Object" && o2.constructor)
          n2 = o2.constructor.name;
        if (n2 === "Map" || n2 === "Set")
          return Array.from(o2);
        if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
          return _arrayLikeToArray(o2, minLen);
      }
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length)
          len = arr.length;
        for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++) {
          arr2[i2] = arr[i2];
        }
        return arr2;
      }
      function _iterableToArrayLimit(arr, i2) {
        var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
        if (_i == null)
          return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _s, _e;
        try {
          for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i2 && _arr.length === i2)
              break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null)
              _i["return"]();
          } finally {
            if (_d)
              throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      function _objectSpread$e(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$e(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$e(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      function _objectWithoutProperties(source, excluded) {
        if (source == null)
          return {};
        var target = _objectWithoutPropertiesLoose(source, excluded);
        var key2, i2;
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i2 = 0; i2 < sourceSymbolKeys.length; i2++) {
            key2 = sourceSymbolKeys[i2];
            if (excluded.indexOf(key2) >= 0)
              continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key2))
              continue;
            target[key2] = source[key2];
          }
        }
        return target;
      }
      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null)
          return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key2, i2;
        for (i2 = 0; i2 < sourceKeys.length; i2++) {
          key2 = sourceKeys[i2];
          if (excluded.indexOf(key2) >= 0)
            continue;
          target[key2] = source[key2];
        }
        return target;
      }
      setTwoToneColor(blue.primary);
      var Icon = function Icon2(props, context) {
        var _classObj;
        var _props$context$attrs = _objectSpread$e({}, props, context.attrs), cls = _props$context$attrs["class"], icon = _props$context$attrs.icon, spin = _props$context$attrs.spin, rotate = _props$context$attrs.rotate, tabindex = _props$context$attrs.tabindex, twoToneColor = _props$context$attrs.twoToneColor, onClick = _props$context$attrs.onClick, restProps = _objectWithoutProperties(_props$context$attrs, _excluded);
        var _useInjectIconContext = useInjectIconContext(), prefixCls = _useInjectIconContext.prefixCls, rootClassName = _useInjectIconContext.rootClassName;
        var classObj = (_classObj = {}, _defineProperty$e(_classObj, rootClassName.value, !!rootClassName.value), _defineProperty$e(_classObj, prefixCls.value, true), _defineProperty$e(_classObj, "".concat(prefixCls.value, "-").concat(icon.name), Boolean(icon.name)), _defineProperty$e(_classObj, "".concat(prefixCls.value, "-spin"), !!spin || icon.name === "loading"), _classObj);
        var iconTabIndex = tabindex;
        if (iconTabIndex === void 0 && onClick) {
          iconTabIndex = -1;
        }
        var svgStyle = rotate ? {
          msTransform: "rotate(".concat(rotate, "deg)"),
          transform: "rotate(".concat(rotate, "deg)")
        } : void 0;
        var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
        return vue.createVNode("span", _objectSpread$e({
          "role": "img",
          "aria-label": icon.name
        }, restProps, {
          "onClick": onClick,
          "class": [classObj, cls],
          "tabindex": iconTabIndex
        }), [vue.createVNode(VueIcon, {
          "icon": icon,
          "primaryColor": primaryColor,
          "secondaryColor": secondaryColor,
          "style": svgStyle
        }, null), vue.createVNode(InsertStyles, null, null)]);
      };
      Icon.props = {
        spin: Boolean,
        rotate: Number,
        icon: Object,
        twoToneColor: [String, Array]
      };
      Icon.displayName = "AntdIcon";
      Icon.inheritAttrs = false;
      Icon.getTwoToneColor = getTwoToneColor;
      Icon.setTwoToneColor = setTwoToneColor;
      const AntdIcon = Icon;
      var LoadingOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "0 0 1024 1024", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" } }] }, "name": "loading", "theme": "outlined" };
      const LoadingOutlinedSvg = LoadingOutlined$2;
      function _objectSpread$d(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$d(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$d(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var LoadingOutlined = function LoadingOutlined2(props, context) {
        var p = _objectSpread$d({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$d({}, p, {
          "icon": LoadingOutlinedSvg
        }), null);
      };
      LoadingOutlined.displayName = "LoadingOutlined";
      LoadingOutlined.inheritAttrs = false;
      const LoadingOutlined$1 = LoadingOutlined;
      var CloseOutlined$2 = { "icon": { "tag": "svg", "attrs": { "fill-rule": "evenodd", "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" } }] }, "name": "close", "theme": "outlined" };
      const CloseOutlinedSvg = CloseOutlined$2;
      function _objectSpread$c(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$c(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$c(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var CloseOutlined = function CloseOutlined2(props, context) {
        var p = _objectSpread$c({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$c({}, p, {
          "icon": CloseOutlinedSvg
        }), null);
      };
      CloseOutlined.displayName = "CloseOutlined";
      CloseOutlined.inheritAttrs = false;
      const CloseOutlined$1 = CloseOutlined;
      var CloseCircleFilled$2 = { "icon": { "tag": "svg", "attrs": { "fill-rule": "evenodd", "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z" } }] }, "name": "close-circle", "theme": "filled" };
      const CloseCircleFilledSvg = CloseCircleFilled$2;
      function _objectSpread$b(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$b(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$b(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var CloseCircleFilled = function CloseCircleFilled2(props, context) {
        var p = _objectSpread$b({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$b({}, p, {
          "icon": CloseCircleFilledSvg
        }), null);
      };
      CloseCircleFilled.displayName = "CloseCircleFilled";
      CloseCircleFilled.inheritAttrs = false;
      const CloseCircleFilled$1 = CloseCircleFilled;
      const initMotionCommon = (duration) => ({
        animationDuration: duration,
        animationFillMode: "both"
      });
      const initMotionCommonLeave = (duration) => ({
        animationDuration: duration,
        animationFillMode: "both"
      });
      const initMotion = function(motionCls, inKeyframes, outKeyframes, duration) {
        let sameLevel = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
        const sameLevelPrefix = sameLevel ? "&" : "";
        return {
          [`
      ${sameLevelPrefix}${motionCls}-enter,
      ${sameLevelPrefix}${motionCls}-appear
    `]: _extends(_extends({}, initMotionCommon(duration)), {
            animationPlayState: "paused"
          }),
          [`${sameLevelPrefix}${motionCls}-leave`]: _extends(_extends({}, initMotionCommonLeave(duration)), {
            animationPlayState: "paused"
          }),
          [`
      ${sameLevelPrefix}${motionCls}-enter${motionCls}-enter-active,
      ${sameLevelPrefix}${motionCls}-appear${motionCls}-appear-active
    `]: {
            animationName: inKeyframes,
            animationPlayState: "running"
          },
          [`${sameLevelPrefix}${motionCls}-leave${motionCls}-leave-active`]: {
            animationName: outKeyframes,
            animationPlayState: "running",
            pointerEvents: "none"
          }
        };
      };
      const fadeIn = new Keyframes("antFadeIn", {
        "0%": {
          opacity: 0
        },
        "100%": {
          opacity: 1
        }
      });
      const fadeOut = new Keyframes("antFadeOut", {
        "0%": {
          opacity: 1
        },
        "100%": {
          opacity: 0
        }
      });
      const initFadeMotion = function(token2) {
        let sameLevel = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        const {
          antCls
        } = token2;
        const motionCls = `${antCls}-fade`;
        const sameLevelPrefix = sameLevel ? "&" : "";
        return [initMotion(motionCls, fadeIn, fadeOut, token2.motionDurationMid, sameLevel), {
          [`
        ${sameLevelPrefix}${motionCls}-enter,
        ${sameLevelPrefix}${motionCls}-appear
      `]: {
            opacity: 0,
            animationTimingFunction: "linear"
          },
          [`${sameLevelPrefix}${motionCls}-leave`]: {
            animationTimingFunction: "linear"
          }
        }];
      };
      const zoomIn = new Keyframes("antZoomIn", {
        "0%": {
          transform: "scale(0.2)",
          opacity: 0
        },
        "100%": {
          transform: "scale(1)",
          opacity: 1
        }
      });
      const zoomOut = new Keyframes("antZoomOut", {
        "0%": {
          transform: "scale(1)"
        },
        "100%": {
          transform: "scale(0.2)",
          opacity: 0
        }
      });
      const zoomBigIn = new Keyframes("antZoomBigIn", {
        "0%": {
          transform: "scale(0.8)",
          opacity: 0
        },
        "100%": {
          transform: "scale(1)",
          opacity: 1
        }
      });
      const zoomBigOut = new Keyframes("antZoomBigOut", {
        "0%": {
          transform: "scale(1)"
        },
        "100%": {
          transform: "scale(0.8)",
          opacity: 0
        }
      });
      const zoomUpIn = new Keyframes("antZoomUpIn", {
        "0%": {
          transform: "scale(0.8)",
          transformOrigin: "50% 0%",
          opacity: 0
        },
        "100%": {
          transform: "scale(1)",
          transformOrigin: "50% 0%"
        }
      });
      const zoomUpOut = new Keyframes("antZoomUpOut", {
        "0%": {
          transform: "scale(1)",
          transformOrigin: "50% 0%"
        },
        "100%": {
          transform: "scale(0.8)",
          transformOrigin: "50% 0%",
          opacity: 0
        }
      });
      const zoomLeftIn = new Keyframes("antZoomLeftIn", {
        "0%": {
          transform: "scale(0.8)",
          transformOrigin: "0% 50%",
          opacity: 0
        },
        "100%": {
          transform: "scale(1)",
          transformOrigin: "0% 50%"
        }
      });
      const zoomLeftOut = new Keyframes("antZoomLeftOut", {
        "0%": {
          transform: "scale(1)",
          transformOrigin: "0% 50%"
        },
        "100%": {
          transform: "scale(0.8)",
          transformOrigin: "0% 50%",
          opacity: 0
        }
      });
      const zoomRightIn = new Keyframes("antZoomRightIn", {
        "0%": {
          transform: "scale(0.8)",
          transformOrigin: "100% 50%",
          opacity: 0
        },
        "100%": {
          transform: "scale(1)",
          transformOrigin: "100% 50%"
        }
      });
      const zoomRightOut = new Keyframes("antZoomRightOut", {
        "0%": {
          transform: "scale(1)",
          transformOrigin: "100% 50%"
        },
        "100%": {
          transform: "scale(0.8)",
          transformOrigin: "100% 50%",
          opacity: 0
        }
      });
      const zoomDownIn = new Keyframes("antZoomDownIn", {
        "0%": {
          transform: "scale(0.8)",
          transformOrigin: "50% 100%",
          opacity: 0
        },
        "100%": {
          transform: "scale(1)",
          transformOrigin: "50% 100%"
        }
      });
      const zoomDownOut = new Keyframes("antZoomDownOut", {
        "0%": {
          transform: "scale(1)",
          transformOrigin: "50% 100%"
        },
        "100%": {
          transform: "scale(0.8)",
          transformOrigin: "50% 100%",
          opacity: 0
        }
      });
      const zoomMotion = {
        zoom: {
          inKeyframes: zoomIn,
          outKeyframes: zoomOut
        },
        "zoom-big": {
          inKeyframes: zoomBigIn,
          outKeyframes: zoomBigOut
        },
        "zoom-big-fast": {
          inKeyframes: zoomBigIn,
          outKeyframes: zoomBigOut
        },
        "zoom-left": {
          inKeyframes: zoomLeftIn,
          outKeyframes: zoomLeftOut
        },
        "zoom-right": {
          inKeyframes: zoomRightIn,
          outKeyframes: zoomRightOut
        },
        "zoom-up": {
          inKeyframes: zoomUpIn,
          outKeyframes: zoomUpOut
        },
        "zoom-down": {
          inKeyframes: zoomDownIn,
          outKeyframes: zoomDownOut
        }
      };
      const initZoomMotion = (token2, motionName) => {
        const {
          antCls
        } = token2;
        const motionCls = `${antCls}-${motionName}`;
        const {
          inKeyframes,
          outKeyframes
        } = zoomMotion[motionName];
        return [initMotion(motionCls, inKeyframes, outKeyframes, motionName === "zoom-big-fast" ? token2.motionDurationFast : token2.motionDurationMid), {
          [`
        ${motionCls}-enter,
        ${motionCls}-appear
      `]: {
            transform: "scale(0)",
            opacity: 0,
            animationTimingFunction: token2.motionEaseOutCirc,
            "&-prepare": {
              transform: "none"
            }
          },
          [`${motionCls}-leave`]: {
            animationTimingFunction: token2.motionEaseInOutCirc
          }
        }];
      };
      var CheckCircleOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z" } }, { "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" } }] }, "name": "check-circle", "theme": "outlined" };
      const CheckCircleOutlinedSvg = CheckCircleOutlined$2;
      function _objectSpread$a(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$a(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$a(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var CheckCircleOutlined = function CheckCircleOutlined2(props, context) {
        var p = _objectSpread$a({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$a({}, p, {
          "icon": CheckCircleOutlinedSvg
        }), null);
      };
      CheckCircleOutlined.displayName = "CheckCircleOutlined";
      CheckCircleOutlined.inheritAttrs = false;
      const CheckCircleOutlined$1 = CheckCircleOutlined;
      var ExclamationCircleOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" } }, { "tag": "path", "attrs": { "d": "M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" } }] }, "name": "exclamation-circle", "theme": "outlined" };
      const ExclamationCircleOutlinedSvg = ExclamationCircleOutlined$2;
      function _objectSpread$9(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$9(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$9(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var ExclamationCircleOutlined = function ExclamationCircleOutlined2(props, context) {
        var p = _objectSpread$9({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$9({}, p, {
          "icon": ExclamationCircleOutlinedSvg
        }), null);
      };
      ExclamationCircleOutlined.displayName = "ExclamationCircleOutlined";
      ExclamationCircleOutlined.inheritAttrs = false;
      const ExclamationCircleOutlined$1 = ExclamationCircleOutlined;
      var InfoCircleOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" } }, { "tag": "path", "attrs": { "d": "M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" } }] }, "name": "info-circle", "theme": "outlined" };
      const InfoCircleOutlinedSvg = InfoCircleOutlined$2;
      function _objectSpread$8(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$8(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$8(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var InfoCircleOutlined = function InfoCircleOutlined2(props, context) {
        var p = _objectSpread$8({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$8({}, p, {
          "icon": InfoCircleOutlinedSvg
        }), null);
      };
      InfoCircleOutlined.displayName = "InfoCircleOutlined";
      InfoCircleOutlined.inheritAttrs = false;
      const InfoCircleOutlined$1 = InfoCircleOutlined;
      var CloseCircleOutlined$2 = { "icon": { "tag": "svg", "attrs": { "fill-rule": "evenodd", "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm128.01 198.83c.03 0 .05.01.09.06l45.02 45.01a.2.2 0 01.05.09.12.12 0 010 .07c0 .02-.01.04-.05.08L557.25 512l127.87 127.86a.27.27 0 01.05.06v.02a.12.12 0 010 .07c0 .03-.01.05-.05.09l-45.02 45.02a.2.2 0 01-.09.05.12.12 0 01-.07 0c-.02 0-.04-.01-.08-.05L512 557.25 384.14 685.12c-.04.04-.06.05-.08.05a.12.12 0 01-.07 0c-.03 0-.05-.01-.09-.05l-45.02-45.02a.2.2 0 01-.05-.09.12.12 0 010-.07c0-.02.01-.04.06-.08L466.75 512 338.88 384.14a.27.27 0 01-.05-.06l-.01-.02a.12.12 0 010-.07c0-.03.01-.05.05-.09l45.02-45.02a.2.2 0 01.09-.05.12.12 0 01.07 0c.02 0 .04.01.08.06L512 466.75l127.86-127.86c.04-.05.06-.06.08-.06a.12.12 0 01.07 0z" } }] }, "name": "close-circle", "theme": "outlined" };
      const CloseCircleOutlinedSvg = CloseCircleOutlined$2;
      function _objectSpread$7(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$7(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$7(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var CloseCircleOutlined = function CloseCircleOutlined2(props, context) {
        var p = _objectSpread$7({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$7({}, p, {
          "icon": CloseCircleOutlinedSvg
        }), null);
      };
      CloseCircleOutlined.displayName = "CloseCircleOutlined";
      CloseCircleOutlined.inheritAttrs = false;
      const CloseCircleOutlined$1 = CloseCircleOutlined;
      var CheckCircleFilled$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" } }] }, "name": "check-circle", "theme": "filled" };
      const CheckCircleFilledSvg = CheckCircleFilled$2;
      function _objectSpread$6(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$6(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$6(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var CheckCircleFilled = function CheckCircleFilled2(props, context) {
        var p = _objectSpread$6({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$6({}, p, {
          "icon": CheckCircleFilledSvg
        }), null);
      };
      CheckCircleFilled.displayName = "CheckCircleFilled";
      CheckCircleFilled.inheritAttrs = false;
      const CheckCircleFilled$1 = CheckCircleFilled;
      var ExclamationCircleFilled$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" } }] }, "name": "exclamation-circle", "theme": "filled" };
      const ExclamationCircleFilledSvg = ExclamationCircleFilled$2;
      function _objectSpread$5(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$5(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$5(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var ExclamationCircleFilled = function ExclamationCircleFilled2(props, context) {
        var p = _objectSpread$5({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$5({}, p, {
          "icon": ExclamationCircleFilledSvg
        }), null);
      };
      ExclamationCircleFilled.displayName = "ExclamationCircleFilled";
      ExclamationCircleFilled.inheritAttrs = false;
      const ExclamationCircleFilled$1 = ExclamationCircleFilled;
      var InfoCircleFilled$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" } }] }, "name": "info-circle", "theme": "filled" };
      const InfoCircleFilledSvg = InfoCircleFilled$2;
      function _objectSpread$4(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$4(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$4(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var InfoCircleFilled = function InfoCircleFilled2(props, context) {
        var p = _objectSpread$4({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$4({}, p, {
          "icon": InfoCircleFilledSvg
        }), null);
      };
      InfoCircleFilled.displayName = "InfoCircleFilled";
      InfoCircleFilled.inheritAttrs = false;
      const InfoCircleFilled$1 = InfoCircleFilled;
      const autoAdjustOverflow = {
        adjustX: 1,
        adjustY: 1
      };
      const targetOffset$1 = [0, 0];
      const placements = {
        left: {
          points: ["cr", "cl"],
          overflow: autoAdjustOverflow,
          offset: [-4, 0],
          targetOffset: targetOffset$1
        },
        right: {
          points: ["cl", "cr"],
          overflow: autoAdjustOverflow,
          offset: [4, 0],
          targetOffset: targetOffset$1
        },
        top: {
          points: ["bc", "tc"],
          overflow: autoAdjustOverflow,
          offset: [0, -4],
          targetOffset: targetOffset$1
        },
        bottom: {
          points: ["tc", "bc"],
          overflow: autoAdjustOverflow,
          offset: [0, 4],
          targetOffset: targetOffset$1
        },
        topLeft: {
          points: ["bl", "tl"],
          overflow: autoAdjustOverflow,
          offset: [0, -4],
          targetOffset: targetOffset$1
        },
        leftTop: {
          points: ["tr", "tl"],
          overflow: autoAdjustOverflow,
          offset: [-4, 0],
          targetOffset: targetOffset$1
        },
        topRight: {
          points: ["br", "tr"],
          overflow: autoAdjustOverflow,
          offset: [0, -4],
          targetOffset: targetOffset$1
        },
        rightTop: {
          points: ["tl", "tr"],
          overflow: autoAdjustOverflow,
          offset: [4, 0],
          targetOffset: targetOffset$1
        },
        bottomRight: {
          points: ["tr", "br"],
          overflow: autoAdjustOverflow,
          offset: [0, 4],
          targetOffset: targetOffset$1
        },
        rightBottom: {
          points: ["bl", "br"],
          overflow: autoAdjustOverflow,
          offset: [4, 0],
          targetOffset: targetOffset$1
        },
        bottomLeft: {
          points: ["tl", "bl"],
          overflow: autoAdjustOverflow,
          offset: [0, 4],
          targetOffset: targetOffset$1
        },
        leftBottom: {
          points: ["br", "bl"],
          overflow: autoAdjustOverflow,
          offset: [-4, 0],
          targetOffset: targetOffset$1
        }
      };
      const tooltipContentProps = {
        prefixCls: String,
        id: String,
        overlayInnerStyle: PropTypes$1.any
      };
      const Content$1 = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "TooltipContent",
        props: tooltipContentProps,
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          return () => {
            var _a2;
            return vue.createVNode("div", {
              "class": `${props.prefixCls}-inner`,
              "id": props.id,
              "role": "tooltip",
              "style": props.overlayInnerStyle
            }, [(_a2 = slots.overlay) === null || _a2 === void 0 ? void 0 : _a2.call(slots)]);
          };
        }
      });
      var __rest$9 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      function noop() {
      }
      const Tooltip$1 = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "Tooltip",
        inheritAttrs: false,
        props: {
          trigger: PropTypes$1.any.def(["hover"]),
          defaultVisible: {
            type: Boolean,
            default: void 0
          },
          visible: {
            type: Boolean,
            default: void 0
          },
          placement: PropTypes$1.string.def("right"),
          transitionName: String,
          animation: PropTypes$1.any,
          afterVisibleChange: PropTypes$1.func.def(() => {
          }),
          overlayStyle: {
            type: Object,
            default: void 0
          },
          overlayClassName: String,
          prefixCls: PropTypes$1.string.def("rc-tooltip"),
          mouseEnterDelay: PropTypes$1.number.def(0.1),
          mouseLeaveDelay: PropTypes$1.number.def(0.1),
          getPopupContainer: Function,
          destroyTooltipOnHide: {
            type: Boolean,
            default: false
          },
          align: PropTypes$1.object.def(() => ({})),
          arrowContent: PropTypes$1.any.def(null),
          tipId: String,
          builtinPlacements: PropTypes$1.object,
          overlayInnerStyle: {
            type: Object,
            default: void 0
          },
          popupVisible: {
            type: Boolean,
            default: void 0
          },
          onVisibleChange: Function,
          onPopupAlign: Function
        },
        setup(props, _ref) {
          let {
            slots,
            attrs,
            expose
          } = _ref;
          const triggerDOM = vue.shallowRef();
          const getPopupElement = () => {
            const {
              prefixCls,
              tipId,
              overlayInnerStyle
            } = props;
            return [vue.createVNode("div", {
              "class": `${prefixCls}-arrow`,
              "key": "arrow"
            }, [getPropsSlot(slots, props, "arrowContent")]), vue.createVNode(Content$1, {
              "key": "content",
              "prefixCls": prefixCls,
              "id": tipId,
              "overlayInnerStyle": overlayInnerStyle
            }, {
              overlay: slots.overlay
            })];
          };
          const getPopupDomNode = () => {
            return triggerDOM.value.getPopupDomNode();
          };
          expose({
            getPopupDomNode,
            triggerDOM,
            forcePopupAlign: () => {
              var _a2;
              return (_a2 = triggerDOM.value) === null || _a2 === void 0 ? void 0 : _a2.forcePopupAlign();
            }
          });
          const destroyTooltip = vue.shallowRef(false);
          const autoDestroy = vue.shallowRef(false);
          vue.watchEffect(() => {
            const {
              destroyTooltipOnHide
            } = props;
            if (typeof destroyTooltipOnHide === "boolean") {
              destroyTooltip.value = destroyTooltipOnHide;
            } else if (destroyTooltipOnHide && typeof destroyTooltipOnHide === "object") {
              const {
                keepParent
              } = destroyTooltipOnHide;
              destroyTooltip.value = keepParent === true;
              autoDestroy.value = keepParent === false;
            }
          });
          return () => {
            const {
              overlayClassName,
              trigger,
              mouseEnterDelay,
              mouseLeaveDelay,
              overlayStyle,
              prefixCls,
              afterVisibleChange,
              transitionName: transitionName2,
              animation,
              placement,
              align,
              destroyTooltipOnHide,
              defaultVisible
            } = props, restProps = __rest$9(props, ["overlayClassName", "trigger", "mouseEnterDelay", "mouseLeaveDelay", "overlayStyle", "prefixCls", "afterVisibleChange", "transitionName", "animation", "placement", "align", "destroyTooltipOnHide", "defaultVisible"]);
            const extraProps = _extends({}, restProps);
            if (props.visible !== void 0) {
              extraProps.popupVisible = props.visible;
            }
            const triggerProps2 = _extends(_extends(_extends({
              popupClassName: overlayClassName,
              prefixCls,
              action: trigger,
              builtinPlacements: placements,
              popupPlacement: placement,
              popupAlign: align,
              afterPopupVisibleChange: afterVisibleChange,
              popupTransitionName: transitionName2,
              popupAnimation: animation,
              defaultPopupVisible: defaultVisible,
              destroyPopupOnHide: destroyTooltip.value,
              autoDestroy: autoDestroy.value,
              mouseLeaveDelay,
              popupStyle: overlayStyle,
              mouseEnterDelay
            }, extraProps), attrs), {
              onPopupVisibleChange: props.onVisibleChange || noop,
              onPopupAlign: props.onPopupAlign || noop,
              ref: triggerDOM,
              popup: getPopupElement()
            });
            return vue.createVNode(Trigger, triggerProps2, {
              default: slots.default
            });
          };
        }
      });
      const abstractTooltipProps = () => ({
        trigger: [String, Array],
        open: {
          type: Boolean,
          default: void 0
        },
        /** @deprecated Please use `open` instead. */
        visible: {
          type: Boolean,
          default: void 0
        },
        placement: String,
        color: String,
        transitionName: String,
        overlayStyle: objectType(),
        overlayInnerStyle: objectType(),
        overlayClassName: String,
        openClassName: String,
        prefixCls: String,
        mouseEnterDelay: Number,
        mouseLeaveDelay: Number,
        getPopupContainer: Function,
        arrowPointAtCenter: {
          type: Boolean,
          default: void 0
        },
        autoAdjustOverflow: {
          type: [Boolean, Object],
          default: void 0
        },
        destroyTooltipOnHide: {
          type: Boolean,
          default: void 0
        },
        align: objectType(),
        builtinPlacements: objectType(),
        children: Array,
        /** @deprecated Please use `onOpenChange` instead. */
        onVisibleChange: Function,
        /** @deprecated Please use `onUpdate:open` instead. */
        "onUpdate:visible": Function,
        onOpenChange: Function,
        "onUpdate:open": Function
      });
      const autoAdjustOverflowEnabled = {
        adjustX: 1,
        adjustY: 1
      };
      const autoAdjustOverflowDisabled = {
        adjustX: 0,
        adjustY: 0
      };
      const targetOffset = [0, 0];
      function getOverflowOptions(autoAdjustOverflow2) {
        if (typeof autoAdjustOverflow2 === "boolean") {
          return autoAdjustOverflow2 ? autoAdjustOverflowEnabled : autoAdjustOverflowDisabled;
        }
        return _extends(_extends({}, autoAdjustOverflowDisabled), autoAdjustOverflow2);
      }
      function getPlacements(config) {
        const {
          arrowWidth = 4,
          horizontalArrowShift = 16,
          verticalArrowShift = 8,
          autoAdjustOverflow: autoAdjustOverflow2,
          arrowPointAtCenter
        } = config;
        const placementMap = {
          left: {
            points: ["cr", "cl"],
            offset: [-4, 0]
          },
          right: {
            points: ["cl", "cr"],
            offset: [4, 0]
          },
          top: {
            points: ["bc", "tc"],
            offset: [0, -4]
          },
          bottom: {
            points: ["tc", "bc"],
            offset: [0, 4]
          },
          topLeft: {
            points: ["bl", "tc"],
            offset: [-(horizontalArrowShift + arrowWidth), -4]
          },
          leftTop: {
            points: ["tr", "cl"],
            offset: [-4, -(verticalArrowShift + arrowWidth)]
          },
          topRight: {
            points: ["br", "tc"],
            offset: [horizontalArrowShift + arrowWidth, -4]
          },
          rightTop: {
            points: ["tl", "cr"],
            offset: [4, -(verticalArrowShift + arrowWidth)]
          },
          bottomRight: {
            points: ["tr", "bc"],
            offset: [horizontalArrowShift + arrowWidth, 4]
          },
          rightBottom: {
            points: ["bl", "cr"],
            offset: [4, verticalArrowShift + arrowWidth]
          },
          bottomLeft: {
            points: ["tl", "bc"],
            offset: [-(horizontalArrowShift + arrowWidth), 4]
          },
          leftBottom: {
            points: ["br", "cl"],
            offset: [-4, verticalArrowShift + arrowWidth]
          }
        };
        Object.keys(placementMap).forEach((key2) => {
          placementMap[key2] = arrowPointAtCenter ? _extends(_extends({}, placementMap[key2]), {
            overflow: getOverflowOptions(autoAdjustOverflow2),
            targetOffset
          }) : _extends(_extends({}, placements[key2]), {
            overflow: getOverflowOptions(autoAdjustOverflow2)
          });
          placementMap[key2].ignoreShake = true;
        });
        return placementMap;
      }
      function firstNotUndefined() {
        let arr = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
        for (let i2 = 0, len = arr.length; i2 < len; i2++) {
          if (arr[i2] !== void 0) {
            return arr[i2];
          }
        }
        return void 0;
      }
      const inverseColors = PresetColors.map((color) => `${color}-inverse`);
      function isPresetColor(color) {
        let includeInverse = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        if (includeInverse) {
          return [...inverseColors, ...PresetColors].includes(color);
        }
        return PresetColors.includes(color);
      }
      function parseColor(prefixCls, color) {
        const isInternalColor = isPresetColor(color);
        const className = classNames({
          [`${prefixCls}-${color}`]: color && isInternalColor
        });
        const overlayStyle = {};
        const arrowStyle = {};
        if (color && !isInternalColor) {
          overlayStyle.background = color;
          arrowStyle["--antd-arrow-background-color"] = color;
        }
        return {
          className,
          overlayStyle,
          arrowStyle
        };
      }
      function connectArrowCls(classList) {
        let showArrowCls = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
        return classList.map((cls) => `${showArrowCls}${cls}`).join(",");
      }
      const MAX_VERTICAL_CONTENT_RADIUS = 8;
      function getArrowOffset(options) {
        const maxVerticalContentRadius = MAX_VERTICAL_CONTENT_RADIUS;
        const {
          sizePopupArrow,
          contentRadius,
          borderRadiusOuter,
          limitVerticalRadius
        } = options;
        const arrowInnerOffset = sizePopupArrow / 2 - Math.ceil(borderRadiusOuter * (Math.sqrt(2) - 1));
        const dropdownArrowOffset = (contentRadius > 12 ? contentRadius + 2 : 12) - arrowInnerOffset;
        const dropdownArrowOffsetVertical = limitVerticalRadius ? maxVerticalContentRadius - arrowInnerOffset : dropdownArrowOffset;
        return {
          dropdownArrowOffset,
          dropdownArrowOffsetVertical
        };
      }
      function getArrowStyle(token2, options) {
        const {
          componentCls,
          sizePopupArrow,
          marginXXS,
          borderRadiusXS,
          borderRadiusOuter,
          boxShadowPopoverArrow
        } = token2;
        const {
          colorBg,
          showArrowCls,
          contentRadius = token2.borderRadiusLG,
          limitVerticalRadius
        } = options;
        const {
          dropdownArrowOffsetVertical,
          dropdownArrowOffset
        } = getArrowOffset({
          sizePopupArrow,
          contentRadius,
          borderRadiusOuter,
          limitVerticalRadius
        });
        const dropdownArrowDistance = sizePopupArrow / 2 + marginXXS;
        return {
          [componentCls]: {
            // ============================ Basic ============================
            [`${componentCls}-arrow`]: [_extends(_extends({
              position: "absolute",
              zIndex: 1,
              display: "block"
            }, roundedArrow(sizePopupArrow, borderRadiusXS, borderRadiusOuter, colorBg, boxShadowPopoverArrow)), {
              "&:before": {
                background: colorBg
              }
            })],
            // ========================== Placement ==========================
            // Here handle the arrow position and rotate stuff
            // >>>>> Top
            [[`&-placement-top ${componentCls}-arrow`, `&-placement-topLeft ${componentCls}-arrow`, `&-placement-topRight ${componentCls}-arrow`].join(",")]: {
              bottom: 0,
              transform: "translateY(100%) rotate(180deg)"
            },
            [`&-placement-top ${componentCls}-arrow`]: {
              left: {
                _skip_check_: true,
                value: "50%"
              },
              transform: "translateX(-50%) translateY(100%) rotate(180deg)"
            },
            [`&-placement-topLeft ${componentCls}-arrow`]: {
              left: {
                _skip_check_: true,
                value: dropdownArrowOffset
              }
            },
            [`&-placement-topRight ${componentCls}-arrow`]: {
              right: {
                _skip_check_: true,
                value: dropdownArrowOffset
              }
            },
            // >>>>> Bottom
            [[`&-placement-bottom ${componentCls}-arrow`, `&-placement-bottomLeft ${componentCls}-arrow`, `&-placement-bottomRight ${componentCls}-arrow`].join(",")]: {
              top: 0,
              transform: `translateY(-100%)`
            },
            [`&-placement-bottom ${componentCls}-arrow`]: {
              left: {
                _skip_check_: true,
                value: "50%"
              },
              transform: `translateX(-50%) translateY(-100%)`
            },
            [`&-placement-bottomLeft ${componentCls}-arrow`]: {
              left: {
                _skip_check_: true,
                value: dropdownArrowOffset
              }
            },
            [`&-placement-bottomRight ${componentCls}-arrow`]: {
              right: {
                _skip_check_: true,
                value: dropdownArrowOffset
              }
            },
            // >>>>> Left
            [[`&-placement-left ${componentCls}-arrow`, `&-placement-leftTop ${componentCls}-arrow`, `&-placement-leftBottom ${componentCls}-arrow`].join(",")]: {
              right: {
                _skip_check_: true,
                value: 0
              },
              transform: "translateX(100%) rotate(90deg)"
            },
            [`&-placement-left ${componentCls}-arrow`]: {
              top: {
                _skip_check_: true,
                value: "50%"
              },
              transform: "translateY(-50%) translateX(100%) rotate(90deg)"
            },
            [`&-placement-leftTop ${componentCls}-arrow`]: {
              top: dropdownArrowOffsetVertical
            },
            [`&-placement-leftBottom ${componentCls}-arrow`]: {
              bottom: dropdownArrowOffsetVertical
            },
            // >>>>> Right
            [[`&-placement-right ${componentCls}-arrow`, `&-placement-rightTop ${componentCls}-arrow`, `&-placement-rightBottom ${componentCls}-arrow`].join(",")]: {
              left: {
                _skip_check_: true,
                value: 0
              },
              transform: "translateX(-100%) rotate(-90deg)"
            },
            [`&-placement-right ${componentCls}-arrow`]: {
              top: {
                _skip_check_: true,
                value: "50%"
              },
              transform: "translateY(-50%) translateX(-100%) rotate(-90deg)"
            },
            [`&-placement-rightTop ${componentCls}-arrow`]: {
              top: dropdownArrowOffsetVertical
            },
            [`&-placement-rightBottom ${componentCls}-arrow`]: {
              bottom: dropdownArrowOffsetVertical
            },
            // =========================== Offset ============================
            // Offset the popover to account for the dropdown arrow
            // >>>>> Top
            [connectArrowCls([`&-placement-topLeft`, `&-placement-top`, `&-placement-topRight`], showArrowCls)]: {
              paddingBottom: dropdownArrowDistance
            },
            // >>>>> Bottom
            [connectArrowCls([`&-placement-bottomLeft`, `&-placement-bottom`, `&-placement-bottomRight`], showArrowCls)]: {
              paddingTop: dropdownArrowDistance
            },
            // >>>>> Left
            [connectArrowCls([`&-placement-leftTop`, `&-placement-left`, `&-placement-leftBottom`], showArrowCls)]: {
              paddingRight: {
                _skip_check_: true,
                value: dropdownArrowDistance
              }
            },
            // >>>>> Right
            [connectArrowCls([`&-placement-rightTop`, `&-placement-right`, `&-placement-rightBottom`], showArrowCls)]: {
              paddingLeft: {
                _skip_check_: true,
                value: dropdownArrowDistance
              }
            }
          }
        };
      }
      const genTooltipStyle = (token2) => {
        const {
          componentCls,
          // ant-tooltip
          tooltipMaxWidth,
          tooltipColor,
          tooltipBg,
          tooltipBorderRadius,
          zIndexPopup,
          controlHeight,
          boxShadowSecondary,
          paddingSM,
          paddingXS,
          tooltipRadiusOuter
        } = token2;
        return [
          {
            [componentCls]: _extends(_extends(_extends(_extends({}, resetComponent(token2)), {
              position: "absolute",
              zIndex: zIndexPopup,
              display: "block",
              "&": [{
                width: "max-content"
              }, {
                width: "intrinsic"
              }],
              maxWidth: tooltipMaxWidth,
              visibility: "visible",
              "&-hidden": {
                display: "none"
              },
              "--antd-arrow-background-color": tooltipBg,
              // Wrapper for the tooltip content
              [`${componentCls}-inner`]: {
                minWidth: controlHeight,
                minHeight: controlHeight,
                padding: `${paddingSM / 2}px ${paddingXS}px`,
                color: tooltipColor,
                textAlign: "start",
                textDecoration: "none",
                wordWrap: "break-word",
                backgroundColor: tooltipBg,
                borderRadius: tooltipBorderRadius,
                boxShadow: boxShadowSecondary
              },
              // Limit left and right placement radius
              [[`&-placement-left`, `&-placement-leftTop`, `&-placement-leftBottom`, `&-placement-right`, `&-placement-rightTop`, `&-placement-rightBottom`].join(",")]: {
                [`${componentCls}-inner`]: {
                  borderRadius: Math.min(tooltipBorderRadius, MAX_VERTICAL_CONTENT_RADIUS)
                }
              },
              [`${componentCls}-content`]: {
                position: "relative"
              }
            }), genPresetColor(token2, (colorKey, _ref) => {
              let {
                darkColor
              } = _ref;
              return {
                [`&${componentCls}-${colorKey}`]: {
                  [`${componentCls}-inner`]: {
                    backgroundColor: darkColor
                  },
                  [`${componentCls}-arrow`]: {
                    "--antd-arrow-background-color": darkColor
                  }
                }
              };
            })), {
              // RTL
              "&-rtl": {
                direction: "rtl"
              }
            })
          },
          // Arrow Style
          getArrowStyle(merge(token2, {
            borderRadiusOuter: tooltipRadiusOuter
          }), {
            colorBg: "var(--antd-arrow-background-color)",
            showArrowCls: "",
            contentRadius: tooltipBorderRadius,
            limitVerticalRadius: true
          }),
          // Pure Render
          {
            [`${componentCls}-pure`]: {
              position: "relative",
              maxWidth: "none"
            }
          }
        ];
      };
      const useStyle$6 = (prefixCls, injectStyle) => {
        const useOriginHook = genComponentStyleHook("Tooltip", (token2) => {
          if ((injectStyle === null || injectStyle === void 0 ? void 0 : injectStyle.value) === false) {
            return [];
          }
          const {
            borderRadius,
            colorTextLightSolid,
            colorBgDefault,
            borderRadiusOuter
          } = token2;
          const TooltipToken = merge(token2, {
            // default variables
            tooltipMaxWidth: 250,
            tooltipColor: colorTextLightSolid,
            tooltipBorderRadius: borderRadius,
            tooltipBg: colorBgDefault,
            tooltipRadiusOuter: borderRadiusOuter > 4 ? 4 : borderRadiusOuter
          });
          return [genTooltipStyle(TooltipToken), initZoomMotion(token2, "zoom-big-fast")];
        }, (_ref2) => {
          let {
            zIndexPopupBase,
            colorBgSpotlight
          } = _ref2;
          return {
            zIndexPopup: zIndexPopupBase + 70,
            colorBgDefault: colorBgSpotlight
          };
        });
        return useOriginHook(prefixCls);
      };
      const splitObject = (obj, keys2) => {
        const picked = {};
        const omitted = _extends({}, obj);
        keys2.forEach((key2) => {
          if (obj && key2 in obj) {
            picked[key2] = obj[key2];
            delete omitted[key2];
          }
        });
        return {
          picked,
          omitted
        };
      };
      const tooltipProps = () => _extends(_extends({}, abstractTooltipProps()), {
        title: PropTypes$1.any
      });
      const ToolTip = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "ATooltip",
        inheritAttrs: false,
        props: initDefaultProps$1(tooltipProps(), {
          trigger: "hover",
          align: {},
          placement: "top",
          mouseEnterDelay: 0.1,
          mouseLeaveDelay: 0.1,
          arrowPointAtCenter: false,
          autoAdjustOverflow: true
        }),
        slots: Object,
        // emits: ['update:visible', 'visibleChange'],
        setup(props, _ref) {
          let {
            slots,
            emit,
            attrs,
            expose
          } = _ref;
          const {
            prefixCls,
            getPopupContainer,
            direction,
            rootPrefixCls
          } = useConfigInject("tooltip", props);
          const mergedOpen = vue.computed(() => {
            var _a2;
            return (_a2 = props.open) !== null && _a2 !== void 0 ? _a2 : props.visible;
          });
          const innerOpen = vue.ref(firstNotUndefined([props.open, props.visible]));
          const tooltip = vue.ref();
          let rafId;
          vue.watch(mergedOpen, (val) => {
            wrapperRaf.cancel(rafId);
            rafId = wrapperRaf(() => {
              innerOpen.value = !!val;
            });
          });
          const isNoTitle = () => {
            var _a2;
            const title = (_a2 = props.title) !== null && _a2 !== void 0 ? _a2 : slots.title;
            return !title && title !== 0;
          };
          const handleVisibleChange = (val) => {
            const noTitle = isNoTitle();
            if (mergedOpen.value === void 0) {
              innerOpen.value = noTitle ? false : val;
            }
            if (!noTitle) {
              emit("update:visible", val);
              emit("visibleChange", val);
              emit("update:open", val);
              emit("openChange", val);
            }
          };
          const getPopupDomNode = () => {
            return tooltip.value.getPopupDomNode();
          };
          expose({
            getPopupDomNode,
            open: innerOpen,
            forcePopupAlign: () => {
              var _a2;
              return (_a2 = tooltip.value) === null || _a2 === void 0 ? void 0 : _a2.forcePopupAlign();
            }
          });
          const tooltipPlacements = vue.computed(() => {
            const {
              builtinPlacements,
              arrowPointAtCenter,
              autoAdjustOverflow: autoAdjustOverflow2
            } = props;
            return builtinPlacements || getPlacements({
              arrowPointAtCenter,
              autoAdjustOverflow: autoAdjustOverflow2
            });
          });
          const isTrueProps = (val) => {
            return val || val === "";
          };
          const getDisabledCompatibleChildren = (ele) => {
            const elementType = ele.type;
            if (typeof elementType === "object" && ele.props) {
              if ((elementType.__ANT_BUTTON === true || elementType === "button") && isTrueProps(ele.props.disabled) || elementType.__ANT_SWITCH === true && (isTrueProps(ele.props.disabled) || isTrueProps(ele.props.loading)) || elementType.__ANT_RADIO === true && isTrueProps(ele.props.disabled)) {
                const {
                  picked,
                  omitted
                } = splitObject(getStyle$1(ele), ["position", "left", "right", "top", "bottom", "float", "display", "zIndex"]);
                const spanStyle = _extends(_extends({
                  display: "inline-block"
                }, picked), {
                  cursor: "not-allowed",
                  lineHeight: 1,
                  width: ele.props && ele.props.block ? "100%" : void 0
                });
                const buttonStyle = _extends(_extends({}, omitted), {
                  pointerEvents: "none"
                });
                const child = cloneElement(ele, {
                  style: buttonStyle
                }, true);
                return vue.createVNode("span", {
                  "style": spanStyle,
                  "class": `${prefixCls.value}-disabled-compatible-wrapper`
                }, [child]);
              }
            }
            return ele;
          };
          const getOverlay = () => {
            var _a2, _b2;
            return (_a2 = props.title) !== null && _a2 !== void 0 ? _a2 : (_b2 = slots.title) === null || _b2 === void 0 ? void 0 : _b2.call(slots);
          };
          const onPopupAlign = (domNode, align) => {
            const placements2 = tooltipPlacements.value;
            const placement = Object.keys(placements2).find((key2) => {
              var _a2, _b2;
              return placements2[key2].points[0] === ((_a2 = align.points) === null || _a2 === void 0 ? void 0 : _a2[0]) && placements2[key2].points[1] === ((_b2 = align.points) === null || _b2 === void 0 ? void 0 : _b2[1]);
            });
            if (placement) {
              const rect = domNode.getBoundingClientRect();
              const transformOrigin = {
                top: "50%",
                left: "50%"
              };
              if (placement.indexOf("top") >= 0 || placement.indexOf("Bottom") >= 0) {
                transformOrigin.top = `${rect.height - align.offset[1]}px`;
              } else if (placement.indexOf("Top") >= 0 || placement.indexOf("bottom") >= 0) {
                transformOrigin.top = `${-align.offset[1]}px`;
              }
              if (placement.indexOf("left") >= 0 || placement.indexOf("Right") >= 0) {
                transformOrigin.left = `${rect.width - align.offset[0]}px`;
              } else if (placement.indexOf("right") >= 0 || placement.indexOf("Left") >= 0) {
                transformOrigin.left = `${-align.offset[0]}px`;
              }
              domNode.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`;
            }
          };
          const colorInfo = vue.computed(() => parseColor(prefixCls.value, props.color));
          const injectFromPopover = vue.computed(() => attrs["data-popover-inject"]);
          const [wrapSSR, hashId] = useStyle$6(prefixCls, vue.computed(() => !injectFromPopover.value));
          return () => {
            var _a2, _b2;
            const {
              openClassName,
              overlayClassName,
              overlayStyle,
              overlayInnerStyle
            } = props;
            let children = (_b2 = filterEmpty((_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots))) !== null && _b2 !== void 0 ? _b2 : null;
            children = children.length === 1 ? children[0] : children;
            let tempVisible = innerOpen.value;
            if (mergedOpen.value === void 0 && isNoTitle()) {
              tempVisible = false;
            }
            if (!children) {
              return null;
            }
            const child = getDisabledCompatibleChildren(isValidElement(children) && !isFragment(children) ? children : vue.createVNode("span", null, [children]));
            const childCls = classNames({
              [openClassName || `${prefixCls.value}-open`]: true,
              [child.props && child.props.class]: child.props && child.props.class
            });
            const customOverlayClassName = classNames(overlayClassName, {
              [`${prefixCls.value}-rtl`]: direction.value === "rtl"
            }, colorInfo.value.className, hashId.value);
            const formattedOverlayInnerStyle = _extends(_extends({}, colorInfo.value.overlayStyle), overlayInnerStyle);
            const arrowContentStyle = colorInfo.value.arrowStyle;
            const vcTooltipProps = _extends(_extends(_extends({}, attrs), props), {
              prefixCls: prefixCls.value,
              getPopupContainer: getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
              builtinPlacements: tooltipPlacements.value,
              visible: tempVisible,
              ref: tooltip,
              overlayClassName: customOverlayClassName,
              overlayStyle: _extends(_extends({}, arrowContentStyle), overlayStyle),
              overlayInnerStyle: formattedOverlayInnerStyle,
              onVisibleChange: handleVisibleChange,
              onPopupAlign,
              transitionName: getTransitionName(rootPrefixCls.value, "zoom-big-fast", props.transitionName)
            });
            return wrapSSR(vue.createVNode(Tooltip$1, vcTooltipProps, {
              default: () => [innerOpen.value ? cloneElement(child, {
                class: childCls
              }) : child],
              arrowContent: () => vue.createVNode("span", {
                "class": `${prefixCls.value}-arrow-content`
              }, null),
              overlay: getOverlay
            }));
          };
        }
      });
      const Tooltip = withInstall(ToolTip);
      function UnitNumber(_ref) {
        let {
          prefixCls,
          value,
          current,
          offset = 0
        } = _ref;
        let style;
        if (offset) {
          style = {
            position: "absolute",
            top: `${offset}00%`,
            left: 0
          };
        }
        return vue.createVNode("p", {
          "style": style,
          "class": classNames(`${prefixCls}-only-unit`, {
            current
          })
        }, [value]);
      }
      function getOffset$2(start, end, unit) {
        let index2 = start;
        let offset = 0;
        while ((index2 + 10) % 10 !== end) {
          index2 += unit;
          offset += unit;
        }
        return offset;
      }
      const SingleNumber = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "SingleNumber",
        props: {
          prefixCls: String,
          value: String,
          count: Number
        },
        setup(props) {
          const originValue = vue.computed(() => Number(props.value));
          const originCount = vue.computed(() => Math.abs(props.count));
          const state = vue.reactive({
            prevValue: originValue.value,
            prevCount: originCount.value
          });
          const onTransitionEnd = () => {
            state.prevValue = originValue.value;
            state.prevCount = originCount.value;
          };
          const timeout = vue.ref();
          vue.watch(originValue, () => {
            clearTimeout(timeout.value);
            timeout.value = setTimeout(() => {
              onTransitionEnd();
            }, 1e3);
          }, {
            flush: "post"
          });
          vue.onUnmounted(() => {
            clearTimeout(timeout.value);
          });
          return () => {
            let unitNodes;
            let offsetStyle = {};
            const value = originValue.value;
            if (state.prevValue === value || Number.isNaN(value) || Number.isNaN(state.prevValue)) {
              unitNodes = [UnitNumber(_extends(_extends({}, props), {
                current: true
              }))];
              offsetStyle = {
                transition: "none"
              };
            } else {
              unitNodes = [];
              const end = value + 10;
              const unitNumberList = [];
              for (let index2 = value; index2 <= end; index2 += 1) {
                unitNumberList.push(index2);
              }
              const prevIndex = unitNumberList.findIndex((n2) => n2 % 10 === state.prevValue);
              unitNodes = unitNumberList.map((n2, index2) => {
                const singleUnit = n2 % 10;
                return UnitNumber(_extends(_extends({}, props), {
                  value: singleUnit,
                  offset: index2 - prevIndex,
                  current: index2 === prevIndex
                }));
              });
              const unit = state.prevCount < originCount.value ? 1 : -1;
              offsetStyle = {
                transform: `translateY(${-getOffset$2(state.prevValue, value, unit)}00%)`
              };
            }
            return vue.createVNode("span", {
              "class": `${props.prefixCls}-only`,
              "style": offsetStyle,
              "onTransitionend": () => onTransitionEnd()
            }, [unitNodes]);
          };
        }
      });
      var __rest$8 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const scrollNumberProps = {
        prefixCls: String,
        count: PropTypes$1.any,
        component: String,
        title: PropTypes$1.any,
        show: Boolean
      };
      const ScrollNumber = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "ScrollNumber",
        inheritAttrs: false,
        props: scrollNumberProps,
        setup(props, _ref) {
          let {
            attrs,
            slots
          } = _ref;
          const {
            prefixCls
          } = useConfigInject("scroll-number", props);
          return () => {
            var _a2;
            const _b2 = _extends(_extends({}, props), attrs), {
              prefixCls: customizePrefixCls,
              count,
              title,
              show,
              component: Tag = "sup",
              class: className,
              style
            } = _b2, restProps = __rest$8(_b2, ["prefixCls", "count", "title", "show", "component", "class", "style"]);
            const newProps = _extends(_extends({}, restProps), {
              style,
              "data-show": props.show,
              class: classNames(prefixCls.value, className),
              title
            });
            let numberNodes = count;
            if (count && Number(count) % 1 === 0) {
              const numberList = String(count).split("");
              numberNodes = numberList.map((num, i2) => vue.createVNode(SingleNumber, {
                "prefixCls": prefixCls.value,
                "count": Number(count),
                "value": num,
                "key": numberList.length - i2
              }, null));
            }
            if (style && style.borderColor) {
              newProps.style = _extends(_extends({}, style), {
                boxShadow: `0 0 0 1px ${style.borderColor} inset`
              });
            }
            const children = filterEmpty((_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots));
            if (children && children.length) {
              return cloneElement(children, {
                class: classNames(`${prefixCls.value}-custom-component`)
              }, false);
            }
            return vue.createVNode(Tag, newProps, {
              default: () => [numberNodes]
            });
          };
        }
      });
      const antStatusProcessing = new Keyframes("antStatusProcessing", {
        "0%": {
          transform: "scale(0.8)",
          opacity: 0.5
        },
        "100%": {
          transform: "scale(2.4)",
          opacity: 0
        }
      });
      const antZoomBadgeIn = new Keyframes("antZoomBadgeIn", {
        "0%": {
          transform: "scale(0) translate(50%, -50%)",
          opacity: 0
        },
        "100%": {
          transform: "scale(1) translate(50%, -50%)"
        }
      });
      const antZoomBadgeOut = new Keyframes("antZoomBadgeOut", {
        "0%": {
          transform: "scale(1) translate(50%, -50%)"
        },
        "100%": {
          transform: "scale(0) translate(50%, -50%)",
          opacity: 0
        }
      });
      const antNoWrapperZoomBadgeIn = new Keyframes("antNoWrapperZoomBadgeIn", {
        "0%": {
          transform: "scale(0)",
          opacity: 0
        },
        "100%": {
          transform: "scale(1)"
        }
      });
      const antNoWrapperZoomBadgeOut = new Keyframes("antNoWrapperZoomBadgeOut", {
        "0%": {
          transform: "scale(1)"
        },
        "100%": {
          transform: "scale(0)",
          opacity: 0
        }
      });
      const antBadgeLoadingCircle = new Keyframes("antBadgeLoadingCircle", {
        "0%": {
          transformOrigin: "50%"
        },
        "100%": {
          transform: "translate(50%, -50%) rotate(360deg)",
          transformOrigin: "50%"
        }
      });
      const genSharedBadgeStyle = (token2) => {
        const {
          componentCls,
          iconCls,
          antCls,
          badgeFontHeight,
          badgeShadowSize,
          badgeHeightSm,
          motionDurationSlow,
          badgeStatusSize,
          marginXS,
          badgeRibbonOffset
        } = token2;
        const numberPrefixCls = `${antCls}-scroll-number`;
        const ribbonPrefixCls = `${antCls}-ribbon`;
        const ribbonWrapperPrefixCls = `${antCls}-ribbon-wrapper`;
        const colorPreset = genPresetColor(token2, (colorKey, _ref) => {
          let {
            darkColor
          } = _ref;
          return {
            [`&${componentCls} ${componentCls}-color-${colorKey}`]: {
              background: darkColor,
              [`&:not(${componentCls}-count)`]: {
                color: darkColor
              }
            }
          };
        });
        const statusRibbonPreset = genPresetColor(token2, (colorKey, _ref2) => {
          let {
            darkColor
          } = _ref2;
          return {
            [`&${ribbonPrefixCls}-color-${colorKey}`]: {
              background: darkColor,
              color: darkColor
            }
          };
        });
        return {
          [componentCls]: _extends(_extends(_extends(_extends({}, resetComponent(token2)), {
            position: "relative",
            display: "inline-block",
            width: "fit-content",
            lineHeight: 1,
            [`${componentCls}-count`]: {
              zIndex: token2.badgeZIndex,
              minWidth: token2.badgeHeight,
              height: token2.badgeHeight,
              color: token2.badgeTextColor,
              fontWeight: token2.badgeFontWeight,
              fontSize: token2.badgeFontSize,
              lineHeight: `${token2.badgeHeight}px`,
              whiteSpace: "nowrap",
              textAlign: "center",
              background: token2.badgeColor,
              borderRadius: token2.badgeHeight / 2,
              boxShadow: `0 0 0 ${badgeShadowSize}px ${token2.badgeShadowColor}`,
              transition: `background ${token2.motionDurationMid}`,
              a: {
                color: token2.badgeTextColor
              },
              "a:hover": {
                color: token2.badgeTextColor
              },
              "a:hover &": {
                background: token2.badgeColorHover
              }
            },
            [`${componentCls}-count-sm`]: {
              minWidth: badgeHeightSm,
              height: badgeHeightSm,
              fontSize: token2.badgeFontSizeSm,
              lineHeight: `${badgeHeightSm}px`,
              borderRadius: badgeHeightSm / 2
            },
            [`${componentCls}-multiple-words`]: {
              padding: `0 ${token2.paddingXS}px`
            },
            [`${componentCls}-dot`]: {
              zIndex: token2.badgeZIndex,
              width: token2.badgeDotSize,
              minWidth: token2.badgeDotSize,
              height: token2.badgeDotSize,
              background: token2.badgeColor,
              borderRadius: "100%",
              boxShadow: `0 0 0 ${badgeShadowSize}px ${token2.badgeShadowColor}`
            },
            [`${componentCls}-dot${numberPrefixCls}`]: {
              transition: `background ${motionDurationSlow}`
            },
            [`${componentCls}-count, ${componentCls}-dot, ${numberPrefixCls}-custom-component`]: {
              position: "absolute",
              top: 0,
              insetInlineEnd: 0,
              transform: "translate(50%, -50%)",
              transformOrigin: "100% 0%",
              [`&${iconCls}-spin`]: {
                animationName: antBadgeLoadingCircle,
                animationDuration: "1s",
                animationIterationCount: "infinite",
                animationTimingFunction: "linear"
              }
            },
            [`&${componentCls}-status`]: {
              lineHeight: "inherit",
              verticalAlign: "baseline",
              [`${componentCls}-status-dot`]: {
                position: "relative",
                top: -1,
                display: "inline-block",
                width: badgeStatusSize,
                height: badgeStatusSize,
                verticalAlign: "middle",
                borderRadius: "50%"
              },
              [`${componentCls}-status-success`]: {
                backgroundColor: token2.colorSuccess
              },
              [`${componentCls}-status-processing`]: {
                overflow: "visible",
                color: token2.colorPrimary,
                backgroundColor: token2.colorPrimary,
                "&::after": {
                  position: "absolute",
                  top: 0,
                  insetInlineStart: 0,
                  width: "100%",
                  height: "100%",
                  borderWidth: badgeShadowSize,
                  borderStyle: "solid",
                  borderColor: "inherit",
                  borderRadius: "50%",
                  animationName: antStatusProcessing,
                  animationDuration: token2.badgeProcessingDuration,
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                  content: '""'
                }
              },
              [`${componentCls}-status-default`]: {
                backgroundColor: token2.colorTextPlaceholder
              },
              [`${componentCls}-status-error`]: {
                backgroundColor: token2.colorError
              },
              [`${componentCls}-status-warning`]: {
                backgroundColor: token2.colorWarning
              },
              [`${componentCls}-status-text`]: {
                marginInlineStart: marginXS,
                color: token2.colorText,
                fontSize: token2.fontSize
              }
            }
          }), colorPreset), {
            [`${componentCls}-zoom-appear, ${componentCls}-zoom-enter`]: {
              animationName: antZoomBadgeIn,
              animationDuration: token2.motionDurationSlow,
              animationTimingFunction: token2.motionEaseOutBack,
              animationFillMode: "both"
            },
            [`${componentCls}-zoom-leave`]: {
              animationName: antZoomBadgeOut,
              animationDuration: token2.motionDurationSlow,
              animationTimingFunction: token2.motionEaseOutBack,
              animationFillMode: "both"
            },
            [`&${componentCls}-not-a-wrapper`]: {
              [`${componentCls}-zoom-appear, ${componentCls}-zoom-enter`]: {
                animationName: antNoWrapperZoomBadgeIn,
                animationDuration: token2.motionDurationSlow,
                animationTimingFunction: token2.motionEaseOutBack
              },
              [`${componentCls}-zoom-leave`]: {
                animationName: antNoWrapperZoomBadgeOut,
                animationDuration: token2.motionDurationSlow,
                animationTimingFunction: token2.motionEaseOutBack
              },
              [`&:not(${componentCls}-status)`]: {
                verticalAlign: "middle"
              },
              [`${numberPrefixCls}-custom-component, ${componentCls}-count`]: {
                transform: "none"
              },
              [`${numberPrefixCls}-custom-component, ${numberPrefixCls}`]: {
                position: "relative",
                top: "auto",
                display: "block",
                transformOrigin: "50% 50%"
              }
            },
            [`${numberPrefixCls}`]: {
              overflow: "hidden",
              [`${numberPrefixCls}-only`]: {
                position: "relative",
                display: "inline-block",
                height: token2.badgeHeight,
                transition: `all ${token2.motionDurationSlow} ${token2.motionEaseOutBack}`,
                WebkitTransformStyle: "preserve-3d",
                WebkitBackfaceVisibility: "hidden",
                [`> p${numberPrefixCls}-only-unit`]: {
                  height: token2.badgeHeight,
                  margin: 0,
                  WebkitTransformStyle: "preserve-3d",
                  WebkitBackfaceVisibility: "hidden"
                }
              },
              [`${numberPrefixCls}-symbol`]: {
                verticalAlign: "top"
              }
            },
            // ====================== RTL =======================
            "&-rtl": {
              direction: "rtl",
              [`${componentCls}-count, ${componentCls}-dot, ${numberPrefixCls}-custom-component`]: {
                transform: "translate(-50%, -50%)"
              }
            }
          }),
          [`${ribbonWrapperPrefixCls}`]: {
            position: "relative"
          },
          [`${ribbonPrefixCls}`]: _extends(_extends(_extends(_extends({}, resetComponent(token2)), {
            position: "absolute",
            top: marginXS,
            padding: `0 ${token2.paddingXS}px`,
            color: token2.colorPrimary,
            lineHeight: `${badgeFontHeight}px`,
            whiteSpace: "nowrap",
            backgroundColor: token2.colorPrimary,
            borderRadius: token2.borderRadiusSM,
            [`${ribbonPrefixCls}-text`]: {
              color: token2.colorTextLightSolid
            },
            [`${ribbonPrefixCls}-corner`]: {
              position: "absolute",
              top: "100%",
              width: badgeRibbonOffset,
              height: badgeRibbonOffset,
              color: "currentcolor",
              border: `${badgeRibbonOffset / 2}px solid`,
              transform: token2.badgeRibbonCornerTransform,
              transformOrigin: "top",
              filter: token2.badgeRibbonCornerFilter
            }
          }), statusRibbonPreset), {
            [`&${ribbonPrefixCls}-placement-end`]: {
              insetInlineEnd: -badgeRibbonOffset,
              borderEndEndRadius: 0,
              [`${ribbonPrefixCls}-corner`]: {
                insetInlineEnd: 0,
                borderInlineEndColor: "transparent",
                borderBlockEndColor: "transparent"
              }
            },
            [`&${ribbonPrefixCls}-placement-start`]: {
              insetInlineStart: -badgeRibbonOffset,
              borderEndStartRadius: 0,
              [`${ribbonPrefixCls}-corner`]: {
                insetInlineStart: 0,
                borderBlockEndColor: "transparent",
                borderInlineStartColor: "transparent"
              }
            },
            // ====================== RTL =======================
            "&-rtl": {
              direction: "rtl"
            }
          })
        };
      };
      const useStyle$5 = genComponentStyleHook("Badge", (token2) => {
        const {
          fontSize,
          lineHeight,
          fontSizeSM,
          lineWidth,
          marginXS,
          colorBorderBg
        } = token2;
        const badgeFontHeight = Math.round(fontSize * lineHeight);
        const badgeShadowSize = lineWidth;
        const badgeZIndex = "auto";
        const badgeHeight = badgeFontHeight - 2 * badgeShadowSize;
        const badgeTextColor = token2.colorBgContainer;
        const badgeFontWeight = "normal";
        const badgeFontSize = fontSizeSM;
        const badgeColor = token2.colorError;
        const badgeColorHover = token2.colorErrorHover;
        const badgeHeightSm = fontSize;
        const badgeDotSize = fontSizeSM / 2;
        const badgeFontSizeSm = fontSizeSM;
        const badgeStatusSize = fontSizeSM / 2;
        const badgeToken = merge(token2, {
          badgeFontHeight,
          badgeShadowSize,
          badgeZIndex,
          badgeHeight,
          badgeTextColor,
          badgeFontWeight,
          badgeFontSize,
          badgeColor,
          badgeColorHover,
          badgeShadowColor: colorBorderBg,
          badgeHeightSm,
          badgeDotSize,
          badgeFontSizeSm,
          badgeStatusSize,
          badgeProcessingDuration: "1.2s",
          badgeRibbonOffset: marginXS,
          // Follow token just by Design. Not related with token
          badgeRibbonCornerTransform: "scaleY(0.75)",
          badgeRibbonCornerFilter: `brightness(75%)`
        });
        return [genSharedBadgeStyle(badgeToken)];
      });
      var __rest$7 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const ribbonProps = () => ({
        prefix: String,
        color: {
          type: String
        },
        text: PropTypes$1.any,
        placement: {
          type: String,
          default: "end"
        }
      });
      const Ribbon = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "ABadgeRibbon",
        inheritAttrs: false,
        props: ribbonProps(),
        slots: Object,
        setup(props, _ref) {
          let {
            attrs,
            slots
          } = _ref;
          const {
            prefixCls,
            direction
          } = useConfigInject("ribbon", props);
          const [wrapSSR, hashId] = useStyle$5(prefixCls);
          const colorInPreset = vue.computed(() => isPresetColor(props.color, false));
          const ribbonCls = vue.computed(() => [prefixCls.value, `${prefixCls.value}-placement-${props.placement}`, {
            [`${prefixCls.value}-rtl`]: direction.value === "rtl",
            [`${prefixCls.value}-color-${props.color}`]: colorInPreset.value
          }]);
          return () => {
            var _a2, _b2;
            const {
              class: className,
              style
            } = attrs, restAttrs = __rest$7(attrs, ["class", "style"]);
            const colorStyle = {};
            const cornerColorStyle = {};
            if (props.color && !colorInPreset.value) {
              colorStyle.background = props.color;
              cornerColorStyle.color = props.color;
            }
            return wrapSSR(vue.createVNode("div", _objectSpread2$1({
              "class": `${prefixCls.value}-wrapper ${hashId.value}`
            }, restAttrs), [(_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots), vue.createVNode("div", {
              "class": [ribbonCls.value, className, hashId.value],
              "style": _extends(_extends({}, colorStyle), style)
            }, [vue.createVNode("span", {
              "class": `${prefixCls.value}-text`
            }, [props.text || ((_b2 = slots.text) === null || _b2 === void 0 ? void 0 : _b2.call(slots))]), vue.createVNode("div", {
              "class": `${prefixCls.value}-corner`,
              "style": cornerColorStyle
            }, null)])]));
          };
        }
      });
      const isNumeric = (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
      };
      const isNumeric$1 = isNumeric;
      const badgeProps = () => ({
        /** Number to show in badge */
        count: PropTypes$1.any.def(null),
        showZero: {
          type: Boolean,
          default: void 0
        },
        /** Max count to show */
        overflowCount: {
          type: Number,
          default: 99
        },
        /** whether to show red dot without number */
        dot: {
          type: Boolean,
          default: void 0
        },
        prefixCls: String,
        scrollNumberPrefixCls: String,
        status: {
          type: String
        },
        size: {
          type: String,
          default: "default"
        },
        color: String,
        text: PropTypes$1.any,
        offset: Array,
        numberStyle: {
          type: Object,
          default: void 0
        },
        title: String
      });
      const Badge = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "ABadge",
        Ribbon,
        inheritAttrs: false,
        props: badgeProps(),
        slots: Object,
        setup(props, _ref) {
          let {
            slots,
            attrs
          } = _ref;
          const {
            prefixCls,
            direction
          } = useConfigInject("badge", props);
          const [wrapSSR, hashId] = useStyle$5(prefixCls);
          const numberedDisplayCount = vue.computed(() => {
            return props.count > props.overflowCount ? `${props.overflowCount}+` : props.count;
          });
          const isZero = vue.computed(() => numberedDisplayCount.value === "0" || numberedDisplayCount.value === 0);
          const ignoreCount = vue.computed(() => props.count === null || isZero.value && !props.showZero);
          const hasStatus = vue.computed(() => (props.status !== null && props.status !== void 0 || props.color !== null && props.color !== void 0) && ignoreCount.value);
          const showAsDot = vue.computed(() => props.dot && !isZero.value);
          const mergedCount = vue.computed(() => showAsDot.value ? "" : numberedDisplayCount.value);
          const isHidden = vue.computed(() => {
            const isEmpty = mergedCount.value === null || mergedCount.value === void 0 || mergedCount.value === "";
            return (isEmpty || isZero.value && !props.showZero) && !showAsDot.value;
          });
          const livingCount = vue.ref(props.count);
          const displayCount = vue.ref(mergedCount.value);
          const isDotRef = vue.ref(showAsDot.value);
          vue.watch([() => props.count, mergedCount, showAsDot], () => {
            if (!isHidden.value) {
              livingCount.value = props.count;
              displayCount.value = mergedCount.value;
              isDotRef.value = showAsDot.value;
            }
          }, {
            immediate: true
          });
          const isInternalColor = vue.computed(() => isPresetColor(props.color, false));
          const statusCls = vue.computed(() => ({
            [`${prefixCls.value}-status-dot`]: hasStatus.value,
            [`${prefixCls.value}-status-${props.status}`]: !!props.status,
            [`${prefixCls.value}-color-${props.color}`]: isInternalColor.value
          }));
          const statusStyle = vue.computed(() => {
            if (props.color && !isInternalColor.value) {
              return {
                background: props.color,
                color: props.color
              };
            } else {
              return {};
            }
          });
          const scrollNumberCls = vue.computed(() => ({
            [`${prefixCls.value}-dot`]: isDotRef.value,
            [`${prefixCls.value}-count`]: !isDotRef.value,
            [`${prefixCls.value}-count-sm`]: props.size === "small",
            [`${prefixCls.value}-multiple-words`]: !isDotRef.value && displayCount.value && displayCount.value.toString().length > 1,
            [`${prefixCls.value}-status-${props.status}`]: !!props.status,
            [`${prefixCls.value}-color-${props.color}`]: isInternalColor.value
          }));
          return () => {
            var _a2, _b2;
            const {
              offset,
              title,
              color
            } = props;
            const style = attrs.style;
            const text = getPropsSlot(slots, props, "text");
            const pre = prefixCls.value;
            const count = livingCount.value;
            let children = flattenChildren((_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots));
            children = children.length ? children : null;
            const visible = !!(!isHidden.value || slots.count);
            const mergedStyle = (() => {
              if (!offset) {
                return _extends({}, style);
              }
              const offsetStyle = {
                marginTop: isNumeric$1(offset[1]) ? `${offset[1]}px` : offset[1]
              };
              if (direction.value === "rtl") {
                offsetStyle.left = `${parseInt(offset[0], 10)}px`;
              } else {
                offsetStyle.right = `${-parseInt(offset[0], 10)}px`;
              }
              return _extends(_extends({}, offsetStyle), style);
            })();
            const titleNode = title !== null && title !== void 0 ? title : typeof count === "string" || typeof count === "number" ? count : void 0;
            const statusTextNode = visible || !text ? null : vue.createVNode("span", {
              "class": `${pre}-status-text`
            }, [text]);
            const displayNode = typeof count === "object" || count === void 0 && slots.count ? cloneElement(count !== null && count !== void 0 ? count : (_b2 = slots.count) === null || _b2 === void 0 ? void 0 : _b2.call(slots), {
              style: mergedStyle
            }, false) : null;
            const badgeClassName = classNames(pre, {
              [`${pre}-status`]: hasStatus.value,
              [`${pre}-not-a-wrapper`]: !children,
              [`${pre}-rtl`]: direction.value === "rtl"
            }, attrs.class, hashId.value);
            if (!children && hasStatus.value) {
              const statusTextColor = mergedStyle.color;
              return wrapSSR(vue.createVNode("span", _objectSpread2$1(_objectSpread2$1({}, attrs), {}, {
                "class": badgeClassName,
                "style": mergedStyle
              }), [vue.createVNode("span", {
                "class": statusCls.value,
                "style": statusStyle.value
              }, null), vue.createVNode("span", {
                "style": {
                  color: statusTextColor
                },
                "class": `${pre}-status-text`
              }, [text])]));
            }
            const transitionProps = getTransitionProps(children ? `${pre}-zoom` : "", {
              appear: false
            });
            let scrollNumberStyle = _extends(_extends({}, mergedStyle), props.numberStyle);
            if (color && !isInternalColor.value) {
              scrollNumberStyle = scrollNumberStyle || {};
              scrollNumberStyle.background = color;
            }
            return wrapSSR(vue.createVNode("span", _objectSpread2$1(_objectSpread2$1({}, attrs), {}, {
              "class": badgeClassName
            }), [children, vue.createVNode(vue.Transition, transitionProps, {
              default: () => [vue.withDirectives(vue.createVNode(ScrollNumber, {
                "prefixCls": props.scrollNumberPrefixCls,
                "show": visible,
                "class": scrollNumberCls.value,
                "count": displayCount.value,
                "title": titleNode,
                "style": scrollNumberStyle,
                "key": "scrollNumber"
              }, {
                default: () => [displayNode]
              }), [[vue.vShow, visible]])]
            }), statusTextNode]));
          };
        }
      });
      Badge.install = function(app) {
        app.component(Badge.name, Badge);
        app.component(Ribbon.name, Ribbon);
        return app;
      };
      let runtimeLocale = _extends({}, defaultLocale.Modal);
      function changeConfirmLocale(newLocale) {
        if (newLocale) {
          runtimeLocale = _extends(_extends({}, runtimeLocale), newLocale);
        } else {
          runtimeLocale = _extends({}, defaultLocale.Modal);
        }
      }
      const ANT_MARK = "internalMark";
      const LocaleProvider = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "ALocaleProvider",
        props: {
          locale: {
            type: Object
          },
          ANT_MARK__: String
        },
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          warning$2(props.ANT_MARK__ === ANT_MARK);
          const state = vue.reactive({
            antLocale: _extends(_extends({}, props.locale), {
              exist: true
            }),
            ANT_MARK__: ANT_MARK
          });
          vue.provide("localeData", state);
          vue.watch(() => props.locale, (locale2) => {
            changeConfirmLocale(locale2 && locale2.Modal);
            state.antLocale = _extends(_extends({}, locale2), {
              exist: true
            });
          }, {
            immediate: true
          });
          return () => {
            var _a2;
            return (_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots);
          };
        }
      });
      LocaleProvider.install = function(app) {
        app.component(LocaleProvider.name, LocaleProvider);
        return app;
      };
      const locale = withInstall(LocaleProvider);
      const Notice = vue.defineComponent({
        name: "Notice",
        inheritAttrs: false,
        props: ["prefixCls", "duration", "updateMark", "noticeKey", "closeIcon", "closable", "props", "onClick", "onClose", "holder", "visible"],
        setup(props, _ref) {
          let {
            attrs,
            slots
          } = _ref;
          let closeTimer;
          let isUnMounted = false;
          const duration = vue.computed(() => props.duration === void 0 ? 4.5 : props.duration);
          const startCloseTimer = () => {
            if (duration.value && !isUnMounted) {
              closeTimer = setTimeout(() => {
                close();
              }, duration.value * 1e3);
            }
          };
          const clearCloseTimer = () => {
            if (closeTimer) {
              clearTimeout(closeTimer);
              closeTimer = null;
            }
          };
          const close = (e2) => {
            if (e2) {
              e2.stopPropagation();
            }
            clearCloseTimer();
            const {
              onClose,
              noticeKey
            } = props;
            if (onClose) {
              onClose(noticeKey);
            }
          };
          const restartCloseTimer = () => {
            clearCloseTimer();
            startCloseTimer();
          };
          vue.onMounted(() => {
            startCloseTimer();
          });
          vue.onUnmounted(() => {
            isUnMounted = true;
            clearCloseTimer();
          });
          vue.watch([duration, () => props.updateMark, () => props.visible], (_ref2, _ref3) => {
            let [preDuration, preUpdateMark, preVisible] = _ref2;
            let [newDuration, newUpdateMark, newVisible] = _ref3;
            if (preDuration !== newDuration || preUpdateMark !== newUpdateMark || preVisible !== newVisible && newVisible) {
              restartCloseTimer();
            }
          }, {
            flush: "post"
          });
          return () => {
            var _a2, _b2;
            const {
              prefixCls,
              closable,
              closeIcon = (_a2 = slots.closeIcon) === null || _a2 === void 0 ? void 0 : _a2.call(slots),
              onClick,
              holder
            } = props;
            const {
              class: className,
              style
            } = attrs;
            const componentClass = `${prefixCls}-notice`;
            const dataOrAriaAttributeProps = Object.keys(attrs).reduce((acc, key2) => {
              if (key2.startsWith("data-") || key2.startsWith("aria-") || key2 === "role") {
                acc[key2] = attrs[key2];
              }
              return acc;
            }, {});
            const node2 = vue.createVNode("div", _objectSpread2$1({
              "class": classNames(componentClass, className, {
                [`${componentClass}-closable`]: closable
              }),
              "style": style,
              "onMouseenter": clearCloseTimer,
              "onMouseleave": startCloseTimer,
              "onClick": onClick
            }, dataOrAriaAttributeProps), [vue.createVNode("div", {
              "class": `${componentClass}-content`
            }, [(_b2 = slots.default) === null || _b2 === void 0 ? void 0 : _b2.call(slots)]), closable ? vue.createVNode("a", {
              "tabindex": 0,
              "onClick": close,
              "class": `${componentClass}-close`
            }, [closeIcon || vue.createVNode("span", {
              "class": `${componentClass}-close-x`
            }, null)]) : null]);
            if (holder) {
              return vue.createVNode(vue.Teleport, {
                "to": holder
              }, {
                default: () => node2
              });
            }
            return node2;
          };
        }
      });
      var __rest$6 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      let seed$1 = 0;
      const now$1 = Date.now();
      function getUuid$1() {
        const id = seed$1;
        seed$1 += 1;
        return `rcNotification_${now$1}_${id}`;
      }
      const Notification$1 = vue.defineComponent({
        name: "Notification",
        inheritAttrs: false,
        props: ["prefixCls", "transitionName", "animation", "maxCount", "closeIcon", "hashId"],
        setup(props, _ref) {
          let {
            attrs,
            expose,
            slots
          } = _ref;
          const hookRefs = /* @__PURE__ */ new Map();
          const notices = vue.ref([]);
          const transitionProps = vue.computed(() => {
            const {
              prefixCls,
              animation = "fade"
            } = props;
            let name = props.transitionName;
            if (!name && animation) {
              name = `${prefixCls}-${animation}`;
            }
            return getTransitionGroupProps(name);
          });
          const add = (originNotice, holderCallback) => {
            const key2 = originNotice.key || getUuid$1();
            const notice2 = _extends(_extends({}, originNotice), {
              key: key2
            });
            const {
              maxCount: maxCount2
            } = props;
            const noticeIndex = notices.value.map((v2) => v2.notice.key).indexOf(key2);
            const updatedNotices = notices.value.concat();
            if (noticeIndex !== -1) {
              updatedNotices.splice(noticeIndex, 1, {
                notice: notice2,
                holderCallback
              });
            } else {
              if (maxCount2 && notices.value.length >= maxCount2) {
                notice2.key = updatedNotices[0].notice.key;
                notice2.updateMark = getUuid$1();
                notice2.userPassKey = key2;
                updatedNotices.shift();
              }
              updatedNotices.push({
                notice: notice2,
                holderCallback
              });
            }
            notices.value = updatedNotices;
          };
          const remove = (removeKey) => {
            notices.value = notices.value.filter((_ref2) => {
              let {
                notice: {
                  key: key2,
                  userPassKey
                }
              } = _ref2;
              const mergedKey = userPassKey || key2;
              return mergedKey !== removeKey;
            });
          };
          expose({
            add,
            remove,
            notices
          });
          return () => {
            var _a2;
            const {
              prefixCls,
              closeIcon = (_a2 = slots.closeIcon) === null || _a2 === void 0 ? void 0 : _a2.call(slots, {
                prefixCls
              })
            } = props;
            const noticeNodes = notices.value.map((_ref3, index2) => {
              let {
                notice: notice2,
                holderCallback
              } = _ref3;
              const updateMark = index2 === notices.value.length - 1 ? notice2.updateMark : void 0;
              const {
                key: key2,
                userPassKey
              } = notice2;
              const {
                content
              } = notice2;
              const noticeProps = _extends(_extends(_extends({
                prefixCls,
                closeIcon: typeof closeIcon === "function" ? closeIcon({
                  prefixCls
                }) : closeIcon
              }, notice2), notice2.props), {
                key: key2,
                noticeKey: userPassKey || key2,
                updateMark,
                onClose: (noticeKey) => {
                  var _a3;
                  remove(noticeKey);
                  (_a3 = notice2.onClose) === null || _a3 === void 0 ? void 0 : _a3.call(notice2);
                },
                onClick: notice2.onClick
              });
              if (holderCallback) {
                return vue.createVNode("div", {
                  "key": key2,
                  "class": `${prefixCls}-hook-holder`,
                  "ref": (div) => {
                    if (typeof key2 === "undefined") {
                      return;
                    }
                    if (div) {
                      hookRefs.set(key2, div);
                      holderCallback(div, noticeProps);
                    } else {
                      hookRefs.delete(key2);
                    }
                  }
                }, null);
              }
              return vue.createVNode(Notice, _objectSpread2$1(_objectSpread2$1({}, noticeProps), {}, {
                "class": classNames(noticeProps.class, props.hashId)
              }), {
                default: () => [typeof content === "function" ? content({
                  prefixCls
                }) : content]
              });
            });
            const className = {
              [prefixCls]: 1,
              [attrs.class]: !!attrs.class,
              [props.hashId]: true
            };
            return vue.createVNode("div", {
              "class": className,
              "style": attrs.style || {
                top: "65px",
                left: "50%"
              }
            }, [vue.createVNode(vue.TransitionGroup, _objectSpread2$1({
              "tag": "div"
            }, transitionProps.value), {
              default: () => [noticeNodes]
            })]);
          };
        }
      });
      Notification$1.newInstance = function newNotificationInstance(properties, callback) {
        const _a2 = properties || {}, {
          name = "notification",
          getContainer: getContainer2,
          appContext,
          prefixCls: customizePrefixCls,
          rootPrefixCls: customRootPrefixCls,
          transitionName: customTransitionName,
          hasTransitionName: hasTransitionName2,
          useStyle: useStyle2
        } = _a2, props = __rest$6(_a2, ["name", "getContainer", "appContext", "prefixCls", "rootPrefixCls", "transitionName", "hasTransitionName", "useStyle"]);
        const div = document.createElement("div");
        if (getContainer2) {
          const root2 = getContainer2();
          root2.appendChild(div);
        } else {
          document.body.appendChild(div);
        }
        const Wrapper = vue.defineComponent({
          compatConfig: {
            MODE: 3
          },
          name: "NotificationWrapper",
          setup(_props, _ref4) {
            let {
              attrs
            } = _ref4;
            const notiRef = vue.shallowRef();
            const prefixCls = vue.computed(() => globalConfigForApi.getPrefixCls(name, customizePrefixCls));
            const [, hashId] = useStyle2(prefixCls);
            vue.onMounted(() => {
              callback({
                notice(noticeProps) {
                  var _a3;
                  (_a3 = notiRef.value) === null || _a3 === void 0 ? void 0 : _a3.add(noticeProps);
                },
                removeNotice(key2) {
                  var _a3;
                  (_a3 = notiRef.value) === null || _a3 === void 0 ? void 0 : _a3.remove(key2);
                },
                destroy() {
                  vue.render(null, div);
                  if (div.parentNode) {
                    div.parentNode.removeChild(div);
                  }
                },
                component: notiRef
              });
            });
            return () => {
              const global2 = globalConfigForApi;
              const rootPrefixCls = global2.getRootPrefixCls(customRootPrefixCls, prefixCls.value);
              const transitionName2 = hasTransitionName2 ? customTransitionName : `${prefixCls.value}-${customTransitionName}`;
              return vue.createVNode(ConfigProvider$1, _objectSpread2$1(_objectSpread2$1({}, global2), {}, {
                "prefixCls": rootPrefixCls
              }), {
                default: () => [vue.createVNode(Notification$1, _objectSpread2$1(_objectSpread2$1({
                  "ref": notiRef
                }, attrs), {}, {
                  "prefixCls": prefixCls.value,
                  "transitionName": transitionName2,
                  "hashId": hashId.value
                }), null)]
              });
            };
          }
        });
        const vm = vue.createVNode(Wrapper, props);
        vm.appContext = appContext || vm.appContext;
        vue.render(vm, div);
      };
      const Notification$2 = Notification$1;
      let seed = 0;
      const now = Date.now();
      function getUuid() {
        const id = seed;
        seed += 1;
        return `rcNotification_${now}_${id}`;
      }
      const Notification = vue.defineComponent({
        name: "HookNotification",
        inheritAttrs: false,
        props: ["prefixCls", "transitionName", "animation", "maxCount", "closeIcon", "hashId", "remove", "notices", "getStyles", "getClassName", "onAllRemoved", "getContainer"],
        setup(props, _ref) {
          let {
            attrs,
            slots
          } = _ref;
          const hookRefs = /* @__PURE__ */ new Map();
          const notices = vue.computed(() => props.notices);
          const transitionProps = vue.computed(() => {
            let name = props.transitionName;
            if (!name && props.animation) {
              switch (typeof props.animation) {
                case "string":
                  name = props.animation;
                  break;
                case "function":
                  name = props.animation().name;
                  break;
                case "object":
                  name = props.animation.name;
                  break;
                default:
                  name = `${props.prefixCls}-fade`;
                  break;
              }
            }
            return getTransitionGroupProps(name);
          });
          const remove = (key2) => props.remove(key2);
          const placements2 = vue.ref({});
          vue.watch(notices, () => {
            const nextPlacements = {};
            Object.keys(placements2.value).forEach((placement) => {
              nextPlacements[placement] = [];
            });
            props.notices.forEach((config) => {
              const {
                placement = "topRight"
              } = config.notice;
              if (placement) {
                nextPlacements[placement] = nextPlacements[placement] || [];
                nextPlacements[placement].push(config);
              }
            });
            placements2.value = nextPlacements;
          });
          const placementList = vue.computed(() => Object.keys(placements2.value));
          return () => {
            var _a2;
            const {
              prefixCls,
              closeIcon = (_a2 = slots.closeIcon) === null || _a2 === void 0 ? void 0 : _a2.call(slots, {
                prefixCls
              })
            } = props;
            const noticeNodes = placementList.value.map((placement) => {
              var _a3, _b2;
              const noticesForPlacement = placements2.value[placement];
              const classes = (_a3 = props.getClassName) === null || _a3 === void 0 ? void 0 : _a3.call(props, placement);
              const styles = (_b2 = props.getStyles) === null || _b2 === void 0 ? void 0 : _b2.call(props, placement);
              const noticeNodesForPlacement = noticesForPlacement.map((_ref2, index2) => {
                let {
                  notice: notice2,
                  holderCallback
                } = _ref2;
                const updateMark = index2 === notices.value.length - 1 ? notice2.updateMark : void 0;
                const {
                  key: key2,
                  userPassKey
                } = notice2;
                const {
                  content
                } = notice2;
                const noticeProps = _extends(_extends(_extends({
                  prefixCls,
                  closeIcon: typeof closeIcon === "function" ? closeIcon({
                    prefixCls
                  }) : closeIcon
                }, notice2), notice2.props), {
                  key: key2,
                  noticeKey: userPassKey || key2,
                  updateMark,
                  onClose: (noticeKey) => {
                    var _a4;
                    remove(noticeKey);
                    (_a4 = notice2.onClose) === null || _a4 === void 0 ? void 0 : _a4.call(notice2);
                  },
                  onClick: notice2.onClick
                });
                if (holderCallback) {
                  return vue.createVNode("div", {
                    "key": key2,
                    "class": `${prefixCls}-hook-holder`,
                    "ref": (div) => {
                      if (typeof key2 === "undefined") {
                        return;
                      }
                      if (div) {
                        hookRefs.set(key2, div);
                        holderCallback(div, noticeProps);
                      } else {
                        hookRefs.delete(key2);
                      }
                    }
                  }, null);
                }
                return vue.createVNode(Notice, _objectSpread2$1(_objectSpread2$1({}, noticeProps), {}, {
                  "class": classNames(noticeProps.class, props.hashId)
                }), {
                  default: () => [typeof content === "function" ? content({
                    prefixCls
                  }) : content]
                });
              });
              const className = {
                [prefixCls]: 1,
                [`${prefixCls}-${placement}`]: 1,
                [attrs.class]: !!attrs.class,
                [props.hashId]: true,
                [classes]: !!classes
              };
              function onAfterLeave() {
                var _a4;
                if (noticesForPlacement.length > 0) {
                  return;
                }
                Reflect.deleteProperty(placements2.value, placement);
                (_a4 = props.onAllRemoved) === null || _a4 === void 0 ? void 0 : _a4.call(props);
              }
              return vue.createVNode("div", {
                "key": placement,
                "class": className,
                "style": attrs.style || styles || {
                  top: "65px",
                  left: "50%"
                }
              }, [vue.createVNode(vue.TransitionGroup, _objectSpread2$1(_objectSpread2$1({
                "tag": "div"
              }, transitionProps.value), {}, {
                "onAfterLeave": onAfterLeave
              }), {
                default: () => [noticeNodesForPlacement]
              })]);
            });
            return vue.createVNode(Portal$1, {
              "getContainer": props.getContainer
            }, {
              default: () => [noticeNodes]
            });
          };
        }
      });
      const HookNotification = Notification;
      var __rest$5 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const defaultGetContainer$1 = () => document.body;
      let uniqueKey = 0;
      function mergeConfig() {
        const clone = {};
        for (var _len = arguments.length, objList = new Array(_len), _key = 0; _key < _len; _key++) {
          objList[_key] = arguments[_key];
        }
        objList.forEach((obj) => {
          if (obj) {
            Object.keys(obj).forEach((key2) => {
              const val = obj[key2];
              if (val !== void 0) {
                clone[key2] = val;
              }
            });
          }
        });
        return clone;
      }
      function useNotification$1() {
        let rootConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        const {
          getContainer: getContainer2 = defaultGetContainer$1,
          motion,
          prefixCls,
          maxCount: maxCount2,
          getClassName,
          getStyles,
          onAllRemoved
        } = rootConfig, shareConfig = __rest$5(rootConfig, ["getContainer", "motion", "prefixCls", "maxCount", "getClassName", "getStyles", "onAllRemoved"]);
        const notices = vue.shallowRef([]);
        const notificationsRef = vue.shallowRef();
        const add = (originNotice, holderCallback) => {
          const key2 = originNotice.key || getUuid();
          const notice2 = _extends(_extends({}, originNotice), {
            key: key2
          });
          const noticeIndex = notices.value.map((v2) => v2.notice.key).indexOf(key2);
          const updatedNotices = notices.value.concat();
          if (noticeIndex !== -1) {
            updatedNotices.splice(noticeIndex, 1, {
              notice: notice2,
              holderCallback
            });
          } else {
            if (maxCount2 && notices.value.length >= maxCount2) {
              notice2.key = updatedNotices[0].notice.key;
              notice2.updateMark = getUuid();
              notice2.userPassKey = key2;
              updatedNotices.shift();
            }
            updatedNotices.push({
              notice: notice2,
              holderCallback
            });
          }
          notices.value = updatedNotices;
        };
        const removeNotice = (removeKey) => {
          notices.value = notices.value.filter((_ref) => {
            let {
              notice: {
                key: key2,
                userPassKey
              }
            } = _ref;
            const mergedKey = userPassKey || key2;
            return mergedKey !== removeKey;
          });
        };
        const destroy = () => {
          notices.value = [];
        };
        const contextHolder = vue.computed(() => vue.createVNode(HookNotification, {
          "ref": notificationsRef,
          "prefixCls": prefixCls,
          "maxCount": maxCount2,
          "notices": notices.value,
          "remove": removeNotice,
          "getClassName": getClassName,
          "getStyles": getStyles,
          "animation": motion,
          "hashId": rootConfig.hashId,
          "onAllRemoved": onAllRemoved,
          "getContainer": getContainer2
        }, null));
        const taskQueue = vue.shallowRef([]);
        const api2 = {
          open: (config) => {
            const mergedConfig = mergeConfig(shareConfig, config);
            if (mergedConfig.key === null || mergedConfig.key === void 0) {
              mergedConfig.key = `vc-notification-${uniqueKey}`;
              uniqueKey += 1;
            }
            taskQueue.value = [...taskQueue.value, {
              type: "open",
              config: mergedConfig
            }];
          },
          close: (key2) => {
            taskQueue.value = [...taskQueue.value, {
              type: "close",
              key: key2
            }];
          },
          destroy: () => {
            taskQueue.value = [...taskQueue.value, {
              type: "destroy"
            }];
          }
        };
        vue.watch(taskQueue, () => {
          if (taskQueue.value.length) {
            taskQueue.value.forEach((task) => {
              switch (task.type) {
                case "open":
                  add(task.config);
                  break;
                case "close":
                  removeNotice(task.key);
                  break;
                case "destroy":
                  destroy();
                  break;
              }
            });
            taskQueue.value = [];
          }
        });
        return [api2, () => contextHolder.value];
      }
      const genMessageStyle = (token2) => {
        const {
          componentCls,
          iconCls,
          boxShadowSecondary,
          colorBgElevated,
          colorSuccess,
          colorError,
          colorWarning,
          colorInfo,
          fontSizeLG,
          motionEaseInOutCirc,
          motionDurationSlow,
          marginXS,
          paddingXS,
          borderRadiusLG,
          zIndexPopup,
          // Custom token
          messageNoticeContentPadding
        } = token2;
        const messageMoveIn = new Keyframes("MessageMoveIn", {
          "0%": {
            padding: 0,
            transform: "translateY(-100%)",
            opacity: 0
          },
          "100%": {
            padding: paddingXS,
            transform: "translateY(0)",
            opacity: 1
          }
        });
        const messageMoveOut = new Keyframes("MessageMoveOut", {
          "0%": {
            maxHeight: token2.height,
            padding: paddingXS,
            opacity: 1
          },
          "100%": {
            maxHeight: 0,
            padding: 0,
            opacity: 0
          }
        });
        return [
          // ============================ Holder ============================
          {
            [componentCls]: _extends(_extends({}, resetComponent(token2)), {
              position: "fixed",
              top: marginXS,
              width: "100%",
              pointerEvents: "none",
              zIndex: zIndexPopup,
              [`${componentCls}-move-up`]: {
                animationFillMode: "forwards"
              },
              [`
        ${componentCls}-move-up-appear,
        ${componentCls}-move-up-enter
      `]: {
                animationName: messageMoveIn,
                animationDuration: motionDurationSlow,
                animationPlayState: "paused",
                animationTimingFunction: motionEaseInOutCirc
              },
              [`
        ${componentCls}-move-up-appear${componentCls}-move-up-appear-active,
        ${componentCls}-move-up-enter${componentCls}-move-up-enter-active
      `]: {
                animationPlayState: "running"
              },
              [`${componentCls}-move-up-leave`]: {
                animationName: messageMoveOut,
                animationDuration: motionDurationSlow,
                animationPlayState: "paused",
                animationTimingFunction: motionEaseInOutCirc
              },
              [`${componentCls}-move-up-leave${componentCls}-move-up-leave-active`]: {
                animationPlayState: "running"
              },
              "&-rtl": {
                direction: "rtl",
                span: {
                  direction: "rtl"
                }
              }
            })
          },
          // ============================ Notice ============================
          {
            [`${componentCls}-notice`]: {
              padding: paddingXS,
              textAlign: "center",
              [iconCls]: {
                verticalAlign: "text-bottom",
                marginInlineEnd: marginXS,
                fontSize: fontSizeLG
              },
              [`${componentCls}-notice-content`]: {
                display: "inline-block",
                padding: messageNoticeContentPadding,
                background: colorBgElevated,
                borderRadius: borderRadiusLG,
                boxShadow: boxShadowSecondary,
                pointerEvents: "all"
              },
              [`${componentCls}-success ${iconCls}`]: {
                color: colorSuccess
              },
              [`${componentCls}-error ${iconCls}`]: {
                color: colorError
              },
              [`${componentCls}-warning ${iconCls}`]: {
                color: colorWarning
              },
              [`
        ${componentCls}-info ${iconCls},
        ${componentCls}-loading ${iconCls}`]: {
                color: colorInfo
              }
            }
          },
          // ============================= Pure =============================
          {
            [`${componentCls}-notice-pure-panel`]: {
              padding: 0,
              textAlign: "start"
            }
          }
        ];
      };
      const useStyle$4 = genComponentStyleHook("Message", (token2) => {
        const combinedToken = merge(token2, {
          messageNoticeContentPadding: `${(token2.controlHeightLG - token2.fontSize * token2.lineHeight) / 2}px ${token2.paddingSM}px`
        });
        return [genMessageStyle(combinedToken)];
      }, (token2) => ({
        height: 150,
        zIndexPopup: token2.zIndexPopupBase + 10
      }));
      const TypeIcon = {
        info: vue.createVNode(InfoCircleFilled$1, null, null),
        success: vue.createVNode(CheckCircleFilled$1, null, null),
        error: vue.createVNode(CloseCircleFilled$1, null, null),
        warning: vue.createVNode(ExclamationCircleFilled$1, null, null),
        loading: vue.createVNode(LoadingOutlined$1, null, null)
      };
      const PureContent$1 = vue.defineComponent({
        name: "PureContent",
        inheritAttrs: false,
        props: ["prefixCls", "type", "icon"],
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          return () => {
            var _a2;
            return vue.createVNode("div", {
              "class": classNames(`${props.prefixCls}-custom-content`, `${props.prefixCls}-${props.type}`)
            }, [props.icon || TypeIcon[props.type], vue.createVNode("span", null, [(_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots)])]);
          };
        }
      });
      vue.defineComponent({
        name: "PurePanel",
        inheritAttrs: false,
        props: ["prefixCls", "class", "type", "icon", "content"],
        setup(props, _ref2) {
          let {
            slots,
            attrs
          } = _ref2;
          var _a2;
          const {
            getPrefixCls
          } = useConfigContextInject();
          const prefixCls = vue.computed(() => props.prefixCls || getPrefixCls("message"));
          const [, hashId] = useStyle$4(prefixCls);
          return vue.createVNode(Notice, _objectSpread2$1(_objectSpread2$1({}, attrs), {}, {
            "prefixCls": prefixCls.value,
            "class": classNames(hashId.value, `${prefixCls.value}-notice-pure-panel`),
            "noticeKey": "pure",
            "duration": null
          }), {
            default: () => [vue.createVNode(PureContent$1, {
              "prefixCls": prefixCls.value,
              "type": props.type,
              "icon": props.icon
            }, {
              default: () => [(_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots)]
            })]
          });
        }
      });
      var __rest$4 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const DEFAULT_OFFSET$1 = 8;
      const DEFAULT_DURATION$1 = 3;
      const Holder$1 = vue.defineComponent({
        name: "Holder",
        inheritAttrs: false,
        props: ["top", "prefixCls", "getContainer", "maxCount", "duration", "rtl", "transitionName", "onAllRemoved"],
        setup(props, _ref) {
          let {
            expose
          } = _ref;
          var _a2, _b2;
          const {
            getPrefixCls,
            getPopupContainer
          } = useConfigInject("message", props);
          const prefixCls = vue.computed(() => getPrefixCls("message", props.prefixCls));
          const [, hashId] = useStyle$4(prefixCls);
          const getStyles = () => {
            var _a3;
            const top = (_a3 = props.top) !== null && _a3 !== void 0 ? _a3 : DEFAULT_OFFSET$1;
            return {
              left: "50%",
              transform: "translateX(-50%)",
              top: typeof top === "number" ? `${top}px` : top
            };
          };
          const getClassName = () => classNames(hashId.value, props.rtl ? `${prefixCls.value}-rtl` : "");
          const getNotificationMotion = () => {
            var _a3;
            return getMotion$1({
              prefixCls: prefixCls.value,
              animation: (_a3 = props.animation) !== null && _a3 !== void 0 ? _a3 : `move-up`,
              transitionName: props.transitionName
            });
          };
          const mergedCloseIcon = vue.createVNode("span", {
            "class": `${prefixCls.value}-close-x`
          }, [vue.createVNode(CloseOutlined$1, {
            "class": `${prefixCls.value}-close-icon`
          }, null)]);
          const [api2, holder] = useNotification$1({
            //@ts-ignore
            getStyles,
            prefixCls: prefixCls.value,
            getClassName,
            motion: getNotificationMotion,
            closable: false,
            closeIcon: mergedCloseIcon,
            duration: (_a2 = props.duration) !== null && _a2 !== void 0 ? _a2 : DEFAULT_DURATION$1,
            getContainer: (_b2 = props.staticGetContainer) !== null && _b2 !== void 0 ? _b2 : getPopupContainer.value,
            maxCount: props.maxCount,
            onAllRemoved: props.onAllRemoved
          });
          expose(_extends(_extends({}, api2), {
            prefixCls,
            hashId
          }));
          return holder;
        }
      });
      let keyIndex = 0;
      function useInternalMessage(messageConfig) {
        const holderRef = vue.shallowRef(null);
        const holderKey = Symbol("messageHolderKey");
        const close = (key2) => {
          var _a2;
          (_a2 = holderRef.value) === null || _a2 === void 0 ? void 0 : _a2.close(key2);
        };
        const open = (config) => {
          if (!holderRef.value) {
            const fakeResult = () => {
            };
            fakeResult.then = () => {
            };
            return fakeResult;
          }
          const {
            open: originOpen,
            prefixCls,
            hashId
          } = holderRef.value;
          const noticePrefixCls = `${prefixCls}-notice`;
          const {
            content,
            icon,
            type,
            key: key2,
            class: className,
            onClose
          } = config, restConfig = __rest$4(config, ["content", "icon", "type", "key", "class", "onClose"]);
          let mergedKey = key2;
          if (mergedKey === void 0 || mergedKey === null) {
            keyIndex += 1;
            mergedKey = `antd-message-${keyIndex}`;
          }
          return wrapPromiseFn((resolve) => {
            originOpen(_extends(_extends({}, restConfig), {
              key: mergedKey,
              content: () => vue.createVNode(PureContent$1, {
                "prefixCls": prefixCls,
                "type": type,
                "icon": typeof icon === "function" ? icon() : icon
              }, {
                default: () => [typeof content === "function" ? content() : content]
              }),
              placement: "top",
              // @ts-ignore
              class: classNames(type && `${noticePrefixCls}-${type}`, hashId, className),
              onClose: () => {
                onClose === null || onClose === void 0 ? void 0 : onClose();
                resolve();
              }
            }));
            return () => {
              close(mergedKey);
            };
          });
        };
        const destroy = (key2) => {
          var _a2;
          if (key2 !== void 0) {
            close(key2);
          } else {
            (_a2 = holderRef.value) === null || _a2 === void 0 ? void 0 : _a2.destroy();
          }
        };
        const wrapAPI = {
          open,
          destroy
        };
        const keys2 = ["info", "success", "warning", "error", "loading"];
        keys2.forEach((type) => {
          const typeOpen = (jointContent, duration, onClose) => {
            let config;
            if (jointContent && typeof jointContent === "object" && "content" in jointContent) {
              config = jointContent;
            } else {
              config = {
                content: jointContent
              };
            }
            let mergedDuration;
            let mergedOnClose;
            if (typeof duration === "function") {
              mergedOnClose = duration;
            } else {
              mergedDuration = duration;
              mergedOnClose = onClose;
            }
            const mergedConfig = _extends(_extends({
              onClose: mergedOnClose,
              duration: mergedDuration
            }, config), {
              type
            });
            return open(mergedConfig);
          };
          wrapAPI[type] = typeOpen;
        });
        return [wrapAPI, () => vue.createVNode(Holder$1, _objectSpread2$1(_objectSpread2$1({
          "key": holderKey
        }, messageConfig), {}, {
          "ref": holderRef
        }), null)];
      }
      function useMessage(messageConfig) {
        return useInternalMessage(messageConfig);
      }
      let defaultDuration$1 = 3;
      let defaultTop$1;
      let messageInstance;
      let key = 1;
      let localPrefixCls = "";
      let transitionName = "move-up";
      let hasTransitionName = false;
      let getContainer = () => document.body;
      let maxCount$1;
      let rtl$1 = false;
      function getKeyThenIncreaseKey() {
        return key++;
      }
      function setMessageConfig(options) {
        if (options.top !== void 0) {
          defaultTop$1 = options.top;
          messageInstance = null;
        }
        if (options.duration !== void 0) {
          defaultDuration$1 = options.duration;
        }
        if (options.prefixCls !== void 0) {
          localPrefixCls = options.prefixCls;
        }
        if (options.getContainer !== void 0) {
          getContainer = options.getContainer;
          messageInstance = null;
        }
        if (options.transitionName !== void 0) {
          transitionName = options.transitionName;
          messageInstance = null;
          hasTransitionName = true;
        }
        if (options.maxCount !== void 0) {
          maxCount$1 = options.maxCount;
          messageInstance = null;
        }
        if (options.rtl !== void 0) {
          rtl$1 = options.rtl;
        }
      }
      function getMessageInstance(args, callback) {
        if (messageInstance) {
          callback(messageInstance);
          return;
        }
        Notification$2.newInstance({
          appContext: args.appContext,
          prefixCls: args.prefixCls || localPrefixCls,
          rootPrefixCls: args.rootPrefixCls,
          transitionName,
          hasTransitionName,
          style: {
            top: defaultTop$1
          },
          getContainer: getContainer || args.getPopupContainer,
          maxCount: maxCount$1,
          name: "message",
          useStyle: useStyle$4
        }, (instance) => {
          if (messageInstance) {
            callback(messageInstance);
            return;
          }
          messageInstance = instance;
          callback(instance);
        });
      }
      const typeToIcon$2 = {
        info: InfoCircleFilled$1,
        success: CheckCircleFilled$1,
        error: CloseCircleFilled$1,
        warning: ExclamationCircleFilled$1,
        loading: LoadingOutlined$1
      };
      const typeList = Object.keys(typeToIcon$2);
      function notice$1(args) {
        const duration = args.duration !== void 0 ? args.duration : defaultDuration$1;
        const target = args.key || getKeyThenIncreaseKey();
        const closePromise = new Promise((resolve) => {
          const callback = () => {
            if (typeof args.onClose === "function") {
              args.onClose();
            }
            return resolve(true);
          };
          getMessageInstance(args, (instance) => {
            instance.notice({
              key: target,
              duration,
              style: args.style || {},
              class: args.class,
              content: (_ref) => {
                let {
                  prefixCls
                } = _ref;
                const Icon2 = typeToIcon$2[args.type];
                const iconNode = Icon2 ? vue.createVNode(Icon2, null, null) : "";
                const messageClass = classNames(`${prefixCls}-custom-content`, {
                  [`${prefixCls}-${args.type}`]: args.type,
                  [`${prefixCls}-rtl`]: rtl$1 === true
                });
                return vue.createVNode("div", {
                  "class": messageClass
                }, [typeof args.icon === "function" ? args.icon() : args.icon || iconNode, vue.createVNode("span", null, [typeof args.content === "function" ? args.content() : args.content])]);
              },
              onClose: callback,
              onClick: args.onClick
            });
          });
        });
        const result = () => {
          if (messageInstance) {
            messageInstance.removeNotice(target);
          }
        };
        result.then = (filled, rejected) => closePromise.then(filled, rejected);
        result.promise = closePromise;
        return result;
      }
      function isArgsProps(content) {
        return Object.prototype.toString.call(content) === "[object Object]" && !!content.content;
      }
      const api$1 = {
        open: notice$1,
        config: setMessageConfig,
        destroy(messageKey) {
          if (messageInstance) {
            if (messageKey) {
              const {
                removeNotice
              } = messageInstance;
              removeNotice(messageKey);
            } else {
              const {
                destroy
              } = messageInstance;
              destroy();
              messageInstance = null;
            }
          }
        }
      };
      function attachTypeApi(originalApi, type) {
        originalApi[type] = (content, duration, onClose) => {
          if (isArgsProps(content)) {
            return originalApi.open(_extends(_extends({}, content), {
              type
            }));
          }
          if (typeof duration === "function") {
            onClose = duration;
            duration = void 0;
          }
          return originalApi.open({
            content,
            duration,
            type,
            onClose
          });
        };
      }
      typeList.forEach((type) => attachTypeApi(api$1, type));
      api$1.warn = api$1.warning;
      api$1.useMessage = useMessage;
      const message = api$1;
      const genNotificationPlacementStyle = (token2) => {
        const {
          componentCls,
          width,
          notificationMarginEdge
        } = token2;
        const notificationTopFadeIn = new Keyframes("antNotificationTopFadeIn", {
          "0%": {
            marginTop: "-100%",
            opacity: 0
          },
          "100%": {
            marginTop: 0,
            opacity: 1
          }
        });
        const notificationBottomFadeIn = new Keyframes("antNotificationBottomFadeIn", {
          "0%": {
            marginBottom: "-100%",
            opacity: 0
          },
          "100%": {
            marginBottom: 0,
            opacity: 1
          }
        });
        const notificationLeftFadeIn = new Keyframes("antNotificationLeftFadeIn", {
          "0%": {
            right: {
              _skip_check_: true,
              value: width
            },
            opacity: 0
          },
          "100%": {
            right: {
              _skip_check_: true,
              value: 0
            },
            opacity: 1
          }
        });
        return {
          [`&${componentCls}-top, &${componentCls}-bottom`]: {
            marginInline: 0
          },
          [`&${componentCls}-top`]: {
            [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
              animationName: notificationTopFadeIn
            }
          },
          [`&${componentCls}-bottom`]: {
            [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
              animationName: notificationBottomFadeIn
            }
          },
          [`&${componentCls}-topLeft, &${componentCls}-bottomLeft`]: {
            marginInlineEnd: 0,
            marginInlineStart: notificationMarginEdge,
            [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
              animationName: notificationLeftFadeIn
            }
          }
        };
      };
      const genNotificationPlacementStyle$1 = genNotificationPlacementStyle;
      const genNotificationStyle = (token2) => {
        const {
          iconCls,
          componentCls,
          // .ant-notification
          boxShadowSecondary,
          fontSizeLG,
          notificationMarginBottom,
          borderRadiusLG,
          colorSuccess,
          colorInfo,
          colorWarning,
          colorError,
          colorTextHeading,
          notificationBg,
          notificationPadding,
          notificationMarginEdge,
          motionDurationMid,
          motionEaseInOut,
          fontSize,
          lineHeight,
          width,
          notificationIconSize
        } = token2;
        const noticeCls = `${componentCls}-notice`;
        const notificationFadeIn = new Keyframes("antNotificationFadeIn", {
          "0%": {
            left: {
              _skip_check_: true,
              value: width
            },
            opacity: 0
          },
          "100%": {
            left: {
              _skip_check_: true,
              value: 0
            },
            opacity: 1
          }
        });
        const notificationFadeOut = new Keyframes("antNotificationFadeOut", {
          "0%": {
            maxHeight: token2.animationMaxHeight,
            marginBottom: notificationMarginBottom,
            opacity: 1
          },
          "100%": {
            maxHeight: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            opacity: 0
          }
        });
        return [
          // ============================ Holder ============================
          {
            [componentCls]: _extends(_extends(_extends(_extends({}, resetComponent(token2)), {
              position: "fixed",
              zIndex: token2.zIndexPopup,
              marginInlineEnd: notificationMarginEdge,
              [`${componentCls}-hook-holder`]: {
                position: "relative"
              },
              [`&${componentCls}-top, &${componentCls}-bottom`]: {
                [`${componentCls}-notice`]: {
                  marginInline: "auto auto"
                }
              },
              [`&${componentCls}-topLeft, &${componentCls}-bottomLeft`]: {
                [`${componentCls}-notice`]: {
                  marginInlineEnd: "auto",
                  marginInlineStart: 0
                }
              },
              //  animation
              [`${componentCls}-fade-enter, ${componentCls}-fade-appear`]: {
                animationDuration: token2.motionDurationMid,
                animationTimingFunction: motionEaseInOut,
                animationFillMode: "both",
                opacity: 0,
                animationPlayState: "paused"
              },
              [`${componentCls}-fade-leave`]: {
                animationTimingFunction: motionEaseInOut,
                animationFillMode: "both",
                animationDuration: motionDurationMid,
                animationPlayState: "paused"
              },
              [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]: {
                animationName: notificationFadeIn,
                animationPlayState: "running"
              },
              [`${componentCls}-fade-leave${componentCls}-fade-leave-active`]: {
                animationName: notificationFadeOut,
                animationPlayState: "running"
              }
            }), genNotificationPlacementStyle$1(token2)), {
              // RTL
              "&-rtl": {
                direction: "rtl",
                [`${componentCls}-notice-btn`]: {
                  float: "left"
                }
              }
            })
          },
          // ============================ Notice ============================
          {
            [noticeCls]: {
              position: "relative",
              width,
              maxWidth: `calc(100vw - ${notificationMarginEdge * 2}px)`,
              marginBottom: notificationMarginBottom,
              marginInlineStart: "auto",
              padding: notificationPadding,
              overflow: "hidden",
              lineHeight,
              wordWrap: "break-word",
              background: notificationBg,
              borderRadius: borderRadiusLG,
              boxShadow: boxShadowSecondary,
              [`${componentCls}-close-icon`]: {
                fontSize,
                cursor: "pointer"
              },
              [`${noticeCls}-message`]: {
                marginBottom: token2.marginXS,
                color: colorTextHeading,
                fontSize: fontSizeLG,
                lineHeight: token2.lineHeightLG
              },
              [`${noticeCls}-description`]: {
                fontSize
              },
              [`&${noticeCls}-closable ${noticeCls}-message`]: {
                paddingInlineEnd: token2.paddingLG
              },
              [`${noticeCls}-with-icon ${noticeCls}-message`]: {
                marginBottom: token2.marginXS,
                marginInlineStart: token2.marginSM + notificationIconSize,
                fontSize: fontSizeLG
              },
              [`${noticeCls}-with-icon ${noticeCls}-description`]: {
                marginInlineStart: token2.marginSM + notificationIconSize,
                fontSize
              },
              // Icon & color style in different selector level
              // https://github.com/ant-design/ant-design/issues/16503
              // https://github.com/ant-design/ant-design/issues/15512
              [`${noticeCls}-icon`]: {
                position: "absolute",
                fontSize: notificationIconSize,
                lineHeight: 0,
                // icon-font
                [`&-success${iconCls}`]: {
                  color: colorSuccess
                },
                [`&-info${iconCls}`]: {
                  color: colorInfo
                },
                [`&-warning${iconCls}`]: {
                  color: colorWarning
                },
                [`&-error${iconCls}`]: {
                  color: colorError
                }
              },
              [`${noticeCls}-close`]: {
                position: "absolute",
                top: token2.notificationPaddingVertical,
                insetInlineEnd: token2.notificationPaddingHorizontal,
                color: token2.colorIcon,
                outline: "none",
                width: token2.notificationCloseButtonSize,
                height: token2.notificationCloseButtonSize,
                borderRadius: token2.borderRadiusSM,
                transition: `background-color ${token2.motionDurationMid}, color ${token2.motionDurationMid}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  color: token2.colorIconHover,
                  backgroundColor: token2.wireframe ? "transparent" : token2.colorFillContent
                }
              },
              [`${noticeCls}-btn`]: {
                float: "right",
                marginTop: token2.marginSM
              }
            }
          },
          // ============================= Pure =============================
          {
            [`${noticeCls}-pure-panel`]: {
              margin: 0
            }
          }
        ];
      };
      const useStyle$3 = genComponentStyleHook("Notification", (token2) => {
        const notificationPaddingVertical = token2.paddingMD;
        const notificationPaddingHorizontal = token2.paddingLG;
        const notificationToken = merge(token2, {
          // default.less variables
          notificationBg: token2.colorBgElevated,
          notificationPaddingVertical,
          notificationPaddingHorizontal,
          // index.less variables
          notificationPadding: `${token2.paddingMD}px ${token2.paddingContentHorizontalLG}px`,
          notificationMarginBottom: token2.margin,
          notificationMarginEdge: token2.marginLG,
          animationMaxHeight: 150,
          notificationIconSize: token2.fontSizeLG * token2.lineHeightLG,
          notificationCloseButtonSize: token2.controlHeightLG * 0.55
        });
        return [genNotificationStyle(notificationToken)];
      }, (token2) => ({
        zIndexPopup: token2.zIndexPopupBase + 50,
        width: 384
      }));
      function getCloseIcon(prefixCls, closeIcon) {
        return closeIcon || vue.createVNode("span", {
          "class": `${prefixCls}-close-x`
        }, [vue.createVNode(CloseOutlined$1, {
          "class": `${prefixCls}-close-icon`
        }, null)]);
      }
      ({
        info: vue.createVNode(InfoCircleFilled$1, null, null),
        success: vue.createVNode(CheckCircleFilled$1, null, null),
        error: vue.createVNode(CloseCircleFilled$1, null, null),
        warning: vue.createVNode(ExclamationCircleFilled$1, null, null),
        loading: vue.createVNode(LoadingOutlined$1, null, null)
      });
      const typeToIcon$1 = {
        success: CheckCircleFilled$1,
        info: InfoCircleFilled$1,
        error: CloseCircleFilled$1,
        warning: ExclamationCircleFilled$1
      };
      function PureContent(_ref) {
        let {
          prefixCls,
          icon,
          type,
          message: message2,
          description,
          btn
        } = _ref;
        let iconNode = null;
        if (icon) {
          iconNode = vue.createVNode("span", {
            "class": `${prefixCls}-icon`
          }, [renderHelper(icon)]);
        } else if (type) {
          const Icon2 = typeToIcon$1[type];
          iconNode = vue.createVNode(Icon2, {
            "class": `${prefixCls}-icon ${prefixCls}-icon-${type}`
          }, null);
        }
        return vue.createVNode("div", {
          "class": classNames({
            [`${prefixCls}-with-icon`]: iconNode
          }),
          "role": "alert"
        }, [iconNode, vue.createVNode("div", {
          "class": `${prefixCls}-message`
        }, [message2]), vue.createVNode("div", {
          "class": `${prefixCls}-description`
        }, [description]), btn && vue.createVNode("div", {
          "class": `${prefixCls}-btn`
        }, [btn])]);
      }
      vue.defineComponent({
        name: "PurePanel",
        inheritAttrs: false,
        props: ["prefixCls", "icon", "type", "message", "description", "btn", "closeIcon"],
        setup(props) {
          const {
            getPrefixCls
          } = useConfigInject("notification", props);
          const prefixCls = vue.computed(() => props.prefixCls || getPrefixCls("notification"));
          const noticePrefixCls = vue.computed(() => `${prefixCls.value}-notice`);
          const [, hashId] = useStyle$3(prefixCls);
          return () => {
            return vue.createVNode(Notice, _objectSpread2$1(_objectSpread2$1({}, props), {}, {
              "prefixCls": prefixCls.value,
              "class": classNames(hashId.value, `${noticePrefixCls.value}-pure-panel`),
              "noticeKey": "pure",
              "duration": null,
              "closable": props.closable,
              "closeIcon": getCloseIcon(prefixCls.value, props.closeIcon)
            }), {
              default: () => [vue.createVNode(PureContent, {
                "prefixCls": noticePrefixCls.value,
                "icon": props.icon,
                "type": props.type,
                "message": props.message,
                "description": props.description,
                "btn": props.btn
              }, null)]
            });
          };
        }
      });
      function getPlacementStyle(placement, top, bottom) {
        let style;
        top = typeof top === "number" ? `${top}px` : top;
        bottom = typeof bottom === "number" ? `${bottom}px` : bottom;
        switch (placement) {
          case "top":
            style = {
              left: "50%",
              transform: "translateX(-50%)",
              right: "auto",
              top,
              bottom: "auto"
            };
            break;
          case "topLeft":
            style = {
              left: 0,
              top,
              bottom: "auto"
            };
            break;
          case "topRight":
            style = {
              right: 0,
              top,
              bottom: "auto"
            };
            break;
          case "bottom":
            style = {
              left: "50%",
              transform: "translateX(-50%)",
              right: "auto",
              top: "auto",
              bottom
            };
            break;
          case "bottomLeft":
            style = {
              left: 0,
              top: "auto",
              bottom
            };
            break;
          default:
            style = {
              right: 0,
              top: "auto",
              bottom
            };
            break;
        }
        return style;
      }
      function getMotion(prefixCls) {
        return {
          name: `${prefixCls}-fade`
        };
      }
      var __rest$3 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const DEFAULT_OFFSET = 24;
      const DEFAULT_DURATION = 4.5;
      const Holder = vue.defineComponent({
        name: "Holder",
        inheritAttrs: false,
        props: ["prefixCls", "class", "type", "icon", "content", "onAllRemoved"],
        setup(props, _ref) {
          let {
            expose
          } = _ref;
          const {
            getPrefixCls,
            getPopupContainer
          } = useConfigInject("notification", props);
          const prefixCls = vue.computed(() => props.prefixCls || getPrefixCls("notification"));
          const getStyles = (placement) => {
            var _a2, _b2;
            return getPlacementStyle(placement, (_a2 = props.top) !== null && _a2 !== void 0 ? _a2 : DEFAULT_OFFSET, (_b2 = props.bottom) !== null && _b2 !== void 0 ? _b2 : DEFAULT_OFFSET);
          };
          const [, hashId] = useStyle$3(prefixCls);
          const getClassName = () => classNames(hashId.value, {
            [`${prefixCls.value}-rtl`]: props.rtl
          });
          const getNotificationMotion = () => getMotion(prefixCls.value);
          const [api2, holder] = useNotification$1({
            prefixCls: prefixCls.value,
            getStyles,
            getClassName,
            motion: getNotificationMotion,
            closable: true,
            closeIcon: getCloseIcon(prefixCls.value),
            duration: DEFAULT_DURATION,
            getContainer: () => {
              var _a2, _b2;
              return ((_a2 = props.getPopupContainer) === null || _a2 === void 0 ? void 0 : _a2.call(props)) || ((_b2 = getPopupContainer.value) === null || _b2 === void 0 ? void 0 : _b2.call(getPopupContainer)) || document.body;
            },
            maxCount: props.maxCount,
            hashId: hashId.value,
            onAllRemoved: props.onAllRemoved
          });
          expose(_extends(_extends({}, api2), {
            prefixCls: prefixCls.value,
            hashId
          }));
          return holder;
        }
      });
      function useInternalNotification(notificationConfig) {
        const holderRef = vue.shallowRef(null);
        const holderKey = Symbol("notificationHolderKey");
        const open = (config) => {
          if (!holderRef.value) {
            return;
          }
          const {
            open: originOpen,
            prefixCls,
            hashId
          } = holderRef.value;
          const noticePrefixCls = `${prefixCls}-notice`;
          const {
            message: message2,
            description,
            icon,
            type,
            btn,
            class: className
          } = config, restConfig = __rest$3(config, ["message", "description", "icon", "type", "btn", "class"]);
          return originOpen(_extends(_extends({
            placement: "topRight"
          }, restConfig), {
            content: () => vue.createVNode(PureContent, {
              "prefixCls": noticePrefixCls,
              "icon": typeof icon === "function" ? icon() : icon,
              "type": type,
              "message": typeof message2 === "function" ? message2() : message2,
              "description": typeof description === "function" ? description() : description,
              "btn": typeof btn === "function" ? btn() : btn
            }, null),
            // @ts-ignore
            class: classNames(type && `${noticePrefixCls}-${type}`, hashId, className)
          }));
        };
        const destroy = (key2) => {
          var _a2, _b2;
          if (key2 !== void 0) {
            (_a2 = holderRef.value) === null || _a2 === void 0 ? void 0 : _a2.close(key2);
          } else {
            (_b2 = holderRef.value) === null || _b2 === void 0 ? void 0 : _b2.destroy();
          }
        };
        const wrapAPI = {
          open,
          destroy
        };
        const keys2 = ["success", "info", "warning", "error"];
        keys2.forEach((type) => {
          wrapAPI[type] = (config) => open(_extends(_extends({}, config), {
            type
          }));
        });
        return [wrapAPI, () => vue.createVNode(Holder, _objectSpread2$1(_objectSpread2$1({
          "key": holderKey
        }, notificationConfig), {}, {
          "ref": holderRef
        }), null)];
      }
      function useNotification(notificationConfig) {
        return useInternalNotification(notificationConfig);
      }
      const notificationInstance = {};
      let defaultDuration = 4.5;
      let defaultTop = "24px";
      let defaultBottom = "24px";
      let defaultPrefixCls$1 = "";
      let defaultPlacement = "topRight";
      let defaultGetContainer = () => document.body;
      let defaultCloseIcon = null;
      let rtl = false;
      let maxCount;
      function setNotificationConfig(options) {
        const {
          duration,
          placement,
          bottom,
          top,
          getContainer: getContainer2,
          closeIcon,
          prefixCls
        } = options;
        if (prefixCls !== void 0) {
          defaultPrefixCls$1 = prefixCls;
        }
        if (duration !== void 0) {
          defaultDuration = duration;
        }
        if (placement !== void 0) {
          defaultPlacement = placement;
        }
        if (bottom !== void 0) {
          defaultBottom = typeof bottom === "number" ? `${bottom}px` : bottom;
        }
        if (top !== void 0) {
          defaultTop = typeof top === "number" ? `${top}px` : top;
        }
        if (getContainer2 !== void 0) {
          defaultGetContainer = getContainer2;
        }
        if (closeIcon !== void 0) {
          defaultCloseIcon = closeIcon;
        }
        if (options.rtl !== void 0) {
          rtl = options.rtl;
        }
        if (options.maxCount !== void 0) {
          maxCount = options.maxCount;
        }
      }
      function getNotificationInstance(_ref, callback) {
        let {
          prefixCls: customizePrefixCls,
          placement = defaultPlacement,
          getContainer: getContainer2 = defaultGetContainer,
          top,
          bottom,
          closeIcon = defaultCloseIcon,
          appContext
        } = _ref;
        const {
          getPrefixCls
        } = globalConfig();
        const prefixCls = getPrefixCls("notification", customizePrefixCls || defaultPrefixCls$1);
        const cacheKey = `${prefixCls}-${placement}-${rtl}`;
        const cacheInstance = notificationInstance[cacheKey];
        if (cacheInstance) {
          Promise.resolve(cacheInstance).then((instance) => {
            callback(instance);
          });
          return;
        }
        const notificationClass = classNames(`${prefixCls}-${placement}`, {
          [`${prefixCls}-rtl`]: rtl === true
        });
        Notification$2.newInstance({
          name: "notification",
          prefixCls: customizePrefixCls || defaultPrefixCls$1,
          useStyle: useStyle$3,
          class: notificationClass,
          style: getPlacementStyle(placement, top !== null && top !== void 0 ? top : defaultTop, bottom !== null && bottom !== void 0 ? bottom : defaultBottom),
          appContext,
          getContainer: getContainer2,
          closeIcon: (_ref2) => {
            let {
              prefixCls: prefixCls2
            } = _ref2;
            const closeIconToRender = vue.createVNode("span", {
              "class": `${prefixCls2}-close-x`
            }, [renderHelper(closeIcon, {}, vue.createVNode(CloseOutlined$1, {
              "class": `${prefixCls2}-close-icon`
            }, null))]);
            return closeIconToRender;
          },
          maxCount,
          hasTransitionName: true
        }, (notification2) => {
          notificationInstance[cacheKey] = notification2;
          callback(notification2);
        });
      }
      const typeToIcon = {
        success: CheckCircleOutlined$1,
        info: InfoCircleOutlined$1,
        error: CloseCircleOutlined$1,
        warning: ExclamationCircleOutlined$1
      };
      function notice(args) {
        const {
          icon,
          type,
          description,
          message: message2,
          btn
        } = args;
        const duration = args.duration === void 0 ? defaultDuration : args.duration;
        getNotificationInstance(args, (notification2) => {
          notification2.notice({
            content: (_ref3) => {
              let {
                prefixCls: outerPrefixCls
              } = _ref3;
              const prefixCls = `${outerPrefixCls}-notice`;
              let iconNode = null;
              if (icon) {
                iconNode = () => vue.createVNode("span", {
                  "class": `${prefixCls}-icon`
                }, [renderHelper(icon)]);
              } else if (type) {
                const Icon2 = typeToIcon[type];
                iconNode = () => vue.createVNode(Icon2, {
                  "class": `${prefixCls}-icon ${prefixCls}-icon-${type}`
                }, null);
              }
              return vue.createVNode("div", {
                "class": iconNode ? `${prefixCls}-with-icon` : ""
              }, [iconNode && iconNode(), vue.createVNode("div", {
                "class": `${prefixCls}-message`
              }, [!description && iconNode ? vue.createVNode("span", {
                "class": `${prefixCls}-message-single-line-auto-margin`
              }, null) : null, renderHelper(message2)]), vue.createVNode("div", {
                "class": `${prefixCls}-description`
              }, [renderHelper(description)]), btn ? vue.createVNode("span", {
                "class": `${prefixCls}-btn`
              }, [renderHelper(btn)]) : null]);
            },
            duration,
            closable: true,
            onClose: args.onClose,
            onClick: args.onClick,
            key: args.key,
            style: args.style || {},
            class: args.class
          });
        });
      }
      const api = {
        open: notice,
        close(key2) {
          Object.keys(notificationInstance).forEach((cacheKey) => Promise.resolve(notificationInstance[cacheKey]).then((instance) => {
            instance.removeNotice(key2);
          }));
        },
        config: setNotificationConfig,
        destroy() {
          Object.keys(notificationInstance).forEach((cacheKey) => {
            Promise.resolve(notificationInstance[cacheKey]).then((instance) => {
              instance.destroy();
            });
            delete notificationInstance[cacheKey];
          });
        }
      };
      const iconTypes = ["success", "info", "warning", "error"];
      iconTypes.forEach((type) => {
        api[type] = (args) => api.open(_extends(_extends({}, args), {
          type
        }));
      });
      api.warn = api.warning;
      api.useNotification = useNotification;
      const notification = api;
      const dynamicStyleMark = `-ant-${Date.now()}-${Math.random()}`;
      function getStyle(globalPrefixCls, theme) {
        const variables = {};
        const formatColor = (color, updater) => {
          let clone = color.clone();
          clone = (updater === null || updater === void 0 ? void 0 : updater(clone)) || clone;
          return clone.toRgbString();
        };
        const fillColor = (colorVal, type) => {
          const baseColor = new TinyColor(colorVal);
          const colorPalettes = generate$1(baseColor.toRgbString());
          variables[`${type}-color`] = formatColor(baseColor);
          variables[`${type}-color-disabled`] = colorPalettes[1];
          variables[`${type}-color-hover`] = colorPalettes[4];
          variables[`${type}-color-active`] = colorPalettes[6];
          variables[`${type}-color-outline`] = baseColor.clone().setAlpha(0.2).toRgbString();
          variables[`${type}-color-deprecated-bg`] = colorPalettes[0];
          variables[`${type}-color-deprecated-border`] = colorPalettes[2];
        };
        if (theme.primaryColor) {
          fillColor(theme.primaryColor, "primary");
          const primaryColor = new TinyColor(theme.primaryColor);
          const primaryColors = generate$1(primaryColor.toRgbString());
          primaryColors.forEach((color, index2) => {
            variables[`primary-${index2 + 1}`] = color;
          });
          variables["primary-color-deprecated-l-35"] = formatColor(primaryColor, (c2) => c2.lighten(35));
          variables["primary-color-deprecated-l-20"] = formatColor(primaryColor, (c2) => c2.lighten(20));
          variables["primary-color-deprecated-t-20"] = formatColor(primaryColor, (c2) => c2.tint(20));
          variables["primary-color-deprecated-t-50"] = formatColor(primaryColor, (c2) => c2.tint(50));
          variables["primary-color-deprecated-f-12"] = formatColor(primaryColor, (c2) => c2.setAlpha(c2.getAlpha() * 0.12));
          const primaryActiveColor = new TinyColor(primaryColors[0]);
          variables["primary-color-active-deprecated-f-30"] = formatColor(primaryActiveColor, (c2) => c2.setAlpha(c2.getAlpha() * 0.3));
          variables["primary-color-active-deprecated-d-02"] = formatColor(primaryActiveColor, (c2) => c2.darken(2));
        }
        if (theme.successColor) {
          fillColor(theme.successColor, "success");
        }
        if (theme.warningColor) {
          fillColor(theme.warningColor, "warning");
        }
        if (theme.errorColor) {
          fillColor(theme.errorColor, "error");
        }
        if (theme.infoColor) {
          fillColor(theme.infoColor, "info");
        }
        const cssList = Object.keys(variables).map((key2) => `--${globalPrefixCls}-${key2}: ${variables[key2]};`);
        return `
  :root {
    ${cssList.join("\n")}
  }
  `.trim();
      }
      function registerTheme(globalPrefixCls, theme) {
        const style = getStyle(globalPrefixCls, theme);
        if (canUseDom$1()) {
          updateCSS$1(style, `${dynamicStyleMark}-dynamic-theme`);
        }
      }
      const useStyle$1 = (iconPrefixCls) => {
        const [theme, token2] = useToken();
        return useStyleRegister(vue.computed(() => ({
          theme: theme.value,
          token: token2.value,
          hashId: "",
          path: ["ant-design-icons", iconPrefixCls.value]
        })), () => [{
          [`.${iconPrefixCls.value}`]: _extends(_extends({}, resetIcon()), {
            [`.${iconPrefixCls.value} .${iconPrefixCls.value}-icon`]: {
              display: "block"
            }
          })
        }]);
      };
      const useStyle$2 = useStyle$1;
      function useTheme(theme, parentTheme) {
        const themeConfig = vue.computed(() => (theme === null || theme === void 0 ? void 0 : theme.value) || {});
        const parentThemeConfig = vue.computed(() => themeConfig.value.inherit === false || !(parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.value) ? defaultConfig : parentTheme.value);
        const mergedTheme = vue.computed(() => {
          if (!(theme === null || theme === void 0 ? void 0 : theme.value)) {
            return parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.value;
          }
          const mergedComponents = _extends({}, parentThemeConfig.value.components);
          Object.keys(theme.value.components || {}).forEach((componentName) => {
            mergedComponents[componentName] = _extends(_extends({}, mergedComponents[componentName]), theme.value.components[componentName]);
          });
          return _extends(_extends(_extends({}, parentThemeConfig.value), themeConfig.value), {
            token: _extends(_extends({}, parentThemeConfig.value.token), themeConfig.value.token),
            components: mergedComponents
          });
        });
        return mergedTheme;
      }
      var __rest$2 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const defaultPrefixCls = "ant";
      function getGlobalPrefixCls() {
        return globalConfigForApi.prefixCls || defaultPrefixCls;
      }
      function getGlobalIconPrefixCls() {
        return globalConfigForApi.iconPrefixCls || defaultIconPrefixCls;
      }
      const globalConfigBySet = vue.reactive({});
      const globalConfigForApi = vue.reactive({});
      vue.watchEffect(() => {
        _extends(globalConfigForApi, globalConfigBySet);
        globalConfigForApi.prefixCls = getGlobalPrefixCls();
        globalConfigForApi.iconPrefixCls = getGlobalIconPrefixCls();
        globalConfigForApi.getPrefixCls = (suffixCls, customizePrefixCls) => {
          if (customizePrefixCls)
            return customizePrefixCls;
          return suffixCls ? `${globalConfigForApi.prefixCls}-${suffixCls}` : globalConfigForApi.prefixCls;
        };
        globalConfigForApi.getRootPrefixCls = () => {
          if (globalConfigForApi.prefixCls) {
            return globalConfigForApi.prefixCls;
          }
          return getGlobalPrefixCls();
        };
      });
      let stopWatchEffect;
      const setGlobalConfig = (params) => {
        if (stopWatchEffect) {
          stopWatchEffect();
        }
        stopWatchEffect = vue.watchEffect(() => {
          _extends(globalConfigBySet, vue.reactive(params));
          _extends(globalConfigForApi, vue.reactive(params));
        });
        if (params.theme) {
          registerTheme(getGlobalPrefixCls(), params.theme);
        }
      };
      const globalConfig = () => ({
        getPrefixCls: (suffixCls, customizePrefixCls) => {
          if (customizePrefixCls)
            return customizePrefixCls;
          return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
        },
        getIconPrefixCls: getGlobalIconPrefixCls,
        getRootPrefixCls: () => {
          if (globalConfigForApi.prefixCls) {
            return globalConfigForApi.prefixCls;
          }
          return getGlobalPrefixCls();
        }
      });
      const ConfigProvider = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "AConfigProvider",
        inheritAttrs: false,
        props: configProviderProps(),
        setup(props, _ref) {
          let {
            slots
          } = _ref;
          const parentContext = useConfigContextInject();
          const getPrefixCls = (suffixCls, customizePrefixCls) => {
            const {
              prefixCls = "ant"
            } = props;
            if (customizePrefixCls)
              return customizePrefixCls;
            const mergedPrefixCls = prefixCls || parentContext.getPrefixCls("");
            return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
          };
          const iconPrefixCls = vue.computed(() => props.iconPrefixCls || parentContext.iconPrefixCls.value || defaultIconPrefixCls);
          const shouldWrapSSR = vue.computed(() => iconPrefixCls.value !== parentContext.iconPrefixCls.value);
          const csp = vue.computed(() => {
            var _a2;
            return props.csp || ((_a2 = parentContext.csp) === null || _a2 === void 0 ? void 0 : _a2.value);
          });
          const wrapSSR = useStyle$2(iconPrefixCls);
          const mergedTheme = useTheme(vue.computed(() => props.theme), vue.computed(() => {
            var _a2;
            return (_a2 = parentContext.theme) === null || _a2 === void 0 ? void 0 : _a2.value;
          }));
          const renderEmptyComponent = (name) => {
            const renderEmpty$1 = props.renderEmpty || slots.renderEmpty || parentContext.renderEmpty || renderEmpty;
            return renderEmpty$1(name);
          };
          const autoInsertSpaceInButton = vue.computed(() => {
            var _a2, _b2;
            return (_a2 = props.autoInsertSpaceInButton) !== null && _a2 !== void 0 ? _a2 : (_b2 = parentContext.autoInsertSpaceInButton) === null || _b2 === void 0 ? void 0 : _b2.value;
          });
          const locale$12 = vue.computed(() => {
            var _a2;
            return props.locale || ((_a2 = parentContext.locale) === null || _a2 === void 0 ? void 0 : _a2.value);
          });
          vue.watch(locale$12, () => {
            globalConfigBySet.locale = locale$12.value;
          }, {
            immediate: true
          });
          const direction = vue.computed(() => {
            var _a2;
            return props.direction || ((_a2 = parentContext.direction) === null || _a2 === void 0 ? void 0 : _a2.value);
          });
          const space = vue.computed(() => {
            var _a2, _b2;
            return (_a2 = props.space) !== null && _a2 !== void 0 ? _a2 : (_b2 = parentContext.space) === null || _b2 === void 0 ? void 0 : _b2.value;
          });
          const virtual = vue.computed(() => {
            var _a2, _b2;
            return (_a2 = props.virtual) !== null && _a2 !== void 0 ? _a2 : (_b2 = parentContext.virtual) === null || _b2 === void 0 ? void 0 : _b2.value;
          });
          const dropdownMatchSelectWidth = vue.computed(() => {
            var _a2, _b2;
            return (_a2 = props.dropdownMatchSelectWidth) !== null && _a2 !== void 0 ? _a2 : (_b2 = parentContext.dropdownMatchSelectWidth) === null || _b2 === void 0 ? void 0 : _b2.value;
          });
          const getTargetContainer = vue.computed(() => {
            var _a2;
            return props.getTargetContainer !== void 0 ? props.getTargetContainer : (_a2 = parentContext.getTargetContainer) === null || _a2 === void 0 ? void 0 : _a2.value;
          });
          const getPopupContainer = vue.computed(() => {
            var _a2;
            return props.getPopupContainer !== void 0 ? props.getPopupContainer : (_a2 = parentContext.getPopupContainer) === null || _a2 === void 0 ? void 0 : _a2.value;
          });
          const pageHeader = vue.computed(() => {
            var _a2;
            return props.pageHeader !== void 0 ? props.pageHeader : (_a2 = parentContext.pageHeader) === null || _a2 === void 0 ? void 0 : _a2.value;
          });
          const input = vue.computed(() => {
            var _a2;
            return props.input !== void 0 ? props.input : (_a2 = parentContext.input) === null || _a2 === void 0 ? void 0 : _a2.value;
          });
          const pagination = vue.computed(() => {
            var _a2;
            return props.pagination !== void 0 ? props.pagination : (_a2 = parentContext.pagination) === null || _a2 === void 0 ? void 0 : _a2.value;
          });
          const form = vue.computed(() => {
            var _a2;
            return props.form !== void 0 ? props.form : (_a2 = parentContext.form) === null || _a2 === void 0 ? void 0 : _a2.value;
          });
          const select = vue.computed(() => {
            var _a2;
            return props.select !== void 0 ? props.select : (_a2 = parentContext.select) === null || _a2 === void 0 ? void 0 : _a2.value;
          });
          const componentSize = vue.computed(() => props.componentSize);
          const componentDisabled = vue.computed(() => props.componentDisabled);
          const configProvider = {
            csp,
            autoInsertSpaceInButton,
            locale: locale$12,
            direction,
            space,
            virtual,
            dropdownMatchSelectWidth,
            getPrefixCls,
            iconPrefixCls,
            theme: vue.computed(() => {
              var _a2, _b2;
              return (_a2 = mergedTheme.value) !== null && _a2 !== void 0 ? _a2 : (_b2 = parentContext.theme) === null || _b2 === void 0 ? void 0 : _b2.value;
            }),
            renderEmpty: renderEmptyComponent,
            getTargetContainer,
            getPopupContainer,
            pageHeader,
            input,
            pagination,
            form,
            select,
            componentSize,
            componentDisabled,
            transformCellText: vue.computed(() => props.transformCellText)
          };
          const memoTheme = vue.computed(() => {
            const _a2 = mergedTheme.value || {}, {
              algorithm,
              token: token2
            } = _a2, rest = __rest$2(_a2, ["algorithm", "token"]);
            const themeObj = algorithm && (!Array.isArray(algorithm) || algorithm.length > 0) ? createTheme(algorithm) : void 0;
            return _extends(_extends({}, rest), {
              theme: themeObj,
              token: _extends(_extends({}, defaultSeedToken), token2)
            });
          });
          const validateMessagesRef = vue.computed(() => {
            var _a2, _b2;
            let validateMessages = {};
            if (locale$12.value) {
              validateMessages = ((_a2 = locale$12.value.Form) === null || _a2 === void 0 ? void 0 : _a2.defaultValidateMessages) || ((_b2 = defaultLocale.Form) === null || _b2 === void 0 ? void 0 : _b2.defaultValidateMessages) || {};
            }
            if (props.form && props.form.validateMessages) {
              validateMessages = _extends(_extends({}, validateMessages), props.form.validateMessages);
            }
            return validateMessages;
          });
          useConfigContextProvider(configProvider);
          useProvideGlobalForm({
            validateMessages: validateMessagesRef
          });
          useProviderSize(componentSize);
          useProviderDisabled(componentDisabled);
          const renderProvider = (legacyLocale) => {
            var _a2, _b2;
            let childNode = shouldWrapSSR.value ? wrapSSR((_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots)) : (_b2 = slots.default) === null || _b2 === void 0 ? void 0 : _b2.call(slots);
            if (props.theme) {
              const _childNode = function() {
                return childNode;
              }();
              childNode = vue.createVNode(DesignTokenProvider, {
                "value": memoTheme.value
              }, {
                default: () => [_childNode]
              });
            }
            return vue.createVNode(locale, {
              "locale": locale$12.value || legacyLocale,
              "ANT_MARK__": ANT_MARK
            }, {
              default: () => [childNode]
            });
          };
          vue.watchEffect(() => {
            if (direction.value) {
              message.config({
                rtl: direction.value === "rtl"
              });
              notification.config({
                rtl: direction.value === "rtl"
              });
            }
          });
          return () => vue.createVNode(LocaleReceiver, {
            "children": (_2, __, legacyLocale) => renderProvider(legacyLocale)
          }, null);
        }
      });
      ConfigProvider.config = setGlobalConfig;
      ConfigProvider.install = function(app) {
        app.component(ConfigProvider.name, ConfigProvider);
      };
      const ConfigProvider$1 = ConfigProvider;
      var FileTextOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z" } }] }, "name": "file-text", "theme": "outlined" };
      const FileTextOutlinedSvg = FileTextOutlined$2;
      function _objectSpread$3(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$3(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$3(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var FileTextOutlined = function FileTextOutlined2(props, context) {
        var p = _objectSpread$3({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$3({}, p, {
          "icon": FileTextOutlinedSvg
        }), null);
      };
      FileTextOutlined.displayName = "FileTextOutlined";
      FileTextOutlined.inheritAttrs = false;
      const FileTextOutlined$1 = FileTextOutlined;
      const floatButtonProps = () => {
        return {
          prefixCls: String,
          description: PropTypes$1.any,
          type: stringType("default"),
          shape: stringType("circle"),
          tooltip: PropTypes$1.any,
          href: String,
          target: functionType(),
          badge: objectType(),
          onClick: functionType()
        };
      };
      const floatButtonContentProps = () => {
        return {
          prefixCls: stringType()
        };
      };
      const floatButtonGroupProps = () => {
        return _extends(_extends({}, floatButtonProps()), {
          // 包含的 Float Button
          // 触发方式 (有触发方式为菜单模式）
          trigger: stringType(),
          // 受控展开
          open: booleanType(),
          // 展开收起的回调
          onOpenChange: functionType(),
          "onUpdate:open": functionType()
        });
      };
      const backTopProps = () => {
        return _extends(_extends({}, floatButtonProps()), {
          prefixCls: String,
          duration: Number,
          target: functionType(),
          visibilityHeight: Number,
          onClick: functionType()
        });
      };
      const FloatButtonContent = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "AFloatButtonContent",
        inheritAttrs: false,
        props: floatButtonContentProps(),
        setup(props, _ref) {
          let {
            attrs,
            slots
          } = _ref;
          return () => {
            var _a2;
            const {
              prefixCls
            } = props;
            const description = filterEmpty((_a2 = slots.description) === null || _a2 === void 0 ? void 0 : _a2.call(slots));
            return vue.createVNode("div", _objectSpread2$1(_objectSpread2$1({}, attrs), {}, {
              "class": [attrs.class, `${prefixCls}-content`]
            }), [slots.icon || description.length ? vue.createVNode(vue.Fragment, null, [slots.icon && vue.createVNode("div", {
              "class": `${prefixCls}-icon`
            }, [slots.icon()]), description.length ? vue.createVNode("div", {
              "class": `${prefixCls}-description`
            }, [description]) : null]) : vue.createVNode("div", {
              "class": `${prefixCls}-icon`
            }, [vue.createVNode(FileTextOutlined$1, null, null)])]);
          };
        }
      });
      const Content = FloatButtonContent;
      const contextKey = Symbol("floatButtonGroupContext");
      const useProvideFloatButtonGroupContext = (props) => {
        vue.provide(contextKey, props);
        return props;
      };
      const useInjectFloatButtonGroupContext = () => {
        return vue.inject(contextKey, {
          shape: vue.ref()
        });
      };
      const getOffset = (radius) => {
        if (radius === 0) {
          return 0;
        }
        return radius - Math.sqrt(Math.pow(radius, 2) / 2);
      };
      const getOffset$1 = getOffset;
      const initFloatButtonGroupMotion = (token2) => {
        const {
          componentCls,
          floatButtonSize,
          motionDurationSlow,
          motionEaseInOutCirc
        } = token2;
        const groupPrefixCls = `${componentCls}-group`;
        const moveDownIn = new Keyframes("antFloatButtonMoveDownIn", {
          "0%": {
            transform: `translate3d(0, ${floatButtonSize}px, 0)`,
            transformOrigin: "0 0",
            opacity: 0
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
            transformOrigin: "0 0",
            opacity: 1
          }
        });
        const moveDownOut = new Keyframes("antFloatButtonMoveDownOut", {
          "0%": {
            transform: "translate3d(0, 0, 0)",
            transformOrigin: "0 0",
            opacity: 1
          },
          "100%": {
            transform: `translate3d(0, ${floatButtonSize}px, 0)`,
            transformOrigin: "0 0",
            opacity: 0
          }
        });
        return [{
          [`${groupPrefixCls}-wrap`]: _extends({}, initMotion(`${groupPrefixCls}-wrap`, moveDownIn, moveDownOut, motionDurationSlow, true))
        }, {
          [`${groupPrefixCls}-wrap`]: {
            [`
          &${groupPrefixCls}-wrap-enter,
          &${groupPrefixCls}-wrap-appear
        `]: {
              opacity: 0,
              animationTimingFunction: motionEaseInOutCirc
            },
            [`&${groupPrefixCls}-wrap-leave`]: {
              animationTimingFunction: motionEaseInOutCirc
            }
          }
        }];
      };
      const floatButtonGroupStyle = (token2) => {
        const {
          antCls,
          componentCls,
          floatButtonSize,
          margin,
          borderRadiusLG,
          borderRadiusSM,
          badgeOffset,
          floatButtonBodyPadding
        } = token2;
        const groupPrefixCls = `${componentCls}-group`;
        return {
          [groupPrefixCls]: _extends(_extends({}, resetComponent(token2)), {
            zIndex: 99,
            display: "block",
            border: "none",
            position: "fixed",
            width: floatButtonSize,
            height: "auto",
            boxShadow: "none",
            minHeight: floatButtonSize,
            insetInlineEnd: token2.floatButtonInsetInlineEnd,
            insetBlockEnd: token2.floatButtonInsetBlockEnd,
            borderRadius: borderRadiusLG,
            [`${groupPrefixCls}-wrap`]: {
              zIndex: -1,
              display: "block",
              position: "relative",
              marginBottom: margin
            },
            [`&${groupPrefixCls}-rtl`]: {
              direction: "rtl"
            },
            [componentCls]: {
              position: "static"
            }
          }),
          [`${groupPrefixCls}-circle`]: {
            [`${componentCls}-circle:not(:last-child)`]: {
              marginBottom: token2.margin,
              [`${componentCls}-body`]: {
                width: floatButtonSize,
                height: floatButtonSize,
                borderRadius: "50%"
              }
            }
          },
          [`${groupPrefixCls}-square`]: {
            [`${componentCls}-square`]: {
              borderRadius: 0,
              padding: 0,
              "&:first-child": {
                borderStartStartRadius: borderRadiusLG,
                borderStartEndRadius: borderRadiusLG
              },
              "&:last-child": {
                borderEndStartRadius: borderRadiusLG,
                borderEndEndRadius: borderRadiusLG
              },
              "&:not(:last-child)": {
                borderBottom: `${token2.lineWidth}px ${token2.lineType} ${token2.colorSplit}`
              },
              [`${antCls}-badge`]: {
                [`${antCls}-badge-count`]: {
                  top: -(floatButtonBodyPadding + badgeOffset),
                  insetInlineEnd: -(floatButtonBodyPadding + badgeOffset)
                }
              }
            },
            [`${groupPrefixCls}-wrap`]: {
              display: "block",
              borderRadius: borderRadiusLG,
              boxShadow: token2.boxShadowSecondary,
              [`${componentCls}-square`]: {
                boxShadow: "none",
                marginTop: 0,
                borderRadius: 0,
                padding: floatButtonBodyPadding,
                "&:first-child": {
                  borderStartStartRadius: borderRadiusLG,
                  borderStartEndRadius: borderRadiusLG
                },
                "&:last-child": {
                  borderEndStartRadius: borderRadiusLG,
                  borderEndEndRadius: borderRadiusLG
                },
                "&:not(:last-child)": {
                  borderBottom: `${token2.lineWidth}px ${token2.lineType} ${token2.colorSplit}`
                },
                [`${componentCls}-body`]: {
                  width: token2.floatButtonBodySize,
                  height: token2.floatButtonBodySize
                }
              }
            }
          },
          [`${groupPrefixCls}-circle-shadow`]: {
            boxShadow: "none"
          },
          [`${groupPrefixCls}-square-shadow`]: {
            boxShadow: token2.boxShadowSecondary,
            [`${componentCls}-square`]: {
              boxShadow: "none",
              padding: floatButtonBodyPadding,
              [`${componentCls}-body`]: {
                width: token2.floatButtonBodySize,
                height: token2.floatButtonBodySize,
                borderRadius: borderRadiusSM
              }
            }
          }
        };
      };
      const sharedFloatButtonStyle = (token2) => {
        const {
          antCls,
          componentCls,
          floatButtonBodyPadding,
          floatButtonIconSize,
          floatButtonSize,
          borderRadiusLG,
          badgeOffset,
          dotOffsetInSquare,
          dotOffsetInCircle
        } = token2;
        return {
          [componentCls]: _extends(_extends({}, resetComponent(token2)), {
            border: "none",
            position: "fixed",
            cursor: "pointer",
            zIndex: 99,
            display: "block",
            justifyContent: "center",
            alignItems: "center",
            width: floatButtonSize,
            height: floatButtonSize,
            insetInlineEnd: token2.floatButtonInsetInlineEnd,
            insetBlockEnd: token2.floatButtonInsetBlockEnd,
            boxShadow: token2.boxShadowSecondary,
            // Pure Panel
            "&-pure": {
              position: "relative",
              inset: "auto"
            },
            "&:empty": {
              display: "none"
            },
            [`${antCls}-badge`]: {
              width: "100%",
              height: "100%",
              [`${antCls}-badge-count`]: {
                transform: "translate(0, 0)",
                transformOrigin: "center",
                top: -badgeOffset,
                insetInlineEnd: -badgeOffset
              }
            },
            [`${componentCls}-body`]: {
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: `all ${token2.motionDurationMid}`,
              [`${componentCls}-content`]: {
                overflow: "hidden",
                textAlign: "center",
                minHeight: floatButtonSize,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: `${floatButtonBodyPadding / 2}px ${floatButtonBodyPadding}px`,
                [`${componentCls}-icon`]: {
                  textAlign: "center",
                  margin: "auto",
                  width: floatButtonIconSize,
                  fontSize: floatButtonIconSize,
                  lineHeight: 1
                }
              }
            }
          }),
          [`${componentCls}-rtl`]: {
            direction: "rtl"
          },
          [`${componentCls}-circle`]: {
            height: floatButtonSize,
            borderRadius: "50%",
            [`${antCls}-badge`]: {
              [`${antCls}-badge-dot`]: {
                top: dotOffsetInCircle,
                insetInlineEnd: dotOffsetInCircle
              }
            },
            [`${componentCls}-body`]: {
              borderRadius: "50%"
            }
          },
          [`${componentCls}-square`]: {
            height: "auto",
            minHeight: floatButtonSize,
            borderRadius: borderRadiusLG,
            [`${antCls}-badge`]: {
              [`${antCls}-badge-dot`]: {
                top: dotOffsetInSquare,
                insetInlineEnd: dotOffsetInSquare
              }
            },
            [`${componentCls}-body`]: {
              height: "auto",
              borderRadius: borderRadiusLG
            }
          },
          [`${componentCls}-default`]: {
            backgroundColor: token2.floatButtonBackgroundColor,
            transition: `background-color ${token2.motionDurationMid}`,
            [`${componentCls}-body`]: {
              backgroundColor: token2.floatButtonBackgroundColor,
              transition: `background-color ${token2.motionDurationMid}`,
              "&:hover": {
                backgroundColor: token2.colorFillContent
              },
              [`${componentCls}-content`]: {
                [`${componentCls}-icon`]: {
                  color: token2.colorText
                },
                [`${componentCls}-description`]: {
                  display: "flex",
                  alignItems: "center",
                  lineHeight: `${token2.fontSizeLG}px`,
                  color: token2.colorText,
                  fontSize: token2.fontSizeSM
                }
              }
            }
          },
          [`${componentCls}-primary`]: {
            backgroundColor: token2.colorPrimary,
            [`${componentCls}-body`]: {
              backgroundColor: token2.colorPrimary,
              transition: `background-color ${token2.motionDurationMid}`,
              "&:hover": {
                backgroundColor: token2.colorPrimaryHover
              },
              [`${componentCls}-content`]: {
                [`${componentCls}-icon`]: {
                  color: token2.colorTextLightSolid
                },
                [`${componentCls}-description`]: {
                  display: "flex",
                  alignItems: "center",
                  lineHeight: `${token2.fontSizeLG}px`,
                  color: token2.colorTextLightSolid,
                  fontSize: token2.fontSizeSM
                }
              }
            }
          }
        };
      };
      const useStyle = genComponentStyleHook("FloatButton", (token2) => {
        const {
          colorTextLightSolid,
          colorBgElevated,
          controlHeightLG,
          marginXXL,
          marginLG,
          fontSize,
          fontSizeIcon,
          controlItemBgHover,
          paddingXXS,
          borderRadiusLG
        } = token2;
        const floatButtonToken = merge(token2, {
          floatButtonBackgroundColor: colorBgElevated,
          floatButtonColor: colorTextLightSolid,
          floatButtonHoverBackgroundColor: controlItemBgHover,
          floatButtonFontSize: fontSize,
          floatButtonIconSize: fontSizeIcon * 1.5,
          floatButtonSize: controlHeightLG,
          floatButtonInsetBlockEnd: marginXXL,
          floatButtonInsetInlineEnd: marginLG,
          floatButtonBodySize: controlHeightLG - paddingXXS * 2,
          // 这里的 paddingXXS 是简写，完整逻辑是 (controlHeightLG - (controlHeightLG - paddingXXS * 2)) / 2,
          floatButtonBodyPadding: paddingXXS,
          badgeOffset: paddingXXS * 1.5,
          dotOffsetInCircle: getOffset$1(controlHeightLG / 2),
          dotOffsetInSquare: getOffset$1(borderRadiusLG)
        });
        return [floatButtonGroupStyle(floatButtonToken), sharedFloatButtonStyle(floatButtonToken), initFadeMotion(token2), initFloatButtonGroupMotion(floatButtonToken)];
      });
      var __rest$1 = globalThis && globalThis.__rest || function(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      };
      const floatButtonPrefixCls = "float-btn";
      const FloatButton = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "AFloatButton",
        inheritAttrs: false,
        props: initDefaultProps$1(floatButtonProps(), {
          type: "default",
          shape: "circle"
        }),
        setup(props, _ref) {
          let {
            attrs,
            slots
          } = _ref;
          const {
            prefixCls,
            direction
          } = useConfigInject(floatButtonPrefixCls, props);
          const [wrapSSR, hashId] = useStyle(prefixCls);
          const {
            shape: groupShape
          } = useInjectFloatButtonGroupContext();
          const floatButtonRef = vue.ref(null);
          const mergeShape = vue.computed(() => {
            return (groupShape === null || groupShape === void 0 ? void 0 : groupShape.value) || props.shape;
          });
          return () => {
            var _a2;
            const {
              prefixCls: customPrefixCls,
              type = "default",
              shape = "circle",
              description = (_a2 = slots.description) === null || _a2 === void 0 ? void 0 : _a2.call(slots),
              tooltip,
              badge = {}
            } = props, restProps = __rest$1(props, ["prefixCls", "type", "shape", "description", "tooltip", "badge"]);
            const classString = classNames(prefixCls.value, `${prefixCls.value}-${type}`, `${prefixCls.value}-${mergeShape.value}`, {
              [`${prefixCls.value}-rtl`]: direction.value === "rtl"
            }, attrs.class, hashId.value);
            const buttonNode = vue.createVNode(Tooltip, {
              "placement": "left"
            }, {
              title: slots.tooltip || tooltip ? () => slots.tooltip && slots.tooltip() || tooltip : void 0,
              default: () => vue.createVNode(Badge, badge, {
                default: () => [vue.createVNode("div", {
                  "class": `${prefixCls.value}-body`
                }, [vue.createVNode(Content, {
                  "prefixCls": prefixCls.value
                }, {
                  icon: slots.icon,
                  description: () => description
                })])]
              })
            });
            return wrapSSR(props.href ? vue.createVNode("a", _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({
              "ref": floatButtonRef
            }, attrs), restProps), {}, {
              "class": classString
            }), [buttonNode]) : vue.createVNode("button", _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({
              "ref": floatButtonRef
            }, attrs), restProps), {}, {
              "class": classString,
              "type": "button"
            }), [buttonNode]));
          };
        }
      });
      const FloatButton$1 = FloatButton;
      const FloatButtonGroup = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "AFloatButtonGroup",
        inheritAttrs: false,
        props: initDefaultProps$1(floatButtonGroupProps(), {
          type: "default",
          shape: "circle"
        }),
        setup(props, _ref) {
          let {
            attrs,
            slots,
            emit
          } = _ref;
          const {
            prefixCls,
            direction
          } = useConfigInject(floatButtonPrefixCls, props);
          const [wrapSSR, hashId] = useStyle(prefixCls);
          const [open, setOpen] = useMergedState(false, {
            value: vue.computed(() => props.open)
          });
          const floatButtonGroupRef = vue.ref(null);
          const floatButtonRef = vue.ref(null);
          useProvideFloatButtonGroupContext({
            shape: vue.computed(() => props.shape)
          });
          const hoverTypeAction = {
            onMouseenter() {
              var _a2;
              setOpen(true);
              emit("update:open", true);
              (_a2 = props.onOpenChange) === null || _a2 === void 0 ? void 0 : _a2.call(props, true);
            },
            onMouseleave() {
              var _a2;
              setOpen(false);
              emit("update:open", false);
              (_a2 = props.onOpenChange) === null || _a2 === void 0 ? void 0 : _a2.call(props, false);
            }
          };
          const hoverAction = vue.computed(() => {
            return props.trigger === "hover" ? hoverTypeAction : {};
          });
          const handleOpenChange = () => {
            var _a2;
            const nextOpen = !open.value;
            emit("update:open", nextOpen);
            (_a2 = props.onOpenChange) === null || _a2 === void 0 ? void 0 : _a2.call(props, nextOpen);
            setOpen(nextOpen);
          };
          const onClick = (e2) => {
            var _a2, _b2, _c;
            if ((_a2 = floatButtonGroupRef.value) === null || _a2 === void 0 ? void 0 : _a2.contains(e2.target)) {
              if ((_b2 = findDOMNode(floatButtonRef.value)) === null || _b2 === void 0 ? void 0 : _b2.contains(e2.target)) {
                handleOpenChange();
              }
              return;
            }
            setOpen(false);
            emit("update:open", false);
            (_c = props.onOpenChange) === null || _c === void 0 ? void 0 : _c.call(props, false);
          };
          vue.watch(vue.computed(() => props.trigger), (value) => {
            if (!canUseDom$1()) {
              return;
            }
            document.removeEventListener("click", onClick);
            if (value === "click") {
              document.addEventListener("click", onClick);
            }
          }, {
            immediate: true
          });
          vue.onBeforeUnmount(() => {
            document.removeEventListener("click", onClick);
          });
          return () => {
            var _a2;
            const {
              shape = "circle",
              type = "default",
              tooltip,
              description,
              trigger
            } = props;
            const groupPrefixCls = `${prefixCls.value}-group`;
            const groupCls = classNames(groupPrefixCls, hashId.value, attrs.class, {
              [`${groupPrefixCls}-rtl`]: direction.value === "rtl",
              [`${groupPrefixCls}-${shape}`]: shape,
              [`${groupPrefixCls}-${shape}-shadow`]: !trigger
            });
            const wrapperCls = classNames(hashId.value, `${groupPrefixCls}-wrap`);
            const transitionProps = getTransitionProps(`${groupPrefixCls}-wrap`);
            return wrapSSR(vue.createVNode("div", _objectSpread2$1(_objectSpread2$1({
              "ref": floatButtonGroupRef
            }, attrs), {}, {
              "class": groupCls
            }, hoverAction.value), [trigger && ["click", "hover"].includes(trigger) ? vue.createVNode(vue.Fragment, null, [vue.createVNode(vue.Transition, transitionProps, {
              default: () => [vue.withDirectives(vue.createVNode("div", {
                "class": wrapperCls
              }, [slots.default && slots.default()]), [[vue.vShow, open.value]])]
            }), vue.createVNode(FloatButton$1, {
              "ref": floatButtonRef,
              "type": type,
              "shape": shape,
              "tooltip": tooltip,
              "description": description
            }, {
              icon: () => {
                var _a3, _b2;
                return open.value ? ((_a3 = slots.closeIcon) === null || _a3 === void 0 ? void 0 : _a3.call(slots)) || vue.createVNode(CloseOutlined$1, null, null) : ((_b2 = slots.icon) === null || _b2 === void 0 ? void 0 : _b2.call(slots)) || vue.createVNode(FileTextOutlined$1, null, null);
              },
              tooltip: slots.tooltip,
              description: slots.description
            })]) : (_a2 = slots.default) === null || _a2 === void 0 ? void 0 : _a2.call(slots)]));
          };
        }
      });
      const FloatButtonGroup$1 = FloatButtonGroup;
      var VerticalAlignTopOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M859.9 168H164.1c-4.5 0-8.1 3.6-8.1 8v60c0 4.4 3.6 8 8.1 8h695.8c4.5 0 8.1-3.6 8.1-8v-60c0-4.4-3.6-8-8.1-8zM518.3 355a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V848c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V509.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 355z" } }] }, "name": "vertical-align-top", "theme": "outlined" };
      const VerticalAlignTopOutlinedSvg = VerticalAlignTopOutlined$2;
      function _objectSpread$2(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$2(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$2(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var VerticalAlignTopOutlined = function VerticalAlignTopOutlined2(props, context) {
        var p = _objectSpread$2({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$2({}, p, {
          "icon": VerticalAlignTopOutlinedSvg
        }), null);
      };
      VerticalAlignTopOutlined.displayName = "VerticalAlignTopOutlined";
      VerticalAlignTopOutlined.inheritAttrs = false;
      const VerticalAlignTopOutlined$1 = VerticalAlignTopOutlined;
      const BackTop = vue.defineComponent({
        compatConfig: {
          MODE: 3
        },
        name: "ABackTop",
        inheritAttrs: false,
        props: initDefaultProps$1(backTopProps(), {
          visibilityHeight: 400,
          target: () => window,
          duration: 450,
          type: "default",
          shape: "circle"
        }),
        // emits: ['click'],
        setup(props, _ref) {
          let {
            slots,
            attrs,
            emit
          } = _ref;
          const {
            prefixCls,
            direction
          } = useConfigInject(floatButtonPrefixCls, props);
          const [wrapSSR] = useStyle(prefixCls);
          const domRef = vue.ref();
          const state = vue.reactive({
            visible: props.visibilityHeight === 0,
            scrollEvent: null
          });
          const getDefaultTarget = () => domRef.value && domRef.value.ownerDocument ? domRef.value.ownerDocument : window;
          const scrollToTop = (e2) => {
            const {
              target = getDefaultTarget,
              duration
            } = props;
            scrollTo(0, {
              getContainer: target,
              duration
            });
            emit("click", e2);
          };
          const handleScroll = throttleByAnimationFrame((e2) => {
            const {
              visibilityHeight
            } = props;
            const scrollTop = getScroll$1(e2.target, true);
            state.visible = scrollTop >= visibilityHeight;
          });
          const bindScrollEvent = () => {
            const {
              target
            } = props;
            const getTarget = target || getDefaultTarget;
            const container = getTarget();
            handleScroll({
              target: container
            });
            container === null || container === void 0 ? void 0 : container.addEventListener("scroll", handleScroll);
          };
          const scrollRemove = () => {
            const {
              target
            } = props;
            const getTarget = target || getDefaultTarget;
            const container = getTarget();
            handleScroll.cancel();
            container === null || container === void 0 ? void 0 : container.removeEventListener("scroll", handleScroll);
          };
          vue.watch(() => props.target, () => {
            scrollRemove();
            vue.nextTick(() => {
              bindScrollEvent();
            });
          });
          vue.onMounted(() => {
            vue.nextTick(() => {
              bindScrollEvent();
            });
          });
          vue.onActivated(() => {
            vue.nextTick(() => {
              bindScrollEvent();
            });
          });
          vue.onDeactivated(() => {
            scrollRemove();
          });
          vue.onBeforeUnmount(() => {
            scrollRemove();
          });
          const floatButtonGroupContext = useInjectFloatButtonGroupContext();
          return () => {
            const {
              description,
              type,
              shape,
              tooltip,
              badge
            } = props;
            const floatButtonProps2 = _extends(_extends({}, attrs), {
              shape: (floatButtonGroupContext === null || floatButtonGroupContext === void 0 ? void 0 : floatButtonGroupContext.shape.value) || shape,
              onClick: scrollToTop,
              class: {
                [`${prefixCls.value}`]: true,
                [`${attrs.class}`]: attrs.class,
                [`${prefixCls.value}-rtl`]: direction.value === "rtl"
              },
              description,
              type,
              tooltip,
              badge
            });
            const transitionProps = getTransitionProps("fade");
            return wrapSSR(vue.createVNode(vue.Transition, transitionProps, {
              default: () => [vue.withDirectives(vue.createVNode(FloatButton$1, _objectSpread2$1(_objectSpread2$1({}, floatButtonProps2), {}, {
                "ref": domRef
              }), {
                icon: () => {
                  var _a2;
                  return ((_a2 = slots.icon) === null || _a2 === void 0 ? void 0 : _a2.call(slots)) || vue.createVNode(VerticalAlignTopOutlined$1, null, null);
                }
              }), [[vue.vShow, state.visible]])]
            }));
          };
        }
      });
      const BackTop$1 = BackTop;
      FloatButton$1.Group = FloatButtonGroup$1;
      FloatButton$1.BackTop = BackTop$1;
      FloatButton$1.install = function(app) {
        app.component(FloatButton$1.name, FloatButton$1);
        app.component(FloatButtonGroup$1.name, FloatButtonGroup$1);
        app.component(BackTop$1.name, BackTop$1);
        return app;
      };
      var PlayCircleOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" } }, { "tag": "path", "attrs": { "d": "M719.4 499.1l-296.1-215A15.9 15.9 0 00398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 000-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z" } }] }, "name": "play-circle", "theme": "outlined" };
      const PlayCircleOutlinedSvg = PlayCircleOutlined$2;
      function _objectSpread$1(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty$1(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty$1(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var PlayCircleOutlined = function PlayCircleOutlined2(props, context) {
        var p = _objectSpread$1({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread$1({}, p, {
          "icon": PlayCircleOutlinedSvg
        }), null);
      };
      PlayCircleOutlined.displayName = "PlayCircleOutlined";
      PlayCircleOutlined.inheritAttrs = false;
      const PlayCircleOutlined$1 = PlayCircleOutlined;
      var PoweroffOutlined$2 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M705.6 124.9a8 8 0 00-11.6 7.2v64.2c0 5.5 2.9 10.6 7.5 13.6a352.2 352.2 0 0162.2 49.8c32.7 32.8 58.4 70.9 76.3 113.3a355 355 0 0127.9 138.7c0 48.1-9.4 94.8-27.9 138.7a355.92 355.92 0 01-76.3 113.3 353.06 353.06 0 01-113.2 76.4c-43.8 18.6-90.5 28-138.5 28s-94.7-9.4-138.5-28a353.06 353.06 0 01-113.2-76.4A355.92 355.92 0 01184 650.4a355 355 0 01-27.9-138.7c0-48.1 9.4-94.8 27.9-138.7 17.9-42.4 43.6-80.5 76.3-113.3 19-19 39.8-35.6 62.2-49.8 4.7-2.9 7.5-8.1 7.5-13.6V132c0-6-6.3-9.8-11.6-7.2C178.5 195.2 82 339.3 80 506.3 77.2 745.1 272.5 943.5 511.2 944c239 .5 432.8-193.3 432.8-432.4 0-169.2-97-315.7-238.4-386.7zM480 560h64c4.4 0 8-3.6 8-8V88c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z" } }] }, "name": "poweroff", "theme": "outlined" };
      const PoweroffOutlinedSvg = PoweroffOutlined$2;
      function _objectSpread(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = arguments[i2] != null ? Object(arguments[i2]) : {};
          var ownKeys2 = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys2.forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          });
        }
        return target;
      }
      function _defineProperty(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var PoweroffOutlined = function PoweroffOutlined2(props, context) {
        var p = _objectSpread({}, props, context.attrs);
        return vue.createVNode(AntdIcon, _objectSpread({}, p, {
          "icon": PoweroffOutlinedSvg
        }), null);
      };
      PoweroffOutlined.displayName = "PoweroffOutlined";
      PoweroffOutlined.inheritAttrs = false;
      const PoweroffOutlined$1 = PoweroffOutlined;
      var NodeType;
      (function(NodeType2) {
        NodeType2[NodeType2["Document"] = 0] = "Document";
        NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
        NodeType2[NodeType2["Element"] = 2] = "Element";
        NodeType2[NodeType2["Text"] = 3] = "Text";
        NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
        NodeType2[NodeType2["Comment"] = 5] = "Comment";
      })(NodeType || (NodeType = {}));
      function isElement(n2) {
        return n2.nodeType === n2.ELEMENT_NODE;
      }
      function isShadowRoot(n2) {
        var host = n2 === null || n2 === void 0 ? void 0 : n2.host;
        return Boolean((host === null || host === void 0 ? void 0 : host.shadowRoot) === n2);
      }
      function isNativeShadowDom(shadowRoot) {
        return Object.prototype.toString.call(shadowRoot) === "[object ShadowRoot]";
      }
      function fixBrowserCompatibilityIssuesInCSS(cssText) {
        if (cssText.includes(" background-clip: text;") && !cssText.includes(" -webkit-background-clip: text;")) {
          cssText = cssText.replace(" background-clip: text;", " -webkit-background-clip: text; background-clip: text;");
        }
        return cssText;
      }
      function getCssRulesString(s2) {
        try {
          var rules = s2.rules || s2.cssRules;
          return rules ? fixBrowserCompatibilityIssuesInCSS(Array.from(rules).map(getCssRuleString).join("")) : null;
        } catch (error) {
          return null;
        }
      }
      function getCssRuleString(rule) {
        var cssStringified = rule.cssText;
        if (isCSSImportRule(rule)) {
          try {
            cssStringified = getCssRulesString(rule.styleSheet) || cssStringified;
          } catch (_a2) {
          }
        }
        return cssStringified;
      }
      function isCSSImportRule(rule) {
        return "styleSheet" in rule;
      }
      var Mirror = function() {
        function Mirror2() {
          this.idNodeMap = /* @__PURE__ */ new Map();
          this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        }
        Mirror2.prototype.getId = function(n2) {
          var _a2;
          if (!n2)
            return -1;
          var id = (_a2 = this.getMeta(n2)) === null || _a2 === void 0 ? void 0 : _a2.id;
          return id !== null && id !== void 0 ? id : -1;
        };
        Mirror2.prototype.getNode = function(id) {
          return this.idNodeMap.get(id) || null;
        };
        Mirror2.prototype.getIds = function() {
          return Array.from(this.idNodeMap.keys());
        };
        Mirror2.prototype.getMeta = function(n2) {
          return this.nodeMetaMap.get(n2) || null;
        };
        Mirror2.prototype.removeNodeFromMap = function(n2) {
          var _this = this;
          var id = this.getId(n2);
          this.idNodeMap["delete"](id);
          if (n2.childNodes) {
            n2.childNodes.forEach(function(childNode) {
              return _this.removeNodeFromMap(childNode);
            });
          }
        };
        Mirror2.prototype.has = function(id) {
          return this.idNodeMap.has(id);
        };
        Mirror2.prototype.hasNode = function(node2) {
          return this.nodeMetaMap.has(node2);
        };
        Mirror2.prototype.add = function(n2, meta) {
          var id = meta.id;
          this.idNodeMap.set(id, n2);
          this.nodeMetaMap.set(n2, meta);
        };
        Mirror2.prototype.replace = function(id, n2) {
          var oldNode = this.getNode(id);
          if (oldNode) {
            var meta = this.nodeMetaMap.get(oldNode);
            if (meta)
              this.nodeMetaMap.set(n2, meta);
          }
          this.idNodeMap.set(id, n2);
        };
        Mirror2.prototype.reset = function() {
          this.idNodeMap = /* @__PURE__ */ new Map();
          this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
        };
        return Mirror2;
      }();
      function createMirror() {
        return new Mirror();
      }
      function maskInputValue(_a2) {
        var maskInputOptions = _a2.maskInputOptions, tagName = _a2.tagName, type = _a2.type, value = _a2.value, maskInputFn = _a2.maskInputFn;
        var text = value || "";
        if (maskInputOptions[tagName.toLowerCase()] || maskInputOptions[type]) {
          if (maskInputFn) {
            text = maskInputFn(text);
          } else {
            text = "*".repeat(text.length);
          }
        }
        return text;
      }
      var ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
      function is2DCanvasBlank(canvas) {
        var ctx = canvas.getContext("2d");
        if (!ctx)
          return true;
        var chunkSize = 50;
        for (var x2 = 0; x2 < canvas.width; x2 += chunkSize) {
          for (var y2 = 0; y2 < canvas.height; y2 += chunkSize) {
            var getImageData = ctx.getImageData;
            var originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData;
            var pixelBuffer = new Uint32Array(originalGetImageData.call(ctx, x2, y2, Math.min(chunkSize, canvas.width - x2), Math.min(chunkSize, canvas.height - y2)).data.buffer);
            if (pixelBuffer.some(function(pixel) {
              return pixel !== 0;
            }))
              return false;
          }
        }
        return true;
      }
      var _id = 1;
      var tagNameRegex = new RegExp("[^a-z0-9-_:]");
      var IGNORED_NODE = -2;
      function genId() {
        return _id++;
      }
      function getValidTagName(element) {
        if (element instanceof HTMLFormElement) {
          return "form";
        }
        var processedTagName = element.tagName.toLowerCase().trim();
        if (tagNameRegex.test(processedTagName)) {
          return "div";
        }
        return processedTagName;
      }
      function stringifyStyleSheet(sheet) {
        return sheet.cssRules ? Array.from(sheet.cssRules).map(function(rule) {
          return rule.cssText || "";
        }).join("") : "";
      }
      function extractOrigin(url) {
        var origin = "";
        if (url.indexOf("//") > -1) {
          origin = url.split("/").slice(0, 3).join("/");
        } else {
          origin = url.split("/")[0];
        }
        origin = origin.split("?")[0];
        return origin;
      }
      var canvasService;
      var canvasCtx;
      var URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
      var RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/|#).*/;
      var DATA_URI = /^(data:)([^,]*),(.*)/i;
      function absoluteToStylesheet(cssText, href) {
        return (cssText || "").replace(URL_IN_CSS_REF, function(origin, quote1, path1, quote2, path2, path3) {
          var filePath = path1 || path2 || path3;
          var maybeQuote = quote1 || quote2 || "";
          if (!filePath) {
            return origin;
          }
          if (!RELATIVE_PATH.test(filePath)) {
            return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
          }
          if (DATA_URI.test(filePath)) {
            return "url(".concat(maybeQuote).concat(filePath).concat(maybeQuote, ")");
          }
          if (filePath[0] === "/") {
            return "url(".concat(maybeQuote).concat(extractOrigin(href) + filePath).concat(maybeQuote, ")");
          }
          var stack = href.split("/");
          var parts = filePath.split("/");
          stack.pop();
          for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            if (part === ".") {
              continue;
            } else if (part === "..") {
              stack.pop();
            } else {
              stack.push(part);
            }
          }
          return "url(".concat(maybeQuote).concat(stack.join("/")).concat(maybeQuote, ")");
        });
      }
      var SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
      var SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
      function getAbsoluteSrcsetString(doc, attributeValue) {
        if (attributeValue.trim() === "") {
          return attributeValue;
        }
        var pos = 0;
        function collectCharacters(regEx) {
          var chars2;
          var match = regEx.exec(attributeValue.substring(pos));
          if (match) {
            chars2 = match[0];
            pos += chars2.length;
            return chars2;
          }
          return "";
        }
        var output = [];
        while (true) {
          collectCharacters(SRCSET_COMMAS_OR_SPACES);
          if (pos >= attributeValue.length) {
            break;
          }
          var url = collectCharacters(SRCSET_NOT_SPACES);
          if (url.slice(-1) === ",") {
            url = absoluteToDoc(doc, url.substring(0, url.length - 1));
            output.push(url);
          } else {
            var descriptorsStr = "";
            url = absoluteToDoc(doc, url);
            var inParens = false;
            while (true) {
              var c2 = attributeValue.charAt(pos);
              if (c2 === "") {
                output.push((url + descriptorsStr).trim());
                break;
              } else if (!inParens) {
                if (c2 === ",") {
                  pos += 1;
                  output.push((url + descriptorsStr).trim());
                  break;
                } else if (c2 === "(") {
                  inParens = true;
                }
              } else {
                if (c2 === ")") {
                  inParens = false;
                }
              }
              descriptorsStr += c2;
              pos += 1;
            }
          }
        }
        return output.join(", ");
      }
      function absoluteToDoc(doc, attributeValue) {
        if (!attributeValue || attributeValue.trim() === "") {
          return attributeValue;
        }
        var a2 = doc.createElement("a");
        a2.href = attributeValue;
        return a2.href;
      }
      function isSVGElement(el) {
        return Boolean(el.tagName === "svg" || el.ownerSVGElement);
      }
      function getHref() {
        var a2 = document.createElement("a");
        a2.href = "";
        return a2.href;
      }
      function transformAttribute(doc, tagName, name, value) {
        if (name === "src" || name === "href" && value && !(tagName === "use" && value[0] === "#")) {
          return absoluteToDoc(doc, value);
        } else if (name === "xlink:href" && value && value[0] !== "#") {
          return absoluteToDoc(doc, value);
        } else if (name === "background" && value && (tagName === "table" || tagName === "td" || tagName === "th")) {
          return absoluteToDoc(doc, value);
        } else if (name === "srcset" && value) {
          return getAbsoluteSrcsetString(doc, value);
        } else if (name === "style" && value) {
          return absoluteToStylesheet(value, getHref());
        } else if (tagName === "object" && name === "data" && value) {
          return absoluteToDoc(doc, value);
        } else {
          return value;
        }
      }
      function _isBlockedElement(element, blockClass, blockSelector) {
        if (typeof blockClass === "string") {
          if (element.classList.contains(blockClass)) {
            return true;
          }
        } else {
          for (var eIndex = element.classList.length; eIndex--; ) {
            var className = element.classList[eIndex];
            if (blockClass.test(className)) {
              return true;
            }
          }
        }
        if (blockSelector) {
          return element.matches(blockSelector);
        }
        return false;
      }
      function classMatchesRegex(node2, regex, checkAncestors) {
        if (!node2)
          return false;
        if (node2.nodeType !== node2.ELEMENT_NODE) {
          if (!checkAncestors)
            return false;
          return classMatchesRegex(node2.parentNode, regex, checkAncestors);
        }
        for (var eIndex = node2.classList.length; eIndex--; ) {
          var className = node2.classList[eIndex];
          if (regex.test(className)) {
            return true;
          }
        }
        if (!checkAncestors)
          return false;
        return classMatchesRegex(node2.parentNode, regex, checkAncestors);
      }
      function needMaskingText(node2, maskTextClass, maskTextSelector) {
        var el = node2.nodeType === node2.ELEMENT_NODE ? node2 : node2.parentElement;
        if (el === null)
          return false;
        if (typeof maskTextClass === "string") {
          if (el.classList.contains(maskTextClass))
            return true;
          if (el.closest(".".concat(maskTextClass)))
            return true;
        } else {
          if (classMatchesRegex(el, maskTextClass, true))
            return true;
        }
        if (maskTextSelector) {
          if (el.matches(maskTextSelector))
            return true;
          if (el.closest(maskTextSelector))
            return true;
        }
        return false;
      }
      function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
        var win = iframeEl.contentWindow;
        if (!win) {
          return;
        }
        var fired = false;
        var readyState;
        try {
          readyState = win.document.readyState;
        } catch (error) {
          return;
        }
        if (readyState !== "complete") {
          var timer_1 = setTimeout(function() {
            if (!fired) {
              listener();
              fired = true;
            }
          }, iframeLoadTimeout);
          iframeEl.addEventListener("load", function() {
            clearTimeout(timer_1);
            fired = true;
            listener();
          });
          return;
        }
        var blankUrl = "about:blank";
        if (win.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
          setTimeout(listener, 0);
          return iframeEl.addEventListener("load", listener);
        }
        iframeEl.addEventListener("load", listener);
      }
      function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
        var fired = false;
        var styleSheetLoaded;
        try {
          styleSheetLoaded = link.sheet;
        } catch (error) {
          return;
        }
        if (styleSheetLoaded)
          return;
        var timer = setTimeout(function() {
          if (!fired) {
            listener();
            fired = true;
          }
        }, styleSheetLoadTimeout);
        link.addEventListener("load", function() {
          clearTimeout(timer);
          fired = true;
          listener();
        });
      }
      function serializeNode(n2, options) {
        var doc = options.doc, mirror2 = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, inlineStylesheet = options.inlineStylesheet, _a2 = options.maskInputOptions, maskInputOptions = _a2 === void 0 ? {} : _a2, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, _b2 = options.dataURLOptions, dataURLOptions = _b2 === void 0 ? {} : _b2, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c;
        var rootId = getRootId(doc, mirror2);
        switch (n2.nodeType) {
          case n2.DOCUMENT_NODE:
            if (n2.compatMode !== "CSS1Compat") {
              return {
                type: NodeType.Document,
                childNodes: [],
                compatMode: n2.compatMode
              };
            } else {
              return {
                type: NodeType.Document,
                childNodes: []
              };
            }
          case n2.DOCUMENT_TYPE_NODE:
            return {
              type: NodeType.DocumentType,
              name: n2.name,
              publicId: n2.publicId,
              systemId: n2.systemId,
              rootId
            };
          case n2.ELEMENT_NODE:
            return serializeElementNode(n2, {
              doc,
              blockClass,
              blockSelector,
              inlineStylesheet,
              maskInputOptions,
              maskInputFn,
              dataURLOptions,
              inlineImages,
              recordCanvas,
              keepIframeSrcFn,
              newlyAddedElement,
              rootId
            });
          case n2.TEXT_NODE:
            return serializeTextNode(n2, {
              maskTextClass,
              maskTextSelector,
              maskTextFn,
              rootId
            });
          case n2.CDATA_SECTION_NODE:
            return {
              type: NodeType.CDATA,
              textContent: "",
              rootId
            };
          case n2.COMMENT_NODE:
            return {
              type: NodeType.Comment,
              textContent: n2.textContent || "",
              rootId
            };
          default:
            return false;
        }
      }
      function getRootId(doc, mirror2) {
        if (!mirror2.hasNode(doc))
          return void 0;
        var docId = mirror2.getId(doc);
        return docId === 1 ? void 0 : docId;
      }
      function serializeTextNode(n2, options) {
        var _a2;
        var maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, maskTextFn = options.maskTextFn, rootId = options.rootId;
        var parentTagName = n2.parentNode && n2.parentNode.tagName;
        var textContent = n2.textContent;
        var isStyle = parentTagName === "STYLE" ? true : void 0;
        var isScript = parentTagName === "SCRIPT" ? true : void 0;
        if (isStyle && textContent) {
          try {
            if (n2.nextSibling || n2.previousSibling) {
            } else if ((_a2 = n2.parentNode.sheet) === null || _a2 === void 0 ? void 0 : _a2.cssRules) {
              textContent = stringifyStyleSheet(n2.parentNode.sheet);
            }
          } catch (err) {
            console.warn("Cannot get CSS styles from text's parentNode. Error: ".concat(err), n2);
          }
          textContent = absoluteToStylesheet(textContent, getHref());
        }
        if (isScript) {
          textContent = "SCRIPT_PLACEHOLDER";
        }
        if (!isStyle && !isScript && textContent && needMaskingText(n2, maskTextClass, maskTextSelector)) {
          textContent = maskTextFn ? maskTextFn(textContent) : textContent.replace(/[\S]/g, "*");
        }
        return {
          type: NodeType.Text,
          textContent: textContent || "",
          isStyle,
          rootId
        };
      }
      function serializeElementNode(n2, options) {
        var doc = options.doc, blockClass = options.blockClass, blockSelector = options.blockSelector, inlineStylesheet = options.inlineStylesheet, _a2 = options.maskInputOptions, maskInputOptions = _a2 === void 0 ? {} : _a2, maskInputFn = options.maskInputFn, _b2 = options.dataURLOptions, dataURLOptions = _b2 === void 0 ? {} : _b2, inlineImages = options.inlineImages, recordCanvas = options.recordCanvas, keepIframeSrcFn = options.keepIframeSrcFn, _c = options.newlyAddedElement, newlyAddedElement = _c === void 0 ? false : _c, rootId = options.rootId;
        var needBlock = _isBlockedElement(n2, blockClass, blockSelector);
        var tagName = getValidTagName(n2);
        var attributes = {};
        var len = n2.attributes.length;
        for (var i2 = 0; i2 < len; i2++) {
          var attr = n2.attributes[i2];
          attributes[attr.name] = transformAttribute(doc, tagName, attr.name, attr.value);
        }
        if (tagName === "link" && inlineStylesheet) {
          var stylesheet = Array.from(doc.styleSheets).find(function(s2) {
            return s2.href === n2.href;
          });
          var cssText = null;
          if (stylesheet) {
            cssText = getCssRulesString(stylesheet);
          }
          if (cssText) {
            delete attributes.rel;
            delete attributes.href;
            attributes._cssText = absoluteToStylesheet(cssText, stylesheet.href);
          }
        }
        if (tagName === "style" && n2.sheet && !(n2.innerText || n2.textContent || "").trim().length) {
          var cssText = getCssRulesString(n2.sheet);
          if (cssText) {
            attributes._cssText = absoluteToStylesheet(cssText, getHref());
          }
        }
        if (tagName === "input" || tagName === "textarea" || tagName === "select") {
          var value = n2.value;
          var checked = n2.checked;
          if (attributes.type !== "radio" && attributes.type !== "checkbox" && attributes.type !== "submit" && attributes.type !== "button" && value) {
            attributes.value = maskInputValue({
              type: attributes.type,
              tagName,
              value,
              maskInputOptions,
              maskInputFn
            });
          } else if (checked) {
            attributes.checked = checked;
          }
        }
        if (tagName === "option") {
          if (n2.selected && !maskInputOptions["select"]) {
            attributes.selected = true;
          } else {
            delete attributes.selected;
          }
        }
        if (tagName === "canvas" && recordCanvas) {
          if (n2.__context === "2d") {
            if (!is2DCanvasBlank(n2)) {
              attributes.rr_dataURL = n2.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            }
          } else if (!("__context" in n2)) {
            var canvasDataURL = n2.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            var blankCanvas = document.createElement("canvas");
            blankCanvas.width = n2.width;
            blankCanvas.height = n2.height;
            var blankCanvasDataURL = blankCanvas.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            if (canvasDataURL !== blankCanvasDataURL) {
              attributes.rr_dataURL = canvasDataURL;
            }
          }
        }
        if (tagName === "img" && inlineImages) {
          if (!canvasService) {
            canvasService = doc.createElement("canvas");
            canvasCtx = canvasService.getContext("2d");
          }
          var image_1 = n2;
          var oldValue_1 = image_1.crossOrigin;
          image_1.crossOrigin = "anonymous";
          var recordInlineImage = function() {
            try {
              canvasService.width = image_1.naturalWidth;
              canvasService.height = image_1.naturalHeight;
              canvasCtx.drawImage(image_1, 0, 0);
              attributes.rr_dataURL = canvasService.toDataURL(dataURLOptions.type, dataURLOptions.quality);
            } catch (err) {
              console.warn("Cannot inline img src=".concat(image_1.currentSrc, "! Error: ").concat(err));
            }
            oldValue_1 ? attributes.crossOrigin = oldValue_1 : image_1.removeAttribute("crossorigin");
          };
          if (image_1.complete && image_1.naturalWidth !== 0)
            recordInlineImage();
          else
            image_1.onload = recordInlineImage;
        }
        if (tagName === "audio" || tagName === "video") {
          attributes.rr_mediaState = n2.paused ? "paused" : "played";
          attributes.rr_mediaCurrentTime = n2.currentTime;
        }
        if (!newlyAddedElement) {
          if (n2.scrollLeft) {
            attributes.rr_scrollLeft = n2.scrollLeft;
          }
          if (n2.scrollTop) {
            attributes.rr_scrollTop = n2.scrollTop;
          }
        }
        if (needBlock) {
          var _d = n2.getBoundingClientRect(), width = _d.width, height = _d.height;
          attributes = {
            "class": attributes["class"],
            rr_width: "".concat(width, "px"),
            rr_height: "".concat(height, "px")
          };
        }
        if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
          if (!n2.contentDocument) {
            attributes.rr_src = attributes.src;
          }
          delete attributes.src;
        }
        return {
          type: NodeType.Element,
          tagName,
          attributes,
          childNodes: [],
          isSVG: isSVGElement(n2) || void 0,
          needBlock,
          rootId
        };
      }
      function lowerIfExists(maybeAttr) {
        if (maybeAttr === void 0) {
          return "";
        } else {
          return maybeAttr.toLowerCase();
        }
      }
      function slimDOMExcluded(sn, slimDOMOptions) {
        if (slimDOMOptions.comment && sn.type === NodeType.Comment) {
          return true;
        } else if (sn.type === NodeType.Element) {
          if (slimDOMOptions.script && (sn.tagName === "script" || sn.tagName === "link" && sn.attributes.rel === "preload" && sn.attributes.as === "script" || sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && sn.attributes.href.endsWith(".js"))) {
            return true;
          } else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(/^msapplication-tile(image|color)$/) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) {
            return true;
          } else if (sn.tagName === "meta") {
            if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
              return true;
            } else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) {
              return true;
            } else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) {
              return true;
            } else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) {
              return true;
            } else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) {
              return true;
            } else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) {
              return true;
            }
          }
        }
        return false;
      }
      function serializeNodeWithId(n2, options) {
        var doc = options.doc, mirror2 = options.mirror, blockClass = options.blockClass, blockSelector = options.blockSelector, maskTextClass = options.maskTextClass, maskTextSelector = options.maskTextSelector, _a2 = options.skipChild, skipChild = _a2 === void 0 ? false : _a2, _b2 = options.inlineStylesheet, inlineStylesheet = _b2 === void 0 ? true : _b2, _c = options.maskInputOptions, maskInputOptions = _c === void 0 ? {} : _c, maskTextFn = options.maskTextFn, maskInputFn = options.maskInputFn, slimDOMOptions = options.slimDOMOptions, _d = options.dataURLOptions, dataURLOptions = _d === void 0 ? {} : _d, _e = options.inlineImages, inlineImages = _e === void 0 ? false : _e, _f = options.recordCanvas, recordCanvas = _f === void 0 ? false : _f, onSerialize = options.onSerialize, onIframeLoad = options.onIframeLoad, _g = options.iframeLoadTimeout, iframeLoadTimeout = _g === void 0 ? 5e3 : _g, onStylesheetLoad = options.onStylesheetLoad, _h = options.stylesheetLoadTimeout, stylesheetLoadTimeout = _h === void 0 ? 5e3 : _h, _j = options.keepIframeSrcFn, keepIframeSrcFn = _j === void 0 ? function() {
          return false;
        } : _j, _k = options.newlyAddedElement, newlyAddedElement = _k === void 0 ? false : _k;
        var _l = options.preserveWhiteSpace, preserveWhiteSpace = _l === void 0 ? true : _l;
        var _serializedNode = serializeNode(n2, {
          doc,
          mirror: mirror2,
          blockClass,
          blockSelector,
          maskTextClass,
          maskTextSelector,
          inlineStylesheet,
          maskInputOptions,
          maskTextFn,
          maskInputFn,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          keepIframeSrcFn,
          newlyAddedElement
        });
        if (!_serializedNode) {
          console.warn(n2, "not serialized");
          return null;
        }
        var id;
        if (mirror2.hasNode(n2)) {
          id = mirror2.getId(n2);
        } else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType.Text && !_serializedNode.isStyle && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) {
          id = IGNORED_NODE;
        } else {
          id = genId();
        }
        var serializedNode = Object.assign(_serializedNode, { id });
        mirror2.add(n2, serializedNode);
        if (id === IGNORED_NODE) {
          return null;
        }
        if (onSerialize) {
          onSerialize(n2);
        }
        var recordChild = !skipChild;
        if (serializedNode.type === NodeType.Element) {
          recordChild = recordChild && !serializedNode.needBlock;
          delete serializedNode.needBlock;
          var shadowRoot = n2.shadowRoot;
          if (shadowRoot && isNativeShadowDom(shadowRoot))
            serializedNode.isShadowHost = true;
        }
        if ((serializedNode.type === NodeType.Document || serializedNode.type === NodeType.Element) && recordChild) {
          if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType.Element && serializedNode.tagName === "head") {
            preserveWhiteSpace = false;
          }
          var bypassOptions = {
            doc,
            mirror: mirror2,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            skipChild,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            slimDOMOptions,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            preserveWhiteSpace,
            onSerialize,
            onIframeLoad,
            iframeLoadTimeout,
            onStylesheetLoad,
            stylesheetLoadTimeout,
            keepIframeSrcFn
          };
          for (var _i = 0, _m = Array.from(n2.childNodes); _i < _m.length; _i++) {
            var childN = _m[_i];
            var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
            if (serializedChildNode) {
              serializedNode.childNodes.push(serializedChildNode);
            }
          }
          if (isElement(n2) && n2.shadowRoot) {
            for (var _o = 0, _p = Array.from(n2.shadowRoot.childNodes); _o < _p.length; _o++) {
              var childN = _p[_o];
              var serializedChildNode = serializeNodeWithId(childN, bypassOptions);
              if (serializedChildNode) {
                isNativeShadowDom(n2.shadowRoot) && (serializedChildNode.isShadow = true);
                serializedNode.childNodes.push(serializedChildNode);
              }
            }
          }
        }
        if (n2.parentNode && isShadowRoot(n2.parentNode) && isNativeShadowDom(n2.parentNode)) {
          serializedNode.isShadow = true;
        }
        if (serializedNode.type === NodeType.Element && serializedNode.tagName === "iframe") {
          onceIframeLoaded(n2, function() {
            var iframeDoc = n2.contentDocument;
            if (iframeDoc && onIframeLoad) {
              var serializedIframeNode = serializeNodeWithId(iframeDoc, {
                doc: iframeDoc,
                mirror: mirror2,
                blockClass,
                blockSelector,
                maskTextClass,
                maskTextSelector,
                skipChild: false,
                inlineStylesheet,
                maskInputOptions,
                maskTextFn,
                maskInputFn,
                slimDOMOptions,
                dataURLOptions,
                inlineImages,
                recordCanvas,
                preserveWhiteSpace,
                onSerialize,
                onIframeLoad,
                iframeLoadTimeout,
                onStylesheetLoad,
                stylesheetLoadTimeout,
                keepIframeSrcFn
              });
              if (serializedIframeNode) {
                onIframeLoad(n2, serializedIframeNode);
              }
            }
          }, iframeLoadTimeout);
        }
        if (serializedNode.type === NodeType.Element && serializedNode.tagName === "link" && serializedNode.attributes.rel === "stylesheet") {
          onceStylesheetLoaded(n2, function() {
            if (onStylesheetLoad) {
              var serializedLinkNode = serializeNodeWithId(n2, {
                doc,
                mirror: mirror2,
                blockClass,
                blockSelector,
                maskTextClass,
                maskTextSelector,
                skipChild: false,
                inlineStylesheet,
                maskInputOptions,
                maskTextFn,
                maskInputFn,
                slimDOMOptions,
                dataURLOptions,
                inlineImages,
                recordCanvas,
                preserveWhiteSpace,
                onSerialize,
                onIframeLoad,
                iframeLoadTimeout,
                onStylesheetLoad,
                stylesheetLoadTimeout,
                keepIframeSrcFn
              });
              if (serializedLinkNode) {
                onStylesheetLoad(n2, serializedLinkNode);
              }
            }
          }, stylesheetLoadTimeout);
        }
        return serializedNode;
      }
      function snapshot(n2, options) {
        var _a2 = options || {}, _b2 = _a2.mirror, mirror2 = _b2 === void 0 ? new Mirror() : _b2, _c = _a2.blockClass, blockClass = _c === void 0 ? "rr-block" : _c, _d = _a2.blockSelector, blockSelector = _d === void 0 ? null : _d, _e = _a2.maskTextClass, maskTextClass = _e === void 0 ? "rr-mask" : _e, _f = _a2.maskTextSelector, maskTextSelector = _f === void 0 ? null : _f, _g = _a2.inlineStylesheet, inlineStylesheet = _g === void 0 ? true : _g, _h = _a2.inlineImages, inlineImages = _h === void 0 ? false : _h, _j = _a2.recordCanvas, recordCanvas = _j === void 0 ? false : _j, _k = _a2.maskAllInputs, maskAllInputs = _k === void 0 ? false : _k, maskTextFn = _a2.maskTextFn, maskInputFn = _a2.maskInputFn, _l = _a2.slimDOM, slimDOM = _l === void 0 ? false : _l, dataURLOptions = _a2.dataURLOptions, preserveWhiteSpace = _a2.preserveWhiteSpace, onSerialize = _a2.onSerialize, onIframeLoad = _a2.onIframeLoad, iframeLoadTimeout = _a2.iframeLoadTimeout, onStylesheetLoad = _a2.onStylesheetLoad, stylesheetLoadTimeout = _a2.stylesheetLoadTimeout, _m = _a2.keepIframeSrcFn, keepIframeSrcFn = _m === void 0 ? function() {
          return false;
        } : _m;
        var maskInputOptions = maskAllInputs === true ? {
          color: true,
          date: true,
          "datetime-local": true,
          email: true,
          month: true,
          number: true,
          range: true,
          search: true,
          tel: true,
          text: true,
          time: true,
          url: true,
          week: true,
          textarea: true,
          select: true,
          password: true
        } : maskAllInputs === false ? {
          password: true
        } : maskAllInputs;
        var slimDOMOptions = slimDOM === true || slimDOM === "all" ? {
          script: true,
          comment: true,
          headFavicon: true,
          headWhitespace: true,
          headMetaDescKeywords: slimDOM === "all",
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaAuthorship: true,
          headMetaVerification: true
        } : slimDOM === false ? {} : slimDOM;
        return serializeNodeWithId(n2, {
          doc: n2,
          mirror: mirror2,
          blockClass,
          blockSelector,
          maskTextClass,
          maskTextSelector,
          skipChild: false,
          inlineStylesheet,
          maskInputOptions,
          maskTextFn,
          maskInputFn,
          slimDOMOptions,
          dataURLOptions,
          inlineImages,
          recordCanvas,
          preserveWhiteSpace,
          onSerialize,
          onIframeLoad,
          iframeLoadTimeout,
          onStylesheetLoad,
          stylesheetLoadTimeout,
          keepIframeSrcFn,
          newlyAddedElement: false
        });
      }
      function on(type, fn, target = document) {
        const options = { capture: true, passive: true };
        target.addEventListener(type, fn, options);
        return () => target.removeEventListener(type, fn, options);
      }
      const DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
      let _mirror = {
        map: {},
        getId() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          return -1;
        },
        getNode() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          return null;
        },
        removeNodeFromMap() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        },
        has() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
          return false;
        },
        reset() {
          console.error(DEPARTED_MIRROR_ACCESS_WARNING);
        }
      };
      if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
        _mirror = new Proxy(_mirror, {
          get(target, prop, receiver) {
            if (prop === "map") {
              console.error(DEPARTED_MIRROR_ACCESS_WARNING);
            }
            return Reflect.get(target, prop, receiver);
          }
        });
      }
      function throttle(func, wait, options = {}) {
        let timeout = null;
        let previous = 0;
        return function(...args) {
          const now2 = Date.now();
          if (!previous && options.leading === false) {
            previous = now2;
          }
          const remaining = wait - (now2 - previous);
          const context = this;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now2;
            func.apply(context, args);
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(() => {
              previous = options.leading === false ? 0 : Date.now();
              timeout = null;
              func.apply(context, args);
            }, remaining);
          }
        };
      }
      function hookSetter(target, key2, d2, isRevoked, win = window) {
        const original = win.Object.getOwnPropertyDescriptor(target, key2);
        win.Object.defineProperty(target, key2, isRevoked ? d2 : {
          set(value) {
            setTimeout(() => {
              d2.set.call(this, value);
            }, 0);
            if (original && original.set) {
              original.set.call(this, value);
            }
          }
        });
        return () => hookSetter(target, key2, original || {}, true);
      }
      function patch$1(source, name, replacement) {
        try {
          if (!(name in source)) {
            return () => {
            };
          }
          const original = source[name];
          const wrapped = replacement(original);
          if (typeof wrapped === "function") {
            wrapped.prototype = wrapped.prototype || {};
            Object.defineProperties(wrapped, {
              __rrweb_original__: {
                enumerable: false,
                value: original
              }
            });
          }
          source[name] = wrapped;
          return () => {
            source[name] = original;
          };
        } catch (_a2) {
          return () => {
          };
        }
      }
      function getWindowHeight() {
        return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
      }
      function getWindowWidth() {
        return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
      }
      function isBlocked(node2, blockClass, blockSelector, checkAncestors) {
        if (!node2) {
          return false;
        }
        const el = node2.nodeType === node2.ELEMENT_NODE ? node2 : node2.parentElement;
        if (!el)
          return false;
        if (typeof blockClass === "string") {
          if (el.classList.contains(blockClass))
            return true;
          if (checkAncestors && el.closest("." + blockClass) !== null)
            return true;
        } else {
          if (classMatchesRegex(el, blockClass, checkAncestors))
            return true;
        }
        if (blockSelector) {
          if (node2.matches(blockSelector))
            return true;
          if (checkAncestors && el.closest(blockSelector) !== null)
            return true;
        }
        return false;
      }
      function isSerialized(n2, mirror2) {
        return mirror2.getId(n2) !== -1;
      }
      function isIgnored(n2, mirror2) {
        return mirror2.getId(n2) === IGNORED_NODE;
      }
      function isAncestorRemoved(target, mirror2) {
        if (isShadowRoot(target)) {
          return false;
        }
        const id = mirror2.getId(target);
        if (!mirror2.has(id)) {
          return true;
        }
        if (target.parentNode && target.parentNode.nodeType === target.DOCUMENT_NODE) {
          return false;
        }
        if (!target.parentNode) {
          return true;
        }
        return isAncestorRemoved(target.parentNode, mirror2);
      }
      function isTouchEvent(event) {
        return Boolean(event.changedTouches);
      }
      function polyfill(win = window) {
        if ("NodeList" in win && !win.NodeList.prototype.forEach) {
          win.NodeList.prototype.forEach = Array.prototype.forEach;
        }
        if ("DOMTokenList" in win && !win.DOMTokenList.prototype.forEach) {
          win.DOMTokenList.prototype.forEach = Array.prototype.forEach;
        }
        if (!Node.prototype.contains) {
          Node.prototype.contains = (...args) => {
            let node2 = args[0];
            if (!(0 in args)) {
              throw new TypeError("1 argument is required");
            }
            do {
              if (this === node2) {
                return true;
              }
            } while (node2 = node2 && node2.parentNode);
            return false;
          };
        }
      }
      function isSerializedIframe(n2, mirror2) {
        return Boolean(n2.nodeName === "IFRAME" && mirror2.getMeta(n2));
      }
      function isSerializedStylesheet(n2, mirror2) {
        return Boolean(n2.nodeName === "LINK" && n2.nodeType === n2.ELEMENT_NODE && n2.getAttribute && n2.getAttribute("rel") === "stylesheet" && mirror2.getMeta(n2));
      }
      function hasShadowRoot(n2) {
        return Boolean(n2 === null || n2 === void 0 ? void 0 : n2.shadowRoot);
      }
      class StyleSheetMirror {
        constructor() {
          this.id = 1;
          this.styleIDMap = /* @__PURE__ */ new WeakMap();
          this.idStyleMap = /* @__PURE__ */ new Map();
        }
        getId(stylesheet) {
          var _a2;
          return (_a2 = this.styleIDMap.get(stylesheet)) !== null && _a2 !== void 0 ? _a2 : -1;
        }
        has(stylesheet) {
          return this.styleIDMap.has(stylesheet);
        }
        add(stylesheet, id) {
          if (this.has(stylesheet))
            return this.getId(stylesheet);
          let newId;
          if (id === void 0) {
            newId = this.id++;
          } else
            newId = id;
          this.styleIDMap.set(stylesheet, newId);
          this.idStyleMap.set(newId, stylesheet);
          return newId;
        }
        getStyle(id) {
          return this.idStyleMap.get(id) || null;
        }
        reset() {
          this.styleIDMap = /* @__PURE__ */ new WeakMap();
          this.idStyleMap = /* @__PURE__ */ new Map();
          this.id = 1;
        }
        generateId() {
          return this.id++;
        }
      }
      var EventType = /* @__PURE__ */ ((EventType2) => {
        EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
        EventType2[EventType2["Load"] = 1] = "Load";
        EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
        EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
        EventType2[EventType2["Meta"] = 4] = "Meta";
        EventType2[EventType2["Custom"] = 5] = "Custom";
        EventType2[EventType2["Plugin"] = 6] = "Plugin";
        return EventType2;
      })(EventType || {});
      var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
        IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
        IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
        IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
        IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
        IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
        IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
        IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
        IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
        IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
        IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
        IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
        IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
        IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
        IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
        IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
        IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
        return IncrementalSource2;
      })(IncrementalSource || {});
      var MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
        MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
        MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
        MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
        MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
        MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
        MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
        MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
        MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
        MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
        MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
        MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
        return MouseInteractions2;
      })(MouseInteractions || {});
      var CanvasContext = /* @__PURE__ */ ((CanvasContext2) => {
        CanvasContext2[CanvasContext2["2D"] = 0] = "2D";
        CanvasContext2[CanvasContext2["WebGL"] = 1] = "WebGL";
        CanvasContext2[CanvasContext2["WebGL2"] = 2] = "WebGL2";
        return CanvasContext2;
      })(CanvasContext || {});
      function isNodeInLinkedList(n2) {
        return "__ln" in n2;
      }
      class DoubleLinkedList {
        constructor() {
          this.length = 0;
          this.head = null;
        }
        get(position2) {
          if (position2 >= this.length) {
            throw new Error("Position outside of list range");
          }
          let current = this.head;
          for (let index2 = 0; index2 < position2; index2++) {
            current = (current === null || current === void 0 ? void 0 : current.next) || null;
          }
          return current;
        }
        addNode(n2) {
          const node2 = {
            value: n2,
            previous: null,
            next: null
          };
          n2.__ln = node2;
          if (n2.previousSibling && isNodeInLinkedList(n2.previousSibling)) {
            const current = n2.previousSibling.__ln.next;
            node2.next = current;
            node2.previous = n2.previousSibling.__ln;
            n2.previousSibling.__ln.next = node2;
            if (current) {
              current.previous = node2;
            }
          } else if (n2.nextSibling && isNodeInLinkedList(n2.nextSibling) && n2.nextSibling.__ln.previous) {
            const current = n2.nextSibling.__ln.previous;
            node2.previous = current;
            node2.next = n2.nextSibling.__ln;
            n2.nextSibling.__ln.previous = node2;
            if (current) {
              current.next = node2;
            }
          } else {
            if (this.head) {
              this.head.previous = node2;
            }
            node2.next = this.head;
            this.head = node2;
          }
          this.length++;
        }
        removeNode(n2) {
          const current = n2.__ln;
          if (!this.head) {
            return;
          }
          if (!current.previous) {
            this.head = current.next;
            if (this.head) {
              this.head.previous = null;
            }
          } else {
            current.previous.next = current.next;
            if (current.next) {
              current.next.previous = current.previous;
            }
          }
          if (n2.__ln) {
            delete n2.__ln;
          }
          this.length--;
        }
      }
      const moveKey = (id, parentId) => `${id}@${parentId}`;
      class MutationBuffer {
        constructor() {
          this.frozen = false;
          this.locked = false;
          this.texts = [];
          this.attributes = [];
          this.removes = [];
          this.mapRemoves = [];
          this.movedMap = {};
          this.addedSet = /* @__PURE__ */ new Set();
          this.movedSet = /* @__PURE__ */ new Set();
          this.droppedSet = /* @__PURE__ */ new Set();
          this.processMutations = (mutations) => {
            mutations.forEach(this.processMutation);
            this.emit();
          };
          this.emit = () => {
            if (this.frozen || this.locked) {
              return;
            }
            const adds = [];
            const addList = new DoubleLinkedList();
            const getNextId = (n2) => {
              let ns = n2;
              let nextId = IGNORED_NODE;
              while (nextId === IGNORED_NODE) {
                ns = ns && ns.nextSibling;
                nextId = ns && this.mirror.getId(ns);
              }
              return nextId;
            };
            const pushAdd = (n2) => {
              var _a2, _b2, _c, _d;
              let shadowHost = null;
              if (((_b2 = (_a2 = n2.getRootNode) === null || _a2 === void 0 ? void 0 : _a2.call(n2)) === null || _b2 === void 0 ? void 0 : _b2.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && n2.getRootNode().host)
                shadowHost = n2.getRootNode().host;
              let rootShadowHost = shadowHost;
              while (((_d = (_c = rootShadowHost === null || rootShadowHost === void 0 ? void 0 : rootShadowHost.getRootNode) === null || _c === void 0 ? void 0 : _c.call(rootShadowHost)) === null || _d === void 0 ? void 0 : _d.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && rootShadowHost.getRootNode().host)
                rootShadowHost = rootShadowHost.getRootNode().host;
              const notInDoc = !this.doc.contains(n2) && (!rootShadowHost || !this.doc.contains(rootShadowHost));
              if (!n2.parentNode || notInDoc) {
                return;
              }
              const parentId = isShadowRoot(n2.parentNode) ? this.mirror.getId(shadowHost) : this.mirror.getId(n2.parentNode);
              const nextId = getNextId(n2);
              if (parentId === -1 || nextId === -1) {
                return addList.addNode(n2);
              }
              const sn = serializeNodeWithId(n2, {
                doc: this.doc,
                mirror: this.mirror,
                blockClass: this.blockClass,
                blockSelector: this.blockSelector,
                maskTextClass: this.maskTextClass,
                maskTextSelector: this.maskTextSelector,
                skipChild: true,
                newlyAddedElement: true,
                inlineStylesheet: this.inlineStylesheet,
                maskInputOptions: this.maskInputOptions,
                maskTextFn: this.maskTextFn,
                maskInputFn: this.maskInputFn,
                slimDOMOptions: this.slimDOMOptions,
                dataURLOptions: this.dataURLOptions,
                recordCanvas: this.recordCanvas,
                inlineImages: this.inlineImages,
                onSerialize: (currentN) => {
                  if (isSerializedIframe(currentN, this.mirror)) {
                    this.iframeManager.addIframe(currentN);
                  }
                  if (isSerializedStylesheet(currentN, this.mirror)) {
                    this.stylesheetManager.trackLinkElement(currentN);
                  }
                  if (hasShadowRoot(n2)) {
                    this.shadowDomManager.addShadowRoot(n2.shadowRoot, this.doc);
                  }
                },
                onIframeLoad: (iframe, childSn) => {
                  this.iframeManager.attachIframe(iframe, childSn);
                  this.shadowDomManager.observeAttachShadow(iframe);
                },
                onStylesheetLoad: (link, childSn) => {
                  this.stylesheetManager.attachLinkElement(link, childSn);
                }
              });
              if (sn) {
                adds.push({
                  parentId,
                  nextId,
                  node: sn
                });
              }
            };
            while (this.mapRemoves.length) {
              this.mirror.removeNodeFromMap(this.mapRemoves.shift());
            }
            for (const n2 of Array.from(this.movedSet.values())) {
              if (isParentRemoved(this.removes, n2, this.mirror) && !this.movedSet.has(n2.parentNode)) {
                continue;
              }
              pushAdd(n2);
            }
            for (const n2 of Array.from(this.addedSet.values())) {
              if (!isAncestorInSet(this.droppedSet, n2) && !isParentRemoved(this.removes, n2, this.mirror)) {
                pushAdd(n2);
              } else if (isAncestorInSet(this.movedSet, n2)) {
                pushAdd(n2);
              } else {
                this.droppedSet.add(n2);
              }
            }
            let candidate = null;
            while (addList.length) {
              let node2 = null;
              if (candidate) {
                const parentId = this.mirror.getId(candidate.value.parentNode);
                const nextId = getNextId(candidate.value);
                if (parentId !== -1 && nextId !== -1) {
                  node2 = candidate;
                }
              }
              if (!node2) {
                for (let index2 = addList.length - 1; index2 >= 0; index2--) {
                  const _node = addList.get(index2);
                  if (_node) {
                    const parentId = this.mirror.getId(_node.value.parentNode);
                    const nextId = getNextId(_node.value);
                    if (nextId === -1)
                      continue;
                    else if (parentId !== -1) {
                      node2 = _node;
                      break;
                    } else {
                      const unhandledNode = _node.value;
                      if (unhandledNode.parentNode && unhandledNode.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        const shadowHost = unhandledNode.parentNode.host;
                        const parentId2 = this.mirror.getId(shadowHost);
                        if (parentId2 !== -1) {
                          node2 = _node;
                          break;
                        }
                      }
                    }
                  }
                }
              }
              if (!node2) {
                while (addList.head) {
                  addList.removeNode(addList.head.value);
                }
                break;
              }
              candidate = node2.previous;
              addList.removeNode(node2.value);
              pushAdd(node2.value);
            }
            const payload = {
              texts: this.texts.map((text) => ({
                id: this.mirror.getId(text.node),
                value: text.value
              })).filter((text) => this.mirror.has(text.id)),
              attributes: this.attributes.map((attribute) => ({
                id: this.mirror.getId(attribute.node),
                attributes: attribute.attributes
              })).filter((attribute) => this.mirror.has(attribute.id)),
              removes: this.removes,
              adds
            };
            if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
              return;
            }
            this.texts = [];
            this.attributes = [];
            this.removes = [];
            this.addedSet = /* @__PURE__ */ new Set();
            this.movedSet = /* @__PURE__ */ new Set();
            this.droppedSet = /* @__PURE__ */ new Set();
            this.movedMap = {};
            this.mutationCb(payload);
          };
          this.processMutation = (m2) => {
            if (isIgnored(m2.target, this.mirror)) {
              return;
            }
            switch (m2.type) {
              case "characterData": {
                const value = m2.target.textContent;
                if (!isBlocked(m2.target, this.blockClass, this.blockSelector, false) && value !== m2.oldValue) {
                  this.texts.push({
                    value: needMaskingText(m2.target, this.maskTextClass, this.maskTextSelector) && value ? this.maskTextFn ? this.maskTextFn(value) : value.replace(/[\S]/g, "*") : value,
                    node: m2.target
                  });
                }
                break;
              }
              case "attributes": {
                const target = m2.target;
                let value = m2.target.getAttribute(m2.attributeName);
                if (m2.attributeName === "value") {
                  value = maskInputValue({
                    maskInputOptions: this.maskInputOptions,
                    tagName: m2.target.tagName,
                    type: m2.target.getAttribute("type"),
                    value,
                    maskInputFn: this.maskInputFn
                  });
                }
                if (isBlocked(m2.target, this.blockClass, this.blockSelector, false) || value === m2.oldValue) {
                  return;
                }
                let item = this.attributes.find((a2) => a2.node === m2.target);
                if (target.tagName === "IFRAME" && m2.attributeName === "src" && !this.keepIframeSrcFn(value)) {
                  if (!target.contentDocument) {
                    m2.attributeName = "rr_src";
                  } else {
                    return;
                  }
                }
                if (!item) {
                  item = {
                    node: m2.target,
                    attributes: {}
                  };
                  this.attributes.push(item);
                }
                if (m2.attributeName === "style") {
                  const old = this.doc.createElement("span");
                  if (m2.oldValue) {
                    old.setAttribute("style", m2.oldValue);
                  }
                  if (item.attributes.style === void 0 || item.attributes.style === null) {
                    item.attributes.style = {};
                  }
                  const styleObj = item.attributes.style;
                  for (const pname of Array.from(target.style)) {
                    const newValue = target.style.getPropertyValue(pname);
                    const newPriority = target.style.getPropertyPriority(pname);
                    if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                      if (newPriority === "") {
                        styleObj[pname] = newValue;
                      } else {
                        styleObj[pname] = [newValue, newPriority];
                      }
                    }
                  }
                  for (const pname of Array.from(old.style)) {
                    if (target.style.getPropertyValue(pname) === "") {
                      styleObj[pname] = false;
                    }
                  }
                } else {
                  item.attributes[m2.attributeName] = transformAttribute(this.doc, target.tagName, m2.attributeName, value);
                }
                break;
              }
              case "childList": {
                if (isBlocked(m2.target, this.blockClass, this.blockSelector, true))
                  return;
                m2.addedNodes.forEach((n2) => this.genAdds(n2, m2.target));
                m2.removedNodes.forEach((n2) => {
                  const nodeId = this.mirror.getId(n2);
                  const parentId = isShadowRoot(m2.target) ? this.mirror.getId(m2.target.host) : this.mirror.getId(m2.target);
                  if (isBlocked(m2.target, this.blockClass, this.blockSelector, false) || isIgnored(n2, this.mirror) || !isSerialized(n2, this.mirror)) {
                    return;
                  }
                  if (this.addedSet.has(n2)) {
                    deepDelete(this.addedSet, n2);
                    this.droppedSet.add(n2);
                  } else if (this.addedSet.has(m2.target) && nodeId === -1)
                    ;
                  else if (isAncestorRemoved(m2.target, this.mirror))
                    ;
                  else if (this.movedSet.has(n2) && this.movedMap[moveKey(nodeId, parentId)]) {
                    deepDelete(this.movedSet, n2);
                  } else {
                    this.removes.push({
                      parentId,
                      id: nodeId,
                      isShadow: isShadowRoot(m2.target) && isNativeShadowDom(m2.target) ? true : void 0
                    });
                  }
                  this.mapRemoves.push(n2);
                });
                break;
              }
            }
          };
          this.genAdds = (n2, target) => {
            if (this.mirror.hasNode(n2)) {
              if (isIgnored(n2, this.mirror)) {
                return;
              }
              this.movedSet.add(n2);
              let targetId = null;
              if (target && this.mirror.hasNode(target)) {
                targetId = this.mirror.getId(target);
              }
              if (targetId && targetId !== -1) {
                this.movedMap[moveKey(this.mirror.getId(n2), targetId)] = true;
              }
            } else {
              this.addedSet.add(n2);
              this.droppedSet.delete(n2);
            }
            if (!isBlocked(n2, this.blockClass, this.blockSelector, false))
              n2.childNodes.forEach((childN) => this.genAdds(childN));
          };
        }
        init(options) {
          [
            "mutationCb",
            "blockClass",
            "blockSelector",
            "maskTextClass",
            "maskTextSelector",
            "inlineStylesheet",
            "maskInputOptions",
            "maskTextFn",
            "maskInputFn",
            "keepIframeSrcFn",
            "recordCanvas",
            "inlineImages",
            "slimDOMOptions",
            "dataURLOptions",
            "doc",
            "mirror",
            "iframeManager",
            "stylesheetManager",
            "shadowDomManager",
            "canvasManager"
          ].forEach((key2) => {
            this[key2] = options[key2];
          });
        }
        freeze() {
          this.frozen = true;
          this.canvasManager.freeze();
        }
        unfreeze() {
          this.frozen = false;
          this.canvasManager.unfreeze();
          this.emit();
        }
        isFrozen() {
          return this.frozen;
        }
        lock() {
          this.locked = true;
          this.canvasManager.lock();
        }
        unlock() {
          this.locked = false;
          this.canvasManager.unlock();
          this.emit();
        }
        reset() {
          this.shadowDomManager.reset();
          this.canvasManager.reset();
        }
      }
      function deepDelete(addsSet, n2) {
        addsSet.delete(n2);
        n2.childNodes.forEach((childN) => deepDelete(addsSet, childN));
      }
      function isParentRemoved(removes, n2, mirror2) {
        if (removes.length === 0)
          return false;
        return _isParentRemoved(removes, n2, mirror2);
      }
      function _isParentRemoved(removes, n2, mirror2) {
        const { parentNode } = n2;
        if (!parentNode) {
          return false;
        }
        const parentId = mirror2.getId(parentNode);
        if (removes.some((r2) => r2.id === parentId)) {
          return true;
        }
        return _isParentRemoved(removes, parentNode, mirror2);
      }
      function isAncestorInSet(set, n2) {
        if (set.size === 0)
          return false;
        return _isAncestorInSet(set, n2);
      }
      function _isAncestorInSet(set, n2) {
        const { parentNode } = n2;
        if (!parentNode) {
          return false;
        }
        if (set.has(parentNode)) {
          return true;
        }
        return _isAncestorInSet(set, parentNode);
      }
      const mutationBuffers = [];
      const isCSSGroupingRuleSupported = typeof CSSGroupingRule !== "undefined";
      const isCSSMediaRuleSupported = typeof CSSMediaRule !== "undefined";
      const isCSSSupportsRuleSupported = typeof CSSSupportsRule !== "undefined";
      const isCSSConditionRuleSupported = typeof CSSConditionRule !== "undefined";
      function getEventTarget(event) {
        try {
          if ("composedPath" in event) {
            const path = event.composedPath();
            if (path.length) {
              return path[0];
            }
          } else if ("path" in event && event.path.length) {
            return event.path[0];
          }
          return event.target;
        } catch (_a2) {
          return event.target;
        }
      }
      function initMutationObserver(options, rootEl) {
        var _a2, _b2;
        const mutationBuffer = new MutationBuffer();
        mutationBuffers.push(mutationBuffer);
        mutationBuffer.init(options);
        let mutationObserverCtor = window.MutationObserver || window.__rrMutationObserver;
        const angularZoneSymbol = (_b2 = (_a2 = window === null || window === void 0 ? void 0 : window.Zone) === null || _a2 === void 0 ? void 0 : _a2.__symbol__) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, "MutationObserver");
        if (angularZoneSymbol && window[angularZoneSymbol]) {
          mutationObserverCtor = window[angularZoneSymbol];
        }
        const observer = new mutationObserverCtor(mutationBuffer.processMutations.bind(mutationBuffer));
        observer.observe(rootEl, {
          attributes: true,
          attributeOldValue: true,
          characterData: true,
          characterDataOldValue: true,
          childList: true,
          subtree: true
        });
        return observer;
      }
      function initMoveObserver({ mousemoveCb, sampling, doc, mirror: mirror2 }) {
        if (sampling.mousemove === false) {
          return () => {
          };
        }
        const threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
        const callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
        let positions = [];
        let timeBaseline;
        const wrappedCb = throttle((source) => {
          const totalOffset = Date.now() - timeBaseline;
          mousemoveCb(positions.map((p) => {
            p.timeOffset -= totalOffset;
            return p;
          }), source);
          positions = [];
          timeBaseline = null;
        }, callbackThreshold);
        const updatePosition = throttle((evt) => {
          const target = getEventTarget(evt);
          const { clientX, clientY } = isTouchEvent(evt) ? evt.changedTouches[0] : evt;
          if (!timeBaseline) {
            timeBaseline = Date.now();
          }
          positions.push({
            x: clientX,
            y: clientY,
            id: mirror2.getId(target),
            timeOffset: Date.now() - timeBaseline
          });
          wrappedCb(typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource.Drag : evt instanceof MouseEvent ? IncrementalSource.MouseMove : IncrementalSource.TouchMove);
        }, threshold, {
          trailing: false
        });
        const handlers = [
          on("mousemove", updatePosition, doc),
          on("touchmove", updatePosition, doc),
          on("drag", updatePosition, doc)
        ];
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      function initMouseInteractionObserver({ mouseInteractionCb, doc, mirror: mirror2, blockClass, blockSelector, sampling }) {
        if (sampling.mouseInteraction === false) {
          return () => {
          };
        }
        const disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
        const handlers = [];
        const getHandler = (eventKey) => {
          return (event) => {
            const target = getEventTarget(event);
            if (isBlocked(target, blockClass, blockSelector, true)) {
              return;
            }
            const e2 = isTouchEvent(event) ? event.changedTouches[0] : event;
            if (!e2) {
              return;
            }
            const id = mirror2.getId(target);
            const { clientX, clientY } = e2;
            mouseInteractionCb({
              type: MouseInteractions[eventKey],
              id,
              x: clientX,
              y: clientY
            });
          };
        };
        Object.keys(MouseInteractions).filter((key2) => Number.isNaN(Number(key2)) && !key2.endsWith("_Departed") && disableMap[key2] !== false).forEach((eventKey) => {
          const eventName = eventKey.toLowerCase();
          const handler = getHandler(eventKey);
          handlers.push(on(eventName, handler, doc));
        });
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      function initScrollObserver({ scrollCb, doc, mirror: mirror2, blockClass, blockSelector, sampling }) {
        const updatePosition = throttle((evt) => {
          const target = getEventTarget(evt);
          if (!target || isBlocked(target, blockClass, blockSelector, true)) {
            return;
          }
          const id = mirror2.getId(target);
          if (target === doc) {
            const scrollEl = doc.scrollingElement || doc.documentElement;
            scrollCb({
              id,
              x: scrollEl.scrollLeft,
              y: scrollEl.scrollTop
            });
          } else {
            scrollCb({
              id,
              x: target.scrollLeft,
              y: target.scrollTop
            });
          }
        }, sampling.scroll || 100);
        return on("scroll", updatePosition, doc);
      }
      function initViewportResizeObserver({ viewportResizeCb }) {
        let lastH = -1;
        let lastW = -1;
        const updateDimension = throttle(() => {
          const height = getWindowHeight();
          const width = getWindowWidth();
          if (lastH !== height || lastW !== width) {
            viewportResizeCb({
              width: Number(width),
              height: Number(height)
            });
            lastH = height;
            lastW = width;
          }
        }, 200);
        return on("resize", updateDimension, window);
      }
      function wrapEventWithUserTriggeredFlag(v2, enable) {
        const value = Object.assign({}, v2);
        if (!enable)
          delete value.userTriggered;
        return value;
      }
      const INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
      const lastInputValueMap = /* @__PURE__ */ new WeakMap();
      function initInputObserver({ inputCb, doc, mirror: mirror2, blockClass, blockSelector, ignoreClass, maskInputOptions, maskInputFn, sampling, userTriggeredOnInput }) {
        function eventHandler(event) {
          let target = getEventTarget(event);
          const userTriggered = event.isTrusted;
          if (target && target.tagName === "OPTION")
            target = target.parentElement;
          if (!target || !target.tagName || INPUT_TAGS.indexOf(target.tagName) < 0 || isBlocked(target, blockClass, blockSelector, true)) {
            return;
          }
          const type = target.type;
          if (target.classList.contains(ignoreClass)) {
            return;
          }
          let text = target.value;
          let isChecked = false;
          if (type === "radio" || type === "checkbox") {
            isChecked = target.checked;
          } else if (maskInputOptions[target.tagName.toLowerCase()] || maskInputOptions[type]) {
            text = maskInputValue({
              maskInputOptions,
              tagName: target.tagName,
              type,
              value: text,
              maskInputFn
            });
          }
          cbWithDedup(target, wrapEventWithUserTriggeredFlag({ text, isChecked, userTriggered }, userTriggeredOnInput));
          const name = target.name;
          if (type === "radio" && name && isChecked) {
            doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el) => {
              if (el !== target) {
                cbWithDedup(el, wrapEventWithUserTriggeredFlag({
                  text: el.value,
                  isChecked: !isChecked,
                  userTriggered: false
                }, userTriggeredOnInput));
              }
            });
          }
        }
        function cbWithDedup(target, v2) {
          const lastInputValue = lastInputValueMap.get(target);
          if (!lastInputValue || lastInputValue.text !== v2.text || lastInputValue.isChecked !== v2.isChecked) {
            lastInputValueMap.set(target, v2);
            const id = mirror2.getId(target);
            inputCb(Object.assign(Object.assign({}, v2), { id }));
          }
        }
        const events = sampling.input === "last" ? ["change"] : ["input", "change"];
        const handlers = events.map((eventName) => on(eventName, eventHandler, doc));
        const currentWindow = doc.defaultView;
        if (!currentWindow) {
          return () => {
            handlers.forEach((h2) => h2());
          };
        }
        const propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(currentWindow.HTMLInputElement.prototype, "value");
        const hookProperties = [
          [currentWindow.HTMLInputElement.prototype, "value"],
          [currentWindow.HTMLInputElement.prototype, "checked"],
          [currentWindow.HTMLSelectElement.prototype, "value"],
          [currentWindow.HTMLTextAreaElement.prototype, "value"],
          [currentWindow.HTMLSelectElement.prototype, "selectedIndex"],
          [currentWindow.HTMLOptionElement.prototype, "selected"]
        ];
        if (propertyDescriptor && propertyDescriptor.set) {
          handlers.push(...hookProperties.map((p) => hookSetter(p[0], p[1], {
            set() {
              eventHandler({ target: this });
            }
          }, false, currentWindow)));
        }
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      function getNestedCSSRulePositions(rule) {
        const positions = [];
        function recurse(childRule, pos) {
          if (isCSSGroupingRuleSupported && childRule.parentRule instanceof CSSGroupingRule || isCSSMediaRuleSupported && childRule.parentRule instanceof CSSMediaRule || isCSSSupportsRuleSupported && childRule.parentRule instanceof CSSSupportsRule || isCSSConditionRuleSupported && childRule.parentRule instanceof CSSConditionRule) {
            const rules = Array.from(childRule.parentRule.cssRules);
            const index2 = rules.indexOf(childRule);
            pos.unshift(index2);
          } else if (childRule.parentStyleSheet) {
            const rules = Array.from(childRule.parentStyleSheet.cssRules);
            const index2 = rules.indexOf(childRule);
            pos.unshift(index2);
          }
          return pos;
        }
        return recurse(rule, positions);
      }
      function getIdAndStyleId(sheet, mirror2, styleMirror) {
        let id, styleId;
        if (!sheet)
          return {};
        if (sheet.ownerNode)
          id = mirror2.getId(sheet.ownerNode);
        else
          styleId = styleMirror.getId(sheet);
        return {
          styleId,
          id
        };
      }
      function initStyleSheetObserver({ styleSheetRuleCb, mirror: mirror2, stylesheetManager }, { win }) {
        const insertRule = win.CSSStyleSheet.prototype.insertRule;
        win.CSSStyleSheet.prototype.insertRule = function(rule, index2) {
          const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
          if (id && id !== -1 || styleId && styleId !== -1) {
            styleSheetRuleCb({
              id,
              styleId,
              adds: [{ rule, index: index2 }]
            });
          }
          return insertRule.apply(this, [rule, index2]);
        };
        const deleteRule = win.CSSStyleSheet.prototype.deleteRule;
        win.CSSStyleSheet.prototype.deleteRule = function(index2) {
          const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
          if (id && id !== -1 || styleId && styleId !== -1) {
            styleSheetRuleCb({
              id,
              styleId,
              removes: [{ index: index2 }]
            });
          }
          return deleteRule.apply(this, [index2]);
        };
        let replace2;
        if (win.CSSStyleSheet.prototype.replace) {
          replace2 = win.CSSStyleSheet.prototype.replace;
          win.CSSStyleSheet.prototype.replace = function(text) {
            const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                replace: text
              });
            }
            return replace2.apply(this, [text]);
          };
        }
        let replaceSync;
        if (win.CSSStyleSheet.prototype.replaceSync) {
          replaceSync = win.CSSStyleSheet.prototype.replaceSync;
          win.CSSStyleSheet.prototype.replaceSync = function(text) {
            const { id, styleId } = getIdAndStyleId(this, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                replaceSync: text
              });
            }
            return replaceSync.apply(this, [text]);
          };
        }
        const supportedNestedCSSRuleTypes = {};
        if (isCSSGroupingRuleSupported) {
          supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule;
        } else {
          if (isCSSMediaRuleSupported) {
            supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule;
          }
          if (isCSSConditionRuleSupported) {
            supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule;
          }
          if (isCSSSupportsRuleSupported) {
            supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule;
          }
        }
        const unmodifiedFunctions = {};
        Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
          unmodifiedFunctions[typeKey] = {
            insertRule: type.prototype.insertRule,
            deleteRule: type.prototype.deleteRule
          };
          type.prototype.insertRule = function(rule, index2) {
            const { id, styleId } = getIdAndStyleId(this.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                adds: [
                  {
                    rule,
                    index: [
                      ...getNestedCSSRulePositions(this),
                      index2 || 0
                    ]
                  }
                ]
              });
            }
            return unmodifiedFunctions[typeKey].insertRule.apply(this, [rule, index2]);
          };
          type.prototype.deleteRule = function(index2) {
            const { id, styleId } = getIdAndStyleId(this.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                removes: [
                  { index: [...getNestedCSSRulePositions(this), index2] }
                ]
              });
            }
            return unmodifiedFunctions[typeKey].deleteRule.apply(this, [index2]);
          };
        });
        return () => {
          win.CSSStyleSheet.prototype.insertRule = insertRule;
          win.CSSStyleSheet.prototype.deleteRule = deleteRule;
          replace2 && (win.CSSStyleSheet.prototype.replace = replace2);
          replaceSync && (win.CSSStyleSheet.prototype.replaceSync = replaceSync);
          Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
            type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
            type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
          });
        };
      }
      function initAdoptedStyleSheetObserver({ mirror: mirror2, stylesheetManager }, host) {
        var _a2, _b2, _c;
        let hostId = null;
        if (host.nodeName === "#document")
          hostId = mirror2.getId(host);
        else
          hostId = mirror2.getId(host.host);
        const patchTarget = host.nodeName === "#document" ? (_a2 = host.defaultView) === null || _a2 === void 0 ? void 0 : _a2.Document : (_c = (_b2 = host.ownerDocument) === null || _b2 === void 0 ? void 0 : _b2.defaultView) === null || _c === void 0 ? void 0 : _c.ShadowRoot;
        const originalPropertyDescriptor = Object.getOwnPropertyDescriptor(patchTarget === null || patchTarget === void 0 ? void 0 : patchTarget.prototype, "adoptedStyleSheets");
        if (hostId === null || hostId === -1 || !patchTarget || !originalPropertyDescriptor)
          return () => {
          };
        Object.defineProperty(host, "adoptedStyleSheets", {
          configurable: originalPropertyDescriptor.configurable,
          enumerable: originalPropertyDescriptor.enumerable,
          get() {
            var _a3;
            return (_a3 = originalPropertyDescriptor.get) === null || _a3 === void 0 ? void 0 : _a3.call(this);
          },
          set(sheets) {
            var _a3;
            const result = (_a3 = originalPropertyDescriptor.set) === null || _a3 === void 0 ? void 0 : _a3.call(this, sheets);
            if (hostId !== null && hostId !== -1) {
              try {
                stylesheetManager.adoptStyleSheets(sheets, hostId);
              } catch (e2) {
              }
            }
            return result;
          }
        });
        return () => {
          Object.defineProperty(host, "adoptedStyleSheets", {
            configurable: originalPropertyDescriptor.configurable,
            enumerable: originalPropertyDescriptor.enumerable,
            get: originalPropertyDescriptor.get,
            set: originalPropertyDescriptor.set
          });
        };
      }
      function initStyleDeclarationObserver({ styleDeclarationCb, mirror: mirror2, ignoreCSSAttributes, stylesheetManager }, { win }) {
        const setProperty = win.CSSStyleDeclaration.prototype.setProperty;
        win.CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
          var _a2;
          if (ignoreCSSAttributes.has(property)) {
            return setProperty.apply(this, [property, value, priority]);
          }
          const { id, styleId } = getIdAndStyleId((_a2 = this.parentRule) === null || _a2 === void 0 ? void 0 : _a2.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
          if (id && id !== -1 || styleId && styleId !== -1) {
            styleDeclarationCb({
              id,
              styleId,
              set: {
                property,
                value,
                priority
              },
              index: getNestedCSSRulePositions(this.parentRule)
            });
          }
          return setProperty.apply(this, [property, value, priority]);
        };
        const removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
        win.CSSStyleDeclaration.prototype.removeProperty = function(property) {
          var _a2;
          if (ignoreCSSAttributes.has(property)) {
            return removeProperty.apply(this, [property]);
          }
          const { id, styleId } = getIdAndStyleId((_a2 = this.parentRule) === null || _a2 === void 0 ? void 0 : _a2.parentStyleSheet, mirror2, stylesheetManager.styleMirror);
          if (id && id !== -1 || styleId && styleId !== -1) {
            styleDeclarationCb({
              id,
              styleId,
              remove: {
                property
              },
              index: getNestedCSSRulePositions(this.parentRule)
            });
          }
          return removeProperty.apply(this, [property]);
        };
        return () => {
          win.CSSStyleDeclaration.prototype.setProperty = setProperty;
          win.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
        };
      }
      function initMediaInteractionObserver({ mediaInteractionCb, blockClass, blockSelector, mirror: mirror2, sampling }) {
        const handler = (type) => throttle((event) => {
          const target = getEventTarget(event);
          if (!target || isBlocked(target, blockClass, blockSelector, true)) {
            return;
          }
          const { currentTime, volume, muted, playbackRate } = target;
          mediaInteractionCb({
            type,
            id: mirror2.getId(target),
            currentTime,
            volume,
            muted,
            playbackRate
          });
        }, sampling.media || 500);
        const handlers = [
          on("play", handler(0)),
          on("pause", handler(1)),
          on("seeked", handler(2)),
          on("volumechange", handler(3)),
          on("ratechange", handler(4))
        ];
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      function initFontObserver({ fontCb, doc }) {
        const win = doc.defaultView;
        if (!win) {
          return () => {
          };
        }
        const handlers = [];
        const fontMap = /* @__PURE__ */ new WeakMap();
        const originalFontFace = win.FontFace;
        win.FontFace = function FontFace(family, source, descriptors) {
          const fontFace = new originalFontFace(family, source, descriptors);
          fontMap.set(fontFace, {
            family,
            buffer: typeof source !== "string",
            descriptors,
            fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
          });
          return fontFace;
        };
        const restoreHandler = patch$1(doc.fonts, "add", function(original) {
          return function(fontFace) {
            setTimeout(() => {
              const p = fontMap.get(fontFace);
              if (p) {
                fontCb(p);
                fontMap.delete(fontFace);
              }
            }, 0);
            return original.apply(this, [fontFace]);
          };
        });
        handlers.push(() => {
          win.FontFace = originalFontFace;
        });
        handlers.push(restoreHandler);
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      function initSelectionObserver(param) {
        const { doc, mirror: mirror2, blockClass, blockSelector, selectionCb } = param;
        let collapsed = true;
        const updateSelection = () => {
          const selection = doc.getSelection();
          if (!selection || collapsed && (selection === null || selection === void 0 ? void 0 : selection.isCollapsed))
            return;
          collapsed = selection.isCollapsed || false;
          const ranges = [];
          const count = selection.rangeCount || 0;
          for (let i2 = 0; i2 < count; i2++) {
            const range = selection.getRangeAt(i2);
            const { startContainer, startOffset, endContainer, endOffset } = range;
            const blocked = isBlocked(startContainer, blockClass, blockSelector, true) || isBlocked(endContainer, blockClass, blockSelector, true);
            if (blocked)
              continue;
            ranges.push({
              start: mirror2.getId(startContainer),
              startOffset,
              end: mirror2.getId(endContainer),
              endOffset
            });
          }
          selectionCb({ ranges });
        };
        updateSelection();
        return on("selectionchange", updateSelection);
      }
      function mergeHooks(o2, hooks) {
        const { mutationCb, mousemoveCb, mouseInteractionCb, scrollCb, viewportResizeCb, inputCb, mediaInteractionCb, styleSheetRuleCb, styleDeclarationCb, canvasMutationCb, fontCb, selectionCb } = o2;
        o2.mutationCb = (...p) => {
          if (hooks.mutation) {
            hooks.mutation(...p);
          }
          mutationCb(...p);
        };
        o2.mousemoveCb = (...p) => {
          if (hooks.mousemove) {
            hooks.mousemove(...p);
          }
          mousemoveCb(...p);
        };
        o2.mouseInteractionCb = (...p) => {
          if (hooks.mouseInteraction) {
            hooks.mouseInteraction(...p);
          }
          mouseInteractionCb(...p);
        };
        o2.scrollCb = (...p) => {
          if (hooks.scroll) {
            hooks.scroll(...p);
          }
          scrollCb(...p);
        };
        o2.viewportResizeCb = (...p) => {
          if (hooks.viewportResize) {
            hooks.viewportResize(...p);
          }
          viewportResizeCb(...p);
        };
        o2.inputCb = (...p) => {
          if (hooks.input) {
            hooks.input(...p);
          }
          inputCb(...p);
        };
        o2.mediaInteractionCb = (...p) => {
          if (hooks.mediaInteaction) {
            hooks.mediaInteaction(...p);
          }
          mediaInteractionCb(...p);
        };
        o2.styleSheetRuleCb = (...p) => {
          if (hooks.styleSheetRule) {
            hooks.styleSheetRule(...p);
          }
          styleSheetRuleCb(...p);
        };
        o2.styleDeclarationCb = (...p) => {
          if (hooks.styleDeclaration) {
            hooks.styleDeclaration(...p);
          }
          styleDeclarationCb(...p);
        };
        o2.canvasMutationCb = (...p) => {
          if (hooks.canvasMutation) {
            hooks.canvasMutation(...p);
          }
          canvasMutationCb(...p);
        };
        o2.fontCb = (...p) => {
          if (hooks.font) {
            hooks.font(...p);
          }
          fontCb(...p);
        };
        o2.selectionCb = (...p) => {
          if (hooks.selection) {
            hooks.selection(...p);
          }
          selectionCb(...p);
        };
      }
      function initObservers(o2, hooks = {}) {
        const currentWindow = o2.doc.defaultView;
        if (!currentWindow) {
          return () => {
          };
        }
        mergeHooks(o2, hooks);
        const mutationObserver = initMutationObserver(o2, o2.doc);
        const mousemoveHandler = initMoveObserver(o2);
        const mouseInteractionHandler = initMouseInteractionObserver(o2);
        const scrollHandler = initScrollObserver(o2);
        const viewportResizeHandler = initViewportResizeObserver(o2);
        const inputHandler = initInputObserver(o2);
        const mediaInteractionHandler = initMediaInteractionObserver(o2);
        const styleSheetObserver = initStyleSheetObserver(o2, { win: currentWindow });
        const adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o2, o2.doc);
        const styleDeclarationObserver = initStyleDeclarationObserver(o2, {
          win: currentWindow
        });
        const fontObserver = o2.collectFonts ? initFontObserver(o2) : () => {
        };
        const selectionObserver = initSelectionObserver(o2);
        const pluginHandlers = [];
        for (const plugin of o2.plugins) {
          pluginHandlers.push(plugin.observer(plugin.callback, currentWindow, plugin.options));
        }
        return () => {
          mutationBuffers.forEach((b2) => b2.reset());
          mutationObserver.disconnect();
          mousemoveHandler();
          mouseInteractionHandler();
          scrollHandler();
          viewportResizeHandler();
          inputHandler();
          mediaInteractionHandler();
          styleSheetObserver();
          adoptedStyleSheetObserver();
          styleDeclarationObserver();
          fontObserver();
          selectionObserver();
          pluginHandlers.forEach((h2) => h2());
        };
      }
      class CrossOriginIframeMirror {
        constructor(generateIdFn) {
          this.generateIdFn = generateIdFn;
          this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
          this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
        }
        getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
          const idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe);
          const remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe);
          let id = idToRemoteIdMap.get(remoteId);
          if (!id) {
            id = this.generateIdFn();
            idToRemoteIdMap.set(remoteId, id);
            remoteIdToIdMap.set(id, remoteId);
          }
          return id;
        }
        getIds(iframe, remoteId) {
          const idToRemoteIdMap = this.getIdToRemoteIdMap(iframe);
          const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
          return remoteId.map((id) => this.getId(iframe, id, idToRemoteIdMap, remoteIdToIdMap));
        }
        getRemoteId(iframe, id, map) {
          const remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
          if (typeof id !== "number")
            return id;
          const remoteId = remoteIdToIdMap.get(id);
          if (!remoteId)
            return -1;
          return remoteId;
        }
        getRemoteIds(iframe, ids) {
          const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
          return ids.map((id) => this.getRemoteId(iframe, id, remoteIdToIdMap));
        }
        reset(iframe) {
          if (!iframe) {
            this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
            this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
            return;
          }
          this.iframeIdToRemoteIdMap.delete(iframe);
          this.iframeRemoteIdToIdMap.delete(iframe);
        }
        getIdToRemoteIdMap(iframe) {
          let idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
          if (!idToRemoteIdMap) {
            idToRemoteIdMap = /* @__PURE__ */ new Map();
            this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap);
          }
          return idToRemoteIdMap;
        }
        getRemoteIdToIdMap(iframe) {
          let remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
          if (!remoteIdToIdMap) {
            remoteIdToIdMap = /* @__PURE__ */ new Map();
            this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap);
          }
          return remoteIdToIdMap;
        }
      }
      class IframeManager {
        constructor(options) {
          this.iframes = /* @__PURE__ */ new WeakMap();
          this.crossOriginIframeMap = /* @__PURE__ */ new WeakMap();
          this.crossOriginIframeMirror = new CrossOriginIframeMirror(genId);
          this.mutationCb = options.mutationCb;
          this.wrappedEmit = options.wrappedEmit;
          this.stylesheetManager = options.stylesheetManager;
          this.recordCrossOriginIframes = options.recordCrossOriginIframes;
          this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror));
          this.mirror = options.mirror;
          if (this.recordCrossOriginIframes) {
            window.addEventListener("message", this.handleMessage.bind(this));
          }
        }
        addIframe(iframeEl) {
          this.iframes.set(iframeEl, true);
          if (iframeEl.contentWindow)
            this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl);
        }
        addLoadListener(cb) {
          this.loadListener = cb;
        }
        attachIframe(iframeEl, childSn) {
          var _a2;
          this.mutationCb({
            adds: [
              {
                parentId: this.mirror.getId(iframeEl),
                nextId: null,
                node: childSn
              }
            ],
            removes: [],
            texts: [],
            attributes: [],
            isAttachIframe: true
          });
          (_a2 = this.loadListener) === null || _a2 === void 0 ? void 0 : _a2.call(this, iframeEl);
          if (iframeEl.contentDocument && iframeEl.contentDocument.adoptedStyleSheets && iframeEl.contentDocument.adoptedStyleSheets.length > 0)
            this.stylesheetManager.adoptStyleSheets(iframeEl.contentDocument.adoptedStyleSheets, this.mirror.getId(iframeEl.contentDocument));
        }
        handleMessage(message2) {
          if (message2.data.type === "rrweb") {
            const iframeSourceWindow = message2.source;
            if (!iframeSourceWindow)
              return;
            const iframeEl = this.crossOriginIframeMap.get(message2.source);
            if (!iframeEl)
              return;
            const transformedEvent = this.transformCrossOriginEvent(iframeEl, message2.data.event);
            if (transformedEvent)
              this.wrappedEmit(transformedEvent, message2.data.isCheckout);
          }
        }
        transformCrossOriginEvent(iframeEl, e2) {
          var _a2;
          switch (e2.type) {
            case EventType.FullSnapshot: {
              this.crossOriginIframeMirror.reset(iframeEl);
              this.crossOriginIframeStyleMirror.reset(iframeEl);
              this.replaceIdOnNode(e2.data.node, iframeEl);
              return {
                timestamp: e2.timestamp,
                type: EventType.IncrementalSnapshot,
                data: {
                  source: IncrementalSource.Mutation,
                  adds: [
                    {
                      parentId: this.mirror.getId(iframeEl),
                      nextId: null,
                      node: e2.data.node
                    }
                  ],
                  removes: [],
                  texts: [],
                  attributes: [],
                  isAttachIframe: true
                }
              };
            }
            case EventType.Meta:
            case EventType.Load:
            case EventType.DomContentLoaded: {
              return false;
            }
            case EventType.Plugin: {
              return e2;
            }
            case EventType.Custom: {
              this.replaceIds(e2.data.payload, iframeEl, ["id", "parentId", "previousId", "nextId"]);
              return e2;
            }
            case EventType.IncrementalSnapshot: {
              switch (e2.data.source) {
                case IncrementalSource.Mutation: {
                  e2.data.adds.forEach((n2) => {
                    this.replaceIds(n2, iframeEl, [
                      "parentId",
                      "nextId",
                      "previousId"
                    ]);
                    this.replaceIdOnNode(n2.node, iframeEl);
                  });
                  e2.data.removes.forEach((n2) => {
                    this.replaceIds(n2, iframeEl, ["parentId", "id"]);
                  });
                  e2.data.attributes.forEach((n2) => {
                    this.replaceIds(n2, iframeEl, ["id"]);
                  });
                  e2.data.texts.forEach((n2) => {
                    this.replaceIds(n2, iframeEl, ["id"]);
                  });
                  return e2;
                }
                case IncrementalSource.Drag:
                case IncrementalSource.TouchMove:
                case IncrementalSource.MouseMove: {
                  e2.data.positions.forEach((p) => {
                    this.replaceIds(p, iframeEl, ["id"]);
                  });
                  return e2;
                }
                case IncrementalSource.ViewportResize: {
                  return false;
                }
                case IncrementalSource.MediaInteraction:
                case IncrementalSource.MouseInteraction:
                case IncrementalSource.Scroll:
                case IncrementalSource.CanvasMutation:
                case IncrementalSource.Input: {
                  this.replaceIds(e2.data, iframeEl, ["id"]);
                  return e2;
                }
                case IncrementalSource.StyleSheetRule:
                case IncrementalSource.StyleDeclaration: {
                  this.replaceIds(e2.data, iframeEl, ["id"]);
                  this.replaceStyleIds(e2.data, iframeEl, ["styleId"]);
                  return e2;
                }
                case IncrementalSource.Font: {
                  return e2;
                }
                case IncrementalSource.Selection: {
                  e2.data.ranges.forEach((range) => {
                    this.replaceIds(range, iframeEl, ["start", "end"]);
                  });
                  return e2;
                }
                case IncrementalSource.AdoptedStyleSheet: {
                  this.replaceIds(e2.data, iframeEl, ["id"]);
                  this.replaceStyleIds(e2.data, iframeEl, ["styleIds"]);
                  (_a2 = e2.data.styles) === null || _a2 === void 0 ? void 0 : _a2.forEach((style) => {
                    this.replaceStyleIds(style, iframeEl, ["styleId"]);
                  });
                  return e2;
                }
              }
            }
          }
        }
        replace(iframeMirror, obj, iframeEl, keys2) {
          for (const key2 of keys2) {
            if (!Array.isArray(obj[key2]) && typeof obj[key2] !== "number")
              continue;
            if (Array.isArray(obj[key2])) {
              obj[key2] = iframeMirror.getIds(iframeEl, obj[key2]);
            } else {
              obj[key2] = iframeMirror.getId(iframeEl, obj[key2]);
            }
          }
          return obj;
        }
        replaceIds(obj, iframeEl, keys2) {
          return this.replace(this.crossOriginIframeMirror, obj, iframeEl, keys2);
        }
        replaceStyleIds(obj, iframeEl, keys2) {
          return this.replace(this.crossOriginIframeStyleMirror, obj, iframeEl, keys2);
        }
        replaceIdOnNode(node2, iframeEl) {
          this.replaceIds(node2, iframeEl, ["id"]);
          if ("childNodes" in node2) {
            node2.childNodes.forEach((child) => {
              this.replaceIdOnNode(child, iframeEl);
            });
          }
        }
      }
      class ShadowDomManager {
        constructor(options) {
          this.shadowDoms = /* @__PURE__ */ new WeakSet();
          this.restorePatches = [];
          this.mutationCb = options.mutationCb;
          this.scrollCb = options.scrollCb;
          this.bypassOptions = options.bypassOptions;
          this.mirror = options.mirror;
          const manager = this;
          this.restorePatches.push(patch$1(Element.prototype, "attachShadow", function(original) {
            return function(option) {
              const shadowRoot = original.call(this, option);
              if (this.shadowRoot)
                manager.addShadowRoot(this.shadowRoot, this.ownerDocument);
              return shadowRoot;
            };
          }));
        }
        addShadowRoot(shadowRoot, doc) {
          if (!isNativeShadowDom(shadowRoot))
            return;
          if (this.shadowDoms.has(shadowRoot))
            return;
          this.shadowDoms.add(shadowRoot);
          initMutationObserver(Object.assign(Object.assign({}, this.bypassOptions), { doc, mutationCb: this.mutationCb, mirror: this.mirror, shadowDomManager: this }), shadowRoot);
          initScrollObserver(Object.assign(Object.assign({}, this.bypassOptions), { scrollCb: this.scrollCb, doc: shadowRoot, mirror: this.mirror }));
          setTimeout(() => {
            if (shadowRoot.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length > 0)
              this.bypassOptions.stylesheetManager.adoptStyleSheets(shadowRoot.adoptedStyleSheets, this.mirror.getId(shadowRoot.host));
            initAdoptedStyleSheetObserver({
              mirror: this.mirror,
              stylesheetManager: this.bypassOptions.stylesheetManager
            }, shadowRoot);
          }, 0);
        }
        observeAttachShadow(iframeElement) {
          if (iframeElement.contentWindow) {
            const manager = this;
            this.restorePatches.push(patch$1(iframeElement.contentWindow.HTMLElement.prototype, "attachShadow", function(original) {
              return function(option) {
                const shadowRoot = original.call(this, option);
                if (this.shadowRoot)
                  manager.addShadowRoot(this.shadowRoot, iframeElement.contentDocument);
                return shadowRoot;
              };
            }));
          }
        }
        reset() {
          this.restorePatches.forEach((restorePatch) => restorePatch());
          this.shadowDoms = /* @__PURE__ */ new WeakSet();
        }
      }
      /*! *****************************************************************************
      Copyright (c) Microsoft Corporation.
      
      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted.
      
      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      PERFORMANCE OF THIS SOFTWARE.
      ***************************************************************************** */
      function __rest(s2, e2) {
        var t2 = {};
        for (var p in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p) && e2.indexOf(p) < 0)
            t2[p] = s2[p];
        if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
            if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
              t2[p[i2]] = s2[p[i2]];
          }
        return t2;
      }
      function __awaiter(thisArg, _arguments, P2, generator) {
        function adopt(value) {
          return value instanceof P2 ? value : new P2(function(resolve) {
            resolve(value);
          });
        }
        return new (P2 || (P2 = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e2) {
              reject(e2);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e2) {
              reject(e2);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
      for (var i$1 = 0; i$1 < chars.length; i$1++) {
        lookup[chars.charCodeAt(i$1)] = i$1;
      }
      var encode = function(arraybuffer) {
        var bytes = new Uint8Array(arraybuffer), i2, len = bytes.length, base64 = "";
        for (i2 = 0; i2 < len; i2 += 3) {
          base64 += chars[bytes[i2] >> 2];
          base64 += chars[(bytes[i2] & 3) << 4 | bytes[i2 + 1] >> 4];
          base64 += chars[(bytes[i2 + 1] & 15) << 2 | bytes[i2 + 2] >> 6];
          base64 += chars[bytes[i2 + 2] & 63];
        }
        if (len % 3 === 2) {
          base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + "==";
        }
        return base64;
      };
      const canvasVarMap = /* @__PURE__ */ new Map();
      function variableListFor(ctx, ctor) {
        let contextMap = canvasVarMap.get(ctx);
        if (!contextMap) {
          contextMap = /* @__PURE__ */ new Map();
          canvasVarMap.set(ctx, contextMap);
        }
        if (!contextMap.has(ctor)) {
          contextMap.set(ctor, []);
        }
        return contextMap.get(ctor);
      }
      const saveWebGLVar = (value, win, ctx) => {
        if (!value || !(isInstanceOfWebGLObject(value, win) || typeof value === "object"))
          return;
        const name = value.constructor.name;
        const list = variableListFor(ctx, name);
        let index2 = list.indexOf(value);
        if (index2 === -1) {
          index2 = list.length;
          list.push(value);
        }
        return index2;
      };
      function serializeArg(value, win, ctx) {
        if (value instanceof Array) {
          return value.map((arg) => serializeArg(arg, win, ctx));
        } else if (value === null) {
          return value;
        } else if (value instanceof Float32Array || value instanceof Float64Array || value instanceof Int32Array || value instanceof Uint32Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Int16Array || value instanceof Int8Array || value instanceof Uint8ClampedArray) {
          const name = value.constructor.name;
          return {
            rr_type: name,
            args: [Object.values(value)]
          };
        } else if (value instanceof ArrayBuffer) {
          const name = value.constructor.name;
          const base64 = encode(value);
          return {
            rr_type: name,
            base64
          };
        } else if (value instanceof DataView) {
          const name = value.constructor.name;
          return {
            rr_type: name,
            args: [
              serializeArg(value.buffer, win, ctx),
              value.byteOffset,
              value.byteLength
            ]
          };
        } else if (value instanceof HTMLImageElement) {
          const name = value.constructor.name;
          const { src } = value;
          return {
            rr_type: name,
            src
          };
        } else if (value instanceof HTMLCanvasElement) {
          const name = "HTMLImageElement";
          const src = value.toDataURL();
          return {
            rr_type: name,
            src
          };
        } else if (value instanceof ImageData) {
          const name = value.constructor.name;
          return {
            rr_type: name,
            args: [serializeArg(value.data, win, ctx), value.width, value.height]
          };
        } else if (isInstanceOfWebGLObject(value, win) || typeof value === "object") {
          const name = value.constructor.name;
          const index2 = saveWebGLVar(value, win, ctx);
          return {
            rr_type: name,
            index: index2
          };
        }
        return value;
      }
      const serializeArgs = (args, win, ctx) => {
        return [...args].map((arg) => serializeArg(arg, win, ctx));
      };
      const isInstanceOfWebGLObject = (value, win) => {
        const webGLConstructorNames = [
          "WebGLActiveInfo",
          "WebGLBuffer",
          "WebGLFramebuffer",
          "WebGLProgram",
          "WebGLRenderbuffer",
          "WebGLShader",
          "WebGLShaderPrecisionFormat",
          "WebGLTexture",
          "WebGLUniformLocation",
          "WebGLVertexArrayObject",
          "WebGLVertexArrayObjectOES"
        ];
        const supportedWebGLConstructorNames = webGLConstructorNames.filter((name) => typeof win[name] === "function");
        return Boolean(supportedWebGLConstructorNames.find((name) => value instanceof win[name]));
      };
      function initCanvas2DMutationObserver(cb, win, blockClass, blockSelector) {
        const handlers = [];
        const props2D = Object.getOwnPropertyNames(win.CanvasRenderingContext2D.prototype);
        for (const prop of props2D) {
          try {
            if (typeof win.CanvasRenderingContext2D.prototype[prop] !== "function") {
              continue;
            }
            const restoreHandler = patch$1(win.CanvasRenderingContext2D.prototype, prop, function(original) {
              return function(...args) {
                if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
                  setTimeout(() => {
                    const recordArgs = serializeArgs([...args], win, this);
                    cb(this.canvas, {
                      type: CanvasContext["2D"],
                      property: prop,
                      args: recordArgs
                    });
                  }, 0);
                }
                return original.apply(this, args);
              };
            });
            handlers.push(restoreHandler);
          } catch (_a2) {
            const hookHandler = hookSetter(win.CanvasRenderingContext2D.prototype, prop, {
              set(v2) {
                cb(this.canvas, {
                  type: CanvasContext["2D"],
                  property: prop,
                  args: [v2],
                  setter: true
                });
              }
            });
            handlers.push(hookHandler);
          }
        }
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      function initCanvasContextObserver(win, blockClass, blockSelector) {
        const handlers = [];
        try {
          const restoreHandler = patch$1(win.HTMLCanvasElement.prototype, "getContext", function(original) {
            return function(contextType, ...args) {
              if (!isBlocked(this, blockClass, blockSelector, true)) {
                if (!("__context" in this))
                  this.__context = contextType;
              }
              return original.apply(this, [contextType, ...args]);
            };
          });
          handlers.push(restoreHandler);
        } catch (_a2) {
          console.error("failed to patch HTMLCanvasElement.prototype.getContext");
        }
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      function patchGLPrototype(prototype, type, cb, blockClass, blockSelector, mirror2, win) {
        const handlers = [];
        const props = Object.getOwnPropertyNames(prototype);
        for (const prop of props) {
          if ([
            "isContextLost",
            "canvas",
            "drawingBufferWidth",
            "drawingBufferHeight"
          ].includes(prop)) {
            continue;
          }
          try {
            if (typeof prototype[prop] !== "function") {
              continue;
            }
            const restoreHandler = patch$1(prototype, prop, function(original) {
              return function(...args) {
                const result = original.apply(this, args);
                saveWebGLVar(result, win, this);
                if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
                  const recordArgs = serializeArgs([...args], win, this);
                  const mutation = {
                    type,
                    property: prop,
                    args: recordArgs
                  };
                  cb(this.canvas, mutation);
                }
                return result;
              };
            });
            handlers.push(restoreHandler);
          } catch (_a2) {
            const hookHandler = hookSetter(prototype, prop, {
              set(v2) {
                cb(this.canvas, {
                  type,
                  property: prop,
                  args: [v2],
                  setter: true
                });
              }
            });
            handlers.push(hookHandler);
          }
        }
        return handlers;
      }
      function initCanvasWebGLMutationObserver(cb, win, blockClass, blockSelector, mirror2) {
        const handlers = [];
        handlers.push(...patchGLPrototype(win.WebGLRenderingContext.prototype, CanvasContext.WebGL, cb, blockClass, blockSelector, mirror2, win));
        if (typeof win.WebGL2RenderingContext !== "undefined") {
          handlers.push(...patchGLPrototype(win.WebGL2RenderingContext.prototype, CanvasContext.WebGL2, cb, blockClass, blockSelector, mirror2, win));
        }
        return () => {
          handlers.forEach((h2) => h2());
        };
      }
      var WorkerClass = null;
      try {
        var WorkerThreads = typeof module !== "undefined" && typeof module.require === "function" && module.require("worker_threads") || typeof __non_webpack_require__ === "function" && __non_webpack_require__("worker_threads") || typeof require === "function" && require("worker_threads");
        WorkerClass = WorkerThreads.Worker;
      } catch (e2) {
      }
      function decodeBase64$1(base64, enableUnicode) {
        return Buffer.from(base64, "base64").toString(enableUnicode ? "utf16" : "utf8");
      }
      function createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
        var source = decodeBase64$1(base64, enableUnicode);
        var start = source.indexOf("\n", 10) + 1;
        var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
        return function WorkerFactory2(options) {
          return new WorkerClass(body, Object.assign({}, options, { eval: true }));
        };
      }
      function decodeBase64(base64, enableUnicode) {
        var binaryString = atob(base64);
        if (enableUnicode) {
          var binaryView = new Uint8Array(binaryString.length);
          for (var i2 = 0, n2 = binaryString.length; i2 < n2; ++i2) {
            binaryView[i2] = binaryString.charCodeAt(i2);
          }
          return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
        }
        return binaryString;
      }
      function createURL(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === void 0 ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === void 0 ? false : enableUnicodeArg;
        var source = decodeBase64(base64, enableUnicode);
        var start = source.indexOf("\n", 10) + 1;
        var body = source.substring(start) + (sourcemap ? "//# sourceMappingURL=" + sourcemap : "");
        var blob = new Blob([body], { type: "application/javascript" });
        return URL.createObjectURL(blob);
      }
      function createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg) {
        var url;
        return function WorkerFactory2(options) {
          url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
          return new Worker(url, options);
        };
      }
      var kIsNodeJS = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
      function isNodeJS() {
        return kIsNodeJS;
      }
      function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
        if (isNodeJS()) {
          return createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg);
        }
        return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
      }
      var WorkerFactory = createBase64WorkerFactory("Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIC8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKg0KICAgIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLg0KDQogICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55DQogICAgcHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLg0KDQogICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEgNCiAgICBSRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkNCiAgICBBTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsDQogICAgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NDQogICAgTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1INCiAgICBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SDQogICAgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS4NCiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqLw0KDQogICAgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikgew0KICAgICAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH0NCiAgICAgICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7DQogICAgICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvclsidGhyb3ciXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9DQogICAgICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfQ0KICAgICAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpOw0KICAgICAgICB9KTsNCiAgICB9CgogICAgLyoKICAgICAqIGJhc2U2NC1hcnJheWJ1ZmZlciAxLjAuMSA8aHR0cHM6Ly9naXRodWIuY29tL25pa2xhc3ZoL2Jhc2U2NC1hcnJheWJ1ZmZlcj4KICAgICAqIENvcHlyaWdodCAoYykgMjAyMSBOaWtsYXMgdm9uIEhlcnR6ZW4gPGh0dHBzOi8vaGVydHplbi5jb20+CiAgICAgKiBSZWxlYXNlZCB1bmRlciBNSVQgTGljZW5zZQogICAgICovCiAgICB2YXIgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7CiAgICAvLyBVc2UgYSBsb29rdXAgdGFibGUgdG8gZmluZCB0aGUgaW5kZXguCiAgICB2YXIgbG9va3VwID0gdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnID8gW10gOiBuZXcgVWludDhBcnJheSgyNTYpOwogICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykgewogICAgICAgIGxvb2t1cFtjaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7CiAgICB9CiAgICB2YXIgZW5jb2RlID0gZnVuY3Rpb24gKGFycmF5YnVmZmVyKSB7CiAgICAgICAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpLCBpLCBsZW4gPSBieXRlcy5sZW5ndGgsIGJhc2U2NCA9ICcnOwogICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMykgewogICAgICAgICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaV0gPj4gMl07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1soKGJ5dGVzW2ldICYgMykgPDwgNCkgfCAoYnl0ZXNbaSArIDFdID4+IDQpXTsKICAgICAgICAgICAgYmFzZTY0ICs9IGNoYXJzWygoYnl0ZXNbaSArIDFdICYgMTUpIDw8IDIpIHwgKGJ5dGVzW2kgKyAyXSA+PiA2KV07CiAgICAgICAgICAgIGJhc2U2NCArPSBjaGFyc1tieXRlc1tpICsgMl0gJiA2M107CiAgICAgICAgfQogICAgICAgIGlmIChsZW4gJSAzID09PSAyKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgJz0nOwogICAgICAgIH0KICAgICAgICBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7CiAgICAgICAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDIpICsgJz09JzsKICAgICAgICB9CiAgICAgICAgcmV0dXJuIGJhc2U2NDsKICAgIH07CgogICAgY29uc3QgbGFzdEJsb2JNYXAgPSBuZXcgTWFwKCk7DQogICAgY29uc3QgdHJhbnNwYXJlbnRCbG9iTWFwID0gbmV3IE1hcCgpOw0KICAgIGZ1bmN0aW9uIGdldFRyYW5zcGFyZW50QmxvYkZvcih3aWR0aCwgaGVpZ2h0LCBkYXRhVVJMT3B0aW9ucykgew0KICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgew0KICAgICAgICAgICAgY29uc3QgaWQgPSBgJHt3aWR0aH0tJHtoZWlnaHR9YDsNCiAgICAgICAgICAgIGlmICgnT2Zmc2NyZWVuQ2FudmFzJyBpbiBnbG9iYWxUaGlzKSB7DQogICAgICAgICAgICAgICAgaWYgKHRyYW5zcGFyZW50QmxvYk1hcC5oYXMoaWQpKQ0KICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNwYXJlbnRCbG9iTWFwLmdldChpZCk7DQogICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2NyZWVuID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTsNCiAgICAgICAgICAgICAgICBvZmZzY3JlZW4uZ2V0Q29udGV4dCgnMmQnKTsNCiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0geWllbGQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoZGF0YVVSTE9wdGlvbnMpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0geWllbGQgYmxvYi5hcnJheUJ1ZmZlcigpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7DQogICAgICAgICAgICAgICAgdHJhbnNwYXJlbnRCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgICAgICAgICByZXR1cm4gYmFzZTY0Ow0KICAgICAgICAgICAgfQ0KICAgICAgICAgICAgZWxzZSB7DQogICAgICAgICAgICAgICAgcmV0dXJuICcnOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9KTsNCiAgICB9DQogICAgY29uc3Qgd29ya2VyID0gc2VsZjsNCiAgICB3b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHsNCiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHsNCiAgICAgICAgICAgIGlmICgnT2Zmc2NyZWVuQ2FudmFzJyBpbiBnbG9iYWxUaGlzKSB7DQogICAgICAgICAgICAgICAgY29uc3QgeyBpZCwgYml0bWFwLCB3aWR0aCwgaGVpZ2h0LCBkYXRhVVJMT3B0aW9ucyB9ID0gZS5kYXRhOw0KICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zcGFyZW50QmFzZTY0ID0gZ2V0VHJhbnNwYXJlbnRCbG9iRm9yKHdpZHRoLCBoZWlnaHQsIGRhdGFVUkxPcHRpb25zKTsNCiAgICAgICAgICAgICAgICBjb25zdCBvZmZzY3JlZW4gPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoLCBoZWlnaHQpOw0KICAgICAgICAgICAgICAgIGNvbnN0IGN0eCA9IG9mZnNjcmVlbi5nZXRDb250ZXh0KCcyZCcpOw0KICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoYml0bWFwLCAwLCAwKTsNCiAgICAgICAgICAgICAgICBiaXRtYXAuY2xvc2UoKTsNCiAgICAgICAgICAgICAgICBjb25zdCBibG9iID0geWllbGQgb2Zmc2NyZWVuLmNvbnZlcnRUb0Jsb2IoZGF0YVVSTE9wdGlvbnMpOw0KICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBibG9iLnR5cGU7DQogICAgICAgICAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSB5aWVsZCBibG9iLmFycmF5QnVmZmVyKCk7DQogICAgICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZW5jb2RlKGFycmF5QnVmZmVyKTsNCiAgICAgICAgICAgICAgICBpZiAoIWxhc3RCbG9iTWFwLmhhcyhpZCkgJiYgKHlpZWxkIHRyYW5zcGFyZW50QmFzZTY0KSA9PT0gYmFzZTY0KSB7DQogICAgICAgICAgICAgICAgICAgIGxhc3RCbG9iTWFwLnNldChpZCwgYmFzZTY0KTsNCiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtlci5wb3N0TWVzc2FnZSh7IGlkIH0pOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICBpZiAobGFzdEJsb2JNYXAuZ2V0KGlkKSA9PT0gYmFzZTY0KQ0KICAgICAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQgfSk7DQogICAgICAgICAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHsNCiAgICAgICAgICAgICAgICAgICAgaWQsDQogICAgICAgICAgICAgICAgICAgIHR5cGUsDQogICAgICAgICAgICAgICAgICAgIGJhc2U2NCwNCiAgICAgICAgICAgICAgICAgICAgd2lkdGgsDQogICAgICAgICAgICAgICAgICAgIGhlaWdodCwNCiAgICAgICAgICAgICAgICB9KTsNCiAgICAgICAgICAgICAgICBsYXN0QmxvYk1hcC5zZXQoaWQsIGJhc2U2NCk7DQogICAgICAgICAgICB9DQogICAgICAgICAgICBlbHNlIHsNCiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQ6IGUuZGF0YS5pZCB9KTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgfSk7DQogICAgfTsKCn0pKCk7Cgo=", null, false);
      class CanvasManager {
        constructor(options) {
          this.pendingCanvasMutations = /* @__PURE__ */ new Map();
          this.rafStamps = { latestId: 0, invokeId: null };
          this.frozen = false;
          this.locked = false;
          this.processMutation = (target, mutation) => {
            const newFrame = this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId;
            if (newFrame || !this.rafStamps.invokeId)
              this.rafStamps.invokeId = this.rafStamps.latestId;
            if (!this.pendingCanvasMutations.has(target)) {
              this.pendingCanvasMutations.set(target, []);
            }
            this.pendingCanvasMutations.get(target).push(mutation);
          };
          const { sampling = "all", win, blockClass, blockSelector, recordCanvas, dataURLOptions } = options;
          this.mutationCb = options.mutationCb;
          this.mirror = options.mirror;
          if (recordCanvas && sampling === "all")
            this.initCanvasMutationObserver(win, blockClass, blockSelector);
          if (recordCanvas && typeof sampling === "number")
            this.initCanvasFPSObserver(sampling, win, blockClass, blockSelector, {
              dataURLOptions
            });
        }
        reset() {
          this.pendingCanvasMutations.clear();
          this.resetObservers && this.resetObservers();
        }
        freeze() {
          this.frozen = true;
        }
        unfreeze() {
          this.frozen = false;
        }
        lock() {
          this.locked = true;
        }
        unlock() {
          this.locked = false;
        }
        initCanvasFPSObserver(fps, win, blockClass, blockSelector, options) {
          const canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector);
          const snapshotInProgressMap = /* @__PURE__ */ new Map();
          const worker = new WorkerFactory();
          worker.onmessage = (e2) => {
            const { id } = e2.data;
            snapshotInProgressMap.set(id, false);
            if (!("base64" in e2.data))
              return;
            const { base64, type, width, height } = e2.data;
            this.mutationCb({
              id,
              type: CanvasContext["2D"],
              commands: [
                {
                  property: "clearRect",
                  args: [0, 0, width, height]
                },
                {
                  property: "drawImage",
                  args: [
                    {
                      rr_type: "ImageBitmap",
                      args: [
                        {
                          rr_type: "Blob",
                          data: [{ rr_type: "ArrayBuffer", base64 }],
                          type
                        }
                      ]
                    },
                    0,
                    0
                  ]
                }
              ]
            });
          };
          const timeBetweenSnapshots = 1e3 / fps;
          let lastSnapshotTime = 0;
          let rafId;
          const getCanvas = () => {
            const matchedCanvas = [];
            win.document.querySelectorAll("canvas").forEach((canvas) => {
              if (!isBlocked(canvas, blockClass, blockSelector, true)) {
                matchedCanvas.push(canvas);
              }
            });
            return matchedCanvas;
          };
          const takeCanvasSnapshots = (timestamp) => {
            if (lastSnapshotTime && timestamp - lastSnapshotTime < timeBetweenSnapshots) {
              rafId = requestAnimationFrame(takeCanvasSnapshots);
              return;
            }
            lastSnapshotTime = timestamp;
            getCanvas().forEach((canvas) => __awaiter(this, void 0, void 0, function* () {
              var _a2;
              const id = this.mirror.getId(canvas);
              if (snapshotInProgressMap.get(id))
                return;
              snapshotInProgressMap.set(id, true);
              if (["webgl", "webgl2"].includes(canvas.__context)) {
                const context = canvas.getContext(canvas.__context);
                if (((_a2 = context === null || context === void 0 ? void 0 : context.getContextAttributes()) === null || _a2 === void 0 ? void 0 : _a2.preserveDrawingBuffer) === false) {
                  context === null || context === void 0 ? void 0 : context.clear(context.COLOR_BUFFER_BIT);
                }
              }
              const bitmap = yield createImageBitmap(canvas);
              worker.postMessage({
                id,
                bitmap,
                width: canvas.width,
                height: canvas.height,
                dataURLOptions: options.dataURLOptions
              }, [bitmap]);
            }));
            rafId = requestAnimationFrame(takeCanvasSnapshots);
          };
          rafId = requestAnimationFrame(takeCanvasSnapshots);
          this.resetObservers = () => {
            canvasContextReset();
            cancelAnimationFrame(rafId);
          };
        }
        initCanvasMutationObserver(win, blockClass, blockSelector) {
          this.startRAFTimestamping();
          this.startPendingCanvasMutationFlusher();
          const canvasContextReset = initCanvasContextObserver(win, blockClass, blockSelector);
          const canvas2DReset = initCanvas2DMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector);
          const canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(this.processMutation.bind(this), win, blockClass, blockSelector, this.mirror);
          this.resetObservers = () => {
            canvasContextReset();
            canvas2DReset();
            canvasWebGL1and2Reset();
          };
        }
        startPendingCanvasMutationFlusher() {
          requestAnimationFrame(() => this.flushPendingCanvasMutations());
        }
        startRAFTimestamping() {
          const setLatestRAFTimestamp = (timestamp) => {
            this.rafStamps.latestId = timestamp;
            requestAnimationFrame(setLatestRAFTimestamp);
          };
          requestAnimationFrame(setLatestRAFTimestamp);
        }
        flushPendingCanvasMutations() {
          this.pendingCanvasMutations.forEach((values, canvas) => {
            const id = this.mirror.getId(canvas);
            this.flushPendingCanvasMutationFor(canvas, id);
          });
          requestAnimationFrame(() => this.flushPendingCanvasMutations());
        }
        flushPendingCanvasMutationFor(canvas, id) {
          if (this.frozen || this.locked) {
            return;
          }
          const valuesWithType = this.pendingCanvasMutations.get(canvas);
          if (!valuesWithType || id === -1)
            return;
          const values = valuesWithType.map((value) => {
            const rest = __rest(value, ["type"]);
            return rest;
          });
          const { type } = valuesWithType[0];
          this.mutationCb({ id, type, commands: values });
          this.pendingCanvasMutations.delete(canvas);
        }
      }
      class StylesheetManager {
        constructor(options) {
          this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
          this.styleMirror = new StyleSheetMirror();
          this.mutationCb = options.mutationCb;
          this.adoptedStyleSheetCb = options.adoptedStyleSheetCb;
        }
        attachLinkElement(linkEl, childSn) {
          if ("_cssText" in childSn.attributes)
            this.mutationCb({
              adds: [],
              removes: [],
              texts: [],
              attributes: [
                {
                  id: childSn.id,
                  attributes: childSn.attributes
                }
              ]
            });
          this.trackLinkElement(linkEl);
        }
        trackLinkElement(linkEl) {
          if (this.trackedLinkElements.has(linkEl))
            return;
          this.trackedLinkElements.add(linkEl);
          this.trackStylesheetInLinkElement(linkEl);
        }
        adoptStyleSheets(sheets, hostId) {
          if (sheets.length === 0)
            return;
          const adoptedStyleSheetData = {
            id: hostId,
            styleIds: []
          };
          const styles = [];
          for (const sheet of sheets) {
            let styleId;
            if (!this.styleMirror.has(sheet)) {
              styleId = this.styleMirror.add(sheet);
              const rules = Array.from(sheet.rules || CSSRule);
              styles.push({
                styleId,
                rules: rules.map((r2, index2) => {
                  return {
                    rule: getCssRuleString(r2),
                    index: index2
                  };
                })
              });
            } else
              styleId = this.styleMirror.getId(sheet);
            adoptedStyleSheetData.styleIds.push(styleId);
          }
          if (styles.length > 0)
            adoptedStyleSheetData.styles = styles;
          this.adoptedStyleSheetCb(adoptedStyleSheetData);
        }
        reset() {
          this.styleMirror.reset();
          this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
        }
        trackStylesheetInLinkElement(linkEl) {
        }
      }
      function wrapEvent(e2) {
        return Object.assign(Object.assign({}, e2), { timestamp: Date.now() });
      }
      let wrappedEmit;
      let takeFullSnapshot;
      let canvasManager;
      let recording = false;
      const mirror = createMirror();
      function record(options = {}) {
        const { emit, checkoutEveryNms, checkoutEveryNth, blockClass = "rr-block", blockSelector = null, ignoreClass = "rr-ignore", maskTextClass = "rr-mask", maskTextSelector = null, inlineStylesheet = true, maskAllInputs, maskInputOptions: _maskInputOptions, slimDOMOptions: _slimDOMOptions, maskInputFn, maskTextFn, hooks, packFn, sampling = {}, dataURLOptions = {}, mousemoveWait, recordCanvas = false, recordCrossOriginIframes = false, userTriggeredOnInput = false, collectFonts = false, inlineImages = false, plugins, keepIframeSrcFn = () => false, ignoreCSSAttributes = /* @__PURE__ */ new Set([]) } = options;
        const inEmittingFrame = recordCrossOriginIframes ? window.parent === window : true;
        let passEmitsToParent = false;
        if (!inEmittingFrame) {
          try {
            window.parent.document;
            passEmitsToParent = false;
          } catch (e2) {
            passEmitsToParent = true;
          }
        }
        if (inEmittingFrame && !emit) {
          throw new Error("emit function is required");
        }
        if (mousemoveWait !== void 0 && sampling.mousemove === void 0) {
          sampling.mousemove = mousemoveWait;
        }
        mirror.reset();
        const maskInputOptions = maskAllInputs === true ? {
          color: true,
          date: true,
          "datetime-local": true,
          email: true,
          month: true,
          number: true,
          range: true,
          search: true,
          tel: true,
          text: true,
          time: true,
          url: true,
          week: true,
          textarea: true,
          select: true,
          password: true
        } : _maskInputOptions !== void 0 ? _maskInputOptions : { password: true };
        const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === "all" ? {
          script: true,
          comment: true,
          headFavicon: true,
          headWhitespace: true,
          headMetaSocial: true,
          headMetaRobots: true,
          headMetaHttpEquiv: true,
          headMetaVerification: true,
          headMetaAuthorship: _slimDOMOptions === "all",
          headMetaDescKeywords: _slimDOMOptions === "all"
        } : _slimDOMOptions ? _slimDOMOptions : {};
        polyfill();
        let lastFullSnapshotEvent;
        let incrementalSnapshotCount = 0;
        const eventProcessor = (e2) => {
          for (const plugin of plugins || []) {
            if (plugin.eventProcessor) {
              e2 = plugin.eventProcessor(e2);
            }
          }
          if (packFn) {
            e2 = packFn(e2);
          }
          return e2;
        };
        wrappedEmit = (e2, isCheckout) => {
          var _a2;
          if (((_a2 = mutationBuffers[0]) === null || _a2 === void 0 ? void 0 : _a2.isFrozen()) && e2.type !== EventType.FullSnapshot && !(e2.type === EventType.IncrementalSnapshot && e2.data.source === IncrementalSource.Mutation)) {
            mutationBuffers.forEach((buf) => buf.unfreeze());
          }
          if (inEmittingFrame) {
            emit === null || emit === void 0 ? void 0 : emit(eventProcessor(e2), isCheckout);
          } else if (passEmitsToParent) {
            const message2 = {
              type: "rrweb",
              event: eventProcessor(e2),
              isCheckout
            };
            window.parent.postMessage(message2, "*");
          }
          if (e2.type === EventType.FullSnapshot) {
            lastFullSnapshotEvent = e2;
            incrementalSnapshotCount = 0;
          } else if (e2.type === EventType.IncrementalSnapshot) {
            if (e2.data.source === IncrementalSource.Mutation && e2.data.isAttachIframe) {
              return;
            }
            incrementalSnapshotCount++;
            const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
            const exceedTime = checkoutEveryNms && e2.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
            if (exceedCount || exceedTime) {
              takeFullSnapshot(true);
            }
          }
        };
        const wrappedMutationEmit = (m2) => {
          wrappedEmit(wrapEvent({
            type: EventType.IncrementalSnapshot,
            data: Object.assign({ source: IncrementalSource.Mutation }, m2)
          }));
        };
        const wrappedScrollEmit = (p) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.Scroll }, p)
        }));
        const wrappedCanvasMutationEmit = (p) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.CanvasMutation }, p)
        }));
        const wrappedAdoptedStyleSheetEmit = (a2) => wrappedEmit(wrapEvent({
          type: EventType.IncrementalSnapshot,
          data: Object.assign({ source: IncrementalSource.AdoptedStyleSheet }, a2)
        }));
        const stylesheetManager = new StylesheetManager({
          mutationCb: wrappedMutationEmit,
          adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit
        });
        const iframeManager = new IframeManager({
          mirror,
          mutationCb: wrappedMutationEmit,
          stylesheetManager,
          recordCrossOriginIframes,
          wrappedEmit
        });
        for (const plugin of plugins || []) {
          if (plugin.getMirror)
            plugin.getMirror({
              nodeMirror: mirror,
              crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
              crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror
            });
        }
        canvasManager = new CanvasManager({
          recordCanvas,
          mutationCb: wrappedCanvasMutationEmit,
          win: window,
          blockClass,
          blockSelector,
          mirror,
          sampling: sampling.canvas,
          dataURLOptions
        });
        const shadowDomManager = new ShadowDomManager({
          mutationCb: wrappedMutationEmit,
          scrollCb: wrappedScrollEmit,
          bypassOptions: {
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            inlineStylesheet,
            maskInputOptions,
            dataURLOptions,
            maskTextFn,
            maskInputFn,
            recordCanvas,
            inlineImages,
            sampling,
            slimDOMOptions,
            iframeManager,
            stylesheetManager,
            canvasManager,
            keepIframeSrcFn
          },
          mirror
        });
        takeFullSnapshot = (isCheckout = false) => {
          var _a2, _b2, _c, _d, _e, _f;
          wrappedEmit(wrapEvent({
            type: EventType.Meta,
            data: {
              href: window.location.href,
              width: getWindowWidth(),
              height: getWindowHeight()
            }
          }), isCheckout);
          stylesheetManager.reset();
          mutationBuffers.forEach((buf) => buf.lock());
          const node2 = snapshot(document, {
            mirror,
            blockClass,
            blockSelector,
            maskTextClass,
            maskTextSelector,
            inlineStylesheet,
            maskAllInputs: maskInputOptions,
            maskTextFn,
            slimDOM: slimDOMOptions,
            dataURLOptions,
            recordCanvas,
            inlineImages,
            onSerialize: (n2) => {
              if (isSerializedIframe(n2, mirror)) {
                iframeManager.addIframe(n2);
              }
              if (isSerializedStylesheet(n2, mirror)) {
                stylesheetManager.trackLinkElement(n2);
              }
              if (hasShadowRoot(n2)) {
                shadowDomManager.addShadowRoot(n2.shadowRoot, document);
              }
            },
            onIframeLoad: (iframe, childSn) => {
              iframeManager.attachIframe(iframe, childSn);
              shadowDomManager.observeAttachShadow(iframe);
            },
            onStylesheetLoad: (linkEl, childSn) => {
              stylesheetManager.attachLinkElement(linkEl, childSn);
            },
            keepIframeSrcFn
          });
          if (!node2) {
            return console.warn("Failed to snapshot the document");
          }
          wrappedEmit(wrapEvent({
            type: EventType.FullSnapshot,
            data: {
              node: node2,
              initialOffset: {
                left: window.pageXOffset !== void 0 ? window.pageXOffset : (document === null || document === void 0 ? void 0 : document.documentElement.scrollLeft) || ((_b2 = (_a2 = document === null || document === void 0 ? void 0 : document.body) === null || _a2 === void 0 ? void 0 : _a2.parentElement) === null || _b2 === void 0 ? void 0 : _b2.scrollLeft) || ((_c = document === null || document === void 0 ? void 0 : document.body) === null || _c === void 0 ? void 0 : _c.scrollLeft) || 0,
                top: window.pageYOffset !== void 0 ? window.pageYOffset : (document === null || document === void 0 ? void 0 : document.documentElement.scrollTop) || ((_e = (_d = document === null || document === void 0 ? void 0 : document.body) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.scrollTop) || ((_f = document === null || document === void 0 ? void 0 : document.body) === null || _f === void 0 ? void 0 : _f.scrollTop) || 0
              }
            }
          }));
          mutationBuffers.forEach((buf) => buf.unlock());
          if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0)
            stylesheetManager.adoptStyleSheets(document.adoptedStyleSheets, mirror.getId(document));
        };
        try {
          const handlers = [];
          handlers.push(on("DOMContentLoaded", () => {
            wrappedEmit(wrapEvent({
              type: EventType.DomContentLoaded,
              data: {}
            }));
          }));
          const observe = (doc) => {
            var _a2;
            return initObservers({
              mutationCb: wrappedMutationEmit,
              mousemoveCb: (positions, source) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: {
                  source,
                  positions
                }
              })),
              mouseInteractionCb: (d2) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource.MouseInteraction }, d2)
              })),
              scrollCb: wrappedScrollEmit,
              viewportResizeCb: (d2) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource.ViewportResize }, d2)
              })),
              inputCb: (v2) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource.Input }, v2)
              })),
              mediaInteractionCb: (p) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource.MediaInteraction }, p)
              })),
              styleSheetRuleCb: (r2) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource.StyleSheetRule }, r2)
              })),
              styleDeclarationCb: (r2) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource.StyleDeclaration }, r2)
              })),
              canvasMutationCb: wrappedCanvasMutationEmit,
              fontCb: (p) => wrappedEmit(wrapEvent({
                type: EventType.IncrementalSnapshot,
                data: Object.assign({ source: IncrementalSource.Font }, p)
              })),
              selectionCb: (p) => {
                wrappedEmit(wrapEvent({
                  type: EventType.IncrementalSnapshot,
                  data: Object.assign({ source: IncrementalSource.Selection }, p)
                }));
              },
              blockClass,
              ignoreClass,
              maskTextClass,
              maskTextSelector,
              maskInputOptions,
              inlineStylesheet,
              sampling,
              recordCanvas,
              inlineImages,
              userTriggeredOnInput,
              collectFonts,
              doc,
              maskInputFn,
              maskTextFn,
              keepIframeSrcFn,
              blockSelector,
              slimDOMOptions,
              dataURLOptions,
              mirror,
              iframeManager,
              stylesheetManager,
              shadowDomManager,
              canvasManager,
              ignoreCSSAttributes,
              plugins: ((_a2 = plugins === null || plugins === void 0 ? void 0 : plugins.filter((p) => p.observer)) === null || _a2 === void 0 ? void 0 : _a2.map((p) => ({
                observer: p.observer,
                options: p.options,
                callback: (payload) => wrappedEmit(wrapEvent({
                  type: EventType.Plugin,
                  data: {
                    plugin: p.name,
                    payload
                  }
                }))
              }))) || []
            }, hooks);
          };
          iframeManager.addLoadListener((iframeEl) => {
            handlers.push(observe(iframeEl.contentDocument));
          });
          const init = () => {
            takeFullSnapshot();
            handlers.push(observe(document));
            recording = true;
          };
          if (document.readyState === "interactive" || document.readyState === "complete") {
            init();
          } else {
            handlers.push(on("load", () => {
              wrappedEmit(wrapEvent({
                type: EventType.Load,
                data: {}
              }));
              init();
            }, window));
          }
          return () => {
            handlers.forEach((h2) => h2());
            recording = false;
          };
        } catch (error) {
          console.warn(error);
        }
      }
      record.addCustomEvent = (tag, payload) => {
        if (!recording) {
          throw new Error("please add custom event after start recording");
        }
        wrappedEmit(wrapEvent({
          type: EventType.Custom,
          data: {
            tag,
            payload
          }
        }));
      };
      record.freezePage = () => {
        mutationBuffers.forEach((buf) => buf.freeze());
      };
      record.takeFullSnapshot = (isCheckout) => {
        if (!recording) {
          throw new Error("please take full snapshot after start recording");
        }
        takeFullSnapshot(isCheckout);
      };
      record.mirror = mirror;
      var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
      var fleb = new u8([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        0,
        /* unused */
        0,
        0,
        /* impossible */
        0
      ]);
      var fdeb = new u8([
        0,
        0,
        0,
        0,
        1,
        1,
        2,
        2,
        3,
        3,
        4,
        4,
        5,
        5,
        6,
        6,
        7,
        7,
        8,
        8,
        9,
        9,
        10,
        10,
        11,
        11,
        12,
        12,
        13,
        13,
        /* unused */
        0,
        0
      ]);
      var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
      var freb = function(eb, start) {
        var b2 = new u16(31);
        for (var i2 = 0; i2 < 31; ++i2) {
          b2[i2] = start += 1 << eb[i2 - 1];
        }
        var r2 = new u32(b2[30]);
        for (var i2 = 1; i2 < 30; ++i2) {
          for (var j2 = b2[i2]; j2 < b2[i2 + 1]; ++j2) {
            r2[j2] = j2 - b2[i2] << 5 | i2;
          }
        }
        return [b2, r2];
      };
      var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
      fl[28] = 258, revfl[258] = 28;
      var _b = freb(fdeb, 0), revfd = _b[1];
      var rev = new u16(32768);
      for (var i = 0; i < 32768; ++i) {
        var x = (i & 43690) >>> 1 | (i & 21845) << 1;
        x = (x & 52428) >>> 2 | (x & 13107) << 2;
        x = (x & 61680) >>> 4 | (x & 3855) << 4;
        rev[i] = ((x & 65280) >>> 8 | (x & 255) << 8) >>> 1;
      }
      var hMap = function(cd, mb, r2) {
        var s2 = cd.length;
        var i2 = 0;
        var l2 = new u16(mb);
        for (; i2 < s2; ++i2)
          ++l2[cd[i2] - 1];
        var le = new u16(mb);
        for (i2 = 0; i2 < mb; ++i2) {
          le[i2] = le[i2 - 1] + l2[i2 - 1] << 1;
        }
        var co;
        if (r2) {
          co = new u16(1 << mb);
          var rvb = 15 - mb;
          for (i2 = 0; i2 < s2; ++i2) {
            if (cd[i2]) {
              var sv = i2 << 4 | cd[i2];
              var r_1 = mb - cd[i2];
              var v2 = le[cd[i2] - 1]++ << r_1;
              for (var m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2) {
                co[rev[v2] >>> rvb] = sv;
              }
            }
          }
        } else {
          co = new u16(s2);
          for (i2 = 0; i2 < s2; ++i2)
            co[i2] = rev[le[cd[i2] - 1]++] >>> 15 - cd[i2];
        }
        return co;
      };
      var flt = new u8(288);
      for (var i = 0; i < 144; ++i)
        flt[i] = 8;
      for (var i = 144; i < 256; ++i)
        flt[i] = 9;
      for (var i = 256; i < 280; ++i)
        flt[i] = 7;
      for (var i = 280; i < 288; ++i)
        flt[i] = 8;
      var fdt = new u8(32);
      for (var i = 0; i < 32; ++i)
        fdt[i] = 5;
      var flm = /* @__PURE__ */ hMap(flt, 9, 0);
      var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
      var shft = function(p) {
        return (p / 8 >> 0) + (p & 7 && 1);
      };
      var slc = function(v2, s2, e2) {
        if (s2 == null || s2 < 0)
          s2 = 0;
        if (e2 == null || e2 > v2.length)
          e2 = v2.length;
        var n2 = new (v2 instanceof u16 ? u16 : v2 instanceof u32 ? u32 : u8)(e2 - s2);
        n2.set(v2.subarray(s2, e2));
        return n2;
      };
      var wbits = function(d2, p, v2) {
        v2 <<= p & 7;
        var o2 = p / 8 >> 0;
        d2[o2] |= v2;
        d2[o2 + 1] |= v2 >>> 8;
      };
      var wbits16 = function(d2, p, v2) {
        v2 <<= p & 7;
        var o2 = p / 8 >> 0;
        d2[o2] |= v2;
        d2[o2 + 1] |= v2 >>> 8;
        d2[o2 + 2] |= v2 >>> 16;
      };
      var hTree = function(d2, mb) {
        var t2 = [];
        for (var i2 = 0; i2 < d2.length; ++i2) {
          if (d2[i2])
            t2.push({ s: i2, f: d2[i2] });
        }
        var s2 = t2.length;
        var t22 = t2.slice();
        if (!s2)
          return [new u8(0), 0];
        if (s2 == 1) {
          var v2 = new u8(t2[0].s + 1);
          v2[t2[0].s] = 1;
          return [v2, 1];
        }
        t2.sort(function(a2, b2) {
          return a2.f - b2.f;
        });
        t2.push({ s: -1, f: 25001 });
        var l2 = t2[0], r2 = t2[1], i0 = 0, i1 = 1, i22 = 2;
        t2[0] = { s: -1, f: l2.f + r2.f, l: l2, r: r2 };
        while (i1 != s2 - 1) {
          l2 = t2[t2[i0].f < t2[i22].f ? i0++ : i22++];
          r2 = t2[i0 != i1 && t2[i0].f < t2[i22].f ? i0++ : i22++];
          t2[i1++] = { s: -1, f: l2.f + r2.f, l: l2, r: r2 };
        }
        var maxSym = t22[0].s;
        for (var i2 = 1; i2 < s2; ++i2) {
          if (t22[i2].s > maxSym)
            maxSym = t22[i2].s;
        }
        var tr = new u16(maxSym + 1);
        var mbt = ln(t2[i1 - 1], tr, 0);
        if (mbt > mb) {
          var i2 = 0, dt = 0;
          var lft = mbt - mb, cst = 1 << lft;
          t22.sort(function(a2, b2) {
            return tr[b2.s] - tr[a2.s] || a2.f - b2.f;
          });
          for (; i2 < s2; ++i2) {
            var i2_1 = t22[i2].s;
            if (tr[i2_1] > mb) {
              dt += cst - (1 << mbt - tr[i2_1]);
              tr[i2_1] = mb;
            } else
              break;
          }
          dt >>>= lft;
          while (dt > 0) {
            var i2_2 = t22[i2].s;
            if (tr[i2_2] < mb)
              dt -= 1 << mb - tr[i2_2]++ - 1;
            else
              ++i2;
          }
          for (; i2 >= 0 && dt; --i2) {
            var i2_3 = t22[i2].s;
            if (tr[i2_3] == mb) {
              --tr[i2_3];
              ++dt;
            }
          }
          mbt = mb;
        }
        return [new u8(tr), mbt];
      };
      var ln = function(n2, l2, d2) {
        return n2.s == -1 ? Math.max(ln(n2.l, l2, d2 + 1), ln(n2.r, l2, d2 + 1)) : l2[n2.s] = d2;
      };
      var lc = function(c2) {
        var s2 = c2.length;
        while (s2 && !c2[--s2])
          ;
        var cl = new u16(++s2);
        var cli = 0, cln = c2[0], cls = 1;
        var w2 = function(v2) {
          cl[cli++] = v2;
        };
        for (var i2 = 1; i2 <= s2; ++i2) {
          if (c2[i2] == cln && i2 != s2)
            ++cls;
          else {
            if (!cln && cls > 2) {
              for (; cls > 138; cls -= 138)
                w2(32754);
              if (cls > 2) {
                w2(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
                cls = 0;
              }
            } else if (cls > 3) {
              w2(cln), --cls;
              for (; cls > 6; cls -= 6)
                w2(8304);
              if (cls > 2)
                w2(cls - 3 << 5 | 8208), cls = 0;
            }
            while (cls--)
              w2(cln);
            cls = 1;
            cln = c2[i2];
          }
        }
        return [cl.subarray(0, cli), s2];
      };
      var clen = function(cf, cl) {
        var l2 = 0;
        for (var i2 = 0; i2 < cl.length; ++i2)
          l2 += cf[i2] * cl[i2];
        return l2;
      };
      var wfblk = function(out, pos, dat) {
        var s2 = dat.length;
        var o2 = shft(pos + 2);
        out[o2] = s2 & 255;
        out[o2 + 1] = s2 >>> 8;
        out[o2 + 2] = out[o2] ^ 255;
        out[o2 + 3] = out[o2 + 1] ^ 255;
        for (var i2 = 0; i2 < s2; ++i2)
          out[o2 + i2 + 4] = dat[i2];
        return (o2 + 4 + s2) * 8;
      };
      var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
        wbits(out, p++, final);
        ++lf[256];
        var _a2 = hTree(lf, 15), dlt = _a2[0], mlb = _a2[1];
        var _b2 = hTree(df, 15), ddt = _b2[0], mdb = _b2[1];
        var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
        var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
        var lcfreq = new u16(19);
        for (var i2 = 0; i2 < lclt.length; ++i2)
          lcfreq[lclt[i2] & 31]++;
        for (var i2 = 0; i2 < lcdt.length; ++i2)
          lcfreq[lcdt[i2] & 31]++;
        var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
        var nlcc = 19;
        for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
          ;
        var flen = bl + 5 << 3;
        var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
        var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
        if (flen <= ftlen && flen <= dtlen)
          return wfblk(out, p, dat.subarray(bs, bs + bl));
        var lm, ll, dm, dl;
        wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
        if (dtlen < ftlen) {
          lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
          var llm = hMap(lct, mlcb, 0);
          wbits(out, p, nlc - 257);
          wbits(out, p + 5, ndc - 1);
          wbits(out, p + 10, nlcc - 4);
          p += 14;
          for (var i2 = 0; i2 < nlcc; ++i2)
            wbits(out, p + 3 * i2, lct[clim[i2]]);
          p += 3 * nlcc;
          var lcts = [lclt, lcdt];
          for (var it = 0; it < 2; ++it) {
            var clct = lcts[it];
            for (var i2 = 0; i2 < clct.length; ++i2) {
              var len = clct[i2] & 31;
              wbits(out, p, llm[len]), p += lct[len];
              if (len > 15)
                wbits(out, p, clct[i2] >>> 5 & 127), p += clct[i2] >>> 12;
            }
          }
        } else {
          lm = flm, ll = flt, dm = fdm, dl = fdt;
        }
        for (var i2 = 0; i2 < li; ++i2) {
          if (syms[i2] > 255) {
            var len = syms[i2] >>> 18 & 31;
            wbits16(out, p, lm[len + 257]), p += ll[len + 257];
            if (len > 7)
              wbits(out, p, syms[i2] >>> 23 & 31), p += fleb[len];
            var dst = syms[i2] & 31;
            wbits16(out, p, dm[dst]), p += dl[dst];
            if (dst > 3)
              wbits16(out, p, syms[i2] >>> 5 & 8191), p += fdeb[dst];
          } else {
            wbits16(out, p, lm[syms[i2]]), p += ll[syms[i2]];
          }
        }
        wbits16(out, p, lm[256]);
        return p + ll[256];
      };
      var deo = /* @__PURE__ */ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
      var et = /* @__PURE__ */ new u8(0);
      var dflt = function(dat, lvl, plvl, pre, post, lst) {
        var s2 = dat.length;
        var o2 = new u8(pre + s2 + 5 * (1 + Math.floor(s2 / 7e3)) + post);
        var w2 = o2.subarray(pre, o2.length - post);
        var pos = 0;
        if (!lvl || s2 < 8) {
          for (var i2 = 0; i2 <= s2; i2 += 65535) {
            var e2 = i2 + 65535;
            if (e2 < s2) {
              pos = wfblk(w2, pos, dat.subarray(i2, e2));
            } else {
              w2[i2] = lst;
              pos = wfblk(w2, pos, dat.subarray(i2, s2));
            }
          }
        } else {
          var opt = deo[lvl - 1];
          var n2 = opt >>> 13, c2 = opt & 8191;
          var msk_1 = (1 << plvl) - 1;
          var prev2 = new u16(32768), head = new u16(msk_1 + 1);
          var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
          var hsh = function(i3) {
            return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
          };
          var syms = new u32(25e3);
          var lf = new u16(288), df = new u16(32);
          var lc_1 = 0, eb = 0, i2 = 0, li = 0, wi = 0, bs = 0;
          for (; i2 < s2; ++i2) {
            var hv = hsh(i2);
            var imod = i2 & 32767;
            var pimod = head[hv];
            prev2[imod] = pimod;
            head[hv] = imod;
            if (wi <= i2) {
              var rem = s2 - i2;
              if ((lc_1 > 7e3 || li > 24576) && rem > 423) {
                pos = wblk(dat, w2, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
                li = lc_1 = eb = 0, bs = i2;
                for (var j2 = 0; j2 < 286; ++j2)
                  lf[j2] = 0;
                for (var j2 = 0; j2 < 30; ++j2)
                  df[j2] = 0;
              }
              var l2 = 2, d2 = 0, ch_1 = c2, dif = imod - pimod & 32767;
              if (rem > 2 && hv == hsh(i2 - dif)) {
                var maxn = Math.min(n2, rem) - 1;
                var maxd = Math.min(32767, i2);
                var ml = Math.min(258, rem);
                while (dif <= maxd && --ch_1 && imod != pimod) {
                  if (dat[i2 + l2] == dat[i2 + l2 - dif]) {
                    var nl = 0;
                    for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                      ;
                    if (nl > l2) {
                      l2 = nl, d2 = dif;
                      if (nl > maxn)
                        break;
                      var mmd = Math.min(dif, nl - 2);
                      var md = 0;
                      for (var j2 = 0; j2 < mmd; ++j2) {
                        var ti = i2 - dif + j2 + 32768 & 32767;
                        var pti = prev2[ti];
                        var cd = ti - pti + 32768 & 32767;
                        if (cd > md)
                          md = cd, pimod = ti;
                      }
                    }
                  }
                  imod = pimod, pimod = prev2[imod];
                  dif += imod - pimod + 32768 & 32767;
                }
              }
              if (d2) {
                syms[li++] = 268435456 | revfl[l2] << 18 | revfd[d2];
                var lin = revfl[l2] & 31, din = revfd[d2] & 31;
                eb += fleb[lin] + fdeb[din];
                ++lf[257 + lin];
                ++df[din];
                wi = i2 + l2;
                ++lc_1;
              } else {
                syms[li++] = dat[i2];
                ++lf[dat[i2]];
              }
            }
          }
          pos = wblk(dat, w2, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
          if (!lst)
            pos = wfblk(w2, pos, et);
        }
        return slc(o2, 0, pre + shft(pos) + post);
      };
      var adler = function() {
        var a2 = 1, b2 = 0;
        return {
          p: function(d2) {
            var n2 = a2, m2 = b2;
            var l2 = d2.length;
            for (var i2 = 0; i2 != l2; ) {
              var e2 = Math.min(i2 + 5552, l2);
              for (; i2 < e2; ++i2)
                n2 += d2[i2], m2 += n2;
              n2 %= 65521, m2 %= 65521;
            }
            a2 = n2, b2 = m2;
          },
          d: function() {
            return (a2 >>> 8 << 16 | (b2 & 255) << 8 | b2 >>> 8) + ((a2 & 255) << 23) * 2;
          }
        };
      };
      var dopt = function(dat, opt, pre, post, st) {
        return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 12 + opt.mem, pre, post, !st);
      };
      var wbytes = function(d2, b2, v2) {
        for (; v2; ++b2)
          d2[b2] = v2, v2 >>>= 8;
      };
      var zlh = function(c2, o2) {
        var lv = o2.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
        c2[0] = 120, c2[1] = fl2 << 6 | (fl2 ? 32 - 2 * fl2 : 1);
      };
      function zlibSync(data, opts) {
        if (opts === void 0) {
          opts = {};
        }
        var a2 = adler();
        a2.p(data);
        var d2 = dopt(data, opts, 2, 4);
        return zlh(d2, opts), wbytes(d2, d2.length - 4, a2.d()), d2;
      }
      function strToU8(str, latin1) {
        var l2 = str.length;
        if (!latin1 && typeof TextEncoder != "undefined")
          return new TextEncoder().encode(str);
        var ar = new u8(str.length + (str.length >>> 1));
        var ai = 0;
        var w2 = function(v2) {
          ar[ai++] = v2;
        };
        for (var i2 = 0; i2 < l2; ++i2) {
          if (ai + 5 > ar.length) {
            var n2 = new u8(ai + 8 + (l2 - i2 << 1));
            n2.set(ar);
            ar = n2;
          }
          var c2 = str.charCodeAt(i2);
          if (c2 < 128 || latin1)
            w2(c2);
          else if (c2 < 2048)
            w2(192 | c2 >>> 6), w2(128 | c2 & 63);
          else if (c2 > 55295 && c2 < 57344)
            c2 = 65536 + (c2 & 1023 << 10) | str.charCodeAt(++i2) & 1023, w2(240 | c2 >>> 18), w2(128 | c2 >>> 12 & 63), w2(128 | c2 >>> 6 & 63), w2(128 | c2 & 63);
          else
            w2(224 | c2 >>> 12), w2(128 | c2 >>> 6 & 63), w2(128 | c2 & 63);
        }
        return slc(ar, 0, ai);
      }
      function strFromU8(dat, latin1) {
        var r2 = "";
        if (!latin1 && typeof TextDecoder != "undefined")
          return new TextDecoder().decode(dat);
        for (var i2 = 0; i2 < dat.length; ) {
          var c2 = dat[i2++];
          if (c2 < 128 || latin1)
            r2 += String.fromCharCode(c2);
          else if (c2 < 224)
            r2 += String.fromCharCode((c2 & 31) << 6 | dat[i2++] & 63);
          else if (c2 < 240)
            r2 += String.fromCharCode((c2 & 15) << 12 | (dat[i2++] & 63) << 6 | dat[i2++] & 63);
          else
            c2 = ((c2 & 15) << 18 | (dat[i2++] & 63) << 12 | (dat[i2++] & 63) << 6 | dat[i2++] & 63) - 65536, r2 += String.fromCharCode(55296 | c2 >> 10, 56320 | c2 & 1023);
        }
        return r2;
      }
      const MARK = "v1";
      const pack = (event) => {
        const _e = Object.assign(Object.assign({}, event), { v: MARK });
        return strFromU8(zlibSync(strToU8(JSON.stringify(_e))), true);
      };
      class StackFrame {
        constructor(obj) {
          this.fileName = obj.fileName || "";
          this.functionName = obj.functionName || "";
          this.lineNumber = obj.lineNumber;
          this.columnNumber = obj.columnNumber;
        }
        toString() {
          const lineNumber = this.lineNumber || "";
          const columnNumber = this.columnNumber || "";
          if (this.functionName)
            return `${this.functionName} (${this.fileName}:${lineNumber}:${columnNumber})`;
          return `${this.fileName}:${lineNumber}:${columnNumber}`;
        }
      }
      const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
      const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
      const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
      const ErrorStackParser = {
        parse: function(error) {
          if (!error) {
            return [];
          }
          if (typeof error.stacktrace !== "undefined" || typeof error["opera#sourceloc"] !== "undefined") {
            return this.parseOpera(error);
          } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
            return this.parseV8OrIE(error);
          } else if (error.stack) {
            return this.parseFFOrSafari(error);
          } else {
            throw new Error("Cannot parse given Error object");
          }
        },
        extractLocation: function(urlLike) {
          if (urlLike.indexOf(":") === -1) {
            return [urlLike];
          }
          const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
          const parts = regExp.exec(urlLike.replace(/[()]/g, ""));
          if (!parts)
            throw new Error(`Cannot parse given url: ${urlLike}`);
          return [parts[1], parts[2] || void 0, parts[3] || void 0];
        },
        parseV8OrIE: function(error) {
          const filtered = error.stack.split("\n").filter(function(line2) {
            return !!line2.match(CHROME_IE_STACK_REGEXP);
          }, this);
          return filtered.map(function(line2) {
            if (line2.indexOf("(eval ") > -1) {
              line2 = line2.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(\),.*$)/g, "");
            }
            let sanitizedLine = line2.replace(/^\s+/, "").replace(/\(eval code/g, "(");
            const location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);
            sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
            const tokens = sanitizedLine.split(/\s+/).slice(1);
            const locationParts = this.extractLocation(location ? location[1] : tokens.pop());
            const functionName = tokens.join(" ") || void 0;
            const fileName = ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1 ? void 0 : locationParts[0];
            return new StackFrame({
              functionName,
              fileName,
              lineNumber: locationParts[1],
              columnNumber: locationParts[2]
            });
          }, this);
        },
        parseFFOrSafari: function(error) {
          const filtered = error.stack.split("\n").filter(function(line2) {
            return !line2.match(SAFARI_NATIVE_CODE_REGEXP);
          }, this);
          return filtered.map(function(line2) {
            if (line2.indexOf(" > eval") > -1) {
              line2 = line2.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
            }
            if (line2.indexOf("@") === -1 && line2.indexOf(":") === -1) {
              return new StackFrame({
                functionName: line2
              });
            } else {
              const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
              const matches = line2.match(functionNameRegex);
              const functionName = matches && matches[1] ? matches[1] : void 0;
              const locationParts = this.extractLocation(line2.replace(functionNameRegex, ""));
              return new StackFrame({
                functionName,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2]
              });
            }
          }, this);
        },
        parseOpera: function(e2) {
          if (!e2.stacktrace || e2.message.indexOf("\n") > -1 && e2.message.split("\n").length > e2.stacktrace.split("\n").length) {
            return this.parseOpera9(e2);
          } else if (!e2.stack) {
            return this.parseOpera10(e2);
          } else {
            return this.parseOpera11(e2);
          }
        },
        parseOpera9: function(e2) {
          const lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
          const lines = e2.message.split("\n");
          const result = [];
          for (let i2 = 2, len = lines.length; i2 < len; i2 += 2) {
            const match = lineRE.exec(lines[i2]);
            if (match) {
              result.push(new StackFrame({
                fileName: match[2],
                lineNumber: parseFloat(match[1])
              }));
            }
          }
          return result;
        },
        parseOpera10: function(e2) {
          const lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
          const lines = e2.stacktrace.split("\n");
          const result = [];
          for (let i2 = 0, len = lines.length; i2 < len; i2 += 2) {
            const match = lineRE.exec(lines[i2]);
            if (match) {
              result.push(new StackFrame({
                functionName: match[3] || void 0,
                fileName: match[2],
                lineNumber: parseFloat(match[1])
              }));
            }
          }
          return result;
        },
        parseOpera11: function(error) {
          const filtered = error.stack.split("\n").filter(function(line2) {
            return !!line2.match(FIREFOX_SAFARI_STACK_REGEXP) && !line2.match(/^Error created at/);
          }, this);
          return filtered.map(function(line2) {
            const tokens = line2.split("@");
            const locationParts = this.extractLocation(tokens.pop());
            const functionCall = tokens.shift() || "";
            const functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || void 0;
            return new StackFrame({
              functionName,
              fileName: locationParts[0],
              lineNumber: locationParts[1],
              columnNumber: locationParts[2]
            });
          }, this);
        }
      };
      function pathToSelector(node2) {
        if (!node2 || !node2.outerHTML) {
          return "";
        }
        let path = "";
        while (node2.parentElement) {
          let name = node2.localName;
          if (!name) {
            break;
          }
          name = name.toLowerCase();
          const parent = node2.parentElement;
          const domSiblings = [];
          if (parent.children && parent.children.length > 0) {
            for (let i2 = 0; i2 < parent.children.length; i2++) {
              const sibling = parent.children[i2];
              if (sibling.localName && sibling.localName.toLowerCase) {
                if (sibling.localName.toLowerCase() === name) {
                  domSiblings.push(sibling);
                }
              }
            }
          }
          if (domSiblings.length > 1) {
            name += `:eq(${domSiblings.indexOf(node2)})`;
          }
          path = name + (path ? ">" + path : "");
          node2 = parent;
        }
        return path;
      }
      function isObject(obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
      }
      function isObjTooDeep(obj, limit) {
        if (limit === 0) {
          return true;
        }
        const keys2 = Object.keys(obj);
        for (const key2 of keys2) {
          if (isObject(obj[key2]) && isObjTooDeep(obj[key2], limit - 1)) {
            return true;
          }
        }
        return false;
      }
      function stringify(obj, stringifyOptions) {
        const options = {
          numOfKeysLimit: 50,
          depthOfLimit: 4
        };
        Object.assign(options, stringifyOptions);
        const stack = [];
        const keys2 = [];
        return JSON.stringify(obj, function(key2, value) {
          if (stack.length > 0) {
            const thisPos = stack.indexOf(this);
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
            ~thisPos ? keys2.splice(thisPos, Infinity, key2) : keys2.push(key2);
            if (~stack.indexOf(value)) {
              if (stack[0] === value) {
                value = "[Circular ~]";
              } else {
                value = "[Circular ~." + keys2.slice(0, stack.indexOf(value)).join(".") + "]";
              }
            }
          } else {
            stack.push(value);
          }
          if (value === null)
            return value;
          if (value === void 0)
            return "undefined";
          if (shouldIgnore(value)) {
            return toString(value);
          }
          if (value instanceof Event) {
            const eventResult = {};
            for (const eventKey in value) {
              const eventValue = value[eventKey];
              if (Array.isArray(eventValue)) {
                eventResult[eventKey] = pathToSelector(eventValue.length ? eventValue[0] : null);
              } else {
                eventResult[eventKey] = eventValue;
              }
            }
            return eventResult;
          } else if (value instanceof Node) {
            if (value instanceof HTMLElement) {
              return value ? value.outerHTML : "";
            }
            return value.nodeName;
          } else if (value instanceof Error) {
            return value.stack ? value.stack + "\nEnd of stack for Error object" : value.name + ": " + value.message;
          }
          return value;
        });
        function shouldIgnore(_obj) {
          if (isObject(_obj) && Object.keys(_obj).length > options.numOfKeysLimit) {
            return true;
          }
          if (typeof _obj === "function") {
            return true;
          }
          if (isObject(_obj) && isObjTooDeep(_obj, options.depthOfLimit)) {
            return true;
          }
          return false;
        }
        function toString(_obj) {
          let str = _obj.toString();
          if (options.stringLengthLimit && str.length > options.stringLengthLimit) {
            str = `${str.slice(0, options.stringLengthLimit)}...`;
          }
          return str;
        }
      }
      const defaultLogOptions = {
        level: [
          "assert",
          "clear",
          "count",
          "countReset",
          "debug",
          "dir",
          "dirxml",
          "error",
          "group",
          "groupCollapsed",
          "groupEnd",
          "info",
          "log",
          "table",
          "time",
          "timeEnd",
          "timeLog",
          "trace",
          "warn"
        ],
        lengthThreshold: 1e3,
        logger: "console"
      };
      function initLogObserver(cb, win, options) {
        const logOptions = options ? Object.assign({}, defaultLogOptions, options) : defaultLogOptions;
        const loggerType = logOptions.logger;
        if (!loggerType) {
          return () => {
          };
        }
        let logger;
        if (typeof loggerType === "string") {
          logger = win[loggerType];
        } else {
          logger = loggerType;
        }
        let logCount = 0;
        const cancelHandlers = [];
        if (logOptions.level.includes("error")) {
          if (window) {
            const errorHandler = (event) => {
              const message2 = event.message, error = event.error;
              const trace = ErrorStackParser.parse(error).map((stackFrame) => stackFrame.toString());
              const payload = [stringify(message2, logOptions.stringifyOptions)];
              cb({
                level: "error",
                trace,
                payload
              });
            };
            window.addEventListener("error", errorHandler);
            cancelHandlers.push(() => {
              if (window)
                window.removeEventListener("error", errorHandler);
            });
          }
        }
        for (const levelType of logOptions.level) {
          cancelHandlers.push(replace2(logger, levelType));
        }
        return () => {
          cancelHandlers.forEach((h2) => h2());
        };
        function replace2(_logger, level) {
          if (!_logger[level]) {
            return () => {
            };
          }
          return patch$1(_logger, level, (original) => {
            return (...args) => {
              original.apply(this, args);
              try {
                const trace = ErrorStackParser.parse(new Error()).map((stackFrame) => stackFrame.toString()).splice(1);
                const payload = args.map((s2) => stringify(s2, logOptions.stringifyOptions));
                logCount++;
                if (logCount < logOptions.lengthThreshold) {
                  cb({
                    level,
                    trace,
                    payload
                  });
                } else if (logCount === logOptions.lengthThreshold) {
                  cb({
                    level: "warn",
                    trace: [],
                    payload: [
                      stringify("The number of log records reached the threshold.")
                    ]
                  });
                }
              } catch (error) {
                original("rrweb logger error:", error, ...args);
              }
            };
          });
        }
      }
      const PLUGIN_NAME = "rrweb/console@1";
      const getRecordConsolePlugin = (options) => ({
        name: PLUGIN_NAME,
        observer: initLogObserver,
        options
      });
      function patch(source, name, replacement) {
        try {
          if (!(name in source)) {
            return () => {
            };
          }
          const original = source[name];
          const wrapped = replacement(original);
          if (typeof wrapped === "function") {
            wrapped.prototype = wrapped.prototype || {};
            Object.defineProperties(wrapped, {
              __rrweb_original__: {
                enumerable: false,
                value: original
              }
            });
          }
          source[name] = wrapped;
          return () => {
            source[name] = original;
          };
        } catch (_a2) {
          return () => {
          };
        }
      }
      function findLast(array, predicate) {
        const length2 = array.length;
        for (let i2 = length2 - 1; i2 >= 0; i2 -= 1) {
          if (predicate(array[i2])) {
            return array[i2];
          }
        }
      }
      const defaultNetworkOptions = {
        initiatorTypes: [
          "audio",
          "beacon",
          "body",
          "css",
          "early-hint",
          "embed",
          "fetch",
          "frame",
          "iframe",
          "icon",
          "image",
          "img",
          "input",
          "link",
          "navigation",
          "object",
          "ping",
          "script",
          "track",
          "video",
          "xmlhttprequest"
        ],
        ignoreRequestFn: () => false,
        recordHeaders: false,
        recordBody: false,
        recordInitialRequests: false
      };
      const isNavigationTiming = (entry) => entry.entryType === "navigation";
      const isResourceTiming = (entry) => entry.entryType === "resource";
      function initPerformanceObserver(cb, win, options) {
        if (options.recordInitialRequests) {
          const initialPerformanceEntries = win.performance.getEntries().filter(
            (entry) => isNavigationTiming(entry) || isResourceTiming(entry) && options.initiatorTypes.includes(
              entry.initiatorType
            )
          );
          cb({
            requests: initialPerformanceEntries.map((entry) => ({
              url: entry.name,
              initiatorType: entry.initiatorType,
              status: "responseStatus" in entry ? entry.responseStatus : void 0,
              startTime: Math.round(entry.startTime),
              endTime: Math.round(entry.responseEnd)
            })),
            isInitial: true
          });
        }
        const observer = new win.PerformanceObserver((entries) => {
          const performanceEntries = entries.getEntries().filter(
            (entry) => isNavigationTiming(entry) || isResourceTiming(entry) && options.initiatorTypes.includes(
              entry.initiatorType
            ) && entry.initiatorType !== "xmlhttprequest" && entry.initiatorType !== "fetch"
          );
          cb({
            requests: performanceEntries.map((entry) => ({
              url: entry.name,
              initiatorType: entry.initiatorType,
              status: "responseStatus" in entry ? entry.responseStatus : void 0,
              startTime: Math.round(entry.startTime),
              endTime: Math.round(entry.responseEnd)
            }))
          });
        });
        observer.observe({ entryTypes: ["navigation", "resource"] });
        return () => {
          observer.disconnect();
        };
      }
      function shouldRecordHeaders(type, recordHeaders) {
        return !!recordHeaders && (typeof recordHeaders === "boolean" || recordHeaders[type]);
      }
      function shouldRecordBody(type, recordBody, headers) {
        function matchesContentType(contentTypes) {
          const contentTypeHeader = Object.keys(headers).find(
            (key2) => key2.toLowerCase() === "content-type"
          );
          const contentType = contentTypeHeader && headers[contentTypeHeader];
          return contentTypes.some((ct) => contentType == null ? void 0 : contentType.includes(ct));
        }
        if (!recordBody)
          return false;
        if (typeof recordBody === "boolean")
          return true;
        if (Array.isArray(recordBody))
          return matchesContentType(recordBody);
        const recordBodyType = recordBody[type];
        if (typeof recordBodyType === "boolean")
          return recordBodyType;
        return matchesContentType(recordBodyType);
      }
      async function getRequestPerformanceEntry(win, initiatorType, url, after, before, attempt = 0) {
        if (attempt > 10) {
          throw new Error("Cannot find performance entry");
        }
        const urlPerformanceEntries = win.performance.getEntriesByName(
          url
        );
        const performanceEntry = findLast(
          urlPerformanceEntries,
          (entry) => isResourceTiming(entry) && entry.initiatorType === initiatorType && (!after || entry.startTime >= after) && (!before || entry.startTime <= before)
        );
        if (!performanceEntry) {
          await new Promise((resolve) => setTimeout(resolve, 50 * attempt));
          return getRequestPerformanceEntry(
            win,
            initiatorType,
            url,
            after,
            before,
            attempt + 1
          );
        }
        return performanceEntry;
      }
      function initXhrObserver(cb, win, options) {
        if (!options.initiatorTypes.includes("xmlhttprequest")) {
          return () => {
          };
        }
        const recordRequestHeaders = shouldRecordHeaders(
          "request",
          options.recordHeaders
        );
        const recordResponseHeaders = shouldRecordHeaders(
          "response",
          options.recordHeaders
        );
        const restorePatch = patch(
          win.XMLHttpRequest.prototype,
          "open",
          (originalOpen) => {
            return function(method, url, async = true, username, password) {
              const xhr = this;
              const req = new Request(url);
              const networkRequest = {};
              let after;
              let before;
              const requestHeaders = {};
              const originalSetRequestHeader = xhr.setRequestHeader.bind(xhr);
              xhr.setRequestHeader = (header, value) => {
                requestHeaders[header] = value;
                return originalSetRequestHeader(header, value);
              };
              if (recordRequestHeaders) {
                networkRequest.requestHeaders = requestHeaders;
              }
              const originalSend = xhr.send.bind(xhr);
              xhr.send = (body) => {
                if (shouldRecordBody("request", options.recordBody, requestHeaders)) {
                  if (body === void 0 || body === null) {
                    networkRequest.requestBody = null;
                  } else {
                    networkRequest.requestBody = body;
                  }
                }
                after = win.performance.now();
                return originalSend(body);
              };
              xhr.addEventListener("readystatechange", () => {
                if (xhr.readyState !== xhr.DONE) {
                  return;
                }
                before = win.performance.now();
                const responseHeaders = {};
                const rawHeaders = xhr.getAllResponseHeaders();
                const headers = rawHeaders.trim().split(/[\r\n]+/);
                headers.forEach((line2) => {
                  const parts = line2.split(": ");
                  const header = parts.shift();
                  const value = parts.join(": ");
                  if (header) {
                    responseHeaders[header] = value;
                  }
                });
                if (recordResponseHeaders) {
                  networkRequest.responseHeaders = responseHeaders;
                }
                if (shouldRecordBody("response", options.recordBody, responseHeaders)) {
                  if (xhr.response === void 0 || xhr.response === null) {
                    networkRequest.responseBody = null;
                  } else {
                    networkRequest.responseBody = xhr.response;
                  }
                }
                getRequestPerformanceEntry(
                  win,
                  "xmlhttprequest",
                  req.url,
                  after,
                  before
                ).then((entry) => {
                  const request = {
                    url: entry.name,
                    method: req.method,
                    initiatorType: entry.initiatorType,
                    status: xhr.status,
                    startTime: Math.round(entry.startTime),
                    endTime: Math.round(entry.responseEnd),
                    requestHeaders: networkRequest.requestHeaders,
                    requestBody: networkRequest.requestBody,
                    responseHeaders: networkRequest.responseHeaders,
                    responseBody: networkRequest.responseBody
                  };
                  cb({ requests: [request] });
                }).catch(() => {
                });
              });
              originalOpen.call(xhr, method, url, async, username, password);
            };
          }
        );
        return () => {
          restorePatch();
        };
      }
      function initFetchObserver(cb, win, options) {
        if (!options.initiatorTypes.includes("fetch")) {
          return () => {
          };
        }
        const recordRequestHeaders = shouldRecordHeaders(
          "request",
          options.recordHeaders
        );
        const recordResponseHeaders = shouldRecordHeaders(
          "response",
          options.recordHeaders
        );
        const restorePatch = patch(win, "fetch", (originalFetch) => {
          return async function(url, init) {
            const req = new Request(url, init);
            let res;
            const networkRequest = {};
            let after;
            let before;
            try {
              const requestHeaders = {};
              req.headers.forEach((value, header) => {
                requestHeaders[header] = value;
              });
              if (recordRequestHeaders) {
                networkRequest.requestHeaders = requestHeaders;
              }
              if (shouldRecordBody("request", options.recordBody, requestHeaders)) {
                if (!init || init.body === void 0 || init.body === null) {
                  networkRequest.requestBody = null;
                } else {
                  networkRequest.requestBody = init.body;
                }
              }
              after = win.performance.now();
              res = await originalFetch(req);
              before = win.performance.now();
              const responseHeaders = {};
              res.headers.forEach((value, header) => {
                responseHeaders[header] = value;
              });
              if (recordResponseHeaders) {
                networkRequest.responseHeaders = responseHeaders;
              }
              if (shouldRecordBody("response", options.recordBody, responseHeaders)) {
                let body;
                try {
                  body = await res.clone().text();
                } catch {
                }
                if (res.body === void 0 || res.body === null) {
                  networkRequest.responseBody = null;
                } else {
                  networkRequest.responseBody = body;
                }
              }
              return res;
            } finally {
              getRequestPerformanceEntry(win, "fetch", req.url, after, before).then((entry) => {
                const request = {
                  url: entry.name,
                  method: req.method,
                  initiatorType: entry.initiatorType,
                  status: res == null ? void 0 : res.status,
                  startTime: Math.round(entry.startTime),
                  endTime: Math.round(entry.responseEnd),
                  requestHeaders: networkRequest.requestHeaders,
                  requestBody: networkRequest.requestBody,
                  responseHeaders: networkRequest.responseHeaders,
                  responseBody: networkRequest.responseBody
                };
                cb({ requests: [request] });
              }).catch(() => {
              });
            }
          };
        });
        return () => {
          restorePatch();
        };
      }
      function initNetworkObserver(callback, win, options) {
        if (!("performance" in win)) {
          return () => {
          };
        }
        const networkOptions = options ? Object.assign({}, defaultNetworkOptions, options) : defaultNetworkOptions;
        const cb = (data) => {
          const requests = data.requests.filter(
            (request) => !networkOptions.ignoreRequestFn(request)
          );
          if (requests.length > 0 || data.isInitial) {
            callback({ ...data, requests });
          }
        };
        const performanceObserver = initPerformanceObserver(cb, win, networkOptions);
        const xhrObserver = initXhrObserver(cb, win, networkOptions);
        const fetchObserver = initFetchObserver(cb, win, networkOptions);
        return () => {
          performanceObserver();
          xhrObserver();
          fetchObserver();
        };
      }
      const NETWORK_PLUGIN_NAME = "rrweb/network@1";
      const getRecordNetworkPlugin = (options) => ({
        name: NETWORK_PLUGIN_NAME,
        observer: initNetworkObserver,
        options
      });
      var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
      const ignoreRequestUrl = [
        "https://dc.fenqile.com/route0031/dataCollect/uploadWebDataSingleReport.json",
        "https://cs.fenqile.com/rc_oa_gateway/frontend/user/track/report.json",
        "https://cs.fenqile.com/rc_oa_gateway/frontend/report.json"
      ];
      class RrwebObserver {
        constructor() {
          __publicField(this, "stopFn", null);
          __publicField(this, "eventsMatrix", [[]]);
        }
        record(isRecordNetwork) {
          const recordOptions = {
            emit: (event, isCheckout) => {
              if (isCheckout) {
                this.eventsMatrix.push([]);
              }
              const lastEvents = this.eventsMatrix[this.eventsMatrix.length - 1];
              lastEvents.push(event);
            },
            sampling: {
              // 不录制鼠标移动事件
              mousemove: false,
              // 不录制鼠标交互事件
              mouseInteraction: false,
              // 设置滚动事件的触发频率
              scroll: 150,
              // 每 150ms 最多触发一次
              // set the interval of media interaction event
              media: 800,
              // 设置输入事件的录制时机
              input: "last"
              // 连续输入时，只录制最终值
            },
            packFn: pack,
            plugins: [
              getRecordConsolePlugin({
                level: ["info", "log", "warn", "error"],
                lengthThreshold: 1e4,
                stringifyOptions: {
                  stringLengthLimit: 1e3,
                  numOfKeysLimit: 100,
                  depthOfLimit: 1
                },
                logger: _unsafeWindow.console
              })
            ]
          };
          if (isRecordNetwork) {
            recordOptions.plugins.push(
              getRecordNetworkPlugin({
                initiatorTypes: ["fetch", "xmlhttprequest"],
                ignoreRequestFn: (request) => {
                  if (ignoreRequestUrl.includes(request.url)) {
                    return true;
                  }
                  return false;
                },
                recordHeaders: false,
                recordBody: true,
                recordInitialRequests: false
              })
            );
          }
          this.stopFn = record(recordOptions);
        }
        stop() {
          if (this.stopFn) {
            this.stopFn();
            this.stopFn = null;
          }
          const data = this.eventsMatrix[this.eventsMatrix.length - 1];
          this.eventsMatrix = [[]];
          return data;
        }
      }
      const saveJsonToFile = (data, fileName) => {
        const a2 = document.createElement("a");
        a2.style.visibility = "hidden";
        document.body.appendChild(a2);
        const blobs = new Blob([JSON.stringify(data)], {
          type: "data:application/json;charset=utf-8"
        });
        const objurl = URL.createObjectURL(blobs);
        a2.href = objurl;
        a2.download = fileName;
        a2.click();
        document.body.removeChild(a2);
      };
      const STATUS = {
        INIT: "init",
        RECORDING: "recording"
      };
      const _sfc_main$1 = vue.defineComponent({
        name: "RecordScreen",
        components: { FloatButtonGroup: FloatButton$1.Group, FloatButton: FloatButton$1, PoweroffOutlined: PoweroffOutlined$1, PlayCircleOutlined: PlayCircleOutlined$1 },
        props: {
          remove: {
            type: Function
          },
          recording: {
            type: Function
          }
        },
        setup(props) {
          const open = vue.ref(false);
          const recordRef = vue.ref();
          const currentBtnStatus = vue.ref(STATUS.INIT);
          const rrwebObserver = new RrwebObserver();
          const duration = vue.ref("00:00:00");
          let timerInterval = 0;
          const clearTimer = () => {
            timerInterval && clearInterval(timerInterval);
          };
          const startTimer = () => {
            let hour = 0;
            let minute = 0;
            let second = 0;
            let sum_time = 0;
            let interval = 0;
            duration.value = "00:00:00";
            clearTimer();
            const zero = (n2) => n2 < 10 ? `0${n2}` : n2;
            timerInterval = window.setInterval(() => {
              sum_time += 1e3;
              interval = Math.ceil(sum_time / 1e3);
              hour = zero(Math.floor(interval / 3600));
              minute = zero(Math.floor((interval - hour * 3600) / 60));
              second = zero(interval % 60);
              duration.value = `${hour}:${minute}:${second}`;
            }, 1e3);
          };
          const handleStart = (type) => {
            if (currentBtnStatus.value !== STATUS.INIT) {
              return;
            }
            currentBtnStatus.value = STATUS.RECORDING;
            props.recording && props.recording();
            rrwebObserver.record(type === 2);
            startTimer();
            open.value = false;
          };
          const handleEnd = () => {
            if (currentBtnStatus.value === STATUS.RECORDING) {
              const data = rrwebObserver.stop();
              const time = (/* @__PURE__ */ new Date()).getTime();
              saveJsonToFile(data, `record_rweb_${time}.json`);
              currentBtnStatus.value = STATUS.INIT;
              clearTimer();
              props.remove && props.remove();
            } else {
              message.warn("请先开启录制");
            }
          };
          vue.onMounted(() => {
            vue.nextTick(() => {
              const body = document.querySelector("body");
              if (body == null ? void 0 : body.append) {
                body.append(recordRef.value);
              }
            });
          });
          return {
            recordRef,
            currentBtnStatus,
            STATUS,
            handleStart,
            handleEnd,
            duration,
            open
          };
        }
      });
      const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key2, val] of props) {
          target[key2] = val;
        }
        return target;
      };
      const _hoisted_1 = {
        id: "rrweb-record-rc",
        class: "warp",
        ref: "recordRef"
      };
      function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_PlayCircleOutlined = vue.resolveComponent("PlayCircleOutlined");
        const _component_FloatButton = vue.resolveComponent("FloatButton");
        const _component_FloatButtonGroup = vue.resolveComponent("FloatButtonGroup");
        const _component_PoweroffOutlined = vue.resolveComponent("PoweroffOutlined");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          _ctx.currentBtnStatus === _ctx.STATUS.INIT ? (vue.openBlock(), vue.createBlock(_component_FloatButtonGroup, {
            key: 0,
            trigger: "hover",
            type: "primary",
            open: _ctx.open,
            "onUpdate:open": _cache[2] || (_cache[2] = ($event) => _ctx.open = $event)
          }, {
            icon: vue.withCtx(() => [
              vue.createVNode(_component_PlayCircleOutlined)
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(_component_FloatButton, {
                description: "Log录制",
                tooltip: "仅录制log数据，时间更长",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleStart(1))
              }),
              vue.createVNode(_component_FloatButton, {
                description: "完整录制",
                tooltip: "录制log+网络数据，数据更全",
                onClick: _cache[1] || (_cache[1] = ($event) => _ctx.handleStart(2))
              })
            ]),
            _: 1
          }, 8, ["open"])) : vue.createCommentVNode("", true),
          _ctx.currentBtnStatus === _ctx.STATUS.RECORDING ? (vue.openBlock(), vue.createBlock(_component_FloatButton, {
            key: 1,
            onClick: _ctx.handleEnd,
            type: "primary",
            tooltip: `正在录制中${_ctx.duration}，点击结束录制`
          }, {
            icon: vue.withCtx(() => [
              vue.createVNode(_component_PoweroffOutlined)
            ]),
            _: 1
          }, 8, ["onClick", "tooltip"])) : vue.createCommentVNode("", true)
        ], 512);
      }
      const Record = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-dfa3bc59"]]);
      const _RecordScreen = class _RecordScreen {
        constructor(options = {}) {
          __publicField(this, "$options", {
            isLog: false,
            keydownChange: () => null
          });
          __publicField(this, "formModal", null);
          __publicField(this, "isRecording", false);
          /**
            * 键盘监听事件，如果是CTRL+ALT+Q 开启功能展示
            */
          __publicField(this, "hanndleEvent", ({ altKey, ctrlKey, key: key2 }) => {
            if (ctrlKey && altKey && (key2 === "Q" || key2 === "q") && !this.isRecording) {
              this.dynamicCreateView();
            }
          });
          __publicField(this, "dynamicCreateView", () => {
            var _a2;
            if (!this.formModal) {
              const container = document.createElement("div");
              const remove = () => {
                this.isRecording = false;
                this.setLogStatus(false);
                this.formModal = null;
                vue.render(null, container);
                container.remove();
              };
              const recording2 = () => {
                this.isRecording = true;
                this.setLogStatus(true);
              };
              this.formModal = vue.createVNode(Record, { remove, recording: recording2 });
              vue.render(this.formModal, container);
            } else {
              (_a2 = this.formModal.props) == null ? void 0 : _a2.remove();
            }
          });
          this.$options = { ...this.$options, ...options };
          window.addEventListener("keydown", this.hanndleEvent);
        }
        /**
         * 初始化实例
         */
        static init(options) {
          if (!this.instance) {
            this.instance = new _RecordScreen(options);
          }
          return this.instance;
        }
        isLog() {
          return this.$options.isLog;
        }
        setLogStatus(isLog) {
          this.$options.isLog = isLog;
        }
      };
      __publicField(_RecordScreen, "instance");
      let RecordScreen = _RecordScreen;
      const _sfc_main = /* @__PURE__ */ vue.defineComponent({
        __name: "App",
        setup(__props) {
          RecordScreen.init();
          return () => {
          };
        }
      });
      vue.createApp(_sfc_main).mount(
        (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })()
      );
    }
  });
  require_main_001();

})(Vue);
